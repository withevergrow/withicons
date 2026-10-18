// forge/hand/gothic/download.mjs — the common download: a gilded arrow (the arrow family's notched ogival head) sinking into an
// open limestone tray with a lit ruby-glass floor; the old sword-in-a-castle-wall motif is a different object.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { cut as sub } from '../../styles/_gothic-prim.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

// notched ogival head pointing down, tip at (12, 16.6), scale s
const head = s => {
  const t = 16.6
  const p = (u, v) => [(12 + v * s).toFixed(2), (t - u * s).toFixed(2)].join(' ')
  return `M${p(0, 0)} C${p(2.4, 2.3)} ${p(4.9, 4.3)} ${p(6.9, 5.3)} L${p(5, 0)} L${p(6.9, -5.3)} C${p(4.9, -4.3)} ${p(2.4, -2.3)} ${p(0, 0)} Z`
}

export default function render(icon) {
  const s = 0.98
  const tray = sub(g.rr(3.4, 13.2, 20.6, 20.6, 1.6), g.rr(5.6, 12, 18.4, 18.4, 0.9))
  const arrowF = g.union(g.seg(12, 3.2, 12, 12.1, 2.6), g.path(head(s)))
  const parts = [
    g.stone(tray),
    g.glass(g.rr(5.8, 16.9, 18.2, 18.3, 0.4), 'c1', { outline: 0.2, glint: false, glow: 0.2 }),
    g.gilt(arrowF, { plate: 'A' }),
    g.glass(g.shrink(arrowF, 0.75), 'c1', { outline: 0.2, glint: false, glow: 0.22, dark: 0.12, plate: 'A' }),
    g.glass(g.foil(12, 12.5, 1.25 * s, 3, 90), 'c3', { outline: 0.22, glint: false, glow: 0.34, plate: 'A' }),
    g.studs([[4.9, 14.4], [19.1, 14.4]], 0.5),
  ]
  return paint(enamel(parts, icon))
}
