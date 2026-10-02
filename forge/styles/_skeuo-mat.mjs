// SKEUO materials — what every piece is made of, and how that material takes light.
//
// A material is a base colour plus a FINISH. The finish decides the lighting
// recipe (how deep the shading rolls, how hard the specular, and any surface
// detail: brushed bands, wood grain, leather stitching). Colours are only the
// literal fallbacks of role variables (--with-skeuo-c1 ... ), so per-icon
// palettes and the editor recolour every material, and the shading (shadow /
// shine overlays) follows whatever colour is chosen.

// finishes: shade = [[k, opacity]...] rolls toward the far (bottom-right) edge,
// hi = [k, opacity] rim light on the near (top-left) edge,
// spec = {inset, top, op}: an inset highlight across the upper part (gloss),
// bands = metal reflections [[from, to, 'shine'|'shadow', opacity]] as fractions of the height
export const FINISH = {
  gloss:   { shade: [[0.55, 0.16], [1.5, 0.11], [2.8, 0.07]], hi: [0.42, 0.7], spec: { inset: 0.75, top: 0.5, op: 0.3 }, hot: 0.85 },
  satin:   { shade: [[0.5, 0.14], [1.4, 0.09], [2.8, 0.06]], hi: [0.4, 0.5], spec: { inset: 0.9, top: 0.42, op: 0.14 } },
  metal:   { shade: [[0.45, 0.2], [1.3, 0.1]], hi: [0.45, 0.85], bands: [[0.08, 0.36, 'shine', 0.42], [0.56, 0.74, 'shadow', 0.12]], brushed: true },
  gold:    { shade: [[0.5, 0.18], [1.4, 0.12]], hi: [0.45, 0.8], bands: [[0.06, 0.34, 'shine', 0.38], [0.6, 0.78, 'shadow', 0.12]], hot: 0.9 },
  paper:   { shade: [[0.4, 0.1], [1.6, 0.05]], hi: [0.32, 0.85], curl: true },
  card:    { shade: [[0.45, 0.13], [1.4, 0.07]], hi: [0.35, 0.6] },
  leather: { shade: [[0.5, 0.18], [1.5, 0.1], [3, 0.06]], hi: [0.36, 0.3], stitch: true },
  wood:    { shade: [[0.5, 0.17], [1.5, 0.08]], hi: [0.38, 0.4], grain: true },
  ceramic: { shade: [[0.5, 0.1], [1.5, 0.07], [3, 0.05]], hi: [0.4, 0.9], spec: { inset: 0.8, top: 0.45, op: 0.5 }, hot: 0.9 },
  rubber:  { shade: [[0.5, 0.2], [1.5, 0.1]], hi: [0.4, 0.22], spec: { inset: 1.0, top: 0.35, op: 0.07 } },
  glass:   { shade: [[0.5, 0.16], [1.5, 0.1]], hi: [0.4, 0.8], spec: { inset: 0.6, top: 0.5, op: 0.36 }, hot: 0.95, sheer: true },
  cloud:   { shade: [[0.6, 0.1], [1.8, 0.07], [3.2, 0.05]], hi: [0.45, 0.9], spec: { inset: 0.8, top: 0.4, op: 0.5 } },
  enamel:  { shade: [[0.5, 0.18], [1.3, 0.1]], hi: [0.4, 0.6], spec: { inset: 0.65, top: 0.5, op: 0.32 }, hot: 0.9 },
}

// materials: colour (c), groove/print ink (ink), stitch/detail accent (acc), finish (f)
export const MAT = {
  paper:     { c: '#F3EEE1', ink: '#4F4638', f: 'paper' },
  note:      { c: '#FCE28A', ink: '#6E5A12', f: 'paper' },
  kraft:     { c: '#E2B865', ink: '#8A6224', f: 'card' },
  leather:   { c: '#94512E', ink: '#4A2210', acc: '#F1CF98', f: 'leather' },
  'leather-dark': { c: '#4B3328', ink: '#1E120C', acc: '#D9B27A', f: 'leather' },
  steel:     { c: '#BFC7D0', ink: '#4E5864', f: 'metal' },
  graphite:  { c: '#5B626D', ink: '#1A1D22', f: 'metal', band: 0.5 },
  alu:       { c: '#D6DBE1', ink: '#3A424D', f: 'metal', band: 0.8 },
  gold:      { c: '#E7B33F', ink: '#7C5610', f: 'gold' },
  copper:    { c: '#D07A43', ink: '#6E3412', f: 'gold' },
  wood:      { c: '#C68A52', ink: '#6E3F18', f: 'wood' },
  ceramic:   { c: '#F6F4EF', ink: '#3F3B34', f: 'ceramic' },
  rubber:    { c: '#474C55', ink: '#15171A', f: 'rubber' },
  screen:    { c: '#1E2B3B', ink: '#0B1118', f: 'glass' },
  sky:       { c: '#9BD3F5', ink: '#2A6E9C', f: 'satin' },
  water:     { c: '#45A8E6', ink: '#13537E', f: 'glass' },
  cloud:     { c: '#E7EEF7', ink: '#4A5666', f: 'cloud' },
  // lacquered plastics / enamels
  blue:      { c: '#2F72E4', ink: '#0F2F6E', f: 'gloss' },
  navy:      { c: '#3A5DA8', ink: '#0E1C3A', f: 'gloss' },
  indigo:    { c: '#5560E0', ink: '#1E2270', f: 'gloss' },
  violet:    { c: '#8457E6', ink: '#331A73', f: 'gloss' },
  red:       { c: '#E0483A', ink: '#6E140C', f: 'gloss' },
  coral:     { c: '#EE6A4D', ink: '#7A2412', f: 'gloss' },
  orange:    { c: '#F28A2E', ink: '#7A3A06', f: 'gloss' },
  yellow:    { c: '#F7C531', ink: '#7A5A06', f: 'gloss' },
  green:     { c: '#34A853', ink: '#0E4A20', f: 'gloss' },
  leaf:      { c: '#5DAE3E', ink: '#1F4A10', f: 'satin' },
  teal:      { c: '#1EA39C', ink: '#08463F', f: 'gloss' },
  pink:      { c: '#EE5F91', ink: '#6E1438', f: 'gloss' },
  charcoal:  { c: '#4C535E', ink: '#121418', f: 'gloss' },
  white:     { c: '#F4F5F7', ink: '#46505C', f: 'ceramic' },
  stone:     { c: '#E4DCCD', ink: '#5A4E3C', f: 'card' },
  brick:     { c: '#C8623F', ink: '#5E2412', f: 'card' },
  wine:      { c: '#9E1F3A', ink: '#4A0716', f: 'glass' },
  slate:     { c: '#5E6B7D', ink: '#1E252E', f: 'satin' },
  fabric:    { c: '#3E4D70', ink: '#111827', f: 'rubber' },
}

// badge enamels by meaning
const SIGNAL = [
  [/(^|-)(x|close|ban|off|minus|missed|crack|error|remove|lock|alert-circle)(-|$)|shield-alert|file-x|square-x|user-x/, 'red'],
  [/check|plus|success|incoming|add/, 'green'],
  [/alert|warn/, 'yellow'],
  [/search|zoom|cog|settings/, 'steel'],
  [/pen|edit/, 'orange'],
]

// category defaults: [body, part]
const CAT = {
  navigation: ['blue', 'steel'], arrows: ['blue', 'steel'], actions: ['blue', 'steel'], status: ['blue', 'steel'],
  media: ['coral', 'steel'], files: ['paper', 'kraft'], communication: ['green', 'steel'], users: ['teal', 'teal'],
  commerce: ['green', 'gold'], time: ['ceramic', 'gold'], devices: ['graphite', 'steel'], layout: ['alu', 'blue'],
  text: ['navy', 'steel'], maps: ['paper', 'red'], development: ['violet', 'steel'], security: ['steel', 'gold'],
  charts: ['blue', 'orange'], weather: ['cloud', 'yellow'], objects: ['indigo', 'gold'], food: ['orange', 'leaf'],
  health: ['red', 'white'], education: ['navy', 'gold'], nature: ['leaf', 'wood'], home: ['wood', 'steel'],
  travel: ['alu', 'red'], sports: ['orange', 'steel'],
}

// name rules: [regex, body, part?] — first match wins
const NAME = [
  [/^alert-triangle$|^shield-alert$/, 'yellow', 'yellow'],
  [/^(alert-circle|x-circle|ban|square-x|heart-crack|thumbs-down|minus-circle|siren)$/, 'red', 'steel'],
  [/^(check-circle|check-square|check-check|check|badge-check|plus-circle|square-plus|thumbs-up)$/, 'green', 'steel'],
  [/^(help-circle|info-circle)$/, 'blue', 'steel'],
  [/^(file|files)(-|$)|sticky-note|notepad|newspaper|scroll-text|receipt|clipboard|paste|copy$/, 'paper', 'steel'],
  [/^folder|^archive$|^package|^gift$|ticket|^tag$|badge-percent|^library$/, 'kraft', 'red'],
  [/^book$|^book-open|^notebook|wallet|briefcase|luggage|passport|address-book|^bookmark|backpack|^id-card/, 'leather', 'gold'],
  [/^(mail|inbox)/, 'paper', 'red'],
  [/^(lock|unlock|key)$|^shield|^anchor$|^scale$|^bell|^trophy|^award|^medal|^crown|^landmark$|^compass$/, 'gold', 'steel'],
  [/^(calendar)/, 'paper', 'steel'],
  [/^(coins|hand-coins)$/, 'gold', 'gold'],
  [/^(globe)$/, 'water', 'leaf'],
  [/^(map-pin|navigation)$/, 'red', 'white'],
  [/^(building|hotel|school|landmark)$/, 'stone', 'red'],
  [/^(palette)$/, 'wood', 'red'],
  [/^(wine)$/, 'wine', 'wine'],
  [/^(barcode|qr-code)$/, 'charcoal', 'charcoal'],
  [/^(mountain)$/, 'slate', 'white'],
  [/clock|^timer$|^history$|^gauge$/, 'ceramic', 'gold'],
  [/^hourglass$/, 'wood', 'water'],
  [/laptop|monitor|^tv$|smartphone|^tablet$|^phone|webcam|camera|^printer|^server|^router|hard-drive|^cpu$|^keyboard$|^mouse$|^speaker$|^radio$|gamepad|headphones|headset|microphone|video-camera|^video|^terminal$|app-window|^presentation$|^calculator$|^watch$|^usb$|^plug$|^scan-face$|^disc$/, 'graphite', 'steel'],
  [/^battery/, 'graphite', 'green'],
  [/^cloud$|^cloud-(rain|snow|lightning|off|sun|download|upload)/, 'cloud', 'blue'],
  [/^sun$|^sunrise|^sunset|^sun-moon|^lightbulb|^zap$|^flame|^sparkles/, 'yellow', 'orange'],
  [/^moon$/, 'yellow', 'yellow'],
  [/^droplet|^umbrella|^snowflake|^wind$|^waves|^fish$|^ship$/, 'water', 'steel'],
  [/^leaf|^tree|^sprout|^palm|^flower|^salad|^plant/, 'leaf', 'wood'],
  [/^thermometer/, 'white', 'red'],
  [/^rainbow/, 'red', 'blue'],
  [/^(pencil|edit|pen-tool|paintbrush|highlighter|signature|eraser|ruler|hammer|wand)$/, 'yellow', 'steel'],
  [/^(heart|heart-pulse|heart-crack|hand-heart)$|^pill$|^bandage|^syringe|^stethoscope|^tooth$|^hospital|^ambulance|briefcase-medical/, 'red', 'white'],
  [/^star|^sparkle/, 'yellow', 'orange'],
  [/^(trash|scissors|wrench|utensils|dumbbell|bike|paperclip|link|unlink|pin|magnet|microscope|telescope|binoculars|flask-conical|cooking-pot|siren)$/, 'steel', 'red'],
  [/^(smile|frown|laugh|meh|angry)$/, 'yellow', 'yellow'],
  [/^(bluetooth|cast)$/, 'blue', 'blue'],
  [/^(user|users|log-in|log-out|person-running|accessibility|handshake)/, 'teal', 'teal'],
  [/^(message|messages)/, 'green', 'white'],
  [/^(car|taxi|bus|train|motorcycle|truck|plane|rocket|traffic-cone|fuel)/, 'red', 'steel'],
  [/^(dollar|euro|pound|indian-rupee|banknote|percent|credit-card|piggy-bank)/, 'green', 'gold'],
  [/^(shopping|store|warehouse|factory)/, 'orange', 'steel'],
  [/^(sofa|bed|door|lamp|bath|toilet|refrigerator|washing)/, 'wood', 'steel'],
  [/^(coffee|cup-soda|beer|wine|soup|egg|chef-hat)$/, 'ceramic', 'wood'],
  [/^(pizza|burger|cake|cookie|donut|ice-cream)$/, 'orange', 'pink'],
  [/^apple$/, 'red', 'leaf'],
  [/^(football|basketball|volleyball|tennis)$/, 'orange', 'white'],
  [/^(dog|cat|bird|rabbit|turtle|butterfly|paw-print)$/, 'orange', 'pink'],
  [/^(map|map-pin|route|signpost|navigation|globe|mountain|building|hotel|school|tent)/, 'paper', 'red'],
  [/^(gem|diamond)$/, 'water', 'water'],
  [/^(graduation-cap)$/, 'fabric', 'gold'],
  [/^(bug|bot|brain|dna|atom)$/, 'violet', 'steel'],
  [/^(database|layers)$/, 'steel', 'blue'],
  [/^(image|images|film|clapperboard|gallery|palette|picture)/, 'paper', 'blue'],
  [/^(toggle|sliders)$/, 'alu', 'white'],
]

export function materials(icon, T = {}) {
  const name = icon.name || ''
  const cat = CAT[icon.category] || ['indigo', 'steel']
  let body = cat[0], part = cat[1]
  const hit = NAME.find(([re]) => re.test(name))
  if (hit) { body = hit[1]; if (hit[2]) part = hit[2] }
  let sig = 'red'
  const s = SIGNAL.find(([re]) => re.test(name))
  if (s) sig = s[1]
  // glyphs (no mass): one material throughout, never a pale one
  if (!(icon.fills || []).length) {
    if (/^(paper|alu|ceramic|cloud|white|steel|stone|kraft)$/.test(body)) body = /^(layout|text)$/.test(icon.category) ? 'navy' : 'blue'
    part = body
  }
  if (T.body) body = T.body
  if (T.part) part = T.part
  if (T.sig) sig = T.sig
  return { body: MAT[body] || MAT.indigo, part: MAT[part] || MAT.steel, sig: MAT[sig] || MAT.red, screen: MAT[T.screenMat || 'screen'], names: { body, part, sig } }
}
