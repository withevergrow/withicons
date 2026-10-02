// KAWAII scalar fields on a coarse 0.2u grid: distance to centrelines, even-odd
// masks, bilinear sampling and marching squares. Used to find the open space
// where a face, a shine or a little heart fits. Pure functions, deterministic.

export const H = 0.2
export const X0 = -0.4
export const N = 125            // -0.4 .. 24.4
export const NN = N * N
export const gx = i => X0 + i * H
export const gi = v => Math.max(0, Math.min(N - 1, Math.round((v - X0) / H)))

// polylines [{pts, closed}] -> segments [ax, ay, bx, by]
export function segsOf(lines) {
  const out = []
  for (const { pts, closed } of lines) {
    const n = pts.length
    if (!n) continue
    if (n === 1) { out.push([pts[0][0], pts[0][1], pts[0][0], pts[0][1]]); continue }
    const m = closed ? n : n - 1
    for (let s = 0; s < m; s++) { const a = pts[s], b = pts[(s + 1) % n]; out.push([a[0], a[1], b[0], b[1]]) }
  }
  return out
}

// unsigned distance to segments, clamped to band (exact inside the band)
export function distField(segs, band) {
  const f = new Float32Array(NN).fill(band * band)
  for (const [ax, ay, bx, by] of segs) {
    const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy || 1e-12
    const i0 = Math.max(0, Math.floor((Math.min(ax, bx) - band - X0) / H)), i1 = Math.min(N - 1, Math.ceil((Math.max(ax, bx) + band - X0) / H))
    const j0 = Math.max(0, Math.floor((Math.min(ay, by) - band - X0) / H)), j1 = Math.min(N - 1, Math.ceil((Math.max(ay, by) + band - X0) / H))
    for (let j = j0; j <= j1; j++) {
      const py = X0 + j * H - ay, row = j * N
      for (let i = i0; i <= i1; i++) {
        const px = X0 + i * H - ax
        let t = (px * dx + py * dy) / L2
        t = t < 0 ? 0 : t > 1 ? 1 : t
        const ex = px - t * dx, ey = py - t * dy
        const d2 = ex * ex + ey * ey
        if (d2 < f[row + i]) f[row + i] = d2
      }
    }
  }
  for (let k = 0; k < NN; k++) f[k] = Math.sqrt(f[k])
  return f
}

// even-odd inside mask of rings
export function maskOf(rings) {
  const m = new Uint8Array(NN)
  const rows = Array.from({ length: N }, () => [])
  for (const r of rings) {
    const n = r.length
    if (n < 3) continue
    for (let s = 0; s < n; s++) {
      const [x1, y1] = r[s], [x2, y2] = r[(s + 1) % n]
      if (y1 === y2) continue
      const lo = Math.min(y1, y2), hi = Math.max(y1, y2)
      const j0 = Math.max(0, Math.ceil((lo - X0) / H)), j1 = Math.min(N - 1, Math.ceil((hi - X0) / H) - 1)
      for (let j = j0; j <= j1; j++) {
        const y = X0 + j * H
        if (y < lo || y >= hi) continue
        rows[j].push(x1 + (y - y1) * (x2 - x1) / (y2 - y1))
      }
    }
  }
  for (let j = 0; j < N; j++) {
    const xs = rows[j]
    if (xs.length < 2) continue
    xs.sort((a, b) => a - b)
    for (let q = 0; q + 1 < xs.length; q += 2) {
      const i0 = Math.max(0, Math.ceil((xs[q] - X0) / H)), i1 = Math.min(N - 1, Math.ceil((xs[q + 1] - X0) / H) - 1)
      for (let i = i0; i <= i1; i++) m[j * N + i] ^= 1
    }
  }
  return m
}

export function sample(f, x, y) {
  const u = (x - X0) / H, v = (y - X0) / H
  if (!(u >= 0 && v >= 0 && u <= N - 1 && v <= N - 1)) return -9
  const i = Math.min(N - 2, Math.floor(u)), j = Math.min(N - 2, Math.floor(v))
  const fu = u - i, fv = v - j, k = j * N + i
  return (f[k] * (1 - fu) + f[k + 1] * fu) * (1 - fv) + (f[k + N] * (1 - fu) + f[k + N + 1] * fu) * fv
}

// marching squares: closed rings of {f > level}
export function contours(f, level) {
  const IN = new Uint8Array(NN)
  for (let k = 0; k < NN; k++) IN[k] = f[k] > level ? 1 : 0
  for (let q = 0; q < N; q++) { IN[q] = 0; IN[NN - N + q] = 0; IN[q * N] = 0; IN[q * N + N - 1] = 0 }
  const E = 2 * NN
  const adjA = new Int32Array(E).fill(-1), adjB = new Int32Array(E).fill(-1)
  const PX = new Float32Array(E), PY = new Float32Array(E), has = new Uint8Array(E)
  const used = []
  const pt = id => {
    if (has[id]) return
    has[id] = 1
    const k = id >> 1, vert = id & 1, k2 = vert ? k + N : k + 1
    const a = f[k] - level, b = f[k2] - level
    const t = Math.max(0, Math.min(1, a / ((a - b) || 1e-9)))
    const i = k % N, j = (k - i) / N
    PX[id] = X0 + (i + (vert ? 0 : t)) * H
    PY[id] = X0 + (j + (vert ? t : 0)) * H
    used.push(id)
  }
  const link = (a, b) => {
    pt(a); pt(b)
    if (adjA[a] < 0) adjA[a] = b; else adjB[a] = b
    if (adjA[b] < 0) adjA[b] = a; else adjB[b] = a
  }
  for (let j = 0; j < N - 1; j++) for (let i = 0; i < N - 1; i++) {
    const k = j * N + i
    const code = IN[k] | (IN[k + 1] << 1) | (IN[k + N + 1] << 2) | (IN[k + N] << 3)
    if (code === 0 || code === 15) continue
    const eT = 2 * k, eR = 2 * (k + 1) + 1, eB = 2 * (k + N), eL = 2 * k + 1
    switch (code) {
      case 1: case 14: link(eL, eT); break
      case 2: case 13: link(eT, eR); break
      case 3: case 12: link(eL, eR); break
      case 4: case 11: link(eR, eB); break
      case 6: case 9: link(eT, eB); break
      case 7: case 8: link(eL, eB); break
      case 5: case 10: {
        const cen = (f[k] + f[k + 1] + f[k + N] + f[k + N + 1]) / 4 > level
        if (code === 5 ? cen : !cen) { link(eT, eR); link(eB, eL) } else { link(eL, eT); link(eR, eB) }
        break
      }
    }
  }
  const rings = [], done = new Uint8Array(E)
  for (const s of used) {
    if (done[s]) continue
    const ring = []
    let prev = -1, cur = s
    while (cur >= 0 && !done[cur]) {
      done[cur] = 1
      ring.push([PX[cur], PY[cur]])
      const nx = adjA[cur] !== prev ? adjA[cur] : adjB[cur]
      prev = cur; cur = nx
    }
    if (ring.length > 2) rings.push(ring)
  }
  return rings
}

// 4-connected components of a boolean grid -> [{ cells: [k...] }]
export function components(on) {
  const lab = new Int32Array(NN).fill(-1), out = [], stack = []
  for (let k = 0; k < NN; k++) {
    if (!on[k] || lab[k] >= 0) continue
    const cells = []
    lab[k] = out.length; stack.push(k)
    while (stack.length) {
      const c = stack.pop(); cells.push(c)
      const i = c % N
      for (const q of [i > 0 ? c - 1 : -1, i < N - 1 ? c + 1 : -1, c - N, c + N]) {
        if (q < 0 || q >= NN || !on[q] || lab[q] >= 0) continue
        lab[q] = out.length; stack.push(q)
      }
    }
    out.push({ cells })
  }
  return { lab, comps: out }
}
