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

  // pause looping sticker animations when off-screen (cheap, keeps the main thread quiet)
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => e.target.style.animationPlayState = e.isIntersecting ? 'running' : 'paused'))
    document.querySelectorAll('.sticker, .j-orbit span, .b-cta__icons svg').forEach(el => io.observe(el))
  }
})()
