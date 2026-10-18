// forge/hand/soft3d/laugh.mjs — a laughing soft 3D face: closed happy eyes as thick dark arches and a wide open grin (a dark
// mouth with a white row of teeth and a pink tongue), so the laugh reads at 16px (the generated one turned the eye arcs
// into goggle rings and the grin into a grey blob that hid the smile).
// Roles (as forge/palettes/laugh.json): face c1, mouth c2, eyes ink, tongue accent, teeth shine, shadow.
// Motion: face wm-k, eyes and mouth wm-a (the A part nods about 12 12), contact shadow wm-shadow, highlights wm-shine.
const N = 'laugh'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = {
  c1: v('c1', '#F5A524'), c2: v('c2', '#3A404C'), ink: v('ink', '#232733'), accent: v('accent', '#FF6A4D'),
  shadow: v('shadow', '#1D2130'), shine: v('shine', '#FFFFFF'),
}
const f = n => +(+n).toFixed(2)
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a = 1) => ['stop', a === 1 ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls = 'wm-k') => ['path', { d, ...a, class: cls }]
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0Z`
const circ = (x, y, r) => ell(x, y, r, r)
const arc = (cx, cy, r, a0, a1) => { const p = a => [f(cx + r * Math.cos(a * Math.PI / 180)), f(cy + r * Math.sin(a * Math.PI / 180))]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0} ${y0}A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 1 : 0} ${x1} ${y1}` }

// the face: a soft round slab like the generated front-mode faces (face disc, a lower wall, a curvature gradient, a lit
// rim on the upper left and a soft dark rim on the lower right, a contact shadow)
const X = 12, Y = 10.76, R = 9.07
function face(n) {
  n.push(P(ell(12.35, 20.77, 9.07, 1.63), { fill: C.shadow, 'fill-opacity': 0.06 }, 'wm-shadow'))
  n.push(P(ell(12.35, 20.77, 7.25, 1.31), { fill: C.shadow, 'fill-opacity': 0.08 }, 'wm-shadow'))
  n.push(P(ell(12.35, 20.77, 5.26, 0.95), { fill: C.shadow, 'fill-opacity': 0.11 }, 'wm-shadow'))
  const wall = circ(X, Y + 0.84, R)
  n.push(P(wall, { fill: C.c1 }), P(wall, { fill: C.shadow, 'fill-opacity': 0.32 }))
  const disc = circ(X, Y, R)
  n.push(P(disc, { fill: C.c1 }), P(disc, { fill: url(0) }))
  const rim = { fill: 'none', 'stroke-width': 0.56, 'stroke-linecap': 'round' }
  n.push(P(arc(X, Y, R - 0.3, 160, 290), { ...rim, stroke: C.shine, 'stroke-opacity': 0.57 }, 'wm-shine'))
  n.push(P(arc(X, Y, R - 0.3, 130, 160) + arc(X, Y, R - 0.3, 290, 315), { ...rim, stroke: C.shine, 'stroke-opacity': 0.25 }, 'wm-shine'))
  n.push(P(arc(X, Y, R - 0.3, -20, 115), { ...rim, stroke: C.shadow, 'stroke-opacity': 0.38 }))
}
const faceGrad = () => ['radialGradient', { id: id(0), cx: 0.34, cy: 0.26, r: 0.92 }, [stop(0, C.shine, 0.58), stop(0.38, C.shine, 0.06), stop(0.7, C.shadow, 0), stop(1, C.shadow, 0.26)]]

export default function render() {
  const n = [['defs', {}, [faceGrad()]]]
  face(n)
  // happy closed eyes: thick dark arches
  const st = { fill: 'none', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  const eyes = 'M7.4 9.5C7.8 7.9 8.6 7.2 9.15 7.2C9.7 7.2 10.5 7.9 10.9 9.5M13.1 9.5C13.5 7.9 14.3 7.2 14.85 7.2C15.4 7.2 16.2 7.9 16.6 9.5'
  n.push(P('M7.52 9.72C7.92 8.12 8.72 7.42 9.27 7.42C9.82 7.42 10.62 8.12 11.02 9.72M13.22 9.72C13.62 8.12 14.42 7.42 14.97 7.42C15.52 7.42 16.32 8.12 16.72 9.72', { ...st, stroke: C.shadow, 'stroke-opacity': 0.26 }))
  n.push(P(eyes, { ...st, stroke: C.ink }, 'wm-a'))
  // the open grin: a lit lip rim around a dark mouth, teeth along the top, tongue at the bottom
  const mouth = 'M7.1 12.3H16.9C17.4 12.3 17.55 12.6 17.5 13C17.1 16.1 14.8 18.1 12 18.1C9.2 18.1 6.9 16.1 6.5 13C6.45 12.6 6.6 12.3 7.1 12.3Z'
  n.push(P('M7.3 12.6H17.1C17.6 12.6 17.75 12.9 17.7 13.3C17.3 16.4 15 18.4 12.2 18.4C9.4 18.4 7.1 16.4 6.7 13.3C6.65 12.9 6.8 12.6 7.3 12.6Z', { fill: C.shadow, 'fill-opacity': 0.24 }))
  n.push(P(mouth, { fill: C.c2 }, 'wm-a'))
  n.push(P('M7.25 12.85H16.75C16.62 13.55 16.45 14 16.25 14.3H7.75C7.55 14 7.38 13.55 7.25 12.85Z', { fill: C.shine }, 'wm-a'))
  n.push(P('M7.75 14.3H16.25C16.1 14.55 15.9 14.8 15.7 15H8.3C8.1 14.8 7.9 14.55 7.75 14.3Z', { fill: C.shadow, 'fill-opacity': 0.3 }, 'wm-a'))
  n.push(P('M9.15 16.55C9.8 15.6 10.85 15.15 12 15.15C13.15 15.15 14.2 15.6 14.85 16.55C14.05 17.3 13.1 17.6 12 17.6C10.9 17.6 9.95 17.3 9.15 16.55Z', { fill: C.accent }, 'wm-a'))
  n.push(P('M10.6 15.75C11.05 15.55 11.5 15.5 12 15.5', { fill: 'none', stroke: C.shine, 'stroke-opacity': 0.45, 'stroke-width': 0.3, 'stroke-linecap': 'round' }, 'wm-a'))
  // lip bevel: a soft lit edge along the lower lip
  n.push(P('M7.6 15.4C8.5 17 10.1 17.85 12 17.85C13.9 17.85 15.5 17 16.4 15.4', { fill: 'none', stroke: C.shine, 'stroke-opacity': 0.25, 'stroke-width': 0.35, 'stroke-linecap': 'round' }, 'wm-a'))
  return n
}
