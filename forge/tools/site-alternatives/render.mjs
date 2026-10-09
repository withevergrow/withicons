// Shared building blocks for the alternatives / free-icon landers (owner: alternatives agent).
// Reuses the content-page shell from ../site-pages/lib.mjs (header, footer, head, JSON-LD) without editing it.
import { icon, esc, page, write, cvar, code, ORIGIN, STYLES, ICON_NAMES, META, N_ICONS, N_STYLES, styleTitle, MOTION, motionVars } from '../site-pages/lib.mjs'
import { motionAssets } from '../site-pages/motion.mjs'
import { STYLE_GROUPS, FEATURED } from '../style-groups.mjs'

export { icon, esc, write, cvar, code, ORIGIN, STYLES, ICON_NAMES, META }
export const CHECKED = '2026-10-01'
export const CHECKED_HUMAN = '1 October 2026'
export const I = (n, s = 'line', size = 24, cls = '') => icon(n, s, { size, cls })
export const STYLE_TITLE = Object.fromEntries(STYLES.map(s => [s, styleTitle(s)]))
const HAS = new Set(ICON_NAMES)
export const has = n => HAS.has(n)
export const assertIcons = (names, where) => { for (const n of names) if (!HAS.has(n)) throw new Error(`${where}: unknown icon "${n}"`) }
export const strip = s => String(s).replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim()

const SEARCH_SCRIPTS = ['vendor/with/search.js', 'data/search-index.js', 'js/style-picker.js', 'js/alternatives.js']
const MOTION_SCRIPTS = () => motionAssets().js

/** Page shell: the shared content-page layout + css/alternatives.css (+ search engine scripts when asked). */
export function shell(o) {
  const depth = o.path.split('/').length - 1
  const p = '../'.repeat(depth)
  let html = page({ ...o, styles: [...(o.motion ? motionAssets().css : []), 'css/style-picker.css'], scripts: [...(o.motion ? MOTION_SCRIPTS() : []), ...(o.search === false ? ['js/style-picker.js', 'js/alternatives.js'] : SEARCH_SCRIPTS)], bodyClass: 'ax ' + (o.bodyClass || '') })
  html = html.replace(`<link rel="stylesheet" href="${p}css/pages.css">`, `<link rel="stylesheet" href="${p}css/pages.css">\n  <link rel="stylesheet" href="${p}css/alternatives.css">\n  <link rel="alternate" type="text/plain" title="llms.txt" href="${p}llms.txt">`)
  if (o.modified) html = html.replace('<meta name="robots"', `<meta property="article:modified_time" content="${o.modified}">\n  <meta name="robots"`)
  write(o.path, html)
  return html
}

export const webPageLd = ({ path, name, description, about }) => ({
  '@type': 'WebPage', '@id': ORIGIN + '/' + path, url: ORIGIN + '/' + path, name, description,
  inLanguage: 'en', dateModified: CHECKED, isPartOf: { '@type': 'WebSite', name: 'with icons', url: ORIGIN + '/' },
  publisher: { '@type': 'Organization', name: 'Evergrow', url: 'https://withevergrow.com' },
  ...(about ? { about } : {}),
})
export const faqLd = qs => ({ '@type': 'FAQPage', mainEntity: qs.map(([q, a]) => ({ '@type': 'Question', name: strip(q), acceptedAnswer: { '@type': 'Answer', text: strip(a) } })) })

export function faqBlock(id, qs, title = 'Questions people ask') {
  return `<section class="ax-faq" aria-labelledby="${id}">
  <div class="ax-sec-head"><p class="ax-kicker">FAQ</p><h2 id="${id}">${title}</h2></div>
  <div class="ax-faq-list">
    ${qs.map(([q, a], i) => `<details class="pg-qa"${i === 0 ? ' open' : ''}><summary>${q}</summary><div><p>${a}</p></div></details>`).join('\n    ')}
  </div>
</section>`
}

/** "Short answer" card at the top of a page: the GEO-friendly, quotable summary. */
export const humanDate = iso => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
export function answer(html, { tag = 'Short answer', checked = true, date = [CHECKED, CHECKED_HUMAN] } = {}) {
  return `<div class="ax-answer" data-reveal>
    <span class="ax-answer-tag">${tag}</span>
    <p>${html}</p>
    ${checked ? `<p class="ax-checked">${I('calendar-check', 'line', 16)} Facts checked <time datetime="${date[0]}">${date[1]}</time></p>` : ''}
  </div>`
}

/**
 * Icon picker: curated grid (rendered here in Line) + search across the whole set + style, colour and click action.
 * motion: true wraps each tile's icon in its own hover animation (forge/motion specs; the tile is the wm-trigger).
 * groups: [[title|null, [names]]]; actions: subset of svg|png|dl|dlsvg|class|jsx|vue (first = default)
 */
export function picker({ id, p, groups, actions = ['svg', 'png', 'dl'], styles = STYLES, style = 'line', placeholder = `Search all ${N_ICONS}, e.g. “throw away”`, colors = true, q = '', heading, intro, size = 32, px = 512, motion = false, studio = '', lead = [] }) {
  const pxs = actions.some(a => a === 'png' || a === 'dl') ? [256, 512, 1024] : actions.includes('gif') ? [128, 256, 512] : []
  for (const [, names] of groups) assertIcons(names, 'picker ' + id)
  const ACT = { svg: ['Copy SVG', 'copy'], png: ['Copy PNG', 'image'], dl: ['Download PNG', 'download'], dlsvg: ['Download SVG', 'download'], class: ['Copy <i> tag', 'code'], jsx: ['Copy JSX', 'braces'], vue: ['Copy for Vue', 'code'], anim: ['Animated SVG', 'sparkles'], gif: ['GIF for slides', 'film'] }
  const HINT = { anim: 'make an animated SVG', gif: 'make a GIF for your slides, in the quality you pick', svg: 'copy it as SVG', png: 'copy it as a PNG image', dl: 'download a PNG', dlsvg: 'download the SVG file', class: 'copy its <i> tag', jsx: 'copy it as JSX for React', vue: 'copy it for a Vue template' }
  const COLORS = [['Ink', '#111318'], ['White', '#FFFFFF'], ['Cobalt', '#2F5BFF'], ['Tomato', '#FF5A36'], ['Violet', '#7B5CFF'], ['Leaf', '#22A861'], ['Gold', '#C9962B']]
  const mo = n => { const m = motion && MOTION[n] && (MOTION[n].hover || MOTION[n].loop); if (!m) return ''; const v = motionVars(m); return ` wm wm-hover wm-p-${m.preset}"${v ? ` style="${v}"` : ''} data-wm-preset="${m.preset}` }
  // a tile: the button runs the click action (copy / download); the name is a real link to the icon's page and the corner
  // chip opens that page with the studio (Customize) already open, in the style shown here. Plain <a href>s: crawlable,
  // and they work without JavaScript.
  const qs = s => s && s !== 'line' ? `?style=${s}` : ''
  const czHash = motion ? '#studio-motion' : '#studio'
  const tile = n => `<li class="ax-cell${motion ? ' wm-trigger' : ''}"><button class="ax-tile" type="button" data-name="${n}"><span class="ax-tile-ic${mo(n)}">${I(n, style, size)}</span><span class="pg-sr">${n}</span></button><a class="ax-tile-n" href="${p}icons/${n}.html" data-icon-link>${n}<span class="pg-sr"> icon page</span></a><a class="ax-tile-cz" href="${p}icons/${n}.html${qs(style)}${czHash}" data-studio-link title="Customize in the studio">${I('sliders', 'line', 14)}<span class="pg-sr">Customize ${n} in the studio</span></a></li>`
  const grid = groups.map(([t, names]) => `${t ? `<li class="ax-grid-h" role="presentation">${t}</li>` : ''}${names.map(tile).join('')}`).join('')
  return `<section class="ax-pick" id="${id}" data-picker${motion ? ' data-pick-motion' : ''} data-style="${style}" data-act="${actions[0]}" data-px="${px}" data-root="${p}"${q ? ` data-q="${esc(q)}"` : ''} aria-labelledby="${id}-h">
  ${heading ? `<div class="ax-sec-head"><h2 id="${id}-h">${heading}</h2>${intro ? `<p>${intro}</p>` : ''}</div>` : `<h2 class="pg-sr" id="${id}-h">Icons</h2>`}
  <div class="ax-pick-box">
    <div class="ax-pick-bar">
      <label class="ax-pick-search"><span class="pg-sr">Search icons</span>${I('search', 'line', 20)}<input type="search" data-pick-q placeholder="${esc(placeholder)}" autocomplete="off" spellcheck="false"${q ? ` value="${esc(q)}"` : ''}></label>
      <div class="ax-pick-row">
        <div class="ax-seg ax-styles" role="group" aria-label="Icon style" data-pick-styles="${landerStyles(style, styles, lead).slice(0, 8).join(',')}" data-icon="${groups[0][1][0]}">${landerStyles(style, styles, lead).slice(0, 6).map(s => `<button type="button" class="chip s-${s}" data-pick-style="${s}" aria-pressed="${s === style}">${STYLE_TITLE[s] || styleTitle(s)}</button>`).join('')}</div>
      </div>
      <div class="ax-pick-row">
        <div class="ax-seg ax-acts" role="group" aria-label="When I click an icon">${actions.map((a, i) => `<button type="button" class="ax-act" data-pick-act="${a}" aria-pressed="${i === 0}">${I(ACT[a][1], 'line', 16)}${esc(ACT[a][0])}</button>`).join('')}</div>
        ${colors ? `<div class="ax-colors" role="group" aria-label="Colour">${COLORS.map(([n, c], i) => `<button type="button" class="ax-sw" data-pick-color="${c}" style="--sw:${c}" aria-pressed="${i === 0}" title="${n}"><span class="pg-sr">${n}</span></button>`).join('')}<label class="ax-sw ax-sw-custom" title="Any colour"><span class="pg-sr">Any colour</span><input type="color" value="#111318" data-pick-custom data-wikit></label></div>` : ''}
        ${pxs.length ? `<div class="ax-seg ax-px" role="group" aria-label="PNG size">${pxs.map(x => `<button type="button" class="ax-act" data-pick-px="${x}" aria-pressed="${x === px}">${x} px</button>`).join('')}</div>` : ''}
      </div>
    </div>
    <p class="ax-pick-status" data-pick-status aria-live="polite">Click an icon to <b data-pick-hint>${esc(HINT[actions[0]] || ACT[actions[0]][0].toLowerCase())}</b>. <span data-pick-tail>Its name opens its page; <span class="ax-cz-glyph">${I('sliders', 'line', 14)}</span> opens it in the studio.</span></p>
    <ul class="ax-grid" data-pick-grid>${grid}</ul>
    <p class="ax-pick-empty" data-pick-empty hidden>No icons match yet. Try a simpler word, or <a href="${p}icons.html">browse all ${N_ICONS}</a>.</p>
    <noscript><p class="pg-note">Turn on JavaScript to search and copy here, or click an icon’s name to open its page with copy and download buttons.</p></noscript>
    <div class="ax-pick-more">
      <p><b>Want to change it first?</b> Every icon has its own page with all ${N_STYLES} styles and every format, and a studio for its colours, stroke${motion ? ', motion' : ''} and size.</p>
      <div class="ax-pick-more-go">
        <a class="btn btn-ink" href="${p}icons.html${qs(style)}" data-browse-link>Browse all ${N_ICONS} icons <svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
        <a class="btn btn-ghost" href="${p}icons/${studio || groups[0][1][0]}.html${qs(style)}${czHash}" data-studio-link>${I('sliders', 'line', 18)}Open the icon studio</a>
      </div>
    </div>
  </div>
</section>`
}

/** The styles a lander offers first: its own style, that style's group, then the Popular ones (FEATURED). */
export function landerStyles(style = 'line', styles = STYLES, lead = []) {
  const g = STYLE_GROUPS.find(x => x.styles.includes(style))
  return [...new Set([style, ...lead, ...(g ? g.styles : []), ...FEATURED, ...styles])].filter(s => styles.includes(s))
}

/** Link to an icon's page, in the style it is shown in (the page opens on that style; its canonical URL stays clean). */
export const iconHref = (p, n, s) => `${p}icons/${n}.html${s && s !== 'line' ? `?style=${s}` : ''}`
/** A showcase icon as a link to its page (demo rows, motion wall): the visible drawing plus a hidden, readable label. */
export const iconLink = (p, n, s, inner, attrs = '') => `<a href="${iconHref(p, n, s)}"${attrs} title="${n} icon">${inner}<span class="pg-sr">${n} icon</span></a>`

/** List of links to the other alternatives pages (footer-independent). */
export function altLinks(p, libs, current, title = 'More icon library alternatives') {
  return `<nav class="ax-links" aria-label="${esc(title)}">
  <h2>${title}</h2>
  <ul>${libs.filter(l => l.slug !== current).map(l => `<li><a href="${p}alternatives/${l.slug}.html"><span>${esc(l.name)} alternative</span>${I('arrow-right', 'line', 16)}</a></li>`).join('')}<li><a class="is-hub" href="${p}alternatives/index.html"><span>Compare all libraries</span>${I('layout-grid', 'line', 16)}</a></li></ul>
</nav>`
}

export function freeLinks(p, landers, current, title = 'Free icons for…') {
  return `<nav class="ax-links ax-links-free" aria-label="${esc(title)}">
  <h2>${title}</h2>
  <ul>${landers.filter(l => l.slug !== current).map(l => `<li><a href="${p}free/${l.slug}.html"><span>${esc(l.short)}</span>${I('arrow-right', 'line', 16)}</a></li>`).join('')}<li><a class="is-hub" href="${p}free/index.html"><span>All free icon pages</span>${I('layout-grid', 'line', 16)}</a></li></ul>
</nav>`
}

export function cta(p, { title = 'Find your icon in seconds', text = `${N_ICONS} free icons, ${N_STYLES} styles, no account. Copy, download or drag them into your work.` } = {}) {
  return `<section class="pg-cta" data-reveal>
  <h2>${title}</h2>
  <p>${text}</p>
  <a class="btn btn-ink btn-lg" href="${p}icons.html">Browse all icons <svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
</section>`
}

/** Style strip used in heroes: one icon in every style. */
export const styleStrip = (n, size = 40) => `<div class="ax-strip" aria-hidden="true">${STYLES.map((s, i) => `<span class="s-${s}" style="--i:${i}">${I(n, s, size)}</span>`).join('')}</div>`

/** Average byte size of a style's standalone SVG (for factual copy), and the raw SVG text of one icon. */
import { rawSvg } from '../site-pages/lib.mjs'
export function rawSvgSize(style = 'line') {
  let t = 0
  for (const n of ICON_NAMES) t += Buffer.byteLength(rawSvg(n, style))
  return Math.round(t / ICON_NAMES.length / 10) * 10
}
rawSvgSize.raw = (n, style = 'line') => rawSvg(n, style)
