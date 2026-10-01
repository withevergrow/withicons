/* with icons — content pages runtime (guides, developers, AI, about, licence, FAQ).
   Vanilla, no build, works from file://. Uses window.WI (site.js) when present; every feature degrades to
   static, readable HTML without it. */
(function () {
  'use strict'
  var W = window, doc = document
  var reduced = !!(W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches)
  function $(s, c) { return (c || doc).querySelector(s) }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)) }
  function WI() { return W.WI || W.EG || null }
  function esc(v) { return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }
  function svg(name, size) { var w = WI(); return (w && w.svg && w.svg(name, 'line', size || 24)) || '' }

  /* run fn(visible) when element enters/leaves view and the tab is visible */
  function visibility(el, fn) {
    var w = WI()
    if (w && w.visibility) return w.visibility(el, fn)
    if (!('IntersectionObserver' in W)) { fn(true); return }
    new IntersectionObserver(function (es) { es.forEach(function (e) { fn(e.isIntersecting) }) }).observe(el)
  }
  function every(el, ms, tick) {
    var t = null
    visibility(el, function (on) {
      if (on && !t && !reduced) t = setInterval(tick, ms)
      else if (!on && t) { clearInterval(t); t = null }
    })
  }

  /* ───────── guides: sticky stage follows the active step ───────── */
  function initSteps() {
    $$('[data-steps]').forEach(function (grid) {
      var steps = $$('.g-step', grid), frames = $$('.g-frame', grid), dots = $$('.g-stage-dots i', grid)
      var current = -1
      function set(i) {
        if (i === current) return
        current = i
        steps.forEach(function (s, k) { s.classList.toggle('is-active', k === i) })
        frames.forEach(function (f, k) { f.classList.toggle('is-on', k === i) })
        dots.forEach(function (d, k) { d.classList.toggle('is-on', k === i) })
        // inline frames (narrow screens) replay when their step activates
        steps.forEach(function (s, k) { var a = $('.g-step-art', s); if (a) a.classList.toggle('is-on', k === i) })
      }
      if (!('IntersectionObserver' in W)) { set(0); return }
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) set(+e.target.getAttribute('data-step')) })
      }, { rootMargin: '-42% 0px -48% 0px' })
      steps.forEach(function (s) { io.observe(s) })
      set(0)
    })
    $$('.g-hero-art').forEach(function (art) { every(art, 2600, function () { art.classList.toggle('is-alt') }) })
  }

  /* ───────── tabs (WAI-ARIA, arrow keys) ───────── */
  function initTabs() {
    $$('[data-tabs]').forEach(function (box) {
      var tabs = $$('[role="tab"]', box)
      function select(t, focus) {
        tabs.forEach(function (x) {
          var on = x === t
          x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1
          var p = doc.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on
        })
        if (focus) t.focus()
      }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(t) })
        t.addEventListener('keydown', function (e) {
          var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null
          if (n == null) return
          e.preventDefault(); select(tabs[(n + tabs.length) % tabs.length], true)
        })
      })
    })
  }

  /* ───────── guides index: file helper + filters ───────── */
  function initGuideIndex() {
    var data = $('[data-helper-data]'), out = $('[data-helper-out]')
    if (data && out) {
      var list = []; try { list = JSON.parse(data.textContent) } catch (e) { }
      var btns = $$('[data-helper]')
      btns.forEach(function (b) {
        b.addEventListener('click', function () {
          var g = list[+b.getAttribute('data-helper')]; if (!g) return
          btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b) })
          var size = /any|copy/.test(g.size) ? '' : ' · ' + g.size
          out.style.setProperty('--g', getComputedStyle(b).getPropertyValue('--g'))
          out.innerHTML = '<span class="gi-helper-file"><b>' + esc(g.best.split(' ')[0]) + '</b></span><span><b>' + esc(g.best + size) + '</b> ' + esc(g.why) + ' <a href="' + esc(g.slug) + '.html">Open the ' + esc(g.app) + ' guide →</a></span>'
          out.classList.remove('is-swap'); void out.offsetWidth; out.classList.add('is-swap')
        })
      })
    }
    var grid = $('[data-guide-grid]')
    if (grid) {
      var fbtns = $$('[data-filter]'), items = $$('li', grid)
      fbtns.forEach(function (b) {
        b.addEventListener('click', function () {
          var f = b.getAttribute('data-filter'), n = 0
          fbtns.forEach(function (x) { x.setAttribute('aria-pressed', x === b) })
          items.forEach(function (li) {
            var show = f === 'all' || li.getAttribute('data-group') === f
            li.classList.toggle('is-hidden', !show)
            li.classList.remove('is-entering')
            if (show) { li.style.setProperty('--n', n++); void li.offsetWidth; li.classList.add('is-entering') }
          })
        })
      })
    }
  }

  /* ───────── developers ───────── */
  function initDevelopers() {
    var play = $('[data-stroke-play]')
    if (play) {
      var range = $('[data-stroke-range]', play), outp = $('[data-stroke-out]', play), codeEl = $('[data-stroke-code] code', play)
      range.addEventListener('input', function () {
        var v = range.value
        $$('.dv-play-icons svg', play).forEach(function (s) { s.setAttribute('stroke-width', v) })
        outp.textContent = v
        if (codeEl) codeEl.innerHTML = '<span class="t-p">&lt;</span><span class="t-t">Settings</span> <span class="t-a">strokeWidth</span><span class="t-p">=</span><span class="t-p">{</span><span class="t-n">' + esc(v) + '</span><span class="t-p">}</span> <span class="t-p">/&gt;</span>'
      })
    }
    var theme = $('[data-theme-play]')
    if (theme) {
      var stage = $('[data-theme-stage]', theme), codeT = $('[data-theme-code] code', theme)
      var inputs = $$('input[data-var]', theme)
      var upd = function () {
        var vals = {}
        inputs.forEach(function (i) {
          var k = i.getAttribute('data-var'); vals[k] = i.value
          if (k === 'color') stage.style.color = i.value
          else { stage.style.setProperty(k, i.value); stage.style.setProperty(k.replace('--with-', '--eg-'), i.value) }
        })
        if (codeT) codeT.innerHTML = '<span class="t-p">.</span>toolbar <span class="t-p">{</span> <span class="t-a">color</span><span class="t-p">:</span> ' + esc(vals.color) + '<span class="t-p">;</span> <span class="t-a">--with-duo</span><span class="t-p">:</span> ' + esc(vals['--with-duo']) + '<span class="t-p">;</span> <span class="t-a">--with-accent</span><span class="t-p">:</span> ' + esc(vals['--with-accent']) + '<span class="t-p">;</span> <span class="t-p">}</span>'
      }
      // dark mode: start the ink colour on the page's own text colour
      var ci = $('input[data-var="color"]', theme)
      if (ci) { var c = getComputedStyle(stage).color.match(/\d+/g); if (c) ci.value = '#' + c.slice(0, 3).map(function (n) { return ('0' + (+n).toString(16)).slice(-2) }).join('') }
      inputs.forEach(function (i) { i.addEventListener('input', upd) })
    }
    var res = $('[data-resolve]')
    if (res) {
      var inp = $('[data-resolve-in]', res), out = $('[data-resolve-out]', res)
      var run = function () {
        var q = inp.value.trim(), r = resolve(q)
        if (!q) { out.innerHTML = ''; return }
        if (!r) { out.innerHTML = '<span>Search engine is loading…</span>'; return }
        if (r.name) {
          out.className = 'dv-resolve-out r-ok'
          out.innerHTML = '<span class="r-tag">resolved</span><span class="r-ic r-anim">' + svg(r.name, 30) + '</span><code>' + esc(r.name) + '</code>' + (r.alias ? '<span>via alias “' + esc(r.alias) + '”</span>' : '')
        } else if (r.ambiguous) {
          out.className = 'dv-resolve-out r-amb'
          out.innerHTML = '<span class="r-tag">ambiguous</span><span>Did you mean:</span>' + r.ambiguous.map(function (n) { return '<button type="button" data-pick="' + esc(n) + '">' + esc(n) + '</button>' }).join('')
        } else {
          out.className = 'dv-resolve-out r-unk'
          out.innerHTML = '<span class="r-tag">unknown</span><span>Nearest:</span>' + (r.nearest || []).slice(0, 4).map(function (n) { return '<button type="button" data-pick="' + esc(n) + '">' + esc(n) + '</button>' }).join('')
        }
      }
      inp.addEventListener('input', run)
      res.addEventListener('click', function (e) {
        var b = e.target.closest('[data-resolve-try], [data-pick]'); if (!b) return
        inp.value = b.getAttribute('data-resolve-try') || b.getAttribute('data-pick'); run()
      })
      run()
    }
    // table of contents: highlight the section in view
    var toc = $$('.dv-toc a, .fq-toc a')
    if (toc.length && 'IntersectionObserver' in W) {
      var targets = toc.map(function (a) { return doc.getElementById(a.getAttribute('href').slice(1)) })
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return
          toc.forEach(function (a, i) { a.classList.toggle('is-current', targets[i] === e.target) })
        })
      }, { rootMargin: '-20% 0px -70% 0px' })
      targets.forEach(function (t) { if (t) io.observe(t) })
    }
  }

  /* ───────── search engine access (shared with MCP) ───────── */
  var engine = null
  function getEngine() {
    if (engine) return engine
    if (W.WithSearch && W.WITH_SEARCH_INDEX) { try { engine = W.WithSearch.create(W.WITH_SEARCH_INDEX) } catch (e) { } }
    return engine
  }
  function resolve(q) {
    var e = getEngine(); if (e) return e.resolve(q)
    var w = WI(); return w && w.resolve ? w.resolve(q) : null
  }
  function search(q, o) {
    var e = getEngine(); if (e) return e.search(q, o)
    var w = WI(); return w && w.search ? w.search(q, o) : []
  }

  /* the exact response shapes of @withicons/mcp (packages/mcp/src/lib.mjs) */
  var REASON = { name: 'name', alias: 'alias', synonym: 'related word', tag: 'tag', category: 'category', description: 'description' }
  function pascal(n) { return n.split('-').map(function (w) { return w[0].toUpperCase() + w.slice(1) }).join('') }
  function reactSnippet(name, style) {
    var P = pascal(name)
    if (style === 'line') return "import { " + P + " } from '@withicons/react'\n\n<" + P + " />"
    var local = P + style[0].toUpperCase() + style.slice(1)
    return "import { " + P + " as " + local + " } from '@withicons/react/" + style + "'\n\n<" + local + " />"
  }
  function mcpSearch(query, hits) {
    var e = getEngine(), parsed = e && e.parse ? e.parse(query) : null
    var style = (parsed && parsed.style) || 'line'
    return {
      query: query, style: style, count: hits.length,
      results: hits.map(function (r) {
        return { name: r.name, title: r.title, category: r.category, score: r.score,
          reason: 'matched ' + REASON[r.match.field] + ' "' + r.match.term + '"' + (r.match.typo ? ' (typo-tolerant)' : ''),
          match: r.match, snippet: reactSnippet(r.name, style), url: 'https://withicons.com/icons/' + r.name + '.html' }
      }),
      suggestions: hits.length || !e ? [] : e.suggest(query, 5),
    }
  }
  function mcpResolve(r) {
    if (r.ambiguous) return { status: 'ambiguous', candidates: r.ambiguous }
    if (!r.name) return { status: 'unknown', nearest: r.nearest || [] }
    var e = getEngine(), m = e && e.get ? e.get(r.name) : null
    var o = { status: 'resolved', name: r.name, via: r.alias ? 'alias' : 'name' }
    if (r.alias) o.alias = r.alias
    if (m) { o.title = m.title; o.category = m.category; o.aliases = m.aliases }
    return o
  }

  /* ───────── AI page ───────── */
  function initAI() {
    var chat = $('[data-chat]')
    if (chat) visibility(chat, function (on) { if (on) chat.classList.add('is-play') })
    var box = $('[data-ai-demo]'); if (!box) return
    var q = $('[data-ai-q]', box), call = $('[data-ai-call]', box), resEl = $('[data-ai-res]', box), icons = $('[data-ai-icons]', box), ms = $('[data-ai-ms]', box)
    var tool = 'search_icons'
    function hl(json) {
      return esc(json).replace(/(&quot;[^&]*?&quot;)(\s*:)?/g, function (m, s, colon) { return colon ? '<span class="t-a">' + s + '</span>' + colon : '<span class="t-s">' + s + '</span>' }).replace(/\b(-?\d+(?:\.\d+)?)\b/g, '<span class="t-n">$1</span>').replace(/\b(true|false|null)\b/g, '<span class="t-k">$1</span>')
    }
    function run() {
      var text = q.value.trim()
      var args = tool === 'search_icons' ? { query: text, limit: 6 } : { name: text }
      call.innerHTML = hl(JSON.stringify({ tool: tool, arguments: args }, null, 2))
      var t0 = (W.performance || Date).now(), out = null, names = []
      if (tool === 'search_icons') {
        var hits = text ? search(text, { limit: 6 }) : []
        if (hits) out = mcpSearch(text, hits)
        names = (hits || []).map(function (h) { return h.name })
      } else {
        var r = text ? resolve(text) : { unknown: true, nearest: [] }
        if (r) out = mcpResolve(r)
        names = !r ? [] : r.name ? [r.name] : (r.ambiguous || r.nearest || [])
      }
      var dt = (W.performance || Date).now() - t0
      ms.textContent = out ? dt.toFixed(1) + ' ms' : ''
      resEl.innerHTML = out ? hl(JSON.stringify(out, null, 2)) : 'Loading the search engine…'
      icons.innerHTML = names.slice(0, 6).map(function (n, i) { return '<span style="--n:' + i + '">' + svg(n, 28) + esc(n) + '</span>' }).join('')
    }
    q.addEventListener('input', run)
    box.addEventListener('click', function (e) {
      var t = e.target.closest('[data-ai-tool]')
      if (t) { tool = t.getAttribute('data-ai-tool'); $$('[data-ai-tool]', box).forEach(function (b) { b.setAttribute('aria-pressed', b === t) }); run(); return }
      var tr = e.target.closest('[data-ai-try]')
      if (tr) { q.value = tr.getAttribute('data-ai-try'); run() }
    })
    run()
  }

  /* ───────── about page ───────── */
  function initAbout() {
    var m = $('[data-morph]')
    if (m) {
      var fr = $$('.ab-mf', m), tag = $('[data-morph-tag]', m), i = 0
      var show = function (k) {
        fr.forEach(function (f, j) { f.classList.toggle('is-on', j === k) })
        if (tag) tag.textContent = fr[k].getAttribute('data-style')
        m.style.setProperty('--morph-c', getComputedStyle(fr[k]).getPropertyValue('--g'))
      }
      show(0)
      every(m, 1900, function () { i = (i + 1) % fr.length; show(i) })
    }
    var sc = $('[data-scrolly]')
    if (sc && 'IntersectionObserver' in W) {
      var steps = $$('[data-sstep]', sc), frames = $$('[data-sf]', sc), label = $('[data-sf-label]', sc)
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return
          var k = +e.target.getAttribute('data-sstep')
          steps.forEach(function (s, j) { s.classList.toggle('is-active', j === k) })
          frames.forEach(function (f) { f.classList.toggle('is-on', +f.getAttribute('data-sf') === k) })
          if (label) label.textContent = $('h3', e.target).textContent
        })
      }, { rootMargin: '-45% 0px -45% 0px' })
      steps.forEach(function (s) { io.observe(s) })
    }
    $$('[data-count]').forEach(function (el) {
      var to = +el.getAttribute('data-count'); if (reduced || !to) return
      var done = false
      visibility(el, function (on) {
        if (!on || done) return
        done = true
        var t0 = null, dur = 1400
        var step = function (t) {
          if (!t0) t0 = t
          var p = Math.min(1, (t - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - p, 3)))
          el.textContent = v.toLocaleString('en')
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      })
    })
  }

  /* ───────── FAQ ───────── */
  function initFAQ() {
    var input = $('[data-faq-filter]'); if (!input) return
    var items = $$('[data-faq-item]'), groups = $$('.fq-group'), count = $('[data-faq-count]'), empty = $('[data-faq-empty]')
    items.forEach(function (d) { d._text = d.textContent.toLowerCase() })
    input.addEventListener('input', function () {
      var words = input.value.toLowerCase().split(/\s+/).filter(Boolean), shown = 0
      items.forEach(function (d) {
        var ok = words.every(function (w) { return d._text.indexOf(w) >= 0 })
        d.classList.toggle('is-hidden', !ok)
        if (ok) shown++
        if (words.length && ok && shown <= 3) d.open = true
        if (!words.length) d.open = false
      })
      groups.forEach(function (g) { g.classList.toggle('is-empty', !$$('[data-faq-item]:not(.is-hidden)', g).length) })
      if (count) count.textContent = words.length ? shown + ' of ' + items.length : ''
      if (empty) empty.hidden = shown > 0
    })
  }

  /* open a <details> targeted by the URL hash */
  function openHash() {
    var id = location.hash.slice(1); if (!id) return
    var el = doc.getElementById(id); if (el && el.tagName === 'DETAILS') el.open = true
  }

  function init() {
    initSteps(); initTabs(); initGuideIndex(); initDevelopers(); initAI(); initAbout(); initFAQ(); openHash()
    var w = WI()
    // the shared search engine may arrive after us (lazy) — re-run demos once it does
    if (!getEngine() && w && w.ensureSearch) w.ensureSearch().then(function () { var q = $('[data-ai-q]'); if (q) q.dispatchEvent(new Event('input')); var r = $('[data-resolve-in]'); if (r) r.dispatchEvent(new Event('input')) }, function () { })
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init()
})()
