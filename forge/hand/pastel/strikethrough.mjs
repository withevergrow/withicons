// forge/hand/pastel/strikethrough.mjs — the pastel strikethrough: a broad lavender S (3.25) split by a moat at its
// waist, with a wide blush strike bar (3) running well past both sides of the letter, both with a deeper 0.8 rim;
// the generated pale bar sat flush on the S and read as a dollar sign, faint on white at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { stroke, seg2 } = Prim
  const S = 'M17 6.5 C16 4.75 14.25 3.75 12 3.75 C9 3.75 6.75 5.25 6.75 7.75 C6.75 10 8.75 10.75 12 11.75 ' +
    'C15.25 12.75 17.25 13.75 17.25 16.25 C17.25 18.75 15 20.25 12 20.25 C9.75 20.25 7.75 19.25 6.75 17.5'
  const E = entriesOf([
    ['lavender@K', stroke(S, 3.25)],
    ['cut', seg2(2.75, 12, 21.25, 12, 2.75 + 2 * 0.9)],
    ['blush@A', seg2(2.75, 12, 21.25, 12, 2.75)],
  ], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E, { hues: { ...deeper(['lavender']), ...deeper(['blush'], 0.9) }, glint: true })
}
