// forge/hand/christmas/save.mjs — a cranberry floppy disk with a gold metal shutter (ink slot), a snow-cream label and
// a snow cap with holly along its top: the generated drawing painted the whole floppy pale cream with cream parts, so
// it had almost no contrast on white and the shutter and label barely separated from the body.
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

const BODY = 'M5 3H15.6Q16 3 16.28 3.28L20.72 7.72Q21 8 21 8.4V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3Z'
const SHUTTER = 'M7.5 3V6.5A1.5 1.5 0 0 0 9 8H13A1.5 1.5 0 0 0 14.5 6.5V3Z'
const SLOT = 'M11.3 4.3H13V6.2A.5 .5 0 0 1 12.5 6.7H11.8A.5 .5 0 0 1 11.3 6.2Z'
const LABEL = 'M6.5 21V15A1.5 1.5 0 0 1 8 13.5H16A1.5 1.5 0 0 1 17.5 15V21Z'
const RULES = 'M8.75 16.5H15.25M8.75 18.75H15.25'

function snow() {
  const pts = []
  for (let k = 0; k <= 20; k++) {
    const x = 3.35 + (16.75 - 3.35) * k / 20
    if (x < 5) { const y = 5 - Math.sqrt(4 - (5 - x) * (5 - x)); pts.push([x, y, (x - 5) / 2, (y - 5) / 2]) }
    else if (x > 16) pts.push([x, 3 + (x - 16), 0.71, -0.71])
    else pts.push([x, 3, 0, -1])
  }
  return cap(pts, 1.4, 0.85, x => 0.85 * Math.max(0, 1 - Math.abs(x - 5.35) / 0.95) + 0.45 * Math.max(0, 1 - Math.abs(x - 13.6) / 0.8))
}

export default function render() {
  const id = n => `wg-christmas-save-${n}`, url = n => `url(#${id(n)})`
  const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
  const ink = { stroke: C.ink, 'stroke-width': U.INK, 'stroke-linejoin': 'round' }
  const sn = snow()
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 3, x2: 12.9, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1.5, x2: 0, y2: 4.6, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(2), x1: 6.5, y1: 13.5, x2: 12.55, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0.3, C.tint, 0), st(1, C.tint, 0.75)]],
    ]],
    ['path', { d: BODY, fill: C.c1, ...ink, class: 'wm-k' }],
    ['path', { d: BODY, fill: url(0), class: 'wm-shine' }],
    ['path', { d: SHUTTER, fill: C.c3, ...ink, class: 'wm-a' }],
    ['path', { d: SHUTTER, fill: url(0), class: 'wm-a' }],
    ['path', { d: SLOT, fill: C.ink, class: 'wm-a' }],
    ['path', { d: LABEL, fill: C.c4, ...ink, class: 'wm-a' }],
    ['path', { d: LABEL, fill: url(2), class: 'wm-a' }],
    ['path', { d: RULES, fill: 'none', stroke: C.ink, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-opacity': 0.35, class: 'wm-a' }],
    ['path', { d: sn.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: sn.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(9.9, 2.75, 1.2),
    ['path', { d: sparkle(20.6, 3.2, 1.45), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
