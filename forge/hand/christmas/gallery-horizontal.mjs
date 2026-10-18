// christmas gallery-horizontal: one large red frame with a plain mountain and sun, slim side cards; no sparkle.
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
const FRAME = 'M7.5 4H16.5A1.5 1.5 0 0 1 18 5.5V18.5A1.5 1.5 0 0 1 16.5 20H7.5A1.5 1.5 0 0 1 6 18.5V5.5A1.5 1.5 0 0 1 7.5 4Z'
const PIC = 'M8.5 6.5H15.5V17.5H8.5Z'
const SIDES = 'M2 7.25A1.25 1.25 0 0 1 4.5 7.25V16.75A1.25 1.25 0 0 1 2 16.75ZM19.5 7.25A1.25 1.25 0 0 1 22 7.25V16.75A1.25 1.25 0 0 1 19.5 16.75Z'
const MTN = 'M8.5 17.5L11.25 12.5L13 15L14 13.75L15.5 15.75V17.5Z'
export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  return [defs(id, 4, 20), k(SIDES, C1, { class: 'wm-a' }), sh(SIDES, id), k(FRAME, C1), sh(FRAME, id),
    ['path', { d: PIC, fill: SHINE, stroke: INK, 'stroke-width': 0.45, 'stroke-linejoin': 'round' }],
    ['path', { d: MTN, fill: C2, stroke: INK, 'stroke-width': 0.4, 'stroke-linejoin': 'round' }],
    ['circle', { cx: 13.75, cy: 9.25, r: 1.25, fill: C3, stroke: INK, 'stroke-width': 0.4 }]]
}
