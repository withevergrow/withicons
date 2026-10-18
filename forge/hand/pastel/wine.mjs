// forge/hand/pastel/wine.mjs — the pastel wine glass: a sky glass bowl with a glass shine above a deep blush pour (A) that
// fills most of it, on a lavender stem and foot, all with a deeper rim; the generated pale sky bowl and sky stem washed
// out on white.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { path, clip, rect, seg2, pill, arc } = Prim
  const bowl = path('M6.5 2.5 H17.5 C18.6 6 18.6 8.75 17.1 11.1 C15.85 13.1 14 14.25 12 14.25 C10 14.25 8.15 13.1 6.9 11.1 C5.4 8.75 5.4 6 6.5 2.5 Z')
  const E = entriesOf([
    ['lavender@K', seg2(12, 13.5, 12, 20.25, 2.5), pill(7.5, 19.5, 16.5, 22)],
    ['sky@K', bowl],
    ['blush@A', clip(bowl, rect(4, 6.75, 20, 16))],
    ['shine', arc(12, 7.5, 4.75, 205, 240, 1.1)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink' && e.mode !== 'shine') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'sky', 'blush']), glint: false })
}
