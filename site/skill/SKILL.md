---
name: with-icons
description: Icons for any web, app or UI project from the "with icons" library (withicons.com, npm @withicons/*), 500 MIT-licensed icons (SVG) in 20 styles (line, solid, duo, sketch, blueprint, glassmorphism, kawaii, sticker, pixel, retro, 3D luxe, bauhaus, skeuomorphic, anime, gothic, pastel, coquette, plush ...) for React, Vue, Svelte, Angular, SolidJS, a web component, CSS icon classes, SVG sprites and CDN. Also animated icons (@withicons/motion: loops, hover, icon swaps), live icons showing your own date, time, count or label (@withicons/dynamic), and icon files for slides, docs, print, email and social (SVG, PNG, PDF, PowerPoint, animated GIF, Lottie). Use it whenever a task needs an icon, an icon button or a set of icons (nav, sidebar, toolbar, tabs, forms, dashboards, landing pages, empty states, feature lists), the right icon name for a concept, icon search over MCP, or to replace emoji, inline SVG or another set (Lucide, Heroicons, Font Awesome, Material, Feather).
---

# with icons

500 icons, each drawn once and rendered in 20 styles. The ink is `currentColor`, the grid 24x24, the default size 24.
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
| static SVG, sprite, CMS | `npm i @withicons/static` | `<svg><use href="sprite-line.svg#with-home"/></svg>` |
| files (slides, print, email, social) | `npx withicons export <name> --format …` | section 7 |
| Node, name lookup | `npm i @withicons/core` | `resolve('bin').name` is `'trash'` |
| animation | `npm i @withicons/motion` | section 6 |
| live icons (date, count …) | `npm i @withicons/dynamic` | section 8 |

Every framework has the same props: `size` (24), `color` (`currentColor`; prefer CSS `color` on a parent), `strokeWidth`
(line, duo, blueprint, sketch, kawaii only), `absoluteStrokeWidth`, `title`, `className`/`class`; the rest is spread onto
the `<svg>`. The web component takes attributes (`variant`, not `style`; `label`, not `title`). Snippets per framework,
the props table, CDN sizes and version pinning: [reference/frameworks.md](https://github.com/withevergrow/withicons/blob/main/skills/with-icons/reference/frameworks.md).

## 2. Pick the style

- **line** (the default import path): all interface chrome. **solid**: the active/selected state and dense or tiny UI.
  **duo**: line over a soft tint (`--with-duo`) for friendlier dashboards and cards.
- Everything else is illustration, never for 16-20px controls: Crafted (gloss, engrave, blueprint, sketch) and Playful
  styles (glass, kawaii, sticker, pixel, retro) at **32px+**; Studio (luxe, bauhaus, skeuo) and Storybook styles (anime,
  gothic, pastel, coquette, plush) at **32-48px+** (each style's minimum is in styles.md).
- One style per UI region; the only routine mix is line (inactive) plus solid (active). Each style is a subpath:
  `@withicons/react/solid`, `/duo`, `/glass`, `/luxe`, `/plush` … Style words in a search pick the style
  ("cute heart" -> kawaii, "8-bit star" -> pixel).
- Multi-colour styles paint CSS variables `--with-<style>-<role>` with defaults; the ink stays `currentColor`. For a
  brand colour set the icon's **main role** (not always `c1`): `npx withicons palettes <icon> --style <style>` names it,
  and `get` / `export` take role flags (`--c1`, `--tint` …) that map to the right variables per icon.
  For one exact hex across a set, use solid or line with `color`.

Looks, minimum sizes, the choosing guide, every variable and the role mapping: [reference/styles.md](https://github.com/withevergrow/withicons/blob/main/skills/with-icons/reference/styles.md).

## 3. Names (never guess one)

- Canonical names are kebab-case (`arrow-right`); components are PascalCase, exported as `ArrowRight` and `ArrowRightIcon`.
- **Aliases** (`bin`, `house`, `gear`) resolve in name-based APIs (`<with-icon name>`, `<Icon name>`, `resolve()`,
  search, MCP) but **are not exports**: `import { Bin }` fails, use `Trash`.
- Look every name up before writing it (section 5) or read [reference/icons.md](https://github.com/withevergrow/withicons/blob/main/skills/with-icons/reference/icons.md) (all 500 names,
  categories, aliases). Common: delete/bin -> `trash`, gear -> `settings`, x/dismiss -> `close`, hamburger -> `menu`,
  house -> `home`, magnifier -> `search`, avatar -> `user-circle`.

## 4. Accessibility (every time)

1. Icon next to visible text: nothing to add; it is `aria-hidden` by default.
2. Icon-only button or link: name the control, not the icon: `<button type="button" aria-label="Delete row"><Trash /></button>`.
3. Meaningful standalone icon (status, rating): `title="Error"` (components) or `label="Error"` (web component).
4. `<i class="with …">` has no semantics: add `aria-hidden="true"` and visible or `.sr-only` text.
5. Exported SVG files contain a `<title>`: next to text use `aria-hidden="true"` inline or `alt=""` on `<img>`.
6. Never rely on the icon alone; 3:1 contrast for meaningful icons; targets of at least 24x24 px (44 on touch) via padding.

More in [reference/frameworks.md](https://github.com/withevergrow/withicons/blob/main/skills/with-icons/reference/frameworks.md#accessibility).

## 5. Find the right icon

- **MCP** (best for agents): remote `https://withicons.com/mcp` (about 200 requests per IP per 5 minutes, then HTTP 429),
  local and unlimited `npx -y @withicons/mcp` (prefer it for batch work). Tools: `search_icons`, `get_icon`,
  `resolve_icon`, `animate_icon`, `export_icon`, `list_palettes`, `list_styles`, `list_categories`; confirm with
  `tools/list`. Not connected? `npx withicons init` adds the skill and the server to the project's AI tools (`--dry-run` first).
- **CLI** `npx withicons search "throw away"` · **HTTP** `https://withicons.com/api/search?q=throw+away&limit=5` (on a
  timeout retry once, or read `https://withicons.com/icons.json`) · **offline** [reference/icons.md](https://github.com/withevergrow/withicons/blob/main/skills/with-icons/reference/icons.md)
  or `import { search, resolve } from '@withicons/core'`.
- One concept per query; if nothing fits, try a synonym, then the object you would draw, then browse the category.
- Trust `confidence` high and medium; `low` (reason "(related, low confidence)") is only related. Some words return
  nothing (`shirt`, `pram`) or only low matches (`yoga` -> dumbbell): pick the closest honest icon, label it in text,
  and never pass it off as exact. There are **no brand or social logos**: use a neutral stand-in (`camera`, `play`,
  `message-circle`, `code`) with the brand name as text or `aria-label`.

MCP client setup, every tool's arguments, the HTTP API, content gaps and search tips:
[reference/search.md](https://github.com/withevergrow/withicons/blob/main/skills/with-icons/reference/search.md).

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

Triggers, presets, swaps, TypeScript casts, checking that it runs: [reference/motion.md](https://github.com/withevergrow/withicons/blob/main/skills/with-icons/reference/motion.md).

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
- Colours are baked in and the ink defaults to black: on dark backgrounds pass `--color "#ffffff"` and the slide colour
  as `--background` (GIF), and pick an `on-dark` palette for multi-colour styles. Quote colours (`#` starts a comment).
- One look for many icons: role flags on one call (`--c1`, `--tint` …), since palette ids are per icon. Export one and
  look before the whole set.
- `pptx-animated` is one sample slide: for a deck insert GIFs. `--padding`, `--size`, `--fps`, `--name` and the rest:
  `npx withicons export --help`.

Formats per job, file names, GIF sizes, email HTML, print stroke weight: [reference/files.md](https://github.com/withevergrow/withicons/blob/main/skills/with-icons/reference/files.md).

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
Every live icon with its params, sizes and recipes: [reference/live.md](https://github.com/withevergrow/withicons/blob/main/skills/with-icons/reference/live.md).

## 9. Pitfalls

- The generic `<Icon name=…>` renders line at once and loads other styles on first use (React/Solid: wrap in `<Suspense>`; sync SSR: `await preloadStyles(...)` first): only for truly dynamic names; otherwise named imports.
- `<img src="….svg">` cannot follow `currentColor` and renders black; inline, use a component, sprite or classes.
- Sprites must be served from your own origin (cross-origin `<use href>` is blocked).
- Icon classes are CSS masks: multi-colour variables only work in components, `<with-icon>`, sprites or `with-icons.js`.
- From a CDN load only what the page shows (`cdn.js`, `with-loader.js`, `lite.js`); never `with-all.css` or
  `@withicons/web/full` on a real page. `@latest` follows releases; pin one version for a fixed look.
- Svelte 4 does not forward `on:click` to the icon (wrap it in a button); Angular `name=` needs `provideWithIcons(...)`.
- Right-to-left: mirror only directional icons (`with-rtl`, `mirror-rtl`, or a `:dir(rtl)` CSS rule on components).
- Don't mix with icons and another set in one UI region; replace the old icons one-for-one using search.

Details for each: [reference/frameworks.md](https://github.com/withevergrow/withicons/blob/main/skills/with-icons/reference/frameworks.md).

## 10. From a chat assistant (no tools, no install)

Briefs from withicons.com's "Ask AI" buttons start by sending you here and carry a `MY TASK:` line (find, code, set,
fit, slides). Do that task, search before naming anything, link `https://withicons.com/icons/<name>.html` for every
pick, and give code to developers and the page's Copy image / SVG / PNG buttons to everyone else.
What each task should return: [reference/chat.md](https://github.com/withevergrow/withicons/blob/main/skills/with-icons/reference/chat.md).
