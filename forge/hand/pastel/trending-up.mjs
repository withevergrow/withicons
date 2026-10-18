// forge/hand/pastel/trending-up.mjs — the pastel growth line: a mint zigzag at glyph weight (w 3.5) climbing at 45° straight
// into a large square arrowhead (6.5u arms) whose corner is the line's own tip, with a deeper 0.8 mint rim; the generated
// 3u line with its small detached head lost the arrowhead and the direction at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { bar, join } = Prim
  const W = 3.5
  const E = entriesOf([
    ['mint@K', join(
      bar([[3.25, 17], [8.75, 11.5], [12.5, 15.25], [20.25, 7.5]], W),
      bar([[13.75, 7.5], [20.25, 7.5], [20.25, 14]], W),
    )],
  ], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E, { hues: deeper(['mint']), glint: true })
}
