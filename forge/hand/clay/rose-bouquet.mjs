// forge/hand/clay/rose-bouquet.mjs — three plump pink clay roses (one on top, two below it), each a lobed ball with a
// swirl pressed into its centre, two green leaves at the sides, and a golden paper cone tied with a pink bow. The generator
// merged the heads into one scalloped cloud with no swirls, so it read as a frosted cupcake; here each rose is its own raised
// piece with a spiral centre. Hand-built from the style recipe (_clay-core.mjs); gradient ids wg-clay-rose-bouquet-<n>.
import { parsePath } from '../../kernel/geom.mjs'

const N = 'rose-bouquet'
const V = (r, h) => `var(--with-clay-${r}, ${h})`
const C1 = V('c1', '#FF7AB6'), C2 = V('c2', '#FFD24A'), C3 = V('c3', '#3ECB80'), SH = V('shadow', '#6A1041')
const SN = V('shine', '#FFFFFF'), TINT = V('tint', '#FFE1EF')
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
// a rose head: a round ball with five soft petal lobes
const lobed = (cx, cy, r, amp = 0.22, n = 5, steps = 30) => {
  let d = ''
  for (let i = 0; i < steps; i++) {
    const t = i / steps * Math.PI * 2, rr = r + amp * Math.cos(n * t + 0.6)
    d += (i ? 'L' : 'M') + f(cx + rr * Math.cos(t)) + ' ' + f(cy + rr * Math.sin(t))
  }
  return d + 'Z'
}
// the swirl at the heart of a rose: an outward spiral, about 1.75 turns
const spiral = (cx, cy, R, dx = 0, dy = 0) => {
  let d = ''
  const turns = 1.75, steps = 18
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, a = t * turns * Math.PI * 2 - 0.9, r = R * (0.12 + 0.78 * t)
    d += (i ? 'L' : 'M') + f(cx + dx + r * Math.cos(a)) + ' ' + f(cy + dy + r * Math.sin(a) * 0.95)
  }
  return d
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
  grads.push(['radialGradient', { id: shadowId, cx: 12, cy: 21.9, r: 7.6, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: '0', 'stop-color': SH, 'stop-opacity': '0.3' }],
    ['stop', { offset: '0.55', 'stop-color': SH, 'stop-opacity': '0.2' }],
    ['stop', { offset: '1', 'stop-color': SH, 'stop-opacity': '0' }]]])
  out.push(['path', { d: ell(12, 21.9, 7.6, 1.1), fill: `url(#${shadowId})`, class: 'wm-shadow' }])
  out.push(['path', { d: ell(12, 21.9, 4.6, 0.6), fill: SH, 'fill-opacity': 0.13, class: 'wm-shadow' }])

  const piece = (d, base, o = {}) => {
    const cls = o.cls || 'wm-k', b = box(d), wall = o.wall === undefined ? 0.6 : o.wall
    if (wall) {
      const wd = o.wallD ? shift(o.wallD, 0.1, wall) : shift(d, 0.1, wall)
      out.push(['path', { d: wd, fill: base, class: cls }])
      out.push(['path', { d: wd, fill: SH, 'fill-opacity': 0.5, class: cls }])
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
  const leaf = s => {
    const m = x => f(12 + s * (x - 12))
    const d = `M${m(8.2)} 13.4C${m(6)} 12.2 ${m(3)} 12.8 ${m(2.2)} 16.2C${m(5.2)} 17 ${m(7.6)} 15.6 ${m(8.4)} 14.2Z`
    piece(d, C3, { cls: 'wm-a', wall: 0.45, sx: m(4.6), sy: 14 })
    out.push(['path', { d: `M${m(7.6)} 14.3C${m(6.2)} 14.4 ${m(4.6)} 15 ${m(3.4)} 15.7`, fill: 'none', stroke: SH, 'stroke-opacity': 0.35, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-a' }])
  }
  leaf(-1); leaf(1)

  // the wrapped paper cone with a pressed fold
  const CONE = 'M6.3 11.6H17.7L13.5 20.9Q12 22 10.5 20.9Z'
  piece(CONE, C2, { wall: 0.5, sx: 8.4, sy: 14 })
  out.push(['path', { d: 'M9.1 12.6L11.3 20.6', fill: 'none', stroke: SH, 'stroke-opacity': 0.3, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-k' }])
  out.push(['path', { d: 'M9.45 12.6L11.65 20.6', fill: 'none', stroke: SN, 'stroke-opacity': 0.5, 'stroke-width': 0.35, 'stroke-linecap': 'round', class: 'wm-shine' }])

  // three roses: lobed clay balls with a swirl pressed into the middle; the back two first, the top one over them
  const rose = (cx, cy, R) => {
    piece(lobed(cx, cy, R), C1, { cls: 'wm-a', wall: 0.55, wallD: ell(cx, cy, R, R), sx: cx - R * 0.45, sy: cy - R * 0.55 })
    out.push(['path', { d: ell(cx, cy, f(R * 0.62), f(R * 0.62)), fill: SH, 'fill-opacity': 0.12, class: 'wm-a' }])
    out.push(['path', { d: spiral(cx, cy, R * 0.66, 0.12, 0.2), fill: 'none', stroke: SN, 'stroke-opacity': 0.45, 'stroke-width': 0.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shine' }])
    out.push(['path', { d: spiral(cx, cy, R * 0.66), fill: 'none', stroke: SH, 'stroke-opacity': 0.6, 'stroke-width': 0.55, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }])
  }
  rose(8.1, 9.9, 3.3)
  rose(15.9, 9.9, 3.3)
  rose(12, 5.9, 3.4)

  // the bow at the neck of the cone: two loops, a knot and two tails
  const bow = s => {
    const m = x => f(12 + s * (x - 12))
    piece(`M${m(12.6)} 15.4C${m(13.4)} 14 ${m(15.8)} 13.7 ${m(16.1)} 15.4C${m(16.3)} 17 ${m(14)} 17.3 ${m(12.6)} 16.2Z`, C1, { cls: 'wm-s', wall: 0.35, spec: false })
    piece(`M${m(12.3)} 16.7L${m(14.4)} 19.7L${m(12.8)} 19.9L${m(11.5)} 17.3Z`, C1, { cls: 'wm-s', wall: 0.3, spec: false })
  }
  bow(-1); bow(1)
  piece(ell(12, 15.8, 1.05, 1.15), C1, { cls: 'wm-s', wall: 0.3, sx: 11.6, sy: 15.3 })
  return [['defs', {}, grads], ...out]
}
