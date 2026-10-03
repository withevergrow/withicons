/* with icons — home page. Needs js/site.js (window.WI), js/home-icons.js (window.WITH_HOME) and, for the style
   picker, "Icons that move" and the washing line's "dress them all as", js/home-icons-more.js (window.WITH_HOME_MORE).
   Both packs are generated from the skeletons (forge/tools/site-data.mjs, homePacks) and load after the page is interactive. */
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
    // "Pause animations" or the OS setting can change mid-visit: loops below re-check `reduced` on every tick
    var motionFns = []
    WI.on('motion', function (r) { reduced = r; motionFns.forEach(function (fn) { fn(r) }) })
    var P2 = null, more = []
    // the styles this page can actually draw (a style still being built is simply left out)
    var AV = ORDER.filter(function (s) { return P.svg[s] && INFO[s] })
    if (!AV.length) AV = ['line']

    /* render from the home packs, falling back to the full style files when loaded */
    function inner(name, style) {
      var a = P.svg[style] && P.svg[style][name]
      if (a == null && P2 && P2.svg[style]) a = P2.svg[style][name]
      return a
    }
    function build(innerS, style, size, opts) {
      opts = opts || {}
      var r = (P.roots && P.roots[style]) || null
      if (!r) return WI.svgFrom(innerS, style, size, opts)
      var s = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24"'
      for (var k in r) if (r[k] != null && r[k] !== false) s += ' ' + k + '="' + esc(r[k]) + '"'
      if (opts['class']) s += ' class="' + esc(opts['class']) + '"'
      return s + ' aria-hidden="true" focusable="false">' + innerS + '</svg>'
    }
    function ic(name, style, size, opts) {
      var i = inner(name, style)
      if (i != null) return build(i, style, size || 24, opts)
      return WI.svg(name, style, size || 24, opts) || ''
    }
    function hasIc(name, style) { return inner(name, style) != null || WI.has(name, style) }
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
        if (v && !on) { on = true; t = setInterval(function () { if (!reduced) fn() }, every) }
        else if (!v && on) { on = false; clearInterval(t) }
      })
    }
    function setStyleClass(el, s) { ORDER.forEach(function (o) { el.classList.remove('s-' + o) }); el.classList.add('s-' + s) }
    function newTag(s) { return INFO[s] && INFO[s].isNew ? '<span class="new-tag">new</span>' : '' }

    /* ───────── hero inline icons ───────── */
    var htIcons = $$('[data-ht-icon]')
    htIcons.forEach(function (el) {
      var n = el.getAttribute('data-ht-icon')
      el._styles = el.getAttribute('data-ht-styles').split(',').filter(function (s) { return hasIc(n, s) })
      if (!el._styles.length) el._styles = ['line']
      el._k = 0
      setStyleClass(el, el._styles[0])
      el.innerHTML = ic(n, el._styles[0], 24)
    })
    if (!reduced && htIcons.length) {
      var htI = 0
      loop($('.hero-title'), function () {
        var el = htIcons[htI % htIcons.length]; htI++
        el._k = (el._k + 1) % el._styles.length
        var s = el._styles[el._k]
        setStyleClass(el, s)
        el.innerHTML = ic(el.getAttribute('data-ht-icon'), s, 24, { 'class': 'is-new' })
      }, 1500)
    }

    /* ───────── stage: every style, each with its own icon ─────────
       Slide k is style AV[k] drawn with that style's representative icon (P.show[style] = [icon, ...alternates]; the
       alternates take over on later rounds once the second pack is in). A searched icon "locks" the stage: then every
       slide shows that icon. One rule keeps it honest: the chip, counter, caption, dots and the art change together, at
       the moment the new art takes over (commit()), and the art layer carries data-icon/data-style for checking. */
    var stage = $('[data-stage]')
    var ST = null
    // its own scope: boot() declares paint/show/… again further down, and `var` would hoist them over these
    if (stage) (function () {
      var art = $('[data-stage-art]', stage), bloom = $('.stage-scan', stage), card = $('.stage-card', stage)
      var nameEl = $('[data-stage-name]', stage), nEl = $('[data-stage-n]', stage), styleEl = $('[data-stage-style]', stage), plainEl = $('[data-stage-plain]', stage)
      var cap = $('.stage-cap', stage), dotsWrap = $('[data-stage-dots]', stage), totEl = $('[data-stage-total]', stage), stTop = $('.stage-top', stage)
      var HOLD = 2600, OUT = 150
      var SHOW = P.show || {}
      if (totEl) totEl.textContent = String(AV.length)
      ST = { si: 0, round: 0, timer: 0, swapT: 0, tok: 0, layer: null, playing: false, visible: false, focus: false, pausedUntil: 0, locked: false, lockIcon: null }
      dotsWrap.innerHTML = AV.map(function (s, i) {
        return '<button type="button" class="stage-dot" style="--dot: var(--c-' + s + ')" data-i="' + i + '" tabindex="' + (i ? -1 : 0) + '" aria-pressed="false" aria-label="' + INFO[s].title + '"></button>'
      }).join('')
      dotsWrap.style.setProperty('--n', AV.length)
      var dots = $$('.stage-dot', dotsWrap)
      // the dot fills during the hold and is full just as the next swap starts
      stage.style.setProperty('--hold', (HOLD - OUT) + 'ms')
      // the icon slide k shows this round (null: not drawable yet)
      var pick = function (k) {
        var s = AV[k]
        if (ST.locked) return hasIc(ST.lockIcon, s) ? ST.lockIcon : null
        var list = SHOW[s] && SHOW[s].length ? SHOW[s] : P.stage
        var n = list[ST.round % list.length]
        if (hasIc(n, s)) return n
        for (var j = 0; j < list.length; j++) if (hasIc(list[j], s)) return list[j]
        return null
      }
      var paint = function (k, name, instant) {
        var style = AV[k]
        ST.icon = name // the washing line reads it (its gust never echoes the hero's icon)
        setStyleClass(stage, style)
        stage.setAttribute('data-icon', name); stage.setAttribute('data-style', style)
        nameEl.textContent = name
        nEl.textContent = String(k + 1)
        styleEl.innerHTML = esc(INFO[style].title) + newTag(style)
        plainEl.textContent = INFO[style].plain
        if (!instant) {
          cap.classList.remove('is-swap'); stTop.classList.remove('is-swap'); void cap.offsetWidth
          cap.classList.add('is-swap'); stTop.classList.add('is-swap')
        }
        dots.forEach(function (d, i) {
          d.setAttribute('aria-pressed', i === k ? 'true' : 'false')
          d.tabIndex = i === k ? 0 : -1 // roving tabindex: one Tab stop for the whole row, arrows walk it
          d.classList.toggle('is-done', i < k)
          if (i === k) { d.style.animation = 'none'; void d.offsetWidth; d.style.animation = '' }
        })
      }
      var show = function (k, name, instant) {
        var style = AV[k], svg = ic(name, style, 24)
        if (!svg) return false
        // a swap still waiting to commit: don't blank the art for another OUT, hand over straight away
        var pending = !!ST.swapT
        clearTimeout(ST.swapT); ST.swapT = 0
        var layer = doc.createElement('div')
        // each layer carries its own style scope, so an outgoing icon keeps its palette while the stage changes style
        layer.className = 'stage-layer'
        setStyleClass(layer, style)
        layer.setAttribute('data-icon', name); layer.setAttribute('data-style', style)
        layer.innerHTML = svg
        var cur = ST.layer
        ST.si = k
        var commit = function () {
          ST.swapT = 0
          ST.layer = layer
          art.appendChild(layer)
          if (!instant) {
            layer.classList.add('is-in')
            if (bloom) { bloom.classList.remove('is-run'); void bloom.offsetWidth; bloom.classList.add('is-run') }
          }
          paint(k, name, instant)
        }
        var clearOthers = function () { $$('.stage-layer', art).forEach(function (o) { if (o !== layer) o.remove() }) }
        if (instant || reduced || !cur || !cur.parentNode) {
          instant = true
          commit(); clearOthers()
          return true
        }
        if (pending) {
          // cur is still on screen (fading or not): let it melt away under the new one
          commit()
          $$('.stage-layer', art).forEach(function (o) { if (o !== layer && o !== cur) o.remove() })
          cur.classList.remove('is-in'); cur.classList.add('is-out')
          setTimeout(function () { if (cur !== ST.layer) cur.remove() }, 300)
          return true
        }
        // the old icon shrinks away; as it fades out the new one (with its caption) takes over
        $$('.stage-layer.is-out', art).forEach(function (o) { o.remove() })
        cur.classList.remove('is-in'); cur.classList.add('is-out')
        ST.swapT = setTimeout(function () { commit(); setTimeout(function () { if (cur !== ST.layer) cur.remove() }, 200) }, OUT)
        return true
      }
      var prefetch = function (k) {
        var j = (k + 1) % AV.length
        if (ST.locked && !hasIc(ST.lockIcon, AV[j])) WI.loadStyle(AV[j])
      }
      // go to slide k, or the first drawable one after it; a locked (searched) icon waits for its style file
      var go = function (k) {
        var tok = ++ST.tok
        var tryFrom = function (k, left) {
          for (; left > 0; left--, k = (k + 1) % AV.length) {
            var n = pick(k)
            if (n) { show(k, n); prefetch(k); return }
            if (ST.locked) {
              var j = k, rest = left - 1
              WI.loadStyle(AV[j]).then(null, function () { return false }).then(function () {
                if (tok !== ST.tok) return
                var n2 = pick(j)
                if (n2) { show(j, n2); prefetch(j) } else tryFrom((j + 1) % AV.length, rest)
              })
              return
            }
          }
        }
        tryFrom(k, AV.length)
      }
      var next = function () {
        var k = (ST.si + 1) % AV.length
        if (k === 0 && !ST.locked) ST.round++
        // the alternates ride in the second pack: someone still watching near the end of a round gets it fetched
        if (!P2 && k === AV.length - 5 && typeof loadMore === 'function') loadMore()
        go(k)
      }
      var schedule = function () {
        clearTimeout(ST.timer)
        if (!ST.playing) return
        var wait = Math.max(HOLD, ST.pausedUntil - Date.now())
        ST.timer = setTimeout(function () { next(); schedule() }, wait)
      }
      var play = function (v) {
        ST.visible = v
        // carousel pattern: rotation stops while keyboard focus is inside the stage
        ST.playing = v && !reduced && !ST.focus
        stage.classList.toggle('is-paused', !ST.playing)
        if (ST.playing) schedule(); else clearTimeout(ST.timer)
      }
      ST.setIcon = function (name) {
        if (!name || (ST.locked && name === ST.lockIcon)) return
        // first lock starts at slide 1; while typing (already locked) the stage stays on its slide and redraws it
        var at = ST.locked ? ST.si : 0
        ST.locked = true; ST.lockIcon = name
        go(at)
        schedule()
      }
      ST.release = function () { ST.locked = false; ST.lockIcon = null }
      var jump = function (k) {
        // the alternates ride in the second pack: a jump near the end of a round fetches it too
        if (!P2 && k >= AV.length - 5 && typeof loadMore === 'function') loadMore()
        if (k !== ST.si || ST.swapT) go(k)
        ST.pausedUntil = Date.now() + 6000; schedule()
      }
      dotsWrap.addEventListener('click', function (e) {
        var d = e.target.closest('.stage-dot'); if (!d) return
        jump(+d.getAttribute('data-i'))
      })
      // arrow keys walk the dots (Home / End jump to the ends)
      dotsWrap.addEventListener('keydown', function (e) {
        var d = e.target.closest('.stage-dot'); if (!d) return
        var k = +d.getAttribute('data-i'), to = -1
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = (k + 1) % AV.length
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = (k - 1 + AV.length) % AV.length
        else if (e.key === 'Home') to = 0
        else if (e.key === 'End') to = AV.length - 1
        if (to < 0) return
        e.preventDefault()
        dots[to].focus(); jump(to)
      })
      art.innerHTML = ''
      show(0, pick(0) || P.stage[0], true)
      WI.visibility(stage, play)
      motionFns.push(function () { play(ST.visible) })
      // only keyboard focus pauses (a mouse click focuses the dot in Chrome/Firefox; jump() already pauses it for 6s)
      stage.addEventListener('focusin', function (e) {
        var kb = false
        try { kb = e.target.matches(':focus-visible') } catch (err) { kb = true }
        ST.focus = kb; play(ST.visible)
      })
      stage.addEventListener('focusout', function (e) { if (!stage.contains(e.relatedTarget)) { ST.focus = false; play(ST.visible) } })
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
    })()

    /* ═════════ THE WASHING LINE ═════════
       One polaroid per style, pegged on a twine line in a soft sky, with a hanging sign per family and a kraft tag with
       the sum (index.html [data-washline], home.css .wl). Data: P.washline = { cards: { style: icon }, sky: { sun|moon:
       [style, icon] }, try: [icons], tryStyle }.
       Motion is handed to the compositor: on a fine pointer the drift is ONE Web Animation per item (the curve is baked
       into its keyframes; all share one clock, so the line moves as one), and each hanger has at most one plain swing
       Web Animation. The speed (hover-stop, the gust, a scroll push) eases on a slow timer in a few coarse steps; a rAF
       loop runs only while the line is dragged, flung or glides to a card, then sleeps. On touch (or a narrow screen) the line is parked: it only sways (CSS)
       and moves when swiped. The story beat: when the line has pegged on, a gust blows through and every polaroid
       develops into the same icon, holds, and develops back; then again every ~20 s with the next icon. */
    var wlRoot = $('[data-washline]')
    if (wlRoot && P.washline) washline(wlRoot, P.washline)
    function washline(root, D) {
      var list = $('.wl-list', root), signsBox = $('.wl-signs', root), pomsBox = $('.wl-poms', root)
      var far = $('.wl-far', root), wind = $('.wl-wind', root), noteEl = $('.wl-note', root), windA = null, chipsBox = $('[data-wl-try]', root), holdBtn = $('[data-wl="hold"]', root)
      var twine = $('.wl-twine', root), twineHi = $('.wl-twine-hi', root)
      var isReduced = function () { return !!WI.reduced }
      var fine = !!(W.matchMedia && W.matchMedia('(hover: hover) and (pointer: fine)').matches)
      var canAnim = !!root.animate
      // deterministic randomness: the same composition on every visit
      var seed = 20261003
      var rnd = function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
      var mod = function (a, n) { return ((a % n) + n) % n }
      var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v }
      var now = function () { return performance.now() }
      var iconHref = function (n, s) { return WI.iconUrl(n) + '?style=' + encodeURIComponent(s) }
      var cap = function (n) { n = String(n).replace(/-/g, ' '); return n.charAt(0).toUpperCase() + n.slice(1) }
      var HEART = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.6c-.3 0-7.8-4.6-7.8-10.4 0-2.6 2-4.6 4.4-4.6 1.5 0 2.7.7 3.4 1.9.7-1.2 1.9-1.9 3.4-1.9 2.4 0 4.4 2 4.4 4.6 0 5.8-7.5 10.4-7.8 10.4z"/></svg>'
      var SPARK = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.5c.7 6 3.6 9.2 10.5 10.5-6.9 1.3-9.8 4.5-10.5 10.5-.7-6-3.6-9.2-10.5-10.5C8.4 10.7 11.3 7.5 12 1.5z"/></svg>'
      var CLOUD = '<svg viewBox="0 0 200 90"><path class="shade" d="M30 84c-16 0-26-8-26-19 0-12 11-19 24-18 3-15 16-24 31-21 7-13 22-21 39-17 15 3 25 14 27 27 4-2 9-3 14-2 14 2 22 12 21 24 11 1 18 8 18 16 0 6-6 10-15 10z"/><path class="puff" d="M30 78c-15 0-24-7-24-17 0-11 10-17 22-16 3-14 15-22 29-19 7-12 21-19 37-15 14 3 23 13 25 25 4-2 8-3 13-2 13 2 20 11 19 22 10 1 17 7 17 15 0 5-5 7-13 7z"/></svg>'
      var ARROW = '<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 16 L16 8 M9.5 8 H16 V14.5"/></svg>'

      /* moments: each style's little trick (one card at a time, now and then) */
      var MOMENT = { line: 'pop', solid: 'pop', duo: 'pop', gloss: 'shine', engrave: 'shine', blueprint: 'measure', sketch: 'wiggle',
        glass: 'shine', kawaii: 'hearts', sticker: 'peel', pixel: 'steps', retro: 'sway', luxe: 'glint', bauhaus: 'spin', skeuo: 'press',
        anime: 'sparkle', gothic: 'glow', pastel: 'bubbles', coquette: 'hearts', plush: 'squish' }
      var fxi = function (cls, x, y, s, d, inner, r) { return '<i class="wl-fx-' + cls + '" style="--fx:' + x + '%;--fy:' + y + '%;--fs:' + s + '%' + (d ? ';--fd:' + d + 's' : '') + (r ? ';--fr:' + r + 'deg' : '') + '">' + (inner || '') + '</i>' }
      var FX = {
        pop: function () { return '<i class="wl-fx-ring"></i>' },
        shine: function () { return '<i class="wl-fx-shine"></i>' },
        glint: function () { return '<i class="wl-fx-shine"></i>' + fxi('star', 68, 10, 22, .25, SPARK) },
        hearts: function () { return fxi('heart', 62, 16, 20, 0, HEART) + fxi('heart', 20, 26, 14, .22, HEART, -10) },
        sparkle: function () { return fxi('star', 12, 14, 22, 0, SPARK) + fxi('star', 70, 8, 16, .18, SPARK) + fxi('star', 72, 66, 19, .34, SPARK) },
        bubbles: function () { return fxi('bubble', 20, 62, 12) + fxi('bubble', 70, 58, 9, .2) + fxi('bubble', 56, 70, 14, .4) },
        peel: function () { return '<i class="wl-fx-peel"></i>' },
        steps: function () { return fxi('coin', 68, 24, 9) },
        glow: function () { return '<i class="wl-fx-glow"></i>' },
        measure: function () { return '<i class="wl-fx-measure"></i>' }
      }
      var MOMENT_MS = { pop: 900, shine: 1150, glint: 1300, hearts: 1800, sparkle: 1600, bubbles: 2000, peel: 1450, steps: 950, glow: 2450,
        measure: 1650, squish: 1200, sway: 1350, wiggle: 950, spin: 1250, press: 750 }

      /* ───── build: a sign, then that family's cards, for each family; the kraft tag with the sum closes the line ───── */
      var seq = []
      WI.GROUPS.forEach(function (g) {
        var st = g.styles.filter(function (s) { return AV.indexOf(s) >= 0 && INFO[s] && D.cards[s] && hasIc(D.cards[s], s) })
        if (!st.length) return
        seq.push({ kind: 'sign', group: g })
        st.forEach(function (s) { seq.push({ kind: 'card', style: s, group: g }) })
      })
      if (!seq.length) return
      seq.push({ kind: 'tag', group: seq[seq.length - 1].group })
      var items = [], cards = [], signs = [], poms = [], tagIt = null
      var CN = WI.counts ? WI.counts() : { icons: 500, styles: AV.length, svgs: 500 * AV.length }
      var fmt = WI.fmt || String
      list.innerHTML = ''
      seq.forEach(function (it, i) {
        var g = it.group
        if (it.kind === 'sign' || it.kind === 'tag') {
          var el = doc.createElement('div')
          if (it.kind === 'sign') {
            el.className = 'wl-sign f-' + g.id
            var isNew = g.styles.some(function (s) { return INFO[s] && INFO[s].isNew })
            el.innerHTML = '<div class="wl-swing"><span class="wl-sign-thread"></span><span class="wl-sign-tag">' + esc(g.title.toLowerCase()) + (isNew ? '<span class="wl-sign-new">new</span>' : '') + '</span></div>'
            signs.push(it)
          } else {
            // the sum, as a kraft luggage tag on the line (aria-hidden: the same words are in the list's description)
            el.className = 'wl-sign wl-tag'
            el.innerHTML = '<div class="wl-swing"><span class="wl-sign-thread"></span><span class="wl-tag-card"><b data-count="icons">' + fmt(CN.icons) + '</b> × <b data-count="styles">' + CN.styles +
              '</b> = <b class="wl-tag-sum"><span data-count="svgs">' + fmt(CN.svgs) + '</span> ways</b></span></div>'
            tagIt = it
          }
          signsBox.appendChild(el)
          it.el = el
          it.swingEl = el.firstChild
        } else {
          var s = it.style, info = INFO[s], name = D.cards[s]
          var li = doc.createElement('li')
          li.className = 'wl-card s-' + s + ' wl-st-' + s + ' f-' + g.id
          li.style.setProperty('--in', (rnd() * 18 - 9).toFixed(1) + 'deg')
          li.style.setProperty('--rest', (rnd() * 5 - 2.5).toFixed(2) + 'deg')
          // the idle sway: every card its own period (4.6–6.2 s) and phase, so the line breathes without marching
          var per = 4.6 + rnd() * 1.6
          li.style.setProperty('--sdur', (per / 2).toFixed(2) + 's')
          li.style.setProperty('--sd', (-rnd() * per).toFixed(2) + 's')
          var label = info.title + ' style, ' + g.title + ' family' + (info.isNew ? ', new' : '') + '. ' + (info.description || '')
          li.innerHTML = '<div class="wl-swing"><div class="wl-sway"><div class="wl-body"><span class="wl-peg" aria-hidden="true"></span>' +
            '<a class="wl-paper" href="' + esc(WI.url('styles/' + s + '.html')) + '" draggable="false" tabindex="-1" aria-label="' + esc(label) + '">' +
            '<span class="wl-photo" aria-hidden="true"><span class="wl-ic">' + ic(name, s, 64) + '</span><span class="wl-film"></span><span class="wl-fx"></span></span>' +
            '<span class="wl-cap" aria-hidden="true">' + esc(info.title.toLowerCase()) + '</span></a>' +
            // a mouse can also open the icon itself: a small chip in the photo's corner, shown on hover (never on touch)
            (fine ? '<a class="wl-ic-a" href="' + esc(iconHref(name, s)) + '" draggable="false" tabindex="-1" aria-hidden="true"><span class="wl-ic-n">' + esc(name) + '</span>' + ARROW + '</a>' : '') +
            '<span class="wl-burst" aria-hidden="true"></span></div></div></div>'
          list.appendChild(li)
          it.el = li; it.name = name; it.shown = name; it.want = name
          it.swingEl = $('.wl-swing', li)
          it.paper = $('.wl-paper', li); it.photo = $('.wl-photo', li); it.icEl = $('.wl-ic', li); it.film = $('.wl-film', li); it.fx = $('.wl-fx', li)
          it.icA = $('.wl-ic-a', li); it.icN = $('.wl-ic-n', li); it.burst = $('.wl-burst', li)
          it.ci = cards.length
          cards.push(it)
        }
        it.rand = rnd(); it.swings = []
        items.push(it)
        // a pom-pom (a fairy light at night) in the gap after every item, in that family's colour
        var p = doc.createElement('i')
        p.className = 'wl-pom f-' + g.id + (i % 2 ? ' alt' : '')
        p.style.setProperty('--d', (-rnd() * 3.8).toFixed(2) + 's')
        pomsBox.appendChild(p)
        poms.push({ el: p, after: it })
      })
      var N = cards.length
      var movers = items.concat(poms)

      // the sky: the sun and the moon are our own kawaii icons; two clouds that keep to the top corners
      var sun = $('[data-sky="sun"]', root), moon = $('[data-sky="moon"]', root)
      if (sun && D.sky && D.sky.sun) sun.innerHTML = ic(D.sky.sun[1], D.sky.sun[0], 88)
      if (moon && D.sky && D.sky.moon) moon.innerHTML = ic(D.sky.moon[1], D.sky.moon[0], 80)
      far.innerHTML = '<span class="wl-cloud wl-cloud-a">' + CLOUD + '</span><span class="wl-cloud wl-cloud-b">' + CLOUD + '</span>'

      /* ───── metrics + the curve ───── */
      var M = {}, L = 0, pad = 0, Wd = 0, Hd = 0, cardH = 170, Dms = 1, parked = false
      var num = function (name, dflt) { var v = parseFloat(getComputedStyle(root).getPropertyValue(name)); return isFinite(v) ? v : dflt }
      function curveY(x) { var u = clamp((x + 40) / (Wd + 80), -0.2, 1.2); return M.y0 + M.sag * 4 * u * (1 - u) }
      function layout() {
        Wd = root.clientWidth; Hd = root.clientHeight
        M.cw = num('--cw', 136); M.slot = num('--slot', 178); M.tslot = num('--tslot', 124); M.gslot = num('--gslot', 230); M.y0 = num('--y0', 112); M.sag = num('--sag', 46)
        M.speed = Wd < 1100 ? 20 : 23
        // touch screens and phones: the line is parked (it sways, and moves when swiped); a mouse gets the slow drift
        parked = !fine || Wd < 640
        var c = 0
        items.forEach(function (it) { var w = it.kind === 'sign' ? M.tslot : it.kind === 'tag' ? M.gslot : M.slot; it.bx = c + w / 2; it.w = w; c += w })
        L = c
        // a very wide screen must never see the loop's seam: stretch the spacing until the line is longer than the view
        var k = (Wd + 2 * M.slot + 40) / L
        if (k > 1) { items.forEach(function (it) { it.bx *= k; it.w *= k }); L *= k }
        pad = M.slot
        poms.forEach(function (p, i) { var a = p.after, b = items[(i + 1) % items.length]; p.bx = a.bx + a.w / 2 + (b.kind !== 'card' ? -6 : 0) })
        var d = 'M -40 ' + M.y0 + ' Q ' + (Wd / 2) + ' ' + (M.y0 + 2 * M.sag) + ' ' + (Wd + 40) + ' ' + M.y0
        twine.setAttribute('d', d); twineHi.setAttribute('d', d)
        cardH = cards[0] ? cards[0].el.offsetHeight : 170
        Dms = L / M.speed * 1000
      }

      /* ───── the drift: one Web Animation per item, all on one clock ─────
         Keyframes run x from L - pad down to -pad with y on the curve; an item's place in the loop is its (negative)
         delay. Offset (px) and the shared clock ct (ms) map one-to-one: offset = -ct / Dms * L. */
      var anims = [], playing = false, rate = 0, applied = -1, manual = false, offset = 0
      // guard: a zero width/duration mid-resize (or a hidden tab) must never produce NaN times
      var ctOf = function (off) { var c = mod(-off / L * Dms, Dms); return isFinite(c) ? c : 0 }
      var offOf = function (ct) { return -ct / Dms * L }
      function curOffset() { return (manual || !anims.length) ? offset : offOf(anims[0].currentTime || 0) }
      var xOf = function (it, off) { return mod(it.bx + off, L) - pad }
      function buildAnims() {
        anims.forEach(function (a) { a.cancel() }); anims = []; playing = false; applied = -1
        var STOPS = 64, kf = []
        for (var i = 0; i <= STOPS; i++) {
          var u = i / STOPS, x = L - pad - u * L
          kf.push({ transform: 'translate3d(' + x.toFixed(1) + 'px,' + curveY(x).toFixed(1) + 'px,0)', offset: u })
        }
        if (!canAnim) return
        movers.forEach(function (m) {
          var u0 = (L - mod(m.bx, L)) / L
          var a = m.el.animate(kf, { duration: Dms, delay: -u0 * Dms, iterations: Infinity, easing: 'linear', fill: 'both' })
          a.pause()
          anims.push(a)
        })
        setCt(ctOf(offset))
      }
      function setCt(ct) {
        if (!canAnim) { movers.forEach(function (m) { var x = xOf(m, offOf(ct)); m.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + curveY(x).toFixed(1) + 'px,0)' }); return }
        if (!isFinite(ct)) ct = 0
        for (var i = 0; i < anims.length; i++) anims[i].currentTime = ct
      }
      // free mode: play at `rate` (pause outright at rest, so nothing ticks)
      function applyRate(r) {
        if (!anims.length) return
        // quantised coarsely, and through updatePlaybackRate: every new rate re-syncs all the drift animations, so the
        // speed only changes in a few steps while it eases (a new rate every frame would keep them pending and busy)
        r = Math.round(r * 4) / 4
        var run = visible && !manual && r > 0
        if (run) {
          if (r !== applied) { for (var i = 0; i < anims.length; i++) { if (anims[i].updatePlaybackRate) anims[i].updatePlaybackRate(r); else anims[i].playbackRate = r } applied = r }
          if (!playing) { for (var j = 0; j < anims.length; j++) anims[j].play(); playing = true }
        } else if (playing) { for (var q = 0; q < anims.length; q++) anims[q].pause(); playing = false }
      }
      function enterManual() {
        if (manual) return
        offset = curOffset(); manual = true
        applyRate(0); rate = 0
      }
      function exitManual() {
        if (!manual) return
        setCt(ctOf(offset)); manual = false; rate = 0
        kick()
      }

      /* ───── swings: a damped pendulum, ONE plain (replace) Web Animation per hanger, so it stays on the compositor ─────
         (additive animations cannot be composited). A new kick starts from wherever the hanger is now: the old swing's
         angle is read back, the old animation is cancelled, and the new one rings down from that angle plus the kick.
         The rest tilt lives on the separate `rotate` property, so it never fights the transform. */
      function swing(it, amp, delay) {
        if (calm() || !canAnim || !it.swingEl || Math.abs(amp) < .3) return
        if (delay > 16) { clearTimeout(it.swT); it.swT = setTimeout(function () { it.swT = 0; swing(it, amp, 0) }, delay); return }
        amp = clamp(amp, -16, 16)
        var n = 26, dur = 2600, w = 2 * Math.PI / (it.kind === 'card' ? .98 : 1.15), tau = it.kind === 'card' ? .62 : .5
        var ang = function (S, t) { return Math.exp(-t / tau) * (S.a0 * Math.cos(w * t) + S.amp * Math.sin(w * t)) }
        // where the hanger is now, from the running swing's own formula (no style read-back, so no forced recalc)
        var a0 = 0, S = it.sw
        if (S && it.swings.length) { var ts = (now() - S.t0) / 1000; if (ts < dur / 1000) a0 = ang(S, ts) }
        it.swings.forEach(function (x) { x.cancel() })
        S = it.sw = { a0: a0, amp: amp, t0: now() }
        // the ring-down takes 2.6 s, then a long, still tail: a composited animation that ends every few seconds keeps
        // Chrome's main thread ticking frames (measured), one that simply rests at 0 for a while does not
        var kf = [], TAIL = 30000
        for (var i = 0; i <= n; i++) kf.push({ transform: 'rotate(' + clamp(ang(S, i / n * dur / 1000), -18, 18).toFixed(2) + 'deg)', offset: i / n * dur / TAIL })
        kf.push({ transform: 'rotate(0deg)', offset: 1 })
        var a = it.swingEl.animate(kf, { duration: TAIL, easing: 'linear' })
        it.swings = [a]
        a.onfinish = function () { if (it.swings[0] === a) it.swings = [] }
      }
      function stopSwings(it) { clearTimeout(it.swT); it.swT = 0; it.swings.forEach(function (x) { x.cancel() }); it.swings = [] }

      /* ───── state ───── */
      var visible = false, held = false, hover = false, focusIn = false, started = false
      var drag = null, glide = null, glideCard = null, glideSay = false, fling = false, v = 0, vPeak = 0
      var raf = 0, last = 0, restUntil = 0, pushS = 0, gust = null
      var still = function () { return isReduced() || held }
      function calm() { return isReduced() || held }
      function target() {
        if (parked || still() || hover || focusIn || !started || now() < restUntil) return 0
        var gb = 0
        if (gust) { var f = gust.front(now()); gb = Math.max(0, Math.sin(Math.PI * clamp((f + 300) / (Wd + 600), 0, 1))) * .8 }
        return 1 + gb + pushS / M.speed
      }
      function nearestCard() {
        var best = 0, bd = 1e9, off = curOffset()
        cards.forEach(function (c, i) { var d = Math.abs(xOf(c, off) - Wd / 2); if (d < bd) { bd = d; best = i } })
        return best
      }
      function offsetFor(c, at) { var t = (at == null ? Wd / 2 : at) + pad - c.bx, o = curOffset(); return t + Math.round((o - t) / L) * L }

      /* ───── the loop: only while the line is dragged, flung, or glides to a card ───── */
      function frame(t) {
        raf = 0
        var rdt = last ? clamp((t - last) / 1000, .0005, .1) : 1 / 60; last = t
        var busy = false
        if (manual) {
          if (drag) { /* the move handler sets the clock */ }
          else if (glide != null) {
            if (isReduced()) { offset = glide; v = 0 }
            else {
              var sub = Math.ceil(rdt / (1 / 120)), h = rdt / sub
              for (var g = 0; g < sub; g++) { var ga = 42 * (glide - offset) - 13 * v; v += ga * h; offset += v * h }
              if (Math.abs(v) > Math.abs(vPeak)) vPeak = v
            }
            if (Math.abs(glide - offset) < .35 && Math.abs(v) < 3) { offset = glide; v = 0; glide = null; setCt(ctOf(offset)); landed(); exitManual() }
            else { setCt(ctOf(offset)); busy = true }
          } else if (fling) {
            v *= Math.exp(-rdt * 3.4); offset += v * rdt; setCt(ctOf(offset))
            if (Math.abs(v) < 40) {
              fling = false; settle(vPeak)
              // parked: come to rest with a card in the middle (a gentle snap, like a carousel)
              if (parked) glideTo(nearestCard()); else exitManual()
            }
            busy = true
          }
        }
        if (visible && busy && manual) raf = requestAnimationFrame(frame)
        else { last = 0; if (!manual) kick() }
      }
      /* the speed governor: in free mode the speed (hover-stop, the gust, a scroll push) eases on a slow timer, never
         on a per-frame loop, so the compositor keeps the line moving without the main thread drawing every frame */
      var govT = 0, govLast = 0
      function govern() {
        govT = 0
        if (manual) return
        var t = now(), rdt = govLast ? clamp((t - govLast) / 1000, .01, .5) : .16; govLast = t
        var tg = target()
        rate += (tg - rate) * (1 - Math.exp(-rdt * (tg > rate ? 1.5 : 3.4)))
        if (Math.abs(tg - rate) < .02 || isReduced()) rate = tg
        applyRate(rate)
        pushS *= Math.exp(-rdt * 2.6); if (pushS < .05) pushS = 0
        if (gust && gust.front(now()) > Wd + 300) gust = null
        if (visible && (rate !== tg || gust || pushS > 0)) govT = setTimeout(govern, 160)
        else govLast = 0
      }
      function kick() {
        if (!visible) return
        if (manual) { if (!raf) raf = requestAnimationFrame(frame) }
        else if (!govT) govT = setTimeout(govern, 0)
      }
      // the line stops: the cards carry on a little and swing back (inertia)
      function settle(vel) {
        var off = curOffset()
        items.forEach(function (it) { var x = xOf(it, off); if (x > -M.cw && x < Wd + M.cw) swing(it, clamp(-vel * .008, -6, 6) * (.8 + .4 * it.rand), it.rand * 60) })
        vPeak = 0
      }

      /* ───── landing: a squash from the peg and three four-point sparkles ───── */
      function land(c, sparkle) {
        if (isReduced() || !c || !canAnim) return
        c.paper.animate([{ transform: 'none' }, { transform: 'scale(1.04, .955)', offset: .28 }, { transform: 'scale(.985, 1.02)', offset: .58 }, { transform: 'none' }],
          { duration: 700, easing: 'cubic-bezier(.23, 1, .32, 1)' })
        if (sparkle) {
          c.burst.innerHTML = [[-9, 12, 17, 0], [88, 4, 13, .07], [94, 58, 19, .14]].map(function (b) {
            return '<i style="--bx:' + b[0] + '%;--by:' + b[1] + '%;--bs:' + b[2] + 'px;--bd:' + b[3] + 's">' + SPARK + '</i>'
          }).join('')
          clearTimeout(c.burstT); c.burstT = setTimeout(function () { c.burst.innerHTML = '' }, 1200)
        }
      }
      function landed() {
        var c = glideCard; glideCard = null
        settle(vPeak)
        if (!c) return
        land(c, true)
        if (glideSay) { glideSay = false; WI.announce(INFO[c.style].title + ', ' + (c.ci + 1) + ' of ' + N + ', ' + c.group.title) }
      }
      function glideTo(ci, say) {
        var c = cards[ci]; if (!c) return
        enterManual()
        glide = offsetFor(c); glideCard = c; glideSay = !!say; fling = false; vPeak = 0
        kick()
      }

      /* ───── moments: one card in the middle of the view does its style's trick ───── */
      var momentOn = null
      function playMoment(it, type) {
        if (it.busy || isReduced() || it.dev) return
        type = type || MOMENT[it.style] || 'pop'
        it.busy = true; momentOn = it
        it.fx.innerHTML = FX[type] ? FX[type]() : ''
        it.el.classList.add('wl-m-' + type)
        setTimeout(function () { it.el.classList.remove('wl-m-' + type); it.fx.innerHTML = ''; it.busy = false; if (momentOn === it) momentOn = null }, MOMENT_MS[type] || 1200)
      }
      function moment() {
        if (momentOn || costumeOn || gust) return
        var off = curOffset()
        var pool = cards.filter(function (c) { var x = xOf(c, off); return !c.busy && x > Wd * .25 && x < Wd * .75 })
        if (pool.length) playMoment(pool[Math.floor(rnd() * pool.length)])
      }

      /* ───── the costume change: a gust blows through and every polaroid develops into the same icon ───── */
      var dressed = null, dressBy = null, autoK = 0, costumeOn = false, costumeT = []
      var iconFor = function (c) { return dressed && hasIc(dressed, c.style) ? dressed : c.name }
      function swapNow(c, name) {
        c.shown = name
        c.icEl.innerHTML = ic(name, c.style, 64)
        if (c.icA) { c.icA.setAttribute('href', iconHref(name, c.style)); c.icN.textContent = name }
      }
      // a Polaroid develops: the old picture fades back, a cream film washes over, the new one comes up through it
      function develop(c) {
        if (c.dev || c.want === c.shown) return
        if (calm() || !visible || !canAnim) { swapNow(c, c.want); return }
        c.dev = true
        var name = c.want, old = c.icEl
        var nu = doc.createElement('span'); nu.className = 'wl-ic'; nu.innerHTML = ic(name, c.style, 64)
        old.parentNode.insertBefore(nu, old.nextSibling)
        c.icEl = nu; c.shown = name
        if (c.icA) { c.icA.setAttribute('href', iconHref(name, c.style)); c.icN.textContent = name }
        // the old picture simply goes under the film (it is at .85 by 190 ms) and is removed there: one animation fewer
        clearTimeout(c.oldT); c.oldT = setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old) }, 190)
        c.film.animate([{ opacity: 0 }, { opacity: .85, offset: .3 }, { opacity: 0 }], { duration: 640, easing: 'ease-in-out' })
        var a = nu.animate([{ opacity: .15, transform: 'scale(1.06)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 90, easing: 'cubic-bezier(.2, .7, .3, 1)', fill: 'backwards' })
        a.onfinish = a.oncancel = function () {
          if (old.parentNode) old.parentNode.removeChild(old)
          c.dev = false
          if (c.want !== c.shown) develop(c)
        }
      }
      /* the gust travels left to right; each card swings (and develops, if asked) as the wind front reaches it */
      function blow(opts) {
        var t0 = now(), sp = Wd < 640 ? 640 : 860, power = opts.power
        var g = { front: function (t) { return -260 + sp * (t - t0) / 1000 } }
        if (!parked && opts.curl) gust = g
        var rel = sp + (parked ? 0 : M.speed * Math.max(rate, 0)), off = curOffset()
        items.forEach(function (it) {
          var x = xOf(it, off), on = x > -M.cw && x < Wd + M.cw && visible
          var delay = Math.max(0, (x + 260) / rel * 1000)
          if (it.kind === 'card' && opts.dress) {
            it.want = iconFor(it)
            if (!on || calm()) { clearTimeout(it.devT); if (!it.dev) swapNow(it, it.want); return }
            clearTimeout(it.devT); it.devT = setTimeout(function () { develop(it) }, delay)
          }
          if (on) swing(it, -power * (.7 + .6 * it.rand) * (it.kind === 'card' ? 1 : .6), delay)
        })
        if (opts.curl && wind && canAnim && !calm() && visible) {
          // the curls ride low, between the note and the twine, and stay faint until they are past the note's words
          var span = Wd + 520, uOf = function (x) { return clamp((x + 380) / span, 0, 1) }
          var nr = noteEl ? noteEl.getBoundingClientRect() : null, rr = root.getBoundingClientRect()
          var past = nr ? uOf(nr.right - rr.left + 8) : .1
          var kf = [{ transform: 'translate3d(-380px,0,0)', opacity: 0, offset: 0 }, { opacity: .22, offset: Math.min(.08, past / 2) }]
          if (past > .1) kf.push({ opacity: .22, offset: past })
          kf.push({ opacity: .85, offset: Math.min(.9, Math.max(past, .1) + .08) }, { opacity: .7, offset: .93 }, { transform: 'translate3d(' + (Wd + 140) + 'px,0,0)', opacity: 0, offset: 1 })
          try { windA && windA.cancel(); windA = wind.animate(kf, { duration: span / sp * 1000, easing: 'linear' }) } catch (e) { /* odd offsets: skip the curls */ }
        }
        kick()
      }
      function dress(name, by, quiet) {
        dressed = name; dressBy = name ? by : null
        paintChips()
        // dressing: a proper gust with the wind curl; undressing: a softer breeze
        blow({ dress: true, curl: !!name && !quiet, power: name ? 6.5 : 3.5 })
      }
      function clearCostume() { costumeT.forEach(clearTimeout); costumeT = []; costumeOn = false }
      // a costume is only offered once every polaroid can wear it (so "all 20 now show…" is always true)
      var ready = function (n) { return cards.every(function (c) { return hasIc(n, c.style) }) }
      function costume() {
        if (!D.try || !D.try.length || dressBy) return
        // never the icon the hero is showing right now: the gust should be a surprise, not an echo
        var name = null
        for (var k = 0; k < D.try.length && !name; k++) {
          var n = D.try[autoK++ % D.try.length]
          if (ready(n) && !(ST && ST.icon === n)) name = n
        }
        if (!name || !cards.some(function (c) { return name !== c.name })) return
        costumeOn = true
        dress(name, 'auto')
        // hold once the gust has crossed the screen, then develop back
        var cross = (Wd + 520) / (Wd < 640 ? 640 : 860) * 1000
        costumeT.push(setTimeout(function () {
          if (dressBy === 'auto') dress(null, null)
          costumeT.push(setTimeout(function () { costumeOn = false }, cross))
        }, cross + 3500))
      }
      // a user costume presses its chip; an automatic one only lights it (a soft ring, aria-pressed stays false), so people
      // learn the chips do the same thing
      function paintChips() {
        if (!chipsBox) return
        $$('.wl-chip', chipsBox).forEach(function (b) {
          var n = b.getAttribute('data-n')
          b.setAttribute('aria-pressed', dressBy === 'user' && n === dressed ? 'true' : 'false')
          b.classList.toggle('is-auto', dressBy === 'auto' && n === dressed)
          if (ready(n)) b.removeAttribute('aria-disabled'); else b.setAttribute('aria-disabled', 'true')
        })
      }
      if (chipsBox && D.try && D.try.length) {
        chipsBox.innerHTML = D.try.map(function (n) {
          return '<button type="button" class="wl-chip" data-n="' + esc(n) + '" aria-pressed="false" aria-label="' + esc(cap(n)) + '" title="' + esc(cap(n)) + '">' + ic(n, D.tryStyle || 'line', 22) + '</button>'
        }).join('')
        chipsBox.addEventListener('click', function (e) {
          var b = e.target.closest('.wl-chip'); if (!b) return
          var n = b.getAttribute('data-n')
          if (!ready(n)) return
          clearCostume(); if (costumeAt) costumeAt = TT + 20
          if (dressBy === 'user' && dressed === n) { dress(null, null); WI.announce('Each style shows its own icon again') }
          else { dress(n, 'user'); WI.announce('All ' + N + ' styles now show the ' + n.replace(/-/g, ' ')) }
        })
        // the rest of the costumes ride in the second pack: whatever was waiting for it changes as soon as it lands
        more.push(function () { paintChips(); if (dressed) dress(dressed, dressBy, true) })
        paintChips()
      } else if (chipsBox) chipsBox.parentNode.hidden = true

      /* ───── the family spotlight: hover a sign and its family lifts while the others step back a little ───── */
      var spot = null
      function setSpot(id) {
        if (spot === id) return
        spot = id
        cards.forEach(function (c) { c.el.classList.toggle('is-dim', !!id && c.group.id !== id); c.el.classList.toggle('is-lit', !!id && c.group.id === id) })
        signs.forEach(function (s) { s.el.classList.toggle('is-dim', !!id && s.group.id !== id) })
      }
      signs.forEach(function (s) {
        s.el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') setSpot(s.group.id) })
        s.el.addEventListener('pointerleave', function () { setSpot(null) })
        s.el.addEventListener('click', function () {
          if (suppress) return
          var first = cards.filter(function (c) { return c.group === s.group })[0]
          if (first) { setTab(first.ci); glideTo(first.ci); rest(4000) }
        })
      })
      function rest(ms) { restUntil = now() + ms; setTimeout(kick, ms + 30) }

      /* ───── pointer: brush past, hover to stop, drag and fling (swipe on touch) ───── */
      var rect = null, suppress = false, lastPx = null, lastSy = W.scrollY || 0, lastSt = 0
      var rel = function (e) { if (!rect) rect = root.getBoundingClientRect(); return { x: e.clientX - rect.left, y: e.clientY - rect.top } }
      W.addEventListener('scroll', function () {
        rect = null
        if (!visible || parked || still()) return
        // scrolling the page gives the line a little push along (never backwards)
        var sy = W.scrollY || W.pageYOffset || 0, t = now(), dt = Math.max(16, t - lastSt)
        var sv = Math.abs(sy - lastSy) / dt * 1000; lastSy = sy; lastSt = t
        if (dt < 200) { pushS = Math.max(pushS, Math.min(46, sv * .06)); kick() }
      }, { passive: true })
      root.addEventListener('pointermove', function (e) {
        var p = rel(e)
        if (drag && e.pointerId === drag.id) {
          var dx = p.x - drag.x0, dy = p.y - drag.y0
          // mostly vertical before it moved: that is a page scroll or a cancelled click, never a drag
          if (!drag.moved && Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { drag = null; kick(); return }
          if (!drag.moved && Math.abs(dx) > 6) {
            drag.moved = true; root.classList.add('is-grabbing')
            enterManual(); drag.o0 = offset - dx; glide = null; glideCard = null; fling = false
            try { root.setPointerCapture(e.pointerId) } catch (err) { /* noop */ }
          }
          if (drag.moved) {
            var nt = now(), no = drag.o0 + dx
            var dtt = Math.max(1, nt - drag.t) / 1000
            drag.v = drag.v * .6 + ((no - offset) / dtt) * .4
            offset = no; drag.t = nt
            setCt(ctOf(offset))
          }
          return
        }
        if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
          var wasHover = hover
          hover = p.y > M.y0 - 30 && p.y < M.y0 + M.sag + cardH + 26
          // brushing past a card sets it swinging
          if (lastPx != null && !still()) {
            var mdx = p.x - lastPx, t = now(), off = curOffset()
            if (Math.abs(mdx) > 1.5) {
              for (var i = 0; i < items.length; i++) {
                var it = items[i], x = xOf(it, off), y = curveY(x)
                if (Math.abs(x - p.x) < M.cw * .55 && p.y > y + 4 && p.y < y + cardH && t - (it.brushAt || 0) > 260) { it.brushAt = t; swing(it, -clamp(mdx * .45, -9, 9), 0) }
              }
            }
          }
          lastPx = p.x
          if (hover !== wasHover) kick()
        }
      }, { passive: true })
      root.addEventListener('pointerleave', function () {
        hover = false; lastPx = null; setSpot(null)
        if (drag && !drag.moved) drag = null
        kick()
      })
      root.addEventListener('pointerdown', function (e) {
        if (e.button !== 0 || e.target.closest('.wl-foot')) return
        var p = rel(e)
        drag = { id: e.pointerId, x0: p.x, y0: p.y, o0: 0, t: now(), v: 0, moved: false }
      })
      function endDrag(e) {
        if (!drag || (e && e.pointerId != null && e.pointerId !== drag.id)) return
        var d = drag; drag = null
        root.classList.remove('is-grabbing')
        if (d.moved) {
          suppress = true; setTimeout(function () { suppress = false }, 0)
          v = clamp(d.v, -1800, 1800); vPeak = v
          if (isReduced() || Math.abs(v) < 40) { settle(v); if (parked) glideTo(nearestCard()); else exitManual() }
          else fling = true
        }
        kick()
      }
      // the release can happen anywhere (outside the band too): always end the drag at window level
      W.addEventListener('pointerup', endDrag)
      W.addEventListener('pointercancel', endDrag)
      // (only our own capture: touch starts with an implicit capture on the link, which is lost when the band takes it)
      root.addEventListener('lostpointercapture', function (e) { if (e.target === root) endDrag(e) })
      // a drag never opens a link
      root.addEventListener('click', function (e) { if (suppress) { e.preventDefault(); e.stopPropagation(); suppress = false } }, true)
      // hovering a card plays its trick straight away
      cards.forEach(function (c) {
        $('.wl-body', c.el).addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' && !still() && !drag && !momentOn) playMoment(c) })
      })

      /* ───── keyboard: one tab stop; the arrows walk the line ───── */
      var tabI = -1
      // the one tab stop also carries the "use the arrow keys" description, so it is read out when focus lands on it
      function setTab(i) {
        if (i === tabI || !cards[i]) return
        if (tabI >= 0) { cards[tabI].paper.setAttribute('tabindex', '-1'); cards[tabI].paper.removeAttribute('aria-describedby') }
        tabI = i; cards[i].paper.setAttribute('tabindex', '0'); cards[i].paper.setAttribute('aria-describedby', 'wl-keys')
      }
      list.addEventListener('keydown', function (e) {
        var k = e.key, i = tabI
        if (k === 'ArrowRight' || k === 'ArrowDown') i = (tabI + 1) % N
        else if (k === 'ArrowLeft' || k === 'ArrowUp') i = (tabI - 1 + N) % N
        else if (k === 'Home') i = 0
        else if (k === 'End') i = N - 1
        else return
        e.preventDefault()
        setTab(i); cards[i].paper.focus({ preventScroll: true })
      })
      list.addEventListener('focusin', function (e) {
        var li = e.target.closest('.wl-card'); if (!li) return
        var c = cards.filter(function (x) { return x.el === li })[0]; if (!c) return
        setTab(c.ci)
        // keyboard focus only: a press that starts a drag (or a tap) also focuses the link, and must not steer the line
        var kb = true; try { kb = e.target.matches(':focus-visible') } catch (err) { /* old engines: treat as keyboard */ }
        if (!kb) return
        focusIn = true; glideTo(c.ci)
      })
      list.addEventListener('focusout', function (e) { if (!list.contains(e.relatedTarget)) { focusIn = false; kick() } })
      // overflow: clip fallback: focus must never scroll the band sideways
      root.addEventListener('scroll', function () { root.scrollLeft = 0; root.scrollTop = 0 })

      /* ───── controls ───── */
      $('.wl-ctrl', root).addEventListener('click', function (e) {
        var b = e.target.closest('[data-wl]'); if (!b) return
        var act = b.getAttribute('data-wl')
        if (act === 'hold') {
          held = !held
          b.setAttribute('aria-pressed', held ? 'true' : 'false')
          b.setAttribute('aria-label', held ? 'Play the line' : 'Pause the line')
          root.classList.toggle('is-held', held)
          if (held) {
            // everything stops where it is: the swings, any wind, and costumes waiting for the gust (they change in place)
            items.forEach(function (it) {
              stopSwings(it)
              if (it.devT) { clearTimeout(it.devT); it.devT = 0; if (!it.dev && it.want !== it.shown) swapNow(it, it.want) }
            })
            if (windA) windA.cancel()
          }
          kick(); return
        }
        var base = glideCard ? glideCard.ci : nearestCard()
        var n = (base + (act === 'next' ? 1 : -1) + N) % N
        setTab(n); glideTo(n, true); rest(4000)
      })
      function paintHold() { if (holdBtn) holdBtn.hidden = isReduced() && !held }

      /* ───── the director: tricks and the costume change, on a clock that only runs while the line is seen ───── */
      var TT = 0, dLast = 0, nextMoment = 9, costumeAt = 0, tabAt = 0
      setInterval(function () {
        var t = now(), dt = dLast ? Math.min(.5, (t - dLast) / 1000) : 0; dLast = t
        if (!visible || !started) return
        if (!focusIn && TT >= tabAt) { tabAt = TT + 1.2; setTab(nearestCard()) }
        // cards well off screen stop their idle sway (fewer running animations for every frame the page draws)
        var off = curOffset(), mg = M.cw * 1.5
        for (var i = 0; i < N; i++) { var c = cards[i], x = xOf(c, off), far = x < -mg || x > Wd + mg; if (far !== !!c.far) { c.far = far; c.el.classList.toggle('is-far', far) } }
        if (still() || drag) return
        TT += dt
        if (costumeAt && TT >= costumeAt && !costumeOn && !dressBy) { costumeAt = TT + 20; costume() }
        if (TT >= nextMoment) { nextMoment = TT + 8 + rnd() * 4; if (!hover) moment() }
      }, 250)

      /* ───── lifecycle ───── */
      function enter() {
        if (started) return
        started = true
        if (isReduced()) { root.classList.add('is-in'); return }
        // the twine draws on, then the cards are pegged on one by one, left to right, each landing with a swing
        var off = curOffset()
        var vis = items.filter(function (it) { var x = xOf(it, off); it.x0 = x; return x > -M.cw && x < Wd + M.cw }).sort(function (a, b) { return a.x0 - b.x0 })
        // only what is on screen animates in (the rest is simply there when it drifts into view)
        vis.forEach(function (it, k) {
          it.el.style.setProperty('--k', k); it.el.classList.add('is-drop')
          swing(it, (it.rand > .5 ? 1 : -1) * (5 + it.rand * 4), 250 + k * 75 + 560)
        })
        root.classList.add('is-drawing', 'is-intro', 'is-in')
        var mid = cards[nearestCard()]
        setTimeout(function () { land(mid, true) }, 250 + Math.max(0, vis.indexOf(mid)) * 75 + 640)
        var endMs = 250 + vis.length * 75 + 640
        setTimeout(function () { root.classList.remove('is-intro', 'is-drawing'); vis.forEach(function (it) { it.el.classList.remove('is-drop') }) }, endMs + 900)
        // the story beat ends the entrance: 2.5 s after the last card lands, the first gust dresses everyone alike
        costumeAt = TT + endMs / 1000 + 2.5
        kick()
      }
      function onVisible(vv) {
        visible = vv
        root.classList.toggle('is-paused', !vv)
        if (vv) { last = 0; kick() } else applyRate(0)
      }
      root.classList.add('is-ready')   // before measuring: the no-JS layout of the list must not apply
      layout()
      // open on the newest, cutest end of the set: with a mouse the storybook family (its sign, its five cards and the
      // kraft tag with the sum) sits in the middle, and the drift then brings the everyday family round; on a parked
      // (touch) line the plush bunny is in the middle, with the tag peeking in to invite a swipe
      var story = items.filter(function (it) { return it.group && it.group.id === 'storybook' && it.kind !== 'tag' })
      var plush = cards.filter(function (c) { return c.style === 'plush' })[0]
      function home() {
        if (parked && plush) return Wd / 2 + pad - plush.bx
        if (story.length) { var a = story[0], b = tagIt && tagIt.group.id === 'storybook' ? tagIt : story[story.length - 1]; return Wd / 2 + pad - (a.bx - a.w / 2 + b.bx + b.w / 2) / 2 }
        return Wd / 2 + pad - cards[Math.floor(N / 2)].bx
      }
      offset = home()
      buildAnims()
      if (isReduced()) { started = true; root.classList.add('is-in') }
      setTab(nearestCard())
      paintHold()
      // the peg-on plays once, when most of the line is in view (not while it peeks under the hero)
      if ('IntersectionObserver' in W) {
        var io = new IntersectionObserver(function (es) {
          if (es[es.length - 1].intersectionRatio >= .45) { io.disconnect(); enter() }
        }, { threshold: [0, .45, .7] })
        io.observe(root)
      } else enter()
      var rz = 0, lastW = Wd
      W.addEventListener('resize', function () {
        cancelAnimationFrame(rz)
        rz = requestAnimationFrame(function () {
          rect = null
          // only the height changed (a phone's address bar): the line carries on undisturbed
          if (root.clientWidth === lastW) return
          // the card nearest the middle keeps its place, as a share of the new width
          var keep = cards[nearestCard()], share = xOf(keep, curOffset()) / Wd
                    enterManual(); glide = null; fling = false
          layout(); lastW = Wd
          offset = share * Wd + pad - keep.bx
          if (!isFinite(offset)) offset = 0
          buildAnims()
          if (!drag) exitManual()
        })
      }, { passive: true })
      WI.visibility(root, onVisible)
      // the hero's "New: Anime, gothic & plush" link: bring the band into view and glide to the storybook sign
      var kickNew = $('.kick-new'), firstStory = cards.filter(function (c) { return c.group.id === 'storybook' })[0]
      if (kickNew && firstStory) kickNew.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return
        e.preventDefault()
        var y = root.getBoundingClientRect().top + (W.scrollY || W.pageYOffset || 0) - Math.max(0, (W.innerHeight - root.offsetHeight) / 2)
        W.scrollTo({ top: Math.max(0, y), behavior: isReduced() ? 'auto' : 'smooth' })
        setTab(firstStory.ci)
        if (!started) { offset = offsetFor(firstStory); setCt(ctOf(offset)) }
        else { glideTo(firstStory.ci, true); rest(5000) }
      })
      motionFns.push(function (r) {
        paintHold()
        if (r) {
          started = true; root.classList.add('is-in'); root.classList.remove('is-intro', 'is-drawing')
          clearCostume(); if (dressBy === 'auto') dress(null, null)
          items.forEach(stopSwings)
          if (windA) windA.cancel()
          if (glide != null) { offset = glide; glide = null; setCt(ctOf(offset)); exitManual() }
        }
        kick()
      })
    }

    /* ───────── hero search: live results ───────── */
    var hs = $('[data-hero-search]')
    if (hs) {
      var input = $('.hs-input', hs), panel = $('.hs-panel', hs), grid = $('.hs-grid', hs), count = $('.hs-count', hs)
      var stylesBox = $('.hs-styles', hs), all = $('.hs-all', hs), ghostW = $('.hs-ghost-word', hs), form = $('.hs-box', hs)
      var hsStyle = 'line'
      stylesBox.innerHTML = AV.map(function (s) { return '<button type="button" class="hs-sw s-' + s + '" data-s="' + s + '" aria-pressed="' + (s === hsStyle) + '" aria-label="Show in ' + INFO[s].title + '" title="' + INFO[s].title + '"></button>' }).join('')
      var lastQ = '', lastHits = []
      var render = function (hits, q) {
        if (!hits.length) {
          var sug = (WI.suggest(q, 4) || []).map(function (x) { return typeof x === 'string' ? x : x.name })
          grid.innerHTML = '<li class="hs-empty" style="--i:0"><span class="hand">hmm, nothing for “' + esc(q) + '”</span>' +
            (sug.length ? 'Did you mean ' + sug.map(function (s) { return '<button type="button" data-q="' + esc(s) + '">' + esc(s) + '</button>' }).join('') + '?' : 'Try a simpler word, like “home” or “money”.') +
            '<span class="hs-empty-ai"><b>Or let an AI pick it</b> — it reads our skill file and searches every icon for “' + esc(q) + '”:</span><div class="hs-empty-ask" data-ask-ai data-intent="find" data-query="' + esc(q) + '"></div></li>'
          count.innerHTML = 'No icons yet'
          return
        }
        var top = hits[0]
        count.innerHTML = hits.length + (hits.length === 1 ? ' icon' : ' icons') + ' for “' + esc(q) + '”' + '<small>' + (WI.whyMatched(top, q) || '') + '</small>'
        grid.innerHTML = hits.map(function (hit, i) {
          var svg = WI.svg(hit.name, hsStyle, 34) || ic(hit.name, hsStyle, 34) || WI.svg(hit.name, 'line', 34)
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
        // paused mid-word: settle on the whole word
        motionFns.push(function (r) { if (r) { ci = words[wi].length; dir = -1; pause = 24; ghostW.textContent = '“' + words[wi] + '”' } })
      }
      // prefill from ?q=
      try { var q0 = new URLSearchParams(location.search).get('q'); if (q0) { input.value = q0; run() } } catch (err) { /* noop */ }
    }

    /* ───────── pick a style: grouped tabs (Everyday · Crafted · Playful · Studio · Storybook) ───────── */
    var picker = $('[data-picker]')
    if (picker) {
      var tabs = $('[data-picker-tabs]', picker), pgrid = $('[data-picker-grid]', picker)
      var ptitle = $('[data-picker-title]', picker), pplain = $('[data-picker-plain]', picker), pgood = $('[data-picker-good]', picker), plink = $('[data-picker-link]', picker)
      var groups = (WI.GROUPS || [{ id: 'all', title: '', styles: ORDER }]).map(function (g) {
        return { id: g.id, title: g.title, styles: g.styles.filter(function (s) { return AV.indexOf(s) >= 0 }) }
      }).filter(function (g) { return g.styles.length })
      var TAB_ORDER = [].concat.apply([], groups.map(function (g) { return g.styles }))
      var curS = 'line'
      tabs.innerHTML = groups.map(function (g) {
        return '<div class="pt-group" role="presentation"><span class="pt-gl" aria-hidden="true">' + esc(g.title) + '</span>' +
          g.styles.map(function (s) {
            return '<button class="pt s-' + s + '" role="tab" type="button" id="pt-' + s + '" aria-selected="' + (s === curS) + '" tabindex="' + (s === curS ? 0 : -1) + '" data-s="' + s + '">' +
              '<span class="pt-dot" aria-hidden="true"></span>' + INFO[s].title + newTag(s) + '</button>'
          }).join('') + '</div>'
      }).join('')
      var panelEl = $('[data-picker-panel]', picker)
      var choose = function (s, focus) {
        curS = s
        $$('.pt', tabs).forEach(function (t) { var on = t.getAttribute('data-s') === s; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus() })
        setStyleClass(panelEl, s)
        panelEl.setAttribute('aria-labelledby', 'pt-' + s)
        var names = P2 ? P2.grid : P.stage
        pgrid.innerHTML = names.map(function (n, i) {
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
        var cur = TAB_ORDER.indexOf((doc.activeElement && doc.activeElement.getAttribute('data-s')) || 'line')
        var k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]
        if (k) { e.preventDefault(); choose(TAB_ORDER[(cur + k + TAB_ORDER.length) % TAB_ORDER.length], true) }
        if (e.key === 'Home') { e.preventDefault(); choose(TAB_ORDER[0], true) }
        if (e.key === 'End') { e.preventDefault(); choose(TAB_ORDER[TAB_ORDER.length - 1], true) }
      })
      var hoverT = 0
      tabs.addEventListener('pointerover', function (e) {
        var t = e.target.closest('.pt'); if (!t || t.getAttribute('aria-selected') === 'true' || e.pointerType === 'touch') return
        clearTimeout(hoverT); hoverT = setTimeout(function () { choose(t.getAttribute('data-s')) }, 160)
      })
      tabs.addEventListener('pointerleave', function () { clearTimeout(hoverT) })
      choose('line')
      more.push(function () { choose(curS) })
    }

    /* ───────── anywhere mock ───────── */
    var mock = $('[data-mock]')
    if (mock) {
      var mics = $$('[data-mock-ic]', mock), mk = 0
      var paintMock = function (cls) {
        var s = AV[mk % AV.length]
        mics.forEach(function (m, i) {
          m.style.setProperty('--style', 'var(--c-' + s + ')'); m.style.setProperty('--style-soft', 'var(--c-' + s + '-soft)')
          setTimeout(function () { m.innerHTML = ic(m.getAttribute('data-mock-ic'), s, 28, cls ? { 'class': cls } : null) }, cls ? i * 90 : 0)
        })
      }
      paintMock()
      if (!reduced) loop(mock, function () { mk++; paintMock('is-new') }, 2600)
    }

    /* ───────── try: copy, download, drag ─────────
       Colour is meaningful in every style. Single-colour styles (line, solid, duo, gloss…) draw in currentColor, so a
       swatch recolours the whole icon. Multi-colour styles (kawaii, retro, luxe, plush…) recolour their colour roles
       (c1..c4; js/palette-map.js) and keep their outline. One role: it takes the chosen colour. Several (retro stripes,
       sticker candies, kawaii fills, bauhaus primaries…): a ramp is derived in OKLCH from the chosen colour, keeping the
       icon's own light/dark rhythm between its parts (scaled down a little) and turning their hue differences into
       small analogous steps, so the whole icon takes on the colour and every part stays distinct. The chosen colour
       itself lands exactly on the part whose original lightness is closest to it. When the chosen colour would swallow
       the outline, the outline flips to a legible light/dark shade of it. The preview, Copy SVG, SVG/PNG downloads,
       the drag payload and the drop slide all use the same plan. */
    var tryEl = $('[data-try]')
    if (tryEl) {
      var tArt = $('[data-try-art]', tryEl), tStyles = $('[data-try-styles]', tryEl), tColors = $('[data-try-colors]', tryEl), drop = $('[data-try-drop]', tryEl)
      var tHint = $('[data-try-hint]', tryEl)
      var prev = $('.try-preview', tryEl)
      var T = { icon: 'rocket', style: 'line', color: null, custom: null }
      var COLORS = [['Ink', '#111318'], ['Cobalt', '#2F5BFF'], ['Tomato', '#FF5A36'], ['Violet', '#7B5CFF'], ['Pink', '#FF4FA3'], ['Leaf', '#22A861'], ['Gold', '#C9962B']]
      var MAIN = ['c1', 'c2', 'c3', 'c4']
      var hexOk = function (h) { return /^#[0-9a-f]{6}$/i.test(h || '') }
      var normHex = function (h) { h = String(h || '').trim(); if (/^#[0-9a-f]{3}$/i.test(h)) h = '#' + h.slice(1).replace(/./g, '$&$&'); return hexOk(h) ? h.toUpperCase() : null }
      var rgbOf = function (h) { var n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255] }
      var lumOf = function (h) { return rgbOf(h).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }).reduce(function (a, v, i) { return a + v * [0.2126, 0.7152, 0.0722][i] }, 0) }
      var contrast = function (a, b) { var x = lumOf(a), y = lumOf(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) }
      var mixHex = function (a, b, t) { var p = rgbOf(a), q = rgbOf(b); return '#' + p.map(function (v, i) { return ('0' + Math.round(v + (q[i] - v) * t).toString(16)).slice(-2) }).join('').toUpperCase() }
      var fallbackOf = function (markup, v) { var m = new RegExp('var\\(\\s*' + v + '\\s*,\\s*(#[0-9a-fA-F]{3,6})\\b').exec(markup); return m ? normHex(m[1]) : null }
      var rolesOf = function (markup) { return W.WithPalette && W.WithPalette.rolesFor ? W.WithPalette.rolesFor(markup) : {} }
      // colour roles that really are the icon's own colours (duo / blueprint accents fall back to currentColor)
      var colourVars = function (markup) {
        var r = rolesOf(markup), out = []
        for (var v in r) if (MAIN.indexOf(r[v]) > -1 && v !== '--with-duo' && v !== '--with-accent') out.push([v, r[v]])
        return out
      }
      // OKLab / OKLCH (Björn Ottosson), for perceptual ramps
      var lin = function (v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
      var gam = function (v) { return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055 }
      var toLch = function (h) {
        var c = rgbOf(h).map(lin)
        var l = Math.cbrt(0.4122214708 * c[0] + 0.5363325363 * c[1] + 0.0514459929 * c[2])
        var m = Math.cbrt(0.2119034982 * c[0] + 0.6806995451 * c[1] + 0.1073969566 * c[2])
        var q = Math.cbrt(0.0883024619 * c[0] + 0.2817188376 * c[1] + 0.6299787005 * c[2])
        var L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * q
        var a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * q
        var b = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * q
        return { L: L, C: Math.sqrt(a * a + b * b), H: (Math.atan2(b, a) * 180 / Math.PI + 360) % 360 }
      }
      var lchRgb = function (L, C, H) {
        var a = C * Math.cos(H * Math.PI / 180), b = C * Math.sin(H * Math.PI / 180)
        var l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3), m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3), q = Math.pow(L - 0.0894841775 * a - 1.2914855480 * b, 3)
        return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * q, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * q, -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * q]
      }
      var fromLch = function (L, C, H) {
        // into sRGB by easing chroma down (hue and lightness are what carry the ramp)
        var inG = function (c) { return lchRgb(L, c, H).every(function (v) { return v >= -0.0005 && v <= 1.0005 }) }
        if (!inG(C)) { var lo = 0, hi = C; for (var k = 0; k < 18; k++) { var mid = (lo + hi) / 2; if (inG(mid)) lo = mid; else hi = mid } C = lo }
        return '#' + lchRgb(L, C, H).map(function (v) { return ('0' + Math.round(Math.max(0, Math.min(1, gam(Math.max(0, v)))) * 255).toString(16)).slice(-2) }).join('').toUpperCase()
      }
      // { role: hex } for the c-roles an icon uses, derived from one chosen colour (see the note above)
      var rampFor = function (roles, orig, hex) {
        var out = {}
        if (roles.length < 2 || roles.some(function (r) { return !orig[r] })) { roles.forEach(function (r) { out[r] = hex }); return out }
        var P = toLch(hex), O = roles.map(function (r) { return toLch(orig[r]) })
        // the chosen colour lands on a part of the icon's main hue family (never on a contrast accent such as retro's
        // teal), the one whose lightness is closest to it
        var x = 0, y = 0
        O.forEach(function (o) { x += o.C * Math.cos(o.H * Math.PI / 180); y += o.C * Math.sin(o.H * Math.PI / 180) })
        var mH = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360, gap = function (h) { return Math.abs(((h - mH + 540) % 360) - 180) }
        var fam = O.map(function (o, i) { return i }).filter(function (i) { return O[i].C < 0.03 || gap(O[i].H) <= 60 })
        if (!fam.length) fam = O.map(function (o, i) { return i })
        var a = fam[0]
        fam.forEach(function (i) { if (Math.abs(O[i].L - P.L) < Math.abs(O[a].L - P.L)) a = i })
        var neutral = P.C < 0.035
        roles.forEach(function (r, i) {
          if (i === a) { out[r] = hex; return }
          var dL = (O[i].L - O[a].L) * 0.85
          var L = Math.max(0.22, Math.min(0.97, P.L + dL))
          if (Math.abs(L - P.L) < 0.045) L = Math.max(0.22, Math.min(0.97, P.L + (dL >= 0 && P.L < 0.9 || P.L < 0.3 ? 0.07 : -0.07)))
          var dh = O[i].C < 0.03 || O[a].C < 0.03 ? 0 : ((O[i].H - O[a].H + 540) % 360) - 180
          var off = Math.max(-32, Math.min(32, dh * 0.35)); if (Math.abs(dh) > 8 && Math.abs(off) < 12) off = dh > 0 ? 12 : -12
          var C = neutral ? P.C : P.C * Math.max(0.65, Math.min(1.25, O[i].C / Math.max(O[a].C, 0.02)))
          out[r] = fromLch(L, C, (P.H + (neutral ? 0 : off) + 360) % 360)
        })
        return out
      }
      var inner0 = function (style) { return inner(T.icon, style) || '' }
      var isMulti = function (style) { return colourVars(inner0(style)).length > 0 }
      // { vars: {'--with-x': hex}, color: hex|null } — one plan shared by preview and every output
      var planFor = function (style, hex) {
        var out = { vars: {}, color: null }
        if (!hex) return out
        var markup = inner0(style), cv = colourVars(markup)
        if (!cv.length) { out.color = hex; return out }
        var roles = MAIN.filter(function (r) { return cv.some(function (x) { return x[1] === r }) }), orig = {}
        cv.forEach(function (x) { if (!orig[x[1]]) orig[x[1]] = fallbackOf(markup, x[0]) })
        var ramp = rampFor(roles, orig, hex)
        cv.forEach(function (x) { if (ramp[x[1]]) out.vars[x[0]] = ramp[x[1]] })
        // keep the outline legible against the new main colour
        var r = rolesOf(markup), inkVars = [], outline = null
        for (var v in r) if (r[v] === 'ink') { inkVars.push(v); outline = outline || fallbackOf(markup, v) }
        outline = outline || normHex(INFO[style].color) || '#111318'
        if (contrast(hex, outline) < 1.8) {
          var dk = mixHex(hex, '#000000', 0.74), lt = mixHex(hex, '#FFFFFF', 0.82), ink = contrast(hex, dk) >= contrast(hex, lt) ? dk : lt
          inkVars.forEach(function (v) { out.vars[v] = ink })
          out.color = ink
        }
        return out
      }
      var plan = function () { return planFor(T.style, T.color) }
      var varCss = function (pl) { var s = ''; for (var v in pl.vars) s += v + ':' + pl.vars[v] + ';'; return s }
      var artFor = function (size, opts, pl) {
        var s = ic(T.icon, T.style, size, opts)
        var css = varCss(pl)
        return css ? s.replace('<svg ', '<svg style="' + css + '" ') : s
      }
      var outFor = function (pl) {
        var s = ic(T.icon, T.style, 24, {})
        if (!s) return ''
        s = s.replace(' aria-hidden="true" focusable="false"', '')
        s = s.replace(/var\(\s*(--with-[\w-]+)\s*,\s*([^()]*?)\s*\)/g, function (all, v) { return pl.vars[v] || all })
        var c = pl.color || INFO[T.style].color
        return s.replace(/var\(--(?:eg|with)-(?:duo|accent),\s*currentColor\)/g, c).replace(/currentColor/g, c)
      }
      // the icon's own colours, for the "Style colours" swatch
      var autoFill = function (style) {
        var markup = inner0(style), cs = []
        colourVars(markup).forEach(function (x) { var h = fallbackOf(markup, x[0]); if (h && cs.indexOf(h) < 0) cs.push(h) })
        if (!cs.length) return 'var(--style)'
        cs = cs.slice(0, 3)
        if (cs.length === 1) return cs[0]
        var step = 100 / cs.length
        return 'conic-gradient(' + cs.map(function (c, i) { return c + ' ' + (i * step) + '% ' + ((i + 1) * step) + '%' }).join(',') + ')'
      }
      var PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 6v12M6 12h12"/></svg>'
      tStyles.innerHTML = AV.map(function (s) { return '<button type="button" class="chip s-' + s + '" data-s="' + s + '" aria-pressed="' + (s === T.style) + '">' + INFO[s].title + '</button>' }).join('')
      tColors.innerHTML = '<button type="button" class="try-sw is-auto" data-tc="auto" aria-pressed="true" aria-label="Style colours" title="Style colours"></button>' +
        COLORS.map(function (c) { return '<button type="button" class="try-sw" style="--sw:' + c[1] + '" data-tc="' + c[1] + '" aria-pressed="false" aria-label="' + c[0] + '" title="' + c[0] + '"></button>' }).join('') +
        '<span class="try-sw-sep" aria-hidden="true"></span>' +
        '<button type="button" class="try-sw try-sw-custom" data-tc-custom aria-pressed="false" aria-label="Any colour" title="Any colour">' + PLUS + '</button>'
      var customBtn = $('[data-tc-custom]', tColors)
      tArt.setAttribute('draggable', 'true')
      tArt.setAttribute('role', 'img'); tArt.setAttribute('aria-label', 'Icon preview — drag me')
      var paintTry = function (live) {
        var pl = plan()
        setStyleClass(prev, T.style)
        prev.style.setProperty('--style', 'var(--c-' + T.style + ')'); prev.style.setProperty('--style-soft', 'var(--c-' + T.style + '-soft)')
        if (pl.color) tArt.style.setProperty('--try-color', pl.color); else tArt.style.removeProperty('--try-color')
        tArt.innerHTML = '<span class="try-grab" aria-hidden="true">drag me ↘</span>' + artFor(200, { 'class': reduced || live ? '' : 'is-new' }, pl)
      }
      var paintRow = function () {
        var cv = colourVars(inner0(T.style)), multi = cv.length > 0
        var many = MAIN.filter(function (r) { return cv.some(function (x) { return x[1] === r }) }).length > 1
        var auto = $('.is-auto', tColors); if (auto) auto.style.setProperty('--sw', autoFill(T.style))
        if (tHint) tHint.textContent = many ? 'Turns every colour into shades of yours; the outline stays crisp.' : multi ? 'Recolours the main colour; the outline stays crisp.' : 'Recolours the whole icon.'
        tColors.setAttribute('aria-label', multi ? 'Main colour' : 'Colour')
      }
      var pressColour = function (btn) {
        $$('[data-tc],[data-tc-custom]', tColors).forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false') })
      }
      paintTry(); paintRow()
      var curColor = function () { var pl = plan(); return pl.color || getComputedStyle(prev).getPropertyValue('--c-' + T.style).trim() || '#111318' }
      // "Any colour": the in-house picker (js/ui-kit.js), with this icon's palette suggestions when they load
      var cpOpts = null
      if (customBtn && W.WIKit && W.WIKit.colorPicker) {
        var setCustom = function (hx, live) {
          hx = normHex(hx); if (!hx) return
          T.custom = T.color = hx
          customBtn.style.setProperty('--sw', hx); customBtn.classList.add('is-set')
          pressColour(customBtn); paintTry(live)
        }
        cpOpts = { value: '#7B5CFF', label: 'Any colour', paletteLabel: 'Rocket palettes', preview: function () { return tArt }, onInput: function (hx) { setCustom(hx, true) }, onChange: function (hx) { setCustom(hx, false) } }
        var cpKit = W.WIKit.colorPicker(customBtn, cpOpts)
        try {
          var ps = doc.createElement('script'); ps.async = true
          ps.src = (WI.base || '') + 'data/palettes/' + T.icon + '.js'
          ps.onload = function () {
            var list = (W.WITH_PALETTES && W.WITH_PALETTES[T.icon]) || [], seen = {}
            var pal = list.map(function (p) { return { name: p.name, color: p.colors && p.colors.c1 } })
              .filter(function (p) { var h = normHex(p.color); if (!h || seen[h]) return false; seen[h] = 1; return true }).slice(0, 18)
            if (cpKit && cpKit.setPalette) cpKit.setPalette(pal); else cpOpts.palette = pal
          }
          ps.onerror = function () { ps.remove() }
          doc.head.appendChild(ps)
        } catch (err) { /* palettes are a bonus */ }
      } else if (customBtn) customBtn.hidden = true
      tryEl.addEventListener('click', function (e) {
        var s = e.target.closest('[data-s]')
        if (s && tStyles.contains(s)) {
          T.style = s.getAttribute('data-s')
          $$('[data-s]', tStyles).forEach(function (b) { b.setAttribute('aria-pressed', b === s ? 'true' : 'false') })
          paintTry(); paintRow(); return
        }
        var c = e.target.closest('[data-tc]')
        if (c && tColors.contains(c)) {
          var v = c.getAttribute('data-tc')
          T.color = v === 'auto' ? null : v
          pressColour(c)
          paintTry(); return
        }
        if (e.target.closest('[data-try-copy]')) { WI.copyWithToast(outFor(plan()), 'SVG copied — paste it into Figma, Canva or your code'); return }
        if (e.target.closest('[data-try-svg]')) { WI.download(T.icon + '-' + T.style + '.svg', outFor(plan())); WI.toast('Downloading ' + T.icon + '-' + T.style + '.svg'); return }
        if (e.target.closest('[data-try-png]')) {
          WI.svgToPng(outFor(plan()), 512).then(function (blob) {
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
        d.innerHTML = artFor(44, {}, plan())
        drop.appendChild(d)
        var kids = $$('.dropped', drop); if (kids.length > 5) kids[0].remove()
        WI.announce('Placed ' + T.icon + ' on the slide')
      }
      tArt.addEventListener('dragstart', function (e) {
        var svgText = outFor(plan())
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
      // test hook (also handy for the verification script): the exact SVG that Copy / Download / Drag produce
      tryEl._tryOut = function () { return outFor(plan()) }
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
        $$('.msg', chat).forEach(function (m) { m.classList.add('is-in') }); var t0c = $('[data-chat-ic]', chat); if (t0c) t0c.innerHTML = ic('trash', 'line', 22)
      } else {
        var chatOn = false, chatInt = 0
        WI.visibility(chat, function (v) {
          if (v && !chatOn) { chatOn = true; playChat(); chatInt = setInterval(playChat, 6200) }
          else if (!v && chatOn) { chatOn = false; clearInterval(chatInt); chatTimers.forEach(clearTimeout) }
        })
      }
    }

    /* ───────── use-case icons ───────── */
    $$('[data-use-ic]').forEach(function (el) {
      var n = el.getAttribute('data-use-ic'), s = el.getAttribute('data-use-style') || 'line'
      if (hasIc(n, s)) { el.innerHTML = ic(n, s, 36); return }
      WI.loadStyle('line').then(function () { el.innerHTML = ic(n, 'line', 36) })
    })

    /* ───────── final orbit: every style circling ───────── */
    var orbit = $('[data-orbit]')
    if (orbit) {
      var ORB = [['heart', 'gloss'], ['star', 'solid'], ['rocket', 'retro'], ['gift', 'duo'], ['coffee', 'sketch'], ['cloud', 'glass'], ['camera', 'blueprint'], ['smile', 'kawaii'],
        ['trophy', 'engrave'], ['zap', 'sticker'], ['star', 'pixel'], ['crown', 'luxe'], ['music-note', 'bauhaus'], ['calendar', 'line'], ['rocket', 'anime'], ['camera', 'skeuo'],
        ['key', 'gothic'], ['cloud', 'pastel'], ['gift', 'coquette'], ['star', 'plush']].filter(function (o) { return hasIc(o[0], o[1]) })
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
      if (reduced) { frame(t0); cancelAnimationFrame(oraf) }
      else WI.visibility(orbit, function (v) { cancelAnimationFrame(oraf); if (v) oraf = requestAnimationFrame(frame) }, '100px')
    }

    /* ───────── live icons teaser: real live icons (vendor/dynamic/dynamic.js, window.WithLive) set to today, now and
       a few sample values, cycling through the styles; plain Line icons stand in until (or unless) the runtime loads ───────── */
    var lvSec = $('[data-live-teaser]')
    if (lvSec) {
      var LV = {
        // name: the preferred live icon; re: any other one that fits, should the catalogue change; fb: the static stand-in
        calendar: { name: 'calendar-date', re: /^calendar/, fb: 'calendar' }, clock: { name: 'clock-time', re: /clock|watch|time/, fb: 'clock' },
        bell: { name: 'bell-count', re: /bell|notif|badge|count/, fb: 'bell' }, battery: { name: 'battery-level', re: /^battery/, fb: 'battery', level: 0.72 },
        weather: { name: 'weather', re: /weather|temp|forecast/, fb: 'cloud-sun' }, label: { name: 'tag-label', re: /label|tag|text|sticker/, fb: 'tag' }
      }
      var LV_STYLES = ['luxe', 'anime', 'bauhaus', 'plush', 'skeuo', 'line', 'coquette', 'kawaii', 'gothic', 'glass', 'pastel', 'retro', 'duo'].filter(function (s) { return INFO[s] })
      var lvTiles = $$('[data-lv]', lvSec), lvStyleEl = $('[data-lv-style]', lvSec), lvBoard = $('.live-board', lvSec)
      var MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
      var DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
      var two = function (n) { return (n < 10 ? '0' : '') + n }
      // a live icon's parameters for "right now": dates and times from the clock, everything else its own default
      var paramsFor = function (L, name, key) {
        var spec = {}, out = {}, now = new Date()
        try { spec = L.paramsOf(name) || {} } catch (e) { spec = {} }
        Object.keys(spec).forEach(function (k) {
          var p = spec[k] || {}, opts = (p.options || []).map(function (o) { return String(o).toUpperCase() }), v
          if (p.type === 'time') v = two(now.getHours()) + ':' + two(now.getMinutes())
          else if (/^(day|date)$/i.test(k) && p.type !== 'enum') v = now.getDate()
          else if (/month/i.test(k) && opts.length) { var mi = opts.indexOf(MONTHS[now.getMonth()]); if (mi >= 0) v = p.options[mi] }
          else if (/weekday|dow/i.test(k) && opts.length) { var di = opts.indexOf(DAYS[now.getDay()]); if (di >= 0) v = p.options[di] }
          else if (p.type === 'level' && LV[key].level != null) v = LV[key].level
          if (v != null) out[k] = v
        })
        return out
      }
      var lvSub = function (tile, key) {
        var el = $('[data-lv-sub]', tile), now = new Date()
        if (!el) return
        if (key === 'calendar') el.textContent = DAYS[now.getDay()].charAt(0) + DAYS[now.getDay()].slice(1).toLowerCase() + ' ' + now.getDate() + ' ' + MONTHS[now.getMonth()].charAt(0) + MONTHS[now.getMonth()].slice(1).toLowerCase()
        else if (key === 'clock') el.textContent = two(now.getHours()) + ':' + two(now.getMinutes())
      }
      var lvNames = null, lvK = 0, lvTimer = 0, lvLive = false
      // the runtime ships each style on demand: load it, then draw (a style that fails to load keeps the last frame)
      var paint = function (style) {
        var L = W.WithLive
        if (lvLive && L && typeof L.load === 'function' && !(L.loaded && safe(function () { return L.loaded(style) }))) {
          Promise.resolve(safe(function () { return L.load(style) })).then(function () { draw(style) }, function () {})
          return
        }
        draw(style)
      }
      var safe = function (fn) { try { return fn() } catch (e) { return null } }
      var draw = function (style) {
        var L = W.WithLive
        lvTiles.forEach(function (tile) {
          var key = tile.getAttribute('data-lv'), box = $('[data-lv-ic]', tile), html = ''
          var name = lvNames && lvNames[key]
          if (L && name) { try { html = L.render(name, paramsFor(L, name, key), style, { size: 80 }) } catch (e) { html = '' } }
          if (html) tile.classList.add('is-live')
          else html = ic(LV[key].fb, 'line', 64)
          box.innerHTML = html
          lvSub(tile, key)
        })
        setStyleClass(lvBoard, lvShow(style))
        if (lvStyleEl) lvStyleEl.textContent = INFO[lvShow(style)].title
      }
      var lvShow = function (s) { return lvLive ? s : 'line' }
      var lvStart = function () {
        var L = W.WithLive
        if (L && typeof L.render === 'function' && typeof L.list === 'function') {
          var all = []
          try { all = (L.list() || []).map(function (x) { return typeof x === 'string' ? x : x && x.name }).filter(Boolean) } catch (e) { all = [] }
          lvNames = {}
          Object.keys(LV).forEach(function (k) {
            if (all.indexOf(LV[k].name) >= 0) { lvNames[k] = LV[k].name; return }
            for (var i = 0; i < all.length; i++) if (LV[k].re.test(all[i])) { lvNames[k] = all[i]; break }
          })
          lvLive = Object.keys(lvNames).length > 0
        }
        paint(LV_STYLES[0])
        if (!lvLive) return
        WI.visibility(lvSec, function (v) {
          clearInterval(lvTimer)
          if (v) lvTimer = setInterval(function () { if (reduced) return; lvK = (lvK + 1) % LV_STYLES.length; paint(LV_STYLES[lvK]) }, 2800)
        })
      }
      // Line stand-ins first (cheap), then the runtime once the section is near
      WI.loadStyle('line').then(function () { if (!lvLive) paint('line') })
      WI.whenVisible(lvSec, function () {
        if (W.WithLive) { lvStart(); return }
        WI.loadScript((WI.base || '') + 'vendor/dynamic/dynamic.js').then(lvStart, function () { /* no runtime yet: keep the stand-ins */ })
      }, '400px')
    }

    /* ───────── part 2 of the pack: picker grid + "Icons that move" ───────── */
    var gotMore = function () {
      P2 = W.WITH_HOME_MORE || null
      if (!P2) return
      more.forEach(function (fn) { try { fn() } catch (e) { if (W.console) console.error(e) } })
      initMotion()
    }
    // it is only needed from the style picker down, so it loads when that part of the page comes near (never at boot)
    var askedMore = false
    var loadMore = function () {
      if (askedMore) return
      askedMore = true
      var s2 = doc.createElement('script')
      s2.src = (WI.base || '') + 'js/home-icons-more.js'
      s2.onload = gotMore
      doc.head.appendChild(s2)
    }
    if (W.WITH_HOME_MORE) gotMore()
    else {
      var needMore = [$('[data-picker]'), $('[data-motion]')].filter(Boolean)
      if (!needMore.length) loadMore()
      needMore.forEach(function (el) { WI.whenVisible(el, loadMore, '250px') })
    }

    /* ═════════ ICONS THAT MOVE ═════════
       Uses the @withicons/motion classes (vendor/motion/motion.css): `wm wm-loop|wm-hover wm-p-<preset>` with
       --wm-* options, and `wm-swap wm-fx-<effect>` holding `.wm-a` / `.wm-b`. Specs come from forge/motion via the pack. */
    function initMotion() {
      var sec = $('[data-motion]')
      if (!sec || sec._ready) return
      sec._ready = true
      var M = P2.motion || {}, MV = P2.moves || { loops: [], hover: [], swaps: [] }
      var boxStyles = $('[data-mo-styles]', sec), boxLoops = $('[data-mo-loops]', sec), boxHover = $('[data-mo-hover]', sec)
      var boxSwaps = $('[data-mo-swaps]', sec), boxFx = $('[data-mo-fx]', sec), boxCode = $('[data-mo-code]', sec)
      var pauseBtn = $('[data-mo-pause]', sec), note = $('[data-mo-reduced]', sec)
      var S = { style: 'line', force: false, fx: 'auto', code: null, paused: false, touched: 0 }
      var VERB = { spin: 'spins', 'spin-once': 'turns', tick: 'ticks', pulse: 'pulses', beat: 'beats', breathe: 'breathes', float: 'floats', bounce: 'bounces',
        sway: 'sways', ring: 'rings', wiggle: 'wiggles', shake: 'shakes', nod: 'nods', nudge: 'nudges', pass: 'flies', rise: 'rises', drop: 'drops', blink: 'blinks',
        flicker: 'flickers', twinkle: 'twinkles', pop: 'pops', tada: 'cheers', jelly: 'wobbles', flip: 'flips', rock: 'rocks', tilt: 'tilts', zoom: 'zooms',
        orbit: 'orbits', glow: 'glows', draw: 'draws', type: 'types', fill: 'fills' }
      var LABEL = { bell: 'Notifications', send: 'Send', download: 'Download', heart: 'Like', refresh: 'Refresh', trash: 'Delete', 'thumbs-up': 'Like' }
      var EFFECTS = ['auto', 'morph', 'flip', 'rotate', 'scale', 'slide-up', 'blur', 'spin']
      var num = function (v) { return String(Math.round(v * 1000) / 1000) }
      function vars(m) {
        var o = m.origin || [12, 12], v = {}
        v['--wm-ox'] = num(o[0] / 24 * 100) + '%'; v['--wm-oy'] = num(o[1] / 24 * 100) + '%'
        if (m.dir != null) { var r = m.dir * Math.PI / 180; v['--wm-dx'] = num(Math.cos(r)); v['--wm-dy'] = num(Math.sin(r)) }
        if (m.amount != null) v['--wm-k'] = num(m.amount)
        if (m.duration != null) v['--wm-dur'] = num(m.duration) + 's'
        if (m.steps) v['--wm-ease'] = 'steps(' + m.steps + ')'
        return v
      }
      function styleAttr(v) { var s = ''; for (var k in v) s += k + ':' + v[k] + ';'; return s }
      function wm(name, trig, m, svg) {
        m = m || { preset: 'pop' }
        return '<span class="wm wm-' + trig + ' wm-p-' + esc(m.preset) + (S.force ? ' wm-force' : '') + '" data-wm="' + esc(name) + '" style="' + esc(styleAttr(vars(m))) + '">' + svg + '</span>'
      }
      function codeFor(kind, name, m, extra) {
        var v = vars(m), opts = []
        if (m.duration != null) opts.push('--wm-dur:' + v['--wm-dur'])
        if (m.dir != null) opts.push('--wm-dx:' + v['--wm-dx'], '--wm-dy:' + v['--wm-dy'])
        if (m.amount != null && m.amount !== 1) opts.push('--wm-k:' + v['--wm-k'])
        if (m.origin && (m.origin[0] !== 12 || m.origin[1] !== 12)) opts.push('--wm-ox:' + v['--wm-ox'], '--wm-oy:' + v['--wm-oy'])
        if (m.steps) opts.push('--wm-ease:steps(' + m.steps + ')')
        var st = opts.length ? ' style="' + opts.join('; ') + '"' : ''
        var head = '<!-- once, in your page’s <head>: the optional motion add-on -->\n<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion/dist/motion.css">\n\n'
        if (kind === 'loop') return head + '<!-- a ' + name + ' that ' + (VERB[m.preset] || 'moves') + ' all the time -->\n<span class="wm wm-loop wm-p-' + m.preset + '"' + st + '>\n  <!-- paste the ' + name + ' SVG here -->\n</span>'
        if (kind === 'hover') return head + '<!-- the icon plays once when the button is hovered or focused -->\n<button class="wm-trigger">\n  <span class="wm wm-hover wm-p-' + m.preset + '"' + st + '><!-- ' + name + ' SVG --></span>\n  ' + (LABEL[name] || name) + '\n</button>'
        return head + '<!-- ' + name + ' turns into ' + extra.to + ' when the button is pressed -->\n<button aria-pressed="false" onclick="this.setAttribute(\'aria-pressed\', this.getAttribute(\'aria-pressed\') !== \'true\')">\n  <span class="wm-swap wm-fx-' + extra.fx + '">\n    <!-- ' + name + ' SVG with class="wm-a" -->\n    <!-- ' + extra.to + ' SVG with class="wm-b" -->\n  </span>\n</button>'
      }
      function showCode(kind, name, m, extra) {
        S.code = [kind, name, m, extra]
        boxCode.innerHTML = WI.codeBlock(codeFor(kind, name, m, extra), 'html')
      }

      // style switcher
      boxStyles.innerHTML = '<span class="mo-k">Style</span>' + AV.map(function (s) {
        return '<button type="button" class="mo-st s-' + s + '" data-mo-style="' + s + '" aria-pressed="' + (s === S.style) + '" title="' + INFO[s].title + '"><span class="mo-st-dot" aria-hidden="true"></span><span class="mo-st-t">' + INFO[s].title + '</span></button>'
      }).join('')
      boxFx.innerHTML = '<span class="mo-k">Effect</span>' + EFFECTS.map(function (f) {
        return '<button type="button" class="mo-fxb" data-mo-fx="' + f + '" aria-pressed="' + (f === S.fx) + '">' + (f === 'auto' ? 'Best fit' : f.replace('-', ' ')) + '</button>'
      }).join('')

      function swapFx(a, to) {
        if (S.fx !== 'auto') return S.fx
        var sw = (M[a] && M[a].swap) || []
        for (var i = 0; i < sw.length; i++) if (sw[i].to === to) return sw[i].effect
        return 'morph'
      }
      function renderAll() {
        var st = S.style
        sec.style.setProperty('--mo-c', 'var(--c-' + st + ')')
        sec.style.setProperty('--mo-soft', 'var(--c-' + st + '-soft)')
        boxLoops.innerHTML = MV.loops.filter(function (n) { return hasIc(n, st) }).map(function (n, i) {
          var m = (M[n] && M[n].loop) || { preset: 'pulse' }
          return '<li><button type="button" class="mo-tile" data-mo-loop="' + esc(n) + '" title="' + esc((M[n] && M[n].intent) || n) + '" style="--i:' + i + '">' +
            '<span class="mo-ic">' + wm(n, 'loop', m, ic(n, st, 40)) + '</span><span class="mo-name">' + esc(n) + '</span><span class="mo-verb">' + (VERB[m.preset] || m.preset) + '</span></button></li>'
        }).join('')
        boxHover.innerHTML = MV.hover.filter(function (n) { return hasIc(n, st) }).map(function (n) {
          var m = (M[n] && M[n].hover) || { preset: 'pop' }
          return '<button type="button" class="mo-btn wm-trigger" data-mo-hov="' + esc(n) + '">' + wm(n, 'hover', m, ic(n, st, 22)) + '<span>' + esc(LABEL[n] || n) + '</span></button>'
        }).join('')
        boxSwaps.innerHTML = MV.swaps.map(function (pair, i) {
          var a = pair[0], to = pair[1], bn = to.split('@')[0], bs = to.split('@')[1] || st
          if (!hasIc(a, st) || !hasIc(bn, bs)) return ''
          var fx = swapFx(a, to), label = bs !== st ? a + ' → filled' : a + ' → ' + bn
          return '<button type="button" class="mo-swap" aria-pressed="false" data-mo-swap="' + i + '" aria-label="' + esc(a + ' turns into ' + (bs !== st ? 'filled ' + bn : bn)) + '">' +
            '<span class="wm-swap wm-fx-' + fx + (S.force ? ' wm-force' : '') + '">' + ic(a, st, 44, { 'class': 'wm-a' }) + ic(bn, bs, 44, { 'class': 'wm-b' }) + '</span>' +
            '<span class="mo-swap-l">' + esc(label) + '</span></button>'
        }).join('')
        if (!S.code) showCode('loop', MV.loops[0], (M[MV.loops[0]] && M[MV.loops[0]].loop) || { preset: 'ring' })
        wireHover()
      }
      // hover one-shots: the motion runtime (WithMotion) plays them on hover, focus and tap and lets them finish;
      // without it, motion.css still plays them on :hover / :focus-visible of the .wm-trigger button
      function wireHover() {
        var WM = W.WithMotion
        if (!WM || typeof WM.motion !== 'function') return
        $$('[data-mo-hov]', boxHover).forEach(function (b) {
          var n = b.getAttribute('data-mo-hov'), m = (M[n] && M[n].hover) || { preset: 'pop' }, w = $('.wm', b)
          if (!w || w._wm) return
          try {
            w._wm = WM.motion(w, null, { trigger: 'hover', preset: m.preset, duration: m.duration, amount: m.amount, origin: m.origin, dir: m.dir, steps: m.steps, force: S.force })
          } catch (err) { /* CSS-only fallback */ }
        })
      }
      if (!W.WithMotion) WI.loadScript((WI.base || '') + 'vendor/motion/motion.js').then(function (ok) { if (ok) wireHover() })
      renderAll()

      // reduced motion: say so, and offer to play anyway
      if (reduced) { note.hidden = false; pauseBtn.hidden = true }
      sec.addEventListener('click', function (e) {
        var b
        if ((b = e.target.closest('[data-mo-force]'))) { S.force = true; note.hidden = true; pauseBtn.hidden = false; renderAll(); return }
        if ((b = e.target.closest('[data-mo-style]'))) {
          S.style = b.getAttribute('data-mo-style')
          $$('[data-mo-style]', boxStyles).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false') })
          renderAll(); WI.announce(INFO[S.style].title + ' style'); return
        }
        if ((b = e.target.closest('[data-mo-fx]'))) {
          S.fx = b.getAttribute('data-mo-fx')
          $$('[data-mo-fx]', boxFx).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false') })
          $$('.mo-swap', boxSwaps).forEach(function (x) {
            var pair = MV.swaps[+x.getAttribute('data-mo-swap')], w = $('.wm-swap', x)
            w.className = w.className.replace(/wm-fx-[\w-]+/, 'wm-fx-' + swapFx(pair[0], pair[1]))
          })
          return
        }
        if ((b = e.target.closest('[data-mo-pause]'))) {
          S.paused = !S.paused
          sec.classList.toggle('is-paused', S.paused)
          b.setAttribute('aria-pressed', S.paused ? 'true' : 'false')
          $('.mo-pause-t', b).textContent = S.paused ? 'Play' : 'Pause'
          return
        }
        if ((b = e.target.closest('[data-mo-loop]'))) {
          var n = b.getAttribute('data-mo-loop'), m = (M[n] && M[n].loop) || { preset: 'pulse' }
          $$('[data-mo-loop]', boxLoops).forEach(function (x) { x.classList.toggle('is-sel', x === b) })
          showCode('loop', n, m); return
        }
        if ((b = e.target.closest('[data-mo-hov]'))) {
          var hn = b.getAttribute('data-mo-hov'), hm = (M[hn] && M[hn].hover) || { preset: 'pop' }
          // replay on click/tap too (touch screens have no hover)
          var w = $('.wm', b)
          if (w._wm && w._wm.play) { try { w._wm.play() } catch (err) { /* noop */ } }
          else { w.classList.remove('wm-hover'); void w.offsetWidth; w.classList.add('wm-once'); clearTimeout(w._t); w._t = setTimeout(function () { w.classList.remove('wm-once'); w.classList.add('wm-hover') }, ((hm.duration || 1) * 1000) + 120) }
          showCode('hover', hn, hm); return
        }
        if ((b = e.target.closest('[data-mo-swap]'))) {
          S.touched = Date.now()
          toggleSwap(b)
          var pair = MV.swaps[+b.getAttribute('data-mo-swap')]
          showCode('swap', pair[0], { preset: 'pop' }, { to: pair[1].replace('@', ' in '), fx: swapFx(pair[0], pair[1]) })
        }
      })
      function toggleSwap(b, on) {
        var v = on == null ? b.getAttribute('aria-pressed') !== 'true' : on
        b.setAttribute('aria-pressed', v ? 'true' : 'false')
        var w = $('.wm-swap', b); if (w) w.classList.toggle('is-on', v)
      }
      // an idle demo: the swaps flip one after another until someone clicks one
      var k = 0
      if (!reduced) loop(boxSwaps, function () {
        if (S.paused || Date.now() - S.touched < 8000) return
        var bs = $$('.mo-swap', boxSwaps); if (!bs.length) return
        toggleSwap(bs[k % bs.length]); k++
      }, 1100)
      // loops only run while the section is on screen
      WI.visibility(sec, function (v) { sec.classList.toggle('is-off', !v) }, '120px')
    }
  }
  // the icon pack (≈160 KB gzipped) loads after the page is interactive, so it never delays the header or first paint
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
