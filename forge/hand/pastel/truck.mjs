// forge/hand/pastel/truck.mjs — the pastel delivery truck: a peach cargo box, a taller lavender cab with a broad sky
// windscreen well, and big lavender wheels (A, r 3.1) with paper hubs in their own moats, all with deeper 0.8 hue rims,
// so cab and wheels hold at 16px instead of the faint box with button wheels the composer gave.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.85) }]))

export default function render(icon) {
  const { rr, poly, circle } = Prim
  const E = entriesOf([
    ['peach@K', rr(1.75, 4, 14, 17, 2.5)],
    ['lavender@K', poly([[14, 7.5], [17.75, 7.5], [22.25, 12.25], [22.25, 17], [14, 17]], [0.5, 1.5, 1.5, 2, 0.5])],
    ['sky.well', poly([[15.75, 9.5], [17.25, 9.5], [20.25, 12.75], [15.75, 12.75]], [0.9, 0.9, 0.9, 0.9])],
    ['cut', circle(7, 17.75, 4.3), circle(17.5, 17.75, 4.3)],
    ['lavender@A', circle(7, 17.75, 3.1), circle(17.5, 17.75, 3.1)],
    ['paper.flat@A', circle(7, 17.75, 1.2), circle(17.5, 17.75, 1.2)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink' && e.hue !== 'paper') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['peach', 'lavender', 'sky']), glint: true })
}
