// PLUSH tuning: colour schemes for the automatic path, and per-icon auto tweaks.
// Skeletons are never edited for a style: anything icon-specific lives here.
import { rng } from '../kernel/geom.mjs'

// felt schemes: main panel, secondary part (A plate), appliqué patch (openings), badge (S plate)
export const SCHEMES = {
  c1: { main: 'c1', part: 'c3', patch: 'tint', badge: 'c4' },
  c2: { main: 'c2', part: 'c1', patch: 'c3', badge: 'c3' },
  c3: { main: 'c3', part: 'c2', patch: 'tint', badge: 'c1' },
  c4: { main: 'c4', part: 'c2', patch: 'tint', badge: 'c1' },
  accent: { main: 'accent', part: 'c3', patch: 'tint', badge: 'c4' },
}
// colour by meaning first, then by category, then by name
const MEANING = [
  [/heart|gift|ribbon|bookmark|cake|candy|flower|baby|smile|kiss|valentine|palette|sparkle|crown|music|headphone|bag|shopping/, 'accent'],
  [/sun|star|bolt|zap|light|bulb|lamp|bell|key|coin|dollar|money|cash|wallet|lemon|banana|cheese|trophy|award|medal|sticky|folder|lock|unlock|duck|chick|bee|pencil|taxi|bus/, 'c2'],
  [/leaf|tree|plant|sprout|cactus|recycle|battery|check|map|globe|mountain|clipboard|frog|turtle|apple|pear|broccoli|salad|eco|garden|pine|clover|success|done/, 'c4'],
  [/flame|fire|alert|warning|alarm|stop|record|siren|tomato|strawberry|cherry|chili|pepper|car|truck|rocket|fire-truck|lipstick|mail|inbox|send|love|pizza|coffee|mug|cup/, 'c1'],
  [/cloud|rain|snow|water|drop|wave|ocean|fish|whale|droplet|wifi|bluetooth|cloud|phone|tablet|laptop|monitor|tv|ship|boat|plane|umbrella|wind|moon|night|sleep|user|person|people|calendar|file|doc/, 'c3'],
]
const CATEGORY = {
  navigation: 'c3', arrows: 'c1', actions: 'c3', status: 'c4', media: 'c1', files: 'c3', communication: 'c3',
  users: 'c3', commerce: 'c2', time: 'c3', devices: 'c3', layout: 'c3', text: 'c3', maps: 'c4', development: 'c3',
  security: 'c2', charts: 'c4', weather: 'c3', objects: 'c1', food: 'c1', health: 'c1', education: 'c2', nature: 'c4',
  home: 'c1', travel: 'c3', sports: 'c1',
}
export function schemeOf(name, category) {
  const n = String(name || '')
  const T = TUNE[n] || {}
  if (T.main && SCHEMES[T.main]) return { ...SCHEMES[T.main], ...(T.scheme || {}) }
  for (const [re, k] of MEANING) if (re.test(n)) return { ...SCHEMES[k], ...(T.scheme || {}) }
  const c = CATEGORY[category]
  // a quarter of each category takes a sibling felt, so a page is a toy box and not a uniform
  const r = rng(n + ':plush')()
  const sib = { c1: 'c3', c3: 'c1', c2: 'c4', c4: 'c3', accent: 'c3' }
  let k = c || ['c1', 'c3', 'c2', 'c4'][Math.floor(r * 4)]
  if (c && r < 0.28) k = sib[c]
  return { ...SCHEMES[k], ...(T.scheme || {}) }
}

// per-icon tweaks of the automatic path
//   main: 'c1'|'c2'|'c3'|'c4'|'accent'   scheme by main felt
//   scheme: { part, patch, badge }      override single roles
//   tw: number                          tube width for the outline
//   ink: [pathIndex, ...]               draw these skeleton paths as embroidery instead of felt
//   drop: [pathIndex, ...]              leave these skeleton paths out
export const TUNE = {
  // Live icons dressed as their static families (forge/styles/_plush-live.mjs adds the family parts)
  ...Object.fromEntries(['date', 'event', 'month', 'range', 'tear', 'weekday'].map(k => ['calendar-' + k, { main: 'c3', scheme: { main: 'tint', part: 'c3', patch: 'c1', badge: 'c1' } }])),
  'mail-count': { main: 'c1', scheme: { main: 'tint', part: 'c1', patch: 'c3', badge: 'c4' } },
  'bell-count': { main: 'c2', scheme: { part: 'c3', badge: 'c4' } },
  'folder-label': { main: 'c2', scheme: { part: 'c1' } },
  ...Object.fromEntries(['battery-level', 'battery-percent', 'battery-vertical', 'battery-charging-level'].map(k => [k, { main: 'c3', scheme: { part: 'c4' } }])),
}
