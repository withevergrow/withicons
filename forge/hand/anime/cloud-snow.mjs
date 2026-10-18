// forge/hand/anime/cloud-snow.mjs — a cold snow cloud: the family cloud lifted to the top half but painted pale sky
// (edge) with a stronger violet cel shadow so it separates from a cream page, shedding five solid sky snow dots
// (plate A, they drift) instead of near-white hollow rings.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const cx = 12, cy = 8.9, s = 0.86
  const dots = k.join(
    k.circle(7.8, 17.2, 1.05), k.circle(12, 17.2, 1.05), k.circle(16.2, 17.2, 1.05),
    k.circle(9.9, 20.6, 1.05), k.circle(14.1, 20.6, 1.05),
  )
  const ops = [
    k.surf(dots, 'c1', { part: 'a', shine: 'none', shade: 0.6, ol: 0.38 }),
    k.surf(k.cloudShape(cx, cy, s), 'edge', { shine: 'none', shade: 0.75 }),
    k.shine(k.lens(cx - 3.4 * s, cy - 3.2 * s, cx - 0.6 * s, cy - 5.3 * s, 0.5 * s)),
  ]
  return compose(ops, { seed: icon.name })
}
