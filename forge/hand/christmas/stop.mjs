// stop: evergreen ring around a solid cranberry stop square, distinct from the plain red square icon.
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

const RING = 'M12 2.5A9.5 9.5 0 1 1 12 21.5A9.5 9.5 0 1 1 12 2.5ZM12 4.6A7.4 7.4 0 1 0 12 19.4A7.4 7.4 0 1 0 12 4.6Z'
const DISC = 'M12 4.6A7.4 7.4 0 1 1 12 19.4A7.4 7.4 0 1 1 12 4.6Z'
const SQ = 'M9.4 8.2H14.6A1.2 1.2 0 0 1 15.8 9.4V14.6A1.2 1.2 0 0 1 14.6 15.8H9.4A1.2 1.2 0 0 1 8.2 14.6V9.4A1.2 1.2 0 0 1 9.4 8.2Z'
export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  return [
    ['defs', {}, [grad(id(0), 2.5, 21.5), grad(id(1), 8.2, 15.8)]],
    ['path', { d: DISC, fill: C4, class: 'wm-k' }],
    ['path', { d: RING, fill: C2, 'fill-rule': 'evenodd', ...O, class: 'wm-k' }],
    ['path', { d: RING, fill: `url(#${id(0)})`, 'fill-rule': 'evenodd', class: 'wm-shine' }],
    ['path', { d: SQ, fill: C1, ...O, class: 'wm-a' }],
    ['path', { d: SQ, fill: `url(#${id(1)})`, class: 'wm-shine' }],
  ]
}
