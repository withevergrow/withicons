// forge/hand/soft3d/film.mjs — an upright film frame: a dark rounded slab with a row of four light sprocket holes along the
// top and the bottom edge and one wide glass window between them, with a wall behind it and a lit rim. The previous
// drawing was a tilted strip with two panes and loose white pegs that read as a cluttered block.
// Roles: strip c1, sprocket holes c2, window glass tint over ink. Motion: all wm-k, shadow wm-shadow, speculars wm-shine.
const N = 'film'
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

const C1 = v('c1', '#2A2E36'), C2 = v('c2', '#EEF1F5'), INK = v('ink', '#232733'), TINT = v('tint', '#A9D8F2')
const BODY = rr(2.5, 5, 18, 14, 2.2)
// three bold holes per row (four vanished at 16px)
const holes = (y, i = 0, h = 2.2) => [6.6, 11.5, 16.4].flatMap(c => rr(c - 1.4 + i, y, 2.8 - 2 * i, h, 0.55))
const HT = holes(6.2), HB = holes(15.6)
const HTL = holes(6.45, 0.2, 1.8), HBL = holes(15.85, 0.2, 1.8)
const WIN = rr(4.5, 9.9, 14, 4.4, 1)
const GLASS = rr(4.85, 10.25, 13.3, 3.7, 0.75)

export default function render() {
  const n = [['defs', {}, [...GRADS[2], ['linearGradient', { id: id(2), x1: 0, y1: 0, x2: 0.4, y2: 1 }, [stop(0, TINT, 1), stop(1, TINT, 0.62)]]]]]
  n.push(P(ell(12.4, 21.2, 10.2, 1.4), { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'))
  n.push(P(ell(12.4, 21.2, 8.2, 1.12), { fill: SH, 'fill-opacity': 0.08 }, 'wm-shadow'))
  n.push(P(ell(12.4, 21.2, 5.9, 0.8), { fill: SH, 'fill-opacity': 0.11 }, 'wm-shadow'))
  n.push(...WALL(BODY, 1.2, -0.7, 4, C1, 'wm-k', 0.2))
  n.push(...FACE(D(BODY), C1, 0, 'wm-k'))
  // lift the near-black slab off a dark page: a pale wash and a full light rim around the face
  n.push(P(D(BODY), { fill: SN, 'fill-opacity': 0.12 }, 'wm-shine'))
  n.push(LINE(D(BODY), SN, 0.6, 0.5, 'wm-shine'))
  n.push(LINE('M3.7 17.4V7.9Q3.7 6.2 5.4 6.2H18', SN, 0.62, 0.55, 'wm-shine'))
  n.push(LINE('M4.9 4.3H18.8Q20.3 4.3 21.1 5.5', SN, 0.5, 0.3, 'wm-shine'))
  // sprocket holes: a dark well with the light showing through below its top-left lip
  n.push(P(D(HT), { fill: SH, 'fill-opacity': 0.6 }, 'wm-k'), P(D(HB), { fill: SH, 'fill-opacity': 0.6 }, 'wm-k'))
  n.push(P(D(HTL, 0.1, 0.2), { fill: C2 }, 'wm-k'), P(D(HBL, 0.1, 0.2), { fill: C2 }, 'wm-k'))
  n.push(P(D(HTL, 0.1, 0.2), { fill: SN, 'fill-opacity': 0.5 }, 'wm-shine'), P(D(HBL, 0.1, 0.2), { fill: SN, 'fill-opacity': 0.5 }, 'wm-shine'))
  // the window
  n.push(P(D(WIN), { fill: INK }, 'wm-k'))
  n.push(P(D(GLASS), { fill: url(2) }, 'wm-k'))
  n.push(P(D(rpoly([[6.3, 13.95], [8.3, 10.25], [10.9, 10.25], [8.9, 13.95]], 0.2)), { fill: SN, 'fill-opacity': 0.34 }, 'wm-shine'))
  return n
}
