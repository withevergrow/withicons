// forge/hand/clay/nutcracker.mjs — a clay nutcracker soldier: a squared red shako with a gold band, badge and plume ball,
// a peach face with dark eyes and rosy cheeks, a visible hinged jaw with a row of white teeth, and a dark navy uniform
// collar with two gold epaulettes. No beard or white hair, so it reads as a toy soldier and not Santa.
// Hand-built from the style recipe (_clay-core.mjs); gradient ids wg-clay-nutcracker-<n>.
import { parsePath } from '../../kernel/geom.mjs'

const N = 'nutcracker'
const V = (r, h) => `var(--with-clay-${r}, ${h})`
const C1 = V('c1', '#FF5B6E'), C2 = V('c2', '#FFCB45'), C4 = V('c4', '#FFDDBE'), SH = V('shadow', '#6A0F2E')
const SN = V('shine', '#FFFFFF'), INK = V('ink', '#2A1D5C'), TINT = V('tint', '#FFF1F3')
const f = n => +n.toFixed(2)
const ell = (cx, cy, rx, ry) => `M${f(cx - rx)} ${f(cy)}A${rx} ${ry} 0 1 0 ${f(cx + rx)} ${f(cy)}A${rx} ${ry} 0 1 0 ${f(cx - rx)} ${f(cy)}Z`
// translate an absolute path (uppercase commands only)
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

export default function render() {
  const grads = [], out = []
  let k = 0
  const gid = () => `wg-clay-${N}-${k++}`
  // shared rim (dark on the edges facing away from the light)
  const rimId = gid()
  grads.push(['linearGradient', { id: rimId, x1: 5, y1: 4, x2: 19, y2: 21, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: '0', 'stop-color': SN, 'stop-opacity': '0.18' }],
    ['stop', { offset: '0.5', 'stop-color': SH, 'stop-opacity': '0' }],
    ['stop', { offset: '1', 'stop-color': SH, 'stop-opacity': '0.6' }]]])
  const shadowId = gid()
  grads.push(['radialGradient', { id: shadowId, cx: 12, cy: 22.1, r: 8.6, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: '0', 'stop-color': SH, 'stop-opacity': '0.3' }],
    ['stop', { offset: '0.55', 'stop-color': SH, 'stop-opacity': '0.2' }],
    ['stop', { offset: '1', 'stop-color': SH, 'stop-opacity': '0' }]]])
  out.push(['path', { d: ell(12, 22.1, 8.6, 1.1), fill: `url(#${shadowId})`, class: 'wm-shadow' }])
  out.push(['path', { d: ell(12, 22.1, 5.4, 0.6), fill: SH, 'fill-opacity': 0.13, class: 'wm-shadow' }])

  // one plump clay piece: wall, face colour, lit gradient + rim, specular
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

  // dark navy collar and gold epaulettes (behind the face)
  piece('M6.4 19.2H17.6L18.4 22.2H5.6Z', INK, { wall: 0.3, spec: false })
  for (const s of [-1, 1]) piece(ell(12 + s * 7, 19.9, 1.7, 1.2), C2, { cls: 'wm-k', wall: 0.35, spec: false })
  // face: peach head with the chin
  piece('M7.6 9.2H16.4V15.2C16.4 18.2 14.6 19.5 12 19.5C9.4 19.5 7.6 18.2 7.6 15.2Z', C4, { sx: 9.6, sy: 11.2 })
  // rosy cheeks and the eyes
  out.push(['path', { d: ell(8.9, 14, 0.9, 0.55), fill: C1, 'fill-opacity': 0.4, class: 'wm-k' }])
  out.push(['path', { d: ell(15.1, 14, 0.9, 0.55), fill: C1, 'fill-opacity': 0.4, class: 'wm-k' }])
  for (const x of [9.6, 14.4]) {
    out.push(['path', { d: ell(x, 12.5, 0.85, 1.0), fill: SN, 'fill-opacity': 0.4, class: 'wm-shine' }])
    out.push(['path', { d: ell(x, 12.3, 0.8, 0.95), fill: INK, class: 'wm-k' }])
    out.push(['path', { d: ell(f(x - 0.28), 11.9, 0.26, 0.26), fill: SN, class: 'wm-shine' }])
  }
  // open mouth with white teeth, then the hinged jaw closing under it
  out.push(['path', { d: 'M8.5 15.1H15.5V17.2H8.5Z', fill: INK, class: 'wm-a' }])
  out.push(['path', { d: 'M9.1 15.1H14.9V16.3H9.1Z', fill: TINT, class: 'wm-a' }])
  out.push(['path', { d: 'M10.6 15.1V16.3M12 15.1V16.3M13.4 15.1V16.3', fill: 'none', stroke: SH, 'stroke-opacity': 0.35, 'stroke-width': 0.35, class: 'wm-a' }])
  piece('M8.2 17H15.8C15.6 19 14.2 20.1 12 20.1C9.8 20.1 8.4 19 8.2 17Z', C4, { cls: 'wm-a', wall: 0.35, spec: false })
  for (const s of [-1, 1]) out.push(['path', { d: ell(12 + s * 4.1, 16.2, 0.4, 0.4), fill: INK, 'fill-opacity': 0.7, class: 'wm-a' }])
  // squared red shako: gold band, badge, brim and plume ball
  piece(ell(12, 2.9, 1.3, 1.3), C2, { cls: 'wm-a', wall: 0.35, spec: false })
  piece('M7.9 3.9H16.1Q16.7 3.9 16.7 4.5V9.7H7.3V4.5Q7.3 3.9 7.9 3.9Z', C1, { sx: 9.4, sy: 5.6 })
  piece('M6.9 7.4H17.1Q17.6 7.4 17.6 7.9V9Q17.6 9.5 17.1 9.5H6.9Q6.4 9.5 6.4 9V7.9Q6.4 7.4 6.9 7.4Z', C2, { wall: 0.4, spec: false })
  piece(ell(12, 5.7, 0.95, 0.95), C2, { wall: 0.25, spec: false })
  return [['defs', {}, grads], ...out]
}
