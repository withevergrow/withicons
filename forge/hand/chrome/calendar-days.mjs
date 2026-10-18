// forge/hand/chrome/calendar-days.mjs — a chrome calendar page whose month is six rounded day windows (three by two)
// cut clean through the face, set well below the header groove with clear air between the rows so both survive 16px. The generated drawing cut six small dot holes
// and let gunmetal day dots fall into them, leaving slivers that read as X marks and vanished at 16px. Same model and
// paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
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

const PAGE = 'M5 5H19A2 2 0 0 1 21 7V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V7A2 2 0 0 1 5 5Z'
const HEADER = 'M3 10H21'
const RINGS = 'M8 3V7M16 3V7'
// the days: six big rounded-square windows cut clean through the face, three by two
const r2 = v => Math.round(v * 100) / 100
const day = (x, y, w = 1.4, h = 1.0, r = 0.6) => {
  const a = r2(x - w), b = r2(x + w), t = r2(y - h), u = r2(y + h)
  return `M${r2(a + r)} ${t}H${r2(b - r)}A${r} ${r} 0 0 1 ${b} ${r2(t + r)}V${r2(u - r)}A${r} ${r} 0 0 1 ${r2(b - r)} ${u}` +
    `H${r2(a + r)}A${r} ${r} 0 0 1 ${a} ${r2(u - r)}V${r2(t + r)}A${r} ${r} 0 0 1 ${r2(a + r)} ${t}Z`
}
const DAYS = [7, 12, 17].flatMap(x => [13.7, 17.5].map(y => day(x, y)))

export default function render(icon) {
  const name = (icon && icon.name) || 'calendar-days'
  const Ls = layers(model(skeleton(name, [
    { d: PAGE, plate: 'K', fill: true },
    { d: HEADER, plate: 'K' },
    { d: RINGS, plate: 'A' },
  ], [HEADER, ...DAYS])))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
