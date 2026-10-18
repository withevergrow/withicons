// forge/hand/halloween/door-open.mjs — a witch-purple door frame around a dark, candle-lit doorway, with a pumpkin
// leaf swung toward you (hinged on the left edge of the opening, free edge taller) and a round purple knob.
// The generated drawing was one dark purple mass where frame, opening and leaf merged; here each is its own tone.
// Motion: the knob is wm-a (the spec wiggles parts.A about [9, 13.25]); frame/leaf wm-k; halo wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'door-open'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const r = v => Math.round(v * 100) / 100

const frame = (dx, dy) => {
  const p = (x, y) => `${r(x + dx)} ${r(y + dy)}`
  return `M${p(5.5, 2.7)}H${r(18.5 + dx)}Q${p(20.8, 2.7)} ${p(20.8, 5)}V${r(21.3 + dy)}H${r(3.2 + dx)}V${r(5 + dy)}Q${p(3.2, 2.7)} ${p(5.5, 2.7)}Z`
}
const leaf = (dx, dy) => {
  const p = (x, y) => `${r(x + dx)} ${r(y + dy)}`
  return `M${p(5.6, 5.2)}L${p(13.4, 3.6)}V${r(21.6 + dy)}L${p(5.6, 19.4)}Z`
}

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 12, r: 11.6, fx: 8.6, fy: 7.6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.45, C.c3), st(1, C.edge)]],
      ['linearGradient', { id: id(1), x1: 12, y1: 4.7, x2: 12, y2: 19.6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.shadow), st(1, C.ink)]],
      ['radialGradient', { id: id(2), cx: 11.6, cy: 12.6, r: 9.6, fx: 8.8, fy: 9.4, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(3), cx: 12, cy: 12.1, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.16), st(1, C.accent, 0)]],
      ['radialGradient', { id: id(4), cx: 17.4, cy: 18, r: 7, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.85), st(0.6, C.c1, 0.4), st(1, C.c1, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(3), class: 'wm-deco' }],
    ['path', { d: frame(0.15, 0.85) + leaf(0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // the frame, a witch-purple slab with a lit top-left edge
    ['path', { d: frame(0, 0), fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: 'M3.95 18V5.2Q3.95 3.45 5.7 3.45H12', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.45, 'stroke-width': 0.7, class: 'wm-shine' }],
    // the doorway: dark, with candle light spilling across the floor on the right
    ['path', { d: 'M5.6 5.2H18.4V19.4H5.6Z', fill: url(1), ...INK, class: 'wm-k' }],
    ['path', { d: 'M13.4 19.4L18.4 19.4V9.6Q16.6 14.4 13.4 17.6Z', fill: url(4), class: 'wm-shine' }],
    // the open leaf: pumpkin, hinge on the left edge of the opening, free edge swung toward you
    ['path', { d: leaf(0, 0), fill: url(2), ...INK, class: 'wm-k' }],
    ['path', { d: 'M7.5 7.8L11.6 6.9V18.1L7.5 16.9Z', ...ROUND, stroke: C.ink, 'stroke-opacity': 0.4, 'stroke-width': 0.6, class: 'wm-k' }],
    ['path', { d: 'M6.7 6.5L12.4 5.3', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.7, class: 'wm-shine' }],
    ['circle', { cx: 11.2, cy: 12.5, r: 1.15, fill: C.c3, stroke: C.ink, 'stroke-width': 0.6, class: 'wm-a' }],
  ]
}
