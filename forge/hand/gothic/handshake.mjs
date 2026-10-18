// forge/hand/gothic/handshake.mjs: two glazed cuffs (ruby left, sapphire right) and a carved stone clasp,
// four finger bumps wrapped front-left and the thumb laid over, carved finger seams.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { cut as sub } from '../../styles/_gothic-prim.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'
const out = (parts, icon) => paint(enamel(parts.flat(Infinity).filter(Boolean), icon))

const HANDS = 'M7.3 9.4 L10.6 8.8 C12.6 8.3 14.6 9.7 16.8 9.1 L18.4 13.2 L17.4 14.6 A1.1 1.1 0 0 1 15.9 16.3 A1.1 1.1 0 0 1 14.3 17.9 C13.4 18.9 12.6 19.4 11.8 19.3 L11 19.2 A1.15 1.15 0 0 1 9.3 18.1 A1.15 1.15 0 0 1 7.6 16.7 A1.15 1.15 0 0 1 5.9 15.1 L4.9 13.9 Z'
export default function render(icon) {
  const seams = g.union(
    g.stroke('M8.4 11.6 C7.9 12.6 9.6 13.3 11 11.9 L12.2 10.9 L17.4 14.6', 0.6),
    g.seg(7.6, 16.7, 9.2, 14.7, 0.55), g.seg(9.3, 18.1, 10.9, 16, 0.55), g.seg(11, 19.2, 12.5, 17.2, 0.55), g.seg(15.9, 16.3, 13.8, 14.9, 0.55))
  const hands = sub(g.path(HANDS), seams)
  return out([
    g.stone(hands),
    g.pane(g.path('M5 7 L7.5 8.5 L4.5 14.5 L2 13 Z'), 'c1', { frame: 0.75, tracery: 'none', plate: 'A' }),
    g.pane(g.path('M16.5 8.5 L19 7 L22 13 L19.5 14.5 Z'), 'c2', { frame: 0.75, tracery: 'none' }),
  ], icon)
}
