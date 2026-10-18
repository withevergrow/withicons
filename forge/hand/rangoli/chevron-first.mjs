// forge/hand/rangoli/chevron-first.mjs — a bold saffron chevron against a kumkum-to-violet wall bar, same round-ended
// weight as chevron-left, with the generated marigold flower dropped so nothing crowds the chevron's point.
const V = (r, h) => `var(--with-rangoli-${r}, ${h})`
const C1 = V('c1', '#FFB21F'), C2 = V('c2', '#F2462C'), C3 = V('c3', '#E81F7A'), C4 = V('c4', '#7B2FE0')
const SHADOW = V('shadow', '#5A1240'), SHINE = V('shine', '#FFFFFF')
const G0 = 'wg-rangoli-chevron-first-0', G1 = 'wg-rangoli-chevron-first-1'
const r2 = v => Math.round(v * 100) / 100
const chev = (dy = 0) => `M17.5 ${r2(6 + dy)}L11.5 ${r2(12 + dy)}L17.5 ${r2(18 + dy)}`
const wall = (dy = 0) => `M6.5 ${r2(6 + dy)}V${r2(18 + dy)}`
const S = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: G0, cx: 11, cy: 7, r: 16, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }],
        ['stop', { offset: 0.3, 'stop-color': C1 }],
        ['stop', { offset: 1, 'stop-color': C2 }],
      ]],
      ['linearGradient', { id: G1, x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C3 }],
        ['stop', { offset: 1, 'stop-color': C4 }],
      ]],
    ]],
    ['path', { d: chev(0.55) + wall(0.55), ...S, stroke: SHADOW, 'stroke-opacity': 0.45, 'stroke-width': 2.6, class: 'wm-shadow' }],
    ['path', { d: wall(), ...S, stroke: `url(#${G1})`, 'stroke-width': 2.6, class: 'wm-a' }],
    ['path', { d: chev(), ...S, stroke: `url(#${G0})`, 'stroke-width': 2.6, class: 'wm-k' }],
    ['path', { d: 'M16.6 6.2L12.6 10.2M6 7V11', ...S, stroke: SHINE, 'stroke-opacity': 0.65, 'stroke-width': 0.55, class: 'wm-shine' }],
  ]
}
