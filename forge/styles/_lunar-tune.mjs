// LUNAR per-icon tuning. Skeletons stay style-agnostic: anything Lunar needs to know about one icon lives here.
//   body     'red' (default lacquer), 'gold' (gold foil: money, metal, prizes), 'jade' (plants, nature)
//            or 'cream' (rice paper with a red rim: documents and paper things)
//   signal   role painting the S parts: 'gold' or 'red' (default jade; red on jade bodies)
//   parts    role painting the A parts when they should not be the material's default: 'jade', 'red' or 'gold'
//   noFills  ignore the skeleton's fills and cutouts: the drawing as lacquer tubes (lattices the mass would clog)
//   tassel   true/false: force or forbid the hanging tassel (default: the HANG list, only where there is room)
//   bloom    true/false: force or forbid the plum blossom
//   cloud    false: no cloud medallion
// A grid should not be all red: whole categories pick a material (CATEGORY), single icons override it (TUNE).
const RED = { body: 'red' }
const GOLD = { body: 'gold' }
const JADE = { body: 'jade' }
const CREAM = { body: 'cream' }
const LEAFY = { parts: 'jade' }

export const CATEGORY = {
  commerce: GOLD,      // money and trade: gold foil
  security: GOLD,      // keys, locks and shields: gilded metal
  sports: GOLD,
  nature: JADE,        // plants and creatures: jade
  files: CREAM,        // documents, folders, notes: rice paper with a red rim
  charts: JADE,
  health: JADE,        // healing jade
  education: JADE,
  avatars: CREAM,      // faces on rice paper, red rim
  ai: GOLD,
  'lunar-new-year': { signal: 'gold' }, // festival decor (seals, studs, sparks) is gold on lacquer
}

export const TUNE = {
  // a red lacquer piggy bank with a gold snout and a gold coin
  'piggy-bank': { body: 'red', parts: 'gold', signal: 'gold' },
  // gold things
  'gold-ingot': { body: 'gold', parts: 'gold', signal: 'red' }, 'lucky-coin': GOLD, coins: { body: 'gold', parts: 'gold' }, crown: GOLD, trophy: GOLD, 'hand-coins': GOLD,
  'mandarin-orange': { body: 'gold', parts: 'jade' }, 'jingle-bells': GOLD, medal: GOLD, award: GOLD, star: GOLD, 'star-half': GOLD,
  gem: GOLD, bell: GOLD, 'bell-ring': GOLD, 'bell-plus': GOLD, sun: GOLD, 'sun-dim': GOLD, moon: GOLD, sunrise: GOLD, sunset: GOLD,
  fish: GOLD, teapot: CREAM, 'lunar-drum': RED, dumpling: CREAM, 'chinese-knot': { body: 'red', noFills: true }, chopsticks: { body: 'cream', parts: 'red', signal: 'red' },
  // commerce things that stay lucky red
  gift: RED, 'gift-stack': RED, ticket: RED, tag: RED, 'shopping-bag': RED, 'badge-percent': RED, percent: RED, store: RED,
  // red things in nature / security
  flower: { body: 'red', parts: 'jade' }, 'paw-print': RED, recycle: JADE, siren: RED, 'shield-alert': RED, 'shield-x': RED,
  // plants: jade lacquer
  bamboo: { body: 'jade', signal: 'red' }, leaf: JADE, sprout: JADE, 'tree-pine': JADE, 'palm-tree': JADE, salad: JADE,
  cloud: JADE, 'cloud-rain': JADE, 'cloud-drizzle': JADE, 'cloud-fog': JADE, 'cloud-snow': JADE, 'cloud-lightning': JADE,
  // paper
  mail: CREAM, 'mail-open': CREAM, 'mail-check': CREAM, 'mail-plus': CREAM, newspaper: CREAM, receipt: CREAM, 'receipt-text': CREAM,
  'scroll-text': CREAM, 'sticky-note': CREAM, 'book-open': CREAM, book: CREAM, notebook: CREAM, 'id-card': CREAM, passport: CREAM,
  'paper-fan': CREAM, 'love-letter': CREAM,
  // leaves on fruit and flowers
  apple: LEAFY, 'plum-blossom': { parts: 'jade', signal: 'gold' }, lotus: LEAFY, rose: LEAFY,
}
export const tuneFor = (name, category) => ({ ...(CATEGORY[category] || {}), ...(TUNE[name] || {}) })
