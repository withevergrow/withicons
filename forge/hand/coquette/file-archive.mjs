// forge/hand/coquette/file-archive.mjs — the zipped page: the family's cream page and blush dog-ear, a gold zipper of
// alternating teeth down the left of centre ending in a ribbon-red pull tab with a cream slot; it replaces a drawing
// whose heart pull read as a jar label, not a zip archive.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([
    k.cream(k.poly([[5, 3], [13.6, 3], [19, 8.4], [19, 21], [5, 21]], 2)),
    k.body(k.poly([[13.4, 3.4], [13.4, 8.6], [18.6, 8.6]], 0.7), { plate: 'A' }),
    k.gold(k.tube('M8.4 5.3 H10 M10 7.5 H11.6 M8.4 9.7 H10 M10 11.9 H11.6', 1.35), { plate: 'A' }),
    k.satin(k.cut(k.rr(7.9, 13.6, 12.1, 18.9, 1.6), k.rr(9.25, 15, 10.75, 17.5, 0.6)), { plate: 'A' }),
  ])
}
