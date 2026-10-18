// forge/hand/pastel/avatar-woman.mjs: a woman with long chestnut hair falling past her shoulders, a side part and a coral top.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const hue = (base, deep, ink) => ({ base, deep, ink, rim: mix(base, deep, 0.9), light: mix(base, '#FFFFFF', 0.62) })
const blush = { ...HUES.blush, rim: mix(HUES.blush.base, HUES.blush.deep, 0.9) }
const face = (P, y = 11) => [
  ['blush.flat@K', P.ellipse(8.4, y + 2.2, 0.95, 0.62), P.ellipse(15.6, y + 2.2, 0.95, 0.62)],
  ['ink@K', P.ellipse(9.7, y + 0.2, 0.85, 1.05), P.ellipse(14.3, y + 0.2, 0.85, 1.05)],
  ['ink@K', P.stroke(`M10.4 ${y + 2.5} A1.9 1.9 0 0 0 13.6 ${y + 2.5}`, 1.2)],
]
const body = P => P.path('M4.75 22.25 C4.75 18.6 7.8 16.9 12 16.9 C16.2 16.9 19.25 18.6 19.25 22.25 Z')

const skin = hue('#F3D1B5', '#BF9579', '#55372E')
const hair = hue('#A5745A', '#6E4C3C', '#45302A')
const cloth = hue('#FFB8A6', '#F08E78', '#B4513D')

export default function render(icon) {
  const P = Prim
  const back = P.unite(P.circle(12, 10.6, 6.75), P.rr(5.25, 10.6, 18.75, 19.5, 2.75))
  const part = P.clip(P.circle(12, 10.9, 6.2), P.path('M4 3 H20 V12.6 C18.6 11.6 17.4 9.6 16.8 7.6 C14.4 8.8 11.4 8.6 10.2 7.8 C9.2 9.6 7.6 11.2 5.6 12.6 H4 Z'))
  const E = entriesOf([
    ['butter@A', back],
    ['sky@K', body(P)],
    ['peach@K', P.circle(12, 11, 5.6)],
    ['butter@A', part],
    ...face(P, 11.4),
  ], icon)

  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: { peach: skin, butter: hair, sky: cloth, blush, lavender: { ...HUES.lavender, ink: skin.ink } }, roles: { peach: 'c1', butter: 'c2', sky: 'c4', blush: 'accent' }, glint: true })
}
