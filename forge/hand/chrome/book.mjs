// forge/hand/chrome/book.mjs: a closed chrome book standing upright, the line drawing's book: a gunmetal spine band down
// the left (parted from the cover by a dark seam), a chrome cover with one title plate cut into it, and a pale strip of
// page edge under the cover (parted by a groove, with a fine page line), so it reads as a book and not a card or a UI
// panel. The generated drawing was a plain rounded tablet with pill slots. Same model and paint as the generator
// (_chrome-core.mjs); the pieces are drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)
const rect = (x0, y0, x1, y1) => [[[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(tf)]

export default function render(icon) {
  const name = (icon && icon.name) || 'book'
  // whole book, filled and inflated
  const book = 'M4.5 19 V5 A2.5 2.5 0 0 1 7 2.5 H18 A1.5 1.5 0 0 1 19.5 4 V20 A1.5 1.5 0 0 1 18 21.5 H7 A2.5 2.5 0 0 1 4.5 19 Z'
  const fK = F.strokes(lines(book), 2.55, M0)
  F.region(rings(book), M0, fK)
  // spine: the left strip of the silhouette, in gunmetal
  const spine = F.intersect(F.copy(fK), F.region(rect(-2, -2, 8.0, 26), M0))
  const gapS = grow(spine, 0.45)
  // page edge: the strip under the cover, right of the spine
  const pages = minus(F.intersect(F.copy(fK), F.region(rect(8, 17.2, 26, 26), M0)), gapS)
  const gapP = grow(pages, 0.45)
  // the title plate, cut into the cover
  const plate = F.strokes(lines('M11.3 7.2 H16.4'), 1.2, M0)
  let K = minus(minus(fK, gapS), gapP); K = minus(K, plate); K = F.open(K, 0.32)
  const seam = minus(F.intersect(F.union(F.copy(gapS), gapP), fK), F.union(F.copy(spine), pages))
  const Af = F.open(spine, 0.32)
  const Ls = layers({ T: {}, K, Af, Ab: null, S: null, sil: F.copy(fK), txt: null, seam })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  // the page edge is painted flat: a dark rim, pale paper, and one fine page line
  const lay = (Fd, fill, op) => ({ loops: F.contour(F.copy(Fd)).filter(l => l.length > 2), fill, cls: 'wm-k', op, q: 'body' })
  const sheet = F.offset(F.copy(pages), 0.22)
  const rule = F.strokes(lines('M9.2 19.4 H20'), 0.32, M0)
  const list = [...Ls.list, lay(pages, col('shadow')), lay(sheet, col('edge')), lay(F.intersect(rule, sheet), col('c1'), 0.8)]
  return emit({ list, glint: Ls.glint }, name, 0)
}
