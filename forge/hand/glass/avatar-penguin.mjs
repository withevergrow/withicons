// forge/hand/glass/avatar-penguin.mjs — the glass penguin. Generated Glass washed body, belly and flippers into one pale
// violet pane with a dark belly blob, so it read as an owl or a chick. Here the penguin's tuxedo carries it: the body
// and flippers are a thin-frosted pane so the deep violet glows through like a dark coat, and a clear white glass mask
// (heart over the face, running into a round belly) sits in front, with bold etch eyes, an accent beak and two accent
// feet. Motion: body wm-k, eyes wm-a (they blink).
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

const NAME = 'avatar-penguin'
const F = v => +(12 + (v - 12) * G.SCALE - 0.5).toFixed(2)
const T = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${F(+x)} ${F(+y)}`)
const R = r => +(r * G.SCALE).toFixed(2)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

function mk(paths, fills) {
  const P = paths.map(([d, plate], i) => ({ id: `p${i}`, d, plate, subs: parsePath(d) }))
  const Fs = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    name: 'avatar-penguin-hand', paths: P, fills: Fs, cutouts: [],
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: unionSets(Fs.map(f => f.set)),
  }
}

export default function render() {
  // body with two flippers held out low, the skeleton's silhouette
  const body = 'M12 2.5 C16 2.5 18 5.75 18 10 V11 C19.75 12 20.75 14.25 20.5 16.75 C19.5 16.5 18.5 15.75 18 15 V15.5 C18 17.75 15.5 19 12 19 C8.5 19 6 17.75 6 15.5 V15 C5.5 15.75 4.5 16.5 3.5 16.75 C3.25 14.25 4.25 12 6 11 V10 C6 5.75 8 2.5 12 2.5 Z'
  const L = softLayers(mk([[body, 'K']], [body]))
  if (!L) return null
  L.frost = 0.42; L.edge = 0.3
  const { defs, out } = softPaint(L, NAME)
  const g = (tag, a, stops) => { const n = [tag, { id: `wg-glass-${NAME}-${defs.length}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(n); return `url(#${n[1].id})` }
  const white = g('linearGradient', { x1: 8, y1: 5, x2: 15, y2: 19 }, [stop(0, V.frost, 0.96), stop(0.55, V.tint, 0.9), stop(1, V.tint, 0.78)])
  const ink = { fill: 'none', stroke: V.etch, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  const hair = { stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.4 }
  // the white mask: a heart over the face that runs down into a round belly
  const mask = 'M12 5.9 C12.9 4.75 15.55 4.7 15.95 7.15 C16.15 8.45 15.75 9.6 15.25 10.6 C16.45 12.25 16.75 14.6 16.4 17.15 C15.25 18.05 13.75 18.45 12 18.45 C10.25 18.45 8.75 18.05 7.6 17.15 C7.25 14.6 7.55 12.25 8.75 10.6 C8.25 9.6 7.85 8.45 8.05 7.15 C8.45 4.7 11.1 4.75 12 5.9 Z'
  const feet = [
    ['path', { d: T('M8.2 19.85 C8.2 19.15 9.1 18.85 10.05 18.85 C11 18.85 11.65 19.25 11.65 19.9 C11.65 20.55 10.9 21 9.95 21 C9 21 8.2 20.55 8.2 19.85 Z'), fill: V.accent, ...hair, class: 'wm-k' }],
    ['path', { d: T('M12.35 19.9 C12.35 19.25 13 18.85 13.95 18.85 C14.9 18.85 15.8 19.15 15.8 19.85 C15.8 20.55 15 21 14.05 21 C13.1 21 12.35 20.55 12.35 19.9 Z'), fill: V.accent, ...hair, class: 'wm-k' }],
  ]
  const marks = [
    ...feet,
    ['path', { d: T(mask), fill: white, ...hair, class: 'wm-k' }],
    // beak: an accent glass chevron
    ['path', { d: T('M10.5 9.35 C10.5 8.95 11.2 8.75 12 8.75 C12.8 8.75 13.5 8.95 13.5 9.35 C13.5 9.9 12.6 10.95 12 10.95 C11.4 10.95 10.5 9.9 10.5 9.35 Z'), fill: V.accent, ...hair, class: 'wm-k' }],
    ['path', { d: `M${F(11.35)} ${F(9.2)}h0`, ...ink, stroke: V.shine, 'stroke-width': 0.45, class: 'wm-shine' }],
    // eyes: etch beads with catch lights (they blink)
    ['ellipse', { cx: F(10.1), cy: F(7.35), rx: R(0.82), ry: R(1), fill: V.etch, class: 'wm-a' }],
    ['ellipse', { cx: F(13.9), cy: F(7.35), rx: R(0.82), ry: R(1), fill: V.etch, class: 'wm-a' }],
    ['path', { d: `M${F(9.85)} ${F(7)}h0M${F(13.65)} ${F(7)}h0`, ...ink, stroke: V.shine, 'stroke-width': 0.45, class: 'wm-shine' }],
  ]
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  out.splice(rim >= 0 ? rim : out.length, 0, ...marks)
  return [['defs', {}, defs], ...out]
}
