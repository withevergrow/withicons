// forge/hand/clay/lion-head.mjs — a clay lion: a big scalloped red mane framing a golden face, two small round ears on
// the mane, a cream muzzle with a dark nose and a tiny closed mouth, two dark glossy eyes. Mane, face and muzzle are three
// different shades so it reads as a lion (not a sun or a clown) down to 16px; no mane dots, no open mouth.
// Hand-built from the style recipe (_clay-core.mjs); gradient ids wg-clay-lion-head-<n>.
import { parsePath } from '../../kernel/geom.mjs'

const N = 'lion-head'
const V = (r, h) => `var(--with-clay-${r}, ${h})`
const C1 = V('c1', '#FF5B6E'), C2 = V('c2', '#FFCB45'), C3 = V('c3', '#FF8FA0'), C4 = V('c4', '#FFDDBE'), SH = V('shadow', '#6A0F2E')
const SN = V('shine', '#FFFFFF'), INK = V('ink', '#2A1D5C'), TINT = V('tint', '#FFDCE1')
const f = n => +n.toFixed(2)
const ell = (cx, cy, rx, ry) => `M${f(cx - rx)} ${f(cy)}A${rx} ${ry} 0 1 0 ${f(cx + rx)} ${f(cy)}A${rx} ${ry} 0 1 0 ${f(cx - rx)} ${f(cy)}Z`
function shift(d, dx, dy) {
  return d.replace(/([MLCQAHVZ])([^MLCQAHVZ]*)/g, (m, c, a) => {
    const n = a.trim().split(/[\s,]+/).filter(Boolean).map(Number)
    if (c === 'Z') return 'Z'
    if (c === 'H') return 'H' + f(n[0] + dx)
    if (c === 'V') return 'V' + f(n[0] + dy)
    if (c === 'A') { const o = []; for (let i = 0; i < n.length; i += 7) o.push(n[i], n[i + 1], n[i + 2], n[i + 3], n[i + 4], f(n[i + 5] + dx), f(n[i + 6] + dy)); return 'A' + o.join(' ') }
    return c + n.map((v, i) => f(v + (i % 2 ? dy : dx))).join(' ')
  })
}
const box = d => {
  let x0 = 99, y0 = 99, x1 = -99, y1 = -99
  for (const s of parsePath(d)) for (const [x, y] of s.pts) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y }
  return { x0, y0, w: x1 - x0, h: y1 - y0 }
}
// the mane: a ring of rounded lobes
const wavy = (cx, cy, r0, amp, n, steps = 100) => {
  let d = ''
  for (let i = 0; i < steps; i++) {
    const t = i / steps * Math.PI * 2 - Math.PI / 2, r = r0 + amp * Math.cos(n * (t + Math.PI / 2))
    d += (i ? 'L' : 'M') + f(cx + r * Math.cos(t)) + ' ' + f(cy + r * Math.sin(t))
  }
  return d + 'Z'
}

export default function render() {
  const grads = [], out = []
  let k = 0
  const gid = () => `wg-clay-${N}-${k++}`
  const rimId = gid()
  grads.push(['linearGradient', { id: rimId, x1: 5, y1: 4, x2: 19, y2: 21, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: '0', 'stop-color': SN, 'stop-opacity': '0.18' }],
    ['stop', { offset: '0.5', 'stop-color': SH, 'stop-opacity': '0' }],
    ['stop', { offset: '1', 'stop-color': SH, 'stop-opacity': '0.6' }]]])
  const shadowId = gid()
  grads.push(['radialGradient', { id: shadowId, cx: 12, cy: 21.8, r: 8.8, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: '0', 'stop-color': SH, 'stop-opacity': '0.3' }],
    ['stop', { offset: '0.55', 'stop-color': SH, 'stop-opacity': '0.2' }],
    ['stop', { offset: '1', 'stop-color': SH, 'stop-opacity': '0' }]]])
  out.push(['path', { d: ell(12, 21.8, 8.8, 1.2), fill: `url(#${shadowId})`, class: 'wm-shadow' }])
  out.push(['path', { d: ell(12, 21.8, 5.6, 0.65), fill: SH, 'fill-opacity': 0.13, class: 'wm-shadow' }])

  const piece = (d, base, o = {}) => {
    const cls = o.cls || 'wm-k', b = box(d), wall = o.wall === undefined ? 0.6 : o.wall
    if (wall) {
      out.push(['path', { d: shift(d, 0.1, wall), fill: base, class: cls }])
      out.push(['path', { d: shift(d, 0.1, wall), fill: SH, 'fill-opacity': 0.5, class: cls }])
    }
    out.push(['path', { d, fill: base, class: cls }])
    const g = gid(), r = Math.max(b.w, b.h) * 0.95 + 0.6
    grads.push(['radialGradient', { id: g, cx: f(b.x0 + b.w * 0.3), cy: f(b.y0 + b.h * 0.25), r: f(r), gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: '0', 'stop-color': SN, 'stop-opacity': '0.5' }],
      ['stop', { offset: '0.35', 'stop-color': SN, 'stop-opacity': '0.07' }],
      ['stop', { offset: '0.7', 'stop-color': SH, 'stop-opacity': '0.07' }],
      ['stop', { offset: '1', 'stop-color': SH, 'stop-opacity': '0.36' }]]])
    out.push(['path', { d, fill: `url(#${g})`, stroke: `url(#${rimId})`, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: cls }])
    if (o.spec !== false) {
      const sx = o.sx === undefined ? b.x0 + b.w * 0.27 : o.sx, sy = o.sy === undefined ? b.y0 + b.h * 0.22 : o.sy
      const sr = Math.min(0.62, Math.max(0.3, Math.min(b.w, b.h) * 0.14))
      out.push(['path', { d: ell(f(sx), f(sy), f(sr), f(sr * 0.6)), fill: SN, 'fill-opacity': 0.88, class: 'wm-shine' }])
    }
  }

  // red scalloped mane (round lobes, a shade apart from the face)
  piece(wavy(12, 12.2, 8.5, 0.75, 10), C1, { wall: 0.7, sx: 7.2, sy: 6.2 })
  // small round ears sitting on the mane
  for (const s of [-1, 1]) {
    piece(ell(12 + s * 4.9, 5.9, 1.8, 1.8), C2, { cls: 'wm-a', wall: 0.45, spec: false })
    out.push(['path', { d: ell(12 + s * 4.9, 6, 0.85, 0.85), fill: C3, class: 'wm-a' }])
  }
  // golden face
  piece(ell(12, 12.4, 5.7, 5.5), C2, { wall: 0.6, sx: 8.8, sy: 8.4 })
  // eyes: dark glossy ovals (the blinking part)
  for (const s of [-1, 1]) {
    const x = 12 + s * 3.0, y = 10.9
    out.push(['path', { d: ell(f(x), f(y + 0.2), 0.95, 1.1), fill: SN, 'fill-opacity': 0.4, class: 'wm-shine' }])
    out.push(['path', { d: ell(x, y, 0.9, 1.05), fill: INK, class: 'wm-a' }])
    out.push(['path', { d: ell(f(x - 0.28), f(y - 0.35), 0.28, 0.28), fill: SN, class: 'wm-shine' }])
  }
  // cream muzzle, dark nose, tiny mouth
  piece(ell(12, 15.3, 3.4, 2.5), C4, { wall: 0.35, spec: false })
  out.push(['path', { d: ell(10.3, 14.6, 0.9, 0.35), fill: SN, 'fill-opacity': 0.5, class: 'wm-shine' }])
  piece('M10.2 13.2H13.8Q13.8 14.7 12 15.4Q10.2 14.7 10.2 13.2Z', INK, { cls: 'wm-a', wall: 0, spec: false })
  out.push(['path', { d: ell(11.1, 13.7, 0.5, 0.25), fill: SN, 'fill-opacity': 0.6, class: 'wm-shine' }])
  out.push(['path', { d: 'M12 15.4V16.3M9.9 16.2Q11.1 17.5 12 16.3Q12.9 17.5 14.1 16.2', fill: 'none', stroke: INK, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }])
  return [['defs', {}, grads], ...out]
}
