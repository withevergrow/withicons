// forge/hand/coquette/radar.mjs: the generated drawing without its satin bow; two small floating hearts at the corner.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render(icon) {
  return paint([
    ...k.auto(icon, { bow: false }),
    k.heart(19.6, 3.4, 3, 15),
    k.heart(22, 6.6, 2, -12),
  ])
}
