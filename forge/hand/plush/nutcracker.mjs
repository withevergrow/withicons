// forge/hand/plush/nutcracker.mjs: a toy-soldier nutcracker head: tall tomato shako with a gold band and a white
// plume, cream face with ears, round knot eyes, rosy cheeks and nose, a big white moustache, and a square
// hinged jaw with stitched teeth over a tomato collar.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const pieces = [
    // collar / tunic
    P.felt('c1', P.rr(5.5, 18.6, 18.5, 22.4, 1.6), { part: 'K', stitch: false }),
    // ears
    P.felt('tint', P.ellipse(6.6, 12.6, 1.35, 1.7), { part: 'K', stitch: false, out: 0.5 }),
    P.felt('tint', P.ellipse(17.4, 12.6, 1.35, 1.7), { part: 'K', stitch: false, out: 0.5 }),
    // face
    P.felt('tint', P.rr(7.2, 8.6, 16.8, 17.4, 1.8), { part: 'K' }),
    // jaw with teeth
    P.felt('edge', P.rr(9.2, 15.2, 14.8, 19.8, 1), { part: 'A', stitch: false, out: 0.55 }),
    P.thread([[[9.9, 17.3], [14.1, 17.3]], [[11.1, 15.9], [11.1, 17.3]], [[12.9, 15.9], [12.9, 17.3]]], { w: 0.45, role: 'ink', op: 0.75, part: 'A' }),
    // moustache
    P.felt('shine', P.unite(P.ellipse(10.1, 14.3, 2.5, 1.15), P.ellipse(13.9, 14.3, 2.5, 1.15)), { part: 'K', stitch: false, out: 0.5 }),
    // nose and cheeks
    P.flat('accent', P.circle(9.05, 12.85, 0.75), { part: 'K', op: 0.85 }),
    P.flat('accent', P.circle(14.95, 12.85, 0.75), { part: 'K', op: 0.85 }),
    P.felt('c1', P.circle(12, 12.6, 0.9), { part: 'K', stitch: false, out: 0.45 }),
    // eyes
    P.knot(9.9, 11.0, 0.72, 'ink', { part: 'K' }),
    P.knot(14.1, 11.0, 0.72, 'ink', { part: 'K' }),
    P.knot(10.15, 10.75, 0.25, 'shine', { part: 'K', op: 0.95 }),
    P.knot(14.35, 10.75, 0.25, 'shine', { part: 'K', op: 0.95 }),
    // shako hat, band, badge, plume
    P.felt('c1', P.poly([[7.6, 9.4], [8.3, 3.4], [15.7, 3.4], [16.4, 9.4]], 0.9), { part: 'K' }),
    P.felt('c2', P.rr(7.1, 7.9, 16.9, 9.9, 0.8), { part: 'K', stitch: false, out: 0.5 }),
    P.felt('c2', P.circle(12, 5.6, 1.1), { part: 'K', stitch: false, out: 0.45 }),
    P.felt('edge', P.ellipse(12, 1.95, 1.7, 1.05), { part: 'K', stitch: false, out: 0.5 }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
