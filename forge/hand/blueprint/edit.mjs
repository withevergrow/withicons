// forge/hand/blueprint/edit.mjs — a closed pencil with its writing point intact over a box dimensioned on its own;
// replaces the generated drawing whose keyline circle and centre mark crowded the pencil and whose node opened its tip.
const AC = 'var(--with-accent, currentColor)'
const f = v => Math.round(v * 100) / 100
const ring = (x, y, r = 0.8) => `M${f(x + r)} ${y}A${r} ${r} 0 1 0 ${f(x - r)} ${y}A${r} ${r} 0 1 0 ${f(x + r)} ${y}`
const con = { color: AC, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }
const tick = { color: AC, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }
const node = cls => ({ color: AC, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    // width dimension of the box: two extension lines and the dimension line, nothing loose off the corners
    ['path', { d: 'M3 21.68V23.3M19 21.68V23.3M3 23H19', ...con }],
    ['path', { d: 'M2.35 23.65L3.65 22.35M18.35 23.65L19.65 22.35', ...tick }],
    // pencil: closed, sharp miter point at (9, 15)
    ['path', { d: 'M9 15L10.06 10.4L17.13 3.33A2.5 2.5 0 0 1 20.67 6.87L13.6 13.94Z', class: 'wm-k' }],
    // ferrule line and the open box, its ends at the two nodes
    ['path', { d: 'M10.06 10.4L13.6 13.94M8.93 5H5A2 2 0 0 0 3 7V19A2 2 0 0 0 5 21H17A2 2 0 0 0 19 19V15.08', class: 'wm-a' }],
    ['path', { d: ring(10.5, 5) + ring(19, 13.5), ...node('wm-a') }],
  ]
}
