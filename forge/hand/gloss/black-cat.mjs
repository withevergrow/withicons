// forge/hand/gloss/black-cat.mjs — hand-drawn gloss redraw, see the comment above render()
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

// ---- black cat: arched standing side view, head right, tail curling up on the left, slit-pupil eyes ----
const BODY = 'M6 21 C6 18 5.5 15 6 12.5 C7 9 9 6.5 11.5 6.5 C13 6.5 14 7.25 14.75 8 C14.75 6.5 15 5.25 15.5 4 L17.25 5.75 H18.75 L20.5 4 C21 5.25 21.25 6.5 21.25 8 C21.25 10.5 20 12 18 12.25 C17.5 12.5 17.25 13 17.25 13.75 L17.5 21 H15.25 L15 16.25 C13.5 14.25 10 14.25 8.25 16.25 L8 21 Z'
export default function render() {
  const body = soft(BODY, 0.45)
  const eye = cx => { const e = region(ell(cx, 8.7, 1.2, 1.4)); cut(e, tube(`M${cx} 7.4 V10`, 0.3)); return e }
  cut(body, union(eye(16.75), eye(19.65)))
  const tail = tube('M6.2 13.6 C3.25 12.5 2.5 9 3.5 6.5 C4 5.25 3.75 4 2.6 3.5', 0.95)
  cut(tail, body, 0.4)
  const H = hl()
  streak(H, 'M7.5 12.6 C8.3 10.2 9.5 8.7 11.2 8.2', 0.4)
  streak(H, 'M7.2 19.6 C7.1 17.6 7.3 15.6 7.9 14.2', 0.36)
  streak(H, 'M16.1 19.8 L16.2 18.2', 0.24)
  splat(H, 20.3, 6.5, 0.28)
  const Ht = hl(); streak(Ht, 'M3.3 11.4 C2.7 10 2.7 8.5 3.1 7.3', 0.26)
  const R = hl()
  streak(R, 'M14.6 11.2 C14.2 12.2 13.6 12.8 12.8 13.2', 0.14)
  return [node(lit(body, H, R), 'wm-k'), node(lit(tail, Ht), 'wm-a')]
}
