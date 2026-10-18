// forge/hand/chrome/message-circle.mjs: a round chrome speech bubble, tail at the bottom left, three dots cut through.
// Sibling of message-square (same dots, same fat tube). Chrome model and paint from _chrome-core.mjs.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

const dot = (x, y, r) => 'M' + (x + r) + ' ' + y + 'A' + r + ' ' + r + ' 0 1 1 ' + (x - r) + ' ' + y + 'A' + r + ' ' + r + ' 0 1 1 ' + (x + r) + ' ' + y + 'Z'
const DOTS = [7.9, 12, 16.1].map(x => dot(x, 11.6, 1.2))
const BUBBLE = 'M9.57 20.68 A9.4 9.4 0 1 0 2.92 14.03 L2.6 21.4 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'message-circle'
  const Ls = layers(model(skeleton(name, [{ d: BUBBLE, plate: 'K', fill: true }], DOTS)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
