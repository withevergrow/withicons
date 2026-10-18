// forge/hand/gothic/telescope.mjs — the new skeleton's telescope: a tapered sapphire glass tube with a gilt collar,
// a wide gilded objective hood set off by a lead gap, a ruby boss on the pivot and slender gilt tripod legs (A);
// the old bespoke drawing followed the retired skeleton.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render(icon) {
  const TUBE = g.path('M12.8 5.5 L5.49 9.15 A1 1 0 0 0 5.04 10.49 L5.93 12.28 A1 1 0 0 0 7.27 12.72 L14.6 9.05 Z')
  const HOOD = g.path('M13.54 4 L15.77 2.88 A1 1 0 0 1 17.11 3.33 L18.9 6.91 A1 1 0 0 1 18.46 8.25 L16.22 9.37 A1 1 0 0 1 14.88 8.92 L13.09 5.34 A1 1 0 0 1 13.54 4 Z')
  const parts = [
    g.gilt(g.stroke([[[12, 13.4], [6.8, 21.2]], [[12, 13.4], [17.2, 21.2]]], 1.5), { thin: true, plate: 'A', glint: false }),
    g.glass(TUBE, 'c2', { outline: 0.42, glow: 0.24, tracery: 'none' }),
    g.gilt(g.poly([[9.1, 7.4], [10.3, 6.8], [11.5, 9.2], [10.3, 9.8]]), { thin: true, outline: 0.3, glint: false }),
    g.gilt(HOOD),
    ...g.boss(12, 12.2, 1.9, 'c1'),
  ]
  return paint(parts)
}
