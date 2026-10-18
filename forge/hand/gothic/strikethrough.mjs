// forge/hand/gothic/strikethrough.mjs — the line design's smooth curved S struck through by a bar, set in a sapphire
// plate with gilded rivets at the corners: the S is one gilded stroke, the bar a stone beam that clears a moat across it;
// the old drawing's angular, blocky S gave way to the true two-curve letter.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const S = g.stroke('M16.2 7.4 C15.2 6.1 13.8 5.4 12 5.4 C9.7 5.4 8 6.6 8 8.4 C8 10.1 9.6 11.2 12 12 C14.4 12.8 16 13.9 16 15.7 C16 17.5 14.3 18.7 12 18.7 C10.2 18.7 8.8 18 7.8 16.7', 2.3)
  const bar = g.seg(4.7, 12, 19.3, 12, 1.9)
  const parts = [
    ...g.pane(g.rr(2.5, 2.5, 21.5, 21.5, 2.6), 'c2', { frame: 1.5, tracery: 'none', glass: { dark: 0.38 } }),
    g.studs([[4.9, 4.9], [19.1, 4.9], [4.9, 19.1], [19.1, 19.1]], 0.5),
    g.gilt(S, { plate: 'K' }),
    g.cut(g.grow(bar, 0.7)),
    g.stone(bar, { plate: 'A', thin: true, outline: 0.32 }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
