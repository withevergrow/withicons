// forge/hand/chrome/rangoli-pattern.mjs — the common rangoli clover in liquid chrome: four chrome teardrop lobes round a pink enamel gem,
// four chrome arc bars on the outer ring and four gunmetal studs between them. Light, dark, bright: reads as a pattern, not a star.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col, K } from '../../styles/_chrome-core.mjs'

const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const M0 = 0.7
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)
const shrink = (A, e) => F.offset(F.copy(A), e)
const subs = d => parsePath(d).filter(s => s.pts && s.pts.length).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const line = (d, w, m = M0) => F.strokes(subs(d), w, m)
const blob = (d, m = M0) => F.region(subs(d).filter(s => s.closed || s.pts.length > 2).map(s => s.pts), m)
const circ = (x, y, r) => `M${x + r} ${y} A${r} ${r} 0 1 1 ${x - r} ${y} A${r} ${r} 0 1 1 ${x + r} ${y} Z`
const U = (...A) => A.reduce((a, b) => F.union(a, b))

const r = v => Math.round(v * 100) / 100
const rot = (p, deg) => { const a = deg * Math.PI / 180, x = p[0] - 12, y = p[1] - 12; return [12 + x * Math.cos(a) - y * Math.sin(a), 12 + x * Math.sin(a) + y * Math.cos(a)] }
// a teardrop lobe: round head of radius r at distance c from the centre, tip at distance t, turned deg
function petal(c, r, t, deg) {
  const d = c - t, phi = Math.acos(r / d) * 180 / Math.PI
  const pts = [[12, 12 - t]]
  // the head circle, angle 0 pointing at the tip: keep what lies past the tangent points
  const n = 40
  for (let i = 0; i <= n; i++) {
    const ang = (phi + (360 - 2 * phi) * i / n) * Math.PI / 180
    pts.push([12 + r * Math.sin(ang), 12 - c + r * Math.cos(ang)])
  }
  return pts.map(p => tf(rot(p, deg)))
}
export default function render(icon) {
  const name = (icon && icon.name) || 'rangoli-pattern'
  const lobes = F.field(M0)
  for (const deg of [0, 90, 180, 270]) F.region([petal(5.9, 2.9, 1.5, deg)], M0, lobes)
  const R = 10.5, arcD = deg => { const a = (deg - 22) * Math.PI / 180, b = (deg + 22) * Math.PI / 180, P = t => `${r(12 + R * Math.sin(t))} ${r(12 - R * Math.cos(t))}`; return `M${P(a)} A${R} ${R} 0 0 1 ${P(b)}` }
  const arcs = line([0, 90, 180, 270].map(arcD).join(' '), 2.4)
  const gem = blob(circ(12, 12, 1.5), 0.55 + 0.6)
  const moat = grow(gem, K.MOAT)
  const studs = blob([[19.4, 4.6], [19.4, 19.4], [4.6, 19.4], [4.6, 4.6]].map(([x, y]) => circ(x, y, 1.4)).join(' '))
  const body = minus(U(lobes, arcs), moat)
  const sil = U(F.copy(body), F.copy(studs), F.copy(gem))
  const Ls = layers({ T: {}, K: F.open(body, K.ROUND), Af: null, Ab: studs, S: gem, sil, txt: null, seam: null })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
