// forge/hand/christmas/database.mjs — the classic database glyph in cranberry: a top platter with one lit face and two
// platters below it, each separated by a clear 1.5u band of background, a thin even snow line hugging only the far
// rim and a gold sparkle. Earlier drawings showed pale lit crescents between touching bands and a lumpy frosting mound,
// which read as a layer cake; open gaps, one deep face and a hairline of snow make it data storage.
import { C, loopsD, num } from '../../styles/_christmas-core.mjs'

const N = 'database'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const sparkle = (x, y, r) => { const q = r * 0.22, P = (a, b) => `${num(a)} ${num(b)}`; return `M${P(x, y - r)}Q${P(x + q, y - q)} ${P(x + r, y)}Q${P(x + q, y + q)} ${P(x, y + r)}Q${P(x - q, y + q)} ${P(x - r, y)}Q${P(x - q, y - q)} ${P(x, y - r)}z` }

const CX = 12, RX = 8, RY = 2.5, H = 3.25
const TOPS = [5.25, 10, 14.75] // top platter first; each band below starts 1.5u under the one above
const x0 = CX - RX, x1 = CX + RX
// the top platter: lit face + wall
const cyl = t => `M${x0} ${t}A${RX} ${RY} 0 0 1 ${x1} ${t}V${num(t + H)}A${RX} ${RY} 0 0 1 ${x0} ${num(t + H)}Z`
const face = t => `M${x0} ${t}A${RX} ${RY} 0 0 1 ${x1} ${t}A${RX} ${RY} 0 0 1 ${x0} ${t}Z`
// a lower platter: only its wall shows, its top edge runs parallel to the bottom of the platter above
const band = t => `M${x0} ${num(t)}A${RX} ${RY} 0 0 0 ${x1} ${num(t)}V${num(t + H)}A${RX} ${RY} 0 0 1 ${x0} ${num(t + H)}Z`
const rimTop = x => TOPS[0] - RY * Math.sqrt(Math.max(0, 1 - ((x - CX) / RX) ** 2))

// a thin, even snow line on the far rim only: up 0.5, down 0.4, tapering to nothing at both ends
function snowLine(xa, xb, up = 0.5, dn = 0.4, taper = 2) {
  const U = [], D = []
  for (let x = xa; x <= xb + 1e-6; x += 0.25) {
    const e = Math.max(0, Math.min(1, (x - xa) / taper, (xb - x) / taper))
    const q = Math.sqrt(e * e * (3 - 2 * e))
    U.push([x, rimTop(x) - up * q]); D.push([x, rimTop(x) + dn * q])
  }
  return loopsD([[...U, ...D.slice().reverse()]])
}

export default function render() {
  const out = []
  // back to front: the lowest platter is drawn first
  for (const k of [2, 1]) {
    const t = TOPS[k], cls = k === 1 ? 'wm-a' : 'wm-k'
    out.push(['path', { d: band(t), fill: C.c1, ...INK, class: cls }])
    out.push(['path', { d: band(t), fill: url(0), class: k === 1 ? 'wm-a' : 'wm-shine' }])
  }
  const t = TOPS[0]
  out.push(['path', { d: cyl(t), fill: C.c1, ...INK, class: 'wm-k' }])
  out.push(['path', { d: cyl(t), fill: url(0), class: 'wm-shine' }])
  out.push(['path', { d: face(t), fill: C.c1, stroke: C.ink, 'stroke-width': 0.5, class: 'wm-k' }])
  out.push(['path', { d: face(t), fill: url(2), class: 'wm-shine' }])
  // the one shine accent: a short glint on the near-left of the top face
  out.push(['path', { d: `M6.5 ${num(t + 0.6)}Q8.25 ${num(t + 1.6)} 10.75 ${num(t + 1.85)}`, fill: 'none', stroke: C.shine, 'stroke-width': 0.55, 'stroke-linecap': 'round', 'stroke-opacity': 0.7, class: 'wm-shine' }])
  out.push(['path', { d: snowLine(5, 19), fill: url(1), stroke: C.ink, 'stroke-width': 0.35, 'stroke-linejoin': 'round', class: 'wm-deco' }])
  out.push(['path', { d: sparkle(21, 2.5, 1.3), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }])
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 2.5, x2: 13, y2: 22, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.3), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2, x2: 0, y2: 3.6, gradientUnits: 'userSpaceOnUse' }, [st(0.2, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(2), x1: 4, y1: 0, x2: 20, y2: 0, gradientUnits: 'userSpaceOnUse' }, [st(0, C.shine, 0.16), st(1, C.shadow, 0.12)]],
    ]],
    ...out,
  ]
}
