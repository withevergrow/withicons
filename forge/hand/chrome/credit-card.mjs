// forge/hand/chrome/credit-card.mjs: a payment card as one clean chrome slab with a single mirror horizon, a full-bleed
// gunmetal magnetic stripe laid across it (its own dark rim keeps the card edge, and the horizon is not cut into pieces),
// and one engraved dash for the signature/number at the lower left, the same card as line. The generated drawing cut the
// body into three chrome strips, each with its own horizon, which read as noisy banding and lost the card edge.
// Same model and paint as the generator (_chrome-core.mjs); only the pieces are drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const minus = (A, B) => F.subtract(F.copy(A), B)

export default function render(icon) {
  const name = (icon && icon.name) || 'credit-card'
  const card = 'M4 5 H20 A2 2 0 0 1 22 7 V17 A2 2 0 0 1 20 19 H4 A2 2 0 0 1 2 17 V7 A2 2 0 0 1 4 5 Z'
  const fK = F.strokes(lines(card), 2.55, M0)
  F.region(rings(card), M0, fK)
  // the stripe: a band across the whole card, kept inside its silhouette
  const band = [[[-2, 7.1], [26, 7.1], [26, 10.1], [-2, 10.1]].map(tf)]
  const stripe = F.intersect(F.region(band, M0), fK)
  // the engraved dash, cut clear through the slab
  const dash = F.strokes(lines('M6.3 15.2 H10'), 1.15, M0)
  const K = F.open(minus(fK, dash), 0.32)

  const body = layers({ T: {}, K, Af: null, Ab: null, S: null, sil: fK, txt: null, seam: null })
  for (const L of body.list) if (!L.cls) L.cls = 'wm-k'
  // the stripe is painted flat: a dark rim, a gunmetal bar and one pale line along its top edge
  const bar = F.offset(F.copy(stripe), 0.22)
  const hi = minus(bar, F.shift(F.copy(bar), 0, 3, 1))
  const lay = (Fd, fill, op) => ({ loops: F.contour(F.copy(Fd)).filter(l => l.length > 2), fill, cls: 'wm-a', op, q: 'body' })
  const list = [...body.list, lay(stripe, col('shadow')), lay(bar, col('c3')), lay(F.offset(F.copy(hi), 0), col('tint'), 0.55)]
  return emit({ list, glint: body.glint }, name, 0)
}
