// forge/hand/gothic/message-circle-more.mjs — the round speech bubble as one clear sapphire glass pane in a stone
// frame with three big gilt beads of gold glass; the generated drawing filled the bubble with a quarry diamond grid
// that fought the three dots and blurred the bubble into a patterned disc at 16px.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const BUBBLE = 'M8 19.4 A9.1 9.1 0 1 0 4.6 16 L2.4 21.6 Z'

export default function render() {
  const dots = [[8, 11.5], [12.5, 11.5], [17, 11.5]]
  const parts = [
    ...g.pane(g.path(BUBBLE), 'c2', { frame: 1.6, tracery: 'none', glass: { glow: 0.2 } }),
    g.gilt(g.union(...dots.map(([x, y]) => g.circle(x, y, 1.75))), { plate: 'A', glint: false }),
    g.glass(g.union(...dots.map(([x, y]) => g.circle(x, y, 1.05))), 'c3', { plate: 'A', outline: 0.22, glow: 0.34, glint: false }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
