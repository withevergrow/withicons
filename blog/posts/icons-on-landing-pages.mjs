import { p, h2, h3, ul, figure, iconGrid, styleRow, sizeRamp, table, yes, no, meh, callout, steps, code, cta, doDont, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

const N_CREATIVE = N_STYLES - 3 // everything beyond line, solid and duo

export default {
  slug: 'icons-on-landing-pages',
  category: 'guides',
  date: '2026-10-02',
  hero: 'landing5',
  stickers: [['rocket', 'gloss'], ['layout-grid', 'blueprint'], ['sparkles', 'duo']],
  title: 'How to use icons on a landing page (without making it look cheap)',
  cardTitle: 'Icons on landing pages',
  h1: 'How to use icons on a landing page (without making it look <em>cheap</em>)',
  dek: 'Icons can make a landing page feel clear and polished, or cluttered and clip-arty. The difference is a handful of simple habits. Here they are, with real examples in different styles.',
  description: 'Use icons on a landing page the way good designers do: feature grids, icon + headline + one line, one style and size, when to go bold, and accessibility basics.',
  keywords: ['icons on landing page', 'landing page icons', 'feature section icons', 'website feature grid', 'icon design tips', 'free icons for websites'],
  about: ['Landing page', 'Web design', 'Icons'],
  related: ['icon-styles-explained', 'accessible-icons', 'consistent-icons'],
  tldr: [
    'Use icons to help people <strong>scan</strong>, not to decorate. Every icon should sit next to words that explain it.',
    'The pattern that works: <strong>icon + short headline + one line of text</strong>, in a grid of three, four or six.',
    'Keep <strong>one style, one size and one colour</strong> per section. Mixed sets are the fastest way to look cheap.',
    'Use calm line or duo icons for most sections. Save creative styles (like gloss, glass, sticker or retro) for the hero or one feature row, at 32 px or larger.',
    'Hide decorative icons from screen readers, label icon-only buttons, and give meaningful icons at least 3:1 contrast.',
  ],
  faq: [
    { q: 'How many icons should a landing page have?', a: 'There is no fixed number, but most good landing pages use icons in only two or three places: a feature grid, maybe a short “how it works” row, and small icons in buttons or lists. If every heading has an icon, none of them stand out.' },
    { q: 'Should landing page icons be outline or filled?', a: 'Outline (line) icons feel light and modern and suit most sections. Filled (solid) icons feel bolder and read better at small sizes or on busy backgrounds. Pick one for the page and stick to it, or use a matching family where both share the same drawing.' },
    { q: 'What size should feature icons be?', a: 'Feature icons usually look right between 32 and 48 px on desktop, a bit larger than the headline next to them. Small inline icons in buttons and lists sit at 16 to 24 px. Use one size per role across the page.' },
    { q: 'Do icons improve conversion rates?', a: 'We are not aware of reliable evidence that icons by themselves lift conversions. What they do well is make a page faster to scan, which helps people find the reason to act. Clear words matter more than the icons.' },
    { q: 'Can I use free icons on a commercial landing page?', a: 'Yes, if the license allows commercial use. with icons is MIT, so you can use it on any landing page without adding a credit. Some free marketplaces require a visible credit or link on the page.' },
  ],
  sources: [
    { title: 'Nielsen Norman Group: Icon Usability', url: 'https://www.nngroup.com/articles/icon-usability/' },
    { title: 'W3C: Understanding WCAG 2.2 Success Criterion 1.4.11 Non-text Contrast', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html' },
    { title: 'W3C: Understanding WCAG 2.2 Success Criterion 1.1.1 Non-text Content', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">The secret to icons on a landing page is that they should help people <strong>scan</strong>, never just decorate. Pair every icon with a short headline and one line of text, use one style, one size and one colour per section, and save the flashy styles for one special spot. Do that and your page looks considered instead of cheap.</span>`)}
${p(`Below we show the patterns that work, the mistakes that make a page look like a template from 2012, and when it is worth reaching for a bolder style. All the examples use ${L.icons('with icons')}, our free MIT set, so you can copy any of them straight onto your page.`)}

${h2('Why do icons make some landing pages look cheap?')}
${p('It is rarely the icons themselves. It is how they are used. The usual culprits:')}
${ul([
  '<strong>Mixed icon sets.</strong> One icon is thin and rounded, the next is chunky and square. Visitors feel the mismatch even if they cannot name it.',
  '<strong>Icons as decoration.</strong> A lightbulb next to “Our ideas” and a rocket next to everything else. If the icon does not add meaning, it adds noise.',
  '<strong>Rainbow colours.</strong> Every icon in a different colour, competing with your buttons for attention.',
  '<strong>Random sizes.</strong> Icons that are 40 px in one section and 22 px in the next, for no reason.',
  '<strong>Guess-what-this-means icons.</strong> As the usability experts at the Nielsen Norman Group point out, only a few icons (home, print and the magnifying glass for search) are close to universally understood. Most need a text label.',
])}
${p('The good news: every one of these is easy to fix.')}

${h2('The pattern that always works: icon, headline, one line')}
${p('Look at almost any well-designed product page and you will find the same building block: a small icon, a short bold headline (two to five words), and one sentence that explains the benefit. Repeat it three, four or six times in a grid and you have a feature section.')}
${iconGrid(['zap', 'shield-check', 'users', 'chart-line', 'globe', 'headset'], 'duo', 'A six-item feature grid in the duo style: “Fast setup”, “Secure by default”, “Built for teams”, “Clear reports”, “Works anywhere”, “Real human support”.', { size: 44 })}
${steps([
  ['Write the words first', 'List your three to six main benefits as short headlines. If you cannot say it in five words, simplify the feature, not the icon.'],
  ['Pick one icon per benefit', `Choose the most obvious match. ${L.icon('shield-check')} for security, ${L.icon('zap')} for speed, ${L.icon('users')} for teams. Obvious beats clever.`],
  ['Use one style and size', 'Same style, same size, same colour for every icon in the grid.'],
  ['Align everything', 'Icons sit on the same line, headlines start at the same point, and the gaps are equal.'],
])}
${callout('tip', 'Odd numbers feel natural in a single row (three works beautifully). For grids, three or six items fill a three-column layout neatly; four fits a two-by-two or a four-across row.')}

${h2('How many icons should a landing page have?')}
${p('Fewer than you think. Most strong landing pages use icons in two or three places: the feature grid, a short “how it works” row, and small icons inside buttons or checklists. That is it.')}
${p('The test is simple: if you removed the icon, would anything be harder to understand or find? If not, remove it. Icons are like spices: a little makes the dish, too much ruins it.')}
${figure('wire4', 'Sketch the layout first, on paper or a whiteboard. Decide where icons help people scan before you pick a single one.')}

${h2('Line or something bolder? Choosing an icon style')}
${p(`Most of a landing page should feel calm, so simple ${L.style('line')} or ${L.style('duo')} icons are the safe default. But a page also needs one moment with a bit of personality, usually the hero section or the main feature row. That is where a creative style can shine.`)}
${styleRow('rocket')}
${p(`Line, solid and duo are the three everyday styles, for most sections. The other ${N_CREATIVE} are creative styles, like gloss, glass, sticker, retro and luxe, for big, special moments. Here is what the most useful ones feel like:`)}
${table(['Style', 'It feels', 'Use it on a landing page for'], [
  ['Line', 'Clean, light, modern', 'Feature grids, lists, navigation, most sections'],
  ['Solid', 'Bold, confident', 'Small sizes, dark backgrounds, checklists'],
  ['Duo', 'Friendly, soft', 'Feature grids for apps and SaaS, pricing cards'],
  ['Gloss', 'Premium, shiny, 3D-ish', 'Hero section, product launch, one feature row'],
  ['Engrave', 'Crafted, classic', 'Finance, legal, heritage and luxury brands'],
  ['Blueprint', 'Technical, precise', 'Developer tools, engineering, “how it works”'],
  ['Sketch', 'Playful, human', 'Education, creative tools, community pages'],
  ['Glass', 'Modern, airy, techy', 'AI and SaaS heroes, app launches'],
  ['Sticker', 'Fun, bold, candy-coloured', 'Events, community pages, kids and creator brands'],
  ['Retro', 'Warm, nostalgic, 70s', 'Cafés, food, music and lifestyle brands'],
  ['Luxe', 'Rich, jewel-like, 3D', 'Premium plans, luxury, gifts and finance heroes'],
], `Which with icons style fits which part of a landing page (a selection of the ${N_STYLES} styles)`)}
${p('Because every with icons style comes from the same drawing, you can use line icons in the navigation and gloss icons in the hero and they still feel like one family. With most icon sets you would have to mix sources to get that contrast.')}
${iconGrid(['rocket', 'sparkles', 'trophy', 'crown'], 'gloss', 'Gloss icons for a launch-day hero. Use them big (48 px or more) and only in one section.', { size: 48 })}
${iconGrid(['code', 'terminal', 'git-branch', 'database'], 'blueprint', 'Blueprint icons for a developer tool’s “how it works” row.', { size: 48 })}
${iconGrid(['lightbulb', 'book-open', 'pencil', 'graduation-cap'], 'sketch', 'Sketch icons for an online course page: warm and human.', { size: 48 })}
${p(`The newer creative styles bring colour of their own. ${L.style('glass')} looks like frosted glass with colour glowing through, ${L.style('sticker')} looks like die-cut vinyl stickers, and ${L.style('retro')} has chunky outlines and sunset stripes, like a vintage patch. Each icon also has 20 to 30 hand-picked colour palettes, so you can match these styles to your brand colours.`)}
${iconGrid(['cloud', 'cpu', 'bot', 'layers'], 'glass', 'Glass icons for an AI or SaaS hero: modern, light and a little futuristic.', { size: 48 })}
${iconGrid(['party-popper', 'gift', 'ticket', 'megaphone'], 'sticker', 'Sticker icons for an event or community page: fun without being childish.', { size: 48 })}
${iconGrid(['coffee', 'pizza', 'headphones', 'sun'], 'retro', 'Retro icons for a café, food or music brand: warm and nostalgic.', { size: 48 })}
${callout('warn', 'Creative styles have more detail, so they need room. Use them at 32 px or larger. For buttons, menus and anything small, stay with line or solid.')}

${h2('Keep size and colour consistent')}
${p('Consistency is the cheapest way to look expensive. Decide on a few rules and stick to them across the whole page:')}
${ul([
  '<strong>One size per role.</strong> For example: 40 px for feature icons, 20 px inside buttons and lists.',
  '<strong>One colour.</strong> Use your brand’s accent colour, or plain dark grey. Avoid giving each icon its own colour.',
  `<strong>One style per section.</strong> Ideally one style for the whole page, plus at most one special section in a creative style. Our guide on ${L.post('consistent-icons', 'keeping icons consistent')} goes deeper.`,
])}
${sizeRamp(['zap', 'shield-check', 'users'], [16, 20, 24, 32, 48], 'line', 'The same icons from 16 to 48 px. Inline icons live at 16 to 24 px; feature icons at 32 to 48 px.')}

${h2('Don’t decorate: icons should carry meaning')}
${p('The fastest way to make a page feel cheap is to sprinkle icons where words would do. A good icon either helps people <strong>find</strong> something (like a section or a button) or helps them <strong>understand</strong> it faster. If it does neither, it is decoration.')}
${doDont(
  '<p>Pair each icon with a clear headline. Use a small set of obvious icons, one style, one size, one accent colour. Leave white space around them.</p>',
  '<p>Put an icon on every heading, use a different colour for each, mix three icon sets, or rely on an icon alone to explain a feature.</p>',
)}
${figure('board4', 'Group your ideas before you design. Each feature card should have one clear idea, and the icon should point at it.')}

${h2('Accessibility basics for landing page icons')}
${p(`A few small habits make your icons work for everyone, including people using screen readers and people with low vision. Our full guide to ${L.post('accessible-icons', 'accessible icons')} has more, but these cover most landing pages:`)}
${h3('Hide decorative icons from screen readers')}
${p('If an icon sits next to text that already says the same thing (like a feature headline), a screen reader does not need to announce it. Mark it as decorative so it is skipped. In code that is one attribute:')}
${code('<svg aria-hidden="true" ...>...</svg>\n<h3>Secure by default</h3>')}
${h3('Label icons that stand alone')}
${p('An icon-only button (a menu icon, a close button, a social link) needs a text label that screen readers can read, such as <code>aria-label="Open menu"</code>. Most site builders have a field for this, often called “alt text” or “accessible name”.')}
${h3('Give meaningful icons enough contrast')}
${p('The WCAG accessibility guidelines ask that graphics people need to understand the content have a contrast ratio of at least 3:1 against the background. Pale grey icons on white often fail. The same guidance notes that very thin lines can render fainter than their colour suggests, which is one more reason to use solid icons on busy or coloured backgrounds.')}
${table(['Situation', 'What to do', 'Needed?'], [
  ['Icon next to a headline that says the same thing', 'Hide it from screen readers', yes('Yes')],
  ['Icon-only button or link', 'Add a text label', yes('Yes')],
  ['Meaningful icon on a coloured background', 'Check 3:1 contrast', yes('Yes')],
  ['Purely decorative background pattern', 'Hide it, no label', meh('Nice to have')],
  ['Icon that is the only way to understand a feature', 'Add words instead', no('Avoid this')],
], 'Quick accessibility checklist for landing page icons')}

${h2('A quick checklist before you publish')}
${ul([
  'Every icon sits next to words that explain it.',
  'All icons in a section share one style, one size and one colour.',
  'A creative style appears in one section at most, at 32 px or larger.',
  'Icons line up with each other and with their headlines.',
  'Decorative icons are hidden from screen readers; icon-only buttons have labels.',
  `The icons are under a license that allows commercial use. Not sure? Read ${L.post('free-icons-commercial-use', 'our plain-English license guide')}.`,
])}

${h2('The bottom line')}
${p(`Icons do not make a landing page look premium on their own. Restraint does: a small set of obvious icons, one style, one size, one colour, each paired with a clear headline. Add one bolder moment if your brand calls for it, and make sure everyone can use the page. Want to see what each style is good for? Read ${L.post('icon-styles-explained', 'icon styles explained')}, or start adding icons to your site with our guide on ${L.post('how-to-add-icons-to-a-website', 'how to add icons to a website')}.`)}
${cta('Build your feature grid in minutes', `Pick from ${N_ICONS} icons in ${N_STYLES} matching styles, from calm line to glass, retro and hand-drawn. Copy the SVG or download a PNG. Free and MIT licensed.`, ['rocket', 'zap', 'shield-check', 'users', 'sparkles', 'chart-line'])}
`,
}
