// forge/hand/chrome/wifi-off.mjs: three fat chrome wifi arcs and a round dot, each one a solid polished tube that is cut
// with straight parallel edges where a single pink enamel slash in a chrome bezel passes through (a clean gap either side,
// no hatching), the same pink jewel volume-off uses. The generated version had thin hatched arcs chopped into fragments
// and a dark navy slash.
import { strokeSet, roundStrokeSet, unionSets, differenceSets } from '../../kernel/bool.mjs'
import { setD } from '../../kernel/geom.mjs'

const col = {
  edge: 'var(--with-chrome-edge, #F4F7FC)', tint: 'var(--with-chrome-tint, #DCE5F2)', c1: 'var(--with-chrome-c1, #8794AA)',
  c3: 'var(--with-chrome-c3, #3E4556)', c4: 'var(--with-chrome-c4, #CDB9A4)', shine: 'var(--with-chrome-shine, #FFFFFF)',
  shadow: 'var(--with-chrome-shadow, #1A1E2A)', accent: 'var(--with-chrome-accent, #FF3E9E)',
}
const CX = 12, CY = 18.6, HA = 45, RS = [4.4, 8.6, 12.8], TUBE = 3.1, DOT = 2.1
const S0 = [5.4, 3.9], S1 = [19.8, 18.3]    // slash centre line
const BAND = 2.0                            // slash strip half-width: bezel (1.5) + moat (0.5)

const arcPts = (r, a0, a1) => { const o = []; for (let a = a0; a <= a1 + 1e-9; a += 1) o.push([CX + r * Math.sin(a * Math.PI / 180), CY - r * Math.cos(a * Math.PI / 180)]); return o }
const circ = (cx, cy, r) => { const o = []; for (let a = 0; a < 360; a += 10) o.push([cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)]); return o }
const stripAt = e => strokeSet([[S0[0] - 8, S0[1] - 8], [S1[0] + 8, S1[1] + 8]], (BAND + e) * 2)
// the wifi tubes inset by e on every side, with the slash strip cleared (and widened by e)
function body(e = 0) {
  const parts = RS.map(r => roundStrokeSet(arcPts(r, -HA, HA), TUBE - 2 * e))
  parts.push([circ(CX, CY, DOT - e)])
  return differenceSets(unionSets(parts), stripAt(e))
}
const d = (set, tol = 0.02) => setD(set, tol)

export default function render() {
  const ramp = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' },
    stops.map(([o, c]) => ['stop', { offset: o, 'stop-color': c }])]
  const defs = ['defs', {}, [
    ramp('wg-chrome-wifi-off-0', 0, 5, 0, 20.5, [[0, col.edge], [0.34, col.tint], [0.5, col.c1], [0.56, col.c3], [0.74, col.c4], [1, col.edge]]),
    ramp('wg-chrome-wifi-off-1', 0, 3, 0, 20, [[0, col.shine], [0.3, col.accent], [1, col.accent]]),
  ]]
  const B = body(0), core = body(0.55)
  const mv = (set, x, y) => set.map(r => r.map(p => [p[0] + x, p[1] + y]))
  const out = [defs]
  const fr = { 'fill-rule': 'evenodd' }
  out.push(['path', { d: d(differenceSets(mv(B, 0.2, 0.75), B)), fill: col.shadow, 'fill-opacity': 0.2, ...fr, class: 'wm-shadow' }])
  out.push(['path', { d: d(B), fill: col.shadow, ...fr, class: 'wm-k' }])
  out.push(['path', { d: d(body(0.2)), fill: col.edge, ...fr, class: 'wm-k' }])
  out.push(['path', { d: d(core), fill: 'url(#wg-chrome-wifi-off-0)', ...fr, class: 'wm-k' }])
  out.push(['path', { d: d(differenceSets(core, mv(core, 0.3, 0.42))), fill: col.shine, 'fill-opacity': 0.85, ...fr, class: 'wm-shine' }])
  // the pink enamel slash in a chrome bezel
  const sl = roundStrokeSet([S0, S1], 3.0)
  out.push(['path', { d: d(sl), fill: col.shadow, ...fr, class: 'wm-s' }])
  out.push(['path', { d: d(roundStrokeSet([S0, S1], 2.6)), fill: col.edge, ...fr, class: 'wm-s' }])
  out.push(['path', { d: d(roundStrokeSet([S0, S1], 1.6)), fill: 'url(#wg-chrome-wifi-off-1)', ...fr, class: 'wm-s' }])
  out.push(['path', { d: `M${S0[0] + 1.3} ${S0[1] - 0.3} L${S0[0] + 4.3} ${S0[1] + 2.7}`, stroke: col.shine, 'stroke-width': 0.5, 'stroke-opacity': 0.9, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }])
  return out
}
