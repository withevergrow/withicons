// forge/hand/gothic/layout-dashboard.mjs: four carved stone tiles at the new skeleton's uneven sizes (a large sapphire
// quarry pane, a small gold pane, a tall sapphire lancet pane, a short ruby strip) so it no longer reads as an even grid.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  return paint([
    ...g.pane(g.rr(2.6, 2.6, 12.2, 13.2, 1.6), 'c2', { frame: 1.3, tracery: 'quarry', glass: { medallion: false, s: 2.7 } }),
    ...g.pane(g.rr(15.6, 2.6, 21.4, 7.8, 1.5), 'c3', { frame: 1.2, tracery: 'none' }),
    ...g.pane(g.rr(15.6, 11.2, 21.4, 21.4, 1.5), 'c2', { frame: 1.2, tracery: [[[0, 16.3], [24, 16.3]]], glass: { dark: 0.36 } }),
    ...g.pane(g.rr(2.6, 16.6, 12.2, 21.4, 1.5), 'c1', { frame: 1.2, tracery: 'none', glass: { glint: false } }),
  ])
}
