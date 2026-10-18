// forge/hand/coquette/plum-blossom.mjs: the generated drawing without its satin bow; floating hearts beside the blossom.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render(icon) {
  return paint([
    ...k.auto(icon, { bow: false }),
    k.heart(20.4, 3.6, 2.8, 15),
    k.heart(21.8, 7.4, 1.9, -12),
  ])
}
