// forge/hand/pastel/wand.mjs — the pastel wand: a full-bodied lavender shaft (w 4, the skeleton's real shaft width, so it
// earns the house top plane) with a paper tip, casting two sparkles (a large butter four-point and a small blush one)
// as in the skeleton, all with a deeper 0.8 rim; the generated 3u stick washed out to a hairline at 16px and its
// five-point star read as a star badge rather than magic.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { seg2, poly, star } = Prim
  // a plump four-point sparkle: inner radius 0.4 and an oversized radius, because the house 0.9 tip rounding trims each point by about a quarter
  const spark = (cx, cy, r) => poly(star(cx, cy, r, r * 0.4, 4), [0.7, 1.2, 0.7, 1.2, 0.7, 1.2, 0.7, 1.2])
  const E = entriesOf([
    ['lavender@K', seg2(3.75, 20.25, 11.5, 12.5, 4)],
    ['paper.flat@K', seg2(10, 14, 11.5, 12.5, 4)],
    ['butter@A', spark(16.75, 7.25, 6)],
    ['blush.flat@A', spark(7.75, 5.5, 3.4)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink' && e.hue !== 'paper') e.rim = 0.8
  return paintEntries(E, { hues: { ...deeper(['lavender', 'blush']), ...deeper(['butter'], 1) }, glint: true })
}
