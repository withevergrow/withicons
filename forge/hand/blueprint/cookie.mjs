// forge/hand/blueprint/cookie.mjs — the drafted cookie as a round with a deep two-scallop bite and five scattered chips of mixed sizes
// (the generated drawing ran a chain crosshair through the face, ringed the bite and drew the chips as tiny square
// dashes, so it read as a target or a donut): solid dots carry the chips and only the dimension line shows the drafting.
const ACCENT = 'var(--with-accent, currentColor)'
const con = { color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }
const tick = { color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }
const chip = (cx, cy, r) => ['circle', { cx, cy, r, fill: 'currentColor', stroke: 'none', class: 'wm-a' }]

export default function render() {
  return [
    ['path', { d: 'M2.5 23H21.5M2.5 21.7V23.3M21.5 21.7V23.3', ...con }],
    ['path', { d: 'M1.85 23.65L3.15 22.35M20.85 23.65L22.15 22.35', ...tick }],
    // round with the bite taken from the top right
    ['path', { d: 'M15 3A9.5 9.5 0 1 0 21 9A2.75 2.75 0 0 1 17.25 6.75A2.75 2.75 0 0 1 15 3Z', class: 'wm-k' }],
    // scattered chips of mixed sizes, never a grid, so it reads as a cookie and not a button
    chip(8, 9.5, 1.3), chip(13.5, 8.75, 1), chip(11.25, 13.5, 1.25), chip(16, 14.5, 0.9), chip(8.5, 16.5, 0.8),
  ]
}
