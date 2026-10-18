// forge/hand/halloween/avatar-teen.mjs — a teenager in a costume-coloured hoodie: the hood frames a clear face (dark
// lining ring, then a lit face with a swept fringe), two drawstrings hang at the chest, in the style's avatar look.
// Replaces the generated drawing, where the hood, its lining, the hair and the face all came out in the same browns and
// merged into one hollow brown hood with no readable face; now the hood, lining and face are three distinct values.
// Roles: skin tint -> c1 -> shadow, hair c2 -> c3, hoodie c4 (shaded by ink at its rim), lining ink over c4, outline ink, halo accent, shine shine.
// Motion: face wm-k, hood + hair + strings wm-a (breathe / tilt about 12,21.5).
import { personTones } from '../../styles/_halloween-people.mjs'
import { BASE } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const NAME = 'avatar-teen'
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

// the hoodie: a pointed-crown hood flaring onto the shoulders, flat at the bottom edge
const HOOD = 'M4.5 21.5C4 21.5 3.75 21.1 3.8 20.6C3.95 19.4 4.55 18.5 5.6 17.85C4.2 16.1 3.5 14 3.5 11.75' +
  'C3.5 7 6.9 3.25 12 2.25C17.1 3.25 20.5 7 20.5 11.75C20.5 14 19.8 16.1 18.4 17.85C19.45 18.5 20.05 19.4 20.2 20.6' +
  'C20.25 21.1 20 21.5 19.5 21.5Z'
// the hood opening (dark lining) round the face
const OPEN = 'M18.5 11.75A6.5 6.85 0 1 1 5.5 11.75A6.5 6.85 0 1 1 18.5 11.75Z'
const FACE = 'M17 12A5 5.2 0 1 1 7 12A5 5.2 0 1 1 17 12Z'
// a swept fringe from the hood edge, dipping over the right brow
const HAIR = 'M6.95 11.3C6.75 8.3 9 6.05 12 6.05C15 6.05 17.25 8.3 17.05 11.3C16.6 10.15 15.85 9.35 14.9 8.9' +
  'C13.35 9.75 10.85 10.2 8.4 9.65C7.8 10.05 7.25 10.6 6.95 11.3Z'
const MOUTH = 'M10.55 14.55C11.3 15.45 12.7 15.45 13.45 14.55C12.7 14.85 11.3 14.85 10.55 14.55Z'

export default function render(icon) {
  const t = personTones(icon || { name: NAME }) || personTones({ name: NAME })
  const v = (r, hex) => `var(--with-halloween-${r}, ${hex})`
  const P = {
    ink: v('ink', BASE.ink), accent: v('accent', BASE.accent), shine: v('shine', BASE.shine),
    c1: v('c1', t.c1), tint: v('tint', t.tint), shadow: v('shadow', t.shadow), c2: v('c2', t.c2), c3: v('c3', t.c3), c4: v('c4', t.c4),
  }
  const INK = { stroke: P.ink, 'stroke-width': 1.2, 'stroke-linejoin': 'round' }
  const THIN = { stroke: P.ink, 'stroke-width': 0.9, 'stroke-linejoin': 'round' }
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.4, r: 7.4, fx: 10.2, fy: 9.8, gradientUnits: 'userSpaceOnUse' },
        [st(0, P.tint), st(0.32, P.c1), st(0.7, P.c1), st(1, P.shadow)]],
      ['linearGradient', { id: id(1), x1: 7, y1: 6, x2: 17, y2: 11, gradientUnits: 'userSpaceOnUse' },
        [st(0, P.c2), st(1, P.c3)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, P.accent, 0.36), st(0.55, P.accent, 0.162), st(1, P.accent, 0)]],
      ['radialGradient', { id: id(3), cx: 12, cy: 12, r: 11, fx: 8.5, fy: 6.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, P.ink, 0), st(0.55, P.ink, 0), st(1, P.ink, 0.38)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: shift(HOOD, 0.15, 0.85), fill: P.ink, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // hoodie, its dark lining, the face, the fringe
    ['path', { d: HOOD, fill: P.c4, ...INK, class: 'wm-a' }],
    ['path', { d: HOOD, fill: url(3), class: 'wm-a' }],
    ['path', { d: OPEN, fill: P.ink, 'fill-opacity': 0.55, ...THIN, class: 'wm-a' }],
    ['path', { d: FACE, fill: url(0), ...THIN, class: 'wm-k' }],
    ['path', { d: HAIR, fill: url(1), ...THIN, class: 'wm-a' }],
    // eyes and a small smile
    ['path', { d: 'M9.3 12A0.75 0.95 0 1 1 10.8 12A0.75 0.95 0 1 1 9.3 12ZM13.2 12A0.75 0.95 0 1 1 14.7 12A0.75 0.95 0 1 1 13.2 12Z', fill: P.ink, class: 'wm-k' }],
    ['path', { d: MOUTH, fill: P.tint, stroke: P.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // drawstrings with aglets
    ['path', { d: 'M10 18.6V20.1M14 18.6V20.1', ...ROUND, stroke: P.ink, 'stroke-width': 1.3, class: 'wm-a' }],
    ['path', { d: 'M10 18.6V20.1M14 18.6V20.1', ...ROUND, stroke: P.shine, 'stroke-width': 0.45, class: 'wm-a' }],
    // shine: hood rim on the lit side, fringe sheen, eye catch-lights, shoulder
    ['path', { d: 'M5 13.2C4.75 8.9 7.4 5.1 11.3 3.75', ...ROUND, stroke: P.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: 'M8.1 8.85C8.8 7.6 10 6.85 11.4 6.75', ...ROUND, stroke: P.shine, 'stroke-opacity': 0.45, 'stroke-width': 0.45, class: 'wm-shine' }],
    ['path', { d: 'M10.08 11.62A0.24 0.24 0 1 1 10.56 11.62A0.24 0.24 0 1 1 10.08 11.62ZM13.98 11.62A0.24 0.24 0 1 1 14.46 11.62A0.24 0.24 0 1 1 13.98 11.62Z', fill: P.tint, class: 'wm-shine' }],
  ]
}
