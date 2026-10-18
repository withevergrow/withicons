// forge/hand/christmas/hand-coins.mjs — an open peach palm on a cranberry cuff offering a single bright gold coin that floats above it
// (rim, inner ring and a struck spark), with a little snow on the cuff. Replaces the generated drawing, where the coin was a
// red-and-white blob that did not read as money. Roles: coin c3/accent, palm c4+edge, cuff c1, snow shine->tint. Motion: coin wm-a.
import { C } from '../../styles/_christmas-core.mjs'

const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const disc = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0z`
const spark = (x, y, r) => { const q = r * 0.22; return `M${x} ${y - r}Q${x + q} ${y - q} ${x + r} ${y}Q${x + q} ${y + q} ${x} ${y + r}Q${x - q} ${y + q} ${x - r} ${y}Q${x - q} ${y - q} ${x} ${y - r}Z` }

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`, url = n => `url(#${id(n)})`
  const HAND = 'M5.6 13.4H10Q12.2 13.4 12.2 15.1Q12.2 16.5 10.7 16.5H9.2L12.8 16.2L17.9 13.5Q19.9 12.7 20.8 14.4Q21.5 16 20 17.1L14.9 20.8Q13.9 21.6 12.6 21.6H5.6Z'
  const CUFF = 'M2.6 13.4Q2.6 12.4 3.6 12.4H4.6Q5.6 12.4 5.6 13.4V21.6H2.6Z'
  const CX = 14.4, CY = 6.9, R = 4.7
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 2, x2: 20, y2: 22, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.4)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 11, x2: 0, y2: 13.6, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    // the palm: peach, a crease between the fingers and the thumb, a soft shade under the fingers
    ['path', { d: HAND, fill: C.c4, ...INK, class: 'wm-k' }],
    ['path', { d: HAND, fill: C.edge, 'fill-opacity': 0.42, class: 'wm-k' }],
    ['path', { d: 'M12.9 16.3L18.4 17.6M13.4 19L17.2 19.9', fill: 'none', stroke: C.ink, 'stroke-width': 0.5, 'stroke-opacity': 0.55, 'stroke-linecap': 'round', class: 'wm-k' }],
    // the cuff
    ['path', { d: CUFF, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: HAND + CUFF, fill: url(0), class: 'wm-shine' }],
    // snow resting on the cuff
    ['path', { d: 'M2.2 12.6Q2.1 11.2 3.6 11.1Q4.1 10.4 4.9 10.9Q6.1 10.9 6.1 12.2Q6.1 12.9 5.4 12.9Q4.8 13.4 4.2 12.9Q3.5 13.4 2.9 12.9Q2.3 13.1 2.2 12.6Z', fill: url(1), stroke: C.ink, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    // the coin: dark edge band, bright face, raised rim, ring and a spark
    ['path', { d: disc(CX + 0.8, CY + 0.5, R), fill: C.c3, ...INK, class: 'wm-a' }],
    ['path', { d: disc(CX + 0.8, CY + 0.5, R), fill: C.shadow, 'fill-opacity': 0.38, class: 'wm-a' }],
    ['path', { d: disc(CX, CY, R), fill: C.accent, ...INK, class: 'wm-a' }],
    ['path', { d: disc(CX, CY, 3.2), fill: C.c3, stroke: C.ink, 'stroke-width': 0.4, 'stroke-opacity': 0.7, class: 'wm-a' }],
    ['path', { d: spark(CX, CY, 1.9), fill: C.c4, stroke: C.ink, 'stroke-width': 0.35, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: `M${CX - 3.6} ${CY - 1.6}Q${CX - 3} ${CY - 3.3} ${CX - 1.4} ${CY - 3.9}`, fill: 'none', stroke: C.shine, 'stroke-width': 0.7, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }],
    // a sparkle
    ['path', { d: spark(6, 4.2, 1.7), fill: C.accent, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
