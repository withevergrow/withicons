// shankh: cream conch shell, pointed spire on the left with a cranberry spiral whorl, flared cranberry mouth on the right.
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

const BODY = 'M1.8 12C3.5 9 6.6 6.6 8.6 5.9L9.6 4.2L11 5.4L12.6 3.8L13.8 5.1C13 5 15 4.8 16.4 4.6L21.6 2.8C22.8 9 22.8 15 21.6 21.2L16.4 19.4C15 19.2 13 19 10.5 18.4C7 17.6 3.5 15 1.8 12Z'
const LIP = 'M16.4 4.6L21.6 2.8C22.8 9 22.8 15 21.6 21.2L16.4 19.4C17.8 15 17.8 9 16.4 4.6Z'
const BANDS = 'M7.4 12A1.1 1.1 0 1 1 8.6 13.2A2.3 2.3 0 0 1 5.5 10.9A3.4 3.4 0 0 1 10.6 8.7C12 10.5 12.6 13.5 12.6 17.9M13 6Q14.6 12 14.6 18.4'
export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  return [
    ['defs', {}, [grad(id(0), 2.8, 21.2)]],
    ['path', { d: BODY, fill: C4, stroke: INK, 'stroke-width': 0.9, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: BODY, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: BANDS, stroke: C1, 'stroke-width': 1.3, 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['path', { d: LIP, fill: C1, stroke: INK, 'stroke-width': 0.9, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M18.6 6.4Q19.6 12 18.6 17.6', stroke: SHINE, 'stroke-width': 0.7, 'stroke-linecap': 'round', 'stroke-opacity': 0.7, class: 'wm-shine' }],
  ]
}
