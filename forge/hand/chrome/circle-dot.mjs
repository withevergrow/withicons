// forge/hand/chrome/circle-dot.mjs — a fat polished chrome ring round one big solid gunmetal ball, with a clear moat
// between them. The generated drawing nested three things (ring, a chrome disc, a small gunmetal donut) and the dark
// mirror horizon ran straight through the centre, so at 16px it read as a no-entry sign; here the ball keeps a clean
// top-lit gunmetal ramp with no horizon bar, and only the ring carries the style's horizon.
// Painted with the style's own layer recipe (_chrome-core layers/emit).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const disc = r => `M${12 + r} 12A${r} ${r} 0 1 1 ${12 - r} 12A${r} ${r} 0 1 1 ${12 + r} 12Z`
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

export default function render() {
  // ring: a 2.9u chrome tube (the style's line tube) whose outer edge matches the generated discs
  const K = F.strokes(lines(disc(9.3)), 2.9, M0)
  // the dot: a solid ball, r 4 (3.5u drawn), clear of the ring by a wide moat
  const A = F.open(F.region(rings(disc(4)), M0), 0.32)
  const sil = F.copy(K); F.union(sil, A)
  // the ball keeps its own clean ramp: the horizon and the dark ground stay off it
  const txt = F.region(rings(disc(4.5)), M0)
  const Ls = layers({ T: {}, K: F.open(K, 0.32), Af: A, Ab: null, S: null, sil, txt, seam: null })
  let out = emit(Ls, 'circle-dot', 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, 'circle-dot', t)
  return out
}
