// forge/hand/pastel/chef-hat.mjs — the pastel toque: a lavender crown of three clear puffs (two side lobes and a taller
// middle one) over straight sides with two ink pleats, seated on a tall peach band (A) with a deeper rim; the generated
// crown was a pale lumpy blob on a short band.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { circle, rr, seg2, unite } = Prim
  const crown = unite(
    circle(8, 7.5, 3.5), circle(12, 5.5, 4), circle(16, 7.5, 3.5),
    rr(7, 7.5, 17, 18.5, 0),
  )
  const E = entriesOf([
    ['lavender@K', crown],
    ['ink@K', seg2(10.25, 10.5, 10.25, 17, 2), seg2(13.75, 10.5, 13.75, 17, 2)],
    ['peach@A', rr(6.5, 18, 17.5, 21.25, 1)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'peach']), glint: true })
}
