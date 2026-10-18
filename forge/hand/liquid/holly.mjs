// forge/hand/liquid/holly.mjs: two spiky glass holly leaves with veins and a cluster of three red berries.
const N = 'holly'
const r2 = v => Math.round(v * 100) / 100
const P = (x, y) => `${r2(x)} ${r2(y)}`
const G = n => `url(#wg-liquid-${N}-${n})`
const V = (role, hex) => `var(--with-liquid-${role}, ${hex})`

// spiky leaf from base (x1,y1) to tip (x2,y2): spines on both sides, concave scallops between
function leaf(x1, y1, x2, y2, W) {
  const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, nx = -uy, ny = ux
  const at = (t, o) => P(x1 + ux * L * t + nx * o, y1 + uy * L * t + ny * o)
  const ts = [0, 0.22, 0.47, 0.73, 1]
  const wd = t => W * Math.sin(Math.PI * Math.min(1, t * 1.08)) ** 0.8
  const side = s => {
    const seq = s === 1 ? ts : [...ts].reverse()
    let d = ''
    for (let i = 1; i < seq.length; i++) {
      const a = seq[i - 1], b = seq[i], m = (a + b) / 2
      const ob = (b === 0 || b === 1) ? 0 : s * (wd(b) + 0.5)
      d += `Q${at(m, s * wd(m) * 0.55)} ${at(b, ob)}`
    }
    return d
  }
  return { d: `M${at(0, 0)}${side(1)}${side(-1)}Z`, vein: `M${at(0.04, 0)}L${at(0.9, 0)}`, at }
}
const circ = (cx, cy, r, a) => ['circle', { cx, cy, r, ...a }]

export default function render() {
  const A = leaf(11, 14.5, 2.4, 5.4, 3.1), B = leaf(13, 14.5, 21.6, 5.4, 3.1)
  const defs = ['defs', {}, [
    ['linearGradient', { id: `wg-liquid-${N}-0`, x1: 4, y1: 5, x2: 12, y2: 15, gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: 0, 'stop-color': V('c2', '#5FD08A') }], ['stop', { offset: 1, 'stop-color': V('c3', '#16784A') }]]],
    ['radialGradient', { id: `wg-liquid-${N}-1`, cx: 11, cy: 16, r: 6, gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: 0, 'stop-color': V('accent', '#FF5A5F') }], ['stop', { offset: 1, 'stop-color': V('c4', '#B3121E') }]]],
  ]]
  const lf = l => ['path', { d: l.d, fill: G(0), 'fill-opacity': 0.9, stroke: 'currentColor', 'stroke-opacity': 0.35, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-k' }]
  const vein = l => ['path', { d: l.vein, stroke: V('edge', '#E6FFF0'), 'stroke-opacity': 0.85, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }]
  const bs = [[12, 15.6, 2.5], [8.9, 19, 2.3], [15.1, 19, 2.3]]
  return [defs,
    ['ellipse', { cx: 12, cy: 21.9, rx: 6.5, ry: 0.9, fill: V('shadow', '#0C1A3A'), 'fill-opacity': 0.18, class: 'wm-shadow' }],
    lf(A), lf(B), vein(A), vein(B),
    ...bs.map(([x, y, r]) => circ(x, y, r, { fill: G(1), stroke: 'currentColor', 'stroke-opacity': 0.35, 'stroke-width': 0.3, class: 'wm-a' })),
    ...bs.map(([x, y, r]) => circ(r2(x - r * 0.35), r2(y - r * 0.35), r2(r * 0.3), { fill: V('shine', '#FFFFFF'), 'fill-opacity': 0.85, class: 'wm-shine' })),
  ]
}
