// forge/hand/glass/avatar-person-headphones.mjs — the glass person wearing headphones. Generated Glass fused the hair,
// the headband and both ear cups into one pale frosted dome round the head, so the headphones vanished and the icon read
// as a person in a hood. Here the head and shoulders are glass's own frosted panes (firmer hairline, thinner frost), the
// hair is a clearer frost cap with an etched fringe, and the headphones are a separate deep violet glass set: a band
// arching clear of the crown and two cups over the ears, each with a light edge. Face in etch ink at Line's weight.
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

const NAME = 'avatar-person-headphones'
// skeleton coordinates -> glass's front (pane) frame: scaled about the centre, 0.5u up-left
const F = v => +(12 + (v - 12) * G.SCALE - 0.5).toFixed(2)
const T = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${F(+x)} ${F(+y)}`)
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

// a cup (left; the right one mirrors it): a rounded pad over the ear
const CUP = 'M5.6 8.85 C6.75 8.85 7.45 9.6 7.45 10.75 V12.85 C7.45 14 6.75 14.75 5.6 14.75 C4.45 14.75 3.75 14 3.75 12.85 V10.75 C3.75 9.6 4.45 8.85 5.6 8.85 Z'
const mirror = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${+(24 - x).toFixed(2)} ${y}`)
const nudge = (d, dx, dy) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${+(+x + dx).toFixed(2)} ${+(+y + dy).toFixed(2)}`)

export default function render() {
  // head (the skeleton's oval) and shoulders, as glass panes; the shoulders are one smooth arched bust (no neck dip)
  // whose crown sits 1u below the chin
  const head = 'M17.75 10.6 C17.75 14.3 15.25 16.85 12 16.85 C8.75 16.85 6.25 14.3 6.25 10.6 C6.25 6.9 8.75 4.35 12 4.35 C15.25 4.35 17.75 6.9 17.75 10.6 Z'
  const body = 'M3.5 21.5 C3.5 18.45 7.3 17.9 12 17.9 C16.7 17.9 20.5 18.45 20.5 21.5 C20.5 22.15 20.1 22.5 19.5 22.5 H4.5 C3.9 22.5 3.5 22.15 3.5 21.5 Z'
  const L = softLayers(mk([], [head, body]))
  if (!L) return null
  L.frost = 0.85; L.edge = 0.3
  const { defs, out } = softPaint(L, NAME)
  const g = (tag, a, stops) => { const n = [tag, { id: `wg-glass-${NAME}-${defs.length}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(n); return `url(#${n[1].id})` }
  const deep = g('linearGradient', { x1: 3, y1: 2, x2: 21, y2: 15 }, [stop(0, V.c1), stop(1, V.shadow)])
  const ink = { fill: 'none', stroke: V.etch, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  const hairline = { stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.4 }
  const band = 'M5.05 9.6 C5.05 5.4 8 2.55 12 2.55 C16 2.55 18.95 5.4 18.95 9.6'
  const cups = T(CUP) + T(mirror(CUP))
  const marks = [
    // hair: a clearer frost cap on the crown with a deep etched fringe
    ['path', { d: T('M6.6 10 C6.1 6.5 8.5 4.45 12 4.45 C15.5 4.45 17.9 6.5 17.4 10 C16.8 9.4 16.5 8.9 16.3 8.35 C14.8 8.85 13.25 8.6 12 7.85 C10.75 8.6 9.2 8.85 7.7 8.35 C7.5 8.9 7.2 9.4 6.75 10 Z'), fill: V.frost, 'fill-opacity': 0.72, class: 'wm-k' }],
    ['path', { d: T('M7.15 9.55 C7.45 9.15 7.65 8.75 7.75 8.4 C9.2 8.85 10.75 8.6 12 7.85 C13.25 8.6 14.8 8.85 16.25 8.4 C16.35 8.75 16.55 9.15 16.85 9.55'), ...ink, 'stroke-opacity': 0.9, 'stroke-width': 1 }],
    // face in etch ink
    ['path', { d: T('M9.75 11.15 V11.65 M14.25 11.15 V11.65'), ...ink, 'stroke-width': 1.45, class: 'wm-k' }],
    ['path', { d: T('M10.15 13.75 C11.15 14.75 12.85 14.75 13.85 13.75'), ...ink, 'stroke-width': 0.95, class: 'wm-k' }],
    // headphones: deep violet glass, a soft drop on the panes, a band clear of the crown, cups over the ears
    ['path', { d: T(nudge(band, 0.3, 0.35)), fill: 'none', stroke: V.shadow, 'stroke-opacity': 0.25, 'stroke-width': 1.7, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: T(nudge(CUP, 0.3, 0.35)) + T(nudge(mirror(CUP), 0.3, 0.35)), fill: V.shadow, 'fill-opacity': 0.28, class: 'wm-a' }],
    ['path', { d: T(band), fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 2.05, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: T(band), fill: 'none', stroke: deep, 'stroke-width': 1.6, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: cups, fill: deep, ...hairline, class: 'wm-a' }],
    ['path', { d: T('M6.3 4.55 C7.5 3.25 9.5 2.45 12 2.45') + T('M4.55 12.4 V10.85 C4.55 10.15 4.9 9.7 5.5 9.6 M16.55 12.4 V10.85 C16.55 10.15 16.9 9.7 17.5 9.6'), ...ink, stroke: V.shine, 'stroke-opacity': 0.8, 'stroke-width': 0.4, class: 'wm-shine' }],
  ]
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  out.splice(rim >= 0 ? rim : out.length, 0, ...marks)
  return [['defs', {}, defs], ...out]
}
