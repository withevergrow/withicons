// forge/hand/halloween/circle-arrow-right.mjs — a ribbed pumpkin button like circle-arrow-left/up/down carrying a bold
// candle-lit arrow with a clear shaft and head, replacing the off-family purple disc whose moon was cropped at the corner.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), ACCENT = V('accent', '#FFB52E')
const TINT = V('tint', '#FFF1B8'), SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-circle-arrow-right-${n}`
const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

export default function render() {
  const arrow = 'M8 12H16M12 8L16 12L12 16'
  // pumpkin ribs, broken where the arrow crosses the middle
  const ribs = 'M7.66 4.02Q6.5 7.4 6.37 10.6M6.37 13.4Q6.5 16.6 7.66 19.98M16.34 4.02Q17.5 7.4 17.63 10.6M17.63 13.4Q17.5 16.6 16.34 19.98'
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.68, r: 13.86, fx: 8.64, fy: 8.22, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }], ['stop', { offset: 0.45, 'stop-color': C1 }], ['stop', { offset: 1, 'stop-color': C2 }]]],
      ['radialGradient', { id: id(1), cx: 11.5, cy: 11.2, r: 5.6, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': TINT }], ['stop', { offset: 0.55, 'stop-color': TINT }], ['stop', { offset: 1, 'stop-color': ACCENT }]]],
      ['radialGradient', { id: id(2), cx: 12, cy: 13.05, r: 12, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': ACCENT, 'stop-opacity': 0.36 }], ['stop', { offset: 0.55, 'stop-color': ACCENT, 'stop-opacity': 0.16 }],
        ['stop', { offset: 1, 'stop-color': ACCENT, 'stop-opacity': 0 }]]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(2)})`, class: 'wm-deco' }],
    ['circle', { cx: 12.15, cy: 12.85, r: 10.48, fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['circle', { cx: 12, cy: 12, r: 10.48, fill: `url(#${id(0)})`, stroke: INK, 'stroke-width': 0.72, class: 'wm-k' }],
    ['path', { d: ribs, fill: 'none', stroke: C2, 'stroke-width': 0.55, 'stroke-linecap': 'round', 'stroke-opacity': 0.75, class: 'wm-k' }],
    // the rim light on the pumpkin's upper-left shoulder
    ['path', { d: 'M3.31 15.9A9.5 9.5 0 0 1 14.37 2.82', ...round, stroke: SHINE, 'stroke-opacity': 0.5, 'stroke-width': 0.55, class: 'wm-shine' }],
    // the arrow: ink rim, then candle-lit core
    ['path', { d: arrow, ...round, stroke: INK, 'stroke-width': 2.8, class: 'wm-a' }],
    ['path', { d: arrow, ...round, stroke: `url(#${id(1)})`, 'stroke-width': 1.5, class: 'wm-a' }],
    // a small crescent moon kept clear of the button, in the corner
    ['path', { d: 'M21.9 .57A1.85 1.85 0 1 0 23.43 2.7A1.55 1.55 0 0 1 21.9 .57Z', fill: TINT, stroke: INK, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
