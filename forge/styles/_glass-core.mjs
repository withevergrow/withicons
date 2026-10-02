// GLASS core — builds the layered glass icon on signed distance fields.
//
// Every icon becomes two stacked panes plus light:
//   BACK   the object's mass, shifted down-right, in a vivid colour (signals in an accent)
//   FRONT  the same mass in place as a frosted, tinted pane with a crisp currentColor rim;
//          closed cutouts and part joins are cut into it; open cutouts and interior lines are
//          etched on it (a deep line with a light lip)
//   FROST  where the front pane covers the back, the colour is seen through frosted glass
//   SHINE  a soft diagonal sheen across big panes, and a bright specular edge on the lit rim
// Glass rods are fatter than Line's 2u strokes, so Line's narrow counters and gaps are kept open
// (openLimit), small parts and short signals use slimmer rods, small closed cutouts are windows
// in the front pane (the vivid back glows through) while hollows (a battery's inside, a ring's gap)
// and ring-fill holes go through both panes.
// Fields are inside-positive (approximate SDF), sampled on the shared 0.1u grid.
import { N, NN, H, X0, gx, segsOf, distField, evenOddMask, maxFilter, sample, contours, ringsToD } from './_glass-field.mjs'
import { parsePath, resample, simplify, fmt } from '../kernel/geom.mjs'
import { tuneFor } from './_glass-tune.mjs'

export const G = {
  SCALE: 0.94,      // the whole drawing, about the centre: room for the pane offset
  R: 1.4,           // tube radius of every centreline (a 2.8u glass rod)
  SHIFT_F: 5,       // grid cells: the front pane moves up-left by 0.5u
  SHIFT_ROD: 0.3,   // the back layer moves down-right: rods by 0.3u ...
  SHIFT_MASS: 1.35, // ... big masses by 1.35u (the front moves the other way)
  ERODE_MIN: 0.45,  // the back layer is slimmer than the pane: rods by this much ...
  ERODE_MAX: 0.8,   // ... big masses by up to this much, so the pane's top-left reads clear
  RIM: 0.62,        // rim stroke width (currentColor)
  ETCH_HI: 0.32,    // offset of the light lip beside every etched line
  PART: 0.3,        // parting cut between an attached A part and the object
  MOAT: 0.85,       // clearance around signals (badges, slashes, modifiers)
  HL_IN: 0.4,       // specular edge starts this far inside the pane edge
  HL_W: 0.46,       // specular edge thickness at full light
  CLOSE: 0.2,       // closing radius of the mass
  R_SMALL: 1.12,    // rod radius of small parts and short signals (rays, numerals, flames, small loops)
  LINE_HALF: 1,     // Line's half stroke: the drawing whose counters and gaps glass keeps open
  HOLE_IN: 0.55,    // a ring fill's hole is cut this far inside its edge (with the rim it shows as wide as in Line)
  GAP_HALF: 0.45,   // glass keeps this much of a narrow gap (half-width) clear of rods
  PART_TUNE: 0.42,  // width of a tuned parting cut (TUNE.part, through both panes)
  THROUGH: 0.22,    // a cutout component bigger than this share of the mass goes through both panes
  BAND: 3.4,
}
const LIGHT = (() => { const x = -0.55, y = -0.835, l = Math.hypot(x, y); return [x / l, y / l] })()
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

// ---------------------------------------------------------------------------
// geometry prep
const scalePt = (p, s) => [12 + (p[0] - 12) * s, 12 + (p[1] - 12) * s]

// zero-length subpaths ("M12 16 L12 16" or "M12 16 h0") are dots in Line; the parser drops them
function dots(icon) {
  const out = []
  for (const p of icon.paths || []) {
    for (const chunk of String(p.d || '').split(/(?=[Mm])/)) {
      const m = chunk.match(/^M\s*(-?[\d.]+(?:e[-+]?\d+)?)[\s,]*(-?[\d.]+(?:e[-+]?\d+)?)/)
      if (!m) continue
      let subs
      try { subs = parsePath(chunk) } catch { subs = [] }
      if (!subs.length) out.push({ pts: [[+m[1], +m[2]]], closed: false, plate: p.plate || 'K' })
    }
  }
  return out
}

function prep(icon, s, skipCut = []) {
  const lines = [...(icon.lines || []), ...dots(icon)]
    .filter(l => l && l.pts && l.pts.length)
    .map(l => ({ pts: l.pts.map(p => scalePt(p, s)), closed: !!l.closed && l.pts.length > 2, plate: l.plate || 'K' }))
  const fills = (icon.fills || []).map(f => {
    const rings = (f.set && f.set.length ? f.set : (f.subs || []).map(q => q.pts)).filter(r => r && r.length > 2)
    return rings.map(r => r.map(p => scalePt(p, s)))
  }).filter(r => r.length)
  const cutArea = [], cutLine = []
  let ci = -1
  for (const c of icon.cutouts || []) for (const q of c.subs || []) {
    ci++
    if (!q.pts || !q.pts.length || skipCut.includes(ci)) continue
    const pts = q.pts.map(p => scalePt(p, s))
    if (q.closed && pts.length > 2) cutArea.push(pts); else cutLine.push({ pts, closed: false })
  }
  return { lines, fills, cutArea, cutLine }
}

// ---------------------------------------------------------------------------
// field primitives (inside positive)
function tubes(lines, r, band = 2.2) {
  const f = new Float32Array(NN).fill(-band)
  if (!lines.length) return f
  const d = distField(segsOf(lines), band + r)
  for (let k = 0; k < NN; k++) f[k] = r - d[k]
  return f
}
function regions(ringLists, band = G.BAND) {
  const f = new Float32Array(NN).fill(-band)
  const all = ringLists.flat().filter(r => r.length > 2)
  if (!all.length) return f
  const m = new Uint8Array(NN)
  for (const rings of ringLists) {
    const mm = evenOddMask(rings)
    for (let k = 0; k < NN; k++) if (mm[k]) m[k] = 1
  }
  const d = distField(segsOf(all.map(pts => ({ pts, closed: true }))), band)
  for (let k = 0; k < NN; k++) f[k] = m[k] ? d[k] : -d[k]
  return f
}
const maxInto = (a, b) => { for (let k = 0; k < NN; k++) if (b[k] > a[k]) a[k] = b[k]; return a }
const shifted = (f, s, fillV) => {
  const o = new Float32Array(NN).fill(fillV)
  for (let j = 0; j < N; j++) {
    const sj = j - s
    if (sj < 0 || sj >= N) continue
    for (let i = 0; i < N; i++) { const si = i - s; if (si >= 0 && si < N) o[j * N + i] = f[sj * N + si] }
  }
  return o
}
// move a field down-right by an amount that grows with local thickness TH
function warp(f, m, s0, s1) {
  const o = new Float32Array(NN).fill(-G.BAND)
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = j * N + i
    const s = (s0 + (s1 - s0) * m[k]) / H
    const u = i - s, v = j - s
    if (u < 0 || v < 0 || u >= N - 1 || v >= N - 1) continue
    const i0 = u | 0, j0 = v | 0, fu = u - i0, fv = v - j0, q = j0 * N + i0
    o[k] = (f[q] * (1 - fu) + f[q + 1] * fu) * (1 - fv) + (f[q + N] * (1 - fu) + f[q + N + 1] * fu) * fv
  }
  return o
}
// separable box blur (two passes ~ a tent), radius r cells
function blur(f, r) {
  let a = f
  for (let pass = 0; pass < 2; pass++) {
    const t = new Float32Array(NN), o = new Float32Array(NN), w = 2 * r + 1
    for (let j = 0; j < N; j++) {
      const row = j * N; let acc = 0
      for (let i = -r; i <= r; i++) acc += a[row + Math.max(0, Math.min(N - 1, i))]
      for (let i = 0; i < N; i++) {
        t[row + i] = acc / w
        acc += a[row + Math.min(N - 1, i + r + 1)] - a[row + Math.max(0, i - r)]
      }
    }
    for (let i = 0; i < N; i++) {
      let acc = 0
      for (let j = -r; j <= r; j++) acc += t[Math.max(0, Math.min(N - 1, j)) * N + i]
      for (let j = 0; j < N; j++) {
        o[j * N + i] = acc / w
        acc += t[Math.min(N - 1, j + r + 1) * N + i] - t[Math.max(0, j - r) * N + i]
      }
    }
    a = o
  }
  return a
}
// morphological closing by rc (fills slits narrower than 2rc, rounds inner corners), in place
function closeInPlace(f, rc) {
  const rings = contours(f, -rc)
  if (!rings.length) return f
  const d = distField(segsOf(rings.map(pts => ({ pts, closed: true }))), G.BAND)
  for (let k = 0; k < NN; k++) {
    const v = f[k] > -rc ? d[k] - rc : -d[k] - rc
    if (v > f[k]) f[k] = v
  }
  return f
}
// exact signed distance to the zero level of f (inside positive), plus its rings
function exact(f, band) {
  const rings = contours(f, 0)
  if (!rings.length) return { rings, D: null }
  const d = distField(segsOf(rings.map(pts => ({ pts, closed: true }))), band)
  const D = new Float32Array(NN)
  for (let k = 0; k < NN; k++) D[k] = f[k] > 0 ? d[k] : -d[k]
  return { rings, D }
}
// connected components of {f > 0}; returns label array and per-component cell lists
function components(pred) {
  const lab = new Int32Array(NN).fill(-1), comps = [], stack = []
  for (let k = 0; k < NN; k++) {
    if (lab[k] >= 0 || !pred(k)) continue
    const id = comps.length, cells = []
    lab[k] = id; stack.push(k)
    while (stack.length) {
      const c = stack.pop(); cells.push(c)
      const i = c % N
      for (const q of [i > 0 ? c - 1 : -1, i < N - 1 ? c + 1 : -1, c - N, c + N]) {
        if (q < 0 || q >= NN || lab[q] >= 0 || !pred(q)) continue
        lab[q] = id; stack.push(q)
      }
    }
    comps.push(cells)
  }
  return { lab, comps }
}
const fracWhere = (pts, test) => {
  if (pts.length === 1) return test(pts[0]) ? 1 : 0
  const P = resample(pts, 0.25).map(o => o.p)
  if (!P.length) return 0
  return P.filter(test).length / P.length
}

const minInto = (a, b) => { for (let k = 0; k < NN; k++) if (b[k] < a[k]) a[k] = b[k]; return a }
const polyLen = (pts, closed) => {
  let L = 0
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
  if (closed && pts.length > 2) L += Math.hypot(pts[0][0] - pts.at(-1)[0], pts[0][1] - pts.at(-1)[1])
  return L
}
const bboxOf = pts => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const [x, y] of pts) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y }
  return [x0, y0, x1, y1]
}
// rods of per-line radius (lines grouped by radius)
function tubesBy(lines, rOf) {
  const groups = new Map()
  for (const l of lines) { const r = rOf(l); if (!groups.has(r)) groups.set(r, []); groups.get(r).push(l) }
  let f = null
  for (const [r, ls] of groups) { const t = tubes(ls, r); f = f ? maxInto(f, t) : t }
  return f || new Float32Array(NN).fill(-2.2)
}
// the inside of the even-odd holes of ring fills, inset by Line's half stroke (positive = keep open)
function holesOfFills(fills) {
  let out = null
  for (const rings of fills) {
    if (rings.length < 2) continue
    const fm = evenOddMask(rings)
    const any = new Uint8Array(NN)
    for (const r of rings) { const m = evenOddMask([r]); for (let k = 0; k < NN; k++) if (m[k]) any[k] = 1 }
    let has = false
    for (let k = 0; k < NN; k++) if (any[k] && !fm[k]) { has = true; break }
    if (!has) continue
    const d = distField(segsOf(rings.map(pts => ({ pts, closed: true }))), G.BAND)
    out = out || new Float32Array(NN).fill(-G.BAND)
    for (let k = 0; k < NN; k++) if (any[k] && !fm[k]) out[k] = Math.max(out[k], d[k] - G.HOLE_IN)
  }
  return out
}
// Line's ink (2u strokes + fills) and how far glass may grow past it: the full rod where there is room,
// less in narrow counters and gaps so that they stay open (the limit is a field: mass <= lim)
function openLimit(lines, fills, R) {
  const grow = R - G.LINE_HALF
  if (grow <= 0.02) return null
  const ink = tubes(lines, G.LINE_HALF, 2.2)
  if (fills.length) maxInto(ink, regions(fills))
  closeInPlace(ink, 0.25)            // what nearly touches in Line counts as touching
  const bgd = new Float32Array(NN)
  for (let k = 0; k < NN; k++) bgd[k] = ink[k] < 0 ? Math.min(-ink[k], 1.6) : 0
  const W = maxFilter(bgd, 10)
  const lim = new Float32Array(NN)
  let any = false
  for (let k = 0; k < NN; k++) {
    if (ink[k] >= 0) { lim[k] = 9; continue }
    const g = clamp(W[k] - G.GAP_HALF, 0, grow)
    if (g < grow) any = true
    lim[k] = g - bgd[k]
  }
  return any ? lim : null
}
// does a cutout component surround something (a battery's bars, a dot in a ring)? Then it is the
// hollow of a container or a ring and reads empty; a plain window (a screen) glows instead.
function enclosesSomething(cells, lab, id) {
  let i0 = N, j0 = N, i1 = 0, j1 = 0
  for (const c of cells) { const i = c % N, j = (c - i) / N; if (i < i0) i0 = i; if (i > i1) i1 = i; if (j < j0) j0 = j; if (j > j1) j1 = j }
  i0 = Math.max(0, i0 - 1); j0 = Math.max(0, j0 - 1); i1 = Math.min(N - 1, i1 + 1); j1 = Math.min(N - 1, j1 + 1)
  const seen = new Uint8Array(NN), st = []
  const push = k => { if (!seen[k] && lab[k] !== id) { seen[k] = 1; st.push(k) } }
  for (let i = i0; i <= i1; i++) { push(j0 * N + i); push(j1 * N + i) }
  for (let j = j0; j <= j1; j++) { push(j * N + i0); push(j * N + i1) }
  while (st.length) {
    const k = st.pop(), i = k % N, j = (k - i) / N
    if (i > i0) push(k - 1); if (i < i1) push(k + 1); if (j > j0) push(k - N); if (j < j1) push(k + N)
  }
  let inside = 0
  for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) { const k = j * N + i; if (!seen[k] && lab[k] !== id) inside++ }
  return inside * H * H > 0.4
}
// etched closed loops whose inside Line paints solid (concentric dot rings) become one outline
function dotBlobs(etch, nearCut) {
  const loops = etch.filter(l => l.closed && l.pts.length > 2)
  if (!loops.length) return
  const ink = tubes(etch, G.LINE_HALF, 1.2)
  const blob = loops.filter(l => {
    const m = evenOddMask([l.pts]); let n = 0, cov = 0
    for (let k = 0; k < NN; k++) if (m[k]) { n++; if (ink[k] > -0.02) cov++ }
    return n > 0 && cov / n > 0.995
  })
  if (!blob.length) return
  const bf = tubes(blob, G.LINE_HALF, 1.2)
  for (const l of blob) etch.splice(etch.indexOf(l), 1)
  for (const r of contours(bf, 0)) {
    const pts = simplify(r, 0.02, true)
    if (fracWhere(pts, nearCut) < 0.5) etch.push({ pts, closed: true })
  }
}

// ---------------------------------------------------------------------------
export function build(icon) {
  const T = tuneFor(icon.name)
  const S = T.scale ?? G.SCALE
  const R = T.r ?? G.R
  const P0 = prep(icon, S, T.skipCut)
  const lines = P0.lines
  const fills = T.noFills ? [] : P0.fills
  const cutArea = T.noCutouts ? [] : P0.cutArea, cutLine = T.noCutouts ? [] : P0.cutLine

  // --- signals: S lines, and fills that trace them
  const sLines = lines.filter(l => l.plate === 'S')
  const dS = sLines.length ? distField(segsOf(sLines), 1) : null
  const baseFills = [], sFills = []
  for (const rings of fills) {
    let on = 0, tot = 0
    if (dS) for (const r of rings) for (const p of r) { tot++; if (sample(dS, p[0], p[1]) < 0.35) on++ }
    ;(tot && on / tot > 0.5 ? sFills : baseFills).push(rings)
  }
  const baseLines = lines.filter(l => l.plate !== 'S')

  // --- fills: a fill that traces an A line belongs to that part
  const aAll = baseLines.filter(l => l.plate === 'A')
  const dA = aAll.length ? distField(segsOf(aAll), 1) : null
  const kFills = [], aFills = []
  for (const rings of baseFills) {
    let on = 0, tot = 0
    if (dA) for (const r of rings) for (const p of r) { tot++; if (sample(dA, p[0], p[1]) < 0.35) on++ }
    ;(tot && on / tot > 0.6 ? aFills : kFills).push(rings)
  }
  const FF = baseFills.length ? regions(baseFills) : null
  const hasFill = !!FF
  // holes of ring fills (even-odd nesting: a donut, a washer) stay open at least as wide as Line shows them
  const fillHoles = holesOfFills([...baseFills, ...sFills])
  const CA = cutArea.length ? regions([cutArea]) : null
  const CUT = (cutArea.length || cutLine.length) ? (() => {
    const f = CA ? Float32Array.from(CA) : new Float32Array(NN).fill(-G.BAND)
    if (cutLine.length) maxInto(f, tubes(cutLine, 0.01))
    return f
  })() : null
  const deepIn = p => FF && sample(FF, p[0], p[1]) > 1.2
  const nearCut = p => CUT && sample(CUT, p[0], p[1]) > -0.8
  const etch = [...cutLine]
  const kLines = [], aLines = []
  for (const l of baseLines) {
    if (hasFill && !T.keepInterior && fracWhere(l.pts, deepIn) > 0.6) {
      // a detail line inside the mass: etched, unless an authored cutout already shows it
      if (fracWhere(l.pts, nearCut) < 0.5) etch.push(l)
      continue
    }
    ;(l.plate === 'A' ? aLines : kLines).push(l)
  }

  // a closed loop drawn solid in Line (a dot ring around a smaller dot ring) is a disc, not rings:
  // etch its outline instead, and drop that too where a cutout already shows it
  dotBlobs(etch, nearCut)

  // rod radius per line: small parts and signals (rays, a numeral, a flame, a leaf) stay slim
  const rOf = l => {
    const tr = l.plate === 'S' ? T.rS : l.plate === 'A' ? T.rA : T.rK
    if (tr != null) return tr
    if (l.plate === 'K') return R
    const len = polyLen(l.pts, l.closed)
    if (l.plate === 'S' && !l.closed && len < 3.6) return Math.min(R, G.R_SMALL)
    if (l.plate === 'A' && !l.closed && len < 3.1) return Math.min(R, G.R_SMALL)
    if (l.closed && l.pts.length > 2) { const b = bboxOf(l.pts); if (Math.hypot(b[2] - b[0], b[3] - b[1]) < 6.5) return Math.min(R, G.R_SMALL) }
    return R
  }
  // what Line shows: its counters and the gaps between strokes must survive the fatter glass rods
  const lim = T.noKeepOpen ? null : openLimit(lines, fills, R)

  // --- object mass: K fills + K rods; parts: A rods + A fills
  const KM = tubesBy(kLines, rOf)
  const KF = !kFills.length ? null : aFills.length ? regions(kFills) : FF
  if (KF) maxInto(KM, KF)
  const mass = Float32Array.from(KM)
  const AF = aFills.length ? regions(aFills) : null
  if (AF) maxInto(mass, AF)
  let part = null
  if (aLines.length) maxInto(mass, tubesBy(aLines, rOf))
  closeInPlace(mass, G.CLOSE)   // hairline gaps between parts that nearly touch would crack the panes
  if (lim) minInto(mass, lim)
  if (aLines.length && KF && !T.noParting) {
    // a part that lives (partly) outside the object is set apart by a fine parting cut:
    // closed parts (wheels, lenses, knobs) sit on top of it, open ones (shackles, handles) tuck behind.
    const traced = l => {
      const d = distField(segsOf([l]), 1)
      return aFills.filter(rings => { let on = 0, tot = 0; for (const r of rings) for (const p of r) { tot++; if (sample(d, p[0], p[1]) < 0.35) on++ } return tot && on / tot > 0.6 })
    }
    const outside = aLines.filter(l => fracWhere(l.pts, p => sample(KM, p[0], p[1]) < -0.3) > 0.2)
    const top = [], topFills = [], behind = []
    for (const l of outside) {
      const tf = traced(l)
      if (l.closed) { top.push(l); topFills.push(...tf) } else if (!tf.length) behind.push(l)
    }
    if (top.length || behind.length) part = new Float32Array(NN).fill(-G.BAND)
    if (top.length) {
      const AT = tubesBy(top, rOf)
      if (topFills.length) maxInto(AT, regions(topFills))
      for (let k = 0; k < NN; k++) if (KM[k] > 0.1) part[k] = Math.max(part[k], G.PART / 2 - Math.abs(AT[k]))
    }
    if (behind.length) {
      const AO = tubesBy(behind, rOf)
      for (let k = 0; k < NN; k++) if (AO[k] > 0.15) part[k] = Math.max(part[k], G.PART / 2 - Math.abs(KM[k]))
    }
  }

  // --- etched detail: closed cutouts are holes; open cutouts and interior lines are etched strokes
  // Small cutouts (a door, windows, a lens) are windows in the front pane: the vivid back glows
  // through them. A cutout that hollows out much of the object (a battery's inside, the gap in a
  // ring, a ban sign's face) and the holes of ring fills go through both panes, so they read empty.
  const through = new Float32Array(NN).fill(-G.BAND)
  const holes = new Float32Array(NN).fill(-G.BAND)
  if (CA) {
    maxInto(holes, CA)
    let massA = 0
    for (let k = 0; k < NN; k++) if (mass[k] > 0) massA++
    const { lab, comps } = components(k => CA[k] > 0)
    const share = comps.map(c => c.length / massA)
    const pair = share.filter(a => a > 0.12).length >= 2 && share.reduce((a, b) => a + b, 0) > 0.28
    const big = comps.map((c, i) => T.through ?? ((share[i] > G.THROUGH && enclosesSomething(c, lab, i)) || (pair && share[i] > 0.12)))
    // (only the sign of these fields matters downstream: every pane is re-distanced from its edge)
    for (let k = 0; k < NN; k++) through[k] = lab[k] >= 0 ? (big[lab[k]] ? CA[k] : -0.01) : Math.min(CA[k], -0.01)
  }
  if (fillHoles) maxInto(through, fillHoles)
  if (T.part) maxInto(through, tubes(parsePath(T.part).map(l => ({ pts: l.pts.map(p => scalePt(p, S)), closed: l.closed })), (T.partW ?? G.PART_TUNE) / 2))
  maxInto(holes, through)
  if (part) maxInto(holes, part)

  // --- signals: their own pane, cleared of everything else by a moat
  let SM = null
  if (sLines.length || sFills.length) {
    const sIn = [], sRod = []
    const SF = sFills.length ? regions(sFills) : null
    for (const l of sLines) {
      if (SF && fracWhere(l.pts, p => sample(SF, p[0], p[1]) > 1.0) > 0.6) sIn.push(l)
      else sRod.push(l)
    }
    SM = tubesBy(sRod, rOf)
    if (SF) maxInto(SM, SF)
    if (lim) minInto(SM, lim)
    etch.push(...sIn)
  }

  // panes, before the offset
  const backBase = new Float32Array(NN), pane = new Float32Array(NN)
  for (let k = 0; k < NN; k++) {
    let b = mass[k]
    if (SM) b = Math.min(b, -(SM[k] + G.MOAT))
    backBase[k] = Math.min(b, -through[k])
    let p = Math.min(b, -holes[k])
    if (SM) p = Math.max(p, Math.min(SM[k], -holes[k]))
    pane[k] = p
  }
  // the back layer: slimmer and further away the bigger the mass (rods keep their colour core)
  const sf = T.shiftF ?? G.SHIFT_F
  const s0 = T.shiftRod ?? G.SHIFT_ROD, s1 = T.shiftMass ?? G.SHIFT_MASS
  const e0 = T.erodeMin ?? G.ERODE_MIN, e1 = T.erodeMax ?? G.ERODE_MAX
  const backOf = f0 => {
    // a true distance field first: a max-union is not one inside, and erosion would crack it
    const f = exact(f0, G.BAND).D
    if (!f) return new Float32Array(NN).fill(-G.BAND)
    // how "massy" each place is, 0 (rod) .. 1 (big mass), smoothed so the back layer never wobbles
    const TB = maxFilter(f, 22)
    for (let k = 0; k < NN; k++) { const t = (TB[k] - R) / 1.8; TB[k] = t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t) }
    const m = blur(TB, 12)
    const de = e1 - e0
    for (let k = 0; k < NN; k++) f[k] -= e0 + de * m[k]
    return warp(f, m, s0, s1)
  }
  const back = backOf(backBase)
  const backS = SM ? backOf(SM.map((v, k) => Math.min(v, -through[k]))) : null
  const front = shifted(pane, -sf, -G.BAND)
  const o = -sf * H
  return { back, backS, front, etch: etch.map(l => ({ pts: l.pts.map(p => [p[0] + o, p[1] + o]), closed: l.closed })) }
}

// ---------------------------------------------------------------------------
export function glassLayers(icon) {
  const { back, backS, front, etch } = build(icon)
  const { rings: frontRings, D } = exact(front, G.BAND)
  if (!D) return null
  const out = {}
  out.back = ringsToD(contours(back, 0), 0.05)
  out.backS = backS ? ringsToD(contours(backS, 0), 0.05) : ''
  out.front = ringsToD(frontRings, 0.035)

  out.etch = etchD(etch, 0)
  out.etchHi = etchD(etch, G.ETCH_HI)
  // frost: the colour seen through the pane (inset so the rim stays crisp)
  const inset = G.RIM / 2
  const fr = new Float32Array(NN)
  for (let k = 0; k < NN; k++) {
    const b = backS ? Math.max(back[k], backS[k]) : back[k]
    fr[k] = Math.min(D[k] - inset, b)
  }
  out.frost = ringsToD(contours(fr, 0), 0.05, 0.05)

  // local thickness of the pane
  const TH = maxFilter(D, 16)

  // specular edge: a tapered sliver just inside the rim wherever the edge faces the light
  const hl = new Float32Array(NN).fill(-1)
  for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) {
    const k = j * N + i, v = D[k]
    if (v < G.HL_IN - 0.05 || v > G.HL_IN + G.HL_W + 0.1) continue
    const gxv = D[k + 1] - D[k - 1], gyv = D[k + N] - D[k - N], gl = Math.hypot(gxv, gyv)
    if (gl < 1e-6) continue
    // outward normal = -grad
    const f = -(gxv * LIGHT[0] + gyv * LIGHT[1]) / gl
    const g = sstep(0.2, 0.85, f)
    if (g <= 0) continue
    const w = Math.min(G.HL_W, 0.34 * TH[k]) * g
    if (w < 0.07) continue
    hl[k] = Math.min(v - G.HL_IN, G.HL_IN + w - v)
  }
  prune(hl, 0.3)
  out.hl = ringsToD(contours(hl, 0), 0.05, 0.03)

  // sheen: two diagonal bands across the big panes (rods stay clear)
  const sheen = sheenField(D, TH)
  out.sheen = sheen ? ringsToD(contours(sheen, 0), 0.05, 0.08) : ''
  return out
}

// open polylines as compact stroke data, optionally nudged down-right (the etch's lit lip)
function etchD(lines, off) {
  let d = ''
  for (const l of lines) {
    const pts = l.pts.length > 2 ? simplify(l.pts, 0.03, l.closed) : l.pts
    if (!pts.length) continue
    const q = p => fmt(p[0] + off) + ' ' + fmt(p[1] + off)
    d += 'M' + q(pts[0]) + (pts.length === 1 ? 'h0' : 'L' + pts.slice(1).map(q).join('L')) + (l.closed ? 'Z' : '')
  }
  return d
}

function prune(f, minArea) {
  const { comps } = components(k => f[k] > 0)
  for (const cells of comps) if (cells.length * H * H < minArea) for (const c of cells) f[c] = -1
}

function sheenField(D, TH) {
  // extent of the pane along the diagonal u = (x + y)/sqrt2
  let u0 = Infinity, u1 = -Infinity
  for (let k = 0; k < NN; k++) {
    if (D[k] <= 0) continue
    const i = k % N, j = (k - i) / N, u = (gx(i) + gx(j)) * Math.SQRT1_2
    if (u < u0) u0 = u; if (u > u1) u1 = u
  }
  if (!(u1 > u0)) return null
  const span = u1 - u0
  const w1 = clamp(0.17 * span, 1.3, 2.7), c1 = u0 + 0.3 * span
  const w2 = clamp(0.045 * span, 0.4, 0.65), c2 = c1 + w1 / 2 + 0.75 + w2 / 2
  const f = new Float32Array(NN).fill(-1)
  const IN = 0.62
  for (let k = 0; k < NN; k++) {
    const v = D[k]
    if (v <= IN) continue
    const i = k % N, j = (k - i) / N, u = (gx(i) + gx(j)) * Math.SQRT1_2
    const b = Math.max(w1 / 2 - Math.abs(u - c1), w2 / 2 - Math.abs(u - c2))
    if (b <= 0) continue
    f[k] = Math.min(b, v - IN)
  }
  // keep only pieces on real masses (a rod crossing the band would get a noisy chip)
  const { comps } = components(k => f[k] > 0)
  let kept = 0
  for (const cells of comps) {
    let mx = 0
    for (const c of cells) if (TH[c] > mx) mx = TH[c]
    if (mx < 2.3 || cells.length * H * H < 0.5) { for (const c of cells) f[c] = -1 } else kept++
  }
  return kept ? f : null
}
