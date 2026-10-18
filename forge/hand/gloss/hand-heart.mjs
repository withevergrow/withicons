// forge/hand/gloss/hand-heart.mjs — a big glossy heart floating over an open vinyl hand: a cuff, a plump thumb pad
// parted from the curled fingers by one carved groove, and a heart with the style's corner bean and glint. The generated
// drawing shrank the heart against a fused cuff-and-palm slab whose thin thumb groove vanished at 16px; here the heart
// fills the top half and the hand is a clear palm, thumb and cuff, each part apart from the next.
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


// the open hand (shared by hand-heart and hand-coins): a cuff, then a palm whose thumb pad lies on top and whose
// fingers curl up to the right, the thumb parted from the fingers by a carved groove
const CUFF = 'M2 14 A1.25 1.25 0 0 1 4.5 14 V20.5 A1.25 1.25 0 0 1 2 20.5 Z'
const PALM = 'M6.4 13.25 H10.75 C12.35 13.25 13.5 14.2 13.8 15.4 L17.7 12.85 C18.9 12.05 20.6 12.4 21.35 13.55 C22 14.6 21.75 15.9 20.9 16.6 L15.4 20.9 C14.5 21.55 13.5 21.9 12.4 21.9 H6.4 A1 1 0 0 1 5.4 20.9 V14.25 A1 1 0 0 1 6.4 13.25 Z'
const THUMB = 'M8.25 17.75 H11.75 C12.9 17.75 13.75 17 13.9 15.9'
const hand = H => {
  const palm = region(PALM)
  cut(palm, tube(THUMB, 0.65))
  streak(H, 'M6.4 15.6 C6.45 14.75 6.95 14.35 8 14.3 H10.6', 0.4)     // bean on the thumb pad
  streak(H, 'M15.6 15.45 L18.2 13.75', 0.3)                          // streak along the fingers
  streak(H, 'M7 21.1 H12.3 C12.95 21.1 13.4 21 13.8 20.8', 0.15)        // reflected light under the palm
  streak(H, 'M2.75 14.6 V18.6', 0.28)                                // cuff
  return union(region(CUFF), palm)
}

const HEART = 'M12 11.75 C9.6 10.35 6.25 7.9 6.25 4.95 C6.25 3.05 7.7 1.75 9.45 1.75 C10.55 1.75 11.45 2.3 12 3.15 C12.55 2.3 13.45 1.75 14.55 1.75 C16.3 1.75 17.75 3.05 17.75 4.95 C17.75 7.9 14.4 10.35 12 11.75 Z'

export default function render() {
  const H = hl()
  const body = hand(H)
  const HA = hl()
  streak(HA, 'M7.75 6.4 C7.6 4.45 8.35 3.3 10.1 3.2', 0.55); splat(HA, 8.05, 7.75, 0.36)
  streak(HA, 'M17.15 5.6 C17 7.6 15 9.5 13.1 10.75', 0.15)
  return [node(lit(body, H), 'wm-k'), node(lit(region(HEART), HA), 'wm-a')]
}
