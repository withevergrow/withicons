// forge/hand/chrome/scroll-text.mjs — a chrome scroll: two fat rollers that stand about 1u past a wide sheet, each
// with a gunmetal end knob peeking out at both ends so they read as cylinders with the paper wound on them, parted
// from the sheet by clean grooves, and three lines of text printed in ink on the sheet (the mirror horizon steps out
// from under the print, as it does for the style's Live text). The generated drawing kept the rollers barely wider
// than the sheet; flat pills over a narrow sheet read as an I-beam. Same model and paint as the generator
// (_chrome-core.mjs); only the geometry and the print are drawn here. The print is the text part (wm-a) the motion
// spec floats; the knobs move with the body.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

// a skeleton in the shape model() expects: parts [{ d, plate, fill }], cutouts [d]
function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const r2 = v => Math.round(v * 100) / 100
const X = x => r2((x - 12) * K.SCALE + 12 + K.TX)
const Y = y => r2((y - 12) * K.SCALE + 12 + K.TY)

const TOP = 'M6 2.75H18A1.75 1.75 0 0 1 18 6.25H6A1.75 1.75 0 0 1 6 2.75Z'
const BOTTOM = 'M6 17.75H18A1.75 1.75 0 0 1 18 21.25H6A1.75 1.75 0 0 1 6 17.75Z'
const SHEET = 'M6.5 6.5H17.5V17.5H6.5Z'
// end knobs: short gunmetal spindles behind each roller end
const KNOBS = ['M3 4.5H4', 'M20 4.5H21', 'M3 19.5H4', 'M20 19.5H21']
// where the sheet rolls into each roller
const ROLLS = ['M3 7H21', 'M3 17H21']
// printed lines: two full, one short
const PRINT = [[9, 15, 9.5], [9, 15, 12], [9, 13, 14.5]]

export default function render(icon) {
  const name = (icon && icon.name) || 'scroll-text'
  const glyphs = PRINT.map(([a, b, y]) => ({ pts: [[a, y], [b, y]], closed: false }))
  const Ls = layers(model(skeleton(name, [
    { d: TOP, plate: 'K', fill: true },
    { d: BOTTOM, plate: 'K', fill: true },
    { d: SHEET, plate: 'K', fill: true },
    ...KNOBS.map(d => ({ d, plate: 'A' })),
  ], ROLLS), { glyphs }))
  for (const L of Ls.list) if (!L.cls || L.cls === 'wm-a') L.cls = 'wm-k'
  const out = emit(Ls, name, 0)
  const d = PRINT.map(([a, b, y]) => `M${X(a)} ${Y(y)}H${X(b)}`).join('')
  const base = { d, fill: 'none', 'stroke-linecap': 'round', class: 'wm-a' }
  out.push(['path', { ...base, stroke: col('edge'), 'stroke-width': 1.8 }])
  out.push(['path', { ...base, stroke: col('ink'), 'stroke-width': 1 }])
  return out
}
