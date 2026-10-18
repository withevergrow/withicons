// forge/hand/valentine/bed.mjs — a bold pink bed frame (headboard post, rail, foot leg) carrying a cream mattress and a pink
// pillow; the generated bed was cream outline on cream fill and faded into light backgrounds.
import { C, heartD } from '../../styles/_valentine-core.mjs'

const G = 'url(#wg-valentine-bed-0)'
const FRAME = 'M2 4.5A1 1 0 0 1 4 4.5V15H21A1 1 0 0 1 22 16V19.5A1 1 0 0 1 20 19.5V17.25H4V19.5A1 1 0 0 1 2 19.5Z'
const MATTRESS = 'M3.5 11.25H19.25A2.25 2.25 0 0 1 21.5 13.5V15.5H3.5Z'
const PILLOW = 'M6.75 8.5H9.75A1.5 1.5 0 0 1 11.25 10V11.75H5.25V10A1.5 1.5 0 0 1 6.75 8.5Z'

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: 'wg-valentine-bed-0', x1: 10, y1: 3.5, x2: 14, y2: 20.5, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C.c1 }],
        ['stop', { offset: 0.4, 'stop-color': C.c1 }],
        ['stop', { offset: 1, 'stop-color': C.c2 }],
      ]],
    ]],
    ['path', { d: FRAME, fill: 'none', stroke: C.c4, 'stroke-width': 1.82, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: MATTRESS, fill: 'none', stroke: C.c4, 'stroke-width': 1.82, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: PILLOW, fill: 'none', stroke: C.c4, 'stroke-width': 1.82, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: heartD(17.25, 6.75, 1.4), fill: C.c2, stroke: C.ink, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    // mattress (cream), its blanket fold and shade
    ['path', { d: MATTRESS, fill: C.c4, stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M12.5 11.25V15', fill: 'none', stroke: C.ink, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M4 14.3H21.1V15H4Z', fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // pillow (plate A)
    ['path', { d: PILLOW, fill: G, stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M6.3 10.2A0.9 0.9 0 0 1 7 9.4H8', fill: 'none', stroke: C.shine, 'stroke-width': 0.55, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }],
    // frame
    ['path', { d: FRAME, fill: G, stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M3.45 5V15H4V5Z M4.4 16.7H20.45V17.25H4.4Z M21.45 16.2V19.4A0.55 0.55 0 0 1 21.1 19.95V16.2Z', fill: C.shadow, 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: 'M2.75 5.4V9.5M5.5 15.75H10', fill: 'none', stroke: C.shine, 'stroke-width': 0.55, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }],
  ]
}
