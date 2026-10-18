// forge/hand/pastel/underline.mjs — the pastel underline: a broad lavender U (3.25) lifted to give the bar room, over a
// full-width blush underline (3) with a deep rim; the generated thin pale peach bar vanished on white at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { stroke, seg2 } = Prim
  const E = entriesOf([
    ['lavender@K', stroke('M6.75 3.75 V9.5 A5.25 5.25 0 0 0 17.25 9.5 V3.75', 3.25)],
    ['blush@A', seg2(4.5, 20.25, 19.5, 20.25, 3)],
  ], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E, { hues: { ...deeper(['lavender']), ...deeper(['blush'], 0.9) }, glint: true })
}
