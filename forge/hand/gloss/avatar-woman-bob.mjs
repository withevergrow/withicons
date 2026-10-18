// forge/hand/gloss/avatar-woman-bob.mjs — a vinyl bust with a bob: a rounded hair helmet whose side panels stop at the
// jaw, a face oval cut free of it by a deep parting groove (fringe and both cheeks), carved eyes and smile, and the
// shoulders as their own pillow. The generated drawing fused hair, face and shoulders into one blob with only a fringe
// line, so the face vanished; here the face reads as its own shape at 16px and the bob's silhouette frames it.
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
  // hair helmet: crown over the head, side panels ending square at the jaw (corners softened)
  const hair = soft('M4.25 14.5 C3.75 12.25 3.75 10 4.1 8 C4.75 4.6 8 2.6 12 2.6 C16 2.6 19.25 4.6 19.9 8 C20.25 10 20.25 12.25 19.75 14.5 Z', 0.85)
  const face = region(ell(12, 10.6, 5.3, 5.9))
  const head = union(hair, face)
  // the face is cut free of the hair: fringe across the brow, then down both cheeks to the hair's ends
  cut(head, tube('M7.4 14.9 C6.7 13.6 6.6 11.75 6.75 10.25 C7 8.75 7.6 7.75 8.4 7.1 C10.8 7.85 13.2 7.85 15.6 7.1 C16.4 7.75 17 8.75 17.25 10.25 C17.4 11.75 17.3 13.6 16.6 14.9', 0.5))
  // eyes and smile carved into the face
  cut(head, region(ell(9.6, 10.9, 0.8, 1.05)))
  cut(head, region(ell(14.4, 10.9, 0.8, 1.05)))
  cut(head, tube('M10.1 13.45 C11.1 14.45 12.9 14.45 13.9 13.45', 0.55))
  // shoulders: their own pillow below a clear neck gap
  const body = region('M4.25 20.75 C4.25 19.1 6.1 18 8.5 18 C9.75 18 10.75 18.65 12 18.65 C13.25 18.65 14.25 18 15.5 18 C17.9 18 19.75 19.1 19.75 20.75 C19.75 21.3 19.4 21.6 18.85 21.6 H5.15 C4.6 21.6 4.25 21.3 4.25 20.75 Z', 0.55)
  // light from the upper-left: a bean along the crown, a streak on the left shoulder, rim lights right
  const H = hl()
  streak(H, 'M5.35 10.6 C5.25 7.1 7.3 4.35 10.6 3.85', 0.42)
  streak(H, 'M4.9 20.9 C5.05 19.75 6.15 18.85 7.9 18.7', 0.32)
  const R = hl()
  streak(R, 'M19.25 9.5 C19.45 10.9 19.4 12.4 19.1 13.6', 0.15)
  streak(R, 'M16.2 21.75 C17.6 21.75 18.85 21.6 19.6 21.1', 0.14)
  return [node(lit(head, H, R), 'wm-k'), node(lit(body, H, R), 'wm-k')]
}
