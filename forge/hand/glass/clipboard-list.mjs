// forge/hand/glass/clipboard-list.mjs — the glass clipboard with a two-item list inlaid in its board. Generated Glass
// etched the bullets and lines as 0.7u hairlines at 62% that disappeared into the frost at 16px; here each bullet and
// line is a window cut through the frosted pane (the colour body glows round it, the rim catches its lit edges)
// holding a deep etch-ink mark at Line's weight. Board and clip are glass's own clipboard.
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'
import { roundStrokeSet, unionSets } from '../../kernel/bool.mjs'
import { circle } from '../../kernel/geom.mjs'

// skeleton coordinates -> glass's front (pane) frame: scaled about the centre, 0.5u up-left
const F = v => +(12 + (v - 12) * G.SCALE - 0.5).toFixed(2)
const P = ([x, y]) => `${F(x)} ${F(y)}`
const ROWS = [11.75, 16.5]
const BULLET_X = 8.75, LINE = [11.75, 15.5]

export default function render(icon) {
  // board (K) + clip (the closed A path) + the clip's collar cutout: exactly glass's clipboard
  const win = unionSets(ROWS.flatMap(y => [
    [circle(BULLET_X, y, 1.25)],
    roundStrokeSet([[LINE[0], y], [LINE[1], y]], 2.5),
  ]))
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
  const marks = ['path', {
    d: ROWS.map(y => `M${P([BULLET_X, y])}h0M${P([LINE[0], y])}L${P([LINE[1], y])}`).join(''),
    fill: 'none', stroke: V.etch, 'stroke-width': 1.6, 'stroke-linecap': 'round', class: 'wm-a',
  }]
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  if (rim >= 0) out.splice(rim, 0, marks); else out.push(marks)
  return [['defs', {}, defs], ...out]
}
