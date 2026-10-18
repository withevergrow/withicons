// forge/hand/clay/motorcycle.mjs — a clay motorbike drawn from a clay-only skeleton: two fat tyres (r 3.6) with a small
// pressed hub dimple, one heavy smooth body (seat deck, tank hump, engine block down between the wheels) joined to the
// rear wheel by a swingarm, a gold seat cushion pressed on top and a gold fork with a handlebar crossbar, run through
// the clay light recipe (_clay-core build) so it keeps the family's wall, rim, glow and ground shadow. Replaces the
// generated drawing, where the inflated wheel discs and the body trapezoid fused into one lump.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'
import { build, ellD } from '../../styles/_clay-core.mjs'
import { colorsFor } from '../../styles/_clay-color.mjs'
import { K } from '../../styles/_clay-model.mjs'

const disc = (x, y, r) => `M${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}Z`
const RX = 5.2, FX = 18.8, WY = 17.6

// one heavy mass: rear deck under the seat, tank hump rising to the fork, engine block down between the wheels
const BODY = 'M2.4 10.6 C2.4 9.9 2.9 9.4 3.6 9.4 H9.6 C10.2 9.4 10.7 9 11.1 8.4 C11.8 7.4 12.8 6.9 13.9 6.9 ' +
  'C15.3 6.9 16.2 7.8 16.2 9.1 C16.2 9.9 15.9 10.6 15.4 11.1 V13.4 C15.4 14 14.9 14.5 14.3 14.5 H9.6 ' +
  'C9 14.5 8.6 14.1 8.6 13.5 V12.6 C8.6 12.2 8.3 11.9 7.9 11.9 H3.6 C2.9 11.9 2.4 11.4 2.4 10.6 Z'

const RAW = {
  paths: [
    // tyres: thick clay tubes round the discs, the hub left as a small dimple
    { d: disc(RX, WY, 2.3), plate: 'K' },
    { d: disc(FX, WY, 2.3), plate: 'K' },
    // tank and engine: smooth open tubes just inside the body edge, so the body fuses as one blue clay mass
    { d: 'M11.4 9 C12 8 12.9 7.5 13.9 7.5 C15 7.5 15.6 8.2 15.6 9.1 C15.6 9.8 15.3 10.4 14.8 10.9', plate: 'K' },
    { d: 'M9.6 13.9 H14.4', plate: 'K' },
    // swingarm: the rear wheel hangs from the frame
    { d: `M${RX} ${WY} L8.9 13.4`, plate: 'K' },
    // seat cushion, fork and handlebar: gold clay tubes
    { d: 'M3.4 10 H9.8', plate: 'A' },
    { d: `M${FX} ${WY} L16.6 7.8 L16.1 4.6 M13.8 4.9 L18 4.1`, plate: 'A' },
  ],
  fills: [disc(RX, WY, 3.6), disc(FX, WY, 3.6), BODY],
  cutouts: [],
}

function prep(name) {
  const paths = RAW.paths.map((p, i) => ({ id: `p${i}`, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const fills = RAW.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = RAW.cutouts.map(d => ({ d, subs: parsePath(d) }))
  return {
    name, category: 'travel', paths, fills, cutouts,
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: fills.length ? unionSets(fills.map(f => f.set)) : [],
  }
}

const r2 = n => Math.round(n * 100) / 100

export default function render(icon) {
  const sk = prep((icon && icon.name) || 'motorcycle')
  const nodes = build(sk)
  if (!nodes) return nodes
  // pale hubcaps pressed into each tyre, placed through the model's own transform (as on car)
  const { col } = colorsFor(sk)
  const tf = (x, y) => [r2((x - 12) * K.SCALE + 12 + K.TX), r2((y - 12) * K.SCALE + 12 + K.TY)]
  for (const x of [RX, FX]) {
    const [cx, cy] = tf(x, WY)
    nodes.push(['path', { d: ellD(cx + 0.1, cy + 0.14, 0.9, 0.9), fill: col('shadow'), 'fill-opacity': 0.3, class: 'wm-k' }])
    nodes.push(['path', { d: ellD(cx, cy, 0.88, 0.88), fill: col('tint'), class: 'wm-k' }])
  }
  return nodes
}
