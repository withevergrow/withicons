import { p, h2, h3, ul, figure, iconGrid, styleRow, sizeRamp, table, yes, no, meh, callout, steps, code, cta, doDont, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'how-to-add-icons-to-a-website',
  category: 'guides',
  date: '2026-10-02',
  hero: 'startup1',
  stickers: [['globe', 'gloss'], ['upload', 'duo'], ['code', 'blueprint']],
  title: 'How to add icons to your website (no coding needed)',
  cardTitle: 'Add icons to your website',
  h1: 'How to add icons to your website (<em>no coding</em> needed)',
  dek: 'Whether your site runs on WordPress, Wix, Squarespace, Webflow, Framer or Shopify, adding icons takes a few clicks. The only real question is whether to use a PNG or an SVG, and that depends on your platform.',
  description: 'Add free icons to WordPress, Wix, Squarespace, Webflow, Framer, Shopify or HTML: which file to upload, SVG support per platform, and quick fixes.',
  keywords: ['add icons to website', 'icons for WordPress', 'SVG upload Wix', 'Squarespace icons', 'Webflow icons', 'free website icons', 'add SVG to website'],
  about: ['Website builder', 'Scalable Vector Graphics', 'Portable Network Graphics', 'Icons'],
  related: ['svg-vs-png-icons', 'icons-on-landing-pages', 'accessible-icons'],
  tldr: [
    '<strong>The universal method:</strong> download the icon as a PNG with a see-through background and upload it with your site builder’s Image block. It works everywhere.',
    '<strong>Sharper option:</strong> use SVG where your platform accepts it. Wix, Webflow and Framer take SVG files; WordPress blocks SVG uploads by default.',
    '<strong>Squarespace and Shopify</strong> image uploads do not list SVG, so use a PNG, or paste the SVG code into a code block.',
    '<strong>Plain HTML:</strong> paste the SVG code straight into your page. It stays sharp and takes your text colour.',
    'with icons has free PNG and SVG downloads on every icon page, and npm packages and a CDN for developers.',
  ],
  faq: [
    { q: 'Why does WordPress say “Sorry, you are not allowed to upload this file type” for my SVG?', a: 'WordPress does not include SVG in its default list of allowed upload types, because an SVG file can contain code. Upload a PNG instead, or paste the SVG code into a Custom HTML block. Plugins exist that allow SVG uploads safely, but they are optional.' },
    { q: 'Should I use PNG or SVG icons on my website?', a: 'SVG is the better choice when your platform supports it: it is tiny, sharp at every size and can change colour. PNG is the safe fallback that works everywhere. Download PNGs at about two to three times the size you will show them, so they stay crisp on sharp screens.' },
    { q: 'What size should website icons be?', a: 'Small icons in menus, buttons and lists usually sit at 16 to 24 px. Feature icons in a grid look good at 32 to 48 px. If you use PNG, download it at about double those sizes.' },
    { q: 'Can I change the colour of an icon after uploading it?', a: 'With SVG, often yes: Wix lets you recolour single-colour vector art, and pasted SVG code follows your text colour. With PNG, no: download it again in the new colour. It takes a few seconds on the icon page.' },
    { q: 'Are free icons OK to use on a business website?', a: 'If the license allows commercial use, yes. with icons is MIT licensed, so you can use the icons on any website without adding a credit. Some free icon sites ask for a visible credit or link.' },
  ],
  sources: [
    { title: 'WordPress developer reference: wp_get_mime_types() (default allowed file types)', url: 'https://developer.wordpress.org/reference/functions/wp_get_mime_types/' },
    { title: 'Wix Help Center: About vector art (uploading and recolouring SVG)', url: 'https://support.wix.com/en/article/wix-editor-about-vector-art' },
    { title: 'Squarespace Help Center: Formatting images for display on the web (supported file types)', url: 'https://support.squarespace.com/hc/en-us/articles/206542517-Formatting-images-for-display-on-the-web' },
    { title: 'Webflow Help Center: Assets panel', url: 'https://help.webflow.com/hc/en-us/articles/33961269934227-Assets-panel' },
    { title: 'Framer Help: How to add icons in Framer', url: 'https://www.framer.com/help/articles/how-to-add-icons/' },
    { title: 'Shopify Help Center: Uploading images (image formats)', url: 'https://help.shopify.com/en/manual/online-store/images/theme-images' },
  ],
  body: () => `
${p(`<span class="lede">Adding icons to a website is easier than it looks, and you do not need to write code. Download the icon, upload it with your site builder’s Image block, resize it, done. The one thing worth knowing: some platforms accept <strong>SVG</strong> files (sharp at any size, recolourable) and some only take <strong>PNG</strong> (a normal picture). This guide tells you which is which.</span>`)}
${p(`We will use ${L.icons('with icons')} for the examples. Every icon page has <strong>Copy image</strong>, <strong>PNG download</strong> (choose the size and colour), <strong>SVG download</strong> and <strong>Copy SVG code</strong> buttons, and the icons are MIT licensed, so you can use them on any site without adding a credit. The steps work the same with any icon set that offers PNG and SVG files.`)}

${h2('PNG or SVG: which file should you use?')}
${p('Here is the plain-English version. A <strong>PNG</strong> is a picture made of tiny squares (pixels). Every website builder accepts it, and with a see-through background it sits neatly on any colour. Its weakness: stretch it bigger than it was saved and it goes blurry.')}
${p(`An <strong>SVG</strong> is a picture described as shapes, a bit like a recipe for drawing it. That makes it tiny, razor sharp at any size, and on some platforms you can change its colour after uploading. Its weakness: not every platform accepts SVG uploads, because SVG files can contain code. We go deeper in ${L.post('svg-vs-png-icons', 'SVG vs PNG icons')}.`)}
${table(['Platform', 'SVG file upload?', 'Best choice', 'Our guide'], [
  ['WordPress', no('Blocked by default'), 'PNG, or SVG code in a Custom HTML block', L.guide('wordpress', 'WordPress guide')],
  ['Wix', yes('Yes'), 'SVG (recolourable)', L.guide('wix-squarespace', 'Wix guide')],
  ['Squarespace', no('Not in image uploads'), 'PNG, 256 px', L.guide('wix-squarespace', 'Squarespace guide')],
  ['Webflow', yes('Yes'), 'SVG, or SVG code in a Code Embed', L.guide('webflow', 'Webflow guide')],
  ['Framer', yes('Yes, paste or drag'), 'Copy SVG and paste', L.guide('framer', 'Framer guide')],
  ['Shopify', meh('Not listed for theme images'), 'PNG', '(see below)'],
  ['Plain HTML', yes('Yes'), 'SVG code pasted into the page', L.guide('html', 'HTML guide')],
], 'Which icon file to use on each website platform (checked October 2026)')}
${callout('tip', 'Downloading a PNG? Pick a size about two to three times bigger than you will show it. A 64 px PNG shown at 24 px stays crisp on sharp phone and laptop screens.')}

${h2('How do you add icons to WordPress?')}
${p('WordPress has one quirk to know about: it does not allow SVG uploads out of the box. Its default list of allowed file types includes PNG, JPEG, GIF and WebP, but not SVG, because an SVG file can hide code. If you try, you will see “Sorry, you are not allowed to upload this file type.” Two easy ways around it:')}
${steps([
  ['Easiest: upload a PNG', 'Download the icon as a PNG (128 px is a good size), add an Image block in the editor, and upload it. Set the width in the block settings.'],
  ['Sharpest: paste the SVG code', 'Click Copy SVG on the icon page, add a Custom HTML block, and paste. The icon stays sharp and you can change its size in the code.'],
])}
${p(`A heads-up on the second method: WordPress only lets trusted roles (like administrators on your own site) save raw code, and some hosted plans strip it out. If the icon disappears after saving, use the PNG. There are also plugins that allow SVG uploads safely, but you do not need one for a handful of icons. The full walkthrough is in our ${L.guide('wordpress', 'WordPress guide')}.`)}

${h2('How do you add icons to Wix?')}
${p('Wix is SVG-friendly. In the editor, click <strong>Media</strong> on the left, then <strong>Upload Media</strong>, choose your SVG file and add it to the page. Wix treats it as “vector art”, so it stays sharp at any size.')}
${p(`Even better, Wix can recolour simple vector art: select the icon, click the Design icon, and change the fill colour. That works best with single-colour icons such as the line and solid styles. Wix says it sorts uploads by their colours, and if it cannot classify an SVG, the colour options will not appear. In that case, just download the icon again in the colour you want. See our ${L.guide('wix-squarespace', 'Wix and Squarespace guide')}.`)}
${figure('landing1', 'Most site builders work the same way: add an image element, upload the icon, resize it. The file type is the only real difference.')}

${h2('How do you add icons to Squarespace?')}
${p('Squarespace’s help centre lists only JPG, GIF, PNG and WebP for images, so SVG files will not upload to an Image block. Use a PNG with a see-through background instead:')}
${steps([
  ['Download a 256 px PNG', 'Pick your colour on the icon page first. Squarespace cannot recolour images.'],
  ['Add an Image block', 'Edit the page, click Add Block (or an insert point), choose Image, and upload the PNG.'],
  ['Resize and align it', 'Drag the block to size. Keep every icon in a section the same width.'],
])}
${p('If you really want SVG, Squarespace’s Code block can hold pasted SVG code (what you can use in code blocks depends on your plan). For a handful of icons, the PNG route is simpler and looks great.')}

${h2('How do you add icons to Webflow and Framer?')}
${h3('Webflow')}
${p(`Webflow accepts SVG files in its <strong>Assets</strong> panel. Upload the SVG, drag it onto the page and it becomes an Image element. The smarter trick: drag a <strong>Code Embed</strong> element onto the page and paste the SVG code. Then the icon takes the text colour of its parent, so hover colours just work. Details in our ${L.guide('webflow', 'Webflow guide')}.`)}
${h3('Framer')}
${p(`Framer is the easiest of all. Click <strong>Copy SVG</strong> on the icon page, click on your Framer canvas and paste (Ctrl+V, or ⌘+V on a Mac). The icon arrives as a graphic you can resize and recolour. You can also drag an .svg file straight onto the canvas. See the ${L.guide('framer', 'Framer guide')}.`)}

${h2('What about Shopify and other store builders?')}
${p('Shopify’s help centre lists JPEG, PNG, GIF, HEIC and WebP as the supported formats for theme images, so a PNG is the safe choice for image settings in the theme editor. Upload it where the section asks for an image, or add it under Content, then Files.')}
${p('Many Shopify themes also include a Custom Liquid or custom HTML section, where pasted SVG code works like it does on a plain HTML page. Other store and site builders follow the same pattern: if there is an Image block, a PNG will work; if there is a code or embed block, SVG code usually will too.')}

${h2('How do you add icons to a plain HTML website?')}
${p('If you (or someone on your team) edit the HTML of your site directly, you have the best option of all: <strong>paste the icon’s SVG code right into the page</strong>. There is no file to upload, the icon stays perfectly sharp, and it automatically takes the colour of the text around it. Do not worry if code is new to you; this is copy and paste.')}
${code(`<a href="/contact">
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">…</svg>
  Contact us
</a>`)}
${p('Click Copy SVG on the icon page to get the full code (the “…” above is where the drawing goes). To change the size, edit the <code>width</code> and <code>height</code> numbers. To change the colour, change the text colour of the link or paragraph it sits in.')}
${p('Prefer a normal image file? That works too:')}
${code(`<img src="images/mail.png" width="24" height="24" alt="Email">`)}
${p(`The <code>alt</code> text describes the icon for people using screen readers. If the icon sits next to words that already say the same thing, use <code>alt=""</code> so it is skipped. Our guide to ${L.post('accessible-icons', 'accessible icons')} explains why.`)}
${callout('note', `For developers: with icons also has React, Vue, Svelte, Angular and Solid components, a <code>&lt;with-icon&gt;</code> web component and <code>&lt;i class="with with-home"&gt;</code> CSS classes. Install one with <code>npm i @withicons/react</code> (or <code>vue</code>, <code>svelte</code>, <code>angular</code>, <code>solid</code>, <code>web</code>), or load the classes from the CDN: <code>https://cdn.jsdelivr.net/npm/@withicons/classes/dist/with-line.css</code>. No build step? Copy the SVG from any icon page, or see our ${L.guide('html', 'HTML guide')}.`, 'For developers')}
${figure('hero1', 'Pasting SVG code is the sharpest way to add icons to a hand-built site. The icon follows your text colour automatically.')}

${h2('What size and colour should website icons be?')}
${p('A few simple rules keep icons looking tidy on any platform:')}
${ul([
  '<strong>16 to 24 px</strong> for icons in menus, buttons, lists and footers.',
  '<strong>32 to 48 px</strong> for feature icons above a short headline.',
  '<strong>One colour</strong> for all icons, usually your brand’s accent colour or the text colour.',
  `<strong>One style</strong> per site. with icons draws each icon once in ${N_STYLES} matching styles, so line icons in the menu and ${L.style('gloss', 'gloss')} or ${L.style('glass', 'glass')} icons in the hero still look like one family.`,
])}
${sizeRamp(['home', 'mail', 'phone', 'map-pin'], [16, 20, 24, 32, 48], 'line', 'Common website icons at five sizes. Small sizes for menus and footers, larger ones for feature sections.')}
${iconGrid(['home', 'search', 'mail', 'phone', 'map-pin', 'clock', 'shopping-cart', 'user'], 'solid', 'Eight icons almost every small business site needs, in the solid style: home, search, email, phone, location, opening hours, shop and account.')}
${styleRow('globe')}
${p('Pick one style for your site and use it everywhere: line, solid or duo for menus and buttons, and a creative style such as gloss, glass or retro for big feature icons at 32 px and up.')}

${h2('Common problems and quick fixes')}
${table(['Problem', 'Why it happens', 'Fix'], [
  ['“File type not allowed”', 'The platform blocks SVG uploads', 'Upload a PNG, or paste the SVG code into a code block'],
  ['Icon looks blurry', 'A small PNG was stretched', 'Download a PNG two or three times bigger, or use SVG'],
  ['White box around the icon', 'The image has a solid background', 'Use a PNG with a see-through background'],
  ['Can’t change the colour', 'PNGs are fixed pictures', 'Download it again in the new colour, or use SVG'],
  ['Pasted icon is huge', 'The SVG code has no size set', 'Set width and height (for example 24) in the code'],
], 'Website icon troubleshooting')}
${doDont(
  '<p>Pick one icon style and one colour for the whole site, size icons by role (small in menus, larger in features), and pair them with clear words.</p>',
  '<p>Upload a tiny PNG and stretch it, mix icons from three different sites, or use icons with no text where visitors have to guess what they mean.</p>',
)}

${h2('The bottom line')}
${p(`Every website builder can show icons. Use a PNG with a see-through background when in doubt, use SVG where your platform accepts it (Wix, Webflow, Framer, plain HTML), and paste SVG code into a code block when you want the sharpest result. Then keep sizes and colours consistent. When you are ready to design the page itself, read ${L.post('icons-on-landing-pages', 'how to use icons on a landing page')}.`)}
${cta('Find icons for your website', `${N_ICONS} free icons in ${N_STYLES} styles. Download a PNG or SVG in any colour, or copy the SVG code. MIT licensed, no credit needed.`, ['globe', 'home', 'mail', 'shopping-cart', 'map-pin', 'sparkles'])}
`,
}
