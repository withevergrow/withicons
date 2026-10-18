// forge/hand/pastel/activity.mjs — the pastel pulse: one blush heartbeat trace at glyph weight (w 3.5, like the check and
// arrow glyphs) with a tall spike and deep dip, ringed with a deeper 0.8 blush rim; the generated 3u trace was the
// palest line in the set and dissolved into the page at 16px on white.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { bar } = Prim
  const E = entriesOf([
    ['blush@K', bar([[3.5, 12.5], [6.5, 12.5], [9.25, 4.75], [14.75, 19.25], [17.5, 12.5], [20.5, 12.5]], 3.5)],
  ], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E, { hues: deeper(['blush']), glint: true })
}
