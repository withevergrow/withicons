import { p, h2, h3, ul, figure, iconGrid, styleRow, sizeRamp, table, yes, no, meh, callout, steps, doDont, cta, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

export default {
  slug: 'what-is-an-icon-library',
  category: 'basics',
  date: '2026-10-03',
  hero: 'xlib5',
  stickers: [['library', 'gloss'], ['layout-grid', 'duo'], ['search', 'solid']],
  title: 'What is an icon library? A plain-English guide for non-designers',
  cardTitle: 'What is an icon library?',
  h1: 'What is an icon library? <em>A plain-English guide</em> for non-designers',
  dek: 'A friendly explainer of what an icon library is, what comes inside one, free vs paid, how to pick one and how to use it in slides, documents, websites and apps.',
  description: 'An icon library is a set of matching icons with names, file formats and a licence. Learn what is inside one, free vs paid options and how to choose and use one.',
  keywords: ['what is an icon library', 'icon library meaning', 'icon set vs icon library', 'free icon library', 'how to choose an icon library', 'icon library for beginners'],
  about: ['Icon library', 'Icon (computing)', 'Software license', 'Open-source software'],
  related: ['best-free-icon-libraries', 'free-icons-commercial-use', 'icon-styles-explained'],
  tldr: [
    'An <strong>icon library</strong> is a collection of small pictures (icons) drawn to match each other, with names, file formats and a licence that says how you may use them.',
    'Inside you usually get: the icons, one or more <strong>styles</strong> (outline, solid and so on), <strong>formats</strong> such as SVG and PNG, searchable <strong>names</strong>, and a <strong>licence</strong>.',
    'Using one library instead of random icons from the web keeps your work <strong>consistent</strong> and your use <strong>legal</strong>.',
    'Many good libraries are free. Open-source ones (MIT, ISC, Apache 2.0) need no visible credit; marketplace free plans usually ask for a credit or link.',
    `To choose, check that it has the icons you need, a style that fits, the formats your apps accept, and a clear licence. Examples: with icons (${N_ICONS} icons in ${N_STYLES} styles), Font Awesome, Material Symbols, Lucide and Tabler.`,
  ],
  faq: [
    { q: 'What is an icon library?', a: 'An icon library is a collection of icons drawn to match each other, with a name for each icon, files in formats such as SVG and PNG, and a licence that says how you may use them. You pick an icon by name and it looks right next to every other icon in the set.' },
    { q: 'What is the difference between an icon library and an icon set?', a: 'In everyday use they mean almost the same thing. “Icon set” usually means the drawings themselves, while “icon library” often also includes the website, search, downloads, code packages and documentation that help you use them.' },
    { q: 'Are icon libraries free?', a: 'Many are. Open-source libraries such as with icons, Lucide, Heroicons, Phosphor and Tabler are free under MIT or ISC licences with no visible credit needed. Marketplaces such as Flaticon and The Noun Project have free plans that require a credit, and paid plans that remove it.' },
    { q: 'Can I use icons from an icon library in commercial work?', a: 'Usually yes, but check the licence. MIT, ISC and Apache 2.0 allow commercial use with no visible credit. CC BY and most marketplace free plans allow commercial use too, as long as you credit the creator or link back.' },
    { q: 'Do I need to be a developer to use an icon library?', a: 'No. Most libraries have a website where you search for an icon and then copy or download it as an SVG or PNG, which works in PowerPoint, Google Slides, Canva, Word and website builders. Code packages are an extra for developers.' },
    { q: 'Should I mix icons from different libraries?', a: 'Try not to. Different libraries use different line thickness, corner shapes and sizes, so mixed icons look slightly off next to each other. If you must mix, keep each library to its own area of your product.' },
  ],
  sources: [
    { title: 'Font Awesome Free licence (GitHub)', url: 'https://github.com/FortAwesome/Font-Awesome/blob/7.x/LICENSE.txt' },
    { title: 'Font Awesome plans (which styles are free)', url: 'https://fontawesome.com/plans' },
    { title: 'Google Fonts: Material Symbols guide (count, styles, licence)', url: 'https://developers.google.com/fonts/docs/material_symbols' },
    { title: 'Lucide website and licence (ISC)', url: 'https://lucide.dev/license' },
    { title: 'Heroicons website (icon count, styles, licence)', url: 'https://heroicons.com' },
    { title: 'Phosphor Icons on GitHub (six weights, MIT)', url: 'https://github.com/phosphor-icons/homepage#readme' },
    { title: 'Tabler Icons README on GitHub (count, licence)', url: 'https://github.com/tabler/tabler-icons' },
    { title: 'Flaticon pricing (count, free plan with credit)', url: 'https://www.flaticon.com/pricing' },
    { title: 'Noun Project legal and licences (free icons under CC BY 3.0)', url: 'https://thenounproject.com/legal/' },
    { title: 'Icons8 licence (free with a link)', url: 'https://icons8.com/license' },
    { title: 'The MIT License (Open Source Initiative)', url: 'https://opensource.org/license/mit' },
    { title: 'Creative Commons: CC BY 4.0 deed', url: 'https://creativecommons.org/licenses/by/4.0/' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">An icon library is a collection of small, simple pictures (icons) that are drawn to match each other, with a name for every icon, ready-to-use files and a licence that tells you how you may use them. Think of it as a font, but for pictures: you pick an icon by name, and it looks right next to every other icon in the set.</span>`)}
${p('If you have ever hunted for “a little calendar picture” for a slide and ended up with five icons that do not quite match, an icon library is the fix. This guide explains what is inside one, why it beats grabbing random images, what is free, and how to pick and use one, with no design or coding background needed.')}

${h2('What is an icon library, in plain English?')}
${p('Imagine a box of stickers where every sticker was drawn by the same hand, with the same pen, at the same size. Whichever ones you pull out, they look like a family. An icon library is that box, in digital form.')}
${p(`Each icon stands for one idea: a ${L.icon('home', 'house')} for the home page, a ${L.icon('search', 'magnifying glass')} for search, a ${L.icon('bell')} for notifications. Because they share the same grid, line thickness and corner style, a page or slide full of them looks calm and professional instead of patched together.`)}
${iconGrid(['home', 'search', 'bell', 'calendar', 'mail', 'settings', 'user', 'heart'], 'line', 'Eight icons from one library. Same size, same line, same rounded corners: that sameness is the whole point.')}

${h2('What is inside an icon library?')}
${p('Most libraries give you the same five ingredients. Here is what each one means for you.')}
${ul([
  `<strong>The icons.</strong> Anything from a few hundred to many thousands of drawings. ${L.icons('with icons')} has ${N_ICONS}, covering everyday interfaces, slides and documents.`,
  `<strong>Styles.</strong> The same icon drawn in different looks, such as outline (lines only) or solid (filled in). Some libraries offer one style; with icons offers ${N_STYLES}, from plain ${L.style('line', 'Line')} to playful ${L.style('kawaii', 'Kawaii')}.`,
  `<strong>Formats.</strong> The file types you can use. SVG stays sharp at any size and can be recoloured; PNG works almost everywhere. (Our ${L.post('svg-vs-png-icons', 'SVG vs PNG guide')} explains when to use which.)`,
  '<strong>Names and search words.</strong> Every icon has a name, like <code>trash</code>, and good libraries also understand everyday words, so typing “bin” or “delete” still finds it.',
  '<strong>A licence.</strong> The legal permission that says whether you can use the icons in commercial work and whether you must credit the creator.',
])}
${styleRow('rocket', `One ${L.icon('rocket')} icon, seven looks. A library with several styles lets you keep the same icons but change the mood.`, { styles: ['line', 'solid', 'duo', 'gloss', 'sketch', 'kawaii', 'sticker'] })}
${p('Many libraries add extras on top: copy and download buttons, plugins for Figma or Google Slides, and code packages for developers. Nice to have, but the five ingredients above are what matter.')}

${h2('Why use an icon library instead of random icons from the web?')}
${p('Searching an image site for “phone icon” and taking whatever looks fine works once. It falls apart by the tenth icon, for three reasons.')}
${ul([
  '<strong>Consistency.</strong> Icons from different sources have different line weights, corners and sizes. Side by side, the difference is obvious, even to people who cannot name it.',
  '<strong>Legal certainty.</strong> A random image may have no licence at all, or one that forbids commercial use. A library states its licence once, for every icon.',
  '<strong>Coverage and speed.</strong> When you need a matching “calendar” next week, it is already there, in the same style, under an obvious name.',
])}
${doDont('<p>Pick one library, search it by plain words, and use its icons everywhere: slides, website, documents. Your work will look like it came from one team.</p>', '<p>Mix a thin outline phone from one site with a chunky filled envelope from another and a 3D clip-art bell. Each is fine alone; together they look accidental.</p>')}
${figure('xlib2', 'Like a real library, an icon library is only useful if things are easy to find and you are allowed to take them home.')}

${h2('Are icon libraries free?')}
${p('Many of the best ones are. Icon libraries come in three broad kinds, and the main difference is not price but what you owe in return.')}
${table(['Kind', 'Cost', 'Use without a credit', 'Examples'], [
  ['Open source', yes('Free'), yes('Yes'), `with icons (MIT), Lucide (ISC), Heroicons, Phosphor, Tabler (MIT), Material Symbols (Apache 2.0)`],
  ['Free with credit', yes('Free'), no('Credit or link needed'), 'Flaticon and Icons8 free plans, The Noun Project (CC BY 3.0)'],
  ['Paid or Pro', no('Subscription'), yes('Yes, once paid'), 'Font Awesome Pro, Flaticon Premium, Noun Pro'],
], 'The three kinds of icon library, checked October 2026')}
${p(`Font Awesome sits in between: its free icons use the CC BY 4.0 licence, which normally means giving credit, but its licence says the credit already inside the files is enough. For the full picture, read our ${L.post('free-icons-commercial-use', 'guide to free icons for commercial use')}.`)}
${callout('note', 'Open source does not mean “anything goes”. MIT, for example, asks you to keep the licence notice with copies of the files themselves. It does not ask for a visible credit on your slide or website.')}

${h2('How do you choose an icon library?')}
${p('You do not need a design degree. Run through these six checks, in this order, and you will rarely go wrong.')}
${steps([
  ['Search for your ten must-have icons', 'List the ideas you actually need (for example “invoice”, “team”, “calendar”) and search for each one. A library missing three of them is the wrong library, however pretty it is.'],
  ['Check that the style fits', 'Calm outline icons suit most apps and business slides. Bolder or playful styles suit marketing, kids’ content and hero images. A library with several styles gives you room to grow.'],
  ['Check the formats against your apps', `Websites and PowerPoint love SVG. ${L.guide('google-slides', 'Google Slides')} and email need PNG. Make sure the library offers what your tools accept.`],
  ['Read the licence', 'Can you use it in commercial work? Do you have to credit anyone? If the answer is not on the website in plain words, be careful.'],
  ['Look at ten icons side by side', 'Do the lines look equally thick? Do round and square icons look the same size? If yes, the library was drawn with care.'],
  ['Check it is alive', 'Recent updates, new icons and clear documentation are good signs that it will still be there next year.'],
])}

${h2('How do you use an icon library in slides, documents, websites and apps?')}
${h3('In slides and documents')}
${p(`Search for the icon on the library’s website, then copy it or download it. In with icons every icon page has Copy image, PNG download in any colour, and SVG download. Paste it into ${L.guide('powerpoint', 'PowerPoint')}, ${L.guide('google-slides', 'Google Slides')}, ${L.guide('canva', 'Canva')} or ${L.guide('word-google-docs', 'Word and Google Docs')}. Our ${L.post('icons-in-presentations', 'guide to icons in presentations')} covers sizing and colour.`)}
${h3('On websites')}
${p(`Website builders usually take an uploaded SVG or PNG: see our guides for ${L.guide('wordpress', 'WordPress')}, ${L.guide('webflow', 'Webflow')} and ${L.guide('wix-squarespace', 'Wix and Squarespace')}. On a hand-built site you can paste the SVG code straight into the page. Our ${L.post('how-to-add-icons-to-a-website', 'guide to adding icons to a website')} shows each route.`)}
${h3('In apps')}
${p(`Developers usually install the library as a code package and write something like <code>&lt;Icon name="home" /&gt;</code>. with icons has components for React, Vue, Svelte, Angular and SolidJS plus a web component; the npm packages and CDN are launching soon, so for now copy the SVG from any icon page. See ${L.page('developers.html', 'the developer page')}.`)}
${sizeRamp(['presentation', 'file-text', 'monitor', 'smartphone'], [16, 24, 32, 48], 'duo', 'Slides, documents, websites, apps: one library, the same icons at every size.')}

${h2('What are some examples of icon libraries?')}
${p(`Here are well-known libraries and what each is known for, with honest notes. Our ${L.post('best-free-icon-libraries', 'comparison of the best free icon libraries')} goes deeper, and the ${L.page('alternatives/index.html', 'alternatives pages')} compare each one with with icons.`)}
${table(['Library', 'Free icons', 'Free styles', 'Licence', 'Read more'], [
  ['with icons', `${N_ICONS} (${N_SVGS} SVGs)`, `${N_STYLES}`, 'MIT', L.page('license.html', 'Our licence')],
  ['Font Awesome', 'Over 2,000', '3 (Solid, Regular, Brands)', 'CC BY 4.0 (icons)', L.post('with-icons-vs-font-awesome', 'vs Font Awesome')],
  ['Material Symbols', 'Over 2,500', '3 + adjustable weight and fill', 'Apache 2.0', L.post('with-icons-vs-material-symbols', 'vs Material Symbols')],
  ['Lucide', 'Over 1,600', '1 (adjustable stroke)', 'ISC', L.post('with-icons-vs-lucide', 'vs Lucide')],
  ['Heroicons', '316', 'Outline, solid, mini, micro', 'MIT', L.post('with-icons-vs-heroicons', 'vs Heroicons')],
  ['Phosphor', 'About 1,500', '6 weights', 'MIT', L.post('with-icons-vs-phosphor', 'vs Phosphor')],
  ['Tabler Icons', 'Over 6,000', '2 (outline, filled)', 'MIT', L.post('with-icons-vs-tabler-icons', 'vs Tabler')],
  ['Flaticon', 'Over 18 million icons and stickers', 'Thousands (many artists)', 'Own licence, credit on free plan', L.post('with-icons-vs-flaticon', 'vs Flaticon')],
  ['The Noun Project', 'Millions', 'Thousands (many artists)', 'CC BY 3.0 free; paid licence', L.alt('noun-project', 'Noun Project alternative')],
], 'Popular icon libraries at a glance (checked October 2026)')}
${p('Being honest about trade-offs: if you need brand logos, Font Awesome has them and we do not. If you need thousands of rare icons, Tabler or a marketplace like Flaticon has far more. If you are building an Android app, Material Symbols matches the platform.')}
${p(`Where with icons stands out is one tidy set for code, slides and documents, in ${N_STYLES} styles, with no credit line. You can also ${L.page('ai.html', 'ask AI assistants to pick icons')} from the real list.`)}

${h2('The bottom line')}
${p('An icon library is a box of matching pictures with clear names and clear rules. Pick one that has the icons you need, in a style you like, in files your apps accept, under a licence you understand, then use it everywhere. Your slides, documents and website will instantly look more consistent.')}
${cta('Try an icon library in 30 seconds', `Search ${N_ICONS} free icons in ${N_STYLES} styles by plain words, then copy or download. MIT licensed, no sign-up, no credit needed.`, ['library', 'search', 'download', 'palette', 'presentation', 'sparkles'])}
`,
}
