// forge/hand/gloss/watch.mjs: a glossy wristwatch: a round bezel ring around a clear face with black hands, and a strap above and below, each its own pillow cut free of the case.
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
  const ring = region(ell(12, 12, 6.7, 6.7))
  cut(ring, region(ell(12, 12, 4.8, 4.8)))
  const full = region(ell(12, 12, 6.7, 6.7))
  const top = soft('M8.3 6 L8.9 3.5 C9.05 2.85 9.5 2.5 10.1 2.5 H13.9 C14.5 2.5 14.95 2.85 15.1 3.5 L15.7 6 Z', 0.45)
  cut(top, full, 0.55)
  const bot = soft('M8.3 18 L8.9 20.5 C9.05 21.15 9.5 21.5 10.1 21.5 H13.9 C14.5 21.5 14.95 21.15 15.1 20.5 L15.7 18 Z', 0.45)
  cut(bot, full, 0.55)
  const hands = tube('M12 8.9 V12 L14.3 13.7', 0.5)
  const H = hl()
  streak(H, 'M6.7 10.1 C7.2 8.9 8.1 7.9 9.2 7.1', 0.28)
  streak(H, 'M10.3 3.7 H12.2', 0.22)
  streak(H, 'M10.3 20.3 H12.2', 0.2)
  const R = hl()
  streak(R, 'M17.3 13.6 C16.9 14.9 16 16 14.9 16.8', 0.14)
  return [node(lit(ring, H, R), 'wm-k'), node(lit(top, H, R), 'wm-k'), node(lit(bot, H, R), 'wm-k'), node(hands, 'wm-a')]
}
