// forge/hand/pastel/toilet.mjs — the pastel toilet in side view: a sky cistern with an ink flush button, a lavender
// seat band, and a sky bowl that tapers into its pedestal, with a deeper 0.8 hue rim; the generated one had a white
// paper seat and pale sky parts that dissolved into the page on white.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.9) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { rr, path, pill } = Prim
  const bowl = path('M4.5 12 H20.5 C20.5 15.25 18.5 17 15.5 17.25 L16 20 Q16.25 21.5 14.75 21.5 H9.25 Q7.75 21.5 8 20 L8.5 17.1 C6 16.5 4.5 14.75 4.5 12 Z')
  const E = entriesOf([
    ['sky@K', rr(3.5, 2.5, 10.5, 11.5, [2.5, 2.5, 1, 1]), bowl],
    ['lavender.flat@A', pill(3, 9.75, 21, 12.75)],
    ['ink@K', pill(5.5, 5, 8.5, 6.6)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['sky', 'lavender']), glint: true })
}
