// forge/hand/chrome/playground.mjs: a chrome playground slide drawn as the line design: an arched ladder (two rails
// that meet in a round top, with two rungs) in polished chrome, and a thick gunmetal slide ribbon that leaves the
// ladder's top, curves down in an S and flattens out at the ground on the right, tucked behind the rail. The generated
// version fattened the strokes into one grey slab and lost both the ladder and the slide.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = ds => ds.flatMap(d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: false })))

const LADDER = ['M3.6 21.2V6.2A2.4 2.4 0 0 1 8.4 6.2V21.2', 'M3.6 12.4H8.4', 'M3.6 16.9H8.4']
const SLIDE = ['M8.4 8.6C12 8.6 13.3 11.6 14.8 15C16 17.9 17.6 20 21.4 20']
const GROUND = []

export default function render(icon) {
  const name = (icon && icon.name) || 'playground'
  const K = F.open(F.strokes(lines(LADDER), 2.3 * S, 0.7), 0.25)
  const Ab = F.open(F.strokes(lines(SLIDE), 3.1 * S, 0.7), 0.3)
  const sil = F.copy(K); F.union(sil, Ab)
  return emit(layers({ T: {}, K, Af: null, Ab, S: null, sil, txt: null, seam: null }), name, 0)
}
