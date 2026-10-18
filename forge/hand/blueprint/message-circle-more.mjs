// forge/hand/blueprint/message-circle-more.mjs — round speech bubble with a clear tail and three bold dots. No guide lines
// inside the bubble: the only construction is a thin dimension baseline below, so the tail and the dots stay legible.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const dot = x => `M${x + 0.5} 11.5A.5.5 0 1 0 ${x - 0.5} 11.5A.5.5 0 1 0 ${x + 0.5} 11.5`

export default function render() {
  return [
    ['path', { d: 'M9 23H21M21 21.7V23.3M9 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M8.35 23.65L9.65 22.35M20.35 23.65L21.65 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M3.54 14.56L2.6 20.6L8.92 19.96A9 9 0 1 0 3.54 14.56Z', class: 'wm-k' }],
    ['path', { d: dot(7.8) + dot(12) + dot(16.2), class: 'wm-a' }],
  ]
}
