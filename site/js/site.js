/* with icons — shared site runtime (every page).
   Vanilla, no build, works from file:// and S3. Data comes from plain <script> tags:
     data/meta.js          -> window.WITH = { version, total, categories, styles, icons }   (legacy: window.EGI)
     data/style-<name>.js  -> window.WITH_SVG[<name>] = { <icon>: '<inner svg markup>' }    (legacy: window.EGI_SVG)
   Public API: window.WI (alias window.EG) — see DESIGN.md › "Using the shared layer". */
(function () {
  'use strict'
  var doc = document
  var html = doc.documentElement
  var W = window
  html.classList.remove('no-js')
  html.classList.add('js')
  // wi-ready cancels the CSS failsafe in chrome.css that un-hides [data-reveal] content when this file never runs
  // (a parse error on an old engine, a blocked request). Arriving after the failsafe fired, leave it: nothing re-hides.
  if (!(W.performance && W.performance.now && W.performance.now() > 2800)) html.classList.add('wi-ready')

  /* motion: the OS setting (followed live) or the visitor's own "Pause animations" toggle (remembered).
     Either one makes `reduced` true; site CSS keys off html.reduced / html.is-still (tokens.css). */
  var mqReduced = W.matchMedia ? W.matchMedia('(prefers-reduced-motion: reduce)') : null
  var osReduced = !!(mqReduced && mqReduced.matches)
  var STILL_KEY = 'with-still'
  var userStill = false
  try { userStill = localStorage.getItem(STILL_KEY) === '1' } catch (e) { /* private mode */ }
  var reduced = osReduced || userStill
  function paintMotion() { html.classList.toggle('reduced', reduced); html.classList.toggle('is-still', userStill && !osReduced) }
  paintMotion()

  /* ───────────── theme (runs immediately) ───────────── */
  var THEME_KEY = 'with-theme-v2'
  function readTheme() { try { return localStorage.getItem(THEME_KEY) || localStorage.getItem('eg-theme') } catch (e) { return null } }
  function writeTheme(t) { try { localStorage.setItem(THEME_KEY, t) } catch (e) { /* private mode */ } }
  var saved = readTheme()
  if (saved === 'dark' || saved === 'light') html.setAttribute('data-theme', saved)
  function systemDark() { return !!(W.matchMedia && W.matchMedia('(prefers-color-scheme: dark)').matches) }
  function currentTheme() { var t = html.getAttribute('data-theme'); return t === 'dark' ? 'dark' : 'light' }

  var SVGA = ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"'
  var ICON = {
    sun: '<svg' + SVGA + '><path d="M16 12 A4 4 0 1 1 8 12 A4 4 0 1 1 16 12 Z"/><path d="M12 2.5 V4.5 M12 19.5 V21.5 M2.5 12 H4.5 M19.5 12 H21.5 M5.3 5.3 L6.7 6.7 M17.3 17.3 L18.7 18.7 M5.3 18.7 L6.7 17.3 M17.3 6.7 L18.7 5.3"/></svg>',
    moon: '<svg' + SVGA + '><path d="M20.5 14.2 A8.5 8.5 0 1 1 9.8 3.5 A7 7 0 0 0 20.5 14.2 Z"/></svg>',
    search: '<svg' + SVGA + ' stroke-width="2"><path d="M17.5 10.5 A7 7 0 1 1 3.5 10.5 A7 7 0 1 1 17.5 10.5 Z"/><path d="M15.6 15.6 L20.5 20.5"/></svg>',
    menu: '<svg' + SVGA + ' stroke-width="2"><path d="M4 8 H20 M4 16 H20"/></svg>',
    close: '<svg' + SVGA + ' stroke-width="2"><path d="M6 6 L18 18 M18 6 L6 18"/></svg>',
    arrow: '<svg class="arr"' + SVGA + ' stroke-width="2"><path d="M5 12 H19 M13 6 L19 12 L13 18"/></svg>',
    enter: '<svg' + SVGA + ' stroke-width="2"><path d="M19 5 V12 A2 2 0 0 1 17 14 H6 M10 10 L6 14 L10 18"/></svg>',
    copy: '<svg' + SVGA + ' stroke-width="2"><path d="M9 9 H18 A1.5 1.5 0 0 1 19.5 10.5 V19 A1.5 1.5 0 0 1 18 20.5 H9.5 A1.5 1.5 0 0 1 8 19 V10.5 A1.5 1.5 0 0 1 9 9 Z"/><path d="M5 15 H4.5 A1 1 0 0 1 3.5 14 V5 A1.5 1.5 0 0 1 5 3.5 H14 A1 1 0 0 1 15 4.5 V5"/></svg>',
    check: '<svg' + SVGA + ' stroke-width="2.25"><path d="M5 12.5 L10 17.5 L19 7"/></svg>',
    // Evergrow mark: a sprouting leaf pair in a ring
    evergrow: '<svg class="evergrow-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 21 V11"/><path d="M12 13 C12 9 9.5 6.5 5.5 6.5 C5.5 10.5 8 13 12 13 Z" fill="currentColor" fill-opacity=".35"/><path d="M12 11 C12 7 14.5 4 18.5 4 C18.5 8 16 11 12 11 Z" fill="currentColor"/></svg>'
  }
  var COPY_ICON = ICON.copy, CHECK_ICON = ICON.check

  function paintToggles() {
    var dark = currentTheme() === 'dark'
    var btns = doc.querySelectorAll('[data-theme-toggle]')
    for (var i = 0; i < btns.length; i++) {
      btns[i].innerHTML = dark ? ICON.sun : ICON.moon
      btns[i].setAttribute('aria-pressed', dark ? 'true' : 'false')
      btns[i].setAttribute('title', dark ? 'Switch to light mode' : 'Switch to dark mode')
    }
  }
  function toggleTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark'
    var apply = function () { html.setAttribute('data-theme', next); writeTheme(next); paintToggles(); emit('theme', next) }
    if (doc.startViewTransition && !reduced) doc.startViewTransition(apply); else apply()
  }
  if (W.matchMedia) {
    var mq = W.matchMedia('(prefers-color-scheme: dark)')
    var onSys = function () { if (!html.getAttribute('data-theme')) { paintToggles(); emit('theme', currentTheme()) } }
    if (mq.addEventListener) mq.addEventListener('change', onSys); else if (mq.addListener) mq.addListener(onSys)
  }

  /* ───────────── tiny event bus ───────────── */
  var subs = {}
  function on(ev, fn) { (subs[ev] = subs[ev] || []).push(fn); return function () { off(ev, fn) } }
  function off(ev, fn) { var l = subs[ev] || []; var i = l.indexOf(fn); if (i >= 0) l.splice(i, 1) }
  function emit(ev, arg) { var l = (subs[ev] || []).slice(); for (var i = 0; i < l.length; i++) { try { l[i](arg) } catch (e) { if (W.console) console.error(e) } } }

  /* ───────────── data + styles ───────────── */
  // the contract order (forge/CONTRACT.md): 3 everyday + 4 crafted + 5 playful + 3 studio + 5 storybook styles
  var ORDER = ['line', 'solid', 'duo', 'gloss', 'engrave', 'blueprint', 'sketch', 'glass', 'kawaii', 'sticker', 'pixel', 'retro', 'luxe', 'bauhaus', 'skeuo', 'anime', 'gothic', 'pastel', 'coquette', 'plush']
  // how the home page and pickers group them (kind stays 'universal' | 'creative' for the data contract)
  var GROUPS = [
    { id: 'everyday', title: 'Everyday', blurb: 'Clean and quiet. For interfaces, docs and slides.', styles: ['line', 'solid', 'duo'] },
    { id: 'crafted', title: 'Crafted', blurb: 'Illustrated looks with character.', styles: ['gloss', 'engrave', 'blueprint', 'sketch'] },
    { id: 'playful', title: 'Playful', blurb: 'Colourful, cute and nostalgic.', styles: ['glass', 'kawaii', 'sticker', 'pixel', 'retro'] },
    { id: 'studio', title: 'Studio', blurb: 'Art-directed and premium: layered 3D, Bauhaus geometry, real materials.', styles: ['luxe', 'bauhaus', 'skeuo'] },
    { id: 'storybook', title: 'Storybook', blurb: 'Illustrated worlds: anime, gothic cathedrals, pastels, coquette bows and plush toys. New!', styles: ['anime', 'gothic', 'pastel', 'coquette', 'plush'] }
  ]
  // plain-language copy for each style (shared by every page)
  var INFO = {
    line: { title: 'Line', kind: 'universal', color: '#2F5BFF', description: 'A clean, even outline.',
      plain: 'Clean outlines. The safe choice for websites, apps and slides.', good: 'Websites, apps, menus, toolbars',
      who: 'Product UI, navigation, toolbars and dense dashboards.', why: 'One even stroke that stays crisp from tiny to huge and takes any colour.' },
    solid: { title: 'Solid', kind: 'universal', color: '#FF5A36', description: 'Bold filled shapes.',
      plain: 'Bold, filled shapes that read from across the room.', good: 'Buttons, tab bars, tiny sizes, signs',
      who: 'Selected and active states, tab bars, tiny sizes, high contrast.', why: 'The filled twin of Line — pair them for on/off states.' },
    duo: { title: 'Duo', kind: 'universal', color: '#7B5CFF', description: 'An outline over a soft tint.',
      plain: 'An outline with a soft tint inside. Friendly and calm.', good: 'Feature lists, onboarding, landing pages',
      who: 'Feature lists, empty states, onboarding and marketing surfaces.', why: 'Adds depth without adding a second colour.' },
    gloss: { title: 'Gloss', kind: 'creative', color: '#FF4FA3', description: 'Puffy, shiny, toy-like.',
      plain: 'Puffy and shiny, like glossy stickers. Playful and fun.', good: 'Social posts, kids, games, launches',
      who: 'App launchers, hero moments and playful consumer brands.', why: 'Tactile highlights cut into one flat colour.' },
    engrave: { title: 'Engrave', kind: 'creative', color: '#C9962B', description: 'Banknote-style engraving.',
      plain: 'Fine engraved lines, like a banknote or an old book.', good: 'Invitations, menus, finance, print',
      who: 'Editorial, finance, print and premium brands.', why: 'Hatching gives light and shade in a single ink.' },
    blueprint: { title: 'Blueprint', kind: 'creative', color: '#00A3C4', description: 'A technical drawing.',
      plain: 'Technical drawings with guide lines and measurements.', good: 'Tech, engineering, docs, architecture',
      who: 'Developer tools, docs, engineering and architecture products.', why: 'Shows the construction behind each icon.' },
    sketch: { title: 'Sketch', kind: 'creative', color: '#22A861', description: 'Hand-drawn marker.',
      plain: 'Hand-drawn marker lines, like a whiteboard doodle.', good: 'Classes, workshops, notes, friendly brands',
      who: 'Whiteboards, onboarding, education and friendly products.', why: 'Warmth on purpose: hand-made, yet identical on every build.' },
    glass: { title: 'Glass', kind: 'creative', color: '#5B9DFF', description: 'Layered frosted glass.', group: 'playful',
      plain: 'Layers of frosted glass with soft light. Modern and airy.', good: 'App screens, dashboards, tech launches, dark mode',
      who: 'Modern apps, fintech, dashboards and product launches.', why: 'Depth from stacked translucent panes, no blur filters needed.' },
    kawaii: { title: 'Kawaii', kind: 'creative', color: '#FF7A9A', description: 'Chubby, cute, with a tiny face.', group: 'playful',
      plain: 'Chubby, soft and cute, with a tiny smiling face and rosy cheeks.', good: 'Journals, kids, cafés, stickers, social posts',
      who: 'Creators, planners, small shops and anything that should feel friendly.', why: 'Every object gets a personality, so a set feels like a family.' },
    sticker: { title: 'Sticker', kind: 'creative', color: '#B57CFF', description: 'Die-cut Y2K sticker.', group: 'playful',
      plain: 'Shiny die-cut stickers with a puffy white border and sparkles.', good: 'Social posts, merch, scrapbooks, Gen Z brands',
      who: 'Social media, scrapbooks, merch and bold consumer brands.', why: 'A white border makes icons pop on photos and busy backgrounds.' },
    pixel: { title: 'Pixel', kind: 'creative', color: '#4FAE0C', description: 'Crisp 16×16 pixel art.', group: 'playful',
      plain: 'Crisp pixel art, like an old video game.', good: 'Games, hackathons, retro tech, fun UIs',
      who: 'Games, developer fun, hackathons and nostalgic brands.', why: 'Snapped to a 16×16 grid, so edges stay razor sharp.' },
    retro: { title: 'Retro', kind: 'creative', color: '#F57C12', description: '70s sunset stripes.', group: 'playful',
      plain: 'Chunky 70s shapes with warm sunset stripes.', good: 'Posters, events, cafés, music, vintage brands',
      who: 'Events, hospitality, music and vintage-flavoured brands.', why: 'Warm stripes and a chunky outline: instant nostalgia.' },
    luxe: { title: 'Luxe', kind: 'creative', color: '#2B3FB8', description: 'Premium layered 3D.', group: 'studio',
      plain: 'Rich, layered 3D with gold trim and soft studio light. Premium.', good: 'Hero sections, app tiles, pricing, luxury brands',
      who: 'Premium products, fintech, pricing tiers and launch moments.', why: 'Stacked tonal layers give real depth, with no filters or gradients.' },
    bauhaus: { title: 'Bauhaus', kind: 'creative', color: '#D62718', description: 'Primary colours, pure geometry.', group: 'studio',
      plain: 'Circles, squares and triangles in red, yellow and blue. Bold modernist design.', good: 'Posters, portfolios, galleries, design studios',
      who: 'Design studios, editorial, art and culture, bold brands.', why: 'Every icon rebuilt from pure geometry, composed like a 1920s poster.' },
    skeuo: { title: 'Skeuo', kind: 'creative', color: '#5A6E86', description: 'Real materials and depth.', group: 'studio',
      plain: 'Real materials, bevels and shadows, like objects you could pick up.', good: 'App icons, dashboards, music and photo apps',
      who: 'App icons, tools, dashboards and nostalgic product UIs.', why: 'Light, material and texture make each icon feel touchable.' },
    anime: { title: 'Anime', kind: 'creative', color: '#2E9BF0', description: 'Cel-shaded anime art.', group: 'storybook', isNew: true,
      plain: 'Anime cel shading: bold ink, bright colour, hard shadows and starry highlights.', good: 'Games, streaming, fan sites, social posts',
      who: 'Games, streaming, creators, fan communities and youthful brands.', why: 'Hard cel shadows and sparkling highlights, like a frame from a favourite show.' },
    gothic: { title: 'Gothic', kind: 'creative', color: '#7A1F3D', description: 'Cathedral stone and stained glass.', group: 'storybook', isNew: true,
      plain: 'Old-world Gothic detail: pointed arches, carved stone and jewel-toned stained glass.', good: 'Fantasy games, books, music, Halloween',
      who: 'Fantasy and RPG games, publishers, bands, tattoo studios and dark-luxe brands.', why: 'Each icon carved like a cathedral window: arches, tracery and glowing glass.' },
    pastel: { title: 'Pastel', kind: 'creative', color: '#3DBFA0', description: 'Soft candy pastels.', group: 'storybook', isNew: true,
      plain: 'Soft, airy pastel colours with gentle shading. Calm and dreamy.', good: 'Wellness, journals, planners, lifestyle',
      who: 'Wellness, journaling, planners, baby and lifestyle brands.', why: 'Low-contrast candy colours that stay calm, even in a dense grid.' },
    coquette: { title: 'Coquette', kind: 'creative', color: '#E2456F', description: 'Bows, pearls and blush pink.', group: 'storybook', isNew: true,
      plain: 'Romantic and feminine: blush pink, satin bows, pearls and lace.', good: 'Beauty, fashion, weddings, boutiques',
      who: 'Beauty, fashion, weddings, boutiques and feminine brands.', why: 'Ribbons, pearls and lace turn everyday objects into keepsakes.' },
    plush: { title: 'Plush', kind: 'creative', color: '#F2AE24', description: 'Soft stuffed-toy felt.', group: 'storybook', isNew: true,
      plain: 'Soft stuffed toys in felt, with stitched seams. Made for kids.', good: 'Kids apps, learning, toys, nurseries',
      who: 'Kids apps, learning games, toy shops, nurseries and family brands.', why: 'Plump felt shapes and stitched seams you almost want to squeeze.' }
  }
  ;['line', 'solid', 'duo'].forEach(function (n) { INFO[n].group = 'everyday' })
  ;['gloss', 'engrave', 'blueprint', 'sketch'].forEach(function (n) { INFO[n].group = 'crafted' })
  // live counts: from data/meta.js once loaded, otherwise the published totals
  var FALLBACK_TOTAL = 500
  function counts() {
    var d = W.WITH || W.EGI
    var n = d && d.icons && d.icons.length ? d.icons.length : (d && d.total) || FALLBACK_TOTAL
    // styles: the contract order plus anything extra the data declares (a style is announced before every file lands)
    var st = ORDER.length
    if (d && d.styles) d.styles.forEach(function (x) { if (x && ORDER.indexOf(x.name) < 0) st++ })
    return { icons: n, styles: st, svgs: n * st }
  }
  var NUM_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five']
  function numWord(n) { return NUM_WORDS[n] || String(n) }
  /* Live counts. Put data-count="icons|styles|svgs|styles-word|Styles-word" on any element holding a static number
     (keep the correct published number as its text: it is the no-JS fallback). Painted when data/meta.js is present. */
  function paintCounts(root) {
    if (!(W.WITH || W.EGI)) return
    var c = counts()
    $$('[data-count]', root).forEach(function (el) {
      var k = el.getAttribute('data-count'), v = null
      if (k === 'icons') v = fmt(c.icons)
      else if (k === 'styles') v = String(c.styles)
      else if (k === 'svgs') v = fmt(c.svgs)
      else if (k === 'styles-word') v = numWord(c.styles)
      else if (k === 'Styles-word') { v = numWord(c.styles); v = v.charAt(0).toUpperCase() + v.slice(1) }
      if (v != null && el.textContent !== v) el.textContent = v
    })
    $$('[data-count-line]', root).forEach(function (el) { el.textContent = countLine() })
    if (so && so.input) so.input.setAttribute('placeholder', 'Search ' + fmt(c.icons) + ' icons — try “bin”, “money” or “settigns”')
  }
  function countLine() { var c = counts(); return fmt(c.icons) + ' icons, ' + c.styles + ' styles, all free.' }
  var scriptBase = (function () {
    var s = doc.currentScript && doc.currentScript.src
    if (s && /js\/site\.js(\?.*)?$/.test(s)) return s.replace(/js\/site\.js(\?.*)?$/, '')
    return ''
  })()
  function DATA() { return W.WITH || W.EGI || { version: '1.0.0', total: FALLBACK_TOTAL, categories: [], styles: [], icons: [] } }
  function svgStore() { return W.WITH_SVG || W.EGI_SVG || null }
  function svgMap(style) { var s = svgStore(); return (s && s[style]) || (W.EGI_SVG && W.EGI_SVG[style]) || (W.WITH_SVG && W.WITH_SVG[style]) || null }
  function styleMeta(name) {
    var list = DATA().styles || []
    for (var i = 0; i < list.length; i++) if (list[i].name === name) return list[i]
    return null
  }
  function styles() {
    var names = ORDER.slice()
    var list = DATA().styles || []
    for (var i = 0; i < list.length; i++) if (names.indexOf(list[i].name) < 0) names.push(list[i].name)
    return names.map(function (n) {
      var m = styleMeta(n) || {}
      var inf = INFO[n] || {}
      return {
        name: n, title: m.title || inf.title || n, kind: m.kind || inf.kind || 'creative',
        description: m.description || inf.description || '', plain: inf.plain || '', good: inf.good || '',
        who: inf.who || '', why: inf.why || '', color: 'var(--c-' + n + ')', hex: inf.color || '',
        root: m.root || null, strokeWidth: m.strokeWidth || false,
        available: !!styleMeta(n) || !!INFO[n], loaded: !!svgMap(n)
      }
    })
  }
  var iconIndex = null
  function icons() { return DATA().icons || [] }
  function byName() {
    if (!iconIndex || iconIndex.n !== icons().length) {
      var m = {}; icons().forEach(function (i) { m[i.name] = i }); iconIndex = { n: icons().length, m: m }
    }
    return iconIndex.m
  }
  function icon(name) { return byName()[name] || null }
  function hasIcon(name, style) {
    if (!style) return !!byName()[name]
    var m = svgMap(style); return !!(m && m[name] != null)
  }
  function esc(v) { return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }
  var ROOTS = {
    line: { fill: 'none', stroke: 'currentColor', 'stroke-width': 1.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
    solid: { fill: 'currentColor' }, gloss: { fill: 'currentColor' },
    duo: { fill: 'none', stroke: 'currentColor', 'stroke-width': 1.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
    engrave: { fill: 'none', stroke: 'currentColor', 'stroke-width': 1.3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
    blueprint: { fill: 'none', stroke: 'currentColor', 'stroke-width': 1.25, 'stroke-linecap': 'square', 'stroke-linejoin': 'miter' },
    sketch: { fill: 'none', stroke: 'currentColor', 'stroke-width': 1.3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
    // palette styles carry explicit fills/strokes per shape; data/meta.js supplies the real root when loaded
    glass: { fill: 'none' }, kawaii: { fill: 'currentColor' }, sticker: { fill: 'currentColor' },
    pixel: { fill: 'currentColor', 'shape-rendering': 'crispEdges' }, retro: { fill: 'currentColor' },
    luxe: { fill: 'none' }, bauhaus: { fill: 'currentColor' }, skeuo: { fill: 'none' },
    anime: { fill: 'none' }, gothic: { fill: 'none' }, pastel: { fill: 'none' }, coquette: { fill: 'none' }, plush: { fill: 'none' }
  }
  function rootAttrs(style) { var m = styleMeta(style); return (m && m.root) || ROOTS[style] || { fill: 'currentColor' } }
  function svgFrom(inner, style, size, opts) {
    opts = opts || {}
    var a = { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24' }
    var r = rootAttrs(style)
    for (var k in r) a[k] = r[k]
    if (opts.strokeWidth != null && a['stroke-width'] != null) a['stroke-width'] = opts.strokeWidth
    if (opts['class']) a['class'] = opts['class']
    var t = ''
    if (opts.title) { a.role = 'img'; t = '<title>' + esc(opts.title) + '</title>' }
    else { a['aria-hidden'] = 'true'; a.focusable = 'false' }
    var s = '<svg'
    for (var key in a) if (a[key] !== false && a[key] != null) s += ' ' + key + '="' + esc(a[key]) + '"'
    return s + '>' + t + inner + '</svg>'
  }
  function svg(name, style, size, opts) {
    style = style || 'line'
    size = size == null ? 24 : size
    var m = svgMap(style)
    var inner = m && m[name]
    if (inner == null) return ''
    return svgFrom(inner, style, size, opts)
  }
  // standalone SVG file text (for copy / download): explicit colour instead of currentColor when given
  function svgFile(name, style, opts) {
    opts = opts || {}
    var s = svg(name, style, opts.size || 24, {})
    if (!s) return ''
    s = s.replace(' aria-hidden="true" focusable="false"', '')
    if (opts.color) s = s.replace(/currentColor/g, opts.color).replace(/var\(--(?:eg|with)-(?:duo|accent),\s*([^)]+)\)/g, '$1')
    else s = s.replace(/var\(--(?:eg|with)-(?:duo|accent),\s*currentColor\)/g, 'currentColor')
    return s
  }
  function loadScript(src) {
    return new Promise(function (resolve) {
      var s = doc.createElement('script')
      s.src = src; s.async = true
      s.onload = function () { resolve(true) }
      s.onerror = function () { resolve(false) }
      doc.head.appendChild(s)
    })
  }
  var pending = {}
  function loadMeta() {
    if (W.WITH || W.EGI) return Promise.resolve(true)
    if (!pending.__meta) pending.__meta = loadScript(scriptBase + 'data/meta.js').then(function () { iconIndex = null; emit('meta'); return !!(W.WITH || W.EGI) })
    return pending.__meta
  }
  function loadStyle(name) {
    if (svgMap(name)) return Promise.resolve(true)
    if (ORDER.indexOf(name) < 0 && !styleMeta(name)) return Promise.resolve(false)
    if (pending[name]) return pending[name]
    pending[name] = loadScript(scriptBase + 'data/style-' + name + '.js').then(function () {
      var ok = !!svgMap(name); if (ok) emit('style', name); return ok
    })
    return pending[name]
  }
  function loadAllStyles() {
    return ORDER.reduce(function (p, n) { return p.then(function () { return loadStyle(n) }) }, Promise.resolve())
  }

  /* ───────────── name resolution (fallback; mirrors @withicons/core resolve()) ───────────── */
  function lev(a, b) {
    if (a === b) return 0
    var m = a.length, n = b.length
    if (!m) return n
    if (!n) return m
    var prev = [], i, j
    for (j = 0; j <= n; j++) prev[j] = j
    for (i = 1; i <= m; i++) {
      var cur = [i]
      for (j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = cur
    }
    return prev[n]
  }
  function keys(input) {
    var raw = String(input == null ? '' : input).trim()
    var k = raw.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      .replace(/[\s_./:]+/g, '-').toLowerCase().replace(/-+/g, '-').replace(/^-|-$/g, '')
    var out = [raw, raw.toLowerCase(), k]
    if (/-icon$/.test(k)) out.push(k.slice(0, -5))
    if (/^icon-/.test(k)) out.push(k.slice(5))
    var d = k.replace(/([a-z])(\d)/g, '$1-$2')
    if (d !== k) out.push(d)
    return out
  }
  var aliasCache = null
  function aliasIndex() {
    if (aliasCache && aliasCache.n === icons().length) return aliasCache.m
    var m = {}
    icons().forEach(function (i) {
      (i.aliases || []).concat(i.synonyms || []).forEach(function (a) {
        if (!Object.prototype.hasOwnProperty.call(m, a)) m[a] = []
        if (m[a].indexOf(i.name) < 0) m[a].push(i.name)
      })
    })
    aliasCache = { n: icons().length, m: m }
    return m
  }
  function nearest(input, count) {
    var q = keys(input)[2], best = {}, al = aliasIndex()
    function consider(key, name) { var d = lev(q, key); if (!(name in best) || d < best[name]) best[name] = d }
    icons().forEach(function (i) { consider(i.name, i.name) })
    for (var a in al) al[a].forEach(function (n) { consider(a, n) })
    return Object.keys(best).sort(function (x, y) { return best[x] - best[y] || (x < y ? -1 : 1) }).slice(0, count || 3)
  }
  function resolveLocal(input) {
    var ks = keys(input), idx = byName(), al = aliasIndex(), i
    if (!ks[2]) return { query: input, tier: 'empty' }
    for (i = 0; i < ks.length; i++) if (idx[ks[i]]) return { query: input, tier: 'exact', name: ks[i], key: ks[i] }
    for (i = 0; i < ks.length; i++) {
      var hit = Object.prototype.hasOwnProperty.call(al, ks[i]) ? al[ks[i]] : null
      if (!hit) continue
      if (hit.length === 1) return { query: input, tier: 'alias', name: hit[0], alias: ks[i] }
      return { query: input, tier: 'ambiguous', alias: ks[i], candidates: hit.slice(), ambiguous: hit.slice() }
    }
    var sug = nearest(input, 3)
    return { query: input, tier: 'none', unknown: true, suggestions: sug, nearest: sug }
  }
  function resolve(input) {
    var e = engineSync()
    if (e && e.resolve) {
      try {
        var r = e.resolve(input)
        if (r && r.name) return { query: input, tier: 'exact', name: r.name }
        if (r && r.ambiguous) return { query: input, tier: 'ambiguous', candidates: r.ambiguous, ambiguous: r.ambiguous }
        if (r && r.unknown) return { query: input, tier: 'none', unknown: true, suggestions: r.nearest || [], nearest: r.nearest || [] }
      } catch (err) { /* fall through */ }
    }
    return resolveLocal(input)
  }

  /* ───────────── search (shared engine, with a local fallback) ───────────── */
  var engine = null
  function engineSync() {
    if (engine) return engine
    if (W.WithSearch && W.WITH_SEARCH_INDEX) { try { engine = W.WithSearch.create(W.WITH_SEARCH_INDEX) } catch (e) { engine = null } }
    if (engine && typeof engine.warm === 'function' && !engine.__warmQueued) {
      engine.__warmQueued = true
      var en = engine
      idle(function () { try { en.warm() } catch (e) { /* optional */ } }, 1500)
    }
    return engine
  }
  var searchReady = null
  function ensureSearch() {
    if (searchReady) return searchReady
    searchReady = loadMeta().then(function () {
      if (engineSync()) return true
      return Promise.all([
        W.WithSearch ? true : loadScript(scriptBase + 'vendor/with/search.js'),
        W.WITH_SEARCH_INDEX ? true : loadScript(scriptBase + 'data/search-index.js')
      ]).then(function () { engineSync(); emit('search-ready', !!engine); return true })
    })
    return searchReady
  }
  function norm(s) { return String(s || '').toLowerCase().replace(/[_\s]+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '') }
  function scoreIcon(ic, q) {
    // returns [score, field, term, typo]
    var best = [0, '', '', false]
    function take(s, f, t, ty) { if (s > best[0]) best = [s, f, t, !!ty] }
    var n = ic.name
    if (n === q) take(100, 'name', n)
    else if (n.indexOf(q) === 0) take(84 - Math.min(10, n.length - q.length), 'name', n)
    else if (n.indexOf(q) > 0) take(64, 'name', n)
    var al = (ic.aliases || []), sy = (ic.synonyms || []), tg = (ic.tags || [])
    for (var i = 0; i < al.length; i++) {
      var a = al[i]
      if (a === q) take(92, 'alias', a); else if (a.indexOf(q) === 0) take(72, 'alias', a); else if (q.length > 2 && a.indexOf(q) > 0) take(52, 'alias', a)
    }
    for (i = 0; i < sy.length; i++) { var s = norm(sy[i]); if (s === q) take(86, 'synonym', sy[i]); else if (s.indexOf(q) === 0) take(66, 'synonym', sy[i]) }
    for (i = 0; i < tg.length; i++) { var t = tg[i]; if (t === q) take(58, 'tag', t); else if (q.length > 2 && t.indexOf(q) === 0) take(46, 'tag', t) }
    if (ic.category === q || (q.length > 2 && ic.category && ic.category.indexOf(q) === 0)) take(34, 'category', ic.category)
    if (q.length > 3 && best[0] < 40 && ic.description) {
      var d = ic.description.toLowerCase(), w = q.replace(/-/g, ' ')
      if (new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(d)) take(26, 'description', w)
    }
    if (best[0] === 0 && q.length >= 4) {
      var dn = lev(q, n); if (dn <= (q.length > 6 ? 2 : 1)) take(40 - dn * 6, 'name', n, true)
      for (i = 0; i < al.length && best[0] === 0; i++) { var da = lev(q, al[i]); if (da <= 1) take(34, 'alias', al[i], true) }
    }
    return best
  }
  function searchLocal(query, opts) {
    opts = opts || {}
    var q = norm(query)
    if (!q) return []
    var list = icons(), out = []
    var words = q.split('-').filter(function (w) { return w.length > 1 })
    for (var i = 0; i < list.length; i++) {
      var ic = list[i]
      if (opts.category && ic.category !== opts.category) continue
      var r = scoreIcon(ic, q)
      if (!r[0] && words.length > 1) {
        // every word must hit something
        var sum = 0, first = null
        for (var j = 0; j < words.length; j++) { var rr = scoreIcon(ic, words[j]); if (!rr[0]) { sum = 0; break } sum += rr[0]; if (!first || rr[0] > first[0]) first = rr }
        if (sum) r = [sum / words.length * .8, first[1], first[2], first[3]]
      }
      if (r[0] > 0) out.push({ name: ic.name, title: ic.title || ic.name, category: ic.category, score: r[0], match: { field: r[1], term: r[2], typo: r[3] } })
    }
    out.sort(function (a, b) { return b.score - a.score || (a.name < b.name ? -1 : 1) })
    return out.slice(0, opts.limit || 48)
  }
  function search(query, opts) {
    var e = engineSync()
    if (e) { try { return e.search(query, opts || {}) } catch (err) { if (W.console) console.warn(err) } }
    return searchLocal(query, opts)
  }
  function suggest(query, count) {
    var e = engineSync()
    if (e && e.suggest) { try { return e.suggest(query, count || 5) } catch (err) { /* fallback */ } }
    return nearest(query, count || 5)
  }
  // human sentence for "why did this match?"
  function whyMatched(hit, query) {
    var m = hit && hit.match
    if (!m || !m.field) return ''
    var t = '<b>' + esc(m.term || '') + '</b>'
    if (m.kind === 'phonetic') return 'Sounds like ' + t
    if (m.kind === 'similar') return 'Similar to ' + t
    if (m.typo || m.kind === 'typo') return norm(m.term) === norm(query) ? 'Also spelled ' + t : 'Did you mean ' + t + '?'
    switch (m.field) {
      case 'name': return 'Name: ' + t
      case 'alias': return 'Also called ' + t
      case 'synonym': return 'Means ' + t
      case 'tag': return 'Tagged ' + t
      case 'category': return 'In ' + t
      case 'description': return 'Used for ' + t
      default: return esc(m.field) + ': ' + t
    }
  }

  /* ───────────── clipboard, announcements, toast ───────────── */
  function copyText(text) { return copyRobust(text) }
  var live
  function announce(msg) {
    if (!live) { live = doc.createElement('div'); live.className = 'visually-hidden'; live.setAttribute('aria-live', 'polite'); doc.body.appendChild(live) }
    live.textContent = ''; setTimeout(function () { live.textContent = msg }, 30)
  }
  var toastEl, toastT
  function toast(msg, iconSvg) {
    if (!toastEl) { toastEl = doc.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); doc.body.appendChild(toastEl) }
    toastEl.innerHTML = (iconSvg || CHECK_ICON) + '<span></span>'
    toastEl.lastChild.textContent = msg
    void toastEl.offsetWidth
    toastEl.classList.add('is-on')
    clearTimeout(toastT)
    toastT = setTimeout(function () { toastEl.classList.remove('is-on') }, 1900)
    announce(msg)
  }
  function copy(text, label) {
    return copyText(text).then(function (ok) { if (ok) toast(label || 'Copied'); else manualCopy(text, 'Copy this text'); return ok })
  }
  function download(filename, text, type) {
    var blob = new Blob([text], { type: type || 'image/svg+xml' })
    var a = doc.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename
    doc.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove() }, 500)
  }
  function svgToPng(svgText, size) {
    // resolves to a PNG Blob at size×size
    return new Promise(function (resolve, reject) {
      var img = new Image()
      img.onload = function () {
        var c = doc.createElement('canvas'); c.width = c.height = size || 512
        var ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0, c.width, c.height)
        c.toBlob(function (b) { b ? resolve(b) : reject(new Error('png')) }, 'image/png')
      }
      img.onerror = reject
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText)
    })
  }
  function copyButton(label) {
    return '<button class="copy-btn" type="button" data-copy-btn>' + COPY_ICON + '<span>' + (label || 'Copy') + '</span></button>'
  }
  function wireCopy() {
    doc.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-copy-btn]')
      if (!b) return
      var text = b.getAttribute('data-copy')
      if (text == null) {
        var host = b.closest('.code, .cmd')
        var src = host && host.querySelector('pre, code')
        text = src ? src.textContent : ''
      }
      copyText(text).then(function (ok) {
        var label = b.querySelector('span'), old = label ? label.textContent : ''
        b.setAttribute('data-copied', '')
        var ic = b.querySelector('svg'); if (ic) ic.outerHTML = CHECK_ICON
        if (label) label.textContent = ok ? 'Copied' : 'Press Ctrl+C'
        announce(ok ? 'Copied to clipboard' : 'Copy failed')
        clearTimeout(b._t)
        b._t = setTimeout(function () {
          b.removeAttribute('data-copied')
          var ic2 = b.querySelector('svg'); if (ic2) ic2.outerHTML = COPY_ICON
          if (label) label.textContent = old === 'Copied' ? 'Copy' : old
        }, 1600)
      })
    })
  }

  /* ───────────── code highlighting (tiny, for our own snippets) ───────────── */
  // No regex lookbehind: Safari/iOS < 16.4 fails to PARSE it and this whole file would never run.
  // A // right after a word char or colon (https://…) is not a comment; highlight() checks that by hand.
  var HL = /(\/\/[^\n]*|^[ \t]*#[^\n]*|<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`[^`]*`)|(<\/?)([A-Za-z][\w.-]*)|\b(import|from|export|default|const|let|return|function|new|class|as|true|false|null)\b|([A-Za-z_:@[\]().-]*[A-Za-z_\]])(?==)|(\b\d+(?:\.\d+)?\b)|([{}[\]()<>/=;:,]|\/?>)/gm
  function highlight(code) {
    var out = '', last = 0, m
    HL.lastIndex = 0
    while ((m = HL.exec(code))) {
      out += esc(code.slice(last, m.index))
      if (m[1] && m[1].charAt(0) === '/' && m[1].charAt(1) === '/' && m.index > 0 && /[:\w]/.test(code.charAt(m.index - 1))) {
        out += '<span class="t-p">/</span>'; last = HL.lastIndex = m.index + 1; continue
      }
      if (m[1]) out += '<span class="t-c">' + esc(m[1]) + '</span>'
      else if (m[2]) out += '<span class="t-s">' + esc(m[2]) + '</span>'
      else if (m[3]) out += '<span class="t-p">' + esc(m[3]) + '</span><span class="t-t">' + esc(m[4]) + '</span>'
      else if (m[5]) out += '<span class="t-k">' + esc(m[5]) + '</span>'
      else if (m[6]) out += '<span class="t-a">' + esc(m[6]) + '</span>'
      else if (m[7]) out += '<span class="t-n">' + esc(m[7]) + '</span>'
      else if (m[8]) out += '<span class="t-p">' + esc(m[8]) + '</span>'
      last = HL.lastIndex
      if (m[0] === '') HL.lastIndex++
    }
    return out + esc(code.slice(last))
  }
  function codeBlock(code, lang, cls) {
    var bar = /cmdline/.test(cls || '') ? copyButton() : '<div class="code-bar"><span class="lang">' + esc(lang || 'code') + '</span>' + copyButton() + '</div>'
    return '<div class="code' + (cls ? ' ' + cls : '') + '">' + bar + '<pre><code>' + highlight(code) + '</code></pre></div>'
  }

  /* ───────────── helpers ───────────── */
  function $(sel, ctx) { return (ctx || doc).querySelector(sel) }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)) }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',') }
  function pick(prefs, want, fillFrom) {
    var have = byName(), out = []
    prefs.forEach(function (n) { if (have[n] && out.indexOf(n) < 0) out.push(n) })
    if (want && out.length < want) {
      var pool = (fillFrom || icons().map(function (i) { return i.name }))
      for (var i = 0; i < pool.length && out.length < want; i++) if (have[pool[i]] && out.indexOf(pool[i]) < 0) out.push(pool[i])
    }
    return want ? out.slice(0, want) : out
  }
  function whenVisible(el, fn, margin) {
    if (!el) return
    if (!('IntersectionObserver' in W)) { fn(); return }
    var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting })) { io.disconnect(); fn() } }, { rootMargin: margin || '200px' })
    io.observe(el)
  }
  // run fn(visible) whenever el enters/leaves the viewport AND the tab is visible: the standard "pause off-screen" helper
  function visibility(el, fn, margin) {
    var inView = false
    var report = function () { fn(inView && !doc.hidden) }
    if ('IntersectionObserver' in W) {
      var io = new IntersectionObserver(function (es) { inView = es[es.length - 1].isIntersecting; report() }, { rootMargin: margin || '0px' })
      io.observe(el)
    } else { inView = true; report() }
    doc.addEventListener('visibilitychange', report)
    return report
  }
  function idle(fn, t) { if (W.requestIdleCallback) W.requestIdleCallback(fn, { timeout: t || 2000 }); else setTimeout(fn, t ? Math.min(t, 600) : 300) }
  function rel(path) { return scriptBase + path }
  function iconUrl(name) { return scriptBase + 'icons/' + name + '.html' }

  /* ───────────── skeleton drawings (used by icon pages) ───────────── */
  function pathNodes(d) {
    var toks = String(d).match(/[MmLlHhVvCcSsQqTtAaZz]|-?(?:\d*\.\d+|\d+)(?:e[-+]?\d+)?/g) || []
    var pts = [], i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0
    function num() { return parseFloat(toks[i++]) }
    var sizes = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 }
    while (i < toks.length) {
      if (/[A-Za-z]/.test(toks[i])) cmd = toks[i++]
      var up = cmd.toUpperCase(), rl = cmd !== up
      if (up === 'Z') { x = sx; y = sy; continue }
      var n = sizes[up]
      if (!n || i + n > toks.length) break
      var v = []
      for (var k = 0; k < n; k++) v.push(num())
      if (up === 'H') x = rl ? x + v[0] : v[0]
      else if (up === 'V') y = rl ? y + v[0] : v[0]
      else { var ex = v[n - 2], ey = v[n - 1]; x = rl ? x + ex : ex; y = rl ? y + ey : ey }
      if (up === 'M') { sx = x; sy = y; cmd = rl ? 'l' : 'L' }
      pts.push([x, y])
    }
    var seen = {}
    return pts.filter(function (p) { var k = p[0].toFixed(2) + ',' + p[1].toFixed(2); if (seen[k]) return false; seen[k] = 1; return true })
  }
  /* SKELETONS:BEGIN — snapshot of forge/icons/*.json (paths+plates, fills, cutouts) */
  var SKELETONS = {"home":{"p":[["M2.5 11 L12 3.5 L21.5 11","K"],["M5 9.5 V19 A2 2 0 0 0 7 21 H17 A2 2 0 0 0 19 19 V9.5","K"],["M9.5 21 V16 A1.5 1.5 0 0 1 11 14.5 H13 A1.5 1.5 0 0 1 14.5 16 V21","A"]],"f":["M5 9.6 L12 4.1 L19 9.6 V19 A2 2 0 0 1 17 21 H7 A2 2 0 0 1 5 19 Z"],"c":["M9.5 21 V16 A1.5 1.5 0 0 1 11 14.5 H13 A1.5 1.5 0 0 1 14.5 16 V21 Z"]},"lock":{"p":[["M7.5 11 V7.5 A4.5 4.5 0 0 1 16.5 7.5 V11","A"],["M6 11 H18 A2 2 0 0 1 20 13 V19 A2 2 0 0 1 18 21 H6 A2 2 0 0 1 4 19 V13 A2 2 0 0 1 6 11 Z","K"],["M12 15 V17","A"]],"f":["M6 11 H18 A2 2 0 0 1 20 13 V19 A2 2 0 0 1 18 21 H6 A2 2 0 0 1 4 19 V13 A2 2 0 0 1 6 11 Z"],"c":["M12 15 V17"]},"search":{"p":[["M17.5 10.5 A7 7 0 1 1 3.5 10.5 A7 7 0 1 1 17.5 10.5 Z","K"],["M15.6 15.6 L20.5 20.5","A"]],"f":["M17.5 10.5 A7 7 0 1 1 3.5 10.5 A7 7 0 1 1 17.5 10.5 Z"],"c":["M7 10.5 A3.5 3.5 0 0 1 10.5 7"]},"settings":{"p":[["M18.99 10.26 L21.5 10.65 L21.5 13.35 L18.99 13.74 A7.2 7.2 0 0 1 18.17 15.71 L19.68 17.76 L17.76 19.68 L15.71 18.17 A7.2 7.2 0 0 1 13.74 18.99 L13.35 21.5 L10.65 21.5 L10.26 18.99 A7.2 7.2 0 0 1 8.29 18.17 L6.24 19.68 L4.32 17.76 L5.83 15.71 A7.2 7.2 0 0 1 5.01 13.74 L2.5 13.35 L2.5 10.65 L5.01 10.26 A7.2 7.2 0 0 1 5.83 8.29 L4.32 6.24 L6.24 4.32 L8.29 5.83 A7.2 7.2 0 0 1 10.26 5.01 L10.65 2.5 L13.35 2.5 L13.74 5.01 A7.2 7.2 0 0 1 15.71 5.83 L17.76 4.32 L19.68 6.24 L18.17 8.29 A7.2 7.2 0 0 1 18.99 10.26 Z","K"],["M15 12 A3 3 0 1 1 9 12 A3 3 0 1 1 15 12 Z","A"]],"f":["M18.99 10.26 L21.5 10.65 L21.5 13.35 L18.99 13.74 A7.2 7.2 0 0 1 18.17 15.71 L19.68 17.76 L17.76 19.68 L15.71 18.17 A7.2 7.2 0 0 1 13.74 18.99 L13.35 21.5 L10.65 21.5 L10.26 18.99 A7.2 7.2 0 0 1 8.29 18.17 L6.24 19.68 L4.32 17.76 L5.83 15.71 A7.2 7.2 0 0 1 5.01 13.74 L2.5 13.35 L2.5 10.65 L5.01 10.26 A7.2 7.2 0 0 1 5.83 8.29 L4.32 6.24 L6.24 4.32 L8.29 5.83 A7.2 7.2 0 0 1 10.26 5.01 L10.65 2.5 L13.35 2.5 L13.74 5.01 A7.2 7.2 0 0 1 15.71 5.83 L17.76 4.32 L19.68 6.24 L18.17 8.29 A7.2 7.2 0 0 1 18.99 10.26 Z M15 12 A3 3 0 1 1 9 12 A3 3 0 1 1 15 12 Z"],"c":[]},"heart":{"p":[["M12 20.5 C12 20.5 3 15.2 3 8.9 C3 6.2 5.1 4 7.8 4 C9.6 4 11.1 5 12 6.5 C12.9 5 14.4 4 16.2 4 C18.9 4 21 6.2 21 8.9 C21 15.2 12 20.5 12 20.5 Z","K"]],"f":["M12 20.5 C12 20.5 3 15.2 3 8.9 C3 6.2 5.1 4 7.8 4 C9.6 4 11.1 5 12 6.5 C12.9 5 14.4 4 16.2 4 C18.9 4 21 6.2 21 8.9 C21 15.2 12 20.5 12 20.5 Z"],"c":[]},"user":{"p":[["M16 7.5 A4 4 0 1 1 8 7.5 A4 4 0 1 1 16 7.5 Z","K"],["M4 21 V19.5 A4.5 4.5 0 0 1 8.5 15 H15.5 A4.5 4.5 0 0 1 20 19.5 V21","K"]],"f":["M16 7.5 A4 4 0 1 1 8 7.5 A4 4 0 1 1 16 7.5 Z","M4 21 V19.5 A4.5 4.5 0 0 1 8.5 15 H15.5 A4.5 4.5 0 0 1 20 19.5 V21 Z"],"c":[]},"bell":{"p":[["M6 16.5 V11 A6 6 0 0 1 18 11 V16.5 L19.5 18.5 H4.5 Z","K"],["M9.5 18.5 A2.5 2.5 0 0 0 14.5 18.5","A"]],"f":["M6 16.5 V11 A6 6 0 0 1 18 11 V16.5 L19.5 18.5 H4.5 Z"],"c":[]},"bell-off":{"p":[["M9.96 5.36 A6 6 0 0 1 18 11 V13.4","K"],["M6.01 10.61 A6 6 0 0 0 6 11 V16.5 L4.5 18.5 H13.9","K"],["M9.5 18.5 A2.5 2.5 0 0 0 14.44 19.04","A"],["M3 3 L21 21","S"]],"f":["M9.1 5.75 A6 6 0 0 1 18 11 V14.64 Z","M6.18 9.54 A6 6 0 0 0 6 11 V16.5 L4.5 18.5 H15.14 Z"],"c":[]},"user-plus":{"p":[["M12.25 7.5 A3.75 3.75 0 1 1 4.75 7.5 A3.75 3.75 0 1 1 12.25 7.5 Z","K"],["M2 21 V19.5 A4.5 4.5 0 0 1 6.5 15 H10.5 A4.5 4.5 0 0 1 15 19.5 V21","K"],["M19 7.5 V12.5","S"],["M16.5 10 H21.5","S"]],"f":["M12.25 7.5 A3.75 3.75 0 1 1 4.75 7.5 A3.75 3.75 0 1 1 12.25 7.5 Z","M2 21 V19.5 A4.5 4.5 0 0 1 6.5 15 H10.5 A4.5 4.5 0 0 1 15 19.5 V21 Z"],"c":[]},"eye-off":{"p":[["M10.14 5.19 C10.74 5.06 11.36 5 12 5 C16 5 19.5 7.5 21.5 12 C21.02 13.07 20.46 14.03 19.82 14.87","K"],["M13.86 18.81 C13.26 18.94 12.64 19 12 19 C8 19 4.5 16.5 2.5 12 C2.98 10.93 3.54 9.97 4.18 9.13","K"],["M14.12 14.12 A3 3 0 0 1 9.88 14.12 A3 3 0 0 1 9.88 9.88","A"],["M3 3 L21 21","S"]],"f":["M9.29 5.4 C10.16 5.14 11.07 5 12 5 C16 5 19.5 7.5 21.5 12 C20.91 13.33 20.18 14.49 19.35 15.46 Z","M14.71 18.6 C13.84 18.86 12.93 19 12 19 C8 19 4.5 16.5 2.5 12 C3.09 10.67 3.82 9.51 4.65 8.54 Z"],"c":["M16.25 12 A4.25 4.25 0 1 1 7.75 12 A4.25 4.25 0 1 1 16.25 12 Z M14.75 12 A2.75 2.75 0 1 1 9.25 12 A2.75 2.75 0 1 1 14.75 12 Z"]},"cloud-upload":{"p":[["M4.89 14.97 A4.5 4.5 0 0 1 6.2 6.6 A6.2 6.2 0 0 1 18.1 7.1 A4.25 4.25 0 0 1 19.25 15","K"],["M12 21.5 V10 L8.5 13.5","S"],["M12 10 L15.5 13.5","S"]],"f":["M4.89 14.97 A4.5 4.5 0 0 1 6.2 6.6 A6.2 6.2 0 0 1 18.1 7.1 A4.25 4.25 0 0 1 19.25 15 Z"],"c":[]},"file-text":{"p":[["M14 2.5 H7 A2 2 0 0 0 5 4.5 V19.5 A2 2 0 0 0 7 21.5 H17 A2 2 0 0 0 19 19.5 V7.5 Z","K"],["M14 2.5 V6 A1.5 1.5 0 0 0 15.5 7.5 H19","A"],["M8.5 9 H11","A"],["M8.5 13 H15.5","A"],["M8.5 17 H15.5","A"]],"f":["M14 2.5 H7 A2 2 0 0 0 5 4.5 V19.5 A2 2 0 0 0 7 21.5 H17 A2 2 0 0 0 19 19.5 V7.5 Z"],"c":["M14 2.5 V6 A1.5 1.5 0 0 0 15.5 7.5 H19","M8.5 9 H11","M8.5 13 H15.5","M8.5 17 H15.5"]},"calendar":{"p":[["M5 5 H19 A2 2 0 0 1 21 7 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V7 A2 2 0 0 1 5 5 Z","K"],["M3 10 H21","K"],["M8 3 V7","A"],["M16 3 V7","A"]],"f":["M5 5 H19 A2 2 0 0 1 21 7 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V7 A2 2 0 0 1 5 5 Z"],"c":["M5 10 H19"]},"shield-check":{"p":[["M12 21.5 C7.5 19.8 4.5 16.5 4.5 12 V5.5 L12 2.5 L19.5 5.5 V12 C19.5 16.5 16.5 19.8 12 21.5 Z","K"],["M8.5 12 L11 14.5 L15.5 9.5","A"]],"f":["M12 21.5 C7.5 19.8 4.5 16.5 4.5 12 V5.5 L12 2.5 L19.5 5.5 V12 C19.5 16.5 16.5 19.8 12 21.5 Z"],"c":["M8.5 12 L11 14.5 L15.5 9.5"]},"camera":{"p":[["M4 6.5 H7.5 L9 4 H15 L16.5 6.5 H20 A2 2 0 0 1 22 8.5 V18.5 A2 2 0 0 1 20 20.5 H4 A2 2 0 0 1 2 18.5 V8.5 A2 2 0 0 1 4 6.5 Z","K"],["M15 13.5 A3 3 0 1 1 9 13.5 A3 3 0 1 1 15 13.5 Z","A"]],"f":["M4 6.5 H7.5 L9 4 H15 L16.5 6.5 H20 A2 2 0 0 1 22 8.5 V18.5 A2 2 0 0 1 20 20.5 H4 A2 2 0 0 1 2 18.5 V8.5 A2 2 0 0 1 4 6.5 Z"],"c":["M15.75 13.5 A3.75 3.75 0 1 1 8.25 13.5 A3.75 3.75 0 1 1 15.75 13.5 Z M14.25 13.5 A2.25 2.25 0 1 1 9.75 13.5 A2.25 2.25 0 1 1 14.25 13.5 Z"]},"mail":{"p":[["M4.5 4.5 H19.5 A2 2 0 0 1 21.5 6.5 V17.5 A2 2 0 0 1 19.5 19.5 H4.5 A2 2 0 0 1 2.5 17.5 V6.5 A2 2 0 0 1 4.5 4.5 Z","K"],["M2.5 7 L12 13.5 L21.5 7","A"]],"f":["M4.5 4.5 H19.5 A2 2 0 0 1 21.5 6.5 V17.5 A2 2 0 0 1 19.5 19.5 H4.5 A2 2 0 0 1 2.5 17.5 V6.5 A2 2 0 0 1 4.5 4.5 Z"],"c":["M5 8.71 L12 13.5 L19 8.71"]},"folder":{"p":[["M3 7 A2 2 0 0 1 5 5 H9 L11 7 H19 A2 2 0 0 1 21 9 V18 A2 2 0 0 1 19 20 H5 A2 2 0 0 1 3 18 Z","K"]],"f":["M3 7 A2 2 0 0 1 5 5 H9 L11 7 H19 A2 2 0 0 1 21 9 V18 A2 2 0 0 1 19 20 H5 A2 2 0 0 1 3 18 Z"],"c":[]},"map-pin":{"p":[["M19.5 10 C19.5 14.5 15.5 18.5 12 21.5 C8.5 18.5 4.5 14.5 4.5 10 A7.5 7.5 0 0 1 19.5 10 Z","K"],["M15 10 A3 3 0 1 1 9 10 A3 3 0 1 1 15 10 Z","A"]],"f":["M19.5 10 C19.5 14.5 15.5 18.5 12 21.5 C8.5 18.5 4.5 14.5 4.5 10 A7.5 7.5 0 0 1 19.5 10 Z"],"c":["M15 10 A3 3 0 1 1 9 10 A3 3 0 1 1 15 10 Z"]},"bookmark":{"p":[["M7.5 3 H16.5 A2 2 0 0 1 18.5 5 V20.5 L12 16.5 L5.5 20.5 V5 A2 2 0 0 1 7.5 3 Z","K"]],"f":["M7.5 3 H16.5 A2 2 0 0 1 18.5 5 V20.5 L12 16.5 L5.5 20.5 V5 A2 2 0 0 1 7.5 3 Z"],"c":[]},"clipboard":{"p":[["M8.5 4.5 H6.5 A2 2 0 0 0 4.5 6.5 V19.5 A2 2 0 0 0 6.5 21.5 H17.5 A2 2 0 0 0 19.5 19.5 V6.5 A2 2 0 0 0 17.5 4.5 H15.5","K"],["M9.5 2.5 H14.5 A1 1 0 0 1 15.5 3.5 V5.5 A1 1 0 0 1 14.5 6.5 H9.5 A1 1 0 0 1 8.5 5.5 V3.5 A1 1 0 0 1 9.5 2.5 Z","A"]],"f":["M6.5 4.5 H8.5 V3.5 A1 1 0 0 1 9.5 2.5 H14.5 A1 1 0 0 1 15.5 3.5 V4.5 H17.5 A2 2 0 0 1 19.5 6.5 V19.5 A2 2 0 0 1 17.5 21.5 H6.5 A2 2 0 0 1 4.5 19.5 V6.5 A2 2 0 0 1 6.5 4.5 Z"],"c":["M6.75 4 V6.5 A1.75 1.75 0 0 0 8.5 8.25 H15.5 A1.75 1.75 0 0 0 17.25 6.5 V4"]},"sliders":{"p":[["M3 6 H21","K"],["M3 12 H21","K"],["M3 18 H21","K"],["M16 3.5 V8.5","A"],["M8 9.5 V14.5","A"],["M13 15.5 V20.5","A"]],"f":[],"c":[]},"check-circle":{"p":[["M21.5 12 A9.5 9.5 0 1 1 2.5 12 A9.5 9.5 0 1 1 21.5 12 Z","K"],["M8 12.5 L10.75 15.25 L16 9.5","A"]],"f":["M21.5 12 A9.5 9.5 0 1 1 2.5 12 A9.5 9.5 0 1 1 21.5 12 Z"],"c":["M8 12.5 L10.75 15.25 L16 9.5"]},"trash":{"p":[["M3 7 H21","K"],["M5 7 L6 19 A2 2 0 0 0 8 21 H16 A2 2 0 0 0 18 19 L19 7","K"],["M9 7 V4.5 A1.5 1.5 0 0 1 10.5 3 H13.5 A1.5 1.5 0 0 1 15 4.5 V7","A"],["M10 11 V17","A"],["M14 11 V17","A"]],"f":["M5 7 L6 19 A2 2 0 0 0 8 21 H16 A2 2 0 0 0 18 19 L19 7 Z"],"c":["M10 11 V17","M14 11 V17"]},"star":{"p":[["M12 2.95 L14.79 9.11 L21.51 9.86 L16.52 14.42 L17.88 21.04 L12 17.7 L6.12 21.04 L7.48 14.42 L2.49 9.86 L9.21 9.11 Z","K"]],"f":["M12 2.95 L14.79 9.11 L21.51 9.86 L16.52 14.42 L17.88 21.04 L12 17.7 L6.12 21.04 L7.48 14.42 L2.49 9.86 L9.21 9.11 Z"],"c":[]},"sun":{"p":[["M16.5 12 A4.5 4.5 0 1 1 7.5 12 A4.5 4.5 0 1 1 16.5 12 Z","K"],["M12 4 L12 2 M17.66 6.34 L19.07 4.93 M20 12 L22 12 M17.66 17.66 L19.07 19.07 M12 20 L12 22 M6.34 17.66 L4.93 19.07 M4 12 L2 12 M6.34 6.34 L4.93 4.93","A"]],"f":["M16.5 12 A4.5 4.5 0 1 1 7.5 12 A4.5 4.5 0 1 1 16.5 12 Z"],"c":[]},"rocket":{"p":[["M6.5 11.5 L2.25 11.25 Q5.75 7.25 9 8 L11 6 A11.01 11.01 0 0 1 21 3 A11.01 11.01 0 0 1 18 13 L16 15 Q16.75 18.25 12.75 21.75 L12.5 17.5 Z","K"],["M16.25 9 A1.25 1.25 0 1 1 13.75 9 A1.25 1.25 0 1 1 16.25 9 Z","A"],["M7.75 12.75 C5.25 14.25 4.4 16.9 4 20 C7.1 19.6 9.75 18.75 11.25 16.25","A"]],"f":["M6.5 11.5 L2.25 11.25 Q5.75 7.25 9 8 L11 6 A11.01 11.01 0 0 1 21 3 A11.01 11.01 0 0 1 18 13 L16 15 Q16.75 18.25 12.75 21.75 L12.5 17.5 Z","M7.75 12.75 C5.25 14.25 4.4 16.9 4 20 C7.1 19.6 9.75 18.75 11.25 16.25 Z"],"c":["M16.75 9 A1.75 1.75 0 1 1 13.25 9 A1.75 1.75 0 1 1 16.75 9 Z"]}}
  /* SKELETONS:END */
  function skeleton(name) {
    if (SKELETONS[name]) return SKELETONS[name]
    var m = svgMap('line'), inner = m && m[name]
    if (!inner) return null
    var ds = [], re = /\sd="([^"]+)"/g, r
    while ((r = re.exec(inner))) ds.push([r[1], 'K'])
    return { p: ds, f: [], c: [], derived: true }
  }
  function gridLines(from, to) {
    var s = ''
    for (var g = from; g <= to; g++) s += '<path class="g-minor" d="M' + g + ' ' + from + ' V' + to + ' M' + from + ' ' + g + ' H' + to + '" vector-effect="non-scaling-stroke"/>'
    return s
  }
  function skeletonSvg(name, o) {
    o = o || {}
    var sk = skeleton(name)
    if (!sk) return ''
    var only = o.plate || null
    var s = '<svg class="skel" viewBox="' + (o.pad ? '-1 -1 26 26' : '0 0 24 24') + '" role="img" aria-label="Skeleton of ' + esc(name) + '">'
    if (o.grid !== false) {
      s += '<g stroke-width="1">' + gridLines(0, 24) + '</g>'
      s += '<path class="g-major" d="M12 0 V24 M0 12 H24" stroke-width="1" vector-effect="non-scaling-stroke"/>'
      s += '<path class="g-key" d="M22 12 A10 10 0 1 1 2 12 A10 10 0 1 1 22 12 Z M5 3 H19 A2 2 0 0 1 21 5 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 Z" stroke-width="1" vector-effect="non-scaling-stroke"/>'
      s += '<rect class="g-live" x="2" y="2" width="20" height="20" stroke-width="1" vector-effect="non-scaling-stroke"/>'
    }
    if (!only && o.fills !== false) sk.f.forEach(function (d) { s += '<path class="fillr" fill-rule="evenodd" d="' + esc(d) + '"/>' })
    if (!only && o.cutouts !== false) sk.c.forEach(function (d) { s += '<path class="cut" vector-effect="non-scaling-stroke" d="' + esc(d) + '"/>' })
    sk.p.forEach(function (p, i) {
      var dim = only && p[1] !== only
      var d = esc(p[0])
      if (dim) { s += '<path class="cl" style="stroke:var(--rule-strong)" d="' + d + '"/>'; return }
      s += '<path class="p ' + p[1] + '" d="' + d + '"/>'
      s += '<path class="cl ' + p[1] + (o.draw ? ' draw' : '') + '" style="--i:' + i + '"' + (o.draw ? ' pathLength="1"' : '') + ' d="' + d + '"/>'
    })
    if (o.nodes !== false) {
      sk.p.forEach(function (p) {
        if (only && p[1] !== only) return
        pathNodes(p[0]).forEach(function (pt) { s += '<circle class="node ' + p[1] + '" cx="' + pt[0] + '" cy="' + pt[1] + '" r="' + (o.nodeR || 0.42) + '"/>' })
      })
    }
    return s + '</svg>'
  }

  /* ═════════════════════ LOGO MORPH ═════════════════════
     Cycles real icons through every style. line/duo/blueprint/sketch draw themselves on, solid/engrave
     fill up, gloss gets a highlight sweep; glass clears from frost, kawaii bounces in, a sticker is slapped on,
     pixel resolves in steps and retro rises like a sunset; luxe lifts into the light, bauhaus snaps into place, skeuo is pressed in;
     anime zooms in on an impact frame, gothic rises from the dark, pastel melts in, coquette swings on its ribbon, plush lands with a squish. Each frame tints the tile and the hand-written "with" in the style colour.
     Frames live in brand/logo-frames.js (≈27 KB, loaded when idle). Pauses off-screen, in hidden tabs, and for
     reduced motion (then it only changes on hover). */
  var FIRST_FRAME = ['heart', 'line', '<path pathLength="1" d="M12 20.5 C12 20.5 3 15.2 3 8.9 C3 6.2 5.1 4 7.8 4 C9.6 4 11.1 5 12 6.5 C12.9 5 14.4 4 16.2 4 C18.9 4 21 6.2 21 8.9 C21 15.2 12 20.5 12 20.5 Z"/>']
  var framesP = null
  function loadFrames() {
    if (W.WITH_LOGO_FRAMES) return Promise.resolve(W.WITH_LOGO_FRAMES)
    if (!framesP) framesP = loadScript(scriptBase + 'brand/logo-frames.js').then(function () { return W.WITH_LOGO_FRAMES || null })
    return framesP
  }
  function frameSvg(f, roots, cls) {
    var r = (roots && roots[f[1]]) || ROOTS[f[1]] || {}
    var a = ''
    for (var k in r) a += ' ' + k + '="' + r[k] + '"'
    return '<svg class="lm-frame ' + (cls || '') + '" viewBox="0 0 24 24"' + a + ' aria-hidden="true" focusable="false">' + f[2] + '</svg>'
  }
  var DRAW = { line: 1, duo: 1, blueprint: 1, sketch: 1 }
  var FILL = { solid: 1, engrave: 1 }
  var ENTER = { glass: 'lm-frost', kawaii: 'lm-bounce', sticker: 'lm-slap', pixel: 'lm-pixel', retro: 'lm-rise', luxe: 'lm-lift', bauhaus: 'lm-snap', skeuo: 'lm-press',
    anime: 'lm-impact', gothic: 'lm-vesper', pastel: 'lm-melt', coquette: 'lm-swing', plush: 'lm-squish' }
  var morphs = []
  function initLogoMorph() {
    $$('[data-logo-morph]').forEach(function (el, idx) {
      var logo = el.closest('.logo') || el.parentNode
      var st = { el: el, logo: logo, i: idx * 5, frames: [FIRST_FRAME], roots: null, timer: 0, running: false, hover: false, cur: null }
      morphs.push(st)
      el.innerHTML = '<span class="lm-shine"></span>'
      show(st, FIRST_FRAME, true)
      logo.addEventListener('pointerenter', function () { st.hover = true; if (reduced) step(st); else if (st.running) { clearTimeout(st.timer); st.timer = setTimeout(function () { tick(st) }, 260) } })
      logo.addEventListener('pointerleave', function () { st.hover = false })
      visibility(el, function (v) { st.visible = v; v ? start(st) : stop(st) })
    })
    if (morphs.length) idle(function () {
      loadFrames().then(function (data) {
        if (!data) return
        morphs.forEach(function (st) { st.frames = data.frames; st.roots = data.roots; st.i = st.i % data.frames.length; if (st.visible) start(st) })
      })
    }, 2500)
  }
  function hold(st) {
    if (st.hover) return 1100
    var y = W.scrollY || 0
    return y > (W.innerHeight || 800) * 0.8 ? 4200 : 2600 // slower while the visitor is reading
  }
  function start(st) { if (reduced || st.running || st.frames.length < 2) return; st.running = true; st.timer = setTimeout(function () { tick(st) }, hold(st)) }
  function stop(st) { st.running = false; clearTimeout(st.timer) }
  function tick(st) {
    if (!st.running) return
    step(st)
    st.timer = setTimeout(function () { tick(st) }, hold(st))
  }
  function step(st) {
    if (st.frames.length < 2) return
    st.i = (st.i + 1) % st.frames.length
    show(st, st.frames[st.i])
  }
  function show(st, f, first) {
    var el = st.el, prev = st.cur
    var sameIcon = prev && prev[0] === f[0]
    var cls = reduced ? '' : (DRAW[f[1]] ? 'lm-draw' : FILL[f[1]] ? 'lm-fill' : ENTER[f[1]] || '')
    if (first) cls = reduced ? '' : 'lm-draw'
    var tmp = doc.createElement('div')
    tmp.innerHTML = frameSvg(f, st.roots, cls + (first || reduced ? '' : ' is-pre'))
    var node = tmp.firstChild
    var old = $$('.lm-frame', el)
    el.insertBefore(node, el.firstChild)
    // tint tile + "with"
    ORDER.forEach(function (s) { el.classList.remove('s-' + s) })
    el.classList.add('s-' + f[1])
    if (st.logo && st.logo.style) st.logo.style.setProperty('--logo-with', 'var(--c-' + f[1] + '-text)')
    el.setAttribute('data-style', f[1])
    old.forEach(function (o) {
      o.classList.add(sameIcon ? 'is-fade' : 'is-out')
      if (sameIcon) o.style.opacity = '0'
      setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o) }, reduced ? 0 : 750)
    })
    if (!first && !reduced) requestAnimationFrame(function () { requestAnimationFrame(function () { node.classList.remove('is-pre') }) })
    if ((f[1] === 'gloss' || f[1] === 'sticker' || f[1] === 'glass') && !reduced) { el.classList.remove('is-shine'); void el.offsetWidth; el.classList.add('is-shine') }
    st.cur = f
  }

  /* ═════════════════════ CHROME ═════════════════════ */
  var SECTION_OF = [
    [/(^|\/)icons\.html$|(^|\/)icons\/|(^|\/)categories\/|(^|\/)styles\//, 'icons.html'],
    [/(^|\/)guides\//, 'guides/index.html'],
    [/(^|\/)developers\.html$/, 'developers.html'],
    [/(^|\/)ai\.html$/, 'ai.html'],
    [/(^|\/)(about|license|faq)\.html$/, 'about.html']
  ]
  function sitePath(href) {
    // path relative to the site root (scriptBase)
    try {
      var u = new URL(href, location.href).href.split('#')[0].split('?')[0]
      if (scriptBase && u.indexOf(scriptBase) === 0) return u.slice(scriptBase.length)
      return new URL(u).pathname.replace(/^\//, '')
    } catch (e) { return '' }
  }
  function markCurrent(links) {
    var here = sitePath(location.href) || 'index.html'
    if (/\/$/.test(here) || here === '') here += 'index.html'
    var target = here
    for (var i = 0; i < SECTION_OF.length; i++) if (SECTION_OF[i][0].test(here)) { target = SECTION_OF[i][1]; break }
    var hit = null
    links.forEach(function (a) {
      var p = sitePath(a.getAttribute('href'))
      if (p === here) { a.setAttribute('aria-current', 'page'); hit = a }
      else if (p === target && !hit) { a.setAttribute('aria-current', 'true'); hit = a }
    })
    return hit
  }
  // nav links and the mobile menu cycle through the signature colours (old and new styles interleaved)
  var NAV_STYLE = ['line', 'anime', 'luxe', 'kawaii', 'pastel', 'solid', 'pixel', 'gothic', 'duo', 'retro', 'coquette', 'gloss', 'bauhaus', 'glass', 'plush', 'sketch', 'sticker', 'skeuo', 'blueprint', 'engrave']
  function initHeader() {
    var header = $('[data-header]') || $('.site-header')
    if (!header) return
    var nav = $('.site-nav', header)
    // search trigger dressing: icon + label + kbd hint
    $$('[data-search-open]').forEach(function (b) {
      if (b.getAttribute('data-dressed')) return
      b.setAttribute('data-dressed', '1')
      var k = b.querySelector('kbd')
      if (b.classList.contains('search-trigger')) {
        b.innerHTML = ICON.search + '<span class="st-label">Search icons</span>' + (k ? k.outerHTML : '<kbd>/</kbd>')
      }
      b.setAttribute('aria-keyshortcuts', '/ Control+K Meta+K')
    })
    // CTA arrow
    var cta = $('.cta', header)
    if (cta && !cta.querySelector('svg')) cta.innerHTML = '<span class="cta-label">' + esc(cta.textContent) + '</span>'
    // nav: current link + sliding indicator
    if (nav) {
      // pages written before Live icons existed get the link too (the generators write it statically)
      var first = $('a', nav)
      if (first && !$('a[href$="live.html"]', nav)) {
        var live = doc.createElement('a'); live.className = 'nav-live'
        live.href = first.getAttribute('href').replace(/icons.html.*$/, 'live.html'); live.innerHTML = 'Live icons<span class="nav-new">New</span>'
        if (/live.html$/.test(sitePath(live.getAttribute('href'))) && first.nextSibling) nav.insertBefore(live, first.nextSibling)
      }
      var links = $$('a', nav)
      links.forEach(function (a, i) { a.style.setProperty('--style', 'var(--c-' + NAV_STYLE[i % NAV_STYLE.length] + ')') })
      var cur = markCurrent(links)
      if (cur) header.style.setProperty('--page-accent', 'var(--c-' + NAV_STYLE[links.indexOf(cur) % NAV_STYLE.length] + ')')
      var blob = doc.createElement('span'); blob.className = 'nav-blob'; blob.setAttribute('aria-hidden', 'true'); nav.insertBefore(blob, nav.firstChild)
      var moveTo = function (a, instant) {
        if (!a) { blob.classList.remove('is-on'); return }
        if (instant) blob.style.transition = 'none'
        blob.style.width = a.offsetWidth + 'px'
        blob.style.transform = 'translateX(' + a.offsetLeft + 'px)'
        blob.classList.add('is-on')
        if (instant) { void blob.offsetWidth; blob.style.transition = '' }
      }
      var rest = function () { moveTo(cur, false) }
      links.forEach(function (a) { a.addEventListener('pointerenter', function () { moveTo(a, !blob.classList.contains('is-on')) }); a.addEventListener('focus', function () { moveTo(a) }) })
      nav.addEventListener('pointerleave', rest)
      nav.addEventListener('focusout', function (e) { if (!nav.contains(e.relatedTarget)) rest() })
      var place = function () { moveTo(cur, true) }
      if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(place); else place()
      W.addEventListener('resize', function () { moveTo(cur, true) }, { passive: true })
      buildMobileMenu(header, links)
    }
    // condense on scroll
    var ticking = false, last = null
    var onScroll = function () {
      if (ticking) return
      ticking = true
      requestAnimationFrame(function () {
        ticking = false
        var c = (W.scrollY || 0) > 24
        if (c !== last) { last = c; if (c) header.setAttribute('data-condensed', ''); else header.removeAttribute('data-condensed') }
      })
    }
    W.addEventListener('scroll', onScroll, { passive: true }); onScroll()
    magnetic(cta)
  }
  function magnetic(el) {
    if (!el || reduced || !(W.matchMedia && W.matchMedia('(hover: hover) and (pointer: fine)').matches)) return
    var raf = 0, tx = 0, ty = 0
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect()
      tx = (e.clientX - (r.left + r.width / 2)) * 0.28
      ty = (e.clientY - (r.top + r.height / 2)) * 0.4
      var ang = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI
      if (!raf) raf = requestAnimationFrame(function () { raf = 0; el.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px)'; el.style.setProperty('--cta-a', ang.toFixed(0) + 'deg') })
    })
    el.addEventListener('pointerleave', function () { cancelAnimationFrame(raf); raf = 0; el.style.transform = '' })
  }
  W.WI_magnetic = magnetic
  // a nav link's label without its NEW tag
  function navText(a) { var c = a.cloneNode(true); $$('.nav-new', c).forEach(function (t) { t.parentNode.removeChild(t) }); return c.textContent }
  function buildMobileMenu(header, links) {
    var actions = $('.site-actions', header)
    if (!actions || $('.nav-toggle', header)) return
    var btn = doc.createElement('button')
    btn.className = 'nav-toggle'; btn.type = 'button'; btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'mobile-menu'); btn.setAttribute('aria-label', 'Open menu')
    btn.innerHTML = ICON.menu
    actions.appendChild(btn)
    var sheet = doc.createElement('div')
    sheet.className = 'mobile-menu'; sheet.id = 'mobile-menu'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); sheet.setAttribute('aria-label', 'Menu')
    var h = '<nav aria-label="Mobile">'
    links.forEach(function (a, i) {
      var s = NAV_STYLE[i % NAV_STYLE.length]
      h += '<a class="mm-link s-' + s + '" style="--i:' + i + '" href="' + esc(a.getAttribute('href')) + '"' + (a.getAttribute('aria-current') ? ' aria-current="' + a.getAttribute('aria-current') + '"' : '') + '><span>' + esc(navText(a)) + (a.querySelector('.nav-new') ? '<span class="nav-new">New</span>' : '') + '</span><span class="mm-dot" aria-hidden="true"></span></a>'
    })
    h += '</nav><p class="mm-hand" data-count-line>' + countLine() + '</p><div class="mm-foot"><a class="btn btn-sun" href="' + esc(rel('icons.html')) + '">Browse icons ' + ICON.arrow + '</a>' + stillButton('on-light') + '<span>Powered by Evergrow</span></div>'
    sheet.innerHTML = h
    doc.body.appendChild(sheet)
    var open = false
    var set = function (v) {
      open = v
      sheet.classList.toggle('is-open', v); html.classList.toggle('menu-open', v)
      btn.setAttribute('aria-expanded', v ? 'true' : 'false'); btn.setAttribute('aria-label', v ? 'Close menu' : 'Open menu')
      btn.innerHTML = v ? ICON.close : ICON.menu
      if (v) { var f = sheet.querySelector('a'); if (f) setTimeout(function () { f.focus({ preventScroll: true }) }, 60) }
    }
    btn.addEventListener('click', function () { set(!open) })
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) set(false) })
    doc.addEventListener('keydown', function (e) { if (open && e.key === 'Escape') { set(false); btn.focus() } })
    W.addEventListener('resize', function () { if (open && W.innerWidth > 900) set(false) }, { passive: true })
  }
  /* ───────────── "Pause animations" (WCAG 2.2.2) ─────────────
     One toggle in every footer and in the mobile menu stops the auto-playing motion site-wide (header logo morph,
     home hero carousel, lanes, typewriter, decorative loops) and is remembered across pages. */
  function motionChanged() {
    var was = reduced
    reduced = osReduced || userStill
    paintMotion()
    paintStillToggles()
    if (was === reduced) return
    if (reduced) $$('[data-reveal]').forEach(function (e) { e.classList.add('is-in') })
    morphs.forEach(function (st) { if (reduced) stop(st); else if (st.visible) start(st) })
    emit('motion', reduced)
  }
  function setStill(v) {
    userStill = !!v
    try { if (userStill) localStorage.setItem(STILL_KEY, '1'); else localStorage.removeItem(STILL_KEY) } catch (e) { /* private mode */ }
    motionChanged()
    announce(userStill ? 'Animations paused' : 'Animations on')
  }
  var STILL_ICON = {
    pause: '<svg' + SVGA + ' stroke-width="2.25"><path d="M9 6 V18 M15 6 V18"/></svg>',
    play: '<svg' + SVGA + ' stroke-width="2"><path d="M8 5.5 L18.5 12 L8 18.5 Z"/></svg>'
  }
  function paintStillToggles() {
    $$('[data-still-toggle]').forEach(function (b) {
      // with the OS asking for reduced motion there is nothing left to pause
      b.hidden = osReduced && !userStill
      b.setAttribute('aria-pressed', userStill ? 'true' : 'false')
      var ic = b.querySelector('.still-ic'); if (ic) ic.innerHTML = userStill ? STILL_ICON.play : STILL_ICON.pause
    })
  }
  function stillButton(extra) {
    return '<button type="button" class="still-toggle' + (extra ? ' ' + extra : '') + '" data-still-toggle aria-pressed="false">' +
      '<span class="still-ic" aria-hidden="true"></span><span>Pause animations</span></button>'
  }
  function initStillToggle() {
    $$('.foot-base').forEach(function (fb) {
      if ($('[data-still-toggle]', fb)) return
      var tmp = doc.createElement('div'); tmp.innerHTML = stillButton()
      fb.insertBefore(tmp.firstChild, $('.evergrow-link', fb) || null)
    })
    doc.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-still-toggle]')
      if (b) setStill(!userStill)
    })
    if (mqReduced) {
      var onMq = function (e) { osReduced = !!e.matches; motionChanged() }
      if (mqReduced.addEventListener) mqReduced.addEventListener('change', onMq); else if (mqReduced.addListener) mqReduced.addListener(onMq)
    }
    paintStillToggles()
  }

  function initReveal() {
    var els = $$('[data-reveal]')
    if (!els.length) return
    if (reduced || !('IntersectionObserver' in W)) { els.forEach(function (e) { e.classList.add('is-in') }); return }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) } })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 })
    els.forEach(function (e) { io.observe(e) })
    // Failsafes: hidden/background tabs, prerenderers and screenshot bots throttle IntersectionObserver,
    // which would leave content invisible. Never let a reveal hide content for real.
    function revealInView() {
      var vh = W.innerHeight || doc.documentElement.clientHeight
      els.forEach(function (e) {
        if (e.classList.contains('is-in')) return
        var r = e.getBoundingClientRect()
        if (r.top < vh && r.bottom > 0) { e.classList.add('is-in'); io.unobserve(e) }
      })
    }
    if (doc.visibilityState !== 'visible') els.forEach(function (e) { e.classList.add('is-in') })
    setTimeout(revealInView, 1600)
    W.addEventListener('scroll', function () { clearTimeout(revealInView.t); revealInView.t = setTimeout(revealInView, 250) }, { passive: true })
  }
  function initFooter() {
    $$('[data-footer-strip]').forEach(function (strip) {
      var spans = $$('span[data-icon]', strip)
      if (!spans.length) return
      whenVisible(strip, function () {
        loadMeta().then(function () {
          spans.forEach(function (sp) {
            var s = sp.getAttribute('data-style') || 'line'
            loadStyle(s).then(function () { sp.innerHTML = svg(sp.getAttribute('data-icon'), s, 24) })
          })
        })
      }, '400px')
    })
    $$('[data-year]').forEach(function (y) { y.textContent = String(new Date().getFullYear()) })
  }

  /* ═════════════════════ SEARCH OVERLAY ═════════════════════
     Layout contract (chrome.css): bar / tools / banner / foot never shrink; .so-main is the only flexible row and
     .so-body inside it is the only scroller. Results are a grid of homogeneous tiles (or a list); the selected
     result is shown in .so-preview (a side pane on wide panels, a bottom action bar on narrow ones).
     Click selects, click again / Enter / double-click opens; arrows move in 2D. */
  var SO_STYLE_KEY = 'with-search-style', SO_VIEW_KEY = 'with-search-view'
  var so = null
  var POPULAR = ['home', 'search', 'heart', 'star', 'user', 'settings', 'mail', 'calendar', 'trash', 'download', 'check-circle', 'arrow-right',
    'bell', 'lock', 'camera', 'folder', 'map-pin', 'bookmark', 'rocket', 'sun', 'shield-check', 'file-text', 'cloud-upload', 'clipboard']
  var GRID_ICON = '<svg' + SVGA + ' stroke-width="2"><path d="M4 4 H10 V10 H4 Z M14 4 H20 V10 H14 Z M4 14 H10 V20 H4 Z M14 14 H20 V20 H14 Z"/></svg>'
  var LIST_ICON = '<svg' + SVGA + ' stroke-width="2"><path d="M4 6 H6 M10 6 H20 M4 12 H6 M10 12 H20 M4 18 H6 M10 18 H20"/></svg>'
  var IMG_ICON = '<svg' + SVGA + ' stroke-width="2"><path d="M5 4 H19 A1.5 1.5 0 0 1 20.5 5.5 V18.5 A1.5 1.5 0 0 1 19 20 H5 A1.5 1.5 0 0 1 3.5 18.5 V5.5 A1.5 1.5 0 0 1 5 4 Z"/><path d="M3.5 16 L8.5 11 L13 15.5 L15.5 13 L20.5 18"/><path d="M16.5 8.5 A1 1 0 1 1 14.5 8.5 A1 1 0 1 1 16.5 8.5 Z"/></svg>'
  var CODE_ICON = '<svg' + SVGA + ' stroke-width="2"><path d="M8.5 7 L3.5 12 L8.5 17 M15.5 7 L20.5 12 L15.5 17"/></svg>'
  function sized(svgStr, px) { return svgStr.replace('<svg', '<svg width="' + px + '" height="' + px + '"') }

  function buildOverlay() {
    if (so) return so
    var el = doc.createElement('div')
    el.className = 'search-overlay'; el.id = 'search-overlay'
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Search icons')
    var chips = ORDER.map(function (s) { return '<button type="button" class="chip s-' + s + '" data-so-style="' + s + '" aria-pressed="false">' + INFO[s].title + '</button>' }).join('')
    el.innerHTML = '<div class="so-backdrop" data-so-close></div>' +
      '<div class="so-panel">' +
      '<div class="so-bar">' + ICON.search +
      '<input class="so-input" type="search" placeholder="Search ' + fmt(counts().icons) + ' icons — try “bin”, “money” or “settigns”" autocomplete="off" autocapitalize="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="so-list" aria-autocomplete="list" aria-label="Search icons">' +
      '<div class="so-ask"></div><button class="so-close" type="button" data-so-close aria-label="Close search">Esc</button><span class="so-progress"></span></div>' +
      '<div class="so-tools"><div class="so-styles" role="group" aria-label="Show results in style">' + chips + '</div>' +
      '<div class="so-view" role="group" aria-label="Result layout">' +
      '<button type="button" data-so-view="grid" aria-pressed="true" aria-label="Grid view" title="Grid view">' + GRID_ICON + '</button>' +
      '<button type="button" data-so-view="list" aria-pressed="false" aria-label="List view" title="List view">' + LIST_ICON + '</button></div></div>' +
      '<div class="so-banner" hidden></div>' +
      '<div class="so-main">' +
      '<div class="so-body"><div class="so-label" id="so-label">Popular</div>' +
      '<div class="so-list is-grid" id="so-list" role="listbox" aria-labelledby="so-label"></div><div class="so-empty" hidden></div></div>' +
      '<aside class="so-preview" aria-label="Selected icon" hidden></aside>' +
      '</div>' +
      '<div class="so-foot"><span class="so-keys"><kbd>←</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>→</kbd> move</span><span class="so-keys"><kbd>↵</kbd> open</span>' +
      '<span class="so-keys"><kbd>⇧</kbd><kbd>↵</kbd> SVG</span><span class="so-keys"><kbd>Tab</kbd> style</span>' +
      '<a class="so-all" href="' + esc(rel('icons.html')) + '"><span class="so-all-long">Browse all</span><span class="so-all-short">All</span> ' + sized(ICON.arrow.replace(' class="arr"', ''), 14) + '</a></div></div>'
    doc.body.appendChild(el)
    var st = 'line', view = 'grid'
    try { st = localStorage.getItem(SO_STYLE_KEY) || 'line'; view = localStorage.getItem(SO_VIEW_KEY) || 'grid' } catch (e) { /* noop */ }
    if (ORDER.indexOf(st) < 0) st = 'line'
    if (view !== 'list') view = 'grid'
    so = { el: el, panel: $('.so-panel', el), input: $('.so-input', el), list: $('.so-list', el), label: $('.so-label', el), empty: $('.so-empty', el), prog: $('.so-progress', el),
      body: $('.so-body', el), all: $('.so-all', el), banner: $('.so-banner', el), preview: $('.so-preview', el), ask: $('.so-ask', el),
      style: st, view: view, sel: 0, hits: [], open: false, lastFocus: null, nav: false, lastQ: '' }
    askRender(so.ask, { mode: 'button', bind: so.input, label: 'Ask AI', intent: 'find' })

    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-so-close]')) { closeSearch(); return }
      var c = e.target.closest('[data-so-style]')
      if (c) { setSoStyle(c.getAttribute('data-so-style')); return }
      var v = e.target.closest('[data-so-view]')
      if (v) { setSoView(v.getAttribute('data-so-view')); so.input.focus({ preventScroll: true }); return }
      var sug = e.target.closest('[data-so-suggest]')
      if (sug) { so.input.value = sug.getAttribute('data-so-suggest'); runSearch(); so.input.focus(); return }
      var act = e.target.closest('[data-so-act]')
      if (act) { e.preventDefault(); doAction(act.getAttribute('data-so-act'), act.getAttribute('data-name')); return }
      var hit = e.target.closest('.so-hit')
      if (hit) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button) return // let the browser open a new tab/window
        e.preventDefault()
        var i = +hit.getAttribute('data-i')
        if (i === so.sel && (hit.getAttribute('data-armed') || e.detail > 1)) { location.href = iconUrl(so.hits[i].name); return }
        select(i, true); so.nav = true
        hit.setAttribute('data-armed', '1')
        so.input.focus({ preventScroll: true })
      }
    })
    el.addEventListener('dblclick', function (e) { var hit = e.target.closest('.so-hit'); if (hit) location.href = iconUrl(so.hits[+hit.getAttribute('data-i')].name) })
    so.input.addEventListener('input', function () { so.nav = false; runSearch() })
    so.input.addEventListener('keydown', function (e) {
      var k = e.key, grid = so.view === 'grid', cols = grid ? columns() : 1
      if (k === 'ArrowDown') { e.preventDefault(); so.nav = true; select(so.sel + cols, false, true) }
      else if (k === 'ArrowUp') { e.preventDefault(); so.nav = true; select(so.sel - cols, false, true) }
      else if ((k === 'ArrowRight' || k === 'ArrowLeft') && grid && so.hits.length && (so.nav || !so.input.value)) { e.preventDefault(); so.nav = true; select(so.sel + (k === 'ArrowRight' ? 1 : -1)) }
      else if ((k === 'PageDown' || k === 'PageUp') && so.hits.length) { e.preventDefault(); so.nav = true; select(so.sel + (k === 'PageDown' ? 1 : -1) * cols * 3, false, true) }
      else if (k === 'Enter') {
        var h = so.hits[so.sel]
        if (!h) return
        e.preventDefault()
        if (e.shiftKey) doAction('svg', h.name)
        else if (e.altKey) doAction('png', h.name)
        else location.href = iconUrl(h.name)
      } else if (k === 'Tab' && !e.shiftKey && so.hits.length) {
        // Tab cycles the preview style — a quick way to see the results in every style
        e.preventDefault(); setSoStyle(ORDER[(ORDER.indexOf(so.style) + 1) % ORDER.length], true)
      }
    })
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closeSearch() }
      if (e.key === 'Tab' && e.target !== so.input) {
        // focus trap
        var f = $$('button, input, a[href]', so.el).filter(function (x) { return x.offsetParent !== null && !x.closest('.so-list') })
        if (!f.length) return
        var first = f[0], lastF = f[f.length - 1]
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); lastF.focus() } else if (!e.shiftKey && doc.activeElement === lastF) { e.preventDefault(); first.focus() }
      }
    })
    on('style', function (s) { if (so.open && s === so.style) render(so.hits, so.lastQ, true) })
    on('search-ready', function () { if (so.open && so.input.value) runSearch() })
    paintSoStyle(); paintSoView()
    return so
  }
  function columns() {
    var kids = so.list.children
    if (kids.length < 2) return 1
    var top = kids[0].offsetTop, n = 1
    while (n < kids.length && kids[n].offsetTop === top) n++
    return n
  }
  function paintSoStyle() {
    $$('[data-so-style]', so.el).forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-so-style') === so.style ? 'true' : 'false') })
    so.panel.className = 'so-panel s-' + so.style
  }
  function paintSoView() {
    $$('[data-so-view]', so.el).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-so-view') === so.view ? 'true' : 'false') })
    so.list.className = 'so-list ' + (so.view === 'list' ? 'is-list' : 'is-grid')
  }
  function setSoStyle(s, fromKey) {
    so.style = s; paintSoStyle()
    try { localStorage.setItem(SO_STYLE_KEY, s) } catch (e) { /* noop */ }
    var chip = $('[data-so-style="' + s + '"]', so.el)
    if (chip && chip.scrollIntoView) chip.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    if (fromKey) announce(INFO[s].title + ' style')
    if (!fromKey) so.input.focus({ preventScroll: true })
    render(so.hits, so.lastQ, true)
    loadStyle(s).then(function () { render(so.hits, so.lastQ, true) })
  }
  function setSoView(v) {
    so.view = v; paintSoView()
    try { localStorage.setItem(SO_VIEW_KEY, v) } catch (e) { /* noop */ }
    render(so.hits, so.lastQ, true)
  }
  function doAction(act, name) {
    if (!name) return
    var style = so ? so.style : 'line'
    if (act === 'open') { location.href = iconUrl(name); return }
    if (act === 'svg') { copySvg(name, style); return }
    if (act === 'png') copyPng(name, style)
  }
  function copySvg(name, style) {
    return loadStyle(style).then(function () {
      var s = svgFile(name, style)
      if (s) return copy(s, 'Copied ' + name + ' · ' + INFO[style].title + ' SVG')
    })
  }
  function pngFile(name, style, px) {
    return loadStyle(style).then(function () {
      var s = svgFile(name, style, { color: INFO[style].color, size: px })
      if (!s) throw new Error('missing')
      return svgToPng(s, px)
    })
  }
  function downloadBlob(filename, blob) {
    var a = doc.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename
    doc.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove() }, 800)
  }
  // Copy a PNG to the clipboard (ClipboardItem gets the promise synchronously, so Safari keeps the user gesture);
  // where image clipboard is unavailable (file://, older browsers) the PNG is downloaded instead.
  function copyPng(name, style, px) {
    px = px || 512
    var blobP = pngFile(name, style, px)
    var fileName = name + '-' + style + '-' + px + '.png'
    var fallback = function () { return blobP.then(function (b) { downloadBlob(fileName, b); toast('PNG downloaded — ' + fileName) }, function () { toast('Could not make a PNG') }) }
    if (navigator.clipboard && navigator.clipboard.write && W.ClipboardItem && W.isSecureContext) {
      var item
      try { item = new W.ClipboardItem({ 'image/png': blobP }) } catch (e) { item = null }
      if (item) return navigator.clipboard.write([item]).then(function () { toast('Copied ' + name + ' · ' + INFO[style].title + ' PNG (' + px + 'px)') }, fallback)
    }
    return fallback()
  }
  function select(i, noScroll, clamp) {
    if (!so.hits.length) return
    var n = so.hits.length
    if (clamp) {
      // vertical moves stop at the edges instead of wrapping onto a different column
      if (i < 0) i = so.sel > 0 && so.sel < (so.view === 'grid' ? columns() : 1) ? 0 : (so.sel === 0 ? n - 1 : 0)
      else if (i >= n) i = so.sel < n - 1 ? n - 1 : 0
    }
    so.sel = (i + n) % n
    var kids = so.list.children
    for (var k = 0; k < kids.length; k++) {
      kids[k].setAttribute('aria-selected', k === so.sel ? 'true' : 'false')
      if (k !== so.sel) kids[k].removeAttribute('data-armed')
    }
    var cur = kids[so.sel]
    if (cur) {
      so.input.setAttribute('aria-activedescendant', cur.id)
      if (!noScroll) cur.scrollIntoView({ block: 'nearest' })
    }
    paintPreview()
  }
  function whyFor(hit, q) {
    var cat = (icon(hit.name) || {}).category || hit.category || ''
    var m = hit.match || {}
    if (!q || (m.field === 'name' && m.term === hit.name && !m.typo && m.kind !== 'similar' && m.kind !== 'phonetic')) return q ? 'Name match' + (cat ? ' · ' + esc(cat) : '') : esc(cat)
    return whyMatched(hit, q)
  }
  function paintPreview() {
    var p = so.preview, hit = so.hits[so.sel]
    if (!hit) { p.hidden = true; return }
    p.hidden = false
    var style = so.style, name = hit.name, meta = icon(name) || {}
    var ic = svg(name, style, 24) || svg(name, 'line', 24)
    var why = so.lastQ ? whyFor(hit, so.lastQ) : ''
    if (/^Name match/.test(why)) why = ''
    p.innerHTML = '<div class="sp-ic s-' + style + '">' + ic + '</div>' +
      '<div class="sp-txt"><p class="sp-name">' + esc(name) + '</p>' +
      '<p class="sp-meta"><span class="style-dot s-' + style + '"></span>' + INFO[style].title + (meta.category ? ' · ' + esc(meta.category) : '') + '</p>' +
      (why ? '<p class="sp-why">' + why + '</p>' : '') + '</div>' +
      '<div class="sp-acts">' +
      '<a class="sp-btn sp-open" href="' + esc(iconUrl(name)) + '" data-so-act="open" data-name="' + esc(name) + '"><span>Open page</span>' + sized(ICON.arrow.replace(' class="arr"', ''), 15) + '</a>' +
      '<button type="button" class="sp-btn" data-so-act="svg" data-name="' + esc(name) + '" aria-label="Copy ' + esc(name) + ' as SVG">' + CODE_ICON + '<span>Copy SVG</span></button>' +
      '<button type="button" class="sp-btn" data-so-act="png" data-name="' + esc(name) + '" aria-label="Copy ' + esc(name) + ' as PNG">' + IMG_ICON + '<span>Copy PNG</span></button>' +
      '</div>'
  }
  function render(hits, q, keepSel) {
    so.hits = hits || []
    so.lastQ = q || ''
    var style = so.style, list = so.view === 'list', h = ''
    var size = list ? 26 : 36
    so.hits.forEach(function (hit, i) {
      var ic = svg(hit.name, style, size) || svg(hit.name, 'line', size)
      h += '<a class="so-hit" id="so-opt-' + i + '" role="option" tabindex="-1" data-i="' + i + '" style="--i:' + Math.min(i, 18) + '" aria-selected="false" href="' + esc(iconUrl(hit.name)) + '"' +
        (list ? '' : ' title="' + esc(hit.name) + '"') + '>' +
        '<span class="so-ic">' + ic + '</span><span class="so-txt"><span class="so-name">' + esc(hit.name) + '</span>' +
        (list ? '<span class="so-why">' + whyFor(hit, so.lastQ) + '</span>' : '') + '</span></a>'
    })
    var scroller = so.body, keepTop = scroller.scrollTop
    so.list.innerHTML = h
    so.list.classList.toggle('no-anim', !!keepSel)
    scroller.scrollTop = keepSel ? keepTop : 0
    if (!keepSel || so.sel >= so.hits.length) so.sel = 0
    if (so.hits.length) select(so.sel, true)
    else { so.preview.hidden = true; so.input.removeAttribute('aria-activedescendant') }
  }
  // corrected query, if the engine (or the hits) say the visitor probably meant something else
  function correction(q, hits) {
    var e = engineSync(), c = null
    if (e && typeof e.didYouMean === 'function') {
      try {
        var r = e.didYouMean(q)
        c = typeof r === 'string' ? r : r && (r.query || r.corrected || r.term || r.name || (r[0] && (r[0].name || r[0]))) || null
      } catch (err) { c = null }
    }
    if (!c && hits && hits.length) {
      var top = hits[0].match || {}
      if (!(e && typeof e.didYouMean === 'function') && (top.kind === 'similar' || top.kind === 'phonetic' || top.kind === 'typo' || (top.typo && top.field === 'name'))) c = top.term
    }
    if (c && norm(c) === norm(q)) c = null
    return c
  }
  function setBanner(html) {
    if (!html) { so.banner.hidden = true; so.banner.innerHTML = ''; return }
    so.banner.hidden = false; so.banner.innerHTML = html
  }
  function runSearch() {
    var q = so.input.value.trim()
    ensureSearch().then(function () {
      if (q !== so.input.value.trim()) return // a newer keystroke owns the UI
      loadStyle(so.style)
      if (!q) {
        so.label.textContent = 'Popular icons'
        so.empty.hidden = true
        setBanner('')
        so.all.setAttribute('href', rel('icons.html'))
        render(pick(POPULAR, 24).map(function (n) { var ic = icon(n) || {}; return { name: n, category: ic.category } }), '')
        return
      }
      var hits = search(q, { limit: 300 })
      var fixed = correction(q, hits)
      if (!hits.length && fixed) hits = search(fixed, { limit: 300 })
      so.prog.classList.remove('is-run'); void so.prog.offsetWidth; so.prog.classList.add('is-run')
      so.all.setAttribute('href', rel('icons.html') + '?q=' + encodeURIComponent(q))
      setBanner(fixed && hits.length ? '<span class="sb-ic" aria-hidden="true">✦</span><span>Showing results for <b>' + esc(fixed) + '</b> <span class="sb-typed">— you typed “' + esc(q) + '”</span></span>' : '')
      if (hits.length) {
        so.empty.hidden = true
        so.label.innerHTML = '<b>' + fmt(hits.length) + '</b>' + (hits.length === 1 ? ' icon' : ' icons') + ' for “' + esc(fixed || q) + '”'
        render(hits, fixed || q)
      } else {
        render([], q)
        so.label.textContent = 'No match for “' + q + '”'
        var sug = suggest(q, 5) || []
        sug = sug.map(function (s) { return typeof s === 'string' ? s : s.name })
        so.empty.hidden = false
        so.empty.innerHTML = '<span class="hand">hmm, nothing yet…</span><p>' + (sug.length ? 'Did you mean ' + sug.map(function (s) { return '<button type="button" data-so-suggest="' + esc(s) + '">' + esc(s) + '</button>' }).join('') + '?' : 'Try a simpler word, like “home” or “money”.') + '</p>' +
          '<p class="so-empty-ai">Or describe what it’s for — an AI assistant will pick the right icon for you:</p><div class="so-empty-ask"></div>'
        askRender($('.so-empty-ask', so.empty), { query: q, intent: 'find' })
      }
    })
  }
  function openSearch(initial) {
    buildOverlay()
    if (so.open) { so.input.focus(); return }
    so.open = true
    so.lastFocus = doc.activeElement
    so.el.classList.add('is-open')
    html.classList.add('search-open')
    if (typeof initial === 'string') so.input.value = initial
    so.nav = false
    so.input.focus()
    so.input.select()
    runSearch()
    emit('search-open')
  }
  function closeSearch() {
    if (!so || !so.open) return
    so.open = false
    so.el.classList.remove('is-open')
    html.classList.remove('search-open')
    if (so.lastFocus && so.lastFocus.focus) so.lastFocus.focus({ preventScroll: true })
    emit('search-close')
  }
  function initSearch() {
    doc.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-search-open]')
      if (t) { e.preventDefault(); openSearch(t.getAttribute('data-search-query') || undefined) }
    })
    doc.addEventListener('keydown', function (e) {
      var tag = (e.target && e.target.tagName) || ''
      var typing = /INPUT|TEXTAREA|SELECT/.test(tag) || (e.target && e.target.isContentEditable)
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); so && so.open ? closeSearch() : openSearch(); return }
      if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (doc.body.getAttribute('data-search') === 'local') return // page has its own search field that wants "/"
        e.preventDefault(); openSearch()
      }
    })
    // warm the engine when the visitor shows intent
    $$('[data-search-open]').forEach(function (b) { b.addEventListener('pointerenter', function () { ensureSearch() }, { once: true }) })
  }

  /* ═════════════════════ ASK AI ═════════════════════
     <div data-ask-ai [data-icon data-style data-query data-compact data-ask-bind="#input"]></div>
     Each assistant is a real link (new tab, middle-click works, no popup blocker). On click we copy the prompt and
     refresh the link's ?q= so the assistant opens pre-filled; Gemini has no prefill URL, so it opens and we toast. */
  var AI_SITE = 'https://withicons.com'
  var gemSeq = 0
  function geminiSvg() {
    var id = 'wi-gem-' + (++gemSeq)
    var d = 'M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z'
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' + d + '" fill="#3186FF"/>' +
      '<path d="' + d + '" fill="url(#' + id + 'a)"/><path d="' + d + '" fill="url(#' + id + 'b)"/><path d="' + d + '" fill="url(#' + id + 'c)"/><defs>' +
      '<linearGradient gradientUnits="userSpaceOnUse" id="' + id + 'a" x1="7" x2="11" y1="15.5" y2="12"><stop stop-color="#08B962"/><stop offset="1" stop-color="#08B962" stop-opacity="0"/></linearGradient>' +
      '<linearGradient gradientUnits="userSpaceOnUse" id="' + id + 'b" x1="8" x2="11.5" y1="5.5" y2="11"><stop stop-color="#F94543"/><stop offset="1" stop-color="#F94543" stop-opacity="0"/></linearGradient>' +
      '<linearGradient gradientUnits="userSpaceOnUse" id="' + id + 'c" x1="3.5" x2="17.5" y1="13.5" y2="12"><stop stop-color="#FABC12"/><stop offset=".46" stop-color="#FABC12" stop-opacity="0"/></linearGradient></defs></svg>'
  }
  var AI = [
    { id: 'claude', name: 'Claude', url: function (p) { return 'https://claude.ai/new?q=' + encodeURIComponent(p) },
      svg: function () { return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#D97757" d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z"/></svg>' } },
    { id: 'chatgpt', name: 'ChatGPT', url: function (p) { return 'https://chatgpt.com/?q=' + encodeURIComponent(p) },
      svg: function () { return '<svg viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true" focusable="false"><path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z"/></svg>' } },
    { id: 'gemini', name: 'Gemini', paste: true, url: function (p) { return 'https://gemini.google.com/app' + (p ? '?q=' + encodeURIComponent(p) : '') }, svg: geminiSvg },
    { id: 'perplexity', name: 'Perplexity', url: function (p) { return 'https://www.perplexity.ai/search?q=' + encodeURIComponent(p) },
      svg: function () { return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#22B8CD" d="M19.785 0v7.272H22.5V17.62h-2.935V24l-7.037-6.194v6.145h-1.091v-6.152L4.392 24v-6.465H1.5V7.188h2.884V0l7.053 6.494V.19h1.09v6.49L19.786 0zm-7.257 9.044v7.319l5.946 5.234V14.44l-5.946-5.397zm-1.099-.08l-5.946 5.398v7.235l5.946-5.234V8.965zm8.136 7.58h1.844V8.349H13.46l6.105 5.54v2.655zm-8.982-8.28H2.59v8.195h1.8v-2.576l6.192-5.62zM5.475 2.476v4.71h5.115l-5.115-4.71zm13.219 0l-5.115 4.71h5.115v-4.71z"/></svg>' } },
    { id: 'grok', name: 'Grok', url: function (p) { return 'https://grok.com/?q=' + encodeURIComponent(p) },
      svg: function () { return '<svg viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true" focusable="false"><path d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815"/></svg>' } }
  ]
  var AI_BY = {}; AI.forEach(function (a) { AI_BY[a.id] = a })

  /* ── intents: what the visitor wants the assistant to do ──
     find   (search contexts, generic pages) describe a need → best icon + alternatives + code/steps
     code · set · fit · slides  (icon pages, library viewer) work with ONE icon for the visitor's project
     Every brief starts by pointing the assistant at the hosted skill. */
  var AI_SKILL = AI_SITE + '/skill/SKILL.md'
  var PREFILL_MAX = 1800
  var IS_MAC = /Mac|iPhone|iPad|iPod/.test((navigator.platform || '') + ' ' + (navigator.userAgent || ''))
  // touch-only devices have no paste shortcut: say "Paste" and explain the tap instead
  var IS_TOUCH = !!(W.matchMedia && W.matchMedia('(hover: none) and (pointer: coarse)').matches)
  var PASTE_KEY = IS_TOUCH ? 'Paste' : IS_MAC ? '⌘V' : 'Ctrl+V'
  var PASTE_HOW = IS_TOUCH ? 'tap the message box, choose Paste, then send' : 'press ' + PASTE_KEY + ' then Enter'
  var INTENTS = {
    find: { label: 'Find the right icon', ph: 'Describe what it’s for…' },
    code: { label: 'Code it for my app', desc: 'Exact code for your stack, size, label and states', ph: 'e.g. delete button in my React table' },
    set: { label: 'Build a matching set', desc: '4–8 icons that go with it, all in one style', ph: 'e.g. the toolbar of my notes app' },
    fit: { label: 'Is this the right icon?', desc: 'An honest check of what people will read it as', ph: 'e.g. “remove item” for shoppers in Japan' },
    slides: { label: 'Use it in my slides/doc', desc: 'Steps for PowerPoint, Slides, Canva, Figma, Notion', ph: 'e.g. a pricing slide in Google Slides' }
  }
  var ICON_INTENTS = ['code', 'set', 'fit', 'slides']
  // Default for icon contexts: 'set'. It suits every visitor (developers AND slide makers), it is what a 7-style library
  // is uniquely good at, and the single-icon basics (copy, download, code) are already one click on the page itself.
  var DEFAULT_ICON_INTENT = 'set'
  var GUIDES = {
    'google-slides': ['Google Slides', 'Google Slides deck'], powerpoint: ['PowerPoint', 'PowerPoint deck'], keynote: ['Keynote', 'Keynote deck'],
    canva: ['Canva', 'Canva design'], figma: ['Figma', 'Figma file'], 'word-google-docs': ['Word or Google Docs', 'Word or Google Docs document'],
    notion: ['Notion', 'Notion page'], wordpress: ['WordPress', 'WordPress site'], webflow: ['Webflow', 'Webflow site'], framer: ['Framer', 'Framer site'],
    'wix-squarespace': ['Wix or Squarespace', 'Wix or Squarespace site'], 'email-signatures': ['an email signature', 'email signature'], html: ['plain HTML', 'HTML website']
  }
  var WEB_GUIDES = { wordpress: 1, webflow: 1, framer: 1, 'wix-squarespace': 1, html: 1, 'email-signatures': 1 }
  var askMem = { intent: '', need: '' }
  try { askMem.intent = localStorage.getItem('with-ask-intent') || '' } catch (e) { /* noop */ }
  try { askMem.need = sessionStorage.getItem('with-ask-need') || '' } catch (e) { /* noop */ }
  function rememberAsk(k, v) {
    askMem[k] = v
    try { if (k === 'intent') localStorage.setItem('with-ask-intent', v); else sessionStorage.setItem('with-ask-need', v) } catch (e) { /* noop */ }
  }
  function normIntent(intent, hasIcon) {
    if (intent && INTENTS[intent] && (hasIcon || intent === 'find' || intent === 'slides')) return intent
    return hasIcon ? DEFAULT_ICON_INTENT : 'find'
  }

  /* The brief is a list of [text, droppable]. URL prefill keeps only the essentials when the full text is too long. */
  function askParts(opts) {
    opts = opts || {}
    var q = String(opts.query || '').replace(/\s+/g, ' ').trim().slice(0, 300)
    var name = opts.icon && icon(String(opts.icon)) ? String(opts.icon) : (opts.icon ? String(opts.icon) : '')
    var intent = normIntent(opts.intent, !!name)
    if (intent === 'find') name = ''
    var st = opts.style && INFO[opts.style] ? opts.style : 'line'
    var ST = INFO[st] ? INFO[st].title : 'Line'
    var app = opts.app && GUIDES[opts.app] ? opts.app : ''
    var P = []
    var add = function (t, drop) { P.push([t, !!drop]) }
    add('First, open and follow ' + AI_SKILL + ' — the guide to "with icons" (' + AI_SITE + '): ' + fmt(counts().icons) + ' free, MIT-licensed icons, each drawn in ' + counts().styles + ' styles (' + ORDER.join(', ') + '). Look icons up with ' + AI_SITE + '/api/search?q=WORDS (it understands synonyms and typos; overview: ' + AI_SITE + '/llms.txt). Only use icon names that exist there — never invent one.')
    add('')
    var page = name ? AI_SITE + '/icons/' + name + '.html' : ''
    var iconLine = function () {
      var m = icon(name) || {}
      var aka = (m.aliases || []).slice(0, 4)
      return 'Icon: "' + name + '", ' + ST + ' style — ' + page + (m.category ? ' (category: ' + m.category + (aka.length ? '; also called ' + aka.join(', ') : '') + ')' : '')
    }
    var needLine = function (ask) { return q ? 'What I’m making: "' + q + '"' : 'What I’m making: not said yet — ' + ask }
    if (intent === 'find') {
      if (q) {
        add('MY TASK: find the best icon for this — "' + q + '"')
        var hints = []
        try { hints = search(q, { limit: 6 }).map(function (h) { return h.name }) } catch (e) { hints = [] }
        if (hints.length) add('The site’s own search suggests: ' + hints.join(', ') + '. Check them against my meaning; don’t just trust the ranking.', true)
        add('If my meaning or where it goes is unclear, ask me ONE short question first.')
      } else {
        add('MY TASK: find the best icon for what I’m making. Ask me first, in one short question, what it is and what the icon must say.')
      }
      add('')
      add('Reply with:')
      add('1. Best fit: exact name + one line on why my users will read it right.')
      add('2. Up to 2 alternatives, one line each.')
      add('3. The best style for this context, and why (line or solid for UI controls; the illustrated styles — gloss, engrave, blueprint, sketch, glass, kawaii, sticker, pixel, retro, luxe, bauhaus, skeuo, anime, gothic, pastel, coquette, plush — only at 32px+).')
      add('4. Ready-to-paste code for my stack, or steps for my app — ask if you don’t know it (React, Vue, Svelte, plain HTML, or Slides, Canva, Figma, Docs). Include an accessible label.')
      add('5. A link for each pick: ' + AI_SITE + '/icons/NAME.html')
    } else if (intent === 'code') {
      add('MY TASK: code the "' + name + '" icon into my app.')
      add(iconLine())
      add(needLine('ask me my stack and where the icon goes, in one short question.'))
      add('')
      add('Reply with:')
      add('1. Exact, paste-ready code for my stack (ask if unknown: React, Vue, Svelte, Angular, Solid, plain HTML or a site builder), in the ' + ST + ' style unless the skill’s style rules say another fits better.')
      add('2. Size in px and colour for this spot (via currentColor/CSS), plus stroke width if the style has one.')
      add('3. Accessibility: the exact aria-label, or aria-hidden if it’s decorative, and the tooltip wording.')
      add('4. States: hover, focus ring, active/selected (line → solid for toggles), disabled.')
      add('5. One pitfall to avoid here.')
    } else if (intent === 'set') {
      add('MY TASK: build a matching icon set around "' + name + '" for my screen or flow.')
      add(iconLine())
      add(needLine('ask me what the screen or flow is, in one short question.'))
      add('')
      add('Reply with:')
      add('1. The 4–8 icons from the library that belong beside "' + name + '" here: exact names (search, don’t guess), what each stands for, and why it’s needed.')
      add('2. One style for all of them (' + ST + ' unless my context calls for another — say why), one size and one stroke width.')
      add('3. How to use them together: code for my stack, or which files to download for slides and design tools.')
      add('4. Any meaning the library doesn’t cover, with the closest substitute.')
      add('5. A link for each: ' + AI_SITE + '/icons/NAME.html')
    } else if (intent === 'fit') {
      add('MY TASK: tell me honestly whether "' + name + '" is the right icon for what I mean.')
      add(iconLine())
      add(needLine('ask me what it should mean, for whom and where, in one short question.'))
      add('')
      add('Reply with:')
      add('1. Verdict in one line: yes / it depends / no.')
      add('2. What most people will read it as; any ambiguity, cultural or regional issue, and whether it needs a text label.')
      add('3. Whether the ' + ST + ' style suits this context.')
      add('4. If something fits better: up to 3 options from the library (search first), each with exact name, why, and link.')
    } else { // slides
      var g = GUIDES[app]
      var web = !!WEB_GUIDES[app]
      if (name) add('MY TASK: help me put the "' + name + '" icon into my ' + (g ? g[1] : 'slides or document') + '.')
      else add('MY TASK: help me add an icon from with icons to my ' + (g ? g[1] : 'slides or document') + '. First find the right one by searching the library.')
      if (name) add(iconLine())
      add(needLine(g ? 'ask me what it’s for, in one short question.' : 'ask me which app (PowerPoint, Google Slides, Keynote, Canva, Figma, Notion, Word or Google Docs) and what it’s about, in one short question.'))
      add('')
      add('Reply with steps for ' + (g ? g[0] : 'my app') + ':')
      add('1. What to grab from ' + (page || 'the icon’s page (' + AI_SITE + '/icons/NAME.html)') + ': ' + (web
        ? 'Copy SVG code (paste into an HTML/embed block), the SVG file, or a PNG.'
        : 'Copy image (fastest), SVG (sharp at any size; recolourable in PowerPoint, Keynote, Figma, Canva) or PNG (256 px for slides, 1024 px for print). Set the colour there first if the app can’t recolour.'))
      add('2. How to insert, recolour and resize it in ' + (g ? g[0] : 'that app') + '.')
      add('3. Design tips: size next to the text, alignment, the same style for every icon' + (web ? ' on the site' : ' in the deck') + ', contrast.')
      add('4. The matching guide: ' + AI_SITE + '/guides/' + (app || 'APP') + '.html' + (app ? '' : ' (powerpoint, google-slides, keynote, canva, figma, notion, word-google-docs)'))
    }
    add('', true)
    add('If you can’t open links, say so instead of guessing. What I know: names are kebab-case (trash, arrow-right, check-circle); every icon page ' + AI_SITE + '/icons/NAME.html has Copy image, SVG/PNG download and Copy SVG code today. Launching soon: <i class="with with-NAME with-STYLE"></i> with the CDN stylesheet (line needs no style class) and npm packages (@withicons/react, vue, svelte, angular, solid).', true)
    add('')
    add('Keep it short and practical.')
    return P
  }
  function askPrompt(opts) { return askParts(opts).map(function (p) { return p[0] }).join('\n') }
  // the text sent in ?q= — the full brief when it fits, otherwise the essentials (the full brief is on the clipboard)
  function askPrefill(opts) {
    var P = askParts(opts)
    var full = P.map(function (p) { return p[0] }).join('\n')
    if (full.length <= PREFILL_MAX) return full
    var t = P.filter(function (p) { return !p[1] }).map(function (p) { return p[0] }).join('\n').replace(/\n{3,}/g, '\n\n')
    t += '\n\n(Shortened for the link. The full brief is on your clipboard — paste it here instead for more detail.)'
    return t.length > PREFILL_MAX + 400 ? t.slice(0, PREFILL_MAX + 380) + '…' : t
  }
  // copy with a fallback that also works on file:// and http:// (execCommand inside the click gesture),
  // and a last-resort dialog with the text pre-selected
  function copySync(text) {
    var active = doc.activeElement, ok = false
    var ta = doc.createElement('textarea')
    ta.value = text; ta.setAttribute('readonly', ''); ta.setAttribute('aria-hidden', 'true')
    ta.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0;font-size:16px'
    ;(so && so.open ? so.el : doc.body).appendChild(ta)
    ta.select(); try { ta.setSelectionRange(0, text.length) } catch (e) { /* noop */ }
    try { ok = doc.execCommand('copy') } catch (e) { ok = false }
    ta.parentNode.removeChild(ta)
    if (active && active.focus) try { active.focus({ preventScroll: true }) } catch (e) { /* noop */ }
    return ok
  }
  function copyRobust(text) {
    if (navigator.clipboard && navigator.clipboard.writeText && W.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true }, function () { return copySync(text) })
    }
    return Promise.resolve(copySync(text))
  }
  var manualEl = null
  // last-resort copy dialog; extra = { href, label } adds a link (e.g. "Open Gemini") to use once the text is copied
  function manualCopy(text, title, extra) {
    if (!manualEl) {
      manualEl = doc.createElement('div')
      manualEl.className = 'manual-copy'
      manualEl.setAttribute('role', 'dialog'); manualEl.setAttribute('aria-modal', 'true'); manualEl.setAttribute('aria-labelledby', 'mc-title')
      manualEl.innerHTML = '<div class="mc-card"><p class="mc-title" id="mc-title"></p><p class="mc-hint">Your browser blocked automatic copying. The text is selected — press <kbd>' + (IS_MAC ? '⌘' : 'Ctrl') + '</kbd>+<kbd>C</kbd> to copy it.</p>' +
        '<textarea class="mc-text" readonly></textarea><div class="mc-row"><a class="btn btn-ghost btn-sm mc-go" target="_blank" rel="noopener noreferrer" hidden></a><button type="button" class="btn btn-ink btn-sm" data-mc-close>Done</button></div></div>'
      doc.body.appendChild(manualEl)
      manualEl.addEventListener('click', function (e) { if (e.target === manualEl || e.target.closest('[data-mc-close]') || e.target.closest('.mc-go')) manualEl.classList.remove('is-on') })
      manualEl.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); manualEl.classList.remove('is-on') } })
      manualEl.addEventListener('copy', function () { var g = $('.mc-go', manualEl); if (!g.hidden) g.classList.add('is-ready') })
    }
    $('.mc-title', manualEl).textContent = title || 'Copy this prompt'
    var go = $('.mc-go', manualEl)
    go.hidden = !(extra && extra.href); go.classList.remove('is-ready')
    if (extra && extra.href) { go.href = extra.href; go.textContent = extra.label || 'Open' }
    var ta = $('.mc-text', manualEl); ta.value = text
    manualEl.classList.add('is-on')
    setTimeout(function () { ta.focus(); ta.select() }, 30)
  }

  /* Gemini has no prefill URL of its own: a persistent notice on our page says exactly what to do in Gemini. */
  var gemEl = null
  function geminiNotice(text, url) {
    if (!gemEl) {
      gemEl = doc.createElement('div')
      gemEl.className = 'gem-note'
      gemEl.setAttribute('role', 'status'); gemEl.setAttribute('aria-live', 'polite')
      var k = IS_MAC ? '<kbd>⌘</kbd><kbd>V</kbd>' : '<kbd>Ctrl</kbd>+<kbd>V</kbd>'
      gemEl.innerHTML = '<div class="gem-head"><span class="gem-logo">' + geminiSvg() + '</span><div class="gem-txt"><p class="gem-t">Prompt copied</p>' +
        '<p class="gem-s">' + (IS_TOUCH ? 'In Gemini, tap the message box, choose <b>Paste</b>, then send.' : 'In Gemini, press ' + k + ' then <kbd>Enter</kbd>.') + '</p></div>' +
        '<button type="button" class="gem-x" data-gem-close aria-label="Close">' + sized(ICON.close || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6 L18 18 M18 6 L6 18"/></svg>', 16) + '</button></div>' +
        '<pre class="gem-pre" tabindex="0" aria-label="The copied prompt"></pre>' +
        '<div class="gem-row"><button type="button" class="gem-btn" data-gem-copy>' + COPY_ICON + '<span>Copy again</span></button>' +
        '<a class="gem-btn is-ink" data-gem-open target="_blank" rel="noopener noreferrer">Open Gemini</a></div>'
      doc.body.appendChild(gemEl)
      gemEl.addEventListener('click', function (e) {
        if (e.target.closest('[data-gem-close]')) { gemEl.classList.remove('is-on'); return }
        if (e.target.closest('[data-gem-copy]')) {
          var t = gemEl.__text
          if (copySync(t)) toast('Copied again — paste it into Gemini')
          else copyRobust(t).then(function (ok) { if (ok) toast('Copied again — paste it into Gemini'); else manualCopy(t, 'Paste this into Gemini', { href: gemEl.__url, label: 'Open Gemini' }) })
        }
        if (e.target.closest('[data-gem-open]')) {
          copySync(gemEl.__text)
        }
      })
      gemEl.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); gemEl.classList.remove('is-on') } })
    }
    gemEl.__text = text; gemEl.__url = url
    $('.gem-pre', gemEl).textContent = text
    $('[data-gem-open]', gemEl).href = url
    gemEl.classList.remove('is-on'); void gemEl.offsetWidth; gemEl.classList.add('is-on')
    announce('Prompt copied. In Gemini, ' + PASTE_HOW + '.')
  }

  function askOpts(el) {
    var o = el.__askAI || {}
    var out = { icon: o.icon, style: o.style, query: o.query, intent: o.intent, app: o.app, mode: o.mode }
    if (o.bind) { var inp = typeof o.bind === 'string' ? $(o.bind) : o.bind; if (inp && inp.value.trim()) out.query = inp.value.trim() }
    if (o.mode === 'tasks') { var n = $('.ask-need-in', el); out.query = n ? n.value.trim() : '' }
    if (typeof out.query === 'function') out.query = out.query()
    return out
  }
  function aiButtons(compact, list) {
    var h = ''
    AI.forEach(function (a) {
      h += '<a class="ask-ai-btn" data-ai="' + a.id + '" href="' + esc(a.url('')) + '" target="_blank" rel="noopener noreferrer"' + (list ? ' role="menuitem"' : '') +
        ' aria-label="Ask ' + a.name + (a.paste ? ' (prompt is copied: paste it with ' + PASTE_KEY + ')' : '') + ' — opens in a new tab" title="' + (a.paste ? 'Gemini: we copy the prompt, you paste it (' + PASTE_KEY + ')' : 'Ask ' + a.name) + '">' +
        '<span class="ask-ai-logo">' + a.svg() + '</span>' + (compact ? '' : '<span class="ask-ai-name">' + a.name + '</span>') +
        (a.paste ? '<span class="ask-ai-paste" aria-hidden="true">' + PASTE_KEY + '</span>' : '') + '</a>'
    })
    h += '<button type="button" class="ask-ai-btn ask-ai-copy" data-ai="copy"' + (list ? ' role="menuitem"' : '') + ' aria-label="Copy the prompt" title="Copy the prompt">' +
      '<span class="ask-ai-logo">' + COPY_ICON + '</span>' + (compact ? '' : '<span class="ask-ai-name">Copy prompt</span>') + '</button>'
    return h
  }
  var askSeq = 0
  function askRender(el, opts) {
    if (!el) return null
    opts = opts || {}
    var mode = opts.mode || (opts.compact ? 'compact' : 'row')
    if (mode === 'compact') opts.compact = true
    var hasIcon = !!opts.icon
    var intent = mode === 'tasks' ? normIntent(opts.intent || askMem.intent, true) : normIntent(opts.intent, hasIcon)
    el.__askAI = { icon: opts.icon || '', style: opts.style || '', query: opts.query || '', intent: intent, app: opts.app || '', compact: !!opts.compact, bind: opts.bind || null, mode: mode, label: opts.label || '' }
    el.classList.add('ask-ai')
    el.classList.toggle('is-compact', mode === 'compact' || (mode === 'tasks' && !!opts.compact))
    el.classList.toggle('is-trigger', mode === 'button')
    el.classList.toggle('is-tasks', mode === 'tasks')
    el.setAttribute('data-ask-ai-ready', '')
    if (!el.getAttribute('role')) el.setAttribute('role', 'group')
    el.setAttribute('aria-label', hasIcon ? 'Ask an AI assistant to help with the ' + opts.icon + ' icon' : 'Ask an AI assistant to find the right icon')
    var h = ''
    if (mode === 'button') {
      var id = 'ask-pop-' + (++askSeq)
      h = '<button type="button" class="ask-trigger" aria-haspopup="true" aria-expanded="false" aria-controls="' + id + '" title="Describe what it’s for — an AI assistant picks the icon">' +
        '<span class="ask-spark" aria-hidden="true">✦</span><span class="ask-trigger-l">' + esc(opts.label || 'Ask AI') + '</span></button>' +
        '<div class="ask-pop" id="' + id + '" role="menu" aria-label="Choose an assistant" hidden>' +
        '<p class="ask-pop-h"><span class="ask-spark" aria-hidden="true">✦</span>Ask AI to find it</p>' +
        '<p class="ask-pop-q"></p>' +
        '<div class="ask-pop-list">' + aiButtons(false, true) + '</div>' +
        '<p class="ask-pop-note">Opens in a new tab with a ready brief (it points the assistant to our skill file). Nothing is sent to us.</p></div>'
    } else if (mode === 'tasks') {
      h = (opts.compact ? '' : '<p class="ask-step-l" id="ask-tasks-l-' + (++askSeq) + '">What do you need?</p>') + '<div class="ask-tasks" role="radiogroup" aria-label="What should the AI help with?">' + ICON_INTENTS.map(function (k) {
        return '<button type="button" role="radio" class="ask-task" data-ask-intent="' + k + '" aria-checked="' + (k === intent) + '" tabindex="' + (k === intent ? 0 : -1) + '"' + (opts.compact ? ' title="' + esc(INTENTS[k].desc) + '"' : '') + '>' +
          '<span class="ask-task-t">' + INTENTS[k].label + '</span>' + (opts.compact ? '' : '<span class="ask-task-d">' + INTENTS[k].desc + '</span>') + '</button>'
      }).join('') + '</div>' +
        '<label class="ask-need"><span class="ask-need-l">What are you making? <small>optional</small></span>' +
        '<input class="ask-need-in" type="text" maxlength="200" autocomplete="off" placeholder="' + esc(INTENTS[intent].ph) + '" value="' + esc(opts.query || askMem.need || '') + '"></label>' +
        (opts.compact ? '' : '<p class="ask-step-l">Ask your assistant</p>') +
        '<div class="ask-ai-row">' + aiButtons(!!opts.compact) + '</div>'
      if (!opts.compact) h += '<p class="ask-ai-note">The brief is copied and the assistant opens in a new tab. Gemini can’t be pre-filled, so ' + PASTE_HOW + '. Nothing is sent to us.</p>' +
        '<details class="ask-peek"><summary>Preview the brief</summary><pre class="ask-preview"></pre></details>'
    } else {
      h = mode === 'compact' ? '<span class="ask-ai-label"><span class="ask-ai-spark" aria-hidden="true">✦</span>Ask AI</span>' : ''
      h += '<div class="ask-ai-row">' + aiButtons(mode === 'compact') + '</div>'
      if (mode !== 'compact') h += '<p class="ask-ai-note">We copy a ready brief and open the assistant in a new tab — it reads our skill file, searches with icons and replies with the best fit and code or steps. Gemini can’t be pre-filled, so ' + PASTE_HOW + '.</p>'
    }
    el.innerHTML = h
    askLinks(el)
    return el
  }
  // refresh every assistant link with the freshest brief (middle-click and "open in new tab" stay correct)
  function askLinks(el) {
    var o = askOpts(el), pre = askPrefill(o)
    $$('.ask-ai-btn[data-ai]', el).forEach(function (b) { var a = AI_BY[b.getAttribute('data-ai')]; if (a) b.setAttribute('href', a.url(pre)) })
    var pv = $('.ask-preview', el); if (pv) pv.textContent = askPrompt(o)
  }
  function askUpdate(el, opts) {
    if (!el) return
    if (!el.__askAI) { askRender(el, opts); return }
    for (var k in opts) el.__askAI[k] = opts[k]
    if (opts.intent) setIntent(el, opts.intent, true)
    askLinks(el)
  }
  function setIntent(el, intent, quiet) {
    var o = el.__askAI; if (!o) return
    o.intent = normIntent(intent, !!o.icon)
    $$('.ask-task', el).forEach(function (t) { var on = t.getAttribute('data-ask-intent') === o.intent; t.setAttribute('aria-checked', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1 })
    var n = $('.ask-need-in', el); if (n && INTENTS[o.intent]) n.placeholder = INTENTS[o.intent].ph
    if (!quiet && o.mode === 'tasks') rememberAsk('intent', o.intent)
    askLinks(el)
    try { el.dispatchEvent(new CustomEvent('askai:intent', { bubbles: true, detail: { intent: o.intent, icon: o.icon } })) } catch (e) { /* noop */ }
  }

  /* search-adjacent trigger: one button, a small assistant menu */
  var openPop = null
  function popClose(focusBack) {
    if (!openPop) return
    var host = openPop, pop = $('.ask-pop', host), tr = $('.ask-trigger', host)
    pop.hidden = true; pop.style.transform = ''; tr.setAttribute('aria-expanded', 'false')
    openPop = null
    if (focusBack) tr.focus({ preventScroll: true })
  }
  function bindInput(host) { var b = host.__askAI && host.__askAI.bind; return typeof b === 'string' ? $(b) : b }
  function popOpen(host) {
    var inp = bindInput(host)
    var q = inp ? inp.value.trim() : String(host.__askAI.query || '').trim()
    if (inp && !q) { // nothing to brief yet: invite a description in the field itself
      if (!inp.__askPh) inp.__askPh = inp.getAttribute('placeholder') || ''
      inp.setAttribute('placeholder', INTENTS.find.ph)
      host.classList.add('is-describing')
      try { host.dispatchEvent(new CustomEvent('askai:describe', { bubbles: true })) } catch (e) { /* noop */ }
      inp.focus()
      toast('Describe what the icon is for, then press Ask AI', ICON.search)
      inp.addEventListener('blur', function once() { inp.removeEventListener('blur', once); if (!inp.value.trim()) { inp.setAttribute('placeholder', inp.__askPh); host.classList.remove('is-describing'); try { host.dispatchEvent(new CustomEvent('askai:describe-end', { bubbles: true })) } catch (e) { /* noop */ } } })
      return
    }
    if (inp && host.classList.contains('is-describing')) {
      inp.setAttribute('placeholder', inp.__askPh || ''); host.classList.remove('is-describing')
      try { host.dispatchEvent(new CustomEvent('askai:describe-end', { bubbles: true })) } catch (e) { /* noop */ }
    }
    if (openPop && openPop !== host) popClose()
    var pop = $('.ask-pop', host), tr = $('.ask-trigger', host)
    $('.ask-pop-q', pop).innerHTML = q ? '<span>Your need</span>“' + esc(q.slice(0, 90)) + (q.length > 90 ? '…' : '') + '”' : '<span>Tell it what you’re making</span>'
    askLinks(host)
    pop.hidden = false; tr.setAttribute('aria-expanded', 'true'); openPop = host
    pop.style.transform = ''
    var r = pop.getBoundingClientRect(), vw = doc.documentElement.clientWidth, dx = 0
    if (r.right > vw - 8) dx = vw - 8 - r.right
    if (r.left + dx < 8) dx = 8 - r.left
    if (dx) pop.style.transform = 'translateX(' + Math.round(dx) + 'px)'
    var first = $('.ask-ai-btn', pop); if (first) first.focus({ preventScroll: true })
  }
  function onPopKey(e) {
    if (!openPop) return
    if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); popClose(true); return }
    var items = $$('.ask-ai-btn', openPop), i = items.indexOf(doc.activeElement)
    if (i < 0) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus() }
    else if (e.key === 'Tab') { popClose() }
  }

  function onAskClick(e) {
    var tr = e.target.closest && e.target.closest('.ask-trigger')
    if (tr) {
      var th = tr.closest('[data-ask-ai-ready]')
      e.preventDefault()
      if (openPop === th) popClose(); else popOpen(th)
      return
    }
    var chip = e.target.closest && e.target.closest('.ask-task')
    if (chip) { var ch = chip.closest('[data-ask-ai-ready]'); if (ch) setIntent(ch, chip.getAttribute('data-ask-intent')); return }
    if (openPop && !openPop.contains(e.target)) popClose()
    var b = e.target.closest && e.target.closest('.ask-ai-btn')
    if (!b) return
    var host = b.closest('[data-ask-ai-ready]')
    if (!host) return
    var o = askOpts(host)
    var p = askPrompt(o), pre = askPrefill(o), trimmed = pre !== p
    var a = AI_BY[b.getAttribute('data-ai')]
    if (!a) { // copy prompt only
      e.preventDefault()
      copyRobust(p).then(function (ok) { if (ok) toast('Prompt copied — paste it into any AI'); else manualCopy(p) })
      return
    }
    var url = a.url(pre)
    b.setAttribute('href', url) // freshest brief, used by the link's own default action right after this handler
    // everything below runs synchronously inside the click: the copy keeps the user activation and the tab opens
    // from the link's default action, so no popup blocker is involved
    var ok = copySync(p)
    if (navigator.clipboard && navigator.clipboard.writeText && W.isSecureContext) navigator.clipboard.writeText(p).then(function () { ok = true }, function () { /* noop */ })
    if (a.paste) {
      if (!ok) { // cannot copy: don't strand the visitor in an empty Gemini tab
        e.preventDefault()
        manualCopy(p, 'Copy this, then open Gemini and paste it', { href: url, label: 'Open Gemini' })
      } else geminiNotice(p, url)
    } else toast('Opening ' + a.name + (trimmed ? ' — full brief copied too' : ' — prompt copied too'))
    b.classList.remove('is-pop'); void b.offsetWidth; b.classList.add('is-pop')
    if (openPop) setTimeout(function () { popClose() }, 0)
  }
  function onAskKey(e) {
    onPopKey(e)
    var chip = e.target.closest && e.target.closest('.ask-task')
    if (chip && /^Arrow(Left|Right|Up|Down)$/.test(e.key)) {
      e.preventDefault()
      var all = $$('.ask-task', chip.parentNode), i = all.indexOf(chip)
      var n = all[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + all.length) % all.length]
      n.focus(); n.click()
    }
    var need = e.target.closest && e.target.closest('.ask-need-in')
    if (need && e.key === 'Enter') { e.preventDefault(); var h = need.closest('[data-ask-ai-ready]'); var c = h && $('.ask-ai-btn[data-ai="claude"]', h); if (c) c.focus() }
  }
  function onAskInput(e) {
    var need = e.target.closest && e.target.closest('.ask-need-in')
    if (need) { rememberAsk('need', need.value.trim()); var h = need.closest('[data-ask-ai-ready]'); if (h) askLinks(h) }
  }
  function initAskAI() {
    $$('[data-ask-ai]').forEach(askAuto)
    doc.addEventListener('click', onAskClick)
    doc.addEventListener('keydown', onAskKey, true)
    doc.addEventListener('input', onAskInput)
    doc.addEventListener('pointerdown', function (e) { if (openPop && !openPop.contains(e.target)) popClose() }, true)
    W.addEventListener('resize', function () { popClose() })
    if ('MutationObserver' in W) {
      new MutationObserver(function (ms) {
        for (var i = 0; i < ms.length; i++) {
          var added = ms[i].addedNodes
          for (var j = 0; j < added.length; j++) {
            var n = added[j]
            if (n.nodeType !== 1) continue
            if (n.hasAttribute('data-ask-ai')) askAuto(n)
            if (n.querySelectorAll) $$('[data-ask-ai]', n).forEach(askAuto)
          }
        }
      }).observe(doc.body, { childList: true, subtree: true })
    }
  }
  function askAuto(el) {
    if (el.hasAttribute('data-ask-ai-ready')) return
    askRender(el, { icon: el.getAttribute('data-icon') || '', style: el.getAttribute('data-style') || '', query: el.getAttribute('data-query') || '',
      intent: el.getAttribute('data-intent') || '', app: el.getAttribute('data-app') || '', mode: el.getAttribute('data-ask-mode') || '',
      label: el.getAttribute('data-ask-label') || '', compact: el.hasAttribute('data-compact'), bind: el.getAttribute('data-ask-bind') || null })
  }
  var askAI = { render: askRender, prompt: askPrompt, prefill: askPrefill, update: askUpdate, setIntent: setIntent,
    intents: Object.keys(INTENTS), iconIntents: ICON_INTENTS.slice(), defaultIconIntent: DEFAULT_ICON_INTENT, skill: AI_SKILL, prefillMax: PREFILL_MAX,
    assistants: AI.map(function (a) { return a.id }) }

  /* ═════════════════════ EVERGROW ═════════════════════
     Real logos (brand/evergrow-*.webp): the footer pill shows the wordmark (white on the always-dark footer,
     theme-aware elsewhere); the navbar byline gets the tiny square mark. */
  function evergrowLogo(onDark) {
    var b = esc(scriptBase + 'brand/')
    if (onDark) return '<img class="eg-logo" src="' + b + 'evergrow-white.webp" width="400" height="91" alt="Evergrow" decoding="async" loading="eager">'
    return '<img class="eg-logo eg-on-light" src="' + b + 'evergrow-black.webp" width="400" height="91" alt="Evergrow" decoding="async" loading="eager">' +
      '<img class="eg-logo eg-on-dark" src="' + b + 'evergrow-white.webp" width="400" height="91" alt="" decoding="async" loading="eager">'
  }
  function initEvergrow() {
    $$('[data-evergrow-mark]').forEach(function (m) {
      if (m.getAttribute('data-eg-ready')) return
      m.setAttribute('data-eg-ready', '1')
      var link = m.closest('a')
      var onDark = !!m.closest('.site-footer, .slab-dark, [data-on-dark]')
      if (link && link.classList.contains('evergrow-link')) {
        link.setAttribute('aria-label', 'Powered by Evergrow')
        link.classList.add('has-logo')
        link.innerHTML = '<span class="eg-pb">Powered by</span><span class="eg-wordmark" data-evergrow-mark data-eg-ready="1">' + evergrowLogo(onDark) + '</span>'
      } else if (!m.firstChild) m.innerHTML = evergrowLogo(onDark)
    })
    $$('.logo-by').forEach(function (by) {
      if (by.querySelector('.logo-by-mark')) return
      var b = by.querySelector('b')
      var img = doc.createElement('img')
      img.className = 'logo-by-mark'; img.alt = ''; img.width = 11; img.height = 11; img.decoding = 'async'
      img.src = scriptBase + 'brand/evergrow-square-64.webp'
      by.insertBefore(img, b || null)
    })
  }

  /* ───────────── public API ───────────── */
  var API = {
    version: function () { return DATA().version },
    data: DATA, svg: svg, svgFrom: svgFrom, svgFile: svgFile, has: hasIcon, icon: icon, icons: icons, styles: styles, styleInfo: INFO, ORDER: ORDER,
    loadStyle: loadStyle, loadAllStyles: loadAllStyles, loadMeta: loadMeta, loadScript: loadScript,
    resolve: resolve, suggest: suggest, search: search, ensureSearch: ensureSearch, whyMatched: whyMatched,
    copy: copyText, copyWithToast: copy, toast: toast, download: download, svgToPng: svgToPng, announce: announce,
    highlight: highlight, codeBlock: codeBlock, copyButton: copyButton, esc: esc,
    on: on, off: off, emit: emit,
    skeleton: skeleton, pathNodes: pathNodes, skeletonSvg: skeletonSvg,
    openSearch: openSearch, closeSearch: closeSearch, theme: currentTheme, toggleTheme: toggleTheme,
    whenVisible: whenVisible, visibility: visibility, idle: idle, pick: pick, fmt: fmt, $: $, $$: $$,
    base: scriptBase, url: rel, iconUrl: iconUrl, magnetic: magnetic, icon_svg: ICON,
    askAI: askAI, copyPng: copyPng, manualCopy: manualCopy,
    GROUPS: GROUPS, counts: counts, numWord: numWord, paintCounts: paintCounts
  }
  // live: WI.reduced always reads the current state; WI.on('motion', fn(reduced)) hears changes
  Object.defineProperty(API, 'reduced', { enumerable: true, get: function () { return reduced } })
  API.setStill = setStill
  API.isStill = function () { return userStill }
  W.WI = API
  W.EG = API

  function boot() {
    $$('[data-theme-toggle]').forEach(function (b) { b.addEventListener('click', toggleTheme) })
    paintToggles()
    initHeader()
    initLogoMorph()
    initSearch()
    initReveal()
    initFooter()
    initStillToggle()
    initEvergrow()
    initAskAI()
    wireCopy()
    on('meta', function () { paintCounts() })
    paintCounts()
    if ($('[data-count]')) idle(function () { loadMeta().then(function () { paintCounts() }) }, 1500)
    $$('pre[data-code]').forEach(function (p) { p.outerHTML = codeBlock(p.textContent.replace(/^\n/, ''), p.getAttribute('data-code')) })
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { emit('fonts') })
    emit('ready')
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot); else boot()
})()
