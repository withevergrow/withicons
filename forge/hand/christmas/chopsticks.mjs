// forge/hand/christmas/chopsticks.mjs — two parallel angled red chopsticks resting in a mound of rice in a green bowl with a white rim.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), C2 = V('c2', '#1F6E46'), C3 = V('c3', '#E2A93B'), C4 = V('c4', '#FFF5E6')
const SHINE = V('shine', '#FFFFFF'), SHADOW = V('shadow', '#4A0716')
const K = { stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const f = n => +n.toFixed(2)
const grad = (id, y1, y2) => ['defs', {}, [
  ['linearGradient', { id, x1: 0, y1, x2: 0, y2, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.3 }],
    ['stop', { offset: 0.45, 'stop-color': SHINE, 'stop-opacity': 0 }],
    ['stop', { offset: 0.6, 'stop-color': SHADOW, 'stop-opacity': 0 }],
    ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.38 }],
  ]],
]]
const spark = (x, y, r) => ['path', { d: `M${x} ${f(y - r)}Q${x} ${y} ${f(x + r)} ${y}Q${x} ${y} ${x} ${f(y + r)}Q${x} ${y} ${f(x - r)} ${y}Q${x} ${y} ${x} ${f(y - r)}Z`, fill: C3, stroke: INK, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-deco' }]

// tapered stick from base (bx,by) to tip (tx,ty) with half-widths wb / wt
const stick = (bx, by, tx, ty, wb, wt) => {
  const dx = tx - bx, dy = ty - by, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L
  const p = (x, y, w, s) => `${f(x + nx * w * s)} ${f(y + ny * w * s)}`
  return `M${p(bx, by, wb, -1)}L${p(bx, by, wb, 1)}L${p(tx, ty, wt, 1)}L${p(tx, ty, wt, -1)}Z`
}

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  const a = stick(8.8, 11.8, 15.4, 2.6, 0.5, 0.9), b = stick(12.4, 11.8, 19.4, 3.4, 0.5, 0.9)
  const bowl = 'M3 13.4L21 13.4Q21 21.4 12 21.4Q3 21.4 3 13.4Z'
  return [
    grad(id(0), 12, 21.5),
    ['path', { d: a, fill: C1, ...K, class: 'wm-a' }],
    ['path', { d: b, fill: C1, ...K, class: 'wm-a' }],
    ['path', { d: 'M13.4 5.1L14.7 6.2M17.2 5.8L18.5 6.9', stroke: C3, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: 'M6 13.4Q6.4 9.6 12 8.9Q17.6 9.6 18 13.4Z', fill: C4, ...K, class: 'wm-k' }],
    ['path', { d: 'M9.2 12L10 11.2M12.4 11.8L13.4 11M15 12.2L15.7 11.5M11 10L11.8 9.8', stroke: INK, 'stroke-opacity': 0.55, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M8.6 20.6L15.4 20.6L15.4 22Q15.4 22.6 14.8 22.6L9.2 22.6Q8.6 22.6 8.6 22L8.6 20.6Z', fill: C3, ...K, class: 'wm-k' }],
    ['path', { d: bowl, fill: C2, ...K, class: 'wm-k' }],
    ['path', { d: bowl, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: 'M2.8 12.4L21.2 12.4Q22 12.4 22 13.1L22 13.7Q22 14.4 21.2 14.4L2.8 14.4Q2 14.4 2 13.7L2 13.1Q2 12.4 2.8 12.4Z', fill: C4, ...K, class: 'wm-k' }],
    ['circle', { cx: 8, cy: 17, r: 0.6, fill: C3, class: 'wm-deco' }],
    ['circle', { cx: 12, cy: 18.4, r: 0.6, fill: C3, class: 'wm-deco' }],
    ['circle', { cx: 16, cy: 17, r: 0.6, fill: C3, class: 'wm-deco' }],
    spark(4.4, 5.4, 1.7),
  ]
}
