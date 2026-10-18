// Live icon: a battery with its charge written inside ("5%", "42", ...). 100 shows a full bar.
import { asCutouts, live } from './_font.mjs'
import { H, chargeBar } from './_parts-power.mjs'
import { fitFirst } from './_parts-labels.mjs'

// centreline box for the number inside H.body: 2.9u inside the walls
const BOX = { x0: 4.9, y0: 9.4, x1: 16.6, y1: 14.6 }

export default live({
  name: 'battery-percent', title: 'Battery percentage', category: 'devices',
  description: 'A battery with its charge written inside as a number (set percent to add the % sign where it fits).',
  aliases: ['battery-percentage', 'battery-number', 'battery-text', 'charge-percent', 'battery-readout', 'percent-battery'],
  tags: ['battery', 'charge', 'percent', 'number', 'status', 'live'],
  synonyms: ['battery life', 'battery %', 'percentage', 'remaining charge', 'charge level', 'power level',
    'phone battery', 'laptop battery', 'status bar', 'capacity', 'low battery', 'full battery'],
  params: {
    level: { type: 'level', steps: 100, default: 0.8, label: 'Charge (0-1, or "80%"), written as a percentage' },
    percent: { type: 'bool', default: false, label: 'Add the % sign where it fits' },
  },
  examples: [{ level: 1 }, { level: 0.8 }, { level: 0.42 }, { level: 0.07 }, { level: 0 }, { level: 0.09, percent: true }],
  build({ level, percent }) {
    const pc = Math.round(Math.max(0, Math.min(1, Number(level) || 0)) * 100)
    const paths = [{ d: H.body, plate: 'K' }, { d: H.terminal, plate: 'A' }]
    const cutouts = [], holes = []
    // 100 does not fit legibly at cap >= 4.5: a full bar says "full" better than squeezed digits
    const n = String(pc)
    // the bare number, like a phone's status bar (a number in a battery reads as percent); with `percent`, a
    // full-size "%" where it fits in the regular cut (a condensed "80%" crowds the cell)
    const f = pc < 100 && ((percent && fitFirst([n + '%'], BOX, { minCap: 4.5, maxCap: 5.5, condense: [1] })) || fitFirst([n], BOX, { minCap: 4.25, maxCap: 5.75 }))
    const t = f && f.t
    if (t) {
      for (const d of t.paths) paths.push({ d, plate: 'A' })
      cutouts.push(...asCutouts(t.paths))
    } else {
      // 100: a full bar says "full" better than squeezed digits
      const b = H.bar, c = chargeBar(b.x0, b.y0, b.x1, b.y1)
      paths.push({ d: c.d, plate: 'A' }); holes.push(c.region)
    }
    return { paths, fills: [H.body], cutouts: holes.length ? [[H.inner, ...holes].join(' ')] : cutouts }
  },
})
