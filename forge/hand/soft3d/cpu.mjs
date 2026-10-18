// forge/hand/soft3d/cpu.mjs — a square dark chip with three silver pins on each of its four sides and a raised silver die
// with a dark recess in the middle. The generated chip fused its pins into a gear-like blob with an oval socket; here the
// pins stand clear of the body so the comb silhouette reads at 16px. Same studio recipe as the style's solid objects:
// contact shadow, wall to the upper right, face with the shared diagonal light, lit rim on the upper left.
// Roles: body c1, pins and die c2, recess ink. Motion: body wm-k, die wm-a (the glow), shadow wm-shadow.
const N = 'cpu'
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

const C1 = v('c1', '#3A404C'), C2 = v('c2', '#BFC7D2'), INK = v('ink', '#232733')
const BODY = rr(5, 5.5, 13, 13, 2.6)
const pins = []
// three bold pins a side, standing clear of the body
for (const t of [7.9, 11.5, 15.1]) {
  pins.push(...rr(t - 0.95, 2.2, 1.9, 3.5, 0.65), ...rr(t - 0.95, 18.3, 1.9, 3.5, 0.65))
  pins.push(...rr(1.5, t + 0.5 - 0.95, 3.5, 1.9, 0.65), ...rr(18, t + 0.5 - 0.95, 3.5, 1.9, 0.65))
}
const DIE = rr(8.3, 8.8, 6.4, 6.4, 1.4)
const WELL = rr(10, 10.5, 3, 3, 0.6)

export default function render() {
  const n = [GRADS]
  n.push(P(ell(12.1, 22.4, 10.2, 1.1), { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'))
  n.push(P(ell(12.1, 22.4, 8.2, 0.9), { fill: SH, 'fill-opacity': 0.08 }, 'wm-shadow'))
  n.push(P(ell(12.1, 22.4, 6, 0.65), { fill: SH, 'fill-opacity': 0.11 }, 'wm-shadow'))
  // pins: silver, a thin wall each
  n.push(...WALL(pins, 0.7, -0.4, 2, C2, 'wm-k', 0.3))
  n.push(...FACE(D(pins), C2, 0, 'wm-k'))
  // body
  n.push(...WALL(BODY, 1.2, -0.7, 4, C1, 'wm-k', 0.22))
  n.push(...FACE(D(BODY), C1, 0, 'wm-k'))
  // lift the charcoal body off a dark page: a pale wash and a full light rim
  n.push(P(D(BODY), { fill: SN, 'fill-opacity': 0.12 }, 'wm-shine'))
  n.push(LINE(D(BODY), SN, 0.6, 0.5, 'wm-shine'))
  n.push(LINE('M6.2 16.9V8.4Q6.2 6.7 7.9 6.7H15', SN, 0.62, 0.5, 'wm-shine'))
  n.push(LINE('M17.3 17.3H7.8Q6.2 17.3 6.2 15.7', SH, 0.62, 0.3, 'wm-k'))
  // die: contact shade, a short wall, the lit silver face, a dark recess
  n.push(P(D(DIE, 0.2, 0.3), { fill: SH, 'fill-opacity': 0.3 }, 'wm-a'))
  n.push(...WALL(DIE, 0.55, -0.32, 2, C2, 'wm-a', 0.34))
  n.push(...FACE(D(DIE), C2, 0, 'wm-a'))
  n.push(P(D(WELL), { fill: INK }, 'wm-a'))
  n.push(LINE('M9.4 14.3V10.4Q9.4 9.8 10 9.8H13.2', SN, 0.5, 0.7, 'wm-shine'))
  return n
}
