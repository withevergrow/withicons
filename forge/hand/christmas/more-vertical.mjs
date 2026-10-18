// forge/hand/christmas/more-vertical.mjs — three plain cranberry dots stacked on a clean vertical rhythm, larger and
// outlined, replacing the generated dots whose snow cap on the top dot read as an ornament hook at 16px.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), SHINE = V('shine', '#FFFFFF'), SHADOW = V('shadow', '#4A0716')
const R = 2.25
const disc = (cx, cy) => `M${cx - R} ${cy}a${R} ${R} 0 1 0 ${2 * R} 0a${R} ${R} 0 1 0 ${-2 * R} 0Z`

const light = (n, cx, cy) => ['linearGradient', { id: 'wg-christmas-more-vertical-' + n, x1: cx - R, y1: cy - R, x2: cx + 0.5, y2: cy + R, gradientUnits: 'userSpaceOnUse' }, [
  ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.4 }],
  ['stop', { offset: 0.42, 'stop-color': SHINE, 'stop-opacity': 0 }],
  ['stop', { offset: 0.58, 'stop-color': SHADOW, 'stop-opacity': 0 }],
  ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.42 }],
]]

export default function render() {
  const at = [5, 12, 19].map(v => ([12, v]))
  return [
    ['defs', {}, at.map(([x, y], n) => light(n, x, y))],
    ['path', { d: at.map(([x, y]) => disc(x, y)).join(''), fill: C1, stroke: INK, 'stroke-width': 0.6, class: 'wm-k' }],
    ...at.map(([x, y], n) => ['path', { d: disc(x, y), fill: 'url(#wg-christmas-more-vertical-' + n + ')', class: 'wm-shine' }]),
  ]
}
