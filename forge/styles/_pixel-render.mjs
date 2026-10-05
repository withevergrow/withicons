// PIXEL pipeline: skeleton -> layered cell grids -> paths.
import { parsePath } from '../kernel/geom.mjs'
import * as G from './_pixel-core.mjs'
import { TUNE } from './_pixel-tune.mjs'
import { textInfo } from './_live-text.mjs'
import { liveSprite, liveCompose, liveHands, drawHands, liveSlabs, drawSlabs, drawSweep, liveTimerHand, drawPointer, liveNeedle, drawNeedle, stopwatchDial } from './_pixel-live.mjs'
import { pixelText, stampText, clearShine, LABEL_FACE } from './_pixel-text.mjs'
import { pixelStars, stampStars } from './_pixel-star.mjs'

const { N } = G

// zero-length subpaths ("M12 16 L12 16") are dots in Line; the kernel parser drops them
function dots(icon) {
  const out = []
  for (const p of icon.paths || []) {
    for (const chunk of String(p.d || '').split(/(?=[Mm])/)) {
      const m = chunk.match(/^M\s*(-?[\d.]+(?:e[-+]?\d+)?)[\s,]*(-?[\d.]+(?:e[-+]?\d+)?)/)
      if (!m) continue
      let subs
      try { subs = parsePath(chunk) } catch { subs = [] }
      if (!subs.length) out.push({ pts: [[+m[1], +m[2]]], closed: false, plate: p.plate || 'K', pathId: p.id })
    }
  }
  return out
}

// a centreline -> ordered cell chain; circles and circular arcs use canonical rings.
// A closed shape that spans three pixels or fewer each way has no room for a hollow:
// it becomes a solid block (wheels, nodes, small dots), never a hollow speck or a cross.
export function rasterLine(l, sh, tune = {}) {
  // a very short stroke (a typed dot, a tick of 0.5u) is one pixel at its middle
  if (!l.closed && l.pts.length > 1) {
    let len = 0
    for (let k = 1; k < l.pts.length; k++) len += Math.hypot(l.pts[k][0] - l.pts[k - 1][0], l.pts[k][1] - l.pts[k - 1][1])
    if (len < 1.2) {
      const a = l.pts[0], b = l.pts.at(-1), [u, v] = G.toCell([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], sh)
      return [[Math.floor(u), Math.floor(v), 1]]
    }
  }
  const c = rasterLine0(l, sh, tune)
  if (!l.closed || c.length < 3) return c
  let x0 = 99, x1 = -99, y0 = 99, y1 = -99
  for (const [i, j] of c) { x0 = Math.min(x0, i); x1 = Math.max(x1, i); y0 = Math.min(y0, j); y1 = Math.max(y1, j) }
  if (x1 - x0 > 2 || y1 - y0 > 2) return c
  const out = []
  for (let j = y0; j <= y1; j++) for (let i = x0; i <= x1; i++) out.push([i, j, 0])
  return out
}
// an axis-aligned (rounded) rectangle: its edges, in user units, and corner radius
function rectOf(l) {
  if (!l.closed || l.pts.length < 4) return null
  // check the edges between the points too (a triangle's corners all hug its box)
  const pts = []
  for (let k = 0; k < l.pts.length; k++) {
    const a = l.pts[k], b = l.pts[(k + 1) % l.pts.length]
    for (let t = 0; t < 4; t++) pts.push([a[0] + (b[0] - a[0]) * t / 4, a[1] + (b[1] - a[1]) * t / 4])
  }
  l = { pts }
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
  for (const [x, y] of l.pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y) }
  if (x1 - x0 < 2 || y1 - y0 < 2) return null
  // every point lies on an edge, or on a corner arc tangent to two edges with a
  // radius of at most 2.6u (for such a point, R = dx + dy + sqrt(2 dx dy))
  let r = 0
  for (const [x, y] of l.pts) {
    const dx = Math.min(x - x0, x1 - x), dy = Math.min(y - y0, y1 - y)
    if (dx <= 0.05 || dy <= 0.05) continue
    const R = dx + dy + Math.sqrt(2 * dx * dy)
    if (R > Math.min(2.6, (x1 - x0) / 2 + 0.05, (y1 - y0) / 2 + 0.05)) return null
    r = Math.max(r, R)
  }
  return { x0, x1, y0, y1, r }
}

// a rectangle drawn the pixel way: straight one-pixel edges, rounded corners lose their corner pixel
function rectCells(R, sh) {
  const [a0, b0] = G.toCell([R.x0, R.y0], sh), [a1, b1] = G.toCell([R.x1, R.y1], sh)
  const i0 = G.cellOf(a0, 1), i1 = G.cellOf(a1, -1), j0 = G.cellOf(b0, 1), j1 = G.cellOf(b1, -1)
  const round = R.r >= 0.75 && i1 - i0 >= 3 && j1 - j0 >= 3
  const out = []
  for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
    if (i !== i0 && i !== i1 && j !== j0 && j !== j1) continue
    if (round && (i === i0 || i === i1) && (j === j0 || j === j1)) continue
    out.push([i, j, 0])
  }
  return out
}

function rasterLine0(l, sh, tune) {
  const R = rectOf(l)
  if (R) return rectCells(R, sh)
  const fit = l.pts.length >= 6 ? G.fitCircle(l.pts) : null
  if (fit) {
    const sweep = arcSweep(l.pts, fit)
    if (l.closed || Math.abs(sweep) > 5.9) {
      // a tiny circle is a dot: one pixel or a 2x2 block, never a hollow speck
      const dot = fit.r < 1.3, dd = tune.dots || (2 * fit.r / G.P + 1 >= 2.1 ? 2 : 1)
      const sc = dot ? G.snapCircle(fit, sh, dd, dd) : G.snapCircle(fit, sh)
      return G.ringCells(sc.cx, sc.cy, sc.D).map(([i, j]) => [i, j, 0])
    }
    if (Math.abs(sweep) >= Math.PI / 3 && fit.r >= 1.2) {
      const sc = G.snapCircle(fit, sh)
      const ring = G.ringCells(sc.cx, sc.cy, sc.D)
      const [u0, v0] = G.toCell(l.pts[0], sh)
      const th0 = Math.atan2(v0 - sc.cy, u0 - sc.cx), sg = Math.sign(sweep), R = Math.max(1, sc.D / 2 - 0.5)
      const tol = 0.45 / R, TW = 2 * Math.PI
      const sel = []
      for (const [i, j] of ring) {
        let rel = ((Math.atan2(j + 0.5 - sc.cy, i + 0.5 - sc.cx) - th0) * sg) % TW
        if (rel < 0) rel += TW
        if (rel > TW - tol) rel -= TW
        if (rel <= Math.abs(sweep) + tol) sel.push([i, j, 0, rel])
      }
      sel.sort((p, q) => p[3] - q[3])
      if (sel.length) { sel[0][2] = 1; sel.at(-1)[2] = 1; return sel.map(([i, j, p]) => [i, j, p]) }
    }
  }
  const sharp = G.sharpVertices(l.pts, l.closed)
  const Q = l.pts.map(p => G.toCell(p, sh))
  const c = G.chainOf(Q, l.closed, sharp)
  if (tune.thin) return c
  // straight stretches near 45deg, at least two pixels long (curves are flattened finer)
  const segs = []
  for (let k = 0; k + 1 < Q.length + (l.closed ? 1 : 0); k++) {
    const a = Q[k], b = Q[(k + 1) % Q.length], ax = Math.abs(b[0] - a[0]), ay = Math.abs(b[1] - a[1])
    if (Math.hypot(ax, ay) >= 2 && Math.min(ax, ay) / Math.max(ax, ay) > 0.6) segs.push([a, b])
  }
  // an open stroke (an S, a hook, a wisp) is a pen line: its 45deg stretches are bold
  // even where they curve; an outline keeps thin steps except on straight 45deg edges
  if (!l.closed) return G.boldDiag(c, false, null, null)
  return segs.length ? G.boldDiag(c, l.closed, null, segs) : c
}
function arcSweep(pts, c) {
  let tot = 0, prev = Math.atan2(pts[0][1] - c.cy, pts[0][0] - c.cx)
  for (let k = 1; k < pts.length; k++) {
    const a = Math.atan2(pts[k][1] - c.cy, pts[k][0] - c.cx)
    let d = a - prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI
    tot += d; prev = a
  }
  return tot
}

// cells not reachable from the border without crossing ink
function enclosed(ink) {
  const ext = G.grid(), q = []
  for (let k = 0; k < N; k++) for (const [i, j] of [[k, 0], [k, N - 1], [0, k], [N - 1, k]]) {
    const x = G.ix(i, j); if (!ink[x] && !ext[x]) { ext[x] = 1; q.push([i, j]) }
  }
  while (q.length) {
    const [i, j] = q.pop()
    for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const u = i + a, v = j + b, x = G.ix(u, v)
      if (G.inb(u, v) && !ext[x] && !ink[x]) { ext[x] = 1; q.push([u, v]) }
    }
  }
  const out = G.grid()
  for (let k = 0; k < N * N; k++) out[k] = !ext[k] && !ink[k] ? 1 : 0
  return out
}

// drop tone regions the ink does not hold: a region whose cells mostly face open paper
// (wedges between wifi arcs, slivers outside an outline) reads as a smudge in pixels
function openTone(tone, ink) {
  const ext = G.grid(), q = []
  for (let k = 0; k < N; k++) for (const [i, j] of [[k, 0], [k, N - 1], [0, k], [N - 1, k]]) {
    const x = G.ix(i, j); if (!ink[x] && !ext[x]) { ext[x] = 1; q.push([i, j]) }
  }
  while (q.length) {
    const [i, j] = q.pop()
    for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const u = i + a, v = j + b, x = G.ix(u, v)
      if (G.inb(u, v) && !ext[x] && !ink[x]) { ext[x] = 1; q.push([u, v]) }
    }
  }
  const out = G.copy(tone), seen = G.grid()
  for (let k0 = 0; k0 < N * N; k0++) {
    if (!tone[k0] || seen[k0]) continue
    const comp = [], st = [k0]; seen[k0] = 1
    while (st.length) {
      const k = st.pop(); comp.push(k)
      const i = k % N, j = (k - i) / N
      for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const u = i + a, v = j + b, x = G.ix(u, v)
        if (G.inb(u, v) && tone[x] && !seen[x]) { seen[x] = 1; st.push(x) }
      }
    }
    let open = 0
    for (const k of comp) {
      const i = k % N, j = (k - i) / N
      if (i === 0 || j === 0 || i === N - 1 || j === N - 1) { open++; continue }
      for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const x = G.ix(i + a, j + b)
        if (!tone[x] && !ink[x] && ext[x]) { open++; break }
      }
    }
    const lim = comp.length < 6 ? 0 : comp.length * (comp.length >= 12 ? 0.42 : 0.25)
    if (open > lim || comp.length <= 2) for (const k of comp) out[k] = 0
  }
  return out
}

// a hand-drawn sprite (see _pixel-tune.mjs)
export function fromMap(rows) {
  const at = (i, j) => (rows[j] || '')[i] || '.'
  const solid = c => c !== '.' && c !== ' '
  const ink = G.grid(), tone = G.grid(), shine = G.grid(), shade = G.grid()
  let manual = false
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const c = at(i, j), k = G.ix(i, j)
    if (c === '#') ink[k] = 1
    else if (c === '+') tone[k] = 1
    else if (c === 'o') { shine[k] = 1; manual = true }
    else if (c === '=') { shade[k] = 1; manual = true }
    else if (c === 'X') {
      const edge = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => !solid(at(i + a, j + b)))
      if (edge) ink[k] = 1; else tone[k] = 1
    }
  }
  if (manual) return { ink, tone, shade, shine }
  return finish(ink, tone)
}

const cellsOf = str => String(str || '').trim().split(/[\s;]+/).filter(Boolean).map(t => t.split(',').map(Number)).filter(([i, j]) => G.inb(i, j))

// A live icon's drawing (forge/DYNAMIC.md) is placed on the grid by its frame alone (never by its text, so it
// never jumps when the value changes): per axis, the default half-cell offset, or none when that keeps the frame
// off the outermost row / column (a 2..22 frame then lands on cells 1..14 instead of touching the canvas edge)
function liveShift(icon) {
  const textIds = new Set((icon.paths || []).filter(p => textInfo(p)).map(p => p.id))
  let lo = [Infinity, Infinity], hi = [-Infinity, -Infinity]
  const see = ([x, y]) => { lo = [Math.min(lo[0], x), Math.min(lo[1], y)]; hi = [Math.max(hi[0], x), Math.max(hi[1], y)] }
  for (const l of icon.lines || []) if (!textIds.has(l.pathId)) for (const p of l.pts || []) see(p)
  for (const r of icon.fillSet || []) for (const p of r) see(p)
  if (!Number.isFinite(lo[0])) return [0, 0]
  const span = (a, b, sh) => [Math.floor((a - G.SHIFT + sh) / G.P), Math.floor((b - G.SHIFT + sh) / G.P)]
  // offsets of a third of a cell keep 0.5u-snapped coordinates off the cell edges (no rounding ties)
  return [0, 1].map(k => [0, 0.5, 1, -0.5].find(sh => { const [a, b] = span(lo[k], hi[k], sh); return a >= 1 && b <= G.N - 2 }) ?? 0)
}

// a sprite's layers before lighting (so text can be stamped on it)
function spriteLayers(rows) {
  const ink = G.grid(), tone = G.grid(), glint = G.grid()
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const c = (rows[j] || '')[i] || '.', k = G.ix(i, j)
    if (c === '#') ink[k] = 1
    else if (c === '+') tone[k] = 1
    else if (c === 'o') { tone[k] = 1; glint[k] = 1 }
  }
  return { ink, tone, glint }
}
// light the drawing first, then set the text into the lit sprite: a value never moves the shading or highlight
// of the cells around its glyphs (only the cells the text itself takes change)
function litText(L, stamp) {
  const pre = finish(G.copy(L.ink), G.copy(L.tone), L.glint)
  stamp()
  const S = { ink: L.ink, tone: G.grid(), shade: G.grid(), shine: G.grid() }
  for (let k = 0; k < N * N; k++) {
    if (L.ink[k] || !L.tone[k]) continue
    if (pre.shade[k]) S.shade[k] = 1
    else if (pre.shine[k]) S.shine[k] = 1
    else S.tone[k] = 1
  }
  return clearShine(S, L.text)
}
const matteFace = (icon, Sp) => { if (icon.params && LABEL_FACE.has(icon.name)) { Sp.tone = G.or(Sp.tone, Sp.shine); Sp.shine = G.grid() } return Sp }

export function build(icon, tune = TUNE[icon.name] || {}) {
  if (tune.map) return fromMap(tune.map)
  // a live icon whose picture is drawn from a sprite (_pixel-live.mjs); its text is set on top in canvas cells
  const LC = icon.params ? liveCompose(icon) : null
  if (LC) {
    const S = matteFace(icon, LC.T ? litText(LC, () => stampText(LC, LC.T.lines, LC.T.icon, [G.SHIFT, G.SHIFT])) : clearShine(finish(LC.ink, LC.tone, LC.glint), LC.text))
    // cells the composer sets in the shade tone (a thermometer's mercury, a bar's half-cell top)
    if (LC.shade) for (let k = 0; k < N * N; k++) if (LC.shade[k] && !S.ink[k]) { S.shade[k] = 1; S.tone[k] = 0; S.shine[k] = 0 }
    return S
  }
  const SP = icon.params ? liveSprite(icon) : null
  if (SP) {
    const T0 = pixelText(icon), L0 = spriteLayers(SP)
    if (!T0) return matteFace(icon, finish(L0.ink, L0.tone, L0.glint))
    return matteFace(icon, litText(L0, () => stampText(L0, T0.lines, T0.icon, [G.SHIFT, G.SHIFT])))
  }
  if (icon.params && !tune.shift) { const sh = liveShift(icon); if (sh[0] || sh[1]) tune = { ...tune, shift: sh } }
  // Live-icon text is re-set in a bitmap font after the drawing is rasterised (_pixel-text.mjs)
  const T = pixelText(icon)
  if (T) icon = T.icon
  // so are five-point stars: drawn from sprites (_pixel-star.mjs)
  const S = pixelStars(icon)
  if (S) icon = S.icon
  // a live clock's hands are drawn from its centre cell after the face (_pixel-live.mjs)
  const HD = liveHands(icon)
  if (HD) icon = HD.icon
  const TP = liveTimerHand(icon)
  if (TP) icon = TP.icon
  const ND = liveNeedle(icon)
  if (ND) icon = ND.icon
  // and a battery's charge is a filled slab (_pixel-live.mjs)
  const SL = liveSlabs(icon)
  if (SL) icon = SL.icon
  // a kitchen timer's ring is open (the time left is an arc, the spent part dots): its face disc has no rim to
  // hold a body tone, so the timer is ink on paper
  if (icon.params && icon.name === 'timer-ring') tune = { ...tune, notone: true }
  const L = tune.mode === 'sil' ? silhouette(icon, tune) : raster(icon, tune)
  if (tune.notone) { L.tone = G.grid(); L.glint = G.grid() }
  if (icon.params) solidBadges(L, icon, tune.shift || [0, 0])
  if (tune.ink || tune.del || tune.tone || tune.clear) {
    for (const [i, j] of cellsOf(tune.del)) L.ink[G.ix(i, j)] = 0
    for (const [i, j] of cellsOf(tune.clear)) L.tone[G.ix(i, j)] = 0
    for (const [i, j] of cellsOf(tune.ink)) { L.ink[G.ix(i, j)] = 1; L.tone[G.ix(i, j)] = 0 }
    for (const [i, j] of cellsOf(tune.tone)) { L.tone[G.ix(i, j)] = 1; L.ink[G.ix(i, j)] = 0 }
  }
  if (S) stampStars(L, S.stars, tune.shift || [0, 0])
  if (HD) drawHands(L, HD, tune.shift || [0, 0], icon.params)
  if (TP) drawPointer(L, TP, tune.shift || [0, 0])
  if (icon.params && icon.name === 'stopwatch') stopwatchDial(L, icon, tune.shift || [0, 0])
  const SW = icon.params && icon.name === 'stopwatch' ? drawSweep(L, icon, tune.shift || [0, 0]) : false
  let half = SL ? drawSlabs(L, SL, tune.shift || [0, 0], icon.params && icon.params.level) : null
  // a gauge's dial is flat paper like a clock face (a toned dome with a highlight reads as a helmet): ink arc,
  // ink hub and needle on an empty field
  if (ND) { L.tone = G.grid(); L.glint = G.grid(); drawNeedle(L, ND, tune.shift || [0, 0]) }
  const plates = tune.noPlates ? null : L.plates
  const matte = Sp => {
    Sp = matteFace(icon, Sp)
    // a clock face is matte: a highlight pixel beside the hands reads as part of them
    if (HD || SW) { Sp.tone = G.or(Sp.tone, Sp.shine); Sp.shine = G.grid() }
    if (half) for (let k = 0; k < N * N; k++) if (half[k] && !Sp.ink[k]) { Sp.shade[k] = 1; Sp.tone[k] = 0; Sp.shine[k] = 0 }
    return Sp
  }
  if (T) return withPlates(matte(litText(L, () => stampText(L, T.lines, icon, tune.shift || [0, 0]))), plates)
  return withPlates(matte(finish(L.ink, L.tone, L.glint)), plates)
}
// a live icon's count badge (a closed S-plate ring: forge/DYNAMIC.md) is a solid ink chip at every value, so its
// digits are always knocked out of the same chip (and an empty badge is a plain notification dot)
function solidBadges(L, icon, sh) {
  for (const l of icon.lines || []) {
    if (l.plate !== 'S' || !l.closed || !l.pts || l.pts.length < 3) continue
    const cov = G.coverage([l.pts], sh)
    for (let k = 0; k < cov.length; k++) if (cov[k] >= 6 || (L.plates?.s?.[k] && L.ink[k])) {
      L.ink[k] = 1; L.tone[k] = 0; if (L.glint) L.glint[k] = 0
      if (L.plates?.s) L.plates.s[k] = 1
    }
  }
}
const withPlates = (out, plates) => { if (plates) Object.defineProperty(out, 'plates', { value: plates, enumerable: false }); return out }

// silhouette mode: the outline is traced from the mass itself (clean for complex
// filled shapes such as a plane), and only secondary/signal lines are drawn on top
function silhouette(icon, tune) {
  const sh = tune.shift || [0, 0]
  const cov = G.coverage(icon.fillSet, sh)
  const S = G.grid()
  for (let k = 0; k < cov.length; k++) S[k] = cov[k] >= (tune.th || 8) ? 1 : 0
  for (const c of icon.cutouts || []) for (const s of c.subs || []) if (s.closed && s.pts.length > 2) {
    const cc = G.coverage([s.pts], sh); for (let k = 0; k < cc.length; k++) if (cc[k] >= 8) S[k] = 0
  }
  const ink = G.grid(), tone = G.grid()
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = G.ix(i, j); if (!S[k]) continue
    const edge = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => !G.get(S, i + a, j + b))
    if (edge) ink[k] = 1; else tone[k] = 1
  }
  const lines = [...(icon.lines || []).filter(l => l.pts && l.pts.length), ...dots(icon)]
  const k = G.copy(ink), a = G.grid(), s = G.grid()
  for (const l of lines) if (l.plate !== 'K' || tune.all) for (const [i, j] of rasterLine(l, sh)) if (G.inb(i, j)) {
    ink[G.ix(i, j)] = 1; tone[G.ix(i, j)] = 0
    ;(l.plate === 'S' ? s : l.plate === 'A' ? a : k)[G.ix(i, j)] = 1
  }
  return { ink, tone, glint: G.grid(), plates: { k, a, s } }
}

function raster(icon, tune) {
  const sh = tune.shift || [0, 0]
  const lines = [...(icon.lines || []).filter(l => l.pts && l.pts.length), ...dots(icon)]
  const parts = lines.map(l => {
    const chain = rasterLine(l, sh, tune)
    const core = G.grid()
    for (const [i, j, f] of chain) if (G.inb(i, j) && f !== 2) core[G.ix(i, j)] = 1
    return { ...l, chain, core }
  })
  // a bold-diagonal partner may not close the gap to a separate part (two chevrons,
  // a glyph inside a ring): parts whose one-pixel lines touch are joined, the rest
  // keep at least one pixel of paper between them
  const near = (g, i, j) => { for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) if (G.get(g, i + a, j + b)) return true; return false }
  const touching = (p, q) => { for (let k = 0; k < N * N; k++) if (p.core[k] && near(q.core, k % N, (k - k % N) / N)) return true; return false }
  for (const p of parts) {
    p.g = G.copy(p.core)
    const others = parts.filter(q => q !== p && !touching(p, q))
    for (const [i, j, f] of p.chain) if (f === 2 && G.inb(i, j) && !others.some(q => near(q.core, i, j))) p.g[G.ix(i, j)] = 1
  }
  const base = G.or(...parts.filter(p => p.plate !== 'S').map(p => p.g))
  const sig = G.or(...parts.filter(p => p.plate === 'S').map(p => p.g))

  // mass
  const cov = G.coverage(icon.fillSet, sh)
  const fill = G.grid()
  for (let k = 0; k < cov.length; k++) fill[k] = cov[k] >= 8 ? 1 : 0
  // closed cutouts are knocked out; open ones (authored glints, creases) become shine
  const cut = G.grid(), cutAny = G.grid(), glint = G.grid()
  const cutCov = new Uint8Array(N * N)
  for (const c of icon.cutouts || []) {
    // the closed subpaths of one cutout are one even-odd region (a frame keeps its inner panel)
    const closedSet = (c.subs || []).filter(s => s.closed && s.pts.length > 2).map(s => s.pts)
    if (closedSet.length) {
      const cc = G.coverage(closedSet, sh)
      for (let k = 0; k < cc.length; k++) { if (cc[k] >= 8) cut[k] = 1; cutCov[k] = Math.max(cutCov[k], cc[k]) }
      // narrow knockouts (a halo around a line, a dot, an eye) are details, not windows
      for (const pts of closedSet) {
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
        for (const [x, y] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y) }
        if (Math.min(x1 - x0, y1 - y0) > 3.25) continue
        const cd = G.coverage([pts], sh)
        for (let k = 0; k < cd.length; k++) if (cd[k]) cutAny[k] = 1
      }
    }
    for (const s of c.subs || []) {
      if (s.closed && s.pts.length > 2) continue
      if (s.pts.length > 1) {
        for (const [i, j] of G.chainOf(s.pts.map(p => G.toCell(p, sh)), false)) if (G.inb(i, j)) glint[G.ix(i, j)] = 1
      }
    }
  }
  let ink = G.or(base, sig)
  // signals clear a one-pixel moat in everything under them; the moat counts as an
  // edge (body cut by a slash stays body on both sides)
  let moatAll = G.grid()
  if (G.count(sig)) {
    const moat = G.grid()
    moatAll = moat
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) if (sig[G.ix(i, j)])
      for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) if (G.inb(i + a, j + b)) moat[G.ix(i + a, j + b)] = 1
    ink = G.or(G.minus(base, moat), sig)
    for (let k = 0; k < fill.length; k++) if (moat[k]) fill[k] = 0
  }
  // cells the ink encloses and the mass touches at all are body too (no specks
  // of paper in the corners of a small ring)
  const wall = G.or(ink, moatAll)
  const enc = enclosed(wall)
  for (let k = 0; k < cov.length; k++) if (enc[k] && cov[k] >= 3 && !ink[k]) fill[k] = 1
  // a knockout around a detail that is already drawn in ink (text lines, dots, eyes)
  // leaves one- or two-pixel paper specks beside it: the ink carries the detail, so
  // those specks go back to body tone and the detail reads as ink on the body
  // (a halo cell only partly inside the knockout, or a speck of one or two cells)
  const cutKeep = G.copy(cut)
  const touch = (i, j) => { for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) { const u = i + a, v = j + b; if (G.inb(u, v) && ink[G.ix(u, v)] && cutAny[G.ix(u, v)]) return true } return false }
  for (const comp of comps(G.minus(cut, ink))) {
    if (comp.length <= 2) { if (comp.some(([i, j]) => touch(i, j))) for (const [i, j] of comp) cutKeep[G.ix(i, j)] = 0; continue }
    for (const [i, j] of comp) if (cutCov[G.ix(i, j)] < 14 && touch(i, j)) cutKeep[G.ix(i, j)] = 0
  }
  const tone = openTone(G.minus(G.minus(fill, ink), cutKeep), wall)
  // a one-pixel sliver of body left between the outline and a knockout reads as a smudge
  for (const comp of comps(tone)) {
    const paper = (i, j) => G.inb(i, j) && !tone[G.ix(i, j)] && !ink[G.ix(i, j)]
    const sliver = comp.every(([i, j]) => {
      const n4 = [[1, 0], [-1, 0], [0, 1], [0, -1]]
      return n4.some(([a, b]) => paper(i + a, j + b)) && n4.some(([a, b]) => G.get(ink, i + a, j + b))
    })
    if (sliver && comp.some(([i, j]) => cut[G.ix(i, j)] === 0 && cutCov[G.ix(i, j)] > 0)) for (const [i, j] of comp) tone[G.ix(i, j)] = 0
  }
  // body that spills out of a gap in the outline (the open top of a power ring, the
  // mouth of a gauge) has no edge: peel it back where it meets the open paper
  for (let pass = 0; pass < 2; pass++) {
    const ext = G.grid(), q = []
    for (let k = 0; k < N; k++) for (const [i, j] of [[k, 0], [k, N - 1], [0, k], [N - 1, k]]) {
      const x = G.ix(i, j); if (!wall[x] && !tone[x] && !ext[x]) { ext[x] = 1; q.push([i, j]) }
    }
    while (q.length) {
      const [i, j] = q.pop()
      for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const u = i + a, v = j + b, x = G.ix(u, v)
        if (G.inb(u, v) && !ext[x] && !wall[x] && !tone[x]) { ext[x] = 1; q.push([u, v]) }
      }
    }
    const peel = []
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const k = G.ix(i, j)
      if (!tone[k]) continue
      if (i === 0 || j === 0 || i === N - 1 || j === N - 1 || [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => G.get(ext, i + a, j + b))) peel.push(k)
    }
    if (!peel.length) break
    for (const k of peel) tone[k] = 0
  }
  // an open knockout that runs beside the ink (a smile, a crease) is part of that
  // line; only a knockout out on the body is a glint
  const gl = G.and(glint, tone)
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    if (!gl[G.ix(i, j)]) continue
    for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) if (G.get(ink, i + a, j + b)) gl[G.ix(i, j)] = 0
  }
  return { ink, tone, glint: gl, plates: { k: G.or(...parts.filter(p => p.plate === 'K').map(p => p.g)), a: G.or(...parts.filter(p => p.plate === 'A').map(p => p.g)), s: sig } }
}

const comps = (g) => {
  const seen = G.grid(), out = []
  for (let k0 = 0; k0 < N * N; k0++) {
    if (!g[k0] || seen[k0]) continue
    const comp = [], st = [k0]; seen[k0] = 1
    while (st.length) {
      const k = st.pop(); const i = k % N, j = (k - i) / N; comp.push([i, j])
      for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const u = i + a, v = j + b, x = G.ix(u, v)
        if (G.inb(u, v) && g[x] && !seen[x]) { seen[x] = 1; st.push(x) }
      }
    }
    out.push(comp)
  }
  return out
}

// ink + tone -> the lit sprite: shine (top-left, inset from the outline) and
// shade (inner bottom-right rim along the outer outline)
export function finish(ink, tone, glint = G.grid()) {
  const shine = G.grid()
  const nearInk = (i, j) => { for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) if (G.get(ink, i + a, j + b)) return true; return false }
  // one highlight per object: an object is a connected piece of ink; only the
  // largest region it holds is lit (globe compartments share one highlight)
  const lab = new Int16Array(N * N).fill(-1)
  let nl = 0
  for (let k0 = 0; k0 < N * N; k0++) {
    if (!ink[k0] || lab[k0] >= 0) continue
    const st = [k0]; lab[k0] = nl
    while (st.length) {
      const k = st.pop(), i = k % N, j = (k - i) / N
      for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) {
        const u = i + a, v = j + b, x = G.ix(u, v)
        if (G.inb(u, v) && ink[x] && lab[x] < 0) { lab[x] = nl; st.push(x) }
      }
    }
    nl++
  }
  const litObj = new Set()
  const all = comps(tone).sort((p, q) => q.length - p.length)
  all.forEach((comp) => {
    const gl = comp.filter(([i, j]) => glint[G.ix(i, j)])
    if (gl.length) { const key = p => p[0] + p[1] * 1.01; for (const [i, j] of gl.sort((p, q) => key(p) - key(q)).slice(0, 2)) shine[G.ix(i, j)] = 1; return }
    if (comp.length < 5) return
    const objs = new Set()
    for (const [i, j] of comp) for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const u = i + a, v = j + b; if (G.inb(u, v) && lab[G.ix(u, v)] >= 0) objs.add(lab[G.ix(u, v)]) }
    if ([...objs].some(o => litObj.has(o)) && comp.length < 30) return
    for (const o of objs) litObj.add(o)
    const key = p => p[0] + p[1] * 1.01
    const inset = comp.filter(([i, j]) => !nearInk(i, j)).sort((p, q) => key(p) - key(q))
    let p = inset[0]
    if (!p) { if (comp.length < 8) return; p = [...comp].sort((p, q) => key(p) - key(q))[0] }
    shine[G.ix(p[0], p[1])] = 1
    if (comp.length >= 28) for (const [a, b] of [[1, 0], [0, 1]]) {
      const u = p[0] + a, v = p[1] + b
      if (G.get(tone, u, v) && !nearInk(u, v)) shine[G.ix(u, v)] = 1
    }
  })
  const lit = G.minus(tone, shine), shade = G.grid()
  // exterior = paper reachable from the border without crossing ink or tone; outer ink touches it
  const ext = G.grid(), q = []
  for (let k = 0; k < N; k++) for (const [i, j] of [[k, 0], [k, N - 1], [0, k], [N - 1, k]]) {
    const x = G.ix(i, j); if (!ink[x] && !tone[x] && !ext[x]) { ext[x] = 1; q.push([i, j]) }
  }
  while (q.length) {
    const [i, j] = q.pop()
    for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const u = i + a, v = j + b, x = G.ix(u, v)
      if (G.inb(u, v) && !ext[x] && !ink[x] && !tone[x]) { ext[x] = 1; q.push([u, v]) }
    }
  }
  const outer = G.grid()
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) if (ink[G.ix(i, j)])
    for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) if (G.get(ext, i + a, j + b)) outer[G.ix(i, j)] = 1
  const isT = (i, j) => G.get(tone, i, j)
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    if (!lit[G.ix(i, j)]) continue
    const edge = (G.get(outer, i + 1, j) || G.get(outer, i, j + 1) || G.get(outer, i + 1, j + 1))
    if (edge && isT(i - 1, j) && isT(i, j - 1)) shade[G.ix(i, j)] = 1
  }
  return { ink, tone: G.minus(lit, shade), shade, shine }
}

// layered grids -> IconNodes (tone, shade, ink, shine; one merged path each)
// Parts choreography (forge/MOTION.md): every layer is a set of whole, disjoint cells, so the sprite can be split
// by skeleton plate without changing a pixel. S-plate ink (badges, slashes; cleared by a moat) is `wm-s`; ink
// drawn only by A-plate lines, with the body cells mostly held by that ink, is `wm-a`; the highlight is `wm-shine`.
// Everything else (K, and cells K shares with A) stays untagged = the object.
function plateMasks(L) {
  const P = L.plates, NN = N * N
  if (!P) return null
  const s = G.and(L.ink, P.s)
  const aInk = G.minus(G.minus(G.and(L.ink, P.a), P.k), s)
  const a = G.copy(aInk)
  if (G.count(aInk)) {
    // body (tone + shade) regions held mostly by A-only ink go with the A part (a door's panel, a lid)
    const body = G.or(L.tone, L.shade)
    for (const comp of comps(body)) {
      let na = 0, no = 0
      for (const [i, j] of comp) for (const [u, v] of [[i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1]]) {
        if (!G.inb(u, v) || !L.ink[G.ix(u, v)]) continue
        if (aInk[G.ix(u, v)]) na++; else no++
      }
      if (na > no) for (const [i, j] of comp) a[G.ix(i, j)] = 1
    }
  }
  let any = false
  for (let k = 0; k < NN; k++) if (a[k] || s[k]) { any = true; break }
  return any ? { a, s } : null
}
export function nodes(L) {
  const out = []
  const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
  const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
  const push = (g, attrs, cls) => { const d = G.gridD(g); if (d) out.push(['path', cls ? { d, ...attrs, class: cls } : { d, ...attrs }]) }
  const M = plateMasks(L)
  if (!M) {
    push(L.tone, TONE); push(L.shade, SHADE); push(L.ink, {})
  } else {
    const rest = G.or(M.a, M.s)
    push(G.minus(L.tone, rest), TONE); push(G.minus(L.shade, rest), SHADE); push(G.minus(L.ink, rest), {})
    push(G.and(L.tone, M.a), TONE, 'wm-a'); push(G.and(L.shade, M.a), SHADE, 'wm-a'); push(G.and(L.ink, M.a), {}, 'wm-a')
    push(G.and(L.ink, M.s), {}, 'wm-s')
  }
  push(L.shine, { fill: 'var(--with-pixel-shine, #FFFFFF)' }, 'wm-shine')
  return out
}
