#!/usr/bin/env python3
"""Tabroom World Schools scan. See README.md in this folder.

    python3 scripts/tabroom-ws/scan.py sweep | scan | toc | merge

All output lands in scripts/tabroom-ws/work/ except `merge`, which writes the
site data file. Only Python stdlib + curl; `toc` additionally needs playwright.
"""
import concurrent.futures as cf
import html
import json
import os
import re
import subprocess
import sys
import time

# ---- season config: bump every August ---------------------------------------
SEASON = {
    'label': '2026-27',
    # Tabroom "year" = season END year. 2027 = the 2026-27 season.
    'years': ['2026', '2027'],
    # sort keys look like "2026-38-30" (year-ISOweek-x). Season window for the
    # scan (prior season + current season, so recurring hosts can be projected).
    'scan_from': (2025, 30),
    'scan_to': (2027, 32),
    'current_from': (2026, 30),
    'output': 'src/data/ws-circuit-2026-27.json',
}

UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
HERE = os.path.dirname(os.path.abspath(__file__))
WORK = os.path.join(HERE, 'work')
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
os.makedirs(WORK, exist_ok=True)

ONLINE_STATES = {'CDT', 'EDT', 'PDT', 'MST', 'MDT', 'CST', 'EST', 'PST'}
WS_RE = re.compile(r'world\s*schools?|\bWSD\b|worlds\s*schools', re.I)


def wf(name):
    return os.path.join(WORK, name)


def curl(url, timeout=40):
    for attempt in range(3):
        r = subprocess.run(['curl', '-sL', '--max-time', str(timeout), '-A', UA, url], capture_output=True, text=True)
        if len(r.stdout) > 3000:
            return r.stdout
        time.sleep(2 + attempt * 2)
    return ''


def text_of(s):
    return html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', re.sub(r'<script.*?</script>|<style.*?</style>', '', s, flags=re.S))))


def parse_rows(page):
    out = {}
    for r in re.findall(r'<tr>(.*?)</tr>', page, re.S):
        m = re.search(r'tourn_id=(\d+)', r)
        if not m:
            continue
        tds = [html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', t))).strip() for t in re.findall(r'<td[^>]*>(.*?)</td>', r, re.S)]
        dt = re.search(r'data-text\s*=\s*"([^"]+)"', r)
        out[m.group(1)] = {'sort': dt.group(1) if dt else None, 'tds': tds}
    return out


def in_window(sort, lo, hi):
    m = re.match(r'(\d{4})-(\d+)-', sort or '')
    if not m:
        return False
    yw = (int(m.group(1)), int(m.group(2)))
    return lo <= yw <= hi


# ---- 1. sweep ---------------------------------------------------------------
def sweep():
    index = curl('https://www.tabroom.com/index/index.mhtml')
    m = re.search(r'<select[^>]*name\s*=\s*"state"[^>]*>(.*?)</select>', index, re.S)
    states = [a for a, _ in re.findall(r'<option[^>]*value="([^"]*)"[^>]*>([^<]*)', m.group(1)) if a and not a.startswith('AU-')]
    master = {}
    for st in states:
        for y in SEASON['years']:
            page = curl(f'https://www.tabroom.com/index/index.mhtml?state={st}&country=&circuit_id=&year={y}')
            rows = parse_rows(page)
            for tid, v in rows.items():
                v['state_q'] = st
                v['year_q'] = y
                master.setdefault(tid, v)
            print(st, y, len(rows), 'CAPPED' if len(rows) >= 257 else '', flush=True)
            time.sleep(0.4)
    json.dump(master, open(wf('master_calendar.json'), 'w'), indent=0)
    print('TOTAL', len(master))


# ---- 2. scan ----------------------------------------------------------------
def scan():
    master = json.load(open(wf('master_calendar.json')))
    cache_path = wf('scan_cache.json')
    cache = json.load(open(cache_path)) if os.path.exists(cache_path) else {}
    ids = [t for t, v in master.items() if in_window(v.get('sort'), SEASON['scan_from'], SEASON['scan_to'])]
    print('candidates', len(ids), 'cached', len(cache), flush=True)

    def fetch(tid):
        if tid in cache:
            return tid, cache[tid]
        page = curl(f'https://www.tabroom.com/index/tourn/events.mhtml?tourn_id={tid}')
        if not page:
            return tid, {'error': 'fetch failed'}
        events = [(eid, html.unescape(re.sub(r'\s+', ' ', nm)).strip()) for eid, nm in re.findall(r'event_id=(\d+)[^>]*>\s*([^<]{2,80})', page)]
        t = text_of(page)
        dates = re.search(r'Tournament Dates (.*?) Registration', t)
        return tid, {
            'events': events,
            'ws_events': [e for e in events if WS_RE.search(e[1])],
            'ws_circuit': bool(re.search(r'WSDC\s*[–-]\s*Worlds? Schools', t)),
            'dates': dates.group(1).strip() if dates else '',
        }

    done = 0
    with cf.ThreadPoolExecutor(max_workers=4) as ex:
        for tid, rec in ex.map(fetch, ids):
            cache[tid] = rec
            done += 1
            if done % 100 == 0:
                json.dump(cache, open(cache_path, 'w'))
                print('progress', done, '/', len(ids), flush=True)
    json.dump(cache, open(cache_path, 'w'))
    hits = sum(1 for t in ids if cache[t].get('ws_events') or cache[t].get('ws_circuit'))
    print('WS tournaments', hits, 'errors', sum(1 for t in ids if cache[t].get('error')))


# ---- 3. toc -----------------------------------------------------------------
def toc():
    from playwright.sync_api import sync_playwright  # type: ignore
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        pg = b.new_page(user_agent=UA)
        pg.goto('https://ci.uky.edu/debate/toc/bids/bid-tournaments', wait_until='domcontentloaded', timeout=60000)
        content = ''
        for _ in range(14):
            pg.wait_for_timeout(5000)
            content = pg.content()
            if 'Anubis' not in content:
                break
        b.close()
    i = content.rfind('World Schools Debate Championships')
    j = content.find('Connect with CI', i)
    tables = re.findall(r'<table.*?</table>', content[i:j], re.S)
    tiers = ['finals', 'semis', 'quarters']
    out = []
    for k, tb in enumerate(tables):
        for row in re.findall(r'<tr.*?</tr>', tb, re.S):
            cells = [html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', c))).strip() for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', row, re.S)]
            if not cells or cells[0] in ('Dates', 'Tournament Name'):
                continue
            while len(cells) < 4:
                cells.append('')
            out.append({'tier': tiers[k] if k < 3 else f'tier{k}', 'dates': cells[0], 'name': cells[1], 'host': cells[2], 'location': cells[3]})
    json.dump(out, open(wf('toc_ws_bids.json'), 'w'), indent=1)
    print('TOC WS bid rows', len(out))


# ---- 4. merge ---------------------------------------------------------------
# Tabroom names that read badly verbatim; keyed by the exact Tabroom string.
NAME_FIXES = {
    'NSDA 2027 NSDA Last Chance Qualifier NSDA Last Chance Qualifier': 'NSDA Last Chance Qualifier 2027',
    '2026 ELKINS HS 24TH ANNUAL SPEECH AND DEBATE TOURNAMENT': 'Elkins HS 24th Annual Speech and Debate Tournament',
    'ELSIK BLUE GRATITUDE SWING': 'Elsik Blue Gratitude Swing',
}

STOP = set('the at of and a an hosted by tfa nietoc toc iqt uil ncfl nsda online swing qualifier qualifying classic speech debate hs high school tournament invitational annual middle ms campus on in for st nd rd th'.split())
MON = {m: i for i, m in enumerate(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], 1)}


def toks(n):
    n = n.lower().replace("'", '').replace('’', '')
    n = re.sub(r'\b(20\d\d|\d+(st|nd|rd|th)?)\b', ' ', n)
    n = re.sub(r'[^a-z ]', ' ', n)
    return [t for t in n.split() if t not in STOP and len(t) > 1]


def sim(a, b):
    ta, tb = toks(a), toks(b)
    A, B = set(ta), set(tb)
    if not A or not B:
        return 0
    j = len(A & B) / len(A | B)
    head = 1.0 if len(ta) >= 2 and ta[:2] == tb[:2] else 0
    return max(j, head)


def classify(name, ws_events):
    n = name.lower()
    evs = ' '.join(ws_events)
    tags = []
    if re.search(r'middle school|\bms\b|\bmiddle\b', n) and not re.search(r'high|hs', n):
        tags.append('middle-school')
    if 'springboard' in n:
        tags.append('nsda-springboard-scrimmage')
    if re.search(r'practice|scrimmage|work ?call|novice night|closed|workshop|tutorial|runoff|district|draft', n) and 'springboard' not in n:
        tags.append('practice-or-closed')
    if 'camp' in n:
        tags.append('camp')
    if 'weeknight online rounds' in n:
        tags.append('weeknight-online-series')
    if re.search(r'novice', evs, re.I) and not re.search(r'varsity|open|championship|toc|gold|advanced', evs, re.I) and len(ws_events) == 1:
        tags.append('novice-only')
    return tags


def mode_of(city, state, name, ws_events):
    loc = f'{city} {state}'.lower()
    if re.search(r'online|nsda campus', loc) or state in ONLINE_STATES:
        return 'online'
    if 'online' in ' '.join(ws_events).lower() or 'online' in name.lower():
        return 'hybrid'
    return 'in-person'


def iso_range(dates, short, sort):
    m = re.match(r'([A-Z][a-z]{2}) (\d+) to ([A-Z][a-z]{2}) (\d+) (\d{4})', dates or '')
    if m:
        y = int(m.group(5))
        m1, d1, m2, d2 = MON[m.group(1)], int(m.group(2)), MON[m.group(3)], int(m.group(4))
        y1 = y if m1 <= m2 else y - 1
        return f'{y1:04d}-{m1:02d}-{d1:02d}', f'{y:04d}-{m2:02d}-{d2:02d}'
    m = re.match(r'([A-Z][a-z]{2}) (\d+) (\d{4})', dates or '')
    if m:
        x = f'{int(m.group(3)):04d}-{MON[m.group(1)]:02d}-{int(m.group(2)):02d}'
        return x, x
    y = int(sort.split('-')[0])
    parts = [p.strip() for p in short.split('-')]

    def conv(p):
        mm, dd = [int(x) for x in p.split('/')]
        return f'{y:04d}-{mm:02d}-{dd:02d}'
    return conv(parts[0]), conv(parts[-1])


def merge():
    master = json.load(open(wf('master_calendar.json')))
    cache = json.load(open(wf('scan_cache.json')))
    toc_rows = json.load(open(wf('toc_ws_bids.json'))) if os.path.exists(wf('toc_ws_bids.json')) else []
    cur_lo = SEASON['current_from']

    def is_current(v):
        return in_window(v.get('sort'), cur_lo, SEASON['scan_to'])

    ws = {t: dict(master[t], **cache[t]) for t in cache if t in master and (cache[t].get('ws_events') or cache[t].get('ws_circuit'))}
    cur = {t: v for t, v in ws.items() if is_current(v)}
    prev = {t: v for t, v in ws.items() if not is_current(v)}

    def best_toc(name):
        best = (0, None)
        for r in toc_rows:
            s = sim(name, r['name'])
            if s > best[0]:
                best = (s, r)
        return best[1] if best[0] >= 0.5 else None

    def label(state):
        return 'Online' if state in ONLINE_STATES else state

    posted = []
    for t, v in cur.items():
        name = NAME_FIXES.get(v['tds'][1], v['tds'][1])
        evs = [e[1] for e in v['ws_events']]
        tags = classify(name, evs)
        if 'practice-or-closed' in tags or 'camp' in tags or v['tds'][3] == 'EEST':
            continue
        tm = best_toc(name)
        a, b = iso_range(v.get('dates'), v['tds'][0], v['sort'])
        posted.append({
            'tourn_id': t, 'name': name, 'startDate': a, 'endDate': b, 'city': v['tds'][2].replace('milpitas', 'Milpitas').replace('Los angeles', 'Los Angeles').strip(), 'state': v['tds'][3],
            'stateLabel': label(v['tds'][3]), 'mode': mode_of(v['tds'][2], v['tds'][3], name, evs), 'reg_status': v['tds'][5],
            'ws_events': evs, 'ws_circuit': v['ws_circuit'], 'toc_tier': tm['tier'] if tm else '', 'toc_name': tm['name'] if tm else '',
            'tags': tags, 'url': f'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id={t}',
        })
    posted.sort(key=lambda r: (r['startDate'], r['name']))

    pending = []
    for t, v in master.items():
        if not is_current(v) or cache.get(t, {}).get('events'):
            continue
        for pt, pv in prev.items():
            if sim(v['tds'][1], pv['tds'][1]) >= 0.5:
                pending.append({'tourn_id': t, 'name': v['tds'][1], 'dates_short': v['tds'][0], 'city': v['tds'][2], 'state': v['tds'][3],
                                'prev_ws_events': [e[1] for e in pv['ws_events']], 'url': f'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id={t}'})
                break

    expected = []
    for t, v in prev.items():
        name = v['tds'][1]
        evs = [e[1] for e in v['ws_events']]
        tags = classify(name, evs)
        if any(x in tags for x in ('practice-or-closed', 'camp', 'nsda-springboard-scrimmage', 'weeknight-online-series')):
            continue
        if any(sim(name, r['name']) >= 0.5 for r in posted) or any(sim(name, p['name']) >= 0.5 for p in pending):
            continue
        tm = best_toc(name)
        y = int(v['sort'].split('-')[0]) + 1
        a, b = iso_range('', v['tds'][0], f'{y}-0-0')
        expected.append({
            'tourn_id_prev': t, 'name': name, 'dates_short_prev': v['tds'][0], 'projectedStart': a, 'projectedEnd': b,
            'city': v['tds'][2], 'state': v['tds'][3], 'stateLabel': label(v['tds'][3]), 'mode': mode_of(v['tds'][2], v['tds'][3], name, evs),
            'ws_events_prev': evs, 'toc_tier': tm['tier'] if tm else '', 'toc_name': tm['name'] if tm else '', 'tags': tags,
            'url_prev': f'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id={t}',
        })
    expected.sort(key=lambda r: (r['projectedStart'], r['name']))

    toc_unmatched = [r for r in toc_rows if not any(x['toc_name'] == r['name'] for x in posted)]
    out = {'generated': time.strftime('%Y-%m-%d'), 'season': SEASON['label'], 'posted': posted, 'expected': expected,
           'events_pending': pending, 'toc_bids': toc_rows, 'toc_unmatched': toc_unmatched}
    path = os.path.join(ROOT, SEASON['output'])
    json.dump(out, open(path, 'w'), indent=1)
    print('posted', len(posted), 'expected', len(expected), 'pending', len(pending), 'toc unmatched', len(toc_unmatched), '->', path)


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    {'sweep': sweep, 'scan': scan, 'toc': toc, 'merge': merge}.get(cmd, lambda: print(__doc__))()
