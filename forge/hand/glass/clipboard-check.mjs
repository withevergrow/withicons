// forge/hand/glass/clipboard-check.mjs — the glass clipboard with a check inlaid in its board. Generated Glass etched
// the tick as a 0.7u hairline at 62% that faded into the frost at 16px; here the tick is a window cut through the
// frosted pane (the colour body glows round it, the rim catches its lit edges) holding a deep etch-ink tick at Line's
// weight, so the tick is the strongest mark. Board and clip are glass's own clipboard.
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'
import { roundStrokeSet } from '../../kernel/bool.mjs'

// skeleton coordinates -> glass's front (pane) frame: scaled about the centre, 0.5u up-left
const F = v => +(12 + (v - 12) * G.SCALE - 0.5).toFixed(2)
const P = ([x, y]) => `${F(x)} ${F(y)}`
const TICK = [[8.25, 14.25], [10.85, 16.85], [15.75, 11.5]]

export default function render(icon) {
  // board (K) + clip (the closed A path) + the clip's collar cutout: exactly glass's clipboard
  const win = roundStrokeSet(TICK, 2.5)
  const base = {
    ...icon,
    paths: icon.paths.filter(p => p.plate === 'K' || /Z\s*$/.test(p.d)),
    lines: icon.lines.filter(l => l.plate === 'K' || l.closed),
    cutouts: [
      ...icon.cutouts.filter(c => /^M\s*6\.75/.test(c.d)),
      { subs: win.map(pts => ({ pts, closed: true })) },
    ],
  }
  const L = softLayers(base)
  if (!L) return null
  const { defs, out } = softPaint(L, icon.name)
  const tick = ['path', {
    d: 'M' + TICK.map(P).join('L'),
    fill: 'none', stroke: V.etch, 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a',
  }]
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  if (rim >= 0) out.splice(rim, 0, tick); else out.push(tick)
  return [['defs', {}, defs], ...out]
}
