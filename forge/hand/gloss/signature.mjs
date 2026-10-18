// forge/hand/gloss/signature.mjs — a glossy vinyl signature: one bold looped capital with an open counter running into
// two even waves, lifted clear above a firm baseline rod. The generated drawing inflated the 2u flourish until the loop
// closed into a ghost-shaped blob and the waves webbed together, so the scrawl stopped reading as handwriting; here the
// pen stroke is a slightly slimmer tube drawn so every counter and wave valley stays open, with one streak per stroke.
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

// a streak riding a tube's lit side: stretch u0..u1 of centreline d, pushed `off` toward the light (upper-left)
const LT = [-0.55 / Math.hypot(0.55, 0.835), -0.835 / Math.hypot(0.55, 0.835)]
const glide = (H, d, off, w, u0, u1, tip = 0.1) => {
  const P = resample(subs(d)[0].pts, 0.08).filter(o => o.u >= u0 && o.u <= u1), n = P.length
  P.forEach(({ p, t }, q) => {
    let nx = -t[1], ny = t[0]; if (nx * LT[0] + ny * LT[1] < 0) { nx = -nx; ny = -ny }
    splat(H, p[0] + nx * off, p[1] + ny * off, tip + (w - tip) * Math.pow(Math.sin(Math.PI * q / Math.max(1, n - 1)), 0.5))
  })
}
// morphological closing by rc (the generator's inner-corner rounding): crossings and inner corners fill in softly
const close = (F, rc = 0.55) => {
  const D = distField(segsOf(contours(F, -rc).map(pts => ({ pts, closed: true }))), BAND), O = new Float32Array(NN)
  for (let k = 0; k < NN; k++) O[k] = F[k] > -rc ? D[k] - rc : -D[k] - rc
  return O
}

const PEN = 'M3 17 C5 14 8.75 8.75 10.5 6.25 C11.75 4.5 11 3.25 9 3.25 C6.75 3.25 5.5 5 5.5 7.25 C5.5 10.5 7.25 16.75 9.75 16.75 C11.25 16.75 11.75 13.25 13.25 13.25 C14.75 13.25 14.75 16.75 16.25 16.75 C17.75 16.75 18.5 14.25 20.75 14.25'
const LINE = 'M3.5 20.5 H20.5'

export default function render() {
  const pen = close(tube(PEN, 1.2), 0.3)
  const line = tube(LINE, 1.2)
  const H = hl()
  streak(H, 'M5 8.2 C4.85 5.4 6.4 3.05 8.75 2.8', 0.28)    // over the lit top-left of the loop
  streak(H, 'M17.4 14.35 C18.4 13.8 19.3 13.65 20.3 13.65', 0.22)  // along the tail
  const HL = hl()
  glide(HL, LINE, 0.5, 0.25, 0.08, 0.42)
  return [node(lit(pen, H), 'wm-k'), node(lit(line, HL), 'wm-a')]
}
