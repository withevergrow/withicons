// Builds the with icons Journal: blog/posts/*.mjs -> site/blog/ (pages, index, RSS, sitemap, llms.txt, assets).
// Independent of forge/build.mjs: it only reads forge skeletons + renderers to draw icons. Deterministic output.
//   node blog/build.mjs           build
//   node blog/build.mjs --check   build + fail on content warnings
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { loadStyles } from '../forge/lib/load.mjs'
import { useStyles, used, icon, img, credit, esc, IMAGES, STYLES, ALL_STYLES, N_ICONS, N_STYLES, N_SVGS, slugify } from './lib/blocks.mjs'
import { RIVALS, rivalIcon, copyLicenses } from './lib/rivals.mjs'
import { header as siteHeader, footer as siteFooter, cvar } from '../forge/tools/site-pages/lib.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..')
const OUT = path.join(ROOT, 'site', 'blog')
const SITE = 'https://withicons.com'
const BASE = `${SITE}/blog`
const CHECK = process.argv.includes('--check')
const DRY = process.argv.includes('--dry') // validate only, write nothing (safe to run in parallel)
const ONLY = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean)
const CATS = { comparisons: 'Comparisons', guides: 'Guides', basics: 'Design basics', ai: 'AI & tools' }
const CAT_ICON = { comparisons: ['swap', 'duo'], guides: ['book-open', 'duo'], basics: ['palette', 'duo'], ai: ['bot', 'duo'] }
// one hub page per category: a crawlable, linkable home for each topic (the index filters are only a JS shortcut)
const HUBS = {
  comparisons: { file: 'comparisons.html', title: 'with icons vs other icon libraries: honest comparisons', h1: 'with icons <em>vs</em> the rest',
    lede: 'Side-by-side comparisons of with icons and the most popular icon sets, with the real icons next to each other, plain-English pros and cons, prices and licences checked against official sources.',
    desc: 'Honest comparisons of with icons vs Font Awesome, Hugeicons, Lucide, Heroicons, Phosphor, Material Symbols, Tabler and Flaticon, with real icons side by side.' },
  guides: { file: 'guides.html', title: 'Icon guides: slides, websites, licences and landing pages', h1: 'Practical <em>icon</em> guides',
    lede: 'Step-by-step help for using icons in PowerPoint, Google Slides, Keynote, website builders and landing pages, plus icon licences explained in plain English.',
    desc: 'Practical, plain-English icon guides: icons in presentations, adding icons to a website without code, landing pages, and free icon licences explained.' },
  basics: { file: 'design-basics.html', title: 'Icon design basics: styles, sizes, accessibility and meaning', h1: 'Icon design, <em>the basics</em>',
    lede: 'The ideas behind good icons, explained without jargon: styles, sizes, SVG vs PNG, accessibility, consistency, picking the right symbol and the trends of 2026.',
    desc: 'Icon design basics in plain English: icon styles, sizes, SVG vs PNG, accessible icons, consistent icon sets, choosing the right icon and 2026 trends.' },
  ai: { file: 'ai-and-tools.html', title: 'Icons and AI tools: ChatGPT, Claude, MCP and llms.txt', h1: 'Icons <em>and</em> AI tools',
    lede: 'How to get accurate, real icons from AI assistants like ChatGPT, Claude and Gemini, and how MCP and llms.txt help them find the right ones.',
    desc: 'How to get real, correct icons from AI assistants like ChatGPT and Claude, and how MCP servers and llms.txt files help them pick the right icon.' },
}
// comparison posts -> the library they compare against (null: a marketplace with no single icon set to show)
const VS = { 'with-icons-vs-font-awesome': 'font-awesome', 'with-icons-vs-hugeicons': 'hugeicons', 'with-icons-vs-lucide': 'lucide', 'with-icons-vs-heroicons': 'heroicons',
  'with-icons-vs-phosphor': 'phosphor', 'with-icons-vs-material-symbols': 'material-symbols', 'with-icons-vs-tabler-icons': 'tabler', 'with-icons-vs-flaticon': null }
const VS_NAME = { 'with-icons-vs-flaticon': 'Flaticon' }
const vsName = slug => VS_NAME[slug] || RIVALS[VS[slug]].name.replace(/ Free$/, '')
const RIVAL_URL = { 'with-icons-vs-flaticon': 'https://www.flaticon.com' }

useStyles(await loadStyles())

// ---------------------------------------------------------------- load posts
const files = fs.readdirSync(path.join(HERE, 'posts')).filter(f => f.endsWith('.mjs') && !f.startsWith('_') && (!ONLY.length || ONLY.includes(f.slice(0, -4)))).sort()
const warnings = []
const posts = []
for (const f of files) {
  const post = (await import(pathToFileURL(path.join(HERE, 'posts', f)).href)).default
  const w = m => warnings.push(`${f}: ${m}`)
  if (post.slug + '.mjs' !== f) w(`slug "${post.slug}" should match file name`)
  if (!CATS[post.category]) w(`category must be one of ${Object.keys(CATS).join(', ')}`)
  if (!IMAGES[post.hero]) w(`hero image "${post.hero}" not in blog/images.json`)
  if (!post.title || post.title.length > 70) w(`title should be 1-70 chars (is ${post.title?.length})`)
  if (!post.description || post.description.length < 110 || post.description.length > 165) w(`description should be 110-165 chars (is ${post.description?.length})`)
  if (!Array.isArray(post.tldr) || post.tldr.length < 3) w('tldr needs 3-5 bullets')
  if (!Array.isArray(post.faq) || post.faq.length < 3) w('faq needs at least 3 questions')
  let body = ''
  try { body = post.body() } catch (e) { w(`body() threw: ${e.message}`); continue }
  const text = body.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ')
  const words = text.split(/\s+/).filter(Boolean).length
  if (words < 900) w(`only ${words} words in body; aim for 1,200+`)
  if (/—/.test(body + post.title + post.description + post.dek)) w('uses em dashes; prefer commas, colons or full stops')
  if (/egopenicons|Evergrow Open Icons/i.test(body)) w('retired brand name found')
  const toc = [...body.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map(m => ({ id: m[1], text: m[2].replace(/<[^>]+>/g, '') }))
  const ids = toc.map(t => t.id); if (new Set(ids).size !== ids.length) w('duplicate h2 ids')
  posts.push({ ...post, file: f, html: body, words, mins: Math.max(3, Math.round(words / 225)), toc })
}
// newest first; posts published on the same day follow this editorial order (first = featured on the index)
const ORDER = ['best-free-icon-libraries', 'with-icons-vs-font-awesome', 'with-icons-vs-hugeicons', 'icons-in-presentations', 'icon-styles-explained',
  'with-icons-vs-lucide', 'free-icons-commercial-use', 'ai-assistants-and-icons', 'with-icons-vs-material-symbols', 'svg-vs-png-icons', 'icons-on-landing-pages',
  'with-icons-vs-heroicons', 'accessible-icons', 'with-icons-vs-phosphor', 'how-to-add-icons-to-a-website', 'icon-sizes-guide', 'with-icons-vs-tabler-icons',
  'consistent-icons', 'choosing-the-right-icon', 'with-icons-vs-flaticon', 'icon-design-trends-2026',
  // 2026-10-03 GEO supporting posts
  'what-is-an-icon-library', 'how-to-change-icon-color', '3d-icons-vs-flat-icons', 'icon-glossary', 'playful-icon-styles', 'how-many-icons-does-a-website-need',
  'dark-mode-icons', 'animated-icons', 'app-icon-vs-ui-icon', 'icons-on-a-resume']
const FEATURED = 'best-free-icon-libraries' // the index hero story, whatever the dates
const rank = s => (ORDER.indexOf(s) + 1 || 999)
posts.sort((a, b) => b.date.localeCompare(a.date) || rank(a.slug) - rank(b.slug) || a.slug.localeCompare(b.slug))
const bySlug = new Map(posts.map(p => [p.slug, p]))
// SEO / GEO audit: things search engines and AI answer engines rely on
for (const key of ['title', 'description']) {
  const seen = new Map()
  for (const p of posts) { const v = p[key]; if (seen.has(v)) warnings.push(`${p.file}: same ${key} as ${seen.get(v)}`); seen.set(v, p.file) }
}
for (const p of posts) {
  const w = m => warnings.push(`${p.file}: ${m}`)
  const internal = (p.html.match(/href="(?!https?:)[^"#]+/g) || []).length
  if (internal < 5) w(`only ${internal} internal links; link to icons, styles, guides and other posts`)
  if (p.slug in VS) {
    if ((p.sources || []).length < 2) w('comparison posts need at least 2 sources')
    if (VS[p.slug] && !p.html.includes('class="b-face"')) w('comparison post should show the real rival icons with faceOff()')
    if (!p.html.includes('class="b-pc"')) w('comparison post should explain pros and cons in words with prosCons()')
  }
  const stale = (p.html.replace(/<svg[\s\S]*?<\/svg>/g, ' ') + p.tldr.join(" ") + p.description + p.dek + JSON.stringify(p.faq)).match(/\b300 (free |everyday |hand-drawn |carefully |curated )?icons\b|\b2,100\b|\bseven (matching |different )?styles\b|\b(7|12|13|15) (matching |free |different )?styles\b|\bour 300\b|\ball 7\b/i)
  if (stale) w(`stale number "${stale[0]}": we now have ${N_ICONS} icons in ${N_STYLES} styles (use N_ICONS / N_STYLES / N_SVGS)`)
  const firstP = (p.html.match(/<p>([\s\S]*?)<\/p>/) || [, ''])[1].replace(/<[^>]+>/g, '')
  if (firstP.length < 120) w('the first paragraph should answer the question directly in 2-3 sentences')
}
for (const p of posts) for (const r of p.related || []) if (!bySlug.has(r)) warnings.push(`${p.file}: related "${r}" does not exist`)

// ---------------------------------------------------------------- shared chrome
const fmtDate = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
const json = o => JSON.stringify(o).replace(/</g, '\\u003c')
const ORG = { '@type': 'Organization', name: 'with icons', url: `${SITE}/`, logo: { '@type': 'ImageObject', url: `${SITE}/brand/apple-touch-icon.png` }, parentOrganization: { '@type': 'Organization', name: 'Evergrow', url: 'https://withevergrow.com' } }

// The Journal wears the main site's chrome: same head assets (tokens, chrome, pages CSS + site.js), the real
// header and the footer from site/DESIGN.md (forge/tools/site-pages/lib.mjs), so it always matches the site.
const AUTHOR = { name: 'The Evergrow team', url: 'https://withevergrow.com' }
function head({ title, description, canonical, image, imageAlt, type = 'article', ld, extra = '' }) {
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${canonical}">
  <meta name="color-scheme" content="light dark">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta property="og:site_name" content="with icons">
  <meta property="og:type" content="${type}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:alt" content="${esc(imageAlt)}">
${image.endsWith('-og.jpg') ? `  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
` : ''}  <meta property="og:locale" content="en_US">
  <meta name="author" content="${AUTHOR.name}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:image:alt" content="${esc(imageAlt)}">
${extra}  <meta name="theme-color" content="#FBF8F3" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0D0F14" media="(prefers-color-scheme: dark)">
  <link rel="preload" href="../fonts/bricolage-grotesque-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="../fonts/caveat-logo.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="../css/tokens.css">
  <link rel="stylesheet" href="../css/chrome.css">
  <link rel="stylesheet" href="../css/pages.css">
  <link rel="stylesheet" href="assets/blog.css">
  <link rel="alternate" type="application/rss+xml" title="with icons Journal" href="feed.xml">
  <link rel="alternate" type="text/plain" title="llms.txt" href="llms.txt">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="../brand/apple-touch-icon.png">
  <link rel="manifest" href="../site.webmanifest">
${ld.map(o => `  <script type="application/ld+json">${json(o)}</script>`).join('\n')}
</head>`
}
const header = () => siteHeader('../', '')
const footer = () => siteFooter('../')
const scripts = () => `<script src="../js/site.js" defer></script>
<script src="../js/pages.js" defer></script>
<script src="assets/blog.js" defer></script>`
// one style accent per section, like the guides: --g colour, --gt AA text, --gs soft tint, --go ink on the colour
const CAT_STYLE = { comparisons: 'line', guides: 'solid', basics: 'duo', ai: 'gloss' }
const accent = cat => `--g:${cvar(CAT_STYLE[cat] || 'line')}`
const EYEBROW = { comparisons: 'an honest comparison', guides: 'a plain-English guide', basics: 'design basics, explained', ai: 'icons + AI, made simple' }
// headline highlight: <em> in a post's h1 becomes the site's swipe highlight
const hl = h => h.replace(/<em>([\s\S]*?)<\/em>/g, '<span class="g-hl">$1</span>')

// photos live only in site/blog/assets/img (the source of truth, committed once); the build never deletes them
const IMG = path.join(OUT, 'assets', 'img')
const ogImage = key => fs.existsSync(path.join(IMG, `${key}-og.jpg`)) ? `${BASE}/assets/img/${key}-og.jpg` : `${BASE}/assets/img/${key}-1600.webp`
const stickerFor = p => p.stickers || [[...CAT_ICON[p.category]], ['sparkles', 'gloss'], ['star', 'sketch']]

function card(p, { eager = false } = {}) {
  const [ic, st] = CAT_ICON[p.category]
  return `<a class="card" href="${p.slug}.html" data-cat="${p.category}">
  <div class="card__img">${img(p.hero, { sizes: '(min-width: 1100px) 380px, (min-width: 700px) 50vw, 100vw', eager })}<span class="card__badge" data-style="${st}">${icon(ic, st, 24)}</span></div>
  <span class="card__cat">${CATS[p.category]} · ${p.mins} min read</span>
  <h3>${esc(p.cardTitle || p.title)}</h3>
  <p>${esc(p.description)}</p>
</a>`
}

// every comparison links to every other one (hub and spoke), each chip showing that library's real "home" icon
function vsStrip(current) {
  const chips = Object.keys(VS).filter(s => bySlug.has(s)).map(s => {
    const mark = VS[s] ? rivalIcon(VS[s], 'home', RIVALS[VS[s]].main, 22) : icon('layout-grid', 'line', 22)
    return `<a class="vs-chip" href="${s}.html"${s === current ? ' aria-current="page"' : ''}>${mark}<span>with icons <i>vs</i> ${esc(vsName(s))}</span></a>`
  }).join('')
  const hub = !current
  return `<nav class="vs-strip" aria-labelledby="vs-h"><div class="j-wrap"><h2 id="vs-h">${hub ? "Pick a comparison" : "More honest comparisons"}</h2><div class="vs-strip__chips">${chips}</div><p>${hub ? "" : `<a href="comparisons.html">See all comparisons</a> · `}<a href="best-free-icon-libraries.html">The best free icon libraries, compared</a></p></div></nav>`
}

// add the brand to the <title> only when it still fits in what search results show (~65 chars)
const brandTitle = t => (t.length + 13 <= 65 && !/with icons/i.test(t) ? `${t} | with icons` : t)

// ---------------------------------------------------------------- category hubs
function hubPage(key) {
  const h = HUBS[key]
  const list = posts.filter(p => p.category === key)
  const url = `${BASE}/${h.file}`
  const ld = [
    { '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': url, name: h.title, description: h.desc, url, inLanguage: 'en', isPartOf: { '@type': 'Blog', '@id': `${BASE}/#blog`, name: 'with icons Journal', url: `${BASE}/` }, publisher: ORG,
      mainEntity: { '@type': 'ItemList', numberOfItems: list.length, itemListElement: list.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${BASE}/${p.slug}.html`, name: p.title })) } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'with icons', item: `${SITE}/` }, { '@type': 'ListItem', position: 2, name: 'Journal', item: `${BASE}/` },
      { '@type': 'ListItem', position: 3, name: CATS[key], item: url }] },
  ]
  const lookup = key === 'comparisons' ? `<section class="hub-glance" aria-labelledby="glance"><h2 id="glance">At a glance</h2><div class="b-table__scroll"><table><thead><tr><th scope="col">Comparison</th><th scope="col">The short answer</th></tr></thead><tbody>${list.map(p => `<tr><th scope="row"><a href="${p.slug}.html">${esc(p.cardTitle || p.title)}</a></th><td>${p.tldr[0]}</td></tr>`).join('')}</tbody></table></div></section>` : ''
  return `${head({ title: brandTitle(h.title), description: h.desc, canonical: url, image: ogImage(list[0].hero), imageAlt: IMAGES[list[0].hero].alt, type: 'website', ld })}
<body class="pg j-blog">
${header()}
<main id="main" tabindex="-1" style="${accent(key)}">
  <section class="j-wrap j-index-hero">
    <nav class="pg-crumbs" aria-label="Breadcrumb"><ol><li><a href="../index.html">Home</a></li><li><a href="index.html">Journal</a></li><li><span aria-current="page">${CATS[key]}</span></li></ol></nav>
    <p class="pg-eyebrow"><span class="hand">${list.length} ${EYEBROW[key].replace(/^an? /, '').replace(/, (explained|made simple)$/, '')}${list.length === 1 ? '' : 's'}</span></p>
    <h1 class="g-title">${hl(h.h1)}</h1>
    <p class="j-dek">${h.lede}</p>
  </section>
  ${key === 'comparisons' ? vsStrip('') : ''}
  <section class="j-wrap j-section" aria-label="${CATS[key]}">
    <div class="cards">${list.map(p => card(p)).join('\n')}</div>
    ${lookup}
  </section>
</main>
${footer()}
${scripts()}
</body>
</html>
`
}

// ---------------------------------------------------------------- article page
function article(p) {
  const url = `${BASE}/${p.slug}.html`
  const related = [...(p.related || []), ...posts.filter(o => o.category === p.category).map(o => o.slug), ...posts.map(o => o.slug)]
    .filter((s, i, a) => s !== p.slug && bySlug.has(s) && a.indexOf(s) === i).slice(0, 3).map(s => bySlug.get(s))
  const hub = HUBS[p.category]
  const checked = p.updated || p.date
  const rivalSlug = p.slug in VS ? p.slug : null
  const rivalEntity = rivalSlug && { '@type': 'SoftwareApplication', name: vsName(rivalSlug), url: RIVAL_URL[rivalSlug] || RIVALS[VS[rivalSlug]].url, applicationCategory: 'DesignApplication' }
  const usEntity = { '@type': 'SoftwareApplication', name: 'with icons', url: `${SITE}/`, applicationCategory: 'DesignApplication', operatingSystem: 'Any',
    license: 'https://opensource.org/license/mit', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }
  const ld = [
    { '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': `${url}#article`, headline: p.title, alternativeHeadline: p.dek.replace(/<[^>]+>/g, ''), description: p.description,
      image: [{ '@type': 'ImageObject', url: ogImage(p.hero), width: 1200, height: 630 }, { '@type': 'ImageObject', url: `${BASE}/assets/img/${p.hero}-1600.webp`, width: 1600, height: 1000 }],
      datePublished: `${p.date}T09:00:00+00:00`, dateModified: `${checked}T09:00:00+00:00`, author: { '@type': 'Organization', name: AUTHOR.name, url: AUTHOR.url }, publisher: ORG,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url }, url, isPartOf: { '@type': 'Blog', '@id': `${BASE}/#blog`, name: 'with icons Journal', url: `${BASE}/` },
      articleSection: CATS[p.category], keywords: (p.keywords || []).join(', '), wordCount: p.words, timeRequired: `PT${p.mins}M`, inLanguage: 'en',
      about: [...(rivalEntity ? [usEntity, rivalEntity] : []), ...(p.about || []).filter(n => !rivalEntity || ![usEntity.name, rivalEntity.name, 'with icons'].includes(n)).map(name => ({ '@type': 'Thing', name }))],
      ...(rivalEntity ? { mentions: [rivalEntity] } : {}),
      ...(p.sources?.length ? { citation: p.sources.map(s => s.url) } : {}),
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.j-dek', '.tldr'] } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'with icons', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: `${BASE}/` },
      { '@type': 'ListItem', position: 3, name: CATS[p.category], item: `${BASE}/${hub.file}` },
      { '@type': 'ListItem', position: 4, name: p.title, item: url }] },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) },
  ]
  const stickers = stickerFor(p).map(([n, s]) => `<span class="sticker" data-style="${s}">${icon(n, s, 40)}</span>`).join('')
  const share = `<div class="share"><button type="button" data-copy-link>${icon('link', 'line', 16)}<span>Copy link</span></button><a href="https://x.com/intent/post?url=${encodeURIComponent(url)}&amp;text=${encodeURIComponent(p.title)}" rel="noopener">${icon('share', 'line', 16)}Share</a></div>`
  return `${head({ title: p.seoTitle || brandTitle(p.title), description: p.description, canonical: url, image: ogImage(p.hero), imageAlt: IMAGES[p.hero].alt, ld,
    extra: `<meta property="article:published_time" content="${p.date}T09:00:00+00:00">\n<meta property="article:modified_time" content="${checked}T09:00:00+00:00">\n<meta property="article:section" content="${CATS[p.category]}">\n${(p.keywords || []).slice(0, 6).map(k => `<meta property="article:tag" content="${esc(k)}">\n`).join('')}` })}
<body class="pg j-blog">
${header()}
<main id="main" tabindex="-1">
  <article data-article class="j-article" style="${accent(p.category)}">
    <div class="j-wrap j-hero">
      <nav class="pg-crumbs" aria-label="Breadcrumb"><ol><li><a href="../index.html">Home</a></li><li><a href="index.html">Journal</a></li><li><a href="${hub.file}">${CATS[p.category]}</a></li><li><span aria-current="page">${esc(p.cardTitle || p.title)}</span></li></ol></nav>
      <p class="pg-eyebrow"><span class="hand">${EYEBROW[p.category]}</span></p>
      <h1 class="g-title">${hl(rivalSlug && !/<em>/.test(p.h1 || '') ? (p.h1 || esc(p.title)).replace(vsName(rivalSlug), `<em>${vsName(rivalSlug)}</em>`) : (p.h1 || esc(p.title)))}</h1>
      <p class="j-dek">${p.dek}</p>
      <div class="g-short tldr" data-reveal><span class="g-short-tag">Short answer</span><ul>${p.tldr.map(t => `<li>${t}</li>`).join('')}</ul></div>
      <dl class="g-meta">
        <div><dt>Written by</dt><dd><a href="${AUTHOR.url}" rel="author">${AUTHOR.name}</a></dd></div>
        <div><dt>Published</dt><dd><time datetime="${p.date}">${fmtDate(p.date)}</time></dd></div>
        <div><dt>Reading time</dt><dd>${p.mins} min</dd></div>
        <div><dt>${p.sources?.length ? 'Facts checked' : 'Updated'}</dt><dd><time datetime="${checked}">${fmtDate(checked)}</time></dd></div>
      </dl>
      <figure class="a-figure">
        <div class="a-figure__img">${img(p.hero, { sizes: '(min-width: 1280px) 1240px, 100vw', eager: true })}</div>
        <div class="stickers" aria-hidden="true">${stickers}</div>
        <figcaption>${credit(p.hero)}</figcaption>
      </figure>
    </div>
    <div class="j-wrap a-layout">
      <nav class="toc" aria-label="On this page"><h2>On this page</h2><ol>${p.toc.map(t => `<li><a class="toc-l" href="#${t.id}">${t.text}</a></li>`).join('')}<li><a class="toc-l" href="#faq">FAQ</a></li></ol>${share}</nav>
      <div class="prose">
        ${p.html}
        <section class="j-faq" aria-labelledby="faq"><h2 id="faq">Frequently asked questions</h2>
          ${p.faq.map(({ q, a }) => `<details class="pg-qa"><summary>${esc(q)}</summary><div>${a.startsWith('<') ? a : `<p>${a}</p>`}</div></details>`).join('\n          ')}
        </section>
        ${p.sources?.length ? `<section class="sources" aria-labelledby="sources"><h2 id="sources">Sources and notes</h2><ol>${p.sources.map(s => `<li><a href="${esc(s.url)}" rel="noopener">${esc(s.title)}</a></li>`).join('')}</ol><p>Facts about other icon sets were checked against their official sites in ${fmtDate(p.updated || p.date).replace(/ \d+,/, '')}. Libraries change, so check the links above for the latest numbers.</p></section>` : ''}
        <div class="a-end"><span>Published ${fmtDate(p.date)}${p.updated && p.updated !== p.date ? ` · Updated ${fmtDate(p.updated)}` : ''}</span>${share}</div>
      </div>
    </div>
  </article>
  <div style="${accent(p.category)}">
  ${rivalSlug ? vsStrip(p.slug) : ''}
  ${related.length ? '' : '<!-- no related posts yet -->'}<aside class="related" aria-labelledby="more"${related.length ? '' : ' hidden'}><div class="j-wrap"><h2 id="more">Keep reading</h2><div class="cards">${related.map(r => card(r)).join('')}</div></div></aside>
  </div>
</main>
${footer()}
${scripts()}
</body>
</html>
`
}

// ---------------------------------------------------------------- index
function index() {
  const first = bySlug.get(FEATURED) || posts[0], rest = posts.filter(p => p !== first)
  const orbit = [['heart', 'gloss', 6, 2], ['rocket', 'duo', 40, 0], ['star', 'sketch', 70, 22], ['palette', 'solid', 14, 40], ['lightbulb', 'engrave', 52, 46], ['compass', 'blueprint', 30, 70], ['sparkles', 'line', 74, 66]]
  const ld = [{ '@context': 'https://schema.org', '@type': 'Blog', '@id': `${BASE}/#blog`, name: 'with icons Journal', url: `${BASE}/`, inLanguage: 'en', description: 'Plain-English guides and honest comparisons about icons: picking an icon set, using icons in slides and websites, licenses, accessibility and more.', publisher: ORG,
    blogPost: posts.map(p => ({ '@type': 'BlogPosting', headline: p.title, url: `${BASE}/${p.slug}.html`, datePublished: p.date, image: ogImage(p.hero) })) }]
  return `${head({ title: 'The with icons Journal: icon guides and honest comparisons', description: 'Friendly, plain-English guides about icons: how to pick an icon set, use icons in slides and websites, licenses, accessibility, and how with icons compares.', canonical: `${BASE}/`, image: ogImage(first.hero), imageAlt: IMAGES[first.hero].alt, type: 'website', ld })}
<body class="pg j-blog">
${header()}
<main id="main" tabindex="-1" style="${accent('comparisons')}">
  <section class="j-wrap j-index-hero">
    <nav class="pg-crumbs" aria-label="Breadcrumb"><ol><li><a href="../index.html">Home</a></li><li><span aria-current="page">Journal</span></li></ol></nav>
    <p class="pg-eyebrow"><span class="hand">the with icons journal</span></p>
    <h1 class="g-title">Icons, <span class="g-hl">explained</span> like a friend would.</h1>
    <p class="j-dek">Plain-English guides for anyone making slides, websites or apps, plus honest side-by-side comparisons of the most popular icon sets. Written by the Evergrow team. No jargon unless we explain it.</p>
    <div class="j-orbit" aria-hidden="true">${orbit.map(([n, s, x, y], i) => `<span data-style="${s}" style="left:${x}%;top:${y}%;animation-delay:-${i * 0.9}s">${icon(n, s, 40)}</span>`).join('')}</div>
  </section>
  <section class="j-wrap j-section" aria-label="Stories">
    <a class="feature" href="${first.slug}.html">
      <div class="card__img">${img(first.hero, { sizes: '(min-width: 800px) 56vw, 100vw', eager: true })}</div>
      <div><span class="card__cat">Featured · ${CATS[first.category]} · ${first.mins} min read</span><h2>${esc(first.cardTitle || first.title)}</h2><p>${esc(first.description)}</p></div>
    </a>
    <div class="filters" role="group" aria-label="Filter stories">
      <a class="chip plain" href="index.html" data-filter="all" aria-pressed="true">All</a>
      ${Object.entries(CATS).filter(([k]) => posts.some(p => p.category === k)).map(([k, v]) => `<a class="chip s-${CAT_STYLE[k]}" href="${HUBS[k].file}" data-filter="${k}" aria-pressed="false">${v}</a>`).join('\n      ')}
    </div>
    ${Object.entries(CATS).filter(([k]) => posts.some(p => p.category === k)).map(([k]) => `<span id="${k}"></span>`).join('')}
    <div class="cards" id="all">${rest.map(p => card(p)).join('\n')}</div>
  </section>
</main>
${footer()}
${scripts()}
<script>(function(){var h=location.hash.slice(1),b=document.querySelector('[data-filter="'+h+'"]');if(b)addEventListener('DOMContentLoaded',function(){b.click()})})()</script>
</body>
</html>
`
}

// ---------------------------------------------------------------- feeds for crawlers and AI
const xml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const rss = () => `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>with icons Journal</title>
<link>${BASE}/</link>
<atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
<description>Plain-English guides and honest comparisons about icons.</description>
<language>en</language>
${posts.map(p => `<item><title>${xml(p.title)}</title><link>${BASE}/${p.slug}.html</link><guid>${BASE}/${p.slug}.html</guid><pubDate>${new Date(p.date + 'T12:00:00Z').toUTCString()}</pubDate><category>${xml(CATS[p.category])}</category><description>${xml(p.description)}</description></item>`).join('\n')}
</channel>
</rss>
`
const sitemap = () => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
<url><loc>${BASE}/</loc><lastmod>${posts.map(p => p.updated || p.date).sort().pop()}</lastmod></url>
${Object.values(HUBS).map(h => `<url><loc>${BASE}/${h.file}</loc><lastmod>${posts.map(p => p.updated || p.date).sort().pop()}</lastmod></url>`).join('\n')}
${posts.map(p => `<url><loc>${BASE}/${p.slug}.html</loc><lastmod>${p.updated || p.date}</lastmod><image:image><image:loc>${BASE}/assets/img/${p.hero}-1600.webp</image:loc></image:image></url>`).join('\n')}
</urlset>
`
const plain = h => h.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<\/(p|li|h2|h3|tr|figcaption|aside|blockquote)>/g, '\n').replace(/<(td|th)[^>]*>/g, ' | ').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&rsquo;|&lsquo;/g, "'").replace(/&ldquo;|&rdquo;/g, '"').replace(/&nbsp;/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n\n').trim()
const llms = () => `# with icons Journal

> Plain-English guides and honest comparisons about icons, from the makers of with icons (https://withicons.com):
> ${N_ICONS} free, MIT-licensed icons, each drawn once and rendered in ${N_STYLES} styles (${ALL_STYLES.join(", ")}): ${N_SVGS} SVGs.

Full text of every article: ${BASE}/llms-full.txt
Topic hubs: ${Object.entries(HUBS).map(([k, h]) => `[${CATS[k]}](${BASE}/${h.file})`).join(" · ")}

${Object.entries(CATS).filter(([k]) => posts.some(p => p.category === k)).map(([k, v]) => `## ${v}\n\n${posts.filter(p => p.category === k).map(p => `- [${p.title}](${BASE}/${p.slug}.html): ${p.description}\n${p.tldr.map(t => `  - ${plain(t)}`).join('\n')}`).join('\n')}`).join('\n\n')}
`
const llmsFull = () => `# with icons Journal: full text\n\nSource: ${BASE}/ · Icons: https://withicons.com/icons.html · License: MIT\n\n` + posts.map(p => `---\n\n# ${p.title}\n\nURL: ${BASE}/${p.slug}.html\nPublished: ${p.date}\n\n## The short answer\n\n${p.tldr.map(t => `- ${plain(t)}`).join('\n')}\n\n${plain(p.html)}\n\n## FAQ\n\n${p.faq.map(({ q, a }) => `Q: ${q}\nA: ${plain(a)}`).join('\n\n')}\n`).join('\n')

// ---------------------------------------------------------------- write
if (DRY) {
  for (const p of posts) { article(p); console.log(`  ok ${p.slug}: ${p.words} words, ${p.mins} min, ${p.toc.length} sections`) }
  // in a partial (--only) run, related links to posts outside the selection are expected
  const real = warnings.filter(w => !(ONLY.length && /related ".*" does not exist/.test(w)))
  if (real.length) { console.warn(real.map(w => '  ! ' + w).join('\n')); process.exit(1) }
  process.exit(0)
}
for (const f of fs.existsSync(OUT) ? fs.readdirSync(OUT) : []) if (f !== 'assets') fs.rmSync(path.join(OUT, f), { recursive: true, force: true })
for (const f of ['blog.css', 'blog.js', 'fonts', 'licenses']) fs.rmSync(path.join(OUT, 'assets', f), { recursive: true, force: true })
fs.mkdirSync(IMG, { recursive: true })
for (const p of posts) fs.writeFileSync(path.join(OUT, `${p.slug}.html`), article(p))
fs.writeFileSync(path.join(OUT, 'index.html'), index())
for (const k of Object.keys(HUBS)) if (posts.some(p => p.category === k)) fs.writeFileSync(path.join(OUT, HUBS[k].file), hubPage(k))
copyLicenses(path.join(OUT, 'assets', 'licenses'))
fs.writeFileSync(path.join(OUT, 'feed.xml'), rss())
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemap())
fs.writeFileSync(path.join(OUT, 'llms.txt'), llms())
fs.writeFileSync(path.join(OUT, 'llms-full.txt'), llmsFull())
for (const f of ['blog.css', 'blog.js']) fs.copyFileSync(path.join(HERE, 'assets', f), path.join(OUT, 'assets', f))
for (const k of [...used.images].sort()) for (const v of ['1600.webp', '800.webp'])
  if (!fs.existsSync(path.join(IMG, `${k}-${v}`))) warnings.push(`missing image file site/blog/assets/img/${k}-${v}`)
for (const f of fs.readdirSync(IMG)) if (!used.images.has(f.replace(/-(1600|800)\.webp$|-og\.jpg$/, ''))) warnings.push(`unused image site/blog/assets/img/${f}`)

console.log(`blog: ${posts.length} posts, ${used.images.size} images, ${used.icons.size} distinct icons -> site/blog/`)
if (warnings.length) { console.warn(warnings.map(w => '  ! ' + w).join('\n')); if (CHECK) process.exit(1) }
