// SKEUO per-icon tuning. Skeletons stay style-agnostic: anything Skeuo needs to
// know about one icon lives here, never in forge/icons.
//   body / part / sig   material names (see _skeuo-mat.mjs MAT) for the body, A parts, S badges/glyphs
//   screen              closed cutouts become inlaid glass (devices); screenMin: smallest area (u^2)
//   zones               [{y0, y1, x0, x1, mat, role}] a band of the body in another material
//   front               true/false: force outside A parts in front of / behind the body
//   cutThrough          open cutouts knock right through instead of being debossed
//   noInner             do not deboss interior centrelines
//   noFills             ignore the skeleton's fills (render the strokes as rods)
//   skipCut             [i] ignore those cutouts
//   w, wA, wS, groove   stroke weights
//   plates              {pathId: 'K'|'A'|'S'} re-plate a path for this style only
//   noCutouts           ignore all cutouts (Solid-engineered knockouts that hurt a solid object)
//   inlay {mat, inset}  a recessed face inside the body (clock face, magnifier glass, photo sky)
//   lift [pathId]       REDRAW: lift those paths off the surface as their own raised piece (liftMat, wLift)
//   decal {ci: mat}     REDRAW: closed cutout ci becomes a raised coloured shape instead of a hole
//   print / printSkip   open cutouts + interior lines printed in a colour (a file's type glyph); printSkip
//                       lists cutouts that stay debossed (default [0], a document's fold)
//   grooveAs            'emboss' (raised white enamel glyph), 'shine' (a glint), default debossed ink
const CAL = { zones: [{ y1: 9.9, mat: 'red', role: 'c3' }] }
const FACE = (ring = 'gold', face = 'ceramic', inset = 1.25) => ({ body: ring, inlay: { mat: face, inset } })
const LENS = { body: 'steel', part: 'steel', inlay: { mat: 'water', inset: 1.2 } }
const P = c => ({ print: c })
const PHOTO = { inlay: { mat: 'sky', inset: 1.3 }, decal: { 0: 'yellow', 1: 'leaf' }, noInner: true }
const T = {
  'file-pdf': P('red'), 'file-code': P('violet'), 'file-image': P('blue'), 'file-video': P('coral'), 'file-audio': P('violet'),
  'file-spreadsheet': { print: 'green', wPrint: 1.0 }, 'file-archive': P('orange'), 'file-check': P('green'), 'file-x': P('red'), 'file-plus': P('green'),
  'file-minus': P('red'), 'file-lock': P('orange'), 'file-search': P('blue'), 'file-up': P('blue'), 'file-down': P('blue'),
  'file-text': P('navy'), 'folder-plus': { print: 'green', printSkip: [] }, 'folder-minus': { print: 'red', printSkip: [] }, 'folder-search': { print: 'blue', printSkip: [] },
  'clipboard-check': P('green'), 'clipboard-list': P('navy'), 'notepad-text': { print: 'navy', printSkip: [0, 1, 2] }, 'scroll-text': P('navy'),
  'sticky-note': { print: 'navy', body: 'note' }, 'flask-conical': { body: 'water', part: 'steel' }, receipt: { print: 'navy', printSkip: [] },
  calendar: CAL, 'calendar-check': CAL, 'calendar-days': CAL, 'calendar-plus': CAL,
  clock: FACE(), 'alarm-clock': { ...FACE('red'), part: 'gold' }, timer: FACE('steel'), gauge: FACE('steel'),
  compass: { ...FACE('gold', 'ceramic', 1.3), lift: ['p1'], liftMat: 'red', noCutouts: true, wLift: 1.2 }, watch: { ...FACE('graphite', 'ceramic', 1.15), screen: false },
  history: { body: 'blue' },
  search: { ...LENS, grooveAs: 'shine' }, 'zoom-in': LENS, 'zoom-out': LENS,
  image: PHOTO, images: PHOTO, 'image-plus': PHOTO, 'file-image': { decal: { 1: 'yellow' }, print: 'leaf' },
  tent: { body: 'orange', part: 'wood' }, signpost: { body: 'wood', part: 'steel' },
  parking: { body: 'blue', grooveAs: 'emboss', groove: 1.6 }, percent: { body: 'navy', part: 'navy' },
  'eye-off': { body: 'white', part: 'blue' },
  eye: { body: 'white', lift: ['p1'], liftMat: 'blue', noCutouts: true, wLift: 1.6 },
  toggle: { body: 'green', lift: ['p1'], liftMat: 'white', noCutouts: true, noFills: false },
  battery: { lift: ['p2', 'p3'], liftMat: 'green', wLift: 2, screen: true, part: 'steel' },
  'battery-charging': { part: 'steel' },
  'battery-low': { lift: ['p2'], liftMat: 'red', wLift: 2, screen: true, part: 'steel' },
  wifi: { noFills: true, noCutouts: true, body: 'blue' }, 'wifi-off': { noFills: true, noCutouts: true, body: 'blue' },
  signal: { noFills: true, noCutouts: true, body: 'green' },
  gift: { print: 'red', printSkip: [] },
  // the lens ring cutout becomes a chrome-bezelled glass lens (see lens() in _skeuo-render)
  camera: { screenMin: 2, lens: {} }, 'camera-off': { screenMin: 2, lens: {} }, webcam: { screenMin: 2, lens: {} },
  pin: { body: 'red', part: 'steel' },
  rss: { aAsBody: true, body: 'orange' },
  lock: { groove: 1.5 }, unlock: { groove: 1.5 },
  // paper stays paper: the second sheet / board is not a metal part
  copy: { part: 'paper' }, files: { part: 'paper' }, edit: { part: 'paper' },
  paste: { part: 'kraft' },
  clipboard: { body: 'kraft', inlay: { mat: 'paper', inset: 1.35 } },
  'clipboard-list': { body: 'kraft', inlay: { mat: 'paper', inset: 1.35 }, print: 'navy', printSkip: [] },
  'clipboard-check': { body: 'kraft', inlay: { mat: 'paper', inset: 1.35 }, print: 'green', printSkip: [] },
  'fast-forward': { part: 'coral' }, 'skip-back': { part: 'coral' }, 'skip-forward': { part: 'coral' }, film: { body: 'charcoal', part: 'charcoal' },
  'file-video': { decal: { 1: 'coral' } },
  scissors: { part: 'steel' }, hammer: { body: 'steel', part: 'wood' },
  'hand-heart': { body: 'teal', part: 'red' },
  hospital: { body: 'white', part: 'red', print: 'red', printSkip: [3, 4] }, ambulance: { body: 'white', part: 'rubber', plates: { p3: 'S' } },
  tooth: { body: 'white' }, bandage: { body: 'kraft', part: 'kraft' }, stethoscope: { body: 'charcoal', part: 'steel' },
  lamp: { body: 'gold', zones: [{ y1: 12.4, mat: 'note', role: 'c3' }] },
  bath: { body: 'white', part: 'steel' }, toilet: { body: 'white', part: 'steel' },
  refrigerator: { body: 'white', part: 'steel' }, 'washing-machine': { body: 'white', part: 'steel' },
  cookie: { body: 'kraft' }, donut: { body: 'pink', w: 1.3 },
  football: { body: 'white' }, volleyball: { body: 'white' }, turtle: { body: 'leaf', part: 'leaf' },
}

// ---- Live icons (forge/dynamic): the generator name is the icon name; params ride along on icon.params.
// Printed text is debossed on light materials and a raised white inlay on enamel / dark ones.
const EM = { grooveAs: 'emboss', groove: 1.25 }
const isBar = d => /^M[\d.]+ [\d.]+ H[\d.]+ V[\d.]+ H[\d.]+ V/.test(d || '')
// a battery: a dark glass window in a graphite case, the charge a lit cell raised inside it
const battery = icon => {
  const p = icon.params || {}, lvl = p.level > 1 ? p.level / 100 : (p.level ?? 1)
  const bar = (icon.paths || []).find(x => x.plate === 'A' && isBar(x.d))
  const t = { part: 'steel', screen: true, ...EM }
  if (bar) Object.assign(t, { lift: [bar.id], liftMat: lvl < 0.25 ? 'orange' : 'green', wLift: 2 })
  return t
}
const HEAD = { zones: [{ y1: 11.25, mat: 'red', role: 'c3', text: 'white' }] }
const STRIP = { zones: [{ y1: 5.1, mat: 'red', role: 'c3' }] }
const FILETYPE = { PDF: 'red', DOC: 'blue', DOCX: 'blue', TXT: 'navy', CSV: 'green', XLS: 'green', XLSX: 'green', ZIP: 'orange', RAR: 'orange',
  JS: 'orange', TS: 'blue', PPT: 'coral', PPTX: 'coral', PNG: 'violet', JPG: 'violet', SVG: 'violet', GIF: 'violet', MP3: 'pink', MP4: 'coral', MOV: 'coral' }
Object.assign(T, {
  'alarm-clock-time': { ...FACE('red'), part: 'gold' }, 'clock-time': FACE(), stopwatch: FACE('steel'),
  'watch-time': { ...FACE('graphite', 'ceramic', 1.15), screen: false },
  'battery-level': battery, 'battery-vertical': battery, 'battery-charging-level': battery, 'battery-percent': battery,
  'calendar-date': HEAD, 'calendar-month': HEAD, 'calendar-weekday': HEAD,
  'calendar-event': STRIP, 'calendar-range': STRIP, 'calendar-tear': { zones: [{ y1: 7, mat: 'red', role: 'c3' }] },
  'cellular-tech': icon => (icon.fills || []).length ? EM : { body: 'navy', w: 1.7 },
  'digital-clock': icon => (icon.fills || []).length ? { body: 'charcoal', ...EM } : { w: 2 },
  'file-type': icon => ({ print: FILETYPE[String((icon.params || {}).type || '').toUpperCase()] || 'navy' }),
  humidity: { body: 'water' }, keycap: { body: 'graphite', ...EM, skipCut: [0], noInner: true, zones: [{ y0: 17, mat: 'rubber', role: 'c3' }] },
  'map-pin-number': { body: 'red', ...EM }, 'sale-sticker': { body: 'red', ...EM }, 'ribbon-label': { body: 'red', ...EM },
  'tag-label': { body: 'kraft' },
  'avatar-initials': EM, 'badge-text': EM, 'percent-badge': EM, 'price-tag': EM, 'speech-bubble-text': EM, 'step-number': EM,
  'signal-bars': { body: 'green' }, 'wifi-strength': { body: 'blue' }, 'rating-stars': { body: 'yellow', part: 'yellow' },
  'uv-index': { body: 'yellow', part: 'orange' },
  // free-standing numerals: rods at line weight so digits never fuse
  weather: { wA: 1.85 }, 'wind-speed': { w: 2 }, 'gauge-value': { wA: 1.85 },
  'thermometer-level': { wA: 1.85, print: 'red', printSkip: [] },
})

export const TUNE = T
// icon (or a name): entries may be functions of the icon, so a Live icon can react to its params
export const tune = icon => {
  const t = T[typeof icon === 'string' ? icon : icon && icon.name]
  return (typeof t === 'function' ? t(icon) : t) || {}
}

// hand-built redraws: return IconNodes for an icon, or null to use the automatic build
export function redraw(icon, t) {
  return null
}
