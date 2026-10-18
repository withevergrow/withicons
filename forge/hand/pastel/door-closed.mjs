// forge/hand/pastel/door-closed.mjs — the pastel closed door: a peach frame standing on its floor sill, a lavender
// door panel shut inside it and a butter knob (A), every field with a deeper rim, built like the pastel door-open;
// the generated pale peach slab nearly vanished on white.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.9) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { rr, unite, circle } = Prim
  const E = entriesOf([
    ['peach@K', unite(rr(4.5, 2.5, 19.5, 20.5, [3, 3, 0, 0]), rr(2.5, 19, 21.5, 21.5, 1.25))],
    ['lavender@K', rr(7, 5, 17, 19, [1.75, 1.75, 0.5, 0.5])],
    ['butter.flat@A', circle(14.5, 12.25, 1.4)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: { ...deeper(['peach', 'lavender']), ...deeper(['butter'], 1) }, glint: true })
}
