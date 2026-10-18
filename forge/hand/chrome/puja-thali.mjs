// forge/hand/chrome/puja-thali.mjs — a chrome puja thali: a wide polished plate with a bold rim round a dark gunmetal
// well, a chrome diya (a deep oil bowl with a pointed lip) standing on it, cleared from the plate by a dark seam, and a
// big enamel flame above the wick. The generated drawing stacked a small drop, a pill and a ring into a muddy blob at
// 16px; one big flame over one clear bowl over one wide plate reads as a lamp on a platter. Painted with the style's own
// layer recipe (_chrome-core), enamel jewel as the flame, the way the generator paints an S part.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const reg = (d, into = null) => F.region(rings(d), M0, into)
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)
const ell = (cx, cy, rx, ry) => `M${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}Z`
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const PLATE = ell(12, 18.4, 10.7, 3.6)
const WELL = ell(12, 18.1, 6.4, 1.3)
// the diya: a deep bowl, a pointed lip rising to the right (where the wick sits)
const BOWL = 'M5.2 11.4H15.4C16.8 11.4 18.2 10.6 19.6 9.2C19.7 14.2 16.6 16.6 12.4 16.6C8.2 16.6 5.2 14.4 5.2 11.4Z'
// the flame: a tall teardrop with a tip leaning right, over the wick
const FLAME = 'M13.8 1.2C14.2 3.5 16.9 5.2 16.9 8A3.9 3.9 0 0 1 9.1 8C9.1 5.9 10.2 4.7 11.3 3.5C11.5 4.7 12.1 5.4 12.9 5.5C13.6 4.5 13.9 3 13.8 1.2Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'puja-thali'
  const plate = reg(PLATE), well = reg(WELL), bowl = reg(BOWL), flame = F.region(rings(FLAME), 1.8)
  const gb = grow(bowl, 0.42), gw = grow(well, 0.42)
  // the plate rim, with the dark well set in it on a seam and the diya on top on another
  let K0 = minus(minus(plate, gw), gb)
  const Af = minus(well, gb)
  const seam = F.union(minus(F.intersect(F.copy(gw), plate), gb), F.intersect(F.copy(gb), plate))
  const round = x => F.open(F.copy(x), 0.32)
  // the flame is an enamel jewel, cleared from the bowl by a moat
  const Kc = round(minus(F.union(K0, bowl), grow(flame, 0.55)))
  const sil = F.union(F.union(F.copy(plate), bowl), flame)
  const Ls = layers({ T: { noGlint: true }, K: Kc, Af: round(Af), Ab: null, S: flame, sil, txt: null, seam })
  // the flame flickers (parts.A); the plate, its well and the diya are the body
  for (const L of Ls.list) L.cls = L.cls === 'wm-s' ? 'wm-a' : L.cls === 'wm-a' ? 'wm-k' : L.cls
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
