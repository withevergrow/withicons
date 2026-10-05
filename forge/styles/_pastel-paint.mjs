// PASTEL paint — the hue swatches, the lighting model and the node writer shared by every path
// (exemplars, hand redraws, the automatic composer). Everything here is FROZEN for redrawers.
//
// A drawing reaches this file as a list of ENTRIES, painted in order (later on top):
//   { hue, mode, F, d?, part }
//     hue   a swatch name (HUES): lavender peach mint sky butter blush paper
//     mode  'lit'   a soft colour field: base fill + deeper hue rim + gentle deeper bottom plane
//                   + soft lighter top plane (the house look)
//           'flat'  base fill + rim only (small parts, thin bars)
//           'well'  a recessed inlay: base + rim + a soft shade under its top edge
//           'ink'   mid-tone detail ink, hue-matched to the field it sits on (no rim)
//           'shine' a specular glint (wm-shine)
//           'shade' a soft shadow tone laid over the fields below (fold shadows, gaps)
//     F     signed-distance field (_pastel-field.mjs: negative inside)
//     d     exact path data for the base (optional; traced from F otherwise)
//     part  'K' | 'A' | 'S' | 'deco' -> wm-k / wm-a / wm-s / wm-deco
//
// Colour roles (forge/lib/palette-map.mjs): c1 is the hue of the body (the largest K field), then
// the other hues take c2, c3, c4 (then accent) in the order they first appear. Every other role has a
// per-hue literal fallback, so the default rendering is hue-matched while one override recolours
// that role everywhere:
//   --with-pastel-c1..c4, accent   field colours (fallback: the swatch)
//   --with-pastel-tint             paper fields and the soft top plane (a light tone of the field's hue)
//   --with-pastel-edge             the rim, halfway between the field's base and deep tone
//   --with-pastel-shadow           the bottom plane and the cast shadow (deeper hue, translucent)
//   --with-pastel-ink              detail ink, a mid-tone of the field's hue
//   --with-pastel-shine            the specular glint (white)
import * as F from './_pastel-field.mjs'
import { simplify, area } from '../kernel/geom.mjs'

// base, deep (rim / bottom plane / cast shadow), ink (details on this hue)
export const HUES = {
  lavender: { base: '#CDBBF7', deep: '#9E87E6', ink: '#6A55B8' },
  peach:    { base: '#FFCBAF', deep: '#F09F7C', ink: '#B4613D' },
  mint:     { base: '#ABE6CD', deep: '#6EC8A4', ink: '#2F8865' },
  sky:      { base: '#B7D6FA', deep: '#7DAEEA', ink: '#3F70B2' },
  butter:   { base: '#FFE29C', deep: '#EDBD52', ink: '#A07222' },
  blush:    { base: '#FFC3D7', deep: '#F08FB3', ink: '#B54A76' },
  paper:    { base: '#FFFFFF', deep: '#CFC4EC', ink: '#6A55B8' },
}
// rim: halfway between base and deep; light: the field's own lighter tone (top plane)
const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
for (const H of Object.values(HUES)) { H.rim = mix(H.base, H.deep, 0.5); H.light = mix(H.base, '#FFFFFF', 0.62) }
HUES.paper.rim = HUES.paper.deep
export const HUE_NAMES = Object.keys(HUES)
// the style's default palette (for docs, the editor, palette tooling): lavender leads
export const PALETTE = {
  ink: HUES.lavender.ink, c1: HUES.lavender.base, c2: HUES.peach.base, c3: HUES.mint.base, c4: HUES.sky.base,
  accent: HUES.blush.base, tint: '#FFFFFF', shadow: HUES.lavender.deep, shine: '#FFFFFF', edge: HUES.lavender.rim,
}
export const ROLES = Object.keys(PALETTE)
export const v = (role, hex) => `var(--with-pastel-${role}, ${hex})`

// ---------------------------------------------------------------------------------
// the lighting model (u)
export const L = {
  RIM: 0.6,         // rim stroke width (half inside, half outside the field)
  BOT: 0.34,        // bottom plane opacity (deep hue)
  BOT_THIN: 0.22,   // bottom plane opacity on thin bars
  BD_MIN: 0.6, BD_MAX: 1.4, BD_K: 0.32,   // bottom plane depth: k * thickness, clamped
  TOP: [0.16, 0.18, 0.2],   // top plane: feathered tiers of the field's own light tone
  TOP_IN: 1.0,      // top plane inset from the field's edge
  TOP_OPEN: 0.6,    // parts of the inset field thinner than 2x this get no top plane
  TD_MIN: 1.2, TD_MAX: 3.2, TD_K: 0.5,   // top plane depth
  TOP_MIN: 3.3,     // fields thinner than this (bars) get no top plane: rim only
  DOT: 11,          // a field whose every blob is smaller than this (u^2) and thin is a solid dot
  WELL: 0.28,       // shade opacity under the top edge of a recessed inlay
  CAST: 0.18,       // cast shadow opacity
  CAST_DY: 0.5, CAST_DX: 0.15,             // cast shadow offset
  SHINE: 0.5,       // glint opacity
  SHADE: 0.22,      // 'shade' entries
  MARGIN: 3,        // field reach (u): every measurement above fits inside it
}
const cells = u => Math.round(u / F.H)

// ---------------------------------------------------------------------------------
// fields
// a field of closed rings with nonzero meaning: solids (positive area) unite, holes subtract
export function fieldOfRings(rings, margin = L.MARGIN) {
  const S = F.field(margin), Hh = F.field(margin)
  let holes = false
  for (const r of rings) {
    if (!r || r.length < 3) continue
    if (area(r) >= 0) F.region([r], margin, S)
    else { F.region([r], margin, Hh); holes = true }
  }
  if (holes) F.subtract(S, Hh)
  return S
}
export const minOf = G => { let m = Infinity; for (let i = 0; i < G.length; i++) if (G[i] < m) m = G[i]; return m }
export const anyInk = G => { for (let i = 0; i < G.length; i++) if (G[i] < 0) return true; return false }
export function inkArea(G) { let c = 0; for (let i = 0; i < G.length; i++) if (G[i] < 0) c++; return c * F.H * F.H }
const neg = G => { const o = new Float32Array(G.length); for (let i = 0; i < G.length; i++) o[i] = -G[i]; return o }
// points of A whose point (dx, dy) away lies outside A: the band of A facing (-dx, -dy)
function facing(A, dx, dy) {
  const S = F.shift(A, -cells(dx), -cells(dy), 1)
  return F.intersect(F.copy(A), neg(S))
}

// ---------------------------------------------------------------------------------
// output: compact relative path data from traced loops
const num = (val, dp) => {
  let s = (val / 10 ** dp).toFixed(dp)
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '')
  if (s === '-0') s = '0'
  return s.replace(/^(-?)0\./, '$1.')
}
const joinNums = arr => arr.reduce((acc, s) => acc + (acc && !s.startsWith('-') && !/[a-z]$/i.test(acc) ? ' ' : '') + s, '')
export function loopsD(loops, dp = 2) {
  const k = 10 ** dp
  let d = ''
  for (const ring of loops) {
    const P = ring.map(p => [Math.round(p[0] * k), Math.round(p[1] * k)])
    const Q = P.filter((p, i) => i === 0 || p[0] !== P[i - 1][0] || p[1] !== P[i - 1][1])
    if (Q.length > 1 && Q[0][0] === Q.at(-1)[0] && Q[0][1] === Q.at(-1)[1]) Q.pop()
    if (Q.length < 3) continue
    let s = 'M' + joinNums([num(Q[0][0], dp), num(Q[0][1], dp)])
    let last = 'M'
    for (let i = 1; i < Q.length; i++) {
      const dx = Q[i][0] - Q[i - 1][0], dy = Q[i][1] - Q[i - 1][1]
      let cmd, nums
      if (dy === 0) { cmd = 'h'; nums = [num(dx, dp)] }
      else if (dx === 0) { cmd = 'v'; nums = [num(dy, dp)] }
      else { cmd = 'l'; nums = [num(dx, dp), num(dy, dp)] }
      if (cmd === last) s += (nums[0].startsWith('-') ? '' : ' ') + joinNums(nums)
      else s += cmd + joinNums(nums)
      last = cmd
    }
    d += s + 'z'
  }
  return d
}
export const traceD = (G, tol = 0.04, min = 0.12, dp = 2) => loopsD(F.trace(F.copy(G), tol, min), dp)

// ---------------------------------------------------------------------------------
// the glint: a short curved dash following the field's contour, top-left, inset
function glint(G, thick) {
  const inset = Math.min(1.35, Math.max(0.9, thick * 0.26))
  // the glint rides only where the field is broad (never along a thin bar)
  const E = F.open(F.offset(F.copy(G), inset), 0.75)
  const loops = F.contour(E).filter(l => l.length > 8 && area(l) !== 0)
  let best = null
  for (const l of loops) {
    // outer loops only (the marching squares keep the inside on one side: pick the larger ones)
    if (Math.abs(area(l)) < 3) continue
    for (let i = 0; i < l.length; i++) {
      const p = l[i], s = p[0] * 0.75 + p[1]
      if (!best || s < best.s) best = { s, l, i }
    }
  }
  if (!best) return null
  // walk ±len along the loop
  const { l, i } = best, n = l.length
  const len = Math.min(1.5, Math.max(0.8, thick * 0.3))
  const walk = dir => {
    const out = []
    let acc = 0, k = i
    while (acc < len && out.length < n) {
      const a = l[k], b = l[(k + dir + n) % n]
      acc += Math.hypot(b[0] - a[0], b[1] - a[1])
      out.push(b); k = (k + dir + n) % n
    }
    return out
  }
  const back = walk(-1).reverse(), fwd = walk(1)
  const pts = simplify([...back, l[i], ...fwd], 0.02)
  const w = Math.min(0.9, Math.max(0.6, thick * 0.15))
  return F.strokes([{ pts, closed: false }], w, 0.6)
}

// every blob of the field is small and compact (a dot, a bullet)
function dotsOnly(G) {
  const cs = F.contour(F.copy(G)).filter(l => l.length > 2)
  if (!cs.length) return false
  for (const l of cs) {
    const a = Math.abs(area(l))
    if (a > L.DOT) return false
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
    for (const [x, y] of l) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y) }
    const w = x1 - x0, h = y1 - y0
    if (Math.max(w, h) > 1.6 * Math.min(w, h)) return false
  }
  return true
}

// how broad a field is (u): twice its deepest point, or, past the measured reach, 4 x area / perimeter
function thicknessOf(e) {
  const reach = e.reach || L.MARGIN, m = -minOf(e.F)
  if (m < reach - 0.1) return 2 * Math.max(0, m)
  let P = 0
  for (const l of F.contour(F.copy(e.F))) for (let i = 0; i < l.length; i++) { const a = l[i], b = l[(i + 1) % l.length]; P += Math.hypot(b[0] - a[0], b[1] - a[1]) }
  return Math.min(2 * L.MARGIN, Math.max(2 * reach, P ? 4 * inkArea(e.F) / P : 0))
}

// ---------------------------------------------------------------------------------
// entries -> IconNodes
const CLS = { K: 'wm-k', A: 'wm-a', S: 'wm-s', deco: 'wm-deco' }

export function paintEntries(entries, o = {}) {
  const live = entries.filter(e => e && e.F && anyInk(e.F))
  if (!live.length) return []
  // roles: c1 is the body's hue (the largest K field), then hues by first appearance -> c2..c4,
  // accent; paper is tint. A moving part painted first never takes the main colour.
  const role = new Map()
  const order = ['c1', 'c2', 'c3', 'c4', 'accent']
  const isField = e => ['lit', 'flat', 'well'].includes(e.mode || 'lit')
  const hueKey = e => HUES[e.hue] ? e.hue : 'lavender'
  let main = null, mainA = 0
  for (const pass of ['K', null]) {
    for (const e of live) {
      if (!isField(e) || hueKey(e) === 'paper' || e.part === 'deco' || (pass && (e.part || 'K') !== pass)) continue
      const a = inkArea(e.F)
      if (a > mainA) { main = e; mainA = a }
    }
    if (main) break
  }
  if (main) role.set(hueKey(main), 'c1')
  for (const e of live) {
    if (!isField(e)) continue
    const h = hueKey(e)
    if (h === 'paper' || role.has(h)) continue
    role.set(h, order[Math.min(role.size, order.length - 1)])
  }
  const roleOf = h => h === 'paper' ? 'tint' : role.get(h) || 'c1'
  if (!main) main = live.find(e => (e.mode || 'lit') !== 'ink' && e.hue !== 'paper') || live[0]
  const mainHue = HUES[main.hue] ? main.hue : 'lavender'
  const nodes = []
  const tag = (a, part) => { const c = CLS[part] || 'wm-k'; a.class = c; return a }

  // cast shadow under the object (not under decoration): wm-shadow
  if (o.cast !== false) {
    const U = F.field(L.MARGIN)
    let has = false
    // the body (K) casts it: moving parts (A) and badges (S) would leave a ghost when they move
    const body = live.filter(e => e.part !== 'deco' && ['lit', 'flat', 'well', 'ink'].includes(e.mode || 'lit'))
    const kOnly = body.filter(e => (e.part || 'K') === 'K')
    for (const e of kOnly.length ? kOnly : body) { F.union(U, e.F); has = true }
    if (has) {
      const S = F.shift(U, cells(L.CAST_DX), cells(L.CAST_DY), L.MARGIN)
      const d = traceD(S, 0.06, 0.2, 1)
      if (d) nodes.push(['path', { d, fill: v('shadow', HUES[mainHue].deep), 'fill-opacity': L.CAST, class: 'wm-shadow' }])
    }
  }
  // which lit field an ink entry sits on (topmost before it, by covered area)
  const hostOf = k => {
    const e = live[k]
    let best = null, bestA = 0.3
    for (let q = k - 1; q >= 0; q--) {
      const h = live[q]
      if (!['lit', 'flat', 'well'].includes(h.mode || 'lit')) continue
      const a = inkArea(F.intersect(F.copy(e.F), h.F))
      if (a > bestA) { best = h; bestA = a }
    }
    return best
  }
  let glinted = o.glint === false
  live.forEach((e, k) => {
    const mode = e.mode || 'lit'
    const hue = HUES[e.hue] ? e.hue : 'lavender'
    const H = HUES[hue]
    const part = e.part || 'K'
    if (mode === 'ink') {
      const host = hostOf(k)
      const d = e.d || traceD(e.F, 0.03, 0.05)
      if (!d) return
      // ink on a field: mid-tone of that hue; ink on the page: the deep tone of the main hue
      // (Live-icon TEXT on the page takes the main hue's ink lifted a quarter toward its deep tone: a mid-luminance
      // tone that reads on white AND on dark)
      // and TEXT on a field prints a deeper ink of that hue, so a lone "I" or "1" holds its contrast at 24px)
      const fill = host ? v('ink', e.text ? mix(HUES[HUES[host.hue] ? host.hue : 'lavender'].ink, '#000000', host.deep ? 0.55 : 0.28) : HUES[HUES[host.hue] ? host.hue : 'lavender'].ink) : e.text ? v('ink', mix(HUES[mainHue].ink, HUES[mainHue].deep, 0.25)) : v('edge', HUES[mainHue].deep)
      nodes.push(['path', tag({ d, fill }, part)])
      return
    }
    if (mode === 'shine') {
      const d = e.d || traceD(e.F, 0.03, 0.05)
      if (d) nodes.push(['path', { d, fill: v('shine', '#FFFFFF'), 'fill-opacity': L.SHINE, class: 'wm-shine' }])
      return
    }
    if (mode === 'shade') {
      const d = e.d || traceD(e.F, 0.03, 0.05)
      if (d) nodes.push(['path', tag({ d, fill: v('shadow', H.deep), 'fill-opacity': L.SHADE + 0.2 }, part)])
      return
    }
    const d = e.d || traceD(e.F, 0.035, 0.1)
    if (!d) return
    // DEEP: a Live icon's reading (a meter's bars, a progress arc) is set in the hue's deep tone with an inked
    // rim, flat, so the value reads at 24px on white as well as on dark
    if (e.deep) {
      nodes.push(['path', tag({ d, fill: v('edge', H.deep), stroke: v('ink', mix(H.deep, H.ink, 0.55)), 'stroke-width': e.rim ?? L.RIM, 'stroke-linejoin': 'round' }, part)])
      return
    }
    nodes.push(['path', tag({ d, fill: v(roleOf(hue), H.base), stroke: v('edge', H.rim), 'stroke-width': e.rim ?? L.RIM, 'stroke-linejoin': 'round' }, part)])
    const thick = thicknessOf(e)
    if (mode === 'flat' || thick < 1.2) return
    // dots (bullets, handles, ellipses) stay solid: a bottom plane would turn them into rings
    if (mode === 'lit' && thick < 4.2 && dotsOnly(e.F)) return
    // gentle deeper bottom plane
    const bd = Math.max(L.BD_MIN, Math.min(L.BD_MAX, thick * L.BD_K))
    const bot = facing(e.F, 0, bd)
    if (inkArea(bot) > 0.2) {
      const bdD = traceD(bot, 0.05, 0.12, 1)
      if (bdD) nodes.push(['path', tag({ d: bdD, fill: v('shadow', H.deep), 'fill-opacity': thick < L.TOP_MIN ? L.BOT_THIN : L.BOT }, part)])
    }
    if (mode === 'well') {
      const sh = facing(e.F, 0, -Math.max(0.8, Math.min(1.6, thick * 0.3)))
      F.intersect(sh, F.offset(F.copy(e.F), 0.35))
      const sd = traceD(sh, 0.05, 0.12, 1)
      if (sd) nodes.push(['path', tag({ d: sd, fill: v('shadow', H.deep), 'fill-opacity': L.WELL }, part)])
      return
    }
    if (hue === 'paper' || thick < L.TOP_MIN) return
    // soft lighter top plane: the inset field's band facing up
    // (only where the field is broad enough: thin bars of a broad field stay plain)
    const E = F.open(F.offset(F.copy(e.F), L.TOP_IN), L.TOP_OPEN)
    const td = Math.max(L.TD_MIN, Math.min(L.TD_MAX, thick * L.TD_K))
    // three faint tiers of the field's own light tone feather into one soft matte ramp
    // (small fields take two tiers: the feather would not show, the bytes would)
    const tiers = thick < 5 ? [[L.TOP[0] + L.TOP[1], 1], [L.TOP[2], 0.5]] : L.TOP.map((op, t) => [op, 1 - t / L.TOP.length])
    tiers.forEach(([op, k]) => {
      const top = facing(E, 0, -td * k)
      if (inkArea(top) < 0.3) return
      const tD = traceD(top, 0.05, 0.15, 1)
      if (tD) nodes.push(['path', tag({ d: tD, fill: v('tint', H.light), 'fill-opacity': op }, part)])
    })
    // one glint per icon, on the body (the biggest K field), never on a moving part
    if (!glinted && e === main && thick >= 3.4) {
      const g = glint(e.F, thick)
      if (g && anyInk(g)) {
        const gd = traceD(g, 0.03, 0.08)
        if (gd) { nodes.push(['path', { d: gd, fill: v('shine', '#FFFFFF'), 'fill-opacity': L.SHINE, class: 'wm-shine' }]); glinted = true }
      }
    }
  })
  return nodes
}
