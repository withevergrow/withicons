// forge/hand/gothic/file-audio.mjs — the files exemplar's leaf in plain ruby glass (no quarry mesh) with its gilded
// dog-ear, carrying one large gilded music note (A) with a gold cabochon head; the generated leaf was a busy ruby
// quarry grid with a small note that dissolved into the mesh at 16px.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const PAGE = 'M6.5 2.5 H14 L19.5 8 V19.5 A2 2 0 0 1 17.5 21.5 H6.5 A2 2 0 0 1 4.5 19.5 V4.5 A2 2 0 0 1 6.5 2.5 Z'

export default function render(icon) {
  const parts = [
    ...g.pane(g.path(PAGE), 'c1', { frame: 1.5, tracery: 'none', glass: { dark: 0.4 } }),
    g.gilt(g.poly([[14, 2.6], [14, 7.4], [19.4, 7.4]]), { plate: 'A' }),
    g.gilt(g.union(
      g.seg(13.1, 9.4, 13.1, 16.4, 1.8),
      g.stroke('M13.1 9.4 C13.7 11.2 16.6 11.6 16.4 14.6', 1.7),
      g.ellipse(10.4, 16.6, 3.2, 2.5),
    ), { plate: 'A' }),
    g.glass(g.ellipse(10.4, 16.6, 2.1, 1.45), 'c3', { outline: 0.22, glint: false, glow: 0.3, plate: 'A' }),
  ]
  return paint(enamel(parts, icon))
}
