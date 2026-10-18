// split: solid green stem forking into two cranberry branches with open arrowheads, ink-outlined, no snow.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), C2 = V('c2', '#1F6E46'), C4 = V('c4', '#FFF5E6')
const SHINE = V('shine', '#FFFFFF'), TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716'), ACC = V('accent', '#F4C24D')
const grad = (id, y1, y2) => ['linearGradient', { id, x1: 0, y1, x2: 0, y2, gradientUnits: 'userSpaceOnUse' }, [
  ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.3 }],
  ['stop', { offset: 0.5, 'stop-color': SHINE, 'stop-opacity': 0 }],
  ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.32 }],
]]
const snowGrad = (id, y1, y2) => ['linearGradient', { id, x1: 0, y1, x2: 0, y2, gradientUnits: 'userSpaceOnUse' }, [
  ['stop', { offset: 0.25, 'stop-color': SHINE }], ['stop', { offset: 1, 'stop-color': TINT }],
]]
const O = { stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
void ACC; void C2; void C4; void TINT; void snowGrad; void grad; void O

const STEM = 'M12 21V13.5'
const BR = 'M12 13.5L5.5 7M12 13.5L18.5 7M5 11V6H10M14 6H19V11'
const line = (d, w, c, cls) => ['path', { d, stroke: c, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls }]
export default function render() {
  return [
    line(STEM + BR, 3.8, INK, 'wm-k'),
    line(STEM + BR, 2.4, C1, 'wm-k'),
    line('M11.5 20V14.6M11.4 13.1L6.5 8.2', 0.6, SHINE, 'wm-shine'),
  ]
}
