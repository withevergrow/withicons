// forge/hand/pastel/link-2.mjs — the pastel horizontal link: two broad lavender chain halves (3.25 bands, deeper rim)
// facing each other across a clear gap, joined by a sky bar (A) that pulses; the generated one was one pale sky
// stadium that read as a generic pill at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.9) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { stroke, seg2 } = Prim
  const W = 3.25
  const E = entriesOf([
    ['lavender@K', stroke('M9.75 7.25 H8.25 A4.75 4.75 0 0 0 8.25 16.75 H9.75', W), stroke('M14.25 7.25 H15.75 A4.75 4.75 0 0 1 15.75 16.75 H14.25', W)],
    ['sky@A', seg2(8.25, 12, 15.75, 12, 2.75)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'sky']), glint: true })
}
