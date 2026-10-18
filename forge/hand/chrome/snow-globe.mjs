// forge/hand/chrome/snow-globe.mjs — a clear chrome-ringed glass globe holding one pink enamel fir tree on a chrome
// snow bank, standing on a gunmetal base cut clear of the glass by a dark parting seam. The generated globe was a muddy
// blob where the tree and base could not be told apart. Same paint as the generator (_chrome-core.mjs); only the
// geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7, GAP = 0.42, MOAT = 0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).filter(s => s.pts.length > 2).map(s => s.pts.map(tf))
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const reg = (d, m = M0) => F.region(rings(d), m)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

const GLOBE = disc(12, 10, 7.9)                              // the glass ring (a tube along this circle)
const BANK = 'M4.4 12.6C7.4 11.4 10 12.3 12 12.9C14.2 13.5 16.8 12.2 19.6 12.8V20H4.4Z'  // snow bank filling the lower globe
const TREE = 'M12 3.9L15.4 8H13.6L16.2 11.4H13.4V12.8H10.6V11.4H7.8L10.4 8H8.6Z'
const BASE = 'M6.2 17.9H17.8L19.4 21.7H4.6Z'

export default function render() {
  const ring = F.strokes(lines(GLOBE), 2.5, M0)
  const inside = reg(disc(12, 10, 7.9))
  const bank = F.intersect(reg(BANK), F.offset(F.copy(inside), 0.2))
  const body = F.union(ring, bank)
  const fA = reg(BASE)
  const fS = reg(TREE, MOAT + 0.6)
  const g = F.offset(F.copy(fA), -GAP)
  const moat = F.offset(F.copy(fS), -MOAT)
  let K0 = F.subtract(F.copy(body), g)
  const seam = F.subtract(F.intersect(F.copy(g), body), moat)
  K0 = F.subtract(K0, moat)
  const Af = F.subtract(F.copy(fA), moat)
  const sil = F.copy(body); F.union(sil, fA); F.union(sil, fS)
  const Ls = layers({ T: {}, K: F.open(K0, 0.32), Af: F.open(Af, 0.32), Ab: null, S: fS, sil, txt: null, seam })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let o = emit(Ls, 'snow-globe', 0)
  for (let t = 1; t < 3 && size(o) > 8000; t++) o = emit(Ls, 'snow-globe', t)
  return o
}
