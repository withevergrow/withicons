// forge/hand/anime/hotel.mjs — a hotel: a slim tall tower rising from a wider lobby wing, a gold rooftop sign on the
// tower, one row of lit windows and the lobby door (plate A). Few big blocks so it holds at 16-24px.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const tower = k.rr(6.8, 3.2, 17.2, 17, [2, 2, 0, 0])
  const wing = k.rr(2.4, 14.8, 21.6, 21.8, [1.6, 1.6, 0.8, 0.8])
  const ops = [
    k.surf(tower, 'c1', { shineSize: 0.9 }),
    k.surf(wing, 'c2', { shineSize: 0.8 }),
    k.surf(k.pill(8.6, 5.4, 15.4, 8.2), 'c3', { shine: 'none', ol: 0.45 }),
    k.surf(k.rr(8.6, 10.2, 11.3, 13.2, 0.9), 'tint', { shine: 'none', ol: 0.4 }),
    k.surf(k.rr(12.7, 10.2, 15.4, 13.2, 0.9), 'tint', { shine: 'none', ol: 0.4 }),
    k.surf(k.rr(10.3, 17.2, 13.7, 21.8, [1.7, 1.7, 0, 0]), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
  ]
  return compose(ops, { seed: icon.name })
}
