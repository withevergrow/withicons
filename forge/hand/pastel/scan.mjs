// forge/hand/pastel/scan.mjs — the pastel scan: four broad lavender scan corners (2.75) with deeper rims and a blush
// scan beam (A) across the middle, so the frame keeps its contrast on white and reads as scanning, not a pale focus box.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { stroke, seg2 } = Prim
  const W = 2.75
  const E = entriesOf([
    ['lavender@K',
      stroke('M3.5 8.5 V5.75 A2.25 2.25 0 0 1 5.75 3.5 H8.5', W),
      stroke('M15.5 3.5 H18.25 A2.25 2.25 0 0 1 20.5 5.75 V8.5', W),
      stroke('M20.5 15.5 V18.25 A2.25 2.25 0 0 1 18.25 20.5 H15.5', W),
      stroke('M8.5 20.5 H5.75 A2.25 2.25 0 0 1 3.5 18.25 V15.5', W)],
    ['blush@A', seg2(7.25, 12, 16.75, 12, W)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'blush']), glint: true })
}
