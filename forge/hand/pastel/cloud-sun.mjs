// forge/hand/pastel/cloud-sun.mjs — the pastel partly-sunny to the new skeleton: a round butter sun (A, c1) up left with
// five straight butter rays fanning from its free side, and a full sky cloud (K) in front of it lower right behind a
// moat; the old bespoke drawing's dotted rays read as petals or paw prints.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.9) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { circle, seg2, stroke, shapeD, join } = Prim
  const P = (a, r) => [10 + r * Math.cos(a * Math.PI / 180), 10 + r * Math.sin(a * Math.PI / 180)]
  const rays = [-90, -45, -135, 180, 135].map(a => seg2(...P(a, 6.1), ...P(a, 8.1), 2))
  const sky = Prim.unite(Prim.pill(8, 14.25, 22, 20.75), circle(11.5, 15.75, 3.5), circle(15.25, 13.75, 4.6), circle(19.25, 16.5, 3))
  const E = entriesOf([
    ['butter@A', circle(10, 10, 4.4)],
    ['butter.flat@A', ...rays],
    ['cut', stroke(shapeD(sky), 2.4)],
    ['sky@K', sky],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['butter', 'sky']), glint: true })
}
