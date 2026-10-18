// forge/hand/gloss/avatar-man-turban.mjs — hand-drawn gloss redraw, see the comment above render()
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

// ---- turbaned man: domed wrap wider than the face, seam V, crossed fold grooves, face with eyes and smile ----
const WRAP = 'M6.75 9.25 C5.25 8.25 4.75 6.5 5.25 5.25 C6.25 3 9 2 12 2 C15 2 17.75 3 18.75 5.25 C19.25 6.5 18.75 8.25 17.25 9.25 C15.75 8.5 13.75 8.25 12 7.25 C10.25 8.25 8.25 8.5 6.75 9.25 Z'
const SH = 'M4.5 21.5 C4.5 19.25 6.25 18 8.5 18 C9.75 18 10.75 18.75 12 18.75 C13.25 18.75 14.25 18 15.5 18 C17.75 18 19.5 19.25 19.5 21.5 Z'
export default function render() {
  const wrap = soft(WRAP, 0.5)
  cut(wrap, tube('M6.3 7 C8.6 6.4 10.7 5 12 3.6', 0.32))
  cut(wrap, tube('M17.7 7 C15.4 6.4 13.3 5 12 3.6', 0.32))
  const face = region(ell(12, 10.5, 5.5, 6))
  cut(face, region(WRAP), 0.45)
  cut(face, union(region(ell(9.5, 10.9, 0.85, 1.05)), region(ell(14.5, 10.9, 0.85, 1.05)), tube('M10 13.5 C11 14.5 13 14.5 14 13.5', 0.4)))
  const sh = soft(SH, 0.6)
  const Hw = hl(); streak(Hw, 'M7.2 4.9 C7.8 4 9 3.4 10.4 3.3', 0.36); splat(Hw, 16.9, 4.7, 0.26)
  const Hf = hl(); streak(Hf, 'M7.6 12.6 C7.8 13.7 8.3 14.6 9 15.3', 0.3)
  const Hs = hl(); streak(Hs, 'M6.4 20.6 C6.6 19.6 7.4 19 8.4 18.9', 0.36)
  const Rs = hl(); streak(Rs, 'M16.8 20.8 C17.6 20.6 18.2 20.2 18.5 19.6', 0.14)
  return [node(lit(wrap, Hw), 'wm-k'), node(lit(face, Hf), 'wm-k'), node(lit(sh, Hs, Rs), 'wm-k')]
}
