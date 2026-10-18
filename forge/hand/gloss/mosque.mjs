// forge/hand/gloss/mosque.mjs — a glossy mosque: a full onion dome standing on the prayer hall behind a clear parting
// groove, a pointed-arch door, a minaret with a balcony set well apart, and a crescent finial floating free above.
// The dome (with its knob), the hall on its ground bar and the minaret (shaft, balcony, spire) are modelled and lit as
// three separate vinyl parts, each with its own top-left glint, dot and shadow-side rim light, like the other gloss
// buildings (one fused render left the small pieces unlit, so the mosque read as Solid). Same SDF modelling and
// highlight rim as forge/styles/gloss.mjs (the gloss field kit, as in avatar-person).
import { distField, evenOddMask, contours, ringsToD, segsOf, NN, N, gx } from '../../styles/_gloss-field.mjs'
import { parsePath, resample, circle } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets } from '../../kernel/bool.mjs'
import gloss from '../../styles/gloss.mjs'

// ---- the gloss field kit ----
const BAND = 4.5, RIM = 0.5
const subs = d => parsePath(d, 0.1).filter(s => s.pts.length)
const offRow = y => { const t = (y + 0.8) * 10; return Math.abs(t - Math.round(t)) < 1e-3 ? y + 0.003 : y }
const region = (d, g = 0) => {
  const ss = subs(d), m = evenOddMask(ss.map(s => s.pts.map(([x, y]) => [x, offRow(y)])))
  const df = distField(segsOf(ss.map(s => ({ pts: s.pts, closed: true }))), BAND), F = new Float32Array(NN)
  for (let k = 0; k < NN; k++) F[k] = (m[k] ? df[k] : -df[k]) + g
  return F
}
const soft = (d, r) => region(ringsToD(contours(region(d, -r), 0)), r)
const union = (...fs) => { const o = Float32Array.from(fs[0]); for (const f of fs.slice(1)) for (let k = 0; k < NN; k++) if (f[k] > o[k]) o[k] = f[k]; return o }
const cut = (a, b, gap = 0) => { for (let k = 0; k < NN; k++) a[k] = Math.min(a[k], -b[k] - gap); return a }
const splat = (H, x, y, r) => {
  const i0 = Math.max(0, Math.floor((x - r - 0.3 - gx(0)) * 10)), i1 = Math.min(N - 1, Math.ceil((x + r + 0.3 - gx(0)) * 10))
  const j0 = Math.max(0, Math.floor((y - r - 0.3 - gx(0)) * 10)), j1 = Math.min(N - 1, Math.ceil((y + r + 0.3 - gx(0)) * 10))
  for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) { const k = j * N + i, v = r - Math.hypot(gx(i) - x, gx(j) - y); if (v > H[k]) H[k] = v }
}
const streak = (H, d, w, tip = 0.1) => { for (const s of subs(d)) resample(s.pts, 0.08).forEach(({ p, u }) => splat(H, p[0], p[1], tip + (w - tip) * Math.pow(Math.sin(Math.PI * u), 0.5))) }
const lit = (B, H, R) => { const S = new Float32Array(NN); for (let k = 0; k < NN; k++) { let v = Math.max(-H[k], RIM - B[k]); if (R) v = Math.min(v, Math.max(-R[k], 0.33 - B[k])); S[k] = Math.min(B[k], v) } return S }
const node = (S, cls) => ['path', { d: ringsToD(contours(S, 0)), 'fill-rule': 'evenodd', class: cls }]
const hl = () => new Float32Array(NN).fill(-9)

const GROUND = 'M3.38 20.5 H20.62 A0.88 0.88 0 0 1 20.62 22.25 H3.38 A0.88 0.88 0 0 1 3.38 20.5 Z'
const HALL = 'M3.5 21 V16.75 A1.5 1.5 0 0 1 5 15.25 H12.5 A1.5 1.5 0 0 1 14 16.75 V21 Z'
const DOOR = 'M7.6 20.75 V19.1 C7.6 18.25 8.3 17.55 8.75 17 C9.2 17.55 9.9 18.25 9.9 19.1 V20.75 Z'
// onion dome, x 3.6 to 13.9, base at 13.75 (a 1.5u parting groove above the hall top at 15.25)
const DOME = 'M4.7 13.75 C3.05 11.75 3.8 9.85 6.05 8.75 C7.55 8 8.55 7.55 8.75 6.6 C8.95 7.55 9.95 8 11.45 8.75 ' +
  'C13.7 9.85 14.45 11.75 12.8 13.75 Z'
const KNOB = 'M8.75 5.7 A0.65 0.65 0 1 1 8.75 7 A0.65 0.65 0 1 1 8.75 5.7 Z'
const SHAFT = 'M17.75 21 V12 H20.25 V21 Z'
const BALCONY = 'M17.35 11 H20.65 A0.6 0.6 0 0 1 21.25 11.6 V12 A0.6 0.6 0 0 1 20.65 12.6 H17.35 A0.6 0.6 0 0 1 16.75 12 V11.6 A0.6 0.6 0 0 1 17.35 11 Z'
const SPIRE = 'M17.6 11.25 L18.65 6.6 C18.75 6.2 19.25 6.2 19.35 6.6 L20.4 11.25 Z'
// the crescent: a disc less an offset disc, opening to the upper right like the skeleton's finial (unchanged)
const CRESCENT = differenceSets(setOf([circle(8.75, 3.1, 1.85, 0.1)]), setOf([circle(9.7, 2.4, 1.45, 0.1)]))
const crescentSk = name => {
  const set = CRESCENT
  return { name, paths: [], fills: [{ d: '', subs: set.map(r => ({ pts: r, closed: true })), set }], cutouts: [], lines: [], fillSet: unionSets([set]) }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'mosque'
  const hall = union(soft(HALL, 0.3), region(GROUND))
  cut(hall, region(DOOR))
  const dome = union(region(DOME), region(KNOB))
  const minaret = union(region(SHAFT), soft(BALCONY, 0.2), region(SPIRE))
  const H = hl(), R = hl()
  // dome: a long curved glint along the upper-left shoulder, and a dot beyond its tip
  streak(H, 'M4.95 12.35 C4.65 10.9 5.45 9.75 7.05 9.05', 0.5)
  splat(H, 8.15, 8.6, 0.27)
  streak(R, 'M13.25 11.6 C13.15 12.4 12.85 12.95 12.35 13.45', 0.15)
  // hall: a glint turning the top-left corner, and a dot along the roof line
  streak(H, 'M4.55 19.4 C4.45 17.65 4.85 16.55 6.75 16.3', 0.4)
  splat(H, 7.75, 16.3, 0.25)
  streak(R, 'M13.67 17.4 V19.9', 0.14)
  streak(R, 'M14.6 21.92 H17.2', 0.13)
  // minaret: a slim glint down the shaft, a pin-prick on the spire
  streak(H, 'M18.45 13.5 V17.4', 0.3)
  splat(H, 18.75, 8.6, 0.16)
  streak(R, 'M19.92 13.9 V19.6', 0.12)
  return [
    node(lit(hall, H, R), 'wm-k'),
    node(lit(dome, H, R), 'wm-k'),
    node(lit(minaret, H, R), 'wm-k'),
    ...gloss.render(crescentSk(name)).map(([t, a]) => [t, { ...a, class: 'wm-s' }]),
  ]
}
