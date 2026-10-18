// forge/hand/blueprint/split.mjs — the drafted Y fork (the generated drawing cut the junction open around a control
// ring, so the stem and both arms floated apart at 16px, clipped both arrowheads short for rings and ran a chain centre
// line up between the arms that read as a third prong): the fork is one solid mitred junction, both arrowheads keep
// their full legs, and the only control ring sits at the stem's foot, where the path starts.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`

export default function render() {
  return [
    // width dimension, opened around the foot ring
    ['path', { d: 'M4 23H10.9M13.1 23H20M4 21.2V23.3M20 21.2V23.3', ...con(0.5) }],
    ['path', { d: 'M3.35 23.65L4.65 22.35M19.35 23.65L20.65 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // stem and fork (arms stop inside the arrowhead corners so their caps stay hidden)
    ['path', { d: 'M4.5 5.5L12 13L19.5 5.5M12 13V19.43', class: 'wm-k' }],
    ['path', { d: ring(12, 21), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-k' }],
    // arrowheads
    ['path', { d: 'M4 10V5H9M20 10V5H15', class: 'wm-a' }],
  ]
}
