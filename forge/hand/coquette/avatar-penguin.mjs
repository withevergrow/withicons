// forge/hand/coquette/avatar-penguin.mjs: the dressed penguin wearing its bow as a bow tie under the chin.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'
export default function render(icon) {
  return paint(k.auto(icon, { bow: false, extra: k => k.bow(12, 13.9, 0.42, 0) }))
}
