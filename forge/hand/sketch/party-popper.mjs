// forge/hand/sketch/party-popper.mjs — a firm pencil cone with its band and three bold streamers (curl, dash, wave) plus
// two confetti dots, replacing the generated tangle of thin scratchy streamers that hid the cone at 16px.
const r2 = v => Math.round(v * 100) / 100
const sh = (d, dx, dy) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, x, y) => `${r2(+x + dx)} ${r2(+y + dy)}`)
const F = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
const CONE = 'M2.75 21.6 Q5.1 15.4 7.75 9.05M7.05 9.25 Q10.9 12.9 14.95 16.8M15 16.3 Q8.8 18.6 2.55 21.35'
const BAND = 'M5.4 14.35 Q7.5 16.4 9.65 18.6'
const STREAM = 'M10.8 6.8 C13.2 5.6 10.4 3.6 12.9 2.3M14.8 9.2 Q16.4 7.7 18.2 5.9M16.9 13.4 C18.2 11.4 19.9 14.2 21.6 11.9'
const DOTS = 'M16.45 2.4 L16.6 3.15M21 7.45 L21.1 8.2'
export default function render() {
  return [
    ['path', { d: 'M9.8 15.9l1.6-1.3M6.2 18.9l1.3-1.05', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: sh(CONE + BAND, 0.3, -0.25), ...F, class: 'wm-k' }],
    ['path', { d: sh(STREAM, 0.3, -0.25), ...F, class: 'wm-a' }],
    ['path', { d: CONE + BAND, class: 'wm-k' }],
    ['path', { d: STREAM, class: 'wm-a' }],
    ['path', { d: DOTS, 'stroke-width': 1.5, class: 'wm-s' }],
  ]
}
