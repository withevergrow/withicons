// forge/hand/chrome/bus.mjs — a polished chrome bus seen from the front: a tall rounded body with a slim destination
// slot over one wide windscreen cut clean through, two gunmetal headlights set in on dark seams, and two gunmetal tyres
// standing behind the bumper. The generator turned both belt lines into full-width gunmetal bars, so the front read as
// a stack of dense stripes; here there is one window and one sign, as in every other style. Same paint as the generator.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const reg = (d, into = null) => F.region(rings(d), M0, into)
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const BODY = rr(3.5, 1.75, 20.5, 19.25, 2.5)
const SIGN = rr(7.5, 3.6, 16.5, 4.9, 0.65)
const SCREEN = rr(5.6, 6.6, 18.4, 12.4, 1)
const LIGHTS = [[7.6, 15.6], [16.4, 15.6]], LR = 1.4
const TYRES = rr(5.5, 17.5, 8.75, 22.25, 1.1) + rr(15.25, 17.5, 18.5, 22.25, 1.1)

export default function render(icon) {
  const name = (icon && icon.name) || 'bus'
  const body = reg(BODY)
  const holes = reg(SIGN); reg(SCREEN, holes)
  const lights = reg(LIGHTS.map(([x, y]) => disc(x, y, LR)).join(''))
  const g = grow(lights, 0.42)
  const K = F.open(minus(minus(body, holes), g), 0.32)
  const seam = F.intersect(F.copy(g), body)
  const tyres = F.open(minus(reg(TYRES), grow(body, 0.3)), 0.25)
  const sil = minus(body, holes); F.union(sil, tyres)
  const Ls = layers({ T: {}, K, Af: lights, Ab: tyres, S: null, sil, txt: null, seam })
  // the bus idles as one: every drawn layer is the body
  for (const L of Ls.list) L.cls = L.cls === 'wm-shine' || L.cls === 'wm-shadow' ? L.cls : 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
