import { p, h2, ul, figure, iconGrid, styleRow, table, yes, no, meh, verdict, callout, stats, cta, doDont, faceOff, rivalStyles, prosCons, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

const N_CREATIVE = N_STYLES - 3 // line, solid and duo are the interface styles
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
const word = n => WORDS[n] ?? String(n)
const PHOS_X = Math.round(1512 / N_ICONS) // Phosphor core 2.1.1 icons vs our count

export default {
  slug: 'with-icons-vs-phosphor',
  category: 'comparisons',
  date: '2026-10-02',
  hero: 'phos1',
  stickers: [['sliders', 'duo'], ['heart', 'gloss'], ['compass', 'blueprint']],
  title: `with icons vs Phosphor: 6 weights or ${N_STYLES} styles, which suits you?`,
  cardTitle: 'with icons vs Phosphor',
  h1: 'with icons vs Phosphor: <em>weights</em> or <em>styles</em>?',
  dek: 'Phosphor lets you turn the thickness of every icon up and down. with icons lets you change its whole personality. Both are free and MIT. Here is how to choose.',
  description: `with icons vs Phosphor, explained simply: six weights vs ${N_STYLES} styles, about 1,500 vs ${N_ICONS} icons, real icons side by side, pros and cons, and which to pick.`,
  keywords: ['with icons vs Phosphor', 'Phosphor icons alternative', 'Phosphor icons license', 'Phosphor duotone', 'Phosphor icons pros and cons', 'icon weights', 'free icon library'],
  about: ['Phosphor Icons', 'with icons', 'Icon library'],
  related: ['icon-styles-explained', 'with-icons-vs-hugeicons', 'best-free-icon-libraries'],
  tldr: [
    '<strong>Pick Phosphor</strong> if you want about 1,500 icons, each in six weights (Thin, Light, Regular, Bold, Fill, Duotone), and official packages for Flutter and SwiftUI as well as the web.',
    `<strong>Pick with icons</strong> if you want looks with more character: ${N_ICONS} icons in ${N_STYLES} styles, from plain line and solid to glossy, frosted glass, pixel art, retro and hand-drawn.`,
    'Both are free and MIT licensed, with no visible credit needed and no paid tier.',
    'Phosphor’s weights change how <em>thick</em> an icon is. with icons’ styles change how it <em>feels</em>. Both include a filled and a two-tone version.',
    'Phosphor has official Flutter, SwiftUI and Elm packages (React Native via the community). with icons adds an MCP server for AI tools and one-click PNG copies for slides.',
  ],
  faq: [
    { q: 'Is Phosphor free for commercial use?', a: 'Yes. Phosphor Icons are released under the MIT licence, so you can use them in commercial websites, apps and products. You do not need a visible credit; keep the licence notice if you redistribute the source code.' },
    { q: 'How many icons does Phosphor have?', a: 'About 1,500 icons, each in six weights. The official @phosphor-icons/core package (version 2.1.1) has 1,512 icons per weight, which is just over 9,000 SVG files in total. Its GitHub README still says 1,248, an older figure.' },
    { q: 'What are the six Phosphor weights?', a: 'Thin, Light, Regular, Bold, Fill and Duotone. The first four are outlines with different line thicknesses, Fill is a solid version, and Duotone pairs the shape with a lighter second tone.' },
    { q: 'What is the best Phosphor Icons alternative?', a: `It depends on why you are switching. If you want more looks per icon, with icons gives you ${N_ICONS} icons in ${N_STYLES} styles, including glossy, glass, pixel, retro and hand-drawn ones, under the same MIT licence. If you want a bigger single-style outline set, Lucide (over 1,600 icons, ISC licence) is a popular choice.` },
    { q: 'Is with icons duo the same as Phosphor duotone?', a: 'They are similar ideas. Both pair an icon with a softer second tone. with icons duo keeps the normal line drawing and places a soft tint behind it, so it sits naturally next to line icons.' },
    { q: 'Phosphor vs Lucide: which should I use?', a: 'Lucide has more icons (over 1,600) in one adjustable outline style and is the shadcn/ui default. Phosphor has about 1,500 icons in six weights, including fill and duotone, and official Flutter and SwiftUI packages. Both are free; Lucide is ISC, Phosphor is MIT.' },
  ],
  sources: [
    { title: 'Phosphor Icons website', url: 'https://phosphoricons.com' },
    { title: 'Phosphor homepage README (weights, ports, plugins)', url: 'https://github.com/phosphor-icons/homepage#readme' },
    { title: 'Phosphor licence (MIT)', url: 'https://raw.githubusercontent.com/phosphor-icons/homepage/master/LICENSE' },
    { title: '@phosphor-icons/core 2.1.1 (icon files per weight, used for the side-by-side icons)', url: 'https://unpkg.com/@phosphor-icons/core@2.1.1/' },
    { title: '@phosphor-icons/web README (CSS classes)', url: 'https://github.com/phosphor-icons/web#readme' },
    { title: 'Lucide README (icon count, ISC licence)', url: 'https://github.com/lucide-icons/lucide' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">Phosphor or ${L.icons('with icons')}: which should you use? Pick Phosphor if you need a big library (about 1,500 icons) with six line weights and official Flutter and SwiftUI packages. Pick with icons if you want ${N_ICONS} everyday icons in ${N_STYLES} styles with more personality, for your app, your website and your slides. Both are free and MIT licensed, so neither choice will cost you a penny.</span>`)}
${p('The two sets share a big idea: one icon should come in more than one look. They just disagree on what “look” means. Phosphor changes the <em>weight</em>, from a hairline to a bold stroke. with icons changes the <em>style</em>, from a plain outline to something glossy, carved or hand-drawn. Let’s look closer.')}

${h2('How do Phosphor and with icons compare?')}
${table(['', 'with icons', 'Phosphor'], [
  ['Price', yes('Free'), yes('Free')],
  ['Licence', yes('MIT, no visible credit'), yes('MIT, no visible credit')],
  ['Number of icons', `${N_ICONS} icons × ${N_STYLES} styles = ${N_SVGS} SVGs`, yes('About 1,500 icons × 6 weights, over 9,000 SVGs')],
  ['Variations', yes(`${N_STYLES} styles: line, solid and duo, plus ${N_CREATIVE} creative ones like glass, pixel, retro and luxe`), yes('6 weights: Thin, Light, Regular, Bold, Fill, Duotone')],
  ['Expressive, illustration-like looks', yes(`${N_CREATIVE} creative styles, from gloss and engrave to kawaii and plush`), no('No')],
  ['Web packages', yes('React, Vue, Svelte, Angular, Solid, web component'), yes('React, Vue, web components, web font')],
  ['Mobile and desktop', no('Not yet'), yes('Flutter and SwiftUI (official), React Native (community)')],
  ['Design tools', meh('SVG and PNG from every icon page'), yes('Figma, Sketch and Penpot plugins')],
  ['Help for AI assistants', yes('MCP server, llms.txt, agent skill'), no('None official found')],
], 'with icons and Phosphor, side by side (checked October 2026)')}

${h2('What do Phosphor and with icons icons look like side by side?')}
${p('Tables only tell half the story, so here are the real icons. Each pair shows our icon on top and Phosphor’s below, taken from Phosphor’s official core package (version 2.1.1). We matched our everyday line style with Phosphor’s Regular weight, because that is the look most people start with.')}
${faceOff('phosphor', { caption: 'with icons line vs Phosphor Regular, for 12 everyday ideas. Look at the names under each pair: Phosphor calls home <code>house</code>, search <code>magnifying-glass</code>, settings <code>gear</code> and mail <code>envelope</code>. Those are the ones to rename if you switch. Also notice that Phosphor Regular draws a slightly lighter line than our line style.' })}

${h2('What is Phosphor?')}
${p('Phosphor is a free, open-source icon family. Its README says the icons are designed at 16 × 16 pixels so they read well small and scale up big. The official core package has 1,512 icons, and every one of them comes in six weights:')}
${ul([
  '<strong>Thin, Light, Regular and Bold</strong>: the same outline drawn with thinner or thicker lines.',
  '<strong>Fill</strong>: a solid, filled-in version.',
  '<strong>Duotone</strong>: the shape with a lighter second tone, for a soft two-colour look.',
])}
${rivalStyles('phosphor', ['home', 'heart', 'star', 'bell'], 'Phosphor’s six weights for the same four icons. The first four rows only change line thickness; Fill and Duotone change how the shape is coloured in.')}
${p('That adds up to more than 9,000 SVG files. Phosphor also has official packages for React, Vue, web components and a web font with simple classes like <code>&lt;i class="ph ph-house"&gt;</code> (the house you see in the rows above), plus official libraries for Flutter, SwiftUI and Elm, and plugins for Figma, Sketch and Penpot. The community has made dozens more ports on top of that, including React Native, Svelte and Solid.')}

${h2('What is with icons?')}
${p(`with icons is a free set of ${N_ICONS} everyday icons, drawn by hand once each on a 24 × 24 grid. A program then renders every drawing into ${N_STYLES} styles. The first three (line, solid and duo) are for interfaces. The other ${N_CREATIVE} are for when an icon should feel more like an illustration: glossy, frosted glass, banknote engraving, 16-bit pixel art, 70s retro, felt plush and more. Each icon also comes with 20 to 30 hand-picked colour palettes for the colourful styles.`)}
${styleRow('heart')}
${p(`Compare that heart with Phosphor’s heart in the rows above: six thicknesses there, ${N_STYLES} personalities here.`)}
${stats([[String(N_ICONS), 'hand-drawn icons'], [String(N_STYLES), 'styles'], [N_SVGS, 'SVG files'], ['$0', 'no paid tier']])}

${h2('What is the difference between icon weights and icon styles?')}
${p('Think of a font. Weights are like Light, Regular and Bold: the same letters, thicker or thinner. Styles are more like switching from a clean sans-serif to a handwritten script: same words, totally different feeling.')}
${p('Phosphor’s weights are brilliant for matching icons to your text. If your headings are bold and your body copy is light, you can pick icons that sit perfectly next to both. It is a subtle, very designer-friendly tool.')}
${p(`with icons’ styles are for changing the mood of a page. ${L.style('blueprint')} makes a feature list feel technical. ${L.style('sketch')} makes a lesson feel friendly. ${L.style('gloss')} makes a pricing card feel premium. Phosphor does not try to do this; with icons does.`)}
${iconGrid(['cpu', 'server', 'database', 'webhook', 'git-branch', 'shield'], 'blueprint', 'A technical feature list in the blueprint style. Thicker or thinner lines could not create this feeling.')}

${h2('Which with icons style matches each Phosphor weight?')}
${p(`Where the two sets overlap, they map quite neatly: all six Phosphor weights land on our three interface styles. Our ${N_CREATIVE} creative styles have no Phosphor equivalent at all, so we grouped them by feel. This is handy if you are moving from one to the other:`)}
${table(['Phosphor weight', 'Closest with icons style', 'Good for'], [
  ['Thin, Light, Regular, Bold', 'Line (1.75px outline; the stroke width can be adjusted in the components)', 'Buttons, menus, everyday interface'],
  ['Fill', 'Solid', 'Active tabs, small sizes, emphasis'],
  ['Duotone', 'Duo (line over a soft tint)', 'Friendly dashboards, cards, empty states'],
  ['No equivalent', 'Gloss, glass, luxe, skeuo (polished and 3D)', 'Pricing cards, premium hero sections, product pages'],
  ['No equivalent', 'Engrave, blueprint, sketch (drawn by hand or on the drafting table)', 'Feature lists, lessons, posters, illustrations'],
  ['No equivalent', 'Pixel, retro, bauhaus, sticker (bold and graphic)', 'Games, playful brands, social posts'],
  ['No equivalent', 'Kawaii, plush, pastel, coquette, anime, gothic (full of character)', 'Kids’ products, lifestyle brands, themed campaigns'],
], 'Phosphor weights and their closest with icons styles')}
${faceOff('phosphor', { variant: 'fill', ourStyle: 'solid', concepts: ['home', 'bell', 'heart', 'star', 'user', 'calendar'], caption: 'with icons solid vs Phosphor Fill. Both are filled shapes that stay readable at small sizes, which is why apps use them for the tab you are on.' })}
${p(`The other place the two sets meet is two-tone icons. Phosphor’s Duotone and our ${L.style('duo')} both add a softer second tone to the shape. Ours keeps the normal line drawing and puts a gentle tint behind it, so a duo icon can sit right next to a line icon without looking out of place. Both are great for dashboards, cards and empty states, where plain outlines can feel a bit cold.`)}
${faceOff('phosphor', { variant: 'duotone', ourStyle: 'duo', concepts: ['home', 'bell', 'heart', 'star', 'mail', 'shopping-cart'], caption: 'with icons duo vs Phosphor Duotone. Notice how the soft tone sits inside each shape: a quick way to add warmth to plain outlines.' })}
${callout('tip', `Our ${L.alt('phosphor', 'Phosphor alternative page')} has the full name map (Phosphor’s <code>house</code> is our home, <code>gear</code> is settings, <code>list</code> is menu) and a converter for the <code>ph</code> classes.`)}

${h2('Is Phosphor free for commercial use?')}
${p('Yes. Phosphor uses the <strong>MIT licence</strong>, and so does with icons. In plain words: use the icons in your website, app, client work or a product you sell, and you never need to show a credit. If you share the source files themselves, keep the short licence notice with them.')}
${p(`Neither set has a Pro tier, so there is no “this weight is paid” surprise. That puts these two in a small, friendly club. Our ${L.post('free-icons-commercial-use', 'guide to free icons for commercial use')} explains how this compares with other licences.`)}

${h2('Is Phosphor or with icons better for presentations?')}
${figure('phos0', 'Wireframes, decks and diagrams all need icons that read clearly from across a room.')}
${p('Phosphor works well in slides: the Bold and Fill weights are easy to see on a projector, and Duotone adds a gentle splash of colour. If you design in Figma, Sketch or Penpot, the plugins make it quick.')}
${p(`with icons makes slides its home turf. Every icon page has <strong>Copy image</strong>, so you can paste an icon straight into ${L.guide('google-slides', 'Google Slides')}, ${L.guide('powerpoint', 'PowerPoint')} or ${L.guide('canva', 'Canva')}, plus PNG and SVG downloads in any colour and size. And the expressive styles are made exactly for big, on-screen moments.`)}
${iconGrid(['target', 'trending-up', 'users', 'lightbulb', 'trophy', 'rocket'], 'gloss', 'A strategy slide in the gloss style. Copy any icon as an image and paste it straight in.')}
${doDont('<p>Use one style per slide, and keep a single style for the whole deck where you can.</p>', '<p>Mix thin outlines, chunky fills and glossy icons on the same slide. Even with one icon family, too many looks at once feels messy.</p>')}

${h2('Can I use Phosphor or with icons in mobile apps?')}
${p('This is a clear Phosphor win. It has official packages for Flutter and SwiftUI, and community ports for React Native and many more, so you can use the same icons in a web app, an iPhone app and a Flutter app.')}
${p(`with icons focuses on the web: React, Vue, Svelte, Angular and Solid components, a web component and plain CSS classes, all on npm and the jsDelivr CDN. You can still use our SVGs in any app, but you will not find a ready-made Flutter or Swift package. See the ${L.page('developers.html', 'developer page')} for the install lines.`)}

${h2('What are the pros and cons of Phosphor and with icons?')}
${p('Both sets are good, honest projects, and neither is perfect. Here is what each does well and what to keep in mind, in plain words.')}
${prosCons('Phosphor', {
  lib: 'phosphor',
  pros: [
    ['A big library', `About 1,500 icons, so you will rarely hit a gap. That is roughly ${word(PHOS_X)} times as many ideas as with icons covers.`],
    ['Six weights for every icon', 'You can match icons to your fonts: thin icons next to light text, bold icons next to bold headings. Every icon has all six.'],
    ['Made for small screens', 'Phosphor designs its icons at 16 × 16 pixels, so they stay crisp in tight spots like toolbars and menus.'],
    ['Works beyond the web', 'Official packages for Flutter, SwiftUI and Elm mean one icon family can cover your website and your phone apps.'],
    ['Friendly for designers', 'Official Figma, Sketch and Penpot plugins put the icons right where design teams already work.'],
  ],
  cons: [
    ['One personality', 'The weights change thickness, not mood. There is no glossy, carved or hand-drawn version for a hero section or a poster.'],
    ['Some ports are community-made', 'React Native, Svelte and Solid rely on community packages, which can lag behind the official ones.'],
    ['Lots of choice to agree on', 'Six weights are great, but a team has to pick one and stick to it, or screens can end up looking uneven.'],
    ['No official AI help found', 'When we checked, there was no official MCP server or llms.txt, so AI assistants may guess icon names.'],
  ],
})}
${prosCons('with icons', {
  pros: [
    [`${N_STYLES} styles from one drawing`, `Line, solid and duo for apps, plus ${N_CREATIVE} creative styles like gloss, glass, pixel, retro and luxe for slides and landing pages. They all match because they share one drawing.`],
    ['Made for non-coders too', 'Every icon page has Copy image, PNG downloads in any size and colour, and SVG downloads. Paste straight into slides or docs.'],
    ['Free with no catches', 'MIT licence, no credit needed and no paid tier, just like Phosphor.'],
    ['Easy to search', 'Search understands everyday words, so “bin” finds trash and “gear” finds settings.'],
    ['Ready for AI assistants', 'An MCP server, llms.txt and an agent skill let AI tools pick real icon names instead of guessing.'],
  ],
  cons: [
    ['A smaller catalogue', `There are ${N_ICONS} icons and no brand logos. If you need rare or niche icons, Phosphor will have more of them.`],
    ['Web only', 'The packages cover React, Vue, Svelte, Angular, Solid and a web component, but there are no Flutter or SwiftUI packages. For native apps you use the SVG files.'],
    ['Newer, with a smaller community', 'with icons is a young project, so you will find fewer tutorials, ports and forum answers than for Phosphor.'],
    ['Creative styles need room', 'Gloss, glass, engrave and the other creative styles are made for 32px and larger. For tiny interface icons, stick to line, solid or duo.'],
  ],
})}
${p(`Who suits which? Phosphor suits product teams who need lots of icons, careful control over line thickness and native apps on phones. with icons suits people who make apps <em>and</em> slides, websites and docs, and who want one family that can be calm in the interface and bold on the homepage. If you work with AI assistants, our ${L.page('ai.html', 'MCP server')} is a nice bonus.`)}

${verdict({
  a: ['with icons', ['You want styles with character: gloss, glass, pixel, retro, sketch and more.', 'You want one family for your app, website and presentations.', 'You make slides and want one-click PNG copies.', 'You use AI assistants and want them to find real icon names.']],
  b: ['Phosphor', ['You need about 1,500 icons with six weights each.', 'You want to match icon thickness to your fonts.', 'You build native apps with Flutter or SwiftUI.']],
})}

${h2('So, Phosphor or with icons?')}
${p(`Phosphor and with icons are both generous, free and MIT licensed, and both give you more than one look per icon. Phosphor tunes the weight, with icons changes the whole style. Big catalogue and native apps? Phosphor. A smaller set that can be calm in your app and bold on your homepage? with icons. To see how other sets handle styles, read ${L.post('icon-styles-explained', 'icon styles explained')} or ${L.post('with-icons-vs-hugeicons', 'with icons vs Hugeicons')}.`)}
${cta('Find your favourite style', `${N_ICONS} free icons in ${N_STYLES} styles. Switch the look in one click and copy a PNG or SVG into your app, site or slide.`, ['heart', 'compass', 'sliders', 'palette', 'sparkles', 'star'])}
`,
}
