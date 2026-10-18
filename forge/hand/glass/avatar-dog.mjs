// forge/hand/glass/avatar-dog.mjs — the glass dog face. Generated Glass melted the floppy ears into the head as one pale
// frosted blob (two faint hairlines were all that was left of them), so at 16px the dog was a round face like the bear.
// Here the head is glass's own frosted pane (firmer hairline, thinner frost) and the ears are two long deep violet glass
// flaps that hang over its sides down to the cheeks; the face is a deep etch-ink nose, a smiling mouth and an accent-pink
// tongue: long dark ears + tongue is the dog's signature. Eyes are bold etch-ink beads (wm-a, they blink).
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

const NAME = 'avatar-dog'
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

// a floppy ear (left), mirrored for the right: rooted on the crown, hanging over the head's side to the cheek
const EAR = 'M9.25 6.35 C7.25 5.1 4.4 5.6 3.35 8.1 C2.55 10.1 2.6 13.1 3.35 15.05 C3.95 16.6 5.85 16.75 6.55 15.2 C7.1 13.95 7.05 11.6 7.35 10.1 C7.6 8.75 8.3 7.3 9.25 6.35 Z'
const nudge = (d, dx, dy) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${+(+x + dx).toFixed(2)} ${+(+y + dy).toFixed(2)}`)
const mirror = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${+(24 - x).toFixed(2)} ${y}`)

export default function render() {
  const head = 'M12 6 C15.75 6 18 8.5 18 12 V14.5 C18 18.25 15.5 20.5 12 20.5 C8.5 20.5 6 18.25 6 14.5 V12 C6 8.5 8.25 6 12 6 Z'
  const L = softLayers(mk([[head, 'K']], [head]))
  if (!L) return null
  L.frost = 0.85; L.edge = 0.3
  const { defs, out } = softPaint(L, NAME)
  const g = (tag, a, stops) => { const n = [tag, { id: `wg-glass-${NAME}-${defs.length}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(n); return `url(#${n[1].id})` }
  const deep = g('linearGradient', { x1: 3, y1: 4.5, x2: 21, y2: 17 }, [stop(0, V.c1), stop(1, V.shadow)])
  const ink = { fill: 'none', stroke: V.etch, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  const ears = T(EAR) + T(mirror(EAR))
  const marks = [
    // ears: deep violet glass flaps with a soft drop onto the pane and a light edge on their lit side
    ['path', { d: T(nudge(EAR, 0.3, 0.35)) + T(nudge(mirror(EAR), 0.3, 0.35)), fill: V.shadow, 'fill-opacity': 0.28, class: 'wm-k' }],
    ['path', { d: ears, fill: deep, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.4, class: 'wm-k' }],
    ['path', { d: T('M8.2 6.15 C6.6 5.45 4.85 5.85 4.05 7.65 C3.6 8.65 3.4 9.9 3.4 11.1 M15.8 6.15 C17.4 5.45 19.15 5.85 19.95 7.65'), ...ink, stroke: V.shine, 'stroke-opacity': 0.75, 'stroke-width': 0.4, class: 'wm-shine' }],
    // tongue under the smile (accent glass), then nose and mouth in deep etch ink
    ['path', { d: T('M11 16.9 H13 V17.85 C13 18.55 12.55 19 12 19 C11.45 19 11 18.55 11 17.85 Z'), fill: V.accent, stroke: V.etch, 'stroke-opacity': 0.55, 'stroke-width': 0.35, class: 'wm-k' }],
    ['path', { d: T('M10.6 15.05 C10.6 14.45 11.2 14.25 12 14.25 C12.8 14.25 13.4 14.45 13.4 15.05 C13.4 15.7 12.6 16.25 12 16.25 C11.4 16.25 10.6 15.7 10.6 15.05 Z'), fill: V.etch, class: 'wm-k' }],
    ['path', { d: T('M12 16.1 V16.85 M10.25 16.55 C10.85 17.35 11.7 17.3 12 16.85 C12.3 17.3 13.15 17.35 13.75 16.55'), ...ink, 'stroke-width': 0.85, class: 'wm-k' }],
    // eyes: etch-ink beads with a catch light (they blink)
    ['ellipse', { cx: F(9.5), cy: F(12.1), rx: R(0.95), ry: R(1.05), fill: V.etch, class: 'wm-a' }],
    ['ellipse', { cx: F(14.5), cy: F(12.1), rx: R(0.95), ry: R(1.05), fill: V.etch, class: 'wm-a' }],
    ['path', { d: `M${F(9.2)} ${F(11.7)}h0M${F(14.2)} ${F(11.7)}h0M${F(11.35)} ${F(14.7)}h0`, ...ink, stroke: V.shine, 'stroke-width': 0.5, class: 'wm-shine' }],
  ]
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  out.splice(rim >= 0 ? rim : out.length, 0, ...marks)
  return [['defs', {}, defs], ...out]
}
