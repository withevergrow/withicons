// forge/hand/gothic/paste.mjs — the new paste skeleton in Gothic: a ruby glass clipboard in a stone frame with a gilt
// clip (A) on top, and a sapphire glass page in its own stone frame laid over its lower-right corner, two carved
// stone text lines on the page; the generated drawing was two overlapping slabs that read as copy.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const board = g.rr(3, 4.4, 17, 20.2, 2)
  const page = g.rr(10.2, 10.8, 21.2, 21.6, 1.8)
  const clip = g.rr(6.6, 2.3, 13.4, 6.7, 1.2)
  const parts = [
    ...g.pane(board, 'c1', { frame: 1.5, tracery: 'quarry', glass: { medallion: false, s: 2.4 } }),
    g.cut(g.grow(page, 0.75)),
    g.gilt(clip, { plate: 'A' }),
    g.recess(g.rr(8.6, 3.7, 11.4, 5.3, 0.7), { outline: 0.1, plate: 'A' }),
    ...g.pane(page, 'c2', { frame: 1.3, tracery: 'none', glass: { dark: 0.36 } }),
    g.stone(g.union(g.seg(13.4, 14.6, 18, 14.6, 1.4), g.seg(13.4, 17.9, 16, 17.9, 1.4)), { thin: true, outline: 0.3 }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
