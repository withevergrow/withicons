// forge/hand/gothic/backpack.mjs — the new skeleton's backpack: a small gilded top loop, a sapphire glass bag whose
// flap is leaded off along the skeleton's curve with a gilt clasp, side straps in stone and a gold glass front pocket;
// the old drawing's peaked body read as a house or shed.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render(icon) {
  const role = g.mainRole(icon)
  const BODY = g.path('M7 21.5 H17 A2 2 0 0 0 19 19.5 V12 A5.5 5.5 0 0 0 13.5 6.5 H10.5 A5.5 5.5 0 0 0 5 12 V19.5 A2 2 0 0 0 7 21.5 Z')
  const ABOVE = g.path('M0 0 H24 V11.4 C16.5 12.6 14.5 13.1 12 13.1 C9.5 13.1 7.5 12.6 0 11.4 Z')
  const IN = g.shrink(BODY, 1.3)
  const parts = [
    g.gilt(g.stroke('M10.2 7 V4.8 A1.8 1.8 0 0 1 13.8 4.8 V7', 1.4), { plate: 'A' }),
    ...g.pane(BODY, role, { frame: 1.3, tracery: 'lancet', glass: { s: 2.6 } }),
    g.glass(g.inter(IN, ABOVE), role, { outline: 0.4, tracery: 'none', deep: 0.2 }),
    g.stone(g.union(g.rr(6.2, 11.6, 7.8, 20.4, 0.6), g.rr(16.2, 11.6, 17.8, 20.4, 0.6)), { thin: true }),
    g.gilt(g.rr(11, 11.8, 13, 14.6, 0.5), { thin: true, glint: false, plate: 'A' }),
    ...g.pane(g.rr(8.8, 15.6, 15.2, 19.4, 1.2), 'c3', { frame: 1, tracery: 'none', plate: 'A' }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
