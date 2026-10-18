// forge/hand/soft3d/bookmark.mjs — a tall red ribbon bookmark lying face-on with the deep V-notch cut into its bottom edge,
// as in the line drawing: straight sides, rounded top corners, a shaded thickness below and a lit rim on the upper left.
// The generated soft 3D bookmark read as a rounded tile because the notch collapsed. Same slab recipe as the style's
// face-on glyphs (check, copy): contact shadow, wall, face with the soft dome light, rim light.
// Roles: ribbon c1, shine/shadow. Motion: body wm-k, shadow wm-shadow, speculars wm-shine.
const N = 'bookmark'
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

const RIB = rpoly([[6, 3], [18, 3], [18, 20.5], [12, 15.4], [6, 20.5]], [2.2, 2.2, 0.7, 0.6, 0.7])
const C1 = v('c1', '#EE5A3C')

export default function render() {
  const n = [GRADS]
  n.push(P(ell(12.2, 22.1, 6.8, 1.15), { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'))
  n.push(P(ell(12.2, 22.1, 5.4, 0.92), { fill: SH, 'fill-opacity': 0.08 }, 'wm-shadow'))
  n.push(P(ell(12.2, 22.1, 3.9, 0.66), { fill: SH, 'fill-opacity': 0.11 }, 'wm-shadow'))
  n.push(...WALL(RIB, 0, 1, 5, C1, 'wm-k'))
  n.push(...FACE(D(RIB), C1, 1, 'wm-k'))
  // lit rim on the top and left edges, a soft dark rim down the right edge
  n.push(LINE('M6.65 19.2V5.3Q6.65 3.65 8.3 3.65H15.7', SN, 0.62, 0.62, 'wm-shine'))
  n.push(LINE('M17.35 5.3V19.2', SH, 0.62, 0.22, 'wm-k'))
  n.push(LINE('M8.6 6.2V12.4', SN, 0.9, 0.3, 'wm-shine'))
  return n
}
