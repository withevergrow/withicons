import { p, h2, h3, ul, figure, iconGrid, sizeRamp, table, yes, no, meh, callout, steps, stats, doDont, cta, L, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'icon-sizes-guide',
  category: 'basics',
  date: '2026-10-02',
  hero: 'sizes0',
  stickers: [['ruler', 'duo'], ['maximize', 'solid'], ['layout-grid', 'gloss']],
  title: 'What size should icons be? A simple guide for web, apps and slides',
  cardTitle: 'What size should icons be?',
  h1: 'What size should icons be? A simple guide for <em>web, apps and slides</em>',
  dek: '16, 20, 24, 32 or 48 pixels? Here is a friendly guide to picking icon sizes that look sharp and feel right, from tiny table icons to big slide graphics.',
  description: 'A simple guide to icon sizes: 16, 20, 24, 32 and 48 px, matching icons to text, tap targets (WCAG, Apple, Android), and what size PNG to use for slides and print.',
  keywords: ['icon sizes', 'standard icon size', 'what size should icons be', 'icon size for website', 'icon size guidelines', 'touch target size', 'icon size for slides'],
  about: ['Icon design', 'User interface design', 'Web design'],
  related: ['icon-styles-explained', 'accessible-icons', 'svg-vs-png-icons'],
  tldr: [
    '<strong>24 px is the standard icon size</strong> for websites and apps. Most icon sets, including with icons and Google’s Material icons, are designed on a 24 by 24 grid.',
    'Use <strong>16 to 20 px</strong> for small, dense spots (tables, small text), and <strong>32 to 48 px</strong> or more for feature sections, empty states and hero areas.',
    'Match icons to your text: a 24 px icon sits well next to 16 to 18 px text. Stick to two or three sizes across a whole product.',
    'Buttons need room to tap: at least <strong>24 by 24 px</strong> (WCAG 2.2), with Apple recommending 44 by 44 points and Android 48 by 48 dp. Padding does the work, not a bigger icon.',
    'For slides and print, use an SVG, or a PNG at least twice the size you will show it (256 px for slides, 1024 px for big slides and print).',
  ],
  faq: [
    { q: 'What is the standard icon size?', a: '24 by 24 pixels is the most common standard for interface icons. Google’s Material Design uses 24 dp as its standard icon size, and most popular icon sets (including with icons) are drawn on a 24 by 24 grid.' },
    { q: 'What size should icons be on a website?', a: 'Use 24 px for most interface icons, like navigation and buttons. Use 16 to 20 px next to small text or in dense tables, and 32 to 64 px for feature sections and decorative areas.' },
    { q: 'What size should icons be on mobile apps?', a: 'Icons are usually 24 px on mobile, inside a much bigger tap area: Apple recommends 44 by 44 points for controls and Google recommends 48 by 48 dp touch targets on Android.' },
    { q: 'How big should icons be in PowerPoint or Google Slides?', a: 'Large enough to see from the back of the room. Use an SVG where you can (PowerPoint, and newer versions of Keynote) so any size stays sharp. For Google Slides, download a 256 px PNG, or 1024 px if the icon fills a big part of the slide.' },
    { q: 'Should icons be the same size as text?', a: 'A little bigger. A good starting point is an icon about 1.25 to 1.5 times the font size: 20 px icons with 14 px text, 24 px icons with 16 to 18 px text.' },
  ],
  sources: [
    { title: 'Material Design 3: Icons (24 dp standard size)', url: 'https://m3.material.io/styles/icons/applying-icons' },
    { title: 'Google Fonts: Material Symbols guide (optical size 20 to 48 dp)', url: 'https://developers.google.com/fonts/docs/material_symbols' },
    { title: 'Android Developers: touch targets of at least 48 by 48 dp', url: 'https://developer.android.com/guide/topics/ui/accessibility/apps' },
    { title: 'Apple Human Interface Guidelines: Accessibility (control sizes)', url: 'https://developer.apple.com/design/human-interface-guidelines/accessibility' },
    { title: 'Apple Human Interface Guidelines: Images (@2x and @3x)', url: 'https://developer.apple.com/design/human-interface-guidelines/images' },
    { title: 'W3C: Understanding SC 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html' },
    { title: 'W3C: Understanding SC 2.5.5 Target Size (Enhanced)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html' },
    { title: 'Heroicons README (24, 20 and 16 px sets)', url: 'https://github.com/tailwindlabs/heroicons' },
  ],
  body: () => `
${p(`<span class="lede">For most websites and apps, icons should be 24 pixels. Go down to 16 or 20 px for small text and busy tables, and up to 32, 48 px or more for feature sections, empty states and slides. Whatever size you choose, make the button around the icon at least 24 px, and ideally 44 px or more on touch screens.</span>`)}
${p('That covers most decisions. This guide shows what each size looks like, why stroke thickness matters at small sizes, how to match icons to text, and what to do for slides and print.')}
${sizeRamp(['home', 'search', 'bell', 'settings'], [16, 20, 24, 32, 48], 'line', 'The five sizes you will use most, shown at real size in the line style. 24 px is the everyday default.')}

${h2('What is the standard icon size?')}
${p('<strong>24 by 24 pixels.</strong> It is the size most icon sets are designed at, and the one most apps use for menus, toolbars and buttons. Google’s Material Design names 24 dp as its standard icon size, and sets like Lucide, Tabler, Heroicons and with icons are drawn on a 24 by 24 grid.')}
${p('Why 24? It is big enough to hold a clear drawing, small enough to sit next to text, and it divides neatly: half is 12, double is 48. Designers draw icons on that grid so lines land on whole pixels and look crisp.')}
${p('(A quick note on units: “px” on the web, “pt” on Apple devices and “dp” on Android all mean roughly the same thing: a size that looks the same on any screen, no matter how many tiny real pixels it has.)')}
${stats([['24 px', 'the everyday default'], ['16 px', 'the smallest you should go'], ['32 px+', 'for creative styles'], ['44 px', 'a comfortable tap target']])}

${h2('Which icon size should you use where?')}
${table(['Size', 'Use it for', 'Pairs with text of', 'Good styles'], [
  ['<strong>16 px</strong>', 'Inline icons in small text, dense tables, tiny badges', '12 to 14 px', 'Solid, line'],
  ['<strong>20 px</strong>', 'Compact buttons, sidebars, form fields, list items', '14 to 16 px', 'Line, solid, duo'],
  ['<strong>24 px</strong>', 'Navigation, toolbars, standard buttons, mobile tab bars', '16 to 18 px', 'Line, solid, duo'],
  ['<strong>32 px</strong>', 'Feature lists, cards, settings categories', '18 to 24 px headings', 'Any style'],
  ['<strong>48 px+</strong>', 'Feature grids, empty states, hero sections, slides', 'Large headings', 'Any, creative styles shine'],
], 'A simple icon size cheat sheet (our recommendations)')}
${p('Most products only need two or three of these sizes. A common, tidy set is 20 or 24 px for the interface and 48 px for feature sections. More sizes than that usually looks accidental.')}

${h2('Why does line thickness matter at small sizes?')}
${p('An icon file stores its drawing on a 24 by 24 grid. When you show it at a different size, everything scales, including the line. Our line style uses a 1.75 px line at 24 px. Here is what happens to it at other sizes:')}
${table(['Shown at', 'Line becomes', 'How it looks'], [
  ['16 px', 'about 1.2 px', meh('Light, can look faint')],
  ['20 px', 'about 1.5 px', yes('Clear')],
  ['24 px', '1.75 px', yes('As designed')],
  ['32 px', 'about 2.3 px', yes('Clear')],
  ['48 px', '3.5 px', meh('Bold, can look heavy')],
], 'The line style’s stroke at different display sizes')}
${p('At 16 px, the line is barely more than one real pixel, so line icons can look pale or fuzzy. At 48 px and beyond, the line gets chunky. You have three easy options:')}
${ul([
  '<strong>Switch to solid at small sizes.</strong> Filled shapes hold up much better at 16 px.',
  '<strong>Adjust the line.</strong> In the SVG code you can change the <code>stroke-width</code> value. Our code components (launching soon on npm) will have a <code>strokeWidth</code> setting, plus an option that keeps the line the same thickness at any size.',
  '<strong>Use icons drawn for small sizes.</strong> Some sets do this: Heroicons, for example, ships separate solid sets drawn for 20 px and 16 px, and Google’s Material Symbols adjusts its line weight automatically between 20 and 48 dp.',
])}
${sizeRamp(['bell', 'calendar', 'user', 'mail'], [16, 20, 24], 'line', 'Line style at 16, 20 and 24 px. Fine at 20 and up, a touch light at 16.')}
${sizeRamp(['bell', 'calendar', 'user', 'mail'], [16, 20, 24], 'solid', 'The same icons in solid. At 16 px they stay bold and easy to read.')}

${h2('How do you match icon size to text size?')}
${p('Icons should look like they belong to the words beside them. A good starting point is an icon about <strong>1.25 to 1.5 times</strong> your font size. In practice:')}
${ul([
  '14 px text (small labels, tables): a <strong>16 to 20 px</strong> icon.',
  '16 to 18 px text (normal body text and buttons): a <strong>20 to 24 px</strong> icon.',
  '24 px and bigger headings: a <strong>32 px</strong> icon or larger.',
])}
${p('Then line them up. The icon’s middle should sit level with the middle of the text, not with its bottom. Leave a small gap between icon and word, about a third to a half of the icon’s width.')}
${callout('tip', 'Trust your eyes over the numbers. A filled icon looks bigger than a line icon of the same size, so you may want solid icons a pixel or two smaller next to text.')}

${h2('How big should icons be on phones and touch screens?')}
${p('On touch screens, there are two sizes to think about: the size of the <strong>icon</strong> and the size of the <strong>tap target</strong> (the area that responds when you touch it). The icon can stay at 24 px. The target needs to be bigger.')}
${ul([
  '<strong>WCAG 2.2 (criterion 2.5.8, level AA):</strong> at least 24 by 24 CSS pixels, or enough space around smaller targets.',
  '<strong>WCAG 2.2 (criterion 2.5.5, level AAA):</strong> the stricter goal of 44 by 44 CSS pixels.',
  '<strong>Apple:</strong> a default control size of 44 by 44 points on iPhone and iPad (with 28 by 28 as the minimum).',
  '<strong>Google, Android:</strong> touch targets of at least 48 by 48 dp.',
])}
${figure('sizes5', 'Measure twice: the icon can stay small, but the area people tap should be generous.')}
${p(`Use padding around the icon to make the button bigger, rather than making the icon itself huge. For more on this, read our ${L.post('accessible-icons', 'friendly guide to accessible icons')}.`)}

${h2('What size should icons be in slides and documents?')}
${p('Slides are seen from far away, so icons need to be much bigger than on a website. There are no official numbers here, but these starting points work well on a standard 16:9 slide:')}
${ul([
  '<strong>Next to bullet points:</strong> about the height of the bullet text, or a little bigger.',
  '<strong>Above short headings in a feature row:</strong> roughly two to three times the heading height.',
  '<strong>A single “hero” icon on a title slide:</strong> as big as you like. This is where creative styles shine.',
])}
${iconGrid(['rocket', 'target', 'users', 'chart-line'], 'duo', 'A typical slide feature row: four duo icons, all the same size and style, each above a short heading.', { size: 48 })}
${h3('Which file should you use?')}
${p(`Use an SVG wherever the app accepts it (PowerPoint, Word, Canva, Figma and newer versions of Keynote): it stays sharp at any size. Where it does not, like Google Slides and Google Docs, use a PNG and follow the “twice as big” rule: download at least twice the size you will show it. On ${L.icons('with icons')} icon pages you can pick <strong>256 px</strong> for normal slide and doc icons, or <strong>1024 px</strong> for big slides and print. Our ${L.post('svg-vs-png-icons', 'SVG vs PNG guide')} explains why.`)}

${h2('Why download icons at twice the size?')}
${p('Modern screens are sharp. Phones and many laptops pack two or three real pixels into every point you see, which is why Apple asks app makers to supply images at 2x and 3x. A PNG made at exactly the display size can look slightly soft on these screens, and very soft on a projector when the slide is stretched.')}
${p('Print needs even more. Printers usually ask for around 300 pixels per inch, so a 1024 px PNG covers about 3.4 inches (8.7 cm) at full print quality. For anything bigger, like a poster or a banner, use the SVG.')}

${h2('Which icon style works best at each size?')}
${p(`Every style works at large sizes, but only some survive small ones. Line, solid and duo are made for interfaces, from 16 px up. The ${N_STYLES - 3} creative styles (gloss, engrave, glass, luxe, retro, kawaii and the rest) have fine details like highlights, hatching and shadows, so use them at <strong>32 px or larger</strong>. Pixel is a special case: its pixel art is hand-tuned to look crisp at 16, 32 and 48 px. Watch what happens to engrave below 32 px:`)}
${sizeRamp(['trophy', 'rocket', 'heart'], [16, 24, 32, 48, 64], 'engrave', 'Engrave at five sizes. The hatching turns to noise at 16 px and comes alive from 32 px.')}
${p(`See all ${N_STYLES} styles side by side in ${L.post('icon-styles-explained', 'icon styles explained')}.`)}

${h2('How do you choose your icon sizes in four steps?')}
${steps([
  ['Start at 24 px', 'Use 24 px for navigation, toolbars and buttons. It is the standard for a reason.'],
  ['Pick one small and one large size', 'Usually 16 or 20 px for dense areas, and 48 px for features and empty states.'],
  ['Wrap buttons in big targets', 'Make every icon button at least 24 by 24 px, and 44 px or more on touch screens, with padding.'],
  ['Export big for slides', 'SVG where you can, otherwise a PNG at twice the display size: 256 px for slides, 1024 px for print.'],
])}
${doDont('<p>Use two or three sizes across your whole product, and keep every icon in one row the same size.</p>', '<p>Mix 18, 22, 24 and 26 px icons on one screen. Small differences look like mistakes, not choices.</p>')}

${h2('The bottom line')}
${p(`24 px is your friend. Go smaller only for dense, text-heavy spots (and switch to solid if lines look faint), go bigger for anything decorative, and always give buttons a generous tap area. Every icon in ${L.icons('with icons')} is drawn on a 24 by 24 grid and comes as an SVG that scales to any size, plus PNGs at 64, 256 and 1024 px.`)}
${cta('Get icons at the right size', 'Copy any icon, download an SVG, or grab a PNG at 64, 256 or 1024 px in any colour. Free and MIT licensed.', ['ruler', 'maximize', 'layout-grid', 'zoom-in', 'star', 'sparkles'])}
`,
}
