// forge/hand/chrome/heart.mjs: a plump, symmetric chrome heart with a deep top cleft and a soft rounded tip.
// Chrome model and paint from _chrome-core.mjs; only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

const HEART = 'M12 21 C11 20.2 2.6 14.9 2.6 8.8 C2.6 5.6 5 3.3 7.9 3.3 C9.7 3.3 11.2 4.3 12 5.9 C12.8 4.3 14.3 3.3 16.1 3.3 C19 3.3 21.4 5.6 21.4 8.8 C21.4 14.9 13 20.2 12 21 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'heart'
  const Ls = layers(model(skeleton(name, [{ d: HEART, plate: 'K', fill: true }])))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
