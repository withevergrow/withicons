// forge/hand/gothic/app-window.mjs: a plain application window: a limestone frame whose top band is the title bar,
// three jewelled dots (ruby, gold, emerald) set in it, and a sapphire glass body below; the generated oven-door
// diamond mesh is gone.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const outer = g.rr(2, 4, 22, 20, 2.4)
  const body = g.inter(g.shrink(outer, 1.3), g.rect(0, 10.2, 24, 24))
  return paint([
    g.stone(outer),
    g.glass(body, 'c2', { outline: 0.3, tracery: 'none', dark: 0.4, glow: 0.18 }),
    ...g.bead(5.9, 7.1, 1.25, 'c1', { plate: 'A' }),
    ...g.bead(9.9, 7.1, 1.25, 'c3', { plate: 'A' }),
    ...g.bead(13.9, 7.1, 1.25, 'c4', { plate: 'A' }),
  ].flat(Infinity).filter(Boolean))
}
