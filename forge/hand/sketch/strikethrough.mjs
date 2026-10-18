// forge/hand/sketch/strikethrough.mjs — an open S drawn as two hooks that break where a long rule cuts clean through
// edge to edge, replacing a joined S with a short bar that read as a dollar sign.
const r2 = n => Math.round(n * 100) / 100
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
const S = 'M17.3 6.4Q15.9 4.1 12.1 4Q6.9 4.05 6.75 7.9Q6.8 10.6 10.4 11.35' +
  'M13.7 12.7Q17.5 13.5 17.45 16.2Q17.2 20 12 20.05Q8.4 20 6.8 17.7'
const BAR = 'M2.4 12.05Q7.2 11.8 12 12Q16.8 12.15 21.6 11.95'
export default function render() {
  return [
    ['path', { d: ghost(S, 0.3, -0.35), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: ghost(BAR, -0.2, 0.35, 0.006), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: S, 'stroke-width': 1.4, class: 'wm-k' }],
    ['path', { d: BAR, 'stroke-width': 1.4, class: 'wm-a' }],
  ]
}
