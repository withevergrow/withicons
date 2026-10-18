// forge/hand/sketch/rakhi.mjs — a round medallion with a centre dot and shade hatch on a diagonal thread that ends in a simple fan of
// tassel strands, wobbly pencil strokes with a ghost pass; fewer, bigger parts than the scalloped star so it reads at 16px.
const r2 = n => Math.round(n * 100) / 100
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
const RING = 'M16 12A4 4 0 1 1 8 12A4 4 0 1 1 16 12'
const THREAD = 'M10.05 15.65L6.35 19.35L4.65 17.65L8.35 13.95M13.95 8.35L17.65 4.65L19.35 6.35L15.65 10.05'
const TASSEL = 'M5.5 18.5L2.7 18.7M5.5 18.5L3.6 20.9M5.5 18.5L5.3 21.3M18.5 5.5L21.3 5.3M18.5 5.5L20.4 3.1M18.5 5.5L18.7 2.7'
export default function render() {
  return [
    ['path', { d: 'M15.9 11.1L11.1 15.9M15.8 13.2L13.2 15.8', 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-deco' }],
    ['path', { d: ghost(RING + THREAD, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: RING + THREAD, class: 'wm-k' }],
    ['path', { d: TASSEL, class: 'wm-a' }],
    ['circle', { cx: 12, cy: 12, r: 1.2, fill: 'currentColor', stroke: 'none', class: 'wm-s' }],
  ]
}
