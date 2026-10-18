// forge/hand/coquette/tennis.mjs — the new skeleton's racket, dressed: a blush teardrop frame round cream strings with
// rose cross-stringing, a long rose grip with a small bow at the throat, and a separate blush ball with wine seams;
// it replaces the old bespoke drawing whose short handle and tiny ball read as a magnifier.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

const HEAD = 'M14 14 C13.75 12 14.75 6.75 12 4 A6.36 5.66 45 0 0 3.5 3.5 A6.36 5.66 45 0 0 4 12 C6.75 14.75 12 13.75 14 14 Z'

export default function render() {
  const head = k.path(HEAD)
  const bed = k.inset(head, 1.9)
  return paint([[
    k.rose(k.poly([[13.7, 17.3], [17.3, 13.7], [21.1, 17.5], [17.5, 21.1]], 1.6)),
    k.body(k.seg(12.6, 12.6, 15.6, 15.6, 2.2)),
    k.body(k.cut(head, bed)),
    k.cream(bed, { ow: 0.45 }),
    ['M3.6 0.4 L14.6 11.4', 'M0.4 3.6 L11.4 14.6', 'M14.4 0 L0 14.4']
      .map((d) => k.fill(k.inter(k.tube(d, 0.8), bed), 'c2')),
    k.body(k.disc(19.3, 4.7, 3.1), { plate: 'A' }),
    k.ink('M16.8 3.2 C18.2 4 18.4 5.8 17.4 7.1 M21.8 6.2 C20.4 5.4 20.2 3.6 21.2 2.3', 0.8),
  ]].flat(Infinity).filter(Boolean))
}
