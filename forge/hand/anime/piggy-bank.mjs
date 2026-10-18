// forge/hand/anime/piggy-bank.mjs - round sakura pig in side view: gold coin dropping into the top slot, ear,
// snout with nostrils, eye, two short legs and a curly tail.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const body = k.unite(k.ellipse(11.4, 14, 7.6, 6), k.rr(6.2, 17.4, 8.8, 21.4, 1), k.rr(13.4, 17.4, 16, 21.4, 1))
  const ops = [
    k.ink('M4 13.4 C2 13.4 2 11 3.6 11.2 C4.6 11.4 4 12.6 3.2 12.2', { w: 1.1 }),
    k.surf(body, 'c2', { shineSize: 0.8 }),
    k.surf(k.poly([[13.2, 8.8], [16.2, 6.2], [16.6, 10]], 0.5), 'c2', { shine: 'none', ol: 0.4 }),
    k.surf(k.ellipse(19.4, 14.2, 1.9, 2.3), 'c2', { shine: 'none', ol: 0.4 }),
    k.paint(k.join(k.ellipse(19, 13.5, 0.35, 0.55), k.ellipse(19.9, 14.9, 0.35, 0.55)), 'ink'),
    k.paint(k.ellipse(15.6, 12.2, 0.7, 0.9), 'ink', { part: 'a' }),
    k.shine(k.circle(15.4, 11.9, 0.28)),
    k.ink('M9.4 8.4 H13', { w: 1.2 }),
    k.surf(k.circle(11.2, 4, 2.4), 'c3', { part: 'a', shine: 'dot', shineSize: 0.5 }),
  ]
  return compose(ops, { seed: icon.name })
}
