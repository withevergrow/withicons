// forge/hand/pastel/dumbbell.mjs — the pastel dumbbell after the skeleton: a lavender bar running through two tall mint
// plates (A-free body, all K) with a short sky end cap outside each plate, so it reads as plate pairs on a bar instead of
// a thin bar with two round weights; deeper 0.8 hue rims keep the plates crisp at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { rr, seg2 } = Prim
  const E = entriesOf([
    ['lavender@K', seg2(3.5, 12, 20.5, 12, 3)],
    ['mint@K', rr(6.25, 4.25, 10, 19.75, 1.9), rr(14, 4.25, 17.75, 19.75, 1.9)],
    ['sky@K', rr(2.25, 8, 5, 16, 1.4), rr(19, 8, 21.75, 16, 1.4)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'mint', 'sky']), glint: true })
}
