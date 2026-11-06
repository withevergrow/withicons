import { p, h2, h3, ul, figure, iconGrid, styleRow, sizeRamp, table, yes, no, meh, callout, steps, doDont, code, cta, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

export default {
  slug: 'where-to-get-free-svg-icons',
  category: 'guides',
  date: '2026-11-06',
  hero: 'h-where-to-get-free-svg-icons',
  stickers: [['download', 'gloss'], ['file-code', 'duo'], ['search', 'sticker']],
  title: 'Where to get free SVG icons in 2026: 11 sites, compared',
  cardTitle: 'Where to get free SVG icons',
  h1: 'Where to get free SVG icons in 2026: <em>11 sites</em>, compared',
  dek: 'SVG Repo, Iconify, Flaticon, Lucide and friends all promise free SVG icons. Here is what each one really gives you, the catch that comes with it, and how to check a licence before you hit download.',
  description: 'Where to get free SVG icons in 2026: 11 sites compared, from SVG Repo and Iconify to Flaticon, Lucide and Tabler, with each one’s catch, licence and formats.',
  keywords: ['where to get free svg icons', 'best sites for free svg icons', 'free svg', 'svg repo alternative', 'icon svg', 'free svg icons for commercial use', 'sites like svg repo'],
  about: ['Scalable Vector Graphics', 'Icon library', 'Software license', 'SVG Repo', 'Iconify'],
  related: ['svg-vs-png-icons', 'free-icons-no-attribution', 'best-free-icon-libraries'],
  tldr: [
    '<strong>Biggest free pile:</strong> SVG Repo (500,000+ SVGs) and Iconify (over 300,000 icons from 260 open sets). Both are free, but licences change from icon to icon.',
    '<strong>Free SVG with no credit and one matching look:</strong> open-source sets such as Lucide, Tabler, Phosphor, Material Symbols and with icons.',
    '<strong>Marketplaces</strong> (Flaticon, Icons8, The Noun Project) have millions of icons, but free use needs a credit or link, and Flaticon’s free downloads are PNG only.',
    '<strong>Always check the licence on the icon’s own page</strong>, not just the site’s footer. On aggregators, one search can mix CC0, MIT, CC BY and even non-commercial icons.',
    `<strong>with icons</strong> (our set): ${N_ICONS} icons in ${N_STYLES} styles, ${N_SVGS} free SVGs, MIT, no credit. Far fewer icons than a marketplace, but every one matches.`,
  ],
  faq: [
    { q: 'What is the best site for free SVG icons?', a: 'It depends on the job. For one rare icon, SVG Repo or Iconify have the biggest free choice. For a whole matching set with no credit, pick an open-source set such as Lucide, Tabler, Phosphor, Material Symbols or with icons. For illustrated or very specific icons, marketplaces like The Noun Project and Flaticon are huge, but their free plans ask for a credit.' },
    { q: 'Is SVG Repo free for commercial use?', a: 'Mostly, but check each icon. SVG Repo’s default licence allows commercial projects with no attribution, but its licensing page says an icon’s own page can state a different licence, and the site lists CC BY (credit needed), GPL and even CC BY-NC (no commercial use) among them. Read the licence line on the icon page before you download.' },
    { q: 'What is a good SVG Repo alternative?', a: 'Iconify (and its fast explorer Icônes) is the closest match: a huge, free catalogue where each icon set shows its licence clearly. If you would rather have one licence and one look, use an open-source set like Tabler (over 6,200 MIT icons), Lucide or with icons.' },
    { q: 'Can I get free SVG icons from Flaticon?', a: 'Flaticon’s pricing page lists free downloads as PNG. SVG, EPS and PSD come with Premium, which also removes the credit line. The Noun Project, by contrast, offers free PNG and SVG downloads with a CC BY 3.0 credit.' },
    { q: 'Do free SVG icons need attribution?', a: 'Only some. MIT, ISC, Apache 2.0 and CC0 icons need no visible credit. CC BY icons and the free plans of Flaticon, Icons8, The Noun Project and Streamline do. Our guide to free icons with no attribution has a full table.' },
    { q: 'How do I know if an SVG icon file is good quality?', a: 'Open it in a text editor. A good icon has a viewBox (so it scales), uses currentColor or a few plain colours (so you can recolour it), contains only shapes and paths, and has no embedded PNG or JPEG inside. It should also look crisp at 16 and 24 pixels.' },
  ],
  sources: [
    { title: 'SVG Repo home page (500.000+ open-licensed SVGs, always free)', url: 'https://www.svgrepo.com/' },
    { title: 'SVG Repo licensing (default licence, per-icon licences)', url: 'https://www.svgrepo.com/page/licensing/' },
    { title: 'Iconify (over 300,000 open source icons; icon licences)', url: 'https://iconify.design/' },
    { title: 'Iconify icon sets browser (260 sets, licence per set)', url: 'https://icon-sets.iconify.design/' },
    { title: 'Icônes README (icon explorer powered by Iconify)', url: 'https://github.com/antfu-collective/icones' },
    { title: 'Flaticon pricing (free PNG, Premium formats, attribution)', url: 'https://www.flaticon.com/pricing' },
    { title: 'Flaticon help: Attribution, how, when and where?', url: 'https://support.flaticon.com/s/article/Attribution-How-when-and-where-FI?language=en_US' },
    { title: 'Icons8 licence: how to use our graphics for free', url: 'https://icons8.com/license' },
    { title: 'Icons8 icons pricing (Icons plan, free use with a link)', url: 'https://icons8.com/icons/pricing' },
    { title: 'Icons8 docs: download formats (free PNG up to 100px)', url: 'https://icons.docs.icons8.com/' },
    { title: 'The Noun Project pricing (10M icons, free PNG and SVG, Noun Pro)', url: 'https://thenounproject.com/pricing/' },
    { title: 'The Noun Project legal (CC BY 3.0 for free icons)', url: 'https://thenounproject.com/legal/' },
    { title: 'Font Awesome Free licence (GitHub)', url: 'https://github.com/FortAwesome/Font-Awesome/blob/7.x/LICENSE.txt' },
    { title: 'Font Awesome plans', url: 'https://fontawesome.com/plans' },
    { title: 'Google Fonts: Material Symbols guide', url: 'https://developers.google.com/fonts/docs/material_symbols' },
    { title: 'google/material-design-icons README (licence, attribution)', url: 'https://github.com/google/material-design-icons' },
    { title: 'Lucide website (icon count)', url: 'https://lucide.dev/' },
    { title: 'Lucide licence (ISC)', url: 'https://lucide.dev/license' },
    { title: 'Tabler Icons README (GitHub)', url: 'https://github.com/tabler/tabler-icons' },
    { title: 'Phosphor homepage README (GitHub)', url: 'https://github.com/phosphor-icons/homepage' },
    { title: '@phosphor-icons/core 2.1.1 (icon counts)', url: 'https://unpkg.com/@phosphor-icons/core@2.1.1/' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">The best places to get free SVG icons are SVG Repo and Iconify when you need one rare icon from a huge pile, open-source sets like Lucide, Tabler, Phosphor, Material Symbols and ${L.icons('with icons')} when you want a whole matching set with no credit, and marketplaces like The Noun Project and Flaticon when you need something illustrated and do not mind a credit line. The catch is never the price. It is the licence, the credit and, on big aggregators, the mix of quality.</span>`)}
${p(`An SVG is a picture made of shapes instead of pixels, so it stays sharp at any size and is easy to recolour. Still deciding between formats? Our ${L.post('svg-vs-png-icons', 'SVG vs PNG guide')} explains the difference in five minutes.`)}
${callout('note', `We make ${L.icons('with icons')}, one of the eleven sites below. We say where others are better, and every competitor fact comes from the site’s own pages, checked in November 2026 (links at the bottom).`, 'Who wrote this')}

${h2('Which sites have free SVG icons? The quick table')}
${table(['Site', 'What you get', 'Free SVG?', 'Credit needed?', 'The catch'], [
  ['SVG Repo', '500,000+ SVGs from many sources', yes('Yes'), meh('Depends on the icon'), 'Licence and quality vary icon by icon'],
  ['Iconify / Icônes', 'Over 300,000 icons from 260 open sets', yes('Yes'), meh('Depends on the set'), 'Built for developers; check each set’s licence'],
  ['Flaticon', '18 million+ icons and stickers', no('PNG only (SVG in Premium)'), no('Yes, on the free plan'), 'Credit every author, or pay'],
  ['Icons8', 'Over a million icons in many styles', meh('A few free categories'), no('Yes, a link'), 'Free PNG is small (up to 100px)'],
  ['The Noun Project', '10 million icons from many artists', yes('Yes'), no('Yes, CC BY 3.0'), 'Credit the creator, or pay for Noun Pro'],
  ['Font Awesome', 'Over 2,000 free icons', yes('Yes'), meh('Built into the files'), 'Many styles and icons are Pro only'],
  ['Material Symbols', 'Over 2,500 icons, Google’s set', yes('Yes'), yes('No'), 'Looks like Android, by design'],
  ['Lucide', 'Over 2,000 outline icons', yes('Yes'), yes('No'), 'One outline style'],
  ['Tabler Icons', 'Over 6,200 icons, outline and filled', yes('Yes'), yes('No'), 'Two styles only'],
  ['Phosphor', 'About 1,500 icons in 6 weights', yes('Yes'), yes('No'), 'Smaller catalogue than Tabler'],
  ['with icons', `${N_ICONS} icons × ${N_STYLES} styles = ${N_SVGS} SVGs`, yes('Yes, plus PNG'), yes('No'), 'Far fewer icons than a marketplace'],
], 'Eleven places to get free SVG icons (checked November 2026). “Credit needed” is for the free plan.')}

${h2('What are the three kinds of free SVG icon sites?')}
${p('Almost every site falls into one of three groups, and the group tells you most of what to expect.')}
${ul([
  '<strong>Aggregators</strong> (SVG Repo, Iconify) collect icons from many open sources in one search box. Enormous and free, but every icon keeps its original licence.',
  '<strong>Marketplaces</strong> (Flaticon, Icons8, The Noun Project) sell the work of many artists. Free downloads need a credit or link; a subscription removes it.',
  '<strong>Open-source sets</strong> (Font Awesome, Material Symbols, Lucide, Tabler, Phosphor, with icons) are one family, one team, one licence. Fewer icons, but they all match.',
])}
${figure('xlib2', 'An aggregator is like a giant library of books from many publishers. Brilliant for finding one title, less so for a matching set.')}

${h2('The 11 sites, one by one')}

${h3('1. SVG Repo: the biggest free pile')}
${p('SVG Repo is an open catalogue: bots collect open-licensed SVGs from known sources, and users submit their own. The home page lists 500,000+ open-licensed vectors and icons in over 6,000 collections, and promises “always free, no premium”. Most icons fall under its default SVG Repo License, which allows commercial projects with no attribution, though you may not resell or redistribute the files as they are.')}
${p('<strong>The catch:</strong> the licensing page says an icon’s own page can state a different licence, and it lists Public Domain, MIT, GPL, Apache, MPL, OFL, CC BY, CC BY-SA, CC BY-NC (no commercial use) and a “Logo” licence for brand marks. Quality varies too. Great for one icon; tricky for a whole set.')}

${h3('2. Iconify and Icônes: the developer’s aggregator')}
${p(`Iconify gathers over 300,000 open source icons into one framework. Its icon-set browser listed 260 sets when we checked, and it shows each set’s licence right next to its name (Material Symbols Apache 2.0, Tabler MIT, Solar CC BY 4.0 and so on). Icônes, by Anthony Fu, is a fast explorer built on Iconify for searching and copying SVGs. It is the best SVG Repo alternative if you want huge choice with clearer licences. Our ${L.alt('iconify', 'Iconify alternative page')} compares it with with icons.`)}

${h3('3. Flaticon: millions of icons, PNG for free')}
${p(`Flaticon lists more than 18 million icons and stickers. Free users must credit the author and link to Flaticon, and free downloads are PNG; SVG comes with Premium, which also removes the credit. Our ${L.post('with-icons-vs-flaticon', 'with icons vs Flaticon')} post explains the credit rule in detail.`)}

${h3('4. Icons8: free with a link back')}
${p(`Icons8 lists over a million icons in many styles. Free use, even commercial, means linking to icons8.com wherever you use them. Its docs say free PNGs go up to 100px, and SVG is a paid format apart from a few free categories. The Icons plan is listed at $15 a month. See our ${L.alt('icons8', 'Icons8 alternative page')}.`)}

${h3('5. The Noun Project: free SVG, with a credit')}
${p(`The Noun Project lists 10 million icons “created and moderated by humans”. Free accounts can download PNG and SVG, but free icons are licensed CC BY 3.0, so you credit the creator. Noun Pro, from $3.33 a month billed yearly, removes the credit. More on our ${L.alt('noun-project', 'Noun Project alternative page')}.`)}

${h3('6. Font Awesome: the famous one')}
${p(`Font Awesome Free has over 2,000 icons, including brand logos. The free icons are CC BY 4.0, but the licence says the credit comments already inside the files are enough. Many styles and icons are Pro only, with paid plans from $48 a year. See ${L.post('with-icons-vs-font-awesome', 'with icons vs Font Awesome')}.`)}

${h3('7. Material Symbols: Google’s set')}
${p(`Over 2,500 icons in Outlined, Rounded and Sharp, as SVG, PNG or a variable font, under Apache 2.0. Google would love a credit in your app’s About screen, but it is not required. Ideal for Android apps. Compare it on our ${L.alt('material-symbols', 'Material Symbols alternative page')}.`)}

${h3('8. Lucide: clean outline icons')}
${p(`Lucide’s site listed 2,029 icons when we checked, in one tidy outline style, under ISC (MIT for icons that came from Feather). It is the default set in shadcn/ui, a React favourite. Our ${L.alt('lucide', 'Lucide alternative page')} goes deeper.`)}

${h3('9. Tabler Icons: the biggest free MIT set')}
${p(`Tabler’s README counts 6,257 free MIT icons: 5,203 outline and 1,054 filled, as SVG, PNG, PDF, EPS, a font and components for most frameworks. Read ${L.post('with-icons-vs-tabler-icons', 'with icons vs Tabler Icons')}.`)}

${h3('10. Phosphor: one icon, six weights')}
${p(`About 1,500 icons, each in Thin, Light, Regular, Bold, Fill and Duotone, under MIT. See our ${L.alt('phosphor', 'Phosphor alternative page')}.`)}

${h3('11. with icons: one set, many looks, no credit')}
${p(`Our own set: ${N_ICONS} everyday icons, each drawn once on a 24 × 24 grid and rendered into ${N_STYLES} styles, from plain line, solid and duo to glossy, glassy, pixel, kawaii and hand-drawn. That is ${N_SVGS} SVGs under MIT, with no credit and no account. Every icon page has SVG and PNG downloads and Copy SVG code.`)}
${styleRow('download', '', { styles: ['line', 'solid', 'duo', 'gloss', 'glass', 'sticker', 'pixel', 'sketch'] })}
${p('<strong>Where others win:</strong> we have far fewer icons than any marketplace or aggregator, and no brand logos. If you need a very specific object, look elsewhere first.')}

${h2('Is SVG Repo safe for commercial use?')}
${p('Usually yes, as long as you read the licence line on the icon’s own page. SVG Repo is honest about this: its licensing page says the default licence applies “unless in the single pages of icons” a different one is shown. So one search for “rocket” can hand you a CC0 icon (do anything), an MIT icon (keep the notice with the files), a CC BY icon (credit needed) and a CC BY-NC icon (no commercial use at all), side by side.')}
${p('Consistency suffers too: ten icons from ten sources often look patchy together. For a whole set, pick one family.')}
${p(`Our roundup of ${L.post('best-free-icon-libraries', 'the best free icon libraries')} compares the big open sets side by side, and ${L.post('free-icons-commercial-use', 'Can I use free icons commercially?')} explains each licence in plain English.`)}

${h2('How do you check an SVG icon’s licence in 30 seconds?')}
${steps([
  ['Find the licence on the icon’s own page', 'Look next to the download button, not only in the footer. On aggregators the footer licence is just the default.'],
  ['Match it to a simple rule', 'MIT, ISC, Apache 2.0 or CC0: use freely, no visible credit. CC BY or a marketplace free plan: plan a credit. Anything with “NC”: no commercial use.'],
  ['Check for a logo or trademark', 'Brand logos are trademarks. An open licence on the drawing does not let you use the brand however you like.'],
  ['Note the source', 'Write the site, icon name and licence in a small text file in your project.'],
])}
${callout('warn', 'A licence that says “NC” (non-commercial) means no business use: no client work, no company website, no product. These icons do turn up on aggregators, so the 30-second check really matters.')}

${h2('What makes a good SVG icon file?')}
${p('Two SVGs can look alike in a preview and behave very differently. Open the file in a text editor and look for three things:')}
${ul([
  '<strong>A viewBox.</strong> This is the drawing’s own coordinate box, like <code>viewBox="0 0 24 24"</code>. With it, the icon scales cleanly to any size. Without it, resizing can crop or squash the drawing.',
  '<strong>currentColor (or a few plain colours).</strong> An icon that uses <code>currentColor</code> takes the colour of the text around it, so one file works in light mode, dark mode and any brand colour.',
  '<strong>Only shapes and paths, no embedded picture.</strong> Some “SVGs” are really a PNG or JPEG wrapped in an SVG file (look for <code>&lt;image</code> or <code>base64</code>). They blur when scaled and weigh more.',
])}
${code(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
  <path d="..." />
</svg>`, 'html')}
${p(`That is the shape of every with icons line SVG: a 24 × 24 viewBox, currentColor and plain paths. More tips live in ${L.post('how-to-change-icon-color', 'how to change icon colour')}.`)}
${figure('svg5', 'Zoom right in on a PNG and you see pixels. A real SVG has no pixels to see, only shapes.')}
${p('A good file should also <strong>read well when small</strong>:')}
${sizeRamp(['search', 'download', 'image', 'shield-check'], [16, 20, 24, 32, 48], 'line', 'The same SVG files at 16, 20, 24, 32 and 48px. Crisp at every size, because there are no pixels inside.')}
${doDont('<p>Pick SVGs with a viewBox, currentColor and clean paths, from a source that states its licence on the icon page.</p>', '<p>Download an “SVG” that is really a photo inside a wrapper, or mix ten sources with ten different licences and line weights.</p>')}

${h2('Which site should you use for free SVG icons?')}
${ul([
  '<strong>One rare icon, free:</strong> SVG Repo or Iconify (check the icon’s licence).',
  '<strong>An illustrated or unusual idea:</strong> The Noun Project (free SVG with credit) or Flaticon (credit, PNG free).',
  '<strong>A big matching interface set, no credit:</strong> Tabler Icons, Lucide or Phosphor.',
  '<strong>An Android or Material Design app:</strong> Material Symbols.',
  '<strong>Brand logos:</strong> Font Awesome’s Brands set, used only to refer to that brand.',
  `<strong>One set for code, slides and docs in ${N_STYLES} looks, no credit:</strong> with icons.`,
])}
${iconGrid(['search', 'file-code', 'palette', 'layers', 'shield-check', 'download'], 'duo', 'Find it, check the file, pick a look, check the licence, download.')}
${p(`Ready to grab some? Our ${L.page('free/svg-icons.html', 'free SVG icons page')} has all ${N_ICONS} icons as SVG, ready to copy or download in one click. If you also need to know which sets need a credit, read ${L.post('free-icons-no-attribution', 'free icons with no attribution')}.`)}
${cta('Get free SVG icons now', `${N_ICONS} icons in ${N_STYLES} styles, ${N_SVGS} SVGs. viewBox, currentColor, MIT licensed. No sign-up, no credit.`, ['download', 'file-code', 'image', 'palette', 'sparkles', 'star'])}
`,
}
