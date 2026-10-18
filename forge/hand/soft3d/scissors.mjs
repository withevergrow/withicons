// forge/hand/soft3d/scissors.mjs — an open pair of scissors: two red ring handles at the left whose shanks cross at a
// dark pivot and carry two silver blades fanning out to the right, as in the line drawing. The generated scissors read as
// a red hammer with a roller. Each half is a lit solid (ring, shank, blade) with a short wall behind it.
// Roles: handles c1, blades c2, pivot ink. Motion: the lower half wm-k, the upper half wm-a (both rock at the pivot).
const N = 'scissors'
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

const C1 = v('c1', '#E5483F'), C2 = v('c2', '#BFC7D2'), INK = v('ink', '#232733')
const PV = [12.6, 12], R = 3.1, HOLE = 1.35
const DX = 0.8, DY = 0.6, NX = -0.6, NY = 0.8 // the upper half runs down to the right along (DX, DY)
// a half: s = 1 for the upper handle (blade running down to the right), -1 for its mirror under the pivot
function half(s) {
  const m = ([x, y]) => [x, s > 0 ? y : 24 - y]
  const at = (u, w) => m([PV[0] + u * DX + w * NX, PV[1] + u * DY + w * NY])
  const ring = m([PV[0] - 7 * DX, PV[1] - 7 * DY])
  const shank = rpoly([at(-6.0, -1.2), at(1.2, -1.2), at(1.2, 1.2), at(-6.0, 1.2)], 0.5)
  const handle = [...circ(ring[0], ring[1], R, false), ...circ(ring[0], ring[1], HOLE, true), ...shank]
  const blade = rpoly([at(-1.3, -1.0), at(9.8, -0.3), at(3.6, 1.9), at(-1.3, 1.9)], [0.35, 0.45, 0.7, 0.45])
  const arc = (r, a0, a1) => { const p = a => [ring[0] + r * Math.cos(a * Math.PI / 180), ring[1] + r * Math.sin(a * Math.PI / 180)].map(f).join(' '); return 'M' + p(a0) + 'A' + r + ' ' + r + ' 0 0 1 ' + p(a1) }
  const edge = 'M' + at(-0.4, -0.55).map(f).join(' ') + 'L' + at(8.6, -0.1).map(f).join(' ')
  return { handle, blade, ring, arc, edge }
}
const U = half(1), B = half(-1)

function draw(h, cls) {
  const n = []
  n.push(...WALL(h.handle, 0.8, -0.45, 3, C1, cls))
  n.push(...WALL(h.blade, 0.8, -0.45, 3, C2, cls, 0.3))
  n.push(...FACE(D(h.handle), C1, 0, cls))
  n.push(...FACE(D(h.blade), C2, 0, cls))
  return n
}

export default function render() {
  const n = [GRADS]
  n.push(P(ell(12.3, 21.9, 9.2, 1.3), { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'))
  n.push(P(ell(12.3, 21.9, 7.3, 1.04), { fill: SH, 'fill-opacity': 0.08 }, 'wm-shadow'))
  n.push(P(ell(12.3, 21.9, 5.3, 0.75), { fill: SH, 'fill-opacity': 0.11 }, 'wm-shadow'))
  n.push(...draw(B, 'wm-k'))
  n.push(LINE(B.arc(2.6, 120, 250), SN, 0.62, 0.6, 'wm-shine'))
  n.push(LINE(B.edge, SN, 0.5, 0.65, 'wm-shine'))
  n.push(...draw(U, 'wm-a'))
  n.push(LINE(U.arc(2.6, 120, 250), SN, 0.62, 0.6, 'wm-shine'))
  n.push(LINE(U.edge, SN, 0.5, 0.65, 'wm-shine'))
  // pivot screw
  const PIV = circ(PV[0], PV[1], 1.2, false)
  n.push(P(D(PIV, 0.15, 0.25), { fill: SH, 'fill-opacity': 0.3 }, 'wm-a'))
  n.push(...WALL(PIV, 0.45, -0.25, 2, INK, 'wm-a', 0.2))
  n.push(...FACE(D(PIV), INK, 0, 'wm-a'))
  n.push(LINE('M11.9 11.5Q12.2 11 12.8 11', SN, 0.45, 0.7, 'wm-shine'))
  return n
}
