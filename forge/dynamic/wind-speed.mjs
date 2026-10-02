// Live icon: wind speed — two gusts (the static `wind` curls, compressed into the top band) over the speed.
// The unit (KT, MPH, KM/H, M/S, BFT) is set smaller (cap 4) on the number's baseline, the way a dashboard prints
// "25 kt". When number + unit cannot share the line ("12 MPH", "40 KM/H"), the gusts fold into one long gust at the
// top and the unit gets its own row under the number, so a unit you pick is always shown.
import { text, measure, live } from './_font.mjs'
import { firstFit } from './_parts-weather.mjs'
import { snap } from './_layout.mjs'
import { fitLabel } from './_parts-labels.mjs'

const UNITS = { none: '', kt: 'KT', mph: 'MPH', kmh: 'KM/H', ms: 'M/S', bft: 'BFT' }
// short upper gust curling up at x 9.5, long lower gust curling up at x 17 (clear of the upper one's curl)
const GUST_A = 'M3 7 H9.5 A2.5 2.5 0 1 0 7.25 4.5'
const GUST_K = 'M3 11.5 H17 A2.75 2.75 0 1 0 14.5 8.75'
// the stacked layout: one long gust (curl on the right) over two text rows
const GUST_1 = 'M3 6.5 H17 A2.25 2.25 0 1 0 14.75 4.25'
const NUM2 = { x0: 3, y0: 9.75, x1: 21, y1: 14.75 }, UNIT2 = { x0: 3, y0: 17.25, x1: 21, y1: 21.5 }

export default live({
  name: 'wind-speed', title: 'Wind speed', category: 'weather',
  description: 'Wind speed written under two curling gusts, with an optional unit such as KT or MPH.',
  aliases: ['windspeed', 'wind-gust', 'wind-strength', 'anemometer', 'breeze-speed', 'gust-speed', 'wind-meter'],
  tags: ['weather', 'wind', 'speed', 'live'],
  synonyms: ['windy', 'gale', 'breeze', 'knots', 'beaufort', 'mph', 'km/h', 'sailing', 'storm warning', 'air speed'],
  params: {
    speed: { type: 'int', min: 0, max: 999, default: 12, label: 'Speed' },
    unit: { type: 'enum', options: Object.keys(UNITS), default: 'none', label: 'Unit' },
  },
  examples: [
    { speed: 12, unit: 'none' },
    { speed: 0, unit: 'none' },
    { speed: 999, unit: 'none' },
    { speed: 25, unit: 'kt' },
    { speed: 5, unit: 'ms' },
    { speed: 40, unit: 'kmh' },
  ],
  // what the icon writes: the speed and the unit you picked, always
  shows: p => String(p.speed) + (UNITS[p.unit] || ''),
  build({ speed = 12, unit = 'none' }) {
    const n = String(Math.max(0, Math.min(999, Math.round(Number(speed) || 0))))
    const u = UNITS[unit] || ''
    let glyphs = null
    if (u) {
      // largest number cap (6 -> 5) that leaves room for the unit at cap 4 on the same baseline
      for (const cap of [6, 5.5, 5]) {
        const wn = measure(n, { size: cap }).width, wu = measure(u, { size: 4 }).width, gap = 3
        if (wn + gap + wu > 19.5) continue
        const x = snap(12 - (wn + gap + wu) / 2), base = 21.25
        glyphs = [...text(n, { x, y: base, size: cap, align: 'left', valign: 'baseline' }).paths,
          ...text(u, { x: snap(x + wn + gap), y: base, size: 4, align: 'left', valign: 'baseline' }).paths]
        break
      }
    }
    if (!glyphs && u) {
      const a = fitLabel(n, NUM2, { minCap: 4.5, maxCap: 4.75 }), b = a && fitLabel(u, UNIT2, { minCap: 4, maxCap: 4 })
      if (a && b) return {
        paths: [{ d: GUST_1, plate: 'K' }, ...[...a.paths, ...b.paths].map(d => ({ d, plate: 'A' }))],
        fills: [], cutouts: [],
      }
    }
    if (!glyphs) glyphs = firstFit([n], { x0: 3, y0: 15.5, x1: 21, y1: 21.5 }, { prefer: 'small', maxCap: 6, minCap: 4.5 })?.paths || []
    return {
      paths: [
        { d: GUST_A, plate: 'A' },
        { d: GUST_K, plate: 'K' },
        ...glyphs.map(d => ({ d, plate: 'A' })),
      ],
      fills: [],
      cutouts: [],
    }
  },
})
