// forge/hand/glass/backpack.mjs — the glass backpack. Generated Glass drew a pale rounded pane with a faint flap line
// and a small dark pocket, so it read as a jar or a lunch bag. Here the backpack is built from what names it: a frosted
// body with a carry loop on top, a deeper violet flap closed by an accent buckle, a big clear front pocket with an etch
// zip, and two violet shoulder straps wrapping round its sides. Motion: body wm-k, flap and pocket wm-a.
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

const NAME = 'backpack'
const F = v => +(12 + (v - 12) * G.SCALE - 0.5).toFixed(2)
const T = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${F(+x)} ${F(+y)}`)
// a rounded rectangle as cubics, already in the pane frame (T cannot map arc radii)
const rr = (x0, y0, x1, y1, r) => { const k = r * 0.45; return T(`M${x0 + r} ${y0} H${x1 - r} C${x1 - k} ${y0} ${x1} ${y0 + k} ${x1} ${y0 + r} V${y1 - r} C${x1} ${y1 - k} ${x1 - k} ${y1} ${x1 - r} ${y1} H${x0 + r} C${x0 + k} ${y1} ${x0} ${y1 - k} ${x0} ${y1 - r} V${y0 + r} C${x0} ${y0 + k} ${x0 + k} ${y0} ${x0 + r} ${y0} Z`) }
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

function mk(paths, fills) {
  const P = paths.map(([d, plate], i) => ({ id: `p${i}`, d, plate, subs: parsePath(d) }))
  const Fs = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    name: 'backpack-hand', paths: P, fills: Fs, cutouts: [],
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: unionSets(Fs.map(f => f.set)),
  }
}

export default function render() {
  const body = 'M7 21.5 H17 A2 2 0 0 0 19 19.5 V12 A5.5 5.5 0 0 0 13.5 6.5 H10.5 A5.5 5.5 0 0 0 5 12 V19.5 A2 2 0 0 0 7 21.5 Z'
  const L = softLayers(mk([[body, 'K']], [body]))
  if (!L) return null
  L.edge = 0.3
  const { defs, out } = softPaint(L, NAME)
  const g = (tag, a, stops) => { const n = [tag, { id: `wg-glass-${NAME}-${defs.length}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(n); return `url(#${n[1].id})` }
  const deep = g('linearGradient', { x1: 5, y1: 6, x2: 18, y2: 14 }, [stop(0, V.c1, 0.75), stop(1, V.shadow, 0.85)])
  const strapG = g('linearGradient', { x1: 3, y1: 9, x2: 21, y2: 20 }, [stop(0, V.c1), stop(1, V.shadow)])
  const ink = { fill: 'none', stroke: V.etch, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  const hair = { stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.4 }
  // shoulder straps and the carry loop: violet glass bands; the straps wrap round the body's sides, the loop sits behind
  const strap = { fill: 'none', stroke: strapG, 'stroke-width': 1.5, 'stroke-linecap': 'round', class: 'wm-k' }
  const straps = [
    ['path', { d: T('M6.75 9.25 C4.5 10.25 3.4 12.5 3.4 15 V19.25'), ...strap }],
    ['path', { d: T('M17.25 9.25 C19.5 10.25 20.6 12.5 20.6 15 V19.25'), ...strap }],
  ]
  const loop = ['path', { d: T('M10.1 7 V5 C10.1 3.95 10.95 3.1 12 3.1 C13.05 3.1 13.9 3.95 13.9 5 V7'), ...strap, 'stroke-width': 1.35 }]
  const marks = [
    // the flap: deeper violet glass over the top of the body, its lower edge a soft smile
    ['path', { d: T('M5 12 C5 8.96 7.46 6.5 10.5 6.5 H13.5 C16.54 6.5 19 8.96 19 12 C16.5 13 14.5 13.5 12 13.5 C9.5 13.5 7.5 13 5 12 Z'), fill: deep, ...hair, class: 'wm-a' }],
    ['path', { d: T('M6.4 9.4 C7.2 7.95 8.7 7.15 10.5 7.15 H12'), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.7, 'stroke-width': 0.4, 'stroke-linecap': 'round', class: 'wm-shine' }],
    // buckle: an accent tab where the flap closes
    ['path', { d: rr(10.9, 12.6, 13.1, 15.6, 0.8), fill: V.accent, ...hair, class: 'wm-a' }],
    // front pocket: a clear frosted lens with an etch zip across its top
    ['path', { d: rr(8.25, 16.25, 15.75, 20, 1.25), fill: V.frost, 'fill-opacity': 0.8, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.4, class: 'wm-a' }],
    ['path', { d: T('M9.6 17.6 H14.4'), ...ink, 'stroke-width': 0.7, 'stroke-opacity': 0.8, class: 'wm-a' }],
  ]
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  out.splice(rim >= 0 ? rim : out.length, 0, ...marks)
  const back = out.findIndex(n => n[1].class !== 'wm-shadow')
  out.splice(back, 0, loop)
  const pane = out.findIndex(n => n[1].stroke === 'currentColor' && n[1]['stroke-width'] === 0.5)
  out.splice(pane + 1, 0, ...straps)
  return [['defs', {}, defs], ...out]
}
