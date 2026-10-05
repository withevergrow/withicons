// STICKER helper — the candy palette, how an icon picks its colours, and per-icon tuning.
//
// Every colour is a CSS custom property with a literal fallback (contract: Palette
// styles). The ink and the hairline stay currentColor, so `color` still recolours
// the line work; the candy fills are the sticker's printed colours.
import { rng } from '../kernel/geom.mjs'

// name -> [default, role]
export const PALETTE = {
  bubblegum: ['#FF6FB5', 'candy pink fill'],
  lemon:     ['#FFD43B', 'sunny yellow fill'],
  mint:      ['#3FDDA4', 'fresh green fill'],
  sky:       ['#5BC6FF', 'clear blue fill'],
  grape:     ['#A98BFF', 'lilac fill'],
  peach:     ['#FF9563', 'tangerine fill'],
}
export const VAR = name => `var(--with-sticker-${name}, ${PALETTE[name][0]})`

export const EDGE = 'var(--with-sticker-edge, #FFFFFF)'      // the die-cut paper border
export const INK = 'var(--with-sticker-ink, #1D1530)'        // outlines and detail lines (printed ink: reads on any ground)
export const SHINE = 'var(--with-sticker-shine, #FFFFFF)'    // gloss dash + dot
export const SHADOW = 'var(--with-sticker-shadow, #1D1530)'  // soft drop shadow (multiplied by opacity)

const NAMES = Object.keys(PALETTE)
// each primary has a partner for parts, doors, screens, handles and badges
export const PARTNER = { bubblegum: 'lemon', lemon: 'bubblegum', mint: 'grape', sky: 'lemon', grape: 'mint', peach: 'sky' }
// the sparkle wants a colour that reads on white AND on near-black, and differs from the body
const SPARK = { bubblegum: 'sky', lemon: 'bubblegum', mint: 'bubblegum', sky: 'bubblegum', grape: 'peach', peach: 'grape' }

// meaning first: things with an obvious colour get it
const SEMANTIC = [
  [/heart|smile|gift|cake|kiss|flower/, 'bubblegum'],
  [/star|sun|zap|bolt|lightbulb|sparkle|crown|trophy|award|coins?|dollar|banknote|lightning|medal/, 'lemon'],
  [/cloud|droplet|snow|umbrella|wind|globe|water|wave|plane|send|mail/, 'sky'],
  [/leaf|tree|plant|check|battery|recycle|sprout|money|wallet/, 'mint'],
  [/flame|fire|alert|ban|trash|stop|bug|power|record/, 'peach'],
  [/moon|lock|key|shield|music|bot|brain|magic|wand|crystal|game/, 'grape'],
]

// per-icon tuning:
//   primary / accent   palette names (override the semantic + hash pick)
//   noFill             ignore the fills: every line becomes a candy tube (wifi, bluetooth)
//   tubes              keep the fills, but every line outside them is a tube
//   mono               every fill in the primary colour
//   panel              'paper' | 'none': what closed cutouts become (default: printed in the accent)
//   sparkles           0 | 1 | 2 decorations;  deco: 'sparkle' | 'heart' | 'star' for the big one
//   noShine            no gloss dash
//   fillColours        { <index into icon.fills>: palette name | 'ink' } to recolour single fills (wheels)
//   hub                palette name | 'ink': closed cutouts inside recoloured fills are printed in it (axles, hubs)
//   panelColours       { <index into icon.cutouts>: palette name | 'paper' } prints that closed cutout in its own colour
//   tubePaths          indexes into icon.paths drawn as candy tubes on top (forks, handlebars);  tube: their colour
export const TUNE = {
  // Live icons (forge/DYNAMIC.md): the dry part of a humidity drop is empty paper, not a second colour
  'humidity': { primary: 'sky', panel: 'paper' },
  'x-circle': { primary: 'peach' },
  'close': { primary: 'peach' },
  'minus-circle': { primary: 'peach' },
  'plus-circle': { primary: 'mint' },
  'check-circle': { primary: 'mint' },
  'check-square': { primary: 'mint' },
  'badge-check': { primary: 'sky' },
  'info-circle': { primary: 'sky' },
  'help-circle': { primary: 'grape' },
  'thumbs-up': { primary: 'lemon' },
  'thumbs-down': { primary: 'grape' },
  'heart-pulse': { primary: 'bubblegum', accent: 'lemon' },
  'coffee': { primary: 'peach' },
  'pill': { primary: 'bubblegum' },
  'rocket': { primary: 'sky', accent: 'bubblegum' },
  'flag': { primary: 'bubblegum' },
  'mountain': { primary: 'mint' },
  'eye': { primary: 'sky' },
  'eye-off': { primary: 'sky' },
  'palette': { primary: 'lemon' },
  'wifi': { noFill: true, primary: 'sky' },
  'bluetooth': { noFill: true, primary: 'sky' },
  'bold': { panel: 'paper' },
  'sparkles': { sparkles: 1, deco: 'heart' },
  'wand': { sparkles: 1 },
  'wifi-off': { noFill: true, primary: 'sky' },
  'party-popper': { primary: 'bubblegum', accent: 'lemon', tube: 'sky' },
  'rainbow': { primary: 'grape', panelColours: { 0: 'bubblegum', 1: 'lemon', 2: 'sky' }, sparkles: 2 },
  // the body wedge is thin: print it in a loud colour, the wheels as ink tyres with candy hubs, the fork as a tube
  'motorcycle': { primary: 'bubblegum', accent: 'lemon', fillColours: { 0: 'lemon', 1: 'lemon' }, hub: 'ink', tubePaths: [4], tube: 'sky' },
}

const hash = s => { const r = rng('sticker:' + s); r(); return r() }

// Live icons (forge/DYNAMIC.md): colours that follow what the icon shows (a sunny sky is lemon, a night is grape)
export const LIVE_TUNE = {
  'weather': p => p.condition === 'sunny' ? { primary: 'lemon', accent: 'lemon', tube: 'lemon' }
    : p.condition === 'night' ? { primary: 'lemon', accent: 'grape' }
    : p.condition === 'partly' ? { primary: 'sky', accent: 'lemon', tube: 'lemon' }
    : p.condition === 'storm' ? { primary: 'grape', accent: 'lemon', tube: 'lemon' }
    : { primary: 'sky', accent: 'grape' },
  'uv-index': () => ({ primary: 'lemon', accent: 'peach', tube: 'peach' }),
  'rating-stars': () => ({ primary: 'lemon', accent: 'lemon' }),
  'wind-speed': () => ({ primary: 'sky', tube: 'sky' }),
  // the empty tube above the column is clear glass (paper), never a second colour that reads as more mercury
  'thermometer-level': () => ({ primary: 'sky', accent: 'bubblegum', panel: 'paper' }),
}

export function colours(icon) {
  const name = String(icon.name || '')
  const lt = icon.params && LIVE_TUNE[name] ? LIVE_TUNE[name](icon.params) : null
  const t = lt ? { ...(TUNE[name] || {}), ...lt } : TUNE[name] || {}
  let primary = t.primary
  if (!primary) for (const [re, c] of SEMANTIC) if (re.test(name)) { primary = c; break }
  if (!primary) primary = NAMES[Math.floor(hash(name) * NAMES.length) % NAMES.length]
  const accent = t.accent || PARTNER[primary]
  return { primary, accent, spark: t.spark || SPARK[primary], tune: t }
}

// badge / modifier colour from what the icon says
export function signalColour(name, fallback) {
  if (/check|charging|ring|call/.test(name)) return 'mint'
  if (/-x$|off|minus|alert|unlink/.test(name)) return 'peach'
  if (/plus|upload|download/.test(name)) return 'sky'
  return fallback
}
