// forge/hand/glass/avatar-bear.mjs — the glass bear face. Generated Glass fused ears and head into one pale frosted blob
// with hairline etched eyes, so at 16px the bear and the dog were the same round face. Here the head and two round
// ears on top are glass's own frosted pane (firmer hairline, thinner frost so the violet glows through), each ear
// carries a deep violet inner-ear inset, and the lower face is a clear pale muzzle with a deep etch-ink nose and mouth:
// round ears + muzzle is the bear's signature. Eyes are bold etch-ink beads (wm-a, they blink).
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

const NAME = 'avatar-bear'
// skeleton coordinates -> glass's front (pane) frame: scaled about the centre, 0.5u up-left
const F = v => +(12 + (v - 12) * G.SCALE - 0.5).toFixed(2)
const T = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${F(+x)} ${F(+y)}`)
const R = r => +(r * G.SCALE).toFixed(2)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

function mk(paths, fills) {
  const P = paths.map(([d, plate], i) => ({ id: `p${i}`, d, plate, subs: parsePath(d) }))
  const Fs = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    name: NAME, paths: P, fills: Fs, cutouts: [],
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: unionSets(Fs.map(f => f.set)),
  }
}

export default function render() {
  // head and round ears, exactly the skeleton's silhouette (outlines as glass rods, discs as the mass)
  const head = 'M19 13.75 A7 7 0 1 1 5 13.75 A7 7 0 1 1 19 13.75 Z'
  const earL = 'M8.75 7.5 A2.5 2.5 0 1 1 3.75 7.5 A2.5 2.5 0 1 1 8.75 7.5 Z'
  const earR = 'M20.25 7.5 A2.5 2.5 0 1 1 15.25 7.5 A2.5 2.5 0 1 1 20.25 7.5 Z'
  const L = softLayers(mk([[head, 'K'], [earL, 'K'], [earR, 'K']], [head, earL, earR]))
  if (!L) return null
  L.frost = 0.85; L.edge = 0.3
  const { defs, out } = softPaint(L, NAME)
  const g = (tag, a, stops) => { const n = ['' + tag, { id: `wg-glass-${NAME}-${defs.length}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(n); return `url(#${n[1].id})` }
  const deep = g('linearGradient', { x1: 4, y1: 5, x2: 20, y2: 20 }, [stop(0, V.c1), stop(1, V.shadow)])
  const hair = { stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.4 }
  const ink = { fill: 'none', stroke: V.etch, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  const marks = [
    // inner ears: deep violet glass insets, a specular tick on each
    ['ellipse', { cx: F(6.4), cy: F(7.65), rx: R(1.4), ry: R(1.4), fill: deep, ...hair, class: 'wm-k' }],
    ['ellipse', { cx: F(17.6), cy: F(7.65), rx: R(1.4), ry: R(1.4), fill: deep, ...hair, class: 'wm-k' }],
    // muzzle: a clear pale lens on the lower face
    ['ellipse', { cx: F(12), cy: F(16.9), rx: R(3.5), ry: R(2.6), fill: V.frost, 'fill-opacity': 0.72, stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.4, class: 'wm-k' }],
    // nose and mouth in deep etch ink
    ['path', { d: T('M10.65 15.55 C10.65 14.95 11.25 14.75 12 14.75 C12.75 14.75 13.35 14.95 13.35 15.55 C13.35 16.2 12.6 16.75 12 16.75 C11.4 16.75 10.65 16.2 10.65 15.55 Z'), fill: V.etch, class: 'wm-k' }],
    ['path', { d: T('M12 16.6 V17.6 M10.5 17.85 C11.1 18.55 11.75 18.4 12 17.6 C12.25 18.4 12.9 18.55 13.5 17.85'), ...ink, 'stroke-width': 0.85, class: 'wm-k' }],
    // eyes: etch-ink beads with a catch light (they blink)
    ['ellipse', { cx: F(9.25), cy: F(12.4), rx: R(0.95), ry: R(1.05), fill: V.etch, class: 'wm-a' }],
    ['ellipse', { cx: F(14.75), cy: F(12.4), rx: R(0.95), ry: R(1.05), fill: V.etch, class: 'wm-a' }],
    ['path', { d: `M${F(8.95)} ${F(12)}h0M${F(14.45)} ${F(12)}h0M${F(11.4)} ${F(15.2)}h0`, ...ink, stroke: V.shine, 'stroke-width': 0.5, class: 'wm-shine' }],
    ['path', { d: T('M5.5 7.25 C5.65 6.85 5.95 6.6 6.35 6.55 M16.7 7.25 C16.85 6.85 17.15 6.6 17.55 6.55'), ...ink, stroke: V.shine, 'stroke-opacity': 0.8, 'stroke-width': 0.35, class: 'wm-shine' }],
  ]
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  out.splice(rim >= 0 ? rim : out.length, 0, ...marks)
  return [['defs', {}, defs], ...out]
}
