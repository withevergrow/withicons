// forge/hand/halloween/avatar-man-beard.mjs — a bearded man bust: side-swept hair running down into sideburns and one
// full beard round the jaw with a moustache, a small smile and a costume-orange top, in the style's night-lit avatar look.
// Replaces the generated drawing, where the beard split into a thin band across the cheeks that read as a mask, and a
// purple spider ornament competed with the face; the beard silhouette alone now carries the icon at 16px.
// Roles: skin tint -> c1 -> shadow, hair + beard c2 -> c3, top c4, outline ink, halo accent, shine shine, drop shadow ink.
// Motion: face wm-k, hair + beard + top wm-a (breathe about 12,21.5).
import { personTones } from '../../styles/_halloween-people.mjs'
import { BASE } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const NAME = 'avatar-man-beard'
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
// side-swept hair, a deeper wave over the right brow
const HAIR = 'M6.1 10.8C5.4 6.2 8.2 2.9 12 2.9C15.8 2.9 18.6 6.2 17.9 10.8C17.6 9.6 17 8.8 16.1 8.3C14 8.8 11.2 8.5 9.4 7.2C8.3 8 6.7 9.3 6.1 10.8Z'
// sideburns into a full beard round the jaw, the moustache as its upper edge
const BEARD = 'M6.3 10.2C6.3 14.9 8.8 17.7 12 17.7C15.2 17.7 17.7 14.9 17.7 10.2C17.2 10.5 16.9 11.2 16.7 12.2C16.3 13.5 15.4 14.1 14.2 14.1C13.4 14.1 12.6 13.85 12 13.5C11.4 13.85 10.6 14.1 9.8 14.1C8.6 14.1 7.7 13.5 7.3 12.2C7.1 11.2 6.8 10.5 6.3 10.2Z'
const MOUTH = 'M10.7 15.05C11.45 15.95 12.55 15.95 13.3 15.05C12.55 15.35 11.45 15.35 10.7 15.05Z'

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
      ['radialGradient', { id: id(0), cx: 12, cy: 13.2, r: 8.4, fx: 10, fy: 8.8, gradientUnits: 'userSpaceOnUse' },
        [st(0, P.tint), st(0.3, P.c1), st(0.68, P.c1), st(1, P.shadow)]],
      ['linearGradient', { id: id(1), x1: 6, y1: 2, x2: 18, y2: 18, gradientUnits: 'userSpaceOnUse' },
        [st(0, P.c2), st(1, P.c3)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, P.accent, 0.36), st(0.55, P.accent, 0.162), st(1, P.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: shift(TOP + FACE + HAIR + BEARD, 0.15, 0.85), fill: P.ink, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // top, face, hair, beard resting on the collar
    ['path', { d: TOP, fill: P.c4, ...INK, class: 'wm-a' }],
    ['path', { d: FACE, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: HAIR, fill: url(1), ...INK, class: 'wm-a' }],
    ['path', { d: BEARD, fill: url(1), ...INK, class: 'wm-a' }],
    // eyes and a small smile in the beard
    ['path', { d: 'M8.65 10.9A0.85 1.05 0 1 1 10.35 10.9A0.85 1.05 0 1 1 8.65 10.9ZM13.65 10.9A0.85 1.05 0 1 1 15.35 10.9A0.85 1.05 0 1 1 13.65 10.9Z', fill: P.ink, class: 'wm-k' }],
    ['path', { d: MOUTH, fill: P.tint, stroke: P.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // shine: hair sheen, beard sheen, eye catch-lights, shoulder
    ['path', { d: 'M7.05 8.7C7.6 6.3 9.3 4.4 11.6 3.95', ...ROUND, stroke: P.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: 'M7.6 14.3C8.2 15.5 9.1 16.3 10.2 16.7', ...ROUND, stroke: P.shine, 'stroke-opacity': 0.4, 'stroke-width': 0.5, class: 'wm-shine' }],
    ['path', { d: 'M9.65 10.45A0.26 0.26 0 1 1 10.17 10.45A0.26 0.26 0 1 1 9.65 10.45ZM14.65 10.45A0.26 0.26 0 1 1 15.17 10.45A0.26 0.26 0 1 1 14.65 10.45Z', fill: P.tint, class: 'wm-shine' }],
    ['path', { d: 'M5.9 20.6C6.1 19.7 6.9 19 8.1 18.75', ...ROUND, stroke: P.shine, 'stroke-opacity': 0.4, 'stroke-width': 0.55, class: 'wm-shine' }],
  ]
}
