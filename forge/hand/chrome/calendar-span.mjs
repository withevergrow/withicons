// forge/hand/chrome/calendar-span.mjs — a chrome calendar page with two gunmetal binder rings on top and a span of three rows cut through the face as rounded dash windows.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const run = (name, parts, cuts) => {
  const Ls = layers(model(skeleton(name, parts, cuts)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}

const r2 = v => Math.round(v * 100) / 100
const bar = (x0, x1, y, h = 1.0, r = 0.6) => {
  const t = r2(y - h), u = r2(y + h)
  return `M${r2(x0 + r)} ${t}H${r2(x1 - r)}A${r} ${r} 0 0 1 ${x1} ${r2(t + r)}V${r2(u - r)}A${r} ${r} 0 0 1 ${r2(x1 - r)} ${u}H${r2(x0 + r)}A${r} ${r} 0 0 1 ${x0} ${r2(u - r)}V${r2(t + r)}A${r} ${r} 0 0 1 ${r2(x0 + r)} ${t}Z`
}
const PAGE = 'M5 5H19A2 2 0 0 1 21 7V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V7A2 2 0 0 1 5 5Z'
export default function render(icon) {
  return run((icon && icon.name) || 'calendar-span', [
    { d: PAGE, plate: 'K', fill: true },
    { d: 'M3 10H21', plate: 'K' },
    { d: 'M8 3V7M16 3V7', plate: 'A' },
  ], ['M3 10H21', bar(6, 8.4, 13.7), bar(10.4, 17.6, 13.7), bar(6, 13.6, 17.5), bar(15.6, 18, 17.5)])
}
