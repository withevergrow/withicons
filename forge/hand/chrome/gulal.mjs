// forge/hand/chrome/gulal.mjs — a deep round chrome bowl heaped with pink gulal powder, two powder puffs floating above.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => !p.nofill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const run = (name, parts, cuts) => emit(layers(model(skeleton(name, parts, cuts))), name, 0)
export default function render(icon) {
  const name = (icon && icon.name) || 'gulal'
  return run(name, [
    { d: 'M2.5 12H21.5C21.5 17.8 17.5 21.5 12 21.5C6.5 21.5 2.5 17.8 2.5 12Z' },
    { d: 'M5 11.2C7.6 10.2 9.4 5.6 12 5.6C14.6 5.6 16.4 10.2 19 11.2Z', plate: 'S' },
    { d: disc(6.3, 4.6, 1.3), plate: 'S' },
    { d: disc(18.3, 4, 1.4), plate: 'S' },
  ])
}
