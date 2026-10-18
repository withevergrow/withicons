// forge/hand/glass/file-x.mjs — the glass page with its folded corner and an X inlaid in it. Generated Glass etched
// the X as a 0.7u hairline at 62% that faded out at 24px; here the X is a window cut through the frosted pane (the
// colour body glows round it, the rim catches its lit edges) holding a deep etch-ink X at Line's weight.
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'
import { roundStrokeSet, unionSets } from '../../kernel/bool.mjs'

// skeleton coordinates -> glass's front (pane) frame: scaled about the centre, 0.5u up-left
const F = v => +(12 + (v - 12) * G.SCALE - 0.5).toFixed(2)
const P = ([x, y]) => `${F(x)} ${F(y)}`
// the X a touch larger than the skeleton's 5u so it holds the page at small sizes, centred in the page below the fold
const STROKES = [[[9.25, 11.75], [14.75, 17.25]], [[14.75, 11.75], [9.25, 17.25]]]

export default function render(icon) {
  // the page (K) and its fold (the A line from the top edge, and its cutout), as glass draws every file
  const isFold = d => /^M\s*14[\s,]+2\.5/.test(String(d))
  const win = unionSets(STROKES.map(s => roundStrokeSet(s, 2.5)))
  const base = {
    ...icon,
    paths: icon.paths.filter(p => p.plate === 'K' || isFold(p.d)),
    lines: icon.lines.filter(l => l.plate === 'K' || (l.pts[0] && Math.abs(l.pts[0][0] - 14) < 0.01 && Math.abs(l.pts[0][1] - 2.5) < 0.01)),
    cutouts: [
      ...icon.cutouts.filter(c => isFold(c.d)),
      { subs: win.map(pts => ({ pts, closed: true })) },
    ],
  }
  const L = softLayers(base)
  if (!L) return null
  const { defs, out } = softPaint(L, icon.name)
  const x = ['path', {
    d: STROKES.map(s => 'M' + s.map(P).join('L')).join(''),
    fill: 'none', stroke: V.etch, 'stroke-width': 1.6, 'stroke-linecap': 'round', class: 'wm-a',
  }]
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  if (rim >= 0) out.splice(rim, 0, x); else out.push(x)
  return [['defs', {}, defs], ...out]
}
