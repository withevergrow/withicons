// forge/hand/chrome/stop.mjs — polished chrome stop button: a round chrome disc with a dark inset square, so it reads as stop, not a plain square.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const box = (x, y, w, h) => `M${x} ${y}H${x + w}V${y + h}H${x}Z`
const run = (name, parts, cuts) => emit(layers(model(skeleton(name, parts, cuts))), name, 0)
export default function render(icon) {
  return run((icon && icon.name) || 'stop', [
    { d: disc(12, 12, 9.5), plate: 'K' },
    { d: 'M9.5 8H14.5C15.33 8 16 8.67 16 9.5V14.5C16 15.33 15.33 16 14.5 16H9.5C8.67 16 8 15.33 8 14.5V9.5C8 8.67 8.67 8 9.5 8Z', plate: 'A' },
  ])
}
