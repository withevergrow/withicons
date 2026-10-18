// forge/hand/pastel/dental-chair.mjs — the pastel dental chair: chunky mint pads (a reclined backrest, the seat and the
// leg rest) topped by a big lavender headrest cushion, a lavender pedestal and foot plate, and a butter dome lamp on a
// short stem; the generated one was a thin mint zigzag with a tiny cap-shaped lamp that read as a lounger at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { rr, seg2, unite, ehalf } = Prim
  // reclined backrest -> seat -> leg rest
  const chair = unite(
    seg2(7.5, 8.75, 9.75, 13.25, 4.5),
    seg2(9.75, 13.5, 15, 13.5, 4.5),
    seg2(15, 13.5, 19.25, 17.75, 4.25),
  )
  // headrest: a wider cushion on the backrest's axis, laid over its top
  const head = seg2(5.25, 4.5, 6.1, 6.25, 5.25)
  const stand = unite(seg2(12, 15.5, 12, 19.75, 2.75), rr(7.5, 19.25, 16.5, 21.75, 1.25))
  const E = entriesOf([
    ['lavender@K', stand],
    ['mint@K', chair],
    ['lavender@K', head],
    ['lavender.flat@A', seg2(16.25, 1.75, 16.25, 4.5, 1.6)],
    ['butter@A', ehalf(16.25, 7.5, 3.75, 3.25, 'n')],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['mint', 'lavender', 'butter']), glint: true })
}
