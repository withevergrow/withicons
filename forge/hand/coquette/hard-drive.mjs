// forge/hand/coquette/hard-drive.mjs — a flat low drive: rose top lip over a blush front, a lace seam, a long rose
// slot and a round activity LED, so it reads as a drive (not a box or lunchbox) at 16-24px.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([
    k.body(k.rr(2, 11.6, 22, 18.4, [0, 0, 2.2, 2.2])),
    k.rose(k.path('M2 11.8 L4 8.4 Q4.8 7.2 6.4 7.2 H17.6 Q19.2 7.2 20 8.4 L22 11.8 Z'), { plate: 'K' }),
    k.lace('M3.4 12.4 H20.6', 0.6, { eyelets: false }),
    k.fill(k.tube('M5 15.2 H14', 1.4), 'c2', { plate: 'A' }),
    k.fill(k.path('M18.6 15.2 m-1.5 0 a1.5 1.5 0 1 0 3 0 a1.5 1.5 0 1 0 -3 0 Z'), 'accent', { plate: 'A' }),
  ])
}
