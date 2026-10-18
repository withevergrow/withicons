// forge/hand/pastel/puzzle-piece.mjs — a true jigsaw piece in lavender: a soft square body with round necked knobs on
// top and right and a socket bitten into the left side, ringed with a deeper 0.8 rim; the generated piece was a pale
// lumpy blob that read as a cloud at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import * as Kit from '../../styles/_pastel-kit.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { rr, circle, unite, cut } = Prim
  const piece = cut(unite(
    rr(2.75, 7.5, 16.25, 21, 2.75),
    circle(9.5, 4.85, 2.75), rr(8.25, 4.5, 10.75, 8.5, 0),
    circle(18.9, 14.25, 2.75), rr(15.5, 13, 19.25, 15.5, 0),
  ), circle(2.75, 14.25, 2.3))
  const E = entriesOf([['lavender@K', piece]], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender']), glint: true })
}
