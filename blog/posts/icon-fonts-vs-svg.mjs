import { p, h2, h3, ul, figure, iconGrid, sizeRamp, table, yes, no, meh, callout, doDont, code, cta, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'icon-fonts-vs-svg',
  category: 'basics',
  date: '2026-11-06',
  hero: 'h-icon-fonts-vs-svg',
  stickers: [['type', 'solid'], ['image', 'duo'], ['code', 'sketch']],
  title: 'Icon fonts vs SVG icons: which should you use, and are fonts bad?',
  cardTitle: 'Icon fonts vs SVG',
  h1: 'Icon fonts vs SVG icons: which should <em>you</em> use?',
  dek: 'Icon fonts were a clever trick, and some sets still ship them. Here is why most teams moved to SVG, when a font or a simple class name still makes sense, and how to get the best of both.',
  description: 'Icon fonts vs SVG in plain English: why most teams moved to SVG, when an icon font still makes sense, whether Font Awesome is one, and how CSS-class icons work.',
  keywords: ['icon fonts vs svg', 'icon font vs svg icons', 'are icon fonts bad', 'is font awesome an icon font', 'svg icons', 'icon font accessibility', 'css icon classes', 'font awesome svg vs web font'],
  about: ['Icon fonts', 'Scalable Vector Graphics', 'Font Awesome', 'Web accessibility', 'with icons'],
  related: ['svg-vs-png-icons', 'accessible-icons', 'with-icons-vs-font-awesome'],
  tldr: [
    '<strong>For most projects, use SVG icons.</strong> They stay sharp, can have several colours, and do not vanish when a font is blocked or fails to load.',
    'An icon font is a font whose “letters” are pictures. It is easy to drop in, but it is drawn like text, it is one colour per icon, and screen readers and font blockers can trip over it.',
    'Icon fonts are not “bad”, just older. They still make sense when you can only add class names (some CMS editors), when you maintain an older Font Awesome site, or for quick prototypes.',
    '<strong>Is Font Awesome an icon font?</strong> It started as one and still offers web fonts, but it also offers SVG. Its docs present both without picking a winner.',
    'with icons gives you font-style class names (<code>&lt;i class="with with-home"&gt;</code>) without a font: each class paints a real SVG, so you keep the easy markup and lose the font problems.',
  ],
  faq: [
    { q: 'Are icon fonts bad?', a: 'Not bad, but outdated for most uses. They work, and they are simple to add. Their weak spots are real, though: they can look slightly soft because they are drawn as text, each icon is one colour, they disappear or turn into boxes when a font is blocked or fails, and screen readers can read the hidden character if it is not hidden properly. SVG avoids all four.' },
    { q: 'Is Font Awesome an icon font?', a: 'Partly. Font Awesome began as an icon font and still ships “Web Fonts + CSS”, but it also offers “SVG + JS”, where JavaScript swaps each icon for an SVG. Its docs describe both and say the choice depends on your project.' },
    { q: 'Are SVG icons better for accessibility than icon fonts?', a: 'Usually, yes. An SVG is an image, so you can hide it from screen readers or give it a clear name, and it still shows when people swap in their own reading font. Icon fonts can be made accessible too, but you have to hide the glyph and add a text label yourself every time.' },
    { q: 'Do icon fonts load faster than SVG?', a: 'Not necessarily. A full icon font downloads every icon in the set, even if you show five. Lucide’s own docs warn that its font includes all icons and is not recommended for high-traffic production use. SVG components or per-icon files let you ship only the icons you use.' },
    { q: 'What are CSS-class icons, and are they a font?', a: 'CSS-class icons let you write a short tag such as <code>&lt;i class="with with-home"&gt;&lt;/i&gt;</code> and get an icon, the same way icon fonts work. In with icons they are not a font: each class points to a small SVG drawn as a CSS mask, so it takes the text colour and stays sharp.' },
    { q: 'How do I switch from an icon font to SVG?', a: 'List the icons you use, find each match in the new library, and replace them one area at a time. If you like class names, a class-based SVG library keeps your markup almost the same: <code>fa-house</code> becomes <code>with with-home</code>. If you use React or Vue, switch to component imports instead.' },
  ],
  sources: [
    { title: 'GitHub blog: Delivering Octicons with SVG (February 2016)', url: 'https://github.blog/news-insights/product-news/delivering-octicons-with-svg/' },
    { title: 'CSS-Tricks: Inline SVG vs Icon Fonts, Chris Coyier (April 2014)', url: 'https://css-tricks.com/icon-fonts-vs-svg/' },
    { title: 'Cloud Four: Seriously, Don’t Use Icon Fonts, Tyler Sticka (November 2015)', url: 'https://cloudfour.com/thinks/seriously-dont-use-icon-fonts/' },
    { title: 'Font Awesome docs: Web Fonts + CSS vs SVG + JS', url: 'https://docs.fontawesome.com/web/dig-deeper/webfont-vs-svg' },
    { title: 'Font Awesome docs: Accessibility', url: 'https://docs.fontawesome.com/web/dig-deeper/accessibility' },
    { title: 'Lucide docs: icon font (“not recommended for high traffic production use”)', url: 'https://lucide.dev/guide/static/font' },
    { title: 'Google: Material Symbols guide (variable font axes and ligatures)', url: 'https://developers.google.com/fonts/docs/material_symbols' },
    { title: 'uBlock Origin wiki: per-site switches (“No remote fonts”)', url: 'https://github.com/gorhill/uBlock/wiki/Per-site-switches' },
    { title: 'MDN: mask-image', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-image' },
    { title: 'with icons: @withicons/classes on npm', url: 'https://www.npmjs.com/package/@withicons/classes' },
  ],
  body: () => `
${p(`<span class="lede">For most websites and apps, SVG icons are the better choice. They stay sharp at every size, can use more than one colour, work with screen readers, and do not disappear when a font is blocked or fails to load. Icon fonts still work, and they make sense in a few cases, such as editors that only let you add class names, older Font Awesome sites and quick prototypes.</span>`)}
${p(`That is the short answer. Below we explain what an icon font actually is (in plain words), the five problems that pushed teams like GitHub to SVG, when a font is still a reasonable pick, and how you can keep the easy “class name” style without a font at all. We checked the facts from Font Awesome, Lucide, Google and others in November 2026. If you are choosing between SVG and PNG files instead, read our ${L.post('svg-vs-png-icons', 'SVG vs PNG guide')}.`)}

${h2('What is an icon font?')}
${p('An icon font is a font where the “letters” are little pictures. Instead of an A, the font draws a house. Instead of a B, it draws a heart. You load the font on your page, add a short tag with a class name, and the icon appears, sized and coloured just like text.')}
${p('It was a clever trick in the early 2010s. Browsers handled fonts well, and one font file could hold hundreds of icons. Font Awesome made the idea famous. Some sets still offer it today: Font Awesome’s “Web Fonts + CSS”, Lucide’s optional font, and Google’s Material Symbols, which is a variable font where you can type the icon’s name (like <code>arrow_forward</code>) and the font swaps the word for the picture.')}
${p('An SVG icon is different. SVG (Scalable Vector Graphics) is an image made of shapes, like a small recipe: “draw a line from here to there”. The browser draws it as a picture, not as a letter.')}
${table(['', 'Icon font', 'SVG icons'], [
  ['What it is', 'A font whose characters are pictures', 'A small image made of shapes'],
  ['Sharp at any size', meh('Drawn like text, can look a little soft'), yes('Drawn as a picture, crisp')],
  ['More than one colour', meh('One colour per icon (two-tone needs tricks)'), yes('Any number of colours')],
  ['If the font is blocked or fails', no('Empty space or a box'), yes('Still shows')],
  ['Screen readers', meh('Hide the character and add a label (some sets do it for you)'), yes('Hide it or name it, simple')],
  ['Download size', meh('Often the whole set at once'), yes('Only the icons you use')],
  ['Easy to add', yes('One file and a class name'), meh('Paste code, use components or class files')],
], 'Icon fonts vs SVG icons at a glance (checked November 2026)')}

${h2('Why did most teams move from icon fonts to SVG?')}
${p('GitHub described its own switch in a 2016 post about its Octicons, and the reasons are the same ones writers like Chris Coyier (CSS-Tricks, 2014) and Tyler Sticka (Cloud Four, 2015) listed. Here they are in everyday words.')}
${h3('1. Sharpness')}
${p('Browsers draw icon fonts like text, with the same smoothing they use for letters. At small sizes that can make the edges a little blurry, especially on ordinary (not “retina”) screens. GitHub said its SVG icons looked crisper. An SVG is drawn as an image, so lines land where the designer put them.')}
${sizeRamp(['home', 'heart', 'bell', 'settings'], [16, 20, 24, 32, 48], 'line', 'These are SVG icons drawn live in your browser. Each size is redrawn from shapes, so even 16 px stays crisp.')}
${h3('2. Fonts fail to load, or get blocked')}
${p('A font is a separate file, and separate files sometimes fail: a slow network, a blocked CDN, a browser hiccup. While an icon font is missing, the icon spot sits empty or shows a placeholder box. Some people also block web fonts on purpose: the popular blocker uBlock Origin has a “No remote fonts” switch, for example. Blockers leave SVG icons in the page alone.')}
${h3('3. Screen readers and reading fonts')}
${p('A screen reader reads a page out loud for people who cannot see it. If an icon font’s hidden character is not hidden properly, the screen reader may say something odd or skip it, and the button has no name. People with dyslexia often switch every font on a page to one they find easier to read, and that switch replaces the icon font too, so the icons turn into boxes or random letters. SVG icons keep showing, because they are not text.')}
${figure('a11y0', 'Screen readers and braille displays read the page as text. An SVG icon can be hidden from them or given a clear name; an icon font is a character they may try to read.')}
${h3('4. One colour per icon')}
${p(`A font character has one colour, so icon fonts are single-colour by nature. Font Awesome’s Duotone style shows that two tones are possible, but it does it by stacking two layers. SVG has no such limit, which is why you can have duo, glossy or sticker-style icons at all. See ${L.style('duo', 'duo')} or ${L.style('sticker', 'sticker')} for what extra colours add.`)}
${iconGrid(['rocket', 'heart', 'star', 'palette', 'gift', 'sun'], 'sticker', 'Sticker-style icons use several colours and a white outline. A single font character cannot do this.')}
${h3('5. Paying for icons you do not use')}
${p('Many icon fonts hold a whole set, or a big part of it, so a page showing five icons can still download hundreds. Lucide is honest about this: its docs say its icon font includes all icons and is “not recommended for high traffic production use”. With SVG you can ship only the icons on the page.')}

${h2('Is Font Awesome an icon font?')}
${p('Yes and no. Font Awesome started as an icon font, and it still offers <strong>Web Fonts + CSS</strong>. It also offers <strong>SVG + JS</strong>, where a script swaps each <code>&lt;i&gt;</code> tag for an SVG. Its docs do not crown a winner: they say the choice depends on your project.')}
${p('To be fair to Font Awesome, its docs list real strengths for the web font: it is the easiest to set up, it is a long-proven technology, and it lets you add icons with CSS alone when you cannot change the HTML. The SVG version needs JavaScript to draw the icons and, by Font Awesome’s own account, can slow down pages with many icons, though it supports extra tricks such as layering and masking. Font Awesome also handles accessibility for you by default: its web font icons are ignored by screen readers, and you add a label when an icon carries meaning.')}
${p(`So if you use Font Awesome today, you may already be on SVG. Comparing the two libraries? Our ${L.post('with-icons-vs-font-awesome', 'with icons vs Font Awesome')} post has prices, licences and the real icons side by side.`)}

${h2('When does an icon font still make sense?')}
${p('Icon fonts are not wrong. They are a tool with trade-offs, and sometimes the trade-off is worth it:')}
${ul([
  '<strong>You can only add class names.</strong> Some site builders and CMS editors let you type HTML with a class but not paste SVG code.',
  '<strong>You maintain an older site</strong> built on a Font Awesome web font, and it works. Rewriting every icon may not be worth the risk.',
  '<strong>You want adjustable weight and fill from one file.</strong> Google’s Material Symbols variable font changes fill, weight, grade and optical size with CSS settings.',
  '<strong>A quick prototype or internal tool</strong>, where a few rough edges do not matter.',
])}
${p('If any of these fit, a font is a reasonable choice. Just add labels to icon-only buttons and test the page with fonts turned off.')}

${h2('What are CSS-class icons, and are they a font?')}
${p('What most people love about icon fonts is the markup: a tiny tag like <code>&lt;i class="fa fa-home"&gt;</code> and you are done. You can keep that habit without the font.')}
${p(`with icons does this with its ${L.page('free/font-awesome-style-icon-classes.html', 'Font Awesome-style icon classes')}. You write <code>&lt;i class="with with-home"&gt;&lt;/i&gt;</code>, and a small stylesheet paints a real SVG into that tag as a CSS <em>mask</em> (a stencil the browser fills with your text colour). No font file is involved. So the icon takes your text colour and size like a font would, but it stays sharp, it survives font blockers and reading fonts, and multi-colour styles keep their colours.`)}
${p('Here is what it looks like. A loader script fetches only the icons the page uses:')}
${code(`<script src="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-loader.js" defer></script>

<i class="with with-home"></i>
<i class="with with-heart with-solid"></i>
<button aria-label="Delete"><i class="with with-trash"></i></button>`)}
${p(`Prefer no JavaScript at all? Link one stylesheet per style instead (for example <code>with-line.css</code>). Icons are decorative by default, and the empty tag means there is no stray character for a screen reader to read. Give meaningful icons a name with <code>role="img"</code> and <code>aria-label</code>, as our ${L.post('accessible-icons', 'guide to accessible icons')} explains. All ${N_ICONS} icons work this way, in all ${N_STYLES} styles, and the HTML setup is in the ${L.guide('html', 'HTML guide')}.`)}
${callout('note', 'Moving from Font Awesome classes? Many common names carry over as aliases, so <code>with-house</code> resolves to <code>home</code> and <code>with-gear</code> to <code>settings</code> (the loader adds the right class and leaves a hint in the console). If you use React, Vue or Svelte, use the component packages instead, such as <code>npm i @withicons/react</code>.')}

${h2('Icon fonts or SVG: what should you do?')}
${doDont('<p>Use SVG icons for new work: components in an app, class-based SVG icons in plain HTML, or copied SVG code. Give icon-only buttons a label, and ship only the icons you use.</p>', '<p>Rely on an icon font for buttons that matter (like “Pay” or “Delete”) without a text label, or load a whole icon font to show five icons.</p>')}
${iconGrid(['type', 'image', 'code', 'eye', 'check-circle', 'download'], 'duo', 'Font, picture, code, readability, done, download. Most of the move from fonts to SVG in six icons.')}
${p(`Not a developer? You do not need any of this. Every icon page on ${L.icons('with icons')} has Copy SVG code, SVG and PNG downloads, and our app guides show where each one goes.`)}

${h2('The bottom line')}
${p(`Icon fonts were a smart idea for their time, and they still work. SVG is simply better at the things icons need: sharp edges, real colours, clear labels for screen readers and no blank boxes when fonts fail. If you like the simplicity of class names, CSS-class icons drawn from SVG give you the same markup without the font. Browse ${L.icons('the icon library')} and pick your style.`)}
${cta('SVG icons with font-style class names', `${N_ICONS} icons in ${N_STYLES} styles as React and Vue components, a web component or &lt;i class&gt; tags. Free, MIT licensed, no font file.`, ['type', 'code', 'image', 'heart', 'sparkles', 'check-circle'])}
`,
}
