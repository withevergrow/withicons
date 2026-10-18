// forge/hand/gloss/avatar-older-man.mjs: a vinyl bust of a bald older man: a tall glossy dome of a head with a carved mustache and eyes, a tuft of hair on each side cut free of the head by a groove, and broad shoulders as their own pillow.
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
  const head = region(ell(12, 10.4, 5.5, 6))
  cut(head, region(ell(9.5, 9.9, 0.8, 1.05)))
  cut(head, region(ell(14.5, 9.9, 0.8, 1.05)))
  cut(head, region('M8.4 14.3 C9.3 12.8 11 12.6 12 13.3 C13 12.6 14.7 12.8 15.6 14.3 C14.3 14.9 12.9 14.6 12 14.2 C11.1 14.6 9.7 14.9 8.4 14.3 Z', 0.1))
  const tl = soft('M8 5.8 C5.9 6.3 4.2 8.1 4.2 10.4 C4.2 11.7 5 12.6 6.4 12.9 L7.4 8 Z', 0.45)
  cut(tl, head, 0.4)
  const tr = soft('M16 5.8 C18.1 6.3 19.8 8.1 19.8 10.4 C19.8 11.7 19 12.6 17.6 12.9 L16.6 8 Z', 0.45)
  cut(tr, head, 0.4)
  const body = cut(region('M4.25 20.75 C4.25 19.1 6.1 18 8.5 18 C9.75 18 10.75 18.65 12 18.65 C13.25 18.65 14.25 18 15.5 18 C17.9 18 19.75 19.1 19.75 20.75 C19.75 21.3 19.4 21.6 18.85 21.6 H5.15 C4.6 21.6 4.25 21.3 4.25 20.75 Z', 0.55), head, 0.5)
  const H = hl()
  streak(H, 'M8.3 7.3 C8.8 5.7 10 4.7 11.6 4.5', 0.42)
  streak(H, 'M5.3 10.2 C5.4 9.2 5.9 8.4 6.7 7.9', 0.2)
  streak(H, 'M4.9 20.9 C5.05 19.75 6.15 18.85 7.9 18.7', 0.32)
  const R = hl()
  streak(R, 'M16.9 12.6 C16.5 14 15.6 15.2 14.4 16', 0.15)
  streak(R, 'M16.2 21.75 C17.6 21.75 18.85 21.6 19.6 21.1', 0.14)
  return [node(lit(head, H, R), 'wm-k'), node(lit(tl, H, R), 'wm-k'), node(lit(tr, H, R), 'wm-k'), node(lit(body, H, R), 'wm-k')]
}
