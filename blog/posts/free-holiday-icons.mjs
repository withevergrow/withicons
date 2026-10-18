import { p, h2, h3, ul, iconGrid, styleRow, table, callout, steps, cta, stats, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'
import { nCat, catLink, demo, demosHome, DATES, LICENCE } from './_festive.mjs'

const HOLIDAY_STYLES = ['utsav', 'rangoli', 'halloween', 'christmas', 'lunar', 'valentine']
const CATS = ['halloween', 'indian-festivals', 'christmas', 'lunar-new-year', 'valentines']
const N_FEST = CATS.reduce((n, c) => n + nCat(c), 0)

export default {
  slug: 'free-holiday-icons',
  category: 'guides',
  date: '2026-10-12',
  hero: 'best4',
  stickers: [['jack-o-lantern', 'halloween'], ['diya', 'rangoli'], ['christmas-tree', 'christmas']],
  title: 'Free holiday and festival icons for every celebration',
  cardTitle: 'Free holiday and festival icons',
  h1: 'Free <em>holiday</em> and festival icons, all year round',
  dek: 'Halloween, Diwali, Christmas, Lunar New Year and Valentine’s Day: festive icons, six holiday styles and a calendar of when to bring each one out.',
  description: `Free holiday icons: ${N_FEST} festival icons and ${HOLIDAY_STYLES.length} holiday styles for Halloween, Diwali, Christmas, Lunar New Year and Valentine’s. SVG or PNG, MIT.`,
  keywords: ['free holiday icons', 'festival icons', 'seasonal icons', 'holiday svg icons', 'festive icons', 'christmas icons', 'halloween icons', 'diwali icons', 'lunar new year icons', 'valentines icons'],
  about: ['Holidays', 'Festivals', 'Icons', 'Seasonal marketing'],
  related: ['free-halloween-icons', 'free-diwali-icons', 'free-christmas-icons'],
  tldr: [
    `<strong>with icons has ${N_FEST} festival icons</strong> across five sets: Halloween (${nCat('halloween')}), Indian festivals (${nCat('indian-festivals')}), Christmas (${nCat('christmas')}), Lunar New Year (${nCat('lunar-new-year')}) and Valentine’s Day (${nCat('valentines')}).`,
    `<strong>Six holiday styles</strong> (Utsav, Rangoli, Halloween, Christmas, Lunar and Valentine) can dress all ${N_ICONS} icons for the season, so a calendar or a cart matches the decorations.`,
    `Coming up: Halloween ${DATES.halloween.short}, Diwali ${DATES.diwali.short}, Christmas ${DATES.christmas.short}, Lunar New Year ${DATES.lunar.short} and Valentine’s Day ${DATES.valentine.short}.`,
    'Everything is free under the MIT licence, for personal and commercial use, with no credit needed. Copy, PNG and SVG are one click each.',
  ],
  faq: [
    { q: 'Are these holiday icons free for commercial use?', a: `Yes. ${LICENCE}` },
    { q: 'Which holidays do the icons cover?', a: 'Halloween, Diwali and other Indian festivals (Durga Puja, Holi, Raksha Bandhan, Makar Sankranti), Christmas and winter, Lunar New Year, and Valentine’s Day. Every other icon in the library can also be shown in any of the six holiday styles.' },
    { q: 'When should I start a holiday campaign?', a: 'A common rule of thumb is two to four weeks before the day for social posts and invitations, and four to six weeks for gift guides and shop campaigns. Our calendar on this page lists the next date for each festival.' },
    { q: 'Can I use one style for several holidays?', a: 'Yes. Calm styles like line, duo or clay work for every festival, with only the icons changing. The six holiday styles are made for one season each, which makes them more striking but less reusable.' },
    { q: 'Can I see the holiday icons on a real page?', a: 'Yes. The live demo gallery has Halloween, Diwali, Christmas and Lunar New Year invitations built with these icons. Each one lets you switch styles so you can compare.' },
  ],
  sources: [
    { title: 'with icons: Holidays style group', url: 'https://withicons.com/styles/halloween.html' },
    { title: 'SmartPuja: Diwali 2026 date (8 November 2026)', url: 'https://www.smartpuja.com/blog/diwali-2026-date' },
    { title: 'Hong Kong Observatory: Gregorian-Lunar calendar conversion table', url: 'https://www.hko.gov.hk/en/gts/time/conversion.htm' },
    { title: 'with icons licence (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">You can get free holiday and festival icons from ${L.icons('with icons')}: ${N_FEST} icons drawn for Halloween, Diwali and other Indian festivals, Christmas, Lunar New Year and Valentine’s Day, plus six holiday styles that can dress all ${N_ICONS} icons for the season. They come as SVG or PNG under the MIT licence, free for personal and commercial use with no credit.</span>`)}
${p('This page is the hub. It shows the six holiday styles side by side, gives you a calendar of when to use each set, and links to a full guide for every festival.')}
${styleRow('gift', 'One gift icon, six holiday styles: Utsav, Rangoli, Halloween, Christmas, Lunar and Valentine.', { styles: HOLIDAY_STYLES })}
${stats([[N_FEST, 'festival icons'], [HOLIDAY_STYLES.length, 'holiday styles'], [N_ICONS, 'icons in every style'], [N_STYLES, 'styles in all']])}

${h2('When should you use each festival icon set?')}
${p('Here is the festive calendar for the 2026 to 2027 season, with a sensible time to start each campaign. Dates were checked in October 2026; festivals that follow a lunar calendar move every year.')}
${table(['Festival', 'Date', 'Start your posts', 'Style', 'Guide'], [
  ['Halloween', DATES.halloween.day, 'Early October', L.style('halloween'), L.post('free-halloween-icons', 'Halloween icons')],
  ['Diwali', `${DATES.diwali.day} (Dhanteras on 6 November)`, 'Mid October', `${L.style('utsav')} or ${L.style('rangoli')}`, L.post('free-diwali-icons', 'Diwali icons')],
  ['Christmas', DATES.christmas.day, 'Mid November', L.style('christmas'), L.post('free-christmas-icons', 'Christmas icons')],
  ['Lunar New Year', `${DATES.lunar.day} (Year of the Goat)`, 'Mid January', L.style('lunar'), L.post('free-lunar-new-year-icons', 'Lunar New Year icons')],
  ['Valentine’s Day', DATES.valentine.day, 'Late January', L.style('valentine'), L.post('free-valentines-day-icons', 'Valentine’s icons')],
], 'Festive calendar, 2026 to 2027')}
${callout('note', 'Lunar New Year and Valentine’s Day are only eight days apart in 2027. If you run both, plan the two campaigns together so they do not compete for the same week.')}

${h2('Halloween icons')}
${iconGrid(['jack-o-lantern', 'ghost', 'bat', 'witch-hat', 'cauldron', 'candy-bucket'], 'halloween', `Six of the ${nCat('halloween')} Halloween icons, in the Halloween style.`)}
${p(`Pumpkins, ghosts, bats, a witch hat and a candy bucket, in a spooky-cute style with candle-lit carvings and slime drips. Read the full ${L.post('free-halloween-icons', 'guide to free Halloween icons')}, browse the ${catLink('halloween', 'Halloween category')}, or see ${demo('boo-bash')} and ${demo('haunted-hollow')}.`)}

${h2('Diwali and Indian festival icons')}
${iconGrid(['diya', 'rangoli-pattern', 'kalash', 'sky-lantern', 'mithai-box', 'marigold'], 'rangoli', `Six of the ${nCat('indian-festivals')} Indian festival icons, in the Rangoli style.`)}
${p(`Diyas, rangoli, a kalash, sky lanterns, sweets and marigolds, with icons for Durga Puja and Holi too. Two styles suit them: hand-crafted ${L.style('utsav', 'Utsav')} and modern ${L.style('rangoli', 'Rangoli')}. Read the ${L.post('free-diwali-icons', 'guide to free Diwali icons')}, browse the ${catLink('indian-festivals', 'Indian festivals category')}, or open ${demo('diwali-dinner')} and ${demo('diwali-mela')}.`)}

${h2('Christmas and winter icons')}
${iconGrid(['christmas-tree', 'bauble', 'snowman', 'gingerbread-man', 'wreath', 'gift-stack'], 'christmas', `Six of the ${nCat('christmas')} Christmas icons, in the Christmas style.`)}
${p(`Trees, baubles, a snowman, gingerbread and wreaths, in a cosy style with a snow cap on every top edge. Read the ${L.post('free-christmas-icons', 'guide to free Christmas icons')}, browse the ${catLink('christmas', 'Christmas category')}, or see ${demo('cookie-swap')}.`)}

${h2('Lunar New Year icons')}
${iconGrid(['red-lantern', 'red-envelope', 'lion-head', 'dumpling', 'mandarin-orange', 'plum-blossom'], 'lunar', `Six of the ${nCat('lunar-new-year')} Lunar New Year icons, in the Lunar style.`)}
${p(`Lanterns, red envelopes, a lion dance, dumplings and mandarins, in lucky red lacquer and gold with no text, so they suit Chinese New Year, Tết and Seollal. Read the ${L.post('free-lunar-new-year-icons', 'guide to free Lunar New Year icons')}, browse the ${catLink('lunar-new-year', 'Lunar New Year category')}, or open ${demo('lunar-reunion')}.`)}

${h2('Valentine’s Day icons')}
${iconGrid(['heart-pair', 'love-letter', 'rose-bouquet', 'chocolate-box', 'teddy-bear', 'ring-box'], 'valentine', `Six of the ${nCat('valentines')} Valentine’s icons, in the Valentine style.`)}
${p(`Hearts, love letters, roses, chocolates and a teddy bear, as cute pink-to-red stickers. Read the ${L.post('free-valentines-day-icons', 'guide to free Valentine’s Day icons')} or browse the ${catLink('valentines', 'Valentine’s category')}.`)}

${h2('Should you use a holiday style or an everyday style?')}
${p('Both work. It depends on how loud you want the season to be.')}
${ul([
  '<strong>A holiday style</strong> makes a page feel dressed up for one celebration. It is perfect for invitations, greetings, a festive landing page or a seasonal app theme. Use it at 32px or larger.',
  '<strong>An everyday style</strong> like line, duo or clay keeps your brand look, and only the icons change with the season. That is often the better choice for a shop that runs five campaigns a year.',
])}
${styleRow('christmas-tree', 'A Christmas tree in its holiday style, then in duo, clay and line for a calmer look.', { styles: ['christmas', 'duo', 'clay', 'line'] })}

${h2('How do you get holiday icons into your design?')}
${steps([
  ['Pick the festival', 'Open the category or the guide for your festival, or search the library in everyday words like “lantern” or “pumpkin”.'],
  ['Choose a style and palette', 'Switch to the holiday style (or any other), then pick one of the icon’s 20 to 30 ready-made colour palettes.'],
  ['Copy or download', 'Copy image for slides and chats, PNG for emails and social posts, SVG for print and websites.'],
  ['Drop it in', `Paste into ${L.guide('canva', 'Canva')}, ${L.guide('google-slides', 'Google Slides')} or ${L.guide('powerpoint', 'PowerPoint')}. Developers can install the icons from npm; see the ${L.page('developers.html', 'developer docs')}.`],
])}
${p(`Every festival guide includes a short React and CDN example. For the basics of placing icons on a page, read ${L.post('how-to-add-icons-to-a-website', 'how to add icons to a website')}.`)}

${h2('Where can you see them all in action?')}
${p(`${demosHome('The live demo gallery')} has real pages built with these icons: invitations for Halloween, Diwali, Christmas and Lunar New Year, plus shops and family events. Every demo has a style switcher, so you can try the same page in a holiday style and an everyday one. For the bigger picture of all ${N_STYLES} styles, read ${L.post('icon-styles-explained', 'icon styles explained')}.`)}
${cta('Celebrate every season with one icon set', `${N_FEST} festival icons, six holiday styles and ${N_ICONS} icons in each. Free and MIT licensed.`, ['jack-o-lantern', 'diya', 'christmas-tree', 'red-lantern', 'heart-pair', 'gift'])}
`,
}
