// forge/hand/pastel/infinity.mjs — the pastel infinity: the skeleton's figure-eight redrawn as one broad lavender band
// (3, up from the thin sky loop that vanished on white) with slightly tall lobes so both openings stay clear at 16px,
// and a deeper 0.8 hue rim like the text and link glyphs, so the loop keeps its edge on white and on dark.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.85) }]))

export default function render(icon) {
  const { stroke, unite, circle } = Prim
  const loop = 'M12 12 C13.5 9.25 14.75 7.5 16.5 7.5 A3.75 4.5 0 0 1 16.5 16.5 C14.75 16.5 13.5 14.75 12 12 ' +
    'C10.5 9.25 9.25 7.5 7.5 7.5 A3.75 4.5 0 0 0 7.5 16.5 C9.25 16.5 10.5 14.75 12 12 Z'
  const E = entriesOf([
    ['lavender@K', unite(stroke(loop, 3), circle(12, 12, 1.75))],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender']), glint: false })
}
