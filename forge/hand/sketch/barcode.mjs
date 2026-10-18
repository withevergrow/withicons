// forge/hand/sketch/barcode.mjs — six clean pencil bars of varied widths with even gaps, single stroke each.
export default function render() {
  return [
    ['path', { d: 'M4.2 5.2L4.25 18.8', 'stroke-width': 1.4, class: 'wm-k' }],
    ['path', { d: 'M7.3 5.1L7.25 18.9', 'stroke-width': 2.4, class: 'wm-k' }],
    ['path', { d: 'M10.3 5.2L10.35 18.8', 'stroke-width': 1.2, class: 'wm-k' }],
    ['path', { d: 'M13.4 5.1L13.35 18.9', 'stroke-width': 2.6, class: 'wm-k' }],
    ['path', { d: 'M16.6 5.2L16.55 18.8', 'stroke-width': 1.4, class: 'wm-k' }],
    ['path', { d: 'M19.6 5.1L19.65 18.9', 'stroke-width': 2.2, class: 'wm-k' }],
    ['path', { d: 'M3 21.4Q12 21.6 21 21.3', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
  ]
}
