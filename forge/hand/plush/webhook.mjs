// forge/hand/plush/webhook.mjs — the line design's webhook knot: three fat stuffed strands, each leaving a button node
// and hooking round the next one, so the strands interlock instead of closing into a triangle ring.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

const S1 = 'M12 7.5 L13.95 10.88 A3.75 3.75 0 0 0 17.2 12.75 A3.75 3.75 0 0 1 20.95 16.5 A3.75 3.75 0 0 1 17.2 20.25'
const S2 = 'M17.2 16.5 L13.3 16.5 A3.75 3.75 0 0 0 10.05 18.38 A3.75 3.75 0 0 1 4.93 19.75 A3.75 3.75 0 0 1 3.56 14.63'
const S3 = 'M6.8 16.5 L8.75 13.13 A3.75 3.75 0 0 0 8.75 9.38 A3.75 3.75 0 0 1 10.13 4.25 A3.75 3.75 0 0 1 15.25 5.63'

export default function render(icon) {
  const P = ctxOf(icon)
  const strand = (role, d) => P.tube(role, P.linesOf(d)[0], 2.6, { part: 'K', stitch: false })
  const node = (x, y, role) => [
    P.felt(role, P.circle(x, y, 2.6), { part: 'A', stitch: false, out: 0.5 }),
    P.knot(x, y, 0.8, role === 'c2' ? 'ink' : 'tint', { part: 'A' }),
  ]
  const pieces = [
    strand('c3', S1), strand('c1', S2), strand('c4', S3),
    ...node(12, 7.5, 'c3'), ...node(17.2, 16.5, 'c1'), ...node(6.8, 16.5, 'c4'),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
