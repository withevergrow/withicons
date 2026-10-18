// forge/hand/gloss/spider.mjs — hand-drawn gloss redraw, see the comment above render()
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

// ---- spider: round head and abdomen parted by a highlight gap, eight jointed legs standing clear of the body, silk thread ----
const L = ['M10.25 10.5 L7 7.25 L4.5 8.5', 'M9 13 L5 11.5 L3 13.5', 'M9 16 L5 16.5 L3.5 19', 'M10 18.25 L7.5 20 L7 21.5']
const R8 = ['M13.75 10.5 L17 7.25 L19.5 8.5', 'M15 13 L19 11.5 L21 13.5', 'M15 16 L19 16.5 L20.5 19', 'M14 18.25 L16.5 20 L17 21.5']
export default function render() {
  const head = region(ell(12, 9.6, 2.1, 2.05))
  const abd = region(ell(12, 15.1, 3.3, 3.8))
  cut(abd, head, 0.4)
  const eyes = union(region(ell(11.1, 9.5, 0.55, 0.6)), region(ell(12.9, 9.5, 0.55, 0.6)))
  cut(head, eyes)
  const legs = union(...[...L, ...R8].map(d => tube(d, 0.62)))
  cut(legs, union(head, abd), 0.4)
  const thread = tube('M12 2 V7.6', 0.4); cut(thread, head, 0.35)
  const Ha = hl(); streak(Ha, 'M9.9 16.9 C9.7 15.3 10.3 13.9 11.5 13.2', 0.4); splat(Ha, 14.4, 14.4, 0.26)
  const Rb = hl(); streak(Rb, 'M14.3 18.4 C13.6 19 12.8 19.2 12 19.2', 0.14)
  return [node(lit(head, hl()), 'wm-k'), node(lit(abd, Ha, Rb), 'wm-k'), node(lit(legs, hl()), 'wm-a'), node(lit(thread, hl()), 'wm-s')]
}
