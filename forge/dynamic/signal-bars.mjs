// Live icon: cellular signal strength, 0-4 bars. Unlit bars stay as dotted ghosts so "2 of 4" reads without colour.
import { BARS, BASE, dotsOnLine, cross } from './_parts-power.mjs'
import { rr } from './_layout.mjs'
import { live } from './_font.mjs'

export default live({
  name: 'signal-bars', title: 'Signal strength', category: 'devices',
  description: 'Four rising signal bars with as many lit as you choose; the rest stay as dotted ghosts.',
  aliases: ['signal-level', 'signal-strength-bars', 'reception-bars', 'cell-bars', 'network-strength', 'live-signal', 'bars-level'],
  tags: ['signal', 'cellular', 'reception', 'network', 'level', 'live'],
  synonyms: ['phone signal', 'cell service', 'coverage', 'no service', 'weak signal', 'full bars', 'one bar',
    'mobile network', 'connection quality', 'antenna', 'carrier', 'reception strength'],
  params: {
    bars: { type: 'int', min: 0, max: 4, default: 3, label: 'Bars lit' },
    ghost: { type: 'bool', default: true, label: 'Show unlit bars as dots' },
    noSignal: { type: 'bool', default: true, label: 'Cross at zero bars' },
  },
  examples: [{ bars: 4 }, { bars: 3 }, { bars: 1 }, { bars: 0 }, { bars: 2, ghost: false }],
  build({ bars, ghost, noSignal }) {
    const paths = [], fills = []
    BARS.forEach((b, i) => {
      if (i < bars) {
        paths.push({ d: `M${b.x} ${BASE} V${b.top}`, plate: 'K' })
        fills.push(rr(b.x - 1, b.top - 1, b.x + 1, BASE + 1, 1))
      } else if (ghost) {
        for (const d of dotsOnLine(b.x, BASE, b.x, b.top, 5)) paths.push({ d, plate: 'A' })
      }
    })
    if (bars === 0 && noSignal) for (const d of cross(6, 7, 2.5)) paths.push({ d, plate: 'S' })
    // nothing lit and no ghosts: keep a baseline so the icon never disappears
    if (!paths.length) paths.push({ d: `M${BARS[0].x} ${BASE} H${BARS[3].x}`, plate: 'A' })
    return { paths, fills, cutouts: [] }
  },
})
