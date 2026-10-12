import { p, h2, h3, ul, iconGrid, styleRow, motionGrid, table, callout, doDont, cta, stats, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'
import { inCat, nCat, catLink, demo, demosHome, howTo, DATES, LICENCE } from './_festive.mjs'

const N = nCat('lunar-new-year')
const LNY = inCat('lunar-new-year')

export default {
  slug: 'free-lunar-new-year-icons',
  category: 'guides',
  date: '2026-10-12',
  hero: 'trends0',
  stickers: [['red-lantern', 'lunar'], ['red-envelope', 'lunar'], ['mandarin-orange', 'lunar']],
  title: 'Free Lunar New Year icons: lanterns, red envelopes and lucky gold',
  cardTitle: 'Free Lunar New Year icons',
  h1: 'Free <em>Lunar New Year</em> icons in lucky red and gold',
  dek: 'Lanterns, red envelopes, dumplings, mandarins and a lion dance, in a red-and-gold style with no text, so it suits every market.',
  description: `Free Lunar New Year icons: red lantern, red envelope, dumpling, lion head and ${N - 4} more, plus all ${N_ICONS} icons in a red-and-gold Lunar style. SVG or PNG, MIT.`,
  keywords: ['free lunar new year icons', 'chinese new year icons', 'red envelope icon', 'red lantern icon', 'lunar new year svg', 'spring festival icons', 'tet icons', 'seollal icons'],
  about: ['Lunar New Year', 'Chinese New Year', 'Icons'],
  related: ['free-holiday-icons', 'free-valentines-day-icons', 'free-christmas-icons'],
  tldr: [
    `<strong>with icons has ${N} Lunar New Year icons</strong>: a red lantern, red envelope, firecracker string, lion head, dragon head, mandarin orange, dumpling, gold ingot, lucky coin and more, free under the MIT licence.`,
    `<strong>The Lunar style</strong> redraws all ${N_ICONS} icons in lucky red lacquer with a gold-foil rim, jade details, paper-cut cloud scrolls, silk tassels and plum blossoms.`,
    'It uses no text or characters, so the same icons work for Chinese New Year, Tết, Seollal and other Lunar New Year celebrations.',
    `Lunar New Year 2027 is on ${DATES.lunar.day}, starting the Year of the Goat. Red-envelope promotions usually start two to three weeks before.`,
  ],
  faq: [
    { q: 'When is Lunar New Year 2027?', a: 'Saturday 6 February 2027. It begins the Year of the Goat (also called the Sheep or Ram), following the Year of the Horse. The celebrations traditionally run for about two weeks, ending with the Lantern Festival.' },
    { q: 'Is there a goat zodiac icon?', a: 'Not yet. The Lunar New Year set has a dragon head and a lion head for dances, but not the twelve zodiac animals. For a Year of the Goat message, pair a red lantern or red envelope with your own “Year of the Goat” headline.' },
    { q: 'Can I use these icons for a red-envelope promotion in my app?', a: `Yes. ${LICENCE} The red envelope, gold ingot and lucky coin icons are made for exactly that kind of promotion.` },
    { q: 'Are these icons only for Chinese New Year?', a: 'No. The Lunar style has no Chinese characters or text, and the objects (lanterns, envelopes, fans, plum blossom, tea) are shared across many Lunar New Year traditions, including Vietnamese Tết and Korean Seollal. Check that each object fits your audience before you publish.' },
    { q: 'Can I get the Lunar New Year icons as PNG?', a: 'Yes. Choose the Lunar style on any icon page and press Download PNG. The background is transparent, so the icons sit well on red or gold.' },
  ],
  sources: [
    { title: 'with icons: Lunar New Year category', url: 'https://withicons.com/categories/lunar-new-year.html' },
    { title: 'with icons: Lunar style', url: 'https://withicons.com/styles/lunar.html' },
    { title: 'Hong Kong Observatory: Gregorian-Lunar calendar conversion table', url: 'https://www.hko.gov.hk/en/gts/time/conversion.htm' },
  ],
  body: () => `
${p(`<span class="lede">Free Lunar New Year icons are part of ${L.icons('with icons')}: ${N} icons such as a red lantern, a red envelope, a firecracker string, a lion head, dumplings and mandarin oranges, plus a Lunar style that turns all ${N_ICONS} icons into red lacquer and gold. You can copy them or download SVG and PNG files, free for personal and commercial use under the MIT licence, with no credit needed.</span>`)}
${p(`Lunar New Year 2027 falls on ${DATES.lunar.day} and begins the Year of the Goat. This guide shows the full set, how the Lunar style compares with others, and how to use it for greetings, red-envelope offers and reunion dinner invitations.`)}
${iconGrid(LNY, 'lunar', `All ${N} icons in the ${catLink('lunar-new-year', 'Lunar New Year category')}, shown in the Lunar style.`)}
${stats([[N, 'Lunar New Year icons'], [N_ICONS, 'icons in the Lunar style'], [N_STYLES, 'styles for each icon'], ['0', 'words or characters in the art']])}

${h2('Which Lunar New Year icons are included?')}
${ul([
  `<strong>Luck and wealth:</strong> ${L.icon('red-envelope')}, ${L.icon('gold-ingot')}, ${L.icon('lucky-coin')}, ${L.icon('mandarin-orange')} and ${L.icon('chinese-knot')}.`,
  `<strong>Celebration:</strong> ${L.icon('red-lantern')}, ${L.icon('firecracker-string')}, ${L.icon('lion-head')}, ${L.icon('dragon-head')} and ${L.icon('lunar-drum')}.`,
  `<strong>The reunion table:</strong> ${L.icon('dumpling')}, ${L.icon('teapot')} and ${L.icon('chopsticks')}.`,
  `<strong>Spring:</strong> ${L.icon('plum-blossom')}, ${L.icon('bamboo')} and ${L.icon('paper-fan')}.`,
])}
${p('Search knows the everyday names too: “hongbao” or “ang pao” find the red envelope, and “tangerine” finds the mandarin.')}

${h2('What does the Lunar icon style look like?')}
${p(`The ${L.style('lunar', 'Lunar style')} is built on lucky red lacquer with a gold-foil rim. Gold and jade pick out details, paper-cut cloud scrolls curl around the edges, and silk tassels and plum blossoms add a finishing touch. There is no text and no characters in the art, so it fits any market and any language. It is a rich style, which means soft gradients give the lacquer its shine.`)}
${iconGrid(['gift', 'wallet', 'shopping-bag', 'calendar', 'map-pin', 'utensils', 'phone', 'users'], 'lunar', 'Everyday icons in the Lunar style: gifts, a wallet for red-envelope offers, shopping, the date, the restaurant, the menu, a call home and family.')}

${h2('How does the Lunar style compare with other styles?')}
${styleRow('red-lantern', 'A red lantern in Lunar, luxe, sticker, clay, solid and line.', { styles: ['lunar', 'luxe', 'sticker', 'clay', 'solid', 'line'] })}
${table(['Style', 'Feels', 'Good for'], [
  [L.style('lunar'), 'Lucky, festive, traditional', 'Greetings, red-envelope promos, reunion dinners'],
  [L.style('luxe'), 'Premium, jewel-like', 'Luxury gifting, hotels, banks'],
  [L.style('sticker'), 'Fun and bright', 'Kids, games, social stickers'],
  [L.style('clay'), 'Soft 3D', 'App banners and landing pages'],
  [L.style('solid'), 'Bold and simple', 'Small icons in an app tab bar during the festival'],
], 'Picking a style for a Lunar New Year design')}

${h2('Where should you use Lunar New Year icons?')}
${h3('Red-envelope promotions')}
${p('Apps, banks and shops across East and Southeast Asia run red-envelope offers in the weeks before the new year. A red envelope, a gold ingot and a lucky coin explain the offer at a glance, before anyone reads the small print.')}
${h3('Reunion dinner invitations')}
${p(`The reunion dinner on New Year’s Eve is the biggest family meal of the year. See how the icons work on a real page in our live demo ${demo('lunar-reunion')}, a dinner invitation with lanterns, red envelopes and fortunes. You can switch it to other styles to compare.`)}
${h3('Greetings, slides and newsletters')}
${p(`A single large lantern or plum blossom makes a calm greeting card or newsletter header. For team slides, keep one Lunar icon per slide at 64px or larger. Our ${L.post('icons-in-presentations', 'presentation guide')} has more tips.`)}
${doDont('<p>Check each object with someone from your audience. Customs differ between countries and families.</p>', '<p>Assume one tradition speaks for all. Tết and Seollal have their own foods and customs, so pick icons that fit.</p>')}

${h2('Do the Lunar New Year icons move?')}
${p('Many do. Hover over or tap these tiles to see each icon’s own small move. On a website the free motion package plays them, and it keeps them still for anyone who prefers reduced motion.')}
${motionGrid(['red-lantern', 'firecracker-string', 'lion-head', 'mandarin-orange'], 'lunar', 'Hover or tap: the lantern swings, the firecrackers shake, the lion nods and the mandarin bounces.', { trigger: 'hover' })}

${h2('Can you recolour the Lunar icons?')}
${p('Yes. Each icon has 20 to 30 ready-made palettes. The red lantern, for example, comes as Classic red lantern, Crimson silk, Golden lantern, Tangerine glow, Lit at night and Lotus pink. Pick one on the icon page before you copy or download.')}
${callout('tip', 'Red and gold read as lucky in many Lunar New Year traditions, but a soft palette like Lotus pink can feel fresher for a lifestyle brand. Keep one palette across the whole design.')}

${howTo('lunar', ['red-lantern', 'red-envelope'])}

${h2('What other festivals are covered?')}
${p(`Lunar New Year 2027 lands a week before ${L.post('free-valentines-day-icons', 'Valentine’s Day')}, so many shops run both campaigns back to back. Earlier in the season come ${L.post('free-halloween-icons', 'Halloween')}, ${L.post('free-diwali-icons', 'Diwali')} and ${L.post('free-christmas-icons', 'Christmas')}. See every date in our ${L.post('free-holiday-icons', 'holiday and festival icon guide')}, browse ${demosHome('the live demos')}, or use the quick <a href="../free/lunar-new-year-icons.html">Lunar New Year icons page</a>.`)}
${cta('Bring lucky red to your next page', `${N} Lunar New Year icons and ${N_ICONS} icons in the Lunar style. Free, MIT licensed, no sign-up.`, ['red-lantern', 'red-envelope', 'mandarin-orange', 'dumpling', 'lucky-coin', 'plum-blossom'])}
`,
}
