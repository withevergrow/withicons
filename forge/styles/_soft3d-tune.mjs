// SOFT 3D tuning: which icons are seen as real objects in a 3/4 view (OBJECT mode), which stay front-facing soft
// symbols (FRONT mode), how deep an object is, and its natural colours. Pure data + small deterministic lookups.
//
// MODE (first rule that matches wins):
//   1. avatars (forge/icons/avatar-*): AVATAR mode (front-facing 3D busts and characters, _soft3d-avatar.mjs)
//   2. FRONT_NAMES / OBJECT_NAMES: explicit names (icons whose line art already draws 3D, like cube or package, are FRONT:
//      extruding a drawing of a box would be a box of a box)
//   3. FRONT_WORDS: a name word that means a sign, a UI glyph or a living thing (arrow, chevron, check, x, plus, chart, user,
//      message, cloud, sun, star, heart, shield, eye, dollar, percent, cat, dog ...) -> FRONT
//   4. OBJECT_CATS: categories of physical things (devices, home, travel, food, health, education, sports, objects,
//      time, commerce and the five festival sets) -> OBJECT; every other category -> FRONT
//   5. shape heuristic: an OBJECT icon with no fills (a pure line drawing) or a thin, sparse mass falls back to FRONT,
//      since an extruded wire reads as a symbol anyway
//
// DEPTH (object mode, as a share of the object's front width): box 0.62 (devices, bags, boxes, buildings, vehicles),
// slab 0.34 (books, calendars, wallets, frames, plants), flat 0.14 (cards, coins, tickets, flags, papers, leaves).

export const OBJECT_CATS = new Set(['devices', 'home', 'travel', 'food', 'health', 'education', 'sports', 'objects', 'time',
  'commerce', 'indian-festivals', 'christmas', 'lunar-new-year', 'valentines', 'halloween'])

const words = s => s.split(/\s+/).filter(Boolean)

// explicit objects in otherwise symbolic categories
export const OBJECT_NAMES = new Set(words(`
  clipboard paste scissors pencil eraser pin trash trash-2 save flag
  film video-camera microphone microphone-off radio podcast disc clapperboard mic-vocal image images image-plus image-off
  archive book folder folder-open folder-plus folder-minus folder-search notebook notebook-pen newspaper library clipboard-list
  clipboard-check sticky-note scroll-text
  headset megaphone mail mail-open mail-check mail-plus inbox love-letter
  id-card address-book
  building building-2 car globe compass map anchor plane mountain
  bot bot-off wrench wand wand-sparkles server-cog
  key key-round lock unlock lock-keyhole siren
  gauge thermometer
  tree-pine flower sprout palm-tree
  lamp home house-plus heart-gift shopping-cart-plus
`))

// explicit symbols (front-facing) in otherwise physical categories
export const FRONT_NAMES = new Set(words(`
  bluetooth signal wifi wifi-off power zap-off network cloud-off screen-share
  dollar-sign euro pound-sterling indian-rupee percent badge-percent badge-dollar-sign barcode qr-code hand-coins
  package package-open warehouse factory piggy-bank
  circle square triangle hexagon infinity shapes zap sparkles cube boxes dices heart-pulse flame scale
  history calendar-span
  parking accessibility atom dna person-running
  rangoli-pattern alpana paisley holi-splash mehndi-hand plum-blossom heart-pair north-star ghost bat spider spider-web
  black-cat skull dragon-head lion-head reindeer snowman gingerbread-man candy-cane cupid-bow
  hand handshake hand-heart heart-handshake
  layers database umbrella
  anchor basketball football volleyball tennis bauble globe apple bike champagne-toast chinese-knot chopsticks stethoscope utensils
  sparkler satellite palm-tree gulal holly mistletoe firecracker-string toran rose-bouquet rakhi pichkari gem glasses usb wand
  wand-sparkles watch plane plane-landing plane-takeoff pill syringe test-tube microscope egg
`))

// a name word that means a sign or a living thing
export const FRONT_WORDS = new Set(words(`
  arrow arrows chevron chevrons corner move refresh rotate swap split
  check x plus minus close alert help info ban badge loader star heart thumbs
  chart trending activity list layout panel sidebar columns table kanban toggle sliders sort filter maximize minimize
  align bold italic underline strikethrough heading type quote hash pilcrow subscript superscript indent text
  user users smile frown laugh meh angry
  message messages reply forward send at rss
  cloud sun moon snowflake rainbow wind droplet droplets sunrise sunset leaf
  shield eye fingerprint scan
  dollar euro percent
  cat dog bird fish rabbit turtle butterfly paw recycle
  play pause stop rewind skip fast repeat shuffle volume audio captions cast
  git code braces terminal command api variable webhook workflow
`))

export function modeOf(icon) {
  const name = String(icon.name || ''), cat = String(icon.category || '')
  if (name.startsWith('avatar-')) return 'avatar'
  if (FRONT_NAMES.has(name)) return 'front'
  if (OBJECT_NAMES.has(name)) return 'object'
  const ws = name.split('-')
  if (ws.some(w => FRONT_WORDS.has(w))) return 'front'
  if (!OBJECT_CATS.has(cat)) return 'front'
  if (!(icon.fills || []).length) return 'front'
  return 'object'
}

// depth class (object mode)
const FLAT = words(`card id-card credit-card ticket coin coins lucky-coin banknote flag receipt receipt-text tag sticky-note
  newspaper image images image-plus image-off envelope red-envelope love-letter mail mail-open mail-check mail-plus
  passport leaf paper-fan kite peacock-feather rose love-scroll scroll-text puzzle-piece medal award stamp map circuit-board
  ruler disc cookie rangoli target chopsticks plum-blossom gingerbread-man candy-cane`)
const SLAB = words(`book notebook notebook-pen library clipboard clipboard-list clipboard-check paste folder folder-open folder-plus
  folder-minus folder-search archive calendar calendar-check calendar-days calendar-plus calendar-clock calendar-x wallet
  smartphone tablet laptop monitor tv keyboard watch mouse gamepad tree-pine flower sprout palm-tree pizza
  sofa bed door-open door-closed shirt bauble wreath stocking mistletoe holly poinsettia diya mithai-box tombstone coffin
  scissors pencil eraser pin key key-round wrench hammer gavel shovel paintbrush wand wand-sparkles pen-tool lamp
  plane plane-takeoff plane-landing guitar trophy crown heart-balloon balloon broom bell-ring compass gauge clock alarm-clock
  timer hourglass id-card address-book signpost traffic-cone thermometer syringe stethoscope tooth bandage pill
  umbrella anchor mountain globe headphones headset microphone mic-vocal podcast microphone-off megaphone lightbulb
  lightbulb-off flask-conical test-tube telescope microscope santa-hat christmas-tree sparkler firecracker kalash marigold
  lotus shankh dholak dhak pichkari rakhi toran sky-lantern red-lantern lunar-drum teapot bamboo mandarin-orange dumpling
  gold-ingot chinese-knot firecracker-string jack-o-lantern witch-hat cauldron broom candy-corn candy-bucket crystal-ball
  choco-strawberry teddy-bear rose-bouquet champagne-toast hot-cocoa ring-box love-lock jingle-bells nutcracker christmas-candle
  snow-globe fireplace sleigh north-star gift-stack pandal puja-thali laddoo jalebi water-balloon thandai gulal`)
export function depthOf(icon) {
  const name = String(icon.name || '')
  if (DEPTH_OF[name] != null) return DEPTH_OF[name]
  if (FLAT.includes(name)) return 0.14
  if (SLAB.includes(name)) return 0.34
  return 0.62
}
// a few objects with their own proportions (share of the front width)
const DEPTH_OF = { tent: 0.95, taxi: 0.5, 'car-front': 0.9, car: 0.5, bus: 0.7, truck: 0.55, ship: 0.45, train: 0.7, motorcycle: 0.24,
  bike: 0.18, home: 0.7, 'house-plus': 0.7, store: 0.55, hotel: 0.5, school: 0.5, hospital: 0.5, building: 0.55, 'building-2': 0.55,
  landmark: 0.5, luggage: 0.5, backpack: 0.55, briefcase: 0.4, 'briefcase-business': 0.4, 'briefcase-medical': 0.42, camera: 0.5,
  radio: 0.42, gift: 0.75, 'shopping-bag': 0.45, 'shopping-basket': 0.6, 'shopping-cart': 0.55, refrigerator: 0.7,
  'washing-machine': 0.75, toilet: 0.7, bath: 0.6, printer: 0.7, server: 0.8, 'piggy-bank': 0.5, sofa: 0.45, bed: 0.8,
  'cooking-pot': 0.8, cake: 0.8, burger: 0.85, 'cup-soda': 0.8, coffee: 0.75, beer: 0.6, popcorn: 0.75, 'ice-cream': 0.6,
  soup: 0.8, salad: 0.8, egg: 0.6, apple: 0.7, donut: 0.32, battery: 0.45, 'battery-charging': 0.45, 'battery-low': 0.45,
  'battery-full': 0.45, speaker: 0.6, router: 0.6, 'hard-drive': 0.6, webcam: 0.6, cpu: 0.18, usb: 0.3, plug: 0.5 }

// ---------------------------------------------------------------------------
// COLOURS: natural, studio-photographed materials. Every colour ends up as a role variable --with-soft3d-<role>.
export const BASE = {
  ink: '#2B2F3A', c1: '#4C86E8', c2: '#F2B33D', c3: '#E8584A', c4: '#C9CFD8',
  tint: '#A9D8F2', accent: '#FF6A4D', shadow: '#1D2130', shine: '#FFFFFF', edge: '#FFF4E2',
}
const C = {
  red: '#E5483F', tomato: '#EE5A3C', orange: '#F28A2E', amber: '#F5A524', yellow: '#F7C531', gold: '#E9B43A',
  green: '#4FB463', grass: '#6CC24A', forest: '#2F8F5B', teal: '#25A99B', sky: '#5BB8E8', blue: '#3D7EE0', navy: '#2F4170',
  purple: '#8A66DE', pink: '#F27BA5', rose: '#E34D6E', wood: '#B8763E', brown: '#8A5838', leather: '#9C5B35', cream: '#F3E7D3',
  white: '#EEF1F5', silver: '#BFC7D2', grey: '#8F99A8', dark: '#3A404C', black: '#2A2E36', choc: '#6B3F2A', terracotta: '#C8643B',
  mint: '#7FD8C0', lilac: '#B59BEA', peach: '#F7B48A', sand: '#E6C489',
}
export const COLORS = C
// body colour by name word (first match wins), then optional part colours [c2, c3], then an optional S badge colour
const NATURAL = [
  // explicit objects from the reference studio set
  ['camera camera-off webcam video-camera clapperboard film', C.black, [C.silver, C.dark]],
  ['radio', C.wood, [C.silver, C.dark]],
  ['toolbox briefcase-medical ambulance', C.white, [C.red, C.silver]],
  ['taxi', C.yellow, [C.amber, C.dark]],
  ['backpack', C.orange, [C.amber, C.brown]],
  ['luggage', C.orange, [C.dark, C.silver]],
  ['briefcase briefcase-business wallet', C.leather, [C.gold, C.choc]],
  ['tent', C.orange, [C.brown, C.amber]],
  ['ship anchor', C.white, [C.navy, C.red]],
  ['bus', C.red, [C.dark, C.cream]],
  ['train', C.blue, [C.dark, C.cream]],
  ['truck car car-front motorcycle bike', C.red, [C.dark, C.silver]],
  ['plane plane-takeoff plane-landing satellite', C.sky, [C.white, C.red]],
  ['home house-plus store hotel school hospital building building-2 landmark pandal haunted-house warehouse factory', C.cream, [C.terracotta, C.wood]],
  ['gift gift-stack heart-gift ring-box', C.red, [C.gold, C.gold]],
  ['umbrella', C.red, [C.wood, C.white]],
  ['flag', C.red, [C.silver, C.white]],
  ['target', C.white, [C.red, C.red]],
  // devices and tech
  ['laptop monitor tv tablet smartphone monitor-smartphone keyboard mouse gamepad watch printer router server server-cog hard-drive speaker headphones headset microphone mic-vocal microphone-off podcast cpu usb plug plug-zap satellite-dish circuit-board', C.dark, [C.silver, C.blue]],
  ['battery battery-charging battery-low battery-full', C.dark, [C.green, C.silver]],
  ['bot bot-off robot', C.silver, [C.sky, C.dark]],
  ['lock unlock lock-keyhole key key-round', C.gold, [C.silver, C.dark]],
  ['siren', C.red, [C.silver, C.dark]],
  ['bell bell-ring jingle-bells', C.gold, [C.brown, C.gold]],
  // home and objects
  ['sofa bed', C.teal, [C.wood, C.cream]],
  ['lamp lightbulb lightbulb-off', C.yellow, [C.silver, C.dark]],
  ['bath toilet refrigerator washing-machine', C.white, [C.silver, C.sky]],
  ['door door-open door-closed', C.wood, [C.gold, C.brown]],
  ['clock alarm-clock timer hourglass gauge compass', C.red, [C.cream, C.dark]],
  ['calendar calendar-check calendar-days calendar-plus calendar-clock calendar-x', C.white, [C.red, C.dark]],
  ['book notebook notebook-pen library address-book', C.blue, [C.cream, C.gold]],
  ['folder folder-open folder-plus folder-minus folder-search archive', C.amber, [C.cream, C.brown]],
  ['clipboard clipboard-list clipboard-check paste', C.wood, [C.white, C.silver]],
  ['newspaper sticky-note scroll-text love-scroll id-card passport ticket receipt receipt-text', C.cream, [C.blue, C.dark]],
  ['mail mail-open mail-check mail-plus inbox love-letter envelope', C.white, [C.red, C.sky]],
  ['image images image-plus image-off', C.wood, [C.sky, C.green]],
  ['trash trash-2', C.grey, [C.dark, C.silver]],
  ['save', C.navy, [C.silver, C.white]],
  ['scissors', C.red, [C.silver, C.dark]],
  ['pencil eraser pen-tool', C.yellow, [C.pink, C.dark]],
  ['pin', C.red, [C.silver, C.dark]],
  ['megaphone', C.white, [C.orange, C.dark]],
  ['wrench hammer gavel shovel', C.silver, [C.wood, C.red]],
  ['wand wand-sparkles', C.black, [C.gold, C.white]],
  ['paintbrush', C.wood, [C.silver, C.purple]],
  ['palette', C.wood, [C.red, C.blue]],
  ['trophy crown medal award gold-ingot coins coin lucky-coin', C.gold, [C.red, C.wood]],
  ['rocket', C.white, [C.red, C.sky]],
  ['globe', C.sky, [C.green, C.wood]],
  ['map', C.cream, [C.green, C.sky]],
  ['mountain', C.grey, [C.white, C.green]],
  ['graduation-cap hard-hat', C.dark, [C.gold, C.amber]],
  ['glasses', C.dark, [C.sky, C.dark]],
  ['life-buoy', C.white, [C.red, C.red]],
  ['puzzle-piece', C.blue, [C.amber, C.green]],
  ['ruler', C.amber, [C.dark, C.wood]],
  ['stamp', C.wood, [C.red, C.dark]],
  ['balloon heart-balloon', C.red, [C.white, C.silver]],
  ['party-popper', C.purple, [C.yellow, C.pink]],
  ['dumbbell', C.dark, [C.silver, C.grey]],
  ['football', C.white, [C.dark, C.dark]],
  ['basketball', C.orange, [C.dark, C.dark]],
  ['volleyball', C.white, [C.yellow, C.blue]],
  ['tennis', C.yellow, [C.white, C.white]],
  // travel and city
  ['fuel', C.red, [C.dark, C.silver]],
  ['traffic-cone', C.orange, [C.white, C.dark]],
  ['signpost', C.wood, [C.cream, C.brown]],
  ['binoculars telescope microscope', C.dark, [C.silver, C.sky]],
  // health and science
  ['stethoscope syringe pill bandage tooth', C.white, [C.sky, C.red]],
  ['flask-conical test-tube', C.white, [C.green, C.silver]],
  ['backpack-school presentation', C.white, [C.blue, C.wood]],
  // food
  ['pizza', C.sand, [C.red, C.yellow]],
  ['burger', C.amber, [C.brown, C.green]],
  ['salad', C.white, [C.green, C.red]],
  ['soup cooking-pot', C.red, [C.silver, C.cream]],
  ['egg', C.white, [C.yellow, C.amber]],
  ['cake', C.pink, [C.cream, C.red]],
  ['ice-cream', C.pink, [C.sand, C.choc]],
  ['cookie', C.sand, [C.choc, C.choc]],
  ['donut', C.sand, [C.pink, C.yellow]],
  ['apple', C.red, [C.green, C.brown]],
  ['cup-soda', C.red, [C.white, C.white]],
  ['beer', C.amber, [C.white, C.white]],
  ['wine champagne-toast', C.rose, [C.white, C.white]],
  ['popcorn', C.red, [C.cream, C.white]],
  ['coffee hot-cocoa', C.white, [C.choc, C.white]],
  ['utensils chef-hat chopsticks', C.silver, [C.white, C.wood]],
  // plants
  ['tree-pine christmas-tree palm-tree sprout flower bamboo holly mistletoe wreath', C.forest, [C.brown, C.red]],
  ['umbrella-beach', C.red, [C.wood, C.white]],
  ['thermometer', C.white, [C.red, C.silver]],
  // festivals
  ['diya sky-lantern red-lantern', C.terracotta, [C.amber, C.gold]],
  ['kalash shankh puja-thali', C.gold, [C.red, C.white]],
  ['marigold laddoo jalebi', C.orange, [C.amber, C.green]],
  ['lotus', C.pink, [C.green, C.yellow]],
  ['sparkler firecracker firecracker-string', C.red, [C.gold, C.yellow]],
  ['mithai-box', C.pink, [C.gold, C.green]],
  ['dhak dholak lunar-drum', C.red, [C.wood, C.gold]],
  ['pichkari gulal water-balloon thandai', C.pink, [C.green, C.sky]],
  ['rakhi toran kite peacock-feather', C.red, [C.gold, C.green]],
  ['santa-hat stocking bauble poinsettia christmas-candle nutcracker', C.red, [C.white, C.gold]],
  ['sleigh fireplace', C.red, [C.wood, C.gold]],
  ['snow-globe crystal-ball', C.sky, [C.wood, C.white]],
  ['red-envelope chinese-knot paper-fan', C.red, [C.gold, C.gold]],
  ['mandarin-orange', C.orange, [C.green, C.green]],
  ['dumpling', C.cream, [C.sand, C.green]],
  ['teapot', C.teal, [C.wood, C.white]],
  ['rose rose-bouquet', C.rose, [C.green, C.white]],
  ['choco-strawberry chocolate-box', C.choc, [C.red, C.gold]],
  ['teddy-bear', C.wood, [C.sand, C.choc]],
  ['love-lock', C.red, [C.silver, C.gold]],
  ['jack-o-lantern candy-corn', C.orange, [C.green, C.yellow]],
  ['witch-hat cauldron', C.black, [C.purple, C.green]],
  ['broom', C.wood, [C.sand, C.red]],
  ['coffin tombstone', C.grey, [C.dark, C.green]],
  ['candy-bucket', C.orange, [C.dark, C.yellow]],
  ['shopping-bag shopping-basket shopping-cart shopping-cart-plus', C.orange, [C.brown, C.silver]],
  ['piggy-bank', C.pink, [C.rose, C.rose], C.gold],   // 3rd entry: the S badge colour (the coin is gold)
  ['credit-card', C.navy, [C.gold, C.silver]],
  ['banknote', C.green, [C.mint, C.forest]],
  ['tag', C.amber, [C.white, C.brown]],
  ['calculator', C.dark, [C.orange, C.silver]],
  ['shirt', C.blue, [C.white, C.navy]],
  ['passport', C.navy, [C.gold, C.gold]],
]
  .map(([w, c, parts, badge]) => [words(w), c, parts, badge])

// FRONT symbols: colour by meaning
const MEANING = [
  ['check check-circle check-square check-check badge-check copy-check calendar-check file-check mail-check shield-check user-check list-checks clipboard-check map-pin-check', C.green],
  ['x close x-circle square-x ban alert-circle shield-alert shield-x file-x calendar-x user-x heart-crack angry phone-missed', C.red],
  ['alert-triangle siren', C.amber],
  ['heart heart-pulse heart-handshake hand-heart heart-pair', C.rose],
  ['star star-half sparkles north-star zap zap-off sun sun-dim sunrise sunset lightbulb', C.yellow],
  ['bell bell-ring bell-off bell-plus', C.amber],
  ['flame', C.orange],
  ['leaf sprout recycle', C.green],
  ['cloud cloud-rain cloud-snow cloud-drizzle cloud-fog cloud-lightning cloud-sun droplet droplets snowflake wind umbrella rainbow', C.sky],
  ['moon sun-moon', C.purple],
  ['settings settings-2 cog', C.grey],
  ['dollar-sign euro pound-sterling indian-rupee badge-dollar-sign hand-coins', C.green],
  ['percent badge-percent', C.red],
  ['shield shield-user lock globe-lock fingerprint', C.blue],
  ['cat black-cat', C.dark], ['dog', C.wood], ['bird', C.sky], ['fish', C.orange], ['rabbit', C.pink], ['turtle', C.green], ['butterfly', C.purple],
  ['paw-print', C.brown], ['ghost', C.white], ['bat spider spider-web skull', C.dark], ['snowman', C.white], ['reindeer', C.wood],
  ['gingerbread-man', C.wood], ['candy-cane', C.red], ['lion-head', C.red], ['dragon-head', C.red, [C.gold, C.gold]],
]
  .map(([w, c, p]) => p ? [words(w), c, p] : [words(w), c])
const SEEDED = [C.blue, C.teal, C.purple, C.tomato, C.amber]

const hash = s => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }

export function paletteFor(icon, mode) {
  const name = String(icon.name || ''), ws = name.split('-')
  const match = list => {
    for (const [w, ...rest] of list) if (w.includes(name)) return rest
    for (const [w, ...rest] of list) if (w.some(x => !x.includes('-') && ws.includes(x))) return rest
    return null
  }
  let body = null, parts = null
  const nat = match(NATURAL)
  const mean = mode === 'front' ? match(MEANING) : null
  if (mean) { body = mean[0]; parts = mean[1] }
  else if (nat) { body = nat[0]; parts = nat[1] }
  else if (mode === 'front') body = SEEDED[hash(name) % SEEDED.length]
  else body = [C.blue, C.teal, C.tomato, C.amber, C.purple, C.green][hash(name) % 6]
  const h = hash(name + '|p')
  const pool = [C.amber, C.white, C.tomato, C.sky, C.dark, C.teal].filter(c => c !== body)
  const c2 = parts?.[0] || pool[h % pool.length]
  const c3 = parts?.[1] || pool[(h + 2) % pool.length]
  const light = lum(body) > 0.72
  return { ...BASE, c1: body, c2, c3, c4: C.silver, accent: nat?.[2] || (body === C.red || body === C.tomato || body === C.rose ? C.amber : BASE.accent),
    ink: light ? '#2B2F3A' : '#232733', edge: BASE.edge }
}
export function lum(hex) {
  const n = parseInt(String(hex).slice(1), 16)
  const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// a cap in the body's second colour: everything above this y (a roof, an awning, a lid)
const CAP = { home: 10.2, 'house-plus': 10.2, store: 9, school: 10, hotel: 7, hospital: 7, 'haunted-house': 10, pandal: 10,
  'cooking-pot': 8.5, 'mithai-box': 8, 'gift-stack': 0, toolbox: 9 }
export const capOf = icon => CAP[icon.name] || null
const LENS = new Set(words('camera webcam video-camera binoculars telescope microscope camera-off glasses'))
export const isLens = icon => LENS.has(icon.name)

// per-icon construction hints: onlyFill (the body is the fill alone, stray K strokes such as tent poles dropped),
// baseY (the body below this y in the second colour: a hull), inset (the upper body narrower in depth: a cabin)
const TUNE = { tent: { onlyFill: true }, 'dragon-head': { roles: ['c2'] }, ship: { baseY: 12.1, inset: 1.2 }, sailboat: { baseY: 15 } }
export const tuneOf = icon => TUNE[icon.name] || {}
