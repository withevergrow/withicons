# with icons: SEO & GEO strategy (November 2026)

Written 2026-11-06 from Google Search Console (last 3 months), Bing Webmaster Tools (Search Performance, AI Performance,
Keyword Research) and the current site. Volumes below are **Bing's own 3-month impression counts** from its Keyword
Research tool. Google volumes were not available, so treat them as relative, not absolute.

## 1. What the data says

| Signal | What we see | What it means |
|---|---|---|
| Brand carries the clicks | GSC: "with icons" 33 clicks / 53 impressions, "with icon" 9 / 47. Bing: "with icons" 14 clicks at position 2.1 | People who know us find us. Almost nobody else does yet. |
| Head terms already show up on Bing | Bing: "icons" 411 impressions at **position 7.4**, "icon" 219 at **8.3**, "free icons" at 6.4 | On Bing we already sit on page 1 for the biggest words. CTR is under 0.5%, so the titles and snippets are not winning the click. |
| Icon pages pull long-tail traffic | Bing: "laptop icon" 55 (pos 8), "hand icon" 42, "timer icon" 27, "spider icon" 26, "pill icon" 10, "paste icon" 5. GSC: "navigation icon" 12, "blueprint icon" 17, "kawaii icons" 15 | The 1,000 icon pages and 34 style hubs are our real SEO surface. Each one needs to win its own "X icon" query. |
| AI answers already cite us | Bing AI Performance: **246 citations** in about 3 weeks, top grounding queries "laptop icon" (72) and "user icon" (40) | Copilot and other AI answers already use our icon pages as sources. That is the GEO beachhead. |
| How-to intent exists | GSC: "how to insert icons into google slides" 15 impressions | The guides get seen for task queries, but the title does not use the searcher's verb ("insert"). |
| Commercial "best / free" intent is missing | GSC: "free svg icon" 16 impressions (3 clicks), "free animated icons" 3 (1 click). No impressions at all for "best icon library", "best animated icon library", "react icons", "flaticon alternative" | We have pages that *could* rank (best-free-icon-libraries, the /free landers), but nothing aimed at the "which one should I use" questions. |
| The market around us | Bing volumes: flaticon 327K, icon 206.5K, icons 83.4K, svg 77.6K, flat icon 31K, free icons 18K, svg repo 15.4K, free svg 4.9K, laptop computer icon 2.8K, free svg icons 2.1K, icon svg 1.6K | Big navigational demand for marketplaces (Flaticon, SVG Repo). The way in is the "alternative to", "without attribution" and "best for X" angle, not the head term itself. |

## 2. The strategy in five moves

1. **Own the "which one should I use" questions.** Write honest, answer-first comparison guides for each "best ... icon
   library" question (React, animated, Figma, 3D, AI builders), so that Google ranks them and AI answers quote them.
   Each guide names a winner for each use case, and with icons is only the winner where it really is.
2. **Win the "free + condition" queries.** Marketplace users run into a condition (attribution, a paywall, PNG only, a
   pack that does not match). Write for the moment they hit it: "free icons no attribution", "where to get free SVG icons",
   "aesthetic icons".
3. **Split each query into two pages.** Every commercial head term gets two pages with different intents, linked both ways:
   - a **transactional lander** that already exists (`/free/svg-icons.html`, `/free/animated-icons.html`, `/free/3d-icons.html`),
     where people come to get icons now;
   - a **Journal post** for people still comparing ("where to get", "best", "vs"). It links to the lander as the "get them"
     step, and the lander links back as the "compare first" step.
   Both pages never target the same title phrase, so they do not cannibalise each other.
4. **GEO: be the source AI answers want to quote.** Every post opens with a TL;DR box and a 2 to 3 sentence direct answer.
   Each H2 is phrased the way people ask it. Facts are checkable, dated and sourced, and comparisons sit in real tables.
   Posts carry FAQPage, BlogPosting (`about`, `mentions`, `citation`, `speakable`) and BreadcrumbList JSON-LD. llms.txt
   and llms-full.txt list every post. One post (AI app builders) targets AI-tool users directly, a low-competition niche
   where answer engines are hungry for sources.
5. **Turn Bing impressions into clicks.** We already rank 7 to 8 on Bing for "icons", "icon" and dozens of "X icon"
   queries. Titles and snippets are the cheapest lever we have (section 5).

## 3. Target keywords (25) and the page that owns each

Intent: **C** commercial (comparing), **T** transactional (wants icons now), **I** informational (how / why), **N** navigational.

| # | Keyword cluster | Intent | Signal | Owner page | Status |
|---|---|---|---|---|---|
| 1 | best icon library / best free icon libraries | C | none yet | `blog/best-free-icon-libraries` | refreshed: title, H2s and FAQ now say "best icon library"; links to every new best-of guide |
| 2 | free svg icons / free svg / free svg icon | T + C | Bing 2.1K + 4.9K; GSC 16 impr, 3 clicks | T: `/free/svg-icons.html` · C: `blog/where-to-get-free-svg-icons` | **new post** |
| 3 | svg repo alternative / sites like svg repo | C | "svg repo" 15.4K | `blog/where-to-get-free-svg-icons` | **new post** (section) |
| 4 | best animated icon library / animated icon library | C | none yet | `blog/best-animated-icon-libraries` | **new post** |
| 5 | free animated icons / animated svg icons / lottie icons | T + C | GSC 3 impr, 1 click | T: `/free/animated-icons.html` · C: post #4 | **new post** + lander |
| 6 | best react icon library / react icons / lucide-react vs react-icons | C | none yet | `blog/best-react-icon-libraries` | **new post** |
| 7 | shadcn icons / change icons in shadcn/ui / lucide alternative for shadcn | I + C | none yet | `blog/shadcn-ui-icons` | **new post** |
| 8 | free icons no attribution / icons without credit | C | none yet | `blog/free-icons-no-attribution` | **new post** |
| 9 | flaticon alternative / sites like flaticon / flat icon | C | flaticon 327K, flat icon 31K | `/alternatives/flaticon.html` + `blog/with-icons-vs-flaticon` + post #8 | existing; post #8 adds the "no credit" angle |
| 10 | free icons for commercial use | I | none yet | `blog/free-icons-commercial-use` | existing |
| 11 | best figma icon library / figma icon plugin / icons for figma | C | none yet | `blog/best-figma-icon-libraries` (+ `/free/icons-for-figma.html`, `/guides/figma.html`) | **new post** |
| 12 | icons for lovable / v0 / bolt / cursor / vibe coding icons | C + I | none yet (low competition) | `blog/icons-for-ai-app-builders` | **new post** (GEO play) |
| 13 | icon fonts vs svg icons / is font awesome an icon font | I | none yet | `blog/icon-fonts-vs-svg` | **new post** |
| 14 | aesthetic icons / aesthetic app icons / pastel / coquette icons | T + I | high demand in the market; GSC "kawaii icons" 15 | `blog/aesthetic-icons` (+ `/free/pastel-icons.html`, `/free/coquette-icons.html`) | **new post** |
| 15 | free 3d icons / 3d icon pack | T + C | none yet | T: `/free/3d-icons.html` · C: `blog/free-3d-icons` | **new post** |
| 16 | kawaii icons / cute icons | T | GSC 15 impr | `/styles/kawaii.html`, `/free/cute-icons.html` | existing; linked from post #14 |
| 17 | blueprint icon(s) | T | GSC 17 impr | `/styles/blueprint.html` | existing |
| 18 | how to insert icons into google slides | I | GSC 15 impr | `/guides/google-slides.html` | **recommend**: add "insert" to its title and H1 (D3) |
| 19 | free icons | T | GSC 32 impr; Bing 18K, pos 6.4 | `/free/index.html`, home | **recommend**: snippet work (section 5) |
| 20 | icons / icon | T + N | Bing 83.4K + 206.5K, pos 7.4 and 8.3 | home + `/icons.html` | **recommend**: snippet work |
| 21 | laptop icon / laptop computer icon | T | Bing 55 + 19 impr, pos 5 to 8; 72 AI citations | `/icons/laptop.html` | existing; snippet work |
| 22 | user icon | T | 40 AI citations | `/icons/user.html` | existing; snippet work |
| 23 | hand / timer / spider / pill / paste icon | T | Bing 5 to 42 impr each, pos 6 to 8 | icon pages | existing; snippet work |
| 24 | navigation icon | T | GSC 12 impr | icon page + category | existing |
| 25 | svg vs png icons / icon sizes / icon styles | I | supporting | existing basics posts | existing; internal links from the new posts |

## 4. The new Journal posts (this round)

Ten new posts plus one refresh, all on the existing Journal pipeline (`blog/posts/<slug>.mjs` → `node blog/build.mjs`).
They use the withicons.com header, footer, tokens and page parts, and follow the voice, structure and checks in
`blog/WRITING.md`.

| Post | Category | Primary keyword | Promise to the reader |
|---|---|---|---|
| where-to-get-free-svg-icons | guides | free svg icons | 10 honest places to get free SVG icons, what each one's catch is, and how to check a licence in 30 seconds |
| best-animated-icon-libraries | comparisons | best animated icon library | Lordicon, LottieFiles, useAnimations, animated Lucide sets and more: formats, prices and when animation helps |
| best-react-icon-libraries | comparisons | best react icon library | lucide-react, react-icons, Heroicons, Phosphor, Tabler, MUI and more: bundle size, styles and which suits your stack |
| shadcn-ui-icons | guides | shadcn icons | How shadcn/ui picks its icons, how to switch library (`iconLibrary`) and what to keep consistent |
| free-icons-no-attribution | guides | free icons no attribution | Which sets need no credit line, which ones do, and what "attribution" really means in each licence |
| best-figma-icon-libraries | comparisons | best figma icon library | Plugins vs community files vs copy-paste SVG: which sets work best in Figma, and how to keep them as editable vectors |
| icons-for-ai-app-builders | ai | icons for lovable / v0 / cursor | How Lovable, v0, Bolt, Cursor and Claude pick icons, why they hallucinate icon names, and how to give them a real set |
| icon-fonts-vs-svg | basics | icon fonts vs svg | Why most teams moved from icon fonts to SVG, when a font still makes sense, and what CSS-class icons are |
| aesthetic-icons | guides | aesthetic icons | Pastel, coquette, kawaii and soft-3D icons for Notion, slides and a home screen, including the iPhone Shortcuts method |
| free-3d-icons | comparisons | free 3d icons | Where free 3D icons come from (PNG renders, Blender, SVG 3D styles) and which suits slides, landing pages and apps |
| *refresh:* best-free-icon-libraries | guides | best icon library | Now also answers "best icon library" and links to every "best for X" guide (the hub of the cluster) |

**Quality bar, per post:** 1,300 to 2,000 words; answer first; at least 4 visuals made from real icons; an honest
comparison table where there is a comparison; competitor facts from official sources, dated November 2026; 4 to 6 FAQs; 5 or
more internal links (icon pages, style hubs, /free landers, guides, other posts); no hype words, no em dashes, no invented
numbers. Each post points to the matching /free lander as its "get them now" step.

## 5. Recommendations outside the Journal (other owners)

These are not done in this round, because the pages belong to other owners (see AGENTS.md "Ownership").

1. **Icon page snippets (D2, `forge/tools/site-seo.mjs`).** Today the title is "Laptop icon: free SVG & PNG in 34 styles".
   It ranks 5 to 8 on Bing with a CTR near 0%. Test "Laptop icon (free SVG & PNG): 34 styles, animated, no sign-up" and
   start the description with the action ("Download the laptop icon free as SVG or PNG..."). Also check that the most-searched
   alias is visible on the page ("laptop computer icon" has 2.8K Bing volume, and we only list it as an alias).
2. **Home and /icons.html titles (D1/D2).** We rank about 7 on Bing for "icons" and "icon". A title that says what makes us
   different ("Free icons in 34 styles: SVG, PNG & animated, no attribution") may lift CTR more than any new page.
3. **Google Slides guide (D3).** Use the searcher's verb: "How to insert icons into Google Slides (free, step by step)".
4. **IndexNow (launch owner, `scripts/deploy.mjs`).** Bing and Yandex reindex within minutes when the changed URLs are pinged
   after deploy. We already rank on Bing, so this is cheap and fast. Nothing in the repo pings IndexNow today.
5. **GEO for icon pages.** Bing AI already cites icon pages. Keep the first sentence of each icon page a self-contained
   answer ("The laptop icon is a free SVG and PNG icon of an open laptop, available in 34 styles under the MIT licence."),
   keep the alias list in text, and keep `ImageObject` / `CreativeWork` licence fields in the JSON-LD.
6. **Outside the site.** Answer existing threads honestly where with icons really fits (Reddit r/webdev, r/reactjs,
   r/shadcn, r/Notion, r/canva; Stack Overflow "icon library for X"). Submit to "awesome" lists (awesome-svg,
   awesome-react, awesome-shadcn), alternativeTo (as an alternative to Flaticon, Font Awesome and Lucide) and Iconify. AI
   answers lean heavily on these sources.

## 6. Measuring it

- **Week 0 (today):** record GSC and Bing positions for the 25 keywords above (Bing Keyword Research + GSC query filter).
- **Weeks 2 to 4:** the new URLs should be indexed (GSC URL inspection, Bing URL Inspection). Watch for first impressions on
  "best ... icon library" queries.
- **Weeks 6 to 8:** expect long-tail impressions (positions 15 to 40) on the commercial queries. Refresh any post that gets
  impressions but no clicks: rework the title, the first paragraph and the FAQs to match the exact queries GSC shows.
- **Week 12:** keep the posts that earn clicks and refresh them quarterly (counts, prices, the "checked" date). Merge or
  redirect any post that competes with its own /free lander.
- **GEO:** track Bing AI Performance citations per page, and ask ChatGPT, Perplexity, Copilot and Gemini the 10 commercial
  questions monthly. Note whether with icons is named, and which page is cited.

## 7. Round 2 (2026-11-06): questions with stale answers

Research (`.tmp/questions-dev.md`, `.tmp/questions-everyday.md`, not committed) looked for questions people keep asking where
the top answers are years old or now wrong. Developer demand comes from Stack Overflow view counts (for example 3.5M views
on "change an SVG's colour with CSS"). Everyday demand comes from support-forum threads (Microsoft, Google, Apple, Canva,
Squarespace, Wix). Each post below opens with the answer for **today** and says plainly what changed and when.

Developer questions go in a new **Icons in code** section (hub `blog/icons-in-code.html`, blueprint accent).

| Post | Question it answers | What the old answers get wrong |
|---|---|---|
| change-svg-icon-color-css | How do I change an SVG icon's colour with CSS? | Modernizr, `<object>`, jQuery inlining, filter hacks. `mask-image` has been Baseline since Dec 2023 |
| svg-icons-in-css | Can I use an SVG in `::before` or `background`? | "Not possible", base64 "for IE"; mask + `currentColor` is the answer now |
| align-icon-with-text | How do I vertically align an icon with text? | Magic `top: .15em`; CSS `text-box` became Baseline in Aug 2026 |
| svg-icon-cut-off-or-blurry | Why is my SVG icon cut off, blurry or the wrong size? | "Delete width/height"; SVGO v4 (June 2025) keeps viewBox; `vector-effect` for strokes |
| svg-sprites | How do SVG sprites work in 2026? | `xlink:href`, svg4everybody; cross-origin `<use>` still fails; CSS variables now style inside `<use>` |
| optimize-svg-icons-svgo | How do I optimise SVG icons without breaking them? | SVGO v3 defaults removed viewBox; v4 changed the defaults |
| svg-icons-in-react-and-nextjs | How do I import SVG icons in React and Next.js? | CRA's ReactComponent import; webpack configs that fail under Next 16's default Turbopack |
| icons-in-react-server-components | Why are my icons huge / client-only in Next.js? | `"use client"` on the root layout, `import *` lookups, `@react-icons/all-files` |
| migrate-icon-font-to-svg | How do I move from an icon font to SVG? | FontForge scripting, Batik |
| favicon-sizes-and-files | Which favicon files do I need in 2026? | "Safari ignores SVG favicons" (Safari 26 supports them); `"any maskable"` |
| svg-icons-in-email | Can I use SVG icons in email? | "Gmail will never support SVG"; Gmail now renders it, rasterised |
| icons-showing-as-squares | Why do my icons show as squares or text? | Retired CDN links, mixed Font Awesome versions, Material Icons ligatures |
| icon-inside-input-field | How do I put an icon inside an input? | 2009 background-GIF answer |
| icon-button-size-and-labels | How big should an icon button be, and how do I label it? | "44 px is the WCAG rule" (WCAG 2.2 AA is 24 px); `event.target` is the SVG |
| animate-svg-icons | Is SMIL deprecated? How should I animate icons? | "SMIL is deprecated" (2015-16) |
| how-to-design-an-icon (basics) | How do I draw an icon on a 24 px grid with keylines? | Guides that predate Figma component properties and variables |
| emoji-vs-icons (basics) | Emoji or icons? Can I use Apple emoji commercially? | Emojipedia 2017 lists of "free" sets |
| icon-resolution-for-print | What resolution do icons need for print? | Generic "300 DPI" with nothing about vectors |
| svg-in-google-slides | Can I put SVG icons in Google Slides? | The 2016 convert-to-WMF trick |
| powerpoint-icons-missing | Why is Insert > Icons missing or greyed out? | Contradicting forum answers; "connected experiences" buried |
| icons-in-excel-and-google-sheets | How do I make icon charts or put icons in cells? | Excel 2016-era tutorials; add-ons for what Sheets does natively |
| icon-black-or-white-background | Why does my transparent icon get a black or white background? | "Use Paint 3D" (removed Nov 2024) |
| png-to-svg | How do I convert a PNG icon to SVG? | Converters that return fake SVGs |
| canva-transparent-png | Can I download a transparent PNG from Canva for free? | Trial pushes, green-screen tricks |
| change-app-icons-android | How do I change app icons on Android now? | "Use Nova or Apex" (Nova changed hands in 2025) |
| custom-app-icons-iphone | Custom iPhone app icons on iOS 26: does the banner still show? | Contradicting answers |
| change-folder-icon-mac-windows | How do I change a folder icon on Mac or Windows? | Pre-Tahoe guides; "rename .png to .ico" |
| instagram-highlight-covers | Instagram highlight cover size, and how to add covers without posting? | Contradicting 2026 pages |
| custom-emoji-and-stickers | How do I make custom emoji and stickers for Slack, Discord and WhatsApp? | Strict 128 x 128 charts; third-party sticker apps |
| favicon-not-showing-in-google | Why isn't my favicon showing in Google? | 8-bit BMP from Paint, duplicate tags |
| free-icon-in-logo | Can I use a free icon in my logo, and trademark it? | Canva-only answers |
| sell-products-with-free-icons | Can I sell stickers, shirts or printables made with free icons? | "Email us" answers; nothing about Cricut |
| visual-schedule-icons | Free icons for classroom visual schedules? | Link lists of dead sites |

Every post gets a designed featured image and 1 to 3 designed in-post images (`art()`), built from real with icons over
Unsplash or Pexels photos or as pure artwork.
