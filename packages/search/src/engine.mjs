// @withicons/search — dependency-free icon search engine.
// This file is the single source; forge/lib/emit-search.mjs wraps it into ESM, CJS and a browser global.
// Keep it free of imports and of anything environment-specific.

export const ENGINE_VERSION = '1.5.0'

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
  'something thing kind like? use used logo logos clipart iconography').split(' ').filter(w => !w.endsWith('?')))
// UI modifiers: they may score, but a result never has to contain them.
const SOFT = new Set(['button', 'btn', 'ui', 'outline', 'outlined', 'filled', 'fill', 'stroke', 'small', 'big', 'large',
  'simple', 'basic', 'flat', 'style', 'colored', 'coloured', 'mono', 'monochrome'])
const STYLE_WORDS = {
  outline: 'line', outlined: 'line', stroke: 'line', filled: 'solid', fill: 'solid', duotone: 'duo', glossy: 'gloss', engraved: 'engrave', sketchy: 'sketch', handdrawn: 'sketch',
  glassmorphism: 'glass', glassmorphic: 'glass', glassy: 'glass', frosted: 'glass', frostedglass: 'glass', translucent: 'glass',
  cute: 'kawaii', kawai: 'kawaii', chibi: 'kawaii', adorable: 'kawaii',
  stickers: 'sticker', y2k: 'sticker', scrapbook: 'sticker', diecut: 'sticker',
  '8bit': 'pixel', '16bit': 'pixel', pixelated: 'pixel', pixelart: 'pixel', pixels: 'pixel',
  vintage: 'retro', '70s': 'retro', '80s': 'retro', seventies: 'retro', eighties: 'retro', '1970s': 'retro', '1980s': 'retro',
  twotone: 'duo', bicolor: 'duo', bicolour: 'duo', shiny: 'gloss', etched: 'engrave', engraving: 'engrave', etching: 'engrave',
  schematic: 'blueprint', doodle: 'sketch', doodles: 'sketch', lineart: 'line',
  '3d': 'luxe', luxury: 'luxe', luxurious: 'luxe', premium: 'luxe', gold: 'luxe', golden: 'luxe', deluxe: 'luxe', opulent: 'luxe', lux: 'luxe',
  geometric: 'bauhaus', modernist: 'bauhaus', modernism: 'bauhaus', constructivist: 'bauhaus', midcentury: 'bauhaus',
  skeuomorphic: 'skeuo', skeuomorphism: 'skeuo', skeuomorph: 'skeuo', skeuomorphous: 'skeuo', realistic: 'skeuo', tactile: 'skeuo', photorealistic: 'skeuo', lifelike: 'skeuo',
  manga: 'anime', cel: 'anime', celshaded: 'anime', celshading: 'anime', shoujo: 'anime', shojo: 'anime', shonen: 'anime', ghibli: 'anime', otaku: 'anime',
  goth: 'gothic', medieval: 'gothic', cathedral: 'gothic', castle: 'gothic', victorian: 'gothic', stainedglass: 'gothic', gargoyle: 'gothic', darkacademia: 'gothic',
  pastels: 'pastel', soft: 'pastel', softcolor: 'pastel', softcolour: 'pastel', dreamy: 'pastel', babycolors: 'pastel',
  bow: 'coquette', bows: 'coquette', girly: 'coquette', feminine: 'coquette', ribbons: 'coquette', dainty: 'coquette', balletcore: 'coquette', girlish: 'coquette',
  plushie: 'plush', plushy: 'plush', plushies: 'plush', toy: 'plush', toys: 'plush', kids: 'plush', kid: 'plush', children: 'plush', childrens: 'plush',
  stuffed: 'plush', felt: 'plush', squishy: 'plush', cuddly: 'plush', stuffedtoy: 'plush',
}
// two-word style phrases are joined before parsing: "8 bit" (from "8-bit") -> "8bit"
const STYLE_PHRASES = { '8 bit': '8bit', '16 bit': '16bit', 'pixel art': 'pixelart', 'frosted glass': 'frostedglass', 'die cut': 'diecut', 'hand drawn': 'handdrawn', 'two tone': 'twotone', 'line art': 'lineart', '3 d': '3d', 'mid century': 'midcentury',
  'cel shaded': 'celshaded', 'cel shading': 'celshading', 'stained glass': 'stainedglass', 'dark academia': 'darkacademia', 'soft color': 'softcolor', 'soft colour': 'softcolour',
  'baby colors': 'babycolors', 'stuffed toy': 'stuffedtoy' }
// words after a style word that mark it as a style request ("glass style home", "pixel look")
const STYLE_MARK = new Set(['style', 'styled', 'look', 'effect', 'version', 'variant', 'theme', 'aesthetic'])
// the original seven styles and their words keep their exact 1.1 parsing
const LEGACY_STYLE_WORDS = new Set(['outline', 'outlined', 'stroke', 'filled', 'fill', 'duotone', 'glossy', 'engraved', 'sketchy', 'handdrawn',
  'line', 'solid', 'duo', 'gloss', 'engrave', 'blueprint', 'sketch'])

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
  ['meal meals lunch dinner supper brunch eat eating hungry dining cuisine dish dishes plate', 'food meal restaurant dinner utensils'],
  ['candy candies sweet sweets lollipop chocolate treat treats', 'dessert sweet cake donut cookie'],
  ['bread toast pastry pastries baguette croissant bakery', 'bakery bread cake cookie'],
  ['meat steak bbq barbecue grill grilled chicken beef', 'food meal dinner burger'],
  ['cocktail cocktails booze liquor drinks', 'alcohol drink wine beer'],
  ['sport sports athletics athlete nba nfl fifa league tournament olympic', 'sports sport ball medal'],
  ['yoga pilates stretching stretch training vinyasa', 'fitness workout gym wellness'],
  ['meditation meditate mindfulness mindful zen calm relax relaxing relaxation breathwork selfcare', 'meditation mindfulness relax calm wellness breathe'],
  ['pregnancy pregnant maternity antenatal prenatal obstetrics midwife', 'prenatal maternity'],
  ['tracking tracker realtime', 'tracking location gps'],
  ['zoo wildlife creature creatures', 'animal animals wildlife pet'],
  ['tourism tourist sightseeing', 'travel tourist binoculars map camera'],
  ['autumn fall', 'autumn leaf'],
  ['pool swim swimming', 'swimming water beach'],
]

// Generic modifiers: in a several-word query they count less than the head noun ("fast delivery" is about
// delivery), and a result that misses only them is still a strong partial match.
const MODIFIERS = new Set(('fast quick quickly instant live realtime real secure secured safe smart new latest my your our free easy ' +
  'simple modern online digital pro premium best top auto automatic custom personal private public mobile global virtual ' +
  'daily weekly monthly local main mini basic advanced full total quick express instant cool nice good great better ' +
  'super ultra smart intelligent responsive interactive dynamic active inactive current default').split(' '))

// Common English words the vocabulary does not carry. A word here is a real word, never a typo of a nearby
// vocabulary word ("bean" is not "ban", "grinder" is not "gender", "bear" is not "beer"): it is only corrected when
// nothing else matches and the slip is a cheap one. Generated by packages/search/scripts/dictionary.mjs from
// scripts/common-words.txt (only the words the engine would otherwise mis-correct are kept).
const COMMON_WORDS = 'abacus abbey able absent absolute abstract accountant acoustic acquire acre act actor actress actual adapt admire adorable adult advise aerobics afford afraid afternoon age aged ago airbag aisle alien alley almond alpaca alpha also altar always amazing amber amount ample anchovy angel ankle annoy annual anonymous ant anteater antelope antique anvil anxious ape apologize appear appreciate apricot apron arch architect arctic arena argue armadillo army aroma arrest artichoke artistic ash asparagus assume attend aunt avocado avoid awake aware awful axe axis baboon bachelor bacon badger bagel bagpipe baguette balcony bald ballerina ballet bamboo banana bandana bandit banjo banker barley barometer baseball basil basin bat battle bead beak bean bear beard beast beautiful beaver beet beg behave belief believe belly belong beloved belt bench bend berry bet birth bishop bison bit bizarre blade blame blanket bleach bleed blender bless blinds blink blond blouse blowtorch blush boast bomb bond bone bonnet boots bore born bottle bounce bouncy bowling boxing boy bracelet brag brake brass brave bread breast breed brick bride bridge briefs brim brisk broad brook broom brother brow brown brownie brutal bucket buckle bud buffalo bull bulldozer bumblebee bumpy bunch bungalow burden burrito burst bury bush butcher butler butter buyer cabbage cactus cage calf camel canal candlestick candy cane cannon canoe canoeing canyon capable cape captain caramel caravan carpenter carpet carve cashew casino castle casual cathedral cattle cauliflower cause cave cedar ceiling celery cellar cement cemetery certain chair chakra chalk chandelier chapel charcoal charm chase cheat cheddar cheek cheetah chess chest chew chick chili chimpanzee chin chipmunk choir choke chop chord chorus chubby cigar cinnamon civil clam clash classic clay cleaver clerk cliff cling cloak cloth clothing clown clue clumsy coal coastal coaster coat cobra cocktail colander collar colony comb combat comet comfy comic common compete complex concentrate confess confident confuse consider contain copper copyright coral cork corkscrew corn cosmic costly costume cottage cotton cougar cough couple courage cousin cow cowboy coyote crab crane crate crawl crayon crazy creamy creek crew crib cricket crisp crocodile croissant crooked crow crowbar crowded crucial cruel crumb crunchy cry cub cubic cucumber cuff cufflink cupboard curb cure curious curl curse curtain curvy cushion custard custom dachshund dad dagger dam damage dance dare daughter deadly dear death debt decade decent decide deer defeat defiant delay delicious demand dense depend describe deserve designer devil diaper dice dime dinosaur dirty dish dishwasher ditch dive diver diving dizzy doll dolphin dome donkey doubt dozen dragon dragonfly drain drama dramatic dreamy dress dresser drift drip drown drum duck duckling dumpling dune dust dustpan dusty duty dwarf eager eagle earring easy educate eel eggplant elastic elder elderly electrician elegant elephant elf elk elm embrace employ encourage enemy engineer enjoy enormous envy epic escalator eternal evil exact excite exist exotic expect expert explain explode fact fade faint faith fake falafel falcon fame famous fang farmer farmhouse fatal father faucet fear fearless feast fence fencing fern ferret few fiddle fierce fig fight filthy firefighter fireworks flamingo flashlight flavor flea flee flesh flexible flint flock flood flute fog foggy folk fond fool footstool force forgive forklift formal fort fortress fossil fox fragile frank frequent fries frighten frog fry frying fur furnace fury fuzzy gang gap gardener garlic garment gather gaze gazelle gecko gentle gerbil ghost giant gifted ginger giraffe girl glossy glove glue goat goggles goose gorgeous gorilla gossip gown grace graceful grade grain granola grape grass grasshopper grate grateful grater grave gravel gravy grease greasy greedy greenhouse greet grim grind grinder groan groom gross ground growl guacamole guess guilt guilty guitar gulf gum gun gut guy gymnastics habit hairbrush hairdryer hairy halloween ham hammock hamster handy hanger happen harm harmonica harp harsh hasty haunt hawk hay hazelnut headband heap heaven hedge hedgehog heel hell helmet hen herd hijab hinge hip hippo hive hockey hog hollow holy honest hood hoodie hoof horse hug huge hum humble hummingbird hummus hut ideal identify idol igloo ignore iguana illegal immense impress incense inch inform injure innocent inspire intend intense introduce invent ironic itch itchy ivory ivy jacket jaguar jail jam janitor jaw jazz jeans jeep jelly jellyfish jeweler joint jolly jug juggle juicy jukebox jungle junior jury just kangaroo karate karma kayak keen ketchup kettle kickboxing kid kidney kimono kind kiss kite knee kneel knit knock knot koala labor lace lacrosse ladder ladle lady lake lame lantern lasso lava lawn lazy lead leash leather ledge leg lemon lemur leopard liar librarian lick lifeguard lighthouse likely lily limb lime limp linen lion lip lipstick lively liver lizard llama loaf lobster locket logic lonely lord lose lovely luck lucky lump lung lure macaron magnet magpie maid maintain major makeup male mammoth mango manor mansion mantra maple marble march mare married marry massive mast mat mature mayonnaise maze meadow mean meat meerkat melodic melon melt memorize mend mercy mess messy microwave mighty mile milk mine miner mint miss mist misty mitten moan moat mob modern modest moist mole mom monastery mongoose monk monkey moose mop moral mosque mosquito moss mother mound mourn mow mud muddy muffin mule mushroom musician must mustard mutter mutton mutual myth nacho namaste nanny nappy narwhal nasty naughty neat neck necklace nerve nervous noble nod noisy numb nutty oak oar oat obey obtain obvious occur octopus odd offend oily olive onion orangutan orchid organ original ostrich otter owe owl oyster pact paddle pail painful pajamas palace pale pancake panda panther pantry pants parade parsley pat patrol pea peach peacock peanut pear pearl peas pebble peck peel peep peg pelican pendant penguin pepper perch perfect perform petite pharmacist pheasant phrase physiotherapy piano pickle piglet pilates pilot pinch pink pipe pit pitchfork plank plate platypus playground plaza plea plead plier pliers plow plum plump plunger plush pocketknife poem poet poison polar policeman polite polo pond pony poodle pool popcorn porch porcupine pork possess possum postman potato pouch pour powder practice praise pram prawn pray preach prefer pregnancy prepare pretend pretzel prevent prick priest prime prison professor promise prop proper proud provide prune pudding puddle puffin puma pumpkin punch puncture punish pupil puppet pure purple quail quiche quilt raccoon radar radiant radish raft rag raisin rake ranch rapid rash rat rattle raven ravioli raw razor realize rear recliner reed reef referee reflect regret regular reign rein rejoice rely remain remind retire rhino rhyme rib rice rifle rigid rink rinse riot ripe river roar roast rob robe rock rod rooster rope rosary rot rotten rough rowing rude rug rugby ruin rule rum rural rust rusty sack sacred saddle saint salamander salami salt salty sandal sari satisfy sausage saw saxophone scar scare scarf scary scent scold scorch scorpion scrap scream sculptor seagull seahorse secretary senior sense serious settle sew shabby shadow shaft shallow shame shark shave sheep shepherd sheriff shin shirt shiver shoe shoulder shovel shrimp shrine shrub shy sigh silk silky silly similar sin sincere singer sip sir sister skate skating skiing skillet skinny skirt skull skunk slap sled sleepy sleeve slipper slope sloth slug smell smoke smooth snail snake snatch sneaker sneakers sneeze sniff snore snorkel soap sock socks softball soldier sole solve son soothe sore soul sour sow spade spaghetti spare spatula spear speedy spice spider spill spinach spirit spit splendid spoil spoon spray squad squeak squeal squeeze squid squirrel stain stair stairs stake stale stapler starfish steak steal steel steep steer stiff still sting stingray stir stitch stool stork stove strange strengthen stretching strict stroller stump stupid sturdy subtle suck sudden suffer suggest sunglasses superb supper suppose surf surfing surgeon suspect swallow swamp swan sway swear sweater sweep swell swift swimming swing sword synagogue syrup tablecloth taco tadpole tale tame tart taste tasty teapot tease teddy teen tempt tender tense term terrify thaw therapist thief thigh thimble thing thorn throat tickle tide tiger tight tin tiny tire tires tissue toad toaster toffee tofu tomb ton tone tortilla toucan tough tow toxic toys tragic trap tremble tribe trot trouble trousers trowel trumpet trunk truth tug tunnel turban turkey turnip tutor tuxedo twig typewriter typical tyre tyres ugly ultra uncle undress unfasten untidy upbeat urge usual vacuum vague valley vanish vase vast veil vein velvet vent verb verbal verse vest vibrant villa village vine violin vivid volcano vulture wagon wail waist waiter walnut walrus wander want war wardrobe warthog wasp wax weak wealthy weapon wear weasel weave weed weekly weep weird whale wheat wheelbarrow whip whirl whisk whisper whistle wicked wife wild will windmill wing wink wire wise witty wobble wolf wombat wonder wood wooden woodpecker wool woolen worm worried worry worthy wreck wrestle wrestling yak yang yard yarn yawn yeast yin yoga youth yoyo zebra zen zesty zoo zucchini zumba'

// field weights: name > alias > synonym > tag > category > description
const F_NAME = 0, F_ALIAS = 1, F_SYN = 2, F_TAG = 3, F_CAT = 4, F_DESC = 5
const FIELD_NAMES = ['name', 'alias', 'synonym', 'tag', 'category', 'description']
const FW = [100, 85, 66, 56, 40, 24]
// match quality: exact > prefix > stem > fuzzy
const Q_EXACT = 1, Q_STEM = 0.66, Q_STEM_KNOWN = 0.56, Q_CONCEPT = 0.5
const qPrefix = (q, t) => 0.62 + 0.23 * (q / t)
// kind ids: 0 exact, 1 prefix, 2 stem, 3 typo, 4 concept, 5 similar (n-gram), 6 phonetic
const KINDS = ['exact', 'prefix', 'stem', 'typo', 'concept', 'similar', 'phonetic']
// how much a kind corrects the query (the weakest token decides a result's match.kind)
const KIND_RANK = [0, 3, 2, 4, 1, 5, 6]
const CORRECTED = k => k === 3 || k === 5 || k === 6
// "x and y", "x or y", "x vs y": several things at once
const JOIN = new Set(['and', 'or', 'vs', 'versus'])
// "a picture of ...": medium words dropped before "of"
const META = new Set(['picture', 'image', 'icon', 'symbol', 'drawing', 'illustration', 'photo', 'sign', 'graphic', 'logo', 'emoji', 'pic'])
// typo quality from the keyboard-weighted distance: one adjacent-key slip 0.53, one plain edit 0.5, two edits 0.36
const qTypo = wd => (wd <= 1 ? 0.56 - 0.06 * wd : Math.max(0.28, 0.5 - 0.14 * (wd - 1)))
// similarity layer: always below any typo match of the same word
const Q_PHON = 0.33
const qSimilar = dice => 0.12 + 0.18 * dice

const IRREGULAR = { knives: 'knife', leaves: 'leaf', shelves: 'shelf', wolves: 'wolf', halves: 'half', loaves: 'loaf', thieves: 'thief',
  calves: 'calf', wives: 'wife', lives: 'life', children: 'child', people: 'person', men: 'man', women: 'woman', mice: 'mouse', feet: 'foot',
  teeth: 'tooth', geese: 'goose', oxen: 'ox', cacti: 'cactus', fungi: 'fungus', criteria: 'criterion', analyses: 'analysis' }
// British <-> American spellings of one word: the other spelling, when the vocabulary has it, is an exact match
const SPELL = { tyre: 'tire', tyres: 'tires', programme: 'program', aeroplane: 'airplane', mum: 'mom', jewellery: 'jewelry',
  pyjamas: 'pajamas', moustache: 'mustache', plough: 'plow', kerb: 'curb', storey: 'story', draught: 'draft', mould: 'mold', aluminium: 'aluminum',
  doughnut: 'donut', grey: 'gray', gray: 'grey', judgement: 'judgment', ageing: 'aging', cosy: 'cozy', sceptic: 'skeptic', practise: 'practice', licence: 'license', defence: 'defense', offence: 'offense' }
export function variants(w) {
  const out = []
  const add = v => { if (v !== w && !out.includes(v)) out.push(v) }
  if (SPELL[w]) add(SPELL[w])
  if (w.length < 5) return out
  if (/our/.test(w)) add(w.replace(/our/, 'or'))
  else if (/[^aeiou]or(s|ed|ing|ite|ites|able|ful)?$/.test(w)) add(w.replace(/or(s|ed|ing|ite|ites|able|ful)?$/, 'our$1'))
  if (/[^aeiou]tre(s)?$/.test(w)) add(w.replace(/tre(s)?$/, 'ter$1'))
  else if (/[^aeiou]ter(s)?$/.test(w) && w.length >= 6) add(w.replace(/ter(s)?$/, 'tre$1'))
  if (/is(e|es|ed|ing|ation|ations|er|ers)$/.test(w)) add(w.replace(/is(e|es|ed|ing|ation|ations|er|ers)$/, 'iz$1'))
  else if (/iz(e|es|ed|ing|ation|ations|er|ers)$/.test(w)) add(w.replace(/iz(e|es|ed|ing|ation|ations|er|ers)$/, 'is$1'))
  if (/yse(s|d)?$/.test(w)) add(w.replace(/yse(s|d)?$/, 'yze$1'))
  if (/[aeiou]ll(ing|ed|er|ers)$/.test(w)) add(w.replace(/ll(ing|ed|er|ers)$/, 'l$1'))
  else if (/[aeiou]l(ing|ed|er|ers)$/.test(w)) add(w.replace(/l(ing|ed|er|ers)$/, 'll$1'))
  if (/ogue(s)?$/.test(w)) add(w.replace(/ogue(s)?$/, 'og$1'))
  if (/ence$/.test(w)) add(w.replace(/ence$/, 'ense'))
  return out
}

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
  const modUse = new Map(), headUse = new Map()
  const addEntry = (i, field, text, ws) => {
    if (field === F_DESC) ws = ws.filter(w => !STOP.has(w))
    const n = ws.length
    if (!n) return
    const e = eIcon.length
    eIcon.push(i); eField.push(field); eText.push(text); eLen.push(n)
    for (let p = 0; p < n; p++) { const w = ws[p]; if (ws.indexOf(w) === p) postings[intern(w)].push(e, p) }
    // how often a word leads a phrase ("fast food", "live chat") vs ends it ("food delivery"): modifiers vs head nouns
    if (n > 1 && field >= F_ALIAS && field <= F_TAG) for (let p = 0; p < n; p++) { const m = p < n - 1 ? modUse : headUse; m.set(ws[p], (m.get(ws[p]) || 0) + 1) }
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
  // the word names something in the library (name/alias/synonym/tag), so it is content, not just a style word
  const namesThing = w => { const id = vocab.get(w); return id !== undefined && fields()[id] < 9 }
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
    // a real word is not two words run together ("fireworks" is not fire + works, "guitar" is not gui + tar)
    if (w.length < 6 || vocab.has(w) || stems.has(stem(w)) || /[0-9]/.test(w) || isCommon(w)) return null
    let best = null, bs = 0
    for (let k = 3; k <= w.length - 3; k++) {
      const a = vocab.get(w.slice(0, k)), b = vocab.get(w.slice(k))
      if (a === undefined || b === undefined || fields()[a] === 9 || fields()[b] === 9) continue
      const s = Math.min(k, w.length - k)
      if (s > bs) { bs = s; best = [w.slice(0, k), w.slice(k)] }
    }
    // a near-miss of one real word beats two short ones ("shoppng" is shopping, not shop + png)
    // ("microfone" is microphone, not micro + fone: with a short half, a two-edit near-miss still wins)
    const near = best && Math.min(best[0].length, best[1].length) <= 4 ? 2 : 1
    if (best) for (const m of matchToken(w, false)) if (m.kind === 3 && m.d <= near && useful(m.id)) return null
    return best
  }
  // a category name, or its singular ("arrow" -> arrows, "chart" -> charts)
  const catSet = new Set(data.categories)
  const catOf = w => (catSet.has(w) ? w : catSet.has(w + 's') ? w + 's' : null)
  // a style name or style word this index has ("kawaii", "blueprint", "vintage") -> the style, else null
  const styleOf = w => (styleIdx.has(w) ? w : STYLE_WORDS[w] && styleIdx.has(STYLE_WORDS[w]) ? STYLE_WORDS[w] : null)
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

  // "beans" is the plural of "bean"
  const plural = (w, t) => t === w + 's' || t === w + 'es' || (w.endsWith('y') && t === w.slice(0, -1) + 'ies')
  // common English words (lazy): the dictionary plus every concept-map word
  let common = null
  const isCommon = w => {
    if (!common) common = new Set(COMMON_WORDS.split(' '))
    if (common.has(w) || concept.has(w)) return true
    if (w.length < 4 || !w.endsWith('s')) return false
    const b = w.endsWith('ies') ? w.slice(0, -3) + 'y' : w.endsWith('es') && common.has(w.slice(0, -2)) ? w.slice(0, -2) : w.slice(0, -1)
    return common.has(b)
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
    // the word as typed is known: its other inflections are a weaker, maybe different sense ("tracking" vs a music "track")
    // a common English word the vocabulary lacks keeps only its plural ("bean" -> beans): its other stem-mates are
    // different words ("mat" is not "matter", "bear" is not "bearing")
    const dict = exact === undefined && isCommon(w)
    for (const id of stems.get(s) || []) {
      if (dict && !plural(w, tokens[id])) continue
      put(id, exact !== undefined && fields()[exact] < 9 && !knownFix(w) ? Q_STEM_KNOWN : Q_STEM, 2)
    }
    // British / American spellings are the same word, not a typo ("colour" -> color, "centre" -> center)
    if (exact === undefined) for (const v of variants(w)) { const id = vocab.get(v); if (id !== undefined) put(id, 0.97, 0) }
    // irregular plurals the stemmer cannot see ("knives" -> knife, "mice" -> mouse)
    if (exact === undefined && IRREGULAR[w]) { const id = vocab.get(IRREGULAR[w]); if (id !== undefined) put(id, 0.95, 2) }
    // a complete English word the vocabulary lacks ("mat", "bear"): it is not the start of a longer word
    // a word typed in full that names something ("book", "fast"): longer words that start with it are related,
    // not what it names ("bookmark", "fastfood")
    const whole = exact !== undefined && w.length >= 3 && fields()[exact] < 9 && !knownFix(w)
    if (allowPrefix && w.length >= 1) {
      let lo = 0, hi = T
      while (lo < hi) { const m = (lo + hi) >> 1; if (tokens[sorted[m]] < w) lo = m + 1; else hi = m }
      for (let k = lo, n = 0; k < T && n < 80; k++) {
        const t = tokens[sorted[k]]
        if (!t.startsWith(w)) break
        // a whole word does not complete into a misspelling the data carries ("temple" is not "templete")
        if (t.length > w.length && !(whole && knownFix(t))) {
          // an inflection of the word ("bean" -> beans) is the word itself, not an unfinished one
          const infl = w.length >= 3 && stem(t) === s && (dict ? plural(w, t) : /^(s|es|d|ed|ing|[b-df-hj-np-tv-z](ed|ing))$/.test(t.slice(w.length)))
          put(sorted[k], qPrefix(w.length, t.length) * (dict && !infl ? 0.6 : whole && !infl ? 0.72 : 1), infl ? 2 : 1); n++
          const o = out.get(sorted[k])
          if (o.kind === 1 && !infl) { if (dict) o.dp = true; else if (whole) o.pk = true }
        }
      }
    }
    const max = maxTypos(w.length)
    // a real word the engine knows without the vocabulary (a concept-map word or a style word: "dinner", "kawaii")
    // is not a misspelling of a nearby one (diner, hawaii); a common English word only when nothing else explains it
    const real = exact === undefined && (concept.has(w) || !!styleOf(w) || (dict && out.size > 0))
    // a word that exists verbatim in the vocabulary is not a misspelling ("wallet" must not pull in mallet/pallet),
    // unless the data itself marks it as a known misspelling ("calender")
    if (w.length >= 3 && !real && (exact === undefined || knownFix(w)) && (max > 0 || out.size === 0)) {
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
        if ((d <= max || wd <= wmax) && !dict) put(id, qTypo(d > max ? Math.max(wd, 0.75 * d) : wd), 3, wd)
      }
      // fuzzy prefix for as-you-type with a typo ("calnd" -> calendar)
      if (allowPrefix && !dict && w.length >= 6) {
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
    if (!known && !real && !dict && w.length >= 3 && !/[0-9]/.test(w)) {
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
    if (all.some(w => w.length >= 6)) all = all.flatMap(w => { const sp = styleOf(w) ? null : splitWord(w); if (sp) split = true; return sp || [w] })
    // "a picture of a house", "icon of a cat": the meta word names the medium, not the subject
    all = all.filter((w, k) => !(META.has(w) && all[k + 1] === 'of' && k + 2 < all.length))
    // "8 bit heart" -> "8bit heart": only phrases whose joined form maps to a style this index has
    for (let k = 0; k + 1 < all.length; k++) {
      const j = STYLE_PHRASES[all[k] + ' ' + all[k + 1]]
      if (j && styleIdx.has(STYLE_WORDS[j] || j)) { all = all.slice(0, k).concat([j], all.slice(k + 2)); k-- }
    }
    let style = null
    const content = all.map((w, pos) => ({ w, pos })).filter(t => !STOP.has(t.w))
    const ws = content.length ? content : all.map((w, pos) => ({ w, pos }))
    const required = [], soft = []
    let prevStyle = false
    ws.forEach((t, k) => {
      const w = t.w
      const wasStyle = prevStyle
      prevStyle = false
      if (LEGACY_STYLE_WORDS.has(w)) { // the original seven styles' words: unchanged behaviour
        if (STYLE_WORDS[w] && styleIdx.has(STYLE_WORDS[w])) style = STYLE_WORDS[w]
        if (styleIdx.has(w) && ws.length > 1) { style = style || w; soft.push(t) }
        else if (STYLE_WORDS[w] && styleIdx.has(STYLE_WORDS[w]) && ws.length > 1) soft.push(t) // "glossy button"
        else if (SOFT.has(w) && ws.length > 1) soft.push(t)
        else required.push(t)
        return
      }
      const target = styleOf(w)
      // a style word that also names a thing ("wine glass", "pixel ruler") is only a style when it leads the
      // query or is followed by "style"/"look" -- and never as "glass of water"
      if (target && !(all[t.pos + 1] === 'of' && namesThing(w)) && (k === 0 || !namesThing(w) || (ws[k + 1] && STYLE_MARK.has(ws[k + 1].w)))) {
        style = style || target
        prevStyle = true
        if (ws.length > 1) soft.push(t)
        else required.push(t)
        return
      }
      // a lone letter beside real words ("t-shirt", "x circle") only adds evidence
      if ((SOFT.has(w) || (wasStyle && STYLE_MARK.has(w)) || (w.length === 1 && /[a-z]/.test(w))) && ws.length > 1) soft.push(t)
      else required.push(t)
    })
    // only soft words: the content one is required ("glossy button" -> button), else the first
    if (!required.length && soft.length) { const c = soft.findIndex(t => !styleOf(t.w)); required.push(soft.splice(c < 0 ? 0 : c, 1)[0]) }
    // a category named in the query ("weather icons", "arrow") is a browse hint
    let category = null
    for (const t of ws) { const c = iconIdx.has(t.w) ? null : catOf(t.w); if (c) { category = c; break } }
    // "cats and dogs", "sun or moon", "chat vs mail": two things at once (each side is searched on its own too)
    let segments = null
    if (all.length >= 3 && all.some(w => JOIN.has(w))) {
      const segs = [[]]
      for (const w of all) { if (JOIN.has(w)) { if (segs[segs.length - 1].length) segs.push([]) } else segs[segs.length - 1].push(w) }
      const real = segs.filter(sg => sg.some(w => !STOP.has(w) && !styleOf(w) && !SOFT.has(w)))
      if (real.length >= 2) segments = real.map(sg => sg.join(' '))
    }
    return { all, required, soft, style, split, words: ws.map(t => t.w), category, segments }
  }

  // -------------------------------------------------------------- term importance
  // a generic modifier ("fast", "live", "secure", "my") weighs less than the head noun of a query; so does a word
  // the data mostly uses to lead a phrase (modifier) rather than end it (head noun)
  const termWeight = w => {
    if (MODIFIERS.has(w)) return 0.5
    const m = modUse.get(w) || 0, h = headUse.get(w) || 0
    return m >= 6 && m >= 4 * h ? 0.7 : 1
  }

  // -------------------------------------------------------------- search
  // core ranking: every icon that matches, sorted, with internal evidence (_cov, _kind, _field, _whole, _dp) for
  // the confidence model; icons outside the filters are scored too (they calibrate confidence and feed `outside`)
  function core(query, opts) {
    opts = opts || {}
    const cat = opts.category && opts.category !== 'all' ? String(opts.category) : null
    const st = opts.style && opts.style !== 'all' ? String(opts.style) : null
    const sBit = st ? styleIdx.get(st) : undefined
    const tagSet = opts.tags ? new Set([].concat(opts.tags).map(t => words(t).join(' ')).filter(Boolean)) : null
    const hasTags = i => { for (const t of icons[i].tags) if (tagSet.has(words(t).join(' '))) return true; return false }
    const allowed = i => (!cat || icons[i].category === cat) && (!st || (sBit !== undefined && !(icons[i].missing & (1 << sBit)))) && (!tagSet || !tagSet.size || hasTags(i))
    const filtered = !!(cat || st || (tagSet && tagSet.size))
    const p = opts.parsed || parse(query)
    if (!p.required.length) {
      const res = []
      if (filtered) for (let i = 0; i < N; i++) if (allowed(i)) { const r = result(i, 0, { field: 'category', term: cat || st || '', typo: false, kind: 'exact' }); r._cov = 1; r._kind = 0; r._field = F_CAT; r._whole = true; res.push(r) }
      return { res, out: [], top: 0, p, filtered, browse: true }
    }
    const qt = p.required.concat(p.soft)
    const nq = qt.length, nreq = p.required.length
    const wk = qt.map((t, k) => (k < nreq ? termWeight(t.w) : 0))
    let wsum = 0
    for (let k = 0; k < nreq; k++) wsum += wk[k]
    // one generic word on its own ("fast") is the query's head: it weighs in full
    if (nreq === 1) { wk[0] = 1; wsum = 1 }
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
          const e = post[x], f = eField[e], i = eIcon[e], ps = post[x + 1]
          if (f === F_DESC && m.kind !== 0 && m.kind !== 2) continue
          if (f === F_CAT && CORRECTED(m.kind)) continue
          const cov = ps < 0 ? (m.kind === 1 ? 0.8 : 1) : (nq === 1 ? 0.55 + 0.45 / eLen[e] : 0.75 + 0.25 / eLen[e])
          // a one-word query that only leads a natural phrase ("tracking" in "tracking cookie", "live" in
          // "live support") names the modifier, not the thing: the phrase's head noun is what the icon shows
          // (only the best match is discounted; every entry still counts as extra evidence)
          const lead = nq === 1 && f >= F_ALIAS && f <= F_TAG && (ps >= 0 ? ps < eLen[e] - 1 : m.kind === 1 && (phraseOf.get(tokens[m.id]) || '').startsWith(w + ' '))
          const raw = FW[f] * m.q * cov, sc = lead ? raw * 0.82 : raw
          if (sc > best[k][i]) {
            if (best[k][i] > 0) extra[i] += best[k][i] * 0.03
            best[k][i] = sc; bestInfo[k][i] = { e, kind: m.kind, w: m.src || tokens[m.id], d: m.d, df: CORRECTED(m.kind) && !m.d && !m.src, dp: !!m.dp, pk: !!m.pk, ps, lead }
          } else extra[i] += raw * 0.03
          if (nq > 1 && ps >= 0) hit(e, k, m.q, ps)
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
            if (sc > best[k][i]) { best[k][i] = sc; bestInfo[k][i] = { e, kind: jk, w: jk ? all[qt[k].pos] : tokens[id], d: 0, df: !!jk, ps: whole ? -1 : post[x + 1] } }
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
      if (b > phrase[i]) { phrase[i] = b; phraseEntry[i] = { e, full: h.n === nq, whole: h.joined || (h.n === nq && h.n >= eLen[e]) } }
    }
    // per query word: does anything other than a correction (typo / similar / phonetic) explain it?
    // A word with a real match anywhere is a real word, so its corrections elsewhere are noise.
    // (a misspelling the data itself carries, "setings", is data, not a guess; a prefix of the word being typed
    // does not make it a real word)
    const guess = b => CORRECTED(b.kind) && !b.df
    const solid = new Uint8Array(nq)
    for (let k = 0; k < nq; k++) for (let i = 0; i < N; i++) { const b = bestInfo[k][i]; if (b && b.kind !== 1 && !CORRECTED(b.kind)) { solid[k] = 1; break } }
    // a word nothing carries ("yoga") is answered by its concept only: honest, but a related answer at best
    const direct = new Uint8Array(nq)
    for (let k = 0; k < nq; k++) for (let i = 0; i < N; i++) { const b = bestInfo[k][i]; if (b && b.kind !== 4) { direct[k] = 1; break } }
    // a word that only ever leads phrases ("baby" in "baby shower", "church" in "church bell") names nothing here
    let named = false
    if (nq === 1) for (let i = 0; i < N; i++) { const b = bestInfo[0][i]; if (b && !b.lead && b.kind !== 4 && !CORRECTED(b.kind)) { named = true; break } }
    const res = [], out = []
    let top = 0
    for (let i = 0; i < N; i++) {
      let s = 0, soft = 0, miss = 0, missW = 0, hits = 0, real = 0
      for (let k = 0; k < nq; k++) {
        let b = best[k][i]
        // a correction of a word that matches other icons as typed is noise ("towel" is not "tower" once
        // something carries "towel"); the icon keeps only its real matches
        if (b > 0 && solid[k] && guess(bestInfo[k][i])) { b = 0; best[k][i] = 0; bestInfo[k][i] = undefined }
        if (b > 0) { if (k < nreq) { s += b * wk[k]; if (!guess(bestInfo[k][i]) && bestInfo[k][i].kind !== 1) real++ } else soft += b; hits++ } else if (k < nreq) { miss++; missW += wk[k] }
      }
      if (!hits || (miss === nreq && nreq > 0)) continue
      s = s / wsum + soft * 0.15 + phrase[i] + Math.min(extra[i], 6) + prior[i]
      // partial matches compete with full ones: an icon that strongly matches one word of "fast delivery" (truck)
      // can beat a weak full match, but a full match of the same strength always wins. A partial match made only
      // of corrected or unfinished words ("mat" -> math / match in "yoga mat") is a guess and ranks well below.
      // Missing a generic modifier costs less than missing the head noun (the weights above already say so).
      if (miss) s *= (real ? 0.9 : 0.45) * (1 - 0.25 * (miss - 1) / nreq)
      if (s <= 0) continue
      const r = result(i, s, explain(i, nq, best, bestInfo, phraseEntry[i]))
      // evidence for the confidence model: the weakest way a word matched (a fix the data carries counts as exact)
      let kind = -1, bk = -1, dp = false, pk = false, orphan = false, firm = 0
      for (let k = 0; k < nq; k++) {
        const b = bestInfo[k][i]
        if (!b) continue
        if (b.dp) dp = true; else if (k < nreq) firm++
        if (b.pk) pk = true
        if (b.kind === 4 && !direct[k] && k < nreq) orphan = true
        const bkind = b.kind === 3 && !guess(b) ? 0 : b.kind
        if (kind < 0 || KIND_RANK[bkind] > KIND_RANK[kind]) kind = bkind
        if (bk < 0 || best[k][i] > best[bk][i]) bk = k
      }
      // a complete common word that only starts other words ("mat" -> math, match) is no evidence at all
      if (!firm) continue
      const bi = bestInfo[bk][i], pe = phraseEntry[i]
      r._cov = 1 - missW / wsum; r._kind = kind; r._dp = dp || orphan || (nq === 1 && bi.lead && !named); r._pk = pk || (nq === 1 && bi.lead)
      r._field = pe && pe.full ? eField[pe.e] : eField[bi.e]
      r._whole = nreq === 1 ? (bi.ps < 0 || eLen[bi.e] === 1 || (eLen[bi.e] === 2 && eField[bi.e] === F_NAME)) : !!(pe && pe.full && pe.whole)
      if (opts.trace) r.trace = { all: p.all, split: p.split, tokens: qt.map((t, k) => ({ pos: t.pos, b: bestInfo[k][i] })) }
      if (opts.debug) {
        r.debug = {
          tokens: qt.map((t, k) => { const b = bestInfo[k][i]; return b ? { q: t.w, matched: b.w, kind: KINDS[b.kind], field: FIELD_NAMES[eField[b.e]], term: eText[b.e], score: +best[k][i].toFixed(2), weight: wk[k] } : { q: t.w, missing: true } }),
          phrase: phraseEntry[i] ? { term: eText[phraseEntry[i].e], bonus: +phrase[i].toFixed(2) } : null,
          extra: +Math.min(extra[i], 6).toFixed(2), prior: +prior[i].toFixed(2),
        }
      }
      if (s > top) top = s
      if (allowed(i)) res.push(r); else out.push(r)
    }
    res.sort(byScore); out.sort(byScore)
    return { res, out, top, p, filtered }
  }
  const byScore = (a, b) => b.score - a.score || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)

  // calibrated confidence: high = what the query names; medium = a sound but looser match (a spelling fix, a
  // related concept, a partial match that misses only a modifier); low = a guess, shown as "related" at most
  function confidenceOf(r, top) {
    const rel = top > 0 ? r.score / top : 0
    if (r._kind === 5 || r._kind === 6 || r._dp || r._cov <= 0.5 || rel < 0.35 || r.score < 18) return 'low'
    if (r._field >= F_CAT) return r._cov === 1 && rel >= 0.6 ? 'medium' : 'low'
    if (r._kind === 3) return rel >= 0.6 ? 'medium' : 'low'
    if (r._kind === 4) return rel >= 0.55 ? 'medium' : 'low'
    if (r._cov < 1) return rel >= 0.5 ? 'medium' : 'low'
    if (r._pk) return 'medium'
    if (r._whole && rel >= 0.5) return 'high'
    return rel >= 0.85 ? 'high' : 'medium'
  }
  const clean = r => { delete r._cov; delete r._kind; delete r._dp; delete r._field; delete r._whole; delete r._pk; return r }
  // below this nothing is evidence, only noise ("yin yang" -> young plant)
  const FLOOR = 10

  // full ranking: the core plus "x and y" / "x or y" (each side is a search of its own), confidence, floor
  function rank(query, opts) {
    opts = opts || {}
    const p = parse(query)
    const r0 = core(query, { ...opts, parsed: p })
    if (r0.browse) return r0
    let { res, out, top } = r0
    // "cats and dogs", "sun or moon": two things at once -> the union of each side's results; an icon that
    // matches the whole query (sun-moon) keeps its full score and leads
    if (p.segments) {
      const merged = new Map(), mergedOut = new Map()
      const keep = (m, r, s) => { const o = m.get(r.name); if (!o || s > o.score) m.set(r.name, Object.assign(r, { score: Math.round(s * 100) / 100 })) }
      for (const r of res) keep(merged, r, r.score)
      for (const r of out) keep(mergedOut, r, r.score)
      for (const seg of p.segments) {
        const sr = core(seg, opts)
        for (const r of sr.res) keep(merged, r, r.score * 0.92)
        for (const r of sr.out) keep(mergedOut, r, r.score * 0.92)
        top = Math.max(top, sr.top * 0.92)
      }
      res = [...merged.values()].sort(byScore); out = [...mergedOut.values()].sort(byScore)
    }
    // low confidence is also a plain flag: a UI shows these as "related", an agent should not pick them blindly
    for (const r of res) { r.confidence = confidenceOf(r, top); if (r.confidence === 'low') r.weak = true }
    for (const r of out) { r.confidence = confidenceOf(r, top); if (r.confidence === 'low') r.weak = true }
    res = res.filter(r => r.score >= FLOOR); out = out.filter(r => r.score >= FLOOR)
    return { res, out, top, p, filtered: r0.filtered }
  }

  function search(query, opts) {
    opts = opts || {}
    const limit = opts.limit == null ? 24 : Math.max(0, opts.limit | 0)
    if (opts.trace) return core(query, opts).res.slice(0, limit).map(clean)
    return rank(query, opts).res.slice(0, limit).map(clean)
  }

  // the rich form for UIs and agents: best matches and related ones, the top matches the filters hid, a spelling
  // correction, and a browse hint when nothing matches
  function query(q, opts) {
    opts = opts || {}
    const limit = opts.limit == null ? 24 : Math.max(0, opts.limit | 0)
    const { res, out, p, filtered, browse } = rank(q, opts)
    const firstConf = res.length ? res[0].confidence : null
    const o = {
      query: String(q == null ? '' : q),
      results: res.slice(0, limit).map(clean),
      total: res.length,
      best: res.filter(r => r.confidence === 'high').length,
      confidence: firstConf,
      parsed: { words: p.words, style: p.style, category: p.category, any: p.segments || null },
    }
    // the filters hid stronger matches: offer the best of them
    if (filtered && !browse && opts.outside !== false && (!res.length || firstConf !== 'high' || res.length < 3)) {
      const strong = out.filter(r => r.confidence !== 'low' && (!res.length || r.score > res[0].score * 0.8))
      if (strong.length) o.outside = strong.slice(0, opts.outsideLimit || 6).map(clean)
    }
    if (!browse) {
      const d = didYouMean(q)
      if (d) o.didYouMean = d
      if (!res.length) o.browse = { categories: data.categories.slice(), category: p.category || null }
    }
    return o
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
    // a concept-map word is a real word, never a misspelling ("dinner" is not "diner")
    if (id !== undefined && w.length >= 3 && fields()[id] !== F_NAME && !/[0-9]/.test(w) && !concept.has(w) && !styleOf(w)) {
      const kw = phonetic(w), post = postings[id], names = new Set()
      // a word used in a description is a real word ("metal" is not "medal")
      let real = false
      for (let x = 0; x < post.length; x += 2) {
        if (post[x + 1] < 0) continue
        if (eField[post[x]] >= F_CAT) { real = true; break }
        names.add(eIcon[post[x]])
      }
      // a real misspelling sits next to the word it misspells on EVERY icon that carries it ("setings" on settings
      // and user-cog); "hurt" (bandage, heart-crack) or "track" (music, truck, ...) are words in their own right
      let bd = 9
      for (const i of real ? [] : names) {
        let ib = 9, iw = null
        const own = icons[i].name.split('-')
        for (const nw of own.concat(...icons[i].aliases.map(words))) {
          // a form of the icon's own word is not a misspelling: "beers" is beer (not cheers), "gamer" is game,
          // "externally" is external, "gmail" / "ebike" are mail / bike
          if ((own.includes(nw) && (inflection(w, nw) || variant(w, nw))) || (nw.length >= 3 && w.startsWith(nw) && /^(r|er|s|es|y|d|ed|ly)$/.test(w.slice(nw.length))) ||
            (nw.length >= 4 && w.length === nw.length + 1 && w.endsWith(nw))) { ib = 9; iw = null; break }
          if (nw === w || nw.length < 3 || variant(w, nw) || inflection(w, nw) || fields()[vocab.get(nw)] > F_ALIAS) continue
          const d = weightedDistance(w, nw, 1.5)
          const sound = phonetic(nw) === kw && distance(w, nw, 2) <= 2
          // short words must also sound alike ("gpu" is not "cpu", "joke" is not "joy"; "fone" is "phone")
          if ((w.length <= 4 ? sound : d <= 1.5 || sound) && d < ib) { ib = d; iw = nw }
        }
        if (!iw) { best = null; break }
        if (ib < bd) { bd = ib; best = iw }
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
      let t = all[pos], fix = null
      if (CORRECTED(b.kind)) fix = b.w
      // "bagg", "calendarr": a stem match on a non-word that is no real inflection is a slip too
      else if (b.kind === 2 && !vocab.has(t) && !/(s|ed|ing|er)$/.test(t) && b.w.length < t.length) fix = b.w
      else if (b.kind !== 0) continue
      fix = knownFix(fix || t) || fix
      // only a corrected word is re-spelled: a word typed as is stays ("login" is not "log in")
      if (!fix) continue
      t = shown(fix)
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
    search, query, suggest, resolve, parse, didYouMean,
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
