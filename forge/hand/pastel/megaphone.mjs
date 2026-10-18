// forge/hand/pastel/megaphone.mjs — the pastel megaphone: one lavender horn flaring right to a wide butter mouth, a
// peach rear box and a peach grip hanging from the horn underside, so horn and handle read as one continuous
// megaphone at 16px; the generated drawing still showed the old detached-parts design.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr, path } = Prim
  return compose([
    ['peach@K', rr(7.5, 12.5, 11, 20.5, 1.75)],
    ['lavender@K', path('M7 9.25 L17 4.5 Q19 3.6 19 5.8 V18.2 Q19 20.4 17 19.5 L7 14.75 Z')],
    ['peach@K', rr(2.5, 8.5, 8.75, 15.5, 2.25)],
    ['butter@K', rr(17.25, 2.75, 21.5, 21.25, 2.1)],
  ], icon)
}
