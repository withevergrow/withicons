// forge/hand/gothic/minimize.mjs: two chunky gilt shafts running in from opposite corners, each ending in a broad
// triangular head glazed in sapphire that points at the open centre, so it reads as minimize, not a sword.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

// v: the head's right-angle point (aimed at the centre), d: leg direction (+1 / -1), L: leg length, tail: shaft end
const arrow = (v, d, L, tail) => {
  const [vx, vy] = v
  const head = g.poly([[vx, vy], [vx, vy - d * L], [vx + d * L, vy]])
  const mx = vx + d * L / 2, my = vy - d * L / 2
  return [
    g.gilt(g.seg(mx, my, tail[0], tail[1], 3)),
    g.glass(g.seg(mx, my, tail[0] - d * 0.4, tail[1] + d * 0.4, 1.05), 'c2', { outline: 0.2, glint: false, glow: 0.24 }),
    g.gilt(head, { plate: 'A' }),
    g.glass(g.shrink(head, 1.25), 'c2', { plate: 'A', outline: 0.25, glint: false, glow: 0.3 }),
  ]
}

export default function render() {
  return paint([
    ...arrow([13.3, 10.7], 1, 7.6, [20.6, 3.4]),
    ...arrow([10.7, 13.3], -1, 7.6, [3.4, 20.6]),
  ])
}
