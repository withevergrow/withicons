// forge/hand/anime/handshake.mjs - business handshake as in the line design: a sky and a sakura cuffed sleeve slanting in
// from the left and right edges, one clasped cream hand between them with four finger bumps along the lower left and a
// thumb laid across the top.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const sleeveL = k.poly([[4.4, 6.6], [7.1, 8.2], [4.1, 14.4], [1.4, 12.8]], 0.7)
  const sleeveR = k.poly([[19.6, 6.6], [16.9, 8.2], [19.9, 14.4], [22.6, 12.8]], 0.7)
  const cuffL = k.poly([[6, 7.5], [8, 8.7], [5.1, 14.8], [3.1, 13.6]], 0.5)
  const cuffR = k.poly([[18, 7.5], [16, 8.7], [18.9, 14.8], [20.9, 13.6]], 0.5)
  const palm = k.poly([[7.4, 9.6], [10.6, 8.5], [13.6, 9.6], [16.8, 8.8], [18.6, 13.2], [17.2, 15.2], [12.4, 19], [7.6, 16.2], [5.2, 13.6]], [0.8, 1.2, 1.2, 1, 0.8, 1.2, 1, 1.4, 0.8])
  const finger = (x, y) => k.rot(k.pill(x - 1.3, y - 1.35, x + 3.1, y + 1.35), -48, x, y)
  const ops = [
    k.surf(sleeveR, 'c2', { shine: 'none' }),
    k.surf(cuffR, 'tint', { shine: 'none', ol: 0.38 }),
    k.surf(sleeveL, 'c1', { shine: 'none' }),
    k.surf(cuffL, 'tint', { shine: 'none', ol: 0.38 }),
    k.surf(palm, 'tint', { shine: 'none' }),
    k.surf(finger(6.6, 15.4), 'tint', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(finger(8.5, 17), 'tint', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(finger(10.5, 18.4), 'tint', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(finger(12.7, 18.7), 'tint', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.pill(8.4, 10, 13.8, 12.6), 'tint', { part: 'a', shine: 'none', ol: 0.4 }),
  ]
  return compose(ops, { seed: icon.name })
}
