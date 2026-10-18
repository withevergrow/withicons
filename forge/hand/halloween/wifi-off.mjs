// forge/hand/halloween/wifi-off.mjs — three plump ink-edged pumpkin Wi-Fi arcs and a round dot, struck through by one
// slime-green ink-edged slash in a narrow clear lane. Replaces the generated drawing, where a thick slash lay over the arcs and
// hid them; the arcs are now fat, ink-edged ribbons that stay legible on both sides of a narrow slash.
// Roles: arcs and dot accent -> c1, slash c4, outline ink, halo accent, shine shine, shadow shadow.
// Motion: arcs and dot wm-k (flicker), slash wm-s (pulse about 12,12).
import { C } from '../../styles/_halloween-palettes.mjs'
import { setD, resample, circle } from '../../kernel/geom.mjs'
import { normalize, unionSets, differenceSets, roundStrokeSet, translateSet } from '../../kernel/bool.mjs'

const NAME = 'wifi-off'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.8, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

const OX = 12, OY = 19        // the arcs' common centre (the dot)
const SPREAD = 42               // half sweep in degrees
const W = 2.5  // arc ribbon width
const GAP = 1.85  // half width of the clear lane around the slash axis
const arc = r => {
  const pts = []
  for (let a = -SPREAD; a <= SPREAD; a += 1) {
    const t = a * Math.PI / 180
    pts.push([OX + r * Math.sin(t), OY - r * Math.cos(t)])
  }
  return pts
}
const band = h => { const k = h * 0.7071; return [[-4 + k, -4 - k], [28 + k, 28 - k], [28 - k, 28 + k], [-4 - k, -4 + k]] }
const SW = 1.9
const line = (a, b) => resample([a, b], 0.1).map(o => o.p)
const slash = (dx, dy) => setD(roundStrokeSet(line([3.9 + dx, 3.9 + dy], [20.1 + dx, 20.1 + dy]), SW))

export default function render() {
  const wifi = unionSets([
    ...[4.6, 8.8, 13].map(r => roundStrokeSet(arc(r), W)),
    normalize(circle(OX, OY, 1.75, 0.1)),
  ])
  const shape = differenceSets(wifi, normalize(band(GAP)))
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13, r: 16, fx: 8, fy: 8, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent), st(0.5, C.c1), st(1, C.c1)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: setD(translateSet(shape, 0.15, 0.85)), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: slash(0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: setD(shape), fill: url(0), ...INK, class: 'wm-k' }],
    // shine along the upper-left of the outer arcs
    ['path', { d: 'M10.15 5.83A13.3 13.3 0 0 1 16.1 6.35', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: 'M10.95 18.45A1.2 1.2 0 0 1 12 17.75', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.7, 'stroke-width': 0.5, class: 'wm-shine' }],
    ['path', { d: slash(0, 0), fill: C.c4, ...INK, class: 'wm-s' }],
    ['path', { d: 'M5.1 4.9L9.6 9.4', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.5, class: 'wm-shine' }],
  ]
}
