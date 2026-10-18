// forge/hand/gothic/type.mjs: a plain serif capital T in carved stone, its top bar ending in short serifs, with a
// gilded foot serif and a thread of sapphire glass inlaid down the stem; the generated gilt glyph on a blue plate warped at
// small size and hid the T.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const T = g.union(
    g.rr(4.4, 3.4, 19.6, 6.2, 0.5),
    g.rr(4.4, 3.4, 6.4, 8.6, 0.5),
    g.rr(17.6, 3.4, 19.6, 8.6, 0.5),
    g.rr(10.6, 3.4, 13.4, 19.6, 0.5),
  )
  return paint([
    g.stone(T),
    g.gilt(g.rr(7.6, 18.6, 16.4, 20.8, 0.7), { thin: true, plate: 'A', glint: false }),
    g.glass(g.rr(11.45, 7.4, 12.55, 17.6, 0.5), 'c2', { outline: 0.18, glint: false, glow: 0.32 }),
  ])
}
