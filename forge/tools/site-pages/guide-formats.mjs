// guides/which-file.html — "Which file should I use?": every download format in plain words, by audience (slides &
// documents, design tools, websites & apps, animation), transparency explained, the moving formats compared and
// quick steps for PowerPoint, Keynote, Google Slides, Canva, Figma and Word. Format names and notes come from the
// export modules (formats.mjs), so this page follows the Download panel.
import { icon, esc, page, write, crumbs, cvar, ORIGIN, askAI, MOTION, N_ICONS, N_STYLES, word, hasStyle, siteExists } from './lib.mjs'
import { wm, motionAssets } from './motion.mjs'
import { FORMATS, fmt, hasFmt, short, seeThrough, chip, GROUPS } from './formats.mjs'
import { P, UI } from './guides-data.mjs'

const I = (n, s = 'line', size = 24, cls = '') => icon(n, s, { size, cls })
const st = s => hasStyle(s) ? s : 'line'
export const WHICH = { slug: 'which-file', app: 'File formats', color: 'blueprint', icon: 'file-image', title: 'Which file should I use?', time: 4 }

// How people reach the formats (site/js/editor.js: the Download area under the preview on every icon page).
const DL = UI('Download')
const chips = ids => ids.filter(hasFmt).map(id => chip(id)).join('')
const guideLink = (slug, text) => siteExists(`guides/${slug}.html`) ? `<a href="${slug}.html">${text}</a>` : ''

// ───────── by audience ─────────
// rows: [where it's going, [format ids], plain why]
const AUD = [
  {
    id: 'for-slides', title: 'Slides & documents', icon: 'monitor', style: 'line', who: 'PowerPoint, Keynote, Google Slides, Word, Google Docs, Notion, email',
    lead: 'A see-through PNG goes into every slide and document app there is. If your app takes SVG, that’s even better: it stays sharp and you can recolour it there.',
    best: ['png', 'PNG at 512 px', 'Works everywhere, with a see-through background. Use 1024 px if the icon fills the slide, 256 px for icons next to text.'],
    rows: [
      ['PowerPoint, Word (Microsoft 365)', ['svg-flat', 'pptx', 'docx'], 'SVG stays sharp and changes colour inside Office. The PowerPoint slide and Word document are ready-made files: open one, copy the icon, paste it into your own.'],
      ['Google Slides, Google Docs', ['png'], 'Google’s apps don’t take SVG files, so use a PNG.'],
      ['Keynote, Pages', ['png', 'pdf'], 'A 1024 px PNG works in every version. A PDF stays sharp at any size.'],
      ['Notion, email, chat', ['png'], 'Small squares: 256 px is plenty. Email signatures: 64 px.'],
      ['Printed handouts', ['pdf'], 'A vector PDF prints razor sharp at any size.'],
      ['A form that refuses PNG', ['jpg'], 'JPG has no see-through background, so pick the colour it will sit on first.'],
      ['Choosing a look with your team', ['pptx-sheet'], 'One deck with this icon in every style, side by side.'],
    ],
  },
  {
    id: 'for-design', title: 'Design tools', icon: 'pen-tool', style: 'duo', who: 'Figma, Canva, Illustrator, Affinity, Sketch, InDesign',
    lead: 'Design tools love vectors. An SVG arrives as real shapes you can resize, recolour and edit.',
    best: ['svg-flat', 'SVG', 'Sharp at any size, with your colours built in. In Figma you can even skip the file: copy the SVG and paste it on the canvas.'],
    rows: [
      ['Figma, Sketch, Framer', ['svg-flat'], 'Drag the file in, or paste the copied SVG. It becomes editable vector layers.'],
      ['Canva', ['svg-flat', 'png'], 'Upload the SVG. Canva recolours the filled styles; for outline styles, pick the colour before you download.'],
      ['Illustrator, Affinity, InDesign', ['pdf', 'svg-flat'], 'Both open as clean vectors. PDF is the safest for print layouts.'],
      ['Older print and sign-making tools', ['eps'], 'Only when they ask for EPS. It has no see-through parts, so it sits on your background colour.'],
      ['Handing off to developers', ['png-set', 'svg'], 'The PNG set has 1x to 4x with a README. The SVG for code keeps colours changeable with CSS.'],
    ],
  },
  {
    id: 'for-web', title: 'Websites & apps', icon: 'globe', style: 'sketch', who: 'Webflow, Framer, Wix, WordPress, your own code, iPhone and Android apps',
    lead: 'On the web, SVG is the smallest and sharpest file you can use. Developers can grab a ready component instead of a file.',
    best: ['svg-flat', 'SVG', 'Upload it to your site builder like any image. Tiny, sharp on every screen, see-through.'],
    rows: [
      ['Webflow, Framer, Wix, Squarespace', ['svg-flat', 'webp'], 'SVG where it’s accepted. Where it isn’t, WebP is a small, see-through picture.'],
      ['Faster pages', ['webp', 'avif'], 'Smaller than PNG and still see-through. AVIF is the smallest, if your browser can make it.'],
      ['The little icon in the browser tab', ['favicon-pack', 'ico'], 'The favicon pack has every size plus the lines to paste into your page.'],
      ['iPhone and iPad apps', ['ios'], 'Drag the folder into Xcode. A vector that tints like Apple’s own symbols.'],
      ['Android apps', ['android'], 'Drop the file into Android Studio. Sharp on every screen, no PNGs needed.'],
      ['Your own code', ['html', 'jsx', 'vue', 'svelte', 'angular', 'react-native', 'css'], 'Ready components and snippets. See the <a href="../developers.html#export">developer docs</a>.'],
    ],
  },
  {
    id: 'for-motion', title: 'Animation', icon: 'film', style: 'kawaii', who: 'moving icons for slides, websites, apps and videos',
    lead: 'Pick a motion (or a Turn into switch) first, then the file that plays where you need it. The moving formats are compared <a href="#compare">further down</a>.',
    best: ['gif', 'GIF', 'Plays almost everywhere: PowerPoint, Google Slides, Keynote, email, Slack, Notion. Pick the background colour it will sit on.'],
    rows: [
      ['Websites and Notion', ['animated-svg'], 'One tiny file that stays sharp at any size and moves on its own.'],
      ['Apps and website builders', ['lottie', 'dotlottie'], 'The animation format apps use. Webflow, Framer and LottieFiles take dotLottie.'],
      ['Keynote, PowerPoint, social posts', ['mp4'], 'A short video that plays on a solid background colour of your choice.'],
      ['Websites, with see-through edges', ['apng', 'webp-animated', 'webm'], 'Smooth edges on any background. They play in web browsers.'],
      ['Video editors and 3D', ['png-sequence', 'webm'], 'Every frame as a see-through PNG for After Effects, Premiere, DaVinci Resolve or Blender.'],
    ],
  },
]

// ───────── moving formats compared ─────────
// [id, where it plays, see-through, sharp when big, size]
const COMPARE = [
  ['animated-svg', 'Websites, Notion, any web browser', 'Yes', 'Yes', 'Tiny'],
  ['gif', 'Everywhere: slides, email, chat, Notion', 'Hard edges', 'No, pick a size', 'Large'],
  ['apng', 'Web browsers (other apps show it standing still)', 'Yes', 'No, pick a size', 'Medium'],
  ['webp-animated', 'Web browsers and apps', 'Yes', 'No, pick a size', 'Small'],
  ['webm', 'Websites, video editors', 'In Chrome and Edge', 'No, pick a size', 'Small'],
  ['mp4', 'Keynote, PowerPoint, social posts, video editors', 'No, solid colour', 'No, pick a size', 'Small'],
  ['lottie', 'iPhone, Android, Flutter and web apps; After Effects', 'Yes', 'Yes', 'Tiny'],
  ['dotlottie', 'LottieFiles, Webflow, Framer, dotLottie players', 'Yes', 'Yes', 'Tiny'],
  ['png-sequence', 'After Effects, Premiere, DaVinci Resolve, Blender, game engines', 'Yes', 'No, pick a size', 'Large'],
]
const QUICK = [
  ['gif', 'In slides or email?', 'GIF', 'bell', 'ring'],
  ['animated-svg', 'On a website?', 'Animated SVG', 'heart', 'beat'],
  ['lottie', 'In an app?', 'Lottie', 'rocket', 'float'],
  ['mp4', 'In a video?', 'MP4', 'star', 'twinkle'],
]

// ───────── app by app ─────────
// [app, guide slug, icon, style, [format ids], steps[]]
const APPS = [
  ['PowerPoint', 'powerpoint', 'chart-bar', 'solid', ['svg-flat', 'pptx', 'gif', 'mp4'], [
    `Download the <b>SVG</b>, then choose ${P('Insert', 'Pictures', 'This Device')}.`,
    `Recolour it: select the icon, then ${P('Graphics Format', 'Graphics Fill')}.`,
    `Moving icon? Insert a <b>GIF</b> the same way, or an <b>MP4</b> with ${P('Insert', 'Video', 'This Device')}.`,
  ]],
  ['Keynote', 'keynote', 'tv', 'duo', ['png', 'pdf', 'mp4', 'gif'], [
    'Download a <b>PNG at 1024 px</b> (or a PDF) and drag it onto the slide.',
    `For a moving icon, drag in an <b>MP4</b> or a <b>GIF</b>. Set the MP4 to loop in ${P('Format', 'Movie')}.`,
    'Give the MP4 the same background colour as your slide before you download it.',
  ]],
  ['Google Slides', 'google-slides', 'monitor', 'line', ['png', 'gif'], [
    'Download a <b>PNG at 512 px</b>.',
    `Choose ${P('Insert', 'Image', 'Upload from computer')}, or drag the file onto the slide.`,
    'Moving icon? Use a <b>GIF</b>: it plays when you present. Videos must come from Google Drive, so GIF is simpler.',
  ]],
  ['Canva', 'canva', 'palette', 'gloss', ['svg-flat', 'png', 'gif', 'mp4'], [
    `Download the <b>SVG</b>, then ${P('Uploads', 'Upload files')}.`,
    'Click the upload to add it. Filled styles change colour from the colour square in the toolbar.',
    'Moving icon? Upload a <b>GIF</b> or an <b>MP4</b> the same way.',
  ]],
  ['Figma', 'figma', 'pen-tool', 'engrave', ['svg-flat', 'gif', 'lottie'], [
    `Press ${UI('Copy SVG')} and paste on the canvas, or drag the <b>SVG</b> file in.`,
    'It arrives as vector layers: change Stroke or Fill in the right panel.',
    'For a moving icon in a prototype, place a <b>GIF</b>: it plays when you present.',
  ]],
  ['Word', 'word-google-docs', 'file-text', 'blueprint', ['svg-flat', 'png', 'docx'], [
    `Download the <b>SVG</b> (Word for Microsoft 365, 2019 or newer) or a <b>PNG</b>, then ${P('Insert', 'Pictures', 'This Device')}.`,
    `Or download the ready <b>Word document</b>, open it and copy the icon into yours.`,
    `Recolour an SVG with ${P('Graphics Format', 'Graphics Fill')}.`,
  ]],
]

const TROUBLE = [
  ['There’s a white box behind my icon.', 'That file has no see-through background: JPG, MP4 and EPS always sit on a solid colour. Download a <b>PNG</b> (still) or a <b>GIF</b> (moving) instead, or pick your slide’s colour as the background before you download.'],
  ['My GIF has a thin white or dark rim.', 'GIFs can only be fully see-through or fully solid, so the soft edges are blended with a background colour. Choose the colour your slide or page uses before you download, and the rim disappears. Or use APNG or animated WebP on websites.'],
  ['My animated SVG stands still in PowerPoint or Google Slides.', 'Slide apps show SVG files as still pictures. Use a <b>GIF</b> (or an <b>MP4</b> in PowerPoint and Keynote).'],
  ['The PowerPoint slide opens, but I can’t change the colour.', 'Changing colours needs PowerPoint for Microsoft 365 or 2019 and newer. In older versions, Keynote or Google Slides the icon shows as a picture: pick the colour before you download.'],
  ['Some formats are missing from the list.', 'A few formats (AVIF, animated WebP, WebM, MP4) are made by your browser, and we only show the ones it can create. Try Chrome or Edge for the full list.'],
  ['The icon looks blurry.', 'A picture (PNG, GIF, MP4) was shown bigger than it was made. Download a bigger size, or use a format that stays sharp: SVG, PDF, Animated SVG or Lottie.'],
]

function heroArt() {
  const cards = [['PNG', 'lightbulb', 'line'], ['SVG', 'rocket', 'duo'], ['GIF', 'bell', st('kawaii')], ['MP4', 'play', st('sticker')], ['PPTX', 'chart-bar', 'solid']]
  return cards.map(([ext, n, s], i) => {
    const m = ext === 'GIF' && MOTION[n] && MOTION[n].loop ? wm(n, s, 46, MOTION[n].loop) : I(n, s, 46)
    return `<span class="wf-card" style="--g:${cvar(s)};--i:${i};--d:${Math.abs(i - 2)}"><b>${ext}</b>${m}<i></i><i></i></span>`
  }).join('')
}

export function buildFormatsGuide() {
  const path = `guides/${WHICH.slug}.html`
  const n = FORMATS.length
  const audNav = AUD.map((a, i) => `<li style="--g:${cvar(st(a.style))};--i:${i}"><a class="wf-go" href="#${a.id}">
        <span class="wf-go-ic" aria-hidden="true">${I(a.icon, st(a.style), 30)}</span>
        <span class="wf-go-t">${a.title}</span>
        <span class="wf-go-who">${esc(a.who)}</span>
        <span class="wf-go-best">Best: <b>${esc(a.best[1])}</b></span>
      </a></li>`).join('\n      ')

  const audSec = (a, i) => {
    const [bid, blabel, bwhy] = a.best, bf = fmt(bid), [bk, bt] = seeThrough(bf)
    return `<section class="wf-aud" id="${a.id}" aria-labelledby="${a.id}-h" style="--g:${cvar(st(a.style))}">
    <div class="wf-aud-head">
      <span class="wf-aud-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
      <h2 id="${a.id}-h" class="g-sec-h">${a.title}</h2>
      <p class="wf-aud-lead">${a.lead}</p>
      <div class="wf-best" data-reveal>
        <span class="wf-best-tag">Best pick</span>
        <span class="wf-best-file" aria-hidden="true"><b>${esc((bf ? bf.ext : 'png').toUpperCase())}</b>${I(a.icon, st(a.style), 34)}</span>
        <p class="wf-best-name">${esc(blabel)}</p>
        <p class="wf-best-why">${bwhy}</p>
        ${bk ? `<span class="wf-see wf-see--${bk}">${bt}</span>` : ''}
      </div>
    </div>
    <ul class="wf-rows">
      ${a.rows.filter(r => r[1].some(hasFmt)).map(([w, ids, why]) => `<li data-reveal><span class="wf-row-where">${w}</span><span class="wf-row-files">${chips(ids)}</span><span class="wf-row-why">${why}</span></li>`).join('\n      ')}
    </ul>
  </section>`
  }

  const seeYes = ['png', 'svg-flat', 'webp', 'avif', 'pdf', 'apng', 'webp-animated', 'animated-svg', 'lottie', 'pptx', 'docx'].filter(id => fmt(id) && fmt(id).transparent === true).map(short)
  const seeNo = FORMATS.filter(f => f.transparent === false).map(f => short(f.id))
  const list = xs => xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs.at(-1)

  const body = `
<div class="g-wrap wf" style="--g:${cvar(WHICH.color)}">
  <section class="g-hero">
    ${crumbs([['Home', '../index.html'], ['How to use', 'index.html'], ['Which file?', null]])}
    <div class="g-hero-grid">
      <div>
        <p class="pg-eyebrow"><span class="hand">a ${WHICH.time}-minute guide</span></p>
        <h1 class="g-title">Which <span class="g-hl">file</span> should I use?</h1>
        <div class="g-short" data-reveal>
          <span class="g-short-tag">Short answer</span>
          <p><b>Slides and documents:</b> PNG. <b>Design tools and websites:</b> SVG. <b>Moving icons:</b> GIF for slides and email, Animated SVG for websites, Lottie for apps, MP4 for video.</p>
        </div>
      </div>
      <div class="wf-hero-art" aria-hidden="true" data-motion-area>${heroArt()}</div>
    </div>
    <dl class="g-meta">
      <div><dt>Time</dt><dd>${WHICH.time} min</dd></div>
      <div><dt>Formats</dt><dd>${n || 'Many'} to choose from</dd></div>
      <div><dt>Where</dt><dd>Every icon page</dd></div>
      <div><dt>Cost</dt><dd>Free</dd></div>
    </dl>
  </section>

  <section class="wf-where" aria-labelledby="wf-where-h">
    <h2 id="wf-where-h" class="g-sec-h">Where is your icon going?</h2>
    <p class="ga-sub">Jump to your answer. Every format is in the ${DL} area under the preview on each icon’s page, in the colour, style and size you chose.</p>
    <ul class="wf-go-list">
      ${audNav}
    </ul>
  </section>

  ${AUD.map(audSec).join('\n\n  ')}

  <section class="wf-clear" id="see-through" aria-labelledby="wf-clear-h" data-clear>
    <div class="wf-clear-copy">
      <h2 id="wf-clear-h" class="g-sec-h">See-through backgrounds, explained</h2>
      <p>A <b>see-through</b> (or <b>transparent</b>) file has no background of its own, so the icon sits cleanly on any slide, photo or page colour. Most of our files are see-through. Three kinds of file aren’t, and one is in between.</p>
      <div class="wf-swatches" role="group" aria-label="Try a slide colour">
        <span class="wf-sw-l" aria-hidden="true">Try a slide colour:</span>
        ${[['Navy', '#1E2A5A', '#fff'], ['Coral', '#E8553D', '#fff'], ['Forest', '#1F6F5C', '#fff'], ['Cream', '#F4EFE6', '#111318']].map(([l, c, k], i) => `<button type="button" data-clear-bg="${c}" data-clear-ink="${k}" aria-pressed="${i === 0}" style="--c:${c}"><span aria-hidden="true"></span>${l}</button>`).join('')}
      </div>
    </div>
    <ul class="wf-clear-demo" style="--slide:#1E2A5A">
      <li data-reveal><span class="wf-slide" aria-hidden="true"><span class="wf-ic wf-ic--clean">${I('star', 'solid', 64)}</span></span>
        <h3><span class="wf-see wf-see--yes">See-through</span></h3>
        <p>${seeYes.length ? list(seeYes) : 'PNG, SVG, WebP, APNG and Lottie'}. The icon sits right on your colour.</p></li>
      <li data-reveal><span class="wf-slide" aria-hidden="true"><span class="wf-ic wf-ic--rim">${I('star', 'solid', 64)}</span></span>
        <h3><span class="wf-see wf-see--edges">Hard edges</span></h3>
        <p><b>GIF</b>. See-through, but soft edges are blended with a colour. Pick your slide’s colour as the background and the rim vanishes.</p></li>
      <li data-reveal><span class="wf-slide" aria-hidden="true"><span class="wf-ic wf-ic--box">${I('star', 'solid', 64)}</span></span>
        <h3><span class="wf-see wf-see--no">Solid background</span></h3>
        <p>${seeNo.length ? list(seeNo) : 'JPG, MP4 and EPS'}. They always fill a box: white, unless you choose your slide’s colour first.</p></li>
    </ul>
    <p class="pg-note wf-clear-note"><b>WebM</b> videos are see-through when made in Chrome or Edge; other browsers record them on your background colour.</p>
  </section>

  <section class="wf-moving" id="compare" aria-labelledby="wf-mov-h">
    <h2 id="wf-mov-h" class="g-sec-h">GIF, APNG, WebM, MP4 or Lottie?</h2>
    <p class="ga-sub">They all move. The difference is where they play, and whether the background stays see-through.</p>
    <ul class="wf-quick" data-motion-area>
      ${QUICK.filter(q => hasFmt(q[0])).map(([id, q, a, n, p], i) => { const s = st(['kawaii', 'duo', 'sticker', 'gloss'][i]); const m = (MOTION[n] && [MOTION[n].loop, MOTION[n].hover].find(x => x && x.preset === p)) || { preset: p }; return `<li style="--g:${cvar(s)}" data-reveal><span class="wf-quick-art" aria-hidden="true">${wm(n, s, 44, m)}</span><span class="wf-quick-q">${q}</span><b>${a}</b></li>` }).join('\n      ')}
    </ul>
    <div class="pg-table-wrap"><table class="pg-table"><thead><tr><th>Format</th><th>Plays in</th><th>See-through</th><th>Sharp when big</th><th>File size</th></tr></thead><tbody>
      ${COMPARE.filter(r => hasFmt(r[0])).map(([id, where, see, sharp, size]) => `<tr><td>${chip(id)}</td><td>${where}</td><td>${see}</td><td>${sharp}</td><td>${size}</td></tr>`).join('\n      ')}
    </tbody></table></div>
    <p class="pg-note">Moving files use the motion you picked on the icon’s ${UI('Motion')} tab, or the switch you set up on ${UI('Turn into')}. Not sure how? Read <a href="animate-icons.html">how to animate an icon</a>.</p>
  </section>

  <section class="wf-apps" aria-labelledby="wf-apps-h">
    <h2 id="wf-apps-h" class="g-sec-h">In your app, step by step</h2>
    <div class="wf-app-grid">
      ${APPS.map(([app, slug, ic, s, ids, steps]) => `<article style="--g:${cvar(st(s))}" data-reveal>
        <header><span class="wf-app-ic" aria-hidden="true">${I(ic, 'line', 22)}</span><h3>${app}</h3></header>
        <p class="wf-app-dl"><span>Download</span>${chips(ids)}</p>
        <ol>${steps.map(x => `<li><span>${x}</span></li>`).join('')}</ol>
        ${guideLink(slug, `Full ${app} guide →`)}
      </article>`).join('\n      ')}
    </div>
  </section>

  ${FORMATS.length ? `<section class="wf-all" id="all-formats" aria-labelledby="wf-all-h">
    <h2 id="wf-all-h" class="g-sec-h">Every format, in one list</h2>
    <p class="ga-sub">All ${n} formats in the ${DL} area, in the same words you’ll see there.</p>
    ${GROUPS.map(([g, title, d, ic]) => { const fs = FORMATS.filter(f => f.group === g); return fs.length ? `<div class="wf-group" data-reveal>
      <div class="wf-group-head"><span class="wf-group-ic" aria-hidden="true">${I(ic, 'line', 22)}</span><h3>${title}</h3><p>${d}</p></div>
      <dl class="wf-fmts">${fs.map(f => { const [k, t] = seeThrough(f); return `<div><dt>${chip(f.id, f.label)}<span class="wf-ext">.${esc(f.ext)}</span></dt><dd>${esc(f.note)}${k && g !== 'code' ? ` <span class="wf-see wf-see--${k}">${t}</span>` : ''}${f.animated && g !== 'animated' ? ' <span class="wf-see wf-see--move">Can move</span>' : ''}</dd></div>` }).join('')}</dl>
    </div>` : '' }).join('\n    ')}
  </section>` : ''}

  <section class="g-trouble" aria-labelledby="tr-h">
    <h2 id="tr-h" class="g-sec-h">Something not working?</h2>
    <div class="g-trouble-list">
      ${TROUBLE.map(([q, a]) => `<details class="pg-qa" data-reveal><summary>${q}</summary><div><p>${a}</p></div></details>`).join('\n      ')}
    </div>
  </section>

  ${askAI({ id: 'ask-h', eyebrow: 'still unsure?', title: 'Ask your AI which file to use', p: '../', attrs: 'data-intent="find"',
    text: 'Click Claude, ChatGPT, Gemini, Perplexity or Grok. We copy a ready brief that points it to our skill file and open it for you. Tell it where the icon is going (“a ringing bell on a Keynote slide”, “the menu of my Framer site”): it picks the icon, the style and the right file, then explains each step.' })}

  <section class="pg-cta" data-reveal>
    <h2>Got it? Pick your icon.</h2>
    <p>${N_ICONS} icons, ${word(N_STYLES)} styles${n ? `, ${n} ways to download` : ''}. All free.</p>
    <a class="btn btn-ink" href="../icons.html">${I('search', 'line', 18)} Browse icons</a>
  </section>
</div>`

  const strip = s => s.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim()
  const ld = [
    { '@type': 'Article', headline: 'Which icon file should I use?', description: 'PNG, SVG, PDF, GIF, APNG, WebM, MP4, Lottie, PowerPoint and more, explained in plain words: which file to download for slides, design tools, websites, apps and animation.', inLanguage: 'en', url: `${ORIGIN}/${path}`, about: ['PNG', 'SVG', 'GIF', 'MP4', 'Lottie', 'transparent background'] },
    { '@type': 'FAQPage', mainEntity: TROUBLE.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: strip(a) } })) },
  ]
  const ma = motionAssets()
  write(path, page({
    path, current: 'guides', title: 'Which icon file should I use? PNG, SVG, GIF, MP4, Lottie explained · with icons', ogTitle: 'Which file should I use?',
    desc: 'PNG, SVG, PDF, GIF, APNG, WebM, MP4, Lottie, PowerPoint and Word files explained in plain words: what to download for slides, design tools, websites, apps and animation, and which ones keep a see-through background.',
    body, ld, crumbsLd: [['Home', ''], ['How to use', 'guides/index.html'], ['Which file?', path]], bodyClass: 'pg-guide pg-which', styles: ma.css, scripts: ma.js,
  }))
  return WHICH.slug
}
