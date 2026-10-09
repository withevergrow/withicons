// CLAY colour: role-named variables --with-clay-<role> with literal fallbacks.
// Every icon paints with the same ten roles (so per-icon palettes and the editor recolour it);
// only the fallback hex differs: a few objects get their natural clay colour by default
// (a red heart, a yellow sun), everything else is the house violet.
export const BASE = {
  ink: '#2A1D5C', c1: '#7B6CFF', c2: '#FFB257', c3: '#FF5C97', c4: '#3CCFB4',
  tint: '#E3DEFF', accent: '#FFD84A', shadow: '#24166B', shine: '#FFFFFF', edge: '#FFFFFF',
}

// natural clay colours: a family overrides the fallbacks of c1 tint shadow (and c2 c3 so parts stay in contrast)
const FAM = {
  red:    { c1: '#FF5B6E', tint: '#FFDCE1', shadow: '#6A0F2E', c2: '#FFCB45', c3: '#7B6CFF' },
  gold:   { c1: '#FFC53D', tint: '#FFF4C6', shadow: '#7A3600', c2: '#FF8A4C', c3: '#FF5C97' },
  orange: { c1: '#FF8B42', tint: '#FFE1C9', shadow: '#6B1E05', c2: '#FFD84A', c3: '#7B6CFF' },
  green:  { c1: '#3ECB80', tint: '#D2F6E1', shadow: '#0A4734', c2: '#FFC53D', c3: '#FF5C97' },
  sky:    { c1: '#4EA8FF', tint: '#DCEEFF', shadow: '#0E2D70', c2: '#FFC53D', c3: '#FF5C97' },
  pink:   { c1: '#FF7AB6', tint: '#FFE1EF', shadow: '#6A1041', c2: '#FFD24A', c3: '#7B6CFF' },
  teal:   { c1: '#2CCDB6', tint: '#D0F7F0', shadow: '#09474E', c2: '#FFB257', c3: '#FF5C97' },
  cocoa:  { c1: '#C4875C', tint: '#F6DFCC', shadow: '#43200F', c2: '#FFD24A', c3: '#FF5C97' },
  caramel:{ c1: '#D99A5B', tint: '#FBE6CF', shadow: '#4A230C', c2: '#FFF1E2', c3: '#FF5B6E' },
  cream:  { c1: '#F4EEFF', tint: '#FFFFFF', shadow: '#3B2E6E', c2: '#7B6CFF', c3: '#FF5C97' },
  snow:   { c1: '#F2F7FF', tint: '#FFFFFF', shadow: '#1E3A72', c2: '#FF5B6E', c3: '#FF8B42' },
  plum:   { c1: '#4B3A78', tint: '#9C8CD6', shadow: '#140B2E', c2: '#FFB257', c3: '#7CE36A' },
  clay:   { c1: '#D9714A', tint: '#FADBCB', shadow: '#4E1A0A', c2: '#FFC53D', c3: '#FF5C97' },
  skin:   { c1: '#F2BE96', tint: '#FFE8D8', shadow: '#5E2E1C', c2: '#5B3B2F', c3: '#FF5C97' },
  fur:    { c1: '#C98C5A', tint: '#F7E0C8', shadow: '#40200E', c2: '#3A2A26', c3: '#FF7AB6' },
  grey:   { c1: '#A9B3C8', tint: '#EEF2F8', shadow: '#2A3350', c2: '#3A3550', c3: '#FF7AB6' },
  monster:{ c1: '#7CDB6A', tint: '#E1F9DA', shadow: '#164A2A', c2: '#FF7AB6', c3: '#7B6CFF' },
}
const RULES = [
  // festivals & avatars (run 13)
  ['red', /^(red-lantern|red-envelope|firecracker|firecracker-string|sky-lantern|lion-head|dragon-head|chinese-knot|lunar-drum|santa-hat|stocking|bauble|jingle-bells|poinsettia|nutcracker|christmas-candle|gift-stack|love-letter|heart-pair|heart-gift|heart-balloon|love-scroll|love-lock|cupid-bow|candy-bucket|rakhi|gulal|holi-splash|pichkari|kite|toran|mithai-box)$/],
  ['orange', /^(mandarin-orange|marigold|jack-o-lantern|candy-corn|avatar-fox|avatar-tiger|fireplace|jalebi|laddoo|dholak|dhak|thandai|pandal)$/],
  ['gold', /^(gold-ingot|lucky-coin|north-star|sparkler|puja-thali|kalash|shankh|ring-box|champagne-toast|sleigh|paper-fan)$/],
  ['green', /^(bamboo|holly|mistletoe|christmas-tree|wreath|avatar-frog|water-balloon|peacock-feather|teapot)$/],
  ['pink', /^(plum-blossom|rose|rose-bouquet|lotus|rangoli-pattern|alpana|mehndi-hand|paisley|chocolate-box|avatar-unicorn|avatar-bunny|dumpling)$/],
  ['caramel', /^(gingerbread-man|teddy-bear|chopsticks|broom|avatar-bear|avatar-dog|avatar-owl)$/],
  ['cocoa', /^(choco-strawberry|hot-cocoa)$/],
  ['cream', /^(ghost|skull|avatar-ghost|candy-cane|tombstone|spider-web|avatar-panda|avatar-penguin)$/],
  ['snow', /^(snowman|snow-globe|reindeer)$/],
  ['plum', /^(bat|black-cat|coffin|witch-hat|spider|cauldron|haunted-house|crystal-ball)$/],
  ['clay', /^(diya)$/],
  ['grey', /^(avatar-koala|avatar-robot)$/],
  ['fur', /^(avatar-cat)$/],
  ['monster', /^(avatar-monster.*|avatar-alien|avatar-dino)$/],
  ['skin', /^avatar-/],
  ['red', /^(heart|heart-pulse|heart-crack|siren|apple|hospital|ambulance|bandage|briefcase-medical|first-aid|pill|life-buoy|alert-circle|ban|x-circle|stop|circle-stop|record|youtube|gift|tomato|cherry|strawberry)$/],
  ['gold', /^(sun|sun-dim|moon|sun-moon|star|star-half|lightbulb|lightbulb-off|trophy|award|medal|crown|zap|zap-off|coins|key|key-round|bell|bell-ring|bell-plus|bell-off|sparkles|wand|wand-sparkles|alert-triangle|lemon|banana|cheese|egg|hand-coins|badge-dollar-sign|dollar-sign|euro|pound-sterling|indian-rupee|piggy-bank|taxi|school|graduation-cap)$/],
  ['orange', /^(flame|pizza|burger|cookie|basketball|traffic-cone|fuel|sunrise|sunset|rocket|cat|fox|carrot|soup|cooking-pot|popcorn|beer|backpack|hard-hat|tennis|volleyball|football|party-popper|megaphone|package|package-open|truck|boxes|cube|warehouse)$/],
  ['green', /^(leaf|tree-pine|sprout|palm-tree|salad|check|check-circle|check-square|check-check|badge-check|shield-check|recycle|battery|battery-full|battery-charging|banknote|wallet|turtle|plant|frog|trending-up|clipboard-check|calendar-check|user-check|file-check|mail-check|copy-check|list-checks|list-todo|toggle|dumbbell)$/],
  ['sky', /^(cloud|cloud-.*|droplet|droplets|snowflake|wind|umbrella|info-circle|message-circle|message-square|message-square-text|message-circle-more|messages|fish|ship|anchor|globe|globe-lock|plane|plane-takeoff|plane-landing|thermometer|bird|mountain|map|compass|navigation|send|send-horizontal|bath|washing-machine|refrigerator|toilet|car|car-front|bus|train|bike|motorcycle|satellite|telescope|wifi|bluetooth|tent|map-pin|map-pin-check|signpost|luggage|passport|hotel|parking|route)$/],
  ['pink', /^(cake|ice-cream|donut|balloon|flower|butterfly|heart-handshake|hand-heart|rabbit|brain|brain-circuit|smile|smile-plus|laugh|cup-soda|wine|shopping-bag|tag|ticket|gem|palette|paintbrush|lipstick|bed|sofa|lamp)$/],
  ['teal', /^(dna|flask-conical|test-tube|microscope|atom|syringe|stethoscope|tooth|accessibility|leaf-teal|shield|shield-user|shield-alert|fingerprint|scan-face|lock-keyhole|database|database-zap|server|server-cog|hard-drive|cpu|circuit-board|router|network|plug|plug-zap|usb)$/],
  ['cocoa', /^(coffee|dog|paw-print|briefcase|briefcase-business|chef-hat|utensils|hammer|shovel|gavel|scroll-text|book|book-open|library|notebook|notebook-pen|archive|door-open|door-closed|guitar|piano)$/],
]
export function familyOf(name) {
  for (const [f, re] of RULES) if (re.test(name)) return f
  return null
}

// materials: roles per piece
const MAT = {
  K: { base: 'c1', deep: 'shadow', hi: 'tint', t0: 0.32, t1: 0.62 },
  Af: { base: 'c2', deep: 'shadow', edge: 'c3', hi: 'c2', t0: 0.12, t1: 0.34 },
  Ab: { base: 'c2', deep: 'shadow', edge: 'c3', hi: 'c2', t0: 0.12, t1: 0.34 },
  S: { base: 'c3', deep: 'shadow', hi: 'c3', t0: 0.25, t1: 0.5 },
  Ac: { base: 'c4', deep: 'shadow', hi: 'c4', t0: 0.14, t1: 0.38 },
}

// people avatars: a spread of skin tones (light to deep), hair to suit, a friendly shirt colour (c4).
// Order is fixed so neighbours in a grid differ; unknown avatar-* names fall back to a hash.
const SKIN = [
  { c1: '#F6CDA8', tint: '#FFEDE0', shadow: '#6A3420' },
  { c1: '#E0A57A', tint: '#FBE2CF', shadow: '#5A2A16' },
  { c1: '#C5845A', tint: '#F2D2BA', shadow: '#4A200E' },
  { c1: '#9E623D', tint: '#E3BFA4', shadow: '#36160A' },
  { c1: '#7A4628', tint: '#CFA488', shadow: '#2A1006' },
  { c1: '#6A3C24', tint: '#C79A7E', shadow: '#1E0B04' },
]
const HAIR = ['#2B2230', '#4A2F24', '#E0B062', '#6B4330', '#2B2230', '#8A4B2A']
const SHIRT = ['#7B6CFF', '#2CC0A8', '#FF7A6B', '#4EA8FF', '#FFB938', '#FF7AB6']
const PEOPLE = ['man', 'woman', 'person', 'boy', 'girl', 'baby', 'teen', 'older-man', 'older-woman', 'man-beard', 'man-afro',
  'man-bald', 'man-turban', 'man-cap', 'woman-curly', 'woman-braids', 'woman-bun', 'woman-bob', 'person-glasses', 'person-headphones']
const SKIN_OF = {
  man: 0, woman: 0, person: 2, boy: 1, girl: 4, baby: 0, teen: 1, 'older-man': 5, 'older-woman': 2, 'man-beard': 0, 'man-afro': 4,
  'man-bald': 1, 'man-turban': 2, 'man-cap': 5, 'woman-curly': 3, 'woman-braids': 5, 'woman-bun': 0,
  'woman-bob': 2, 'person-glasses': 1, 'person-headphones': 4,
}
const hashOf = s => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h }
function person(name) {
  const k = name.slice(7)
  const i = PEOPLE.indexOf(k), n = i >= 0 ? i : hashOf(k)
  const t = SKIN_OF[k] !== undefined ? SKIN_OF[k] : (n * 5) % SKIN.length
  let hair = HAIR[(n * 7 + 1) % HAIR.length]
  if (k.startsWith('older')) hair = '#C9C4D2'
  if (k === 'man-turban') hair = '#E2574C'
  if (k === 'person-headphones') hair = '#3A3550'
  if (k === 'person-glasses') hair = '#2B2230'          // hair and frames share the role
  if (t >= 3 && hair === '#E0B062') hair = '#2B2230'
  return { ...SKIN[t], c2: hair, c4: SHIRT[n % SHIRT.length], c3: '#FF5C97' }
}

export function colorsFor(icon, T = {}) {
  const fam = T.family !== undefined ? T.family : familyOf(icon.name || '')
  const ppl = fam === 'skin' && /^avatar-/.test(icon.name || '')
  const P = { ...BASE, ...(fam ? FAM[fam] : {}), ...(ppl ? person(icon.name) : {}), ...(T.colors || {}) }
  const col = r => `var(--with-clay-${r}, ${P[r]})`
  // a pure-line glyph (no fills: arrows, chevrons) is one material: its parts keep their own nodes
  const line = !(icon.fills && icon.fills.length) && !T.twoTone
  const A = line ? MAT.K : MAT.Af
  return { col, P, Ac: MAT.Ac, K: MAT.K, Af: A, Ab: T.abMat ? MAT[T.abMat] : (line ? MAT.K : MAT.Ab), S: MAT.S }
}
