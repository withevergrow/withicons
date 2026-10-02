// Live icon: a gauge. A 210° dial, a needle pointing at value / max, and the reading written under the hub.
import { live } from './_font.mjs'
import { fitLabel } from './_parts-labels.mjs'
import { arc, polar, circle, snap } from './_layout.mjs'
import { clamp01 } from './_parts-progress.mjs'

const CX = 12, CY = 11, R = 9      // dial: top of the ring at y 2, ends at (3.3, 13.35) and (20.7, 13.35)
const A0 = -105, A1 = 105          // sweep, clock degrees (0 = up): the needle never points down into the reading
const HUB = 1.25

export default live({
  name: 'gauge-value', title: 'Gauge with value', category: 'charts',
  description: 'A dial whose needle points at the value you set, with the reading written under the hub.',
  aliases: ['speedometer-value', 'meter-reading', 'dial-value', 'gauge-reading', 'score-gauge', 'speed-gauge', 'kpi-gauge', 'tachometer-value'],
  tags: ['gauge', 'meter', 'dial', 'score', 'performance'],
  synonyms: ['speed', 'speedometer', 'meter', 'score', 'credit score', 'health score', 'performance', 'speed test', 'rpm', 'pressure', 'fuel', 'usage', 'quota', 'capacity', 'load', 'kpi', 'metric', 'reading', 'needle', 'level'],
  params: {
    value: { type: 'int', min: 0, max: 999, default: 72, label: 'Value' },
    max: { type: 'int', min: 1, max: 999, default: 100, label: 'Scale maximum' },
    reading: { type: 'bool', default: true, label: 'Show the value' },
  },
  examples: [
    { value: 0, max: 100, reading: true },
    { value: 7, max: 10, reading: true },
    { value: 72, max: 100, reading: true },
    { value: 180, max: 240, reading: true },
    { value: 100, max: 100, reading: true },
    { value: 35, max: 100, reading: false },
  ],
  build({ value, max, reading }) {
    const t = clamp01(value / Math.max(1, max))
    const a = A0 + (A1 - A0) * t
    // without a reading the hub drops to the classic gauge position and the needle grows
    const cy = reading ? CY : 12.5, len = reading ? 6 : 6.5
    const dial = arc(CX, cy, R, A0, A1)
    const [hx, hy] = [CX, cy]
    const [tx, ty] = polar(hx, hy, len, a)
    const [sx, sy] = polar(hx, hy, HUB + 0.75, a)
    const needle = `M${sx} ${sy} L${tx} ${ty}`
    const hub = circle(hx, hy, HUB)
    const paths = [{ d: dial, plate: 'K' }, { d: needle, plate: 'A' }, { d: hub, plate: 'A' }]
    // the dial's mass: the arc closed by a shallow V under the hub
    const fills = [`${dial} L${CX} ${snap(cy + 2.5)} Z`]
    const cutouts = [needle, circle(hx, hy, HUB + 0.5)]
    if (reading) {
      const s = String(Math.max(0, Math.round(value)))
      // centred under the hub; a wide reading ("202", "888") may use the full width between the dial's feet
      // (3.25u under their ink) and slightly tighter tracking, so every value 0..999 keeps all of its digits
      const tx = fitLabel(s, { x0: 6, y0: 16.5, x1: 18, y1: 21.5 }, { minCap: 4.5, maxCap: 5 })
        || fitLabel(s, { x0: 3.5, y0: 16.75, x1: 20.5, y1: 21.5 }, { minCap: 4, maxCap: 5 })
      if (tx) paths.push(...tx.paths.map(d => ({ d, plate: 'A' })))
      // the reading sits below the dial's mass, so it needs no cutout
    }
    return { paths, fills, cutouts }
  },
})
