// forge/hand/coquette/camera-off.mjs — a blush camera with a cream lens, struck through by a red satin slash that is
// moated out of the body so the "off" reads at 16px; a small bow sits on the viewfinder hump.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

const SLASH = 'M3.4 3.4 L20.6 20.6'

export default function render() {
  const cam = k.union(k.rr(2.4, 7, 21.6, 19.4, 2.6), k.rr(8, 4.4, 16, 8.4, 1.4))
  const gap = k.tube(SLASH, 3.6)
  return paint([[
    k.body(k.cut(cam, k.disc(12, 13.2, 4.6), gap)),
    k.cream(k.cut(k.disc(12, 13.2, 3.4), gap), { ow: 0.5 }),
    k.rose(k.cut(k.disc(12, 13.2, 1.5), gap), { plate: 'A' }),
    k.satin(k.tube(SLASH, 2), { plate: 'A', ow: 0.5 }),
    k.bow(18.6, 5.2, 0.5, 14),
  ]].flat(Infinity).filter(Boolean))
}
