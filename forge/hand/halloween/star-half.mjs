// forge/hand/halloween/star-half.mjs — a star split down its vertical axis: left half pumpkin orange, right half a pale
// bone-white empty half, one ink outline round the whole star (no cat, so the fill reads as half).
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), ACCENT = V('accent', '#FFB52E')
const TINT = V('tint', '#FFF1B8'), SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-star-half-${n}`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const f = n => +n.toFixed(2)

function pts(dx = 0, dy = 0) {
  const p = []
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 4.3 : 9.6
    p.push([f(12 + dx + r * Math.cos(a)), f(12.6 + dy + r * Math.sin(a))])
  }
  return p
}
const path = p => 'M' + p.map(q => `${q[0]} ${q[1]}`).join('L') + 'Z'

export default function render() {
  const p = pts()
  // vertices 0 (top) .. 5 (bottom inner) clockwise are the right half; 5..10 the left half
  const left = [p[5], p[6], p[7], p[8], p[9], p[0]]
  const right = [p[0], p[1], p[2], p[3], p[4], p[5]]
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.6, r: 12, fx: 8.4, fy: 9, gradientUnits: 'userSpaceOnUse' }, [st(0, C1), st(0.45, C1), st(1, C2)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 13, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, ACCENT, 0.3), st(0.55, ACCENT, 0.13), st(1, ACCENT, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(1)})`, class: 'wm-deco' }],
    ['path', { d: path(pts(0.15, 0.85)), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: path(right), fill: TINT, 'fill-opacity': 0.9, class: 'wm-k' }],
    ['path', { d: path(left), fill: `url(#${id(0)})`, class: 'wm-k' }],
    ['path', { d: `M12 ${p[0][1]}V${p[5][1]}`, stroke: INK, 'stroke-width': 0.8, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }],
    ['path', { d: path(p), fill: 'none', stroke: INK, 'stroke-width': 0.9, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M11.2 5.6L9.6 9.4M5.4 10.3H8.2', fill: 'none', stroke: SHINE, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.7, class: 'wm-shine' }],
  ]
}
