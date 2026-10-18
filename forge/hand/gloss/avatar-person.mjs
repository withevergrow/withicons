// forge/hand/gloss/avatar-person.mjs — a neutral vinyl bust: an oval face under a smooth rounded hair cap with a soft
// fringe swept up to the right, cut free of the face by a deep hairline groove, carved eyes and smile, and the shoulders
// as their own pillow. The generated drawing merged hair, face and neck into one mass with a hairline scratch, so the
// face was lost at 16px; here the face reads as its own shape.
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

export default function render() {
  const hair = soft('M6.4 10.4 C5.6 5.9 8.2 2.85 12 2.85 C15.8 2.85 18.4 5.9 17.6 10.4 Z', 0.4)
  const head = union(hair, region(ell(12, 10.5, 5.5, 6)))
  // hairline: a soft fringe sweeping up to the right
  cut(head, tube('M6.1 11.2 C6.5 9.55 7.65 8.6 9.5 8.6 C11.6 8.6 13.85 8.1 15.05 6.95 C16.6 7.75 17.45 9.3 17.9 11.2', 0.48))
  cut(head, region(ell(9.5, 11.1, 0.8, 1.05)))
  cut(head, region(ell(14.5, 11.1, 0.8, 1.05)))
  cut(head, tube('M10.1 13.75 C11.1 14.7 12.9 14.7 13.9 13.75', 0.55))
  const body = region('M4.25 20.75 C4.25 19.1 6.1 18 8.5 18 C9.75 18 10.75 18.65 12 18.65 C13.25 18.65 14.25 18 15.5 18 C17.9 18 19.75 19.1 19.75 20.75 C19.75 21.3 19.4 21.6 18.85 21.6 H5.15 C4.6 21.6 4.25 21.3 4.25 20.75 Z', 0.55)
  const H = hl()
  streak(H, 'M7.05 7.9 C7.5 5.85 9 4.3 11 3.9', 0.4)
  streak(H, 'M4.9 20.9 C5.05 19.75 6.15 18.85 7.9 18.7', 0.32)
  const R = hl()
  streak(R, 'M17.25 12.9 C16.95 14.2 16.3 15.25 15.35 16', 0.15)
  streak(R, 'M16.2 21.75 C17.6 21.75 18.85 21.6 19.6 21.1', 0.14)
  return [node(lit(head, H, R), 'wm-k'), node(lit(body, H, R), 'wm-k')]
}
