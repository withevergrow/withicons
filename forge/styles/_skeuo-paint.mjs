// SKEUO painter — lights the pieces from _skeuo-core.mjs as real objects.
//
// One light, up and a little to the left, for every icon. Each piece is painted
// as a stack of tonal layers cut from its own signed distance field:
//   base       the material colour, with a soft darker edge (stroke)
//   shade      crescents that roll toward the far (bottom-right) edge: deeper
//              ones are fainter, so together they read as a curved surface
//   bands      metal reflections; spec / hot: gloss highlights; rim: the lit edge
//   detail     brushed lines, wood grain, leather stitching (by finish)
// Cast and contact shadows are the pieces themselves, offset away from the light.
// Every paint is a role variable (--with-skeuo-<role>) with a literal fallback.
import * as F from './_skeuo-field.mjs'
import { simplify } from '../kernel/geom.mjs'
import { FINISH } from './_skeuo-mat.mjs'

export const L = { x: 0.34, y: 0.94 }  // direction AWAY from the light (unit-ish): shadows fall this way

const SHADOW = '#15110D', SHINE = '#FFFFFF'
export const v = (role, hex) => `var(--with-skeuo-${role}, ${hex})`

// -------------------------------------------------------------------------------
// compact path data (absolute M, relative l/h/v)
const num = (x, dp) => {
  let s = (x / 10 ** dp).toFixed(dp)
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '')
  if (s === '-0') s = '0'
  return s.replace(/^(-?)0\./, '$1.')
}
const join = arr => arr.reduce((acc, s) => acc + (acc && !s.startsWith('-') && !/[a-z]$/i.test(acc) ? ' ' : '') + s, '')
export function loopsD(loops, dp = 2, closed = true) {
  const k = 10 ** dp
  let d = ''
  for (const ring of loops) {
    const P = ring.map(p => [Math.round(p[0] * k), Math.round(p[1] * k)])
    const Q = P.filter((p, i) => i === 0 || p[0] !== P[i - 1][0] || p[1] !== P[i - 1][1])
    if (closed && Q.length > 1 && Q[0][0] === Q.at(-1)[0] && Q[0][1] === Q.at(-1)[1]) Q.pop()
    if (Q.length < (closed ? 3 : 2)) continue
    let s = 'M' + join([num(Q[0][0], dp), num(Q[0][1], dp)])
    let last = 'M'
    for (let i = 1; i < Q.length; i++) {
      const dx = Q[i][0] - Q[i - 1][0], dy = Q[i][1] - Q[i - 1][1]
      let cmd, nums
      if (dy === 0) { cmd = 'h'; nums = [num(dx, dp)] }
      else if (dx === 0) { cmd = 'v'; nums = [num(dy, dp)] }
      else { cmd = 'l'; nums = [num(dx, dp), num(dy, dp)] }
      if (cmd === last) s += (nums[0].startsWith('-') ? '' : ' ') + join(nums)
      else s += cmd + join(nums)
      last = cmd
    }
    d += s + (closed ? 'z' : '')
  }
  return d
}

// -------------------------------------------------------------------------------
const C = F.copy
const has = G => G && F.any(G)
const away = (G, k) => F.move(G, -k * L.x, -k * L.y)   // G pulled toward the light
const toward = (G, k) => F.move(G, k * L.x, k * L.y)   // G pushed away from the light
// the band of P within k of its far edge / its lit edge
export const farBand = (P, k) => F.subtract(C(P), away(P, k))
export const litBand = (P, k) => F.subtract(C(P), toward(P, k))
const erode = (P, r) => F.offset(C(P), r)
const disc = (cx, cy, r) => { const G = F.field(1); return F.strokes([{ pts: [[cx, cy]] }], 2 * r, 1, G) }

// Out.cls: the motion part every node painted next belongs to (forge/MOTION.md, Parts
// choreography): wm-shadow | wm-k | wm-a | wm-s, or null (untagged = wm-k). A highlight
// painted with { shine: true } on the body (wm-k or untagged) is wm-shine instead.
export class Out {
  constructor(opts = {}) { this.nodes = []; this.opts = opts; this.cls = null }
  fill(G, fill, op = 1, { dp = 1, tol = 0.05, min = 0.06, extra = {}, shine = false } = {}) {
    if (!has(G)) return null
    const d = loopsD(F.trace(G, tol, min), dp)
    if (!d) return null
    const a = { d, fill }
    if (op < 1) a['fill-opacity'] = op
    Object.assign(a, extra)
    const c = shine && (!this.cls || this.cls === 'wm-k') ? 'wm-shine' : this.cls
    if (c) a.class = c
    this.nodes.push(['path', a])
    return a
  }
  line(loops, attrs, dp = 1, closed = true) {
    const d = loopsD(loops, dp, closed)
    if (d) this.nodes.push(['path', this.cls ? { d, fill: 'none', ...attrs, class: this.cls } : { d, fill: 'none', ...attrs }])
  }
}

// edge: a crisp outline drawn on the base path
export const EDGE = { w: 0.36, op: 0.42 }
const edgeAttrs = () => ({ stroke: v('edge', 'currentColor'), 'stroke-width': EDGE.w, 'stroke-opacity': EDGE.op, 'stroke-linejoin': 'round' })
// relative luminance of a material's base colour
export const lumOf = hex => {
  const n = parseInt(String(hex).slice(1), 16)
  const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
  return 0.2126 * f(n >> 16 & 255) + 0.7152 * f(n >> 8 & 255) + 0.0722 * f(n & 255)
}
// Pale materials (paper, porcelain, cloud) would melt into a white page and dark ones
// (graphite, navy, black plastic) into a black one, so each gets a defining edge all
// the way round: a printed-shadow outline on pale stock, a cool lit rim on dark stock
// (the way a dark object catches the room light along its silhouette). The lit rim
// lies wholly outside the piece, so on a white page it vanishes and costs the
// piece none of its own ink.
export const RIM = { pale: 0.62, dark: 0.13 }
const rimAttrs = (mat, thin) => {
  const L = lumOf(mat.c)
  if (L >= RIM.pale) return { stroke: v('shadow', SHADOW), 'stroke-width': thin ? 0.62 : 0.8, 'stroke-opacity': 0.46, 'stroke-linejoin': 'round' }
  return null
}

// one piece, fully lit
export function piece(out, P, role, mat, opt = {}) {
  if (!has(P)) return
  const fin = FINISH[mat.f] || FINISH.satin
  const shadow = v('shadow', SHADOW), shine = v('shine', SHINE)
  const b = F.box(P)
  const w = b.x1 - b.x0, h = b.y1 - b.y0, sz = Math.min(w, h)
  const thin = opt.thin != null ? opt.thin : sz < 3.2
  // dark stock: a lit rim just outside the silhouette
  if (!opt.noEdge && lumOf(mat.c) <= RIM.dark) {
    const k = thin ? 0.36 : 0.44
    out.fill(F.subtract(F.offset(C(P), -k), P), v('shine', SHINE), 0.5, { tol: 0.04, min: 0.03 })
  }
  // base + edge
  out.fill(P, v(role, mat.c), 1, { dp: 2, tol: 0.035, min: 0.05, extra: opt.noEdge ? {} : (rimAttrs(mat, thin) || edgeAttrs()) })
  // metal bands (diagonal, like a reflected horizon)
  if (fin.bands && !thin) {
    // each reflection is feathered: a faint wide band under a brighter core, so the
    // horizon reads as a soft polished sweep rather than a hard stripe
    const bk = mat.band ?? 1
    for (const [f0, f1, kind, op] of fin.bands) {
      const mid = (f0 + f1) / 2, half = (f1 - f0) / 2
      for (const [grow, part] of [[1.35, 0.4], [0.6, 0.6]]) {
        const G = C(P)
        const y0 = b.y0 + (mid - half * grow) * h, y1 = b.y0 + (mid + half * grow) * h, s = 0.28
        F.halfPlane(G, s, -1, s * b.x0 - y0)   // below the line y = y0 + s (x - x0)
        F.halfPlane(G, -s, 1, y1 - s * b.x0)   // above y = y1 + s (x - x0)
        out.fill(G, kind === 'shine' ? shine : shadow, +(op * part * bk).toFixed(2))
      }
    }
  }
  // far-edge shading, deepest first
  const shade = (opt.shade || fin.shade).filter(([k]) => k < (thin ? 1.2 : sz < 7 ? 2 : 9))
  for (const [k, op] of shade) out.fill(farBand(P, k), shadow, op, { tol: k > 1 ? 0.08 : 0.05 })
  // gloss: an inset highlight over the upper part of the piece
  if (fin.spec && !opt.noSpec) {
    const { inset, top, op } = fin.spec
    const G = erode(P, thin ? Math.min(inset, 0.5) : inset)
    F.halfPlane(G, 0.18, 1, b.y0 + top * h + 0.18 * (b.x0 + w / 2))
    out.fill(G, shine, +(op * (opt.specK ?? 1)).toFixed(3), { shine: true })
  }
  // glint: a crisp curved reflection just inside the lit edge (glossy finishes)
  if (fin.hot && !thin && sz >= 4.5 && !opt.noHot) {
    const inner = erode(P, Math.min(0.85, sz * 0.09))
    const G = litBand(inner, 0.42)
    // only the upper-left stretch of it
    F.halfPlane(G, 1, 1, b.x0 + b.y0 + (w + h) * 0.42)
    F.halfPlane(G, 0, 1, b.y0 + h * 0.55)
    out.fill(G, shine, fin.hot, { min: 0.12, shine: true })
  }
  // rim light on the near edge
  if (fin.hi) out.fill(litBand(P, thin ? fin.hi[0] * 0.8 : fin.hi[0]), shine, fin.hi[1])
  // surface detail
  if (fin.stitch && !thin && F.inkArea(P) > 26 && !opt.noStitch) {
    const inner = erode(P, 1.05)
    if (F.inkArea(inner) > 8) {
      const loops = F.trace(inner, 0.04, 2).map(l => simplify(l, 0.04, true))
      out.line(loops, { stroke: v('accent', mat.acc || '#F1CF98'), 'stroke-width': 0.38, 'stroke-dasharray': '.85 .6', 'stroke-linecap': 'round', 'stroke-opacity': 0.9 })
    }
  }
  if (fin.grain && !thin && F.inkArea(P) > 14 && !opt.noGrain) {
    const inner = erode(P, 0.75)
    const runs = []
    for (let y = b.y0 + 1.4, i = 0; y < b.y1 - 0.8; y += 1.75, i++) {
      let run = []
      for (let x = b.x0; x <= b.x1 + 0.2; x += 0.3) {
        const yy = y + 0.35 * Math.sin(x * 0.55 + i * 1.7) + 0.15 * Math.sin(x * 1.7 + i)
        const inside = valueAt(inner, x, yy) < 0
        if (inside) run.push([x, yy])
        else { if (run.length > 4) runs.push(run); run = [] }
      }
      if (run.length > 4) runs.push(run)
    }
    if (runs.length) out.line(runs.map(r => simplify(r, 0.05)), { stroke: v('ink', mat.ink), 'stroke-width': 0.3, 'stroke-opacity': 0.32, 'stroke-linecap': 'round' }, 1, false)
  }
  if (fin.brushed && !thin && F.inkArea(P) > 30 && !opt.noBrush) {
    // a few fine brushed lines just under the bright band
    const inner = erode(P, 0.7)
    const runs = []
    for (const f of [0.44, 0.5]) {
      const y0 = b.y0 + f * h
      let run = []
      for (let x = b.x0; x <= b.x1 + 0.2; x += 0.3) {
        const yy = y0 + 0.28 * (x - b.x0)
        if (valueAt(inner, x, yy) < 0) run.push([x, yy])
        else { if (run.length > 3) runs.push(run); run = [] }
      }
      if (run.length > 3) runs.push(run)
    }
    if (runs.length) out.line(runs.map(r => [r[0], r.at(-1)]), { stroke: v('shine', SHINE), 'stroke-width': 0.22, 'stroke-opacity': +(0.55 * (mat.band ?? 1)).toFixed(2), 'stroke-linecap': 'round' }, 1, false)
  }
}

export function valueAt(G, x, y) {
  const i = Math.round(x / F.H), j = Math.round(y / F.H)
  return (i < 0 || j < 0 || i >= F.N || j >= F.N) ? 1 : G[j * F.N + i]
}

// a soft cast shadow (two offset, slightly grown copies)
export function castShadow(out, S, under, strength = 1) {
  if (!has(S)) return
  const shadow = v('shadow', SHADOW)
  // the shadow lies whole beneath the object (only its outer edge costs bytes)
  const solid = F.fillHoles(C(S), 6)
  out.fill(F.offset(F.move(solid, 0.3, 0.95), -0.35), shadow, 0.1 * strength, { tol: 0.1 })
  out.fill(F.offset(F.move(solid, 0.15, 0.5), -0.1), shadow, 0.16 * strength, { tol: 0.08 })
}

// a contact shadow that piece S throws onto surface U
export function contact(out, S, U, k = 0.6, op = 0.3) {
  if (!has(S) || !has(U)) return
  const G = F.offset(F.move(S, k * L.x, k * L.y), -0.1)
  F.intersect(G, F.offset(C(U), 0.02))
  F.subtract(G, S)
  out.fill(G, v('shadow', SHADOW), op)
}
