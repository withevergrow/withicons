// forge/hand/chrome/notebook.mjs — a tall polished chrome cover with three fat gunmetal binding rings clamped over its
// left edge, sticking well out past the spine on dark seams, and a title slot cut in the cover. The generated rings
// were tiny grooved pills tucked inside the edge (the middle one lost in the dark mirror horizon), so at 16px the
// notebook read as a plain slab or a list; here the rings carry the silhouette and the horizon stops short of them.
// Same paint as the generator (_chrome-core layers/emit); the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, K as CK } from '../../styles/_chrome-core.mjs'

const COVER = 'M8 2.5H18A2 2 0 0 1 20 4.5V19.5A2 2 0 0 1 18 21.5H8A2 2 0 0 1 6 19.5V4.5A2 2 0 0 1 8 2.5Z'
// the binding rings: short bars across the cover's left edge
const RINGS = ['M3.75 7H8.5', 'M3.75 12H8.5', 'M3.75 17H8.5']
// the title slot on the cover
const TITLE = 'M12.75 7H17'

const tf = p => [(p[0] - 12) * CK.SCALE + 12 + CK.TX, (p[1] - 12) * CK.SCALE + 12 + CK.TY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = CK.M
const minus = (A, B) => F.subtract(F.copy(A), B)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

export default function render(icon) {
  const name = (icon && icon.name) || 'notebook'
  // the cover: the skeleton slab inflated by the style's K tube and filled, the title slot cut through
  const Kf = F.strokes(lines(COVER), CK.WK, M0)
  F.region(rings(COVER), M0, Kf)
  const slot = F.strokes(lines(TITLE), 1.6, M0)
  // the rings, gunmetal, in front of the cover; a parting gap reads as a dark seam where they cross it
  const rl = RINGS.flatMap(lines)
  const Af = F.strokes(rl, 2.45, M0)
  const gap = F.offset(F.copy(Af), -CK.GAP)
  const seam = minus(F.intersect(F.copy(gap), Kf), slot)
  const body = minus(Kf, slot)
  const K = F.open(minus(body, gap), CK.ROUND)
  const A = F.open(Af, CK.ROUND)
  const sil = F.copy(body); F.union(sil, Af)
  // the cover's horizon and dark ground stop short of the rings
  const txt = F.strokes(rl, 4.6, M0)
  const Ls = layers({ T: {}, K, Af: A, Ab: null, S: null, sil, txt, seam })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
