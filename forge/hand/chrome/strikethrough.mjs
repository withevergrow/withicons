// forge/hand/chrome/strikethrough.mjs — a fat polished chrome S crossed by a full-width gunmetal bar that sits in front
// of it, cut clear of the S by a dark parting seam, so the strike reads at 16px. The generated S was thin and the bar
// ran behind it and vanished. Same paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7, GAP = 0.42
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const out = (M, name) => { const Ls = layers(M); let o = emit(Ls, name, 0); for (let t = 1; t < 3 && size(o) > 8000; t++) o = emit(Ls, name, t); return o }

const LETTER = 'M18 6C16.7 4.4 14.6 3.5 12 3.5C8.4 3.5 5.8 5.5 5.8 8C5.8 10.6 8.3 12 12 12C15.7 12 18.2 13.4 18.2 16C18.2 18.5 15.6 20.5 12 20.5C9.4 20.5 7.3 19.6 6 18'
const BAR = 'M2.6 12H21.4'
export default function render() {
  const fK = F.strokes(lines(LETTER), 3.35, M0)
  const fA = F.strokes(lines(BAR), 2.7, M0)
  const g = F.offset(F.copy(fA), -GAP)
  const K0 = F.subtract(F.copy(fK), g)
  const seam = F.intersect(F.copy(g), fK)
  const sil = F.copy(fK); F.union(sil, fA)
  const Ls = layers({ T: {}, K: F.open(K0, 0.32), Af: F.open(F.copy(fA), 0.32), Ab: null, S: null, sil, txt: null, seam })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return size(emit(Ls, 'strikethrough', 0)) > 8000 ? emit(Ls, 'strikethrough', 1) : emit(Ls, 'strikethrough', 0)
}
