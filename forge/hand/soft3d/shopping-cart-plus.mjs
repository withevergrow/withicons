// forge/hand/soft3d/shopping-cart-plus.mjs — the upright shopping cart face-on (a handle at the upper left, a tapered orange
// basket with a lit rim, a chassis bar and two dark wheels) with a raised white plus on the basket, replacing the generated
// tilted open box whose two wheels read as eyes. Same studio recipe as the other hand-drawn soft 3D objects.
// Roles: basket c1, plus c2, handle / chassis / wheels c3, wheel hubs c4. Motion: plus wm-s, wheels wm-a.
const N = 'shopping-cart-plus'
const f = n => +(+n).toFixed(2)
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const stop = (o, c, a) => ['stop', a == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
// a polygon with its corners rounded by r (quadratic corners)
function rpoly(pts, r) {
  const n = pts.length, out = []
  for (let i = 0; i < n; i++) {
    const p = pts[(i + n - 1) % n], c = pts[i], q = pts[(i + 1) % n]
    const a = Math.hypot(c[0] - p[0], c[1] - p[1]), b = Math.hypot(q[0] - c[0], q[1] - c[1])
    const ra = Math.min(r, a / 2), rb = Math.min(r, b / 2)
    const s = [c[0] + (p[0] - c[0]) * ra / a, c[1] + (p[1] - c[1]) * ra / a]
    const e = [c[0] + (q[0] - c[0]) * rb / b, c[1] + (q[1] - c[1]) * rb / b]
    out.push(`${i ? 'L' : 'M'}${f(s[0])} ${f(s[1])}Q${f(c[0])} ${f(c[1])} ${f(e[0])} ${f(e[1])}`)
  }
  return out.join('') + 'Z'
}
const shadow3 = (cx, cy, rx, ry) => [0, 1, 2].map(i => P(ell(cx, cy, rx * [1, 0.8, 0.58][i], ry * [1, 0.8, 0.58][i]), { fill: SH, 'fill-opacity': [0.06, 0.08, 0.11][i] }, 'wm-shadow'))
const C = { c1: v('c1', '#FF7A1A'), c2: v('c2', '#FFFFFF'), c3: v('c3', '#565C6B'), c4: v('c4', '#FFD3A6') }
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const BASKET = rpoly([[5, 5.6], [21, 5.6], [18.6, 15.2], [7.2, 15.2]], 1.1)
const WALL = rpoly([[5.5, 6.5], [21.5, 6.5], [19.1, 16], [7.7, 16]], 1.1)

export default function render() {
  const n = [['defs', {}, [
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, SN, 0.34), stop(0.42, SN, 0), stop(0.62, SH, 0), stop(1, SH, 0.2)]],
    ['radialGradient', { id: id(1), cx: 0.35, cy: 0.3, r: 0.8 }, [stop(0, SN, 0.5), stop(0.5, SN, 0), stop(1, SH, 0.3)]],
  ]]]
  n.push(...shadow3(12.8, 22.1, 9.2, 1.3))
  // handle and chassis
  n.push(S('M2.3 3.2 H4.4 L5.6 6.6', C.c3, 1.9, {}, 'wm-k'), S('M2.3 3.2 H4.4', SN, 0.5, { 'stroke-opacity': 0.4 }, 'wm-shine'))
  n.push(S('M8.9 18.1 H17.1', C.c3, 1.5, {}, 'wm-k'), S('M8.9 18.5 H17.1', SH, 0.5, { 'stroke-opacity': 0.4 }, 'wm-k'))
  // the basket's lower wall, then its face
  n.push(P(WALL, { fill: C.c1 }, 'wm-k'), P(WALL, { fill: SH, 'fill-opacity': 0.34 }, 'wm-k'))
  n.push(P(BASKET, { fill: C.c1 }, 'wm-k'), P(BASKET, { fill: url(0) }, 'wm-k'))
  // lit rim along the top and the left edge, soft dark edge along the lower right
  n.push(S('M6 6.5 H20.1', SN, 0.7, { 'stroke-opacity': 0.55 }, 'wm-shine'), S('M5.9 7.1 L7.8 14.4', SN, 0.5, { 'stroke-opacity': 0.4 }, 'wm-shine'))
  n.push(S('M19.9 7.4 L18.2 14.4 Q18 14.8 17.5 14.8 H9', SH, 0.55, { 'stroke-opacity': 0.26 }, 'wm-k'))
  // the plus: a raised white cross
  const plus = 'M13 7.7V13.1M10.3 10.4H15.7'
  n.push(S(plus, SH, 2, { 'stroke-opacity': 0.28 }, 'wm-s'))
  n.push(S(plus, C.c2, 2, {}, 'wm-s'))
  // wheels
  for (const x of [9, 17]) {
    n.push(P(ell(x + 0.2, 20.5, 1.8, 1.8), { fill: SH, 'fill-opacity': 0.25 }, 'wm-k'))
    n.push(P(ell(x, 20.2, 1.8, 1.8), { fill: C.c3 }, 'wm-a'), P(ell(x, 20.2, 1.8, 1.8), { fill: url(1) }, 'wm-a'))
    n.push(P(ell(x, 20.2, 0.7, 0.7), { fill: C.c4 }, 'wm-a'))
    n.push(S(`M${f(x - 1.1)} ${f(19.5)}Q${f(x - 0.9)} ${f(18.7)} ${f(x - 0.1)} ${f(18.6)}`, SN, 0.4, { 'stroke-opacity': 0.6 }, 'wm-shine'))
  }
  return n
}
