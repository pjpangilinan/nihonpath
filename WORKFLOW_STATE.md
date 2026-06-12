# Workflow State

## Status
Bug fixes applied. Duplicate kanji removed, missing script added, chart visual state fixed, combined tab selection preserved. Ready to test / deploy.

## Request
Build NihonPath — fully static GitHub Pages Japanese learning site. Hiragana, Katakana, Combined, Kanji (JLPT N5). TTS via Web Speech API. Sakura blossom progression. localStorage lifetime stats.

## Clarified Scope
- Tailwind CDN + vanilla JS (no React/Babel). User confirmed.
- Modular JS files (data.js, tts.js, progress.js, sakura.js, chart.js, quiz.js). User confirmed.
- Nav markup copy/paste per page (no JS injection). User confirmed.
- Rename dir to nihonpath. User confirmed.
- Both sakura modes: decorative falling (home) + progressive fill (quiz pages). User confirmed.

## Open Questions
- Kanji 100 dataset: sources from ref (30) + standard N5 list to complete. No blocker.
- Color palette: M3 sakura theme repeated as tailwind.config in each page. Matches ref pattern.

## Constraints
- GitHub Pages: static only, no build step, no backend
- Web Speech API (ja-JP) — voice quality varies by OS/browser
- session-based sakura (resets on nav), localStorage for lifetime stats
- Zero external paid APIs

## Plan
### Phase 1 — Scaffold
1. Rename `nihongo` → `nihonpath`
2. Create `css/`, `js/` dirs
3. Write `style.css` (sakura keyframes, washi texture, glass-panel, char grid)
4. Write `data.js` (71 hira + 71 kata + 100 kanji)
5. Write `tts.js` (speak fn, voice loading, fallback)
6. Write `progress.js` (localStorage get/update/accuracy)
7. Write `sakura.js` (decorative + progressive modes)
8. Write `chart.js` (render grid, toggle selection, row/select-all)
9. Write `quiz.js` (question flow, answer check, scoring, summary)

### Phase 2 — Pages
10. `index.html` — hero, 4 nav cards, progress dashboard
11. `hiragana.html` — chart + quiz + progressive sakura
12. `katakana.html` — same pattern
13. `combined.html` — dual-chart tabs + merged quiz
14. `kanji.html` — rotating 24/100 grid + romaji/meaning toggle

### Phase 3 — Ship
15. Git init, commit, push instructions for GitHub Pages

## Debate Notes
- Ref used Tailwind + vanilla JS. Plan said React/Babel. User picked ref approach — eliminates Babel overhead, simpler static site.
- Sakura: ref shows decorative falling petals (home). Plan said progressive fill (quiz). User wants both — sakura.js handles dual mode.

## Files To Change
- Rename: /home/rantiche/nihongo → nihonpath
- Create: css/style.css
- Create: js/data.js, js/tts.js, js/progress.js, js/sakura.js, js/chart.js, js/quiz.js
- Create: index.html, hiragana.html, katakana.html, combined.html, kanji.html
- Update: WORKFLOW_STATE.md (this file)

## Implementation Notes
- All pages load Tailwind via `cdn.tailwindcss.com` + inline `<script id="tailwind-config">` with M3 sakura palette
- Material Symbols + Google Fonts loaded in each page head
- Chart characters show romaji on hover (group-hover:opacity pattern from ref)
- Quiz answer matching: trim + lowercase input, split `romaji` on `/` or `,` for multi-reading kanji
- Mobile bottom nav bar: copy ref's rounded-t-xl with active pill style
- Kanji rotation: shuffle full 100, take 24, "Reshuffle Grid" re-randomizes

## Handoff Notes
- 2026-06-12: Scaffold complete. All 6 JS modules + 5 HTML pages + CSS written. Extra nihonpath.html (standalone kanji page, not in plan) removed. Git initialized, commit made. Next: push to GitHub Pages or continue with feature work.

## Bugs Fixed
1. **Duplicate kanji** `js/data.js:239` — "安" appeared twice (101 entries). Removed duplicate, added missing "車". Now 100 unique N5 kanji.
2. **Missing sakura.js** `index.html` — only loaded `progress.js`. `initSakura("decorative")` threw ReferenceError. Added `sakura.js` script tag.
3. **Select All/Clear visual bug** `js/chart.js` — `renderChart` created fresh internal `selected = new Set()` on re-render. Added `initialSelection` param, called `renderCards()` after init to apply visual state.
4. **Combined tab selection lost** `combined.html` — Tab switch re-rendered chart with empty selection. `updateCombinedSelection` now merges across tabs (preserves other tab's selections).
5. **Combined Select All clears other tab** `combined.html` — Now preserves other tab's selections when selecting all visible.
6. **Combined dead code** `combined.html` — Removed unused `hira` variable in `updatePoolCount`.

## Review Findings
Bugs fixed via static analysis (Chrome unavailable in this environment). All JS files pass `node --check` syntax validation.

## Test Commands
```
cd /home/rantiche/nihonpath
python3 -m http.server 8080
# open http://localhost:8080
```

## Test Results
—

## Security Findings
—

## Lint Results
—

## Commit Message Draft
`feat: scaffold nihonpath — tailwind + vanilla js japanese learning site`
