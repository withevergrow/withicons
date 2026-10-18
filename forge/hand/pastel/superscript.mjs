// forge/hand/pastel/superscript.mjs — a broad lavender x (3.25, K) and a raised blush 2 (2.6, A, it lifts) set apart by a
// clear gap, both with deeper 0.8 rims like the text family's underline and strikethrough; the generated pale peach 2
// faded into the page at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import * as Kit from '../../styles/_pastel-kit.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { seg2, stroke } = Prim
  const E = entriesOf([
    ['lavender@K', seg2(4, 10.75, 11.5, 20, 3.25), seg2(11.5, 10.75, 4, 20, 3.25)],
    ['blush@A', stroke('M16.25 5.5 A2.25 2.25 0 0 1 20.75 5.5 C20.75 7.25 19.25 8.25 16.25 10.75 H20.75', 2.6)],
  ], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E, { hues: { ...deeper(['lavender']), ...deeper(['blush'], 0.9) }, glint: true })
}
