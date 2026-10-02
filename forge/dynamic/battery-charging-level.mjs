// Live icon: a charging battery showing its level, the bolt plugged into its terminal end.
// Same language as the static `battery-charging` (the bolt breaks the body), moved to the terminal end so the
// level bar keeps two-thirds of the body.
import { slab, levelEdge } from './_parts-power.mjs'
import { live } from './_font.mjs'

const BOLT = 'M20.5 3.5 L16.5 12 H20.5 L16.5 20.5'
// the body: a C open towards the bolt; wall ends sit >= 1.5u of white from the bolt
const WALL = 'M15 6 H4 A2 2 0 0 0 2 8 V16 A2 2 0 0 0 4 18 H13.5'
const FILL = 'M15 6 H4 A2 2 0 0 0 2 8 V16 A2 2 0 0 0 4 18 H13.5 L13 12 Z'
const INNER = 'M4 7 H15 V17 H4 A1 1 0 0 1 3 16 V8 A1 1 0 0 1 4 7 Z'
const S = { x0: 6, x1: 13, y0: 10, y1: 14 } // slab right edge stays 1.5u of white from the bolt's elbow

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
    const paths = [{ d: WALL, plate: 'K' }, { d: BOLT, plate: 'S' }]
    const holes = []
    if (level > 0) {
      const b = slab(S.x0, S.y0, Math.max(S.x0, levelEdge(S.x0, S.x1, level)), S.y1)
      paths.push({ d: b.d, plate: 'A' }); holes.push(b.region)
    }
    return { paths, fills: [FILL], cutouts: [[INNER, ...holes].join(' ')] }
  },
})
