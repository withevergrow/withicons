// Live icon: a battery with its charge written inside ("5%", "42", ...). 100 shows a full bar.
import { fitText, asCutouts, live } from './_font.mjs'
import { H, slab } from './_parts-power.mjs'

// centreline box for the number inside H.body: wall ink + 1.5u white + text ink (font guidance)
const BOX = { x0: 5.5, y0: 9.5, x1: 15.5, y1: 14.5 }

export default live({
  name: 'battery-percent', title: 'Battery percentage', category: 'devices',
  description: 'A battery with its charge written inside as a number, with the % sign whenever it fits.',
  aliases: ['battery-percentage', 'battery-number', 'battery-text', 'charge-percent', 'battery-readout', 'percent-battery'],
  tags: ['battery', 'charge', 'percent', 'number', 'status', 'live'],
  synonyms: ['battery life', 'battery %', 'percentage', 'remaining charge', 'charge level', 'power level',
    'phone battery', 'laptop battery', 'status bar', 'capacity', 'low battery', 'full battery'],
  params: {
    level: { type: 'level', steps: 100, default: 0.8, label: 'Charge (0-1, or "80%"), written as a percentage' },
    percent: { type: 'bool', default: true, label: 'Add the % sign when it fits' },
  },
  examples: [{ level: 1 }, { level: 0.8 }, { level: 0.42 }, { level: 0.07 }, { level: 0 }, { level: 0.09, percent: false }],
  build({ level, percent }) {
    const pc = Math.round(Math.max(0, Math.min(1, Number(level) || 0)) * 100)
    const paths = [{ d: H.body, plate: 'K' }, { d: H.terminal, plate: 'A' }]
    const cutouts = [], holes = []
    // 100 does not fit legibly at cap >= 4.5: a full bar says "full" better than squeezed digits
    const n = String(pc)
    const t = pc < 100 && ((percent && fitText(n + '%', BOX, { prefer: 'small', minCap: 4.5 })) || fitText(n, BOX, { prefer: 'small', minCap: 4.5 }))
    if (t) {
      for (const d of t.paths) paths.push({ d, plate: 'A' })
      cutouts.push(...asCutouts(t.paths))
    } else {
      const s = H.slab, b = slab(s.x0, s.y0, s.x1, s.y1)
      paths.push({ d: b.d, plate: 'A' }); holes.push(b.region)
    }
    return { paths, fills: [H.body], cutouts: holes.length ? [[H.inner, ...holes].join(' ')] : cutouts }
  },
})
