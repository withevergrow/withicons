// One-off: builds forge/manifest.json (300 icons) from the two research lists + 64 top-ups.
import fs from 'fs'
const L = JSON.parse(fs.readFileSync('forge/.lists.json', 'utf8'))

const CATEGORIES = ['navigation', 'arrows', 'actions', 'status', 'media', 'files', 'communication', 'users',
  'commerce', 'time', 'devices', 'layout', 'text', 'maps', 'development', 'security', 'charts', 'weather', 'objects']
const CAT = {
  'Navigation & Structure': 'navigation', 'Navigation & Chrome': 'navigation', 'Arrows & Direction': 'arrows',
  'Shapes & Arrows': 'arrows', 'Actions & Editing': 'actions', 'Status & Feedback': 'status',
  'Media & Playback': 'media', 'Media Playback': 'media', 'Files & Documents': 'files', 'Files & Folders': 'files',
  'Communication': 'communication', 'User & Account': 'users', 'Users & Social': 'users',
  'Commerce & Payment': 'commerce', 'Commerce & Payments': 'commerce', 'Time & Scheduling': 'time',
  'Time & Calendar': 'time', 'Devices & Hardware': 'devices', 'Layout & View': 'layout', 'Text Formatting': 'text',
  'Maps, Location & Travel': 'maps', 'Development & Data': 'development', 'AI & Dev Tooling': 'development',
  'Security & Privacy': 'security', 'Security': 'security', 'Charts & Analytics': 'charts', 'Charts & Data': 'charts',
  'Weather & Nature': 'weather', 'Objects & Symbols': 'objects', 'Connectivity': 'devices',
}
// fix a few category calls the research lists disagreed on
const OVERRIDE = {
  circle: 'objects', square: 'objects', triangle: 'objects', hexagon: 'objects', 'chart-bar': 'charts',
  'chart-line': 'charts', 'chart-pie': 'charts', wifi: 'devices', 'wifi-off': 'devices', bluetooth: 'devices',
  signal: 'devices', rss: 'communication', plug: 'devices', 'cloud-upload': 'files', 'cloud-download': 'files',
  cloud: 'weather', 'git-branch': 'development', 'git-commit': 'development', 'git-pull-request': 'development',
  brain: 'development', bot: 'development', sparkles: 'development', cursor: 'navigation', link: 'actions',
  'external-link': 'navigation', 'log-in': 'users', 'log-out': 'users', globe: 'maps', compass: 'maps',
  'drag-handle': 'layout', sidebar: 'layout', maximize: 'layout', minimize: 'layout', move: 'arrows',
  'corner-down-right': 'arrows', swap: 'arrows', refresh: 'arrows', repeat: 'media', shuffle: 'media',
  history: 'time', hourglass: 'time', timer: 'time', 'alarm-clock': 'time', loader: 'status', gauge: 'charts',
  activity: 'charts', 'trending-up': 'charts', 'trending-down': 'charts', lightbulb: 'objects', rocket: 'objects',
  crown: 'objects', gift: 'commerce', award: 'objects', trophy: 'objects', target: 'objects', flame: 'objects',
  zap: 'objects', 'puzzle-piece': 'objects', palette: 'objects', 'graduation-cap': 'objects', language: 'text',
  quote: 'text', type: 'text', hash: 'text', 'at-sign': 'communication', percent: 'commerce', 'qr-code': 'commerce',
  toggle: 'layout', sliders: 'layout', filter: 'layout', sort: 'layout', table: 'layout',
}
const VAR = { 'bar-chart': 'chart-bar', 'line-chart': 'chart-line', 'pie-chart': 'chart-pie', info: 'info-circle',
  alarm: 'alarm-clock', puzzle: 'puzzle-piece', 'volume-mute': 'volume-off', attachment: 'paperclip' }

const all = new Map()
for (const l of L) for (const c of l.categories) for (const i of c.icons) {
  const name = VAR[i.name] || i.name
  const prev = all.get(name)
  const aliases = [...new Set([...(prev?.aliases || []), ...i.aliases, ...(VAR[i.name] ? [i.name] : [])])].filter(a => a !== name)
  all.set(name, { name, category: OVERRIDE[name] || prev?.category || CAT[c.category] || 'objects', description: prev?.description || i.description, aliases })
}

const EXTRA = [
  ['arrow-down-right', 'arrows', 'Diagonal arrow pointing down and to the right'],
  ['arrow-up-left', 'arrows', 'Diagonal arrow pointing up and to the left'],
  ['chevrons-up-down', 'arrows', 'Stacked up and down chevrons, a select/sort affordance'],
  ['rotate-cw', 'arrows', 'Circular arrow turning clockwise'],
  ['rotate-ccw', 'arrows', 'Circular arrow turning counter-clockwise'],
  ['plus-circle', 'actions', 'Plus sign inside a circle'],
  ['minus-circle', 'actions', 'Minus sign inside a circle'],
  ['pencil', 'actions', 'A pencil on its own, angled for writing'],
  ['eraser', 'actions', 'A block eraser, angled'],
  ['pen-tool', 'actions', 'Vector pen nib, the bezier drawing tool'],
  ['unlink', 'actions', 'Two chain links pulled apart'],
  ['check-square', 'status', 'Checkmark inside a rounded square, a ticked checkbox'],
  ['bell-ring', 'status', 'Bell with ringing strokes either side'],
  ['film', 'media', 'Film strip frame with sprocket holes'],
  ['image-plus', 'media', 'Picture frame with a plus badge'],
  ['tv', 'devices', 'Television screen on a small stand'],
  ['file-check', 'files', 'Document with a checkmark'],
  ['file-search', 'files', 'Document with a magnifying glass'],
  ['file-archive', 'files', 'Document with a zipper, a compressed archive'],
  ['file-video', 'files', 'Document with a play triangle'],
  ['files', 'files', 'Two stacked documents'],
  ['phone-call', 'communication', 'Handset with outgoing signal arcs'],
  ['messages', 'communication', 'Two overlapping speech bubbles, a conversation'],
  ['user-minus', 'users', 'Person with a minus badge'],
  ['coins', 'commerce', 'Stack of coins'],
  ['banknote', 'commerce', 'Paper banknote with a centre circle'],
  ['barcode', 'commerce', 'Vertical barcode bars'],
  ['ticket', 'commerce', 'Admission ticket with notched sides'],
  ['calculator', 'commerce', 'Calculator with display and keypad'],
  ['landmark', 'commerce', 'Classical bank building with columns and pediment'],
  ['calendar-days', 'time', 'Calendar page showing a grid of days'],
  ['mouse', 'devices', 'Computer mouse with a scroll wheel'],
  ['watch', 'devices', 'Wristwatch with strap'],
  ['battery-charging', 'devices', 'Battery with a lightning bolt'],
  ['gamepad', 'devices', 'Game controller with d-pad and buttons'],
  ['layout-dashboard', 'layout', 'Dashboard of four panels of unequal size'],
  ['kanban', 'layout', 'Three columns of cards, a kanban board'],
  ['align-justify', 'text', 'Text lines all of equal length'],
  ['heading', 'text', 'Heading letter H'],
  ['list-checks', 'text', 'Checklist with checkmarks beside lines'],
  ['navigation', 'maps', 'Navigation arrowhead pointing north-east'],
  ['route', 'maps', 'A winding route between two points'],
  ['crosshair', 'maps', 'Circle with crosshair ticks, locate me'],
  ['mountain', 'maps', 'Mountain peaks'],
  ['anchor', 'maps', 'Ship anchor'],
  ['git-merge', 'development', 'Two branches merging into one'],
  ['braces', 'development', 'Curly braces, code block'],
  ['webhook', 'development', 'Three linked nodes, a webhook'],
  ['shield-alert', 'security', 'Shield with an exclamation mark'],
  ['chart-area', 'charts', 'Area chart, a filled line graph'],
  ['cloud-lightning', 'weather', 'Cloud with a lightning bolt'],
  ['cloud-sun', 'weather', 'Sun partly behind a cloud'],
  ['wind', 'weather', 'Flowing wind lines with curls'],
  ['snowflake', 'weather', 'Six-armed snowflake'],
  ['umbrella', 'weather', 'Open umbrella'],
  ['coffee', 'objects', 'Cup of coffee with steam'],
  ['book-open', 'objects', 'Open book, two facing pages'],
  ['briefcase', 'objects', 'Briefcase with handle'],
  ['hammer', 'objects', 'Claw hammer'],
  ['paintbrush', 'objects', 'Paintbrush'],
  ['ruler', 'objects', 'Ruler with tick marks, angled'],
  ['heart-pulse', 'objects', 'Heart with a heartbeat line through it'],
  ['pill', 'objects', 'Capsule pill, split in two halves'],
  ['wand', 'development', 'Magic wand with sparkle, AI or auto action'],
]
for (const [name, category, description] of EXTRA) {
  if (all.has(name)) throw new Error('duplicate extra ' + name)
  all.set(name, { name, category, description, aliases: [] })
}
const icons = [...all.values()].map(i => ({ ...i, category: CATEGORIES.includes(i.category) ? i.category : 'objects', aliases: i.aliases.slice(0, 8) }))
if (icons.length !== 300) throw new Error('expected 300, got ' + icons.length)

// 20 batches of 15, category-coherent: sort by category then name, chunk.
const order = CATEGORIES.flatMap(c => icons.filter(i => i.category === c).sort((a, b) => a.name.localeCompare(b.name)))
order.forEach((ic, k) => { ic.batch = Math.floor(k / 15) + 1 })
fs.writeFileSync('forge/manifest.json', JSON.stringify({ count: order.length, categories: CATEGORIES, icons: order }, null, 1))
const counts = {}; order.forEach(i => counts[i.category] = (counts[i.category] || 0) + 1)
console.log('manifest: 300 icons,', CATEGORIES.length, 'categories')
console.log(Object.entries(counts).map(([c, n]) => `${c}:${n}`).join('  '))
for (let b = 1; b <= 20; b++) console.log(`batch ${String(b).padStart(2)}:`, order.filter(i => i.batch === b).map(i => i.name).join(' '))
