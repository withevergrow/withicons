import { p, h2, h3, ul, iconGrid, styleRow, table, yes, no, meh, callout, doDont, code, cta, art, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'change-svg-icon-color-css',
  category: 'code',
  date: '2026-11-06',
  hero: 'h-change-svg-icon-color-css',
  stickers: [['palette', 'duo'], ['paint-bucket', 'solid'], ['code', 'blueprint']],
  title: 'How do I change an SVG icon’s colour with CSS? The 2026 answer',
  cardTitle: 'Change an SVG’s colour with CSS',
  h1: 'How to change an SVG icon’s colour <em>with CSS</em>',
  dek: 'The top answers online still reach for Modernizr, jQuery and filter hacks. Here is what works today: currentColor for inline SVG, a CSS mask for image files, and CSS variables for icons with more than one colour.',
  description: 'Change an SVG icon’s colour with CSS today: currentColor for inline SVG, mask-image for img and background files, CSS variables for multi-colour icons.',
  keywords: ['change svg color css', 'svg icon color css', 'change svg fill color', 'img svg change color', 'svg background image color', 'svg currentcolor', 'css mask-image svg', 'svg fill not working', 'svg color on hover', 'multi-color svg css variables'],
  about: ['Scalable Vector Graphics', 'Cascading Style Sheets', 'currentColor', 'CSS masking', 'with icons'],
  related: ['how-to-change-icon-color', 'svg-icons-in-css', 'dark-mode-icons'],
  tldr: [
    '<strong>Put the SVG in the page and paint it with <code>currentColor</code>.</strong> Then CSS <code>color</code> sets the icon’s colour, and hover, focus and dark mode just work.',
    '<strong>An SVG in <code>&lt;img&gt;</code> or <code>background-image</code> cannot be recoloured</strong> by your page’s CSS. It is a separate document, so <code>fill</code> never reaches inside.',
    '<strong>For an SVG file you can only point to, use a CSS mask:</strong> <code>mask-image: url(icon.svg)</code> plus <code>background-color: currentColor</code>. It has been Baseline (works in every major browser) since December 2023.',
    'Skip the old tricks: <code>&lt;object&gt;</code> tags, jQuery that swaps images for inline code, and <code>filter: invert() sepia() hue-rotate()</code> chains that only get close to a colour.',
    'For icons with several colours, use CSS variables inside the SVG. with icons works this way: <code>--with-duo</code> or <code>--with-clay-c1</code> recolours one part, and in most styles <code>color</code> still sets the outline.',
  ],
  faq: [
    { q: 'Why does fill not change my SVG’s colour?', a: 'Usually for one of three reasons. The SVG is in an <code>&lt;img&gt;</code> tag or a CSS background, where page CSS cannot reach. Or the paths inside have their own <code>fill="#000"</code>, which beats a colour you set on the outer <code>&lt;svg&gt;</code>. Or it is an outline icon, which is drawn with <code>stroke</code>, not <code>fill</code>. Replace the hard-coded colours with <code>currentColor</code> and set <code>color</code> instead.' },
    { q: 'Can I change the colour of an SVG in an img tag?', a: 'Not directly. An SVG loaded through <code>&lt;img src&gt;</code> is drawn as a separate image, so your page’s CSS cannot style its insides. Either paste the SVG into the page (or use an icon component), or keep the file and show it through a CSS mask with <code>background-color: currentColor</code>.' },
    { q: 'How do I change an SVG background-image colour?', a: 'Use the same file as a mask instead of a background: <code>mask: url(icon.svg) center / contain no-repeat; background-color: currentColor;</code>. The mask cuts the shape out, and the background colour fills it, so you can change it on hover or in dark mode.' },
    { q: 'Is CSS mask-image supported in all browsers now?', a: 'Yes. MDN lists <code>mask-image</code> as Baseline Widely available, working across browsers since December 2023, when Chrome 120 dropped the need for the <code>-webkit-</code> prefix. Keep a <code>-webkit-mask</code> line only if you support older browsers.' },
    { q: 'Should I use CSS filter to recolour an SVG?', a: 'Only as a last resort. A chain like <code>invert() sepia() saturate() hue-rotate()</code> approximates a colour, needs a calculator for each new colour, and changes everything in the image. For icons, <code>currentColor</code> or a mask gives you the exact colour with one line.' },
    { q: 'How do I change the colours of a multi-colour SVG icon?', a: 'Give each colour in the SVG a CSS variable with a fallback, such as <code>fill="var(--icon-accent, #f59e0b)"</code>, and set the variable in your CSS. It works for inline SVG, components and sprites. It does not work for <code>&lt;img&gt;</code> files, which cannot see your CSS.' },
  ],
  sources: [
    { title: 'MDN: mask-image (Baseline Widely available since December 2023), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-image' },
    { title: 'web.dev: New to the web platform in November 2023 (Chrome 120 unprefixes mask properties)', url: 'https://web.dev/blog/web-platform-11-2023' },
    { title: 'MDN: mask-mode (image masks use alpha by default), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-mode' },
    { title: 'MDN: the SVG fill attribute (“the CSS property takes priority”), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/fill' },
    { title: 'MDN: the currentColor keyword, checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value' },
    { title: 'MDN: SVG as an image (restrictions in img and background-image), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_as_an_image' },
    { title: 'Stack Overflow: How can I change the color of an SVG element? (question 22252472)', url: 'https://stackoverflow.com/questions/22252472/how-can-i-change-the-color-of-an-svg-element' },
    { title: 'with icons: @withicons/core README (palette variables), checked November 2026', url: 'https://www.npmjs.com/package/@withicons/core' },
  ],
  body: () => `
${p(`<span class="lede">To change an SVG icon’s colour with CSS, put the SVG in your page (pasted in, as a component, or through a sprite) with <code>fill</code> or <code>stroke</code> set to <code>currentColor</code>, then set the CSS <code>color</code> property. If the SVG is a file you can only point to, in an <code>&lt;img&gt;</code> tag or a CSS background, you cannot recolour it directly: show it through a CSS mask with <code>background-color: currentColor</code> instead. Masks have worked in every major browser since December 2023.</span>`)}
${p(`Below: why <code>fill</code> sometimes refuses to work, the mask method, multi-colour icons, and a table of every method. Not a developer? Our ${L.post('how-to-change-icon-color', 'everyday guide to changing icon colours')} covers slides, documents and design tools without any code.`)}

${callout('note', `<p>The accepted Stack Overflow answer to this question, seen millions of times, dates from 2014: <code>&lt;object&gt;</code> tags, Modernizr tests and PNG fallbacks. Others swap images for inline code with jQuery, or chain CSS filters. Since then, inline SVG with <code>currentColor</code> became the norm, and in December 2023 Chrome 120 shipped CSS masks without a prefix, so the mask method now works everywhere.</p>`, 'What changed since the old answers')}

${h2('Why can’t I change the colour of an SVG in an img tag?')}
${p('When you write <code>&lt;img src="icon.svg"&gt;</code> or <code>background-image: url(icon.svg)</code>, the browser treats the SVG as a picture, much like a PNG. It opens the file as its own little document, draws it and shows the result. MDN’s guide to SVG as an image lists the limits: scripts are switched off and external files cannot load. Your page’s stylesheet does not reach inside either, so a rule like <code>img path { fill: red }</code> has nothing to match.')}
${p('So the real question is whether the SVG’s shapes can live in your page. If yes, CSS can colour them. If no, you colour the space the image fills instead, with a mask.')}

${h2('How do I change an inline SVG’s colour with CSS?')}
${p(`Paint the icon with <code>currentColor</code>. That keyword means “whatever the CSS <code>color</code> is here”, the same colour as the text around it. Set it once on the SVG, and the icon follows its parent: link colour, button colour, hover colour, dark mode colour.`)}
${code(`<!-- the icon paints its outline with currentColor -->
<a class="nav-link" href="/">
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
       stroke="currentColor" stroke-width="1.75" aria-hidden="true">
    <path d="M2.5 11 L12 3.5 L21.5 11"/>
    <path d="M5 9.5 V19 A2 2 0 0 0 7 21 H17 A2 2 0 0 0 19 19 V9.5"/>
  </svg>
  Home
</a>

<style>
  .nav-link { color: #475569; }
  .nav-link:hover { color: #e11d48; }   /* the icon turns red too */
</style>`)}
${p(`That snippet is the real ${L.icon('home', 'home icon')} from with icons, trimmed a little. Every one of our ${N_ICONS} icons ships this way: the ink is <code>currentColor</code>, so you never write a colour into the SVG at all. The icons below are drawn the same way, and they take this page’s text colour.`)}
${iconGrid(['home', 'search', 'bell', 'heart', 'settings', 'mail'], 'line', 'Line icons painted with currentColor: they use whatever text colour surrounds them, so one CSS rule restyles the whole set.')}
${p(`Components work the same way. <code>@withicons/react</code>, the Vue, Svelte, Angular and Solid packages and the <code>&lt;with-icon&gt;</code> web component all default to <code>currentColor</code>, and a <code>color</code> prop is only a shortcut for setting it. SVG sprites with <code>&lt;use href="#home"&gt;</code> also inherit <code>color</code>, which our post on ${L.post('svg-sprites', 'how SVG sprites work')} covers in detail.`)}

${h2('Why is my fill or stroke not changing?')}
${p('If you pasted an SVG into the page and <code>color</code> or <code>fill</code> still does nothing, one of these traps is almost always the cause:')}
${h3('1. The paths have their own colour')}
${p('Many exported SVGs carry <code>fill="#000"</code> on every <code>&lt;path&gt;</code>. A colour you set on the outer <code>&lt;svg&gt;</code> is only inherited, and a colour written on the path itself wins over an inherited one. Fix it at the source: replace those values with <code>currentColor</code> (or delete them so the path inherits). As a quick patch, a CSS rule that targets the paths also works, because MDN notes that when the attribute and the CSS property are both set, “the CSS property takes priority”.')}
${h3('2. It is an outline icon, and you set fill')}
${p('Outline icons are drawn with <code>stroke</code> (the line) and <code>fill="none"</code>. Setting <code>fill: red</code> turns their insides into red blobs, and the outline stays black. Use <code>stroke</code> for line icons, <code>fill</code> for solid ones, or simply use <code>currentColor</code> in the file and change <code>color</code>, which covers both.')}
${h3('3. An inline style or a more specific rule beats yours')}
${p('A <code>style="fill:#333"</code> inside the SVG outranks your stylesheet, and so does a more specific library selector. Your browser’s developer tools show which rule wins.')}
${h3('4. You are trying to reach inside a <code>&lt;use&gt;</code> copy')}
${p('An icon drawn with <code>&lt;use&gt;</code> is a copy in a hidden “shadow tree”, so selectors like <code>.icon path</code> cannot reach it. Inherited values still flow in, though: <code>color</code>, <code>fill</code> and CSS variables set on the <code>&lt;svg&gt;</code> or <code>&lt;use&gt;</code> all reach the copy.')}
${doDont('<p>Write <code>currentColor</code> into the SVG once, then change <code>color</code> in CSS for every state: default, hover, active, disabled, dark mode.</p>', '<p>Hard-code <code>fill="#000"</code> in the file and then fight it with <code>!important</code> rules, or set <code>fill</code> on an outline icon and wonder why it turns into a blob.</p>')}

${h2('How do I change the colour of an SVG used as an img or background-image?')}
${p('Use the SVG as a <em>mask</em>: a stencil. The element gets a background colour, and the mask cuts that colour into the icon’s shape. Because the background is <code>currentColor</code>, the icon follows your text colour just like inline SVG does.')}
${code(`.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  background-color: currentColor;   /* the colour you see */
  mask: url("/icons/home.svg") center / contain no-repeat;   /* the shape */
}
.button:hover .icon { color: #e11d48; }   /* or change color on the icon itself */`)}
${p('The file’s own colours do not matter here. For an image mask, the browser only reads how opaque each pixel is (MDN’s <code>mask-mode</code> page explains that image masks use alpha by default), so a black icon, a red icon and a grey icon all produce the same stencil. The colour comes entirely from <code>background-color</code>.')}
${p('Support is no longer a worry. MDN lists <code>mask-image</code> as Baseline Widely available since December 2023, the month Chrome 120 removed the need for the <code>-webkit-</code> prefix. If you must support browsers older than that, add the same value as <code>-webkit-mask</code> above the unprefixed line.')}
${art('m-change-svg-icon-color-css-mask', 'A CSS mask works like a stencil: the SVG gives the shape, background-color gives the colour.', { brief: 'A three-step explainer, left to right with plus and equals signs: (1) a coloured square swatch labelled “background-color: currentColor”, (2) the with icons home icon in line style drawn as a black stencil labelled “mask: url(home.svg)”, (3) the result: the home icon in the swatch colour, labelled “the icon”. Under the result, show the same icon three times in three colours (slate, rose, white on dark) labelled “color changes, shape stays”.' })}
${p(`The mask method has one limit: it gives you a single colour, because the stencil only knows “icon” or “not icon”. That suits line and solid icons perfectly. For more about icons in pseudo-elements and data URIs, read our post on ${L.post('svg-icons-in-css', 'SVG icons in CSS')}.`)}

${h2('What about CSS filter to recolour an SVG?')}
${p('You will still see answers like <code>filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg)</code>. Filters work on the finished picture, so they can push a black icon toward a target colour. They are a hack for icons, though. You need a generator to work out each new colour, the result is only close to the colour you asked for, hover needs a second chain, and the filter shifts every colour in the image, not just the one you wanted.')}
${p('A filter is fine when you cannot touch the markup at all, or for a general effect such as greying out a disabled picture. For a brand colour on an icon, use <code>currentColor</code> or a mask.')}

${h2('How do I change the colours of a multi-colour SVG icon?')}
${p('A mask only gives one colour, and <code>currentColor</code> is only one value. For icons with two or more colours, put a CSS variable (a custom property) on each extra colour inside the SVG, with a default after the comma:')}
${code(`<svg viewBox="0 0 24 24" class="badge-icon">
  <path fill="var(--icon-fill, #fde68a)" d="..."/>   <!-- the soft body -->
  <path stroke="currentColor" fill="none" d="..."/>  <!-- the outline -->
</svg>

<style>
  .badge-icon { color: #1e293b; --icon-fill: #bfdbfe; }
</style>`)}
${p(`Variables pass through inheritance, so this works for inline SVG, components and sprites drawn with <code>&lt;use&gt;</code>. It does not work for <code>&lt;img&gt;</code> files or data URIs, which cannot see your CSS. That is why with icons ships two kinds of SVG download on every icon page: a plain SVG with the colours written in, and a <em>themable</em> SVG that keeps <code>currentColor</code> and the variables for developers.`)}
${p(`Our multi-colour styles are built exactly like this. In ${L.style('duo')} the soft tint is <code>--with-duo</code> and the accent detail is <code>--with-duo-accent</code>. Palette styles such as ${L.style('clay')}, ${L.style('kawaii')} or ${L.style('sticker')} give every colour its own variable, for example <code>--with-clay-c1</code> for the main body of a clay icon (each style’s full list is in the <code>@withicons/core</code> README). In styles whose outline is <code>currentColor</code>, such as kawaii, <code>color</code> still sets the outline. Each icon also comes with 20 to 30 hand-picked palettes that set the right variables for you, in every style at once.`)}
${styleRow('heart', 'The same heart in four multi-colour styles. Each extra colour is a CSS variable with a default, so one line of CSS recolours a page, a section or a single icon.', { styles: ['duo', 'kawaii', 'sticker', 'clay'] })}
${code(`/* recolour the body of every clay icon in this section, no SVG edits */
.promo { --with-clay-c1: #a78bfa; }`)}
${art('m-change-svg-icon-color-css-variables', 'One icon, three themes: only the CSS variables change.', { brief: 'A before and after row of the with icons heart icon in clay style, shown three times on soft cards. Card 1 “default”, card 2 “--with-clay-c1: lavender”, card 3 “--with-clay-c1: mint”, with the clay body colour visibly changing while the shine and shadow stay the same. Beneath each card, a tiny monospace label with the one CSS line that made the change.' })}

${h2('Which method should I use? Every option side by side')}
${table(['Method', 'Recolour with CSS', 'Hover and dark mode', 'Several colours', 'Best for'], [
  ['Inline SVG or a component, painted with <code>currentColor</code>', yes(), yes('Follows <code>color</code>'), yes('With CSS variables'), 'Interface icons in apps and sites'],
  ['Sprite with <code>&lt;use href&gt;</code>', yes(), yes('Follows <code>color</code>'), yes('Variables pass in'), 'Many icons, one cached file'],
  ['CSS mask + <code>background-color: currentColor</code>', yes(), yes(), no('One colour'), 'CSS-only icons, pseudo-elements, files you cannot inline'],
  ['<code>&lt;img src="icon.svg"&gt;</code>', no(), no(), meh('Only the colours in the file'), 'Logos and illustrations that never change colour'],
  ['CSS <code>background-image</code>', no(), no(), meh('Only the colours in the file'), 'Decoration in fixed colours'],
  ['CSS <code>filter</code> chain', meh('Close, not exact'), meh('A second chain per state'), no(), 'Last resort when you cannot change the markup'],
  ['<code>&lt;object&gt;</code> or jQuery swaps (2012-2014 answers)', meh('With scripts'), meh(), meh(), 'Nothing new: use inline SVG instead'],
], 'Ways to colour an SVG icon with CSS, checked November 2026')}
${ul([
  '<strong>Building an app or site with a framework?</strong> Use an icon component. It is inline SVG with <code>currentColor</code> already done.',
  '<strong>Plain HTML, and you want the icon to follow the text?</strong> Paste inline SVG, or use a sprite if the same icons repeat.',
  `<strong>Only CSS, or icons in <code>::before</code>?</strong> Use the mask method. with icons’ <code>&lt;i class="with with-home"&gt;</code> classes do exactly this for you, see ${L.page('free/font-awesome-style-icon-classes.html', 'Font Awesome-style icon classes')}.`,
  '<strong>A logo or illustration whose colours are fixed?</strong> A plain <code>&lt;img&gt;</code> is perfect. Not everything needs to be recolourable.',
])}

${h2('How do I change an SVG icon’s colour on hover or in dark mode?')}
${p('Once the icon uses <code>currentColor</code> (inline or masked), you never style the icon itself. You style the text colour of whatever holds it:')}
${code(`button { color: #334155; }
button:hover, button:focus-visible { color: #2563eb; }

@media (prefers-color-scheme: dark) {
  button { color: #e2e8f0; }   /* every icon inside follows */
}`)}
${p(`One rule covers the label and the icon together, so they never drift apart. Our guide to ${L.post('dark-mode-icons', 'icons in dark mode')} goes further, including multi-colour styles on dark backgrounds.`)}
${iconGrid(['sun', 'moon', 'eye', 'palette', 'paint-bucket', 'sparkles'], 'solid', 'Solid icons masked or inlined with currentColor switch with your theme automatically.')}

${h2('The short version')}
${p(`Inline the SVG and paint it with <code>currentColor</code>; use a CSS mask when the SVG has to stay a file; use CSS variables when an icon has more than one colour. Leave filters for photos and <code>&lt;object&gt;</code> tags for the history books. Every icon in ${L.icons('the with icons library')} is ready for all three: copy the SVG code, download the themable SVG, or grab the CSS class from the icon page. For a no-build setup, start with the ${L.guide('html', 'HTML guide')} or the ${L.page('free/svg-icons.html', 'free SVG icons page')}.`)}
${cta('Icons that take your colour', `${N_ICONS} icons in ${N_STYLES} styles, painted with currentColor and CSS variables. React, Vue, web component, CSS classes or plain SVG. Free and MIT licensed.`, ['palette', 'paint-bucket', 'code', 'heart', 'sparkles', 'sun'])}
`,
}
