// RETRO — creative. A warm 70s/80s patch: a chunky round outline in ink, the
// object's mass banded with horizontal sunset stripes (mustard, orange, coral,
// teal) whose gaps widen toward the bottom, and a hard offset print shadow.
// Line glyphs (arrows, chevrons, menus) get a doubled line: an orange copy
// offset behind the ink. Badges become solid teal discs set apart by a moat
// (an empty lens gets a mustard centre).
// Geometry lives in _retro-core.mjs (signed distance fields), per-icon tuning
// in _retro-tune.mjs. Every colour is a CSS variable with a literal fallback;
// the ink is currentColor.
import { build, loopsD, trace, K } from './_retro-core.mjs'

export const PALETTE = {
  1: '#F4B53F',      // mustard: the top of the sun
  2: '#EF7D2D',      // orange
  3: '#DE4B3A',      // coral red
  4: '#178A86',      // teal: the horizon / sea, and every badge
  shadow: '#6B3323', // deep warm brown: the hard print shadow
}
const paint = k => `var(--with-retro-${k}, ${PALETTE[k]})`

function draw(icon) {
  const B = build(icon)
  const nodes = []
  const add = (Fd, fill, tol, minArea, dp) => {
    if (!Fd) return
    const d = loopsD(trace(Fd, tol, minArea), dp)
    if (d) nodes.push(['path', { d, fill, 'fill-rule': 'evenodd' }])
  }
  add(B.shadow, paint('shadow'), K.TOL_C, 0.25, 1)
  add(B.echo, paint(2), K.TOL_C, 0.25, 1)
  for (const s of B.stripes) add(s.f, paint(s.c), K.TOL_C, 0.35, 1)
  add(B.badge, paint(4), K.TOL_C, 0.3, 1)
  add(B.lens, paint(1), K.TOL_C, 0.3, 1)
  const ink = loopsD(trace(B.ink, K.TOL, 0.15), 2)
  if (ink) nodes.push(['path', { d: ink, 'fill-rule': 'evenodd' }])
  return nodes
}

export default {
  name: 'retro',
  title: 'Retro',
  kind: 'creative',
  description: 'Warm 70s vibes: chunky outlines, sunset-striped fills and a hard offset shadow, like a vintage patch.',
  strokeWidth: false,
  root: { fill: 'currentColor' },
  render(icon) {
    try {
      const nodes = draw(icon)
      if (nodes.length) return nodes
    } catch { /* degrade below */ }
    // last resort: the centrelines as plain round strokes, so nothing renders empty
    try {
      return (icon.paths || []).map(p => ['path', { d: p.d, fill: 'none', stroke: 'currentColor', 'stroke-width': K.W, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }])
    } catch { return [] }
  },
}
