// forge/hand/coquette/egg.mjs — the new tapered egg in blush satin, a small ribbon-red heart painted low on the shell
// as an Easter touch and one gold twinkle; it replaces the old round egg with a floating bow that read as a bean.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([
    k.body(k.path('M12 2.5 C14.75 2.5 18.5 8 18.5 13.5 C18.5 18.5 15.5 21.5 12 21.5 C8.5 21.5 5.5 18.5 5.5 13.5 C5.5 8 9.25 2.5 12 2.5 Z')),
    k.heart(13.6, 15.6, 3.8, 10, { plate: 'K' }),
    k.sparkle(19, 4.4, 1.7),
  ])
}
