// forge/hand/chrome/cup-soda.mjs — a polished chrome takeaway cup: a strongly tapered cup under a separate lid (a wide
// lip that overhangs the cup on both sides, topped by a low dome) parted from it by a clean gap, and a bent gunmetal
// straw rising out of the dome. The generated drawing had a flat bar for a lid on a nearly straight cup with a groove
// across its middle, so it read as a bucket or a pot; the overhanging lip, the dome and the taper make it a drink cup.
// Same placement and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const subs = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => subs(d).map(s => s.pts)
const reg = (d, into = null) => F.region(rings(d), M0, into)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

// the lid: an overhanging lip and a low dome on it
const LIP = 'M3.5 8.5A1.25 1.25 0 0 1 4.75 7.25H19.25A1.25 1.25 0 0 1 20.5 8.5V8.75A1.25 1.25 0 0 1 19.25 10H4.75A1.25 1.25 0 0 1 3.5 8.75Z'
const DOME = 'M6.5 7.75C7 5.75 9 4.75 12 4.75C15 4.75 17 5.75 17.5 7.75Z'
// the cup, tapering hard to a narrow base
const CUP = 'M5.25 11H18.75L17.3 20A1.75 1.75 0 0 1 15.55 21.5H8.45A1.75 1.75 0 0 1 6.7 20Z'
// the straw, bent at the top, standing behind the lid
const STRAW = 'M12.75 6.5L14 2.5H17'

export default function render(icon) {
  const name = (icon && icon.name) || 'cup-soda'
  const fK = reg(LIP); reg(DOME, fK); reg(CUP, fK)
  const K = F.open(fK, 0.32)
  const Ab = F.open(F.strokes(subs(STRAW), 1.75, M0), 0.2)
  const sil = F.union(F.copy(fK), Ab)
  const Ls = layers({ T: {}, K, Af: null, Ab, S: null, sil, txt: null, seam: null })
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
