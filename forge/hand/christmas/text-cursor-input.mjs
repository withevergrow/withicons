// text-cursor-input: cream input field in a cranberry frame, plain dark I-beam cursor and a green typed dash.
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

const FRAME = 'M4.5 5.5H19.5A2.5 2.5 0 0 1 22 8V16A2.5 2.5 0 0 1 19.5 18.5H4.5A2.5 2.5 0 0 1 2 16V8A2.5 2.5 0 0 1 4.5 5.5ZM4.8 7.3A1 1 0 0 0 3.8 8.3V15.7A1 1 0 0 0 4.8 16.7H19.2A1 1 0 0 0 20.2 15.7V8.3A1 1 0 0 0 19.2 7.3Z'
const FIELD = 'M4.8 7.3H19.2A1 1 0 0 1 20.2 8.3V15.7A1 1 0 0 1 19.2 16.7H4.8A1 1 0 0 1 3.8 15.7V8.3A1 1 0 0 1 4.8 7.3Z'
const CURSOR = 'M12.6 8.8V15.2M11.3 8.6H13.9M11.3 15.4H13.9'
export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  return [
    ['defs', {}, [grad(id(0), 5.5, 18.5)]],
    ['path', { d: FIELD, fill: C4, class: 'wm-k' }],
    ['path', { d: FRAME, fill: C1, 'fill-rule': 'evenodd', ...O, class: 'wm-k' }],
    ['path', { d: FRAME, fill: `url(#${id(0)})`, 'fill-rule': 'evenodd', class: 'wm-shine' }],
    ['path', { d: 'M6.2 12H9.4', stroke: C2, 'stroke-width': 1.6, 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['path', { d: CURSOR, stroke: INK, 'stroke-width': 1.3, 'stroke-linecap': 'round', class: 'wm-a' }],
  ]
}
