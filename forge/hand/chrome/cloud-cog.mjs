// forge/hand/chrome/cloud-cog.mjs — a polished chrome cloud with a round bay cut in its underside, and a hot-pink
// enamel cog with six chunky teeth and a hub hole turning in that bay, a clear gap all round. The generated cog
// pressed into the cloud's belly so the two fused into one blob, and its eight fine teeth swelled into a flower;
// the bay keeps the parts apart and six teeth stay teeth at 16px.
// Same model and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

const TOP = 'M4.89 14.97A4.5 4.5 0 0 1 6.2 6.6A6.2 6.2 0 0 1 18.1 7.1A4.25 4.25 0 0 1 19.25 15'
// the cloud's mass, its underside scooped by a bay round the cog
const CLOUD = 'M4.89 14.97A4.5 4.5 0 0 1 6.2 6.6A6.2 6.2 0 0 1 18.1 7.1A4.25 4.25 0 0 1 19.25 15L17.59 15A6.25 6.25 0 0 0 6.91 15Z'
// the cog, drawn as its centreline: a hub ring, six radial teeth, a small hub hole (the jewel's own width does the rest)
const CX = 12.25, CY = 18.25  // lands on the spin origin (12, 17) after the style's placement
const r2 = v => Math.round(v * 100) / 100
const RING = `M${CX + 2.1} ${CY}A2.1 2.1 0 1 1 ${CX - 2.1} ${CY}A2.1 2.1 0 1 1 ${CX + 2.1} ${CY}Z`
const HUB = `M${CX + 0.45} ${CY}A0.45 0.45 0 1 1 ${CX - 0.45} ${CY}A0.45 0.45 0 1 1 ${CX + 0.45} ${CY}Z`
const TEETH = [0, 1, 2, 3, 4, 5].map(k => {
  const a = (k * 60 + 30) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a)
  return `M${r2(CX + 2.3 * c)} ${r2(CY + 2.3 * s)}L${r2(CX + 3.6 * c)} ${r2(CY + 3.6 * s)}`
}).join('')

function skeleton(name) {
  const paths = [
    { id: 'p0', d: TOP, plate: 'K' }, { id: 'p1', d: RING, plate: 'S' },
    { id: 'p2', d: TEETH, plate: 'S' }, { id: 'p3', d: HUB, plate: 'S' },
  ].map(p => ({ ...p, subs: parsePath(p.d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  return {
    name, paths, fills: [fill(CLOUD)], cutouts: [],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'cloud-cog'
  const Ls = layers(model(skeleton(name)))
  return emit(Ls, name, 0)
}
