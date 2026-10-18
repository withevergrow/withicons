// forge/hand/pastel/lightbulb.mjs — the pastel lightbulb: a full butter globe with a soft waist, an ink filament (A)
// inside it, and a lavender screw base that narrows to a rounded tip, split by one open thread, every field with a deeper
// 0.8 rim; the generated globe's pale rim let the bulb fade on white and the thin base read as a stub at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { path, rr, unite, bar, seg2 } = Prim
  const E = entriesOf([
    ['butter@K', path('M9 15.75 C9 13.9 4.75 12.6 4.75 9.25 A7.25 7.25 0 0 1 19.25 9.25 C19.25 12.6 15 13.9 15 15.75 Z')],
    ['lavender@K', unite(rr(8.5, 15.25, 15.5, 19.25, [0.75, 0.75, 1.5, 1.5]), rr(10, 18, 14, 21.75, 1.75))],
    ['cut', seg2(7, 17.4, 17, 17.4, 1.5)],
    ['ink@A', bar([[9.5, 9.75], [12, 12.25], [14.5, 9.75]], 1.6), seg2(12, 12.25, 12, 14.5, 1.6)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: { ...deeper(['lavender']), ...deeper(['butter'], 1) }, glint: true })
}
