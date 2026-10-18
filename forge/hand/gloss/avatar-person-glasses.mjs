// forge/hand/gloss/avatar-person-glasses.mjs — a vinyl bust in spectacles: two modest lens windows, each ringed by a
// black frame that stands proud of the face behind a carved groove, joined by a thin bridge with short temple arms out
// to the face edge; a side-parted fringe that dips on the left and sweeps up to the right; and the shoulders as their
// own pillow. The earlier drawing had two huge frameless lens windows (a domino mask) under a flat skullcap; here the
// frames and the hair read as glasses and hair at 16px.
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
const rr = (x0, y0, x1, y1, r) => { const c = [[x1 - r, y0 + r], [x1 - r, y1 - r], [x0 + r, y1 - r], [x0 + r, y0 + r]], pts = []; c.forEach(([x, y], q) => { for (let i = 0; i <= 12; i++) { const a = (q - 1) * Math.PI / 2 + i * Math.PI / 24; pts.push([x + r * Math.cos(a), y + r * Math.sin(a)]) } }); return poly(pts) }

export default function render() {
  // head: the face oval with a fuller hair dome on top (widened to the family's optical size)
  const sil = union(region(ell(12, 10.5, 5.9, 6.15)), region(ell(12, 8.3, 6.05, 5.25))), head = Float32Array.from(sil)
  // side-parted fringe: dips low across the left brow, sweeps up to the part on the right, edge to edge
  cut(head, tube('M5.9 8.9 C6.3 7.5 7.4 6.75 9.1 6.7 C11.1 6.65 13 6.25 14.3 5.2 C16.1 5.9 17.45 7.2 18.1 8.9', 0.48))
  // spectacles: frame rings (lens + 0.95u), a thin bridge and short temple arms at lens mid-height
  const lensL = rr(7.65, 10, 10.85, 12.6, 0.9), lensR = rr(13.15, 10, 16.35, 12.6, 0.9)
  const frames = union(
    region(rr(6.7, 9.05, 11.8, 13.55, 1.85)), region(rr(12.2, 9.05, 17.3, 13.55, 1.85)),
    tube('M11.5 10.65 C11.85 10.4 12.15 10.4 12.5 10.65', 0.35),
    tube('M5.6 11.05 H7.2', 0.33), tube('M16.8 11.05 H18.4', 0.33))
  cut(frames, region(lensL)); cut(frames, region(lensR))
  // a 0.45u groove carved round the whole spectacle so it stands proud of the face, then the frame laid back in
  cut(head, frames, 0.45)
  const pupils = union(region(ell(9.25, 11.3, 0.45, 0.45)), region(ell(14.75, 11.3, 0.45, 0.45)))
  // a small smile, clear of the frames
  cut(head, tube('M10.7 15.15 C11.5 15.75 12.5 15.75 13.3 15.15', 0.5))
  const face = union(head, frames, pupils)
  for (let k = 0; k < NN; k++) face[k] = Math.min(face[k], sil[k])   // trim the temple arms to the head silhouette
  // shoulders: their own pillow below a clear neck gap
  const body = region('M4.25 20.75 C4.25 19.1 6.1 18 8.5 18 C9.75 18 10.75 18.65 12 18.65 C13.25 18.65 14.25 18 15.5 18 C17.9 18 19.75 19.1 19.75 20.75 C19.75 21.3 19.4 21.6 18.85 21.6 H5.15 C4.6 21.6 4.25 21.3 4.25 20.75 Z', 0.55)
  // light from the upper-left: a bean along the hair dome, its glint, a streak on the left shoulder, rim lights
  const H = hl()
  streak(H, 'M6.85 7.15 C7.3 5.85 8.3 4.85 9.75 4.3', 0.38)
  splat(H, 11.05, 4.1, 0.24)
  streak(H, 'M4.9 20.9 C5.05 19.75 6.15 18.85 7.9 18.7', 0.32)
  const R = hl()
  streak(R, 'M17.5 13.6 C17.1 14.75 16.45 15.65 15.55 16.25', 0.15)
  streak(R, 'M16.2 21.75 C17.6 21.75 18.85 21.6 19.6 21.1', 0.14)
  return [node(lit(face, H, R), 'wm-k'), node(lit(body, H, R), 'wm-k')]
}
