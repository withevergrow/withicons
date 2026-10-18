// forge/hand/liquid/volume-1.mjs — a speaker in denser clear glass with one heavy violet sound wave. The generator's
// speaker was the palest glass in the family and its single 2.3u wave thinned to a hairline crescent at 16px, so the
// icon read as a faint blob; the speaker glass here carries more c1 tint and the wave is a 3.2u glass crescent with a
// wider sweep. Same model and paint as the generator (_liquid-core.mjs); only the geometry and the body tint are set
// here. The wave is the A part (wm-a), so it still fills in.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

// a prepared skeleton in the shape model() expects: lines, fills (subs), cutouts (subs)
function skeleton(name, parts, cuts = []) {
  const lines = [], fills = []
  for (const p of parts) {
    const subs = parsePath(p.d)
    if (p.line !== false) for (const s of subs) lines.push({ pts: s.pts, closed: s.closed, plate: p.plate || 'K' })
    if (p.fill) fills.push({ subs })
  }
  return { name, paths: [], lines, fills, cutouts: cuts.map(d => ({ subs: parsePath(d) })) }
}

const SPEAKER = 'M10.6 5.2 A1.1 1.1 0 0 1 12.5 6 L12.5 18 A1.1 1.1 0 0 1 10.6 18.8 L7.2 16 L3.6 16 A1.6 1.6 0 0 1 2 14.4 L2 9.6 A1.6 1.6 0 0 1 3.6 8 L7.2 8 L10.6 5.2 Z'
// a heavy crescent around (12.5, 12), r 4.2..6, swept over +-42 degrees; the glass stroke grows it to ~2.6u+
const WAVE = 'M15.62 9.19 A4.2 4.2 0 0 1 15.62 14.81 L16.96 16.01 A6 6 0 0 0 16.96 7.99 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'volume-1'
  const out = build(skeleton(name, [
    { d: SPEAKER, plate: 'K', fill: true },
    { d: WAVE, plate: 'A', fill: true },
  ]))
  // denser clear glass for the small speaker (gradient 0 is the K body)
  const defs = out && out[0] && out[0][0] === 'defs' ? out[0][2] : []
  const g0 = defs.find(g => g[1].id === 'wg-liquid-' + name + '-0')
  if (g0) g0[2] = [
    ['stop', { offset: 0, 'stop-color': 'var(--with-liquid-c1, #4A9DFF)', 'stop-opacity': 0.26 }],
    ['stop', { offset: 0.6, 'stop-color': 'var(--with-liquid-c1, #4A9DFF)', 'stop-opacity': 0.52 }],
    ['stop', { offset: 1, 'stop-color': 'var(--with-liquid-c1, #4A9DFF)', 'stop-opacity': 0.8 }],
  ]
  return out
}
