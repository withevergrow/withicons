// forge/hand/anime/telescope.mjs — the new telescope skeleton as an anime prop: a glossy sky tube tilted up-right
// with a separate gold dew cap at its upper end (a clear gap between them), a sakura mount knob and two gold tripod
// legs (plate A) splayed well clear of the tube so the silhouette reads at 16px.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

// shapes are drawn level around (12, 12) and tilted onto the skeleton's -26.57 deg axis
const T = s => k.rot(s, -26.57, 12, 12)

export default function render(icon) {
  const tube = T(k.rr(6.6, 6.75, 15.6, 10.35, [1.1, 0, 0, 1.1]))
  const cap = T(k.rr(16.3, 5.9, 20.1, 11.2, 1))
  const ops = [
    k.tube([[[12, 13.4], [7.1, 20.9]], [[12, 13.4], [16.9, 20.9]]], 'c3', { part: 'a', w: 1.45, ol: 0.45 }),
    k.surf(tube, 'c1', { shineSize: 0.8 }),
    k.surf(cap, 'c3', { shine: 'dot', shineSize: 0.6, ol: 0.45 }),
    k.surf(k.circle(12, 12.3, 1.7), 'c2', { shine: 'none', ol: 0.4 }),
    k.paint(k.circle(12, 12.3, 0.6), 'ink'),
    k.sparkleAt(5.2, 4.4, 1.8, { mx: 1, my: 1 }),
  ]
  return compose(ops, { seed: icon.name })
}
