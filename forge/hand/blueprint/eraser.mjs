// forge/hand/blueprint/eraser.mjs — the angled block eraser closed on its square rubbing corner, its band, and the
// cleared line ending at one node; replaces the generated drawing busy with a keyline circle and floating fillet crosses.
const AC = 'var(--with-accent, currentColor)'
const f = v => Math.round(v * 100) / 100
const ring = (x, y, r = 0.8) => `M${f(x + r)} ${y}A${r} ${r} 0 1 0 ${f(x - r)} ${y}A${r} ${r} 0 1 0 ${f(x + r)} ${y}`
const con = { color: AC, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }
const tick = { color: AC, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }
const node = cls => ({ color: AC, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    ['path', { d: 'M3.83 23H20.5M3.83 20.7V23.3M20.5 22.75V23.3', ...con }],
    ['path', { d: 'M3.18 23.65L4.48 22.35M19.85 23.65L21.15 22.35', ...tick }],
    // body: rounded block at 45 degrees, closed on the square corner it rubs with
    ['path', { d: 'M9 20.5L4.41 15.91A2 2 0 0 1 4.41 13.09L13.59 3.91A2 2 0 0 1 16.41 3.91L19.59 7.09A2 2 0 0 1 19.59 9.91Z', class: 'wm-k' }],
    // sleeve band and the line it clears (starting 0.9u in, so its square cap hides inside the mitred corner)
    ['path', { d: 'M6.5 11L12.5 17M9.9 20.5H18.93', class: 'wm-a' }],
    ['path', { d: ring(20.5, 20.5), ...node('wm-a') }],
  ]
}
