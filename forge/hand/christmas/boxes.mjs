// forge/hand/christmas/boxes.mjs — three clean isometric cubes (two gold on the floor, a cranberry one on top with a
// snow drift and holly), each a solid block with a lit top, a shaded right face and fine ink edges: the generated
// drawing split every face apart with gaps and scattered snow over the corners, so the stack muddied into a cluster.
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'boxes'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = p => `${num(p[0])} ${num(p[1])}`
const poly = pts => 'M' + pts.map(P).join('L') + 'Z'
const disc = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
const sparkle = (x, y, r) => { const q = r * 0.22; return `M${num(x)} ${num(y - r)}Q${num(x + q)} ${num(y - q)} ${num(x + r)} ${num(y)}Q${num(x + q)} ${num(y + q)} ${num(x)} ${num(y + r)}Q${num(x - q)} ${num(y + q)} ${num(x - r)} ${num(y)}Q${num(x - q)} ${num(y - q)} ${num(x)} ${num(y - r)}z` }
function smooth(pts) {
  const n = pts.length, g = i => pts[(i + n) % n]
  let d = 'M' + P(pts[0])
  for (let i = 0; i < n; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2), t = 1 / 6
    d += 'C' + P([p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t]) + ' ' +
      P([p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t]) + ' ' + P(p2)
  }
  return d + 'Z'
}
function holly(x, y, s, cls) {
  const leaf = dir => {
    const a = dir > 0 ? -0.32 : Math.PI + 0.32, ca = Math.cos(a), sa = Math.sin(a), L = 2.05 * s, W = 0.62 * s
    const p0 = [x + ca * 0.25 * s, y + sa * 0.25 * s], tip = [x + ca * L, y + sa * L], nx = -sa, ny = ca
    const pt = (t, side) => { const w = W * Math.sin(Math.PI * t) * (1 + 0.28 * Math.cos(t * Math.PI * 4)); return [p0[0] + (tip[0] - p0[0]) * t + nx * w * side, p0[1] + (tip[1] - p0[1]) * t + ny * w * side] }
    const pts = []
    for (let k = 0; k <= 8; k++) pts.push(pt(k / 8, 1))
    for (let k = 7; k >= 1; k--) pts.push(pt(k / 8, -1))
    return poly(pts)
  }
  const b = 0.46 * s
  return [
    ['path', { d: leaf(1) + leaf(-1), fill: C.c2, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: cls }],
    ['path', { d: disc(x - 0.42 * s, y + 0.18 * s, b) + disc(x + 0.42 * s, y + 0.18 * s, b) + disc(x, y - 0.42 * s, b), fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: cls }],
    ['path', { d: disc(x - 0.12 * s, y - 0.58 * s, 0.13 * s), fill: C.shine, class: cls }],
  ]
}

// an isometric cube from its top vertex: half-width W, rise H, wall V
const W = 4.5, H = 2.6, V = 5.2
function cube(x, y) {
  const T = [x, y], R = [x + W, y + H], RB = [x + W, y + H + V], B = [x, y + 2 * H + V], LB = [x - W, y + H + V], L = [x - W, y + H], M = [x, y + 2 * H]
  return {
    out: poly([T, R, RB, B, LB, L]),
    top: poly([T, R, M, L]),
    right: poly([M, R, RB, B]),
    edges: `M${P(L)}L${P(M)}L${P(R)}M${P(M)}L${P(B)}`,
  }
}

export default function render() {
  const ink = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
  const edge = { stroke: C.ink, 'stroke-width': 0.45, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  const y0 = 3.5
  const top = cube(12, y0), bl = cube(12 - W, y0 + H + V), br = cube(12 + W, y0 + H + V)
  const lit = [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]
  // the drift on the top cube's lid: covers the lid, spills over both front edges with one drip each
  const ey = x => x <= 12 ? y0 + H + (x - (12 - W)) * (H / W) : y0 + 2 * H - (x - 12) * (H / W)
  const lower = [[16.75, 0.55], [15.6, 0.85], [14.95, 0.9], [14.75, 1.55], [14.3, 1.75], [13.9, 1.3], [12.9, 0.9], [12, 0.88],
    [11.1, 0.9], [10.2, 0.95], [9.85, 1.6], [9.4, 1.8], [9.0, 1.45], [8.5, 0.85], [7.25, 0.55]].map(([x, d]) => [x, ey(Math.max(12 - W, Math.min(12 + W, x))) + d])
  const upper = [[7.2, y0 + H - 0.05], [8.7, y0 + 1.15], [10.4, y0 - 0.25], [12, y0 - 1.15], [13.6, y0 - 0.25], [15.3, y0 + 1.15], [16.8, y0 + H - 0.05]]
  const SNOW = smooth([...upper, ...lower])
  const SNOW_SH = smooth([...upper, ...lower].map(([x, y]) => [x, y + 0.45]))
  const bottoms = bl.out + br.out
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: y0 + H + V, x2: 13.5, y2: 23.5, gradientUnits: 'userSpaceOnUse' }, lit],
      ['linearGradient', { id: id(1), x1: 7.5, y1: y0, x2: 14.5, y2: y0 + 2 * H + V + 1, gradientUnits: 'userSpaceOnUse' }, lit],
      ['linearGradient', { id: id(2), x1: 0, y1: y0 - 1.2, x2: 0, y2: y0 + 2 * H + 1.8, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    // the two floor cubes
    ['path', { d: bottoms, fill: C.c3, ...ink, class: 'wm-k' }],
    ['path', { d: bl.top + br.top, fill: C.shine, 'fill-opacity': 0.32, class: 'wm-k' }],
    ['path', { d: bl.right + br.right, fill: C.shadow, 'fill-opacity': 0.26, class: 'wm-k' }],
    ['path', { d: bottoms, fill: url(0), class: 'wm-shine' }],
    ['path', { d: bl.edges + br.edges, ...edge, class: 'wm-k' }],
    ['path', { d: bottoms, ...ink, class: 'wm-k' }],
    // the top cube with its snow and holly (moves as one part)
    ['path', { d: top.out, fill: C.c1, ...ink, class: 'wm-a' }],
    ['path', { d: top.top, fill: C.shine, 'fill-opacity': 0.28, class: 'wm-a' }],
    ['path', { d: top.right, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-a' }],
    ['path', { d: top.out, fill: url(1), class: 'wm-a wm-shine' }],
    ['path', { d: top.edges, ...edge, class: 'wm-a' }],
    ['path', { d: top.out, ...ink, class: 'wm-a' }],
    ['path', { d: SNOW_SH, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-a' }],
    ['path', { d: SNOW, fill: url(2), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ...holly(13.4, y0 - 0.6, 1.15, 'wm-a'),
    ['path', { d: sparkle(20.6, 3.2, 1.5), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
