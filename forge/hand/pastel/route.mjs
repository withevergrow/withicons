// forge/hand/pastel/route.mjs — the pastel route: the skeleton's S path as a broad lavender band (3, up from the faint
// sky bar) between two bigger mint end stops (r 3.1), each with a deeper 0.8 hue rim so the start and finish
// nodes and the path hold apart at 16px on white and on dark.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.85) }]))

export default function render(icon) {
  const { stroke, circle } = Prim
  const road = stroke('M7.5 18.5 H15.25 A3.25 3.25 0 0 0 15.25 12 H8.75 A3.25 3.25 0 0 1 8.75 5.5 H16.5', 3)
  const E = entriesOf([
    ['lavender@A', road],
    ['mint@K', circle(5.5, 18.5, 3.1), circle(18.5, 5.5, 3.1)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'mint']), glint: true })
}
