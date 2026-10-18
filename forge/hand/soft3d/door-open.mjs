// forge/hand/soft3d/door-open.mjs — an arched doorway with one door leaf swung open toward you: a dark oak arch frame around a
// warm lit opening, the leaf hinged on the left jamb and foreshortened (its free edge taller and nearer) with two raised
// panels and a gold handle. Replaces the generated tangle of frame, jamb and dangling shapes with the line composition.
// Roles: leaf c1, opening light c2, handle c3, frame c4. Motion: handle wm-a.
const N = 'door-open'
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
const C = { c1: v('c1', '#B5834F'), c2: v('c2', '#F7E7B8'), c3: v('c3', '#C9A44C'), c4: v('c4', '#6E4626') }
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const OUTER = 'M3 21.5V8.2A9 5.7 0 0 1 21 8.2V21.5Z'
const INNER = 'M5.4 21.5V8.4A6.6 4.4 0 0 1 18.6 8.4V21.5Z'
const LEAF = rpoly([[5.6, 7.6], [13.2, 5.4], [13.2, 21.6], [5.6, 20.2]], 0.5)
const EDGE = rpoly([[13.2, 5.4], [14.2, 5.7], [14.2, 21.4], [13.2, 21.6]], 0.25)
const PANEL1 = rpoly([[7.1, 9.2], [11.7, 7.9], [11.7, 12.9], [7.1, 12.7]], 0.4)
const PANEL2 = rpoly([[7.1, 14.5], [11.7, 14.9], [11.7, 19.9], [7.1, 18.9]], 0.4)

export default function render() {
  const n = [['defs', {}, [
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, SN, 0.34), stop(0.42, SN, 0), stop(0.62, SH, 0), stop(1, SH, 0.2)]],
    ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 1, y2: 0 }, [stop(0, SH, 0.38), stop(0.5, SH, 0.05), stop(1, SN, 0.25)]],
    ['radialGradient', { id: id(2), cx: 0.35, cy: 0.3, r: 0.8 }, [stop(0, SN, 0.6), stop(0.5, SN, 0), stop(1, SH, 0.3)]],
  ]]]
  n.push(...shadow3(12.5, 21.7, 10, 1.1))
  // frame (arch), lit on the left, shaded on the right
  const FR = OUTER + INNER
  n.push(P(FR, { fill: C.c4, 'fill-rule': 'evenodd' }, 'wm-k'), P(FR, { fill: url(0), 'fill-rule': 'evenodd' }, 'wm-k'))
  n.push(S('M3.9 21V8.4A8.1 5 0 0 1 12 3.5', SN, 0.5, { 'stroke-opacity': 0.5 }, 'wm-shine'))
  // the warm opening, darker toward the leaf
  n.push(P(INNER, { fill: C.c2 }, 'wm-k'), P(INNER, { fill: url(1) }, 'wm-k'))
  n.push(P('M5.4 21.5H18.6V20.6H5.4Z', { fill: SH, 'fill-opacity': 0.14 }, 'wm-k'))
  // the swung leaf: its far edge face, then the face with raised panels
  n.push(P(EDGE, { fill: C.c4 }, 'wm-k'), P(EDGE, { fill: SH, 'fill-opacity': 0.3 }, 'wm-k'))
  n.push(P(LEAF, { fill: C.c1 }, 'wm-k'), P(LEAF, { fill: url(0) }, 'wm-k'))
  for (const p of [PANEL1, PANEL2]) n.push(P(p, { fill: SH, 'fill-opacity': 0.2 }, 'wm-k'), P(p, { fill: SN, 'fill-opacity': 0.1 }, 'wm-k'))
  n.push(S('M6.2 8.3L12.6 6.4', SN, 0.5, { 'stroke-opacity': 0.55 }, 'wm-shine'))
  // handle
  n.push(P(ell(11.75, 14.15, 1.05, 1.05), { fill: SH, 'fill-opacity': 0.3 }, 'wm-k'))
  n.push(P(ell(11.55, 13.9, 1, 1), { fill: C.c3 }, 'wm-a'), P(ell(11.55, 13.9, 1, 1), { fill: url(2) }, 'wm-a'))
  return n
}
