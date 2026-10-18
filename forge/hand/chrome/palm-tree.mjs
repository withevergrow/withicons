// forge/hand/chrome/palm-tree.mjs — a polished chrome palm: four fat solid fronds (two arching high, two drooping
// lower) splayed from one crown, a tapered trunk leaning gently, on a gunmetal island mound (wm-a, it pulses). The
// generator stroked each frond outline as a thin tube and cut its vein texture through it, so the crown broke into
// skinny hollow loops at 16px. Painted with the style's own recipe (_chrome-core layers/emit).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, K } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : JSON.stringify(x[1]).length + 20), 0)

// fronds: each a crescent from the crown, upper pair arching to the sides, lower pair drooping
const FRONDS = [
  'M12 6.6C10.4 2.4 4.6 2.2 2.4 8.6C5.4 6.1 8.6 5.9 12 6.6Z',
  'M12 6.6C13.6 2.4 19.4 2.2 21.6 8.6C18.6 6.1 15.4 5.9 12 6.6Z',
  'M11.6 7.6C8 7.4 5 9.6 4.8 13.6C7.2 11.2 9.6 9.9 11.6 7.6Z',
  'M12.4 7.6C16 7.4 19 9.6 19.2 13.6C16.8 11.2 14.4 9.9 12.4 7.6Z',
]
// trunk: wider at the foot, leaning a touch right then back
const TRUNK = 'M11.3 7.2C12.3 7.1 12.9 7.2 13.1 7.6C14 11.5 13.9 16 12.8 20.4H10.4C11.7 16.3 12.1 12 11.3 7.2Z'
// island mound
const ISLAND = 'M5.2 21.6C7 19.7 9.4 19 12 19C14.6 19 17 19.7 18.8 21.6Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'palm-tree'
  const round = x => F.open(F.copy(x), K.ROUND)
  const crown = F.field(M0)
  for (const d of FRONDS) { F.strokes(lines(d), 1.15, M0, crown); F.region(rings(d), M0, crown) }
  F.strokes(lines(TRUNK), 0.9, M0, crown)
  F.region(rings(TRUNK), M0, crown)
  const isl = F.strokes(lines(ISLAND), 1.1, M0)
  F.region(rings(ISLAND), M0, isl)
  const sil = F.copy(crown); F.union(sil, isl)
  const Ls = layers({ T: {}, K: round(crown), Af: null, Ab: round(isl), S: null, sil, txt: null, seam: null })
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
