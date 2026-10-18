// forge/hand/pastel/award.mjs — the pastel award: a full butter medal with a recessed butter face, hung on two broad
// blush ribbon tails (A, they sway) that splay out below it with notched ends, every field with a deeper 0.8 rim; the
// generated medal had a squashed sliver of ribbon and pale rims, so the rosette faded into white at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { circle, poly, flipX } = Prim
  const tail = poly([[6.75, 12], [12, 12], [10.9, 21.75], [8.2, 19.9], [5.4, 21.5]], [0.6, 0.6, 0.8, 0.5, 0.8])
  const E = entriesOf([
    ['blush@A', tail, flipX(tail, 12)],
    ['butter@K', circle(12, 9, 6.5)],
    ['butter.well@K', circle(12, 9, 4)],
  ], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E, { hues: { ...deeper(['blush']), ...deeper(['butter'], 1) }, glint: true })
}
