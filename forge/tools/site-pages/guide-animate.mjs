// guides/animate-icons.html — beginner guide: animate an icon for a website, Notion or slides.
// Matches the Customize editor on icon pages (site/js/editor.js: Motion tab, "Animated SVG" download).
import { icon, esc, page, write, crumbs, cvar, code, ORIGIN, askAI, MOTION, PRESETS, N_ICONS, N_STYLES, word, hasStyle, siteExists } from './lib.mjs'
import { wm, demoFor, motionAssets } from './motion.mjs'
import { ICON_NAMES, EFFECTS, styleTitle } from './lib.mjs'
import { hasFmt } from './formats.mjs'
const ICON_SET = new Set(ICON_NAMES)

const I = (n, s = 'line', size = 24, cls = '') => icon(n, s, { size, cls })
export const ANIMATE = { slug: 'animate-icons', app: 'Animated icons', color: 'duo', icon: 'sparkles', title: 'How to animate an icon (no code needed)', time: 4 }

export function buildAnimateGuide() {
  const path = `guides/${ANIMATE.slug}.html`, p = '../'
  const st = s => hasStyle(s) ? s : 'line'
  // the eight motions beginners reach for, each shown on the icon it suits best
  // each motion on the icon it suits best, with that icon's own pivot/direction when its spec uses the preset
  const mFor = (n, k) => { if (!MOTION[n] && !ICON_SET.has(n)) return demoFor(k); const sp = MOTION[n] || {}; const m = [sp.loop, sp.hover, ...(sp.alt || [])].find(x => x && x.preset === k); return { name: n, m: m ? { ...m } : { preset: k } } }
  const loved = [['ring', 'Ring', 'for notifications', 'bell'], ['beat', 'Heartbeat', 'for likes and love', 'heart'], ['spin', 'Spin', 'for loading', 'loader'], ['float', 'Float', 'for calm, dreamy things', 'cloud'], ['twinkle', 'Twinkle', 'for magic and new', 'star'], ['bounce', 'Bounce', 'for “look here”', 'package'], ['nudge', 'Nudge', 'for “go this way”', 'arrow-right'], ['tada', 'Ta-da', 'for wins and rewards', 'trophy']]
    .filter(([k]) => PRESETS.some(x => x[0] === k)).map(([k, l, why, n], i) => ({ k, l, why, d: mFor(n, k), s: ['line', 'solid', 'duo', 'kawaii', 'sticker', 'glass', 'gloss', 'retro'].map(st)[i] }))
  const heroIcons = ['bell', 'heart', 'star', 'rocket'].filter(n => MOTION[n] && MOTION[n].loop)
  const steps = [
    ['Open the icon you want', `Find it in <a href="${p}icons.html">the library</a> (search in your own words, like “notification”) and open its page.`, 'search', null],
    ['Go to Customize, then Motion', 'On the icon’s page, open the <b class="ui">Customize</b> panel and its <b class="ui">Motion</b> tab. You’ll see a sentence describing how this icon likes to move.', 'sliders', null],
    ['Choose when it moves', '<b class="ui">Always</b> keeps it moving gently, <b class="ui">On hover</b> plays when someone points at it, and <b class="ui">Once</b> plays a single time. For a file you upload as an image, pick <b>Always</b> or <b>Once</b>.', 'clock', null],
    ['Pick how it moves', 'The icon’s own motion is already selected. Hover the others to preview them, then use the <b class="ui">Speed</b> and <b class="ui">Intensity</b> sliders until it feels right. Calm is usually better.', 'wand', null],
    ['Download it', `Choose your colour and style on the <b class="ui">Look</b> tab, then pick a moving file in the <b class="ui">Download</b> area: <b>Animated SVG</b> for a website or Notion (one small file, for example <code>bell-animated-ring.svg</code>), <b>GIF</b> for slides and email${hasFmt('mp4') ? ', <b>MP4</b> for Keynote, PowerPoint and video' : ''}${hasFmt('lottie') ? ', <b>Lottie</b> for apps' : ''}. <a href="which-file.html#for-motion">Which one?</a>`, 'download', null],
  ]
  // Turn into: before -> after, each side with its own style and colour (site/js/editor.js "Turn into" tab)
  const turn = [
    ['Like', 'heart', 'line', '#6B7280', 'heart', 'solid', '#E5484D', 'scale'],
    ['Play and pause', 'play', 'line', '#2F5BFF', 'pause', 'solid', '#2F5BFF', 'flip'],
    ['Light and dark', 'sun', 'duo', '#F59E0B', 'moon', 'duo', '#6D5BD0', 'spin'],
    ['Alerts on and off', 'bell', 'solid', '#0E9F6E', 'bell-off', 'line', '#6B7280', 'morph'],
  ].filter(t => ICON_SET.has(t[1]) && ICON_SET.has(t[4]) && hasStyle(t[2]) && hasStyle(t[5]))
    .map(([label, a, as, ac, b, bs, bc, fx]) => ({ label, a, as, ac, b, bs, bc, fx: EFFECTS.includes(fx) ? fx : 'fade' }))
  const fxName = fx => fx.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase())
  const turnSteps = [
    ['Open the Turn into tab', 'It sits next to <b class="ui">Look</b> and <b class="ui">Motion</b> in the icon’s Customize panel.'],
    ['Pick what it turns into', 'Choose a suggested partner (play and pause, eye and eye-off, menu and close) or search for any other icon.'],
    ['Style the before and after', 'The first icon (before) uses the style and colours from the <b class="ui">Look</b> tab. The second (after) can wear the same colours, or its own style, colour and palette: a grey outline heart can turn into a solid red one.'],
    ['Choose the effect and the timing', `Pick how it switches (${EFFECTS.slice(0, 6).map(fxName).join(', ')} and more), how fast (<b>Snappy</b>, <b>Smooth</b> or <b>Slow</b>) and when: on <b>Click or tap</b>, on <b>Hover</b>, on <b>Focus</b>, or <b>On its own</b>, pausing on each icon.`],
    ['Download or copy it', 'Moving files (Animated SVG, GIF, MP4, Lottie and the rest) can’t feel a click, so they switch back and forth on their own. Copied code keeps the trigger you chose.'],
  ]
  const where = [
    ['globe', 'Website builders', 'Upload the animated SVG wherever you add an image: Webflow, Framer, Wix and Squarespace all accept SVG files. It plays in every modern browser.', 'webflow'],
    ['code', 'Plain HTML', 'Use it like any picture: <code>&lt;img src="bell-animated-ring.svg" alt="" width="48" height="48"&gt;</code>. Want it to react on hover? Paste the SVG code into the page instead of using <code>&lt;img&gt;</code>.', 'html'],
    ['sticky-note', 'Notion', 'Add an image block (not the page icon) and upload the animated SVG. In the browser and the desktop app it keeps moving. If a mobile app shows it standing still, upload the GIF instead.', 'notion'],
    ['layout-dashboard', 'WordPress', 'WordPress blocks SVG uploads unless a plugin allows them. The simplest route: add a <b class="ui">Custom HTML</b> block and paste the SVG code.', 'wordpress'],
  ]
  const slides = [
    ['PowerPoint', 'powerpoint', 'Insert the SVG (or PNG), select it, open <b class="ui">Animations</b> and pick an <b>Emphasis</b> effect such as <b>Pulse</b>, <b>Spin</b> or <b>Teeter</b>. In <b class="ui">Effect Options › Timing</b>, set <b>Repeat</b> to <b>Until End of Slide</b> for a loop.'],
    ['Google Slides', 'google-slides', 'Insert the PNG, select it, then choose <b class="ui">Insert › Animation</b>. Pick <b>Spin</b>, <b>Zoom in</b> or <b>Fade in</b> and set it to start <b>After previous</b>.'],
    ['Keynote', 'keynote', 'Select the icon, open the <b class="ui">Animate</b> sidebar, choose <b class="ui">Action</b> and add an effect such as <b>Pulse</b> or <b>Jiggle</b>.'],
    ['Canva', 'canva', 'Select the icon and click <b class="ui">Animate</b> in the toolbar above your design, then pick an effect for the element.'],
  ]
  const trouble = [
    ['My animated SVG stands still in PowerPoint or Google Slides.', 'Slide apps show SVG files as still pictures. Download a <b>GIF</b> instead, or add the app’s own animation (see “In slides” above).'],
    ['The GIF has a white rim or box around it.', 'GIFs can’t have soft see-through edges, so the edges are blended with a background colour. Before you download, choose your slide’s colour as the background and the rim disappears. <a href="which-file.html#see-through">See-through backgrounds, explained</a>.'],
    ['My MP4 sits in a coloured box.', 'Videos can’t be see-through. Pick your slide’s background colour before downloading, or use a GIF.'],
    ['The Turn into switch doesn’t happen in my file.', 'Check that you downloaded a moving file (Animated SVG, GIF, MP4, Lottie): they play the switch back and forth by themselves. A plain SVG or PNG shows only the first icon.'],
    ['The switch is too fast or too slow.', 'On the Turn into tab, try <b>Slow</b> for a calm change or <b>Snappy</b> for buttons. When it switches on its own, a longer pause on each icon makes it easier to follow.'],
    ['It doesn’t move on my website.', 'Check the file name contains “animated” (the plain SVG doesn’t move). Some builders turn uploads into PNGs; if so, paste the SVG code into an HTML or embed block instead. Also check your device: if <b>reduce motion</b> is turned on, the icon politely stays still.'],
    ['“On hover” never plays.', 'Hover only works when the SVG code is in the page itself. An uploaded image can’t see the mouse, so choose <b>Always</b> or <b>Once</b> for uploads.'],
    ['It’s too fast or too much.', 'Go back to Motion and lower <b>Speed</b> and <b>Intensity</b>, or try a calmer move like Float, Breathe or Pulse.'],
    ['WordPress says “Sorry, you are not allowed to upload this file type”.', 'That’s WordPress blocking SVG uploads. Paste the SVG code into a Custom HTML block, or install an SVG-upload plugin you trust.'],
  ]
  const ma = motionAssets()
  const body = `
<div class="g-wrap ga" style="--g:${cvar(ANIMATE.color)}">
  <section class="g-hero">
    ${crumbs([['Home', '../index.html'], ['How to use', 'index.html'], ['Animate an icon', null]])}
    <div class="g-hero-grid">
      <div>
        <p class="pg-eyebrow"><span class="hand">a ${ANIMATE.time}-minute guide</span></p>
        <h1 class="g-title">How to <span class="g-hl">animate</span> an icon</h1>
        <div class="g-short" data-reveal>
          <span class="g-short-tag">Short answer</span>
          <p>Open any icon, go to <b>Customize › Motion</b> and choose how it moves, or use <b>Turn into</b> to make it switch to another icon. Then download an <b>Animated SVG</b> for websites and Notion, a <b>GIF</b> for slides and email${hasFmt('mp4') ? ', or an <b>MP4</b> for video' : ''}. No code, no account.</p>
        </div>
      </div>
      <div class="ga-hero-art" aria-hidden="true" data-motion-area>
        ${heroIcons.map((n, i) => { const s = st(['duo', 'kawaii', 'sticker', 'glass'][i]); return `<span class="ga-hero-ic" style="--g:${cvar(s)};--i:${i}">${wm(n, s, 64, MOTION[n].loop)}</span>` }).join('')}
      </div>
    </div>
    <dl class="g-meta">
      <div><dt>Time</dt><dd>${ANIMATE.time} min</dd></div>
      <div><dt>Download</dt><dd>${['Animated SVG', 'GIF', hasFmt('mp4') && 'MP4', hasFmt('lottie') && 'Lottie'].filter(Boolean).join(', ')}</dd></div>
      <div><dt>Plays in</dt><dd>Websites, Notion, slides</dd></div>
      <div><dt>Cost</dt><dd>Free</dd></div>
    </dl>
  </section>

  <section class="ga-pick" aria-labelledby="ga-pick-h">
    <h2 id="ga-pick-h" class="g-sec-h">First, which motion?</h2>
    <p class="ga-sub">Pick the one that says what the icon means. Every icon already comes with its own, and all of them work in every one of the ${word(N_STYLES)} styles.</p>
    <ul class="ga-loved" data-motion-area>
      ${loved.map((m, i) => `<li style="--g:${cvar(m.s)};--i:${i}" data-reveal><span class="ga-loved-art" aria-hidden="true">${wm(m.d.name, m.s, 44, m.d.m)}</span><b>${m.l}</b><span>${m.why}</span></li>`).join('\n      ')}
    </ul>
    <p class="pg-note">That’s 8 of ${PRESETS.length}. See them all moving on the <a href="../developers.html#motion-presets">animations page</a>.</p>
  </section>

  <section class="ga-steps-sec" aria-labelledby="ga-steps-h">
    <h2 id="ga-steps-h" class="g-sec-h">Step by step</h2>
    <ol class="ga-steps">
      ${steps.map(([t, d, ic], i) => `<li id="step-${i + 1}" data-reveal style="--d:${i}"><span class="ga-step-n" aria-hidden="true">${i + 1}</span><span class="ga-step-ic" aria-hidden="true">${I(ic, 'duo', 26)}</span><div><h3>${t}</h3><p>${d}</p></div></li>`).join('\n      ')}
    </ol>
  </section>

${turn.length ? `  <section class="ga-turn" id="turn-into" aria-labelledby="ga-turn-h">
    <h2 id="ga-turn-h" class="g-sec-h">Turn one icon into another</h2>
    <p class="ga-sub">Play becomes pause, an empty heart fills up red, the sun sets into a moon. On the <b class="ui">Turn into</b> tab, an icon switches to another one, and each side keeps its own style and colours. Try it:</p>
    <div class="ga-turn-demo" data-swap-demo data-motion-area>
      <ul class="ga-pairs">
        ${turn.map((t, i) => `<li style="--i:${i}"><button type="button" class="ga-pair" data-swap-toggle aria-pressed="false" aria-label="${esc(`${t.label}: switch ${t.a.replace(/-/g, ' ')} (${styleTitle(t.as)}) to ${t.b.replace(/-/g, ' ')} (${styleTitle(t.bs)})`)}">
          <span class="ga-pair-stage"><span class="wm-swap wm-fx-${t.fx}" data-fx="${t.fx}"><span class="wm-a" style="color:${t.ac};--with-duo:${t.ac}">${I(t.a, t.as, 52)}</span><span class="wm-b" style="color:${t.bc};--with-duo:${t.bc}">${I(t.b, t.bs, 52)}</span></span></span>
          <span class="ga-pair-t">${esc(t.label)}</span>
          <span class="ga-pair-ba" aria-hidden="true"><span><i style="background:${t.ac}"></i>${styleTitle(t.as)}</span><b>→</b><span><i style="background:${t.bc}"></i>${styleTitle(t.bs)}</span></span>
          <span class="ga-pair-fx" aria-hidden="true">${fxName(t.fx)}</span>
        </button></li>`).join('\n        ')}
      </ul>
      <div class="ga-turn-ctl">
        <span class="ga-turn-l" id="ga-speed-l">How long the switch takes</span>
        <div class="mo-seg" role="group" aria-labelledby="ga-speed-l">${[['0.6', 'Snappy'], ['1', 'Smooth'], ['1.8', 'Slow']].map(([v, l]) => `<button type="button" data-swap-speed="${v}" aria-pressed="${v === '1'}">${l}</button>`).join('')}</div>
        <p class="ga-turn-hint">${I('cursor', 'line', 16)} <span>Click or tap an icon to switch it.</span></p>
      </div>
    </div>
    <ol class="ga-turn-steps">
      ${turnSteps.map(([t, d], i) => `<li data-reveal style="--d:${i}"><span class="ga-step-n" aria-hidden="true">${i + 1}</span><div><h3>${t}</h3><p>${d}</p></div></li>`).join('\n      ')}
    </ol>
  </section>

` : ''}  <section class="ga-where" aria-labelledby="ga-where-h">
    <h2 id="ga-where-h" class="g-sec-h">Put it on your website or page</h2>
    <div class="ga-cards">
      ${where.map(([ic, t, d, g]) => `<article data-reveal><span class="ga-card-ic" aria-hidden="true">${I(ic, 'line', 24)}</span><h3>${t}</h3><p>${d}</p>${siteExists(`guides/${g}.html`) ? `<a href="${g}.html">${esc(t === 'Website builders' ? 'Webflow guide' : t + ' guide')} →</a>` : ''}</article>`).join('\n      ')}
    </div>
  </section>

  <section class="ga-slides" aria-labelledby="ga-slides-h">
    <div class="ga-slides-head">
      <h2 id="ga-slides-h" class="g-sec-h">In slides</h2>
      <p>Slide apps show SVG files as still pictures, so download a <b>GIF</b> from the icon’s <b class="ui">Download</b> area, or pick one in seconds on the <a href="../free/animated-icons.html">free animated icons page</a>. Insert it like any picture and it plays when you present.${hasFmt('mp4') ? ' In Keynote and PowerPoint an <b>MP4</b> works too: give it your slide’s background colour before you download.' : ''} Or keep a still icon and give it the app’s own animation:</p>
    </div>
    <div class="ga-cards ga-cards--slides">
      ${slides.map(([app, g, d]) => `<article data-reveal><h3>${app}</h3><p>${d}</p>${siteExists(`guides/${g}.html`) ? `<a href="${g}.html">How to add icons to ${app} →</a>` : ''}</article>`).join('\n      ')}
    </div>
  </section>

  <section class="ga-tips" aria-labelledby="ga-tips-h">
    <h2 id="ga-tips-h" class="g-sec-h">Make it feel good</h2>
    <div class="ga-tips-grid">
      <article data-reveal><span class="ga-tip-k">1</span><h3>One at a time</h3><p>A single moving icon draws the eye. Ten moving icons fight for it. Animate the one thing you want people to notice.</p></article>
      <article data-reveal><span class="ga-tip-k">2</span><h3>Match the meaning</h3><p>Bells ring, hearts beat, arrows point the way. When the motion fits the icon, people understand it faster.</p></article>
      <article data-reveal><span class="ga-tip-k">3</span><h3>Keep it calm</h3><p>Slow and small beats fast and big. Downloads stop moving for anyone who has asked their device for less motion.</p></article>
    </div>
  </section>

  <section class="ga-dev" aria-labelledby="ga-dev-h" data-reveal>
    <div>
      <p class="pg-eyebrow"><span class="hand">for developers</span></p>
      <h2 id="ga-dev-h">Animating in code?</h2>
      <p>Add the optional <b>@withicons/motion</b> stylesheet and two classes. It works with every package and every style, and respects reduced motion.</p>
      <a class="btn btn-ink" href="../developers.html#motion">Animation docs</a>
    </div>
    ${code(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion/dist/motion.css">

<span class="wm wm-loop wm-p-ring"><svg …bell…></svg></span>`, 'html', 'index.html')}
  </section>

  <section class="g-trouble" aria-labelledby="tr-h">
    <h2 id="tr-h" class="g-sec-h">Something not working?</h2>
    <div class="g-trouble-list">
      ${trouble.map(([q, a]) => `<details class="pg-qa" data-reveal><summary>${q}</summary><div><p>${a}</p></div></details>`).join('\n      ')}
    </div>
  </section>

  ${askAI({ id: 'ask-h', eyebrow: 'a shortcut', title: 'Let your AI pick the motion', p: '../', attrs: 'data-intent="find"',
    text: 'Click Claude, ChatGPT, Gemini, Perplexity or Grok. We copy a ready brief that points it to our skill file and open it for you. Tell it what you’re making (“a ringing bell for my newsletter signup”): it picks the icon, the style and a motion that fits, then explains each step.' })}

  <section class="pg-cta" data-reveal>
    <h2>Pick an icon and make it move.</h2>
    <p>${N_ICONS} icons, ${word(N_STYLES)} styles, ${PRESETS.length} ways to move. All free.</p>
    <a class="btn btn-ink" href="../icons.html">${I('search', 'line', 18)} Browse icons</a>
  </section>
</div>`
  const howto = {
    '@type': 'HowTo', name: ANIMATE.title, description: 'Animate a free icon without code: choose a motion or a Turn into switch in the Customize editor, then download an animated SVG for websites and Notion, a GIF for slides or an MP4 for video.',
    totalTime: `PT${ANIMATE.time}M`, inLanguage: 'en', supply: [{ '@type': 'HowToSupply', name: 'A free icon from with icons (animated SVG)' }],
    step: steps.map(([t, d], i) => ({ '@type': 'HowToStep', position: i + 1, name: t, text: d.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>'), url: `${ORIGIN}/${path}#step-${i + 1}` })),
  }
  const faq = { '@type': 'FAQPage', mainEntity: trouble.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) }
  write(path, page({
    path, current: 'guides', title: 'How to animate an icon: free animated SVG icons, no code · with icons', ogTitle: 'How to animate an icon',
    desc: 'Make any free icon move in minutes: pick a motion (ring, heartbeat, spin, float…) or turn it into another icon, then download an animated SVG for your website or Notion, a GIF for PowerPoint, Google Slides and Keynote, or an MP4 or Lottie file.',
    body, ld: [howto, faq], crumbsLd: [['Home', ''], ['How to use', 'guides/index.html'], ['Animate an icon', path]], bodyClass: 'pg-guide pg-animate', styles: ma.css, scripts: ma.js,
  }))
  return ANIMATE.slug
}
