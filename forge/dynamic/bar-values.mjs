// Live icon: a mini bar chart with 3–5 bars whose heights you set. Bars get slimmer as you add more, so the
// white between them never drops below 2u; they stand on an optional baseline.
import { snap, live } from './_font.mjs'

const X0 = 3.5, X1 = 20.5      // bar centreline span (outer bars' ink reaches the 3/21 square keyline)
const BASE = 20.5, TOP = 4     // baseline and the top of a full bar
const lvl = (label, d) => ({ type: 'level', default: d, steps: 20, label })

function bar(cx, w, top, bottom) {
  // a bar of centreline width w (0 = a single stroke); stroke 2 + round joins give it rounded corners
  const f = n => String(snap(n))
  if (w <= 0) return `M${f(cx)} ${f(bottom)} V${f(top)}`
  const x0 = cx - w / 2, x1 = cx + w / 2
  return `M${f(x0)} ${f(bottom)} V${f(top)} H${f(x1)} V${f(bottom)} Z`
}

export default live({
  name: 'bar-values', title: 'Bar chart values', category: 'charts',
  description: 'A small bar chart with three to five bars whose heights you choose.',
  aliases: ['bar-chart-values', 'mini-bar-chart', 'column-values', 'sparkbars', 'bar-graph-values', 'histogram-values', 'stats-bars'],
  tags: ['chart', 'bars', 'analytics', 'data', 'stats'],
  synonyms: ['chart', 'graph', 'bar chart', 'column chart', 'statistics', 'analytics', 'data', 'metrics', 'report', 'dashboard', 'sales', 'growth', 'trend', 'comparison', 'results', 'poll', 'kpi', 'insights', 'equalizer'],
  params: {
    bars: { type: 'int', min: 3, max: 5, default: 4, label: 'Number of bars' },
    bar1: lvl('Bar 1 height', 0.45),
    bar2: lvl('Bar 2 height', 0.75),
    bar3: lvl('Bar 3 height', 0.55),
    bar4: lvl('Bar 4 height', 1),
    bar5: lvl('Bar 5 height', 0.7),
    baseline: { type: 'bool', default: true, label: 'Show the baseline' },
  },
  examples: [
    { bars: 3, bar1: 0.35, bar2: 0.65, bar3: 1, bar4: 1, bar5: 0.7, baseline: true },
    { bars: 4, bar1: 0.45, bar2: 0.75, bar3: 0.55, bar4: 1, bar5: 0.7, baseline: true },
    { bars: 5, bar1: 0.2, bar2: 0.4, bar3: 0.6, bar4: 0.8, bar5: 1, baseline: true },
    { bars: 5, bar1: 1, bar2: 0, bar3: 0.05, bar4: 0.5, bar5: 0.25, baseline: false },
    { bars: 4, bar1: 0, bar2: 0, bar3: 0, bar4: 0, bar5: 0, baseline: true },
  ],
  build(p) {
    const n = Math.max(3, Math.min(5, Math.round(p.bars)))
    const pitch = (X1 - X0) / (n - 1)
    // ink width = pitch - 2u white, capped at 3.5: a centreline width of 1.5 stays closed even
    // under line's 1.75 stroke, so bars always read solid, never as hollow outlines
    const w = Math.max(0, Math.min(1.5, snap(pitch - 4, 0.5)))
    const inset = w / 2
    const xs = Array.from({ length: n }, (_, i) => snap(X0 + inset + (X1 - X0 - 2 * inset) * i / (n - 1), 0.25))
    const bottom = p.baseline ? BASE - 3 : BASE   // with a baseline, bars stop 1u of white above it (the gap reads as the axis)
    const span = bottom - TOP
    const paths = [], fills = []
    xs.forEach((cx, i) => {
      const v = Math.max(0, Math.min(1, p['bar' + (i + 1)]))
      // zero still shows a stub so the slot reads as "no value", never as a missing bar
      const top = snap(bottom - Math.max(w > 0 ? 0.5 : 0.25, span * v), 0.25)
      const d = bar(cx, w, top, bottom)
      paths.push({ d, plate: 'K' })
      if (w > 0) fills.push(d)
    })
    if (p.baseline) paths.push({ d: `M3 ${BASE} H21`, plate: 'A' })
    return { paths, fills, cutouts: [] }
  },
})
