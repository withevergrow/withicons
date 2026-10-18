// forge/hand/soft3d/bed.mjs — a bed in side view, drawn big and bold: a tall oak headboard, a plump white pillow, a thick mattress
// with a blue blanket folded down over it, a footboard and a dark rail on stubby legs; the boards carry a rim so they hold on dark.
// Roles: boards c1, pillow and mattress c2, blanket c3, rail c4. Motion: pillow wm-a (it rises), the rest wm-k.
const N = 'bed'
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
const C = { c1: v('c1', '#C49A6C'), c2: v('c2', '#F4F1EA'), c3: v('c3', '#5E8FD0'), c4: v('c4', '#7A5434') }
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const box = (x0, y0, x1, y1, r) => rpoly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], r)

export default function render() {
  const n = [['defs', {}, [
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, SN, 0.34), stop(0.42, SN, 0), stop(0.62, SH, 0), stop(1, SH, 0.2)]],
    ['radialGradient', { id: id(1), cx: 0.32, cy: 0.28, r: 0.9 }, [stop(0, SN, 0.45), stop(0.5, SN, 0), stop(1, SH, 0.22)]],
  ]]]
  n.push(...shadow3(12, 21.6, 10.8, 1.1))
  const rim = (d, cls) => n.push(P(d, { fill: 'none', stroke: SH, 'stroke-opacity': 0.4, 'stroke-width': 0.5 }, cls))
  const fill = (d, c, cls = 'wm-k', g = 0, outline = false) => { n.push(P(d, { fill: c }, cls), P(d, { fill: url(g) }, cls)); if (outline) rim(d, cls) }
  // headboard and footboard (oak)
  fill(box(1.8, 2.2, 5.6, 21, 1.4), C.c1, 'wm-k', 0, true)
  fill(box(18.4, 9.6, 22.2, 21, 1.4), C.c1, 'wm-k', 0, true)
  n.push(S('M2.9 4V19.6', SN, 0.6, { 'stroke-opacity': 0.5 }, 'wm-shine'), S('M19.5 11.4V19.6', SN, 0.6, { 'stroke-opacity': 0.5 }, 'wm-shine'))
  n.push(S('M4.6 4.6V19', SH, 0.5, { 'stroke-opacity': 0.22 }, 'wm-k'), S('M21.2 12V19', SH, 0.5, { 'stroke-opacity': 0.22 }, 'wm-k'))
  // rail
  fill(box(3.6, 15.2, 20.4, 19, 1), C.c4, 'wm-k', 0, true)
  n.push(S('M5 16.1H19', SN, 0.5, { 'stroke-opacity': 0.4 }, 'wm-shine'))
  // mattress, thick
  fill(box(5.2, 9.6, 18.8, 16.2, 1.8), C.c2, 'wm-k', 0, true)
  // blanket with a white turned-down edge
  fill(box(10.4, 9.4, 18.8, 16.6, 1.6), C.c3, 'wm-k', 0, true)
  n.push(S('M11.6 15.4H17.8', SH, 0.6, { 'stroke-opacity': 0.24 }, 'wm-k'))
  fill(box(10.4, 9.2, 18.8, 12.4, 1.2), C.c2, 'wm-k', 0, true)
  // pillow
  const pil = box(5.6, 5.6, 12, 11.4, 2.4)
  n.push(P(box(5.85, 6, 12.25, 11.8, 2.4), { fill: SH, 'fill-opacity': 0.26 }, 'wm-k'))
  n.push(P(pil, { fill: C.c2 }, 'wm-a'), P(pil, { fill: url(1) }, 'wm-a'), P(pil, { fill: 'none', stroke: SH, 'stroke-opacity': 0.4, 'stroke-width': 0.5 }, 'wm-a'))
  n.push(S('M7 7.4Q8.6 6.8 10.4 7.2', SN, 0.6, { 'stroke-opacity': 0.85 }, 'wm-shine'))
  return n
}
