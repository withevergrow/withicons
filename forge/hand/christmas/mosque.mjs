// forge/hand/christmas/mosque.mjs: a mosque: pine hall with an arched door, a gold onion dome with crescent finial and a separate tall minaret; thin snow on the hall roof
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
  const hall = 'M3 12L15 12L15 21L10.6 21L10.6 17.6A1.6 1.6 0 0 0 7.4 17.6L7.4 21L3 21Z'
  const dome = 'M4.2 12C4.2 8.6 6.8 7.6 9 5.8C11.2 7.6 13.8 8.6 13.8 12Z'
  const mina = 'M17 9L21 9L20.4 10.4L20.4 21L17.6 21L17.6 10.4Z'
  const cap = 'M17.4 9L19 5.2L20.6 9Z'
  const base = 'M2 20.6L22 20.6L22 22L2 22Z'
  const moon = 'M9 1.4A1.7 1.7 0 1 0 10.4 4.4A1.35 1.35 0 1 1 9 1.4Z'
  const snow = 'M2.9 12.2L15.1 12.2L15.1 13.2Q14 13 13.4 13.8Q12.8 13 11 13.2L3 13.2Z'
  return [defs(id, 3, 4, 14, 22),
    K(hall, C2), K(mina, C2), K(dome, C3), K(cap, C1), K(base, C1),
    G(hall + mina + dome, id),
    ['path', { d: 'M18.4 13.4h1.2v2h-1.2z', fill: AC, stroke: INK, 'stroke-width': 0.3, class: 'wm-deco' }],
    ['path', { d: 'M9 5.8L9 4.2', fill: 'none', stroke: INK, 'stroke-width': 0.6, 'stroke-linecap': 'round' }],
    K(moon, AC, 'wm-s', 0.35), SNOW(snow, id)]
}
