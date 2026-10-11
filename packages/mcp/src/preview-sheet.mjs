// The preview sheet: icons x styles as one self-contained SVG (rows = icons, columns = styles, labelled). The pure part of
// preview_icons (preview-tool.mjs): no MCP SDK, no renderer. Exported by lib.mjs as previewSheet().
//   Self-contained: no external references, no CSS variables (colours baked in), no <text> (labels are paths, preview-font.mjs),
//   gradient ids made unique per sheet so several sheets can share one page.
import * as lib from './lib.mjs'
import { textPath, textWidth, ASC, FULL } from './preview-font.mjs'

export const PREVIEW_LIMITS = Object.freeze({ names: 24, styles: 6, minSize: 12, maxSize: 256, defaultSize: 64, columns: 12, side: 4096 })
const MARGIN = 12      // around the sheet
const GAP = 6          // between tiles
const VIEW_PX = 1600   // image viewers (and models) shrink pictures larger than about this on a side
const BG = { light: '#ffffff', dark: '#0f172a' }
const INK = { light: '#0f172a', dark: '#f1f5f9' }   // outlines on a light / dark page (list_styles onDark: "a light color, e.g. #f1f5f9")

// ---------------------------------------------------------------- arguments
const list = v => [].concat(v == null ? [] : v).flatMap(x => String(x).split(',')).map(x => x.trim()).filter(Boolean)
const fail = (message, code, extra) => new lib.IconError(message, { code, ...extra })

function editDistance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]; row[0] = i
    for (let j = 1; j <= b.length; j++) { const t = row[j]; row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = t }
  }
  return row[b.length]
}
const closestStyle = (s, styles) => {
  const near = styles.map(x => [x, x.startsWith(s) || s.startsWith(x) ? 0 : editDistance(s, x)]).sort((a, b) => a[1] - b[1])[0]
  return near && near[1] <= Math.max(2, Math.floor(s.length / 3)) ? near[0] : null
}

function parseBackground(v) {
  const s = String(v == null ? 'light' : v).trim().toLowerCase()
  if (s === 'light' || s === 'white') return { hex: BG.light, dark: false, name: 'light' }
  if (s === 'dark') return { hex: BG.dark, dark: true, name: 'dark' }
  let m = /^#?([0-9a-f]{3})$/.exec(s)
  const hex = m ? m[1].split('').map(c => c + c).join('') : (m = /^#?([0-9a-f]{6})$/.exec(s)) && m[1]
  if (!hex) throw fail(`background must be "light", "dark" or a hex colour such as "#fde68a" (got "${v}").`, 'invalid_background')
  const [r, g, b] = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16))
  return { hex: '#' + hex, dark: (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5, name: 'custom' }
}

/** Arguments -> a checked plan: canonical icon names, styles, colours, limits. Throws IconError with what to change. */
export function planPreview(a = {}, { remote = false } = {}) {
  const L = PREVIEW_LIMITS
  const asked = list(a.names).concat(list(a.name))
  if (!asked.length) throw fail('Give names: the icons to preview, e.g. names: ["cake", "cookie", "donut"] (1 to ' + L.names + ').', 'missing_name')
  // icons: every unknown name is reported at once, each with its nearest names
  const icons = [], aliases = {}, unknown = [], ambiguous = []
  for (const raw of asked) {
    try {
      const name = lib.resolveName(raw)
      if (name !== raw) aliases[raw] = name
      if (!icons.includes(name)) icons.push(name)
    } catch (e) {
      if (!(e instanceof lib.IconError)) throw e
      if (e.code === 'ambiguous') ambiguous.push({ name: raw, candidates: e.candidates, message: e.message })
      else unknown.push({ name: raw, nearest: e.nearest || [], message: e.message })
    }
  }
  if (unknown.length || ambiguous.length) {
    throw fail([...unknown, ...ambiguous].map(x => x.message).join(' ') +
      ' search_icons(query) finds icons by meaning and resolve_icon(name) checks a name; nothing was drawn.',
    unknown.length ? 'unknown_icon' : 'ambiguous', { unknown: unknown.map(({ name, nearest }) => ({ name, nearest })), ...(ambiguous.length ? { ambiguous: ambiguous.map(({ name, candidates }) => ({ name, candidates })) } : {}) })
  }
  if (icons.length > L.names) throw fail(`At most ${L.names} icons per preview (got ${icons.length}). Split them over several calls.`, 'too_many_icons', { max: L.names })
  // styles
  const known = lib.data().styleNames
  const styles = []
  for (const raw of list(a.styles).concat(list(a.style))) {
    const s = raw.toLowerCase()
    if (!known.includes(s)) {
      const near = closestStyle(s, known)
      throw fail(`Unknown style "${raw}".${near ? ` Did you mean ${near}?` : ''} Styles: ${known.join(', ')}`, 'unknown_style', { styles: known, ...(near ? { didYouMean: near } : {}) })
    }
    if (!styles.includes(s)) styles.push(s)
  }
  if (!styles.length) styles.push('line')
  if (styles.length > L.styles) throw fail(`At most ${L.styles} styles per preview (got ${styles.length}: ${styles.join(', ')}). Compare six at a time.`, 'too_many_styles', { max: L.styles })
  // size, background, layout
  const size = a.size === undefined ? L.defaultSize : Number(a.size)
  if (!Number.isInteger(size) || size < L.minSize || size > L.maxSize) throw fail(`size must be a whole number of pixels from ${L.minSize} to ${L.maxSize} (got ${a.size}).`, 'invalid_size')
  const bg = parseBackground(a.background)
  const columns = a.columns === undefined ? null : Number(a.columns)
  if (columns !== null && (!Number.isInteger(columns) || columns < 1 || columns > L.columns)) throw fail(`columns must be a whole number from 1 to ${L.columns} (got ${a.columns}).`, 'invalid_columns')
  const format = a.format === undefined ? (remote ? 'svg' : 'png') : String(a.format).toLowerCase()
  if (format !== 'png' && format !== 'svg') throw fail(`format must be "png" or "svg" (got "${a.format}").`, 'unknown_format')
  const colors = a.colors && typeof a.colors === 'object' ? a.colors : null
  return { icons, styles, aliases, size, bg, columns, labels: a.labels !== false, format, palette: a.palette ? String(a.palette) : null, colors: colors && Object.keys(colors).length ? colors : null, explicitColumns: columns !== null }
}

// ---------------------------------------------------------------- one cell: an icon in a style, colours baked in
const DEF = /var\(\s*(--with-[\w-]+)\s*,\s*([^()]*?)\s*\)/g
// one icon in one style as { attrs, body }: the root's presentation attributes (fill, stroke ...) and the drawing, colours baked in
function cellParts(name, style, ink, applied) {
  const m = /^<svg([^>]*)>([\s\S]*)<\/svg>\s*$/.exec(lib.svgOf(name, style))
  if (!m) throw fail(`"${name}" in "${style}" is not an SVG`, 'bad_data')
  // palette / colour roles first, then every other variable falls back to its default; currentColor is the ink
  const bake = t => lib.stripMotion(lib.flatten(t.replace(DEF, (all, v, d) => (applied && applied.vars[v]) || d)).replace(/currentColor/g, ink))
  return { attrs: bake(m[1].replace(/\s(?:xmlns|width|height|viewBox)="[^"]*"/g, '')), body: bake(m[2]) }
}
const smallest = styles => { const info = new Map(lib.listStyles().map(s => [s.name, s])); return styles.map(s => ({ name: s, min: (info.get(s) || {}).minSize || 16 })) }
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const num = n => String(+n.toFixed(3))
// FNV-1a: a short, stable fingerprint of the sheet, so ids differ between sheets (and never change for the same sheet)
const fingerprint = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) } return (h >>> 0).toString(36) }

// ---------------------------------------------------------------- layout
// matrix (two or more styles): label column + one tile per icon x style, style names on top.
// grid (one style): tiles in rows, the name under each icon, the style name on top.
function layout(plan) {
  const { icons, styles, size, labels } = plan
  const pad = Math.max(8, Math.round(size * 0.16))
  const cell = size + 2 * pad
  const font = Math.min(15, Math.max(11, Math.round(size * 0.2)))   // ascender height in px
  const k = font / ASC
  const headH = labels ? Math.ceil(FULL * k) + 14 : 0
  const matrix = styles.length > 1
  const L = { matrix, pad, cell, k, font, labels, tiles: [], texts: [] }
  const put = (text, x, baseline) => { if (text) L.texts.push(textPath(text, x, baseline, k)) }
  if (matrix) {
    const labelW = labels ? Math.ceil(Math.max(...icons.map(n => textWidth(n, k)))) + 16 : 0
    const colW = styles.map(s => Math.max(cell, labels ? Math.ceil(textWidth(s, k)) + 10 : 0))
    const x0 = MARGIN + labelW, y0 = MARGIN + headH
    const xs = colW.map((_, c) => x0 + colW.slice(0, c).reduce((n, w) => n + w + GAP, 0))
    icons.forEach((name, r) => {
      const y = y0 + r * (cell + GAP)
      if (labels) put(name, MARGIN + 2, y + cell / 2 + 2.5 * k)
      styles.forEach((style, c) => L.tiles.push({ name, style, x: xs[c], y, w: colW[c], h: cell, ix: xs[c] + (colW[c] - size) / 2, iy: y + pad }))
    })
    if (labels) styles.forEach((s, c) => put(s, xs[c] + (colW[c] - textWidth(s, k)) / 2, MARGIN + 7 + ASC * k))
    L.width = x0 + colW.reduce((n, w) => n + w, 0) + (styles.length - 1) * GAP + MARGIN
    L.height = y0 + icons.length * cell + (icons.length - 1) * GAP + MARGIN
    L.rows = icons.length; L.columns = styles.length
  } else {
    const n = icons.length
    const cols = plan.columns || Math.ceil(n / Math.ceil(n / 6))
    const rows = Math.ceil(n / cols)
    const labelH = labels ? Math.ceil(FULL * k) + 8 : 0
    const tw = Math.max(cell, labels ? Math.ceil(Math.max(...icons.map(x => textWidth(x, k)))) + 10 : 0)
    const th = labels ? pad + size + 6 + labelH : cell
    const y0 = MARGIN + headH
    icons.forEach((name, i) => {
      const r = Math.floor(i / cols), c = i % cols
      const x = MARGIN + c * (tw + GAP), y = y0 + r * (th + GAP)
      L.tiles.push({ name, style: styles[0], x, y, w: tw, h: th, ix: x + (tw - size) / 2, iy: y + pad })
      if (labels) put(name, x + (tw - textWidth(name, k)) / 2, y + pad + size + 6 + ASC * k)
    })
    if (labels) put(styles[0], MARGIN + 2, MARGIN + 7 + ASC * k)
    L.width = MARGIN + cols * tw + (cols - 1) * GAP + MARGIN
    L.height = y0 + rows * th + (rows - 1) * GAP + MARGIN
    L.rows = rows; L.columns = cols
  }
  return L
}

/**
 * The sheet as SVG. plan: planPreview(). -> { svg, width, height, ink, cells, rows, columns, layout, grid, notes, warnings, reading }
 * Self-contained: no external references, no CSS variables, no <text> (labels are paths), ids made unique per sheet.
 */
export function buildSheet(plan) {
  const { icons, styles, size, bg, labels } = plan
  const L = layout(plan)
  for (const side of [L.width, L.height]) {
    if (side > PREVIEW_LIMITS.side) throw fail(`That sheet would be ${L.width} x ${L.height} px; the limit is ${PREVIEW_LIMITS.side} px a side. Use a smaller size (now ${size}), fewer icons or fewer styles${styles.length === 1 ? ', or more columns' : ''}.`, 'sheet_too_large', { width: L.width, height: L.height, max: PREVIEW_LIMITS.side })
  }
  const defaultInk = bg.dark ? INK.dark : INK.light
  const notes = [], warnings = []
  // colours: palette (an id: only some icons have it) and colors (roles), as export_icon / get_icon apply them
  const palette = plan.palette, colors = plan.colors
  const paletteOf = new Map()
  if (palette) for (const n of icons) { try { lib.applyColors(n, 'line', { palette }); paletteOf.set(n, true) } catch (e) { if (e && e.code === 'unknown_palette') paletteOf.set(n, false); else throw e } }
  const entries = []
  const cells = L.tiles.map(t => {
    const applied = palette || colors ? lib.applyColors(t.name, t.style, { palette: paletteOf.get(t.name) ? palette : undefined, colors: colors || undefined }) : null
    if (palette || colors) entries.push({ name: t.name, style: t.style, applied })
    return { ...t, ...cellParts(t.name, t.style, (applied && applied.color) || defaultInk, applied) }
  })
  if (palette) {
    const have = icons.filter(n => paletteOf.get(n)), lack = icons.filter(n => !paletteOf.get(n))
    if (!have.length) notes.push(`Palette "${palette}" is not one of these icons' palettes (palette ids differ per icon: list_palettes(name, style)): default colours shown.`)
    else if (lack.length) notes.push(`Palette "${palette}" exists for ${have.join(', ')} but not for ${lack.join(', ')}: those show their default colours.`)
  }
  if (palette || colors) {
    const cs = lib.colorSummary(entries, { keys: Object.keys(colors || {}), palette: !!palette, label: k => (k.startsWith('--') ? k : 'colors.' + k) })
    notes.push(...cs.notes); warnings.push(...cs.warnings)
  }
  const small = smallest(styles).filter(s => size < s.min)
  if (small.length) notes.push(`${small.map(s => `${s.name} (minSize ${s.min})`).join(', ')} ${small.length === 1 ? 'is' : 'are'} drawn at ${size}px, below the size ${small.length === 1 ? 'it reads' : 'they read'} well at (list_styles minSize): the sheet still shows ${small.length === 1 ? 'it' : 'them'}, but judge ${small.length === 1 ? 'it' : 'them'} larger.`)
  if (bg.dark) notes.push(`Dark background: outlines are drawn in a light ink (${INK.dark}) as list_styles onDark advises; fills of palette styles keep their colours (a palette tagged "on-dark", list_palettes, suits them).`)
  if (Math.max(L.width, L.height) > VIEW_PX) notes.push(`The sheet is ${L.width} x ${L.height} px: most image viewers shrink a picture beyond about ${VIEW_PX} px on a side, so small details soften. For a sharper look use fewer icons per call${L.matrix ? '' : ', more columns'} or a smaller size.`)
  if (plan.explicitColumns && L.matrix) notes.push('columns only applies to a one-style gallery; with several styles the sheet is a matrix (rows = icons, columns = styles).')

  const k = L.k
  const tileFill = `fill="${defaultInk}" fill-opacity="0.05"`
  const tiles = cells.map(c => `<rect x="${num(c.x)}" y="${num(c.y)}" width="${num(c.w)}" height="${num(c.h)}" rx="8" ${tileFill}/>`).join('')
  const sw = num(Math.max(1.1, 0.95 * k))
  const label = L.texts.length ? `<path d="${L.texts.join(' ')}" fill="none" stroke="${defaultInk}" stroke-opacity="0.78" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>` : ''
  const scale = num(size / 24)
  const body = cells.map(c => `<g transform="translate(${num(c.ix)} ${num(c.iy)}) scale(${scale})"${c.attrs}>${c.body}</g>`).join('')
  const title = `Preview of ${icons.join(', ')} in ${styles.join(', ')}`
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${L.width}" height="${L.height}" viewBox="0 0 ${L.width} ${L.height}" role="img" aria-label="${esc(title)}">` +
    `<title>${esc(title)}</title><rect width="${L.width}" height="${L.height}" fill="${bg.hex}"/>${tiles}${label}${body}</svg>`
  // ids (the rich styles' gradients) are unique per sheet: a suffix from the sheet's own fingerprint, so two sheets can share a page
  const tag = fingerprint(svg)
  svg = svg.replace(/(\bid="|url\(#|href="#)([\w-]+)(?=["')])/g, (all, a, id) => `${a}${id}_${tag}`)
  const reading = L.matrix
    ? `rows are icons (top to bottom: ${icons.join(', ')}), columns are styles (left to right: ${styles.join(', ')})${labels ? '; names are written on the left and the top' : '; no labels'}`
    : `${styles[0]} style, icons left to right then top to bottom: ${icons.join(', ')}${labels ? '; each name is under its icon' : '; no labels'}`
  return { svg, width: L.width, height: L.height, ink: defaultInk, cells: cells.length, rows: L.rows, columns: L.columns, layout: L.matrix ? 'matrix' : 'grid',
    grid: { cell: L.cell, gap: GAP, margin: MARGIN }, notes, warnings, reading }
}

/** Arguments -> the finished sheet: planPreview + buildSheet. Throws IconError for an unknown icon or style, or a limit. */
export function previewSheet(a = {}) {
  const plan = planPreview(a)
  return { ...buildSheet(plan), icons: plan.icons, styles: plan.styles, size: plan.size, background: plan.bg.hex, ...(Object.keys(plan.aliases).length ? { aliases: plan.aliases } : {}) }
}
