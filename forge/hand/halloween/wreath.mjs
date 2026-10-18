// forge/hand/halloween/wreath.mjs — an open ring of slime-green leaves with a cut-out centre, pumpkin-orange berries
// and a small orange bow at the bottom; the empty middle is what makes it read as a wreath at 16px.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), C4 = V('c4', '#86D13A')
const ACCENT = V('accent', '#FFB52E'), SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-wreath-${n}`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const f = n => +n.toFixed(2)
const CX = 12, CY = 11.6

// scalloped outer edge (12 leaf bumps) + circular hole, even-odd
function ring(dx = 0, dy = 0) {
  const N = 12, R = 8.4, r = 4.3, cx = CX + dx, cy = CY + dy
  const P = i => { const a = -Math.PI / 2 + i * 2 * Math.PI / N; return [f(cx + R * Math.cos(a)), f(cy + R * Math.sin(a))] }
  let d = `M${P(0).join(' ')}`
  for (let i = 1; i <= N; i++) d += `A2.3 2.3 0 0 1 ${P(i).join(' ')}`
  d += `ZM${f(cx)} ${f(cy - r)}A${r} ${r} 0 1 0 ${f(cx)} ${f(cy + r)}A${r} ${r} 0 1 0 ${f(cx)} ${f(cy - r)}Z`
  return d
}

export default function render() {
  const berries = [[-40, 0], [60, 1], [150, 2], [210, 3]].map(([deg]) => {
    const a = deg * Math.PI / 180
    return ['circle', { cx: f(CX + 6.6 * Math.cos(a)), cy: f(CY + 6.6 * Math.sin(a)), r: 1.05, fill: C1, stroke: INK, 'stroke-width': 0.6, class: 'wm-deco' }]
  })
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 12.6, r: 11, fx: 9, fy: 8, gradientUnits: 'userSpaceOnUse' }, [st(0, C4), st(0.6, C4), st(1, C4, 0.85)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 13, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, ACCENT, 0.3), st(0.55, ACCENT, 0.13), st(1, ACCENT, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(1)})`, class: 'wm-deco' }],
    ['path', { d: ring(0.15, 0.85), fill: SHADOW, 'fill-opacity': 0.3, 'fill-rule': 'evenodd', class: 'wm-shadow' }],
    ['path', { d: ring(), fill: `url(#${id(0)})`, 'fill-rule': 'evenodd', stroke: INK, 'stroke-width': 0.85, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M5.6 9.2C6.3 6.6 8.4 4.7 11 4.3', fill: 'none', stroke: SHINE, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.6, class: 'wm-shine' }],
    ...berries,
    ['path', { d: 'M12 19.4L8.6 17.6V21.2ZM12 19.4L15.4 17.6V21.2Z', fill: C1, stroke: INK, 'stroke-width': 0.75, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M11.2 19.4L10.2 22.6M12.8 19.4L13.8 22.6', fill: 'none', stroke: C2, 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['circle', { cx: 12, cy: 19.4, r: 1.05, fill: C2, stroke: INK, 'stroke-width': 0.7, class: 'wm-a' }],
  ]
}
