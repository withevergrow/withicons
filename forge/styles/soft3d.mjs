// SOFT 3D: creative (site group "3D & glass"). Soft, studio-lit 3D renders, the look of Blender "3D icon" packs:
// physical things (devices, vehicles, buildings, bags, tools, food, festival objects) are real solids in a gentle 3/4
// perspective view (front, top and right side, rounded bevels, parts on the right faces with their own depth, inset
// glass, recessed wells), signs and UI glyphs stay front-facing soft slabs (the tilt is used only where it means
// something), and people are Memoji-like 3D busts with diverse skin tones; animals and monsters are cute 3D characters.
// One light from the upper left, ambient occlusion where parts meet, a soft contact shadow.
// Rich style: one shared <defs> of gradients, role variables --with-soft3d-<role>.
// Mode table + colours: _soft3d-tune.mjs; solids + light: _soft3d-core.mjs; avatars: _soft3d-avatar.mjs.
import { build } from './_soft3d-core.mjs'
import { avatar, isAvatar } from './_soft3d-avatar.mjs'
import { BASE } from './_soft3d-tune.mjs'
import { snowman } from './_soft3d-snowman.mjs'
import { dragon } from './_rich-dragon.mjs'
import { piggy } from './_soft3d-piggy.mjs'

const col = r => `var(--with-soft3d-${r}, ${BASE[r]})`

export default {
  name: 'soft3d',
  title: 'Soft 3D',
  kind: 'creative',
  description: 'Soft studio-lit 3D: real objects in a gentle 3/4 view with volume, rounded bevels and natural materials, symbols as rounded front-facing forms, people as soft 3D busts.',
  strokeWidth: false,
  root: { fill: 'none' },
  render(icon) {
    // hand-drawn per-icon pieces (the generic solid cannot make these characters)
    if (icon && icon.name === 'snowman') { try { return snowman() } catch { /* generic below */ } }
    if (icon && icon.name === 'dragon-head') { try { return dragon('soft3d') } catch { /* generic below */ } }
    if (icon && icon.name === 'piggy-bank') { try { return piggy() } catch { /* generic below */ } }
    try {
      const nodes = isAvatar(icon) ? avatar(icon) : null
      if (nodes && nodes.length > 1) return nodes
    } catch { /* fall through to the generic solid */ }
    // very detailed drawings get coarser curves and fewer tonal bands to stay inside the size budget
    for (const lite of [0, 1, 2, 3]) {
      try {
        const nodes = build(icon, lite)
        if (nodes && nodes.length > 1 && (lite === 3 || JSON.stringify(nodes).length < 18500)) return nodes
      } catch { /* next level, then degrade below: never throw */ }
    }
    try {
      return (icon.paths || []).filter(p => p && p.d).map(p => ['path', {
        d: p.d, stroke: col(p.plate === 'S' ? 'accent' : p.plate === 'A' ? 'c2' : 'c1'),
        'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-' + (p.plate || 'K').toLowerCase(),
      }])
    } catch { return [] }
  },
}
