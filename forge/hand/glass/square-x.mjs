// forge/hand/glass/square-x.mjs — the glass square with an X inlaid in it. Generated Glass etched the X as a 0.7u
// hairline at 62% that vanished at 16px; here the X is a window cut through the frosted pane (the colour body glows
// round it and the rim catches its lit edges, like home's door) holding a deep etch-ink X at Line's weight.
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'
import { roundStrokeSet, unionSets } from '../../kernel/bool.mjs'

// skeleton coordinates -> glass's front (pane) frame: scaled about the centre, 0.5u up-left
const F = v => +(12 + (v - 12) * G.SCALE - 0.5).toFixed(2)
const P = ([x, y]) => `${F(x)} ${F(y)}`
const STROKES = [[[8.75, 8.75], [15.25, 15.25]], [[15.25, 8.75], [8.75, 15.25]]]

export default function render(icon) {
  // the square (plate K) as every glass container, with the X's window cut into its pane
  const win = unionSets(STROKES.map(s => roundStrokeSet(s, 2.5)))
  const base = {
    ...icon,
    paths: icon.paths.filter(p => p.plate === 'K'),
    lines: icon.lines.filter(l => l.plate === 'K'),
    cutouts: [{ subs: win.map(pts => ({ pts, closed: true })) }],
  }
  const L = softLayers(base)
  if (!L) return null
  const { defs, out } = softPaint(L, icon.name)
  const x = ['path', {
    d: STROKES.map(s => 'M' + s.map(P).join('L')).join(''),
    fill: 'none', stroke: V.etch, 'stroke-width': 1.6, 'stroke-linecap': 'round', class: 'wm-a',
  }]
  // the X sits in its window, under the rim light
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  if (rim >= 0) out.splice(rim, 0, x); else out.push(x)
  return [['defs', {}, defs], ...out]
}
