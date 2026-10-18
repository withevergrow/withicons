// forge/hand/halloween/bell-ring.mjs — a chunky witch-purple bell on a little knob, a pumpkin clapper and one slime-green
// ring arc each side, all in the midnight outline. Replaces the generated drawing, where slime goo and drips coated the
// lip and fused with the clapper into a lumpy green skirt, so the bell lost its silhouette at 16px.
// Roles: body c3 -> edge, clapper c1 -> c2, ring arcs c4, outline ink, halo accent, shine shine, drop shadow shadow.
// Motion: bell body wm-k (ring about 12,4.5), clapper wm-a, ring arcs wm-s.
import { C } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const NAME = 'bell-ring'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

// offset an absolute path (M L H V C Q A Z) by dx, dy: the drop shadow is the silhouette moved down
function shift(d, dx, dy) {
  return d.replace(/([MLHVCQAZ])([^MLHVCQAZ]*)/g, (_, c, args) => {
    const v = args.trim() ? args.trim().split(/[\s,]+/).map(Number) : []
    const o = v.map((x, i) => {
      if (c === 'H') return x + dx
      if (c === 'V') return x + dy
      if (c === 'A') return i % 7 === 5 ? x + dx : i % 7 === 6 ? x + dy : x
      return i % 2 ? x + dy : x + dx
    })
    return c + o.map(num).join(' ')
  })
}
// a crescent highlight hugging a circle's edge between two angles (degrees, y down)
function crescent(cx, cy, r, a0, a1, k = 1.45) {
  const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)]
  const [x0, y0] = p(a0), [x1, y1] = p(a1)
  return `M${num(x0)} ${num(y0)}A${num(r)} ${num(r)} 0 0 1 ${num(x1)} ${num(y1)}A${num(r * k)} ${num(r * k)} 0 0 0 ${num(x0)} ${num(y0)}Z`
}

const BODY = 'M5.1 10.8A6.9 6.9 0 0 1 18.9 10.8V15.2C18.9 16.1 19.4 16.8 20.1 17.35C21.1 18.1 20.7 19.5 19.5 19.5H4.5C3.3 19.5 2.9 18.1 3.9 17.35C4.6 16.8 5.1 16.1 5.1 15.2Z'
const KNOB = 'M10.75 3.5A1.25 1.25 0 1 1 13.25 3.5A1.25 1.25 0 1 1 10.75 3.5Z'
const CLAPPER = 'M9.7 19.9A2.3 2.3 0 1 0 14.3 19.9A2.3 2.3 0 1 0 9.7 19.9Z'
const ARCS = 'M2.5 9.5A10 10 0 0 1 5.5 3.5M21.5 9.5A10 10 0 0 0 18.5 3.5'
// the lip band: a slightly deeper ring at the mouth of the bell, so the flare reads
const LIP = 'M4.5 19.5C3.3 19.5 2.9 18.1 3.9 17.35L4.2 17.1H19.8L20.1 17.35C21.1 18.1 20.7 19.5 19.5 19.5Z'

export default function render() {
  const sh = { fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 12.7, r: 11.4, fx: 9.3, fy: 7.8, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c3), st(0.45, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(1), cx: 11.3, cy: 19.4, r: 3, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c1), st(0.55, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.7, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    // drop shadows
    ['path', { d: shift(BODY + KNOB + CLAPPER, 0.15, 0.85), ...sh }],
    ['path', { d: shift(ARCS, 0.15, 0.85), ...ROUND, stroke: C.shadow, 'stroke-opacity': 0.3, 'stroke-width': 2, class: 'wm-shadow' }],
    // ring arcs: ink first, slime on top
    ['path', { d: ARCS, ...ROUND, stroke: C.ink, 'stroke-width': 2.72, class: 'wm-s' }],
    ['path', { d: ARCS, ...ROUND, stroke: C.c4, 'stroke-width': 1.28, class: 'wm-s' }],
    // clapper and knob sit behind the body
    ['path', { d: CLAPPER, fill: url(1), ...INK, class: 'wm-a' }],
    ['path', { d: KNOB, fill: C.c3, ...INK, class: 'wm-k' }],
    ['path', { d: BODY, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: LIP, fill: C.edge, 'fill-opacity': 0.7, class: 'wm-k' }],
    ['path', { d: 'M4.2 17.1H19.8', ...ROUND, stroke: C.ink, 'stroke-width': 0.6, class: 'wm-k' }],
    // shine on the lit shoulder of the dome
    ['path', { d: crescent(12, 10.8, 6.1, 192, 262), fill: C.shine, 'fill-opacity': 0.45, class: 'wm-shine' }],
    ['path', { d: 'M6.15 12.2V15', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.4, 'stroke-width': 0.7, class: 'wm-shine' }],
  ]
}
