// forge/hand/gothic/panel-bottom.mjs: the common square panel with its bottom third split off: a stone frame, a clear
// sapphire window above, a carved transom, and a gold glass tray below leaded into console rows (the old drawing
// was an arched brick scene that hid the split).
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const outer = g.rr(2.6, 3, 21.4, 21, 2.2)
  const inner = g.shrink(outer, 1.5)
  return paint([
    g.glass(g.inter(inner, g.rect(0, 0, 24, 14.6)), 'c2', { outline: 0, tracery: 'none', dark: 0.4, glow: 0.18 }),
    g.glass(g.inter(inner, g.rect(0, 14.6, 24, 24)), 'c3', { outline: 0, glint: false, glow: 0.22, tracery: [[[3.6, 17.2], [20.4, 17.2]], [[3.6, 19.2], [14.6, 19.2]]] }),
    g.stone(g.union(g.rim(outer, 1.5), g.rect(3.4, 14.25, 20.6, 15.75))),
  ])
}
