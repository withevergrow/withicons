// forge/hand/liquid/radar.mjs: the radar scope of line as translucent glass: a clear glass disc, with a thin c2 glass ring
// and the filled sweep wedge from a violet hub laid over it (a second glass pass, wm-a, so the sweep can move), instead of
// the generated power-symbol stroke. Same glass recipe as the generator (_liquid-core build).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const NAME = 'radar'
const DISC = 'M21.5 12 A9.5 9.5 0 1 1 2.5 12 A9.5 9.5 0 1 1 21.5 12 Z'
// ring r 5..6.2 (even-odd annulus), the wedge from -5deg to -105deg (r 8), the hub
const RING = 'M18.2 12 A6.2 6.2 0 1 1 5.8 12 A6.2 6.2 0 1 1 18.2 12 Z M17 12 A5 5 0 1 0 7 12 A5 5 0 1 0 17 12 Z'
const WEDGE = 'M12 12 L19.97 11.3 A8 8 0 0 0 9.93 4.27 Z'
const HUB = 'M13.7 12 A1.7 1.7 0 1 1 10.3 12 A1.7 1.7 0 1 1 13.7 12 Z'
// blip in the wedge
const BLIP = 'M18.33 6.49 A1.7 1.7 0 1 1 14.93 6.49 A1.7 1.7 0 1 1 18.33 6.49 Z'

const prep = (name, paths, fills) => ({
  name, paths: [], cutouts: [],
  lines: paths.flatMap(([d, plate]) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))),
  fills: fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }),
})

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  const disc = build(prep(name, [[DISC, 'K']], [DISC]))
  const defs = [], body = []
  // one glass pass per part: the ring (static, wm-k), the sweep wedge + hub (wm-a, moves), the blip (accent bead, wm-s)
  const layer = (fills, plate, cls, off) => {
    const ren = v => String(v).replace(new RegExp(`wg-liquid-${name}-([0-9]+)`, 'g'), (_, n) => `wg-liquid-${name}-${+n + off}`)
    const line = { pts: [[-8, -8], [-7, -8]], closed: false, plate }
    for (const n of build({ ...prep(name, [], fills), lines: [line] })) {
      if (n[0] === 'defs') { for (const g of n[2]) defs.push([g[0], { ...g[1], id: ren(g[1].id) }, g[2]]); continue }
      const at = { ...n[1] }
      if (at.class === 'wm-shadow') continue
      if (at.fill) at.fill = ren(at.fill)
      if (at.stroke) at.stroke = ren(at.stroke)
      if (at.class !== 'wm-shine') at.class = cls
      body.push([n[0], at])
    }
  }
  layer([RING], 'A', 'wm-k', 6)
  layer([WEDGE, HUB], 'A', 'wm-a', 12)
  layer([BLIP], 'S', 'wm-s', 18)
  const used = new Set(body.flatMap(n => [n[1].fill, n[1].stroke]).map(v => (String(v).match(/#([^)]+)\)/) || [])[1]).filter(Boolean))
  return [['defs', {}, [...disc[0][2], ...defs.filter(g => used.has(g[1].id))]], ...disc.slice(1), ...body]
}
