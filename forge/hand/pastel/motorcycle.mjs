// forge/hand/pastel/motorcycle.mjs — the pastel motorbike as separate parts: two solid lavender wheels with paper
// hubs, a peach teardrop tank over a butter engine, a lavender saddle behind the tank, and a peach swingarm, raked
// fork and swept handlebar, with deeper 0.8 rims; the generated low peach blob between the wheels read as a scooter.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { path, circle, seg2, bar, pill } = Prim
  const wl = [5.5, 17], wr = [18.5, 17]
  const E = entriesOf([
    ['lavender@K', circle(...wl, 3.75), circle(...wr, 3.75)],
    ['peach.flat@K', seg2(...wl, 10, 15, 2.25)],
    ['peach.flat@A', bar([[...wr], [16.25, 8], [14, 6.75]], 2.25)],
    ['butter.flat@A', circle(16.75, 9.25, 1.25)],
    ['lavender.flat@K', pill(3.5, 9.5, 9.5, 11.75)],
    ['peach@K', path('M8.75 12.75 C8.75 9.75 10.5 8 12.75 8 C14.5 8 15.5 9.5 15.5 11 C15.5 12.25 14.75 13.25 13.5 13.25 H9.25 C8.95 13.25 8.75 13.05 8.75 12.75 Z')],
    ['paper.flat@K', circle(...wl, 1.3), circle(...wr, 1.3)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink' && e.hue !== 'paper') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'peach', 'butter']), glint: true })
}
