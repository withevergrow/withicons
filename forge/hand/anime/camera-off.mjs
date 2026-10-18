// forge/hand/anime/camera-off.mjs - the whole sky camera intact (hump, lens, flash) with one coral slash across it.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const body = k.unite(k.rr(2.4, 7, 21.6, 19.6, 2.6), k.rr(8, 4.4, 15.6, 8.6, 1.4))
  const ops = [
    k.surf(body, 'c1', { shineSize: 0.8 }),
    k.surf(k.circle(12, 13.2, 4.2), 'tint', { shine: 'none', ol: 0.4 }),
    k.surf(k.circle(12, 13.2, 2.5), 'ink', { shine: 'dot', shineSize: 0.5, ol: 0 }),
    k.paint(k.circle(18.4, 9.6, 0.8), 'c3'),
    k.surf(k.seg(3.4, 3.6, 20.6, 20.8, 2.2), 'accent', { part: 'a', shine: 'none', cast: false }),
  ]
  return compose(ops, { seed: icon.name })
}
