// forge/hand/pastel/paisley.mjs — the pastel paisley: a plump peach teardrop whose tip sweeps up and hooks back over
// itself in a clear curl, a light paper inner drop (A) inset well inside the rim and a blush seed (S), every field with
// a deeper 0.8 rim; the generated drop had a straight point that read as a leaf or a flame, and its lavender inner
// swirl merged with the outline at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { path, circle, arc, unite } = Prim
  // the drop's tail rises along the right and rolls over into a round solid hook (an arc band ending in a soft cap)
  const drop = path('M10 21.75 C5.75 21.75 3 18.75 3 14.75 C3 10.75 6 8.6 9.5 8 C12.6 7.45 15.4 7.1 17.1 5.6 L19.9 5.1 C20.6 7.9 19.9 10.6 19.5 13 C18.75 18.25 15.25 21.75 10 21.75 Z')
  const body = unite(drop, arc(16.4, 5.6, 2.6, 178, 380, 3), circle(16.4, 5.6, 1.5))
  const inner = path('M10 18.75 C7.6 18.75 6 17 6 14.75 C6 12.4 7.75 11.15 10.1 10.7 C12.4 10.25 14.4 9.85 16.15 8.9 C16.5 10.25 16.35 11.4 16.2 12.6 C15.8 16.25 13.6 18.75 10 18.75 Z')
  const E = entriesOf([
    ['peach@K', body],
    ['blush@A', circle(10.5, 15, 2.6)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink' && e.hue !== 'paper') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['peach', 'blush']), glint: true })
}
