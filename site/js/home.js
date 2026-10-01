/* with icons — home page. Needs js/site.js (window.WI) and js/home-icons.js (window.WITH_HOME). */
(function () {
  'use strict'
  var W = window, doc = document
  function boot() {
    var WI = W.WI
    var P = W.WITH_HOME
    if (!WI || !P) return
    var $ = WI.$, $$ = WI.$$, esc = WI.esc
    var ORDER = WI.ORDER
    var INFO = WI.styleInfo
    var reduced = WI.reduced

    /* render from the home pack, falling back to the full style files when loaded */
    function ic(name, style, size, opts) {
      var inner = P.svg[style] && P.svg[style][name]
      if (inner != null) return WI.svgFrom(inner, style, size || 24, opts)
      return WI.svg(name, style, size || 24, opts) || ''
    }
    function hasIc(name, style) { return !!((P.svg[style] && P.svg[style][name] != null) || WI.has(name, style)) }
    function fileFor(name, style, color) {
      var s = ic(name, style, 24, {})
      if (!s) return ''
      s = s.replace(' aria-hidden="true" focusable="false"', '')
      var c = color || 'currentColor'
      return s.replace(/var\(--(?:eg|with)-(?:duo|accent),\s*currentColor\)/g, c).replace(/currentColor/g, c)
    }
    function loop(el, fn, every) {
      // run fn every `every` ms while el is visible and the tab is visible
      var t = 0, on = false
      WI.visibility(el, function (v) {
        if (v && !on) { on = true; t = setInterval(fn, every) }
        else if (!v && on) { on = false; clearInterval(t) }
      })
    }

    /* ───────── hero inline icons ───────── */
    var htIcons = $$('[data-ht-icon]')
    htIcons.forEach(function (el) {
      var styles = el.getAttribute('data-ht-styles').split(',')
      el._k = 0
      el.innerHTML = ic(el.getAttribute('data-ht-icon'), styles[0], 24)
    })
    if (!reduced && htIcons.length) {
      var htI = 0
      loop($('.hero-title'), function () {
        var el = htIcons[htI % htIcons.length]; htI++
        var styles = el.getAttribute('data-ht-styles').split(',')
        el._k = (el._k + 1) % styles.length
        var s = styles[el._k]
        ORDER.forEach(function (o) { el.classList.remove('s-' + o) })
        el.classList.add('s-' + s)
        el.innerHTML = ic(el.getAttribute('data-ht-icon'), s, 24, { 'class': 'is-new' })
      }, 1500)
    }

    /* ───────── stage: one icon, seven styles ───────── */
    var stage = $('[data-stage]')
    var ST = null
    if (stage) {
      var art = $('[data-stage-art]', stage), scan = $('.stage-scan', stage), card = $('.stage-card', stage)
      var nameEl = $('[data-stage-name]', stage), nEl = $('[data-stage-n]', stage), styleEl = $('[data-stage-style]', stage), plainEl = $('[data-stage-plain]', stage)
      var cap = $('.stage-cap', stage), dotsWrap = $('[data-stage-dots]', stage)
      var HOLD = 2100
      ST = { icon: P.stage[0], si: 0, ii: 0, timer: 0, playing: false, visible: false, pausedUntil: 0 }
      dotsWrap.innerHTML = ORDER.map(function (s, i) {
        return '<button type="button" class="stage-dot" style="--dot: var(--c-' + s + ')" data-i="' + i + '" aria-pressed="false" aria-label="' + INFO[s].title + '"></button>'
      }).join('')
      var dots = $$('.stage-dot', dotsWrap)
      stage.style.setProperty('--hold', HOLD + 'ms')
      var paint = function (style, first) {
        ORDER.forEach(function (o) { stage.classList.remove('s-' + o) })
        stage.classList.add('s-' + style)
        nameEl.textContent = ST.icon
        nEl.textContent = String(ORDER.indexOf(style) + 1)
        styleEl.textContent = INFO[style].title
        plainEl.textContent = INFO[style].plain
        if (!first) { cap.classList.remove('is-swap'); void cap.offsetWidth; cap.classList.add('is-swap') }
        dots.forEach(function (d, i) {
          var k = ORDER.indexOf(style)
          d.setAttribute('aria-pressed', i === k ? 'true' : 'false')
          d.classList.toggle('is-done', i < k)
          if (i === k) { d.style.animation = 'none'; void d.offsetWidth; d.style.animation = '' }
        })
      }
      var show = function (style, mode) {
        var svg = ic(ST.icon, style, 24)
        if (!svg) return false
        var layer = doc.createElement('div')
        layer.className = 'stage-layer' + (reduced ? '' : mode === 'new' ? ' is-pop' : ' is-wipe')
        layer.innerHTML = svg
        var old = $$('.stage-layer', art)
        art.appendChild(layer)
        if (reduced || mode === 'new') old.forEach(function (o) { o.remove() })
        else {
          scan.style.setProperty('--scan-to', (card.offsetWidth * 0.86) + 'px')
          scan.classList.remove('is-run'); void scan.offsetWidth; scan.classList.add('is-run')
          setTimeout(function () { old.forEach(function (o) { o.remove() }) }, 820)
        }
        paint(style, mode === 'first')
        return true
      }
      var next = function () {
        var k = ORDER.indexOf(ORDER[ST.si])
        var tries = 0
        do {
          k++
          if (k >= ORDER.length) {
            k = 0
            if (!ST.locked) { ST.ii = (ST.ii + 1) % P.stage.length; ST.icon = P.stage[ST.ii] }
          }
          tries++
        } while (!hasIc(ST.icon, ORDER[k]) && tries < 14)
        ST.si = k
        show(ORDER[k], k === 0 && !ST.locked ? 'new' : 'wipe')
      }
      var schedule = function () {
        clearTimeout(ST.timer)
        if (!ST.playing) return
        var wait = Math.max(HOLD, ST.pausedUntil - Date.now())
        ST.timer = setTimeout(function () { next(); schedule() }, wait)
      }
      var play = function (v) {
        ST.playing = v && !reduced
        stage.classList.toggle('is-paused', !ST.playing)
        if (ST.playing) schedule(); else clearTimeout(ST.timer)
      }
      ST.setIcon = function (name) {
        if (!name || name === ST.icon) return
        ST.want = name
        WI.loadStyle('line').then(function () {
          if (ST.want !== name) return
          ST.icon = name; ST.locked = true; ST.si = 0
          show('line', 'new')
          // pull the other styles in so the search result can morph too
          WI.loadAllStyles()
          schedule()
        })
      }
      ST.release = function () { ST.locked = false }
      dotsWrap.addEventListener('click', function (e) {
        var d = e.target.closest('.stage-dot'); if (!d) return
        var k = +d.getAttribute('data-i')
        if (!hasIc(ST.icon, ORDER[k])) { WI.loadStyle(ORDER[k]).then(function () { ST.si = k; show(ORDER[k], 'wipe') }); return }
        ST.si = k; show(ORDER[k], 'wipe')
        ST.pausedUntil = Date.now() + 6000; schedule()
      })
      art.innerHTML = ''
      show('line', 'first')
      WI.visibility(stage, play)
      // gentle 3D tilt that follows the pointer
      if (!reduced && W.matchMedia && W.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        var raf = 0, rx = 0, ry = 0
        stage.addEventListener('pointermove', function (e) {
          var r = card.getBoundingClientRect()
          ry = ((e.clientX - r.left) / r.width - 0.5) * 9
          rx = -((e.clientY - r.top) / r.height - 0.5) * 9
          if (!raf) raf = requestAnimationFrame(function () { raf = 0; card.style.setProperty('--rx', rx.toFixed(2) + 'deg'); card.style.setProperty('--ry', ry.toFixed(2) + 'deg') })
        })
        stage.addEventListener('pointerleave', function () { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg') })
      }
    }

    /* ───────── lanes ───────── */
    var lanes = $('[data-lanes]')
    if (lanes) {
      var tilt = $('.lanes-tilt', lanes)
      var h = ''
      ORDER.forEach(function (s, i) {
        var names = P.lanes[s] || []
        var tiles = names.map(function (n) {
          return '<a class="lane-tile" tabindex="-1" href="' + esc(WI.iconUrl(n)) + '" title="' + esc(n) + ' · ' + INFO[s].title + '">' + ic(n, s, 30) + '</a>'
        }).join('')
        h += '<div class="lane s-' + s + (i % 2 ? ' rev' : '') + '" style="--dur:' + (46 + (i * 7) % 23) + 's">' +
          '<a class="lane-label" href="' + esc(WI.url('styles/' + s + '.html')) + '">' + INFO[s].title + ' <span class="ll-n">300</span></a>' +
          '<div class="lane-track" aria-hidden="true">' + tiles + tiles + tiles + tiles + '</div></div>'
      })
      tilt.innerHTML = h
      WI.visibility(lanes, function (v) { lanes.classList.toggle('is-paused', !v) })
    }

    /* ───────── hero search: live results ───────── */
    var hs = $('[data-hero-search]')
    if (hs) {
      var input = $('.hs-input', hs), panel = $('.hs-panel', hs), grid = $('.hs-grid', hs), count = $('.hs-count', hs)
      var stylesBox = $('.hs-styles', hs), all = $('.hs-all', hs), ghostW = $('.hs-ghost-word', hs), form = $('.hs-box', hs)
      var hsStyle = 'line'
      stylesBox.innerHTML = ORDER.map(function (s) { return '<button type="button" class="hs-sw s-' + s + '" data-s="' + s + '" aria-pressed="' + (s === hsStyle) + '" aria-label="Show in ' + INFO[s].title + '" title="' + INFO[s].title + '"></button>' }).join('')
      var lastQ = '', lastHits = []
      var render = function (hits, q) {
        if (!hits.length) {
          var sug = (WI.suggest(q, 4) || []).map(function (x) { return typeof x === 'string' ? x : x.name })
          grid.innerHTML = '<li class="hs-empty" style="--i:0"><span class="hand">hmm, nothing for “' + esc(q) + '”</span>' +
            (sug.length ? 'Did you mean ' + sug.map(function (s) { return '<button type="button" data-q="' + esc(s) + '">' + esc(s) + '</button>' }).join('') + '?' : 'Try a simpler word, like “home” or “money”.') +
            '<span class="hs-empty-ai"><b>Or let an AI pick it</b> — it reads our skill file and searches all 300 icons for “' + esc(q) + '”:</span><div class="hs-empty-ask" data-ask-ai data-intent="find" data-query="' + esc(q) + '"></div></li>'
          count.innerHTML = 'No icons yet'
          return
        }
        var top = hits[0]
        count.innerHTML = hits.length + (hits.length === 1 ? ' icon' : ' icons') + ' for “' + esc(q) + '”' + '<small>' + (WI.whyMatched(top, q) || '') + '</small>'
        grid.innerHTML = hits.map(function (hit, i) {
          var svg = WI.svg(hit.name, hsStyle, 34) || WI.svg(hit.name, 'line', 34) || ic(hit.name, hsStyle, 34)
          return '<li style="--i:' + Math.min(i, 18) + '"><a class="hs-tile s-' + hsStyle + '" href="' + esc(WI.iconUrl(hit.name)) + '"><span class="hs-ic">' + svg + '</span><span class="hs-name">' + esc(hit.name) + '</span></a>' +
            '<button class="hs-copy" type="button" data-copy-name="' + esc(hit.name) + '" aria-label="Copy ' + esc(hit.name) + ' SVG" title="Copy SVG">' + WI.icon_svg.copy + '</button></li>'
        }).join('')
      }
      var run = function () {
        var q = input.value.trim()
        if (!q) { panel.hidden = true; lastQ = ''; if (ST) ST.release(); return }
        Promise.all([WI.ensureSearch(), WI.loadStyle(hsStyle)]).then(function () {
          if (input.value.trim() !== q) return
          var hits = WI.search(q, { limit: 24 })
          lastQ = q; lastHits = hits
          panel.hidden = false
          all.setAttribute('href', WI.url('icons.html') + '?q=' + encodeURIComponent(q))
          render(hits, q)
          if (hits[0] && ST) ST.setIcon(hits[0].name)
        })
      }
      var debounce = 0
      input.addEventListener('input', function () { clearTimeout(debounce); debounce = setTimeout(run, 40) })
      input.addEventListener('focus', function () {
        WI.ensureSearch(); WI.loadStyle(hsStyle)
        if (input.value.trim() && lastQ) panel.hidden = false
      }, { passive: true })
      input.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { var f = $('.hs-tile', grid); if (f) { e.preventDefault(); f.focus() } }
        if (e.key === 'Escape') { panel.hidden = true }
      })
      grid.addEventListener('keydown', function (e) {
        var tiles = $$('.hs-tile', grid), i = tiles.indexOf(doc.activeElement)
        if (i < 0) return
        var cols = Math.max(1, Math.round(grid.clientWidth / (tiles[0].offsetWidth + 6)))
        var to = -1
        if (e.key === 'ArrowRight') to = i + 1
        else if (e.key === 'ArrowLeft') to = i - 1
        else if (e.key === 'ArrowDown') to = i + cols
        else if (e.key === 'ArrowUp') to = i - cols
        else if (e.key === 'Escape') { input.focus(); panel.hidden = true; return }
        if (to === -1) return
        e.preventDefault()
        if (to < 0) { input.focus(); return }
        if (tiles[to]) tiles[to].focus()
      })
      hs.addEventListener('click', function (e) {
        var p = e.target.closest('[data-q]')
        if (p) { input.value = p.getAttribute('data-q'); run(); input.focus(); return }
        var sw = e.target.closest('.hs-sw')
        if (sw) {
          hsStyle = sw.getAttribute('data-s')
          $$('.hs-sw', stylesBox).forEach(function (b) { b.setAttribute('aria-pressed', b === sw ? 'true' : 'false') })
          WI.loadStyle(hsStyle).then(function () { if (lastQ) render(lastHits, lastQ) })
          return
        }
        var cp = e.target.closest('[data-copy-name]')
        if (cp) {
          e.preventDefault()
          var n = cp.getAttribute('data-copy-name')
          WI.loadStyle(hsStyle).then(function () { WI.copyWithToast(WI.svgFile(n, hsStyle) || fileFor(n, hsStyle), 'Copied ' + n + ' — paste it anywhere') })
        }
      })
      doc.addEventListener('pointerdown', function (e) { if (!hs.contains(e.target)) panel.hidden = true })
      // Ask AI with an empty box: show a real placeholder (the typewriter ghost would hide the invitation)
      hs.addEventListener('askai:describe', function () { hs.classList.add('is-describe') })
      hs.addEventListener('askai:describe-end', function () { hs.classList.remove('is-describe') })
      // typewriter suggestions in the empty field
      var words = ['money', 'throw away', 'happy', 'rocket', 'coffee', 'settings', 'calendar', 'gift']
      if (!reduced) {
        var wi = 0, ci = words[0].length, dir = -1, pause = 22
        loop(form, function () {
          if (input.value || doc.activeElement === input) return
          if (pause > 0) { pause--; return }
          var w = words[wi]
          ci += dir
          if (ci <= 0) { dir = 1; wi = (wi + 1) % words.length; w = words[wi]; ci = 0; pause = 3 }
          else if (ci >= w.length) { dir = -1; ci = w.length; pause = 24 }
          ghostW.textContent = '“' + w.slice(0, ci) + (ci >= w.length ? '”' : '')
        }, 70)
      }
      // prefill from ?q=
      try { var q0 = new URLSearchParams(location.search).get('q'); if (q0) { input.value = q0; run() } } catch (err) { /* noop */ }
    }

    /* ───────── pick a style ───────── */
    var picker = $('[data-picker]')
    if (picker) {
      var tabs = $('[data-picker-tabs]', picker), pgrid = $('[data-picker-grid]', picker)
      var ptitle = $('[data-picker-title]', picker), pplain = $('[data-picker-plain]', picker), pgood = $('[data-picker-good]', picker), plink = $('[data-picker-link]', picker)
      tabs.innerHTML = ORDER.map(function (s, i) {
        return '<button class="pt s-' + s + '" role="tab" type="button" id="pt-' + s + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-s="' + s + '">' +
          '<span class="pt-dot" aria-hidden="true"></span>' + INFO[s].title + '<span class="pt-kind">' + (INFO[s].kind === 'creative' ? 'creative' : 'everyday') + '</span></button>'
      }).join('')
      var panelEl = $('[data-picker-panel]', picker)
      var choose = function (s, focus) {
        $$('.pt', tabs).forEach(function (t) { var on = t.getAttribute('data-s') === s; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus() })
        ORDER.forEach(function (o) { panelEl.classList.remove('s-' + o) })
        panelEl.classList.add('s-' + s)
        panelEl.setAttribute('aria-labelledby', 'pt-' + s)
        pgrid.innerHTML = P.grid.map(function (n, i) {
          return '<a class="pg' + (reduced ? '' : ' is-in') + '" style="--i:' + i + '" href="' + esc(WI.iconUrl(n)) + '" title="' + esc(n) + '"><span class="visually-hidden">' + esc(n) + ' in ' + INFO[s].title + '</span>' + ic(n, s, 48) + '</a>'
        }).join('')
        ptitle.textContent = INFO[s].title
        pplain.textContent = INFO[s].plain
        pgood.textContent = INFO[s].good
        plink.setAttribute('href', WI.url('styles/' + s + '.html'))
        plink.firstChild.nodeValue = 'See all ' + INFO[s].title + ' icons '
      }
      tabs.addEventListener('click', function (e) { var t = e.target.closest('.pt'); if (t) choose(t.getAttribute('data-s')) })
      tabs.addEventListener('keydown', function (e) {
        var cur = ORDER.indexOf((doc.activeElement && doc.activeElement.getAttribute('data-s')) || 'line')
        var k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]
        if (k) { e.preventDefault(); choose(ORDER[(cur + k + ORDER.length) % ORDER.length], true) }
        if (e.key === 'Home') { e.preventDefault(); choose(ORDER[0], true) }
        if (e.key === 'End') { e.preventDefault(); choose(ORDER[ORDER.length - 1], true) }
      })
      var hoverT = 0
      tabs.addEventListener('pointerover', function (e) {
        var t = e.target.closest('.pt'); if (!t || t.getAttribute('aria-selected') === 'true') return
        clearTimeout(hoverT); hoverT = setTimeout(function () { choose(t.getAttribute('data-s')) }, 160)
      })
      tabs.addEventListener('pointerleave', function () { clearTimeout(hoverT) })
      choose('line')
    }

    /* ───────── anywhere mock ───────── */
    var mock = $('[data-mock]')
    if (mock) {
      var mics = $$('[data-mock-ic]', mock), mk = 0
      var paintMock = function (cls) {
        var s = ORDER[mk % ORDER.length]
        mics.forEach(function (m, i) {
          m.style.setProperty('--style', 'var(--c-' + s + ')'); m.style.setProperty('--style-soft', 'var(--c-' + s + '-soft)')
          setTimeout(function () { m.innerHTML = ic(m.getAttribute('data-mock-ic'), s, 28, cls ? { 'class': cls } : null) }, cls ? i * 90 : 0)
        })
      }
      paintMock()
      if (!reduced) loop(mock, function () { mk++; paintMock('is-new') }, 2600)
    }

    /* ───────── try: copy, download, drag ───────── */
    var tryEl = $('[data-try]')
    if (tryEl) {
      var tArt = $('[data-try-art]', tryEl), tStyles = $('[data-try-styles]', tryEl), tColors = $('[data-try-colors]', tryEl), drop = $('[data-try-drop]', tryEl)
      var prev = $('.try-preview', tryEl)
      var T = { icon: 'rocket', style: 'line', color: null }
      var COLORS = [['auto', null, 'Style colour'], ['ink', '#111318', 'Ink'], ['white', '#FFFFFF', 'White'], ['cobalt', '#2F5BFF', 'Cobalt'], ['tomato', '#FF5A36', 'Tomato'], ['violet', '#7B5CFF', 'Violet'], ['pink', '#FF4FA3', 'Pink'], ['gold', '#C9962B', 'Gold'], ['leaf', '#22A861', 'Leaf']]
      tStyles.innerHTML = ORDER.map(function (s) { return '<button type="button" class="chip s-' + s + '" data-s="' + s + '" aria-pressed="' + (s === T.style) + '">' + INFO[s].title + '</button>' }).join('')
      tColors.innerHTML = COLORS.map(function (c, i) { return '<button type="button" class="sw' + (i === 0 ? ' auto' : '') + '" style="--sw:' + (c[1] || 'transparent') + '" data-c="' + i + '" aria-pressed="' + (i === 0) + '" aria-label="' + c[2] + '" title="' + c[2] + '"></button>' }).join('')
      tArt.setAttribute('draggable', 'true')
      tArt.setAttribute('aria-label', 'Icon preview — drag me')
      var paintTry = function () {
        ORDER.forEach(function (o) { prev.classList.remove('s-' + o) })
        prev.classList.add('s-' + T.style)
        prev.style.setProperty('--style', 'var(--c-' + T.style + ')'); prev.style.setProperty('--style-soft', 'var(--c-' + T.style + '-soft)')
        if (T.color) tArt.style.setProperty('--try-color', T.color); else tArt.style.removeProperty('--try-color')
        tArt.innerHTML = '<span class="try-grab" aria-hidden="true">drag me ↘</span>' + ic(T.icon, T.style, 200, { 'class': reduced ? '' : 'is-new' })
      }
      paintTry()
      var curColor = function () { return T.color || getComputedStyle(prev).getPropertyValue('--c-' + T.style).trim() || '#111318' }
      var curColorHex = function () { return T.color || INFO[T.style].color }
      tryEl.addEventListener('click', function (e) {
        var s = e.target.closest('[data-s]')
        if (s && tStyles.contains(s)) {
          T.style = s.getAttribute('data-s')
          $$('[data-s]', tStyles).forEach(function (b) { b.setAttribute('aria-pressed', b === s ? 'true' : 'false') })
          paintTry(); return
        }
        var c = e.target.closest('[data-c]')
        if (c) {
          T.color = COLORS[+c.getAttribute('data-c')][1]
          $$('[data-c]', tColors).forEach(function (b) { b.setAttribute('aria-pressed', b === c ? 'true' : 'false') })
          paintTry(); return
        }
        if (e.target.closest('[data-try-copy]')) { WI.copyWithToast(fileFor(T.icon, T.style, curColorHex()), 'SVG copied — paste it into Figma, Canva or your code'); return }
        if (e.target.closest('[data-try-svg]')) { WI.download(T.icon + '-' + T.style + '.svg', fileFor(T.icon, T.style, curColorHex())); WI.toast('Downloading ' + T.icon + '-' + T.style + '.svg'); return }
        if (e.target.closest('[data-try-png]')) {
          WI.svgToPng(fileFor(T.icon, T.style, curColorHex()), 512).then(function (blob) {
            var a = doc.createElement('a'); a.href = URL.createObjectURL(blob); a.download = T.icon + '-' + T.style + '-512.png'
            doc.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove() }, 800)
            WI.toast('Downloading a 512px PNG')
          })
          return
        }
        if (e.target.closest('[data-try-drop]')) place()
      })
      var place = function () {
        var label = $('.try-drop-label', drop); if (label) label.remove()
        var d = doc.createElement('span'); d.className = 'dropped'
        d.style.color = curColor()
        d.innerHTML = ic(T.icon, T.style, 44)
        drop.appendChild(d)
        var kids = $$('.dropped', drop); if (kids.length > 5) kids[0].remove()
        WI.announce('Placed ' + T.icon + ' on the slide')
      }
      tArt.addEventListener('dragstart', function (e) {
        var svgText = fileFor(T.icon, T.style, curColorHex())
        try {
          e.dataTransfer.effectAllowed = 'copy'
          e.dataTransfer.setData('text/plain', svgText)
          e.dataTransfer.setData('text/html', '<img alt="' + T.icon + '" src="data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText) + '">')
          var svgEl = tArt.querySelector('svg'); if (svgEl && e.dataTransfer.setDragImage) e.dataTransfer.setDragImage(svgEl, 50, 50)
        } catch (err) { /* noop */ }
      })
      drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('is-over') })
      drop.addEventListener('dragleave', function () { drop.classList.remove('is-over') })
      drop.addEventListener('drop', function (e) { e.preventDefault(); drop.classList.remove('is-over'); place() })
      drop.setAttribute('role', 'button'); drop.setAttribute('tabindex', '0'); drop.setAttribute('aria-label', 'Place the icon on the slide')
      drop.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); place() } })
      // the try icon follows the search (if someone searched)
      WI.on('style', function () { /* full styles may now include the searched icon */ })
    }

    /* ───────── developers: code tabs ───────── */
    var devTabs = $('[data-dev-tabs]'), devCode = $('[data-dev-code]')
    if (devTabs && devCode) {
      var CODE = {
        html: ['html', '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/web/dist/classes/with-all.css">\n\n<i class="with with-heart"></i>\n<i class="with with-heart with-solid"></i>'],
        react: ['jsx', "import { Heart } from '@withicons/react'\nimport { Heart as HeartGloss } from '@withicons/react/gloss'\n\n<Heart size={24} />\n<HeartGloss size={48} color=\"hotpink\" />"],
        wc: ['html', '<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web"></script>\n\n<with-icon name="heart" variant="duo"></with-icon>']
      }
      var setDev = function (k) {
        $$('[data-dev]', devTabs).forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-dev') === k ? 'true' : 'false') })
        devCode.innerHTML = WI.codeBlock(CODE[k][1], CODE[k][0])
      }
      devTabs.addEventListener('click', function (e) { var b = e.target.closest('[data-dev]'); if (b) setDev(b.getAttribute('data-dev')) })
      setDev('html')
    }

    /* ───────── AI chat ───────── */
    var chat = $('[data-chat]')
    if (chat) {
      var SCRIPTS = [
        ['Add a delete button to this card', 'search("delete")', 'trash', 'Line', 'line'],
        ['Use a friendly icon for the pricing section', 'search("money", style: "gloss")', 'gift', 'Gloss', 'gloss'],
        ['Put a gear on the settings link', 'resolve("gear")', 'settings', 'Duo', 'duo']
      ]
      var sc = 0, chatTimers = []
      var playChat = function () {
        chatTimers.forEach(clearTimeout); chatTimers = []
        var s = SCRIPTS[sc % SCRIPTS.length]; sc++
        var msgs = $$('.msg', chat)
        msgs.forEach(function (m) { m.classList.remove('is-in') })
        chatTimers.push(setTimeout(function () {
          msgs[0].querySelector('p').textContent = s[0]
          msgs[1].querySelector('code').textContent = 'with-icons · ' + s[1]
          var style = s[4]
          var draw = function () {
            var svg = ic(s[2], style, 22) || WI.svg(s[2], style, 22) || ic(s[2], 'line', 22) || WI.svg(s[2], 'line', 22)
            msgs[2].querySelector('p').innerHTML = '<span class="chat-ic" style="color:var(--c-' + style + ')">' + svg + '</span><span>Using <b>' + esc(s[2]) + '</b> in ' + s[3] + ' — added with an accessible label.</span>'
          }
          if (hasIc(s[2], style)) draw(); else WI.loadStyle(style).then(draw)
          msgs[0].classList.add('is-in')
        }, 250))
        chatTimers.push(setTimeout(function () { msgs[1].classList.add('is-in') }, 1050))
        chatTimers.push(setTimeout(function () { msgs[2].classList.add('is-in') }, 1900))
      }
      if (reduced) {
        WI.loadStyle('line').then(function () { $$('.msg', chat).forEach(function (m) { m.classList.add('is-in') }); var t = $('[data-chat-ic]', chat); if (t) t.innerHTML = WI.svg('trash', 'line', 22) })
      } else {
        var chatOn = false, chatInt = 0
        WI.visibility(chat, function (v) {
          if (v && !chatOn) { chatOn = true; WI.loadMeta().then(function () { WI.loadStyle('line').then(playChat) }); chatInt = setInterval(playChat, 6200) }
          else if (!v && chatOn) { chatOn = false; clearInterval(chatInt); chatTimers.forEach(clearTimeout) }
        })
      }
    }

    /* ───────── use-case icons ───────── */
    $$('[data-use-ic]').forEach(function (el) { el.innerHTML = ic(el.getAttribute('data-use-ic'), el.getAttribute('data-use-style') || 'line', 36) })

    /* ───────── final orbit ───────── */
    var orbit = $('[data-orbit]')
    if (orbit) {
      var ORB = [['heart', 'gloss'], ['star', 'solid'], ['rocket', 'line'], ['gift', 'duo'], ['coffee', 'sketch'], ['camera', 'blueprint'], ['trophy', 'engrave'], ['lightbulb', 'gloss'],
        ['music-note', 'solid'], ['calendar', 'line'], ['mail', 'duo'], ['search', 'sketch'], ['settings', 'blueprint'], ['home', 'gloss'], ['user', 'engrave'], ['star', 'line']]
      var orbs = ORB.map(function (o, i) {
        var el = doc.createElement('span'); el.className = 'orb' + (i % 3 === 1 ? ' ghost' : '')
        el.style.setProperty('--orb', 'var(--c-' + o[1] + ')')
        el.innerHTML = ic(o[0], o[1], 36)
        orbit.appendChild(el)
        return { el: el, a: (i / ORB.length) * Math.PI * 2, r: 0.8 + (i % 3) * 0.1 }
      })
      var ow = 0, oh = 0
      var measure = function () { ow = orbit.offsetWidth / 2; oh = orbit.offsetHeight / 2 }
      measure(); W.addEventListener('resize', measure, { passive: true })
      var t0 = performance.now(), oraf = 0
      var frame = function (now) {
        var t = (now - t0) / 1000
        for (var i = 0; i < orbs.length; i++) {
          var o = orbs[i], a = o.a + t * 0.07
          var x = Math.cos(a) * ow * o.r * 0.92, y = Math.sin(a) * oh * o.r * 0.86
          var s = 0.75 + 0.25 * ((Math.sin(a) + 1) / 2)
          o.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) scale(' + s.toFixed(3) + ') rotate(' + (Math.sin(t + i) * 8).toFixed(1) + 'deg)'
          o.el.style.opacity = (0.35 + 0.65 * ((Math.sin(a) + 1) / 2)).toFixed(2)
        }
        oraf = requestAnimationFrame(frame)
      }
      if (reduced) frame(t0), cancelAnimationFrame(oraf)
      else WI.visibility(orbit, function (v) { cancelAnimationFrame(oraf); if (v) oraf = requestAnimationFrame(frame) }, '100px')
    }
  }
  // the icon pack (≈75 KB gzipped) loads after the page is interactive, so it never delays the header or first paint
  function start() {
    if (W.WITH_HOME) { boot(); return }
    var s = doc.createElement('script')
    s.src = (W.WI && W.WI.base ? W.WI.base : '') + 'js/home-icons.js'
    s.onload = boot
    doc.head.appendChild(s)
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start); else start()
})()

/* Ask-AI section: examples fill the box, and the prompt preview follows what the visitor types */
;(function () {
  'use strict'
  function wire() {
    var input = document.querySelector('[data-ask-need]')
    var pre = document.querySelector('[data-ask-preview]')
    if (!input || !window.WI || !WI.askAI) return
    var paint = function () { if (pre) pre.textContent = WI.askAI.prompt({ query: input.value.trim(), intent: 'find' }) }
    var t = 0
    input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(paint, 120) })
    input.addEventListener('keydown', function (e) {
      // Enter = ask Claude (the first assistant); Shift+Enter keeps a newline
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); var b = document.querySelector('.ask-card .ask-ai-btn'); if (b) b.click() }
    })
    Array.prototype.forEach.call(document.querySelectorAll('[data-ask-example]'), function (b) {
      b.addEventListener('click', function () { input.value = b.getAttribute('data-ask-example'); paint(); input.focus() })
    })
    paint()
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire()
})()

/* "Add with icons to your AI tool": tabs rendered from data/integrations.js (window.WITH_INTEGRATIONS).
   Commands are never hard-coded here; with no data the section stays hidden. */
;(function () {
  'use strict'
  var doc = document
  function esc(v) { return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }
  function safeHref(h) { h = String(h || '').trim(); return /^(https?:|cursor:|vscode:|vscode-insiders:|[\w./-]+\.html|#)/i.test(h) && !/^javascript:/i.test(h) ? h : '' }
  function code(text, lang, cls) {
    if (window.WI && WI.codeBlock) return WI.codeBlock(String(text), lang || 'shell', cls)
    return '<pre><code>' + esc(text) + '</code></pre>'
  }
  function logo(it, cls) {
    var l = it.logo || {}, light = typeof l === 'string' ? l : l.light, dark = typeof l === 'string' ? l : (l.dark || l.light)
    if (!light) {
      // no brand mark supplied (vscode, windsurf): our own `code` icon on the same white tile
      var ic = window.WI && WI.svg ? WI.svg('code', 'line', 24) : ''
      return ic ? '<span class="tl-logo ' + cls + ' is-icon" aria-hidden="true">' + ic + '</span>'
        : '<span class="tl-logo ' + cls + ' is-text" aria-hidden="true" data-tl-code>' + esc((it.name || '?').charAt(0)) + '</span>'
    }
    var base = (window.WI && WI.base) || ''
    var src = function (p) { return esc(/^(https?:|data:)/.test(p) ? p : base + String(p).replace(/^\.?\//, '')) }
    return '<span class="tl-logo ' + cls + '" aria-hidden="true"><img class="tl-l" src="' + src(light) + '" alt="" width="24" height="24" loading="lazy" decoding="async">' +
      (dark && dark !== light ? '<img class="tl-d" src="' + src(dark) + '" alt="" width="24" height="24" loading="lazy" decoding="async">' : '') + '</span>'
  }
  function panel(it) {
    var h = '<div class="tp-head">' + logo(it, 'tl-big') + '<div><h3 class="tp-name">' + esc(it.name) + '</h3>' + (it.blurb ? '<p class="tp-blurb">' + esc(it.blurb) + '</p>' : '') + '</div></div>'
    var dl = it.deeplink && safeHref(it.deeplink.href)
    if (it.oneLiner || dl) {
      h += '<div class="tp-quick">'
      if (it.oneLiner) h += '<div class="tp-one"><p class="tp-k">One line, in your project folder</p>' + code(it.oneLiner, 'shell', 'cmdline') + '</div>'
      if (dl) h += '<a class="btn btn-ink tp-deep" href="' + esc(dl) + '"' + (/^https?:/.test(dl) ? ' target="_blank" rel="noopener"' : '') + '>' + logo(it, 'tl-btn') + '<span>' + esc(it.deeplink.label || ('Add to ' + it.name)) + '</span></a>'
      h += '</div>'
    }
    var steps = Array.isArray(it.steps) ? it.steps : []
    if (steps.length) {
      h += '<ol class="tp-steps">'
      steps.forEach(function (s, i) {
        h += '<li><span class="tp-n" aria-hidden="true">' + (i + 1) + '</span><div><p class="tp-st">' + esc(s.title || '') + '</p>' + (s.text ? '<p class="tp-sx">' + esc(s.text) + '</p>' : '') +
          (s.code ? code(s.code, s.lang || 'shell') : '') + '</div></li>'
      })
      h += '</ol>'
    }
    var more = ''
    if (it.mcp && it.mcp.snippet) more += '<div class="tp-more-b"><p class="tp-k">MCP server' + (it.mcp.kind ? ' · ' + esc(it.mcp.kind) : '') + (it.mcp.path ? ' · <code>' + esc(it.mcp.path) + '</code>' : '') + '</p>' + code(it.mcp.snippet, it.mcp.lang || 'json') + '</div>'
    if (it.skill && (it.skill.snippet || it.skill.path)) more += '<div class="tp-more-b"><p class="tp-k">Agent skill' + (it.skill.path ? ' · <code>' + esc(it.skill.path) + '</code>' : '') + '</p>' + (it.skill.snippet ? code(it.skill.snippet, 'shell') : '') + '</div>'
    if (more) h += '<details class="tp-more"' + (steps.length ? '' : ' open') + '><summary>Manual setup: MCP + skill</summary>' + more + '</details>'
    var foot = []
    if (safeHref(it.docs)) foot.push('<a href="' + esc(safeHref(it.docs)) + '" target="_blank" rel="noopener">' + esc(it.name) + ' docs</a>')
    foot.push('<a href="ai.html">All AI setups</a>', '<a href="skill/SKILL.md">SKILL.md</a>')
    if (it.verified) foot.push('<span>Checked ' + esc(it.verified) + '</span>')
    h += '<p class="tp-foot">' + foot.join('<span aria-hidden="true">·</span>') + '</p>'
    return h
  }
  function init() {
    var sec = doc.querySelector('[data-tools]')
    var data = window.WITH_INTEGRATIONS
    if (!sec) return
    if (!Array.isArray(data) || !data.length) { sec.hidden = true; return }
    var want = ['claude-code', 'codex', 'cursor', 'opencode', 'lovable']
    var list = want.map(function (id) { return data.filter(function (d) { return d && d.id === id })[0] }).filter(Boolean)
    data.forEach(function (d) { if (d && d.id && list.indexOf(d) < 0 && list.length < 8) list.push(d) })
    if (!list.length) { sec.hidden = true; return }
    var tabs = sec.querySelector('[data-tools-tabs]'), pan = sec.querySelector('[data-tools-panel]')
    tabs.innerHTML = list.map(function (it, i) {
      return '<button type="button" role="tab" id="tt-' + esc(it.id) + '" aria-controls="tools-panel" aria-selected="' + (i ? 'false' : 'true') + '" tabindex="' + (i ? '-1' : '0') + '" data-i="' + i + '">' + logo(it, 'tl-tab') + '<span>' + esc(it.name) + '</span></button>'
    }).join('')
    pan.id = 'tools-panel'
    var show = function (i, focus) {
      var bs = tabs.querySelectorAll('[role=tab]')
      for (var k = 0; k < bs.length; k++) { bs[k].setAttribute('aria-selected', k === i ? 'true' : 'false'); bs[k].tabIndex = k === i ? 0 : -1 }
      pan.setAttribute('aria-labelledby', bs[i].id)
      pan.innerHTML = panel(list[i])
      pan.classList.remove('is-in'); void pan.offsetWidth; pan.classList.add('is-in')
      if (focus) bs[i].focus()
      if (bs[i].scrollIntoView && focus) bs[i].scrollIntoView({ block: 'nearest', inline: 'nearest' })
    }
    tabs.addEventListener('click', function (e) { var b = e.target.closest('[role=tab]'); if (b) show(+b.getAttribute('data-i')) })
    tabs.addEventListener('keydown', function (e) {
      var cur = +(doc.activeElement.getAttribute('data-i') || 0), n = list.length
      if (e.key === 'ArrowRight') { e.preventDefault(); show((cur + 1) % n, true) }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); show((cur - 1 + n) % n, true) }
      else if (e.key === 'Home') { e.preventDefault(); show(0, true) } else if (e.key === 'End') { e.preventDefault(); show(n - 1, true) }
    })
    sec.hidden = false
    show(0)
    if (sec.querySelector('[data-tl-code]') && window.WI && WI.loadStyle) {
      WI.loadStyle('line').then(function () {
        var ic = WI.svg('code', 'line', 24)
        if (ic) sec.querySelectorAll('[data-tl-code]').forEach(function (s) { s.innerHTML = ic; s.classList.remove('is-text'); s.classList.add('is-icon'); s.removeAttribute('data-tl-code') })
      })
    }
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init()
})()
