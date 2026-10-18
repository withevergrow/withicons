// forge/hand/halloween/avatar-woman-bun.mjs — a woman with a top bun: a round bun sitting clear above the head on an
// orange hair tie, a swept fringe, a lit face with the same dot eyes and small smile as the other avatars, and a
// costume-coloured top. Replaces the generated drawing, where the face was a blank oval (no eyes, no smile) so the
// icon read as an egg under a bun; now the bun is its own outlined shape and the face is readable at 16px.
// Roles: skin tint -> c1 -> shadow, hair c2 -> c3, top c4, outline ink, hair tie accent, halo accent, shine shine.
// Motion: face wm-k, bun + hair + top wm-a (breathe about 12,21.5).
import { personTones } from '../../styles/_halloween-people.mjs'
import { BASE } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const NAME = 'avatar-woman-bun'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
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

const TOP = 'M5.4 21.5C4.9 21.5 4.5 21.1 4.5 20.6C4.65 19 6.4 18 8.5 18C9.75 18 10.75 18.75 12 18.75C13.25 18.75 14.25 18 15.5 18C17.6 18 19.35 19 19.5 20.6C19.5 21.1 19.1 21.5 18.6 21.5Z'
const FACE = 'M17.3 11.6A5.3 5.6 0 1 1 6.7 11.6A5.3 5.6 0 1 1 17.3 11.6Z'
const BUN = 'M14.6 4.35A2.6 2.6 0 1 1 9.4 4.35A2.6 2.6 0 1 1 14.6 4.35Z'
// hair cap hugging the head, a fringe swept across the brow to the right
const HAIR = 'M6.7 11.6C6.05 8 8.5 5.7 12 5.7C15.5 5.7 17.95 8 17.3 11.6C16.85 10.3 16 9.35 14.75 8.85C13 9.95 10 10.5 8.25 10C7.55 10.4 7 10.9 6.7 11.6Z'
const TIE = 'M10.1 6.55C11.3 7.25 12.7 7.25 13.9 6.55'

export default function render(icon) {
  const t = personTones(icon || { name: NAME }) || personTones({ name: NAME })
  const v = (r, hex) => `var(--with-halloween-${r}, ${hex})`
  const P = {
    ink: v('ink', BASE.ink), accent: v('accent', BASE.accent), shine: v('shine', BASE.shine),
    c1: v('c1', t.c1), tint: v('tint', t.tint), shadow: v('shadow', t.shadow), c2: v('c2', t.c2), c3: v('c3', t.c3), c4: v('c4', t.c4),
  }
  const INK = { stroke: P.ink, 'stroke-width': 1.2, 'stroke-linejoin': 'round' }
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.4, r: 8, fx: 10.2, fy: 9.4, gradientUnits: 'userSpaceOnUse' },
        [st(0, P.tint), st(0.3, P.c1), st(0.68, P.c1), st(1, P.shadow)]],
      ['linearGradient', { id: id(1), x1: 7, y1: 1.5, x2: 17.5, y2: 11, gradientUnits: 'userSpaceOnUse' },
        [st(0, P.c2), st(1, P.c3)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, P.accent, 0.36), st(0.55, P.accent, 0.162), st(1, P.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: shift(TOP + FACE + BUN + HAIR, 0.15, 0.85), fill: P.ink, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // top, bun, face, hair over the forehead
    ['path', { d: TOP, fill: P.c4, ...INK, class: 'wm-a' }],
    ['path', { d: BUN, fill: url(1), ...INK, class: 'wm-a' }],
    ['path', { d: FACE, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: HAIR, fill: url(1), ...INK, class: 'wm-a' }],
    // hair tie where the bun meets the head
    ['path', { d: TIE, ...ROUND, stroke: P.ink, 'stroke-width': 2.6, class: 'wm-a' }],
    ['path', { d: TIE, ...ROUND, stroke: P.accent, 'stroke-width': 1.2, class: 'wm-a' }],
    // eyes and a small smile
    ['path', { d: 'M8.6 12.1A0.75 0.95 0 1 1 10.1 12.1A0.75 0.95 0 1 1 8.6 12.1ZM13.9 12.1A0.75 0.95 0 1 1 15.4 12.1A0.75 0.95 0 1 1 13.9 12.1Z', fill: P.ink, class: 'wm-k' }],
    ['path', { d: 'M10.45 14.6C11.3 15.55 12.7 15.55 13.55 14.6', ...ROUND, stroke: P.ink, 'stroke-width': 1.05, class: 'wm-k' }],
    // shine: hair sheen, bun sheen, eye catch-lights, shoulder
    ['path', { d: 'M7.9 9.1C8.4 7.5 9.7 6.45 11.3 6.2', ...ROUND, stroke: P.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.55, class: 'wm-shine' }],
    ['path', { d: 'M10.6 3.5C10.85 2.85 11.4 2.45 12.05 2.4', ...ROUND, stroke: P.shine, 'stroke-opacity': 0.65, 'stroke-width': 0.5, class: 'wm-shine' }],
    ['path', { d: 'M9.38 11.75A0.24 0.24 0 1 1 9.86 11.75A0.24 0.24 0 1 1 9.38 11.75ZM14.68 11.75A0.24 0.24 0 1 1 15.16 11.75A0.24 0.24 0 1 1 14.68 11.75Z', fill: P.tint, class: 'wm-shine' }],
    ['path', { d: 'M5.9 20.6C6.1 19.7 6.9 19 8.1 18.75', ...ROUND, stroke: P.shine, 'stroke-opacity': 0.4, 'stroke-width': 0.55, class: 'wm-shine' }],
  ]
}
