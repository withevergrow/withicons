// forge/hand/chrome/square-minus.mjs — a polished chrome tile with one fat gunmetal minus bar standing proud of it on a
// dark seam. The generated bar was a thin pale groove lying exactly on the tile's dark mirror horizon, so the horizon
// and the bar's highlight fused into one stripe across the tile (the plain square); here the tile's black horizon is
// left out of a clear channel at the bar's height and its warm ground starts just below the bar, so the bar is the
// only dark stroke across the tile.
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
const minus = (A, B) => F.subtract(F.copy(A), B)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const TILE = 'M5 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3Z'
const BAR = 'M7.75 12H16.25'

export default function render() {
  // the tile: the skeleton square inflated by the style's K tube and filled
  const Kf = F.strokes(lines(TILE), 2.55, M0)
  F.region(rings(TILE), M0, Kf)
  const bar = lines(BAR)
  const Af = F.strokes(bar, 3, M0)
  // a parting gap round the bar: a dark seam in the tile, not a hole through it
  const gap = F.offset(F.copy(Af), -0.42)
  const seam = F.intersect(F.copy(gap), Kf)
  const K = F.open(minus(Kf, gap), 0.32)
  const A = F.open(Af, 0.32)
  const sil = F.copy(Kf)
  // a clear channel across the tile at the bar's height: the tile's own dark horizon is left out (it would fuse
  // with the bar into one stripe), its warm ground starts just below the bar; the bar keeps its own gunmetal horizon
  const txt = F.strokes(lines('M2 12H22'), 4.6, M0)
  const L1 = layers({ T: {}, K, Af: null, Ab: null, S: null, sil, txt, seam: null })
  const L2 = layers({ T: { noGlint: true }, K: null, Af: A, Ab: null, S: null, sil, txt: null, seam })
  const own = (L, cls) => L.list.filter(l => l.cls !== 'wm-shadow').map(l => ({ ...l, cls: l.cls === 'wm-shine' ? l.cls : cls }))
  const Ls = { list: [L1.list.find(l => l.cls === 'wm-shadow'), ...own(L1, 'wm-k'), ...own(L2, 'wm-a')].filter(Boolean), glint: L1.glint }
  let out = emit(Ls, 'square-minus', 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, 'square-minus', t)
  return out
}
