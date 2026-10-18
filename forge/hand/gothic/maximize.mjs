// forge/hand/gothic/maximize.mjs: two short, chunky gilt arrows driving out to opposite corners, each closed by a
// broad triangular head glazed in sapphire; the centre stays open so it reads as maximize, not a spear or sword.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const arrow = (tip, base, tail) => {
  const [tx, ty] = tip, [bx, by] = base
  const head = g.poly([[tx, ty], [bx, ty], [tx, by]])
  const mx = (tx + bx) / 2, my = (ty + by) / 2
  return [
    g.gilt(g.seg(mx, my, tail[0], tail[1], 2.8)),
    g.glass(g.seg(mx, my, tail[0], tail[1], 1.05), 'c2', { outline: 0.2, glint: false, glow: 0.24 }),
    g.gilt(head, { plate: 'A' }),
    g.glass(g.shrink(head, 1.25), 'c2', { plate: 'A', outline: 0.25, glint: false, glow: 0.3 }),
  ]
}

export default function render() {
  return paint([
    ...arrow([21.2, 2.8], [14, 10], [13.7, 10.3]),
    ...arrow([2.8, 21.2], [10, 14], [10.3, 13.7]),
  ])
}
