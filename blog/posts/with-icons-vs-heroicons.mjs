import { p, h2, h3, ul, figure, iconGrid, styleRow, sizeRamp, table, yes, no, meh, verdict, callout, stats, cta, faceOff, rivalStyles, prosCons, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

const N_CREATIVE = N_STYLES - 3 // everything beyond line, solid and duo
const HERO_COUNT = 316 // heroicons.com, checked October 2026

export default {
  slug: 'with-icons-vs-heroicons',
  category: 'comparisons',
  date: '2026-10-02',
  hero: 'hero2',
  stickers: [['zap', 'solid'], ['ruler', 'blueprint'], ['star', 'gloss']],
  title: 'with icons vs Heroicons: two small icon sets, compared honestly',
  cardTitle: 'with icons vs Heroicons',
  h1: 'with icons vs Heroicons: <em>small</em> and polished, but in different ways',
  dek: `Heroicons comes from the team behind Tailwind CSS. with icons comes in ${N_STYLES} styles. Both are compact, free and carefully drawn. Here is how to choose between them.`,
  description: `with icons vs Heroicons with the real icons side by side: 316 icons in four sizes vs ${N_ICONS} in ${N_STYLES} styles, MIT licences, Tailwind CSS, and honest pros and cons.`,
  keywords: ['with icons vs Heroicons', 'Heroicons alternative', 'Heroicons license', 'Tailwind icons', 'Heroicons mini micro', 'Heroicons pros and cons', 'free icon library'],
  about: ['Heroicons', 'with icons', 'Tailwind CSS', 'Icon library'],
  related: ['with-icons-vs-lucide', 'icon-sizes-guide', 'icon-styles-explained'],
  tldr: [
    '<strong>Pick Heroicons</strong> if you build with Tailwind CSS and want icons hand-tuned for very small sizes: 316 icons in Outline, Solid, Mini (20px) and Micro (16px).',
    `<strong>Pick with icons</strong> if you want more icons and more looks from one family: ${N_ICONS} icons in ${N_STYLES} styles (line, solid, duo and ${N_CREATIVE} creative styles such as glass, pixel and retro), ${N_SVGS} SVGs in all.`,
    'Both are free and MIT licensed, with no visible credit needed. Both work with Tailwind classes, because both use the current text colour.',
    'Heroicons has official React and Vue packages. with icons will add Svelte, Angular, Solid, a web component and CSS classes (packages launching soon).',
    `with icons has more icons (${N_ICONS} vs 316), but the bigger difference is extra sizes (Heroicons: 4 versions of each icon) versus extra styles (with icons: ${N_STYLES}).`,
  ],
  faq: [
    { q: 'Is Heroicons free for commercial use?', a: 'Yes. Heroicons is released under the MIT licence, so you can use the icons in commercial websites, apps and products. You do not need a visible credit; keep the licence notice if you redistribute the source code.' },
    { q: 'How many icons does Heroicons have?', a: 'The Heroicons website lists 316 icons. Each one comes in Outline and Solid at 24px, plus Mini (20px) and Micro (16px) versions designed for small spaces.' },
    { q: 'What is the best Heroicons alternative?', a: `It depends on what you miss. If you like Heroicons’ calm look but want more icons and more styles, with icons gives you ${N_ICONS} icons in ${N_STYLES} matching styles (line, solid, duo and ${N_CREATIVE} creative styles) under the same MIT licence. If you need many more icons in one outline style, Lucide is bigger, with over 1,600.` },
    { q: 'Who makes Heroicons?', a: 'Heroicons is made by the makers of Tailwind CSS (Tailwind Labs). The website credits Steve Schoger and the Tailwind team for the design.' },
    { q: 'Does with icons work with Tailwind CSS?', a: 'Yes. with icons use currentColor and accept a className, so Tailwind classes such as size-6 and text-rose-500 work the same way they do with Heroicons. The npm packages are launching soon; you can copy SVG code from any icon page today.' },
    { q: 'Heroicons vs Lucide: which is better?', a: 'Heroicons is smaller (316 icons) and offers solid versions plus hand-tuned 20px and 16px sizes. Lucide is larger (over 1,600 icons) with a single adjustable outline style and packages for many more frameworks. Heroicons suits Tailwind projects; Lucide suits projects that need range.' },
  ],
  sources: [
    { title: 'Heroicons website (icon count, styles, licence, checked October 2026)', url: 'https://heroicons.com' },
    { title: 'Heroicons on GitHub (README, packages, contribution policy)', url: 'https://github.com/tailwindlabs/heroicons' },
    { title: 'npm: @heroicons/react (latest release 2.2.0)', url: 'https://www.npmjs.com/package/@heroicons/react' },
    { title: 'Heroicons Figma file', url: 'https://www.figma.com/community/file/1143911270904274171' },
    { title: 'Lucide website (icon count, checked October 2026)', url: 'https://lucide.dev' },
    { title: `with icons library (${N_ICONS} icons, ${N_STYLES} styles, 19 categories)`, url: 'https://withicons.com/icons.html' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">Pick Heroicons if you build with Tailwind CSS and want icons hand-tuned for tiny spaces: 316 icons in Outline, Solid, Mini (20px) and Micro (16px). Pick ${L.icons('with icons')} if you want more icons and more looks from one family: ${N_ICONS} icons in ${N_STYLES} matching styles, from a plain line to hand-drawn sketch and 16-bit pixel art. Both are free, MIT licensed and need no visible credit.</span>`)}
${p(`Most icon comparisons are David vs Goliath: a few hundred icons against many thousands. This one is different. The two sets are in the same league (Heroicons has 316 icons, with icons has ${N_ICONS}, about ${N_ICONS - HERO_COUNT} more), and both were drawn with a lot of care. In one sentence: <strong>Heroicons gives you extra sizes, with icons gives you extra styles.</strong> Which matters more depends on what you are building.`)}

${h2('How do Heroicons and with icons compare?')}
${table(['', 'with icons', 'Heroicons'], [
  ['Price', yes('Free'), yes('Free')],
  ['Licence', yes('MIT, no visible credit'), yes('MIT, no visible credit')],
  ['Number of icons', yes(`${N_ICONS} icons × ${N_STYLES} styles = ${N_SVGS} SVGs`), '316 icons in 4 versions'],
  ['Styles', yes(`${N_STYLES}: line, solid and duo, plus ${N_CREATIVE} creative styles such as glass, pixel and retro`), meh('2 looks: outline and solid')],
  ['Hand-tuned small sizes', meh('One 24px drawing; use solid when small'), yes('Mini (20px) and Micro (16px)')],
  ['Framework packages', meh('React, Vue, Svelte, Angular, Solid, web component (launching soon)'), meh('React and Vue')],
  ['Plain CSS classes', yes('<code>&lt;i class="with with-home"&gt;</code>'), no('No, SVG or components only')],
  ['Ready for slides and docs', yes('Copy image, PNG and SVG in any colour'), meh('Copy SVG or JSX from the site')],
  ['Help for AI assistants', yes('MCP server, llms.txt, agent skill'), no('None official found')],
], 'with icons and Heroicons, side by side (checked October 2026)')}

${h2('What do Heroicons look like next to with icons?')}
${p('Here are twelve everyday icons from the official Heroicons package, each under the matching with icons icon. Both names are shown, because Heroicons often uses more descriptive names than we do.')}
${faceOff('heroicons', { caption: 'Outline vs line. Heroicons outlines use a 1.5px stroke and our line style uses 1.75px, so Heroicons looks a touch finer and ours a touch sturdier. The house is a nice match: both sets draw the roof as a line that overhangs the walls. Notice the names too: Heroicons calls settings cog-6-tooth and search magnifying-glass.' })}
${p('Filled icons are where both sets show their weight. Here is Heroicons Solid next to our solid style:')}
${faceOff('heroicons', { variant: 'solid', ourStyle: 'solid', concepts: ['home', 'bell', 'heart', 'star', 'user', 'settings'], caption: 'Solid vs solid. Both sets fill the shape and cut small details out of it (look at the door of the house), which keeps them readable when small. This is the look to use for an active tab or a selected button in either set.' })}

${h2('What is Heroicons?')}
${p('Heroicons is a free set of SVG icons made by the people behind Tailwind CSS, the popular way to style websites with small ready-made classes. The website credits Steve Schoger and the Tailwind team for the design, and you can feel it: the icons are crisp, balanced and calm.')}
${p('Every icon comes in four versions:')}
${ul([
  '<strong>Outline</strong>: 24 × 24 pixels with a 1.5px line. For buttons, menus and most interface work.',
  '<strong>Solid</strong>: 24 × 24 pixels, filled in. For active states and emphasis.',
  '<strong>Mini</strong>: a solid version redrawn for 20 × 20 pixels, for small buttons and form fields.',
  '<strong>Micro</strong>: a solid version redrawn for 16 × 16 pixels, for tiny labels and dense tables.',
])}
${rivalStyles('heroicons', ['home', 'heart', 'star', 'bell', 'settings'], 'The four Heroicons versions of five icons. Mini and Micro are not just smaller copies: look closely and the shapes are simplified so they stay clear at 20px and 16px.')}
${p('Developers get official React and Vue packages. Everyone else can copy the SVG straight from heroicons.com, and designers can use the official Figma file.')}

${h2('What is with icons?')}
${p(`with icons is a free set of ${N_ICONS} everyday icons. Each one is drawn by hand once, on a 24 × 24 grid, then rendered into ${N_STYLES} styles by a program. Because every style comes from the same drawing, they match perfectly: you can use line in the menu, solid for the active tab and gloss on the landing page, and it still looks like one family. Three of the styles (line, solid and duo) are for everyday interfaces; the other ${N_CREATIVE} are creative styles, from frosted glass and puffy stickers to 70s retro and gold-and-enamel luxe.`)}
${styleRow('star')}
${p('Compare that row with the Heroicons rows above. Heroicons covers the first two looks, outline and solid. Everything after that is new territory.')}
${stats([[`${N_ICONS}`, 'everyday icons'], [`${N_STYLES}`, 'matching styles'], ['19', 'categories'], ['MIT', 'no credit needed']])}

${h2('Sizes vs styles: what is the real difference?')}
${p(`Put simply: Heroicons gives you 4 versions of each icon, tuned for size. with icons gives you ${N_STYLES} styles of each icon, tuned for mood.`)}
${h3('Why Heroicons redraws for small sizes')}
${p('When you shrink an icon to 16 pixels, thin lines get fuzzy and small gaps close up. The professional fix is to redraw the icon for that size: simpler shapes, thicker parts, bigger gaps. Heroicons does exactly that with Mini and Micro. It is careful, unglamorous work, and it is a real strength.')}
${h3('How with icons handles small sizes')}
${p(`with icons draws each icon once at 24px and does not have separate Mini or Micro drawings. For small spaces, our advice is to use the ${L.style('solid')}: filled shapes stay readable at 16px far better than outlines. Here is how a few icons hold up as they shrink:`)}
${sizeRamp(['home', 'bell', 'search', 'settings'], [16, 20, 24, 32], 'solid', 'with icons solid at 16, 20, 24 and 32 pixels. Filled shapes keep their meaning when space is tight.')}
${p(`If you design a lot of dense tables or tiny chips, Heroicons’ hand-tuned sizes are a genuine advantage. If most of your icons sit at 20px or larger, extra styles are likely to be more useful to you. Our ${L.post('icon-sizes-guide', 'icon sizes guide')} goes deeper on picking the right size.`)}
${figure('tabler2', 'Dashboards are full of small icons. At 16px, a filled shape usually beats an outline.')}

${h2('Is Heroicons free for commercial use?')}
${p('Yes. Heroicons uses the <strong>MIT licence</strong>, the same one with icons uses. In everyday words: you can use the icons in websites, apps, client projects and products you sell. You do not have to show a credit. The only rule is that if you share the source code itself, you keep the short licence notice with it.')}
${p(`So on price and licence, this is a tie. Neither set has a paid tier, and neither will surprise you later. Our ${L.page('license.html', 'license page')} has the with icons text, and ${L.post('free-icons-commercial-use', 'this guide')} explains icon licences in general.`)}

${h2('Do Heroicons and with icons work with Tailwind CSS?')}
${p('Yes, both do. Heroicons and Tailwind CSS are made by the same team, so they fit together naturally. You size an icon with a class like <code>size-6</code> and colour it with <code>text-sky-500</code>, because the icon simply uses the current text colour.')}
${p('with icons works the same way. Our icons use the current text colour too and accept a <code>className</code>, so your Tailwind classes keep working if you switch. Heroicons components end in <code>Icon</code> (like <code>HomeIcon</code>); with icons exports both <code>Home</code> and <code>HomeIcon</code>, which makes the swap gentle.')}
${callout('note', `The with icons npm packages are launching soon. Today you can copy SVG code from any icon page. Our ${L.alt('heroicons', 'Heroicons alternative page')} has a full name map (you saw a few pairs above: <code>cog-6-tooth</code> becomes settings, <code>arrow-down-tray</code> becomes download, and <code>x-mark</code> becomes close) and a converter for your imports.`)}

${h2('Which is better for landing pages and slides?')}
${p('Heroicons is built for interfaces, and it stays there on purpose. Its outline and solid looks are perfect for a navigation bar, a little less exciting on a big hero section or a pitch deck.')}
${p(`This is where with icons’ extra styles earn their keep. ${L.style('engrave')} gives an icon a carved, premium feel. ${L.style('blueprint')} looks like a technical drawing, great for engineering and product pages. ${L.style('sketch')} looks hand-drawn, perfect for education and friendly brands. And colourful newcomers like ${L.style('glass')}, ${L.style('sticker')} and ${L.style('retro')} bring a bit of fun to launch pages and social posts.`)}
${iconGrid(['rocket', 'shield-check', 'zap', 'users', 'chart-line', 'globe'], 'engrave', 'A product feature row in the engrave style. Same icon names you would use in the app, dressed up for the homepage.')}
${p(`Every with icons page also has <strong>Copy image</strong> and <strong>PNG download</strong> in any colour, so you can paste an icon into ${L.guide('keynote', 'Keynote')}, ${L.guide('powerpoint', 'PowerPoint')} or ${L.guide('word-google-docs', 'Word and Google Docs')} without touching code.`)}

${h2('Can you use Heroicons and with icons together?')}
${p('Yes, and both licences are happy with it. A common, tidy split is to keep Heroicons inside your Tailwind app, where it already fits, and use with icons for the places Heroicons does not try to reach: the marketing site, feature illustrations, onboarding screens and sales decks.')}
${p(`The thing to avoid is mixing them inside one small area. As the side-by-side shows, the line weights (1.5px vs 1.75px) and corner shapes differ a little. Side by side in the same toolbar, that difference shows. Spread across different pages, nobody will notice. Our guide to ${L.post('consistent-icons', 'keeping icons consistent')} has more simple rules like this.`)}

${h2('What are the pros and cons of Heroicons and with icons?')}
${p('Neither set is “better” overall. They are good at different things, and both have honest limits. Here they are in plain words.')}
${prosCons('Heroicons', {
  lib: 'heroicons',
  pros: [
    ['Hand-tuned tiny sizes', 'Mini (20px) and Micro (16px) versions are redrawn, not just shrunk, so icons stay crisp in dense tables, chips and small buttons.'],
    ['Made by the Tailwind team', 'If your site uses Tailwind CSS, Heroicons matches its look and works with its classes out of the box.'],
    ['Outline and solid for every icon', 'Each icon has a matching filled version, which is perfect for showing which tab or button is active.'],
    ['Stable and mature', 'The team accepts bug fixes but not new icon requests, and the latest React package (2.2.0) came out in November 2024. Nothing changes under your feet.'],
    ['Free and simple', 'MIT licence, no credit needed, plus an official Figma file for designers.'],
  ],
  cons: [
    ['Only two looks', 'Outline and solid are it (Mini and Micro are smaller solid versions). There are no tinted, glossy or hand-drawn styles for a landing page or a slide.'],
    ['A small set that will not grow much', 'There are 316 icons, and because new icon requests are not accepted, a missing icon will probably stay missing.'],
    ['Official packages for React and Vue only', 'For Svelte, Angular and other frameworks you copy the SVG yourself or rely on unofficial packages.'],
    ['Little help for AI assistants', 'We found no official MCP server or llms.txt, so AI tools have to guess icon names.'],
  ],
})}
${prosCons('with icons', {
  pros: [
    [`${N_STYLES} styles of every icon`, `Line, solid and duo for interfaces, plus ${N_CREATIVE} creative styles such as gloss, glass, sketch, pixel and retro, all from one drawing, so your app, homepage and slides match.`],
    ['More icons to choose from', `${N_ICONS} icons, about ${N_ICONS - HERO_COUNT} more than Heroicons, each with 20 to 30 hand-picked colour palettes for the multi-colour styles.`],
    ['Easy for non-developers', `Every icon page has Copy image, a PNG download in any colour and size, and an SVG download, plus guides for ${L.guide('google-slides', 'Google Slides')}, ${L.guide('canva', 'Canva')} and more.`],
    ['More ways to use it in code', 'Besides React and Vue, there are Svelte, Angular and Solid components, a web component and plain CSS classes (launching soon).'],
    ['Built for AI helpers', 'An MCP server, an llms.txt file and an agent skill help AI assistants pick real icon names.'],
  ],
  cons: [
    ['No hand-tuned tiny sizes', 'Each icon is drawn once at 24px. At 16px the solid style holds up well, but it is not a custom redraw like Heroicons Micro.'],
    ['Still a focused catalogue, no logos', `${N_ICONS} icons cover everyday needs, but big sets like Lucide have far more, and like Heroicons there are no brand logos.`],
    ['Packages are not live yet', 'The npm packages and CDN are launching soon. Today you copy or download icons from each icon page.'],
    ['Newer, with a smaller community', 'Fewer tutorials and examples exist so far. The creative styles are also meant for 32px or larger, not tiny interface icons.'],
  ],
})}
${p('Who does each one suit? Heroicons is a great fit for developers building a dense Tailwind app in React or Vue who want stable, polished icons at every small size. with icons suits founders, marketers, teachers and small teams who want the same icons in their app, on their homepage and in their slides, or who work outside React and Vue.')}

${h2('So, should you use Heroicons or with icons?')}
${verdict({
  a: ['with icons', [`You want ${N_STYLES} styles from one family, not two.`, `You want more icons to pick from (${N_ICONS} vs 316).`, 'You also make landing pages, slides and docs.', 'You use Svelte, Angular, Solid or plain HTML classes.', 'You want an MCP server so AI assistants find real icon names.']],
  b: ['Heroicons', ['You build with Tailwind and want the matching house style.', 'You need icons redrawn for 20px and 16px.', 'You want a mature, stable set that rarely changes.']],
})}
${p(`Heroicons and with icons are cousins in spirit: small, careful and free. Heroicons spends its effort on sizes, so it shines in tight, dense interfaces. with icons spends its effort on styles, so the same icon can live in your app, your homepage and your next presentation. Compare a few more options in ${L.post('with-icons-vs-lucide', 'with icons vs Lucide')} and ${L.post('icon-styles-explained', 'our guide to icon styles')}.`)}
${cta(`Try ${N_STYLES} styles of the same star`, `Search ${N_ICONS} free icons, switch styles in one click, and copy a PNG or SVG straight into your project.`, ['star', 'zap', 'rocket', 'heart', 'lightbulb', 'sparkles'])}
`,
}
