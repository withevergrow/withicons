/* with icons — static raster exports: png, webp, jpg, avif, png-set (classic script + CommonJS/UMD).
 * Browser: registers itself on window.WithExport (load registry.js first).
 * Node: require('./raster.js').register(WithExport) — the formats then report available() = false (they need a canvas).
 *
 * Every format draws the flat SVG from WithExport.svgString() onto a canvas at the exact pixel size, so edges are
 * rendered by the browser's vector rasterizer at that size (never upscaled). Transparent unless opts.background
 * is set; JPG always gets a background (white by default) because JPEG has no alpha.
 */
(function (root, factory) {
  var mod = factory()
  if (typeof module === 'object' && module.exports) module.exports = mod
  else if (root.WithExport && root.WithExport.register) mod.register(root.WithExport)
  else if (root.addEventListener) root.addEventListener('DOMContentLoaded', function () { if (root.WithExport && root.WithExport.register) mod.register(root.WithExport) })
})(typeof self !== 'undefined' ? self : this, function () {
  var MAX = 8192            // largest edge we will draw (keeps every browser's canvas limits and memory sane)

  var hasDom = function () { return typeof document !== 'undefined' && typeof Image !== 'undefined' && !!document.createElement }
  var encCache = {}
  // Real feature detection: browsers that cannot encode a type silently return PNG from toDataURL.
  function canEncode(mime) {
    if (mime in encCache) return encCache[mime]
    var ok = false
    try {
      if (hasDom()) {
        var c = document.createElement('canvas'); c.width = c.height = 2
        var g = c.getContext('2d'); g.fillStyle = 'rgba(255,0,0,.5)'; g.fillRect(0, 0, 1, 1)
        ok = c.toDataURL(mime).indexOf('data:' + mime) === 0
      }
    } catch (e) { ok = false }
    return (encCache[mime] = ok)
  }

  function pxSize(opts, def) {
    var s = Number(opts && opts.size) || def, k = Number(opts && opts.scale) || 1
    return Math.max(1, Math.min(MAX, Math.round(s * k)))
  }
  function quality(opts, def) {
    var q = opts && opts.quality
    if (q == null || q === '' || isNaN(q)) return def
    q = Number(q); if (q > 1) q = q / 100
    return Math.max(0, Math.min(1, q))
  }
  function blobOf(canvas, mime, q) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (b) {
        if (!b) return reject(new Error('This browser could not encode a ' + canvas.width + 'px ' + mime + ' (try a smaller size).'))
        if (b.type && b.type !== mime) return reject(new Error('This browser cannot save ' + mime + '.'))
        resolve(b)
      }, mime, q)
    })
  }
  function loadSvg(svg) {
    return new Promise(function (resolve, reject) {
      var img = new Image()
      img.decoding = 'sync'
      img.onload = function () { resolve(img) }
      img.onerror = function () { reject(new Error('Could not draw this icon (SVG failed to load).')) }
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
    })
  }

  return {
    canEncode: canEncode,
    register: function (WE) {
      // The icon as a canvas of px x px. The background (if any) is painted on the canvas itself so the edges are
      // fully opaque (no anti-aliased seam where a background <rect> meets the canvas edge).
      function draw(ctx, opts, px, background) {
        var svg = WE.svgString(ctx, { size: px, flat: true, padding: opts && opts.padding })
        return loadSvg(svg).then(function (img) {
          var c = document.createElement('canvas'); c.width = c.height = px
          var g = c.getContext('2d')
          if (background) { g.fillStyle = background; g.fillRect(0, 0, px, px) }
          g.drawImage(img, 0, 0, px, px)
          return c
        })
      }
      function still(id, mime, ext, defQ, needsBg) {
        return function (ctx, opts) {
          opts = opts || {}
          var px = pxSize(opts, 512)
          var bg = opts.background || (needsBg ? '#ffffff' : null)
          return draw(ctx, opts, px, bg).then(function (c) { return blobOf(c, mime, defQ == null ? undefined : quality(opts, defQ)) })
            .then(function (b) { return { data: b, filename: WE.filename(ctx, String(px), ext), mime: mime } })
        }
      }

      WE.register({
        id: 'png', label: 'PNG', ext: 'png', mime: 'image/png', group: 'image',
        audience: ['designers', 'developers', 'presentations', 'web'], transparent: true, animated: false,
        note: 'The safe choice for slides, docs, chat and design tools: sharp at any size you pick, with a see-through background.',
        available: function () { return hasDom() },
        run: still('png', 'image/png', 'png', null, false),
      })
      WE.register({
        id: 'webp', label: 'WebP', ext: 'webp', mime: 'image/webp', group: 'image',
        audience: ['web', 'developers'], transparent: true, animated: false,
        note: 'For websites: like PNG with a see-through background, but a smaller file that loads faster.',
        available: function () { return canEncode('image/webp') },
        // quality 1 = lossless in Chromium (crisp icon edges); lower values trade detail for size
        run: still('webp', 'image/webp', 'webp', 1, false),
      })
      WE.register({
        id: 'jpg', label: 'JPG', ext: 'jpg', mime: 'image/jpeg', group: 'image',
        audience: ['presentations', 'print'], transparent: false, animated: false,
        note: 'For places that refuse PNG (some forms, email tools, older software). No transparency: sits on a solid colour, white unless you pick one.',
        available: function () { return canEncode('image/jpeg') },
        run: still('jpg', 'image/jpeg', 'jpg', 0.95, true),
      })
      WE.register({
        id: 'avif', label: 'AVIF', ext: 'avif', mime: 'image/avif', group: 'image',
        audience: ['web', 'developers'], transparent: true, animated: false,
        note: 'The smallest modern web image with a see-through background. Only offered where your browser can create it.',
        available: function () { return canEncode('image/avif') },
        run: still('avif', 'image/avif', 'avif', 0.85, false),
      })

      var SCALES = [1, 2, 3, 4]
      function readme(ctx, base, names, bg) {
        var t = (ctx.title || ctx.name) + ' (' + ctx.style + ' style) - PNG set from with icons (withicons.com)'
        var line = function (n, s) { return '  ' + n + new Array(Math.max(2, 34 - n.length)).join(' ') + (base * s) + ' x ' + (base * s) + ' px  (@' + s + 'x)' }
        return [t, new Array(t.length + 1).join('='), '',
          'The same icon at ' + base + ' px drawn at 1x, 2x, 3x and 4x, each rendered sharp at its own size (not scaled up).',
          bg ? 'Background: solid ' + bg + '.' : 'Background: transparent.', '',
          'Files', '-----']
          .concat(names.map(function (n, i) { return line(n, SCALES[i]) }))
          .concat(['',
            'Which one do I use?', '-------------------',
            '* iOS / macOS (Xcode): drag all of the @1x, @2x and @3x files into one Image Set in your asset catalog.',
            '  Xcode matches them by the @2x / @3x suffix. Use the image at ' + base + ' x ' + base + ' points.',
            '* Android: drawable-mdpi = @1x, drawable-xhdpi = @2x, drawable-xxhdpi = @3x, drawable-xxxhdpi = @4x',
            '  (rename each to the same file name, e.g. ic_' + String(ctx.name).replace(/-/g, '_') + '.png). Android scales for hdpi.',
            '  Tip: for Android, a Vector Drawable (the "Android XML" download) is usually better than PNGs.',
            '* Websites: use @1x as src and the others in srcset so high-density screens stay crisp:',
            '  <img src="' + names[0] + '" srcset="' + names[1] + ' 2x, ' + names[2] + ' 3x" width="' + base + '" height="' + base + '" alt="' + String(ctx.title || ctx.name).replace(/"/g, '') + '">',
            '  (An SVG is even better on the web: one small file, sharp at every size.)',
            '* Slides, docs, email, chat: use @2x (or @4x for large on-screen use and printing), then resize it down in the app.',
            '* Design tools (Figma, Sketch, Canva): prefer the SVG download; use @4x if the tool only takes images.',
            '',
            'License: see https://withicons.com/license.html', ''])
          .join('\r\n')
      }
      WE.register({
        id: 'png-set', label: 'PNG set (@1x-@4x)', ext: 'zip', mime: 'application/zip', group: 'image',
        audience: ['mobile', 'developers', 'designers'], transparent: true, animated: false,
        note: 'For apps and retina screens: one ZIP with the icon at 1x, 2x, 3x and 4x plus a README on which file goes where (iOS, Android, web, slides).',
        available: function () { return hasDom() },
        run: function (ctx, opts) {
          opts = opts || {}
          // base = the size it is used at (points / dp / CSS px): default 24, capped so @4x stays drawable
          var base = Math.max(1, Math.min(Math.floor(MAX / 4), Math.round(Number(opts.size) || 24)))
          var bg = opts.background || null
          var stem = WE.filename(ctx, null, 'png').replace(/\.png$/, '')
          var names = SCALES.map(function (s) { return stem + (s === 1 ? '' : '@' + s + 'x') + '.png' })
          return SCALES.reduce(function (p, s, i) {
            return p.then(function (files) {
              return draw(ctx, opts, base * s, bg).then(function (c) { return blobOf(c, 'image/png') })
                .then(function (b) { return b.arrayBuffer() })
                .then(function (ab) { files.push({ name: names[i], data: new Uint8Array(ab) }); return files })
            })
          }, Promise.resolve([])).then(function (files) {
            files.push({ name: 'README.txt', data: readme(ctx, base, names, bg) })
            return { data: new Blob([WE.zip(files)], { type: 'application/zip' }), filename: WE.filename(ctx, base + 'px-set', 'zip'), mime: 'application/zip' }
          })
        },
      })
    },
  }
})
