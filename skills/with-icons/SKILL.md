---
name: with-icons
description: Add icons to any web, app or UI project with the "with icons" library (withicons.com, npm @withicons/*). It has 500 MIT-licensed icons in 20 styles (line, solid, duo, gloss, engrave, blueprint, sketch, plus the multi-colour glass, kawaii, sticker, pixel, retro, the studio styles luxe (premium 3D), bauhaus and skeuo (skeuomorphic), and the storybook styles anime, gothic, pastel, coquette and plush (stuffed toys for kids)) for React, Vue, Svelte, Angular, SolidJS, plain HTML (web component, CSS icon classes, SVG sprites) and CDN use, optional animations (@withicons/motion: continuous loops, hover effects, icon-to-icon swaps; also exported as animated GIF / APNG / SVG / PowerPoint / Lottie files for slides and docs), and live icons whose content you set (@withicons/dynamic: a calendar showing a date, a clock showing a time, a notification count, a battery level, a short label). Use this skill whenever a task needs an icon or icon button, icons for a nav bar, sidebar, toolbar, menu, tabs, form, table, dashboard, landing page, empty state or feature list, an animated or cute/retro/pixel/glassmorphism/3D/Bauhaus/skeuomorphic/anime/gothic/pastel/coquette/kids icon, a calendar/clock/badge/battery icon with its own date, time, number or text, an icon file (SVG, PNG, PDF, PowerPoint) or an animated icon for slides, a deck, a document, email or social (GIF, animated PowerPoint, Lottie), or the right icon name for a concept. Also use it when replacing emoji, hand-written inline SVG or another icon set (Lucide, Heroicons, Font Awesome, Material, Feather) with a consistent one.
---

# with icons

500 icons, each drawn once and rendered in 20 styles. Every icon uses `currentColor` for its ink, sits on a 24x24 grid and
has a default size of 24. Site: https://withicons.com · Repo: https://github.com/withevergrow/withicons · MIT.

## 1. Choose the package for the stack

| project | install | use |
|---|---|---|
| React / Next.js / Remix | `npm i @withicons/react` | `import { Home } from '@withicons/react'` then `<Home />` |
| Vue 3 / Nuxt | `npm i @withicons/vue` | `import { Home } from '@withicons/vue'` then `<Home />` |
| Svelte 4/5 / SvelteKit | `npm i @withicons/svelte` | `import { Home } from '@withicons/svelte'` then `<Home />` |
| Angular 17+ | `npm i @withicons/angular` | `imports: [WithIconComponent]` then `<with-icon [icon]="Home" />` |
| SolidJS | `npm i @withicons/solid` | `import { Home } from '@withicons/solid'` then `<Home />` |
| any HTML, Astro, Lit, no build | CDN script `@withicons/web/dist/cdn.js` (loads only the icons shown) | `<with-icon name="home"></with-icon>` |
| Font Awesome-style classes | CDN loader `@withicons/classes/dist/with-loader.js` (loads only the icons shown), or `npm i @withicons/classes` | `<i class="with with-home"></i>` |
| static SVG / sprite / CMS | `npm i @withicons/static` | `<svg><use href="sprite-line.svg#with-home"/></svg>` |
| files: slides, print, email, social | `npx withicons export <name> --format …` (section 7a) | PNG for email, PDF/SVG for print, GIF for motion |
| Node, build scripts, name lookup | `npm i @withicons/core` | `resolve('bin').name` returns `'trash'` |
| animation (any of the above) | `npm i @withicons/motion` | `<span class="wm wm-loop" data-wm="bell">…icon…</span>`; `<with-icon motion="loop">` (section 7) |

Full snippets for each framework are in [reference/frameworks.md](reference/frameworks.md).

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
- **luxe, bauhaus, skeuo** are *studio* styles: art-directed and premium, full colour, at **48px or larger**.
  - **luxe**: multi-layered 3D, sapphire enamel with polished gold and a jewel; heroes, pricing tiers, fintech, luxury.
  - **bauhaus**: pure circles, squares and bars in red, yellow and blue, overprinted; posters, portfolios, design, culture.
  - **skeuo**: skeuomorphic objects in real materials (paper, leather, metal, brass, glass) with bevels and soft shadows;
    app icons, music/photo/note apps, tactile dashboards.
- **anime, gothic, pastel, coquette, plush** are *storybook* styles: small full-colour illustrations, at **48px or larger**.
  - **anime**: cel shading, tapered ink line art, one hard shadow, specular shine and sparkles; games, streaming, fan sites.
  - **gothic**: cathedral craft, carved limestone and stained glass (ruby, sapphire, gold, emerald) in dark lead, pointed
    arches and tracery; fantasy and RPG games, books, music, Halloween, dark-luxe brands.
  - **pastel**: soft colour fields in lavender, peach, mint, baby blue, butter and blush; wellness, planners, aesthetic UIs.
  - **coquette**: ballet-pink satin tied with ribbon-red bows, pearls, lace and gold; beauty, fashion, weddings, feminine brands.
  - **plush**: stuffed toys sewn from felt, piping, running stitches and buttons; kids' apps, learning, toys, nurseries.
  Their colours are CSS variables with defaults (`--with-<style>-<role>`, listed in [reference/styles.md](reference/styles.md));
  the ink stays `currentColor`. Re-theme with CSS on any parent: `.hero { --with-kawaii-fill-1: #c4b5fd }`.
  Studio and storybook styles name every variable after its palette role (`--with-luxe-c1`, `--with-bauhaus-c3`,
  `--with-anime-shadow`, `--with-plush-accent`; roles: ink c1 c2 c3 c4 tint accent shadow shine edge), so one palette from
  `withicons palettes <icon>` fits all of them. The palette styles' own variables (`--with-kawaii-fill-1`, `--with-kawaii-face`,
  `--with-retro-2` …) map to the same roles, so that palette fits them too (`withicons palettes heart --style kawaii` shows
  the mapping; `withicons get heart --style kawaii --palette <id> --format web-component` applies one with no build).
  **Brand colours on a web page, no build**: `get` takes the same role flags as `export` (`--ink --c1 … --c4 --tint --accent
  --shadow --shine --edge`, `--colors`): `npx withicons get rocket --style glass --c1 "#6d28d9" --tint "#c4b5fd" --format web-component`
  prints `<with-icon style="--with-glass-back: #6d28d9; --with-glass-pane: #c4b5fd" name="rocket" variant="glass">`.
  `--color` only applies to `svg` / `data-uri`; for a web component set CSS `color` on a parent for the ink.
  **Brand colour = the main role, not always c1.** c1 is the first colour family drawn, not necessarily the biggest
  area. `npx withicons palettes <icon> --style <style>` marks the role that paints the body and says how much
  (`--with-glass-pane (tint, main body)`, then `main role: tint (main body, ~93% of the drawn area): set it for a brand
  colour, e.g. --tint "#e11d48"`); MCP: `get_icon` `colors.mainRole`, `list_palettes` `mainRole` / `mainRoleShare` /
  `mainRoleNote`. It differs per icon and style (glass `heart`: tint; kawaii `home`: c1, ~78%), and the palette styles'
  variables map to different roles per icon (kawaii `heart` paints c1 with `--with-kawaii-fill-1`, `home` with
  `--with-kawaii-fill-3`), so one CSS rule does not recolour a set evenly: set each icon's main role with role flags
  (`get` / `export` do the variable mapping), or use solid / line (`color`). Then look at the result.

Rule: one style per UI region. The only routine mix is line plus solid for inactive and active states. Every style is a subpath:
`@withicons/react/solid`, `/duo`, `/gloss`, `/engrave`, `/blueprint`, `/sketch`, `/glass`, `/kawaii`, `/sticker`, `/pixel`, `/retro`,
`/luxe`, `/bauhaus`, `/skeuo`, `/anime`, `/gothic`, `/pastel`, `/coquette`, `/plush`.
Style words in a search pick the style ("cute heart" -> kawaii, "8-bit star" -> pixel, "frosted bell" -> glass, "y2k" -> sticker,
"vintage camera" -> retro, "3d rocket" or "luxury gift" -> luxe, "bauhaus clock" or "geometric star" -> bauhaus,
"skeuomorphic camera" or "realistic lock" -> skeuo, "manga heart" -> anime, "medieval key" or "cathedral bell" -> gothic,
"soft cloud" -> pastel, "girly star" or "bow heart" -> coquette, "toy rocket" or "kids home" -> plush). More in [reference/styles.md](reference/styles.md).

## 3. Names

- Canonical names are kebab-case (`arrow-right`, `shopping-cart`, `check-circle`). Components are PascalCase,
  exported twice: `ArrowRight` and `ArrowRightIcon`. Deep import: `@withicons/react/icons/arrow-right`.
- **Aliases** are words people guess (`bin`, `house`, `gear`). They resolve in name-based APIs (`<with-icon name>`,
  `<Icon name>`, `resolve()`, search, MCP) but **are not exports**. A named import must use the canonical name.
- **Never guess an import name.** Look it up first: search (section 6) or [reference/icons.md](reference/icons.md)
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
5. Exported SVG files contain a `<title>`. Next to visible text add `aria-hidden="true"` (inline) or `alt=""` (`<img>`).
6. Never rely on the icon alone for meaning in forms or errors. Keep 3:1 contrast for meaningful icons, and give
   icon-only controls a target of at least 24x24 CSS px (44 recommended on touch) using padding, not a bigger icon.

## 6. Find the right icon

Use the first one available, in this order:

- **MCP** (best for agents). Remote: `https://withicons.com/mcp` (Streamable HTTP). Local: `npx -y @withicons/mcp`.
  Tools: `search_icons` (query, then ranked names plus ready-to-paste import/usage), `get_icon` (name + style + format,
  which returns SVG or a framework snippet), `animate_icon` (name + trigger loop/hover/once/inview/swap + format, which returns
  animation code), `export_icon` (name + style + format, which makes FILES: svg, png, pdf, pptx, docx, favicons, app assets,
  lottie and animated gif / apng / animated-svg / pptx-animated; section 7a), `resolve_icon` (alias, typo or a word by meaning, e.g. "orders" -> receipt, to the canonical
  name), `list_palettes`, `list_styles`, `list_categories`.
  Call `tools/list` to confirm names and arguments.
  Not connected yet? `npx withicons init` adds this skill and the server to the AI tools it finds in the project
  (Claude Code, Codex, Cursor, OpenCode, VS Code, Windsurf). Name tools to pick them (`npx withicons init cursor`; ids:
  `claude-code codex cursor opencode vscode windsurf claude-desktop lovable`; Claude Desktop is user-wide, Lovable prints
  the connector steps), add `--global` for your user, `--mcp local|remote|none`, and `--dry-run` to see the changes first.
- **CLI**: `npx withicons search "throw away"`
- **HTTP**: `curl "https://withicons.com/api/search?q=throw+away&limit=5"` returns JSON with name, score and match.
- **Offline**: [reference/icons.md](reference/icons.md), `https://withicons.com/icons.json`, `https://withicons.com/llms.txt`,
  or `import { search, resolve } from '@withicons/core'`.

Search tips: one concept per query (`delivery`, `secure`, `payment` rather than a whole tagline); if nothing fits, try a synonym
by meaning or the object you would draw, then browse the category (`list_categories`, `npx withicons categories <cat>`,
[reference/icons.md](reference/icons.md)). Every result says why it matched (`reason`, and `match.kind`: exact, prefix,
stem, typo, concept, similar, phonetic): and a `confidence` (high, medium, low): trust high and medium, treat low as
"related" (the reason says "(related, low confidence)") and check `reason` / `match` before using one; prefer the object
you would draw. Words with no honest icon return nothing (`grinder`, `mat`, `shirt`, `pram`) plus a browse hint or
`didYouMean`; others only low matches (`yoga` -> dumbbell). Then pick the closest honest icon and say what it stands
for in the text or label, never pass a loose match off as exact ([reference/search.md](reference/search.md) lists the gaps). There are **no brand or social logos** (Instagram, X, GitHub …): use a neutral
stand-in (`camera`, `play`, `message-circle`, `code`, `share-2`) with the brand name as text or `aria-label`, or the brand's
official asset. MCP client setup, more tips and response shapes are in [reference/search.md](reference/search.md).

## 7. Animate (optional, separate package)

Animations live in `@withicons/motion` (pure CSS + an optional tiny JS API), so icons never pay for them. They wrap the
element that holds the icon, so they work with every style and every package. Ask the MCP `animate_icon` tool (or
`npx withicons animate <name> --trigger hover --format react`) for paste-ready code; the icon pages on withicons.com have
an editor with live previews.

```jsx
import '@withicons/motion/motion.css'   // presets
import '@withicons/motion/icons.css'    // each icon's tuned motion, all 500 (~18 KB gzipped; from a CDN link dist/icons/<name>.css per icon instead)

<span className="wm wm-loop" data-wm="loader"><Loader /></span>                                   {/* continuous */}
<button className="wm-trigger" aria-label="Alerts"><span className="wm wm-hover" data-wm="bell"><Bell /></span></button>  {/* on hover/focus */}
<span className="wm wm-loop wm-p-float" style={{ '--wm-dur': '3s' }}><Cloud /></span>               {/* any preset */}
<span className={'wm-swap wm-fx-morph' + (playing ? ' is-on' : '')}><Play className="wm-a" /><Pause className="wm-b" /></span>  {/* icon to icon */}
```

- **TypeScript**: every package ships its types. A CSS custom property in a React `style` needs a cast:
  `style={{ '--wm-dur': '3s' } as React.CSSProperties}`.
- **`<with-icon>` (web component): use the `motion` attribute, not a `.wm` wrapper.** Its svg is in a shadow root, so a
  wrapper only moves the outer box. Load `@withicons/motion/dist/element.js` after `@withicons/web`'s `dist/cdn.js`, then
  `<with-icon name="bell" motion="loop|hover|once|inview">` (optional `preset="ring"`, swaps with `swap-to="bell-off"`).
  Wrappers are for inline SVG, framework components, live icons and `<i>` classes (the svg must be the wrapper's direct child
  for part motion; `<i>` moves as one piece).
- Check it runs: `el.getAnimations({ subtree: true })` on a wrapper; for `<with-icon>` with `element.js` use
  `el.shadowRoot.getAnimations()` (the parts move, each with its own lag, while the element itself stays still and reports none). Reduced motion (common in CI and screenshot tools) empties both.
- Touch screens have no hover: on mobile prefer `wm-inview` / `motion="inview"`, `wm-once` or a calm loop.
- Triggers: `wm-loop` (continuous), `wm-hover` (one-shot on hover/focus of the icon or of a `.wm-trigger` ancestor),
  `wm-once` (on load), `wm-inview` (JS). Presets: `wm-p-<preset>` (spin, pulse, beat, float, bounce, ring, wiggle, shake,
  nudge, pop, tada, flip, glow, draw…). Swap effects: `wm-fx-<effect>` (fade, scale, rotate, flip, slide-up, blur, morph…).
- Use motion to explain state or invite action (loading, new notification, like, play/pause, menu/close); keep loops on
  one or two icons per screen. `prefers-reduced-motion` turns everything off automatically.
- An animated icon is still decorative: keep the accessible name on the button, never in the animation.
  Web component details, sizes and the full list of tuned icons: [reference/motion.md](reference/motion.md).

## 7a. Icon files for slides, print, email, docs and social (still or animated)

When the result is a deck, a document, a print file, an email or a social post, give the person FILES, not code.
One command, no browser (Node 18+); several icons and formats at once:

```bash
npx withicons export truck package home --format svg-flat,png,pdf --out icons   # truck-line.svg, truck-line-512.png, truck-line.pdf …
npx withicons export bell --format gif --background "#ffffff" --out slides   # bell-line-ring.gif, loops forever
npx withicons export rocket --style luxe --format pptx-animated --background "#0f172a"   # a ready 16:9 slide, icon moving
npx withicons export play --format gif --motion swap --to pause --effect morph            # play turns into pause and back
```

MCP: `export_icon({ name: 'bell', style: 'luxe', format: 'gif', background: '#ffffff', out_dir: 'slides' })` writes the
file (without `out_dir` a small GIF comes back as image content). The remote server (`https://withicons.com/mcp`) cannot
render frames: it answers GIF / APNG / PowerPoint requests with the exact `npx withicons export ...` command to run.

- **Which format.** Still: `svg-flat` (slides, design tools, `<img>`), `png`, `pdf` / `eps` (print).
  `gif`: plays in PowerPoint (slide show and editor), Keynote, Google Slides, Word, Gmail, Apple Mail, Outlook on the
  web, Slack, Teams, Notion (classic Outlook for Windows shows the first frame). `pptx-animated`: one slide with that GIF
  (opens in PowerPoint, Keynote, Google Slides).
  `apng` (`.apng.png`): smooth see-through edges on web pages; Office and Google Slides show only its first frame.
  `animated-svg`: tiny, browsers only. `lottie` / `dotlottie`: vector, for apps, After Effects, Canva, LottieFiles.
  Video (MP4, WebM) and animated WebP come from the icon page on withicons.com (browser encoders).
- **Background.** GIF transparency is on or off per pixel, so soft edges are blended with a colour. Pass the slide's
  colour as `--background` (solid tile, cleanest) or `--matte` (transparent, edges blended for that colour). A GIF made
  for white shows a light fringe on a dark slide: export again for the real slide colour.
- **Colours are baked in**, and the ink defaults to **black**. On a dark slide or page pass `--color "#ffffff"` (and
  `--background` with the slide colour); for multi-colour styles pick an `on-dark` palette
  (`npx withicons palettes <icon> --tag on-dark`, every icon has one) and still set `--color` for a light outline.
- **One look for many icons**: palette ids are per icon, so set roles instead; they apply to every icon in the call:
  `npx withicons export rocket shield chart-bar --style glass --format png --color "#ffffff" --c1 "#6d28d9" --tint "#c4b5fd"`.
  `npx withicons palettes <icon> --style <style>` shows which roles a style reads and its **main role** (the body
  colour, section 2): put the brand colour on that role. A role some icons do not use gets one note per command
  (`note: --accent applies to: phone-call (2 others don't use it)`); `--color` / `--ink` alone prints nothing.
  Export one icon and look before the whole set. With `--palette`, icons lacking it borrow the first icon's colours (`--strict` fails instead). Keep roles distinct (one hex for all
  merges parts), and expect see-through styles (duo 20%, glass, kawaii, pixel) to show a brand hex lighter: for the
  exact hex use solid/line `--color`, or bauhaus, retro or sticker ([reference/files.md](reference/files.md)).
- **Size.** Default 256 px (pptx-animated 480): sharp up to ~1.75 in / 4.5 cm wide on a 1080p slide; `--size 512`
  for full-screen or 4K, `--size 1080` for Instagram and other social posts. GIF size depends on the style and on how
  much of the icon moves (measured at the default 25 fps on white; a small ring like `bell` at the low end, a long
  steam loop like `coffee` at the high end):

  | GIF | line, solid, duo | glass, luxe | sticker, gothic |
  |---|---|---|---|
  | 256 px | 45-185 KB | 180-560 KB | 330-630 KB |
  | 512 px | 95-390 KB | 0.4-1.3 MB | 0.7-1.5 MB |
  | 1080 px | 0.2-0.95 MB | 0.95-3.2 MB | 1.6-3.4 MB |

  To shrink one, lower `--fps` (12 roughly halves it) or `--seconds`. Animated files go up to 2048 px; very large or
  long ones may ask for a lower `--fps` or `--seconds` (the error says what fits).
- **Padding.** Animated files leave room for the motion by themselves; static files sit edge to edge on the 24 grid,
  so pass `--padding 0.15` (0 to 0.6; MCP `padding`) for app tiles, round frames or extra breathing room; for animated
  files it is a minimum.
- **Motion.** The icon's tuned loop by default (same keyframes as the website). `--motion hover` / `once` play the
  one-shot then rest, `--motion <preset>` (spin, ring, beat, bounce, float, pop, tada, draw …), `--motion swap`
  (+ `--to`, `--effect`), `--fps`, `--seconds`, `--loop 1` to play once. Every style animates, palettes included.
- **`pptx-animated` is one sample slide.** For a whole deck, export GIFs and insert them into your own slides:
  Insert > Pictures (or drag the file in); GIFs play in the slide show. Keep one moving icon per slide. Building the
  deck in code: python-pptx `slide.shapes.add_picture('bell-line-ring.gif', …)` keeps the GIF animation.
  A title slide wants a more noticeable move than a calm tuned loop: `npx withicons motions <icon>` (same as
  `animate <icon> --list`) shows its default loop and hover, its alternates with ready commands and the livelier picks
  (tada, jelly, bounce, beat, wiggle, pop) with an `export --motion ...` line; `npx withicons animate --list` lists every preset.
- **Print**: vector `pdf`, `eps` or `svg-flat`, never PNG; `--color` sets the line colour, `--stroke-width 1.25` a
  lighter line on outline styles. **Names**: `--name "{name}"` gives `home.svg` (MCP `filename`); one name per icon:
  `--name-map receipt=orders,heart=favourites` gives `orders.svg`, `favourites.svg` (MCP `names: { receipt: "orders" }`).
  Files (svg, svg-flat, pdf, png, pptx ...) carry no motion classes; code formats (jsx, vue ...) keep them.
  Nothing is written if any file fails; `npx withicons export --help` lists every option.
  **Email**: PNG at 2x the display size, hosted on your https URLs (the CDN has SVGs only), with `width`, `height`, `alt`;
  never SVG, `data:` URIs, sprites, web components or CSS classes. In email HTML put the `<img>` in a table cell with
  inline styles (no stylesheet classes). Email signatures (Gmail, Outlook, Apple Mail):
  https://withicons.com/guides/email-signatures.html. File names, formats per job, print stroke weight
  and email details: [reference/files.md](reference/files.md).

## 7b. Live icons (content you set, separate package)

A separate set of up to 50 **live icons** draws content you choose inside the icon: a calendar with a date, a clock with a
time, a bell with a count, a battery at a level, a weather icon with a temperature, a tag with a short label. Each is a
generator that builds a normal skeleton, so it renders in **every style** (line through luxe, bauhaus, skeuo and the storybook styles).
Text is limited to 4 characters so it stays legible at 24px; counts fall back to "99+".

```js
import { render, list, paramsOf } from '@withicons/dynamic'
list()                                   // the live icon names
paramsOf('calendar-date')                // { day: { type: 'int', min: 1, max: 31, … }, month: { type: 'enum', … } }
render('calendar-date', { day: 17, month: 'MAR' }, 'line', { size: 24 })   // -> SVG string
```
```html
<!-- no build: ~40 KB gzipped, each live icon and style loads on first use -->
<script src="https://cdn.jsdelivr.net/npm/@withicons/dynamic@latest/dist/cdn/lite.js"></script>
<with-live-icon name="calendar-date" day="17" month="MAR" variant="kawaii" label="17 March"></with-live-icon>
<with-live-icon name="calendar-date" today label="Today"></with-live-icon>   <!-- the viewer's date, kept current -->
```
```jsx
import { LiveIcon } from '@withicons/dynamic/react'        // or '@withicons/dynamic/vue' (same props; :day="17" in templates)
<LiveIcon name="calendar-date" day={17} month="MAR" variant="glass" size={48} label="17 March" />
<LiveIcon name="calendar-date" today label="Today" />
<LiveIcon name="bell-count" count={unread} label={`${unread} unread`} />
```

- **today**: the `today` attribute (element) or prop (`LiveIcon`) fills the date and time params (day, month, weekday,
  time) from the viewer's clock. `<with-live-icon today>` redraws at each minute boundary while it is on the page; the
  React / Vue `LiveIcon` reads the clock each time it renders (no timer of its own). On `LiveIcon` an explicit param
  prop overrides `today`; on the element, whichever was set last wins.
  `render()` itself stays pure and never reads the clock: pass `now()` (`import { render, now } from '@withicons/dynamic'`,
  `render('calendar-date', now())`) and re-render when you want it to move.
- **Values that change after load** (an API, a WebSocket, a timer, an input): set the attribute (`icon.setAttribute('count', 7)`)
  or the `LiveIcon` prop. Add `animate` (element attribute, or `animate` / `animate={900}` on `LiveIcon`) and changes move
  instead of jumping: numbers roll, levels ease, clock hands take the short way round, words cross-fade, instant with
  reduced motion. The whole change takes the `animate` time (default 650 ms) however far it goes: "roll" means the
  digits step through the values in between (3 to 7 shows 4, 5, 6; a big jump skips some), so a change of 1 is a single
  swap at the end. Rich styles draw only a few in-between frames (in a worker; without one, a cross-fade). One change: `el.animateTo({ count: 7 }, { ms: 900 })` (or `animateTo(el, …)` from
  `@withicons/dynamic/element`). Several attributes set together make one transition; the last frame is exact.
- **label**: the accessible name (`label` attribute, `label` prop, or the `label` render option); it adds `role="img"`.
  The element and `LiveIcon` name themselves from their values when no label is given ("Calendar date, March 17",
  `describe(name, params)`); `label=""` makes one decorative. `render()` stays `aria-hidden` unless you pass a label. A param that is itself called `label` (`keycap`, `map-pin-number`) is set with
  `param-label="A"` on the element or `params={{ label: 'A' }}` on `LiveIcon`.
- Params are attributes in kebab-case on the element and props on `LiveIcon`; the other props (`className`, `onClick`,
  `aria-*`) go on the `<svg>`. Bundler setup for the element: `import '@withicons/dynamic/element'`.
- **Vite**: set `worker: { format: 'es' }` in `vite.config` (the default `iife` inlines every style into a ~1.5 MB worker
  and slows builds). The first `es` build can still take ~90 s while Vite bundles the worker; later builds take seconds.
  Each style chunk then appears twice in `dist` (once for the page, once for the worker); a page downloads only the
  styles it shows. **React**: never change a `LiveIcon`'s `key` (or its parent's) to replay an animation; it remounts
  and the value jumps. Change the prop and toggle a class on a `.wm` wrapper (a `bell-count` in `data-wm="bell"` rings
  part by part).
- Every live icon with its params (name, type, range or options, default), bundle sizes and recipes:
  [reference/live.md](reference/live.md). Try them at https://withicons.com/live.html.

## 8. Pitfalls

- `import { Bin } from '@withicons/react'` fails because aliases are not exports. Resolve to `Trash` first.
- The generic `<Icon name=... variant=...>` component bundles **all 500 icons in every style**. Use it only for truly dynamic names
  (CMS data). Otherwise use named imports, which tree-shake down to the icons you use.
- `<img src=".../home.svg">` cannot inherit `currentColor` and renders black. Inline the SVG, use the component,
  the sprite or the classes when the colour must follow text.
- SVG sprites must be served from **your own origin**. Browsers block cross-origin `<use href>`.
- Icon classes are CSS masks: duo tint and blueprint accents render as translucent `currentColor`. Palette styles keep
  their default colours in classes, but their `--with-<style>-*` variables only work in components, `<with-icon>`, sprites or `with-icons.js`.
  Only their fills are fixed: the ink is still a `currentColor` mask, so `color` (and dark mode) still recolours it.
- Icon classes: `with-loader.js` watches the page (MutationObserver), so `<i>` elements or classes added later load too.
  `with-pulse` is a stepped spin (8 steps, like an old spinner), not an opacity pulse. `with-rtl` / `with-flip-*` use
  the CSS `scale` property and `with-rotate-*` the `rotate` property, so they combine with `with-spin`; to check a flip,
  read `getComputedStyle(el).scale` (`'-1 1'` when mirrored), not `transform`.
- Standalone `.svg` files (CDN, `@withicons/static`, `get_icon` with `flat: true`) have the palette baked in, which is what
  Figma, PowerPoint, Keynote and image converters need. Inline code keeps the variables.
- Don't put palette styles, loops or creative styles in dense 16-20px controls: they turn to noise.
- `strokeWidth` only affects styles with live strokes (line, duo, blueprint, sketch, kawaii); it does nothing on the filled styles.
- From a CDN, load only what the page shows: `<with-icon>` via `https://cdn.jsdelivr.net/npm/@withicons/web@latest/dist/cdn.js`
  (7 KB gzipped + one small file per icon), `<i>` classes via `.../classes@latest/dist/with-loader.js` (6 KB gzipped +
  ~270 bytes per line icon), live icons via `.../dynamic@latest/dist/cdn/lite.js`. `@latest` follows new releases; for a
  look that never changes, pin one version (`@withicons/web@<version>`, the same for every `@withicons/*` file on the page).
  Never `with-all.css` (every style, ~6.3 MB gzipped) or `@withicons/web/full` on a real page; `with-<style>.css`
  (one whole style, `with-line.css` 26 KB gzipped) is the zero-JS option.
- `<i class="with …">` size: `font-size` on the `<i>` gives an exact pixel size; `with-2x` … `with-5x` multiply the text
  size; `--with-size: 48px` needs `@withicons/classes` 0.2.2+. Measure with `offsetWidth` (a spinning icon's bounding box changes).
- Right-to-left: `with-rtl` on `<i>` (also `with-flip-h`, `with-rotate-90` …), `mirror-rtl` on `<with-icon>`, and for
  components a class plus `.rtl-flip:dir(rtl) { transform: scaleX(-1) }` (no prop). Only mirror directional icons
  ([reference/frameworks.md](reference/frameworks.md)).
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
  PowerPoint, Keynote, Figma, Canva; PNG at 256 px for slides; SVG or PDF for print; an animated GIF on the slide's colour
  for a moving icon, section 7a), how to insert, recolour and resize it in their app, layout tips, and the guide `https://withicons.com/guides/<app>.html` (powerpoint, google-slides, keynote,
  canva, figma, notion, word-google-docs, wordpress, webflow, framer, wix-squarespace, email-signatures, html).

Always: search before naming anything (section 6), link `https://withicons.com/icons/<name>.html` for every pick,
give developers the npm package for their stack (`@withicons/react`, `vue`, `svelte`, `angular`, `solid`, `web`) or the
`<i class="with with-NAME">` CDN classes, and give everyone else the page's Copy image, SVG/PNG download and Copy SVG code. The full brief templates are in https://withicons.com/llms.txt.
