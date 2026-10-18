// forge/hand/pastel/pen-tool.mjs — the pastel Bezier pen: a clean, flat-shouldered lavender nib with a see-through
// breather hole and an ink slit, a sky holder block (A) behind it, and a small peach anchor node at the very tip, so it
// reads as the vector pen tool (not a fountain pen blob). Drawn upright on the skeleton's own measures, then turned 45.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.85) }]))

export default function render(icon) {
  const { rot, rr, path, circle, seg2 } = Prim
  const T = s => rot(s, 45, 12, 12)
  // upright (the skeleton's nib turned back): holder across the top, nib widening to broad shoulders, straight
  // sides, then curving in to the point at (12, 22.75), which lands on the skeleton's tip (4.4, 19.6) once turned
  const holder = rr(7, 3, 17, 7.25, 1.6)
  const nib = path('M8.75 8 H15.25 L18.6 12.25 C18.6 15.6 15.8 18.6 12 21.5 C8.2 18.6 5.4 15.6 5.4 12.25 Z')
  const hole = circle(12, 14, 2.1)
  // the anchor node the pen is setting: a small square on the tip, drawn axis-aligned after the turn
  const node = rr(1.75, 18.75, 5.25, 22.25, 1)
  const E = entriesOf([
    ['sky@A', T(holder)],
    ['lavender@K', T(nib)],
    ['cut', T(hole)],
    ['peach.flat@A', node],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'sky', 'peach']), glint: true })
}
