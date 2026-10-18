// forge/hand/halloween/folder-search.mjs — a witch-purple folder (same body as folder-open and folder-minus) with a big
// pumpkin magnifier on it: a thick orange ring round a candle-lit glass and a stout handle, so the search is the first thing
// read. Replaces the pale cream folder, whose small lens had no contrast on it.
// Roles: folder c3 -> edge, magnifier c1 -> c2, glass tint, outline ink, halo accent, shine shine, shadow shadow.
// Motion: magnifier wm-a, folder wm-k.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'folder-search'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const f = v => Math.round(v * 100) / 100
const disc = (x, y, r) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`

const FOLDER = (dx = 0, dy = 0) => {
  const p = (x, y) => `${f(x + dx)} ${f(y + dy)}`
  return `M${p(5, 20.85)}A2.85 2.85 0 0 1 ${p(2.15, 18)}V${f(7 + dy)}A2.85 2.85 0 0 1 ${p(5, 4.15)}H${f(8.75 + dx)}` +
    `A1 1 0 0 1 ${p(9.46, 4.44)}L${p(11.17, 6.15)}H${f(19 + dx)}A2.85 2.85 0 0 1 ${p(21.85, 9)}V${f(18 + dy)}` +
    `A2.85 2.85 0 0 1 ${p(19, 20.85)}Z`
}
// magnifier: lens centre and radius, handle runs down to the lower right
const LX = 11, LY = 12.6, LR = 3.9
const HANDLE = 'M13.9 15.5L18.1 19.4'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.84, r: 12.5, fx: 8.2, fy: 8.6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.45, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(1), cx: 12.5, cy: 14, r: 7, fx: 9.5, fy: 10.4, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 13, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
      ['radialGradient', { id: id(3), cx: LX, cy: LY + 0.6, r: 3, fx: LX - 0.8, fy: LY - 0.8, gradientUnits: 'userSpaceOnUse' }, [st(0, C.tint), st(0.55, C.tint), st(1, C.accent)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: FOLDER(0.15, 0.85) + disc(LX + 0.15, LY + 0.85, LR + 0.4), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: FOLDER(), fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: 'M3.05 15.5V7A1.95 1.95 0 0 1 5 5.05H8.4', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.45, 'stroke-width': 0.8, class: 'wm-shine' }],
    // the magnifier: handle, ring, glass
    ['path', { d: HANDLE, ...ROUND, stroke: C.ink, 'stroke-width': 3.5, class: 'wm-a' }],
    ['path', { d: HANDLE, ...ROUND, stroke: url(1), 'stroke-width': 2.1, class: 'wm-a' }],
    ['path', { d: disc(LX, LY, LR + 0.36), fill: C.ink, class: 'wm-a' }],
    ['path', { d: disc(LX, LY, LR - 0.36), fill: url(1), class: 'wm-a' }],
    ['path', { d: disc(LX, LY, 2.2), fill: url(3), stroke: C.ink, 'stroke-width': 0.6, class: 'wm-a' }],
    ['path', { d: 'M9.6 12A1.9 1.9 0 0 1 11 10.7', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.6, class: 'wm-shine' }],
  ]
}
