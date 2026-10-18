// forge/hand/chrome/pencil.mjs: a chrome pencil with a long sharp cone, a gunmetal ferrule band across the barrel and a
// hot-pink eraser jewel at the end, on the line pencil's diagonal. The generated one fused the ferrule bars and the tip into
// muddy grey; here the barrel is a filled region only (no inflated centre line), so the tip stays sharp, and the ferrule
// and eraser are separate pieces drawn as their own inset rings (the style inflates a ring back to its outline).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

const T = [3.1, 20.9], U = [0.7071, -0.7071], N = [0.7071, 0.7071], HW = 3.5
const P = (s, t) => [T[0] + s * U[0] + t * N[0], T[1] + s * U[1] + t * N[1]]
const f = v => Math.round(v * 100) / 100
const pt = p => `${f(p[0])} ${f(p[1])}`
const S0 = 7, FC = 19.4, F1 = 19.8, EST = 20.9, E = 24.6, R = 1.7
const arc = (r, s, t) => `A${r} ${r} 0 0 1 ${pt(P(s, t))}`
// the barrel, from the tip to a rounded end
const end = (s0, e, hw, r) => `L${pt(P(e - r, -hw))} ${arc(r, e, -hw + r)} L${pt(P(e, hw - r))} ${arc(r, e - r, hw)} L${pt(P(s0, hw))} Z`
const BODY = `M${pt(T)} L${pt(P(S0, -HW))} L${pt(P(F1, -HW))} L${pt(P(F1, HW))} L${pt(P(S0, HW))} Z`
// ferrule: one stroke across the barrel (the style swells it to a 2.25 gunmetal band with round ends)
const FERRULE = `M${pt(P(FC, -HW + 1.2))} L${pt(P(FC, HW - 1.2))}`
// eraser: a ring inset by the jewel's half stroke (1.22), and its own fill
const d = 1.22
const ERASER = `M${pt(P(EST + d, -HW + d))} ${end(EST + d, E - d, HW - d, Math.max(R - d, 0.5))}`

const prep = x => { const subs = parsePath(x); return { d: x, subs, set: setOf(subs.map(s => s.pts)) } }
function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p[0], plate: p[1], subs: parsePath(p[0]) }))
  const lines = paths.filter(p => p.plate !== 'K').flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id })))
  return { name, paths, lines, fills: parts.filter(p => p[2]).map(p => prep(p[0])), cutouts: [] }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'pencil'
  const one = (d, plate, fill) => layers(model(skeleton(name, [[d, plate, fill]])))
  const body = one(BODY, 'K', 1), ferrule = one(FERRULE, 'A'), eraser = one(ERASER, 'S', 1)
  for (const L of body.list) if (!L.cls) L.cls = 'wm-k'
  for (const L of ferrule.list) L.cls = 'wm-a'
  for (const L of eraser.list) L.cls = 'wm-s'
  return emit({ list: [...body.list, ...ferrule.list, ...eraser.list], glint: body.glint }, name, 0)
}
