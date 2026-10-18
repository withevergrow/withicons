// forge/hand/christmas/motorcycle.mjs: a motorcycle side view: two ringed wheels, a pine frame, a cranberry tank and seat, gold headlight
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), C2 = V('c2', '#1F6E46'), C3 = V('c3', '#E2A93B')
const C4 = V('c4', '#FFF5E6'), AC = V('accent', '#F4C24D'), SHINE = V('shine', '#FFFFFF')
const TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716')
const defs = (id, x1, y1, x2, y2) => ['defs', {}, [
  ['linearGradient', { id: id(0), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.34 }],
    ['stop', { offset: 0.42, 'stop-color': SHINE, 'stop-opacity': 0 }],
    ['stop', { offset: 0.58, 'stop-color': SHADOW, 'stop-opacity': 0 }],
    ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.42 }]]],
  ['linearGradient', { id: id(1), x1: 0, y1: 11, x2: 0, y2: 14, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0.25, 'stop-color': SHINE }], ['stop', { offset: 1, 'stop-color': TINT }]]]]]
const K = (d, fill, cls = 'wm-k', w = 0.6) => ['path', { d, fill, stroke: INK, 'stroke-width': w, 'stroke-linejoin': 'round', class: cls }]
const G = (d, id) => ['path', { d, fill: `url(#${id(0)})`, class: 'wm-shine' }]
const SNOW = (d, id) => ['path', { d, fill: `url(#${id(1)})`, stroke: INK, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }]
const r2 = v => Math.round(v * 100) / 100
const circ = (cx, cy, r) => `M${r2(cx - r)} ${r2(cy)}a${r} ${r} 0 1 0 ${r2(2 * r)} 0a${r} ${r} 0 1 0 ${r2(-2 * r)} 0z`
export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  const wheel = cx => circ(cx, 16.5, 3.6) + circ(cx, 16.5, 1.6)
  const frame = 'M5.2 15.8L9 11.6L15.2 11.6L18.6 15.8L17.2 16.8L14.4 13.4L12.6 16.4L9.4 16.4L7.4 13.4L6.6 16.8Z'
  const tank = 'M8.2 11.8C8.6 9.4 10.8 8.6 12.8 9.2L13.6 11.8Z'
  const seat = 'M13 10.4L17.2 10.4A1 1 0 0 1 17.2 12.2L13.6 12.2Z'
  const fork = 'M16.6 8.6L18 8.2L19.6 15.8L18.4 16.2Z'
  const bar = 'M15.8 7.2L18.6 6.6A0.7 0.7 0 0 1 18.9 8L16.1 8.6A0.7 0.7 0 0 1 15.8 7.2Z'
  const lamp = circ(19.6, 10.2, 1.1)
  return [defs(id, 2, 6, 14, 21),
    ['path', { d: wheel(5.6) + wheel(18.4), fill: INK, 'fill-rule': 'evenodd', stroke: INK, 'stroke-width': 0.6, class: 'wm-a' }],
    ['path', { d: circ(5.6, 16.5, 2.5) + circ(18.4, 16.5, 2.5), fill: 'none', stroke: C4, 'stroke-width': 0.5, 'stroke-opacity': 0.7, class: 'wm-deco' }],
    K(fork, C2), K(frame, C2), K(tank, C1), K(seat, C1), K(bar, C1),
    K(lamp, AC, 'wm-s', 0.45), G(frame + tank + seat, id)]
}
