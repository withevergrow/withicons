// forge/hand/valentine/panel-right.mjs — a pink window frame whose right sidebar is filled solid pink behind a heavy divider,
// with a cream main pane and a cream heart on the sidebar; the generated one was all pale cream and read as a blank card.
import { C, heartD } from '../../styles/_valentine-core.mjs'

const G = 'url(#wg-valentine-panel-right-0)'
const OUTER = 'M5 2H19A3 3 0 0 1 22 5V19A3 3 0 0 1 19 22H5A3 3 0 0 1 2 19V5A3 3 0 0 1 5 2Z'
// the main pane knocked out of the frame (the sidebar stays solid)
const PANE = 'M5 4.25H13.75V19.75H5A0.75 0.75 0 0 1 4.25 19V5A0.75 0.75 0 0 1 5 4.25Z'

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: 'wg-valentine-panel-right-0', x1: 10, y1: 2, x2: 14, y2: 22, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C.c1 }],
        ['stop', { offset: 0.4, 'stop-color': C.c1 }],
        ['stop', { offset: 1, 'stop-color': C.c2 }],
      ]],
    ]],
    ['path', { d: OUTER, fill: 'none', stroke: C.c4, 'stroke-width': 1.82, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // cream paper in the main pane
    ['path', { d: PANE, fill: C.c4, class: 'wm-k' }],
    ['path', { d: OUTER + PANE, fill: G, 'fill-rule': 'evenodd', stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // shade: right and bottom inside the frame, and a soft fall into the pane under its top edge
    ['path', { d: 'M21.45 5.2V19A2.45 2.45 0 0 1 19 21.45H5.4V20.8H19A1.8 1.8 0 0 0 20.8 19V5.2Z', fill: C.shadow, 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: 'M4.62 4.62H13.38V5.25H4.62Z', fill: C.shadow, 'fill-opacity': 0.22, class: 'wm-shadow' }],
    // highlight on the frame's top-left
    ['path', { d: 'M2.95 8.5V5.2A2.25 2.25 0 0 1 5.2 2.95H9', fill: 'none', stroke: C.shine, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }],
    // a cream heart and two menu dashes on the sidebar
    ['path', { d: heartD(17.9, 7.2, 1.45), fill: C.c4, stroke: C.ink, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: 'M16.5 11.5H19.25M16.5 14.5H19.25', fill: 'none', stroke: C.c4, 'stroke-width': 1.1, 'stroke-linecap': 'round', class: 'wm-k' }],
  ]
}
