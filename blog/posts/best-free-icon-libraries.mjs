import { p, h2, h3, ul, figure, iconGrid, styleRow, table, yes, no, meh, callout, stats, steps, cta, doDont, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

export default {
  slug: 'best-free-icon-libraries',
  category: 'guides',
  date: '2026-10-02',
  hero: 'best4',
  stickers: [['award', 'gloss'], ['layout-grid', 'duo'], ['star', 'solid']],
  title: 'The best free icon libraries in 2026, compared',
  cardTitle: 'The best free icon libraries in 2026',
  h1: 'The best free icon libraries in 2026, <em>compared</em>',
  dek: 'Ten popular icon libraries, one honest table. What each one is best for, what it costs, whether you need to give credit, and a simple way to choose.',
  description: 'A fair, plain-English look at 10 free icon libraries in 2026: Font Awesome, Material Symbols, Lucide, Tabler, with icons and more, plus how to choose.',
  keywords: ['best free icon libraries', 'free icon sets 2026', 'icon library comparison', 'free icons for commercial use', 'Lucide vs Heroicons vs Tabler', 'open source icons'],
  about: ['Icon library', 'Open-source software', 'Font Awesome', 'Material Symbols', 'Lucide', 'Tabler Icons'],
  related: ['free-icons-commercial-use', 'icon-styles-explained', 'with-icons-vs-font-awesome'],
  tldr: [
    'There is no single best free icon library. The right one depends on <strong>what you are making</strong> and <strong>how many icons you need</strong>.',
    '<strong>Biggest free MIT sets:</strong> Tabler Icons (over 6,200) and Hugeicons (6,000+ free). <strong>Most famous:</strong> Font Awesome. <strong>Best for Android:</strong> Material Symbols.',
    '<strong>Best for React and shadcn/ui:</strong> Lucide. <strong>Best for Tailwind:</strong> Heroicons. <strong>Most weights:</strong> Phosphor (6). <strong>Best for Bootstrap:</strong> Bootstrap Icons.',
    `<strong>Best for one set across code, slides and docs, in ${N_STYLES} styles, with no credit:</strong> with icons (our own set, ${N_ICONS} icons, ${N_SVGS} SVGs).`,
    'Marketplaces like Flaticon and Icons8 have millions of icons, but their free plans ask for a credit or a link back.',
  ],
  faq: [
    { q: 'What is the best free icon library?', a: `It depends on the job. Tabler Icons and Hugeicons offer the most free MIT icons, Lucide is the favourite for React and shadcn/ui, Material Symbols suits Android and Material Design, and with icons is best if you want one matching set for websites, slides and docs in ${N_STYLES} styles with no credit.` },
    { q: 'Which free icon libraries do not require attribution?', a: 'Lucide (ISC), Heroicons, Phosphor, Tabler, Bootstrap Icons, Hugeicons’ free set and with icons (all MIT) need no visible credit. Material Symbols (Apache 2.0) says credit is appreciated but not required. Font Awesome Free is CC BY 4.0, but the credit already inside its files counts. Flaticon and Icons8 free plans do require a credit or link.' },
    { q: 'What is the largest free icon library?', a: 'Among open-source sets in this list, Tabler Icons (over 6,200 counting filled versions) and Hugeicons (6,000+ free icons) are the largest. Marketplaces like Flaticon (over 18 million icons and stickers) are far bigger, but their free use comes with attribution.' },
    { q: 'Can I use free icon libraries for commercial projects?', a: 'All ten libraries in this guide allow commercial use. The differences are in the conditions: some need no credit at all, some ask for a credit or link on the free plan, and paid plans usually remove that requirement.' },
    { q: 'Can I mix two icon libraries on one website?', a: 'You can, but different line weights and corner styles often look slightly off next to each other. If you must mix, keep each set to its own area, such as one for the app and one for the marketing pages.' },
    { q: 'Which icon library is best for PowerPoint and Google Slides?', a: 'Any library with PNG or SVG downloads works. with icons adds a Copy image button and PNG downloads in any colour, which is the quickest route into slides. Flaticon and Icons8 have huge choice but ask for a credit on free plans.' },
  ],
  sources: [
    { title: 'Font Awesome Free licence (GitHub)', url: 'https://github.com/FortAwesome/Font-Awesome/blob/7.x/LICENSE.txt' },
    { title: 'Font Awesome plans', url: 'https://fontawesome.com/plans' },
    { title: 'Google Fonts: Material Symbols guide', url: 'https://developers.google.com/fonts/docs/material_symbols' },
    { title: 'google/material-design-icons (GitHub)', url: 'https://github.com/google/material-design-icons' },
    { title: 'Lucide website and licence', url: 'https://lucide.dev' },
    { title: 'shadcn/ui: components.json (iconLibrary)', url: 'https://ui.shadcn.com/docs/components-json' },
    { title: 'Heroicons website', url: 'https://heroicons.com' },
    { title: 'Phosphor homepage README (GitHub)', url: 'https://github.com/phosphor-icons/homepage' },
    { title: '@phosphor-icons/core 2.1.1 (icon counts)', url: 'https://unpkg.com/@phosphor-icons/core@2.1.1/' },
    { title: 'Tabler Icons README (GitHub)', url: 'https://github.com/tabler/tabler-icons' },
    { title: 'Bootstrap Icons website', url: 'https://icons.getbootstrap.com' },
    { title: 'Hugeicons pricing', url: 'https://hugeicons.com/pricing' },
    { title: 'npm: @hugeicons/core-free-icons (MIT licence, free count)', url: 'https://www.npmjs.com/package/@hugeicons/core-free-icons' },
    { title: 'Flaticon pricing', url: 'https://www.flaticon.com/pricing' },
    { title: 'Icons8 licence', url: 'https://icons8.com/license' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">There are more free icon libraries than ever, and most “best of” lists just rank them by size. That is not how real people choose. A teacher making slides, a founder building a landing page and a developer wiring up a React app need very different things.</span>`)}
${p(`So instead of a fake “number one”, this guide gives each of ten popular libraries a <strong>best for</strong> label, a plain-English summary and the facts that matter: how many icons, which styles, which licence, and whether you need to give credit. Then a short decision guide helps you pick in a couple of minutes.`)}
${callout('note', `Full disclosure: we make ${L.icons('with icons')}, one of the libraries below. We have tried hard to be fair, we say where others are better, and every competitor fact comes from the library’s own website, GitHub or npm page, checked in October 2026.`, 'Who wrote this')}

${h2('The big comparison table')}
${table(['Library', 'Best for', 'Free icons', 'Free styles', 'Licence', 'Credit needed?'], [
  ['with icons', 'One set for code, slides and docs', `${N_ICONS} (× ${N_STYLES} styles = ${N_SVGS} SVGs)`, `${N_STYLES} (3 interface + ${N_STYLES - 3} creative)`, 'MIT', yes('No')],
  ['Font Awesome', 'Brand logos, the classic <code>&lt;i&gt;</code> tag', 'Over 2,000', '3 (Solid, Regular, Brands)', 'CC BY 4.0 (icons)', meh('Built into the files')],
  ['Material Symbols', 'Android and Material Design apps', 'Over 2,500', '3 + adjustable fill and weight', 'Apache 2.0', yes('No (appreciated)')],
  ['Lucide', 'React and shadcn/ui projects', 'Over 1,800', '1 (adjustable stroke)', 'ISC', yes('No')],
  ['Heroicons', 'Tailwind CSS projects', '316', '4 sizes (outline, solid, mini, micro)', 'MIT', yes('No')],
  ['Phosphor', 'Many weights of one icon', 'About 1,500', '6 weights', 'MIT', yes('No')],
  ['Tabler Icons', 'Maximum free MIT breadth', 'Over 6,200', '2 (outline, filled)', 'MIT', yes('No')],
  ['Bootstrap Icons', 'Bootstrap websites', 'Over 2,000', 'Outline + fill versions', 'MIT', yes('No')],
  ['Hugeicons', 'Big rounded set with a paid upgrade', '6,000+', '1 free (10 in Pro)', 'MIT (free set)', yes('No')],
  ['Flaticon / Icons8', 'One-off, illustrated or rare icons', 'Millions', 'Thousands / 130+', 'Own licences', no('Yes, on free plans')],
], 'Ten popular free icon libraries at a glance (checked October 2026). “Free styles” counts what you get without paying.')}

${h2('How we compared them')}
${p('We looked at each library the way a busy, non-specialist person would:')}
${ul([
  '<strong>Licence and credit</strong>: can you use it for work, and do you have to show a credit line?',
  '<strong>Size</strong>: how many free icons, quoted the way the library itself states it.',
  '<strong>Styles</strong>: how many looks you get for free (outline, filled, weights and so on).',
  '<strong>Outside code</strong>: how easy it is to get an icon into slides, docs or Canva.',
  '<strong>Developer setup</strong>: packages, classes and fonts, for the readers who code.',
])}
${p(`If licence words like MIT, ISC or CC BY are new to you, our guide ${L.post('free-icons-commercial-use', 'Can I use free icons commercially?')} explains them in plain English.`)}

${h2('The ten libraries, one by one')}

${h3('1. with icons: best for one set across code, slides and docs')}
${p(`Our own set takes a different approach from everyone else here. We drew <strong>${N_ICONS} everyday icons</strong> once each, then rendered every drawing into <strong>${N_STYLES} styles</strong>: line, solid and duo for interfaces, plus ${N_STYLES - 3} creative styles for presentations, hero sections and posters, from glossy, glassy and engraved to pixel, retro, kawaii and hand-drawn sketch. That is ${N_SVGS} SVGs that always match. Each icon also has 20 to 30 hand-picked colour palettes and optional motion, and 50 “Live” icons show content you set, like dates and counts.`)}
${styleRow('star')}
${p(`Everything is MIT licensed with no credit. Every icon page has Copy image, PNG (any size and colour) and SVG downloads, plus guides for ${L.guide('powerpoint', 'PowerPoint')}, ${L.guide('canva', 'Canva')} and more. For developers there are React, Vue, Svelte, Angular and Solid components, a web component and CSS classes; the npm packages and CDN are launching soon. <strong>Where others win:</strong> ${N_ICONS} icons is still small next to Tabler, Hugeicons or Font Awesome. No brand logos, no niche icons.`)}

${h3('2. Font Awesome: best for brand logos and the classic setup')}
${p(`The most famous icon set on the web. The free set has over 2,000 icons in Solid, Regular (for some icons) and Brands, which includes logos like GitHub and Visa that most open-source sets skip. Free icons use CC BY 4.0, but Font Awesome says the credit already in its files is enough. Pro plans start at $48 a year and unlock many more icons and styles. Read our full ${L.post('with-icons-vs-font-awesome', 'with icons vs Font Awesome')} comparison.`)}

${h3('3. Material Symbols: best for Android and Material Design apps')}
${p(`Google’s own set: over 2,500 icons in Outlined, Rounded and Sharp, delivered as a variable font with adjustable fill, weight, grade and optical size. It is free under Apache 2.0, and Google says attribution is appreciated but not required. Perfect when you want your app to feel at home on Android; less ideal if you want your own distinct look. See ${L.post('with-icons-vs-material-symbols', 'with icons vs Material Symbols')}.`)}

${h3('4. Lucide: best for React and shadcn/ui projects')}
${p(`A community-built fork of the older Feather icons, with a clean, consistent outline style. The site listed 1,857 icons when we checked, and there are official packages for nearly every framework. It is the default icon set in shadcn/ui, a hugely popular component kit, which makes it a natural pick for React developers. One adjustable stroke style, ISC licence (similar to MIT), no credit needed. Our ${L.alt('lucide', 'Lucide alternative page')} compares it in detail.`)}

${h3('5. Heroicons: best for Tailwind CSS projects')}
${p(`Made by the team behind Tailwind CSS. A small, polished set of 316 icons in four versions: Outline, Solid, Mini (20px) and Micro (16px), each drawn for its size. MIT licence, official React and Vue packages. If your site uses Tailwind, these icons will feel right at home. More on our ${L.alt('heroicons', 'Heroicons alternative page')}.`)}

${h3('6. Phosphor: best for many weights of the same icon')}
${p(`About 1,500 icons, each in six weights: Thin, Light, Regular, Bold, Fill and Duotone. That flexibility is lovely when you want hairline icons in one place and bold ones in another. MIT licence, and packages that reach beyond the web to mobile and desktop. See our ${L.alt('phosphor', 'Phosphor alternative page')}.`)}

${h3('7. Tabler Icons: best for maximum free MIT breadth')}
${p(`The warehouse of free outline icons: over 6,200 counting filled versions, on a 24 × 24 grid with a 2px line, with packages for most frameworks. MIT, no credit, and optional paid bundles if you want to support the project. If you keep needing rare icons, start here. Read ${L.post('with-icons-vs-tabler-icons', 'with icons vs Tabler Icons')}.`)}

${h3('8. Bootstrap Icons: best for Bootstrap websites')}
${p(`The official icon set of Bootstrap, the popular website toolkit, though it works without Bootstrap too. Over 2,000 icons on a 16px grid, many with outline and filled versions, and an easy web font. MIT licence. A safe, simple choice for classic websites. More on our ${L.alt('bootstrap-icons', 'Bootstrap Icons alternative page')}.`)}

${h3('9. Hugeicons: best for a big rounded set with a paid upgrade path')}
${p('A newer library with a generous free tier: 6,000+ icons in one “Stroke Rounded” style, published under MIT on npm. The paid Pro plan ($99 a year, or a one-time Pro Plus licence) unlocks over 60,000 icons in 10 styles. A good fit if you like soft, rounded lines and might want many more styles later.')}

${h3('10. Flaticon and Icons8: best for one-off, illustrated or rare icons')}
${p(`These are <strong>marketplaces</strong> rather than icon sets. Flaticon lists over 18 million icons and stickers from many artists; its free plan asks you to credit the author, and Premium ($99 a year for US customers) removes that. Icons8 offers over 1.3 million icons in 130+ styles; free use requires a link back to icons8.com, and paid plans remove the link. Brilliant for a specific illustration, less ideal for a whole matching interface. Our ${L.post('with-icons-vs-flaticon', 'with icons vs Flaticon')} post explains attribution in detail.`)}
${figure('best0', 'A big box of pencils is wonderful, as long as you pick colours that work together. Icon libraries are the same.')}

${h2('Open-source set or marketplace: what is the difference?')}
${p('An <strong>open-source icon set</strong> (Lucide, Tabler, with icons and most of this list) is one family, designed by one team to the same rules, published under a licence like MIT that lets anyone use it. Icons match each other, and you rarely need to give credit.')}
${p('A <strong>marketplace</strong> (Flaticon, Icons8) is a huge shop of icons from many artists or styles. You get incredible variety, but free use usually comes with a credit or link requirement, and icons from different artists may not match.')}
${p('Some sets sit in between: Font Awesome and Hugeicons have a free open-source tier and a paid Pro tier on top.')}
${stats([['10', 'entries in one table'], ['9', 'open sets with no visible credit'], ['2', 'marketplaces that want a credit or link'], ['$0', 'to try any of them']])}

${h2('How to choose an icon library in five questions')}
${p('Answer these in order. Most people have their answer by question three.')}
${steps([
  ['Are you building on a specific toolkit?', 'Tailwind: try Heroicons. Bootstrap: Bootstrap Icons. shadcn/ui: Lucide. Android or Material Design: Material Symbols. Matching your toolkit saves time.'],
  ['Do you need brand logos?', 'If you need GitHub, Slack or payment logos, Font Awesome’s Brands set is the easy answer. Most other sets, including ours, have none.'],
  ['Do you need rare or very specific icons?', 'For lots of niche icons, go big: Tabler, Hugeicons or Font Awesome. For one special illustration, a marketplace like Flaticon.'],
  ['Will the icons appear outside code?', 'If you also make slides, docs, social posts or Canva designs, pick a set with easy PNG and SVG downloads. with icons was built for this.'],
  ['Do you want more than one look?', `Phosphor gives you six weights of each icon. with icons gives you ${N_STYLES} styles, from simple line to glossy, glassy, pixel, kawaii and hand-drawn.`],
])}
${iconGrid(['code', 'palette', 'layout-dashboard', 'smartphone', 'file-text', 'megaphone'], 'duo', 'Different jobs, different needs: code, design, dashboards, mobile apps, documents and marketing.')}

${h2('Can you mix icon libraries?')}
${p(`Technically yes, since nearly all of these allow it. Visually, be careful. Each set has its own line thickness, corner shapes and proportions, and those small differences add up. Our guide to ${L.post('consistent-icons', 'keeping icons consistent')} goes deeper.`)}
${doDont('<p>Choose one main library and use it everywhere: the app, the website and the slides. Borrow from a second set only for things the first truly lacks, like brand logos.</p>', '<p>Pick each icon from a different library because it was the first search result. The page will feel slightly off, even if nobody can say why.</p>')}
${figure('startup4', 'Most teams pick a library once and live with it for years. Ten minutes of thought now saves a lot of swapping later.')}

${h2('Which free icon library is best for slides and documents?')}
${p(`Most of this list was made for developers, so getting an icon into PowerPoint can mean downloading an SVG, recolouring it in another tool and then inserting it. Material Symbols, Tabler and the marketplaces all offer downloads. with icons adds a <strong>Copy image</strong> button and PNG downloads in any size and colour, so you can paste straight into a slide. Our post on ${L.post('icons-in-presentations', 'icons in presentations')} has tips on sizes and layout.`)}
${iconGrid(['rocket', 'target', 'users', 'trending-up', 'lightbulb', 'trophy'], 'gloss', 'A pitch-deck row in the gloss style, ready to copy into a slide.')}

${h2('Our picks, in one sentence each')}
${ul([
  '<strong>Font Awesome</strong> if you need brand logos or want the most familiar choice.',
  '<strong>Material Symbols</strong> if you build for Android or follow Material Design.',
  '<strong>Lucide</strong> if you use React or shadcn/ui and want a big, clean outline set.',
  '<strong>Heroicons</strong> if you build with Tailwind and need a small, polished set.',
  '<strong>Phosphor</strong> if you want six weights of the same icon.',
  '<strong>Tabler Icons</strong> or <strong>Hugeicons</strong> if you want thousands of free MIT icons.',
  '<strong>Bootstrap Icons</strong> if your site runs on Bootstrap.',
  '<strong>Flaticon or Icons8</strong> if you need one special illustration and do not mind crediting.',
  `<strong>with icons</strong> if you want one set for code, slides and docs, in ${N_STYLES} styles, with no credit. Browse ${L.icons(`all ${N_ICONS} icons`)} to see if it covers what you need.`,
])}
${cta('See if with icons fits your project', `${N_ICONS} icons, ${N_STYLES} styles, MIT licensed. Copy into your slides or code in seconds, no account needed.`, ['award', 'star', 'layout-grid', 'palette', 'sparkles', 'rocket'])}
`,
}
