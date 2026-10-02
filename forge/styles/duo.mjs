// DUO — universal. Line on top of the icon's mass at 20%. The tint defaults to
// currentColor, and can be recoloured with --with-duo without touching the line.
//
// Parts (forge/MOTION.md "Parts choreography"): lines carry their plate like Line
// (wm-a / wm-s, K untagged). A tone fill takes the plate whose centrelines its
// outline follows, so a moving part's tint moves with it.
import { distToPolyline } from '../kernel/geom.mjs'
import { PLATE_CLASS } from './line.mjs'

// the plate a fill belongs to: the A or S plate when most of its outline runs along
// that plate's centrelines (within 0.4u) and closer than along K; otherwise K
function fillPlate(f, lines) {
  const pts = f.subs.flatMap(s => s.pts)
  if (!pts.length) return 'K'
  const share = plate => {
    const ls = lines.filter(l => l.plate === plate && l.pts.length)
    if (!ls.length) return 0
    return pts.filter(p => ls.some(l => distToPolyline(p, l.pts, l.closed) < 0.4)).length / pts.length
  }
  const k = share('K')
  let best = 'K', bestShare = 0.6
  for (const pl of ['A', 'S']) { const s = share(pl); if (s > bestShare && s > k) { best = pl; bestShare = s } }
  return best
}

export default {
  name: 'duo',
  title: 'Duo',
  kind: 'universal',
  description: 'The line drawing over a soft tonal fill of the object\'s mass. Recolour the tone with --with-duo.',
  strokeWidth: 1.75,
  root: { fill: 'none', stroke: 'currentColor', 'stroke-width': 1.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
  render(icon) {
    const parted = icon.paths.some(p => PLATE_CLASS[p.plate])
    const tone = icon.fills.map(f => {
      const a = { d: f.d, fill: 'var(--with-duo, currentColor)', 'fill-opacity': 0.2, stroke: 'none', 'fill-rule': 'evenodd' }
      const cls = parted ? PLATE_CLASS[fillPlate(f, icon.lines || [])] : null
      if (cls) a.class = cls
      return ['path', a]
    })
    return [...tone, ...icon.paths.map(p => ['path', PLATE_CLASS[p.plate] ? { d: p.d, class: PLATE_CLASS[p.plate] } : { d: p.d }])]
  },
}
