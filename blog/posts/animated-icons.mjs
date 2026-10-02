import { p, h2, h3, ul, figure, iconGrid, styleRow, table, yes, no, meh, callout, steps, stats, doDont, code, cta, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'animated-icons',
  category: 'basics',
  date: '2026-10-03',
  hero: 'xanim5',
  stickers: [['sparkles', 'glass'], ['bell-ring', 'gloss'], ['loader', 'duo']],
  title: 'Animated icons: when they help, when they hurt, and how to use them',
  cardTitle: 'Animated icons: help or hurt?',
  h1: 'Animated icons: when they help, when they hurt, and <em>how to use them</em>',
  dek: 'A bell that rings, a heart that beats, a spinner that says “hang on”. Motion can make icons clearer or make a page exhausting. Here is how to tell the difference.',
  description: 'When animated icons help and when they hurt: SVG, Lottie and GIF in plain words, WCAG motion rules, reduced motion, speed tips, and moving icons in slides and email.',
  keywords: ['animated icons', 'animated svg icons', 'icon animation', 'animated icons for website', 'animated icons for powerpoint', 'gif icons', 'lottie icons', 'prefers-reduced-motion', 'wcag animation'],
  about: ['Icon design', 'Animation', 'Web accessibility', 'User interface design'],
  related: ['accessible-icons', 'icons-in-presentations', 'svg-vs-png-icons'],
  tldr: [
    '<strong>Animated icons help when the motion means something</strong>: feedback (a heart beats when you tap like), a change of state (play turns into pause), loading, or pointing at one new thing once.',
    '<strong>They hurt when they loop forever</strong>, when several move at once, or when they move for decoration only. Motion pulls the eye, so it competes with your content.',
    'Respect the <strong>reduce motion</strong> setting (<code>prefers-reduced-motion</code>). WCAG 2.2.2 asks for a way to pause anything that moves on its own for more than five seconds next to other content.',
    'Keep it fast: animate only <strong>transform and opacity</strong>, and keep most interface motion between about 100 and 500 milliseconds.',
    `For slides and email use a <strong>GIF</strong> (or MP4 in Keynote and PowerPoint). Every with icons icon has its own motion you can download as animated SVG, GIF, MP4 or Lottie, free.`,
  ],
  faq: [
    { q: 'Are animated icons bad for accessibility?', a: 'Not if you use them with care. Keep motion short and meaningful, let anything that moves on its own for more than five seconds be paused (WCAG 2.2.2), avoid flashing, and turn motion off when someone has switched on reduce motion in their device settings (the prefers-reduced-motion media query).' },
    { q: 'Do animated icons slow down a website?', a: 'Small CSS or SVG animations barely affect speed if they only change transform and opacity, which browsers can animate smoothly. Heavy GIFs, many looping icons, or animations that change size and position (width, top, left) are what make pages feel slow.' },
    { q: 'Can I use an animated icon in PowerPoint or Google Slides?', a: 'Yes, as a GIF. Microsoft says PowerPoint for Microsoft 365 and PowerPoint 2016 and later play animated GIFs in Slide Show (PowerPoint for the web does not). Google Slides accepts GIFs too. An animated SVG shows up as a still picture in slide apps, and MP4 video is a good choice for Keynote and PowerPoint.' },
    { q: 'Do animated GIFs work in email?', a: 'In most email apps, yes. Litmus notes that desktop Outlook 2007 to 2019 shows only the first frame, so make sure the first frame makes sense on its own. Avoid SVG in email: support is patchy.' },
    { q: 'What is the difference between Lottie and animated SVG?', a: 'An animated SVG is a single image file with its motion built in, and a browser plays it by itself. A Lottie is a JSON animation file (often made in After Effects) that needs a small player library to run on the web, iOS, Android and other platforms.' },
    { q: 'How long should an icon animation last?', a: 'Short. Nielsen Norman Group suggests most interface animations should last roughly 100 to 500 milliseconds, with simple feedback like a toggle around 100 ms. Calm, slow loops are fine for a single loading or “live” indicator.' },
    { q: 'Are with icons animated icons free?', a: `Yes. All ${N_ICONS} with icons icons, their motion and their downloads (animated SVG, GIF, MP4, Lottie and more) are free under the MIT licence, for personal and commercial use, with no attribution required.` },
  ],
  sources: [
    { title: 'W3C: Understanding SC 2.2.2 Pause, Stop, Hide (Level A)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html' },
    { title: 'W3C: Understanding SC 2.3.3 Animation from Interactions (Level AAA)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html' },
    { title: 'W3C: Understanding SC 2.3.1 Three Flashes or Below Threshold (Level A)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html' },
    { title: 'MDN: prefers-reduced-motion', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion' },
    { title: 'web.dev: How to create high-performance CSS animations', url: 'https://web.dev/articles/animations-guide' },
    { title: 'Nielsen Norman Group: The Role of Animation and Motion in UX (Aurora Harley)', url: 'https://www.nngroup.com/articles/animation-usability/' },
    { title: 'Nielsen Norman Group: Executing UX Animations: Duration and Motion Characteristics (Page Laubheimer, 2020)', url: 'https://www.nngroup.com/articles/animation-duration/' },
    { title: 'Microsoft Support: Add an animated GIF to a slide', url: 'https://support.microsoft.com/en-us/office/add-an-animated-gif-to-a-slide-3a04f755-25a9-42c4-8cc1-1da4148aef01' },
    { title: 'Google Docs Editors Help: Insert or delete images and videos', url: 'https://support.google.com/docs/answer/97447' },
    { title: 'Litmus: How to create and add an animated GIF to an email (2023)', url: 'https://www.litmus.com/blog/a-guide-to-animated-gifs-in-email' },
    { title: 'Can I email: SVG images (tested September 2026)', url: 'https://www.caniemail.com/features/image-svg/' },
    { title: 'Airbnb: lottie-web on GitHub', url: 'https://github.com/airbnb/lottie-web' },
  ],
  body: () => `
${p(`<span class="lede">Animated icons help when the motion tells people something: that a tap worked, that something changed, that the app is busy loading, or that one new thing deserves a look. They hurt when they loop forever, move just to look busy, or ignore people who have asked their device for less motion. Used once, briefly and with meaning, a moving icon makes an interface clearer.</span>`)}
${p('Below: the kinds of animated icons, good and bad uses, the accessibility rules (checked with the W3C in October 2026), speed, and slides and email.')}
${iconGrid(['loader', 'bell-ring', 'heart', 'check-circle', 'refresh', 'download'], 'duo', 'Six icons that move with a purpose: the loader steps round, the bell swings, the heart beats, the tick draws itself, refresh turns once, the arrow drops into its tray.')}
${callout('note', `This article is a still page on purpose, so it is calm to read. To see these icons actually move, open one, like the ${L.icon('bell')} or ${L.icon('heart')} icon, and choose the Motion tab.`)}

${h2('What is an animated icon?')}
${p('An animated icon is a small picture that moves: it spins, bounces, beats, draws itself or turns into another icon. The drawing is the same as a normal icon. What changes is the file format that carries the motion. There are four you will meet:')}
${ul([
  '<strong>CSS or animated SVG.</strong> An SVG is a picture made of shapes, so it stays sharp at any size. The motion is a few lines of instructions (CSS) that the browser plays. Tiny and ideal for websites.',
  '<strong>Lottie.</strong> An animation saved as a JSON data file, often made in Adobe After Effects with a plugin called Bodymovin. A small player library runs it on the web, iOS, Android and more.',
  '<strong>GIF.</strong> The old favourite: still frames played in a loop. Bigger and less sharp than SVG, but it plays almost everywhere, including slides, chat and most email.',
  '<strong>Video (MP4 or WebM).</strong> Smooth and well supported in slide apps, but it usually sits in a coloured box.',
])}
${table(['Format', 'Best for', 'Websites', 'Slides', 'Email'], [
  ['<strong>Animated SVG / CSS</strong>', 'Websites, Notion, web apps', yes(), no('Shows still'), no('Patchy')],
  ['<strong>Lottie</strong>', 'Mobile and web apps', yes('With a player'), no(), no()],
  ['<strong>GIF</strong>', 'Slides, chat, email', meh('Heavier'), yes(), yes('Mostly')],
  ['<strong>MP4 / WebM video</strong>', 'Keynote, PowerPoint, social posts', meh('In a box'), yes(), no()],
], 'Which animated icon format works where (checked October 2026)')}
${p(`If you are not sure which file you need, our ${L.post('svg-vs-png-icons', 'SVG vs PNG guide')} explains the still versions, and the ${L.guide('animate-icons', 'how to animate an icon guide')} walks through the moving ones.`)}

${h2('When do animated icons actually help?')}
${p('Good motion answers a question the person already has. Nielsen Norman Group, a respected usability research firm, points out that animation can show how one element relates to another and give feedback that an action worked. Four uses earn their place:')}
${ul([
  '<strong>Feedback.</strong> You tap like and the heart gives a little beat. The motion says “got it” without a pop-up.',
  '<strong>A change of state.</strong> Play turns into pause, the menu becomes a close cross. The movement shows the two states are connected.',
  '<strong>Loading and progress.</strong> A spinner or a filling battery tells people the app has not frozen. This is the one place where a loop makes sense, and only while something is really happening.',
  '<strong>Pointing at one thing, once.</strong> The bell rings when a new message arrives, then rests. One short ring is a polite tap on the shoulder.',
])}
${iconGrid(['play', 'pause', 'menu', 'close', 'eye', 'eye-off', 'heart', 'sun', 'moon'], 'line', 'Natural “turn into” pairs: play and pause, menu and close, eye and eye-off, sun and moon. The heart can fill up when liked.')}
${p('Timing matters as much as the motion. Nielsen Norman Group suggests most interface animations should last roughly <strong>100 to 500 milliseconds</strong>, around 100 ms for simple feedback like a toggle, and warns that at 500 ms animations start to feel like a drag. Feedback should also start straight away, within about a tenth of a second of the tap.')}

${h2('When do animated icons hurt?')}
${p('Our eyes are wired to notice movement, especially at the edge of our view. That is why motion grabs attention so well, and why it is easy to overdo. Animated icons get in the way when:')}
${ul([
  '<strong>They loop forever for no reason.</strong> A gear that spins on a settings page that is not loading anything just says “something is happening” when nothing is.',
  '<strong>Several move at once.</strong> Three bouncing feature icons compete with each other and with your headline. Keep continuous loops to one or two per screen at most.',
  '<strong>They slow people down.</strong> Nielsen Norman Group notes that animations people see again and again become roadblocks.',
  '<strong>They flash.</strong> WCAG 2.3.1 (Level A) says nothing should flash more than three times in any one second, unless it stays below safe thresholds. Flashing can trigger seizures.',
  '<strong>They ignore reduce motion.</strong> For some people, movement on screen causes real dizziness and nausea. More on that next.',
])}
${doDont('<p>Animate one icon to confirm an action or show a change, keep it short, and let it come to rest.</p>', '<p>Set every feature icon on a page bouncing in a loop to make it feel “alive”. It reads as noise and pulls eyes away from your words.</p>')}
${figure('xanim3', 'Motion leaves a trail in our attention, just like light in a long exposure. Spend it on the moments that matter.')}

${h2('How do you make animated icons accessible?')}
${p('Most phones and computers have a setting to cut down on motion: “Reduce motion” on iPhone, iPad and Mac, “Animation effects” on Windows 11, and “Remove animations” on Android. When someone turns it on, websites can detect it with a CSS media query called <code>prefers-reduced-motion</code>, and should calm things down or stop them.')}
${p('Three success criteria in the Web Content Accessibility Guidelines (WCAG 2.2) cover moving icons:')}
${table(['WCAG rule', 'Level', 'What it means for icons'], [
  ['<strong>2.2.2 Pause, Stop, Hide</strong>', 'A', 'Anything that moves on its own, lasts more than five seconds and sits alongside other content needs a way to pause, stop or hide it. A loading spinner that is the only thing on screen is an accepted exception.'],
  ['<strong>2.3.1 Three Flashes or Below Threshold</strong>', 'A', 'Nothing should flash more than three times per second (unless the flash is below safe thresholds).'],
  ['<strong>2.3.3 Animation from Interactions</strong>', 'AAA', 'Motion triggered by an interaction, like a hover or a tap, can be turned off, unless the motion is essential.'],
], 'The WCAG 2.2 success criteria that apply to animated icons (checked October 2026)')}
${p('The W3C explains why this matters: for people with vestibular (inner ear) disorders, motion on screen can trigger nausea, migraines and dizziness. In practice, the simplest fix is to switch animations off when reduce motion is on. If you or your developer write CSS, it is one short rule:')}
${code(`@media (prefers-reduced-motion: reduce) {
  .icon-anim { animation: none; transition: none; }
}`, 'css')}
${p(`Also keep the label on the button (a moving icon is still decorative), and never let motion be the only signal: an error should say what went wrong in words too. Our ${L.post('accessible-icons', 'friendly guide to accessible icons')} covers labels in more detail.`)}

${h2('How do you keep animated icons fast?')}
${p('A browser can move some things much more cheaply than others. Google’s web.dev guide recommends animating only <strong>transform</strong> (moving, turning and scaling) and <strong>opacity</strong> (fading), because the browser can do those without re-laying out the page. Animating size or position properties like <code>width</code>, <code>top</code> or <code>left</code> makes the browser redo work on every frame, which leads to stutter.')}
${steps([
  ['Animate transform and opacity only', 'Spin with rotate, bounce with translate, pulse with scale, fade with opacity.'],
  ['Prefer SVG and CSS over GIF on websites', 'A few lines of CSS are far lighter than a GIF made of many frames.'],
  ['Limit loops', 'One or two continuous animations per screen. Everything else plays on hover, on tap, or once.'],
  ['Pause what nobody can see', 'Loops running off screen waste battery. Start them when they scroll into view.'],
])}

${h2('Can you use animated icons in slides and email?')}
${p('Yes, but the file format changes. Slide apps and email apps do not run website code, so an animated SVG shows up as a still picture there. Use these instead:')}
${ul([
  `<strong>PowerPoint:</strong> insert a <strong>GIF</strong> like any picture. Microsoft says it plays in Slide Show in PowerPoint for Microsoft 365 and PowerPoint 2016 and later, on Windows and Mac. PowerPoint for the web shows the GIF but does not play it. MP4 video works too. See our ${L.guide('powerpoint', 'PowerPoint guide')}.`,
  `<strong>Google Slides:</strong> GIFs are supported (Insert, then Image). SVG is not on Google’s list of formats, so use a GIF or PNG. See the ${L.guide('google-slides', 'Google Slides guide')}.`,
  `<strong>Keynote:</strong> an MP4 video is the safest choice, and you can pick your slide’s colour as its background. See the ${L.guide('keynote', 'Keynote guide')}.`,
  `<strong>Email:</strong> GIFs play in most email apps. Litmus notes that desktop Outlook 2007 to 2019 only shows the first frame, so make that frame complete on its own. Skip SVG in email: Can I email (tested September 2026) shows Gmail on the web turns SVGs into still PNGs and desktop Outlook does not show them. Our ${L.guide('email-signatures', 'email signature guide')} has the details.`,
])}
${iconGrid(['trophy', 'rocket', 'sparkles', 'star'], 'gloss', 'Creative styles like Gloss make great slide moments at 48 px and up. In a GIF, the trophy does a little celebration and the sparkles twinkle.', { size: 48 })}
${callout('tip', `GIFs cannot have soft see-through edges, so they get blended with a background colour. Pick your slide’s background colour before you download, and the white rim disappears. More slide tips in ${L.post('icons-in-presentations', 'how to use icons in presentations')}.`)}

${h2('How does motion work in with icons?')}
${p(`Every one of our ${N_ICONS} icons comes with its own suggested motion, chosen to match what it means: the bell rings, the heart beats, the loader steps round, the rocket rises. There are 32 motion presets in all, from ring, beat and spin to float, twinkle, bounce, nudge and ta-da, and any icon can use any of them. Motion works in every one of the ${N_STYLES} styles.`)}
${stats([[N_ICONS, 'icons with their own motion'], ['32', 'motion presets'], ['12', '“turn into” effects'], ['50', 'Live icons']])}
${ul([
  '<strong>Choose when it moves:</strong> Always (a gentle loop), On hover, or Once. For a file you upload as an image, pick Always or Once, because an image cannot see the mouse.',
  '<strong>Turn one icon into another:</strong> play into pause, an outline heart into a solid one, sun into moon, with 12 switch effects like flip, fade and morph.',
  '<strong>Icons move in parts:</strong> a sun’s rays turn while its backdrop only breathes, and a shadow stays on the ground. Too busy? Set Decorations to Keep still.',
  '<strong>Download it moving:</strong> animated SVG for websites and Notion, GIF for slides and email, MP4 or WebM for video, Lottie for apps, plus animated PNG, animated WebP and PNG frames.',
  '<strong>It respects reduce motion:</strong> on websites, when someone has turned on reduce motion, the icons politely stay still.',
])}
${styleRow('bell', `The ${L.icon('bell')} icon in the styles this page can show. It swings from its hook the same way in each one, because motion moves the whole drawing, not one style.`)}
${p(`For developers, motion ships as a separate, optional package, <code>@withicons/motion</code>: pure CSS classes for loop, hover and once, plus a small script for scroll-into-view and “turn into” switches. Like our other npm packages it is <strong>launching soon</strong>. Today you can copy the code or download files from any icon page, and the ${L.page('developers.html#motion-presets', 'developer page')} shows every preset.`)}

${h2('What are Live icons?')}
${p(`Live icons are a different kind of “alive”: instead of moving, they show content you set. There are 50 of them: a calendar with your date, a clock with your time, a bell with your notification count, a battery at your level, a tag with your short text, the weather with your temperature. You type the value, pick one of the ${N_STYLES} styles and download it for slides, docs or your website.`)}
${iconGrid(['calendar', 'clock', 'bell', 'battery', 'shopping-cart', 'tag', 'thermometer', 'wifi'], 'duo', 'Everyday icons whose Live versions show your numbers: date, time, count, charge, cart items, a price, a temperature, signal strength.')}
${p(`Try them on the ${L.page('live.html', 'Live icons page')}. Text stays at four characters or fewer so it is readable when small.`)}

${h2('A quick checklist before you add motion')}
${steps([
  ['Ask what the motion says', 'Feedback, a change of state, loading or one alert. If you cannot name it, leave the icon still.'],
  ['Keep it short', 'About 100 to 500 ms for interface motion. Let it come to rest.'],
  ['Limit loops', 'One or two per screen, and only while something is really happening.'],
  ['Respect reduce motion', 'Turn animation off under prefers-reduced-motion, and give long animations a pause button.'],
  ['Pick the right file', 'Animated SVG for websites, GIF for slides and email, MP4 for Keynote and video, Lottie for apps.'],
])}
${p(`Motion is seasoning, not the meal. Browse ${L.icons('all the icons')}, pick a style from ${L.style('duo', 'duo')} to ${L.style('glass', 'glass')}, and see each one move on its page.`)}
${cta('Icons that move when it matters', `${N_ICONS} free icons in ${N_STYLES} styles, each with its own motion. Download animated SVG, GIF, MP4 or Lottie. No sign-up, MIT licensed.`, ['bell-ring', 'heart', 'loader', 'sparkles', 'rocket', 'star'])}
`,
}
