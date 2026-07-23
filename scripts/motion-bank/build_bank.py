#!/usr/bin/env python3
"""Rebuild the motion bank data files.

Inputs (this directory):
  - hm_motions.csv          The MIT-licensed hello-motions dataset. If missing, download:
      curl -sL https://raw.githubusercontent.com/jessicayung/hello-motions/master/hello-motions-flask/motions_with_category_labels_clean.csv -o hm_motions.csv
  - wsdc_champ_motions.json Worlds motions 1994-2025 (official WSDC motion archive sheet)
  - recent_motions.json     2022+ motions harvested from Tabbycat tab APIs (calicotab)

Outputs (committed):
  - src/data/motion-bank.json            full dataset, imported by server pages
  - public/motion-bank-core.json         client explorer data, no info slides
  - public/motion-bank-infoslides.json   info slides keyed by motion id

To refresh with a new season: re-run the Tabbycat harvest into recent_motions.json
(append, the script dedupes), update wsdc_champ_motions.json after Worlds, run this
script, then update hardcoded "12,000+" counts in metadata if a threshold is crossed.
"""
import csv, json, re, sys, unicodedata, hashlib
from collections import Counter

import os
SRC = os.path.dirname(os.path.abspath(__file__))

TOPIC_MAP = {
    'International Relations': 'international-relations',
    'Social Movements': 'social-movements',
    'Feminism': 'feminism',
    'Security, War, Military and Terrorism': 'war-and-security',
    'Security, War and Military': 'war-and-security',
    'Terrorism': 'war-and-security',
    'Politics': 'politics',
    'Economics and development': 'economics',
    'Economics': 'economics',
    'Development': 'economics',
    'Medical Ethics': 'medical-ethics',
    'Criminal Justice System': 'criminal-justice',
    'Religion': 'religion',
    'Education': 'education',
    'Art and Culture': 'arts-and-culture',
    'Funny': 'arts-and-culture',
    'Morality': 'ethics-and-philosophy',
    'The Human Experience': 'ethics-and-philosophy',
    'Media': 'media-and-technology',
    'Science and Technology': 'media-and-technology',
    'Sports': 'sports',
    'LGBT+': 'lgbt',
    'Business': 'economics',
    'Environment': 'environment',
    'Family': 'family-and-relationships',
    'Social Policy': 'politics',
    'Minority Communities': 'social-movements',
    'Freedoms': 'politics',
}

CIRCUIT_MAP = {
    'Asia': 'Asia', 'Europe': 'Europe', 'IoNA': 'Britain & Ireland',
    'North America and Canada': 'North America', 'North American and Canada': 'North America',
    'North America': 'North America', 'Europe and IONA': 'Europe',
    'International': 'International', 'Australia and New Zealand': 'Australia & NZ',
    'Australia': 'Australia & NZ', 'Africa': 'Africa',
    'Latin America and the Carribean': 'Latin America', 'Latin America and the Caribbean': 'Latin America',
    'Europe ': 'Europe', '': '',
}

def clean_text(s):
    if not s: return ''
    s = unicodedata.normalize('NFC', s)
    s = s.replace('‘', "'").replace('’', "'").replace('“', '"').replace('”', '"')
    s = s.replace('ΤΗΒΤ', 'THBT').replace('ΤΗW', 'THW')
    s = re.sub(r'\bthis wouse\b', 'This House', s, flags=re.I)
    s = re.sub(r'\s+', ' ', s).strip()
    # strip fully-wrapping quotes
    if len(s) > 2 and s[0] == '"' and s[-1] == '"' and '"' not in s[1:-1]:
        s = s[1:-1].strip()
    return s

def norm_key(m):
    k = m.lower().strip().rstrip('.').strip()
    k = re.sub(r'[^a-z0-9 ]', '', k)
    k = re.sub(r'\s+', ' ', k)
    # normalize abbreviation variants
    k = re.sub(r'^this house believes that', 'thbt', k)
    k = re.sub(r'^this house believes', 'thbt', k)
    k = re.sub(r'^this house would', 'thw', k)
    k = re.sub(r'^this house supports', 'ths', k)
    k = re.sub(r'^this house opposes', 'tho', k)
    k = re.sub(r'^this house regrets', 'thr', k)
    k = re.sub(r'^this house prefers', 'thp', k)
    k = re.sub(r'^this house', 'th', k)
    return k

def classify_type(m):
    x = m.lower().strip()
    # strip a scene-setting preamble ("In democracies, ..." / "During WWII: ...")
    core = re.sub(r'^[^,:]{0,90}[,:]\s*(?=(th|this house))', '', x)
    if re.match(r'^as (a|an|the|prominent|post)', x) and re.search(r'\b(thw|ths|thbt|tho|thr|this house)\b', x):
        return 'actor'
    if re.match(r'^(thr\b|this house regrets)', core): return 'regret'
    if re.match(r'^(th|this house)\s*,?\s*as\b', core): return 'actor'
    if re.match(r'^(thw\b|this house (would|will))', core): return 'policy'
    if re.match(r'^(thbt\b|thb\b|this house believes)', core): return 'value'
    if re.match(r'^(ths\b|tho\b|thp\b|this house (supports|opposes|prefers|celebrates|welcomes))', core): return 'value'
    if re.match(r'^(th|the house|this house) (does not regret|regrets)', core): return 'regret'
    if re.match(r'^(th|the house|this house) (condemns|celebrates|supports|opposes|welcomes|prefers|is |believes)', core): return 'value'
    if re.match(r'^(th|the house|this house) (would|will)\b', core): return 'policy'
    return 'other'

JUNK_RE = re.compile(r'^(round\s|motions?\s*(tba|:)?$|tba\b|n/?a$|https?://|test\b|\d+$)', re.I)

def looks_like_motion(m):
    if len(m) < 15 or len(m) > 600: return False
    if len(m.split()) < 3: return False
    if JUNK_RE.match(m): return False
    return True

records = []
seen = {}

def add(motion, infoslide, year, tournament, rnd, circuit, topics, source, intl=False, wsdc_round_type=None):
    motion = clean_text(motion)
    infoslide = clean_text(infoslide or '')
    if not looks_like_motion(motion): return 'rejected'
    key = norm_key(motion)
    if key in seen:
        prev = records[seen[key]]
        # enrich: keep infoslide if missing; mark wsdc if new source is wsdc
        if infoslide and not prev.get('i'): prev['i'] = infoslide
        if source == 'wsdc': prev['w'] = 1
        if topics and not prev.get('top'): prev['top'] = topics
        return 'dupe'
    rec = {'m': motion, 'y': year, 't': clean_text(tournament), 'r': clean_text(str(rnd)) if rnd else '',
           'c': circuit, 'top': topics, 'ty': classify_type(motion)}
    if infoslide: rec['i'] = infoslide
    if source == 'wsdc': rec['w'] = 1
    if intl: rec['intl'] = 1
    seen[key] = len(records)
    records.append(rec)
    return 'added'

stats = Counter()

# 1. hello-motions CSV
with open(f'{SRC}/hm_motions.csv') as f:
    for row in csv.DictReader(f):
        year = None
        if row['Date'] and re.match(r'^(19|20)\d\d', row['Date']):
            year = int(row['Date'][:4])
        topic_raw = (row['Topic_Area_1'] or row['Topic_Area_Automated'] or '').strip()
        topics = []
        for col in ('Topic_Area_1', 'Topic_Area_2', 'Topic_Area_3', 'Topic_Area_Automated'):
            t = (row[col] or '').strip()
            slug = TOPIC_MAP.get(t)
            if slug and slug not in topics: topics.append(slug)
        circuit = CIRCUIT_MAP.get(row['Circuit'], row['Circuit'].strip())
        tourn = row['Tournament']
        is_wsdc = bool(re.match(r'^WSDC \d{4}$', tourn.strip()))
        stats['csv_' + add(row['Motion'], row['Infoslide'], year, tourn, row['Round'], circuit,
                           topics, 'wsdc' if is_wsdc else 'hm', intl=row['International'] == '1')] += 1

# 2. WSDC championship motions (agent output), if present
try:
    with open(f'{SRC}/wsdc_champ_motions.json') as f:
        wsdc = json.load(f)
    for m in wsdc['motions']:
        rnd = m.get('round') or ''
        mtype = m.get('type')
        if mtype in ('prepared', 'impromptu') and mtype not in rnd.lower():
            rnd = (rnd + f' ({mtype})').strip()
        stats['wsdc_' + add(m['motion'], m.get('infoslide'), m.get('year'), f"WSDC {m.get('year')}",
                            rnd, 'International', [], 'wsdc', intl=True)] += 1
except FileNotFoundError:
    print('NOTE: wsdc_champ_motions.json not found yet', file=sys.stderr)

# 3. Recent motions 2022+ (agent output), if present
try:
    with open(f'{SRC}/recent_motions.json') as f:
        recent = json.load(f)
    for m in recent['motions']:
        d = str(m.get('date') or '')
        year = int(d[:4]) if re.match(r'^(19|20)\d\d', d) else None
        circuit = CIRCUIT_MAP.get(m.get('circuit', ''), m.get('circuit') or '')
        tourn = m.get('tournament') or ''
        is_wsdc = bool(re.match(r'^WSDC \d{4}$', tourn.strip()))
        stats['recent_' + add(m['motion'], m.get('infoslide'), year, tourn, m.get('round'), circuit,
                              [], 'wsdc' if is_wsdc else 'recent', intl=bool(m.get('international')))] += 1
except FileNotFoundError:
    print('NOTE: recent_motions.json not found yet', file=sys.stderr)

# Keyword fallback topic tagging for untagged records
KEYWORD_TOPICS = [
    ('feminism', r'\b(feminis|women|gender quota|patriarch|sexis|#metoo|abortion|misogyn)'),
    ('war-and-security', r'\b(military|war\b|nuclear weapon|army|terroris|drone strike|nato|invasion|soldier)'),
    ('international-relations', r'\b(united nations|\bun\b|foreign policy|sanctions|diplomac|sovereign|international communit|\beu\b|european union)'),
    ('criminal-justice', r'\b(prison|sentenc|criminal|police|policing|jury|incarcerat|death penalty|parole)'),
    ('economics', r'\b(tax|economy|economic|wage|trade|market|capitalis|subsid|currency|bank)'),
    ('medical-ethics', r'\b(euthanasia|organ|vaccin|medical|doctor|patient|healthcare|clinical)'),
    ('education', r'\b(school|universit|education|student|teacher|curriculum|exam)'),
    ('religion', r'\b(religio|church|god\b|islam|christian|faith|secular)'),
    ('media-and-technology', r'\b(social media|internet|algorithm|artificial intelligence|\bai\b|data|journalis|news|platform)'),
    ('environment', r'\b(climate|environment|carbon|fossil|renewable|wildlife|conservation)'),
    ('sports', r'\b(sport|athlete|olympic|football|doping)'),
    ('lgbt', r'\b(lgbt|same.sex|transgender|queer|gay\b)'),
    ('arts-and-culture', r'\b(art\b|artist|museum|music|film|celebrit|cultur)'),
    ('politics', r'\b(democra|vote|voting|election|politic|parliament|president)'),
    ('ethics-and-philosophy', r'\b(moral|ethic|virtue|justice\b|philosoph)'),
]
for rec in records:
    if not rec['top']:
        low = rec['m'].lower()
        for slug, pat in KEYWORD_TOPICS:
            if re.search(pat, low):
                rec['top'] = [slug]
                break
        else:
            rec['top'] = []

# assign ids
for i, rec in enumerate(records):
    rec['id'] = i

print(dict(stats))
print('TOTAL RECORDS:', len(records))
print('by year:', sorted(Counter(r['y'] for r in records if r['y']).items()))
print('untagged topic:', sum(1 for r in records if not r['top']))
print('by type:', Counter(r['ty'] for r in records))
print('wsdc champ motions:', sum(1 for r in records if r.get('w')))
print('with infoslide:', sum(1 for r in records if r.get('i')))

print('distinct tournaments:', len(set(r['t'] for r in records if r['t'])))

REPO = os.path.dirname(os.path.dirname(SRC))
out = {'motions': records}
with open(f'{REPO}/src/data/motion-bank.json', 'w') as f:
    json.dump(out, f, ensure_ascii=False, separators=(',', ':'))
# client split: core (infoslide flag only) + infoslides keyed by id
core = []
slides = {}
for r in records:
    c = {k: v for k, v in r.items() if k != 'i'}
    if r.get('i'):
        c['hi'] = 1
        slides[str(r['id'])] = r['i']
    core.append(c)
with open(f'{REPO}/public/motion-bank-core.json', 'w') as f:
    json.dump({'motions': core}, f, ensure_ascii=False, separators=(',', ':'))
with open(f'{REPO}/public/motion-bank-infoslides.json', 'w') as f:
    json.dump(slides, f, ensure_ascii=False, separators=(',', ':'))
import os
for p in (f'{REPO}/src/data/motion-bank.json', f'{REPO}/public/motion-bank-core.json', f'{REPO}/public/motion-bank-infoslides.json'):
    print(p, os.path.getsize(p))
