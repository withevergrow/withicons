// forge/hand/pastel/send-horizontal.mjs — the horizontal paper plane as two folded faces, a sky upper wing over a
// lavender lower wing that meet on the centre fold, each with a deeper 0.8 rim; the generated plane was one pale sky
// field with a thin ink dash that faded at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { poly } = Prim
  const T = [2.75, 3], N = [7, 12], P = [21.75, 12], B = [2.75, 21]
  const E = entriesOf([
    ['sky@K', poly([T, P, N], [0.9, 0.9, 0])],
    ['lavender@K', poly([N, P, B], [0, 0.9, 0.9])],
  ], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E, { hues: deeper(['sky', 'lavender']), glint: true })
}
