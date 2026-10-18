// forge/hand/plush/avatar-tiger.mjs: a tiger-cub face: round orange ears with cream insides, a wide orange face with
// three ink forehead stripes, two ink cheek stripes a side, a cream muzzle with a bubblegum nose and an embroidered
// mouth, and knot eyes (the blink part).
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const face = P.ellipse(12, 14, 7.9, 6.6)
  const inFace = f => P.clip(f, face)
  const stripes = P.unite(
    P.lens(12, 7.7, 12, 11.3, 0.95),
    P.lens(8.6, 8.9, 9.9, 11.3, 0.8),
    P.lens(15.4, 8.9, 14.1, 11.3, 0.8),
    inFace(P.lens(3.8, 13.1, 7.4, 13.5, 0.8)),
    inFace(P.lens(4.1, 16.3, 7.3, 15.7, 0.75)),
    inFace(P.lens(20.2, 13.1, 16.6, 13.5, 0.8)),
    inFace(P.lens(19.9, 16.3, 16.7, 15.7, 0.75)),
  )
  const K = { part: 'K' }
  const pieces = [
    P.felt('c1', P.circle(6.3, 8.4, 2.7), K),
    P.felt('c1', P.circle(17.7, 8.4, 2.7), K),
    P.felt('tint', P.circle(6.4, 8.6, 1.15), { ...K, stitch: false, out: 0.4, shade: false, hi: false }),
    P.felt('tint', P.circle(17.6, 8.6, 1.15), { ...K, stitch: false, out: 0.4, shade: false, hi: false }),
    P.felt('c1', face, K),
    P.flat('ink', stripes, { ...K, op: 0.92 }),
    P.felt('tint', P.unite(P.ellipse(10.5, 17.5, 2.3, 1.9), P.ellipse(13.5, 17.5, 2.3, 1.9)), { ...K, stitch: false, out: 0.45 }),
    P.felt('accent', P.poly([[10.6, 15.2], [13.4, 15.2], [12, 16.8]], 0.5), { ...K, stitch: false, out: 0.4, shade: false, hi: false }),
    P.thread(['M12 16.8 V17.6', 'M12 17.6 C11.6 18.5 10.5 18.6 9.9 18.1', 'M12 17.6 C12.4 18.5 13.5 18.6 14.1 18.1'].flatMap(d => P.linesOf(d)), { w: 0.6, role: 'ink', ...K }),
    P.knot(8.9, 12.6, 0.85, 'ink', { part: 'A' }),
    P.knot(15.1, 12.6, 0.85, 'ink', { part: 'A' }),
    P.knot(9.2, 12.3, 0.28, 'shine', { part: 'A', op: 0.95 }),
    P.knot(15.4, 12.3, 0.28, 'shine', { part: 'A', op: 0.95 }),
  ]
  const nodes = compose(restoreParts(pieces, icon), icon)
  // c1 here is a tiger orange, not the scheme's tomato
  return JSON.parse(JSON.stringify(nodes).replace(/var\(--with-plush-c1, #F4695E\)/g, 'var(--with-plush-c1, #FF9A3D)'))
}
