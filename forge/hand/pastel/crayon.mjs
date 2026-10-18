// forge/hand/pastel/crayon.mjs — the pastel crayon, drawn upright and turned 45 degrees: a blush wax body with a rounded
// back end and two bold ink wrapper bands, and a separate conical blush tip with a blunt point (moat between them);
// the generated crayon had faint mid-body stripes and a stubby tip that read as a pencil or a bullet.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.9) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { rr, poly, rot } = Prim
  const T = s => rot(s, 45, 12, 12)
  const E = entriesOf([
    ['blush@K', T(rr(8.75, 1.5, 15.25, 14, [2.25, 2.25, 0.75, 0.75]))],
    ['ink@K', T(rr(8.75, 4, 15.25, 6, 0)), T(rr(8.75, 10, 15.25, 12, 0))],
    ['blush@K', T(poly([[8.75, 14.75], [15.25, 14.75], [13.1, 22.25], [10.9, 22.25]], [0.6, 0.6, 0.9, 0.9]))],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['blush']), glint: true })
}
