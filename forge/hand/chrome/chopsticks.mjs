// forge/hand/chrome/chopsticks.mjs — a polished chrome bowl with two gunmetal chopsticks resting across it,
// painted with the style's own layer recipe (_chrome-core layers/emit) on its field engine.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const loopsOf = Fd => F.contour(F.copy(Fd)).filter(l => l.length > 2)

// stalks (centrelines the chrome tube inflates): a tall one with a flared lip, a short one beside it
const STALKS = 'M3.5 13.25H20.5Q20 20.25 12 20.25Q4 20.25 3.5 13.25Z'
// node collars, a little proud of the stalks
const COLLARS = 'M4.5 13.25H19.5'
// node seams, across the face
const SEAMS = 'M5 15.5H19'
// leaves: slim gunmetal blades sprouting behind the stalks
const LEAVES = 'M8 11.5L16.5 3M13 11.5L20.5 4.5'

export default function render() {
  const Kf = F.strokes(lines(STALKS), 3.0, M0)
  F.region(rings(STALKS), M0, Kf)
  F.strokes(lines(COLLARS), 1.9, M0, Kf)
  const Kb = F.open(Kf, 0.32)
  const Af = F.strokes(lines(LEAVES), 2.0, M0)
  
  const Ab = F.open(F.subtract(Af, F.offset(F.copy(Kb), -0.05)), 0.2)
  const sil = F.copy(Kb); F.union(sil, Ab)

  const Ls = layers({ T: {}, K: Kb, Af: null, Ab, S: null, sil, txt: null, seam: null })
  // node seams: a fine dark groove with a bright lip just below, inside the chrome's bevel
  const face = F.offset(F.copy(Kb), 0.35)
  const seam = F.intersect(F.strokes(lines(SEAMS), 0.5, M0), face)
  const lip = F.intersect(F.shift(F.strokes(lines(SEAMS), 0.32, M0), 0, 5, 1), face)
  const extra = [
    { loops: loopsOf(seam), fill: col('ink'), cls: 'wm-k', q: 'body' },
    { loops: loopsOf(lip), fill: col('shine'), cls: 'wm-k', op: 0.8, q: 'body' },
  ]
  Ls.list.push(...extra)
  let out = emit(Ls, 'chopsticks', 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, 'chopsticks', t)
  return out
}
