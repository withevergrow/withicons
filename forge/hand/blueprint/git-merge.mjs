// forge/hand/blueprint/git-merge.mjs — three commit rings and the branch curving into the trunk, drafted clean (the
// generated drawing laid a chain keyline circle and centre crosses over the nodes, so at 16px they read as crosshair
// targets inside a dashed blob): the rings stay hollow and open, and one dimension runs below.
const ACCENT = 'var(--with-accent, currentColor)'
const circ = (x, y) => `M${x + 3} ${y}A3 3 0 1 1 ${x - 3} ${y}A3 3 0 1 1 ${x + 3} ${y}Z`

export default function render() {
  return [
    ['path', { d: 'M3.5 23H20.5M3.5 21.2V23.3M20.5 16.5V23.3', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }],
    ['path', { d: 'M2.85 23.65L4.15 22.35M19.85 23.65L21.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: circ(6.5, 6) + circ(6.5, 18) + 'M6.5 9V15', class: 'wm-k' }],
    ['path', { d: circ(17.5, 12) + 'M8.5 8.5C9.5 11 11.5 12 14.5 12', class: 'wm-k' }],
  ]
}
