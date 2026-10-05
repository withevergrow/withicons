import { p, h2, h3, ul, figure, iconGrid, sizeRamp, table, yes, no, meh, callout, steps, stats, doDont, cta, L, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'svg-vs-png-icons',
  category: 'basics',
  date: '2026-10-02',
  hero: 'svg5',
  stickers: [['image', 'duo'], ['file-image', 'gloss'], ['download', 'solid']],
  title: 'SVG vs PNG icons: which should you use?',
  cardTitle: 'SVG vs PNG icons',
  h1: 'SVG vs PNG icons: which one should <em>you</em> use?',
  dek: 'SVG stays sharp at any size and changes colour easily. PNG works almost everywhere. Here is a plain-English guide to picking the right file for websites, slides, docs and email.',
  description: 'SVG or PNG for icons? A plain-English guide to sharpness, file size and colour, plus a clear table for websites, PowerPoint, Google Slides, Canva, Word and email.',
  keywords: ['SVG vs PNG', 'SVG vs PNG icons', 'should I use SVG or PNG', 'icon file format', 'SVG icons', 'PNG icons for slides'],
  about: ['Scalable Vector Graphics', 'Portable Network Graphics', 'Icons'],
  related: ['icon-sizes-guide', 'icons-in-presentations', 'how-to-add-icons-to-a-website'],
  tldr: [
    '<strong>Use SVG whenever your app accepts it</strong>: websites, PowerPoint, Word, Canva, Figma and newer Keynote. It stays sharp at every size and you can change its colour.',
    '<strong>Use PNG where SVG is not supported</strong>: Google Slides, Google Docs, Notion and email. Download it at least twice the size you will show it.',
    'An SVG is a recipe of shapes, so the computer redraws it perfectly at any size. A PNG is a fixed grid of pixels, so it goes blurry when you stretch it.',
    'For a single small icon, the file size difference is tiny. At big sizes, SVG wins easily: our home icon is about 0.4 KB as SVG and about 11.5 KB as a 512 px PNG.',
    'Icon fonts are an older trick. Today SVG is the better choice for most projects.',
  ],
  faq: [
    { q: 'Is SVG or PNG better for icons?', a: 'SVG is better for icons in most cases, because it stays sharp at any size, is usually smaller, and is easy to recolour. Use PNG only where SVG is not accepted, such as Google Slides, Google Docs and email.' },
    { q: 'Why do my PNG icons look blurry?', a: 'Usually because the PNG is smaller than the space it is shown in, so the app stretches the pixels. Modern screens also pack two or three real pixels into each “point”. Download the PNG at least twice the size you need, or use an SVG.' },
    { q: 'Can I use SVG icons in Google Slides?', a: 'Not directly. Google Slides does not accept SVG uploads, so download a PNG instead. A 256 px PNG is plenty for normal slide icons; choose 1024 px if the icon will fill a big part of the slide.' },
    { q: 'Can I change the colour of a PNG icon?', a: 'Only roughly. The colour is baked into the pixels. The easiest way is to choose your colour before you download. With an SVG you can recolour the icon later in apps like PowerPoint, Word, Canva and Figma.' },
    { q: 'Should I use SVG icons in email?', a: 'Use PNG for email and email signatures. Support for SVG images varies between email apps, and Gmail, the biggest one, only partly supports them. A small PNG works everywhere.' },
    { q: 'Are icon fonts still a good idea?', a: 'They still work, but most teams now prefer SVG. SVG icons can have more than one colour, look sharper, and do not turn into empty boxes when a font fails to load.' },
  ],
  sources: [
    { title: 'Microsoft Support: Edit SVG images in Microsoft 365', url: 'https://support.microsoft.com/en-us/office/edit-svg-images-in-microsoft-365-69f29d39-194a-4072-8c35-dbe5e7ea528c' },
    { title: 'Apple Human Interface Guidelines: Images (scale factors and vector formats)', url: 'https://developer.apple.com/design/human-interface-guidelines/images' },
    { title: 'Can I email: SVG images', url: 'https://www.caniemail.com/features/image-svg/' },
    { title: 'Google Docs Editors Help: Insert or delete images', url: 'https://support.google.com/docs/answer/97447' },
    { title: 'GitHub blog: Delivering Octicons with SVG (2016)', url: 'https://github.blog/news-insights/product-news/delivering-octicons-with-svg/' },
    { title: 'with icons app guides (which file to use in each app)', url: 'https://withicons.com/guides/index.html' },
  ],
  body: () => `
${p(`<span class="lede">If an icon will live on a website, in PowerPoint, Word, Canva or Figma, use SVG. It stays razor sharp at every size, it is tiny, and you can change its colour later. If the app does not accept SVG, like Google Slides, Google Docs or an email, use a PNG and download it at least twice as big as you need.</span>`)}
${p('That is the whole answer in two sentences. The rest of this guide explains why, in plain words, with pictures and a table you can come back to whenever you are not sure which file to grab.')}

${h2('What is the difference between SVG and PNG?')}
${p('Both are image files, but they store the picture in completely different ways.')}
${ul([
  '<strong>An SVG is a recipe.</strong> It says things like “draw a line from here to there, 1.75 units thick, with round ends”. When you show it, your computer follows the recipe and draws it fresh, at whatever size you need. SVG stands for Scalable Vector Graphics.',
  '<strong>A PNG is a mosaic.</strong> It stores a fixed grid of tiny coloured squares called pixels. A 64 px PNG is 64 squares wide and 64 squares tall, no more. PNG stands for Portable Network Graphics.',
])}
${figure('svg5', 'Up close, every screen is a grid of tiny pixels. A PNG stores those pixels directly. An SVG stores shapes and lets the screen work out the pixels.')}
${p('Both can have a transparent background, which matters for icons: you want the icon, not a white box around it. JPG cannot do that, which is why it is a poor choice for icons.')}

${h2('Why do PNG icons go blurry?')}
${p('Because a mosaic cannot grow new tiles. If you take a 24 px PNG and stretch it to 96 px, every pixel just gets four times bigger, and the edges turn soft and smudgy. An SVG has no such limit: ask for 96 px and it simply redraws the shapes at 96 px.')}
${sizeRamp(['home', 'search', 'heart', 'bell'], [16, 24, 32, 48, 64], 'line', 'These icons are SVGs, drawn live by your browser. Every size is equally crisp because the shapes are redrawn each time, not stretched.')}
${p('There is a second, sneakier cause of blur: sharp screens. Phones, tablets and many laptops pack two or three real pixels into every “point” you see. Apple, for example, asks app makers for images at 2x and 3x for exactly this reason. A PNG made at exactly the size you show it can look a bit soft on those screens. An SVG never has this problem.')}

${h2('Which is smaller, SVG or PNG?')}
${p('For icons, SVG is usually smaller, and it stays the same size no matter how big you show it. We measured a few with icons files to give you real numbers (PNGs exported straight from our renderer, without extra compression):')}
${table(['Icon file', 'Size on disk'], [
  ['Home icon, line style, SVG (any display size)', '367 bytes (about 0.4 KB)'],
  ['Home icon, line style, PNG at 24 px', 'about 0.6 KB'],
  ['Home icon, line style, PNG at 48 px', 'about 1.1 KB'],
  ['Home icon, line style, PNG at 512 px', 'about 11.5 KB'],
], 'One icon, four files. Measured by us in October 2026.')}
${p('To be honest, for one tiny icon the difference does not matter much: both are a fraction of a single photo. It matters when you have dozens of icons on a page, or when you need big, sharp icons for slides and print. That is where one 0.4 KB SVG beats a pile of large PNGs.')}
${p('Decorative styles have more shapes, so their SVGs are bigger. Our gloss and sketch icons are roughly 1 to 1.5 KB each, still small.')}
${stats([['0.4 KB', 'line SVG at any size'], ['11.5 KB', 'same icon as a 512 px PNG'], ['2x', 'the PNG size you should download'], ['3', 'PNG sizes on every icon page']])}

${h2('Can you change the colour of SVG and PNG icons?')}
${h3('SVG: yes, easily')}
${p('An SVG’s colour is just a setting in the recipe, so you can change it any time. On a website, with icons SVGs use a colour called <code>currentColor</code>, which means “use the same colour as the text around me”. Make your link blue and the icon turns blue too. In PowerPoint and Word (Microsoft 365, 2019 and later) you can select an SVG and pick a new fill colour, and even break it into separate shapes. Canva and Figma let you recolour SVGs as well.')}
${h3('PNG: choose before you download')}
${p(`A PNG’s colour is painted into its pixels. Some apps offer a “recolour” option, but the results are hit and miss. The easiest fix is to choose the colour first: every icon page in ${L.icons('with icons')} has a colour picker, so the PNG you download is already the colour you want.`)}
${iconGrid(['palette', 'paintbrush', 'droplet', 'image', 'file-image', 'download'], 'duo', 'Pick a style and colour on the icon page, then download. One click, no editing afterwards.')}

${h2('Where can you use SVG, and where do you need PNG?')}
${p('Here is the decision table. It reflects what each app accepted when we checked in October 2026.')}
${table(['Where the icon goes', 'SVG', 'PNG', 'Our pick'], [
  ['Websites and web apps', yes('Yes'), yes('Yes'), '<strong>SVG</strong>'],
  ['PowerPoint (Microsoft 365, 2019+)', yes('Yes, recolourable'), yes('Yes'), `<strong>SVG</strong> (${L.guide('powerpoint', 'guide')})`],
  ['Word (Microsoft 365, 2019+)', yes('Yes, recolourable'), yes('Yes'), `<strong>SVG</strong> (${L.guide('word-google-docs', 'guide')})`],
  ['Keynote', meh('Newer versions'), yes('Yes'), `SVG if it works, else <strong>PNG 1024 px</strong> (${L.guide('keynote', 'guide')})`],
  ['Canva', yes('Yes, upload it'), yes('Yes'), `<strong>SVG</strong> (${L.guide('canva', 'guide')})`],
  ['Figma', yes('Paste or drop it'), yes('Yes'), `<strong>SVG</strong> (${L.guide('figma', 'guide')})`],
  ['Google Slides', no('Not accepted'), yes('Yes'), `<strong>PNG 256 px</strong> (${L.guide('google-slides', 'guide')})`],
  ['Google Docs', no('Not accepted'), yes('Yes'), `<strong>PNG 256 px</strong> (${L.guide('word-google-docs', 'guide')})`],
  ['Notion', meh('Varies'), yes('Yes'), `<strong>PNG</strong> (${L.guide('notion', 'guide')})`],
  ['Email and email signatures', no('Patchy support'), yes('Yes'), `<strong>PNG 64 px</strong> (${L.guide('email-signatures', 'guide')})`],
], 'SVG or PNG? A quick answer for the apps people use most')}
${callout('note', 'Email is the trickiest case. Many email apps show SVG images, but Gmail, the biggest one, only partly supports them (its web version turns them into PNGs, and its phone apps only show them for some accounts). For email and signatures, a small PNG is the safe bet: download 64 px and show it at about 16 to 20 px.')}
${figure('phone0', 'Phone screens are very sharp. That is why an icon PNG should have more pixels than the space it fills.')}

${h2('What size PNG should you download?')}
${p('Use the “twice as big” rule: download a PNG at least twice the size you will show it. If the icon will appear at 32 px, grab a 64 px file. Showing it at 128 px on a slide? Get 256 px. Extra pixels never hurt an icon; missing pixels always do.')}
${steps([
  ['Open the icon page', `Find your icon in ${L.icons('the library')}, for example by typing “calendar” or “money”.`],
  ['Choose style and colour', `Pick one of the ${N_STYLES} styles and your colour. The PNG will be made in that colour.`],
  ['Pick a size', 'Choose 64 px for email and small spots, 256 px for slides and docs, or 1024 px for big slides and print.'],
  ['Download or copy', 'Click PNG download, or use Copy image to paste it straight into your slide.'],
])}
${p(`For a deeper look at sizes, including slides and print, see our ${L.post('icon-sizes-guide', 'guide to icon sizes')}.`)}

${h2('What about icon fonts?')}
${p('An icon font is a font where each letter is secretly a picture. You load the font, type a special code, and a house or a heart appears. It was a clever trick in the early 2010s, and some big icon sets still offer one.')}
${p('Today most teams prefer SVG, for a few practical reasons. Icon fonts can only be one colour. They are drawn like text, so they can look slightly blurry. And if the font fails to load, or someone uses their own font for easier reading, the icons can turn into empty boxes. GitHub described exactly these problems in 2016 when it moved its own icons from a font to SVG.')}
${p(`with icons does not ship an icon font. Developers can still use simple class names like <code>&lt;i class="with with-home"&gt;</code>, but under the hood they are drawn with SVG. (Load them from npm or the jsDelivr CDN, or copy the SVG code from any icon page. Our ${L.post('how-to-add-icons-to-a-website', 'guide to adding icons to a website')} walks through it.)`)}

${h2('When is PNG actually the better choice?')}
${p('SVG wins most of the time, but PNG is the right answer in a few real situations:')}
${ul([
  '<strong>The app does not accept SVG.</strong> Google Slides, Google Docs and most email apps.',
  '<strong>You want it to look identical everywhere.</strong> A PNG is a finished picture, so no app can draw it differently.',
  '<strong>You are sharing with people who will not edit it.</strong> A PNG opens in any image viewer, chat app or document.',
  '<strong>Someone else’s system blocks SVG uploads.</strong> WordPress, for example, blocks SVG uploads by default for safety, so a PNG is simpler there (or paste the SVG as code).',
])}
${doDont('<p>Use SVG on websites and in PowerPoint, Word, Canva and Figma. Use PNG for Google Slides, Docs and email, downloaded at twice the display size.</p>', '<p>Take a tiny 24 px PNG and stretch it across a slide. It will look blurry on the big screen, and everyone in the room will see it.</p>')}

${h2('The bottom line')}
${p(`SVG is the modern default for icons: sharp at any size, light, and easy to recolour. PNG is the reliable backup for apps that cannot handle SVG. Every icon in ${L.icons('with icons')} comes in both, with copy and download buttons on every page, so you never have to convert anything yourself.`)}
${cta('Grab an icon as SVG or PNG', 'Every icon page has Copy image, PNG download (64, 256 or 1024 px, any colour) and SVG download. Free, MIT licensed, no sign-up.', ['image', 'download', 'palette', 'file-image', 'heart', 'sparkles'])}
`,
}
