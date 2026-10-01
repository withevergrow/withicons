// site/alternatives/index.html + site/alternatives/<library>.html — honest, sourced comparisons and migration guides.
import { crumbs } from '../site-pages/lib.mjs'
import { I, esc, cvar, code, shell, picker, answer, faqBlock, faqLd, webPageLd, altLinks, freeLinks, cta, assertIcons, strip, STYLES, STYLE_TITLE, ICON_NAMES, CHECKED, CHECKED_HUMAN, ORIGIN } from './render.mjs'
import { LIBS, FACT_ROWS, US, US_HUB } from './libraries.mjs'
import { LANDERS } from './free.mjs'

const N = ICON_NAMES.length
const pascal = n => n.split('-').map(x => x[0].toUpperCase() + x.slice(1)).join('')
const short = l => l.short || l.name
const OPEN = LIBS.filter(l => l.kind === 'open')

/* converter spec: normalised "their name" → our icon name, plus the mode's rules */
function convSpec(l) {
  const m = l.migrate
  if (!m.mode) return null
  const strs = (m.prefixes || []).map(p => Array.isArray(p) ? p[0] : p).sort((a, b) => b.length - a.length)
  const key = raw => {
    let k = raw.replace(/\s*\(.*\)$/, '').trim()
    if (m.mode === 'class') {
      const pf = strs.find(p => k.startsWith(p)); if (pf) k = k.slice(pf.length)
      for (const [sfx] of m.suffixes || []) if (k.endsWith(sfx)) { k = k.slice(0, -sfx.length); break }
    } else if (m.mode === 'ligature') k = k.replace(/_/g, '-')
    else if (m.mode === 'webcomponent') k = k.replace(/-(outline|sharp)$/, '')
    else if (m.mode === 'component') k = k.split(' / ')[0]
    return k
  }
  const map = {}
  for (const [t, o] of m.map) map[key(t)] = o
  Object.assign(map, m.extra || {})
  assertIcons(Object.values(map), 'converter ' + l.slug)
  return { mode: m.mode, map, prefixes: m.prefixes, suffixes: m.suffixes, tokens: m.tokens, importRe: m.importRe, stripRe: m.stripRe, solidPkg: m.solidPkg }
}

const useCode = (l, o) => {
  const m = l.migrate.mode
  if (m === 'component') return `<code>&lt;${pascal(o)} /&gt;</code>`
  if (m === 'webcomponent' || m === 'iconify') return `<code>&lt;with-icon name="${o}"&gt;</code>`
  return `<code>with-${o}</code>`
}

function sup(l, refs) {
  return (refs || []).map(n => { if (!l.sources[n - 1]) throw new Error(`${l.slug}: missing source ${n}`); return `<a class="ax-src" href="#src-${n}" aria-label="Source ${n}: ${esc(l.sources[n - 1][0])}">[${n}]</a>` }).join('')
}

function libPage(l) {
  const path = `alternatives/${l.slug}.html`, p = '../'
  const us = US(p)
  assertIcons(l.migrate.map.map(r => r[1]), l.slug)
  const name = l.name, sn = short(l)
  const title = `${name} alternative: free MIT icons in 7 styles · with icons`
  const desc = `Looking for a ${name} alternative? Compare ${name} and with icons side by side (licence, price, icon count, styles, frameworks, AI), with a name map and converter to switch. Checked ${CHECKED_HUMAN}.`
  const spec = convSpec(l)
  const isConcept = !!l.migrate.concept
  const others = OPEN.filter(x => x.slug !== l.slug).slice(0, 3)

  const qs = [
    [`What is the best free alternative to ${name}?`, `It depends on what you need. with icons is a free, MIT-licensed set of ${N} icons in 7 styles that works in code, slides, docs and design tools, with no credit required. Other popular free options include ${others.map(o => `<a href="${o.slug}.html">${esc(o.name)}</a>`).join(', ')}; <a href="index.html">compare them all</a>.`],
    [`Is ${name} free?`, `${strip(l.facts.price[0])}. Licence: ${strip(l.facts.license[0])}. (Checked ${CHECKED_HUMAN}; see the sources below.)`],
    [`How many icons does with icons have compared with ${name}?`, `with icons has ${N} icons, each drawn in 7 styles (${(N * 7).toLocaleString('en-US')} SVGs). ${name}: ${strip(l.facts.count[0]).replace(/^./, c => c.toLowerCase())}. ${name} is the bigger library; with icons focuses on a curated set with more styles.`],
    ['Do I need to credit with icons?', `No. with icons is MIT licensed: free for personal and commercial use with no attribution. If you redistribute the icon files themselves, include the licence text. <a href="${p}license.html">Licence in plain words</a>.`],
    ...l.faq,
  ]

  const swapRows = [0, 6, 13].map(i => l.migrate.map[i]).filter(Boolean)
  const swapStyles = ['line', 'solid', 'duo']
  const table = `<div class="pg-table-wrap ax-compare"><table class="ax-table">
    <caption class="pg-sr">${esc(name)} compared with with icons</caption>
    <thead><tr><th scope="col"><span class="pg-sr">Feature</span></th><th scope="col">${esc(name)}</th><th scope="col" class="ax-us">with icons</th></tr></thead>
    <tbody>${FACT_ROWS.map(([k, label]) => `<tr><th scope="row">${label}</th><td data-col="${esc(name)}">${l.facts[k][0]}${sup(l, l.facts[k][1])}</td><td class="ax-us" data-col="with icons">${us[k]}</td></tr>`).join('')}</tbody>
  </table></div>
  <p class="ax-table-note">${esc(name)} facts were checked on <time datetime="${CHECKED}">${CHECKED_HUMAN}</time> against the official sources numbered below. Prices and counts change, so follow the links for the latest. “None found” means we couldn’t find an official offering, not that none exists.</p>`

  const mapTable = `<div class="pg-table-wrap ax-map-wrap"><table class="pg-table ax-map">
    <caption class="pg-sr">${isConcept ? `Common searches and the matching with icons` : `${esc(name)} names and their with icons names`}</caption>
    <thead><tr><th scope="col">${isConcept ? 'You’d search for' : `${esc(name)}`}</th><th scope="col" class="ax-arrow"><span class="pg-sr">becomes</span></th><th scope="col">with icons</th>${isConcept ? '' : '<th scope="col">Use it</th>'}</tr></thead>
    <tbody>${l.migrate.map.map(([t, o]) => `<tr><td><code>${esc(t)}</code></td><td class="ax-arrow">${I('arrow-right', 'line', 16)}</td><td><a href="${p}icons/${o}.html"><span class="ax-map-ic">${I(o, 'line', 22)}</span>${o}</a></td>${isConcept ? '' : `<td>${useCode(l, o)}</td>`}</tr>`).join('')}</tbody>
  </table></div>`

  const converter = spec ? `<div class="ax-conv" data-converter>
    <h3>${I('wand', 'duo', 24)} Paste your ${esc(name)} code</h3>
    <p>It converts as you type, right here in your browser: known names from the table, plus a meaning search for the rest. Check the result; icons we don’t have are listed so you can search for them.</p>
    <script type="application/json">${JSON.stringify(spec).replace(/</g, '\\u003c')}</script>
    <div class="ax-conv-grid">
      <div><label for="conv-in">${esc(name)} code</label><textarea id="conv-in" data-conv-in spellcheck="false" autocomplete="off">${esc(l.migrate.sample)}</textarea></div>
      <div><label for="conv-out">with icons code</label><pre id="conv-out" class="ax-conv-out" data-conv-out aria-live="polite" tabindex="0">${esc(l.migrate.sample)}</pre></div>
    </div>
    <div class="ax-conv-foot"><p class="ax-conv-note" data-conv-note>Turn on JavaScript to convert.</p><button type="button" class="btn btn-ink btn-sm" data-conv-copy>${I('copy', 'line', 16)} Copy result</button></div>
  </div>` : ''

  const body = `
<div class="ax-page" style="--g:${cvar(l.color)}">
  <section class="pg-hero ax-hero">
    ${crumbs([['Home', p + 'index.html'], ['Alternatives', 'index.html'], [esc(sn), null]])}
    <div class="ax-hero-grid">
      <div>
        <p class="pg-eyebrow"><span class="hand">switching from ${esc(sn)}?</span></p>
        <h1 class="pg-title ax-title">A free <span class="pg-hl" style="--g:${cvar(l.color)}">${esc(name)}</span> alternative</h1>
        ${answer(`Looking for a ${esc(name)} alternative? <b>with icons</b> is a free, MIT-licensed set of <b>${N} icons in 7 styles</b>: copy them as SVG or PNG, use <code>&lt;i class="with with-home"&gt;</code> tags, or install them for React, Vue, Svelte, Angular and Solid (npm packages launching soon). ${esc(name)}${l.also ? ` (and ${esc(l.also)})` : ''} is ${l.known} Below: a side-by-side table, when to choose each, and a name map${spec ? ' with a converter' : ''} to switch.`)}
      </div>
      <div class="ax-hero-art" aria-hidden="true">
        <div class="ax-swap">${swapRows.map(([t, o], i) => `<div class="ax-swap-row" style="--i:${i}"><code>${esc(t.replace(/\s*\(.*\)$/, ''))}</code><span class="ax-swap-arr">${I('arrow-right', 'line', 18)}</span><span class="ax-swap-ic s-${swapStyles[i]}">${I(o, swapStyles[i], 28)}</span></div>`).join('')}</div>
        <p class="ax-swap-note hand">same idea, 7 styles</p>
      </div>
    </div>
  </section>

  <section aria-labelledby="cmp-h">
    <div class="ax-sec-head"><p class="ax-kicker">At a glance</p><h2 id="cmp-h">${esc(name)} vs with icons</h2><p>The facts that usually decide it, side by side. Small numbers link to the source.</p></div>
    ${table}
  </section>

  <section aria-labelledby="choose-h">
    <div class="ax-sec-head"><p class="ax-kicker">Which one?</p><h2 id="choose-h">Both are good. Here’s when each fits</h2></div>
    <div class="ax-choose">
      <div class="ax-choose-card" data-reveal><h3>Choose ${esc(name)} if…</h3><ul>${l.them.map(t => `<li>${I('check', 'line', 20)}<span>${t}</span></li>`).join('')}</ul></div>
      <div class="ax-choose-card is-us" data-reveal style="--d:1"><h3>Choose with icons if…</h3><ul>${l.us.map(t => `<li>${I('check', 'solid', 20)}<span>${t}</span></li>`).join('')}</ul></div>
    </div>
  </section>

  <section aria-labelledby="mig-h">
    <div class="ax-sec-head"><p class="ax-kicker">Migration guide</p><h2 id="mig-h">Switch from ${esc(sn)} in minutes</h2><p>${l.migrate.intro}</p></div>
    ${l.migrate.before ? `<div class="ax-before-after">${code(l.migrate.before[1], l.migrate.before[0], `Before · ${name}`)}${code(l.migrate.after[1], l.migrate.after[0], 'After · with icons')}</div>` : ''}
    ${l.migrate.styleNote ? `<p class="pg-note">${l.migrate.styleNote}</p>` : ''}
    ${converter}
    <h3 class="ax-h3" id="map-h" style="margin:34px 0 0;font:750 var(--step-1)/1.2 var(--font-display);letter-spacing:-.02em">${isConcept ? 'Common icons, matched' : 'Name map: common icons'}</h3>
    ${mapTable}
  </section>

  ${picker({ id: 'find', p, actions: l.migrate.mode === 'component' ? ['jsx', 'svg', 'png'] : ['class', 'svg', 'png'], groups: [[null, [...new Set(l.migrate.map.map(r => r[1]))].slice(0, 24)]], q: '', heading: `Find the with icons version of any ${esc(sn)} icon`, intro: `Type the ${esc(sn)} name or just what it means (“${esc(l.searchQ)}”). Search understands synonyms and typos across all ${N} icons.`, placeholder: `Try “${l.searchQ}” or any ${sn} name` })}

  ${faqBlock('faq-h', qs, `${esc(name)} alternative: questions`)}

  <section class="ax-sources" aria-labelledby="src-h">
    <div class="ax-sec-head"><p class="ax-kicker">Sources</p><h2 id="src-h">Where these facts come from</h2></div>
    <p class="ax-sources-meta">Official ${esc(name)} pages, repositories and package registries, checked <time datetime="${CHECKED}">${CHECKED_HUMAN}</time>. Spotted something out of date? Tell us on <a href="https://github.com/withevergrow/withicons">GitHub</a>.</p>
    <ol>${l.sources.map(([label, url], i) => `<li id="src-${i + 1}"><a href="${esc(url)}" rel="nofollow noopener">${esc(label)}</a> <span class="muted">· ${esc(url.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</span></li>`).join('')}</ol>
  </section>

  <section class="ax-more" aria-label="Related pages">
    ${altLinks(p, LIBS, l.slug)}
    ${freeLinks(p, LANDERS.slice(0, 6), null, 'Free icons for your tools')}
  </section>
  ${cta(p, { title: `Try with icons instead of ${esc(sn)}`, text: `${N} icons, 7 styles, MIT. Nothing to install to start: copy, download or drag.` })}
</div>`

  const ld = [
    { ...webPageLd({ path, name: `${name} alternative: with icons`, description: desc, about: { '@type': 'Thing', name, url: l.url } }), citation: l.sources.map(s => s[1]) },
    faqLd(qs),
  ]
  shell({ path, title, desc, current: '', body, ld, crumbsLd: [['Home', ''], ['Alternatives', 'alternatives/index.html'], [`${name} alternative`, path]], bodyClass: 'ax-alt', modified: CHECKED })
  return { url: '/' + path, title: `${name} alternative`, summary: `${name} vs with icons: licence, price, icon count, styles, frameworks and AI support, with a migration name map. Facts checked ${CHECKED}.` }
}

function hub() {
  const path = 'alternatives/index.html', p = '../'
  const title = `Best free icon library alternatives (${CHECKED.slice(0, 4)}): ${LIBS.length} libraries compared · with icons`
  const desc = `Compare ${LIBS.length} icon libraries side by side: Font Awesome, Material Symbols, Heroicons, Lucide, Phosphor, Tabler, Bootstrap Icons and more. Licence, price, icon count, styles, CSS classes and AI support, checked ${CHECKED_HUMAN}.`
  const cols = [['license', 'Licence'], ['price', 'Price'], ['count', 'Icons'], ['styles', 'Styles'], ['classes', 'CSS classes'], ['ai', 'AI / MCP']]
  const mit = LIBS.filter(l => /^MIT$/.test(l.hub.license)).map(l => l.name)
  const classLibs = LIBS.filter(l => /^Yes/.test(l.hub.classes)).map(l => l.name)
  const qs = [
    ['What is the best free icon library?', `There isn’t one best library; it depends on the job. For brand logos and the classic <code>&lt;i&gt;</code> workflow, <a href="font-awesome.html">Font Awesome</a>. For Material-style apps, <a href="material-symbols.html">Material Symbols</a>. For the largest free MIT stroke set, <a href="tabler.html">Tabler Icons</a>. For one set that works in code, slides and docs, in 7 styles with no credit required, <b>with icons</b>.`],
    ['Which icon libraries are MIT licensed?', `Of the libraries compared here: ${mit.join(', ')} and with icons. Lucide uses ISC, a similar permissive licence. Always check the licence page; the table links to each source.`],
    ['Which icon libraries use CSS classes like Font Awesome?', `${classLibs.join(', ')} and with icons all offer <code>&lt;i class="…"&gt;</code> tags from a stylesheet. Material Symbols uses font ligatures instead, and Heroicons, Feather and Ionicons use SVG, components or a web component.`],
    ['Which icon libraries don’t require attribution?', 'with icons, Heroicons, Lucide, Feather, Phosphor, Bootstrap Icons, Tabler Icons, Ionicons, Remix Icon and Material Symbols don’t ask for visible credit (permissive licences only ask you to keep the licence notice when you redistribute the code). Font Awesome Free and Boxicons are CC BY 4.0, but say the credit already inside their files is enough. Flaticon, Icons8, The Noun Project and Streamline require credit on their free plans.'],
    ['How were these facts checked?', `Each library page lists its sources: the official website, GitHub repository, npm registry and pricing or licence pages, all checked on ${CHECKED_HUMAN}. Counts are given the way each source states them (“over”, “about”).`],
  ]
  const guide = [
    ['You need brand logos or the classic fa- workflow', 'font-awesome'], ['Your app follows Material Design', 'material-symbols'], ['You build with Tailwind CSS', 'heroicons'], ['You use shadcn/ui or want a big stroke set', 'lucide'],
    ['You want six weights, from thin to duotone', 'phosphor'], ['Your site runs on Bootstrap', 'bootstrap-icons'], ['You want the largest free MIT stroke set', 'tabler'], ['You build with Ionic', 'ionicons'],
    ['You want hundreds of sets behind one API', 'iconify'], ['You need an illustrated or very specific icon', 'noun-project'],
  ]
  const by = Object.fromEntries(LIBS.map(l => [l.slug, l]))
  const matrix = `<div class="pg-table-wrap ax-compare"><table class="ax-table ax-matrix">
    <caption class="pg-sr">Icon libraries compared</caption>
    <thead><tr><th scope="col">Library</th>${cols.map(([, h]) => `<th scope="col">${h}</th>`).join('')}</tr></thead>
    <tbody>
      <tr class="ax-us-row"><th scope="row"><a href="${p}icons.html">with icons</a></th>${cols.map(([k]) => `<td>${esc(US_HUB[k])}</td>`).join('')}</tr>
      ${LIBS.map(l => `<tr><th scope="row"><a href="${l.slug}.html">${esc(l.name)}</a></th>${cols.map(([k]) => `<td>${esc(l.hub[k])}</td>`).join('')}</tr>`).join('\n      ')}
    </tbody></table></div>
    <p class="ax-table-note">Summary values, checked <time datetime="${CHECKED}">${CHECKED_HUMAN}</time>. Each library’s page has the full table with numbered links to official sources.</p>`
  const cards = list => `<ul class="ax-cards">${list.map((l, i) => `<li data-reveal style="--d:${i % 4};--g:${cvar(l.color)}"><a class="ax-card" href="${l.slug}.html"><span class="ax-card-ic is-text" aria-hidden="true">${esc(l.mark)}</span><b>${esc(l.name)} alternative</b><span>${esc(strip(l.known)).replace(/^./, c => c.toUpperCase())}</span><span class="ax-card-tags"><span>${esc(l.hub.license)}</span><span>${esc(l.hub.count)}</span></span>${I('arrow-right', 'line', 18, 'ax-card-arr')}</a></li>`).join('')}</ul>`
  const body = `
<div class="ax-page" style="--g:${cvar('line')}">
  <section class="pg-hero ax-hero">
    ${crumbs([['Home', p + 'index.html'], ['Alternatives', null]])}
    <div class="ax-hero-grid">
      <div>
        <p class="pg-eyebrow"><span class="hand">honest comparisons</span></p>
        <h1 class="pg-title ax-title">Best free <span class="pg-hl" style="--g:${cvar('line')}">icon library</span> alternatives</h1>
        ${answer(`We compared <b>${LIBS.length} icon libraries</b> on licence, price, icon count, styles, CSS classes and AI support, using each one’s official sources. Short version: they’re all good at something. <b>with icons</b> is free and MIT, with ${N} icons in 7 styles for code, slides and docs; bigger sets like Font Awesome, Tabler and Material Symbols win on breadth.`)}
      </div>
      <div class="ax-hero-art" aria-hidden="true"><div class="ax-hero-badge s-line">${I('layout-grid', 'duo', 120)}</div><div class="ax-strip">${STYLES.map((s, i) => `<span class="s-${s}" style="--i:${i}">${I(['home', 'search', 'heart', 'star', 'bell', 'settings', 'trash'][i], s, 30)}</span>`).join('')}</div></div>
    </div>
  </section>

  <section aria-labelledby="mx-h">
    <div class="ax-sec-head"><p class="ax-kicker">Compare</p><h2 id="mx-h">${LIBS.length} icon libraries at a glance</h2><p>Click a library for the full side-by-side table, when to choose it, sources and a migration guide.</p></div>
    ${matrix}
  </section>

  <section aria-labelledby="pick-h">
    <div class="ax-sec-head"><p class="ax-kicker">Quick guide</p><h2 id="pick-h">Which icon library should you use?</h2></div>
    <ul class="ax-pickers">${guide.map(([w, s]) => `<li data-reveal><b>${esc(w)}</b><span>Look at <a href="${s}.html">${esc(by[s].name)}</a>.</span></li>`).join('')}<li class="is-us" data-reveal><b>You want one set for code, slides and docs, in 7 styles, with no credit</b><span>That’s <a href="${p}icons.html">with icons</a>.</span></li></ul>
  </section>

  <section aria-labelledby="open-h"><h2 id="open-h" class="ax-h2">Open-source icon libraries</h2>${cards(LIBS.filter(l => l.kind === 'open'))}</section>
  <section aria-labelledby="mk-h"><h2 id="mk-h" class="ax-h2">Marketplaces and aggregators</h2>${cards(LIBS.filter(l => l.kind !== 'open'))}</section>

  ${faqBlock('faq-h', qs)}
  <section class="ax-more" aria-label="Related pages">${freeLinks(p, LANDERS, null, 'Free icons for your tools')}</section>
  ${cta(p)}
</div>`
  const ld = [
    webPageLd({ path, name: 'Best free icon library alternatives', description: desc }),
    { '@type': 'ItemList', name: 'Icon library alternatives', itemListElement: LIBS.map((l, i) => ({ '@type': 'ListItem', position: i + 1, url: `${ORIGIN}/alternatives/${l.slug}.html`, name: `${l.name} alternative` })) },
    faqLd(qs),
  ]
  shell({ path, title, desc, current: '', body, ld, crumbsLd: [['Home', ''], ['Alternatives', path]], bodyClass: 'ax-alt', modified: CHECKED, search: false })
  return { url: '/' + path, title: 'Best free icon library alternatives', summary: desc }
}

export function buildAlternatives() {
  return [hub(), ...LIBS.map(libPage)]
}
