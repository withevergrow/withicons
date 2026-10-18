// forge/hand/gloss/oven.mjs: a glossy kitchen oven: a pillow body split by grooves into control strip, door and drawer, a display slot and two knob holes up top, a clear window carrying three wavy heat lines, and two feet floating below.
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
const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`

export default function render() {
  const body = soft(rr(4, 2.5, 16, 17.5, 2.6), 0.4)
  cut(body, tube('M3.5 6.8 H20.5', 0.45))
  cut(body, tube('M3.5 17 H20.5', 0.45))
  cut(body, region(rr(10, 3.65, 4, 1.4, 0.6)))
  cut(body, region(ell(16.3, 4.35, 0.68, 0.68)))
  cut(body, region(ell(18.1, 4.35, 0.68, 0.68)))
  cut(body, region(rr(6.9, 8.5, 10.2, 6.5, 0.9)))
  const heat = union(
    tube('M9.5 9.9 C8.7 10.7 8.7 11.4 9.5 12 C10.3 12.6 10.3 13.3 9.5 14', 0.42),
    tube('M12 9.9 C11.2 10.7 11.2 11.4 12 12 C12.8 12.6 12.8 13.3 12 14', 0.42),
    tube('M14.5 9.9 C13.7 10.7 13.7 11.4 14.5 12 C15.3 12.6 15.3 13.3 14.5 14', 0.42))
  const f1 = soft(rr(6, 20.6, 3, 2, 0.9), 0.5), f2 = soft(rr(15, 20.6, 3, 2, 0.9), 0.5)
  const H = hl()
  streak(H, 'M5.4 5.4 V4.3 C5.4 3.7 5.8 3.4 6.6 3.4 H8.2', 0.34)
  streak(H, 'M5.5 15.2 V9.4', 0.3)
  streak(H, 'M5.6 19.1 H7.6', 0.26)
  const R = hl()
  streak(R, 'M18.5 9.4 V15.4', 0.14)
  streak(R, 'M16.4 19 H18.4', 0.14)
  return [node(lit(body, H, R), 'wm-k'), node(heat, 'wm-a'), node(lit(f1, hl()), 'wm-k'), node(lit(f2, hl()), 'wm-k')]
}
