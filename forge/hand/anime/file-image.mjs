// forge/hand/anime/file-image.mjs — the common file-image: one folded-corner page holding a gold sun and a green
// mountain ridge (plate A), not a text page with a separate image card.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const { sheet, flap } = k.page(4.6, 2.4, 19.4, 21.6, 5.4, 2.2)
  const hills = k.clip(
    k.poly([[3, 22], [3, 20], [9.6, 14.2], [12.6, 17.2], [15.6, 13.6], [21, 18.6], [21, 22]], [0, 1, 1.2, 1, 1.2, 1, 0]),
    sheet,
  )
  const ops = [
    k.surf(sheet, 'tint', { shine: 'none' }),
    k.surf(flap, 'c4', { shine: 'none', ol: 0.4 }),
    k.surf(k.circle(9.8, 10.2, 2.1), 'c3', { part: 'a', shine: 'dot', shineSize: 0.6, ol: 0.45 }),
    k.surf(hills, 'c4', { part: 'a', shine: 'none', ol: 0.5, cast: false }),
  ]
  return compose(ops, { seed: icon.name })
}
