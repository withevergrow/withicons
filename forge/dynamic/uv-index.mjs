// Live icon: UV index — the number written inside a sun. The disc is grown to r 6.5 so two digits fit at
// cap 4-5; the eight rays sit on the 22.5-degree diagonals, where they can reach r 10.5 inside the live area.
import { text, fitText, asCutouts, live } from './_font.mjs'
import { sun } from './_parts-weather.mjs'
import { parsePath } from '../kernel/geom.mjs'

const R = 6.5, INNER = R - 2.25 // every glyph point within 4.25u of the centre: >= 0.5u white to the disc at line
// the largest cap (then slightly tighter) whose glyph points ALL stay inside INNER: a box fit lets the square foot
// of a "2" run into the round disc
function fitDisc(s) {
  for (let cap = 5; cap >= 4; cap -= 0.25) {
    for (const tracking of [0, -0.25]) {
      const t = text(s, { x: 12, y: 12, size: cap, tracking })
      const pts = t.paths.flatMap(d => parsePath(d, 0.05).flatMap(sb => sb.pts))
      if (pts.every(([x, y]) => Math.hypot(x - 12, y - 12) <= INNER + 1e-9)) return t
    }
  }
  return fitText(s, { x0: 8, y0: 9.5, x1: 16, y1: 14.5 }, { prefer: 'small', maxCap: 5, minCap: 4 })
}

const ANGLES = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5]

export default live({
  name: 'uv-index', title: 'UV index', category: 'weather',
  description: 'The UV index (0 to 11 and above) written inside a rayed sun.',
  aliases: ['uv', 'ultraviolet', 'uv-level', 'sun-index', 'uv-meter', 'uv-risk', 'sunburn-risk'],
  tags: ['weather', 'sun', 'health', 'level', 'live'],
  synonyms: ['sunscreen', 'spf', 'sun protection', 'sun strength', 'uv rays', 'radiation', 'sunburn', 'tan', 'uv forecast', 'extreme sun'],
  params: {
    index: { type: 'int', min: 0, max: 20, default: 6, label: 'UV index' },
  },
  examples: [{ index: 6 }, { index: 0 }, { index: 1 }, { index: 11 }, { index: 14 }, { index: 20 }],
  build({ index = 6 }) {
    const n = Math.max(0, Math.min(20, Math.round(Number(index) || 0)))
    const s = sun({ cx: 12, cy: 12, r: R, rIn: 9.5, rOut: 10.5, angles: ANGLES })
    const t = fitDisc(String(n))
    const text = t ? t.paths : []
    return {
      paths: [
        { d: s.disc, plate: 'K' },
        ...s.rays.map(d => ({ d, plate: 'A' })),
        ...text.map(d => ({ d, plate: 'A' })),
      ],
      fills: [s.disc],
      cutouts: asCutouts(text),
    }
  },
})
