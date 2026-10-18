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

// forge/hand/gloss/nutcracker.mjs — a glossy vinyl nutcracker soldier: plumed ball on a tall shako, a brim, a round

// forge/hand/gloss/dumpling.mjs — a glossy vinyl jiaozi: a half-moon (domed top, flatter belly, pointed tips) whose
// folded top edge is crimped: five bold pleat notches cut from the arc and fanning inward, so the edge reads scalloped.
// Replaces the symmetric bun with three vertical strokes.
const CX = 12, CY = 18, R = 10
const at = (deg, r = R) => [CX + r * Math.sin(deg * Math.PI / 180), CY - r * Math.cos(deg * Math.PI / 180)]
const f2 = v => +v.toFixed(2)
export default function render() {
  const body = soft('M1.5 18 C1.8 12.2 6.2 8.4 12 8.4 C17.8 8.4 22.2 12.2 22.5 18 C21.3 19.6 17 20.2 12 20.2 C7 20.2 2.7 19.6 1.5 18 Z', 0.45)
  const slits = [-58, -29, 0, 29, 58].map(a => { const [x1, y1] = at(a, 11.4), [x2, y2] = at(a, 6.6); return `M${f2(x1)} ${f2(y1)} L${f2(x2)} ${f2(y2)}` }).join(' ')
  cut(body, tube(slits, 0.5))
  const H = hl()
  streak(H, 'M4.4 17.2 C5.6 16.2 7.2 15.7 8.8 15.7', 0.34)
  const R2 = hl()
  streak(R2, 'M15 18.8 C17 18.5 19 17.6 20 16.4', 0.13)
  return [node(lit(body, H, R2), 'wm-k')]
}
