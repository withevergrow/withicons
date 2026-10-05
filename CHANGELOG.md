# Changelog

All notable changes to the `@withicons/*` packages and the `withicons` CLI. All packages share one version.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [SemVer](https://semver.org), 0.x rules
in [docs/LAUNCH.md](docs/LAUNCH.md#3-versioning-and-changelog).

## Unreleased

To be released as **0.2.0**: `v0.1.0` (300 icons x 7 styles) is already tagged and on GitHub, so bump `withiconsVersion`
in the root `package.json` and rebuild before publishing (`scripts/publish.mjs` refuses to publish an already-tagged
version from another commit).

### Added

- **Animated icon files from the terminal and from AI agents** (no browser): `withicons export <name> --format gif`,
  `apng`, `animated-svg` and **`pptx-animated`** (a ready 16:9 PowerPoint slide whose picture is the animated GIF; plays in
  PowerPoint, Keynote and Google Slides). Frames come from `@withicons/motion`'s own keyframes (the same as the website),
  frozen per frame and drawn by `@resvg/resvg-js`, then encoded by the site's GIF / APNG encoders, so a file from the CLI
  moves like the icon page. Options: `--motion loop|hover|once|swap|<preset>`, `--to` / `--effect` / `--hold` (icon turns
  into another), `--fps`, `--seconds`, `--loop`, `--size` (default 256), `--background` (solid, best for slides) and
  `--matte` (transparent GIF, soft edges blended with the colour it will sit on). Icons without tuned motion pulse; long
  or huge animations are refused with a hint (600 frames, 1024 px). `pptx-sheet --motion <m>` animates every style.
  WebP, JPG, AVIF, animated WebP and video stay in the browser (the error now names the terminal alternatives).
- **MCP `export_icon`** (`@withicons/mcp`): files instead of code (every `withicons export` format, animated ones
  included). The local server saves them to `out_dir` and returns small ones inline (GIF / PNG as MCP image content,
  text as text, the rest as base64 resources); the remote server makes the vector, code and Lottie formats and answers
  PNG-based / animated ones with the exact `npx withicons export …` command and the icon page. `animate_icon` results
  point at it. `@resvg/resvg-js` is now an optional dependency of `@withicons/mcp` too.
- Skill: a "7a. Animated icon files for slides, docs and social" recipe (which command, slide-colour background, sizes,
  which apps play GIF / APNG / Lottie, the MCP path).
- **`@withicons/classes`**, a new package for the Font Awesome-style icon classes (`<i class="with with-home">`), split
  out of `@withicons/web` so each package stays far below jsDelivr's 150 MB limit. Short paths:
  `@withicons/classes/dist/with-loader.js` (the bare `cdn.jsdelivr.net/npm/@withicons/classes` URL serves it),
  `dist/with-<style>.css`, `dist/<style>/<name>.css`, `dist/with-base.css`, `dist/with-all.css`, `dist/with-icons.js`;
  with a bundler `import '@withicons/classes/with-line.css'`. **Moved:** `@withicons/web/dist/classes/*` no longer
  exists; `@withicons/web` is now only the `<with-icon>` element. `with-icons.js` still draws its inline SVG from
  `@withicons/web` (same version, fetched on demand).
- **5 new storybook styles** (20 styles and 10,000 icons in all): `anime` (cel shading: tapered ink line art, flat cel
  colour, one hard shadow, specular shine and sparkles), `gothic` (cathedral craft: carved limestone and stained glass in
  dark lead, pointed arches and tracery), `pastel` (soft colour fields in lavender, peach, mint, baby blue, butter and
  blush), `coquette` (ballet-pink satin, ribbon-red bows, pearls, lace and gold) and `plush` (stuffed toys sewn from
  felt, for kids). Role-named colour variables (`--with-anime-c1`, `--with-gothic-tint`, `--with-plush-accent`), so
  every per-icon palette and the editor's colour pickers work with them. Every package exposes them
  (`@withicons/react/anime`, `<with-icon variant="gothic">`, `sprite-plush.svg`…), and so do live icons. Search
  understands their words: "anime", "manga", "cel shaded" pick anime; "gothic", "medieval", "cathedral", "castle" pick
  gothic; "pastel", "soft" pick pastel; "coquette", "bow", "girly", "feminine" pick coquette; "plush", "toy", "kids",
  "stuffed", "felt" pick plush.
- Website: a fifth style family, **Storybook**, in the library, the live icons page, icon pages, the editor and the home
  page (the style switchers are laid out for 20 styles on desktops, tablets and phones), and "Free anime icons", "Free
  gothic icons", "Free pastel icons", "Free coquette icons" and "Free plush icons for kids" pages.
- **3 new studio styles** (15 styles and 7,500 icons in all): `luxe` (premium multi-layered 3D: sapphire enamel, polished
  gold, a jewel, lit chamfers, all stacked vector geometry), `bauhaus` (pure circles, squares and bars in red, yellow and
  blue, overprinted) and `skeuo` (skeuomorphic objects in real materials with bevels and soft shadows). Their colours are
  role-named variables (`--with-luxe-c1`, `--with-bauhaus-accent`, `--with-skeuo-shadow`), so every per-icon palette and
  the editor's colour pickers work with them out of the box. Every package exposes them (`@withicons/react/luxe`,
  `<with-icon variant="bauhaus">`, `sprite-skeuo.svg`…). Search understands their words: "3d", "luxury", "premium", "gold"
  pick luxe; "bauhaus", "geometric", "modernist" pick bauhaus; "skeuomorphic", "realistic", "tactile" pick skeuo.
- **Live icons** (`@withicons/dynamic`, new package): up to 50 icons whose content you set, such as a calendar's date, a
  clock's time, a notification count, a battery level, a temperature or a short label, drawn with a stroke font so they render
  in every style. `render(name, params, style)`, `list()`, `paramsOf(name)` and a `<with-live-icon>` element. Spec:
  `forge/DYNAMIC.md`.
- Website: the studio styles everywhere (library, icon pages, editor, home), "Free 3D icons", "Free Bauhaus icons" and
  "Free skeuomorphic icons" pages, and a Live icons page (`live.html`) linked from the main navigation.
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
