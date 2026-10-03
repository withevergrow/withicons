import { p, h2, ul, figure, icon, iconGrid, styleRow, table, yes, no, meh, callout, steps, stats, doDont, code, cta, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

// Small light/dark "screens": the icons inherit each panel's text colour (currentColor), exactly as they would on a real page.
const panel = (bg, fg, label, names, style = 'line', size = 30) => `<div style="flex:1 1 200px;min-width:0;background:${bg};color:${fg};border-radius:12px;padding:16px;border:1px solid rgba(127,127,127,.25)"><div style="display:flex;flex-wrap:wrap;gap:14px;justify-content:center">${names.map(n => icon(n, style, size)).join('')}</div><p style="margin:12px 0 0;font-size:.8rem;text-align:center;color:${label[1]}">${label[0]}</p></div>`
const screens = (panels, caption) => `<figure class="b-icons"><div style="display:flex;flex-wrap:wrap;gap:12px">${panels.join('')}</div><figcaption>${caption}</figcaption></figure>`
const SET = ['home', 'search', 'bell', 'mail', 'settings', 'user']

export default {
  slug: 'dark-mode-icons',
  category: 'basics',
  date: '2026-10-03',
  hero: 'xdark5',
  stickers: [['moon', 'glass'], ['sun-moon', 'duo'], ['lamp', 'solid']],
  title: 'Icons in dark mode: what changes and how to get it right',
  cardTitle: 'Icons in dark mode',
  h1: 'Icons in <em>dark mode</em>: what changes and how to get it right',
  dek: 'Icons that look perfect on white can vanish, glow or look clumsy on a dark screen. Here is what actually changes, in plain words, and a simple checklist to get it right.',
  description: 'How icons behave in dark mode: why they look bolder, how currentColor makes them follow the theme, contrast checks, which styles hold up and why PNGs vanish.',
  keywords: ['dark mode icons', 'icons in dark mode', 'dark mode icon design', 'icon contrast dark background', 'currentColor dark mode', 'prefers-color-scheme icons', 'PNG icon invisible dark mode', 'irradiation illusion'],
  about: ['Dark mode', 'Icons', 'Color contrast', 'Web Content Accessibility Guidelines', 'Irradiation illusion'],
  related: ['accessible-icons', 'how-to-change-icon-color', 'icon-styles-explained'],
  tldr: [
    '<strong>In dark mode, icons must switch to a light colour</strong>, and they look slightly bolder than the same icon on white, because bright shapes on dark spread a little in your eye.',
    '<strong>Use icons drawn with <code>currentColor</code></strong>: they take the text colour, so when your page turns dark, every icon follows without a second set of files.',
    '<strong>Check contrast on the dark background too</strong>: meaningful icons need at least 3:1 (WCAG 2.2). A cobalt blue that scores 5.17:1 on white drops to 3.62:1 on dark grey.',
    '<strong>Prefer a dark grey background and an off-white icon</strong> over pure black and pure white. It is easier on the eyes and looks less harsh.',
    '<strong>Watch out for black PNGs on transparent backgrounds</strong>: on a dark page they almost disappear (about 1:1 contrast). Use SVG, or a mid-tone or light PNG.',
  ],
  faq: [
    { q: 'Why do my icons disappear in dark mode?', a: 'Usually because they are black PNGs with a transparent background. On a dark page, a black icon has almost no contrast (about 1:1), so it vanishes. Use an SVG that follows the text colour, or download the PNG in a light or mid-tone colour.' },
    { q: 'Do icons need to be redesigned for dark mode?', a: 'Not redesigned, but rechecked. The same drawing works if its colour switches to light and it keeps enough contrast. Some designers use a slightly thinner line or an off-white colour in dark mode, because light shapes on dark look a little heavier.' },
    { q: 'What colour should icons be in dark mode?', a: 'An off-white or light grey (for example #E5E5E5) on a dark grey background works for most interface icons. Coloured icons often need a lighter, softer version of the light-mode colour to keep enough contrast.' },
    { q: 'How much contrast do icons need in dark mode?', a: 'The same rule as light mode: WCAG 2.2 asks for at least 3:1 between a meaningful icon and its background. Apple asks app makers for at least 4.5:1 between colours and suggests aiming for 7:1 for small text.' },
    { q: 'Should dark mode use pure black backgrounds?', a: 'Many guidelines suggest dark grey instead. Google’s Material Design recommends #121212 as the base dark surface, partly because shadows and depth are easier to see on grey than on black.' },
    { q: 'Do multi-colour icons work in dark mode?', a: 'Yes, but check them. In with icons, most multi-colour styles take their outline from the text colour and their fills from a palette. Pick a palette marked for dark pages, or set the palette colours in your dark theme.' },
  ],
  sources: [
    { title: 'W3C: Understanding WCAG 2.2 Success Criterion 1.4.11 Non-text Contrast', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html' },
    { title: 'W3C: Understanding WCAG 2.2 Success Criterion 1.4.3 Contrast (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html' },
    { title: 'Apple Human Interface Guidelines: Dark Mode', url: 'https://developer.apple.com/design/human-interface-guidelines/dark-mode' },
    { title: 'Material Design (M2): Dark theme', url: 'https://m2.material.io/design/color/dark-theme.html' },
    { title: 'Wikipedia: Irradiation illusion', url: 'https://en.wikipedia.org/wiki/Irradiation_illusion' },
    { title: 'Nielsen Norman Group: Dark Mode vs. Light Mode: Which Is Better? (2020)', url: 'https://www.nngroup.com/articles/dark-mode/' },
    { title: 'Bureau of Internet Accessibility: Dark Mode Can Improve Text Readability, But Not for Everyone', url: 'https://www.boia.org/blog/dark-mode-can-improve-text-readability-but-not-for-everyone' },
    { title: 'MDN Web Docs: prefers-color-scheme', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme' },
  ],
  body: () => `
${p(`<span class="lede">In dark mode, an icon has to switch from a dark colour to a light one, keep enough contrast with the new background, and it will look a touch bolder than it did on white. The easiest way to get this right is to use SVG icons that follow the text colour (<code>currentColor</code>), test them on the actual dark background, and never ship black PNG icons to a dark page.</span>`)}
${p('That is the whole idea. The rest of this guide explains each part in plain words, with real contrast numbers and a quick testing checklist you can run in five minutes.')}

${h2('What actually changes when icons go dark?')}
${p('Three things change at once, and it helps to keep them apart:')}
${ul([
  '<strong>The colour flips.</strong> Dark icons on a light page become light icons on a dark page. If an icon cannot change colour, it is in trouble.',
  '<strong>The contrast changes.</strong> A colour that stands out on white might blend into dark grey, and the other way round. Every colour needs checking again.',
  '<strong>The weight seems to change.</strong> The very same icon looks slightly thicker and brighter on a dark background. More on that in the next section.',
])}
${screens([
  panel('#FFFFFF', '#1A1A1A', ['Light page, dark icons', '#555555'], SET),
  panel('#121212', '#111111', ['Dark page, icons stuck on black (1.01:1)', '#9A9A9A'], SET),
  panel('#121212', '#E5E5E5', ['Dark page, icons follow the text (14.87:1)', '#9A9A9A'], SET),
], 'The same six line icons on three backgrounds. In the middle, the icons kept their light-mode black and nearly vanish. On the right, they follow the text colour.')}

${h2('Why do icons look bolder on a dark background?')}
${p('It is a quirk of your eyes, not your screen. Light spreads a little as it passes through the eye, so a bright shape on a dark background looks slightly bigger than an identical dark shape on a light background. This is called the <strong>irradiation illusion</strong>. Galileo wrote about it in 1632, and the scientist Hermann von Helmholtz gave it its name in the 1860s.')}
${p('For icons, that means a thin white line on black reads heavier than the same black line on white. There is a related effect called <strong>halation</strong>: some people, especially the many who have astigmatism, see bright lines and letters on dark backgrounds as slightly glowing or blurred.')}
${p('You do not need to redraw anything. Two small tweaks help:')}
${ul([
  '<strong>Use an off-white, not pure white.</strong> A light grey like <code>#E5E5E5</code> on a dark grey background still has huge contrast (14.87:1) and glows less than pure white (18.73:1).',
  `<strong>Consider a slightly lighter line.</strong> Our ${L.style('line')} style uses a 1.75 px outline. If it feels heavy in your dark theme, the editor on every icon page lets you set the line thickness anywhere from 0.75 to 3.`,
])}
${figure('xdark4', 'Bright things on dark backgrounds seem to spread a little. That is why a light icon on a dark screen looks bolder than its twin on white.')}

${h2('How do you make icons follow light and dark mode automatically?')}
${p(`Use icons that are drawn with <code>currentColor</code>. In plain words, that setting means “use the same colour as the text around me”. All three everyday with icons styles, and most of the creative ones, paint their lines this way, so when your page’s text turns light for dark mode, every icon turns light with it. No second set of files, no swapping images.`)}
${p('On a website, dark mode is usually switched on with a small CSS rule that listens to the visitor’s system setting. You only change the text and background colours, and the icons follow:')}
${code(`:root { color: #1A1A1A; background: #FFFFFF; }

@media (prefers-color-scheme: dark) {
  :root { color: #E5E5E5; background: #121212; }
}`)}
${p(`Want to see it live? This Journal has a light and dark switch at the top of the page. Flip it and watch every icon in this article follow. If you are setting up icons for the first time, our ${L.post('how-to-add-icons-to-a-website', 'guide to adding icons to a website')} and the ${L.guide('html', 'HTML guide')} show the copy and paste route, and ${L.post('how-to-change-icon-color', 'how to change an icon’s colour')} covers every app.`)}

${h2('How much contrast do icons need in dark mode?')}
${p('Exactly as much as in light mode. The web accessibility standard, WCAG 2.2, asks for at least <strong>3:1</strong> contrast between an icon and its background when people need the icon to understand the page or use a button. Text needs 4.5:1. Apple’s guidelines for apps are stricter: no lower than 4.5:1 between colours, and 7:1 is the target for small text in custom colours.')}
${p('The surprise is that colours do not behave the same way on both backgrounds. Here are real measurements against white and against <code>#121212</code>, the dark grey that Google’s Material Design recommends as a dark surface:')}
${table(['Icon colour', 'On white', 'On dark grey #121212', 'Works in dark mode?'], [
  ['Near black <code>#111111</code>', '18.88:1', '1.01:1', no('Invisible')],
  ['Cobalt blue <code>#2F5BFF</code>', '5.17:1', '3.62:1', meh('Passes 3:1, weaker')],
  ['Mid grey <code>#808080</code>', '3.95:1', '4.74:1', yes('On both')],
  ['Tomato <code>#FF5A36</code>', '3.10:1', '6.04:1', yes('Better on dark')],
  ['Light grey <code>#9CA3AF</code>', 'about 2.5:1', '7.38:1', yes('Dark only')],
  ['Off-white <code>#E5E5E5</code>', 'about 1.3:1', '14.87:1', yes('Dark only')],
], 'Contrast ratios calculated with the WCAG formula, October 2026')}
${p('Material Design also suggests softer, less saturated colours on dark surfaces, because very bright, saturated colours can seem to vibrate against dark grey. In practice: if your brand blue looks harsh or dim in dark mode, use a lighter, slightly greyer version of it there.')}
${callout('tip', 'A mid-tone grey such as #808080 passes 3:1 on both white (3.95:1) and dark grey (4.74:1). It is a handy colour for PNG icons that must work in both modes, like Notion pages or email signatures.')}

${h2('Which icon styles hold up best in dark mode?')}
${p(`Every one of our ${N_ICONS} icons comes in ${N_STYLES} styles (${N_SVGS} SVGs), and most of them take their outline colour from the text. But they do not all feel the same on a dark page. We rendered them on dark backgrounds and here is our honest read:`)}
${table(['Style', 'In dark mode', 'Why'], [
  [L.style('line'), yes('Great'), 'Clean outline in your text colour. Looks a little bolder, as explained above.'],
  [L.style('solid'), yes('Great'), 'Strong filled shapes. The small cut-out details show the background, so they stay crisp.'],
  [L.style('duo'), yes('Great'), 'The soft tint is the icon colour at low strength, so it turns into a subtle glow on dark.'],
  [L.style('sketch'), yes('Good'), 'Hand-drawn lines read like chalk on a board.'],
  [L.style('blueprint'), yes('Good'), 'Light lines on dark is how real blueprints look. Use it at 32 px or larger.'],
  [L.style('sticker'), yes('Good'), 'The white die-cut border makes each sticker pop off a dark page.'],
  [L.style('gloss'), meh('Different'), 'Its shine is cut out of the shape, so on dark the highlights show the background and read as grooves.'],
  [L.style('engrave'), meh('Large only'), 'Fine hatching lines can merge at small sizes. Keep it big.'],
], 'How a few with icons styles behave on a dark background (our own test, October 2026)')}
${styleRow('moon', `The ${L.icon('moon')} icon in every style this page can show. Switch this Journal to dark mode and look again: the single-colour styles follow the text colour.`)}
${p(`For the bigger picture of what each style is for, see ${L.post('icon-styles-explained', 'icon styles explained')}.`)}

${h2('What happens to multi-colour icons and palettes in dark mode?')}
${p(`Multi-colour styles such as ${L.style('sticker')}, ${L.style('kawaii')}, ${L.style('glass')} and ${L.style('retro')} have two kinds of colour. In kawaii, retro and pixel, the outline (we call it the ink) follows your text colour, so it flips in dark mode like any other icon. Sticker keeps a dark ink outline inside its white die-cut border, which is exactly why it reads on any background. The fill colours come from a palette, and those stay the colours you chose. They do not darken by themselves. A few richer styles, such as ${L.style('luxe')} and ${L.style('skeuo')}, use fixed material colours like gold, brass and leather that look the same on any background.`)}
${p('Most palettes are designed to read on white, and many look fine on dark too. For dark pages, with icons gives every icon 20 to 30 hand-picked palettes, and every single icon has at least one marked “for dark pages”, usually a neon or midnight set. You can filter for them in the palette picker, and preview any icon on a dark background before you download.')}
${p('On a website you can also swap the palette colours for dark mode, because each one is a named CSS setting:')}
${code(`@media (prefers-color-scheme: dark) {
  :root { --with-glass-back: #7C9CFF; }
}`)}
${screens([
  panel('#FFFFFF', '#1A1A1A', ['Sticker on a light page', '#555555'], ['heart', 'star', 'rocket', 'gift'], 'sticker', 40),
  panel('#121212', '#E5E5E5', ['Sticker on a dark page', '#9A9A9A'], ['heart', 'star', 'rocket', 'gift'], 'sticker', 40),
], 'The same sticker icons on light and dark. The candy colours and dark ink outline stay the same; the white border helps them stand out on both.')}

${h2('Why do PNG icons disappear in dark mode?')}
${p(`A PNG has its colour baked in. A black icon on a transparent background looks great on a white slide, but drop it on a dark page and it nearly vanishes: black on <code>#121212</code> is about 1:1 contrast. This is the most common dark mode problem we see, especially in Notion pages, email signatures and apps that switch theme for you.`)}
${doDont('<p>Use SVG wherever you can, so the icon follows the theme. Where you must use PNG, pick a mid-tone that passes on both backgrounds, or keep a light and a dark version.</p>', '<p>Upload a black PNG with a transparent background to a page that might be viewed in dark mode. Half your readers will see an empty space.</p>')}
${p(`Every icon page in ${L.icons('with icons')} lets you choose the PNG colour before you download, so making a white or mid-grey version takes seconds. Our ${L.guide('notion', 'Notion guide')} and ${L.guide('email-signatures', 'email signature guide')} cover those two cases, and ${L.post('svg-vs-png-icons', 'SVG vs PNG icons')} explains the file types.`)}

${h2('How should you test icons in dark mode?')}
${steps([
  ['Switch the whole system', 'Turn on dark mode in your phone or computer settings, not only in one app. That is how real visitors arrive.'],
  ['Look at real size', 'Check icons at the size people see them, like 16 to 24 px in menus. Problems hide when you zoom in.'],
  ['Measure the risky colours', 'Run brand colours, greys and disabled states through a free contrast checker against the dark background. Aim for 3:1 or more.'],
  ['Check every state', 'Hover, selected, disabled and error icons often use special colours. Each one needs a dark version.'],
  ['Try accessibility settings', 'Apple suggests testing dark mode with Increase Contrast and Reduce Transparency turned on, separately and together.'],
  ['Hunt for PNGs', 'Scroll through docs, emails and help pages for black PNG icons that went missing.'],
])}
${stats([['3:1', 'minimum contrast for meaningful icons'], ['#121212', 'Material’s suggested dark surface'], ['1.01:1', 'black icon on dark grey'], ['14.87:1', 'off-white #E5E5E5 on dark grey']])}
${iconGrid(['moon', 'sun', 'sun-moon', 'lamp', 'lightbulb', 'eye'], 'duo', 'Light and dark themed icons in the Duo style, handy for a theme switch.')}
${p(`Dark mode is not a nice extra any more. Plenty of people use it all day, while others find light mode easier to read: Nielsen Norman Group found that people with normal vision usually read small text better in light mode. That is why the best answer is to support both and let people choose. For more on making icons work for everyone, read ${L.post('accessible-icons', 'our guide to accessible icons')}.`)}
${cta('Icons that follow your theme', `${N_ICONS} free icons in ${N_STYLES} styles, drawn with currentColor so they switch with light and dark mode. Copy SVG, download PNG in any colour. MIT licensed.`, ['moon', 'sun', 'sun-moon', 'lamp', 'eye', 'sparkles'])}
`,
}
