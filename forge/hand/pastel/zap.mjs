// forge/hand/pastel/zap.mjs — the pastel zap: a full butter bolt with softly rounded corners, ringed with a 0.8 rim taken
// all the way to butter's deep tone like the star, because the generated bolt's pale rim melted into white at 16px.
// The tip vertices sit past the canvas on purpose: the house 0.9 corner and compose's softening pull them back to 2.5 / 21.5.
import * as Prim from '../../styles/_pastel-prim.mjs'
import * as Kit from '../../styles/_pastel-kit.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { poly } = Prim
  const E = entriesOf([
    ['butter@K', poly([[16.25, -1.5], [3.25, 14.75], [11.75, 14.75], [7.75, 25.5], [20.75, 9.25], [12.25, 9.25]], [0.9, 1, 0.5, 0.9, 1, 0.5])],
  ], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E, { hues: { butter: { ...HUES.butter, rim: mix(HUES.butter.base, HUES.butter.deep, 1) } }, glint: true })
}
