// BLUEPRINT — creative, "technical". A drafting-table drawing that shows its work.
//
// Layers (back to front), all strokes, no fills except dots:
//   1. KEYLINE — the Ø20 icon keyline as a chain (dash-dot) hairline, only for
//      objects with mass that are not boxes. 0.45u, 34% opacity.
//   2. CONSTRUCTION — 0.45u hairlines at 50%: fillet construction (every r<=3
//      rounded corner shows the sharp corner it was cut from, as overshooting
//      hairlines), and one DIMENSION LINE with extension lines, placed below the
//      object (else right/top/left) wherever there is room.
//   3. CENTRE LINES — chain-dash axes of mirror symmetry and centre marks
//      through circles / large arcs, overhanging the geometry.
//   4. DIMENSION TICKS — architectural 45° slashes, 0.5u at 75%.
//   5. OBJECT LINE — the skeleton at 1.25u (responds to strokeWidth), square
//      caps, mitred joins, re-emitted as exact L / C / A curves and broken open
//      where a node sits.
//   6. NODES — up to 5 open control rings (r .8, 0.5u) on free ends and sharp
//      vertices of the silhouette: spaced >= 4u, never crowding other ink,
//      never deep inside the object's mass, and mirror-paired on symmetric icons.
// Every construction line is clipped clear of the object by a fixed 1.3u
// clearance (and of the nodes), so it never touches the ink and falls away to a
// faint haze at 16–24px. Construction, ticks and nodes are painted with
// color="var(--with-accent, currentColor)" + stroke="currentColor": one colour by
// default, a two-tone blueprint when --with-accent is set, and renderers without
// CSS variables fall back to currentColor.
import { bbox, pointInRing, distToPolyline } from '../kernel/geom.mjs'
import { parseSegs, segPt, segTan, segFlat, segLen, trimStart, trimEnd, chainLen, chainD, nums } from './_blueprint-path.mjs'
import { textInfo } from './_live-text.mjs'

const D2R = Math.PI / 180
const K = {
  obj: 1.25,
  text: 1.75,              // live-icon lettering (round pen)
  textClr: 1.4,            // construction stays this far outside a line of lettering's box
  con: { w: 0.45, op: 0.5, key: 0.34 },
  dim: { room: 1.3, w: 0.5, op: 0.75, tick: 0.65 },
  node: { r: 0.8, w: 0.5, gap: 0.95, max: 5, spacing: 4, clear: 2.4, keep: 1.45, minLine: 6.5, maxCorners: 10, minPart: 7.5, tooth: 3.6 },
  clr: 1.3,                // construction clearance from object centrelines
  corner: 35 * D2R,        // a joint turning more than this is a sharp vertex
  mark: 1.7,               // centre lines overhang a circle by this much
  axis: 2.2,               // symmetry axes overhang the object by this much
  fillet: { max: 4, spacing: 5, over: 2.1 }, // virtual sharp corners of r<=3 fillets
  chain: '2.4 .7 .4 .7',   // long dash - dot
  chainLive: '2.4 .7 .7 .7', minDashLive: 0.6, // live icons: dots and cut ends never become specks
  canvas: [0.7, 23.3],
  minRun: 0.55,
}
const ACCENT = 'var(--with-accent, currentColor)'

const d2 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
const add = (a, v, k) => [a[0] + v[0] * k, a[1] + v[1] * k]
const neg = v => [-v[0], -v[1]]

// ---------------------------------------------------------------------------
// spatial index over polylines -> nearest distance (capped)
function makeIndex(polys) {
  const G = 1, O = 6, N = 36
  const cells = new Array(N * N)
  const segs = []
  const cell = v => Math.max(0, Math.min(N - 1, Math.floor(v / G) + O))
  for (const P of polys) {
    const m = P.length === 1 ? 1 : P.length - 1
    for (let i = 0; i < m; i++) {
      const a = P[i], b = P[Math.min(i + 1, P.length - 1)]
      const id = segs.length; segs.push([a, b])
      for (let cx = cell(Math.min(a[0], b[0])); cx <= cell(Math.max(a[0], b[0])); cx++)
        for (let cy = cell(Math.min(a[1], b[1])); cy <= cell(Math.max(a[1], b[1])); cy++)
          (cells[cy * N + cx] ||= []).push(id)
    }
  }
  const segDist = (p, a, b) => {
    const abx = b[0] - a[0], aby = b[1] - a[1], apx = p[0] - a[0], apy = p[1] - a[1]
    const L2 = abx * abx + aby * aby
    const t = L2 < 1e-12 ? 0 : Math.max(0, Math.min(1, (apx * abx + apy * aby) / L2))
    return Math.hypot(apx - abx * t, apy - aby * t)
  }
  return (p, R) => {
    let best = R
    const x0 = cell(p[0] - R), x1 = cell(p[0] + R), y0 = cell(p[1] - R), y1 = cell(p[1] + R)
    for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++) {
      const L = cells[cy * N + cx]; if (!L) continue
      for (const id of L) { const d = segDist(p, segs[id][0], segs[id][1]); if (d < best) best = d }
    }
    return best
  }
}

// flatten a chain of segments, with cumulative arclength per point
function flatChain(segs) {
  const pts = [], s = []
  let acc = 0
  segs.forEach((g, k) => {
    let F = segFlat(g, 0.3)
    if (g.k === 'L') {
      const n = Math.max(1, Math.ceil(segLen(g) / 0.3)); F = []
      for (let i = 0; i <= n; i++) F.push([g.a[0] + (g.b[0] - g.a[0]) * i / n, g.a[1] + (g.b[1] - g.a[1]) * i / n])
    }
    F.forEach((p, i) => {
      if (k > 0 && i === 0) return
      if (pts.length) acc += d2(pts.at(-1), p)
      pts.push(p); s.push(acc)
    })
  })
  return { pts, s, L: acc }
}

// ---------------------------------------------------------------------------
// clip a straight construction line / circular arc against the keep test
function clipLine(a, b, keep, pitch = 0.1) {
  const L = d2(a, b), n = Math.max(1, Math.ceil(L / pitch)), runs = []
  let s0 = -1
  for (let k = 0; k <= n; k++) {
    const p = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]
    if (keep(p)) { if (s0 < 0) s0 = k }
    else if (s0 >= 0) { runs.push([s0, k - 1]); s0 = -1 }
  }
  if (s0 >= 0) runs.push([s0, n])
  return runs.filter(([i, j]) => (j - i) / n * L >= K.minRun)
    .map(([i, j]) => [[a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n], [a[0] + (b[0] - a[0]) * j / n, a[1] + (b[1] - a[1]) * j / n]])
}
function clipCircle(c, r, keep) {
  const n = Math.ceil(2 * Math.PI * r / 0.1), ok = []
  for (let k = 0; k < n; k++) { const t = k / n * 2 * Math.PI; ok.push(keep([c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)])) }
  if (ok.every(Boolean)) return [[0, 2 * Math.PI]]
  const start = ok.findIndex(v => !v), runs = []
  let s0 = -1
  for (let q = 1; q <= n; q++) {
    const k = (start + q) % n
    if (ok[k]) { if (s0 < 0) s0 = start + q }
    else if (s0 >= 0) { runs.push([s0, start + q - 1]); s0 = -1 }
  }
  return runs.filter(([i, j]) => (j - i) / n * 2 * Math.PI * r >= K.minRun)
    .map(([i, j]) => [i / n * 2 * Math.PI, j / n * 2 * Math.PI])
}
const lineD = ([a, b]) => {
  const f = v => Math.round(v * 100) / 100
  if (f(a[0]) === f(b[0])) return 'M' + nums([a[0], a[1]]) + 'V' + nums([b[1]])
  if (f(a[1]) === f(b[1])) return 'M' + nums([a[0], a[1]]) + 'H' + nums([b[0]])
  return 'M' + nums([a[0], a[1]]) + 'L' + nums([b[0], b[1]])
}
// Chain (dash-dot) lines are written into the geometry, one subpath per dash,
// instead of stroke-dasharray: Android VectorDrawable, Figma/Canva/PowerPoint
// importers and other SVG Tiny consumers drop dash arrays and would draw the
// centre lines solid. The pattern restarts at the start of every line, exactly
// as SVG restarts a dash array per subpath, and the dashes inherit the root's
// square caps, so browsers paint the same pixels as the old dasharray did.
const DASH = K.chain.trim().split(/\s+/).map(Number)
// a live icon's chain lines keep every piece a visible dash (its dots a touch longer, no crumbs where a run is cut):
// a value change moves the clipping, and crumbs would flicker around the drawing
const DASH_LIVE = K.chainLive.trim().split(/\s+/).map(Number)
let LIVE = false
function dashRuns(L) {
  const runs = [], P = LIVE ? DASH_LIVE : DASH, min = LIVE ? K.minDashLive : 0.005
  for (let s = 0, i = 0; s < L - 1e-6; i++) {
    const len = P[i % P.length]
    if (i % 2 === 0) { const e = Math.min(L, s + len); if (e - s > min) runs.push([s, e]) }
    s += len
  }
  return runs
}
const r2 = v => Math.round(v * 100) / 100
// runs: [[A, B, arcRadius | 0]] -> 'M A l|a ... m ... l|a ...' (relative after the first point,
// with deltas taken between rounded absolute points so nothing drifts)
function dashD(runs) {
  let d = '', cur = null
  for (const [A0, B0, r] of runs) {
    const A = [r2(A0[0]), r2(A0[1])], B = [r2(B0[0]), r2(B0[1])]
    const dx = r2(B[0] - A[0]), dy = r2(B[1] - A[1])
    if (!dx && !dy) continue
    d += cur ? 'm' + nums([r2(A[0] - cur[0]), r2(A[1] - cur[1])]) : 'M' + nums(A)
    if (r) d += 'a' + nums([r, r, 0, '0', '1', dx, dy])
    else if (!dy) d += 'h' + nums([dx])
    else if (!dx) d += 'v' + nums([dy])
    else d += 'l' + nums([dx, dy])
    cur = B
  }
  return d
}
const dashLine = ([a, b]) => {
  const L = d2(a, b), at = s => [a[0] + (b[0] - a[0]) * s / L, a[1] + (b[1] - a[1]) * s / L]
  return dashD(dashRuns(L).map(([s, e]) => [at(s), at(e), 0]))
}
// an arc from t0 to t1 (increasing angle = sweep 1) as one dashed subpath; a full ring starts at angle 0
const dashArc = (c, r, t0, t1) => {
  const P = t => [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]
  const span = Math.min(t1 - t0, 2 * Math.PI)
  if (span > 2 * Math.PI - 1e-6) t0 = 0
  // short pieces (the dots) are chords: a 0.4u chord on r10 sags 0.002u
  return dashD(dashRuns(span * r).map(([s, e]) => [P(t0 + s / r), P(t0 + e / r), e - s > 1 ? r : 0]))
}
const ringD = (p, r) => 'M' + nums([p[0] + r, p[1]]) + 'A' + nums([r, r, 0, '1', '0', p[0] - r, p[1]]) + 'A' + nums([r, r, 0, '1', '0', p[0] + r, p[1]])

// ---------------------------------------------------------------------------
// do two plates' centrelines run together (within 0.3u) for more than 0.9u?
function platesOverlap(lines) {
  for (const pl of new Set(lines.map(s => s.plate))) {
    const others = lines.filter(s => s.plate !== pl)
    if (!others.length) continue
    const near = makeIndex(others.map(s => s.flat.pts))
    for (const s of lines.filter(q => q.plate === pl)) {
      let run = 0
      const P = s.flat.pts
      for (let k = 0; k < P.length; k++) {
        const step = k ? d2(P[k], P[k - 1]) : 0
        if (near(P[k], 0.5) < 0.3) { run += step; if (run > 0.9) return true } else run = 0
      }
    }
  }
  return false
}

function analyse(icon) {
  const subs = []
  for (const p of icon.paths || []) {
    let parsed = []
    try { parsed = parseSegs(p.d || '') } catch { parsed = [] }
    const text = !!textInfo(p)
    for (const s of parsed) subs.push({ ...s, plate: p.plate || 'K', text })
  }
  const lines = [], dots = []
  for (const s of subs) {
    const L = chainLen(s.segs)
    if (L < 0.45) { const p = segPt(s.segs[0], 0.5); p.plate = s.plate; dots.push(p) }
    else { s.L = L; s.flat = flatChain(s.segs); lines.push(s) }
  }
  return { lines, dots }
}

// candidate control nodes: free ends and sharp vertices
function candidates(lines) {
  const C = []
  lines.forEach((s, si) => {
    const S = s.segs
    if (!s.closed && s.L >= K.node.minLine) {
      C.push({ p: S[0].a, kind: 'end', turn: 0, inc: [{ si, at: 'start' }], dirs: [neg(segTan(S[0], 0))] })
      C.push({ p: S.at(-1).b, kind: 'end', turn: 0, inc: [{ si, at: 'end' }], dirs: [segTan(S.at(-1), 1)] })
    }
    const n = S.length, mine = []
    for (let j = s.closed ? 0 : 1; j < n; j++) {
      const A = S[(j - 1 + n) % n], B = S[j]
      const tin = segTan(A, 1), tout = segTan(B, 0)
      const turn = Math.acos(Math.max(-1, Math.min(1, tin[0] * tout[0] + tin[1] * tout[1])))
      if (turn < K.corner) continue
      if (s.L < K.node.minLine || segLen(A) < 2.5 || segLen(B) < 2.5) continue
      mine.push({ p: B.a, kind: 'corner', turn, inc: [{ si, at: 'joint', j }], dirs: [tin, neg(tout)] })
    }
    // a ring with many vertices (gear, sawtooth) is texture, not construction;
    // so is a run of short-legged zigzag teeth (receipt edge), and every vertex
    // of a small part (sparkle, badge glyph) where a ring would swamp the shape
    const bb = bbox(s.flat.pts)
    if (Math.max(bb.w, bb.h) < K.node.minPart) mine.length = 0
    const short = c => { const j = c.inc[0].j; return segLen(S[(j - 1 + n) % n]) < K.node.tooth && segLen(S[j]) < K.node.tooth }
    const teeth = mine.filter(short)
    const keepC = teeth.length >= 3 ? mine.filter(c => !short(c)) : mine
    if (keepC.length <= K.node.maxCorners) C.push(...keepC)
  })
  // merge coincident candidates (several lines meeting at one vertex)
  const out = []
  for (const c of C) {
    const m = out.find(o => d2(o.p, c.p) < 0.3)
    if (!m) { out.push({ ...c, inc: [...c.inc], dirs: [...c.dirs] }); continue }
    m.inc.push(...c.inc); m.dirs.push(...c.dirs)
    if (c.kind === 'corner' || m.kind === 'corner' || m.inc.length > 1) m.kind = 'corner'
    m.turn = Math.max(m.turn, c.turn, Math.PI / 3)
  }
  return out
}

// is anything other than the node's own incident lines too close to it?
function crowded(c, lines, dots) {
  const R = K.node.clear
  for (const q of dots) if (d2(q, c.p) < R) return true
  for (let si = 0; si < lines.length; si++) {
    const { pts, s, L } = lines[si].flat
    const own = c.inc.filter(v => v.si === si).map(v => {
      if (v.at === 'start') return 0
      if (v.at === 'end') return L
      const j = v.j
      return lines[si].segs.slice(0, j).reduce((a, g) => a + segLen(g), 0)
    })
    for (let k = 0; k < pts.length; k++) {
      if (own.some(s0 => { const ds = Math.abs(s[k] - s0); return Math.min(ds, lines[si].closed ? L - ds : ds) < 2.4 })) continue
      if (d2(pts[k], c.p) < R) return true
    }
  }
  return false
}

function pickNodes(cands, lines, dots, axes, interior) {
  // (a live icon's node never reaches the canvas edge: its geometry moves with the value)
  const inCanvas = p => !LIVE || Math.min(p[0], p[1], 24 - p[0], 24 - p[1]) >= K.node.r + K.node.w / 2 + 0.6
  const ok = cands.filter(c => !crowded(c, lines, dots) && !interior(c.p) && inCanvas(c.p))
  const score = c => (c.kind === 'corner' ? 2 + c.turn : 1.6) + d2(c.p, [12, 12]) / 12
  // mirror images travel together, so a symmetric icon gets symmetric nodes
  const mirror = (p, a) => a.axis === 'x' ? [2 * a.c - p[0], p[1]] : [p[0], 2 * a.c - p[1]]
  const groups = [], seen = new Set()
  for (const c of ok) {
    if (seen.has(c)) continue
    const g = [c]; seen.add(c)
    for (let k = 0; k < g.length; k++) for (const a of axes) {
      const m = mirror(g[k].p, a)
      const twin = ok.find(o => !seen.has(o) && d2(o.p, m) < 0.3)
      if (twin) { g.push(twin); seen.add(twin) }
    }
    groups.push({ g, s: score(c) - (g.length > 1 ? 0 : 0.001), i: groups.length })
  }
  groups.sort((a, b) => b.s - a.s || a.i - b.i)
  const picked = []
  for (const { g } of groups) {
    if (picked.length + g.length > K.node.max) continue
    const all = [...picked]
    if (g.every(c => { const fine = all.every(q => d2(q.p, c.p) >= K.node.spacing); all.push(c); return fine })) picked.push(...g)
  }
  return picked
}

// break the object line open at the chosen nodes
function objectD(lines, nodes) {
  const cut = lines.map(() => ({ start: false, end: false, joints: new Set() }))
  for (const nd of nodes) for (const v of nd.inc) {
    if (v.at === 'start') cut[v.si].start = true
    else if (v.at === 'end') cut[v.si].end = true
    else cut[v.si].joints.add(v.j)
  }
  const G = K.node.gap + K.obj / 2   // square caps reach half a stroke past the cut
  let d = ''
  lines.forEach((s, si) => {
    if (s.skip) return
    const c = cut[si], S = s.segs
    const J = [...c.joints].sort((a, b) => a - b)
    if (!J.length && !c.start && !c.end) { d += chainD(S, s.closed); return }
    let pieces = []
    if (s.closed && J.length) {
      const R = [...S.slice(J[0]), ...S.slice(0, J[0])]
      const rel = J.map(j => (j - J[0] + S.length) % S.length).concat(S.length)
      for (let k = 0; k < rel.length - 1; k++) pieces.push({ segs: R.slice(rel[k], rel[k + 1]), a: true, b: true })
    } else if (s.closed) {
      pieces.push({ segs: S, closed: true })
    } else {
      const edges = [0, ...J, S.length]
      for (let k = 0; k < edges.length - 1; k++)
        pieces.push({ segs: S.slice(edges[k], edges[k + 1]), a: k === 0 ? c.start : true, b: k === edges.length - 2 ? c.end : true })
    }
    for (const pc of pieces) {
      if (pc.closed) { d += chainD(pc.segs, true); continue }
      let g = pc.segs
      if (pc.a) g = trimStart(g, G)
      if (pc.b) g = trimEnd(g, G)
      if (g.length && chainLen(g) > 0.3) d += chainD(g, false)
    }
  })
  return d
}

// ---------------------------------------------------------------------------
// circle centres from true arcs and from closed near-circular rings
function centres(lines) {
  const groups = []
  for (const s of lines) {
    for (const g of s.segs) {
      if (g.k !== 'A' || g.r < 2) continue
      const m = groups.find(q => Math.hypot(q.c[0] - g.cx, q.c[1] - g.cy) < 0.15)
      if (m) { m.sweep += Math.abs(g.dt); m.r = Math.max(m.r, g.r) } else groups.push({ c: [g.cx, g.cy], r: g.r, sweep: Math.abs(g.dt) })
    }
    if (s.closed && !s.segs.some(g => g.k === 'A')) {
      const b = bbox(s.flat.pts), c = [b.cx, b.cy]
      const rs = s.flat.pts.map(p => d2(p, c)), r = rs.reduce((a, v) => a + v, 0) / rs.length
      if (r >= 2 && Math.max(...rs) - Math.min(...rs) < 0.08 * r) {
        const m = groups.find(q => d2(q.c, c) < 0.15)
        if (m) { m.sweep += 2 * Math.PI; m.r = Math.max(m.r, r) } else groups.push({ c, r, sweep: 2 * Math.PI })
      }
    }
  }
  return groups.filter(g => g.sweep >= Math.PI * 0.95).sort((a, b) => b.r - a.r)
}

function symmetric(pts, near, axis, c) {
  let bad = 0
  for (const p of pts) {
    const m = axis === 'x' ? [2 * c - p[0], p[1]] : [p[0], 2 * c - p[1]]
    const dd = near(m, 0.6)
    if (dd > 0.5) return false
    if (dd > 0.18) bad++
  }
  return bad <= pts.length * 0.04
}

// ---------------------------------------------------------------------------
function render(icon) {
  LIVE = !!icon.params
  const { lines, dots } = analyse(icon)
  const out = []
  if (!lines.length && !dots.length) return out

  const polys = [...lines.map(s => s.flat.pts), ...dots.map(p => [p])]
  const near = makeIndex(polys)
  const allPts = lines.flatMap(s => s.flat.pts).concat(dots)
  const B = bbox(allPts)

  // ---- axes of symmetry
  const samples = lines.flatMap(s => s.flat.pts.filter((_, k) => k % 2 === 0)).concat(dots)
  const axes = []
  for (const axis of ['x', 'y']) {
    const cands = [axis === 'x' ? B.cx : B.cy, 12].map(v => Math.round(v * 4) / 4)
    for (const c of cands) if (symmetric(samples, near, axis, c)) { axes.push({ axis, c }); break }
  }

  // ---- nodes
  // a node deep inside the object's mass is interior detail, not silhouette
  const fillRings = (icon.fillSet || []).filter(r => r.length > 2)
  const interior = p => {
    if (!fillRings.length) return false
    let inside = false
    for (const r of fillRings) if (pointInRing(p, r)) inside = !inside
    if (!inside) return false
    for (const r of fillRings) if (distToPolyline(p, r, true) < 1.6) return false
    return true
  }
  // Live-icon text is lettering, not geometry: no control nodes, centre marks or fillet construction on it
  const shapes = lines.filter(s => !s.text)
  const nodes = pickNodes(candidates(shapes), lines, dots, axes, interior)

  // ---- construction
  const [lo, hi] = K.canvas
  const nodeKeep = K.node.keep + K.node.r
  // a live icon (forge/DYNAMIC.md) shows a value: its face stays clear of construction at every value (no centre
  // lines across a day number or a count), and no construction runs through its lettering
  const live = !!icon.params
  const inFill = p => { let k = false; for (const r of fillRings) if (pointInRing(p, r)) k = !k; return k }
  const tBoxes = lines.filter(s => s.text).map(s => bbox(s.flat.pts)).map(b => [b.x0 - K.textClr, b.y0 - K.textClr, b.x1 + K.textClr, b.y1 + K.textClr])
  const inText = p => tBoxes.some(b => p[0] >= b[0] && p[0] <= b[2] && p[1] >= b[1] && p[1] <= b[3])
  const keep = p => p[0] >= lo && p[0] <= hi && p[1] >= lo && p[1] <= hi &&
    near(p, K.clr) >= K.clr && nodes.every(n => d2(n.p, p) >= nodeKeep) &&
    !(live && (inText(p) || (fillRings.length && inFill(p))))
  let key = '', thin = '', chain = '', ticks = ''

  // keyline circle, for objects with mass that are not boxes (boxes show
  // their construction through their fillet corners instead)
  let hit = 0, tot = 0
  for (const [a, b] of [[[B.x0, B.y0], [B.x1, B.y0]], [[B.x1, B.y0], [B.x1, B.y1]], [[B.x1, B.y1], [B.x0, B.y1]], [[B.x0, B.y1], [B.x0, B.y0]]]) {
    const n = Math.max(1, Math.ceil(d2(a, b) / 0.25))
    for (let k = 0; k < n; k++) { tot++; if (near([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n], 1.3) < 1.25) hit++ }
  }
  const boxy = hit / tot >= 0.72 && B.w >= 8 && B.h >= 8
  if (!boxy && fillRings.length) for (const [t0, t1] of clipCircle([12, 12], 10, keep)) key += dashArc([12, 12], 10, t0, t1)

  // axes of symmetry
  for (const { axis, c } of axes) {
    if ((axis === 'x' ? B.h : B.w) < 3) continue   // stubs across a flat bar read as a '+'
    const L = axis === 'x' ? [[c, B.y0 - K.axis], [c, B.y1 + K.axis]] : [[B.x0 - K.axis, c], [B.x1 + K.axis, c]]
    for (const r of clipLine(L[0], L[1], keep)) chain += dashLine(r)
  }
  // circle centre marks
  const marks = []
  for (const g of centres(shapes)) {
    if (marks.length >= 2) break
    if (marks.some(m => d2(m.c, g.c) < 1.5)) continue
    marks.push(g)
    const e = g.r + K.mark
    const hx = axes.some(a => a.axis === 'y' && Math.abs(a.c - g.c[1]) < 0.3)
    const vx = axes.some(a => a.axis === 'x' && Math.abs(a.c - g.c[0]) < 0.3)
    if (!hx) for (const r of clipLine([g.c[0] - e, g.c[1]], [g.c[0] + e, g.c[1]], keep)) chain += dashLine(r)
    if (!vx) for (const r of clipLine([g.c[0], g.c[1] - e], [g.c[0], g.c[1] + e], keep)) chain += dashLine(r)
  }

  // fillets: a rounded corner shows the sharp corner it was cut from
  const fil = []
  for (const s of shapes) {
    const S = s.segs, n = S.length
    for (let j = 0; j < n; j++) {
      const g = S[j]
      if (g.k !== 'A' || g.r > 3.1 || Math.abs(g.dt) < 60 * D2R || Math.abs(g.dt) > 120 * D2R) continue
      if (!s.closed && (j === 0 || j === n - 1)) continue
      const L1 = S[(j - 1 + n) % n], L2 = S[(j + 1) % n]
      if (L1.k !== 'L' || L2.k !== 'L') continue
      const u = segTan(L1, 1), v = segTan(L2, 0), cr = u[0] * v[1] - u[1] * v[0]
      if (Math.abs(cr) < 0.5) continue
      const T1 = L1.b, T2 = L2.a, w = [T2[0] - T1[0], T2[1] - T1[1]]
      const X = add(T1, u, (w[0] * v[1] - w[1] * v[0]) / cr)
      if (!interior(X)) fil.push({ X, T1, T2, u, v })
    }
  }
  const filPicked = []
  for (const f of fil.sort((a, b) => d2(b.X, [12, 12]) - d2(a.X, [12, 12]))) {
    if (filPicked.length >= K.fillet.max) break
    if (filPicked.every(q => d2(q.X, f.X) >= K.fillet.spacing)) filPicked.push(f)
  }
  for (const f of filPicked) {
    for (const r of clipLine(f.T1, add(f.X, f.u, K.fillet.over), keep, 0.08)) thin += lineD(r)
    for (const r of clipLine(add(f.X, f.v, -K.fillet.over), f.T2, keep, 0.08)) thin += lineD(r)
  }

  // one dimension line: below the object if there is room, else right / top / left
  const room = [['b', hi - 0.3 - B.y1], ['r', hi - 0.3 - B.x1], ['t', B.y0 - lo - 0.3], ['l', B.x0 - lo - 0.3]]
    .find(r => r[1] >= K.dim.room)
  // a flat object (minus, strikethrough bar) would read the dimension line as a
  // second stroke ('=' sign), so it needs some depth too
  if (room && (room[0] === 'b' || room[0] === 't' ? B.w : B.h) >= 6 && Math.min(B.w, B.h) >= 3) {
    // (a live icon's ticks stay inside the canvas whatever the value makes of its extent)
    const side = room[0], off = Math.min(2.4, room[1] - (LIVE ? 0.45 : 0))
    const horiz = side === 'b' || side === 't', sg = side === 'b' || side === 'r' ? 1 : -1
    const at = horiz ? (side === 'b' ? B.y1 : B.y0) + sg * off : (side === 'r' ? B.x1 : B.x0) + sg * off
    const [u0, u1] = horiz ? [B.x0, B.x1] : [B.y0, B.y1]
    const P = (u, v) => horiz ? [u, v] : [v, u]
    for (const r of clipLine(P(u0, at), P(u1, at), keep)) thin += lineD(r)
    for (const u of [u0, u1]) {
      for (const r of clipLine(P(u, at - sg * (off - 0.2)), P(u, at + sg * 0.7), keep)) thin += lineD(r)
      const q = P(u, at), t = K.dim.tick
      ticks += lineD([[q[0] - t, q[1] + t], [q[0] + t, q[1] - t]])
    }
  }

  // ---- emit (back to front)
  // Motion parts (forge/MOTION.md "Parts choreography"): construction, centre lines and ticks are scaffolding,
  // not the object (wm-deco). The object line, its dots and its control nodes are emitted per skeleton plate
  // (wm-k / wm-a / wm-s) when the icon has more than one plate; a node shared by two plates stays with K.
  const deco = { class: 'wm-deco' }
  const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': K.con.w, 'stroke-opacity': op, ...deco })
  if (key) out.push(['path', { d: key, ...con(K.con.key) }])
  if (thin) out.push(['path', { d: thin, ...con(K.con.op) }])
  if (chain) out.push(['path', { d: chain, ...con(K.con.op) }])
  if (ticks) out.push(['path', { d: ticks, color: ACCENT, stroke: 'currentColor', 'stroke-width': K.dim.w, 'stroke-opacity': K.dim.op, ...deco }])
  const nodePlate = n => { const ps = new Set(n.inc.map(v => lines[v.si].plate)); return ps.size === 1 ? [...ps][0] : 'K' }
  const plates = [...new Set([...lines.map(s => s.plate), ...dots.map(p => p.plate)])]
  // plates that run along each other (a lid on a rim) would double-paint the shared edge: keep those fused
  const split = plates.length > 1 && !platesOverlap(lines)
  const groups = split ? ['K', 'A', 'S'].filter(p => plates.includes(p)).concat(plates.filter(p => !'KAS'.includes(p))) : [null]
  const tag = p => split && 'KAS'.includes(p) ? { class: 'wm-' + p.toLowerCase() } : {}
  const objParts = [], dotParts = [], nodeParts = []
  for (const pl of groups) {
    const mine = s => pl === null || s.plate === pl
    // objectD indexes nodes by line, so it is given the full line list with other plates' lines blanked
    const obj = objectD(lines.map(s => mine(s) && !s.text ? s : { ...s, segs: [], skip: true }), nodes)
    // (a live icon's sharp vertices may sit anywhere its value puts them: a short mitre keeps the spike in the canvas)
    if (obj) objParts.push(['path', LIVE ? { d: obj, 'stroke-miterlimit': 2, ...tag(pl) } : { d: obj, ...tag(pl) }])
    // live-icon text is drafting lettering: a round lettering pen (round caps and joins) a touch heavier than the
    // object line, so it reads at 24px and its counters stay open
    const txt = objectD(lines.map(s => mine(s) && s.text ? s : { ...s, segs: [], skip: true }), nodes)
    if (txt) objParts.push(['path', { d: txt, 'stroke-width': K.text, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...tag(pl) }])
    // dots: a tiny ring under the inherited stroke reads as a solid disc that follows strokeWidth
    const dd = dots.filter(mine).map(p => ringD(p, 0.3)).join('')
    if (dd) dotParts.push(['path', { d: dd, ...tag(pl) }])
    const nd = nodes.filter(n => pl === null || nodePlate(n) === pl).map(n => ringD(n.p, K.node.r)).join('')
    if (nd) nodeParts.push(['path', { d: nd, color: ACCENT, stroke: 'currentColor', 'stroke-width': K.node.w, ...tag(pl) }])
  }
  out.push(...objParts, ...dotParts, ...nodeParts)
  return out
}

export default {
  name: 'blueprint',
  title: 'Blueprint',
  kind: 'creative',
  description: 'A drafting-table drawing that shows its work: chain-dash centre lines, fillet construction, a dimension line and open control nodes around a precise 1.25px line. Set --with-accent for a two-tone blueprint.',
  strokeWidth: 1.25,
  root: { fill: 'none', stroke: 'currentColor', 'stroke-width': 1.25, 'stroke-linecap': 'square', 'stroke-linejoin': 'miter' },
  render(icon) {
    try { return render(icon) }
    catch (e) {
      if (globalThis.process?.env?.BP_DEBUG) throw e
      // never throw: fall back to the plain object line
      return (icon.paths || []).map(p => ['path', { d: p.d }])
    }
  },
}
