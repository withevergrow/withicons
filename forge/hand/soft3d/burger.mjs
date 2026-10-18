// forge/hand/soft3d/burger.mjs — the front-on burger stack (a domed sesame bun, a frilly lettuce leaf, a cheese slice with
// a drip, a thick patty and a rounded bottom bun) with soft studio light, replacing the generated tilted wedge sandwich.
// Roles (classic cheeseburger palette): buns c1, patty c2, lettuce c3, cheese c4, seeds shine-cream. Motion: patty wm-a.
const N = 'burger'
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
const C = { c1: v('c1', '#F2B544'), c2: v('c2', '#B8642B'), c3: v('c3', '#6B8E4E'), c4: v('c4', '#F7D046'), tint: v('tint', '#FCF0DA') }
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const TOP = 'M3 10.8Q3 3.2 12 3.2Q21 3.2 21 10.8Q21 11.4 20.4 11.4H3.6Q3 11.4 3 10.8Z'
const PATTY = 'M4.1 14.7H19.9Q21.4 14.7 21.4 16.1Q21.4 17.5 19.9 17.5H4.1Q2.6 17.5 2.6 16.1Q2.6 14.7 4.1 14.7Z'
const BOTTOM = 'M3.2 17.9H20.8V18.8Q20.8 21.4 18.2 21.4H5.8Q3.2 21.4 3.2 18.8Z'
const CHEESE = 'M3.4 13.2H20.6V14.5H17.7L16.6 16.7L15.5 14.5H3.4Z'
const LETTUCE = 'M3.2 11.9Q4.5 13.5 6 12Q7.5 13.5 9 12Q10.5 13.5 12 12Q13.5 13.5 15 12Q16.5 13.5 18 12Q19.5 13.5 20.8 11.9'

export default function render() {
  const n = [['defs', {}, [
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, SN, 0.34), stop(0.42, SN, 0), stop(0.62, SH, 0), stop(1, SH, 0.2)]],
    ['radialGradient', { id: id(1), cx: 0.32, cy: 0.28, r: 0.85 }, [stop(0, SN, 0.5), stop(0.45, SN, 0.04), stop(0.75, SH, 0), stop(1, SH, 0.28)]],
  ]]]
  n.push(...shadow3(12, 22, 9.6, 1.1))
  // bottom bun
  n.push(P(BOTTOM, { fill: C.c1 }, 'wm-k'), P(BOTTOM, { fill: url(0) }, 'wm-k'))
  n.push(S('M4.1 19.1Q4.3 20.6 6 20.7', SN, 0.5, { 'stroke-opacity': 0.5 }, 'wm-shine'))
  // patty
  n.push(P(PATTY, { fill: C.c2 }, 'wm-a'), P(PATTY, { fill: url(0) }, 'wm-a'))
  n.push(S('M4.2 15.5H19.8', SN, 0.5, { 'stroke-opacity': 0.4 }, 'wm-shine'), S('M4.4 17.1H19.6', SH, 0.6, { 'stroke-opacity': 0.3 }, 'wm-a'))
  // lettuce frill
  n.push(S(LETTUCE.replace(/(\d)\s*Q/g, '$1Q'), C.c3, 1.9, {}, 'wm-k'), S(LETTUCE, SH, 1.9, { 'stroke-opacity': 0.12 }, 'wm-k'))
  n.push(S('M4.6 11.8Q5.2 12.3 6 11.9', SN, 0.5, { 'stroke-opacity': 0.5 }, 'wm-shine'))
  // cheese, laid over the leaf's lower edge
  n.push(P(CHEESE, { fill: C.c4 }, 'wm-k'), P(CHEESE, { fill: url(0) }, 'wm-k'))
  // top bun: dome, soft shade under the lip, sesame seeds, a bright highlight
  n.push(P(TOP, { fill: C.c1 }, 'wm-k'), P(TOP, { fill: url(1) }, 'wm-k'))
  n.push(S('M3.9 11.6H20.1', SH, 0.7, { 'stroke-opacity': 0.2 }, 'wm-k'))
  for (const [x, y, dx, dy] of [[8.2, 6.6, 0.9, -0.4], [12.2, 5.4, 0.9, 0], [15.8, 7, 0.9, 0.4], [10.3, 8.9, 0.9, 0.2], [14.3, 9.4, 0.9, -0.3]]) {
    n.push(S(`M${f(x)} ${f(y)}l${dx} ${dy}`, SH, 1.15, { 'stroke-opacity': 0.12 }, 'wm-k'))
    n.push(S(`M${f(x)} ${f(y - 0.1)}l${dx} ${dy}`, C.tint, 1.0, {}, 'wm-k'))
  }
  n.push(S('M5.2 8.2Q5.7 5.9 8 4.7', SN, 0.7, { 'stroke-opacity': 0.7 }, 'wm-shine'))
  return n
}
