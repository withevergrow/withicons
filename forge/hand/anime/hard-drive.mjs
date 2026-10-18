// forge/hand/anime/hard-drive.mjs — the redesigned drive slab: a pale lit top plane sloping back, a glossy sky front
// face with a dark recessed slot and a green activity light (plate A, it flickers), so it reads as storage, not a
// speaker or a washing machine.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const top = k.poly([[2.6, 12.4], [5, 6.8], [19, 6.8], [21.4, 12.4]], [0.4, 1.4, 1.4, 0.4])
  const ops = [
    k.surf(top, 'edge', { shine: 'none', shade: 0.6 }),
    k.surf(k.rr(2.6, 11.4, 21.4, 19.6, 2.2), 'c1', { shineSize: 0.8 }),
    k.surf(k.pill(5.4, 14.6, 13, 16.6), 'ink', { part: 'a', inset: true, ol: 0, shine: 'none', shade: 0 }),
    k.surf(k.circle(17.6, 15.6, 1.3), 'c4', { part: 'a', shine: 'dot', shineSize: 0.5, ol: 0.38 }),
  ]
  return compose(ops, { seed: icon.name })
}
