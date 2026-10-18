// forge/hand/christmas/eraser.mjs — tilted eraser block: red rubbing end, cream body, green sleeve, thin snowy line below with crumbs.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), C2 = V('c2', '#1F6E46'), C3 = V('c3', '#E2A93B'), C4 = V('c4', '#FFF5E6')
const SHINE = V('shine', '#FFFFFF'), SHADOW = V('shadow', '#4A0716')
const K = { stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const f = n => +n.toFixed(2)
const grad = (id, y1, y2) => ['defs', {}, [
  ['linearGradient', { id, x1: 0, y1, x2: 0, y2, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.3 }],
    ['stop', { offset: 0.45, 'stop-color': SHINE, 'stop-opacity': 0 }],
    ['stop', { offset: 0.6, 'stop-color': SHADOW, 'stop-opacity': 0 }],
    ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.38 }],
  ]],
]]
const spark = (x, y, r) => ['path', { d: `M${x} ${f(y - r)}Q${x} ${y} ${f(x + r)} ${y}Q${x} ${y} ${x} ${f(y + r)}Q${x} ${y} ${f(x - r)} ${y}Q${x} ${y} ${x} ${f(y - r)}Z`, fill: C3, stroke: INK, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-deco' }]

// local frame: u along the block (towards the upper right), v across it
const D = 40 * Math.PI / 180, ux = Math.cos(D), uy = -Math.sin(D), vx = -uy, vy = ux
const P = (u, v) => [12.3 + u * ux + v * vx, 11.2 + u * uy + v * vy]
// polygon with a corner radius per vertex
const rp = (pts, rs) => {
  const n = pts.length
  let d = ''
  for (let i = 0; i < n; i++) {
    const [x, y] = pts[i], [px, py] = pts[(i + n - 1) % n], [nx, ny] = pts[(i + 1) % n]
    const r = rs[i]
    const l1 = Math.hypot(px - x, py - y), l2 = Math.hypot(nx - x, ny - y)
    const a = [x + (px - x) / l1 * r, y + (py - y) / l1 * r], b = [x + (nx - x) / l2 * r, y + (ny - y) / l2 * r]
    d += `${i ? 'L' : 'M'}${f(a[0])} ${f(a[1])}Q${f(x)} ${f(y)} ${f(b[0])} ${f(b[1])}`
  }
  return d + 'Z'
}
const seg = (u0, u1, r0, r1) => rp([P(u0, -4.2), P(u1, -4.2), P(u1, 4.2), P(u0, 4.2)], [r0, r1, r1, r0])

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  const red = seg(-8.6, -3.4, 1.1, 0.1), mid = seg(-3.4, 3.2, 0.1, 0.1), green = seg(3.2, 8.6, 0.1, 1.1)
  const all = seg(-8.6, 8.6, 1.1, 1.1)
  return [
    grad(id(0), 2, 20),
    ['path', { d: 'M3.2 21L13.6 21', stroke: INK, 'stroke-width': 1.7, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M3.2 21L13.6 21', stroke: C4, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: mid, fill: C4, ...K, class: 'wm-a' }],
    ['path', { d: red, fill: C1, ...K, class: 'wm-a' }],
    ['path', { d: green, fill: C2, ...K, class: 'wm-a' }],
    ['path', { d: all, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['circle', { cx: 16.6, cy: 21, r: 0.6, fill: C1, class: 'wm-deco' }],
    ['circle', { cx: 19.4, cy: 21, r: 0.45, fill: C1, class: 'wm-deco' }],
    spark(4.2, 4.6, 1.6),
  ]
}
