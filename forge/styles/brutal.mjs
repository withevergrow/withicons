// BRUTAL — creative (site group "Trend"). Neo-brutalism, the bold look of indie SaaS
// and creator-tool sites: thick pure-ink outlines, flat saturated fills and a hard
// offset shadow (the whole silhouette again, solid ink, pushed down-right; real
// geometry, no blur). Secondary (A) parts take a second flat colour, separate
// fields a third, and S-plate badges are stuck on top as bold c4 discs with their
// own little hard shadow. Line-only glyphs become fat ink tubes with a c1 core.
//
// Geometry lives in _brutal-core.mjs (signed distance fields), per-icon tuning in
// _brutal-tune.mjs. Flat on purpose: no defs, no gradients.
//
// Variables (role-named, see forge/lib/palette-map.mjs):
//   --with-brutal-ink     currentColor  outlines AND the hard shadow (flips with `color`)
//   --with-brutal-c1      #FFD23F       main body (yellow)
//   --with-brutal-c2      #FF6BA8       secondary parts, doors, keyholes, pupils (pink)
//   --with-brutal-c3      #4D7CFE       a second separate field (blue)
//   --with-brutal-c4      #3DDC97       badges (green)
//   --with-brutal-accent  #FF8A3D       a third separate field (orange)
//
// Motion parts (forge/MOTION.md): the hard shadow is `wm-shadow` (a full solid
// silhouette, so it stays whole while the object pops); badges, slashes and their
// shadow are `wm-s`; colour fields and outline are the object (untagged).
import { build, loopsD, trace, K } from './_brutal-core.mjs'
import { isPerson } from './_people.mjs'
import { buildPerson, personPalette } from './_brutal-people.mjs'
import { snowman } from './_brutal-snowman.mjs'
import { dragon } from './_rich-dragon.mjs'

export const PALETTE = {
  c1: '#FFD23F', c2: '#FF6BA8', c3: '#4D7CFE', c4: '#3DDC97', accent: '#FF8A3D',
}
const paint = k => k === 'ink' ? 'var(--with-brutal-ink, currentColor)' : `var(--with-brutal-${k}, ${PALETTE[k]})`

// people avatars (forge/styles/_people.mjs): flat skin c1, hair c2, loud clothing c4 (_brutal-people.mjs)
function drawPerson(icon) {
  const B = buildPerson(icon), P = personPalette(icon)
  const pp = k => k === 'ink' ? paint('ink') : `var(--with-brutal-${k}, ${P[k]})`
  const nodes = []
  const add = (Fd, fill, tol, minArea, cls, dx = 0, dy = 0) => {
    if (!Fd) return
    const d = loopsD(trace(Fd, tol, minArea), 2, dx, dy)
    if (!d) return
    const a = { d, fill, 'fill-rule': 'evenodd' }
    if (cls) a.class = cls
    nodes.push(['path', a])
  }
  add(B.shadow, pp('ink'), K.TOL_C, 0.2, 'wm-shadow', K.OFF, K.OFF)
  for (const f of B.fields) add(f.f, pp(f.c), K.TOL_C, 0.3)
  add(B.ink, pp('ink'), K.TOL, 0.1)
  // features (eyes, mouth, glasses) in the ink role with a fixed dark default: they stay dark on skin in dark mode
  add(B.feat, 'var(--with-brutal-ink, #16130F)', K.TOL, 0.1)
  add(B.glint, pp('tint'), K.TOL, 0.05)
  return nodes
}

function draw(icon) {
  if (isPerson(icon)) return drawPerson(icon)
  const B = build(icon)
  const nodes = []
  const add = (Fd, fill, tol, minArea, cls, dx = 0, dy = 0) => {
    if (!Fd) return
    const d = loopsD(trace(Fd, tol, minArea), 2, dx, dy)
    if (!d) return
    const a = { d, fill, 'fill-rule': 'evenodd' }
    if (cls) a.class = cls
    nodes.push(['path', a])
  }
  // the ink outline is traced once; the hard shadow reuses the silhouette moved down-right
  if (B.echo) add(B.echo, paint('c1'), K.TOL, 0.15, 'wm-shadow', K.OFF, K.OFF)
  if (B.shadow) add(B.shadow, paint('ink'), K.TOL_C, 0.2, 'wm-shadow', K.OFF, K.OFF)
  if (!B.tube) for (const f of B.fields) add(f.f, paint(f.c), K.TOL_C, 0.6)
  add(B.ink, paint('ink'), K.TOL, 0.15)
  if (B.tube) for (const f of B.fields) add(f.f, paint(f.c), K.TOL_C, 0.6)
  if (B.bshadow) add(B.bshadow, paint('ink'), K.TOL_C, 0.2, 'wm-s', K.BOFF, K.BOFF)
  if (B.badge) add(B.badge, paint('c4'), K.TOL_C, 0.3, 'wm-s')
  add(B.inkS, paint('ink'), K.TOL, 0.15, 'wm-s')
  return nodes
}

export default {
  name: 'brutal',
  title: 'Brutal',
  kind: 'creative',
  description: 'Neo-brutalism: thick black outlines, flat loud colours and a hard offset shadow, like the boldest startup sites.',
  strokeWidth: false,
  root: { fill: 'currentColor' },
  render(icon) {
    if (icon && icon.name === 'snowman') { try { return snowman() } catch { /* generic below */ } }
    if (icon && icon.name === 'dragon-head') { try { return dragon('brutal') } catch { /* generic below */ } }
    try {
      const nodes = draw(icon)
      if (nodes.length) return nodes
    } catch { /* degrade below */ }
    try {
      return (icon.paths || []).filter(p => p && p.d).map(p => ['path', { d: p.d, fill: 'none', stroke: 'currentColor', 'stroke-width': K.W, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }])
    } catch { return [] }
  },
}
