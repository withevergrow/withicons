import { p, h2, h3, ul, iconGrid, styleRow, motionGrid, table, callout, doDont, cta, stats, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'
import { inCat, nCat, catLink, demo, demosHome, howTo, DATES, LICENCE } from './_festive.mjs'

const N = nCat('halloween')
const SPOOKY = inCat('halloween')

export default {
  slug: 'free-halloween-icons',
  category: 'guides',
  date: '2026-10-12',
  hero: 'xdark4',
  stickers: [['jack-o-lantern', 'halloween'], ['ghost', 'halloween'], ['bat', 'halloween']],
  title: `Free Halloween icons: ${N} spooky SVGs plus ${N_ICONS} in a Halloween style`,
  cardTitle: 'Free Halloween icons',
  h1: `Free <em>Halloween</em> icons for invites, shops and posts`,
  dek: 'Pumpkins, ghosts, bats and a whole library dressed up for October. Free to copy, download and use in anything you make, with no sign-up.',
  description: `Free Halloween icons: ${N} spooky icons (pumpkin, ghost, bat, witch hat) and all ${N_ICONS} icons in a Halloween style, as SVG or PNG. MIT, no credit needed.`,
  keywords: ['free halloween icons', 'halloween svg icons', 'halloween icons png', 'pumpkin icon', 'ghost icon', 'bat icon', 'halloween party invitation icons', 'spooky icons'],
  about: ['Halloween', 'Icons', 'Party invitations'],
  related: ['free-holiday-icons', 'free-christmas-icons', 'free-diwali-icons'],
  tldr: [
    `<strong>with icons has ${N} Halloween icons</strong>, from a jack-o’-lantern and a ghost to a cauldron, a coffin and a candy bucket, free under the MIT licence.`,
    `<strong>There is also a Halloween style</strong>: all ${N_ICONS} icons, even a calendar or a cart, redrawn in pumpkin orange and witch purple with candle-lit carvings and slime drips.`,
    'Use them for party invitations, shop banners, social posts, newsletters and slides. Copy, PNG and SVG are one click each, and no credit is needed.',
    `Halloween 2026 falls on ${DATES.halloween.day}. Two live demo invitations show the icons on real pages.`,
  ],
  faq: [
    { q: 'Are these Halloween icons really free for commercial use?', a: `Yes. ${LICENCE} You can put them on flyers, shop sites, packaging and paid templates.` },
    { q: 'How many Halloween icons are there?', a: `${N} icons are drawn specially for Halloween (pumpkin, ghost, bat, witch hat, skull, cauldron and more). On top of that, every one of the ${N_ICONS} icons in the library can be shown in the Halloween style, so a ticket, a map pin or a clock can join the party too.` },
    { q: 'Can I get Halloween icons as PNG with a transparent background?', a: 'Yes. On any icon page, pick the Halloween style and press Download PNG. You choose the size, and the background is transparent, so it sits cleanly on a dark or orange slide.' },
    { q: 'Do the Halloween icons move?', a: 'Many do. Icons such as the ghost, the bat, the jack-o’-lantern and the cauldron have their own small animation (a jelly wobble, a swing). Websites can play it with the free @withicons/motion package; it stays still for people who prefer reduced motion.' },
    { q: 'Are the Halloween icons scary enough for an adult party?', a: 'The Halloween style is spooky-cute, which suits families, kids and shops. For a darker, grown-up look, try the gothic or engrave styles with the same icons. One of our demo invitations does exactly that.' },
  ],
  sources: [
    { title: 'with icons: Halloween category', url: 'https://withicons.com/categories/halloween.html' },
    { title: 'with icons: Halloween style', url: 'https://withicons.com/styles/halloween.html' },
    { title: 'with icons licence (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">You can get free Halloween icons from ${L.icons('with icons')}: ${N} spooky icons such as a jack-o’-lantern, a ghost, a bat and a witch hat, plus a Halloween style that redraws all ${N_ICONS} icons in pumpkin orange and witch purple. They download as SVG or PNG, and the MIT licence lets you use them in personal and commercial work without a credit.</span>`)}
${p(`This guide shows every Halloween icon, how the style compares with other looks, where these icons work best and how to get them into an invitation, a slide or a website. Halloween 2026 is on ${DATES.halloween.day}, so there is still time for the flyer.`)}
${iconGrid(SPOOKY, 'halloween', `All ${N} icons in the ${catLink('halloween', 'Halloween category')}, shown in the Halloween style. Tap any one to open it.`)}
${stats([[N, 'Halloween icons'], [N_ICONS, 'icons in the Halloween style'], [N_STYLES, 'styles for each icon'], ['0', 'sign-ups or credits needed']])}

${h2('Which Halloween icons are included?')}
${p('The set covers the things people actually put on Halloween designs. Here they are, grouped by job:')}
${ul([
  `<strong>The classics:</strong> ${L.icon('jack-o-lantern')}, ${L.icon('ghost')}, ${L.icon('bat')}, ${L.icon('black-cat')}, ${L.icon('spider')} and ${L.icon('spider-web')}.`,
  `<strong>Witchy things:</strong> ${L.icon('witch-hat')}, ${L.icon('broom')}, ${L.icon('cauldron')} and ${L.icon('crystal-ball')}.`,
  `<strong>The spooky end:</strong> ${L.icon('skull')}, ${L.icon('coffin')}, ${L.icon('tombstone')} and ${L.icon('haunted-house')}.`,
  `<strong>Treats:</strong> ${L.icon('candy-corn')} and ${L.icon('candy-bucket')}, for trick-or-treat trails and sweet shops.`,
])}
${p(`Each one has a name people guess and a few aliases, so searching “pumpkin” finds the jack-o’-lantern and “witch” finds the hat.`)}

${h2('What does the Halloween icon style look like?')}
${p(`The ${L.style('halloween', 'Halloween style')} is spooky-cute rather than gory. Shapes are chunky and painted in pumpkin orange, witch purple, midnight blue and bone white, with a dark outline. Carved details glow as if a candle sat inside, slime drips from the wider edges, and a tiny bat, spider or moon peeks in. It is one of six holiday styles, and a <em>rich</em> style, which means it uses soft gradients for that inner glow.`)}
${p('The useful trick is that it is not limited to Halloween objects. Any icon in the library can wear it, so the practical parts of an invitation (date, time, place, RSVP) match the pumpkins.')}
${iconGrid(['calendar', 'clock', 'map-pin', 'ticket', 'gift', 'shopping-cart', 'music-note', 'camera'], 'halloween', 'Everyday icons in the Halloween style: a party date, a time, a place, tickets, prizes, a shop, a playlist and a photo booth.')}

${h2('How does the Halloween style compare with other styles?')}
${p(`Every icon is drawn once and rendered in ${N_STYLES} styles, so you can pick the mood first and keep the same shapes. Here is the jack-o’-lantern in the Halloween style next to a few others that suit October:`)}
${styleRow('jack-o-lantern', 'One pumpkin, six moods: Halloween, gothic, sticker, kawaii, pixel and line.', { styles: ['halloween', 'gothic', 'sticker', 'kawaii', 'pixel', 'line'] })}
${table(['Style', 'Feels', 'Good for'], [
  [L.style('halloween'), 'Spooky-cute, glowing', 'Family parties, shops, kids’ events, social posts'],
  [L.style('gothic'), 'Dark, dramatic, grown-up', 'Masquerades, horror nights, book covers'],
  [L.style('sticker'), 'Bright and bouncy', 'Kids’ invites, school events, stickers'],
  [L.style('pixel'), 'Retro game', 'Gaming streams, arcade nights, Discord servers'],
  [L.style('line'), 'Calm and clear', 'Menus and buttons on a Halloween-themed site'],
], 'Picking a style for a Halloween design')}

${h2('Where do Halloween icons work best?')}
${h3('Party invitations')}
${p(`Icons make an invitation easy to scan: a pumpkin by the date, a ghost by the address, a candy bucket by “bring a bag”. See it on a real page in ${demo('boo-bash')}, a kids’ costume party built with the Halloween style, and ${demo('haunted-hollow')}, an adults-only masquerade in the darker gothic style.`)}
${h3('Shop banners and sale pages')}
${p('A small run of Halloween icons beside product categories or a “spooky sale” banner signals the season without redesigning the shop. Keep your normal icons in the menu and use the Halloween ones in the banner only.')}
${h3('Social posts, newsletters and slides')}
${p(`At 48px or larger, a ghost or bat makes a simple header for an Instagram story, a school newsletter or a team quiz slide. Our ${L.post('icons-in-presentations', 'guide to icons in presentations')} has tips on size and spacing.`)}
${doDont('<p>Use the Halloween style for the big, decorative moments: hero banners, invite headers, a sale badge.</p>', '<p>Swap every tiny button on a checkout page to slime-dripping icons. Below 32px, the details turn to fuzz.</p>')}

${h2('Do Halloween icons come animated?')}
${p('Yes, many do. Hover over (or tap) the tiles below to see each icon’s own move. On a website, the free motion package plays these, and it keeps them still for anyone who has asked their device for reduced motion.')}
${motionGrid(['ghost', 'bat', 'jack-o-lantern', 'cauldron', 'candy-bucket'], 'halloween', 'Hover or tap: the ghost, bat, pumpkin and cauldron wobble like jelly, and the candy bucket swings on its handle.', { trigger: 'hover' })}
${p(`Read more in our ${L.post('animated-icons', 'guide to animated icons')}.`)}

${h2('Can you change the colours of Halloween icons?')}
${p('Yes, without any design software. Each icon comes with 20 to 30 hand-picked colour palettes. The jack-o’-lantern, for example, has palettes such as Classic pumpkin, Candle glow, White pumpkin and Heirloom green, and the ghost has Bedsheet ghost, Spectral blue and Lavender boo. Pick one on the icon page before you copy or download.')}
${callout('tip', 'For a brand that is not orange, choose a palette close to your colours and keep the same palette across all the icons on one page. It looks planned instead of patched together.')}

${howTo('halloween', ['jack-o-lantern', 'ghost'])}

${h2('What about other festivals?')}
${p(`Halloween is the first of the season. The same library has a ${L.post('free-diwali-icons', 'Diwali set')} a week later, then ${L.post('free-christmas-icons', 'Christmas')}, ${L.post('free-lunar-new-year-icons', 'Lunar New Year')} and ${L.post('free-valentines-day-icons', 'Valentine’s Day')}. Our ${L.post('free-holiday-icons', 'holiday and festival icon guide')} has a calendar of when to use each one, and ${demosHome('the demo gallery')} shows them all on real pages. There is also a quick <a href="../free/halloween-icons.html">Halloween icons page</a> with a style picker.`)}
${cta('Dress your next page up for October', `${N} Halloween icons and ${N_ICONS} icons in the Halloween style. Copy, download or install. MIT licensed.`, ['jack-o-lantern', 'ghost', 'bat', 'witch-hat', 'cauldron', 'candy-bucket'])}
`,
}
