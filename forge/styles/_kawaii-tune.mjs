// KAWAII per-icon tuning. Skeletons are never edited for a style: everything
// icon-specific (expression, colour, face position, no-face) lives here.
//
//   face:   false            -> no face (gets a heart / sparkle accent instead)
//           { x, y, s }      -> force the face centre (eye line) and scale
//           { dx, dy, s }    -> nudge the automatic position / cap its scale
//   expr:   smile | cat | joy | wink | sleepy | shock | sad | dizzy | love | calm
//   color:  1..6             -> palette slot of the main body
//   accent: 'heart' | 'sparkle' | false
//   blush:  false            -> keep the face, drop the cheeks
//   cheeks: [[x, y], ...]    -> blush only, for icons that already draw a face
//   hide:   [i, ...]         -> skip these skeleton paths (a padlock's keyhole makes way for a face)
//   hideCuts: [i, ...]       -> skip these cutouts too (the hole a hidden path left behind)
//   fills:  false            -> no pastel body (fills authored as slabs that the outline does not hold)
//           true             -> keep the pastel body even where no outline holds it (a scanned face disc)

// The candy box. Body colours are mid-pastels laid at FILL_OPACITY so they read
// as soft pastels on white and as muted jewel tones on #0B0B12, where the light
// outline and face still contrast.
export const PALETTE = [
  // [var role, colour, opacity]  warm hues sit more opaque so they stay sunny on dark
  ['fill-1', '#FF6FA5', 0.55],   // strawberry milk
  ['fill-2', '#FF9A66', 0.66],   // peach
  ['fill-3', '#FFD23A', 0.72],   // lemon custard
  ['fill-4', '#45D99A', 0.55],   // mint
  ['fill-5', '#5AB4FF', 0.55],   // baby blue
  ['fill-6', '#A98BFF', 0.58],   // lavender
]
export const BLUSH = ['blush', '#FF6F9C']
export const BLUSH_OPACITY = 0.55
export const SHINE = ['shine', '#FFFFFF']
export const ACCENT = ['accent', '#FF5C9A']
export const SPARKLE = ['sparkle', '#FFB627']

// colour by meaning first (a sun is lemon, a cloud is baby blue), else by name hash
const MEANING = [
  [/heart|gift|bookmark|tag|ticket|flag|smile|award|crown|trophy|pill|music|palette|sparkle/, 1],
  [/flame|fire|coffee|cookie|package|box|archive|bread|gauge|hammer|briefcase|store|truck|car/, 2],
  [/sun|star|zap|bolt|light|bulb|lightbulb|bell|key|coin|dollar|banknote|wallet|lemon|sticky|folder|lock|unlock|award/, 3],
  [/leaf|tree|plant|sprout|recycle|battery|check|map|landmark|globe|mountain|cactus|clipboard|calculator/, 4],
  [/cloud|droplet|water|snow|wind|umbrella|mail|message|send|wifi|phone|cloud|database|server|shield|anchor|plane|navigation/, 5],
  [/moon|night|magic|wand|brain|gamepad|headphones|camera|video|film|image|book|bot|user|crystal|planet/, 6],
]
export function colorFor(name, hash) {
  const t = TUNE[name]
  if (t && t.color) return t.color - 1
  for (const [re, c] of MEANING) if (re.test(name)) return c - 1
  return hash % PALETTE.length
}

// glyphs that should never wear a face: directional, typographic, punctuation
export const NO_FACE = /(-off$)|^((alert|check|plus|minus|x|help|info|play|pause|stop|arrow|chevron)-(circle|square|triangle)|(circle|square)-|arrow|chevron|corner|move|hash|at-sign|percent|bold|italic|underline|strikethrough|heading|type|text|align|list|quote|code|braces|pilcrow|minus|plus|check$|close|x$|menu|more-|drag-|maximize|minimize|sort|swap|shuffle|repeat|redo|undo|reply|rotate|refresh|trending|activity|chart-line|signal|loader|equal|divide|asterisk|slash|terminal|sliders|columns|sidebar|layout|table$|kanban|barcode|qr-code|link|unlink|external-link|log-in|log-out|share|git-|route|webhook|wifi|rss|fingerprint|scissors|crop|crosshair|filter|percent)/

export const TUNE = {
  star: { expr: 'wink' },
  sparkles: { face: false, accent: false },
  moon: { expr: 'sleepy' },
  sun: { expr: 'joy' },
  heart: { expr: 'joy' },
  'heart-pulse': { face: false },
  smile: { face: false, accent: false, cheeks: [[6.6, 12.9], [17.4, 12.9]] },
  bot: { face: false, accent: false, cheeks: [[7.5, 16.7], [16.5, 16.7]] },
  signal: { fills: false },
  battery: { face: false },
  camera: { face: { near: [12, 7.4, 1.6], sMin: 0.6 } },
  lock: { hide: [2] },
  unlock: { hide: [2] },
  user: { face: { near: [12, 7.8, 1.6] } },
  users: { face: { near: [9, 8.2, 1.4], sMin: 0.55 } },
  'user-plus': { face: { x: 8.5, y: 7.8, s: 0.6, blush: false } },
  'user-check': { face: { x: 8.5, y: 7.8, s: 0.6, blush: false } },
  'user-minus': { face: { x: 8.5, y: 7.8, s: 0.6, blush: false } },
  'user-x': { face: { x: 8.5, y: 7.8, s: 0.6, blush: false } },
  'user-circle': { face: { x: 12, y: 9.75, s: 0.56, blush: false } },
  'calendar-days': { face: false },
  'calendar-plus': { face: false },
  'calendar-check': { face: false },
  'zoom-out': { face: false },
  'zoom-in': { face: false },
  wrench: { face: false },
  history: { face: false },
  'video-call': { face: false },
  'file-video': { face: false },
  'bell-off': { face: false },
  'shield-alert': { face: false },
  'phone-off': { face: false },
  'microphone-off': { face: false },
  'wifi-off': { face: false },
  cloud: { expr: 'calm' },
  'cloud-rain': { expr: 'sad' },
  'cloud-lightning': { expr: 'shock' },
  'cloud-snow': { expr: 'calm' },
  'alert-triangle': { face: false },
  'alert-circle': { face: false },
  'info-circle': { face: false },
  'help-circle': { face: false },
  'x-circle': { face: false },
  'plus-circle': { face: false },
  'minus-circle': { face: false },
  'check-circle': { face: false },
  'check-square': { face: false },
  ban: { face: false },
  trash: { expr: 'sad' },
  'thumbs-down': { expr: 'sad' },
  'thumbs-up': { expr: 'joy' },
  bug: { expr: 'dizzy' },
  gift: { face: false },
  coffee: { expr: 'calm' },
  rocket: { expr: 'joy' },
  bell: { expr: 'joy' },
  'bell-ring': { expr: 'shock' },
  'bell-off': { expr: 'sleepy' },
  'volume-off': { face: true, expr: 'sleepy' },
  'eye-off': { expr: 'sleepy' },
  clock: { face: false },
  'alarm-clock': { face: false },
  timer: { face: false },
  watch: { face: false },
  compass: { face: false },
  gauge: { face: false },
  target: { face: false },
  globe: { face: false },
  'chart-pie': { face: false },
  'pause': { face: false },
  'stop': { expr: 'calm' },
  // ---- final QA (all 500 icons) ---------------------------------------------
  // icons that already draw a face: never stamp a second one, blush their own
  cat: { face: false, accent: false, cheeks: [[6.3, 14.9], [17.7, 14.9]] },
  frown: { face: false, accent: false, cheeks: [[6.4, 12.6], [17.6, 12.6]] },
  meh: { face: false, accent: false, cheeks: [[6.4, 12.6], [17.6, 12.6]] },
  laugh: { face: false, accent: false, cheeks: [[6.1, 12.4], [17.9, 12.4]] },
  angry: { face: false, accent: false },
  dog: { face: false },
  rabbit: { face: false },
  'scan-face': { fills: true, face: false, accent: false, cheeks: [[7.3, 12.6], [16.7, 12.6]] },
  // a face crammed beside an inner glyph, or right above one (reads as two mouths)
  'address-book': { face: false },
  'id-card': { face: false },
  'sticky-note': { face: false },
  'folder-search': { face: false },
  'folder-minus': { face: false },
  'file-minus': { face: false },
  'message-circle-more': { face: false },
  'cloud-upload': { face: false },
  'cloud-download': { face: false },
  // placed by hand
  'piggy-bank': { hide: [3], hideCuts: [1], face: { x: 13.9, y: 12.4, s: 0.84 } },
  hotel: { face: { x: 13.5, y: 10.4, s: 0.74 } },
  bus: { face: { x: 12, y: 9.25, s: 0.8 } },
  'user-cog': { face: { x: 8.5, y: 7.8, s: 0.6, blush: false } },
  'user-search': { face: { x: 8.5, y: 7.8, s: 0.6, blush: false } },
  'user-pen': { face: { x: 8.5, y: 7.8, s: 0.6, blush: false } },
}
