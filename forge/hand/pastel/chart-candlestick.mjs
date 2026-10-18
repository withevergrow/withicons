// pastel chart-candlestick: three separate candles, slim ink wicks that run past compact pastel bodies (mint up, blush down).
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr, seg2 } = Prim
  return compose([
    ['ink@A', seg2(5, 6, 5, 18.5, 1.6), seg2(12, 2.5, 12, 15.5, 1.6), seg2(19, 8, 19, 21, 1.6)],
    ['mint@K', rr(2.5, 9, 7.5, 15, 1.5), rr(16.5, 11, 21.5, 17.5, 1.5)],
    ['blush@K', rr(9.5, 5.3, 14.5, 12, 1.5)],
  ], icon)
}
