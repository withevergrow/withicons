// forge/hand/anime/lunar-drum.mjs - a red barrel drum with a cream skin top, gold rims and studs, and a separate
// stick (wood shaft, red ball head) resting above it at an angle.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

const hex = { c1: '#E8352E', shadow: '#8E1420', c3: '#FFC233', tint: '#FFF1D6', c2: '#B9773A', accent: '#E8352E' }
export default function render(icon) {
  const barrel = k.path('M4.4 12.4 C4.4 10.6 19.6 10.6 19.6 12.4 L19.6 18.6 C19.6 21.4 4.4 21.4 4.4 18.6 Z')
  const top = k.ellipse(12, 12.2, 7.6, 2.2)
  const band = k.cut(k.path('M4.4 17.4 C4.4 19.9 19.6 19.9 19.6 17.4 L19.6 18.8 C19.6 21.3 4.4 21.3 4.4 18.8 Z'))
  const studs = k.join(k.circle(7, 15.8, 0.7), k.circle(12, 16.4, 0.7), k.circle(17, 15.8, 0.7))
  const ops = [
    k.surf(barrel, 'c1', { shineSize: 0.9 }),
    k.surf(band, 'c3', { shine: 'none', ol: 0.4 }),
    k.surf(top, 'tint', { shine: 'none', shade: 0.6 }),
    k.surf(studs, 'c3', { part: 's', shine: 'none', ol: 0.4 }),
    k.surf(k.seg(9.6, 7.2, 18, 2.4, 1.3), 'c2', { part: 'a', shine: 'none' }),
    k.surf(k.circle(8.6, 7.8, 1.6), 'accent', { part: 'a', shine: 'dot' }),
  ]
  return compose(ops, { seed: icon.name, hex })
}
