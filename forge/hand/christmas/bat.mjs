// forge/hand/christmas/bat.mjs — a friendly bat seen from the front: a dark plum body with two pointed ears, round
// white eyes and two tiny fangs, spread between scalloped cranberry wings with finger ribs and a light rim along the top.
// Roles: wings c1, body shadow, eyes shine, fangs shine, snow shine->tint. Motion: wings wm-a (flap), body wm-k.
import { C, num } from '../../styles/_christmas-core.mjs'

const NAME = 'bat'
const id = n => `wg-christmas-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const P = (a, b) => `${num(a)} ${num(b)}`
const poly = pts => 'M' + pts.map(([x, y]) => P(x, y)).join('L') + 'Z'
const discD = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
const sparkle = (x, y, r) => { const q = r * 0.22; return `M${P(x, y - r)}Q${P(x + q, y - q)} ${P(x + r, y)}Q${P(x + q, y + q)} ${P(x, y + r)}Q${P(x - q, y + q)} ${P(x - r, y)}Q${P(x - q, y - q)} ${P(x, y - r)}z` }

// one wing (s = -1 left, +1 right): shoulder, a high wrist, three scalloped finger tips
const X = (x, s) => 12 + s * (12 - x)
const wing = s => {
  const p = (x, y) => P(X(x, s), y)
  return `M${p(10.6, 10.6)}Q${p(7.8, 7.4)} ${p(4.8, 6.4)}L${p(2, 10.2)}Q${p(3.2, 11.6)} ${p(3.6, 14.8)}Q${p(5.4, 13.8)} ${p(7.2, 16.2)}Q${p(8.4, 14.4)} ${p(10.6, 14.6)}Z`
}
const ribs = s => {
  const p = (x, y) => P(X(x, s), y)
  return `M${p(4.8, 6.4)}L${p(3.6, 14.8)}M${p(4.8, 6.4)}L${p(7.2, 16.2)}M${p(4.8, 6.4)}L${p(10.6, 13.6)}`
}
const BODY = 'M12 7.2C14.3 7.2 15.2 8.8 15.2 10.6C15.2 12.2 14.6 13 14.2 14.2C13.8 15.6 13.2 17.4 12 18.6C10.8 17.4 10.2 15.6 9.8 14.2C9.4 13 8.8 12.2 8.8 10.6C8.8 8.8 9.7 7.2 12 7.2Z'
const EARS = 'M9.3 8.8L8.4 3.9L11.6 7.4ZM14.7 8.8L15.6 3.9L12.4 7.4Z'

export default function render() {
  const wings = wing(-1) + wing(1)
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 3, x2: 13, y2: 19, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
    ]],
    ['path', { d: wings, fill: C.c1, ...INK, class: 'wm-a' }],
    ['path', { d: ribs(-1) + ribs(1), fill: 'none', stroke: C.ink, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-opacity': 0.55, class: 'wm-a' }],
    ['path', { d: wings, fill: url(0), class: 'wm-shine' }],
    ['path', { d: BODY + EARS, fill: 'none', stroke: C.tint, 'stroke-width': 1.6, 'stroke-linejoin': 'round', 'stroke-opacity': 0.6, class: 'wm-k' }],
    ['path', { d: EARS, fill: C.shadow, ...INK, class: 'wm-k' }],
    ['path', { d: BODY, fill: C.shadow, ...INK, class: 'wm-k' }],
    ['path', { d: BODY + EARS, fill: url(0), class: 'wm-shine' }],
    ['path', { d: discD(10.7, 10.2, 1.05) + discD(13.3, 10.2, 1.05), fill: C.shine, stroke: C.ink, 'stroke-width': 0.3, class: 'wm-k' }],
    ['path', { d: discD(10.85, 10.3, 0.5) + discD(13.15, 10.3, 0.5), fill: C.ink, class: 'wm-k' }],
    ['path', { d: 'M11.1 12.3L11.45 13.5L11.8 12.3ZM12.2 12.3L12.55 13.5L12.9 12.3Z', fill: C.shine, stroke: C.ink, 'stroke-width': 0.25, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: sparkle(20, 3.6, 1.5), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
