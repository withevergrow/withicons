// forge/hand/halloween/square.mjs — an empty witch-purple square with ink rim, lit top edge and drop shadow,
// in step with its orange and purple siblings (square-minus, square-x) instead of the generated near-black blob.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C3 = V('c3', '#8B55E0'), EDGE = V('edge', '#7344C9'), ACCENT = V('accent', '#FFB52E')
const SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-square-${n}`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const sq = (x, y) => `M${x + 3.5} ${y}H${x + 14.5}A3.5 3.5 0 0 1 ${x + 18} ${y + 3.5}V${y + 14.5}A3.5 3.5 0 0 1 ${x + 14.5} ${y + 18}H${x + 3.5}A3.5 3.5 0 0 1 ${x} ${y + 14.5}V${y + 3.5}A3.5 3.5 0 0 1 ${x + 3.5} ${y}Z`

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.6, r: 13, fx: 8.8, fy: 8.4, gradientUnits: 'userSpaceOnUse' }, [st(0, C3), st(0.5, C3), st(1, EDGE)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 13, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, ACCENT, 0.3), st(0.55, ACCENT, 0.13), st(1, ACCENT, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(1)})`, class: 'wm-deco' }],
    ['path', { d: sq(3.15, 3.85), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: sq(3, 3), fill: `url(#${id(0)})`, stroke: INK, 'stroke-width': 0.9, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M5 16.5V7A2.5 2.5 0 0 1 7.5 4.5H16.5', fill: 'none', stroke: SHINE, 'stroke-width': 1.1, 'stroke-linecap': 'round', 'stroke-opacity': 0.7, class: 'wm-shine' }],
    ['circle', { cx: 7.6, cy: 7.1, r: 0.7, fill: SHINE, 'fill-opacity': 0.8, class: 'wm-shine' }],
  ]
}
