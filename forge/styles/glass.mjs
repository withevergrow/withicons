// GLASS — creative. Multi-layered frosted glass (glassmorphism).
// A vivid back layer (the object's mass, shifted down-right), a frosted front
// pane in place with a crisp currentColor rim and etched detail, the colour seen
// "through the glass" where they overlap, and a specular edge plus a soft
// diagonal sheen. All depth is layered geometry and opacity: no defs, gradients
// or filters. Build logic lives in _glass-core.mjs; per-icon tuning in _glass-tune.mjs.
import { glassLayers, G } from './_glass-core.mjs'
import { splitText, shiftD } from './_live-text.mjs'

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
    // Live icons: text inside a pane is etched bolder than detail lines (legible at 24px); free text (no pane
    // behind it) would turn into glass rods, so it is drawn as a crisp rim-colour stroke over a vivid back stroke
    const { icon, free, inside } = splitText(full)
    let L = null
    try { L = glassLayers(icon) } catch { L = null }
    if (!L || !L.front) return free.length ? [...fallback(icon), ...liveText(free, inside)] : fallback(icon)
    try { return [...paint(L), ...liveText(free, inside)] } catch { return fallback(full) }
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
  for (const g of free) out.push(['path', { d: shiftD(g.d, 0.3, 0.3, S), stroke: C.back, 'stroke-width': 2, ...round }])
  for (const g of free) out.push(['path', { d: shiftD(g.d, -0.3, -0.3, S), stroke: 'currentColor', 'stroke-width': 1.6, ...round }])
  for (const g of inside) out.push(['path', { d: shiftD(g.d, -0.5, -0.5, S), stroke: C.etch, 'stroke-width': 1.3, ...round }])
  return out
}

// never render empty: the plain line drawing
function fallback(icon) {
  return (icon.paths || []).filter(p => p && p.d).map(p => ['path', {
    d: p.d, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
  }])
}
