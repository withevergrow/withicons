# Authoring a demo page

Read this fully before you write a page. It is the contract for every demo page in `site/demos/`.

## What a demo is

One self-contained HTML file, `site/demos/<slug>.html`, that looks like a **real, finished website or invitation** (not a template, not a wireframe)
and shows what the **with icons** library does for it. Each page can be flipped live between three levels with the floating control bar
(`_kit/demo-kit.js`, already written, do not edit it):

| level | name | what the visitor sees |
|---|---|---|
| 0 | **Basic** | A plain site as most people would build it today: emoji and plain text where icons would go. Credible, tidy, not broken. |
| 1 | **Upgraded** | The same page with every emoji replaced by a with-icons icon in the chosen style (default style = the page's own). |
| 2 | **Full** | Upgraded plus the things only the library can do: live icons (dates, clocks, counts, weather, ratings, prices), motion, decorative icon flourishes, themed palettes. |

The bar also swaps among all 34 styles, changes size, weight, ink, motion, and lets the visitor click any icon and replace it with another.
You make that work simply by marking slots (below). **Design the page so it looks excellent at Full in its default style and still looks right when
the visitor flips to any other style, level, or 0.6x to 1.8x size.**

Everything is **fictional**: people, places, shops, products. Phone numbers use `555-01xx`. Say so in the footer ("Demo page made with with icons. Names, places and products are fictional.").

## Files you may touch

Only `site/demos/<slug>.html`. Never edit `_kit/`, `_tools/`, `_data/`, `AUTHORING.md`, or another page. Previews go to `.preview/` (gitignored), scratch files to `.tmp/`.
Brief for your page: its entry in `demos/_data/demos.json` (title, mood, `must` features, event/brand facts, default style, recommended styles).
Photos: `demos/_data/photos/<slug>.json` (already researched and visually verified: use only these, every one of them if you can).

## Page skeleton

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The Hollow Hill Masquerade | Halloween party invitation</title>
<meta name="description" content="…">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<style> …all page CSS, mobile-first… </style>
</head>
<body>
 …page…
 <section id="credits">…</section>
 <footer>…</footer>
<script src="_kit/demo-kit.js" data-style="gothic" data-recommend="gothic,halloween,glass,sketch,engrave,luxe,chrome,line" data-level="2" defer></script>
<script> …page behaviour, vanilla JS… </script>
</body></html>
```

* No frameworks, no build, no other third-party JS or CSS. Google Fonts (2 families max, `display=swap`) is the only external stylesheet. Must work when opened from `file://`.
* `data-style` = the page's default style (from the brief); `data-recommend` = the `recommend` list from the brief; `data-level="2"`.
* Do **not** include `@withicons/*` scripts yourself: the kit loads the runtime. Do not use `<img src="…svg">` for icons or inline SVG icons.
* Decorative CSS (patterns, gradients, borders, bunting, a CSS-only barber pole, etc.) is encouraged. Inline SVG is fine for non-icon art (a wavy divider, a map outline, a logo wordmark), never for something the library has an icon for.

## Icon slots (the heart of it)

```html
<span data-ico="calendar" data-size="24">📅</span>                         <!-- text inside = the Basic-level fallback -->
<span data-ico="sparkles" data-size="20" data-min-level="1"></span>       <!-- decorative: nothing at Basic -->
<span data-ico="jack-o-lantern" data-size="64" data-label="Jack-o'-lantern" data-motion="hover">🎃</span>
<button class="btn"><span data-ico="shopping-bag" data-size="18">🛍️</span> Add to bag</button>
<span data-ico="home" data-size="22" data-fixed-style="line">🏠</span>      <!-- stays line whatever the page style is (use rarely: tiny UI controls) -->
```

| attribute | meaning |
|---|---|
| `data-ico="name"` | the icon. **Canonical name from the library.** Look every name up (below); never guess. |
| text content | Basic-level fallback: an emoji, or a plain glyph (•, →, ★), or empty for purely decorative slots. Also what shows with JS off. |
| `data-size` | px at Upgraded/Full (default 24). The size slider scales it. Use 20 to 28 for inline/UI, 36 to 72 for feature icons, 80 to 160 for hero art. |
| `data-label` | accessible name (makes it `role="img"`). Without it the icon is `aria-hidden` (right when text sits next to it). Icon-only buttons: put `aria-label` on the **button** instead. |
| `data-min-level="1"` or `"2"` | on **any** element: shown only from that level up. `data-max-level="0"` = only at Basic (e.g. a plain `<hr>`). |
| `data-motion` | `hover`, `loop`, `once` or `inview`: authored motion played at Full. One or two loops per screen at most; prefer hover. |
| `data-fixed-style` | pin one icon to a style. |
| `data-sample` | mark the one icon the style chips in the panel should preview (pick your most characteristic icon). |
| `data-kit-key` | stable id for saved swaps (optional). |

**Rules**

1. **Quantity.** Invitations: at least 40 icon slots and 25 distinct icons. Shops: at least 60 slots and 35 distinct icons. Icons belong wherever a real designer would put them (details, bullets, feature rows, nav, buttons, badges, steps, empty states, form fields, footers, section ornaments, even "list markers"), not scattered for show. Use big illustrative ones in the hero/feature areas (festival and object icons are the showpieces).
2. **Names.** `node demos/_tools/icons.mjs search "balloon"` · `check name…` · `cats` · `cat indian-festivals`. Prefer canonical names (an alias works but shows a warning in audit). Festival/themed icon categories: `halloween`, `indian-festivals`, `christmas`, `lunar-new-year`, `valentines`, `food`, `commerce`, `home`, `objects`, `nature`, `weather`, `time`, `maps`, `communication`, `avatars`. If no icon matches honestly, use the closest and keep the text label; never fake it.
3. **Both ends work.** The slot's emoji must be the natural emoji for that meaning so Basic looks right.
4. **Dynamic markup** (cart rows, filtered grids, the memory wall) may contain `data-ico` slots: the kit upgrades them as they are inserted. Call `WithKit.refresh(container)` if you build nodes before attaching them.
5. **Palette harmony.** Multi-colour styles paint CSS variables `--with-<style>-<role>` (roles `c1 c2 c3 c4 accent ink shadow shine edge tint`; table in `packages/web/README.md`). Tune the default style to the page's brand on `:root`, and 2 or 3 of the recommended styles if they clash, e.g. `:root{--with-gothic-c1:#7a1030;--with-gothic-accent:#c9a24a}`. Plain styles (line, solid, duo) follow CSS `color`: set `color` on the slot's container so they match the text or accent. Do not fight the visitor's ink choice: the kit overrides `color` only when they pick an ink.
6. **Size honesty.** Illustration styles (everything but line/solid/duo) are drawn for 32px and up. If a UI row needs 16 to 20px icons, that is fine at line/duo; the panel warns the visitor when a style is too small, so make the **feature icons** big enough (40 to 72px) that most styles look great.

### Live icons (Full level)

```html
<span data-live="calendar-date" data-p-day="31" data-p-month="OCT" data-size="72" data-label="Saturday 31 October">31</span>
<span data-live="clock-time"    data-p-time="20:00" data-size="56" data-label="8 pm">8pm</span>
<span data-live="cart-count"    data-p-count="0" data-size="28" id="cart-badge">0</span>
<span data-live="rating-stars"  data-p-rating="4.5" data-size="72" data-label="4.5 out of 5">★★★★½</span>
```

* Params are `data-p-<kebab-param>` (the `param` column of `node demos/_tools/icons.mjs live`). The text inside is the Basic fallback.
* Update one from your own JS: `WithKit.setLive(el, { count: 3 })` (e.g. the cart badge). Live icons render in every style, so use them where a number or date belongs: dates, times, countdown-ish numbers, weather, ticket/queue numbers, ratings, prices, discounts, avatars with initials, step numbers, map-pin numbers, stock counts.
* Use **5 to 10** live icons per page, each doing a real job. Give each a `data-label` with the full human-readable value.
* In Basic they fall back to plain text, which is exactly the point.

### Levels in CSS

The kit sets `data-level="0|1|2"` on `<html>`. You may tune the page per level (flatter borders at 0, extra ornaments at 2) with `html[data-level="0"] .card{…}`, but keep the layout and content identical: the story is "same site, icons added", not "different site".

## Photos

* Use only photos in your catalogue `demos/_data/photos/<slug>.json` (fields: `slot`, `src`, `id`, `page`, `url`, `photographer`, `photographerUrl`, `alt`, `focal`, `width`, `height`, `orientation`, `notes`). **Never invent a photo id or URL.**
* URL: Pexels `https://images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg?auto=compress&cs=tinysrgb&w=<W>`; Unsplash `<catalogue url>?auto=format&fit=crop&w=<W>&q=75` (the catalogue `url` is the bare `https://images.unsplash.com/photo-…`). Request the width you need: hero 1600, big card 1000, small card/thumb 600. (`node demos/_tools/photos.mjs url <slug> <index|id> <w>` prints one.)
* Every `<img>` gets: meaningful `alt` (from the catalogue, adapt to context), `width` and `height` (or CSS `aspect-ratio`) so the layout does not jump, `object-fit: cover; object-position: <focal>`, `loading="lazy"` and `decoding="async"` except for the hero. Respect each photo's orientation: portrait photos in portrait frames.
* **Credits are mandatory.** Every photo used appears in a `<section id="credits">` near the bottom: heading "Photo credits", then one line per photo: what it is, "Photo by <a href=photographerUrl>Name</a> on <a href=page>Pexels</a>/<a href=page>Unsplash</a>" (Unsplash links may carry `?utm_source=withicons_demos&utm_medium=referral`). Also mention "Icons: with icons (withicons.com), MIT" and the fictional-demo line. A small visible credit on or right under the hero photo is a nice touch too. Do not use a photo that is not credited.
* Author with the hot-link URLs above, then self-host: `node demos/_tools/localize-photos.mjs <slug>` downloads each photo into `site/demos/_img/<slug>/` and rewrites the page (the site CSP allows no image hosts). See README "Photos and licences".

## Realism (this is what makes it a good demo)

* Write like the real thing: specific, warm, plausible copy; real-sounding names, prices, dish names, product names, reviews, opening hours, dress codes, FAQs, small print. **No lorem ipsum, no "Your text here", no "Feature one".** Plausible numbers (USD for shops unless the brief says otherwise).
* Build the interactions the brief lists, in vanilla JS, and make them actually work: RSVP/booking forms with validation and a friendly success state; `Add to calendar` that downloads a real `.ics` (Blob + download link, correct date/time); countdowns to the real event date in the brief (if it has passed show a graceful message); cart drawers with quantities, subtotal and free-shipping progress; working filters, sorts, quizzes, builders, sign-up sheets. State is in memory (optionally `sessionStorage`); forms never submit anywhere (use `event.preventDefault()`; `action="#"`).
* Structure like a real site of that kind: announcement bar, sticky header, hero, sections with a rhythm of dense and airy, strong footer. Invitations: hero with the "who/what/when/where", practical details, schedule, what to bring, location with a styled (not embedded) map card and directions, RSVP, FAQ, host sign-off.
* Typography and colour from the brief's `mood`. Real design, not generic Bootstrap: a distinctive hero, deliberate spacing, a consistent component language, tasteful motion (CSS transitions, `prefers-reduced-motion` respected).
* Responsive from 360px to 1440px+, mobile-first, no horizontal scroll. Touch targets 44px. Focus-visible styles. Real landmarks (`header`, `nav`, `main`, `footer`), one `h1`, labelled form fields, `button` for actions, sufficient text contrast (4.5:1) in the default style at Full level.
* The kit's floating bar sits **bottom-right** (about 460 x 48 px, taller when its panel is open). Give the footer 96px of bottom padding so credits are never covered, and do not put your own fixed elements bottom-right (a sticky mobile CTA goes bottom-left or above 80px).
* Content must not depend on an icon style: never rely on an icon alone to carry meaning; keep text labels.
* Do not use the retired brand names (egopenicons, Evergrow Open Icons, `eg-`). The product is **with icons** (lowercase), withicons.com.

## Check your work (mandatory, repeat until clean)

```bash
node demos/_tools/icons.mjs audit site/demos/<slug>.html                       # unknown / alias icon names, counts
node demos/_tools/shot.mjs site/demos/<slug>.html --out .preview/<slug>-d2     # desktop 1280, page's own level 2 + style: sliced PNGs + QA report
node demos/_tools/shot.mjs site/demos/<slug>.html --level 0 --out .preview/<slug>-d0
node demos/_tools/shot.mjs site/demos/<slug>.html --level 1 --style <another recommended> --out .preview/<slug>-d1
node demos/_tools/shot.mjs site/demos/<slug>.html --mobile --out .preview/<slug>-m2
node demos/_tools/shot.mjs site/demos/<slug>.html --click "#cart-toggle" --viewport-only --out .preview/<slug>-cart     # interactions: click selectors in order
```

**Read the PNGs** (Read tool) and look: composition, hierarchy, image crops, text legibility, spacing, that Basic looks credible and Full looks rich. The JSON report lists hard `errors` (console errors, failed requests, broken images, photos missing from the catalogue or from `#credits`, icons that did not render, horizontal overflow) that you must fix, and `warnings` to clear where sensible. Test your own interactions through `--click` / `--eval`. Also try 3 or 4 different styles at Full (`--style clay`, `--style line`, `--style kawaii`, `--style engrave`) and make sure nothing breaks or becomes unreadable.

Shadow-DOM note: the kit's controls are inside `#withicons-kit`; pierce with `"#withicons-kit >>> #b-open"` (opens the panel), `#p-edit` (pick-icons mode), `.cell` (picker results).
