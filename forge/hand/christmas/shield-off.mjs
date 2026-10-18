// shield-off: solid cranberry shield crossed by one continuous dark slash, thin snow line along the top edge.
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

const SH = 'M12 2.5L19.5 5.4V11C19.5 15.9 16.3 19.4 12 21.5C7.7 19.4 4.5 15.9 4.5 11V5.4Z'
const SNOW = 'M6.8 4.5L12 2.4L17.2 4.5Q16.1 5.5 15 4.8Q13.6 5.7 12.4 4.8Q11 5.6 9.9 4.9Q8 5.6 6.8 4.5Z'
export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  return [
    ['defs', {}, [grad(id(0), 2.5, 21.5), snowGrad(id(1), 2.4, 5.6)]],
    ['path', { d: SH, fill: C1, ...O, class: 'wm-k' }],
    ['path', { d: SH, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: SNOW, fill: `url(#${id(1)})`, stroke: INK, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: 'M3 3L21 21', stroke: INK, 'stroke-width': 2.8, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: 'M3 3L21 21', stroke: C2, 'stroke-width': 1.5, 'stroke-linecap': 'round', class: 'wm-s' }],
  ]
}
