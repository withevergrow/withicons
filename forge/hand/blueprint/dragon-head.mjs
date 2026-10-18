// forge/hand/blueprint/dragon-head.mjs: a front-facing dragon head drafted in straight construction lines.
// Antler horns with a branch, a faceted skull, slanted angry eyes, nostrils, two fangs and curled whiskers; the
// dimension line under it is the blueprint detail.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })
const dot = (cx, cy, r) => ['circle', { cx, cy, r, fill: 'currentColor', stroke: 'none', class: 'wm-k' }]

export default function render() {
  return [
    ['path', { d: 'M4.5 23.1H19.5M4.5 21.9V23.5M19.5 21.9V23.5', ...con(0.5) }],
    ['path', { d: 'M3.85 23.75L5.15 22.45M18.85 23.75L20.15 22.45', ...con(0.75, 0.5) }],
    ['path', { d: 'M9.6 8Q9 4.5 6.5 2.5M8.6 5.3L5.5 5.3M14.4 8Q15 4.5 17.5 2.5M15.4 5.3L18.5 5.3', class: 'wm-a' }],
    ['path', { d: 'M6.3 15.2H4.4Q2.7 15.2 2.7 16.8Q2.7 18.2 4 18.2Q4.9 18.2 4.9 17.4M17.7 15.2H19.6Q21.3 15.2 21.3 16.8Q21.3 18.2 20 18.2Q19.1 18.2 19.1 17.4', class: 'wm-a' }],
    ['path', { d: 'M8.5 8H15.5L18.5 11.5L17.5 15.5L16 19H8L6.5 15.5L5.5 11.5Z', class: 'wm-k' }],
    ['path', { d: 'M7.9 11.4L11 12.9L10.4 14.3L8.3 13.6ZM16.1 11.4L13 12.9L13.6 14.3L15.7 13.6Z', fill: 'currentColor', stroke: 'none', class: 'wm-k' }],
    dot(10.6, 16.5, 0.65),
    dot(13.4, 16.5, 0.65),
    ['path', { d: 'M9 19L9.8 21.3L10.7 19ZM13.3 19L14.2 21.3L15 19Z', fill: 'currentColor', stroke: 'none', class: 'wm-k' }],
  ]
}
