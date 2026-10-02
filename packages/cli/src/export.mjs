// `withicons export` — write icon files (SVG, PDF, EPS, PNG, ICO, favicon pack, Android, iOS, React/Vue/Svelte/
// React Native/Angular components, HTML, CSS, data URIs, PowerPoint, Word, Lottie) for developers and CI.
// The format code is the website's own: site/js/export/*.js (dependency-free UMD modules), bundled into dist/cli.mjs,
// so a file from the CLI is byte-for-byte the file the site's download button makes (PNG encoding aside).
// PNG-based formats need a rasterizer: @resvg/resvg-js, an optional dependency loaded on first use.
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import WE from '../../../site/js/export/registry.js'
import vector from '../../../site/js/export/vector.js'
import code from '../../../site/js/export/code.js'
import app from '../../../site/js/export/app.js'
import office from '../../../site/js/export/office.js'
import lottie from '../../../site/js/export/lottie.js'

vector(WE); code(WE); app(WE); office(WE); lottie(WE)

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
  'pptx', 'pptx-sheet', 'docx', 'lottie', 'dotlottie']
export const NEEDS_PNG = new Set(['png', 'png-set', 'ico', 'favicon-pack', 'pptx', 'pptx-sheet', 'docx'])
const ALIASES = { flat: 'svg-flat', 'svg-baked': 'svg-flat', themable: 'svg', react: 'jsx', 'react-ts': 'tsx', typescript: 'tsx', rn: 'react-native',
  native: 'react-native', ng: 'angular', datauri: 'data-uri', uri: 'data-uri', b64: 'base64', favicon: 'favicon-pack', favicons: 'favicon-pack',
  xcode: 'ios', imageset: 'ios', vectordrawable: 'android', 'vector-drawable': 'android', powerpoint: 'pptx', ppt: 'pptx', slides: 'pptx',
  word: 'docx', doc: 'docx', json: 'lottie', 'lottie-json': 'lottie', '.lottie': 'dotlottie', pngs: 'png-set', retina: 'png-set', ps: 'eps', postscript: 'eps' }
// formats the website makes in your browser (canvas, video encoders): not available from the terminal
const BROWSER_ONLY = { webp: 'WebP', jpg: 'JPG', jpeg: 'JPG', avif: 'AVIF', gif: 'GIF', apng: 'APNG', 'webp-animated': 'animated WebP',
  webm: 'WebM video', mp4: 'MP4 video', 'png-sequence': 'PNG frames', 'animated-svg': 'animated SVG' }
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
    if (BROWSER_ONLY[f]) throw new ExportError(`${BROWSER_ONLY[f]} is made in your browser: download it from the icon's page on https://withicons.com. From the terminal: ${EXPORT_FORMATS.join(', ')}`, 'browser_only', true)
    if (!EXPORT_FORMATS.includes(f)) throw new ExportError(`unknown format "${raw}". Formats: ${EXPORT_FORMATS.join(', ')} (or all)`, 'unknown_format', true, { formats: EXPORT_FORMATS })
    out.push(f)
  }
  return [...new Set(out)]
}

const HEX = /^#?(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const NAMED = new Set(['black', 'white', 'red', 'lime', 'green', 'blue', 'yellow', 'cyan', 'aqua', 'magenta', 'fuchsia', 'gray', 'grey', 'silver', 'maroon', 'olive', 'navy', 'purple', 'teal', 'orange', 'pink'])
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

// --motion loop | hover | once | inview | none | <preset> | <trigger>:<preset>  -> ctx.motion (undefined = format default)
export function parseMotion(v, presets) {
  if (v === undefined) return undefined
  const s = String(v).trim().toLowerCase()
  if (['none', 'off', 'static', 'still', 'false'].includes(s)) return false
  let [a, b] = s.split(/[:@/]/)
  const m = {}
  if (TRIGGERS.includes(a)) { m.trigger = a; if (b) m.preset = b } else { m.trigger = TRIGGERS.includes(b) ? b : 'loop'; m.preset = a }
  if (m.preset && !presets.includes(m.preset))
    throw new ExportError(`--motion: unknown preset "${m.preset}". Use loop, hover, once, inview, none, or a preset: ${presets.join(', ')}`, 'unknown_preset', true)
  return m
}

// ---- the PNG renderer (optional dependency) ----
let renderer
export async function loadRenderer() {
  if (renderer !== undefined) return renderer
  renderer = null
  if (process.env.WITHICONS_NO_RESVG) return null // tests: behave as if @resvg/resvg-js were not installed
  const pick = m => m && (m.Resvg || (m.default && m.default.Resvg))
  let Resvg = null
  try { Resvg = pick(await import('@resvg/resvg-js')) } catch { /* not next to the CLI */ }
  if (!Resvg) { try { Resvg = pick(createRequire(path.join(process.cwd(), 'package.json'))('@resvg/resvg-js')) } catch { /* not in this project either */ } }
  if (!Resvg) return null
  renderer = (svg, w) => new Uint8Array(new Resvg(svg, { fitTo: { mode: 'width', value: Math.round(w) }, font: { loadSystemFonts: false } }).render().asPng())
  WE.renderPng = renderer   // app.js: ico, favicon-pack
  WE.pngFromSvg = renderer  // office.js: pptx, pptx-sheet, docx
  return renderer
}
export const RENDERER_HINT = 'PNG, PNG set, ICO, favicon pack, PowerPoint and Word files need a PNG renderer, and it is not installed.\n' +
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
export function buildCtx(lib, { name, style, title, palette, colors, color, motion, duration }) {
  const { root, inner } = splitSvg(lib.svgOf(name, style))
  let vars = {}, ink = color || null, applied = null
  if (palette || (colors && Object.keys(colors).length)) {
    applied = lib.applyColors(name, style, { palette, colors: color ? { ink: color, ...(colors || {}) } : colors })
    vars = applied.vars || {}
    ink = applied.color || ink
  }
  const ctx = { name, title, style, inner, root, vars, motionSpec: lib.motionFor(name) || null }
  if (ink) ctx.color = ink
  if (motion === false) ctx.motion = false
  else if (motion) ctx.motion = { ...motion, ...(duration ? { duration } : {}) }
  else if (duration) ctx.motion = { trigger: 'loop', duration }
  return { ctx, applied }
}
function variants(lib, name, opts) {
  return lib.data().meta.styles.map(s => {
    try { return { style: s.name, title: s.title, ...splitSvg(lib.svgOf(name, s.name)) } } catch { return null }
  }).filter(Boolean)
}

// names x styles x formats -> files. Returns [{ name, style, format, file, bytes, data }] (data only when keepData)
export async function exportIcons(lib, o) {
  const formats = parseFormats(o.format)
  const styles = o.allStyles ? lib.data().meta.styles.map(s => s.name) : [lib.checkStyle(o.style || 'line')]
  const names = [...new Set(o.names.flatMap(n => String(n).split(',')).filter(Boolean).map(n => lib.resolveName(n)))]
  if (formats.some(f => NEEDS_PNG.has(f)) && !(await loadRenderer())) throw new ExportError(RENDERER_HINT, 'missing_renderer')
  const presets = (lib.motionData && lib.motionData().presets) || []
  const motion = parseMotion(o.motion, presets)
  const background = parseBackground(o.background)
  const color = o.color !== undefined ? cleanColour(o.color, '--color') : undefined
  const colors = {}
  for (const [k, v] of Object.entries(o.colors || {})) colors[k] = cleanColour(v, `--${k}`)
  const out = [], notes = new Set(), oneColour = {}
  if (motion !== undefined && !formats.some(f => WE.get(f) && WE.get(f).animated)) notes.add(`--motion applies to animated formats only (lottie, dotlottie, jsx, tsx, vue, svelte, react-native, angular, html, css)`)
  const dir = o.out === '-' ? null : path.resolve(o.out || '.')
  for (const name of names) {
    const title = lib.getIcon({ name, style: 'line' }).title
    for (const format of formats) {
      const f = WE.get(format)
      for (const style of PER_ICON.has(format) ? [styles[0]] : styles) {
        const { ctx, applied } = buildCtx(lib, { name, style, title, palette: o.palette, colors, color, motion, duration: o.duration })
        if (applied && !Object.keys(applied.vars || {}).length && (o.palette || Object.keys(colors).length)) (oneColour[name] ||= new Set()).add(style)
        const opts = { background, padding: o.padding }
        if (o.size !== undefined) opts.size = o.size
        else if (format === 'svg' || format === 'svg-flat') opts.size = 24
        if (format === 'pptx-sheet') {
          opts.variants = variants(lib, name, o)
          ctx.variants = opts.variants
          // the chosen colours, for every style (variable names are per style, so they never clash)
          if (o.palette || Object.keys(colors).length || color) for (const v of opts.variants) {
            try { Object.assign(ctx.vars, lib.applyColors(name, v.style, { palette: o.palette, colors: color ? { ink: color, ...colors } : colors }).vars) } catch { /* palette missing for this style */ }
          }
        }
        const r = await f.run(ctx, opts)
        const data = typeof r.data === 'string' ? Buffer.from(r.data, 'utf8') : Buffer.from(r.data.buffer ? new Uint8Array(r.data.buffer, r.data.byteOffset, r.data.byteLength) : r.data)
        const item = { name, style: PER_ICON.has(format) ? 'all' : style, format, label: f.label, mime: r.mime, filename: r.filename, bytes: data.length }
        if (dir) {
          fs.mkdirSync(dir, { recursive: true })
          item.file = path.join(dir, r.filename)
          fs.writeFileSync(item.file, data)
        }
        if (o.keepData || !dir) item.data = data
        out.push(item)
      }
    }
  }
  for (const [name, set] of Object.entries(oneColour))
    notes.add(`${[...set].join(', ')} ${set.size === 1 ? 'draws' : 'draw'} ${name} in one colour, so only the ink applies there. Multi-colour styles: ${lib.multiColourStyles(name).join(', ')}`)
  return { files: out, notes: [...notes] }
}
