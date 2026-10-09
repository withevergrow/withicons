// RANGOLI motif assignment: which Indian festival motif each icon wears.
//
// Order of decision (first hit wins), evaluated in _rangoli-core.mjs:
//   1. TUNE[name]           hand-picked for hero icons (the festival set, the everyday heroes)
//   2. WORDS                name keywords (light -> flame/sparkle, love/celebration -> marigold, colour -> Holi speckle ...)
//   3. CATEGORY             category defaults (arrows/layout/text stay clean)
//   4. SHAPE (in the core)  round body -> rangoli petal ring; narrow-bottomed vessel -> lotus base; wide flat top -> toran;
//                           free corner -> marigold; deep plain body -> paisley; else nothing
// Motif kinds:
//   ring      rangoli petal ring behind a round body (the body is drawn a little smaller, centred)
//   lotus     lotus petal base fanned behind the bottom (the body is lifted and drawn a little smaller)
//   toran     a row of hanging mango leaves under the top edge (inlay)
//   marigold  one marigold in the freest corner (cut a small moat into the body if it must)
//   flame     a diya flame in the freest spot above the body
//   sparkle   one or two Diwali twinkles in free space
//   speckle   a Holi gulal burst: dots of every colour from one corner
//   paisley   a paisley (kairi) inlaid in the deepest plain part of the body
//   none      clean
// Options: fire: true paints A parts (flames, sparks) gold -> vermilion; at: [x, y] fixes the motif centre (corner motifs), r: motif radius, scale: body scale for ring/lotus,
//          moat: false never cuts into the body.

export const TUNE = {
  // Indian festival icons (forge/.claims/new-30.json)
  diya: { motif: 'sparkle', fire: true },
  'piggy-bank': { motif: 'sparkle', fire: true },   // a Dhanteras piggy bank: the snout warm gold, two twinkles
  'rangoli-pattern': { motif: 'none' },
  kalash: { motif: 'lotus' },
  toran: { motif: 'none' },
  marigold: { motif: 'sparkle' },
  lotus: { motif: 'sparkle' },
  sparkler: { motif: 'sparkle', fire: true },
  firecracker: { motif: 'sparkle', fire: true },
  'sky-lantern': { motif: 'sparkle' },
  'mithai-box': { motif: 'toran' },
  laddoo: { motif: 'marigold' },
  jalebi: { motif: 'none' },
  shankh: { motif: 'marigold' },
  dhak: { motif: 'none' },
  'puja-thali': { motif: 'marigold', fire: true },
  pandal: { motif: 'none' },
  alpana: { motif: 'none' },
  pichkari: { motif: 'speckle' },
  gulal: { motif: 'speckle' },
  'holi-splash': { motif: 'speckle' },
  'water-balloon': { motif: 'speckle' },
  thandai: { motif: 'marigold' },
  dholak: { motif: 'none' },
  rakhi: { motif: 'none' },
  'mehndi-hand': { motif: 'paisley' },
  paisley: { motif: 'none' },
  'peacock-feather': { motif: 'sparkle' },
  kite: { motif: 'speckle' },
  // everyday heroes
  home: { motif: 'toran' },
  gift: { motif: 'marigold' },
  'shopping-bag': { motif: 'paisley' },
  'shopping-cart': { motif: 'marigold' },
  heart: { motif: 'paisley' },
  star: { motif: 'sparkle' },
  wallet: { motif: 'paisley' },
  bell: { motif: 'marigold' },
  calendar: { motif: 'toran' },
  trophy: { motif: 'lotus' },
  award: { motif: 'lotus' },
  crown: { motif: 'lotus' },
  gem: { motif: 'lotus' },
  diamond: { motif: 'lotus' },
  cake: { motif: 'sparkle', fire: true },
  sun: { motif: 'none' },
  moon: { motif: 'sparkle' },
  lightbulb: { motif: 'sparkle', fire: true },
  'credit-card': { motif: 'paisley' },
  tag: { motif: 'marigold' },
  'party-popper': { motif: 'speckle' },
  palette: { motif: 'speckle' },
  smile: { motif: 'ring' },
  store: { motif: 'toran' },
  'map-pin': { motif: 'lotus' },
}

// keyword -> motif (matched against the hyphen-split name)
export const FIRE = /^(flame|fire|candle|lamp|lantern|torch|incense|campfire|flashlight|rocket|firework|fireworks)$/
export const WORDS = [
  [/^(flame|fire|candle|lamp|lantern|torch|incense)$/, 'flame'],
  [/^(sparkles?|stars?|moon|night|firework|fireworks|magic|wand|rocket|lightbulb|bulb)$/, 'sparkle'],
  [/^(paint|brush|palette|droplets?|spray|confetti|party|balloon|splash|colors?|colours?|rainbow|pipette)$/, 'speckle'],
  [/^(heart|gift|flower|flowers|rose|love|smile|baby|ring|bouquet|music|cup|coffee|tea)$/, 'marigold'],
  [/^(trophy|award|medal|crown|gem|diamond|plant|sprout|vase|pot|potted|leaf|flask)$/, 'lotus'],
  [/^(store|shop|shopping|bag|basket|calendar|box|package|archive|briefcase|inbox)$/, 'toran'],
]

// category -> motif when nothing else decides (a round body takes the rangoli ring first)
export const CATEGORY = {
  arrows: 'none', layout: 'none', text: 'none',
  commerce: 'marigold', communication: 'marigold', users: 'marigold', home: 'marigold', food: 'marigold', nature: 'marigold',
  health: 'marigold', files: 'marigold', security: 'marigold', maps: 'marigold', sports: 'marigold', objects: 'marigold',
  actions: 'marigold', navigation: 'marigold', 'indian-festivals': 'marigold', 'lunar-new-year': 'marigold', valentines: 'marigold',
  education: 'sparkle', devices: 'sparkle', media: 'sparkle', weather: 'sparkle', time: 'sparkle', ai: 'sparkle', travel: 'sparkle',
  charts: 'sparkle', development: 'sparkle', status: 'sparkle', christmas: 'sparkle', halloween: 'sparkle',
}

export function tuneFor(icon) {
  const name = String(icon && icon.name || '')
  if (TUNE[name]) return { ...TUNE[name] }
  // faces and avatars stay clean (a motif would read as part of the face)
  if (/^(avatar|face|emoji)(-|$)/.test(name)) return { motif: 'none' }
  const parts = name.split('-')
  const fire = parts.some(p => FIRE.test(p))
  for (const [re, m] of WORDS) if (parts.some(p => re.test(p))) return { motif: m, auto: true, fire }
  const c = CATEGORY[icon && icon.category]
  if (c === 'none') return { motif: 'none' }
  return { motif: 'auto', fallback: c || 'marigold' }
}
