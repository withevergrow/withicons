// Shared helpers for the with icons content-page generator (D3).
import fs from 'fs'
import vm from 'vm'
import { fileURLToPath } from 'url'

export const ROOT = fileURLToPath(new URL('../../../', import.meta.url)).split('\\').join('/').replace(/\/+$/, '')
export const SITE = ROOT + '/site'
export const ORIGIN = 'https://withicons.com'
export const GITHUB = 'https://github.com/withevergrow/withicons'
export const STYLES = ['line', 'solid', 'duo', 'gloss', 'engrave', 'blueprint', 'sketch']
export const STYLE_COLOR = { line: '#2F5BFF', solid: '#FF5A36', duo: '#7B5CFF', gloss: '#FF4FA3', engrave: '#C9962B', blueprint: '#00A3C4', sketch: '#22A861' }
export const cvar = s => `var(--c-${s});--gt:var(--c-${s}-text);--gs:var(--c-${s}-soft)`

const ctx = { window: {} }
vm.createContext(ctx)
const run = f => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx)
run(SITE + '/data/meta.js')
for (const s of STYLES) run(`${SITE}/data/style-${s}.js`)
export const META = ctx.window.WITH || ctx.window.EGI
export const SVGS = ctx.window.WITH_SVG || ctx.window.EGI_SVG
export const ICON_NAMES = META.icons.map(i => i.name)
const styleMeta = Object.fromEntries(META.styles.map(s => [s.name, s]))

export const esc = v => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Inline SVG for an icon, rendered at build time from the real icon data. */
export function icon(name, style = 'line', o = {}) {
  const inner = SVGS[style] && SVGS[style][name]
  if (inner == null) throw new Error(`missing icon ${style}/${name}`)
  const size = o.size ?? 24
  const a = { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24', ...(styleMeta[style].root || { fill: 'currentColor' }) }
  if (o.sw != null && a['stroke-width'] != null) a['stroke-width'] = o.sw
  if (o.cls) a.class = o.cls
  let t = ''
  if (o.title) { a.role = 'img'; t = `<title>${esc(o.title)}</title>` } else { a['aria-hidden'] = 'true'; a.focusable = 'false' }
  return '<svg' + Object.entries(a).map(([k, v]) => ` ${k}="${esc(v)}"`).join('') + '>' + t + inner + '</svg>'
}

/** Raw svg string as a user would copy it (for code samples). */
export function rawSvg(name, style = 'line', size = 24) {
  return icon(name, style, { size }).replace(' aria-hidden="true" focusable="false"', '')
}

export function header(p, current) {
  const nav = [['icons.html', 'Icons', 'icons'], ['guides/index.html', 'How to use', 'guides'], ['developers.html', 'Developers', 'developers'], ['ai.html', 'For AI', 'ai'], ['about.html', 'About', 'about']]
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
    ${nav.map(([h, l, k]) => `<a href="${p}${h}"${k === current ? ' aria-current="page"' : ''}>${l}</a>`).join('')}
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
export function footer(p) {
  const f = designFooter()
  if (f) return prefixed(f, p)
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
        <p>300 free icons in 7 styles for slides, docs, websites and apps. Find one, copy it, done.</p>
        <a class="btn btn-sun btn-sm" href="${p}icons.html">Browse all icons</a>
      </div>
      <nav class="foot-cols" aria-label="Footer">
        <div class="foot-col s-line"><h2>Icons</h2><ul>
          <li><a href="${p}icons.html">Browse all 300</a></li><li><a href="${p}styles/line.html">The 7 styles</a></li>
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
          <li><a href="${p}about.html">About</a></li><li><a href="${p}license.html">License</a></li>
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

export function page({ path, title, desc, current, body, ld = [], crumbsLd, scripts = [], bodyClass = '', ogTitle }) {
  const depth = path.split('/').length - 1
  const p = '../'.repeat(depth)
  const graph = { '@context': 'https://schema.org', '@graph': [...ld, crumbsLd ? breadcrumbLd(crumbsLd) : null].filter(Boolean) }
  const url = ORIGIN + '/' + path
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
  <link rel="icon" href="${p}favicon.svg" type="image/svg+xml">
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
