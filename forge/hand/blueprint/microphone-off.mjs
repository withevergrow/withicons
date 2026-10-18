// forge/hand/blueprint/microphone-off.mjs — a clean mic capsule and stand with one diagonal slash; no guide circle behind it.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const tick = { color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const dots = (cls, ...p) => ({ d: p.map(([x, y]) => ring(x, y)).join(''), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    ['path', { d: 'M7 23H17M7 21.2V23.3M17 21.2V23.3', ...con(0.5) }],
    ['path', { d: 'M6.35 23.65L7.65 22.35M16.35 23.65L17.65 22.35', ...tick }],
    ['path', { d: 'M9.3 3.6A3 3 0 0 1 15 5V10.5M14.4 13.4A3 3 0 0 1 9 12V9', class: 'wm-k' }],
    ['path', { d: 'M18.5 11A6.5 6.5 0 0 1 17.8 13.9M15.6 16.5A6.5 6.5 0 0 1 5.5 11M12 17.5V21', class: 'wm-a' }],
    ['path', { d: 'M3.5 3.5L20.5 20.5', class: 'wm-s' }],
    ['path', dots('wm-s', [3.5, 3.5], [20.5, 20.5])],
  ]
}
