// @withicons/search — dependency-free icon search engine.
// This file is the single source; forge/lib/emit-search.mjs wraps it into ESM, CJS and a browser global.
// Keep it free of imports and of anything environment-specific.

export const ENGINE_VERSION = '1.1.0'

// ---------------------------------------------------------------- text normalisation
const FOLD = { 'ß': 'ss', 'æ': 'ae', 'œ': 'oe', 'ø': 'o', 'ł': 'l', 'đ': 'd', 'ð': 'd', 'þ': 'th', 'ı': 'i' }
export function fold(s) {
  return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[ßæœøłđðþı]/gi, c => { const r = FOLD[c.toLowerCase()]; return r || c })
}

// "ArrowRight", "arrow-right", "arrow_right", "Arrow Right!" -> ['arrow', 'right']
const PLAIN = /^[a-z0-9]+( [a-z0-9]+)*$/
export function words(s) {
  if (typeof s === 'string' && PLAIN.test(s)) return s.split(' ')
  const t = fold(s)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’`](s\b)?/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
  return t ? t.split(' ') : []
}

// Light English stemmer: plurals, -ing, -ed, -er, doubled consonants, final e.
// delete/deletes/deleting/deleted/deleter -> "delet"; files/file -> "fil"; settings/setting -> "set"
export function stem(w) {
  if (w.length < 4 || /\d/.test(w)) return w
  let s = w
  if (s.endsWith('ies') && s.length > 4) s = s.slice(0, -3) + 'y'
  else if (/(ss|x|z|ch|sh)es$/.test(s)) s = s.slice(0, -2)
  else if (s.endsWith('s') && !/(ss|us|is)$/.test(s)) s = s.slice(0, -1)
  if (s.endsWith('ing') && s.length >= 6) s = s.slice(0, -3)
  else if (s.endsWith('ed') && !s.endsWith('eed') && s.length >= 5) s = s.slice(0, -2)
  if (s.endsWith('er') && s.length >= 6) s = s.slice(0, -2)
  if (s.length >= 4 && /([b-df-hj-np-tv-z])\1$/.test(s)) s = s.slice(0, -1)
  if (s.endsWith('e') && s.length >= 5) s = s.slice(0, -1)
  return s
}

// Damerau-Levenshtein (optimal string alignment) with an early exit once every cell in a row exceeds max.
export function distance(a, b, max = 99) {
  const la = a.length, lb = b.length
  if (Math.abs(la - lb) > max) return max + 1
  if (!la) return lb
  if (!lb) return la
  let p2 = new Array(lb + 1), p1 = new Array(lb + 1), cur = new Array(lb + 1)
  for (let j = 0; j <= lb; j++) p1[j] = j
  for (let i = 1; i <= la; i++) {
    cur[0] = i
    let rowMin = i
    const ca = a.charCodeAt(i - 1)
    for (let j = 1; j <= lb; j++) {
      const cb = b.charCodeAt(j - 1)
      let v = Math.min(p1[j] + 1, cur[j - 1] + 1, p1[j - 1] + (ca === cb ? 0 : 1))
      if (i > 1 && j > 1 && ca === b.charCodeAt(j - 2) && a.charCodeAt(i - 2) === cb) v = Math.min(v, p2[j - 2] + 1)
      cur[j] = v
      if (v < rowMin) rowMin = v
    }
    if (rowMin > max) return max + 1
    const t = p2; p2 = p1; p1 = cur; cur = t
  }
  return p1[lb]
}

// Keyboard- and sound-aware edit cost (optimal string alignment). Cheap slips cost less than a full edit:
//   adjacent QWERTY key 0.5 · sound-alike letters (c/k/s, f/v, i/y …) 0.6 · vowel for vowel 0.75
//   doubled / undoubled letter 0.5 · transposition 0.75 · anything else 1
const KB = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']
const KEYPOS = {}
KB.forEach((row, r) => { for (let c = 0; c < row.length; c++) KEYPOS[row[c]] = [r, c + r * 0.5] })
const SOUND = new Set(['ck', 'cs', 'kq', 'sz', 'fv', 'iy', 'gj', 'xz', 'cq'])
const isV = c => c === 97 || c === 101 || c === 105 || c === 111 || c === 117
const SUB = new Map()
function subCost(x, y) {
  const k = x < y ? x * 128 + y : y * 128 + x
  let v = SUB.get(k)
  if (v !== undefined) return v
  const a = String.fromCharCode(x), b = String.fromCharCode(y), pa = KEYPOS[a], pb = KEYPOS[b]
  v = 1
  if (isV(x) && isV(y)) v = 0.75
  if (SOUND.has(a < b ? a + b : b + a)) v = 0.6
  if (pa && pb && Math.abs(pa[0] - pb[0]) <= 1 && Math.abs(pa[1] - pb[1]) <= 1) v = 0.5
  SUB.set(k, v)
  return v
}
// cost of deleting / inserting s[i]: half when it only doubles a neighbour or is a near-silent letter
// (the c of ck, the h of ph/sh/ch/th/gh/wh, the u of qu, a final e)
function indel(s, i) {
  const c = s.charCodeAt(i), p = s.charCodeAt(i - 1), n = s.charCodeAt(i + 1)
  if (c === p || c === n) return 0.5
  if (c === 99 && n === 107) return 0.5
  if (c === 104 && (p === 99 || p === 115 || p === 112 || p === 116 || p === 103 || p === 119)) return 0.5
  if (c === 117 && p === 113) return 0.5
  if (c === 101 && i === s.length - 1 && i > 1 && !isV(p)) return 0.5
  return 1
}
export function weightedDistance(a, b, max = 99) {
  const la = a.length, lb = b.length
  if (Math.abs(la - lb) * 0.5 > max) return max + 1
  const ind = (s, i) => indel(s, i)
  let p2 = new Array(lb + 1), p1 = new Array(lb + 1), cur = new Array(lb + 1)
  p1[0] = 0
  for (let j = 1; j <= lb; j++) p1[j] = p1[j - 1] + ind(b, j - 1)
  for (let i = 1; i <= la; i++) {
    const del = ind(a, i - 1)
    cur[0] = p1[0] + del
    let rowMin = cur[0]
    const ca = a.charCodeAt(i - 1)
    for (let j = 1; j <= lb; j++) {
      const cb = b.charCodeAt(j - 1)
      let v = Math.min(p1[j] + del, cur[j - 1] + ind(b, j - 1), p1[j - 1] + (ca === cb ? 0 : subCost(ca, cb)))
      if (i > 1 && j > 1 && ca === b.charCodeAt(j - 2) && a.charCodeAt(i - 2) === cb && ca !== cb) v = Math.min(v, p2[j - 2] + 0.75)
      cur[j] = v
      if (v < rowMin) rowMin = v
    }
    if (rowMin > max) return max + 1
    const t = p2; p2 = p1; p1 = cur; cur = t
  }
  return p1[lb]
}

// Compact English phonetic key (a simplified Metaphone): fone/phone -> FN, nite/night -> NT,
// kalender/calendar -> KLNDR, skedule/schedule -> SKDL, sizzors/scissors -> SSRS, skware/square -> SKWR.
const PV = new Uint8Array(128); for (const c of 'aeiou') PV[c.charCodeAt(0)] = 1
const PSOFT = new Uint8Array(128); for (const c of 'eiy') PSOFT[c.charCodeAt(0)] = 1
export function phonetic(word) {
  let w = String(word || '')
  if (!/^[a-z]+$/.test(w)) w = w.toLowerCase().replace(/[^a-z]/g, '')
  if (!w) return ''
  const c0 = w.charCodeAt(0), c1 = w.charCodeAt(1)
  // kn gn pn wr ps -> drop the first letter; x -> s; wh -> w
  if ((c1 === 110 && (c0 === 107 || c0 === 103 || c0 === 112)) || (c0 === 119 && c1 === 114) || (c0 === 112 && c1 === 115)) w = w.slice(1)
  else if (c0 === 120) w = 's' + w.slice(1)
  else if (c0 === 119 && c1 === 104) w = 'w' + w.slice(2)
  // collapse doubled letters (except c: "acc-")
  const a = []
  for (let i = 0; i < w.length; i++) { const c = w.charCodeAt(i); if (c !== 99 && c === a[a.length - 1]) continue; a.push(c) }
  const L = a.length, at = i => (i < L ? a[i] : 0)
  let out = '', last = 0
  const emit = c => { if (c !== last) { out += String.fromCharCode(c); last = c } }
  for (let i = 0; i < L; i++) {
    const c = a[i], n = at(i + 1), p = i ? a[i - 1] : 0
    if (PV[c]) { if (i === 0) emit(65); last = 0; continue }
    switch (c) {
      case 98: if (!(p === 109 && i === L - 1)) emit(66); break // b (silent in -mb)
      case 99: // c
        if (n === 105 && at(i + 2) === 97) emit(88)
        else if (n === 104) { emit(p === 115 ? 75 : 88); i++ }
        else if (PSOFT[n]) emit(83)
        else emit(75)
        break
      case 100: if (n === 103 && PSOFT[at(i + 2)]) { emit(74); i++ } else emit(68); break // d (kept apart from t)
      case 103: // g
        if (n === 104) { if (i === 0) emit(75); else if (PV[at(i + 2)]) emit(70); i++ }
        else if (n === 110 && (i + 2 === L || (i + 4 === L && at(i + 2) === 101 && at(i + 3) === 100))) { /* sign, signed */ }
        else emit(PSOFT[n] ? 74 : 75)
        break
      case 104: if (PV[n] && !(p === 99 || p === 115 || p === 112 || p === 116 || p === 103)) emit(72); break // h
      case 107: if (p !== 99) emit(75); break // k
      case 112: if (n === 104) { emit(70); i++ } else emit(80); break // p
      case 113: emit(75); if (n === 117) { emit(87); i++ } break // q, qu
      case 115: // s
        if (n === 104) { emit(88); i++ }
        else if (n === 105 && (at(i + 2) === 111 || at(i + 2) === 97)) emit(88)
        else if (n === 99 && at(i + 2) === 104) { emit(83); emit(75); i += 2 }
        else emit(83)
        break
      case 116: // t
        if (n === 105 && (at(i + 2) === 111 || at(i + 2) === 97)) emit(88)
        else if (n === 104) { emit(48); i++ }
        else if (!(n === 99 && at(i + 2) === 104)) emit(84)
        break
      case 118: emit(70); break // v
      case 119: case 121: if (PV[n]) emit(c - 32); break // w, y before a vowel
      case 120: emit(75); emit(83); break // x
      case 122: emit(83); break // z
      default: emit(c - 32)
    }
  }
  return out
}

const maxTypos = n => (n <= 3 ? 0 : n <= 7 ? 1 : n <= 11 ? 2 : 3)

// Words that carry no meaning in an icon query ("an icon for deleting").
const STOP = new Set(('a an the of for to in on at by with and or my your our me i we is are it its this that these those ' +
  'some any icon icons symbol symbols glyph glyphs pictogram emoji vector svg please show me find need want looking ' +
  'something thing kind like? use used').split(' ').filter(w => !w.endsWith('?')))
// UI modifiers: they may score, but a result never has to contain them.
const SOFT = new Set(['button', 'btn', 'ui', 'outline', 'outlined', 'filled', 'fill', 'stroke', 'small', 'big', 'large',
  'simple', 'basic', 'flat', 'style', 'colored', 'coloured', 'mono', 'monochrome'])
const STYLE_WORDS = { outline: 'line', outlined: 'line', stroke: 'line', filled: 'solid', fill: 'solid', duotone: 'duo', glossy: 'gloss', engraved: 'engrave', sketchy: 'sketch', handdrawn: 'sketch' }

// Small concept map for natural-language queries. Keys and values are plain vocabulary, never icon names
// by fiat: an expansion only helps an icon that itself carries that word in its name/aliases/synonyms/tags.
const CONCEPTS = [
  ['delete remove erase discard destroy throw trash bin rubbish garbage', 'trash bin delete garbage'],
  ['settings setting preferences preference options config configure configuration setup customize customise adjust', 'settings gear cog preferences sliders configure'],
  ['profile account me myself avatar person member customer', 'user account profile person avatar'],
  ['money cash pay payment paid price cost finance financial salary budget funds currency dollar euro rich wealth', 'dollar coin coins banknote cash wallet currency payment money'],
  ['buy shop shopping purchase checkout basket order store ecommerce', 'cart shopping bag store buy checkout'],
  ['write writing edit editing modify change rename compose draft', 'pencil edit pen write'],
  ['talk chat conversation comment comments reply discuss discussion speech say', 'message chat comment bubble conversation'],
  ['mail email letter envelope inbox newsletter', 'mail email envelope inbox letter'],
  ['call phone telephone ring dial ringing', 'phone call telephone'],
  ['photo photos picture pictures pic pics snapshot gallery selfie', 'image photo picture camera gallery'],
  ['movie movies film cinema clip footage', 'video film movie play'],
  ['song songs audio sound tune melody listen', 'music audio sound song headphones volume'],
  ['time hour hours minute deadline late early', 'clock time timer hourglass'],
  ['date schedule appointment event meeting agenda planner booking day month', 'calendar date schedule event'],
  ['find look lookup seek magnify magnifier discover explore', 'search find magnifier zoom'],
  ['love like favorite favourite fav liked', 'heart star favorite like love'],
  ['warning danger caution error problem issue risk hazard attention', 'alert warning caution error danger'],
  ['help question support faq ask unsure confused', 'help question support info'],
  ['secure security protect protection privacy private safe safety', 'lock shield secure security protection'],
  ['password login signin authenticate credentials access', 'lock key login password sign'],
  ['logout signout leave quit', 'logout log out exit sign'],
  ['notification notifications alarm reminder notify ping', 'bell notification alert reminder'],
  ['close cancel dismiss exit', 'close x cancel dismiss'],
  ['add new create insert more append', 'plus add new create'],
  ['ok okay done confirm approve approved yes correct success complete completed tick accept valid', 'check done tick confirm success'],
  ['refresh reload sync update retry reset', 'refresh reload sync rotate'],
  ['undo revert back previous return', 'undo back previous left'],
  ['next forward continue proceed', 'next forward right arrow'],
  ['document doc docs paper page report text', 'file document page text'],
  ['directory directories', 'folder directory'],
  ['computer pc desktop workstation display', 'monitor laptop computer desktop screen'],
  ['mobile cellphone cell iphone android handset', 'smartphone phone mobile'],
  ['statistics stats analytics data metrics graph report reports insights kpi', 'chart graph analytics statistics data'],
  ['team group people staff members community crowd employees', 'users team group people'],
  ['house', 'home house'],
  ['work job office business corporate', 'briefcase work business office building'],
  ['school education learn learning study student university college course teach', 'graduation education school book learn'],
  ['read reading library novel', 'book read library'],
  ['programming programmer developer dev coding source script software', 'code terminal developer programming'],
  ['debug debugging defect glitch', 'bug debug'],
  ['drive driving vehicle auto automobile taxi', 'car vehicle drive'],
  ['travel trip vacation holiday flight fly flying airport journey', 'plane travel flight trip map globe'],
  ['world international global internet web website planet earth', 'globe world web internet'],
  ['health medical medicine doctor hospital clinic healthcare', 'heart pulse medical health pill'],
  ['present birthday surprise reward', 'gift present reward'],
  ['drink cafe caffeine tea breakfast', 'coffee cup drink'],
  ['idea ideas inspiration creative creativity insight think thinking', 'lightbulb idea brain think'],
  ['hot warm summer sunny heat', 'sun hot warm temperature'],
  ['cold winter freezing frozen ice icy', 'snow snowflake cold winter'],
  ['night dark evening sleep bedtime', 'moon night dark'],
  ['rain rainy storm stormy wet', 'rain cloud storm umbrella'],
  ['fast quick speed electric energy instant', 'zap lightning fast power'],
  ['win winner prize champion achievement best first', 'trophy award prize winner crown'],
  ['location place address where gps position', 'location pin map place navigation'],
  ['upload', 'upload cloud up'],
  ['download save', 'download save'],
  ['share sharing', 'share send'],
  ['send sent submit', 'send submit'],
  ['view see watch visible visibility show look', 'eye view visible'],
  ['hide hidden invisible', 'eye off hide hidden'],
  ['mute muted silent quiet', 'volume off mute silent'],
  ['loud volume speaker', 'volume speaker sound'],
  ['record recording voice mic', 'microphone record voice'],
  ['link url hyperlink chain', 'link chain url'],
  ['attach attachment attachments', 'paperclip attachment attach'],
  ['print printing printout', 'printer print'],
  ['copy duplicate clone', 'copy duplicate'],
  ['cut trim', 'scissors cut'],
  ['paint painting draw drawing art artist design', 'paintbrush palette brush draw art design'],
  ['color colour colors colours', 'palette color'],
  ['tools tool fix repair maintenance build', 'wrench hammer tool repair'],
  ['launch startup rocket ship boost', 'rocket launch'],
  ['deliver delivery shipping shipment courier', 'truck delivery shipping package'],
  ['box parcel', 'package box parcel'],
  ['ai artificial intelligence robot assistant chatbot', 'bot robot ai assistant sparkles'],
  ['magic', 'wand sparkles magic'],
  ['nature plant eco green environment', 'leaf nature plant eco'],
  ['fire burn burning hot trending popular', 'flame fire'],
  ['happy smiley smile joy emotion feeling', 'smile happy'],
  ['identity id badge identification', 'id card badge identity'],
  ['bank banking government museum', 'landmark bank'],
  ['battery charge charging power', 'battery charging power'],
  ['wireless internet connection network online', 'wifi signal network connection'],
  ['offline disconnected nointernet', 'wifi off offline'],
  ['grid gallery tiles', 'grid layout'],
  ['dashboard overview', 'dashboard layout'],
  ['tasks todo checklist', 'list checks todo task checklist'],
  ['sort order arrange', 'sort order'],
  ['filter filters refine', 'filter funnel'],
  ['fullscreen expand enlarge', 'maximize expand fullscreen'],
  ['shrink collapse exitfullscreen', 'minimize collapse'],
  ['history past recent', 'history clock recent'],
  ['game games gaming play controller', 'gamepad game controller'],
  ['weather forecast climate', 'weather cloud sun rain'],
]

// field weights: name > alias > synonym > tag > category > description
const F_NAME = 0, F_ALIAS = 1, F_SYN = 2, F_TAG = 3, F_CAT = 4, F_DESC = 5
const FIELD_NAMES = ['name', 'alias', 'synonym', 'tag', 'category', 'description']
const FW = [100, 85, 66, 56, 40, 24]
// match quality: exact > prefix > stem > fuzzy
const Q_EXACT = 1, Q_STEM = 0.66, Q_CONCEPT = 0.5
const qPrefix = (q, t) => 0.62 + 0.23 * (q / t)
// kind ids: 0 exact, 1 prefix, 2 stem, 3 typo, 4 concept, 5 similar (n-gram), 6 phonetic
const KINDS = ['exact', 'prefix', 'stem', 'typo', 'concept', 'similar', 'phonetic']
// how much a kind corrects the query (the weakest token decides a result's match.kind)
const KIND_RANK = [0, 3, 2, 4, 1, 5, 6]
const CORRECTED = k => k === 3 || k === 5 || k === 6
// "a picture of ...": medium words dropped before "of"
const META = new Set(['picture', 'image', 'icon', 'symbol', 'drawing', 'illustration', 'photo', 'sign', 'graphic', 'logo', 'emoji', 'pic'])
// typo quality from the keyboard-weighted distance: one adjacent-key slip 0.53, one plain edit 0.5, two edits 0.36
const qTypo = wd => (wd <= 1 ? 0.56 - 0.06 * wd : Math.max(0.28, 0.5 - 0.14 * (wd - 1)))
// similarity layer: always below any typo match of the same word
const Q_PHON = 0.33
const qSimilar = dice => 0.12 + 0.18 * dice

const ACRONYMS = { qr: 'QR', id: 'ID', tv: 'TV', cpu: 'CPU', pdf: 'PDF', rss: 'RSS', ai: 'AI', usb: 'USB', ccw: 'CCW', cw: 'CW', wifi: 'Wi-Fi', ui: 'UI', url: 'URL' }
export const titleOf = name => name.split('-').map(w => ACRONYMS[w] || (w[0].toUpperCase() + w.slice(1))).join(' ')

const split = s => (s ? String(s).split('|').filter(Boolean) : [])

// ---------------------------------------------------------------- index decoding
// Compact index (written by forge/lib/emit-search.mjs):
// { format: 'withicons-search@1', version, styles: [[name, title]], categories: [name],
//   icons: [[name, catIdx, 'alias|alias', 'syn|syn', 'tag|tag', 'description words', missingStyleMask?]] }
function decode(index) {
  if (!index || !Array.isArray(index.icons)) throw new TypeError('WithSearch.create(index): index.icons missing — load data/search-index.js or @withicons/search/data')
  const styles = (index.styles || []).map(s => (Array.isArray(s) ? { name: s[0], title: s[1] || s[0] } : s))
  const categories = index.categories || []
  const icons = index.icons.map(r => Array.isArray(r) ? {
    name: r[0], category: categories[r[1]] || String(r[1]), aliases: split(r[2]), synonyms: split(r[3]), tags: split(r[4]),
    description: r[5] || '', missing: r[6] || 0,
  } : { name: r.name, category: r.category, aliases: r.aliases || [], synonyms: r.synonyms || [], tags: r.tags || [], description: r.description || '', missing: 0 })
  return { styles, categories, icons, version: index.version || '' }
}

// ---------------------------------------------------------------- engine
export function create(index) {
  const data = decode(index)
  const icons = data.icons
  const N = icons.length
  const styleIdx = new Map(data.styles.map((s, i) => [s.name, i]))
  const iconIdx = new Map(icons.map((ic, i) => [ic.name, i]))

  // entries: one per (icon, field, phrase); tokens are interned into a vocabulary
  const eIcon = [], eField = [], eText = [], eLen = []
  const vocab = new Map(), tokens = [], postings = [] // postings[t] = [entry, pos, entry, pos, ...]; pos -1 = whole-entry compact form
  const phraseOf = new Map() // compact form -> spaced phrase ("shoppingcart" -> "shopping cart")
  const intern = t => { let id = vocab.get(t); if (id === undefined) { id = tokens.length; vocab.set(t, id); tokens.push(t); postings.push([]) } return id }
  const prior = new Float64Array(N)
  const addEntry = (i, field, text, ws) => {
    if (field === F_DESC) ws = ws.filter(w => !STOP.has(w))
    const n = ws.length
    if (!n) return
    const e = eIcon.length
    eIcon.push(i); eField.push(field); eText.push(text); eLen.push(n)
    for (let p = 0; p < n; p++) { const w = ws[p]; if (ws.indexOf(w) === p) postings[intern(w)].push(e, p) }
    if (n > 1 && field !== F_DESC) { const c = ws.join(''); if (!ws.includes(c)) { postings[intern(c)].push(e, -1); if (!phraseOf.has(c)) phraseOf.set(c, ws.join(' ')) } }
  }
  const aliasWords = []
  icons.forEach((ic, i) => {
    const nameWords = ic.name.split('-')
    addEntry(i, F_NAME, ic.name, nameWords)
    const dedupe = new Set([nameWords.join(' ')])
    const lists = [ic.aliases, ic.synonyms, ic.tags]
    for (let f = 0; f < 3; f++) {
      for (const a of lists[f]) {
        const ws = words(a), k = ws.join(' ')
        if (f === 0) aliasWords.push([i, ws])
        if (!k || dedupe.has(k)) continue
        dedupe.add(k); addEntry(i, F_ALIAS + f, a, ws)
      }
    }
    addEntry(i, F_CAT, ic.category, words(ic.category))
    addEntry(i, F_DESC, ic.description, words(ic.description))
    // tiny popularity prior: richly described icons are the common ones; base names beat compound ones
    prior[i] = 0.04 * Math.min(ic.aliases.length + ic.synonyms.length, 50) - 0.6 * (nameWords.length - 1)
  })
  const T = tokens.length
  const stems = new Map()
  for (let id = 0; id < T; id++) { const st = stem(tokens[id]); const l = stems.get(st); if (l) l.push(id); else stems.set(st, [id]) }
  const sortedTok = tokens.slice().sort()
  const sorted = sortedTok.map(t => vocab.get(t))
  const byLen = [] // token ids by length, for brute-force fuzzy on short words
  for (let id = 0; id < T; id++) { const L = tokens[id].length; (byLen[L] || (byLen[L] = [])).push(id) }
  // trigram index for fuzzy candidates — built lazily on the first query that needs it
  let tri = null
  const grams = t => { const p = '$' + t + '$', g = []; for (let k = 0; k + 3 <= p.length; k++) g.push(p.slice(k, k + 3)); return g }
  const trigrams = () => tri || buildTri()
  function buildTri() {
    tri = new Map()
    for (let id = 0; id < T; id++) {
      const t = tokens[id]
      if (t.length < 4) continue
      const p = '$' + t + '$'
      for (let k = 0; k + 3 <= p.length; k++) {
        const g = p.slice(k, k + 3)
        const l = tri.get(g)
        if (!l) tri.set(g, [id]); else if (l[l.length - 1] !== id) l.push(id)
      }
    }
    return tri
  }

  // similarity layer — all lazy, built on the first query that falls through to it
  // tokField[t]: best (lowest) non-description field the token appears in as a real word; 9 = description / compact only
  let tokField = null
  function fields() {
    if (tokField) return tokField
    tokField = new Uint8Array(T).fill(9)
    for (let id = 0; id < T; id++) {
      const post = postings[id]
      for (let x = 0; x < post.length; x += 2) { const f = eField[post[x]]; if (f < F_CAT && post[x + 1] >= 0 && f < tokField[id]) tokField[id] = f }
    }
    return tokField
  }
  // a token that names something (name/alias/synonym/tag word, or a compact phrase of one)
  const useful = id => fields()[id] < 9 || phraseOf.has(tokens[id])
  let phon = null
  function phonIndex() {
    if (phon) return phon
    phon = new Map()
    for (let id = 0; id < T; id++) {
      const t = tokens[id]
      if (t.length < 3 || /[0-9]/.test(t) || !useful(id)) continue
      const k = phonetic(t)
      if (k.length < 2) continue
      const l = phon.get(k); if (l) l.push(id); else phon.set(k, [id])
    }
    return phon
  }
  // padded character bigrams, for Dice similarity against every useful vocabulary term
  let bi = null, biN = null, biCount = null
  function bigrams() {
    if (bi) return bi
    bi = new Map(); biN = new Uint8Array(T); biCount = new Uint16Array(T)
    for (let id = 0; id < T; id++) {
      const t = tokens[id]
      if (t.length < 4 || /[0-9]/.test(t) || !useful(id)) continue
      const seen = new Set(), p = '^' + t + '$'
      for (let k = 0; k + 2 <= p.length; k++) {
        const g = p.slice(k, k + 2)
        if (seen.has(g)) continue
        seen.add(g)
        const l = bi.get(g); if (l) l.push(id); else bi.set(g, [id])
      }
      biN[id] = seen.size
    }
    return bi
  }
  function similar(w, limit) {
    const idx = bigrams(), seen = new Set(), p = '^' + w + '$', touched = []
    for (let k = 0; k + 2 <= p.length; k++) {
      const g = p.slice(k, k + 2)
      if (seen.has(g)) continue
      seen.add(g)
      for (const id of idx.get(g) || []) { if (!biCount[id]) touched.push(id); biCount[id]++ }
    }
    const n = seen.size, out = []
    for (const id of touched) {
      const c = biCount[id]; biCount[id] = 0
      const dice = 2 * c / (n + biN[id])
      if (dice >= 0.65) out.push([id, dice])
    }
    out.sort((a, b) => b[1] - a[1] || a[0] - b[0])
    return out.slice(0, limit)
  }
  // "lightbulbidea" -> ['lightbulb', 'idea']: only when the word is unknown and both halves are real words
  function splitWord(w) {
    if (w.length < 6 || vocab.has(w) || stems.has(stem(w)) || /[0-9]/.test(w)) return null
    let best = null, bs = 0
    for (let k = 3; k <= w.length - 3; k++) {
      const a = vocab.get(w.slice(0, k)), b = vocab.get(w.slice(k))
      if (a === undefined || b === undefined || fields()[a] === 9 || fields()[b] === 9) continue
      const s = Math.min(k, w.length - k)
      if (s > bs) { bs = s; best = [w.slice(0, k), w.slice(k)] }
    }
    // a near-miss of one real word beats two short ones ("shoppng" is shopping, not shop + png)
    if (best) for (const m of matchToken(w, false)) if (m.kind === 3 && m.d <= 1 && useful(m.id)) return null
    return best
  }
  const hasPrefix = w => {
    let lo = 0, hi = T
    while (lo < hi) { const m = (lo + hi) >> 1; if (tokens[sorted[m]] < w) lo = m + 1; else hi = m }
    for (let k = lo; k < T && k < lo + 40; k++) { const t = tokens[sorted[k]]; if (!t.startsWith(w)) return false; if (t !== w && useful(sorted[k])) return true }
    return false
  }

  // concept map: stem -> expansion words
  const concept = new Map()
  for (const [keys, exp] of CONCEPTS) {
    const ex = exp.split(' ')
    for (const k of keys.split(' ')) {
      const st = stem(k)
      for (const key of st.length >= 4 && st !== k ? [k, st] : [k]) concept.set(key, [...new Set([...(concept.get(key) || []), ...ex])])
    }
  }

  // aliases for resolve(): exact kebab forms and compact forms
  const canon = new Set(icons.map(i => i.name))
  const aliasMap = new Map(), compactMap = new Map()
  const push = (m, k, v) => { const l = m.get(k); if (!l) m.set(k, [v]); else if (!l.includes(v)) l.push(v) }
  const lexicon = [] // [compact form, icon idx, isName]
  icons.forEach((ic, i) => { const c = ic.name.replace(/-/g, ''); push(compactMap, c, ic.name); lexicon.push([c, i, 1]) })
  for (const [i, ws] of aliasWords) {
    const k = ws.join('-'), name = icons[i].name
    if (!k) continue
    lexicon.push([ws.join(''), i, 0])
    if (canon.has(k)) continue
    push(aliasMap, k, name); push(compactMap, ws.join(''), name)
  }

  // -------------------------------------------------------------- token matching
  // returns [{ id, q, kind, d }] kind: 0 exact, 1 prefix, 2 stem, 3 typo, 4 concept, 5 similar, 6 phonetic
  function matchToken(w, allowPrefix) {
    const out = new Map()
    const put = (id, q, kind, d, src) => { const o = out.get(id); if (!o || o.q < q) out.set(id, { id, q, kind, d: d || 0, src }) }
    const exact = vocab.get(w)
    // a misspelling the data carries as a synonym still counts as a correction ("calender" -> calendar)
    if (exact !== undefined) put(exact, Q_EXACT, knownFix(w) ? 3 : 0)
    const s = stem(w)
    for (const id of stems.get(s) || []) put(id, Q_STEM, 2)
    if (allowPrefix && w.length >= 1) {
      let lo = 0, hi = T
      while (lo < hi) { const m = (lo + hi) >> 1; if (tokens[sorted[m]] < w) lo = m + 1; else hi = m }
      for (let k = lo, n = 0; k < T && n < 80; k++) {
        const t = tokens[sorted[k]]
        if (!t.startsWith(w)) break
        if (t.length > w.length) { put(sorted[k], qPrefix(w.length, t.length), 1); n++ }
      }
    }
    const max = maxTypos(w.length)
    // a word that exists verbatim in the vocabulary is not a misspelling ("wallet" must not pull in mallet/pallet),
    // unless the data itself marks it as a known misspelling ("calender")
    if (w.length >= 3 && (exact === undefined || knownFix(w)) && (max > 0 || out.size === 0)) {
      // integer edits up to max, plus one more when the extra edit is a cheap slip (adjacent key, doubled letter)
      // the extra edit is only tried for words nothing else explains (keeps "cat" from turning into car/chat)
      let known = false
      for (const o of out.values()) if (o.kind < 3 || o.d === 0) { known = true; break }
      const lim = known ? max : max + 1, wmax = max === 0 ? 0.5 : max
      const cand = new Set()
      if (w.length <= 5) {
        for (let L = w.length - lim; L <= w.length + lim; L++) for (const id of byLen[L] || []) cand.add(id)
      } else {
        const tg = trigrams(); for (const g of grams(w)) for (const id of tg.get(g) || []) cand.add(id)
      }
      for (const id of cand) {
        const t = tokens[id]
        if (Math.abs(t.length - w.length) > lim) continue
        // short words: first letter must agree (cat/hat noise)
        if (w.length <= 5 && t[0] !== w[0] && !(t[0] === w[1] && t[1] === w[0])) continue
        const d = distance(w, t, lim)
        if (d < 1 || d > lim) continue
        const wd = weightedDistance(w, t, d)
        // an edit beyond the length budget never scores like a single plain typo
        if (d <= max || wd <= wmax) put(id, qTypo(d > max ? Math.max(wd, 0.75 * d) : wd), 3, wd)
      }
      // fuzzy prefix for as-you-type with a typo ("calnd" -> calendar)
      if (allowPrefix && w.length >= 6) {
        for (const id of cand) {
          const t = tokens[id]
          if (t.length <= w.length + 1) continue
          const d = distance(w, t.slice(0, w.length), 1)
          if (d === 1) put(id, 0.4, 3, 1)
        }
      }
    }
    // similarity layer: only when nothing exact, stem, prefix or a one-edit typo explains the word
    let known = false, strong = false
    for (const o of out.values()) { if (o.kind < 3 || o.d === 0) known = true; if (o.kind < 3 || o.d <= 1) strong = true }
    if (!known && w.length >= 3 && !/[0-9]/.test(w)) {
      const key = phonetic(w)
      const lim = w.length <= 3 ? 1 : Math.max(2, Math.floor(w.length / 3) + 1)
      if (key.length >= (w.length <= 4 ? 3 : 2)) for (const id of phonIndex().get(key) || []) {
        if (out.has(id)) continue
        const d = distance(w, tokens[id], lim)
        if (d <= lim) put(id, Q_PHON - 0.01 * d, 6, d)
      }
      if (!strong && w.length >= 4) for (const [id, dice] of similar(w, 12)) {
        const lt = tokens[id].length
        if (Math.min(lt, w.length) < 0.75 * Math.max(lt, w.length) || tokens[id][0] !== w[0]) continue
        put(id, qSimilar(dice), 5, 1 - dice)
      }
    }
    // concept expansions (exact / stem only, or the single best correction of an unknown word)
    let ex = concept.get(w) || (s.length >= 4 ? concept.get(s) : null), cq = 1, ck = 4, bt
    if (!ex && exact === undefined) {
      let bq = 0
      for (const o of out.values()) if (CORRECTED(o.kind) && o.q > bq) { bq = o.q; bt = tokens[o.id]; ck = o.kind }
      if (bt) { ex = concept.get(bt) || concept.get(stem(bt)); cq = bq * 0.8 }
    }
    if (ex) for (const e of ex) {
      if (e === w) continue
      const id = vocab.get(e)
      if (id !== undefined) put(id, Q_CONCEPT * cq, ck, 0, bt)
      for (const sid of stems.get(stem(e)) || []) put(sid, Q_CONCEPT * 0.92 * cq, ck, 0, bt)
    }
    return [...out.values()]
  }

  // query -> { all: every word, required/soft: [{ w, pos }] indexes into all, style }
  function parse(query) {
    let all = words(query)
    // missing spaces: "lightbulbidea" -> "lightbulb idea" (only unknown words that split into two real words)
    let split = false
    if (all.some(w => w.length >= 6)) all = all.flatMap(w => { const sp = splitWord(w); if (sp) split = true; return sp || [w] })
    // "a picture of a house", "icon of a cat": the meta word names the medium, not the subject
    all = all.filter((w, k) => !(META.has(w) && all[k + 1] === 'of' && k + 2 < all.length))
    let style = null
    const content = all.map((w, pos) => ({ w, pos })).filter(t => !STOP.has(t.w))
    const ws = content.length ? content : all.map((w, pos) => ({ w, pos }))
    const required = [], soft = []
    for (const t of ws) {
      const w = t.w
      if (STYLE_WORDS[w] && styleIdx.has(STYLE_WORDS[w])) style = STYLE_WORDS[w]
      if (styleIdx.has(w) && ws.length > 1) { style = style || w; soft.push(t) }
      else if (SOFT.has(w) && ws.length > 1) soft.push(t)
      else required.push(t)
    }
    if (!required.length && soft.length) required.push(soft.shift())
    return { all, required, soft, style, split, words: ws.map(t => t.w) }
  }

  // -------------------------------------------------------------- search
  function search(query, opts) {
    opts = opts || {}
    const limit = opts.limit == null ? 24 : Math.max(0, opts.limit | 0)
    const cat = opts.category && opts.category !== 'all' ? String(opts.category) : null
    const st = opts.style && opts.style !== 'all' ? String(opts.style) : null
    const sBit = st ? styleIdx.get(st) : undefined
    const allowed = i => (!cat || icons[i].category === cat) && (!st || (sBit !== undefined && !(icons[i].missing & (1 << sBit))))
    const p = parse(query)
    if (!p.required.length) {
      if (!cat) return []
      const res = []
      for (let i = 0; i < N; i++) if (allowed(i)) res.push(result(i, 0, { field: 'category', term: cat, typo: false, kind: 'exact' }))
      return res.slice(0, limit)
    }
    const qt = p.required.concat(p.soft)
    const nq = qt.length, nreq = p.required.length
    const best = qt.map(() => new Float64Array(N))
    const bestInfo = qt.map(() => new Array(N))
    const extra = new Float64Array(N)
    const entryHits = new Map() // entry -> { mask, n, qk[], pos[], joined }
    const hit = (e, k, q, pos) => {
      let h = entryHits.get(e)
      if (!h) entryHits.set(e, h = { mask: 0, n: 0, qk: [], pos: [], joined: false })
      if (!(h.mask & (1 << k))) { h.mask |= 1 << k; h.n++; h.qk[k] = q; h.pos[k] = pos }
      else if (q > h.qk[k]) { h.qk[k] = q; h.pos[k] = pos }
      return h
    }
    const lastPos = Math.max(...qt.map(t => t.pos))
    for (let k = 0; k < nq; k++) {
      const w = qt[k].w
      // prefix (as-you-type) only for the word being typed: the last one
      const allowPrefix = qt[k].pos === lastPos && (w.length >= 2 || nq === 1)
      for (const m of matchToken(w, allowPrefix)) {
        const post = postings[m.id]
        for (let x = 0; x < post.length; x += 2) {
          const e = post[x], f = eField[e], i = eIcon[e]
          if (f === F_DESC && m.kind !== 0 && m.kind !== 2) continue
          if (f === F_CAT && CORRECTED(m.kind)) continue
          const cov = post[x + 1] < 0 ? (m.kind === 1 ? 0.8 : 1) : 0.75 + 0.25 / eLen[e]
          const sc = FW[f] * m.q * cov
          if (sc > best[k][i]) {
            if (best[k][i] > 0) extra[i] += best[k][i] * 0.03
            best[k][i] = sc; bestInfo[k][i] = { e, kind: m.kind, w: m.src || tokens[m.id] }
          } else extra[i] += sc * 0.03
          if (nq > 1 && post[x + 1] >= 0) hit(e, k, m.q, post[x + 1])
        }
      }
    }
    // joined words ("trash can" -> "trashcan", "sign in" -> "signin", "lap top" -> "laptop"), stopwords included
    const all = p.all
    if (all.length > 1) {
      for (let a = 0; a < all.length; a++) for (let b = a + 1; b < Math.min(all.length, a + 4); b++) {
        const id = vocab.get(all.slice(a, b + 1).join(''))
        if (id === undefined) continue
        const jk = knownFix(tokens[id]) || all.slice(a, b + 1).some(knownFix) ? 3 : 0
        const ks = []
        for (let k = 0; k < nq; k++) if (qt[k].pos >= a && qt[k].pos <= b) ks.push(k)
        if (!ks.length) continue
        const post = postings[id]
        for (let x = 0; x < post.length; x += 2) {
          const e = post[x], f = eField[e], i = eIcon[e]
          if (f === F_DESC) continue
          const whole = post[x + 1] < 0 || eLen[e] === 1
          const sc = FW[f] * (whole ? 1 : 0.75 + 0.25 / eLen[e])
          for (const k of ks) {
            if (sc > best[k][i]) { best[k][i] = sc; bestInfo[k][i] = { e, kind: jk, w: jk ? all[qt[k].pos] : tokens[id] } }
            const h = hit(e, k, 1, post[x + 1] < 0 ? k : post[x + 1])
            if (whole) h.joined = true
          }
        }
      }
    }
    // phrase bonus: one entry carrying several (or all) query words, in order and adjacent counts most
    const phrase = new Float64Array(N), phraseEntry = new Array(N)
    for (const [e, h] of entryHits) {
      if (h.n < 2 && !h.joined) continue
      const i = eIcon[e]
      let adj = 1, q = 0
      for (let k = 0; k < nq; k++) if (h.mask & (1 << k)) q += h.qk[k]
      if (!h.joined) { let prev = null; for (let k = 0; k < nq; k++) { const ps = h.pos[k]; if (ps === undefined) continue; if (prev !== null && ps !== prev + 1) adj = 0.8; prev = ps } }
      const entryCov = h.joined ? 1 : Math.min(1, h.n / eLen[e])
      const b = FW[eField[e]] * (q / h.n) * entryCov * (h.n / nq) * adj * 0.7
      if (b > phrase[i]) { phrase[i] = b; phraseEntry[i] = { e, full: h.n === nq } }
    }
    const scored = []
    let anyAnd = false
    const total = new Float64Array(N), missing = new Int32Array(N)
    for (let i = 0; i < N; i++) {
      if (!allowed(i)) continue
      let s = 0, soft = 0, miss = 0, hits = 0
      for (let k = 0; k < nq; k++) { const b = best[k][i]; if (b > 0) { if (k < nreq) s += b; else soft += b; hits++ } else if (k < nreq) miss++ }
      if (!hits) continue
      s = s / nreq + soft * 0.15 + phrase[i] + Math.min(extra[i], 6) + prior[i]
      total[i] = s; missing[i] = miss
      if (!miss) anyAnd = true
      scored.push(i)
    }
    // AND first; partial matches join only when they beat the best full match (a weak AND made of noise)
    let bestAnd = 0, bestPart = 0
    for (const i of scored) {
      if (missing[i]) total[i] *= (nreq - missing[i]) / nreq * 0.8
      if (missing[i]) bestPart = Math.max(bestPart, total[i]); else bestAnd = Math.max(bestAnd, total[i])
    }
    const orMode = !anyAnd || bestPart > bestAnd
    const res = []
    for (const i of scored) {
      if (!orMode && missing[i]) continue
      const s = total[i]
      if (s <= 0) continue
      const r = result(i, s, explain(i, nq, best, bestInfo, phraseEntry[i]))
      if (opts.trace) r.trace = { all: p.all, split: p.split, tokens: qt.map((t, k) => ({ pos: t.pos, b: bestInfo[k][i] })) }
      if (opts.debug) {
        r.debug = {
          tokens: qt.map((t, k) => { const b = bestInfo[k][i]; return b ? { q: t.w, matched: b.w, kind: KINDS[b.kind], field: FIELD_NAMES[eField[b.e]], term: eText[b.e], score: +best[k][i].toFixed(2) } : { q: t.w, missing: true } }),
          phrase: phraseEntry[i] ? { term: eText[phraseEntry[i].e], bonus: +phrase[i].toFixed(2) } : null,
          extra: +Math.min(extra[i], 6).toFixed(2), prior: +prior[i].toFixed(2),
        }
      }
      res.push(r)
    }
    res.sort((a, b) => b.score - a.score || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    return res.slice(0, limit)
  }

  function explain(i, nq, best, bestInfo, pe) {
    let info = null, top = 0, kind = -1
    for (let k = 0; k < nq; k++) {
      const b = bestInfo[k][i]
      if (!b) continue
      if (kind < 0 || KIND_RANK[b.kind] > KIND_RANK[kind]) kind = b.kind
      if (best[k][i] > top) { top = best[k][i]; info = b }
    }
    if (pe && pe.full && !CORRECTED(kind)) info = { e: pe.e, kind: 0 }
    if (!info) return { field: 'name', term: icons[i].name, typo: false, kind: 'exact' }
    return { field: FIELD_NAMES[eField[info.e]], term: eText[info.e], typo: CORRECTED(kind), kind: KINDS[kind] }
  }

  function result(i, score, match) {
    const ic = icons[i]
    return { name: ic.name, title: titleOf(ic.name), category: ic.category, score: Math.round(score * 100) / 100, match }
  }

  // -------------------------------------------------------------- did-you-mean
  function suggest(query, n) {
    n = n == null ? 5 : n
    const q = words(query).join('')
    if (!q) return []
    const max = Math.max(2, Math.ceil(q.length / 3))
    const bestD = new Map()
    for (const [c, i, isName] of lexicon) {
      let d
      if (c === q) d = 0
      else if (c.startsWith(q) && q.length >= 3) d = 0.5 + (c.length - q.length) * 0.01
      else { d = distance(q, c, max); if (d > max) continue }
      d += isName ? 0 : 0.25
      const o = bestD.get(i)
      if (o === undefined || d < o) bestD.set(i, d)
    }
    const out = [...bestD].sort((a, b) => a[1] - b[1] || (icons[a[0]].name < icons[b[0]].name ? -1 : 1)).map(x => icons[x[0]].name)
    if (out.length < n) for (const r of search(query, { limit: n * 2 })) if (!out.includes(r.name)) out.push(r.name)
    return out.slice(0, n)
  }

  // -------------------------------------------------------------- didYouMean: corrected query string or null
  // British/American spelling pairs are not misspellings (colour/color, favourite/favorite, centre/center)
  const variant = (a, b) => a.replace(/grey/g, 'gray').replace(/our/g, 'or').replace(/re$/, 'er').replace(/is(e|ing|ed)$/, 'iz$1').replace(/ll(ing|ed|er)/g, 'l$1') ===
    b.replace(/grey/g, 'gray').replace(/our/g, 'or').replace(/re$/, 'er').replace(/is(e|ing|ed)$/, 'iz$1').replace(/ll(ing|ed|er)/g, 'l$1')
  // folders/folder, deleting/delete, batteries/battery: same stem and the same word up to the ending
  const inflection = (a, b) => {
    if (stem(a) !== stem(b)) return false
    let k = 0
    while (k < a.length && a[k] === b[k]) k++
    if (k < Math.min(a.length, b.length) - 1) return false
    const rest = (a.length > b.length ? a : b).slice(k)
    return /^(s|es|ies|ed|d|ing|ings|er|ers|y)$/.test(rest)
  }
  // a vocabulary word shown to people: compact-only forms get their spaces back ("shoppingcart" -> "shopping cart")
  const shown = t => { const id = vocab.get(t); return id !== undefined && fields()[id] !== F_NAME && phraseOf.has(t) ? phraseOf.get(t) : t }
  // a misspelling the data itself carries as a synonym ("hart" on heart, "calender" on calendar) -> the icon's own word
  const fixCache = new Map()
  function knownFix(w) {
    if (fixCache.has(w)) return fixCache.get(w)
    let best = null
    const id = vocab.get(w)
    if (id !== undefined && w.length >= 3 && fields()[id] !== F_NAME && !/[0-9]/.test(w)) {
      const kw = phonetic(w), post = postings[id], names = new Set()
      for (let x = 0; x < post.length; x += 2) if (post[x + 1] >= 0 && eField[post[x]] < F_CAT) names.add(eIcon[post[x]])
      let bd = 9
      for (const i of names) {
        const ic = icons[i]
        for (const nw of ic.name.split('-').concat(...ic.aliases.map(words))) {
          if (nw === w || nw.length < 3 || variant(w, nw) || inflection(w, nw) || fields()[vocab.get(nw)] > F_ALIAS) continue
          const d = weightedDistance(w, nw, 1.5)
          if ((d <= 1.5 || (phonetic(nw) === kw && distance(w, nw, 2) <= 2)) && d < bd) { bd = d; best = nw }
        }
      }
      if (best && fields()[id] === F_ALIAS && bd > 0.75) best = null // aliases are mostly real words: only obvious slips
    }
    fixCache.set(w, best)
    return best
  }
  // didYouMean: the query as the top result understood it, or null when nothing was corrected.
  // Typo / similar / phonetic tokens are replaced by the word they matched; unknown run-together words are split.
  function didYouMean(query) {
    const orig = words(query)
    if (!orig.length) return null
    const [top] = search(query, { limit: 1, trace: true })
    const p = top ? top.trace : parse(query)
    const all = p.all.slice()
    let changed = !!p.split
    if (top) for (const { pos, b } of top.trace.tokens) {
      if (!b) continue
      let t = all[pos]
      if (CORRECTED(b.kind)) t = b.w
      // "bagg", "calendarr": a stem match on a non-word that is no real inflection is a slip too
      else if (b.kind === 2 && !vocab.has(t) && !/(s|ed|ing|er)$/.test(t) && b.w.length < t.length) t = b.w
      else if (b.kind !== 0) continue
      t = shown(knownFix(t) || t)
      if (t !== all[pos]) { all[pos] = t; changed = true }
    }
    return changed ? all.join(' ') : null
  }

  // -------------------------------------------------------------- resolve (names + aliases only)
  function resolve(name) {
    let ws = words(name)
    if (ws.length > 1 && ws[0] === 'icon') ws = ws.slice(1)
    if (ws.length > 1 && ws[ws.length - 1] === 'icon') ws = ws.slice(0, -1)
    const k = ws.join('-')
    if (!k) return { unknown: true, nearest: [] }
    if (canon.has(k)) return { name: k }
    let hit = aliasMap.get(k)
    if (!hit) { const c = compactMap.get(k.replace(/-/g, '')); if (c) hit = c }
    if (hit && hit.length === 1) return hit[0] === k ? { name: k } : { name: hit[0], alias: k }
    if (hit) return { ambiguous: hit.slice().sort() }
    return { unknown: true, nearest: suggest(name, 5) }
  }

  return {
    version: ENGINE_VERSION,
    dataVersion: data.version,
    size: N,
    search, suggest, resolve, parse, didYouMean,
    // build the lazy fuzzy / similarity indexes now (e.g. from requestIdleCallback) instead of on the first misspelled query
    warm: () => { trigrams(); phonIndex(); bigrams(); return true },
    styles: () => data.styles.map(s => ({ name: s.name, title: s.title })),
    categories: () => {
      const c = new Map(); for (const ic of icons) c.set(ic.category, (c.get(ic.category) || 0) + 1)
      return data.categories.filter(x => c.has(x)).map(x => ({ name: x, count: c.get(x) }))
    },
    icons: (category) => icons.filter(ic => !category || ic.category === category).map(ic => ({ name: ic.name, title: titleOf(ic.name), category: ic.category })),
    get: (name) => { const i = iconIdx.get(name); if (i === undefined) return null; const ic = icons[i]; return { name: ic.name, title: titleOf(ic.name), category: ic.category, aliases: ic.aliases.slice(), tags: ic.tags.slice(), description: ic.description } },
  }
}
