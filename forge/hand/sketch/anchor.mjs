// forge/hand/sketch/anchor.mjs — round ring, straight shank and stock, and one smooth crown arc ending in clean open
// flukes drawn as single chevrons, replacing crossed barb strokes that knotted at the left arm joint.
const r2 = n => Math.round(n * 100) / 100
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
const RING = 'M12.2 2.6C13.45 2.65 14.35 3.7 14.3 5C14.3 6.3 13.3 7.3 12 7.3C10.7 7.3 9.7 6.3 9.7 5C9.7 3.65 10.7 2.6 12.4 2.75'
const SHANK = 'M12 7.4Q12.1 14.3 12 21.3'
const STOCK = 'M8.1 11.55Q12 11.35 15.9 11.5'
const CROWN = 'M5 14.6C5.1 18.6 8.3 21.4 12 21.4C15.7 21.4 18.9 18.6 19 14.6'
const FLUKES = 'M3.2 16.9Q4.1 15.7 5 14.5Q5.9 15.7 6.8 16.9M17.2 16.9Q18.1 15.7 19 14.5Q19.9 15.7 20.8 16.9'
const BODY = SHANK + STOCK + CROWN + FLUKES
export default function render() {
  return [
    ['path', { d: ghost(BODY, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: BODY, class: 'wm-k' }],
    ['path', { d: RING, class: 'wm-a' }],
  ]
}
