// forge/hand/halloween/avatar-person-glasses.mjs — a person in a costume-coloured top wearing round glasses: two
// distinct, light-filled lenses with thin dark frames and a bridge, the eyes visible behind them, short swept hair and
// a small smile. Replaces the generated drawing, where the frames and eyes merged into one heavy dark band.
// Roles: skin tint -> c1 -> shadow, hair c2 -> c3, top c4, frames + outline ink, lenses shine, halo accent.
// Motion: face + glasses wm-k, hair + top wm-a (breathe / tilt about 12,21.5).
import { personTones } from '../../styles/_halloween-people.mjs'
import { BASE } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const NAME = 'avatar-person-glasses'
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
const FACE = 'M17.4 10.6A5.4 5.8 0 1 1 6.6 10.6A5.4 5.8 0 1 1 17.4 10.6Z'
const HAIR = 'M6.1 10.8C5.4 6.2 8.2 2.9 12 2.9C15.8 2.9 18.6 6.2 17.9 10.8C17.6 9.6 17 8.8 16.1 8.3C14 8.8 11.2 8.5 9.4 7.2C8.3 8 6.7 9.3 6.1 10.8Z'
const MOUTH = 'M10.7 14.75C11.45 15.65 12.55 15.65 13.3 14.75C12.55 15.05 11.45 15.05 10.7 14.75Z'
const LENS_L = 'M11.15 11.3A2.05 2.05 0 1 1 7.05 11.3A2.05 2.05 0 1 1 11.15 11.3Z'
const LENS_R = 'M16.95 11.3A2.05 2.05 0 1 1 12.85 11.3A2.05 2.05 0 1 1 16.95 11.3Z'

export default function render(icon) {
  const t = personTones(icon || { name: NAME }) || personTones({ name: NAME })
  const v = (r, hex) => `var(--with-halloween-${r}, ${hex})`
  const P = {
    ink: v('ink', BASE.ink), accent: v('accent', BASE.accent), shine: v('shine', BASE.shine),
    c1: v('c1', t.c1), tint: v('tint', t.tint), shadow: v('shadow', t.shadow), c2: v('c2', t.c2), c3: v('c3', t.c3), c4: v('c4', t.c4),
  }
  const INK = { stroke: P.ink, 'stroke-width': 1.1, 'stroke-linejoin': 'round' }
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.2, r: 8.4, fx: 10, fy: 8.8, gradientUnits: 'userSpaceOnUse' },
        [st(0, P.tint), st(0.3, P.c1), st(0.68, P.c1), st(1, P.shadow)]],
      ['linearGradient', { id: id(1), x1: 6, y1: 2, x2: 18, y2: 11, gradientUnits: 'userSpaceOnUse' },
        [st(0, P.c2), st(1, P.c3)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, P.accent, 0.36), st(0.55, P.accent, 0.162), st(1, P.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: shift(TOP + FACE + HAIR, 0.15, 0.85), fill: P.ink, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: TOP, fill: P.c4, ...INK, class: 'wm-a' }],
    ['path', { d: FACE, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: HAIR, fill: url(1), ...INK, class: 'wm-a' }],
    // glasses: light lenses, thin dark frames, bridge and short temples
    ['path', { d: LENS_L + LENS_R, fill: P.shine, 'fill-opacity': 0.7, stroke: P.ink, 'stroke-width': 0.95, class: 'wm-k' }],
    ['path', { d: 'M11.1 10.7Q12 10.1 12.9 10.7', ...ROUND, stroke: P.ink, 'stroke-width': 0.8, class: 'wm-k' }],
    ['path', { d: 'M7.1 10.8L6.5 10.5M16.9 10.8L17.5 10.5', ...ROUND, stroke: P.ink, 'stroke-width': 0.8, class: 'wm-k' }],
    // eyes and a small smile
    ['path', { d: 'M8.35 11.4A0.75 0.9 0 1 1 9.85 11.4A0.75 0.9 0 1 1 8.35 11.4ZM14.15 11.4A0.75 0.9 0 1 1 15.65 11.4A0.75 0.9 0 1 1 14.15 11.4Z', fill: P.ink, class: 'wm-k' }],
    ['path', { d: MOUTH, fill: P.tint, stroke: P.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // shine: hair sheen, lens glints, shoulder
    ['path', { d: 'M7.05 8.7C7.6 6.3 9.3 4.4 11.6 3.95', ...ROUND, stroke: P.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: 'M8.2 9.9L9 9.5M14 9.9L14.8 9.5', ...ROUND, stroke: P.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.4, class: 'wm-shine' }],
    ['path', { d: 'M5.9 20.6C6.1 19.7 6.9 19 8.1 18.75', ...ROUND, stroke: P.shine, 'stroke-opacity': 0.4, 'stroke-width': 0.55, class: 'wm-shine' }],
  ]
}
