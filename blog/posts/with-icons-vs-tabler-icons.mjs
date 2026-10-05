import { p, h2, figure, iconGrid, styleRow, sizeRamp, table, yes, no, meh, verdict, callout, cta, doDont, faceOff, rivalStyles, prosCons, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

const N_CREATIVE = N_STYLES - 3 // line, solid and duo are the interface styles
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty']
const word = n => WORDS[n] ?? String(n)
const TABLER_X = Math.floor(6200 / N_ICONS) // Tabler's "over 6,200" vs our count

export default {
  slug: 'with-icons-vs-tabler-icons',
  category: 'comparisons',
  date: '2026-10-02',
  hero: 'tabler0',
  stickers: [['layout-grid', 'solid'], ['target', 'duo'], ['chart-bar', 'gloss']],
  title: `with icons vs Tabler Icons: ${N_ICONS} curated icons or 6,000+?`,
  cardTitle: 'with icons vs Tabler Icons',
  h1: 'with icons vs Tabler Icons: a <em>huge</em> toolbox or a tidy one?',
  dek: `Tabler Icons is the biggest free MIT outline set around. with icons is a smaller, carefully matched family of ${N_ICONS} icons in ${N_STYLES} styles. Which one helps you more depends on a single question.`,
  description: `with icons vs Tabler Icons in plain English: 6,200+ outline and filled icons vs ${N_ICONS} icons in ${N_STYLES} styles, real icons side by side, pros and cons, and which to pick.`,
  keywords: ['with icons vs Tabler Icons', 'Tabler Icons alternative', 'free MIT icons', 'Tabler Icons license', 'Tabler Icons pros and cons', 'outline icon set'],
  about: ['Tabler Icons', 'with icons', 'Icon library', 'MIT License'],
  related: ['with-icons-vs-lucide', 'consistent-icons', 'best-free-icon-libraries'],
  tldr: [
    '<strong>Pick Tabler Icons</strong> if you need breadth: over 6,200 free icons (outline plus filled versions), with ready packages for most frameworks.',
    `<strong>Pick with icons</strong> if you want a smaller set that is quick to search and comes in ${N_STYLES} matching styles, from simple line to frosted glass, pixel art and hand-drawn sketch.`,
    'Both are free and MIT licensed, so you can use them commercially without showing a credit.',
    `Tabler offers 2 looks (outline and filled) with a 2px line. with icons offers ${N_STYLES} styles from one drawing, with a slightly lighter 1.75px line.`,
    'with icons adds one-click Copy image, PNG and SVG downloads for slides and docs. Both have npm packages; Tabler covers a few more frameworks.',
  ],
  faq: [
    { q: 'Is Tabler Icons free for commercial use?', a: 'Yes. Tabler Icons is released under the MIT licence, so you can use the icons in commercial websites, apps and products without credit. Tabler also sells optional paid bundles, but the icons themselves are free.' },
    { q: 'How many icons does Tabler Icons have?', a: 'Tabler’s README says over 6,200. That count includes outline and filled versions: in version 3.48.0 there are 5,166 outline icons, and 1,054 of them also have a filled twin.' },
    { q: 'What is the best Tabler Icons alternative?', a: `It depends on what you want more of. If you want more looks, with icons gives you ${N_ICONS} everyday icons in ${N_STYLES} matching styles, also under MIT with no credit needed. If you want a similar outline set with lots of icons, Lucide (over 1,600 icons, ISC licence) is a popular choice.` },
    { q: 'Can I use Tabler Icons and with icons together?', a: 'You can, because both are MIT and use a 24 × 24 grid. The line weights differ slightly (2px vs 1.75px), so keep each set to its own area, or set the with icons stroke to 2 in the components to get closer.' },
    { q: 'Does with icons have a filled style like Tabler’s filled icons?', a: `Yes. Every with icons icon has a Solid style, and also Duo (outline over a soft tint) plus ${N_CREATIVE} creative styles such as glass, retro and pixel. Tabler has filled versions for about one in five of its icons.` },
    { q: `Why choose a ${N_ICONS}-icon set over a 6,000-icon set?`, a: `Tabler has more than ${word(TABLER_X)} times as many icons, but most products use a few dozen, and a smaller set is faster to search and more consistent. If you regularly need rare icons, the bigger set is the better tool.` },
  ],
  sources: [
    { title: 'Tabler Icons README on GitHub (count, grid, stroke, packages)', url: 'https://github.com/tabler/tabler-icons' },
    { title: 'Tabler Icons website (bundles, Figma plugin)', url: 'https://tabler.io/icons' },
    { title: 'Tabler Icons licence (MIT)', url: 'https://github.com/tabler/tabler-icons/blob/main/LICENSE' },
    { title: '@tabler/icons 3.48.0 icons.json (outline and filled counts, used for the side-by-side icons)', url: 'https://unpkg.com/@tabler/icons@3.48.0/icons.json' },
    { title: 'Lucide README (icon count, ISC licence)', url: 'https://github.com/lucide-icons/lucide' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">Tabler Icons or ${L.icons('with icons')}: which should you use? Choose Tabler Icons if you need breadth: over 6,200 free MIT icons, with packages for most frameworks. Choose with icons if you want ${N_ICONS} everyday icons in ${N_STYLES} matching styles that work in your app, your website and your slides. Both are free and neither needs a credit.</span>`)}
${p(`Think of two hardware shops. One is a giant warehouse with every screw ever made. The other is a smaller shop where the owner has picked the ${N_ICONS} things people actually buy, and stocks each one in ${N_STYLES} finishes. Tabler is the warehouse, with icons is the smaller shop, and the right one depends on whether you need <em>more icons</em> or <em>more looks</em>.`)}

${h2('How do Tabler Icons and with icons compare?')}
${table(['', 'with icons', 'Tabler Icons'], [
  ['Price', yes('Free'), yes('Free icons, optional paid bundles')],
  ['Licence', yes('MIT, no credit needed'), yes('MIT, no credit needed')],
  ['Icons', `${N_ICONS} icons × ${N_STYLES} styles = ${N_SVGS} SVGs`, 'Over 6,200 (5,166 outline, 1,054 filled twins)'],
  ['Styles', yes(`${N_STYLES}: line, solid and duo for interfaces, plus ${N_CREATIVE} creative styles like glass, pixel, retro and luxe`), meh('2: outline and filled (for some icons)')],
  ['Grid and line', '24 × 24 grid, 1.75px line', '24 × 24 grid, 2px line'],
  ['Developer packages', yes('React, Vue, Svelte, Angular, Solid, web component'), yes('React, Vue, Svelte, Angular, Preact, Solid, Astro and more')],
  ['Slides and docs', yes('Copy image, PNG and SVG in any colour'), yes('PNG and PDF packages, Figma plugin')],
  ['Help for AI assistants', yes('llms.txt, agent skill, MCP server'), yes('Docs llms.txt and an agent skill')],
], 'with icons and Tabler Icons, side by side (checked October 2026)')}

${h2('What do Tabler Icons and with icons look like side by side?')}
${p('Here are the real icons, so you can judge with your own eyes. Each pair shows our icon on top and Tabler’s below, taken from Tabler’s official package (version 3.48.0). We matched our everyday line style with Tabler’s outline style.')}
${faceOff('tabler', { caption: 'with icons line vs Tabler outline, for 12 everyday ideas. Notice that the names are identical for all twelve, which makes switching easy. Then look at the lines: Tabler’s 2px stroke looks a little sturdier, ours (1.75px) a little lighter.' })}

${h2('What is Tabler Icons?')}
${p('Tabler Icons comes from the team behind Tabler, a free, open-source admin dashboard kit, and it has become one of the most popular free icon sets on the web. Every icon is drawn on a 24 × 24 grid with a 2px line, which gives the set its clean, slightly bold outline look.')}
${p('Its superpower is size. The project’s README counts over 6,200 icons. That number includes filled versions: the latest package has 5,166 outline icons, and 1,054 of those also come in a filled version. Either way, it is a lot, and new icons arrive regularly.')}
${p('The icons are free under MIT. Tabler also sells optional one-off bundles on its website (listed at $9 for the icons in extra formats and $69 for a larger package), which is how the project funds itself. You never need to buy them to use the icons.')}

${h2(`Why would anyone pick ${N_ICONS} icons over 6,000?`)}
${p('It sounds backwards, so let us explain. Designers who build apps for a living notice the same thing again and again: a typical website or app uses a few dozen icons, and they are nearly always the same ones. Home, search, user, bell, settings, calendar, cart, arrows, checkmarks.')}
${p('A giant set has those too, of course. But it also gives you twelve kinds of arrow and nine kinds of chart for every search, and you spend time choosing between near-identical options. A curated set gives you one good answer per idea, which keeps a product consistent almost by accident.')}
${iconGrid(['menu', 'filter', 'plus', 'check', 'arrow-right', 'chevron-down', 'edit', 'share', 'upload', 'link', 'lock', 'info-circle'], 'line', 'Twelve more workhorse icons in the with icons line style. Together with the twelve in the face-off above, they cover most everyday screens.')}
${p(`with icons covers ${N_ICONS} concepts across 19 categories, from navigation and files to weather and money. Search also understands everyday words, so “bin” finds trash and “gear” finds settings. If what you need is on that list, you will find it fast. If it is not, Tabler is a great place to look. Our post on ${L.post('consistent-icons', 'keeping icons consistent')} explains why one tidy family usually beats a bigger mixed one.`)}

${h2('How many styles do Tabler Icons and with icons have?')}
${p('Tabler gives you outline icons, plus a filled version for roughly one in five of them. That is perfect for interfaces, where filled often means “selected”.')}
${rivalStyles('tabler', ['home', 'heart', 'star', 'bell'], 'Tabler’s two styles for four everyday icons: outline, and the filled twin that about one in five icons has.')}
${faceOff('tabler', { variant: 'filled', ourStyle: 'solid', concepts: ['home', 'bell', 'heart', 'star', 'user', 'calendar'], caption: 'with icons solid vs Tabler filled. Both work well for the tab or button that is currently selected. Every with icons icon has a solid version; in Tabler, check that the icon you want has a filled twin.' })}
${p(`with icons goes further on style. Every one of the ${N_ICONS} icons exists in ${N_STYLES} styles, all rendered from the same drawing, so they line up perfectly. Here is the ${L.icon('chart-bar')} icon:`)}
${styleRow('chart-bar')}
${p(`Line, solid and duo are the three interface styles, for the app itself. The other ${N_CREATIVE} are creative styles for the marketing page and the pitch deck: glossy, frosted glass, engraved, blueprint, hand-drawn sketch, 16-bit pixel art, 70s retro, polished luxe and more. This matters most when one brand shows up in many places. Your dashboard can use ${L.style('line')}, your landing page can use ${L.style('gloss')}, and your investor slides can use ${L.style('sketch')}, and people still feel it is the same product.`)}
${figure('tabler2', 'Dashboards are where Tabler Icons was born. They are also where a calm, consistent icon set makes the biggest difference.')}

${h2('Does a 2px vs 1.75px line really matter?')}
${p('A little, yes. The “stroke” is the thickness of an icon’s outline. Tabler draws everything with a 2px line on a 24px icon, which looks sturdy and works well next to bold text. with icons uses 1.75px in the line style, which feels a touch lighter and calmer, and pairs well with regular-weight text. You can see the difference in the face-off above.')}
${sizeRamp(['home', 'bell', 'settings', 'chart-line'], [16, 20, 24, 32, 48], 'line', 'with icons line icons from 16px to 48px. The lighter line stays clear at small sizes without looking heavy at large ones.')}
${p('Neither is better. It is a matter of taste and of what sits next to the icons. If you plan to mix the two sets, the components let you set the with icons stroke to 2 so the lines match more closely.')}

${h2('Is Tabler Icons better for developers today?')}
${p('For framework coverage, yes. Tabler has mature packages for React, Vue, Svelte, Angular, Preact, Solid and Astro, plus a web font, an SVG sprite, and PNG and PDF versions. You can install it in a minute.')}
${p(`with icons has the same idea: components for React, Vue, Svelte, Angular and Solid, a <code>&lt;with-icon&gt;</code> web component and simple classes like <code>&lt;i class="with with-home"&gt;</code>, which draws the same ${L.icon('home')} icon you saw in the face-off. They are on npm and the jsDelivr CDN too, just without Preact or Astro packages or a web font. And every icon page lets you copy the SVG code or download the file, which works in any project.`)}
${callout('note', `Developers switching later can use the name map on our ${L.alt('tabler', 'Tabler alternative page')}. Many names are the same (all twelve in the face-off above match); a few differ, like <code>x</code> to close and <code>photo</code> to image.`)}

${h2('Which is easier for slides and documents?')}
${p('Lots of icon hunters are marketers, teachers and founders putting together slides, reports and social posts. For them, the question is simply: how fast can I get a good-looking icon into my document?')}
${p(`Tabler’s site lets you customise and download icons, and it has an official Figma plugin. with icons goes one step further for non-coders: every icon page has a <strong>Copy image</strong> button that you can paste straight into PowerPoint, Google Slides, Canva or Word, plus PNG downloads in any size and colour. Our ${L.guide('powerpoint', 'PowerPoint guide')} and ${L.guide('canva', 'Canva guide')} walk you through it.`)}
${iconGrid(['rocket', 'target', 'users', 'trending-up', 'lightbulb', 'trophy'], 'gloss', 'A pitch-deck row in the gloss style. Decorative styles like this are something an outline-and-filled set can’t give you.')}

${h2('What are the pros and cons of Tabler Icons and with icons?')}
${p('Both are excellent free sets with the same MIT licence, so the choice comes down to trade-offs. Here they are in plain words.')}
${prosCons('Tabler Icons', {
  lib: 'tabler',
  pros: [
    ['A huge library', 'Over 6,200 icons, including niche ones like specific devices, sports, medical tools and maths symbols. If an icon exists, Tabler probably has it.'],
    ['Packages you can install today', 'React, Vue, Svelte, Angular, Preact, Solid and Astro, plus a web font, an SVG sprite, and PNG and PDF versions.'],
    ['Very consistent', 'Every icon sits on the same 24 × 24 grid with the same 2px line, so thousands of icons still look like one family.'],
    ['Free, with no credit needed', 'MIT licence. The paid bundles are optional extras, not a locked “Pro” set of icons.'],
    ['A long track record', 'It grew up alongside the Tabler dashboard kit, so it is well tested in admin panels and business apps.'],
  ],
  cons: [
    ['Only two looks', 'Outline and filled. There is nothing glossy, hand-drawn or decorative for a hero section or a pitch deck.'],
    ['Filled is not everywhere', 'Only about one in five icons has a filled twin, so a filled menu can run into gaps.'],
    ['More choice means more choosing', 'With thousands of icons, you often get several near-identical options and spend time picking between them.'],
  ],
})}
${prosCons('with icons', {
  pros: [
    [`${N_STYLES} matching styles`, `Every icon comes in line, solid and duo for interfaces, plus ${N_CREATIVE} creative styles such as gloss, glass, pixel, retro, kawaii and luxe, all from one drawing, so they always fit together.`],
    ['Quick to search', 'One good icon per idea, and search understands everyday words: “bin” finds trash and “gear” finds settings.'],
    ['Made for slides and docs', 'Copy image, PNG downloads in any size and colour, and SVG downloads on every icon page. No code needed.'],
    ['Free, with no credit needed', 'MIT licence and no paid tier at all.'],
    ['Ready for AI assistants', 'An MCP server, llms.txt and an agent skill let AI tools pick real icon names instead of guessing.'],
  ],
  cons: [
    ['A much smaller catalogue', `There are ${N_ICONS} icons and no brand logos, and Tabler has more than ${word(TABLER_X)} times as many. For rare or very specific icons, Tabler is the better place to look.`],
    ['Fewer framework packages', 'There are packages for React, Vue, Svelte, Angular, Solid and a web component, but none for Preact or Astro, and no web font.'],
    ['Newer, with a smaller community', 'with icons is a young project, so there are fewer tutorials and community answers than for Tabler.'],
    ['Creative styles need room', 'Gloss, glass, engrave and the other creative styles are made for 32px and larger. For tiny interface icons, stick to line, solid or duo.'],
  ],
})}
${p('Who suits which? Tabler Icons suits developers building big apps and admin dashboards who need rare icons and want a package for almost any framework. with icons suits people who mostly need the everyday icons and want them to look good everywhere: in the app, on the website and in the slides.')}
${doDont('<p>Pick the set that matches your main need: breadth (Tabler) or looks (with icons). Then use it everywhere.</p>', '<p>Grab one icon from each set because the names were handy. Different line weights side by side look slightly off.</p>')}

${verdict({
  a: ['with icons', ['You want a curated set that is quick to search.', `You want ${N_STYLES} matching styles for app, website and slides.`, 'You make slides and docs and want Copy image in any colour.', 'You want an MCP server so AI assistants pick real icon names.']],
  b: ['Tabler Icons', ['You need over 6,000 icons, including rare ones.', 'You need Preact or Astro packages, or a web font.', 'You prefer a sturdy 2px outline with filled variants.']],
})}

${h2('So, Tabler Icons or with icons?')}
${p(`Tabler Icons is one of the best free icon sets ever made, and if breadth is what you need, it is hard to beat. with icons is for people who would rather have fewer, carefully matched icons and more ways to dress them: ${N_STYLES} styles, the same names, no credit, MIT. If you are still weighing options, our roundup of ${L.post('best-free-icon-libraries', 'the best free icon libraries')} compares Tabler, with icons and eight others side by side.`)}
${cta('Try the tidy toolbox', `${N_ICONS} free icons in ${N_STYLES} matching styles. Copy, download or paste into your slides. MIT licensed, no sign-up.`, ['layout-grid', 'chart-bar', 'target', 'rocket', 'sparkles', 'star'])}
`,
}
