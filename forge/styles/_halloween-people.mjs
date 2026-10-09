// HALLOWEEN people avatars (a private copy of _utsav-people.mjs): split the solid mass into skin / hair / headwear / clothing / gear pieces (forge/styles/_people.mjs
// convention), so the face paints with c1 (skin) and its tint / shadow, the hair with c2 -> c3, the clothing with c4.
//
// Each skeleton fill becomes a part region (later fills of another part cut it: hair over the forehead, clothing over
// the neck). Every ink sample of the mass goes to the NEAREST part region (a smooth bisector between two regions), so
// a piece keeps the mass's round strokes and outline and the joins between parts are clean curves.
import { parsePath, area } from '../kernel/geom.mjs'
import { isPerson, tones, adapt, fillParts, mix, shade } from './_people.mjs'

export { isPerson }

const ringsOf = f => {
  if (f && f.set && f.set.length) return f.set.filter(r => r && r.length > 2)
  const subs = (f && f.subs) || parsePath(typeof f === 'string' ? f : (f && f.d) || '')
  return subs.map(s => s.pts).filter(r => r && r.length > 2)
}

// { part: field } over the mass (negative = ink), one entry per part present; null when it cannot split
export function partFields(icon, mass, F, reach = 4) {
  const parts = fillParts(icon)
  const R = (icon.fills || []).map(ringsOf)
  if (!R.length || !mass) return null
  const NN = mass.length
  const kinds = [...new Set(parts)]
  const S = {}
  for (const p of kinds) {
    const G = F.field(reach)
    R.forEach((r, i) => {
      if (parts[i] !== p || !r.length) return
      const g = F.region(r, reach)
      for (let j = i + 1; j < R.length; j++) if (parts[j] !== p && R[j].length) F.subtract(g, F.region(R[j], reach))
      F.union(G, g)
    })
    S[p] = G
  }
  const out = {}
  for (const p of kinds) {
    const G = new Float32Array(NN), others = kinds.filter(q => q !== p).map(q => S[q])
    for (let k = 0; k < NN; k++) {
      let m = Infinity
      for (const o of others) if (o[k] < m) m = o[k]
      const v = others.length ? (S[p][k] - m) / 2 : -1
      G[k] = Math.max(mass[k], v)
    }
    out[p] = G
  }
  return out
}

// the skeleton fills in paint order with their part: [{ part, rings }] (a backing under the pieces, so the knockout gaps
// inside a person read as that part's colour, not as paper)
export function fillBacking(icon) {
  const parts = fillParts(icon)
  return (icon.fills || []).map((f, i) => ({ part: parts[i], rings: ringsOf(f) })).filter(b => b.rings.length)
}

// the eyes: the skeleton's small, compact closed cutouts in the upper face -> [{ ring, box: [x0, y0, x1, y1] }]
export function eyeCuts(icon) {
  const out = []
  for (const c of icon.cutouts || []) {
    for (const r of ringsOf(c)) {
      const a = Math.abs(area(r))
      if (a < 0.3 || a > 3) continue
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
      for (const [x, y] of r) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y }
      const w = x1 - x0, h = y1 - y0
      if (w < 0.5 || h < 0.5 || w > h * 1.8 || h > w * 2.2 || (y0 + y1) / 2 > 13) continue
      // only closed outlines
      if (!(c.subs ? c.subs.some(q => q.closed) : /z\s*$/i.test(String(c.d || c)))) continue
      out.push({ ring: r, box: [x0, y0, x1, y1] })
    }
  }
  return out
}
// a catch-light disc for one eye box: [cx, cy, r]
export const catchLight = ([x0, y0, x1, y1]) => { const w = x1 - x0, h = y1 - y0; return [x0 + w * 0.63, y0 + h * 0.35, Math.max(0.17, Math.min(w, h) * 0.2)] }

// costume colours for Halloween (pumpkin, witch purple, slime, midnight blue, vampire red, potion teal, candy orange)
const FESTIVE = ['#F28A2E', '#7B4FD0', '#5FB83A', '#3B3A8C', '#B3243A', '#1F9E8F', '#E0662A']
const ORDER = ['man', 'woman', 'person', 'boy', 'girl', 'baby', 'teen', 'older-man', 'older-woman', 'man-beard', 'man-afro',
  'man-bald', 'man-turban', 'man-cap', 'woman-curly', 'woman-braids', 'woman-bun', 'woman-bob', 'person-glasses', 'person-headphones']
export function festiveCloth(icon, set = FESTIVE) {
  const k = ORDER.indexOf(String(icon?.name || '').slice(7))
  return set[(k < 0 ? 0 : k * 3) % set.length]
}

// natural defaults for one person in Halloween (night-lit skin, costume clothing): skin c1 / tint / shadow, hair c2 / c3, clothing c4
export function personTones(icon) {
  const t = adapt(tones(icon), 'flat')
  if (!t) return null
  // near-black hair lifted a little toward a warm brown-black, so it parts from the plum outline
  const lum = h => { const n = parseInt(h.slice(1), 16); return ((n >> 16) * 0.3 + ((n >> 8) & 255) * 0.59 + (n & 255) * 0.11) / 255 }
  const c2 = lum(t.c2) < 0.2 ? mix(t.c2, '#7A5442', 0.35) : t.c2
  return { ...t, c2, c3: c2 === t.c2 ? t.c3 : shade(c2), c4: festiveCloth(icon) }
}
