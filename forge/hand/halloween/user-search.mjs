// forge/hand/halloween/user-search.mjs - a person (orange head over witch-purple shoulders) with a slime-green magnifier at
// the bottom right, clear of the torso: a visible ring around pale glass with a purple handle running down-right.
// Replaces the generated drawing, where the lens overlapped the shoulder and read as a green blob.
// Roles: skin tint -> c1 -> c2, cloth c3 -> edge, lens ring c4, glass tint, handle c3, outline ink, halo accent.
// Motion: person wm-k, magnifier wm-s.
import { C } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const NAME = 'user-search'
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

// magnifier: lens centre (17,15.6), handle running to the lower right
const LENS_O = 'M20.6 15.6A3.6 3.6 0 1 1 13.4 15.6A3.6 3.6 0 1 1 20.6 15.6Z'
const LENS_I = 'M19 15.6A2 2 0 1 0 15 15.6A2 2 0 1 0 19 15.6Z'
const RING = LENS_O + LENS_I
const HANDLE = 'M19.6 18.2L21.6 20.2'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 7.75, cy: 8.6, r: 4.6, fx: 6.4, fy: 6.6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.tint), st(0.35, C.c1), st(0.7, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 7.75, cy: 18, r: 7.5, fx: 4.8, fy: 14.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.5, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.16), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: shift(BODY, 0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: shift(LENS_O, 0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: BODY, fill: url(1), ...INK, class: 'wm-k' }],
    ['path', { d: HEAD, fill: url(0), ...INK, class: 'wm-k' }],
    // magnifier: handle, green ring around a pale glass
    ['path', { d: HANDLE, ...R, stroke: C.ink, 'stroke-width': 3.4, class: 'wm-s' }],
    ['path', { d: HANDLE, ...R, stroke: C.c3, 'stroke-width': 1.8, class: 'wm-s' }],
    ['path', { d: LENS_I, fill: C.tint, 'fill-opacity': 0.8, class: 'wm-s' }],
    ['path', { d: RING, fill: C.c4, 'fill-rule': 'evenodd', ...THIN, class: 'wm-s' }],
    ['path', { d: 'M14.9 14.3A2.7 2.7 0 0 1 16.6 13', ...R, stroke: C.shine, 'stroke-opacity': 0.7, 'stroke-width': 0.5, class: 'wm-shine' }],
    // shine on the person
    ['path', { d: 'M5.2 7.6A2.8 2.8 0 0 1 7.6 5.3', ...R, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: 'M3.7 19.2A3.3 3.3 0 0 1 6.5 15.7', ...R, stroke: C.shine, 'stroke-opacity': 0.45, 'stroke-width': 0.6, class: 'wm-shine' }],
  ]
}
