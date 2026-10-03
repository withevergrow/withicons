import { p, h2, h3, iconGrid, styleRow, sizeRamp, table, yes, no, meh, callout, doDont, figure, cta, slugify, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

// One glossary entry: an anchored h3, then a definition that makes sense when quoted on its own.
const id = name => 'term-' + slugify(name)
const term = ([name, def, more = '']) => `${h3(name, id(name))}${p(`${def}${more ? ` ${more}` : ''}`)}`

// The glossary, in reading order. Each group becomes one H2 section.
const groups = () => [
  {
    h: 'What is the difference between an icon, a glyph, a pictogram and a symbol?',
    intro: 'These four words overlap, but each has its own job.',
    terms: [
      ['Icon', 'An icon is a small, simple picture that stands for an object, an action or an idea, such as a magnifying glass that means “search”.', 'Good icons are understood at a glance and usually sit next to a short text label.'],
      ['Glyph', 'A glyph is a single drawn shape in a font, such as a letter, a number or a punctuation mark.', 'Simple one-colour icons are often called glyphs too.'],
      ['Pictogram', 'A pictogram is a picture that shows its meaning by looking like the real thing, like the walking figure on a crossing sign.'],
      ['Symbol', 'A symbol is a sign whose meaning you learn rather than see, such as a heart meaning “like” or a gear meaning “settings”.', 'Most interface icons mix the two: you recognise the bell, but you learn that it means notifications.'],
      ['Metaphor', 'An icon metaphor is the everyday object an icon borrows to explain a digital action, like a trash can for “delete” or a paper plane for “send”.'],
      ['Icon library', `An icon library is a collection of icons drawn to match each other, with names, file formats and a licence that says how you may use them.`, `People also say icon set or icon pack. Our ${L.post('what-is-an-icon-library', 'plain-English guide to icon libraries')} goes deeper.`],
    ],
    after: () => iconGrid(['search', 'trash', 'send', 'bell', 'heart', 'settings'], 'line', 'Six everyday metaphors. Click any icon to open its page.'),
  },
  {
    h: 'What do SVG, PNG, viewBox and the other file words mean?',
    intro: 'These are the words you meet when you download or paste an icon.',
    terms: [
      ['Vector', 'A vector image is a picture stored as shapes and lines, so it can be scaled to any size without getting blurry.'],
      ['Raster', 'A raster image (also called a bitmap) is a picture stored as a fixed grid of coloured pixels, so it gets blurry when you enlarge it.'],
      ['SVG', 'SVG (Scalable Vector Graphics) is the standard vector image format of the web and the best everyday file type for icons.', `It is a W3C standard, an icon SVG is usually under one kilobyte, and you can change its colour. See ${L.post('svg-vs-png-icons', 'SVG vs PNG icons')}.`],
      ['PNG', 'PNG (Portable Network Graphics) is a raster image format that supports a transparent background, which makes it the safe choice where SVG is not accepted, such as Google Slides or email.'],
      ['viewBox', 'The viewBox is the setting inside an SVG file that defines its drawing area, for example “0 0 24 24” for an icon drawn on a 24 by 24 grid.', 'It is why the same SVG keeps its proportions at 16 px or 160 px.'],
      ['Icon font', 'An icon font is a font file in which each character is drawn as an icon instead of a letter.', 'Most teams now prefer SVG, which can use several colours and never turns into empty boxes when a font fails to load.'],
      ['Sprite', 'An SVG sprite is a single file that holds many icons, so a website downloads them once and shows each one by name.'],
    ],
    after: () => table(['Format', 'Sharp at any size', 'Recolour later', 'Works in Google Slides'], [
      ['SVG', yes('Yes'), yes('Yes'), no('No')],
      ['PNG', meh('If big enough'), no('Pick colour first'), yes('Yes')],
      ['Icon font', yes('Yes'), meh('One colour only'), no('No')],
    ], 'Three icon formats compared'),
  },
  {
    h: 'What do grid, keyline, stroke and fill mean?',
    intro: 'You do not need these drawing words to use icons, but they explain why a good set looks tidy.',
    terms: [
      ['Grid', 'An icon grid is the invisible square of guide units an icon is drawn on, most often 24 by 24, so every icon in a set shares the same proportions.', `Every with icons icon is drawn once on a 24 by 24 grid, and so is every Lucide icon.`],
      ['Keyline', 'Keylines are guide shapes on the icon grid, such as a circle, a square and two rectangles, that help round, square, wide and tall icons look the same size.', 'In with icons a round icon fills a 20-unit circle and a square one an 18-unit square, because circles look smaller.'],
      ['Padding', 'Padding (or the live area) is the empty margin kept around an icon inside its grid, so icons never touch the edge and line up neatly with text.'],
      ['Stroke', 'A stroke is a line drawn along a path, and stroke width is how thick that line is.', 'Our Line style uses a 1.75 px stroke with round ends (caps) and round corners (joins).'],
      ['Fill', 'A fill is the colour inside a closed shape.'],
      ['Knockout', 'A knockout (or cutout) is a gap cut out of a filled shape so that inner details stay visible, like the hands on a solid clock icon.'],
      ['Optical size', 'Optical size is a version of an icon or font tuned for one display size, usually with heavier lines and fewer details when it is small.', 'Material Symbols, for example, offers optical sizes from 20 to 48.'],
      ['Pixel snapping', 'Pixel snapping means lining an icon’s edges up with the screen’s pixel grid, so lines look crisp instead of fuzzy at small sizes.', 'It matters most at 16 to 24 px on ordinary screens.'],
      ['currentColor', 'currentColor is a CSS keyword that tells an icon to use the same colour as the text around it.', 'Make a link blue and its icon turns blue too, with no extra work. Every with icons line and solid SVG uses it.'],
    ],
    after: () => `${styleRow('clock', `Stroke, fill and knockout in one picture: the ${L.icon('clock')} icon as ${L.style('line', 'Line')} (strokes), ${L.style('solid', 'Solid')} (a fill with the hands knocked out) and ${L.style('duo', 'Duo')} (strokes over a soft fill).`, { styles: ['line', 'solid', 'duo'] })}${sizeRamp(['home', 'search', 'settings', 'bell'], [16, 20, 24, 32, 48], 'line', 'The same SVG icons from 16 to 48 px. Small sizes are where padding and stroke width matter most.')}`,
  },
  {
    h: 'What are the main icon styles called?',
    intro: `A style is the look applied to an icon. with icons draws each icon once and renders it in ${N_STYLES} styles.`,
    terms: [
      ['Outline', 'An outline icon (also called a line or stroke icon) is drawn with lines only and leaves the inside empty.', `It is the most common style in apps and websites. In with icons it is the ${L.style('line', 'Line style')}.`],
      ['Solid', 'A solid icon (also called a filled icon) is drawn as filled shapes, which makes it bolder and easier to read at small sizes.', 'Apps often swap an outline icon for its solid twin to show the selected tab.'],
      ['Duotone', 'A duotone icon uses two tones, usually a line or shape over a lighter tint, to add depth without clutter.'],
      ['Flat', 'Flat design means icons with no shadows, gradients or textures, just clean shapes and plain colours.'],
      ['Skeuomorphic', 'A skeuomorphic icon imitates a real object or material, such as leather, metal or paper, with texture, light and shadow.', `Our ${L.style('skeuo', 'Skeuo style')} does it on purpose.`],
      ['Weight', 'Weight is how thick or heavy an icon’s lines look, from thin to bold, much like the weights of a font.', 'Phosphor offers six weights, and Material Symbols lets you set weight with a slider.'],
    ],
    after: () => styleRow('star', `The ${L.icon('star')} icon as outline, solid, duotone, glossy, hand-drawn, skeuomorphic and pixel art. More in ${L.post('icon-styles-explained', 'icon styles explained')}.`, { styles: ['line', 'solid', 'duo', 'gloss', 'sketch', 'skeuo', 'pixel'] }),
  },
  {
    h: 'Which interface words come up around icons?',
    intro: 'These words describe how icons behave inside apps and websites.',
    terms: [
      ['Tab bar', 'A tab bar is the row of icons with short labels, usually at the bottom of a phone app, that switches between the app’s main sections.'],
      ['Active state', 'The active state is how an icon looks when its option is switched on or its page is open, often filled instead of outlined or shown in an accent colour.'],
      ['Affordance', 'An affordance is a visual clue that tells you what you can do with something, such as a button that looks pressable.', 'A pencil icon hints “you can edit this”.'],
      ['Touch target', 'A touch target is the tappable area around an icon, which should be bigger than the icon itself so fingers can hit it easily.', 'WCAG 2.2 asks for at least 24 by 24 CSS pixels, Apple recommends 44 by 44 points and Android recommends 48 by 48 dp.'],
      ['Tooltip', 'A tooltip is a short text label that appears when you hover over or focus an icon, explaining what it does.', 'They help, but do not replace a visible label.'],
    ],
    after: () => iconGrid(['home', 'search', 'plus-circle', 'bell', 'user'], 'duo', 'A typical tab bar: home, search, create, notifications, profile.'),
  },
  {
    h: 'What do alt text, aria-label and decorative mean?',
    intro: `These words decide whether screen reader users understand your icons. See our ${L.post('accessible-icons', 'guide to accessible icons')}.`,
    terms: [
      ['Alt text', 'Alt text (alternative text) is a short written description of an image that screen readers read aloud and that appears if the image fails to load.'],
      ['aria-label', 'aria-label is an HTML attribute that gives an element, such as an icon-only button, a name that screen readers announce.', 'A trash-can button should be labelled “Delete”.'],
      ['Decorative', 'A decorative icon adds no information beyond the text next to it, so it should be hidden from screen readers.', 'On a website that means <code>aria-hidden="true"</code>. In PowerPoint and Word, tick “Mark as decorative”.'],
      ['Contrast', 'Contrast is how strongly an icon stands out from its background, and WCAG asks for a ratio of at least 3 to 1 for icons that carry meaning.'],
    ],
    after: () => doDont('<p>Label what the icon <em>does</em>: “Delete” on a trash button. Mark it decorative when the text beside it already says it.</p>', '<p>Leave an icon-only button unlabelled, so a screen reader just says “button” or reads a file name aloud.</p>'),
  },
  {
    h: 'What do MIT, CC BY and attribution mean?',
    intro: `Licence words decide whether you may use an icon and whether you owe a credit. More in our ${L.post('free-icons-commercial-use', 'guide to free icons for commercial use')}.`,
    terms: [
      ['Licence', 'A licence is the legal permission that says what you may do with an icon, such as use it commercially, change it or share it.'],
      ['Open source', 'Open source means the files are published under a licence that lets anyone use, change and share them, usually at no cost.'],
      ['MIT License', 'The MIT License is a short, permissive open-source licence that lets you use, copy, change and sell work made with the files, as long as the licence notice stays with copies of the files themselves.', `It does not ask for a visible credit on your website or slide. with icons is MIT licensed (${L.page('license.html', 'our licence')}).`],
      ['CC BY', 'CC BY (Creative Commons Attribution) is a licence that lets you use and change a work for any purpose, including commercial, as long as you give appropriate credit to the creator.', 'Font Awesome Free icons use CC BY 4.0, and The Noun Project’s free icons use CC BY 3.0.'],
      ['CC0', 'CC0 is a Creative Commons tool that lets creators give up their rights, so anyone can use the work for anything without giving credit.'],
      ['Attribution', 'Attribution is the credit you give a creator, such as “Icons by Jane Doe” with a link, when a licence asks for it.'],
      ['Commercial use', 'Commercial use means using something in work that earns money or promotes a business, such as a client website, an advert, a product or a paid course.'],
    ],
    after: () => table(['Licence', 'Commercial use', 'Use without a credit', 'Seen in'], [
      ['MIT', yes('Yes'), yes('Yes'), 'with icons, Heroicons, Phosphor, Tabler'],
      ['Apache 2.0', yes('Yes'), yes('Yes'), 'Material Symbols'],
      ['CC0', yes('Yes'), yes('Yes'), 'Public domain artwork'],
      ['CC BY', yes('Yes'), no('Credit required'), 'Noun Project free icons, Font Awesome Free'],
      ['Marketplace free plan', yes('Usually'), no('Credit or link'), 'Flaticon, Icons8'],
    ], 'Common icon licences (checked October 2026)'),
  },
]

export default {
  slug: 'icon-glossary',
  category: 'basics',
  date: '2026-10-03',
  hero: 'xgloss3',
  stickers: [['book-open', 'gloss'], ['type', 'duo'], ['bookmark', 'solid']],
  title: 'Icon design glossary: the terms you need, in plain English',
  cardTitle: 'Icon design glossary',
  h1: 'Icon design glossary: the terms you need, <em>in plain English</em>',
  dek: 'Glyph, keyline, viewBox, currentColor, CC BY. Here are 44 icon words explained in one sentence each, with real icons, so you can follow any design conversation.',
  description: 'Plain-English definitions of 44 icon design terms: glyph, pictogram, SVG, viewBox, stroke, keyline, duotone, touch target, aria-label, MIT and CC BY.',
  keywords: ['icon glossary', 'icon design terms', 'what is a glyph', 'icon vs pictogram vs symbol', 'what is a keyline', 'SVG viewBox meaning', 'currentColor', 'icon licence terms'],
  about: ['Icon (computing)', 'Glossary', 'Scalable Vector Graphics', 'Web accessibility', 'Software license'],
  related: ['icon-styles-explained', 'svg-vs-png-icons', 'accessible-icons'],
  tldr: [
    'An <strong>icon</strong> is a small picture that stands for an object, action or idea. A <strong>pictogram</strong> looks like the real thing, a <strong>symbol</strong> has a learned meaning, and a <strong>glyph</strong> is one drawn shape in a font.',
    '<strong>SVG</strong> is a vector format that stays sharp at any size. <strong>PNG</strong> is a pixel format for apps that do not accept SVG. The <strong>viewBox</strong> sets an SVG’s drawing area.',
    'Icons are drawn on a <strong>grid</strong> (usually 24 by 24) with <strong>keylines</strong> and <strong>padding</strong>, using <strong>strokes</strong> (lines) and <strong>fills</strong> (filled shapes).',
    'For accessibility, give meaningful icons a label (<strong>alt text</strong> or <strong>aria-label</strong>) and hide <strong>decorative</strong> ones from screen readers.',
    '<strong>MIT</strong> and <strong>CC0</strong> need no visible credit, <strong>CC BY</strong> requires <strong>attribution</strong>, and all three allow <strong>commercial use</strong>.',
  ],
  faq: [
    { q: 'What is the difference between an icon and a pictogram?', a: 'A pictogram shows its meaning by looking like the real thing, such as the walking figure on a crossing sign, and is made for public signs. An icon is any small picture standing for an object, action or idea in an interface, and it often relies on a learned meaning, like a gear for settings.' },
    { q: 'What is the difference between an icon and a symbol?', a: 'A symbol is a sign whose meaning is learned rather than seen, like a heart for “like”. Many icons are symbols, but some are pure pictures, such as a camera icon for the camera. Most interface icons mix both.' },
    { q: 'What does glyph mean in icon design?', a: 'In typography a glyph is one drawn shape in a font, like a letter or number. In icon design the word often means a simple one-colour icon, especially in icon fonts, where each icon is literally a glyph in the font.' },
    { q: 'What is a keyline in icon design?', a: 'Keylines are guide shapes on the icon grid, usually a circle, a square and a wide and a tall rectangle. Round icons follow the circle and square icons follow the square, so icons of different shapes look the same size.' },
    { q: 'What is a viewBox in an SVG?', a: 'The viewBox is the attribute that defines the drawing area of an SVG, written as four numbers such as “0 0 24 24”. It lets the browser scale the drawing to any display size while keeping its proportions.' },
    { q: 'What does decorative mean for an icon?', a: 'A decorative icon repeats information that is already in the text next to it, so screen readers should skip it. On websites you hide it with aria-hidden="true"; in PowerPoint and Word you tick “Mark as decorative”.' },
    { q: 'Do MIT licensed icons need attribution?', a: 'No visible credit is needed. The MIT License only asks that the licence notice stays with copies of the files themselves, so you can use MIT icons on websites, slides and products without a credit line.' },
  ],
  sources: [
    { title: 'W3C: Scalable Vector Graphics (SVG) 2', url: 'https://www.w3.org/TR/SVG2/' },
    { title: 'W3C: Portable Network Graphics (PNG) Specification, Third Edition (Recommendation, June 2025)', url: 'https://www.w3.org/TR/png-3/' },
    { title: 'MDN: viewBox', url: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/viewBox' },
    { title: 'MDN: <color> value (currentColor keyword)', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/color_value' },
    { title: 'MDN: aria-label', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label' },
    { title: 'MDN: aria-hidden', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-hidden' },
    { title: 'W3C: Understanding SC 1.1.1 Non-text Content', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html' },
    { title: 'W3C: Understanding SC 1.4.11 Non-text Contrast (3:1)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html' },
    { title: 'W3C: Understanding SC 2.5.8 Target Size (Minimum, 24 by 24 CSS pixels)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html' },
    { title: 'Apple Human Interface Guidelines: Accessibility (control sizes)', url: 'https://developer.apple.com/design/human-interface-guidelines/accessibility' },
    { title: 'Android Developers: touch targets of at least 48 by 48 dp', url: 'https://developer.android.com/guide/topics/ui/accessibility/apps' },
    { title: 'Microsoft Support: Add alternative text (Mark as decorative)', url: 'https://support.microsoft.com/en-us/accessibility/office-accessibility/add-alternative-text-to-a-shape-picture-chart-smartart-graphic-or-other-object' },
    { title: 'Nielsen Norman Group: Icon Usability (labels)', url: 'https://www.nngroup.com/articles/icon-usability/' },
    { title: 'Google Fonts: Material Symbols guide (optical size 20 to 48 dp, weight)', url: 'https://developers.google.com/fonts/docs/material_symbols' },
    { title: 'Phosphor Icons on GitHub (six weights)', url: 'https://github.com/phosphor-icons/homepage#readme' },
    { title: 'Lucide icon design specification (24 × 24 grid)', url: 'https://lucide.dev/contribute/icons/specification' },
    { title: 'GitHub blog: Delivering Octicons with SVG (2016)', url: 'https://github.blog/news-insights/product-news/delivering-octicons-with-svg/' },
    { title: 'AIGA Symbol Signs', url: 'https://www.aiga.org/resources/symbol-signs' },
    { title: 'The MIT License (Open Source Initiative)', url: 'https://opensource.org/license/mit' },
    { title: 'Creative Commons: CC BY 4.0 deed', url: 'https://creativecommons.org/licenses/by/4.0/' },
    { title: 'Creative Commons: CC0 1.0 deed', url: 'https://creativecommons.org/publicdomain/zero/1.0/' },
    { title: 'Font Awesome Free licence (GitHub)', url: 'https://github.com/FortAwesome/Font-Awesome/blob/7.x/LICENSE.txt' },
    { title: 'Noun Project legal and licences (free icons under CC BY 3.0)', url: 'https://thenounproject.com/legal/' },
  ],
  body: () => {
    const gs = groups()
    const all = gs.flatMap(g => g.terms.map(t => t[0])).sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
    const byLetter = {}
    for (const t of all) (byLetter[t[0].toUpperCase()] ||= []).push(t)
    const az = Object.entries(byLetter).map(([l, ts]) => `<strong>${l}</strong> ${ts.map(t => `<a href="#${id(t)}">${t}</a>`).join(', ')}`).join(' · ')
    return `
${p(`<span class="lede">Icon design has its own small vocabulary: words like glyph, keyline, viewBox and CC BY. This glossary explains ${all.length} of them in plain English, one sentence each, grouped by topic and illustrated with real icons, so you can follow any conversation with a designer or developer.</span>`)}
${p(`Every example is a real icon from ${L.icons('with icons')}, our free set of ${N_ICONS} icons in ${N_STYLES} styles (${N_SVGS} SVGs).`)}
${p(`<strong>Jump to a term:</strong> ${az}`)}
${figure('xgloss0', 'A small dictionary for the words you meet when you pick, place and license icons.')}
${gs.map(g => `
${h2(g.h)}
${p(g.intro)}
${g.terms.map(term).join('\n')}
${g.after()}`).join('\n')}

${h2('Where should you go from here?')}
${p(`Next steps: see ${L.post('icon-sizes-guide', 'which icon size to use')}, ${L.post('choosing-the-right-icon', 'how to choose the right icon for an idea')}, or the ${L.guide('powerpoint', 'PowerPoint')} and ${L.guide('google-slides', 'Google Slides')} guides.`)}
${callout('tip', `Each term has its own link (for example <a href="#${id('Keyline')}">#term-keyline</a>), so you can share one definition with a teammate.`)}
${cta('See the words in action', `${N_ICONS} free icons in ${N_STYLES} styles. Copy SVG or download PNG. MIT licensed.`, ['book-open', 'pen-tool', 'layers', 'palette', 'accessibility', 'badge-check'])}
`
  },
}
