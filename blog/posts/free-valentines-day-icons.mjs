import { p, h2, h3, ul, iconGrid, styleRow, motionGrid, swapGrid, table, callout, doDont, cta, stats, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'
import { inCat, nCat, catLink, demo, demosHome, howTo, DATES, LICENCE } from './_festive.mjs'

const N = nCat('valentines')
const LOVE = inCat('valentines')

export default {
  slug: 'free-valentines-day-icons',
  category: 'guides',
  date: '2026-10-12',
  hero: 'dark1',
  stickers: [['heart-pair', 'valentine'], ['love-letter', 'valentine'], ['rose', 'valentine']],
  title: `Free Valentine’s Day icons: ${N} cute SVGs and a Valentine style`,
  cardTitle: 'Free Valentine’s Day icons',
  h1: 'Free <em>Valentine’s Day</em> icons, sweet but still clear',
  dek: 'Hearts, roses, love letters, chocolates and a teddy bear, plus a pink-to-red style that turns any icon into a little love note.',
  description: `Free Valentine’s Day icons: ${N} romantic icons (hearts, rose, love letter, chocolate box) and all ${N_ICONS} icons in a cute Valentine style. SVG or PNG, MIT.`,
  keywords: ['free valentines day icons', 'valentine icons svg', 'heart icons', 'love icons', 'rose icon', 'valentine icons png', 'galentines icons', 'romantic icons'],
  about: ['Valentine’s Day', 'Icons', 'Gift shops'],
  related: ['free-holiday-icons', 'free-lunar-new-year-icons', 'free-christmas-icons'],
  tldr: [
    `<strong>with icons has ${N} Valentine’s Day icons</strong>: a love letter, a heart pair, a rose and a rose bouquet, a chocolate box, a teddy bear, a ring box, a love lock and more, free under the MIT licence.`,
    `<strong>The Valentine style</strong> redraws all ${N_ICONS} icons as cute pink-to-red stickers with a berry outline, polka dots, tiny blushing faces and floating hearts.`,
    'Good for gift shops, florists, cafés, dating apps, cards and Galentine’s parties.',
    `Valentine’s Day 2027 is ${DATES.valentine.day}, eight days after Lunar New Year. Gift guides usually go out in late January.`,
  ],
  faq: [
    { q: 'Can I use these Valentine icons in my shop?', a: `Yes. ${LICENCE} Florists, bakeries and gift shops can use them on product pages, flyers and packaging.` },
    { q: 'How many Valentine’s Day icons are there?', a: `${N} icons are drawn for Valentine’s Day, and the Valentine style works on all ${N_ICONS} icons in the library, so a calendar, a cart or a map pin can match your hearts.` },
    { q: 'Is there a plain heart icon too?', a: 'Yes. The everyday heart icon is in the main library in every style, from a thin line heart for a “like” button to a glossy or sticker heart for a banner. Line and solid hearts make a classic like and unlike pair.' },
    { q: 'Are the Valentine icons too cute for a grown-up brand?', a: 'The Valentine style is playful on purpose. For a more elegant look, show the same icons in the coquette, luxe or engrave styles, which feel softer and more refined.' },
    { q: 'Can I download Valentine icons as PNG?', a: 'Yes. On any icon page choose the Valentine style and press Download PNG. You pick the size, and the background is transparent.' },
  ],
  sources: [
    { title: 'with icons: Valentine’s category', url: 'https://withicons.com/categories/valentines.html' },
    { title: 'with icons: Valentine style', url: 'https://withicons.com/styles/valentine.html' },
    { title: 'with icons licence (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">Free Valentine’s Day icons are available from ${L.icons('with icons')}: ${N} romantic icons such as a love letter, a pair of hearts, a rose, a chocolate box and a teddy bear, plus a Valentine style that turns all ${N_ICONS} icons into cute pink-to-red stickers. Copy them or download SVG and PNG files, free for personal and commercial use under the MIT licence, with no credit needed.</span>`)}
${p(`Valentine’s Day 2027 is ${DATES.valentine.day}. This guide shows the full set, compares the Valentine style with softer options, and explains how to use the icons in cards, shop pages and apps.`)}
${iconGrid(LOVE, 'valentine', `All ${N} icons in the ${catLink('valentines', 'Valentine’s category')}, shown in the Valentine style.`)}
${stats([[N, 'Valentine’s icons'], [N_ICONS, 'icons in the Valentine style'], [N_STYLES, 'styles for each icon'], ['MIT', 'free licence, no credit']])}

${h2('Which Valentine’s Day icons are included?')}
${ul([
  `<strong>Hearts and notes:</strong> ${L.icon('heart-pair')}, ${L.icon('love-letter')}, ${L.icon('love-scroll')}, ${L.icon('heart-balloon')}, ${L.icon('heart-gift')} and ${L.icon('cupid-bow')}.`,
  `<strong>Flowers and gifts:</strong> ${L.icon('rose')}, ${L.icon('rose-bouquet')}, ${L.icon('chocolate-box')}, ${L.icon('choco-strawberry')}, ${L.icon('teddy-bear')} and ${L.icon('ring-box')}.`,
  `<strong>Dates and promises:</strong> ${L.icon('champagne-toast')}, ${L.icon('hot-cocoa')} and ${L.icon('love-lock')}.`,
])}
${p(`Search understands everyday words, so “two hearts” or “couple” finds the heart pair. For a plain ${L.icon('heart')}, the everyday heart icon is in the main library.`)}

${h2('What does the Valentine icon style look like?')}
${p(`The ${L.style('valentine', 'Valentine style')} draws each object as a cute cartoon sticker: pink-to-red shapes with a warm berry outline, a soft shine, polka dots and sprinkles, tiny blushing faces and little floating hearts. It is one of six holiday styles and a rich style, so it uses soft gradients. Like every style, it works on any icon, not just hearts.`)}
${iconGrid(['calendar', 'map-pin', 'utensils', 'coffee', 'gift', 'shopping-bag', 'camera', 'message-circle'], 'valentine', 'Everyday icons in the Valentine style: the date, the place, dinner, a coffee date, a gift, shopping, a photo and a sweet message.')}

${h2('How does the Valentine style compare with other styles?')}
${styleRow('heart-pair', 'Two hearts in Valentine, coquette, kawaii, luxe, engrave and line.', { styles: ['valentine', 'coquette', 'kawaii', 'luxe', 'engrave', 'line'] })}
${table(['Style', 'Feels', 'Good for'], [
  [L.style('valentine'), 'Cute, sweet, playful', 'Cards, cafés, dating apps, Galentine’s'],
  [L.style('coquette'), 'Romantic, ballet pink, bows and pearls', 'Boutiques, beauty, weddings'],
  [L.style('luxe'), 'Jewel-like and premium', 'Jewellers, hotels, fine dining'],
  [L.style('engrave'), 'Vintage print', 'Florists, stationery, wine shops'],
  [L.style('line'), 'Quiet and clear', 'Buttons and menus on a Valentine’s site'],
], 'Picking a style for a Valentine’s design')}

${h2('Where should you use Valentine’s icons?')}
${h3('Gift shops, florists and bakeries')}
${p('A gift guide sorted with icons is easy to scan: a rose bouquet for flowers, a chocolate box for sweets, a ring box for jewellery, a teddy for something soft. Put the icons on category tiles and the “order by” banner, and leave checkout icons plain.')}
${h3('Cards, invites and Galentine’s parties')}
${p(`An icon beside each detail makes an invite friendly and quick to read. We do not have a Valentine’s demo yet, but ${demo('nani-turns-80')} and ${demo('bloom-and-thread')} both list the Valentine style among their picks, so you can switch them over and see it on a real page.`)}
${h3('Dating apps and social posts')}
${p('A heart pair for a match, a love letter for a new message, a heart balloon for a celebration screen. At 48px and up these feel warm without getting in the way.')}
${doDont('<p>Use solid or line hearts for a small “like” button, and save the Valentine style for big moments.</p>', '<p>Use the Valentine style for every tiny control. The faces and dots need room, ideally 32px or larger.</p>')}

${h2('Do the Valentine icons move?')}
${p('Yes. Hover over or tap these tiles to see each icon’s own move. On a website the free motion package plays them, and they stay still for anyone who prefers reduced motion.')}
${motionGrid(['heart-pair', 'heart-balloon', 'love-letter', 'rose'], 'valentine', 'Hover or tap: the hearts beat, the balloon rises, the letter pops and the rose does a little dance.', { trigger: 'hover' })}
${p('A heart that fills when tapped is the classic “like” button. Tap the tile below to see the line heart switch to the solid one.')}
${swapGrid([['heart', 'heart@solid']], 'line', 'Tap to switch: a line heart turns solid, the same drawing in two styles.')}

${h2('Can you change the colours of Valentine icons?')}
${p('Yes. Each icon has 20 to 30 ready-made palettes. The heart pair, for example, comes as Red and pink, Blue and pink, Classic red, Rose pink, Blush pastel and Milk chocolate. Pick one on the icon page before you copy or download.')}
${callout('tip', 'Galentine’s, anniversaries and Mother’s Day can all use the same icons with a softer palette like Blush pastel. One set, several campaigns.')}

${howTo('valentine', ['heart-pair', 'love-letter'])}

${h2('What other festivals are covered?')}
${p(`Valentine’s Day closes the season that starts with ${L.post('free-halloween-icons', 'Halloween')} and runs through ${L.post('free-diwali-icons', 'Diwali')}, ${L.post('free-christmas-icons', 'Christmas')} and ${L.post('free-lunar-new-year-icons', 'Lunar New Year')}. Our ${L.post('free-holiday-icons', 'holiday and festival icon guide')} has every date in one calendar, ${demosHome('the demo gallery')} shows the festive styles on real pages, and the quick <a href="../free/valentines-day-icons.html">Valentine’s Day icons page</a> has a style picker.`)}
${cta('Send your page a little love', `${N} Valentine’s icons and ${N_ICONS} icons in the Valentine style. Free, MIT licensed, no sign-up.`, ['heart-pair', 'rose', 'love-letter', 'chocolate-box', 'teddy-bear', 'heart-balloon'])}
`,
}
