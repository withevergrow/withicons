// KAWAII path toolkit: an SVG path is parsed into absolute segments (lines,
// curves and arcs are kept exact), every sharp line-to-line corner is replaced
// by a generous quadratic fillet, and the result is written back compactly.
// That keeps authored curves byte-exact while the silhouette goes "chubby".

const TOK = /[MmLlHhVvCcSsQqTtAaZz]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])

// d -> [{ segs: [{t, a, b, ...}], closed, dot? }]
// Zero-length subpaths ("M12 16 L12 16") are kept as dots.
export function parseSegs(d) {
  const toks = String(d || '').match(TOK) || []
  const subs = []
  let i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0, cur = null, lc = null, lq = null, prev = ''
  const num = () => parseFloat(toks[i++])
  const isNum = () => i < toks.length && !/^[A-Za-z]$/.test(toks[i])
  const open = () => { cur = { segs: [], closed: false, start: [x, y] }; subs.push(cur) }
  const add = s => { if (!cur || cur.closed) open(); cur.segs.push(s) }
  while (i < toks.length) {
    if (!isNum()) cmd = toks[i++]
    else if (!cmd) { i++; continue }
    const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase()
    const ox = rel ? x : 0, oy = rel ? y : 0
    if (C === 'Z') {
      if (cur && !cur.closed) {
        if (dist([x, y], cur.start) > 1e-4) cur.segs.push({ t: 'L', a: [x, y], b: [...cur.start] })
        cur.closed = true
      }
      x = sx; y = sy; prev = 'Z'; continue
    }
    if (!isNum()) { prev = C; continue }
    if (C === 'M') {
      x = ox + num(); y = oy + num(); sx = x; sy = y
      open(); cmd = rel ? 'l' : 'L'; prev = 'M'; continue
    }
    const a = [x, y]
    if (C === 'L') { x = ox + num(); y = oy + num(); add({ t: 'L', a, b: [x, y] }) }
    else if (C === 'H') { x = ox + num(); add({ t: 'L', a, b: [x, y] }) }
    else if (C === 'V') { y = oy + num(); add({ t: 'L', a, b: [x, y] }) }
    else if (C === 'C') {
      const c1 = [ox + num(), oy + num()], c2 = [ox + num(), oy + num()]; x = ox + num(); y = oy + num()
      add({ t: 'C', a, c1, c2, b: [x, y] }); lc = c2
    } else if (C === 'S') {
      const c1 = /[CS]/.test(prev) && lc ? [2 * x - lc[0], 2 * y - lc[1]] : [x, y]
      const c2 = [ox + num(), oy + num()]; x = ox + num(); y = oy + num()
      add({ t: 'C', a, c1, c2, b: [x, y] }); lc = c2
    } else if (C === 'Q') {
      const c = [ox + num(), oy + num()]; x = ox + num(); y = oy + num()
      add({ t: 'Q', a, c, b: [x, y] }); lq = c
    } else if (C === 'T') {
      const c = /[QT]/.test(prev) && lq ? [2 * x - lq[0], 2 * y - lq[1]] : [x, y]
      x = ox + num(); y = oy + num()
      add({ t: 'Q', a, c, b: [x, y] }); lq = c
    } else if (C === 'A') {
      const rx = num(), ry = num(), rot = num(), fa = num(), fs = num(); x = ox + num(); y = oy + num()
      add({ t: 'A', a, rx, ry, rot, fa, fs, b: [x, y] })
    } else { i++ }
    prev = C
    if ([x, y].some(v => !isFinite(v))) { x = a[0]; y = a[1] }
  }
  const out = []
  for (const s of subs) {
    // drop zero-length segments, keep a dot when nothing else is left
    const segs = s.segs.filter(g => g.t !== 'L' || dist(g.a, g.b) > 1e-4)
    if (!segs.length) { out.push({ segs: [], closed: false, dot: s.start }); continue }
    let closed = s.closed
    // an open subpath that returns to its start is drawn as closed
    if (!closed && segs.length > 2 && dist(segs[0].a, segs.at(-1).b) < 0.01) closed = true
    out.push({ segs, closed })
  }
  return out
}

// unit tangent leaving a segment's start / arriving at its end (lines only need this)
const dirOf = (a, b) => { const l = dist(a, b) || 1; return [(b[0] - a[0]) / l, (b[1] - a[1]) / l] }

// Replace sharp line-line corners by quadratic fillets of radius R.
// Returns the list of corners filleted: [{ v, mid }].
export function fillet(subs, R, minR = 0) {
  const corners = []
  for (const sp of subs) {
    const S = sp.segs, n = S.length
    if (!n) continue
    sp.trimA = new Array(n).fill(0); sp.trimB = new Array(n).fill(0); sp.fil = new Array(n).fill(null)
    const J = sp.closed ? n : n - 1
    const want = new Array(n).fill(0)
    for (let j = 0; j < J; j++) {
      const s0 = S[j], s1 = S[(j + 1) % n]
      if (s0.t !== 'L' || s1.t !== 'L') continue
      const d0 = dirOf(s0.a, s0.b), d1 = dirOf(s1.a, s1.b)
      const th = Math.acos(Math.max(-1, Math.min(1, d0[0] * d1[0] + d0[1] * d1[1])))
      if (th < 0.2 || th > 2.95) continue
      want[j] = R * Math.tan(th / 2)
    }
    const hasA = k => sp.closed ? want[(k - 1 + n) % n] > 0 : k > 0 && want[k - 1] > 0   // seg k has a fillet at its start
    const hasB = k => (sp.closed || k < n - 1) && want[k] > 0                               // ... at its end
    for (let j = 0; j < J; j++) {
      if (!want[j]) continue
      const k0 = j, k1 = (j + 1) % n, s0 = S[k0], s1 = S[k1]
      const L0 = dist(s0.a, s0.b), L1 = dist(s1.a, s1.b)
      const t = Math.min(want[j], L0 * (hasA(k0) ? 0.5 : 0.86), L1 * (hasB(k1) ? 0.5 : 0.86))
      if (t < 0.06) continue
      // a fillet tighter than the stroke's half width folds the stroke's inner edge: keep the corner
      if (t / Math.tan(Math.acos(Math.max(-1, Math.min(1, dirOf(s0.a, s0.b)[0] * dirOf(s1.a, s1.b)[0] + dirOf(s0.a, s0.b)[1] * dirOf(s1.a, s1.b)[1]))) / 2) < minR) continue
      const d0 = dirOf(s0.a, s0.b), d1 = dirOf(s1.a, s1.b), v = s0.b
      const p0 = [v[0] - d0[0] * t, v[1] - d0[1] * t], p1 = [v[0] + d1[0] * t, v[1] + d1[1] * t]
      sp.trimB[k0] = t; sp.trimA[k1] = t
      sp.fil[k0] = { p0, c: v, p1 }
      corners.push({ v, mid: [0.25 * p0[0] + 0.5 * v[0] + 0.25 * p1[0], 0.25 * p0[1] + 0.5 * v[1] + 0.25 * p1[1]], sp, j })
    }
  }
  return corners
}

// Open line ends that poke into a filleted corner (an arrow shaft into its
// rounded head) are pulled back to the fillet so no nub sticks out.
export function snapEnds(subs, corners) {
  if (!corners.length) return
  for (const sp of subs) {
    if (sp.closed || !sp.segs.length) continue
    const ends = [[0, 'a'], [sp.segs.length - 1, 'b']]
    for (const [k, side] of ends) {
      const s = sp.segs[k]
      if (s.t !== 'L') continue
      const p = s[side]
      for (const c of corners) {
        if (c.sp === sp) continue
        if (dist(p, c.v) > 0.45) continue
        const o = side === 'a' ? s.b : s.a, L = dist(o, p)
        const u = dirOf(o, p)
        const proj = (c.mid[0] - o[0]) * u[0] + (c.mid[1] - o[1]) * u[1]
        const keep = Math.max(0.45 * L, Math.min(L, proj))
        const trim = L - keep
        if (side === 'a') sp.trimA[k] = Math.max(sp.trimA[k] || 0, trim)
        else sp.trimB[k] = Math.max(sp.trimB[k] || 0, trim)
        break
      }
    }
  }
}

// ---- compact writer ---------------------------------------------------------
export const num = v => {
  let s = String(Math.round(v * 100) / 100)
  if (s === '-0') s = '0'
  if (s.startsWith('0.')) s = s.slice(1)
  else if (s.startsWith('-0.')) s = '-' + s.slice(2)
  return s
}
export const nums = arr => arr.map(num).reduce((acc, s) => acc + (acc && !s.startsWith('-') ? ' ' : '') + s, '')

const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

export function writeSubs(subs) {
  let d = ''
  for (const sp of subs) {
    if (sp.dot) { d += 'M' + nums(sp.dot) + 'h0'; continue }
    const S = sp.segs, n = S.length
    if (!n) continue
    const tA = sp.trimA || [], tB = sp.trimB || [], fil = sp.fil || []
    const startOf = k => { const s = S[k]; return s.t === 'L' && tA[k] ? lerp(s.a, s.b, tA[k] / (dist(s.a, s.b) || 1)) : s.a }
    // a closed path starts after the fillet that ends the last segment
    let p = startOf(0)
    d += 'M' + nums(p)
    const to = q => { const r = nums(q), last = nums(p); p = q; return r === last ? null : r }
    for (let k = 0; k < n; k++) {
      const s = S[k]
      if (s.t === 'L') {
        const L = dist(s.a, s.b) || 1
        const e = tB[k] ? lerp(s.a, s.b, 1 - tB[k] / L) : s.b
        const r = to(e)
        if (r) d += 'L' + r
      } else if (s.t === 'C') { d += 'C' + nums([...s.c1, ...s.c2, ...s.b]); p = s.b }
      else if (s.t === 'Q') { d += 'Q' + nums([...s.c, ...s.b]); p = s.b }
      else if (s.t === 'A') { d += 'A' + nums([s.rx, s.ry, s.rot]) + ' ' + (s.fa ? 1 : 0) + ' ' + (s.fs ? 1 : 0) + ' ' + nums(s.b); p = s.b }
      const f = fil[k]
      if (f) { d += 'Q' + nums([...f.c, ...f.p1]); p = f.p1 }
    }
    if (sp.closed) d += 'Z'
  }
  return d
}
