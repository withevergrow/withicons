// forge/hand/chrome/frown.mjs — a round chrome face with two dot eyes and one clear downturned crescent mouth cut through it.
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
  return run((icon && icon.name) || 'frown', [
    { d: disc(12, 12, 9.5), plate: 'K', fill: true },
  ], [disc(8.6, 9.6, 1.25), disc(15.4, 9.6, 1.25), 'M7.2 17.6C9.4 13.6 14.6 13.6 16.8 17.6C14.4 15.6 9.6 15.6 7.2 17.6Z'])
}
