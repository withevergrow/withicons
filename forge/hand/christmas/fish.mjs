// christmas fish: slim green fish with forked tail, red side fin and clear eye; no snow cap.
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
const BODY = 'M2.5 12C4.5 7.8 8.5 6 12 6C15 6 17.5 7.8 18.5 10L21.5 7V17L18.5 14C17.5 16.2 15 18 12 18C8.5 18 4.5 16.2 2.5 12Z'
const FIN = 'M10.5 12.6C11.5 12.6 13 13.3 13.5 15C12 15.3 10.8 14.4 10.5 12.6Z'
const TOPFIN = 'M9.5 6.4L11 3.8C12.4 3.8 14 4.8 14.6 6.4C13 5.9 11 5.9 9.5 6.4Z'
export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  return [defs(id, 6, 18), k(TOPFIN, C1, { class: 'wm-a' }), k(BODY, C2), sh(BODY, id), k(FIN, C1, { 'stroke-width': 0.45, class: 'wm-a' }),
    ['circle', { cx: 7, cy: 10.6, r: 1.15, fill: SHINE, stroke: INK, 'stroke-width': 0.5 }],
    ['circle', { cx: 7.2, cy: 10.6, r: 0.55, fill: INK }]]
}
