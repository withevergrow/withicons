// Content blocks for blog posts. Every helper returns an HTML string, so a post body is just a template literal:
//   body: `${p('Hello')}${styleRow('rocket')}${figure('fa2', 'A tidy desk')}`
// Icons are rendered at build time from the real forge skeletons, so what readers see is exactly what ships.
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { listIcons, loadIcon, renderIcon, toSvg, readManifest } from '../../forge/lib/load.mjs'
import { specVars } from '../../packages/motion/src/meta.js'

const HERE = path.dirname(fileURLToPath(import.meta.url))
export const IMAGES = JSON.parse(fs.readFileSync(path.join(HERE, '..', 'images.json'), 'utf8'))
// Every with icons style in display order: the 3 everyday interface styles, then the creative ones.
// STYLES holds the ones this checkout can render (filled by useStyles); a style still being built simply isn't drawn yet.
export const ALL_STYLES = ['line', 'solid', 'duo', 'gloss', 'engrave', 'blueprint', 'sketch', 'glass', 'kawaii', 'sticker', 'pixel', 'retro',
  'bauhaus', 'luxe', 'skeuo', 'anime', 'coquette', 'gothic', 'pastel', 'plush']
export const STYLES = []
export const STYLE_LABEL = Object.fromEntries(ALL_STYLES.map(s => [s, s[0].toUpperCase() + s.slice(1)]))
// The headline numbers, in one place. Use these in copy instead of typing numbers.
export const N_ICONS = readManifest().count                // 500
export const N_STYLES = ALL_STYLES.length                  // 20
export const N_SVGS = (N_ICONS * N_STYLES).toLocaleString('en-US') // "10,000"
const ICON_SET = new Set(listIcons())
export const MANIFEST = readManifest()

// styles are loaded once by build.mjs and injected here (top-level await keeps posts synchronous)
let STYLE_MODS = null
export function useStyles(mods) { STYLE_MODS = mods; STYLES.splice(0, STYLES.length, ...ALL_STYLES.filter(s => mods[s])) }

// every image and icon a post touches is recorded so the build only ships what is used
export const used = { images: new Set(), icons: new Set() }

export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// ---------------------------------------------------------------- icons
export function icon(name, style = 'line', size = 24, { label, cls = '' } = {}) {
  if (!ICON_SET.has(name)) throw new Error(`blog: unknown icon "${name}". Pick one from forge/manifest.json`)
  if (!STYLE_MODS?.[style]) throw new Error(`blog: unknown style "${style}"`)
  used.icons.add(name)
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true', focusable: 'false' }
  return toSvg(STYLE_MODS[style], renderIcon(STYLE_MODS[style], loadIcon(name)),
    { width: size, height: size, class: `wi wi-${style} ${cls}`.trim(), ...a11y })
}
const iconHref = name => `../icons/${name}.html`

/** A row of icon tiles, e.g. iconGrid(['home','search','bell'], 'duo', 'A friendly dashboard set') */
export function iconGrid(names, style = 'line', caption = '', { size = 36, links = true } = {}) {
  const tiles = names.map(n => {
    const inner = `${icon(n, style, size)}<span>${esc(n)}</span>`
    return links ? `<a class="b-tile" href="${iconHref(n)}">${inner}</a>` : `<span class="b-tile">${inner}</span>`
  }).join('')
  return `<figure class="b-icons b-icons--${style}"><div class="b-icons__grid">${tiles}</div>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`
}

/** One icon across styles, with labels. Default: every style this checkout can render; pass { styles } for a curated few. */
export function styleRow(name, caption = '', { size = 44, styles = STYLES, motion } = {}) {
  styles = styles.filter(s => STYLES.includes(s))
  // motion: 'hover' makes each style tile play the icon's own hover move (on hover, focus or tap)
  const cells = styles.map(s => motion ? `<div class="b-style wm-trigger" data-style="${s}">${moving(name, s, size, motion)}<span>${STYLE_LABEL[s]}</span></div>` : `<div class="b-style" data-style="${s}">${icon(name, s, size)}<span>${STYLE_LABEL[s]}</span></div>`).join('')
  const all = styles.length >= N_STYLES
  return `<figure class="b-styles${styles.length > 7 ? ' is-many' : ''}${motion ? ' b-motion" data-motion="' + motion : ''}"><div class="b-styles__row">${cells}</div><figcaption>${caption || `The <a href="${iconHref(name)}">${esc(name)}</a> icon, drawn once and rendered ${all ? `in all ${N_STYLES} styles` : `in ${styles.length} of its ${N_STYLES} styles`}.`}</figcaption></figure>`
}

/** Same icons at several sizes, for sizing posts. */
export function sizeRamp(names, sizes = [16, 20, 24, 32, 48], style = 'line', caption = '') {
  const cols = sizes.map(sz => `<div class="b-ramp__col"><div class="b-ramp__icons">${names.map(n => icon(n, style, sz)).join('')}</div><span>${sz}px</span></div>`).join('')
  return `<figure class="b-ramp"><div class="b-ramp__row">${cols}</div>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`
}

// ---------------------------------------------------------------- motion (the site's own runtime, never a CDN)
// Posts that use these blocks get the site's local copy of @withicons/motion (../vendor/motion/motion.css + motion.js);
// build.mjs adds it only to pages whose body contains a `wm` element. Each icon's own motion comes from its spec in
// forge/motion/<name>.json (the same source as the site's icons.css), written inline as CSS variables, so loops and
// hovers already play with the stylesheet alone; blog.js then hands each one to the runtime (hover that finishes,
// `draw` strokes, pausing off-screen) and wires the pause / play controls. Everything stays still under reduced motion.
const MOTION_DIR = path.join(HERE, '..', '..', 'forge', 'motion')
const SPECS = new Map()
export function motionSpec(name) {
  if (!SPECS.has(name)) {
    const f = path.join(MOTION_DIR, `${name}.json`)
    SPECS.set(name, fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null)
  }
  return SPECS.get(name)
}
const slotOnly = (vars, slot) => Object.entries(vars).filter(([k]) => k === `--wm${slot}` || k.startsWith(`--wm${slot}-`)).map(([k, v]) => `${k}:${v}`).join(';')
/** An icon wrapped so it moves with its own motion: trigger 'loop' (always) or 'hover' (hover, focus or tap). */
export function moving(name, style = 'line', size = 24, trigger = 'loop', { label } = {}) {
  const spec = motionSpec(name)
  if (!spec) throw new Error(`blog: icon "${name}" has no motion spec in forge/motion/`)
  const slot = trigger === 'loop' ? 'L' : 'H'
  const runtime = { loop: spec.loop, hover: spec.hover, ...(spec.parts ? { parts: spec.parts } : {}), ...(spec.deco ? { deco: spec.deco } : {}) }
  return `<span class="wm wm-${trigger}" data-wm-trigger="${trigger}" data-wm-spec="${esc(JSON.stringify(runtime))}" style="${slotOnly(specVars(spec), slot)}">${icon(name, style, size, { label })}</span>`
}
/**
 * Tiles whose icons really move, with their own motion. trigger 'loop' plays continuously (with a pause button, as
 * WCAG 2.2.2 asks); 'hover' plays once on hover, keyboard focus or tap.
 *   motionGrid(['loader', 'bell-ring', 'heart'], 'duo', 'Caption', { trigger: 'loop' })
 */
export function motionGrid(names, style = 'line', caption = '', { size = 40, trigger = 'loop', links = true } = {}) {
  const tiles = names.map(n => {
    const inner = `${moving(n, style, size, trigger)}<span>${esc(n)}</span>`
    return links ? `<a class="b-tile wm-trigger" href="${iconHref(n)}">${inner}</a>` : `<span class="b-tile wm-trigger">${inner}</span>`
  }).join('')
  return `<figure class="b-icons b-icons--${style} b-motion" data-motion="${trigger}"><div class="b-icons__grid">${tiles}</div>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`
}
/**
 * "Turn into" pairs: tap (or click) a tile to switch, using the effect from the first icon's spec.
 *   swapGrid([['play', 'pause'], ['heart', 'heart@solid']], 'line', 'Caption')
 */
export function swapGrid(pairs, style = 'line', caption = '', { size = 40 } = {}) {
  const tiles = pairs.map(([a, b, fx]) => {
    const [bn, bs] = b.split('@')
    const effect = fx || motionSpec(a)?.swap?.find(s => s.to === b)?.effect || 'fade'
    const name = bs ? `${bn} (${bs})` : bn
    return `<button type="button" class="b-tile b-swap wm-trigger" data-swap aria-label="Switch ${esc(a)} to ${esc(name)}"><span class="wm-swap wm-fx-${effect}" data-fx="${effect}"><span class="wm-a">${icon(a, style, size)}</span><span class="wm-b">${icon(bn, bs || style, size)}</span></span><span>${esc(a)} <i aria-hidden="true">→</i> ${esc(name)}</span></button>`
  }).join('')
  return `<figure class="b-icons b-icons--${style} b-motion b-motion--swap" data-motion="swap"><div class="b-icons__grid">${tiles}</div>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`
}

// ---------------------------------------------------------------- media
export function img(key, { sizes = '(min-width: 1100px) 760px, 100vw', eager = false, cls = '' } = {}) {
  const m = IMAGES[key]
  if (!m) throw new Error(`blog: unknown image "${key}". See blog/images.json`)
  used.images.add(key)
  return `<img class="${cls}" src="assets/img/${key}-1600.webp" srcset="assets/img/${key}-800.webp 800w, assets/img/${key}-1600.webp 1600w" sizes="${sizes}" width="1600" height="1000" alt="${esc(m.alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`
}
export const credit = key => { const m = IMAGES[key]; return `Photo: <a href="${m.profile}?utm_source=withicons&amp;utm_medium=referral" rel="noopener">${esc(m.by)}</a> on <a href="${m.source}?utm_source=withicons&amp;utm_medium=referral" rel="noopener">Unsplash</a>` }

/** A photo with caption and photographer credit. alt overrides the registry alt text. */
export function figure(key, caption = '', { wide = false } = {}) {
  return `<figure class="b-photo${wide ? ' b-photo--wide' : ''}">${img(key)}<figcaption>${caption ? `<span>${caption}</span>` : ''}<small>${credit(key)}</small></figcaption></figure>`
}

// ---------------------------------------------------------------- text blocks
export const p = html => `<p>${html}</p>`
export const h2 = (text, id) => `<h2 id="${id || slugify(text)}">${text}</h2>`
export const h3 = (text, id) => `<h3 id="${id || slugify(text)}">${text}</h3>`
export const ul = items => `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`
export const ol = items => `<ol>${items.map(i => `<li>${i}</li>`).join('')}</ol>`
export const slugify = s => String(s).replace(/<[^>]+>/g, '').toLowerCase().replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)

const CALLOUT = { tip: ['lightbulb', 'Tip'], note: ['info-circle', 'Good to know'], warn: ['alert-triangle', 'Watch out'], try: ['sparkles', 'Try this'] }
/** callout('tip', 'Use solid icons for the active tab.') or callout('note', html, 'Custom title') */
export function callout(kind, html, title) {
  const [ic, t] = CALLOUT[kind] || CALLOUT.note
  return `<aside class="b-callout b-callout--${kind}">${icon(ic, 'duo', 22)}<div><strong>${title || t}</strong>${html.startsWith('<') ? html : `<p>${html}</p>`}</div></aside>`
}

/** Numbered steps: steps([['Find it', 'Search for “rocket”…'], ['Copy it', '…']]) */
export function steps(items) {
  return `<ol class="b-steps">${items.map(([t, d], i) => `<li><span class="b-steps__n">${i + 1}</span><div><strong>${t}</strong><p>${d}</p></div></li>`).join('')}</ol>`
}

/** Comparison table. cols: header labels; rows: arrays of cells (HTML). Use yes()/no()/meh() in cells. */
export function table(cols, rows, caption = '') {
  // data-label: the column name a cell shows when a phone stacks each row into a card; --cols sets the table's minimum width
  const label = c => esc(String(c).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim())
  const head = `<thead><tr>${cols.map(c => `<th scope="col">${c}</th>`).join('')}</tr></thead>`
  const body = `<tbody>${rows.map(r => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${c}</th>` : `<td data-label="${label(cols[i] ?? '')}"><span>${c}</span></td>`).join('')}</tr>`).join('')}</tbody>`
  const hint = `<p class="b-table__hint" aria-hidden="true">${icon('arrow-right', 'line', 14)}</p>`
  return `<figure class="b-table${cols.length >= 5 ? ' b-table--many' : ''}">${hint}<div class="b-table__box"><div class="b-table__scroll" tabindex="0" role="region" aria-label="${esc(caption.replace(/<[^>]+>/g, '') || 'Comparison table')}"><table style="--cols:${cols.length}">${caption ? `<caption>${caption}</caption>` : ''}${head}${body}</table></div><span class="b-table__fade" aria-hidden="true"></span></div></figure>`
}
export const yes = (t = '') => `<span class="b-mark b-mark--yes">${icon('check-circle', 'solid', 18, { label: 'Yes' })}${t ? ` ${t}` : ''}</span>`
export const no = (t = '') => `<span class="b-mark b-mark--no">${icon('x-circle', 'line', 18, { label: 'No' })}${t ? ` ${t}` : ''}</span>`
export const meh = (t = '') => `<span class="b-mark b-mark--meh">${icon('minus-circle', 'line', 18, { label: 'Partly' })}${t ? ` ${t}` : ''}</span>`

/** Side-by-side verdict for "vs" posts: verdict({ a: ['with icons', [...reasons]], b: ['Font Awesome', [...reasons]] }) */
export function verdict({ a, b, title = 'Which one should you pick?' }) {
  const card = ([name, reasons], cls, ic) => `<div class="b-verdict__card ${cls}"><div class="b-verdict__head">${icon(ic, 'duo', 28)}<span>Pick <strong>${name}</strong> if…</span></div><ul>${reasons.map(r => `<li>${r}</li>`).join('')}</ul></div>`
  return `<section class="b-verdict" aria-label="${esc(title)}"><h3>${title}</h3><div class="b-verdict__grid">${card(a, 'is-a', 'sparkles')}${card(b, 'is-b', 'check-square')}</div></section>`
}

/** Quotable numbers: stats([[N_ICONS, 'icons'], [N_STYLES, 'styles'], [N_SVGS, 'SVGs']]) */
export function stats(items) {
  return `<dl class="b-stats">${items.map(([n, l]) => `<div><dt>${n}</dt><dd>${l}</dd></div>`).join('')}</dl>`
}

/** Pull quote. */
export const quote = (html, cite = '') => `<blockquote class="b-quote"><p>${html}</p>${cite ? `<cite>${cite}</cite>` : ''}</blockquote>`

/** Code sample (escaped). Keep these short: the audience is mostly not developers. */
export const code = (text, lang = 'html') => `<pre class="b-code" data-lang="${lang}"><code>${esc(text.trim())}</code></pre>`

/** Do / Don't pair. */
export function doDont(doHtml, dontHtml) {
  return `<div class="b-dodont"><div class="is-do">${icon('check-circle', 'solid', 22)}<div><strong>Do</strong>${doHtml}</div></div><div class="is-dont">${icon('x-circle', 'solid', 22)}<div><strong>Don’t</strong>${dontHtml}</div></div></div>`
}

/** Mid-article call to action. */
export function cta(title = 'Find your next icon in seconds', text = `${N_ICONS} free icons in ${N_STYLES} styles. Copy, download or drop them into your app. No sign-up, MIT licensed.`, icons = ['rocket', 'sparkles', 'heart', 'palette', 'lightbulb', 'star']) {
  return `<aside class="b-cta"><div class="b-cta__icons" aria-hidden="true">${icons.map((n, i) => icon(n, STYLES[(i + 1) % STYLES.length], 34)).join('')}</div><div class="b-cta__text"><strong>${title}</strong><p>${text}</p></div><a class="btn btn-sun" href="../icons.html">Browse icons ${icon('arrow-right', 'line', 18, { cls: 'arr' })}</a></aside>`
}

// ---------------------------------------------------------------- links (relative from site/blog/)
export const L = {
  icon: (name, text) => `<a href="${iconHref(name)}">${text || name}</a>`,
  icons: (text = 'the icon library') => `<a href="../icons.html">${text}</a>`,
  guide: (app, text) => `<a href="../guides/${app}.html">${text}</a>`,
  alt: (slug, text) => `<a href="../alternatives/${slug}.html">${text}</a>`,
  style: (style, text) => `<a href="../styles/${style}.html">${text || STYLE_LABEL[style] + ' style'}</a>`,
  page: (file, text) => `<a href="../${file}">${text}</a>`,
  post: (slug, text) => `<a href="${slug}.html">${text}</a>`,
  ext: (url, text) => `<a href="${url}" rel="noopener">${text}</a>`,
}

// ---------------------------------------------------------------- comparisons with the real rival icons
import { RIVALS, CONCEPTS as RIVAL_CONCEPTS, rivalIcon, rivalCredit } from './rivals.mjs'
export { RIVALS, RIVAL_CONCEPTS }

/**
 * Side-by-side "face-off": our icon above theirs, for the same everyday ideas, with both names.
 *   faceOff('lucide')                                   12 everyday icons, our line vs their main style
 *   faceOff('phosphor', { variant: 'duotone', ourStyle: 'duo', concepts: ['home', 'heart', 'star', 'bell'] })
 * Concepts: home search settings user bell mail heart trash calendar shopping-cart star download
 */
export function faceOff(lib, { concepts = RIVAL_CONCEPTS, variant, ourStyle = 'line', caption = '', size = 32 } = {}) {
  const r = RIVALS[lib]; variant ||= r.main
  const cols = concepts.map(c => {
    const theirs = rivalIcon(lib, c, variant, size)
    return `<div class="b-face__pair"><a class="b-face__us" href="../icons/${c}.html" title="with icons: ${c}">${icon(c, ourStyle, size)}<code>${c}</code></a><span class="b-face__them"${theirs ? '' : ' data-missing'}>${theirs || `<span class="b-face__none">not in free set</span>`}<code>${esc(r.names[c])}</code></span></div>`
  }).join('')
  return `<figure class="b-face"><div class="b-face__legend"><span><i class="is-us"></i>with icons · ${STYLE_LABEL[ourStyle]}</span><span><i class="is-them"></i>${r.name} · ${r.variants[variant]}</span></div><div class="b-face__grid" style="--cols:${concepts.length <= 7 ? concepts.length : concepts.length % 4 === 0 && concepts.length < 12 ? 4 : 6}">${cols}</div><figcaption>${caption ? `<span>${caption}</span>` : ''}<small>${rivalCredit(lib)}</small></figcaption></figure>`
}

/** Every style/weight a rival offers for a few icons, as labelled rows: rivalStyles('phosphor', ['home', 'heart', 'star']) */
export function rivalStyles(lib, concepts = ['home', 'heart', 'star', 'bell'], caption = '') {
  const r = RIVALS[lib]
  const rows = Object.entries(r.variants).map(([v, label]) => `<div class="b-rstyles__row"><span>${label}</span><div>${concepts.map(c => rivalIcon(lib, c, v, 30) || '<i class="b-face__none" title="not in the free set">–</i>').join('')}</div></div>`).join('')
  return `<figure class="b-rstyles"><div class="b-rstyles__head">${r.name}: the styles you get</div>${rows}<figcaption>${caption ? `<span>${caption}</span>` : ''}<small>${rivalCredit(lib)}</small></figcaption></figure>`
}

/**
 * Pros and cons as short, friendly paragraphs (not a table).
 *   prosCons('Lucide', { pros: [['Huge and growing', 'Over 1,800 icons...'], ...], cons: [['Only one style', '...']] })
 */
export function prosCons(name, { pros = [], cons = [], lib } = {}) {
  const badge = lib && RIVALS[lib] ? rivalIcon(lib, 'star', RIVALS[lib].main, 22) : icon('sparkles', 'duo', 22)
  const items = (list, ic) => list.map(([lead, text]) => `<div class="b-pc__item">${icon(ic[0], ic[1], 20)}<p><strong>${lead}.</strong> ${text}</p></div>`).join('')
  return `<section class="b-pc" aria-label="${esc(name)}: pros and cons"><div class="b-pc__head">${badge}<span>${name}</span></div><div class="b-pc__cols"><div class="b-pc__col is-pro"><h4>What’s great</h4>${items(pros, ['check-circle', 'solid'])}</div><div class="b-pc__col is-con"><h4>What to keep in mind</h4>${items(cons, ['alert-circle', 'line'])}</div></div></section>`
}
