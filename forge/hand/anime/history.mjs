// forge/hand/anime/history.mjs — the new history skeleton in anime: a glossy sky rewind arc around a cream clock face
// (both centred right of middle), opening at the lower left, with a big separate sky arrowhead pointing down at its
// left end so the counter-clockwise turn reads at 16px; ink hands (plate A) with a coral hub.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const cx = 12.6, cy = 12.2, r = 7.9
  const ops = [
    k.surf(k.circle(cx, cy, 4.9), 'tint', { shine: 'none', shade: 0.8 }),
    k.surf(k.arc(cx, cy, r, 182, 478, 1.9), 'c1', { shineSize: 0.7 }),
    k.surf(k.poly([[2.5, 11.1], [7, 11.1], [4.75, 14.6]], [0.5, 0.5, 0.6]), 'c1', { shine: 'none', ol: 0.45 }),
    k.ink([[[cx, 9.1], [cx, cy], [15.1, 13.8]]], { part: 'a', w: 1.15, taper: false }),
    k.paint(k.circle(cx, cy, 0.75), 'accent', { part: 'a' }),
  ]
  return compose(ops, { seed: icon.name })
}
