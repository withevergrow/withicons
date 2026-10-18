// forge/hand/pastel/cat.mjs — the pastel cat: one wide peach head with two tall rounded ears, blush inner ears, big
// ink oval eyes, a small blush nose and an ink "w" mouth, all with a deeper 0.8 hue rim; the generated cat was a pale
// lumpy blob whose small eyes and ears washed out on white at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.9) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { ellipse, poly, unite, flipX, stroke } = Prim
  const earL = poly([[3.25, 11.5], [4.25, 2.25], [11.5, 7.25]], [1.5, 1, 1.5])
  const head = unite(ellipse(12, 13.75, 8.75, 7), earL, flipX(earL))
  const innerL = poly([[5.5, 9.25], [6, 5], [9.25, 7.6]], [0.75, 0.6, 0.75])
  const E = entriesOf([
    ['peach@K', head],
    ['blush.flat@K', innerL, flipX(innerL)],
    ['ink@A', ellipse(8.5, 13, 1.25, 1.6), ellipse(15.5, 13, 1.25, 1.6)],
    ['blush.flat@A', poly([[10.75, 15.6], [13.25, 15.6], [12, 17]], 0.55)],
    ['ink@A', stroke('M9.75 17.6 C10.4 18.5 11.6 18.4 12 17.4 C12.4 18.4 13.6 18.5 14.25 17.6', 1.1)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['peach', 'blush']), glint: true })
}
