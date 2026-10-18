// forge/hand/chrome/baby.mjs — a round chrome baby face: two small ears, a gunmetal top curl, two dot eyes and a smile cut through the head.
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

export default function render(icon) {
  return run((icon && icon.name) || 'baby', [
    { d: disc(12, 13, 8), plate: 'K', fill: true },
    { d: 'M4.25 11.25A1.9 1.9 0 0 0 4.25 14.75Z', plate: 'K', fill: true },
    { d: 'M19.75 11.25A1.9 1.9 0 0 1 19.75 14.75Z', plate: 'K', fill: true },
    { d: 'M12.5 4.6C14 5.2 14 7.6 12 7.6', plate: 'A' },
  ], [disc(8.9, 12.6, 1.2), disc(15.1, 12.6, 1.2), 'M8.6 16.2C10.2 18.8 13.8 18.8 15.4 16.2C13.6 17.4 10.4 17.4 8.6 16.2Z'])
}
