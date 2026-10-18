// forge/hand/halloween/avatar-panda.mjs — a bone-white panda face with black ears and tilted black eye patches,
// a dark nose and smile, candle-orange blush cheeks, and a bold purple spider dangling from the top corner.
// Halloween comes from the accents (orange cheeks and inner ears, warm rim, the spider), not from recolouring the head.
// Ears carry a candle-orange rim so they hold on dark. Roles: face shine -> tint with a c1 rim, black parts ink, blush + inner ears c1, catch-lights shine, halo accent, spider edge.
// Motion: head, ears, patches wm-k; spider wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const id = n => `wg-halloween-avatar-panda-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

const circ = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}A${r} ${r} 0 1 1 ${num(cx + r)} ${num(cy)}A${r} ${r} 0 1 1 ${num(cx - r)} ${num(cy)}Z`
function ell(cx, cy, rx, ry, deg) {
  const t = deg * Math.PI / 180, dx = Math.cos(t) * rx, dy = Math.sin(t) * rx
  const a = `${num(cx - dx)} ${num(cy - dy)}`, b = `${num(cx + dx)} ${num(cy + dy)}`
  return `M${a}A${rx} ${ry} ${deg} 1 1 ${b}A${rx} ${ry} ${deg} 1 1 ${a}Z`
}

const HEAD = circ(12, 13.7, 7.3)
const EARS = circ(6.3, 7.2, 2.1) + circ(17.7, 7.2, 2.1)
const PATCHES = ell(8.7, 13, 1.45, 2.1, 25) + ell(15.3, 13, 1.45, 2.1, -25)
const NOSE = 'M10.7 15.5H13.3Q13.3 16.7 12 17.3Q10.7 16.7 10.7 15.5Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 14, r: 8, fx: 9.8, fy: 10.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine), st(0.62, C.shine), st(1, C.tint)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 14, r: 7.3, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c1, 0), st(0.68, C.c1, 0), st(1, C.c1, 0.42)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 14.1, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: circ(12.15, 14.55, 7.3) + circ(6.45, 8.05, 2.1) + circ(17.85, 8.05, 2.1), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // ears (behind the head), each with a candle-orange inner ear
    ['path', { d: EARS, fill: C.ink, stroke: C.c1, 'stroke-width': 0.8, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: EARS, fill: 'none', stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-shine' }],
    ['circle', { cx: 6.3, cy: 7.2, r: 0.85, fill: C.c1, 'fill-opacity': 0.9, class: 'wm-k' }],
    ['circle', { cx: 17.7, cy: 7.2, r: 0.85, fill: C.c1, 'fill-opacity': 0.9, class: 'wm-k' }],
    ['path', { d: 'M4.9 6.4Q5.5 5.5 6.5 5.3M16.3 6.4Q16.9 5.5 17.9 5.3', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.45, 'stroke-width': 0.5, class: 'wm-shine' }],
    // head
    ['path', { d: HEAD, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: HEAD, fill: url(1), class: 'wm-k' }],
    // eye patches with catch-lights, nose, smile
    ['path', { d: PATCHES, fill: C.ink, ...INK, class: 'wm-k' }],
    ['circle', { cx: 8.75, cy: 12.85, r: 0.6, fill: C.shine, class: 'wm-shine' }],
    ['circle', { cx: 15.25, cy: 12.85, r: 0.6, fill: C.shine, class: 'wm-shine' }],
    ['path', { d: NOSE, fill: C.ink, ...INK, class: 'wm-k' }],
    ['path', { d: 'M12 17.3V18.1M10.5 18.2Q12 19.4 13.5 18.2', ...ROUND, stroke: C.ink, 'stroke-width': 0.7, class: 'wm-k' }],
    // blush cheeks
    ['circle', { cx: 7.3, cy: 17.1, r: 1.15, fill: C.c1, 'fill-opacity': 0.6, class: 'wm-k' }],
    ['circle', { cx: 16.7, cy: 17.1, r: 1.15, fill: C.c1, 'fill-opacity': 0.6, class: 'wm-k' }],
    // the spider on its thread, big enough to read at 16px: round body, three bold legs a side, bright eyes
    ['path', { d: 'M21 0V2.1', stroke: C.edge, 'stroke-width': 0.5, 'stroke-linecap': 'round', fill: 'none', class: 'wm-deco' }],
    ['path', { d: 'M19.7 3.3Q18.6 2.2 18.2 2.5M19.6 3.9Q18.4 3.7 18.1 4.5M19.9 4.6Q19 5.3 18.9 6.1M22.3 3.3Q23.4 2.2 23.8 2.5M22.4 3.9Q23.6 3.7 23.9 4.5M22.1 4.6Q23 5.3 23.1 6.1', stroke: C.edge, 'stroke-width': 0.55, ...ROUND, class: 'wm-deco' }],
    ['path', { d: circ(21, 3.8, 1.7), fill: C.edge, stroke: C.tint, 'stroke-width': 0.4, class: 'wm-deco' }],
    ['path', { d: circ(20.3, 3.3, 0.38) + circ(21.7, 3.3, 0.38), fill: C.shine, class: 'wm-deco' }],
  ]
}
