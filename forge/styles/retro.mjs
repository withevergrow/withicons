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
import { H, N } from './_retro-field.mjs'

export const PALETTE = {
  1: '#F4B53F',      // mustard: the top of the sun
  2: '#EF7D2D',      // orange
  3: '#DE4B3A',      // coral red
  4: '#178A86',      // teal: the horizon / sea, and every badge
  shadow: '#6B3323', // deep warm brown: the hard print shadow
  cream: '#FFF3D9',  // live-icon text on a teal badge
  letter: '#2A160E', // live-icon text on a mustard face
}
const paint = k => `var(--with-retro-${k}, ${PALETTE[k]})`

// Parts choreography (forge/MOTION.md): the hard print shadow is `wm-shadow`; S-plate overlays (badge disc,
// lens, the glyph ink on them) are `wm-s`. They sit in a moat, so S ink loops never touch the K ink and can be
// split off without changing a pixel. Stripes, echo and K/A ink are fused (untagged = the object).
const inMoat = (moat, ring) => {
  let n = 0
  for (const [x, y] of ring) {
    const i = Math.max(0, Math.min(N - 1, Math.round(x / H))), j = Math.max(0, Math.min(N - 1, Math.round(y / H)))
    if (moat[j * N + i] < -0.3) n++
  }
  return n > ring.length / 2
}
function draw(icon) {
  const B = build(icon)
  const nodes = []
  const add = (Fd, fill, tol, minArea, dp, cls) => {
    if (!Fd) return
    const d = loopsD(trace(Fd, tol, minArea), dp)
    if (d) nodes.push(['path', cls ? { d, fill, 'fill-rule': 'evenodd', class: cls } : { d, fill, 'fill-rule': 'evenodd' }])
  }
  add(B.shadow, paint('shadow'), K.TOL_C, 0.25, 1, 'wm-shadow')
  add(B.echo, paint(2), K.TOL_C, 0.25, 1)
  for (const s of B.stripes) add(s.f, paint(s.c), K.TOL_C, 0.35, 1)
  add(B.badge, paint(4), K.TOL_C, 0.3, 1, 'wm-s')
  add(B.lens, paint(1), K.TOL_C, 0.3, 1, 'wm-s')
  add(B.btext, paint('cream'), K.TOL, 0.1, 2, 'wm-s')
  const loops = trace(B.ink, K.TOL, 0.15)
  const sLoops = B.moat ? loops.filter(r => inMoat(B.moat, r)) : []
  const ink = loopsD(sLoops.length ? loops.filter(r => !sLoops.includes(r)) : loops, 2)
  if (ink) nodes.push(['path', { d: ink, 'fill-rule': 'evenodd' }])
  const sInk = sLoops.length ? loopsD(sLoops, 2) : ''
  if (sInk) nodes.push(['path', { d: sInk, 'fill-rule': 'evenodd', class: 'wm-s' }])
  add(B.ftext, paint('letter'), K.TOL, 0.1, 2)
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
