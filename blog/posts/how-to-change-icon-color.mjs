import { p, h2, h3, ul, figure, icon, iconGrid, styleRow, table, yes, no, meh, callout, steps, stats, doDont, code, cta, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

// One line icon painted in several colours, purely by changing the colour around it (currentColor at work).
const swatches = (name, colors, caption) => `<figure class="b-icons"><div style="display:flex;flex-wrap:wrap;gap:18px;align-items:center;justify-content:center">${colors.map(([hex, label]) => `<span style="display:inline-flex;flex-direction:column;align-items:center;gap:6px;color:${hex};font-size:.8rem">${icon(name, 'line', 40)}<code style="color:inherit">${label}</code></span>`).join('')}</div><figcaption>${caption}</figcaption></figure>`

export default {
  slug: 'how-to-change-icon-color',
  category: 'guides',
  date: '2026-10-03',
  hero: 'xcolor0',
  stickers: [['palette', 'sticker'], ['paintbrush', 'gloss'], ['droplet', 'duo']],
  title: 'How to change the colour of an icon (SVG, PNG, slides, websites)',
  cardTitle: 'How to change icon colour',
  h1: 'How to change the colour of an <em>icon</em>',
  dek: 'SVG icons can be recoloured in seconds. PNG icons mostly cannot, so you pick the colour before you download. Here is exactly how it works in PowerPoint, Keynote, Google Slides, Canva, Figma and on a website.',
  description: 'Change an icon’s colour in PowerPoint, Keynote, Google Slides, Canva, Figma or CSS. Why SVG recolours and PNG does not, plus brand colours and contrast.',
  keywords: ['how to change icon color', 'change icon colour', 'change SVG color', 'recolor icon PowerPoint', 'change icon color Canva', 'change PNG icon color', 'currentColor', 'icon color CSS', 'Graphics Fill PowerPoint'],
  about: ['Icons', 'Scalable Vector Graphics', 'Color', 'Microsoft PowerPoint', 'Canva', 'Cascading Style Sheets'],
  related: ['svg-vs-png-icons', 'icons-in-presentations', 'accessible-icons'],
  tldr: [
    '<strong>SVG icons can be recoloured, PNG icons mostly cannot.</strong> An SVG stores its colour as a setting you can change. A PNG has its colour baked into the pixels.',
    '<strong>PowerPoint and Word:</strong> select the SVG, open the Graphics Format tab and choose Graphics Fill. Use Convert to Shape to colour parts separately.',
    '<strong>Google Slides, Google Docs and email:</strong> they do not take SVG, so choose your colour on the icon page before you download the PNG.',
    '<strong>Websites:</strong> icons drawn with <code>currentColor</code> simply take the text colour, so one line of CSS (<code>color: #2F5BFF</code>) recolours them.',
    '<strong>Check contrast:</strong> an icon that carries meaning needs at least 3:1 contrast with its background (WCAG 2.2). Pale yellow on white fails.',
  ],
  faq: [
    { q: 'How do I change the colour of an icon in PowerPoint?', a: 'Insert the icon as an SVG, select it, open the Graphics Format tab and click Graphics Fill, then pick a colour. If an outline icon does not change, try Graphics Outline too. For different colours on different parts, right-click and choose Convert to Shape. This works in Microsoft 365 and PowerPoint 2019, 2021 and 2024.' },
    { q: 'Can you change the colour of a PNG icon?', a: 'Only roughly. The colour is painted into the pixels, so most apps can only tint or filter the whole picture. The clean way is to choose the colour before you download, or to use an SVG instead.' },
    { q: 'How do I change the colour of an icon in Google Slides?', a: 'Google Slides does not accept SVG, so the best way is to download the PNG already in your colour. Inside Slides you can select the image and use Format options, then Recolor, which offers a few tints based on your theme colours.' },
    { q: 'Why can I not change the colour of my SVG in Canva?', a: 'Canva recolours filled shapes in an SVG, but outline icons drawn with strokes may not show a colour option. Use a filled style such as Solid, or pick the colour on the icon page before you download the SVG.' },
    { q: 'What is currentColor in an SVG?', a: 'currentColor is a setting that means “use the same colour as the text around me”. An icon drawn with it turns blue inside a blue link and white inside a white button, without editing the icon file.' },
    { q: 'What colour contrast does an icon need?', a: 'WCAG 2.2 asks for at least 3:1 contrast between an icon and its background when the icon is needed to understand the page or use a control. Purely decorative icons are exempt, and text next to icons needs 4.5:1.' },
  ],
  sources: [
    { title: 'Microsoft Support: Edit SVG images in Microsoft 365 (Graphics Fill, Convert to Shape)', url: 'https://support.microsoft.com/en-us/office/edit-svg-images-in-microsoft-365-69f29d39-194a-4072-8c35-dbe5e7ea528c' },
    { title: 'Apple Support: Combine or break apart shapes in Keynote on Mac (SVG Break Apart)', url: 'https://support.apple.com/guide/keynote/combine-or-break-apart-shapes-tane80cfd59d/mac' },
    { title: 'Apple Support: Fill shapes and text boxes with colour in Keynote on Mac', url: 'https://support.apple.com/guide/keynote/fill-shapes-text-boxes-color-image-tan754f55080/mac' },
    { title: 'Google Docs Editors Help: Crop and adjust images (Format options, Recolor)', url: 'https://support.google.com/docs/answer/4600160' },
    { title: 'Google Docs Editors Help: Insert or delete images (supported file types)', url: 'https://support.google.com/docs/answer/97447' },
    { title: 'Canva Help Center: Add and edit shapes (uploaded SVGs can be resized or recoloured)', url: 'https://www.canva.com/help/add-edit-shapes/' },
    { title: 'Figma Help: Update fills using the color picker (Selection colors)', url: 'https://help.figma.com/hc/en-us/articles/360041003774-Update-fills-using-the-color-picker' },
    { title: 'MDN Web Docs: the currentColor keyword', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#currentcolor_keyword' },
    { title: 'W3C: Understanding WCAG 2.2 Success Criterion 1.4.11 Non-text Contrast', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html' },
  ],
  body: () => `
${p(`<span class="lede">To change the colour of an icon, use an SVG file: in PowerPoint and Word you select it and choose Graphics Fill, in Canva and Figma you pick a new colour in the toolbar or side panel, and on a website you set the CSS <code>color</code>. A PNG icon has its colour baked in, so for Google Slides, Google Docs and email you choose the colour before you download.</span>`)}
${p('That is the short version. Below, we explain why the two file types behave so differently, then walk through each app step by step, and finish with the part people often skip: making sure your new colour can actually be seen.')}

${h2('Why can you recolour an SVG but not a PNG?')}
${p('It comes down to how each file remembers the picture.')}
${ul([
  '<strong>An SVG is a set of drawing instructions.</strong> It says “draw this outline, 1.75 units thick, in this colour”. The colour is one word in the instructions, so any app that reads SVG can swap it.',
  '<strong>A PNG is a grid of coloured dots (pixels).</strong> Once the dots are painted, there is no “colour setting” left to change. Apps can only put a filter over the whole picture, which tends to look muddy at the edges.',
])}
${p(`So the rule of thumb is simple. If your app accepts SVG, use SVG and recolour it whenever you like. If it only accepts PNG, decide the colour first. Our ${L.post('svg-vs-png-icons', 'SVG vs PNG guide')} has the full table of which apps take which file.`)}
${figure('xcolor2', 'Picking a colour is the fun part. With SVG you can change your mind later; with PNG, choose before you download.')}

${h2('What does currentColor mean?')}
${p('Most good icon sets, including with icons, draw their icons with a special colour called <code>currentColor</code>. In plain words it means “use the same colour as the text around me”.')}
${p('That one idea saves a lot of work. Put an icon inside a blue link and it turns blue. Put it inside a white button and it turns white. Hover over the link, the text changes colour, and the icon changes with it. Nobody has to edit the icon file.')}
${swatches('heart', [['#1A1A1A', 'ink'], ['#2F5BFF', 'blue'], ['#FF5A36', 'tomato'], ['#1E9E5A', 'green'], ['#8A4FFF', 'violet'], ['#B07A00', 'mustard']], `The same ${L.icon('heart')} icon six times. Nothing about the icon changes, only the text colour around it.`)}
${p('Design apps such as Canva, Figma and PowerPoint do not know what the “text around” an image is, so the icon arrives in a fixed colour: the one you picked on the icon page, or black. From then on you recolour it with that app’s own colour tools, as shown below.')}

${h2('How do you change an icon’s colour in PowerPoint and Word?')}
${p(`PowerPoint and Word in Microsoft 365, and the 2019, 2021 and 2024 versions, can recolour SVG images directly. Microsoft’s own help page describes the same steps for both apps. (Our ${L.guide('powerpoint', 'PowerPoint guide')} has pictures for each step.)`)}
${steps([
  ['Insert the SVG', 'Go to Insert, then Pictures, then This Device (Picture from File on a Mac) and choose the SVG you downloaded.'],
  ['Open Graphics Format', 'Click the icon. A Graphics Format tab appears on the ribbon at the top.'],
  ['Choose Graphics Fill', 'Pick any colour, including your theme colours or a custom hex code. The whole icon changes at once.'],
  ['Outline icon not changing?', 'Line icons are drawn as strokes, so also try Graphics Outline with the same colour.'],
  ['Need two colours?', 'Right-click and choose Convert to Shape. The icon becomes ordinary shapes you can colour piece by piece with Shape Fill and Shape Outline.'],
])}
${callout('note', 'PowerPoint 2016 and older cannot open SVG files at all. If that is your version, download a 512 px PNG in the colour you want from the icon page instead.')}

${h2('How do you change an icon’s colour in Keynote?')}
${p(`Keynote handles PNG reliably on every Mac and iPad, so the easiest route is to pick the colour on the icon page and download a 1024 px PNG. Need a new colour later? Download it again and drag it over the old one. (See our ${L.guide('keynote', 'Keynote guide')}.)`)}
${p('If you are on a recent version and placed an SVG, Apple’s help describes how to make it editable: select the image and choose Format, then Shapes and Lines, then Break Apart. If the pieces will not select, choose Arrange, then Ungroup. Each piece is now a normal shape, and you can recolour it from the Style tab of the Format sidebar (Fill for solid parts, Border for outlines). If Break Apart is greyed out, that image cannot be split, so fall back to a PNG in your colour.')}

${h2('How do you change an icon’s colour in Google Slides and Google Docs?')}
${p(`Google Slides and Google Docs do not accept SVG uploads, so you will be working with a PNG. That makes the order of steps important. (Details in our ${L.guide('google-slides', 'Google Slides guide')}.)`)}
${steps([
  ['Pick the colour first', `Open the icon in ${L.icons('the library')}, choose a style and type or pick your colour, for example your brand blue.`],
  ['Download the PNG', 'Choose 256 px for normal slide icons, or 1024 px if the icon will fill a big part of the slide.'],
  ['Insert it', 'In Slides, choose Insert, then Image, then Upload from computer. Or use Copy image on the icon page and paste.'],
])}
${p('Already have a black PNG on your slide? Select it and open Format options, then Recolor. Google offers a handful of tints based on your theme colours. It is fine for a quick fix, but you cannot type an exact brand colour, so downloading again is usually cleaner.')}

${h2('How do you change an icon’s colour in Canva?')}
${p(`Upload the SVG through Uploads, then Upload files, and add it to your design. Select it and look for small colour squares in the top toolbar: each square is one colour in the icon, and clicking it opens Canva’s colour panel, including your Brand Kit. Canva’s own help notes that uploaded SVGs can be resized and recoloured, but not reshaped.`)}
${p(`One honest catch: Canva is happiest recolouring <em>filled</em> shapes. Outline icons drawn with strokes may not show a colour square at all. Two easy fixes: use a filled style such as ${L.style('solid')} or ${L.style('gloss')}, or pick your colour on the icon page before you download, so the file arrives in the right colour. Our ${L.guide('canva', 'Canva guide')} lists which styles recolour inside Canva.`)}

${h2('How do you change an icon’s colour in Figma?')}
${p(`Click Copy SVG on any icon page and paste it onto the canvas. Figma turns it into real vector layers. Select the layers and change the Stroke colour for line icons, or the Fill colour for solid ones, in the right panel. When you select a whole group with mixed colours, the Selection colors section lists every colour in it, so you can swap them all from one place. (More in our ${L.guide('figma', 'Figma guide')}.)`)}

${h2('How do you change an icon’s colour on a website?')}
${p('If your icons use <code>currentColor</code>, you do not change the icon at all. You change the colour of the thing it sits in. Here is the whole idea in a few lines:')}
${code(`<a class="nav-link" href="/inbox">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">…</svg>
  Inbox
</a>

.nav-link       { color: #2F5BFF; }
.nav-link:hover { color: #1A3FCC; }`)}
${p(`The icon follows the link’s colour, including on hover. The same trick powers dark mode: change the text colour for dark pages and every icon follows, which we explain in ${L.post('dark-mode-icons', 'our guide to icons in dark mode')}. For the different ways to add icons to a page, see ${L.post('how-to-add-icons-to-a-website', 'how to add icons to a website')} or the ${L.guide('html', 'HTML guide')}.`)}

${h2('How do multi-colour icons and palettes work?')}
${p(`Single-colour icons are easy: one colour, one setting. But some styles use several colours on purpose. In with icons, every one of our ${N_ICONS} icons comes in ${N_STYLES} styles (${N_SVGS} SVGs in total), and they fall into three groups:`)}
${table(['Style group', 'How the colour works', 'Change it with'], [
  [`${L.style('line')}, ${L.style('solid')}, ${L.style('gloss')}, ${L.style('engrave')}, ${L.style('sketch')}`, 'One colour, the text colour (currentColor)', 'Text colour, or Graphics Fill in PowerPoint'],
  [`${L.style('duo')}`, 'The outline, plus a soft tint (by default the same colour at 20% strength)', 'Text colour, plus the <code>--with-duo</code> setting for the tint'],
  [`${L.style('sticker')}, ${L.style('kawaii')}, ${L.style('glass')}, ${L.style('retro')}, ${L.style('pixel')} and other palette styles`, 'Several named colours: main colour, second colour, shine, shadow, border and more', 'A ready-made palette, or each colour by hand in the editor'],
], 'How colour works in each kind of with icons style')}
${p(`For the multi-colour styles, every icon has 20 to 30 hand-picked colour palettes written for that icon specifically. The ${L.icon('pizza')} icon gets palettes like Margherita, Pepperoni and Pesto verde; the ${L.icon('heart')} gets Classic red, Rose petal and Valentine candy; an abstract icon like ${L.icon('settings')} gets ideas such as Brass cog, Maintenance amber and High contrast. Pick a palette and it recolours every multi-colour style of that icon at once. You can also change each colour yourself, and every icon has at least one palette marked “for dark pages”.`)}
${styleRow('palette', `The ${L.icon('palette')} icon across styles. The one-colour styles follow your text colour; the multi-colour ones take a palette.`)}

${h2('How do you match icons to brand colours without losing contrast?')}
${p('Brand colours are a great starting point, but some of them are too light to show up on white. That matters, because an icon that people need in order to understand the page (a warning sign, a delete button, a status dot) has to be clearly visible.')}
${p('The web accessibility standard, WCAG 2.2, asks for a contrast ratio of at least <strong>3:1</strong> between such an icon and its background. Text needs more: 4.5:1 for normal text. Purely decorative icons have no requirement, but they should still look intentional. Here are a few real measurements:')}
${table(['Icon colour on white', 'Contrast', 'Good enough for a meaningful icon?'], [
  ['Bright yellow <code>#FFD400</code>', '1.43:1', no('Too faint')],
  ['Mid grey <code>#949494</code>', '3.03:1', meh('Just passes')],
  ['Tomato <code>#FF5A36</code>', '3.10:1', meh('Passes for icons, not for small text')],
  ['Cobalt blue <code>#2F5BFF</code>', '5.17:1', yes('Comfortably')],
  ['Near black <code>#1A1A1A</code>', '17.4:1', yes('Always')],
], 'Contrast ratios calculated with the WCAG formula, October 2026')}
${doDont('<p>Use your brand colour for icons when it passes 3:1 against the background, and a darker shade of it when it does not. Check with a free contrast checker before you ship.</p>', '<p>Rely on colour alone to say something. A red icon and a green icon look the same to many colour-blind people, so pair colour with a different shape or a label.</p>')}
${p(`Want more on this? Our ${L.post('accessible-icons', 'guide to accessible icons')} covers labels, sizes and screen readers, and ${L.post('consistent-icons', 'how to keep icons consistent')} explains why one or two icon colours usually look better than five.`)}
${iconGrid(['palette', 'paintbrush', 'droplet', 'highlighter', 'pen-tool', 'sparkles'], 'duo', 'A few colour-themed icons in the Duo style. Each one takes your text colour plus a soft tint.')}
${stats([['3:1', 'minimum contrast for meaningful icons'], ['20 to 30', 'hand-picked palettes per icon'], [N_STYLES, 'styles for every icon'], ['1', 'line of CSS to recolour web icons']])}

${h2('The quick answer, one more time')}
${p(`Use SVG wherever the app accepts it and recolour with that app’s own tool: Graphics Fill in PowerPoint and Word, the toolbar colour squares in Canva, Fill and Stroke in Figma, CSS <code>color</code> on a website. Use PNG for Google Slides, Google Docs and email, and choose the colour before you download. Every icon page in ${L.icons('with icons')} lets you pick a colour first, then copy or download it as SVG or PNG, free under the MIT licence.`)}
${cta('Pick a colour, then download', `Choose any of ${N_ICONS} icons, any of ${N_STYLES} styles and your own colour or palette. Copy image, PNG or SVG. Free, MIT licensed, no sign-up.`, ['palette', 'paintbrush', 'droplet', 'download', 'image', 'sparkles'])}
`,
}
