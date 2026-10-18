// forge/hand/blueprint/info-circle.mjs — the drafted circle with the i lettered in the style's round lettering pen
// (the generated drawing had a 1.25 square-capped stem with a long top flag and a speck of a dot, so it read as a 1
// inside a crosshair): a heavier stem with a short flag, a dot wider than the stem, a clear face and the diameter
// dimension below as the only construction.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const dot = (x, y) => `M${x + 0.3} ${y}A.3.3 0 1 0 ${x - 0.3} ${y}A.3.3 0 1 0 ${x + 0.3} ${y}`

export default function render() {
  return [
    ['path', { d: 'M2.5 23H21.5M2.5 21.7V23.3M21.5 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M1.85 23.65L3.15 22.35M20.85 23.65L22.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M21.5 12A9.5 9.5 0 0 1 2.5 12A9.5 9.5 0 0 1 21.5 12Z', class: 'wm-k' }],
    ['path', { d: 'M11 11.25H12V16.5' + dot(12, 7.75), 'stroke-width': 1.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
  ]
}
