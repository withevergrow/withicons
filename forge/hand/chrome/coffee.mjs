// forge/hand/chrome/coffee.mjs — a polished chrome mug seen a little from above: an oval rim with dark gunmetal
// coffee set inside it, a fat gunmetal D handle with a small hole, and two plump steam wisps. The generated mug was a
// flat-topped box with a thin wire handle, so at 16px it read as a jar or a pot and the handle all but vanished.
// Painted with the style's own layer recipe (_chrome-core); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const has = x => x && F.any(x)
const minus = (A, B) => F.subtract(F.copy(A), B)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

// the model the generator builds (_chrome-core model()): body, front gunmetal piece cleared by a dark seam, back pieces
function compose({ K, Af = null, Ab = null }) {
  let K0 = F.copy(K), seam = null
  if (has(Af)) { const g = F.offset(F.copy(Af), -0.42); seam = F.intersect(F.copy(g), K); K0 = minus(K0, g) }
  const sil = F.copy(K)
  if (has(Af)) F.union(sil, Af)
  if (has(Ab)) F.union(sil, Ab)
  const round = x => has(x) ? F.open(F.copy(x), 0.32) : null
  return { T: {}, K: round(K0), Af: round(Af), Ab: round(Ab), S: null, sil, txt: null, seam }
}

// mug: an oval rim on top, sides narrowing a little to a round-cornered foot
const CUP = 'M2.6 10.2A7.15 2.1 0 0 1 16.9 10.2L16.25 18.1C16 20.4 14.5 21.9 12.3 21.9H7.2C5 21.9 3.5 20.4 3.25 18.1Z'
// the coffee inside the rim
const COFFEE = 'M4.35 10.55A5.4 1.05 0 0 1 15.15 10.55A5.4 1.05 0 0 1 4.35 10.55Z'
// handle: a D ring (even-odd: outer minus hole), tucked behind the mug
const HANDLE = 'M15.5 11.6H17.7A3.45 3.45 0 0 1 17.7 18.5H15.5Z M15.5 13.55H17.55A1.4 1.4 0 0 1 17.55 16.35H15.5Z'
// steam: two plump S wisps
const STEAM = 'M7.7 6.7C6.25 5.7 9.75 4.45 8.2 2.85 M11.7 6.7C10.25 5.7 13.75 4.45 12.2 2.85'

export default function render(icon) {
  const name = (icon && icon.name) || 'coffee'
  const K = F.region(rings(CUP), M0)
  const Af = F.region(rings(COFFEE), M0)
  const Ab = F.region(rings(HANDLE), M0)
  F.strokes(lines(STEAM), 1.95, M0, Ab)
  const Ls = layers(compose({ K, Af, Ab }))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
