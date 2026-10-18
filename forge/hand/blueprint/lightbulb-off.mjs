// forge/hand/blueprint/lightbulb-off.mjs — one closed bulb with a screw base and a single diagonal slash.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const tick = { color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }

export default function render() {
  return [
    ['path', { d: 'M5 23H19M5 21.2V23.3M19 21.2V23.3', ...con(0.5) }],
    ['path', { d: 'M4.35 23.65L5.65 22.35M18.35 23.65L19.65 22.35', ...tick }],
    ['path', { d: 'M9 16C9 14 6 12.5 6 9A6 6 0 0 1 18 9C18 12.5 15 14 15 16Z', class: 'wm-k' }],
    ['path', { d: 'M9.5 18.5H14.5M10.5 21H13.5', class: 'wm-k' }],
    ['path', { d: 'M3 3L21 21', class: 'wm-s' }],
  ]
}
