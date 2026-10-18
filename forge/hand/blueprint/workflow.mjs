// forge/hand/blueprint/workflow.mjs — the drafted workflow: two step boxes joined by one connector (the generated
// drawing ringed the chain with keyline arcs and hung fillet construction off four box corners plus a dimension line,
// so at 16px the hairlines crowded the boxes and the connector): the keyline is gone, one fillet corner on the first
// box and one dimension line under the drawing show the drafting, and the boxes and connector stand clear.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    // fillet construction: the sharp corner the first box's top-left corner was cut from
    ['path', { d: 'M3 2.32V.9M.9 3H2.32', ...con(0.5) }],
    // one dimension line under the drawing
    ['path', { d: 'M3 23H21M3 21.4V23.3M21 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M2.35 23.65L3.65 22.35M20.35 23.65L21.65 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // the two step boxes
    ['path', { d: 'M5 3H8A2 2 0 0 1 10 5V8A2 2 0 0 1 8 10H5A2 2 0 0 1 3 8V5A2 2 0 0 1 5 3ZM16 14H19A2 2 0 0 1 21 16V19A2 2 0 0 1 19 21H16A2 2 0 0 1 14 19V16A2 2 0 0 1 16 14Z', class: 'wm-k' }],
    // the connector
    ['path', { d: 'M6.5 10V15.5A2 2 0 0 0 8.5 17.5H14', class: 'wm-a' }],
  ]
}
