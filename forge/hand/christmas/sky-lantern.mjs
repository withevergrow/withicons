// forge/hand/christmas/sky-lantern.mjs — a hanging akash kandil in one clear silhouette: a gold top cap with a tiny snow
// mound and a hanging ring, a plump cranberry paper body with two ink ribs and a glowing gold window with a cream
// flame core, a gold base and three gold tassels ending in cranberry beads, over a soft warm halo. The generated drawing
// was a muddy cluster of crossing lines. Tassels carry wm-a so they sway; sparkle in the free corner.
import { C } from '../../styles/_christmas-core.mjs'

const n = v => Math.round(v * 100) / 100
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const disc = (x, y, r) => `M${n(x - r)} ${n(y)}a${r} ${r} 0 1 0 ${n(2 * r)} 0a${r} ${r} 0 1 0 ${n(-2 * r)} 0Z`
function sparkleD(x, y, r) {
  const q = r * 0.22
  return `M${n(x)} ${n(y - r)}Q${n(x + q)} ${n(y - q)} ${n(x + r)} ${n(y)}Q${n(x + q)} ${n(y + q)} ${n(x)} ${n(y + r)}` +
    `Q${n(x - q)} ${n(y + q)} ${n(x - r)} ${n(y)}Q${n(x - q)} ${n(y - q)} ${n(x)} ${n(y - r)}Z`
}
const R = { 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }

const BODY = 'M8 6.2H16C19.5 8.2 20 12.8 16 15.4H8C4 12.8 4.5 8.2 8 6.2Z'
const TOPCAP = 'M8.6 4.8Q8.6 4 9.4 4H14.6Q15.4 4 15.4 4.8L16 6.4H8Z'
const BASE = 'M8.6 15.4H15.4L14.6 17Q14.5 17.4 14.1 17.4H9.9Q9.5 17.4 9.4 17Z'
const WIN = 'M12 6.9C14.5 8.4 15 12.2 12 14.8C9 12.2 9.5 8.4 12 6.9Z'
const CORE = 'M12 9.1C13.1 10.2 13.1 11.7 12 12.9C10.9 11.7 10.9 10.2 12 9.1Z'
const RIBS = 'M9.4 6.2C6.7 8.6 6.9 12.8 9.4 15.4M14.6 6.2C17.3 8.6 17.1 12.8 14.6 15.4'
const STRANDS = 'M10.2 17.6L9.4 20.4M12 17.6V21.2M13.8 17.6L14.6 20.4'
// a small mound of snow on the top cap
const SNOW = 'M8.9 4.4C9 2.8 10.2 2.5 12 2.5C13.8 2.5 15 2.8 15.1 4.4Q14.4 4.8 13.8 4.6C13.7 5.4 12.9 5.4 12.8 4.6Q12 4.9 11.2 4.6C11.1 5.3 10.3 5.3 10.2 4.6Q9.5 4.8 8.9 4.4Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'sky-lantern'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 3, x2: 13, y2: 21.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2.4, x2: 0, y2: 5.6, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 10.8, r: 9.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.5), st(1, C.accent, 0)]],
    ]],
    ['path', { d: disc(12, 10.8, 9.5), fill: url(2), class: 'wm-deco' }],
    ['path', { d: 'M12 3V1.6', stroke: C.ink, 'stroke-width': 1, ...R, class: 'wm-k' }],
    ['path', { d: STRANDS, stroke: C.ink, 'stroke-width': 2.1, ...R, class: 'wm-a' }],
    ['path', { d: STRANDS, stroke: C.c3, 'stroke-width': 0.95, ...R, class: 'wm-a' }],
    ['path', { d: disc(9.4, 20.7, 1) + disc(12, 21.5, 1.05) + disc(14.6, 20.7, 1), fill: C.c1, ...INK, 'stroke-width': 0.5, class: 'wm-a' }],
    ['path', { d: BODY, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: WIN, fill: C.c3, stroke: C.ink, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: CORE, fill: C.c4, class: 'wm-k' }],
    ['path', { d: RIBS, stroke: C.ink, 'stroke-width': 0.55, ...R, 'stroke-opacity': 0.75, class: 'wm-k' }],
    ['path', { d: TOPCAP, fill: C.c3, ...INK, class: 'wm-k' }],
    ['path', { d: BASE, fill: C.c3, ...INK, class: 'wm-k' }],
    ['path', { d: BODY + TOPCAP + BASE, fill: url(0), class: 'wm-shine' }],
    ['path', { d: SNOW, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: sparkleD(19.9, 3.6, 1.35), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
