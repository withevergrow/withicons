// forge/hand/gothic/hash.mjs — the hash sign as four pointed blades: two slanted gilded uprights and two ruby-glass
// horizontals laid over them behind a moat, so every bar reads on its own instead of fusing into one shield.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const f1 = v => Math.round(v * 100) / 100
// a pointed bar from (x0, y0) to (x1, y1), width w, with a tip of length t at each end
function blade(x0, y0, x1, y1, w, t = 1.6) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy * w / 2, ny = ux * w / 2
  const a = [x0 + ux * t, y0 + uy * t], b = [x1 - ux * t, y1 - uy * t]
  return g.poly([[x0, y0], [a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [x1, y1], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]].map(([x, y]) => [f1(x), f1(y)]))
}

export default function render(icon) {
  const v1 = blade(9.8, 2.6, 7.4, 21.4, 2.5), v2 = blade(16.6, 2.6, 14.2, 21.4, 2.5)
  const h1 = blade(2.6, 8.1, 21.4, 8.1, 2.0), h2 = blade(2.6, 15.9, 21.4, 15.9, 2.0)
  const parts = [
    g.gilt(v1, { outline: 0.34 }), g.gilt(v2, { outline: 0.34 }),
    g.cut(g.grow(h1, 0.45)), g.cut(g.grow(h2, 0.45)),
    g.glass(h1, 'c1', { outline: 0.34, tracery: 'none', glint: false }),
    g.glass(h2, 'c1', { outline: 0.34, tracery: 'none', glint: false }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
