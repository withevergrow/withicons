// forge/hand/glass/chevrons-down.mjs — two glass chevron rods, each a colour body with a lighter frost in front:
// the generated drawing frosted both rods almost to white and laid an extra frost over the lower one, so at 16px
// they read pale grey. Here the frost is thinner (the colour core shows), the hairline edge is firmer, both rods
// carry the same colour, and a lit rim runs along each rod's upper-left edge.
// Motion: upper chevron wm-k, lower chevron plate A (wm-a, it leads the nudge down).
import { V } from '../../styles/_glass-soft.mjs'

const f = v => +v.toFixed(2)
const P = (p) => `${f(p[0])} ${f(p[1])}`
const unit = (a, b) => { const x = b[0] - a[0], y = b[1] - a[1], l = Math.hypot(x, y); return [x / l, y / l] }
const add = (a, b, s = 1) => [a[0] + b[0] * s, a[1] + b[1] * s]
const cross = (a, b) => a[0] * b[1] - a[1] * b[0]

// outline of a polyline stroked at radius r: round caps, round outer joins, mitred inner joins
function rod(pts, r) {
  const m = pts.length, d = [], n = []
  for (let i = 0; i < m - 1; i++) { const u = unit(pts[i], pts[i + 1]); d.push(u); n.push([-u[1], u[0]]) }
  const side = s => {   // s = +1 / -1: the +n or -n side, walked forwards (s=+1) or backwards (s=-1)
    let out = ''
    const idx = s > 0 ? [...Array(m - 2).keys()].map(i => i + 1) : [...Array(m - 2).keys()].map(i => m - 2 - i)
    for (const i of idx) {
      const a = n[i - 1], b = n[i], c = cross(d[i - 1], d[i])
      const inner = (s > 0) === (c > 0)
      if (inner) {
        const k = r * s / (1 + a[0] * b[0] + a[1] * b[1])
        out += 'L' + P([pts[i][0] + (a[0] + b[0]) * k, pts[i][1] + (a[1] + b[1]) * k])
      } else {
        const from = s > 0 ? a : b, to = s > 0 ? b : a
        out += 'L' + P(add(pts[i], from, r * s)) + `A${f(r)} ${f(r)} 0 0 ${(s > 0) === (c > 0) ? 1 : 0} ` + P(add(pts[i], to, r * s))
      }
    }
    return out
  }
  const last = pts[m - 1], nl = n[m - 2], first = pts[0], nf = n[0]
  return 'M' + P(add(first, nf, r)) + side(1) + 'L' + P(add(last, nl, r)) +
    `A${f(r)} ${f(r)} 0 1 0 ` + P(add(last, nl, -r)) + side(-1) + 'L' + P(add(first, nf, -r)) +
    `A${f(r)} ${f(r)} 0 1 0 ` + P(add(first, nf, r)) + 'Z'
}
const shift = (pts, dx, dy) => pts.map(p => [p[0] + dx, p[1] + dy])

const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

// 7.5u apart vertically (about 5.3u across the 45 degree arms): about 2.3u clear between the front panes
const UP = [[6, 4.75], [12, 10.75], [18, 4.75]]
const LO = [[6, 12.25], [12, 18.25], [18, 12.25]]
const R = 1.5, RB = 1.2, FRONT = -0.5, BACK = 0.35

export default function render(icon) {
  const name = icon.name || 'chevrons-down'
  let n = 0
  const id = () => `wg-glass-${name}-${n++}`
  const defs = [], out = []
  const def = g => { defs.push(g); return `url(#${g[1].id})` }
  const parts = [{ pts: UP, cls: 'wm-k' }, { pts: LO, cls: 'wm-a' }]
  // soft diffuse shadow under both rods
  const sh = parts.map(p => shift(p.pts, BACK, BACK + 0.5))
  out.push(['path', { d: sh.map(q => rod(q, RB + 0.9)).join(''), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: sh.map(q => rod(q, RB + 0.35)).join(''), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])
  // colour bodies behind, down-right, each with a soft orb of accent light
  for (const p of parts) {
    const q = shift(p.pts, BACK, BACK), y0 = q[0][1], d = rod(q, RB)
    const g0 = def(lin(id(), 4.5, y0 - 1.5, 21.5, y0 + 9, [stop(0, V.c1), stop(1, V.shadow)]))
    const g1 = def(rad(id(), 15.8, y0 + 5.6, 5.4, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]))
    out.push(['path', { d, fill: g0, class: p.cls }], ['path', { d, fill: g1, class: p.cls }])
  }
  // frosted panes in front: thinner frost so the colour core reads, a firmer currentColor hairline
  for (const p of parts) {
    const q = shift(p.pts, FRONT, FRONT), y0 = q[0][1]
    const g2 = def(lin(id(), 4, y0 - 1.5, 19.5, y0 + 7.5, [stop(0, V.frost, 0.5), stop(0.4, V.tint, 0.42), stop(1, V.tint, 0.3)]))
    out.push(['path', { d: rod(q, R), fill: g2, stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, class: p.cls }])
  }
  // lit rim: the left cap's top-left and the right arm's upper-left edge
  for (const p of parts) {
    const [a, b, c] = shift(p.pts, FRONT, FRONT), ri = R - 0.42
    const u = unit(b, c), nu = [u[1], -u[0]]    // the right arm's up-left normal
    const s0 = add(add(b, u, 2.3), nu, ri), s1 = add(add(c, u, -0.4), nu, ri)
    const ang = t => [a[0] + ri * Math.cos(t * Math.PI / 180), a[1] + ri * Math.sin(t * Math.PI / 180)]
    const d = 'M' + P(ang(150)) + `A${f(ri)} ${f(ri)} 0 0 1 ` + P(ang(285)) + 'M' + P(s0) + 'L' + P(s1)
    out.push(['path', { d, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: p.cls + ' wm-shine' }])
  }
  return [['defs', {}, defs], ...out]
}
