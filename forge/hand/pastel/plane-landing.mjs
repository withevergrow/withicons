// forge/hand/pastel/plane-landing.mjs — the pastel landing plane: the line design's airliner (nose down to the right,
// swept wings and tailplane) as one solid lavender body, a touch fattened so the wings hold at 16px, over a sky runway
// bar; the earlier translucent plane crossed by a big diagonal pill read as a muddle.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.9) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

const PLANE = 'M19.11 11.98 C20.43 12.45 20.93 13.41 20.82 14.3 C20.33 15.06 19.33 15.46 18.02 14.98 L14.26 13.62 L7.99 18.57 L6.67 18.09 L10.31 12.18 L6.74 10.88 L4.49 12.4 L3.92 12.2 L5.79 8.83 L6.52 5.05 L7.09 5.26 L7.84 7.87 L11.41 9.17 L12.42 2.3 L13.74 2.78 L15.35 10.61 Z'

export default function render(icon) {
  const { path, stroke, seg2, join, unite } = Prim
  const plane = unite(path(PLANE), stroke(PLANE, 1.4))
  const E = entriesOf([
    ['lavender@K', plane],
    ['sky.flat@A', seg2(3.75, 21.25, 20.25, 21.25, 2.5)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'sky']), glint: true })
}
