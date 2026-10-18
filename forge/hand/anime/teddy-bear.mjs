// forge/hand/anime/teddy-bear.mjs - the line teddy in anime: round tan head with two small round ears, a cream snout
// with nose and smile, a soft body and two arms hugging a coral heart.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

const hex = { c1: '#D9A066', c2: '#FF9AAE', tint: '#FFF5EC' }
export default function render(icon) {
  const body = k.path('M12 12.6 C16.2 12.6 19 15.6 19 18.8 C19 20.7 16.6 21.6 12 21.6 C7.4 21.6 5 20.7 5 18.8 C5 15.6 7.8 12.6 12 12.6 Z')
  const heart = k.path('M12 21 C12 21 8.4 18.8 8.4 16.4 C8.4 15.2 9.3 14.4 10.4 14.4 C11.1 14.4 11.7 14.8 12 15.5 C12.3 14.8 12.9 14.4 13.6 14.4 C14.7 14.4 15.6 15.2 15.6 16.4 C15.6 18.8 12 21 12 21 Z')
  const ops = [
    k.surf(k.circle(7.2, 4.4, 2.3), 'c1', { shine: 'none', shade: 0.7 }),
    k.surf(k.circle(16.8, 4.4, 2.3), 'c1', { shine: 'none', shade: 0.7 }),
    k.paint(k.join(k.circle(7.2, 4.4, 1), k.circle(16.8, 4.4, 1)), 'c2', { op: 0.85 }),
    k.surf(body, 'c1', { shine: 'none' }),
    k.surf(k.circle(12, 8.6, 5.6), 'c1', { shine: 'none', shade: 1.1 }),
    k.shine(k.arc(12, 8.6, 4.8, 205, 250, 0.8)),
    k.surf(k.ellipse(12, 10.9, 2.6, 2), 'tint', { shine: 'none', shade: 0.8, ol: 0.3, cast: false }),
    k.paint(k.join(k.ellipse(9.4, 7.9, 0.62, 0.85), k.ellipse(14.6, 7.9, 0.62, 0.85)), 'ink'),
    k.shine(k.join(k.circle(9.25, 7.6, 0.24), k.circle(14.45, 7.6, 0.24))),
    k.surf(k.poly([[10.9, 9.9], [13.1, 9.9], [12, 11]], [0.5, 0.5, 0.6]), 'ink', { shine: 'none', shade: 0, ol: 0.2, cast: false }),
    k.ink([[12, 11], [12, 11.7]], { w: 0.55, taper: false }),
    k.ink('M10.9 11.9 C11.4 12.6 12.6 12.6 13.1 11.9', { w: 0.55 }),
    k.surf(heart, 'accent', { part: 'a', shineSize: 0.5 }),
    k.surf(k.ellipse(7.2, 17.4, 3, 1.6, -38), 'c1', { shine: 'none', ol: 0.4, shade: 0.8 }),
    k.surf(k.ellipse(16.8, 17.4, 3, 1.6, 38), 'c1', { shine: 'none', ol: 0.4, shade: 0.8 }),
  ]
  return compose(ops, { seed: icon.name, hex })
}
