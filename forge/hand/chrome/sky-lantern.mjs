// forge/hand/chrome/sky-lantern.mjs: a chrome sky lantern: a plump paper-balloon body (wide shoulders, narrowing to the
// mouth) with a hanging loop, a hot pink enamel flame glowing in its middle (the style's jewel), and a gunmetal rim with
// a single tassel under it (the part that sways). The previous hexagon with dark cross bars read as a robot head; the
// pink flame is what says lantern, and one tassel keeps the dark ink light. Painted with the style's own recipe.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7, MS = 0.55 + 0.6, MOAT = 0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const minus = (A, B) => F.subtract(F.copy(A), B)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

// body: round shoulders, flanks narrowing to the mouth
const BODY = 'M12 3.2C16.8 3.2 19.9 6.4 19.4 10.6C19 13.4 17.2 15.4 15.7 16.7H8.3C6.8 15.4 5 13.4 4.6 10.6C4.1 6.4 7.2 3.2 12 3.2Z'
// rim: a short gunmetal collar over the mouth, a tassel hanging from it
const RIM = 'M8 16.2H16V18.2A.8.8 0 0 1 15.2 19H8.8A.8.8 0 0 1 8 18.2Z'
const TASSEL = 'M11.5 18.8H12.5V20.2H11.5Z M12 20C13.4 20 14.1 21.2 14.3 22.8H9.7C9.9 21.2 10.6 20 12 20Z'
const LOOP = 'M10.7 3.5C10.7 1.3 13.3 1.3 13.3 3.5'
// the flame: a teardrop with its tip hooked right, as the jewel
const FLAME = 'M12 15C9.9 15 8.7 13.8 8.7 12.2C8.7 10.9 9.6 10.1 10.5 9.2C11.3 8.4 11.9 7.6 12.4 6.2C12.5 7.4 13.1 8.2 13.8 9C14.6 9.9 15.3 10.7 15.3 12.2C15.3 13.8 14.1 15 12 15Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'sky-lantern'
  const body = F.region(rings(BODY), M0)
  F.union(body, F.strokes(lines(LOOP), 1.3, M0))
  const rim = F.region(rings(RIM), M0)
  const tassel = F.region(rings(TASSEL), M0)
  const fS = F.region(rings(FLAME), MS)
  const moat = F.offset(F.copy(fS), -MOAT)
  const gap = F.offset(F.copy(rim), -0.42)
  const seam = F.intersect(F.copy(gap), body)
  const K = F.open(F.copy(minus(minus(body, gap), moat)), 0.32)
  const sil = F.union(F.union(F.copy(body), rim), tassel)
  const Ls = layers({ T: {}, K, Af: F.open(F.copy(rim), 0.3), Ab: F.open(F.copy(tassel), 0.3), S: fS, sil, txt: null, seam })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 9000; t++) out = emit(Ls, name, t)
  return out
}
