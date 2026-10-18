// forge/hand/christmas/mistletoe.mjs: a hanging mistletoe sprig: red bow on top, a short stem, two bold pine leaves and three white berries
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
  const bow = 'M12 5.2C10.6 3.4 7.6 2.4 7.4 4.6C7.3 6.6 10.2 6.6 12 5.6C13.8 6.6 16.7 6.6 16.6 4.6C16.4 2.4 13.4 3.4 12 5.2Z'
  const tails = 'M11.4 6L10 9.2L11.3 8.8L12 9.8L12.7 8.8L14 9.2L12.6 6Z'
  const knot = circ(12, 5.3, 1.05)
  const stem = 'M11.4 9L12.6 9L12.6 13.2L11.4 13.2Z'
  const lf = 'M11.6 13.4C9 11.8 4.2 12.6 3.4 16.6C6.6 18.6 10.6 17.4 11.6 13.4Z'
  const rf = 'M12.4 13.4C15 11.8 19.8 12.6 20.6 16.6C17.4 18.6 13.4 17.4 12.4 13.4Z'
  const ber = circ(12, 15.6, 1.55) + circ(9.9, 18.6, 1.55) + circ(14.1, 18.6, 1.55)
  return [defs(id, 3, 3, 14, 21),
    K(stem, C2), K(lf, C2), K(rf, C2), G(lf + rf, id),
    ['path', { d: 'M11 13.6Q7.6 14 5 16.3M13 13.6Q16.4 14 19 16.3', fill: 'none', stroke: SHADOW, 'stroke-opacity': 0.45, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-deco' }],
    K(ber, C4, 'wm-s', 0.55),
    ['path', { d: circ(11.5, 15.1, 0.4) + circ(9.4, 18.1, 0.4) + circ(13.6, 18.1, 0.4), fill: SHINE, class: 'wm-shine' }],
    K(tails, C1, 'wm-a'), K(bow, C1, 'wm-a'), K(knot, C1, 'wm-a', 0.5), G(bow + tails, id)]
}
