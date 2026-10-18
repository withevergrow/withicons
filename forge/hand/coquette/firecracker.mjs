// forge/hand/coquette/firecracker.mjs: the firecracker with small floating hearts instead of a bow.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'
export default function render(icon) {
  return paint(k.auto(icon, { bow: false, extra: k => [k.heart(5.6, 5, 3, -15), k.heart(4.4, 10.6, 2.2, 10)] }))
}
