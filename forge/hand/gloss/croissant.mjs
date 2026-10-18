// forge/hand/gloss/croissant.mjs — a vinyl croissant: five rolled lobes on one arch, a domed centre lobe, two middle
// lobes and two horns that taper to rounded points curling in and down, parted by narrow radial grooves that stop short
// of the inner edge so every lobe hangs off one connected inner crescent. The generated drawing inflated into one smooth
// hump, and a first redraw split it into five loose petals (a fan or a crown); here it is one pastry with clear layers.
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

// the crescent is laid out in polar form about a centre below the icon (close to the skeleton's 11.25u inner arc)
const C = [12, 26.4], RI = 11
const P = (r, t) => { const a = t * Math.PI / 180; return [C[0] + r * Math.sin(a), C[1] - r * Math.cos(a)] }
// lobes: [from, to] in degrees from vertical, outer radius at each end, how far the lobe swells between them, and how far
// the inner edge curls in toward the centre at the lobe's from (f) / to (e) end (the horn tips)
const LOBES = [[-57, -32, 11.75, 17.6, 2.1, -1.1, 0], [-32, -12.5, 17.6, 19.6, 1.9, 0, 0], [-12.5, 12.5, 19.6, 19.6, 2.6, 0, 0], [12.5, 32, 19.6, 17.6, 1.9, 0, 0], [32, 57, 17.6, 11.75, 2.1, 0, -1.1]]
const curl = (L, t) => L[5] * Math.pow(1 - t, 2.5) + L[6] * Math.pow(t, 2.5)
const ri = (L, t) => RI + curl(L, t)
const ro = (L, t) => L[2] + (L[3] - L[2]) * t + L[4] * Math.sin(Math.PI * t) + curl(L, t)
const at = (L, t) => L[0] + (L[1] - L[0]) * t
const lobe = L => {
  const pts = []
  for (let i = 0; i <= 32; i++) { const t = i / 32; pts.push(P(ro(L, t), at(L, t))) }
  for (let i = 32; i >= 0; i--) { const t = i / 32; pts.push(P(ri(L, t), at(L, t))) }
  return poly(pts)
}
// a streak lane running along a lobe's outer edge, 'inset' inside it, from t0 to t1
const lane = (L, inset, t0, t1) => { const pts = []; for (let i = 0; i <= 16; i++) { const t = t0 + (t1 - t0) * i / 16; pts.push(P(ro(L, t) - inset, at(L, t))) } return 'M' + pts.map(q => q[0].toFixed(2) + ' ' + q[1].toFixed(2)).join('L') }

export default function render() {
  const F = union(...LOBES.map(L => region(lobe(L))))
  // narrow parting grooves between the lobes, stopping 1.25u short of the inner edge so the lobes share one inner crescent
  for (const t of [-32, -12.5, 12.5, 32]) cut(F, tube('M' + P(RI + 1.55, t).join(' ') + 'L' + P(24, t).join(' '), 0.3))
  // every convex corner rounded into a pillow; the horns end in rounded points
  const B = region(ringsToD(contours(F, 0.6)), 0.6)
  // light from the upper-left: a streak along each lobe's crown (longest on the lit side), glints, rim lights right
  const H = hl()
  streak(H, lane(LOBES[0], 1.0, 0.4, 0.85), 0.34)
  streak(H, lane(LOBES[1], 1.05, 0.15, 0.7), 0.4)
  streak(H, lane(LOBES[2], 1.1, 0.12, 0.5), 0.42)
  splat(H, ...P(ro(LOBES[2], 0.62) - 1.1, at(LOBES[2], 0.62)), 0.28)
  streak(H, lane(LOBES[3], 1.05, 0.12, 0.45), 0.34)
  streak(H, lane(LOBES[4], 1.0, 0.12, 0.4), 0.3)
  const R = hl()
  streak(R, lane(LOBES[3], 0.5, 0.6, 0.95), 0.15)
  streak(R, lane(LOBES[4], 0.5, 0.45, 0.75), 0.15)
  return [node(lit(B, H, R), 'wm-k')]
}
