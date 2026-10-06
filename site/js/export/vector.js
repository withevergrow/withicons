/* with icons — vector export formats: SVG (themable), SVG (flat), PDF (true vector, PDF 1.4), EPS (EPSF-3.0).
 * UMD: classic script in browsers (registers on window.WithExport, load after registry.js), require() in Node
 * (module.exports is register(WithExport)). Dependency-free.
 *
 * Shared helpers for the other export modules live on WithExport.vector (app.js and code.js use them):
 *   parseXml(str) / serialize(node)          tiny XML tree for icon markup
 *   flatSvg(ctx, o)                          like svgString({flat:true}) but resolves per-element `color` (blueprint accents)
 *   drawing(svgString)                       -> { vb, width, height, items:[{ segs, ctm, fill, stroke, ... }] }
 *   pdf(drawing, { width, height, title })   -> Uint8Array (PDF 1.4)
 *   eps(drawing, { width, height, title, background }) -> string (EPSF-3.0)
 *   flattenDash(segs, dash, offset)          -> segs (open dashes as polylines), for targets without dashes
 *   segsToD(segs, map?) / fmt(n) / parseColor(s)
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory; module.exports.register = factory }
  else if (root.WithExport) factory(root.WithExport)
})(typeof self !== 'undefined' ? self : this, function register(WE) {
  if (WE.vector && WE.vector.__registered) { registerFormats(WE); return WE.vector }

  // ---------- numbers ----------
  function fmt(n, d) {
    var p = Math.pow(10, d == null ? 3 : d)
    var v = Math.round(n * p) / p
    if (v === 0 || !isFinite(v)) return '0'
    var s = String(v)
    if (s.indexOf('e') >= 0) s = v.toFixed(d == null ? 3 : d).replace(/\.?0+$/, '')
    return s
  }

  // ---------- XML ----------
  var ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }
  function decode(s) {
    return String(s).replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, function (m, e) {
      if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10))
      return ENT[e] != null ? ENT[e] : m
    })
  }
  function escAttr(v) { return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;') }
  function escText(v) { return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') }

  function parseXml(src) {
    var rootNode = { tag: '#root', attrs: {}, children: [] }, stack = [rootNode]
    var re = /<!--[\s\S]*?-->|<!\[CDATA\[([\s\S]*?)\]\]>|<\?[\s\S]*?\?>|<!DOCTYPE[^>]*>|<\/([\w:.-]+)\s*>|<([\w:.-]+)((?:\s+[\w:.-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>|[^<]+|</g
    var m
    while ((m = re.exec(src))) {
      var top = stack[stack.length - 1]
      if (m[3]) {
        var node = { tag: m[3], attrs: {}, children: [] }
        var ar = /([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g, a
        while ((a = ar.exec(m[4] || ''))) node.attrs[a[1]] = decode(a[2] != null ? a[2] : a[3])
        top.children.push(node)
        if (!m[5]) stack.push(node)
      } else if (m[2]) {
        for (var i = stack.length - 1; i > 0; i--) if (stack[i].tag === m[2]) { stack.length = i; break }
      } else if (m[1] != null) {
        top.children.push({ text: m[1] })
      } else if (m[0][0] !== '<' || m[0] === '<') {
        if (/\S/.test(m[0])) top.children.push({ text: decode(m[0]) })
      }
    }
    return rootNode
  }
  function serialize(node) {
    if (node.text != null) return escText(node.text)
    var inner = (node.children || []).map(serialize).join('')
    if (node.tag === '#root') return inner
    var s = '<' + node.tag
    for (var k in node.attrs) s += ' ' + k + '="' + escAttr(node.attrs[k]) + '"'
    return s + (inner ? '>' + inner + '</' + node.tag + '>' : '/>')
  }
  function findTag(node, tag) {
    if (node.tag === tag) return node
    for (var i = 0; node.children && i < node.children.length; i++) { var r = findTag(node.children[i], tag); if (r) return r }
    return null
  }

  // ---------- flat SVG with correct per-element `color` ----------
  // The icon data sets color="var(--with-accent, currentColor)" on some elements (blueprint) and paints them with
  // currentColor; a plain text replace of currentColor would lose that accent. Resolve it the way a browser does.
  function flatInner(ctx) {
    var vars = ctx.vars || {}, ink = ctx.color || '#000000'
    var tree = parseXml(String(ctx.inner || ''))
    var bake = function (v, cur) { return WE.bakeVars(v, vars).replace(/currentColor/gi, cur) }
    ;(function walk(node, cur) {
      ;(node.children || []).forEach(function (ch) {
        if (ch.text != null) return
        var c = cur
        if (ch.attrs.color != null) { c = bake(ch.attrs.color, cur); delete ch.attrs.color }
        if (ch.attrs.style && /color\s*:/.test(ch.attrs.style)) {
          var mm = /(?:^|;)\s*color\s*:\s*([^;]+)/.exec(ch.attrs.style)
          if (mm) c = bake(mm[1].trim(), cur)
        }
        for (var k in ch.attrs) ch.attrs[k] = bake(ch.attrs[k], c)
        walk(ch, c)
      })
    })(tree, ink)
    return serialize(tree)
  }
  // svgString() with a background rect that does not inherit the root stroke (svgString's own rect sits inside an
  // <svg stroke="currentColor" stroke-width=...> on outline styles, so it would get an outline round the edge).
  function svgWithBg(ctx, o) {
    o = o || {}
    var s = WE.svgString(ctx, Object.assign({}, o, { background: null }))
    if (!o.background) return s
    var vb = (/viewBox="([^"]*)"/.exec(s) || [])[1].split(' ')
    var rect = '<rect x="' + vb[0] + '" y="' + vb[1] + '" width="' + vb[2] + '" height="' + vb[3] + '" fill="' + escAttr(o.background) + '" stroke="none"/>'
    var at = s.indexOf('>') + 1
    if (s.slice(at, at + 7) === '<title>') at = s.indexOf('</title>', at) + 8
    return s.slice(0, at) + rect + s.slice(at)
  }
  function flatSvg(ctx, o) {
    var c = {}
    for (var k in ctx) c[k] = ctx[k]
    c.inner = WE.stripMotion ? WE.stripMotion(flatInner(ctx)) : flatInner(ctx)   // a flat SVG is a file: no motion hooks
    return svgWithBg(c, Object.assign({}, o || {}, { flat: true }))
  }

  // ---------- colours ----------
  var NAMED = { black: '000000', white: 'ffffff', red: 'ff0000', lime: '00ff00', green: '008000', blue: '0000ff', yellow: 'ffff00',
    cyan: '00ffff', aqua: '00ffff', magenta: 'ff00ff', fuchsia: 'ff00ff', gray: '808080', grey: '808080', silver: 'c0c0c0',
    maroon: '800000', olive: '808000', navy: '000080', purple: '800080', teal: '008080', orange: 'ffa500', pink: 'ffc0cb' }
  function parseColor(s) {
    s = String(s == null ? '' : s).trim().toLowerCase()
    if (!s || s === 'none' || s === 'transparent') return null
    if (NAMED[s]) s = '#' + NAMED[s]
    var m
    if (s[0] === '#') {
      var h = s.slice(1)
      if (h.length === 3 || h.length === 4) h = h.split('').map(function (c) { return c + c }).join('')
      if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/.test(h)) return null
      return { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255, a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 }
    }
    if ((m = /^rgba?\(([^)]*)\)$/.exec(s))) {
      var p = m[1].split(/[\s,\/]+/).filter(Boolean)
      var ch = function (v) { return /%$/.test(v) ? parseFloat(v) / 100 : parseFloat(v) / 255 }
      var al = p[3] == null ? 1 : (/%$/.test(p[3]) ? parseFloat(p[3]) / 100 : parseFloat(p[3]))
      return { r: clamp01(ch(p[0])), g: clamp01(ch(p[1])), b: clamp01(ch(p[2])), a: clamp01(al) }
    }
    return null
  }
  function clamp01(v) { return isFinite(v) ? Math.max(0, Math.min(1, v)) : 0 }
  function hex2(v) { var h = Math.round(clamp01(v) * 255).toString(16).toUpperCase(); return h.length < 2 ? '0' + h : h }

  // ---------- geometry ----------
  var I = [1, 0, 0, 1, 0, 0]
  function mul(m, n) { // m then n applied inside: result = m x n
    return [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
      m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]]
  }
  function apply(m, x, y) { return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]] }
  function isIdentity(m) { return m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1 && m[4] === 0 && m[5] === 0 }
  function parseTransform(s) {
    var m = I.slice(), re = /(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)/g, t
    while ((t = re.exec(String(s || '')))) {
      var a = (t[2].match(/[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g) || []).map(Number), n
      switch (t[1]) {
        case 'matrix': n = a.length >= 6 ? a.slice(0, 6) : I; break
        case 'translate': n = [1, 0, 0, 1, a[0] || 0, a[1] || 0]; break
        case 'scale': n = [a[0] == null ? 1 : a[0], 0, 0, a[1] == null ? (a[0] == null ? 1 : a[0]) : a[1], 0, 0]; break
        case 'rotate': {
          var r = (a[0] || 0) * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r), cx = a[1] || 0, cy = a[2] || 0
          n = mul(mul([1, 0, 0, 1, cx, cy], [c, sn, -sn, c, 0, 0]), [1, 0, 0, 1, -cx, -cy]); break
        }
        case 'skewX': n = [1, 0, Math.tan((a[0] || 0) * Math.PI / 180), 1, 0, 0]; break
        case 'skewY': n = [1, Math.tan((a[0] || 0) * Math.PI / 180), 0, 1, 0, 0]; break
      }
      m = mul(m, n)
    }
    return m
  }

  // SVG elliptical arc -> cubic Béziers (SVG 1.1 implementation notes F.6.5 / F.6.6)
  function arcToCubics(x1, y1, rx, ry, phiDeg, fa, fs, x2, y2) {
    if (x1 === x2 && y1 === y2) return []
    rx = Math.abs(rx); ry = Math.abs(ry)
    if (!rx || !ry) return [['L', x2, y2]]
    var phi = phiDeg * Math.PI / 180, cos = Math.cos(phi), sin = Math.sin(phi)
    var dx = (x1 - x2) / 2, dy = (y1 - y2) / 2
    var x1p = cos * dx + sin * dy, y1p = -sin * dx + cos * dy
    var lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry)
    if (lam > 1) { var sl = Math.sqrt(lam); rx *= sl; ry *= sl }
    var num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p
    var den = rx * rx * y1p * y1p + ry * ry * x1p * x1p
    var coef = (fa === fs ? -1 : 1) * Math.sqrt(Math.max(0, num / den))
    var cxp = coef * rx * y1p / ry, cyp = -coef * ry * x1p / rx
    var cx = cos * cxp - sin * cyp + (x1 + x2) / 2, cy = sin * cxp + cos * cyp + (y1 + y2) / 2
    var ang = function (ux, uy, vx, vy) {
      var a = Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy)
      return a
    }
    var ux = (x1p - cxp) / rx, uy = (y1p - cyp) / ry, vx = (-x1p - cxp) / rx, vy = (-y1p - cyp) / ry
    var t1 = ang(1, 0, ux, uy), dt = ang(ux, uy, vx, vy)
    if (!fs && dt > 0) dt -= 2 * Math.PI
    else if (fs && dt < 0) dt += 2 * Math.PI
    var n = Math.max(1, Math.ceil(Math.abs(dt) / (Math.PI / 2) - 1e-9)), d = dt / n, k = 4 / 3 * Math.tan(d / 4)
    var map = function (x, y) { return [cx + rx * x * cos - ry * y * sin, cy + rx * x * sin + ry * y * cos] }
    var out = []
    for (var i = 0; i < n; i++) {
      var a1 = t1 + i * d, a2 = a1 + d
      var c1 = map(Math.cos(a1) - k * Math.sin(a1), Math.sin(a1) + k * Math.cos(a1))
      var c2 = map(Math.cos(a2) + k * Math.sin(a2), Math.sin(a2) - k * Math.cos(a2))
      var e = i === n - 1 ? [x2, y2] : map(Math.cos(a2), Math.sin(a2))
      out.push(['C', c1[0], c1[1], c2[0], c2[1], e[0], e[1]])
    }
    return out
  }

  // path data -> absolute segments ['M',x,y] ['L',x,y] ['C',x1,y1,x2,y2,x,y] ['Z']
  function parsePath(d) {
    var toks = [], re = /([MmZzLlHhVvCcSsQqTtAa])|([-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)/g, t
    d = String(d || '')
    while ((t = re.exec(d))) toks.push(t[1] ? { c: t[1] } : { n: parseFloat(t[2]), s: t[2], at: t.index })
    var out = [], i = 0, cmd = null, x = 0, y = 0, sx = 0, sy = 0, lc = null, lq = null, prev = null
    var num = function () { var tk = toks[i]; if (!tk || tk.c) throw 0; i++; return tk.n }
    var flag = function () {
      // arc flags may be packed: "011.2" -> 0, 1, 1.2
      var tk = toks[i]; if (!tk || tk.c) throw 0
      var ch = tk.s.replace(/^\+/, '')
      if (ch === '0' || ch === '1') { i++; return +ch }
      if (/^[01]/.test(ch)) { tk.s = ch.slice(1); tk.n = parseFloat(tk.s); return +ch[0] }
      throw 0
    }
    try {
      while (i < toks.length) {
        if (toks[i].c) { cmd = toks[i].c; i++ } else if (!cmd) break
        else if (cmd === 'M') cmd = 'L'
        else if (cmd === 'm') cmd = 'l'
        var rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase(), ox = rel ? x : 0, oy = rel ? y : 0
        if (C === 'Z') {
          out.push(['Z']); x = sx; y = sy; lc = lq = null; prev = 'Z'
          continue
        }
        if (i >= toks.length || toks[i].c) break // command without numbers: stop like a browser would
        switch (C) {
          case 'M': x = ox + num(); y = oy + num(); sx = x; sy = y; out.push(['M', x, y]); lc = lq = null; break
          case 'L': x = ox + num(); y = oy + num(); out.push(['L', x, y]); lc = lq = null; break
          case 'H': x = (rel ? x : 0) + num(); out.push(['L', x, y]); lc = lq = null; break
          case 'V': y = (rel ? y : 0) + num(); out.push(['L', x, y]); lc = lq = null; break
          case 'C': {
            var x1 = ox + num(), y1 = oy + num(), x2 = ox + num(), y2 = oy + num(); x = ox + num(); y = oy + num()
            out.push(['C', x1, y1, x2, y2, x, y]); lc = [x2, y2]; lq = null; break
          }
          case 'S': {
            var rx1 = lc ? 2 * x - lc[0] : x, ry1 = lc ? 2 * y - lc[1] : y
            var sx2 = ox + num(), sy2 = oy + num(); var ex = ox + num(), ey = oy + num()
            out.push(['C', rx1, ry1, sx2, sy2, ex, ey]); x = ex; y = ey; lc = [sx2, sy2]; lq = null; break
          }
          case 'Q': {
            var qx = ox + num(), qy = oy + num(), qex = ox + num(), qey = oy + num()
            out.push(['C', x + 2 / 3 * (qx - x), y + 2 / 3 * (qy - y), qex + 2 / 3 * (qx - qex), qey + 2 / 3 * (qy - qey), qex, qey])
            x = qex; y = qey; lq = [qx, qy]; lc = null; break
          }
          case 'T': {
            var tqx = lq ? 2 * x - lq[0] : x, tqy = lq ? 2 * y - lq[1] : y, tex = ox + num(), tey = oy + num()
            out.push(['C', x + 2 / 3 * (tqx - x), y + 2 / 3 * (tqy - y), tex + 2 / 3 * (tqx - tex), tey + 2 / 3 * (tqy - tey), tex, tey])
            x = tex; y = tey; lq = [tqx, tqy]; lc = null; break
          }
          case 'A': {
            var arx = num(), ary = num(), rot = num(), fa = flag(), fs = flag(), ax = ox + num(), ay = oy + num()
            arcToCubics(x, y, arx, ary, rot, fa, fs, ax, ay).forEach(function (s) { out.push(s) })
            x = ax; y = ay; lc = lq = null; break
          }
        }
        prev = C
      }
    } catch (e) { if (e !== 0) throw e } // malformed tail: render what parsed, like browsers do
    // a drawing command must follow an M; drop leading garbage
    while (out.length && out[0][0] !== 'M') out.shift()
    return out
  }

  var K = 0.5522847498307936
  function ellipseSegs(cx, cy, rx, ry) {
    if (!(rx > 0) || !(ry > 0)) return []
    var kx = rx * K, ky = ry * K
    return [['M', cx + rx, cy], ['C', cx + rx, cy + ky, cx + kx, cy + ry, cx, cy + ry], ['C', cx - kx, cy + ry, cx - rx, cy + ky, cx - rx, cy],
      ['C', cx - rx, cy - ky, cx - kx, cy - ry, cx, cy - ry], ['C', cx + kx, cy - ry, cx + rx, cy - ky, cx + rx, cy], ['Z']]
  }
  function rectSegs(x, y, w, h, rx, ry) {
    if (!(w > 0) || !(h > 0)) return []
    if (rx == null && ry == null) rx = ry = 0
    else if (rx == null) rx = ry
    else if (ry == null) ry = rx
    rx = Math.min(Math.max(0, rx), w / 2); ry = Math.min(Math.max(0, ry), h / 2)
    if (!rx || !ry) return [['M', x, y], ['L', x + w, y], ['L', x + w, y + h], ['L', x, y + h], ['Z']]
    var kx = rx * K, ky = ry * K
    return [['M', x + rx, y], ['L', x + w - rx, y], ['C', x + w - rx + kx, y, x + w, y + ry - ky, x + w, y + ry], ['L', x + w, y + h - ry],
      ['C', x + w, y + h - ry + ky, x + w - rx + kx, y + h, x + w - rx, y + h], ['L', x + rx, y + h],
      ['C', x + rx - kx, y + h, x, y + h - ry + ky, x, y + h - ry], ['L', x, y + ry], ['C', x, y + ry - ky, x + rx - kx, y, x + rx, y], ['Z']]
  }
  function pointsSegs(s, close) {
    var n = (String(s || '').match(/[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g) || []).map(Number), out = []
    for (var i = 0; i + 1 < n.length; i += 2) out.push([i ? 'L' : 'M', n[i], n[i + 1]])
    if (close && out.length) out.push(['Z'])
    return out
  }
  function transformSegs(segs, m) {
    if (isIdentity(m)) return segs
    return segs.map(function (s) {
      if (s[0] === 'Z') return s
      var o = [s[0]]
      for (var i = 1; i < s.length; i += 2) { var p = apply(m, s[i], s[i + 1]); o.push(p[0], p[1]) }
      return o
    })
  }
  function segsToD(segs, f) {
    f = f || fmt
    var out = ''
    segs.forEach(function (s) { out += s[0] + s.slice(1).map(function (v) { return f(v) }).join(' ') })
    return out.replace(/ -/g, '-')
  }

  // Flatten to polylines and cut into dashes (for targets that cannot dash, e.g. Android VectorDrawable).
  function flattenDash(segs, dash, offset) {
    var polys = [], cur = null, x = 0, y = 0, sx = 0, sy = 0
    segs.forEach(function (s) {
      if (s[0] === 'M') { cur = [[s[1], s[2]]]; polys.push(cur); x = sx = s[1]; y = sy = s[2] }
      else if (s[0] === 'L') { if (!cur) { cur = [[x, y]]; polys.push(cur) } cur.push([s[1], s[2]]); x = s[1]; y = s[2] }
      else if (s[0] === 'C') {
        if (!cur) { cur = [[x, y]]; polys.push(cur) }
        var len = Math.hypot(s[1] - x, s[2] - y) + Math.hypot(s[3] - s[1], s[4] - s[2]) + Math.hypot(s[5] - s[3], s[6] - s[4])
        var n = Math.max(4, Math.min(64, Math.ceil(len / 0.15)))
        for (var k = 1; k <= n; k++) {
          var t = k / n, u = 1 - t
          cur.push([u * u * u * x + 3 * u * u * t * s[1] + 3 * u * t * t * s[3] + t * t * t * s[5], u * u * u * y + 3 * u * u * t * s[2] + 3 * u * t * t * s[4] + t * t * t * s[6]])
        }
        x = s[5]; y = s[6]
      } else if (s[0] === 'Z') { if (cur) cur.push([sx, sy]); cur = null; x = sx; y = sy }
    })
    var total = dash.reduce(function (a, b) { return a + b }, 0), out = []
    if (!(total > 0)) return segs
    polys.forEach(function (pl) {
      // dash state restarts at each subpath (SVG semantics)
      var idx = 0, left = dash[0], on = true, off = ((offset || 0) % total + total) % total
      while (off > 0) { if (off >= left) { off -= left; idx = (idx + 1) % dash.length; left = dash[idx]; on = !on } else { left -= off; off = 0 } }
      var pen = false
      for (var i = 1; i < pl.length; i++) {
        var ax = pl[i - 1][0], ay = pl[i - 1][1], bx = pl[i][0], by = pl[i][1], L = Math.hypot(bx - ax, by - ay), pos = 0
        if (on && !pen) { out.push(['M', ax, ay]); pen = true }
        while (L - pos > left) {
          pos += left
          var px = ax + (bx - ax) * pos / L, py = ay + (by - ay) * pos / L
          if (on) { out.push(['L', px, py]); pen = false } else { out.push(['M', px, py]); pen = true }
          on = !on; idx = (idx + 1) % dash.length; left = dash[idx]
        }
        left -= L - pos
        if (on) { if (!pen) { out.push(['M', ax + (bx - ax) * pos / L, ay + (by - ay) * pos / L]); pen = true } out.push(['L', bx, by]) }
      }
    })
    return out
  }

  // ---------- SVG -> drawing list ----------
  var SKIP = { defs: 1, title: 1, desc: 1, metadata: 1, clipPath: 1, mask: 1, symbol: 1, linearGradient: 1, radialGradient: 1,
    pattern: 1, marker: 1, style: 1, script: 1, filter: 1, text: 1, foreignObject: 1 }
  var INHERIT = ['fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-opacity', 'stroke-width', 'stroke-linecap', 'stroke-linejoin',
    'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset', 'color', 'visibility']
  function styleOf(node) {
    var o = {}
    for (var k in node.attrs) o[k] = node.attrs[k]
    if (node.attrs.style) node.attrs.style.split(';').forEach(function (d) {
      var c = d.indexOf(':'); if (c > 0) o[d.slice(0, c).trim()] = d.slice(c + 1).replace(/!important/, '').trim()
    })
    return o
  }
  function num(v, d) { var n = parseFloat(v); return isFinite(n) ? n : d }

  function drawing(svg) {
    var tree = typeof svg === 'string' ? parseXml(svg) : svg
    var rootSvg = findTag(tree, 'svg') || tree
    var ids = {}
    ;(function idx(n) { (n.children || []).forEach(function (c) { if (c.attrs && c.attrs.id) ids[c.attrs.id] = c; if (c.children) idx(c) }) })(rootSvg)
    var vb = (rootSvg.attrs.viewBox || '').split(/[\s,]+/).filter(Boolean).map(Number)
    var width = num(rootSvg.attrs.width, vb.length === 4 ? vb[2] : 24), height = num(rootSvg.attrs.height, vb.length === 4 ? vb[3] : 24)
    if (vb.length !== 4 || !(vb[2] > 0) || !(vb[3] > 0)) vb = [0, 0, width, height]
    var items = []
    var paintOf = function (v, color) {
      v = String(v == null ? '' : v).trim()
      if (!v || v === 'none') return null
      if (/^currentcolor$/i.test(v)) return parseColor(color)
      var u = /^url\(\s*['"]?#([^'")]+)['"]?\s*\)\s*(.*)$/.exec(v)
      if (u) {
        if (u[2] && u[2] !== 'none') return paintOf(u[2], color)
        var g = ids[u[1]], stop = g && (g.children || []).filter(function (c) { return c.tag === 'stop' })[0]
        if (!stop) return null
        var ss = styleOf(stop), c = parseColor(ss['stop-color'] || '#000')
        if (c) c.a *= num(ss['stop-opacity'], 1)
        return c
      }
      return parseColor(v)
    }
    var walk = function (node, inh, ctm, op) {
      ;(node.children || []).forEach(function (n) {
        if (n.text != null || SKIP[n.tag]) return
        var st = styleOf(n)
        if (st.display === 'none') return
        var s = {}
        for (var k in inh) s[k] = inh[k]
        INHERIT.forEach(function (k) { if (st[k] != null && st[k] !== 'inherit') s[k] = st[k] })
        var m = st.transform ? mul(ctm, parseTransform(st.transform)) : ctm
        var o = op * clamp01(num(st.opacity, 1))
        if (n.tag === 'g' || n.tag === 'a' || n.tag === 'svg' || n.tag === 'switch') {
          var mm = m
          if (n.tag === 'svg' && (n.attrs.x || n.attrs.y)) mm = mul(m, [1, 0, 0, 1, num(n.attrs.x, 0), num(n.attrs.y, 0)])
          return walk(n, s, mm, o)
        }
        var a = n.attrs, segs
        switch (n.tag) {
          case 'path': segs = parsePath(a.d); break
          case 'rect': segs = rectSegs(num(a.x, 0), num(a.y, 0), num(a.width, 0), num(a.height, 0), a.rx != null ? num(a.rx, 0) : null, a.ry != null ? num(a.ry, 0) : null); break
          case 'circle': segs = ellipseSegs(num(a.cx, 0), num(a.cy, 0), num(a.r, 0), num(a.r, 0)); break
          case 'ellipse': segs = ellipseSegs(num(a.cx, 0), num(a.cy, 0), num(a.rx, 0), num(a.ry, 0)); break
          case 'line': segs = [['M', num(a.x1, 0), num(a.y1, 0)], ['L', num(a.x2, 0), num(a.y2, 0)]]; break
          case 'polyline': segs = pointsSegs(a.points, false); break
          case 'polygon': segs = pointsSegs(a.points, true); break
          default: return
        }
        if (!segs.length || s.visibility === 'hidden' || s.visibility === 'collapse') return
        var fill = paintOf(s.fill == null ? '#000' : s.fill, s.color)
        if (fill) fill.a *= clamp01(num(s['fill-opacity'], 1)) * o
        var stroke = paintOf(s.stroke, s.color), sw = num(s['stroke-width'], 1)
        if (stroke) stroke.a *= clamp01(num(s['stroke-opacity'], 1)) * o
        if (!(sw > 0)) stroke = null
        if (n.tag === 'line') fill = null // a line has no area
        if (fill && fill.a <= 0) fill = null
        if (stroke && stroke.a <= 0) stroke = null
        if (!fill && !stroke) return
        var dash = []
        if (s['stroke-dasharray'] && s['stroke-dasharray'] !== 'none') {
          dash = (String(s['stroke-dasharray']).match(/[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g) || []).map(Number)
          if (dash.some(function (v) { return v < 0 }) || !dash.some(function (v) { return v > 0 })) dash = []
          if (dash.length % 2) dash = dash.concat(dash)
        }
        items.push({ tag: n.tag, segs: segs, ctm: m, fill: fill, rule: s['fill-rule'] === 'evenodd' ? 'evenodd' : 'nonzero', stroke: stroke, sw: sw,
          cap: s['stroke-linecap'] || 'butt', join: s['stroke-linejoin'] || 'miter', miter: Math.max(1, num(s['stroke-miterlimit'], 4)),
          dash: dash, dashOffset: num(s['stroke-dashoffset'], 0) })
      })
    }
    var base = { color: '#000000' }
    walk({ children: [{ tag: 'g', attrs: Object.assign({}, rootSvg.attrs, { transform: null, opacity: rootSvg.attrs.opacity }), children: rootSvg.children }] }, base, I, 1)
    return { vb: vb, width: width, height: height, items: items }
  }

  // ---------- PDF 1.4 ----------
  var CAP = { butt: 0, round: 1, square: 2 }, JOIN = { miter: 0, 'miter-clip': 0, arcs: 0, round: 1, bevel: 2 }
  function latin1(s) { var b = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 255; return b }
  function pdfText(s) {
    s = String(s || '')
    if (/^[\x20-\x7e]*$/.test(s)) return '(' + s.replace(/[\\()]/g, '\\$&') + ')'
    var h = 'FEFF'
    for (var i = 0; i < s.length; i++) h += ('000' + s.charCodeAt(i).toString(16).toUpperCase()).slice(-4)
    return '<' + h + '>'
  }
  function pathOps(segs, o) {
    var out = [], open = null, drew = false
    var flushDegenerate = function () { if (open && !drew) out.push(fmt(open[0]) + ' ' + fmt(open[1]) + ' ' + o.l) }
    segs.forEach(function (s) {
      if (s[0] === 'M') { open = [s[1], s[2]]; drew = false; out.push(fmt(s[1]) + ' ' + fmt(s[2]) + ' ' + o.m) }
      else if (s[0] === 'L') { drew = true; out.push(fmt(s[1]) + ' ' + fmt(s[2]) + ' ' + o.l) }
      else if (s[0] === 'C') { drew = true; out.push(s.slice(1).map(function (v) { return fmt(v) }).join(' ') + ' ' + o.c) }
      else if (s[0] === 'Z') { flushDegenerate(); drew = true; out.push(o.h) }
    })
    return out.join('\n')
  }
  function rgb(c) { return fmt(c.r, 4) + ' ' + fmt(c.g, 4) + ' ' + fmt(c.b, 4) }

  function pdf(d, o) {
    o = o || {}
    var W = o.width || d.width, H = o.height || d.height, vb = d.vb
    var sx = W / vb[2], sy = H / vb[3]
    var gs = {}, gsList = [], body = []
    var gsName = function (ca, CA) {
      var key = fmt(ca, 3) + '/' + fmt(CA, 3)
      if (!gs[key]) { gs[key] = '/G' + gsList.length; gsList.push([fmt(ca, 3), fmt(CA, 3)]) }
      return gs[key]
    }
    body.push('q', [fmt(sx, 6), '0 0', fmt(-sy, 6), fmt(-vb[0] * sx, 6), fmt(H + vb[1] * sy, 6), 'cm'].join(' '))
    d.items.forEach(function (it) {
      body.push('q')
      if (!isIdentity(it.ctm)) body.push(it.ctm.map(function (v) { return fmt(v, 6) }).join(' ') + ' cm')
      var ca = it.fill ? it.fill.a : 1, CA = it.stroke ? it.stroke.a : 1
      if (ca < 0.9995 || CA < 0.9995) body.push(gsName(ca, CA) + ' gs')
      if (it.fill) body.push(rgb(it.fill) + ' rg')
      if (it.stroke) {
        body.push(rgb(it.stroke) + ' RG', fmt(it.sw, 4) + ' w', (CAP[it.cap] || 0) + ' J', (JOIN[it.join] || 0) + ' j', fmt(it.miter, 3) + ' M')
        if (it.dash.length) body.push('[' + it.dash.map(function (v) { return fmt(v, 4) }).join(' ') + '] ' + fmt(it.dashOffset, 4) + ' d')
      }
      // Fill, then stroke as a separate path. (B/B* would treat fill + stroke as a knockout group when alpha < 1,
      // which differs from SVG, where a translucent stroke shows the fill beneath it.)
      var ops = pathOps(it.segs, { m: 'm', l: 'l', c: 'c', h: 'h' })
      if (it.fill) body.push(ops, it.rule === 'evenodd' ? 'f*' : 'f')
      if (it.stroke) body.push(ops, 'S')
      body.push('Q')
    })
    body.push('Q')
    var content = body.join('\n') + '\n'
    var objs = []
    objs[1] = '<< /Type /Catalog /Pages 2 0 R >>'
    objs[2] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>'
    var gsRefs = gsList.map(function (g, i) { return '/G' + i + ' ' + (6 + i) + ' 0 R' }).join(' ')
    objs[3] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + fmt(W, 4) + ' ' + fmt(H, 4) + '] /Resources << /ProcSet [/PDF]' +
      (gsList.length ? ' /ExtGState << ' + gsRefs + ' >>' : '') + ' >> /Contents 4 0 R >>'
    objs[4] = '<< /Length ' + content.length + ' >>\nstream\n' + content + 'endstream'
    objs[5] = '<< /Title ' + pdfText(o.title || '') + ' /Producer (with icons - withicons.com) /Creator (with icons - withicons.com) >>'
    gsList.forEach(function (g, i) { objs[6 + i] = '<< /Type /ExtGState /ca ' + g[0] + ' /CA ' + g[1] + ' >>' })
    var out = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n', offs = []
    for (var n = 1; n < objs.length; n++) { offs[n] = out.length; out += n + ' 0 obj\n' + objs[n] + '\nendobj\n' }
    var xref = out.length
    out += 'xref\n0 ' + objs.length + '\n0000000000 65535 f \n'
    for (var j = 1; j < objs.length; j++) out += ('000000000' + offs[j]).slice(-10) + ' 00000 n \n'
    out += 'trailer\n<< /Size ' + objs.length + ' /Root 1 0 R /Info 5 0 R >>\nstartxref\n' + xref + '\n%%EOF\n'
    return latin1(out)
  }

  // ---------- EPS (EPSF-3.0) ----------
  // EPS has no transparency. Opaque shapes are painted as they are. A see-through shape is painted as flat colours:
  // over the background (or white) it gets its colour blended with that, and where it overlaps shapes painted before it
  // (clipped to them, including their strokes via strokepath) it gets its colour blended with theirs. Translucent
  // layers over layers therefore keep their look; only gradients of overlap deeper than a few levels are approximated.
  function itemBox(it, kind, sx, sy) {
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    it.segs.forEach(function (s) {
      for (var i = 1; i < s.length; i += 2) {
        var p = apply(it.ctm, s[i], s[i + 1])
        if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]
      }
    })
    if (kind === 's') {
      var e = it.sw * Math.max(Math.hypot(it.ctm[0], it.ctm[1]), Math.hypot(it.ctm[2], it.ctm[3])) * (it.join === 'miter' ? it.miter / 2 : 0.75) + 0.01
      x0 -= e; y0 -= e; x1 += e; y1 += e
    }
    return [x0, y0, x1, y1]
  }
  function boxAnd(a, b) { var r = [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.min(a[2], b[2]), Math.min(a[3], b[3])]; return r[0] < r[2] && r[1] < r[3] ? r : null }

  function eps(d, o) {
    o = o || {}
    var W = o.width || d.width, H = o.height || d.height, vb = d.vb
    var sx = W / vb[2], sy = H / vb[3]
    var matte = parseColor(o.background) || { r: 1, g: 1, b: 1, a: 1 }
    var over = function (c, under) { return { r: c.a * c.r + (1 - c.a) * under.r, g: c.a * c.g + (1 - c.a) * under.g, b: c.a * c.b + (1 - c.a) * under.b } }
    var title = String(o.title || '').replace(/[^\x20-\x7e]/g, '?')
    var defs = [], body = []
    d.items.forEach(function (it, i) {
      var ctm = isIdentity(it.ctm) ? '' : '[' + it.ctm.map(function (v) { return fmt(v, 6) }).join(' ') + '] concat '
      defs.push('/p' + i + ' { M0 setmatrix ' + ctm + 'newpath\n' + pathOps(it.segs, { m: 'm', l: 'l', c: 'c', h: 'h' }) + ' } bind def')
      if (it.stroke) {
        defs.push('/s' + i + ' { ' + fmt(it.sw, 4) + ' setlinewidth ' + (CAP[it.cap] || 0) + ' setlinecap ' + (JOIN[it.join] || 0) + ' setlinejoin ' +
          fmt(it.miter, 3) + ' setmiterlimit [' + it.dash.map(function (v) { return fmt(v, 4) }).join(' ') + '] ' + fmt(it.dashOffset, 4) + ' setdash } bind def')
      }
    })
    // region = { i, kind: 'f'|'s' }; clip to a region / paint a region
    var clipOps = function (r) { var it = d.items[r.i]; return 'p' + r.i + (r.kind === 's' ? ' s' + r.i + ' strokepath clip' : it.rule === 'evenodd' ? ' eoclip' : ' clip') }
    var paintOps = function (r, c) {
      var it = d.items[r.i]
      return 'p' + r.i + ' ' + rgb(c) + ' setrgbcolor ' + (r.kind === 's' ? 's' + r.i + ' stroke' : it.rule === 'evenodd' ? 'eofill' : 'fill')
    }
    var pieces = [], MAXP = 600
    d.items.forEach(function (it, i) {
      ;[['f', it.fill], ['s', it.stroke]].forEach(function (pp) {
        var kind = pp[0], c = pp[1]
        if (!c) return
        var r = { i: i, kind: kind }, box = itemBox(it, kind, sx, sy)
        if (c.a >= 0.999) {
          body.push(paintOps(r, c))
          pieces.push({ clips: [r], color: c, box: box })
          return
        }
        var base = over(c, matte), fresh = [{ clips: [r], color: base, box: box }]
        body.push(paintOps(r, base))
        pieces.forEach(function (p) {
          var b = boxAnd(box, p.box)
          if (!b) return
          var col = over(c, p.color)
          body.push('gsave ' + p.clips.map(clipOps).join(' ') + ' newpath ' + paintOps(r, col) + ' grestore')
          if (p.clips.length < 5) fresh.push({ clips: p.clips.concat([r]), color: col, box: b })
        })
        fresh.forEach(function (p) { if (pieces.length < MAXP) pieces.push(p) })
      })
    })
    var L = ['%!PS-Adobe-3.0 EPSF-3.0',
      '%%BoundingBox: 0 0 ' + Math.ceil(W) + ' ' + Math.ceil(H),
      '%%HiResBoundingBox: 0 0 ' + fmt(W, 4) + ' ' + fmt(H, 4),
      '%%Title: ' + title,
      '%%Creator: with icons - withicons.com',
      '%%LanguageLevel: 2',
      '%%Pages: 1',
      '%%DocumentData: Clean7Bit',
      '%%EndComments',
      '%%BeginProlog',
      '/WithIconsDict ' + (defs.length + 12) + ' dict def WithIconsDict begin',
      '/m /moveto load def /l /lineto load def /c /curveto load def /h /closepath load def',
      'end',
      '%%EndProlog',
      '%%Page: 1 1',
      'save WithIconsDict begin',
      '[' + [fmt(sx, 6), 0, 0, fmt(-sy, 6), fmt(-vb[0] * sx, 6), fmt(H + vb[1] * sy, 6)].join(' ') + '] concat',
      '/M0 matrix currentmatrix def']
      .concat(defs, body, ['end restore', 'showpage', '%%Trailer', '%%EOF', ''])
    // DSC: keep lines short (< 255 chars)
    return L.join('\n').split('\n').map(function (line) {
      if (line.length < 250) return line
      var parts = line.split(' '), rows = [], cur = ''
      parts.forEach(function (p) { if (cur && cur.length + p.length + 1 > 200) { rows.push(cur); cur = p } else cur = cur ? cur + ' ' + p : p })
      if (cur) rows.push(cur)
      return rows.join('\n')
    }).join('\n')
  }

  // ---------- formats ----------
  function sizeOf(o) { return Math.max(1, Math.round((o && o.size) || 512)) }
  function registerFormats(WE) {
    WE.register({
      id: 'svg-flat', label: 'SVG', ext: 'svg', mime: 'image/svg+xml', group: 'vector',
      audience: ['designers', 'presentations', 'web', 'print'], transparent: true, animated: false,
      note: 'Sharp at any size with your colours locked in. Drop it into Figma, Illustrator, Canva, Keynote or Google Slides.',
      available: function () { return true },
      run: function (ctx, opts) {
        opts = opts || {}
        var s = flatSvg(ctx, { size: sizeOf(opts), background: opts.background || null, padding: opts.padding })
        return Promise.resolve({ data: s + '\n', filename: WE.filename(ctx, null, 'svg'), mime: 'image/svg+xml' })
      }
    })
    WE.register({
      id: 'svg', label: 'SVG (themable)', ext: 'svg', mime: 'image/svg+xml', group: 'vector',
      audience: ['developers', 'web'], transparent: true, animated: false,
      note: 'For developers: keeps currentColor and the --with-* CSS variables (your colours as defaults), so CSS can recolour it.',
      available: function () { return true },
      run: function (ctx, opts) {
        opts = opts || {}
        var c = {}
        for (var k in ctx) c[k] = ctx[k]
        if (WE.stripMotion) c.inner = WE.stripMotion(ctx.inner)   // keeps the colour variables, not the motion hooks
        var s = svgWithBg(c, { flat: false, size: sizeOf(opts), background: opts.background || null, padding: opts.padding })
        return Promise.resolve({ data: s + '\n', filename: WE.filename(ctx, 'themable', 'svg'), mime: 'image/svg+xml' })
      }
    })
    WE.register({
      id: 'pdf', label: 'PDF (vector)', ext: 'pdf', mime: 'application/pdf', group: 'vector',
      audience: ['print', 'presentations', 'designers'], transparent: true, animated: false,
      note: 'A true vector PDF that prints razor sharp. Opens in Illustrator, Keynote, Word, PowerPoint and any PDF viewer.',
      available: function () { return true },
      run: function (ctx, opts) {
        opts = opts || {}
        var size = sizeOf(opts)
        var dr = drawing(flatSvg(ctx, { size: size, background: opts.background || null, padding: opts.padding }))
        var data = pdf(dr, { width: size, height: size, title: ctx.title || ctx.name })
        return Promise.resolve({ data: data, filename: WE.filename(ctx, null, 'pdf'), mime: 'application/pdf' })
      }
    })
    WE.register({
      id: 'eps', label: 'EPS', ext: 'eps', mime: 'application/postscript', group: 'vector',
      audience: ['print', 'designers'], transparent: false, animated: false,
      note: 'Vector EPS for older design and print tools that ask for it. EPS has no transparency: see-through parts are blended onto your background (or white).',
      available: function () { return true },
      run: function (ctx, opts) {
        opts = opts || {}
        var size = sizeOf(opts)
        var dr = drawing(flatSvg(ctx, { size: size, background: opts.background || null, padding: opts.padding }))
        var data = eps(dr, { width: size, height: size, title: ctx.title || ctx.name, background: opts.background })
        return Promise.resolve({ data: data, filename: WE.filename(ctx, null, 'eps'), mime: 'application/postscript' })
      }
    })
  }

  WE.vector = { __registered: true, parseXml: parseXml, serialize: serialize, findTag: findTag, flatInner: flatInner, flatSvg: flatSvg, svgWithBg: svgWithBg,
    drawing: drawing, pdf: pdf, eps: eps, parsePath: parsePath, arcToCubics: arcToCubics, flattenDash: flattenDash,
    transformSegs: transformSegs, segsToD: segsToD, parseTransform: parseTransform, mul: mul, apply: apply, fmt: fmt,
    parseColor: parseColor, hex2: hex2, escAttr: escAttr, escText: escText, latin1: latin1 }
  registerFormats(WE)
  return WE.vector
})
