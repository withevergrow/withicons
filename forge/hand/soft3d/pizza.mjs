// forge/hand/soft3d/pizza.mjs — a thick slice of pizza lying in a soft 3/4 view: a golden cheese wedge with its point at
// the lower left, a plump baked crust rolled along the far arc and three simple pepperoni discs. The generated slice
// was a thin wedge whose crust line and centre dot read like a Wi-Fi sign and whose toppings were busy rings; here the
// wedge is the mass, the crust a fat rounded roll and the pepperoni three clean raised discs.
// Same studio recipe as the generated food: contact shadow, wall in shade, shared face light, lit rim upper left.
// Roles (as the pizza palettes): cheese c1, pepperoni c2, crust c4. Motion: slice wm-k, pepperoni wm-a.
const N = 'pizza'
const f = n => +(+n).toFixed(2)
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#F7C531'), c2: v('c2', '#E5483F'), c4: v('c4', '#E3A65E'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
const mv = (d, dx, dy) => d.replace(/([MLCQA])([^MLCQAZ]*)/g, (m, c, s) => c + s.trim().split(/[\s,]+/).filter(Boolean).map(Number)
  .map((x, i) => c === 'A' ? (i % 7 === 5 ? x + dx : i % 7 === 6 ? x + dy : x) : x + (i % 2 ? dy : dx)).map(f).join(' '))
const wall = (d, dx, dy, n = 4) => Array.from({ length: n }, (_, i) => mv(d, dx * (i + 1) / n, dy * (i + 1) / n)).join('')

const T = [4.2, 19.6], A0 = -77, A1 = -13
const at = (deg, r) => [T[0] + r * Math.cos(deg * Math.PI / 180), T[1] + r * Math.sin(deg * Math.PI / 180)]
const pt = p => `${f(p[0])} ${f(p[1])}`
const sector = r => `M${pt(T)}L${pt(at(A0, r))}A${r} ${r} 0 0 1 ${pt(at(A1, r))}Z`
const arc = (r, a = A0, b = A1) => `M${pt(at(a, r))}A${r} ${r} 0 0 1 ${pt(at(b, r))}`
const CHEESE = sector(14.6)
const CRUST = arc(14.9, A0 + 1.5, A1 - 1.5)
const PEP = [[at(-50, 10.2), 1.75], [at(-26, 11), 1.65], [at(-46, 5.3), 1.3]]

export default function render() {
  const n = [['defs', {}, [
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, C.shine, 0.34), stop(0.42, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.2)]],
    ['linearGradient', { id: id(1), x1: 4, y1: 2, x2: 21, y2: 18, gradientUnits: 'userSpaceOnUse' }, [stop(0, C.shine, 0.45), stop(0.45, C.shine, 0), stop(1, C.shadow, 0.28)]],
    ['radialGradient', { id: id(2), cx: 0.35, cy: 0.3, r: 0.75 }, [stop(0, C.shine, 0.45), stop(0.5, C.shine, 0), stop(1, C.shadow, 0.28)]],
  ]]]
  // contact shadow
  n.push(P(ell(12.8, 20.9, 9.6, 1.5), { fill: C.shadow, 'fill-opacity': 0.06 }, 'wm-shadow'))
  n.push(P(ell(12.8, 20.9, 7.7, 1.2), { fill: C.shadow, 'fill-opacity': 0.08 }, 'wm-shadow'))
  n.push(P(ell(12.8, 20.9, 5.6, 0.86), { fill: C.shadow, 'fill-opacity': 0.11 }, 'wm-shadow'))
  // the slab's wall, then the cheese face
  const W = wall(CHEESE, 0.75, 1.05, 9)
  n.push(P(W, { fill: C.c1 }, 'wm-k'), P(W, { fill: C.shadow, 'fill-opacity': 0.3 }, 'wm-k'))
  n.push(P(CHEESE, { fill: C.c1 }, 'wm-k'), P(CHEESE, { fill: url(0) }, 'wm-k'))
  // lit edge along the upper left side of the wedge, soft dark edge along the lower side
  n.push(P(`M${pt(at(A0, 1.6))}L${pt(at(A0, 12.4))}`, { stroke: C.shine, 'stroke-width': 0.6, 'stroke-opacity': 0.6, 'stroke-linecap': 'round' }, 'wm-shine'))
  n.push(P(`M${pt(at(A1 + 1, 1.8))}L${pt(at(A1 + 1, 12.2))}`, { stroke: C.shadow, 'stroke-width': 0.6, 'stroke-opacity': 0.2, 'stroke-linecap': 'round' }, 'wm-k'))
  // crust: a fat rolled tube along the arc (its shaded underside, then the lit roll and a highlight)
  const ct = { fill: 'none', 'stroke-width': 3, 'stroke-linecap': 'round' }
  n.push(P(mv(CRUST, 0.55, 0.85), { ...ct, stroke: C.c4 }, 'wm-k'), P(mv(CRUST, 0.55, 0.85), { ...ct, stroke: C.shadow, 'stroke-opacity': 0.34 }, 'wm-k'))
  n.push(P(CRUST, { ...ct, stroke: C.c4 }, 'wm-k'), P(CRUST, { ...ct, stroke: url(1) }, 'wm-k'))
  n.push(P(arc(15.5, A0 + 4, A1 - 22), { fill: 'none', stroke: C.shine, 'stroke-width': 0.6, 'stroke-opacity': 0.6, 'stroke-linecap': 'round' }, 'wm-shine'))
  // pepperoni: contact shade, raised disc, highlight
  const pep = PEP.map(([c, r]) => ell(c[0], c[1], r, r)).join('')
  n.push(P(mv(pep, 0.28, 0.4), { fill: C.shadow, 'fill-opacity': 0.24 }, 'wm-k'))
  n.push(P(pep, { fill: C.c2 }, 'wm-a'), P(pep, { fill: url(2) }, 'wm-a'))
  n.push(P(PEP.map(([c, r]) => `M${f(c[0] - r * 0.55)} ${f(c[1] - r * 0.1)}Q${f(c[0] - r * 0.5)} ${f(c[1] - r * 0.55)} ${f(c[0] - r * 0.05)} ${f(c[1] - r * 0.6)}`).join(''),
    { fill: 'none', stroke: C.shine, 'stroke-width': 0.45, 'stroke-opacity': 0.7, 'stroke-linecap': 'round' }, 'wm-shine'))
  return n
}
