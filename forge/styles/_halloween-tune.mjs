// HALLOWEEN per-icon tuning (never in skeletons).
//   mat: 'pumpkin' | 'witch' | 'midnight' | 'bone' | 'slime'   body material
//   holes: 'dark' (carved details dark, not candle-lit);  A: 'body' (parts in the body material)
//   drips: 0 (no goo) or a count;  moon: true / false;  critter: 'bat' | 'spider' | false;  eyes: true / false;  ribs: true
import { rng } from '../kernel/geom.mjs'

export const TUNE = {
  // the festival set
  'jack-o-lantern': { mat: 'pumpkin', ribs: true, eyes: false, critter: 'bat', moon: false },
  ghost: { mat: 'bone', critter: 'bat', eyes: false, holes: 'dark' },
  bat: { mat: 'midnight', critter: false, moon: true, drips: 0 },
  'witch-hat': { mat: 'midnight', critter: 'bat' },
  skull: { mat: 'bone', critter: 'spider', moon: false },
  cauldron: { mat: 'midnight', critter: 'bat' },
  'candy-corn': { mat: 'pumpkin', critter: false, drips: 0 },
  spider: { mat: 'midnight', critter: false, moon: false },
  'spider-web': { mat: 'witch', critter: 'spider', moon: false, drips: 0 },
  'haunted-house': { mat: 'witch', critter: 'bat', eyes: true, moon: true },
  broom: { mat: 'pumpkin', critter: 'bat' },
  coffin: { mat: 'midnight', critter: 'spider' },
  tombstone: { mat: 'bone', critter: 'bat', moon: true },
  'black-cat': { mat: 'midnight', critter: false, moon: true, A: 'body' },
  'candy-bucket': { mat: 'pumpkin', ribs: true, critter: 'spider' },
  'crystal-ball': { mat: 'witch', critter: 'bat', moon: false },
  'avatar-fox': { mat: 'pumpkin' },
  'avatar-ghost': { mat: 'bone', holes: 'dark' },
  'avatar-tiger': { mat: 'pumpkin' },
  // natural choices among everyday icons
  moon: { mat: 'bone', moon: false, critter: 'bat' },
  'sun-moon': { mat: 'bone', moon: false },
  cat: { mat: 'midnight', moon: true },
  flame: { mat: 'pumpkin' },
  gift: { mat: 'witch' },
  'cooking-pot': { mat: 'midnight', eyes: true },
  home: { mat: 'witch', eyes: true },
  'door-closed': { mat: 'midnight' },
  'door-open': { mat: 'midnight', eyes: true },
  cookie: { mat: 'pumpkin' },
  eye: { mat: 'bone' },
  'eye-off': { mat: 'bone' },
}

// body material: the tune, then a word in the name, then a seeded mix (pumpkin first)
const WORDS = [
  [/(^|-)(moon|ghost|skull|bone|tombstone|snowflake|cloud|egg|tooth|scroll)(-|$)/, 'bone'],
  [/(^|-)(cat|bat|spider|witch|cauldron|pot|coffin|door|key|lock|owl)(-|$)/, 'midnight'],
  [/(^|-)(house|home|crystal|potion|flask|wand|sparkles|gem|crown|book|gift|castle)(-|$)/, 'witch'],
  [/(^|-)(pumpkin|lantern|candy|flame|fire|sun|cookie|pizza|leaf|broom|star)(-|$)/, 'pumpkin'],
]
export function materialOf(name) {
  const t = TUNE[name]
  if (t && t.mat) return t.mat
  // avatars: monsters in slime, the ghost in bone, night animals in black; people never in black
  if (name.startsWith('avatar-')) {
    if (/monster|alien|frog|dino/.test(name)) return name.includes('horns') ? 'pumpkin' : 'slime'
    if (/ghost|unicorn/.test(name)) return 'bone'
    if (/cat|owl|penguin/.test(name)) return 'midnight'
    if (/robot/.test(name)) return 'witch'
    const r = rng(name + ':mat')()
    return r < 0.5 ? 'pumpkin' : r < 0.82 ? 'witch' : 'bone'
  }
  for (const [re, m] of WORDS) if (re.test(name)) return m
  const r = rng(name + ':mat')()
  return r < 0.44 ? 'pumpkin' : r < 0.7 ? 'witch' : r < 0.9 ? 'midnight' : 'bone'
}
