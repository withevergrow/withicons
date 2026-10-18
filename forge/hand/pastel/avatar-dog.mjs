// forge/hand/pastel/avatar-dog.mjs — the pastel dog avatar: a tall butter head with two long peach ears hanging down its
// sides, a peach patch over one eye, a cream muzzle with a big ink nose and ink eyes, all with a deeper rim; the generated
// drawing was one peach mass whose ears were only white seams, so at 16px it read as the same round head as the bear.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, swatch, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (n, t = 0.9) => ({ ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) })

export default function render(icon) {
  const { ellipse, path, flipX, unite, rr } = Prim
  const head = unite(rr(6, 5, 18, 16, 5.5), ellipse(12, 15.75, 6, 4.75))
  // a long floppy ear: hinged at the crown, hanging down past the cheek
  const earL = path('M9 5.5 C6.75 3.75 3.5 4.5 2.75 7.5 C2.1 10.25 2.4 14 3.5 15.9 C4.4 17.4 6.1 17.2 6.5 15.4 C6.8 13.75 6.6 11.5 7.1 9.5 C7.5 8 8.75 7 9 5.5 Z')
  const muzzle = ellipse(12, 16.75, 3.75, 2.75)
  const E = entriesOf([
    ['butter@K', head],
    ['peach.flat@K', ellipse(14.3, 11.7, 1.9, 2.25)],
    ['peach@K', earL, flipX(earL)],
    ['paper.flat@K', muzzle],
    ['ink@K', path('M10.25 15.25 C10.25 14.6 10.75 14.25 12 14.25 C13.25 14.25 13.75 14.6 13.75 15.25 C13.75 16.1 12.9 16.9 12 16.9 C11.1 16.9 10.25 16.1 10.25 15.25 Z')],
    ['ink@A', ellipse(9.5, 11.75, 1.2, 1.5), ellipse(14.5, 11.75, 1.2, 1.5)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, {
    hues: { butter: deeper('butter'), peach: deeper('peach'), paper: { ...swatch('#FFFDF6', '#E9C77A', '#A07222'), rim: '#EDC983' } },
    glint: true,
  })
}
