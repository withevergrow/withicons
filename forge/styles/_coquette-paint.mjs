// COQUETTE paint: turns a list of PARTS (signed distance fields + a material) into
// IconNodes. Every part is painted the same way, so a hand-composed redraw and the
// automatic path share one finish:
//
//   SHADOW  the union of every part, cast softly down (wm-shadow, rose, low opacity)
//   per part, back to front:
//     BASE    the silhouette in the material's base colour
//     SHADE   a crescent along the lower-right edge (the side turned from the light)
//     SATIN   two inset contours nudged toward the light, stacked at low opacity: a
//             smooth satin ramp from geometry alone
//     SHEEN   a crisp tapered sickle inside the upper-left edge (wm-shine)
//     LINE    a fine wine-berry outline (inside the silhouette) and any inner detail
//
// Light comes from the upper-left. Every colour is a role-named variable
// --with-coquette-<role> (forge/lib/palette-map.mjs). No defs, ids, gradients, filters,
// masks or strokes: every layer is real filled geometry.
import { simplify } from '../kernel/geom.mjs'
import * as F from './_coquette-field.mjs'
import { ringsD } from './_coquette-path.mjs'

export const PALETTE = {
  ink: '#7E2443',    // wine-berry outline and fine detail
  c1: '#F8BCCB',     // blush pink: the object
  c2: '#EC8DA6',     // rose: secondary parts, the shade on blush
  c3: '#D7385F',     // ribbon red: bows, hearts, badges
  c4: '#FCEADD',     // cream: paper, inner panels, pearls
  tint: '#FFE4EB',   // light satin: the highlight ramp
  accent: '#D9A45B', // delicate gold: clasps, handles, chains, sparkles
  shadow: '#A8345C', // rose shadow (painted at low opacity)
  shine: '#FFFFFF',  // specular sheen
  edge: '#FFFBF6',   // lace white
}
export const ROLES = Object.keys(PALETTE)
export const col = r => `var(--with-coquette-${r}, ${PALETTE[r] || PALETTE.ink})`

// Materials: which roles paint each layer.
//   base  the body; shade/shadeOp the turned-away crescent; ramp/rampOp the satin
//   inset; sheen/sheenOp the highlight sickle; line the outline role; ow outline width
export const MATS = {
  blush:  { base: 'c1', shade: 'c2', shadeOp: 0.62, ramp: 'tint', rampOp: 0.75, sheen: 'shine', sheenOp: 0.95, line: 'ink' },
  rose:   { base: 'c2', shade: 'c3', shadeOp: 0.34, ramp: 'c1', rampOp: 0.6, sheen: 'shine', sheenOp: 0.85, line: 'ink' },
  ribbon: { base: 'c3', shade: 'ink', shadeOp: 0.34, ramp: 'c2', rampOp: 0.5, sheen: 'shine', sheenOp: 0.8, line: 'ink' },
  cream:  { base: 'c4', shade: 'c1', shadeOp: 0.85, ramp: 'edge', rampOp: 0.85, sheen: 'shine', sheenOp: 0.9, line: 'ink' },
  gold:   { base: 'accent', shade: 'ink', shadeOp: 0.26, ramp: 'edge', rampOp: 0.38, sheen: 'shine', sheenOp: 0.9, line: 'ink' },
  pearl:  { base: 'c4', shade: 'c2', shadeOp: 0.5, ramp: 'edge', rampOp: 0.9, sheen: 'shine', sheenOp: 1, line: 'ink', ow: 0.6 },
  lace:   { base: 'edge', shade: 'c1', shadeOp: 0.55, ramp: null, sheen: null, line: 'ink', ow: 0.6 },
  // people avatars (_coquette-people.mjs): skin satin in the skin roles (c1, its light tint, its shade shadow), hair
  // satin (c2, shaded c3), clothing satin (c4) and the ribbon-red bow / headphone cups (accent)
  skin:   { base: 'c1', shade: 'shadow', shadeOp: 0.5, ramp: 'tint', rampOp: 0.8, sheen: 'shine', sheenOp: 0.6, line: 'ink' },
  hair:   { base: 'c2', shade: 'c3', shadeOp: 0.6, ramp: 'edge', rampOp: 0.16, sheen: 'shine', sheenOp: 0.55, line: 'ink' },
  cloth:  { base: 'c4', shade: 'ink', shadeOp: 0.2, ramp: 'edge', rampOp: 0.45, sheen: 'shine', sheenOp: 0.85, line: 'ink' },
  bowp:   { base: 'accent', shade: 'ink', shadeOp: 0.3, ramp: 'edge', rampOp: 0.3, sheen: 'shine', sheenOp: 0.8, line: 'ink' },
  // flat: no shading at all (tiny glyphs, text, the inside of a badge)
  flat:   { base: 'c4', shade: null, ramp: null, sheen: null, line: null },
}

const CLASS = { K: 'wm-k', A: 'wm-a', S: 'wm-s', deco: 'wm-deco' }
const REACH = 2.1

const loops = Fd => F.contour(F.copy(Fd)).map(l => simplify(l, 0.015, true))
// exact signed distance (needed before any erosion)
export const exact = (Fd, reach = REACH) => F.any(Fd) ? F.redistance(Fd, loops(Fd), reach) : Fd
export const minus = (A, B) => F.subtract(F.copy(A), B)
export const mv = (Fd, dx, dy) => F.shift(Fd, Math.round(dx / F.H), Math.round(dy / F.H), REACH)
export const erode = (Fd, e) => F.offset(F.copy(Fd), e)
// ink area of a field (u^2) and its bounding box
export function measure(Fd) {
  let n = 0, x0 = 99, y0 = 99, x1 = -99, y1 = -99
  for (let j = 0; j < F.N; j++) for (let i = 0; i < F.N; i++) if (Fd[j * F.N + i] < 0) {
    n++; const x = i * F.H, y = j * F.H
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y
  }
  return { area: n * F.H * F.H, box: [x0, y0, x1, y1] }
}
// largest inscribed radius (how thick the part is)
const thick = E => { let m = 0; for (let i = 0; i < E.length; i++) if (-E[i] > m) m = -E[i]; return m }

function d(Fd, tol = 0.04, minArea = 0.12) {
  const rings = F.contour(F.copy(Fd)).map(l => simplify(l, 0.018, true)).filter(l => l.length > 2 && Math.abs(areaOf(l)) >= minArea)
  return rings.length ? ringsD(rings, tol) : ''
}
const areaOf = r => { let a = 0; for (let i = 0; i < r.length; i++) { const p = r[i], q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1] } return a / 2 }

// ---------------------------------------------------------------------------
// one part -> layers [{role, op, d, cls}]
function layersOf(p) {
  const out = []
  const E = p.E
  let m = MATS[p.mat]
  if (!m) m = p.mat === 'inkflat' ? { base: 'ink' } : String(p.mat).startsWith('fill:') ? { base: p.mat.slice(5) } : MATS.blush
  if (p.flat && p.flatRole) m = { ...m, base: p.flatRole }
  const cls = CLASS[p.plate] || 'wm-k'
  const t = thick(E)
  const push = (role, Fd, op = 1, c = cls, tol, minA) => { if (!role) return; const s = d(Fd, tol, minA); if (s) out.push({ role, op, d: s, cls: c }) }
  let ow = p.ow != null ? p.ow : m.ow != null ? m.ow : t > 1.6 ? 0.64 : t > 0.95 ? 0.55 : 0.42
  if (!m.line || p.flat && p.ow == null) ow = 0
  ow = Math.min(ow, t * 0.7)
  // the silhouette in the line colour, the body inset by the line width on top of it:
  // one contour each, and the outline comes for free
  const B = ow > 0 ? erode(E, ow) : E
  if (ow > 0) push(p.lineRole || m.line, E, 1, cls, 0.035, 0.05)
  push(m.base, B, p.op || 1, cls, 0.035, 0.05)
  if (!p.flat && F.any(B)) {
    const tb = t - ow
    // shade: what the body loses when it moves toward the light
    const k = Math.min(1, Math.max(0.35, tb / 1.8))
    if (m.shade && !p.noShade) push(m.shade, minus(B, mv(B, -0.5 * k, -0.8 * k)), m.shadeOp, cls, 0.06, 0.15)
    // satin ramp: inset contours nudged toward the light
    if (m.ramp && tb > 0.8) {
      const r1 = F.intersect(mv(erode(B, Math.min(0.9, tb * 0.4)), -0.3, -0.45), erode(B, 0.15))
      push(m.ramp, r1, m.rampOp * 0.55, cls, 0.07, 0.4)
      if (tb > 1.8) {
        const r2 = F.intersect(mv(erode(B, tb * 0.6), -0.55, -0.8), erode(B, 0.45))
        push(m.ramp, r2, m.rampOp * 0.6, cls, 0.07, 0.4)
      }
    }
    // sheen: a tapered sickle inside the upper-left edge
    if (m.sheen && tb > 0.45) {
      const I = erode(B, Math.min(0.3, tb * 0.3))
      const sw = Math.min(0.75, tb * 0.4)
      const S = minus(I, mv(I, 0.55 * sw / 0.6, 0.8 * sw / 0.6))
      // keep it to the upper-left, fading out round-ended inside an oval centred on
      // the lit corner (no hard cut), then round its tips
      const b = p.box, w = b[2] - b[0], h = b[3] - b[1]
      clipOval(S, b[0] + w * 0.3, b[1] + h * 0.3, w * 0.62 + 0.3, h * 0.62 + 0.3, p.sheenBias || 0)
      const Sr = S
      if (p.area > 30) roundTips(Sr, Math.min(0.14, sw * 0.3))
      push(m.sheen, S, m.sheenOp, 'wm-shine', 0.05, 0.12)
    }
  }
  if (p.detail) push(p.detailRole || 'ink', p.detail, 1, cls, 0.03, 0.05)
  return out
}
// keep only the part of S inside the oval (cx, cy, rx, ry), grown by bias
function clipOval(S, cx, cy, rx, ry, bias) {
  rx = Math.max(0.5, rx + bias); ry = Math.max(0.5, ry + bias)
  const r = Math.min(rx, ry)
  for (let j = 0; j < F.N; j++) for (let i = 0; i < F.N; i++) {
    const dx = (i * F.H - cx) / rx, dy = (j * F.H - cy) / ry
    const v = (Math.sqrt(dx * dx + dy * dy) - 1) * r
    const k = j * F.N + i
    if (v > S[k]) S[k] = v
  }
}
// round the tips of a thin band (morphological opening, exact)
function roundTips(S, r) {
  if (r <= 0 || !F.any(S)) return S
  const E = exact(S, r + 0.25)
  F.offset(E, r)
  const G = exact(E, r + 0.25)
  F.offset(G, -r)
  S.set(G)
  return S
}

// ---------------------------------------------------------------------------
// parts -> IconNodes
//   part: { f, mat, plate: 'K'|'A'|'S'|'deco', ow?, flat?, detail? (field), detailRole?,
//           noShadow?, lineRole?, sheenBias? }
export function paint(parts, o = {}) {
  const live = []
  for (const p of parts) {
    if (!p || !p.f || !F.any(p.f)) continue
    const E = exact(p.f)
    const mm = measure(E)
    if (mm.area < 0.05) continue
    live.push({ ...p, E, box: mm.box, area: mm.area })
  }
  if (!live.length) return []
  const layers = []
  // cast shadow under the object (decorations cast their own, lighter)
  const obj = live.filter(p => !p.noShadow && p.plate !== 'deco')
  const deco = live.filter(p => !p.noShadow && p.plate === 'deco')
  const cast = (ps, op) => {
    if (!ps.length) return
    const U = F.field(REACH)
    for (const p of ps) F.union(U, p.E)
    const s1 = mv(U, 0.3, 0.75)
    const s = d(s1, 0.08, 0.3)
    if (s) layers.push({ role: o.cast || 'shadow', op, d: s, cls: 'wm-shadow' })
  }
  cast(obj, 0.2)
  cast(deco, 0.14)
  for (const p of live) layers.push(...layersOf(p))
  // merge runs of the same paint and class (z-order only matters across different paints)
  const nodes = []
  let last = null
  for (const L of layers) {
    if (last && last.role === L.role && last.op === L.op && last.cls === L.cls) { last.node[1].d += L.d; continue }
    const a = { d: L.d, fill: col(L.role) }
    if (L.op < 1) a['fill-opacity'] = +L.op.toFixed(2)
    a.class = L.cls
    const node = ['path', a]
    nodes.push(node)
    last = { ...L, node }
  }
  return nodes
}
