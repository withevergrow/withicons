// forge/hand/gothic/remove-formatting.mjs — a bare gilded capital T threaded with sapphire enamel and a small ruby
// glass X (S) set clear of the stem in the lower right; the generated drawing boxed the T in a quarry panel and laid
// a big ruby badge over its corner, so it read as a framed tile with a close button instead of "plain text".
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const T = g.union(
    g.rr(2.8, 2.6, 17.2, 5.6, 0.6),
    g.rr(2.8, 2.6, 5.6, 7.4, 0.6),
    g.rr(14.4, 2.6, 17.2, 7.4, 0.6),
    g.rr(8.4, 4, 11.6, 21, 0.6),
  )
  const inlay = g.union(g.rr(4.1, 3.6, 15.9, 4.6, 0.5), g.rr(9.5, 4.6, 10.5, 19.8, 0.5))
  const X = g.stroke([[[15.3, 15.3], [20.4, 20.4]], [[20.4, 15.3], [15.3, 20.4]]], 2.7)
  const Xin = g.stroke([[[15.5, 15.5], [20.2, 20.2]], [[20.2, 15.5], [15.5, 20.2]]], 1)
  const parts = [
    g.gilt(T),
    g.glass(inlay, 'c2', { outline: 0.2, glint: false, glow: 0.32 }),
    g.gilt(X, { plate: 'S' }),
    g.glass(Xin, 'c1', { outline: 0.18, glint: false, glow: 0.32, plate: 'S' }),
  ]
  return paint(enamel(parts, icon))
}
