// forge/hand/pastel/car.mjs — the pastel car, built like the taxi: a peach body with a raised rounded cabin holding two
// sky window wells split by a pillar, a butter headlight, and two lavender wheels with paper hubs set into moats cut
// from the body, all with a deeper 0.8 rim; the generated car was a low peach blob whose wheels merged at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { rr, poly, circle, unite } = Prim
  const body = unite(
    rr(2.25, 10.25, 21.75, 17, [2.75, 3, 2.25, 2.25]),
    poly([[4.75, 11], [7.75, 4.25], [14.75, 4.25], [18.75, 11]], [0.5, 2, 2, 0.5]),
  )
  const wl = [7.25, 17.25], wr = [16.75, 17.25]
  const E = entriesOf([
    ['peach@K', body],
    ['sky.well', poly([[7.25, 10.5], [9.25, 6], [11.25, 6], [11.25, 10.5]], [0.6, 1, 0.6, 0.6]),
      poly([[12.75, 10.5], [12.75, 6], [14, 6], [16.5, 10.5]], [0.6, 0.6, 1, 0.6])],
    ['butter.flat', rr(18.75, 12.25, 20.75, 14, 0.85)],
    ['cut', circle(...wl, 4), circle(...wr, 4)],
    ['lavender', circle(...wl, 2.85), circle(...wr, 2.85)],
    ['paper.flat', circle(...wl, 1.05), circle(...wr, 1.05)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: { ...deeper(['peach', 'lavender', 'sky']), ...deeper(['butter'], 1) }, glint: true })
}
