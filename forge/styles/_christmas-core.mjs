// CHRISTMAS core — warm, cosy, premium seasonal icons.
//
// Layers, back to front:
//   GLOW    a soft warm halo behind icons that give off light (candle, star, fireplace, bulb)        wm-deco
//   BODY    the Solid mass (fills + round strokes, crisp knockouts) in festive colours with a deep
//           ink outline: K in cranberry (pine for evergreens, gold for metal and light, cream for
//           white things), A parts candy-cane (cream with red stripes), S badges in pine            wm-k / wm-a / wm-s
//   LIGHT   one shared soft gradient over the whole body: warm light from the upper left, shade
//           pooling low                                                                           wm-shine
//   STRIPES candy-cane stripes on A parts                                                          wm-a
//   SNOW    a snow cap resting on every top edge of the silhouette: real geometry following the
//           surface, thick on flats, thinning to nothing on steep sides, with soft drips; white
//           to a cool shade, a faint cool shadow under it                                          wm-deco
//   HOLLY   one tiny holly sprig (two leaves, three berries) on the widest stretch of snow         wm-deco
//   SPARKLE one small gold four-point sparkle in free space                                        wm-deco
// Live icons (icon.params) keep a plain body and outline: their values stay clean.
import { solidPlates, LAST } from './_christmas-solid.mjs'
import * as F from './_christmas-field.mjs'
import { area, simplify, pointInRing, rng } from '../kernel/geom.mjs'
import { DEFAULT } from './_christmas-palettes.mjs'
import { GREEN, GOLD, CREAM, GLOW, NOSNOW, CANDY, NOHOLLY, PART, BODY, STEEP, FEST } from './_christmas-tune.mjs'
import { isPerson, personColors, personPaint } from './_christmas-people.mjs'

export const C = Object.fromEntries(Object.entries(DEFAULT).map(([k, v]) => [k, `var(--with-christmas-${k}, ${v})`]))
const C0 = { ...C }

export const U = {
  INK: 0.6,          // outline width (centred on the edge)
  SNOW_UP: 1.45,     // snow thickness above a flat top ...
  SNOW_DN: 0.95,    // ... and how far it covers the object below the top edge
  SNOW_DN_MAX: 0.42, // never more than this share of the object's local thickness
  SNOW_MIN: 2.2,     // a snow run shorter than this is dropped
  STRIPE_P: 1.55,    // candy stripe period ...
  STRIPE_W: 0.62,    // ... and width
}

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
    d += 'M' + join([num(R[0][0] / 100), num(R[0][1] / 100)]) + 'l' + join(rel) + 'z'
  }
  return d
}
const f2 = v => +(+v).toFixed(2)
const discD = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
function bboxOf(loops) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const l of loops) for (const [x, y] of l) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y }
  return isFinite(x0) ? [x0, y0, x1, y1] : [4, 4, 20, 20]
}

// ---------------------------------------------------------------------------
// SNOW: per column, the first surface seen from the sky; thickness follows the slope
function snowCap(mass, name, steep = 1) {
  const N = F.N, H = F.H
  const top = new Float32Array(N).fill(NaN), th = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    let j = 0
    while (j < N && !(mass[j * N + i] < 0)) j++
    if (j >= N || j === 0) continue
    const v0 = mass[(j - 1) * N + i], v1 = mass[j * N + i]
    top[i] = (j - 1 + v0 / (v0 - v1)) * H
    let k = j
    while (k < N && mass[k * N + i] < 0) k++
    th[i] = (k - j) * H
  }
  // slope factor: full snow on flats, none on steep sides or at jumps
  const R = 5 // columns either side (0.4u)
  const f = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    if (isNaN(top[i])) continue
    const a = Math.max(0, i - R), b = Math.min(N - 1, i + R)
    if (isNaN(top[a]) || isNaN(top[b])) { f[i] = 0; continue }
    const s = Math.abs(top[b] - top[a]) / ((b - a) * H)
    // a jump (a step's front, the end of a separate piece) breaks the run
    let jump = false
    for (let q = a; q < b; q++) if (isNaN(top[q + 1]) || Math.abs(top[q + 1] - top[q]) > 0.35) { jump = true; break }
    f[i] = jump ? 0 : Math.max(0, Math.min(1, 1 - (s / steep - 0.5) / 1.1))
  }
  // smooth the factor (±0.5u) so the cap swells and thins gently
  const g = new Float32Array(N), S = 6
  for (let i = 0; i < N; i++) {
    if (!f[i]) continue
    let sum = 0, n = 0
    for (let q = i - S; q <= i + S; q++) { if (q >= 0 && q < N) { sum += f[q]; n++ } }
    g[i] = Math.min(f[i] * 1.15, sum / n)
  }
  // runs of snow (a run must carry enough snow to read: short slanted scraps are dropped)
  const runs = []
  for (let i = 0; i < N; i++) {
    if (g[i] < 0.08) continue
    let k = i, sum = 0
    while (k + 1 < N && g[k + 1] >= 0.08 && Math.abs(top[k + 1] - top[k]) < 0.35) { k++; sum += g[k] }
    if ((k - i) * H >= U.SNOW_MIN && sum * H >= U.SNOW_MIN * 0.8) runs.push([i, k])
    i = k
  }
  if (!runs.length) return null
  const rand = rng('christmas-snow-' + name)
  const lo = new Float32Array(N).fill(NaN), hi = new Float32Array(N).fill(NaN)
  for (const [i0, i1] of runs) {
    const L = (i1 - i0) * H, ph = rand() * 6.28, ph2 = rand() * 6.28
    // a few soft drips, only where the object below is deep enough to carry one
    const drips = []
    const nd = Math.max(L > 4.5 ? 1 : 0, Math.min(4, Math.floor(L / 3.4)))
    for (let q = 0; q < nd; q++) {
      const t = (q + 0.3 + rand() * 0.4) / nd, ic = Math.round(i0 + t * (i1 - i0))
      if (g[ic] < 0.7 || th[ic] < 2.4) continue
      drips.push({ x: ic * H, w: 0.72 + rand() * 0.22, l: Math.max(0, Math.min(0.55 + rand() * 0.5, th[ic] * 0.62 - U.SNOW_DN)) })
    }
    for (let i = i0; i <= i1; i++) {
      const x = i * H, k = g[i]
      const up = U.SNOW_UP * (th[i] < 2.8 ? 0.75 : 1) * Math.sqrt(k) * (1 + 0.1 * Math.sin(x * 1.4 + ph))
      let dn = Math.min(U.SNOW_DN * Math.sqrt(k) * (1 + 0.18 * Math.sin(x * 2.1 + ph2)), th[i] * (th[i] < 2.8 ? 0.22 : U.SNOW_DN_MAX))
      for (const d of drips) {
        const u = (x - d.x) / d.w
        if (Math.abs(u) < 1) dn = Math.max(dn, Math.min(U.SNOW_DN * k + d.l * Math.sqrt(1 - u * u), th[i] * 0.7))
      }
      lo[i] = Math.max(0.45, top[i] - up)
      hi[i] = Math.min(top[i] + dn, top[i] + th[i] - 0.3)
    }
  }
  const field = (dy) => {
    const G = F.field(1)
    for (let i = 0; i < N; i++) {
      if (isNaN(lo[i]) || hi[i] - lo[i] < 0.05) continue
      const a = lo[i] + dy, b = hi[i] + dy
      const j0 = Math.max(0, Math.floor((a - 1) / H)), j1 = Math.min(N - 1, Math.ceil((b + 1) / H))
      for (let j = j0; j <= j1; j++) { const y = j * H; G[j * N + i] = Math.max(a - y, y - b) }
    }
    return G
  }
  let snow = F.open(field(0), 0.32)
  const loops = F.trace(snow, 0.03, 0.35)
  if (!loops.length) return null
  // the cool shadow the snow casts on the object just below its lower edge
  const sh = field(0.42)
  for (let k = 0; k < sh.length; k++) { if (mass[k] + 0.25 > sh[k]) sh[k] = mass[k] + 0.25; if (-snow[k] > sh[k]) sh[k] = -snow[k] }
  const shadow = F.trace(sh, 0.04, 0.25)
  // where the holly sits: the longest run, a little right of its middle, on a flat
  let best = null
  for (const [i0, i1] of runs) {
    const L = (i1 - i0) * H
    if (L < 7.2) continue
    let ic = Math.round(i0 + (i1 - i0) * 0.68)
    for (let q = 0; q < 12 && g[ic] < 0.9; q++) ic += q % 2 ? q : -q
    if (g[ic] < 0.85 || isNaN(lo[ic])) continue
    if (!best || L > best.L) best = { L, x: ic * H, y: (lo[ic] + Math.min(hi[ic], top[ic] + 0.5)) / 2 }
  }
  return { loops, shadow, holly: best }
}

// a holly sprig: two pointed leaves either side, three berries in the middle
function holly(x, y, s = 1) {
  const leaf = (dir) => {
    const a = dir > 0 ? -0.32 : Math.PI + 0.32, ca = Math.cos(a), sa = Math.sin(a)
    const L = 2.05 * s, W = 0.62 * s
    const p0 = [x + ca * 0.25 * s, y + sa * 0.25 * s], tip = [x + ca * L, y + sa * L]
    const mx = (p0[0] + tip[0]) / 2, my = (p0[1] + tip[1]) / 2, nx = -sa, ny = ca
    // a wavy holly edge: two bumps a side
    const pt = (t, side) => {
      const w = W * Math.sin(Math.PI * t) * (1 + 0.28 * Math.cos(t * Math.PI * 4))
      return [p0[0] + (tip[0] - p0[0]) * t + nx * w * side, p0[1] + (tip[1] - p0[1]) * t + ny * w * side]
    }
    void mx; void my
    const P = []
    for (let k = 0; k <= 8; k++) P.push(pt(k / 8, 1))
    for (let k = 7; k >= 1; k--) P.push(pt(k / 8, -1))
    return P
  }
  const leaves = loopsD([leaf(1), leaf(-1)])
  const b = 0.46 * s
  const berries = discD(x - 0.42 * s, y + 0.18 * s, b) + discD(x + 0.42 * s, y + 0.18 * s, b) + discD(x, y - 0.42 * s, b)
  return [
    ['path', { d: leaves, fill: C.c2, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: berries, fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: 'wm-deco' }],
    ['path', { d: discD(x - 0.12 * s, y - 0.58 * s, 0.13 * s), fill: C.shine, class: 'wm-deco' }],
  ]
}

// ---------------------------------------------------------------------------
// free space for accents (outside the glyph, never in a hole)
function outsideMask(mass) {
  const N = F.N, NN = N * N, out = new Uint8Array(NN), st = []
  const push = k => { if (!out[k] && mass[k] > 0) { out[k] = 1; st.push(k) } }
  for (let q = 0; q < N; q++) { push(q); push(NN - N + q); push(q * N); push(q * N + N - 1) }
  while (st.length) {
    const k = st.pop(), j = (k / N) | 0, i = k - j * N
    if (i > 0) push(k - 1); if (i < N - 1) push(k + 1); if (j > 0) push(k - N); if (j < N - 1) push(k + N)
  }
  return out
}
function freeSpot(occ, loops, side = 1) {
  const D = F.redistance(occ, loops, 3.3), O = outsideMask(occ)
  let best = null, bs = -Infinity
  for (let y = 2.5; y <= 21.5; y += 0.25) for (let x = 2.5; x <= 21.5; x += 0.25) {
    const i = Math.round(x / F.H), j = Math.round(y / F.H)
    const k = j * F.N + i
    if (!O[k]) continue
    const d = D[k]
    if (d < 1.5) continue
    const r = Math.min(d - 0.8, 1.7, x - 1.3, 22.7 - x, y - 1.3, 22.7 - y)
    if (r < 1.25) continue
    // prefer the upper right
    const s = r * 1.4 + 0.1 * side * (x - 12) - 0.14 * (y - 12)
    if (s > bs) { bs = s; best = { x, y, r } }
  }
  return best
}
function sparkleD(x, y, r) {
  const q = r * 0.22, n = num
  return `M${n(x)} ${n(y - r)}Q${n(x + q)} ${n(y - q)} ${n(x + r)} ${n(y)}Q${n(x + q)} ${n(y + q)} ${n(x)} ${n(y + r)}` +
    `Q${n(x - q)} ${n(y + q)} ${n(x - r)} ${n(y)}Q${n(x - q)} ${n(y - q)} ${n(x)} ${n(y - r)}z`
}

// ---------------------------------------------------------------------------
function bodyRole(name) {
  if (BODY[name]) return BODY[name]
  // faces: warm gingerbread gold (green for the creatures, snow for the ghost), never a red or green person
  if (/^avatar-/.test(name)) return /alien|dino|frog|monster$|monster-horns/.test(name) ? 'c2' : /ghost/.test(name) ? 'c4' : 'c3'
  if (GREEN.test(name)) return 'c2'
  if (GOLD.test(name)) return 'c3'
  if (CREAM.test(name)) return 'c4'
  // everything else: a seeded festive mix, so a grid reads cranberry, pine, gold and snow
  const v = rng('christmas-body-' + name.split('-')[0])()
  return v < 0.42 ? 'c1' : v < 0.7 ? 'c2' : v < 0.88 ? 'c3' : 'c4'
}

// people avatars render with their own role fallbacks (natural skin, hair, a festive jumper): C is swapped for
// the call (synchronous, restored in finally), so every var() in the icon carries the person's defaults
export function christmasNodes(icon) {
  const pc = !icon.params && isPerson(icon) ? personColors(icon) : null
  if (!pc) return nodes(icon, false)
  for (const [k, v] of Object.entries(pc)) C[k] = `var(--with-christmas-${k}, ${v})`
  try { return nodes(icon, true) } finally { Object.assign(C, C0) }
}

function nodes(icon, person) {
  const name = icon.name || 'icon'
  const id = n => `wg-christmas-${name}-${n}`, url = n => `url(#${id(n)})`
  let plates = [], mass = null
  try { LAST.mass = null; plates = solidPlates(icon); mass = LAST.mass } catch { plates = []; mass = null }
  const loops = plates.flatMap(p => p.loops)
  if (!loops.length) return fallback(icon)
  const live = !!icon.params
  const ink = { stroke: C.ink, 'stroke-width': U.INK, 'stroke-linejoin': 'round' }
  const body = bodyRole(name), candy = CANDY.test(name)
  let part = PART[name] || (body === 'c4' && !candy ? 'c1' : 'candy')
  const fest = FEST[name] || {}
  const sRole = fest.S || (body === 'c2' ? 'c1' : 'c2')
  const fillOf = p => p.plate === 'A' ? C[part === 'candy' ? 'c4' : part] : p.plate === 'S' ? C[sRole] : C[candy ? 'c4' : body]

  if (live) {
    const out = []
    const holes = loops.filter(l => area(l) > 0)
    for (const p of plates) {
      const cls = p.plate === 'A' ? 'wm-a' : p.plate === 'S' ? 'wm-s' : undefined
      out.push(['path', { d: loopsD(p.loops), fill: p.plate === 'S' ? C.c2 : C.c1, 'fill-rule': 'evenodd', class: cls }])
      const outer = p.loops.filter(l => area(l) < 0 && !holes.some(h => pointInRing(l[0], h)))
      if (outer.length) out.push(['path', { d: loopsD(outer), fill: 'none', ...ink, class: cls }])
    }
    return out
  }

  // candy stripes suit stroke-like parts (a shackle, a wheel, a handle); a broad part (a second person) stays plain
  if (part === 'candy' && !PART[name]) {
    try {
      const A = plates.filter(p => p.plate === 'A').flatMap(p => p.loops)
      if (A.length) {
        const G = F.region(A, 1.6)
        let m = 0
        for (let k = 0; k < G.length; k++) if (G[k] < m) m = G[k]
        if (m < -1.3) part = body === 'c1' ? 'c3' : 'c1'
      }
    } catch { /* keep */ }
  }
  const [x0, y0, x1, y1] = bboxOf(loops)
  const st = (o, c, op) => ['stop', op === undefined || op === 1 ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
  const grads = [
    // the shared light: warm light upper left, shade pooling low right
    ['linearGradient', { id: id(0), x1: f2(x0), y1: f2(y0), x2: f2(x0 + (x1 - x0) * 0.55), y2: f2(y1), gradientUnits: 'userSpaceOnUse' },
      [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
  ]
  const nodes = []
  const glow = GLOW.test(name) && fest.glow !== false
  if (glow) {
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
    grads.push(['radialGradient', { id: id(2), cx: f2(cx), cy: f2(cy), r: 11.5, gradientUnits: 'userSpaceOnUse' },
      [st(0, C.edge, 0.55), st(0.55, C.edge, 0.18), st(1, C.edge, 0)]])
    nodes.push(['path', { d: discD(cx, cy, 11.5), fill: url(2), class: 'wm-deco' }])
  }
  // body, by plate (a person: by part, skin c1 / hair c2 / jumper c4, ink features, then the outline)
  let pp = null
  if (person && mass) { try { pp = personPaint(icon, mass, loops, F) } catch { pp = null } }
  if (pp) {
    for (const p of plates) {
      const cls = p.plate === 'A' ? 'wm-a' : p.plate === 'S' ? 'wm-s' : undefined
      nodes.push(['path', { d: loopsD(p.loops), fill: p.plate === 'K' ? C.c1 : C.c4, 'fill-rule': 'evenodd', class: cls }])
    }
    for (const r of pp.regions) nodes.push(['path', { d: loopsD(r.loops), fill: C[r.role], 'fill-rule': 'evenodd', stroke: C.ink, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: r.role === 'c4' ? 'wm-a' : undefined }])
    if (pp.features.length) nodes.push(['path', { d: loopsD(pp.features), fill: C.ink, class: 'wm-k' }])
  } else for (const p of plates) {
    const cls = p.plate === 'A' ? 'wm-a' : p.plate === 'S' ? 'wm-s' : undefined
    nodes.push(['path', { d: loopsD(p.loops), fill: fillOf(p), 'fill-rule': 'evenodd', ...ink, class: cls }])
  }
  // candy stripes: on A parts (and on candy bodies)
  try {
    const striped = pp ? [] : plates.filter(p => (p.plate === 'A' && part === 'candy') || (p.plate === 'K' && candy))
    if (striped.length) {
      const G = F.region(striped.flatMap(p => p.loops), 1)
      const P = U.STRIPE_P, W = U.STRIPE_W, N = F.N
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
        const k = j * N + i
        if (G[k] >= 0.5) { G[k] = 1; continue }
        const u = (i * F.H - j * F.H * 0.85) / 1.31
        const m = ((u % P) + P) % P
        const s = Math.abs(m - P / 2) - W / 2
        G[k] = Math.max(G[k] + 0.32, s)
      }
      const sl = F.trace(G, 0.03, 0.12)
      if (sl.length) nodes.push(['path', { d: loopsD(sl), fill: C.c1, class: candy ? undefined : 'wm-a' }])
    }
  } catch { /* plain parts */ }
  // the shared light over everything
  const isCream = p => !pp && fillOf(p) === C.c4 && !(p.plate === 'K' && candy) && !(p.plate === 'A' && part === 'candy')
  const warm = plates.filter(p => !isCream(p)).flatMap(p => p.loops), cool = plates.filter(isCream).flatMap(p => p.loops)
  if (warm.length) nodes.push(['path', { d: loopsD(warm), fill: url(0), 'fill-rule': 'evenodd', class: 'wm-shine' }])
  if (cool.length) {
    grads.push(['linearGradient', { id: id(3), x1: f2(x0), y1: f2(y0), x2: f2(x0 + (x1 - x0) * 0.55), y2: f2(y1), gradientUnits: 'userSpaceOnUse' },
      [st(0.3, C.tint, 0), st(1, C.tint, 0.75)]])
    nodes.push(['path', { d: loopsD(cool), fill: url(3), 'fill-rule': 'evenodd', class: 'wm-shine' }])
  }
  if (pp) {
    const ol = pp.outline.length ? pp.outline : plates.flatMap(p => p.loops)
    nodes.push(['path', { d: loopsD(ol), fill: 'none', ...ink, class: 'wm-k' }])
    const cl = pp.eyes.map(e => discD(e.x + e.r * 0.3, e.y - e.r * 0.35, Math.max(0.2, Math.min(0.32, e.r * 0.4)))).join('')
    if (cl) nodes.push(['path', { d: cl, fill: C.shine, class: 'wm-shine' }])
  }
  if (!mass) return [['defs', {}, grads], ...nodes]

  // snow
  let cap = null
  if (!NOSNOW.test(name) && fest.snow !== false) { try { cap = snowCap(mass, name, STEEP[name] || 1) } catch { cap = null } }
  if (cap) {
    const [, sy0, , sy1] = bboxOf(cap.loops)
    grads.push(['linearGradient', { id: id(1), x1: 0, y1: f2(sy0), x2: 0, y2: f2(Math.max(sy1, sy0 + 1.6)), gradientUnits: 'userSpaceOnUse' },
      [st(0.25, C.shine), st(1, C.tint)]])
    if (cap.shadow.length) nodes.push(['path', { d: loopsD(cap.shadow), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }])
    nodes.push(['path', { d: loopsD(cap.loops), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }])
    if (cap.holly && !person && !NOHOLLY.test(name) && fest.holly !== false) nodes.push(...holly(cap.holly.x, cap.holly.y, 1.2))
  }
  // a sparkle in free space
  try {
    const r = rng('christmas-spark-' + name)
    const want = fest.spark !== false && (GLOW.test(name) || r() < 0.45), side = r() < 0.6 ? 1 : -1
    const sp = want ? freeSpot(mass, loops, side) : null
    if (sp) nodes.push(['path', { d: sparkleD(sp.x, sp.y, Math.min(sp.r, 1.55)), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }])
  } catch { /* none */ }
  return [['defs', {}, grads], ...nodes]
}

// never render empty: the centrelines in the body colour with the ink outline under them
function fallback(icon) {
  const ps = (icon.paths || []).filter(p => p && p.d)
  const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  return [
    ...ps.map(p => ['path', { d: p.d, ...round, stroke: C.ink, 'stroke-width': 2.6 }]),
    ...ps.map(p => ['path', { d: p.d, ...round, stroke: C.c1, 'stroke-width': 1.6 }]),
  ]
}
