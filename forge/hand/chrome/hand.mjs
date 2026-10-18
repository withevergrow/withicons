// forge/hand/chrome/hand.mjs — a raised open hand in polished chrome: four rounded fingers standing apart on clean
// partings, a long thumb splayed up and out to the right on a clear notch, and a palm whose outer edge rounds into the
// pinky and tapers to the wrist. The generated drawing inflated the outline as a fat tube, so the fingers fused into a
// lumpy mitten; here the hand is drawn as its exact silhouette (no tube), the horizon is laid level through the
// mid-palm so the fingers flow into a pale upper palm and only the heel takes the dark ground, and the hand reads at
// 16px. Same model and paint as the generator (_chrome-core.mjs); only the geometry and the horizon are drawn here.
import { parsePath, area } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { model, layers, emit, col } from '../../styles/_chrome-core.mjs'

// fingers: capsules 3.1 wide on 1.0 partings running down into the palm (pinky, ring, middle, index), x 1.75..17.15
const finger = (x, top) => {
  const r = 1.55, cy = top + r
  return `M${x} 13.25V${cy}A${r} ${r} 0 0 1 ${x + 2 * r} ${cy}V13.25Z`
}
const FINGERS = [finger(1.75, 8), finger(5.85, 3.75), finger(9.95, 2.5), finger(14.05, 3.75)]
// thumb: a capsule (r 1.5) splayed about 40 degrees up and out, tip near (19.75, 12.35), x 1.75..21.25 overall; its upper edge meets the index
// finger low down, leaving an open V notch, and its root sinks into the palm
const THUMB = 'M20.71 13.5L16.76 16.81A1.5 1.5 0 0 1 14.84 14.51L18.79 11.2A1.5 1.5 0 0 1 20.71 13.5Z'
// palm: the outer edge runs straight down from the pinky, then rounds in and tapers to a narrow heel (x 8..13.5)
const PALM = 'M1.75 12.25H17.15V16.25C17.15 18.75 16.15 21.5 13.5 21.5H8C4.75 21.5 1.75 19 1.75 15.75Z'

function skeleton(name) {
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  return { name, paths: [], fills: [...FINGERS, THUMB, PALM].map(fill), cutouts: [], lines: [] }
}

// The generator lays the horizon at a fraction of each column's height, so on parted fingers it steps up and down at
// every parting like piano keys. A hand is one flat-ish plate: the horizon runs level through the mid-palm, below the
// thumb's root, so the fingers and upper palm stay sky and only the heel is ground (drawing units, after placement).
const HORIZON = [15.55, 16.55], GROUND = 15.85
const smooth = r => {
  const n = r.length
  if (n < 5) return r
  return r.map((p, i) => { const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4] })
}
const loopsOf = Fd => F.contour(F.copy(Fd)).filter(l => l.length > 2 && Math.abs(area(l)) >= 0.04).map(smooth)

export default function render(icon) {
  const name = (icon && icon.name) || 'hand'
  const Ls = layers(model(skeleton(name)))
  const sky = Ls.list.find(L => Array.isArray(L.fill) && L.fill[0] === 'sky')
  const ground = Ls.list.find(L => Array.isArray(L.fill) && L.fill[0] === 'ground')
  const ink = Ls.list.find(L => L.fill === col('ink'))
  if (sky && ground && ink) {
    const core = F.region(sky.loops, 0.7)
    const g = loopsOf(F.clipBand(F.copy(core), GROUND, 30))
    const h = loopsOf(F.clipBand(F.copy(core), HORIZON[0], HORIZON[1]))
    if (g.length && h.length) {
      ground.loops = g; ink.loops = h
      // the ramps follow the moved horizon: the sky reaches its mid tone at the horizon and the ground starts dark
      // right under it (as on every generated blob), instead of the ramps' default box fractions
      const [x0, y0, x1, y1] = sky.fill[1]
      sky.fill = ['sky', [x0, y0, x1, Math.round((y0 + (HORIZON[0] - y0) / 0.5) * 100) / 100]]
      ground.fill = ['ground', [x0, Math.round((y1 - (y1 - GROUND) / 0.44) * 100) / 100, x1, y1]]
    }
  }
  return emit(Ls, name, 0)
}
