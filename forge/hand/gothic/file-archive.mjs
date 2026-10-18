// forge/hand/gothic/file-archive.mjs — the files exemplar's sapphire leaf with its gilded dog-ear, and the new
// skeleton's zipper: a gilded column of interlocking teeth down the leaf and a gilded pull pierced by a lit slot;
// the old bespoke drawing (a centred zip ending in a lancet tag) read as a jar or a bottle.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const PAGE = 'M6.5 2.5 H14 L19.5 8 V19.5 A2 2 0 0 1 17.5 21.5 H6.5 A2 2 0 0 1 4.5 19.5 V4.5 A2 2 0 0 1 6.5 2.5 Z'

export default function render(icon) {
  const T = []
  for (let k = 0; k < 5; k++) {
    const y = 3.9 + 1.75 * k, left = k % 2 === 0
    T.push(left ? g.rr(8.1, y, 10.3, y + 1.2, 0.35) : g.rr(9.7, y, 11.9, y + 1.2, 0.35))
  }
  const parts = [
    ...g.pane(g.path(PAGE), 'c2', { frame: 1.5, tracery: 'none', glass: { dark: 0.4 } }),
    g.gilt(g.poly([[14, 2.6], [14, 7.4], [19.4, 7.4]]), { plate: 'A' }),
    g.gilt(g.union(...T), { plate: 'A', thin: true, outline: 0.3, glint: false }),
    g.gilt(g.rr(7.6, 13.4, 12.4, 19, 1.6), { plate: 'A' }),
    g.recess(g.rr(9.2, 15, 10.8, 17.4, 0.7), { plate: 'A', outline: 0, glow: 'c3', glowOp: 0.45 }),
  ]
  return paint(parts)
}
