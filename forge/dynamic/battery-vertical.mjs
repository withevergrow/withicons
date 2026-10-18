// Live icon: an upright battery that fills from the bottom; low charge shows a "!" warning shape.
import { V, chargeBar, levelEdge, bang, bangHoles } from './_parts-power.mjs'
import { live } from './_font.mjs'

export default live({
  name: 'battery-vertical', title: 'Battery level (upright)', category: 'devices',
  description: 'An upright battery that fills from the bottom to the charge you choose, with a warning mark when low.',
  aliases: ['battery-upright', 'battery-portrait', 'vertical-battery', 'battery-tall', 'standing-battery', 'battery-bottom-fill'],
  tags: ['battery', 'charge', 'level', 'power', 'status', 'live'],
  synonyms: ['battery life', 'remaining charge', 'low battery', 'full battery', 'empty battery', 'battery alert',
    'power level', 'energy', 'capacity', 'phone battery', 'aa battery', 'cell', 'charge indicator'],
  params: {
    level: { type: 'level', default: 0.6, label: 'Charge' },
    warnAt: { type: 'int', min: 0, max: 50, default: 15, label: 'Show a warning at or below (%) — 0 turns it off' },
  },
  examples: [{ level: 1 }, { level: 0.6 }, { level: 0.3 }, { level: 0.08 }, { level: 0.08, warnAt: 0 }, { level: 0 }],
  build({ level, warnAt }) {
    const paths = [{ d: V.body, plate: 'K' }, { d: V.terminal, plate: 'A' }]
    const holes = []
    const b = V.bar
    if (warnAt > 0 && Math.round(level * 100) <= warnAt) {
      // the empty body carries a full-height "!" (portrait has the room for a generous one)
      const g = [12, 8.5, 14, 18]
      for (const d of bang(...g)) paths.push({ d, plate: 'A' })
      holes.push(...bangHoles(...g))
    } else if (level > 0) {
      const top = Math.min(b.y1 - 2, levelEdge(b.y1, b.y0, level))
      const c = chargeBar(b.x0, top, b.x1, b.y1)
      paths.push({ d: c.d, plate: 'A' }); holes.push(c.region)
    }
    return { paths, fills: [V.body], cutouts: [[V.inner, ...holes].join(' ')] }
  },
})
