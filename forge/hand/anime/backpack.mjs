// forge/hand/anime/backpack.mjs — the redesigned backpack as a school-bag prop: a sky body with a dome top, a sky top
// handle loop, a curved flap that casts onto the body with a gold buckle, and a sakura front pocket, so it reads as a
// bag rather than a house or shed (handle, flap and pocket are plate A and swing).
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const body = k.rr(4.6, 6.4, 19.4, 21.4, [6, 6, 2.2, 2.2])
  const flap = k.clip(body, k.path('M3 3 H21 V12.2 C17.6 13.8 14.8 14.3 12 14.3 C9.2 14.3 6.4 13.8 3 12.2 Z'))
  const ops = [
    k.surf(k.arc(12, 5.4, 2.4, 180, 360, 1.4), 'c1', { part: 'a', shine: 'none', ol: 0.38 }),
    k.surf(k.unite(k.seg(9.6, 5.4, 9.6, 7, 1.4), k.seg(14.4, 5.4, 14.4, 7, 1.4)), 'c1', { part: 'a', shine: 'none', ol: 0.38, shade: 0 }),
    k.surf(body, 'c1', { shine: 'none' }),
    k.surf(flap, 'c1', { part: 'a', shineSize: 0.85 }),
    k.surf(k.rr(10.9, 12.6, 13.1, 15.4, 0.6), 'c3', { part: 'a', shine: 'none', ol: 0.35, shade: 0 }),
    k.surf(k.rr(7.8, 16.2, 16.2, 20, [0.8, 0.8, 1.6, 1.6]), 'c2', { part: 'a', shine: 'dot', shineSize: 0.5, ol: 0.4 }),
  ]
  return compose(ops, { seed: icon.name })
}
