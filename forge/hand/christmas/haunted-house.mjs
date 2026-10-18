// forge/hand/christmas/haunted-house.mjs - the common single-gable house: pine walls, a cranberry roof under a snow
// cap, a round gold window in the gable, an arched red door and a gold crescent moon
import { C, num } from '../../styles/_christmas-core.mjs'
import { parsePath, resample } from '../../kernel/geom.mjs'

const N = 'haunted-house'
const id = k => `wg-christmas-${N}-${k}`, url = k => `url(#${id(k)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = (a, b) => `${num(a)} ${num(b)}`
const sparkle = (x, y, r) => { const q = r * 0.22; return `M${P(x, y - r)}Q${P(x + q, y - q)} ${P(x + r, y)}Q${P(x + q, y + q)} ${P(x, y + r)}Q${P(x - q, y + q)} ${P(x - r, y)}Q${P(x - q, y - q)} ${P(x, y - r)}z` }
const smooth = pts => {
  const n = pts.length, g = i => pts[(i + n) % n], t = 1 / 6
  let d = 'M' + P(...pts[0])
  for (let i = 0; i < n; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2)
    d += 'C' + P(p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t) + ' ' + P(p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t) + ' ' + P(...p2)
  }
  return d + 'Z'
}
// snow cap along an open edge: thick in the middle, thinning to nothing at both ends
function snowCap(edgeD, up, dn) {
  const pts = resample(parsePath(edgeD, 0.05)[0].pts, 0.5).map(o => o.p)
  const m = pts.length - 1, A = [], B = [], B2 = []
  pts.forEach((p, k) => {
    const a = pts[Math.max(0, k - 3)], b = pts[Math.min(m, k + 3)], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L
    const s = Math.pow(Math.max(0, Math.sin(Math.PI * k / m)), 0.5)
    A.push([p[0] + nx * up * s, p[1] + ny * up * s])
    B.push([p[0] - nx * dn * s, p[1] - ny * dn * s])
    B2.push([p[0] - nx * (dn + 0.4) * s, p[1] - ny * (dn + 0.4) * s])
  })
  const inner = a => a.slice(1, m)
  return { cap: smooth([...A, ...inner(B).reverse()]), shadow: smooth([...inner(B), ...inner(B2).reverse()]) }
}

const WALLS = 'M5.2 12.2L12 6L18.8 12.2V19A2 2 0 0 1 16.8 21H7.2A2 2 0 0 1 5.2 19Z'
const ROOF = 'M2.2 11.7L12 3.2L21.8 11.7L19.9 13.5L12 6.9L4.1 13.5Z'
const DOOR = 'M9.7 21V17.9A2.3 2.3 0 0 1 14.3 17.9V21Z'
const MOON = 'M22 5.1A2.4 2.4 0 1 1 19.1 1.6A1.9 1.9 0 0 0 22 5.1Z'
const WIN = 'M13.8 10.3a1.8 1.8 0 1 1-3.6 0a1.8 1.8 0 1 1 3.6 0z'

export default function render() {
  const s = snowCap('M2.8 11.1L12 3.25L21.2 11.1', 1.25, 0.9)
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 3, x2: 16, y2: 22, gradientUnits: 'userSpaceOnUse' }, [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2, x2: 0, y2: 6, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: WALLS, fill: C.c2, stroke: C.ink, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: DOOR, fill: C.c1, stroke: C.ink, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['circle', { cx: 13.1, cy: 19.1, r: 0.4, fill: C.c3, class: 'wm-k' }],
    ['path', { d: WIN, fill: C.c3, stroke: C.ink, 'stroke-width': 0.5, class: 'wm-k' }],
    ['path', { d: 'M12 8.5v3.6M10.2 10.3h3.6', stroke: C.ink, 'stroke-width': 0.45, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: ROOF, fill: C.c1, stroke: C.ink, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: WALLS + ROOF, fill: url(0), 'fill-rule': 'evenodd', class: 'wm-shine' }],
    ['path', { d: s.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: s.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: MOON, fill: C.c3, stroke: C.ink, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: sparkle(3.6, 4.4, 1.35), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
