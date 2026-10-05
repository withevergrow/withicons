// Node frames for animated exports (GIF, APNG, animated PowerPoint): the motion runtime's frozen frame SVG
// (@withicons/motion frameSvg: CSS keyframes held at time t with a negative, paused animation-delay) turned into a plain,
// static SVG that a renderer without CSS animation (resvg) draws exactly like a browser does.
//
// freezeSvg(svg, { bbox }) evaluates the <style> the way the browser's CSS engine would at that paused moment and writes
// the result back as SVG attributes:
//   selectors   .class, [attr], tag, *, :not(a, b, ...), descendant and child combinators (all the export CSS uses)
//   animation   name, duration, timing function, delay, iteration count (fill both, direction normal), per-keyframe
//               timing functions, per-property keyframe tracks (a property only interpolates between the stops that set it)
//   transform   translate[X|Y], scale[X|Y], rotate, rotateY (projected: scaleX = cos), none <-> list, calc(a + b);
//               transform-box view-box (the nearest <svg> viewBox) or fill-box (the element's own bounds, via opts.bbox),
//               transform-origin from the rule or the keyframe; the result replaces any transform attribute (as CSS does)
//   opacity, stroke-dasharray / stroke-dashoffset (pathLength="1" is resolved to real lengths: resvg ignores pathLength),
//   filter: drop-shadow halos (glow / twinkle parts) and blur() (swap effects) as SVG filters, clip-path: inset() (pass;
//               relative to the element's stroke box, as browsers do),
//   backface-visibility: hidden (flip swaps: the back face disappears past 90 degrees)
// Deterministic: same input, same output. No DOM, no dependencies beyond @withicons/motion's easing.
import { easeFn } from '../../motion/dist/parts.js'

const r4 = n => { const v = Math.round(n * 10000) / 10000; return String(Object.is(v, -0) ? 0 : v) }

/* ───────────── a small XML tree (enough for generated SVG) ───────────── */
function parseXml(src) {
  const root = { tag: '#root', attrs: [], children: [], parent: null }
  let cur = root
  const re = /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<!\[CDATA\[([\s\S]*?)\]\]>|<(\/?)([\w:.-]+)((?:\s+[\w:.-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>|([^<]+)/g
  let m
  while ((m = re.exec(src))) {
    if (m[6] != null) { cur.children.push({ text: m[6] }); continue }
    if (m[1] != null) { cur.children.push({ text: m[1], cdata: true }); continue }
    if (!m[3]) { if (/^<\?/.test(m[0])) root.decl = m[0]; continue }
    if (m[2]) { if (cur.parent) cur = cur.parent; continue }
    const attrs = []
    m[4].replace(/([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g, (_, k, a, b) => { attrs.push([k, a != null ? a : b]); return '' })
    const el = { tag: m[3], attrs, children: [], parent: cur }
    cur.children.push(el)
    if (!m[5]) cur = el
  }
  return root
}
const escA = v => String(v).replace(/&(?![a-zA-Z]+;|#\d+;|#x[0-9a-f]+;)/gi, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
function serialize(n) {
  if (n.text != null) return n.cdata ? `<![CDATA[${n.text}]]>` : n.text
  if (n.tag === '#root') return n.children.map(serialize).join('')
  const a = n.attrs.map(([k, v]) => ` ${k}="${escA(v)}"`).join('')
  return n.children.length ? `<${n.tag}${a}>${n.children.map(serialize).join('')}</${n.tag}>` : `<${n.tag}${a}/>`
}
const getA = (el, k) => { const a = el.attrs.find(x => x[0] === k); return a ? a[1] : null }
const setA = (el, k, v) => { const a = el.attrs.find(x => x[0] === k); if (a) a[1] = String(v); else el.attrs.push([k, String(v)]) }
const delA = (el, k) => { el.attrs = el.attrs.filter(x => x[0] !== k) }
const elements = n => n.children.filter(c => c.tag)
function walk(n, fn) { for (const c of elements(n)) { fn(c); walk(c, fn) } }

/* ───────────── CSS ───────────── */
// top-level blocks: [{ at: '@keyframes name' | '@media …' | null, head: selector text, body }]
function blocks(css) {
  const out = []
  let i = 0
  while (i < css.length) {
    const open = css.indexOf('{', i)
    if (open < 0) break
    const head = css.slice(i, open).trim()
    let depth = 1, j = open + 1
    while (j < css.length && depth) { if (css[j] === '{') depth++; else if (css[j] === '}') depth--; j++ }
    out.push({ head, body: css.slice(open + 1, j - 1) })
    i = j
  }
  return out
}
function decls(body) {
  const o = {}
  for (const part of body.split(/;(?![^(]*\))/)) {
    const k = part.indexOf(':')
    if (k < 0) continue
    o[part.slice(0, k).trim().toLowerCase()] = part.slice(k + 1).trim().replace(/\s*!important$/, '')
  }
  return o
}
function parseCss(css) {
  const keyframes = {}, rules = []
  let order = 0
  for (const b of blocks(css.replace(/\/\*[\s\S]*?\*\//g, ''))) {
    if (/^@keyframes\s/i.test(b.head)) {
      const name = b.head.replace(/^@keyframes\s+/i, '').trim(), stops = []
      for (const s of blocks(b.body)) {
        const props = decls(s.body)
        const ease = props['animation-timing-function'] || null
        delete props['animation-timing-function']
        for (const sel of s.head.split(',')) {
          const t = sel.trim().toLowerCase()
          const at = t === 'from' ? 0 : t === 'to' ? 100 : parseFloat(t)
          if (isFinite(at)) stops.push([at, props, ease])
        }
      }
      stops.sort((a, b) => a[0] - b[0])
      keyframes[name] = stops
    } else if (b.head[0] !== '@') {
      const d = decls(b.body)
      for (const sel of splitTop(b.head)) rules.push({ sel: parseSelector(sel.trim()), decls: d, order: order++ })
    }
    // other @-rules (@media prefers-reduced-motion, @supports) do not apply to a frozen frame
  }
  return { keyframes, rules }
}
// split on commas that are not inside parentheses
function splitTop(s) {
  const out = []
  let depth = 0, last = 0
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') depth++
    else if (s[i] === ')') depth--
    else if (s[i] === ',' && !depth) { out.push(s.slice(last, i)); last = i + 1 }
  }
  out.push(s.slice(last))
  return out
}
// selector -> [{ comb: ' ' | '>' | null, c: compound }] (left to right); compound = { tag, classes, attrs, nots }
function parseCompound(s) {
  const c = { tag: null, classes: [], attrs: [], nots: [] }
  let i = 0
  const ident = () => { const m = /^-?[\w-]+/.exec(s.slice(i)); i += m ? m[0].length : 1; return m ? m[0] : '' }
  while (i < s.length) {
    const ch = s[i]
    if (ch === '.') { i++; c.classes.push(ident()) }
    else if (ch === '[') { const j = s.indexOf(']', i); const inner = s.slice(i + 1, j); const m = /^([\w:-]+)(?:=["']?([^"']*)["']?)?$/.exec(inner.trim()); if (m) c.attrs.push([m[1], m[2] == null ? null : m[2]]); i = j + 1 }
    else if (ch === ':') {
      if (s.startsWith(':not(', i)) {
        let depth = 0, j = i + 4
        for (; j < s.length; j++) { if (s[j] === '(') depth++; else if (s[j] === ')') { depth--; if (!depth) break } }
        c.nots.push(splitTop(s.slice(i + 5, j)).map(x => parseCompound(x.trim())))
        i = j + 1
      } else { i++; ident(); c.never = true } // :hover and friends never match a frozen frame
    }
    else if (ch === '*') i++
    else c.tag = ident()
  }
  return c
}
function parseSelector(sel) {
  const parts = []
  let comb = null, buf = '', depth = 0
  const flush = () => { if (buf.trim()) { parts.push({ comb: parts.length ? comb || ' ' : null, c: parseCompound(buf.trim()) }); comb = null } buf = '' }
  for (let i = 0; i < sel.length; i++) {
    const ch = sel[i]
    if (ch === '(' || ch === '[') depth++
    if (ch === ')' || ch === ']') depth--
    if (!depth && (ch === '>' || ch === '+' || ch === '~')) { flush(); comb = ch; continue }
    if (!depth && /\s/.test(ch)) { if (buf.trim()) { flush(); comb = comb || ' ' } continue }
    buf += ch
  }
  flush()
  const spec = parts.reduce((s, p) => s + specOf(p.c), 0)
  return { parts, spec }
}
function specOf(c) {
  let s = (c.tag ? 1 : 0) + 1000 * (c.classes.length + c.attrs.length)
  for (const list of c.nots) s += Math.max(0, ...list.map(specOf))
  return s
}
function classesOf(el) { return String(getA(el, 'class') || '').split(/\s+/).filter(Boolean) }
function matchCompound(el, c) {
  if (c.never) return false
  if (c.tag && c.tag !== el.tag) return false
  const cls = classesOf(el)
  for (const k of c.classes) if (!cls.includes(k)) return false
  for (const [k, v] of c.attrs) { const a = getA(el, k); if (a == null || (v != null && a !== v)) return false }
  for (const list of c.nots) if (list.some(x => matchCompound(el, x))) return false
  return true
}
function matches(el, sel) {
  const P = sel.parts
  const at = (node, i) => {
    if (!node || !node.tag || node.tag === '#root' || !matchCompound(node, P[i].c)) return false
    if (i === 0) return true
    if (P[i].comb === '>') return at(node.parent, i - 1)
    if (P[i].comb === ' ') { for (let p = node.parent; p && p.tag !== '#root'; p = p.parent) if (at(p, i - 1)) return true; return false }
    return false // sibling combinators: not used by the motion CSS
  }
  return at(el, P.length - 1)
}

/* ───────────── values ───────────── */
function parseTransform(s) {
  const out = []
  String(s || 'none').replace(/([a-zA-Z0-9]+)\(((?:[^()]|\([^()]*\))*)\)/g, (_, fn, args) => {
    const vals = [], units = []
    for (const a of splitTop(args).flatMap(x => x.trim().split(/\s+(?![^(]*\))/)).filter(Boolean)) {
      const calc = /^calc\((.*)\)$/.exec(a)
      const terms = calc ? calc[1].split(/\s*\+\s*/) : [a]
      let v = 0, u = ''
      for (const t of terms) { const m = /^(-?[\d.]+(?:e-?\d+)?)([a-z%]*)$/i.exec(t.trim()); if (m) { v += Number(m[1]); u = m[2] || u } }
      vals.push(v); units.push(u)
    }
    out.push([fn, vals, units])
    return ''
  })
  return out
}
const IDENTITY = { scale: 1, scaleX: 1, scaleY: 1 }
const identityOf = list => list.map(([fn, v, u]) => [fn, v.map(() => IDENTITY[fn] != null ? IDENTITY[fn] : 0), u])
function lerpTransform(a, b, f) {
  let A = parseTransform(a), B = parseTransform(b)
  if (!A.length && B.length) A = identityOf(B)
  if (!B.length && A.length) B = identityOf(A)
  const same = A.length === B.length && A.every((x, i) => x[0] === B[i][0] && x[1].length === B[i][1].length)
  if (!same) return f < 0.5 ? A : B   // never happens with the motion keyframes (their lists always line up)
  return A.map((x, i) => [x[0], x[1].map((v, j) => v + (B[i][1][j] - v) * f), x[2][0] ? x[2] : B[i][2]])
}
const num = (s, d) => { const n = parseFloat(s); return isFinite(n) ? n : d }
// filter: drop-shadow(0 0 Rpx …) x n | blur(Rpx) | none -> { glow: [R...], blur: R }
function parseFilter(s) {
  const glow = [], str = String(s || 'none')
  for (const m of str.matchAll(/drop-shadow\(((?:[^()]|\((?:[^()]|\([^()]*\))*\))*)\)/g)) { const n = /^\s*-?[\d.]+\w*\s+-?[\d.]+\w*\s+(-?[\d.]+)/.exec(m[1]); glow.push(n ? Number(n[1]) : 0) }
  const b = /blur\(\s*(-?[\d.]+)/.exec(str)
  return { glow, blur: b ? Number(b[1]) : 0 }
}
function lerpFilter(a, b, f) {
  const A = parseFilter(a), B = parseFilter(b), n = Math.max(A.glow.length, B.glow.length)
  const glow = []
  for (let i = 0; i < n; i++) glow.push((A.glow[i] || 0) + ((B.glow[i] || 0) - (A.glow[i] || 0)) * f)
  return { glow, blur: A.blur + (B.blur - A.blur) * f }
}
const insetOf = s => { const m = /inset\(([^)]*)\)/.exec(String(s || '')); const v = m ? m[1].trim().split(/\s+/).map(x => parseFloat(x) || 0) : [0]; return [v[0], v[1] ?? v[0], v[2] ?? v[0], v[3] ?? v[1] ?? v[0]] }

// the value of one property at keyframe progress `at` (0-100): interpolated between the stops that set it
function track(stops, prop, at, elEase, base) {
  const own = stops.filter(s => s[1][prop] != null)
  if (!own.length) return null
  const list = own.slice()
  if (list[0][0] > 0) list.unshift([0, { [prop]: base }, null])
  if (list[list.length - 1][0] < 100) list.push([100, { [prop]: base }, null])
  let i = 0
  while (i < list.length - 2 && list[i + 1][0] <= at) i++
  const [a0, pa, ea] = list[i], [a1, pb] = list[Math.min(i + 1, list.length - 1)]
  const local = a1 > a0 ? Math.max(0, Math.min(1, (at - a0) / (a1 - a0))) : 1
  return { a: pa[prop], b: pb[prop], f: easeFn(ea || elEase)(local) }
}
// animation shorthand: name duration timing-function delay iteration-count fill (any order as CSS allows)
function parseAnimation(s) {
  const toks = splitTop(s)[0].trim().split(/\s+(?![^(]*\))/)
  const o = { name: null, duration: 0, delay: 0, ease: 'ease', iter: 1 }
  let times = 0
  for (const t of toks) {
    if (/^-?[\d.]+m?s$/.test(t)) { const v = parseFloat(t) / (/ms$/.test(t) ? 1000 : 1); if (times++ === 0) o.duration = v; else o.delay = v }
    else if (t === 'infinite') o.iter = Infinity
    else if (/^[\d.]+$/.test(t)) o.iter = Number(t)
    else if (/^(linear|ease|ease-in|ease-out|ease-in-out|step-start|step-end)$/.test(t) || /^(cubic-bezier|steps)\(/.test(t)) o.ease = t
    else if (/^(both|forwards|backwards|none|normal|running|paused)$/.test(t)) { /* fill / play state */ }
    else o.name = t
  }
  return o
}

/* ───────────── geometry: lengths for pathLength ───────────── */
function shapePath(el) {
  const a = k => num(getA(el, k), 0)
  switch (el.tag) {
    case 'path': return getA(el, 'd') || ''
    case 'line': return `M${a('x1')} ${a('y1')}L${a('x2')} ${a('y2')}`
    case 'polyline': case 'polygon': {
      const p = (String(getA(el, 'points') || '').match(/[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi) || []).map(Number)
      let d = ''
      for (let i = 0; i + 1 < p.length; i += 2) d += (i ? 'L' : 'M') + p[i] + ' ' + p[i + 1]
      return d + (el.tag === 'polygon' ? 'Z' : '')
    }
    default: return null
  }
}
function pathLen(d) {
  const toks = String(d).match(/[MmLlHhVvCcSsQqTtAaZz]|[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi) || []
  let i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0, L = 0, lc = null, lq = null
  const n = () => Number(toks[i++])
  const isNum = () => i < toks.length && !/^[a-z]$/i.test(toks[i])
  const cubic = (x1, y1, x2, y2, x3, y3) => {
    const G = [[-0.8611363116, 0.3478548451], [-0.3399810436, 0.6521451549], [0.3399810436, 0.6521451549], [0.8611363116, 0.3478548451]]
    let s = 0
    for (let k = 0; k < 16; k++) for (const [g, w] of G) {
      const t = (k + (g + 1) / 2) / 16, u = 1 - t
      const dx = 3 * u * u * (x1 - x) + 6 * u * t * (x2 - x1) + 3 * t * t * (x3 - x2), dy = 3 * u * u * (y1 - y) + 6 * u * t * (y2 - y1) + 3 * t * t * (y3 - y2)
      s += w / 32 * Math.hypot(dx, dy)
    }
    L += s; x = x3; y = y3
  }
  const line = (px, py) => { L += Math.hypot(px - x, py - y); x = px; y = py }
  while (i < toks.length) {
    if (!isNum()) cmd = toks[i++]
    const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase(), ox = rel ? x : 0, oy = rel ? y : 0
    if (C === 'Z') { line(sx, sy); lc = lq = null; continue }
    if (!isNum()) continue
    if (C === 'M') { x = ox + n(); y = oy + n(); sx = x; sy = y; cmd = rel ? 'l' : 'L'; lc = lq = null }
    else if (C === 'L') { line(ox + n(), oy + n()); lc = lq = null }
    else if (C === 'H') { line(ox + n(), y); lc = lq = null }
    else if (C === 'V') { line(x, oy + n()); lc = lq = null }
    else if (C === 'C') { const a = [ox + n(), oy + n(), ox + n(), oy + n(), ox + n(), oy + n()]; lc = [a[2], a[3]]; lq = null; cubic(...a) }
    else if (C === 'S') { const r1 = lc ? [2 * x - lc[0], 2 * y - lc[1]] : [x, y]; const a = [ox + n(), oy + n(), ox + n(), oy + n()]; lc = [a[0], a[1]]; lq = null; cubic(r1[0], r1[1], ...a) }
    else if (C === 'Q' || C === 'T') {
      let qx, qy
      if (C === 'Q') { qx = ox + n(); qy = oy + n() } else { qx = lq ? 2 * x - lq[0] : x; qy = lq ? 2 * y - lq[1] : y }
      const ex = ox + n(), ey = oy + n()
      lq = [qx, qy]; lc = null
      cubic(x + 2 / 3 * (qx - x), y + 2 / 3 * (qy - y), ex + 2 / 3 * (qx - ex), ey + 2 / 3 * (qy - ey), ex, ey)
    } else if (C === 'A') {
      const rx = Math.abs(n()), ry = Math.abs(n()), phi = n(), large = n(), sweep = n(), ex = ox + n(), ey = oy + n()
      L += arcLen(x, y, rx, ry, phi, large, sweep, ex, ey); x = ex; y = ey; lc = lq = null
    } else i++
  }
  return L
}
function arcLen(x1, y1, rx, ry, phi, large, sweep, x2, y2) {
  if (x1 === x2 && y1 === y2) return 0
  if (!rx || !ry) return Math.hypot(x2 - x1, y2 - y1)
  const p = phi * Math.PI / 180, cp = Math.cos(p), sp = Math.sin(p)
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2, xp = cp * dx + sp * dy, yp = -sp * dx + cp * dy
  const lam = xp * xp / (rx * rx) + yp * yp / (ry * ry)
  if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam) }
  const nu = rx * rx * ry * ry - rx * rx * yp * yp - ry * ry * xp * xp, de = rx * rx * yp * yp + ry * ry * xp * xp
  const co = Math.sqrt(Math.max(0, nu / de)) * (large === sweep ? -1 : 1)
  const cxp = co * rx * yp / ry, cyp = -co * ry * xp / rx
  const ang = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy)
  const t1 = ang(1, 0, (xp - cxp) / rx, (yp - cyp) / ry)
  let dt = ang((xp - cxp) / rx, (yp - cyp) / ry, (-xp - cxp) / rx, (-yp - cyp) / ry)
  if (!sweep && dt > 0) dt -= 2 * Math.PI
  else if (sweep && dt < 0) dt += 2 * Math.PI
  let s = 0
  const N = 64
  for (let k = 0; k < N; k++) { const t = t1 + dt * (k + 0.5) / N; s += Math.hypot(rx * Math.sin(t), ry * Math.cos(t)) * Math.abs(dt) / N }
  return s
}
function elementLength(el) {
  const a = k => num(getA(el, k), 0)
  if (el.tag === 'circle') return 2 * Math.PI * a('r')
  if (el.tag === 'ellipse') { const rx = a('rx'), ry = a('ry'); const h = ((rx - ry) / (rx + ry)) ** 2; return Math.PI * (rx + ry) * (1 + 3 * h / (10 + Math.sqrt(4 - 3 * h))) }
  if (el.tag === 'rect') {
    const w = a('width'), h = a('height')
    let rx = getA(el, 'rx') != null ? a('rx') : getA(el, 'ry') != null ? a('ry') : 0, ry = getA(el, 'ry') != null ? a('ry') : rx
    rx = Math.min(Math.max(0, rx), w / 2); ry = Math.min(Math.max(0, ry), h / 2)
    const q = rx && ry ? Math.PI * (rx + ry) / 2 : 0
    return 2 * (w - 2 * rx) + 2 * (h - 2 * ry) + 2 * q
  }
  const d = shapePath(el)
  return d ? pathLen(d) : 0
}

/* ───────────── matrices ───────────── */
const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]]
function fnsMatrix(fns, box) {
  const len = (v, u, ref) => (u === '%' ? v / 100 * ref : v)
  let M = [1, 0, 0, 1, 0, 0], ry = 0
  for (const [fn, v, u] of fns) {
    let n = null
    if (fn === 'translate') n = [1, 0, 0, 1, len(v[0], u[0], box[2]), len(v[1] || 0, u[1], box[3])]
    else if (fn === 'translateX') n = [1, 0, 0, 1, len(v[0], u[0], box[2]), 0]
    else if (fn === 'translateY') n = [1, 0, 0, 1, 0, len(v[0], u[0], box[3])]
    else if (fn === 'scale') n = [v[0], 0, 0, v.length > 1 ? v[1] : v[0], 0, 0]
    else if (fn === 'scaleX') n = [v[0], 0, 0, 1, 0, 0]
    else if (fn === 'scaleY') n = [1, 0, 0, v[0], 0, 0]
    else if (fn === 'rotate' || fn === 'rotateZ') { const a = v[0] * Math.PI / 180; n = [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0] }
    else if (fn === 'rotateY') { n = [Math.cos(v[0] * Math.PI / 180), 0, 0, 1, 0, 0]; ry += v[0] }
    else if (fn === 'rotateX') n = [1, 0, 0, Math.cos(v[0] * Math.PI / 180), 0, 0]
    else if (fn === 'skewX') n = [1, 0, Math.tan(v[0] * Math.PI / 180), 1, 0, 0]
    else if (fn === 'skewY') n = [1, Math.tan(v[0] * Math.PI / 180), 0, 1, 0, 0]
    else if (fn === 'matrix' && v.length === 6) n = v.slice()
    if (n) M = mul(M, n)
  }
  return { M, ry }
}
function originOf(value, box) {
  const q = String(value || '').trim().split(/\s+/)
  const one = (s, i) => {
    if (s == null) return box[i] + box[i + 2] / 2
    if (s === 'left' || s === 'top') return box[i]
    if (s === 'right' || s === 'bottom') return box[i] + box[i + 2]
    if (s === 'center') return box[i] + box[i + 2] / 2
    return /%$/.test(s) ? box[i] + parseFloat(s) / 100 * box[i + 2] : num(s, 0)
  }
  if (!value) return [0, 0]  // CSS initial value for SVG elements: 0 0
  return [one(q[0], 0), one(q[1] != null ? q[1] : (q[0] === 'top' || q[0] === 'bottom' ? 'center' : q[1]), 1)]
}
function viewBoxOf(el) {
  for (let p = el.parent; p && p.tag !== '#root'; p = p.parent) {
    if (p.tag === 'svg') {
      const vb = getA(p, 'viewBox')
      if (vb) { const v = vb.trim().split(/[\s,]+/).map(Number); if (v.length === 4 && v.every(isFinite)) return v }
      return [0, 0, num(getA(p, 'width'), 24), num(getA(p, 'height'), 24)]
    }
  }
  return [0, 0, 24, 24]
}
function svgAttrsOf(el) {
  for (let p = el.parent; p && p.tag !== '#root'; p = p.parent) if (p.tag === 'svg') return p.attrs
  return []
}

/**
 * A frozen frame (an SVG with paused CSS animations inside) -> a static SVG with the animated values as attributes.
 * opts.bbox(svgMarkup, 'fill' | 'stroke') -> [x, y, w, h] | null: bounds of a fragment (a complete <svg> with the element
 * alone in it): 'fill' for transform-box: fill-box, 'stroke' for clip-path inset(). Without it both use the view box.
 */
export function freezeSvg(svg, opts = {}) {
  const src = String(svg)
  if (!/<style[\s>]/i.test(src)) return src
  const tree = parseXml(src)
  let css = ''
  const styles = []
  walk(tree, el => { if (el.tag === 'style') { styles.push(el); css += el.children.map(c => c.text || '').join('') } })
  for (const s of styles) s.parent.children = s.parent.children.filter(c => c !== s)
  const { keyframes, rules } = parseCss(css)
  const defs = []
  let uid = 0
  const prefix = 'wf' + (src.length % 997).toString(36)
  walk(tree, el => {
    if (el.tag === 'svg' && el.parent === tree) return
    const matched = rules.filter(r => matches(el, r.sel)).sort((a, b) => a.sel.spec - b.sel.spec || a.order - b.order)
    if (!matched.length) return
    const d = {}
    for (const r of matched) Object.assign(d, r.decls)
    if (d['stroke-dasharray'] != null) setA(el, 'stroke-dasharray', d['stroke-dasharray'])
    const anim = d.animation ? parseAnimation(d.animation) : null
    const stops = anim && keyframes[anim.name]
    let fns = null, opacity = null, dashoffset = null, filter = null, clip = null, kfOrigin = null
    if (stops && stops.length && anim.duration > 0) {
      const elapsed = -anim.delay
      let p = elapsed / anim.duration
      if (p < 0) p = 0
      else if (anim.iter === Infinity) p = p - Math.floor(p)
      else if (p >= anim.iter) p = 1
      else p = p - Math.floor(p)
      const at = p * 100
      const tr = track(stops, 'transform', at, anim.ease, 'none')
      if (tr) fns = lerpTransform(tr.a, tr.b, tr.f)
      const op = track(stops, 'opacity', at, anim.ease, getA(el, 'opacity') || 1)
      if (op) opacity = num(op.a, 1) + (num(op.b, 1) - num(op.a, 1)) * op.f
      const dsh = track(stops, 'stroke-dashoffset', at, anim.ease, 0)
      if (dsh) dashoffset = num(dsh.a, 0) + (num(dsh.b, 0) - num(dsh.a, 0)) * dsh.f
      const fl = track(stops, 'filter', at, anim.ease, 'none')
      if (fl) filter = lerpFilter(fl.a, fl.b, fl.f)
      const cp = track(stops, 'clip-path', at, anim.ease, 'inset(0% 0% 0% 0%)')
      if (cp) { const A = insetOf(cp.a), B = insetOf(cp.b); clip = A.map((v, j) => v + (B[j] - v) * cp.f) }
      const or = track(stops, 'transform-origin', at, 'step-end', null)
      if (or) kfOrigin = or.f >= 1 && or.b ? or.b : or.a
    }
    // transform (+ origin in its reference box); replaces the attribute, as the CSS property does
    // the element's own bounds (before its transform), measured alone in its <svg>
    const ownBox = kind => {
      if (typeof opts.bbox !== 'function') return null
      const own = { ...el, attrs: el.attrs.filter(a => a[0] !== 'transform') }
      const root = svgAttrsOf(el).filter(a => !['width', 'height', 'x', 'y', 'class', 'overflow'].includes(a[0]))
      const b = opts.bbox(`<svg${root.map(([k, v]) => ` ${k}="${escA(v)}"`).join('')}>${serialize(own)}</svg>`, kind)
      return b && b[2] > 0 && b[3] > 0 ? b : null
    }
    if (fns) {
      let box = viewBoxOf(el)
      if (d['transform-box'] === 'fill-box') box = ownBox('fill') || box
      const o = originOf(kfOrigin || d['transform-origin'], box)
      const { M: T, ry } = fnsMatrix(fns, box)
      const M = mul(mul([1, 0, 0, 1, o[0], o[1]], T), [1, 0, 0, 1, -o[0], -o[1]])
      const still = Math.abs(M[0] - 1) + Math.abs(M[1]) + Math.abs(M[2]) + Math.abs(M[3] - 1) + Math.abs(M[4]) + Math.abs(M[5]) < 1e-6
      if (still) delA(el, 'transform')
      else setA(el, 'transform', `matrix(${M.map(r4).join(' ')})`)
      // a flipped element whose back is turned is invisible with backface-visibility: hidden
      if (d['backface-visibility'] === 'hidden' && Math.cos(ry * Math.PI / 180) < -1e-6) opacity = 0
    }
    if (opacity != null) setA(el, 'opacity', r4(Math.max(0, Math.min(1, opacity))))
    // stroke dashes: pathLength="1" means fractions of the shape's own length; resvg needs real lengths
    if (dashoffset != null || getA(el, 'pathLength') != null) {
      const pl = num(getA(el, 'pathLength'), 0)
      const k = pl > 0 ? elementLength(el) / pl : 1
      const da = getA(el, 'stroke-dasharray')
      if (da && da !== 'none' && k !== 1) setA(el, 'stroke-dasharray', da.split(/[\s,]+/).map(v => r4(num(v, 0) * k)).join(' '))
      if (dashoffset != null) setA(el, 'stroke-dashoffset', r4(dashoffset * k))
      else if (getA(el, 'stroke-dashoffset') != null && k !== 1) setA(el, 'stroke-dashoffset', r4(num(getA(el, 'stroke-dashoffset'), 0) * k))
      delA(el, 'pathLength')
    }
    if (filter && (filter.blur > 0.01 || filter.glow.some(v => v > 0.01))) {
      const id = `${prefix}-${uid++}`
      let f = `<filter id="${id}" x="-1" y="-1" width="3" height="3" color-interpolation-filters="sRGB">`
      if (filter.glow.some(v => v > 0.01)) {
        // CSS drop-shadow blur radius = 2 standard deviations; the halo pair is 42% and 22% of the glow colour
        const alpha = [0.42, 0.22], merge = []
        filter.glow.forEach((g, j) => {
          f += `<feGaussianBlur in="SourceAlpha" stdDeviation="${r4(Math.max(0, g) / 2)}" result="b${j}"/><feFlood flood-color="currentColor" flood-opacity="${alpha[j] != null ? alpha[j] : 0.3}"/><feComposite in2="b${j}" operator="in" result="g${j}"/>`
          merge.unshift(`<feMergeNode in="g${j}"/>`)
        })
        f += `<feMerge>${merge.join('')}<feMergeNode in="SourceGraphic"/></feMerge>`
      } else f += `<feGaussianBlur stdDeviation="${r4(filter.blur)}"/>`
      defs.push(f + '</filter>')
      setA(el, 'filter', `url(#${id})`)
    }
    if (clip && clip.some(v => Math.abs(v) > 0.01)) {
      // inset() percentages refer to the element's stroke box (clip-path's default reference box for SVG elements)
      const id = `${prefix}-${uid++}`, vb = ownBox('stroke') || viewBoxOf(el)
      const [ct, cr, cb, cl] = [clip[0] * vb[3] / 100, clip[1] * vb[2] / 100, clip[2] * vb[3] / 100, clip[3] * vb[2] / 100]
      defs.push(`<clipPath id="${id}"><rect x="${r4(vb[0] + cl)}" y="${r4(vb[1] + ct)}" width="${r4(Math.max(0, vb[2] - cl - cr))}" height="${r4(Math.max(0, vb[3] - ct - cb))}"/></clipPath>`)
      setA(el, 'clip-path', `url(#${id})`)
    }
  })
  // style attributes with CSS variables (the halo's flood colour): renderers without var() keep the attribute value
  walk(tree, el => {
    const st = getA(el, 'style')
    if (st == null) return
    const keep = st.split(';').filter(x => x.trim() && !/var\(/.test(x)).join(';')
    if (keep) setA(el, 'style', keep); else delA(el, 'style')
  })
  const top = elements(tree)[0]
  if (defs.length && top) top.children.unshift({ tag: 'defs', attrs: [], children: defs.map(t => ({ text: t })), parent: top })
  return serialize(tree)
}

export const _test = { parseCss, parseSelector, matches, parseXml, serialize, pathLen, elementLength, parseAnimation, lerpTransform }
