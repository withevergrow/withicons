// @withicons/motion — preset + effect metadata and the spec -> CSS-variable mapping.
// Shared by the runtime (index.js), the build (icons.css) and the website (motion.js).
// Keep this file tiny: no keyframe data here (that lives in keyframes.js).

// shot  = length of the one-shot action in seconds (hover / once / inview)
// cycle = default loop cycle in seconds. When cycle > shot the loop plays the action, then rests
//         (keyframes `wm-<preset>-loop`); otherwise the loop and the one-shot share `wm-<preset>`.
// origin = default pivot in the 24x24 grid, dir = default direction (deg, 0 = right, 90 = down),
// min   = shortest allowed duration in seconds (flicker: its opacity dips must stay under 3 flashes per second,
//         WCAG 2.3.1, however far it is sped up);
// ease  = element-level timing function (most presets ease per keyframe and ignore it; `steps`
//         applies to spin / tick / orbit, which use it).
export const PRESET_DEFAULTS = {
  'spin':      { shot: 1.2,  cycle: 1.2, ease: 'linear', intent: 'spins steadily' },
  'spin-once': { shot: 0.8,  cycle: 2.0, intent: 'turns once and settles' },
  'tick':      { shot: 1,    cycle: 1,   ease: 'steps(12)', intent: 'ticks round step by step' },
  'pulse':     { shot: 1.4,  cycle: 1.4, intent: 'pulses softly' },
  'beat':      { shot: 0.72, cycle: 1.2, intent: 'beats like a heart' },
  'breathe':   { shot: 3,    cycle: 3,   intent: 'breathes slowly and calmly' },
  'float':     { shot: 2.6,  cycle: 2.6, intent: 'floats gently up and down' },
  'bounce':    { shot: 1,    cycle: 1.15, origin: [12, 21], intent: 'bounces with a little squash' },
  'sway':      { shot: 2.8,  cycle: 2.8, origin: [12, 21], intent: 'sways from its base' },
  'ring':      { shot: 1.4,  cycle: 2.6, origin: [12, 3], intent: 'rings and settles' },
  'wiggle':    { shot: 0.8,  cycle: 2.0, intent: 'wiggles playfully' },
  'shake':     { shot: 0.6,  cycle: 1.8, intent: 'shakes no' },
  'nod':       { shot: 0.8,  cycle: 2.0, intent: 'nods yes' },
  'nudge':     { shot: 0.9,  cycle: 1.2, dir: 0, intent: 'nudges the way it points' },
  'pass':      { shot: 1.4,  cycle: 1.4, dir: 0, intent: 'slides through and comes back round' },
  'rise':      { shot: 1.6,  cycle: 1.6, intent: 'rises, fades and comes back' },
  'drop':      { shot: 1.6,  cycle: 1.6, intent: 'drops, fades and comes back' },
  'blink':     { shot: 0.42, cycle: 3.5, intent: 'blinks now and then' },
  'flicker':   { shot: 1.6,  cycle: 1.6, origin: [12, 21], min: 1.2, intent: 'flickers like a flame' },
  'twinkle':   { shot: 1.2,  cycle: 1.8, intent: 'twinkles and glints' },
  'pop':       { shot: 0.5,  cycle: 1.6, intent: 'pops with a springy bounce' },
  'tada':      { shot: 1,    cycle: 2.4, intent: 'celebrates with a tada' },
  'jelly':     { shot: 0.9,  cycle: 2.2, intent: 'wobbles like jelly' },
  'flip':      { shot: 1.2,  cycle: 2.4, intent: 'flips over like a coin' },
  'rock':      { shot: 2.4,  cycle: 2.4, origin: [12, 20], intent: 'rocks gently side to side' },
  'tilt':      { shot: 1.6,  cycle: 2.6, intent: 'leans in and holds' },
  'zoom':      { shot: 1.2,  cycle: 2.0, intent: 'zooms in and back' },
  'orbit':     { shot: 2.4,  cycle: 2.4, ease: 'linear', intent: 'drifts in a small circle' },
  'glow':      { shot: 1.8,  cycle: 1.8, intent: 'glows with a soft halo' },
  'draw':      { shot: 1.6,  cycle: 3.2, intent: 'draws itself on' },
  'type':      { shot: 0.9,  cycle: 1.4, intent: 'jitters like keystrokes' },
  'fill':      { shot: 1.6,  cycle: 2.0, intent: 'fills up like it is charging' },
  // 3D presets (run 12, forge/MOTION.md "3D motion"): the object turns in depth, its ground shadow and specular
  // highlight answer. Plain 2D affine keyframes (scale + skew from a camera a little above), so inline SVG, <with-icon>,
  // animated SVG, GIF and video all move the same.
  'turn':      { shot: 2,    cycle: 2,   ease: 'linear', d3: true, intent: 'turns round on a turntable' },
  'turn-once': { shot: 1.1,  cycle: 2.6, d3: true, intent: 'swivels all the way round once' },
  'wobble':    { shot: 2.4,  cycle: 2.4, ease: 'linear', d3: true, intent: 'wobbles in depth like a spinning top' },
  'chime':     { shot: 1.6,  cycle: 2.8, origin: [12, 3], d3: true, intent: 'swings and twists like a ringing bell' },
  'swivel':    { shot: 0.9,  cycle: 2.2, d3: true, intent: 'turns its head: no' },
  'bow':       { shot: 0.9,  cycle: 2.2, origin: [12, 18], d3: true, intent: 'bows toward you: yes' },
  'lean':      { shot: 1,    cycle: 1.6, dir: 0, d3: true, intent: 'leans in depth the way it points' },
  'lift':      { shot: 1.2,  cycle: 2.4, d3: true, intent: 'lifts toward you and settles' },
  'pump':      { shot: 0.8,  cycle: 1.3, d3: true, intent: 'beats toward you' },
  'squish':    { shot: 0.9,  cycle: 1.5, origin: [12, 21], d3: true, intent: 'hops and lands with a squish' },
  'drift':     { shot: 3.2,  cycle: 3.2, d3: true, intent: 'drifts and sways in the air' },
  'gleam':     { shot: 1.4,  cycle: 2.8, d3: true, intent: 'tilts to the light and gleams' },
  // part moves (soft3d): the raised parts (plates wm-a / wm-s) move on the body
  'pop-up':    { shot: 1,    cycle: 2.2, d3: true, intent: 'its raised parts pop up and land back' },
  'press':     { shot: 0.7,  cycle: 1.8, d3: true, intent: 'its raised parts press down like a button' },
  'hop':       { shot: 0.8,  cycle: 1.6, origin: [12, 21], d3: true, intent: 'hops with a squash' },
}
export const PRESETS = Object.keys(PRESET_DEFAULTS)
// presets that read --wm-dx / --wm-dy
export const DIRECTIONAL = ['nudge', 'pass', 'lean']
/** The 3D presets (PRESET_DEFAULTS[p].d3). */
export const PRESETS_3D = PRESETS.filter(p => PRESET_DEFAULTS[p].d3)

// ---- style-aware motion: the 3D profile. Styles that draw objects with volume (rich gradients, materials, ground
// shadows) play an icon's own motion as its 3D counterpart, keeping the intent: a spin turns on a turntable, a pop
// lands with a squish, a float drifts in depth. Flat styles keep their motion exactly.
export const STYLES_3D = ['clay', 'dock', 'liquid', 'chrome', 'soft3d', 'luxe', 'skeuo', 'glass', 'plush']
// source preset -> { preset, amount (multiplier), time (duration multiplier, only for an explicit duration) }.
// Presets not listed keep themselves (tick, pass, drop, blink, flicker, draw, type, fill and the 3D presets).
// Stepped motion (steps > 0: loaders, clock hands) is mechanical and is never mapped.
export const PROFILE_3D = {
  'spin': { preset: 'turn' },
  'spin-once': { preset: 'turn-once' },
  'flip': { preset: 'turn-once' },
  'tada': { preset: 'turn-once' },
  'orbit': { preset: 'wobble' },
  'sway': { preset: 'wobble', amount: 0.7 },
  'rock': { preset: 'wobble' },
  'tilt': { preset: 'lean' },
  'nudge': { preset: 'lean' },
  'ring': { preset: 'chime' },
  'wiggle': { preset: 'swivel', amount: 0.6 },
  'shake': { preset: 'swivel', time: 1.4 },
  'nod': { preset: 'bow', time: 1.1 },
  'beat': { preset: 'pump' },
  'pulse': { preset: 'lift', amount: 0.7 },
  'zoom': { preset: 'lift' },
  'rise': { preset: 'lift' },
  'bounce': { preset: 'squish' },
  'pop': { preset: 'squish', amount: 0.8, time: 1.6 },
  'jelly': { preset: 'squish' },
  'float': { preset: 'drift' },
  'breathe': { preset: 'drift', amount: 0.6 },
  'glow': { preset: 'gleam' },
  'twinkle': { preset: 'gleam' },
}
// Styles whose decoration is a BACKDROP (a tile / plate behind the glyph, tagged wm-deco): the backdrop stays still
// (deco 'still') whatever the icon's spec says, so the tile never drifts under the glyph. A preset that animates the
// whole icon (wrapper mode, no part tags) still moves it; motion(el, …, { deco }) can opt back in.
export const BACKDROP_STYLES = ['bento', 'dock']
/** True for a style whose decoration is a still backdrop (BACKDROP_STYLES). */
export function isBackdropStyle(style) { return BACKDROP_STYLES.includes(String(style || '').split('@').pop()) }
/** True for a style whose motion plays in 3D (STYLES_3D). */
export function is3dStyle(style) { return STYLES_3D.includes(String(style || '').split('@').pop()) }
const clampAmount = k => Math.round(Math.max(0.25, Math.min(2, k)) * 1000) / 1000
/** A motion object ({ preset, origin, dir, amount, duration, steps, delay }) -> its 3D counterpart (a new object). */
export function motion3d(m) {
  if (!m || typeof m !== 'object') return m
  const to = PROFILE_3D[m.preset]
  if (!to || m.steps > 0) return m
  const out = Object.assign({}, m, { preset: to.preset })
  if (to.amount != null) out.amount = clampAmount((m.amount == null ? 1 : Number(m.amount)) * to.amount)
  if (to.time != null && m.duration > 0) out.duration = Math.round(Math.min(6, m.duration * to.time) * 1000) / 1000
  // a pivot or direction the 3D preset does not read is dropped (its own default applies)
  if (m.dir != null && !DIRECTIONAL.includes(to.preset)) delete out.dir
  return out
}
/** A motion object as the given style plays it: the 3D counterpart for STYLES_3D, unchanged otherwise. */
export function styleMotion(m, style) { return is3dStyle(style) ? motion3d(m) : m }
// Per-style move lists ("Made for <icon>" chips): a style listed here gives every icon min-max moves of its own: the
// icon's own motion (loop, hover, alt) as the style plays it (styleSpec), then the part moves when the drawing has
// raised parts (plates wm-a / wm-s), then generic moves until there are `min`.
export const MOVE_PROFILES = {
  soft3d: { min: 3, max: 5, parts: ['pop-up', 'press'], generic: ['hop', 'turn', 'gleam', 'lift', 'wobble', 'drift', 'squish'] },
}
/**
 * The moves an icon offers in a style: [{ preset, ...options }], the icon's own first, no preset twice.
 * o.parts: true / false = the drawing has plates (wm-a / wm-s); default: the spec names parts.
 * Styles without a MOVE_PROFILES entry: the icon's own moves (3D styles: their 3D counterparts); flat styles: exactly
 * [loop, hover, ...alt] without repeats.
 */
export function styleMoves(spec, style, o) {
  o = o || {}
  const sp = styleSpec(spec, style) || {}
  const out = []
  const add = m => { if (m && PRESET_DEFAULTS[m.preset] && !out.some(x => x.preset === m.preset)) out.push(m) }
  ;[sp.loop, sp.hover].concat(sp.alt || []).forEach(add)
  const prof = MOVE_PROFILES[String(style || '').split('@').pop()]
  if (!prof) return out
  const parts = o.parts != null ? !!o.parts : !!(spec && spec.parts && (spec.parts.A || spec.parts.S))
  if (parts) for (const q of prof.parts) if (out.length < prof.max) add({ preset: q })
  for (const q of prof.generic) { if (out.length >= prof.min) break; add({ preset: q }) }
  return out.slice(0, prof.max)
}
/** A whole spec (loop, hover, alt, parts, deco) as the given style plays it: the 3D counterpart for STYLES_3D, a
 *  still backdrop for BACKDROP_STYLES. Other styles get the same object back. */
export function styleSpec(spec, style) {
  if (!spec || typeof spec !== 'object') return spec
  const d3 = is3dStyle(style), still = isBackdropStyle(style)
  if (!d3 && !still) return spec
  const out = Object.assign({}, spec)
  if (still) out.deco = 'still'
  if (!d3) return out
  Object.assign(out, { loop: motion3d(spec.loop), hover: motion3d(spec.hover), d3: true })
  if (Array.isArray(spec.alt)) out.alt = spec.alt.map(motion3d)
  if (spec.parts && typeof spec.parts === 'object') {
    out.parts = {}
    for (const k of Object.keys(spec.parts)) out.parts[k] = motion3d(spec.parts[k])
  }
  return out
}

// Swap effects: duration in seconds of one A -> B transition.
export const EFFECT_DEFAULTS = {
  'fade': { dur: 0.3 }, 'scale': { dur: 0.45 }, 'rotate': { dur: 0.5 }, 'flip': { dur: 0.6 },
  'slide-up': { dur: 0.42 }, 'slide-down': { dur: 0.42 }, 'slide-left': { dur: 0.42 }, 'slide-right': { dur: 0.42 },
  'blur': { dur: 0.45 }, 'spin': { dur: 0.55 }, 'morph': { dur: 0.55 }, 'draw': { dur: 0.75 },
}
export const EFFECTS = Object.keys(EFFECT_DEFAULTS)

// Swap timing. A swap that turns into B and back on its own (trigger 'auto', class wm-swap-auto) rests `hold`
// seconds on each icon: one cycle = 2 x (transition + hold). SWAP_HOLD makes the default fade cycle 2.4 s, the same as
// the original .wm-swap.wm-loop.
export const SWAP_HOLD = 0.9
export function swapCycle(dur, hold) { return r4(2 * ((Number(dur) || 0) + (hold == null || hold === '' ? SWAP_HOLD : Math.max(0, Number(hold) || 0)))) }
// Named feels for --wm-swap-ease (the easing of the incoming icon). 'natural' = no override: each effect keeps its own
// tuned easing (a spring for scale / rotate / spin / morph, a soft landing for the rest).
export const SWAP_EASES = {
  natural: null,
  springy: 'cubic-bezier(.3,1.75,.5,1)',
  smooth: 'cubic-bezier(.65,0,.35,1)',
  snappy: 'cubic-bezier(.12,.9,.18,1)',
  gentle: 'cubic-bezier(.4,0,.2,1)',
  linear: 'linear',
}
/** A named feel (SWAP_EASES) or any CSS easing -> a CSS easing string, or null for the effect's own. */
export function swapEase(e) {
  if (e == null || e === '' || e === 'natural' || e === 'auto') return null
  return Object.prototype.hasOwnProperty.call(SWAP_EASES, e) ? SWAP_EASES[e] : String(e)
}

const r4 = n => Math.round(n * 1e4) / 1e4
const fmt = n => String(r4(n)).replace(/^0\./, '.').replace(/^-0\./, '-.')
export const pct = v => fmt(v / 24 * 100) + '%'
export function dirVec(deg) {
  const a = (Number(deg) || 0) * Math.PI / 180
  return [r4(Math.cos(a)), r4(Math.sin(a))]
}
export function hasLoopVariant(preset) {
  const d = PRESET_DEFAULTS[preset]
  return !!d && (preset === 'draw' || d.cycle > d.shot + 1e-9)
}
export function keyframeName(preset, loop) {
  return 'wm-' + preset + (loop && hasLoopVariant(preset) ? '-loop' : '')
}

// A motion object ({ preset, origin, dir, amount, duration, steps }) -> the CSS custom properties for one slot.
//   slot 'L' (loop) or 'H' (hover / one-shot);  full = also emit values equal to the defaults.
// Emits: --wm<S> (keyframes) --wm<S>-d (duration) [-m minimum duration] [-e ease] [-ox -oy origin] [-k amount] [-dx -dy direction]
export function slotVars(m, slot, full) {
  const o = {}
  if (!m || !PRESET_DEFAULTS[m.preset]) return o
  const d = PRESET_DEFAULTS[m.preset]
  const loop = slot === 'L'
  const p = '--wm' + slot
  o[p] = keyframeName(m.preset, loop)
  o[p + '-d'] = fmt(Math.max(d.min || 0, m.duration > 0 ? m.duration : (loop ? d.cycle : d.shot))) + 's'
  if (d.min) o[p + '-m'] = fmt(d.min) + 's'
  const ease = m.steps > 0 ? 'steps(' + Math.round(m.steps) + ')' : d.ease
  if (ease && (full || ease !== 'linear')) o[p + '-e'] = ease
  const origin = m.origin || d.origin
  if (origin && (full || origin[0] !== 12 || origin[1] !== 12)) { o[p + '-ox'] = pct(origin[0]); o[p + '-oy'] = pct(origin[1]) }
  else if (full) { o[p + '-ox'] = '50%'; o[p + '-oy'] = '50%' }
  const k = m.amount == null ? 1 : Number(m.amount)
  if (full || k !== 1) o[p + '-k'] = fmt(k)
  if (DIRECTIONAL.includes(m.preset) || m.dir != null) {
    const [dx, dy] = dirVec(m.dir != null ? m.dir : (d.dir || 0))
    if (full || dx !== 1 || dy !== 0) { o[p + '-dx'] = fmt(dx); o[p + '-dy'] = fmt(dy) }
  }
  return o
}
// The reverse, on a live element: the icon's own preset (and direction) for one slot, read from what icons.css set
// on it ([data-wm="<name>"] / with-icon[name="<name>"]). This is how the runtime knows an icon's defaults without
// bundling the 500-icon spec table. null when icons.css is not loaded or the element is not in the document.
export function cssSlot(el, loop) {
  if (!el || typeof getComputedStyle !== 'function') return null
  let cs
  try { cs = getComputedStyle(el) } catch { return null }
  if (!cs || !cs.getPropertyValue) return null
  const p = '--wm' + (loop ? 'L' : 'H')
  const m = /^wm-([a-z-]+?)(?:-loop)?$/.exec(String(cs.getPropertyValue(p) || '').trim())
  if (!m || !PRESET_DEFAULTS[m[1]]) return null
  const out = { preset: m[1] }
  const dx = parseFloat(cs.getPropertyValue(p + '-dx')), dy = parseFloat(cs.getPropertyValue(p + '-dy'))
  if (!isNaN(dx) && !isNaN(dy)) out.dir = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360
  return out
}
// Both slots of a spec -> one flat object of custom properties.
export function specVars(spec, full) {
  return Object.assign({}, slotVars(spec && spec.loop, 'L', full), slotVars(spec && spec.hover, 'H', full), partVars(spec, 'L'), partVars(spec, 'H'))
}

// ---- parts choreography (forge/MOTION.md). Renderers tag SVG nodes: wm-k / wm-a / wm-s (object plates), wm-deco
// (decoration: backdrop shapes, sparkles, accent dots), wm-shadow (cast shadow / ground), wm-shine (highlight).
// Untagged nodes and wm-k / wm-shine are the object and play the main preset.
export const PART_CLASSES = ['wm-a', 'wm-s', 'wm-deco', 'wm-shadow']
/** The role of a node from its class attribute: 'obj' | 'a' | 's' | 'deco' | 'shadow' (+ 'shine' with o.shine: the
 *  highlight, which 3D presets move on their own; without it a highlight is part of the object). */
export function partRole(cls, o) {
  const c = ' ' + String(cls || '').replace(/\s+/g, ' ') + ' '
  return c.includes(' wm-deco ') ? 'deco' : c.includes(' wm-shadow ') ? 'shadow' : c.includes(' wm-a ') ? 'a' : c.includes(' wm-s ') ? 's' : o && o.shine && c.includes(' wm-shine ') ? 'shine' : 'obj'
}
/** True when SVG markup carries part tags (then motion animates parts instead of the whole icon). */
export function hasParts(markup) { return /\sclass="[^"]*\bwm-(?:a|s|deco|shadow)\b/.test(String(markup || '')) }
// The decoration loop chosen by the engine when a spec has no `deco`: turning objects keep their backdrop calm
// (breathe), swinging / shaking ones let it drift (float), lifting / beating ones make sparkles twinkle.
export const DECO_DEFAULT = {
  'spin': 'breathe', 'spin-once': 'breathe', 'tick': 'breathe', 'orbit': 'breathe', 'flip': 'breathe', 'nudge': 'breathe', 'pass': 'breathe',
  'draw': 'breathe', 'fill': 'breathe', 'blink': 'breathe', 'glow': 'breathe', 'flicker': 'breathe', 'twinkle': 'breathe', 'zoom': 'breathe',
  'ring': 'float', 'wiggle': 'float', 'shake': 'float', 'nod': 'float', 'type': 'float', 'tilt': 'float', 'sway': 'float', 'rock': 'float', 'breathe': 'float',
  'bounce': 'twinkle', 'float': 'twinkle', 'rise': 'twinkle', 'drop': 'twinkle', 'jelly': 'twinkle', 'beat': 'twinkle', 'pulse': 'twinkle', 'pop': 'twinkle', 'tada': 'twinkle',
  'turn': 'breathe', 'turn-once': 'breathe', 'gleam': 'breathe', 'wobble': 'float', 'chime': 'float', 'swivel': 'float', 'bow': 'float', 'lean': 'float',
  'lift': 'twinkle', 'pump': 'twinkle', 'squish': 'twinkle', 'drift': 'twinkle', 'pop-up': 'twinkle', 'press': 'float', 'hop': 'twinkle',
}
export const DECO_KINDS = ['breathe', 'float', 'twinkle', 'still']
export function decoOf(preset, deco) { return DECO_KINDS.includes(deco) ? deco : (DECO_DEFAULT[preset] || 'breathe') }
// A deco loop lasts a whole number of the object's cycles (~2.8 s), so exports of n cycles loop seamlessly.
export const DECO_CYCLE = 2.8
export function decoTimes(cycle) { return Math.max(1, Math.round(DECO_CYCLE / (Number(cycle) || DECO_CYCLE))) }
// Lifting presets whose cast shadow has keyframes of its own (wm-shadow-<preset>[-loop] in motion.css: travels with the
// object, lagging and fading as it rises); kept in step with keyframes.js SHADOW_STOPS. Other presets move the shadow as the object.
// The 3D presets that lift or turn give the shadow its own ground keyframes too (it stays down, shrinks and fades).
export const GROUND_PRESETS = ['bounce', 'float', 'rise', 'turn', 'turn-once', 'lift', 'pump', 'squish', 'drift', 'pop-up', 'press', 'hop']
// 3D presets whose specular highlight (wm-shine) slides and brightens as the surface turns to the light: keyframes
// wm-shine-<preset>[-loop] in motion.css (keyframes.js SHINE). Other presets move the highlight with the object.
// Part moves: the plates (wm-a / wm-s) play their own keyframes wm-plate-<preset>[-loop] (keyframes.js D3[p].plates),
// unless the spec gives a plate its own preset.
/** 'wm-plate-<preset>' or 'wm-plate-<preset>-loop'. */
export function plateName(preset, loop) { return 'wm-plate-' + preset + (loop && hasLoopVariant(preset) ? '-loop' : '') }
export const PLATE_PRESETS = ['pop-up', 'press', 'hop']
export const SHINE_PRESETS = ['turn', 'turn-once', 'wobble', 'chime', 'swivel', 'bow', 'lean', 'lift', 'pump', 'squish', 'drift', 'gleam']
const PART_KEYS = ['A', 'S']
// The parts variables of one slot ('L' loop / 'H' one-shot) of a spec: decoration loop, ground shadow and plate overrides.
//   --wm<S>-dc (deco keyframes, when not breathe) --wmL-dd (deco loop length) --wm<S>-sh (ground shadow keyframes)
//   --wm<S>-sn (highlight keyframes of 3D presets)
//   --wm<S>-a / -s (plate keyframes) + -a-d -a-k -a-ox -a-oy -a-e -a-dx -a-dy -a-dl (only what differs from the object)
export function partVars(spec, slot) {
  const o = {}
  const loop = slot === 'L'
  const m = spec && (loop ? spec.loop : spec.hover)
  if (!m || !PRESET_DEFAULTS[m.preset]) return o
  const p = '--wm' + slot
  const d = PRESET_DEFAULTS[m.preset]
  const kind = decoOf(m.preset, spec.deco)
  if (kind !== 'breathe') o[p + '-dc'] = kind === 'still' ? 'none' : 'wm-deco-' + kind
  if (loop) {
    const dur = Math.max(d.min || 0, m.duration > 0 ? m.duration : d.cycle)
    const dd = r4(dur * decoTimes(dur))
    if (dd !== DECO_CYCLE) o[p + '-dd'] = fmt(dd) + 's'
  }
  if (GROUND_PRESETS.includes(m.preset)) o[p + '-sh'] = 'wm-shadow-' + m.preset + (loop && hasLoopVariant(m.preset) ? '-loop' : '')
  if (PLATE_PRESETS.includes(m.preset)) o[p + '-p'] = plateName(m.preset, loop)
  if (SHINE_PRESETS.includes(m.preset)) o[p + '-sn'] = 'wm-shine-' + m.preset + (loop && hasLoopVariant(m.preset) ? '-loop' : '')
  // a part move is the plates' own motion: plate overrides do not apply to it
  const parts = PLATE_PRESETS.includes(m.preset) ? {} : spec.parts || {}
  for (const K of PART_KEYS) {
    const q = parts[K]
    if (!q || typeof q !== 'object') continue
    const x = p + '-' + K.toLowerCase()
    const preset = PRESET_DEFAULTS[q.preset] ? q.preset : m.preset
    const same = preset === m.preset, pd = PRESET_DEFAULTS[preset]
    o[x] = PLATE_PRESETS.includes(preset) ? plateName(preset, loop) : keyframeName(preset, loop)
    if (loop && q.duration > 0) o[x + '-d'] = fmt(Math.max(pd.min || 0, q.duration)) + 's'
    if (q.amount != null) o[x + '-k'] = fmt(Number(q.amount))
    else if (!same) o[x + '-k'] = '1'
    const origin = q.origin || (!same && pd.origin) || null
    if (origin) { o[x + '-ox'] = pct(origin[0]); o[x + '-oy'] = pct(origin[1]) }
    if (q.steps > 0) o[x + '-e'] = 'steps(' + Math.round(q.steps) + ')'
    else if (!same) o[x + '-e'] = pd.ease || 'linear'
    if (q.dir != null) { const [dx, dy] = dirVec(q.dir); o[x + '-dx'] = fmt(dx); o[x + '-dy'] = fmt(dy) }
    if (q.delay > 0) o[x + '-dl'] = fmt(Number(q.delay)) + 's'
  }
  return o
}
