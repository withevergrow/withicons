// forge/hand/pastel/arrow-up-down.mjs — one lavender two-headed arrow at the check exemplar's 3.5 weight with a deeper
// 0.8 rim: a lit shaft (K) and two open chevron heads (A, they pulse), so the generated thin pale glyph now holds at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import * as Kit from '../../styles/_pastel-kit.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { seg2 } = Prim
  const { chevron } = Kit
  const w = 3.5
  const E = entriesOf([
    ['lavender@K', seg2(12, 5, 12, 19, w)],
    ['lavender@A', chevron(12, 3.75, 270, 6.25, w), chevron(12, 20.25, 90, 6.25, w)],
  ], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender']), glint: true })
}
