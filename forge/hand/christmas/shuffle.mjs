// forge/hand/christmas/shuffle.mjs — two chunky crossing arrows, a cranberry track laid over a pine one with
// solid arrowheads, replacing the generated pale cream tubes that washed out to grey on white backgrounds.
import { C } from '../../styles/_christmas-core.mjs'

const N = 'shuffle'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const sh = (d, dy) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, x, y) => `${x} ${Math.round((+y + dy) * 100) / 100}`)

// tube: mass half-width 1.25, a 0.6 ink outline centred on the edge
const INK_W = 3.1, COL_W = 1.9
const RED = 'M3 17.5H5C10.5 17.5 12 6.5 17.5 6.5H18.2'
const RED_SHINE = 'M3 17.5H5C10.5 17.5 12 6.5 17.5 6.5'
const RED_HEAD = 'M17.1 2.7L22.1 6.5L17.1 10.3Z'
const GRN = 'M3 6.5H5C10.5 6.5 12 17.5 17.5 17.5H18.2'
const GRN_SHINE = 'M3 6.5H5C10.5 6.5 12 17.5 17.5 17.5'
const GRN_HEAD = 'M17.1 13.7L22.1 17.5L17.1 21.3Z'
// a snow cap on the pine track's start; a small gold sparkle in the free space above the crossing
const SPARK = 'M11.5 1.95Q11.82 3.08 12.95 3.4Q11.82 3.72 11.5 4.85Q11.18 3.72 10.05 3.4Q11.18 3.08 11.5 1.95Z'
const SNOW = 'M1.45 6.6C1.2 4.95 2.25 3.9 3.55 3.9C5 3.9 6.55 3.95 7.35 4.6C7.85 5.05 7.6 5.85 7 5.8C6.5 5.75 6.2 5.8 5.95 6.2C5.55 6.75 4.85 6.75 4.55 6.15C4.25 5.65 3.65 5.65 3.25 6.15C2.75 6.8 1.6 7.15 1.45 6.6Z'

export default function render() {
  const ink = C.ink
  const track = (d, dShine, head, role, cls) => [
    ['path', { d, stroke: ink, 'stroke-width': INK_W, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: head, fill: C[role], stroke: ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: cls }],
    ['path', { d, stroke: C[role], 'stroke-width': COL_W, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: dShine, stroke: url(0), 'stroke-width': COL_W, 'stroke-linecap': 'butt', class: 'wm-shine' }],
    ['path', { d: head, fill: url(0), class: cls === 'wm-a' ? 'wm-a wm-shine' : 'wm-shine' }],
  ]
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 1.8, y1: 2.4, x2: 13, y2: 21.6, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.3)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2, x2: 0, y2: 6.8, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ...track(GRN, GRN_SHINE, GRN_HEAD, 'c2', 'wm-a'),
    ...track(RED, RED_SHINE, RED_HEAD, 'c1', 'wm-a'),
    ['path', { d: sh(SNOW, 0.45), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: SNOW, fill: url(1), stroke: ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: SPARK, fill: C.accent, stroke: ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
