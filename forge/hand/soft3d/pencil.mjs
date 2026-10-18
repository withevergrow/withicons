// forge/hand/soft3d/pencil.mjs — a pencil lying on its diagonal: sharpened wood cone with a graphite point at the lower
// left, a yellow body, a silver ferrule band and a pink eraser at the upper right, each part a lit cylinder with a short
// wall behind it. The generated pencil read as a yellow crayon with a blobby, tipless body.
// Roles: body c1, eraser c2, graphite c3, ferrule c4, wood edge. Motion: all wm-k (the whole pencil sways), shadow wm-shadow.
const N = 'pencil'
const f = n => +(+n).toFixed(2)
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
// a shape is a list of [cmd, ...numbers] in absolute coordinates (M L Q A Z); D writes it, moved by dx, dy
const D = (sh, dx = 0, dy = 0) => sh.map(([c, ...n]) => c === 'Z' ? 'Z' : c + n.map((x, i) => f(c === 'A' ? (i === 5 ? x + dx : i === 6 ? x + dy : x) : x + (i % 2 ? dy : dx))).join(' ')).join('')
// a polygon with rounded corners (r: one radius or one per corner), always wound clockwise on screen
function rpoly(pts, r) {
  let s = 0; pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length]; s += p[0] * q[1] - q[0] * p[1] })
  const rs = pts.map((_, i) => Array.isArray(r) ? r[i] : r)
  if (s < 0) { pts = pts.slice().reverse(); rs.reverse() }
  const n = pts.length, out = []
  pts.forEach((p, i) => {
    const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n], la = Math.hypot(a[0] - p[0], a[1] - p[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1])
    const ta = Math.min(rs[i], la / 2) / la, tb = Math.min(rs[i], lb / 2) / lb
    out.push([i ? 'L' : 'M', p[0] + (a[0] - p[0]) * ta, p[1] + (a[1] - p[1]) * ta], ['Q', p[0], p[1], p[0] + (b[0] - p[0]) * tb, p[1] + (b[1] - p[1]) * tb])
  })
  return [...out, ['Z']]
}
const rr = (x, y, w, h, r) => rpoly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], r)
const circ = (cx, cy, r, hole) => [['M', cx - r, cy], ['A', r, r, 0, 1, hole ? 0 : 1, cx + r, cy], ['A', r, r, 0, 1, hole ? 0 : 1, cx - r, cy], ['Z']]
// the extruded wall: copies of the face stepping back to (vx, vy); one path so the copies merge
const sweep = (sh, vx, vy, n = 4) => Array.from({ length: n }, (_, i) => D(sh, vx * (i + 1) / n, vy * (i + 1) / n)).join('')
// the shared gradients: 0 the object face light (corner to corner), 1 the flat slab face (soft dome)
const GRADS = ['defs', {}, [
  ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, SN, 0.34), stop(0.42, SN, 0), stop(0.62, SH, 0), stop(1, SH, 0.2)]],
  ['radialGradient', { id: id(1), cx: 0.34, cy: 0.26, r: 0.92 }, [stop(0, SN, 0.58), stop(0.38, SN, 0.06), stop(0.7, SH, 0), stop(1, SH, 0.26)]],
]]
// wall of a part (its colour darkened) and the lit face
const WALL = (sh, vx, vy, n, col, cls, dark = 0.32) => { const d = sweep(sh, vx, vy, n); return [P(d, { fill: col }, cls), P(d, { fill: SH, 'fill-opacity': dark }, cls)] }
const FACE = (d, col, g, cls) => [P(d, { fill: col, 'fill-rule': 'evenodd' }, cls), P(d, { fill: url(g), 'fill-rule': 'evenodd' }, cls)]
const LINE = (d, c, w, o, cls) => P(d, { stroke: c, 'stroke-width': w, 'stroke-opacity': o, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cls)

const C1 = v('c1', '#F7C531'), C2 = v('c2', '#F27BA5'), C3 = v('c3', '#3A404C'), C4 = v('c4', '#BFC7D2'), WOOD = v('edge', '#F4D6A6')
// the axis runs from the tip (lower left) to the eraser (upper right); u along it, w across (towards the lower right)
const T = [4.3, 19.5], A = Math.SQRT1_2
const q = (u, w) => [T[0] + (u + w) * A, T[1] + (w - u) * A]
const part = (uv, r) => rpoly(uv.map(([u, w]) => q(u, w)), r)
const H = 2.5
const CONE = part([[0, 0], [4.7, -H], [4.7, H]], [0.55, 0.3, 0.3])
const LEAD = part([[0, 0], [1.9, -1.05], [1.9, 1.05]], [0.45, 0.15, 0.15])
const BODY = part([[4.5, -H], [14.3, -H], [14.3, H], [4.5, H]], 0.3)
const FERR = part([[14.1, -H], [16.6, -H], [16.6, H], [14.1, H]], 0.3)
const ERAS = part([[16.4, -H], [19.7, -H], [19.7, H], [16.4, H]], [0.3, 1.3, 1.3, 0.3])
const seg = (a, b) => 'M' + q(...a).map(f).join(' ') + 'L' + q(...b).map(f).join(' ')

export default function render() {
  const n = [GRADS]
  n.push(P(ell(11.7, 20.9, 8.6, 1.25), { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'))
  n.push(P(ell(11.7, 20.9, 6.9, 1), { fill: SH, 'fill-opacity': 0.08 }, 'wm-shadow'))
  n.push(P(ell(11.7, 20.9, 5, 0.72), { fill: SH, 'fill-opacity': 0.11 }, 'wm-shadow'))
  // walls first (they step back to the upper right and sit behind every face)
  n.push(...WALL(CONE, 0.8, -0.45, 3, WOOD, 'wm-k'))
  n.push(...WALL(BODY, 0.8, -0.45, 3, C1, 'wm-k'))
  n.push(...WALL(FERR, 0.8, -0.45, 3, C4, 'wm-k'))
  n.push(...WALL(ERAS, 0.8, -0.45, 3, C2, 'wm-k'))
  n.push(...FACE(D(CONE), WOOD, 0, 'wm-k'))
  n.push(...FACE(D(LEAD), C3, 0, 'wm-k'))
  n.push(...FACE(D(BODY), C1, 0, 'wm-k'))
  n.push(...FACE(D(FERR), C4, 0, 'wm-k'))
  n.push(...FACE(D(ERAS), C2, 0, 'wm-k'))
  // ferrule ridges, body light and shade, eraser light
  n.push(LINE(seg([15.0, -2.1], [15.0, 2.1]) + seg([15.8, -2.1], [15.8, 2.1]), SH, 0.45, 0.3, 'wm-k'))
  n.push(LINE(seg([5.4, -1.65], [13.6, -1.65]), SN, 0.62, 0.6, 'wm-shine'))
  n.push(LINE(seg([5.2, 1.85], [13.8, 1.85]), SH, 0.62, 0.22, 'wm-k'))
  n.push(LINE(seg([14.4, -1.65], [16.3, -1.65]), SN, 0.5, 0.55, 'wm-shine'))
  n.push(LINE(seg([17, -1.65], [18.6, -1.65]), SN, 0.55, 0.6, 'wm-shine'))
  n.push(LINE(seg([1.5, -0.2], [4.1, -1.55]), SN, 0.5, 0.45, 'wm-shine'))
  return n
}
