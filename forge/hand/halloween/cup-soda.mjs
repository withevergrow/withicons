// forge/hand/halloween/cup-soda.mjs — a takeaway cup of pumpkin-orange soda with a witch-purple lid band and a thick
// slime-green straw, in the style's halo, drop shadow, midnight outline and top-left shine. The generated cup was
// pale cream with a hair-thin straw and vanished at 16px; here the cup is the strongest shape in the icon.
// Motion: the straw is wm-a (the spec nudges parts.A up and down); cup and lid wm-k; halo wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'cup-soda'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const r = v => Math.round(v * 100) / 100

const cup = (dx, dy) => {
  const p = (x, y) => `${r(x + dx)} ${r(y + dy)}`
  return `M${p(5.4, 9)}L${p(6.7, 19.6)}Q${p(6.9, 21.7)} ${p(9, 21.7)}H${r(15 + dx)}Q${p(17.1, 21.7)} ${p(17.3, 19.6)}L${p(18.6, 9)}Z`
}
const lid = (dx, dy) => {
  const p = (x, y) => `${r(x + dx)} ${r(y + dy)}`
  return `M${p(4.4, 6.9)}Q${p(3.5, 6.9)} ${p(3.5, 7.9)}V${r(8.6 + dy)}Q${p(3.5, 9.6)} ${p(4.5, 9.6)}H${r(19.5 + dx)}Q${p(20.5, 9.6)} ${p(20.5, 8.6)}V${r(7.9 + dy)}Q${p(20.5, 6.9)} ${p(19.6, 6.9)}Z`
}
const straw = 'M12.9 8.2L14.5 3H18'
const strawSh = 'M13.05 9L14.65 3.85H18.15'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 15.4, r: 9.6, fx: 9.2, fy: 11.2, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12.1, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.16), st(1, C.accent, 0)]],
      ['linearGradient', { id: id(2), x1: 12, y1: 6.9, x2: 12, y2: 9.6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(1, C.edge)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(1), class: 'wm-deco' }],
    ['path', { d: cup(0.15, 0.85) + lid(0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // the straw, behind the lid: midnight rim, slime core, lit edge
    ['path', { d: strawSh, ...ROUND, stroke: C.shadow, 'stroke-opacity': 0.3, 'stroke-width': 3, class: 'wm-shadow' }],
    ['path', { d: straw, ...ROUND, stroke: C.ink, 'stroke-width': 3.2, class: 'wm-a' }],
    ['path', { d: straw, ...ROUND, stroke: C.c4, 'stroke-width': 1.9, class: 'wm-a' }],
    ['path', { d: 'M13.5 6.6L14.7 4.4', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.6, class: 'wm-shine' }],
    // the cup: orange soda with a candle-lit cream label band
    ['path', { d: cup(0, 0), fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: 'M6.15 12.6H17.85L17.5 16.4H6.5Z', fill: C.tint, 'fill-opacity': 0.92, stroke: C.ink, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M7.4 19.4L7.2 17.8M8.4 14.3L8.5 13.5', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.8, class: 'wm-shine' }],
    // the lid band
    ['path', { d: lid(0, 0), fill: url(2), ...INK, class: 'wm-k' }],
    ['path', { d: 'M5 7.7H11', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.7, class: 'wm-shine' }],
  ]
}
