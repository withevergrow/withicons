// forge/hand/pastel/baby-bottle.mjs — the pastel baby bottle: a sky body with two short ink measure ticks, a blush
// screw collar, and a butter teat (bulb on a flared base) standing clear above it; the generated bottle was one blush
// mass whose pale teat merged into the collar and body at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.9) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { rr, path, seg2 } = Prim
  const E = entriesOf([
    ['sky@K', rr(7.25, 10, 16.75, 21.5, [1, 1, 3, 3])],
    ['ink@K', seg2(9.25, 14, 11.25, 14, 1.5), seg2(9.25, 17.5, 11.25, 17.5, 1.5)],
    ['butter@K', path('M8.75 8 C10.25 7.5 10.75 6.25 10.6 4.6 A1.65 1.65 0 1 1 13.4 4.6 C13.25 6.25 13.75 7.5 15.25 8 Z')],
    ['blush@K', rr(6.5, 7.25, 17.5, 10.75, 1.25)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['sky', 'butter', 'blush']), glint: true })
}
