#!/usr/bin/env node
// Generates the demos hub, site/demos/index.html, from demos/_data/demos.json (so the hub never drifts from the pages).
// It is a normal site page: the site's own <head>, header, footer, tokens and dark mode come from
// forge/tools/site-pages/lib.mjs (page()), its styles from site/css/demos.css, and its icons are drawn inline at build
// time (no CDN), so it works under the site's Content-Security-Policy. Counts come from the data, never hard-coded.
//   node demos/_tools/build-hub.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { page, write, icon, crumbs, esc, ORIGIN, ICON_NAMES, N_ICONS, N_STYLES, cvar, styleTitle, hasStyle, num } from '../../forge/tools/site-pages/lib.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const OUT = path.join(ROOT, 'site', 'demos')
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'demos', '_data', 'demos.json'), 'utf8'))
const demos = data.demos.filter(d => fs.existsSync(path.join(OUT, `${d.slug}.html`)))
const ico = (name, size = 16, style = 'duo') => ICON_NAMES.includes(name) ? icon(name, hasStyle(style) ? style : 'line', { size }) : ''

const when = d => {
  if (!d.event) return ''
  const dt = new Date(d.event.date + 'T' + d.event.start + ':00Z')
  const day = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  const t = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' })
  return `${day} · ${t}`
}
const GROUP_ICON = { Halloween: 'jack-o-lantern', Diwali: 'diya', 'House party': 'party-popper', Kids: 'balloon', Family: 'cake', Holiday: 'gift', Feminine: 'flower', 'Old school': 'store' }
const KIND_ICON = { invite: 'mail', shop: 'shopping-bag' }
// Demos marked "motion": true in demos.json are the motion showcases: they get their own "Animated demos" section
// and stay out of the main grid (and its filters and counts).
const animated = demos.filter(d => d.motion), main = demos.filter(d => !d.motion)
const invites = main.filter(d => d.kind === 'invite'), shops = main.filter(d => d.kind === 'shop')
const N = demos.length, NM = main.length, NA = animated.length

const card = d => {
  const thumb = fs.existsSync(path.join(OUT, '_thumbs', `${d.slug}.jpg`))
  const style = hasStyle(d.defaultStyle) ? d.defaultStyle : 'line'
  return `
<li class="dm-card" data-kind="${d.kind}" style="--g:${cvar(style)}">
  <a class="dm-shot" href="${d.slug}.html" tabindex="-1" aria-hidden="true">
    ${thumb ? `<img src="_thumbs/${d.slug}.jpg" width="768" height="480" loading="lazy" decoding="async" alt="">` : '<span class="dm-ph"></span>'}
    <span class="dm-num">${String(d.n).padStart(2, '0')}</span>
  </a>
  <div class="dm-body">
    <p class="dm-tags">${d.motion ? `<span class="dm-tag dm-motion">${ico('sparkles')} Animated</span>` : ''}<span class="dm-tag">${ico(GROUP_ICON[d.group] || 'sparkles')} ${esc(d.group)}</span><span class="dm-tag dm-kind">${ico(KIND_ICON[d.kind])} ${d.kind === 'invite' ? 'Invitation' : 'Shop'}</span></p>
    <h3><a href="${d.slug}.html">${esc(d.title)}</a></h3>
    <p class="dm-tl">${esc(d.tagline)}</p>
    <p class="dm-meta">${d.event ? `${ico('calendar')} ${esc(when(d))}` : `${ico('tag')} ${esc((d.brand || '').split('.')[0].replace(/\s*\(fictional\)/, '') || 'Fictional shop')}`}</p>
    <p class="dm-style"><span class="dm-dot" aria-hidden="true"></span> Opens in ${esc(styleTitle(style))} · ${d.recommend.length} styles picked</p>
    <p class="dm-lv" aria-label="Open ${esc(d.title)} at a level">
      <a href="${d.slug}.html#lv=0">Basic</a><a href="${d.slug}.html#lv=1">Upgraded</a><a class="go" href="${d.slug}.html#lv=2">Full ${ico('arrow-right', 14, 'line')}</a>
    </p>
  </div>
</li>`
}

const path_ = 'demos/index.html'
const url = `${ORIGIN}/${path_}`
const desc = `${N} demo pages, invitations and shops for fictional events and businesses${NA ? ` (${NA} of them animated motion showcases)` : ''}, that switch live from a plain site to one upgraded with with icons: ${N_STYLES} styles, live icons and motion.`

const body = `<div class="dm">
  <section class="pg-hero dm-hero">
    ${crumbs([['Home', '../index.html'], ['Demos', null]])}
    <p class="pg-eyebrow"><span class="hand">see it on a real page</span></p>
    <h1 class="pg-title">with icons demos</h1>
    <p class="pg-lede">These ${N} demo pages are invitations and shops for fictional events and businesses, built to show what the with icons library does to a real-looking website. Each one switches live between a plain page with emoji, the same page with icons, and a full version with live icons and motion, in any of the ${N_STYLES} styles.</p>
    <p class="dm-fine">All names, people, places, shops and products in the demos are made up. Photos are credited on each page.</p>
  </section>

  <section class="dm-how" aria-labelledby="dm-how-h">
    <h2 id="dm-how-h" class="pg-sr">How the demos work</h2>
    <ul>
      <li>${ico('layers', 28)}<b>Three levels</b><span>Basic is a plain site with emoji. Upgraded swaps in with icons. Full adds live icons and motion.</span></li>
      <li>${ico('palette', 28)}<b>${N_STYLES} styles, one click</b><span>The floating bar on every demo steps through styles, shuffles, resizes and recolours the icons.</span></li>
      <li>${ico('pencil', 28)}<b>Swap any icon</b><span>Turn on "Pick icons", click any icon on the page and replace it with any of the ${num(N_ICONS)}.</span></li>
    </ul>
  </section>

  <section class="dm-list" aria-labelledby="dm-list-h">
    <h2 id="dm-list-h">${NA ? `${NM} demo pages` : `All ${N} demos`}</h2>
    <div class="dm-filters" role="group" aria-label="Filter demos">
      <button type="button" data-f="all" aria-pressed="true">All ${NM}</button>
      <button type="button" data-f="invite" aria-pressed="false">${ico('mail')} Invitations ${invites.length}</button>
      <button type="button" data-f="shop" aria-pressed="false">${ico('shopping-bag')} Shops ${shops.length}</button>
      <span class="dm-count" id="dm-count" aria-live="polite"></span>
    </div>
    <ul class="dm-grid" id="dm-grid">
${main.map(card).join('\n')}
    </ul>
  </section>
${NA ? `
  <section class="dm-list dm-anim" aria-labelledby="dm-anim-h">
    <h2 id="dm-anim-h">Animated demos</h2>
    <p class="dm-intro">Motion icons move on their own: a lantern sways, a tail wags, a bell rings when you point at it. ${NA === 2 ? 'These two pages are' : `These ${NA} pages are`} built to show that off, with icons that loop gently, react on hover and play once as they scroll into view. Open one at Full to see the motion, or at Upgraded for the same icons standing still. Motion respects your system's reduce-motion setting.</p>
    <ul class="dm-grid dm-grid-anim">
${animated.map(card).join('\n')}
    </ul>
  </section>
` : ''}
  <section class="dm-keys" aria-labelledby="dm-keys-h">
    <h2 id="dm-keys-h">Drive any demo from the keyboard</h2>
    <div><p>On every demo page:</p><ul><li><kbd>i</kbd> open or close the settings</li><li><kbd>[</kbd> <kbd>]</kbd> previous or next style</li><li><kbd>s</kbd> a random style</li><li><kbd>l</kbd> cycle Basic, Upgraded, Full</li></ul></div>
    <div><p>Share a look: the address bar updates as you change things (<code>#ico=gothic&amp;lv=2</code>), and "Copy link to this look" in the panel copies it.</p></div>
    <div><p>Every demo is a single HTML file that loads the published <code>@withicons/web</code> package. Want the same on your site? <a href="../developers.html">Install with icons</a>.</p></div>
  </section>
</div>
<script>
(function () {
  var cards = [].slice.call(document.querySelectorAll('#dm-grid .dm-card')), btns = [].slice.call(document.querySelectorAll('.dm-filters [data-f]')), count = document.getElementById('dm-count')
  function apply(f) {
    var n = 0
    cards.forEach(function (c) { var ok = f === 'all' || c.getAttribute('data-kind') === f; c.hidden = !ok; if (ok) n++ })
    btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-f') === f)) })
    count.textContent = n + ' of ' + cards.length + ' demos'
  }
  btns.forEach(function (b) { b.addEventListener('click', function () { apply(b.getAttribute('data-f')) }) })
  apply('all')
})()
</script>`

const ld = [
  { '@type': 'CollectionPage', '@id': url + '#page', name: 'with icons demos', url, description: desc, inLanguage: 'en', isPartOf: { '@id': ORIGIN + '/#website' }, mainEntity: { '@id': url + '#demos' } },
  {
    '@type': 'ItemList', '@id': url + '#demos', name: 'with icons demo pages', numberOfItems: N,
    itemListElement: [...main, ...animated].map((d, i) => ({ '@type': 'ListItem', position: i + 1, name: `${d.title} (demo)`, description: (d.motion ? 'Animated motion showcase. ' : '') + d.tagline, url: `${ORIGIN}/demos/${d.slug}.html` })),
  },
]

write(path_, page({
  path: path_, current: '', bodyClass: 'pg-demos', styles: ['css/demos.css'],
  title: `Demos: ${N} pages that switch from plain to with icons | with icons`, ogTitle: 'with icons demos',
  desc, body, ld, crumbsLd: [['Home', ''], ['Demos', path_]],
}))
console.log('wrote site/demos/index.html with', N, 'cards')
