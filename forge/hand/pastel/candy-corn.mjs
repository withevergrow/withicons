// forge/hand/pastel/candy-corn.mjs — candy corn as three stacked soft bands on one rounded kernel: a butter base, a peach
// middle band and a cream tip, each band laid over the one below so its deeper bottom plane makes a ridge; the generated
// drawing was one pink cone crossed by lavender stripes and white gaps, so it read as a party hat, not candy corn.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, swatch, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (n, t = 0.85) => ({ ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) })

export default function render(icon) {
  const { path, clip } = Prim
  // the kernel: a broad rounded base tapering to a soft tip
  const kernel = path('M12 2.5 C13.75 2.5 14.75 3.9 15.5 5.75 L19.75 16.25 C20.75 19.5 17.25 21.5 12 21.5 C6.75 21.5 3.25 19.5 4.25 16.25 L8.5 5.75 C9.25 3.9 10.25 2.5 12 2.5 Z')
  // band edges bow downward, so the kernel reads round
  const aboveLow = path('M0 0 H24 V13.25 C18 16.25 6 16.25 0 13.25 Z')
  const aboveHigh = path('M0 0 H24 V7.75 C18 10.5 6 10.5 0 7.75 Z')
  const E = entriesOf([
    ['butter@K', kernel],
    ['peach@K', clip(kernel, aboveLow)],
    ['paper@K', clip(kernel, aboveHigh)],
  ], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E, {
    hues: {
      butter: deeper('butter'),
      peach: deeper('peach'),
      // a warm cream tip with a peach rim (the stock paper rim is a cool lavender)
      paper: { ...swatch('#FFFBF2', '#F2B48F', '#B4613D'), rim: '#F1BC9C' },
    },
    glint: true,
  })
}
