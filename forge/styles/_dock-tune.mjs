// DOCK tuning: the default tile colourway of every icon, so a set of them reads as a colourful dock.
// These are only the literal fallbacks of the role variables (--with-dock-<role>, #hex); a per-icon palette
// (forge/palettes/<name>.json, c1 = tile) recolours everything.
import { rng } from '../kernel/geom.mjs'

// c1 tile, shadow its deep end, tint the glyph's lower material, c2 second material, accent badge,
// shine highlights / glyph top, edge light rim, ink deep detail, c3 c4 spare
const W = (c1, shadow, tint, c2, accent = '#FF3B30', ink = '#14182B') =>
  ({ ink, c1, c2, c3: '#FFD60A', c4: '#5AC8FA', tint, accent, shadow, shine: '#FFFFFF', edge: '#FFFFFF' })

export const WAYS = {
  blue: W('#2F7DF6', '#1545C2', '#DCE8FF', '#FFB23E'),
  indigo: W('#5C5CF2', '#2C29B4', '#E2E2FF', '#FFC94A'),
  purple: W('#A250F0', '#5E1FB0', '#EFE2FF', '#FFD166'),
  pink: W('#F5518C', '#B3175A', '#FFE0EB', '#FFD166'),
  red: W('#F5483F', '#AE1A1D', '#FFE1DE', '#FFD166', '#FFCC00'),
  orange: W('#FF8D24', '#CC4A08', '#FFEBD6', '#2F7DF6'),
  amber: W('#FFBE2E', '#D86F00', '#FFF2D0', '#F5483F'),
  green: W('#35C65B', '#118237', '#DCF6E2', '#FFD166'),
  teal: W('#1DB7A5', '#08716F', '#D5F4EF', '#FFC94A'),
  cyan: W('#25B4F0', '#0A66BE', '#DAF2FF', '#FFC94A'),
  graphite: W('#626A7A', '#22262F', '#E5E8EE', '#FFB23E'),
  navy: W('#2D51A3', '#111F4C', '#DDE5FA', '#FFC94A'),
  // seasonal and festive (run 13)
  saffron: W('#FF9A1F', '#C9500A', '#FFEED6', '#E8336B'),
  gold: W('#E9AE24', '#965B00', '#FFF3D2', '#E3262E'),
  festred: W('#E8262F', '#8E0A16', '#FFE3DC', '#FFC83D', '#FFC83D'),
  pine: W('#1E9E55', '#0A5A2E', '#DDF5E5', '#E8262F', '#E8262F'),
  holly: W('#D7263D', '#850B1F', '#FFE2E4', '#2FA35A', '#FFC83D'),
  pumpkin: W('#FF7A18', '#B23E00', '#FFE9D4', '#5B2A86'),
  witch: W('#7B3FC4', '#3B1470', '#EEE2FF', '#FF8A1F'),
  night: W('#3A3F55', '#12131C', '#E4E6F0', '#FF8A1F'),
  rose: W('#F2477E', '#A3123F', '#FFE0EA', '#FFD166'),
  coral: W('#FF6F61', '#C2352B', '#FFE4E0', '#FFD166'),
  mint: W('#2CCB9A', '#0C7F62', '#D8F7EC', '#FF8A5B'),
  sky: W('#4FA3FF', '#1B5FC4', '#E0EEFF', '#FFC94A'),
  lilac: W('#9A7CF5', '#5236B8', '#EEE8FF', '#FFC94A'),
  // a pink tile, a blush snout and a gold coin (the piggy bank)
  piggy: W('#F5518C', '#B3175A', '#FFE0EB', '#FFB3CE', '#FFC83D'),
}

const CAT = {
  ai: ['purple', 'indigo'], navigation: ['blue', 'cyan'], arrows: ['indigo', 'blue'], actions: ['teal', 'blue'],
  status: ['green', 'blue'], media: ['pink', 'red'], files: ['blue', 'cyan'], communication: ['green', 'teal'],
  users: ['indigo', 'purple'], commerce: ['orange', 'green'], time: ['orange', 'amber'], devices: ['graphite', 'blue'],
  layout: ['indigo', 'graphite'], text: ['graphite', 'navy'], maps: ['green', 'teal'], development: ['graphite', 'indigo'],
  security: ['navy', 'teal'], charts: ['cyan', 'teal'], weather: ['cyan', 'blue'], objects: ['orange', 'teal'],
  food: ['orange', 'red'], health: ['red', 'pink'], education: ['amber', 'indigo'], nature: ['green', 'teal'],
  home: ['orange', 'blue'], travel: ['cyan', 'teal'], sports: ['orange', 'green'],
  'indian-festivals': ['saffron', 'pink', 'amber', 'saffron'], christmas: ['holly', 'pine'], 'lunar-new-year': ['festred', 'gold', 'festred'],
  valentines: ['rose', 'festred', 'pink'], halloween: ['pumpkin', 'witch', 'night'],
  avatars: ['sky', 'coral', 'mint', 'lilac', 'amber', 'teal', 'pink', 'indigo'],
}
// meaning first: a few words carry their own colour on every platform
const WORDS = [
  [/^(christmas-tree|wreath|mistletoe|holly|bamboo)$/, 'pine'],
  [/^(gold-ingot|lucky-coin|north-star|jingle-bells|diya|kalash|sparkler)$/, 'gold'],
  [/^(red-lantern|red-envelope|firecracker-string|lion-head|dragon-head|chinese-knot|santa-hat|stocking|poinsettia|candy-cane)$/, 'festred'],
  [/^(ghost|bat|black-cat|spider|spider-web|coffin|tombstone|haunted-house|skull)$/, 'night'],
  [/^(witch-hat|cauldron|crystal-ball|broom)$/, 'witch'],
  [/^(jack-o-lantern|candy-corn|candy-bucket|mandarin-orange|marigold)$/, 'pumpkin'],
  [/^(gulal|holi-splash|rangoli-pattern|alpana|lotus|rakhi)$/, 'pink'],
  [/^(snowman|snow-globe|sleigh)$/, 'sky'],
  [/^piggy-bank$/, 'piggy'],
  [/(^|-)(alert|warning|warn|triangle-alert)(-|$)/, 'amber'],
  [/(^|-)(x|error|ban|trash|delete|stop|record|heart|flame|fire)(-|$)/, 'red'],
  [/(^|-)(check|success|done|leaf|plant|tree|battery)(-|$)/, 'green'],
  [/(^|-)(info|help|question)(-|$)/, 'blue'],
  [/(^|-)(star|sun|lightbulb|bulb|zap|bolt|trophy|award|crown)(-|$)/, 'amber'],
  [/(^|-)(moon|night|sparkles|wand|magic)(-|$)/, 'indigo'],
  [/(^|-)(droplet|water|wave|cloud|snow|rain)(-|$)/, 'cyan'],
]

export function colourway(icon) {
  const name = icon.name || ''
  for (const [re, w] of WORDS) if (re.test(name)) return WAYS[w]
  const opts = CAT[icon.category] || ['blue', 'indigo']
  const r = rng('dock' + name)()
  return WAYS[opts.length === 2 ? opts[r < 0.6 ? 0 : 1] : opts[Math.floor(r * opts.length)]]
}
