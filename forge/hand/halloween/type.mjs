// forge/hand/halloween/type.mjs — a flat, upright pumpkin-orange T (bar with turned-down ends, stem, foot serif as the A
// part) in the style's ink rim, drop shadow and lit edge, with a fainter, tighter halo so the glow never hazes the glyph.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), ACCENT = V('accent', '#FFB52E')
const SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-type-${n}`
const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

export default function render() {
  const top = 'M4.5 6.5V4H19.5V6.5M12 4V20'
  const foot = 'M8.5 20H15.5'
  const body = { ...round, stroke: `url(#${id(0)})`, 'stroke-width': 2 }
  const ink = { ...round, stroke: INK, 'stroke-width': 2.72 }
  const shadow = { ...round, stroke: SHADOW, 'stroke-opacity': 0.3, 'stroke-width': 2 }
  const shine = { ...round, stroke: SHINE, 'stroke-opacity': 0.55, 'stroke-width': 0.42 }
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.4, r: 11.9, fx: 9.3, fy: 8.8, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }], ['stop', { offset: 0.45, 'stop-color': C1 }], ['stop', { offset: 1, 'stop-color': C2 }]]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12.4, r: 10, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': ACCENT, 'stop-opacity': 0.22 }], ['stop', { offset: 0.55, 'stop-color': ACCENT, 'stop-opacity': 0.09 }],
        ['stop', { offset: 1, 'stop-color': ACCENT, 'stop-opacity': 0 }]]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(1)})`, class: 'wm-deco' }],
    ['path', { d: 'M4.65 7.35V4.85H19.65V7.35M12.15 4.85V20.85', ...shadow, class: 'wm-shadow' }],
    ['path', { d: 'M8.65 20.85H15.65', ...shadow, class: 'wm-shadow' }],
    ['path', { d: foot, ...ink, class: 'wm-a' }],
    ['path', { d: top, ...ink, class: 'wm-k' }],
    ['path', { d: top, ...body, class: 'wm-k' }],
    ['path', { d: foot, ...body, class: 'wm-a' }],
    // the lit upper-left edges: the left drop, the top of the bar, the stem's left side and the foot's top
    ['path', { d: 'M3.9 6.1V4.2Q3.9 3.4 4.7 3.4H18.4M11.4 5.6V15.5', ...shine, class: 'wm-shine' }],
    ['path', { d: 'M9.2 19.4H10.6', ...shine, class: 'wm-shine' }],
  ]
}
