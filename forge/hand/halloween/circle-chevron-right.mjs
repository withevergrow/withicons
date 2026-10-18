// forge/hand/halloween/circle-chevron-right.mjs — a midnight button with a purple rim and one bold candle-lit chevron,
// matching circle-chevron-down, replacing the pale cream disc that washed out on light and glared on dark.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), EDGE = V('edge', '#7344C9'), ACCENT = V('accent', '#FFB52E')
const TINT = V('tint', '#FFF1B8'), SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-circle-chevron-right-${n}`
const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

export default function render() {
  const chev = 'M10 7.5L14.5 12L10 16.5'
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.68, r: 13.86, fx: 8.64, fy: 8.22, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHADOW }], ['stop', { offset: 0.45, 'stop-color': SHADOW }], ['stop', { offset: 1, 'stop-color': INK }]]],
      ['radialGradient', { id: id(1), cx: 11.2, cy: 11, r: 6, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': TINT }], ['stop', { offset: 0.4, 'stop-color': TINT }], ['stop', { offset: 1, 'stop-color': ACCENT }]]],
      ['radialGradient', { id: id(2), cx: 12, cy: 13.05, r: 12, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': ACCENT, 'stop-opacity': 0.36 }], ['stop', { offset: 0.55, 'stop-color': ACCENT, 'stop-opacity': 0.16 }],
        ['stop', { offset: 1, 'stop-color': ACCENT, 'stop-opacity': 0 }]]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(2)})`, class: 'wm-deco' }],
    ['circle', { cx: 12.15, cy: 12.85, r: 10.48, fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['circle', { cx: 12, cy: 12, r: 10.48, fill: `url(#${id(0)})`, stroke: EDGE, 'stroke-width': 0.72, class: 'wm-k' }],
    // a faint rim light on the upper-left shoulder
    ['path', { d: 'M3.31 15.9A9.5 9.5 0 0 1 14.37 2.82', ...round, stroke: SHINE, 'stroke-opacity': 0.22, 'stroke-width': 0.55, class: 'wm-shine' }],
    // the chevron: purple rim, then candle-lit core
    ['path', { d: chev, ...round, stroke: EDGE, 'stroke-width': 2.9, class: 'wm-a' }],
    ['path', { d: chev, ...round, stroke: `url(#${id(1)})`, 'stroke-width': 1.7, class: 'wm-a' }],
  ]
}
