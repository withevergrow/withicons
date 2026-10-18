// forge/hand/sketch/cat.mjs: clean front-facing cat head, pencil outline with pointed ears, two pill eyes, a small
// triangle nose, a tiny mouth and four whiskers; no hatch fill and no smudged scribble on the face.
const r2 = n => Math.round(n * 100) / 100
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
const HEAD = 'M12.1 20.4C7.2 20.6 3.6 18.1 3.6 13.8C3.6 11.9 3.9 10.4 4.6 9L4.4 4.2L9.4 6.6Q12 6 14.6 6.5L19.6 4.1L19.5 9.1C20.1 10.4 20.5 11.8 20.4 13.9C20.3 18.2 17 20.5 11.9 20.5'
export default function render() {
  return [
    ['path', { d: ghost(HEAD, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: HEAD, class: 'wm-k' }],
    ['path', { d: 'M8.5 11.7V13.3M15.5 11.6V13.2', 'stroke-width': 1.7, class: 'wm-a' }],
    ['path', { d: 'M10.8 15.5L13.2 15.5L12 17Z', fill: 'currentColor', 'stroke-width': 0.9, class: 'wm-a' }],
    ['path', { d: 'M12 17.2Q11.5 18.5 10.2 18.3M12 17.2Q12.5 18.5 13.8 18.3', 'stroke-width': 0.9 }],
    ['path', { d: 'M6.1 15.2L8.6 15.7M6.5 17.5L8.8 16.9M17.9 15.2L15.4 15.7M17.5 17.5L15.2 16.9', 'stroke-width': 0.8, 'stroke-opacity': 0.75 }],
  ]
}
