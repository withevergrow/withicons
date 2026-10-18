// forge/hand/pastel/chart-bar.mjs — the pastel bar chart: three fat bars (sky, blush tall in the middle, sky) standing
// on a lavender baseline, with no axis frame, so it reads as the plain three-bars-on-a-baseline chart at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { rr } = Prim
  const E = entriesOf([
    ['sky@K', rr(3.5, 11.5, 8.25, 19.5, [1.6, 1.6, 0.4, 0.4]), rr(15.75, 7.5, 20.5, 19.5, [1.6, 1.6, 0.4, 0.4])],
    ['blush@K', rr(9.625, 3.5, 14.375, 19.5, [1.6, 1.6, 0.4, 0.4])],
    ['lavender@A', rr(2.25, 18.75, 21.75, 21.75, 1.5)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['sky', 'blush', 'lavender']), glint: true })
}
