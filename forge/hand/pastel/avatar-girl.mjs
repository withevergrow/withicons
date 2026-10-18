// forge/hand/pastel/avatar-girl.mjs: a round peach face with soft bangs, two puffy auburn pigtails and a blush bow on a pink top.
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
const hair = hue('#D27F54', '#84523E', '#55372E')
const cloth = hue('#F8B6CE', '#F493B5', '#B54A76')

export default function render(icon) {
  const P = Prim
  const bangs = P.clip(P.circle(12, 10.6, 6.3), P.path('M4 3 H20 V10.4 C18.4 9.4 17.4 7.6 16.6 7 C15.2 8.6 12.6 9.3 10 9.1 C8.6 9 7.4 9.6 6 10.6 H4 Z'))
  const E = entriesOf([
    ['butter@A', P.circle(5.6, 12.4, 2.6), P.circle(18.4, 12.4, 2.6)],
    ['sky@K', body(P)],
    ['peach@K', P.circle(12, 11, 5.75)],
    ['butter@A', bangs],
    ['blush.flat@A', P.join(P.tri([15.4, 5.2], [18.6, 3.4], [18.6, 7], 0.6), P.tri([15.4, 5.2], [12.6, 3.6], [12.8, 6.9], 0.6))],
    ['blush@A', P.circle(15.6, 5.2, 1.05)],
    ...face(P),
  ], icon)

  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: { peach: skin, butter: hair, sky: cloth, blush, lavender: { ...HUES.lavender, ink: skin.ink } }, roles: { peach: 'c1', butter: 'c2', sky: 'c4', blush: 'accent' }, glint: true })
}
