// forge/hand/coquette/git-fork.mjs: the generated drawing without its satin bow; two small floating hearts instead.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render(icon) {
  return paint([
    ...k.auto(icon, { bow: false }),
    k.heart(19.2, 3.6, 3, -15),
    k.heart(21.4, 7.2, 2, 18),
  ])
}
