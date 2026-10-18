// forge/hand/anime/football.mjs — the redesigned soccer ball: a glossy cream ball with the skeleton's single ink centre
// pentagon, five clean spokes and five rim panels, so the pattern reads as a ball and not a star or flower.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const ball = k.circle(12, 12, 9.1)
  const rim = k.path('M7.84 3.46 L9.18 4.25 L12 5 L14.82 4.25 L16.16 3.46 L12 1 Z M18.83 5.4 L18.5 6.92 L18.66 9.84 L20.24 12.29 L21.41 13.32 L23 8 Z M20.39 16.46 L18.84 16.61 L16.11 17.66 L14.27 19.93 L13.65 21.36 L19 22 Z M10.35 21.36 L9.73 19.93 L7.89 17.66 L5.16 16.61 L3.61 16.46 L5 22 Z M2.59 13.32 L3.76 12.29 L5.34 9.84 L5.5 6.92 L5.17 5.4 L1 8 Z')
  return compose([
    k.surf(ball, 'tint', { shine: 'streak', shineSize: 0.9 }),
    k.paint(k.clip(rim, ball), 'ink'),
    k.paint(k.poly([[12, 8.5], [15.33, 10.92], [14.06, 14.83], [9.94, 14.83], [8.67, 10.92]], 0.5), 'ink'),
    k.ink([[[12, 8.5], [12, 5]], [[15.33, 10.92], [18.66, 9.84]], [[14.06, 14.83], [16.11, 17.66]], [[9.94, 14.83], [7.89, 17.66]], [[8.67, 10.92], [5.34, 9.84]]], { w: 0.8, taper: false, shift: 0 }),
  ], { seed: icon.name })
}
