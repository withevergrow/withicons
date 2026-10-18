# Changelog

All notable changes to the `@withicons/*` packages and the `withicons` CLI. All packages share one version.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [SemVer](https://semver.org), 0.x rules
in [docs/LAUNCH.md](docs/LAUNCH.md#3-versioning-and-changelog).

## Unreleased

Planned as 0.6.0.

### Added
- 250 icons (1,000 in all), each with motion and palettes: the everyday UI, file, chart, text-editing, weather, food and sport
  icons people reach for most (for example `airplay`, `calendar-search`, `chart-spline`, `clipboard-pen`, `file-diff`,
  `git-graph`, `list-tree`, `panel-right-close`, `spell-check`, `wifi-low`).
- `@withicons/loaders`: 50 animated loaders (common, creative, festival) and 15 icon morph sequences, drawn in every style.
  One self-contained SVG each (pure CSS animation, `prefers-reduced-motion` respected): `<img>`, inline, `<with-loader>`,
  React and Vue. The Loader Studio is on the site (`loaders.html`), and the MCP has `get_loader`.
- Hand-drawn overrides: about 3,300 icons are now drawn by hand in the styles where the generated drawing read badly
  (`forge/hand/<style>/<icon>.mjs`, contract in `forge/HAND.md`, checked in CI by `node forge/tools/hand.mjs check --all`).

### Changed
- The class files of `glass`, `skeuo` and `gothic` moved from `@withicons/classes` to `@withicons/classes-plus` to keep every package under
  jsDelivr's 150 MB limit (one 145 MB budget everywhere). `with-loader.js` finds them automatically; direct CSS links change package.
- 85 icons redrawn (skeleton reworks), among them the avatars, `black-cat`, `salad`, `oven`, `firecracker`, `jalebi`,
  `rose-bouquet`, `zap-off` and `camera-off`. Names and aliases are unchanged (`firecracker` keeps `anar`, `anaar`,
  `flowerpot-cracker`, `fountain-cracker`, `cone-firecracker`).
- Pixel is drawn on the 24 grid (one pixel per unit, pixel-perfect at 24, 48 and 72px); live icons keep their 16 × 16 sprites.
- Brutal's outlines and hard shadow are a fixed near-black, `var(--with-brutal-ink, #16130F)`, instead of `currentColor`
  (white outlines on dark pages lost the icons). Set `--with-brutal-ink` to recolour them.
- Live icons: `battery-percent` draws the number without "%" by default; pass `percent: true` for the sign. `badge-text`
  and `sale-sticker` keep their outline closed and set the text inside it (condensed when long), so `"-50%"`, `"100%"`
  and `"DOCX"` are written in full.
- Morphs (`morph()`, `morphAsync()`, `<with-loader morph>`, `Morph`, MCP `get_loader({ morph })`): a plain name is always an
  icon; a loader in a sequence is written `loader:<name>` (or `{ loader }`). `done(name)` always ends on the icon.

### Fixed
- Dock: the keyline around the glyph moves with the glyph when animated instead of lagging with the shadow.
- Live icons lay out text faster (kerning pairs are remembered), with the same output.
- `scripts/publish.mjs`: a bad `--wait` is an error, and a CI re-run that meets a version npm is still processing skips it.

## 0.5.0 - 2026-10-12

Result of an agent evaluation: five agents built pitch decks with the MCP and reported what stopped them
([docs/MCP-AGENT-EVAL.md](docs/MCP-AGENT-EVAL.md) has the findings and what is still open).

### Added
- 16 icons (750 in all), each with motion, palettes and default colours in 19 colourful styles: bakery (`bread`, `baguette`,
  `croissant`, `wheat`, `oven`, `rolling-pin`), day care and dental (`playground`, `crayon`, `stroller`, `baby-bottle`,
  `dental-chair`, `tooth-crown`, `worried`), `mosque`, and the avatars `avatar-woman-hijab` and `avatar-person-wheelchair`
  (true-to-life skin-tone palettes).
- MCP: `preview_icons`, a tenth tool: one labelled picture of up to 24 icons in up to 6 styles (rows are icons, columns are
  styles; light, dark or hex background; `size` 12-256). A PNG on the local server (and a file in `out_dir`), one self-contained
  SVG sheet on the hosted server; `previewSheet()` in `@withicons/mcp/lib`.
- MCP and CLI: brand colours across a set. `theme` (`"#hex"` or `{ primary, secondary?, tertiary?, ink? }`) on `get_icon` and
  `export_icon` puts them on each icon's own parts by size in any style; `per_icon` colours individual icons; CLI `--theme`,
  `--per-icon`. `export_icon` returns a `colorReport` per icon and style (colours that changed nothing, where a theme landed,
  which parts a borrowed palette coloured).
- MCP: `list_styles` gives every style a `colours` entry read from the rendered icons (its roles, variables, whether each is
  solid, a tone or a gradient, and whether a brand hex shows exactly). The server instructions and tool descriptions are
  generated from it: duo is a 20% `c1` tone plus an accent, and its `tint` role paints nothing.
- MCP: `search_icons` `format: "none"` (names only), `recommend_styles` `compact: true` (also `/api/recommend?compact=1`), and a
  "Making slides and docs" recipe in the server instructions (PNG 512 px, one call, which `pptx` format is for what).
- Hosted MCP: `export_icon` makes PNG, PNG sets, ICO, favicon packs, PowerPoint, Word and animated SVG (`@resvg/resvg-wasm`, the
  same output as the local server and the CLI). `gif`, `apng`, `pptx-animated` and `pptx-sheet` still answer with the CLI command.

### Changed
- `search_icons` (MCP), `searchIcons` (`@withicons/mcp/lib`, `/api/search`) and `withicons search` keep `results` for exact matches
  only (what the query names, or a direct match such as a spelling fix). When no icon carries the words they say `noExactMatch`
  and offer up to five similar icons apart, in `additional` (loosely related, no snippet), instead of padding `results` with
  low-confidence matches. A word the engine only reached through a related concept ("bread" -> bakery icons, before `bread`
  existed) counts as similar, not exact. Beside real matches, low-confidence guesses are not listed.
- `@withicons/search` 1.6: multi-word queries are read as phrases (the head word first; "to", "of" and "-based" carry nothing; a
  word in another sense no longer ranks first: "children playing", "shop counter", "nature-based day care").
- `suggestions` (no match), `resolve_icon.nearest` and the `get_icon` "Did you mean" keep only names near the spelling or the
  meaning ("nervous" no longer suggests angry and arrow-left).
- `list_palettes` `mainRole` is measured on the rendered icon (it was wrong for `suite` and the avatars).
- `recommend_styles`: "exact brand colours" ranks flat styles first and says gradient styles cannot match a hex; a prompt naming
  several festivals is ranked by how many each style covers.
- Hosted API and `/mcp`: the per-IP rate limit (`WafRateLimitPer5Min`) now defaults to 1000 requests per 5 minutes (was 200). The
  live limit changes when the CloudFormation stack is updated.

## 0.4.0 - 2026-10-09

### Added
- 14 new styles (34 in all): the rich styles `clay`, `bento`, `suite`, `dock`, `liquid`, `chrome`, `soft3d` and `brutal`,
  whose colours (gradient stops included) are role-named CSS variables, and six holiday styles: `utsav`, `rangoli`
  (Diwali, Durga Puja, Holi), `halloween`, `christmas`, `lunar` (Lunar New Year) and `valentine`, each with festival
  palettes. `glass` is redrawn with soft gradients.
- `@withicons/holiday`: the six holiday styles' SVGs and node data (core layout in `dist/`, icon classes in
  `dist/classes/`). `@withicons/soft3d` holds `soft3d` the same way.
- Companion packages that keep every package under the CDN size limit, with the same paths as their base package:
  `@withicons/core-plus` and `@withicons/classes-plus` (clay, bento, suite, dock, liquid, chrome, brutal),
  `@withicons/web-plus` and `@withicons/static-plus` (every newer style). Framework packages hold every style.
- Duo has an accent detail (`--with-duo-accent`), an opt-in gradient render and colour presets.
- 234 new icons (734 in all), among them 39 avatars (`avatar-man` and `avatar-woman` first, as the standard defaults), 95 festival icons (Indian festivals, Christmas, Lunar New Year,
  Valentine's, Halloween) and a new AI category; each with its own animation and palettes.
- `@withicons/motion`: in the 3D styles (clay, dock, liquid, chrome, soft3d, luxe, skeuo, glass, plush) an icon's own
  motion plays as its 3D counterpart (`STYLES_3D`, `styleSpec`).
- Site: a skin-tone picker in the studio's Colours panel for people avatars (six tones, light to deep; it changes only
  the skin and keeps the hair and clothes).
- Site: "Download all" zips per style (SVGs plus an offline viewer) and one with every style, offered on every style hub, the library's style picker and each icon page.
- Site: an "Every style" bento on the home page (one card per style), Duo looks in the studio (classic, with an accent,
  gradient), and free holiday pages (Diwali, Holi, Halloween, Christmas, Lunar New Year, Valentine's Day).

### Changed
- Smaller framework packages, every one well under jsDelivr's 150 MB per-package limit, with no import path changed:
  `@withicons/solid` 207 MB -> ~92 MB and `@withicons/svelte` 208 MB -> ~102 MB (each drawing now ships once instead
  of twice), `@withicons/react` and `@withicons/vue` 109 MB -> ~88 MB, `@withicons/angular` 112 MB -> ~98 MB,
  `@withicons/core` 97 MB -> ~89 MB (`core-plus`, `soft3d` and `holiday` shrink too). Icon data is written as compact
  JS: a value a style repeats (palette variables, class names) is declared once per module.
  - Solid: `<style>/index.cjs` reads the drawings from the ES module `<style>/nodes.js`, so `require()` of a style
    needs Node 20.19+ / 22.12+ (as React and Vue already did); `import` is unchanged.
  - Svelte: each `icons/<name>.svelte` imports its drawing from a 32-icon chunk `<style>/nodes/<k>.js` (no per-icon `.d.ts`; one shared declaration), which the generic `<Icon>`
    shares, so a deep import still loads only that icon.
- Every package has a size test (`test/size.test.mjs`, `scripts/package-budget.mjs`: under 120 MB unpacked, no file
  over 20 MB), and `scripts/publish.mjs` refuses a package over that budget.
- Docs lead with the load-what-you-use paths: React, Vue and Solid READMEs show the ESM CDN form that ships only the
  icons named (`https://esm.sh/@withicons/react?exports=Home,Search`), and the classes README starts with
  `with-base.css` plus one file per icon, and shows how to make one small stylesheet from a few icons.
- `withicons export --format gif`: smaller, cleaner GIFs. Pixels that did not change since the previous frame are sent as
  transparent (so each frame carries only what moved), and frame delays follow a running clock, so the loop keeps its
  exact length at any frame rate.

## 0.3.1 - 2026-10-07

### Fixed
- `@withicons/motion`: the `loader` icon's loop is now a smooth spin. Its 8 identical spokes made the 8-step tick look
  frozen (every step landed on the same picture), on the site, in GIF exports and in code. The stepped tick is still
  available as an alternate motion, now in 12 steps.

## 0.3.0 - 2026-10-07

### Changed
- React, Vue, Solid and Svelte: the root import is fast. `import { Home } from '@withicons/react'` takes about 0.15 s in
  Node (was about 10 s) because each style is one module and the root `Icon` loads styles on demand: line renders at
  once, other styles load on first use (React/Solid: inside `<Suspense>`; before a synchronous `renderToString`, call
  `await preloadStyles('solid')`; `@withicons/<pkg>/icon` keeps every style synchronous). Half the files on install.
  **Behaviour change:** a non-line `Icon` now suspends on first render; see the README.
- Hosted MCP `export_icon` serves any size: large exports come in pages (`next.cursor`) and plain SVGs as CDN links.
- Agent docs: shorter skill (description under 1,024 characters), `llms.txt` is a short index, shorter MCP tool
  descriptions; one set of style groups everywhere (Everyday, Crafted, Playful, Studio, Storybook).

### Fixed
- Security: no open redirect on `//` paths; the API rate limit counts every path form; non-canonical API paths 404.
- Site: icon pages hide typo aliases, a page map that never covers text, a mobile action bar, a feedback link, one
  title separator, a "no exact icon" banner on the icons page and a slimmer hero once you search.

## 0.2.2 - 2026-10-06

### Added
- `@withicons/dynamic`: live icons can **move to new values instead of jumping**. `<with-live-icon animate>` (or
  `animate="900"` for a duration in ms) animates every change: numbers roll, levels ease, clock hands take the short way
  round and words cross-fade. From script: `animateTo(el, values, { ms, ease })` and `el.animateTo(values)` (both resolve
  when the last frame is drawn), plus `transition()`, `plan()`, `interpolate()`, `setMotion()` and `reducedMotion()` for
  your own loops. With reduced motion the change is instant. React and Vue get an `animate` prop.
- `@withicons/dynamic`: a **default accessible name**. Without a `label`, an icon is named by what it shows
  (`describe('calendar-date', { day: 17, month: 'MAR' })` gives "Calendar date, March 17"); `label=""` makes it decorative.
- `@withicons/classes`: `--with-size` sets an exact icon size whatever the text size
  (`<i class="with with-home" style="--with-size: 48px">`). The READMEs and the site now explain the three ways to
  resize a class icon (font size, a size class, `--with-size`).
- Search: finance words (fintech, trading, stocks, investing and more) find the money, chart and trend icons.
- `@withicons/search` 1.5.0: much better ranking (multi-word queries weigh every word, generic words like "fast" or
  "live" count less than the object, real English words are never "corrected" into other icons), a `confidence`
  (high, medium, low) and `weak` flag on every result, empty results plus a hint for things with no honest icon, and
  `query()` with filtered ranking, `outside` matches a filter hid, `didYouMean` and a browse list. 160+ new synonyms.
  Measured on a new 1,125-query evaluation set (`packages/search/eval`): nDCG@5 0.88 to 0.93, top result right 89% to
  94%, typo noise 3.9% to 0.1%, no-icon queries handled 46% to 97%.
- CLI: `palettes <icon> --style <s>` marks the main colour role ("c2, main body, ~47%"); `--name <template>`,
  `--name-map receipt=orders`, `--strict`, `--stroke-width` on `export`; `motions <icon>` (or `animate <icon> --list`)
  with livelier picks for slides; per-command `--help`; one colour note per command instead of one per icon.
- MCP: `export_icon` takes `names` (list or map), `filename`, `strict_palette`, `stroke_width`; `get_icon` returns
  `mainRole` and `warnings` and lists palettes only on request; `list_styles` returns `minSize` and `onDark`;
  `resolve_icon` resolves by meaning (`status: "synonym"`, e.g. favourites to star or heart); shorter search replies.
- Animated exports up to 2048 px (1080 px Instagram GIFs at the default frame rate), with a clear error instead of a
  silent resize; padding always covers the motion.

### Changed
- `@withicons/dynamic`: `loaded(style)` says whether a style's renderer runs on this thread. In the lite and CDN builds a
  rich style can be drawn only by the render workers, so `loaded(style)` can be `false` while `renderAsync()` and
  `<with-live-icon>` draw it fine. Check `cached(...)` or await `renderAsync()` before a sync `render()`.
- `@withicons/mcp`: the `npx withicons export …` command that `export_icon` returns now quotes values so it pastes the
  same into bash, zsh, PowerShell and cmd (hex colours and leading `@` were split or eaten by some shells), and passes
  `hold` (seconds on each icon in a swap animation) through, like the CLI `--hold`.
- `package.json` `jsdelivr` / `unpkg` fields for `@withicons/angular`, `svelte` and `static`, so their bare CDN URLs show
  the entry (static: the `icons.json` catalogue) instead of a 404.
- Website and READMEs use `@latest` in every jsDelivr link.
- Package READMEs: setup lines per stack, a "Make it bigger or smaller" section, corrected sizes (Svelte 5 about 10 KB
  gzipped for the first icon).

### Fixed
- `@withicons/motion`: `<with-icon motion="hover|once">` animated the whole element as well as its parts; now only the
  parts move, with each icon's tuned lags (the bell's clapper rings a beat behind). Shadows travel with the object
  instead of staying behind as an outline, and fades in exported files fade the whole icon at once.
- `@withicons/dynamic`: the render worker starts only for styles that are slow to draw, so pages with only simple styles
  never download it; `animate` durations are honoured (a 900 ms change took about 500 ms).
- Exported files (SVG, PDF, PNG, PowerPoint, Word…) no longer carry motion class names; an export with a palette some
  icons lack writes nothing half-way (those icons borrow the first icon's colours, or `--strict` fails cleanly).
- Bare jsDelivr URLs (`cdn.jsdelivr.net/npm/@withicons/web`, `…/classes`, `…/dynamic`, with or without `@latest` or a
  version range) now work: the scripts they serve load their icons from that exact version's `dist/` instead of a
  broken path one folder up.
- `@withicons/classes`: `with-all.css` no longer paints the last palette style's colours behind a one-colour icon (a line
  icon could show a kawaii fill when every style was loaded).
- Releases: `scripts/publish.mjs` publishes every package after all of its internal dependencies and the `withicons` CLI
  strictly last, and waits until each dependency is visible on the registry (0.2.1's CLI went out a few minutes before
  `@withicons/mcp`, so `npx withicons@latest` failed until it did).

### Website
- Icons page and viewer redesign: one search bar with the style and view pickers, a docked details panel (resizable,
  full screen with F, a bottom sheet on phones) with Copy image, PNG, SVG and a "Use it in code" bar for your stack, an
  action dock that stands in for those buttons only once they are scrolled out of view, palettes with an Auto background
  that suits them, a reset for colours, and every other format one tap away under "More formats".
- Icon pages: a quick-use bar (Copy image, PNG, SVG, the code line for your stack) and a developer panel with setup per
  stack and "Make it bigger or smaller".
- Live icon pages redesigned: the icon and its settings side by side, every style in one grid, an "Update it live" demo
  (timer, API polling, WebSocket, user input) that animates with `animate`, and attributes per icon.
- Home: new copy, a style carousel and code tabs for motion.
- Folder index pages (`categories/`, `styles/`, `guides/`, …) for every folder in the sitemap, lazy-loaded search, lighter
  fonts and images, and smaller off-screen work on long pages.

## 0.2.1 - 2026-10-06

### Changed
- The bundled with icons skill (CLI `withicons init`, `withicons skill`, MCP) now says the packages are on npm and the CDN, with real install lines, instead of "launching soon".
- The website no longer labels npm packages, the CDN, motion or live icons as "launching soon".

## 0.2.0 - 2026-10-05

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
