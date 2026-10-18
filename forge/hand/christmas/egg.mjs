// christmas egg: warm gold egg with a firm ink outline and soft top-left shine, no extra decoration.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), C2 = V('c2', '#1F6E46'), C3 = V('c3', '#E2A93B')
const SHINE = V('shine', '#FFFFFF'), TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716')
const defs = (id, y1, y2) => ['defs', {}, [
  ['linearGradient', { id: id(0), x1: 4, y1, x2: 14, y2, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.3 }],
    ['stop', { offset: 0.45, 'stop-color': SHINE, 'stop-opacity': 0 }],
    ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.35 }],
  ]],
  ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 0, y2: 6, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0.25, 'stop-color': SHINE }],
    ['stop', { offset: 1, 'stop-color': TINT }],
  ]],
]]
const k = (d, fill, extra = {}) => ['path', { d, fill, stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k', ...extra }]
const sh = (d, id) => ['path', { d, fill: `url(#${id(0)})`, class: 'wm-shine' }]
const EGG = 'M12 2.5C8 2.5 5 9 5 14.5C5 18.6 8.1 21.5 12 21.5C15.9 21.5 19 18.6 19 14.5C19 9 16 2.5 12 2.5Z'
export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  return [defs(id, 2.5, 21.5), k(EGG, C3), sh(EGG, id),
    ['path', { d: 'M8.6 8.2C9.2 6.6 10.1 5.4 11 4.9', stroke: SHINE, 'stroke-width': 1, 'stroke-linecap': 'round', 'stroke-opacity': 0.75, class: 'wm-shine' }]]
}
