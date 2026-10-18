// forge/hand/pastel/graduation-cap.mjs — the pastel mortarboard: a broad lavender board over a sky crown, a soft shade
// where the board overhangs the crown, a butter cord and flared tassel (A) hanging off the right corner and an ink button,
// every field with a deeper 0.8 rim; the generated cap set two pale fields of one value together and lost its contrast.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { path, poly, seg2, circle, move, clip, cut } = Prim
  const crown = path('M6.25 10.5 V15.75 C6.25 18.1 9 19.75 12 19.75 C15 19.75 17.75 18.1 17.75 15.75 V10.5 Z')
  const board = poly([[12, 3.5], [22, 8.75], [12, 14], [2, 8.75]], [1.25, 1.5, 1.25, 1.5])
  const E = entriesOf([
    ['sky@K', crown],
    ['shade.sky@K', cut(clip(move(board, 0, 1.6), crown), board)],
    ['lavender@K', board],
    ['butter.flat@A', seg2(19.75, 9.75, 19.75, 14.5, 1.6)],
    ['butter@A', poly([[18.75, 14], [20.75, 14], [21.75, 19.25], [17.75, 19.25]], [0.6, 0.6, 1, 1])],
    ['ink', circle(12, 8.75, 1.3)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink' && e.mode !== 'shade') e.rim = 0.8
  return paintEntries(E, { hues: { ...deeper(['sky', 'lavender']), ...deeper(['butter'], 1) }, glint: true })
}
