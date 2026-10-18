// forge/hand/liquid/check.mjs — the tick as one bolder glass rod (about a third heavier than the generated 2.3u tube),
// so its refraction band and rims stay a solid mark at 16px instead of a pale hairline. Same model and paint as the
// generator (_liquid-core.mjs build); only the geometry is drawn here: the 4.5,12.5 -> 9.5,17.5 -> 19.5,6.5 polyline
// offset into ONE closed outline (round caps, round outer joint, mitred inner joint), passed as a single K part so the
// glass gets one rim, one refraction band and no seam at the joint.
import { build } from '../../styles/_liquid-core.mjs'

const r3 = v => Math.round(v * 1000) / 1000
const TICK = [[4.5, 12.5], [9.5, 17.5], [19.5, 6.5]]
const H = 0.4 // half-width of the outline (the K outline stroke adds 1.3u on top)

const unit = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [dx / l, dy / l] }
const add = (p, v, s) => [p[0] + v[0] * s, p[1] + v[1] * s]
// points on the circle of radius H around c, from angle t0 sweeping by dt (exclusive of the start)
function arc(c, t0, dt, n) {
  const out = []
  for (let i = 1; i < n; i++) { const q = t0 + dt * i / n; out.push([c[0] + H * Math.cos(q), c[1] + H * Math.sin(q)]) }
  return out
}
const ang = v => Math.atan2(v[1], v[0])
// signed sweep from a to b, in the direction given by sign
const sweep = (a, b, sign) => { let d = b - a; while (sign > 0 && d <= 0) d += 2 * Math.PI; while (sign < 0 && d >= 0) d -= 2 * Math.PI; return d }

function outline() {
  const [A, B, C] = TICK
  const d1 = unit(A, B), d2 = unit(B, C)
  // left normals (y down): both point to the outside of the V (below the joint)
  const n1 = [-d1[1], d1[0]], n2 = [-d2[1], d2[0]]
  const m1 = [-n1[0], -n1[1]], m2 = [-n2[0], -n2[1]]
  // inner mitre: where the two inner edges meet
  const p = add(B, m1, H), q = add(B, m2, H)
  const den = d1[0] * d2[1] - d1[1] * d2[0]
  const t = ((q[0] - p[0]) * d2[1] - (q[1] - p[1]) * d2[0]) / den
  const M = add(p, d1, t)
  const pts = []
  // outer side of AB, round outer joint at B, outer side of BC
  pts.push(add(A, n1, H), add(B, n1, H))
  pts.push(...arc(B, ang(n1), sweep(ang(n1), ang(n2), -1), 6))
  pts.push(add(B, n2, H), add(C, n2, H))
  // round cap at C (through the direction of travel)
  pts.push(...arc(C, ang(n2), sweep(ang(n2), ang(m2), -1), 10))
  // inner side back to the mitre, then to A
  pts.push(add(C, m2, H), M, add(A, m1, H))
  // round cap at A
  pts.push(...arc(A, ang(m1), sweep(ang(m1), ang(n1), -1), 10))
  return pts.map(([x, y]) => [r3(x), r3(y)])
}

export default function render(icon) {
  const name = (icon && icon.name) || 'check'
  const pts = outline()
  return build({
    name, paths: [], cutouts: [],
    lines: [{ pts, closed: true, plate: 'K', pathId: 'p0' }],
    fills: [{ subs: [{ pts, closed: true }], set: [pts] }],
  })
}
