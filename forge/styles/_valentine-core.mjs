// VALENTINE core: skeleton -> IconNode list. See valentine.mjs for the concept.
//
// Layers, back to front:
//   HEARTS   1-3 little floating hearts in the free space round the glyph                           wm-deco
//   INLAY    cream paper inside the body's knockouts (a letter's lines, a door, a screen)          wm-k
//   BODY     the Solid mass (fills + round strokes, crisp knockouts) in a soft pink-to-red gradient
//            with a warm berry outline; A parts in chocolate, S badges in the heart red           wm-k / wm-a / wm-s
//   SHADE    a gentle shade band along the bottom-right inside every broad shape                    wm-shadow
//   DOTS     polka dots (gifts, boxes, balloons) or sprinkles (sweets) on a broad body            wm-shine
//   SHINE    a curved highlight stroke + a dot along the top-left inside every broad shape       wm-shine
//   FACE     two dot eyes, a smile and blush on round friendly objects (hearts, mugs, sweets)     wm-a
// Live icons (icon.params) keep the body, the outer outline and the badges only: their values stay clean.
import { solidPlates, LAST } from './_valentine-solid.mjs'
import * as F from './_valentine-sfield.mjs'
import { area, simplify, pointInSet } from '../kernel/geom.mjs'
import { setOf, intersectSets } from '../kernel/bool.mjs'
import { DEFAULT } from './_valentine-palettes.mjs'
import { TUNE, FACE, NO_FACE, SPRINKLES, VALENTINE, MATERIALS } from './_valentine-tune.mjs'
import { isPerson, personColors, personPaint } from './_valentine-people.mjs'

export const U = {
  INK: 0.72,        // outline width (centred on the edge)
  DEEP: 4.2,        // reach of the exact signed distance
  BROAD: 1.2,       // a part must be thicker than 2x this to get shade, shine and dots
  SHADE_IN: 0.36,   // the shade starts under the outline's inner edge ...
  SHADE_D: [0.45, 0.95], // ... and reaches this far in from the bottom-right edge (x, y)
  SHINE_IN: 1.15,    // the highlight runs this far inside the edge ...
  SHINE_W: 0.8,    // ... this thick
  HEART_INK: 0.45,  // floating hearts' outline
  RIM: 0.55,        // the cream die-cut rim outside the outline
}

// role variables (forge/PALETTES.md roles) with the "Classic love" defaults
export const C = Object.fromEntries(Object.entries(DEFAULT).map(([r, hex]) => [r, `var(--with-valentine-${r}, ${hex})`]))
const C0 = { ...C }

// ---------------------------------------------------------------------------
// compact path writing
export const num = v => {
  let s = String(Math.round(v * 100) / 100)
  if (s === '-0') s = '0'
  if (s.startsWith('0.')) s = s.slice(1)
  else if (s.startsWith('-0.')) s = '-' + s.slice(2)
  return s
}
const join = arr => arr.reduce((acc, s) => acc + (acc && !s.startsWith('-') ? ' ' : '') + s, '')
const pt = (x, y) => join([num(x), num(y)])
export function loopsD(loops) {
  let d = ''
  for (const r of loops) {
    if (r.length < 3) continue
    const R = r.map(p => [Math.round(p[0] * 100), Math.round(p[1] * 100)])
    const rel = []
    for (let q = 1; q < R.length; q++) {
      const dx = R[q][0] - R[q - 1][0], dy = R[q][1] - R[q - 1][1]
      if (!dx && !dy) continue
      rel.push(num(dx / 100), num(dy / 100))
    }
    d += 'M' + pt(R[0][0] / 100, R[0][1] / 100) + 'l' + join(rel) + 'z'
  }
  return d
}
function lineD(pts) {
  if (pts.length < 2) return ''
  const R = pts.map(p => [Math.round(p[0] * 100), Math.round(p[1] * 100)])
  const rel = []
  for (let q = 1; q < R.length; q++) {
    const dx = R[q][0] - R[q - 1][0], dy = R[q][1] - R[q - 1][1]
    if (dx || dy) rel.push(num(dx / 100), num(dy / 100))
  }
  return rel.length ? 'M' + pt(R[0][0] / 100, R[0][1] / 100) + 'l' + join(rel) : ''
}
export const f2 = v => +(+v).toFixed(2)
export const discD = (cx, cy, r) => `M${pt(cx - r, cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
const ellD = (cx, cy, rx, ry) => `M${pt(cx - rx, cy)}a${num(rx)} ${num(ry)} 0 1 0 ${num(2 * rx)} 0a${num(rx)} ${num(ry)} 0 1 0 ${num(-2 * rx)} 0z`
export function bboxOf(loops) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const l of loops) for (const [x, y] of l) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y }
  return isFinite(x0) ? [x0, y0, x1, y1] : [4, 4, 20, 20]
}
export function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }
function rngOf(seed) { let s = hash(seed) || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000 } }

// a heart centred on (cx, cy), half-width r, turned by rot degrees
const HEART = [[0, .9], [-.55, .5, -1, .1, -1, -.35], [-1, -.75, -.68, -.98, -.42, -.98], [-.2, -.98, -.05, -.85, 0, -.64],
  [.05, -.85, .2, -.98, .42, -.98], [.68, -.98, 1, -.75, 1, -.35], [1, .1, .55, .5, 0, .9]]
export function heartD(cx, cy, r, rot = 0) {
  const a = rot * Math.PI / 180, c = Math.cos(a), s = Math.sin(a)
  const P = (x, y) => pt(cx + (x * c - y * s) * r, cy + (x * s + y * c) * r)
  let d = 'M' + P(HEART[0][0], HEART[0][1])
  for (const q of HEART.slice(1)) d += 'C' + P(q[0], q[1]) + ' ' + P(q[2], q[3]) + ' ' + P(q[4], q[5])
  return d + 'z'
}

// ---------------------------------------------------------------------------
// field helpers (negative = ink)
const N = F.N, H = F.H, NN = N * N
const sAt = (G, x, y) => {
  const i = Math.round(x / H), j = Math.round(y / H)
  return (i < 0 || j < 0 || i >= N || j >= N) ? 9 : G[j * N + i]
}
const grad = (G, x, y) => {
  const gx = sAt(G, x + H, y) - sAt(G, x - H, y), gy = sAt(G, x, y + H) - sAt(G, x, y - H)
  const l = Math.hypot(gx, gy) || 1
  return [gx / l, gy / l]
}
// a field shifted by (dx, dy): out(p) = G(p + d)
function shifted(G, dx, dy, fill = 9) {
  const si = Math.round(dx / H), sj = Math.round(dy / H), out = new Float32Array(NN).fill(fill)
  for (let j = 0; j < N; j++) {
    const jj = j + sj
    if (jj < 0 || jj >= N) continue
    for (let i = 0; i < N; i++) { const ii = i + si; if (ii >= 0 && ii < N) out[j * N + i] = G[jj * N + ii] }
  }
  return out
}
const maxF = (...Gs) => { const out = new Float32Array(NN); for (let k = 0; k < NN; k++) { let v = -Infinity; for (const G of Gs) if (G[k] > v) v = G[k]; out[k] = v } return out }

// free space round the glyph (outside it, never in a hole)
function outsideMask(mass) {
  const out = new Uint8Array(NN), st = []
  const push = k => { if (!out[k] && mass[k] > 0) { out[k] = 1; st.push(k) } }
  for (let q = 0; q < N; q++) { push(q); push(NN - N + q); push(q * N); push(q * N + N - 1) }
  while (st.length) {
    const k = st.pop(), j = (k / N) | 0, i = k - j * N
    if (i > 0) push(k - 1); if (i < N - 1) push(k + 1); if (j > 0) push(k - N); if (j < N - 1) push(k + N)
  }
  return out
}
function freeSpots(sdf, mass, max, seed, minR = 1.15) {
  const O = outsideMask(mass)
  const at = (x, y) => {
    const i = Math.round(x / H), j = Math.round(y / H)
    if (i < 0 || j < 0 || i >= N || j >= N) return 3.3
    return O[j * N + i] ? Math.min(sdf[j * N + i], 3.3) : -1
  }
  const cands = []
  for (let y = 2.5; y <= 21.5; y += 0.25) for (let x = 2.5; x <= 21.5; x += 0.25) {
    const d = at(x, y)
    if (d < 1.7) continue
    const r = Math.min(d - 1.0, 1.75, x - 1.6, 22.4 - x, y - 1.6, 22.4 - y)
    if (r >= 1.0) cands.push({ x, y, r })
  }
  const out = []
  const r0 = rngOf(seed)
  const pref = r0() < 0.5 ? 1 : -1 // which top corner the first heart prefers
  while (out.length < max) {
    let best = null, bs = -Infinity
    for (const c of cands) {
      if (out.some(o => Math.hypot(c.x - o.x, c.y - o.y) < o.r + c.r + 2.2)) continue
      const s = c.r * 1.5 - 0.22 * Math.max(0, c.y - 12) + 0.04 * pref * (c.x - 12) + (out.length ? 0.05 * Math.min(...out.map(o => Math.hypot(c.x - o.x, c.y - o.y))) : 0)
      if (s > bs) { bs = s; best = c }
    }
    if (!best || (out.length && best.r < minR)) break
    out.push(best)
  }
  return out
}

// the deepest points of a field inside a mask (local maxima of depth, far apart)
function deepest(sdf, ok, count, minSep, cx = 12) {
  const out = []
  for (let n = 0; n < count; n++) {
    let best = 0, bx = 12, by = 12
    for (let j = 0; j < N; j += 2) for (let i = 0; i < N; i += 2) {
      const k = j * N + i, v = -sdf[k] - 0.07 * Math.abs(i * H - cx)
      if (v <= best || (ok && !ok(k))) continue
      const x = i * H, y = j * H
      if (out.some(o => Math.hypot(x - o.x, y - o.y) < Math.max(minSep, o.d * 2))) continue
      best = v; bx = x; by = y
    }
    if (best <= 0) break
    out.push({ x: bx, y: by, d: -sAt(sdf, bx, by) })
  }
  return out
}

// ---------------------------------------------------------------------------
// people avatars: natural skin (c1 lit by tint, shaded by shadow), natural hair (c2), a sweetheart top (c4),
// ink features with catch-lights and blush (edge), the white die-cut rim, little hearts in the top's colour.
// C is swapped for the call (synchronous, restored in finally) so every var() carries the person's defaults.
export function valentineNodes(icon) {
  const pc = !icon.params && isPerson(icon) ? personColors(icon) : null
  if (!pc) return nodes0(icon)
  for (const [k, v] of Object.entries(pc)) C[k] = `var(--with-valentine-${k}, ${v})`
  try { return person(icon) || nodes0(icon) } finally { Object.assign(C, C0) }
}

function person(icon) {
  const name = String(icon.name)
  const id = n => `wg-valentine-${name}-${n}`, url = n => `url(#${id(n)})`
  let plates = [], mass = null
  try { LAST.mass = null; plates = solidPlates(icon); mass = LAST.mass } catch { return null }
  const loops = plates.flatMap(p => p.loops)
  if (!loops.length || !mass) return null
  const pp = personPaint(icon, mass, loops, F)
  if (!pp.regions.length) return null
  const fig = pp.outline.length ? pp.outline : loops
  const [, y0, , y1] = bboxOf(fig)
  const st = (o, c, op) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': op }]
  const out = [['defs', {}, [
    ['linearGradient', { id: id(0), x1: 0, y1: f2(y0), x2: 0, y2: f2(y1), gradientUnits: 'userSpaceOnUse' },
      [st(0, C.tint, 0.55), st(0.35, C.tint, 0), st(0.62, C.shadow, 0), st(1, C.shadow, 0.4)]],
  ]]]
  const ink = { stroke: C.ink, 'stroke-width': U.INK, 'stroke-linejoin': 'round' }
  // the die-cut rim
  out.push(['path', { d: loopsD(fig), fill: 'none', stroke: C.shine, 'stroke-width': f2(U.INK + U.RIM * 2), 'stroke-linejoin': 'round', class: 'wm-k' }])
  // floating hearts in the top's colour
  try {
    const sdf = F.redistance(mass, loops, U.DEEP)
    const spots = freeSpots(sdf, mass, 1 + (hash(name + ':n') % 2), name, 1.4)
    const rr = rngOf(name + ':h')
    let d = ''
    spots.forEach((q, k) => { const r = Math.min(q.r, k ? 1.35 : 1.7) * 0.92; d += heartD(q.x, q.y + r * 0.05, r, (q.x < 12 ? -1 : 1) * (10 + rr() * 12)) })
    if (d) out.push(['path', { d, fill: C.c4, stroke: C.ink, 'stroke-width': U.HEART_INK, 'stroke-linejoin': 'round', class: 'wm-deco' }])
  } catch { /* no hearts */ }
  for (const r of pp.regions) {
    out.push(['path', { d: loopsD(r.loops), fill: C[r.role], 'fill-rule': 'evenodd', stroke: C.ink, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: r.role === 'c1' ? 'wm-k' : 'wm-a' }])
  }
  out.push(['path', { d: loopsD(fig), fill: url(0), 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  // blush under the eyes
  const eyes = pp.eyes
  if (eyes.length === 2) {
    const [a, b] = eyes[0].x < eyes[1].x ? eyes : [eyes[1], eyes[0]]
    out.push(['path', { d: ellD(a.x - 0.75, a.y + 1.75, 0.8, 0.45) + ellD(b.x + 0.75, b.y + 1.75, 0.8, 0.45), fill: C.edge, 'fill-opacity': 0.75, class: 'wm-a' }])
  }
  if (pp.features.length) out.push(['path', { d: loopsD(pp.features), fill: C.ink, class: 'wm-k' }])
  out.push(['path', { d: loopsD(fig), fill: 'none', ...ink, class: 'wm-k' }])
  const cl = eyes.map(e => discD(e.x + e.r * 0.3, e.y - e.r * 0.35, Math.max(0.2, Math.min(0.32, e.r * 0.4)))).join('')
  if (cl) out.push(['path', { d: cl, fill: C.shine, class: 'wm-shine' }])
  return out
}

function nodes0(icon) {
  const name = String(icon.name || 'icon')
  const mat = (MATERIALS.find(([re]) => re.test(name)) || [0, {}])[1]
  const tune = { ...mat, ...(TUNE[name] || {}) }
  const id = n => `wg-valentine-${name}-${n}`, url = n => `url(#${id(n)})`
  // paths this style redraws itself (champagne's plus sparkles become hearts)
  const icon0 = icon
  if (tune.hide && !icon.params) {
    const ids = new Set(tune.hide.map(q => pick(icon0, q)).filter(p => p && p.id).map(p => p.id))
    icon = { ...icon, paths: icon.paths.filter(p => !ids.has(p.id)), lines: (icon.lines || []).filter(l => !ids.has(l.pathId)) }
  }
  let plates = [], mass = null
  try { LAST.mass = null; plates = solidPlates(icon); mass = LAST.mass } catch { plates = []; mass = null }
  const loops = plates.flatMap(p => p.loops)
  if (!loops.length) return fallback(icon)
  const live = !!icon.params
  const fest = VALENTINE.has(name)
  const [x0, y0, x1, y1] = live ? [3, 3, 21, 21] : bboxOf(loops)
  const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
  const defs = ['defs', {}, [
    ['linearGradient', { id: id(0), x1: f2((x0 + x1) / 2 - 2), y1: f2(y0), x2: f2((x0 + x1) / 2 + 2), y2: f2(y1), gradientUnits: 'userSpaceOnUse' },
      [st(0, C.c1), st(0.4, C.c1), st(1, C.c2)]],
  ]]
  const out = [defs]
  const ink = { stroke: C.ink, 'stroke-width': U.INK, 'stroke-linejoin': 'round' }
  const back = [], front = []

  let sdf = null
  try { if (mass) sdf = F.redistance(mass, loops, U.DEEP) } catch { sdf = null }

  // a cream die-cut rim round every piece: the sticker edge that lifts the berry outline off a dark page
  if (!live) for (const p of plates) {
    const cls = p.plate === 'A' ? 'wm-a' : p.plate === 'S' ? 'wm-s' : 'wm-k'
    back.push(['path', { d: loopsD(p.loops), fill: 'none', stroke: C.c4, 'stroke-width': f2(U.INK + U.RIM * 2), 'stroke-linejoin': 'round', class: cls }])
  }

  // floating hearts behind everything
  if (sdf && !live && tune.hearts !== 0) {
    try {
      const h = hash(name + ':n'), dense = (icon.paths || []).length > 6
      const max = tune.hearts ?? (fest ? 2 + h % 2 : dense ? 0 : 1 + (h % 3 === 0 ? 1 : 0))
      const spots = max ? freeSpots(sdf, mass, max, name, fest ? 1.1 : 1.4) : []
      const rr = rngOf(name + ':h')
      let d = ''
      spots.forEach((s, k) => {
        const r = Math.min(s.r, k ? 1.35 : 1.7) * 0.92
        d += heartD(s.x, s.y + r * 0.05, r, (s.x < 12 ? -1 : 1) * (10 + rr() * 12))
      })
      if (d) back.push(['path', { d, fill: C.c2, stroke: C.ink, 'stroke-width': U.HEART_INK, 'stroke-linejoin': 'round', class: 'wm-deco' }])
    } catch { /* no hearts */ }
  }

  // cream paper inside knockouts that sit within the object's fill
  if (sdf && !live && icon.fillSet && icon.fillSet.length) {
    try {
      const holes = []
      for (const p of plates) for (const l of p.loops) {
        if (area(l) <= 0.5) continue
        let inF = 0, tot = 0
        for (let q = 0; q < l.length; q += Math.max(1, (l.length / 8) | 0)) {
          const [gx, gy] = grad(sdf, l[q][0], l[q][1])
          const P = [l[q][0] + gx * 0.35, l[q][1] + gy * 0.35]
          tot++; if (pointInSet(P, icon.fillSet)) inF++
        }
        if (tot && inF / tot > 0.6) holes.push(l.slice().reverse())
      }
      // per-hole roles (a teddy's eyes in ink, its inner ears in blush)
      const byRole = new Map()
      for (const hl of holes) {
        const hit = (tune.inlayAt || []).find(([x, y]) => pointInSetRing([x, y], hl))
        const r = hit ? hit[2] : tune.inlay || 'c4'
        if (!byRole.has(r)) byRole.set(r, [])
        byRole.get(r).push(hl)
      }
      for (const [r, L] of byRole) back.push(['path', { d: loopsD(L), fill: C[r], class: 'wm-k' }])
    } catch { /* no inlay */ }
  }
  out.push(...back)

  // the body: K in the gradient, A in chocolate, S in the heart red (per-icon roles and painted pieces in _valentine-tune)
  const roleFill = r => r === 'grad' ? url(0) : C[r] || url(0)
  for (const p of plates) {
    const cls = p.plate === 'A' ? 'wm-a' : p.plate === 'S' ? 'wm-s' : 'wm-k'
    const base = p.plate === 'A' ? (tune.a || 'c3') : p.plate === 'S' ? (tune.s || 'c2') : (tune.k || 'grad')
    if (!live) {
      const groups = new Map([[base, []]])
      const pcs = pieces(p.loops)
      let head = null
      if (tune.header && p.plate === 'K' && pcs.length > 1) {
        const [, ty0, , ty1] = bboxOf(p.loops)
        const top = pcs.map(pc => [pc, bboxOf([pc[0]])]).sort((u, v) => u[1][1] - v[1][1])[0]
        if (top[1][3] - top[1][1] < (ty1 - ty0) * 0.45 && top[1][1] < ty0 + 0.5) head = top[0]
      }
      for (const pc of pcs) {
        const hit = (tune.paint || []).find(([x, y]) => pointInSet([x, y], pc))
        const r = hit ? hit[2] : pc === head ? 'c2' : base
        if (!groups.has(r)) groups.set(r, [])
        groups.get(r).push(...pc)
      }
      for (const [r, L] of groups) if (L.length) out.push(['path', { d: loopsD(L), fill: roleFill(r), 'fill-rule': 'evenodd', ...ink, class: cls }])
      // a header band (calendar): the body above y = header in the red
      if (typeof tune.header === 'number' && p.plate === 'K') {
        try {
          const band = intersectSets(setOf(p.loops), [[[0, 0], [24, 0], [24, tune.header], [0, tune.header]]])
          if (band.length) out.push(['path', { d: loopsD(band), fill: C.c2, 'fill-rule': 'evenodd', ...ink, class: cls }])
        } catch { /* no header */ }
      }
      continue
    }
    out.push(['path', { d: loopsD(p.loops), fill: p.plate === 'K' ? C.c2 : roleFill(base), 'fill-rule': 'evenodd', class: cls }])
    const holes = loops.filter(l => area(l) > 0)
    const outer = p.loops.filter(l => area(l) < 0 && !holes.some(hh => pointInSetRing(l[0], hh)))
    if (outer.length) out.push(['path', { d: loopsD(outer), fill: 'none', ...ink, class: cls }])
  }
  // drawing laid over the body, in order (_valentine-tune 'draw'): skeleton paths (by index) or own path data,
  // filled and outlined, or stroked with an ink casing (a strawberry's leaves, a teddy's face)
  const drawn = []
  if (!live && tune.draw) for (const [src, role, w] of tune.draw) {
    const p = pick(icon0, src, role)
    if (!p || !p.d) continue
    if (typeof w === 'string') { const n = shapeAt(p, role, w); if (n) drawn.push(n); continue }
    const cls = p.plate === 'S' ? 'wm-s' : p.plate === 'A' ? 'wm-a' : 'wm-k'
    if (w === undefined) { drawn.push(['path', { d: p.d, fill: C[role], ...ink, class: cls }]); continue }
    const rd = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls }
    drawn.push(['path', { d: p.d, ...rd, stroke: C.ink, 'stroke-width': f2(role === 'ink' ? w : w + U.INK) }])
    if (role !== 'ink') drawn.push(['path', { d: p.d, ...rd, stroke: C[role], 'stroke-width': f2(w - U.INK * 0.3) }])
  }
  if (live || !sdf) return out.concat(drawn)

  // broad parts: thick enough for shade, shine, dots and a face
  let broad = null
  try { broad = F.open(Float32Array.from(sdf), U.BROAD) } catch { broad = null }
  if (!broad) return out.concat(drawn)
  let broadLoops = []
  try { broadLoops = F.trace(Float32Array.from(broad), 0.04, 2.5) } catch { broadLoops = [] }
  if (!broadLoops.length) return out.concat(drawn)

  // gentle shade along the bottom-right edge
  try {
    const inset = new Float32Array(NN)
    for (let k = 0; k < NN; k++) inset[k] = sdf[k] + U.SHADE_IN
    const sh = shifted(sdf, U.SHADE_D[0], U.SHADE_D[1])
    for (let k = 0; k < NN; k++) sh[k] = -sh[k]
    const G = maxF(inset, sh, broad)
    const L = F.trace(G, 0.04, 0.5)
    if (L.length) out.push(['path', { d: loopsD(L), fill: C.shadow, 'fill-opacity': 0.5, class: 'wm-shadow' }])
  } catch { /* no shade */ }

  // where a face goes (decides where dots may not)
  const faces = []
  const wantFace = tune.face !== false && (tune.face || (FACE.test(name) && !NO_FACE.test(name)))
  if (wantFace) {
    try {
      if (tune.faceAt) for (const [x, y, sc] of tune.faceAt) faces.push({ x, y, s: sc })
      const spots = tune.faceAt ? [] : deepest(sdf, k => broad[k] < 0, tune.faces || 1, 5.5, (x0 + x1) / 2)
      for (const s of spots) {
        if (s.d < 2.1 || (faces.length && s.d < spots[0].d * 0.7)) continue
        faces.push({ x: s.x + (tune.fdx || 0), y: s.y + (tune.fdy ?? 0.3), s: Math.min(1.5, Math.max(0.62, (s.d - 0.4) / 2.1)) * (tune.fs || 1) })
      }
    } catch { /* no face */ }
  }

  // polka dots or sprinkles on a broad body
  let deco = tune.deco !== undefined ? tune.deco : SPRINKLES.test(name) ? 'sprinkles' : null
  if (deco === 'hearts') {
    deco = null
    if (!faces.length) try {
      const spots = deepest(sdf, k => broad[k] < 0, 2, 4.5, (x0 + x1) / 2).filter(q => q.d >= 1.7)
      let d = ''
      const rr = rngOf(name + ':p')
      for (const q of spots.slice(0, 3)) d += heartD(q.x, q.y, Math.min(1.25, q.d - 0.55), (rr() - 0.5) * 30)
      if (d) out.push(['path', { d, fill: C.c2, class: 'wm-shine' }])
    } catch { /* no hearts */ }
  }
  if (deco) {
    try {
      const r = rngOf(name + ':d')
      const sp = deco === 'dots' ? 2.5 : 2.2, ox = r() * sp, oy = r() * sp
      let dd = '', sd = ''
      let n = 0
      for (let row = 0, y = 2 + oy; y < 22; y += sp * 0.87, row++) {
        for (let x = 2 + ox + (row % 2) * sp / 2; x < 22; x += sp) {
          const v = sAt(sdf, x, y), b = sAt(broad, x, y)
          if (v > -1.15 || b > -0.6) continue
          if (tune.decoBox && (x < tune.decoBox[0] || y < tune.decoBox[1] || x > tune.decoBox[2] || y > tune.decoBox[3])) continue
          if (faces.some(f => Math.hypot(x - f.x, y - f.y - 0.3) < 3.4 * f.s)) continue
          if (deco === 'dots') dd += discD(x, y, 0.46)
          else {
            const a = r() * Math.PI, c = Math.cos(a) * 0.45, s = Math.sin(a) * 0.45
            if (n % 2) sd += 'M' + pt(x - c, y - s) + 'l' + pt(2 * c, 2 * s)
            else dd += 'M' + pt(x - c, y - s) + 'l' + pt(2 * c, 2 * s)
          }
          if (++n > 18) break
        }
        if (n > 18) break
      }
      if (deco === 'dots' && dd) out.push(['path', { d: dd, fill: C.shine, 'fill-opacity': 0.92, class: 'wm-shine' }])
      if (deco !== 'dots') {
        const sk = { fill: 'none', 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }
        if (dd) out.push(['path', { d: dd, stroke: C.tint, ...sk }])
        if (sd) out.push(['path', { d: sd, stroke: C.shine, ...sk }])
      }
    } catch { /* no dots */ }
  }

  // the highlight: a curved stroke + a dot along the top-left inside each broad shape
  try {
    const G = maxF(sdf, broad)
    for (let k = 0; k < NN; k++) G[k] += U.SHINE_IN
    const L = F.trace(G, 0.04, 0.8).filter(l => area(l) < 0)
    let d = '', dots = ''
    for (const l of L) {
      const [bx0, by0, bx1, by1] = bboxOf([l])
      if (Math.min(bx1 - bx0, by1 - by0) < 1.2) continue
      const n = l.length
      const ok = l.map(([x, y]) => { const [gx, gy] = grad(sdf, x, y); return gx * -0.6 + gy * -0.8 > 0.4 })
      const s0 = ok.findIndex(v => !v)
      if (s0 < 0) continue
      let best = [], cur = []
      for (let q = 1; q <= n; q++) {
        const i = (s0 + q) % n
        if (ok[i]) cur.push(l[i])
        else { if (cur.length > best.length) best = cur; cur = [] }
      }
      if (best.length < 3) continue
      // trim the run to its middle, at most ~45% of the shape's span
      let len = 0
      for (let q = 1; q < best.length; q++) len += Math.hypot(best[q][0] - best[q - 1][0], best[q][1] - best[q - 1][1])
      const span = Math.max(bx1 - bx0, by1 - by0)
      const keep = Math.min(len * 0.8, span * 0.55, 6.5)
      if (keep < 0.9) continue
      const skip = (len - keep) / 2
      const seg = []
      let acc = 0
      for (let q = 0; q < best.length; q++) {
        if (q) acc += Math.hypot(best[q][0] - best[q - 1][0], best[q][1] - best[q - 1][1])
        if (acc >= skip && acc <= skip + keep) seg.push(best[q])
      }
      if (seg.length < 2) continue
      d += lineD(simplify(seg, 0.03))
      // a dot beyond the stroke's lower end (the end further down the left side)
      const end = seg[0][1] > seg.at(-1)[1] ? 0 : seg.length - 1
      const nb = seg[end === 0 ? 1 : seg.length - 2], e = seg[end]
      const tx = e[0] - nb[0], ty = e[1] - nb[1], tl = Math.hypot(tx, ty) || 1
      const dp = [e[0] + tx / tl * 0.95, e[1] + ty / tl * 0.95]
      if (keep > 2 && sAt(sdf, dp[0], dp[1]) < -0.7) dots += discD(dp[0], dp[1], U.SHINE_W * 0.5)
    }
    if (d) out.push(['path', { d, fill: 'none', stroke: C.shine, 'stroke-width': U.SHINE_W, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }])
    if (dots) out.push(['path', { d: dots, fill: C.shine, 'fill-opacity': 0.9, class: 'wm-shine' }])
  } catch { /* no shine */ }

  out.push(...drawn)
  // faces
  for (const f of faces) out.push(...face(f.x, f.y, f.s, tune.expr || (hash(name) % 4 === 1 ? 'open' : 'smile')))
  // blush only (an icon that draws its own face: a teddy bear)
  if (tune.blush) out.push(['path', { d: tune.blush.map(([x, y, sc]) => ellD(x, y, 0.62 * sc, 0.38 * sc)).join(''), fill: C.edge, 'fill-opacity': 0.85, class: 'wm-a' }])
  return out
}

function pointInSetRing(p, ring) { return pointInSet(p, [ring]) }

// a skeleton part chosen by geometry, so skeleton edits that reorder paths never break a tune:
//   number (path index, legacy) | { path: [x, y] } nearest path | { cut: [x, y] } nearest cutout | 'd' own path data
// -> { id, d, plate, box } or null (nothing within 1.5u)
export function pick(icon, q, role) {
  try {
    if (typeof q === 'string') return { d: q, plate: role === 'c2' || role === 'accent' ? 'S' : 'A', box: bboxOf([parsePts(q)]) }
    if (typeof q === 'number') { const p = (icon.paths || [])[q]; return p ? { ...p, box: bboxOf(p.subs.map(s => s.pts)) } : null }
    const list = q.cut ? (icon.cutouts || []).map(c => ({ d: c.d, subs: c.subs, plate: 'A' })) : (icon.paths || [])
    const [x, y] = q.cut || q.path
    let best = null, bd = 1.5
    for (const p of list) for (const sb of p.subs || []) {
      const P = sb.closed ? [...sb.pts, sb.pts[0]] : sb.pts
      for (let i = 0; i < P.length; i++) {
        const A = P[i], B = P[i + 1] || A, vx = B[0] - A[0], vy = B[1] - A[1], L = vx * vx + vy * vy
        const u = L ? Math.max(0, Math.min(1, ((x - A[0]) * vx + (y - A[1]) * vy) / L)) : 0
        const dd = Math.hypot(A[0] + vx * u - x, A[1] + vy * u - y)
        if (dd < bd) { bd = dd; best = p }
      }
    }
    return best ? { ...best, box: bboxOf(best.subs.map(sb => sb.pts)) } : null
  } catch { return null }
}
const parsePts = d => (String(d).match(/-?[d.]+/g) || []).map(Number).reduce((a, v, i, arr) => (i % 2 ? a : [...a, [v, arr[i + 1]]]), [])
// small shapes centred on a picked part: 'heart' and 'sparkle' replace it, 'oval' fills its box, 'smile' sits under it
function shapeAt(p, role, kind) {
  const [bx0, by0, bx1, by1] = p.box, cx = (bx0 + bx1) / 2, cy = (by0 + by1) / 2, r = Math.max(0.8, Math.min(bx1 - bx0, by1 - by0) / 2)
  const cls = p.plate === 'S' ? 'wm-s' : p.plate === 'A' ? 'wm-a' : 'wm-k'
  if (kind === 'oval') return ['path', { d: ellD(cx, cy, (bx1 - bx0) / 2, (by1 - by0) / 2), fill: C[role], stroke: C.ink, 'stroke-width': U.INK, class: cls }]
  if (kind === 'heart') return ['path', { d: heartD(cx, cy, r * 1.05, -8), fill: C[role], stroke: C.ink, 'stroke-width': U.INK * 0.8, 'stroke-linejoin': 'round', class: cls }]
  if (kind === 'sparkle') {
    const R = r * 1.15, k = R * 0.18
    return ['path', { d: `M${pt(cx, cy - R)}Q${pt(cx + k, cy - k)} ${pt(cx + R, cy)}Q${pt(cx + k, cy + k)} ${pt(cx, cy + R)}Q${pt(cx - k, cy + k)} ${pt(cx - R, cy)}Q${pt(cx - k, cy - k)} ${pt(cx, cy - R)}z`, fill: C[role], stroke: C.ink, 'stroke-width': U.INK * 0.8, 'stroke-linejoin': 'round', class: cls }]
  }
  if (kind === 'smile') {
    const w = 0.85, y = cy + 0.6
    return ['path', { d: `M${pt(cx, cy + 0.15)}V${num(y)}M${pt(cx - w, y + 0.05)}q${num(w / 2)} ${num(0.55)} ${num(w)} 0q${num(w / 2)} ${num(0.55)} ${num(w)} 0`, fill: 'none', stroke: C[role], 'stroke-width': 0.42, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }]
  }
  return null
}
// a plate's loops grouped into pieces: each outer loop with the holes directly inside it
function pieces(loops) {
  const outer = loops.filter(l => area(l) < 0).sort((a, b) => area(b) - area(a)), holes = loops.filter(l => area(l) >= 0)
  const P = outer.map(o => [o])
  for (const h of holes) {
    let k = -1
    for (let i = outer.length - 1; i >= 0; i--) if (pointInSetRing(h[0], outer[i])) { k = i; break }
    if (k >= 0) P[k].push(h); else P.push([h])
  }
  return P
}

// two dot eyes, a smile, blush
function face(x, y, s, expr) {
  const ex = 1.25 * s, ey = y - 0.15 * s, er = 0.42 * s
  const eyes = discD(x - ex, ey, er) + discD(x + ex, ey, er)
  const blush = ellD(x - 2.05 * s, y + 0.55 * s, 0.62 * s, 0.38 * s) + ellD(x + 2.05 * s, y + 0.55 * s, 0.62 * s, 0.38 * s)
  const my = y + 0.55 * s
  const mouth = expr === 'open'
    ? `M${pt(x - 0.55 * s, my)}h${num(1.1 * s)}c0 ${num(0.75 * s)} ${num(-1.1 * s)} ${num(0.75 * s)} ${num(-1.1 * s)} 0z`
    : `M${pt(x - 0.55 * s, my)}q${num(0.55 * s)} ${num(0.6 * s)} ${num(1.1 * s)} 0`
  return [
    ['path', { d: blush, fill: C.edge, 'fill-opacity': 0.85, class: 'wm-a' }],
    ['path', { d: eyes, fill: C.ink, class: 'wm-a' }],
    ['path', expr === 'open'
      ? { d: mouth, fill: C.ink, stroke: C.ink, 'stroke-width': 0.3 * s, 'stroke-linejoin': 'round', class: 'wm-a' }
      : { d: mouth, fill: 'none', stroke: C.ink, 'stroke-width': 0.42 * s, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: discD(x - ex + 0.14 * s, ey - 0.14 * s, 0.13 * s) + discD(x + ex + 0.14 * s, ey - 0.14 * s, 0.13 * s), fill: C.shine, class: 'wm-a' }],
  ]
}

// never render empty: the centrelines in the body colour with the ink outline under them
export function fallback(icon) {
  const ps = (icon.paths || []).filter(p => p && p.d)
  const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  return [
    ...ps.map(p => ['path', { d: p.d, ...round, stroke: C.ink, 'stroke-width': 2.6, class: 'wm-k' }]),
    ...ps.map(p => ['path', { d: p.d, ...round, stroke: C.c1, 'stroke-width': 1.5, class: 'wm-k' }]),
  ]
}
