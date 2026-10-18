// forge/hand/glass/cloud-cog.mjs — the glass cloud with a cog. Generated Glass drew a small pink gear that sank into
// the cloud: no teeth and no hole at 16-24px, so it read as a flower. Here the cloud is a plump frosted pane with a
// flat base, and the cog is much bigger: eight clear square-cut teeth, an accent glass body with a bright inner face
// and a deep etch-ink hole you can see through, haloed in frost so it stands out from the cloud. Cloud is the body (wm-k);
// the cog and everything on it is wm-s (the skeleton's S plate, a signal badge that turns).
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'
import { circle } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

const NAME = 'cloud-cog'
const r2 = v => +v.toFixed(2)
const F = v => r2(12 + (v - 12) * G.SCALE - 0.5)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

// the cloud: three lobes on a flat base (skeleton coordinates)
const CLOUD = () => unionSets([
  setOf([circle(6.7, 11.5, 4.3, 0.12)]),
  setOf([circle(11.7, 8.9, 5.6, 0.12)]),
  setOf([circle(17, 11.7, 3.9, 0.12)]),
  setOf([[[6.7, 11.5], [17, 11.5], [17, 15.8], [6.7, 15.8]]]),
])
// the cog, in the pane frame
const GC = [F(15.4), F(16.4)], RO = 5.15, RI = 3.85, TEETH = 8
function cog(scale = 1) {
  const pts = []
  const pt = (rad, a) => [GC[0] + rad * Math.cos(a), GC[1] + rad * Math.sin(a)]
  for (let k = 0; k < TEETH; k++) {
    const c = (k + 0.5) * 2 * Math.PI / TEETH, root = 0.30, tip = 0.19
    pts.push(pt(RI, c - root), pt(RO, c - tip), pt(RO, c + tip), pt(RI, c + root))
    const nx = (k + 1.5) * 2 * Math.PI / TEETH - root
    for (let s = 1; s <= 2; s++) pts.push(pt(RI, c + root + (nx - (c + root)) * s / 3))
  }
  return 'M' + pts.map(p => `${r2(p[0])} ${r2(p[1])}`).join('L') + 'Z'
}

export default function render() {
  const set = CLOUD()
  const icon = { name: NAME, paths: [], lines: [], cutouts: [], fills: [{ d: '', subs: set.map(r => ({ pts: r, closed: true })), set }], fillSet: set }
  const L = softLayers(icon)
  if (!L) return null
  L.edge = 0.3
  const { defs, out } = softPaint(L, NAME)
  const g = (tag, a, stops) => { const n = [tag, { id: `wg-glass-${NAME}-${defs.length}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(n); return `url(#${n[1].id})` }
  const body = g('linearGradient', { x1: GC[0] - 5, y1: GC[1] - 5, x2: GC[0] + 5, y2: GC[1] + 5 }, [stop(0, V.accent, 0.9), stop(1, V.accent, 1)])
  const face = g('radialGradient', { cx: GC[0] - 1, cy: GC[1] - 1.2, r: 3.6 }, [stop(0, V.shine, 0.6), stop(1, V.shine, 0)])
  const d = cog()
  const marks = [
    ['path', { d, fill: V.frost, stroke: V.frost, 'stroke-opacity': 0.9, 'stroke-width': 1.7, 'stroke-linejoin': 'round', class: 'wm-s' }],
    ['path', { d, fill: body, stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-s' }],
    ['circle', { cx: GC[0], cy: GC[1], r: 3.2, fill: face, class: 'wm-s' }],
    // the hole: deep etch ink with a light lip on its lower right
    ['circle', { cx: GC[0], cy: GC[1], r: 1.95, fill: V.etch, 'fill-opacity': 0.88, class: 'wm-s' }],
    ['path', { d: `M${r2(GC[0] + 1.75)} ${r2(GC[1] - 0.2)}A1.78 1.78 0 0 1 ${r2(GC[0] - 0.1)} ${r2(GC[1] + 1.78)}`, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.75, 'stroke-width': 0.4, 'stroke-linecap': 'round', class: 'wm-s' }],
    // a lit edge along the upper-left teeth
    ['path', { d: `M${r2(GC[0] - 4.1)} ${r2(GC[1] - 1.2)}A4.2 4.2 0 0 1 ${r2(GC[0] - 1.2)} ${r2(GC[1] - 4.1)}`, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.7, 'stroke-width': 0.45, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  out.splice(rim >= 0 ? rim : out.length, 0, ...marks)
  return [['defs', {}, defs], ...out]
}
