// forge/hand/chrome/flame.mjs — a polished chrome flame with two tongues (a tall main tongue leaning right and a
// short side tongue on the left, split by a deep notch) holding a hot enamel core: the inner hooked teardrop is the
// style's jewel (S), a bright coloured flame in a chrome bezel with a clear moat round it. The generated flame set a
// murky gunmetal drop on the chrome, the same grey as the body, so the two shapes blurred into a water drop; the enamel
// core is the one colour on the silver and is what makes it read as fire at 16px. The core is the part that
// flickers (the spec animates parts.A): wm-a. Painted with the style's own recipe (_chrome-core layers/emit).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = (d, k = 1, c = [12, 16]) => parsePath(d).map(s => s.pts.map(p => tf([c[0] + (p[0] - c[0]) * k, c[1] + (p[1] - c[1]) * k])))
const M0 = 0.7, MS = 0.55 + 0.6, MOAT = 0.55
const minus = (A, B) => F.subtract(F.copy(A), B)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

// outer silhouette (already at the inflated size of the generated bodies): the side tongue's notch is cut wide and
// down to y 12 so it survives the rounding; the main tongue's right flank tucks in at y 7-9 so the tip whips
const BODY = 'M12 22C7.8 22 4.6 19.2 4.6 15.3C4.6 12.2 5.2 10 6 8.4C6.4 7.6 6.4 7 6.2 6.5C7.6 7.4 8.6 8.6 9.2 10.2' +
  'L9.8 12C9.6 8.4 11.4 4.6 14.5 1.8C15.4 3.2 16.6 4.2 16.8 5.8C17 7.2 15.7 8 17 9.6C18.4 11.2 19.4 12.8 19.4 15.3' +
  'C19.4 19.2 16.2 22 12 22Z'
// the core: S-curved left flank, fuller right belly, tip hooked right (this is the jewel's outer edge: the enamel
// is this shape inset by the bezel)
const CORE = 'M12.1 20C10.2 20 8.9 18.9 8.9 17.1C8.9 15.5 10 14.6 11 13.7C12 12.8 13 12 14.2 10C14.2 11.9 14.8 13 15.4 14.2C16 15.4 16.1 16.4 15.7 17.5C15.2 19.1 13.9 20 12.1 20Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'flame'
  const K = F.region(rings(BODY), M0)
  const fS = F.region(rings(CORE, 0.88), MS)
  const moat = F.offset(F.copy(fS), -MOAT)
  const body = minus(K, moat)
  const sil = F.copy(K); F.union(sil, fS)
  const M = { T: {}, K: F.any(body) ? F.open(F.copy(body), 0.32) : null, Af: null, Ab: null, S: fS, sil, txt: null, seam: null }
  const Ls = layers(M)
  for (const L of Ls.list) { if (L.cls === 'wm-s') L.cls = 'wm-a'; else if (!L.cls) L.cls = 'wm-k' }
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
