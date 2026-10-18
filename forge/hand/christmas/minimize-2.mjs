// forge/hand/christmas/minimize-2.mjs: two bold diagonal arrows (cranberry and pine) pointing inward to the centre, solid heads, no snow caps
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
  const a = 'M3.88 2.12L7.5 5.74L7.5 4A1.25 1.25 0 0 1 10 4L10 9.25A1.25 1.25 0 0 1 8.75 10.5L3.5 10.5A1.25 1.25 0 0 1 3.5 8L5.74 8L2.12 4.38A1.25 1.25 0 0 1 3.88 2.12Z'
  const b = 'M20.12 21.88L16.5 18.26L16.5 20A1.25 1.25 0 0 1 14 20L14 14.75A1.25 1.25 0 0 1 15.25 13.5L20.5 13.5A1.25 1.25 0 0 1 20.5 16L18.26 16L21.88 19.62A1.25 1.25 0 0 1 20.12 21.88Z'
  return [defs(id, 2, 2, 12, 22), K(a, C1), K(b, C1), G(a + b, id),
    ['path', { d: 'M12 9.6Q12.5 11.5 14.4 12Q12.5 12.5 12 14.4Q11.5 12.5 9.6 12Q11.5 11.5 12 9.6Z', fill: AC, stroke: INK, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }]]
}
