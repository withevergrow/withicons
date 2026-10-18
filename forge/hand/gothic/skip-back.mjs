// forge/hand/gothic/skip-back.mjs — the plain media glyph of the line set: a left-pointing ruby glass triangle in a dark
// metal frame, a gilded stop column at its left with square capitals (the chevron-first column); the generated drawing
// was a shield with a trefoil and a scroll-like bar, ornament that blurred the shape at 16px.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const TRI = 'M19.6 7.7 A1.8 1.8 0 0 0 16.8 6.2 L9.9 10.6 A1.8 1.8 0 0 0 9.9 13.4 L16.8 17.8 A1.8 1.8 0 0 0 19.6 16.3 Z'

export default function render(icon) {
  const cx = 5, w = 2.8, cw = w / 2 + 0.75, top = 4.6, bottom = 19.4
  const parts = [
    g.gilt(g.union(
      g.rr(cx - w / 2, top + 0.6, cx + w / 2, bottom - 0.6, 0.3),
      g.rr(cx - cw, top, cx + cw, top + 1.6, 0.45),
      g.rr(cx - cw, bottom - 1.6, cx + cw, bottom, 0.45)), { plate: 'A' }),
    ...g.pane(g.path(TRI), 'c1', { frame: 1.4, tracery: 'none', glass: { dark: 0.4 } }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
