// VALENTINE people avatars (forge/styles/_people.mjs convention): the Solid mass of a person is split into its parts
// by the skeleton fills (last fill wins: hair over the forehead, clothing over the neck), so the face is skin (c1,
// lit with tint, shaded with shadow; the light -> deep spread of tones()), the hair natural (c2), the top a
// sweetheart colour (c4: pink, red, cream-rose, berry). Knockouts inside the figure (eyes, mouth, seams) are slimmed
// and filled with ink, every eye gets a shine catch-light, so features read on any skin.
// Field helpers take the style's own SDF module (F), so the same code serves every grid pitch.
import { tones, fillParts, partAt, ROLE_OF, isPerson } from './_people.mjs'

export { isPerson }

// sweetheart tops, spread so neighbours differ (pink, heart red, rose, berry, coral)
const JUMPER = ['#FF6B8E', '#E8304F', '#F59AB5', '#B8285A', '#FF8A80']
const PEOPLE_ORDER = ['man', 'woman', 'person', 'boy', 'girl', 'baby', 'teen', 'older-man', 'older-woman', 'man-beard',
  'man-afro', 'man-bald', 'man-turban', 'man-cap', 'woman-curly', 'woman-braids', 'woman-bun', 'woman-bob',
  'person-glasses', 'person-headphones']

// the person's role fallbacks for this style (only the roles that change; the rest keep the style's defaults)
export function personColors(icon) {
  const t = tones(icon)
  if (!t) return null
  const k = Math.max(0, PEOPLE_ORDER.indexOf(String(icon.name).slice(7)))
  return { c1: t.c1, tint: t.tint, shadow: t.shadow, c2: t.c2, c3: t.c3, c4: JUMPER[k % JUMPER.length], accent: '#E8304F' }
}

// role regions (loops) of a person's mass, the ink features, and eye catch-lights
//   mass0: the style's mass field (negative inside), loops0: its traced loops; F: the style's field module
export function personPaint(icon, mass0, loops0, F, slim = 0.3) {
  // the exact signed distance of the mass (the builder's field is clamped near the edge)
  const mass = F.redistance(mass0, loops0, 3)
  const parts = fillParts(icon)
  const fills = icon.fills || []
  const regs = fills.map(f => F.region(f.set || (f.subs || []).map(s => s.pts), 2.6))
  // the visible share of every fill (later fills paint over earlier ones)
  const vis = regs.map((R, i) => { const V = Float32Array.from(R); for (let j = i + 1; j < regs.length; j++) F.subtract(V, regs[j]); return V })
  const byRole = new Map()
  vis.forEach((V, i) => {
    const r = ROLE_OF[parts[i]] || 'c1'
    const G = byRole.get(r)
    byRole.set(r, G ? F.union(G, V) : Float32Array.from(V))
  })
  const roles = [...byRole.keys()]
  const NN = mass.length
  // the figure: the mass with its knockouts filled back in where the skeleton has a fill
  const S = F.field(2.6)
  for (const R of regs) F.union(S, R)
  const fig = new Float32Array(NN)
  for (let k = 0; k < NN; k++) fig[k] = Math.min(mass[k], S[k] + 0.05)
  const regions = []
  for (const r of roles) {
    const D = byRole.get(r), G = new Float32Array(NN)
    for (let k = 0; k < NN; k++) {
      let o = Infinity
      for (const s of roles) if (s !== r) { const v = byRole.get(s)[k]; if (v < o) o = v }
      const sep = o === Infinity ? -1 : (D[k] - o) / 2
      G[k] = Math.max(fig[k], sep)
    }
    const loops = F.trace(G, 0.03, 0.12)
    if (loops.length) regions.push({ role: r, loops })
  }
  const outline = F.trace(fig, 0.03, 0.3)
  // features: the knockouts inside the figure (eyes, mouth, glasses, seams), slimmed so they read as drawn
  // features in ink rather than holes (a Solid knockout is wide: in ink at full width it looks like a moustache)
  let features = []
  try {
    const G = new Float32Array(NN)
    for (let k = 0; k < NN; k++) G[k] = Math.max(S[k] + 0.05, -mass[k]) + slim
    features = F.trace(G, 0.03, 0.06)
  } catch { features = [] }
  // eyes: small closed cutouts on the skin
  const eyes = []
  for (const c of icon.cutouts || []) for (const s of c.subs || []) {
    if (!s.closed || !s.pts || s.pts.length < 3) continue
    const xs = s.pts.map(p => p[0]), ys = s.pts.map(p => p[1])
    const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys)
    if (w * h > 6 || w > 3 || h > 3) continue
    const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2
    if (partAt(icon, [cx, cy]) === 'skin') eyes.push({ x: cx, y: cy, r: Math.min(w, h) / 2 })
  }
  return { regions, features, eyes, outline }
}
