import { p, h2, h3, figure, iconGrid, styleRow, table, yes, no, meh, callout, stats, steps, cta, faceOff, rivalStyles, prosCons, icon, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'
import { rivalIcon } from '../lib/rivals.mjs'

// a real icon sitting inline next to its class name in a table cell
const inl = svg => svg.replace('<svg ', '<svg style="vertical-align:middle;margin-right:8px" ')
const nameRow = (label, concept, fa, ours) => [label, `${inl(icon(ours, 'solid', 22))}<code>with-${ours}</code>`, `${inl(rivalIcon('font-awesome', concept, 'solid', 22))}<code>${fa}</code>`]

export default {
  slug: 'with-icons-vs-font-awesome',
  category: 'comparisons',
  date: '2026-10-02',
  hero: 'fa2',
  stickers: [['flag', 'solid'], ['swap', 'duo'], ['heart', 'gloss']],
  title: 'with icons vs Font Awesome: which free icon set should you use?',
  cardTitle: 'with icons vs Font Awesome',
  h1: 'with icons vs Font Awesome: which one should <em>you</em> use?',
  dek: `Font Awesome is the most famous icon set on the web. with icons is the new kid with ${N_STYLES} styles and no strings attached. Here is an honest, jargon-free look at both.`,
  description: 'with icons vs Font Awesome in plain English: the real icons side by side, price, licence, free styles, pros and cons, and which set fits your site or slides.',
  keywords: ['with icons vs Font Awesome', 'Font Awesome alternative', 'best free alternative to Font Awesome', 'Font Awesome pros and cons', 'Font Awesome free license', 'Font Awesome Pro price', 'free icons', 'icon library comparison'],
  about: ['Font Awesome', 'with icons', 'Icon library'],
  related: ['with-icons-vs-hugeicons', 'best-free-icon-libraries', 'free-icons-commercial-use'],
  tldr: [
    '<strong>Pick Font Awesome</strong> if you need a huge catalogue, brand logos (GitHub, Visa, Slack) or you already pay for Pro.',
    `<strong>Pick with icons</strong> if you want a smaller, carefully matched set that looks great in ${N_STYLES} styles, with an MIT license and no credit needed.`,
    'Font Awesome Free has over 2,000 icons in Solid, Regular and Brands. Extra styles like Light, Thin and Duotone need a paid plan (from $48 a year).',
    `with icons has ${N_ICONS} icons, each drawn once and rendered in ${N_STYLES} styles, so you get ${N_SVGS} SVGs that always match each other.`,
    'Both are free to start. Both work on websites. with icons also gives you ready-made PNG and SVG downloads for slides and docs.',
  ],
  faq: [
    { q: 'What is the best free alternative to Font Awesome?', a: `It depends on what you need. If your project mostly uses everyday interface and business icons and you want several matching styles under the MIT license with no credit, with icons is a strong choice: ${N_ICONS} icons in ${N_STYLES} styles, all free. If you need brand logos or thousands of niche icons, Font Awesome Free is still hard to replace. Our guide to the best free icon libraries compares more options.` },
    { q: 'Is Font Awesome free for commercial use?', a: 'Yes. Font Awesome Free icons use the CC BY 4.0 license, which allows commercial use as long as Font Awesome is credited, and the credit notes already inside the files count. Pro icons need a paid plan. Always read the license page for the version you use.' },
    { q: 'Do I have to credit Font Awesome when I use the free icons?', a: 'Font Awesome Free icons are licensed under CC BY 4.0, which asks for credit. Font Awesome says the credit comments already inside its files are enough, so for normal use you do not need to add anything. with icons uses the MIT license and does not ask for any visible credit.' },
    { q: 'How much does Font Awesome Pro cost?', a: 'When we checked in October 2026, Font Awesome’s paid plans started at $48 a year (Starter), with Solo at $96 and Team at $192 a year when paid yearly. Prices change, so check the Font Awesome plans page before you buy.' },
    { q: 'Can I use both icon sets on the same website?', a: 'You can, but it usually looks a little off, because the two sets use different line weights and corner shapes. If you mix, keep each set to its own area of the page.' },
    { q: 'How do I switch from Font Awesome to with icons?', a: 'Make a list of the Font Awesome icons you use, then find each match in the with icons library (search understands common Font Awesome names like “house” or “gear”). The alternatives page also has a name map to speed things up.' },
  ],
  sources: [
    { title: 'Font Awesome Free license', url: 'https://fontawesome.com/license/free' },
    { title: 'Font Awesome plans and pricing', url: 'https://fontawesome.com/plans' },
    { title: 'Font Awesome on GitHub (LICENSE.txt)', url: 'https://github.com/FortAwesome/Font-Awesome/blob/7.x/LICENSE.txt' },
    { title: 'Font Awesome API (icon counts and styles, version 7.3.1)', url: 'https://api.fontawesome.com' },
    { title: 'npm: @fortawesome/fontawesome-free (source of the icons shown here)', url: 'https://www.npmjs.com/package/@fortawesome/fontawesome-free' },
    { title: 'Font Awesome docs: AI agent tools', url: 'https://docs.fontawesome.com/web/use-with/ai-agent-tools' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">Font Awesome vs with icons: which should you use? Pick <strong>Font Awesome</strong> if you need a huge catalogue (over 2,000 free icons) or brand logos like GitHub and Visa. Pick <strong>${L.icons('with icons')}</strong> if you want ${N_ICONS} everyday icons that each come in ${N_STYLES} matching styles, free under the MIT license with no credit needed.</span>`)}
${p('Font Awesome is one of the oldest and best-known icon sets on the web, so why look anywhere else? Because “most popular” is not the same as “best for you”. Below we put the real icons side by side and compare the two the way a normal person would: what they cost, what you are allowed to do, how they look, and how easy they are to use. We will be honest about where Font Awesome wins, too.')}

${h2('How do with icons and Font Awesome compare at a glance?')}
${table(['', 'with icons', 'Font Awesome Free'], [
  ['Price', yes('Free, forever'), yes('Free plan. Pro from $48/year')],
  ['License', yes('MIT, no credit needed'), meh('CC BY 4.0 icons (credit is built into the files)')],
  ['Number of icons', `${N_ICONS} icons × ${N_STYLES} styles = ${N_SVGS} SVGs`, 'Over 2,000 free, many more in Pro'],
  ['Styles you get for free', yes(`${N_STYLES}: line, solid and duo for interfaces, plus ${N_STYLES - 3} creative styles such as gloss, glass, pixel, retro and luxe`), meh('3: Solid, Regular (partial), Brands')],
  ['Brand logos', no('No'), yes('Yes, a large Brands set')],
  ['Ready for slides and docs', yes('Copy as image, PNG and SVG downloads'), meh('SVG downloads from each icon page')],
  ['Works with AI assistants', yes('MCP server, llms.txt, agent skill'), meh('Agent tools and docs llms.txt')],
], 'with icons and Font Awesome Free, side by side (checked October 2026)')}

${h2('What is Font Awesome?')}
${p('Font Awesome started as an “icon font”: a font where every letter is a picture. You add one line to your website and then write something like <code>&lt;i class="fa-solid fa-house"&gt;</code> to show a house. That trick made it hugely popular with web designers. Here is what that house, and eleven other everyday icons, actually look like next to ours.')}
${faceOff('font-awesome', { variant: 'solid', ourStyle: 'solid', caption: 'Real Font Awesome Free icons (bottom) next to with icons (top), both in their filled Solid style. Notice how Font Awesome’s shapes are bigger and chunkier, filling more of their square, while ours leave a little breathing room and keep small details, like the lines on the bin. Also look at the names: Font Awesome says house, magnifying-glass and gear where we say home, search and settings.' })}
${p('Today Font Awesome is a big company with a free plan and paid plans. The free set has more than 2,000 icons in three styles: Solid (filled), Regular (outlined, but only for some icons) and Brands (logos). Paid plans unlock tens of thousands more icons and extra styles such as Light, Thin, Duotone and Sharp.')}

${h2('What is with icons?')}
${p(`with icons is a newer, smaller set that takes a different approach. Instead of drawing thousands of icons, we drew <strong>${N_ICONS} everyday icons</strong> very carefully, once each. Then a computer program “renders” every icon into <strong>${N_STYLES} styles</strong>. Because every style comes from the same drawing, they always match: the house in the line style has exactly the same shape as the house in the glossy style. Each icon also comes with 20 to 30 hand-picked colour palettes and optional motion.`)}
${styleRow('home')}
${rivalStyles('font-awesome', ['home', 'heart', 'bell', 'calendar', 'search', 'settings'], 'For comparison, the two icon styles in Font Awesome Free (Brands is a separate set of logos). Regular only covers some icons: search and settings have no free outline version, which is why you see a dash.')}
${p(`The first three with icons styles (line, solid and duo) are for buttons, menus and apps. The other ${N_STYLES - 3} are creative styles: shiny gloss, frosted glass, chunky pixel art, warm 70s retro, cute kawaii, gold-trimmed luxe and more. They shine in presentations, landing pages, posters and anywhere you want an icon to feel like an illustration.`)}
${stats([[`${N_ICONS}`, 'hand-drawn icons'], [`${N_STYLES}`, 'matching styles'], [N_SVGS, 'SVG files in total'], ['$0', 'and no credit needed']])}

${h2('Is Font Awesome free, and how much does Pro cost?')}
${p('Both sets are free to start, but they make money differently. <strong>Font Awesome</strong> is “freemium”. The free set is generous, but the nicer styles and most of the catalogue sit behind a subscription. When we checked in October 2026, plans started at $48 a year (Starter), with Solo at $96 and Team at $192 when paid yearly.')}
${p(`<strong>with icons</strong> is simply free. Every one of the ${N_ICONS} icons, in every one of the ${N_STYLES} styles, costs nothing, for personal or commercial work. There is no Pro tier to upsell you to.`)}
${callout('note', 'Prices change. We checked Font Awesome’s pricing page in October 2026. Look at their plans page for today’s numbers before you decide.')}

${h2('Can you use Font Awesome and with icons in commercial projects?')}
${p('Yes, both. A license is just the rulebook for using the icons. Here is the plain-English version.')}
${h3('Font Awesome Free')}
${p('The icons use <strong>CC BY 4.0</strong>. You can use them for almost anything, including client work and products, as long as Font Awesome gets credit. The good news: the credit notes already hidden inside its files count, so most people do not need to do anything. The font files use the SIL Open Font License and the code uses MIT.')}
${h3('with icons')}
${p(`Everything uses the <strong>MIT license</strong>, one of the most relaxed licenses there is. Use the icons anywhere, including client work and things you sell, with no credit. (If you share the source code itself, keep the license file with it.) The full text lives on our ${L.page('license.html', 'license page')}.`)}
${callout('tip', `Not sure what CC BY or MIT really mean? Our guide ${L.post('free-icons-commercial-use', 'Can I use free icons commercially?')} explains every common icon license in plain English.`)}

${h2('How many icons do you really need?')}
${p('This is where Font Awesome clearly wins. More than 2,000 free icons is a lot, and if you need a whisk, a garlic clove and a pressure cooker for a cooking app, a big catalogue is a real advantage.')}
${p('But most websites and apps only use <strong>a few dozen icons</strong>, and they are almost always the same ones: home, search, menu, user, settings, bell, mail, cart, arrows, checkmarks. with icons covers those essentials across 19 categories.')}
${iconGrid(['home', 'search', 'menu', 'user', 'settings', 'bell', 'mail', 'calendar', 'shopping-cart', 'heart', 'share', 'trash'], 'line', 'The twelve icons almost every website needs, in the with icons line style. So the real question is not “which set is bigger?” but “does it have the icons <em>I</em> need?”')}

${h2('Do Font Awesome and with icons look different?')}
${p('Yes, and the outline styles show it best. Font Awesome’s icons are bold and very recognisable: a strength (people understand them instantly) and a weakness (your site can look like a thousand others).')}
${faceOff('font-awesome', { variant: 'regular', ourStyle: 'line', concepts: ['home', 'user', 'bell', 'mail', 'heart', 'calendar', 'star'], caption: 'Font Awesome’s outlined Regular style next to our line style, for the seven everyday icons that have a free Regular version. Font Awesome’s lines are thicker and its shapes larger, so they feel bold. with icons uses a lighter 1.75px line with more space around it, which feels calmer in busy menus and dashboards.' })}
${p('with icons lets you set a mood without switching sets: calm line for a finance dashboard, kawaii or sketch for a kids’ app, pixel for a game, luxe or engrave for a premium product page. Because every style shares one drawing, line icons in the menu and gloss icons in the hero still feel like one brand.')}
${iconGrid(['rocket', 'shield-check', 'chart-line', 'sparkles', 'users', 'zap'], 'gloss', 'A “features” row in the gloss style. Try doing that with a single-style icon set.')}
${figure('flat1', 'Designers often mix a calm style for the interface with a bolder one for marketing pages. With one family of icons, both still match.')}

${h2('Which is easier to use on websites, slides and docs?')}
${h3('On a website')}
${p('Font Awesome’s classic method is very easy: add a stylesheet, then write a short tag with the icon’s name. with icons supports the same idea with <code>&lt;i class="with with-home"&gt;</code>, so the habit carries over. Only some names change:')}
${table(['Icon', 'with icons name', 'Font Awesome name'], [
  nameRow('Home', 'home', 'fa-house', 'home'),
  nameRow('Search', 'search', 'fa-magnifying-glass', 'search'),
  nameRow('Settings', 'settings', 'fa-gear', 'settings'),
  nameRow('Mail', 'mail', 'fa-envelope', 'mail'),
  nameRow('Cart', 'shopping-cart', 'fa-cart-shopping', 'shopping-cart'),
], 'Class names and the real icons they show, both in Solid (Font Awesome Free icons: CC BY 4.0, Fonticons, Inc.)')}
${p('Developers also get ready-made with icons components for React, Vue, Svelte, Angular and Solid, plus a web component. (The npm packages are launching soon. Until then, every icon page lets you copy the SVG code directly.)')}
${h3('In PowerPoint, Google Slides, Canva and Word')}
${p(`This is where with icons tries hardest. Every icon page has <strong>Copy image</strong>, <strong>PNG download</strong> (pick a size and colour) and <strong>SVG download</strong> buttons, so you can paste an icon into a slide in seconds. We also have guides for ${L.guide('powerpoint', 'PowerPoint')}, ${L.guide('google-slides', 'Google Slides')}, ${L.guide('canva', 'Canva')} and more. Font Awesome lets you download free icons as SVG files too; to recolour them or turn them into PNGs for slides, you may need another tool.`)}
${steps([
  ['Find the icon', `Open ${L.icons('the library')} and type what you mean, like “money” or “team”.`],
  ['Pick a style and colour', `Choose one of the ${N_STYLES} styles and any colour you like.`],
  ['Copy or download', 'Click Copy image and paste it straight into your slide or doc.'],
])}

${h2('Do Font Awesome and with icons work with AI assistants?')}
${p(`More and more people ask ChatGPT, Claude or Gemini to “add icons to my page”. Assistants often guess icon names that do not exist, and the page breaks. with icons was built with this in mind: it has an ${L.page('ai.html', 'MCP server')} (a plug-in that lets AI tools search the real icon list), a public llms.txt file, and an agent skill. Font Awesome has also started offering AI agent tools and a docs llms.txt, so both are moving in the right direction.`)}

${h2('What are the pros and cons of Font Awesome and with icons?')}
${p('Tables hide the “so what”. Here is what each set does well, and what to keep in mind, in plain words.')}
${prosCons('Font Awesome', { lib: 'font-awesome', pros: [
  ['A huge catalogue', 'Over 2,000 free icons, and many thousands more if you pay for Pro. If you need something unusual, it probably has it.'],
  ['Brand logos included', 'The free Brands set has logos for popular companies and apps, such as GitHub, Slack and Visa. That is handy for social links in a footer or payment logos at checkout.'],
  ['Famous and well supported', 'It is one of the best-known icon sets on the web, so many tutorials, themes and plugins already support it, and lots of people know how to use it.'],
  ['Easy to add to a website', 'One stylesheet and a short tag is all it takes, and there are official packages for React, Vue, Angular and Svelte.'],
  ['Lots of extra looks in Pro', 'If you pay, you get styles like Light, Thin, Duotone and Sharp, so a design team can fine-tune the mood.'],
], cons: [
  ['The free set is mostly one look', 'Free icons are mainly Solid. The outlined Regular style only covers some of them, so you cannot always swap a filled icon for an outline one for free.'],
  ['The nicest styles cost money', 'Light, Thin, Duotone and most of the catalogue need a paid plan, from $48 a year when we checked. It is easy to fall for a Pro icon and then hit the paywall.'],
  ['A license with a credit rule', 'The free icons use CC BY 4.0, which asks for credit. The notes built into the files count, so most people are fine, but it is worth keeping those notes in place.'],
  ['Very familiar', 'Because so many sites use it, Font Awesome icons can make your page look like a lot of other pages.'],
] })}
${prosCons('with icons', { pros: [
  [`${N_STYLES} styles, all free`, `Every icon comes in 3 everyday interface styles (line, solid and duo) and ${N_STYLES - 3} creative ones, from gloss and glass to pixel, retro and luxe. Nothing is locked, so you can change the mood of a page without changing icon sets.`],
  ['Everything matches', 'Each icon is drawn once and rendered into every style, so a line icon in the menu and a glossy one in the hero still look like family.'],
  ['The simplest license', 'MIT means free for personal and commercial use, with no credit needed anywhere.'],
  ['Made for slides and docs too', 'Every icon page has Copy image, PNG and SVG buttons in any colour, plus guides for PowerPoint, Google Slides, Canva and more.'],
  ['Friendly to AI assistants', 'An MCP server, an llms.txt file and an agent skill help tools like ChatGPT and Claude find real icon names instead of guessing.'],
], cons: [
  ['A smaller catalogue', `There are ${N_ICONS} icons. They cover everyday interface and business ideas well, but if you need something niche, it may not be there yet.`],
  ['No brand logos', 'You will not find GitHub, Slack or Visa logos here. For those, you need a brand icon set alongside.'],
  ['Developer packages are not live yet', 'The npm packages and CDN are launching soon. Today you copy or download icons from each icon page, which is quick for slides and small sites but slower for big apps.'],
  ['Newer, with a smaller community', 'There are fewer tutorials and themes built around it so far. And the creative styles are made for 32px and up, not for tiny buttons.'],
] })}
${p('In short: Font Awesome suits people who need breadth, brand logos and a tool everyone already knows, and who might pay for Pro later. with icons suits people who mostly need everyday icons and want several matching looks, a no-strings license and quick copies for slides, without ever paying.')}

${h2('So, Font Awesome or with icons?')}
${p(`Font Awesome is a safe, famous choice with an enormous catalogue. with icons is smaller on purpose: fewer icons in more styles, completely free under MIT. If you need logos or rare icons, Font Awesome is still great, and our ${L.alt('font-awesome', 'Font Awesome alternative page')} has a name map to make switching (either way) easy. Still comparing? See ${L.post('best-free-icon-libraries', 'our guide to the best free icon libraries')}.`)}
${cta('Try with icons in 30 seconds', `Search ${N_ICONS} icons, switch between ${N_STYLES} styles, and copy one straight into your project. Free and MIT licensed.`, ['flag', 'home', 'heart', 'star', 'rocket', 'sparkles'])}
`,
}
