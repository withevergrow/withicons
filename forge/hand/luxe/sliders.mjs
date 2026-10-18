// forge/hand/luxe/sliders.mjs — three sapphire tracks crossed by chunky polished-gold bar knobs at staggered
// positions, sitting in front of the tracks (the generated hairline gold strokes hid behind them and read as thorns).
// Built with the Luxe recipe (_luxe-core build) in two passes: the enamel tracks, then the gold knobs over them.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_luxe-core.mjs'

const rr = (x, y, w, h, r) => `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} H${x + r} A${r} ${r} 0 0 1 ${x} ${y + h - r} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`
const TRACKS = ['M3 6 H21', 'M3 12 H21', 'M3 18 H21']
const KNOBS = [rr(14.5, 3, 3, 6, 1.5), rr(6.5, 9, 3, 6, 1.5), rr(11.5, 15, 3, 6, 1.5)]

function prep(name, paths, fills) {
  const ps = paths.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const fs = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(x => x.pts)) } })
  const lines = ps.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id })))
  return { name, paths: ps, fills: fs, cutouts: [], lines }
}

export default function render(icon) {
  const tracks = build(prep(icon.name, TRACKS.map(d => ({ d, plate: 'K' })), []))
  const knobs = build(prep(icon.name, KNOBS.map(d => ({ d, plate: 'A' })), KNOBS))
  return [...tracks, ...knobs.map(n => n[0] === 'path' && n[1].class === 'wm-k' ? [n[0], { ...n[1], class: 'wm-a' }] : n)]
}
