#!/usr/bin/env node
// Live icons pages (forge/DYNAMIC.md): the library and one page per live icon.
//   site/live.html            the Live icons library (grouped grid, style switcher, search)
//   site/live/<name>.html     one studio page per live icon (params, style, colours, size, downloads, code)
//   site/live/og/*.png        Open Graph cards (content-hash cached; site-seo prunes site/og/, so these live here)
//   site/data/live-pages.json the page list for site-seo (sitemap + llms.txt), same shape as data/alternatives.json
//
// Reads the generated live data (site/data/live.js + live-<style>.js, from forge/lib/emit-dynamic.mjs) and renders
// the default line drawings with packages/dynamic/dist. Every page reads without JS: all pictures are inline SVG.
// Deterministic: no dates except file mtimes of inputs; same inputs -> byte-identical output.
//
//   node forge/tools/site-dynamic.mjs [--no-og]
import fs from 'fs'
import os from 'os'
import path from 'path'
import vm from 'vm'
import crypto from 'crypto'
import { fileURLToPath, pathToFileURL } from 'url'
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'

const SELF = fileURLToPath(import.meta.url)
const ROOT = path.resolve(path.dirname(SELF), '..', '..')
const SITE = path.join(ROOT, 'site')

if (!isMainThread && workerData && workerData.withLiveOg) {
  const { Resvg } = await import('@resvg/resvg-js')
  for (const j of workerData.jobs) {
    const img = new Resvg(j.svg, { font: workerData.font, fitTo: { mode: 'original' }, background: '#FBF8F3' }).render()
    fs.writeFileSync(j.file, img.asPng())
  }
  parentPort.postMessage(workerData.jobs.length)
} else {
  await main()
}

async function main() {
  const t0 = Date.now()
  const NO_OG = process.argv.includes('--no-og')
  const readJSON = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')) } catch { return null } }
  const cfg = readJSON(path.join(ROOT, 'forge', 'site.config.json')) || { url: 'https://withicons.com', name: 'with icons' }
  const BASE = cfg.url.replace(/\/$/, ''), BRAND = cfg.name || 'with icons'
  const PUB = cfg.publisher || { name: 'Evergrow', url: 'https://withevergrow.com' }
  const REPO = cfg.repo || 'https://github.com/withevergrow/withicons'
  const SCOPE = cfg.npmScope || '@withicons'
  const CDN = 'https://cdn.jsdelivr.net/npm'

  /* ───────────── inputs ───────────── */
  const dataFile = path.join(SITE, 'data', 'live.js')
  if (!fs.existsSync(dataFile)) { console.log('site dynamic: site/data/live.js missing (run node forge/build.mjs dynamic), skipped'); return }
  const sandbox = { window: {} }
  vm.createContext(sandbox)
  vm.runInContext(fs.readFileSync(dataFile, 'utf8'), sandbox)
  const LIVE = sandbox.window.WITH_LIVE
  const STYLES = LIVE.styles
  const SN = STYLES.map(s => s.name)
  const STYLE = Object.fromEntries(STYLES.map(s => [s.name, s]))
  for (const s of SN) {
    const f = path.join(SITE, 'data', `live-${s}.js`)
    if (fs.existsSync(f)) vm.runInContext(fs.readFileSync(f, 'utf8'), sandbox)
  }
  const EX = sandbox.window.WITH_LIVE_SVG || {}
  const VERSION = LIVE.version || '0.0.0'
  let RT = null
  try { RT = await import(pathToFileURL(path.join(ROOT, 'packages', 'dynamic', 'dist', 'index.js')).href) } catch { RT = null }

  const ICONS = LIVE.icons.slice().sort((a, b) => a.name < b.name ? -1 : 1)
  const BY = Object.fromEntries(ICONS.map(i => [i.name, i]))
  const NS = STYLES.length, N = ICONS.length

  /* ───────────── groups ───────────── */
  const GROUPS = [
    { id: 'calendar', title: 'Calendar', style: 'line', lede: 'Calendar pages with the day, month, weekday or date range you set.',
      names: ['calendar-date', 'calendar-weekday', 'calendar-month', 'calendar-event', 'calendar-range', 'calendar-tear'] },
    { id: 'time', title: 'Time', style: 'luxe', lede: 'Clocks, watches, alarms and timers that show the time you choose.',
      names: ['clock-time', 'watch-time', 'alarm-clock-time', 'digital-clock', 'stopwatch', 'timer-ring'] },
    { id: 'power', title: 'Battery & signal', style: 'pixel', lede: 'Battery charge, Wi-Fi, signal bars, network type and volume at the level you pick.',
      names: ['battery-level', 'battery-percent', 'battery-vertical', 'battery-charging-level', 'signal-bars', 'wifi-strength', 'cellular-tech', 'volume-level'] },
    { id: 'counts', title: 'Counts', style: 'solid', lede: 'Notification badges with your number, from a single dot up to 99+.',
      names: ['bell-count', 'mail-count', 'chat-count', 'inbox-count', 'cart-count', 'app-badge'] },
    { id: 'labels', title: 'Labels', style: 'sticker', lede: 'Badges, tags, prices, stickers and file types with your own short text.',
      names: ['badge-text', 'tag-label', 'price-tag', 'sale-sticker', 'ribbon-label', 'percent-badge', 'file-type', 'folder-label', 'ticket-number', 'map-pin-number'] },
    { id: 'weather', title: 'Weather', style: 'glass', lede: 'Conditions, temperature, humidity, UV index and wind speed with your reading.',
      names: ['weather', 'thermometer-level', 'humidity', 'uv-index', 'wind-speed'] },
    { id: 'progress', title: 'Progress', style: 'bauhaus', lede: 'Rings, gauges, bar charts, star ratings and numbered steps at your value.',
      names: ['progress-ring', 'gauge-value', 'bar-values', 'rating-stars', 'step-number'] },
    { id: 'fun', title: 'Fun', style: 'kawaii', lede: 'Dice, keyboard keys, initials and speech bubbles.',
      names: ['dice', 'keycap', 'avatar-initials', 'speech-bubble-text'] },
  ]
  const CAT_FALLBACK = { time: 'time', weather: 'weather', devices: 'power', communication: 'counts', commerce: 'labels', charts: 'progress', status: 'progress' }
  const groupOf = {}
  for (const g of GROUPS) for (const n of g.names) if (BY[n]) groupOf[n] = g.id
  for (const i of ICONS) if (!groupOf[i.name]) { const g = CAT_FALLBACK[i.category] || 'fun'; groupOf[i.name] = g; GROUPS.find(x => x.id === g).names.push(i.name) }
  for (const g of GROUPS) g.names = g.names.filter(n => BY[n])
  const G = Object.fromEntries(GROUPS.map(g => [g.id, g]))

  /* ───────────── static siblings: the plain icon(s) each live icon is a version of (site/icons/<name>.html) ───────────── */
  const SIBLINGS = {
    'alarm-clock-time': ['alarm-clock', 'clock'], 'app-badge': ['app-window', 'bell'], 'avatar-initials': ['user-circle', 'user'],
    'badge-text': ['badge-check', 'tag'], 'bar-values': ['chart-bar', 'chart-line'], 'battery-charging-level': ['battery-charging', 'battery'],
    'battery-level': ['battery', 'battery-low'], 'battery-percent': ['battery', 'percent'], 'battery-vertical': ['battery', 'battery-low'],
    'bell-count': ['bell', 'bell-ring'], 'calendar-date': ['calendar', 'calendar-days'], 'calendar-event': ['calendar-check', 'calendar'],
    'calendar-month': ['calendar-days', 'calendar'], 'calendar-range': ['calendar', 'calendar-days'], 'calendar-tear': ['calendar', 'calendar-days'],
    'calendar-weekday': ['calendar', 'calendar-days'], 'cart-count': ['shopping-cart', 'shopping-bag'], 'cellular-tech': ['signal', 'wifi'],
    'chat-count': ['message-circle', 'messages'], 'clock-time': ['clock', 'watch'], 'digital-clock': ['clock', 'alarm-clock'],
    'file-type': ['file', 'file-text', 'file-pdf'], 'folder-label': ['folder', 'folder-open'], 'gauge-value': ['gauge'], humidity: ['droplet'],
    'inbox-count': ['inbox'], keycap: ['keyboard', 'key'], 'mail-count': ['mail', 'mail-open'], 'map-pin-number': ['map-pin', 'map'],
    'percent-badge': ['badge-percent', 'percent'], 'price-tag': ['tag', 'badge-percent'], 'progress-ring': ['loader', 'percent'],
    'rating-stars': ['star', 'star-half'], 'ribbon-label': ['award', 'bookmark', 'medal'], 'sale-sticker': ['badge-percent', 'tag'],
    'signal-bars': ['signal', 'wifi'], 'speech-bubble-text': ['message-square-text', 'message-square'], 'step-number': ['circle-dot'],
    stopwatch: ['timer', 'watch'], 'tag-label': ['tag'], 'thermometer-level': ['thermometer'], 'ticket-number': ['ticket'], 'timer-ring': ['timer'],
    'uv-index': ['sun'], 'volume-level': ['volume', 'speaker'], 'watch-time': ['watch', 'clock'], weather: ['cloud-sun', 'sun', 'cloud-rain'],
    'wifi-strength': ['wifi', 'wifi-off'], 'wind-speed': ['wind'],
  }
  const ICON_DIR = path.join(ROOT, 'forge', 'icons')
  const isStatic = n => fs.existsSync(path.join(ICON_DIR, `${n}.json`))
  // unmapped live icons fall back to the longest name prefix that is a static icon ("calendar-date" -> "calendar")
  const siblingsOf = n => {
    const out = (SIBLINGS[n] || []).filter(isStatic)
    if (!out.length) { const p = n.split('-'); for (let k = p.length - 1; k > 0 && !out.length; k--) if (isStatic(p.slice(0, k).join('-'))) out.push(p.slice(0, k).join('-')) }
    return out
  }
  let LINE = null, loadIcon = null, renderIcon = null, nodesToMarkup = null
  try {
    const L = await import(pathToFileURL(path.join(ROOT, 'forge', 'lib', 'load.mjs')).href)
    ;({ loadIcon, renderIcon, nodesToMarkup } = L)
    LINE = (await L.loadStyles(['line'])).line || null
  } catch { LINE = null }
  const staticInner = n => { try { return LINE ? nodesToMarkup(renderIcon(LINE, loadIcon(n))) : '' } catch { return '' } }
  const staticTitle = n => n.charAt(0).toUpperCase() + n.slice(1).replace(/-/g, ' ')

  /* ───────────── helpers ───────────── */
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const attrs = o => Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false).map(([k, v]) => ` ${k}="${esc(v)}"`).join('')
  const kebab = s => String(s).replace(/[A-Z]/g, m => '-' + m.toLowerCase())
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1)
  const list = (a, conj = 'and') => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + (a.length > 2 ? ',' : '') + ` ${conj} ` + a[a.length - 1]
  const short = l => String(l).replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+—.*$/, '').trim()
  const dateOf = d => new Date(d).toISOString().slice(0, 10)
  const fileDate = f => fs.existsSync(f) ? dateOf(fs.statSync(f).mtime) : null
  const genFile = n => path.join(ROOT, 'forge', 'dynamic', `${n}.mjs`)
  const lastmod = n => fileDate(genFile(n)) || fileDate(dataFile)
  const RESERVED = ['name', 'variant', 'size', 'color', 'stroke-width', 'absolute-stroke-width', 'label', 'aria-label', 'aria-labelledby', 'params', 'today', 'vars']
  const attrOf = k => RESERVED.includes(kebab(k)) ? 'param-' + kebab(k) : kebab(k)
  const REACT_RESERVED = ['name', 'variant', 'size', 'color', 'vars', 'label', 'params', 'today', 'className', 'style', 'strokeWidth', 'absoluteStrokeWidth', 'key', 'ref', 'children']
  const STYLE_SAY = {
    line: 'clean outlines', solid: 'bold filled shapes', duo: 'outline with a colour tint', gloss: 'shiny candy highlights', engrave: 'engraved hatching',
    blueprint: 'technical drawing', sketch: 'hand-drawn pencil', glass: 'frosted glass panes', kawaii: 'cute with a face', sticker: 'die-cut sticker',
    pixel: '8-bit pixels', retro: '70s stripes', luxe: 'layered 3D enamel and gold', bauhaus: 'bold geometric Bauhaus', skeuo: 'realistic materials',
    anime: 'anime cel shading', gothic: 'Gothic stone and stained glass', pastel: 'soft pastels', coquette: 'bows and blush pink', plush: 'soft felt toys',
  }

  // standalone inline svg (decorative unless a title is given); inner markup may carry var(--with-*, #hex) and currentColor
  const svgOf = (inner, style, o = {}) => {
    const root = STYLE[style].root || {}
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"${attrs(root)}${o.cls ? ` class="${o.cls}"` : ''}${o.title ? ` role="img" aria-label="${esc(o.title)}"` : ' aria-hidden="true" focusable="false"'}>${inner}</svg>`
  }
  const innerOf = svg => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
  // the default drawing in a style (runtime), or the first example (pre-rendered data) when the runtime is unavailable
  const defCache = {}
  const defaultInner = (n, style) => {
    const k = n + '@' + style
    if (k in defCache) return defCache[k]
    let s = null
    if (RT) { try { s = innerOf(RT.render(n, BY[n].defaults || {}, style)) } catch { s = null } }
    return (defCache[k] = s || exInner(n, style, 0))
  }
  const exInner = (n, style, i) => (EX[style] && EX[style][n] && EX[style][n][i]) || (EX.line && EX.line[n] && EX.line[n][i]) || ''

  // plain words for a set of params ("17 MAR · binder rings")
  const fmtVal = (p, v) => p.type === 'level' ? `${Math.round(v * 100)}%` : p.type === 'text' ? `“${v}”` : p.type === 'bool' ? (v ? short(p.label).toLowerCase() : '') : String(v)
  const sayParams = (i, ps) => {
    const out = []
    for (const [k, p] of Object.entries(i.params)) {
      const v = ps[k] ?? i.defaults?.[k] ?? p.default
      if (p.type === 'bool') { if (v && v !== p.default) out.push(short(p.label).toLowerCase()); continue }
      out.push(fmtVal(p, v))
    }
    return out.filter(Boolean).slice(0, 3).join(' · ')
  }
  // the friendlier words of the icon pages ("Partly · 21°", "$49", "Top right"); js/live.js sayNice() says the same
  const OPT_SAY = { usd: '$ Dollar', eur: '€ Euro', gbp: '£ Pound', inr: '₹ Rupee', jpy: '¥ Yen', degree: '°', celsius: '°C', fahrenheit: '°F', kelvin: 'K',
    kt: 'Knots', mph: 'mph', kmh: 'km/h', ms: 'm/s', bft: 'Beaufort', 'top-right': 'Top right', 'top-left': 'Top left', 'bottom-right': 'Bottom right', 'bottom-left': 'Bottom left' }
  const UNIT_SAY = { degree: '°', celsius: '°C', fahrenheit: '°F', kelvin: ' K', none: '', kt: ' kt', mph: ' mph', kmh: ' km/h', ms: ' m/s', bft: ' Bft' }
  const CUR_SAY = { usd: '$', eur: '€', gbp: '£', inr: '₹', jpy: '¥', none: '' }
  const prettyOpt = o => { o = String(o); if (OPT_SAY[o]) return OPT_SAY[o]; if (/^[A-Z0-9+%°]{1,4}$/.test(o) || /^\d/.test(o)) return o; return o.charAt(0).toUpperCase() + o.slice(1).replace(/-/g, ' ') }
  const sayNice = (i, ps) => {
    const out = []; let last = -1
    for (const [k, p] of Object.entries(i.params)) {
      const v = ps[k] ?? i.defaults?.[k] ?? p.default
      if (p.type === 'bool') { if (v && v !== p.default) out.push(short(p.label).toLowerCase()); continue }
      if (p.type === 'enum' && k === 'unit' && last >= 0 && v in UNIT_SAY) { out[last] += UNIT_SAY[v]; continue }
      if (p.type === 'enum' && k === 'currency' && last >= 0 && v in CUR_SAY) { out[last] = CUR_SAY[v] + out[last]; continue }
      out.push(p.type === 'level' ? `${Math.round(v * 100)}%` : p.type === 'text' ? `“${v}”` : p.type === 'enum' ? prettyOpt(v) : String(v))
      if (p.type === 'int' || p.type === 'number') last = out.length - 1
    }
    return out.filter(Boolean).slice(0, 3).join(' · ')
  }
  const paramList = i =>Object.values(i.params).map(p => short(p.label))
  const kindWord = { int: 'Number', number: 'Number', level: 'Level', time: 'Time', enum: 'Choice', text: 'Text', bool: 'On / off' }
  const rangeOf = p => p.type === 'int' || p.type === 'number' ? `${p.min} to ${p.max}${p.step ? `, steps of ${p.step}` : ''}`
    : p.type === 'level' ? '0% to 100%' : p.type === 'time' ? 'Any time, HH:MM (24-hour)'
      : p.type === 'enum' ? p.options.join(', ') : p.type === 'text' ? `Up to ${p.maxLength} characters: A-Z, 0-9 and % ° : - + / . , ! ? $ € £ ₹ # & * '` : 'on or off'
  const defOf = p => p.type === 'level' ? `${Math.round(p.default * 100)}%` : p.type === 'bool' ? (p.default ? 'on' : 'off') : String(p.default)

  /* ───────────── code snippets ───────────── */
  const htmlSnippet = (i, ps, style = 'line', size = 48) => {
    const a = Object.entries(i.params).map(([k, p]) => {
      const v = ps[k] ?? p.default
      return p.type === 'bool' ? (v ? ` ${attrOf(k)}` : ` ${attrOf(k)}="false"`) : ` ${attrOf(k)}="${esc(v)}"`
    }).join('')
    return `<script src="${CDN}/${SCOPE}/dynamic@${VERSION}/dist/cdn/dynamic.js"></script>\n\n<with-live-icon name="${i.name}"${a}${style !== 'line' ? ` variant="${style}"` : ''} size="${size}"></with-live-icon>`
  }
  const jsVal = v => typeof v === 'string' ? `'${v.replace(/'/g, "\\'")}'` : String(v)
  const reactSnippet = (i, ps, style = 'line', size = 48) => {
    const props = [], nested = []
    for (const [k, p] of Object.entries(i.params)) {
      const v = ps[k] ?? p.default
      if (REACT_RESERVED.includes(k)) { nested.push(`${k}: ${jsVal(v)}`); continue }
      props.push(typeof v === 'string' ? `${k}="${v.replace(/"/g, '&quot;')}"` : v === true ? k : `${k}={${v}}`)
    }
    if (nested.length) props.push(`params={{ ${nested.join(', ')} }}`)
    if (style !== 'line') props.push(`variant="${style}"`)
    props.push(`size={${size}}`)
    return `import { LiveIcon } from '${SCOPE}/dynamic/react'\n\nexport function Example() {\n  return <LiveIcon name="${i.name}" ${props.join(' ')} />\n}`
  }
  const vueSnippet = (i, ps, style = 'line', size = 48) => {
    const props = [], nested = []
    for (const [k, p] of Object.entries(i.params)) {
      const v = ps[k] ?? p.default
      if (REACT_RESERVED.includes(k)) { nested.push(`${k}: ${jsVal(v)}`); continue }
      props.push(typeof v === 'string' ? `${kebab(k)}="${v}"` : `:${kebab(k)}="${v}"`)
    }
    if (nested.length) props.push(`:params="{ ${nested.join(', ')} }"`)
    if (style !== 'line') props.push(`variant="${style}"`)
    props.push(`:size="${size}"`)
    return `<script setup>\nimport { LiveIcon } from '${SCOPE}/dynamic/vue'\n</script>\n\n<template>\n  <LiveIcon name="${i.name}" ${props.join(' ')} />\n</template>`
  }

  /* ───────────── chrome: header + footer taken from a hand-written page so every page matches ───────────── */
  const chromeSrc = ['about.html', 'faq.html', 'index.html'].map(f => path.join(SITE, f)).find(f => fs.existsSync(f))
  const srcHtml = chromeSrc ? fs.readFileSync(chromeSrc, 'utf8') : ''
  let HEADER = (srcHtml.match(/<a class="skip-link"[\s\S]*?<\/header>/) || [''])[0]
  let FOOTER = (srcHtml.match(/<footer class="site-footer">[\s\S]*?<\/footer>/) || [''])[0]
  if (!HEADER) HEADER = `<a class="skip-link" href="#main">Skip to content</a>\n<header class="site-header" data-header><a class="logo" href="index.html" aria-label="with icons — home"><span class="logo-morph" aria-hidden="true" data-logo-morph></span><span class="logo-type"><span class="logo-words"><span class="logo-with">with</span><span class="logo-icons">icons</span></span><span class="logo-by">powered by <b>evergrow</b></span></span></a><nav class="site-nav" aria-label="Primary"><a href="icons.html">Icons</a><a href="live.html" class="nav-live">Live icons<span class="nav-new">New</span></a><a href="guides/index.html">How to use</a><a href="developers.html">Developers</a><a href="ai.html">For AI</a><a href="about.html">About</a></nav><div class="site-actions"><button class="search-trigger" type="button" data-search-open aria-label="Search icons"><kbd>/</kbd></button><button class="theme-toggle" type="button" data-theme-toggle aria-label="Toggle dark mode"></button><a class="cta" href="icons.html">Browse icons</a></div></header>`
  if (!FOOTER) FOOTER = `<footer class="site-footer"><div class="foot-inner"><div class="foot-base"><span>© 2026 with icons · MIT License</span><a class="evergrow-link" href="https://withevergrow.com"><span data-evergrow-mark></span>Powered by Evergrow</a></div></div></footer>`
  HEADER = HEADER.replace(/ aria-current="[^"]*"/g, '')
  if (!/href="live\.html"/.test(HEADER)) HEADER = HEADER.replace(/(<a href="icons\.html">Icons<\/a>)/, '$1<a href="live.html" class="nav-live">Live icons<span class="nav-new">New</span></a>')
  HEADER = HEADER.replace(/<a href="live\.html"/, '<a href="live.html" aria-current="true"')
  FOOTER = FOOTER.replace(/ aria-current="[^"]*"/g, '')
  const prefixed = (html, pre) => !pre ? html : html.replace(/(href|src|srcset)="(?!https?:|#|\/|mailto:|data:)([^"]*)"/g, (m, k, v) => `${k}="${k === 'srcset' ? v.split(/,\s*/).map(x => pre + x).join(', ') : pre + v}"`)

  const EVERGROW = { '@type': 'Organization', '@id': `${PUB.url}/#org`, name: PUB.name, url: PUB.url }
  const ORG = { '@type': 'Organization', '@id': `${BASE}/#org`, name: BRAND, url: `${BASE}/`, logo: `${BASE}/brand/icon-512.png`, parentOrganization: { '@id': EVERGROW['@id'] }, sameAs: [REPO] }
  const SITE_NODE = { '@type': 'WebSite', '@id': `${BASE}/#website`, name: BRAND, url: `${BASE}/`, publisher: { '@id': ORG['@id'] }, inLanguage: 'en' }
  const crumbLd = (id, items) => ({ '@type': 'BreadcrumbList', '@id': id, itemListElement: items.map((c, k) => ({ '@type': 'ListItem', position: k + 1, name: c.name, item: c.url })) })
  const crumbs = items => `<nav class="crumbs lv-crumbs" aria-label="Breadcrumb"><ol>${items.map((c, k) => k === items.length - 1 ? `<li aria-current="page">${esc(c.name)}</li>` : `<li><a href="${c.href}">${esc(c.name)}</a></li>`).join('')}</ol></nav>`
  const faqLd = (id, qs) => ({ '@type': 'FAQPage', '@id': id, mainEntity: qs.map(q => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a.replace(/<[^>]+>/g, '') } })) })
  const faqHtml = qs => `<div class="lv-faq">${qs.map(q => `<details class="lv-q"><summary><span>${esc(q.q)}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="lv-a"><p>${q.a}</p></div></details>`).join('')}</div>`
  const code = (id, lang, label, text) => `<div class="code lv-code" data-lv-code="${id}"><div class="code-bar"><span class="lang">${esc(label)}</span><button class="copy-btn lv-copy" type="button" data-lv-copy="${id}">Copy</button></div><pre tabindex="0" aria-label="${esc(label)} code"><code id="lv-code-${id}">${esc(text)}</code></pre></div>`

  function page({ pre = '', title, description, canonical, og, ogAlt, jsonld, main, bodyClass, keywords, head = '', scripts = '', bodyAttr = '' }) {
    const P = pre
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${keywords ? `<meta name="keywords" content="${esc(keywords)}">\n` : ''}<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#FBF8F3" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0D0F14" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(BRAND)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(ogAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${og}">
<script>document.documentElement.className+=' js';try{var t=localStorage.getItem('with-theme-v2');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light')}catch(e){}</script>
<link rel="preload" href="${P}fonts/bricolage-grotesque-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${P}fonts/caveat-logo.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${P}css/tokens.css">
<link rel="stylesheet" href="${P}css/chrome.css">
<link rel="stylesheet" href="${P}css/live.css">
<link rel="icon" href="${P}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${P}brand/apple-touch-icon.png">
<link rel="manifest" href="${P}site.webmanifest">
<link rel="alternate" type="text/plain" title="llms.txt" href="${P}llms.txt">
${head}<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': jsonld }).replace(/</g, '\\u003c')}</script>
</head>
<body class="${bodyClass}"${bodyAttr}>
${prefixed(HEADER, P)}
<main id="main">
${main}
</main>
${prefixed(FOOTER, P)}
<script src="${P}data/live.js" defer></script>
<script src="${P}vendor/dynamic/dynamic.js" defer></script>
${scripts}<script src="${P}js/site.js" defer></script>
<script src="${P}js/live.js" defer></script>
</body>
</html>
`
  }

  const written = {}
  const write = (rel, text) => {
    const f = path.join(SITE, rel)
    fs.mkdirSync(path.dirname(f), { recursive: true })
    if (!fs.existsSync(f) || fs.readFileSync(f, 'utf8') !== text) fs.writeFileSync(f, text)
    written[rel] = Buffer.byteLength(text)
  }

  const styleDots = `<span class="lv-dots" aria-hidden="true">${SN.map(s => `<i style="--c:var(--c-${s})"></i>`).join('')}</span>`
  const arrow = '<svg class="arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const searchIco = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'

  /* ───────────── style switcher (mirrors the icon library's) ─────────────
     Every style always visible in five groups, each option a mini drawing of `sample` in that style + its name. Phones
     get a trigger that opens the same list as a panel (js/live.js). Used by the library bar and by every icon page. */
  const SB_GROUPS = [
    { id: 'everyday', title: 'Everyday', styles: ['line', 'solid', 'duo'] },
    { id: 'crafted', title: 'Crafted', styles: ['gloss', 'engrave', 'blueprint', 'sketch'] },
    { id: 'playful', title: 'Playful', styles: ['glass', 'kawaii', 'sticker', 'pixel', 'retro'] },
    { id: 'studio', title: 'Studio', styles: ['luxe', 'bauhaus', 'skeuo'] },
    { id: 'storybook', title: 'Storybook', styles: ['anime', 'gothic', 'pastel', 'coquette', 'plush'], isNew: true },
  ].map(g => ({ ...g, styles: g.styles.filter(s => STYLE[s]) }))
  for (const s of SN) if (!SB_GROUPS.some(g => g.styles.includes(s))) SB_GROUPS[SB_GROUPS.length - 1].styles.push(s)
  const styleSwitcher = (sample, o = {}) => {
    const sbIc = s => svgOf(defaultInner(sample, s), s)
    const chev = '<svg class="lv-sb-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    const g0 = SB_GROUPS.find(g => g.styles.includes(SN[0])) || SB_GROUPS[0]
    return `<div class="lv-sb${o.cls ? ' ' + o.cls : ''}" data-lv-styles>
      <button type="button" class="lv-sb-toggle" data-lv-sb-toggle aria-expanded="false" aria-controls="lv-style-panel" aria-label="Style: ${esc(STYLE[SN[0]].title)}. Show all ${NS} styles"><span class="lv-sb-cur-ic" data-lv-sb-cur-ic aria-hidden="true">${sbIc(SN[0])}</span><span class="lv-sb-cur"><small data-lv-sb-cur-g>${esc(g0.title)} style</small><b data-lv-sb-cur>${esc(STYLE[SN[0]].title)}</b></span><span class="lv-sb-dots" aria-hidden="true">${SN.map((s, k) => `<i data-st="${s}" style="--sc:var(--c-${s})"${k === 0 ? ' class="is-on"' : ''}></i>`).join('')}</span>${chev}</button>
      <div class="lv-sb-panel" id="lv-style-panel">
        <div class="lv-sb-list" role="radiogroup" aria-label="${esc(o.label || 'Style')}"><span class="lv-sb-ink" aria-hidden="true"></span>${SB_GROUPS.map(g => `<div class="lv-sb-g" data-group="${g.id}"><p class="lv-sb-gl" aria-hidden="true"><span>${esc(g.title)}</span>${g.isNew ? '<b class="lv-sb-new">New</b>' : ''}</p><div class="lv-sb-opts">${g.styles.map(s => `<button type="button" class="lv-sb-o lv-sty" role="radio" aria-checked="${s === SN[0]}" tabindex="${s === SN[0] ? 0 : -1}" data-style="${s}" data-group-title="${esc(g.title)}" style="--sc:var(--c-${s});--sc-text:var(--c-${s}-text)" aria-label="${esc(STYLE[s].title)}, ${g.title.toLowerCase()} style${g.isNew ? ', new' : ''}" title="${esc(STYLE[s].title)}: ${esc(STYLE_SAY[s] || '')}"><span class="lv-sb-ic" aria-hidden="true">${sbIc(s)}</span><span class="lv-sb-t">${esc(STYLE[s].title)}</span></button>`).join('')}</div></div>`).join('')}</div>
      </div>
    </div>`
  }

  /* ───────────── the library: site/live.html ───────────── */
  const HERO = [
    { n: 'calendar-date', s: 'luxe', p: { day: 17, month: 'MAR' }, say: ['day', 'month'] },
    { n: 'battery-percent', s: 'skeuo', p: { level: 0.8 }, say: ['level'] },
    { n: 'bell-count', s: 'bauhaus', p: { count: 12 }, say: ['count'] },
    { n: 'weather', s: 'pastel', p: { condition: 'partly', temperature: 23 }, say: ['condition', 'temperature'] },
    { n: 'clock-time', s: 'glass', p: { time: '10:10' }, say: ['time'] },
    { n: 'progress-ring', s: 'plush', p: { value: 68 }, say: ['value'] },
  ].filter(h => BY[h.n] && STYLE[h.s])
  const heroInner = h => { if (RT) { try { return innerOf(RT.render(h.n, h.p, h.s)) } catch { } } return exInner(h.n, h.s, 0) }
  const sayKeys = (i, ps, keys) => keys.map(k => fmtVal(i.params[k], ps[k] ?? i.params[k].default)).join(' · ')
  const libFaq = [
    { q: 'What are live icons?', a: `Icons whose content you set. A calendar shows your date, a clock your time, a badge your count, a battery its charge, a tag your text. There are ${N} of them and each one works in all ${NS} styles.` },
    { q: 'Are live icons free?', a: `Yes. Like every icon on ${BRAND}, they are free for personal and commercial use under the MIT license. No sign-up, no credit needed.` },
    { q: 'How do I change the number or text on an icon?', a: 'Open the icon, type your value in the controls (a day, a time, a count, a short label), pick a style and colours, then download it as SVG, PNG, PDF or a PowerPoint slide.' },
    { q: 'Will the text stay readable when the icon is small?', a: 'Yes. Text is drawn with a stroke font built for 16 to 24 pixels, and each icon falls back when a value would get too small to read: counts over 99 become “99+”, for example.' },
    { q: 'Can a calendar icon show today’s date on my website?', a: `Yes. Add the ${SCOPE}/dynamic script and write <code>&lt;with-live-icon name="calendar-date" today&gt;</code>. It reads the visitor’s clock and updates every minute.` },
  ]
  const lib = (() => {
    const canonical = `${BASE}/live.html`
    const heroTiles = HERO.map((h, k) => `<figure class="lv-tile s-${h.s}" data-hero="${h.n}" data-style="${h.s}" data-say="${h.say.join(',')}" style="--k:${k}">
  <div class="lv-tile-art">${svgOf(heroInner(h), h.s, { cls: 'lv-svg' })}</div>
  <figcaption><span class="lv-tile-name">${esc(BY[h.n].title)}</span><span class="lv-tile-val" data-hero-val>${esc(sayKeys(BY[h.n], h.p, h.say))}</span><span class="lv-tile-style">${esc(STYLE[h.s].title)}</span></figcaption>
</figure>`).join('\n')
    const SB_SAMPLE = BY['calendar-date'] ? 'calendar-date' : ICONS[0].name
    const styleBar = styleSwitcher(SB_SAMPLE)
    const groupChips = `<div class="lv-groups" role="group" aria-label="Show a group"><button type="button" class="lv-g" aria-pressed="true" data-group="">All <b>${N}</b></button>${GROUPS.map(g => `<button type="button" class="lv-g s-${g.style}" aria-pressed="false" data-group="${g.id}">${esc(g.title)} <b>${g.names.length}</b></button>`).join('')}</div>`
    const card = (n, k) => {
      const i = BY[n]
      return `<li class="lv-card" data-name="${n}" data-group-title="${esc(G[groupOf[n]].title)}" style="--k:${k % 12}"><a href="live/${n}.html" class="lv-card-link">
  <span class="lv-card-art">${svgOf(defaultInner(n, 'line'), 'line', { cls: 'lv-svg' })}</span>
  <span class="lv-card-title">${esc(i.title)}</span>
  <span class="lv-card-params">${esc(paramList(i).slice(0, 3).join(' · '))}</span>
</a></li>`
    }
    const sections = GROUPS.map(g => `<section class="lv-group s-${g.style}" id="g-${g.id}" data-group-sec="${g.id}" aria-labelledby="h-${g.id}">
  <header class="lv-group-head"><h2 id="h-${g.id}" class="lv-group-title">${esc(g.title)}<sup>${g.names.length}</sup></h2><p>${esc(g.lede)}</p></header>
  <ul class="lv-grid" role="list">${g.names.map(card).join('\n')}</ul>
</section>`).join('\n')
    const ex = BY['calendar-date'] ? 'calendar-date' : ICONS[0].name
    const main = `<section class="lv-hero">
  <div class="wrap lv-hero-in">
    <div class="lv-hero-copy">
      <p class="lv-pill">${styleDots}<span>${N} live icons × ${NS} styles · free · MIT</span></p>
      <h1 class="lv-display">Icons that show<br><span class="lv-yours"><span class="hand">your</span> numbers.</span></h1>
      <p class="lede">A calendar with your date. A battery at your level. A bell with your count, a tag with your words. Type it in, pick one of ${NS} styles, download it for slides, docs or your website.</p>
      <div class="lv-hero-cta"><a class="btn btn-ink btn-lg" href="#library">Browse all ${N} ${arrow}</a><a class="btn btn-ghost btn-lg" href="live/${ex}.html">Make a calendar</a></div>
    </div>
    <div class="lv-board" data-hero-board aria-label="Live icons changing their values" role="img">
${heroTiles}
    </div>
  </div>
</section>
<div class="lv-bar" data-lv-bar id="library">
  <div class="wrap lv-bar-in">
    <label class="lv-search">${searchIco}<span class="visually-hidden">Search live icons</span><input type="search" data-lv-q placeholder="Search ${N} live icons… try “date”, “battery”" autocomplete="off" spellcheck="false"><kbd>/</kbd></label>
    ${styleBar}
  </div>
  <div class="wrap">${groupChips}</div>
</div>
<div class="wrap lv-lib">
  <p class="lv-status" data-lv-status aria-live="polite"><b>${N}</b> live icons · <span data-lv-style-name>Line</span> style</p>
${sections}
  <div class="lv-empty" data-lv-empty hidden><p class="h3">Nothing live matches “<span data-lv-empty-q></span>”.</p><p class="muted">Try “date”, “time”, “battery”, “count”, “sale”, “weather” or “progress”, or <a href="icons.html" data-lv-all>search all icons</a>.</p></div>
</div>
<section class="section lv-how">
  <div class="wrap">
    <p class="eyebrow">How it works</p>
    <h2 class="h2">Three steps. <span class="hand lv-accent">No design tools.</span></h2>
    <ol class="lv-steps">
      <li><b>1</b><h3>Pick an icon</h3><p>Calendars, clocks, batteries, badges, tags, weather and more. Each one has a few plain settings.</p></li>
      <li><b>2</b><h3>Type your value</h3><p>A date, a time, a count, a level or up to four characters. The icon redraws as you type and stays readable at 16px.</p></li>
      <li><b>3</b><h3>Download or paste</h3><p>SVG, PNG, PDF or a PowerPoint slide, in any of ${NS} styles and your colours. Developers get one line of HTML, React or Vue.</p></li>
    </ol>
  </div>
</section>
<section class="section lv-dev slab-dark">
  <div class="wrap lv-dev-in">
    <div>
      <p class="eyebrow">For developers</p>
      <h2 class="h2">One element. Any value.</h2>
      <p class="lede">The <code>${SCOPE}/dynamic</code> package draws every live icon in every style, in the browser or in Node. Change an attribute and the icon redraws. <code>today</code> keeps a calendar or clock on the visitor’s current date and time.</p>
      <p class="lv-soon">Launching soon on npm. Until then, use the copy in this site’s <code>vendor/dynamic/</code> folder.</p>
    </div>
    ${code('lib-html', 'html', 'HTML', `<script src="${CDN}/${SCOPE}/dynamic@${VERSION}/dist/cdn/dynamic.js"></script>\n\n<with-live-icon name="calendar-date" today variant="glass" size="48"></with-live-icon>\n<with-live-icon name="bell-count" count="12" variant="bauhaus"></with-live-icon>\n<with-live-icon name="battery-level" level="0.42" variant="skeuo"></with-live-icon>`)}
  </div>
</section>
<section class="section lv-faq-sec">
  <div class="wrap lv-faq-in">
    <div><p class="eyebrow">Questions</p><h2 class="h2">Live icons, <span class="hand lv-accent">answered</span></h2></div>
    ${faqHtml(libFaq)}
  </div>
</section>`
    const jsonld = [ORG, EVERGROW, SITE_NODE,
      { '@type': 'CollectionPage', '@id': `${canonical}#page`, url: canonical, name: `Live icons: ${N} editable icons`, isPartOf: { '@id': SITE_NODE['@id'] }, inLanguage: 'en',
        description: `Free editable icons: calendars, clocks, batteries, notification badges, labels, weather and progress icons whose date, time, number or text you set. ${NS} styles.`,
        primaryImageOfPage: `${BASE}/live/og/index.png`, breadcrumb: { '@id': `${canonical}#crumbs` }, mainEntity: { '@id': `${canonical}#list` } },
      { '@type': 'ItemList', '@id': `${canonical}#list`, numberOfItems: N, itemListElement: GROUPS.flatMap(g => g.names).map((n, k) => ({ '@type': 'ListItem', position: k + 1, url: `${BASE}/live/${n}.html`, name: BY[n].title })) },
      crumbLd(`${canonical}#crumbs`, [{ name: 'Home', url: `${BASE}/` }, { name: 'Live icons', url: canonical }]),
      faqLd(`${canonical}#faq`, libFaq)]
    return page({
      title: `Editable live icons: calendar, clock, battery | ${BRAND}`,
      description: `Free icons you can edit: set the date on a calendar, the time on a clock, the count on a badge, the charge on a battery or the text on a tag. ${N} live icons in ${NS} styles. Download SVG, PNG, PDF or PowerPoint.`,
      canonical, og: `${BASE}/live/og/index.png`, ogAlt: `Live icons from ${BRAND}: calendars, clocks, batteries and badges in many styles`,
      keywords: 'editable icons, dynamic icons, calendar icon with date, clock icon with time, notification badge icon, battery level icon, weather icon with temperature, label icon, free icons',
      jsonld, main, bodyClass: 'lv-page lv-lib-page s-line', bodyAttr: ' data-search="local"',
    })
  })()
  write('live.html', lib)

  /* ───────────── one page per live icon: site/live/<name>.html ───────────── */
  const order = GROUPS.flatMap(g => g.names)
  const hasToday = i => ['day', 'month', 'weekday', 'time'].some(k => i.params[k])
  const iconFaq = (i, g) => {
    const ps = Object.entries(i.params), first = ps[0]
    const qs = [
      { q: `How do I change the ${short(first[1].label).toLowerCase()} on the ${i.title.toLowerCase()} icon?`, a: `Use the controls next to the preview. ${list(ps.map(([, p]) => short(p.label)))} can all be changed, the icon redraws as you go, and the download uses exactly what you see.` },
      { q: `Is the ${i.title.toLowerCase()} icon free?`, a: `Yes. It is free for personal and commercial use under the MIT license, in all ${NS} styles. No sign-up, no credit needed.` },
      { q: `Can I use it in PowerPoint, Google Slides or Canva?`, a: 'Yes. Download a PNG (see-through background), an SVG or a ready PowerPoint slide, then drag it into your slide or design. SVG stays sharp at any size.' },
      { q: `How do I add it to a website?`, a: `Add the ${SCOPE}/dynamic script and write <code>&lt;with-live-icon name="${i.name}"&gt;</code> with your values as attributes. React and Vue get a <code>LiveIcon</code> component.` },
    ]
    if (hasToday(i)) qs.push({ q: `Can it show today automatically?`, a: `Yes. On a website, add the <code>today</code> attribute: <code>&lt;with-live-icon name="${i.name}" today&gt;</code> reads the visitor’s clock and updates every minute.` })
    return qs
  }
  const controlsNoJs = i => `<table class="lv-ptable"><thead><tr><th scope="col">Setting</th><th scope="col">What you can set</th><th scope="col">Default</th><th scope="col" class="lv-attr">Attribute</th></tr></thead><tbody>${Object.entries(i.params).map(([k, p]) => `<tr><th scope="row">${esc(p.label)}<span class="lv-kind">${kindWord[p.type] || p.type}</span></th><td>${esc(rangeOf(p))}</td><td><code>${esc(defOf(p))}</code></td><td class="lv-attr"><code>${esc(attrOf(k))}</code></td></tr>`).join('')}</tbody></table>`

  // small UI glyphs (inline, stroke = currentColor)
  const ui = d => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`
  const IC = {
    down: ui('<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>'),
    chev: ui('<path d="M7 10l5 5 5-5"/>'),
    copy: ui('<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="3"/><path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5"/>'),
    link: ui('<path d="M10 14a4.2 4.2 0 0 0 6 0l3-3a4.2 4.2 0 0 0-6-6l-1 1"/><path d="M14 10a4.2 4.2 0 0 0-6 0l-3 3a4.2 4.2 0 0 0 6 6l1-1"/>'),
    code: ui('<path d="M8.5 8 4.5 12l4 4M15.5 8l4 4-4 4"/>'),
    brackets: ui('<path d="M8 4H6.5A1.5 1.5 0 0 0 5 5.5v4L3.5 12 5 14.5v4A1.5 1.5 0 0 0 6.5 20H8M16 4h1.5A1.5 1.5 0 0 1 19 5.5v4l1.5 2.5-1.5 2.5v4a1.5 1.5 0 0 1-1.5 1.5H16"/>'),
    palette: ui('<path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.3 0 1.9-1 1.4-2-.6-1.2 0-2.5 1.4-2.5h2a3.7 3.7 0 0 0 3.7-3.7C20.5 7.3 16.7 3.5 12 3.5z"/><circle cx="7.8" cy="11" r="1.1" fill="currentColor"/><circle cx="10.5" cy="7.4" r="1.1" fill="currentColor"/><circle cx="15" cy="7.8" r="1.1" fill="currentColor"/>'),
    x: ui('<path d="M6 6l12 12M18 6 6 18"/>'),
    sun: ui('<circle cx="12" cy="12" r="3.6"/><path d="M12 3v1.8M12 19.2V21M3 12h1.8M19.2 12H21M5.6 5.6l1.3 1.3M17.1 17.1l1.3 1.3M5.6 18.4l1.3-1.3M17.1 6.9l1.3-1.3"/>'),
    undo: ui('<path d="M9 7 4.5 11.5 9 16"/><path d="M5 11.5h9.5a5 5 0 0 1 0 10H12"/>'),
    slides: ui('<rect x="3" y="4.5" width="18" height="12" rx="2.5"/><path d="M12 16.5V20M8.5 20h7"/>'),
    pen: ui('<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z"/><path d="m13.5 6.5 4 4"/>'),
    globe: ui('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.2 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.2-3.5-8.5S9.6 5.9 12 3.5z"/>'),
  }
  // the Download sheet: what it is for -> formats (js/export/*.js ids); copy rows copy instead of downloading
  const DL_GROUPS = [
    { title: 'Slides and documents', icon: IC.slides, items: [
      { x: 'PNG', t: 'PNG picture', say: 'For slides, docs and chat', attr: 'data-fmt="png"', main: true },
      { x: 'PPTX', t: 'PowerPoint slide', say: 'A ready slide with your icon', attr: 'data-fmt="pptx"' },
      { x: 'DOCX', t: 'Word document', say: 'Your icon on a page', attr: 'data-fmt="docx"' },
      { x: 'PDF', t: 'PDF', say: 'Vector, for print', attr: 'data-fmt="pdf"' },
    ] },
    { title: 'Design tools', icon: IC.pen, items: [
      { x: 'SVG', t: 'SVG', say: 'Figma, Canva, Illustrator', attr: 'data-fmt="svg-flat"' },
      { x: 'SVG', t: 'Themable SVG', say: 'Recolour it later in code', attr: 'data-fmt="svg"' },
    ] },
    { title: 'Websites and apps', icon: IC.globe, items: [
      { x: 'WEBP', t: 'WebP picture', say: 'Smaller than PNG', attr: 'data-fmt="webp"' },
      { x: '</>', t: 'Copy SVG code', say: 'Paste straight into HTML', attr: 'data-lv-copy-svg', copy: true },
      { x: 'HTML', t: 'Copy the live element', say: 'One tag, your settings', attr: 'data-lv-copy-el', copy: true },
    ] },
  ]
  const pages = []
  for (const n of order) {
    const i = BY[n], g = G[groupOf[n]], canonical = `${BASE}/live/${n}.html`
    const k = order.indexOf(n), prev = BY[order[(k - 1 + order.length) % order.length]], next = BY[order[(k + 1) % order.length]]
    const crumbItems = [
      { name: 'Home', href: '../index.html', url: `${BASE}/` },
      { name: 'Live icons', href: '../live.html', url: `${BASE}/live.html` },
      { name: g.title, href: `../live.html#g-${g.id}`, url: `${BASE}/live.html#g-${g.id}` },
      { name: i.title, url: canonical },
    ]
    const def = i.defaults || {}
    const faqs = iconFaq(i, g)
    const exSay = e => sayNice(i, e)
    const examples = i.examples.map((e, x) => `<li><button type="button" class="lv-ex" data-ex="${x}" aria-pressed="${x === 0 && Object.keys(i.params).every(k => String(e[k] ?? i.params[k].default) === String(def[k] ?? i.params[k].default))}" aria-label="Use this example: ${esc(exSay(e))}"><span class="lv-ex-art">${svgOf(exInner(n, 'line', x), 'line', { cls: 'lv-svg' })}</span><span class="lv-ex-say">${esc(exSay(e))}</span></button></li>`).join('')
    const sib = siblingsOf(n)
    // related live icons: the group first, then up to two from other groups that share a static sibling
    // (battery percent -> percent badge, clock time -> watch time)
    const cross = order.filter(x => x !== n && groupOf[x] !== groupOf[n] && siblingsOf(x).some(y => sib.includes(y))).slice(0, 2)
    const rel = [...g.names.filter(x => x !== n).slice(0, 6 - cross.length), ...cross]
    const sibHtml = sib.map(x => `<li><a class="lv-rel lv-rel-static" href="../icons/${x}.html"><span class="lv-rel-art">${svgOf(staticInner(x), 'line', { cls: 'lv-svg' })}</span><span>${esc(staticTitle(x))}</span></a></li>`).join('')
    const relHtml = rel.map(x => `<li><a class="lv-rel" href="${x}.html"><span class="lv-rel-art">${svgOf(defaultInner(x, 'line'), 'line', { cls: 'lv-svg' })}</span><span>${esc(BY[x].title)}</span></a></li>`).join('')
    const aka = (i.aliases || []).slice(0, 8)
    const desc = `${i.description.replace(/\.$/, '')}. Free and editable: set ${list(Object.values(i.params).slice(0, 3).map(p => short(p.label).toLowerCase()))}, pick one of ${NS} styles and your colours, then download SVG, PNG, PDF or PowerPoint.`
    const sayDef = sayNice(i, def)
    // the palettes this live icon wears: its plain sibling's (site/data/palettes/<static>.js, forge/PALETTES.md)
    const pal = sib.find(x => fs.existsSync(path.join(SITE, 'data', 'palettes', `${x}.js`))) || ''
    const allStyles = SN.map(s => `<li><button type="button" class="lv-as" data-style="${s}" aria-pressed="${s === SN[0]}" style="--sc:var(--c-${s});--sc-text:var(--c-${s}-text)"><span class="lv-as-art">${svgOf(defaultInner(n, s), s, { cls: 'lv-svg', title: `${i.title} icon, ${STYLE[s].title.toLowerCase()} style` })}</span><span class="lv-as-t"><b>${esc(STYLE[s].title)}</b><small>${esc(STYLE_SAY[s] || '')}</small></span><span class="lv-as-use" aria-hidden="true">Use</span></button></li>`).join('')
    const toc = [
      ['make', 'Make it yours', 'set it, style it, download it'],
      ['styles', `All ${NS} styles`, 'your icon in every style'],
      ['developers', 'For developers', 'HTML, React and Vue'],
      ['settings', 'What you can change', `${Object.keys(i.params).length} setting${Object.keys(i.params).length > 1 ? 's' : ''}, ranges and defaults`],
      ['faq', 'Questions', `${faqs.length} quick answers`],
      ['related', 'Related icons', 'the plain icon and more live ones'],
    ]
    const tabs = ['HTML', 'React', 'Vue']
    const main = `<div class="wrap lv-top">
  ${crumbs(crumbItems)}
</div>
<section class="wrap lv-make" id="make" data-lv-studio="${n}" data-lv-pal="${pal}" aria-labelledby="lv-h1">
  <div class="lv-make-grid">
    <header class="lv-head">
      <p class="lv-eyebrow"><span class="lv-live-dot" aria-hidden="true"></span>Live icon · <a href="../live.html#g-${g.id}">${esc(g.title)}</a> · ${NS} styles · free</p>
      <h1 class="lv-title" id="lv-h1">${esc(i.title)} <span class="hand lv-accent">live icon</span></h1>
      <p class="lv-lede">${esc(i.description)} Set it here, then download it or paste it anywhere.</p>
    </header>
    <div class="lv-col-a">
      <div class="lv-stage" data-lv-stage data-bg="paper">
        <div class="lv-stage-tools">
          <p class="lv-stage-now"><span class="lv-live-dot" aria-hidden="true"></span><span class="visually-hidden">Showing: </span><span data-lv-now>${esc(sayDef)}</span></p>
          <div class="lv-bgs" role="radiogroup" aria-label="Preview background">${['paper', 'white', 'dark', 'grid'].map((b, x) => `<button type="button" role="radio" aria-checked="${x === 0}" tabindex="${x === 0 ? 0 : -1}" data-bg="${b}" class="lv-bg lv-bg-${b}" title="${cap(b === 'grid' ? 'see-through' : b)} background"><span class="visually-hidden">${cap(b === 'grid' ? 'see-through' : b)} background</span></button>`).join('')}</div>
        </div>
        <div class="lv-stage-art"><div class="lv-art" data-lv-art>${svgOf(defaultInner(n, 'line'), 'line', { cls: 'lv-svg', title: `${i.title}: ${sayDef}` })}</div></div>
        <p class="lv-stage-hint" data-lv-hint aria-hidden="true" hidden></p>
        <div class="lv-real" aria-hidden="true" data-lv-real>${[16, 24, 32, 48].map(px => `<span style="--px:${px}px">${svgOf(defaultInner(n, 'line'), 'line', { cls: 'lv-svg' })}<i>${px}</i></span>`).join('')}</div>
      </div>
      <div class="lv-cta lv-js-only">
        <div class="lv-split"><button type="button" class="lv-go" data-lv-go>${IC.down}<span class="lv-go-t"><b>Download PNG</b><small data-lv-go-sum>see-through · 512 px<span class="lv-go-why"> · for slides and docs</span></small></span></button><button type="button" class="lv-go-more" data-lv-open="download" aria-haspopup="dialog" title="SVG, PDF, PowerPoint, Word and more"><span class="visually-hidden">More formats: SVG, PDF, PowerPoint, Word and more</span>${IC.chev}</button></div>
        <button type="button" class="lv-ghost" data-lv-copy-png title="Paste it into Slides, Docs, Notion or a chat">${IC.copy}<span>Copy image</span></button>
      </div>
      <p class="lv-minor lv-js-only"><button type="button" data-lv-share>${IC.link}Copy link to this design</button><button type="button" data-lv-copy-svg>${IC.code}Copy SVG code</button><a href="#developers" data-lv-dev-jump>${IC.brackets}Use it in code</a></p>
      <noscript><p class="lv-note">Editing and downloads need JavaScript. Everything else on this page reads fine without it.</p></noscript>
      <div class="lv-examples">
        <h2 class="lv-label" id="lv-ex-h">Try an example</h2>
        <ul class="lv-ex-list" role="list" aria-labelledby="lv-ex-h">${examples}</ul>
      </div>
    </div>
    <div class="lv-col-b">
      <div class="lv-card lv-set" data-lv-controls>
        <div class="lv-sec-head"><h2 class="lv-label" id="lv-set-h">Set what it shows</h2>${hasToday(i) ? `<button type="button" class="lv-mini" data-lv-today hidden>${IC.sun}Use today</button>` : ''}<button type="button" class="lv-mini" data-lv-reset hidden>${IC.undo}Reset</button></div>
        <noscript>${controlsNoJs(i)}</noscript>
        <div class="lv-ctrls" data-lv-ctrls></div>
      </div>
      <div class="lv-pickwrap">
        <p class="lv-pick-head"><span class="lv-label">Style</span> <b data-lv-style-name>${esc(STYLE[SN[0]].title)}</b> <span class="lv-pick-say" data-lv-style-say aria-live="polite">${esc(STYLE_SAY[SN[0]] || '')}</span></p>
        ${styleSwitcher(n, { cls: 'lv-sb-page', label: `Style for the ${i.title.toLowerCase()} icon` })}
      </div>
      <div class="lv-qcwrap lv-js-only">
        <p class="lv-pick-head"><span class="lv-label">Colour</span> <b data-lv-color-name>Style colours</b></p>
        <div class="lv-qc-row"><div class="lv-qc" data-lv-qc role="radiogroup" aria-label="Colour"></div><button type="button" class="lv-textbtn" data-lv-open="colours" aria-haspopup="dialog">${IC.palette}<span>More colours</span></button></div>
      </div>
    </div>
  </div>
</section>
<details class="lv-map" data-lv-map>
  <summary class="lv-map-btn"><span class="lv-map-ic" aria-hidden="true"><svg viewBox="0 0 36 36" width="36" height="36"><circle class="lv-map-track" cx="18" cy="18" r="16"/><circle class="lv-map-prog" cx="18" cy="18" r="16" pathLength="100" data-lv-map-prog/></svg><i></i><i></i><i></i></span><span class="lv-map-l">On this page</span><span class="lv-map-now" data-lv-map-now aria-hidden="true"></span></summary>
  <nav class="lv-map-card" aria-label="On this page"><p class="lv-map-k">Jump to a section</p><ol>${toc.map(([id, label, sub], x) => `<li><a href="#${id}" data-lv-map-link><span class="lv-map-n" aria-hidden="true">${String(x + 1).padStart(2, '0')}</span><span class="lv-map-t"><b>${esc(label)}</b><small>${esc(sub)}</small></span></a></li>`).join('')}</ol></nav>
</details>
<section class="wrap lv-sec" id="styles" aria-labelledby="h-styles">
  <div class="lv-sec-h"><h2 class="h2" id="h-styles">${esc(i.title)} in <span class="hand lv-accent">all ${NS} styles</span></h2><p>Same values, ${NS} personalities. <span class="lv-js-inline">Pick one to use it above.</span></p></div>
  <ul class="lv-all" role="list" data-lv-all>${allStyles}</ul>
</section>
<section class="wrap lv-sec" id="developers" aria-labelledby="h-dev">
  <details class="lv-dev" data-lv-dev>
    <summary><span class="lv-dev-t"><span class="lv-dev-h" id="h-dev">For developers</span><small>One element or component with your settings: HTML, React or Vue</small></span><span class="lv-dev-plus" aria-hidden="true"></span></summary>
    <div class="lv-dev-body">
      <p class="lv-soon"><b>${SCOPE}/dynamic is launching soon on npm.</b> The code follows everything you set above: values, style, colours and size.</p>
      <div class="lv-dev-bar">
        <div class="lv-tabs" role="tablist" aria-label="Code">${tabs.map((t, x) => `<button type="button" role="tab" id="tab-${t.toLowerCase()}" aria-controls="pane-${t.toLowerCase()}" aria-selected="${x === 0}" tabindex="${x === 0 ? 0 : -1}">${t}</button>`).join('')}</div>
        <div class="lv-dev-size lv-js-only"><label for="lv-size">Size</label><input class="lv-range" id="lv-size" type="range" min="16" max="256" step="4" value="48" data-lv-size><output class="lv-out" data-lv-size-out for="lv-size">48 px</output></div>
      </div>
      <div role="tabpanel" id="pane-html" aria-labelledby="tab-html">${code('html', 'html', 'HTML: any website', htmlSnippet(i, def))}</div>
      <div role="tabpanel" id="pane-react" aria-labelledby="tab-react" class="lv-pane-off">${code('react', 'jsx', 'React', reactSnippet(i, def))}</div>
      <div role="tabpanel" id="pane-vue" aria-labelledby="tab-vue" class="lv-pane-off">${code('vue', 'vue', 'Vue', vueSnippet(i, def))}</div>
      ${hasToday(i) ? `<p class="lv-dev-note">Add <code>today</code> and it shows the visitor’s own date and time, updated every minute: <code>&lt;with-live-icon name="${n}" today&gt;</code></p>` : ''}
    </div>
  </details>
</section>
<section class="wrap lv-sec lv-more" id="settings" aria-labelledby="h-settings">
  <div class="lv-more-col">
    <h2 class="h3" id="h-settings">What you can change</h2>
    ${controlsNoJs(i)}
    ${aka.length ? `<p class="lv-aka"><b>Also called</b> ${aka.map(a => `<span class="tag">${esc(a.replace(/-/g, ' '))}</span>`).join(' ')}</p>` : ''}
  </div>
  <div class="lv-more-col" id="faq">
    <h2 class="h3">Questions</h2>
    ${faqHtml(faqs)}
  </div>
</section>
<section class="wrap lv-related" id="related" aria-labelledby="h-rel">
  ${sib.length ? `<div class="lv-rel-head"><h2 class="h3" id="h-static">The plain ${esc(sib.length > 1 ? 'icons' : 'icon')}</h2><a class="lv-link" href="../icons.html">All static icons ${arrow}</a></div>
  <p class="muted lv-rel-say">The same picture without the part you set, in the static library.</p>
  <ul class="lv-rel-list lv-rel-statics" role="list" aria-labelledby="h-static">${sibHtml}</ul>` : ''}
  <div class="lv-rel-head"><h2 class="h3" id="h-rel">${cross.length ? 'Related' : `More ${esc(g.title.toLowerCase())}`} live icons</h2><a class="lv-link" href="../live.html">All ${N} live icons ${arrow}</a></div>
  <ul class="lv-rel-list" role="list">${relHtml}</ul>
  <nav class="lv-pn" aria-label="Previous and next live icon"><a href="${prev.name}.html" rel="prev"><span>Previous</span><b>${esc(prev.title)}</b></a><a href="${next.name}.html" rel="next"><span>Next</span><b>${esc(next.title)}</b></a></nav>
</section>
<dialog class="lv-sheet" data-lv-sheet aria-labelledby="lv-sheet-h">
  <div class="lv-sheet-in">
    <header class="lv-sheet-head" data-lv-sheet-drag>
      <span class="lv-sheet-grab" aria-hidden="true"></span>
      <div class="lv-sheet-id"><span class="lv-sheet-ic" data-lv-sheet-ic aria-hidden="true"></span><div><h2 class="lv-sheet-h" id="lv-sheet-h">${esc(i.title)} <span>studio</span></h2><p class="lv-sheet-now" data-lv-sheet-now></p></div></div>
      <div class="lv-sheet-modes" role="tablist" aria-label="Studio">${[['colours', 'Colours', IC.palette], ['download', 'Download', IC.down]].map(([m, l, ic], x) => `<button type="button" role="tab" id="lv-mode-${m}" data-lv-mode="${m}" aria-controls="lv-pane-${m}" aria-selected="${x === 0}"${x ? ' tabindex="-1"' : ''}>${ic}<span>${l}</span></button>`).join('')}<span class="lv-sheet-ink" aria-hidden="true"></span></div>
      <button type="button" class="lv-sheet-x" data-lv-close>${IC.x}<span class="visually-hidden">Close the studio</span></button>
    </header>
    <div class="lv-sheet-body" data-lv-sheet-body>
      <div class="lv-sheet-prev"><div class="lv-sheet-stage" data-lv-sheet-stage><div class="lv-sheet-art" data-lv-sheet-art></div></div></div>
      <div class="lv-sheet-pane" id="lv-pane-colours" role="tabpanel" aria-labelledby="lv-mode-colours" data-lv-pane="colours" tabindex="-1">
        <section class="lv-sh-sec" data-lv-pals-sec hidden><h3 class="lv-sh-h">Palettes <small>made for this icon</small></h3><div class="lv-pals" data-lv-pals role="radiogroup" aria-label="Palettes"></div></section>
        <section class="lv-sh-sec"><h3 class="lv-sh-h" data-lv-sw-h>Outline colour</h3><div class="lv-sw" data-lv-sw role="radiogroup" aria-label="Outline colour"></div></section>
        <section class="lv-sh-sec" data-lv-roles-sec hidden><h3 class="lv-sh-h">Every colour <small>tap one to change it</small></h3><div class="lv-colors" data-lv-colors></div></section>
        <p class="lv-sh-reset"><button type="button" class="lv-mini" data-lv-colors-reset hidden>${IC.undo}Back to the style’s own colours</button></p>
      </div>
      <div class="lv-sheet-pane" id="lv-pane-download" role="tabpanel" aria-labelledby="lv-mode-download" data-lv-pane="download" tabindex="-1" hidden>
        <section class="lv-sh-sec"><h3 class="lv-sh-h">What is it for?</h3>
          <div class="lv-dl-groups">${DL_GROUPS.map(gr => `<div class="lv-dl-g"><p class="lv-dl-gl">${gr.icon}${esc(gr.title)}</p><div class="lv-dl-list">${gr.items.map(it => `<button type="button" class="lv-fmt${it.main ? ' is-main' : ''}" ${it.attr}><span class="lv-fmt-x">${esc(it.x)}</span><span class="lv-fmt-t"><b>${esc(it.t)}</b><small>${esc(it.say)}</small></span>${it.copy ? IC.copy : IC.down}</button>`).join('')}</div></div>`).join('')}</div>
        </section>
        <section class="lv-sh-sec lv-sh-row"><h3 class="lv-sh-h" id="lv-px-h">Picture size <small>PNG, WebP, PowerPoint, Word</small></h3><div class="lv-seg lv-px" role="radiogroup" aria-labelledby="lv-px-h">${[256, 512, 1024, 2048].map(px => `<button type="button" role="radio" aria-checked="${px === 512}" tabindex="${px === 512 ? 0 : -1}" data-px="${px}">${px} px</button>`).join('')}</div></section>
        <section class="lv-sh-sec lv-sh-row"><h3 class="lv-sh-h" id="lv-bgx-h">Background</h3><div class="lv-seg lv-bgx" role="radiogroup" aria-labelledby="lv-bgx-h"><button type="button" role="radio" aria-checked="true" tabindex="0" data-bgx="none"><i class="lv-bgx-sw is-none" aria-hidden="true"></i>See-through</button><button type="button" role="radio" aria-checked="false" tabindex="-1" data-bgx="#FFFFFF"><i class="lv-bgx-sw" style="--sw:#FFFFFF" aria-hidden="true"></i>White</button><button type="button" role="radio" aria-checked="false" tabindex="-1" data-bgx="custom"><i class="lv-bgx-sw" data-lv-bgx-sw style="--sw:#FFD23F" aria-hidden="true"></i>Colour</button></div><input class="lv-bgx-in" type="color" value="#FFD23F" data-lv-bgx-in aria-label="Background colour" hidden></section>
      </div>
    </div>
    <footer class="lv-sheet-foot"><p class="lv-sheet-sum" data-lv-sheet-sum aria-live="polite"></p><div class="lv-sheet-acts"><button type="button" class="lv-btn2" data-lv-sheet-next></button><button type="button" class="lv-btn2 is-ink" data-lv-close>Done</button></div></footer>
  </div>
</dialog>`
    const jsonld = [ORG, EVERGROW, SITE_NODE,
      { '@type': 'WebPage', '@id': `${canonical}#page`, url: canonical, name: `${i.title} live icon`, description: desc, isPartOf: { '@id': SITE_NODE['@id'] }, inLanguage: 'en',
        breadcrumb: { '@id': `${canonical}#crumbs` }, primaryImageOfPage: { '@id': `${canonical}#image` }, dateModified: lastmod(n),
        relatedLink: [...sib.map(x => `${BASE}/icons/${x}.html`), ...rel.map(x => `${BASE}/live/${x}.html`)] },
      { '@type': 'ImageObject', '@id': `${canonical}#image`, name: `${i.title} icon`, description: i.description, contentUrl: `${BASE}/live/og/${n}.png`, encodingFormat: 'image/png',
        license: 'https://opensource.org/license/mit', acquireLicensePage: `${BASE}/license.html`, creditText: `${BRAND} (${PUB.name})`, creator: { '@id': ORG['@id'] }, copyrightNotice: `MIT, ${BRAND}`,
        keywords: [...(i.tags || []), ...(i.synonyms || []).slice(0, 8)].join(', ') },
      crumbLd(`${canonical}#crumbs`, crumbItems.map(c => ({ name: c.name, url: c.url }))),
      faqLd(`${canonical}#faq`, faqs)]
    write(`live/${n}.html`, page({
      pre: '../',
      title: (t => t.length <= 62 ? t : `${i.title} icon you can edit | ${BRAND}`)(`${i.title} icon you can edit: free, ${NS} styles | ${BRAND}`),
      description: desc, canonical, og: `${BASE}/live/og/${n}.png`, ogAlt: `${i.title} live icon in several styles`,
      keywords: [i.title.toLowerCase() + ' icon', ...(i.aliases || []).slice(0, 5).map(a => a.replace(/-/g, ' ') + ' icon'), ...(i.synonyms || []).slice(0, 5), 'editable icon', 'free icon'].join(', '),
      jsonld, main, bodyClass: `lv-page lv-icon-page s-line`,
      scripts: `<script src="../js/palette-map.js" defer></script>\n`,
    }))
    pages.push({ url: `live/${n}.html`, title: `${i.title} live icon`, summary: i.description, lastmod: lastmod(n) })
  }
  // drop pages of live icons that no longer exist
  const liveDir = path.join(SITE, 'live')
  for (const f of fs.readdirSync(liveDir)) if (f.endsWith('.html') && !written[`live/${f}`]) fs.rmSync(path.join(liveDir, f))

  // page list for site-seo (sitemap + llms.txt): same { sections: [{ title, pages }] } shape as data/alternatives.json
  write('data/live-pages.json', JSON.stringify({
    sections: [{ title: 'Live icons (editable content)', pages: [
      { url: 'live.html', title: `Live icons: ${N} editable icons`, summary: `Icons whose date, time, number, level or text you set (calendars, clocks, batteries, badges, labels, weather, progress), in ${NS} styles.`, lastmod: fileDate(dataFile), priority: '0.9' },
      ...pages.map(p => ({ ...p, priority: '0.7', img: `${BASE}/live/og/${p.url.slice(5, -5)}.png` })),
    ] }],
  }, null, 1) + '\n')

  /* ───────────── Open Graph cards: site/live/og/*.png ───────────── */
  let ogMade = 0
  if (!NO_OG) {
    let ok = true
    try { await import('@resvg/resvg-js') } catch { ok = false; console.warn('  site-dynamic: @resvg/resvg-js not available, OG images skipped') }
    if (ok) {
      const FONT_DIRS = ['C:/Windows/Fonts', '/usr/share/fonts', '/usr/share/fonts/truetype/dejavu', '/System/Library/Fonts', '/Library/Fonts']
      const want = ['seguibl.ttf', 'segoeuib.ttf', 'segoeui.ttf', 'consola.ttf', 'consolab.ttf', 'DejaVuSans.ttf', 'DejaVuSans-Bold.ttf', 'DejaVuSansMono.ttf']
      const fontFiles = FONT_DIRS.flatMap(d => want.map(f => path.join(d, f))).filter(f => fs.existsSync(f))
      const font = fontFiles.length >= 2 ? { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Segoe UI' } : { loadSystemFonts: true, defaultFontFamily: 'DejaVu Sans' }
      const SANS = "'Segoe UI', 'DejaVu Sans', Arial, sans-serif", MONO = "Consolas, 'DejaVu Sans Mono', monospace"
      const PAPER = '#FBF8F3', INK = '#111318', MUTED = '#5F6573', SUN = '#FFD23F', GOLD = '#B8965A'
      const flat = (s, c) => { // resolve var(--x, fallback) recursively, then currentColor
        let out = s, prev
        do { prev = out; out = out.replace(/var\(\s*--[\w-]+\s*,\s*([^()]*?)\s*\)/g, '$1') } while (out !== prev)
        return out.replace(/currentColor/g, c)
      }
      const nested = (inner, s, x, y, size, c = INK) => `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 24 24" overflow="visible"><g${attrs(Object.fromEntries(Object.entries(STYLE[s].root || {}).map(([k, v]) => [k, typeof v === 'string' ? flat(v, c) : v])))}>${flat(inner, c)}</g></svg>`
      const xe = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      const foot = `<text x="64" y="596" font-family="${MONO}" font-size="20" letter-spacing="1" fill="${MUTED}">withicons.com · live icons · free · MIT · powered by <tspan fill="${GOLD}" font-weight="700">Evergrow</tspan></text>`
      const head = `<rect width="1200" height="630" fill="${PAPER}"/><text x="64" y="84" font-family="${SANS}" font-weight="900" font-size="34" fill="${INK}"><tspan fill="#2F5BFF" font-style="italic">with</tspan>icons</text>`
      const TILE_STYLES = ['line', 'luxe', 'glass', 'bauhaus', 'skeuo', 'sticker'].filter(s => STYLE[s])
      const cards = [['index', () => {
        const pick = HERO.map(h => [h.n, h.s]).concat([['cart-count', 'retro'], ['tag-label', 'gloss'], ['digital-clock', 'pixel'], ['mail-count', 'duo'], ['file-type', 'luxe'], ['dice', 'solid']].filter(([n, s]) => BY[n] && STYLE[s]))
        const grid = pick.slice(0, 12).map(([n, s], k) => { const x = 700 + (k % 4) * 114, y = 76 + Math.floor(k / 4) * 150; const h = HERO.find(z => z.n === n && z.s === s); return `<rect x="${x}" y="${y}" width="100" height="136" rx="26" fill="#FFFFFF" stroke="#E6DFD3" stroke-width="2"/>${nested(h ? heroInner(h) : defaultInner(n, s), s, x + 14, y + 18, 72)}<text x="${x + 50}" y="${y + 120}" text-anchor="middle" font-family="${MONO}" font-size="12" letter-spacing="1.5" fill="${MUTED}">${s.toUpperCase()}</text>` }).join('')
        return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">${head}
<text x="62" y="250" font-family="${SANS}" font-weight="900" font-size="78" letter-spacing="-2" fill="${INK}">Icons that show</text>
<text x="62" y="338" font-family="${SANS}" font-weight="900" font-size="78" letter-spacing="-2" fill="${INK}">your numbers.</text>
<rect x="62" y="360" width="470" height="14" rx="7" fill="${SUN}"/>
<text x="64" y="430" font-family="${SANS}" font-size="28" fill="${MUTED}">${N} live icons · ${NS} styles · set the date, time,</text>
<text x="64" y="468" font-family="${SANS}" font-size="28" fill="${MUTED}">count, level or text, then download</text>
${grid}${foot}</svg>`
      }]]
      for (const i of ICONS) cards.push([i.name, () => {
        const T = i.title, fs1 = Math.min(92, Math.floor(1072 / (T.length * 0.56)))
        const tiles = TILE_STYLES.map((s, k) => { const x = 64 + k * 180, y = 300; const ex = k % Math.max(1, i.examples.length); return `<rect x="${x}" y="${y}" width="164" height="230" rx="34" fill="#FFFFFF" stroke="#E6DFD3" stroke-width="2"/>${nested(exInner(i.name, s, ex), s, x + 22, y + 22, 120)}<text x="${x + 82}" y="${y + 172}" text-anchor="middle" font-family="${SANS}" font-weight="700" font-size="17" fill="${INK}">${xe(sayParams(i, i.examples[ex] || {}).slice(0, 18))}</text><text x="${x + 82}" y="${y + 204}" text-anchor="middle" font-family="${MONO}" font-size="13" letter-spacing="2" fill="${MUTED}">${s.toUpperCase()}</text>` }).join('')
        return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">${head}
<text x="1136" y="84" text-anchor="end" font-family="${MONO}" font-size="20" letter-spacing="3" fill="${MUTED}">LIVE ICON · ${xe(G[groupOf[i.name]].title.toUpperCase())} · EDITABLE</text>
<text x="62" y="210" font-family="${SANS}" font-weight="900" font-size="${fs1}" letter-spacing="-3" fill="${INK}">${xe(T)}</text>
<text x="66" y="262" font-family="${SANS}" font-size="28" fill="${MUTED}">Set ${xe(list(Object.values(i.params).slice(0, 3).map(p => short(p.label).toLowerCase())))} · ${NS} styles</text>
${tiles}${foot}</svg>`
      }])
      const CACHE_DIR = path.join(ROOT, 'node_modules', '.cache', 'withicons-live')
      fs.mkdirSync(CACHE_DIR, { recursive: true })
      const CF = path.join(CACHE_DIR, 'og.json'), cache = readJSON(CF) || {}
      const ogDir = path.join(liveDir, 'og')
      fs.mkdirSync(ogDir, { recursive: true })
      const keep = new Set(), jobs = []
      for (const [key, make] of cards) {
        const svg = make(), h = crypto.createHash('sha1').update('v1/' + svg + JSON.stringify(font.fontFiles || 'sys')).digest('hex'), f = path.join(ogDir, `${key}.png`)
        keep.add(`${key}.png`)
        if (cache[key] !== h || !fs.existsSync(f)) { jobs.push({ svg, file: f }); cache[key] = h }
      }
      if (jobs.length) {
        const threads = Math.max(1, Math.min(6, (os.cpus()?.length || 2) - 1, Math.ceil(jobs.length / 6)))
        await Promise.all(Array.from({ length: threads }, (_, t) => jobs.filter((_, x) => x % threads === t)).map(sl => new Promise((res, rej) => {
          const w = new Worker(SELF, { workerData: { withLiveOg: true, jobs: sl, font } })
          w.once('message', m => { ogMade += m; res(); w.terminate() }); w.once('error', rej)
        })))
      }
      for (const f of fs.readdirSync(ogDir)) if (!keep.has(f)) fs.rmSync(path.join(ogDir, f))
      fs.writeFileSync(CF, JSON.stringify(cache))
    }
  }

  const bytes = Object.values(written).reduce((a, b) => a + b, 0)
  console.log(`site dynamic: live.html + ${pages.length} live icon pages (${(bytes / 1024).toFixed(0)} KB html), ${GROUPS.length} groups, og ${ogMade} new, ` +
    `data/live-pages.json, runtime ${RT ? 'packages/dynamic' : 'examples only'}, ${Date.now() - t0} ms`)
}
