// KAWAII core: skeleton -> IconNode list. See kawaii.mjs for the concept.
import { parsePath, simplify, pointInRing } from '../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, intersectSets } from '../kernel/bool.mjs'
import { parseSegs, fillet, snapEnds, writeSubs, nums } from './_kawaii-path.mjs'
import { N, NN, H, gx, gi, segsOf, distField, maskOf, sample, contours } from './_kawaii-field.mjs'
import { placeFace, drawFace, cheeksD, ellipseD, heartD, sparkleD, discD, faceMetrics } from './_kawaii-face.mjs'
import { PALETTE, BLUSH, BLUSH_OPACITY, SHINE, ACCENT, SPARKLE, colorFor, NO_FACE, TUNE } from './_kawaii-tune.mjs'
import { textInfo } from './_live-text.mjs'

export const INK = 2.2          // outline weight
const R_INK = 1.75              // fillet radius of sharp corners (centreline)
const HALF = INK / 2
const TEXT_INK = 1.9            // Live-icon text (forge/styles/_live-text.mjs)
const BAND = 3.6           // fields only need to see this far (largest probe ~2.1u)

const v = ([role, hex], fb) => `var(--with-kawaii-${role}, ${fb || hex})`
const fillVar = i => v(PALETTE[i])
export function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }

const area = r => { let a = 0; for (let i = 0; i < r.length; i++) { const p = r[i], q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1] } return a / 2 }
const densify = (P, step) => {
  const out = [P[0]]
  for (let q = 1; q < P.length; q++) {
    const a = P[q - 1], b = P[q], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
    for (let k = 1; k <= n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n])
  }
  return out
}
const ringsOf = d => parsePath(d).filter(s => s.pts.length > 2).map(s => simplify(s.pts, 0.02, true)).filter(r => r.length > 2)

// compact polygon writer: M abs, l rel, z
export function ringsD(rings, tol = 0.03, minArea = 0.04) {
  let d = ''
  for (const r0 of rings) {
    if (r0.length < 3 || Math.abs(area(r0)) < minArea) continue
    const r = simplify(r0, tol, true)
    if (r.length < 3) continue
    const R = r.map(p => [Math.round(p[0] * 100), Math.round(p[1] * 100)])
    const rel = []
    for (let q = 1; q < R.length; q++) {
      const dx = R[q][0] - R[q - 1][0], dy = R[q][1] - R[q - 1][1]
      if (dx || dy) rel.push(dx / 100, dy / 100)
    }
    d += 'M' + nums([R[0][0] / 100, R[0][1] / 100]) + 'l' + nums(rel) + 'z'
  }
  return d
}

// what the last render decided (for QA scripts; never read by the renderer)
export let lastDebug = null
export function render(icon) {
  const name = String(icon.name || '')
  const tune = TUNE[name] || {}
  const h = hash(name)
  const out = []

  // ---- ink: every centreline, chubby-filleted -------------------------------
  const inkSubs = []
  const hide = new Set(tune.hide || [])
  for (const [pi, p] of (icon.paths || []).entries()) {
    if (hide.has(pi)) continue
    let subs = []
    try { subs = parseSegs(p.d) } catch { subs = [] }
    const text = !!textInfo(p)
    for (const s of subs) { s.plate = p.plate || 'K'; s.text = text; inkSubs.push(s) }
  }
  // Live-icon text keeps the font's crisp corners and a lighter pen: filleted at 2.2 it fills in
  const textSubs = inkSubs.filter(s => s.text), drawSubs = inkSubs.filter(s => !s.text)
  const corners = fillet(drawSubs, R_INK, HALF + 0.05)
  snapEnds(drawSubs, corners)
  const inkD = writeSubs(drawSubs)
  const textD = textSubs.length ? writeSubs(textSubs) : ''
  const inkLines = parsePath(inkD + textD).map(s => ({ pts: simplify(s.pts, 0.02, s.closed), closed: s.closed }))
  for (const s of inkSubs) if (s.dot) inkLines.push({ pts: [s.dot], closed: false })
  const sLines = []
  for (const s of inkSubs) if (s.plate === 'S' && !s.dot) for (const q of parsePath(writeSubs([s]))) sLines.push({ pts: q.pts, closed: q.closed })

  // ---- body: fills, filleted the same way; badge fills split off ------------
  const dInk = distField(segsOf(inkLines), BAND)
  const dS = sLines.length ? distField(segsOf(sLines), 2) : null
  const mainSets = [], sSets = [], dropped = []
  for (const f of icon.fills || []) {
    let subs = []
    try { subs = parseSegs(f.d || '') } catch { subs = [] }
    subs = subs.filter(s => s.closed || s.segs.length > 1)
    for (const s of subs) s.closed = true
    fillet(subs, R_INK)
    const rings = ringsOf(writeSubs(subs))
    if (!rings.length) continue
    // pastel only where the outline holds it: a fill whose edge mostly runs
    // away from any ink (a solid-style slab) would float un-outlined
    let near = 0, all = 0
    for (const r of rings) for (let q = 0; q < r.length; q += 2) { all++; if (sample(dInk, r[q][0], r[q][1]) < 1.3) near++ }
    if (tune.fills === false || (tune.fills !== true && all && near / all < 0.3)) { dropped.push(f.d); continue }
    const set = setOf(rings)
    if (!set.length) continue
    let onS = 0, tot = 0
    if (dS) for (const r of rings) for (const p of r) { tot++; if (sample(dS, p[0], p[1]) < 0.45) onS++ }
    ;(tot && onS / tot > 0.5 ? sSets : mainSets).push(set)
  }
  let main = mainSets.length ? unionSets(mainSets) : []
  const sBody = sSets.length ? unionSets(sSets) : []
  if (sBody.length && main.length) main = differenceSets(main, sBody)

  // cutouts with a visible area become a second candy colour
  let detail = []
  if (main.length) {
    const cuts = []
    const hideCuts = new Set(tune.hideCuts || [])
    for (const [ci0, c] of (icon.cutouts || []).entries()) {
      if (hideCuts.has(ci0)) continue
      const rings = (c.subs || []).filter(s => s.closed && s.pts.length > 2).map(s => simplify(s.pts, 0.02, true)).filter(r => r.length > 2)
      if (!rings.length) continue
      const m = maskOf(rings)
      let vis = 0
      for (let k = 0; k < NN; k++) if (m[k] && dInk[k] > HALF + 0.15) vis++
      if (vis * H * H >= 1.2) cuts.push(setOf(rings))
    }
    if (cuts.length) {
      const cut = unionSets(cuts)
      detail = intersectSets(main, cut)
      main = differenceSets(main, cut)
    }
  }

  // Parts choreography (forge/MOTION.md): the outline is written per skeleton plate when the icon has more than
  // one, so motion can move a part; the S badge body follows its plate. One plate stays a plain, untagged path.
  const plateOf = s => s.plate === 'A' || s.plate === 'S' ? s.plate : 'K'
  const inkPlates = ['K', 'A', 'S'].filter(P => drawSubs.some(s => plateOf(s) === P))
  const split = inkPlates.length > 1
  const ci = colorFor(name, h)
  const di = (ci + 3) % PALETTE.length
  const si = ci === 0 ? 5 : 0
  const paint = (set, i, cls) => {
    const d = ringsD(set)
    if (d) out.push(['path', { d, fill: fillVar(i), 'fill-opacity': PALETTE[i][2], stroke: 'none', 'fill-rule': 'evenodd', ...(cls ? { class: cls } : {}) }])
  }
  paint(main, ci)
  paint(detail, di)
  paint(sBody, si, split && inkPlates.includes('S') ? 'wm-s' : null)

  // ---- clearance field inside the main body ---------------------------------
  const mainRings = [...main, ...detail].filter(r => r.length > 2)
  let C = null, faceInfo = null, bodyArea = 0
  const contentPts = []
  if (mainRings.length) {
    const mask = maskOf(mainRings)
    const dEdge = distField(segsOf(mainRings.map(pts => ({ pts, closed: true }))), BAND)
    C = new Float32Array(NN)
    for (let k = 0; k < NN; k++) C[k] = mask[k] ? Math.min(dInk[k] - HALF, dEdge[k]) : -Math.min(dEdge[k], 1)
    // "content": ink drawn well inside the body (text lines, glyphs, dot grids)
    for (const l of inkLines) {
      const P = l.closed ? [...l.pts, l.pts[0]] : l.pts
      for (const p of P.length === 1 ? P : densify(P, 0.3)) {
        if (mask[gi(p[0]) + gi(p[1]) * N] && sample(dEdge, p[0], p[1]) > 1.3) contentPts.push(p)
      }
    }
    bodyArea = Math.abs(mainRings.reduce((a, r) => a + area(r), 0))
  }

  // ---- face ---------------------------------------------------------------
  // a face beside text (a date, a count, a label) reads as clutter: those get the heart / sparkle accent
  const wantFace = C && tune.face !== false && (tune.face || (!NO_FACE.test(name) && !textSubs.some(s => s.plate !== 'S')))
  if (wantFace) {
    try {
      if (tune.face && tune.face.x !== undefined && tune.face.y !== undefined) faceInfo = { x: tune.face.x, y: tune.face.y, s: tune.face.s || 0.8, blush: tune.face.blush !== false && tune.blush !== false }
      else {
        const tf = typeof tune.face === 'object' ? tune.face : {}
        faceInfo = placeFace(C, { sMax: tf.s, sMin: tf.sMin, near: tf.near })
        if (faceInfo && typeof tune.face === 'object') { faceInfo.x += tune.face.dx || 0; faceInfo.y += tune.face.dy || 0 }
        // a small face squeezed in beside a glyph reads as clutter, not charm
        else if (faceInfo && faceInfo.s < 0.95) {
          const R = 2.2 * faceInfo.s + 3
          if (contentPts.some(p => Math.hypot(p[0] - faceInfo.x, p[1] - faceInfo.y) < R)) faceInfo = null
        }
      }
    } catch { faceInfo = null }
  }
  lastDebug = { face: faceInfo, area: bodyArea, dropped: dropped.length, content: faceInfo && contentPts.length ? Math.min(...contentPts.map(p => Math.hypot(p[0] - faceInfo.x, p[1] - faceInfo.y))) : null }
  const expr = tune.expr || (['smile', 'smile', 'smile', 'cat', 'smile', 'joy', 'cat', 'smile'][h % 8])

  // cheeks sit under the ink
  if (faceInfo && faceInfo.blush && tune.blush !== false) {
    out.push(['path', { d: cheeksD(faceInfo), fill: v(BLUSH), 'fill-opacity': BLUSH_OPACITY, stroke: 'none' }])
  } else if (tune.cheeks) {
    const d = tune.cheeks.map(([x, y]) => ellipseD(x, y, 1.15, 0.7)).join('')
    out.push(['path', { d, fill: v(BLUSH), 'fill-opacity': BLUSH_OPACITY, stroke: 'none' }])
  }

  // shine: a short white arc on the lit (upper-left) inside of the body
  if (C) {
    try { const d = shine(C, faceInfo); if (d) out.push(['path', { d, stroke: v(SHINE), 'stroke-width': 0.85, 'stroke-opacity': 0.9, class: 'wm-shine' }]) } catch { /* optional */ }
  }

  if (inkD && split) {
    for (const P of inkPlates) {
      const d = writeSubs(drawSubs.filter(s => plateOf(s) === P))
      if (d) out.push(['path', { d, class: 'wm-' + P.toLowerCase() }])
    }
  } else if (inkD) out.push(['path', { d: inkD }])
  if (textD) out.push(['path', { d: textD, 'stroke-width': TEXT_INK }])

  if (faceInfo) {
    const f = drawFace(faceInfo, expr)
    const ink = 'var(--with-kawaii-face, currentColor)'
    if (f.fill) out.push(['path', { d: f.fill, fill: ink, stroke: 'none' }])
    if (f.stroke) out.push(['path', { d: f.stroke, stroke: ink, 'stroke-width': Math.round(f.lw * 100) / 100 }])
    if (f.shine) out.push(['path', { d: f.shine, fill: v(SHINE), stroke: 'none', class: 'wm-shine' }])
  } else if (tune.accent !== false && inkLines.length) {
    try {
      const a = accent(dInk, inkLines, main, sBody, detail, tune.accent || (C ? 'heart' : (h & 1 ? 'sparkle' : 'heart')))
      if (a) out.push(a)
    } catch { /* optional */ }
  }
  return out
}

// ---- shine ------------------------------------------------------------------
const LIGHT = [-0.6, -0.8]   // unit vector toward the light (upper-left)
function shine(C, face) {
  const LV = 0.62
  const rings = contours(C, LV)
  if (!rings.length) return ''
  const fx = face ? faceMetrics(face.s) : null
  const inFace = (x, y) => face && Math.abs(x - face.x) < fx.bx + fx.brx + 0.7 && y > face.y - fx.er - 0.9 && y < face.y + fx.by + fx.bry + 0.8
  let best = null
  for (const r0 of rings) {
    if (Math.abs(area(r0)) < 3) continue
    // the inside of a ring-shaped body is a hole: never shine there
    if (rings.reduce((acc, o) => o !== r0 && pointInRing(r0[0], o) ? !acc : acc, false)) continue
    // resample at 0.1u
    const r = []
    for (let i = 0; i < r0.length; i++) {
      const a = r0[i], b = r0[(i + 1) % r0.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / 0.1))
      for (let q = 0; q < n; q++) r.push([a[0] + (b[0] - a[0]) * q / n, a[1] + (b[1] - a[1]) * q / n])
    }
    const n = r.length
    if (n < 20) continue
    const per = n * 0.1
    const want = Math.max(12, Math.min(34, Math.round(per * 0.16 / 0.1)))
    // smoothed outward normal: the field falls off outward
    // only the half of the ring facing the light can shine: a notch round an
    // inner glyph (a cat's nose) faces up-left too, but sits deep in the body
    let pLo = Infinity, pHi = -Infinity
    for (const p of r) { const q = p[0] * LIGHT[0] + p[1] * LIGHT[1]; if (q < pLo) pLo = q; if (q > pHi) pHi = q }
    const pCut = pLo + 0.5 * (pHi - pLo)
    const lit = r.map((p, k) => {
      if (p[0] * LIGHT[0] + p[1] * LIGHT[1] < pCut) return -9
      const a = r[(k - 4 + n) % n], b = r[(k + 4) % n]
      let tx = b[0] - a[0], ty = b[1] - a[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl
      let nx = -ty, ny = tx
      if (sample(C, p[0] + nx * 0.3, p[1] + ny * 0.3) > sample(C, p[0] - nx * 0.3, p[1] - ny * 0.3)) { nx = -nx; ny = -ny }
      const f = nx * LIGHT[0] + ny * LIGHT[1]
      return inFace(p[0], p[1]) ? -9 : f
    })
    // a hole ring (inside of a ring-shaped body) lights its lower-right instead: skip holes
    for (let i = 0; i < n; i++) {
      let sum = 0, mn = 9
      for (let k = 0; k < want; k++) { const f = lit[(i + k) % n]; sum += f; if (f < mn) mn = f }
      if (mn < 0.35) continue
      const score = sum / want + 0.004 * want
      if (!best || score > best.score) best = { score, pts: Array.from({ length: want }, (_, k) => r[(i + k) % n]) }
    }
  }
  if (!best) return ''
  const P = best.pts
  // smooth, then write as a polyline + a glint dot past the lower end
  const sm = P.map((_, q) => {
    let sx = 0, sy = 0, c = 0
    for (let o = -3; o <= 3; o++) { const p = P[Math.max(0, Math.min(P.length - 1, q + o))]; sx += p[0]; sy += p[1]; c++ }
    return [sx / c, sy / c]
  })
  const S = simplify(sm, 0.04)
  let d = 'M' + nums(S[0]) + S.slice(1).map(p => 'L' + nums(p)).join('')
  // glint dot: continue past the end lying further toward the lower-left
  const e0 = sm[0], e1 = sm[sm.length - 1]
  const lowA = e0[0] * 0.8 - e0[1] * 0.6 < e1[0] * 0.8 - e1[1] * 0.6
  const [e, nb] = lowA ? [e0, sm[Math.min(4, sm.length - 1)]] : [e1, sm[Math.max(0, sm.length - 5)]]
  let tx = e[0] - nb[0], ty = e[1] - nb[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl
  const g = [e[0] + tx * 1.05, e[1] + ty * 1.05]
  if (sample(C, g[0], g[1]) > 0.5 && !inFace(g[0], g[1])) d += 'M' + nums(g) + 'h0'
  return d
}

// ---- accent: a little heart or sparkle in free space ------------------------
function accent(dInk, inkLines, main, sBody, detail, kind) {
  // the accent floats beside the drawing, never inside it
  let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity
  for (const l of inkLines) for (const [x, y] of l.pts) { if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y }
  const outside = (x, y) => y < by0 - 0.2 || (x > bx1 + 0.2 && y < 12) || (x < bx0 - 0.2 && y < 9)
  const all = [...main, ...sBody, ...detail].filter(r => r.length > 2)
  const mask = all.length ? maskOf(all) : null
  const dB = all.length ? distField(segsOf(all.map(pts => ({ pts, closed: true }))), BAND) : null
  const O = new Float32Array(NN)
  for (let k = 0; k < NN; k++) {
    const x = gx(k % N), y = gx((k - k % N) / N)
    let c = dInk[k] - HALF
    if (mask && mask[k]) c = -1
    else if (dB) c = Math.min(c, dB[k])
    O[k] = Math.min(c, x - 0.7, 23.3 - x, y - 0.7, 23.3 - y)
  }
  // a body icon only gets an accent where it has real room; a bare glyph takes what it can
  const sizes = (kind === 'heart' ? [1.55, 1.4, 1.25, 1.1, 0.95] : [2.1, 1.9, 1.7, 1.5, 1.3]).slice(0, all.length ? 3 : 5)
  for (const z of sizes) {
    const need = kind === 'heart' ? [[0, 0, 0.95 * z + 0.55], [-0.55 * z, -0.5 * z, 0.5 * z + 0.55], [0.55 * z, -0.5 * z, 0.5 * z + 0.55], [0, 0.7 * z, 0.3 * z + 0.55]]
      : [[0, 0, 0.45 * z + 0.6], [0, -0.7 * z, 0.3 * z + 0.55], [0, 0.7 * z, 0.3 * z + 0.55], [-0.7 * z, 0, 0.3 * z + 0.55], [0.7 * z, 0, 0.3 * z + 0.55]]
    let best = null, bd = Infinity
    for (let k = 0; k < NN; k++) {
      if (O[k] < need[0][2]) continue
      const x = gx(k % N), y = gx((k - k % N) / N)
      if (!outside(x, y) || !need.every(([dx, dy, r]) => sample(O, x + dx, y + dy) >= r)) continue
      const d = (x - 19.6) ** 2 + (y - 4.4) ** 2
      if (d < bd - 1e-9) { bd = d; best = [x, y] }
    }
    if (best) {
      return kind === 'heart'
        ? ['path', { d: heartD(best[0], best[1], z), fill: v(ACCENT), stroke: 'none', class: 'wm-deco' }]
        : ['path', { d: sparkleD(best[0], best[1], z), fill: v(SPARKLE), stroke: 'none', class: 'wm-deco' }]
    }
  }
  return null
}
