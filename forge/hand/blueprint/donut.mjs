// forge/hand/blueprint/donut.mjs — the drafted donut: one whole outer ring, an open central hole and six sprinkles
// scattered at mixed angles round the middle of the dough (the generated drawing ran both chain axes across the whole
// body and laid the sprinkles almost tangent on one circle, so with the axes they read as a gear or clock face at 16px).
// The hole stays empty and a single dimension line stays faint below.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M2.5 23H21.5M2.5 21.9V23.3M21.5 21.9V23.3', ...con(0.5) }],
    ['path', { d: 'M1.85 23.65L3.15 22.35M20.85 23.65L22.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M21.5 12A9.5 9.5 0 0 1 2.5 12A9.5 9.5 0 0 1 21.5 12ZM15 12A3 3 0 0 1 9 12A3 3 0 0 1 15 12Z', class: 'wm-k' }],
    ['path', { d: 'M9.95 5.6L11.9 6.1M17.75 7.95L17.05 9.8M18.05 15.25L16.2 15.9M9.25 17.1L10.5 18.65M5.45 11.6L6.1 13.5M5.95 8.75L7.8 8.1', class: 'wm-a' }],
  ]
}
