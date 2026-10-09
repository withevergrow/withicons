/* with icons — app icon export formats: ICO, favicon pack (ZIP), Android VectorDrawable, iOS Xcode imageset (ZIP).
 * UMD: classic script in browsers (load after registry.js and vector.js; registers on window.WithExport), require() in
 * Node (module.exports is register(WithExport); it loads vector.js itself). Dependency-free.
 * PNG rendering (ICO, favicon pack) uses the browser canvas. In Node, set WithExport.renderPng = (svg, w, h) =>
 * Promise<Uint8Array> (PNG bytes) to enable those two formats; otherwise they report available() = false.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    var reg = function (WE) { if (!WE.vector) require('./vector.js')(WE); return factory(WE) }
    module.exports = reg; module.exports.register = reg
  } else if (root.WithExport) factory(root.WithExport)
})(typeof self !== 'undefined' ? self : this, function (WE) {
  var V = function () {
    if (!WE.vector) throw new Error('with icons export: load vector.js before app.js')
    return WE.vector
  }

  // ---------- PNG bytes ----------
  function canRaster() {
    if (typeof WE.renderPng === 'function') return true
    try {
      return typeof document !== 'undefined' && typeof Image !== 'undefined' && typeof document.createElement('canvas').toBlob === 'function'
    } catch (e) { return false }
  }
  function pngBytes(svg, w, h) {
    if (typeof WE.renderPng === 'function') return Promise.resolve(WE.renderPng(svg, w, h || w)).then(function (b) { return new Uint8Array(b) })
    return WE.rasterize(svg, w, h || w)
      .then(function (c) { return WE.canvasBlob(c, 'image/png') })
      .then(function (b) {
        if (!b) throw new Error('PNG encoding failed')
        return b.arrayBuffer ? b.arrayBuffer() : new Response(b).arrayBuffer()
      })
      .then(function (ab) { return new Uint8Array(ab) })
  }
  function pngOf(ctx, size, background, padding) {
    return pngBytes(V().flatSvg(ctx, { size: size, background: background || null, padding: padding }), size, size)
  }

  // ---------- ICO (PNG-compressed entries, Windows Vista+ and every browser) ----------
  function ico(images) { // [{ size, png: Uint8Array }]
    var head = 6 + 16 * images.length, total = head
    images.forEach(function (im) { total += im.png.length })
    var out = new Uint8Array(total), dv = new DataView(out.buffer), off = head
    dv.setUint16(0, 0, true); dv.setUint16(2, 1, true); dv.setUint16(4, images.length, true)
    images.forEach(function (im, i) {
      var e = 6 + 16 * i
      out[e] = im.size >= 256 ? 0 : im.size; out[e + 1] = im.size >= 256 ? 0 : im.size
      out[e + 2] = 0; out[e + 3] = 0
      dv.setUint16(e + 4, 1, true); dv.setUint16(e + 6, 32, true)
      dv.setUint32(e + 8, im.png.length, true); dv.setUint32(e + 12, off, true)
      out.set(im.png, off); off += im.png.length
    })
    return out
  }
  function icoOf(ctx, sizes, background, padding) {
    return Promise.all(sizes.map(function (s) { return pngOf(ctx, s, background, padding).then(function (png) { return { size: s, png: png } }) }))
      .then(ico)
  }

  // ---------- Android VectorDrawable ----------
  function argb(c) { var h = V().hex2; return '#' + (c.a < 0.9995 ? h(c.a) : '') + h(c.r) + h(c.g) + h(c.b) }
  // a gradient paint (rich styles) as an inline <aapt:attr> <gradient> (Android 7.0+, API 24). VectorDrawable gradients
  // have no transform: the end points (linear) or the centre and radius (radial) are mapped through it, exact for the
  // translate + uniform scale the icons use.
  function gradientXml(gr, m, attr) {
    var v = V(), f = function (n) { return v.fmt(n, 3) }
    var t = v.mul(m, gr.m), sc = Math.sqrt(Math.abs(t[0] * t[3] - t[1] * t[2])) || 1
    var P = function (x, y) { return v.apply(t, x, y) }
    var g = '        <gradient'
    if (gr.radial) {
      var c = P(gr.coords[3], gr.coords[4])
      g += ' android:type="radial" android:centerX="' + f(c[0]) + '" android:centerY="' + f(c[1]) + '" android:gradientRadius="' + f(Math.max(0.001, gr.coords[5] * sc)) + '"'
    } else {
      var a = P(gr.coords[0], gr.coords[1]), b = P(gr.coords[2], gr.coords[3])
      g += ' android:type="linear" android:startX="' + f(a[0]) + '" android:startY="' + f(a[1]) + '" android:endX="' + f(b[0]) + '" android:endY="' + f(b[1]) + '"'
    }
    g += ' android:tileMode="clamp">\n'
    gr.stops.forEach(function (s) { g += '          <item android:offset="' + f(s.o) + '" android:color="' + argb({ r: s.r, g: s.g, b: s.b, a: s.a * gr.k }) + '" />\n' })
    return '      <aapt:attr name="android:' + attr + '">\n' + g + '        </gradient>\n      </aapt:attr>\n'
  }
  function vectorDrawable(ctx, opts) {
    var v = V(), f = function (n) { return v.fmt(n, 3) }
    var d = v.drawing(v.flatSvg(ctx, { size: 24, background: opts.background || null, padding: opts.padding }))
    var vb = d.vb, shift = [1, 0, 0, 1, -vb[0], -vb[1]]
    var dp = Math.max(1, Math.round(opts.dp || 24))
    var paths = [], aapt = false
    d.items.forEach(function (it) {
      var m = v.mul(shift, it.ctm), scale = Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2])) || 1
      var segs = v.transformSegs(it.segs, m)
      var attrs = []
      if (it.fill) {
        attrs.push(['pathData', v.segsToD(segs, f)])
        if (it.fill.grad) { attrs.kids = (attrs.kids || '') + gradientXml(it.fill.grad, m, 'fillColor'); aapt = true }
        else attrs.push(['fillColor', argb(it.fill)])
        if (it.rule === 'evenodd') attrs.push(['fillType', 'evenOdd'])
        paths.push(attrs)
      }
      if (it.stroke) {
        var sd = it.dash.length ? v.flattenDash(segs, it.dash.map(function (x) { return x * scale }), it.dashOffset * scale) : segs
        if (!sd.length) return
        var sa = [['pathData', v.segsToD(sd, f)], ['strokeColor', argb(it.stroke)], ['strokeWidth', f(it.sw * scale)]]
        if (it.stroke.grad) { sa.splice(1, 1); sa.kids = gradientXml(it.stroke.grad, m, 'strokeColor'); aapt = true }
        if (it.cap !== 'butt') sa.push(['strokeLineCap', it.cap === 'square' ? 'square' : 'round'])
        if (it.join !== 'miter' && it.join !== 'miter-clip' && it.join !== 'arcs') sa.push(['strokeLineJoin', it.join === 'bevel' ? 'bevel' : 'round'])
        else if (it.miter !== 4) sa.push(['strokeMiterLimit', f(it.miter)])
        // Fill and stroke in one <path> when they share geometry (VectorDrawable paints fill, then stroke: like SVG).
        if (it.fill && sd === segs) { var last = paths[paths.length - 1]; sa.slice(1).forEach(function (a) { last.push(a) }); if (sa.kids) last.kids = (last.kids || '') + sa.kids }
        else paths.push(sa)
      }
    })
    var esc = v.escAttr
    var x = '<?xml version="1.0" encoding="utf-8"?>\n' +
      '<!-- ' + String(ctx.title || ctx.name).replace(/--/g, '-') + ' (' + ctx.style + ') from with icons, withicons.com -->\n' +
      '<vector xmlns:android="http://schemas.android.com/apk/res/android"\n' + (aapt ? '    xmlns:aapt="http://schemas.android.com/aapt"\n' : '') +
      '    android:width="' + dp + 'dp"\n    android:height="' + dp + 'dp"\n' +
      '    android:viewportWidth="' + f(vb[2]) + '"\n    android:viewportHeight="' + f(vb[3]) + '">\n'
    paths.forEach(function (p) {
      x += '  <path\n' + p.map(function (a) { return '      android:' + a[0] + '="' + esc(a[1]) + '"' }).join('\n') + (p.kids ? '>\n' + p.kids + '  </path>\n' : ' />\n')
    })
    return x + '</vector>\n'
  }
  function resName(ctx) { return 'ic_' + WE.filename(ctx, null, 'xml').replace(/\.xml$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') }

  // ---------- iOS asset catalog ----------
  function isSingleColour(d) {
    var seen = {}
    d.items.forEach(function (it) {
      ;[it.fill, it.stroke].forEach(function (c) { if (c) seen[[c.r, c.g, c.b].map(function (n) { return Math.round(n * 255) }).join(',')] = 1 })
    })
    return Object.keys(seen).length <= 1
  }

  var ZIP = 'application/zip'
  WE.register({
    id: 'ico', label: 'ICO', ext: 'ico', mime: 'image/x-icon', group: 'app',
    audience: ['web', 'developers'], transparent: true, animated: false,
    note: 'Windows and browser icon file with 16, 32, 48, 64 and 256 px inside. Use it as favicon.ico or a desktop shortcut icon.',
    available: canRaster,
    run: function (ctx, opts) {
      opts = opts || {}
      return icoOf(ctx, [16, 32, 48, 64, 256], opts.background, opts.padding).then(function (data) {
        return { data: data, filename: WE.filename(ctx, null, 'ico'), mime: 'image/x-icon' }
      })
    }
  })

  WE.register({
    id: 'favicon-pack', label: 'Favicon pack', ext: 'zip', mime: ZIP, group: 'app',
    audience: ['web', 'developers'], transparent: true, animated: false,
    note: 'Everything a website needs: favicon.ico, favicon.svg, Apple touch icon, Android/PWA icons, site.webmanifest and the <link> tags to paste.',
    available: canRaster,
    run: function (ctx, opts) {
      opts = opts || {}
      var v = V(), bg = opts.background || null, pad = opts.padding || 0
      var solid = bg || '#FFFFFF' // iOS shows transparent touch icons on black, and maskable icons need a full-bleed fill
      var touchPad = Math.max(pad, 0.1), maskPad = Math.max(pad, 0.2) // maskable: keep the icon inside the 80% safe circle
      var title = String(ctx.title || ctx.name)
      var manifest = {
        name: title, short_name: title.length > 12 ? title.slice(0, 12) : title,
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ],
        theme_color: solid, background_color: solid, display: 'standalone'
      }
      var readme = [
        'Favicon pack: ' + title + ' (' + ctx.style + ') from with icons, https://withicons.com',
        '',
        'Put these files at the root of your site and paste this into <head>:',
        '',
        '  <link rel="icon" href="/favicon.ico" sizes="32x32">',
        '  <link rel="icon" href="/favicon.svg" type="image/svg+xml">',
        '  <link rel="apple-touch-icon" href="/apple-touch-icon.png">',
        '  <link rel="manifest" href="/site.webmanifest">',
        '  <meta name="theme-color" content="' + solid + '">',
        '',
        'Files',
        '  favicon.ico            16, 32 and 48 px, for older browsers and tools that only look for /favicon.ico',
        '  favicon.svg            sharp at every size in modern browsers',
        '  apple-touch-icon.png   180 x 180, iPhone and iPad home screen (solid background: iOS does not do transparency here)',
        '  icon-192.png           Android and installed web apps (PWA)',
        '  icon-512.png           PWA splash screens and install prompts',
        '  icon-maskable-512.png  Android adaptive icon (solid background, icon kept inside the safe zone)',
        '  site.webmanifest       web app manifest that lists the PNG icons',
        ''
      ].join('\n')
      return Promise.all([
        icoOf(ctx, [16, 32, 48], bg, pad),
        pngOf(ctx, 180, solid, touchPad),
        pngOf(ctx, 192, bg, pad),
        pngOf(ctx, 512, bg, pad),
        pngOf(ctx, 512, solid, maskPad)
      ]).then(function (r) {
        var data = WE.zip([
          { name: 'favicon.ico', data: r[0] },
          { name: 'favicon.svg', data: v.flatSvg(ctx, { size: 32, background: bg, padding: pad }) + '\n' },
          { name: 'apple-touch-icon.png', data: r[1] },
          { name: 'icon-192.png', data: r[2] },
          { name: 'icon-512.png', data: r[3] },
          { name: 'icon-maskable-512.png', data: r[4] },
          { name: 'site.webmanifest', data: JSON.stringify(manifest, null, 2) + '\n' },
          { name: 'README.txt', data: readme }
        ])
        return { data: data, filename: WE.filename(ctx, 'favicons', 'zip'), mime: ZIP }
      })
    }
  })

  WE.register({
    id: 'android', label: 'Android (VectorDrawable)', ext: 'xml', mime: 'application/xml', group: 'app',
    audience: ['mobile', 'developers'], transparent: true, animated: false,
    note: 'Vector drawable XML for Android Studio: drop it into res/drawable. Sharp on every screen density, no PNGs needed.',
    available: function () { return true },
    run: function (ctx, opts) {
      opts = opts || {}
      return Promise.resolve({ data: vectorDrawable(ctx, opts), filename: resName(ctx) + '.xml', mime: 'application/xml' })
    }
  })

  WE.register({
    id: 'ios', label: 'iOS (Xcode imageset)', ext: 'zip', mime: ZIP, group: 'app',
    audience: ['mobile', 'developers'], transparent: true, animated: false,
    note: 'Drag the .imageset folder into Assets.xcassets in Xcode: a vector PDF that stays sharp on every iPhone and iPad. One-colour icons tint like SF Symbols.',
    available: function () { return true },
    run: function (ctx, opts) {
      opts = opts || {}
      var v = V(), pt = Math.max(1, opts.points || 24)
      var d = v.drawing(v.flatSvg(ctx, { size: pt, background: opts.background || null, padding: opts.padding }))
      var asset = WE.filename(ctx, null, 'x').replace(/\.x$/, '')
      var pdfName = asset + '.pdf'
      var template = !opts.background && isSingleColour(d)
      var contents = {
        images: [{ filename: pdfName, idiom: 'universal' }],
        info: { author: 'xcode', version: 1 },
        properties: { 'preserves-vector-representation': true, 'template-rendering-intent': template ? 'template' : 'original' }
      }
      var data = WE.zip([
        { name: asset + '.imageset/Contents.json', data: JSON.stringify(contents, null, 2) + '\n' },
        { name: asset + '.imageset/' + pdfName, data: v.pdf(d, { width: pt, height: pt, title: ctx.title || ctx.name }) }
      ])
      return Promise.resolve({ data: data, filename: WE.filename(ctx, 'imageset', 'zip'), mime: ZIP })
    }
  })

  return { ico: ico, vectorDrawable: vectorDrawable }
})
