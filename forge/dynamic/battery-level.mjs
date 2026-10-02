// Live icon: a battery whose fill shows any charge level. Low charge turns into a "!" warning shape.
import { H, slab, levelEdge, bang, bangHoles } from './_parts-power.mjs'
import { live } from './_font.mjs'

export default live({
  name: 'battery-level', title: 'Battery level', category: 'devices',
  description: 'A battery filled to the charge level you choose; at low charge the fill gives way to a warning mark.',
  aliases: ['battery-fill', 'battery-meter', 'battery-gauge', 'charge-meter', 'live-battery', 'battery-state', 'power-meter'],
  tags: ['battery', 'charge', 'level', 'power', 'status', 'live'],
  synonyms: ['battery life', 'remaining charge', 'low battery', 'full battery', 'half battery', 'empty battery',
    'battery warning', 'power level', 'energy', 'capacity', 'phone battery', 'laptop battery', 'charge indicator'],
  params: {
    level: { type: 'level', default: 0.7, label: 'Charge' },
    warnAt: { type: 'int', min: 0, max: 50, default: 15, label: 'Show a warning at or below (%) — 0 turns it off' },
  },
  examples: [{ level: 1 }, { level: 0.7 }, { level: 0.35 }, { level: 0.1 }, { level: 0.1, warnAt: 0 }, { level: 0 }],
  build({ level, warnAt }) {
    const paths = [{ d: H.body, plate: 'K' }, { d: H.terminal, plate: 'A' }]
    const holes = []
    const pct = Math.round(level * 100)
    if (warnAt > 0 && pct <= warnAt) {
      // warning shape instead of a sliver: a "!" in the middle of the empty body
      for (const d of bang(10.5, 9.25, 12.25, 15)) paths.push({ d, plate: 'S' })
      holes.push(...bangHoles(10.5, 9.25, 12.25, 15))
    } else if (level > 0) {
      const s = H.slab, x1 = Math.max(s.x0, levelEdge(s.x0, s.x1, level))
      const b = slab(s.x0, s.y0, x1, s.y1)
      paths.push({ d: b.d, plate: 'A' }); holes.push(b.region)
    }
    return { paths, fills: [H.body], cutouts: [[H.inner, ...holes].join(' ')] }
  },
})
