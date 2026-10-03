// with icons Journal: progressive enhancement only (theme, header, search come from the site's js/site.js).
(() => {
  // table of contents: highlight the last heading scrolled past
  const tocLinks = [...document.querySelectorAll('.toc a[href^="#"]')]
  const heads = tocLinks.map(a => document.getElementById(decodeURIComponent(a.hash.slice(1))))
  let lastActive = -1
  const syncToc = () => {
    let i = 0
    heads.forEach((h, n) => { if (h && h.getBoundingClientRect().top < 140) i = n })
    if (i !== lastActive) { tocLinks[lastActive]?.classList.remove('is-active'); tocLinks[i]?.classList.add('is-active'); lastActive = i }
  }
  if (tocLinks.length) { addEventListener('scroll', () => requestAnimationFrame(syncToc), { passive: true }); syncToc() }

  // copy link
  document.querySelectorAll('[data-copy-link]').forEach(btn => btn.addEventListener('click', async () => {
    const label = btn.querySelector('span')
    try { await navigator.clipboard.writeText(location.href.split('#')[0]); if (label) { const t = label.textContent; label.textContent = 'Copied!'; setTimeout(() => (label.textContent = t), 1600) } } catch {}
  }))

  // index filters (links work without JS: they jump to anchors)
  const filters = document.querySelectorAll('[data-filter]')
  if (filters.length) {
    const cards = [...document.querySelectorAll('[data-cat]')]
    const apply = cat => {
      filters.forEach(f => f.setAttribute('aria-pressed', String(f.dataset.filter === cat)))
      cards.forEach(c => { c.hidden = cat !== 'all' && c.dataset.cat !== cat })
    }
    filters.forEach(f => f.addEventListener('click', e => { e.preventDefault(); apply(f.dataset.filter) }))
  }

  // tables: show the sideways-scroll hint and edge fade only when a table really is wider than its box
  const tableFigs = [...document.querySelectorAll('.b-table')]
  const syncTable = f => {
    const s = f.querySelector('.b-table__scroll'); if (!s) return
    const over = s.scrollWidth > s.clientWidth + 1
    f.classList.toggle('is-overflow', over)
    f.classList.toggle('is-end', !over || s.scrollLeft + s.clientWidth >= s.scrollWidth - 2)
  }
  tableFigs.forEach(f => { syncTable(f); f.querySelector('.b-table__scroll')?.addEventListener('scroll', () => syncTable(f), { passive: true }) })
  if (tableFigs.length && 'ResizeObserver' in window) { const ro = new ResizeObserver(() => tableFigs.forEach(syncTable)); tableFigs.forEach(f => ro.observe(f)) }

  // moving icons: demos built with motionGrid / swapGrid / styleRow({ motion }) on posts that load the site's own
  // motion runtime (../vendor/motion/motion.css + motion.js). Each icon's own motion is already inline, so loops play
  // with the CSS alone; here the runtime takes over (hover that finishes, draw strokes, off-screen pause) and each demo
  // gets its small controls row. Reduced motion is respected unless the reader asks to play anyway.
  const demos = document.querySelectorAll('[data-motion]')
  if (demos.length) {
    const M = window.WithMotion
    const reduce = matchMedia('(prefers-reduced-motion: reduce)')
    // the OS setting, or the site's own "Pause animations" toggle (site.js sets html.is-still; tokens.css stills everything but .wm-force)
    const root = document.documentElement
    const isStill = () => reduce.matches || root.classList.contains('is-still')
    const svg = d => `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">${d}</svg>`
    const PAUSE = svg('<rect x="3.5" y="2.5" width="3" height="11" rx="1" fill="currentColor"/><rect x="9.5" y="2.5" width="3" height="11" rx="1" fill="currentColor"/>')
    const PLAY = svg('<path d="M4.5 2.8v10.4a.8.8 0 0 0 1.2.7l8.3-5.2a.8.8 0 0 0 0-1.4L5.7 2.1a.8.8 0 0 0-1.2.7Z" fill="currentColor"/>')
    const HINT = { loop: 'Playing on a loop', hover: 'Hover, focus or tap an icon to play it', swap: 'Tap an icon to switch it' }
    demos.forEach(fig => {
      const kind = fig.dataset.motion
      const movers = [...fig.querySelectorAll('[data-wm-spec]')]
      const swaps = [...fig.querySelectorAll('[data-swap]')]
      if (M) {
        movers.forEach(el => { try { M.motion(el, JSON.parse(el.dataset.wmSpec), { trigger: el.dataset.wmTrigger }) } catch {} })
        fig.querySelectorAll('.wm-swap.wm-fx-draw').forEach(sw => { try { const a = M.prepareDraw(sw.querySelector('.wm-a')), b = M.prepareDraw(sw.querySelector('.wm-b')); if (a || b) sw.classList.add('wm-drawable') } catch {} })
      }
      const setOn = (btn, on) => btn.setAttribute('aria-pressed', String(on))
      swaps.forEach(btn => { setOn(btn, false); btn.addEventListener('click', () => { fig.dataset.touched = '1'; setOn(btn, btn.getAttribute('aria-pressed') !== 'true') }) })

      const bar = document.createElement('div')
      bar.className = 'b-motion__bar'
      bar.innerHTML = `<span class="b-motion__hint">${HINT[kind] || ''}</span><span class="b-motion__note" hidden>Motion is switched off (by your device or the site’s Pause animations setting), so these stay still. <button type="button" class="b-motion__link">Play anyway</button></span>`
        + (kind === 'loop' ? `<button type="button" class="b-motion__btn" aria-pressed="false">${PAUSE}<span>Pause</span></button>` : '')
        + (kind === 'swap' ? `<button type="button" class="b-motion__btn" aria-pressed="false">${PLAY}<span>Switch all</span></button>` : '')
      fig.prepend(bar)
      const note = bar.querySelector('.b-motion__note'), btn = bar.querySelector('.b-motion__btn')
      const all = () => [...fig.querySelectorAll('.wm, .wm-swap')]
      const syncReduce = () => { const still = isStill() && !fig.classList.contains('is-forced'); note.hidden = !still || kind === 'swap'; bar.classList.toggle('is-still', still && kind !== 'swap') }
      note.querySelector('button').addEventListener('click', () => { fig.classList.add('is-forced'); all().forEach(el => el.classList.add('wm-force')); syncReduce() })
      reduce.addEventListener?.('change', syncReduce); new MutationObserver(syncReduce).observe(root, { attributes: true, attributeFilter: ['class'] }); syncReduce()
      if (btn && kind === 'loop') btn.addEventListener('click', () => {
        const paused = btn.getAttribute('aria-pressed') !== 'true'
        btn.setAttribute('aria-pressed', String(paused))
        btn.innerHTML = `${paused ? PLAY : PAUSE}<span>${paused ? 'Play' : 'Pause'}</span>`
        all().forEach(el => el.classList.toggle('wm-paused', paused))
      })
      if (btn && kind === 'swap') btn.addEventListener('click', () => {
        fig.dataset.touched = '1'
        const on = btn.getAttribute('aria-pressed') !== 'true'
        btn.setAttribute('aria-pressed', String(on)); swaps.forEach((s, i) => setTimeout(() => setOn(s, on), i * 90))
      })
      // swaps show themselves once when they first scroll into view: each turns into its partner and back
      if (kind === 'swap' && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(es => es.forEach(e => {
          if (!e.isIntersecting) return
          io.disconnect()
          if (isStill()) return
          swaps.forEach((s, i) => {
            setTimeout(() => { if (!fig.dataset.touched) setOn(s, true) }, 300 + i * 180)
            setTimeout(() => { if (!fig.dataset.touched) setOn(s, false) }, 1900 + i * 180)
          })
        }), { threshold: 0.6 })
        io.observe(fig)
      }
    })
  }

  // pause looping sticker animations when off-screen (cheap, keeps the main thread quiet)
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => e.target.style.animationPlayState = e.isIntersecting ? 'running' : 'paused'))
    document.querySelectorAll('.sticker, .j-orbit span, .b-cta__icons svg').forEach(el => io.observe(el))
  }
})()
