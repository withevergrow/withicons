// forge/hand/liquid/chart-candlestick.mjs: three wide, well-spaced candles with thick wicks: two clear glass up candles
// and one accent glass down candle. The generated candles were thin, faint and crowded.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

const box = (x0, y0, x1, y1, r = 0.8) =>
  `M${x0 + r} ${y0} H${x1 - r} A${r} ${r} 0 0 1 ${x1} ${y0 + r} V${y1 - r} A${r} ${r} 0 0 1 ${x1 - r} ${y1} H${x0 + r} A${r} ${r} 0 0 1 ${x0} ${y1 - r} V${y0 + r} A${r} ${r} 0 0 1 ${x0 + r} ${y0} Z`
const wick = (x, y0, y1) => box(x - 0.95, y0, x + 0.95, y1, 0.9)
const C = [
  { x: 4.6, y0: 8, y1: 16, w0: 4.8, w1: 19.4, p: 'K' },
  { x: 12, y0: 4.5, y1: 13, w0: 2, w1: 16.4, p: 'S' },
  { x: 19.4, y0: 10, y1: 18.5, w0: 7, w1: 21.6, p: 'K' },
]

export default function render(icon) {
  const ls = [], fs = []
  for (const c of C) {
    ls.push(...lines(box(c.x - 1.3, c.y0 + 1.4, c.x + 1.3, c.y1 - 1.4, 0.5), c.p))
    fs.push(fill(box(c.x - 2.9, c.y0, c.x + 2.9, c.y1, 1)), fill(wick(c.x, c.w0, c.w1)))
  }
  return build({ name: (icon && icon.name) || 'chart-candlestick', paths: [], lines: ls, fills: fs, cutouts: [] }) || []
}
