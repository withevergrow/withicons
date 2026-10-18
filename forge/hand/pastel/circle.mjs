// forge/hand/pastel/circle.mjs — the pastel circle as its skeleton means it: an open ring (radio / status ring), not a
// filled disc. A thick lavender band (r 9.5 to 6, wall 3.5) with a deeper 0.8 rim, so the hole stays open and the shape
// reads as an empty circle at 16px instead of a blank ball.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.85) }]))

export default function render(icon) {
  const { ring } = Prim
  const E = entriesOf([
    ['lavender@K', ring(12, 12, 9.5, 6)],
  ], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender']), glint: true })
}
