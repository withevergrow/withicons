// forge/hand/gloss/poinsettia.mjs — hand-drawn gloss redraw, see the comment above render()
import { distField, evenOddMask, contours, ringsToD, segsOf, NN, N, gx } from '../../styles/_gloss-field.mjs'
import { parsePath, resample } from '../../kernel/geom.mjs'

// ---- the gloss field kit (same SDF modelling and highlight rim as forge/styles/gloss.mjs) ----
const BAND = 4.5, RIM = 0.5
const subs = d => parsePath(d, 0.1).filter(s => s.pts.length)
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
const poly = pts => 'M' + pts.map(p => p[0].toFixed(3) + ' ' + p[1].toFixed(3)).join('L') + 'Z'
const ell = (cx, cy, rx, ry) => poly(Array.from({ length: 96 }, (_, i) => { const a = i * Math.PI / 48; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] }))

// ---- poinsettia: two layers of pointed, veined bracts (five big behind, five short in front, parted by a gap) around a cluster of three beads ----
const leaf = (ang, len, wid, r0 = 0.6) => {
  const ca = Math.cos(ang), sa = Math.sin(ang), up = [], dn = []
  for (let i = 0; i <= 24; i++) {
    const t = i / 24, w = wid * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.7)), 0.8), a = r0 + (len - r0) * t
    up.push([12 + ca * a - sa * w, 12 + sa * a + ca * w]); dn.push([12 + ca * a + sa * w, 12 + sa * a - ca * w])
  }
  return poly([...up, ...dn.reverse()])
}
const axis = (ang, a, b) => 'M' + (12 + Math.cos(ang) * a).toFixed(2) + ' ' + (12 + Math.sin(ang) * a).toFixed(2) + ' L' + (12 + Math.cos(ang) * b).toFixed(2) + ' ' + (12 + Math.sin(ang) * b).toFixed(2)
const D = Math.PI / 180
export default function render() {
  const outerA = [-90, -18, 54, 126, 198].map(a => a * D)
  const innerA = [-54, 18, 90, 162, 234].map(a => a * D)
  let outer = union(...outerA.map(a => soft(leaf(a, 10.4, 3.5), 0.45)))
  const innerR = innerA.map(a => soft(leaf(a, 6, 2.7), 0.4))
  const inner = union(...innerR)
  cut(outer, inner, 0.5)
  for (const a of outerA) cut(outer, tube(axis(a, 5.8, 9.2), 0.32))
  for (const a of innerA) cut(inner, tube(axis(a, 4.4, 5), 0.26))
  const hub = region(ell(12, 12, 2.7, 2.7))
  cut(outer, hub, 0.2); cut(inner, hub, 0.2)
  const beads = [[12, 10.9], [10.9, 12.9], [13.1, 12.9]].map(([x, y]) => region(ell(x, y, 1.05, 1.05)))
  const B = union(...beads)
  const H = hl()
  streak(H, 'M10.6 7.8 C10.4 6.3 10.8 5 11.5 4.1', 0.32)
  streak(H, 'M6.4 5.7 C6.9 4.9 7.6 4.5 8.3 4.5', 0.2)
  const Hi = hl(); streak(Hi, 'M9.2 9.2 C9.8 8.6 10.6 8.3 11.4 8.3', 0.22)
  const Hb = hl(); splat(Hb, 11.7, 10.4, 0.28)
  return [node(lit(outer, H), 'wm-k'), node(lit(inner, Hi), 'wm-k'), node(lit(B, Hb), 'wm-s')]
}
