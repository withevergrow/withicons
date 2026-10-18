// forge/hand/anime/mandarin-orange.mjs - a squat glossy orange mandarin with pore dots, a short stem and a green leaf.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

const hex = { c1: '#FF9A1F', shadow: '#D2560A', c4: '#4CB860', c2: '#7A4A22' }
export default function render(icon) {
  const fruit = k.ellipse(11.6, 14.6, 8.4, 6.8)
  const leaf = k.lens(12.6, 6.6, 19.6, 3.2, 2.2)
  const ops = [
    k.surf(fruit, 'c1', { shineSize: 1 }),
    k.surf(k.seg(11.6, 8.2, 12.4, 5.6, 1.2), 'c2', { part: 'a', shine: 'none' }),
    k.surf(leaf, 'c4', { part: 'a', shine: 'dot' }),
    k.paint(k.join(k.circle(14.6, 13.4, 0.35), k.circle(16.4, 16.2, 0.35), k.circle(12.8, 18.2, 0.35), k.circle(9.2, 17, 0.35)), 'shadow', { op: 0.6 }),
  ]
  return compose(ops, { seed: icon.name, hex })
}
