import { p, h2, h3, ul, figure, iconGrid, motionGrid, styleRow, sizeRamp, table, yes, no, meh, callout, steps, stats, doDont, cta, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

const DEPTH = ['soft3d', 'clay', 'gloss', 'glass', 'liquid', 'chrome', 'skeuo', 'luxe']

export default {
  slug: 'free-3d-icons',
  category: 'comparisons',
  date: '2026-11-06',
  hero: 'h-free-3d-icons',
  stickers: [['rocket', 'soft3d'], ['gift', 'clay'], ['gem', 'chrome']],
  title: 'Free 3D icons: where to get them, and which kind to choose',
  cardTitle: 'Where to get free 3D icons',
  h1: 'Free 3D icons: where to get them, and <em>which kind</em> to choose',
  dek: 'Rendered PNG packs, marketplace downloads or 3D-look vector icons? Here is what each kind is good at, where to find free ones, and what the licences ask of you.',
  description: 'Where to get free 3D icons in 2026: 3dicons, Fluent Emoji, IconScout, Icons8, Flaticon and vector 3D SVG styles compared on licence, credit, formats and size.',
  keywords: ['free 3d icons', '3d icon pack', '3d icons png', '3d icons svg', 'free 3d icon pack', '3d icons for website', '3d icons for presentation', 'clay icons', 'soft 3d icons', 'glass icons'],
  about: ['3D computer graphics', 'Icon design', 'Rendering (computer graphics)', 'Scalable Vector Graphics', 'Portable Network Graphics'],
  related: ['3d-icons-vs-flat-icons', 'icon-styles-explained', 'icons-on-landing-pages'],
  tldr: [
    '<strong>There are three kinds of 3D icon:</strong> rendered PNG packs made in 3D software, marketplace downloads from many artists, and vector icons drawn to look 3D (SVG).',
    '<strong>Best free renders with no credit:</strong> 3dicons (CC0, made in Blender) and Microsoft’s Fluent Emoji, whose 3D versions are MIT-licensed PNGs. <strong>Most choice:</strong> IconScout (901K+ 3D assets), but free ones need a credit.',
    '<strong>PNG renders look the most real</strong> but are heavy (a 3dicons master is 2,400 px and about 2 MB) and cannot be recoloured without the 3D source file.',
    `<strong>Vector 3D styles</strong> stay sharp at any size, weigh a few kilobytes and recolour with palettes. with icons has ${N_ICONS} icons in soft 3D, clay, gloss, glass, liquid, chrome, skeuo and luxe, MIT, no credit.`,
    '<strong>Use 3D at 48 px and up</strong>: slides, landing page heroes, onboarding and empty states. Keep flat icons for buttons, menus and anything at 16 to 24 px.',
  ],
  faq: [
    { q: 'Where can I get free 3D icons?', a: `For free renders with no credit, try 3dicons (CC0) and Microsoft’s Fluent Emoji on GitHub (MIT). For the most choice, IconScout, Icons8 and Flaticon have large free collections that ask for a credit or link. For 3D-look icons as SVG and PNG with no credit, with icons has ${N_ICONS} icons in eight 3D-look styles.` },
    { q: 'Are free 3D icons free for commercial use?', a: 'Usually yes, but the conditions differ. 3dicons (CC0), Fluent Emoji (MIT) and with icons (MIT) need no credit. IconScout and Freepik (now called Magnific) ask for attribution on free assets, Flaticon asks you to credit the author, and Icons8 asks for a link to icons8.com. Paid plans remove those requirements.' },
    { q: 'Can I get 3D icons as SVG?', a: 'True 3D renders are pictures (PNG), not vectors, so they do not come as real SVGs. Vector 3D-look icons, like the soft 3D, clay and glass styles in with icons, are drawn with shapes and gradients, so they are real SVGs that stay sharp at any size and can be recoloured.' },
    { q: 'What size should 3D icons be?', a: 'Use them at about 48 px or larger, where highlights and shadows can be seen. At 16 to 24 px, in buttons and menus, the detail turns to blur, so use flat line or solid icons there.' },
    { q: 'Can I change the colours of a 3D icon?', a: 'With a PNG render, only if you have the 3D source (a Blender or glTF file) and re-render it, or use an editor like IconScout’s. Vector 3D styles are easier: in with icons you pick a palette and every layer and gradient follows, and on a website each colour is a CSS variable.' },
  ],
  sources: [
    { title: '3dicons homepage (licence, count)', url: 'https://3dicons.co' },
    { title: '3dicons: About (made in Blender, CC0)', url: 'https://3dicons.co/about' },
    { title: 'Wikimedia Commons: 3dicons.co 3D icons (file sizes)', url: 'https://commons.wikimedia.org/wiki/Category:3dicons.co_3d_icons' },
    { title: 'microsoft/fluentui-emoji (MIT licence)', url: 'https://github.com/microsoft/fluentui-emoji' },
    { title: 'IconScout: free 3D icons (formats, attribution)', url: 'https://iconscout.com/free-3d-icons' },
    { title: 'IconScout pricing (3D asset count, formats)', url: 'https://iconscout.com/pricing' },
    { title: 'Icons8: 3D Fluency icons', url: 'https://icons8.com/icons/3d-fluency' },
    { title: 'Icons8 licence', url: 'https://icons8.com/license' },
    { title: 'Flaticon: 3D icons', url: 'https://www.flaticon.com/free-icons/3d' },
    { title: 'Flaticon pricing', url: 'https://www.flaticon.com/pricing' },
    { title: 'Freepik (now Magnific): free 3D models and licence notes', url: 'https://www.freepik.com/3d-models' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">You can get free 3D icons from three kinds of place: rendered PNG packs made in 3D software (like 3dicons), big marketplaces (IconScout, Icons8, Flaticon, Freepik) and vector icon sets drawn to look 3D (like the soft 3D and clay styles in with icons). Renders look the most real, marketplaces have the most choice, and vector styles are the lightest and easiest to recolour.</span>`)}
${p(`This guide explains the three kinds in plain words, compares the best free sources in one table, and shows where 3D icons work and where they do not. If you are still choosing between 3D and flat, read ${L.post('3d-icons-vs-flat-icons', '3D icons vs flat icons')} first.`)}
${callout('note', `We make ${L.icons('with icons')}, one of the sources below. We say where others are better. Every competitor fact comes from the source’s own website or GitHub page, checked in November 2026.`, 'Who wrote this')}

${h2('What are the three kinds of 3D icon?')}
${h3('1. Rendered PNG packs')}
${p('An artist builds each icon as a real 3D model in software like Blender, lights it, and “renders” it into a picture: a PNG file with a see-through background. The result can look like a real toy or object on a desk. The best free example is <strong>3dicons</strong> by Vijay Verma, made in Blender and released under CC0, which means you can use it for anything with no credit at all. Microsoft’s <strong>Fluent Emoji</strong> are another gem: an MIT-licensed emoji set on GitHub with a 3D version of each emoji as a 256 px PNG.')}

${h3('2. Marketplace downloads')}
${p('Marketplaces gather 3D icons from many artists. You get huge choice, often with the 3D source files too, but free downloads usually come with a credit or link requirement, and icons from different artists rarely match. <strong>IconScout</strong> lists 901K+ 3D assets in PNG, Blender, OBJ, Cinema 4D and glTF formats. <strong>Icons8</strong> has a 3D Fluency set of 2,200 icons. <strong>Flaticon</strong> and <strong>Freepik</strong> (which now calls itself Magnific) carry 3D-look icons and 3D models too.')}

${h3('3. Vector 3D-look icons')}
${p(`The third kind is not rendered at all. Each icon is a stack of flat vector shapes and gradients, drawn so it reads as 3D: a highlight here, a shadow there, a soft rounded edge. Because it is an SVG (a picture made of shapes), it stays sharp at any size, weighs a few kilobytes and can change colour. This is how the with icons depth styles work: ${L.style('soft3d', 'soft 3D')}, ${L.style('clay', 'clay')}, ${L.style('gloss', 'gloss')}, ${L.style('glass', 'glass')}, ${L.style('liquid', 'liquid')}, ${L.style('chrome', 'chrome')}, ${L.style('skeuo', 'skeuo')} and ${L.style('luxe', 'luxe')}.`)}
${styleRow('rocket', `One ${L.icon('rocket')} drawing in eight 3D-look styles: soft 3D, clay, gloss, glass, liquid, chrome, skeuo and luxe. All are SVG, all are free.`, { styles: DEPTH, size: 56 })}

${h2('Where can you get free 3D icons?')}
${table(['Source', 'Kind', 'Free licence', 'Credit?', 'Formats and sizes', 'Recolour?'], [
  ['<strong>3dicons</strong>', 'Rendered pack (Blender)', 'CC0', yes('No'), 'PNG renders, 2,400 px masters, in a few angles and finishes', meh('Pick a finish')],
  ['<strong>Fluent Emoji</strong> (Microsoft)', 'Rendered emoji', 'MIT', yes('No'), '3D PNG at 256 px (plus flat SVG versions)', no()],
  ['<strong>IconScout</strong>', 'Marketplace', 'Free licence, commercial use', no('Yes'), 'PNG, Blender and glTF on free assets', meh('Many, in its glTF editor')],
  ['<strong>Icons8</strong> 3D Fluency', 'Rendered set', 'Icons8 free licence', no('Link to icons8.com'), 'PNG up to 100 px on the free plan', no()],
  ['<strong>Flaticon</strong>', 'Marketplace (many artists)', 'Flaticon licence', no('Credit the author'), 'PNG free; SVG with Premium', meh('Premium SVG only')],
  ['<strong>Freepik</strong> (Magnific)', 'Marketplace', 'Freepik free licence', no('Yes'), 'Images and 3D models (glTF, OBJ, FBX)', meh('With the source')],
  ['<strong>with icons</strong>', 'Vector 3D-look styles', 'MIT', yes('No'), 'SVG and transparent PNG, any size', yes('Palettes and CSS variables')],
], 'Free 3D icon sources compared (checked November 2026). Paid plans on IconScout, Icons8, Flaticon and Freepik remove the credit.')}
${p(`<strong>Best pick per job:</strong> for a realistic hero image at no cost and no credit, 3dicons. For emoji-style faces, food and objects, Fluent Emoji. For a rare subject, IconScout, and accept the credit (or pay). For a matching set you can recolour and use in code, slides and docs, a vector style like ${L.style('soft3d', 'soft 3D')} or ${L.style('clay', 'clay')}. If credit lines are new to you, our guide to ${L.post('free-icons-commercial-use', 'using free icons commercially')} explains them.`)}

${h2('3D icons PNG or SVG: which should you download?')}
${p('A PNG render has the most realistic light, but it is a fixed grid of pixels. Make it bigger than it was rendered and it blurs. Change your brand colour and you need a new render. And it is heavy: the 3dicons masters on Wikimedia Commons are 2,400 px squares of about 2 MB each, so you will want to shrink them before they go on a web page.')}
${p(`A vector 3D-look icon is the opposite. It is sharp at 24 px and at 2,400 px, and the with icons depth styles weigh roughly 1.5 to 10 KB each before compression. You can also export any of them as a PNG for slides. Our ${L.post('svg-vs-png-icons', 'SVG vs PNG guide')} goes deeper.`)}
${stats([['2,400 px', 'a 3dicons PNG master'], ['~2 MB', 'that one PNG file'], ['1.5 to 10 KB', 'a with icons 3D-look SVG'], ['Any size', 'the SVG stays sharp']])}

${h2('Where do 3D icons work best?')}
${p('3D icons are made to be looked at, not clicked. They shine wherever an icon is big and has a moment to itself:')}
${ul([
  `<strong>Slides and pitch decks.</strong> One 3D icon per idea, at 96 px or more, makes a slide feel finished. Our ${L.post('icons-in-presentations', 'icons in presentations')} post and ${L.guide('powerpoint', 'PowerPoint guide')} show how.`,
  `<strong>Landing page heroes and feature grids.</strong> Three to six 3D icons over a short line of text each. More in ${L.post('icons-on-landing-pages', 'icons on landing pages')}.`,
  '<strong>Onboarding and empty states.</strong> A friendly 3D object says “nothing here yet” more warmly than a grey outline.',
  '<strong>App store screens, social posts and launch graphics.</strong> Places where people scroll fast and a bit of depth stops the thumb.',
])}
${iconGrid(['rocket', 'shield-check', 'zap', 'users', 'trending-up', 'gift'], 'soft3d', 'A landing page feature row in the soft 3D style: launch, security, speed, team, growth and rewards.', { size: 56 })}
${motionGrid(['rocket', 'trophy', 'gift', 'star'], 'clay', 'Clay icons for an onboarding screen. Hover or tap one: every with icons icon has its own motion, in the 3D-look styles too.', { size: 56, trigger: 'hover' })}

${h2('Where do 3D icons not work?')}
${p('The same detail that looks rich at 64 px turns into mush at 16 px. Highlights, shadows and soft edges need room. Look at what happens as these icons shrink:')}
${sizeRamp(['home', 'search', 'bell'], [16, 24, 32, 48, 64], 'soft3d', 'Soft 3D icons from 16 to 64 px. Above 48 px they read as objects; at 16 and 24 px the depth is just noise.')}
${doDont(`<p>Use flat ${L.style('line', 'line')} or ${L.style('solid', 'solid')} icons for navigation, buttons, tables and forms, and save one 3D style for the big moments.</p>`, '<p>Put 3D icons in a tab bar or a dense settings list. They fight the text, blur at small sizes and make the screen feel busy.</p>')}
${p('Mixing kinds is another trap. A Blender render next to a vector clay icon next to an emoji will look like three different products. Pick one source for each page.')}

${h2('How do you get free 3D icons from with icons?')}
${steps([
  ['Pick a 3D look', `Start on the ${L.page('free/soft-3d-icons.html', 'free soft 3D icons')} page, the ${L.page('free/clay-icons.html', 'free clay icons')} page, or the premium layered ${L.page('free/3d-icons.html', 'free 3D icons')} page.`],
  ['Find your icon', `Search ${L.icons(`all ${N_ICONS} icons`)} with everyday words: “bin” finds trash, “gear” finds settings.`],
  ['Choose a palette', 'Each icon has 20 to 30 hand-picked palettes that recolour every layer and gradient. Match your brand in one click.'],
  ['Download or copy', 'Transparent PNG for slides and docs, SVG for Figma, Canva and websites, or Copy image to paste straight in.'],
])}
${figure('xd31', 'Depth is a seasoning. One 3D style, used for the big moments, does more than ten mixed packs.')}

${h2('What are the downsides of vector 3D icons?')}
${p(`Honesty time. Vector 3D-look icons are not real 3D models, so you cannot spin them in Blender, light them differently or drop them into a 3D scene. A skilled render still looks more physical. And with ${N_ICONS} icons, our set is far smaller than the hundreds of thousands of 3D assets on IconScout. There are no brand logos either. What you get in return: ${N_SVGS} SVGs that match, recolour, stay sharp and need no credit.`)}
${cta('Free 3D-look icons, no credit', `${N_ICONS} icons in soft 3D, clay, glass, chrome and more, out of ${N_STYLES} styles. SVG and PNG, MIT licensed, no sign-up.`, ['rocket', 'gift', 'gem', 'trophy', 'star', 'sparkles'])}
`,
}
