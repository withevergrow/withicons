// forge/hand/pastel/scan-face.mjs — the pastel face scan: four broad lavender scan corners (2.75) frame a peach face disc
// (A) whose ink eyes and smile sit on the field, so the face keeps its contrast at 16px; the generated face was lavender
// dots on the page, the same hue as the corners, and vanished small.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { stroke, circle, ellipse, arc } = Prim
  const W = 2.75
  const E = entriesOf([
    ['lavender@K',
      stroke('M3.5 8 V5.75 A2.25 2.25 0 0 1 5.75 3.5 H8', W),
      stroke('M16 3.5 H18.25 A2.25 2.25 0 0 1 20.5 5.75 V8', W),
      stroke('M20.5 16 V18.25 A2.25 2.25 0 0 1 18.25 20.5 H16', W),
      stroke('M8 20.5 H5.75 A2.25 2.25 0 0 1 3.5 18.25 V16', W)],
    ['peach@A', circle(12, 12, 5.5)],
    ['ink@A', ellipse(10, 10.6, 0.9, 1.25), ellipse(14, 10.6, 0.9, 1.25), arc(12, 12.4, 2.5, 30, 150, 1.6)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'peach']), glint: true })
}
