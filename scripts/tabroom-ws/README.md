# Tabroom World Schools scan

Builds `src/data/ws-circuit-2026-27.json`, the data behind the tournament
directory on `/blog/world-schools-debate-tournaments` and the calendar feed at
`/world-schools-tournaments.ics`.

What it does (all public pages, polite pacing, ~25 minutes end to end):

1. **Sweep** every Tabroom calendar page for North America: each US state and
   Canadian province plus the online time-zone "states" (EDT, CDT, PDT, MST),
   for `year=2026` (the 2025-26 season) and `year=2027` (the 2026-27 season).
   Tabroom's calendar caps a single listing at 257 rows, which is why the sweep
   is per state; only CA, NY and TX for the *prior* season hit the cap.
2. **Scan** each tournament's `events.mhtml` page and keep those with a World
   Schools event (name matches `world schools`, `WSD`, `worlds schools`) or a
   "WSDC – Worlds Schools" circuit membership.
3. **Merge**: posted 2026-27 tournaments, prior-season hosts with no 2026-27
   posting yet (`expected`, projected dates = last year + 1), 2026-27 pages
   whose event list is still empty but whose prior edition ran WS
   (`events_pending`), and the UK TOC World Schools bid list scraped from
   ci.uky.edu (needs headless Chromium: the page sits behind an Anubis
   proof-of-work bot wall, `curl` gets the challenge page).

Run from the repo root:

```bash
python3 scripts/tabroom-ws/scan.py sweep     # ~10 min, writes master_calendar.json
python3 scripts/tabroom-ws/scan.py scan      # ~15 min, resumable, writes scan_cache.json
python3 scripts/tabroom-ws/scan.py toc       # needs `pip install playwright` + chromium
python3 scripts/tabroom-ws/scan.py merge     # writes src/data/ws-circuit-2026-27.json
```

Working files land in `scripts/tabroom-ws/work/` (gitignored). Re-run
`scan` + `merge` monthly during the season: hosts post their pages through
October, and the `expected` list should shrink to near zero by January.

Season boundaries live in `SEASON` at the top of `scan.py`; bump them each
August together with the output filename.
