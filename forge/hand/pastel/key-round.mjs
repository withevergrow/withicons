// forge/hand/pastel/key-round.mjs — the pastel round key: a larger butter bow (r 6.25) with a clear cut hole, a thick
// shaft (3) and two well-spaced teeth, all one field with the deep butter rim like the star, so the key keeps its
// silhouette on white at 16px where the generated small bow and thin shaft faded into the page.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()

export default function render(icon) {
  const { circle, seg2, unite, cut } = Prim
  const key = unite(
    circle(15.25, 8.75, 6.25),
    seg2(11.25, 12.75, 3.75, 20.25, 3),
    seg2(4.5, 19.5, 6.75, 21.75, 2.75),
    seg2(8, 16, 10, 18, 2.75),
  )
  const E = entriesOf([
    ['butter@K', cut(key, circle(16.75, 7.25, 1.75))],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: { butter: { ...HUES.butter, rim: mix(HUES.butter.base, HUES.butter.deep, 1) } }, glint: true })
}
