// DUO — universal. Line on top of the icon's mass at 20%. Everything defaults to currentColor; the optional looks are
// CSS variables (one-click presets as data in _duo-presets.mjs):
//   --with-duo          the tint (the object's mass)
//   --with-duo-accent   ONE accent detail per icon (badge / slash / inner part; _duo-accent.mjs, from Linear)
//   --with-duo-from/to  the lines swept with one diagonal gradient (from Spectrum): only in the gradient render,
//                       variants.gradient below (one defs node, id wg-duo-<icon>-0, rich-style rules)
// With no variable set both renders look exactly like plain Duo. The default render has no defs (see _duo-core.mjs
// for why). Build logic: _duo-core.mjs.
//
// Parts (forge/MOTION.md "Parts choreography"): lines carry their plate like Line
// (wm-a / wm-s, K untagged). A tone fill takes the plate whose centrelines its
// outline follows, so a moving part's tint moves with it.
import { snowmanFor } from './_line-snowman.mjs'
import { build, plain } from './_duo-core.mjs'

const safely = fn => icon => {
  icon = snowmanFor('duo', icon)
  try { return fn(icon) } catch {
    try { return plain(icon) } catch { return [] }
  }
}

export default {
  name: 'duo',
  title: 'Duo',
  kind: 'universal',
  description: 'The line drawing over a soft tonal fill of the object\'s mass. Recolour the tone with --with-duo and the accent detail with --with-duo-accent.',
  strokeWidth: 1.75,
  root: { fill: 'none', stroke: 'currentColor', 'stroke-width': 1.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
  render: safely(icon => build(icon)),
  // opt-in renders of the same style (same root, strokeWidth, part classes): gradient = lines painted with
  // var(--with-duo-from) -> var(--with-duo-to) (both default currentColor). Used by the "gradient" preset.
  variants: {
    gradient: safely(icon => build(icon, { gradient: true })),
  },
}
