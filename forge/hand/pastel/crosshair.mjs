// forge/hand/pastel/crosshair.mjs — the pastel crosshair: one lavender field of a broad ring (2.75) and four ticks
// that cross it and stand clear outside it, around a blush aim dot (A) with room to breathe, all with a deeper 0.8
// rim; the generated thin ring and stubby ticks lost contrast on white at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { ring, seg2, circle, unite } = Prim
  const R = 6.5, W = 2.75, a = 4.5, b = 8.5
  const body = unite(
    ring(12, 12, R + W / 2, R - W / 2),
    seg2(12, 12 - b, 12, 12 - a, W), seg2(12, 12 + a, 12, 12 + b, W),
    seg2(12 - b, 12, 12 - a, 12, W), seg2(12 + a, 12, 12 + b, 12, W),
  )
  const E = entriesOf([
    ['lavender@K', body],
    ['blush@A', circle(12, 12, 2)],
  ], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E, { hues: { ...deeper(['lavender']), ...deeper(['blush'], 0.95) }, glint: true })
}
