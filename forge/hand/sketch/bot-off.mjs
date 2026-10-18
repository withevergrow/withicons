// forge/hand/sketch/bot-off.mjs: pencilled robot head (antenna ball, ear pegs, two tick eyes) broken where a single
// confident marker slash crosses it; no hatching on the face so the slash and the antenna both stay readable.
const r2 = n => Math.round(n * 100) / 100
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
const UPPER = 'M10.6 8.1Q13.2 7.9 15.9 8.1C17.6 8.1 19 9.4 19.1 11.1Q19.2 13.8 19 16.4'
const LOWER = 'M6.2 8.7C5.4 9.3 4.9 10.2 4.9 11.2Q4.8 14.4 5 17.5C5.1 19.2 6.4 20.5 8.1 20.6Q12 20.7 16 20.5Q16.9 20.4 17.6 20'
const STEM = 'M12 8.1Q12.1 6.3 12 4.8'
const BALL = 'M13.2 3.6C13.2 4.3 12.7 4.8 12 4.8C11.3 4.8 10.8 4.3 10.8 3.6C10.8 2.9 11.3 2.4 12 2.4C12.7 2.4 13.2 2.9 13.2 3.6Z'
export default function render() {
  return [
    ['path', { d: ghost(UPPER, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: ghost(LOWER, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: UPPER, class: 'wm-k' }],
    ['path', { d: LOWER, class: 'wm-k' }],
    ['path', { d: STEM, class: 'wm-a' }],
    ['path', { d: BALL, class: 'wm-a' }],
    ['path', { d: 'M7.5 12.2V13.8M16.5 11V12.4M2.1 12.5V16M21.9 12.8V16.2', 'stroke-width': 1.6, class: 'wm-a' }],
    ['path', { d: 'M3.1 3.1Q12.2 11.8 20.9 20.9', 'stroke-width': 1.6, class: 'wm-s' }],
  ]
}
