// forge/hand/halloween/globe-lock.mjs — one unbroken midnight globe whose equator, central meridian and meridian ellipse are carved and glow with
// candlelight, with a big slime-green padlock badge bottom-right sitting in its own clear gap. Replaces the generated
// drawing, where the carved grid ran out to the rim and split the sphere into loose wedges, and the small badge's
// shackle floated off its body, so at 16px it read as scattered shards and a green square.
// Roles: globe shadow -> ink (midnight) with edge outline, carved grid tint -> accent -> c1 (candle), padlock c4 with a
// c1 shackle, keyhole ink, halo accent, shine shine, drop shadow shadow.
// Motion: globe wm-k (sway about 11,11), padlock body + shackle wm-s (nod about 17.75,21.5).
import { C } from '../../styles/_halloween-palettes.mjs'
import { circle, parsePath, setD, splitRuns, pointInSet, resample, area } from '../../kernel/geom.mjs'
import { normalize, unionSets, differenceSets, intersectSets, roundStrokeSet, dilate, erode, translateSet } from '../../kernel/bool.mjs'

const NAME = 'globe-lock'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const EDGE = { stroke: C.edge, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const pts = d => parsePath(d, 0.15).flatMap(s => [s.pts])

// the padlock
const BODY = 'M14.6 15.25H19.9A1.6 1.6 0 0 1 21.5 16.85V19.9A1.6 1.6 0 0 1 19.9 21.5H14.6A1.6 1.6 0 0 1 13 19.9V16.85A1.6 1.6 0 0 1 14.6 15.25Z'
const SHACKLE = 'M15.25 15.6V13.75A2 2 0 0 1 19.25 13.75V15.6'
const KEYHOLE = 'M16.45 17.95A0.8 0.8 0 1 1 18.05 17.95C18.05 18.2 17.95 18.4 17.75 18.55V19.75H16.75V18.55C16.55 18.4 16.45 18.2 16.45 17.95Z'

function geometry() {
  const lock = unionSets([normalize(pts(BODY)[0]), roundStrokeSet(pts(SHACKLE)[0], 1.9)])
  // the gap: the padlock grown by 1.15, squared off to the right of the shackle so the rim ends cleanly (no thin tip)
  const gap = unionSets([dilate(lock, 1.15), normalize([[17.25, 9.72], [24, 9.72], [24, 24], [17.25, 24]])])
  const globe = differenceSets(normalize(circle(10.5, 10.5, 8.5, 0.15)), gap)
    .sort((p, q) => Math.abs(area(q)) - Math.abs(area(p))).slice(0, 1)
  // carved grid: the equator, an upper parallel, the central meridian and a narrow meridian ellipse (both arcs clear the lock), stopped short of the rim and of the gap with round ends, so the
  // sphere stays one piece
  const near = dilate(lock, 2.45)
  const keep = p => Math.hypot(p[0] - 10.5, p[1] - 10.5) <= 6.6 && !pointInSet(p, near)
  const ellipse = circle(10.5, 10.5, 1, 0.02).map(([x, y]) => [10.5 + (x - 10.5) * 3.4, 10.5 + (y - 10.5) * 6.6])
  const line = (a, b) => splitRuns(resample([a, b], 0.1).map(o => o.p), keep, 0.6)
  const keepTop = p => Math.hypot(p[0] - 10.5, p[1] - 10.5) <= 6.1 && !pointInSet(p, near)
  const runs = [...line([2, 10.5], [19, 10.5]), ...line([10.5, 2], [10.5, 19]), ...splitRuns(ellipse, keep, 0.6, true),
    ...splitRuns(resample([[2, 6.5], [19, 6.5]], 0.1).map(o => o.p), keepTop, 0.6)]
  const carve = unionSets(runs.map(r => roundStrokeSet(r, 1.6)))
  return { lock, globe, body: differenceSets(globe, carve) }
}

export default function render() {
  const { lock, globe, body } = geometry()
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 10.5, cy: 12.2, r: 11.6, fx: 7.6, fy: 7.2, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shadow), st(0.45, C.shadow), st(1, C.ink)]],
      ['radialGradient', { id: id(1), cx: 10.5, cy: 10.5, r: 9, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.tint), st(0.5, C.accent), st(1, C.c1)]],
      ['radialGradient', { id: id(2), cx: 11.5, cy: 12.9, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: setD(translateSet(unionSets([globe, lock]), 0.15, 0.85)), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // candlelight under the carved grid, then the globe with its grooves cut through
    ['path', { d: setD(globe), fill: url(1), class: 'wm-shine' }],
    ['path', { d: setD(body), fill: url(0), 'fill-rule': 'evenodd', ...EDGE, class: 'wm-k' }],
    ['path', { d: 'M3.4 8.6A7.85 7.85 0 0 1 6.2 4.4', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.35, 'stroke-width': 0.55, class: 'wm-shine' }],
    // padlock: shackle behind the body, outline first
    ['path', { d: SHACKLE, ...ROUND, stroke: C.edge, 'stroke-width': 2.62, class: 'wm-s' }],
    ['path', { d: SHACKLE, ...ROUND, stroke: C.c1, 'stroke-width': 1.18, class: 'wm-s' }],
    ['path', { d: BODY, fill: C.c4, ...EDGE, class: 'wm-s' }],
    ['path', { d: 'M13.4 19.6H21.1V19.9A1.25 1.25 0 0 1 19.85 21.15H14.65A1.25 1.25 0 0 1 13.4 19.9Z', fill: C.ink, 'fill-opacity': 0.14, class: 'wm-s' }],
    ['path', { d: 'M14.3 16.55H20.2', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: KEYHOLE, fill: C.ink, class: 'wm-s' }],
  ]
}
