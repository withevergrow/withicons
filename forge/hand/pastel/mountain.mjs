// forge/hand/pastel/mountain.mjs — the pastel mountain: the skeleton's two-peak ridge drawn as two layered soft
// peaks spanning the full 2..22 base, a lavender far peak behind a big mint front peak with a paper snow cap, with a
// deeper 0.8 hue rim so both peaks hold their edge on white at 16px (the generated one was small and washed out).
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.85) }]))

export default function render(icon) {
  const { poly, clip } = Prim
  const front = poly([[2, 20.25], [8.75, 3.75], [15.25, 20.25]], [1.25, 1.1, 1.25])
  const back = poly([[9, 20.25], [16, 8], [22, 20.25]], [1.25, 1.1, 1.25])
  // snow line: a soft zigzag across the front peak
  const snow = clip(front, poly([[0, 0], [24, 0], [24, 10], [11.4, 10], [10.1, 11.5], [8.75, 10.15], [7.4, 11.5], [6.1, 10], [0, 10]], 0.4))
  const E = entriesOf([
    ['lavender@K', back],
    ['cut', poly([[0.9, 20.9], [8.75, 2], [16.35, 20.9]], 1.5)],
    ['mint@K', front],
    ['paper.flat@A', snow],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'mint', 'paper']), glint: true })
}
