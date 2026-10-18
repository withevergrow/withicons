// forge/hand/coquette/champagne-toast.mjs: the clinking flutes with small floating hearts instead of a bow.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'
export default function render(icon) {
  return paint(k.auto(icon, { bow: false, extra: k => [k.heart(19.6, 9.4, 2.8, 15), k.heart(4.4, 9.4, 2.8, -15)] }))
}
