// forge/hand/christmas/file-archive.mjs — the cranberry page with its cream folded corner and a real zipper: an ink track
// of interlocking cream teeth running down from the top edge into a gold slider and pull ring, under one snow cap.
// The generated drawing scattered four white dots and a pill, which did not read as a zip at 16-24px.
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'file-archive'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const poly = P => 'M' + P.map(([x, y]) => `${num(x)} ${num(y)}`).join('L') + 'Z'
function snow(xa, xb, top, { up = 1.3, dn = 0.85, drips = [], ph = 0, maxDn = 9 } = {}) {
  const n = 28, U = [], L = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = xa + (xb - xa) * t, e = Math.pow(Math.sin(Math.PI * t), 0.45)
    let d = dn * e * (1 + 0.16 * Math.sin(x * 2.1 + ph))
    for (const [cx, w, l] of drips) { const u = (x - cx) / w; if (Math.abs(u) < 1) d = Math.max(d, (dn + l * Math.sqrt(1 - u * u)) * e) }
    U.push([x, top(x) - up * e * (1 + 0.08 * Math.sin(x * 1.4 + ph))]); L.push([x, top(x) + Math.min(d, maxDn)])
  }
  return [...U, ...L.reverse().slice(1, -1)]
}

const PAGE = 'M14 2.5H7A2 2 0 0 0 5 4.5V19.5A2 2 0 0 0 7 21.5H17A2 2 0 0 0 19 19.5V7.5Z'
const FLAP = 'M14 2.5V6A1.5 1.5 0 0 0 15.5 7.5H19Z'
const TRACK = 'M9 3H12.2V13.2H9Z'
// interlocking teeth: left, right, left ... each 1.05 tall on a 1.3 step
const TEETH = Array.from({ length: 7 }, (_, k) => {
  const y = 3.7 + 1.3 * k, x = k % 2 ? 10.3 : 9.3
  return `M${num(x)} ${num(y)}h1.6v1.05h-1.6z`
}).join('')
const SLIDER = 'M9.7 12.4H11.5A1 1 0 0 1 12.5 13.4V14.6A1 1 0 0 1 11.5 15.6H9.7A1 1 0 0 1 8.7 14.6V13.4A1 1 0 0 1 9.7 12.4Z'
const PULL = 'M10.6 15.4A1.3 1.3 0 0 1 11.9 16.7V18.3A1.3 1.3 0 0 1 10.6 19.6A1.3 1.3 0 0 1 9.3 18.3V16.7A1.3 1.3 0 0 1 10.6 15.4ZM10.6 16.5A.55 .55 0 0 1 11.15 17.05V17.95A.55 .55 0 0 1 10.6 18.5A.55 .55 0 0 1 10.05 17.95V17.05A.55 .55 0 0 1 10.6 16.5Z'

export default function render() {
  const cap = snow(6.3, 13.7, () => 2.5, { drips: [[7.9, 0.6, 0.55], [13, 0.45, 0.4]], ph: 0.7, maxDn: 1.9 })
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 5, y1: 2.5, x2: 13, y2: 21.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 0.9, x2: 0, y2: 4.4, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(2), x1: 0, y1: 0, x2: 0.6, y2: 1 }, [st(0, C.shine, 0.45), st(0.45, C.shine, 0), st(1, C.shadow, 0.35)]],
    ]],
    ['path', { d: PAGE, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: PAGE, fill: url(0), class: 'wm-shine' }],
    ['path', { d: FLAP, fill: C.c4, ...INK, class: 'wm-k' }],
    // the zipper
    ['path', { d: TRACK, fill: C.ink, class: 'wm-k' }],
    ['path', { d: TEETH, fill: C.c4, class: 'wm-k' }],
    ['path', { d: PULL, fill: C.c3, 'fill-rule': 'evenodd', ...INK, class: 'wm-a' }],
    ['path', { d: SLIDER, fill: C.c3, ...INK, class: 'wm-a' }],
    ['path', { d: SLIDER, fill: url(2), class: 'wm-shine' }],
    // snow resting on the top edge
    ['path', { d: poly(cap.map(([x, y]) => [x, y + 0.38])), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: poly(cap), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
