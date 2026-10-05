// @withicons/motion — tiny, dependency-free runtime for the with icons motion system.
// The animations themselves are pure CSS (motion.css + icons.css); the runtime (runtime.js) only toggles classes and
// CSS variables, prepares strokes for `draw`, and builds swaps. SSR-safe: nothing touches the DOM on import.
// This entry adds the 500-icon spec table (icons.js) for motionFor() and motionAttrs(); a bundler drops the table from
// apps that only animate, and an unbundled page (CDN) that only animates imports runtime.js or the element instead.
import SPECS from './icons.js'
import { plan } from './runtime.js'

export { PRESETS, EFFECTS, PRESET_DEFAULTS, EFFECT_DEFAULTS, SWAP_HOLD, SWAP_EASES, swapEase, swapCycle, specVars, slotVars, keyframeName } from './runtime.js'
export { prepareDraw, unprepareDraw, partsSvg, pauseWhenOffscreen, motion, swap } from './runtime.js'

// The spec table (500 icons, ~29 KB gzipped) is only reached through motionFor() and motionAttrs(). motion(), swap() and
// the element read an icon's defaults from icons.css on the live element instead (cssSlot).
const specTable = () => SPECS
const own = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k)

/** The icon's motion spec ({ intent, loop, hover, alt?, swap? }), or null. */
export function motionFor(name) {
  const t = specTable()
  return typeof name === 'string' && own(t, name) ? t[name] : null
}

/**
 * The attributes that make an icon wrapper move, for markup you write yourself (frameworks, SSR, copy-paste):
 * motionAttrs('bell', { trigger: 'hover', preset: 'shake', amount: 1.5 })
 *   -> { class: 'wm wm-hover wm-p-shake', 'data-wm': 'bell', style: '--wm-k:1.5' }
 * Note: 'inview', hover that always finishes, and 'draw' strokes also need motion() at runtime.
 */
export function motionAttrs(nameOrSpec, options) {
  const p = plan(nameOrSpec, options || {}, null, (n, loop) => { const s = motionFor(n); return s && (loop ? s.loop : s.hover) })
  const out = { class: p.classes.join(' ') }
  if (p.name) out['data-wm'] = p.name
  const style = Object.keys(p.vars).map(k => k + ':' + p.vars[k]).join(';')
  if (style) out.style = style
  return out
}
