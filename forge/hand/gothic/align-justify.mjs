// forge/hand/gothic/align-justify.mjs: four plain carved stone bars of equal width, each tipped with a small
// gilded stud at both ends; the generated stone brackets with inlays read as stacked trays, not lines of text.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const H = 2.6
const YS = [4.5, 9.5, 14.5, 19.5]
const bar = (y) => g.rr(2.6, y - H / 2, 21.4, y + H / 2, 1.1)

export default function render() {
  return paint([
    g.stone(g.union(...YS.map(bar))),
    g.gilt(g.union(...YS.flatMap(y => [g.circle(4.3, y, 0.6), g.circle(19.7, y, 0.6)])), { thin: true, glint: false, outline: 0.25 }),
  ])
}
