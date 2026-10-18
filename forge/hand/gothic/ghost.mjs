// forge/hand/gothic/ghost.mjs: the friendly sheet ghost as a pale limestone body with a scalloped hem, deep sapphire-lit
// eye sockets and an oval mouth, a ruby-lit mouth and a candle-lit highlight; the generated drawing framed it as an
// arched window.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const BODY = g.path('M4.5 20.2 V10 A7.5 7.5 0 0 1 19.5 10 V20.2 C19.5 21.6 18 21.9 17.2 20.8 C16.6 19.9 15.4 19.9 14.8 20.8 C14.2 21.9 13 21.9 12.4 20.8 L12 20.2 L11.6 20.8 C11 21.9 9.8 21.9 9.2 20.8 C8.6 19.9 7.4 19.9 6.8 20.8 C6 21.9 4.5 21.6 4.5 20.2 Z')
  const parts = [
    g.stone(BODY),
    g.recess(g.ellipse(9.2, 10, 1.2, 1.9), { glow: 'c2', plate: 'A' }),
    g.recess(g.ellipse(14.8, 10, 1.2, 1.9), { glow: 'c2', plate: 'A' }),
    g.recess(g.ellipse(12, 14.6, 1.3, 1.7), { glow: 'c1', glowOp: 0.4 }),
    g.shine(g.stroke('M6.6 11 C6.6 8.6 8 6.4 10 5.4', 0.7), { op: 0.8 }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
