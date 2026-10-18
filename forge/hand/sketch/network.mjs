// forge/hand/sketch/network.mjs: one top node, a clean elbow bus and three bottom nodes; all four boxes are plain
// closed outlines (pencil hatch only on the top node) so nothing muddies at 16px.
export default function render() {
  return [
    ['path', { d: 'M8.4 2.4L15.6 2.3Q16.4 2.4 16.4 3.2L16.5 6.8Q16.4 7.6 15.6 7.6L8.4 7.7Q7.6 7.6 7.6 6.8L7.5 3.2Q7.6 2.4 8.4 2.4Z', class: 'wm-k' }],
    ['path', { d: 'M9.6 6.9L12.3 3.4M12.2 6.9L14.4 4M14.6 6.9L15.6 5.6', 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M2 17.9Q2 17 2.9 17L5.2 17.1Q6.1 17 6.1 17.9L6.2 20.1Q6.1 21 5.2 21L2.9 21.1Q2 21 2 20.1Z', class: 'wm-k' }],
    ['path', { d: 'M9.9 17.9Q9.9 17 10.8 17L13.2 17.1Q14.1 17 14.1 17.9L14.2 20.1Q14.1 21 13.2 21L10.8 21.1Q9.9 21 9.9 20.1Z', class: 'wm-k' }],
    ['path', { d: 'M17.9 17.9Q17.9 17 18.8 17L21.1 17.1Q22 17 22 17.9L22.1 20.1Q22 21 21.1 21L18.8 21.1Q17.9 21 17.9 20.1Z', class: 'wm-k' }],
    ['path', { d: 'M12 7.8L12 12.4M4 17L4.1 12.5L20 12.4L20 17', class: 'wm-a' }],
  ]
}
