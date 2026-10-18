// forge/hand/pastel/meh.mjs — the pastel neutral face, built like smile: a butter disc with a deeper 0.8 rim, big ink
// oval eyes and a thick straight ink mouth bar; the generated meh had a thin rim and a hairline mouth, so the flat
// expression vanished on white at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.9) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t), ink: mix(HUES[n].ink, '#000000', 0.12) }]))

export default function render(icon) {
  const { circle, ellipse, seg2 } = Prim
  const E = entriesOf([
    ['butter@K', circle(12, 12, 10)],
    ['ink@A', ellipse(8.75, 9.75, 1.35, 1.65), ellipse(15.25, 9.75, 1.35, 1.65), seg2(8.25, 15.5, 15.75, 15.5, 2)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['butter']), glint: true })
}
