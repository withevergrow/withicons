// forge/hand/sketch/frown.mjs — pencil face with clear eyes and a drooping mouth, the hatching cut to two light ticks on
// the right cheek, replacing the generated hatching that crowded the mouth at 16px.
const r2 = v => Math.round(v * 100) / 100
const sh = (d, dx, dy) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, x, y) => `${r2(+x + dx)} ${r2(+y + dy)}`)
const F = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
const FACE = 'M11.2 2.55 C11.47 2.52 11.73 2.5 12 2.5 C17.25 2.5 21.5 6.75 21.5 12 C21.5 17.25 17.25 21.5 12 21.5 C6.75 21.5 2.5 17.25 2.5 12 C2.5 7.1 6.2 3.05 11 2.6 Q12.4 2.45 13.6 2.8'
const EYES = 'M9 8.5 Q9.05 9.45 9 10.4M15 8.5 Q14.95 9.45 15 10.4'
const MOUTH = 'M7.9 17.15 C9.8 14.6 14.2 14.6 16.1 17.15'
export default function render() {
  return [
    ['path', { d: 'M18.6 14.9l1.5-1.2M17.9 18l1.4-1.1M15.6 20.3l1.4-1.1', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: sh(FACE, -0.3, 0.25), ...F, class: 'wm-k' }],
    ['path', { d: sh(MOUTH, 0.25, -0.25), ...F, class: 'wm-a' }],
    ['path', { d: FACE, class: 'wm-k' }],
    ['path', { d: EYES + MOUTH, class: 'wm-a' }],
  ]
}
