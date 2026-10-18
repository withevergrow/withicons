// forge/hand/anime/layout-dashboard.mjs — the redesigned dashboard: a big tall sky panel top left, a small sakura chip
// top right, a tall sky column on the right and a short wide gold bar bottom left, with wide gutters, so the unequal
// tiles read as a dashboard and not the even 2x2 of layout-grid.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

const tile = (x0, y0, x1, y1, role, o = {}) =>
  k.surf(k.rr(x0, y0, x1, y1, 1.6), role, { shine: 'dot', shineSize: 0.6, ol: 0.45, ...o })

export default function render(icon) {
  const ops = [
    tile(3, 3, 12, 13, 'c1', { shine: 'streak', shineSize: 0.7 }),
    tile(15.6, 3, 21, 7.6, 'c2'),
    tile(15.6, 11.2, 21, 21, 'c1'),
    tile(3, 16.6, 12, 21, 'c3'),
  ]
  return compose(ops, { seed: icon.name })
}
