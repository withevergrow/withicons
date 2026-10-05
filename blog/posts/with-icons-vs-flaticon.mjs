import { p, h2, ul, figure, iconGrid, styleRow, table, yes, no, meh, verdict, callout, steps, cta, doDont, quote, prosCons, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

export default {
  slug: 'with-icons-vs-flaticon',
  category: 'comparisons',
  date: '2026-10-02',
  hero: 'flat0',
  stickers: [['image', 'solid'], ['tag', 'duo'], ['gift', 'gloss']],
  title: 'with icons vs Flaticon: free icons with or without the credit line',
  cardTitle: 'with icons vs Flaticon',
  h1: 'with icons vs Flaticon: what “free with attribution” <em>really</em> means',
  dek: 'Flaticon has millions of icons, and most people grab them for slides, posters and Canva designs. But free Flaticon icons come with a rule. Here is what it means in practice, and when a no-credit set is simpler.',
  description: 'with icons vs Flaticon for non-designers: honest pros and cons, what Flaticon attribution means in slides and Canva, Premium pricing, and no-credit options.',
  keywords: ['with icons vs Flaticon', 'Flaticon alternative', 'Flaticon pros and cons', 'Flaticon attribution', 'icons without attribution', 'free icons for presentations', 'Flaticon Premium price'],
  about: ['Flaticon', 'with icons', 'Attribution', 'Icon license'],
  related: ['free-icons-commercial-use', 'icons-in-presentations', 'best-free-icon-libraries'],
  tldr: [
    '<strong>Pick Flaticon</strong> if you need a very specific or illustrated icon: it has over 18 million icons and stickers from many artists.',
    `<strong>Pick with icons</strong> if you want free icons with no credit line, as PNG or SVG, that all match each other in ${N_STYLES} styles.`,
    'Free Flaticon icons require attribution: a line like “Icon made by [author] from Flaticon” near the icon or in your credits. Premium removes that rule.',
    'Flaticon Premium costs $99 a year for US customers (about $8.25 a month), with a month-to-month option too. Prices are shown in local currency.',
    `with icons is MIT licensed: ${N_ICONS} icons in ${N_STYLES} styles (${N_SVGS} SVGs), free for personal and commercial use, no credit and no account.`,
  ],
  faq: [
    { q: 'Do I have to credit Flaticon in a presentation?', a: 'On the free plan, yes. Flaticon asks free users to always credit the author. Outside websites, the credit should sit next to the icon if possible, or otherwise in a credits or acknowledgements section, which for a slide deck usually means a credits slide. Flaticon Premium removes the requirement.' },
    { q: 'How do I write a Flaticon attribution?', a: 'Flaticon’s help centre gives the format “designed by {Author’s Name} from Flaticon”, with a link on websites. For social posts it suggests “Icon made by [author] from @flaticon”. Each icon’s download page shows the author’s name.' },
    { q: 'Is Flaticon free for commercial use?', a: 'Yes, Flaticon’s free licence allows commercial use as long as you include the attribution. You may not resell or redistribute the icon files themselves. Premium lets you skip the credit.' },
    { q: 'Can I get SVG icons from Flaticon for free?', a: 'Flaticon’s pricing page lists free downloads as PNG, with SVG, EPS and PSD formats included in Premium. with icons gives you both SVG and PNG for free.' },
    { q: 'Is there a free Flaticon alternative without attribution?', a: `Yes. with icons is free under the MIT licence, which needs no credit line in slides, websites, apps or print. It has ${N_ICONS} everyday icons in ${N_STYLES} matching styles with free PNG and SVG downloads, so it suits common needs rather than rare or one-off illustrated icons.` },
    { q: 'Do I need to credit with icons?', a: 'No. with icons uses the MIT licence, which does not require any visible credit in your slides, website, app or print work. If you share the icon source files themselves, keep the licence file with them.' },
  ],
  sources: [
    { title: 'Flaticon pricing (Premium features, formats, US prices)', url: 'https://www.flaticon.com/pricing' },
    { title: 'Flaticon help: Attribution, how, when and where?', url: 'https://support.flaticon.com/s/article/Attribution-How-when-and-where-FI?language=en_US' },
    { title: 'Flaticon terms of use', url: 'https://www.flaticon.com/legal' },
    { title: 'Flaticon free licence certificate (PDF)', url: 'https://www.flaticon.com/license/license.pdf' },
    { title: 'Freepik becomes Magnific (press release, April 2026)', url: 'https://www.prnewswire.com/news-releases/freepik-becomes-magnific-hits-230m-arr-and-introduces-the-no-collar-creative-economy-302755376.html' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">Flaticon vs with icons, in short: use Flaticon when you need a very specific or illustrated icon from its millions of designs and you are happy to credit the artist (or pay for Premium). Use ${L.icons('with icons')} when you want everyday icons that all match, in ${N_STYLES} styles, as free PNG and SVG files with no credit line at all.</span>`)}
${p(`You are building a slide deck at 11pm. You need a rocket, a handshake and a little chart. You search “free icons”, land on Flaticon, download three PNGs, drop them in and move on. Done, right? Almost. There is a small rule many people miss.`)}
${p(`Free Flaticon icons come with <strong>attribution</strong>: you are expected to credit the artist. That is fair and easy once you know it, but it is easy to forget. with icons works differently: every icon is free under the MIT licence with no credit at all. This guide explains both in plain English.`)}

${h2('How do Flaticon and with icons compare?')}
${table(['', 'with icons', 'Flaticon (free plan)'], [
  ['Price', yes('Free'), yes('Free, Premium from $99/year (US)')],
  ['Credit required?', yes('No, never'), no('Yes, on the free plan')],
  ['How many icons', `${N_ICONS} icons × ${N_STYLES} styles = ${N_SVGS} SVGs`, 'Over 18 million icons and stickers'],
  ['Free file formats', yes('PNG and SVG'), meh('PNG (SVG with Premium)')],
  ['Do the icons match each other?', yes('Yes, one family, one grid'), meh('Only within the same artist’s pack')],
  ['Who draws them', 'One team, one design system', 'Thousands of contributing artists'],
  ['Copy straight into slides', yes('Copy image button'), meh('Download, then insert')],
  ['Coloured illustrations and stickers', meh('Icons only, but in colourful styles like sticker, kawaii and retro'), yes('Yes, a huge range')],
], 'with icons and Flaticon, side by side (checked October 2026)')}

${h2('What is Flaticon?')}
${p('Flaticon is an icon <strong>marketplace</strong>: a giant online shop window where many different artists publish icons, and you browse, search and download. It is run by Freepik Company, the Spanish company behind the Freepik stock site (which rebranded as Magnific in April 2026). Flaticon’s pricing page lists more than 18 million icons and stickers.')}
${p('That size is the big draw. Need a cartoon avocado, a specific cricket bat or a sticker of a sleepy cat? Someone has probably drawn it. Flaticon has flat icons, line icons, coloured icons, hand-drawn ones and stickers, in thousands of styles.')}
${p('It runs on a “freemium” model. You can download PNG files for free as long as you give credit. A Premium subscription removes the credit rule and unlocks more formats and unlimited downloads.')}
${p(`In our other comparisons, like ${L.post('with-icons-vs-material-symbols', 'with icons vs Material Symbols')}, we put the rival’s real icons next to ours. We do not do that here, for two friendly reasons. Flaticon is not one icon set but thousands of artists’ work, so there is no single “Flaticon heart” to compare against. And its licence asks for a credit on every icon and does not allow redistributing the files, so copying them onto this page would not be fair to those artists. Instead, here is what one consistent family looks like: the same twelve everyday icons we use in every face-off, all drawn on one grid.`)}
${iconGrid(['home', 'search', 'settings', 'user', 'bell', 'mail', 'heart', 'trash', 'calendar', 'shopping-cart', 'star', 'download'], 'line', 'Twelve everyday with icons in the line style. Same stroke, same corners, same size, so any of them can sit next to any other.')}

${h2('What does “attribution” mean in real life?')}
${p('Attribution just means <strong>saying who made it</strong>, the way a photo in a newspaper has a small photographer’s name under it. With free Flaticon icons, you credit the icon’s author and Flaticon. Flaticon’s help centre gives this format:')}
${quote('designed by {Author’s Name} from Flaticon', 'Flaticon help centre, attribution format')}
${p('Where that line goes depends on what you are making. Here is Flaticon’s guidance, translated into everyday situations:')}
${ul([
  '<strong>Website</strong>: a visible link on the page where the icon appears, next to the icon or in the footer.',
  '<strong>Slides, documents, videos and other media</strong>: next to the icon if possible. If not, in a credits or acknowledgements section. For a deck, that usually means a credits slide at the end.',
  '<strong>Printed work</strong>: on the final piece, for example in a book’s acknowledgements.',
  '<strong>Apps and games</strong>: on the app’s credits page and in the app store description.',
  '<strong>Social media</strong>: in the post or its comments, like “Icon made by [author] from @flaticon”.',
])}
${callout('warn', 'Each icon can have a different author. If you used icons from five artists, that is five names to credit. Keep a little list as you download, because finding the authors again later is tedious.')}
${figure('flat1', 'Most people meet Flaticon while designing something quickly. Keeping track of credits is the step that gets forgotten.')}

${h2('Do I really need a credit on my slides or Canva design?')}
${p('If you used the free plan, yes. Flaticon says free users must always attribute the author. Nobody is likely to raid your school presentation, but it is the deal you accepted when you downloaded, and for client work, published reports or anything public, it matters.')}
${p('In practice you have three options:')}
${steps([
  ['Add the credit', 'Put a small line under the icon, or add a “Credits” slide or page listing each icon’s author and Flaticon.'],
  ['Pay for Premium', 'Flaticon Premium removes the attribution requirement. Check the licence terms for what happens to icons after you cancel.'],
  ['Use a no-credit set', `Pick icons that never need a credit, like ${L.icons('with icons')} (MIT licence).`],
])}
${p(`Our guide ${L.post('free-icons-commercial-use', 'Can I use free icons commercially?')} explains attribution, MIT, CC BY and other licence words in more detail, with examples.`)}

${h2('How much is Flaticon Premium?')}
${p('Flaticon shows prices in your local currency. For US customers, the yearly plan is $99 a year (about $8.25 a month), and there is a more expensive month-to-month option. Premium, according to the pricing page, adds:')}
${ul([
  'No attribution required.',
  'More file formats: SVG, EPS, PSD and Base64, on top of PNG.',
  'Unlimited downloads and collections, the online editor without limits, and no ads.',
])}
${p('If you design for a living and need lots of varied illustrations, that is fair value. If you mainly need everyday icons like home, mail, calendar, chart and rocket, you can get those free with no credit from a set like with icons.')}
${callout('note', 'Prices change, and they vary by country. We checked Flaticon’s pricing page in October 2026. Look there for today’s price in your currency.')}

${h2('What can’t you do with Flaticon icons?')}
${p('Even with Premium, Flaticon’s licence keeps a few limits. You can use icons in commercial projects and you can edit them, but you may not resell, sublicense or redistribute the icon files themselves (for example, packaging them up as your own icon pack). Flaticon’s help pages also say you cannot register an image that includes its resources, which matters if you were thinking of building a logo from an icon. Always read the current terms for your use.')}
${p(`with icons is MIT licensed, one of the most relaxed licences there is: use, change, share and sell work that includes the icons, commercially or not. The only condition is to keep the licence notice if you share the icon files themselves. Details are on our ${L.page('license.html', 'license page')}.`)}

${h2('Why do Flaticon icons sometimes look mismatched?')}
${p('Because a marketplace is many artists, and every artist draws a little differently: line thickness, corner shapes, colours, even perspective. If you grab a rocket from one artist and a chart from another, the slide can look patchy without anyone quite knowing why. Flaticon helps by grouping icons into packs by the same artist, so picking from one pack is the trick.')}
${p(`with icons is a single family. All ${N_ICONS} icons were drawn on the same grid with the same rules, then rendered into ${N_STYLES} styles: line, solid and duo for everyday use, plus 17 creative ones such as glass, sticker, pixel, retro and kawaii. Any icon goes with any other icon in the same style.`)}
${iconGrid(['rocket', 'chart-line', 'users', 'lightbulb', 'target', 'trophy'], 'sketch', 'A pitch-deck set in the sketch style. Every icon comes from the same family, so they look like they belong together.')}
${styleRow('gift')}
${doDont('<p>Pick one style for a whole deck: gloss for a bold pitch, line for a clean report, sketch for a friendly workshop, retro or sticker for a playful talk.</p>', '<p>Mix a 3D icon, a flat coloured one and a thin line one on the same slide. It reads as cluttered.</p>')}

${h2('How do I get a no-credit icon into Canva or Slides?')}
${p(`with icons is built for exactly this. No sign-up, no download limit, no credit line to remember:`)}
${steps([
  ['Search for the idea', `Open ${L.icons('the library')} and type normal words like “money”, “team” or “bin”.`],
  ['Pick a style and colour', `Choose one of the ${N_STYLES} styles, then set any colour to match your brand or try one of the icon’s hand-picked palettes.`],
  ['Copy image, paste', 'Click Copy image and paste it into PowerPoint, Google Slides, Canva or Word. Or download a PNG or SVG.'],
])}
${p(`Step-by-step help lives in our guides for ${L.guide('canva', 'Canva')}, ${L.guide('google-slides', 'Google Slides')}, ${L.guide('powerpoint', 'PowerPoint')} and ${L.guide('word-google-docs', 'Word and Google Docs')}. And our post on ${L.post('icons-in-presentations', 'icons in presentations')} covers sizes, colours and layout.`)}

${h2('What are the pros and cons of Flaticon and with icons?')}
${p('Both are useful, for different jobs. Here are the honest strong and weak sides of each, in plain words, including ours.')}
${prosCons('Flaticon', {
  pros: [
    ['Enormous choice', 'Flaticon lists more than 18 million icons and stickers. If you need a cartoon avocado or a very specific sport, someone has probably drawn it.'],
    ['Illustrations and stickers too', 'Beyond simple interface icons, you get coloured, hand-drawn and sticker styles that work well on posters and social posts.'],
    ['Packs that match', 'Icons are grouped into packs by the same artist, so picking from one pack keeps a design consistent.'],
    ['Free for commercial use, with credit', 'The free licence allows commercial projects as long as you credit the author. Premium removes the credit rule.'],
    ['Premium extras', 'Premium adds SVG, EPS, PSD and Base64 formats, unlimited downloads and the online editor without limits.'],
  ],
  cons: [
    ['A credit on the free plan', 'Every free icon needs a credit to its author, and different icons can have different authors. It is easy to forget, especially on slides.'],
    ['Free downloads are PNG', 'Sharp SVG files, which scale to any size, are part of Premium. Premium costs $99 a year for US customers.'],
    ['Styles can clash', 'Thousands of artists draw differently, so mixing icons from different packs can make a slide look patchy.'],
    ['Limits even with Premium', 'You may not resell or redistribute the icon files, and Flaticon says you cannot register an image that includes its resources, for example as a logo.'],
  ],
})}
${prosCons('with icons', {
  pros: [
    ['No credit, ever', 'The MIT licence lets you use every icon in personal and commercial work without a credit line, and there is no account to create.'],
    ['Free PNG and SVG', 'Every icon page has Copy image, PNG downloads in any size and colour, and an SVG download, all free.'],
    [`One family, ${N_STYLES} styles`, `All ${N_ICONS} icons share one grid, then come in line, solid and duo plus 17 creative styles such as glass, sticker, pixel and luxe. Any icon matches any other in the same style.`],
    ['Search in everyday words', 'Type “bin” and you get trash, type “gear” and you get settings, so you find icons the way you talk.'],
  ],
  cons: [
    ['A much smaller catalogue', `With ${N_ICONS} everyday icons, rare objects and one-off illustrations are not there, and there are no brand logos.`],
    ['Newer, with a smaller community', 'Flaticon is a long-running, widely used site. with icons is young, so there is less written about it so far.'],
    ['Creative styles need room', 'The 17 creative styles, such as gloss, glass, pixel and luxe, look best at 32px or larger. For tiny icons in an app, use line, solid or duo.'],
  ],
})}
${p('Who each suits: Flaticon suits designers and content makers who need rare, coloured or illustrated icons and are happy to add credits or pay for Premium. with icons suits anyone making slides, docs, websites or apps who mostly needs everyday icons that match and never wants to think about a credit line.')}

${verdict({
  a: ['with icons', ['You never want to think about credit lines.', 'You want free SVG and PNG, not just PNG.', `You want icons that all match, in ${N_STYLES} styles.`, 'You mostly need everyday business, app and presentation icons.']],
  b: ['Flaticon', ['You need a rare or illustrated icon or a sticker.', 'You are fine adding a credit, or you pay for Premium.', 'You like browsing many artists’ styles.']],
})}

${h2('So, should you use Flaticon or with icons?')}
${p(`Flaticon is an enormous, useful library, and “free with attribution” is a fair deal as long as you actually add the credit. with icons is the simpler option when you want matching everyday icons and no credit lines. If you are switching, our ${L.alt('flaticon', 'Flaticon alternative page')} helps you find each icon’s twin by meaning.`)}
${cta('Free icons, no credit line', `${N_ICONS} icons in ${N_STYLES} matching styles. Copy straight into your slides, or download PNG and SVG. MIT licensed.`, ['image', 'gift', 'rocket', 'heart', 'sparkles', 'star'])}
`,
}
