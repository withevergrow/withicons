// forge/hand/christmas/nutcracker.mjs: a nutcracker: tall black hat with gold band, cream face with two eyes, white moustache, jaw line, red coat with gold buttons
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
  const hat = 'M7.6 9L8.2 2.6A1 1 0 0 1 9.2 1.8L14.8 1.8A1 1 0 0 1 15.8 2.6L16.4 9Z'
  const band = 'M7.8 7.2L16.2 7.2L16.4 9L7.6 9Z'
  const face = 'M7.8 9L16.2 9L16.2 13.4A2 2 0 0 1 14.2 15.4L9.8 15.4A2 2 0 0 1 7.8 13.4Z'
  const coat = 'M5 22L5 18.6A3.2 3.2 0 0 1 8.2 15.4L15.8 15.4A3.2 3.2 0 0 1 19 18.6L19 22Z'
  const mous = 'M12 12C10.8 11.2 9 11.4 8.8 12.8C10 12.4 11 13 12 12.8C13 13 14 12.4 15.2 12.8C15 11.4 13.2 11.2 12 12Z'
  const btn = circ(12, 17.8, 0.65) + circ(12, 20.2, 0.65)
  return [defs(id, 5, 2, 15, 22),
    K(coat, C1), K(face, C4), K(hat, INK), K(band, AC, 'wm-deco', 0.4), G(hat + coat, id),
    ['path', { d: circ(10.1, 10.6, 0.6) + circ(13.9, 10.6, 0.6), fill: INK }],
    ['path', { d: 'M10 14.2L14 14.2M10.6 15.4L10.6 14.2M13.4 15.4L13.4 14.2', fill: 'none', stroke: INK, 'stroke-width': 0.55, 'stroke-linecap': 'round' }],
    K(mous, SHINE, 'wm-deco', 0.45),
    ['path', { d: 'M12 15.4L12 22', fill: 'none', stroke: SHADOW, 'stroke-opacity': 0.5, 'stroke-width': 0.5 }],
    K(btn, AC, 'wm-s', 0.35),
    ['path', { d: circ(10.4, 10.4, 0.18) + circ(14.2, 10.4, 0.18), fill: SHINE }]]
}
