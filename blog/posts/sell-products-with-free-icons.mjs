import { p, h2, h3, ul, art, iconGrid, styleRow, table, yes, no, meh, callout, steps, doDont, cta, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'sell-products-with-free-icons',
  category: 'guides',
  date: '2026-11-06',
  hero: 'h-sell-products-with-free-icons',
  stickers: [['shopping-bag', 'sticker'], ['scissors', 'retro'], ['tag', 'gloss']],
  title: 'Can I sell stickers, shirts or printables made with free icons?',
  cardTitle: 'Selling products with free icons',
  h1: 'Can I sell stickers, shirts or printables made with <em>free icons</em>?',
  dek: 'Yes with some licences, no with others, and never by reselling the icon files themselves. Here is which free icon licences allow merch, print-on-demand and printables in 2026, plus why line icons cut wrong on a Cricut.',
  description: 'Which free icon licences let you sell stickers, T-shirts, mugs and printables in 2026: MIT, Flaticon, Icons8, Canva, Creative Market. Plus a Cricut cutting fix.',
  keywords: ['sell products with free icons', 'free icons for etsy', 'flaticon merchandising license', 'canva print on demand license', 'icons8 commercial printing', 'cricut svg cuts wrong', 'svg stroke to path cricut', 'free svg for cricut commercial use'],
  about: ['Print on demand', 'Software license', 'Cutting plotter', 'Icons'],
  related: ['free-icons-commercial-use', 'icon-resolution-for-print', 'free-icon-in-logo'],
  tldr: [
    '<strong>Open licences say yes.</strong> MIT, ISC, Apache 2.0 and CC0 icons can go on stickers, shirts, mugs and printables you sell, with no credit and no extra fee.',
    '<strong>Marketplaces usually say pay.</strong> Flaticon’s and Freepik’s (now Magnific’s) free licences exclude products for resale where the icon is the main element. Flaticon sells a per-icon Merchandising Licence (up to 100,000 copies). Icons8 asks commercial printers to contact it.',
    '<strong>Canva says “make it original”.</strong> Its content can go on print-on-demand products only as part of your own design, never printed as-is or sold as clipart.',
    '<strong>Sell products, not the icon files.</strong> Sticker packs, clipart bundles and planner sticker PNGs are the icons themselves, which most licences forbid. MIT allows it with the licence text, but it is rarely worth it.',
    '<strong>Cutting machines cut paths, not line widths.</strong> For a Cricut, use a filled style such as Solid, or convert strokes to shapes first (Inkscape: Path, Stroke to Path).',
  ],
  faq: [
    { q: 'Can I use Flaticon icons on products I sell on Etsy?', a: 'Not as the main element under the free or Premium licence: Flaticon’s terms exclude items made for resale, such as T-shirts, mugs and cards, where the icon is the main element, and in doubt it counts as main. For those you need Flaticon’s per-icon Merchandising Licence, which allows up to 100,000 copies and still forbids logos and print-on-demand design tools.' },
    { q: 'Can I sell T-shirts made in Canva?', a: 'Yes, if the design is original. Canva’s help centre says you can sell T-shirts, mugs, stickers and posters, including through print-on-demand services, as long as you combine elements into your own design. Printing a single Canva graphic as-is, or with only a colour change or border, counts as standalone use and is not allowed.' },
    { q: 'Do I need to credit the icons on products I sell?', a: 'Not with MIT, ISC, Apache 2.0 or CC0 icons. CC BY icons need a credit, which sellers usually put in the listing description. Icons8’s free plan asks for a legible link on the product, its description or your website, and says commercial printing projects should contact it first.' },
    { q: 'Can I sell digital planner stickers made from free icons?', a: 'Be careful: planner stickers are usually sold as separate PNG files the buyer can reuse, which most licences treat as redistributing the icons. Canva and Flaticon forbid it and Remix Icon forbids standalone icon sales. MIT allows it if you include the licence text, but buyers can get the same icons free.' },
    { q: 'Why does my SVG cut as a solid blob or a thin line on my Cricut?', a: 'Design Space builds cut lines from the shapes in the file and does not keep stroke width. A line icon drawn with strokes becomes one hairline cut along the middle of each line, or fills in as a blob. Use a filled icon style, or convert strokes to paths before uploading (Inkscape: Path, Stroke to Path; Illustrator: Object, Path, Outline Stroke).' },
    { q: 'Is this legal advice?', a: 'No. It is a plain-English summary from an icon library, checked against each licence in November 2026. Licences change, so read the current terms of any source before a big print run, and ask a lawyer if a lot is at stake.' },
  ],
  sources: [
    { title: 'with icons licence (MIT), checked Nov 2026', url: 'https://withicons.com/license.html' },
    { title: 'Flaticon terms of use, sections 8.1 to 8.3, checked Nov 2026', url: 'https://www.flaticon.com/legal' },
    { title: 'Flaticon Merchandising License summary, checked Nov 2026', url: 'https://www.flaticon.com/merchandising-license' },
    { title: 'Magnific (formerly Freepik) terms of use, June 2026, section 8.1, checked Nov 2026', url: 'https://www.freepik.com/legal/terms-of-use' },
    { title: 'Icons8: How to use our graphics for free (physical goods), checked Nov 2026', url: 'https://icons8.com/license' },
    { title: 'Icons8 Help: Can I use your icons for printing? (23 Jan 2024), checked Nov 2026', url: 'https://intercom.help/icons8-7fb7577e8170/en/articles/4732926' },
    { title: 'Canva Help: Use Canva to design digital and physical products for sale, checked Nov 2026', url: 'https://www.canva.com/help/using-canva-to-create-products-for-sale/' },
    { title: 'Canva Content License Agreement, checked Nov 2026', url: 'https://www.canva.com/policies/content-license-agreement/' },
    { title: 'Creative Market: License FAQ (Personal, Commercial, Extended Commercial), checked Nov 2026', url: 'https://creativemarket.com/licenses' },
    { title: 'Remix Icon License v1.0 (January 2026), checked Nov 2026', url: 'https://github.com/Remix-Design/RemixIcon/blob/master/License' },
    { title: 'Cricut Help: How to upload images into Design Space (5,000-path limit), edited 30 Mar 2026', url: 'https://help.cricut.com/hc/en-us/articles/360009556313' },
    { title: 'Cricut Help: Image uploads, unsupported items, checked Nov 2026', url: 'https://help.cricut.com/hc/en-us/articles/360009553213' },
    { title: 'Cricut Design Space guide: Preparing artwork from Adobe Illustrator (Outline Stroke tip)', url: 'https://d2e2oszluhwxlw.cloudfront.net/learn/pdfs/DS-beta/14.c-Preparing-Artwork-from-Adobe-Illustrator-dc.pdf' },
    { title: 'Tavmjong Bah, Inkscape manual: Stroke to Path (Ctrl+Alt+C)', url: 'http://tavmjong.free.fr/INKSCAPE/MANUAL/html/Paths-Creating.html' },
  ],
  body: () => `
${p(`<span class="lede">Yes, you can sell stickers, T-shirts, mugs, planners and printables made with free icons, as long as the icon’s licence allows products for resale. Open licences such as MIT, ISC, Apache 2.0 and CC0 do, with no fee and no credit. Marketplace free plans (Flaticon, Freepik, Icons8) usually do not when the icon is the main element, and want a paid or merchandising licence. Canva allows it only as part of your own original design. And almost no licence lets you resell the icon files themselves.</span>`)}
${p(`Older answers say “email us” or “buy a commercial licence for everything”. Both are out of date. Below is what each source actually says in November 2026, where the “don’t resell the icons” line sits, and a section for anyone with a Cricut or another cutting machine, because line icons and blades do not get along. We make ${L.icons('with icons')} (MIT), so we will flag where another source is the better choice.`)}
${callout('note', 'We are an icon library, not lawyers, and this is not legal advice. We read each licence in November 2026. Before a big print run, read the current terms yourself.', 'A quick, friendly disclaimer')}

${h2('Which free icon licences let you sell products?')}
${table(['Source', 'Products for sale?', 'The conditions'], [
  ['MIT, ISC, Apache 2.0, CC0 (with icons, Lucide, Heroicons, Tabler, Material Symbols…)', yes('Yes'), 'No credit on the product. Keep the licence text only if you pass the icon files on.'],
  ['CC BY 4.0 (for example Font Awesome Free icons)', yes('Yes, with a credit'), 'Credit the creator and licence, usually in the listing description.'],
  ['Remix Icon (licence v1.0, January 2026)', meh('Yes, as part of a product'), 'Icons may be decorative or functional elements, but not the main value. No standalone icon packs, no logos.'],
  ['Canva free and Pro content', meh('Yes, in an original design'), 'Fine on print-on-demand items as part of your own design. Not printed as-is, not sold as clipart.'],
  ['Flaticon free or Premium', no('Not as the main element'), 'Resale items where the icon is the main element need the per-icon Merchandising Licence (up to 100,000 copies).'],
  ['Freepik / Magnific free', no('Not as the main element'), 'Same main-element rule, unless your subscription terms say otherwise. Free use also needs a credit.'],
  ['Icons8 free', meh('Ask first'), 'Free use needs a legible link. Its help centre says commercial printing projects should contact Icons8.'],
  ['Creative Market', meh('Yes, by licence tier'), 'Personal: not for products for sale. Commercial: up to 5,000 end products. Extended Commercial: up to 250,000.'],
], 'What each source allows for products you sell, checked November 2026.')}
${p(`If you only remember one thing: <strong>open-source licences treat merch like any other use, and marketplaces treat it as a separate, paid right.</strong> Our ${L.post('free-icons-commercial-use', 'guide to free icons and commercial use')} explains each licence type in more depth.`)}

${h2('What does “main element” mean on Flaticon and Freepik?')}
${p('Both use the same idea. Their free licences exclude printed or digital items made for resale (they list T-shirts, cups, postcards, greeting cards, invitations, calendars and more) in which their content is the main element “because of size, relevance or any other cause”. The key phrase is the last one: <em>in case of doubt, it is deemed the main element</em>.')}
${ul([
  '<strong>A single icon on a sticker, a mug or a shirt:</strong> main element. Needs a merchandising licence.',
  '<strong>A small icon beside your own illustration or lettering:</strong> possibly not, but the doubt rule works against you.',
  '<strong>Icons as tiny bullets inside a printable planner you designed:</strong> closer to decoration, but read the terms for your exact case.',
])}
${p('Flaticon’s Merchandising Licence is bought per icon and is one-time and non-refundable. It removes the credit and allows the icon as the main element, but it caps copies at 100,000, still forbids logos, and forbids putting the icon inside print-on-demand design tools where your customers build their own products.')}

${h2('Can I sell the icons themselves, as sticker packs or clipart?')}
${p('This is the line almost every licence draws. Selling a <strong>product</strong> (a printed sticker, a finished planner, a shirt) is one thing. Selling the <strong>icon files</strong> so that buyers can reuse them is redistribution, and most sources forbid it:')}
${ul([
  '<strong>Canva</strong> gives the example of a sticker sheet of 20 library elements sold as individual PNG files: not allowed, because it is standalone use and “similar to selling clipart files”.',
  '<strong>Flaticon and Magnific</strong> forbid reselling or sublicensing their content and including it in any collection for resale.',
  '<strong>Remix Icon</strong> forbids standalone icon packs and competing icon sets, even with small changes such as colour or stroke width.',
  `<strong>MIT</strong> (with icons) allows it if the licence text goes with the files. Our ${L.page('license.html', 'licence page')} is honest about it: anyone can get them free here, so it is rarely worth it.`,
])}
${art('m-sell-products-with-free-icons-product-vs-file', 'Selling a finished product is usually fine. Selling the icon files is redistribution.', { brief: 'A two-column comparison. Left column, green tick, titled “Selling a product”: a printed vinyl sticker of a with icons cat icon (sticker style) on a laptop, a mug with a small icon pattern, and a printed planner page. Right column, red cross, titled “Selling the icons”: a ZIP file labelled “50 icon PNGs”, a digital planner sticker sheet with separate PNG files fanned out, and a “clipart bundle” tag. One-line note under the right column: “Most licences forbid this (MIT allows it with the licence text)”.' })}
${callout('tip', 'Digital planner stickers sit right on the line. Buyers usually get separate PNGs they can drop into any app, which is the definition of reusable icon files. If you sell them, build each sticker as your own composition (lettering, illustration, layout) and use icons as small parts of it, or use only icons whose licence allows redistribution.')}

${h2('What about print-on-demand shops and Etsy?')}
${p('Print-on-demand services print your design when someone orders it. The icon licence still decides what you may upload. Canva adds a useful warning: some services ask you to confirm that <em>you own the copyright</em> in what you upload. With licensed content you do not own the copyright, you hold a licence, so read each shop’s upload terms. If it only asks you to confirm you have the right to use the design, licensed content is fine within the licence.')}
${p(`Never put brand logos or characters on products, whatever the icon licence says. An icon licence covers the drawing, never someone else’s trademark. with icons contains no brand logos for exactly this reason. If your product is a logo for your own shop, read ${L.post('free-icon-in-logo', 'can I use a free icon in my logo')} first.`)}

${h2('Why do line icons cut wrong on a Cricut?')}
${p('Cutting machines follow paths: the outline of each shape in the file. In an SVG (a picture made of shapes, so it stays sharp at any size), there are two ways to paint a shape: a <strong>fill</strong>, which colours its inside, and a <strong>stroke</strong>, which draws a line of a certain width along its path. On screen they look alike. To a blade they are very different.')}
${p('Line icons, including our default Line style, are drawn with strokes. When Design Space reads them it builds cut lines from the paths, and the stroke width is not kept. So a bold 1.75 px line becomes either one hairline slit down the middle, or a closed outline that previews as a filled blob. Cricut’s own Illustrator guide gives the fix: shapes should be filled, and strokes should be turned into shapes with Outline Stroke before you save.')}
${art('m-sell-products-with-free-icons-cricut-stroke', 'A stroked line icon cuts down its middle. A filled icon cuts around its edge.', { brief: 'Three panels on a light green cutting-mat grid. Panel 1, “Line icon (strokes)”: the with icons heart icon in line style as it looks on screen. Panel 2, “What the blade sees”: the same heart reduced to a single thin red dashed cut line down the centre of the stroke, with a label “Hairline cut”. Panel 3, “Solid icon (fill)”: the heart in solid style with a red dashed cut line running around its outer edge, label “Clean shape”. Small Cricut-neutral blade glyph, no brand logos.' })}
${p('Two other things trip people up, both from Cricut’s help centre: SVG uploads are limited to 5,000 paths, and gradients, pattern fills, clipping paths and live text count as unsupported. Gradients cannot be split into cut layers, so Design Space suggests a PNG and Print Then Cut instead.')}

${h2('Which with icons styles cut cleanly?')}
${p(`We checked the files. Our <strong>Solid</strong> style is fill-only and single colour: only 3 of its ${N_ICONS} icons contain a stroke (the slash in ${L.icon('camera-off')} and ${L.icon('zap-off')}, and the tail of ${L.icon('black-cat')}). <strong>Retro</strong> and <strong>Bauhaus</strong> are flat colour fills with no gradients, so Design Space can separate them into one layer per colour for layered vinyl.`)}
${styleRow('heart', 'Cutting-friendly: Solid for single-colour vinyl, Retro and Bauhaus for layered colour. Line needs a Stroke to Path step first.', { styles: ['solid', 'retro', 'bauhaus', 'line'] })}
${ul([
  `<strong>Best for single-colour cuts:</strong> ${L.style('solid')}. Inner cutouts are part of the shape, so the blade cuts them too.`,
  `<strong>Best for layered vinyl:</strong> ${L.style('retro')} and ${L.style('bauhaus')}, flat colours only.`,
  '<strong>Convert first:</strong> Line, Duo, Sticker, Kawaii and the other outlined styles use strokes.',
  `<strong>Print Then Cut instead:</strong> the glossy and 3D styles (Glass, Clay, Chrome and friends) use gradients. Download a PNG for those; our ${L.page('free/sticker-icons.html', 'sticker icons')} look great printed.`,
])}
${callout('warn', 'Our SVG download locks your chosen colours in, but it keeps strokes as strokes. It does not convert them into filled shapes. For a Line-style icon on a cutting machine, run the conversion below or pick the Solid style.')}
${h3('How to turn a line icon into a cut-ready shape')}
${steps([
  ['Download the SVG', 'Open the icon page, pick the style and colour, and download SVG.'],
  ['Open it in Inkscape (free) or Illustrator', 'Select everything with Ctrl+A (Cmd+A on a Mac).'],
  ['Convert strokes to shapes', 'Inkscape: Path, Stroke to Path (Ctrl+Alt+C). Illustrator: Object, Path, Outline Stroke. The icon looks the same but is now filled outlines.'],
  ['Merge the pieces', 'Inkscape: Path, Union. Illustrator: Pathfinder, Unite. Overlapping lines become one clean shape.'],
  ['Save and upload', 'Save as plain SVG and upload it to Design Space. Check the preview: you should see solid shapes, not hairlines.'],
])}

${h2('What size and resolution do printables need?')}
${p(`For anything printed, a vector file (SVG or PDF) stays sharp at any size. Our PDF download is a true vector file. If your tool wants a picture, our PNG download goes up to 4,096 pixels, which is about 13.6 inches (34.6 cm) wide at 300 pixels per inch. ${L.post('icon-resolution-for-print', 'Our print resolution guide')} has a size chart for stickers, shirts and posters.`)}
${iconGrid(['cat', 'flower', 'star', 'sun', 'heart', 'coffee'], 'solid', 'Solid icons: simple filled shapes that cut, weed and print cleanly.')}
${doDont(
  '<p>Check the licence before you design, keep a note of each source, use icons as parts of your own composition, pick filled styles for cutting, and test-cut one before a batch.</p>',
  '<p>Print a marketplace icon on its own and sell it, sell icon files as a pack, put brand logos on merch, or upload a stroked line icon straight to a cutting machine.</p>',
)}
${cta('Icons you can put on what you sell', `${N_ICONS} icons in ${N_STYLES} styles under the MIT licence. Merch, printables and client work are all fine. No credit, no merchandising fee.`, ['shopping-bag', 'scissors', 'tag', 'heart', 'star', 'sparkles'])}
`,
}
