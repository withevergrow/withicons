// forge/hand/pastel/black-cat.mjs: an arched black cat in profile (dusky plum so it reads "black" yet stays pastel) with a
// curled tail, two clearly pointed ears with blush insides, an arched back and big butter eyes with slit pupils.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const hue = (base, deep, ink) => ({ base, deep, ink, rim: mix(base, deep, 0.9), light: mix(base, '#FFFFFF', 0.62) })
const deeper = (names, t = 0.9) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

const plum = hue('#9A8BC6', '#6C5C9E', '#3F3470')

export default function render(icon) {
  const P = Prim
  const body = P.path('M6 21.4 C5.6 18 5.2 15 5.8 12.4 C6.8 8.6 9 6.8 11.6 6.8 C13 6.8 14.2 7.4 14.9 8.2 L15.3 3.6 L18 5.6 L20.7 3.6 L21.4 8.6 C21.4 10.8 20 12.2 18.2 12.6 C17.7 12.8 17.5 13.2 17.5 13.9 L17.7 21.4 H15.1 L14.8 16.6 C13.4 14.8 10.2 14.8 8.5 16.6 L8.3 21.4 Z')
  const head = P.ellipse(18.1, 8.7, 3.7, 3.6)
  const earInL = P.poly([[16, 4.9], [16.2, 6.6], [17.4, 5.9]], 0.3)
  const earInR = P.poly([[20, 4.9], [19.8, 6.6], [18.7, 5.9]], 0.3)
  const E = entriesOf([
    ['lavender@A', P.stroke('M6.2 14 C3 13 2.2 9.4 3.4 6.8 C3.9 5.7 3.6 4.7 2.6 4.1', 2.5)],
    ['lavender@K', P.unite(body, head)],
    ['blush.flat@K', earInL, earInR],
    ['butter@K', P.ellipse(16.4, 8.7, 1.25, 1.55), P.ellipse(19.8, 8.7, 1.25, 1.55)],
    ['ink@K', P.ellipse(16.4, 8.7, 0.38, 1.1), P.ellipse(19.8, 8.7, 0.38, 1.1)],
    ['blush.flat@K', P.poly([[17.2, 10.6], [19, 10.6], [18.1, 11.5]], 0.35)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: { ...deeper(['blush', 'butter']), lavender: plum }, roles: { lavender: 'c2', blush: 'accent', butter: 'c1' }, glint: true })
}
