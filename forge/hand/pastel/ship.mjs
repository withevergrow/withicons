// forge/hand/pastel/ship.mjs — the pastel steamship: a deep lavender hull with a sweeping bow, a peach cabin with sky
// porthole wells, a butter funnel (A) and sky waves (A), every field with a deeper 0.8 rim; the generated pale sky
// hull and thin wave line washed out on white at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { rr, poly, circle, stroke } = Prim
  const E = entriesOf([
    ['lavender@K', poly([[1.75, 11.5], [22.25, 11.5], [19.25, 17.5], [4.75, 17.5]], [1, 1, 2.25, 2.25])],
    ['butter@A', rr(10, 2.25, 14, 8, [1.4, 1.4, 0, 0])],
    ['peach@K', rr(6, 6.75, 18, 12, [2, 2, 0, 0])],
    ['sky.well', circle(9, 9.4, 1.15), circle(12, 9.4, 1.15), circle(15, 9.4, 1.15)],
    ['sky.flat@A', stroke('M2.25 20.75 Q4.1 19 6 20.75 T9.75 20.75 T13.5 20.75 T17.25 20.75 T21 20.75', 2.25)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'peach', 'sky', 'butter']), glint: true })
}
