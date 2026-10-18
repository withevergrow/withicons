// forge/hand/chrome/utensils.mjs — a chrome fork with three slim, clearly parted tines on a fat handle, beside a broad
// gunmetal knife. The generated fork stroked its tines as fat as its handle, so the two slots closed into hairlines and
// the head read as one paddle at 16px; here the tines are slimmer and spread wider with air between them, and the knife
// blade is widened. Painted with the style's own layer recipe (_chrome-core).
import * as F from '../../styles/_chrome-field.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const subs = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => subs(d).map(s => s.pts)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const TINES = 'M3.25 2.75V7.75A4.25 4.25 0 0 0 11.75 7.75V2.75M7.5 2.75V9'
const HANDLE = 'M7.5 9V21.25'
const BLADE = 'M20.75 14.75V2.5C17.25 3.5 15 6.75 15 11V12.75A2 2 0 0 0 17 14.75Z'
const KHANDLE = 'M18.5 14.5V21.25'

export default function render(icon) {
  const name = (icon && icon.name) || 'utensils'
  const fK = F.strokes(subs(TINES), 1.85, M0)
  F.strokes(subs(HANDLE), 2.6, M0, fK)
  const fA = F.region(rings(BLADE), M0)
  F.strokes(subs(KHANDLE), 2.6, M0, fA)
  const sil = F.union(F.copy(fK), fA)
  const M = { T: {}, K: F.open(F.copy(fK), 0.32), Af: null, Ab: F.open(F.copy(fA), 0.32), S: null, sil, txt: null, seam: null }
  const Ls = layers(M)
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
