// forge/hand/coquette/paste.mjs — the new paste skeleton dressed: a blush clipboard with a gold clip and rose slot, and
// a cream page laid over its lower-right corner with rose text lines and one small heart; the generated drawing still
// showed the old two-square copy shape.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([
    k.body(k.rr(3, 4.5, 17, 20, 2.3)),
    k.gold(k.rr(6.8, 2.3, 13.2, 6.7, 1.4), { plate: 'A' }),
    k.fill(k.pill(8.6, 3.85, 11.4, 5.15), 'c2', { plate: 'A' }),
    k.cream(k.rr(5.4, 7.7, 14.6, 17.8, 1)),
    k.cream(k.rr(10.5, 11, 21, 21.5, 2)),
    k.fill(k.tube('M13.3 14.6 H18.2 M13.3 18 H14.9', 1.25), 'c2'),
    k.heart(17.6, 18.1, 3.4, 0),
  ].flat(Infinity).filter(Boolean))
}
