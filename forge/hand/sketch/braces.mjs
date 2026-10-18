// forge/hand/sketch/braces.mjs — two firm pencil braces with rounded shoulders and a crisp centre point, replacing
// generated strokes whose doubled centre joins smudged into blobs and thinned the glyphs at 16px.
const r2 = n => Math.round(n * 100) / 100
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
const L = 'M9.1 3.5Q6.1 3.4 6.05 6.2Q6.1 8 6 9.6Q6 11.85 3.5 12Q6.05 12.15 6 14.5Q6.05 16.2 6 17.9Q6 20.6 9.05 20.5'
const R = 'M14.9 3.55Q17.9 3.45 17.95 6.1Q17.9 7.9 18 9.5Q18 11.9 20.5 12Q17.95 12.1 18 14.4Q17.95 16.1 18.05 17.9Q18 20.55 14.95 20.45'
export default function render() {
  return [
    ['path', { d: ghost(L + R, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: L + R, 'stroke-width': 1.4, class: 'wm-k' }],
  ]
}
