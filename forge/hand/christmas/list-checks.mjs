// forge/hand/christmas/list-checks.mjs — three cranberry list bars with two fat pine-green ticks beside the first and
// last, and one slim snow cap on the top bar only. Replaces the generated drawing, where red ticks blended into the red
// bars and a second snow cap plus a holly sprig cluttered the top row.
// Roles: bars c1, ticks c2, outline ink, snow shine->tint, shared light on both. Motion: ticks wm-a (parts.A pops them).
import { C, num } from '../../styles/_christmas-core.mjs'

const NAME = 'list-checks'
const id = n => `wg-christmas-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const poly = P => 'M' + P.map(([x, y]) => `${num(x)} ${num(y)}`).join('L') + 'Z'
function snow(xa, xb, top, { up = 1.3, dn = 0.85, drips = [], ph = 0, maxDn = 9 } = {}) {
  const n = 32, U = [], L = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = xa + (xb - xa) * t, e = Math.pow(Math.sin(Math.PI * t), 0.45)
    let d = dn * e * (1 + 0.16 * Math.sin(x * 2.1 + ph))
    for (const [cx, w, l] of drips) { const u = (x - cx) / w; if (Math.abs(u) < 1) d = Math.max(d, (dn + l * Math.sqrt(1 - u * u)) * e) }
    U.push([x, top(x) - up * e * (1 + 0.08 * Math.sin(x * 1.4 + ph))]); L.push([x, top(x) + Math.min(d, maxDn)])
  }
  return [...U, ...L.reverse().slice(1, -1)]
}

const X0 = 11.75, X1 = 21.25, HH = 1.4
const bar = y => `M${num(X0 + HH)} ${num(y - HH)}H${num(X1 - HH)}A${HH} ${HH} 0 0 1 ${num(X1 - HH)} ${num(y + HH)}H${num(X0 + HH)}A${HH} ${HH} 0 0 1 ${num(X0 + HH)} ${num(y - HH)}Z`
const BARS = bar(6) + bar(12) + bar(18)
const TICKS = 'M2.6 6.1L4.75 8.25L8.6 4.1M2.6 18.1L4.75 20.25L8.6 16.1'
const top = x => {
  const a = X0 + HH, b = X1 - HH, y = 6 - HH
  return x < a ? 6 - Math.sqrt(Math.max(0, HH * HH - (x - a) ** 2)) : x > b ? 6 - Math.sqrt(Math.max(0, HH * HH - (x - b) ** 2)) : y
}

export default function render() {
  const cap = snow(X0 + 0.2, X1 - 0.2, top, { up: 1.3, dn: 0.75, drips: [[14.4, 0.7, 0.45], [19.1, 0.6, 0.3]], ph: 0.9, maxDn: 1.85 })
  const line = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2, y1: 3, x2: 12.45, y2: 21.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 3.3, x2: 0, y2: 6.1, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    // the bars
    ['path', { d: BARS, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: BARS, fill: url(0), class: 'wm-shine' }],
    // the ticks: an ink stroke under a pine stroke reads as an outlined tick
    ['path', { d: TICKS, ...line, stroke: C.ink, 'stroke-width': 3.5, class: 'wm-a' }],
    ['path', { d: TICKS, ...line, stroke: C.c2, 'stroke-width': 2.3, class: 'wm-a' }],
    ['path', { d: TICKS, ...line, stroke: url(0), 'stroke-width': 2.3, class: 'wm-shine' }],
    // snow on the top bar
    ['path', { d: poly(cap.map(([x, y]) => [x, y + 0.4])), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: poly(cap), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
