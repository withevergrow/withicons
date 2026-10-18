// forge/hand/pastel/droplets.mjs — the pastel droplets: a full sky water drop with a deep rim and a smaller lavender drop
// (A) up and to its right, on the skeleton's centres and tips; the generated pale mint lower drop had too little
// contrast on white.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.9) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { drop } = Prim
  const E = entriesOf([
    ['sky@K', drop(9.25, 15.6, 5.75, 9.25, 5.5, 0.9)],
    ['lavender@A', drop(17.5, 8.6, 3.6, 17.5, 2.5, 0.7)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['sky', 'lavender'], 1), glint: true })
}
