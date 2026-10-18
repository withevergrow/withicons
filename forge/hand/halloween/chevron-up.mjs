// forge/hand/halloween/chevron-up.mjs — a pumpkin-orange chevron with the ink rim, drop shadow and lit upper edge of its
// orange siblings (chevron-down/left/right), replacing the generated midnight-purple one that broke the set.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), ACCENT = V('accent', '#FFB52E')
const SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-chevron-up-${n}`
const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

export default function render() {
  const d = 'M6 15L12 9L18 15'
  const sh = 'M6.15 15.85L12.15 9.85L18.15 15.85'
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 12.65, r: 9.24, fx: 9.76, fy: 10.57, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }], ['stop', { offset: 0.45, 'stop-color': C1 }], ['stop', { offset: 1, 'stop-color': C2 }]]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12.41, r: 11.18, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': ACCENT, 'stop-opacity': 0.36 }], ['stop', { offset: 0.55, 'stop-color': ACCENT, 'stop-opacity': 0.16 }],
        ['stop', { offset: 1, 'stop-color': ACCENT, 'stop-opacity': 0 }]]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(1)})`, class: 'wm-deco' }],
    ['path', { d: sh, ...round, stroke: SHADOW, 'stroke-opacity': 0.3, 'stroke-width': 2, class: 'wm-shadow' }],
    ['path', { d, ...round, stroke: INK, 'stroke-width': 2.72, class: 'wm-k' }],
    ['path', { d, ...round, stroke: `url(#${id(0)})`, 'stroke-width': 2, class: 'wm-k' }],
    // the lit upper edge: along the left arm, over the apex, a short way down the right arm
    ['path', { d: 'M6.95 13.51L11.73 8.73Q12 8.46 12.27 8.73L13.35 9.81', ...round, stroke: SHINE, 'stroke-opacity': 0.55, 'stroke-width': 0.42, class: 'wm-shine' }],
  ]
}
