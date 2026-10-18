// forge/hand/chrome/blocks.mjs — three separate rounded chrome blocks stacked as a pyramid with clear gaps, one per block gradient.

import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate || 'K', pathId: p.id }))) }
}
const r2 = v => Math.round(v * 100) / 100
const f = (v, axis) => r2((v - 12) * K.SCALE + 12 + (axis ? K.TY : K.TX))
// transforms x y pairs (no arcs in inlay paths)
const TD = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${f(+x, 0)} ${f(+y, 1)}`)
const circ = (x, y, r) => `M${x + r} ${y} A${r} ${r} 0 1 1 ${x - r} ${y} A${r} ${r} 0 1 1 ${x + r} ${y} Z`
function paint(name, parts, cuts) {
  const Ls = layers(model(skeleton(name, parts, cuts)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
function glintLast(out) {
  const gi = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  if (gi >= 0) out.push(out.splice(gi, 1)[0])
  return out
}

const sq = (x, y, s) => `M${x + 1.5} ${y}H${x + s - 1.5}A1.5 1.5 0 0 1 ${x + s} ${y + 1.5}V${y + s - 1.5}A1.5 1.5 0 0 1 ${x + s - 1.5} ${y + s}H${x + 1.5}A1.5 1.5 0 0 1 ${x} ${y + s - 1.5}V${y + 1.5}A1.5 1.5 0 0 1 ${x + 1.5} ${y}Z`
export default function render(icon) {
  const name = (icon && icon.name) || 'blocks'
  const parts = [sq(8.9, 3.4, 6.2), sq(3.4, 13.4, 6.2), sq(14.4, 13.4, 6.2)].map(d => ({ d, fill: true }))
  return glintLast(paint(name, parts, []))
}
