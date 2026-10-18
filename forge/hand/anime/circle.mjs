// forge/hand/anime/circle.mjs - a plain ring with a clear open centre: one glossy sky rim with its highlight.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const rim = k.cut(k.circle(12, 12, 9.4), k.circle(12, 12, 6.5))
  return compose([k.surf(rim, 'c1', { shineSize: 1 })], { seed: icon.name })
}
