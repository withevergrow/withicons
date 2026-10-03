// ANIME compose — turns a list of layer OPS into the finished cel-shaded icon.
//
// Authors (the automatic path and every redraw) describe WHAT is there — surfaces in a
// colour role, ink detail lines, coloured tubes, decorations — bottom to top. Compose
// adds the anime craft the same way every time:
//
//   surf    ink backing (outline: thin on the lit side, heavier on the shadow side)
//           -> flat cel colour -> ONE hard-edged shadow tone (crescent away from the light,
//           plus the cast shadows of the surfaces stacked on top of it) -> optional rim light
//           -> specular shine (streak + dot, glass bars, glint or dot)
//   ink     brush ink lines: tapered free ends, thicker towards the shadow side
//   tube    a coloured line with an ink outline and its own shadow tone (arrows, handles)
//   paint   flat paint without outline (blush, patterns, glyphs on a field)
//   shine   explicit specular shapes          (class wm-shine)
//   deco    decoration beside the object      (class wm-deco), optional thin outline
//   sparkle a 4-point sparkle placed in the freest corner (auto) or at x,y
//   ground  a flat contact shadow under the object (class wm-shadow)
//   cut     erase a shape (grown by `gap`) from everything painted so far (moats)
//
// Parts choreography (forge/MOTION.md): object nodes carry wm-k / wm-a / wm-s by their
// `part`; cel shadows and outlines move with their surface; shine is wm-shine; deco and
// sparkles are wm-deco; ground shadows are wm-shadow.
import * as F from './_anime-field.mjs'
import { M, paint, SHADE_TONE } from './_anime-tune.mjs'
import { ringsD } from './_anime-path.mjs'
import { asLines, sparkle as sparkleShape, circle, resamplePts as resample } from './_anime-prim.mjs'
import { arclen, pointInRing, area, simplify, rng } from '../kernel/geom.mjs'

const MG = M.MARGIN
const LN = (() => { const [x, y] = M.LIGHT, l = Math.hypot(x, y); return [x / l, y / l] })() // to the light
const SD = [-LN[0], -LN[1]] // towards the shadow
const CLS = { k: 'wm-k', a: 'wm-a', s: 'wm-s', shine: 'wm-shine', deco: 'wm-deco', shadow: 'wm-shadow' }

const boxOf = rings => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const r of rings) for (const [x, y] of r) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 }
}
const fieldOf = sh => F.region(Array.isArray(sh) ? sh.filter(r => r && r.length > 2) : [], MG)
const dilate = (G, d) => F.offset(F.copy(G), -d)
const uni = (A, B) => F.union(A, B)
const nonEmpty = G => F.any(G)

// thickness of a field's ink: the largest inscribed distance (for sizing shine and shadow)
function depth(G) { let m = 0; for (let i = 0; i < G.length; i++) if (-G[i] > m) m = -G[i]; return m }

// ---------------------------------------------------------------------------
// ink line widths: taper free ends, keep closed loops even
function inkPolys(lines, w, taper) {
  const out = []
  for (const l of lines) {
    if (!l.pts || !l.pts.length) continue
    let pts = l.pts
    const L = arclen(pts, l.closed)
    if (pts.length > 1 && L > 0.01) pts = resample(pts, 0.3, l.closed)
    if (!pts.length) continue
    if (l.closed || !taper || L < 0.6) { out.push({ pts, closed: l.closed, w: pts.map(() => w) }); continue }
    const T = Math.min(M.TAPER * (typeof taper === 'number' ? taper : 1), L * 0.4)
    let s = 0
    const W = pts.map((p, i) => {
      if (i) s += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1])
      const e = Math.min(s, L - s), k = Math.min(1, e / T)
      return w * (M.TAPER_MIN + (1 - M.TAPER_MIN) * Math.sin(k * Math.PI / 2))
    })
    out.push({ pts, closed: false, w: W })
  }
  return out
}

// ---------------------------------------------------------------------------
// shine
function ringNormals(ring) {
  // outward normals, by testing which side is inside
  const n = ring.length, N = []
  for (let i = 0; i < n; i++) {
    const a = ring[(i + n - 1) % n], b = ring[(i + 1) % n]
    const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1
    N.push([ty / l, -tx / l])
  }
  let votes = 0
  for (let i = 0; i < n; i += Math.max(1, Math.floor(n / 12))) {
    const p = ring[i], q = [p[0] + N[i][0] * 0.05, p[1] + N[i][1] * 0.05]
    votes += pointInRing(q, ring) ? -1 : 1
  }
  return votes < 0 ? N.map(([x, y]) => [-x, -y]) : N
}

function chaikin(r, n = 1) {
  let P = r
  for (let k = 0; k < n; k++) {
    const Q = []
    for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; Q.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]) }
    P = Q
  }
  return P
}
// a smoothed copy of a surface (opening): the cel terminator and the highlight follow the
// big form, not every notch and tooth
function smooth(G, box, thick) {
  if (Math.min(box.w, box.h) < 4.5) return G
  const r = Math.max(0.5, Math.min(2.2, 0.13 * Math.min(box.w, box.h), 0.22 * thick))
  const S = F.open(F.fillAllHoles(F.copy(G)), r)
  // never lose the form: if the opening ate much of it, keep the original
  let a = 0, b = 0
  for (let i = 0; i < G.length; i++) { if (G[i] < 0) a++; if (S[i] < 0) b++ }
  return b < a * 0.8 ? G : S
}
// the classic anime highlight: a pointed streak hugging the lit shoulder, then a dot
function streak(G0, kind, size, box, Gs) {
  const G = Gs || G0
  const m = Math.min(box.w, box.h, depth(G) * 2 + 0.01 > 3.5 ? 99 : depth(G) * 2)
  if (m < 1.6) return null
  const inset = Math.max(0.6, Math.min(1.7, 0.16 * m)) * size
  const E = dilate(G, -inset)
  const loops = F.contour(E).map(l => chaikin(simplify(l, 0.06, true), 2)).filter(l => l.length > 4)
  if (!loops.length) return null
  const ring = loops.reduce((a, b) => Math.abs(area(b)) > Math.abs(area(a)) ? b : a)
  const P = resample(ring, 0.25, true)
  if (P.length < 6) return null
  const NV = ringNormals(P)
  const S = NV.map(n => n[0] * LN[0] + n[1] * LN[1])
  // longest cyclic run of lit-facing points
  const n = P.length, lit = S.map(s => s > 0.3)
  if (lit.every(Boolean)) { /* whole loop lit (tiny round): take the top-left half */ }
  let best = null
  for (let i = 0; i < n; i++) {
    if (!lit[i] || lit[(i + n - 1) % n]) continue
    let j = i, len = 0
    while (lit[(j + 1) % n] && len < n) { j++; len++ }
    if (!best || len > best.len) best = { i, len }
  }
  if (!best) { // all lit or none: centre on the max score
    let k = 0; for (let i = 1; i < n; i++) if (S[i] > S[k]) k = i
    best = { i: (k - Math.floor(n / 6) + n) % n, len: Math.floor(n / 3) }
  }
  const run = Array.from({ length: best.len + 1 }, (_, t) => P[(best.i + t) % n])
  const runS = Array.from({ length: best.len + 1 }, (_, t) => S[(best.i + t) % n])
  const runLen = arclen(run)
  if (runLen < 0.6) return null
  const wmax = Math.max(0.6, Math.min(1.5, 0.15 * m)) * size
  const out = F.field(MG)
  if (kind === 'dot' || runLen < 1.6 || m < 3.2) {
    let k = 0; for (let i = 1; i < runS.length; i++) if (runS[i] > runS[k]) k = i
    const r = Math.max(0.42, Math.min(0.9, 0.16 * m)) * size
    const p = run[k]
    return F.strokesW([{ pts: [p], w: [2 * r] }], MG, out)
  }
  // streak length and placement: centred on the most lit point, biased to the start of the run
  const Ls = Math.max(1.4, Math.min(runLen * 0.62, 1.4 + 0.5 * m, 8)) * Math.min(1, size)
  let k = 0; for (let i = 1; i < runS.length; i++) if (runS[i] > runS[k]) k = i
  // arc positions
  const acc = [0]; for (let i = 1; i < run.length; i++) acc.push(acc[i - 1] + Math.hypot(run[i][0] - run[i - 1][0], run[i][1] - run[i - 1][1]))
  let s0 = Math.max(0, Math.min(runLen - Ls, acc[k] - Ls * 0.55)), s1 = s0 + Ls
  const seg = [], W = []
  for (let i = 0; i < run.length; i++) if (acc[i] >= s0 && acc[i] <= s1) {
    const t = (acc[i] - s0) / Ls
    seg.push(run[i]); W.push(wmax * (0.18 + 0.82 * Math.pow(Math.sin(Math.PI * t), 0.75)))
  }
  if (seg.length >= 2) F.strokesW([{ pts: seg, w: W }], MG, out)
  // the dot after a gap, on the longer remaining side
  const gap = wmax * 0.9 + 0.35, dr = wmax * 0.42
  const after = runLen - s1, before = s0
  const sd = after >= before ? s1 + gap + dr : s0 - gap - dr
  if (sd > 0 && sd < runLen) {
    let q = 0; while (q < acc.length - 1 && acc[q] < sd) q++
    F.strokesW([{ pts: [run[q]], w: [2 * dr] }], MG, out)
  }
  return out
}

// glass: two parallel diagonal bars across the upper-left of a panel
function glassBars(G, box, size) {
  const out = F.field(MG)
  const m = Math.min(box.w, box.h)
  if (m < 2) return null
  const cx = box.x0 + box.w * 0.36, cy = box.y0 + box.h * 0.36
  const L = Math.hypot(box.w, box.h)
  const d = [Math.SQRT1_2, -Math.SQRT1_2] // bars run lower-left -> upper-right
  const w1 = Math.max(0.6, Math.min(1.5, 0.16 * m)) * size, w2 = w1 * 0.45, off = w1 * 1.25
  const bar = (ox, oy, w) => ({ pts: [[ox - d[0] * L, oy - d[1] * L], [ox + d[0] * L, oy + d[1] * L]], closed: false })
  F.strokes([bar(cx, cy, w1)], w1, MG, out)
  F.strokes([bar(cx + off * Math.SQRT1_2, cy + off * Math.SQRT1_2, w2)], w2, MG, out)
  F.intersect(out, dilate(G, -Math.max(0.3, Math.min(0.8, m * 0.1))))
  return out
}

function glint(x, y, r) { return fieldOf(sparkleShape(x, y, r, 0.16, 0)) }

// ---------------------------------------------------------------------------
export function compose(input, opts = {}) {
  const ops = flat(input)
  const layers = []
  const push = (f, role, cls, extra) => { if (f && nonEmpty(f)) layers.push({ f, role, cls, ...extra }) }

  // pre-compute surface fields (for cast shadows)
  for (const o of ops) {
    if (o.t === 'surf') {
      o.F = fieldOf(o.shape); o.box = boxOf(o.shape || [])
      // thickness estimate 2A/P: the diameter of a disc, twice the width of a band
      let A = 0; for (let q = 0; q < o.F.length; q++) if (o.F[q] < 0) A++
      A *= F.H * F.H
      const Pm = (o.shape || []).reduce((m, r) => m + (r && r.length > 2 ? arclen(r, true) : 0), 0) || 1
      o.thick = 4 * A / Pm
    }
    if (o.t === 'tube') {
      o.L = asLines(o.lines); o.core = F.strokes(o.L, o.w ?? M.TUBE, MG)
      const b = boxOf(o.L.map(l => l.pts)), e = (o.w ?? M.TUBE) / 2 + (o.ol ?? M.TUBE_OL)
      o.box = { x0: b.x0 - e, y0: b.y0 - e, x1: b.x1 + e, y1: b.y1 + e, w: b.w + 2 * e, h: b.h + 2 * e }
    }
  }
  const casters = ops.map((o, i) => ({ o, i })).filter(({ o }) => (o.t === 'surf' && !o.inset && o.casts !== false) || (o.t === 'tube' && o.casts !== false))
  const sparkles = []

  ops.forEach((o, i) => {
    const cls = CLS[o.part] || 'wm-k'
    switch (o.t) {
      case 'surf': {
        const G = o.F
        if (!nonEmpty(G)) return
        // outline backing
        if (o.ol !== 0) {
          const ol = o.ol ?? M.OL
          const B = dilate(G, ol)
          uni(B, F.nudge(B, M.OL_SHIFT[0] * (o.olShift ?? 1), M.OL_SHIFT[1] * (o.olShift ?? 1)))
          push(B, 'ink', cls)
        }
        push(G, o.role || 'c1', cls)
        // ONE shadow tone: crescent + cast shadows
        let Sh = null
        const Gs = o.smooth === false ? G : smooth(G, o.box, o.thick)
        if (o.shade !== 0 && o.shade !== false) {
          const u = Math.max(M.SHADE_MIN, Math.min(M.SHADE_MAX, M.SHADE * Math.min(o.box.w, o.box.h, o.thick * 0.75))) * (typeof o.shade === 'number' ? o.shade : 1)
          Sh = F.copy(G)
          if (o.inset) F.subtract(Sh, F.nudge(G, SD[0] * u * 0.6, SD[1] * u * 0.6)) // recess: shadow under the upper-left rim
          else F.subtract(Sh, F.nudge(Gs, LN[0] * u, LN[1] * u))
        }
        if (o.cast !== false) {
          for (const c of casters) {
            if (c.i <= i) continue
            const cb = c.o.box, ob = o.box
            if (!cb || cb.x0 > ob.x1 + 1 || cb.y0 > ob.y1 + 1 || cb.x1 + 1 < ob.x0 || cb.y1 + 1 < ob.y0) continue
            const src = c.o.t === 'surf' ? c.o.F : c.o.core
            const sh = F.nudge(src, M.CAST[0], M.CAST[1])
            F.intersect(sh, G)
            F.subtract(sh, src)
            if (c.o.t === 'surf' && c.o.ol !== 0) F.subtract(sh, c.o.Fo || (c.o.Fo = dilate(src, (c.o.ol ?? M.OL) + 0.05)))
            if (!nonEmpty(sh)) continue
            Sh = Sh ? uni(Sh, sh) : sh
          }
        }
        if (Sh) { const [tr, top] = o.tone || SHADE_TONE[o.role] || ['shadow', M.SHADE_OP]; push(Sh, tr, cls, { op: o.shadeOp ?? top }) }
        // an ink disc (a tyre, a lens barrel) gets a thin sky rim inside its edge, so it still reads on a
        // dark page where ink sinks into the background
        if (o.role === 'ink' && !o.inset && o.inkRim !== false && o.box.w >= 2.8 && Math.abs(o.box.w - o.box.h) < 0.25 * o.box.w) {
          let A = 0; for (let q = 0; q < G.length; q++) if (G[q] < 0) A++
          A *= F.H * F.H
          const r = o.box.w / 2
          if (A > Math.PI * r * r * 0.82) {
            const R = dilate(G, -0.3)
            F.subtract(R, dilate(G, -0.85))
            push(R, 'c1', cls, { op: 0.85 })
          }
        }
        // rim light along the shadow edge of big surfaces
        if (o.rim) {
          const R = F.copy(G)
          F.subtract(R, F.nudge(G, LN[0] * 0.45, LN[1] * 0.45))
          F.subtract(R, F.nudge(G, SD[0] * 1.1, SD[1] * 1.1))
          push(R, 'edge', cls, { op: 0.9 })
        }
        // shine
        const kind = o.shine === undefined ? 'streak' : o.shine
        if (kind && kind !== 'none') {
          let Sf = null
          if (kind === 'glass') Sf = glassBars(G, o.box, o.shineSize ?? 1)
          else if (kind === 'glint') {
            const m = Math.min(o.box.w, o.box.h)
            Sf = glint(o.box.x0 + o.box.w * 0.3, o.box.y0 + o.box.h * 0.3, Math.max(0.9, Math.min(2.2, m * 0.2)) * (o.shineSize ?? 1))
          } else Sf = streak(G, kind, o.shineSize ?? 1, o.box, Gs)
          if (Sf && kind !== 'glint' && Sh) F.subtract(Sf, Sh)
          push(Sf, 'shine', 'wm-shine', o.shineOp ? { op: o.shineOp } : undefined)
        }
        return
      }
      case 'ink': {
        const L = asLines(o.lines)
        if (!L.length) return
        const w = o.w ?? M.INK
        const G = F.strokesW(inkPolys(L, w, o.taper ?? true), MG)
        if (o.shift !== 0) uni(G, F.nudge(G, M.INK_SHIFT[0] * (o.shift ?? 1), M.INK_SHIFT[1] * (o.shift ?? 1)))
        push(G, o.role || 'ink', cls, o.op ? { op: o.op } : undefined)
        return
      }
      case 'tube': {
        if (!o.L.length) return
        const w = o.w ?? M.TUBE, ol = o.ol ?? M.TUBE_OL
        if (ol > 0) {
          const B = F.strokes(o.L, w + 2 * ol, MG)
          uni(B, F.nudge(B, M.OL_SHIFT[0] * 0.7, M.OL_SHIFT[1] * 0.7))
          push(B, 'ink', cls)
        }
        push(o.core, o.role || 'c1', cls)
        if (o.shade !== 0 && o.shade !== false) {
          const u = Math.max(0.35, w * 0.42)
          const Sh = F.copy(o.core)
          F.subtract(Sh, F.nudge(o.core, LN[0] * u, LN[1] * u))
          const [tr, top] = SHADE_TONE[o.role || 'c1'] || ['shadow', M.SHADE_OP]; push(Sh, tr, cls, { op: top })
        }
        return
      }
      case 'paint': push(fieldOf(o.shape), o.role || 'ink', o.part === 'shine' ? 'wm-shine' : o.part === 'deco' ? 'wm-deco' : cls, o.op ? { op: o.op } : undefined); return
      case 'shine': push(fieldOf(o.shape), o.role || 'shine', 'wm-shine', o.op ? { op: o.op } : undefined); return
      case 'ground': push(fieldOf(o.shape), o.role || 'shadow', 'wm-shadow', { op: o.op ?? 0.18 }); return
      case 'deco': {
        const G = fieldOf(o.shape)
        if (o.ol) { const B = dilate(G, o.ol); push(B, 'ink', 'wm-deco') }
        push(G, o.role || 'c3', 'wm-deco', o.op ? { op: o.op } : undefined)
        return
      }
      case 'sparkle': sparkles.push(o); layers.push({ sparkle: o }); return
      case 'cut': {
        const C = dilate(fieldOf(o.shape), o.gap ?? 0)
        for (const l of layers) if (l.f) F.subtract(l.f, C)
        return
      }
    }
  })

  // place automatic sparkles in the freest corner
  if (sparkles.length) {
    const occ = F.field(MG)
    for (const l of layers) if (l.f) uni(occ, l.f)
    const used = []
    for (const s of sparkles) {
      const idx = layers.findIndex(l => l.sparkle === s)
      const spot = s.auto ? freeSpot(occ, s, used, opts.seed || '') : { x: s.x, y: s.y, r: s.r ?? 2 }
      layers.splice(idx, 1)
      if (!spot) continue
      used.push(spot)
      const G = fieldOf(sparkleShape(spot.x, spot.y, spot.r, s.waist ?? 0.2, s.deg ?? 0))
      const add = []
      if (s.ol) add.push({ f: dilate(G, s.ol), role: 'ink', cls: 'wm-deco' })
      add.push({ f: G, role: s.role || 'c3', cls: 'wm-deco' })
      if (s.mini !== false) {
        const mr = Math.max(0.45, spot.r * 0.28)
        const mx = spot.x + spot.mx * spot.r * 1.25, my = spot.y + spot.my * spot.r * 1.25
        if (mx > 1 && mx < 23 && my > 1 && my < 23 && clear(occ, mx, my, mr + 0.5)) add.push({ f: fieldOf(circle(mx, my, mr)), role: s.miniRole || 'c2', cls: 'wm-deco' })
      }
      layers.splice(idx, 0, ...add)
    }
  }
  let nodes = emit(layers, opts)
  // keep the markup small: a dense icon is re-emitted with one decimal and a coarser fit
  const size = nodes.reduce((m, n) => m + n[1].d.length + 60, 0)
  if (size > 7600 && !opts.dec) nodes = emit(layers, { ...opts, dec: 1, tol: 0.055 })
  return nodes
}

function clear(occ, x, y, r) {
  const sample = (px, py) => {
    const i = Math.round(px / F.H), j = Math.round(py / F.H)
    if (i < 0 || j < 0 || i >= F.N || j >= F.N) return -1
    return occ[j * F.N + i]
  }
  if (sample(x, y) < 0.3) return false
  for (let k = 0; k < 16; k++) {
    const a = k * Math.PI / 8
    for (const rr of [r * 0.5, r]) if (sample(x + rr * Math.cos(a), y + rr * Math.sin(a)) < 0.25) return false
  }
  return true
}
// candidate sparkle spots: corners first (upper right preferred), largest radius that fits
function freeSpot(occ, s, used, seed) {
  const R = rng('anime-sparkle:' + seed)
  const want = s.r ?? 2.4, min = s.min ?? 1.35
  const corners = [...(s.where || []), [19.6, 4.4, -1, 1], [4.4, 4.4, 1, 1], [19.6, 19.6, -1, -1], [4.4, 19.6, 1, -1], [12, 3.2, 1, 1], [20.6, 12, -1, 1]]
  const jitter = R() * 0.6 - 0.3
  for (let r = want; r >= min; r -= 0.25) {
    for (const [cx0, cy0, mx, my] of corners) {
      for (const [ox, oy] of [[0, 0], [mx * 0.8, my * 0.8], [mx * -0.6, my * 0.6], [0, my * 1.2], [mx * 1.2, 0]]) {
        const x = cx0 + ox + jitter * 0.3, y = cy0 + oy
        if (x - r < 0.6 || x + r > 23.4 || y - r < 0.6 || y + r > 23.4) continue
        if (used.some(u => Math.hypot(u.x - x, u.y - y) < u.r + r + 1)) continue
        if (clear(occ, x, y, r + 0.55)) return { x, y, r, mx, my: -my }
      }
    }
  }
  return null
}

function flat(a, out = []) {
  if (!a) return out
  if (Array.isArray(a)) { for (const x of a) flat(x, out); return out }
  if (typeof a === 'object' && a.t) out.push(a)
  return out
}

// ---------------------------------------------------------------------------
// emit: trace every layer, merge neighbours with identical paint
function emit(layers, opts) {
  const dec = opts.dec ?? M.DEC, tol = opts.tol ?? M.TOL
  const nodes = []
  let last = null
  for (const l of layers) {
    if (!l.f) continue
    const rings = F.trace(l.f, tol, 0.05)
    if (!rings.length) continue
    const d = ringsD(rings, dec)
    if (!d) continue
    const key = l.role + '|' + l.cls + '|' + (l.op || '')
    if (last && last.key === key) { last.node[1].d += d; continue }
    const a = { d, fill: paint(l.role) }
    if (l.op) a['fill-opacity'] = String(l.op).replace(/^0\./, '.')
    if (l.cls) a.class = l.cls
    const node = ['path', a]
    nodes.push(node)
    last = { key, node }
  }
  return nodes
}
