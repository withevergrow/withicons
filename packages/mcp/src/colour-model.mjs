// How much of one rendered icon each colour role paints: a tiny rasterizer for the SVG the renderers emit (paths, linear /
// radial gradients with userSpaceOnUse stops, fills, strokes, opacities, translate / rotate). Pure and dependency-free:
// lib.mjs uses it per icon (mainRole, the brand theme, honest "exact colour" answers) and forge/lib/emit-mcp.mjs runs it
// at bundle time for the per-style role table (list_styles).
//
// Model: the 24 x 24 view box is sampled on a GRID x GRID raster. Every cell keeps, per role, how much of its final
// colour comes from that role (alpha compositing, paint order). Recolouring a role changes a cell by exactly that share,
// so the sum over the cells is the area the role visibly paints: what a render with that role set to black, then white,
// would show changed (the test checks the model against resvg). Gradients split a cell between the two stops around it.
import { rolesFor, ROLES } from '../../../forge/lib/palette-map.mjs'

const GRID = 64
const CELL = 24 / GRID
const SUB = 2                     // fills: SUB x SUB samples per cell
const KEYS = [...ROLES, 'other']  // 'other': literal colours (no role)
const K = Object.fromEntries(KEYS.map((k, i) => [k, i]))
const PURE = 0.97                 // a cell this much one role shows that role's colour unmixed

const num = v => (v == null || v === '' ? null : Number(v))
const attrs = s => { const a = {}; for (const m of String(s).matchAll(/([\w:-]+)="([^"]*)"/g)) a[m[1]] = m[2]; return a }

// ---- path data -> polylines (curves flattened) ----
function pathPolys(d) {
  const polys = []
  let poly = null, x = 0, y = 0, sx = 0, sy = 0, cx = 0, cy = 0, prev = ''
  const toks = String(d).match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) || []
  let i = 0, cmd = ''
  const n = () => Number(toks[i++])
  const line = (nx, ny) => { poly.push([nx, ny]); x = nx; y = ny }
  const cubic = (x1, y1, x2, y2, ex, ey) => {
    const x0 = x, y0 = y
    for (let t = 1; t <= 10; t++) { const s = t / 10, u = 1 - s; poly.push([u * u * u * x0 + 3 * u * u * s * x1 + 3 * u * s * s * x2 + s * s * s * ex, u * u * u * y0 + 3 * u * u * s * y1 + 3 * u * s * s * y2 + s * s * s * ey]) }
    x = ex; y = ey
  }
  const quad = (x1, y1, ex, ey) => { const x0 = x, y0 = y; for (let t = 1; t <= 8; t++) { const s = t / 8, u = 1 - s; poly.push([u * u * x0 + 2 * u * s * x1 + s * s * ex, u * u * y0 + 2 * u * s * y1 + s * s * ey]) } x = ex; y = ey }
  const arc = (rx, ry, rot, large, sweep, ex, ey) => {
    rx = Math.abs(rx); ry = Math.abs(ry)
    if (!rx || !ry || (ex === x && ey === y)) return line(ex, ey)
    const ph = rot * Math.PI / 180, cs = Math.cos(ph), sn = Math.sin(ph)
    const dx = (x - ex) / 2, dy = (y - ey) / 2, x1 = cs * dx + sn * dy, y1 = -sn * dx + cs * dy
    const l = x1 * x1 / (rx * rx) + y1 * y1 / (ry * ry)
    if (l > 1) { rx *= Math.sqrt(l); ry *= Math.sqrt(l) }
    const a = rx * rx * ry * ry - rx * rx * y1 * y1 - ry * ry * x1 * x1, b = rx * rx * y1 * y1 + ry * ry * x1 * x1
    const k = (large === sweep ? -1 : 1) * Math.sqrt(Math.max(0, a / b))
    const ccx = k * rx * y1 / ry, ccy = -k * ry * x1 / rx
    const mx = cs * ccx - sn * ccy + (x + ex) / 2, my = sn * ccx + cs * ccy + (y + ey) / 2
    const ang = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy)
    const t1 = ang(1, 0, (x1 - ccx) / rx, (y1 - ccy) / ry)
    let dt = ang((x1 - ccx) / rx, (y1 - ccy) / ry, (-x1 - ccx) / rx, (-y1 - ccy) / ry)
    if (!sweep && dt > 0) dt -= 2 * Math.PI
    if (sweep && dt < 0) dt += 2 * Math.PI
    const m = Math.max(4, Math.ceil(Math.abs(dt) / (Math.PI / 10)))
    for (let j = 1; j <= m; j++) { const t = t1 + dt * j / m; poly.push([mx + rx * Math.cos(t) * cs - ry * Math.sin(t) * sn, my + rx * Math.cos(t) * sn + ry * Math.sin(t) * cs]) }
    x = ex; y = ey
  }
  while (i < toks.length) {
    if (/[a-zA-Z]/.test(toks[i])) cmd = toks[i++]
    const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase(), ox = rel ? x : 0, oy = rel ? y : 0
    if (C === 'Z') { if (poly) { poly.closed = true; x = sx; y = sy } prev = 'Z'; poly = null; continue }
    if (C === 'M') { const nx = n() + ox, ny = n() + oy; poly = [[nx, ny]]; polys.push(poly); x = sx = nx; y = sy = ny; cmd = rel ? 'l' : 'L'; prev = 'M'; continue }
    if (!poly) { poly = [[x, y]]; polys.push(poly) }
    if (C === 'L') line(n() + ox, n() + oy)
    else if (C === 'H') line(n() + ox, y)
    else if (C === 'V') line(x, n() + oy)
    else if (C === 'C') { const a = [n() + ox, n() + oy, n() + ox, n() + oy, n() + ox, n() + oy]; cubic(...a); cx = a[2]; cy = a[3] }
    else if (C === 'S') { const rx1 = /[CS]/.test(prev) ? 2 * x - cx : x, ry1 = /[CS]/.test(prev) ? 2 * y - cy : y; const a = [n() + ox, n() + oy, n() + ox, n() + oy]; cubic(rx1, ry1, ...a); cx = a[0]; cy = a[1] }
    else if (C === 'Q') { const a = [n() + ox, n() + oy, n() + ox, n() + oy]; quad(...a); cx = a[0]; cy = a[1] }
    else if (C === 'T') { const qx = /[QT]/.test(prev) ? 2 * x - cx : x, qy = /[QT]/.test(prev) ? 2 * y - cy : y; quad(qx, qy, n() + ox, n() + oy); cx = qx; cy = qy }
    else if (C === 'A') arc(n(), n(), n(), n(), n(), n() + ox, n() + oy)
    else { i++; continue }
    prev = C
  }
  return polys
}

// ---- transforms (the renderers use translate and rotate only) ----
function parseTransform(t) {
  let m = [1, 0, 0, 1, 0, 0]
  const mul = (a, b) => [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]]
  for (const f of String(t || '').matchAll(/(\w+)\s*\(([^)]*)\)/g)) {
    const v = f[2].trim().split(/[\s,]+/).map(Number)
    if (f[1] === 'translate') m = mul(m, [1, 0, 0, 1, v[0] || 0, v[1] || 0])
    else if (f[1] === 'scale') m = mul(m, [v[0], 0, 0, v[1] == null ? v[0] : v[1], 0, 0])
    else if (f[1] === 'rotate') {
      const a = (v[0] || 0) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), px = v[1] || 0, py = v[2] || 0
      m = mul(m, [1, 0, 0, 1, px, py]); m = mul(m, [c, s, -s, c, 0, 0]); m = mul(m, [1, 0, 0, 1, -px, -py])
    } else if (f[1] === 'matrix' && v.length === 6) m = mul(m, v)
  }
  return m
}
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]
function invert(m) {
  const det = m[0] * m[3] - m[1] * m[2]
  return [m[3] / det, -m[1] / det, -m[2] / det, m[0] / det, (m[2] * m[5] - m[3] * m[4]) / det, (m[1] * m[4] - m[0] * m[5]) / det]
}

// ---- coverage ----
// fill: SUB x SUB centre samples per cell (nonzero or evenodd), as a share of the cell
function fillCoverage(polys, evenodd) {
  const cov = new Float32Array(GRID * GRID), R = GRID * SUB, step = 24 / R, w = 1 / (SUB * SUB)
  const edges = []
  for (const p of polys) for (let j = 0; j < p.length; j++) {
    const a = p[j], b = p[(j + 1) % p.length]
    if (a[1] !== b[1]) edges.push([a[0], a[1], b[0], b[1]])
  }
  for (let r = 0; r < R; r++) {
    const yy = (r + 0.5) * step, xs = []
    for (const [x1, y1, x2, y2] of edges) if ((y1 <= yy) !== (y2 <= yy)) xs.push([x1 + (yy - y1) / (y2 - y1) * (x2 - x1), y2 > y1 ? 1 : -1])
    if (!xs.length) continue
    xs.sort((a, b) => a[0] - b[0])
    let wind = 0, k = 0
    const row = Math.floor(r / SUB) * GRID
    for (let c = 0; c < R; c++) {
      const xx = (c + 0.5) * step
      while (k < xs.length && xs[k][0] <= xx) { wind += evenodd ? 1 : xs[k][1]; k++ }
      if (evenodd ? wind % 2 : wind) cov[row + Math.floor(c / SUB)] += w
    }
  }
  return cov
}
// stroke: the share of each cell inside the band of half-width w/2 around the polyline (round joins and caps)
function strokeCoverage(polys, width) {
  const cov = new Float32Array(GRID * GRID), hw = width / 2
  const dist = new Float32Array(GRID * GRID).fill(Infinity)
  for (const p of polys) {
    const n = p.closed ? p.length : p.length - 1
    for (let j = 0; j < n; j++) {
      const [x1, y1] = p[j], [x2, y2] = p[(j + 1) % p.length]
      const pad = hw + CELL
      const c0 = Math.max(0, Math.floor((Math.min(x1, x2) - pad) / CELL)), c1 = Math.min(GRID - 1, Math.floor((Math.max(x1, x2) + pad) / CELL))
      const r0 = Math.max(0, Math.floor((Math.min(y1, y2) - pad) / CELL)), r1 = Math.min(GRID - 1, Math.floor((Math.max(y1, y2) + pad) / CELL))
      const dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy
      for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
        const px = (c + 0.5) * CELL, py = (r + 0.5) * CELL
        const t = L ? Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / L)) : 0
        const ex = x1 + t * dx - px, ey = y1 + t * dy - py, d = Math.sqrt(ex * ex + ey * ey)
        if (d < dist[r * GRID + c]) dist[r * GRID + c] = d
      }
    }
  }
  for (let i = 0; i < cov.length; i++) {
    const d = dist[i]
    if (d === Infinity) continue
    const v = (Math.min(d + CELL / 2, hw) - Math.max(d - CELL / 2, -hw)) / CELL
    if (v > 0) cov[i] = Math.min(1, v)
  }
  return cov
}

// ---- paint ----
// one paint value -> { kind: 'none' } | { kind: 'solid', key } | { kind: 'grad', g }
function resolvePaint(v, el, roles, grads) {
  if (v == null || v === 'none' || v === 'transparent') return { kind: 'none' }
  const s = String(v).trim()
  let m = /^url\(\s*#([\w-]+)\s*\)/.exec(s)
  if (m) return grads[m[1]] ? { kind: 'grad', g: grads[m[1]] } : { kind: 'none' }
  m = /^var\(\s*(--with-[\w-]+)/.exec(s)
  if (m) return { kind: 'solid', key: roles[m[1]] || (/currentColor\s*\)$/.test(s) && !(m[1] in roles) ? 'ink' : 'other') }
  if (/^currentColor$/i.test(s)) {
    // currentColor is the element's own `color` (blueprint paints its accent strokes this way), else the ink
    if (el && el.color && !/^currentColor$/i.test(el.color)) return resolvePaint(el.color, null, roles, grads)
    return { kind: 'solid', key: 'ink' }
  }
  return { kind: 'solid', key: 'other' }
}
function roleOfColor(s, roles) {
  const m = /var\(\s*(--with-[\w-]+)/.exec(String(s))
  if (m) return roles[m[1]] || 'other'
  return /currentColor/i.test(String(s)) ? 'ink' : 'other'
}
function parseGradients(svg, roles) {
  const grads = {}
  for (const m of svg.matchAll(/<(linear|radial)Gradient\b([^>]*)>([\s\S]*?)<\/\1Gradient>/g)) {
    const a = attrs(m[2])
    const stops = [...m[3].matchAll(/<stop\b([^>]*)\/?>/g)].map(s => {
      const b = attrs(s[1])
      const off = String(b.offset || '0')
      return { offset: /%$/.test(off) ? parseFloat(off) / 100 : Number(off), key: roleOfColor(b['stop-color'] || '#000', roles), op: b['stop-opacity'] != null ? Number(b['stop-opacity']) : 1 }
    })
    for (let i = 1; i < stops.length; i++) if (stops[i].offset < stops[i - 1].offset) stops[i].offset = stops[i - 1].offset
    if (!stops.length) continue
    const units = a.gradientUnits === 'userSpaceOnUse' ? 'user' : 'bbox'   // the SVG default is objectBoundingBox
    grads[a.id] = { units, ...(m[1] === 'linear'
      ? { type: 'linear', x1: num(a.x1) ?? 0, y1: num(a.y1) ?? 0, x2: num(a.x2) ?? 1, y2: num(a.y2) ?? 0, stops }
      : { type: 'radial', cx: num(a.cx) ?? 0.5, cy: num(a.cy) ?? 0.5, r: num(a.r) ?? 0.5, fx: num(a.fx) ?? num(a.cx) ?? 0.5, fy: num(a.fy) ?? num(a.cy) ?? 0.5, stops }) }
  }
  return grads
}
// gradient parameter t at a point (pad spread)
function gradT(g, x, y) {
  if (g.type === 'linear') {
    const dx = g.x2 - g.x1, dy = g.y2 - g.y1, L = dx * dx + dy * dy
    return L ? ((x - g.x1) * dx + (y - g.y1) * dy) / L : 0
  }
  if (g.fx === g.cx && g.fy === g.cy) return Math.hypot(x - g.cx, y - g.cy) / g.r
  // focal radial gradient: the circle through the point, centred on f + t (c - f) with radius t r
  const dx = x - g.fx, dy = y - g.fy, ex = g.cx - g.fx, ey = g.cy - g.fy
  const a = ex * ex + ey * ey - g.r * g.r, b = -2 * (dx * ex + dy * ey), c = dx * dx + dy * dy
  if (Math.abs(a) < 1e-9) return b ? -c / b : 0
  const disc = Math.max(0, b * b - 4 * a * c)
  return Math.max((-b - Math.sqrt(disc)) / (2 * a), (-b + Math.sqrt(disc)) / (2 * a))
}
// the two stops around t -> [keyA, weightA, keyB, weightB, opacity]
function gradAt(g, t) {
  const s = g.stops
  t = Math.max(0, Math.min(1, t))
  if (t <= s[0].offset || s.length === 1) return [s[0].key, 1, s[0].key, 0, s[0].op]
  const last = s[s.length - 1]
  if (t >= last.offset) return [last.key, 1, last.key, 0, last.op]
  let i = 0
  while (i < s.length - 2 && t > s[i + 1].offset) i++
  const a = s[i], b = s[i + 1], span = b.offset - a.offset, u = span > 0 ? (t - a.offset) / span : 1
  return [a.key, 1 - u, b.key, u, a.op * (1 - u) + b.op * u]
}

/**
 * Paint model of one rendered icon (SVG markup as the renderers emit it). Returns
 *   { area: { role: share of the 24x24 box it visibly paints }, pure: { role: share it paints unmixed }, drawn: share painted at all }
 * keyed by palette role (ink, c1-c4, tint, accent, shadow, shine, edge; 'other' for literal colours).
 */
export function paintModel(svg) {
  svg = String(svg)
  const roles = rolesFor(svg)
  const grads = parseGradients(svg, roles)
  const root = attrs((/^<svg\b([^>]*)>/.exec(svg) || [])[1] || '')
  const C = KEYS.map(() => new Float32Array(GRID * GRID))
  const layer = (cov, paint, alpha, inv, box) => {
    if (paint.kind === 'none' || !(alpha > 0)) return
    if (paint.kind === 'solid') {
      const k = K[paint.key] ?? K.other
      for (let c = 0; c < cov.length; c++) {
        const e = cov[c] * alpha
        if (!e) continue
        for (let r = 0; r < KEYS.length; r++) C[r][c] *= 1 - e
        C[k][c] += e
      }
      return
    }
    const g = paint.g
    for (let c = 0; c < cov.length; c++) {
      if (!cov[c]) continue
      let px = (c % GRID + 0.5) * CELL, py = (Math.floor(c / GRID) + 0.5) * CELL
      if (inv) [px, py] = apply(inv, [px, py])
      if (g.units === 'bbox' && box) { px = (px - box[0]) / (box[2] || 1); py = (py - box[1]) / (box[3] || 1) }
      const [ka, wa, kb, wb, op] = gradAt(g, gradT(g, px, py))
      const e = cov[c] * alpha * op
      if (!e) continue
      for (let r = 0; r < KEYS.length; r++) C[r][c] *= 1 - e
      C[K[ka] ?? K.other][c] += e * wa
      C[K[kb] ?? K.other][c] += e * wb
    }
  }
  for (const m of svg.matchAll(/<path\b([^>]*?)\/?>/g)) {
    const a = attrs(m[1])
    if (!a.d) continue
    const op = a.opacity != null ? Number(a.opacity) : 1
    const tf = a.transform ? parseTransform(a.transform) : null
    let polys = pathPolys(a.d)
    // the path's own bounding box (before its transform): objectBoundingBox gradients are laid out on it
    let box = null
    if (polys.length) {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
      for (const p of polys) for (const [x, y] of p) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y }
      box = [x0, y0, x1 - x0, y1 - y0]
    }
    if (tf) polys = polys.map(p => Object.assign(p.map(pt => apply(tf, pt)), { closed: p.closed }))
    const inv = tf ? invert(tf) : null
    const fill = resolvePaint(a.fill ?? root.fill ?? '#000', a, roles, grads)
    if (fill.kind !== 'none') {
      const fo = a['fill-opacity'] != null ? Number(a['fill-opacity']) : 1
      layer(fillCoverage(polys.filter(p => p.length > 2), (a['fill-rule'] || root['fill-rule']) === 'evenodd'), fill, fo * op, inv, box)
    }
    const stroke = resolvePaint(a.stroke ?? root.stroke, a, roles, grads)
    if (stroke.kind !== 'none') {
      const sw = Number(a['stroke-width'] ?? root['stroke-width'] ?? 1)
      let so = (a['stroke-opacity'] != null ? Number(a['stroke-opacity']) : 1) * op
      // dashes: the inked share of the dash pattern (round caps add a cap's length to each dash)
      const dash = String(a['stroke-dasharray'] || '').trim().split(/[\s,]+/).filter(Boolean).map(Number)
      if (dash.length >= 2 && dash.every(x => x >= 0)) {
        const on = dash.filter((x, i) => i % 2 === 0).reduce((p, q) => p + q, 0), off = dash.filter((x, i) => i % 2 === 1).reduce((p, q) => p + q, 0)
        const cap = /round|square/.test(a['stroke-linecap'] || root['stroke-linecap'] || '') ? sw * Math.ceil(dash.length / 2) : 0
        so *= Math.min(1, (on + cap) / Math.max(1e-6, on + off))
      }
      if (sw > 0) layer(strokeCoverage(polys, sw), stroke, so, inv, box)
    }
  }
  const area = {}, pure = {}
  let drawn = 0
  const N = GRID * GRID
  for (let r = 0; r < KEYS.length; r++) {
    let s = 0, p = 0
    for (let c = 0; c < N; c++) { const v = C[r][c]; s += v; if (v >= PURE) p++ }
    if (s > 1e-4 * N) { area[KEYS[r]] = s / N; pure[KEYS[r]] = p / N }
    drawn += s
  }
  return { area, pure, drawn: drawn / N, roles }
}

// ---------------------------------------------------------------- colour math (brand themes)
const HEXRE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i
export function parseHex(v) {
  const m = HEXRE.exec(String(v || '').trim())
  if (!m) return null
  const h = m[1].length === 3 ? m[1].split('').map(c => c + c).join('') : m[1]
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16))
}
export const toHex = rgb => '#' + rgb.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')
export function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2
  if (mx === mn) return [0, 0, l]
  const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn)
  const h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4
  return [h * 60, s, l]
}
export function hslToRgb([h, s, l]) {
  if (!s) return [l * 255, l * 255, l * 255]
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q
  const f = t => { t = ((t % 1) + 1) % 1; return 255 * (t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p) }
  return [f(h / 360 + 1 / 3), f(h / 360), f(h / 360 - 1 / 3)]
}
/**
 * A style default recoloured into a brand colour's hue: the default keeps its lightness (a pale tint stays pale, a deep
 * shadow stays deep) and takes the brand hue and saturation. Neutral defaults (white, greys) and non-hex values stay.
 */
export function shiftToHue(def, brand) {
  const d = parseHex(def), b = parseHex(brand)
  if (!d || !b) return null
  const [, ds, dl] = rgbToHsl(d), [bh, bs] = rgbToHsl(b)
  if (ds < 0.12 || dl > 0.97) return null
  return toHex(hslToRgb([bh, Math.min(1, bs), dl]))
}

// ---------------------------------------------------------------- roles of one icon
// The hue roles colour the icon's parts (c1 = the first part, c2-c4 more parts, accent small pops); tint, shadow, shine
// and edge are lighter / darker companions (a pale pane, a drop shadow, highlights, a die-cut border); ink outlines.
export const HUE_ROLES = ['c1', 'c2', 'c3', 'c4', 'accent']
export const SHADE_ROLES = ['tint', 'shadow', 'edge', 'shine']
const VISIBLE = 0.002   // a role painting less than 0.2% of the box is not a visible part
const DEF_RE = /var\(\s*(--with-[\w-]+)\s*,\s*([^()]*?)\s*\)/g
/** { '--with-x': default } for every variable in the markup (first default wins) */
export function varDefaults(svg) {
  const out = {}
  for (const m of String(svg).matchAll(DEF_RE)) if (!(m[1] in out)) out[m[1]] = m[2]
  return out
}
/** hue roles this markup paints, the largest visible part first (ties: c1 before c2 ...) */
export function rankParts(model, roles) {
  const painted = new Set(Object.values(roles))
  return HUE_ROLES.filter(r => painted.has(r)).sort((p, q) => ((model.area[q] || 0) - (model.area[p] || 0)) || HUE_ROLES.indexOf(p) - HUE_ROLES.indexOf(q))
}
/**
 * The main colour role of one icon in one style: the hue role (c1-c4, accent) that paints the largest visible area; when
 * none shows, the largest of tint / shadow / edge / shine; else the ink. { role, share (of the drawn area) | null }
 */
export function mainRoleOf(model) {
  const pick = list => list.filter(r => (model.area[r] || 0) > VISIBLE).sort((p, q) => ((model.area[q] || 0) - (model.area[p] || 0)) || list.indexOf(p) - list.indexOf(q))[0]
  const role = pick(HUE_ROLES) || pick(SHADE_ROLES) || 'ink'
  const a = model.area[role] || 0
  return { role, share: model.drawn && a ? Math.round(a / model.drawn * 100) / 100 : null }
}
/** share of each role in the drawn area, largest first (rounded; roles under 0.5% left out) */
export function roleShares(model) {
  return Object.fromEntries(Object.entries(model.area).filter(([k, v]) => k !== 'other' && v / (model.drawn || 1) >= 0.005)
    .sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, Math.round(v / model.drawn * 100) / 100]))
}
/** how each role is painted in this markup: { role: { solid, tone, gradient, fill, stroke (counts), opacity (the most opaque solid / tone use) } } */
export function paintsOf(svg) {
  const roles = rolesFor(svg), out = {}
  for (const m of String(svg).matchAll(/<(path|stop)\b([^>]*?)\/?>/g)) {
    const a = attrs(m[2])
    for (const at of ['fill', 'stroke', 'stop-color', 'color']) {
      const v = /var\(\s*(--with-[\w-]+)/.exec(a[at] || '')
      const role = v && roles[v[1]]
      if (!role) continue
      const op = Number(at === 'fill' ? a['fill-opacity'] ?? 1 : at === 'stop-color' ? a['stop-opacity'] ?? 1 : a['stroke-opacity'] ?? 1) * Number(a.opacity ?? 1)
      const kind = at === 'stop-color' ? 'gradient' : op < 0.95 ? 'tone' : 'solid'
      const e = out[role] || (out[role] = { solid: 0, tone: 0, gradient: 0, opacity: 0, fill: 0, stroke: 0 })
      e[kind]++
      if (at === 'fill') e.fill++; else if (at !== 'stop-color') e.stroke++
      if (kind !== 'gradient') e.opacity = Math.max(e.opacity, op)
    }
  }
  return out
}

// ---------------------------------------------------------------- brand themes
/**
 * One brand colour set onto ONE icon in ONE style, through that icon's own roles:
 *   theme: { primary, secondary?, tertiary?, ink? } (hex)
 *   - one-colour styles (no colour variables): the icon is drawn in primary (the ink)
 *   - primary / secondary / tertiary go onto the icon's hue parts (c1-c4, accent) by visible area, largest first, so
 *     primary always lands on the main part whichever role carries it in this icon and style
 *   - further hue parts keep their default lightness in the primary's hue (secondary's, tertiary's in turn)
 *   - tint, shadow, edge: their default lightness in the primary's hue (neutral defaults, like a white border, stay);
 *     shine stays (highlights); o.shades replaces these (a borrowed palette's own tint / shadow / shine / edge)
 *   - ink: theme.ink; else primary where the ink is the drawing (one-colour styles, o.inkDraws: duo, blueprint); else a
 *     coloured ink variable takes the primary's hue at its own lightness and a currentColor ink is left alone (outlines
 *     and faces stay dark, the same on every icon of a set); inkLeads flags an icon drawn mostly in that ink
 * -> { colors: { role | --with-var: hex }, parts: { primary, secondary?, tertiary? } (the role each one landed on),
 *      exactShare (how much of what primary paints shows it unmixed), exact (>= 0.6) }
 */
export function resolveTheme(svg, theme, { model, inkDraws = false, shades = null } = {}) {
  svg = String(svg)
  model = model || paintModel(svg)
  const roles = model.roles || rolesFor(svg), defs = varDefaults(svg)
  const colors = {}, parts = {}
  const exactOf = list => {
    let a = 0, p = 0
    for (const r of list) { a += model.area[r] || 0; p += model.pure[r] || 0 }
    return a ? Math.round(p / a * 100) / 100 : 0
  }
  if (!Object.keys(roles).length) {
    colors.ink = theme.primary
    parts.primary = 'ink'
    const exactShare = exactOf(['ink'])
    return { colors, parts, exactShare, exact: exactShare >= 0.6 }
  }
  const T = [theme.primary, theme.secondary, theme.tertiary].filter(Boolean)
  const ranked = rankParts(model, roles)
  const firstDefault = role => { for (const [v, r] of Object.entries(roles)) if (r === role && defs[v] != null) return defs[v]; return null }
  ranked.forEach((role, i) => {
    if (i < T.length) { colors[role] = T[i]; parts[['primary', 'secondary', 'tertiary'][i]] = role; return }
    const c = shiftToHue(firstDefault(role), T[(i - T.length) % T.length])
    if (c) colors[role] = c
  })
  const painted = new Set(Object.values(roles))
  for (const role of SHADE_ROLES) {
    if (!painted.has(role)) continue
    const c = shades && shades[role] ? shades[role] : role === 'shine' ? null : shiftToHue(firstDefault(role), theme.primary)
    if (c) colors[role] = c
  }
  const carry = ranked.length ? [ranked[0]] : []
  // the ink is decided per style, so a set keeps one outline colour; an icon whose ink paints over twice its colour
  // parts (kawaii's trending-up arrow) is flagged inkLeads: theme.ink (or color) colours most of it
  const partsArea = ranked.reduce((n, r) => n + (model.area[r] || 0), 0)
  const inkLeads = !inkDraws && !theme.ink && (model.area.ink || 0) > 2 * partsArea
  if (theme.ink) colors.ink = theme.ink
  else if (inkDraws) { colors.ink = theme.primary; carry.push('ink') }
  else for (const [v, r] of Object.entries(roles)) if (r === 'ink') { const c = shiftToHue(defs[v], theme.primary); if (c) colors[v] = c }
  if (!ranked.length) parts.primary = theme.ink || inkDraws ? 'ink' : null
  const exactShare = exactOf(carry)
  return { colors, parts, exactShare, exact: exactShare >= 0.6, ...(inkLeads ? { inkLeads: true } : {}) }
}

// ---------------------------------------------------------------- one style, all its icons (built at bundle time)
const r2 = v => Math.round(v * 100) / 100
/**
 * The colour roles of one style, read from every icon it renders: { icons, currentColor, roles: [{ role, vars, icons,
 * paints: 'solid' | 'tone' | 'gradient', as: 'fill' | 'stroke' | 'fill and stroke', opacity? }], exactShare, exact }.
 * exactShare: how much of what a theme's primary paints shows it unmixed, averaged over `sample` icons (resolveTheme).
 */
export function styleColourTable(svgs, { sample = [], inkDraws = false } = {}) {
  const stats = new Map()
  let icons = 0, current = 0
  for (const svg of Object.values(svgs)) {
    icons++
    if (/currentColor/.test(svg)) current++
    const roles = rolesFor(svg)
    const p = paintsOf(svg)
    const seen = new Set()
    for (const [v, role] of Object.entries(roles)) {
      const s = stats.get(role) || { vars: new Map(), icons: 0, solid: 0, tone: 0, gradient: 0, fill: 0, stroke: 0, ops: [] }
      stats.set(role, s)
      s.vars.set(v, (s.vars.get(v) || 0) + 1)
      if (seen.has(role)) continue
      seen.add(role)
      s.icons++
      const e = p[role]
      if (!e) continue
      // per icon: solid when any use is opaque, else a see-through tone, else gradient stops only
      const kind = e.solid ? 'solid' : e.tone ? 'tone' : 'gradient'
      s[kind]++
      if (e.fill) s.fill++
      if (e.stroke) s.stroke++
      if (kind === 'tone') s.ops.push(r2(e.opacity))
    }
  }
  const order = ['ink', ...HUE_ROLES, ...SHADE_ROLES]
  const roles = [...stats.entries()].sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0])).map(([role, s]) => {
    const paints = ['solid', 'tone', 'gradient'].sort((a, b) => s[b] - s[a])[0]
    const ops = s.ops.sort((a, b) => a - b), median = ops.length ? ops[Math.floor(ops.length / 2)] : null
    return { role, vars: [...s.vars.entries()].sort((a, b) => b[1] - a[1]).map(([v]) => v), icons: s.icons, paints,
      as: s.fill && s.stroke ? (s.fill >= 3 * s.stroke ? 'fill' : s.stroke >= 3 * s.fill ? 'stroke' : 'fill and stroke') : s.stroke ? 'stroke' : 'fill',
      ...(paints === 'tone' && median != null ? { opacity: median } : {}) }
  })
  let sum = 0, n = 0
  for (const name of sample) {
    if (!svgs[name]) continue
    sum += resolveTheme(svgs[name], { primary: '#000000' }, { inkDraws }).exactShare; n++
  }
  const exactShare = n ? r2(sum / n) : null
  return { icons, currentColor: current, roles, exactShare, exact: exactShare != null && exactShare >= 0.6 }
}
