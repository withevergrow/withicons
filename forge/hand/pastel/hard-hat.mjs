// forge/hand/pastel/hard-hat.mjs — the pastel hard hat: a butter dome with a raised peach crown ridge (A) running up its
// middle, split from a wide peach brim by a clear moat, every field with a deeper rim; the generated blush dome with
// a hollow ridge loop read as a bell or a cloud.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.9) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { path, rr, unite } = Prim
  const E = entriesOf([
    ['butter@K', path('M4 15.75 C4 9.75 7.25 6.25 12 6.25 C16.75 6.25 20 9.75 20 15.75 Z')],
    ['peach@A', rr(10.25, 4.5, 13.75, 15.75, [1.75, 1.75, 0.5, 0.5])],
    ['cut', rr(1, 15, 23, 16, 0)],
    ['peach@K', rr(2, 16, 22, 19.75, 1.9)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: { ...deeper(['peach']), ...deeper(['butter'], 1) }, glint: true })
}
