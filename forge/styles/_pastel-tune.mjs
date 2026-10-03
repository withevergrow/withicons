// PASTEL tuning — which pastel hues an icon wears (main / part / inlay / badge), decided by
// meaning first (a heart is blush, a leaf is mint, a star is butter, a cloud is sky) and by a
// stable hash of its family otherwise. Skeletons stay style-agnostic: everything Pastel needs
// to know about one icon lives here. Redraw authors pick hues by name in their layers instead.
import { rng } from '../kernel/geom.mjs'

// harmonious sets: main field, A parts, inlays (openings, screens, doors), S badges
export const SETS = {
  lavender: { main: 'lavender', part: 'peach', inlay: 'sky', badge: 'butter' },
  peach:    { main: 'peach', part: 'lavender', inlay: 'butter', badge: 'mint' },
  mint:     { main: 'mint', part: 'sky', inlay: 'butter', badge: 'peach' },
  sky:      { main: 'sky', part: 'lavender', inlay: 'butter', badge: 'peach' },
  butter:   { main: 'butter', part: 'peach', inlay: 'lavender', badge: 'sky' },
  blush:    { main: 'blush', part: 'lavender', inlay: 'butter', badge: 'mint' },
}

// meaning -> main hue (matched against every word of the name, first hit wins)
const WORDS = {
  blush: 'apple heart love gift kiss baby bookmark ribbon balloon party cake donut cookie candy rose lips flower palette paintbrush tag ticket wine strawberry pill bandage hospital ambulance siren angry',
  peach: 'fire flame coffee cup tea soup pizza burger cooking chef utensils food bread egg shopping cart bag basket store package box truck backpack luggage briefcase cat dog paw rabbit fox hand thumbs handshake person accessibility sunset hotel sofa bed bath door sunrise',
  butter: 'star sun bell lightbulb lamp zap bolt flash lightning trophy medal award crown key coins coin banknote lemon sparkles sparkle wand folder sticky notepad hourglass alarm smile laugh meh frown taxi school pencil highlighter',
  mint: 'leaf plant tree sprout salad palm check success dollar euro pound money wallet piggy battery recycle eco health stethoscope syringe tooth dna flask microscope tennis football basketball volleyball dumbbell bike turtle frog mountain tent map route signpost compass parking',
  sky: 'file files cloud rain snow snowflake droplet drop water wave umbrella fish ship anchor plane send wifi signal bluetooth globe earth ice wind mail inbox phone smartphone tablet laptop monitor tv webcam video camera image images picture gallery film download upload share link cast radio headphones headset speaker volume microphone podcast audio thermometer bird bus train car motorcycle',
  lavender: 'user users arrow chevron chevrons corner moon night settings lock unlock shield key search zoom calendar music rocket code terminal cpu server database bot brain atom gamepad layers layout panel sidebar kanban columns table chart activity gauge clock timer watch history loader refresh rotate repeat undo redo',
}
const WORD_HUE = new Map()
for (const [hue, list] of Object.entries(WORDS)) for (const w of list.split(/\s+/)) if (!WORD_HUE.has(w)) WORD_HUE.set(w, hue)

// exact names that need a different hue than their words suggest
const NAMES = {
  'home': 'peach', 'mail': 'sky', 'bell': 'butter', 'heart': 'blush', 'star': 'butter', 'cloud': 'sky', 'folder': 'butter',
  'file': 'sky', 'coffee': 'peach', 'trash': 'mint', 'music-note': 'blush', 'camera': 'lavender', 'search': 'lavender',
  'lock': 'lavender', 'settings': 'lavender', 'calendar': 'lavender', 'rocket': 'lavender', 'check': 'mint',
  'arrow-right': 'lavender', 'x': 'blush', 'close': 'blush', 'alert-triangle': 'butter', 'alert-circle': 'blush', 'info': 'sky', 'help': 'lavender',
  'plus': 'mint', 'minus': 'blush', 'eye': 'sky', 'eye-off': 'sky', 'moon': 'lavender', 'sun': 'butter', 'flower': 'blush',
  'gem': 'sky', 'crown': 'butter', 'gift': 'blush', 'leaf': 'mint', 'tree': 'mint', 'rainbow': 'sky', 'mountain': 'mint',
  // live icons follow their static siblings
  'bell-count': 'butter', 'cart-count': 'peach', 'mail-count': 'sky', 'inbox-count': 'sky', 'chat-count': 'lavender',
  'calendar-date': 'lavender', 'calendar-event': 'lavender', 'calendar-month': 'lavender', 'calendar-range': 'lavender', 'calendar-tear': 'lavender', 'calendar-weekday': 'lavender',
  'clock-time': 'lavender', 'watch-time': 'lavender', 'alarm-clock-time': 'blush', 'stopwatch': 'lavender', 'digital-clock': 'lavender', 'timer-ring': 'lavender',
  'battery-level': 'mint', 'battery-percent': 'mint', 'battery-vertical': 'mint', 'battery-charging-level': 'mint',
  'map-pin-number': 'blush', 'folder-label': 'butter', 'thermometer-level': 'sky', 'humidity': 'sky', 'weather': 'sky', 'uv-index': 'butter', 'wind-speed': 'sky',
  'price-tag': 'blush', 'tag-label': 'blush', 'ticket-number': 'blush', 'rating-stars': 'butter', 'file-type': 'sky', 'keycap': 'lavender',
  'sale-sticker': 'blush', 'badge-text': 'lavender', 'ribbon-label': 'blush', 'percent-badge': 'mint', 'app-badge': 'lavender', 'avatar-initials': 'peach',
  'dice': 'lavender', 'gauge-value': 'lavender', 'progress-ring': 'mint', 'signal-bars': 'sky', 'wifi-strength': 'sky', 'cellular-tech': 'sky',
  'volume-level': 'sky', 'bar-values': 'lavender', 'speech-bubble-text': 'lavender', 'step-number': 'lavender',
}

// per-icon automatic-composer tuning (same keys as the field composer understands):
//   hollow  true: the inside of a round outline is an opening (lenses)
//   face    true: a dial gets a paper face inset in its rim
//   band    true: a frame with rows of text prints its top row on a band of the part hue
//   w / wi  bar weights          drop  path indexes to leave out
const DIAL = { face: true }
const CAL = { band: true, rings: [1.75, 4.75], hues: { band: 'blush', part: 'butter' } }
const T = {
  search: { hollow: true }, 'zoom-in': { hollow: true }, 'zoom-out': { hollow: true },
  'calendar-date': CAL, 'calendar-event': CAL, 'calendar-month': CAL, 'calendar-range': CAL, 'calendar-tear': CAL, 'calendar-weekday': CAL,
  'digital-clock': { band: true }, 'clock-time': DIAL, 'watch-time': DIAL, stopwatch: DIAL,
  // the static battery: a lavender shell around a paper well
  'battery-percent': { hues: { main: 'lavender', part: 'lavender', inlay: 'paper' } },
  // the static alarm clock: a blush body under butter bells
  'alarm-clock-time': { ...DIAL, hues: { main: 'blush', part: 'butter', badge: 'butter' } },
}
export const autoTune = name => T[name] || {}

const FALLBACK = ['lavender', 'sky', 'mint', 'peach', 'lavender', 'blush', 'sky', 'butter']
export function hueOf(name) {
  name = String(name || '')
  if (NAMES[name]) return NAMES[name]
  const words = name.split('-')
  for (const w of words) if (WORD_HUE.has(w)) return WORD_HUE.get(w)
  const r = rng(words[0] + ':pastel-hue')()
  return FALLBACK[Math.floor(r * FALLBACK.length) % FALLBACK.length]
}
// the badge hue says what a modifier means: add / done in mint, remove / stop / off in blush
export function badgeHueOf(name, set) {
  const n = String(name || '')
  // count badges are one family: always blush, whatever they sit on
  if (/-count$/.test(n) || n === 'app-badge') return 'blush'
  if (/(^|-)(plus|check|add|ok|done|play)(-|$)/.test(n)) return 'mint'
  if (/(^|-)(x|minus|off|remove|ban|alert|slash|stop|close)(-|$)/.test(n)) return 'blush'
  if (/(^|-)(lock|key|shield)(-|$)/.test(n)) return 'lavender'
  if (/(^|-)(question|help|info|clock|time|search)(-|$)/.test(n)) return 'sky'
  return set.badge
}
export function setOf(name) {
  const main = hueOf(name)
  const s = SETS[main] || SETS.lavender
  const b = badgeHueOf(name, s)
  return { ...s, badge: b === s.main && !/-count$|^app-badge$/.test(String(name)) ? s.part : b }
}
