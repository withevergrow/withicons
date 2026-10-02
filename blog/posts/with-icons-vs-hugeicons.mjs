import { p, h2, ul, figure, iconGrid, styleRow, table, yes, meh, callout, stats, cta, faceOff, prosCons, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

export default {
  slug: 'with-icons-vs-hugeicons',
  category: 'comparisons',
  date: '2026-10-02',
  hero: 'huge2',
  stickers: [['layers', 'gloss'], ['coins', 'duo'], ['sparkles', 'sketch']],
  title: `with icons vs Hugeicons: 6,000 free icons or ${N_STYLES} free styles?`,
  cardTitle: 'with icons vs Hugeicons',
  h1: 'with icons vs Hugeicons: a <em>huge</em> free tier, or every style for free?',
  dek: 'Hugeicons gives away thousands of icons in one style and sells the rest. with icons gives away everything, but there is less of it. Here is how to tell which deal suits you.',
  description: 'with icons vs Hugeicons in plain English: the real icons side by side, free icon counts, Pro prices, MIT licences, pros and cons, and which set fits you.',
  keywords: ['with icons vs Hugeicons', 'Hugeicons alternative', 'Hugeicons free', 'Hugeicons free for commercial use', 'Hugeicons Pro price', 'Hugeicons license', 'Hugeicons pros and cons', 'free icon library'],
  about: ['Hugeicons', 'with icons', 'Icon library'],
  related: ['with-icons-vs-lucide', 'best-free-icon-libraries', 'free-icons-commercial-use'],
  tldr: [
    '<strong>Pick Hugeicons</strong> if you want the biggest free catalogue in a single, friendly outline style: over 6,000 Stroke Rounded icons under MIT.',
    `<strong>Pick with icons</strong> if you want many looks for free: ${N_ICONS} icons, each in ${N_STYLES} matching styles (${N_SVGS} SVGs), all MIT, with no paid tier.`,
    'Hugeicons’ other 9 styles (solid, bulk, duotone, twotone and sharp variants) and its 60,000+ Pro icons need a paid plan: $99 a year, or $1,197 one time for Pro Plus.',
    'Both free sets can be used in commercial work without a visible credit. Both offer an MCP server so AI assistants can find real icon names.',
    'If a single outline style is all you need, Hugeicons Free is hard to beat on size. If you want filled, tinted or illustrated icons without paying, with icons is the simpler deal.',
  ],
  faq: [
    { q: 'Is Hugeicons free for commercial use?', a: 'Yes, the free part is. Hugeicons’ free Stroke Rounded icons are released under the MIT License, so you can use them in personal and commercial projects. If you share the source files themselves, keep the MIT notice with them. The Pro icons are a separate product with their own paid licence.' },
    { q: 'How many free icons does Hugeicons have?', a: 'Hugeicons says its free package has over 6,000 icons, all in the Stroke Rounded style. When we downloaded the free npm package (version 4.3.5) in October 2026, it contained a little over 6,000 icon files.' },
    { q: 'Does Hugeicons Free include solid or filled icons?', a: 'No. The free Hugeicons package has one style, Stroke Rounded, which is an outline style. The solid, bulk, duotone, twotone and sharp styles are part of Hugeicons Pro. with icons includes a filled (solid) and a tinted (duo) version of every icon for free.' },
    { q: 'How much does Hugeicons Pro cost?', a: 'When we checked in October 2026, Hugeicons Pro cost $99 a year for one seat, and Pro Plus cost $1,197 as a one-time payment with lifetime access to the files. Both unlock 60,000+ icons in 10 styles. Team seats are priced separately. Check the pricing page for current numbers.' },
    { q: 'Is with icons a good Hugeicons alternative?', a: `It is if you mostly need everyday interface and business icons and you want more than one style without paying. with icons has ${N_ICONS} icons in ${N_STYLES} styles, all free under MIT. If you need thousands of specific icons, Hugeicons Free has about twelve times as many.` },
    { q: 'Hugeicons vs Lucide: which is bigger?', a: 'Hugeicons Free is bigger. It lists over 6,000 free icons, while Lucide lists over 1,600 on GitHub (its website showed 1,857 when we checked). Both are free outline sets. Lucide uses the ISC licence and is the default in shadcn/ui; Hugeicons Free uses MIT.' },
    { q: 'Can I mix Hugeicons and with icons on one page?', a: 'You can, and both licences allow it, but the line weights and corner shapes differ, so mixed icons can look slightly off. Keep each set to its own area of the page, or pick one set per screen.' },
  ],
  sources: [
    { title: 'Hugeicons pricing (checked October 2026)', url: 'https://hugeicons.com/pricing' },
    { title: 'Hugeicons licence agreement', url: 'https://hugeicons.com/license-agreement' },
    { title: 'Hugeicons on GitHub (README and LICENSE.md)', url: 'https://github.com/hugeicons/hugeicons' },
    { title: 'npm: @hugeicons/core-free-icons', url: 'https://www.npmjs.com/package/@hugeicons/core-free-icons' },
    { title: 'npm: @hugeicons/mcp-server', url: 'https://www.npmjs.com/package/@hugeicons/mcp-server' },
    { title: 'Hugeicons documentation', url: 'https://hugeicons.com/docs/' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">Hugeicons vs with icons: which should you use? Choose <strong>Hugeicons</strong> if you want the biggest free set of outline icons: over 6,000 icons in one style, under the MIT licence. Choose <strong>${L.icons('with icons')}</strong> if you want fewer icons (${N_ICONS}) but every one in ${N_STYLES} matching styles, all free under MIT with nothing behind a paywall.</span>`)}
${p(`Hugeicons lives up to its name: its paid catalogue goes past 60,000 icons. But the two sets give you very different things for free. Hugeicons gives you lots of icons in <strong>one</strong> style and sells the other nine. with icons gives you fewer icons, each in <strong>${N_STYLES}</strong> styles, and nothing is locked. Below, we show the real icons side by side and walk through price, licence, looks and tools.`)}

${h2('How do Hugeicons and with icons compare at a glance?')}
${table(['', 'with icons', 'Hugeicons'], [
  ['Price', yes('Free, everything'), meh('Free tier. Pro $99/year or Pro Plus $1,197 one time')],
  ['Free icons', `${N_ICONS} icons × ${N_STYLES} styles = ${N_SVGS} SVGs`, yes('Over 6,000 icons')],
  ['Free styles', yes(`${N_STYLES}: line, solid and duo for interfaces, plus 17 creative styles such as glass, pixel, retro, kawaii and luxe`), meh('1: Stroke Rounded')],
  ['Paid catalogue', 'None, there is nothing to upgrade to', '60,000+ icons in 10 styles'],
  ['Licence of the free icons', yes('MIT, no visible credit'), yes('MIT, no visible credit')],
  ['Developer packages', meh('React, Vue, Svelte, Angular, Solid, web component (launching soon)'), yes('React, Vue, Svelte, Angular, React Native, Flutter and more')],
  ['Copy or download for slides', yes('Copy image, PNG and SVG in any colour'), yes('Copy and download SVG, pick colour and size')],
  ['Help for AI assistants', yes('MCP server, llms.txt, agent skill'), yes('MCP server and an agent skill')],
], 'with icons and Hugeicons, side by side (checked October 2026)')}

${h2('What is Hugeicons?')}
${p('Hugeicons is an icon library built by a design team that sells a Pro plan. Every icon sits on a 24 × 24 grid, and the whole collection comes in ten styles. Hugeicons describes them as Stroke, Solid, Bulk, Duotone and Twotone, across rounded, sharp and standard families.')}
${p('The free part is one of those ten: <strong>Stroke Rounded</strong>, a soft outline style with rounded line ends. It is a genuinely large free set, with over 6,000 icons, released under the MIT licence. Everything else, including the solid and duotone versions of those same icons, is part of Hugeicons Pro.')}
${faceOff('hugeicons', { caption: 'Real Hugeicons Free icons (Stroke Rounded, bottom) next to the with icons line style (top). Both are outline sets on a 24 × 24 grid, so they feel close. Look closer: Hugeicons’ lines are a touch thinner (1.5px against our 1.75px) and its corners softer and rounder, like the pillow-shaped house, while with icons adds small details such as the door. Notice the names too: Hugeicons uses names like Home01Icon and FavouriteIcon, so search its site rather than guess.' })}
${p('Hugeicons also has official packages for most popular frameworks, a free Figma file and plugin, a web app for browsing, and icon pages where you can copy or download an SVG in the colour and size you want.')}

${h2('What is with icons?')}
${p(`with icons is a free icon set from Evergrow. We drew <strong>${N_ICONS} everyday icons</strong> by hand, once each, and a program renders every drawing into ${N_STYLES} styles: three everyday interface styles (line, solid and duo) and 17 creative ones, from frosted glass and 16-bit pixel art to 70s retro, cute kawaii and polished gold luxe. That is why the styles always match: the rocket in the line style is the exact same shape as the rocket in the glossy one. Each icon also comes with 20 to 30 hand-picked colour palettes and optional motion.`)}
${styleRow('rocket')}
${stats([[String(N_ICONS), 'hand-drawn icons'], [String(N_STYLES), 'styles, all free'], [N_SVGS, 'SVG files'], ['0', 'paid tiers']])}

${h2('What does “free” actually get you?')}
${p('This is the heart of the comparison, so let’s be precise. Imagine you are building a dashboard and you want an outline icon for normal buttons and a filled icon for the active tab.')}
${ul([
  '<strong>With Hugeicons Free</strong>, you get the outline (Stroke Rounded) version of thousands of icons. The filled version of the same icon is in Hugeicons Pro.',
  '<strong>With with icons</strong>, you get the outline version (line), the filled version (solid) and a tinted version (duo) of the same icon, plus 17 creative styles. All free.',
])}
${iconGrid(['layout-dashboard', 'chart-bar', 'users', 'calendar-check', 'credit-card', 'bell'], 'line', 'A dashboard menu in the free with icons line style…')}
${iconGrid(['layout-dashboard', 'chart-bar', 'users', 'calendar-check', 'credit-card', 'bell'], 'solid', '…and the same icons in solid, for the active item. Same names, same shapes, no upgrade needed.')}
${p(`So the honest summary is this: Hugeicons Free is <em>wide</em> (about twelve times as many icons, in one style). with icons is <em>deep</em> (fewer icons, ${N_STYLES} styles each). If you only ever need one outline style, the width of Hugeicons is a real advantage.`)}

${h2('Is Hugeicons free for commercial use?')}
${p('Yes, for the free icons. We read the actual licence file in the Hugeicons GitHub repository and in the free npm package: it is the standard <strong>MIT License</strong>. In plain words, you can use the free Stroke Rounded icons in websites, apps, client work and products you sell. You do not need to show a credit on screen. If you share the source files themselves, keep the licence notice with them.')}
${p('Hugeicons Pro is different. It has its own licence agreement. Paying customers can use Pro icons in unlimited end products, but they may not resell or share the Pro source files, use them to build a competing icon product, or hand them to users as separate, downloadable icon files. Each seat is for one person.')}
${p(`with icons uses MIT for everything, because there is only one tier. Websites, apps, slides, print, merchandise, client work: all fine, no credit needed. The full text is on our ${L.page('license.html', 'license page')}.`)}
${callout('tip', `Licences can be confusing. Our guide ${L.post('free-icons-commercial-use', 'Can I use free icons commercially?')} explains MIT, ISC, CC BY and the rest in everyday words.`)}

${h2('How much does Hugeicons Pro cost?')}
${p('When we checked the pricing page in October 2026, Hugeicons had three plans:')}
${ul([
  '<strong>Free</strong>: over 6,000 Stroke Rounded icons, the web app, developer formats and free design plugins.',
  '<strong>Pro</strong>: $99 a year for one seat. 60,000+ icons in 10 styles, the full plugins, and hosted npm packages with usage allowances (listed as 300K pageviews and 2GB bandwidth).',
  '<strong>Pro Plus</strong>: $1,197 as a one-time payment for one seat, with lifetime access to the files and higher allowances.',
])}
${p('Teams buy extra seats. None of this is unusual: it is how many premium icon sets work, and $99 a year is fair for 60,000 icons if you need them. Just know it before you design your whole product around a style that is only in Pro.')}
${callout('note', 'Prices change. We checked Hugeicons’ pricing page in October 2026. Look at it again before you buy.')}
${figure('huge3', 'A big catalogue is great for variety. A small, matched one is great for consistency. Most projects need one more than the other.')}

${h2(`6,000 icons vs ${N_ICONS}: does the number matter?`)}
${p(`Sometimes, a lot. If you are building a travel app that needs a suitcase, a passport, a boarding gate and a seat map, a catalogue of thousands will almost certainly have them, and a catalogue of ${N_ICONS} may not. That is a real point for Hugeicons.`)}
${p('But most websites, decks and apps lean on the same few dozen ideas: home, search, menu, user, settings, bell, mail, calendar, charts, files, money, arrows. with icons covers those across 19 categories, and its search understands everyday words, so typing “bin” finds trash and “gear” finds settings.')}
${p('A good test: write down the 20 icons your project really needs, then search for them in both libraries. If with icons has all 20, its extra styles are a bonus. If it is missing five, Hugeicons is probably the better fit.')}

${h2('Which one looks better in slides and marketing pages?')}
${p('Hugeicons’ free style is clean and friendly. It is designed for interfaces, and it does that job well.')}
${p(`with icons adds 17 creative styles meant for bigger, more expressive uses. ${L.style('gloss')} looks like a glossy app icon, ${L.style('glass')} like frosted glass, ${L.style('pixel')} like 16-bit game art, ${L.style('retro')} like a 70s patch and ${L.style('sketch')} like a marker drawing. They shine at 32px and larger: in a pitch deck, on a landing page hero, or on a poster.`)}
${iconGrid(['lightbulb', 'target', 'trophy', 'chart-line', 'shield-check', 'globe'], 'sketch', 'A pitch-deck row in the sketch style. Copy any of them as an image and paste it into your slide.')}
${p(`Every with icons page has Copy image, PNG and SVG buttons, plus step-by-step guides for ${L.guide('powerpoint', 'PowerPoint')}, ${L.guide('google-slides', 'Google Slides')} and ${L.guide('canva', 'Canva')}. Hugeicons’ icon pages let you copy or download the SVG and pick a colour and size, which also works well for slides.`)}

${h2('Do Hugeicons and with icons work with AI assistants?')}
${p(`Both do, which is nice to see. AI tools like Claude, ChatGPT and Cursor often invent icon names that do not exist. An MCP server (a small plug-in that lets an assistant search a real icon list) fixes that.`)}
${p(`Hugeicons publishes an official MCP server on npm and an agent skill that teaches coding assistants how to use its packages. with icons has an ${L.page('ai.html', 'MCP server')}, a public llms.txt file and an agent skill too. If you build with AI help, either set will work far better than a set the assistant has to guess.`)}

${h2('Which one is ready for developers today?')}
${p('Hugeicons is ready right now. Its free package installs from npm and works with official React, Vue, Svelte, Angular and React Native packages, and the project lists SolidJS and Flutter libraries as well.')}
${p(`with icons will offer React, Vue, Svelte, Angular and Solid components, a web component and simple CSS classes like <code>&lt;i class="with with-home"&gt;</code>. The npm packages and CDN are launching soon. Until then, every icon page lets you copy the SVG code directly, and our ${L.page('developers.html', 'developer page')} shows what is coming.`)}

${h2('What are the pros and cons of Hugeicons and with icons?')}
${p('The table gives you the facts. Here is what they mean in practice: what each set does well, and what to keep in mind, in plain words.')}
${prosCons('Hugeicons', { lib: 'hugeicons', pros: [
  ['A very big free set', 'Over 6,000 free icons is one of the largest free outline collections around, so you will rarely get stuck looking for a specific idea.'],
  ['Free to use commercially', 'The free icons use the MIT licence, so you can use them in client work and products without showing a credit.'],
  ['Ready for developers now', 'Official packages for React, Vue, Svelte, Angular and React Native are on npm today, and SolidJS and Flutter libraries are listed too.'],
  ['Helpful for AI tools', 'An official MCP server and an agent skill help coding assistants find and use real Hugeicons names.'],
  ['Room to grow', 'If you need more later, Pro unlocks 60,000+ icons in 10 styles from the same family.'],
], cons: [
  ['Only one style is free', 'Free means outline only. The filled and duotone versions of the same icons are in Pro, so a filled active tab needs a paid plan or a second icon set.'],
  ['Pro is a real cost', 'When we checked, Pro was $99 a year per seat and Pro Plus $1,197 one time. Fair for 60,000 icons, but worth knowing before you design around a Pro style.'],
  ['Made for interfaces, not decoration', 'The free style is a clean outline for apps. There is no glossy or hand-drawn option for posters, slides or hero sections.'],
  ['Pro files come with rules', 'The Pro licence does not let you share the source files or hand them to users as separate icons, and each seat is for one person.'],
] })}
${prosCons('with icons', { pros: [
  ['Every style is free', `All ${N_STYLES} styles cost nothing, from line, solid and duo to glass, pixel, retro and luxe, so the filled icon for your active tab is already there.`],
  ['Styles that always match', 'Each icon is drawn once and rendered into every style, so mixing line in the menu with gloss in the hero still looks like one family.'],
  ['One simple licence', 'Everything is MIT: free for personal and commercial use, with no credit needed.'],
  ['Great for slides and docs', 'Every icon page has Copy image, PNG and SVG buttons in any colour, plus guides for PowerPoint, Google Slides and Canva.'],
  ['Search in everyday words', 'Typing “bin” finds trash and “gear” finds settings, so anyone can find the right icon fast.'],
], cons: [
  ['A much smaller catalogue', `There are ${N_ICONS} icons against Hugeicons’ 6,000+ free ones, about a twelfth as many. Everyday ideas are covered, but niche icons may be missing.`],
  ['No brand logos', 'You will not find company or social media logos here, so you may need a brand icon set alongside.'],
  ['Developer packages are not live yet', 'The npm packages and CDN are launching soon. Today you copy or download icons from each icon page.'],
  ['Newer, with a smaller community', 'There are fewer tutorials built around it so far. And the 17 creative styles are made for 32px and up, not for tiny buttons.'],
] })}
${p('In short: Hugeicons suits people who need thousands of icons in one tidy outline style, want npm packages today, and might pay for Pro later. with icons suits people who mostly need everyday icons and want filled, tinted and illustrated looks for free, for apps, slides and docs alike.')}

${h2('So, Hugeicons or with icons?')}
${p(`Hugeicons Free is one of the largest free outline icon sets around, and it is properly MIT licensed. with icons is the opposite bet: a small set where every style is free and matches perfectly. If one style is enough, Hugeicons gives you more. If you want your icons to change mood without changing family, start with with icons. Still deciding? Compare a few more sets in ${L.post('best-free-icon-libraries', 'our guide to the best free icon libraries')}, or see how we stack up against ${L.post('with-icons-vs-lucide', 'Lucide')}.`)}
${cta(`See all ${N_STYLES} styles for yourself`, `${N_ICONS} icons, ${N_STYLES} styles, zero paywalls. Search, switch style and copy one into your project in seconds.`, ['layers', 'rocket', 'sparkles', 'palette', 'heart', 'star'])}
`,
}
