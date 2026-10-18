// forge/hand/anime/megaphone.mjs — the redesigned megaphone as one continuous glossy sky horn pointing right: a
// sakura back cap, a wide gold mouth rim and a gold grip below, so the horn-and-handle silhouette reads at 16px.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const horn = k.unite(
    k.rr(3, 9, 9, 15, [2, 0, 0, 2]),
    k.path('M8 9 L17.4 4.3 Q19.6 3.2 19.6 5.6 V18.4 Q19.6 20.8 17.4 19.7 L8 15 Z'),
  )
  const ops = [
    k.surf(k.rr(6, 14, 9.6, 20.4, 1.6), 'c3', { shine: 'none', ol: 0.42 }),
    k.surf(horn, 'c1', { shineSize: 0.8 }),
    k.surf(k.clip(horn, k.rect(0, 0, 8.4, 24)), 'c2', { shine: 'none', cast: false, ol: 0.35 }),
    k.surf(k.rr(18.3, 3.3, 21, 20.7, 1.35), 'c3', { shine: 'dot', shineSize: 0.55, ol: 0.42 }),
  ]
  return compose(ops, { seed: icon.name })
}
