// forge/hand/gloss/avatar-person-headphones.mjs — a vinyl bust wearing over-ear headphones: the headband is its own
// tube arching over the head behind a clear gap, fused only into the two pill ear cups, which sit in front of the head
// behind a parting groove; the centre-parted fringe is cut free of the face and the shoulders are their own pillow. The
// generated drawing melted the headband into the hair so the headphones read as a bigger head; here the band and cups
// stand apart at 16px.
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
const ell = (cx, cy, rx, ry) => poly(Array.from({ length: 96 }, (_, i) => { const a = i * Math.PI / 48; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] }))
const rr = (x0, y0, x1, y1, r) => { const c = [[x1 - r, y0 + r], [x1 - r, y1 - r], [x0 + r, y1 - r], [x0 + r, y0 + r]], pts = []; c.forEach(([x, y], q) => { for (let i = 0; i <= 12; i++) { const a = (q - 1) * Math.PI / 2 + i * Math.PI / 24; pts.push([x + r * Math.cos(a), y + r * Math.sin(a)]) } }); return poly(pts) }
// the stretch of a path between u0 and u1 (0..1), pushed off sideways (left of travel) by off: a streak lane on a tube
const along = (d, off, u0, u1) => {
  const P = resample(subs(d)[0].pts, 0.1), out = []
  P.forEach(({ p, u }, i) => {
    if (u < u0 || u > u1) return
    const a = P[Math.max(0, i - 1)].p, b = P[Math.min(P.length - 1, i + 1)].p, l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    out.push([p[0] + off * (b[1] - a[1]) / l, p[1] - off * (b[0] - a[0]) / l])
  })
  return 'M' + out.map(q => q[0].toFixed(2) + ' ' + q[1].toFixed(2)).join('L')
}

export default function render() {
  // head: one egg-round mass; centre-parted fringe cut free of the face
  const head = region(ell(12, 10.9, 5.45, 5.9))
  cut(head, tube('M6 10.6 C6.8 9.9 7.35 9.1 7.65 8.3 C9.2 8.8 10.75 8.55 12 7.7 C13.25 8.55 14.8 8.8 16.35 8.3 C16.65 9.1 17.2 9.9 18 10.6', 0.48))
  // eyes and smile
  cut(head, region(ell(9.75, 11.3, 0.78, 1.02)))
  cut(head, region(ell(14.25, 11.3, 0.78, 1.02)))
  cut(head, tube('M10.2 13.85 C11.15 14.75 12.85 14.75 13.8 13.85', 0.55))
  // the headphones: a band arching clear over the head, fused into two pill ear cups in front of it
  const BANDD = 'M4.95 10.5 C4.95 5.45 8 2.55 12 2.55 C16 2.55 19.05 5.45 19.05 10.5'
  const phones = union(tube(BANDD, 1.15), region(rr(3, 8.75, 7.35, 15.1, 2.1)), region(rr(16.65, 8.75, 21, 15.1, 2.1)))
  cut(head, phones, 0.8)
  // shoulders: their own pillow below a clear neck gap
  const body = region('M4.25 20.75 C4.25 19.1 6.1 18 8.5 18 C9.75 18 10.75 18.65 12 18.65 C13.25 18.65 14.25 18 15.5 18 C17.9 18 19.75 19.1 19.75 20.75 C19.75 21.3 19.4 21.6 18.85 21.6 H5.15 C4.6 21.6 4.25 21.3 4.25 20.75 Z', 0.55)
  // light from the upper-left: a streak along the band's lit side, one down the left cup, a glint on the fringe,
  // a streak on the left shoulder; rim lights on the shadow side
  const H = hl()
  streak(H, along(BANDD, 0.42, 0.14, 0.5), 0.3)
  streak(H, 'M3.95 13.3 V11.1 C3.95 10.3 4.35 9.8 5.05 9.65', 0.34)
  streak(H, 'M9.3 7 C9.85 6.55 10.5 6.25 11.25 6.1', 0.3)
  streak(H, 'M4.9 20.9 C5.05 19.75 6.15 18.85 7.9 18.7', 0.32)
  const R = hl()
  streak(R, 'M20.6 10.6 V13.4', 0.15)
  streak(R, 'M16.2 21.75 C17.6 21.75 18.85 21.6 19.6 21.1', 0.14)
  return [node(lit(head, H, R), 'wm-k'), node(lit(phones, H, R), 'wm-a'), node(lit(body, H, R), 'wm-k')]
}
