import { p, h2, h3, ul, iconGrid, styleRow, motionGrid, table, callout, doDont, cta, stats, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'
import { inCat, nCat, catLink, demo, demosHome, howTo, DATES, LICENCE } from './_festive.mjs'

const N = nCat('christmas')
const XMAS = inCat('christmas')

export default {
  slug: 'free-christmas-icons',
  category: 'guides',
  date: '2026-10-12',
  hero: 'trends3',
  stickers: [['christmas-tree', 'christmas'], ['snowman', 'christmas'], ['bauble', 'christmas']],
  title: `Free Christmas icons: ${N} festive SVGs and a cosy Christmas style`,
  cardTitle: 'Free Christmas icons',
  h1: 'Free <em>Christmas</em> icons for cards, shops and emails',
  dek: 'Trees, baubles, snowmen and gingerbread, plus a whole library with a snow cap on top. Free for anything you make this December.',
  description: `Free Christmas icons: ${N} festive icons (tree, bauble, snowman, stocking) and all ${N_ICONS} icons in a cosy Christmas style, as SVG or PNG. MIT licensed.`,
  keywords: ['free christmas icons', 'christmas svg icons', 'christmas icons png', 'christmas tree icon', 'holiday icons', 'winter icons', 'christmas email icons', 'festive icons'],
  about: ['Christmas', 'Icons', 'Holiday marketing'],
  related: ['free-holiday-icons', 'free-halloween-icons', 'free-lunar-new-year-icons'],
  tldr: [
    `<strong>with icons has ${N} Christmas icons</strong>: a tree, bauble, wreath, stocking, snowman, gingerbread man, reindeer, sleigh, nutcracker and more, free under the MIT licence.`,
    `<strong>The Christmas style</strong> redraws all ${N_ICONS} icons in cranberry, pine and gold, with snow resting on every top edge, candy-cane stripes and a sprig of holly.`,
    'Good for holiday emails, gift guides, shop banners, cards, party invites and end-of-year slides.',
    `Christmas Day 2026 is ${DATES.christmas.day}. Start holiday emails and gift guides in November.`,
  ],
  faq: [
    { q: 'Can I use these Christmas icons on products I sell?', a: `Yes. ${LICENCE} That includes printed cards, gift tags, templates and shop pages.` },
    { q: 'How many Christmas icons are there?', a: `${N} icons are drawn for Christmas, and the Christmas style can be applied to all ${N_ICONS} icons in the library, so a cart, a truck or an envelope can match your tree.` },
    { q: 'Do Christmas icons work in email newsletters?', a: 'Yes, as PNG images. Many email apps do not show SVG, so download a PNG at twice the size you need (for example 96px for a 48px spot) and set the width in your email tool. It stays crisp on high-resolution screens.' },
    { q: 'Are there winter icons that are not Christmas?', a: 'Yes. Snowman, snow globe, fireplace and hot cocoa (in the Valentine’s set) feel wintry without being religious or tied to one day, which is handy for January sales and “happy holidays” messages.' },
    { q: 'Can I make the Christmas icons match my brand colours?', a: 'Pick one of the ready-made palettes on each icon page. The Christmas tree alone has palettes such as Classic fir, Frosted spruce, White tinsel tree and Pink flocked tree.' },
  ],
  sources: [
    { title: 'with icons: Christmas category', url: 'https://withicons.com/categories/christmas.html' },
    { title: 'with icons: Christmas style', url: 'https://withicons.com/styles/christmas.html' },
    { title: 'with icons licence (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">Free Christmas icons are available from ${L.icons('with icons')}: ${N} festive icons such as a Christmas tree, a bauble, a wreath, a stocking and a snowman, plus a Christmas style that dresses all ${N_ICONS} icons in cranberry, pine and gold with a cap of snow. You can copy them or download SVG and PNG files, and the MIT licence means no fee and no credit, even for commercial use.</span>`)}
${p(`Below you will find the full set, the Christmas style next to a few alternatives, ideas for where to use them and the quickest way to get them into an email, a card or a website. Christmas Day 2026 is on ${DATES.christmas.day}, and most shops start their holiday campaigns in mid-November.`)}
${iconGrid(XMAS, 'christmas', `All ${N} icons in the ${catLink('christmas', 'Christmas category')}, shown in the Christmas style.`)}
${stats([[N, 'Christmas icons'], [N_ICONS, 'icons in the Christmas style'], [N_STYLES, 'styles for each icon'], ['MIT', 'free licence, no credit']])}

${h2('Which Christmas icons are in the set?')}
${ul([
  `<strong>Decorations:</strong> ${L.icon('christmas-tree')}, ${L.icon('bauble')}, ${L.icon('wreath')}, ${L.icon('stocking')}, ${L.icon('mistletoe')}, ${L.icon('holly')}, ${L.icon('poinsettia')} and ${L.icon('christmas-candle')}.`,
  `<strong>Characters:</strong> ${L.icon('snowman')}, ${L.icon('gingerbread-man')}, ${L.icon('reindeer')}, ${L.icon('nutcracker')} and ${L.icon('santa-hat')}.`,
  `<strong>Gifts and treats:</strong> ${L.icon('gift-stack')} and ${L.icon('candy-cane')}.`,
  `<strong>Cosy scenes:</strong> ${L.icon('fireplace')}, ${L.icon('snow-globe')}, ${L.icon('sleigh')}, ${L.icon('jingle-bells')} and ${L.icon('north-star')}.`,
])}
${p('Search understands everyday words, so “ornament” finds the bauble and “present” finds the gift stack.')}

${h2('What does the Christmas icon style look like?')}
${p(`The ${L.style('christmas', 'Christmas style')} is warm and cosy. Shapes are painted in cranberry red, pine green and gold with a soft inner light. The clever part is the snow: a cap of it rests on the top edge of every silhouette, so even an envelope or a shopping bag looks as if it has been outside. Candy-cane stripes and a sprig of holly finish the look. It is a rich style, so it uses gentle gradients.`)}
${iconGrid(['gift', 'shopping-bag', 'truck', 'mail', 'calendar', 'tag', 'store', 'coffee'], 'christmas', 'Everyday shop icons in the Christmas style: gifts, bags, delivery, email, dates, prices, a shop and a hot drink.')}
${p('That makes it handy for the boring-but-important parts of a holiday campaign: “order by” dates, free delivery badges, gift-card links and opening hours.')}

${h2('How does the Christmas style compare with other styles?')}
${styleRow('christmas-tree', 'The same tree in Christmas, plush, sticker, engrave, clay and line.', { styles: ['christmas', 'plush', 'sticker', 'engrave', 'clay', 'line'] })}
${table(['Style', 'Feels', 'Good for'], [
  [L.style('christmas'), 'Cosy, snowy, classic', 'Shops, emails, cards, gift guides'],
  [L.style('plush'), 'Soft, hand-sewn', 'Kids’ products, toy shops, family events'],
  [L.style('engrave'), 'Vintage print', 'Craft markets, bakeries, wine and food gifts'],
  [L.style('clay'), 'Soft 3D', 'Apps, landing pages, product launches'],
  [L.style('line'), 'Quiet and clear', 'Navigation on a festive site'],
], 'Picking a style for a Christmas design')}

${h2('Where should you use Christmas icons?')}
${h3('Holiday emails and gift guides')}
${p('A gift guide is a list, and icons make lists easy to skim: a gift stack for “for him”, a teddy for kids, a candy cane for stocking fillers. In emails, use PNGs, because many inboxes do not show SVG.')}
${h3('Invitations and cards')}
${p(`For an office party or a cookie exchange, put an icon beside each detail. Our live demo ${demo('cookie-swap')} is a holiday invitation built with the Christmas style, and you can switch its icons to other styles to compare.`)}
${h3('Shop sites and app themes')}
${p('Swap a few icons in banners and category tiles for December, then switch back in January. Because the shapes are the same in every style, nothing moves on the page when you switch.')}
${doDont('<p>Keep your regular line icons in the menu and checkout, and use Christmas icons for banners, badges and headers.</p>', '<p>Use the Christmas style below 32px. The snow caps and stripes need room to read.</p>')}

${h2('Are there animated Christmas icons?')}
${p('Yes. Hover over or tap these tiles to see each icon’s own small move. On a website the free motion package plays them, and they stay still for anyone who prefers reduced motion.')}
${motionGrid(['christmas-tree', 'bauble', 'snowman', 'jingle-bells'], 'christmas', 'Hover or tap: the tree does a little shake, the bauble swings, the snowman wobbles and the bells ring.', { trigger: 'hover' })}

${h2('How do you recolour Christmas icons?')}
${p('Not every brand is red and green. Each icon has 20 to 30 ready-made palettes you can pick on its page: the tree includes Classic fir, Frosted spruce, Red and gold baubles, White tinsel tree and Pink flocked tree. Pick one before you copy or download, and use the same palette across a whole email so it feels planned.')}
${callout('tip', 'A “happy holidays” message that should welcome everyone works well with the winter icons (snowman, snow globe, fireplace) rather than religious ones.')}

${howTo('christmas', ['christmas-tree', 'gift-stack'])}

${h2('Which other festivals are coming up?')}
${p(`Before Christmas come ${L.post('free-halloween-icons', 'Halloween')} and ${L.post('free-diwali-icons', 'Diwali')}; after it, ${L.post('free-lunar-new-year-icons', 'Lunar New Year')} and ${L.post('free-valentines-day-icons', 'Valentine’s Day')}. See the dates side by side in our ${L.post('free-holiday-icons', 'guide to holiday and festival icons')}, browse ${demosHome('the live demos')}, or jump to the quick <a href="../free/christmas-icons.html">Christmas icons page</a>.`)}
${cta('Give your page a snow cap', `${N} Christmas icons and ${N_ICONS} icons in the Christmas style. Free, MIT licensed, no sign-up.`, ['christmas-tree', 'bauble', 'snowman', 'gift-stack', 'candy-cane', 'wreath'])}
`,
}
