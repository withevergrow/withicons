// christmas blocks: red block stacked on two green blocks (touching), big snow cap, light top rims.
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
const f = n => +n.toFixed(2)
const r = (x, y, s = 9.5) => `M${f(x + 1.6)} ${y}H${f(x + s - 1.6)}A1.6 1.6 0 0 1 ${f(x + s)} ${f(y + 1.6)}V${f(y + s - 1.6)}A1.6 1.6 0 0 1 ${f(x + s - 1.6)} ${f(y + s)}H${f(x + 1.6)}A1.6 1.6 0 0 1 ${x} ${f(y + s - 1.6)}V${f(y + 1.6)}A1.6 1.6 0 0 1 ${f(x + 1.6)} ${y}Z`
const TOP = r(7.25, 2.5), BOT = r(2, 12) + r(12.5, 12)
const RIM = 'M3.6 13.2H9.9M14.1 13.2H20.4M8.85 3.7H15.15'
const SNOW = 'M7.25 4.1Q7.25 2.5 8.85 2.5H15.15Q16.75 2.5 16.75 4.1V5.6Q16 5.4 15.6 6.4Q15.2 7.2 14.7 6.3Q14 5.2 13 5.9Q12.2 6.6 11.5 5.8Q10.6 5 9.8 6.1Q9.2 7 8.6 6Q8.1 5.3 7.25 5.6Z'
export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  return [defs(id, 2.5, 21.5), k(BOT, C2, { 'stroke-width': 0.9 }), sh(BOT, id), k(TOP, C1, { class: 'wm-a', 'stroke-width': 0.9 }), sh(TOP, id),
    ['path', { d: RIM, stroke: SHINE, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-opacity': 0.7, class: 'wm-shine' }],
    ['path', { d: SNOW, fill: `url(#${id(1)})`, stroke: INK, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-deco' }]]
}
