// forge/hand/pastel/wrap-text.mjs — the pastel wrap text: two lavender bars (full top line, short last line) and a
// separate sky return arrow (A) that runs right, turns down and comes back left to a clear arrowhead, each part set
// apart with a gap so the bar, the dash and the arrow read as three pieces at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import * as Kit from '../../styles/_pastel-kit.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.9) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { seg2, stroke, bar, join } = Prim
  const w = 2.75
  const E = entriesOf([
    ['lavender@K', seg2(3.5, 5, 20.5, 5, w), seg2(3.5, 19, 7.25, 19, w)],
    ['peach@A', join(stroke('M3.5 12 H17 A3.5 3.5 0 0 1 17 19 H12.5', w), bar([[15.25, 16.25], [12.5, 19], [15.25, 21.75]], w))],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'peach']), glint: true })
}
