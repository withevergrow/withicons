// forge/hand/pastel/user-plus.mjs — the pastel user plus: the user family (lavender shoulders, peach head) set left, and
// a mint plus badge (S) at the upper right moated off the head, as in the line design; deeper 0.85 hue rims make the
// head and body hold on white at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import * as Kit from '../../styles/_pastel-kit.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const u = Kit.person(8.5, 4, 0.86)
  const E = entriesOf([
    ['lavender@K', u.body],
    ['peach@K', u.head],
    ...Kit.badgeLayers('plus', 'mint', 17.5, 6.75, 4.5),
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'peach', 'mint']), glint: true })
}
