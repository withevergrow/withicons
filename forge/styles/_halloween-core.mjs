// HALLOWEEN core. Spooky-cute and polished: every icon becomes a little Halloween object.
//
// Layers, back to front:
//   HALO     a soft warm glow behind the object, as if a jack-o'-lantern stood beside it            wm-deco
//   MOON     on round objects: a pale crescent moon peeking out behind                               wm-deco
//   SHADOW   a soft drop under the silhouette                                                         wm-shadow
//   LIGHT    candle light behind the body: every carved detail (knockout, hole) glows from inside    wm-shine
//   BODY     the Solid mass (fills + round strokes, crisp knockouts) in one of four materials, picked
//            per icon (natural choice first, else seeded): PUMPKIN orange (with ribs on round bodies),
//            WITCH purple, MIDNIGHT black (purple rim light) or BONE white; parts (plate A) in the
//            material's contrast colour, signals (plate S) in slime green                              wm-k / wm-a / wm-s
//   EYES     on a few icons, one dark hole holds two glowing eyes peeking out                         wm-deco
//   GOO      slime green goo coating the flattest broad bottom edge, with 1-3 round drips            wm-deco
//   SHINE    a crescent highlight on the lit upper-left shoulder of broad shapes                      wm-shine
//   CRITTER  on some icons: one tiny bat, or a spider on its thread, in the free space                wm-deco
// Live icons (icon.params) keep a plain body and halo only, so their values stay crisp.
import { solidPlates, LAST, K as SK } from './_halloween-solid.mjs'
import { isPerson, partFields, personTones, fillBacking, eyeCuts, catchLight } from './_halloween-people.mjs'
import { fillParts } from './_people.mjs'
import * as F from './_halloween-sfield.mjs'
import { area, simplify, rng, pointInRing } from '../kernel/geom.mjs'
import { C } from './_halloween-palettes.mjs'
import { TUNE, materialOf } from './_halloween-tune.mjs'

export const U = {
  INK: 0.72,        // outline width (centred on the edge)
  DRIP_NECK: 1.25,  // drip neck width
  DRIP_BULB: 2.15,  // drip bulb diameter
  DRIP_K: 0.75,     // smooth-union radius where the drips leave the goo
  GOO: 1.45,        // goo coat height above the bottom edge
  SHINE_IN: 0.62,   // highlight inset from the edge ...
  SHINE_DX: 0.5,    // ... and the bite that makes it a crescent
  SHINE_DY: 0.62,
  HALO: 0.36,
  GOO_SHARE: 0.55,  // share of icons (with a broad bottom edge) that get goo
  MOON_SHARE: 0.5,  // share of round icons that get a moon       // halo strength
  CRITTER: 0.5,     // share of icons (with room) that get a bat or a spider
  EYES: 0.4,        // share of icons (with a suitable hole) that get peeking eyes
}

// body materials: gradient stops (lit centre, mid, deep edge), outline, parts colour, shine strength
const MAT = {
  pumpkin: { stops: [C.c1, C.c1, C.c2], line: C.ink, A: C.c3, shine: 0.55 },
  witch: { stops: [C.c3, C.c3, C.edge], line: C.ink, A: C.c1, shine: 0.45 },
  midnight: { stops: [C.shadow, C.shadow, C.ink], line: C.edge, A: C.c1, shine: 0.22 },
  bone: { stops: [C.shine, C.shine, C.tint], line: C.ink, A: C.c3, shine: 0 },
  slime: { stops: [C.c4, C.c4, C.c4], line: C.ink, A: C.c3, shine: 0.5, goo: C.c3 },
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
const outerOf = loops => loops.filter(l => area(l) < 0)
const N = F.N, H = F.H, NN = N * N
const sAt = (G, x, y) => {
  const i = Math.round(x / H), j = Math.round(y / H)
  return (i < 0 || j < 0 || i >= N || j >= N) ? 9 : G[j * N + i]
}

// ---------------------------------------------------------------------------
// goo: a slime coat on the flattest broad stretch of the lowest edge, with round drips hanging from it
function gooSite(G, all, name, [, by0, , by1]) {
  const t = TUNE[name] || {}
  if (t.drips === 0) return null
  // restraint: goo on some icons only (always where the tune asks for it)
  if (!t.drips && rng(name + ':goo?')() > U.GOO_SHARE) return null
  // lowest ink in every column
  const low = new Float32Array(N).fill(-1)
  for (let i = 0; i < N; i++) for (let j = N - 1; j >= 0; j--) if (G[j * N + i] < 0) { low[i] = j * H; break }
  const minY = Math.max(12, by0 + (by1 - by0) * 0.55)
  // runs of columns whose lowest edge is flat and in the lower part of the shape
  const runs = []
  let cur = null
  for (let i = 1; i < N; i++) {
    const y = low[i], ok = y >= minY && y <= 20.8 && low[i - 1] >= 0 && Math.abs(y - low[i - 1]) < 0.09
    if (ok && cur && Math.abs(y - cur.y) < 0.35) { cur.i1 = i } else {
      if (cur) runs.push(cur)
      cur = ok ? { i0: i, i1: i, y } : null
    }
  }
  if (cur) runs.push(cur)
  // goo only hangs from a broad body (not from a 2u stroke or the rim of an outline container)
  const thick = (x, y) => [0.5, 1.2, 1.9, 2.6].every(u => sAt(G, x, y - u) < 0) && sAt(G, x - 0.7, y - 2) < 0 && sAt(G, x + 0.7, y - 2) < 0
  const good = runs.map(r => ({ ...r, L: (r.i1 - r.i0) * H })).filter(r => r.L >= 3.2 && thick((r.i0 + r.i1) / 2 * H, r.y))
  if (!good.length) return null
  good.sort((a, b) => (b.L + b.y * 0.6) - (a.L + a.y * 0.6))
  const r = good[0], R = rng(name + ':goo')
  const n = t.drips ?? (r.L >= 10 ? 3 : r.L >= 5 ? 2 : 1)
  const fr = n === 1 ? [0.62] : n === 2 ? [0.28, 0.7] : [0.18, 0.5, 0.8]
  const room = 22.6 - r.y
  const sites = []
  fr.forEach((f, k) => {
    const x = (r.i0 + (r.i1 - r.i0) * (f + (R() - 0.5) * 0.08)) * H
    // the middle drip runs longest; a drip is cut short when the bottom of the grid is near
    let len = (k === 1 || n === 1 ? 2.2 : 1.35) + R() * 0.6
    len = Math.min(len, room - 1.05)
    // nothing else may sit under a drip (a bell's clapper, a cart's wheels)
    let clear = true
    for (let yy = r.y + 0.45; yy <= r.y + len + 1.6 && clear; yy += 0.2) for (const dx of [-1.4, -0.7, 0, 0.7, 1.4]) if (sAt(all, x + dx, yy) < 0) { clear = false; break }
    if (len >= 0.6 && clear && thick(x, r.y)) sites.push({ x, y: r.y, len })
  })
  if (!sites.length) return null
  return { x0: r.i0 * H, x1: r.i1 * H, y: r.y, sites, phase: R() * 6 }
}
const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25 }
function gooLoops(kloops, g) {
  const G = F.region(kloops, 1.3)
  // the coat: the body below a wavy line, over the flat run (and its rounded corners)
  const xa = g.x0 - 1.6, xb = g.x1 + 1.6
  for (let j = 0; j < N; j++) {
    const y = j * H
    for (let i = 0; i < N; i++) {
      const x = i * H, top = g.y - U.GOO + 0.28 * Math.sin(x * 1.5 + g.phase)
      const k = j * N + i
      G[k] = Math.max(G[k], top - y, xa - x, x - xb)
    }
  }
  const D = F.field(1.3)
  for (const s of g.sites) {
    F.strokes([{ pts: [[s.x, s.y - 0.6], [s.x, s.y + s.len]], closed: false }], U.DRIP_NECK, 1.3, D)
    F.strokes([{ pts: [[s.x, s.y + s.len]], closed: false }], U.DRIP_BULB, 1.3, D)
  }
  for (let k = 0; k < NN; k++) G[k] = smin(G[k], D[k], U.DRIP_K)
  return F.trace(G, 0.03, 0.2)
}

// ---------------------------------------------------------------------------
// free space (outside the glyph, never in a hole) and the holes themselves
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
function freeSpot(D, O) {
  const at = (x, y) => {
    const i = Math.round(x / H), j = Math.round(y / H)
    if (i < 0 || j < 0 || i >= N || j >= N) return 3
    return O[j * N + i] ? D[j * N + i] : -1
  }
  let best = null, bs = -Infinity
  for (let y = 2.5; y <= 14; y += 0.25) for (let x = 2.5; x <= 21.5; x += 0.25) {
    const d = at(x, y)
    if (d < 2.3) continue
    const r = Math.min(d - 0.8, 2.1, x - 1.2, 22.8 - x, y - 1.4)
    if (r < 1.55) continue
    // the upper corners first (a bat flies above, a spider hangs from the top)
    const s = r * 1.5 - 0.12 * (y - 3) + 0.04 * Math.abs(x - 12)
    if (s > bs) { bs = s; best = { x, y, r, at } }
  }
  return best
}
// the roomiest hole that can hold a pair of eyes: its centre and the hole loop
function eyeHole(D, O, all, minY) {
  let best = null, bd = 0
  for (let j = 0; j < N; j += 2) for (let i = 0; i < N; i += 2) {
    const k = j * N + i
    if (O[k] || D[k] <= bd) continue
    bd = D[k]; best = [i * H, j * H]
  }
  if (!best || bd < 1.1 || bd > 2.9) return null
  const [x, y] = best
  if (y < minY) return null
  // both eyes must fit, side by side
  if (sAt(D, x - 0.62, y) < 0.62 || sAt(D, x + 0.62, y) < 0.62) return null
  const holes = all.filter(l => area(l) > 0 && pointInRing(best, l))
  if (!holes.length) return null
  holes.sort((a, b) => Math.abs(area(a)) - Math.abs(area(b)))
  if (Math.abs(area(holes[0])) > 40) return null
  return { x, y, r: bd, hole: holes[0] }
}
// almond eyes, inner corners low (a spooky, not scary, look)
function eyesD(x, y, s) {
  const rx = 0.46 * s, ry = 0.3 * s, gap = 0.62 * s
  let d = ''
  for (const sx of [-1, 1]) {
    const ex = x + sx * gap
    const a = [ex - sx * rx, y + ry * 0.35], b = [ex + sx * rx, y - ry * 0.45]
    d += `M${num(a[0])} ${num(a[1])}Q${num(ex)} ${num(y - ry * 1.9)} ${num(b[0])} ${num(b[1])}Q${num(ex + sx * rx * 0.2)} ${num(y + ry * 1.5)} ${num(a[0])} ${num(a[1])}Z`
  }
  return d
}
// a tiny bat, wings spread (half span r)
function batD(x, y, r) {
  const P = [[0, -0.12], [0.1, -0.36], [0.17, -0.12], [0.42, -0.36], [0.78, -0.42], [1, -0.16]]
  // the scalloped trailing edge, tip to body
  const S = [[1, -0.16], [0.86, 0.02], [0.66, 0.0], [0.56, 0.2], [0.4, 0.12], [0.24, 0.34], [0.12, 0.2], [0, 0.32]]
  const p = ([u, v], m = 1) => num(x + u * r * m) + ' ' + num(y + v * r)
  let d = 'M' + p([-0.0001, -0.12])
  for (const q of P.slice(1)) d += 'L' + p(q)
  for (let k = 1; k < S.length; k += 2) d += 'Q' + p(S[k]) + ' ' + p(S[k + 1] || S[k])
  const Sm = [...S].reverse()
  for (let k = 1; k < Sm.length; k += 2) d += 'Q' + p(Sm[k], -1) + ' ' + p(Sm[k + 1] || Sm[k], -1)
  for (const q of [...P].reverse().slice(1)) d += 'L' + p(q, -1)
  return d + 'Z'
}
function critter(kind, s, top) {
  const out = []
  if (kind === 'bat') {
    const r = Math.min(s.r * 1.25, 2.8)
    out.push(['path', { d: batD(s.x, s.y, r), fill: C.edge, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }])
    out.push(['path', { d: discD(s.x - r * 0.07, s.y - r * 0.05, 0.14) + discD(s.x + r * 0.07, s.y - r * 0.05, 0.14), fill: C.tint, class: 'wm-deco' }])
  } else if (kind === 'spider') {
    const r = Math.min(s.r, 2.1) * 0.62, x = s.x, y = s.y
    let legs = ''
    for (const sx of [-1, 1]) for (let k = 0; k < 4; k++) {
      const a = (-0.55 + k * 0.38), ex = x + sx * r * (1.9 - Math.abs(k - 1.5) * 0.18), ey = y + a * r * 2.1
      const kx = x + sx * r * 1.25, ky = y + a * r * 1.2 - r * 0.55
      legs += `M${num(x + sx * r * 0.4)} ${num(y + a * r * 0.5)}Q${num(kx)} ${num(ky)} ${num(ex)} ${num(ey)}`
    }
    out.push(['path', { d: `M${num(x)} ${num(top)}V${num(y - r * 0.9)}` + legs, stroke: C.edge, 'stroke-width': 0.34, 'stroke-linecap': 'round', fill: 'none', class: 'wm-deco' }])
    out.push(['path', { d: discD(x, y, r * 0.95), fill: C.edge, stroke: C.ink, 'stroke-width': 0.26, class: 'wm-deco' }])
    out.push(['path', { d: discD(x - r * 0.33, y - r * 0.15, 0.18) + discD(x + r * 0.33, y - r * 0.15, 0.18), fill: C.tint, class: 'wm-deco' }])
  }
  return out
}

// ---------------------------------------------------------------------------
// the shine: a crescent just inside the upper-left edge of broad shapes
function shineLoops(sdf) {
  const G = new Float32Array(NN).fill(1)
  const di = Math.round(U.SHINE_DX / H), dj = Math.round(U.SHINE_DY / H)
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = j * N + i, a = sdf[k] + U.SHINE_IN
    const ii = i - di, jj = j - dj
    const b = (ii < 0 || jj < 0) ? 9 : sdf[jj * N + ii] + U.SHINE_IN
    G[k] = Math.max(a, -b)
  }
  return F.trace(G, 0.04, 0.4)
}
// pumpkin ribs: two bowed lines down a round body, kept well inside (clear of the edge and of every hole)
function ribsD(sdf, cx, cy, w, h) {
  let d = ''
  for (const sx of [-1, 1]) {
    let open = false, seg = 0, part = ''
    for (let t = 0; t <= 1.0001; t += 0.04) {
      const y = cy - h * 0.5 + h * t, x = cx + sx * (w * 0.17 + Math.sin(t * Math.PI) * w * 0.1)
      const ok = sAt(sdf, x, y) < -1.15
      if (ok) { part += (open ? 'L' : 'M') + num(x) + ' ' + num(y); open = true; seg++ }
      else { if (seg >= 6) d += part; part = ''; open = false; seg = 0 }
    }
    if (seg >= 6) d += part
  }
  return d
}
// a crescent moon (outer disc minus a bite) as one path
function moonD(x, y, R) {
  const bx = x + R * 0.5, by = y - R * 0.32, br = R * 0.86
  const d = Math.hypot(bx - x, by - y)
  const a = (R * R - br * br + d * d) / (2 * d), h = Math.sqrt(Math.max(R * R - a * a, 0))
  const mx = x + a * (bx - x) / d, my = y + a * (by - y) / d
  const p1 = [mx + h * (by - y) / d, my - h * (bx - x) / d], p2 = [mx - h * (by - y) / d, my + h * (bx - x) / d]
  return `M${num(p1[0])} ${num(p1[1])}A${num(R)} ${num(R)} 0 1 0 ${num(p2[0])} ${num(p2[1])}A${num(br)} ${num(br)} 0 0 1 ${num(p1[0])} ${num(p1[1])}Z`
}

// ---------------------------------------------------------------------------
export function halloweenNodes(icon) {
  const name = icon.name || 'icon', tune = TUNE[name] || {}
  const id = n => `wg-halloween-${name}-${n}`, url = n => `url(#${id(n)})`
  let plates = [], mass = null
  try { LAST.mass = null; plates = solidPlates(icon); mass = LAST.mass } catch { plates = []; mass = null }
  if (!plates.some(p => p.loops.length)) return fallback(icon)
  const live = !!icon.params
  // people avatars: skin / hair / headwear / clothing / gear pieces (_halloween-people.mjs): the face is skin in a
  // night light (c1 lit centre, shadow at the edge, the moonlit shine), hair c2 -> c3, a costume in c4
  let person = null
  if (!live && mass && isPerson(icon)) {
    try {
      const pf = partFields(icon, mass, F)
      const pieces = pf ? Object.entries(pf).map(([part, G]) => ({ part, G, loops: F.trace(G, SK.TOL, 0.3) })).filter(p => p.loops.length) : []
      if (pieces.some(p => p.part === 'skin')) {
        const Mm = new Float32Array(mass.length).fill(9)
        for (const p of pieces) for (let k = 0; k < Mm.length; k++) if (p.G[k] < Mm[k]) Mm[k] = p.G[k]
        mass = Mm
        plates = pieces.map(p => ({ plate: p.part === 'skin' ? 'K' : 'A', part: p.part, loops: p.loops }))
        person = personTones(icon)
      }
    } catch { person = null }
  }
  const pv = r => `var(--with-halloween-${r}, ${person[r]})`
  const matName = live ? 'pumpkin' : materialOf(name)
  const M = MAT[matName] || MAT.pumpkin
  const all = plates.flatMap(p => p.loops)
  const outer = outerOf(all)
  const box = bboxOf(all)
  const [x0, y0, x1, y1] = live ? [3, 3, 21, 21] : box
  const w = x1 - x0, h = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2

  const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
  const R = Math.max(w, h)
  const defs = [
    // 0: body, lit from inside and from the upper left
    ['radialGradient', { id: id(0), cx: f2(cx), cy: f2(cy + h * 0.08), r: f2(R * 0.66), fx: f2(cx - w * 0.16), fy: f2(cy - h * 0.18), gradientUnits: 'userSpaceOnUse' },
      person ? [st(0, pv('tint')), st(0.3, pv('c1')), st(0.62, pv('c1')), st(1, pv('shadow'))] : [st(0, M.stops[0]), st(0.45, M.stops[1]), st(1, M.stops[2])]],
    // 1: candle light in the carved details: a hot centre, warm edges
    ['radialGradient', { id: id(1), cx: f2(cx), cy: f2(cy + h * 0.1), r: f2(R * 0.62), gradientUnits: 'userSpaceOnUse' },
      [st(0, C.tint), st(0.5, C.accent), st(1, C.c1)]],
    // 2: halo
    ['radialGradient', { id: id(2), cx: f2(cx), cy: f2(cy + h * 0.05), r: f2(Math.min(12, R * 0.62 + 2.5)), gradientUnits: 'userSpaceOnUse' },
      [st(0, C.accent, U.HALO), st(0.55, C.accent, U.HALO * 0.45), st(1, C.accent, 0)]],
  ]
  const out = [['defs', {}, defs]]
  out.push(['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }])

  // a moon behind round objects
  let moon = null, roundish = !!tune.ribs
  if (!live && tune.moon !== false) {
    const big = outer.reduce((m, l) => Math.abs(area(l)) > Math.abs(area(m || [])) ? l : m, null)
    if (big) {
      let per = 0
      for (let i = 0; i < big.length; i++) { const a = big[i], b = big[(i + 1) % big.length]; per += Math.hypot(b[0] - a[0], b[1] - a[1]) }
      const roundness = 4 * Math.PI * Math.abs(area(big)) / (per * per)
      const fillC = Math.abs(area(big)) / (Math.PI * (Math.max(w, h) / 2) ** 2)
      if (roundness > 0.8 && w > 11 && h > 11) roundish = true
      if (tune.moon || (rng(name + ':moon')() < U.MOON_SHARE && roundness > 0.92 && fillC > 0.86 && fillC < 1.04 && w > 12 && h > 12)) moon = true
    }
  }
  if (moon) {
    const mx = Math.min(x1, 20.8), my = Math.max(y0 + 0.4, 3.2)
    moon = [mx, my]
    out.push(['path', { d: moonD(mx, my, 3.1), fill: C.tint, stroke: C.ink, 'stroke-width': 0.4, class: 'wm-deco' }])
  }

  if (!live) {
    // drop shadow (people: in ink, their shadow role is the skin's shade)
    const sh = outer.map(l => l.map(([x, y]) => [x + 0.15, y + 0.85]))
    out.push(['path', { d: loopsD(sh), fill: person ? C.ink : C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }])
    // candle light behind the carved details
    if (!person) out.push(['path', { d: loopsD(outer), fill: tune.holes === 'dark' ? C.ink : url(1), class: 'wm-shine' }])
  }
  // people: the skeleton's fills under the pieces (gaps show the part behind), the eyes and mouth in ink
  let pFill = null, pHoles = []
  if (person) {
    const skin = plates.filter(p => p.part === 'skin').flatMap(p => p.loops)
    const hairL = plates.filter(p => p.part === 'hair').flatMap(p => p.loops)
    const hb = bboxOf(hairL.length ? hairL : [[[4, 2], [20, 12]]])
    if (hairL.length || fillParts(icon).includes('hair')) defs.push(['linearGradient', { id: id(3), x1: f2(hb[0]), y1: f2(hb[1]), x2: f2(hb[2]), y2: f2(hb[3]), gradientUnits: 'userSpaceOnUse' }, [st(0, pv('c2')), st(1, pv('c3'))]])
    pFill = { skin: url(0), hair: url(3), wear: pv('c2'), cloth: pv('c4'), gear: C.accent }
    for (const b of fillBacking(icon)) out.push(['path', { d: loopsD(b.rings), fill: pFill[b.part] || url(0), 'fill-rule': 'evenodd', class: b.part === 'skin' ? 'wm-k' : 'wm-a' }])
    pHoles = eyeCuts(icon)
    const holes = skin.filter(l => area(l) > 0 && area(l) < 8).concat(pHoles.map(e => e.ring))
    if (holes.length) out.push(['path', { d: loopsD(holes), fill: C.ink, class: 'wm-k' }])
  }

  // field views shared by the eyes and the critter
  let D = null, O = null
  if (!live && mass) {
    try { D = F.redistance(mass, all, 3.0); O = outsideMask(mass) } catch { D = null }
  }
  // eyes peeking from one dark hole (drawn under the body, so the hole's edge stays crisp)
  let eyes = null
  if (D && tune.eyes !== false && !person) {
    try {
      const e = eyeHole(D, O, all, cy - 0.5)
      if (e && (tune.eyes || rng(name + ':eyes')() < U.EYES)) eyes = e
    } catch { eyes = null }
  }
  if (eyes) out.push(['path', { d: loopsD([eyes.hole]), fill: C.ink, class: 'wm-shine' }])

  const ink = { stroke: M.line, 'stroke-width': U.INK, 'stroke-linejoin': 'round' }
  for (const p of plates) {
    const cls = p.plate === 'A' ? 'wm-a' : p.plate === 'S' ? 'wm-s' : 'wm-k'
    if (live) {
      out.push(['path', { d: loopsD(p.loops), fill: p.plate === 'K' ? C.c2 : p.plate === 'A' ? C.c3 : C.c4, 'fill-rule': 'evenodd', class: cls }])
      const o = outerOf(p.loops)
      if (o.length) out.push(['path', { d: loopsD(o), fill: 'none', stroke: C.ink, 'stroke-width': U.INK, 'stroke-linejoin': 'round', class: cls }])
      continue
    }
    const fill = person ? (pFill[p.part] || url(0)) : p.plate === 'A' ? (tune.A === 'body' ? url(0) : M.A) : p.plate === 'S' ? C.c4 : url(0)
    out.push(['path', { d: loopsD(p.loops), fill, 'fill-rule': 'evenodd', ...ink, class: cls }])
  }
  if (live || !mass) return out

  if (eyes) {
    const s = Math.min(1.25, Math.max(0.8, eyes.r / 1.5))
    out.push(['path', { d: eyesD(eyes.x, eyes.y, s), fill: C.c4, class: 'wm-deco' }])
  }

  // pumpkin ribs and the shine
  try {
    const sdf = D || F.redistance(mass, all, 3.0)
    if (matName === 'pumpkin' && (moon || roundish) && !person) {
      const rd = ribsD(sdf, cx, cy, w, h)
      if (rd) out.push(['path', { d: rd, fill: 'none', stroke: C.c2, 'stroke-width': 0.55, 'stroke-linecap': 'round', 'stroke-opacity': 0.75, class: 'wm-k' }])
    }
    if (M.shine > 0) {
      const sh = shineLoops(sdf)
      if (sh.length) out.push(['path', { d: loopsD(sh.map(l => simplify(l, 0.05, true))), fill: C.shine, 'fill-opacity': M.shine, class: 'wm-shine' }])
    }
  } catch { /* no shine */ }

  // people: a candle-lit catch-light in each eye, so the eyes read on deep skin too
  if (person && pHoles.length) {
    let cl = ''
    for (const e of pHoles) { const [x, y, r] = catchLight(e.box); cl += discD(x, y, r) }
    if (cl) out.push(['path', { d: cl, fill: C.tint, class: 'wm-shine' }])
  }
  // goo on the object's lowest broad edge
  try {
    const k = plates.findIndex(p => p.plate === 'K')
    if (k >= 0 && !person) {
      const G = F.region(plates[k].loops, 0.3)
      const g = gooSite(G, mass, name, box)
      if (g) {
        const gl = gooLoops(plates[k].loops, g)
        if (gl.length) {
          out.push(['path', { d: loopsD(gl), fill: M.goo || C.c4, stroke: M.line, 'stroke-width': U.INK * 0.85, 'stroke-linejoin': 'round', class: 'wm-deco' }])
          let hd = ''
          for (const s of g.sites) hd += discD(s.x - 0.32, s.y + s.len - 0.3, 0.26)
          out.push(['path', { d: hd, fill: C.shine, 'fill-opacity': 0.85, class: 'wm-deco' }])
        }
      }
    }
  } catch { /* no goo */ }

  // one critter in the free space, on some icons
  if (D && tune.critter !== false) {
    try {
      const Rr = rng(name + ':critter')
      const s = freeSpot(D, O)
      if (s && (tune.critter || Rr() < U.CRITTER)) {
        let kind = tune.critter || (Rr() < 0.55 ? 'bat' : 'spider')
        // a spider needs a clear thread up to the top
        if (kind === 'spider') {
          for (let y = s.y - 1; y >= 0.8; y -= 0.2) if (s.at(s.x, y) < 0.5) { kind = 'bat'; break }
        }
        if (moon && Math.hypot(s.x - moon[0], s.y - moon[1]) < 6) kind = null
        if (kind) out.push(...critter(kind, s, 0.6))
      }
    } catch { /* no critter */ }
  }
  return out
}

// never render empty: the centrelines in the body colour with the ink outline under them
export function fallback(icon) {
  const ps = (icon.paths || []).filter(p => p && p.d)
  const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  return [
    ...ps.map(p => ['path', { d: p.d, ...round, stroke: C.ink, 'stroke-width': 2.8, class: 'wm-k' }]),
    ...ps.map(p => ['path', { d: p.d, ...round, stroke: C.c1, 'stroke-width': 1.8, class: 'wm-k' }]),
  ]
}
