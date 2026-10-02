---
name: with-icons
description: Add icons to any web, app or UI project with the "with icons" library (withicons.com, npm @withicons/*). It has 500 MIT-licensed icons in 12 styles (line, solid, duo, gloss, engrave, blueprint, sketch, plus the multi-colour glass, kawaii, sticker, pixel and retro) for React, Vue, Svelte, Angular, SolidJS, plain HTML (web component, CSS icon classes, SVG sprites) and CDN use, and optional animations (@withicons/motion: continuous loops, hover effects, icon-to-icon swaps). Use this skill whenever a task needs an icon or icon button, icons for a nav bar, sidebar, toolbar, menu, tabs, form, table, dashboard, landing page, empty state or feature list, an animated or cute/retro/pixel/glassmorphism icon, or the right icon name for a concept. Also use it when replacing emoji, hand-written inline SVG or another icon set (Lucide, Heroicons, Font Awesome, Material, Feather) with a consistent one.
---

# with icons

500 icons, each drawn once and rendered in 12 styles. Every icon uses `currentColor` for its ink, sits on a 24x24 grid and
has a default size of 24. Site: https://withicons.com · Repo: https://github.com/withevergrow/withicons · MIT.

## 1. Choose the package for the stack

| project | install | use |
|---|---|---|
| React / Next.js / Remix | `npm i @withicons/react` | `import { Home } from '@withicons/react'` then `<Home />` |
| Vue 3 / Nuxt | `npm i @withicons/vue` | `import { Home } from '@withicons/vue'` then `<Home />` |
| Svelte 4/5 / SvelteKit | `npm i @withicons/svelte` | `import { Home } from '@withicons/svelte'` then `<Home />` |
| Angular 17+ | `npm i @withicons/angular` | `imports: [WithIconComponent]` then `<with-icon [icon]="Home" />` |
| SolidJS | `npm i @withicons/solid` | `import { Home } from '@withicons/solid'` then `<Home />` |
| any HTML, Astro, Lit, no build | CDN script | `<with-icon name="home"></with-icon>` |
| Font Awesome-style classes | CDN stylesheet | `<i class="with with-home"></i>` |
| static SVG / sprite / email / CMS | `npm i @withicons/static` | `<svg><use href="sprite-line.svg#with-home"/></svg>` |
| Node, build scripts, name lookup | `npm i @withicons/core` | `resolve('bin').name` returns `'trash'` |
| animation (any of the above) | `npm i @withicons/motion` | `<span class="wm wm-loop" data-wm="bell">…icon…</span>` (section 7) |

Full snippets for each framework are in [reference/frameworks.md](https://github.com/withevergrow/withicons/blob/main/skills/with-icons/reference/frameworks.md).

## 2. Choose the style

- **line** (default import path) is a 1.75px outline. Use it for all interface chrome: nav, buttons, inputs, tables.
- **solid** is the filled companion. Use it for active/selected states (line for inactive tabs, solid for the active one), and for small or dense UI.
- **duo** is line over a soft tint (`--with-duo` recolours it). Use it for friendlier dashboards, cards and onboarding.
- **gloss, engrave, blueprint, sketch** are *creative* styles for illustration: hero sections, feature grids,
  empty states, marketing and slides, at **32px or larger**. Do not use them for 16-20px UI controls.
- **glass, kawaii, sticker, pixel, retro** are *palette* styles: full colour out of the box, for brands, landing pages,
  stickers, slides, games and social posts, at **32px or larger**.
  - **glass**: layered frosted glass (glassmorphism); modern SaaS heroes, fintech, OS-like UIs, dark gradients.
  - **kawaii**: chubby, soft, with a tiny face and blush; cozy apps, journaling, kids, wellness, Gen Z audiences.
  - **sticker**: Y2K die-cut sticker with a white border and sparkles; scrapbook, social, creator and fandom vibes.
  - **pixel**: crisp 8-bit pixel art; games, retro tech, playful dev tools.
  - **retro**: 70s sunset stripes, chunky outline and offset shadow; vintage brands, music, food, posters.
  Their colours are CSS variables with defaults (`--with-<style>-<role>`, listed in [reference/styles.md](https://github.com/withevergrow/withicons/blob/main/skills/with-icons/reference/styles.md));
  the ink stays `currentColor`. Re-theme with CSS on any parent: `.hero { --with-kawaii-body: #c4b5fd }`.

Rule: one style per UI region. The only routine mix is line plus solid for inactive and active states. Every style is a subpath:
`@withicons/react/solid`, `/duo`, `/gloss`, `/engrave`, `/blueprint`, `/sketch`, `/glass`, `/kawaii`, `/sticker`, `/pixel`, `/retro`.
Style words in a search pick the style ("cute heart" -> kawaii, "8-bit star" -> pixel, "frosted bell" -> glass, "y2k" -> sticker,
"vintage camera" -> retro). More in [reference/styles.md](https://github.com/withevergrow/withicons/blob/main/skills/with-icons/reference/styles.md).

## 3. Names

- Canonical names are kebab-case (`arrow-right`, `shopping-cart`, `check-circle`). Components are PascalCase,
  exported twice: `ArrowRight` and `ArrowRightIcon`. Deep import: `@withicons/react/icons/arrow-right`.
- **Aliases** are words people guess (`bin`, `house`, `gear`). They resolve in name-based APIs (`<with-icon name>`,
  `<Icon name>`, `resolve()`, search, MCP) but **are not exports**. A named import must use the canonical name.
- **Never guess an import name.** Look it up first: search (section 6) or [reference/icons.md](https://github.com/withevergrow/withicons/blob/main/skills/with-icons/reference/icons.md)
  (all 500 names with categories and aliases). Common mappings: delete/bin → `trash`, settings/gear → `settings`,
  x/dismiss → `close`, hamburger → `menu`, house → `home`, magnifier → `search`, avatar → `user-circle`.

## 4. Props (identical across React, Vue, Svelte, Solid and Angular)

| prop | default | notes |
|---|---|---|
| `size` | `24` | number (px) or CSS length |
| `color` | `currentColor` | omit it and set CSS `color` on a parent instead |
| `strokeWidth` | style default (1.75) | only styles with live strokes: line, duo, blueprint, sketch, kawaii |
| `absoluteStrokeWidth` | `false` | keeps stroke px constant when scaled |
| `title` | none | adds `<title>` and `role="img"`; without it the svg is `aria-hidden="true"` |
| `className` / `class` | none | appended to `withi withi-<name>` |

Everything else (`onClick`, `style`, `data-*`, `aria-*`) is spread onto the `<svg>`. The web component uses attributes:
`name variant size color stroke-width absolute-stroke-width label` (it uses `variant`, not `style`).

## 5. Accessibility (do this every time)

1. **Decorative icon next to visible text**: nothing to add. It is `aria-hidden` by default.
2. **Icon-only button or link**: put the accessible name on the control, not on the icon:
   `<button type="button" aria-label="Delete row"><Trash /></button>`.
3. **Standalone meaningful icon** (status, rating): pass `title="Error"` (components) or `label="Error"` (web component).
4. Icon classes (`<i class="with ...">`) have no semantics. Add `aria-hidden="true"` and visible or `.sr-only` text.
5. Never rely on the icon alone for meaning in forms or errors. Keep 3:1 contrast for meaningful icons, and give
   icon-only controls a target of at least 24x24 CSS px (44 recommended on touch) using padding, not a bigger icon.

## 6. Find the right icon

Use the first one available, in this order:

- **MCP** (best for agents). Remote: `https://withicons.com/mcp` (Streamable HTTP). Local: `npx -y @withicons/mcp`.
  Tools: `search_icons` (query, then ranked names plus ready-to-paste import/usage), `get_icon` (name + style + format,
  which returns SVG or a framework snippet), `animate_icon` (name + trigger loop/hover/once/inview/swap + format, which returns
  animation code), `resolve_icon` (alias or typo to canonical name), `list_styles`, `list_categories`.
  Call `tools/list` to confirm names and arguments.
  Not connected yet? `npx withicons init` adds this skill and the server to the AI tools it finds in the project
  (Claude Code, Codex, Cursor, OpenCode, VS Code, Windsurf); name one (`npx withicons init cursor`) or add `--global`.
- **CLI**: `npx withicons search "throw away"`
- **HTTP**: `curl "https://withicons.com/api/search?q=throw+away&limit=5"` returns JSON with name, score and match.
- **Offline**: [reference/icons.md](https://github.com/withevergrow/withicons/blob/main/skills/with-icons/reference/icons.md), `https://withicons.com/icons.json`, `https://withicons.com/llms.txt`,
  or `import { search, resolve } from '@withicons/core'`.

MCP client setup and response shapes are in [reference/search.md](https://github.com/withevergrow/withicons/blob/main/skills/with-icons/reference/search.md).

## 7. Animate (optional, separate package)

Animations live in `@withicons/motion` (pure CSS + an optional tiny JS API), so icons never pay for them. They wrap the
element that holds the icon, so they work with every style and every package. Ask the MCP `animate_icon` tool (or
`npx withicons animate <name> --trigger hover --format react`) for paste-ready code; the icon pages on withicons.com have
an editor with live previews.

```jsx
import '@withicons/motion/motion.css'   // presets
import '@withicons/motion/icons.css'    // each icon's tuned motion (pivot, direction, timing)

<span className="wm wm-loop" data-wm="loader"><Loader /></span>                                   {/* continuous */}
<button className="wm-trigger" aria-label="Alerts"><span className="wm wm-hover" data-wm="bell"><Bell /></span></button>  {/* on hover/focus */}
<span className="wm wm-loop wm-p-float" style={{ '--wm-dur': '3s' }}><Cloud /></span>               {/* any preset */}
<span className={'wm-swap wm-fx-morph' + (playing ? ' is-on' : '')}><Play className="wm-a" /><Pause className="wm-b" /></span>  {/* icon to icon */}
```

- Triggers: `wm-loop` (continuous), `wm-hover` (one-shot on hover/focus of the icon or of a `.wm-trigger` ancestor),
  `wm-once` (on load), `wm-inview` (JS). Presets: `wm-p-<preset>` (spin, pulse, beat, float, bounce, ring, wiggle, shake,
  nudge, pop, tada, flip, glow, draw…). Swap effects: `wm-fx-<effect>` (fade, scale, rotate, flip, slide-up, blur, morph…).
- Use motion to explain state or invite action (loading, new notification, like, play/pause, menu/close); keep loops on
  one or two icons per screen. `prefers-reduced-motion` turns everything off automatically.
- An animated icon is still decorative: keep the accessible name on the button, never in the animation.
  Full list of tuned icons: [reference/motion.md](https://github.com/withevergrow/withicons/blob/main/skills/with-icons/reference/motion.md).

## 8. Pitfalls

- `import { Bin } from '@withicons/react'` fails because aliases are not exports. Resolve to `Trash` first.
- The generic `<Icon name=... variant=...>` component bundles **all 6,500 icons**. Use it only for truly dynamic names
  (CMS data). Otherwise use named imports, which tree-shake down to the icons you use.
- `<img src=".../home.svg">` cannot inherit `currentColor` and renders black. Inline the SVG, use the component,
  the sprite or the classes when the colour must follow text.
- SVG sprites must be served from **your own origin**. Browsers block cross-origin `<use href>`.
- Icon classes are CSS masks: duo tint and blueprint accents render as translucent `currentColor`. Palette styles keep
  their default colours in classes, but their `--with-<style>-*` variables only work in components, `<with-icon>`, sprites or `with-icons.js`.
- Standalone `.svg` files (CDN, `@withicons/static`, `get_icon` with `flat: true`) have the palette baked in, which is what
  Figma, PowerPoint, Keynote and image converters need. Inline code keeps the variables.
- Don't put palette styles, loops or creative styles in dense 16-20px controls: they turn to noise.
- `strokeWidth` only affects styles with live strokes (line, duo, blueprint, sketch, kawaii); it does nothing on the filled styles.
- Pin CDN versions in production: `https://cdn.jsdelivr.net/npm/@withicons/web@0.1/dist/index.js`.
- Svelte 4: `on:click` is not forwarded to the icon. Wrap it in a `<button>`.
- Angular `name=` usage needs `provideWithIcons(...)` registration. Passing `[icon]` needs none.
- Packages are `0.x`: check `npm view @withicons/react version` if an install fails. The site offers direct SVG
  downloads as a fallback.
- Don't mix with icons and another icon set in the same UI region. Replace the old set's icons one-for-one using search.

## 9. Using with icons from a chat assistant (no tools, no install)

People often arrive from withicons.com's "Ask AI" buttons (Claude, ChatGPT, Gemini, Perplexity, Grok) with a brief whose
first line sends you here. Each brief has a `MY TASK:` line. Do that task:

- **find** (next to every search box): the person describes what the icon is for ("a button that clears the cart in my
  grocery app"), sometimes with the site's own top matches. Reply with the single best fit (exact name + one line on why
  their users will read it right), up to 2 alternatives, the best style for the context, ready-to-paste code for their
  stack or steps for their app, and a link to each pick. Ask ONE short question first if the meaning or stack is unclear.
- **code** (icon page, one named icon + style): exact code for their stack, size and colour, the aria-label (or
  `aria-hidden`) and tooltip wording, hover/focus/active/disabled states (line to solid for toggles), one pitfall.
- **set**: the 4-8 icons that belong beside that icon on their screen or flow, all in one style, size and stroke, why
  each is needed, and any meaning the library lacks with the closest substitute.
- **fit**: an honest verdict on whether that icon says what they mean: how people will read it, ambiguity or cultural
  issues, whether it needs a text label, and up to 3 better options from the library.
- **slides** (icon page or an app guide): which file to grab from the icon page (Copy image; SVG to recolour in
  PowerPoint, Keynote, Figma, Canva; PNG at 256 px for slides, 1024 px for print), how to insert, recolour and resize it
  in their app, layout tips, and the guide `https://withicons.com/guides/<app>.html` (powerpoint, google-slides, keynote,
  canva, figma, notion, word-google-docs, wordpress, webflow, framer, wix-squarespace, email-signatures, html).

Always: search before naming anything (section 6), link `https://withicons.com/icons/<name>.html` for every pick, and
until the npm packages launch, offer the page's Copy image, SVG/PNG download and Copy SVG code (say packages and the
`<i class="with with-NAME">` CDN classes are launching soon). The full brief templates are in https://withicons.com/llms.txt.
