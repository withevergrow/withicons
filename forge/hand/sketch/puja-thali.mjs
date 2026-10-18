// forge/hand/sketch/puja-thali.mjs: a wide thali rim as the dominant shape, a small diya in the middle with one
// clear flame, and two kumkum mounds, kept sparse so the plate and flame stay legible at 16px.
const r2 = n => Math.round(n * 100) / 100
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
// rim: the back arc is hidden behind the diya
const RIM = 'M8.4 14.15C4.6 14.5 2 15.4 2 16.5C2 17.9 6.5 19 12 19C17.5 19 22 17.9 22 16.5C22 15.4 19.4 14.5 15.6 14.15'
const UNDER = 'M2 16.6C2.6 19.5 6.8 21.5 12 21.5C17.2 21.5 21.4 19.5 22 16.6'
const DIYA = 'M8.7 12.2Q12 13.1 15.3 12.2C14.8 14.5 13.5 15.8 12 15.8C10.5 15.8 9.2 14.5 8.7 12.2'
const MOUNDS = 'M4.5 15.6C4.7 14.4 5.1 13.7 5.6 13.7C6.1 13.7 6.5 14.4 6.7 15.4M17.3 15.4C17.5 14.4 17.9 13.7 18.4 13.7C18.9 13.7 19.3 14.4 19.5 15.6'
const FLAME = 'M12 9.4C10.6 9.4 9.9 8.4 10.15 7.2C10.4 6.2 11.3 5 12 3.2C12.7 5 13.6 6.2 13.85 7.2C14.1 8.4 13.4 9.4 12 9.4'
const BODY = RIM + UNDER + DIYA + MOUNDS
export default function render() {
  return [
    ['path', { d: ghost(BODY, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: BODY, class: 'wm-k' }],
    ['path', { d: FLAME, class: 'wm-a' }],
  ]
}
