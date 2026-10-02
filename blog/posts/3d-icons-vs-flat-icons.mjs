import { p, h2, h3, ul, figure, iconGrid, styleRow, sizeRamp, table, yes, no, meh, callout, steps, stats, doDont, cta, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

const FLAT = ['line', 'solid', 'duo']
const DIMENSIONAL = ['gloss', 'glass', 'luxe', 'skeuo']

export default {
  slug: '3d-icons-vs-flat-icons',
  category: 'basics',
  date: '2026-10-03',
  hero: 'xd31',
  stickers: [['gem', 'luxe'], ['rocket', 'glass'], ['star', 'gloss']],
  title: '3D icons vs flat icons: which should you use in 2026?',
  cardTitle: '3D icons vs flat icons',
  h1: '3D icons vs flat icons: <em>which</em> should you use?',
  dek: 'Flat icons are clear and light. 3D icons are rich and eye-catching. Here is when each one wins, with real icons side by side and a simple table for every common job.',
  description: 'Flat or 3D icons? Use flat icons for buttons and menus, 3D icons for heroes, slides and marketing at 32px+. A decision table, file sizes and history.',
  keywords: ['3d icons vs flat icons', 'flat icons', '3d icons', 'flat design vs skeuomorphism', 'skeuomorphic icons', 'glass icons', 'flat vs 3d icons for apps', 'icon style for landing page', 'dimensional icons'],
  about: ['Flat design', 'Skeuomorphism', 'Icon design', 'User interface design'],
  related: ['icon-styles-explained', 'icon-design-trends-2026', 'icon-sizes-guide'],
  tldr: [
    '<strong>Flat icons</strong> (line, solid, duotone) are simple shapes with no fake light or depth. They are the right choice for buttons, menus, tabs, forms and dashboards, at any size.',
    '<strong>3D or dimensional icons</strong> (gloss, glass, luxe, skeuo) add highlights, shadows and materials. They shine on landing pages, slides, app-store graphics and posters, at 32px or larger.',
    'Most good products in 2026 use <strong>both</strong>: flat icons where people click, and one dimensional style where people look.',
    'Flat SVG icons are tiny (our line style is about 0.4 KB per icon). Dimensional SVGs are richer but still only a few kilobytes each, so use them for a handful of big moments, not long lists.',
    'Design swung from realistic (skeuomorphic) to flat around 2012 to 2013, then back towards gentle depth. Today’s best practice is flat for function, depth for delight.',
  ],
  faq: [
    { q: 'Are 3D icons better than flat icons?', a: 'Neither is better everywhere. Flat icons are clearer at small sizes and in dense screens, so they suit buttons, menus and dashboards. 3D icons are more eye-catching and feel premium, so they suit hero sections, feature grids, slides and marketing at 32px or larger. Most products use flat icons for the interface and one 3D style for big moments.' },
    { q: 'Is flat design dead in 2026?', a: 'No. Flat icons are still the default for app and website interfaces because they are clear, light and easy to keep consistent. What changed is that depth is back for decoration: Apple introduced its glassy Liquid Glass design in June 2025, and many brands now pair a flat interface with shinier icons in marketing.' },
    { q: 'Do 3D icons slow down a website?', a: 'Not much, if they are SVGs and you use them sparingly. In with icons, a line icon is about 0.4 KB and the most detailed dimensional style (luxe) is about 6 KB before compression. Many 3D icon packs are large PNG renders instead, which weigh more and cannot be recoloured, so check the file format before you download.' },
    { q: 'Can I use 3D icons in my app’s navigation?', a: 'It is usually a bad idea. Navigation icons are small (16 to 24px), and the highlights, shadows and textures of 3D styles turn into blur at that size. Use flat line or solid icons for navigation and keep 3D icons for onboarding, empty states, feature pages and marketing.' },
    { q: 'What is the difference between 3D icons and skeuomorphic icons?', a: 'Skeuomorphic icons imitate real objects and materials, like a leather notebook or a brass dial. 3D icons is a wider term for any icon with depth, light and shadow, including glossy, glassy or toy-like looks that do not copy a real material. Skeuomorphism is one kind of 3D.' },
    { q: 'Are the with icons 3D styles free for commercial use?', a: `Yes. All ${N_ICONS} icons in all ${N_STYLES} styles (${N_SVGS} SVGs) are MIT licensed, which means free for personal and commercial use with no attribution required.` },
  ],
  sources: [
    { title: 'Nielsen Norman Group: Flat Design: Its Origins, Its Problems, and Why Flat 2.0 Is Better for Users (2015)', url: 'https://www.nngroup.com/articles/flat-design/' },
    { title: 'Nielsen Norman Group: Skeuomorphism (2024)', url: 'https://www.nngroup.com/articles/skeuomorphism/' },
    { title: 'Apple Newsroom: Apple Unveils iOS 7 (June 10, 2013)', url: 'https://www.apple.com/newsroom/2013/06/10Apple-Unveils-iOS-7/' },
    { title: 'Wikipedia: Material Design (announced at Google I/O, June 25, 2014)', url: 'https://en.wikipedia.org/wiki/Material_Design' },
    { title: 'Apple Newsroom: Apple introduces a delightful and elegant new software design (June 9, 2025)', url: 'https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/' },
    { title: 'W3C: Understanding WCAG 2.1 Success Criterion 1.4.11, Non-text Contrast', url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html' },
  ],
  body: () => `
${p(`<span class="lede">Use flat icons for anything people tap or click, like buttons, menus, tabs and dashboards, because they stay clear at small sizes. Use 3D icons for big moments people look at, like hero sections, feature grids, slides and app-store graphics, at 32px or larger. In 2026 the best answer is usually both: a flat interface with one dimensional style for decoration.</span>`)}
${p(`That is the short version. Below we show the same icons drawn both ways, explain where each look came from, and give you a table for the jobs people ask about most: app screens, dashboards, landing pages, slides, kids’ apps and print. Every icon here comes from ${L.icons('with icons')}, where each of the ${N_ICONS} icons is drawn once and rendered in ${N_STYLES} styles, so you are comparing the very same drawing in different looks.`)}
${styleRow('rocket', 'One rocket, seven looks. Left: the three flat styles (line, solid, duo). Right: the four dimensional styles (gloss, glass, luxe, skeuo).', { styles: [...FLAT, ...DIMENSIONAL] })}

${h2('What is a flat icon?')}
${p('A flat icon is drawn with simple shapes and no pretend light. There are no shadows, no shine and no textures, just outlines or filled shapes in one or two colours. Think of the icons in your phone’s settings menu or the toolbar of a writing app.')}
${p(`Flat icons come in three common flavours. ${L.style('line')} icons are outlines (ours use a 1.75px line). ${L.style('solid')} icons are filled shapes with the details cut out. ${L.style('duo')} icons are outlines over a soft tint, which feels a little warmer.`)}
${iconGrid(['home', 'search', 'bell', 'calendar', 'settings', 'user'], 'line', 'Flat line icons: light, calm and easy to read next to text.')}
${p('Because flat icons are so simple, they have three big strengths. They stay sharp at tiny sizes, they take on your text colour automatically, and a whole set looks consistent with very little effort.')}

${h2('What is a 3D icon?')}
${p('A 3D icon (sometimes called a dimensional icon) looks like an object you could pick up. It uses highlights, shadows, gradients or materials to suggest light falling on a solid shape. Most 3D icons are not real 3D models: they are flat pictures drawn to look deep, the same way a painting can look deep.')}
${p('with icons has four dimensional styles, all drawn from the same skeleton as the flat ones:')}
${ul([
  `<strong>${L.style('gloss', 'Gloss')}:</strong> inflated and pillowy, like a soft vinyl toy, with carved shiny highlights. It uses one flat colour, so it recolours as easily as a line icon.`,
  `<strong>${L.style('glass', 'Glass')}:</strong> layered frosted glass. A vivid colour glows through a see-through pane with a crisp rim and a soft sheen.`,
  `<strong>${L.style('luxe', 'Luxe')}:</strong> premium, jewellery-box 3D: enamel, polished gold and ruby set in thick slabs, with soft shadows and crisp highlights.`,
  `<strong>${L.style('skeuo', 'Skeuo')}:</strong> skeuomorphic, meaning “looks like the real thing”. Every icon becomes an object made of paper, leather, metal, brass, wood or glass, lit from above.`,
])}
${iconGrid(['gift', 'trophy', 'crown', 'gem', 'wallet', 'key'], 'luxe', 'Luxe icons: rich, deep and made for being looked at, not clicked a hundred times a day.')}
${callout('note', 'Many “3D icon” packs online are rendered images (PNG files made in 3D software). They can look great, but they are heavier, blur when scaled up and cannot be recoloured. The with icons dimensional styles are SVGs: pictures made of shapes, so they stay sharp at any size.')}

${h2('Is there something between flat and 3D?')}
${p('Yes, and it is where a lot of friendly brands live. Some styles are mostly flat but borrow one or two tricks from 3D, like a drop shadow or a puffy outline. They feel richer than plain line icons without the full weight of glass or luxe.')}
${styleRow('heart', 'The same heart, from flat to almost-3D: duo, sticker (drop shadow), retro (hard offset shadow), kawaii (thick soft outline) and gloss.', { styles: ['duo', 'sticker', 'retro', 'kawaii', 'gloss'] })}
${p(`${L.style('sticker')} icons look like die-cut vinyl stickers with a white border and a soft shadow. ${L.style('retro')} icons use chunky outlines and a hard offset shadow, like a 70s patch. ${L.style('kawaii')} icons are chubby pastel shapes with tiny faces. If flat feels too plain and full 3D feels too much, start here. Our post on ${L.post('playful-icon-styles', 'cute and playful icon styles')} covers this family in detail.`)}

${h2('How did icons go from realistic to flat and back again?')}
${p('Icon fashion has swung like a pendulum, and knowing the story helps you choose today.')}
${h3('The realistic years')}
${p(`Early smartphone apps leaned on skeuomorphism: notes apps looked like paper notepads, and buttons looked raised and shiny. The idea, as the Nielsen Norman Group explains, was to make new digital tools feel familiar by borrowing the look of real objects. It worked, but the stitched leather and wood textures often became decoration for its own sake.`)}
${h3('The flat turn')}
${p(`Around 2012 and 2013 the industry went flat. Microsoft’s Metro design language, which reached a huge audience with Windows 8 in 2012, promoted an “authentically digital” look with no fake materials. In June 2013 Apple unveiled iOS 7, with typography refined for a “cleaner, simpler look”, according to its own announcement. Flat icons became the default almost overnight.`)}
${h3('Depth comes back, gently')}
${p(`Pure flat design had a cost: without shadows or raised edges, people could not always tell what was clickable. The Nielsen Norman Group called the fix “flat 2.0”: mostly flat, with subtle shadows and layers. Google’s Material Design, announced at Google I/O on June 25, 2014, is the best-known example. Then in June 2025 Apple introduced Liquid Glass, a design with see-through, reflective surfaces across its operating systems. Our post on ${L.post('icon-design-trends-2026', 'icon design trends for 2026')} follows that thread.`)}
${p('So in 2026 the pendulum rests in the middle. Interfaces are still mostly flat, because flat is clear. Decoration has more depth, because depth is delightful. That is exactly the split we recommend below.')}
${figure('xd34', 'Depth is back in fashion, but mostly for big, decorative moments rather than the buttons you tap all day.')}

${h2('Which should you use: flat or 3D icons?')}
${p('Here is a cheat sheet for the jobs people ask about most. “Small” means everyday interface sizes like 16 to 24px. “Big” means 32px and up.')}
${table(['Where the icon goes', 'Pick', 'Why', 'Suggested styles'], [
  ['App UI: buttons, menus, tabs, forms', yes('Flat'), 'Small sizes, used all day, must be instantly clear', `${L.style('line', 'Line')}, with ${L.style('solid', 'solid')} for the active state`],
  ['Dashboards and data tools', yes('Flat'), 'Dense screens with many icons; depth adds noise', `${L.style('line', 'Line')} or ${L.style('duo', 'duo')}`],
  ['Landing pages: hero and feature grid', meh('3D for the hero, flat in the nav'), 'Big sizes, the icon is the star, one section at a time', `${L.style('glass', 'Glass')}, ${L.style('gloss', 'gloss')} or ${L.style('luxe', 'luxe')}`],
  ['Slides and presentations', meh('Either'), 'Seen from far away; bold styles help, keep one style per deck', `${L.style('solid', 'Solid')} or ${L.style('duo', 'duo')} for business, ${L.style('glass', 'glass')} for title slides`],
  ['Kids’ apps and classrooms', meh('Playful or 3D, at 32px+'), 'Friendly and touchable; small kids benefit from big targets', `${L.style('kawaii', 'Kawaii')}, ${L.style('sticker', 'sticker')} or ${L.style('gloss', 'gloss')}`],
  ['Print: flyers, posters, packaging', meh('Either, export large'), 'Fine detail prints well; thin lines can vanish on rough paper', `${L.style('solid', 'Solid')} for small print, ${L.style('skeuo', 'skeuo')} or ${L.style('luxe', 'luxe')} for posters`],
  ['App-store and social graphics', yes('3D'), 'Needs to stand out in a busy feed', `${L.style('luxe', 'Luxe')}, ${L.style('skeuo', 'skeuo')} or ${L.style('glass', 'glass')}`],
], 'Flat vs 3D icons by use, at a glance')}
${p(`If you only remember one thing: <strong>flat where people click, 3D where people look</strong>. For slides specifically, our ${L.post('icons-in-presentations', 'guide to icons in presentations')} and the ${L.guide('powerpoint', 'PowerPoint guide')} walk through the steps.`)}

${h2('Do 3D icons make a website slower?')}
${p(`A little heavier, yes. Slower, rarely, as long as you use SVGs and keep 3D icons to a few big moments. We measured all ${N_ICONS} with icons in each style (October 2026, before compression):`)}
${stats([['~0.4 KB', 'a typical line icon'], ['~1.4 KB', 'a typical gloss icon'], ['~3 KB', 'a typical glass icon'], ['~6 KB', 'a typical luxe icon']])}
${p('The richest style is roughly 15 times the size of a line icon, because highlights, shadows and materials are extra shapes. That still sounds tiny, and for six icons in a feature grid it is. It adds up when you put detailed icons in a list of 200 rows, or when you download “3D icons” as large PNG images instead of SVGs. SVG is also text, so web servers can compress it further. Our post on ' + L.post('svg-vs-png-icons', 'SVG vs PNG icons') + ' explains why SVG is usually the better file for icons.')}
${callout('tip', 'A simple budget: flat icons everywhere in the interface, and no more than about 6 to 12 dimensional icons on any one page. That keeps pages light and keeps the 3D ones special.')}

${h2('Do 3D icons work at small sizes?')}
${p('Not well. The details that make 3D icons beautiful, like rims, reflections and soft shadows, need room. Squeeze them into 16 pixels and they turn into a smudge. Flat icons were built for that size.')}
${sizeRamp(['home', 'bell', 'heart'], [16, 24, 32, 48], 'line', 'Flat line icons stay crisp from 16px to 48px.')}
${sizeRamp(['home', 'bell', 'heart'], [16, 24, 32, 48], 'glass', 'Glass icons look lovely at 32 and 48px, but lose their glow at 16 and 24px.')}
${p(`This matters for accessibility too. The web’s accessibility standard (WCAG 2.1, success criterion 1.4.11) asks for a contrast of at least 3:1 between meaningful icons and the colours next to them. A flat solid icon in your text colour usually passes easily. A soft, glowing 3D icon may have light edges that blend into a light page. Check the contrast of any icon that carries meaning, and always pair important icons with a text label. Our ${L.post('accessible-icons', 'guide to accessible icons')} has the details, and the ${L.post('icon-sizes-guide', 'icon sizes guide')} covers which size to use where.`)}

${h2('How do you keep flat and 3D icons consistent?')}
${p('Mixing looks is fine. Mixing them randomly is not. The trick is <strong>one style per area</strong>: the navigation is all line, the hero is all glass, the footer is line again. Each area is consistent on its own, so the page feels planned.')}
${doDont(
  '<p>Use the same icon drawing in both looks. A line rocket in the menu and a glass rocket in the hero feel like the same brand, because they share one skeleton.</p>',
  '<p>Mix a flat bell, a glossy envelope and a leather calendar in one toolbar. Three looks in one row reads as three different products.</p>',
)}
${p(`This is why it helps when one library offers both. In with icons, every dimensional style is generated from the same drawing as line and solid, so the shapes, proportions and meaning match exactly. Each icon also has 20 to 30 hand-picked colour palettes for the multi-colour styles, which makes it easy to tie a glass or luxe icon to your brand colours. For more, read ${L.post('consistent-icons', 'how to keep your icons consistent')}.`)}
${styleRow('shield-check', 'The same shield in flat solid and dimensional luxe: one shape, two jobs.', { styles: ['solid', 'luxe'] })}

${h2('How do you choose in three steps?')}
${steps([
  ['Start flat', `Use ${L.style('line', 'line')} icons for every button, menu and form. Switch the selected item to ${L.style('solid', 'solid')}.`],
  ['Find your big moments', 'List the places where an icon is the star: the hero, a feature grid, a title slide, an onboarding screen, an app-store image.'],
  ['Pick one dimensional style for those', `Choose ${L.style('glass', 'glass')} for fresh and modern, ${L.style('gloss', 'gloss')} for fun, ${L.style('luxe', 'luxe')} for premium or ${L.style('skeuo', 'skeuo')} for tactile. Use it at 32px or larger, and only in those spots.`],
])}
${callout('try', `Open any icon, for example ${L.icon('rocket')} or ${L.icon('gift')}, and flip between line and glass. Seeing your own icon both ways is the quickest way to decide.`)}

${cta('Flat and 3D, from one drawing', `${N_ICONS} free icons in ${N_STYLES} styles, from crisp line to glossy luxe. Copy, download a PNG or SVG, MIT licensed.`, ['rocket', 'gem', 'star', 'heart', 'trophy', 'sparkles'])}
`,
}
