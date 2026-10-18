// forge/hand/soft3d/shopping-cart.mjs — the common cart: hooked handle on the left, a wide open basket (far wall seen from inside, front face with rim and slats) and two wheels, instead of the generated closed cardboard-box block that lost the handle.
import { BASE, COLORS as C } from '../../styles/_soft3d-tune.mjs'

// ---- a tiny hand toolkit that paints the style's own recipe (contact shadow, lower wall, face + curvature gradient,
// lit / shaded bevel strokes, raised parts with a little occlusion) for front-facing slabs
const f = n => { const v = Math.round(n * 100) / 100; return String(Object.is(v, -0) ? 0 : v) }
const col = (r, hex) => `var(--with-soft3d-${r}, ${hex || BASE[r]})`
// a shape is a list of segments; coordinates come in pairs (M L Q C) or A rx ry rot large sweep x y; no H / V
const dd = (S, dx = 0, dy = 0) => S.map(([c, ...a]) => c === 'Z' ? 'Z' : c === 'A'
  ? 'A' + [f(a[0]), f(a[1]), a[2], a[3], a[4], f(a[5] + dx), f(a[6] + dy)].join(' ')
  : c + a.map((v, i) => f(v + (i % 2 ? dy : dx))).join(' ')).join('')
const rr = (x, y, w, h, r) => {
  const [a, b, c, e] = Array.isArray(r) ? r : [r, r, r, r]
  const s = [['M', x + a, y], ['L', x + w - b, y]]
  if (b) s.push(['A', b, b, 0, 0, 1, x + w, y + b])
  s.push(['L', x + w, y + h - c])
  if (c) s.push(['A', c, c, 0, 0, 1, x + w - c, y + h])
  s.push(['L', x + e, y + h])
  if (e) s.push(['A', e, e, 0, 0, 1, x, y + h - e])
  s.push(['L', x, y + a])
  if (a) s.push(['A', a, a, 0, 0, 1, x + a, y])
  s.push(['Z'])
  return s
}
const disc = (cx, cy, r) => [['M', cx - r, cy], ['A', r, r, 0, 1, 0, cx + r, cy], ['A', r, r, 0, 1, 0, cx - r, cy], ['Z']]
const towards = (p, q, t) => { const l = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; return [p[0] + (q[0] - p[0]) * t / l, p[1] + (q[1] - p[1]) * t / l] }
// a polygon with rounded corners (radius r, or one per corner)
const rpoly = (pts, r) => {
  const n = pts.length, s = []
  pts.forEach((p, i) => {
    const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n], ri = Array.isArray(r) ? r[i] : r
    const t = Math.min(ri, Math.hypot(p[0] - a[0], p[1] - a[1]) / 2, Math.hypot(p[0] - b[0], p[1] - b[1]) / 2)
    s.push([i ? 'L' : 'M', ...towards(p, a, t)], ['Q', ...p, ...towards(p, b, t)])
  })
  s.push(['Z'])
  return s
}

function kit(name) {
  const out = [], gid = `wg-soft3d-${name}-0`
  const stop = (o, r, op) => ['stop', op === 1 ? { offset: o, 'stop-color': col(r) } : { offset: o, 'stop-color': col(r), 'stop-opacity': op }]
  const defs = ['defs', {}, [['radialGradient', { id: gid, cx: 0.34, cy: 0.26, r: 0.92 },
    [stop(0, 'shine', 0.58), stop(0.38, 'shine', 0.06), stop(0.7, 'shadow', 0), stop(1, 'shadow', 0.26)]]]]
  const put = (d, a, cls) => out.push(['path', { d, ...a, class: cls }])
  const k = {
    // soft elliptical contact shadow on the floor
    ground(cx, cy, rx, ry) {
      const e = (s, op) => put(dd([['M', cx - rx * s, cy], ['A', rx * s, ry * s, 0, 1, 0, cx + rx * s, cy], ['A', rx * s, ry * s, 0, 1, 0, cx - rx * s, cy], ['Z']]), { fill: col('shadow'), 'fill-opacity': op }, 'wm-shadow')
      e(1, 0.06); e(0.8, 0.08); e(0.58, 0.11)
    },
    // a body slab: lower wall, face, curvature gradient. `wall` is the screen drop of the thickness
    slab(S, role, hex, { wall = 0.8, cls = 'wm-k', dy = 0, gloss = true } = {}) {
      if (wall) {
        put(dd(S, 0, dy + wall), { fill: col(role, hex) }, cls)
        put(dd(S, 0, dy + wall), { fill: col('shadow'), 'fill-opacity': 0.32 }, cls)
      }
      put(dd(S, 0, dy), { fill: col(role, hex), 'fill-rule': 'evenodd' }, cls)
      if (gloss) put(dd(S, 0, dy), { fill: `url(#${gid})`, 'fill-rule': 'evenodd' }, cls)
    },
    // a part standing on the face: occlusion, short wall, lifted face
    raise(S, role, hex, { lift = 0.35, cls = 'wm-a', gloss = true } = {}) {
      put(dd(S, 0.12, 0.22), { fill: col('shadow'), 'fill-opacity': 0.26 }, 'wm-k')
      put(dd(S), { fill: col(role, hex) }, cls)
      put(dd(S), { fill: col('shadow'), 'fill-opacity': 0.34 }, cls)
      put(dd(S, 0, -lift), { fill: col(role, hex), 'fill-rule': 'evenodd' }, cls)
      if (gloss) put(dd(S, 0, -lift), { fill: `url(#${gid})`, 'fill-rule': 'evenodd' }, cls)
    },
    // flat paint over a shape (a recess, a tone)
    tone(S, role, op, { cls = 'wm-k', hex, dy = 0 } = {}) { put(dd(S, 0, dy), { fill: col(role, hex), 'fill-opacity': op }, cls) },
    // strokes: lit edge (shine) and shaded edge (shadow)
    lit(S, op = 0.5, w = 0.57, cls = 'wm-shine') { put(dd(S), { fill: 'none', stroke: col('shine'), 'stroke-width': w, 'stroke-opacity': op, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, cls) },
    dark(S, op = 0.4, w = 0.57, cls = 'wm-k') { put(dd(S), { fill: 'none', stroke: col('shadow'), 'stroke-width': w, 'stroke-opacity': op, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, cls) },
    // bevel of a rounded rectangle at its face offset dy: lit on the upper left, shaded on the lower right
    bevel(x, y, w, h, r, dy = 0, { i = 0.3, cls = 'wm-k', sw = 0.57 } = {}) {
      const [a, b, c, e] = Array.isArray(r) ? r : [r, r, r, r], ri = v => Math.max(0.2, v - i)
      const X0 = x + i, X1 = x + w - i, Y0 = y + i + dy, Y1 = y + h - i + dy
      k.lit([['M', X0, Y1 - e], ['L', X0, Y0 + a], ['A', ri(a), ri(a), 0, 0, 1, x + a, Y0]], 0.38, sw, cls === 'wm-a' ? 'wm-a' : 'wm-shine')
      k.lit([['M', x + a, Y0], ['L', x + w - b, Y0]], 0.57, sw, cls === 'wm-a' ? 'wm-a' : 'wm-shine')
      k.dark([['M', x + w - b, Y0], ['A', ri(b), ri(b), 0, 0, 1, X1, y + b + dy], ['L', X1, Y1 - c], ['A', ri(c), ri(c), 0, 0, 1, x + w - c, Y1], ['L', x + e, Y1]], 0.41, sw, cls)
    },
    // a round-capped stroke in a role colour (a frame, a handle)
    stroke(S, role, hex, w, op = 1, cls = 'wm-k') { put(dd(S), { fill: 'none', stroke: col(role, hex), 'stroke-width': w, ...(op < 1 ? { 'stroke-opacity': op } : {}), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cls) },
    nodes: () => [defs, ...out],
  }
  return k
}

export default function render() {
  const k = kit('shopping-cart')
  k.ground(12, 21.3, 9.6, 1.05)
  // the frame: a hooked handle running down the left to the chassis rail under the basket
  const FRAME = [['M', 2.6, 3.8], ['L', 4.3, 3.8], ['L', 7.4, 15.4], ['L', 18.2, 15.4]]
  k.stroke(FRAME, 'c4', C.grey, 2.1)
  k.stroke(FRAME.map(([c, x, y]) => [c, x - 0.25, y - 0.3]), 'shine', null, 0.5, 0.45, 'wm-shine')
  // wheel stems and the two wheels (dark tyres, silver hubs)
  k.stroke([['M', 8.7, 15.4], ['L', 8.7, 18.2]], 'c4', C.grey, 1.6)
  k.stroke([['M', 17.1, 15.4], ['L', 17.1, 18.2]], 'c4', C.grey, 1.6)
  for (const cx of [8.7, 17.1]) {
    k.slab(disc(cx, 19.2, 1.9), 'ink', null, { wall: 0.3, cls: 'wm-a' })
    k.lit([['M', cx - 1.6, 19.1], ['A', 1.6, 1.6, 0, 0, 1, cx, 17.5]], 0.45, 0.5, 'wm-a')
    k.raise(disc(cx, 19.1, 0.75), 'c4', C.silver, { lift: 0.2, cls: 'wm-a' })
  }
  // the open basket: the far wall seen from inside, then the wide front face and its rim
  const BACK = rpoly([[5.5, 7.8], [7.2, 5.2], [22.5, 5.2], [20.9, 7.8]], 0.7)
  k.slab(BACK, 'c1', C.orange, { wall: 0, gloss: false })
  k.tone(BACK, 'shadow', 0.38)
  k.lit([['M', 7.4, 5.55], ['L', 22.2, 5.55]], 0.45, 0.5)
  k.dark([['M', 21.7, 5.4], ['L', 20.6, 7.6]], 0.3, 0.5)
  const FR = rpoly([[5.5, 7.8], [20.9, 7.8], [18.4, 14.8], [7.7, 14.8]], [1, 1, 1.6, 1.6])
  k.slab(FR, 'c1', C.orange, { wall: 0.8 })
  // the rim and two slats
  k.tone(rpoly([[5.5, 7.8], [20.9, 7.8], [20.55, 8.8], [5.85, 8.8]], 0.3), 'shine', 0.24)
  k.lit([['M', 6, 7.95], ['L', 20.4, 7.95]], 0.6, 0.55)
  k.dark([['M', 6.9, 10.9], ['L', 19.6, 10.9]], 0.24, 0.5)
  k.lit([['M', 6.9, 11.45], ['L', 19.5, 11.45]], 0.12, 0.4)
  k.dark([['M', 7.4, 13.2], ['L', 18.9, 13.2]], 0.24, 0.5)
  k.lit([['M', 7.4, 13.75], ['L', 18.8, 13.75]], 0.1, 0.4)
  k.lit([['M', 5.8, 8.9], ['L', 7.8, 14.2]], 0.35, 0.5)
  k.dark([['M', 20.6, 8.9], ['L', 18.4, 14.6], ['L', 8.2, 14.6]], 0.38, 0.55)
  return k.nodes()
}
