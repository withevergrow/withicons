// forge/hand/sketch/lasso.mjs — an open rope loop with a trailing tail and the pointer arrow at lower right (as the
// line design), rough double pencil strokes, replacing the crossed loop with no arrow.
const r2 = n => Math.round(n * 100) / 100
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
const LOOP = 'M12.1 15.4C10.1 15.5 8.2 13.1 6.9 11.6C5.7 10.1 3.4 9.3 3.55 7C3.7 4.5 7.6 2.45 12.1 2.5C16.6 2.55 20.6 4.4 20.45 7.1C20.3 9.6 16.4 11.1 12 11C9.5 10.95 8.2 11.1 7.1 11.6L5 12.6'
const ARROW = 'M14.1 15.6L19.9 19.4L17.1 20.1L15.6 21.4L14.15 15.5'
export default function render() {
  return [
    ['path', { d: 'M16.1 18.1L17.6 18.9M15.4 17.1L16.4 17.7', 'stroke-width': 0.7, 'stroke-opacity': 0.5, class: 'wm-deco' }],
    ['path', { d: ghost(LOOP, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: LOOP, class: 'wm-k' }],
    ['path', { d: ghost(ARROW, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: ARROW, class: 'wm-a' }],
  ]
}
