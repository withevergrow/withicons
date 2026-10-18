// forge/hand/halloween/users-round.mjs - a team of two in the round-avatar form: a witch-purple person in front with a dome of shoulders,
// a smaller pumpkin-orange person behind and to the right, each a full round head over shoulders, separated by a clean gap.
// Roles: skin tint -> c1 -> c2, front cloth c3 -> edge, back cloth c1 -> c2, outline ink, halo accent, shine shine.
// Motion: front person wm-k, back person wm-a.
import { C } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const NAME = 'users-round'
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

const HEAD_F = 'M12.5 8A3.5 3.5 0 1 1 5.5 8A3.5 3.5 0 1 1 12.5 8Z'
const BODY_F = 'M2.5 21C2.5 17.1 5.3 14.5 9 14.5C12.7 14.5 15.5 17.1 15.5 21Z'
const HEAD_B = 'M20.4 7.4A3 3 0 1 1 14.4 7.4A3 3 0 1 1 20.4 7.4Z'
const BODY_B = 'M12.5 21C12.5 17 14.6 14 17.25 14C19.9 14 22 17 22 21Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 9, cy: 8.6, r: 4.6, fx: 7.6, fy: 6.6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.tint), st(0.35, C.c1), st(0.7, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 9, cy: 18, r: 8.5, fx: 6, fy: 14.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.5, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.16), st(1, C.accent, 0)]],
      ['radialGradient', { id: id(3), cx: 17.25, cy: 18, r: 6, fx: 15.5, fy: 14.8, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.5, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(4), cx: 17.4, cy: 7.9, r: 3.8, fx: 16.3, fy: 6.2, gradientUnits: 'userSpaceOnUse' }, [st(0, C.tint), st(0.35, C.c1), st(0.7, C.c1), st(1, C.c2)]],
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
    ['path', { d: 'M15.2 6.6A2 2 0 0 1 17 5', ...R, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.5, class: 'wm-shine' }],
    ['path', { d: 'M17.5 15.3A3 3 0 0 1 20 16.8', ...R, stroke: C.shine, 'stroke-opacity': 0.4, 'stroke-width': 0.5, class: 'wm-shine' }],
  ]
}
