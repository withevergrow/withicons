// forge/hand/pastel/users.mjs — the pastel team: the user build (lavender shoulders, peach head) in front, and behind it
// a second person (A) with sky shoulders that run down to the baseline beside the front one, set off by a moat, so the
// two people no longer melt into one peach mass; deeper 0.8 hue rims keep both silhouettes crisp on white at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import * as Kit from '../../styles/_pastel-kit.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.85) }]))

export default function render(icon) {
  const { circle, rr, join } = Prim
  const f = Kit.person(9, 4.5, 0.84)
  const M = 1.2
  const moat = join(circle(9, 8.07, 3.57 + M), rr(2.07 - M, 12.82 - M, 15.93 + M, 20.25 + M, 5.25 + M))
  const E = entriesOf([
    ['sky@A', rr(10.75, 10, 22, 20.25, [5, 5, 2, 2])],
    ['peach@A', circle(16.5, 5.75, 3.1)],
    ['cut', moat],
    ['lavender@K', f.body],
    ['peach@K', f.head],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'peach', 'sky']), glint: true })
}
