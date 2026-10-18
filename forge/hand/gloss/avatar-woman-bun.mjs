// forge/hand/gloss/avatar-woman-bun.mjs: a vinyl bust of a woman with a top bun: a hair-capped head with the face cut free
// by one groove (swept fringe and both cheeks), carved eyes and smile, a round bun floating above the crown, and the
// shoulders as their own pillow. The old drawing was a blank oval and a ball with no face or shoulders, so it read as
// an acorn; now it matches the other avatars (face, hair frame, shoulders) and keeps the bun as the moving part.
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
  const bun = region(ell(12, 3.7, 2.05, 2.0))
  const head = union(soft('M5.6 14.2 C5.2 8.6 8 4.8 12 4.8 C16 4.8 18.8 8.6 18.4 14.2 Z', 0.9), region(ell(12, 11, 6.4, 6.2)))
  // the face is cut free of the hair: down both cheeks and across the swept fringe
  cut(head, tube('M7.9 15.5 C6.95 14.1 6.8 12.1 7.05 10.5 C7.35 8.8 8.3 7.9 9.2 7.6 C11 9.2 14 9.3 16.8 8.3 C17.25 9.4 17.3 10.4 17.1 11.8 C16.95 13.3 16.9 14.4 16.1 15.5', 0.48))
  // eyes and smile carved into the face
  cut(head, region(ell(9.75, 11.7, 0.8, 1.05)))
  cut(head, region(ell(14.25, 11.7, 0.8, 1.05)))
  cut(head, tube('M10.2 14.2 C11.2 15.15 12.8 15.15 13.8 14.2', 0.52))
  cut(bun, head, 0.6)
  const body = cut(region('M4.5 21 C4.5 19.4 6.3 18.4 8.6 18.4 C9.8 18.4 10.8 19 12 19 C13.2 19 14.2 18.4 15.4 18.4 C17.7 18.4 19.5 19.4 19.5 21 C19.5 21.4 19.2 21.7 18.7 21.7 H5.3 C4.8 21.7 4.5 21.4 4.5 21 Z', 0.55), head, 0.7)
  // light from the upper-left: a bean on the crown and bun, a streak on the left shoulder, rim lights right
  const H = hl()
  streak(H, 'M10.9 3.1 C11.3 2.6 11.9 2.4 12.6 2.45', 0.35)
  streak(H, 'M6.7 10.4 C6.8 8.2 8.2 6.3 10.3 5.7', 0.4)
  streak(H, 'M5.3 20.8 C5.45 19.9 6.4 19.2 8 19.05', 0.3)
  const R = hl()
  streak(R, 'M18 10.4 C18.1 11.6 18 12.8 17.7 13.7', 0.15)
  streak(R, 'M16.2 21.8 C17.4 21.8 18.4 21.7 19 21.3', 0.13)
  return [node(lit(bun, H, R), 'wm-a'), node(lit(head, H, R), 'wm-k'), node(lit(body, H, R), 'wm-k')]
}
