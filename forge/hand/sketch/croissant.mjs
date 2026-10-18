// forge/hand/sketch/croissant.mjs — fat crescent with five lobed segments, tapered inward-curling horns, bold segment strokes.
const R = (v) => Math.round(v * 100) / 100
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${R(+x + dx)} ${R(+y + dy)}`)
const GHOST = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
export default function render() {
  const body = 'M4.6 19.4Q1.4 17.2 4.6 11.8Q6 7.6 9.4 7.4Q12 3.4 14.6 7.4Q18 7.6 19.4 11.8Q22.6 17.2 19.4 19.4Q18.6 12.4 12 12.2Q5.4 12.4 4.6 19.4Z'
  const seg = 'M9.4 7.4Q10.6 9.2 10 11.6M14.6 7.4Q13.4 9.2 14 11.6M4.6 11.8Q6.6 12.6 7 15.6M19.4 11.8Q17.4 12.6 17 15.6'
  return [
    ['path', { d: g(body), ...GHOST, class: 'wm-k' }],
    ['path', { d: body, class: 'wm-k' }],
    ['path', { d: seg, class: 'wm-a' }],
  ]
}
