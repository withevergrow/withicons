// forge/hand/coquette/megaphone.mjs — the new megaphone skeleton dressed: one continuous blush horn with a wide rounded
// mouth, a rose mouth rim trimmed with lace, a fine wine band at the throat and a rose grip; the generated drawing
// still showed the old tilted horn.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

const HORN = 'M3 11 A2 2 0 0 1 5 9 H8 L17.6 4.2 Q20 3 20 5.5 V18.5 Q20 21 17.6 19.8 L8 15 H5 A2 2 0 0 1 3 13 Z'

export default function render() {
  const horn = k.path(HORN)
  return paint([
    k.rose(k.path('M5.9 14.5 H9.6 V18.6 A1.85 1.85 0 0 1 5.9 18.6 Z'), { plate: 'K' }),
    k.lace('M20.1 5.4 V18.6', 0.75),
    k.body(horn),
    k.rose(k.inter(horn, k.rect(17.4, 0, 24, 24)), { plate: 'K' }),
    k.ink('M8 9.7 V14.3', 1, { plate: 'A' }),
  ].flat(Infinity).filter(Boolean))
}
