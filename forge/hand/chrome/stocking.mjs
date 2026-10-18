// forge/hand/chrome/stocking.mjs — a Christmas stocking in polished chrome: a long leg bending into a foot with a clear
// heel and a rounded toe, a gunmetal cuff band across the top
// set in the chrome by a dark parting seam. The generated stocking was a stubby grey block. Same paint as the
// generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7, GAP = 0.42
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).filter(s => s.pts.length > 2).map(s => s.pts.map(tf))
const reg = d => F.region(rings(d), M0)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

// leg, ankle bend, foot: straight leg down the left, a round heel, a long foot to a round toe, the instep tucking back up
const BODY = 'M7.4 7V15C7.4 18.7 10.2 21.6 13.8 21.6H18.2C20.3 21.6 21.9 20 21.9 18C21.9 16.1 20.4 14.6 18.5 14.6H17.9C16.8 14.6 16 13.8 16 12.7V7Z'
const CUFF = 'M7.2 3H16.8A1.7 1.7 0 0 1 18.5 4.7V6.3A1.7 1.7 0 0 1 16.8 8H7.2A1.7 1.7 0 0 1 5.5 6.3V4.7A1.7 1.7 0 0 1 7.2 3Z'

export default function render() {
  const body = reg(BODY)
  const cuff = reg(CUFF)
  const fA = F.copy(cuff)
  const g = F.offset(F.copy(fA), -GAP)
  const K0 = F.subtract(F.copy(body), g)
  const seam = F.intersect(F.copy(g), body)
  const sil = F.copy(body); F.union(sil, cuff)
  const Ls = layers({ T: {}, K: F.open(K0, 0.32), Af: F.open(fA, 0.32), Ab: null, S: null, sil, txt: null, seam })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let o = emit(Ls, 'stocking', 0)
  for (let t = 1; t < 3 && size(o) > 8000; t++) o = emit(Ls, 'stocking', t)
  return o
}
