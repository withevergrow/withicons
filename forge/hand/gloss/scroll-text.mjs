// forge/hand/gloss/scroll-text.mjs — a glossy vinyl scroll: two plump rollers parted from the sheet by clean gaps, the
// sheet a pillow with two deep text grooves under a corner bean, each roller lit by a slim streak. The generated drawing
// fused rollers and sheet into one heavy I-beam whose text grooves drowned in the mass at 16px; here the sheet is
// narrower than the rollers, set apart from them, and its lines are carved wide and clear of every highlight.
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


export default function render() {
  const rollers = union(
    region('M4.5 2.5 H19.5 A2 2 0 0 1 19.5 6.5 H4.5 A2 2 0 0 1 4.5 2.5 Z'),
    region('M4.5 17.5 H19.5 A2 2 0 0 1 19.5 21.5 H4.5 A2 2 0 0 1 4.5 17.5 Z'))
  const sheet = region('M6.25 7.25 H17.75 A0.75 0.75 0 0 1 18.5 8 V16 A0.75 0.75 0 0 1 17.75 16.75 H6.25 A0.75 0.75 0 0 1 5.5 16 V8 A0.75 0.75 0 0 1 6.25 7.25 Z')
  // two lines of text, carved as grooves at the style's cut weight (a touch wider so they hold at 16px)
  cut(sheet, tube('M9 11 H15', 0.9))
  cut(sheet, tube('M9 14.25 H13', 0.9))
  const H = hl()
  streak(H, 'M4.6 3.55 H10.6', 0.34); splat(H, 11.85, 3.55, 0.28)
  streak(H, 'M4.6 18.55 H10.6', 0.34); splat(H, 11.85, 18.55, 0.28)
  const HA = hl()
  streak(HA, 'M6.8 10.1 C6.8 9.15 7.3 8.7 8.4 8.65 H11.6', 0.4)   // corner bean on the sheet
  streak(HA, 'M17.95 9.6 V15.6', 0.15)                                // reflected light on the shadow side
  // the sheet is its own part (wm-a): it drifts a beat behind the rollers, text and all
  return [node(lit(rollers, H), 'wm-k'), node(lit(sheet, HA), 'wm-a')]
}
