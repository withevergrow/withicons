// forge/hand/luxe/file-search.mjs — the sapphire page with its gold fold and a polished gold magnifier whose handle is
// a real gold bar (the generated one engraved it as a dark slot) and whose lens is light glass over the enamel, not a
// dark well, so the lens reads as a magnifier on the navy page at 16px. Built with the Luxe recipe (_luxe-core build).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, col } from '../../styles/_luxe-core.mjs'

const G = {
  paths: [
    { d: 'M14 2.5 H7 A2 2 0 0 0 5 4.5 V19.5 A2 2 0 0 0 7 21.5 H17 A2 2 0 0 0 19 19.5 V7.5 Z', plate: 'K' },
    { d: 'M14 2.5 V6 A1.5 1.5 0 0 0 15.5 7.5 H19', plate: 'A' },
    { d: 'M14.75 13.25 A3.5 3.5 0 1 1 7.75 13.25 A3.5 3.5 0 1 1 14.75 13.25 Z', plate: 'A' },
    { d: 'M13.9 15.9 L16.25 18.25', plate: 'A' },
  ],
  fills: ['M14 2.5 H7 A2 2 0 0 0 5 4.5 V19.5 A2 2 0 0 0 7 21.5 H17 A2 2 0 0 0 19 19.5 V7.5 Z'],
  cutouts: ['M14 2.5 V6 A1.5 1.5 0 0 0 15.5 7.5 H19'],
}

function prep(name) {
  const paths = G.paths.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const fills = G.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(x => x.pts)) } })
  const cutouts = G.cutouts.map(d => ({ d, subs: parsePath(d) }))
  const lines = paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id })))
  return { name, paths, fills, cutouts, lines }
}

// lens centre in drawing space (Luxe scales 0.9 about 12 and shifts up-left)
const CX = (11.25 - 12) * 0.9 + 12 - 0.45, CY = (13.25 - 12) * 0.9 + 12 - 0.75
const r2 = v => Math.round(v * 100) / 100
const disc = (cx, cy, r) => `M${r2(cx - r)} ${r2(cy)}a${r} ${r} 0 1 0 ${r2(2 * r)} 0a${r} ${r} 0 1 0 ${r2(-2 * r)} 0z`

export default function render(icon) {
  const out = build(prep(icon.name))
  // glass: a pale cool wash over the enamel inside the ring, and a crisp glint at its upper left
  out.push(['path', { d: disc(CX, CY, 1.8), fill: col('edge'), 'fill-opacity': '.42', class: 'wm-a' }])
  out.push(['path', { d: `M${r2(CX - 1.12)} ${r2(CY + 0.2)}a1.12 1.12 0 0 1 1.32 -1.3l-.12 .5a.62 .62 0 0 0 -.7 .72z`, fill: col('shine'), 'fill-opacity': '.9', class: 'wm-shine' }])
  return out
}
