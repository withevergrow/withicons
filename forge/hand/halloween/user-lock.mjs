// forge/hand/halloween/user-lock.mjs — the style's candle-lit pumpkin person (head and shoulders) with a small slime-green
// padlock at the bottom right, sitting in its own clean cutout in the person's shoulder, a witch-purple shackle on top.
// Replaces the generated drawing, where the head and body were dark midnight and fused into one heavy blob and the
// lock overlapped the shoulder messily.
// Roles: person c1 -> c2, padlock c4, shackle c3, keyhole ink, outline ink, halo accent, shine shine, shadow shadow.
// Motion: person wm-k, shackle wm-a (nudge), padlock body wm-s (bounce about 17.5,21).
import { C } from '../../styles/_halloween-palettes.mjs'
import { parsePath, setD, circle } from '../../kernel/geom.mjs'
import { normalize, unionSets, differenceSets, dilate, translateSet, roundStrokeSet } from '../../kernel/bool.mjs'

const NAME = 'user-lock'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const pts = d => parsePath(d, 0.1)[0].pts

const HEAD = 'M3.9 7.3a4.4 4.4 0 1 0 8.8 0a4.4 4.4 0 1 0 -8.8 0Z'
const BODY = 'M1.25 21.75V19.5A5.25 5.25 0 0 1 6.5 14.25H10.5A5.25 5.25 0 0 1 15.75 19.5V20.75A1 1 0 0 1 14.75 21.75H2.25A1 1 0 0 1 1.25 20.75Z'
// the padlock
const LOCK = 'M16.3 14.9H20.7A1.8 1.8 0 0 1 22.5 16.7V20.2A1.8 1.8 0 0 1 20.7 22H16.3A1.8 1.8 0 0 1 14.5 20.2V16.7A1.8 1.8 0 0 1 16.3 14.9Z'
const SHACKLE = 'M16.15 14.9V13.5A2.35 2.35 0 0 1 20.85 13.5V14.9'
const KEYHOLE = 'M18.5 17.1A0.9 0.9 0 0 1 19 18.8V19.9H18V18.8A0.9 0.9 0 0 1 18.5 17.1Z'

export default function render() {
  const lockSet = unionSets([normalize(pts(LOCK)), roundStrokeSet(pts(SHACKLE), 2.35)])
  const person = [normalize(pts(HEAD)), differenceSets(normalize(pts(BODY)), dilate(lockSet, 1.1))]
  const personAll = unionSets(person)
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 8.3, cy: 13.8, r: 12.4, fx: 6, fy: 8.8, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 15, y1: 11, x2: 21, y2: 15, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.55, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 11.75, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: setD(translateSet(unionSets([personAll, lockSet]), 0.15, 0.85)), 'fill-rule': 'evenodd', fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: setD(personAll), fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: 'M11.2 4.95A3.7 3.7 0 0 0 6.9 3.8A3.7 3.7 0 0 0 5.1 7.3', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.8, class: 'wm-shine' }],
    ['path', { d: 'M2.4 18.9A4.1 4.1 0 0 1 6.5 15.4H8.6', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.8, class: 'wm-shine' }],
    ['path', { d: SHACKLE, ...ROUND, stroke: C.ink, 'stroke-width': 2.9, class: 'wm-a' }],
    ['path', { d: SHACKLE, ...ROUND, stroke: url(1), 'stroke-width': 1.5, class: 'wm-a' }],
    ['path', { d: LOCK, fill: C.c4, ...INK, class: 'wm-s' }],
    ['path', { d: 'M15.5 17.2A0.9 0.9 0 0 1 16.4 16.1H19.8', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.5, class: 'wm-shine' }],
    ['path', { d: KEYHOLE, fill: C.ink, class: 'wm-s' }],
  ]
}
