// forge/hand/coquette/worried.mjs: the generated drawing without its satin bow; a small floating broken heart.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render(icon) {
  return paint([
    ...k.auto(icon, { bow: false }),
    { ...k.heart(3.6, 4.4, 4, -15), f: k.cut(k.heartShape(3.6, 4.4, 4, -15), k.tube("M3.2 2.6 L4 3.9 L3.1 4.8 L3.9 6.4", 0.45)) },
  ])
}
