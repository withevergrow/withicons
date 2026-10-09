// GOTHIC paint: turns a scene (a list of material parts) into IconNodes.
//
// A scene is painted back to front. Every part is a signed distance field (see
// _gothic-field.mjs) plus a material:
//
//   stone   carved limestone: lit chamfer upper-left, shaded bevel lower-right, mortar joints
//           (ashlar courses on slabs, block joints across tubes)
//   glass   stained glass in a jewel colour: dark vignette by the lead, a soft inner glow,
//           a glint, and tracery leads (quarry diamonds, rose spokes, lancet bars, a medallion)
//   gilt    gilded metal: gold face, shaded bevel, bright chamfer and a specular glint
//   iron    wrought iron: dark face with a cool lit chamfer (reads on dark grounds)
//   recess  a deep opening: dark well, optionally lit from within (candle glow)
//   lead    free lead lines (stroked)
//   cut     not painted: knocks its field out of every part before it (a moat)
//
// Every part gets an ink outline first, so a later part's outline lies over the earlier
// faces as a lead came: the stained-glass and stonework read comes from that order.
// Light comes from the upper-left. Every colour is a role-named CSS variable.
//
// Motion parts (forge/MOTION.md): every node is tagged. The cast shadow is wm-shadow, a
// part's nodes carry its plate (wm-k / wm-a / wm-s), decoration is wm-deco, and the
// glints are wm-shine.
import * as F from './_gothic-field.mjs'
import { ringsD } from './_gothic-path.mjs'
import { area, simplify } from '../kernel/geom.mjs'

// palette role -> default (CSS variable --with-gothic-<role>)
export const PALETTE = {
  ink: '#221A26',    // lead cames, iron, outlines
  c1: '#B3163B',     // ruby glass
  c2: '#2552B4',     // sapphire glass
  c3: '#E6A421',     // gold (silver-stain yellow) glass
  c4: '#1C8A5F',     // emerald glass
  tint: '#D3CDC0',   // limestone face (weathered, cool)
  accent: '#C79A38', // gilded metal
  shadow: '#140F18', // cast shadow, glass vignette, gilt shade
  shine: '#FFF6DE',  // candlelight: chamfers, glow, glints
  edge: '#837A6F',   // stone shade bevel, mortar joints, iron chamfer
}
export const ROLES = Object.keys(PALETTE)
// a person avatar's own natural defaults (skin c1, hair c2, clothing c4: forge/styles/_people.mjs), set while it renders
let OV = null
export const setDefaults = o => { OV = o || null }
export const col = r => `var(--with-gothic-${r}, ${(OV && OV[r]) || PALETTE[r] || PALETTE.ink})`

export const K = {
  OL: 0.42,      // outline (lead) width around every part
  LW: 0.27,      // tracery lead width
  JW: 0.26,      // mortar joint width
  SHADOW: [0.45, 0.75],
  REACH: 1.8,    // exact distance reach
  M: 0.8,        // build margin
}
const D = 0.7071

// ---------------------------------------------------------------------------
// field helpers
export const mv = (Fd, dx, dy) => F.shift(Fd, Math.round(dx / F.H), Math.round(dy / F.H), 1)
export const minus = (A, B) => F.subtractOf(A, B)
export const grow = (Fd, e) => F.offsetOf(Fd, -e)
export const erode = (Fd, e) => F.offsetOf(Fd, e)
export const empty = Fd => !Fd || !F.any(Fd)
export const exact = (Fd, reach = K.REACH) => F.any(Fd) ? F.redistance(Fd, F.contour(Fd).map(l => simplify(l, 0.006, true)), reach) : Fd
export function at(Fd, p) {
  const i = Math.round(p[0] / F.H), j = Math.round(p[1] / F.H)
  if (i < 0 || j < 0 || i >= F.N || j >= F.N) return 9
  return Fd[j * F.N + i]
}
export function unionAll(fs) {
  const live = fs.filter(Boolean)
  if (!live.length) return F.field(K.M)
  const u = F.copy(live[0])
  for (let i = 1; i < live.length; i++) F.union(u, live[i])
  return u
}
// inscribed centre and radius of a shape (exact field): the deepest point
const INS = new WeakMap()
export function inscribed(Fd) {
  if (INS.has(Fd)) return INS.get(Fd)
  const Dd = F.depth(Fd)
  let m = 0, a = 0
  for (let k = 0; k < Dd.length; k++) { if (Dd[k] > m) m = Dd[k]; if (Dd[k] > 0) a++ }
  let res = null
  if (m > 0) {
    let sx = 0, sy = 0, n = 0
    for (let k = 0; k < Dd.length; k++) if (Dd[k] >= m - 0.06) { const i = k % F.N; sx += i; sy += (k - i) / F.N; n++ }
    res = { c: [sx / n * F.H, sy / n * F.H], r: m, area: a * F.H * F.H }
  }
  INS.set(Fd, res)
  return res
}
// the pieces of a polyline that lie inside a shape (field < -inset)
export function clipLine(Fd, pts, inset = 0) {
  const out = []
  let cur = null
  for (let k = 0; k + 1 < pts.length; k++) {
    const a = pts[k], b = pts[k + 1]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / 0.08))
    for (let s = k ? 1 : 0; s <= n; s++) {
      const p = [a[0] + (b[0] - a[0]) * s / n, a[1] + (b[1] - a[1]) * s / n]
      if (at(Fd, p) < -inset) { if (!cur) { cur = [p]; out.push(cur) } else cur.push(p) }
      else cur = null
    }
  }
  return out.map(l => simplify(l, 0.02, false)).filter(l => l.length > 1 && Math.hypot(l.at(-1)[0] - l[0][0], l.at(-1)[1] - l[0][1]) > 0.35)
}

// ---------------------------------------------------------------------------
// tracery generators: lead lines (polylines) for a pane, and optional medallion
const RAY = (c, deg, r0, r1) => { const a = deg * Math.PI / 180, x = Math.cos(a), y = Math.sin(a); return [[c[0] + x * r0, c[1] + y * r0], [c[0] + x * r1, c[1] + y * r1]] }
export function circlePts(cx, cy, r, n = 0) {
  const m = n || Math.max(16, Math.ceil(r * 10))
  const out = []
  for (let k = 0; k <= m; k++) { const a = 2 * Math.PI * k / m; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) }
  return out
}
// quarry glazing: two families of parallel leads crossing in diamonds
function quarry(c, s = 2.7, deg = 62) {
  const out = []
  for (const sg of [1, -1]) {
    const a = sg * deg * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx
    for (let k = -9; k <= 9; k++) {
      const ox = c[0] + nx * (k + 0.5) * s, oy = c[1] + ny * (k + 0.5) * s
      out.push([[ox - dx * 30, oy - dy * 30], [ox + dx * 30, oy + dy * 30]])
    }
  }
  return out
}
// the diamonds of a quarry lattice sorted into light / dark / plain by a fixed hash, as
// signed fields (distance to the cell's leads), so each set traces as clean rhombi
function quarryCells(c, s = 2.7, deg = 62) {
  const a1 = deg * Math.PI / 180, a2 = -a1
  const n1 = [-Math.sin(a1), Math.cos(a1)], n2 = [-Math.sin(a2), Math.cos(a2)]
  const Lt = F.field(1), Dk = F.field(1)
  for (let j = 0; j < F.N; j++) for (let i = 0; i < F.N; i++) {
    const x = i * F.H - c[0], y = j * F.H - c[1]
    const u = (x * n1[0] + y * n1[1]) / s + 0.5, v = (x * n2[0] + y * n2[1]) / s + 0.5
    const iu = Math.floor(u), iv = Math.floor(v), fu = u - iu, fv = v - iv
    const d = Math.min(fu, 1 - fu, fv, 1 - fv) * s
    const h = ((iu * 73856093) ^ (iv * 19349663)) >>> 0
    const k = h % 5
    const q = j * F.N + i
    if (k === 0 || k === 3) Lt[q] = -d; else Lt[q] = d
    if (k === 1) Dk[q] = -d; else Dk[q] = d
  }
  return [Lt, Dk]
}
function lancetBars(c, s = 2.6) {
  const out = []
  for (let k = -8; k <= 8; k++) out.push([[c[0] + (k + 0.5) * s, -2], [c[0] + (k + 0.5) * s, 26]])
  for (let k = -8; k <= 8; k++) out.push([[-2, c[1] + k * s * 1.6], [26, c[1] + k * s * 1.6]])
  return out
}

// ---------------------------------------------------------------------------
// output
let OUT, USED, CLS, TIER = 0, RANK = 0, RANKS, KINDS, KIND = 0, KB = 0, TXT = false
// Live lettering never counts toward the size budget: what texture a Live icon keeps must not change with its value
const TXTN = new WeakSet()
const Q = [[0.04, 0.05, 2], [0.06, 0.08, 1], [0.09, 0.14, 1]]
function smooth(r) {
  const n = r.length
  if (n < 5) return r
  return r.map((p, i) => { const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4] })
}
const opv = op => String(Math.round(op * 100) / 100).replace(/^0\./, '.')
function add(Fd, role, op = 1, q = 0, cls = CLS) {
  if (!Fd) return
  const qq = Q[Math.min(2, q + (TIER > 1 ? 1 : 0))]
  const d = ringsD(F.contour(Fd).filter(l => l.length > 2 && Math.abs(area(l)) >= qq[1]).map(l => simplify(smooth(l), qq[0] * 0.3, true)).filter(l => l.length > 2), qq[0], qq[2])
  if (!d) return
  const a = { d, fill: col(role) }
  if (op < 1) a['fill-opacity'] = opv(op)
  if (cls) a.class = cls
  OUT.push(['path', a]); RANKS.push(RANK); KINDS.push(KB + KIND++); USED += d.length + 70
  if (TXT) TXTN.add(a)
}
const f2 = v => String(Math.round(v * 100) / 100).replace(/^(-?)0\./, '$1.')
function lines(polys, role, w, op = 1, cls = CLS) {
  const ps = polys.filter(p => p && p.length > 1)
  if (!ps.length) return
  const d = ps.map(p => 'M' + p.map(q => f2(q[0]) + ' ' + f2(q[1])).join('L')).join('')
  const a = { d, fill: 'none', stroke: col(role), 'stroke-width': f2(w), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  if (op < 1) a['stroke-opacity'] = opv(op)
  if (cls) a.class = cls
  OUT.push(['path', a]); RANKS.push(RANK); KINDS.push(KB + KIND++); USED += d.length + 150
  if (TXT) TXTN.add(a)
}

// a signed field negative in the upper-left part (fraction k) of each piece of Fd
const COMPS = new WeakMap()
function zone(Fd, k) {
  const Z = F.field(9)
  let cs = COMPS.get(Fd)
  if (!cs) { cs = F.components(Fd, true); COMPS.set(Fd, cs) }
  for (const c of cs) {
    const w = Math.max(0.5, c.x1 - c.x0), h = Math.max(0.5, c.y1 - c.y0)
    for (const q of c.cells) {
      const i = q % F.N, j = (q - i) / F.N
      Z[q] = (((i * F.H - c.x0) + (j * F.H - c.y0)) - k * (w + h)) * D
    }
  }
  return Z
}

// ---------------------------------------------------------------------------
// materials
function glint(Fd, e = 0.55, k = 0.42, op = 0.8) {
  const E = erode(Fd, e)
  if (empty(E)) return
  const sk = minus(E, mv(E, 0.42 * D, 0.42 * D))
  F.intersect(sk, zone(Fd, k))
  add(sk, 'shine', op, 0, CLS === 'wm-deco' || CLS === 'wm-shadow' ? CLS : 'wm-shine')
}
function bevel(Fd, shadeRole, shadeOp, lightRole, lightOp, s = 0.5, l = 0.3) {
  add(minus(Fd, mv(Fd, -s * D, -s * D)), shadeRole, shadeOp, 1)
  add(minus(Fd, mv(Fd, l * D, l * D)), lightRole, lightOp, 1)
}

// a wide soft band along the lower-right edges: the side of a piece turned away from the light
const shade = (Fd, s) => minus(Fd, mv(Fd, -s * D, -s * D))
// the width of the volume band: a share k of the piece's half-thickness, at most m
const band = (Fd, k, m) => { const i = inscribed(Fd); return Math.max(0.5, Math.min(m, (i ? i.r : 1) * k)) }
// ink area (u^2): small pieces (studs, pins, fine bars) skip the volume band
const inkArea = Fd => { let a = 0; for (let i = 0; i < Fd.length; i++) if (Fd[i] < 0) a++; return a * F.H * F.H }
function stone(p) {
  const Fd = p.F
  add(Fd, p.role || 'tint')
  // weathered volume: the face turned from the candle is a shade darker
  if (!p.thin && inkArea(Fd) > 6) { RANK = 1; add(shade(Fd, band(Fd, 0.9, 1.4)), 'edge', 0.22, 2); RANK = 0 }
  bevel(Fd, 'edge', 1, 'shine', 0.9, p.thin ? 0.44 : 0.68, p.thin ? 0.24 : 0.34)
  // mortar joints
  const J = []
  if (p.ashlar) {
    const inner = erode(Fd, 0.45)
    const [y0, y1, rh] = [p.ashlar.y0 ?? 0, p.ashlar.y1 ?? 24, p.ashlar.h || 2.2]
    for (let y = y0 + rh, row = 0; y < y1 - 0.4; y += rh, row++) J.push(...clipLine(inner, [[0, y], [24, y]]))
    let row = 0
    for (let y = y0; y < y1 - 0.3; y += rh, row++) {
      const off = row % 2 ? (p.ashlar.w || 3.2) / 2 : 0
      for (let x = (p.ashlar.x || 0) + off; x < 24; x += p.ashlar.w || 3.2)
        J.push(...clipLine(inner, [[x, y + 0.15], [x, Math.min(y + rh, y1) - 0.15]]))
    }
  }
  if (p.ticks) for (const t of p.ticks) J.push(...clipLine(erode(Fd, 0.3), t))
  RANK = 2
  if (J.length) lines(J, 'edge', K.JW, 0.95)
  RANK = 0
}
function glass(p) {
  const Fd = p.F, role = p.role || 'c2'
  KIND = 1
  add(Fd, role)
  // vignette by the lead, then the light pooling in the upper-left of the pane
  KIND = 2; RANK = 3
  add(minus(Fd, erode(Fd, 0.75)), 'shadow', p.dark ?? 0.3, 2)
  const g = p.glow ?? 0.16
  RANK = 1; KIND = 3
  add(F.intersect(erode(Fd, 0.55), zone(Fd, 0.55)), 'shine', g, 2)
  add(F.intersect(erode(Fd, 0.9), zone(Fd, 0.3)), 'shine', g, 2)
  RANK = 0
  KIND = 5
  if (p.deep) add(Fd, 'shadow', p.deep, 2)
  KIND = 6
  RANK = 2
  tracery(p)
  RANK = 0
  KIND = 40; RANK = 3
  if (p.glint !== false) glint(Fd, 0.5, 0.4, 0.75)
  RANK = 0
}
function gilt(p) {
  const Fd = p.F
  add(Fd, p.role || 'accent')
  // burnished: the far side of the metal turns dark
  if (!p.thin && inkArea(Fd) > 5) { RANK = 1; add(shade(Fd, band(Fd, 0.7, 1.2)), 'shadow', 0.16, 2); RANK = 0 }
  // lettering (p.letter) is set on deep glass: a light shade only, so every stroke stays bright edge to edge
  if (p.letter) { add(Fd, 'shine', 0.3); bevel(Fd, 'shadow', 0.22, 'shine', 0.9, 0.18, 0.2) }
  else bevel(Fd, 'shadow', 0.45, 'shine', 0.9, p.thin ? 0.35 : 0.52, p.thin ? 0.2 : 0.28)
  if (p.glint !== false) glint(Fd, p.thin ? 0.25 : 0.4, 0.5, 0.9)
}
function iron(p) {
  const Fd = p.F
  add(Fd, p.role || 'ink')
  add(minus(Fd, mv(Fd, 0.3 * D, 0.3 * D)), 'edge', 1, 1)
}
function recess(p) {
  const Fd = p.F
  add(Fd, 'ink')
  if (p.glow) {
    const G = F.intersect(mv(erode(Fd, 0.35), 0, 0.25), erode(Fd, 0.3))
    add(G, p.glow, p.glowOp ?? 0.55, 1)
  }
}

// tracery inside a glass pane: lead lines and an optional medallion (a nested pane)
function tracery(p) {
  const kind = p.tracery || 'none'
  if (kind === 'none') return
  const Fd = p.F
  const ins = p.at ? { c: p.at.c, r: p.at.r, area: 0 } : inscribed(Fd)
  if (!ins || ins.r < 1.15) return
  const c = ins.c, r = ins.r
  let L = []
  let med = null
  const medRole = p.medal || 'c3'
  if (kind === 'rose') {
    const n = p.n || (r > 4.5 ? 12 : 8), r0 = Math.max(1.1, r * 0.4)
    for (let k = 0; k < n; k++) L.push(RAY(c, (p.rot ?? -90) + 360 * k / n, r0, 30))
    L.push(circlePts(c[0], c[1], r0))
    if (r > 4.2) L.push(circlePts(c[0], c[1], r * 0.78))
    med = F.region([circlePts(c[0], c[1], r0 - 0.05).slice(0, -1)], K.M)
  } else if (kind === 'quarry') {
    L = quarry(c, p.s || 2.7)
    if (r >= 2.9 && p.medallion !== false) med = foil(c[0], c[1], Math.min(r * 0.72, 3.6), 4)
  } else if (kind === 'lancet') {
    L = lancetBars(c, p.s || 2.6)
  } else if (kind === 'medallion') {
    if (r >= 2.2) med = foil(c[0], c[1], Math.min(r * 0.78, 3.8), p.lobes || 4)
  } else if (Array.isArray(kind)) L = kind
  let clip = Fd
  if (med) { F.intersect(med, erode(Fd, 0.55)); if (empty(med)) med = null }
  if (med) clip = minus(Fd, grow(med, 0.15))
  if (kind === 'quarry') {
    RANK = 1
    const [Lt, Dk] = quarryCells(c, p.s || 2.7)
    add(F.intersect(Lt, clip), 'shine', 0.13, 2)
    add(F.intersect(Dk, clip), 'shadow', 0.14, 2)
    RANK = 2
  }
  const segs = L.flatMap(l => clipLine(clip, l, 0.05))
  KIND = 9
  if (segs.length) lines(segs, 'ink', p.lw || K.LW, 0.9)
  if (med) {
    const M = exact(med)
    KIND = 10
    add(grow(M, 0.32), 'ink')
    const kb = KB
    KB += 10
    glass({ F: M, role: medRole, tracery: 'none', glow: 0.24, glint: false })
    KB = kb; KIND = 30
    if (r > 3.4) add(F.region([circlePts(c[0], c[1], 0.55).slice(0, -1)], K.M), 'accent')
  }
}
// an n-lobed foil (trefoil, quatrefoil, cinquefoil) of outer radius R, as a field
export function foil(cx, cy, R, n = 4, rot = -90) {
  // lobe radius: neighbouring lobes just overlap, leaving a cusp between them
  const rl = R * (n === 3 ? 0.48 : n === 4 ? 0.42 : 0.36)
  const d = R - rl
  const rings = []
  for (let k = 0; k < n; k++) {
    const a = (rot + 360 * k / n) * Math.PI / 180
    rings.push(circlePts(cx + d * Math.cos(a), cy + d * Math.sin(a), rl).slice(0, -1))
  }
  const f = F.field(K.M)
  for (const r of rings) F.region([r], K.M, f)
  F.region([circlePts(cx, cy, d).slice(0, -1)], K.M, f)
  return f
}

const MAT = { stone, glass, gilt, iron, recess }

// ---------------------------------------------------------------------------
// paint a scene
// 'ground': architecture the object stands in (a belfry arch, a niche): it stays put like
// the cast shadow (wm-shadow), never twinkles or floats like decoration
const PLATE = { K: 'wm-k', A: 'wm-a', S: 'wm-s', deco: 'wm-deco', ground: 'wm-shadow' }
const BUDGET = 10000
export function paint(parts0, o = {}) {
  // resolve cuts (moats) into the parts before them; make every field exact
  const parts = []
  for (const p of parts0) {
    if (!p) continue
    if (p.m === 'cut') { for (const q of parts) if (q.F) q.F = minus(q.F, p.F); continue }
    parts.push({ ...p })
  }
  for (const p of parts) if (p.F) p.F = exact(p.F)
  const live = parts.filter(p => p.m === 'lead' ? p.lines && p.lines.length : !empty(p.F))
  OUT = []; RANKS = []; KINDS = []; USED = 0; RANK = 0; KB = 0
  paintAll(live, o)
  // over budget: drop texture, finest first (glow and quarry shading, then joints and tracery)
  let res = OUT.map((n, i) => [n, RANKS[i]])
  const size = ns => ns.reduce((a, n) => a + (TXTN.has(n[0][1]) ? 0 : n[0][1].d.length + 70), 0)
  for (const r of [1, 2, 3]) {
    if (size(res) <= BUDGET) break
    res = res.filter(n => n[1] !== r)
  }
  return res.map(n => n[0])
}
function paintAll(parts, o) {
  // cast shadow under the object (decoration casts its own, lighter)
  const obj = parts.filter(p => p.plate !== 'deco' && p.F && !p.noShadow)
  if (obj.length && !o.noShadow) {
    CLS = 'wm-shadow'
    const S = grow(unionAll(obj.map(p => p.F)), K.OL)
    add(mv(S, K.SHADOW[0], K.SHADOW[1]), 'shadow', 0.2, 2)
  }
  let run = null
  const flush = () => {
    if (!run) return
    // a run of disjoint parts: order layers by kind across the run, then merge equal paints
    const idx = []
    for (let i = run; i < OUT.length; i++) idx.push(i)
    idx.sort((a, b) => KINDS[a] - KINDS[b] || a - b)
    const nodes = idx.map(i => [OUT[i], RANKS[i]])
    const merged = []
    for (const [n, r] of nodes) {
      const last = merged.at(-1)
      if (last && last[1] === r && sameAttrs(last[0][1], n[1])) last[0] = ['path', { ...last[0][1], d: last[0][1].d + n[1].d }]
      else merged.push([n, r])
    }
    OUT.length = run; RANKS.length = run; KINDS.length = run
    for (const [n, r] of merged) { OUT.push(n); RANKS.push(r); KINDS.push(0) }
    run = null
  }
  let key = null
  for (const p of parts) {
    if (!p.batch || p.batch !== key) { flush(); key = p.batch || null; if (key) run = OUT.length }
    KIND = 0; KB = 0
    CLS = PLATE[p.plate || 'K']
    TXT = !!p.text
    if (p.m === 'lead') { lines(p.lines, p.role || 'ink', p.w || K.LW, p.op ?? 1); continue }
    if (p.m === 'shine') { add(p.F, 'shine', p.op ?? 0.7, 1, p.plate === 'deco' || p.plate === 'ground' ? PLATE[p.plate] : 'wm-shine'); continue }
    if (p.m === 'paint') { add(p.F, p.role || 'ink', p.op ?? 1, 1); continue }
    if (p.outline !== 0) add(grow(p.F, p.outline ?? K.OL), 'ink')
    KIND = 1
    const f = MAT[p.m] || stone
    f(p)
  }
  flush()
  TXT = false
}
function sameAttrs(a, b) {
  const ka = Object.keys(a), kb = Object.keys(b)
  if (ka.length !== kb.length) return false
  for (const k of ka) if (k !== 'd' && a[k] !== b[k]) return false
  return true
}
