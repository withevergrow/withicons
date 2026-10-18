// forge/hand/pastel/hand.mjs — the pastel open hand: one peach field of four separate rounded fingers (stepped like
// the skeleton) rising from a soft palm, with the thumb angled out at the lower right and a deeper 0.8 rim; the
// generated mitten fused the fingers and printed two ink dashes that read as a face at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { seg2, rr, unite } = Prim
  const w = 3.25, h = w / 2
  // finger centres and fingertip tops (cap included)
  const F = [[4.13, 9.25], [8.38, 4.75], [12.63, 3], [16.88, 4.5]]
  const body = unite(
    rr(2.5, 12.5, 18.5, 21.5, [1.5, 1.5, 4, 5.5]),
    ...F.map(([x, t]) => seg2(x, t + h, x, 14, w)),
    seg2(15.5, 19, 19.75, 14.5, 3.5),
  )
  const E = entriesOf([['peach@K', body]], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E, { hues: deeper(['peach']), glint: true })
}
