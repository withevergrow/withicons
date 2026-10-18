// forge/hand/christmas/bell-off.mjs — the gold sleigh bell (crown loop, flared lip, hanging clapper) cut by a bold
// crimson slash with a clean gap on each side. Snow on the crown and the holly sprig sit far from the slash.
// Roles: bell + clapper c3, slash c1, snow shine->tint. Motion: clapper wm-a (sways about 12,4.5), slash wm-s.
import { C, num } from '../../styles/_christmas-core.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { setOf, differenceSets } from '../../kernel/bool.mjs'

const NAME = 'bell-off'
const id = n => `wg-christmas-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const P = (a, b) => `${num(a)} ${num(b)}`
const poly = pts => 'M' + pts.map(([x, y]) => P(x, y)).join('L') + 'Z'
const discD = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
function capsule(x1, y1, x2, y2, h) {
  const L = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / L * h, ny = (x2 - x1) / L * h
  return `M${P(x1 + nx, y1 + ny)}L${P(x2 + nx, y2 + ny)}A${num(h)} ${num(h)} 0 0 0 ${P(x2 - nx, y2 - ny)}L${P(x1 - nx, y1 - ny)}A${num(h)} ${num(h)} 0 0 0 ${P(x1 + nx, y1 + ny)}Z`
}
function snow(xa, xb, top, { up = 1.2, dn = 0.8, drips = [] } = {}) {
  const n = 28, U = [], L = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = xa + (xb - xa) * t, e = Math.pow(Math.sin(Math.PI * t), 0.45)
    let d = dn * e * (1 + 0.14 * Math.sin(x * 2.3))
    for (const [cx, w, l] of drips) { const u = (x - cx) / w; if (Math.abs(u) < 1) d = Math.max(d, (dn + l * Math.sqrt(1 - u * u)) * e) }
    U.push([x, top(x) - up * e * (1 + 0.08 * Math.sin(x * 1.5))]); L.push([x, top(x) + Math.min(d, 2)])
  }
  return [...U, ...L.reverse().slice(1, -1)]
}
function holly(x, y) {
  const leaf = dir => {
    const a = dir > 0 ? -0.32 : Math.PI + 0.32, ca = Math.cos(a), sa = Math.sin(a), L = 2.05, W = 0.62
    const p0 = [x + ca * 0.25, y + sa * 0.25], tip = [x + ca * L, y + sa * L]
    const pt = (t, s) => { const w = W * Math.sin(Math.PI * t) * (1 + 0.28 * Math.cos(t * Math.PI * 4)); return [p0[0] + (tip[0] - p0[0]) * t - sa * w * s, p0[1] + (tip[1] - p0[1]) * t + ca * w * s] }
    const pts = []
    for (let k = 0; k <= 8; k++) pts.push(pt(k / 8, 1))
    for (let k = 7; k >= 1; k--) pts.push(pt(k / 8, -1))
    return poly(pts)
  }
  return [
    ['path', { d: leaf(1) + leaf(-1), fill: C.c2, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: discD(x - 0.42, y + 0.18, 0.46) + discD(x + 0.42, y + 0.18, 0.46) + discD(x, y - 0.42, 0.46), fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: 'wm-deco' }],
    ['path', { d: discD(x - 0.12, y - 0.58, 0.13), fill: C.shine, class: 'wm-deco' }],
  ]
}

const BELL = 'M12 4.6C8.2 4.6 6.4 7.5 6.4 10.7V13.4C6.4 15.2 5.2 16.2 3.8 17.4C3.5 17.7 3.7 18.4 4.2 18.4H19.8C20.3 18.4 20.5 17.7 20.2 17.4C18.8 16.2 17.6 15.2 17.6 13.4V10.7C17.6 7.5 15.8 4.6 12 4.6Z'
const CLAPPER = discD(12, 19.9, 1.7)
const SLASH = [3.2, 3.2, 20.8, 20.8], HW = 1.05, GAP = 0.85
// the bell's crown line: y of the dome at x
const domeTop = x => 4.6 + 2.4 * Math.pow(Math.abs(x - 12) / 3.4, 2)

export default function render() {
  const bell = setOf(parsePath(BELL, 0.12).map(s => s.pts))
  const band = setOf(parsePath(capsule(...SLASH, HW + GAP), 0.12).map(s => s.pts))
  const D = setD(differenceSets(bell, band), 0.02)
  const S = capsule(...SLASH, HW)
  const cap = snow(9.7, 14.3, domeTop, { up: 1.2, dn: 0.75, drips: [[13.3, 0.5, 0.55]] })
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 3, x2: 13, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2.6, x2: 0, y2: 6.4, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: CLAPPER, fill: C.c3, ...INK, class: 'wm-a' }],
    ['path', { d: D, fill: C.c3, ...INK, class: 'wm-k' }],
    ['path', { d: CLAPPER, fill: url(0), class: 'wm-shine' }],
    ['path', { d: D, fill: url(0), class: 'wm-shine' }],
    // a glint down the lit shoulder, on the half the slash leaves free
    ['path', { d: 'M13.6 6.7C15.2 7.5 15.8 8.8 15.9 10.4', fill: 'none', stroke: C.shine, 'stroke-width': 1, 'stroke-linecap': 'round', 'stroke-opacity': 0.8, class: 'wm-shine' }],
    ['path', { d: poly(cap.map(([x, y]) => [x, y + 0.36])), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: poly(cap), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(15.8, 5.3),
    ['path', { d: S, fill: C.c1, ...INK, class: 'wm-s' }],
    ['path', { d: S, fill: url(0), class: 'wm-s' }],
  ]
}
