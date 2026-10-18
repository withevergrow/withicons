// forge/hand/coquette/panel-bottom.mjs — a cream window with a deep rose bottom pane under a firm wine seam, and a small
// bow tied on the top corner away from the pane, so the bottom panel holds at 16px; the generated drawing split the page
// with a thin lace seam in near-equal pinks and tied its bow on the pane's outline, where it fought the edge.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  const win = k.rr(2.8, 3.6, 21.2, 20.4, 2.6)
  return paint([[
    k.cream(win),
    k.rose(k.inter(win, k.rect(0, 14.2, 24, 24)), { plate: 'K' }),
    k.ink(k.inter(win, k.tube('M2 14.2 H22', 1.1)), 0),
    k.bow(4.4, 4.6, 0.5, -18),
  ]].flat(Infinity).filter(Boolean))
}
