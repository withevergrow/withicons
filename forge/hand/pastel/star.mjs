// forge/hand/pastel/star.mjs — the pastel star: the exemplar's generously rounded butter star (tips r 1.1), a touch
// fuller in the body (inner radius 5.4) and ringed with a deeper 0.8 butter rim, because butter on white otherwise
// melts into the page; it now keeps a crisp silhouette at 24 and 16px while staying soft and calm.
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { star5 } from '../../styles/_pastel-kit.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()

export default function render(icon) {
  const E = entriesOf([
    ['butter@K', star5(12, 12.75, 10.75, 5.4, 1.1)],
  ], icon)
  for (const e of E) e.rim = 0.8
  // butter is the palest hue: its rim goes all the way to the deep tone
  return paintEntries(E, { hues: { butter: { ...HUES.butter, rim: mix(HUES.butter.base, HUES.butter.deep, 1) } }, glint: true })
}
