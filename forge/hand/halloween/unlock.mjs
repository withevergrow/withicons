// forge/hand/halloween/unlock.mjs — a plump pumpkin padlock with a high-contrast ink keyhole and a witch-purple shackle
// swung open: the left leg sinks into the body and the right leg hangs free above it. Replaces the generated drawing,
// where a dark midnight body swallowed the keyhole and the shackle floated detached from the body.
// Roles: body c1 -> c2, shackle c3 -> edge, keyhole ink, outline ink, halo accent, shine shine, shadow shadow.
// Motion: body wm-k, shackle wm-a, halo wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'unlock'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

const body = (dx, dy) => { const p = v => Math.round(v * 100) / 100
  const x0 = 3.5 + dx, x1 = 20.5 + dx, y0 = 10.5 + dy, y1 = 21.5 + dy
  return `M${p(x0 + 2.5)} ${p(y0)}H${p(x1 - 2.5)}A2.5 2.5 0 0 1 ${p(x1)} ${p(y0 + 2.5)}V${p(y1 - 2.5)}A2.5 2.5 0 0 1 ${p(x1 - 2.5)} ${p(y1)}H${p(x0 + 2.5)}A2.5 2.5 0 0 1 ${p(x0)} ${p(y1 - 2.5)}V${p(y0 + 2.5)}A2.5 2.5 0 0 1 ${p(x0 + 2.5)} ${p(y0)}Z` }
// open shackle: left leg into the body, arch, right leg stopping clear above it
const SHACKLE = 'M7.75 11.5V8A4.25 4.25 0 0 1 16.25 8V8.6'
const KEYHOLE = 'M12 13.9A1.65 1.65 0 0 1 13.2 16.7L13.55 19H10.45L10.8 16.7A1.65 1.65 0 0 1 12 13.9Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 16.5, r: 12.5, fx: 8.2, fy: 11.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 7, y1: 4, x2: 17, y2: 11, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.55, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: body(0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: SHACKLE, ...ROUND, stroke: C.ink, 'stroke-width': 3.2, class: 'wm-a' }],
    ['path', { d: SHACKLE, ...ROUND, stroke: url(1), 'stroke-width': 1.75, class: 'wm-a' }],
    ['path', { d: body(0, 0), fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: 'M4.7 14.2A1.9 1.9 0 0 1 6.5 12.3H11', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.8, class: 'wm-shine' }],
    ['path', { d: 'M4.7 15.2V16.4', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.8, class: 'wm-shine' }],
    ['path', { d: KEYHOLE, fill: C.ink, class: 'wm-k' }],
  ]
}
