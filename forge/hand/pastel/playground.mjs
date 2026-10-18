// forge/hand/pastel/playground.mjs — the pastel playground slide: a lavender ladder (two rails, two rungs, a hoop
// handrail) under a peach platform, from which a wide sky slide sweeps down and out to a flat run-out, each part its own
// lit field; the generated drawing was one thin butter outline that read as a letter A at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.9) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { seg2, arc, rr, stroke } = Prim
  const ladder = [
    seg2(3.5, 21.25, 3.5, 6.75, 2), seg2(9.5, 21.25, 9.5, 6.75, 2),
    arc(6.5, 6.75, 3, 180, 360, 2),
    seg2(3.5, 15, 9.5, 15, 1.75), seg2(3.5, 18.75, 9.5, 18.75, 1.75),
  ]
  const E = entriesOf([
    ['sky@K', stroke('M10.5 10.75 C13.75 10.75 14.75 13.5 15.75 16.1 C16.75 18.6 17.9 19.75 20.75 19.75', 3.75)],
    ['lavender@K', ladder],
    ['peach@K', rr(2, 9, 13, 11.75, 1.25)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['sky', 'lavender', 'peach']), glint: true })
}
