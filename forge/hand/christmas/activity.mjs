// forge/hand/christmas/activity.mjs — a bold cranberry heartbeat line (flat run, small bump, one tall spike up and down,
// flat run) inked like the style's bodies, with a drift of snow on the tall peak and a holly sprig; the generated
// zigzag was a thin gold wire that wobbled and read as a squiggle.
import { C } from '../../styles/_christmas-core.mjs'

const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const n = v => Math.round(v * 100) / 100
const disc = (cx, cy, r) => `M${n(cx - r)} ${cy}a${r} ${r} 0 1 0 ${n(2 * r)} 0a${r} ${r} 0 1 0 ${n(-2 * r)} 0z`
const LINE = 'M2.5 13H5.5L7.3 10L9.1 13H10.6L13 4.5L16 19.5L17.8 13H21.5'

export default function render(icon) {
  const name = icon.name || 'activity'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const base = { fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 4, x2: 17, y2: 20, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.4), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2, x2: 0, y2: 6.4, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    // ink outline, then the cranberry core
    ['path', { d: LINE, ...base, stroke: C.ink, 'stroke-width': 3.2, class: 'wm-k' }],
    ['path', { d: LINE, ...base, stroke: C.c1, 'stroke-width': 2, class: 'wm-k' }],
    ['path', { d: LINE, ...base, stroke: url(0), 'stroke-width': 2, class: 'wm-shine' }],
    // a thin highlight riding the tall spike's lit side
    ['path', { d: 'M12.2 6.2L14.4 15.2', ...base, stroke: C.shine, 'stroke-width': 0.5, 'stroke-opacity': 0.55, class: 'wm-shine' }],
    // snow on the peak
    ['path', { d: 'M11.2 5.4C11.1 3.3 12.2 1.9 13.6 1.9C14.9 1.9 15.6 3 15.4 4.3C15.3 5.3 14.6 5.6 14.1 5.2C13.6 6 12.9 5.6 12.6 5.4Q11.8 5.9 11.2 5.4Z', fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    // holly sprig resting on the flat run
    ['path', { d: 'M19.8 10.9q-1.2-1-2.4-.1q1.1 1 2.4 .1zM19.8 10.9q1.2-1 2.4-.1q-1.1 1-2.4 .1z', fill: C.c2, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: disc(19.3, 10.7, 0.5) + disc(20.3, 10.7, 0.5) + disc(19.8, 10.05, 0.5), fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: 'wm-deco' }],
  ]
}
