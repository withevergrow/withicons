// forge/hand/halloween/user-pen.mjs - a person (orange head over witch-purple shoulders) with a slime-green pencil
// lying diagonally at the bottom right, clear of the torso: pale wood cone with a dark lead tip, green body with a lit
// stripe, a metal ferrule and a pumpkin eraser.
// Replaces the generated drawing, where the pen merged with the shoulder into one green blob.
// Roles: skin tint -> c1 -> c2, cloth c3 -> edge, pencil c4 (body), tint (wood), shine (ferrule), c1 (eraser), outline ink, halo accent.
// Motion: person wm-k, pencil wm-s.
import { C } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const NAME = 'user-pen'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const R = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const INK = { stroke: C.ink, 'stroke-width': 1, 'stroke-linejoin': 'round' }
const THIN = { stroke: C.ink, 'stroke-width': 0.7, 'stroke-linejoin': 'round' }

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

const HEAD = 'M11.25 8A3.5 3.5 0 1 1 4.25 8A3.5 3.5 0 1 1 11.25 8Z'
const BODY = 'M2.5 21V19A4.5 4.5 0 0 1 7 14.5H8.5A4.5 4.5 0 0 1 13 19V21Z'

// pencil in its own frame: u along the axis from the tip, v across it; tip at (14.4,20.1), rising to the upper right
const P0 = [14.1, 20.7], S = Math.SQRT1_2
const pt = (u, v) => [P0[0] + (u + v) * S, P0[1] + (v - u) * S]
const poly = pts => 'M' + pts.map(([u, v]) => pt(u, v).map(num).join(' ')).join('L') + 'Z'
const W = 2.05
const WOOD = poly([[0, 0], [2.9, -W], [2.9, W]])
const LEAD = poly([[0, 0], [1.1, -0.75], [1.1, 0.75]])
const BODYP = poly([[2.9, -W], [7.2, -W], [7.2, W], [2.9, W]])
const FERR = poly([[7.2, -W], [8.3, -W], [8.3, W], [7.2, W]])
const ERAS = poly([[8.3, -W], [9.7, -W + 0.35], [9.7, W - 0.35], [8.3, W]])
const STRIPE = 'M' + pt(3.4, -1.05).map(num).join(' ') + 'L' + pt(6.8, -1.05).map(num).join(' ')

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 7.75, cy: 8.6, r: 4.6, fx: 6.4, fy: 6.6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.tint), st(0.35, C.c1), st(0.7, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 7.75, cy: 18, r: 7.5, fx: 4.8, fy: 14.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.5, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.16), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: shift(BODY, 0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: shift(BODYP, 0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: BODY, fill: url(1), ...INK, class: 'wm-k' }],
    ['path', { d: HEAD, fill: url(0), ...INK, class: 'wm-k' }],
    // pencil
    ['path', { d: WOOD, fill: C.tint, ...THIN, class: 'wm-s' }],
    ['path', { d: LEAD, fill: C.ink, ...THIN, class: 'wm-s' }],
    ['path', { d: BODYP, fill: C.c4, ...THIN, class: 'wm-s' }],
    ['path', { d: FERR, fill: C.shine, ...THIN, class: 'wm-s' }],
    ['path', { d: ERAS, fill: C.c1, ...THIN, class: 'wm-s' }],
    ['path', { d: STRIPE, ...R, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.5, class: 'wm-shine' }],
    // shine on the person
    ['path', { d: 'M5.2 7.6A2.8 2.8 0 0 1 7.6 5.3', ...R, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: 'M3.7 19.2A3.3 3.3 0 0 1 6.5 15.7', ...R, stroke: C.shine, 'stroke-opacity': 0.45, 'stroke-width': 0.6, class: 'wm-shine' }],
  ]
}
