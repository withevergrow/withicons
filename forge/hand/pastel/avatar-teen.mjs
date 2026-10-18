// forge/hand/pastel/avatar-teen.mjs: a teen in a mint hoodie, hood up around the face, with a messy swept fringe.
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
const hair = hue('#8A6450', '#5E4234', '#3A2820')
const cloth = hue('#ABE6CD', '#6EC8A4', '#2F8865')

export default function render(icon) {
  const P = Prim
  const fringe = P.clip(P.circle(12, 11, 6), P.path('M4 3 H20 V9.4 C18 9.8 16.6 8.6 15.8 8.2 C14.8 9.6 13 9.4 12.2 8.6 C11 10 9 10 8 9.2 C7.4 10 6.6 10.6 5.6 10.6 H4 Z'))
  const E = entriesOf([
    ['sky@K', P.unite(body(P), P.circle(12, 11.2, 7.6))],
    ['cut', P.circle(12, 11.4, 6.6)],
    ['peach@K', P.circle(12, 11.4, 5.6)],
    ['butter@A', fringe],
    ['ink@K', P.seg2(10.2, 19.2, 10.2, 21.4, 0.8), P.seg2(13.8, 19.2, 13.8, 21.4, 0.8)],
    ...face(P, 11.6).slice(1),
    ['blush.flat@K', P.ellipse(8.5, 13.8, 0.9, 0.6), P.ellipse(15.5, 13.8, 0.9, 0.6)],
  ], icon)

  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: { peach: skin, butter: hair, sky: cloth, blush, lavender: { ...HUES.lavender, ink: skin.ink } }, roles: { peach: 'c1', butter: 'c2', sky: 'c4', blush: 'accent' }, glint: true })
}
