// forge/hand/halloween/git-commit.mjs — a big pumpkin-orange commit node with a candle-lit carved centre on a short orange
// line, ink-rimmed and shadowed; replaces the small bone-white node that vanished on light and the spider beside it.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), TINT = V('tint', '#FFF1B8')
const ACCENT = V('accent', '#FFB52E'), SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-git-commit-${n}`
const round = { fill: 'none', 'stroke-linecap': 'round' }

export default function render() {
  const bars = 'M2.5 12H8M16 12H21.5'
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.4, r: 12.4, fx: 9, fy: 9.4, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }], ['stop', { offset: 0.45, 'stop-color': C1 }], ['stop', { offset: 1, 'stop-color': C2 }]]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12.3, r: 2.3, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': TINT }], ['stop', { offset: 0.55, 'stop-color': TINT }], ['stop', { offset: 1, 'stop-color': ACCENT }]]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.5, r: 12, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': ACCENT, 'stop-opacity': 0.36 }], ['stop', { offset: 0.55, 'stop-color': ACCENT, 'stop-opacity': 0.16 }],
        ['stop', { offset: 1, 'stop-color': ACCENT, 'stop-opacity': 0 }]]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(2)})`, class: 'wm-deco' }],
    ['path', { d: 'M2.65 12.85H8.15M16.15 12.85H21.65', ...round, stroke: SHADOW, 'stroke-opacity': 0.3, 'stroke-width': 2, class: 'wm-shadow' }],
    ['circle', { cx: 12.15, cy: 12.85, r: 5.25, fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // the line, then the node over it
    ['path', { d: bars, ...round, stroke: INK, 'stroke-width': 2.72, class: 'wm-k' }],
    ['path', { d: bars, ...round, stroke: `url(#${id(0)})`, 'stroke-width': 2, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 12, r: 5.25, fill: `url(#${id(0)})`, stroke: INK, 'stroke-width': 0.72, class: 'wm-k' }],
    // the carved centre glowing with candle light
    ['circle', { cx: 12, cy: 12, r: 2.1, fill: `url(#${id(1)})`, stroke: INK, 'stroke-width': 0.6, class: 'wm-shine' }],
    // the lit upper-left shoulder of the node and the tops of the line
    ['path', { d: 'M7.85 10.6A4.4 4.4 0 0 1 10.6 7.85', ...round, stroke: SHINE, 'stroke-opacity': 0.6, 'stroke-width': 0.55, class: 'wm-shine' }],
    ['path', { d: 'M3.1 11.4H5.5M18.4 11.4H20.4', ...round, stroke: SHINE, 'stroke-opacity': 0.55, 'stroke-width': 0.42, class: 'wm-shine' }],
  ]
}
