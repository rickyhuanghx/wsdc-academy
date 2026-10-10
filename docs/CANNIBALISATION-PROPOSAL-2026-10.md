# Keyword cannibalisation proposal (October 2026)

**Status: DRAFT for owner approval. No code has changed.** Audit row 24.

Five groups of pages compete for the same queries. For each group, one page is the
keeper for the head term. Every other page is either 301-redirected into the keeper
(its unique sections move there first) or kept with a clearly different angle and a
descriptive in-body link to the keeper.

Before doing anything, pull the GSC Performance report (query + page) for each group.
If GSC shows a different page already winning the head term, swap the keeper to match.
Google has already picked that page, so don't fight it.

## Summary table

| # | Group (head term) | Keeper | Other page | Action | Why |
|---|---|---|---|---|---|
| 1 | Speaker roles ("first/second/third speaker world schools debate") | `/blog/first-speaker-world-schools-debate`, `/blog/second-speaker-…`, `/blog/third-speaker-world-schools-debate` | `/resources/first-speaker-cheat-sheet`, `/resources/second-speaker-cheat-sheet`, `/resources/third-speaker-cheat-sheet` | Differentiate + link | Explainer intent and printable intent are different searches. Cheat sheets lead every title and H1 with "cheat sheet / printable", stop explaining the role, and open with "New to the role? Read the full guide" linking to the matching post. Each post links to its sheet as "print the cheat sheet". |
| 2 | Online classes ("online debate classes") | `/online-debate-classes` | `/blog/best-online-debate-classes` | **301** to `/online-debate-classes` | A short post (about 900 words of source) whose title nearly matches the landing page ("…Online Debate Classes for Kids & Teens"). It splits signals with the money page. Move its "four things that separate real training" checklist into the landing page as a "How to choose" section first. |
| 2 | | | `/blog/best-world-schools-debate-classes` | Differentiate + link | Different query ("world schools debate classes/camps"). Keep the map of where WS is taught. Link to `/online-debate-classes` and `/programs/foundations` with descriptive anchors. Drop any "online debate classes" phrasing from its title and H1. |
| 2 | | | `/programs/foundations` | Keep (product page) + link | It targets "online debate classes for beginners" (`metaTitle`) and is the thing people buy. The landing page links to it as "beginner class", and Foundation links back to the category page once. Neither copies the other's intro. |
| 3 | Tournaments ("world schools debate tournaments") | `/world-schools-debate-tournaments` | `/blog/world-schools-debate-tournaments` | **301** to `/world-schools-debate-tournaments` | Exact slug collision with the directory. Move its unique "how to build a season" planning section into the directory page first, and move its international opens into the international post. |
| 3 | | | `/blog/international-world-schools-tournaments` | Differentiate + link | Different scope: tournaments outside North America (WSDC, EuroSDC, Istanbul, Zagreb, Prague). Title and H1 stay "International…". Link to the North American directory, and have the directory link back as "international World Schools tournaments". |
| 3 | | | `/tournaments` | Differentiate + link | Transactional intent: events WSDC Prep runs or partners on, with registration. Keep "Dates & Registration" framing and link once to the full circuit directory. Don't list third-party circuit events here. |
| 4 | Motions ("debate motions / debate topics") | `/motions` (+ `/debate-topics` for "topics") | `/resources/practice-motions` | **301** to `/resources/motion-types` | 40 hand-picked motions by type overlap the 12,000-motion bank and the types page. Fold each block of 10 into the matching type section on `/resources/motion-types`, then redirect. |
| 4 | | | `/resources/motion-types` | Differentiate + link | Owns "types of debate motions" (policy, value, actor, regret), not "debate motions". After the merge, each type section links to the explorer filtered by that type (`/motions?type=…`). |
| 4 | | | `/blog/debate-motion-trends` | Keep + link | A unique data story (30 years of motion trends). Not a motion list. It already sits on a different query; just make sure it links to `/motions` with "search the motion bank" and never uses "debate motions" alone as its H1. |
| 5 | Judging ("world schools debate judging") | `/world-schools-debate-judging` | `/resources/judging-ballot` | Differentiate + link | Ballot or score-sheet intent is a separate search. Its title currently opens with the guide's exact head term ("World Schools Debate Judging Ballot…"). Lead with "ballot" and "score sheet", keep the calibration notes short, and link to the guide for how 40/40/20 works. The guide links to the ballot as "printable judging ballot". |

## Notes for execution (once approved)

- **Redirects:** add to `next.config.ts` `redirects()` as `permanent: true`. Put them there, not in `netlify.toml`, for the same reason headers go in `next.config.ts`. Remove the redirected URLs from `src/data/blog.ts` / `src/data/resources.ts` so they drop out of the sitemap, `llms.txt`, and the blog/resources indexes.
- **Internal links:** grep `src/` for every redirected path and point in-body links at the new target directly. Don't link through a 301.
- **Title or H1 changes** in the "differentiate" rows are proposals only. CLAUDE.md treats metadata as owner-controlled, so each new title gets owner sign-off before it ships. Keep the title (≤ ~46 chars + template) and description (130–160) length rules.
- **Merges move content first, then redirect.** A section that exists only on the page being removed must survive on the keeper.
- **After deploy:** run `npm run seo-lint`, ping IndexNow for the keepers and the redirected URLs, and re-check GSC for the head terms after 4–6 weeks.
