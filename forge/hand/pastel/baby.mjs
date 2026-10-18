// forge/hand/pastel/baby.mjs — the pastel baby to the new skeleton: a round peach head (c1) with ear bumps, a single ink
// hair curl on the crown, ink eyes and smile, and two small blush cheeks, all with a deeper rim; the generated all-blush
// face had low contrast and read flatter than its people siblings.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.9) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { circle, ellipse, unite, stroke } = Prim
  const head = unite(circle(12, 13, 8.25), ellipse(4, 13, 1.9, 2.1), ellipse(20, 13, 1.9, 2.1))
  const E = entriesOf([
    ['peach@K', head],
    ['blush.flat@A', ellipse(7.4, 16, 1.35, 0.95), ellipse(16.6, 16, 1.35, 0.95)],
    ['ink@A', stroke('M12.25 4.9 C14 5.3 14.1 7.7 12 7.7', 1.5)],
    ['ink@A', ellipse(9, 12.9, 1.1, 1.35), ellipse(15, 12.9, 1.1, 1.35)],
    ['ink@A', stroke('M10 16.4 A2.4 2.4 0 0 0 14 16.4', 1.5)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['peach', 'blush']), glint: true })
}
