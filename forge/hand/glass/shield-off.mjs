// forge/hand/glass/shield-off.mjs — the family's frosted glass shield (same pane, rim and colour body as shield-check and
// shield-x) with a bold slash through it. The old slash was a hot-pink bar that poked well past the shield and left a
// white halo; now the slash sits on the pane as a deep etch-ink bar
// (the ink of shield-x's X) with a dark underside and a frosted halo where it crosses the pane, so it stays in the violet palette and reads at 16px.
// Roles: back/shadow body, pane/frost glass, etch slash, shine rim. Motion: shield wm-k, slash wm-s.
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'
import { parsePath, setD, area as ringArea } from '../../kernel/geom.mjs'
import { roundStrokeSet, translateSet, intersectSets, setOf } from '../../kernel/bool.mjs'

const NAME = 'shield-off'
const SHIELD = 'M12 21.5 C7.5 19.8 4.5 16.5 4.5 12 V5.5 L12 2.5 L19.5 5.5 V12 C19.5 16.5 16.5 19.8 12 21.5 Z'
const A = [4.4, 4.4], Z = [19.3, 19.3]
const W = 2.1       // the slash bar

// skeleton point -> the front pane's frame (the drawing's 0.94 scale, 0.5u up-left)
const F = v => +(12 + (v - 12) * G.SCALE - 0.5).toFixed(2)
const fp = ([x, y]) => [F(x), F(y)]

export default function render() {
  const sh = parsePath(SHIELD)
  const base = {
    name: NAME,
    paths: [{ d: SHIELD, plate: 'K' }],
    lines: sh.map(s => ({ pts: s.pts, closed: s.closed, plate: 'K' })),
    fills: [{ subs: sh }],
  }
  const L = softLayers(base)
  if (!L) return null
  const { defs, out } = softPaint(L, NAME)

  const a = fp(A), z = fp(Z)
  const bar = roundStrokeSet([a, z], W)
  const D = set => setD(set.filter(r => Math.abs(ringArea(r)) > 0.06), 0.02)
  const bd = D(bar)
  const pane = setOf(parsePath(L.front).map(r => r.pts))
  const halo = intersectSets(roundStrokeSet([a, z], W + 2 * 0.5), pane)
  const g = ['linearGradient', { id: `wg-glass-${NAME}-${defs.length}`, x1: a[0], y1: a[1], x2: z[0], y2: z[1], gradientUnits: 'userSpaceOnUse' },
    [['stop', { offset: 0, 'stop-color': V.etch }], ['stop', { offset: 1, 'stop-color': V.etch, 'stop-opacity': 0.88 }]]]
  defs.push(g)
  const slash = [
    ['path', { d: D(halo), fill: V.frost, 'fill-opacity': 0.75, class: 'wm-s' }],
    ['path', { d: D(translateSet(bar, 0.3, 0.45)), fill: V.shadow, 'fill-opacity': 0.35, class: 'wm-s' }],
    ['path', { d: bd, fill: `url(#${g[1].id})`, stroke: 'currentColor', 'stroke-opacity': 0.18, 'stroke-width': 0.4, class: 'wm-s' }],
  ]
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  if (rim >= 0) out.splice(rim, 0, ...slash); else out.push(...slash)
  return [['defs', {}, defs], ...out]
}
