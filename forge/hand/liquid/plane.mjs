// forge/hand/liquid/plane.mjs — an airliner flying up-right: swept wings and tailplane in clear glass, with a rounded
// coloured-glass fuselage laid over them from nose to tail. The generator grew the one-piece outline into a single
// pale clear slab, so the plane had no internal contrast and its thin tail tips blurred into the wings at 16px. Here
// the fuselage is a 4.2u c2 glass capsule crossing the clear wings (one glass piece over another), which gives the
// silhouette a dark spine and keeps nose, wings and tail apart at small sizes. Same model and paint as the generator
// (_liquid-core.mjs build); only the geometry is drawn here, in a nose-up frame rotated 45 degrees and baked.
import { circle } from '../../kernel/geom.mjs'
import { setOf, unionSets, erode, dilate, normalize, strokeSet } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const fill = set => ({ d: '', subs: set.map(r => ({ pts: r, closed: true })), set })
// nose-up local frame (origin = plane centre) -> the 24 grid, nose to the top-right
const C = Math.SQRT1_2 * 1.06, OX = 13.25, OY = 10.75
const put = ([x, y]) => [OX + (x - y) * C, OY + (x + y) * C]
const mirror = pts => [...pts, ...pts.slice().reverse().map(([x, y]) => [-x, y])]

// right half outlines, root to tip and back (mirrored for the left half)
const WING = [[1.6, -4.4], [10.3, 0.3], [10.7, 0.9], [10.7, 2.4], [10.2, 2.9], [1.6, 1.2]]
const TAIL = [[1.2, 5.0], [5.1, 7.5], [5.4, 8.0], [5.4, 9.2], [5.0, 9.6], [1.2, 8.9]]

function skeleton(name) {
  // convex tips rounded a touch (shrink, then grow back)
  const soft = ring => dilate(erode(setOf([ring]), 0.35), 0.35)
  const wings = unionSets([soft(mirror(WING).map(put)), soft(mirror(TAIL).map(put))])
  // fuselage: a capsule from the nose (r 2.1) tapering to the tail cone (r 1.3)
  const axis = []
  for (let i = 0; i <= 16; i++) axis.push([0, -8 + i * (17.6 / 16)])
  const body = unionSets([
    normalize(circle(...put([0, -8]), 2.1, 0.15)),
    normalize(circle(...put([0, 9.6]), 1.3, 0.15)),
    setOf([[[-2.1, -8], [2.1, -8], [1.3, 9.6], [-1.3, 9.6]].map(put)]),
  ])
  // tubes: the wings' and tail's medial lines (closed there-and-back, so they are glass, not grooves) and the axis
  const med = (a, b) => ({ pts: [put(a), put(b)], closed: true, plate: 'K' })
  return {
    name, paths: [], cutouts: [],
    fills: [fill(wings), fill(body)],
    lines: [
      { pts: axis.slice(1, -1).map(put), closed: false, plate: 'A' },
      med([0, -1.6], [7.8, 0.55]), med([0, -1.6], [-7.8, 0.55]), med([0, 7.3], [2.6, 7.6]), med([0, 7.3], [-2.6, 7.6]),
    ],
  }
}

export default function render(icon) {
  const out = build(skeleton((icon && icon.name) || 'plane'))
  // a little denser clear glass (generator 0.14 / 0.36 / 0.62) so the pale wings hold their edge on white
  const defs = out && out[0] && out[0][0] === 'defs' ? out[0][2] : []
  const g0 = defs.find(g => /-0$/.test(g[1].id))
  if (g0) g0[2] = g0[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': [0.22, 0.44, 0.7][i] }])
  return out
}
