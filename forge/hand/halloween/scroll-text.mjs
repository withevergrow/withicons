// forge/hand/halloween/scroll-text.mjs — a cream parchment sheet tucked between two pumpkin-orange rolls with curled ends
// and two purple ink lines, replacing the all-cream frame whose rolls and text washed into the glow.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), ACCENT = V('accent', '#FFB52E')
const TINT = V('tint', '#FFF1B8'), EDGE = V('edge', '#7344C9'), SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-scroll-text-${n}`
const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const r2 = v => Math.round(v * 100) / 100
const roll = (y, dx = 0, dy = 0) => { const X = v => r2(v + dx), Y = v => r2(v + dy)
  return `M${X(4.5)} ${Y(y)}H${X(19.5)}A1.5 1.5 0 0 1 ${X(19.5)} ${Y(y + 3)}H${X(4.5)}A1.5 1.5 0 0 1 ${X(4.5)} ${Y(y)}Z` }
const sheet = (dx = 0, dy = 0) => `M${r2(6 + dx)} ${r2(5 + dy)}H${r2(18 + dx)}V${r2(19 + dy)}H${r2(6 + dx)}Z`

export default function render() {
  const rim = { stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
  return [
    ['defs', {}, [
      // parchment: shine at the lit upper left falling to tint
      ['radialGradient', { id: id(0), cx: 12, cy: 13.4, r: 10, fx: 9.6, fy: 9.2, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHINE }], ['stop', { offset: 0.45, 'stop-color': SHINE }], ['stop', { offset: 1, 'stop-color': TINT }]]],
      // the rolls: pumpkin, lit on top, darker underneath
      ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 0, y2: 1 }, [
        ['stop', { offset: 0, 'stop-color': ACCENT }], ['stop', { offset: 0.45, 'stop-color': C1 }], ['stop', { offset: 1, 'stop-color': C2 }]]],
      ['radialGradient', { id: id(2), cx: 12, cy: 13, r: 12, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': ACCENT, 'stop-opacity': 0.36 }], ['stop', { offset: 0.55, 'stop-color': ACCENT, 'stop-opacity': 0.16 }],
        ['stop', { offset: 1, 'stop-color': ACCENT, 'stop-opacity': 0 }]]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(2)})`, class: 'wm-deco' }],
    ['path', { d: sheet(0.15, 0.85) + roll(3, 0.15, 0.85) + roll(18, 0.15, 0.85), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // the sheet runs under both rolls
    ['path', { d: sheet(), fill: `url(#${id(0)})`, ...rim, class: 'wm-k' }],
    ['path', { d: roll(3), fill: `url(#${id(1)})`, ...rim, class: 'wm-k' }],
    ['path', { d: roll(18), fill: `url(#${id(1)})`, ...rim, class: 'wm-k' }],
    // the curled ends of each roll
    ['path', { d: 'M4.5 5.3A.8 .8 0 1 1 5.3 4.5M19.5 20.3A.8 .8 0 1 1 20.3 19.5', ...round, stroke: INK, 'stroke-width': 0.5, class: 'wm-k' }],
    // lit top edges of the rolls and the sheet's left edge
    ['path', { d: 'M6 3.7H18.6M6 18.7H17.9M6.7 6.6V17.4', ...round, stroke: SHINE, 'stroke-opacity': 0.55, 'stroke-width': 0.42, class: 'wm-shine' }],
    // the text (part A)
    ['path', { d: 'M9 10H15M9 14H13', ...round, stroke: EDGE, 'stroke-width': 1.6, class: 'wm-a' }],
  ]
}
