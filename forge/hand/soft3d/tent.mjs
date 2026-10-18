// forge/hand/soft3d/tent.mjs — a front-facing teepee: a tall orange canvas cone lit on the left and shaded on the right, two
// pole tips crossing above its peak, a cream hem band and an arched dark doorway. Replaces the generated angled side-view
// dome tent with the line composition (crossed poles, arched door).
// Roles: canvas c1, doorway c2, hem band c3, poles and shade c4. Motion: doorway wm-a.
const N = 'tent'
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
const C = { c1: v('c1', '#F07A2A'), c2: v('c2', '#2E3A4A'), c3: v('c3', '#F2D9B0'), c4: v('c4', '#A84A10') }
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const BODY = rpoly([[12, 5.2], [21.2, 21], [2.8, 21]], 1.1)
const HEM = 'M3.9 19.2H20.1L21.2 21H2.8Z'
const DOOR = 'M9.3 21V16.2A2.7 3.4 0 0 1 14.7 16.2V21Z'

export default function render() {
  const n = [['defs', {}, [
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 0.4 }, [stop(0, SN, 0.4), stop(0.35, SN, 0.05), stop(0.55, SH, 0), stop(1, SH, 0.3)]],
    ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, SN, 0.34), stop(0.42, SN, 0), stop(0.62, SH, 0), stop(1, SH, 0.2)]],
    ['linearGradient', { id: id(2), x1: 0, y1: 0, x2: 0, y2: 1 }, [stop(0, SH, 0.35), stop(1, SH, 0)]],
  ]]]
  n.push(...shadow3(12, 21.6, 10, 1.1))
  // the two pole tips crossing above the peak (behind the cone)
  n.push(S('M10 1.8L13.4 7', C.c4, 1.5, {}, 'wm-k'), S('M14 1.8L10.6 7', C.c4, 1.5, {}, 'wm-k'))
  n.push(S('M10 1.8L13.4 7M14 1.8L10.6 7', SH, 1.5, { 'stroke-opacity': 0.12 }, 'wm-k'), S('M9.7 1.9L11.2 4.2', SN, 0.4, { 'stroke-opacity': 0.5 }, 'wm-shine'))
  // the cone
  n.push(P(BODY, { fill: C.c1 }, 'wm-k'), P(BODY, { fill: url(0) }, 'wm-k'))
  // a seam either side of the door, as canvas panels
  n.push(S('M12 6.2L16.8 19.2', SH, 0.6, { 'stroke-opacity': 0.22 }, 'wm-k'), S('M11.8 6.4L7 19.2', SN, 0.5, { 'stroke-opacity': 0.35 }, 'wm-shine'))
  // hem band
  n.push(P(HEM, { fill: C.c3 }, 'wm-k'), P(HEM, { fill: url(1) }, 'wm-k'))
  // the arched doorway: dark inside, a soft shade under the arch, a lit lip on the left
  n.push(P(DOOR, { fill: C.c2 }, 'wm-a'), P(DOOR, { fill: url(2) }, 'wm-a'))
  n.push(S('M9.3 20.4V16.2A2.7 3.4 0 0 1 10.8 13.2', SN, 0.5, { 'stroke-opacity': 0.35 }, 'wm-shine'))
  // peak highlight
  n.push(S('M11.2 7.4L5.6 17.2', SN, 0.7, { 'stroke-opacity': 0.5 }, 'wm-shine'))
  return n
}
