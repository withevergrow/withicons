// forge/hand/pastel/bell-plus.mjs — the pastel bell plus: the family bell build (butter dome with a deep butter rim, peach
// knob and lip, peach clapper A) shifted left, and a mint plus badge (S) top right moated off the dome's shoulder, so
// the bell silhouette holds on white and the badge reads as its own part instead of a sprig touching the bell.
import * as Prim from '../../styles/_pastel-prim.mjs'
import * as Kit from '../../styles/_pastel-kit.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, n === 'butter' ? 1 : 0.85) }]))

export default function render(icon) {
  const { path, rr, circle, cut } = Prim
  const E = entriesOf([
    ['butter@K', path('M4.25 17.5 C5.25 16.5 5.25 15.5 5.25 14 V12.25 A5.75 5.75 0 0 1 16.75 12.25 V14 C16.75 15.5 16.75 16.5 17.75 17.5 Z')],
    ['peach@K', circle(11, 5, 1.6), rr(3, 16.5, 19, 19.5, 1.5)],
    ['peach@A', cut(circle(11, 20.4, 2.25), rr(2, 15.5, 20, 20.25, 2))],
    ...Kit.badgeLayers('plus', 'mint', 18.25, 5.75, 3.9),
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['butter', 'peach', 'mint']), glint: true })
}
