// forge/hand/pastel/git-fork.mjs — the pastel fork in the git-merge build: three peach nodes (r 3.25) with paper wells,
// set wide apart, joined by one broad lavender branch (a rounded T: two tines down into a bar, a stem to the root),
// replacing the generated single-hue butter blob whose nodes and bars melted into one shape at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.85) }]))

export default function render(icon) {
  const { seg2, stroke, circle } = Prim
  const W = 2.75, R = 3.25, r = 1.25
  const E = entriesOf([
    ['lavender@K', stroke('M5.75 7.5 V9 A3 3 0 0 0 8.75 12 H15.25 A3 3 0 0 0 18.25 9 V7.5', W), seg2(12, 12, 12, 16.5, W)],
    ['peach@K', circle(5.75, 5.25, R), circle(18.25, 5.25, R), circle(12, 18.75, R)],
    ['paper.well@K', circle(5.75, 5.25, r), circle(18.25, 5.25, r), circle(12, 18.75, r)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'peach', 'paper']), glint: true })
}
