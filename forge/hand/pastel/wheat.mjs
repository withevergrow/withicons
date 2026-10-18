// forge/hand/pastel/wheat.mjs — the pastel ear of wheat: three pairs of plump butter kernels angled up and out from a
// peach stalk (A), crowned by one upright kernel, each kernel its own lit field with a deeper butter rim; the generated
// ear was thin hollow butter outlines that washed out on white and closed up at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.95) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { ellipse, rot, seg2 } = Prim
  const kernel = (cy, s = 1) => rot(ellipse(12 - s * 3.25, cy, 3.25, 1.95), s * 37, 12 - s * 3.25, cy)
  const rows = [17, 12.25, 7.5]
  const layers = [['peach.flat@A', seg2(12, 21.75, 12, 10, 2)]]
  for (const y of rows) layers.push(['butter@K', kernel(y)], ['butter@K', kernel(y, -1)])
  layers.push(['butter@K', ellipse(12, 4.25, 1.75, 2.4)])
  const E = entriesOf(layers, icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['butter', 'peach']), glint: true })
}
