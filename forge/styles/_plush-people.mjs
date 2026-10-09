// PLUSH people: the 20 person avatars are sewn from skin-tone felt, hair felt and clothing felt.
//
// The automatic path paints a person's face in the scheme's main felt (tomato, sky, ...) and hair + clothing
// as one second felt. Here every felt panel is re-cut along the skeleton's fills (forge/styles/_people.mjs):
//   face, ears, neck   c1 felt (skin), its shade + pinch in shadow (skin shade), its fleece highlight in tint
//   hair / headwear    c2 felt          clothing  c4 felt          headphone cups  accent felt
// so a per-icon palette or the skin-tone picker (c1 / tint / shadow) recolours the skin. The fallback hexes are
// the person's natural tones (tones(): a spread light to deep). Non-skin felts shade in ink, the ground shadow too
// (the shadow role is the skin's own shade here). Eyes stay ink French knots with a light catch-light, so they read
// on deep skin; the mouth is embroidered in ink on light skin and in light thread on deep skin.
import * as F from './_plush-field.mjs'
import * as Kit from './_plush-kit.mjs'
import { isPerson, tones, skinIndex, fillParts, ROLE_OF, mix } from './_people.mjs'
import { T, subsOf } from './_plush-auto.mjs'

const ROLE = { ...ROLE_OF }
const DEEP = 4 // skin index from which thread on the face goes light

// owner part of every field cell: the last fill holding it, else the nearest fill (own); for the A panels (hair,
// headwear, clothing, gear) the cells of the bare face are dropped (null) and cells off every fill go to the nearest
// non-skin fill (a hairline or collar tube that sticks out is still hair or clothing)
function partGrid(icon) {
  const parts = fillParts(icon)
  const R = (icon.fills || []).map(f => F.region(subsOf(typeof f === 'string' ? f : f.d).filter(s => s.pts.length > 2).map(s => s.pts.map(T)), 3))
  const own = new Array(F.NN), ag = new Array(F.NN)
  for (let c = 0; c < F.NN; c++) {
    let inside = -1, near = -1, nearNS = -1, b = Infinity, bn = Infinity
    for (let i = 0; i < R.length; i++) {
      const v = R[i][c]
      if (v < 0) inside = i
      if (v < b) { b = v; near = i }
      if (parts[i] !== 'skin' && v < bn) { bn = v; nearNS = i }
    }
    own[c] = parts[inside >= 0 ? inside : near] || 'skin'
    ag[c] = inside >= 0 ? (parts[inside] === 'skin' ? null : parts[inside]) : nearNS >= 0 ? parts[nearNS] : null
  }
  return { own, ag }
}
const cellOf = (x, y) => Math.max(0, Math.min(F.N - 1, Math.round(y / F.H))) * F.N + Math.max(0, Math.min(F.N - 1, Math.round(x / F.H)))

export function personize(pieces, icon) {
  if (!isPerson(icon)) return pieces
  const { own, ag } = partGrid(icon)
  const parts = fillParts(icon)
  const skinFills = (icon.fills || []).map((f, i) => parts[i] === 'skin' ? F.region(subsOf(typeof f === 'string' ? f : f.d).filter(s => s.pts.length > 2).map(s => s.pts.map(T)), 1.3) : null).filter(Boolean)
  const deep = skinIndex(icon) >= DEEP
  const skinFelt = {
    shadeRole: 'shadow', shadeOp: 0.42, pinchOp: 0.3, hiRole: 'tint', hiOp: 0.7,
    threadRole: deep ? 'edge' : 'ink', threadOp: deep ? 0.6 : 0.4,
  }
  // hair, headwear, clothes: shaded in ink; a softer fleece light so dark hair stays hair-coloured, not grey
  const other = k => ({ shadeRole: 'ink', pinchOp: 0.12, ...(k === 'hair' ? { hiOp: 0.14, threadOp: 0.5 } : {}) })
  const out = []
  let face = null
  for (const pc of pieces) {
    if (pc.kind !== 'felt' || !pc.F || pc.part === 'deco' || pc.part === 'S') { out.push(pc); continue }
    const A = pc.part === 'A', grid = A ? ag : own
    const count = {}
    let n = 0
    for (let c = 0; c < F.NN; c++) if (pc.F[c] < 0 && grid[c]) { count[grid[c]] = (count[grid[c]] || 0) + 1; n++ }
    if (!n) { out.push(pc); continue }
    const area = n * F.H * F.H
    // a small appliqué patch on the face (an eye opening): an ink French knot with a light catch-light
    if (!A && face && area < 4 && (count.skin || 0) / n > 0.6) {
      const { x0, y0, x1, y1 } = F.box(pc.F)
      const w = x1 - x0, h = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
      out.push(Kit.flat('ink', pc.F, { part: pc.part }))
      out.push(Kit.knot(cx + w * 0.2, cy - h * 0.22, Math.max(0.22, Math.min(w, h) * 0.2), 'shine', { part: pc.part }))
      continue
    }
    const ks = Object.keys(count).sort((a, b) => count[b] - count[a])
    // the K body is the face (skin whenever it holds a fair share of the face fill, even under long hair); an A
    // panel holding hair and clothing together is cut in two along the fills
    const split = A ? ks.filter(k => count[k] / n > 0.06) : [!face && (count.skin || 0) / n > 0.15 ? 'skin' : ks[0]]
    for (const k of split) {
      let G = pc.F
      if (A) {
        G = F.copy(pc.F)
        for (let c = 0; c < F.NN; c++) if (grid[c] !== k && G[c] < 0.12) G[c] = 0.12
        G = F.exact(G, 2)
        if (F.inkArea(G) < 0.6) continue
      }
      const seam = pc.seam && split.length > 1 ? pc.seam.map(L => L.filter(q => grid[cellOf(q[0], q[1])] === k)).filter(L => L.length > 1) : pc.seam
      const np = { ...pc, F: G, seam, role: ROLE[k] || pc.role, ...(k === 'skin' ? skinFelt : other(k)) }
      if (k === 'skin' && !A && !face) {
        // the face panel holds every skin fill (a face the skeleton plates as A would otherwise be lost)
        face = np
        np.F = F.copy(np.F)
        for (const S of skinFills) F.union(np.F, S)
      }
      out.push(np)
    }
  }
  // embroidery on the face (the mouth, brows): ink on light skin, light thread on deep skin
  for (const pc of out) {
    if (pc.kind !== 'thread' || (pc.role !== 'edge' && pc.role !== 'ink')) continue
    const pts = pc.lines.flat()
    if (pts.length && pts.filter(q => own[cellOf(q[0], q[1])] === 'skin').length / pts.length > 0.6) pc.role = deep ? 'edge' : 'ink'
  }
  // A lines lying on the bare face (glasses frames and bridge): embroidered in ink over the face
  const onFace = (icon.paths || []).filter(p => p.plate === 'A').flatMap(p => subsOf(p.d)).map(sp => sp.pts.length ? (sp.closed ? [...sp.pts, sp.pts[0]] : sp.pts).map(T) : null)
    .filter(L => L && L.length > 1 && L.filter(q => own[cellOf(q[0], q[1])] === 'skin' && !ag[cellOf(q[0], q[1])]).length / L.length > 0.85)
  if (onFace.length) out.push(Kit.thread(onFace, { w: 1.05, role: 'ink', part: 'A' }))
  if (out.length) out[0] = { ...out[0], groundRole: 'ink' }
  return out
}

// fallback hexes: the person's natural felt colours (role variables stay, so a palette recolours them)
export function personHex(icon) {
  if (!isPerson(icon)) return null
  const t = tones(icon)
  // felt is a touch softer and warmer than a photo: hair lifted a hair so the piping still shows round it
  return { c1: t.c1, tint: t.tint, shadow: t.shadow, c2: mix(t.c2, '#FFFFFF', 0.06), c3: t.c3, c4: t.c4 }
}
export function recolor(nodes, icon) {
  const hx = personHex(icon)
  if (!hx) return nodes
  const re = /var\(--with-plush-(c1|c2|c3|c4|tint|shadow), #[0-9A-Fa-f]{6}\)/g
  const fix = v => typeof v === 'string' ? v.replace(re, (m, r) => `var(--with-plush-${r}, ${hx[r]})`) : v
  const walk = n => Array.isArray(n) ? n.map((x, i) => i === 1 && x && typeof x === 'object' && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, fix(v)])) : walk(x)) : n
  return nodes.map(walk)
}
