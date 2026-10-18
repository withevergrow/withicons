// forge/hand/coquette/glasses.mjs: the generated drawing without its satin bow; two small floating hearts above the frame.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render(icon) {
  return paint([
    ...k.auto(icon, { bow: false }),
    k.heart(18.6, 5.2, 3, -12),
    k.heart(21.2, 2.9, 2, 16),
  ])
}
