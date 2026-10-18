// forge/hand/pastel/avatar-bear.mjs — the pastel bear: a wide peach head with two round ears set high (blush inner
// ears), a big paper muzzle carrying an ink nose and mouth, and ink eyes (A), with a deeper 0.8 rim; the generated
// bear was a pink blob whose small muzzle and ears read as a dog at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.9) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { circle, ellipse, unite, stroke } = Prim
  const head = unite(ellipse(12, 13.75, 8.25, 7.25), circle(6, 6.75, 3.25), circle(18, 6.75, 3.25))
  const E = entriesOf([
    ['peach@K', head],
    ['blush.flat@K', circle(5.75, 6.5, 1.6), circle(18.25, 6.5, 1.6)],
    ['paper.flat@K', ellipse(12, 16.5, 4, 3.25)],
    ['ink@A', ellipse(8.5, 12.25, 1.2, 1.45), ellipse(15.5, 12.25, 1.2, 1.45)],
    ['ink@A', ellipse(12, 15.1, 1.65, 1.15)],
    ['ink@A', stroke('M10.4 17.6 C11.1 18.4 11.85 18.2 12 16.9 C12.15 18.2 12.9 18.4 13.6 17.6', 1.1)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  const hues = deeper(['peach', 'blush'])
  hues.paper = { ...HUES.paper, rim: mix(HUES.peach.base, HUES.peach.deep, 0.7), ink: HUES.peach.ink }
  return paintEntries(E, { hues, glint: true })
}
