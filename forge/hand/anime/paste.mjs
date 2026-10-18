// forge/hand/anime/paste.mjs — the new paste skeleton as an anime prop: a glossy sky clipboard with its gold clip on
// top and a cream page laid onto its lower-right face (casting onto the board), so it reads paste, not copy.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const page = k.rr(10.5, 11, 21, 21.4, 1.8)
  const ops = [
    k.surf(k.rr(3, 4.6, 17, 20, 2), 'c1', { shineSize: 0.8 }),
    k.surf(k.rr(5.2, 7.6, 14.8, 17.8, 1), 'edge', { inset: true, ol: 0, shine: 'none', shade: 0.6 }),
    k.surf(k.unite(k.rr(6.6, 3.4, 13.4, 7.2, 1.2), k.circle(10, 3.3, 1.35)), 'c3', { part: 'a', shine: 'dot', shineSize: 0.6, ol: 0.42 }),
    k.paint(k.circle(10, 3.3, 0.5), 'ink', { part: 'a' }),
    k.moat(page, 0.55),
    k.surf(page, 'tint', { shine: 'none' }),
    k.ink([[[13.3, 14.6], [18.3, 14.6]], [[13.3, 17.8], [16.3, 17.8]]], { w: 0.8 }),
  ]
  return compose(ops, { seed: icon.name })
}
