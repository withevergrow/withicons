// forge/hand/pastel/avatar-fox.mjs — the pastel fox avatar: a peach mask with two tall pointed ears, wide swept cheeks
// and a pointed chin, cream cheek fur and inner ears, ink eyes and an ink nose at the chin tip, all with a deeper rim;
// the generated drawing was one flat peach shield with two ink bars for ears and no cheek fur, so it barely read as a fox.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, swatch, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (n, t = 0.9) => ({ ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) })

export default function render(icon) {
  const { poly, flipX, path } = Prim
  // the mask: ears up, cheeks swept out, chin to a soft point
  const head = poly([
    [12, 20.75], [20.75, 15], [19, 11.25], [19.25, 3], [13.75, 7], [10.25, 7], [4.75, 3], [5, 11.25], [3.25, 15],
  ], [1.5, 1.25, 2.5, 1.1, 1.75, 1.75, 1.1, 2.5, 1.25])
  const innerL = poly([[6.25, 5.5], [10, 8.1], [6.6, 10.6]], [0.9, 0.9, 0.9])
  // cheek fur: a cream bib that rises from each cheek tip to the nose
  const cheeks = path('M3.9 15.1 C6.5 13.5 9.5 14 12 16.25 C14.5 14 17.5 13.5 20.1 15.1 L12.9 19.75 C12.4 20.1 11.6 20.1 11.1 19.75 Z')
  const E = entriesOf([
    ['peach@K', head],
    ['paper.flat@K', innerL, flipX(innerL)],
    ['paper.flat@K', cheeks],
    ['ink@A', Prim.ellipse(9, 12.25, 1.2, 1.55), Prim.ellipse(15, 12.25, 1.2, 1.55)],
    ['ink@K', path('M10.4 17.7 C10.4 17.3 10.9 17.25 12 17.25 C13.1 17.25 13.6 17.3 13.6 17.7 C13.6 18.51 12.6 19.35 12 19.35 C11.4 19.35 10.4 18.51 10.4 17.7 Z')],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, {
    hues: { peach: deeper('peach'), paper: { ...swatch('#FFFBF4', '#EFAE8C', '#B4613D'), rim: '#F0B394' } },
    glint: true,
  })
}
