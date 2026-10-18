// forge/hand/coquette/telescope.mjs — the new telescope: a blush eyepiece tube and a wider rose barrel aimed up-right,
// pivoting on a gold mount clear above two gold tripod legs, one gold twinkle in the sky corner; it replaces the old
// bespoke drawing that ignored the redesigned skeleton.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([
    k.gold(k.tube('M12 13.4 L6.6 21 M12 13.4 L17.4 21', 1.7), { plate: 'A' }),
    k.body(k.path('M13.4 5.2 L5.49 9.15 A1 1 0 0 0 5.04 10.49 L5.93 12.28 A1 1 0 0 0 7.27 12.72 L15.2 8.75 Z')),
    k.rose(k.path('M13.54 4 L15.77 2.88 A1 1 0 0 1 17.11 3.33 L18.9 6.91 A1 1 0 0 1 18.46 8.25 L16.22 9.37 A1 1 0 0 1 14.88 8.92 L13.09 5.34 A1 1 0 0 1 13.54 4 Z')),
    k.gold(k.disc(12, 12, 1.7)),
    k.sparkle(5.2, 4.6, 1.9),
  ])
}
