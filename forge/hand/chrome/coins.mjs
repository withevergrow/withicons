// forge/hand/chrome/coins.mjs: a stack of three edged coins seen from above, with a groove between each coin edge and a
// dished recess on the top face, so it reads as coins (not pucks) at 16px. Chrome model and paint from _chrome-core.mjs;
// only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

const CX = 12, RX = 7.5, RY = 3.4, TOP = 6.4, T = 3.9, N = 3
const BOT = TOP + T * N
const BODY = `M${CX - RX} ${TOP}A${RX} ${RY} 0 0 1 ${CX + RX} ${TOP}V${BOT}A${RX} ${RY} 0 0 1 ${CX - RX} ${BOT}Z`
const FACE = `M${CX - RX} ${TOP}A${RX} ${RY} 0 1 1 ${CX + RX} ${TOP}A${RX} ${RY} 0 1 1 ${CX - RX} ${TOP}Z`
const seam = y => `M${CX - RX} ${y}A${RX} ${RY} 0 0 0 ${CX + RX} ${y}`
const DENT = `M${CX - 3.4} ${TOP}A3.4 1.2 0 1 1 ${CX + 3.4} ${TOP}A3.4 1.2 0 1 1 ${CX - 3.4} ${TOP}Z`
const CUTS = [seam(TOP + T), seam(TOP + 2 * T), DENT]

export default function render(icon) {
  const name = (icon && icon.name) || 'coins'
  const parts = [{ d: BODY, plate: 'K', fill: true }, { d: FACE, plate: 'K', fill: true }]
  const Ls = layers(model(skeleton(name, parts, CUTS)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
