// forge/hand/anime/user-plus.mjs - the plain bust with a plus badge: a round cream head over sky shoulders (no hair,
// no collar), two catch-lit eyes, and a mint plus badge at the upper right.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const shoulders = k.path('M2.4 21.4 C2.4 18 4.6 15.4 7.4 15.4 H10.6 C13.4 15.4 15.6 18 15.6 21.4 Z')
  const bx = 18.9, by = 6.6
  const ops = [
    k.surf(shoulders, 'c1', { shine: 'none' }),
    k.surf(k.circle(9, 8.8, 4.7), 'tint', { shine: 'none' }),
    k.paint(k.join(k.ellipse(7.5, 9.5, 0.62, 0.9), k.ellipse(10.5, 9.5, 0.62, 0.9)), 'ink'),
    k.shine(k.join(k.circle(7.3, 9.15, 0.26), k.circle(10.3, 9.15, 0.26))),
    k.moat(k.circle(bx, by, 4.1), 0),
    k.surf(k.circle(bx, by, 3.5), 'c4', { part: 's', shine: 'dot', shineSize: 0.6, ol: 0.45 }),
    k.ink([[[bx, by - 1.7], [bx, by + 1.7]], [[bx - 1.7, by], [bx + 1.7, by]]], { role: 'tint', w: 1.25, taper: false, shift: 0, part: 's' }),
  ]
  return compose(ops, { seed: icon.name })
}
