# Workflow State

## Status
Char sizes reduced. Home top spacing added. Progress now shows coverage (attempted/total).

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

## Round 3 Fixes (2026-06-12)
1. **Smaller quiz chars** — `text-[80px] md:text-[100px]` → `text-[48px] md:text-[64px]` in `quiz.js`. Also shrunk chart grid chars (`text-[32px] md:text-[64px]` → `text-[24px] md:text-[40px]`) and kanji grid chars.
2. **Home top spacing** — `pt-[80px]` → `pt-[96px]` on index main for breathing room below nav.
3. **Coverage progress** — Added `getCoverage(section, total)` to `progress.js`. Index dashboard now shows `attempted / total * 100` with 1 decimal (e.g. 36/71 = 50.7%). Bar fills proportionally.

## Round 6 Fixes (2026-06-12)
1. **Desktop cards smaller** — chart grid: `grid-cols-5` → `grid-cols-5 sm:6 md:8 lg:10`. Desktop cards now ~100×150px (was 220×330px). Mobile unchanged.
2. **Progress page** — h1 "Progress" (not "Your"). Subtitle removed. Smaller padding `p-4 md:p-6`. Overall label "OVERALL" (verbose gone). Coverage `text-headline-md` down from `text-display-lg`. Gaps tightened.
3. **Home progress removed** — `<section id="progress-dashboard">` + `renderProgress()` + `progress.js` script deleted from `index.html`. Home is clean hero + 4 nav cards.
4. **Bottom nav full-width** — `overflow-hidden` added to parent (fixes corner clip on active bg). `py-1.5` → `py-2` on all children for taller buttons. `flex-1` already fills column width.

## Round 5 Fixes (2026-06-12)
1. **Cards smaller** — `aspect-[5/6]`→`aspect-[2/3]`, `gap-1.5`→`gap-1`, `rounded-xl`→`rounded-lg`, chars `[16/20/28px]`→`[14/18/24px]`, dot `w-2.5→w-1.5`. Chart cards now 33% shorter.
2. **Portrait restored** — desktop nav: `stadia_mercury`+% → `account_circle` link to `progress.html`. No text.
3. **Progress page created** — `progress.html`. Shows overall coverage % + per-section bars + correct/attempted counts. Access via portrait (desktop) or Progress button in bottom nav (mobile).
4. **Bottom nav rebuilt** — `flex-1` full-width columns (each = 1/6). No padding on parent. `py-1.5` vertical only. Icons `text-[20px]`, labels `font-bold text-[9px] tracking-normal` (no letter-spacing to prevent overflow). 6 items: Home, Hira, Kata, Combined, Kanji, Progress. Active = `bg-primary-container` fill. Inactive = `text-secondary hover:bg-surface-container-high`.
5. **Prefetch progress.html** — added `<link rel="prefetch" href="progress.html">` to all 5 existing pages.

## Round 4 Fixes (2026-06-12)
1. **Smaller chart boxes** — `aspect-square` → `aspect-[5/6]`, `gap-2` → `gap-1.5`, char `text-[24px]` → `text-[16px] sm:text-[20px] md:text-[28px]` in `js/chart.js`.
2. **Smaller kanji boxes** — `aspect-square p-4` → `aspect-[4/5] p-2`, char `text-[40px]` → `text-[28px]`, grid `gap-gutter` → `gap-2` in `kanji.html`.
3. **Mobile text** — h1 add `text-[24px]` before `font-display-lg-mobile` on all 5 pages for smaller screens.
4. **Bottom nav alignment** — removed `scale-90`, unified all items `rounded-xl px-3 py-1` on all 5 pages. No more misalignment.
5. **Row select button** — Added `checklist` icon button per group header in `js/chart.js`. Toggles row chars independently from header text click.
6. **Prefetch nav** — Added `<link rel="prefetch">` for all other pages in `<head>` of all 5 HTML pages. Browser preloads during idle → near-instant swaps.
7. **Progress = correct only** — Changed all `onComplete` callbacks from `updateProgress(section, correct, total)` → `updateProgress(section, correct, correct)`. Wrong answers no longer count as progress.
8. **Nav progress display** — Replaced empty `account_circle` button with `stadia_mercury` icon + overall coverage % (e.g. "42.1%") in desktop nav on all 5 pages. Added `getOverallCoverage()` to `progress.js`. Also shows on mobile since bottom nav alignment fix makes nav consistent.
9. **Top spacing** — Fixed `pt-[80px] mt-stack-md` → `pt-[96px]` (no mt) on all 4 quiz pages, matching index.
10. **Summary accuracy** — quiz.js summary now uses `correctCount` for `attemptedCount` display (progress only tracks correct).

## UI Fixes (2026-06-12)
1. **Nav bar cutoff** — removed `max-w-container-max mx-auto left-0 right-0` from all 5 nav bars. Now full-width with `px-6`.
2. **Empty top space** — removed `mt-stack-md` from main + hero section on index.html. Content starts immediately below nav.
3. **Oversized symbols** — index card decorative chars `text-[120px]` → `text-[64px]`. Less scroll required.
4. **Multi-char quiz** — `quiz.js` now supports `multiChar` mode. Pairs 2 chars per question, combines readings (e.g. あ+か → "aka"). Enabled on all quiz pages. Kanji uses multiChar only for romaji mode.
5. **Quiz scroll fix** — `scrollIntoView` fires inside `requestAnimationFrame` after removing `hidden` class, so element has layout before scroll targets it.

## Review Findings
All fixes verified via static analysis. JS files pass `node --check`.

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

## Round 8 Changes (2026-06-12)
1. **Desktop: dense flat grid** — 16-column grid (`grid-cols-10 sm:12 md:14 lg:16`), `aspect-[1/1]` cards, `gap-[2px]`. Cards ~50-78px square. No row-select/labels on desktop.
2. **Vowel buttons vertical on right** — A/I/U/E/O stacked vertically right of grid (`flex flex-col shrink-0`). `w-10 aspect-[1/1]`, `text-[16px]`.
3. **RTL fill** — `direction: rtl` on desktop grid. Progresses right-to-left like Japanese. Each card `direction: ltr` for normal text.
4. **Bigger char font** — `text-[10/11/13px]` → `text-[24/26/32px]`. Box stays same size (`aspect-[1/1]`), character fills more space.
5. **Combined tabs full-width** — `flex-1` on tab buttons, equal width split.
6. **Progress reset full-width** — `w-full md:w-auto` on reset button.

## Commit Message Draft
`feat: vertical vowel buttons rt-gr, rtl grid, bigger char font, dense desktop`

## Commit Message Draft
`feat: gojuon table layout, kanji 5x5 mobile, smaller cards, full-width buttons, reset progress`
