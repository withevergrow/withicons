// forge/hand/pastel/shopping-bag.mjs — the pastel bag: a peach tapered bag with a broad lavender handle (A) whose legs
// drop into the bag mouth and end in ink eyelets, as in the skeleton, plus deeper 0.8 hue rims, so the bag no longer
// reads as a faint peach block with a loop sitting on top of it.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.85) }]))

export default function render(icon) {
  const { poly, stroke, circle } = Prim
  const E = entriesOf([
    ['peach@K', poly([[5.5, 7.25], [18.5, 7.25], [20, 21.75], [4, 21.75]], [2, 2, 2.5, 2.5])],
    ['lavender@A', stroke('M8.75 11 V7 A3.25 3.25 0 0 1 15.25 7 V11', 2.75)],
    ['ink@A', circle(8.75, 11, 0.85), circle(15.25, 11, 0.85)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['peach', 'lavender']), glint: true })
}
