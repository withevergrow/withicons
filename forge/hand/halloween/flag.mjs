// forge/hand/halloween/flag.mjs — a waving pumpkin-orange flag on a witch-purple pole with a round finial, in the midnight
// outline, with a deeper fold where the cloth dips. Replaces the generated drawing, a bone-white flag that all but vanished
// on light backgrounds (cream on cream, held up only by its outline).
// Roles: cloth c1 -> c2, pole c3 -> edge, fold c2, outline ink, halo accent, shine shine, drop shadow shadow.
// Motion: cloth wm-k (sways about 5,8.5), pole wm-a (sways about 5,21.5).
import { C } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const NAME = 'flag'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

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

// the cloth: two gentle waves, top and bottom, rounded at the fly end
const CLOTH = 'M5 2.75C7.6 1.4 10.3 1.4 12.9 2.7C15.3 3.9 17.6 3.9 19.6 2.85C20.35 2.45 21.1 2.9 21.1 3.75V13.2C21.1 13.75 20.85 14.1 20.4 14.35C17.7 15.75 15 15.75 12.3 14.45C9.9 13.3 7.6 13.25 5 14.5Z'
const POLE = 'M3.9 3.6H6.1V21.25A1.1 1.1 0 0 1 3.9 21.25Z'
const KNOB = 'M3.6 2.75A1.4 1.4 0 1 1 6.4 2.75A1.4 1.4 0 1 1 3.6 2.75Z'

export default function render() {
  const sh = { fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 13, cy: 9.2, r: 11.5, fx: 9.6, fy: 5.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 3.9, y1: 0, x2: 6.4, y2: 0, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c3), st(0.45, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.4, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
      // the dip of the wave in soft shade, the far crest catching light again
      ['linearGradient', { id: id(3), x1: 5, y1: 0, x2: 21.1, y2: 0, gradientUnits: 'userSpaceOnUse' },
        [st(0.42, C.c2, 0), st(0.62, C.c2, 0.5), st(0.8, C.c2, 0), st(1, C.c2, 0.25)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: shift(CLOTH + POLE + KNOB, 0.15, 0.85), ...sh }],
    // cloth
    ['path', { d: CLOTH, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: CLOTH, fill: url(3), class: 'wm-k' }],
    ['path', { d: 'M7.2 3.55C8.9 2.9 10.6 2.9 12.2 3.55', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.8, class: 'wm-shine' }],
    ['path', { d: 'M17.5 4.75C18.4 4.65 19.2 4.4 19.95 4.05', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.7, class: 'wm-shine' }],
    // pole and finial in front of the cloth's hoist
    ['path', { d: POLE, fill: url(1), ...INK, class: 'wm-a' }],
    ['path', { d: KNOB, fill: C.c3, ...INK, class: 'wm-a' }],
    ['path', { d: 'M4.65 6V19.8', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.45, 'stroke-width': 0.55, class: 'wm-shine' }],
  ]
}
