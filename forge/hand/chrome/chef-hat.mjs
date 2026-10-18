// forge/hand/chrome/chef-hat.mjs — a toque: a crown of three near-equal polished chrome puffs, each with its own top and
// split by notches cut about 1.9u deep, stepping in to a straight chrome drum that runs down to the hat's foot, where a
// gunmetal band wraps it (seamed only along its top edge). The crown takes about 55% of the height and the drum plus band
// the rest, so the read at 24 and 16px is crown, step, drum, band, not a domed mushroom over a floating bar.
import * as F from '../../styles/_chrome-field.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

// three puffs with separate tops (side tops 5.25, centre top 2.25)
const PUFFS = [disc(6, 8.5, 3.25), disc(12, 5.75, 3.5), disc(18, 8.5, 3.25)]
// the crown's lower body under the puffs: flat underside at 12.5, wider than the drum so the crown steps in
const BASE = 'M4 8H20V11A1.5 1.5 0 0 1 18.5 12.5H5.5A1.5 1.5 0 0 1 4 11Z'
// notches cut between the puffs so the scallops survive at 16px
const NOTCH = [disc(8.6, 6.45, 0.7), disc(15.4, 6.45, 0.7)]
// the straight drum, down to the band's top edge
const DRUM = 'M7 11.5H17V17.6H7Z'
// the band wrapped round the drum's foot, a touch wider than the drum
const BAND = 'M6.5 18H17.5V20.25A1.25 1.25 0 0 1 16.25 21.5H7.75A1.25 1.25 0 0 1 6.5 20.25Z'
// the parting line along the band's top edge only
const SEAM = 'M7 17.6H17V18.05H7Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'chef-hat'
  const fK = F.field(M0)
  for (const d of [...PUFFS, BASE, DRUM]) F.region(rings(d), M0, fK)
  const fN = F.field(M0)
  for (const d of NOTCH) F.region(rings(d), M0, fN)
  const K1 = F.subtract(F.copy(fK), fN)
  const fA = F.region(rings(BAND), M0)
  const seam = F.region(rings(SEAM), M0)
  const sil = F.union(F.union(F.copy(K1), fA), F.copy(seam))
  const M = { T: {}, K: F.open(K1, 0.32), Af: F.open(F.copy(fA), 0.32), Ab: null, S: null, sil, txt: null, seam }
  const Ls = layers(M)
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
