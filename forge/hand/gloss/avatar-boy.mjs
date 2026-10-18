// forge/hand/gloss/avatar-boy.mjs — a vinyl bust of a boy: a big round head with two cowlick tufts springing up from a
// messy hair cap, the cap cut free of the face by a deep notched hairline groove, wide carved eyes and smile, and narrow
// child-size shoulders as their own pillow. The generated drawing fused head and shoulders into one blob and read like
// avatar-man; the round head, tufts and small shoulders now tell the boy apart at 16px.
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
  const hair = soft('M5.75 11 C5 8.5 5.5 5.5 8.5 4.25 C8.75 3 9.75 2.25 11 2 C10.75 2.75 11 3.25 11.75 3.5 C12.75 2.5 14.5 2 16.5 2.25 C15.75 2.75 15.5 3.5 15.75 4.25 C17.75 5.25 19 8.25 18.25 11 Z', 0.45)
  const head = union(hair, region(ell(12, 11, 6.25, 6.25)))
  // hairline: a messy fringe with a notch, sideburn to sideburn
  cut(head, tube('M5.45 11.8 C5.95 9.6 7.4 8.4 9 7.75 C10.5 7.05 12.6 7.2 13.75 8.25 L15.25 7.75 C16.75 8.25 17.95 9.6 18.55 11.8', 0.48))
  cut(head, region(ell(9.5, 12.1, 0.85, 1.1)))
  cut(head, region(ell(14.5, 12.1, 0.85, 1.1)))
  cut(head, tube('M10.1 14.75 C11.1 15.7 12.9 15.7 13.9 14.75', 0.55))
  // small shoulders below a clear neck gap
  const body = region('M6.75 20.85 C6.75 19.7 7.9 18.85 9.75 18.85 C10.75 18.85 11.25 19.35 12 19.35 C12.75 19.35 13.25 18.85 14.25 18.85 C16.1 18.85 17.25 19.7 17.25 20.85 C17.25 21.3 16.95 21.6 16.5 21.6 H7.5 C7.05 21.6 6.75 21.3 6.75 20.85 Z', 0.5)
  const H = hl()
  streak(H, 'M6.75 8.6 C7 7 7.9 5.75 9.4 5.05', 0.4)
  streak(H, 'M7.35 20.95 C7.45 20.05 8.2 19.45 9.3 19.35', 0.28)
  const R = hl()
  streak(R, 'M17.85 13.4 C17.45 14.8 16.65 15.9 15.55 16.65', 0.15)
  streak(R, 'M14.8 21.75 C15.8 21.75 16.6 21.6 17.05 21.2', 0.13)
  return [node(lit(head, H, R), 'wm-k'), node(lit(body, H, R), 'wm-k')]
}
