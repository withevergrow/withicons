// forge/hand/glass/spider-web.mjs — a frosted hex spider web: the line design's scalloped six-sided silhouette with its three
// spokes and a smaller scalloped ring, as a clear glass pane over a colour body, the threads etched in deep ink.
// Roles: back/shadow body, pane/frost glass, etch threads, shine rim. Motion: body wm-k, threads wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, erode, dilate, translateSet, differenceSets, setOf, roundStrokeSet } from '../../kernel/bool.mjs'

const f2 = v => +v.toFixed(2)
const D = (s, t = 0.05) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
const orient = r => { let a = 0; for (let i = 0; i < r.length; i++) { const [x1, y1] = r[i], [x2, y2] = r[(i + 1) % r.length]; a += x1 * y2 - x2 * y1 } return a < 0 ? r : r.slice().reverse() }
const area = d => unionSets(parsePath(d, 0.2).map(s => setOf([s.pts])))
// the six corners of the web and the scalloped rim that joins them (each side bows in towards the hub)
const OUT = 'M12 2 Q15.25 6.25 20.5 7 Q18.5 12 20.5 17 Q15.25 17.75 12 22 Q8.75 17.75 3.5 17 Q5.5 12 3.5 7 Q8.75 6.25 12 2 Z'
const q = (p0, c, p1, n = 10) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]] })
const ring = (pts, cs) => pts.flatMap((p, i) => q(p, cs[i], pts[(i + 1) % pts.length]).slice(0, -1)).concat([pts[0]])
const INNER = ring([[12, 7], [16.5, 9.5], [16.5, 14.5], [12, 17], [7.5, 14.5], [7.5, 9.5]], [[13.5, 9.5], [15, 12], [13.5, 14.5], [10.5, 14.5], [9, 12], [10.5, 9.5]])
const THREADS = [
  [[12, 2.6], [12, 21.4]], [[4.1, 7.3], [19.9, 16.7]], [[19.9, 7.3], [4.1, 16.7]], INNER,
]
export default function render(icon) {
  const name = (icon && icon.name) || 'spider-web'
  const S = 0.94, place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.4, 12 + (y - 12) * S - 0.4])))
  const pane = place(area(OUT))
  const threads = place(THREADS.flatMap(l => l.slice(1).flatMap((p, i) => roundStrokeSet([l[i], p], 0.7).map(orient))))
  const back = translateSet(tidy(erode(pane, 0.3)), 0.8, 0.8)
  const rim = differenceSets(tidy(erode(pane, 0.1)), translateSet(tidy(erode(pane, 0.1)), 0.3, 0.45))
  const g = i => `wg-glass-${name}-${i}`
  const defs = ['defs', {}, [
    ['linearGradient', { id: g(0), x1: 3, y1: 2, x2: 21, y2: 23, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.c1), stop(1, V.shadow)]],
    ['radialGradient', { id: g(1), cx: 15, cy: 18, r: 8, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]],
    ['linearGradient', { id: g(2), x1: 4, y1: 2, x2: 19, y2: 22, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.7), stop(1, V.tint, 0.42)]],
  ]]
  const bd = D(back, 0.07)
  return [defs,
    ['path', { d: D(translateSet(dilate(back, 0.9), 0, 0.5), 0.14), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }],
    ['path', { d: D(translateSet(dilate(back, 0.35), 0, 0.5), 0.1), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }],
    ['path', { d: bd, fill: `url(#${g(0)})`, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: bd, fill: `url(#${g(1)})`, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: D(pane), fill: `url(#${g(2)})`, stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, 'stroke-linejoin': 'round', 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: D(threads), fill: V.etch, 'fill-opacity': 0.7, 'fill-rule': 'nonzero', class: 'wm-a' }],
    ['path', { d: D(rim), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }],
  ]
}
