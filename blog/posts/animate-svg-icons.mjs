import { p, h2, h3, ul, styleRow, motionGrid, swapGrid, table, yes, no, meh, callout, doDont, code, cta, art, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'animate-svg-icons',
  category: 'code',
  date: '2026-11-06',
  hero: 'h-animate-svg-icons',
  stickers: [['bell-ring', 'duo'], ['play', 'solid'], ['sparkles', 'kawaii']],
  title: 'Is SMIL deprecated? How to animate SVG icons in 2026',
  cardTitle: 'How to animate SVG icons',
  h1: 'Is SMIL deprecated? How to <em>animate SVG icons</em> today',
  dek: 'Ten-year-old answers still say SMIL is dying. It is not. Here is what each way of animating an icon is good at in 2026: CSS, SMIL, the Web Animations API and Lottie, plus the one setting every animation must respect.',
  description: 'SMIL is not deprecated: Chrome dropped that plan in 2016. How to animate SVG icons today with CSS, SMIL, Web Animations or Lottie, and respect reduced motion.',
  keywords: ['is smil deprecated', 'smil svg animation', 'animate svg icon css', 'svg animate vs css animation', 'svg stroke-dashoffset animation', 'svg line drawing animation', 'web animations api svg', 'lottie vs css animation', 'prefers-reduced-motion icons', 'animate icon on hover'],
  about: ['SVG animation', 'SMIL', 'CSS animations', 'Web Animations API', 'Lottie', 'with icons'],
  related: ['animated-icons', 'best-animated-icon-libraries', 'accessible-icons'],
  tldr: [
    '<strong>No, SMIL is not deprecated.</strong> Chrome announced a plan to deprecate it in April 2015 and suspended that plan in August 2016. <code>&lt;animate&gt;</code> and friends work in every major browser today.',
    '<strong>For most icon motion, use CSS</strong> on inline SVG: transitions for hover and state, keyframes for loops, <code>transform-box: fill-box</code> to turn parts around their own centre, <code>stroke-dashoffset</code> for a line that draws itself.',
    '<strong>Use SMIL or CSS inside the file</strong> when the animation must travel as one self-contained <code>.svg</code> that plays even in an <code>&lt;img&gt;</code>. Use the <strong>Web Animations API</strong> when JavaScript needs to start, pause, reverse or chain motion.',
    '<strong>Lottie is worth it</strong> for rich, designer-made motion from After Effects. For a bell that rings or a heart that beats, it is a player library you do not need.',
    'Whatever you use, honour <code>prefers-reduced-motion</code>, and give anything that loops longer than five seconds a way to pause (WCAG 2.2.2).',
  ],
  faq: [
    { q: 'Is SMIL deprecated in Chrome?', a: 'No. In April 2015 the Chrome team posted an “intent to deprecate” SMIL on the blink-dev list. After pushback, it said in August 2016 that it had decided to “suspend our intent to deprecate”. SMIL still works in Chrome, Edge, Firefox and Safari; caniuse puts support at about 97% of users worldwide in November 2026.' },
    { q: 'Should I use SMIL or CSS to animate SVG?', a: 'CSS for icons inside your page: it is easy to trigger on hover or state, and you can switch it off for reduced motion with one media query. SMIL for a standalone animated SVG file, or when you need to animate an SVG attribute that CSS cannot reach in every browser.' },
    { q: 'Do SVG animations play inside an img tag?', a: 'Animations written inside the file, as SMIL or as CSS in a <code>&lt;style&gt;</code> element, play in an <code>&lt;img&gt;</code>. JavaScript does not run there, so the Web Animations API and Lottie players cannot drive an SVG used as an image.' },
    { q: 'How do I make an SVG line draw itself?', a: 'Add <code>pathLength="1"</code> to the path so its length counts as 1, set <code>stroke-dasharray: 1</code> and <code>stroke-dashoffset: 1</code>, then animate the offset to 0. The dash slides along and the line appears from start to end. It only works on strokes, so it suits outline icons.' },
    { q: 'Is Lottie better than CSS for icons?', a: 'For simple icon motion, no: CSS is lighter, needs no script and recolours with your theme. Lottie shines when a motion designer has built something rich in After Effects (many parts, eased paths, character animation) that would be painful to rebuild by hand.' },
    { q: 'How do I stop icon animations for people who prefer reduced motion?', a: 'Wrap motion in <code>@media (prefers-reduced-motion: no-preference)</code>, or turn it off inside <code>@media (prefers-reduced-motion: reduce)</code>. In JavaScript, check <code>matchMedia(\'(prefers-reduced-motion: reduce)\').matches</code> before starting. People set this in their system settings; it has worked in every major browser since January 2020.' },
  ],
  sources: [
    { title: 'Chromium blink-dev: Intent to deprecate: SMIL (Philip Rogers, 29 April 2015)', url: 'https://groups.google.com/a/chromium.org/g/blink-dev/c/5o0yiO440LM' },
    { title: 'W3C www-svg list: Chrome suspends its intent to deprecate SMIL (forwarded 17 August 2016)', url: 'https://lists.w3.org/Archives/Public/www-svg/2016Aug/0037.html' },
    { title: 'Meta Stack Overflow: SVG SMIL animations are back and well (2023)', url: 'https://meta.stackoverflow.com/questions/423998/svg-smil-animations-are-back-and-well-and-it-should-be-informed-in-older-posts' },
    { title: 'caniuse: SVG SMIL animation (about 97% global support), checked November 2026', url: 'https://caniuse.com/svg-smil' },
    { title: 'MDN: SVG animation with SMIL, checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_animation_with_SMIL' },
    { title: 'MDN: transform-box (Baseline since January 2020), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform-box' },
    { title: 'MDN: the pathLength attribute, checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/pathLength' },
    { title: 'MDN: Element.animate() (Baseline since March 2020), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Element/animate' },
    { title: 'MDN: prefers-reduced-motion (Baseline since January 2020), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion' },
    { title: 'MDN: SVG as an image (scripts disabled), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_as_an_image' },
    { title: 'W3C: Understanding WCAG 2.2 SC 2.2.2 Pause, Stop, Hide (Level A), checked November 2026', url: 'https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html' },
    { title: 'dotLottie: the .lottie format, checked November 2026', url: 'https://dotlottie.io/' },
    { title: 'with icons: @withicons/motion README, checked November 2026', url: 'https://www.npmjs.com/package/@withicons/motion' },
  ],
  body: () => `
${p(`<span class="lede">No, SMIL is not deprecated. Chrome announced a plan to deprecate it in April 2015, then suspended that plan in August 2016, and SMIL animation works in every major browser today. For most icons, though, CSS is still the best tool: transitions for hover and state changes, keyframes for loops, and <code>stroke-dashoffset</code> for lines that draw themselves. Use SMIL for self-contained animated files, the Web Animations API when JavaScript needs control, and Lottie only for rich, designer-made motion.</span>`)}
${p(`Many top answers were written in 2015 and 2016, while the deprecation plan was live, and in 2023 someone asked on Meta Stack Overflow for them to carry a warning. Below is the 2026 picture, checked on MDN, caniuse and the Chromium and W3C lists in November 2026. For <em>when</em> animated icons help, rather than how to build them, read ${L.post('animated-icons', 'animated icons: when they help and when they hurt')}.`)}

${h2('Is SMIL deprecated?')}
${p('SMIL is the animation language built into SVG: elements like <code>&lt;animate&gt;</code>, <code>&lt;animateTransform&gt;</code>, <code>&lt;animateMotion&gt;</code> and <code>&lt;set&gt;</code> that you write inside the drawing itself. Here is what actually happened to it:')}
${art('m-animate-svg-icons-smil-timeline', 'The deprecation that never happened: announced in 2015, suspended in 2016, supported everywhere in 2026.', { brief: 'A horizontal timeline with three milestones on a soft blueprint grid. April 2015: a small warning-triangle marker labelled “Chrome: intent to deprecate SMIL”. August 2016: a pause marker labelled “Plan suspended”. November 2026: a big tick labelled “Works in Chrome, Edge, Firefox, Safari (about 97% of users)”. Above the line, the with icons loader icon in line style shown mid-spin, as if animated by SMIL. Short labels only, no browser logos.' })}
${ul([
  '<strong>April 2015:</strong> the Chrome team posted an “intent to deprecate” on the blink-dev list, saying SMIL added complexity and was rarely used, and that CSS and Web Animations should replace it.',
  '<strong>August 2016:</strong> after developers pointed out things SMIL could do that nothing else could yet, Chrome said it had decided to “suspend our intent to deprecate”.',
  '<strong>Today:</strong> SMIL plays in Chrome, Edge, Firefox and Safari. caniuse puts support at about 97% of users worldwide, and MDN documents it as a normal part of SVG.',
])}
${p('So “SMIL is deprecated, convert to CSS” is out of date. SMIL is not the best choice for every icon, but it is not going away.')}

${h2('What is the best way to animate an SVG icon today?')}
${table(['Method', 'Best for', 'Plays in an &lt;img&gt;', 'Needs JavaScript', 'Reduced motion'], [
  ['CSS transitions and keyframes', 'Hover, state changes and loops on icons in your page', yes('if written in the file'), no(), yes('one media query')],
  ['SMIL (<code>&lt;animate&gt;</code>)', 'Self-contained animated files; animating SVG attributes', yes(), no(), meh('no simple off switch')],
  ['Web Animations API', 'Motion that code starts, pauses, reverses or chains', no(), yes(), meh('check it in your code')],
  ['Lottie / dotLottie', 'Rich motion designed in After Effects', no('needs a player'), yes(), meh('depends on the player')],
  ['GIF or MP4', 'Slides, chat, email, video editors', yes('GIF'), no(), no('always plays')],
], 'Ways to animate an icon, checked November 2026')}
${p(`Most product teams land on CSS for interface icons and a GIF or video for slides and social posts. That is also how our own tools are built, which we come back to at the end. For a tour of ready-made animated sets, see ${L.post('best-animated-icon-libraries', 'the best animated icon libraries')}.`)}

${h2('How do I animate an SVG icon with CSS?')}
${p('Put the SVG in your page (pasted code, a component or a web component), then animate it like any other element. Two rules keep it smooth: animate only <code>transform</code> (move, turn, scale) and <code>opacity</code> (fade), and tell the browser where each part should pivot.')}
${p('That second rule is the bit most tutorials miss. Inside an SVG, a shape turns around the corner of the whole drawing by default, not around its own middle, so a spinning gear wobbles across the icon. <code>transform-box: fill-box</code> makes <code>transform-origin</code> measure from the shape itself. It has worked in every major browser since January 2020.')}
${code(`/* A bell that rings from its hook when its button is hovered or focused */
@keyframes ring {
  0%, 100% { transform: rotate(0); }
  20% { transform: rotate(14deg); }
  40% { transform: rotate(-10deg); }
  60% { transform: rotate(6deg); }
}
.bell-btn:is(:hover, :focus-visible) .bell {
  animation: ring 0.8s ease-in-out;
  transform-box: fill-box;
  transform-origin: 50% 0;   /* swing from the top, not the corner */
}`, 'css')}
${p(`Trigger it from the <em>button</em>, not the icon, so it also plays for keyboard users, and keep hover motion short (well under a second). Hover over the tiles below: each style, from ${L.style('line')} to ${L.style('clay')}, plays the ${L.icon('bell')} icon’s own hover motion.`)}
${styleRow('bell', 'The bell’s own hover motion in five styles. Hover, focus or tap a tile to play it.', { motion: 'hover', styles: ['line', 'solid', 'duo', 'clay', 'kawaii'] })}

${h2('How do I make a line icon draw itself?')}
${p('The “drawing” effect is a dashed line trick. Imagine the stroke is one very long dash with an equally long gap. Slide the dash out of view, then slide it back, and the line seems to draw itself from start to end. <code>pathLength="1"</code> tells the browser to treat the path as one unit long, so you never have to measure it.')}
${art('m-animate-svg-icons-draw', 'How the draw effect works: one dash as long as the path, slid into place with stroke-dashoffset.', { brief: 'Three frames left to right of the with icons check-circle icon in line style. Frame 1 “dashoffset: 1” shows a faint dotted ghost of the path and nothing drawn. Frame 2 “dashoffset: 0.5” shows half the circle and no tick yet, with a small arrow along the stroke direction. Frame 3 “dashoffset: 0” shows the full icon. Under the frames, one long bar split into a dark dash and a light gap of equal length, with a slider handle. Short labels only.' })}
${code(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="draw">
  <path pathLength="1" d="…" />
</svg>`)}
${code(`.draw path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw 0.6s ease-out forwards;
}
@keyframes draw { to { stroke-dashoffset: 0; } }`, 'css')}
${p(`It only works on strokes, so it suits outline styles like ${L.style('line')} and ${L.style('sketch')}. Filled icons need a different reveal, such as a fade or a scale. Our motion package has a <code>draw</code> preset that does exactly this on outline styles and falls back to a pop on filled ones.`)}

${h2('When is SMIL the right choice?')}
${p('SMIL earns its place when the animation has to live <em>inside</em> the file. An SVG used as an image (an <code>&lt;img&gt;</code> tag or a CSS background) runs no JavaScript, but animation written into the file still plays. That makes SMIL handy for an animated logo in a README, a loading spinner served as a plain file, or a CMS that only accepts images.')}
${code(`<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#2f5bff" stroke-width="2"
     stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="9" stroke-opacity="0.25" />
  <path d="M12 3a9 9 0 0 1 9 9">
    <animateTransform attributeName="transform" type="rotate"
      from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
  </path>
</svg>`)}
${p('Two things to know. First, an SVG in an <code>&lt;img&gt;</code> cannot see your page’s CSS, so <code>currentColor</code> falls back to black: write the colour into the file, as above. Second, SMIL has no simple off switch for reduced motion, because your CSS media queries cannot pause it. CSS keyframes in a <code>&lt;style&gt;</code> element inside the file also play in an <code>&lt;img&gt;</code>, and they <em>can</em> carry a reduced-motion rule, which is why our own animated SVG export uses CSS rather than SMIL.')}

${h2('When should I use the Web Animations API?')}
${p('The Web Animations API is the same engine as CSS animation, driven from JavaScript with <code>element.animate()</code>. It has been Baseline since March 2020. Reach for it when code needs to decide: play a “pop” when a like is saved, reverse it on undo, wait for it to finish before moving on.')}
${code(`const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

async function pop(icon) {
  if (reduce) return
  const anim = icon.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }],
    { duration: 300, easing: 'ease-out' }
  )
  await anim.finished   // then update the counter, close the menu, etc.
}`, 'js')}
${p('Turning one icon into another, like play into pause or a menu into a close button, is a common reason to add code. A swap needs state: which icon is showing now? Click the tiles to see three swaps, each with its own transition.')}
${swapGrid([['play', 'pause'], ['menu', 'close'], ['sun', 'moon']], 'line', 'Tap or click to switch: play morphs into pause, the menu into a close button, the sun rotates into a moon.')}

${h2('Is Lottie worth it for icons?')}
${p('Lottie is a format for vector animation exported from tools like After Effects, played back by a small player library. dotLottie (<code>.lottie</code>) packages the same animation in a compressed file, which its makers say is far smaller than raw JSON. It is excellent at things that are painful to hand-code: many parts moving on their own curves, morphing shapes, character animation.')}
${p('For interface icons it is usually more than you need: a player must load before anything moves, colours are baked in unless the player themes them, and a ringing bell is a few lines of CSS. Use Lottie when a motion designer hands you a rich animation, or a tool you use expects Lottie files.')}
${callout('tip', `<p>Need a Lottie file for an app or a video tool? Every icon page on ${L.icons('with icons')} exports Lottie and dotLottie, built from the same motion as the website. Two honest limits: gradients in the richer styles become one flat colour, because Lottie players do not all draw gradients the same way, and pixel-style edges get smoothed.</p>`)}

${h2('How do I respect prefers-reduced-motion?')}
${p('Some people get dizzy or distracted by movement, and they can ask their device for less of it: on Windows 11 under Accessibility, Visual effects, Animation effects; on iPhone under Accessibility, Motion; on a Mac in the Accessibility settings; on Android with Remove animations. Browsers pass that choice to your page as <code>prefers-reduced-motion</code>, which has worked everywhere since January 2020.')}
${code(`/* Motion only for people who have not asked for less */
@media (prefers-reduced-motion: no-preference) {
  .bell-btn:hover .bell { animation: ring 0.8s ease-in-out; }
}`, 'css')}
${p(`“Reduce” does not have to mean “nothing”. A quick fade is usually fine; spins, bounces and big movements are what to drop. And separately from that setting, WCAG 2.2.2 (level A) says anything that moves on its own for more than five seconds alongside other content needs a way to pause, stop or hide it. A gentle loop on a loader is fine; a page of looping icons needs a pause button. Our ${L.post('accessible-icons', 'accessible icons guide')} covers the rest.`)}
${doDont('<p>Animate <code>transform</code> and <code>opacity</code>, trigger hover motion from the button, keep it under a second, and switch it off for reduced motion.</p>', '<p>Loop every icon on the page, animate <code>width</code> or <code>top</code>, or ship a whole Lottie player for one spinning arrow.</p>')}

${h2('How does with icons animate its icons?')}
${p(`Every one of our ${N_ICONS} icons has its own hand-tuned motion: the bell rings from its hook, the heart beats, the loader steps round. It ships as <code>@withicons/motion</code>, which is plain CSS at its core: add a class and a <code>data-wm</code> name, and the icon moves. There are 32 presets plus 12 made for 3D styles, and 12 effects for turning one icon into another. The optional JavaScript helper (<code>motion()</code> and <code>swap()</code>, about 4 KB gzipped) adds hover that finishes, play on scroll and pausing loops that are off screen. When someone asks for reduced motion, everything stops.`)}
${code(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@latest/dist/motion.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@latest/dist/icons/bell.css">

<button class="wm-trigger" aria-label="Notifications">
  <span class="wm wm-hover" data-wm="bell"><svg aria-hidden="true">…bell…</svg></span>
</button>`)}
${motionGrid(['bell', 'heart', 'loader', 'sun'], 'duo', 'Each icon’s own loop, in the duo style. Press Pause to stop them; they stay still if your device asks for reduced motion.', { trigger: 'loop' })}
${p(`Not writing code? Every icon page exports its motion as a GIF, animated PNG or WebP, WebM or MP4 video, animated SVG, PNG frames, Lottie, dotLottie or an animated PowerPoint slide. The animated SVG is self-contained, with a reduced-motion rule built in, and plays in an <code>&lt;img&gt;</code>; apps that show SVG as a still picture, like Figma or PowerPoint, see only the first frame, so use a GIF there. Start with our ${L.guide('animate-icons', 'no-code guide to animating an icon')}, browse ${L.page('free/animated-icons.html', 'free animated icons')}, or try the 50 animated loaders in the ${L.page('loaders.html', 'Loader Studio')}.`)}
${callout('note', '<p>SMIL was never removed: Chrome suspended its deprecation plan in 2016. <code>transform-box</code>, <code>prefers-reduced-motion</code> and <code>element.animate()</code> all became safe to use everywhere around 2020. And dotLottie gave Lottie a compact single-file package. Answers that predate these changes are worth a second look.</p>', 'What changed since the old answers')}
${cta('Icons that already know how to move', `${N_ICONS} free icons in ${N_STYLES} styles, each with its own motion. Use the CSS package, or download a GIF, video, animated SVG or Lottie file.`, ['bell', 'heart', 'loader', 'sparkles', 'rocket', 'play'])}
`,
}
