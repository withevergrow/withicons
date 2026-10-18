// forge/hand/anime/hexagon.mjs — the new honeycomb-cell hexagon: a glossy gold pointy-top hex frame around an inset
// honey cell (replaces the old bare blue polygon that ignored the skeleton's inner cell).
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const outer = k.ngon(12, 12, 9.1, 6, -90, 1.9)
  const inner = k.ngon(12, 12, 4.6, 6, -90, 0.9)
  return compose([
    k.surf(k.cut(outer, inner), 'c3', { shineSize: 0.95 }),
    k.surf(inner, 'c3', { inset: true, ol: 0.4, shine: 'dot', shineSize: 0.55 }),
  ], { seed: icon.name })
}
