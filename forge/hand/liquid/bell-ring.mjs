// forge/hand/liquid/bell-ring.mjs — a ringing bell in liquid glass: a clear domed bell with a flared lip and a small
// knob, a violet clapper bead under the lip and two bold accent ring marks that curve around the bell on each side.
// The generated drawing had a vague, shapeless bell and ring marks that were tiny ticks floating away from it; here
// the lip flares crisply, the clapper is a round bead (not a smile) and the ring arcs are long and sit tight to the
// dome. Same model and light as the generator (_liquid-core.mjs); only the geometry is drawn.
// Motion: bell wm-k, clapper wm-a (parts.A swings a beat behind), ring marks wm-s (parts.S flickers).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

// a skeleton in the shape the liquid model expects: parts [{ d, plate, fill }], cutouts [d]
function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const disc = (x, y, r) => `M${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}Z`

// the bell (K): a dome that flares to a wide lip, flat underneath
const BELL = 'M5.6 17C7.1 15.8 7.7 13.5 7.7 10.7A4.3 4.3 0 0 1 16.3 10.7C16.3 13.5 16.9 15.8 18.4 17Z'
// the knob on top (K)
const KNOB = 'M12 4.6V6.3'
// the clapper (A): a bead under the lip
const CLAPPER = disc(12, 20, 1.5)
// the ring marks (S): long arcs hugging the dome on both sides (radius 8.6 about the bell's middle)
const RINGS = 'M3.6 10.6A8.6 8.6 0 0 1 6.6 4.6M20.4 10.6A8.6 8.6 0 0 0 17.4 4.6'

export default function render(icon) {
  const name = (icon && icon.name) || 'bell-ring'
  return build(skeleton(name, [
    { d: BELL, plate: 'K', fill: true },
    { d: KNOB, plate: 'K' },
    { d: CLAPPER, plate: 'A', fill: true },
    { d: RINGS, plate: 'S' },
  ]))
}
