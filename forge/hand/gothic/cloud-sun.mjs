// forge/hand/gothic/cloud-sun.mjs — partly cloudy after the new skeleton: a gold rose-window sun upper-left with five
// slender gilt rays (up, the two diagonals, left, lower-left) standing clear of it, half hidden behind a big sapphire
// quarry cloud lower-right; the generated drawing kept the old layout (tiny cloud, stubby dotted rays that read as a flower).
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const f1 = v => Math.round(v * 100) / 100
const RAD = Math.PI / 180
const SX = 9.6, SY = 9.6
// a slender lozenge ray along angle a: blunt foot at r0 (width w), sharp tip at r1
function ray(a, r0, r1, w) {
  const c = Math.cos(a * RAD), s = Math.sin(a * RAD)
  const P = (r, t) => [f1(SX + r * c - t * s), f1(SY + r * s + t * c)]
  const k = r0 + (r1 - r0) * 0.3
  return g.poly([P(r0, -w * 0.32), P(k, -w / 2), P(r1, 0), P(k, w / 2), P(r0, w * 0.32)])
}

export default function render() {
  // the exemplar cloud, scaled 0.78 about (12, 12) into the lower right
  const X = x => 12 + (x - 12) * 0.78 + 2.1, Y = y => 12 + (y - 12) * 0.78 + 3.25
  const cloud = g.union(g.circle(X(8.2), Y(13.6), 3.43), g.circle(X(13.4), Y(10.4), 4.37), g.circle(X(17.6), Y(14.2), 3.04), g.rr(X(4), Y(13), X(20.4), Y(18.6), 2.18))
  const rays = [-90, -45, -135, 180, 135].map(a => ray(a, 5.6, 7.6, 1.9))
  const parts = [
    g.gilt(g.union(...rays), { plate: 'A', thin: true, glint: false }),
    ...g.rose(SX, SY, 4.3, 'c3', { n: 8, frame: 1.1, medal: 'c1', plate: 'A' }),
    g.cut(g.grow(cloud, 0.85)),
    ...g.pane(cloud, 'c2', { frame: 1.4, tracery: 'quarry', glass: { medallion: false, s: 2.4 } }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
