/* with icons — export registry (classic script + CommonJS/UMD, works in browsers and Node).
 * Format modules in site/js/export/*.js call WithExport.register({...}). The editor lists WithExport.list().
 *
 * Format descriptor:
 *   { id, label, ext, mime,
 *     group: 'image' | 'animated' | 'vector' | 'office' | 'code' | 'app',
 *     audience: ['designers'|'developers'|'presentations'|'web'|'print'|'mobile'],
 *     transparent: true | false | '1-bit',   // can the background be transparent?
 *     animated: bool,                         // uses ctx.motion
 *     note: 'plain-language one-liner: what it is best for',
 *     available(): bool,                      // feature detection (e.g. WebP encoding, MediaRecorder codecs)
 *     run(ctx, opts): Promise<{ data: Blob|Uint8Array|string, filename, mime }> }
 *
 * ctx (built by the editor):
 *   { name, title, style, inner,        // the icon's inner SVG markup in this style (may contain var(--with-*, #hex) and currentColor)
 *     root,                             // style root attributes { fill, stroke, 'stroke-width', ... } for the <svg>
 *     color,                            // ink colour (hex) that currentColor resolves to
 *     vars,                             // { '--with-retro-1': '#hex', ... } chosen colours (may be empty)
 *     motion,                           // null or { preset, origin:[x,y], dir, amount, duration, steps, trigger:'loop'|'hover'|'once', swapTo?, effect? }
 *     motionSpec }                      // the icon's full spec from window.WITH_MOTION (may be null)
 * opts: { size (px, default 512), scale, background: null (transparent) | '#hex', fps, seconds, quality, padding (0-0.4 of size) }
 */
(function (root, factory) {
  var api = factory()
  if (typeof module === 'object' && module.exports) module.exports = api
  else root.WithExport = Object.assign(root.WithExport || {}, api)
})(typeof self !== 'undefined' ? self : this, function () {
  var formats = []

  function register(f) {
    if (!f || !f.id || typeof f.run !== 'function') throw new Error('WithExport.register: needs id and run()')
    var i = formats.findIndex(function (x) { return x.id === f.id })
    if (i >= 0) formats[i] = f; else formats.push(f)
    return f
  }
  function list(filter) {
    return formats.filter(function (f) {
      var ok = true
      try { ok = !f.available || f.available() } catch (e) { ok = false }
      return ok && (!filter || filter(f))
    })
  }
  function get(id) { return formats.find(function (f) { return f.id === id }) || null }

  var esc = function (v) { return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;') }

  // Walk every var(...) with balanced parentheses: fn(name, fallbackText|null) -> replacement text.
  function mapVars(s, fn) {
    var out = '', i = 0
    while (true) {
      var j = s.indexOf('var(', i)
      if (j < 0) return out + s.slice(i)
      var depth = 0, k = j + 3
      for (; k < s.length; k++) { if (s[k] === '(') depth++; else if (s[k] === ')' && --depth === 0) break }
      var body = s.slice(j + 4, k), comma = body.indexOf(',')
      var name = (comma < 0 ? body : body.slice(0, comma)).trim(), fb = comma < 0 ? null : body.slice(comma + 1).trim()
      out += s.slice(i, j) + fn(name, fb)
      i = k + 1
    }
  }
  // Resolve var(--with-x, d) to vars[x] or its (recursively resolved) fallback; var(--x) without fallback -> currentColor.
  function bakeVars(s, vars) {
    vars = vars || {}
    return mapVars(String(s), function (name, fb) { return vars[name] || (fb === null ? 'currentColor' : bakeVars(fb, vars)) })
  }
  // Keep variables but make the chosen colours their defaults: var(--with-x, <anything>) -> var(--with-x, #chosen)
  function defaultVars(s, vars) {
    vars = vars || {}
    return mapVars(String(s), function (name, fb) { return 'var(' + name + ', ' + (vars[name] || (fb === null ? 'currentColor' : bakeVars(fb, {}))) + ')' })
  }

  // Standalone SVG string for this icon.
  //   flat: true  -> colours baked (vars + currentColor resolved): works in Figma, slides, <img>, rasterizers
  //   flat: false -> keeps var(--with-*) with the chosen colours as defaults and currentColor (for re-theming in code)
  function svgString(ctx, o) {
    o = o || {}
    var size = o.size || 24, pad = Math.max(0, Math.min(0.4, o.padding || 0))
    var vb = pad ? [-24 * pad, -24 * pad, 24 * (1 + 2 * pad), 24 * (1 + 2 * pad)].map(function (n) { return Math.round(n * 1000) / 1000 }).join(' ') : '0 0 24 24'
    var a = { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: vb }
    var r = ctx.root || {}
    for (var k in r) a[k] = r[k]
    var inner = String(ctx.inner || '')
    var flat = o.flat !== false
    if (flat) {
      inner = bakeVars(inner, ctx.vars)
      for (var k2 in a) a[k2] = bakeVars(String(a[k2]), ctx.vars)
      var ink = ctx.color || '#000000'
      inner = inner.replace(/currentColor/g, ink)
      for (var k3 in a) a[k3] = String(a[k3]).replace(/currentColor/g, ink)
    } else {
      inner = defaultVars(inner, ctx.vars)
      if (ctx.color) a.color = ctx.color
    }
    var bg = o.background ? '<rect x="' + vb.split(' ')[0] + '" y="' + vb.split(' ')[1] + '" width="' + vb.split(' ')[2] + '" height="' + vb.split(' ')[3] + '" fill="' + esc(o.background) + '" stroke="none"/>' : ''
    var s = '<svg'
    for (var k4 in a) s += ' ' + k4 + '="' + esc(a[k4]) + '"'
    return s + '>' + (ctx.title ? '<title>' + esc(ctx.title) + '</title>' : '') + bg + inner + '</svg>'
  }

  // Browser only: draw an SVG string onto a canvas of w x h (transparent unless the SVG has a background rect).
  function rasterize(svg, w, h) {
    return new Promise(function (resolve, reject) {
      var img = new Image()
      img.decoding = 'async'
      img.onload = function () {
        var c = document.createElement('canvas'); c.width = w; c.height = h || w
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
        resolve(c)
      }
      img.onerror = function () { reject(new Error('could not rasterize SVG')) }
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
    })
  }
  function canvasBlob(canvas, mime, quality) {
    return new Promise(function (resolve) { canvas.toBlob(function (b) { resolve(b) }, mime, quality) })
  }

  // ---- bytes, CRC32, ZIP (STORE, no compression) ----
  function utf8(s) {
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(s)
    return Uint8Array.from(Buffer.from(s, 'utf8'))
  }
  var CRC = (function () { var t = new Uint32Array(256); for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0 } return t })()
  function crc32(bytes, start) { var c = start === undefined ? 0xFFFFFFFF : start; for (var i = 0; i < bytes.length; i++) c = CRC[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0 }
  // files: [{ name, data: Uint8Array|string }] -> Uint8Array (deterministic: fixed 1980-01-01 timestamps)
  function zip(files) {
    var parts = [], central = [], offset = 0
    var u16 = function (v) { return [v & 255, (v >>> 8) & 255] }
    var u32 = function (v) { return [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255] }
    files.forEach(function (f) {
      var name = utf8(f.name), data = typeof f.data === 'string' ? utf8(f.data) : f.data, crc = crc32(data)
      var head = [].concat(u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0x21), u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0))
      parts.push(Uint8Array.from(head), name, data)
      central.push([].concat(u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0x21), u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset)), name)
      offset += head.length + name.length + data.length
    })
    var cdStart = offset, cdSize = 0
    central.forEach(function (c, i) { var b = i % 2 === 0 ? Uint8Array.from(c) : c; parts.push(b); cdSize += b.length })
    parts.push(Uint8Array.from([].concat(u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length), u32(cdSize), u32(cdStart), u16(0))))
    var total = parts.reduce(function (n, p) { return n + p.length }, 0), out = new Uint8Array(total), at = 0
    parts.forEach(function (p) { out.set(p, at); at += p.length })
    return out
  }

  // Browser only: save data as a file.
  function download(data, filename, mime) {
    var blob = data instanceof Blob ? data : new Blob([data], { type: mime || 'application/octet-stream' })
    var url = URL.createObjectURL(blob), a = document.createElement('a')
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove()
    setTimeout(function () { URL.revokeObjectURL(url) }, 4000)
  }
  // The icon data tags parts for @withicons/motion (class="wm-a", wm-k, wm-s, wm-deco, wm-shadow, wm-shine). They only
  // mean something next to the page's motion CSS, so files (svg, svg-flat, the SVG inside PDF, PowerPoint, Word, data
  // URIs) leave them out; inline code (components, HTML, animated SVG) keeps them.
  function stripMotion(s) {
    return String(s).replace(/\sclass="([^"]*)"/g, function (all, v) {
      var keep = v.split(/\s+/).filter(function (t) { return t && !/^wm(?:-|$)/.test(t) })
      return keep.length ? ' class="' + keep.join(' ') + '"' : ''
    })
  }
  function filename(ctx, suffix, ext) {
    return [ctx.name, ctx.style].concat(suffix ? [suffix] : []).join('-') + '.' + ext
  }

  return { register: register, list: list, get: get, formats: formats, bakeVars: bakeVars, defaultVars: defaultVars, mapVars: mapVars, svgString: svgString, rasterize: rasterize,
    canvasBlob: canvasBlob, utf8: utf8, crc32: crc32, zip: zip, download: download, filename: filename, stripMotion: stripMotion }
})
