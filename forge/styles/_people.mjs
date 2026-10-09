// PEOPLE avatars, shared by every multi-colour style: which avatars are people, which skeleton fill is skin / hair /
// headwear / clothing / gear, and a natural default colour set per person (skin tones spread light to deep).
//
// The avatar convention every per-icon palette (forge/palettes/avatar-*.json) and the site's skin-tone picker use:
//   c1 = skin, tint = skin light, shadow = skin shade, c2 = hair (or headwear), c3 = hair shade, c4 = clothing.
// A style keeps its own look: it may soften, flatten or brighten these colours (see adapt()), but the ROLE a part
// paints with must follow the convention so a palette's c1/tint/shadow recolours the face in every style.
import { parsePath, pointInRing } from '../kernel/geom.mjs'

export const PEOPLE = ['man', 'woman', 'person', 'boy', 'girl', 'baby', 'teen', 'older-man', 'older-woman', 'man-beard',
  'man-afro', 'man-bald', 'man-turban', 'man-cap', 'woman-curly', 'woman-braids', 'woman-bun', 'woman-bob',
  'person-glasses', 'person-headphones']
const SET = new Set(PEOPLE.map(p => 'avatar-' + p))
export const isPerson = icon => SET.has(typeof icon === 'string' ? icon : String(icon?.name || ''))

// seven skin tones, light to deep (same ramp as soft3d), each with a light (tint) and a shade (shadow)
export const SKINS = [
  { c1: '#F7D7BE', tint: '#FFF0E4', shadow: '#B9876A' },
  { c1: '#EEBF98', tint: '#FBE4D2', shadow: '#A9714C' },
  { c1: '#DDA176', tint: '#F4D3BA', shadow: '#94603C' },
  { c1: '#C3845A', tint: '#EBC7AC', shadow: '#7C4A2A' },
  { c1: '#A0673F', tint: '#DDB89C', shadow: '#5E3518' },
  { c1: '#7B4B2C', tint: '#C9A189', shadow: '#43230F' },
  { c1: '#593623', tint: '#B48D77', shadow: '#2C170A' },
]
export const HAIR = { black: '#2A2120', dark: '#43291D', brown: '#6E4428', auburn: '#94452A', blonde: '#D7A14A',
  grey: '#C4C9D1', ginger: '#C8632E' }
export const CLOTH = { blue: '#3F7FE0', coral: '#F06B55', teal: '#22A495', yellow: '#F4BE36', pink: '#F27BA5', mint: '#6FD3B6',
  navy: '#2F4170', lilac: '#A78BE8', green: '#4FB463', orange: '#F28A2E', red: '#E0483F', grey: '#8F99A8', purple: '#8A66DE',
  saffron: '#F29A2E' }
// skin index, hair colour, clothing colour, headwear colour (turban, cap: c2 is the headwear for those, hair goes ink)
const P = {
  man: [0, 'dark', 'blue'], woman: [0, 'brown', 'coral'], person: [2, 'black', 'teal'], boy: [4, 'black', 'yellow'],
  girl: [1, 'ginger', 'pink'], baby: [2, 'brown', 'mint'], teen: [5, 'black', 'purple'], 'older-man': [1, 'grey', 'navy'],
  'older-woman': [4, 'grey', 'lilac'], 'man-beard': [2, 'dark', 'green'], 'man-afro': [6, 'black', 'orange'],
  'man-bald': [3, 'dark', 'red'], 'man-turban': [4, 'black', 'navy', 'saffron'], 'man-cap': [1, 'brown', 'grey', 'red'],
  'woman-curly': [1, 'auburn', 'teal'], 'woman-braids': [5, 'black', 'yellow'], 'woman-bun': [0, 'blonde', 'purple'],
  'woman-bob': [6, 'black', 'coral'], 'person-glasses': [3, 'brown', 'navy'], 'person-headphones': [4, 'dark', 'teal'],
}
const hex = (r, g, b) => '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('').toUpperCase()
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
export const mix = (a, b, t) => { const x = rgb(a), y = rgb(b); return hex(...x.map((v, i) => v + (y[i] - v) * t)) }
export const shade = (h, k = 0.72) => hex(...rgb(h).map(v => v * k))

// the person's skin index (0 light .. 6 deep), or -1 for a non-person
export const skinIndex = icon => { const k = String(icon?.name || icon || '').slice(7); return P[k] ? P[k][0] : -1 }

// natural colours for a person: { c1, tint, shadow, c2, c3, c4, hair, wear, skin } (null for a non-person)
// c2 is the hair, or the headwear for the turban and the cap (their hair/beard is then meant to paint in ink)
export function tones(icon) {
  const k = String(icon?.name || icon || '').slice(7), p = P[k]
  if (!p) return null
  const [s, h, c, w] = p
  const hair = HAIR[h], wear = w ? CLOTH[w] : null
  const c2 = wear || hair
  return { ...SKINS[s], c2, c3: shade(c2), c4: CLOTH[c], hair, wear, skin: s }
}

// adapt a tone set to a style's look:
//   'pastel' : skin and clothes lifted toward white (soft, chalky), hair kept readable
//   'vivid'  : clothes kept, skin a touch warmer/saturated (cel / sticker looks)
//   'flat'   : as is (poster / brutal / bauhaus flat colour)
export function adapt(t, mode = 'flat') {
  if (!t) return t
  if (mode === 'pastel') {
    return { ...t, c1: mix(t.c1, '#FFFFFF', 0.28), tint: mix(t.tint, '#FFFFFF', 0.4), shadow: mix(t.shadow, '#FFFFFF', 0.25),
      c2: mix(t.c2, '#FFFFFF', 0.18), c3: mix(t.c3, '#FFFFFF', 0.12), c4: mix(t.c4, '#FFFFFF', 0.45) }
  }
  if (mode === 'vivid') {
    const warm = x => { const [r, g, b] = rgb(x); return hex(r * 1.03 + 4, g * 0.98, b * 0.9) }
    return { ...t, c1: warm(t.c1), tint: warm(t.tint) }
  }
  return { ...t }
}

// which skeleton fill is what. Fill 0 is always the face; clothing sits low (top edge at y >= 17.5).
// Per-icon exceptions: the bald man's side fills are ears (skin), the headphones' side fills are ear cups (gear),
// the cap and the turban are headwear (wear).
const EXCEPT = {
  'avatar-man-bald': { 2: 'skin', 3: 'skin' },
  'avatar-person-headphones': { 1: 'hair', 2: 'gear', 3: 'gear' },
  'avatar-man-cap': { 1: 'wear', 2: 'wear' },
  'avatar-man-turban': { 1: 'wear' },
}
const cache = new Map()
const fillD = f => typeof f === 'string' ? f : f.d
export function fillParts(icon) {
  const name = String(icon?.name || '')
  if (cache.has(name)) return cache.get(name)
  const out = (icon.fills || []).map((f, i) => {
    if (i === 0) return 'skin'
    const ex = EXCEPT[name] && EXCEPT[name][i]
    if (ex) return ex
    let y0 = Infinity
    for (const s of parsePath(fillD(f))) for (const p of s.pts) if (p[1] < y0) y0 = p[1]
    return y0 >= 17.5 ? 'cloth' : 'hair'
  })
  cache.set(name, out)
  return out
}

// the part under a point of the 24 grid: the LAST fill containing it wins (paint order: hair over the forehead,
// clothing over the neck). null when no fill holds the point (a stroke outside every fill: treat as outline/ink).
const subsCache = new Map()
export function partAt(icon, p) {
  if (!isPerson(icon)) return null
  const parts = fillParts(icon)
  const name = icon.name
  let subs = subsCache.get(name)
  if (!subs) { subs = (icon.fills || []).map(f => (f.subs || parsePath(fillD(f))).map(s => s.pts)); subsCache.set(name, subs) }
  for (let i = subs.length - 1; i >= 0; i--) {
    const inside = subs[i].reduce((a, r) => pointInRing(p, r) ? !a : a, false)
    if (inside) return parts[i]
  }
  return null
}

// part -> palette role, by the convention (wear shares c2 with hair: a turban or cap replaces the hair; gear = accent)
export const ROLE_OF = { skin: 'c1', hair: 'c2', wear: 'c2', cloth: 'c4', gear: 'accent' }
