// forge/hand/pastel/globe.mjs — the pastel globe: a sky sphere carrying the line design's grid in soft sky ink (a
// meridian ellipse, the vertical axis and the equator) so it reads as a globe at 16px; the generated one hid the grid
// under blobby mint continents.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { paintEntries } from '../../styles/_pastel-paint.mjs'

export default function render(icon) {
  const { circle, ellipse, cut, seg2, unite } = Prim
  const w = 1.1
  const meridian = cut(ellipse(12, 12, 4.6 + w / 2, 9 + w / 2), ellipse(12, 12, 4.6 - w / 2, 9 - w / 2))
  const E = entriesOf([
    ['sky@K', circle(12, 12, 9.75)],
    ['ink@A', unite(meridian, seg2(12, 3.25, 12, 20.75, w), seg2(3.25, 12, 20.75, 12, w))],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  // the grid prints in the sky's soft deep tone (the edge role), not the darker ink, to match the sibling outlines
  return paintEntries(E, { glint: true }).map(([tag, a, ...rest]) =>
    a && a.class === 'wm-a' && typeof a.fill === 'string' && a.fill.startsWith('var(--with-pastel-ink')
      ? [tag, { ...a, fill: 'var(--with-pastel-edge, #7DAEEA)' }, ...rest]
      : [tag, a, ...rest])
}
