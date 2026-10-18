// forge/hand/gloss/library.mjs — three inflated vinyl books on a shelf rod: a tall spine, a short spine and a book leaning
// on its corner, each a separate pillow behind a clear parting gap with one slim lit streak and a glint. The generated
// drawing fused both upright books and the leaner into one lumpy slab with scattered highlight blobs, so at 16px the
// spines never separated; here every spine keeps its own silhouette and the shelf is its own tube.
import { distField, evenOddMask, contours, ringsToD, segsOf, NN, N, gx } from '../../styles/_gloss-field.mjs'
import { parsePath, resample } from '../../kernel/geom.mjs'

// ---- the gloss field kit (same SDF modelling, tube radius and highlight rim as forge/styles/gloss.mjs) ----
const BAND = 4.5, RIM = 0.5
const subs = d => parsePath(d, 0.1).filter(s => s.pts.length)
const region = (d, g = 0) => {
  const ss = subs(d), m = evenOddMask(ss.map(s => s.pts))
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
// a tapered specular streak along d (half-width w at the middle), or a glint dot
const streak = (H, d, w, tip = 0.1) => { for (const s of subs(d)) { const P = resample(s.pts, 0.08); P.forEach(({ p, u }) => splat(H, p[0], p[1], tip + (w - tip) * Math.pow(Math.sin(Math.PI * u), 0.5))) } }
const lit = (B, H) => { const S = new Float32Array(NN); for (let k = 0; k < NN; k++) S[k] = Math.min(B[k], Math.max(-H[k], RIM - B[k])); return S }
const node = (S, cls) => ['path', { d: ringsToD(contours(S, 0)), 'fill-rule': 'evenodd', class: cls }]
const hl = () => new Float32Array(NN).fill(-9)

// leaning book: a 4u x 12u slab tilted 12deg, resting on its lower-left corner
const T = 12 * Math.PI / 180, U = [-Math.sin(T), -Math.cos(T)], VX = [Math.cos(T), -Math.sin(T)]
const at = (o, a, b) => [o[0] + a * VX[0] + b * U[0], o[1] + a * VX[1] + b * U[1]]
const P0 = [17.05, 18.95], W = 4, HT = 12, RR = 1.25
const f = v => +v.toFixed(2)
const lean = (() => {
  // rounded rectangle in the book's own frame (a across, b up), then placed
  const pts = []
  const corner = (ca, cb, a0) => { for (let q = 0; q <= 6; q++) { const a = a0 + q * Math.PI / 12; pts.push(at(P0, ca + RR * Math.cos(a), cb + RR * Math.sin(a))) } }
  corner(RR, RR, Math.PI); corner(W - RR, RR, 1.5 * Math.PI); corner(W - RR, HT - RR, 0); corner(RR, HT - RR, 0.5 * Math.PI)
  return 'M' + pts.map(p => `${f(p[0])} ${f(p[1])}`).join('L') + 'Z'
})()

export default function render() {
  // upright spines (silhouettes), the shelf rod below them
  const tall = region('M2.25 4 A1.5 1.5 0 0 1 3.75 2.5 H6.5 A1.5 1.5 0 0 1 8 4 V17.25 A1.5 1.5 0 0 1 6.5 18.75 H3.75 A1.5 1.5 0 0 1 2.25 17.25 Z')
  const short = region('M9.25 7.25 A1.25 1.25 0 0 1 10.5 6 H12.25 A1.25 1.25 0 0 1 13.5 7.25 V17.5 A1.25 1.25 0 0 1 12.25 18.75 H10.5 A1.25 1.25 0 0 1 9.25 17.5 Z')
  const leaner = region(lean)
  const shelf = tube('M3.25 21 H20.75', 1.15)
  // a label band across each spine: an inset groove that stops inside the edges, so every spine stays one pillow
  cut(tall, tube('M3.25 15.6 H7', 0.55))
  cut(short, tube('M10.25 15.6 H12.5', 0.55))
  cut(leaner, tube(`M${at(P0, 0.75, 3.1).map(f).join(' ')} L${at(P0, W - 0.75, 3.1).map(f).join(' ')}`, 0.55))
  const books = union(tall, short)
  // light from the upper-left: one slim streak hugging each spine's lit top corner
  const H = hl()
  streak(H, 'M3.5 10.2 V5.6 C3.5 4.6 3.9 3.95 4.9 3.8', 0.3); splat(H, 6.6, 4.1, 0.28)
  streak(H, 'M10.4 12.4 V8.6 C10.4 7.8 10.7 7.35 11.4 7.2', 0.27)
  streak(H, 'M4.8 21 H11', 0.22)
  const HA = hl()
  const q = (a, b) => at(P0, a, b).map(f).join(' ')
  streak(HA, `M${q(1.05, HT - 6.4)} L${q(1.05, HT - 2.3)} Q${q(1.05, HT - 1.05)} ${q(2.3, HT - 1)}`, 0.27)
  const g = at(P0, 3.05, HT - 1.05); splat(HA, f(g[0]), f(g[1]), 0.24)
  return [node(lit(union(books, shelf), H), 'wm-k'), node(lit(leaner, HA), 'wm-a')]
}
