// PIXEL — creative. Authentic pixel art on a 16x16 grid (1.5u per pixel).
//
// Every centreline is rasterised into a clean one-pixel line (a generalised
// Bresenham on the true curve + "pixel-perfect" corner thinning), 45deg runs are
// drawn with a two-pixel brush so diagonals weigh the same as straight lines,
// circles and arcs become canonical mirrored pixel rings, rectangles keep straight
// edges with a one-pixel corner cut, tiny closed shapes become solid blocks, and
// the object's mass becomes a 4-tone sprite lit from the top left:
//   ink    currentColor                                   outline + detail
//   tone   var(--with-pixel-fill, currentColor) @ .28     body
//   shade  var(--with-pixel-fill, currentColor) @ .6      inner bottom-right rim
//   shine  var(--with-pixel-shine, #FFFFFF)               highlight pixel(s)
// Signals (S plate) clear a one-pixel moat. The hardest icons get hand-drawn
// pixel maps (_pixel-maps.mjs) or pixel fixes (_pixel-tune.mjs). Output: one merged h/v path per
// tone, root shape-rendering="crispEdges".
// Live icons (forge/DYNAMIC.md): text is re-set in a bitmap font (_pixel-text.mjs); calendars, dice, a thermometer,
// bars, the UV sun, tags and the weather glyphs are composed as pixel sprites, clock hands and battery charge are
// drawn from their geometry (_pixel-live.mjs); a count badge is a solid chip, and the drawing is placed by its frame
// so it keeps off the canvas edge at every value.
// crispEdges snaps every cell to whole device pixels, so cells are even only when
// the rendered size is a multiple of 16 device px (16/32/48 px at 1x, 2x, 3x; 24 px
// at 2x). At 24 px on a 1x screen, or 16 px at 1.25x/1.5x, cells alternate 1 and 2 px.
// Keep crispEdges anyway: anti-aliased cells look worse than uneven ones.
import { build, nodes } from './_pixel-render.mjs'
import { pixelSnowman } from './_pixel-snowman.mjs'
import { pixelDragon } from './_pixel-dragon.mjs'

export default {
  name: 'pixel',
  title: 'Pixel',
  kind: 'creative',
  description: 'Hand-tuned 16-bit pixel art: crisp one-pixel outlines, a shaded sprite body and a highlight pixel. Pixel-perfect at 16, 32 and 48 px on 1x, 2x and 3x screens.',
  strokeWidth: false,
  root: { fill: 'currentColor', 'shape-rendering': 'crispEdges' },
  render(icon) {
    // hand-drawn per-icon sprites in full colour (the skeleton stays the base for every other style)
    if (icon.name === 'snowman' && !icon.params) { try { return pixelSnowman() } catch { /* the generic build below */ } }
    if (icon.name === 'dragon-head' && !icon.params) { try { return pixelDragon() } catch { /* the generic build below */ } }
    try { return nodes(build(icon)) } catch { return [] }
  },
}
