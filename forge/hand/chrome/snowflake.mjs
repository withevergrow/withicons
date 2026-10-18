// forge/hand/chrome/snowflake.mjs — one polished chrome snowflake: six fat arms from a bright hub, each with one long,
// open V of slimmer chrome branches set out along it. The generated drawing laid gunmetal chevrons over the arm tips,
// where they fused into dark knobs. This redraw also (a) keeps the chrome horizon and dark ground off the hub, where they
// collected into a black slab across the flake, (b) gives the whole flake a heavier dark steel rim, so the lower arms,
// which take the pale end of the ground ramp, hold their edge on white at 16px, and (c) lengthens and opens the V
// branches so they read as branches, not knobs. Painted with the style's own layer recipe (_chrome-core).
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const M0 = 0.7
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const r2 = v => Math.round(v * 100) / 100

const R = 9.5          // arm length (skeleton units)
const RV = 5.75        // where each V leaves its arm
const LV = 3.75        // branch length
const AV = 56          // branch angle off the arm (degrees)
const WARM = 2.45, WBR = 1.65
const HUB = 2.9        // radius of the hub kept clear of the horizon and ground
const RIM = 0.14       // extra dark steel rim outside the style's own edge

const pt = (r, deg) => { const a = deg * Math.PI / 180; return [r2(12 + r * Math.cos(a)), r2(12 + r * Math.sin(a))] }

export default function render(icon) {
  const name = (icon && icon.name) || 'snowflake'
  const arms = [], branches = []
  for (let k = 0; k < 6; k++) {
    const a = -90 + 60 * k
    arms.push({ pts: [[12, 12], pt(R, a)].map(tf), closed: false })
    const v = pt(RV, a), [vx, vy] = v
    for (const s of [-1, 1]) {
      const b = (a + s * AV) * Math.PI / 180
      branches.push({ pts: [v, [r2(vx + LV * Math.cos(b)), r2(vy + LV * Math.sin(b))]].map(tf), closed: false })
    }
  }
  const Kf = F.strokes(arms, WARM, M0)
  F.strokes(branches, WBR, M0, Kf)
  const K = F.open(Kf, 0.32)
  // the hub: a disc where the horizon band and the ground ramp are not laid, so it stays bright chrome
  const disc = []
  for (let i = 0; i < 24; i++) disc.push(tf(pt(HUB, i * 15)))
  const txt = F.region([disc], M0)
  const Ls = layers({ T: {}, K, Af: null, Ab: null, S: null, sil: F.copy(Kf), txt, seam: null })
  // a heavier steel rim: the body's dark edge layer taken from the flake grown by RIM, laid under the rest
  const grown = F.offset(F.copy(K), -RIM)
  const Lr = layers({ T: { noGlint: true }, K: grown, Af: null, Ab: null, S: null, sil: F.copy(grown), txt: null, seam: null })
  const rim = Lr.list.find(L => L.fill === col('shadow') && !L.cls && L.op == null)
  const at = Ls.list.findIndex(L => L.cls === 'wm-shadow') + 1
  if (rim) Ls.list.splice(at, 0, rim)
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
