// Live icon: a progress ring. The arc grows clockwise from 12 o'clock; the rest of the track is dotted;
// the percentage sits in the middle (a check mark at 100).
import { asCutouts, live } from './_font.mjs'
import { arc, circle, polar } from './_layout.mjs'
import { fitInCircle, checkMark, dot } from './_parts-progress.mjs'

const CX = 12, CY = 12, R = 9.5   // circle keyline, like check-circle / circle
const DISC = 7                    // inner mass for the filled styles: 1.5u clear of the ring's ink

export default live({
  name: 'progress-ring', title: 'Progress ring', category: 'status',
  description: 'A circular progress indicator: the ring fills clockwise to the percentage written inside it.',
  aliases: ['progress-circle', 'circular-progress', 'radial-progress', 'completion-ring', 'percent-ring', 'progress-donut', 'activity-ring', 'goal-ring'],
  tags: ['progress', 'percent', 'completion', 'status', 'goal'],
  synonyms: ['progress', 'percentage', 'complete', 'completion', 'done', 'loading', 'upload progress', 'download progress', 'goal', 'target', 'achievement', 'quota', 'usage', 'storage', 'how far', 'remaining', 'kpi', 'donut chart'],
  params: {
    value: { type: 'int', min: 0, max: 100, default: 68, label: 'Progress (%)' },
    number: { type: 'bool', default: true, label: 'Show the number' },
    track: { type: 'bool', default: true, label: 'Show the remaining track' },
  },
  examples: [
    { value: 0, number: true, track: true },
    { value: 8, number: true, track: true },
    { value: 68, number: true, track: true },
    { value: 99, number: true, track: true },
    { value: 100, number: true, track: true },
    { value: 40, number: false, track: false },
  ],
  // what the icon writes: the percentage, or a check mark (no text) when complete
  shows: p => (p.number && p.value < 100 ? String(p.value) : ''),
  build({ value, number, track }) {
    const v = Math.max(0, Math.min(100, Math.round(value)))
    const end = v * 3.6
    const paths = [], cutouts = []
    // the progress arc: a full closed ring at 100, a short tick at very small values so 1–2% still shows
    if (v >= 100) paths.push({ d: circle(CX, CY, R), plate: 'K' })
    else if (v > 0) paths.push({ d: arc(CX, CY, R, 0, Math.max(end, 6)), plate: 'K' })
    // the remaining track: dots every 30°, starting a clear step past the arc's round cap
    if (track && v < 100) {
      const first = v > 0 ? Math.max(end, 6) + 22 : 0
      for (let a = Math.ceil(first / 30) * 30; a < 360 - (v > 0 ? 14 : 0); a += 30) {
        const [x, y] = polar(CX, CY, R, a)
        paths.push({ d: dot(x, y), plate: 'A' })
      }
    }
    // centre: the number (shrinks to fit a 5.25u circle), or a check mark when complete
    let inner = []
    if (number) {
      if (v >= 100) inner = [checkMark(CX - 0.25, CY, 0.95)]
      else { const t = fitInCircle(String(v), CX, CY, 5.25, { minCap: 4.5 }); if (t) inner = t.paths }
    }
    paths.push(...inner.map(d => ({ d, plate: 'A' })))
    cutouts.push(...asCutouts(inner))
    // 0% with no track and no number: fall back to the dotted track so the icon is never empty
    if (!paths.length) for (let a = 0; a < 360; a += 30) { const [x, y] = polar(CX, CY, R, a); paths.push({ d: dot(x, y), plate: 'A' }) }
    // the inner disc carries the number in the filled styles; without a number the ring stands alone
    return { paths, fills: inner.length ? [circle(CX, CY, DISC)] : [], cutouts }
  },
})
