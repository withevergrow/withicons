// forge/hand/blueprint/blocks.mjs — the drafted toy blocks: three rounded cubes stacked in a pyramid, each stamped with a
// different shape (circle, triangle, square) like a shape-sorting set. The generated drawing was three blank rounded squares
// framed by a keyline circle, a long centre chain and four corner marks, so it read as an abstract grid; here the blocks sit
// on a single baseline dimension and carry the stamps that make them toys.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const block = (x, y) => `M${x + 1} ${y}H${x + 8}A1 1 0 0 1 ${x + 9} ${y + 1}V${y + 8}A1 1 0 0 1 ${x + 8} ${y + 9}H${x + 1}A1 1 0 0 1 ${x} ${y + 8}V${y + 1}A1 1 0 0 1 ${x + 1} ${y}Z`

export default function render() {
  return [
    ['path', { d: 'M1.5 23H22.5M1.5 21.7V23.3M22.5 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M.85 23.65L2.15 22.35M21.85 23.65L23.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: block(1.5, 12) + block(13.5, 12) + block(7.5, 3), class: 'wm-k' }],
    // stamps: circle (top), triangle (left), square (right)
    ['path', { d: 'M13.9 7.5A1.9 1.9 0 1 1 10.1 7.5A1.9 1.9 0 1 1 13.9 7.5Z', 'stroke-width': 1, class: 'wm-k' }],
    ['path', { d: 'M6 15.5L8.6 19.5H3.4Z', 'stroke-width': 1, class: 'wm-k' }],
    ['path', { d: 'M16.4 15.9H19.6V19.1H16.4Z', 'stroke-width': 1, class: 'wm-k' }],
  ]
}
