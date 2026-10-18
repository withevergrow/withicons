// forge/hand/pastel/anchor.mjs — the pastel anchor: a sky shank and lower arc as broad soft bands (3) ending in two
// solid rounded flukes, a sky ring (A) on top and a butter stock across the shank, every field with a deeper 0.8 rim;
// the generated thin pale bands and hollow barbs lost their edge on white at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { seg2, arc, poly, ring, unite } = Prim
  const W = 3
  const body = unite(
    seg2(12, 7.5, 12, 20.5, W),
    arc(12, 13.75, 7, 8, 172, W),
    poly([[5, 10.75], [2.25, 16.25], [7.25, 15.25]], [0.9, 1, 1]),
    poly([[19, 10.75], [16.75, 15.25], [21.75, 16.25]], [0.9, 1, 1]),
  )
  const E = entriesOf([
    ['sky@K', body],
    ['sky@A', ring(12, 4.75, 3, 1.35)],
    ['butter@K', seg2(7.75, 10.75, 16.25, 10.75, 2.75)],
  ], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E, { hues: { ...deeper(['sky']), ...deeper(['butter'], 1) }, glint: true })
}
