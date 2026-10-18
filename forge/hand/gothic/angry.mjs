// forge/hand/gothic/angry.mjs: the common round angry face: a stone rim round a ruby glass petal ring, a gilded
// face with slanted V brows, two dot eyes and a downturned frown; the old horned demon mask is gone.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const rays = (cx, cy, r0, r1, n, rot) => Array.from({ length: n }, (_, k) => {
  const a = (rot + 360 * k / n) * Math.PI / 180
  return [[cx + r0 * Math.cos(a), cy + r0 * Math.sin(a)], [cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)]]
})

export default function render() {
  const R = 9.6, rf = 6.4
  return paint([
    g.stone(g.rim(g.circle(12, 12, R), 1.3), { ticks: rays(12, 12, R - 1.7, R + 0.5, 8, -67.5) }),
    g.glass(g.circle(12, 12, R - 1.25), 'c1', { tracery: rays(12, 12, rf, R, 12, -75), dark: 0.34, glow: 0.14 }),
    g.gilt(g.circle(12, 12, rf), { plate: 'A' }),
    g.recess(g.union(g.circle(9.5, 12.2, 1), g.circle(14.5, 12.2, 1)), { plate: 'A', outline: 0.15 }),
    g.recess(g.union(g.seg(7.5, 8.2, 10.9, 10.2, 1.25), g.seg(16.5, 8.2, 13.1, 10.2, 1.25), g.stroke(g.arcPts(12, 18.4, 3.6, -148, -32), 1.3)), { plate: 'A', outline: 0.1 }),
  ])
}
