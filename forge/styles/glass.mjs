// GLASS — creative. Multi-layered frosted glass (glassmorphism).
// A vivid back layer (the object's mass, shifted down-right), a frosted front
// pane in place with a crisp currentColor rim and etched detail, the colour seen
// "through the glass" where they overlap, and a specular edge plus a soft
// diagonal sheen. All depth is layered geometry and opacity: no defs, gradients
// or filters. Build logic lives in _glass-core.mjs; per-icon tuning in _glass-tune.mjs.
import { glassLayers, G } from './_glass-core.mjs'
import { splitText, shiftD } from './_live-text.mjs'
import { stripGlyphs, beads, hands } from './_glass-live.mjs'

const C = {
  back: 'var(--with-glass-back, #3D5AFE)',
  accent: 'var(--with-glass-accent, #FF4D8D)',
  pane: 'var(--with-glass-pane, #C7D0FF)',
  frost: 'var(--with-glass-frost, #FFFFFF)',
  shine: 'var(--with-glass-shine, #FFFFFF)',
  etch: 'var(--with-glass-etch, #1B2390)',
}

export default {
  name: 'glass',
  title: 'Glass',
  kind: 'creative',
  description: 'Layered frosted glass: a vivid colour glows through a translucent pane with a crisp rim, a specular edge and a soft sheen.',
  strokeWidth: false,
  root: { fill: 'none' },
  render(full) {
    // Live icons (_glass-live.mjs): the value is set ON the glass, never built into it.
    //   text inside a pane   deep etch-colour lettering at Line's weight (no etched groove + lit lip closing counters)
    //   free text            a crisp rim-colour numeral over a translucent vivid echo (glass rods would be blobs)
    //   marks (pips, a marked day)   glass beads: accent glass, a crisp rim, a specular dot
    //   hands, a gauge's needle      bold etch-colour hands with a bead hub; a level column (mercury, a charge)
    //                                an accent rod with a rim-colour edge
    const { icon: rest, free, inside } = splitText(full)
    let icon = rest, M = { hands: [], columns: [], beads: [] }
    try {
      icon = stripGlyphs(rest, inside)
      const Hd = hands(icon), B = beads(Hd.icon)
      icon = B.icon; M = { hands: Hd.hands, columns: Hd.columns, beads: [...B.beads, ...Hd.hubs] }
    } catch { /* keep the glass build of the icon as it is */ }
    const marks = () => [...handNodes(M.hands, M.columns), ...beadNodes(M.beads)]
    let L = null
    try { L = glassLayers(icon) } catch { L = null }
    if (!L || !L.front) return [...fallback(icon), ...marks(), ...liveText(free, inside)]
    try { return [...paint(L), ...marks(), ...liveText(free, inside)] } catch { return fallback(full) }
  },
}

// layers -> IconNodes, back to front. Panes, frost and etch are one fused object (untagged = wm-k for motion);
// the sheen and the specular edge are tagged wm-shine (forge/MOTION.md "Parts choreography")
export function paint(L) {
  const out = []
  const ev = 'evenodd'
  if (L.back) out.push(['path', { d: L.back, fill: C.back, 'fill-rule': ev }])
  if (L.backS) out.push(['path', { d: L.backS, fill: C.accent, 'fill-rule': ev }])
  out.push(['path', { d: L.front, fill: C.pane, 'fill-opacity': 0.35, 'fill-rule': ev, stroke: 'currentColor', 'stroke-width': G.RIM, 'stroke-linejoin': 'round' }])
  if (L.frost) out.push(['path', { d: L.frost, fill: C.frost, 'fill-opacity': 0.2, 'fill-rule': ev }])
  if (L.sheen) out.push(['path', { d: L.sheen, fill: C.shine, 'fill-opacity': 0.4, 'fill-rule': ev, class: 'wm-shine' }])
  if (L.etch) {
    out.push(['path', { d: L.etchHi, fill: 'none', stroke: C.shine, 'stroke-opacity': 0.8, 'stroke-width': 0.42, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }])
    out.push(['path', { d: L.etch, fill: 'none', stroke: C.etch, 'stroke-width': 0.85, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }])
  }
  if (L.hl) out.push(['path', { d: L.hl, fill: C.shine, 'fill-opacity': 0.92, 'fill-rule': ev, class: 'wm-shine' }])
  return out
}

// glyph strokes in glass's frame (scaled like every drawing, the front pane 0.5u up-left)
function liveText(free, inside) {
  const out = [], S = G.SCALE, round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  // free text: a crisp rim-colour numeral with its vivid glass echo just behind (translucent, so the echo never
  // fills a counter), a touch lighter than Line so a small "8" or "9" stays open at 24px
  if (free.length) out.push(['path', { d: free.map(g => shiftD(g.d, 0.32, 0.32, S)).join(''), stroke: C.back, 'stroke-opacity': 0.5, 'stroke-width': 1.45, ...round }])
  for (const g of free) out.push(['path', { d: shiftD(g.d, -0.2, -0.2, S), stroke: 'currentColor', 'stroke-width': g.cap >= 6 ? 1.55 : 1.35, ...round }])
  // inside text: deep etch-colour lettering on the pane (front plane, 0.5u up-left) at Line's weight (1.75u,
  // scaled): the etch is a mid-contrast colour, so a lighter stroke would let thin joins drop out at 24px
  for (const g of inside) out.push(['path', { d: shiftD(g.d, -0.5, -0.5, S), stroke: C.etch, 'stroke-width': g.cap >= 6 ? 1.8 : 1.62, ...round }])
  return out
}

// hands in glass's frame: bold etch-colour strokes on the pane (wm-a: they turn with the value)
// a level column (mercury, a battery's charge) is an accent glass rod with a crisp rim-colour edge
function handNodes(hs, cs = []) {
  const S = G.SCALE, f = v => +v.toFixed(3), P = p => f(12 + (p[0] - 12) * S - 0.5) + ' ' + f(12 + (p[1] - 12) * S - 0.5)
  const D = ls => ls.map(h => 'M' + h.map(P).join('L')).join('')
  const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }
  const out = []
  if (cs.length) out.push(['path', { d: D(cs), stroke: 'currentColor', 'stroke-width': 2.1, ...round }], ['path', { d: D(cs), stroke: C.accent, 'stroke-width': 1.1, ...round }])
  if (hs.length) out.push(['path', { d: D(hs), stroke: C.etch, 'stroke-width': 1.5, ...round }])
  return out
}

// glass beads in glass's frame: accent glass with a crisp rim and a specular dot (wm-a: they move with the value)
function beadNodes(all) {
  if (!all.length) return []
  const bs = all.filter(b => !b.dot), dots = all.filter(b => b.dot)
  const S = G.SCALE, f = v => +v.toFixed(3)
  const at = b => [12 + (b.cx - 12) * S - 0.5, 12 + (b.cy - 12) * S - 0.5]
  const disc = (x, y, r) => `M${f(x - r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x + r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x - r)} ${f(y)}Z`
  const R = b => Math.min(b.r + 0.8, 1.6) * S
  const out = []
  if (dots.length) out.push(['path', { d: dots.map(b => { const [x, y] = at(b); return disc(x, y, 0.62) }).join(''), fill: C.etch }])
  if (!bs.length) return out
  return [...out,
    ['path', { d: bs.map(b => { const [x, y] = at(b); return disc(x + 0.3, y + 0.3, R(b)) }).join(''), fill: C.back, class: 'wm-a' }],
    ['path', { d: bs.map(b => { const [x, y] = at(b); return disc(x, y, R(b)) }).join(''), fill: C.accent, stroke: C.etch, 'stroke-width': 0.6, class: 'wm-a' }],
    ['path', { d: bs.map(b => { const [x, y] = at(b); return disc(x - R(b) * 0.36, y - R(b) * 0.36, Math.max(0.28, R(b) * 0.28)) }).join(''), fill: C.shine, 'fill-opacity': 0.9, class: 'wm-shine' }],
  ]
}

// never render empty: the plain line drawing
function fallback(icon) {
  return (icon.paths || []).filter(p => p && p.d).map(p => ['path', {
    d: p.d, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
  }])
}
