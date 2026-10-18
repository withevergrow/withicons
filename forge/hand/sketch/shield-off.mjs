// forge/hand/sketch/shield-off.mjs: the line shield (pointed bottom, both halves) in wobbly pencil, one bold slash cutting through.
const r2 = v => Math.round(v * 100) / 100
const sh = (d, dx, dy) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, x, y) => `${r2(+x + dx)} ${r2(+y + dy)}`)
const F = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
const UP = 'M8.7 3.9 Q10.4 3.1 12 2.5 Q15.9 4 19.6 5.5 Q19.7 8.8 19.5 12 C19.5 12.8 19.4 13.5 19.2 14.3'
const LOW = 'M15 20 C14.1 20.6 13.1 21.1 12 21.5 C7.5 19.8 4.5 16.5 4.5 12 Q4.4 10.7 4.5 9.4'
const SLASH = 'M3.1 3.1 Q12.2 11.8 20.9 20.9'
export default function render() {
  return [
    ['path', { d: sh(UP + LOW, 0.3, -0.25), ...F, class: 'wm-k' }],
    ['path', { d: sh(SLASH, 0.35, -0.3), ...F, class: 'wm-s' }],
    ['path', { d: UP + LOW, class: 'wm-k' }],
    ['path', { d: SLASH, 'stroke-width': 1.55, class: 'wm-s' }],
  ]
}
