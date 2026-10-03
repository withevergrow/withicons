// Shared helpers for the with icons content-page generator (D3).
// Everything is derived from the forge (forge/styles + forge/icons via forge/lib/load.mjs), so counts, style lists and
// icon art follow the real set: new icons and new style renderers appear here without editing this file.
import fs from 'fs'
import { fileURLToPath } from 'url'
import { listIcons, loadIcon, loadStyles, renderIcon, nodesToMarkup, readManifest } from '../../lib/load.mjs'

export const ROOT = fileURLToPath(new URL('../../../', import.meta.url)).split('\\').join('/').replace(/\/+$/, '')
export const SITE = ROOT + '/site'
export const ORIGIN = 'https://withicons.com'
export const GITHUB = 'https://github.com/withevergrow/withicons'

/** Display order of the styles everywhere on the site (unknown future styles sort after these). */
export const ORDER = ['line', 'solid', 'duo', 'gloss', 'engrave', 'blueprint', 'sketch', 'glass', 'kawaii', 'sticker', 'pixel', 'retro', 'luxe', 'bauhaus', 'skeuo', 'anime', 'gothic', 'pastel', 'coquette', 'plush']
/** The playful palette styles (CONTRACT.md "Palette styles"): their own default colours, the ink still currentColor. */
export const PLAYFUL = ['glass', 'kawaii', 'sticker', 'pixel', 'retro']
/** The studio styles (CONTRACT.md "Run 7"): art-directed premium looks with role-named colour variables. */
export const STUDIO = ['luxe', 'bauhaus', 'skeuo']
/** The storybook styles (run 8): illustrated worlds (anime, gothic, pastel, coquette, plush), role-named colour variables. */
export const STORYBOOK = ['anime', 'gothic', 'pastel', 'coquette', 'plush']
// Literal fallbacks, used only while tokens.css doesn't define a style's --c-<style> yet (the brand layer owns the values).
export const STYLE_COLOR = { line: '#2F5BFF', solid: '#FF5A36', duo: '#7252FF', gloss: '#FF4FA3', engrave: '#C9962B', blueprint: '#00A3C4', sketch: '#22A861', glass: '#4C8DFF', kawaii: '#FF6FAE', sticker: '#A855F7', pixel: '#16A34A', retro: '#F97316', luxe: '#2B3FB8', bauhaus: '#D62718', skeuo: '#5A6E86', anime: '#2E9BF0', gothic: '#7A1F3D', pastel: '#3DBFA0', coquette: '#E2456F', plush: '#F2AE24' }
const STYLE_TEXT = { glass: '#2563C9', kawaii: '#C2185B', sticker: '#7E2FC9', pixel: '#0F7A35', retro: '#B4480B', luxe: '#2B3FB8', bauhaus: '#B81E12', skeuo: '#4A5C71', anime: '#0B67B3', gothic: '#7A1F3D', pastel: '#127A62', coquette: '#B81F4B', plush: '#8F5E00' }
const STYLE_ON = { glass: '#FFFFFF', kawaii: '#111318', sticker: '#FFFFFF', pixel: '#FFFFFF', retro: '#111318', luxe: '#FFFFFF', bauhaus: '#FFFFFF', skeuo: '#FFFFFF', anime: '#111318', gothic: '#FFFFFF', pastel: '#111318', coquette: '#111318', plush: '#111318' }
const BASE7 = ORDER.slice(0, 7)
/** Inline custom properties for a style accent: --g (colour), --gt (AA text), --gs (soft tint), --go (ink on the colour). */
export const cvar = s => BASE7.includes(s)
  ? `var(--c-${s});--gt:var(--c-${s}-text);--gs:var(--c-${s}-soft);--go:var(--c-${s}-on)`
  : `var(--c-${s}, ${STYLE_COLOR[s] || '#2F5BFF'});--gt:var(--c-${s}-text, ${STYLE_TEXT[s] || STYLE_COLOR[s] || '#2448D8'});--gs:var(--c-${s}-soft, color-mix(in srgb, ${STYLE_COLOR[s] || '#2F5BFF'} 16%, transparent));--go:var(--c-${s}-on, ${STYLE_ON[s] || '#FFFFFF'})`

const rank = n => { const i = ORDER.indexOf(n); return i < 0 ? 99 : i }
const MODS = await loadStyles()
const SKEL = new Map()
for (const n of listIcons()) {
  try { SKEL.set(n, loadIcon(n)) } catch (e) { console.warn(`  site-pages: skeleton ${n} skipped (${String(e.message).split(/\r?\n/)[0]})`) }
}
// a style counts once it renders a few probe icons, so a renderer still under construction never breaks the pages
const probeOk = s => ['home', 'heart', 'settings'].filter(n => SKEL.has(n)).every(n => { try { return renderIcon(MODS[s], SKEL.get(n)).length > 0 } catch { return false } })
/** Styles in display order (line solid duo gloss engrave blueprint sketch glass kawaii sticker pixel retro luxe bauhaus skeuo anime gothic pastel coquette plush). */
export const STYLES = Object.keys(MODS).filter(probeOk).sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
const manifest = (() => { try { return readManifest() } catch { return { categories: [] } } })()
export const META = {
  categories: manifest.categories || [],
  styles: STYLES.map(s => { const m = MODS[s]; return { name: s, title: m.title || s[0].toUpperCase() + s.slice(1), kind: m.kind || 'creative', description: m.description || '', strokeWidth: m.strokeWidth || false, root: m.root || { fill: 'currentColor' } } }),
  icons: [...SKEL.values()].map(r => ({ name: r.name, category: r.category, description: r.description || '', aliases: r.aliases || [], tags: r.tags || [] })),
}
export const ICON_NAMES = META.icons.map(i => i.name)
const styleMeta = Object.fromEntries(META.styles.map(s => [s.name, s]))
/** { name: { title, kind, description, group: 'universal' | 'creative' | 'playful' | 'studio' | 'storybook' } } */
export const STYLE_INFO = Object.fromEntries(META.styles.map(s => [s.name, { ...s, group: PLAYFUL.includes(s.name) ? 'playful' : STUDIO.includes(s.name) ? 'studio' : STORYBOOK.includes(s.name) ? 'storybook' : s.kind === 'universal' ? 'universal' : 'creative' }]))
export const styleTitle = s => (STYLE_INFO[s] && STYLE_INFO[s].title) || s[0].toUpperCase() + s.slice(1)
export const stylesIn = g => STYLES.filter(s => STYLE_INFO[s].group === g)
export const hasStyle = s => STYLES.includes(s)

/** Counts for copy, always from the data. */
export const N_ICONS = ICON_NAMES.length, N_STYLES = STYLES.length, N_TOTAL = N_ICONS * N_STYLES
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five']
export const word = n => WORDS[n] || String(n)
export const Word = n => { const w = word(n); return w[0].toUpperCase() + w.slice(1) }
export const num = n => n.toLocaleString('en-US')
/** ['line','solid','duo'] -> "Line, Solid and Duo" */
export const listTitles = (list, and = 'and') => { const t = list.map(styleTitle); return t.length < 2 ? t.join('') : t.slice(0, -1).join(', ') + ' ' + and + ' ' + t.at(-1) }

/** Per-icon motion specs (forge/motion/<name>.json, see forge/MOTION.md), for icons that exist. */
export const MOTION = (() => {
  const dir = ROOT + '/forge/motion', out = {}
  if (!fs.existsSync(dir)) return out
  for (const f of fs.readdirSync(dir).sort()) if (f.endsWith('.json')) {
    try { const j = JSON.parse(fs.readFileSync(dir + '/' + f, 'utf8')); if (j && j.name && SKEL.has(j.name)) out[j.name] = j } catch { }
  }
  return out
})()
export const siteExists = rel => fs.existsSync(SITE + '/' + rel)

const CACHE = new Map(), warned = new Set()
/** Inner SVG markup of an icon in a style, rendered from its skeleton (falls back to Line if a renderer fails). */
export function innerSvg(name, style = 'line') {
  const k = style + '/' + name
  if (CACHE.has(k)) return CACHE.get(k)
  if (!SKEL.has(name)) throw new Error(`missing icon ${style}/${name}`)
  let out
  try { out = nodesToMarkup(renderIcon(MODS[style], SKEL.get(name))) }
  catch (e) {
    if (!warned.has(k)) { warned.add(k); console.warn(`  site-pages: ${k} failed to render, using line (${String(e.message).split(/\r?\n/)[0]})`) }
    out = style === 'line' ? '' : innerSvg(name, 'line')
  }
  CACHE.set(k, out)
  return out
}

export const esc = v => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Inline SVG for an icon, rendered at build time from the real icon data. */
export function icon(name, style = 'line', o = {}) {
  if (!styleMeta[style]) throw new Error(`unknown style ${style} (have: ${STYLES.join(' ')})`)
  const body = innerSvg(name, style)
  const size = o.size ?? 24
  const a = { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24', ...(styleMeta[style].root || { fill: 'currentColor' }) }
  if (o.sw != null && a['stroke-width'] != null) a['stroke-width'] = o.sw
  if (o.cls) a.class = o.cls
  let t = ''
  if (o.title) { a.role = 'img'; t = `<title>${esc(o.title)}</title>` } else { a['aria-hidden'] = 'true'; a.focusable = 'false' }
  return '<svg' + Object.entries(a).map(([k, v]) => ` ${k}="${esc(v)}"`).join('') + '>' + t + body + '</svg>'
}

/** Raw svg string as a user would copy it (for code samples). */
export function rawSvg(name, style = 'line', size = 24) {
  return icon(name, style, { size }).replace(' aria-hidden="true" focusable="false"', '')
}

export function header(p, current) {
  const nav = [['icons.html', 'Icons', 'icons'], ['live.html', 'Live icons<span class="nav-new">New</span>', 'live'], ['guides/index.html', 'How to use', 'guides'], ['developers.html', 'Developers', 'developers'], ['ai.html', 'For AI', 'ai'], ['about.html', 'About', 'about']]
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" data-header>
  <a class="logo" href="${p}index.html" aria-label="with icons — home">
    <span class="logo-morph" aria-hidden="true" data-logo-morph></span>
    <span class="logo-type">
      <span class="logo-words"><span class="logo-with">with</span><span class="logo-icons">icons</span></span>
      <span class="logo-by">powered by <b>evergrow</b></span>
    </span>
  </a>
  <nav class="site-nav" aria-label="Primary">
    ${nav.map(([h, l, k]) => `<a href="${p}${h}"${k === 'live' ? ' class="nav-live"' : ''}${k === current ? ' aria-current="page"' : ''}>${l}</a>`).join('')}
  </nav>
  <div class="site-actions">
    <button class="search-trigger" type="button" data-search-open aria-label="Search icons"><kbd>/</kbd></button>
    <button class="theme-toggle" type="button" data-theme-toggle aria-label="Toggle dark mode"></button>
    <a class="cta" href="${p}icons.html">Browse icons</a>
  </div>
</header>`
}

// The footer belongs to the brand layer (D1): take it verbatim from site/DESIGN.md so every page matches the
// chrome agent's latest markup (e.g. the Evergrow logo), prefixing relative links for subfolder pages.
function designFooter() {
  try {
    const d = fs.readFileSync(SITE + '/DESIGN.md', 'utf8'), i = d.indexOf('**Footer — paste exactly')
    if (i >= 0) { const a = d.indexOf('```html', i) + 7, b = d.indexOf('```', a); const f = d.slice(a, b).trim(); if (f.startsWith('<footer')) return f }
  } catch { }
  return null
}
export const prefixed = (html, p) => p ? html.replace(/(href|src|srcset)="(?!https?:|#|\/|mailto:|data:)([^"]*)"/g, (m, k, v) => `${k}="${k === 'srcset' ? v.split(/,\s*/).map(x => p + x).join(', ') : p + v}"`) : html
// the brand layer's footer copy names the counts: keep them true to the data
const liveCounts = h => h.replace(/\b[\d,]+ free icons in \d+ styles\b/g, `${N_ICONS} free icons in ${N_STYLES} styles`).replace(/Browse all [\d,]+\b/g, `Browse all ${N_ICONS}`).replace(/The \d+ styles/g, `The ${N_STYLES} styles`)
export function footer(p) {
  const f = designFooter()
  if (f) return prefixed(liveCounts(f), p)
  return fallbackFooter(p)
}
function fallbackFooter(p) {
  return `<footer class="site-footer">
  <div class="foot-inner">
    <div class="foot-top">
      <div class="foot-brand">
        <a class="logo" href="${p}index.html" aria-label="with icons — home">
          <span class="logo-morph" aria-hidden="true" data-logo-morph></span>
          <span class="logo-type"><span class="logo-words"><span class="logo-with">with</span><span class="logo-icons">icons</span></span><span class="logo-by">powered by <b>evergrow</b></span></span>
        </a>
        <p>${N_ICONS} free icons in ${N_STYLES} styles for slides, docs, websites and apps. Find one, copy it, done.</p>
        <a class="btn btn-sun btn-sm" href="${p}icons.html">Browse all icons</a>
      </div>
      <nav class="foot-cols" aria-label="Footer">
        <div class="foot-col s-line"><h2>Icons</h2><ul>
          <li><a href="${p}icons.html">Browse all ${N_ICONS}</a></li><li><a href="${p}styles/line.html">The ${N_STYLES} styles</a></li>
          <li><a href="${p}categories/navigation.html">Categories</a></li><li><a href="${p}icons.html?style=gloss">Gloss icons</a></li></ul></div>
        <div class="foot-col s-solid"><h2>Use them</h2><ul>
          <li><a href="${p}guides/index.html">All guides</a></li><li><a href="${p}guides/powerpoint.html">PowerPoint</a></li>
          <li><a href="${p}guides/google-slides.html">Google Slides</a></li><li><a href="${p}guides/canva.html">Canva</a></li>
          <li><a href="${p}guides/figma.html">Figma</a></li></ul></div>
        <div class="foot-col s-duo"><h2>Developers</h2><ul>
          <li><a href="${p}developers.html">Overview</a></li><li><a href="${p}developers.html#frameworks">React, Vue, Svelte</a></li>
          <li><a href="${p}developers.html#cdn">CDN &amp; icon classes</a></li>
          <li><a href="https://github.com/withevergrow/withicons">GitHub</a><span class="soon">soon</span></li></ul></div>
        <div class="foot-col s-gloss"><h2>AI</h2><ul>
          <li><a href="${p}ai.html">For AI agents</a></li><li><a href="${p}ai.html#mcp">MCP server</a></li>
          <li><a href="${p}ai.html#skill">Agent skill</a></li><li><a href="${p}llms.txt">llms.txt</a></li></ul></div>
        <div class="foot-col s-sketch"><h2>About</h2><ul>
          <li><a href="${p}about.html">About</a></li><li><a href="${p}blog/index.html">Journal</a></li><li><a href="${p}license.html">License</a></li>
          <li><a href="${p}faq.html">FAQ</a></li><li><a href="https://withevergrow.com">Evergrow</a></li></ul></div>
      </nav>
    </div>
    <div class="foot-word" aria-hidden="true"><span class="fw-with">with</span><span class="fw-icons">icons</span></div>
    <div class="foot-base">
      <span>© 2026 with icons · MIT License</span>
      <a class="evergrow-link" href="https://withevergrow.com"><span data-evergrow-mark></span>Powered by Evergrow</a>
    </div>
  </div>
</footer>`
}

export function breadcrumbLd(trail) {
  return { '@type': 'BreadcrumbList', itemListElement: trail.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: ORIGIN + '/' + path })) }
}

/** Visible breadcrumb. trail = [[name, relHref|null], ...] */
export function crumbs(trail) {
  return `<nav class="pg-crumbs" aria-label="Breadcrumb"><ol>${trail.map(([n, h], i) => `<li>${h && i < trail.length - 1 ? `<a href="${h}">${n}</a>` : `<span aria-current="page">${n}</span>`}</li>`).join('')}</ol></nav>`
}

export function page({ path, title, desc, current, body, ld = [], crumbsLd, scripts = [], styles = [], bodyClass = '', ogTitle }) {
  const depth = path.split('/').length - 1
  const p = '../'.repeat(depth)
  const graph = { '@context': 'https://schema.org', '@graph': [...ld, crumbsLd ? breadcrumbLd(crumbsLd) : null].filter(Boolean) }
  const url = ORIGIN + '/' + path
  // pages whose pickers are marked data-wikit get the in-house UI kit (css/ui-kit.css + js/ui-kit.js) instead of native pickers
  if (/\sdata-wikit[\s>=]/.test(body)) { styles = [...styles, 'css/ui-kit.css']; scripts = ['js/ui-kit.js', ...scripts] }
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${url}">
  <meta name="color-scheme" content="light dark">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="with icons">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(ogTitle || title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="${ORIGIN}/og/default.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(ogTitle || title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${ORIGIN}/og/default.png">
  <meta name="theme-color" content="#FBF8F3" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0D0F14" media="(prefers-color-scheme: dark)">
  <link rel="preload" href="${p}fonts/bricolage-grotesque-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="${p}fonts/caveat-logo.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${p}css/tokens.css">
  <link rel="stylesheet" href="${p}css/chrome.css">
  <link rel="stylesheet" href="${p}css/pages.css">
${styles.map(c => `  <link rel="stylesheet" href="${p}${c}">\n`).join('')}  <link rel="icon" href="${p}favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="${p}brand/apple-touch-icon.png">
  <link rel="manifest" href="${p}site.webmanifest">
  <script type="application/ld+json">${JSON.stringify(graph)}</script>
</head>
<body class="pg ${bodyClass}">
${header(p, current)}
<main id="main" tabindex="-1">
${body}
</main>
${footer(p)}
${scripts.map(s => `<script src="${p}${s}" defer></script>`).join('\n')}
<script src="${p}js/site.js" defer></script>
<script src="${p}js/pages.js" defer></script>
</body>
</html>
`
}

export function write(rel, html) {
  fs.mkdirSync(SITE + '/' + rel.split('/').slice(0, -1).join('/'), { recursive: true })
  // inline code (not code blocks) wraps (pages.css), so give long tokens sensible break points: after / . _ (inside a
  // word) and before ? or & in URLs. Hyphens already break. overflow-wrap only kicks in as a last resort.
  html = html.replace(/(?<!<pre>)(<code(?: class="[^"]*")?>)([^<]{16,})(<\/code>)/g, (m, o, t, c) =>
    o + t.replace(/\/(?!\/)/g, '/<wbr>').replace(/(\w)([._])(?=\w)/g, '$1$2<wbr>').replace(/(\w)(\?|&amp;)/g, '$1<wbr>$2') + c)
  // tables: label every cell with its column header so narrow screens can stack rows into cards (pages.css)
  html = html.replace(/<table class="pg-table">([\s\S]*?)<\/table>/g, (m, inner) => {
    const labels = [...inner.matchAll(/<th>([\s\S]*?)<\/th>/g)].map(x => x[1].replace(/<[^>]+>/g, '').replace(/"/g, '&quot;'))
    return '<table class="pg-table pg-table--stack">' + inner.replace(/<tr>([\s\S]*?)<\/tr>/g, (r, cells) => {
      let i = 0
      return '<tr>' + cells.replace(/<td>/g, () => `<td data-label="${labels[i++] || ''}">`) + '</tr>'
    }) + '</table>'
  })
  fs.writeFileSync(SITE + '/' + rel, html)
}

const HL = /(\/\/[^\n]*|^[ \t]*#[^\n]*|<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`[^`]*`)|(<\/?)([A-Za-z][\w.-]*)|\b(import|from|export|default|const|let|return|function|new|class|as|true|false|null)\b|([A-Za-z_:@[\]().-]*[A-Za-z_\]])(?==)|(\b\d+(?:\.\d+)?\b)|([{}[\]()<>/=;:,]|\/?>)/gm
export function highlight(code) {
  let out = '', last = 0, m
  HL.lastIndex = 0
  while ((m = HL.exec(code))) {
    out += esc(code.slice(last, m.index))
    if (m[1]) out += '<span class="t-c">' + esc(m[1]) + '</span>'
    else if (m[2]) out += '<span class="t-s">' + esc(m[2]) + '</span>'
    else if (m[3]) out += '<span class="t-p">' + esc(m[3]) + '</span><span class="t-t">' + esc(m[4]) + '</span>'
    else if (m[5]) out += '<span class="t-k">' + esc(m[5]) + '</span>'
    else if (m[6]) out += '<span class="t-a">' + esc(m[6]) + '</span>'
    else if (m[7]) out += '<span class="t-n">' + esc(m[7]) + '</span>'
    else if (m[8]) out += '<span class="t-p">' + esc(m[8]) + '</span>'
    last = HL.lastIndex
    if (m[0] === '') HL.lastIndex++
  }
  return out + esc(code.slice(last))
}
export const COPY_ICON = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8.5" y="8.5" width="12" height="12" rx="2.5"/><path d="M15.5 8.5 V5.5 A2 2 0 0 0 13.5 3.5 H5.5 A2 2 0 0 0 3.5 5.5 V13.5 A2 2 0 0 0 5.5 15.5 H8.5"/></svg>'
export const copyBtn = (label = 'Copy', text) => `<button class="copy-btn" type="button" data-copy-btn${text != null ? ` data-copy="${esc(text)}"` : ''}>${COPY_ICON}<span>${label}</span></button>`
/** Code block in the shared .code primitive (copy wired by site.js). */
export function code(src, lang = '', label = '') {
  const plain = /^(sh|text)$/.test(lang)
  return `<div class="code pg-code"><div class="code-bar"><span class="lang">${esc(label || lang || 'code')}</span>${copyBtn()}</div><pre><code>${plain ? esc(src) : highlight(src)}</code></pre></div>`
}

/** "Ask your AI" block around the shared [data-ask-ai] widget (site.js renders the assistant buttons). */
export function askAI({ id, eyebrow = 'stuck?', title, text, attrs = '', cls = '', p = '' }) {
  return `<section class="pg-ask ${cls}" aria-labelledby="${id}" data-reveal>
  <div class="pg-ask-copy">
    <p class="pg-ask-eyebrow"><span class="hand">${eyebrow}</span></p>
    <h2 id="${id}">${title}</h2>
    <p>${text}</p>
  </div>
  <div class="pg-ask-widget" data-ask-ai${attrs ? ' ' + attrs : ''}><noscript><p class="pg-note">Turn on JavaScript for one-click buttons, or paste <a href="${p}llms.txt">withicons.com/llms.txt</a> into your assistant.</p></noscript></div>
</section>`
}

/* ───────── motion vocabulary (forge/MOTION.md §2) ───────── */
/** [preset, plain description, default seconds, good for, one-shot friendly] */
export const PRESETS = [
  ['spin', 'Turns round and round', 1.2, 'loaders, refresh, settings'],
  ['spin-once', 'One smooth turn, then rests', 0.8, 'refresh or rotate on hover', true],
  ['tick', 'Turns in small steps, like a clock', 1, 'clocks, timers, step loaders'],
  ['pulse', 'Swells a little and back', 1.4, 'record, live, notification dots'],
  ['beat', 'A heartbeat: double thump', 1.2, 'hearts, likes, health'],
  ['breathe', 'A slow, calm swell', 3, 'moon, leaf, calm things'],
  ['float', 'Bobs gently up and down', 2.6, 'clouds, balloons, planes, bots'],
  ['bounce', 'Drops and squashes', 1, 'balls, packages, pins'],
  ['sway', 'Leans slowly side to side', 2.8, 'plants, flags, trees'],
  ['ring', 'Swings like a ringing bell', 1.4, 'bells, alarm clocks'],
  ['wiggle', 'A quick little jiggle', 0.8, 'pencils, brushes, bugs', true],
  ['shake', 'Shakes its head: no', 0.6, 'errors, denied, ban', true],
  ['nod', 'Nods: yes', 0.8, 'check, thumbs up', true],
  ['nudge', 'Points the way and comes back', 1.2, 'arrows, send, external links'],
  ['pass', 'Slides out and back in from the other side', 1.4, 'arrows, upload, download'],
  ['rise', 'Floats up and fades, then returns', 1.6, 'upload, rockets, steam'],
  ['drop', 'Falls down and fades, then returns', 1.6, 'download, droplets, rain'],
  ['blink', 'Blinks like an eye', 3.5, 'eyes, smiles, bots'],
  ['flicker', 'Flickers like a flame', 1.6, 'flames, lightning, bulbs'],
  ['twinkle', 'Sparkles and glints', 1.8, 'stars, sparkles, gems'],
  ['pop', 'Pops in with a tiny overshoot', 0.5, 'add, gifts, badges, likes', true],
  ['tada', 'A celebration wiggle', 1, 'trophies, awards, parties', true],
  ['jelly', 'Wobbles like jelly', 0.9, 'toggles, buttons, smiles', true],
  ['flip', 'Flips over like a coin', 1.2, 'coins, cards, swaps'],
  ['rock', 'Rocks slowly like a boat', 2.4, 'boats, anchors, hourglasses'],
  ['tilt', 'Leans in and holds', 1.6, 'search, magnets, cursors', true],
  ['zoom', 'Zooms in and back', 1.2, 'zoom, maximize, focus'],
  ['orbit', 'Drifts in a small circle', 2.4, 'planets, satellites, compasses'],
  ['glow', 'A soft halo pulses around it', 1.8, 'bulbs, suns, power'],
  ['draw', 'Draws its own lines (outline styles)', 1.6, 'signatures, routes, checks', true],
  ['type', 'Tiny jitters, like keystrokes', 0.9, 'keyboards, terminals, chat'],
  ['fill', 'Fills up, like charging', 1.6, 'battery, signal, wifi, volume'],
]
export const EFFECTS = ['fade', 'scale', 'rotate', 'flip', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'blur', 'spin', 'morph', 'draw']
/** CSS custom properties for a motion object (MOTION.md: --wm-ox --wm-oy in %, --wm-dx --wm-dy unit vector, --wm-k, --wm-dur, --wm-steps). */
export function motionVars(m = {}) {
  const v = []
  const o = m.origin || [12, 12]
  if (o[0] !== 12 || o[1] !== 12) v.push(`--wm-ox:${+(o[0] / 24 * 100).toFixed(2)}%`, `--wm-oy:${+(o[1] / 24 * 100).toFixed(2)}%`)
  if (m.dir != null) { const r = m.dir * Math.PI / 180; v.push(`--wm-dx:${+Math.cos(r).toFixed(3)}`, `--wm-dy:${+Math.sin(r).toFixed(3)}`) }
  if (m.amount != null && m.amount !== 1) v.push(`--wm-k:${m.amount}`)
  if (m.duration != null) v.push(`--wm-dur:${m.duration}s`)
  if (m.steps) v.push(`--wm-steps:${m.steps}`)
  return v.join(';')
}
