// forge/hand/gothic/file-down.mjs — the files exemplar's sapphire leaf (plain glass, no quarry mesh) with its gilded
// dog-ear, and a broad gilded download arrow (A): a straight shaft into a solid triangular head; the generated arrow
// had a thin blade, a crossguard-like barbed head and a ruby trefoil, and read as a sword stuck in the page.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const PAGE = 'M6.5 2.5 H14 L19.5 8 V19.5 A2 2 0 0 1 17.5 21.5 H6.5 A2 2 0 0 1 4.5 19.5 V4.5 A2 2 0 0 1 6.5 2.5 Z'

export default function render(icon) {
  const parts = [
    ...g.pane(g.path(PAGE), 'c2', { frame: 1.5, tracery: 'none', glass: { dark: 0.4 } }),
    g.gilt(g.poly([[14, 2.6], [14, 7.4], [19.4, 7.4]]), { plate: 'A' }),
    g.gilt(g.union(g.rr(10.8, 9, 13.2, 15, 0.5), g.poly([[7.9, 13.8], [16.1, 13.8], [12, 18.6]])), { plate: 'A' }),
  ]
  return paint(enamel(parts, icon))
}
