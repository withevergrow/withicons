/*! with icons demo kit. A floating control bar + settings panel for the demo pages (see demos/README.md).
 *
 * Classic script, no dependencies, works from file://. It loads the real library from jsDelivr:
 *   @withicons/web (<with-icon>), @withicons/dynamic (<with-live-icon>, only when a page uses one),
 *   @withicons/motion (only when motion is on), @withicons/search (only when you pick icons).
 *
 * Page contract
 *   <script src="_kit/demo-kit.js" data-style="gothic" data-recommend="gothic,halloween,sketch" data-level="2" defer></script>
 *   <span data-ico="calendar" data-size="22">📅</span>        icon slot; the text inside is the Basic-level fallback (emoji or plain glyph)
 *   <span data-live="calendar-date" data-p-day="31" data-p-month="OCT" data-size="64">31</span>   live icon slot (params as data-p-*)
 *   data-min-level="2" / data-max-level="0"  on ANY element: only shown at that level or higher / only at Basic
 *   data-fixed-style="line"                  keep one icon in a style whatever the page style is
 *   data-motion="hover|loop|once|inview"     authored motion, played at Full level (panel Motion: Auto)
 *   data-label="Halloween"                   makes the icon a labelled image (otherwise aria-hidden)
 *   data-kit-key="hero-diya"                 stable key for saved swaps (default: DOM order)
 *   Levels: 0 Basic (plain site: emoji and text) · 1 Upgraded (with icons, in the chosen style) · 2 Full (+ live icons, motion, extras)
 *   JS: WithKit.refresh(root) after you add markup · WithKit.setLive(el, {count: 3}) · WithKit.state() · WithKit.on(fn)
 */
;(function () {
  'use strict'
  if (window.WithKit) return

  const SCRIPT = document.currentScript || document.querySelector('script[src*="demo-kit"]')
  const DS = (SCRIPT && SCRIPT.dataset) || {}
  const V = { web: '0.5.0', dynamic: '0.5.0', motion: '0.5.0', search: '0.5.0' }
  const CDN = 'https://cdn.jsdelivr.net/npm/'
  const URL_WEB = CDN + '@withicons/web@' + V.web + '/dist/cdn.js'
  const URL_LIVE = CDN + '@withicons/dynamic@' + V.dynamic + '/dist/cdn/lite.js'
  const URL_MOTION_CSS = CDN + '@withicons/motion@' + V.motion + '/dist/motion.css'
  const URL_MOTION_JS = CDN + '@withicons/motion@' + V.motion + '/dist/element.js'
  const URL_SEARCH_JS = CDN + '@withicons/search@' + V.search + '/dist/index.js'
  const URL_SEARCH_DATA = CDN + '@withicons/search@' + V.search + '/dist/index.json'

  const GROUPS = [
    ['Essentials', ['line', 'solid', 'duo', 'suite']],
    ['Product & brand', ['bento', 'dock', 'brutal', 'bauhaus']],
    ['3D & glass', ['clay', 'glass', 'liquid', 'chrome', 'soft3d', 'luxe', 'skeuo']],
    ['Playful', ['kawaii', 'plush', 'sticker', 'gloss', 'pastel', 'pixel', 'retro']],
    ['Artistic', ['sketch', 'engrave', 'blueprint', 'anime', 'gothic', 'coquette']],
    ['Holidays', ['utsav', 'rangoli', 'halloween', 'christmas', 'lunar', 'valentine']],
  ]
  const STYLES = GROUPS.flatMap(g => g[1])
  const GROUP_OF = {}; GROUPS.forEach(g => g[1].forEach(s => { GROUP_OF[s] = g[0] }))
  const SAY = {
    line: 'Clean outlines', solid: 'Filled glyphs', duo: 'Two-tone with an accent', suite: 'Office-suite tiles',
    bento: 'Soft app tiles', dock: 'Glossy app-dock tiles', brutal: 'Neo-brutalist, hard shadows', bauhaus: 'Primary shapes',
    clay: 'Soft clay 3D', glass: 'Frosted glass', liquid: 'Liquid glass', chrome: 'Polished chrome', soft3d: 'Soft 3D renders', luxe: 'Gold and enamel', skeuo: 'Skeuomorphic objects',
    kawaii: 'Cute faces, round lines', plush: 'Stitched plush toys', sticker: 'Die-cut stickers', gloss: 'Glossy fills', pastel: 'Soft pastels', pixel: '8-bit pixels', retro: 'Vintage print',
    sketch: 'Pencil sketch', engrave: 'Etched engraving', blueprint: 'Technical drawing', anime: 'Manga colour', gothic: 'Dark gothic', coquette: 'Bows and blush',
    utsav: 'Ornate Indian festival', rangoli: 'Bright festival colour', halloween: 'Spooky fun', christmas: 'Cosy Christmas', lunar: 'Lunar New Year', valentine: 'Hearts and roses',
  }
  const STROKE_STYLES = { line: 1, duo: 1, blueprint: 1, sketch: 1, kawaii: 1 }
  const MIN_PX = { line: 12, solid: 12, duo: 18, luxe: 48, skeuo: 48, gothic: 48, plush: 48 }
  const minPx = s => MIN_PX[s] || 32
  const LEVELS = [
    ['Basic', 'A plain site: emoji and text, no icon library.'],
    ['Upgraded', 'The same page with with icons swapped in, in the chosen style.'],
    ['Full', 'Upgraded plus live icons, motion and decorative extras.'],
  ]
  const INKS = (DS.inks || '#111111,#ffffff,#e11d48,#7c3aed,#0284c7,#16a34a,#d97706').split(',').map(s => s.trim()).filter(Boolean)

  const qs = (s, r) => (r || document).querySelector(s)
  const qsa = (s, r) => Array.from((r || document).querySelectorAll(s))
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n))
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
  const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches
  const PAGE = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '')
  const LS_KEY = 'withicons-demo:' + PAGE
  const LS_POS = 'withicons-demo:pos'
  const store = {
    get(k) { try { return localStorage.getItem(k) } catch (e) { return null } },
    set(k, v) { try { localStorage.setItem(k, v) } catch (e) {} },
  }

  // ───────────────────────── state ─────────────────────────
  const DEFAULT = {
    style: STYLES.includes(DS.style) ? DS.style : 'line',
    level: [0, 1, 2].includes(parseInt(DS.level, 10)) ? parseInt(DS.level, 10) : 2,
    scale: 1, weight: 0, ink: '', motion: 'auto', swaps: {}, over: {},
  }
  const RECOMMEND = (DS.recommend || '').split(',').map(s => s.trim()).filter(s => STYLES.includes(s))
  const S = Object.assign({}, DEFAULT, { swaps: {}, over: {} })
  let pos = store.get(LS_POS) === 'left' ? 'left' : (DS.position === 'left' ? 'left' : 'right')
  let hidden = false, startOpen = false

  function loadState() {
    try {
      const raw = store.get(LS_KEY)
      if (raw) {
        const o = JSON.parse(raw)
        if (STYLES.includes(o.style)) S.style = o.style
        if ([0, 1, 2].includes(o.level)) S.level = o.level
        if (typeof o.scale === 'number') S.scale = clamp(o.scale, 0.5, 2)
        if (typeof o.weight === 'number') S.weight = o.weight
        if (typeof o.ink === 'string') S.ink = /^#[0-9a-f]{3,8}$/i.test(o.ink) ? o.ink : ''
        if (['auto', 'off', 'hover', 'loop'].includes(o.motion)) S.motion = o.motion
        if (o.swaps && typeof o.swaps === 'object') S.swaps = o.swaps
        if (o.over && typeof o.over === 'object') S.over = o.over
      }
    } catch (e) {}
    const h = new URLSearchParams(location.hash.replace(/^#/, ''))
    if (STYLES.includes(h.get('ico'))) S.style = h.get('ico')
    if (h.has('lv') && [0, 1, 2].includes(+h.get('lv'))) S.level = +h.get('lv')
    if (h.has('sz') && isFinite(+h.get('sz'))) S.scale = clamp(+h.get('sz'), 0.5, 2)
    if (h.has('sw') && isFinite(+h.get('sw'))) S.weight = clamp(+h.get('sw'), 0, 3)
    if (h.has('ink') && /^[0-9a-f]{3,8}$/i.test(h.get('ink'))) S.ink = '#' + h.get('ink')
    if (['auto', 'off', 'hover', 'loop'].includes(h.get('mo'))) S.motion = h.get('mo')
    if (h.get('panel') === 'hide') hidden = true
    if (h.get('panel') === 'open') startOpen = true
  }
  let saveTimer = 0
  function persist() {
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      store.set(LS_KEY, JSON.stringify({ style: S.style, level: S.level, scale: S.scale, weight: S.weight, ink: S.ink, motion: S.motion, swaps: S.swaps, over: S.over }))
      const p = new URLSearchParams()
      if (S.style !== DEFAULT.style) p.set('ico', S.style)
      if (S.level !== DEFAULT.level) p.set('lv', S.level)
      if (S.scale !== 1) p.set('sz', S.scale.toFixed(2))
      if (S.weight) p.set('sw', S.weight)
      if (S.ink) p.set('ink', S.ink.slice(1))
      if (S.motion !== 'auto') p.set('mo', S.motion)
      const str = p.toString()
      try { history.replaceState(null, '', location.pathname + location.search + (str ? '#' + str : '')) } catch (e) {}
    }, 150)
  }

  // ───────────────────────── page css ─────────────────────────
  const css = document.createElement('style')
  css.id = 'withicons-kit-page-css'
  css.textContent = `
.kit-ico,.kit-live{display:inline-flex;align-items:center;justify-content:center;line-height:1;flex:none;vertical-align:middle;text-align:center}
.kit-ico>with-icon,.kit-live>with-live-icon{display:none}
.kit-ico>.kit-fb,.kit-live>.kit-fb{display:inline-block;line-height:1}
html[data-level="1"] .kit-ico[data-ready]>with-icon,html[data-level="2"] .kit-ico[data-ready]>with-icon,
html[data-level="1"] .kit-live[data-ready]>with-live-icon,html[data-level="2"] .kit-live[data-ready]>with-live-icon{display:inline-flex}
html[data-level="1"] .kit-ico[data-ready]>.kit-fb,html[data-level="2"] .kit-ico[data-ready]>.kit-fb,
html[data-level="1"] .kit-live[data-ready]>.kit-fb,html[data-level="2"] .kit-live[data-ready]>.kit-fb{display:none}
html[data-level="0"] [data-min-level="1"],html[data-level="0"] [data-min-level="2"],html[data-level="1"] [data-min-level="2"],
html[data-level="1"] [data-max-level="0"],html[data-level="2"] [data-max-level="0"],html[data-level="2"] [data-max-level="1"]{display:none!important}
html[data-kit-ink] .kit-ico,html[data-kit-ink] .kit-live{color:var(--kit-ink)!important}
html.kit-editing .kit-ico,html.kit-editing .kit-live{outline:2px dashed #ff5ea8;outline-offset:4px;border-radius:6px;cursor:copy!important}
html.kit-editing .kit-ico:hover,html.kit-editing .kit-live:hover{outline-color:#7c5cff;background:rgba(124,92,255,.14)}
html.kit-editing .kit-ico *,html.kit-editing .kit-live *{pointer-events:none}
@media print{#withicons-kit{display:none!important}}
`
  document.head.appendChild(css)

  // ───────────────────────── runtime loading ─────────────────────────
  const loaded = {}
  const failToast = []
  function loadWeb() {
    if (loaded.web) return loaded.web
    loaded.web = (customElements.get('with-icon') ? Promise.resolve() : import(URL_WEB)).catch(e => { toast('Could not load the icon runtime (offline?)'); throw e })
    return loaded.web
  }
  function loadLive() {
    if (loaded.live) return loaded.live
    loaded.live = new Promise((res, rej) => {
      if (customElements.get('with-live-icon')) return res()
      const s = document.createElement('script'); s.src = URL_LIVE; s.async = true
      s.onload = () => res(); s.onerror = () => { toast('Could not load live icons'); rej(new Error('live')) }
      document.head.appendChild(s)
    })
    return loaded.live
  }
  function loadMotion() {
    if (loaded.motion) return loaded.motion
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = URL_MOTION_CSS; document.head.appendChild(l)
    loaded.motion = import(URL_MOTION_JS).catch(() => {})
    return loaded.motion
  }

  // ───────────────────────── icon slots ─────────────────────────
  const icons = [], lives = []
  let seq = 0
  const setAttr = (el, a, v) => { if (v == null || v === false) { if (el.hasAttribute(a)) el.removeAttribute(a) } else if (el.getAttribute(a) !== String(v)) el.setAttribute(a, v) }

  function watchReady(host, el) {
    let n = 0
    const t = setInterval(() => {
      const ok = el.shadowRoot && el.shadowRoot.querySelector('svg')
      if (ok) host.setAttribute('data-ready', '')
      if (ok || ++n > 80) clearInterval(t)
    }, 90)
  }

  function initIcon(h) {
    if (h._kit) return
    const o = h._kit = { fb: h.textContent.trim(), name: h.getAttribute('data-ico'), key: h.getAttribute('data-kit-key') || 'i' + seq++, base: parseFloat(h.getAttribute('data-size')) || 24, wi: null }
    h.classList.add('kit-ico')
    h.textContent = ''
    const fb = document.createElement('span'); fb.className = 'kit-fb'; fb.setAttribute('aria-hidden', 'true'); fb.textContent = o.fb
    h.appendChild(fb)
    o.wi = document.createElement('with-icon')
    h.appendChild(o.wi)
    if (h.dataset.label) { h.setAttribute('role', 'img'); h.setAttribute('aria-label', h.dataset.label) } else h.setAttribute('aria-hidden', 'true')
    icons.push(h)
    renderIcon(h)
    loadWeb().then(() => watchReady(h, o.wi)).catch(() => {})
  }

  function styleOf(h) { return h.dataset.fixedStyle || S.over[h._kit.key] || S.style }
  function renderIcon(h) {
    const o = h._kit, st = styleOf(h), px = Math.max(4, Math.round(o.base * S.scale))
    setAttr(o.wi, 'name', S.swaps[o.key] || o.name)
    setAttr(o.wi, 'variant', st)
    setAttr(o.wi, 'size', px)
    setAttr(o.wi, 'stroke-width', S.weight && STROKE_STYLES[st] ? S.weight : null)
    let m = null
    if (S.motion === 'hover' || S.motion === 'loop') m = S.motion
    else if (S.motion === 'auto' && S.level === 2 && h.dataset.motion) m = h.dataset.motion
    setAttr(o.wi, 'motion', m)
    if (m) loadMotion()
    h.style.minWidth = h.style.minHeight = px + 'px'
  }

  function initLive(h) {
    if (h._kit) return
    const o = h._kit = { fb: h.textContent.trim(), name: h.getAttribute('data-live'), base: parseFloat(h.getAttribute('data-size')) || 48, key: h.getAttribute('data-kit-key') || 'l' + seq++, wi: null, live: true }
    h.classList.add('kit-live')
    h.textContent = ''
    const fb = document.createElement('span'); fb.className = 'kit-fb'; fb.setAttribute('aria-hidden', 'true'); fb.textContent = o.fb
    h.appendChild(fb)
    o.wi = document.createElement('with-live-icon')
    o.wi.setAttribute('name', o.name)
    Object.keys(h.dataset).forEach(k => {
      if (/^p[A-Z]/.test(k)) o.wi.setAttribute(k.slice(1).replace(/^[A-Z]/, c => c.toLowerCase()).replace(/[A-Z]/g, c => '-' + c.toLowerCase()), h.dataset[k])
    })
    if (h.hasAttribute('data-today')) o.wi.setAttribute('today', '')
    if (h.hasAttribute('data-animate')) o.wi.setAttribute('animate', '')
    if (h.dataset.label) o.wi.setAttribute('label', h.dataset.label); else o.wi.setAttribute('label', '')
    h.appendChild(o.wi)
    lives.push(h)
    renderLive(h)
    loadLive().then(() => watchReady(h, o.wi)).catch(() => {})
  }
  function renderLive(h) {
    const o = h._kit, px = Math.max(8, Math.round(o.base * S.scale))
    setAttr(o.wi, 'variant', h.dataset.fixedStyle || S.over[o.key] || S.style)
    setAttr(o.wi, 'size', px)
    h.style.minWidth = h.style.minHeight = px + 'px'
  }

  function scan(root) {
    root = root || document
    const iconHosts = root.nodeType === 1 && root.matches && root.matches('[data-ico]') ? [root] : []
    const liveHosts = root.nodeType === 1 && root.matches && root.matches('[data-live]') ? [root] : []
    iconHosts.push(...qsa('[data-ico]', root)); liveHosts.push(...qsa('[data-live]', root))
    iconHosts.forEach(initIcon); liveHosts.forEach(initLive)
  }
  function renderAll() {
    // forget slots the page has removed (closed cart drawers, re-rendered grids)
    for (let i = icons.length - 1; i >= 0; i--) if (!icons[i].isConnected) icons.splice(i, 1)
    for (let i = lives.length - 1; i >= 0; i--) if (!lives[i].isConnected) lives.splice(i, 1)
    document.documentElement.setAttribute('data-level', S.level)
    document.documentElement.style.setProperty('--kit-scale', S.scale)
    if (S.ink) { document.documentElement.setAttribute('data-kit-ink', ''); document.documentElement.style.setProperty('--kit-ink', S.ink) }
    else { document.documentElement.removeAttribute('data-kit-ink'); document.documentElement.style.removeProperty('--kit-ink') }
    icons.forEach(renderIcon); lives.forEach(renderLive)
  }

  // ───────────────────────── change plumbing ─────────────────────────
  const listeners = []
  function changed(msg) {
    renderAll(); syncUI(); persist()
    listeners.forEach(f => { try { f(Object.assign({}, S)) } catch (e) {} })
    if (msg) announce(msg)
  }
  const setStyle = s => { if (STYLES.includes(s)) { S.style = s; changed('Style: ' + s) } }
  const stepStyle = d => { const i = STYLES.indexOf(S.style); setStyle(STYLES[(i + d + STYLES.length) % STYLES.length]) }
  function shuffleStyle() {
    const pool = STYLES.filter(s => s !== S.style)
    setStyle(pool[Math.floor(Math.random() * pool.length)])
  }
  const setLevel = l => { S.level = clamp(l, 0, 2); changed('Level: ' + LEVELS[S.level][0]) }

  // ───────────────────────── panel (shadow DOM) ─────────────────────────
  const host = document.createElement('div')
  host.id = 'withicons-kit'
  host.style.cssText = 'all:initial;position:fixed;z-index:2147483000;inset:auto 0 0 0;pointer-events:none'
  const root = host.attachShadow({ mode: 'open' })
  const I = (name, size) => `<with-icon name="${name}" variant="line" size="${size || 18}" aria-hidden="true"></with-icon>`

  root.innerHTML = `
<style>
:host{all:initial}
*{box-sizing:border-box}
.wrap{position:fixed;bottom:max(14px,env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:10px;align-items:var(--al,flex-end);pointer-events:none;font:13px/1.35 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#f4f2ff;max-width:calc(100vw - 20px)}
.wrap.left{left:14px;right:auto;--al:flex-start}.wrap.right{right:14px;left:auto;--al:flex-end}
button{font:inherit;color:inherit;border:0;background:none;cursor:pointer;padding:0}
button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #ffb3d9;outline-offset:2px}
.bar,.panel,.pick,.toast{pointer-events:auto;background:rgba(21,19,31,.93);backdrop-filter:blur(14px) saturate(1.3);-webkit-backdrop-filter:blur(14px) saturate(1.3);border:1px solid rgba(255,255,255,.14);box-shadow:0 12px 40px rgba(8,6,20,.45),0 2px 8px rgba(8,6,20,.3)}
.bar{display:flex;align-items:center;gap:2px;padding:5px;border-radius:999px;max-width:100%}
.bar button{height:34px;min-width:34px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:0 10px;transition:background .15s,transform .15s}
.bar button:hover{background:rgba(255,255,255,.12)}.bar button:active{transform:scale(.94)}
.bar .open{background:linear-gradient(135deg,#7c5cff,#ff5ea8);font-weight:650;padding:0 14px 0 11px}
.bar .open:hover{background:linear-gradient(135deg,#8d70ff,#ff74b6)}
.bar .name{min-width:84px;max-width:132px;font-weight:600;letter-spacing:.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sep{width:1px;height:20px;background:rgba(255,255,255,.16);margin:0 3px;flex:none}
.lvl{display:flex;gap:1px;background:rgba(255,255,255,.08);border-radius:999px;padding:2px}
.lvl button{height:30px;min-width:28px;padding:0 8px;font-size:12px;font-weight:650;color:rgba(244,242,255,.7)}
.lvl button[aria-pressed=true]{background:#f4f2ff;color:#17141f}
.panel{width:min(372px,calc(100vw - 20px));max-height:min(78vh,720px);border-radius:20px;display:flex;flex-direction:column;overflow:hidden}
.panel[hidden],.pick[hidden],.toast[hidden]{display:none}
.panel>header{display:flex;align-items:center;gap:10px;padding:14px 14px 10px 16px;border-bottom:1px solid rgba(255,255,255,.1)}
.panel>header b{font-size:14px}.panel>header small{color:rgba(244,242,255,.6);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.x{width:30px;height:30px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center}.x:hover{background:rgba(255,255,255,.12)}
.scroll{overflow:auto;padding:4px 16px 16px;overscroll-behavior:contain}
h4{margin:16px 0 8px;font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:rgba(244,242,255,.55);font-weight:700;display:flex;justify-content:space-between;gap:8px}
h4 em{font-style:normal;color:#ffb3d9;text-transform:none;letter-spacing:0}
.seg{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:3px;background:rgba(255,255,255,.08);padding:3px;border-radius:12px}
.seg button{padding:8px 6px;border-radius:9px;font-weight:600;font-size:12.5px;color:rgba(244,242,255,.75)}
.seg button[aria-pressed=true]{background:#f4f2ff;color:#17141f}
.hint{margin:7px 1px 0;color:rgba(244,242,255,.62);font-size:12px}
.cur{display:flex;align-items:center;gap:8px}
.cur .big{flex:1;text-align:center;padding:8px 6px;border-radius:12px;background:rgba(255,255,255,.08)}.cur .big b{display:block;font-size:15px}.cur .big span{font-size:11.5px;color:rgba(244,242,255,.62)}
.cur button{width:40px;height:44px;border-radius:12px;background:rgba(255,255,255,.08);display:inline-flex;align-items:center;justify-content:center}.cur button:hover{background:rgba(255,255,255,.16)}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.chip{display:inline-flex;align-items:center;gap:6px;padding:4px 10px 4px 5px;border-radius:999px;background:rgba(255,255,255,.08);font-size:12px;font-weight:600;border:1px solid transparent}
.chip:hover{background:rgba(255,255,255,.16)}.chip[aria-pressed=true]{border-color:#ff8fc4;background:rgba(255,94,168,.18)}
.chip .pv{width:30px;height:30px;border-radius:50%;background:#fff;display:inline-flex;align-items:center;justify-content:center;color:#241c3a;flex:none}
details{margin-top:10px}summary{cursor:pointer;padding:6px 2px;font-weight:600;color:rgba(244,242,255,.85)}summary:focus-visible{outline:2px solid #ffb3d9;border-radius:6px}
.grp{margin:8px 0 2px;font-size:11px;color:rgba(244,242,255,.5);font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.rng{display:grid;grid-template-columns:62px 1fr 44px;align-items:center;gap:8px;margin:6px 0}
.rng label{font-size:12.5px;color:rgba(244,242,255,.8)}.rng output{font-size:12px;text-align:right;color:rgba(244,242,255,.7);font-variant-numeric:tabular-nums}
input[type=range]{width:100%;accent-color:#ff5ea8}
.ink{display:flex;flex-wrap:wrap;gap:7px;align-items:center;margin-top:8px}
.sw{width:26px;height:26px;border-radius:50%;border:2px solid rgba(255,255,255,.35);position:relative}.sw[aria-pressed=true]{box-shadow:0 0 0 2px #17141f,0 0 0 4px #ff8fc4}
.sw.auto{background:conic-gradient(#f43f5e,#f59e0b,#22c55e,#0ea5e9,#8b5cf6,#f43f5e)}
input[type=color]{width:28px;height:28px;padding:0;border:0;border-radius:50%;background:none;cursor:pointer}
.btnrow{display:flex;gap:8px;flex-wrap:wrap}
.btn{padding:9px 12px;border-radius:11px;background:rgba(255,255,255,.1);font-weight:600;font-size:12.5px;display:inline-flex;gap:7px;align-items:center}.btn:hover{background:rgba(255,255,255,.18)}
.btn.on{background:linear-gradient(135deg,#7c5cff,#ff5ea8)}
.foot{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-top:18px;padding-top:12px;border-top:1px solid rgba(255,255,255,.1);font-size:12px;color:rgba(244,242,255,.6)}
.foot a,.foot button{color:#ffc2e1;text-decoration:underline;text-underline-offset:2px}
kbd{font:600 11px ui-monospace,monospace;background:rgba(255,255,255,.14);border-radius:5px;padding:1px 5px}
.pick{position:fixed;width:min(340px,calc(100vw - 20px));border-radius:18px;padding:12px;z-index:2;max-height:min(70vh,520px);display:flex;flex-direction:column;gap:10px}
.pick .hd{display:flex;align-items:center;gap:10px}.pick .hd .pv{width:44px;height:44px;border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;color:#241c3a;flex:none}
.pick .hd b{display:block;font-size:14px}.pick .hd span{font-size:11.5px;color:rgba(244,242,255,.6)}
.pick input[type=search]{width:100%;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;font:inherit}
.pick input::placeholder{color:rgba(244,242,255,.5)}
.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;overflow:auto;padding:2px;min-height:96px}
.cell{aspect-ratio:1;border-radius:11px;background:rgba(255,255,255,.08);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:9.5px;color:rgba(244,242,255,.7);overflow:hidden;padding:4px}
.cell:hover{background:rgba(255,255,255,.2)}.cell[aria-current=true]{outline:2px solid #ff8fc4}
.cell .g{width:34px;height:34px;display:flex;align-items:center;justify-content:center;background:#fff;border-radius:8px;color:#241c3a;flex:none}
.cell span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pick select{width:100%;padding:8px 10px;border-radius:10px;background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.18);font:inherit}
.pick select option{color:#111}
.toast{padding:8px 14px;border-radius:999px;font-weight:600;font-size:12.5px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
@media (max-width:560px){.bar .name{min-width:0;max-width:74px}.bar .sepx,.bar .open span{display:none}.bar .open{padding:0 11px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
<div class="wrap" id="wrap">
  <div class="toast" id="toast" hidden role="status"></div>
  <div class="pick" id="pick" hidden role="dialog" aria-label="Swap this icon"></div>
  <section class="panel" id="panel" hidden role="dialog" aria-label="Icon settings"></section>
  <div class="bar" id="bar" role="toolbar" aria-label="with icons demo controls">
    <button class="open" id="b-open" aria-expanded="false" aria-controls="panel" title="Icon settings (i)">${I('palette', 18)}<span>Icons</span></button>
    <span class="sep"></span>
    <button id="b-prev" aria-label="Previous style" title="Previous style  [">${I('chevron-left', 16)}</button>
    <button class="name" id="b-name" aria-label="Current style, open style list" title="Choose a style"></button>
    <button id="b-next" aria-label="Next style" title="Next style  ]">${I('chevron-right', 16)}</button>
    <button id="b-shuf" aria-label="Random style" title="Random style  s">${I('shuffle', 17)}</button>
    <span class="sep sepx"></span>
    <div class="lvl" id="b-lvl" role="group" aria-label="Page level"></div>
  </div>
  <div class="sr" aria-live="polite" id="live"></div>
</div>`
  const $ = id => root.getElementById(id)
  const wrap = $('wrap')
  function announce(msg) { const l = $('live'); l.textContent = ''; setTimeout(() => { l.textContent = msg }, 30) }
  let toastT = 0
  function toast(msg) {
    const t = $('toast'); if (!t) return
    t.textContent = msg; t.hidden = false
    clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true }, 2600)
  }
  function applyPos() { wrap.classList.toggle('left', pos === 'left'); wrap.classList.toggle('right', pos === 'right') }

  // level mini-control in the bar
  const SHORT = window.innerWidth < 560 ? ['B', 'U', 'F'] : ['Basic', 'Upgraded', 'Full']
  $('b-lvl').innerHTML = LEVELS.map((l, i) => `<button data-lv="${i}" aria-pressed="false" aria-label="${esc(l[0])}" title="${esc(l[0] + ': ' + l[1])}">${SHORT[i]}</button>`).join('')

  let panelBuilt = false
  function sampleIcon() {
    const s = qs('[data-sample]') || qs('[data-ico]')
    return (s && (s._kit ? (S.swaps[s._kit.key] || s._kit.name) : s.getAttribute('data-ico'))) || 'heart'
  }
  function chip(s, pv) {
    return `<button class="chip" data-style="${s}" aria-pressed="${S.style === s}" title="${esc(SAY[s])}"><span class="pv">${pv ? `<with-icon name="${esc(sampleIcon())}" variant="${s}" size="22"></with-icon>` : ''}</span>${s}</button>`
  }
  function buildPanel() {
    if (panelBuilt) return
    panelBuilt = true
    const p = $('panel')
    p.innerHTML = `
<header><b>Icon settings</b><small>${esc((document.title || '').split(/[|—–-]/)[0].trim())}</small><button class="x" id="p-close" aria-label="Close settings">${I('close', 16)}</button></header>
<div class="scroll">
  <h4>Page level <em id="p-lvname"></em></h4>
  <div class="seg" id="p-seg" role="group" aria-label="Page level">${LEVELS.map((l, i) => `<button data-lv="${i}" aria-pressed="false">${l[0]}</button>`).join('')}</div>
  <p class="hint" id="p-lvhint"></p>

  <h4>Icon style <em id="p-count"></em></h4>
  <div class="cur">
    <button id="p-prev" aria-label="Previous style">${I('chevron-left', 18)}</button>
    <div class="big"><b id="p-cur"></b><span id="p-say"></span></div>
    <button id="p-next" aria-label="Next style">${I('chevron-right', 18)}</button>
    <button id="p-shuf" aria-label="Random style" title="Random style">${I('shuffle', 18)}</button>
  </div>
  ${RECOMMEND.length ? `<div class="grp" style="margin-top:12px">Made for this page</div><div class="chips" id="p-rec">${RECOMMEND.map(s => chip(s, true)).join('')}</div>` : ''}
  <details id="p-all"><summary>All ${STYLES.length} styles</summary><div id="p-all-body"></div></details>
  <button class="btn" id="p-default" style="margin-top:8px">${I('undo', 15)} Back to the page's own style</button>

  <h4>Fine-tune</h4>
  <div class="rng"><label for="p-size">Size</label><input type="range" id="p-size" min="0.6" max="1.8" step="0.05"><output id="p-size-o"></output></div>
  <div class="rng"><label for="p-weight">Weight</label><input type="range" id="p-weight" min="1" max="3" step="0.25"><output id="p-weight-o"></output></div>
  <p class="hint" id="p-weight-hint"></p>
  <p class="hint" id="p-size-hint" hidden></p>
  <div class="grp" style="margin-top:12px">Ink colour <span style="text-transform:none;letter-spacing:0;font-weight:500">(styles that paint with currentColor)</span></div>
  <div class="ink" id="p-ink"><button class="sw auto" data-ink="" aria-label="Page colours" title="Page colours" aria-pressed="false"></button>${INKS.map(c => `<button class="sw" data-ink="${c}" style="background:${c}" aria-label="Ink ${c}" title="${c}" aria-pressed="false"></button>`).join('')}<input type="color" id="p-ink-pick" aria-label="Custom ink colour" value="#7c3aed"></div>
  <div class="grp" style="margin-top:14px">Motion</div>
  <div class="seg" id="p-motion" role="group" aria-label="Motion">${[['auto', 'Auto'], ['off', 'Off'], ['hover', 'Hover'], ['loop', 'Loop']].map(m => `<button data-mo="${m[0]}" aria-pressed="false">${m[1]}</button>`).join('')}</div>
  <p class="hint">Auto plays the page's own motion at Full level. Hover and Loop animate every icon.</p>

  <h4>Swap icons <em id="p-swaps"></em></h4>
  <div class="btnrow"><button class="btn" id="p-edit" aria-pressed="false">${I('pencil', 15)} Pick icons on the page</button><button class="btn" id="p-reset-swaps">${I('undo', 15)} Reset swaps</button></div>
  <p class="hint">Turn this on, then click any icon to replace it with another one (search all ${734}), give it its own style, or copy its code.</p>

  <div class="foot"><span><kbd>i</kbd> panel · <kbd>[</kbd><kbd>]</kbd> style · <kbd>s</kbd> random · <kbd>l</kbd> level</span></div>
  <div class="btnrow" style="margin-top:12px">
    <button class="btn" id="p-link">${I('link', 15)} Copy link to this look</button>
    <button class="btn" id="p-credits">${I('image', 15)} Photo credits</button>
    <button class="btn" id="p-side">${I('arrow-left-right', 15)} Move panel</button>
    <button class="btn" id="p-reset">${I('refresh', 15)} Reset all</button>
  </div>
</div>`
    // all styles, grouped, previews only rendered when opened
    const all = $('p-all'), body = $('p-all-body')
    all.addEventListener('toggle', () => {
      if (!all.open || body.childElementCount) return
      body.innerHTML = GROUPS.map(g => `<div class="grp">${g[0]}</div><div class="chips">${g[1].map(s => chip(s, true)).join('')}</div>`).join('')
    })
    const ro = $('p-seg'); ro.addEventListener('click', e => { const b = e.target.closest('[data-lv]'); if (b) setLevel(+b.dataset.lv) })
    p.addEventListener('click', e => { const c = e.target.closest('.chip'); if (c) setStyle(c.dataset.style) })
    $('p-close').onclick = () => openPanel(false)
    $('p-prev').onclick = () => stepStyle(-1); $('p-next').onclick = () => stepStyle(1); $('p-shuf').onclick = shuffleStyle
    $('p-default').onclick = () => setStyle(DEFAULT.style)
    $('p-size').oninput = e => { S.scale = +e.target.value; changed() }
    $('p-weight').oninput = e => { S.weight = +e.target.value; changed() }
    $('p-ink').addEventListener('click', e => { const b = e.target.closest('[data-ink]'); if (b) { S.ink = b.dataset.ink; changed() } })
    $('p-ink-pick').oninput = e => { S.ink = e.target.value; changed() }
    $('p-motion').addEventListener('click', e => { const b = e.target.closest('[data-mo]'); if (b) { S.motion = b.dataset.mo; changed('Motion: ' + S.motion) } })
    $('p-edit').onclick = () => setEditing(!editing)
    $('p-reset-swaps').onclick = () => { S.swaps = {}; S.over = {}; changed('All swaps cleared'); toast('All swaps cleared') }
    $('p-link').onclick = () => { persist(); setTimeout(() => copyText(location.href, 'Link copied'), 200) }
    $('p-credits').onclick = () => { const c = qs('#credits'); openPanel(false); if (c) c.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); else toast('No credits section on this page') }
    $('p-side').onclick = () => { pos = pos === 'right' ? 'left' : 'right'; store.set(LS_POS, pos); applyPos() }
    $('p-reset').onclick = () => { Object.assign(S, DEFAULT, { swaps: {}, over: {} }); setEditing(false); changed('Reset to the page defaults') }
    syncUI()
  }

  function syncUI() {
    $('b-name') && ($('b-name').textContent = S.style)
    root.querySelectorAll('#b-lvl button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.lv === S.level)))
    if (!panelBuilt) return
    $('p-seg').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.lv === S.level)))
    $('p-lvname').textContent = LEVELS[S.level][0]; $('p-lvhint').textContent = LEVELS[S.level][1]
    $('p-cur').textContent = S.style; $('p-say').textContent = GROUP_OF[S.style] + ' · ' + SAY[S.style]
    $('p-count').textContent = (STYLES.indexOf(S.style) + 1) + ' / ' + STYLES.length
    root.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.style === S.style)))
    $('p-size').value = S.scale; $('p-size-o').textContent = Math.round(S.scale * 100) + '%'
    const canStroke = !!STROKE_STYLES[S.style]
    $('p-weight').disabled = !canStroke; $('p-weight').value = S.weight || 1.75
    $('p-weight-o').textContent = canStroke ? (S.weight ? S.weight : 'auto') : '–'
    $('p-weight-hint').textContent = canStroke ? '' : 'Stroke weight applies to line, duo, blueprint, sketch and kawaii.'
    const small = icons.filter(h => h._kit.base * S.scale < minPx(S.style) && h._kit.base < minPx(S.style) && h.getClientRects().length).length
    const sh = $('p-size-hint'); sh.hidden = !(small && minPx(S.style) > 18)
    sh.textContent = small ? `${S.style} is drawn for ${minPx(S.style)}px and up: ${small} icons here are smaller. Try Size up.` : ''
    $('p-ink').querySelectorAll('.sw').forEach(b => b.setAttribute('aria-pressed', String((b.dataset.ink || '') === S.ink)))
    $('p-motion').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mo === S.motion)))
    const n = Object.keys(S.swaps).length + Object.keys(S.over).length
    $('p-swaps').textContent = n ? n + ' changed' : ''
    $('p-edit').setAttribute('aria-pressed', String(editing)); $('p-edit').classList.toggle('on', editing)
  }

  function openPanel(open) {
    if (open) buildPanel()
    $('panel').hidden = !open
    $('b-open').setAttribute('aria-expanded', String(open))
    if (open) { syncUI(); const f = $('p-close'); f && f.focus({ preventScroll: true }) }
    else closePick()
  }
  const panelOpen = () => !$('panel').hidden

  // ───────────────────────── picker (swap one icon) ─────────────────────────
  let editing = false, pickTarget = null, engine = null, enginePromise = null
  function setEditing(on) {
    editing = on
    document.documentElement.classList.toggle('kit-editing', on)
    if (!on) closePick()
    syncUI()
    if (on) toast('Click any icon on the page');
  }
  function getEngine() {
    if (engine) return Promise.resolve(engine)
    if (!enginePromise) enginePromise = Promise.all([import(URL_SEARCH_JS), fetch(URL_SEARCH_DATA).then(r => r.json())]).then(([m, data]) => { engine = m.create(data); return engine }).catch(e => { enginePromise = null; toast('Search could not load (offline?)'); throw e })
    return enginePromise
  }
  function closePick() { const p = $('pick'); p && (p.hidden = true); pickTarget = null }
  function placePick(el) {
    const p = $('pick'), r = el.getBoundingClientRect(), w = Math.min(340, innerWidth - 20)
    p.style.right = p.style.bottom = 'auto'
    let left = clamp(r.left + r.width / 2 - w / 2, 10, innerWidth - w - 10)
    let top = r.bottom + 12
    const h = Math.min(520, innerHeight * 0.7)
    if (top + h > innerHeight - 70) top = Math.max(10, r.top - h - 12)
    if (innerWidth < 560) { left = 10; top = Math.max(10, innerHeight - h - 80) }
    p.style.left = left + 'px'; p.style.top = top + 'px'
  }
  function openPick(h) {
    pickTarget = h; const o = h._kit
    const p = $('pick')
    const cur = S.swaps[o.key] || o.name
    p.innerHTML = `
<div class="hd"><div class="pv" id="k-pv"></div><div style="flex:1"><b>${esc(o.live ? 'Live icon: ' + o.name : cur)}</b><span>${o.live ? 'Live icons keep their value; pick a style for this one' : (cur !== o.name ? 'was ' + esc(o.name) : 'currently on the page')}</span></div><button class="x" id="k-x" aria-label="Close">${I('close', 16)}</button></div>
${o.live ? '' : `<input type="search" id="k-q" placeholder="Search icons: gift, balloon, scissors…" autocomplete="off" aria-label="Search icons"><div class="grid" id="k-grid" role="list"></div>`}
<label style="font-size:11.5px;color:rgba(244,242,255,.65)">This icon only: style
  <select id="k-style"><option value="">Same as the page (${esc(S.style)})</option>${GROUPS.map(g => `<optgroup label="${g[0]}">${g[1].map(s => `<option value="${s}"${S.over[o.key] === s ? ' selected' : ''}>${s}</option>`).join('')}</optgroup>`).join('')}</select></label>
<div class="btnrow"><button class="btn" id="k-copy">${I('copy', 15)} Copy code</button><button class="btn" id="k-reset">${I('undo', 15)} Reset icon</button></div>`
    p.hidden = false
    placePick(h)
    const pv = $('k-pv')
    pv.innerHTML = o.live ? '' : `<with-icon name="${esc(cur)}" variant="${esc(styleOf(h))}" size="30"></with-icon>`
    $('k-x').onclick = closePick
    $('k-style').onchange = e => { if (e.target.value) S.over[o.key] = e.target.value; else delete S.over[o.key]; changed(); pv.firstElementChild && pv.firstElementChild.setAttribute('variant', styleOf(h)); fillGrid($('k-q') ? $('k-q').value : '') }
    $('k-reset').onclick = () => { delete S.swaps[o.key]; delete S.over[o.key]; changed('Icon reset'); closePick() }
    $('k-copy').onclick = () => {
      const name = S.swaps[o.key] || o.name, st = styleOf(h)
      copyText(o.live ? `<with-live-icon name="${o.name}" variant="${st}" size="${Math.round(o.base * S.scale)}"></with-live-icon>` : `<with-icon name="${name}" variant="${st}" size="${Math.round(o.base * S.scale)}"></with-icon>`, 'Code copied')
    }
    if (!o.live) {
      const q = $('k-q'); let t = 0
      q.oninput = () => { clearTimeout(t); t = setTimeout(() => fillGrid(q.value), 120) }
      q.addEventListener('keydown', e => { if (e.key === 'Escape') closePick() })
      fillGrid('')
      q.focus({ preventScroll: true })
    }
  }
  function fillGrid(query) {
    const g = $('k-grid'); if (!g || !pickTarget) return
    const o = pickTarget._kit, cur = S.swaps[o.key] || o.name
    getEngine().then(en => {
      const q = (query || '').trim()
      let res = en.search(q || cur, { limit: 30 }).map(r => r.name)
      if (!q) {
        // no query yet: the icon itself, its search neighbours, then the rest of its category
        let more = []
        try { const d = en.get(cur), cat = d && d.category; if (cat) more = en.icons(cat).map(x => (typeof x === 'string' ? x : x.name)) } catch (e) {}
        res = [cur].concat(res, more).filter((n, i, arr) => n && arr.indexOf(n) === i).slice(0, 30)
      }
      if (!pickTarget) return
      g.innerHTML = res.map(n => `<button class="cell" role="listitem" data-n="${esc(n)}" aria-current="${n === cur}" title="${esc(n)}"><span class="g"><with-icon name="${esc(n)}" variant="${esc(styleOf(pickTarget))}" size="26"></with-icon></span><span>${esc(n)}</span></button>`).join('') || '<p class="hint" style="grid-column:1/-1">No match. Try another word.</p>'
    }).catch(() => {})
  }
  root.addEventListener('click', e => {
    const c = e.target.closest && e.target.closest('.cell')
    if (c && pickTarget) {
      const o = pickTarget._kit, n = c.dataset.n
      if (n === o.name) delete S.swaps[o.key]; else S.swaps[o.key] = n
      changed('Swapped to ' + n); toast(o.name + ' → ' + n)
      closePick()
    }
  })

  // click on the page while editing
  document.addEventListener('click', e => {
    if (!editing) return
    const t = e.target.closest && e.target.closest('.kit-ico,.kit-live')
    if (!t) return
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation()
    openPick(t)
  }, true)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (!$('pick').hidden) closePick(); else if (editing) setEditing(false); else if (panelOpen()) openPanel(false) }
  })
  addEventListener('scroll', () => { if (pickTarget && !$('pick').hidden) placePick(pickTarget) }, { passive: true })
  addEventListener('resize', () => { if (pickTarget && !$('pick').hidden) placePick(pickTarget) })

  function copyText(text, msg) {
    const done = () => toast(msg || 'Copied')
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => fallback())
    else fallback()
    function fallback() { const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done() } catch (e) { toast('Copy failed') } ta.remove() }
  }

  // bar wiring
  $('b-open').onclick = () => openPanel(!panelOpen())
  $('b-prev').onclick = () => stepStyle(-1); $('b-next').onclick = () => stepStyle(1); $('b-shuf').onclick = shuffleStyle
  $('b-name').onclick = () => { openPanel(true); const a = $('p-all'); if (a) { a.open = true; a.dispatchEvent(new Event('toggle')) } }
  $('b-lvl').addEventListener('click', e => { const b = e.target.closest('[data-lv]'); if (b) setLevel(+b.dataset.lv) })

  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return
    const t = e.target, tag = (t && t.tagName) || ''
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag) || (t && t.isContentEditable) || (t && t.getRootNode && t.getRootNode() === root)) return
    if (e.key === 'i') openPanel(!panelOpen())
    else if (e.key === '[') stepStyle(-1)
    else if (e.key === ']') stepStyle(1)
    else if (e.key === 's') shuffleStyle()
    else if (e.key === 'l') setLevel((S.level + 1) % 3)
  })

  // ───────────────────────── boot ─────────────────────────
  function boot() {
    loadState()
    if (!hidden) { applyPos(); document.body.appendChild(host) }
    document.documentElement.setAttribute('data-level', S.level)
    scan(document)
    renderAll(); syncUI()
    if (startOpen) openPanel(true)
    // markup added later (cart drawers, filters): upgrade it as it arrives
    const mo = new MutationObserver(list => {
      let any = false
      list.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1 && (n.matches('[data-ico],[data-live]') || n.querySelector('[data-ico],[data-live]'))) { scan(n); any = true } }))
      if (any) syncUI()
    })
    mo.observe(document.body, { childList: true, subtree: true })
    // keep a page that only has Basic fallbacks usable if the CDN is blocked
    setTimeout(() => { if (icons.length && !qs('.kit-ico[data-ready]') && !qs('.kit-live[data-ready]')) toast('Icons are still loading from the CDN…') }, 6000)
  }

  window.WithKit = {
    version: '1',
    refresh: scan,
    state: () => JSON.parse(JSON.stringify(S)),
    setStyle, setLevel,
    on: fn => { listeners.push(fn) },
    setLive(el, params) {
      el = typeof el === 'string' ? qs(el) : el
      if (!el || !el._kit || !el._kit.live) return
      Object.keys(params).forEach(k => { el.dataset['p' + k.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase())] = params[k]; el._kit.wi.setAttribute(k.replace(/[A-Z]/g, c => '-' + c.toLowerCase()), params[k]) })
    },
    toast,
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot()
})()
