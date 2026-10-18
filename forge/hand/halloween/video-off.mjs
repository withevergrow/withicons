// forge/hand/halloween/video-off.mjs — a plump pumpkin video camera with a witch-purple lens cone, cut by one slim
// slime-green ink-edged slash that sits in a single clean cutout. Replaces the generated drawing, where the slash was
// thick with a white halo and a stray spider floated at the corner; the spider is gone and slash and gap are even.
// Roles: camera c1 -> c2, lens cone c3 -> edge, slash c4, outline ink, halo accent, shine shine, shadow shadow.
// Motion: camera wm-k (breathe about 12,12), lens cone wm-a, slash wm-s.
import { C } from '../../styles/_halloween-palettes.mjs'
import { parsePath, setD, resample } from '../../kernel/geom.mjs'
import { normalize, differenceSets, roundStrokeSet, translateSet } from '../../kernel/bool.mjs'

const NAME = 'video-off'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

// camera body and the lens cone (pointing right, slightly rounded)
const BODY = 'M4.5 6H13A2.5 2.5 0 0 1 15.5 8.5V15.5A2.5 2.5 0 0 1 13 18H4.5A2.5 2.5 0 0 1 2 15.5V8.5A2.5 2.5 0 0 1 4.5 6Z'
const CONE = 'M15.5 10L20.4 6.9A0.9 0.9 0 0 1 21.75 7.65V16.35A0.9 0.9 0 0 1 20.4 17.1L15.5 14Z'
// the slash runs top-left to bottom-right through the centre; the gap is its half-width plus clearance
const GAP = 1.85
const band = h => { const k = h * 0.7071; return [[-4 + k, -4 - k], [28 + k, 28 - k], [28 - k, 28 + k], [-4 - k, -4 + k]] }
const line = (a, b) => resample([a, b], 0.1).map(o => o.p)
const slash = (dx, dy) => setD(roundStrokeSet(line([4.4 + dx, 4.4 + dy], [19.6 + dx, 19.6 + dy]), 1.8))

export default function render() {
  const cut = normalize(band(GAP))
  const body = differenceSets(normalize(parsePath(BODY, 0.1)[0].pts), cut)
  const cone = differenceSets(normalize(parsePath(CONE, 0.1)[0].pts), cut)
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 9, cy: 12.6, r: 11, fx: 6, fy: 8.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 18.5, cy: 12.5, r: 6, fx: 17, fy: 9.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.45, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: setD(translateSet([...body, ...cone], 0.15, 0.85)), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: slash(0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: setD(body), fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: setD(cone), fill: url(1), ...INK, class: 'wm-a' }],
    // shine on the camera's upper-left shoulder and on the cone
    ['path', { d: 'M3.7 9.3A1.9 1.9 0 0 1 5.4 7.5H9', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.7, class: 'wm-shine' }],
    ['path', { d: 'M17.3 9.9L19.7 8.4', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: slash(0, 0), fill: C.c4, ...INK, class: 'wm-s' }],
    ['path', { d: 'M5.3 4.9L10.4 10', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.5, class: 'wm-shine' }],
  ]
}
