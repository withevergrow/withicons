import { icon, esc, page, write, crumbs, cvar, code, ORIGIN, STYLES, askAI, N_ICONS, N_STYLES, word } from './lib.mjs'
import { GUIDES, GROUPS } from './guides-data.mjs'
import { buildAnimateGuide, ANIMATE } from './guide-animate.mjs'
import { buildFormatsGuide, WHICH } from './guide-formats.mjs'
import { MOTION, PRESETS, hasStyle } from './lib.mjs'
import { wm, motionAssets } from './motion.mjs'

const I = (n, s = 'line', size = 24, cls = '') => icon(n, s, { size, cls })
const bars = n => Array.from({ length: n }, (_, i) => `<span class="mk-ph" style="--w:${[62, 78, 54, 70, 46][i % 5]}%"></span>`).join('')
const cursor = `<span class="mk-cursor" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M5 3.5 L19 12 L12.5 13.5 L9.5 20 Z" fill="#111318" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg></span>`

const TITLES = { slides: 'Presentation', doc: 'Document', notion: 'My page', web: 'yoursite.com', design: 'Untitled design', mail: 'New message' }

function canvas(app, inner, cls = '') {
  switch (app) {
    case 'slides': return `<div class="mk-canvas mk-slides ${cls}"><div class="mk-slide"><span class="mk-h"></span><span class="mk-l"></span><span class="mk-l s"></span><div class="mk-obj">${inner}</div></div></div>`
    case 'doc': case 'notion': return `<div class="mk-canvas mk-doc ${cls}"><div class="mk-page"><span class="mk-h"></span>${bars(2)}<div class="mk-obj">${inner}</div>${bars(2)}</div></div>`
    case 'web': return `<div class="mk-canvas mk-web ${cls}"><div class="mk-site"><span class="mk-nav"><i></i><i></i><i></i></span><div class="mk-obj">${inner}</div><span class="mk-h c"></span><span class="mk-l c"></span></div></div>`
    case 'mail': return `<div class="mk-canvas mk-mail ${cls}"><div class="mk-compose"><span class="mk-field">To</span><span class="mk-field">Subject</span>${bars(2)}<div class="mk-sigline"><span class="mk-sig-name"></span><div class="mk-obj">${inner}</div></div></div></div>`
    default: return `<div class="mk-canvas mk-design ${cls}"><span class="mk-rail">${bars(4)}</span><div class="mk-board"><div class="mk-obj">${inner}</div></div><span class="mk-props">${bars(3)}</span></div>`
  }
}

function frame(ui, g) {
  const app = g.app_ui
  const ic = ui.icon || g.steps[0].ui.icon || g.icon
  const big = I(ic, 'line', 56, 'mk-ic')
  const win = (body, title = TITLES[app], cls = '') => `<div class="mock ${cls}"><div class="mock-bar"><i></i><i></i><i></i><span>${esc(title)}</span></div>${body}</div>`
  switch (ui.k) {
    case 'pick': {
      const pool = [ic, 'star', 'heart', 'bell', 'search', 'camera', 'globe', 'settings', 'user', 'mail', 'map-pin', 'calendar']
      const uniq = [...new Set(pool)].slice(0, 12)
      return win(`<div class="mk-lib"><div class="mk-libmain"><span class="mk-search">${I('search', 'line', 14)}<span class="mk-typed">${esc(ic.replace(/-/g, ' '))}</span></span><div class="mk-grid">${uniq.map((n, i) => `<span class="${i === 0 ? 'is-target' : ''}">${I(n, 'line', 20)}</span>`).join('')}</div></div>
<div class="mk-drawer"><div class="mk-big">${I(ic, 'line', 44)}</div><div class="mk-sw"><i style="--c:#111318"></i><i class="on" style="--c:var(--g)"></i><i style="--c:#FF5A36"></i><i style="--c:#22A861"></i></div><span class="mk-btn">${esc(ui.fmt.startsWith('Copy') ? ui.fmt : 'Download ' + ui.fmt)}</span>${ui.size ? `<span class="mk-size">${esc(ui.size)}</span>` : ''}</div></div>${cursor}`, 'withicons.com', 'mock--pick')
    }
    case 'menu': {
      const [top, second, third] = ui.path
      const bar = ui.bar.map(b => {
        if (b !== top) return `<span>${esc(b)}</span>`
        const sub = third ? `<span class="mk-dd mk-dd2">${`<span class="mk-ph" style="--w:70%"></span>`}<b class="mk-hot">${esc(third)}</b>${bars(2)}</span>` : ''
        return `<span class="mk-open">${esc(b)}<span class="mk-dd"><span class="mk-ph" style="--w:60%"></span><b class="mk-hot${third ? ' has-sub' : ''}">${esc(second)}${sub}</b>${bars(3)}</span></span>`
      }).join('')
      return win(`<div class="mk-menubar">${bar}</div>${canvas(app, '', 'is-dim')}${cursor}`, undefined, 'mock--menu')
    }
    case 'side': {
      return win(`<div class="mk-sidewrap"><div class="mk-siderail"><span class="mk-tab is-hot">${esc(ui.tab)}</span>${bars(3)}</div><div class="mk-sidepanel"><b class="mk-btn">${esc(ui.button)}</b>${bars(2)}<div class="mk-thumbs"><span>${I(ic, 'line', 18)}</span><span></span><span></span></div></div>${canvas(app, '', 'is-dim mk-narrow')}</div>${cursor}`, undefined, 'mock--side')
    }
    case 'drop':
      return win(`${canvas(app, big, 'mk-drop-target')}<span class="mk-file">${I('file-image', 'line', 16)}<span>${esc(ui.file)}</span></span>`, undefined, 'mock--drop')
    case 'place':
      return win(canvas(app, `<span class="mk-sel">${big}</span>`), undefined, 'mock--place')
    case 'paste':
      return win(`${canvas(app, `<span class="mk-sel">${big}</span>`)}<span class="mk-keys"><kbd>Ctrl</kbd><kbd>V</kbd></span>`, undefined, 'mock--paste')
    case 'resize':
      return win(canvas(app, `<span class="mk-sel mk-grow">${big}<i class="h tl"></i><i class="h tr"></i><i class="h bl"></i><i class="h br"></i></span>`), undefined, 'mock--resize')
    case 'recolor':
      return win(`<div class="mk-toolbar"><span class="mk-tlabel">${esc(ui.label)}</span><span class="mk-sw"><i style="--c:#2F5BFF"></i><i style="--c:#FF5A36"></i><i style="--c:#7B5CFF"></i><i style="--c:#22A861"></i></span></div>${canvas(app, `<span class="mk-sel mk-tint">${big}</span>`)}`, undefined, 'mock--recolor')
    case 'code':
      return win(`<div class="mk-code"><pre>${ui.lines.map((l, i) => `<span style="--i:${i}">${esc(l) || ' '}</span>`).join('\n')}</pre><div class="mk-preview">${I(ic, 'line', 36)}<span class="mk-l"></span></div></div>`, 'index.html', 'mock--code')
    case 'inline':
      return win(`<div class="mk-canvas mk-doc"><div class="mk-page"><span class="mk-h"></span><p class="mk-text"><span class="mk-word" style="--w:28%"></span>${I(ic, 'line', 14, 'mk-inl')}<span class="mk-word" style="--w:40%"></span></p><p class="mk-text"><span class="mk-word" style="--w:52%"></span>${I(ic, 'line', 14, 'mk-inl')}<span class="mk-word" style="--w:22%"></span></p>${bars(2)}</div></div>`, undefined, 'mock--inline')
    case 'notion-icon':
      return win(`<div class="mk-canvas mk-doc"><div class="mk-page mk-notion"><span class="mk-pageicon">${I(ic, 'line', 40)}</span><span class="mk-h"></span>${bars(3)}</div></div>`, undefined, 'mock--place')
    case 'callout':
      return win(`<div class="mk-canvas mk-doc"><div class="mk-page"><span class="mk-h"></span>${bars(1)}<div class="mk-callout">${I(ic, 'line', 20, 'mk-ic')}<span class="mk-ph" style="--w:70%"></span></div>${bars(2)}</div></div>`, undefined, 'mock--place')
    case 'mailsig':
      return win(`<div class="mk-canvas mk-mail"><div class="mk-compose"><span class="mk-field">Signature</span><div class="mk-sigline big"><span class="mk-sig-name"></span><div class="mk-sigicons">${['phone', 'mail', 'globe', 'map-pin'].map(n => I(n, 'line', 16)).join('')}</div></div></div></div>`, undefined, 'mock--sig')
    default: // done
      return win(canvas(app, `<span class="mk-final">${I(ic, 'duo', 56, 'mk-ic')}<span class="mk-spark">${I('sparkles', 'solid', 18)}</span></span>`), undefined, 'mock--done')
  }
}

function guidePage(g) {
  const path = `guides/${g.slug}.html`
  const color = cvar(g.color)
  const rel = g.related.map(s => GUIDES.find(x => x.slug === s))
  const stepsHtml = g.steps.map((s, i) => `<li class="g-step" data-step="${i}">
      <div class="g-step-num" aria-hidden="true">${i + 1}</div>
      <div class="g-step-body"><h3>${s.t}</h3><p>${s.d}</p></div>
      <div class="g-step-art" aria-hidden="true">${frame(s.ui, g)}</div>
    </li>`).join('\n    ')
  const stage = g.steps.map((s, i) => `<div class="g-frame${i === 0 ? ' is-on' : ''}" data-frame="${i}">${frame(s.ui, g)}</div>`).join('')
  const howto = {
    '@type': 'HowTo', name: g.title, description: g.desc, totalTime: `PT${g.time}M`, inLanguage: 'en',
    tool: [{ '@type': 'HowToTool', name: g.app }],
    supply: [{ '@type': 'HowToSupply', name: `A free icon from with icons (${g.format.best})` }],
    step: g.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.t, text: s.d.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim(), url: `${ORIGIN}/${path}#step-${i + 1}` })),
  }
  const body = `
<div class="g-wrap" style="--g:${color}">
  <section class="g-hero">
    ${crumbs([['Home', '../index.html'], ['How to use', 'index.html'], [g.app, null]])}
    <div class="g-hero-grid">
      <div>
        <p class="pg-eyebrow"><span class="hand">a ${g.time}-minute guide</span></p>
        <h1 class="g-title">${esc(g.title).replace(esc(g.app), `<span class="g-hl">${esc(g.app)}</span>`)}</h1>
        <div class="g-short" data-reveal>
          <span class="g-short-tag">Short answer</span>
          <p>${g.short}</p>
        </div>
      </div>
      <div class="g-hero-art" aria-hidden="true">
        <div class="g-badge">${I(g.icon, 'line', 64)}${I(g.icon, 'solid', 64)}</div>
        <span class="g-orbit o1">${I('image', 'line', 22)}</span>
        <span class="g-orbit o2">${I('palette', 'line', 22)}</span>
        <span class="g-orbit o3">${I('maximize', 'line', 22)}</span>
      </div>
    </div>
    <dl class="g-meta">
      <div><dt>Time</dt><dd>${g.time} min</dd></div>
      <div><dt>Download</dt><dd>${g.format.best}</dd></div>
      <div><dt>Size</dt><dd>${g.format.size}</dd></div>
      <div><dt>Cost</dt><dd>Free</dd></div>
    </dl>
  </section>

  <section class="g-format" data-reveal aria-labelledby="fmt-h">
    <div class="g-format-file" aria-hidden="true"><span class="g-file"><b>${g.format.best.split(' ')[0]}</b>${I(g.icon, 'line', 40)}</span></div>
    <div>
      <h2 id="fmt-h">Which file should I download?</h2>
      <p class="g-format-pick"><b>${esc(g.format.best)}</b>${g.format.size && !/any|copy/.test(g.format.size) ? ` · <b>${esc(g.format.size)}</b>` : ''}</p>
      <p>${g.format.why}</p>
    </div>
  </section>

  <section class="g-steps-sec" aria-labelledby="steps-h">
    <h2 id="steps-h" class="g-sec-h">Step by step</h2>
    <div class="g-steps-grid" data-steps>
      <ol class="g-steps">
    ${stepsHtml.replace(/<li class="g-step" data-step="(\d+)">/g, (m, i) => `<li class="g-step" data-step="${i}" id="step-${+i + 1}">`)}
      </ol>
      <div class="g-stage" aria-hidden="true"><div class="g-stage-inner">${stage}<div class="g-stage-dots">${g.steps.map((_, i) => `<i${i === 0 ? ' class="is-on"' : ''}></i>`).join('')}</div></div></div>
    </div>
  </section>

  <section class="g-tips" aria-label="Colour and size">
    <article class="g-tip g-tip--color" data-reveal>
      <div class="g-tip-art" aria-hidden="true">${['line', 'solid', 'duo'].map((s, i) => `<span style="--d:${i}">${I(g.icon, 'line', 34)}</span>`).join('')}</div>
      <h2>How to change the colour</h2>
      <p>${g.recolor}</p>
    </article>
    <article class="g-tip g-tip--size" data-reveal>
      <div class="g-tip-art" aria-hidden="true">${[18, 28, 40].map((n, i) => `<span style="--d:${i}">${I(g.icon, 'line', n)}</span>`).join('')}</div>
      <h2>How to resize it</h2>
      <p>${g.resize}</p>
    </article>
  </section>

  <section class="g-trouble" aria-labelledby="tr-h">
    <h2 id="tr-h" class="g-sec-h">Something not working?</h2>
    <div class="g-trouble-list">
      ${g.trouble.map(([q, a]) => `<details class="pg-qa" data-reveal><summary>${q}</summary><div><p>${a}</p></div></details>`).join('\n      ')}
    </div>
  </section>

  <section class="g-related" aria-labelledby="rel-h">
    <h2 id="rel-h" class="g-sec-h">Related guides</h2>
    <div class="g-related-row">
      ${rel.map(r => `<a class="g-rel" href="${r.slug}.html" style="--g:${cvar(r.color)}">${I(r.icon, 'line', 28)}<span>${esc(r.app)}</span><b aria-hidden="true">→</b></a>`).join('')}
      <a class="g-rel g-rel--all" href="index.html">${I('layout-grid', 'line', 28)}<span>All guides</span><b aria-hidden="true">→</b></a>
    </div>
  </section>

  ${askAI({ id: 'ask-h', eyebrow: 'a shortcut', title: `Stuck? Let your AI help in ${esc(g.app)}`, p: '../', attrs: `data-intent="slides" data-app="${g.slug}"`,
    text: `Click Claude, ChatGPT, Gemini, Perplexity or Grok. We copy a ready brief (“help me add an icon to my ${esc(g.app)} project”) that points it to our skill file and this guide, and open it for you. Tell it what the icon is for: it finds the right one, then walks you through adding, recolouring and sizing it.` })}

  <section class="pg-cta" data-reveal>
    <h2>Ready? Find your icon.</h2>
    <p>${N_ICONS} icons, ${word(N_STYLES)} styles, all free.</p>
    <a class="btn btn-ink" href="../icons.html">${I('search', 'line', 18)} Browse icons</a>
  </section>
</div>`
  write(path, page({
    path, current: 'guides', title: `${g.title} (free, step by step) · with icons`, ogTitle: g.title, desc: g.desc, body,
    ld: [howto], crumbsLd: [['Home', ''], ['How to use', 'guides/index.html'], [g.app, path]], bodyClass: 'pg-guide',
  }))
}

function indexPage() {
  const path = 'guides/index.html'
  const helper = GUIDES.map(g => ({ slug: g.slug, app: g.app, best: g.format.best, size: g.format.size, why: g.format.why.split('. ')[0] + '.' }))
  const body = `
<div class="gi">
  <section class="gi-hero">
    ${crumbs([['Home', '../index.html'], ['How to use', null]])}
    <h1 class="gi-title">Use <span class="logo-with">with</span> icons <span class="gi-any"><span>anywhere</span><svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true"><path d="M4 16 C 60 6, 120 22, 180 12 S 270 8, 296 14" /></svg></span></h1>
    <p class="gi-lede">Slides, documents, design tools, websites, even your email signature. Pick where you’re working and follow the steps. No design skills needed.</p>
    <div class="gi-hero-art" aria-hidden="true">
      ${[['monitor', 'line'], ['file-text', 'blueprint'], ['palette', 'gloss'], ['globe', 'duo'], ['mail', 'solid'], ['pen-tool', 'engrave'], ['sticky-note', 'sketch']].map(([n, s], i) => `<span class="gi-fly" style="--i:${i};--g:${cvar(s)}">${I(n, 'line', 26)}</span>`).join('')}
    </div>
  </section>

  <section class="gi-feature" aria-labelledby="feat-h" data-reveal style="--g:${cvar(ANIMATE.color)}">
    <div class="gi-feature-art" aria-hidden="true" data-motion-area>${['bell', 'heart', 'star'].filter(n => MOTION[n] && MOTION[n].loop).map((n, i) => { const s = [hasStyle('kawaii') ? 'kawaii' : 'duo', 'solid', hasStyle('sticker') ? 'sticker' : 'gloss'][i]; return `<span style="--g:${cvar(s)}">${wm(n, s, 44, MOTION[n].loop)}</span>` }).join('')}</div>
    <div class="gi-feature-copy">
      <span class="gi-feature-tag">New</span>
      <h2 id="feat-h">Make an icon move</h2>
      <p>Bells that ring, hearts that beat: pick from ${PRESETS.length} motions, then download an animated SVG for your website or a GIF for your slides. No code.</p>
    </div>
    <a class="btn btn-ink" href="${ANIMATE.slug}.html">Animate an icon <svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
  </section>

  <section class="gi-helper" data-reveal aria-labelledby="helper-h">
    <div>
      <h2 id="helper-h">Not sure which file to download?</h2>
      <p>Tap where your icon is going. For GIF, MP4, Lottie, PowerPoint and every other format, read <a href="${WHICH.slug}.html">which file should I use?</a></p>
    </div>
    <div class="gi-helper-btns" role="group" aria-label="Where is the icon going?">
      ${GUIDES.map((g, i) => `<button type="button" data-helper="${i}"${i === 0 ? ' aria-pressed="true"' : ' aria-pressed="false"'} style="--g:${cvar(g.color)}">${esc(g.app)}</button>`).join('')}
    </div>
    <output class="gi-helper-out" aria-live="polite" data-helper-out>
      <span class="gi-helper-file"><b>${esc(GUIDES[0].format.best)}</b></span>
      <span><b>${esc(GUIDES[0].format.best)}${/any|copy/.test(GUIDES[0].format.size) ? '' : ' · ' + esc(GUIDES[0].format.size)}</b> ${esc(helper[0].why)} <a href="${GUIDES[0].slug}.html">Open the guide →</a></span>
    </output>
    <script type="application/json" data-helper-data>${JSON.stringify(helper).replace(/</g, '\\u003c')}</script>
  </section>

  <section class="gi-list" aria-labelledby="all-h">
    <div class="gi-list-head">
      <h2 id="all-h">All guides</h2>
      <div class="gi-filters" role="group" aria-label="Filter guides">
        ${GROUPS.map(([k, l], i) => `<button type="button" data-filter="${k}" aria-pressed="${i === 0}">${l}</button>`).join('')}
      </div>
    </div>
    <ul class="gi-grid" data-guide-grid>
      ${GUIDES.map((g, i) => `<li data-group="${g.group}" style="--g:${cvar(g.color)};--i:${i}">
        <a class="gi-card" href="${g.slug}.html">
          <span class="gi-card-art" aria-hidden="true"><span class="gi-swap">${I(g.icon, 'line', 44)}${I(g.icon, 'solid', 44)}</span></span>
          <span class="gi-card-app">${esc(g.app)}</span>
          <span class="gi-card-short">${esc(g.title.replace(/^How to /, '').replace(/^./, c => c.toUpperCase()))}</span>
          <span class="gi-card-meta"><span>${esc(g.format.best)}</span><span>${g.time} min</span></span>
        </a>
      </li>`).join('\n      ')}
    </ul>
  </section>

  <section class="gi-basics" aria-labelledby="basics-h">
    <h2 id="basics-h" class="g-sec-h">Three things worth knowing</h2>
    <div class="gi-basics-grid">
      <article data-reveal style="--g:${cvar('line')}">
        <div class="gi-b-art" aria-hidden="true"><span class="gi-file-chip">SVG</span><span class="gi-file-chip png">PNG</span></div>
        <h3>SVG or PNG?</h3>
        <p><b>SVG</b> stays sharp at any size and can often be recoloured inside the app. <b>PNG</b> is a normal picture that works everywhere. If the app takes SVG, use it. If not, use a PNG at least twice the size you’ll show it. GIF, MP4 or Lottie? <a href="${WHICH.slug}.html">See every format</a>.</p>
      </article>
      <article data-reveal style="--g:${cvar('solid')}">
        <div class="gi-b-art gi-b-colors" aria-hidden="true">${['#2F5BFF', '#FF5A36', '#7B5CFF', '#22A861'].map(c => `<span style="color:${c}">${I('heart', 'solid', 30)}</span>`).join('')}</div>
        <h3>Choose the colour first</h3>
        <p>Many apps can’t recolour a PNG. Pick your colour in the library before you download, and you’ll never have to fix it later.</p>
      </article>
      <article data-reveal style="--g:${cvar('sketch')}">
        <div class="gi-b-art gi-b-size" aria-hidden="true">${[16, 24, 36, 52].map(n => I('star', 'line', n)).join('')}</div>
        <h3>Keep sizes consistent</h3>
        <p>Icons look most professional when they’re all the same size and the same style. Pick one style (Line is a safe bet) and stick with it.</p>
      </article>
    </div>
  </section>

  ${askAI({ id: 'ask-h', eyebrow: 'or skip the reading', title: 'Ask your AI instead', p: '../',
    attrs: 'data-intent="find"',
    text: 'Click Claude, ChatGPT, Gemini, Perplexity or Grok. We copy a ready brief that points it to our skill file and open the assistant. Tell it what the icon is for and where it’s going (“a savings slide in Google Slides”, “our WordPress menu”): it picks the best icon, two alternatives and the right style, then explains each step.' })}

  <section class="pg-cta" data-reveal>
    <h2>Don’t see your app?</h2>
    <p>Almost every app accepts PNG. Download one at 512 px and insert it like any picture. Still stuck? <a href="../faq.html">Read the FAQ</a>.</p>
    <a class="btn btn-ink" href="../icons.html">${I('search', 'line', 18)} Browse icons</a>
  </section>
</div>`
  const ld = [{ '@type': 'CollectionPage', name: 'Use with icons anywhere', description: 'Step-by-step guides for adding free icons to slides, documents, design tools, websites and email signatures.', url: ORIGIN + '/' + path, hasPart: [...GUIDES, ANIMATE, WHICH].map(g => ({ '@type': 'HowTo', name: g.title, url: `${ORIGIN}/guides/${g.slug}.html` })) }]
  write(path, page({ path, current: 'guides', title: 'How to use free icons in Slides, Canva, Word, websites and more · with icons', ogTitle: 'Use with icons anywhere', desc: 'Simple, illustrated guides for adding free icons to Google Slides, PowerPoint, Keynote, Canva, Figma, Docs, Word, Notion, WordPress, Webflow, Framer, Wix, Squarespace, email signatures and HTML.', body, ld, crumbsLd: [['Home', ''], ['How to use', path]], bodyClass: 'pg-guides', styles: motionAssets().css, scripts: motionAssets().js }))
}

export function buildGuides() {
  GUIDES.forEach(guidePage)
  const extra = [buildAnimateGuide(), buildFormatsGuide()]
  indexPage()
  return [...GUIDES.map(g => g.slug), ...extra]
}
