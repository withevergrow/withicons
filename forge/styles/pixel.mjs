// PIXEL — creative. Authentic pixel art on a 24x24 grid (1u per pixel; live icons keep their 16x16 sprites).
//
// Every centreline is rasterised into a clean one-pixel line (a generalised Bresenham on the true curve +
// "pixel-perfect" corner thinning), circles and arcs become hand-style pixel
// rings (the edge of a pixel disc, so step lengths vary 3 / 2 / 1 round the ring), rectangles keep straight edges
// with a one-pixel corner cut, round dots become a three-pixel dot (a set of dots, eyes, are 1x2 pixels), narrow
// parts of a solid (teeth, spikes) are solid ink, and the object's mass becomes a 4-tone sprite lit from the top left:
//   ink    currentColor                                   outline + detail
//   tone   var(--with-pixel-fill, currentColor) @ .28     body
//   shade  var(--with-pixel-fill, currentColor) @ .55     inner bottom-right rim
//   shine  var(--with-pixel-shine, #FFFFFF)               highlight pixel(s)
// That one-pixel line stays only where it bounds the body (the sprite's outline); detail and free line work (arrows,
// chevrons, checks, glyphs in a disc, handles, rings with no body) is drawn with a two-pixel brush (three on the
// centre column, so stems stay centred), arrowheads on a shaft are solid, and body left as a thin band beside a
// knockout (the solid style's way of drawing a stroke) is dropped (_pixel-render.mjs brush/arrowHeads).
// Signals (S plate) clear a one-pixel moat. The few icons the skeleton cannot carry at this size get hand-drawn
// 24-grid maps (_pixel-tune.mjs). Output: one merged h/v path per tone, root shape-rendering="crispEdges".
// Live icons (forge/DYNAMIC.md) stay on the 16 grid their composers were drawn for: text is re-set in a bitmap
// font (_pixel-text.mjs); calendars, dice, a thermometer, bars, the UV sun, tags and the weather glyphs are
// composed as pixel sprites, clock hands and battery charge are drawn from their geometry (_pixel-live.mjs); a
// count badge is a solid chip, and the drawing is placed by its frame so it keeps off the canvas edge at every value.
// crispEdges snaps every cell to whole device pixels, so cells are even only when the rendered size is a multiple
// of 24 device px (24/48/72 px; 16-grid live icons at 16/32/48). At 16 px a 24-grid cell is 2/3 of a device pixel
// and some one-pixel lines drop out. Keep crispEdges anyway: anti-aliased cells look worse than uneven ones.
import { build, nodes } from './_pixel-render.mjs'
import { pixelSnowman } from './_pixel-snowman.mjs'
import { pixelDragon } from './_pixel-dragon.mjs'

export default {
  name: 'pixel',
  title: 'Pixel',
  kind: 'creative',
  description: 'Hand-tuned 16-bit pixel art on a 24 grid: crisp one-pixel outlines, a shaded sprite body and a highlight pixel. Pixel-perfect at 24, 48 and 72 px.',
  strokeWidth: false,
  root: { fill: 'currentColor', 'shape-rendering': 'crispEdges' },
  render(icon) {
    // hand-drawn per-icon sprites in full colour (the skeleton stays the base for every other style)
    if (icon.name === 'snowman' && !icon.params) { try { return pixelSnowman() } catch { /* the generic build below */ } }
    if (icon.name === 'dragon-head' && !icon.params) { try { return pixelDragon() } catch { /* the generic build below */ } }
    try { return nodes(build(icon)) } catch { return [] }
  },
}
