// forge/hand/christmas/dhak.mjs - a horizontal barrel drum: cranberry shell, cream drumhead on the left, gold X lacing,
// and a tuft of three pine leaves on top
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'dhak'
const id = k => `wg-christmas-${N}-${k}`, url = k => `url(#${id(k)})`
const st = (o, c, op) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = (a, b) => `${num(a)} ${num(b)}`
const sparkle = (x, y, r) => { const q = r * 0.22; return `M${P(x, y - r)}Q${P(x + q, y - q)} ${P(x + r, y)}Q${P(x + q, y + q)} ${P(x, y + r)}Q${P(x - q, y + q)} ${P(x - r, y)}Q${P(x - q, y - q)} ${P(x, y - r)}z` }
// a pointed leaf from base b to tip t, bulging by w
const leaf = (b, t, w) => {
  const mx = (b[0] + t[0]) / 2, my = (b[1] + t[1]) / 2, dx = t[0] - b[0], dy = t[1] - b[1], L = Math.hypot(dx, dy)
  const nx = -dy / L * w, ny = dx / L * w
  return `M${P(...b)}C${P(b[0] + dx * 0.15 + nx, b[1] + dy * 0.15 + ny)} ${P(mx + dx * 0.2 + nx, my + dy * 0.2 + ny)} ${P(...t)}C${P(mx + dx * 0.2 - nx, my + dy * 0.2 - ny)} ${P(b[0] + dx * 0.15 - nx, b[1] + dy * 0.15 - ny)} ${P(...b)}Z`
}
const BODY = 'M5.2 11C9 10 14.5 10 18.4 11C21.8 12.8 21.8 19.7 18.4 21.5C14.5 22.5 9 22.5 5.2 21.5A2.4 5.25 0 0 1 5.2 11Z'
const HEAD = 'M5.2 11a2.4 5.25 0 1 0 0 10.5a2.4 5.25 0 1 0 0-10.5z'
const LACE = 'M8.6 11.6L13.4 21L18.2 11.8M8.6 21L13.4 11.6L18.2 21'
const HOOP = 'M5.2 10.6a2.9 5.65 0 1 0 0 11.3a2.9 5.65 0 1 0 0-11.3z'

export default function render() {
  const leaves = leaf([15.6, 11], [11.8, 2.8], 1.5) + leaf([16.6, 11], [17.4, 2.2], 1.4) + leaf([17.4, 11], [21.8, 6.2], 1.4)
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 9, x2: 16, y2: 22, gradientUnits: 'userSpaceOnUse' }, [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
    ]],
    ['path', { d: leaves, fill: C.c2, stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M15.6 10.6C14.4 8 13.2 5.6 12.3 3.7M16.8 10.6L17.2 3.8M17.6 10.6C18.8 9 20 7.6 21.2 6.6', stroke: C.shine, 'stroke-opacity': 0.45, 'stroke-width': 0.4, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: BODY, fill: C.c1, stroke: C.ink, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: LACE, stroke: C.ink, 'stroke-width': 2.1, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: LACE, stroke: C.c3, 'stroke-width': 0.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: HOOP, stroke: C.ink, 'stroke-width': 2.1, class: 'wm-deco' }],
    ['path', { d: HOOP, stroke: C.c3, 'stroke-width': 0.9, class: 'wm-deco' }],
    ['path', { d: HEAD, fill: C.c4, stroke: C.ink, 'stroke-width': 0.7, class: 'wm-k' }],
    ['path', { d: 'M5.2 12.9a1.2 3.35 0 1 0 0 6.7a1.2 3.35 0 1 0 0-6.7z', fill: C.tint, 'fill-opacity': 0.7, stroke: C.ink, 'stroke-width': 0.4, class: 'wm-k' }],
    ['path', { d: BODY, fill: url(0), class: 'wm-shine' }],
    ['path', { d: sparkle(3.6, 5.2, 1.4), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
