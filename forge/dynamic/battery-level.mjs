// Live icon: a battery whose fill shows any charge level. Low charge turns into a "!" warning shape.
import { H, chargeBar, levelEdge, bang, bangHoles } from './_parts-power.mjs'
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
    const b = H.bar
    if (warnAt > 0 && pct <= warnAt) {
      // warning: the empty body carries a "!" (stem and dot), a low charge never reads as a sliver of nothing
      for (const d of bang(10.75, 9.25, 12.25, 14.75)) paths.push({ d, plate: 'A' })
      holes.push(...bangHoles(10.75, 9.25, 12.25, 14.75))
    } else if (level > 0) {
      // at least a 2u stub, so 1% still shows a charge
      const x1 = Math.max(b.x0 + 2, levelEdge(b.x0, b.x1, level))
      const c = chargeBar(b.x0, b.y0, x1, b.y1)
      paths.push({ d: c.d, plate: 'A' }); holes.push(c.region)
    }
    return { paths, fills: [H.body], cutouts: [[H.inner, ...holes].join(' ')] }
  },
})
