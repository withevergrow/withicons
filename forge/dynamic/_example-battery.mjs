// TEST generator (underscore = not shipped): a battery showing its charge as a number, "%" when it fits.
import { fitText, asCutouts, live } from './_font.mjs'
import { rr, levelWidth } from './_layout.mjs'

const BODY = 'M4 6 H17 A2 2 0 0 1 19 8 V16 A2 2 0 0 1 17 18 H4 A2 2 0 0 1 2 16 V8 A2 2 0 0 1 4 6 Z'

export default live({
  name: 'example-battery', title: 'Battery percent (example)', category: 'devices',
  description: 'Test generator: a battery with its charge written inside.',
  aliases: ['example-charge', 'example-battery-level', 'example-power'], tags: ['battery', 'power'],
  synonyms: ['charge'],
  params: {
    level: { type: 'int', min: 0, max: 100, default: 80, label: 'Charge (%)' },
    percent: { type: 'bool', default: true, label: 'Show the % sign' },
  },
  examples: [{ level: 5, percent: true }, { level: 42, percent: true }, { level: 80, percent: true }, { level: 100, percent: true }, { level: 64, percent: false }],
  // what the icon writes (check-dynamic compares it with the drawn glyphs): a fallback that changes the text,
  // like the bar at 100 here, must be declared, or the check fails
  shows: p => (p.level >= 100 ? '' : p.percent ? [p.level + '%', String(p.level)] : String(p.level)),
  build({ level, percent }) {
    // body is 1u taller than the static battery's (6..18) to give the number a cap of 5
    const box = { x0: 5, y0: 8.5, x1: 16, y1: 15.5 }
    const n = String(level)
    const t = (percent && fitText(n + '%', box, { prefer: 'small', minCap: 4.5 })) || fitText(n, box, { prefer: 'small', minCap: 4 })
    const text = t ? t.paths : []
    // no legible fit (e.g. "100" in this body): show the level as a bar instead of shrinking text
    const bar = t ? [] : [rr(5, 9, levelWidth(5, 16, level / 100, 1), 15, 1)]
    return {
      paths: [
        { d: BODY, plate: 'K' },
        { d: 'M22 10.5 V13.5', plate: 'A' },
        ...text.map(d => ({ d, plate: 'A' })),
        ...bar.map(d => ({ d, plate: 'A' })),
      ],
      fills: [BODY],
      cutouts: [...asCutouts(text), ...bar],
    }
  },
})
