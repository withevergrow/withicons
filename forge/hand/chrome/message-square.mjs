// forge/hand/chrome/message-square.mjs: a plump chrome speech bubble, a rounded square with its tail at the bottom left.
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

const dot = (x, y, r) => 'M' + (x + r) + ' ' + y + 'A' + r + ' ' + r + ' 0 1 1 ' + (x - r) + ' ' + y + 'A' + r + ' ' + r + ' 0 1 1 ' + (x + r) + ' ' + y + 'Z'
const DOTS = [7.9, 12, 16.1].map(x => dot(x, 10.4, 1.2))
const BUBBLE = 'M2.6 21.4 V6.4 A2.6 2.6 0 0 1 5.2 3.8 H18.8 A2.6 2.6 0 0 1 21.4 6.4 V14.4 A2.6 2.6 0 0 1 18.8 17 H8 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'message-square'
  const Ls = layers(model(skeleton(name, [{ d: BUBBLE, plate: 'K', fill: true }], DOTS)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
