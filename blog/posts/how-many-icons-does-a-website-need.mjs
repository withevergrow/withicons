import { p, h2, h3, ul, figure, iconGrid, sizeRamp, table, yes, no, meh, callout, steps, stats, doDont, cta, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

export default {
  slug: 'how-many-icons-does-a-website-need',
  category: 'guides',
  date: '2026-10-03',
  hero: 'xcount0',
  stickers: [['layout-grid', 'duo'], ['list-checks', 'gloss'], ['puzzle-piece', 'sticker']],
  title: 'How many icons does a website need? A practical answer',
  cardTitle: 'How many icons does a website need?',
  h1: 'How many icons does a website need? <em>A practical answer</em>',
  dek: 'Fewer than you think, and they matter more as a family than as a pile. Here are honest ranges by site type, the 30 icons almost everyone uses, and a checklist to count your own.',
  description: 'How many icons a website needs, with rule-of-thumb ranges for business sites, blogs, shops, SaaS apps and dashboards, the core 30 icons, and when to add text labels.',
  keywords: ['how many icons does a website need', 'website icons', 'icon set for website', 'essential website icons', 'how many icons in an icon set', 'icons with text labels', 'icon audit'],
  about: ['Web design', 'Icon design', 'User interface design'],
  related: ['consistent-icons', 'how-to-add-icons-to-a-website', 'choosing-the-right-icon'],
  tldr: [
    '<strong>Most websites need 10 to 40 different icons.</strong> A small business site or blog gets by with 10 to 25, an online shop with 30 to 60, and a SaaS app or dashboard with roughly 60 to 150. These are rules of thumb, not research.',
    'About <strong>30 core icons</strong> cover almost every site: menu, close, search, home, arrows, mail, phone, map pin, user, check, alerts, plus, download and share.',
    '<strong>A consistent set matters more than a big one.</strong> Thirty icons that share one grid, line weight and style look better than three hundred from different places.',
    'Add <strong>text labels</strong> to almost every icon. Nielsen Norman Group found that only a handful of icons (home, print, search) are close to universally understood.',
    `Get them all from one library so they match. with icons has ${N_ICONS} free icons, each in ${N_STYLES} styles, which covers most websites with room to spare.`,
  ],
  faq: [
    { q: 'How many icons should a website have?', a: 'Most websites use 10 to 40 different icons. A simple business site or blog needs about 10 to 25, an online shop about 30 to 60, and a web app or dashboard roughly 60 to 150. These are rules of thumb: count the actions and ideas on your own pages to get your real number.' },
    { q: 'How many icons is too many?', a: 'It is too many when icons stop helping people scan and start competing with your words, or when the same idea gets two different icons. A useful test: if you need more than a few seconds to think of an icon for something, a text label alone is probably clearer.' },
    { q: 'Should every menu item have an icon?', a: 'No. Icons help in tab bars, toolbars and long settings lists where people scan. In a short text menu on a website, words alone are often cleaner. Where you do use icons in navigation, keep a visible text label next to each one.' },
    { q: 'Can I mix icons from different libraries?', a: 'You can, but it usually shows: line weights, corner shapes and sizes rarely match. It is better to pick one library that covers your needs and draw or request the few missing icons in the same style.' },
    { q: 'How many icons should go in a mobile navigation bar?', a: 'Three to five. Google’s Material Design says navigation bars are for three to five destinations, each shown with an icon and a text label. With more than five, use a menu or a side navigation instead.' },
    { q: `Is ${N_ICONS} icons enough for a website?`, a: `For most websites, yes: even a busy online shop rarely needs more than 60 different icons. Very large apps with many specialist features may want a bigger catalogue, such as Material Symbols or Font Awesome, though bigger libraries usually come in fewer matching styles.` },
  ],
  sources: [
    { title: 'Nielsen Norman Group: Icon Usability (Aurora Harley)', url: 'https://www.nngroup.com/articles/icon-usability/' },
    { title: 'Material Design 3: Navigation bar guidelines (3 to 5 destinations)', url: 'https://m3.material.io/components/navigation-bar/guidelines' },
    { title: 'W3C: Understanding SC 1.1.1 Non-text Content', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html' },
  ],
  body: () => `
${p(`<span class="lede">Most websites need between 10 and 40 different icons. A small business site or a blog usually needs 10 to 25, an online shop 30 to 60, and a software app or dashboard somewhere around 60 to 150. The exact number matters far less than this: every icon you use should come from one consistent set and carry one clear meaning.</span>`)}
${p('Those ranges are rules of thumb, worked out by listing the jobs icons do on each kind of site, not survey data. Below you will find them in a table, the 30 or so icons almost every site uses, a checklist to count your own, and advice on when an icon needs a word next to it.')}
${iconGrid(['menu', 'search', 'user', 'shopping-cart', 'mail', 'phone', 'map-pin', 'arrow-right'], 'line', 'Eight icons that appear on a huge share of websites. Many sites need little more than this.')}

${h2('How many icons do different kinds of websites need?')}
${p('Here is a practical starting point. Count <strong>different</strong> icons (the cart icon used ten times still counts as one), and remember that your own number depends on how many actions and ideas your pages have.')}
${table(['Type of site', 'Different icons (rule of thumb)', 'What they are for'], [
  ['<strong>Landing page</strong>', '6 to 15', 'Menu, a few feature icons, arrows on buttons, contact details'],
  ['<strong>Small business or portfolio</strong>', '10 to 25', 'Navigation, services, phone, mail, map pin, opening hours, reviews'],
  ['<strong>Blog or content site</strong>', '10 to 20', 'Search, menu, share, bookmark, reading time, tags, RSS, arrows'],
  ['<strong>Online shop</strong>', '30 to 60', 'Cart, wishlist, account, filters, sort, ratings, delivery, returns, payment, sale tags'],
  ['<strong>SaaS web app</strong>', '60 to 150', 'Navigation, actions (edit, copy, delete, share), statuses, file types, settings, notifications'],
  ['<strong>Dashboard or admin panel</strong>', '40 to 100', 'Charts, trends up and down, filters, dates, users, data, export'],
], 'How many different icons each kind of website tends to need. Rules of thumb, not research data.')}
${stats([['10 to 25', 'a small business site'], ['30 to 60', 'an online shop'], ['60 to 150', 'a SaaS app'], [N_ICONS, 'icons in with icons']])}
${p('Notice the pattern: the more things people can <em>do</em> on a site, the more icons it needs. A brochure site mostly shows information, so a few icons go a long way. An app is full of buttons, and each repeated action (edit, delete, download) earns its own small picture.')}

${h2('Why does a consistent set matter more than a big one?')}
${p('People notice when icons do not match, even if they cannot say why. One icon has thin lines and the next thick ones; one has rounded corners and the next sharp; one is filled and the next is an outline. The page starts to look patched together.')}
${p('A small set that shares the same grid, line weight, corner style and level of detail looks deliberate, like it was made for your brand. That is why a library of 30 matching icons beats a pile of 3,000 that came from five different places. We go deeper in our guide to ' + L.post('consistent-icons', 'keeping icons consistent') + '.')}
${doDont('<p>Pick one library and one main style (for example line), and use solid only for active or selected states.</p>', '<p>Grab each icon from wherever a quick search lands you. Mixed line weights and corner shapes make a page look unfinished.</p>')}
${p(`Consistency also means one meaning per icon. If a star means “favourite” on one page, do not use it for “rating” on another, and do not use two different icons for the same action. Our guide on ${L.post('choosing-the-right-icon', 'choosing the right icon')} covers picking icons people recognise.`)}

${h2('What are the icons almost every website uses?')}
${p('Across all kinds of sites, roughly 30 icons do most of the work. If you are starting a new site, these are worth having from day one. Here they are, grouped by job.')}
${h3('Getting around')}
${iconGrid(['menu', 'close', 'search', 'home', 'chevron-down', 'chevron-right', 'arrow-right', 'external-link'], 'line', 'Navigation: open and close the menu, search, go home, expand, go next, and “this opens another site”.')}
${h3('Getting in touch')}
${iconGrid(['mail', 'phone', 'map-pin', 'clock', 'calendar', 'message-circle'], 'line', 'Contact: email, call, find us, opening hours, book a date, chat.')}
${h3('Doing things')}
${iconGrid(['plus', 'minus', 'check', 'copy', 'download', 'share', 'edit', 'trash'], 'line', 'Actions: add, remove, confirm, copy, download, share, edit, delete.')}
${h3('Feedback and accounts')}
${iconGrid(['check-circle', 'info-circle', 'alert-triangle', 'x-circle', 'loader', 'user', 'log-in', 'settings', 'heart', 'star'], 'line', 'Messages and accounts: success, info, warning, error, loading, profile, sign in, settings, favourite, rating.')}
${p(`That is 32 icons. An online shop adds a few of its own, like ${L.icon('shopping-cart', 'cart')}, ${L.icon('truck', 'delivery')}, ${L.icon('credit-card', 'payment')}, ${L.icon('tag', 'price tag')} and ${L.icon('filter', 'filter')}. A dashboard adds ${L.icon('chart-bar', 'charts')}, ${L.icon('trending-up', 'trends')} and ${L.icon('database', 'data')}.`)}
${callout('note', 'Social media logos (Instagram, LinkedIn and friends) are not on this list because they are brand marks, not general icons. Get them from each company’s official brand page, which also tells you how they may be used. with icons does not include brand logos.')}

${h2('How do you work out exactly how many icons you need?')}
${p('You do not need a designer for this. Grab a notebook or a spreadsheet and walk through your site page by page.')}
${steps([
  ['List every page or screen', 'Home, about, services, contact, product pages, account, checkout. For an app, every main screen.'],
  ['Write down every action and status', 'Each button, each “saved” or “error” message, each piece of contact info. These are the places an icon might help.'],
  ['Cross out the ones words do better', 'If an idea takes more than a few seconds to picture, a text label alone is clearer. Skip the icon.'],
  ['Merge duplicates', 'One idea, one icon. “Remove”, “delete” and “bin” all become the same trash icon.'],
  ['Count what is left, then add a little room', 'That is your number. Leave space to grow, and make sure your library has more than you need today.'],
])}
${figure('xcount4', 'A paper sketch of each page is all you need to count your icons before you pick a library.')}
${p('A quick audit checklist for an existing site:')}
${ul([
  'Does each icon mean one thing, everywhere it appears?',
  'Do all icons share the same line weight and style?',
  'Are there two or more icons for the same idea?',
  'Do icons in navigation and buttons have a visible text label?',
  'Are your sizes limited to two or three (for example 20, 24 and 48 px)?',
  'Is any icon only there to fill space?',
])}

${h2('When should icons have text labels?')}
${p('Almost always. In its well-known article on icon usability, Nielsen Norman Group found that only a few icons are close to universally recognised: <strong>home</strong>, <strong>print</strong> and the <strong>magnifying glass</strong> for search. Most others mean different things on different sites. Even the three-line “hamburger” menu icon is still not understood by everyone.')}
${table(['Icon', 'Safe without a label?', 'Why'], [
  [`${L.icon('search')}`, yes('Usually'), 'The magnifying glass is one of the few near-universal icons'],
  [`${L.icon('home')}`, yes('Usually'), 'Widely recognised as “go to the start”'],
  [`${L.icon('printer')}`, yes('Usually'), 'Widely recognised, though rarely needed on websites now'],
  [`${L.icon('menu')}`, meh('Often'), 'Familiar to many, but not all; “Menu” next to it helps'],
  [`${L.icon('heart')}`, meh('Depends'), 'Could mean like, favourite, wishlist or health'],
  [`${L.icon('star')}`, no(), 'Rating, favourite or featured? Needs a word'],
  [`${L.icon('layers')}`, no(), 'Abstract ideas almost always need a label'],
], 'Which icons can stand alone? Based on Nielsen Norman Group’s icon usability findings.')}
${p('Nielsen Norman Group also warns against labels that only appear on hover: they cost an extra step and do not work on touch screens. Their handy test: if it takes you more than five seconds to think of an icon for something, an icon probably cannot explain it well.')}
${p(`Labels also help navigation bars on phones. Google’s Material Design says a navigation bar should have <strong>three to five</strong> destinations, each with an icon and a text label. When an icon does stand alone (an icon-only button), give it a hidden text name for screen readers; our ${L.post('accessible-icons', 'guide to accessible icons')} shows how.`)}

${h2('Does using fewer icons look better?')}
${p('Usually, yes. Icons are visual punctuation: they help people scan and find things faster. Put one next to every line of text and nothing stands out any more. A good habit is to save icons for places people scan (navigation, toolbars, feature lists, contact details) and let headings and paragraphs speak for themselves.')}
${p('Fewer sizes help too. Most sites look tidy with two or three: 20 or 24 px for the interface and 48 px for features. Our ' + L.post('icon-sizes-guide', 'icon sizes guide') + ' explains the numbers.')}
${sizeRamp(['home', 'search', 'mail', 'user'], [16, 20, 24, 32, 48], 'line', 'Core icons from 16 to 48 px. Pick two or three of these sizes and stick to them.')}

${h2('How do you get every icon you need from one library?')}
${p(`Start with a library that covers your core 30 plus the extras for your type of site, in a style you like, with a licence that allows commercial use. Then use only that library, so everything matches without effort. Our ${L.post('best-free-icon-libraries', 'guide to the best free icon libraries')} compares the popular options honestly.`)}
${p(`with icons is built for exactly this. There are <strong>${N_ICONS} everyday icons</strong>, each drawn once on the same 24 by 24 grid and rendered in <strong>${N_STYLES} styles</strong>: ${N_SVGS} SVGs that always match. Use ${L.style('line', 'line')} for your interface, ${L.style('solid', 'solid')} for active states and ${L.style('duo', 'duo')} for a soft touch of colour, then a creative style like ${L.style('gloss', 'gloss')} for your homepage or slides. Everything is free under the MIT licence, including commercial use.`)}
${iconGrid(['shopping-cart', 'truck', 'credit-card', 'gift', 'tag', 'star'], 'duo', 'An online shop’s extras in the duo style: cart, delivery, payment, gift, sale tag and rating. Same grid and weight as the core set above.')}
${ul([
  `<strong>Search in your own words.</strong> Type “bin” and you get trash, and “gear” finds settings. Try it in ${L.icons('the icon library')}.`,
  '<strong>No code needed.</strong> Every icon page lets you copy the image, download an SVG or a PNG in your colour and size, or copy the SVG code.',
  `<strong>Works with your site builder.</strong> Step-by-step guides for ${L.guide('wordpress', 'WordPress')}, ${L.guide('webflow', 'Webflow')}, ${L.guide('framer', 'Framer')}, ${L.guide('wix-squarespace', 'Wix and Squarespace')} and ${L.guide('html', 'plain HTML')}.`,
  '<strong>For developers:</strong> React, Vue, Svelte, Angular and SolidJS components, a web component and CSS classes. The npm packages and CDN are launching soon; until then, copy from the icon pages.',
])}
${p(`If your app has hundreds of specialist features, a bigger catalogue such as ${L.alt('material-symbols', 'Material Symbols')} or ${L.alt('font-awesome', 'Font Awesome')} may cover more niche ideas, though usually in fewer matching styles. For most websites, ${N_ICONS} is plenty. See ${L.post('how-to-add-icons-to-a-website', 'how to add icons to a website')} for the next step.`)}
${cta('Find your 30 icons in one place', `${N_ICONS} free icons in ${N_STYLES} matching styles. Copy, download or drop them into your site. No sign-up, MIT licensed.`, ['menu', 'search', 'user', 'shopping-cart', 'mail', 'star'])}
`,
}
