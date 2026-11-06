import { p, h2, h3, ul, figure, iconGrid, styleRow, sizeRamp, table, yes, no, meh, callout, steps, verdict, doDont, cta, faceOff, rivalStyles, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

export default {
  slug: 'best-figma-icon-libraries',
  category: 'comparisons',
  date: '2026-11-06',
  hero: 'h-best-figma-icon-libraries',
  stickers: [['pen-tool', 'duo'], ['layers', 'gloss'], ['component', 'solid']],
  title: 'The best Figma icon libraries in 2026: plugins, files and free SVG',
  cardTitle: 'The best Figma icon libraries',
  h1: 'The best Figma icon libraries, <em>plugin by plugin</em>',
  dek: 'Iconify, Lucide, Phosphor, Tabler, Font Awesome, Hugeicons and more: how each one gets into Figma, whether it stays an editable vector, and which to pick for your file.',
  description: 'The best Figma icon library for your file: Iconify, Lucide, Phosphor, Tabler, Font Awesome, Hugeicons and free SVG sets, compared on plugins, vectors and licence.',
  keywords: ['best figma icon library', 'figma icon plugin', 'icons for figma', 'free figma icons', 'iconify figma', 'figma icon components', 'figma icon stroke scaling'],
  about: ['Figma', 'Icon library', 'Iconify', 'Lucide', 'Phosphor', 'Tabler Icons'],
  related: ['best-free-icon-libraries', 'consistent-icons', 'svg-vs-png-icons'],
  tldr: [
    '<strong>Best all-in-one Figma icon plugin:</strong> Iconify, free, with over 300,000 open-source icons from hundreds of sets. Check each set’s licence, because a few need a credit.',
    '<strong>Best single sets with official Figma plugins:</strong> Lucide (clean outline), Phosphor (six weights), Tabler (over 6,000 icons) and Font Awesome (needs a free account and token).',
    '<strong>Best ready-made component files:</strong> Hugeicons (6,000+ free icons as components with variants), Heroicons and Bootstrap Icons (official Figma Community files).',
    `<strong>Best for one look across Figma, slides and code, in ${N_STYLES} styles:</strong> with icons. There is no plugin: you click Copy SVG and paste, and it lands as editable vectors.`,
    'Whatever you pick, resize icons with the Scale tool (K) so the line thickness grows with them, and turn the ones you reuse into components.',
  ],
  faq: [
    { q: 'What is the best free icon plugin for Figma?', a: 'For breadth, Iconify for Figma: it is free and searches over 300,000 open-source icons from many sets in one panel. For one consistent set, the official Lucide, Phosphor or Tabler plugins are excellent and free. Hugeicons has a free plugin and a free Figma file of 6,000+ stroke icons.' },
    { q: 'Do I need a plugin to use icons in Figma?', a: `No. Figma turns pasted SVG code into vector layers, so any site with a Copy SVG button works without a plugin. On with icons you click Copy SVG on an icon page and press Ctrl+V (Cmd+V on a Mac) on the canvas. Plugins mostly save you a trip to the browser.` },
    { q: 'Why do my icon lines look thin when I make them bigger in Figma?', a: 'Dragging the normal resize handles keeps the stroke at its original width, so a 1.75 or 2px line looks thin at 96px. Use the Scale tool (press K) instead: Figma’s help centre says strokes scale with the object. Or use Outline stroke to turn lines into filled shapes first.' },
    { q: 'Are Figma icon plugins free for commercial work?', a: 'The plugins themselves are free, but the licence comes from the icon set. Lucide (ISC), Phosphor, Tabler, Heroicons, Bootstrap Icons, Hugeicons’ free set and with icons (MIT) need no credit. Font Awesome Free icons are CC BY 4.0. Iconify shows each icon’s licence, and some sets in it require attribution.' },
    { q: 'Does with icons have a Figma plugin?', a: `Not yet. Every icon page has Copy SVG, which pastes into Figma as editable vector layers on a 24 x 24 frame, in any of the ${N_STYLES} styles. The free icons for Figma page lets you copy a starter set in one click each.` },
    { q: 'Should icons in Figma be components?', a: 'Yes, for anything you use more than once. A component lets you change an icon everywhere at once, and instance swap lets you replace one icon with another without breaking the layout. Hugeicons ships its free file as components; with most other sets you make the components yourself.' },
  ],
  sources: [
    { title: 'Iconify for Figma (free plugin, over 300,000 icons, checked November 2026)', url: 'https://iconify.design/docs/design/figma/' },
    { title: 'Lucide README: Figma plugin and ISC licence', url: 'https://github.com/lucide-icons/lucide' },
    { title: 'lucide.dev (icon count shown on the site)', url: 'https://lucide.dev/' },
    { title: 'Phosphor Figma plugin (GitHub)', url: 'https://github.com/phosphor-icons/figma' },
    { title: 'Phosphor homepage README: six weights, MIT', url: 'https://github.com/phosphor-icons/homepage' },
    { title: '@phosphor-icons/core 2.1.1 (icon count)', url: 'https://unpkg.com/@phosphor-icons/core@2.1.1/' },
    { title: 'Tabler docs: Figma plugin (size, colour, stroke width)', url: 'https://docs.tabler.io/icons/plugins/figma.md' },
    { title: 'Tabler Icons README: 6,257 icons, adjustable stroke, MIT', url: 'https://github.com/tabler/tabler-icons' },
    { title: 'Font Awesome docs: Figma plugin (free account, API token, Pro icons)', url: 'https://docs.fontawesome.com/desktop/add-icons/figma-plugin' },
    { title: 'Font Awesome Free licence (GitHub)', url: 'https://github.com/FortAwesome/Font-Awesome/blob/7.x/LICENSE.txt' },
    { title: 'Hugeicons FAQ: Figma icons (free plugin and file, components, variants)', url: 'https://hugeicons.com/faq/figma-icons' },
    { title: 'Heroicons website (Figma file link, 316 icons)', url: 'https://heroicons.com' },
    { title: 'Bootstrap Icons website (Figma file link)', url: 'https://icons.getbootstrap.com' },
    { title: 'Google Fonts: Material Symbols guide (styles, axes, Apache 2.0)', url: 'https://developers.google.com/fonts/docs/material_symbols' },
    { title: 'Figma Help: Scale layers while maintaining proportions', url: 'https://help.figma.com/hc/en-us/articles/360040451453' },
    { title: 'Figma Help: Swap components and instances', url: 'https://help.figma.com/hc/en-us/articles/360039150413' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">The best Figma icon library depends on how you like to work. If you want every open-source icon in one panel, install the free Iconify plugin. If you want one polished set, Lucide, Phosphor, Tabler and Font Awesome all have official plugins, and Hugeicons, Heroicons and Bootstrap Icons publish ready-made Figma files. If you want one look that matches across Figma, slides and code, with icons gives you ${N_STYLES} styles that paste in as editable vectors, with no plugin at all.</span>`)}
${p(`This guide compares the three ways icons get into Figma (plugins, community files and copy-paste SVG), then the sets themselves. It covers what designers actually trip over: icons that arrive flattened, lines that go thin when scaled, components and variants, swapping styles, and licences. Every third-party fact comes from the library’s own site, docs or GitHub, checked in November 2026.`)}
${callout('note', `We make ${L.icons('with icons')}, one of the sets below. We say plainly where it is weaker: it has no Figma plugin and no component file yet.`, 'Who wrote this')}

${h2('What is the best icon library for Figma?')}
${table(['Library', 'How it gets into Figma', 'Free icons', 'Styles', 'Licence', 'Credit needed?'], [
  ['Iconify', 'Free official plugin', 'Over 300,000 (many sets)', 'Depends on the set', 'Each set’s own', meh('Some sets')],
  ['Lucide', 'Official plugin', 'Over 2,000', '1 outline', 'ISC', yes('No')],
  ['Phosphor', 'Official plugin', 'About 1,500', '6 weights', 'MIT', yes('No')],
  ['Tabler Icons', 'Official plugin', 'Over 6,000', 'Outline + filled, adjustable stroke', 'MIT', yes('No')],
  ['Font Awesome', 'Official plugin (free account + token)', 'Over 2,000', 'Solid, Regular, Brands', 'CC BY 4.0', meh('Built into the files')],
  ['Hugeicons', 'Free plugin + free Figma file', '6,000+', '1 free (10 in Pro)', 'MIT (free set)', yes('No')],
  ['Heroicons', 'Official Community file', '316', 'Outline, solid, mini, micro', 'MIT', yes('No')],
  ['Bootstrap Icons', 'Official Community file', 'Over 2,000', 'Outline + fill', 'MIT', yes('No')],
  ['Material Symbols', 'SVG download from Google, or via Iconify', 'Over 2,500', '3 + fill and weight axes', 'Apache 2.0', yes('No')],
  ['with icons', no('No plugin') + ' Copy SVG and paste', `${N_ICONS} (${N_SVGS} SVGs)`, `${N_STYLES}`, 'MIT', yes('No')],
], 'How the popular icon sets get into Figma (checked November 2026). Counts are quoted the way each library states them.')}
${p(`A quick note on Material Symbols: Google documents the font and the SVG and PNG downloads on its own pages, but we did not find a Figma plugin that Google documents itself. The simplest routes are the free Iconify plugin, which includes Material Symbols, or downloading SVGs from Google Fonts.`)}

${h2('Plugin, community file or copy-paste: which way is best?')}
${p('There are three roads into Figma, and each suits a different kind of person.')}
${h3('A plugin: search without leaving Figma')}
${p('A plugin opens a search panel inside your file. You type “settings”, click, and the icon drops onto the canvas. Iconify’s plugin covers hundreds of open-source sets and can import an icon as a component or a frame. Font Awesome’s plugin places the icon as an SVG at 16px high; you need a free Font Awesome account and an API token the first time, and a Pro plan for Pro icons. Tabler’s plugin lets you change size, colour and stroke width after inserting. Best for: designers who add icons all day.')}
${h3('A community file: a ready-made library')}
${p('Some sets publish a Figma Community file you can duplicate and publish as a team library. Hugeicons’ free file has 6,000+ stroke icons, and its FAQ says every icon is a vector component, set up for variants. Heroicons and Bootstrap Icons link official files from their sites. Best for: teams building a design system who want components from day one.')}
${h3('Copy-paste SVG: no install at all')}
${p(`Figma turns pasted SVG code into real vector layers. Any site with a Copy SVG button works, including ${L.icons('with icons')}: open an icon, click Copy SVG, press Ctrl+V (Cmd+V on a Mac). Nothing to install, nothing to approve with IT. Best for: occasional use, locked-down work laptops, and anyone who also needs the same icon in slides or code.`)}
${iconGrid(['pen-tool', 'layers', 'component', 'layout-grid', 'cursor', 'palette'], 'duo', 'A designer’s toolkit in the duo style, each one pasted from its icon page as vectors.')}

${h2('Do icons stay editable vectors in Figma?')}
${p('They should, and it matters. An editable vector is made of paths you can recolour, reshape and scale without blur. A flattened icon is a picture (a PNG), so you cannot change its colour and it goes soft when enlarged.')}
${ul([
  '<strong>Plugins</strong> from the sets above insert SVG, so you get vectors.',
  '<strong>Community files</strong> are vectors already, usually wrapped as components.',
  '<strong>Copy-paste</strong> gives vectors only if you copy the SVG code. If you copy an image, you get a picture.',
])}
${callout('warn', `Pasted a with icons icon and got a flat image? You pressed Copy image, which is made for slides and docs. Go back, press <strong>Copy SVG</strong>, and paste again. The ${L.guide('figma', 'Figma guide')} shows each step.`)}
${p(`Multi-colour styles stay vectors too. A downloaded with icons .svg file has its colours baked in, so a ${L.style('clay', 'clay')} or ${L.style('glass', 'glass')} icon arrives as layered shapes you can still pick apart. For more on the two formats, read ${L.post('svg-vs-png-icons', 'SVG vs PNG icons')}.`)}

${h2('How do I scale icons in Figma without thin lines?')}
${p('Most outline icons are drawn on a 24 x 24 grid with a line about 1.5 to 2px thick (ours is 1.75px). If you drag the normal resize handles, Figma keeps the line at that width, so a 96px icon looks spindly.')}
${steps([
  ['Use the Scale tool', 'Press K, then drag a corner. Figma’s help centre says strokes scale as well, so the icon keeps its proportions.'],
  ['Or outline the stroke', 'Outline stroke turns each line into a filled shape. It then scales like any shape, but you can no longer change the line width.'],
  ['Or change the stroke on purpose', 'Tabler’s plugin lets you set the stroke width after inserting, and you can edit the stroke of any pasted outline icon in the right panel. Keep one value across the whole file.'],
])}
${sizeRamp(['home', 'search', 'bell'], [16, 24, 32, 48], 'line', 'The line style at four sizes. Scaled with K, the line grows with the icon and the look stays the same.')}

${h2('Should Figma icons be components or variants?')}
${p('A <strong>component</strong> is a master copy: change it once and every copy follows. <strong>Instance swap</strong> lets you replace one icon with another inside a button without rebuilding it, and Figma’s help centre explains it in its guide to swapping components and instances. <strong>Variants</strong> group related components, such as outline and filled versions of the same icon.')}
${p(`Hugeicons’ free file arrives as components ready for variants, which saves real time. With plugins and copy-paste you make components yourself: paste the icon, press Ctrl+Alt+K (Cmd+Option+K on a Mac), and name it clearly, for example icon/home/line.`)}
${doDont('<p>Make one component per icon you reuse, name them by icon and style, and keep them on one page of your file. Swap icons with instance swap.</p>', '<p>Paste a fresh icon every time you need one. Fifty loose copies of the same bell are fifty things to fix when the bell changes.</p>')}

${h2('Can I swap icon styles in Figma without redrawing?')}
${p(`Yes, if the set offers several styles drawn on the same grid. Phosphor gives each icon six weights, from Thin to Duotone, so you can make them variants of one component. with icons goes further on looks: each of the ${N_ICONS} icons is drawn once and rendered in ${N_STYLES} styles on the same 24 x 24 frame, so swapping line for solid, or for something bolder like ${L.style('gloss', 'gloss')}, never moves a pixel of your layout.`)}
${rivalStyles('phosphor', ['home', 'heart', 'star', 'bell'], 'Phosphor’s six weights for the same four icons, a good fit for a variant property in Figma.')}
${styleRow('home', 'One home icon in six with icons styles, each one Copy SVG away.', { styles: ['line', 'solid', 'duo', 'gloss', 'clay', 'sketch'] })}
${p(`Here is how two clean outline sets compare at the same size, ours on top and Lucide’s below. Both paste into Figma as strokes you can recolour.`)}
${faceOff('lucide', { concepts: ['home', 'search', 'settings', 'user', 'bell', 'heart'], caption: 'with icons line (top) and Lucide (bottom), the same six ideas.' })}

${h2('Which Figma icon libraries are free for commercial use?')}
${p('Every set in the table allows commercial work. The difference is the fine print, and in Figma it comes from the icon set, not the plugin:')}
${ul([
  '<strong>No credit needed:</strong> Lucide (ISC), Phosphor, Tabler, Heroicons, Bootstrap Icons, Hugeicons’ free set and with icons (all MIT). Material Symbols is Apache 2.0.',
  '<strong>Credit built in:</strong> Font Awesome Free icons are CC BY 4.0; Font Awesome says the credit already inside its files is enough.',
  '<strong>Check per icon:</strong> Iconify shows each icon’s author and licence in search results. Some sets in it use CC BY, which asks for a credit.',
])}
${p(`If licence names are new to you, ${L.post('free-icons-commercial-use', 'our plain-English licence guide')} explains them.`)}
${figure('flat0', 'Whichever route you choose, settle the icon question once, at the start of the file. Swapping sets halfway through a project is where the hours go.')}

${h2('Which Figma icon library should you pick?')}
${ul([
  '<strong>Iconify</strong> if you want almost any open-source icon in one free plugin and are happy to check licences.',
  '<strong>Lucide</strong> if your developers build with React or shadcn/ui, so design and code use the same names.',
  '<strong>Phosphor</strong> if you want weights as variants, from hairline to bold.',
  '<strong>Tabler Icons</strong> if you keep needing rare icons and want to set the stroke width in the plugin.',
  '<strong>Font Awesome</strong> if you need brand logos, or your team already pays for Pro.',
  '<strong>Hugeicons</strong> if you want a free component file with variants, and may buy more styles later.',
  '<strong>Heroicons</strong> if you design for Tailwind and like a small, tidy set.',
  '<strong>Material Symbols</strong> if you design for Android or follow Material Design.',
  `<strong>with icons</strong> if the same icons must appear in Figma, slides, docs and code, or you want looks beyond outline and filled.`,
])}
${verdict({
  title: 'Plugin set or with icons?',
  a: ['with icons', [`You want ${N_STYLES} matching styles, from line to clay, sketch and kawaii, on one grid`, 'The same icons go into Figma, PowerPoint, Notion and your React app', 'You cannot install plugins on your work laptop', 'You want MIT with no credit, for every icon'] ],
  b: ['a plugin set', ['You add icons all day and want search inside Figma', 'You need thousands of icons, or brand logos', 'You want a ready-made component file with variants', 'You only ever need outline and filled'] ],
})}

${h2('How do you get with icons into Figma?')}
${steps([
  ['Pick your icons', `Open the ${L.page('free/icons-for-figma.html', 'free icons for Figma page')} for a starter set, or search all ${N_ICONS} in ${L.icons('the library')}. Search understands everyday words, so “bin” finds trash.`],
  ['Copy the SVG', 'Choose a style and press Copy SVG. On the Figma page, one click on an icon copies it.'],
  ['Paste and scale', 'Press Ctrl+V (Cmd+V) on your canvas. The icon arrives as a 24 x 24 vector group. Resize it with the Scale tool (K).'],
  ['Make it a component', 'Press Ctrl+Alt+K (Cmd+Option+K) and name it, so you can reuse and swap it later.'],
])}
${p(`The ${L.guide('figma', 'Figma guide')} covers recolouring strokes and fills, and ${L.post('consistent-icons', 'keeping icons consistent')} explains why one set per file looks better than three. For a wider view beyond Figma, see ${L.post('best-free-icon-libraries', 'the best free icon libraries')}.`)}
${cta('Paste your first icon in Figma', `${N_ICONS} icons in ${N_STYLES} styles, editable vectors, MIT licensed. No plugin, no account.`, ['pen-tool', 'layers', 'component', 'palette', 'sparkles', 'star'])}
`,
}
