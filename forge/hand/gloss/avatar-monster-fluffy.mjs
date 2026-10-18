// forge/hand/gloss/avatar-monster-fluffy.mjs — a fluffy vinyl monster: a domed head with a little tuft, shaggy fur
// tufts down the sides and hem (rounded so they read as fur, not a badge's points), two big eye windows with pupils
// standing in them (the blinking part), and a wide grin with two fangs hanging from it. The generated drawing had sharp
// zigzag points and a small face, so it read as a sun or a badge at 16px.
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
  const fur = soft('M4.5 11 C4.5 7.5 7 5.25 10 4.75 L10.75 2.75 L12 4.5 L13.25 2.75 L14 4.75 C17 5.25 19.5 7.5 19.5 11 L21.5 12.75 L19.5 14.5 L21.25 16.75 L19.5 17.75 L20.75 20.25 L18.75 19.5 L17.25 21.5 L15.5 19.5 L13.75 21.25 L12 19.75 L10.25 21.5 L8.5 19.5 L6.75 21.25 L5.25 19.5 L3.25 20.25 L4.5 17.75 L2.75 16.5 L4.5 14.5 L2.5 13.25 Z', 0.6)
  // big eye windows, pupils left standing inside (they blink)
  cut(fur, region(ell(9.4, 9.6, 1.45, 1.8)))
  cut(fur, region(ell(14.6, 9.6, 1.45, 1.8)))
  const pupils = union(region(ell(9.75, 10.05, 0.7, 0.85)), region(ell(14.95, 10.05, 0.7, 0.85)))
  // wide grin with two fangs hanging from it
  cut(fur, tube('M7.75 13.3 C10.4 14.65 13.6 14.65 16.25 13.3', 0.55))
  cut(fur, soft('M8.6 13.6 L11.2 14.25 L9.65 17.1 Z', 0.2))
  cut(fur, soft('M15.4 13.6 L12.8 14.25 L14.35 17.1 Z', 0.2))
  const H = hl()
  streak(H, 'M6.05 9.6 C6.3 7.95 7.4 6.6 9.05 5.85', 0.42)
  const R = hl()
  streak(R, 'M18.95 15.2 C18.9 16.3 18.55 17.4 17.95 18.3', 0.15)
  return [node(lit(fur, H, R), 'wm-k'), node(lit(pupils, hl()), 'wm-a')]
}
