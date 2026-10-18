// forge/hand/pastel/utensils.mjs — the pastel fork and knife: a peach fork (K) whose three tines stand 1.9u apart over a
// rounded head and a 2.75 handle, beside a knife (A) with a wide sky blade on a peach handle; the generated tines merged
// into one block at 16px and the blade was a thin sliver.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { seg2, rr, path, unite } = Prim
  const tw = 1.75
  const fork = unite(
    seg2(3.88, 3.25, 3.88, 8, tw), seg2(7.5, 3.25, 7.5, 8, tw), seg2(11.12, 3.25, 11.12, 8, tw),
    rr(3, 7.25, 12, 9.5, [0, 0, 3.5, 3.5]),
    path('M4.5 9 H10.5 C10.5 10.75 9.5 11.75 8.88 12.25 V13 H6.12 V12.25 C5.5 11.75 4.5 10.75 4.5 9 Z'),
    seg2(7.5, 12, 7.5, 21, 2.75),
  )
  const E = entriesOf([
    ['peach@K', fork],
    ['peach@A', seg2(18, 13.5, 18, 21, 2.75)],
    ['sky@A', path('M20.75 14.5 V3.5 C20.75 2.75 20.25 2.5 19.5 2.88 C16.75 4.38 15 7.25 15 11 V13 A1.5 1.5 0 0 0 16.5 14.5 Z')],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['peach', 'sky']), glint: true })
}
