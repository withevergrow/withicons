import { p, h2, h3, ul, iconGrid, styleRow, table, yes, no, meh, callout, doDont, code, cta, art, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'svg-icons-in-css',
  category: 'code',
  date: '2026-11-06',
  hero: 'h-svg-icons-in-css',
  stickers: [['code', 'blueprint'], ['image', 'duo'], ['sparkles', 'solid']],
  title: 'Can I use an SVG icon in CSS ::before, ::after or background?',
  cardTitle: 'SVG icons in CSS',
  h1: 'SVG icons in CSS: <em>::before</em>, backgrounds and data URIs',
  dek: 'Old answers say you cannot colour an SVG in a pseudo-element, or tell you to base64 it “for IE”. Both are out of date. Here is the 2026 way: a CSS mask, a properly encoded data URI and one line of currentColor.',
  description: 'Yes, you can put an SVG icon in ::before, ::after or a background. Colour it with a CSS mask and currentColor, and URL-encode data URIs instead of base64.',
  keywords: ['svg in css', 'svg in before pseudo element', 'svg ::after css', 'change svg color in before', 'svg data uri css', 'encode svg for css url', 'svg background image color', 'css mask svg icon', 'svg base64 vs url encoded', 'css icon classes'],
  about: ['Scalable Vector Graphics', 'Cascading Style Sheets', 'Data URI scheme', 'CSS masking', 'with icons'],
  related: ['change-svg-icon-color-css', 'icon-fonts-vs-svg', 'align-icon-with-text'],
  tldr: [
    '<strong>Yes, an SVG works in <code>::before</code>, <code>::after</code> and <code>background-image</code></strong>, either as a file URL or written straight into the CSS as a data URI.',
    '<strong>To give it your text colour, use it as a mask:</strong> <code>content: ""</code>, <code>background-color: currentColor</code> and <code>mask: url(…)</code>. Masks have been Baseline (every major browser) since December 2023.',
    '<strong>URL-encode data URIs instead of using base64.</strong> Encode <code>#</code> as <code>%23</code>, use single quotes inside the SVG, and the result stays readable and about a third smaller than base64.',
    '<code>content: url(icon.svg)</code> works but is the weakest choice: the image cannot take your text colour and does not size with CSS reliably.',
    'with icons’ CSS classes, <code>&lt;i class="with with-home"&gt;</code>, use exactly this technique: an encoded SVG as a mask in <code>::after</code>, filled with <code>currentColor</code>.',
  ],
  faq: [
    { q: 'Can I change the fill colour of an SVG in ::before or ::after?', a: 'Not by changing <code>fill</code>, because an SVG in <code>url()</code> is a separate image that your CSS cannot reach. Instead, use the SVG as a mask on the pseudo-element and set <code>background-color: currentColor</code>. The icon then takes the text colour and changes on hover like text does.' },
    { q: 'Do I need to base64-encode an SVG for CSS?', a: 'No. Base64 was common advice for old Internet Explorer. Today every browser reads a URL-encoded SVG data URI: <code>data:image/svg+xml,</code> followed by the SVG with <code>#</code> written as <code>%23</code> and single quotes inside. It is smaller than base64 and you can still read and edit it.' },
    { q: 'Why does my SVG data URI work in Chrome but not Firefox?', a: 'Almost always because of an unencoded <code>#</code>, usually in a hex colour like <code>#ff0000</code>. In a URL, <code>#</code> starts a fragment, so everything after it is cut off. Encode it as <code>%23</code>, or use <code>currentColor</code> or a named colour instead of hex.' },
    { q: 'Does currentColor work inside an SVG background image?', a: 'No. Inside a <code>url()</code> image, <code>currentColor</code> refers to the image’s own default colour, usually black, not your page’s text colour. To follow the text colour, put <code>currentColor</code> on the element’s <code>background-color</code> and use the SVG as a mask.' },
    { q: 'How do I make a CSS-only icon class?', a: 'Make an empty inline-block element 1em square, give its <code>::after</code> (or itself) <code>background-color: currentColor</code>, and set a mask to the encoded SVG. Libraries such as <code>@withicons/classes</code> ship one rule per icon, so <code>&lt;i class="with with-home"&gt;&lt;/i&gt;</code> is all you write.' },
  ],
  sources: [
    { title: 'MDN: mask-image (Baseline Widely available since December 2023), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-image' },
    { title: 'web.dev: New to the web platform in November 2023 (Chrome 120 unprefixes mask properties)', url: 'https://web.dev/blog/web-platform-11-2023' },
    { title: 'MDN: data: URLs (reserved characters must be percent-encoded), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/data' },
    { title: 'MDN: the content property (generated content and accessibility), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content' },
    { title: 'MDN: SVG as an image, checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_as_an_image' },
    { title: 'Stack Overflow: Change SVG fill color in :before or :after CSS (question 21509982)', url: 'https://stackoverflow.com/questions/21509982/change-svg-fill-color-in-before-or-after-css' },
    { title: 'Stack Overflow: Inline SVG in CSS (question 10768451)', url: 'https://stackoverflow.com/questions/10768451/inline-svg-in-css' },
    { title: 'with icons: @withicons/classes README, checked November 2026', url: 'https://www.npmjs.com/package/@withicons/classes' },
  ],
  body: () => `
${p(`<span class="lede">Yes, you can use an SVG icon in CSS <code>::before</code>, <code>::after</code> or <code>background-image</code>, either as a link to a file or written into the stylesheet as a data URI. To make it take your text colour, do not try to change its <code>fill</code>: use the SVG as a <em>mask</em> on an empty pseudo-element whose <code>background-color</code> is <code>currentColor</code>. For data URIs, URL-encode the SVG (write <code>#</code> as <code>%23</code>) instead of converting it to base64.</span>`)}
${p(`That is the short answer, and it works in every major browser today. Below we show the three ways to put an SVG in CSS, why <code>fill</code> cannot reach it, how to encode a data URI correctly, and how ready-made CSS icon classes like ours use the same trick. If you only need to recolour an icon in HTML, start with our post on ${L.post('change-svg-icon-color-css', 'changing an SVG icon’s colour with CSS')} instead.`)}

${callout('note', `<p>The accepted answer to “change SVG fill colour in :before” on Stack Overflow (2014) says it cannot be done. Answers to “inline SVG in CSS” from 2012 to 2019 push base64 “for IE”, swap hex colours for <code>rgb()</code> to dodge the <code>#</code> problem, and wave off masks as “sadly not widely supported”. Internet Explorer is long retired, and since Chrome 120 (December 2023) the unprefixed mask properties work across browsers. MDN now lists <code>mask-image</code> as Baseline Widely available.</p>`, 'What changed since the old answers')}

${h2('Can I put an SVG in ::before or ::after?')}
${p('Yes, in three ways. They look similar in code, but they behave very differently:')}
${code(`/* 1. content: url() inserts the SVG as an image */
.a::before { content: url("icons/check.svg"); }

/* 2. background-image paints the SVG behind an empty box */
.b::before {
  content: "";
  display: inline-block; width: 1em; height: 1em;
  background: url("icons/check.svg") center / contain no-repeat;
}

/* 3. mask cuts the box into the icon's shape, then currentColor fills it */
.c::before {
  content: "";
  display: inline-block; width: 1em; height: 1em;
  background-color: currentColor;
  mask: url("icons/check.svg") center / contain no-repeat;
}`)}
${p('The first is the shortest, but it is the least flexible: the browser draws the file at its own size and in its own colours, and setting a width on the pseudo-element does not reliably scale it. The second sizes nicely with <code>em</code> but keeps the file’s colours. The third is the one you want for interface icons: it sizes with the text and takes the text colour.')}
${iconGrid(['check', 'arrow-right', 'external-link', 'info-circle', 'lock', 'download'], 'line', 'Icons that often live in pseudo-elements: list ticks, “more” arrows, external-link markers, notes, locked items and download links.')}

${h2('Why can’t I change the fill of an SVG in ::before?')}
${p('An SVG referenced through <code>url()</code>, whether in <code>content</code>, <code>background-image</code> or a mask, is loaded as a separate image. MDN’s page on SVG as an image explains that it runs in its own sandbox: no scripts, no external files. Your page’s CSS stays outside too, so <code>.c::before { fill: red }</code> has nothing to paint.')}
${p('This also explains a common surprise: <code>currentColor</code> written <em>inside</em> a data URI does not mean your text colour. Inside the image, it means the image’s own default colour, which is usually black. The fix is to move <code>currentColor</code> out of the SVG and onto the element, as <code>background-color</code>, and let the SVG only provide the shape.')}

${h2('How do I colour an SVG icon in a pseudo-element?')}
${p('With the mask method above. A mask works like a stencil: wherever the SVG is drawn, the element’s background shows through, and everywhere else it is transparent. For image masks the browser only reads opacity, so the colours in the file do not matter: a black icon is a perfect stencil. Because the background is <code>currentColor</code>, the icon follows the text on hover, in dark mode and inside coloured buttons.')}
${code(`a.external::after {
  content: "";
  display: inline-block;
  width: 0.9em;
  height: 0.9em;
  margin-inline-start: 0.25em;
  vertical-align: -0.1em;
  background-color: currentColor;
  mask: url("icons/external-link.svg") center / contain no-repeat;
}
a.external:hover { color: #e11d48; }   /* link text and icon change together */`)}
${p(`If you still support browsers older than late 2023, add the same value as <code>-webkit-mask</code> above the unprefixed line. The only real limit of a mask is that it gives one colour. For two-tone or full-colour icons, use the <code>background-image</code> method with the colours baked in, or inline SVG with CSS variables.`)}
${art('m-svg-icons-in-css-mask-anatomy', 'How a CSS mask icon is built: an empty box, a colour, and an SVG used as a stencil.', { brief: 'An exploded, layered diagram in isometric perspective. Bottom layer: an empty rounded square labelled “::before, 1em x 1em”. Middle layer: the same square filled with a solid colour labelled “background-color: currentColor”. Top layer: the with icons external-link icon (line style) as a black stencil labelled “mask: url(icon.svg)”. On the right, the flat result sitting after the words “Read the docs” in a link, in the link colour.' })}

${h2('How do I write an SVG data URI for CSS?')}
${p('A data URI puts the file’s contents right inside the <code>url()</code>, so there is no extra download. Start with <code>data:image/svg+xml,</code> and follow it with the SVG code, encoded so the browser reads it as one URL. MDN’s rule for data URLs is that reserved characters “must be percent-encoded”. For SVG in CSS that comes down to a few simple rules:')}
${ul([
  '<strong>Encode <code>#</code> as <code>%23</code>.</strong> This is the one that breaks things: in a URL, <code>#</code> starts a fragment, so a hex colour like <code>#ff0000</code> silently cuts off the rest of your icon.',
  '<strong>Use single quotes inside the SVG</strong> and double quotes around the <code>url("…")</code>, so they never clash.',
  '<strong>Keep the <code>xmlns</code></strong> (<code>xmlns=\'http://www.w3.org/2000/svg\'</code>). An image without it may not draw at all.',
  '<strong>Remove line breaks, and encode <code>%</code>, <code>&lt;</code> and <code>&gt;</code></strong> to stay strictly valid. Browsers tolerate raw angle brackets, but encoding them costs nothing.',
])}
${code(`/* readable, small, works everywhere */
.icon-check {
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4.5 12.5 L9.5 17.5 L19.5 6.5'/%3E%3C/svg%3E") center / contain no-repeat;
}`)}
${h3('URL-encoded or base64?')}
${p('Base64 turns every 3 bytes into 4 characters, so the same icon is about a third larger, and you can no longer read or tweak it. It became popular because old Internet Explorer handled it more reliably. Today, URL-encoded is the better default. Base64 is still handy when a tool or API only accepts base64, which is why our icon pages offer both.')}
${doDont('<p>Write <code>data:image/svg+xml,</code> plus the SVG with <code>#</code> as <code>%23</code> and single quotes inside. Put <code>currentColor</code> on <code>background-color</code> and use the SVG as a mask.</p>', '<p>Base64-encode icons “for IE”, leave raw <code>#</code> characters in hex colours, or put <code>fill="currentColor"</code> inside a data URI and expect it to follow your text.</p>')}
${p(`You do not have to encode anything by hand. Every icon page on ${L.icons('with icons')} has code exports for a ready <strong>Data URI</strong> (one line for <code>url()</code>), a <strong>Base64</strong> version, and a <strong>CSS</strong> file with two classes: one that shows the icon in full colour as a background, and a <code>-mask</code> class that takes the text colour.`)}

${h2('Is content: url() a good way to add an icon?')}
${p('It is fine for a quick decoration in fixed colours, but it has three weak spots. The image cannot take your text colour. It is drawn at the size written in the SVG file, and changing the pseudo-element’s width or height does not reliably scale it. And generated content is awkward for screen readers: MDN warns that it is not part of the page’s content, so some assistive tools will not announce it while others might.')}
${p(`So treat pseudo-element icons as decoration. Use an empty <code>content: ""</code> with a mask, and if the icon carries meaning (an icon-only button, a warning sign), give the element itself a text label. Our guide to ${L.post('accessible-icons', 'accessible icons')} shows how.`)}
${table(['Method', 'Takes the text colour', 'Sizes with CSS', 'Several colours', 'Best for'], [
  ['Mask + <code>background-color: currentColor</code>', yes(), yes(), no('One colour'), 'Interface icons in CSS: lists, links, buttons'],
  ['<code>background-image: url()</code>', no(), yes(), yes('As drawn in the file'), 'Full-colour decorations, multi-colour styles'],
  ['<code>content: url()</code>', no(), meh('Drawn at the file’s own size'), yes('As drawn in the file'), 'Quick, fixed decorations'],
  ['Inline SVG in the HTML', yes(), yes(), yes('With CSS variables'), 'Anything interactive or themable'],
], 'SVG icons in CSS: the options compared (checked November 2026)')}

${h2('How do with icons CSS classes work?')}
${p(`Our CSS classes are this whole post, packaged. You write an empty tag, and a tiny stylesheet does the rest:`)}
${code(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-line.css">

<i class="with with-home"></i>
<button><i class="with with-download"></i> Download</button>`)}
${p('Under the hood, the <code>.with</code> base rule makes the tag an inline block 1em square, nudged down with <code>vertical-align: -0.125em</code> so it sits nicely beside text. Its <code>::after</code> has <code>background-color: currentColor</code> and a mask read from a CSS variable. Each icon’s rule, such as <code>.with-home</code>, only sets that variable to an encoded SVG data URI. A <code>line</code> icon rule is typically about 464 bytes, or 292 bytes gzipped.')}
${p(`Because it is a mask over <code>currentColor</code>, the icon takes your text colour and font size, like an icon font did, but without a font file: nothing turns into boxes when fonts are blocked. Our post on ${L.post('icon-fonts-vs-svg', 'icon fonts vs SVG')} explains why that matters. You can link one stylesheet per style, or add <code>with-loader.js</code>, which fetches only the icons the page uses.`)}
${styleRow('star', 'The star icon as CSS classes. Line, solid and duo are single masks; palette styles such as sticker and retro add their colours as a background under the mask.', { styles: ['line', 'solid', 'duo', 'sticker', 'retro', 'pixel'] })}
${p(`Multi-colour styles show the limits of pure CSS honestly. In ${L.style('sticker')} or ${L.style('retro')}, the palette is painted as the element’s <code>background-image</code> with its default colours baked in, and the outline is the <code>currentColor</code> mask on top. Your <code>--with-*</code> colour variables cannot reach into a data URI, so to re-theme those colours you switch to the small JavaScript runtime (<code>with-icons.js</code>), which draws real inline SVG instead.`)}
${art('m-svg-icons-in-css-class-anatomy', 'What one CSS icon class is made of: an empty tag, a base rule and one variable per icon.', { brief: 'A code-annotation diagram. Left: the HTML <i class="with with-home"></i> in a code card. Arrows point to two stacked rule cards: “.with: 1em box, vertical-align -0.125em, ::after = currentColor + mask” and “.with-home: --with-i: url(data:image/svg+xml,…)”. Right: the result, the with icons home icon in line style next to the word “Home” in three text colours (slate, teal, white on navy).' })}
${callout('tip', `Moving from Font Awesome classes? Many familiar names work as aliases (<code>with-house</code> becomes <code>home</code>, <code>with-gear</code> becomes <code>settings</code>) when you use the loader. The ${L.page('free/font-awesome-style-icon-classes.html', 'Font Awesome-style icon classes page')} and the ${L.guide('html', 'HTML guide')} have the full setup.`)}

${h2('When should I use inline SVG instead?')}
${p(`CSS icons are great for decoration you control from a stylesheet: list bullets, link markers, icons inside search fields (see ${L.post('icon-inside-input-field', 'how to put an icon inside an input')}). Reach for inline SVG or a component when an icon needs several colours you change at run time, an animated stroke, or its own accessible name. Frameworks make that easy: <code>@withicons/react</code>, Vue, Svelte and the <code>&lt;with-icon&gt;</code> web component all render inline SVG with <code>currentColor</code>.`)}
${iconGrid(['code', 'image', 'palette', 'layers', 'paint-bucket', 'sparkles'], 'duo', 'CSS for decoration, inline SVG for anything you theme, animate or label.')}

${h2('The short version')}
${p(`SVG in <code>::before</code>, <code>::after</code> and backgrounds works everywhere. Use it as a mask over <code>currentColor</code> to get your text colour, URL-encode your data URIs with <code>%23</code> for <code>#</code>, and skip base64 unless a tool demands it. Or skip the encoding entirely: all ${N_ICONS} with icons, in all ${N_STYLES} styles, come as ready CSS classes and as Data URI and CSS exports on every ${L.icon('home', 'icon page')}.`)}
${cta('CSS icons without the encoding', `${N_ICONS} icons in ${N_STYLES} styles as &lt;i class&gt; tags, data URIs or inline SVG. No font file, MIT licensed, free.`, ['code', 'image', 'palette', 'star', 'sparkles', 'check'])}
`,
}
