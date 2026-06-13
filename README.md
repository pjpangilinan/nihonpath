# NihonPath

A free, static Japanese learning platform for Hiragana, Katakana, Combined Kana, JLPT N5-N3 Kanji (500 chars), and Vocabulary (200 words).

No backend. No build step for production. No paid APIs. TTS via Web Speech API (ja-JP). Progress via localStorage.

## Features

| Page | Description |
|------|-------------|
| **Home** | Hero + 5 nav cards (Hiragana, Katakana, Combined, Kanji, Vocab) |
| **Hiragana** | Gojuon chart (71 chars) + quiz + progressive sakura fill |
| **Katakana** | Same layout as Hiragana |
| **Combined** | Dual-chart tabs (Hira/Kata) + merged quiz |
| **Kanji** | 500 N5-N3 kanji, 30 visible at a time, reshuffle |
| **Vocabulary** | 200 words, Japanese→English / English→Japanese modes |
| **Progress** | Per-section coverage + overall stats, localStorage |

- Cherry blossom (sakura) petals: decorative falling (home) + progressive fill (quiz)
- Desktop nav: all 6 sections + Progress icon
- Mobile bottom nav: Home + Progress

## Project Structure

```
nihonpath/
├── pages/              # HTML pages
│   ├── index.html
│   ├── hiragana.html
│   ├── katakana.html
│   ├── combined.html
│   ├── kanji.html
│   ├── vocab.html
│   ├── progress.html
│   └── hiragana-katakana-chart.html
├── css/
│   ├── tailwind.css    # Pre-built Tailwind
│   ├── style.css       # App styles + @font-face
│   └── fonts/          # Local Material Symbols woff2
├── js/
│   ├── data.js         # Kana/kanji/vocab data
│   ├── progress.js     # localStorage progress
│   ├── tts.js          # Web Speech API
│   ├── quiz.js         # Quiz engine
│   ├── chart.js        # Chart grid renderer
│   └── sakura.js       # Sakura animations
├── .github/workflows/deploy.yml  # GitHub Actions deploy
├── Dockerfile          # nginx:alpine container
├── .dockerignore
├── package.json        # Tailwind dev dep
├── tailwind.config.js
├── tailwind-input.css
└── README.md
```

## Run Locally

### Option 1: Python HTTP Server

```sh
python3 -m http.server 8080
# Open http://localhost:8080/pages/
```

### Option 2: Docker

```sh
docker build -t nihonpath .
docker run -p 8080:80 nihonpath
# Open http://localhost:8080
```

Docker copies `pages/*` to nginx root, `css/` → `nginx/html/css/`, `js/` → `nginx/html/js/`. Root URL serves `index.html` directly. No custom nginx config needed.

## Development

Rebuild Tailwind CSS after changing `tailwind-input.css` or adding new utility classes:

```sh
npx tailwindcss -i tailwind-input.css -o css/tailwind.css --config tailwind.config.js
```

Requires Node.js + `npm install`.

## Deployment

Push to GitHub `main` branch. `.github/workflows/deploy.yml` auto-deploys to GitHub Pages.

**Setup:** Repo Settings → Pages → Source = "GitHub Actions".

The workflow flattens `pages/*` + `css/` + `js/` into a deploy artifact with root-relative paths.

## Tech Stack

- Vanilla JavaScript (no framework)
- Tailwind CSS v3 (pre-built, no CDN)
- Material Symbols (local woff2 font)
- System font stack (no Google Fonts)
- nginx:alpine (Docker)
