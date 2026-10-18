// forge/hand/plush/avatar-person-glasses.mjs: a person with rectangular glasses: skin face with a brown hair cap and
// fringe, two rounded-square embroidered frames with a bridge and glass-light lenses, knot eyes, a small smile and
// clothing shoulders that sit fully below the chin (no band across the face).
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'
import { recolor } from '../../styles/_plush-people.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const skin = { part: 'K', shadeRole: 'shadow', shadeOp: 0.42, pinchOp: 0.3, hiRole: 'tint', hiOp: 0.7, threadOp: 0.4 }
  const other = { part: 'K', shadeRole: 'ink', pinchOp: 0.12 }
  const shoulders = P.clip(P.rr(3.8, 17.2, 20.2, 24, [5, 5, 0, 0]), P.rect(0, 0, 24, 22.4))
  const head = P.ellipse(12, 10.2, 6.1, 6.7)
  const hair = P.clip(P.ellipse(12, 10, 6.6, 7.3), P.path('M3 1 H21 V10.4 H18.3 C17.9 8.5 16.3 7 14.1 7.1 C12.9 7.2 11.9 7.5 10.7 7.1 C8.5 6.6 6.7 8 5.7 10.4 H3 Z'))
  const lensL = P.rr(6.9, 9.7, 11.3, 13.5, 1.2)
  const lensR = P.rr(12.7, 9.7, 17.1, 13.5, 1.2)
  const frame = (x0, x1) => P.linesOf(`M${x0 + 1.2} 9.7 H${x1 - 1.2} A1.2 1.2 0 0 1 ${x1} 10.9 V12.3 A1.2 1.2 0 0 1 ${x1 - 1.2} 13.5 H${x0 + 1.2} A1.2 1.2 0 0 1 ${x0} 12.3 V10.9 A1.2 1.2 0 0 1 ${x0 + 1.2} 9.7 Z`)[0]
  const pieces = [
    P.felt('c4', shoulders, { ...other, inset: 0.8 }),
    P.felt('c1', P.rr(10, 15, 14, 18.4, 1), { ...skin, stitch: false, out: 0.5 }),
    P.felt('c1', head, { ...skin, stitch: false }),
    P.flat('shine', P.unite(lensL, lensR), { part: 'K', op: 0.5 }),
    P.thread([frame(6.9, 11.3), frame(12.7, 17.1), [[11.3, 11], [12.7, 11]]], { w: 1.05, role: 'ink', part: 'K' }),
    P.knot(9.1, 11.7, 0.6, 'ink', { part: 'K' }),
    P.knot(14.9, 11.7, 0.6, 'ink', { part: 'K' }),
    P.knot(9.3, 11.45, 0.2, 'shine', { part: 'K', op: 0.95 }),
    P.knot(15.1, 11.45, 0.2, 'shine', { part: 'K', op: 0.95 }),
    P.thread([[10.6, 15.1], [11.4, 15.6], [12.6, 15.6], [13.4, 15.1]], { w: 0.8, role: 'ink', part: 'K' }),
    P.felt('c2', hair, { ...other, hiOp: 0.14, threadOp: 0.5 }),
  ]
  return recolor(compose(restoreParts(pieces, icon), icon), icon)
}
