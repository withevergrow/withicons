// GLASS — creative, rich (gradients). Soft frosted glass in the macOS Big Sur / iOS 15 manner.
// A calm colour body sits behind, offset down-right, with a soft orb of accent light inside it; in front, the
// object as a translucent frosted pane (white-to-tint gradient) with a currentColor hairline edge and a fine
// light rim along its lit top edges. Attached parts (plate A) are a clearer second layer of glass, signals
// (plate S) small luminous accent badges, interior detail is etched in a deep ink, and a very soft diffuse
// shadow grounds it all. Geometry: _glass-core.mjs (signed distance fields); paint: _glass-soft.mjs;
// per-icon tuning: _glass-tune.mjs; Live-icon marks: _glass-live.mjs.
import { G } from './_glass-core.mjs'
import { softLayers, softPaint, V } from './_glass-soft.mjs'
import { splitText, shiftD } from './_live-text.mjs'
import { stripGlyphs, beads, hands } from './_glass-live.mjs'
import { glassSnowman } from './_glass-snowman.mjs'
import { glassDragon } from './_glass-dragon.mjs'
import { glassPiggy } from './_glass-piggy.mjs'

export default {
  name: 'glass',
  title: 'Glass',
  kind: 'creative',
  description: 'Soft frosted glass: a calm colour glows through a translucent pane with a fine light rim and a gentle shadow.',
  strokeWidth: false,
  root: { fill: 'none' },
  render(full) {
    // Live icons (_glass-live.mjs): the value is set ON the glass, never built into it.
    //   text inside a pane   deep etch-ink lettering at Line's weight
    //   free text            a currentColor numeral over a translucent colour echo
    //   marks (pips, a marked day)   luminous accent beads with a specular dot
    //   hands, a gauge's needle      etch-ink hands with a bead hub; a level column is an accent rod
    // hand-drawn per-icon drawings (the skeleton stays the base for every other style)
    if (full.name === 'snowman' && !full.params) { try { return glassSnowman() } catch { /* the generic build below */ } }
    if (full.name === 'dragon-head' && !full.params) { try { return glassDragon() } catch { /* the generic build below */ } }
    if (full.name === 'piggy-bank' && !full.params) { try { return glassPiggy() } catch { /* the generic build below */ } }
    const { icon: rest, free, inside } = splitText(full)
    let icon = rest, M = { hands: [], columns: [], beads: [] }
    try {
      icon = stripGlyphs(rest, inside)
      const Hd = hands(icon), B = beads(Hd.icon)
      icon = B.icon; M = { hands: Hd.hands, columns: Hd.columns, beads: [...B.beads, ...Hd.hubs] }
    } catch { /* keep the glass build of the icon as it is */ }
    const marks = () => [...handNodes(M.hands, M.columns), ...beadNodes(M.beads)]
    let L = null
    try { L = softLayers(icon) } catch { L = null }
    if (!L) return [...fallback(icon), ...marks(), ...liveText(free, inside)]
    try {
      const { defs, out } = softPaint(L, String(full.name || 'icon'))
      return [['defs', {}, defs], ...out, ...marks(), ...liveText(free, inside)]
    } catch { return fallback(full) }
  },
}

// glyph strokes in glass's frame (scaled like every drawing, the front pane 0.5u up-left)
function liveText(free, inside) {
  const out = [], S = G.SCALE, round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  // free text: a crisp currentColor numeral with a soft colour echo just behind (translucent, so the echo never
  // fills a counter), a touch lighter than Line so a small "8" or "9" stays open at 24px
  if (free.length) out.push(['path', { d: free.map(g => shiftD(g.d, 0.32, 0.32, S)).join(''), stroke: V.c1, 'stroke-opacity': 0.55, 'stroke-width': 1.45, ...round }])
  for (const g of free) out.push(['path', { d: shiftD(g.d, -0.2, -0.2, S), stroke: 'currentColor', 'stroke-width': g.cap >= 6 ? 1.55 : 1.35, ...round }])
  // inside text: deep etch-ink lettering on the pane (front plane, 0.5u up-left) at Line's weight (scaled)
  for (const g of inside) out.push(['path', { d: shiftD(g.d, -0.5, -0.5, S), stroke: V.etch, 'stroke-width': g.cap >= 6 ? 1.8 : 1.62, ...round }])
  return out
}

// hands in glass's frame: etch-ink strokes on the pane (wm-a: they turn with the value);
// a level column (mercury, a battery's charge) is an accent glass rod with a soft deep edge
function handNodes(hs, cs = []) {
  const S = G.SCALE, f = v => +v.toFixed(3), P = p => f(12 + (p[0] - 12) * S - 0.5) + ' ' + f(12 + (p[1] - 12) * S - 0.5)
  const D = ls => ls.map(h => 'M' + h.map(P).join('L')).join('')
  const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }
  const out = []
  if (cs.length) out.push(['path', { d: D(cs), stroke: V.etch, 'stroke-width': 2.1, ...round }], ['path', { d: D(cs), stroke: V.accent, 'stroke-width': 1.1, ...round }])
  if (hs.length) out.push(['path', { d: D(hs), stroke: V.etch, 'stroke-width': 1.5, ...round }])
  return out
}

// luminous beads in glass's frame: accent glass, a soft deep edge and a specular dot (wm-a: they move with the value)
function beadNodes(all) {
  if (!all.length) return []
  const bs = all.filter(b => !b.dot), dots = all.filter(b => b.dot)
  const S = G.SCALE, f = v => +v.toFixed(3)
  const at = b => [12 + (b.cx - 12) * S - 0.5, 12 + (b.cy - 12) * S - 0.5]
  const disc = (x, y, r) => `M${f(x - r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x + r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x - r)} ${f(y)}Z`
  const R = b => Math.min(b.r + 0.8, 1.6) * S
  const out = []
  if (dots.length) out.push(['path', { d: dots.map(b => { const [x, y] = at(b); return disc(x, y, 0.62) }).join(''), fill: V.etch }])
  if (!bs.length) return out
  return [...out,
    ['path', { d: bs.map(b => { const [x, y] = at(b); return disc(x + 0.3, y + 0.3, R(b)) }).join(''), fill: V.shadow, 'fill-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: bs.map(b => { const [x, y] = at(b); return disc(x, y, R(b)) }).join(''), fill: V.accent, stroke: V.etch, 'stroke-width': 0.6, class: 'wm-a' }],
    ['path', { d: bs.map(b => { const [x, y] = at(b); return disc(x - R(b) * 0.36, y - R(b) * 0.36, Math.max(0.28, R(b) * 0.28)) }).join(''), fill: V.shine, 'fill-opacity': 0.9, class: 'wm-a' }],
  ]
}

// never render empty: the plain line drawing
function fallback(icon) {
  return (icon.paths || []).filter(p => p && p.d).map(p => ['path', {
    d: p.d, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
  }])
}
