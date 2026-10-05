# with icons — site design contract (v2, 2026-10-01)

**Brand:** `with icons` (always lowercase in the wordmark; "With Icons" at the start of a sentence in body copy is fine).
Domain **https://withicons.com**. Footer must say **Powered by Evergrow** (link https://withevergrow.com).
The old names *egopenicons* and *Evergrow Open Icons* are retired — they must not appear anywhere on the site.
Hosting: AWS S3 + CloudFront. URLs keep the `.html` extension (works from file:// and S3 alike).

**Audience first:** most visitors are NOT developers — designers, marketers, founders, students, people making slides,
docs and websites. Every page leads with plain language ("Free icons for your website, slides and apps. Find one, copy
it, done."), shows instead of tells, and pushes jargon (npm, props, tree-shaking) down into clearly marked
"For developers" areas. Developers and AI agents get their own pages.

**Ambition:** FWA / Awwwards Site-of-the-Day level. Bold, colourful, playful but precise; motion that explains
(an icon morphing between styles shows what a style is; search results animating in shows speed). Never decoration
for its own sake, always 60fps (transform/opacity, rAF, pause off-screen), always a reduced-motion version.

## Colour — more colour, used with intent
Neutral base + one signature colour PER STYLE, used consistently everywhere a style appears (tabs, chips, page
accents, hover states, the nav morph). D1 owns the final values in `css/tokens.css`; starting point:

| token | value | use |
|---|---|---|
| `--paper` | #FBF8F3 | page ground (light) |
| `--ink` | #111318 | text, dark slabs |
| `--sun` | #FFD23F | highlight, focus, "new" |
| `--c-line` | #2F5BFF cobalt | Line |
| `--c-solid` | #FF5A36 tomato | Solid |
| `--c-duo` | #7B5CFF violet | Duo |
| `--c-gloss` | #FF4FA3 pink | Gloss |
| `--c-engrave` | #C9962B gold | Engrave |
| `--c-blueprint` | #00A3C4 cyan | Blueprint |
| `--c-sketch` | #22A861 leaf | Sketch |
| `--evergrow` | #D5B473 | the "powered by Evergrow" mark only |

Dark theme supported everywhere (`data-theme="dark"` on <html>, plus prefers-color-scheme). Contrast AA for text.

## Type — self-hosted, no Google Fonts requests at runtime
Fonts are downloaded once into `site/fonts/` (woff2 + OFL license text) and declared with @font-face in tokens.css
(`font-display: swap`, preload the two used above the fold).
- **Handwriting** — for the word "with" in the logo and small hand-written annotations/arrows on the site.
  Pick the best after testing (candidates: Caveat, Nothing You Could Do, Homemade Apple, Reenie Beanie, Gochi Hand,
  Kalam, Shadows Into Light Two, Sue Ellen Francisco). Must look great at 22–28px and huge.
- **Display / UI sans** — for "icons" in the logo, headlines and UI (candidate: Bricolage Grotesque variable; or
  Instrument Sans / Space Grotesk / Familjen Grotesk). Characterful at display sizes, clean at 14px.
- **Serif accent** (optional, sparingly): Instrument Serif or Fraunces italic.
- **Mono** for code: JetBrains Mono or Geist Mono.

## Navbar — the brand moment (exact structure, every page)
```html
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" data-header>
  <a class="logo" href="/index.html" aria-label="with icons — home">
    <span class="logo-morph" aria-hidden="true" data-logo-morph></span>
    <span class="logo-type">
      <span class="logo-words"><span class="logo-with">with</span><span class="logo-icons">icons</span></span>
      <span class="logo-by">powered by <b>evergrow</b></span>
    </span>
  </a>
  <nav class="site-nav" aria-label="Primary">
    <a href="/icons.html">Icons</a><a href="/guides/index.html">How to use</a>
    <a href="/developers.html">Developers</a><a href="/ai.html">For AI</a><a href="/about.html">About</a>
  </nav>
  <div class="site-actions">
    <button class="search-trigger" type="button" data-search-open aria-label="Search icons"><kbd>/</kbd></button>
    <button class="theme-toggle" type="button" data-theme-toggle aria-label="Toggle dark mode"></button>
    <a class="cta" href="/icons.html">Browse icons</a>
  </div>
</header>
```
Paths: pages in subfolders use relative paths (`../icons.html`) — never root-absolute `/…` in the final HTML, so
file:// works; the snippet above shows intent only. `logo-morph` = a ~28px icon that continuously morphs/cycles
through real icons AND styles (each change tinted with that style's colour), e.g. a line icon drawing itself on,
then filling into solid, then glossing… Smooth, delightful, never distracting (slower when the user is reading,
pauses off-screen / reduced motion). "with" in the handwriting font, "icons" in the display sans, "powered by
evergrow" tiny below. On scroll the header condenses gracefully. Global search overlay opens with `/` or ⌘K
on every page (uses the search engine below).

## Footer (every page)
Big, generous, colourful. Columns: Icons (browse, styles, categories) · Use them (guides) · Developers (packages,
docs, GitHub — "coming soon" until launched) · AI (MCP, skill, llms.txt) · About (about, license, FAQ).
Base line: `© 2026 with icons · MIT License` and **Powered by Evergrow** (Evergrow gold mark + link).

## Search engine (shared by every page, the MCP server and the CLI) — implemented by the search agent
```html
<script src="vendor/with/search.js"></script>      <!-- window.WithSearch -->
<script src="data/search-index.js"></script>       <!-- window.WITH_SEARCH_INDEX -->
```
```js
const engine = WithSearch.create(window.WITH_SEARCH_INDEX)
engine.search('throw away', { limit: 48, category, style })
  // -> [{ name, title, category, score, match: { field: 'name'|'alias'|'synonym'|'tag'|'category'|'description', term, typo } }]
engine.suggest('settigns', 5)   // did-you-mean names
engine.resolve('bin')           // { name } | { ambiguous: [...] } | { unknown: true, nearest: [...] }
```
Icon render data files keep their paths: `data/meta.js` and `data/style-<name>.js` (the rename agent updates forge/tools/site-data.mjs).
Data globals are renamed: `window.WITH` (meta) and `window.WITH_SVG[style][icon]` — the search/rename agents
update forge/tools/site-data.mjs; site code must use the new globals.

## Developer-facing names (after the rename)
npm `@withicons/core|react|vue|svelte|angular|solid|web|classes|static|search|mcp|motion|dynamic`. Web component `<with-icon name="home"
variant="solid">`. Classes: `<i class="with with-home"></i>`, `<i class="with with-home with-solid"></i>`, CDN setup
`<script src="https://cdn.jsdelivr.net/npm/@withicons/classes/dist/with-loader.js" defer>` (links only the icons on the
page; zero JS: `with-base.css` + `<style>/<name>.css`; one style: `with-line.css`; `with-all.css` is heavy, prototypes
only), runtime `…/classes/dist/with-icons.js`. Element from a CDN: `…/web/dist/cdn.js`. MCP: `npx -y @withicons/mcp`. Local site copies live in `site/vendor/with/`.
Not yet published — developer pages say "launching soon" next to install commands and offer direct downloads.

## Page map and owners
- **D1 brand + home:** site/fonts/**, css/tokens.css, css/chrome.css, js/site.js (shared runtime: theme, nav,
  logo morph, global search overlay, reveal, copy helpers — keep `window.EG`-style helpers working under a new
  `window.WI` namespace and alias `EG` → `WI` for compatibility), index.html, css/home.css, js/home.js, favicon*,
  site/brand/** (logo svg), 404.html.
- **D2 library + generated pages:** icons.html, css/library.css, js/library.js, forge/tools/site-seo.mjs and
  everything it generates (icons/<name>.html, categories/, styles/, sitemap.xml, robots.txt, llms.txt,
  llms-full.txt, icons.json, og/), css/icon-page.css, js/icon-page.js.
- **D3 content pages:** guides/index.html + guides/*.html (PowerPoint, Google Slides, Keynote, Canva, Figma,
  Word & Google Docs, Notion, WordPress, Webflow, Framer, Wix & Squarespace, email signatures, plain HTML),
  developers.html, ai.html (MCP, skill, llms.txt), about.html, license.html, faq.html, css/pages.css, js/pages.js.
Each page links tokens.css → chrome.css → its own CSS, and js/site.js.

---

## Using the shared layer (D1 — tokens.css · chrome.css · site.js) — READY

**Fonts (self-hosted, `site/fonts/`, OFL texts included):** Bricolage Grotesque variable (display + UI, `--font-display`
= `--font-sans`), Caveat variable (hand, `--font-hand`; class `.hand`), Instrument Serif + italic (`--font-serif`;
class `.serif`/`.it`, sparingly), JetBrains Mono (`--font-mono`). `caveat-logo.woff2` is a 4 KB subset with only
"with" for the logo. Every page's `<head>` (prefix `../` in subfolders):
```html
<link rel="preload" href="fonts/bricolage-grotesque-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/caveat-logo.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/chrome.css">
<link rel="stylesheet" href="css/<your-page>.css">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="brand/apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<meta name="theme-color" content="#FBF8F3" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0D0F14" media="(prefers-color-scheme: dark)">
<!-- no-flash theme + js flag (inline, in <head>) -->
<script>document.documentElement.className='js';try{var t=localStorage.getItem('with-theme-v2');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light')}catch(e){}</script>
<!-- end of body: data first if the page needs it, then site.js, then your page JS (all defer) -->
<script src="data/meta.js" defer></script>      <!-- optional: site.js lazy-loads it for search -->
<script src="js/site.js" defer></script>
```
site.js derives the site root from its own `src`, so it works from any folder depth, file:// or S3.

**Colour tokens (tokens.css):** `--paper --paper-2 --paper-3 --card --ink --ink-2 --muted --faint --rule --rule-strong
--sun --sun-soft --evergrow --evergrow-ink --dark --dark-2 --on-dark --on-dark-2 --on-dark-rule`. Per style:
`--c-<style>` (the colour), `--c-<style>-text` (AA text twin on paper; brighter in dark), `--c-<style>-soft` (tint bg).
Put class `s-<style>` (e.g. `s-duo`) on any element to set `--style / --style-text / --style-soft` for its subtree;
components like `.chip`, `.eyebrow`, `.btn-style`, `.foot-col` read those. Dark theme is automatic (both
`data-theme="dark"` and prefers-color-scheme) — never hard-code colours, use tokens. `--dark` stays dark in both themes
(for slabs/footer). Type scale `--step--2 … --step-6`; radii `--radius-s/--radius/--radius-l/--radius-xl/--pill`;
shadows `--shadow-s/--shadow/--shadow-l`; easing `--e-out --e-in-out --e-drawer --e-spring`; `--maxw` 1240px,
`--gutter`, `--header-h` (72px, 64px at ≤900px).

**Primitives (chrome.css):** `.wrap` (max-width + gutter), `.wrap-wide`, `.section`, `.eyebrow`, `.display`, `.h1`,
`.h2`, `.h3`, `.lede`, `.muted`, `.hand`, `.serif`, `.mark` (sun highlighter), `kbd`, `.btn` + `.btn-ink | .btn-sun |
.btn-style | .btn-ghost` + `.btn-lg | .btn-sm` (put `<svg class="arr">` inside for the nudge arrow), `.chip`
(`aria-pressed="true"` or `.is-on` = selected; `.plain` = no dot), `.tag` (+`.creative`), `.card`, `.slab-dark`,
`.style-dot`, `.code` / `.code-bar` / `.copy-btn` (or `WI.codeBlock(code, lang)`; `<pre data-code="html">…</pre>` is
auto-upgraded), `.visually-hidden`, `[data-reveal]` (fade-up on scroll; `style="--d:2"` staggers), `.toast`.

**Header — paste exactly (subfolder pages: prefix every href with `../`):**
```html
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" data-header>
  <a class="logo" href="index.html" aria-label="with icons — home">
    <span class="logo-morph" aria-hidden="true" data-logo-morph></span>
    <span class="logo-type">
      <span class="logo-words"><span class="logo-with">with</span><span class="logo-icons">icons</span></span>
      <span class="logo-by">powered by <b>evergrow</b></span>
    </span>
  </a>
  <nav class="site-nav" aria-label="Primary">
    <a href="icons.html">Icons</a><a href="guides/index.html">How to use</a>
    <a href="developers.html">Developers</a><a href="ai.html">For AI</a><a href="about.html">About</a>
  </nav>
  <div class="site-actions">
    <button class="search-trigger" type="button" data-search-open aria-label="Search icons"><kbd>/</kbd></button>
    <button class="theme-toggle" type="button" data-theme-toggle aria-label="Toggle dark mode"></button>
    <a class="cta" href="icons.html">Browse icons</a>
  </div>
</header>
<main id="main"> … </main>
```
site.js does the rest: logo morph, current-link marking (`aria-current`; icons/, categories/, styles/ → Icons;
guides/ → How to use; license/faq → About), sliding nav indicator, condense on scroll, magnetic CTA, the mobile menu
(≤900px, injected), search-trigger label/icon, theme-toggle icons. Don't restyle `.site-header` per page.

**Footer — paste exactly (prefix hrefs with `../` in subfolders):**
```html
<footer class="site-footer">
  <div class="foot-inner">
    <div class="foot-top">
      <div class="foot-brand">
        <a class="logo" href="index.html" aria-label="with icons — home">
          <span class="logo-morph" aria-hidden="true" data-logo-morph></span>
          <span class="logo-type"><span class="logo-words"><span class="logo-with">with</span><span class="logo-icons">icons</span></span><span class="logo-by">powered by <b>evergrow</b></span></span>
        </a>
        <p>300 free icons in 7 styles for slides, docs, websites and apps. Find one, copy it, done.</p>
        <a class="btn btn-sun btn-sm" href="icons.html">Browse all icons</a>
      </div>
      <nav class="foot-cols" aria-label="Footer">
        <div class="foot-col s-line"><h2>Icons</h2><ul>
          <li><a href="icons.html">Browse all 300</a></li><li><a href="styles/line.html">The 7 styles</a></li>
          <li><a href="categories/navigation.html">Categories</a></li><li><a href="icons.html?style=gloss">Gloss icons</a></li></ul></div>
        <div class="foot-col s-solid"><h2>Use them</h2><ul>
          <li><a href="guides/index.html">All guides</a></li><li><a href="guides/powerpoint.html">PowerPoint</a></li>
          <li><a href="guides/google-slides.html">Google Slides</a></li><li><a href="guides/canva.html">Canva</a></li>
          <li><a href="guides/figma.html">Figma</a></li></ul></div>
        <div class="foot-col s-duo"><h2>Developers</h2><ul>
          <li><a href="developers.html">Overview</a></li><li><a href="developers.html#frameworks">React, Vue, Svelte</a></li>
          <li><a href="developers.html#cdn">CDN &amp; icon classes</a></li>
          <li><a href="https://github.com/withevergrow/withicons">GitHub</a><span class="soon">soon</span></li></ul></div>
        <div class="foot-col s-gloss"><h2>AI</h2><ul>
          <li><a href="ai.html">For AI agents</a></li><li><a href="ai.html#mcp">MCP server</a></li>
          <li><a href="ai.html#skill">Agent skill</a></li><li><a href="llms.txt">llms.txt</a></li></ul></div>
        <div class="foot-col s-sketch"><h2>About</h2><ul>
          <li><a href="about.html">About</a></li><li><a href="blog/index.html">Journal</a></li><li><a href="license.html">License</a></li>
          <li><a href="faq.html">FAQ</a></li><li><a href="https://withevergrow.com">Evergrow</a></li></ul></div>
      </nav>
    </div>
    <div class="foot-word" aria-hidden="true"><span class="fw-with">with</span><span class="fw-icons">icons</span></div>
    <div class="foot-base">
      <span>© 2026 with icons · MIT License</span>
      <a class="evergrow-link" href="https://withevergrow.com"><span data-evergrow-mark></span>Powered by Evergrow</a>
    </div>
  </div>
</footer>
```
Guide filenames the footer/home link to (D3 please use these): `guides/powerpoint.html`, `google-slides.html`,
`keynote.html`, `canva.html`, `figma.html`, `word-google-docs.html`, `notion.html`, `wordpress.html`, `webflow.html`,
`framer.html`, `wix-squarespace.html`, `email-signatures.html`, `html.html`. Anchors used: `developers.html#frameworks`,
`#cdn`; `ai.html#mcp`, `#skill`. GitHub: https://github.com/withevergrow/withicons.

**Search overlay:** any element with `data-search-open` opens it (optional `data-search-query="…"` pre-fills); `/` and
⌘K / Ctrl+K open it on every page. If a page has its own search field that should own `/`, set
`<body data-search="local">` (⌘K still opens the overlay). It uses `WithSearch` + `WITH_SEARCH_INDEX` when present
(lazy-loaded from `vendor/with/search.js` + `data/search-index.js`), otherwise a built-in fallback.

**`window.WI` (alias `window.EG`)** — synchronous unless noted:
- data: `WI.data()` (meta), `WI.icons()`, `WI.icon(name)`, `WI.styles()` → `[{name, title, kind, plain, good,
  description, color, …}]`, `WI.styleInfo[style]`, `WI.ORDER`, `WI.has(name, style?)`; Promises `WI.loadMeta()`,
  `WI.loadStyle(style)`, `WI.loadAllStyles()`; `WI.on('style', fn)` fires when a style file arrives.
- render: `WI.svg(name, style='line', size=24, {title, class, strokeWidth})` → `'<svg…>'` or `''`;
  `WI.svgFile(name, style, {color, size})` → standalone SVG text for copy/download; `WI.svgToPng(svgText, px)` → Promise<Blob>.
- search: `WI.search(q, {limit, category, style})` → engine hits; `WI.suggest(q, n)`; `WI.resolve(q)`;
  `WI.whyMatched(hit, q)` → HTML ("Also called <b>bin</b>"); `WI.ensureSearch()` (Promise); `WI.openSearch(q?)`.
- utils: `WI.copy(text)` (Promise<bool>), `WI.copyWithToast(text, label)`, `WI.toast(msg)`, `WI.download(name, text, mime)`,
  `WI.codeBlock(code, lang)`, `WI.highlight(code)`, `WI.copyButton(label)`, `WI.announce(msg)`, `WI.esc(s)`,
  `WI.whenVisible(el, fn)`, `WI.visibility(el, fn(visible))` (in view AND tab visible — use it to pause animation),
  `WI.idle(fn)`, `WI.url(path)` (site-root URL), `WI.iconUrl(name)`, `WI.magnetic(el)`, `WI.reduced`, `WI.theme()`,
  `WI.on('theme' | 'ready' | 'fonts', fn)`, `WI.skeletonSvg(name, opts)`.

## Ask-AI widget (added 2026-10-01, intents + search-adjacent trigger 2026-10-01; js/site.js + css/chrome.css)
The Ask AI is about getting the visitor the best icon for THEIR use, not "asking about an icon". Every brief starts with
"First, open and follow https://withicons.com/skill/SKILL.md" (+ llms.txt and /api/search?q=), then one `MY TASK:` line.
```html
<div data-ask-ai data-intent="find" data-ask-bind="#need"></div>              <!-- row of assistant buttons -->
<div data-ask-ai data-ask-mode="button" data-ask-bind="#q" data-intent="find"></div> <!-- [✦ Ask AI] beside a search box -->
<div data-ask-ai data-ask-mode="tasks" data-icon="trash" data-style="solid"></div>  <!-- icon contexts: task picker -->
<div data-ask-ai data-intent="slides" data-app="canva"></div>                 <!-- app guides -->
<div data-ask-ai data-query="throw away" data-compact></div>                  <!-- logos only -->
```
Intents (`data-intent` / opts `intent`):
- `find` (default without an icon): the need is the query (or bound field); adds the site's top 6 local matches as
  candidates; asks for best fit + up to 2 alternatives (one-line reasons), best style, code/steps for their stack, links.
- `code`, `set` (default with an icon: audience-neutral, plays to the 7 consistent styles; single-icon basics are already
  one click on the page), `fit`, `slides` — need an icon + style; the visitor's "What are you making?" line is the need.
  `slides` also works without an icon when `app` (a guide slug) is given.
Modes (`data-ask-mode` / opts `mode`): `row` (default, labelled buttons + note), `compact` (`data-compact`, logos only),
`button` (search-adjacent trigger: one pill that opens an assistant menu; with an empty bound field it focuses the field,
sets the placeholder to "Describe what it's for…" and fires `askai:describe` / `askai:describe-end` on the host),
`tasks` (4 task cards with one-line descriptions + optional "What are you making?" input + assistants + brief preview;
add `compact` for narrow panes → pill chips and logo buttons). Last-picked task (localStorage `with-ask-intent`) and
the "making" text (sessionStorage) are remembered; changing task fires `askai:intent` ({ intent, icon }) on the host.
Placements: home hero box, ⌘K overlay search row (`.so-ask`), library search field (`.lib-ask`) use `button`; zero-result
states (hero panel, overlay, library) show a `find` row; icon pages have ONE `tasks` card (#ask-ai) plus a jump link
(`[data-ask-jump]`) near the downloads; library viewer uses compact `tasks`; guides use `slides` + `data-app`; other pages `find`.
API: `WI.askAI.render(el, opts)`, `.update(el, opts)` (keeps the visitor's task/text; refreshes links), `.prompt(opts)`
(full brief, copied), `.prefill(opts)` (text for ?q=: the full brief when ≤ 1,800 chars, else the essentials + "full brief
is on your clipboard"), `.setIntent(el, intent)`, `.intents`, `.iconIntents`, `.skill`. opts `{ icon, style, query,
intent, app, mode, compact, bind, label }`.
Clicking an assistant copies the full brief (synchronously, inside the click) and the link's own default action opens a
new tab with ?q= prefill: claude.ai/new, chatgpt.com/, perplexity.ai/search, grok.com/, gemini.google.com/app (Gemini has
no native prefill; ?q= only helps extension users). Gemini is marked with a Ctrl+V/⌘V badge; after the click a persistent
notice (`.gem-note`: logo, "In Gemini, press Ctrl+V then Enter", Copy again, Open Gemini, preview) stays until closed. If
copying fails, the tab is NOT opened: the manual-copy dialog shows the text selected plus an "Open Gemini" link.
`WI.manualCopy(text, title, { href, label })`. Put `data-on-dark` on a dark container for light-on-dark buttons.
Search overlay: `WI.copyPng(name, style, px?)` copies a PNG (downloads it where image clipboard is unavailable).
Evergrow logos: `brand/evergrow-black.webp`, `brand/evergrow-white.webp`, `brand/evergrow-square.webp`
(optimised from the provided files) — used in the footer "Powered by Evergrow" (theme-aware) and the navbar byline.

## AI coding-tool integrations data (added 2026-10-01; produced by the integrations agent)
`<script src="data/integrations.js"></script>` defines `window.WITH_INTEGRATIONS` = array of
`{ id, name, logo: { light, dark }, blurb, oneLiner /* e.g. "npx withicons init cursor" */,
   steps: [{ title, text, code? , lang? }], mcp: { kind: 'local'|'remote', snippet, lang, path? },
   skill: { snippet?, path? }, deeplink?: { href, label } /* e.g. Add to Cursor */, docs: url, verified: 'YYYY-MM-DD' }`
for: claude-code, codex, cursor, opencode, lovable (+ claude-desktop, vscode, windsurf if useful). Logos in site/brand/.
Home page and ai.html render "Add with icons to your AI tool" from this file — never hardcode commands elsewhere.
Generated by `node forge/tools/site-integrations.mjs` from `forge/integrations.json` (facts + doc URLs). Order: claude-code,
codex, cursor, opencode, lovable, claude-desktop, vscode, windsurf. Extra fields: `logo` may be `null` (vscode, windsurf: no
logo supplied; render a with icons `code` icon or the name) and may carry `mono` (currentColor, for inline use);
`wordmark?: { light, dark, mono }` (opencode, lovable); `mcpLocal?` (same shape as `mcp`, npx variant); `deeplinks?: [{ href, label }]`
(`deeplink` = the first; cursor:// and vscode: links open the app, Lovable's opens its Connectors page); `oneLiner` is
`null` for Lovable (cloud: no CLI); `sources: [url]`. Logos live in `site/brand/ai/` (`<name>-light.svg` = dark ink for light
backgrounds, `-dark.svg` = light ink for dark backgrounds; claude/codex/lovable marks are one file for both).

## Alternatives / comparison pages (added 2026-10-01)
`site/alternatives/index.html` and `site/alternatives/<library>.html` (font-awesome, material-symbols, heroicons,
lucide, feather, phosphor, bootstrap-icons, tabler, ionicons, remix-icon, …), generated by forge/tools/site-alternatives.mjs.
Facts about other libraries must be accurate, sourced and dated; fair, never disparaging.
