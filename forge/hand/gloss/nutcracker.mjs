import { distField, evenOddMask, contours, ringsToD, segsOf, NN, N, gx } from '../../styles/_gloss-field.mjs'
import { parsePath, resample } from '../../kernel/geom.mjs'

// ---- the gloss field kit (same SDF modelling and highlight rim as forge/styles/gloss.mjs) ----
const BAND = 4.5, RIM = 0.5
const subs = d => parsePath(d, 0.1).filter(s => s.pts.length)
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

// forge/hand/gloss/nutcracker.mjs — a glossy vinyl nutcracker soldier: plumed ball on a tall shako, a brim, a round

// forge/hand/gloss/nutcracker.mjs — a bold vinyl nutcracker soldier: plumed ball on a tall banded shako, a rounded
// face (two eyes, one curled moustache), a broad tunic with shoulder epaulettes and buttons, a wind-up jaw lever on the
// side and a plinth. Few, chunky parts so it still reads as a toy soldier at 16px.
const dot = (cx, cy, r) => region(`M${cx} ${cy} m${-r} 0 a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`)
export default function render() {
  const hat = union(soft('M8.2 3.9 H15.8 L16.4 8.6 H7.6 Z', 0.7), soft('M6.6 8.3 H17.4 V9.7 H6.6 Z', 0.65))
  cut(hat, tube('M7.9 6.4 H16.1', 0.42))
  const face = soft('M8.3 10.5 H15.7 V12.6 C15.7 14.3 14.4 14.8 12 14.8 C9.6 14.8 8.3 14.3 8.3 12.6 Z', 0.6)
  cut(face, hat, 0.5)
  cut(face, union(dot(10.4, 11.7, 0.78), dot(13.6, 11.7, 0.78), tube('M9.5 13.6 C10.5 12.8 11.6 12.9 12 13.4 C12.4 12.9 13.5 12.8 14.5 13.6', 0.4)))
  const body = soft('M5 15.5 H19 V20.4 H5 Z', 1.2)
  const ep = union(dot(5.6, 16.2, 1.5), dot(18.4, 16.2, 1.5))
  cut(body, ep, 0.5)
  cut(body, union(dot(12, 17.2, 0.65), dot(12, 19.2, 0.65)))
  const lever = union(tube('M16.6 13.2 L20.2 9.2', 0.7), dot(20.6, 8.7, 1.2))
  cut(lever, face, 0.5)
  const plinth = soft('M4.5 21.1 H19.5 V22.9 H4.5 Z', 0.8)
  const ball = dot(12, 2.3, 1.4)
  const Hq = hl(); streak(Hq, 'M6.6 17.2 L6.6 19', 0.32)
  const Hp = hl(); splat(Hp, 11.4, 1.8, 0.28)
  return [node(lit(hat, hl()), 'wm-k'), node(lit(face, hl()), 'wm-k'), node(lit(body, Hq), 'wm-k'),
    node(lit(union(ep, lever, plinth), hl()), 'wm-a'), node(lit(ball, Hp), 'wm-a')]
}
