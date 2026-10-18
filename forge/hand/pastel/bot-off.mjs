// forge/hand/pastel/bot-off.mjs — the switched-off robot: the full bot build (a broad lavender head, side ears, peach
// antenna A, a sky visor well with ink eyes) kept whole and solid, crossed by one blush slash (S) with no moat.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'
import { slashLayers } from '../../styles/_pastel-kit.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { rr, seg2, circle } = Prim
  const E = entriesOf([
    ['lavender@K', rr(4, 7.75, 20, 20.5, 4)],
    ['peach@A', seg2(12, 3.75, 12, 6.75, 2), circle(12, 3.25, 1.85)],
    ['sky.well', rr(6, 10.25, 18, 17.25, 2.5)],
    ['ink', circle(8.5, 14.75, 1.3), circle(15.5, 12, 1.3)],
    slashLayers('blush', [3.25, 3.25], [20.75, 20.75], 1.6)[1],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'peach', 'sky', 'blush']), glint: true })
}
