// forge/hand/pastel/percent.mjs — the pastel percent: the skeleton's slash and two discs, with the slash broadened to a
// 3.25 lavender bar (K) and the two peach discs (A) grown to r 3.5, all with deeper 0.8 hue rims, so the sign keeps
// its contrast on white instead of washing out as a thin butter line at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.85) }]))

export default function render(icon) {
  const { circle, seg2 } = Prim
  const E = entriesOf([
    ['lavender@K', seg2(18.75, 5.25, 5.25, 18.75, 3.25)],
    ['peach@A', circle(7, 7, 3.5), circle(17, 17, 3.5)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'peach']), glint: true })
}
