// forge/hand/pastel/avatar-man.mjs: a man with short side-parted swept hair, a plain smiling face (no beard) and a sky shirt.
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
const hair = hue('#8C6A52', '#5F4535', '#3B2A20')
const cloth = hue('#B7D6FA', '#7DAEEA', '#3F70B2')

export default function render(icon) {
  const P = Prim
  const crown = P.unite(P.circle(12, 10.9, 6.2), P.ellipse(12.8, 6.3, 4.9, 2.6))
  const fringe = P.clip(crown, P.path('M4 2 H20 V9.3 C19 9.5 18.1 9 17.6 8.2 C15.4 9.2 12.2 9 9.8 7.8 C9.2 9.2 7.8 10 6.2 10 H4 Z'))
  const E = entriesOf([
    ['sky@K', body(P)],
    ['peach@K', P.circle(12, 11, 5.75)],
    ['butter@A', fringe],
    ...face(P, 11.4),
  ], icon)

  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: { peach: skin, butter: hair, sky: cloth, blush, lavender: { ...HUES.lavender, ink: skin.ink } }, roles: { peach: 'c1', butter: 'c2', sky: 'c4', blush: 'accent' }, glint: true })
}
