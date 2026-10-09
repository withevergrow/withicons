// CLAY tuning: per-icon overrides (never in skeletons).
//   scale dx dy        drawing transform tweaks
//   wk wa ws wg        tube widths
//   plate {pathId: P}  move a path to another plate
//   fillPlate          force every fill onto one plate
//   aFront true|false  force A pieces in front of / behind the body
//   noCutouts noCrease pits pitMax inlay
//   eyes [[cx, cy, rx, ry?]]  dark glossy eye pits drawn on top of the A piece (skeleton coordinates)
const TUNE = {
  brain: { aCrease: true },
  'brain-circuit': { aCrease: true },
  coffee: { colors: { c2: '#FFF1E2' } },
  'chart-bar': { aFront: false },
  // dark markings on pale animals and skulls
  'avatar-panda': { colors: { c2: '#2F2A3D' } },
  // the penguin: a dark head around a white face (the A fill), not a pale ball with a dark mask
  'avatar-penguin': { eyes: [[9.5, 12.9, 0.9, 1.1], [14.5, 12.9, 0.9, 1.1]], family: 'plum', colors: { c1: '#3A3550', tint: '#8A84A6', shadow: '#141022', c2: '#FFF6EA', c3: '#FFB257' } },
  // the owl: dark pupils in the white goggles
  'avatar-owl': { eyes: [[8.75, 11.5, 1.05], [15.25, 11.5, 1.05]] },
  skull: { colors: { c2: '#3A2E5E' } },
  'avatar-ghost': { colors: { c2: '#3A2E5E' } },
  ghost: { colors: { c2: '#3A2E5E' } },
  // people: a near-black beard over the jaw reads as a mask; glasses need fine frames to keep the eyes
  'avatar-man-beard': { colors: { c2: '#6B4330' } },
  'avatar-person-glasses': { wa: 1.45 },
  'avatar-older-woman': { wa: 1.45 },
  // the front dragon: gold antlers, brows and whiskers, thin A rings so the eyes stay features
  'dragon-head': { wa: 1.3, colors: { c2: '#F2B33D', c3: '#F2B33D' } },
  // a pink piggy bank: a deeper pink snout in front (A) with two nostril pits, a slimmer gold coin dropping in (S)
  'piggy-bank': { family: 'pink', colors: { c2: '#FF5E9C', c3: '#FFC53D' }, aFront: true, scale: 0.94, ws: 1.5,
    eyes: [[19.1, 13.4, 0.4, 0.6], [20.4, 13.4, 0.4, 0.6]] },
}

const PEOPLE = /^avatar-(man|woman|person|boy|girl|baby|teen|older)/
export function tuneFor(name) {
  const t = TUNE[name] || {}
  return PEOPLE.test(name || '') ? { clothes: true, ...t } : t
}
