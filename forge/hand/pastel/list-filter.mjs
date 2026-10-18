// forge/hand/pastel/list-filter.mjs — three lit lavender bars (3.25) stepping clearly long, mid and short around the
// centre, with a deeper 0.8 rim; the generated pale sky pill at the bottom washed out at 16px, so the funnel lost its tip.
import * as Prim from '../../styles/_pastel-prim.mjs'
import * as Kit from '../../styles/_pastel-kit.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { seg2 } = Prim
  const w = 3.25
  const E = entriesOf([
    ['lavender@K', seg2(4.25, 5.5, 19.75, 5.5, w), seg2(7.75, 12, 16.25, 12, w), seg2(10.5, 18.5, 13.5, 18.5, w)],
  ], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender']), glint: true })
}
