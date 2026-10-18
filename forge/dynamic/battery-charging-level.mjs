// Live icon: a charging battery showing its level, the bolt plugged into its terminal end.
// Same language as the static `battery-charging` (the bolt breaks the body), moved to the terminal end so the
// level bar keeps two-thirds of the body.
import { chargeBar, levelEdge } from './_parts-power.mjs'
import { rr } from './_layout.mjs'
import { live } from './_font.mjs'

// A whole battery (no wall opened for the bolt) with the charging bolt standing at its terminal end, in the
// terminal's place: the battery family's body (_parts-power.mjs H) shortened to 13u, the bolt clear of the wall.
const BODY = rr(2, 6.5, 14.5, 17.5, 2.5)
const BOLT = 'M21.5 3.5 L16.75 13 H19.75 L18 20.5 L22 10.75 H19 Z' // a closed bolt (the static zap's shape): filled in every filled style
const INNER = rr(3, 7.5, 13.5, 16.5, 1.5)
const BAR = { x0: 4.75, x1: 11.75, y0: 9.25, y1: 14.75 } // the H family's bar, 2.75u inside the walls

export default live({
  name: 'battery-charging-level', title: 'Charging battery level', category: 'devices',
  description: 'A charging battery with a lightning bolt at its terminal end and a fill showing the current level.',
  aliases: ['charging-level', 'battery-charging-fill', 'charge-progress', 'charging-status', 'battery-bolt-level', 'live-charging'],
  tags: ['battery', 'charging', 'bolt', 'level', 'power', 'live'],
  synonyms: ['charging', 'plugged in', 'fast charge', 'charge progress', 'battery charging', 'recharging',
    'power bank', 'ev charging', 'electric', 'energy', 'charge level', 'charger connected'],
  params: {
    level: { type: 'level', default: 0.55, label: 'Charge' },
  },
  examples: [{ level: 1 }, { level: 0.55 }, { level: 0.2 }, { level: 0.02 }, { level: 0 }],
  build({ level }) {
    // the bolt is a solid silhouette in every style (outline styles fill a "solid:" mark), like a phone's charging bolt
    const paths = [{ d: BODY, plate: 'K' }, { d: BOLT, plate: 'S', id: 'solid:bolt' }]
    const holes = []
    if (level > 0) {
      const c = chargeBar(BAR.x0, BAR.y0, Math.max(BAR.x0 + 2, levelEdge(BAR.x0, BAR.x1, level)), BAR.y1)
      paths.push({ d: c.d, plate: 'A' }); holes.push(c.region)
    }
    return { paths, fills: [BODY, BOLT], cutouts: [[INNER, ...holes].join(' ')] }
  },
})
