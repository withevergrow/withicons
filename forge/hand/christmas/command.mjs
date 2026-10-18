// forge/hand/christmas/command.mjs — the looped command key as one continuous pine tube with merged crossings, a
// little thicker so the four loops and the centre square stay open at 16px, and thin snow on the two top loops.
// Replaces the generated drawing, where outlines at every crossing cut the glyph into a hash grid and a star
// wedged between the top loops closed the gap.
// Roles: tube c2, outline ink, snow shine->tint. Motion: the whole key squishes (wm-k).
import { C, num } from '../../styles/_christmas-core.mjs'

const NAME = 'command'
const id = n => `wg-christmas-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
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

const INK_W = 3.05, COL_W = 1.85, HALF = INK_W / 2
const KEY = 'M9.5 9.5V6.5A3 3 0 1 0 6.5 9.5H17.5A3 3 0 1 0 14.5 6.5V17.5A3 3 0 1 0 17.5 14.5H6.5A3 3 0 1 0 9.5 17.5Z'
const loopTop = cx => x => 6.5 - Math.sqrt(Math.max(0, (3 + HALF) ** 2 - (x - cx) ** 2))

export default function render() {
  const capL = snow(3.75, 9.25, loopTop(6.5), { up: 0.95, dn: 0.7, ph: 0.5, drips: [[5.6, 0.7, 0.4]], maxDn: 1.2 })
  const capR = snow(14.75, 20.25, loopTop(17.5), { up: 0.95, dn: 0.7, ph: 2.2, drips: [[18.4, 0.7, 0.4]], maxDn: 1.2 })
  const line = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2, y1: 2, x2: 13, y2: 22, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1, x2: 0, y2: 3.6, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    // one ink tube under one colour tube: the four crossings merge cleanly
    ['path', { d: KEY, ...line, stroke: C.ink, 'stroke-width': INK_W, class: 'wm-k' }],
    ['path', { d: KEY, ...line, stroke: C.c2, 'stroke-width': COL_W, class: 'wm-k' }],
    ['path', { d: KEY, ...line, stroke: url(0), 'stroke-width': COL_W, class: 'wm-shine' }],
    // thin snow on the two top loops
    ['path', { d: poly(capL.map(([x, y]) => [x, y + 0.4])) + poly(capR.map(([x, y]) => [x, y + 0.4])), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: poly(capL) + poly(capR), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
