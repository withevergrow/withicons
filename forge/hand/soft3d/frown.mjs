// forge/hand/soft3d/frown.mjs — a sad soft 3D face: the same round slab as the generated faces, with two glossy dark eyes
// and a thick dark downturned mouth, so the frown reads at 16px (the generated one had a pale grey mouth that faded into
// the teal and mismatched eye colours).
// Roles (as forge/palettes/frown.json): face c1, eyes and mouth ink, shadow/shine.
// Motion: face wm-k, eyes and mouth wm-a (the A part nods about 12 13), contact shadow wm-shadow, highlights wm-shine.
const N = 'frown'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#25A99B'), ink: v('ink', '#232733'), shadow: v('shadow', '#1D2130'), shine: v('shine', '#FFFFFF') }
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
  // eyes: glossy dark ovals with a catch-light
  for (const ex of [8.9, 15.1]) {
    n.push(P(ell(ex + 0.12, 8.95 + 0.22, 1.2, 1.5), { fill: C.shadow, 'fill-opacity': 0.26 }))
    n.push(P(ell(ex, 8.95, 1.2, 1.5), { fill: C.ink }, 'wm-a'))
    n.push(P(circ(ex - 0.42, 8.35, 0.38), { fill: C.shine, 'fill-opacity': 0.9 }, 'wm-a'))
  }
  // mouth: a thick downturned arc, raised and dark
  const m = 'M8.3 15.9C9.3 14.3 10.5 13.6 12 13.6C13.5 13.6 14.7 14.3 15.7 15.9'
  const st = { fill: 'none', 'stroke-width': 1.55, 'stroke-linecap': 'round' }
  n.push(P('M8.42 16.12C9.42 14.52 10.62 13.82 12.12 13.82C13.62 13.82 14.82 14.52 15.82 16.12', { ...st, stroke: C.shadow, 'stroke-opacity': 0.26 }))
  n.push(P(m, { ...st, stroke: C.ink }, 'wm-a'))
  n.push(P('M9.6 14.6C10.3 14.05 11.1 13.8 12 13.8', { fill: 'none', stroke: C.shine, 'stroke-opacity': 0.35, 'stroke-width': 0.35, 'stroke-linecap': 'round' }, 'wm-a'))
  return n
}
