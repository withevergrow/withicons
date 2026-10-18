// forge/hand/halloween/avatar-older-woman.mjs — a grandmother bust: a big round grey bun crowning swept-back grey hair,
// round glasses, a kind smile and a costume-blue top, in the style's night-lit avatar look. Replaces the generated
// drawing, where the glasses, nose and parting merged into one outlined mask across the face (it read as a skull mask
// or horns) and the bun was a small knob, so at 16px the grandma was lost.
// Roles: skin tint -> c1 -> shadow, hair c2 -> c3, top c4, outline ink, lenses shine, halo accent, drop shadow ink.
// Motion: face wm-k, hair + bun + top wm-a (breathe about 12,21.5).
import { personTones } from '../../styles/_halloween-people.mjs'
import { BASE } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const NAME = 'avatar-older-woman'
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
const FACE = 'M17.4 11.1A5.4 5.7 0 1 1 6.6 11.1A5.4 5.7 0 1 1 17.4 11.1Z'
const BUN = 'M9.35 4A2.65 2.65 0 1 1 14.65 4A2.65 2.65 0 1 1 9.35 4Z'
// grey hair swept back from a centre parting, full at the temples
const HAIR = 'M6 12.2C5.3 7.6 8.1 4.6 12 4.6C15.9 4.6 18.7 7.6 18 12.2C17.5 9.8 15.8 8.3 13.6 8.3C12.85 8.3 12.3 8 12 7.6C11.7 8 11.15 8.3 10.4 8.3C8.2 8.3 6.5 9.8 6 12.2Z'
const LENS_L = 'M7.6 11.6A1.8 1.8 0 1 1 11.2 11.6A1.8 1.8 0 1 1 7.6 11.6Z'
const LENS_R = 'M12.8 11.6A1.8 1.8 0 1 1 16.4 11.6A1.8 1.8 0 1 1 12.8 11.6Z'

export default function render(icon) {
  const t = personTones(icon || { name: NAME }) || personTones({ name: NAME })
  const v = (r, hex) => `var(--with-halloween-${r}, ${hex})`
  const P = {
    ink: v('ink', BASE.ink), accent: v('accent', BASE.accent), shine: v('shine', BASE.shine),
    c1: v('c1', t.c1), tint: v('tint', t.tint), shadow: v('shadow', t.shadow), c2: v('c2', t.c2), c3: v('c3', t.c3), c4: v('c4', t.c4),
  }
  const INK = { stroke: P.ink, 'stroke-width': 1.3, 'stroke-linejoin': 'round' }
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.6, r: 8.4, fx: 10, fy: 9.2, gradientUnits: 'userSpaceOnUse' },
        [st(0, P.tint), st(0.3, P.c1), st(0.68, P.c1), st(1, P.shadow)]],
      ['linearGradient', { id: id(1), x1: 7, y1: 1.5, x2: 17.5, y2: 11, gradientUnits: 'userSpaceOnUse' },
        [st(0, P.c2), st(1, P.c3)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, P.accent, 0.36), st(0.55, P.accent, 0.162), st(1, P.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: shift(TOP + FACE + BUN + HAIR, 0.15, 0.85), fill: P.ink, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // top, bun behind the head, face, hair over the forehead
    ['path', { d: TOP, fill: P.c4, ...INK, class: 'wm-a' }],
    ['path', { d: BUN, fill: url(1), ...INK, class: 'wm-a' }],
    ['path', { d: FACE, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: HAIR, fill: url(1), ...INK, class: 'wm-a' }],
    // round glasses: tinted lenses, rims, bridge
    ['path', { d: LENS_L + LENS_R, fill: P.shine, 'fill-opacity': 0.4, stroke: P.ink, 'stroke-width': 0.95, class: 'wm-k' }],
    ['path', { d: 'M11.2 11.3C11.7 10.85 12.3 10.85 12.8 11.3', ...ROUND, stroke: P.ink, 'stroke-width': 0.9, class: 'wm-k' }],
    // eyes, smile
    ['path', { d: 'M8.7 11.7A0.7 0.75 0 1 1 10.1 11.7A0.7 0.75 0 1 1 8.7 11.7ZM13.9 11.7A0.7 0.75 0 1 1 15.3 11.7A0.7 0.75 0 1 1 13.9 11.7Z', fill: P.ink, class: 'wm-k' }],
    ['path', { d: 'M10.3 14.55C11.25 15.6 12.75 15.6 13.7 14.55', ...ROUND, stroke: P.ink, 'stroke-width': 1.05, class: 'wm-k' }],
    // shine: hair sheen, bun sheen, lens glints, eye catch-lights
    ['path', { d: 'M7.1 9.3C7.6 7.3 9.2 5.85 11.2 5.55', ...ROUND, stroke: P.shine, 'stroke-opacity': 0.65, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: 'M10.45 3.6C10.7 2.8 11.3 2.3 12 2.2', ...ROUND, stroke: P.shine, 'stroke-opacity': 0.65, 'stroke-width': 0.5, class: 'wm-shine' }],
    ['path', { d: 'M8.35 11.05C8.5 10.65 8.8 10.4 9.2 10.3M13.55 11.05C13.7 10.65 14 10.4 14.4 10.3', ...ROUND, stroke: P.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.4, class: 'wm-shine' }],
    ['path', { d: 'M9.5 11.35A0.22 0.22 0 1 1 9.94 11.35A0.22 0.22 0 1 1 9.5 11.35ZM14.7 11.35A0.22 0.22 0 1 1 15.14 11.35A0.22 0.22 0 1 1 14.7 11.35Z', fill: P.tint, class: 'wm-shine' }],
    ['path', { d: 'M5.9 20.6C6.1 19.7 6.9 19 8.1 18.75', ...ROUND, stroke: P.shine, 'stroke-opacity': 0.4, 'stroke-width': 0.55, class: 'wm-shine' }],
  ]
}
