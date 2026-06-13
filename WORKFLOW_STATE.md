# Workflow State

## Status
Phase 1 (CDN removal) done. Tailwind local. Material Symbols font local. Google Fonts replaced w/ system fallback. All pages 0 external requests.

## Request
Build NihonPath — fully static GitHub Pages Japanese learning site. Hiragana, Katakana, Combined, Kanji (JLPT N5-N3). Vocabulary (N5-N1). TTS via Web Speech API. Sakura blossom progression. localStorage lifetime stats. Bottom nav: Home+Progress only.

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

## Round 9 Changes (2026-06-12)
1. **Desktop: gojuon table** — Scrapped flat dense grid. Rebuilt as traditional 5-column gojuon table: rows = consonant groups, columns = vowels (A/I/U/E/O). CSS Grid `auto repeat(5, 1fr)`.
2. **Column-select buttons top** — 5 vowel buttons (A/I/U/E/O) in header row. Click toggles all chars with matching vowel ending.
3. **Row-select buttons left** — Per-group button in first column. Label derived from group key (A/K/S/T/N/H/M/Y/R/W/Nₙ/G/Z/D/B/P).
4. **Visual separator** — Thin line before dakuten rows (ga-row and below).
5. **Empty cells** — Missing chars (yi/ye in ya-row, wi/we in wa-row) rendered as empty square placeholders.
6. **n-row** — ん/n placed in first cell of its row (no vowel ending → non-vowel branch).
7. **Romaji bigger** — `text-[5px]` → `text-[9px]` in card hover. Fixes combined.html complaint.
8. **Mobile unchanged** — Per-group grid (`grid-cols-5`) kept as-is.

## Round 10 Revert (2026-06-12)
1. **Gojuon table scrapped** — Reverted to flat dense grid (RTL, vowel buttons right).
2. **Gap 2px → 4px** — Desktop grid, vowel column, mobile grid all `gap-[4px]`.
3. **Romaji 9px** — Kept from gojuon round. No revert on that.
4. **Mobile** — grid-cols-5, gap-[4px], row headers with toggle. Unchanged.

## Round 11 Fix (2026-06-12)
1. **Proper gojuon chart** — Columns = consonant groups. Flex `row-reverse` for RTL ordering. Each group = `flex-col` with 5 cells (a/i/u/e/o top→bottom). Matches `hiragana-katakana-chart.html` reference layout.
2. **Column select buttons** — At top of each consonant column. Label derived from group key (A/K/S/T/N/H/M/Y/R/W/N/G/Z/D/B/P). Toggles all 5 chars in that column.
3. **Vowel buttons** — Kept on right side. Select by vowel sound (A/I/U/E/O) across all columns.
4. **Empty cells** — Dashed border, reduced opacity for missing combos (yi/ye, wi/we, etc.).
5. **Dakuten spacer** — 16px gap between n-row and ga-row columns.
6. **Column width** — `w-14` (56px) fixed, matched to reference sizing.
7. **Mobile** — unchanged.

## Web Design Guidelines Fixes (2026-06-12)
1. **Focus states** — Added `button:focus-visible, a:focus-visible, [tabindex]:focus-visible` outline+offset to `style.css`.
2. **Semantic buttons** — Chart cards (`js/chart.js`): `<div>` → `<button type="button">`, added `aria-label` with char+romaji. Kanji cards (`kanji.html`): same pattern.
3. **Aria labels/hidden** — `aria-label="Progress"` on nav account_circle links. `aria-hidden="true"` on all decorative icon spans (bottom nav, card icons, buttons).
4. **Skip link** — Added `<a href="#main-content">Skip to main content</a>` before nav on all pages. `id="main-content"` on `<main>`.
5. **Meta tags** — `<meta name="color-scheme">` + `<meta name="theme-color">` on all pages.
6. **Reduced motion** — `prefersReducedMotion` check in `sakura.js`: skips petal creation/animation. CSS `.petal { display: none; }` under `@media (prefers-reduced-motion: reduce)`.
7. **Combined tabs ARIA** — `role="tablist"`, `role="tab"`, `aria-selected`, arrow key navigation (Left/Right).
8. **Progress reset confirmation** — `confirm()` dialog before clearing localStorage.
9. **Quiz input** — Added `aria-label`, placeholder `...` → `…` (ellipsis char).
10. **Touch/scroll** — `touch-action: manipulation`, `-webkit-tap-highlight-color: transparent` on body.
11. **Transition specificity** — Index nav cards/kanji cards: `transition-all` → `transition-[color,background-color,border-color,box-shadow]`. Chart cards same.
12. **Bottom nav** — Added `aria-label="Main navigation"`, `aria-current="page"` on active link.

## Round 12 — Kanji Grid Match Chart Cards (2026-06-13)
1. **All 100 kanji** — Removed 24-card limit. `renderKanjiGrid()` shows all 100 shuffled.
2. **Chart-style cards** — `bg-surface border border-outline-variant/50 rounded-md`, dot-indicator (top-right 2px dot), char `text-[24/26/32px]`, romaji hover label `bottom-[1px] text-[9px]`. Matches chart.js `makeCard()` exactly.
3. **Flat responsive grid** — `grid-cols-5 md:grid-cols-10 gap-[4px]` inside `bg-surface-bright rounded-xl border` container.
4. **`updateCardVisual()`** — Replaced `selectCard`/`deselectCard` with single function matching chart.js pattern (dot classList toggle).
5. **`makeKanjiCard()`** — Factory function parallels chart.js `makeCard()`. Same classes, same visual structure.
6. **Removed VISIBLE_COUNT** — No more 24-card cap.

## Round 13 — Vocab page, Nav overhaul, 500 kanji, quiz.js extension (2026-06-13)
1. **Kanji 500** — `data.js` kanjiData expanded from 100 N5 → 500 (N5+N4+N3). No duplicates.
2. **Kanji 25 visible** — `renderKanjiGrid()` slice(0, 25) from shuffled 500. Reshuffle picks new 25.
3. **Kanji card hover** — meaning top `text-[7px]` + romaji bottom `text-[7px]`, both `opacity-0 group-hover:opacity-100`. Char centered large.
4. **Bottom nav** — All pages: 2 items (Home + Progress). Removed Hira/Kata/Combined/Kanji from mobile bottom nav.
5. **Desktop nav** — All pages: added Vocab link after Kanji. 6 links + Progress icon.
6. **Home 5th card** — `index.html` 4-card 2x2 grid + 5th vocab card `md:col-span-2` full-width below.
7. **vocab.html** — New page. Mode toggle: Japanese→English (j2e) / English→Japanese (e2j). Calls `startQuiz(container, vocabData, quizMode, "vocab", ...)`.
8. **vocabData** — 200 entries in `data.js`. Each: `{japanese, reading, english}`.
9. **quiz.js extended** — `getAcceptableAnswers()` checks `e.japanese` for vocab entries. `renderQuestion()` displays `japanese` for j2e, `english` for e2j. Prompt text dynamic per mode.
10. **Progress tracking** — `updateProgress("vocab", correct, correct)` on quiz complete.

## Round 14 — Desktop nav 2+3, Kanji hover text 9px (2026-06-13)
1. **Desktop nav restructured** — All 7 pages: single row 6 links → 2-row layout. Row 1: NihonPath (left) | Home + Progress (right). Row 2: Hiragana + Combined + Kanji (right-aligned). Katakana/Vocab accessible from home page cards.
2. **Kanji card hover text** — `kanji.html` meaning span `text-[7px]` → `text-[9px]`, romaji span `text-[7px]` → `text-[9px]`. Matches chart.js label size.

## Plan — Make Application Distributable

### Goal
Ship NihonPath as a self-contained, offline-capable package. Zero CDN dependency.

### Current Blocks
| Block | Dep | Why Problem |
|---|---|---|
| Tailwind CDN | `cdn.tailwindcss.com` | No offline, extra 300ms+ load |
| Google Fonts | `fonts.googleapis.com` + `fonts.gstatic.com` | Blocks render w/o internet |
| Material Symbols | `fonts.googleapis.com` (icon font) | Same Google font dep |

### Approach Options

**A) Single-file self-contained HTML** — inline everything
- Run Tailwind CLI against all HTML to generate final CSS
- Replace Google Fonts → system font stack (Noto Sans not needed, OS has CJK)
- Replace Material Symbols → inline SVGs (20 icons only, small)
- Inline all JS into each page `<script>` tag
- Pros: Zero external deps. Works offline. Drag-and-drop share.
- Cons: Each HTML file larger (~50KB). Change = rebuild all.

**B) ZIP bundle with local assets**
- `wget` mirror all CDN resources into `vendor/` dir
- Rewrite `<link>`/`<script>` `src` to local paths
- Package as ZIP
- Pros: Quick. Low effort.
- Cons: Still loads Google Fonts from local file (slower than CDN). Bundled font files large.

**C) PWA offline-first**
- Add `manifest.json` + service worker
- SW caches Tailwind, fonts, icons on first load
- Install prompt for mobile
- Pros: Best UX after first visit.
- Cons: Requires server to serve SW. First visit needs internet.

### Recommended Plan (A → B → C phased)

**Phase 1 — Remove CDN deps (single-file HTML)**
1. Run Tailwind CLI `--content "*.html" --output css/tailwind.css` — captures all utility classes
2. Remove Tailwind CDN `<script>` from all pages, replace with `<link href="css/tailwind.css">`
3. Replace Google Fonts `@import` with system font fallback in `style.css`
4. Replace Material Symbols icon spans with inline SVGs (20 unique icons)
5. Inline all JS modules into each page or keep as separate files in `js/`

**Phase 2 — Self-contained build script**
1. Write `build.js` (Node) that reads each .html, inlines JS/CSS, outputs to `dist/`
2. `dist/` = fully static, zero external deps, works offline
3. Single ZIP: `nihonpath-v1.zip` from `dist/`

**Phase 3 — PWA polish (optional)**
1. Create `manifest.json` with app name, icons, theme color
2. Write service worker that caches all assets on install
3. Enable install prompt on mobile

### Effort Estimate
| Phase | Files Changed | Effort |
|---|---|---|
| Phase 1 | 7 HTML + 1 CSS + 6 JS | ~2h |
| Phase 2 | 1 new build.js | ~30min |
| Phase 3 | 2 new files + 7 HTML meta tags | ~1h |

## Round 15 — Kanji 30, labels match chart, home 2+3, smaller chars (2026-06-13)
1. **Desktop nav reverted** — Back to single-row 6 links + Progress icon. User clarified 2+3 was for home page cards, not desktop nav.
2. **Home cards 2+3** — `grid-cols-2 md:grid-cols-6`. Top: Hiragana + Katakana (`md:col-span-3`). Bottom: Combined + Kanji + Vocab (`md:col-span-2`).
3. **Kanji 30 visible** — `slice(0, 25)` → `slice(0, 30)`. Grid `grid-cols-5 md:grid-cols-10` = 10 cols × 3 rows.
4. **Labels match chart.js** — meaning + romaji spans: `font-label-caps text-label-caps text-[9px] leading-none`. Romaji `bottom-[2px]` → `bottom-[1px]`.
5. **Smaller char** — kanji card character: `24/26/32` → `20/22/26`.
6. **Distribution plan** — Added to WORKFLOW_STATE.md. Phased approach: inline CDN deps → build script → PWA.

## Phase 1 Complete — CDN Removal (2026-06-13)
1. **Tailwind CDN** → `tailwind.config.js` + `npx tailwindcss` → `css/tailwind.css`. Removed CDN script from all 7 HTML files.
2. **Google Fonts** → System font fallback. Removed Noto Sans/Noto Sans JP/Plus Jakarta Sans from all pages. Defined fallbacks (`system-ui`, `Hiragino Sans`, `Yu Gothic`, `MS Gothic`) in `tailwind.config.js`.
3. **Material Symbols** → Local woff2 font at `css/fonts/MaterialSymbolsOutlined.woff2` (1.1MB). `@font-face` in `style.css`.
4. **Dead config** — Removed inline `tailwind.config` script from all pages (redundant with pre-built CSS).
5. **Build tooling** — `package.json`, `tailwind.config.js`, `tailwind-input.css` committed. Rebuild with `npx tailwindcss -i tailwind-input.css -o css/tailwind.css --config tailwind.config.js`.

## Handoff Notes
- 2026-06-13: Phase 1 CDN removal complete. 0 external requests. Tailwind local, Material Symbols local, fonts local. Next: Phase 2 (build script) or Phase 3 (PWA).
- 2026-06-13: Round 15 — home 2+3, kanji 30, labels chart.js style, chars smaller, distribution plan in WORKFLOW_STATE.md.
- 2026-06-13: Major restructure. Bottom nav = Home+Progress only. Desktop nav = all 6 sections. Vocab page live at `vocab.html`. Kanji = 500 entries, 25 visible. `quiz.js` handles vocab (j2e/e2j). All `node --check` pass.
- 2026-06-13: Kanji grid now shows all 100 cards with chart.js card styling. Flat grid, no groups. `makeKanjiCard()`/`updateCardVisual()` mirror `chart.js` functions.
- 2026-06-12: Proper gojuon chart. Columns = consonant groups, RTL order. Column select buttons top. Vowel buttons right. Empty cells dashed. Mobile same.
- 2026-06-12: Web design guidelines (accessibility) fixes applied across all 6 HTML + 4 JS + CSS. Focus states, semantic buttons, ARIA labels, skip link, reduced motion, tab interaction, confirmation dialogs. All JS passes `node --check`.
