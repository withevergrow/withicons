// forge/hand/pastel/webhook.mjs — the pastel webhook: the line design's looping three-arm knot (each arm leaves one node,
// runs to the next and hooks three quarters round it) as soft lavender strokes, with a blush, a mint and a sky node in
// the three loops; the generated one was a plain triangle of three dots with no hooks.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.9) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { stroke, circle, join } = Prim
  const w = 2.1
  const arms = join(
    stroke('M12 7.5 L13.95 10.88 A3.75 3.75 0 0 0 17.2 12.75 A3.75 3.75 0 0 1 20.95 16.5 A3.75 3.75 0 0 1 17.2 20.25', w),
    stroke('M17.2 16.5 L13.3 16.5 A3.75 3.75 0 0 0 10.05 18.38 A3.75 3.75 0 0 1 4.93 19.75 A3.75 3.75 0 0 1 3.56 14.63', w),
    stroke('M6.8 16.5 L8.75 13.13 A3.75 3.75 0 0 0 8.75 9.38 A3.75 3.75 0 0 1 10.13 4.25 A3.75 3.75 0 0 1 15.25 5.63', w),
  )
  const E = entriesOf([
    ['lavender@K', arms],
    ['blush@A', circle(12, 7.5, 2.1)],
    ['mint@A', circle(17.2, 16.5, 2.1)],
    ['sky@A', circle(6.8, 16.5, 2.1)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'blush', 'mint', 'sky']), glint: true })
}
