// forge/hand/pastel/alert-circle.mjs — the pastel alert: the status-circle build (blush disc r 10, like check-, info- and
// x-circle) with a bolder ink exclamation (bar 2.75, dot r 1.7) and a deeper 0.8 blush rim, so the disc holds its edge
// on white and the mark leads at 16px instead of the whole icon washing out.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.85) }]))

export default function render(icon) {
  const { circle, seg2 } = Prim
  const E = entriesOf([
    ['blush@K', circle(12, 12, 10)],
    ['ink@A', seg2(12, 6.6, 12, 12.6, 2.75), circle(12, 16.85, 1.7)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['blush']), glint: true })
}
