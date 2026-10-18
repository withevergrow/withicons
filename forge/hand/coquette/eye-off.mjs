// forge/hand/coquette/eye-off.mjs — the coquette eye (cream almond, rose iris with a heart) cut
// cleanly in two by a red satin slash with a wide moat, so slash and lid never merge; it replaces the generated
// version whose thin slash sat tight against a lashless eye.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

const ALMOND = 'M2.5 12.8 C4.5 8.3 8 5.8 12 5.8 C16 5.8 19.5 8.3 21.5 12.8 C19.5 17.3 16 19.8 12 19.8 C8 19.8 4.5 17.3 2.5 12.8 Z'

export default function render() {
  const slash = k.seg(3.4, 3.4, 20.6, 20.6, 2.3)
  const m = f => k.moat(f, slash, 1.1)
  return paint([[
    k.cream(m(k.path(ALMOND))),
    k.rose(m(k.disc(12, 12.8, 3.7)), { plate: 'A' }),
    k.satin(slash, { plate: 'S' }),
  ]].flat(Infinity).filter(Boolean))
}
