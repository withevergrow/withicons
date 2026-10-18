// forge/hand/halloween/users.mjs - a team of two: a witch-purple person in front, a smaller pumpkin-orange person behind
// and to the right, each a full round head over shoulders. The back figure is cut along a clean gap round the front
// shoulders, so both read as people instead of a head and a cropped crescent.
// Roles: skin tint -> c1 -> c2, front cloth c3 -> edge, back cloth c1 -> c2, outline ink, halo accent, shine shine.
// Motion: front person wm-k, back person wm-a.
import { C } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const NAME = 'users'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const R = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const INK = { stroke: C.ink, 'stroke-width': 1, 'stroke-linejoin': 'round' }

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

const HEAD_F = 'M12.6 8A3.6 3.6 0 1 1 5.4 8A3.6 3.6 0 1 1 12.6 8Z'
const BODY_F = 'M2.5 21V19A4.5 4.5 0 0 1 7 14.5H11A4.5 4.5 0 0 1 15.5 19V21Z'
const HEAD_B = 'M19.6 7A3 3 0 1 1 13.6 7A3 3 0 1 1 19.6 7Z'
const BODY_B = 'M21.5 21V17.7A4.5 4.5 0 0 0 17 13.2H14.4Q12.9 13.1 12 13.39A5.7 5.7 0 0 1 16.7 19V21Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 9, cy: 8.6, r: 4.6, fx: 7.6, fy: 6.6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.tint), st(0.35, C.c1), st(0.7, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 9, cy: 18, r: 8.5, fx: 6, fy: 14.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.5, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.16), st(1, C.accent, 0)]],
      ['radialGradient', { id: id(3), cx: 17.5, cy: 18, r: 7, fx: 15.5, fy: 14.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.5, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(4), cx: 16.6, cy: 7.5, r: 3.8, fx: 15.5, fy: 5.8, gradientUnits: 'userSpaceOnUse' }, [st(0, C.tint), st(0.35, C.c1), st(0.7, C.c1), st(1, C.c2)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: shift(BODY_B, 0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: shift(BODY_F, 0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // back person
    ['path', { d: BODY_B, fill: url(3), ...INK, class: 'wm-a' }],
    ['path', { d: HEAD_B, fill: url(4), ...INK, class: 'wm-a' }],
    // front person
    ['path', { d: BODY_F, fill: url(1), ...INK, class: 'wm-k' }],
    ['path', { d: HEAD_F, fill: url(0), ...INK, class: 'wm-k' }],
    // shine
    ['path', { d: 'M6.3 7.6A2.8 2.8 0 0 1 8.7 5.3', ...R, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: 'M3.7 19.2A3.3 3.3 0 0 1 7 15.7', ...R, stroke: C.shine, 'stroke-opacity': 0.45, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: 'M14.4 6.2A2 2 0 0 1 16.2 4.6', ...R, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.5, class: 'wm-shine' }],
    ['path', { d: 'M18.6 14.5A3.2 3.2 0 0 1 20.7 17', ...R, stroke: C.shine, 'stroke-opacity': 0.4, 'stroke-width': 0.5, class: 'wm-shine' }],
  ]
}
