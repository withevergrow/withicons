// forge/hand/chrome/jalebi.mjs: a chrome jalebi: a plump coiled disc with a spiral groove cut through it and a short tail curling up at the upper right, so the coil reads at 16px.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate || 'K', pathId: p.id }))) }
}
function paint(name, parts, cuts) {
  const Ls = layers(model(skeleton(name, parts, cuts)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
const r2 = v => Math.round(v * 100) / 100
const circ = (x, y, r) => `M${r2(x + r)} ${y} A${r} ${r} 0 1 1 ${r2(x - r)} ${y} A${r} ${r} 0 1 1 ${r2(x + r)} ${y} Z`

// an Archimedean spiral groove from the centre out, a turn and three quarters
const CX = 11.6, CY = 13.6
function spiral() {
  const pts = []
  const T0 = 0.4, T1 = 2 * Math.PI * 1.6 + 0.4
  for (let t = T0; t <= T1 + 1e-6; t += 0.3) {
    const r = 0.9 + (t - T0) * 0.47
    pts.push(`${r2(CX + r * Math.cos(t))} ${r2(CY + r * Math.sin(t))}`)
  }
  return 'M' + pts.join(' L')
}

export default function render(icon) {
  const name = (icon && icon.name) || 'jalebi'
  return paint(name, [
    { d: circ(CX, CY, 8), fill: true },
    { d: 'M15.8 7.2 C17 4.6 19.4 3.8 21 5.4', plate: 'K' },
  ], [spiral()])
}
