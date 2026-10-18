// forge/hand/gloss/avatar-person-wheelchair.mjs: seated person in a wheelchair: round head on a neck joined to the torso, bent legs to a slim footrest, one clean glossy wheel ring.
import { distField, evenOddMask, contours, ringsToD, segsOf, NN, N, gx } from '../../styles/_gloss-field.mjs'
import { parsePath, resample } from '../../kernel/geom.mjs'

// ---- the gloss field kit (same SDF modelling and highlight rim as forge/styles/gloss.mjs) ----
const BAND = 4.5, RIM = 0.5
const subs = d => parsePath(d, 0.1).filter(s => s.pts.length)
// a vertex lying exactly on one of the field's 0.1u scanline rows can drop that row's crossing: lift it a hair
const offRow = y => { const t = (y + 0.8) * 10; return Math.abs(t - Math.round(t)) < 1e-3 ? y + 0.003 : y }
const region = (d, g = 0) => {
  const ss = subs(d), m = evenOddMask(ss.map(s => s.pts.map(([x, y]) => [x, offRow(y)])))
  const df = distField(segsOf(ss.map(s => ({ pts: s.pts, closed: true }))), BAND), F = new Float32Array(NN)
  for (let k = 0; k < NN; k++) F[k] = (m[k] ? df[k] : -df[k]) + g
  return F
}
const soft = (d, r) => region(ringsToD(contours(region(d, -r), 0)), r)   // round every convex corner by r
const tube = (d, r) => { const df = distField(segsOf(subs(d)), BAND), F = new Float32Array(NN); for (let k = 0; k < NN; k++) F[k] = r - df[k]; return F }
const union = (...fs) => { const o = Float32Array.from(fs[0]); for (const f of fs.slice(1)) for (let k = 0; k < NN; k++) if (f[k] > o[k]) o[k] = f[k]; return o }
const cut = (a, b, gap = 0) => { for (let k = 0; k < NN; k++) a[k] = Math.min(a[k], -b[k] - gap); return a }
const splat = (H, x, y, r) => {
  const i0 = Math.max(0, Math.floor((x - r - 0.3 - gx(0)) * 10)), i1 = Math.min(N - 1, Math.ceil((x + r + 0.3 - gx(0)) * 10))
  const j0 = Math.max(0, Math.floor((y - r - 0.3 - gx(0)) * 10)), j1 = Math.min(N - 1, Math.ceil((y + r + 0.3 - gx(0)) * 10))
  for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) { const k = j * N + i, v = r - Math.hypot(gx(i) - x, gx(j) - y); if (v > H[k]) H[k] = v }
}
const streak = (H, d, w, tip = 0.1) => { for (const s of subs(d)) resample(s.pts, 0.08).forEach(({ p, u }) => splat(H, p[0], p[1], tip + (w - tip) * Math.pow(Math.sin(Math.PI * u), 0.5))) }
// specular holes keep RIM of body to the edge; the reflected rim light (R) sits a hairline inside the shadow side
const lit = (B, H, R) => { const S = new Float32Array(NN); for (let k = 0; k < NN; k++) { let v = Math.max(-H[k], RIM - B[k]); if (R) v = Math.min(v, Math.max(-R[k], 0.33 - B[k])); S[k] = Math.min(B[k], v) } return S }
const node = (S, cls) => ['path', { d: ringsToD(contours(S, 0)), 'fill-rule': 'evenodd', class: cls }]
const hl = () => new Float32Array(NN).fill(-9)
// ellipses and rounded rects as polygons
const poly = pts => 'M' + pts.map(p => p[0].toFixed(3) + ' ' + p[1].toFixed(3)).join('L') + 'Z'
const ell = (cx, cy, rx, ry) => poly(Array.from({ length: 96 }, (_, i) => { const a = i * Math.PI / 48; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] }))

  const hair = soft('M6.4 10.4 C5.6 5.9 8.2 2.85 12 2.85 C15.8 2.85 18.4 5.9 17.6 10.4 Z', 0.4)
  const head = union(hair, region(ell(12, 10.5, 5.5, 6)))
  // hairline: a soft fringe sweeping up to the right

export default function render() {
  const head = region(ell(9.6, 4.2, 2.3, 2.3))
  const body = union(tube('M9.4 8.4 L9.6 13.2 H14.6 L16.4 18.4', 1.45), region(ell(9.6, 9.6, 2.3, 2.6)))
  const foot = tube('M15.6 19.4 H19.2', 0.6)
  const chair = tube('M6.6 9.6 V13.8 H15', 0.55)
  const wheel = tube(ell(9.4, 16.6, 4.6, 4.6), 0.85)
  cut(wheel, body, 0.45); cut(chair, body, 0.45); cut(foot, body, 0.4)
  const H = hl()
  streak(H, 'M8.2 3.6 C8.5 2.9 9 2.5 9.6 2.4', 0.3)
  streak(H, 'M8 8.9 C8.3 8.1 8.8 7.6 9.4 7.5', 0.3)
  streak(H, 'M5.6 14.4 C6.1 13.2 7 12.4 8 12.1', 0.22)
  const R = hl()
  streak(R, 'M11.4 5 C11.2 5.7 10.8 6.1 10.3 6.3', 0.12)
  return [node(lit(head, H, R), 'wm-k'), node(lit(body, H, R), 'wm-k'), node(lit(union(wheel, chair, foot), H, R), 'wm-a')]
}
