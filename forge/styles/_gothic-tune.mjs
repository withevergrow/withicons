// GOTHIC per-icon tuning for the automatic composer (_gothic-auto.mjs). Never edit skeletons.
//   glass     main glass role of the biggest pane (c1 ruby, c2 sapphire, c3 gold, c4 emerald)
//   tracery   'auto' | 'quarry' | 'rose' | 'lancet' | 'medallion' | 'none' for the biggest pane
//   badge     glass role of an S roundel
//   wk wm wa ws wt   tube widths; scale dx dy   placement; plate {pathId: plate}
//   noFills noCutouts noTicks aInner inlay fillPlate
const GLASS = {
  c1: ['heart', 'fire', 'flame', 'gift', 'apple', 'cherry', 'strawberry', 'rose', 'alert', 'stop', 'record', 'bookmark', 'flag', 'pin', 'map-pin', 'tag', 'magnet', 'battery-low', 'thermometer', 'bug'],
  c2: ['moon', 'droplet', 'water', 'snowflake', 'cloud', 'umbrella', 'wave', 'anchor', 'ship', 'diamond', 'gem', 'shield'],
  c3: ['star', 'sun', 'sunrise', 'sunset', 'lightbulb', 'bulb', 'bell', 'crown', 'trophy', 'coin', 'coins', 'key', 'zap', 'bolt', 'lightning', 'sparkles', 'award', 'medal', 'smile', 'lamp', 'candle'],
  c4: ['leaf', 'tree', 'plant', 'sprout', 'clover', 'recycle', 'globe', 'earth', 'map', 'mountain', 'cactus', 'frog'],
}
const BY = {}
for (const [r, names] of Object.entries(GLASS)) for (const n of names) BY[n] = { glass: r }

// Live icons (forge/dynamic): the family glass of their tablets, ruby and emerald by family
// (the automatic composer's default is sapphire)
const LIVE = {
  c1: ['badge-text', 'sale-sticker', 'percent-badge', 'ribbon-label', 'price-tag', 'step-number', 'dice'],
  c4: ['ticket-number', 'tag-label', 'keycap', 'cellular-tech', 'speech-bubble-text', 'avatar-initials', 'folder-label', 'map-pin-number'],
}
for (const [r, names] of Object.entries(LIVE)) for (const n of names) BY[n] = { glass: r }

// Live generators that never write a value (the rest are lettered: deep glass, no tracery, at every value)
export const LIVE_TEXTLESS = new Set(['alarm-clock-time', 'bar-values', 'battery-charging-level', 'battery-level', 'battery-vertical',
  'clock-time', 'dice', 'signal-bars', 'stopwatch', 'volume-level', 'watch-time', 'wifi-strength'])
// how deep (smoked) lettered glass is: gilt lettering needs a dark ground
export const LETTERED_DEEP = 0.62

const TUNE = {
  ...BY,
  // live rings: the face is glass at every value (a short gilt progress arc must not win the face's plate vote)
  'timer-ring': { fillPlate: 'K' },
  'progress-ring': { fillPlate: 'K' },
  // the elapsed sweep cuts the face: its tracery must not come and go with the seconds
  stopwatch: { tracery: 'none', fillPlate: 'K', glass: 'c3' },
  // (a Live icon's glass is plain unless its tracery cannot move with the value: a die's pips sit on it)
  dice: { glass: 'c1', tracery: 'quarry' },
}

export function tuneFor(name, params) {
  void params
  const base = name ? String(name) : ''
  return TUNE[base] || TUNE[base.replace(/-(off|plus|minus|check|x|slash|alert|2|filled)$/, '')] || {}
}
