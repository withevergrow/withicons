// forge/hand/coquette/sidebar.mjs — one cream window split by a full-height wine divider into a deep rose left rail with
// cream nav lines and an open cream content area, built like its sibling panel-bottom, with a small bow on the rail's
// top corner; the earlier drawing inset a cream pane in a blush frame and read as a tablet or TV.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  const win = k.rr(2.8, 3.6, 21.2, 20.4, 2.6)
  return paint([[
    k.cream(win),
    k.rose(k.inter(win, k.rect(0, 0, 9.5, 24)), { plate: 'K' }),
    k.ink(k.inter(win, k.tube('M9.5 2 V22', 1.1)), 0),
    k.fill(k.tube('M4.9 10 H7.4 M4.9 12.6 H7.4 M4.9 15.2 H7.4', 1.3), 'c4'),
    k.bow(4.4, 4.6, 0.5, -18),
  ]].flat(Infinity).filter(Boolean))
}
