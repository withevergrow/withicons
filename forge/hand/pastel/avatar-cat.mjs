// forge/hand/pastel/avatar-cat.mjs — the pastel cat avatar: a wide lavender head with two upright pointed ears, blush
// inner ears, a cream muzzle with a blush nose, big ink eyes and fine ink whiskers on the cheeks, all with a deeper rim;
// the generated drawing was a pale peach blob whose whiskers became two fat lavender paddles and whose face washed out.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, swatch, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (n, t = 0.9) => ({ ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) })

export default function render(icon) {
  const { ellipse, poly, unite, flipX, stroke, path } = Prim
  const earL = poly([[4.25, 12], [5.25, 3.5], [11.25, 7.75]], [1.25, 1.1, 1.25])
  const head = unite(ellipse(12, 14, 8.25, 6.75), earL, flipX(earL))
  const innerL = poly([[5.75, 10], [6.4, 5.5], [10, 8]], [0.9, 0.9, 0.9])
  const muzzle = unite(ellipse(10.5, 17.25, 2.25, 1.75), ellipse(13.5, 17.25, 2.25, 1.75))
  const whiskers = stroke('M4.6 14.9 L7.5 15.5 M4.9 17.9 L7.6 17.1', 0.9)
  const E = entriesOf([
    ['lavender@K', head],
    ['blush.flat@K', innerL, flipX(innerL)],
    ['paper.flat@K', muzzle],
    ['ink@K', whiskers, flipX(whiskers)],
    ['ink@A', ellipse(8.75, 12.75, 1.3, 1.65), ellipse(15.25, 12.75, 1.3, 1.65)],
    ['blush.flat@K', path('M10.55 15.55 C10.55 15.15 11.05 15.1 12 15.1 C12.95 15.1 13.45 15.15 13.45 15.55 C13.45 16.15 12.6 16.85 12 16.85 C11.4 16.85 10.55 16.15 10.55 15.55 Z')],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, {
    hues: { lavender: deeper('lavender'), blush: deeper('blush'), paper: { ...swatch('#FFFFFF', '#B9A8EC', '#6A55B8'), rim: '#B9A8EC' } },
    glint: true,
  })
}
