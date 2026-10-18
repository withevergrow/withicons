// forge/hand/chrome/messages.mjs — two chrome speech bubbles, the back one up on the left and the front one down on
// the right with its tail in the bottom corner, parted by a clear paper gap so they never fuse into one dark mass.
// Both take the bright chrome reflection (the front bubble is the A part, so it can still move on its own).
// The generated front bubble was gunmetal against a chrome back bubble and, with no gap, they read as one slab.
// Same layer recipe as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, K } from '../../styles/_chrome-core.mjs'

const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)

const BACK = 'M2.6 16.4V5.6A2.6 2.6 0 0 1 5.2 3H12.4A2.6 2.6 0 0 1 15 5.6V9.9A2.6 2.6 0 0 1 12.4 12.5H6.5Z'
const FRONT = 'M21.4 21.4V10.8A2.6 2.6 0 0 0 18.8 8.2H11.6A2.6 2.6 0 0 0 9 10.8V15.2A2.6 2.6 0 0 0 11.6 17.8H17.5Z'
const GAP = 0.62

export default function render(icon) {
  const name = (icon && icon.name) || 'messages'
  const back = F.region(rings(BACK), M0)
  const front = F.region(rings(FRONT), M0)
  const Kb = minus(back, grow(front, GAP))
  const sil = F.copy(back); F.union(sil, front)
  const round = Fd => F.open(Fd, K.ROUND)
  const Ls = layers({ T: {}, K: round(Kb), Af: round(front), Ab: null, S: null, sil, txt: null, seam: null })
  // the front bubble takes the same bright chrome ramps as the back one
  const swap = { metalSky: 'sky', metalGround: 'ground' }
  for (const L of Ls.list) if (Array.isArray(L.fill) && swap[L.fill[0]]) L.fill = [swap[L.fill[0]], L.fill[1]]
  return emit(Ls, name, 0)
}
