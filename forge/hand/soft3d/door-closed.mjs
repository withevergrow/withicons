// forge/hand/soft3d/door-closed.mjs — a closed panel door seen front-on, drawn big and bold so it cannot be read as a slab:
// a wide c3 frame, the c1 leaf with four inset raised panels, two hinge barrels on the left stile, a large round gold knob
// with a keyhole plate on the right stile and a stone threshold step. Roles: frame c3, leaf c1, knob and hinges c2, step c4.
// Motion: knob and hinges wm-a (they catch the knock), the rest wm-k.
const N = 'door-closed'
const f = n => +(+n).toFixed(2)
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const stop = (o, c, a) => ['stop', a == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
function rpoly(pts, r) {
  const n = pts.length, out = []
  for (let i = 0; i < n; i++) {
    const p = pts[(i + n - 1) % n], c = pts[i], q = pts[(i + 1) % n]
    const a = Math.hypot(c[0] - p[0], c[1] - p[1]), b = Math.hypot(q[0] - c[0], q[1] - c[1])
    const ra = Math.min(r[i % r.length], a / 2), rb = Math.min(r[i % r.length], b / 2)
    const s = [c[0] + (p[0] - c[0]) * ra / a, c[1] + (p[1] - c[1]) * ra / a]
    const e = [c[0] + (q[0] - c[0]) * rb / b, c[1] + (q[1] - c[1]) * rb / b]
    out.push(`${i ? 'L' : 'M'}${f(s[0])} ${f(s[1])}Q${f(c[0])} ${f(c[1])} ${f(e[0])} ${f(e[1])}`)
  }
  return out.join('') + 'Z'
}
const box = (x0, y0, x1, y1, r) => rpoly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], Array.isArray(r) ? r : [r])
const shadow3 = (cx, cy, rx, ry) => [0, 1, 2].map(i => P(ell(cx, cy, rx * [1, 0.8, 0.58][i], ry * [1, 0.8, 0.58][i]), { fill: SH, 'fill-opacity': [0.06, 0.08, 0.11][i] }, 'wm-shadow'))
const C = { c1: v('c1', '#B8763E'), c2: v('c2', '#E9B43A'), c3: v('c3', '#7A4A24'), c4: v('c4', '#D8CDBB') }
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`

export default function render() {
  const n = [['defs', {}, [
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, SN, 0.34), stop(0.42, SN, 0), stop(0.62, SH, 0), stop(1, SH, 0.2)]],
    ['radialGradient', { id: id(1), cx: 0.32, cy: 0.28, r: 0.9 }, [stop(0, SN, 0.7), stop(0.5, SN, 0), stop(1, SH, 0.3)]],
  ]]]
  n.push(...shadow3(12, 22, 10.6, 0.9))
  const rim = (d, cls, o = 0.4) => n.push(P(d, { fill: 'none', stroke: SH, 'stroke-opacity': o, 'stroke-width': 0.5 }, cls))
  const fill = (d, c, cls = 'wm-k', g = 0, outline = true) => { n.push(P(d, { fill: c }, cls), P(d, { fill: url(g) }, cls)); if (outline) rim(d, cls) }
  // threshold step and frame
  fill(box(2.2, 20.4, 21.8, 22, 0.8), C.c4)
  n.push(S('M3.4 20.9H20', SN, 0.5, { 'stroke-opacity': 0.7 }, 'wm-shine'))
  fill(box(3, 1.4, 21, 20.6, [1.2, 1.2, 0.2, 0.2]), C.c3)
  n.push(S('M4.2 2.6H19.4', SN, 0.5, { 'stroke-opacity': 0.5 }, 'wm-shine'))
  // the leaf
  fill(box(4.4, 3, 19.6, 20.6, [0.7, 0.7, 0, 0]), C.c1)
  n.push(S('M5.4 3.9H18', SN, 0.5, { 'stroke-opacity': 0.55 }, 'wm-shine'))
  // four inset panels: dark well, lit lower/right lip, shaded upper/left lip
  const panel = (x0, y0, x1, y1) => {
    n.push(P(box(x0, y0, x1, y1, 0.6), { fill: SH, 'fill-opacity': 0.2 }, 'wm-k'))
    n.push(S(`M${x0} ${f(y1 - 0.6)}V${f(y0 + 0.6)}Q${x0} ${y0} ${f(x0 + 0.6)} ${y0}H${f(x1 - 0.6)}`, SH, 0.5, { 'stroke-opacity': 0.38 }, 'wm-k'))
    n.push(S(`M${f(x0 + 0.6)} ${y1}H${f(x1 - 0.6)}Q${x1} ${y1} ${x1} ${f(y1 - 0.6)}V${f(y0 + 0.6)}`, SN, 0.5, { 'stroke-opacity': 0.55 }, 'wm-shine'))
  }
  panel(6, 4.9, 10.8, 11); panel(12.2, 4.9, 17, 11)
  panel(6, 12.9, 10.8, 19); panel(12.2, 12.9, 17, 19)
  // hinges (left stile)
  for (const y of [6.2, 16]) {
    const d = box(4.2, y, 5.8, y + 2.2, 0.5)
    n.push(P(d, { fill: C.c2 }, 'wm-a'), P(d, { fill: url(0) }, 'wm-a'), P(d, { fill: 'none', stroke: SH, 'stroke-opacity': 0.4, 'stroke-width': 0.4 }, 'wm-a'))
  }
  // keyhole plate and knob (right stile)
  const plate = box(17.1, 14.5, 19.1, 17.6, 0.9)
  n.push(P(plate, { fill: C.c2 }, 'wm-a'), P(plate, { fill: url(0) }, 'wm-a'), P(plate, { fill: 'none', stroke: SH, 'stroke-opacity': 0.4, 'stroke-width': 0.4 }, 'wm-a'))
  n.push(P(ell(18.1, 15.7, 0.35, 0.35), { fill: SH, 'fill-opacity': 0.8 }, 'wm-a'), S('M18.1 15.8V16.7', SH, 0.4, { 'stroke-opacity': 0.8 }, 'wm-a'))
  n.push(P(ell(18.5, 12.3, 1.55, 1.55), { fill: SH, 'fill-opacity': 0.3 }, 'wm-a'))
  n.push(P(ell(18.2, 11.9, 1.5, 1.5), { fill: C.c2 }, 'wm-a'), P(ell(18.2, 11.9, 1.5, 1.5), { fill: url(1) }, 'wm-a'))
  n.push(P(ell(18.2, 11.9, 1.5, 1.5), { fill: 'none', stroke: SH, 'stroke-opacity': 0.4, 'stroke-width': 0.5 }, 'wm-a'))
  n.push(P(ell(17.6, 11.2, 0.4, 0.34), { fill: SN, 'fill-opacity': 0.9 }, 'wm-shine'))
  return n
}
