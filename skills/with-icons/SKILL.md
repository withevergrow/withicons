---
name: with-icons
description: Icons for any web, app or UI project from the "with icons" library (withicons.com, npm @withicons/*), 734 MIT-licensed icons in 34 styles: line, solid, duo, office suite, 3D (clay, glass, liquid glass, chrome, soft 3D, luxe, skeuomorphic), brand (bento, app-dock tiles, neo-brutalism, bauhaus), playful (kawaii, plush, sticker, pastel, pixel, retro), artistic (sketch, engrave, blueprint, anime, gothic, coquette) and holiday styles (Diwali, Holi, Halloween, Christmas, Lunar New Year, Valentine's). React, Vue, Svelte, Angular, SolidJS, web component, CSS classes, sprites, CDN, download-all zips. Festival icons, inclusive avatars, animated and 3D icons (@withicons/motion), live date or count icons (@withicons/dynamic), files for slides, print, email and social (SVG, PNG, PDF, PowerPoint, GIF, Lottie). Use it whenever a task needs an icon, icon set or avatar, the right icon name or style for a job, icon search over MCP, or to replace emoji, inline SVG or another set (Lucide, Heroicons, Font Awesome).
---

# with icons

734 icons, each drawn once and rendered in 34 styles. The ink is `currentColor`, the grid 24x24, the default size 24.
Site https://withicons.com · repo https://github.com/withevergrow/withicons · MIT. Detail lives in `reference/`; read
the file a rule links to before going beyond the rule.

## 1. Pick the package

| project | install | use |
|---|---|---|
| React / Next.js / Remix | `npm i @withicons/react` | `import { Home } from '@withicons/react'` then `<Home />` |
| Vue 3 / Nuxt | `npm i @withicons/vue` | same named imports |
| Svelte 4/5 | `npm i @withicons/svelte` | same named imports |
| Angular 17+ | `npm i @withicons/angular` | `imports: [WithIconComponent]`, `<with-icon [icon]="Home" />` |
| SolidJS | `npm i @withicons/solid` | same named imports |
| any HTML, no build | CDN `@withicons/web/dist/cdn.js` | `<with-icon name="home"></with-icon>` |
| Font Awesome-style classes | CDN `@withicons/classes/dist/with-loader.js` | `<i class="with with-home"></i>` |
| static SVG, sprite, CMS | `npm i @withicons/static` (newer styles: `static-plus`) | `<svg><use href="sprite-line.svg#with-home"/></svg>` |
| a whole style as files | `https://withicons.com/downloads/with-icons-<style>.zip` | every SVG + an offline searchable viewer |
| files (slides, print, email, social) | `npx withicons export <name> --format …` | section 7 |
| Node, name lookup | `npm i @withicons/core` | `resolve('bin').name` is `'trash'` |
| animation (also 3D) | `npm i @withicons/motion` | section 6 |
| live icons (date, count …) | `npm i @withicons/dynamic` | section 8 |

Every framework package, `<with-icon>` and the class loader carry all 34 styles (they fetch companions themselves).
Only raw files are split: the newest styles' SVGs and node data are in `@withicons/core-plus`, `soft3d` and `holiday`,
prebuilt SVGs and sprites in `static-plus`, classes in `classes-plus` / `soft3d` / `holiday` (so soft3d's SVGs and nodes are in
`@withicons/soft3d`, its sprite `sprite-soft3d.svg` in `@withicons/static-plus`): see
[frameworks.md](reference/frameworks.md#where-the-newest-styles-live-core-files-and-icon-classes) for any file's URL.

Every framework has the same props: `size` (24), `color` (`currentColor`; prefer CSS `color` on a parent), `strokeWidth`
(line, duo, blueprint, sketch, kawaii only), `absoluteStrokeWidth`, `title`, `className`/`class`; the rest is spread onto
the `<svg>`. The web component takes attributes (`variant`, not `style`; `label`, not `title`). Snippets per framework,
the props table, CDN sizes and version pinning: [reference/frameworks.md](reference/frameworks.md).

## 2. Pick the style

Six groups, named for what people make. Use ONE style per page or UI region (the only routine mix: line for inactive,
solid for active). Each style is a subpath with the same export names: `@withicons/react/solid`, `/clay`, `/christmas` …

| group | styles | for |
|---|---|---|
| Essentials | line, solid, duo, suite | app and web UI, docs, dashboards, slides; only line, solid and duo go in 16-24px controls |
| Product & brand | bento, dock, brutal, bauhaus | SaaS landing pages, feature grids, app tiles, bold startup and poster looks |
| 3D & glass | clay, glass, liquid, chrome, soft3d, luxe, skeuo | AI products, heroes, launches, premium brands, soft 3D hero art and avatars |
| Playful | kawaii, plush, sticker, gloss, pastel, pixel, retro | kids, games, social posts, cosy and wellness apps |
| Artistic | sketch, engrave, blueprint, anime, gothic, coquette | print, editorial, education, fandom, themed designs |
| Holidays | utsav, rangoli, halloween, christmas, lunar, valentine | festive campaigns, seasonal themes, greetings, sale banners |

**What are you making?** (best first; full list in [styles.md](reference/styles.md#what-are-you-making), MCP
`recommend_styles`): app or website: line, duo, solid · slides: solid, duo, suite · SaaS landing page: bento, soft3d, duo ·
AI product: clay, liquid, chrome · premium: glass, luxe · playful: kawaii, plush, sticker · print: engrave, sketch,
blueprint · a festival: its holiday style.

- **Festivals**: Diwali, Durga Puja, Holi -> `rangoli` (clean, brand-friendly) or `utsav` (ornate); Halloween ->
  `halloween`; Christmas -> `christmas`; Lunar New Year -> `lunar`; Valentine's, weddings -> `valentine`. Pair them with
  the 95 festival icons (categories `indian-festivals`, `christmas`, `lunar-new-year`, `valentines`, `halloween`: `diya`,
  `red-lantern`, `jack-o-lantern` …) and everyday ones (`shopping-bag`, `tag`). Switch festivals by palette (`holi`,
  `diwali`, `nordic` …: every colour in [styles.md](reference/styles.md#holiday-palettes); CLI `--colors "…"`, since
  `--palette` takes per-icon ids only).
- **Avatars** (category `avatars`, 40 `avatar-*`): people, animals, friendly monsters. In every person c1 is the skin and
  c2 the hair (or turban, cap), so one tone picker fits all ([skin tones](reference/styles.md#avatar-skin-tones));
  offer several, never one default skin tone. Role-named styles keep the roles stable: plush, clay, pastel; duo or line
  for small UI.
- **Duo** has an accent colour (`--with-duo-accent`: the icon's badge, plus or slash, else an inner part like a bell's clapper) and two presets: "Duo with an accent"
  (`--with-duo: #6B70F7; --with-duo-accent: #6B70F7`, strokeWidth 1.5) works in every package; "Duo gradient" (lines
  swept indigo to pink) is made only in the studio (`withicons.com/icons/<name>.html?style=duo#studio`), whose downloads bake it into the file (no package or
  CLI API yet: use the downloaded file as an image). [styles.md](reference/styles.md#duo-presets).
- Sizes: line and solid from 12px, duo 18px; everything else is illustration at **32px+** (luxe, skeuo, gothic, plush 48px).
- Colour: multi-colour styles paint CSS variables `--with-<style>-<role>` with defaults (role-named styles also give the
  outline its own `--with-<style>-ink`; elsewhere the ink is `currentColor`).
  For a brand colour set the icon's **main role**: `npx withicons palettes <icon> --style <style>` names it, and
  `get` / `export` take role flags (`--c1`, `--tint` …). For one exact hex across a set, use solid or line with `color`.
- Rich styles draw gradients in one `<defs>` (ids `wg-<style>-<icon>-<n>`, made unique per instance by every package).

Looks, minimum sizes, every variable, holiday palettes and Duo presets: [reference/styles.md](reference/styles.md).

## 3. Names (never guess one)

- Canonical names are kebab-case (`arrow-right`); components are PascalCase, exported as `ArrowRight` and `ArrowRightIcon`.
- **Aliases** (`bin`, `house`, `gear`) resolve in name-based APIs (`<with-icon name>`, `<Icon name>`, `resolve()`,
  search, MCP) but **are not exports**: `import { Bin }` fails, use `Trash`.
- Look every name up before writing it (section 5) or read [reference/icons.md](reference/icons.md) (all 734 names,
  categories, aliases). Common: delete/bin -> `trash`, gear -> `settings`, x/dismiss -> `close`, hamburger -> `menu`,
  house -> `home`, magnifier -> `search`, profile picture -> `user-circle` or an `avatar-*` icon.

## 4. Accessibility (every time)

1. Icon next to visible text: nothing to add; it is `aria-hidden` by default.
2. Icon-only button or link: name the control, not the icon: `<button type="button" aria-label="Delete row"><Trash /></button>`.
3. Meaningful standalone icon (status, rating): `title="Error"` (components) or `label="Error"` (web component).
4. `<i class="with …">` has no semantics: add `aria-hidden="true"` and visible or `.sr-only` text.
5. Exported SVG files contain a `<title>`: next to text use `aria-hidden="true"` inline or `alt=""` on `<img>`.
6. Never rely on the icon alone; 3:1 contrast for meaningful icons; targets of at least 24x24 px (44 on touch) via padding.

More in [reference/frameworks.md](reference/frameworks.md#accessibility).

## 5. Find the right icon

- **MCP** (best for agents): remote `https://withicons.com/mcp` (about 200 requests per IP per 5 minutes, then HTTP 429),
  local and unlimited `npx -y @withicons/mcp` (prefer it for batch work). Tools: `search_icons`, `get_icon`,
  `resolve_icon`, `recommend_styles` (best styles for a job, a festival or an audience, with packages, presets and
  palettes), `animate_icon`, `export_icon`, `list_palettes`, `list_styles` (grouped), `list_categories`; confirm with
  `tools/list`. Not connected? `npx withicons init` adds the skill and the server to the project's AI tools (`--dry-run` first).
- **CLI** `npx withicons search "throw away"` · **HTTP** `https://withicons.com/api/search?q=throw+away&limit=5` (on a
  timeout retry once, or read `https://withicons.com/icons.json`) · **offline** [reference/icons.md](reference/icons.md)
  or `import { search, resolve } from '@withicons/core'`.
- One concept per query; if nothing fits, try a synonym, then the object you would draw, then browse the category.
- Trust `confidence` high and medium; `low` (reason "(related, low confidence)") is only related. Some words return
  nothing (`shirt`, `pram`) or only low matches (`yoga` -> dumbbell): pick the closest honest icon, label it in text,
  and never pass it off as exact. There are **no brand or social logos**: use a neutral stand-in (`camera`, `play`,
  `message-circle`, `code`) with the brand name as text or `aria-label`.

MCP client setup, every tool's arguments, the HTTP API, content gaps and search tips:
[reference/search.md](reference/search.md).

## 6. Animate (optional, `@withicons/motion`)

Pure CSS (plus a tiny JS API) that wraps the element holding the icon, so it works with every style and package.
Get paste-ready code from MCP `animate_icon` or `npx withicons animate <name> --trigger hover --format react`.

```jsx
import '@withicons/motion/motion.css'   // presets
import '@withicons/motion/icons.css'    // every icon's tuned motion (or one CDN file per icon: dist/icons/<name>.css)
<span className="wm wm-loop" data-wm="loader"><Loader /></span>
<button className="wm-trigger" aria-label="Alerts"><span className="wm wm-hover" data-wm="bell"><Bell /></span></button>
<span className={'wm-swap wm-fx-morph' + (playing ? ' is-on' : '')}><Play className="wm-a" /><Pause className="wm-b" /></span>
```

- `<with-icon>` uses the `motion` attribute plus `@withicons/motion/dist/element.js`, never a `.wm` wrapper (its svg
  is in a shadow root). Wrappers are for inline SVG, components, live icons and `<i>` classes.
- Motion explains state or invites action; one or two loops per screen; no hover on touch (prefer `wm-inview` /
  `wm-once`). Reduced motion turns everything off. The accessible name stays on the button.
- **3D**: in clay, glass, liquid, chrome, soft3d, luxe, skeuo, dock and plush the icon's motion plays in 3D (turns, lifts,
  lands). `<with-icon variant="clay" motion="loop">` does it itself; wrappers add `wm-3d`. soft3d has 3-5 moves per icon
  (`npx withicons motions <icon> --style soft3d`, MCP `animate_icon` `moves`). Exports of a 3D style move in 3D too.
- Scroll-triggered in React and other frameworks: `motion(el, name, { trigger: 'inview', style })` from
  `@withicons/motion` in an effect, `m.destroy()` on unmount (`.wm-inview` in markup alone does nothing; motion.md).

Triggers, presets, swaps, TypeScript casts, checking that it runs: [reference/motion.md](reference/motion.md).

## 7. Files for slides, print, email, docs and social

When the result is a deck, document, print file, email or post, give FILES, not code (Node 18+, no browser):

```bash
npx withicons export truck package home --format svg-flat,png,pdf --out icons
npx withicons export bell --format gif --background "#ffffff" --out slides      # animated, loops forever
npx withicons export rocket --style luxe --format pptx-animated --background "#0f172a" --color "#ffffff"
```

MCP `export_icon` takes the same options in snake_case (`out_dir` on the local server). The remote server answers
PNG-based and animated formats with the `npx withicons export …` command to run.

- Slides and design tools: `svg-flat` or `png`; print: `pdf`, `eps` or `svg-flat` (never PNG); email: PNG at 2x,
  hosted on your https URLs (never SVG); a moving icon: `gif` (plays in PowerPoint, Keynote, Google Slides, Gmail, Slack).
- Colours are baked in; a `currentColor` ink becomes black (role-named styles keep their own ink colour): on dark backgrounds pass `--color "#ffffff"` and the slide colour
  as `--background` (GIF), and pick an `on-dark` palette for multi-colour styles. Quote colours (`#` starts a comment).
- One look for many icons: role flags on one call (`--c1`, `--tint` …), since palette ids are per icon. Export one and
  look before the whole set.
- A whole style for designers or no-code: `https://withicons.com/downloads/with-icons-<style>.zip` (every SVG + an offline
  searchable viewer), `with-icons-all.zip` for every style. A festive campaign: export in its holiday style (`--style rangoli`).
- `pptx-animated` is one sample slide: for a deck insert GIFs. `--padding`, `--size`, `--fps`, `--name` and the rest:
  `npx withicons export --help`.

Formats per job, file names, GIF sizes, email HTML, print stroke weight: [reference/files.md](reference/files.md).

## 8. Live icons (content you set, `@withicons/dynamic`)

Up to 50 icons that draw a value inside: a calendar's date, a clock's time, a badge count, a battery level, a short label
(max 4 characters; counts show "99+"). They render in every style.

```html
<script src="https://cdn.jsdelivr.net/npm/@withicons/dynamic@latest/dist/cdn/lite.js"></script>
<with-live-icon name="calendar-date" today label="Today"></with-live-icon>
<with-live-icon name="bell-count" count="3" animate label="3 unread"></with-live-icon>
```

React / Vue: `import { LiveIcon } from '@withicons/dynamic/react'` (or `/vue`), `<LiveIcon name="bell-count" count={n} animate />`.
Pure function: `render(name, params, style)` from `@withicons/dynamic` (never reads the clock: pass `now()`). Change a
value by setting the attribute or prop; in React never change the `key` to replay. Vite needs `worker: { format: 'es' }`.
Every live icon with its params, sizes and recipes: [reference/live.md](reference/live.md).

## 9. Pitfalls

- The generic `<Icon name=…>` renders line at once and loads other styles on first use (React/Solid: wrap in `<Suspense>`; sync SSR: `await preloadStyles(...)` first): only for truly dynamic names; otherwise named imports.
- `<img src="….svg">` cannot follow `currentColor` and renders black; inline, use a component, sprite or classes.
- Sprites must be served from your own origin (cross-origin `<use href>` is blocked).
- Icon classes are CSS masks: multi-colour variables only work in components, `<with-icon>`, sprites or `with-icons.js`.
- From a CDN load only what the page shows (`cdn.js`, `with-loader.js`, `lite.js`); never `with-all.css` or
  `@withicons/web/full` on a real page. `@latest` follows releases; pin one version for a fixed look. React, Vue or
  Solid from an ESM CDN: name the icons (`https://esm.sh/@withicons/react?exports=Home,Search`), never a bare style URL.
- Svelte 4 does not forward `on:click` to the icon (wrap it in a button); Angular `name=` needs `provideWithIcons(...)`.
- Right-to-left: mirror only directional icons (`with-rtl`, `mirror-rtl`, or a `:dir(rtl)` CSS rule on components).
- Don't mix with icons and another set in one UI region; replace the old icons one-for-one using search.

Details for each: [reference/frameworks.md](reference/frameworks.md).

## 10. From a chat assistant (no tools, no install)

Briefs from withicons.com's "Ask AI" buttons start by sending you here and carry a `MY TASK:` line (find, code, set,
fit, slides). Do that task, search before naming anything, link `https://withicons.com/icons/<name>.html` for every
pick, and give code to developers and the page's Copy image / SVG / PNG buttons to everyone else.
What each task should return: [reference/chat.md](reference/chat.md).
