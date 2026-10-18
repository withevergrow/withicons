// forge/hand/gloss/wreath.mjs — a glossy holly wreath: a thick scalloped ring with a wide open centre, three carved berries
// and a bow (wm-a) cut free at the bottom. The generated drawing filled the hole into a blob; here the ring stays open at 24px.
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
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`

export default function render() {
  const cx = 12, cy = 10.2, R0 = 5.55
  // scalloped ring: a fat tube plus nine leafy lobes, centre knocked out wide
  const lobes = [tube(ell(cx, cy, R0, R0), 1.85)]
  for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 9; lobes.push(region(ell(cx + R0 * Math.cos(a), cy + R0 * Math.sin(a), 2.25, 2.25))) }
  const ring = union(...lobes)
  cut(ring, region(ell(cx, cy, 3.35, 3.35)))
  // bow: two looped ears and a knot, cut free of the ring
  const ears = union(
    region('M11 17.9 C9.3 16.1 5.3 15.9 5.3 18.75 C5.3 21.6 9.3 21.4 11 19.6 Z'),
    region('M13 17.9 C14.7 16.1 18.7 15.9 18.7 18.75 C18.7 21.6 14.7 21.4 13 19.6 Z'))
  const knot = region(ell(12, 18.75, 1.45, 1.45))
  cut(ears, knot, 0.45)
  cut(ears, region(ell(7.7, 18.75, 0.85, 0.62)))
  cut(ears, region(ell(16.3, 18.75, 0.85, 0.62)))
  const bow = union(ears, knot)
  cut(ring, bow, 0.55)
  // berries carved into the leaves
  for (const [x, y] of [[6.35, 8.3], [15.9, 5.15], [17.75, 12.4]]) cut(ring, region(ell(x, y, 0.62, 0.62)))
  const H = hl()
  streak(H, 'M5.1 11.6 C4.9 8.6 6.4 5.6 9.4 4.2', 0.36)
  streak(H, 'M6.4 18.2 C6.6 17.5 7.2 17.1 8 17.05', 0.18)
  const Rl = hl()
  streak(Rl, 'M18.9 11.4 C18.9 13 18.3 14.4 17.3 15.4', 0.12)
  return [node(lit(ring, H, Rl), 'wm-k'), node(lit(bow, H, Rl), 'wm-a')]
}
