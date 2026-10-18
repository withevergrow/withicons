// forge/hand/pastel/sigma.mjs — the pastel sigma: the skeleton's sum sign as one broad lavender bar (3.25, round joins,
// the short end serifs kept) with a deeper 0.8 rim, matching the text family (bold, underline, superscript); the
// generated pale blush glyph washed out on white at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.85) }]))

export default function render(icon) {
  const { bar } = Prim
  const E = entriesOf([
    ['lavender@K', bar([[17.75, 7], [17.75, 4.25], [6.25, 4.25], [12.75, 12], [6.25, 19.75], [17.75, 19.75], [17.75, 17]], 3.25)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender']), glint: true })
}
