import { p, h2, h3, ul, figure, iconGrid, styleRow, sizeRamp, table, yes, no, meh, callout, steps, cta, doDont, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'icons-in-presentations',
  category: 'guides',
  date: '2026-10-02',
  hero: 'slides2',
  stickers: [['chart-bar', 'gloss'], ['lightbulb', 'duo'], ['target', 'sketch']],
  title: 'How to use icons in PowerPoint, Google Slides and Keynote',
  cardTitle: 'Icons in PowerPoint, Slides and Keynote',
  h1: 'How to use icons in PowerPoint, Google Slides and Keynote (so your slides look <em>pro</em>)',
  dek: 'A few well-chosen icons can make a plain deck look designed. Here is which file to download for each app, how to recolour and line them up, and the simple layouts presenters use again and again.',
  description: 'Add icons to PowerPoint, Google Slides and Keynote the right way: SVG or PNG, recolouring, sizing, alignment and simple layouts that make slides look professional.',
  keywords: ['icons in PowerPoint', 'icons for Google Slides', 'Keynote icons', 'free icons for presentations', 'recolor SVG PowerPoint', 'presentation icons'],
  about: ['Microsoft PowerPoint', 'Google Slides', 'Apple Keynote', 'Icons'],
  related: ['icon-styles-explained', 'svg-vs-png-icons', 'consistent-icons'],
  tldr: [
    '<strong>PowerPoint:</strong> use the SVG file. It stays sharp at any size and you can recolour it with Graphics Fill (and Graphics Outline for line icons).',
    '<strong>Google Slides:</strong> use a PNG. Google Slides accepts PNG, JPEG and GIF images, not SVG, so download a 512 px PNG in the colour you want.',
    '<strong>Keynote:</strong> recent versions (13.1 and later) accept SVG. On older versions, a 1024 px PNG works everywhere.',
    'Use <strong>one icon style per deck</strong>, keep every icon the same size, and line them up with the Align and Distribute tools.',
    'The layout that never fails: <strong>icon + three-word label</strong>, in rows of three or four.',
  ],
  faq: [
    { q: 'Can I put SVG icons in Google Slides?', a: 'Not directly. Google Slides accepts PNG, JPEG and GIF images. Download the PNG version of the icon instead (512 px is a good size) and pick its colour before you download, because Slides can only tint images, not truly recolour them.' },
    { q: 'How do I change the colour of an icon in PowerPoint?', a: 'Insert the icon as an SVG, select it, open the Graphics Format tab and choose Graphics Fill. Line icons are drawn with outlines, so if the colour does not change, use Graphics Outline too. On Windows you can also choose Convert to Shape and colour each piece separately.' },
    { q: 'What size should icons be on a slide?', a: 'Big enough to see from the back of the room, small enough not to compete with your words. As a rule of thumb, feature icons look good at roughly one and a half to two times the height of your heading text, and every icon on a slide should be exactly the same size.' },
    { q: 'Are free icons OK for business presentations?', a: 'Usually, yes, but check the licence. with icons uses the MIT licence, so you can use the icons in client and company decks without adding a credit. Some free sites ask for a credit on the slide or a final credits slide.' },
    { q: 'Why do my icons look blurry on the projector?', a: 'You probably used a small PNG and stretched it. Use an SVG where your app supports it, or download a bigger PNG (512 or 1024 px) and scale it down rather than up.' },
  ],
  sources: [
    { title: 'Microsoft Support: Edit SVG images in Microsoft 365 (supported versions, Graphics Fill, Convert to Shape)', url: 'https://support.microsoft.com/en-us/office/edit-svg-images-in-microsoft-office-69f29d39-194a-4072-8c35-dbe5e7ea528c' },
    { title: 'Google for Developers: Add images to a slide (supported image formats)', url: 'https://developers.google.com/workspace/slides/api/guides/add-image' },
    { title: 'Apple Support: What’s new in Keynote on Mac (SVG support from Keynote 13.1)', url: 'https://support.apple.com/guide/keynote/whats-new-tan700f60676/mac' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">Want icons in your slides without the clip-art look? The short answer: download icons as <strong>SVG</strong> for PowerPoint and recent Keynote, as <strong>PNG</strong> for Google Slides, use <strong>one style</strong> for the whole deck, keep them <strong>one size</strong>, and pair each one with a <strong>short label</strong>. That is honestly most of it.</span>`)}
${p(`The rest of this guide shows you how, app by app, plus the handful of layouts that presenters use again and again. Our examples use ${L.icons('with icons')} (free and MIT licensed), but the advice works with any good icon set.`)}

${h2('Why use icons in slides at all?')}
${p('Icons are little signposts. On a busy slide they help people see the structure before they read a single word: three icons in a row means “three ideas”.')}
${p('But icons only help when they are <strong>quiet and consistent</strong>. Five different drawing styles, random colours and an icon on every line will make a deck look cheaper, not better. Keep that in mind and you are already ahead of most presentations.')}
${iconGrid(['target', 'users', 'chart-line', 'lightbulb', 'calendar-check', 'rocket'], 'line', 'Six icons that turn up in almost every business deck: goals, team, growth, ideas, timeline and launch.')}

${h2('Where can you get free icons for presentations?')}
${p(`You have three common options: the icons built into your app (PowerPoint has an Insert Icons button on Microsoft 365), a big marketplace such as Flaticon or Icons8, or an open icon library. Marketplaces have huge choice but their free plans usually ask for a credit or a link back. Open libraries like with icons are smaller but free to use without credit.`)}
${p(`On every with icons ${L.icon('rocket', 'icon page')} you get four buttons: <strong>Copy image</strong> (paste straight into a slide), <strong>PNG download</strong> (you pick the size and colour), <strong>SVG download</strong>, and <strong>Copy SVG code</strong>. Not sure what you are allowed to do with free icons at work? Our plain-English guide ${L.post('free-icons-commercial-use', 'Can I use free icons commercially?')} covers it.`)}

${h2('Copy image, PNG or SVG: which should you pick?')}
${p('This is the question that trips most people up, so here is the simple version. A <strong>PNG</strong> is a picture made of tiny squares (pixels). It works everywhere, but it goes blurry if you stretch it bigger than it was saved. An <strong>SVG</strong> is a picture made of shapes, so it stays sharp at any size and some apps let you change its colour later. <strong>Copy image</strong> puts a PNG on your clipboard, so it is the fastest option for a quick slide.')}
${table(['', 'Best file', 'Can you recolour it in the app?', 'Notes'], [
  ['PowerPoint (Microsoft 365, 2019 and newer)', yes('SVG'), yes('Yes, Graphics Fill'), 'Older versions: use a 512 px PNG'],
  ['Google Slides', meh('PNG, 512 px'), meh('Tints only (Recolor)'), 'SVG files are not accepted'],
  ['Keynote 13.1 and newer', yes('SVG'), meh('Partly, after Break Apart'), 'Older versions: 1024 px PNG'],
  ['Canva', yes('SVG'), yes('Yes, from the toolbar'), 'PNG works too, but cannot be recoloured'],
], 'The best icon file for each presentation app (checked October 2026)')}
${callout('tip', 'Whatever app you use, choosing the colour <em>before</em> you download is the cleanest trick. On with icons you can set any colour, including your brand hex code, and every PNG and SVG comes out in that colour.')}

${h2('How do you add icons to PowerPoint?')}
${p(`PowerPoint is the friendliest app for icons, because it understands SVG. Microsoft says SVG files can be inserted and edited in PowerPoint for Microsoft 365, and in PowerPoint 2019, 2021 and 2024. Here is the routine (our ${L.guide('powerpoint', 'PowerPoint guide')} has pictures of every step):`)}
${steps([
  ['Download the SVG', `Find your icon in ${L.icons('the library')}, pick a style and click SVG download.`],
  ['Insert it', 'In PowerPoint choose Insert, then Pictures, then This Device (on a Mac: Picture from File) and pick the file.'],
  ['Recolour it', 'Select the icon, open the Graphics Format tab and choose Graphics Fill. Line icons are drawn with outlines, so use Graphics Outline if the colour does not change.'],
  ['Size it', 'Type an exact Height on the Graphics Format tab so every icon matches. An SVG never gets blurry, however big you make it.'],
])}
${h3('What does “Convert to Shape” do?')}
${p('On the same Graphics Format tab there is a <strong>Convert to Shape</strong> button. It turns the icon into ordinary PowerPoint shapes, so you can colour each part on its own or delete a piece you do not need. According to Microsoft, this option is only available in PowerPoint for Windows, not on the Mac or mobile apps. Usually one colour for the whole icon looks cleaner anyway.')}
${callout('warn', 'Graphics Fill paints the whole icon one colour. That is perfect for line and solid icons, but it flattens the shading of multi-colour styles like gloss, glass, luxe or sticker. For those, pick the colours (or one of the icon’s hand-picked palettes) on the icon page before downloading.')}

${h2('Can you use SVG icons in Google Slides?')}
${p(`Not at the moment. Google Slides accepts PNG, JPEG and GIF images, and Google’s own developer documentation lists only those three formats. If you try to upload an SVG it is simply refused. The fix is easy: use a PNG with a see-through background.`)}
${steps([
  ['Pick the colour first', 'On the icon page, set the colour you want (your theme’s accent colour is a safe choice).'],
  ['Download a 512 px PNG', 'That size stays crisp even if the icon fills a big part of the slide. Going full-screen? Choose 1024 px.'],
  ['Insert it', 'In Slides choose Insert, then Image, then Upload from computer. Or click Copy image on the icon page and paste with Ctrl+V (⌘+V on a Mac).'],
])}
${p(`Google Slides does have a <strong>Recolor</strong> option under Format options, but it only offers a few preset tints based on your theme. It is fine in a pinch; choosing the colour on the icon page is better. The full walkthrough is in our ${L.guide('google-slides', 'Google Slides guide')}.`)}

${h2('How do you add icons to Keynote?')}
${p(`Good news for Mac users: Apple added SVG support in <strong>Keynote 13.1</strong>. You can place an SVG on a slide and it keeps its quality at any size. Apple also lets you <strong>break apart</strong> an imported SVG into shapes and save them to your shapes library, which is handy for icons you use in every deck.`)}
${p(`If you are on an older version, or the icon looks odd, use a 1024 px PNG instead: drag it from Finder onto the slide and resize it. Our ${L.guide('keynote', 'Keynote guide')} covers both. Making slides in Canva? It accepts SVG uploads and lets you recolour them from the toolbar; see the ${L.guide('canva', 'Canva guide')}.`)}
${figure('slides5', 'Slides are read from across a room. Icons work best when they are simple, the same size, and paired with a few words.')}

${h2('Why should you stick to one icon style per deck?')}
${p('Every icon set has a “handwriting”: line thickness, rounded or sharp corners, filled or outlined. When you mix sets, people notice that something is off, even if they cannot say what. The easiest rule in presentation design is: <strong>one icon style per deck</strong>.')}
${p(`That does not mean every deck has to look the same. with icons draws each icon once and renders it in ${N_STYLES} styles, so you can pick the mood that fits the room and stay consistent. Use calm ${L.style('line')} or ${L.style('duo')} icons for a board update, playful ${L.style('sketch')} icons for a workshop, or bold ${L.style('gloss')} icons for a product launch.`)}
${styleRow('lightbulb')}
${p('Choose one style for the deck and use it on every slide.')}

${h2('Which icon styles look best on slides?')}
${p(`Slides are where the creative styles really earn their keep. Three of the ${N_STYLES} styles (line, solid and duo) are made for small interface sizes. The other 17 are made for big, expressive moments at 32 px and up, which is exactly how icons are shown on a slide. A few that suit decks especially well:`)}
${ul([
  `<strong>${L.style('glass')}</strong>: frosted glass with a vivid colour glowing through. Modern and techy, great for product and software decks.`,
  `<strong>${L.style('luxe')}</strong>: polished gold, jewel enamel and soft 3D shadows. Made for premium brands, finance and awards slides.`,
  `<strong>${L.style('sticker')}</strong>: die-cut vinyl stickers with a puffy white border. Friendly and fun for workshops, classrooms and social posts.`,
  `<strong>${L.style('retro')}</strong>: chunky outlines, sunset stripes and a hard shadow, like a 70s patch. Warm and full of personality.`,
  `<strong>${L.style('pixel')}</strong>: 16-bit pixel art, perfect for gaming, tech nostalgia or a playful team update.`,
  `<strong>${L.style('kawaii')}</strong>: chubby pastel shapes with a tiny blushing face. Ideal for kids, education and anything that should feel cute.`,
])}
${iconGrid(['rocket', 'chart-line', 'lightbulb', 'shield-check'], 'glass', 'A product launch slide in the glass style: launch, growth, ideas and security.', { size: 48 })}
${iconGrid(['trophy', 'star', 'crown', 'gift'], 'luxe', 'Awards and thank-you slides in the luxe style.', { size: 48 })}
${iconGrid(['users', 'calendar-check', 'target', 'heart'], 'sticker', 'A workshop agenda in the sticker style: team, schedule, goals and wellbeing.', { size: 48 })}
${p('Each icon also comes with 20 to 30 hand-picked colour palettes, so you can match a creative style to your theme without fiddling. Just remember the main rule: whichever style you pick, use it on every slide.')}

${h2('How big should icons be on a slide?')}
${p('There is no magic number, but these rules of thumb work well:')}
${ul([
  '<strong>Feature icons</strong> (the ones above a short label): roughly one and a half to two times the height of your heading text.',
  '<strong>Icon bullets</strong> (next to a line of text): about the same height as the text, or a touch bigger.',
  '<strong>Hero icons</strong> (one big icon on a title or section slide): as large as you like, but use a bold style such as solid or gloss so the lines do not look thin.',
  '<strong>Same job, same size.</strong> If three icons sit in a row, type the same height for all three instead of dragging corners by eye.',
])}
${sizeRamp(['users', 'chart-pie', 'shield-check'], [24, 32, 48, 64], 'solid', 'The same three icons at four sizes. Pick one size per role and use it everywhere in the deck.')}

${h2('How do you line icons up neatly?')}
${p('Nothing makes a slide look more “designed” than things that line up. All three apps have tools for it, so you never need to nudge by eye:')}
${ul([
  '<strong>PowerPoint:</strong> select the icons, then on the Home tab choose Arrange, then Align, and pick Align Middle followed by Distribute Horizontally.',
  '<strong>Google Slides:</strong> select them, then Arrange, then Align, and Arrange, then Distribute, then Horizontally.',
  '<strong>Keynote:</strong> select them, then Arrange, then Align Objects and Distribute Objects.',
])}
${p('Line up the <em>labels</em> too, and group each icon with its label (Ctrl+G, or ⌘+G on a Mac) so they move together.')}

${h2('The layout that never fails: icon + three-word label')}
${p('If you remember one layout from this guide, make it this one. Put three or four icons in a row, each with a label of about three words underneath, and maybe one short line of detail. It works for features, values, agenda items, process steps and “why us” slides.')}
${iconGrid(['zap', 'shield-check', 'users', 'trending-up'], 'duo', '“Fast to set up”, “Safe by default”, “Built for teams”, “Grows with you”. Four icons, four short labels, and the slide explains itself.', { size: 44 })}
${p('If a label needs a whole sentence, the slide probably has too many ideas on it.')}

${h2('How do you make an icon bullet list?')}
${p('Swap the usual round bullets for small icons and a plain list suddenly looks thought through. It works best for lists of three to five items where each item is a different kind of thing.')}
${steps([
  ['Write the list first', 'Keep each line short. Turn off the normal bullets for that text box.'],
  ['Pick one icon per line', `Choose icons that match the meaning: a ${L.icon('clock')} for time, a ${L.icon('dollar-sign')} for cost, a ${L.icon('shield-check')} for safety.`],
  ['Make them the same size and colour', 'About the height of the text. One colour, usually your accent colour.'],
  ['Line them up', 'Align the icons to the left, then Distribute Vertically so they match the line spacing of the text.'],
])}
${iconGrid(['clock', 'dollar-sign', 'shield-check', 'check-circle'], 'line', 'Simple line icons make great bullets: time, cost, safety, done.')}
${figure('student0', 'Students and teachers can use the same tricks: an icon per section makes study slides and posters much easier to scan.')}

${h2('Common mistakes (and quick fixes)')}
${doDont(
  '<p>Use one style and one colour, give every icon a short label, and line them up with Align and Distribute. Leave plenty of empty space around them.</p>',
  '<p>Mix icon sets, stretch a tiny PNG until it is blurry, or put an icon on every single line. Icons that decorate instead of explain just add noise.</p>',
)}
${ul([
  '<strong>Blurry icons:</strong> use SVG where you can, or download a bigger PNG and scale it down.',
  '<strong>Icons that look thin on a big screen:</strong> switch from line to solid for large sizes.',
  `<strong>Icons that do not mean anything:</strong> if you need to explain the icon, pick a simpler one. Our guide on ${L.post('choosing-the-right-icon', 'choosing the right icon')} helps.`,
])}

${h2('The bottom line')}
${p(`Icons make slides easier to follow when they are simple, consistent and paired with words. Use SVG for PowerPoint and recent Keynote, PNG for Google Slides, one style per deck, one size per role, and let the Align tools do the tidying. If you want to go deeper, our guides on ${L.post('svg-vs-png-icons', 'SVG vs PNG')} and ${L.post('consistent-icons', 'keeping icons consistent')} are good next reads.`)}
${cta('Grab icons for your next deck', `Search ${N_ICONS} icons, pick one of ${N_STYLES} styles and any colour, then copy it straight into PowerPoint, Google Slides or Keynote. Free and MIT licensed.`, ['chart-bar', 'target', 'lightbulb', 'users', 'rocket', 'trophy'])}
`,
}
