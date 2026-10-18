// forge/hand/christmas/share.mjs — three plain cranberry nodes joined by two sturdy links (a real share graph), with
// one snow cap on the top node: the generated drawing hung glossy red balls on hair-thin stems with snow and holly on
// top, so the graph read as a bunch of cherries.
import { C, U } from '../../styles/_christmas-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const P = p => `${r2(p[0])} ${r2(p[1])}`
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
function cap(samples, up, dn, drip = () => 0) {
  const m = samples.length - 1, U1 = [], L1 = [], L2 = []
  samples.forEach(([x, y, nx, ny], k) => {
    const s = Math.pow(Math.sin(Math.PI * k / m), 0.55), lo = dn * s + drip(x, y) * s
    U1.push([x + nx * up * s, y + ny * up * s])
    L1.push([x - nx * lo, y - ny * lo])
    L2.push([x - nx * (lo + 0.42 * s), y - ny * (lo + 0.42 * s)])
  })
  const inner = a => a.slice(1, m)
  return { cap: smooth([...U1, ...inner(L1).reverse()]), shadow: smooth([...inner(L1), ...inner(L2).reverse()]) }
}
const disc = (cx, cy, r) => `M${r2(cx - r)} ${r2(cy)}a${r2(r)} ${r2(r)} 0 1 0 ${r2(2 * r)} 0a${r2(r)} ${r2(r)} 0 1 0 ${r2(-2 * r)} 0z`
// the style's holly sprig: two wavy leaves, three berries, one glint
function holly(x, y, s) {
  const leaf = dir => {
    const a = dir > 0 ? -0.32 : Math.PI + 0.32, ca = Math.cos(a), sa = Math.sin(a), L = 2.05 * s, W = 0.62 * s
    const p0 = [x + ca * 0.25 * s, y + sa * 0.25 * s], tip = [x + ca * L, y + sa * L], nx = -sa, ny = ca
    const pt = (t, side) => { const w = W * Math.sin(Math.PI * t) * (1 + 0.28 * Math.cos(t * Math.PI * 4)); return [p0[0] + (tip[0] - p0[0]) * t + nx * w * side, p0[1] + (tip[1] - p0[1]) * t + ny * w * side] }
    const pts = []
    for (let k = 0; k <= 8; k++) pts.push(pt(k / 8, 1))
    for (let k = 7; k >= 1; k--) pts.push(pt(k / 8, -1))
    return 'M' + pts.map(P).join('L') + 'Z'
  }
  const b = 0.46 * s
  return [
    ['path', { d: leaf(1) + leaf(-1), fill: C.c2, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: disc(x - 0.42 * s, y + 0.18 * s, b) + disc(x + 0.42 * s, y + 0.18 * s, b) + disc(x, y - 0.42 * s, b), fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: 'wm-deco' }],
    ['path', { d: disc(x - 0.12 * s, y - 0.58 * s, 0.13 * s), fill: C.shine, class: 'wm-deco' }],
  ]
}
const sparkle = (x, y, r) => { const q = r * 0.22; return `M${P([x, y - r])}Q${P([x + q, y - q])} ${P([x + r, y])}Q${P([x + q, y + q])} ${P([x, y + r])}Q${P([x - q, y + q])} ${P([x - r, y])}Q${P([x - q, y - q])} ${P([x, y - r])}z` }

// a link between two node centres, w half-width (its ends hide under the nodes)
function link(a, b, w) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), nx = -dy / l * w, ny = dx / l * w
  return 'M' + [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]].map(P).join('L') + 'Z'
}

export default function render() {
  const id = n => `wg-christmas-share-${n}`, url = n => `url(#${id(n)})`
  const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
  const ink = { stroke: C.ink, 'stroke-width': U.INK, 'stroke-linejoin': 'round' }
  const L = [6.5, 12], T = [17.5, 5.5], B = [17.5, 18.5], R = 3.1
  const LINKS = link(L, T, 1.05) + link(L, B, 1.05)
  const NODES = disc(...L, R) + disc(...T, R) + disc(...B, R)
  const pts = []
  for (let k = 0; k <= 12; k++) { const a = (203 + 134 * k / 12) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); pts.push([T[0] + R * c, T[1] + R * s, c, s]) }
  const sn = cap(pts, 1.3, 1, x => 0.55 * Math.max(0, 1 - Math.abs(x - 16.2) / 0.75))
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3.4, y1: 2.4, x2: 13.3, y2: 21.6, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1, x2: 0, y2: 4.4, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: LINKS, fill: C.c1, ...ink, class: 'wm-k' }],
    ['path', { d: LINKS, fill: url(0), class: 'wm-shine' }],
    ['path', { d: NODES, fill: C.c1, ...ink, class: 'wm-k' }],
    ['path', { d: NODES, fill: url(0), class: 'wm-shine' }],
    ['path', { d: sn.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: sn.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: sparkle(5.6, 4.9, 1.45), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
