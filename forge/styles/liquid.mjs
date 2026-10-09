// LIQUID: creative (site group "Trend"). Inspired by the 2025 "Liquid Glass" design
// language: every icon is a clear, thick, refractive glass object. A mostly
// transparent body with a faint tint and a soft inner gradient, a crisp white
// specular rim on the top-left edges, a darker refraction band inside the
// bottom-right edges with a cool inner rim light, a soft lensing highlight, a
// faint coloured caustic glow on the ground and a soft shadow. Secondary parts
// (A) are coloured glass, badges and modifiers (S) an accent glass bead.
// Rich style (forge/CONTRACT.md "Rich styles"): one defs node of userSpaceOnUse
// gradients, ids wg-liquid-<icon>-<n>, every colour a role variable
// --with-liquid-<role> with a hex fallback; the ink hairline is currentColor.
// Geometry: _liquid-core.mjs (on _liquid-field.mjs, _liquid-path.mjs).
import { snowman } from './_liquid-snowman.mjs'
import { dragon } from './_rich-dragon.mjs'
import { build, col, L } from './_liquid-core.mjs'
import { hasText, splitText, openText, textInfo, glyphWeight, shiftD } from './_live-text.mjs'

export default {
  name: 'liquid',
  title: 'Liquid',
  kind: 'creative',
  description: 'Clear, thick, refractive glass: a faintly tinted body with a crisp specular rim, a deep refraction edge, a soft lens highlight and a coloured caustic glow.',
  strokeWidth: false,
  root: { fill: 'none' },
  render(icon) {
    if (icon && icon.name === 'snowman') { try { return snowman() } catch { /* generic below */ } }
    if (icon && icon.name === 'dragon-head') { try { return dragon('liquid') } catch { /* generic below */ } }
    try {
      const { glass, text } = liveSplit(icon)
      const nodes = build(glass)
      if (nodes && nodes.length > 1) return [...nodes, ...text]
    } catch { /* degrade below: never throw */ }
    // last resort: the line drawing in tinted glass, so nothing ever renders empty
    try {
      return (icon.paths || []).filter(p => p && p.d).map(p => ['path', {
        d: p.d, stroke: col(p.plate === 'A' ? 'c2' : p.plate === 'S' ? 'accent' : 'c1'),
        'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      }])
    } catch { return [] }
  },
}

// Live icons (forge/DYNAMIC.md): lettering is never built as glass (2u tubes with rims close every counter).
// The glyphs leave the glass build (their knock-outs too, so a tile stays one clear slab) and are set on top as
// crisp ink lettering at Line's weight, scaled into liquid's frame; free text gets a soft c2 glass echo behind it.
function liveSplit(icon) {
  if (!hasText(icon)) return { glass: icon, text: [] }
  const { inside, free } = splitText(icon)
  const o = openText(icon)
  const glass = {
    ...o,
    paths: o.paths.filter(p => !textInfo(p)),
    lines: (o.lines || []).filter(l => !String(l.pathId || '').startsWith('text:')),
    cutouts: (o.cutouts || []).map(c => ({ ...c, subs: (c.subs || []).filter(s => !s.glyph) })).filter(c => c.subs.length),
  }
  const S = L.SCALE, mv = (d, k = 0) => shiftD(d, L.TX + k, L.TY + k, S)
  const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  const w = (g, base) => +(glyphWeight(g, { base }) * S).toFixed(2)
  const text = []
  if (free.length) text.push(['path', { d: free.map(g => mv(g.d, 0.3)).join(''), stroke: col('c2'), 'stroke-opacity': 0.55, 'stroke-width': 1.5, ...round, class: 'wm-a' }])
  for (const g of free) text.push(['path', { d: mv(g.d), stroke: 'currentColor', 'stroke-width': w(g, 1.9), ...round, class: 'wm-a' }])
  for (const g of inside) text.push(['path', { d: mv(g.d), stroke: 'currentColor', 'stroke-width': w(g, 1.75), ...round, class: 'wm-a' }])
  return { glass, text }
}
