// forge/hand/anime/usb.mjs — the redesigned USB trident: a sky trunk with a pointed head and a round plug foot,
// a sakura round branch and a gold square branch on thick tubes that join the trunk at clearly different heights,
// so the three prongs stay apart at 16px.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const ops = [
    k.tube([[5.4, 11], [5.4, 12.6], [12, 16.2]], 'c2', { w: 1.5, ol: 0.42 }),
    k.tube([[18.8, 10.6], [18.8, 11.2], [12, 13.4]], 'c3', { w: 1.5, ol: 0.42 }),
    k.surf(k.circle(5.4, 9.4, 2), 'c2', { shine: 'dot', shineSize: 0.5, ol: 0.4 }),
    k.surf(k.rr(16.9, 6.8, 20.7, 10.6, 0.7), 'c3', { shine: 'none', ol: 0.4 }),
    k.surf(k.unite(k.seg(12, 5, 12, 18, 2), k.poly([[12, 2.4], [15, 6.3], [9, 6.3]], 0.5), k.circle(12, 19.4, 2.2)), 'c1', { shineSize: 0.6 }),
  ]
  return compose(ops, { seed: icon.name })
}
