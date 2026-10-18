// forge/hand/anime/salad.mjs - wide sky bowl on a foot with a green lettuce leaf, coral carrot and a halved egg
// poking out of the top.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const bowl = k.path('M2 12 H22 C22 16.6 17.8 19.4 12 19.4 C6.2 19.4 2 16.6 2 12 Z')
  const ops = [
    k.surf(k.lens(3.2, 11.6, 8.4, 4.6, 2.2), 'c4', { part: 'a', shine: 'none' }),
    k.surf(k.lens(11.2, 2.2, 10, 2.8, 1.4), 'c4', { part: 'a', shine: 'none' }),
    k.surf(k.lens(12.4, 1.6, 13.4, 4.6, 1.2), 'c4', { part: 'a', shine: 'none' }),
    k.surf(k.poly([[9.4, 12.6], [12.2, 3.2], [14.6, 12.6]], 0.7), 'accent', { part: 'a', shine: 'none' }),
    k.surf(k.ellipse(16.8, 11, 3.4, 2.6), 'tint', { part: 'a', shine: 'none', ol: 0.4 }),
    k.paint(k.circle(16.8, 10.8, 1.3), 'c3', { part: 'a' }),
    k.surf(k.rr(9, 18.4, 15, 21.2, 1), 'c1', { shine: 'none' }),
    k.surf(bowl, 'c1', { shineSize: 0.8 }),
  ]
  return compose(ops, { seed: icon.name })
}

