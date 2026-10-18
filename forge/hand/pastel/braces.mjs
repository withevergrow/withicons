// forge/hand/pastel/braces.mjs — the pastel braces: the skeleton's two curly braces as broad lavender bands (3.1, up
// from 2.75) with a deeper 0.8 hue rim, so the pair holds its edge and its pointed waist on white at 16px instead of
// fading into the page.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.9) }]))

export default function render(icon) {
  const { stroke } = Prim
  const W = 3.1
  const left = stroke('M9.25 3.75 H8.75 A2.5 2.5 0 0 0 6.25 6.25 V9.25 C6.25 10.9 5.25 12 3.75 12 C5.25 12 6.25 13.1 6.25 14.75 V17.75 A2.5 2.5 0 0 0 8.75 20.25 H9.25', W)
  const right = stroke('M14.75 3.75 H15.25 A2.5 2.5 0 0 1 17.75 6.25 V9.25 C17.75 10.9 18.75 12 20.25 12 C18.75 12 17.75 13.1 17.75 14.75 V17.75 A2.5 2.5 0 0 1 15.25 20.25 H14.75', W)
  const E = entriesOf([
    ['lavender@K', left, right],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender']), glint: true })
}
