// UTSAV core — Indian festive / ethnic icons (Diwali, Durga Puja, ethnic craft).
//
// Layers, back to front:
//   BADGE    compact signals (S plate) sit on a scalloped gold ring of petals                         wm-s
//   BODY     the Solid mass (fills + round strokes, crisp knockouts) in a warm festive gradient,
//            A parts in a second festive colour, S parts in a third, every piece with a deep ink
//            outline                                                                               wm-k / wm-a / wm-s
//   GOLD     the double outline: a fine gold line inside the outline of every broad shape          wm-shine
//   BORDER   a saree border: small temple arches hanging from the gold line, a bindu under each tip
//            (big shapes only; skipped wherever the shape is too tight)                              wm-shine
//   ROSETTE  a rangoli rosette (eight petals round a bindu) in the open centre of a broad shape     wm-shine
//   MARIGOLD one small marigold in free space, only on icons where it means something (sun, flame,
//            star, gift, sparkles, lightbulb, cake, music-note, heart)                              wm-deco
// Live icons (icon.params) keep a plain saffron body, the outer ink outline and badge rings only: their values and text stay clean.
// The mass comes from a private copy of the Solid builder (_utsav-solid.mjs); offsets are traced on its
// signed distance field (_utsav-sfield.mjs, negative = ink).
import { solidPlates, LAST, K as SK } from './_utsav-solid.mjs'
import { isPerson, partFields, personTones, fillBacking, eyeCuts, catchLight } from './_utsav-people.mjs'
import * as F from './_utsav-sfield.mjs'
import { area, simplify, pointInRing } from '../kernel/geom.mjs'

export const U = {
  INK: 0.62,        // outline width (centred on the edge)
  GOLD_IN: 0.82,    // the gold line runs this far inside the edge ...
  GOLD_W: 0.36,      // ... this thick
  GOLD_MIN: 0.45,   // shapes thinner than 2x this carry no gold line
  DEEP: 6.5,        // reach of the exact inner distance (the rosette needs the deepest point)
  ARCH_SP: 1.9,     // saree-border arches: span along the gold line ...
  ARCH_D: 0.62,     // ... depth into the shape ...
  ARCH_W: 0.3,      // ... line weight
  ARCH_DOT: 0.55,   // a bindu this far below each arch tip ...
  BINDU: 0.3,       // ... of this radius
  ARCH_MIN: 10.5,    // a gold-line loop smaller than this (a sun's disc, a head) carries no arch border
  ROSE_CLEAR: 2.7,  // the centre rosette keeps this clear of the edge (room for the border)
  ROSE_MAX: 3.1,    // rosette radius cap ...
  ROSE_MIN: 1.25,   // ... and the smallest worth drawing
  ROS_R: 0.78,      // rosette petal radius
  ROS_SP: 1.15,     // petal spacing along the badge outline
}

// role variables (forge/PALETTES.md roles) with the Diwali defaults
export const C = {
  ink: 'var(--with-utsav-ink, #3B0A45)',       // deep plum outline
  c1: 'var(--with-utsav-c1, #F59E0B)',         // marigold: the body
  c2: 'var(--with-utsav-c2, #F97316)',         // saffron: the body's warm end
  c3: 'var(--with-utsav-c3, #E11D74)',         // rani pink: A parts, accents
  c4: 'var(--with-utsav-c4, #0F766E)',         // peacock teal: S parts
  accent: 'var(--with-utsav-accent, #D4A017)', // gold: rosettes, flame
  edge: 'var(--with-utsav-edge, #F4C95D)',     // light gold: the inner double line
  shine: 'var(--with-utsav-shine, #FFF4DC)',   // cream: bindu dot-work
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
export const f2 = v => +(+v).toFixed(2)
export const discD = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
export function bboxOf(loops) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const l of loops) for (const [x, y] of l) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y }
  return isFinite(x0) ? [x0, y0, x1, y1] : [4, 4, 20, 20]
}

// the mass offset inward by `inset`, with parts thinner than 2*minHalf dropped
function inner(mass, inset, minHalf, minArea = 0.6) {
  const G = new Float32Array(mass.length)
  for (let k = 0; k < G.length; k++) G[k] = mass[k] + inset
  return F.trace(F.open(G, minHalf), 0.04, minArea)
}

// evenly spaced points along a closed loop (none when it is too short for `min` of them)
function along(loop, sp, min = 4) {
  const n = loop.length, seg = []
  let L = 0
  for (let i = 0; i < n; i++) { const a = loop[i], b = loop[(i + 1) % n], l = Math.hypot(b[0] - a[0], b[1] - a[1]); seg.push(l); L += l }
  const k = Math.round(L / sp)
  if (k < min) return []
  const step = L / k, out = []
  let i = 0, acc = 0
  for (let q = 0; q < k; q++) {
    const t = (q + 0.5) * step
    while (i < n - 1 && acc + seg[i] < t) { acc += seg[i]; i++ }
    const a = loop[i], b = loop[(i + 1) % n], u = seg[i] ? (t - acc) / seg[i] : 0
    out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u])
  }
  return out
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
function freeSpots(mass, loops) {
  const D = F.redistance(mass, loops, 3.3), O = outsideMask(mass)
  const at = (x, y) => {
    const i = Math.round(x / F.H), j = Math.round(y / F.H)
    if (i < 0 || j < 0 || i >= F.N || j >= F.N) return 3.3
    return O[j * F.N + i] ? D[j * F.N + i] : -1
  }
  const cands = []
  for (let y = 2.5; y <= 21.5; y += 0.25) for (let x = 2.5; x <= 21.5; x += 0.25) {
    const d = at(x, y)
    if (d < 1.6) continue
    const r = Math.min(d - 0.9, 1.9, x - 1.4, 22.6 - x, y - 1.6, 22.4 - y)
    if (r >= 0.8) cands.push({ x, y, r })
  }
  const out = []
  let best = null, bs = -Infinity
  for (const c of cands) {
    if (c.r < 1.1) continue
    const s = c.r * 1.6 + 0.07 * (c.x - 12) - 0.15 * (c.y - 12)
    if (s > bs) { bs = s; best = c }
  }
  if (!best) return out
  out.push(best)
  let sec = null; bs = -Infinity
  for (const c of cands) {
    const g = Math.hypot(c.x - best.x, c.y - best.y) - best.r - c.r
    if (g < 2.5) continue
    const s = c.r * 1.2 - 0.12 * Math.hypot(c.x - 12, c.y - 12) - 0.25 * Math.max(0, c.y - 12)
    if (s > bs) { bs = s; sec = c }
  }
  if (sec && sec.r >= 1.5) out.push(sec)
  return out
}
// a diya flame: a teardrop with its tip up
export function flameD(cx, cy, r) {
  const n = num, h = r * 1.35
  return `M${n(cx)} ${n(cy - h)}C${n(cx + r * 0.95)} ${n(cy - r * 0.25)} ${n(cx + r * 0.8)} ${n(cy + r * 0.85)} ${n(cx)} ${n(cy + r * 0.85)}` +
    `C${n(cx - r * 0.8)} ${n(cy + r * 0.85)} ${n(cx - r * 0.95)} ${n(cy - r * 0.25)} ${n(cx)} ${n(cy - h)}z`
}

// ---------------------------------------------------------------------------
export function utsavNodes(icon) {
  const id = n => `wg-utsav-${icon.name || 'icon'}-${n}`, url = n => `url(#${id(n)})`
  let plates = [], mass = null
  try { LAST.mass = null; plates = solidPlates(icon); mass = LAST.mass } catch { plates = []; mass = null }
  const live = !!icon.params
  // people avatars: one piece per part (skin, hair / headwear, clothing, gear) in natural colours (_utsav-people.mjs)
  let person = null
  if (!live && mass && isPerson(icon)) {
    try {
      const pf = partFields(icon, mass, F)
      const pieces = pf ? Object.entries(pf).map(([part, G]) => ({ part, G, loops: F.trace(G, SK.TOL, 0.3) })).filter(p => p.loops.length) : []
      if (pieces.some(p => p.part === 'skin')) {
        const M = new Float32Array(mass.length).fill(9)
        for (const p of pieces) for (let k = 0; k < M.length; k++) if (p.G[k] < M[k]) M[k] = p.G[k]
        mass = M
        plates = pieces.map(p => ({ plate: p.part === 'skin' ? 'K' : 'A', part: p.part, loops: p.loops }))
        person = personTones(icon)
      }
    } catch { person = null }
  }
  const loops = plates.flatMap(p => p.loops)
  if (!loops.length) return fallback(icon)
  const [x0, y0, x1, y1] = live ? [3, 3, 21, 21] : bboxOf(loops)
  const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
  const out = [['defs', {}, [
    ['linearGradient', { id: id(0), x1: f2((x0 + x1) / 2 - 3), y1: f2(y0), x2: f2((x0 + x1) / 2 + 3), y2: f2(y1), gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(1, C.c2)]],
  ]]]
  const ink = { stroke: C.ink, 'stroke-width': U.INK, 'stroke-linejoin': 'round' }
  if (person) return personNodes(icon, plates, mass, loops, person, id, url, ink)
  // rosettes behind the signals
  for (const p of plates) {
    if (p.plate !== 'S') continue
    let d = ''
    for (const l of p.loops) {
      if (area(l) >= 0) continue
      // only a compact badge blooms into a rosette (a slash or a long bar stays plain)
      const [bx0, by0, bx1, by1] = bboxOf([l]), w = bx1 - bx0, h = by1 - by0
      let per = 0
      for (let i = 0; i < l.length; i++) { const a = l[i], b = l[(i + 1) % l.length]; per += Math.hypot(b[0] - a[0], b[1] - a[1]) }
      // compactness 4*pi*A/P^2: a disc is 1, a plus about .5, a slash bar under .4
      if (Math.min(w, h) < 3.6 || 4 * Math.PI * Math.abs(area(l)) / (per * per) < 0.42) continue
      for (const [x, y] of along(l, U.ROS_SP, 5)) d += discD(x, y, U.ROS_R)
    }
    if (d) out.push(['path', { d, fill: C.accent, ...ink, 'stroke-width': U.INK * 0.8, class: 'wm-s' }])
  }
  for (const p of plates) {
    const cls = p.plate === 'A' ? 'wm-a' : p.plate === 'S' ? 'wm-s' : undefined
    // live icons: body and badges in the deeper saffron, so values knocked out of them (or set free beside them)
    // keep their contrast on white and on dark
    // keep their contrast on white and on dark; the ink outline runs round the outside only (an outline round
    // every knocked-out letter would close its counters)
    const fill = live ? C.c2 : p.plate === 'A' ? C.c3 : p.plate === 'S' ? C.c4 : url(0)
    if (!live) { out.push(['path', { d: loopsD(p.loops), fill, 'fill-rule': 'evenodd', ...ink, class: cls }]); continue }
    out.push(['path', { d: loopsD(p.loops), fill, 'fill-rule': 'evenodd', class: cls }])
    // outer edges only: not the holes, and not the islands inside them (a letter's counter)
    const holes = loops.filter(l => area(l) > 0)
    const outer = p.loops.filter(l => area(l) < 0 && !holes.some(h => pointInRing(l[0], h)))
    if (outer.length) out.push(['path', { d: loopsD(outer), fill: 'none', ...ink, class: cls }])
  }
  if (!mass) return used(out)
  // the mass field is clamped near the edge: an exact signed distance for the inner offsets
  let sdf = null
  try { sdf = F.redistance(mass, loops, U.DEEP) } catch { return used(out) }
  let gold = []
  try {
    gold = inner(sdf, U.GOLD_IN, U.GOLD_MIN).map(l => simplify(l, 0.03, true))
    // live icons: no gold line (it would run round a value's letters and close their counters)
    if (live) gold = []
    if (gold.length) out.push(['path', { d: loopsD(gold), fill: 'none', stroke: C.edge, 'stroke-width': U.GOLD_W, 'stroke-linejoin': 'round', class: 'wm-shine' }])
  } catch { /* no gold line */ }
  if (live) return used(out)
  let arch = null
  try { arch = arches(sdf, gold) } catch { arch = null }
  if (arch && arch.d) {
    out.push(['path', { d: arch.d, fill: 'none', stroke: C.edge, 'stroke-width': U.ARCH_W, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shine' }])
    if (arch.dots) out.push(['path', { d: arch.dots, fill: C.shine, class: 'wm-shine' }])
  }
  try {
    const m = rosette(sdf)
    if (m) out.push(...m)
  } catch { /* no rosette */ }
  if (MEANING.has(icon.name)) {
    try {
      const sp = freeSpots(mass, loops)[0]
      if (sp) out.push(...marigold(sp.x, sp.y, Math.min(sp.r, 1.6)))
    } catch { /* no accent */ }
  }
  return used(out)
}

// ---------------------------------------------------------------------------
// people: skin in c1 lit from above by a warm diya glow (tint -> c1 -> a touch of shadow at the chin), hair c2 -> c3,
// headwear c2, clothing c4 (a festive kurta colour) with the gold double line, headphone cups gold (accent).
// Eyes and mouth are ink with a cream catch-light, so they read on light and on deep skin.
function personNodes(icon, plates, mass, loops, t, id, url, ink) {
  const v = r => `var(--with-utsav-${r}, ${t[r]})`
  const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
  const skin = plates.filter(p => p.part === 'skin').flatMap(p => p.loops)
  const [sx0, sy0, sx1, sy1] = bboxOf(skin)
  const hairL = plates.filter(p => p.part === 'hair' || p.part === 'wear').flatMap(p => p.loops)
  const [hx0, hy0, hx1, hy1] = hairL.length ? bboxOf(hairL) : [4, 2, 20, 12]
  const defs = [
    ['linearGradient', { id: id(0), x1: f2((sx0 + sx1) / 2), y1: f2(sy0), x2: f2((sx0 + sx1) / 2 + 1.5), y2: f2(sy1 + (sy1 - sy0) * 0.9), gradientUnits: 'userSpaceOnUse' },
      [st(0, v('tint')), st(0.38, v('c1')), st(1, v('shadow'))]],
    ['linearGradient', { id: id(1), x1: f2(hx0), y1: f2(hy0), x2: f2(hx1), y2: f2(hy1), gradientUnits: 'userSpaceOnUse' }, [st(0, v('c2')), st(1, v('c3'))]],
  ]
  const out = [['defs', {}, defs]]
  const fillOf = { skin: url(0), hair: url(1), wear: v('c2'), cloth: v('c4'), gear: C.accent }
  // the skeleton's fills under the pieces: gaps inside the person show the part behind, not paper
  for (const b of fillBacking(icon)) out.push(['path', { d: loopsD(b.rings), fill: fillOf[b.part] || url(0), 'fill-rule': 'evenodd', class: b.part === 'skin' ? 'wm-k' : 'wm-a' }])
  // eyes and mouth: the face's small holes backed in ink
  const holes = skin.filter(l => area(l) > 0 && area(l) < 8)
  const eyes = eyeCuts(icon)
  if (holes.length || eyes.length) out.push(['path', { d: loopsD([...holes, ...eyes.map(e => e.ring)]), fill: C.ink, class: 'wm-k' }])
  for (const part of ['skin', 'hair', 'wear', 'cloth', 'gear']) {
    const L = plates.filter(p => p.part === part).flatMap(p => p.loops)
    if (L.length) out.push(['path', { d: loopsD(L), fill: fillOf[part], 'fill-rule': 'evenodd', ...ink, class: part === 'skin' ? 'wm-k' : 'wm-a' }])
  }
  // the gold double line inside the hair and the clothing (the face stays clean: a gold ring would read as make-up)
  try {
    const notSkin = plates.filter(p => p.part !== 'skin').flatMap(p => p.loops)
    if (notSkin.length) {
      const G = new Float32Array(mass.length).fill(9)
      const sdf = F.redistance(mass, loops, U.DEEP)
      const Fm = F.field(1)
      F.region(notSkin, 1, Fm)
      for (let k = 0; k < G.length; k++) G[k] = Fm[k] < 0 ? sdf[k] : 9
      const gold = inner(G, U.GOLD_IN, U.GOLD_MIN).map(l => simplify(l, 0.03, true))
      if (gold.length) out.push(['path', { d: loopsD(gold), fill: 'none', stroke: C.edge, 'stroke-width': U.GOLD_W, 'stroke-linejoin': 'round', class: 'wm-shine' }])
    }
  } catch { /* no gold line */ }
  // catch-lights in the eyes
  let cl = ''
  for (const e of eyes) { const [x, y, r] = catchLight(e.box); cl += discD(x, y, r) }
  if (cl) out.push(['path', { d: cl, fill: C.shine, class: 'wm-shine' }])
  return used(out)
}

// the body gradient is only declared when a node paints with it (live icons and drawings with no K mass use flat fills)
function used(out) {
  const [defs, ...rest] = out
  if (!defs || defs[0] !== 'defs') return out
  const refs = new Set()
  for (const [, a] of rest) for (const v of [a.fill, a.stroke]) { const m = /^url\(#(.+)\)$/.exec(String(v || '')); if (m) refs.add(m[1]) }
  const kids = defs[2].filter(g => refs.has(g[1].id))
  return kids.length ? [['defs', {}, kids], ...rest] : rest
}

// signed distance sample (nearest node)
const sAt = (G, x, y) => {
  const i = Math.round(x / F.H), j = Math.round(y / F.H)
  return (i < 0 || j < 0 || i >= F.N || j >= F.N) ? 9 : G[j * F.N + i]
}
// unit normal at q (from the previous and next points), pointing into the shape
function inward(G, prev, q, next) {
  let tx = next[0] - prev[0], ty = next[1] - prev[1]
  const l = Math.hypot(tx, ty) || 1
  tx /= l; ty /= l
  let nx = -ty, ny = tx
  if (sAt(G, q[0] + nx * 0.4, q[1] + ny * 0.4) > sAt(G, q[0] - nx * 0.4, q[1] - ny * 0.4)) { nx = -nx; ny = -ny }
  return [nx, ny]
}
// saree-border arches hanging from the gold line, a bindu under every arch tip; an arch is skipped where
// the shape is too tight for it (its tip and dot must sit well inside)
function arches(G, gold) {
  let d = '', dots = ''
  for (const l of gold) {
    if (area(l) >= 0) continue
    const [lx0, ly0, lx1, ly1] = bboxOf([l])
    if (Math.min(lx1 - lx0, ly1 - ly0) < U.ARCH_MIN) continue
    const P = along(l, U.ARCH_SP, 6)
    const n = P.length
    if (!n) continue
    let open = false
    for (let k = 0; k < n; k++) {
      const A = P[k], B = P[(k + 1) % n], M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
      const [nx, ny] = inward(G, A, M, B)
      const tip = [M[0] + nx * U.ARCH_D, M[1] + ny * U.ARCH_D], dot = [M[0] + nx * (U.ARCH_D + U.ARCH_DOT), M[1] + ny * (U.ARCH_D + U.ARCH_DOT)]
      // the chord must follow the contour (no arch across a corner) and the dot must fit
      const chordIn = sAt(G, M[0], M[1]) < -U.GOLD_IN + 0.35
      if (!chordIn || sAt(G, dot[0], dot[1]) > -(U.GOLD_IN + U.ARCH_D + U.ARCH_DOT) + 0.15) { open = false; continue }
      const c = [M[0] + nx * U.ARCH_D * 2, M[1] + ny * U.ARCH_D * 2]
      if (!open) d += 'M' + num(A[0]) + ' ' + num(A[1])
      d += 'Q' + num(c[0]) + ' ' + num(c[1]) + ' ' + num(B[0]) + ' ' + num(B[1])
      open = true
      dots += discD(dot[0], dot[1], U.BINDU)
      void tip
    }
  }
  return { d, dots }
}
// a rangoli rosette in the open centre of a broad shape: eight petals round a bindu
function rosette(G) {
  let best = 0, bx = 12, by = 12
  for (let j = 0; j < F.N; j += 2) for (let i = 0; i < F.N; i += 2) { const v = -G[j * F.N + i]; if (v > best) { best = v; bx = i * F.H; by = j * F.H } }
  const R = Math.min(best - U.ROSE_CLEAR, U.ROSE_MAX)
  if (R < U.ROSE_MIN) return null
  const n = 8, w = R * 0.34
  let d = ''
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2 - Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a)
    const tip = [bx + ca * R, by + sa * R], base = [bx + ca * R * 0.3, by + sa * R * 0.3]
    const m = [bx + ca * R * 0.62, by + sa * R * 0.62]
    const l1 = [m[0] - sa * w, m[1] + ca * w], l2 = [m[0] + sa * w, m[1] - ca * w]
    d += 'M' + num(base[0]) + ' ' + num(base[1]) + 'Q' + num(l1[0]) + ' ' + num(l1[1]) + ' ' + num(tip[0]) + ' ' + num(tip[1]) +
      'Q' + num(l2[0]) + ' ' + num(l2[1]) + ' ' + num(base[0]) + ' ' + num(base[1]) + 'z'
  }
  return [
    ['path', { d, fill: C.c3, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-shine' }],
    ['path', { d: discD(bx, by, Math.max(0.42, R * 0.24)), fill: C.edge, stroke: C.ink, 'stroke-width': 0.24, class: 'wm-shine' }],
  ]
}
// a small marigold: a ring of gold petals round a pink heart (accents only where they mean something)
// Festival icons where a marigold belongs: the puja (kalash, thali, toran garland, pandal), Diwali light and sweets
// (sky lantern, mithai, laddoo) and Holi's gulal. Marigold and lotus are flowers already, sparks (sparkler,
// firecracker) and the busy floor art (rangoli-pattern, alpana, holi-splash) stay uncluttered
const MEANING = new Set(['sun', 'flame', 'star', 'gift', 'sparkles', 'lightbulb', 'cake', 'music-note', 'heart', 'diya', 'lamp',
  'kalash', 'puja-thali', 'toran', 'pandal', 'sky-lantern', 'mithai-box', 'laddoo', 'gulal'])
function marigold(x, y, r) {
  r *= 0.85
  let d = ''
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; d += discD(x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, r * 0.38) }
  return [
    ['path', { d, fill: C.accent, stroke: C.ink, 'stroke-width': 0.3, class: 'wm-deco' }],
    ['path', { d: discD(x, y, r * 0.36), fill: C.c3, class: 'wm-deco' }],
  ]
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
