---
name: with-icons
description: Add icons to any web, app or UI project with the "with icons" library (withicons.com, npm @withicons/*). It has 300 MIT-licensed icons in 7 styles (line, solid, duo, gloss, engrave, blueprint, sketch) for React, Vue, Svelte, Angular, SolidJS, plain HTML (web component, CSS icon classes, SVG sprites) and CDN use. Use this skill whenever a task needs an icon or icon button, icons for a nav bar, sidebar, toolbar, menu, tabs, form, table, dashboard, landing page, empty state or feature list, or the right icon name for a concept. Also use it when replacing emoji, hand-written inline SVG or another icon set (Lucide, Heroicons, Font Awesome, Material, Feather) with a consistent one.
---

# with icons

300 icons, each drawn once and rendered in 7 styles. Every icon uses `currentColor`, sits on a 24x24 grid and
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

Full snippets for each framework are in [reference/frameworks.md](reference/frameworks.md).

## 2. Choose the style

- **line** (default import path) is a 1.75px outline. Use it for all interface chrome: nav, buttons, inputs, tables.
- **solid** is the filled companion. Use it for active/selected states (line for inactive tabs, solid for the active one), and for small or dense UI.
- **duo** is line over a soft tint (`--with-duo` recolours it). Use it for friendlier dashboards, cards and onboarding.
- **gloss, engrave, blueprint, sketch** are *creative* styles for illustration: hero sections, feature grids,
  empty states, marketing and slides, at **32px or larger**. Do not use them for 16-20px UI controls.

Rule: one style per UI region. The only routine mix is line plus solid for inactive and active states. Every style is a subpath:
`@withicons/react/solid`, `/duo`, `/gloss`, `/engrave`, `/blueprint`, `/sketch`. More in [reference/styles.md](reference/styles.md).

## 3. Names

- Canonical names are kebab-case (`arrow-right`, `shopping-cart`, `check-circle`). Components are PascalCase,
  exported twice: `ArrowRight` and `ArrowRightIcon`. Deep import: `@withicons/react/icons/arrow-right`.
- **Aliases** are words people guess (`bin`, `house`, `gear`). They resolve in name-based APIs (`<with-icon name>`,
  `<Icon name>`, `resolve()`, search, MCP) but **are not exports**. A named import must use the canonical name.
- **Never guess an import name.** Look it up first: search (section 6) or [reference/icons.md](reference/icons.md)
  (all 300 names with categories and aliases). Common mappings: delete/bin → `trash`, settings/gear → `settings`,
  x/dismiss → `close`, hamburger → `menu`, house → `home`, magnifier → `search`, avatar → `user-circle`.

## 4. Props (identical across React, Vue, Svelte, Solid and Angular)

| prop | default | notes |
|---|---|---|
| `size` | `24` | number (px) or CSS length |
| `color` | `currentColor` | omit it and set CSS `color` on a parent instead |
| `strokeWidth` | style default (1.75) | only line, duo, blueprint, sketch |
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
  which returns SVG or a framework snippet), `resolve_icon` (alias or typo to canonical name), `list_styles`, `list_categories`.
  Call `tools/list` to confirm names and arguments.
  Not connected yet? `npx withicons init` adds this skill and the server to the AI tools it finds in the project
  (Claude Code, Codex, Cursor, OpenCode, VS Code, Windsurf); name one (`npx withicons init cursor`) or add `--global`.
- **CLI**: `npx withicons search "throw away"`
- **HTTP**: `curl "https://withicons.com/api/search?q=throw+away&limit=5"` returns JSON with name, score and match.
- **Offline**: [reference/icons.md](reference/icons.md), `https://withicons.com/icons.json`, `https://withicons.com/llms.txt`,
  or `import { search, resolve } from '@withicons/core'`.

MCP client setup and response shapes are in [reference/search.md](reference/search.md).

## 7. Pitfalls

- `import { Bin } from '@withicons/react'` fails because aliases are not exports. Resolve to `Trash` first.
- The generic `<Icon name=... variant=...>` component bundles **all 2,100 icons**. Use it only for truly dynamic names
  (CMS data). Otherwise use named imports, which tree-shake down to the icons you use.
- `<img src=".../home.svg">` cannot inherit `currentColor` and renders black. Inline the SVG, use the component,
  the sprite or the classes when the colour must follow text.
- SVG sprites must be served from **your own origin**. Browsers block cross-origin `<use href>`.
- Icon classes are single-colour CSS masks: duo tint and blueprint accents render as translucent `currentColor`.
  Use components or the web component for real two-tone.
- `strokeWidth` does nothing on solid, gloss and engrave.
- Pin CDN versions in production: `https://cdn.jsdelivr.net/npm/@withicons/web@0.1/dist/index.js`.
- Svelte 4: `on:click` is not forwarded to the icon. Wrap it in a `<button>`.
- Angular `name=` usage needs `provideWithIcons(...)` registration. Passing `[icon]` needs none.
- Packages are `0.x`: check `npm view @withicons/react version` if an install fails. The site offers direct SVG
  downloads as a fallback.
- Don't mix with icons and another icon set in the same UI region. Replace the old set's icons one-for-one using search.

## 8. Using with icons from a chat assistant (no tools, no install)

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
