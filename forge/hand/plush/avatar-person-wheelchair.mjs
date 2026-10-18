// forge/hand/plush/avatar-person-wheelchair.mjs: a person seated in a wheelchair: skin head with a hair cap, a broad torso
// with an arm, thigh and shin in clothing felt, a backrest and seat in grey gear, a slim wheel ring with hub and spokes
// (the hole stays open) and a footrest plate. Skin/hair/clothing follow the people convention (c1/c2/c4), gear is accent.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'
import { recolor } from '../../styles/_plush-people.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const skin = { part: 'K', shadeRole: 'shadow', shadeOp: 0.42, pinchOp: 0.3, hiRole: 'tint', hiOp: 0.7, threadOp: 0.4 }
  const cloth = { part: 'K', shadeRole: 'ink', pinchOp: 0.12 }
  const gear = { part: 'K', shadeRole: 'ink', pinchOp: 0.12, stitch: false, out: 0.55 }
  const head = P.circle(12.2, 4.3, 2.6)
  const hair = P.clip(P.circle(12.2, 4.3, 2.85), P.path('M8 1 H17 V4 C15.6 3.2 14.4 3.3 13.3 3.7 C12.2 4.1 10.8 3.6 9.8 4.2 L8 4.6 Z'))
  const pieces = [
    P.tube('accent', [[7.4, 7.2], [7.4, 13.6]], 1.5, gear),
    P.tube('accent', [[7.4, 13.8], [13.4, 13.8]], 1.5, gear),
    P.felt('accent', P.rr(15.6, 18.9, 21.4, 20.9, 1), { ...gear, shade: true }),
    P.tube('c2', [[11.4, 13.1], [15.2, 13.4], [17.9, 18.2]], 3, cloth),
    P.tube('c4', [[11.9, 8.2], [11.1, 13]], 5, { ...cloth, stitch: false }),
    P.tube('c4', [[11.4, 9.6], [14.6, 12.2]], 2.2, { ...cloth, stitch: false }),
    P.felt('c1', P.circle(15.2, 12.7, 1.15), { ...skin, stitch: false }),
    P.felt('c1', head, { ...skin, stitch: false }),
    P.knot(11.4, 4.8, 0.45, 'ink', { part: 'K' }),
    P.knot(13.4, 4.8, 0.45, 'ink', { part: 'K' }),
    P.felt('c2', hair, { ...cloth, stitch: false, hiOp: 0.14 }),
    P.felt('accent', P.ring(9.5, 16.9, 5, 3.8), { ...gear, stitch: false }),
    P.tube('accent', [[9.5, 13.9], [9.5, 19.9]], 0.8, { ...gear, out: 0.4 }),
    P.tube('accent', [[6.5, 16.9], [12.5, 16.9]], 0.8, { ...gear, out: 0.4 }),
    P.felt('accent', P.circle(9.5, 16.9, 1.25), { ...gear, stitch: false }),
  ]
  const nodes = compose(restoreParts(pieces, icon), icon)
  // gear is steel grey here, not the scheme's bubblegum
  return JSON.parse(JSON.stringify(recolor(nodes, icon)).replace(/var\(--with-plush-accent, #FF8DB4\)/g, 'var(--with-plush-accent, #9AA6BD)'))
}
