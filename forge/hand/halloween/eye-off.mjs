// forge/hand/halloween/eye-off.mjs — a candle-lit cream eye with a big pumpkin-orange iris, struck through by a slim
// candle-gold ink-edged slash (1.5u) with a dark pupil kept visible, with a clear gap to both halves of the eye.
// Replaces the generated drawing, where the eye had no iris (only a stray pupil wedge), so the two cream halves read as
// broken plates or a bitten cookie rather than an eye; the iris now carries "eye" at 16px and the slash carries "off".
// Roles: eye shine -> tint, iris tint -> accent -> c1, slash accent, pupil ink, outline ink, halo accent, shine shine, shadow shadow.
// Motion: eye wm-k, iris wm-a, slash wm-s (parts.S pops), halo wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'
import { parsePath, setD, circle } from '../../kernel/geom.mjs'
import { normalize, differenceSets, intersectSets, translateSet } from '../../kernel/bool.mjs'

const NAME = 'eye-off'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

// almond eye, pointed corners on the 12 line
const ALMOND = 'M1.75 12C4.4 6.9 8 4.5 12 4.5C16 4.5 19.6 6.9 22.25 12C19.6 17.1 16 19.5 12 19.5C8 19.5 4.4 17.1 1.75 12Z'
// the slash runs top-left to bottom-right, centred on x = y; GAP is its half-width plus the clearance to the eye
const GAP = 1.7
const band = h => { const k = h * 0.7071; return [[-4 + k, -4 - k], [28 + k, 28 - k], [28 - k, 28 + k], [-4 - k, -4 + k]] }
const SLASH = 'M3.53 2.47L21.53 20.47A0.75 0.75 0 0 1 20.47 21.53L2.47 3.53A0.75 0.75 0 0 1 3.53 2.47Z'

function geometry() {
  const eye = normalize(parsePath(ALMOND, 0.1)[0].pts)
  const halves = differenceSets(eye, normalize(band(GAP)))
  const iris = intersectSets(normalize(circle(12, 12, 4.2, 0.1)), halves)
  const pupil = differenceSets(normalize(circle(12, 12, 2.2, 0.1)), normalize(band(1.2)))
  return { halves, iris, pupil }
}

export default function render() {
  const { halves, iris, pupil } = geometry()
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.28, r: 13.85, fx: 8.64, fy: 9.12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine), st(0.45, C.shine), st(1, C.tint)]],
      ['radialGradient', { id: id(1), cx: 11, cy: 10.6, r: 6, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.tint), st(0.4, C.accent), st(1, C.c1)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: setD(translateSet(halves, 0.15, 0.85)), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: 'M3.68 3.32L21.68 21.32A0.75 0.75 0 0 1 20.62 22.38L2.62 4.38A0.75 0.75 0 0 1 3.68 3.32Z', fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: setD(halves), fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: setD(iris), fill: url(1), ...INK, class: 'wm-a' }],
    ['path', { d: setD(pupil), fill: C.ink, class: 'wm-a' }],
    // catch-light on the iris and shine along the upper lid
    ['path', { d: 'M13.35 8.85A0.6 0.6 0 1 1 14.55 8.85A0.6 0.6 0 1 1 13.35 8.85Z', fill: C.shine, class: 'wm-shine' }],
    ['path', { d: 'M13.4 5.85C15.4 6.15 17.3 7.3 18.95 9.15', ...ROUND, stroke: C.accent, 'stroke-opacity': 0.55, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: SLASH, fill: C.accent, ...INK, 'stroke-width': 0.6, class: 'wm-s' }],
  ]
}
