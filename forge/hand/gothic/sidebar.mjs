// forge/hand/gothic/sidebar.mjs: a stone window frame split by a carved mullion into a narrow gold glass rail
// (leaded into nav rows) and a wide rectangular sapphire pane, so the panel-with-divider shape stays dominant.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const outer = g.rr(2.6, 3, 21.4, 21, 2.2)
  const inner = g.shrink(outer, 1.5)
  return paint([
    g.glass(g.inter(inner, g.rect(0, 0, 9.2, 24)), 'c3', { outline: 0, glint: false, glow: 0.22, tracery: [[[3, 8.4], [9.4, 8.4]], [[3, 12], [9.4, 12]], [[3, 15.6], [9.4, 15.6]]] }),
    g.glass(g.inter(inner, g.rect(9.2, 0, 24, 24)), 'c2', { outline: 0, tracery: 'quarry', medallion: false, s: 2.9 }),
    g.stone(g.union(g.rim(outer, 1.5), g.rect(8.55, 3.4, 10.05, 20.6))),
  ])
}
