// forge/hand/christmas/bug.mjs — a cranberry beetle shell split by an ink seam, a pine head with a little snow cap,
// six crisp pine legs and two antennae outlined in ink. Replaces the generated drawing, where a pale cream body fused with blobby legs
// and the red antenna stubs, snow and shading cluttered the silhouette.
// Roles: shell c1, head + legs + antennae c2, seam and outlines ink, snow shine->tint. Motion: seam + antennae wm-a (wiggle about 12,14).
import { C, num } from '../../styles/_christmas-core.mjs'

const NAME = 'bug'
const id = n => `wg-christmas-${NAME}-${n}`, url = n => `url(#${id(n)})`
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

const SHELL = 'M7 11.75A2 2 0 0 1 9 9.75H15A2 2 0 0 1 17 11.75V15A5 5 0 0 1 7 15Z'
const HR = 2.85, HY = 8.75
const HEAD = `M${12 - HR} ${HY}A${HR} ${HR} 0 0 1 ${12 + HR} ${HY}Z`
const LEGS = 'M8 12.25L3.75 10.5M8 15.5H3.25M9.25 18.25L5.75 20.75M16 12.25L20.25 10.5M16 15.5H20.75M14.75 18.25L18.25 20.75'
const ANTENNAE = 'M10.6 6.6L8.6 3.6M13.4 6.6L15.4 3.6'
const headTop = x => HY - Math.sqrt(Math.max(0, HR * HR - (x - 12) ** 2))

export default function render() {
  const cap = snow(10.05, 13.95, headTop, { up: 1.05, dn: 0.6, ph: 0.7, maxDn: 1.1 })
  const line = { fill: 'none', stroke: C.ink, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 7, y1: 5.9, x2: 12.5, y2: 20, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 4.8, x2: 0, y2: 7.2, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    // legs and antennae first, so the shell and head cover their roots
    ['path', { d: LEGS, ...line, 'stroke-width': 2.3, class: 'wm-k' }],
    ['path', { d: LEGS, ...line, stroke: C.c2, 'stroke-width': 1.1, class: 'wm-k' }],
    ['path', { d: ANTENNAE, ...line, 'stroke-width': 2.1, class: 'wm-a' }],
    ['path', { d: ANTENNAE, ...line, stroke: C.c2, 'stroke-width': 0.9, class: 'wm-a' }],
    // head and shell
    ['path', { d: HEAD, fill: C.c2, ...INK, class: 'wm-k' }],
    ['path', { d: SHELL, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: HEAD + SHELL, fill: url(0), class: 'wm-shine' }],
    // the seam between the wing cases, and a glint on each
    ['path', { d: 'M12 10.05V19.7', ...line, 'stroke-width': 0.9, class: 'wm-a' }],
    ['path', { d: 'M8.7 12.2V14.4M15.3 12.2V13.1', fill: 'none', stroke: C.shine, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.75, class: 'wm-shine' }],
    // a little snow on the head
    ['path', { d: poly(cap.map(([x, y]) => [x, y + 0.38])), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: poly(cap), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
