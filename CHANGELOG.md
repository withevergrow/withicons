# Changelog

All notable changes to the `@withicons/*` packages and the `withicons` CLI. All packages share one version.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [SemVer](https://semver.org), 0.x rules
in [docs/LAUNCH.md](docs/LAUNCH.md#3-versioning-and-changelog).

## Unreleased

To be released as **0.2.0**: `v0.1.0` (300 icons x 7 styles) is already tagged and on GitHub, so bump `withiconsVersion`
in the root `package.json` and rebuild before publishing (`scripts/publish.mjs` refuses to publish an already-tagged
version from another commit).

### Added

- **200 new icons** (500 in all), drawn as skeletons like the first 300, with aliases, synonyms and tags, and 7 new
  categories: food, health, education, nature, home, travel, sports (26 in all).
- **5 new styles**, all multi-colour *palette* styles: `glass` (layered frosted glass / glassmorphism), `kawaii` (chubby,
  pastel, a tiny blushing face), `sticker` (Y2K die-cut vinyl), `pixel` (16-bit pixel art) and `retro` (70s sunset stripes).
  12 styles and 6,000 icons in all. Every palette colour is a CSS variable with a default (`--with-<style>-<role>`) and
  the ink still follows `currentColor`. Every package exposes them: `@withicons/react/kawaii`, `<with-icon variant="pixel">`,
  `<i class="with with-heart with-sticker">`, `sprite-retro.svg`, `@withicons/core/nodes/glass`.
- **Per-icon colour palettes**: every icon ships 21-27 palettes picked for that icon (11,423 in all; pizza: Margherita,
  Pepperoni…), each setting ten colour roles (`ink`, `c1`-`c4`, `tint`, `accent`, `shadow`, `shine`, `edge`) that every
  multi-colour style (`duo`, `blueprint`, `glass`, `kawaii`, `sticker`, `pixel`, `retro`) maps onto its own variables, so
  one palette changes **every** colour of an icon, not just one. In `@withicons/core`: `palettes/<name>.json`,
  `palettes/index.json` (counts, tags) and `palettes/palette-map.js` (`rolesFor`, `applyPalette`, `bakePalette`).
- **`@withicons/motion`** (new package, optional): pure-CSS animations for any icon in any style or package. A tuned
  continuous loop and hover effect per icon, 32 presets, and icon-to-icon swaps (play to pause, menu to close, eye to
  eye-off, heart to heart@solid) with 12 transition effects. Small JS API (`motion`, `swap`, `motionFor`, `motionAttrs`),
  an element upgrade for `<with-icon motion="loop">`, and `@withicons/motion/export` (`animatedSvg`, `animatedSwapSvg`,
  `gif`, `video`). Respects `prefers-reduced-motion`.
- Right-to-left: `<with-icon mirror-rtl>` and the `with-rtl` icon class mirror directional icons only inside `dir="rtl"`;
  the core, static and framework READMEs show how to mirror arrows and chevrons.
- MCP: new `animate_icon` tool (trigger `loop` / `hover` / `once` / `inview` / `swap`, any preset, eight code formats) and
  `list_palettes` tool (an icon's palettes; with `style`, the exact `--with-*` variables and a CSS rule per palette).
  `get_icon` takes `palette` and `colors` (every colour role, recoloured in every format), reports the icon's motion and,
  for multi-colour styles, its colour variables; `flat: true` bakes the colours into the SVG. HTTP API: `GET /api/motion`
  and `GET /api/motion/<name>`.
- CLI: `withicons animate <name> [--trigger] [--preset] [--to] [--effect] [--format]`, `withicons palettes <name>
  [--style] [--tag]`, and on `get`: `--palette <id>`, one flag per colour role (`--ink`, `--c1`…`--edge`), `--colors` and `--flat`.
- Search understands style words: `cute`/`kawaii` -> kawaii, `glassmorphism`/`frosted` -> glass, `sticker`/`y2k`/`scrapbook`
  -> sticker, `8-bit`/`pixelated`/`pixel art` -> pixel, `vintage`/`70s`/`80s`/`retro` -> retro (engine 1.3.0). A word that
  also names a thing ("wine glass", "magnifying glass") stays a search word unless it leads the query.
- `@withicons/core`: `styles[].palette` and `styles[].vars` (the CSS variables a style reads, with defaults),
  `dist/styles.json`, and `toSvg(node, style, { flat: true })`.
- Website: every icon page has a **Customize** studio: pick any style, change every colour of a multi-colour icon (one
  picker per colour, or one of the icon's palettes), preview the animations and swaps, and download PNG, WebP, JPG,
  AVIF, SVG, PDF, EPS, GIF, APNG, WebM/MP4, Lottie, PowerPoint, Word, ICO/favicons, Android/iOS assets or framework code.

### Changed

- Standalone SVG files (`@withicons/core/svg/*`, `@withicons/static/svg/*`, `/api/icon/<name>.svg`) have CSS variables
  flattened to their default colours, so they look right in `<img>`, Figma, PowerPoint, Keynote and rasterizers. Inline
  routes (components, `<with-icon>`, sprites, IconNode data, `with-icons.js`) keep the variables for theming.
- Icon classes (`<i class="with ...">`) now draw the ink in `::after`; palette styles keep their colours in CSS-only
  mode (the palette is the element's background image, the ink a `currentColor` mask on top, stacking order preserved).
- CLI: an unknown option (`--styel`), a missing value, a non-number `--size` / `--limit` / `--duration` or a value that
  is not allowed now exits 2 with a suggestion instead of being ignored.
- The Lambda bundle inlines each style's SVGs as a JSON string parsed on first use (faster cold starts with 12 styles).
- `scripts/publish.mjs` fails when a package of the lockstep release is missing, on another version, or on a version
  already tagged on another commit.

## 0.1.0 - 2026-10-02

Packages are built and attached to the GitHub Release; the npm publish follows the first manual publish.

First public release.

- 300 icons x 7 styles (`line`, `solid`, `duo`, `gloss`, `engrave`, `blueprint`, `sketch`), MIT licensed.
- Packages: `@withicons/core`, `react`, `vue`, `svelte`, `angular`, `solid`, `web` (custom element + icon classes),
  `static` (sprites + SVG files), `search`, `mcp`; CLI `withicons`.
- Aliases and synonyms for every icon (`bin` resolves to `trash`), typo-tolerant search.
- Website https://withicons.com with per-icon pages, `llms.txt`, `icons.json` and an agent skill.
