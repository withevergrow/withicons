// forge/hand/gloss/avatar-girl.mjs — a vinyl bust of a girl: a round face framed by a hair cap with a centre-parted
// fringe and two pigtails that fan out and hang clear of the shoulders, each pinched off at the head by a hair-tie
// groove; the face is cut free of the hair by one deep groove, with carved eyes and smile, and the narrow shoulders sit
// as their own pillow. The generated drawing collapsed hair, pigtails, face and shoulders into one blob.
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
  const hair = soft('M12 3.5 C8 3.5 4.75 5.75 4.5 8.25 C4.5 9 4.75 9.5 5.5 10 C4.25 11 3.75 12.5 3.5 14 C3.25 15.75 3.25 17.5 3.75 19 C5 18.25 6.5 16.75 7.5 15.25 L12 11 L16.5 15.25 C17.5 16.75 19 18.25 20.25 19 C20.75 17.5 20.75 15.75 20.5 14 C20.25 12.5 19.75 11 18.5 10 C19.25 9.5 19.5 9 19.5 8.25 C19.25 5.75 16 3.5 12 3.5 Z', 0.45)
  const head = union(hair, region(ell(12, 11, 6.25, 6.25)))
  // the face cut free of the hair: down both cheeks and across the parted fringe
  cut(head, tube('M7.85 15.95 C6.55 14.6 5.75 12.95 5.75 11 C6.5 9 8 7.75 9.75 7.5 C10.75 7.25 11.5 7 12 6.5 C12.5 7 13.25 7.25 14.25 7.5 C16 7.75 17.5 9 18.25 11 C18.25 12.95 17.45 14.6 16.15 15.95', 0.48))
  // hair ties pinch each pigtail off the head
  cut(head, tube('M3.9 9.3 L5.95 10.65', 0.42))
  cut(head, tube('M20.1 9.3 L18.05 10.65', 0.42))
  cut(head, region(ell(9.5, 12.1, 0.85, 1.1)))
  cut(head, region(ell(14.5, 12.1, 0.85, 1.1)))
  cut(head, tube('M10.1 14.75 C11.1 15.7 12.9 15.7 13.9 14.75', 0.55))
  const body = cut(region('M6.75 20.85 C6.75 19.7 7.9 18.85 9.75 18.85 C10.75 18.85 11.25 19.35 12 19.35 C12.75 19.35 13.25 18.85 14.25 18.85 C16.1 18.85 17.25 19.7 17.25 20.85 C17.25 21.3 16.95 21.6 16.5 21.6 H7.5 C7.05 21.6 6.75 21.3 6.75 20.85 Z', 0.5), head, 0.9)
  const H = hl()
  streak(H, 'M6.4 6.7 C7.5 5.3 9 4.5 10.7 4.25', 0.4)
  streak(H, 'M4.35 17.3 C4.15 15.6 4.35 13.75 5.05 12.35', 0.24)
  streak(H, 'M7.35 20.95 C7.45 20.05 8.2 19.45 9.3 19.35', 0.28)
  const R = hl()
  streak(R, 'M20.05 13.6 C20.2 15 20.15 16.3 19.85 17.5', 0.14)
  streak(R, 'M14.8 21.75 C15.8 21.75 16.6 21.6 17.05 21.2', 0.13)
  return [node(lit(head, H, R), 'wm-k'), node(lit(body, H, R), 'wm-k')]
}
