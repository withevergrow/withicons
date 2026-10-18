// forge/hand/pastel/hotel.mjs — the pastel hotel in the line design: a lavender tower with a blush sign bar across the
// top and a bed on the ground floor (peach headboard and base, a paper pillow, a butter blanket), with a deeper 0.8 hue
// rim; the old H-sign window-grid block read as any building.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.9) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { rr, circle } = Prim
  const E = entriesOf([
    ['lavender@K', rr(3.5, 2.5, 20.5, 21.5, [2.5, 2.5, 1.5, 1.5])],
    ['blush@A', rr(7.5, 5.25, 16.5, 8.25, 1.5)],
    ['peach@A', rr(5.75, 11.25, 8, 21.5, 1.1), rr(5.75, 17, 18.25, 19.75, 1.1), rr(16, 17, 18.25, 21.5, 1.1)],
    ['butter@A', rr(11.5, 13.75, 18.25, 17.5, [2, 2, 0.9, 0.9])],
    ['paper.flat@A', circle(9.9, 14.75, 1.5)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'blush', 'peach', 'butter', 'paper']), glint: true })
}
