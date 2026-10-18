// forge/hand/coquette/backpack.mjs — the new backpack skeleton: a rounded blush pack with a rose grab loop, a rose
// curved top flap fastened by a small red heart clasp, and a cream front pocket; the generated drawing was the old
// pack with side straps and a lace flap that read as a house or shed at 16px.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

const BODY = 'M7.2 21.5 H16.8 A2.2 2.2 0 0 0 19 19.3 V12 A5.5 5.5 0 0 0 13.5 6.5 H10.5 A5.5 5.5 0 0 0 5 12 V19.3 A2.2 2.2 0 0 0 7.2 21.5 Z'

export default function render() {
  return paint([
    k.rose(k.tube('M9.9 7 V4.7 A2.1 2.1 0 0 1 14.1 4.7 V7', 1.8), { plate: 'A' }),
    k.body(k.path(BODY)),
    k.rose(k.inter(k.path(BODY), k.path('M3 3 H21 V11.2 C17 12.8 14.6 13.4 12 13.4 C9.4 13.4 7 12.8 3 11.2 Z')), { plate: 'A', ow: 0.5 }),
    k.cream(k.rr(8.4, 15.4, 15.6, 19.4, [0.6, 0.6, 1.4, 1.4]), { ow: 0.5 }),
    k.heart(12, 13.4, 3.4, 0, { plate: 'A' }),
  ])
}
