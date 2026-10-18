// forge/hand/chrome/keyboard.mjs — a wide chrome keyboard deck with big square key windows cut clean through it (a
// row of four over a staggered row of three) and a long gunmetal space bar set proud in a dark seam as the anchor.
// The generated drawing cut seven small round key holes whose gunmetal dots fell in as slivers, and the horizon broke
// into cloud shapes between them, so the keys were lost at 16px. Same model and paint as the generator
// (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

// a skeleton in the shape model() expects: parts [{ d, plate, fill }], cutouts [d]
function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

const r2 = v => Math.round(v * 100) / 100
// a rounded rectangle about (x, y), half sizes w h, corner r
const box = (x, y, w, h, r) => {
  const a = r2(x - w), b = r2(x + w), t = r2(y - h), u = r2(y + h)
  return `M${r2(a + r)} ${t}H${r2(b - r)}A${r} ${r} 0 0 1 ${b} ${r2(t + r)}V${r2(u - r)}A${r} ${r} 0 0 1 ${r2(b - r)} ${u}` +
    `H${r2(a + r)}A${r} ${r} 0 0 1 ${a} ${r2(u - r)}V${r2(t + r)}A${r} ${r} 0 0 1 ${r2(a + r)} ${t}Z`
}
const DECK = 'M4 4.5H20A2 2 0 0 1 22 6.5V17.5A2 2 0 0 1 20 19.5H4A2 2 0 0 1 2 17.5V6.5A2 2 0 0 1 4 4.5Z'
const KEYS = [
  ...[5.5, 9.8, 14.2, 18.5].map(x => box(x, 7.6, 1.2, 0.9, 0.5)),
  ...[7.65, 12, 16.35].map(x => box(x, 11.4, 1.2, 0.9, 0.5)),
]
const SPACE = 'M8.9 16.1H15.1'

export default function render(icon) {
  const name = (icon && icon.name) || 'keyboard'
  const Ls = layers(model(skeleton(name, [
    { d: DECK, plate: 'K', fill: true },
    { d: SPACE, plate: 'A' },
  ], KEYS)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
