# with icons Journal: writing guide

The Journal (`/blog`) wears the main site's design: it loads `site/css/tokens.css`, `chrome.css`, `pages.css` and `js/site.js`,
and uses the real header and footer from `forge/tools/site-pages/lib.mjs` (footer taken from `site/DESIGN.md`), plus the site's
page parts (`pg-crumbs`, `pg-eyebrow` + `hand`, `g-title` + `g-hl`, `g-short`, `g-meta`, `pg-qa`, `btn`, `chip`). `blog/assets/blog.css`
only adds article components, using the site's tokens; each section gets one style accent (`--g`). It has its own generator
(`node blog/build.mjs` writes `site/blog/`), sitemap, RSS and llms.txt. Byline: **The Evergrow team**.

## Files

- `blog/posts/<slug>.mjs`: one post per file (the file name must equal the slug). See `with-icons-vs-font-awesome.mjs`, the reference post.
- `blog/lib/blocks.mjs`: the building blocks you write a body with (`p`, `h2`, `h3`, `ul`, `ol`, `figure`, `iconGrid`,
  `styleRow`, `sizeRamp`, `table` + `yes/no/meh`, `verdict`, `callout`, `steps`, `stats`, `quote`, `doDont`, `code`, `cta`, links `L.*`).
- Layout: running text keeps a reading measure (about 72 characters a line) centred in the column; tables, icon grids,
  face-offs, style rows, verdicts, pros and cons, photos, stats, do/don't, code and the CTA break out to the full column
  width automatically (the list is in `blog.css`, `.prose > :is(...)`). Tables get real column widths and turn into labelled
  cards when their box is too narrow (phones; 5+ column tables on tablets), so never squeeze a table into prose.
- Moving icons: `motionGrid(names, style, caption, { trigger: 'loop' | 'hover' })`, `swapGrid([['play', 'pause'], ['heart', 'heart@solid']], style, caption)`
  and `styleRow(name, caption, { motion: 'hover' })` use each icon's own motion (`forge/motion/<name>.json`). A post that uses
  them automatically loads the site's own runtime (`../vendor/motion/motion.css` + `motion.js`, never a CDN); other posts load
  nothing extra. Loops get a Pause button, and everything stays still under reduced motion or the site's Pause animations.
  Keep it to one looping demo per post; prefer hover and swap demos. CDN URLs in `code()` samples are text only.
- `blog/images.json`: the photo registry (Unsplash, free licence; credit is added automatically). Images are source files in `blog/images/<key>-{800,1600}.webp` (+ `-og.jpg` 1200x630 for heroes); the build copies them into `site/blog/assets/img/` (generated, gitignored) and never deletes them.
- Icon names: `forge/manifest.json` (300 icons). Styles: line, solid, duo, gloss, engrave, blueprint, sketch. An unknown name fails the build.

## Post fields

`slug, category ('comparisons' | 'guides' | 'basics' | 'ai'), date ('2026-10-02'), hero (image key), stickers ([[icon, style] x3], floating on the hero),
title (<= 70 chars, the SEO title), cardTitle (short, for cards), h1 (may use <em>), dek (1-2 friendly sentences), description (110-165 chars, meta),
keywords [], about [], related [3 slugs], tldr [4-5 answer-first bullets, HTML allowed], faq [{q, a}] (4-6), sources [{title, url}], body: () => html`

## Voice

- Write for a smart friend who is **not** a developer: a marketer, founder, teacher, student, someone making slides.
  Short sentences. Everyday words. Explain any jargon the first time in a few words ("an SVG is a picture made of shapes, so it stays sharp at any size").
- Friendly and warm, a little playful, never salesy. Use "you" and "we". No hype words (revolutionary, game-changing, unleash, elevate, seamless).
- **Honest.** Say where competitors are better. Never invent numbers, quotes, studies or features. If unsure, leave it out or soften it.
- **No em dashes** (the build warns). Use commas, colons, brackets or full stops.
- Code is rare and short, and always after a plain explanation. Most readers will never touch code.

## SEO and GEO (being quoted by AI answers)

- Answer first: the TL;DR box and the first paragraph must answer the title's question directly.
- One idea per H2. Write H2s as the questions people actually type ("Is Font Awesome free for commercial use?").
- Use real tables for comparisons, numbered steps for how-tos, short self-contained paragraphs that make sense when quoted alone.
- Put specific, checkable facts (counts, prices, licence names) next to a source in `sources`, and say when they were checked (October 2026).
- Link generously: to icon pages (`L.icon('home')`), styles (`L.style('gloss')`), guides (`L.guide('powerpoint', 'PowerPoint guide')`),
  alternatives pages (`L.alt('lucide', '…')`), and other Journal posts (`L.post(slug, text)`).
- 1,300-2,000 words of body. At least 4 visual blocks with real icons (iconGrid, styleRow, sizeRamp, table marks, verdict, callout) and 1-2 photos.

## Facts about with icons (use these, don't embellish)

Use the constants from blocks.mjs in copy (`${N_ICONS}`, `${N_STYLES}`, `${N_SVGS}`) so numbers never go stale again.

- **500 icons**, each drawn once on a 24 x 24 grid and rendered into **20 styles** = **10,000 SVGs**. 19 categories. 50 "Live" icons with built-in motion.
- Everyday interface styles (3): **line** (1.75px outline, the default), **solid** (filled; active states, small sizes), **duo** (line over a soft tint).
- Creative styles (17), for illustrations, hero sections, slides and marketing at 32px or larger: gloss, engrave, blueprint, sketch, glass, kawaii,
  sticker, pixel, retro, bauhaus, luxe, skeuo, anime, coquette, gothic, pastel, plush. (A few of the newest may not render in this checkout yet;
  `styleRow()` shows whatever is available and says "N of its 20 styles".) Describe them from the `description` in `forge/styles/<style>.mjs`
  (main checkout for the newest). Each icon also has 20-30 hand-picked colour palettes that recolour every multi-colour style, and optional motion.
- MIT licence: free for personal and commercial use, no attribution required.
- Every icon page: Copy image, PNG download (choose size and colour), SVG download, Copy SVG code. Guides for PowerPoint, Google Slides, Keynote, Canva,
  Figma, Notion, Word/Google Docs, WordPress, Webflow, Framer, Wix/Squarespace, email signatures, HTML.
- Developers: React, Vue, Svelte, Angular, SolidJS components, a `<with-icon>` web component, `<i class="with with-home">` CSS classes, SVG sprites.
  **The npm packages are live (0.2.0)**: `npm i @withicons/react` (also `vue`, `svelte`, `angular`, `solid`, `web`, `classes`, `static`, `motion`, `dynamic`),
  CDN via jsDelivr (`https://cdn.jsdelivr.net/npm/@withicons/classes/dist/with-line.css`), local MCP server `npx -y @withicons/mcp`, and `npx withicons init`
  to add the skill + MCP server to AI tools. Never write "launching soon". For non-developers, still point to the icon pages for copy/download.
- AI: an MCP server (lets AI assistants search the real icon list), `https://withicons.com/llms.txt`, an agent skill, and "Ask AI" buttons on the site.
- Search understands everyday words and aliases ("bin" finds trash, "gear" finds settings).
- No brand logos. No icon fonts. Brand name is always lowercase **with icons**; "Powered by Evergrow".

## Competitor facts

Start from `forge/tools/site-alternatives/libraries-open.mjs` and `libraries.mjs` (checked 2026-10-01, with sources), then verify anything you
state on the official site. Quote counts the way the source states them ("over 2,000").

## Check your work

`node blog/build.mjs --dry --only=<your-slug>,<your-slug>` (validates without writing; safe in parallel) must print no warnings for your posts (warnings about related posts that another writer has not finished yet are fine).

## Comparison posts: real rival icons + pros and cons

- `faceOff('<lib>', { variant, ourStyle, concepts, caption })` shows our icon above the rival's REAL icon for the same idea, with both names.
  Pair like with like (their outline vs our `line`, their solid/filled vs our `solid`).
- `rivalStyles('<lib>', concepts)` shows every style/weight the rival offers. Put it near our `styleRow`.
- `prosCons(name, { lib, pros: [[lead, text]], cons })` explains pros and cons in short paragraphs. Every comparison needs one for each side.
- Rival keys: font-awesome, hugeicons, lucide, heroicons, phosphor, material-symbols, tabler. Concepts: home search settings user bell mail heart
  trash calendar shopping-cart star download.
- The rival SVGs live in `blog/third-party/<lib>/` (pinned versions + LICENSE), fetched by `node blog/tools/fetch-rivals.mjs`. They are shown
  only for comparison, always with the licence credit (added automatically). The build copies their licences into `site/blog/assets/licenses/`.
  **Never** use them as input for with icons drawings (AGENTS.md "Originality"). Marketplaces (Flaticon, Icons8…) are not copied: their licences forbid it.

## SEO / GEO checks done by the build

Warnings for: duplicate titles or descriptions, fewer than 5 internal links, a weak first paragraph, comparisons without 2+ sources,
`faceOff` or `prosCons`. `<title>` gets "| with icons" only when it still fits in ~65 characters. Each post gets BlogPosting (with
`about`/`mentions` entities, `citation`, `speakable`), BreadcrumbList and FAQPage JSON-LD. Topic hubs (`comparisons.html`, `guides.html`,
`design-basics.html`, `ai-and-tools.html`) carry CollectionPage + ItemList.
