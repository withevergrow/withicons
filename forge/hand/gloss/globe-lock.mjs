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

// forge/hand/gloss/globe-lock.mjs — a glossy vinyl globe (meridian and equator carved as grooves) with a padlock
// bubbling out of its lower right. The generated lock was a shackle-less blob fused into the globe; here the lock has
// its arched shackle and a keyhole, and a clear moat separates it from the globe on every side.
export default function render() {
  const globe = region('M10.75 1.5 A9.25 9.25 0 1 1 10.75 20 A9.25 9.25 0 1 1 10.75 1.5 Z')
  cut(globe, tube('M10.75 1.5 A3.9 9.25 0 1 1 10.75 20 A3.9 9.25 0 1 1 10.75 1.5 Z', 0.65))
  cut(globe, tube('M1 10.75 H21', 0.65))
  const lockBody = soft('M13 14.75 H22.25 V22.5 H13 Z', 1.6)
  const shackle = tube('M15.4 14.9 V13.4 A2.25 2.25 0 0 1 19.9 13.4 V14.9', 1.0)
  const lock = union(lockBody, shackle)
  cut(globe, lock, 0.7)
  cut(lock, union(region('M17.65 17.6 m-0.95 0 a0.95 0.95 0 1 0 1.9 0 a0.95 0.95 0 1 0 -1.9 0 Z'), tube('M17.65 18 V20.2', 0.5)))
  const H = hl()
  streak(H, 'M3.9 8.3 C4.3 6.6 5.2 5.3 6.7 4.4', 0.42)
  splat(H, 8.7, 3.4, 0.26)
  const HL = hl()
  streak(HL, 'M14.9 17.6 C14.9 16.9 15.3 16.5 16 16.5', 0.3)
  return [node(lit(globe, H), 'wm-k'), node(lit(lock, HL), 'wm-s')]
}
