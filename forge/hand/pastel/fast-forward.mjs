// forge/hand/pastel/fast-forward.mjs — the pastel fast-forward: two fuller lavender play triangles (15u tall, soft
// r 1.75 corners, a clear gap between the back tip and the front) instead of the pale thin pair, each ringed with a
// deeper 0.8 rim; the back triangle is its own part (A) so it chases the front one as the motion spec intends.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.85) }]))

export default function render(icon) {
  const { poly } = Prim
  const E = entriesOf([
    ['lavender@K', poly([[12.25, 4.5], [22, 12], [12.25, 19.5]], [1.75, 1.6, 1.75])],
    ['lavender@A', poly([[2, 4.5], [11.75, 12], [2, 19.5]], [1.75, 1.6, 1.75])],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender']), glint: true })
}
