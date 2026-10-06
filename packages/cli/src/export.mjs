// `withicons export` — write icon files (SVG, PDF, EPS, PNG, ICO, favicon pack, Android, iOS, React/Vue/Svelte/
// React Native/Angular components, HTML, CSS, data URIs, PowerPoint, Word, Lottie, animated GIF / APNG / SVG, animated
// PowerPoint) for developers, CI and AI agents. Also the engine behind the MCP server's export_icon tool.
// The format code is the website's own: site/js/export/*.js (dependency-free UMD modules), bundled into dist/cli.mjs,
// so a file from the CLI is byte-for-byte the file the site's download button makes (PNG encoding aside).
// PNG-based and animated formats need a rasterizer: @resvg/resvg-js, an optional dependency loaded on first use.
// Animated frames: @withicons/motion's frameSvg (the same keyframes as the site) -> freeze.mjs (paused CSS -> attributes,
// since resvg does not run CSS animation) -> resvg RGBA -> the site's own GIF / APNG encoders (animated.js).
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import WE from '../../../site/js/export/registry.js'
import vector from '../../../site/js/export/vector.js'
import code from '../../../site/js/export/code.js'
import app from '../../../site/js/export/app.js'
import office from '../../../site/js/export/office.js'
import lottie from '../../../site/js/export/lottie.js'
import animated from '../../../site/js/export/animated.js'
import { frameSvg, exportDuration, resolveMotion, animatedSvg } from '../../motion/dist/export.js'
import { freezeSvg } from './freeze.mjs'

vector(WE); code(WE); app(WE); office(WE); lottie(WE)

// ---- animated frames in Node: the site's frame sampler + encoders with an injected rasteriser ----
const bboxCache = new Map()
// kind 'fill' = the geometry (transform-box: fill-box), 'stroke' = with strokes (clip-path's default stroke-box)
function bbox(fragment, kind = 'fill') {
  const key = kind + '|' + fragment
  if (bboxCache.has(key)) return bboxCache.get(key)
  let b = null
  try {
    const R = new ResvgClass(fragment), r = kind === 'stroke' ? R.getBBox() : R.innerBBox()
    if (r && r.width > 0 && r.height > 0) b = [r.x, r.y, r.width, r.height]
  } catch { /* unmeasurable: view box */ }
  if (bboxCache.size > 2000) bboxCache.clear()
  bboxCache.set(key, b)
  return b
}
/** SVG (may hold paused CSS animations) -> straight-alpha RGBA, px x px, optionally over a solid background. */
export function rasterRGBA(svg, px, background) {
  if (!ResvgClass) throw new ExportError(RENDERER_HINT, 'missing_renderer')
  const img = new ResvgClass(freezeSvg(svg, { bbox }), { fitTo: { mode: 'width', value: px }, font: { loadSystemFonts: false }, ...(background ? { background } : {}) }).render()
  const p = img.pixels, w = img.width, h = img.height, out = new Uint8ClampedArray(px * px * 4)
  // resvg pixels are premultiplied; the encoders (like canvas getImageData) work on straight alpha
  for (let y = 0; y < Math.min(h, px); y++) for (let x = 0; x < Math.min(w, px); x++) {
    const i = (y * w + x) * 4, j = (y * px + x) * 4, a = p[i + 3]
    if (!a) continue
    if (a === 255) { out[j] = p[i]; out[j + 1] = p[i + 1]; out[j + 2] = p[i + 2] }
    else { out[j] = Math.min(255, Math.round(p[i] * 255 / a)); out[j + 1] = Math.min(255, Math.round(p[i + 1] * 255 / a)); out[j + 2] = Math.min(255, Math.round(p[i + 2] * 255 / a)) }
    out[j + 3] = a
  }
  return out
}
animated.register(WE, { motion: { frameSvg, exportDuration, resolveMotion, animatedSvg }, raster: rasterRGBA })

// ---- PNG formats the site draws with a canvas: same output contract, rendered with resvg here ----
const PNG_SCALES = [1, 2, 3, 4]
function pngSetReadme(ctx, base, names, bg) {
  const t = `${ctx.title || ctx.name} (${ctx.style} style) - PNG set from with icons (withicons.com)`
  const line = (n, s) => `  ${n.padEnd(34)}${base * s} x ${base * s} px  (@${s}x)`
  return [t, '='.repeat(t.length), '',
    `The same icon at ${base} px drawn at 1x, 2x, 3x and 4x, each rendered sharp at its own size (not scaled up).`,
    bg ? `Background: solid ${bg}.` : 'Background: transparent.', '', 'Files', '-----',
    ...names.map((n, i) => line(n, PNG_SCALES[i])), '',
    'Which one do I use?', '-------------------',
    '* iOS / macOS (Xcode): drag the @1x, @2x and @3x files into one Image Set in your asset catalog.',
    '* Android: drawable-mdpi = @1x, drawable-xhdpi = @2x, drawable-xxhdpi = @3x, drawable-xxxhdpi = @4x',
    `  (rename each to the same file name, e.g. ic_${String(ctx.name).replace(/-/g, '_')}.png). A VectorDrawable (--format android) is usually better.`,
    `* Websites: <img src="${names[0]}" srcset="${names[1]} 2x, ${names[2]} 3x" width="${base}" height="${base}" alt="${String(ctx.title || ctx.name).replace(/"/g, '')}">`,
    '  (An SVG is even better on the web: one small file, sharp at every size.)',
    '* Slides, docs, email, chat: use @2x (or @4x for large on-screen use and printing).', '',
    'License: see https://withicons.com/license.html', ''].join('\r\n')
}
const pngOf = (ctx, px, opts) => Promise.resolve(WE.renderPng(WE.vector.flatSvg(ctx, { size: px, background: opts.background || null, padding: opts.padding }), px, px))
WE.register({
  id: 'png', label: 'PNG', ext: 'png', mime: 'image/png', group: 'image', transparent: true, animated: false,
  note: 'A picture for slides, docs, chat and design tools, with a see-through background (default 512 px).',
  available: () => typeof WE.renderPng === 'function',
  run: async (ctx, opts = {}) => {
    const px = Math.max(1, Math.min(8192, Math.round(Number(opts.size) || 512)))
    return { data: await pngOf(ctx, px, opts), filename: WE.filename(ctx, String(px), 'png'), mime: 'image/png' }
  },
})
WE.register({
  id: 'png-set', label: 'PNG set (@1x-@4x)', ext: 'zip', mime: 'application/zip', group: 'image', transparent: true, animated: false,
  note: 'One ZIP with the icon at 1x, 2x, 3x and 4x (default 24 px base) plus a README on which file goes where.',
  available: () => typeof WE.renderPng === 'function',
  run: async (ctx, opts = {}) => {
    const base = Math.max(1, Math.min(2048, Math.round(Number(opts.size) || 24)))
    const stem = WE.filename(ctx, null, 'png').replace(/\.png$/, '')
    const names = PNG_SCALES.map(s => stem + (s === 1 ? '' : `@${s}x`) + '.png')
    const files = []
    for (let i = 0; i < PNG_SCALES.length; i++) files.push({ name: names[i], data: await pngOf(ctx, base * PNG_SCALES[i], opts) })
    files.push({ name: 'README.txt', data: pngSetReadme(ctx, base, names, opts.background || null) })
    return { data: WE.zip(files), filename: WE.filename(ctx, base + 'px-set', 'zip'), mime: 'application/zip' }
  },
})

// ---- the formats the CLI offers (everything that does not need a browser) ----
export const EXPORT_FORMATS = ['svg', 'svg-flat', 'pdf', 'eps', 'png', 'png-set', 'ico', 'favicon-pack', 'android', 'ios',
  'jsx', 'tsx', 'vue', 'svelte', 'react-native', 'angular', 'html', 'css', 'data-uri', 'base64',
  'pptx', 'pptx-sheet', 'docx', 'lottie', 'dotlottie', 'gif', 'apng', 'animated-svg', 'pptx-animated']
export const NEEDS_PNG = new Set(['png', 'png-set', 'ico', 'favicon-pack', 'pptx', 'pptx-sheet', 'docx', 'gif', 'apng', 'pptx-animated'])
// formats that play the motion as frames (rendered here, frame by frame)
export const FRAME_FORMATS = new Set(['gif', 'apng', 'pptx-animated'])
const ALIASES = { flat: 'svg-flat', 'svg-baked': 'svg-flat', themable: 'svg', react: 'jsx', 'react-ts': 'tsx', typescript: 'tsx', rn: 'react-native',
  native: 'react-native', ng: 'angular', datauri: 'data-uri', uri: 'data-uri', b64: 'base64', favicon: 'favicon-pack', favicons: 'favicon-pack',
  xcode: 'ios', imageset: 'ios', vectordrawable: 'android', 'vector-drawable': 'android', powerpoint: 'pptx', ppt: 'pptx', slides: 'pptx',
  word: 'docx', doc: 'docx', json: 'lottie', 'lottie-json': 'lottie', '.lottie': 'dotlottie', pngs: 'png-set', retina: 'png-set', ps: 'eps', postscript: 'eps',
  'animated-gif': 'gif', 'gif-animated': 'gif', 'animated-png': 'apng', 'png-animated': 'apng', 'svg-animated': 'animated-svg', 'animated-svgs': 'animated-svg',
  'pptx-gif': 'pptx-animated', 'animated-pptx': 'pptx-animated', 'powerpoint-animated': 'pptx-animated', 'animated-powerpoint': 'pptx-animated',
  'slides-animated': 'pptx-animated', 'animated-slides': 'pptx-animated', keynote: 'pptx-animated', 'google-slides': 'pptx-animated' }
// formats the website makes in your browser (canvas, video encoders): not available from the terminal
const BROWSER_ONLY = { webp: 'WebP', jpg: 'JPG', jpeg: 'JPG', avif: 'AVIF', 'webp-animated': 'animated WebP', 'animated-webp': 'animated WebP',
  webm: 'WebM video', mp4: 'MP4 video', video: 'video', 'png-sequence': 'PNG frames' }
const BROWSER_HINT = { 'animated WebP': 'gif or apng', 'WebM video': 'gif, apng or pptx-animated', 'MP4 video': 'gif, apng or pptx-animated', video: 'gif, apng or pptx-animated', 'PNG frames': 'apng' }
// one file per icon, whatever the style (it already holds every style)
const PER_ICON = new Set(['pptx-sheet'])
const TRIGGERS = ['loop', 'hover', 'once', 'inview']

export class ExportError extends Error {
  constructor(message, code, usage = false, extra = {}) { super(message); this.name = 'ExportError'; this.code = code; this.usage = usage; Object.assign(this, extra) }
}

export function parseFormats(value) {
  const list = String(value || 'svg').toLowerCase().split(/[\s,]+/).filter(Boolean)
  const out = []
  for (const raw of list) {
    if (raw === 'all') { out.push(...EXPORT_FORMATS); continue }
    const f = ALIASES[raw] || raw
    if (BROWSER_ONLY[f]) {
      const alt = BROWSER_HINT[BROWSER_ONLY[f]]
      throw new ExportError(`${BROWSER_ONLY[f]} is made in your browser (it needs the browser's ${/video/i.test(BROWSER_ONLY[f]) ? 'video' : 'image'} encoder): download it from the icon's page on https://withicons.com.` +
        (alt ? ` From the terminal, the animated formats are ${alt}.` : '') + ` Terminal formats: ${EXPORT_FORMATS.join(', ')}`, 'browser_only', true)
    }
    if (!EXPORT_FORMATS.includes(f)) throw new ExportError(`unknown format "${raw}". Formats: ${EXPORT_FORMATS.join(', ')} (or all)`, 'unknown_format', true, { formats: EXPORT_FORMATS })
    out.push(f)
  }
  return [...new Set(out)]
}

const HEX = /^#?(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const NAMED_HEX = { black: '#000000', white: '#ffffff', red: '#ff0000', lime: '#00ff00', green: '#008000', blue: '#0000ff', yellow: '#ffff00', cyan: '#00ffff', aqua: '#00ffff',
  magenta: '#ff00ff', fuchsia: '#ff00ff', gray: '#808080', grey: '#808080', silver: '#c0c0c0', maroon: '#800000', olive: '#808000', navy: '#000080', purple: '#800080',
  teal: '#008080', orange: '#ffa500', pink: '#ffc0cb' }
const NAMED = new Set(Object.keys(NAMED_HEX))
const toHex = c => (c && NAMED_HEX[c]) || c
export function cleanColour(v, what) {
  const s = String(v == null ? '' : v).trim().toLowerCase()
  if (HEX.test(s)) return s[0] === '#' ? s : '#' + s
  if (NAMED.has(s)) return s
  throw new ExportError(`${what}: "${v}" is not a colour. Use hex, e.g. #e11d48${what === '--background' ? ', or transparent' : ''}.`, 'invalid_color', true)
}
export function parseBackground(v) {
  if (v === undefined || v === true) return null
  const s = String(v).trim().toLowerCase()
  if (!s || s === 'transparent' || s === 'none') return null
  return cleanColour(v, '--background')
}

// --motion loop | hover | once | inview | none | swap | <preset> | <trigger>:<preset>  -> ctx.motion (undefined = format default)
export function parseMotion(v, presets) {
  if (v === undefined) return undefined
  const s = String(v).trim().toLowerCase()
  if (['none', 'off', 'static', 'still', 'false'].includes(s)) return false
  if (s === 'swap' || s === 'turn-into') return { trigger: 'loop', swap: true }
  let [a, b] = s.split(/[:@/]/)
  const m = {}
  if (TRIGGERS.includes(a)) { m.trigger = a; if (b) m.preset = b } else { m.trigger = TRIGGERS.includes(b) ? b : 'loop'; m.preset = a }
  if (m.preset && !presets.includes(m.preset))
    throw new ExportError(`--motion: unknown preset "${m.preset}". Use loop, hover, once, inview, none, or a preset: ${presets.join(', ')}`, 'unknown_preset', true)
  return m
}

// ---- the PNG renderer (optional dependency) ----
let renderer, ResvgClass = null
export async function loadRenderer() {
  if (renderer !== undefined) return renderer
  renderer = null
  if (process.env.WITHICONS_NO_RESVG) return null // tests: behave as if @resvg/resvg-js were not installed
  const pick = m => m && (m.Resvg || (m.default && m.default.Resvg))
  let Resvg = null
  try { Resvg = pick(await import('@resvg/resvg-js')) } catch { /* not next to the CLI */ }
  if (!Resvg) { try { Resvg = pick(createRequire(path.join(process.cwd(), 'package.json'))('@resvg/resvg-js')) } catch { /* not in this project either */ } }
  if (!Resvg) return null
  ResvgClass = Resvg
  renderer = (svg, w) => new Uint8Array(new Resvg(svg, { fitTo: { mode: 'width', value: Math.round(w) }, font: { loadSystemFonts: false } }).render().asPng())
  WE.renderPng = renderer   // app.js: ico, favicon-pack
  WE.pngFromSvg = renderer  // office.js: pptx, pptx-sheet, docx
  return renderer
}
export const RENDERER_HINT = 'PNG, PNG set, ICO, favicon pack, PowerPoint, Word and animated GIF / APNG files need a PNG renderer, and it is not installed.\n' +
  'Install it once, then run the same command again:\n  npm install --save-dev @resvg/resvg-js\n' +
  'Every other format (svg, pdf, eps, android, ios, code, lottie...) works without it.'

// ---- icon -> export ctx (the same shape the site's editor builds) ----
function splitSvg(svg) {
  const m = /^<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/.exec(svg)
  if (!m) throw new ExportError('unexpected SVG data', 'bad_data')
  const root = {}
  for (const a of m[1].matchAll(/([\w:-]+)="([^"]*)"/g)) if (!['xmlns', 'width', 'height', 'viewBox'].includes(a[1])) root[a[1]] = a[2]
  return { root, inner: m[2].replace(/^<title>[\s\S]*?<\/title>/, '') }
}
export function buildCtx(lib, { name, style, title, palette, colors, color, motion, duration, strokeWidth }) {
  const { root, inner } = splitSvg(lib.svgOf(name, style, strokeWidth ? { strokeWidth } : {}))
  let vars = {}, ink = color || null, applied = null
  if (palette || (colors && Object.keys(colors).length)) {
    applied = lib.applyColors(name, style, { palette, colors: color ? { ink: color, ...(colors || {}) } : colors })
    vars = applied.vars || {}
    ink = applied.color || ink
  }
  const ctx = { name, title, style, inner, root, vars, motionSpec: lib.motionFor(name) || null }
  if (ink) ctx.color = ink
  if (motion === false) ctx.motion = false
  else if (motion) { const { swap, ...m } = motion; ctx.motion = { ...m, ...(duration ? { duration } : {}) } }
  else if (duration) ctx.motion = { trigger: 'loop', duration }
  return { ctx, applied }
}
// frame exports of an icon without tuned motion: a gentle pulse for loops, a pop for one-shots (never a frozen file)
function fallbackMotion(ctx) {
  if (ctx.motionSpec || ctx.motion === false || (ctx.motion && ctx.motion.preset)) return
  const trigger = (ctx.motion && ctx.motion.trigger) || 'loop'
  ctx.motion = { ...(ctx.motion || {}), trigger, preset: trigger === 'loop' ? 'pulse' : 'pop' }
}

// "Turn into": icon A becomes icon B and back (ctx.swap, as the site's editor builds it). to: "name" | "name@style"
// (default: the icon's first suggested swap); effect: fade, flip, scale, morph, ... (default: the suggestion's, else fade)
export function swapFor(lib, ctx, { to, effect, hold, duration, palette, colors, color } = {}) {
  const spec = ctx.motionSpec
  const pick = to ? { to: String(to), effect } : (spec && spec.swap && spec.swap[0]) || null
  if (!pick) throw new ExportError(`"${ctx.name}" has no suggested swap target: add --to <icon> (or "<icon>@<style>"), e.g. --to ${ctx.name}@solid`, 'missing_swap_target', true)
  const [n, st] = String(pick.to).split('@')
  const name = lib.resolveName(n), style = st ? lib.checkStyle(st) : ctx.style
  const effects = (lib.motionData && lib.motionData().effects) || []
  const fx = effect || pick.effect || 'fade'
  if (effects.length && !effects.includes(fx)) throw new ExportError(`--effect: unknown effect "${fx}". Effects: ${effects.join(', ')}`, 'unknown_effect', true)
  const B = splitSvg(lib.svgOf(name, style))
  let vars = {}, ink = ctx.color || null
  if (palette || (colors && Object.keys(colors).length) || color) {
    try { const a = lib.applyColors(name, style, { palette, colors: color ? { ink: color, ...(colors || {}) } : colors }); vars = a.vars || {}; ink = a.color || ink } catch { /* no such palette for B: its defaults */ }
  }
  let title = name
  try { title = lib.getIcon({ name, style: 'line' }).title } catch { /* plain name */ }
  return { name, style, title, inner: B.inner, root: B.root, vars, ...(ink ? { color: ink } : {}), effect: fx,
    ...(duration ? { duration } : {}), ...(hold != null ? { hold } : {}) }
}
function variants(lib, name, opts) {
  return lib.data().meta.styles.map(s => {
    try { return { style: s.name, title: s.title, ...splitSvg(lib.svgOf(name, s.name)) } } catch { return null }
  }).filter(Boolean)
}

// ---- output file names: --name / filename templates ----
// The default is <name>-<style>[-<variant>].<ext>: home-line.svg (svg-flat), home-line-themable.svg (svg), home-line-512.png,
// bell-line-ring.gif, play-line-to-pause.apng.png. A template may use {name} {style} {format} {variant} {default}; the
// extension is added when the template does not end with it.
export const NAME_PLACEHOLDERS = ['name', 'style', 'format', 'variant', 'default']
export function checkNameTemplate(t) {
  const s = String(t).trim()
  if (!s) throw new ExportError('--name: give a file name or a template such as "{name}" or "{name}-{style}"', 'invalid_option', true)
  if (/[\\/]|\.\./.test(s) || /^[.-]/.test(s)) throw new ExportError(`--name "${t}": a file name only (no folders, no leading "." or "-"); use --out for the folder`, 'invalid_option', true)
  if (/[<>:"|?*\x00-\x1f]/.test(s)) throw new ExportError(`--name "${t}": contains a character file systems reject`, 'invalid_option', true)
  for (const m of s.matchAll(/\{([^}]*)\}/g)) if (!NAME_PLACEHOLDERS.includes(m[1])) throw new ExportError(`--name: unknown placeholder {${m[1]}}. Use ${NAME_PLACEHOLDERS.map(p => `{${p}}`).join(', ')}`, 'invalid_option', true)
  return s
}
// default file name -> { stem, variant, ext }
function splitDefault(filename, name, style) {
  const pre = `${name}-${style}`
  const m = filename.startsWith(pre) ? /^(?:-(.*?))?\.([a-z0-9]+(?:\.png)?)$/i.exec(filename.slice(pre.length)) : null
  if (m) return { stem: filename.slice(0, filename.length - m[2].length - 1), variant: m[1] || '', ext: m[2] }
  const i = filename.indexOf('.')
  return { stem: i > 0 ? filename.slice(0, i) : filename, variant: '', ext: i > 0 ? filename.slice(i + 1) : '' }
}
export function applyNameTemplate(template, { name, style, format, filename, as }) {
  const d = splitDefault(filename, name, style)
  // as: the icon's own file base name (--name-map receipt=orders): {name} and {default} use it
  const stem = as && d.stem.startsWith(name) ? as + d.stem.slice(name.length) : d.stem
  const vals = { name: as || name, style, format, variant: d.variant, default: stem }
  let s = template.replace(/\{(\w+)\}/g, (all, k) => vals[k])
  // an empty {variant} leaves no stray dashes
  s = s.replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '').replace(/-+\./g, '.')
  if (!s) s = stem
  return d.ext && !s.toLowerCase().endsWith('.' + d.ext.toLowerCase()) ? `${s}.${d.ext}` : s
}

// --name-map receipt=orders,heart=favourites (MCP names: { receipt: "orders", heart: "favourites" }) -> Map(icon -> base)
// Keys are icon names or aliases and must be among the exported icons; values are plain file names (no folders,
// placeholders or extension: the extension is added). Clashes are refused like any other (two files, one name).
export function parseNameMap(lib, value, names) {
  if (value == null || value === '') return null
  let pairs
  if (typeof value === 'object') pairs = Object.entries(value)
  else pairs = String(value).split(/[,;]/).map(p => p.trim()).filter(Boolean).map(p => {
    const m = /^([^=:]+)[=:](.+)$/.exec(p)
    if (!m) throw new ExportError(`--name-map: "${p}" is not icon=file-name (e.g. --name-map receipt=orders,heart=favourites)`, 'invalid_option', true)
    return [m[1].trim(), m[2].trim()]
  })
  const map = new Map()
  for (const [k, v] of pairs) {
    const icon = lib.resolveName(k)
    if (!names.includes(icon)) throw new ExportError(`--name-map: "${k}" is not one of the icons being exported (${names.join(', ')})`, 'invalid_option', true)
    const base = String(v == null ? '' : v).trim().replace(/\.(svg|png|pdf|eps|gif|json|zip|ico|xml|txt)$/i, '')
    if (!base || /[{}]/.test(base)) throw new ExportError(`--name-map: give "${k}" a plain file name, got "${v}"`, 'invalid_option', true)
    checkNameTemplate(base)
    if (map.has(icon) && map.get(icon) !== base) throw new ExportError(`--name-map: ${icon} is given two names ("${map.get(icon)}", "${base}")`, 'invalid_option', true)
    map.set(icon, base)
  }
  return map.size ? map : null
}

// ---- palettes across several icons: palettes are picked per icon, so an id may exist on some icons only ----
// Every icon is checked before anything is written. An icon without the palette borrows its colours (the role colours:
// ink, c1-c4, tint, ...) from the first icon in this export that has it, so the set keeps one look; strict: fail instead.
function planPalettes(lib, names, palette, colors, strict) {
  const plan = new Map(names.map(n => [n, { palette, colors }]))
  if (!palette) return { plan, notes: [] }
  const have = [], missing = []
  let firstError = null
  for (const n of names) {
    try { lib.applyColors(n, 'line', { palette }); have.push(n) } catch (e) {
      if (!(e && e.code === 'unknown_palette')) throw e
      missing.push(n); firstError = firstError || e
    }
  }
  if (!missing.length) return { plan, notes: [] }
  if (!have.length) {
    if (names.length === 1) throw new ExportError(firstError.message, 'unknown_palette', false, { palettes: firstError.palettes })
    throw new ExportError(`none of ${names.join(', ')} has a palette "${palette}"; nothing was written. See: withicons palettes ${names[0]}`, 'unknown_palette')
  }
  if (strict) throw new ExportError(`palette "${palette}" exists for ${have.join(', ')} but not for ${missing.join(', ')}; nothing was written. ` +
    `Leave out --strict to give ${missing.length === 1 ? 'it' : 'them'} the same colours (borrowed from ${have[0]}), or pick a palette per icon (withicons palettes <name>).`, 'unknown_palette', false, { missing, have })
  const donor = lib.applyColors(have[0], 'line', { palette })
  // borrowed roles act like a palette's: no warning when this style leaves some of them out
  const borrowed = Object.keys(donor.colors).filter(k => !(colors && k in colors))
  for (const n of missing) plan.set(n, { palette: undefined, colors: { ...donor.colors, ...(colors || {}) }, borrowed })
  return { plan, notes: [`${missing.join(', ')} ${missing.length === 1 ? 'has' : 'have'} no palette "${palette}": used ${have[0]}'s "${palette}" colours instead (--strict fails instead).`] }
}

// names x styles x formats -> files. Returns { files: [{ name, style, format, filename, file, bytes, data }], notes, warnings }
// (data only when keepData or not writing). Everything is checked and rendered before the first file is written.
export async function exportIcons(lib, o) {
  const formats = parseFormats(o.format)
  const styles = o.allStyles ? lib.data().meta.styles.map(s => s.name) : [lib.checkStyle(o.style || 'line')]
  const names = [...new Set(o.names.flatMap(n => String(n).split(',')).map(n => n.trim()).filter(Boolean).map(n => lib.resolveName(n)))]
  const nameMap = parseNameMap(lib, o.nameMap, names)
  // with a name map and no --name: just the mapped name (orders.svg), plus the style when there are several
  const template = o.filename != null && o.filename !== '' ? checkNameTemplate(o.filename) : nameMap ? (styles.length > 1 ? '{name}-{style}' : '{name}') : null
  if (formats.some(f => NEEDS_PNG.has(f)) && !(await loadRenderer())) throw new ExportError(RENDERER_HINT, 'missing_renderer')
  if (formats.includes('animated-svg')) await loadRenderer()
  const presets = (lib.motionData && lib.motionData().presets) || []
  const motion = parseMotion(o.motion, presets)
  const background = parseBackground(o.background)
  const color = o.color !== undefined ? cleanColour(o.color, '--color') : undefined
  const colors = {}
  for (const [k, v] of Object.entries(o.colors || {})) colors[k] = cleanColour(v, `--${k}`)
  const out = [], notes = new Set(), warnings = new Set()
  // colours per icon x style, summarised once for the whole command at the end (lib.colorSummary)
  const colourEntries = new Map()
  // --stroke-width: outline styles only (as for get); the others have no single stroke to change
  const strokeWidth = o.strokeWidth !== undefined ? Number(o.strokeWidth) : undefined
  if (strokeWidth !== undefined && !(strokeWidth > 0 && strokeWidth <= 4)) throw new ExportError(`--stroke-width must be a number above 0 and at most 4, got "${o.strokeWidth}"`, 'invalid_option', true)
  // outline styles: a stroke-width on the root <svg> (what svgOf(..., { strokeWidth }) changes)
  const probe = lib.data().meta.icons[0].name
  const strokeStyles = new Set(lib.data().meta.styles.map(s => s.name).filter(st => { try { return /^<svg[^>]* stroke-width="/.test(lib.svgOf(probe, st)) } catch { return false } }))
  if (strokeWidth !== undefined && !styles.some(s => strokeStyles.has(s))) notes.add(`--stroke-width applies to outline styles only (${[...strokeStyles].join(', ')}); ${styles.join(', ')} ignore${styles.length === 1 ? 's' : ''} it`)
  const pal = planPalettes(lib, names, o.palette, colors, !!o.strictPalette)
  for (const n of pal.notes) warnings.add(n)
  const wantsSwap = !!(o.to || (motion && motion.swap))
  const sheetAnimated = formats.includes('pptx-sheet') && ((motion && motion !== false) || wantsSwap || o.animated)
  if ((motion !== undefined || wantsSwap) && !formats.some(f => (WE.get(f) && WE.get(f).animated) || (f === 'pptx-sheet' && sheetAnimated)))
    notes.add(`--motion applies to animated formats only (gif, apng, pptx-animated, animated-svg, lottie, dotlottie, pptx-sheet, jsx, tsx, vue, svelte, react-native, angular, html, css)`)
  // frame options (gif, apng, pptx-animated, animated pptx-sheet)
  const fps = o.fps !== undefined ? Number(o.fps) : undefined
  if (fps !== undefined && !(fps >= 1 && fps <= 60)) throw new ExportError(`--fps must be between 1 and 60 (GIF plays at most 50), got "${o.fps}"`, 'invalid_option', true)
  const seconds = o.seconds !== undefined ? Number(o.seconds) : undefined
  if (seconds !== undefined && !(seconds > 0 && seconds <= 30)) throw new ExportError(`--seconds must be above 0 and at most 30, got "${o.seconds}"`, 'invalid_option', true)
  const loop = o.loop !== undefined ? Number(o.loop) : undefined
  if (loop !== undefined && !(Number.isInteger(loop) && loop >= 0 && loop <= 65535)) throw new ExportError(`--loop must be 0 (forever, the default) or how many times to play, got "${o.loop}"`, 'invalid_option', true)
  const matte = o.matte !== undefined ? toHex(cleanColour(o.matte, '--matte')) : undefined
  if (formats.includes('gif') && !background && !matte) notes.add('GIF transparency is on/off per pixel, so soft edges are blended with white. For a slide or page of another colour, pass --background "<its colour>" (solid) or --matte "<its colour>" (transparent, edges blended with it).')
  const dir = o.out === '-' ? null : path.resolve(o.out || '.')
  for (const name of names) {
    const title = lib.getIcon({ name, style: 'line' }).title
    const { palette, colors: cols, borrowed } = pal.plan.get(name)
    for (const format of formats) {
      const f = WE.get(format)
      for (const style of PER_ICON.has(format) ? [styles[0]] : styles) {
        const sw = strokeWidth && strokeStyles.has(style) ? strokeWidth : undefined
        const { ctx, applied } = buildCtx(lib, { name, style, title, palette, colors: cols, color, motion, duration: o.duration, strokeWidth: sw })
        if (applied && !PER_ICON.has(format) && !colourEntries.has(name + '|' + style)) colourEntries.set(name + '|' + style, { name, style, applied, borrowed })
        if (wantsSwap && f.animated) ctx.swap = swapFor(lib, ctx, { to: o.to, effect: o.effect, hold: o.hold, duration: o.duration, palette, colors: cols, color })
        const opts = { background, padding: o.padding }
        if (o.size !== undefined) opts.size = o.size
        else if (format === 'svg' || format === 'svg-flat') opts.size = 24
        if (FRAME_FORMATS.has(format) || format === 'animated-svg' || (format === 'pptx-sheet' && sheetAnimated)) {
          // the encoders read plain hex colours
          if (background) opts.background = toHex(background)
          if (matte) opts.matte = matte
          if (fps !== undefined) opts.fps = fps
          if (seconds !== undefined) opts.seconds = seconds
          if (loop !== undefined) opts.loop = loop
          if (format === 'pptx-sheet') opts.animated = true
          fallbackMotion(ctx)
          // animated SVG without a renderer: a fixed headroom instead of measuring how far the motion travels
          if (format === 'animated-svg' && opts.padding == null && !renderer) opts.padding = 0.12
        }
        if (format === 'pptx-sheet') {
          opts.variants = variants(lib, name, o)
          ctx.variants = opts.variants
          // the chosen colours, for every style (variable names are per style, so they never clash)
          if (palette || Object.keys(cols).length || color) for (const v of opts.variants) {
            try { Object.assign(ctx.vars, lib.applyColors(name, v.style, { palette, colors: color ? { ink: color, ...cols } : cols }).vars) } catch { /* palette missing for this style */ }
          }
        }
        let r
        try { r = await f.run(ctx, opts) } catch (e) {
          if (e instanceof ExportError) throw e
          // frame / pixel limits and other refusals from the format code are the caller's to fix
          throw new ExportError(`${format}: ${e && e.message ? e.message : e}`, /frames|pixels/.test(String(e && e.message)) ? 'too_large' : 'export_failed', /frames|pixels/.test(String(e && e.message)))
        }
        const data = typeof r.data === 'string' ? Buffer.from(r.data, 'utf8') : Buffer.from(r.data.buffer ? new Uint8Array(r.data.buffer, r.data.byteOffset, r.data.byteLength) : r.data)
        const st = PER_ICON.has(format) ? 'all' : style
        const filename = template ? applyNameTemplate(template, { name, style: st, format, filename: r.filename, as: nameMap && nameMap.get(name) }) : r.filename
        out.push({ name, style: st, format, label: f.label, mime: r.mime, filename, bytes: data.length, data })
      }
    }
  }
  // two files with one name would overwrite each other: refuse before writing anything
  const seen = new Map()
  for (const it of out) {
    const k = it.filename.toLowerCase()
    const a = seen.get(k)
    if (a) throw new ExportError(`two files would both be named "${it.filename}" (${a.name} ${a.style} ${a.format} and ${it.name} ${it.style} ${it.format}); nothing was written: ` +
      (template ? `add {name}, {style} or {format} to --name "${template}"${nameMap ? ' (with --name-map, {name} is the mapped name)' : ''}` : 'export them separately'), 'name_clash', true)
    seen.set(k, it)
  }
  if (dir) {
    fs.mkdirSync(dir, { recursive: true })
    for (const it of out) { it.file = path.join(dir, it.filename); fs.writeFileSync(it.file, it.data) }
  }
  if (dir && !o.keepData) for (const it of out) delete it.data
  // colours: one line per colour for the whole command, never one per icon. Only the colours set by hand are checked
  // (a palette's own roles, and roles borrowed from another icon's palette, may leave some out); the ink always applies.
  if (colourEntries.size && typeof lib.colorSummary === 'function') {
    const keys = Object.keys(colors).filter(k => k !== 'ink')
    const label = o.colorLabel || (k => k.startsWith('--') ? k : '--' + k)
    const sum = lib.colorSummary([...colourEntries.values()], { keys, palette: !!o.palette, label })
    for (const n of sum.notes) notes.add(n)
    for (const w of sum.warnings) warnings.add(w)
  }
  return { files: out, notes: [...notes], warnings: [...warnings] }
}
