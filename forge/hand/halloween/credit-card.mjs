// forge/hand/halloween/credit-card.mjs — a candle-lit pumpkin card with a witch-purple magnetic stripe across it and a
// glowing carved signature slot under it, in the style's halo, drop shadow, ink outline and top-left shine; the
// generated card was a near-black midnight slab (lost on dark backgrounds) with slime goo dripping off its bottom edge.
import { C } from '../../styles/_halloween-palettes.mjs'

const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const rr = (x0, y0, x1, y1, r) =>
  `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}` +
  `H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`

export default function render(icon) {
  const id = n => `wg-halloween-${icon.name}-${n}`, url = n => `url(#${id(n)})`
  const card = rr(2, 5, 22, 19, 2)
  const shadow = rr(2.15, 5.85, 22.15, 19.85, 2)
  const ink = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
  return [
    ['defs', {}, [
      // body: pumpkin, lit from inside and from the upper left
      ['radialGradient', { id: id(0), cx: 12, cy: 13.12, r: 13.2, fx: 8.8, fy: 9.48, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      // candle light in the carved slot
      ['radialGradient', { id: id(1), cx: 7.75, cy: 15.4, r: 3.4, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.tint), st(0.5, C.accent), st(1, C.c1)]],
      // halo
      ['radialGradient', { id: id(2), cx: 12, cy: 12.7, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: card, fill: url(0), ...ink, class: 'wm-k' }],
    // magnetic stripe, edge to edge
    ['path', { d: 'M2 8.25H22V10.75H2Z', fill: C.c3, ...ink, class: 'wm-a' }],
    // carved signature slot, glowing
    ['path', { d: rr(5, 14, 10.5, 16, 1), fill: url(1), ...ink, class: 'wm-k' }],
    // shine on the lit top-left shoulder (over the stripe, like the generated gloss)
    ['path', { d: 'M2.62 11.5V6.9A1.28 1.28 0 0 1 3.9 5.62H13.5Q12.4 6.17 11.2 6.17H4.4A1.23 1.23 0 0 0 3.17 7.4V9.5Q3.17 10.6 2.62 11.5Z',
      fill: C.shine, 'fill-opacity': 0.55, class: 'wm-shine' }],
  ]
}
