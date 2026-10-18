// forge/hand/halloween/phone-off.mjs - the full pumpkin-orange handset of 'phone' (earpiece, curved body, mouthpiece) cut by a clean
// anti-diagonal gap, with the slime-green slash of the sibling bell-off laid in the gap (ink outline, green core).
// Roles: handset c1 -> c2, slash c4, outline ink, halo accent, shine shine, drop shadow shadow.
// Motion: handset wm-k, slash wm-s.
import { C } from '../../styles/_halloween-palettes.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { normalize, differenceSets, translateSet } from '../../kernel/bool.mjs'

const NAME = 'phone-off'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

const HANDSET = 'M3 5A2 2 0 0 1 5 3H8A1.5 1.5 0 0 1 9.5 4.5V6C9.5 7.25 8.5 7.25 8.5 8.5A7 7 0 0 0 15.5 15.5C16.75 15.5 16.75 14.5 18 14.5H19.5A1.5 1.5 0 0 1 21 16V19A2 2 0 0 1 19 21A16 16 0 0 1 3 5Z'
// band along x + y = 24, half-width hw measured across the band
const band = hw => { const k = hw * Math.SQRT2; return [[-4, 28 + k], [28 + k, -4], [28 - k, -4], [-4, 28 - k]] }
const SLASH = 'M20.15 2.15L2.15 20.15A1.2 1.2 0 0 0 3.85 21.85L21.85 3.85A1.2 1.2 0 0 0 20.15 2.15Z'
const SLASH_SH = 'M20 3L2 21A1.2 1.2 0 0 0 3.7 22.7L21.7 4.7A1.2 1.2 0 0 0 20 3Z'

export default function render() {
  const gap = normalize(band(1.9))
  const phone = differenceSets(normalize(parsePath(HANDSET, 0.1)[0].pts), gap)
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 12.5, r: 13, fx: 7.5, fy: 7, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.5, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: setD(translateSet(phone, 0.15, 0.85)), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: setD(phone), fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: 'M4.3 5.4A1.7 1.7 0 0 1 5.9 4.2H7.9', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: 'M17.6 16.2H19', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: SLASH_SH, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: SLASH, fill: C.c4, ...INK, class: 'wm-s' }],
    ['path', { d: 'M19.7 3.6L14.6 8.7', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.5, class: 'wm-shine' }],
  ]
}
