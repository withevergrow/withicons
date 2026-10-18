// forge/hand/gothic/panel-left-close.mjs: the common collapse-sidebar panel: a stone window frame split by a carved
// mullion into a narrow gold-glass sidebar strip (leaded into nav rows) and a wide sapphire pane carrying a bold gilded
// left chevron (the moving part); the arched stained-glass window and brick column of the generated drawing are gone.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const outer = g.rr(2.6, 3, 21.4, 21, 2.2)
  const inner = g.shrink(outer, 1.5)
  return paint([
    g.glass(g.inter(inner, g.rect(0, 0, 8.9, 24)), 'c3', { outline: 0, glint: false, glow: 0.22, tracery: [[[3.6, 8.2], [7.7, 8.2]], [[3.6, 11.4], [7.7, 11.4]], [[3.6, 14.6], [7.7, 14.6]]] }),
    g.glass(g.inter(inner, g.rect(8.9, 0, 24, 24)), 'c2', { outline: 0, tracery: 'none', glow: 0.2, dark: 0.3 }),
    g.stone(g.union(g.rim(outer, 1.5), g.rect(8.25, 3.4, 9.75, 20.6))),
    g.gilt(g.stroke([[18.1, 8], [14, 12], [18.1, 16]], 2.4), { plate: 'A' }),
  ])
}
