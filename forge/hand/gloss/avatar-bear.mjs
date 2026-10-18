// forge/hand/gloss/avatar-bear.mjs — a vinyl bear: a round black head with two round ears (each with a carved inner ear),
// the face cut out as a clear oval so the head reads as a thick glossy ring, and solid black eyes, nose and smile set
// inside it as in line. The generated drawing was one solid black blob with a highlight; the open face now carries the
// features at 16px.
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
  const ears = union(region(ell(6.25, 7.6, 2.75, 2.75)), region(ell(17.75, 7.6, 2.75, 2.75)))
  const head = union(ears, region(ell(12, 13.75, 7, 7)))
  cut(head, region(ell(12, 14.1, 5.45, 5.3)))
  cut(head, region(ell(6.3, 7.75, 1.05, 1.05)))
  cut(head, region(ell(17.7, 7.75, 1.05, 1.05)))
  const H = hl()
  streak(H, 'M4.5 5.9 C5 5.1 5.7 4.7 6.5 4.6', 0.28)
  streak(H, 'M5.6 15.3 C5.6 13.2 6.3 11.6 7.4 10.4', 0.3)
  const R = hl()
  streak(R, 'M18.1 16.3 C17.5 18 16.3 19.3 14.8 20', 0.17)
  const feat = union(region(ell(9.4, 12.6, 0.85, 1.15)), region(ell(14.6, 12.6, 0.85, 1.15)),
    region(ell(12, 15.45, 1.45, 1.0), 0.0),
    tube('M10.3 17.9 C10.9 18.6 12 18.5 12 17.3 C12 18.5 13.1 18.6 13.7 17.9', 0.38))
  const F = hl(); streak(F, 'M8.9 12 C8.95 11.8 9.05 11.7 9.2 11.65', 0.18)
  return [node(lit(head, H, R), 'wm-k'), node(feat, 'wm-a')]
}
