import { p, h2, h3, ul, iconGrid, styleRow, motionGrid, table, callout, doDont, cta, stats, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'
import { inCat, nCat, catLink, demo, demosHome, howTo, DATES, LICENCE } from './_festive.mjs'

const N = nCat('indian-festivals')
const DIWALI = ['diya', 'rangoli-pattern', 'kalash', 'toran', 'marigold', 'lotus', 'sparkler', 'firecracker', 'sky-lantern', 'mithai-box', 'laddoo', 'jalebi', 'puja-thali', 'shankh']
const OTHER = inCat('indian-festivals').filter(n => !DIWALI.includes(n))

export default {
  slug: 'free-diwali-icons',
  category: 'guides',
  date: '2026-10-12',
  hero: 'xanim3',
  stickers: [['diya', 'utsav'], ['rangoli-pattern', 'rangoli'], ['sky-lantern', 'utsav']],
  title: 'Free Diwali icons: diyas, rangoli, sweets and fireworks as SVG',
  cardTitle: 'Free Diwali icons',
  h1: 'Free <em>Diwali</em> icons: diyas, rangoli and mithai',
  dek: 'Lamps, rangoli, marigolds, sweets and sparklers, in two festive styles made for Diwali. Free for greetings, menus, shops and apps.',
  description: `Free Diwali icons: diya, rangoli, kalash, mithai and fireworks among ${N} Indian festival icons, plus the Utsav and Rangoli styles. SVG or PNG, MIT licensed.`,
  keywords: ['free diwali icons', 'diwali svg icons', 'diya icon', 'rangoli icon', 'diwali icons png', 'deepavali icons', 'indian festival icons', 'diwali greeting icons'],
  about: ['Diwali', 'Indian festivals', 'Icons'],
  related: ['free-holiday-icons', 'free-halloween-icons', 'free-christmas-icons'],
  tldr: [
    `<strong>with icons has ${N} Indian festival icons</strong>, including a diya, a rangoli pattern, a kalash, a toran, marigolds, sky lanterns, sparklers and boxes of mithai, all free under the MIT licence.`,
    `<strong>Two styles are made for Diwali:</strong> Utsav (marigold and saffron with a plum outline and gold dot-work) and Rangoli (clean objects in a warm glow with one festival motif each). Both work on all ${N_ICONS} icons.`,
    'Use them for Diwali greetings, WhatsApp and Instagram posts, festive sale banners, sweet-shop menus, invitations and app themes.',
    `Diwali 2026 (Lakshmi Puja) is on ${DATES.diwali.day}, with Dhanteras on Friday 6 November and Bhai Dooj on Tuesday 10 November.`,
  ],
  faq: [
    { q: 'When is Diwali in 2026?', a: 'Diwali, the main day with Lakshmi Puja, is on Sunday 8 November 2026. The five days run from Dhanteras on Friday 6 November to Bhai Dooj on Tuesday 10 November. Puja times vary by city, so check a local panchang.' },
    { q: 'Are these Diwali icons free for business use?', a: `Yes. ${LICENCE} Shops, sweet makers, restaurants and apps can use them in offers and greetings.` },
    { q: 'What is the difference between the Utsav and Rangoli styles?', a: 'Utsav looks hand-crafted: warm marigold and saffron shapes, a plum outline, a fine gold inner line and rangoli dot-work. Rangoli is cleaner and more modern: each object keeps its own colours in a warm glow and gets one small festival motif such as petals, a lotus, a toran or a diya flame.' },
    { q: 'Can I use the same icons for Holi or Durga Puja?', a: 'Yes. The Indian festivals set also has a dhak, a pandal, alpana, a pichkari, gulal and a water balloon. The Rangoli style has palettes for Durga Puja and Holi, so one set can carry you through the festival year.' },
    { q: 'Can I send these icons on WhatsApp?', a: 'Yes. Download a PNG (512px is plenty), then share it like any picture, or place it on a greeting card design in Canva first.' },
  ],
  sources: [
    { title: 'with icons: Indian festivals category', url: 'https://withicons.com/categories/indian-festivals.html' },
    { title: 'with icons: Utsav style', url: 'https://withicons.com/styles/utsav.html' },
    { title: 'with icons: Rangoli style', url: 'https://withicons.com/styles/rangoli.html' },
    { title: 'SmartPuja: Diwali 2026 date and Lakshmi Puja muhurat (8 November 2026)', url: 'https://www.smartpuja.com/blog/diwali-2026-date' },
  ],
  body: () => `
${p(`<span class="lede">You can download free Diwali icons from ${L.icons('with icons')}: a diya, a rangoli pattern, a kalash, a toran, marigolds, sky lanterns, sparklers and sweets, part of ${N} Indian festival icons. Two festive styles, Utsav and Rangoli, can dress all ${N_ICONS} icons for the season. Everything comes as SVG or PNG under the MIT licence, so it is free for greetings, shops and apps with no credit needed.</span>`)}
${p(`Diwali 2026 falls on ${DATES.diwali.day}, with Dhanteras two days earlier. This guide shows the icons, explains the two styles, and walks through using them in a greeting, a menu or a website.`)}
${iconGrid(DIWALI, 'utsav', 'Diwali icons in the Utsav style: lamps, rangoli, the puja essentials, sweets and fireworks.')}
${stats([[N, 'Indian festival icons'], ['2', 'festive styles for Diwali'], [N_ICONS, 'icons in each style'], ['MIT', 'free licence, no credit']])}

${h2('Which Diwali icons are included?')}
${ul([
  `<strong>Light:</strong> ${L.icon('diya')}, ${L.icon('sky-lantern')} and ${L.icon('sparkler')}, plus a ${L.icon('firecracker')} for those who still want one on screen.`,
  `<strong>Puja and decoration:</strong> ${L.icon('rangoli-pattern')}, ${L.icon('kalash')}, ${L.icon('toran')}, ${L.icon('marigold')}, ${L.icon('lotus')}, ${L.icon('puja-thali')} and ${L.icon('shankh')}.`,
  `<strong>Sweets:</strong> ${L.icon('mithai-box')}, ${L.icon('laddoo')} and ${L.icon('jalebi')}, ready for a sweet-shop menu or a gifting page.`,
])}
${p(`The rest of the ${catLink('indian-festivals', 'Indian festivals category')} covers Durga Puja, Holi, Raksha Bandhan, weddings and Makar Sankranti:`)}
${iconGrid(OTHER, 'rangoli', 'More Indian festival icons in the Rangoli style: dhak and pandal for Durga Puja, pichkari and gulal for Holi, rakhi, mehndi, kite and more.')}

${h2('Utsav or Rangoli: which Diwali style should you pick?')}
${p('Both are holiday styles made for Indian festivals, and both are rich styles with gentle gradients. They feel quite different, though:')}
${styleRow('diya', 'The same diya in Utsav and Rangoli, then luxe, glass, line and solid for comparison.', { styles: ['utsav', 'rangoli', 'luxe', 'glass', 'line', 'solid'] })}
${table(['', L.style('utsav'), L.style('rangoli')], [
  ['Look', 'Hand-crafted: marigold and saffron, plum outline, gold inner line, rangoli dots', 'Modern and premium: each object in its own colours, warm glow, one festival motif'],
  ['Feels', 'Traditional, warm, celebratory', 'Clean, polished, never kitsch'],
  ['Best for', 'Greetings, wedding cards, restaurants, melas, cultural events', 'Brand campaigns, app themes, festive sales, Durga Puja and Holi'],
  ['Live demo', demo('diwali-mela'), demo('diwali-dinner')],
], 'Utsav and Rangoli side by side')}
${p('A simple rule: if your brand is playful or traditional, start with Utsav. If it is a modern app or a premium shop, start with Rangoli.')}

${h2('Where do Diwali icons work best?')}
${h3('Greetings and social posts')}
${p('One large diya or a rangoli pattern makes a calm, beautiful greeting on its own. Add your name and a short wish, and you have a WhatsApp or Instagram post that does not look like every other template.')}
${h3('Festive sales and shop pages')}
${p('Use a few icons in a “Diwali offers” banner: a mithai box for sweets, a diya for home decor, a sparkler for limited-time deals. Everyday icons work in the festive styles too, so delivery dates and gift cards can match.')}
${iconGrid(['gift', 'shopping-bag', 'truck', 'tag', 'percent', 'calendar'], 'rangoli', 'Shop icons in the Rangoli style: gifts, bags, delivery, price tags, discounts and dates.')}
${h3('Invitations and menus')}
${p(`Our two live demos are real Diwali pages you can explore: ${demo('diwali-dinner')} is a family Lakshmi Puja dinner invitation in the Rangoli style, and ${demo('diwali-mela')} is a neighbourhood festival with food stalls, garba and fireworks in the Utsav style.`)}
${doDont('<p>Pick one festive style for the whole greeting or campaign, and keep text short so the icon has room to glow.</p>', '<p>Mix Utsav, Rangoli and three other styles on one card. Each is lovely alone; together they compete.</p>')}

${h2('Do the Diwali icons move?')}
${p('Several have their own small animation: the diya flame flickers, the sky lantern sways, the sparkler glows. Hover over or tap the tiles to see them. On a website the free motion package plays them, and they stay still for anyone who prefers reduced motion.')}
${motionGrid(['diya', 'sky-lantern', 'sparkler', 'firecracker'], 'utsav', 'Hover or tap: a flickering diya, a swaying sky lantern, a glowing sparkler and a jumping firecracker.', { trigger: 'hover' })}

${h2('How do you change the colours?')}
${p('Each icon has 20 to 30 ready-made palettes. The diya, for example, comes as a Terracotta diya, a Painted red diya, a Brass diya, a Silver diya, Gilded clay and Jaipur blue pottery. Pick one on the icon page before you copy or download, and use the same palette across your design.')}
${callout('note', 'Firecrackers are banned or restricted in some Indian cities during Diwali because of air quality. If that matters to your audience, lead with diyas, lanterns and sparklers instead.')}

${howTo('utsav', ['diya', 'rangoli-pattern'])}

${h2('What other festivals does with icons cover?')}
${p(`Diwali sits between ${L.post('free-halloween-icons', 'Halloween')} and ${L.post('free-christmas-icons', 'Christmas')}. After that come ${L.post('free-lunar-new-year-icons', 'Lunar New Year')} and ${L.post('free-valentines-day-icons', 'Valentine’s Day')}. Our ${L.post('free-holiday-icons', 'holiday and festival icon guide')} puts the dates in one calendar, ${demosHome('the demo gallery')} shows every festive style on real pages, and the quick <a href="../free/diwali-icons.html">Diwali icons page</a> has a style picker.`)}
${cta('Light up your Diwali designs', `${N} Indian festival icons, two festive styles and ${N_ICONS} icons in each. Free and MIT licensed.`, ['diya', 'rangoli-pattern', 'sky-lantern', 'marigold', 'mithai-box', 'lotus'])}
`,
}
