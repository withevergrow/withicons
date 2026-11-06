import { p, h2, h3, ul, figure, motionGrid, swapGrid, styleRow, table, yes, no, meh, callout, steps, doDont, prosCons, code, cta, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

export default {
  slug: 'best-animated-icon-libraries',
  category: 'comparisons',
  date: '2026-11-06',
  hero: 'h-best-animated-icon-libraries',
  stickers: [['bell-ring', 'glass'], ['heart', 'gloss'], ['sparkles', 'soft3d']],
  title: 'The best animated icon libraries in 2026, honestly compared',
  cardTitle: 'The best animated icon libraries',
  h1: 'The best animated icon libraries in 2026, <em>honestly compared</em>',
  dek: 'Lordicon, LottieFiles, useAnimations, animated Lucide sets and more. What each one costs, which file format it uses, whether you must give credit, and which to pick for your project.',
  description: 'Lordicon, LottieFiles, useAnimations, lucide-animated, IconScout, Icons8 and with icons compared: formats, file weight, price, credit rules and reduced motion.',
  keywords: ['best animated icon library', 'animated icon library', 'free animated icons', 'animated svg icons', 'lottie icons', 'lordicon alternative', 'animated icons react', 'animated lucide icons', 'useanimations', 'animated icons for shadcn'],
  about: ['Animated icons', 'Lottie (file format)', 'Icon library', 'Lordicon', 'LottieFiles', 'Web accessibility'],
  related: ['animated-icons', 'best-free-icon-libraries', 'icon-styles-explained'],
  tldr: [
    '<strong>Richest motion:</strong> Lordicon. Over 49,000 hand-animated Lottie icons, 9,700+ of them free with a credit to the author; PRO costs $8 a month billed yearly and removes the credit.',
    '<strong>Free, no credit, for React:</strong> useAnimations (300 Lottie micro animations, MIT) and lucide-animated (350+ Lucide icons animated with Motion, MIT, installed with the shadcn CLI).',
    '<strong>Most variety:</strong> LottieFiles (free animations under the Lottie Simple License, credit not required) and IconScout (1.6M+ Lottie animations, free ones need a credit). Icons8 has 7,800 animated icons, free with a link.',
    `<strong>Every icon moving, in every style:</strong> with icons (our own set). All ${N_ICONS} icons have their own CSS motion in all ${N_STYLES} styles, plus GIF, MP4 and Lottie downloads for slides. MIT, no credit.`,
    '<strong>Format matters more than brand:</strong> CSS or animated SVG is lightest for websites, Lottie suits rich app animation, GIF is the safe choice for slides and email.',
  ],
  faq: [
    { q: 'What is the best animated icon library?', a: `It depends on the job. Lordicon has the richest, most illustrated motion but asks for a credit on its free plan. useAnimations and lucide-animated are free MIT sets for React. LottieFiles and IconScout have the widest variety. with icons animates all ${N_ICONS} of its icons in ${N_STYLES} styles with light CSS, free with no credit.` },
    { q: 'Is Lordicon free?', a: 'Partly. Lordicon’s free plan includes 9,700+ animated icons that you can use commercially, but you must credit the author. The PRO plan ($8 a month billed yearly, or $16 billed monthly, when we checked in November 2026) removes the credit and unlocks the full library of over 49,000 icons.' },
    { q: 'What is a good free Lordicon alternative?', a: 'If you want free animated icons without a credit line, try useAnimations (MIT, Lottie), lucide-animated (MIT, React and Motion) or with icons (MIT, CSS motion in every style). LottieFiles also has free icon animations whose licence does not require credit. None of them matches Lordicon’s illustrated detail, so compare a few icons side by side.' },
    { q: 'Are Lottie icons better than animated SVG icons?', a: 'Not better, different. Lottie files can carry complex, hand-timed animation made in After Effects, but they need a player script on the page. Animated SVG or CSS icons are smaller and need no player, but the motion is simpler, like a ring, beat, spin or nudge. For most website buttons and menus, CSS motion is enough.' },
    { q: 'Do animated icons work in PowerPoint and Google Slides?', a: 'Yes, as GIFs. Slide apps do not run website code or Lottie players, so download the GIF (or an MP4 video for Keynote and PowerPoint). Lordicon, LottieFiles, IconScout, Icons8 and with icons all offer GIF downloads.' },
    { q: 'Do animated icon libraries respect reduced motion?', a: 'Some say so in their docs. useAnimations documents what each interaction does when reduced motion is preferred, and @withicons/motion stops everything under prefers-reduced-motion. For other libraries, test with your device’s reduce motion setting switched on before you ship.' },
  ],
  sources: [
    { title: 'Lordicon homepage (icon counts, export formats)', url: 'https://lordicon.com/' },
    { title: 'Lordicon pricing', url: 'https://lordicon.com/pricing' },
    { title: 'Lordicon licences', url: 'https://lordicon.com/licenses' },
    { title: 'Lordicon web docs (lord-icon element, triggers)', url: 'https://lordicon.com/docs/web' },
    { title: 'LottieFiles: free icon animations', url: 'https://lottiefiles.com/free-animations/icons' },
    { title: 'LottieFiles: Lottie Simple License', url: 'https://lottiefiles.com/page/license' },
    { title: 'LottieFiles pricing', url: 'https://lottiefiles.com/pricing' },
    { title: 'useAnimations', url: 'https://useanimations.com/' },
    { title: 'lucide-animated', url: 'https://lucide-animated.com' },
    { title: 'lucide-animated on GitHub (pqoqubbw/icons)', url: 'https://github.com/pqoqubbw/icons' },
    { title: 'Animate UI: icons', url: 'https://animate-ui.com/docs/icons' },
    { title: 'Animate UI on GitHub (licence)', url: 'https://github.com/imskyleen/animate-ui' },
    { title: 'IconScout pricing (asset counts, formats)', url: 'https://iconscout.com/pricing' },
    { title: 'IconScout help: attribution for animations', url: 'https://help.iconscout.com/do-i-need-to-provide-attribution-or-credit-for-premium-animations' },
    { title: 'Icons8 animated icons', url: 'https://icons8.com/icons/family-animated' },
    { title: 'Icons8 help: Do you have animated icons?', url: 'https://intercom.help/icons8-7fb7577e8170/en/articles/4732694-do-you-have-animated-icons' },
    { title: 'Icons8 licence', url: 'https://icons8.com/license' },
    { title: 'W3C: Understanding SC 2.2.2 Pause, Stop, Hide', url: 'https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html' },
    { title: 'MDN: prefers-reduced-motion', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">The best animated icon library depends on what you are making. Lordicon has the richest hand-made motion, useAnimations and lucide-animated are the best free picks for React, LottieFiles and IconScout have the most variety, and with icons is the one to choose if you want every icon in a set to move, in many styles, with no credit and no player script.</span>`)}
${p('Below: one honest table, the file formats in plain words, a short review of each library and a way to choose. Still deciding whether to animate at all? Start with ' + L.post('animated-icons', 'when animated icons help and when they hurt') + '.')}
${callout('note', `We make ${L.icons('with icons')}, one of the libraries below. We have tried to be fair and we say where others are better. Every competitor fact comes from the library’s own website, docs or GitHub page, checked in November 2026. Prices and counts change, so check before you buy.`, 'Who wrote this')}

${h2('Which animated icon library is best?')}
${table(['Library', 'Best for', 'Animated icons', 'Format', 'Free use', 'Paid plan'], [
  ['Lordicon', 'Rich, illustrated, hand-timed motion', 'Over 49,000 (9,700+ free)', 'Lottie, played by <code>&lt;lord-icon&gt;</code>; GIF, MP4, SVG and more', meh('Credit the author'), 'PRO $8/mo, billed yearly'],
  ['LottieFiles', 'Huge variety from many creators', '2,077 free icon animations', 'Lottie JSON, dotLottie, GIF, MP4', yes('Credit not required'), 'From $19.99/user/mo, billed yearly (tools)'],
  ['IconScout', 'One shop for icons, 3D and Lottie', '1.6M+ Lottie animations (all kinds)', 'Lottie JSON, GIF, MP4, AEP', no('Credit required'), 'From $14.99/user/mo, billed yearly'],
  ['Icons8', 'Animated icons that match Icons8 styles', '7,800', 'GIF, Lottie JSON, After Effects', no('Link to icons8.com'), 'Paid plans remove the link'],
  ['useAnimations', 'Free Lottie micro interactions in React', '300', 'Lottie JSON, static SVG, React', yes('MIT, no credit'), 'None, it is free'],
  ['lucide-animated', 'Animated Lucide icons for shadcn/ui', '350+', 'React components (Motion)', yes('MIT, no credit'), 'None, it is free'],
  ['Animate UI', 'Animated shadcn/ui parts, icons included', 'Not stated', 'React components (Motion)', meh('Free, but no reselling'), 'None, it is free'],
  ['with icons', 'Every icon moving, in every style', `${N_ICONS}, each in ${N_STYLES} styles`, 'CSS (animated SVG); GIF, MP4, WebM, Lottie downloads', yes('MIT, no credit'), 'None, it is free'],
], 'Animated icon libraries at a glance (checked November 2026). Counts are quoted the way each library states them. “Free use” describes the free plan; every paid plan listed removes the credit.')}

${h2('Lottie, GIF or CSS: which animated icon format should you use?')}
${p('The same moving bell can arrive in four very different files. The format decides how heavy the icon is, whether you can recolour it, and where it will play.')}
${table(['Format', 'How it moves', 'Weight', 'Recolour', 'Plays in'], [
  ['<strong>CSS / animated SVG</strong>', 'The browser plays a few lines of CSS', 'Tiny. A with icons motion file is about 0.5 KB per icon', yes('With CSS'), 'Websites, web apps, Notion'],
  ['<strong>Lottie (JSON)</strong>', 'A player script draws each frame', 'Medium: the file plus a player script', meh('Via the player or an editor'), 'Websites and apps, with a player'],
  ['<strong>GIF</strong>', 'Still frames shown in a loop', 'Heaviest for its quality, no soft edges', no('Baked in'), 'Slides, email, chat'],
  ['<strong>MP4 / WebM</strong>', 'A short video', 'Medium, usually in a box', no('Baked in'), 'Keynote, PowerPoint, social posts'],
], 'Animated icon formats compared (checked November 2026)')}
${p(`<strong>Lottie</strong> is an animation saved as a JSON data file, usually made in Adobe After Effects. It can hold detailed, hand-timed motion, which is why Lordicon and LottieFiles use it, but it needs a small player library to run. useAnimations says its React player is about 8 kB gzipped. <strong>CSS motion</strong> is a few instructions the browser already understands, so there is nothing extra to load. The trade-off is simpler moves: ring, beat, spin, float, nudge.`)}
${motionGrid(['bell-ring', 'heart', 'loader', 'refresh'], 'duo', 'Pure CSS motion, no player. Pause them with the button, or switch on reduce motion and they stay still.', { trigger: 'loop' })}

${h2('The animated icon libraries, one by one')}

${h3('1. Lordicon: best for rich, illustrated motion')}
${p(`The best-known animated icon library: over 49,000 icons, animated by hand in After Effects, 9,700+ of them free. On a website you use its free <code>&lt;lord-icon&gt;</code> player (npm <code>@lordicon/element</code>) with triggers like hover, click, loop and morph, and you can change colours and stroke weight. Exports include Lottie, GIF, MP4, SVG and PNG.`)}
${p(`<strong>The catch:</strong> the free licence allows commercial use but requires credit to the author. PRO costs $8 a month billed yearly ($16 billed monthly). If detail and character matter most, Lordicon is the one to beat. Our ${L.alt('lordicon', 'Lordicon alternative page')} goes deeper.`)}

${h3('2. LottieFiles: best for sheer variety')}
${p('The home of the Lottie format and a huge community library. Its icons category listed 2,077 free icon animations when we checked, as Lottie JSON, dotLottie, GIF or MP4. Free public files come under the Lottie Simple License: commercial use allowed, credit encouraged but not required. Paid plans add editing, hosting and team tools.')}
${p('<strong>The catch:</strong> the animations come from many creators, so ten icons may not match. Brilliant for one hero animation, less so for a whole interface.')}

${h3('3. IconScout: best when you also need 3D and illustrations')}
${p('A large marketplace for icons, 3D assets, illustrations and Lottie. Its pricing page lists 1.6M+ animations in Lottie JSON, GIF, MP4 and After Effects formats, plus a colour editor. Its help centre says attribution is mandatory for free animations. The Individual plan is $14.99 per user a month billed yearly.')}

${h3('4. Icons8: best for animated icons that match Icons8 styles')}
${p(`Icons8 lists 7,800 animated icons in GIF, Lottie JSON and After Effects formats. They match its static styles. Free use requires a link to icons8.com; a paid plan removes it. Our ${L.alt('icons8', 'Icons8 alternative page')} covers its licence in more detail.`)}

${h3('5. useAnimations: best free Lottie icons for React')}
${p('useAnimations offers 300 free micro animations as Lottie files, each with a built-in interaction (loop, click toggle, hover and so on). It is MIT licensed, attribution is appreciated but not required, and you can install icons with npm (<code>react-useanimations</code>), add them with the shadcn CLI or use the JSON in any Lottie player. Its docs also say what each interaction does when reduced motion is preferred, which few libraries spell out.')}

${h3('6. lucide-animated and Animate UI: best for shadcn/ui projects')}
${p(`If your app already uses ${L.alt('lucide', 'Lucide')} through shadcn/ui, these feel native. <strong>lucide-animated</strong> describes itself as 350+ animated React icons based on Lucide and powered by Motion (the animation library once called Framer Motion). You add one icon at a time with the shadcn CLI, it animates on hover by default, and it is MIT licensed. Community ports exist for Svelte, Vue, Angular and Flutter.`)}
${p('<strong>Animate UI</strong> is a wider kit of animated shadcn/ui parts that includes Lucide icons animated with Motion, under MIT with the Commons Clause (use it in any product, but do not sell the components). Both need React, so they are not for slides or no-code sites.')}

${h3('7. with icons: best for every icon moving, in every style')}
${p(`All ${N_ICONS} of our icons come with their own motion that matches the meaning: the bell rings from its hook, the heart beats. The motion is plain CSS, so it works in every one of the ${N_STYLES} styles (${N_SVGS} SVGs), from simple ${L.style('line', 'line')} to ${L.style('glass', 'glass')} and soft 3D. Icons can also turn into each other: play into pause, menu into close.`)}
${swapGrid([['play', 'pause'], ['menu', 'close'], ['sun', 'moon'], ['lock', 'unlock'], ['heart', 'heart@solid']], 'line', 'Tap a tile to switch it, tap again to switch back.')}
${p(`Every icon page downloads the moving version as animated SVG, GIF, MP4, WebM or Lottie, MIT with no credit. Developers add the optional <code>@withicons/motion</code> package.`)}
${styleRow('bell', `The ${L.icon('bell')} icon in eight of its ${N_STYLES} styles. Hover or tap one: it swings the same way in each, because the motion moves the drawing, not one style.`, { motion: 'hover', styles: ['line', 'solid', 'duo', 'gloss', 'glass', 'soft3d', 'kawaii', 'pixel'] })}
${prosCons('with icons', {
  pros: [
    ['Every icon can move', `All ${N_ICONS} have their own loop and hover motion, so a whole interface animates in one consistent way.`],
    ['Light and player-free', 'The motion is CSS, roughly half a kilobyte per icon, with no Lottie player to load.'],
    ['No credit, ever', 'Icons, motion and downloads are MIT licensed for personal and commercial use.'],
  ],
  cons: [
    ['Fewer icons', `${N_ICONS} icons is small next to Lordicon, IconScout or Icons8, and there are no brand logos.`],
    ['Simpler motion', 'CSS moves like ring, beat, spin and nudge cannot match a hand-animated Lordicon or LottieFiles illustration.'],
  ],
})}

${h2('What is the best Lordicon alternative?')}
${p('It depends on why you are leaving:')}
${ul([
  '<strong>You do not want to give credit:</strong> useAnimations, lucide-animated and with icons are MIT. Free LottieFiles animations do not require credit either.',
  '<strong>You build with React and shadcn/ui:</strong> lucide-animated or useAnimations drop straight in.',
  '<strong>You want the same illustrated, multi-colour look:</strong> IconScout and Icons8 are closest, but both ask for a credit or link on their free plans.',
  `<strong>You want every icon in a set to move, in many styles:</strong> with icons. See them all on the ${L.page('free/animated-icons.html', 'free animated icons page')}.`,
])}

${h2('Are animated icons accessible?')}
${p('They can be. Motion on screen makes some people dizzy or sick, so devices have a “reduce motion” setting that websites can read with <code>prefers-reduced-motion</code>. WCAG 2.2.2 also asks for a way to pause anything that moves on its own for more than five seconds.')}
${p(`useAnimations documents its reduced-motion behaviour, and <code>@withicons/motion</code> stops every animation when reduce motion is on. Lordicon and lucide-animated did not cover it in the docs we read, so test with the setting on. For CSS-animated icons, one rule does the job:`)}
${code(`@media (prefers-reduced-motion: reduce) {
  .animated-icon { animation: none; transition: none; }
}`, 'css')}
${p(`A Lottie player is a script, so that CSS rule cannot stop it: check the media query in your code and tell the player not to play. Our ${L.post('accessible-icons', 'guide to accessible icons')} covers labels and contrast too.`)}

${h2('When do animated icons help, and when do they hurt?')}
${p(`Motion helps when it means something (a tap worked, a state changed, something is loading) and hurts when it loops for decoration. Our post ${L.post('animated-icons', 'Animated icons: when they help, when they hurt')} covers it in depth. The one rule to keep:`)}
${doDont('<p>Animate one or two icons per screen, on hover, tap or once, and let them come to rest.</p>', '<p>Copy a demo page full of looping icons onto your site. Ten moving icons read as noise.</p>')}
${motionGrid(['trophy', 'rocket', 'gift', 'party-popper'], 'gloss', 'Hover or tap: gloss celebration icons play once, then stop. Right for a launch slide or a success screen.', { size: 48, trigger: 'hover' })}

${h2('How do you get free animated icons right now?')}
${steps([
  ['Pick your format first', 'Website: CSS or animated SVG. Rich app motion: Lottie. Slides and email: GIF. Video: MP4.'],
  ['Check the credit rule', 'Lordicon, IconScout and Icons8 want a credit or link on free plans. The others here do not.'],
  [`Try with icons in a minute`, `Open the ${L.page('free/animated-icons.html', 'free animated icons page')}, pick a style, and download the GIF for slides or copy the animated SVG for your site.`],
  ['Add motion in code if you need it', `Follow the ${L.guide('animate-icons', 'how to animate icons guide')}: install <code>@withicons/motion</code> and add a class, or see every preset on the ${L.page('developers.html#motion-presets', 'developer page')}.`],
])}
${figure('xanim3', 'Motion draws the eye like light in a long exposure. Spend it carefully.')}

${h2('Our picks, in one sentence each')}
${ul([
  '<strong>Lordicon</strong> for the richest illustrated motion, if you can credit or pay.',
  '<strong>LottieFiles</strong> for one special animation with no credit requirement.',
  '<strong>IconScout</strong> if you also need 3D icons and illustrations.',
  '<strong>Icons8</strong> if you already use Icons8 styles and can link back.',
  '<strong>useAnimations</strong> for free MIT Lottie micro interactions in React.',
  '<strong>lucide-animated or Animate UI</strong> for shadcn/ui and Lucide apps.',
  `<strong>with icons</strong> for every icon moving in light CSS, in ${N_STYLES} styles, with no credit. For still icons, see the ${L.post('best-free-icon-libraries', 'best free icon libraries')}.`,
])}
${cta('Icons that move, free', `${N_ICONS} icons in ${N_STYLES} styles, each with its own motion. Download animated SVG, GIF, MP4 or Lottie. No sign-up, MIT licensed.`, ['bell-ring', 'heart', 'rocket', 'sparkles', 'loader', 'star'])}
`,
}
