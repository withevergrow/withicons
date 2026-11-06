import { p, h2, ul, art, iconGrid, sizeRamp, table, yes, no, meh, callout, steps, doDont, code, cta, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

export default {
  slug: 'png-to-svg',
  category: 'guides',
  date: '2026-11-06',
  hero: 'h-png-to-svg',
  stickers: [['pen-tool', 'duo'], ['shapes', 'gloss'], ['file-code', 'sticker']],
  title: 'How to convert a PNG to SVG (and avoid fake SVGs)',
  cardTitle: 'PNG to SVG, properly',
  h1: 'How to convert a PNG to SVG (and <em>avoid fake SVGs</em>)',
  dek: 'Converting a PNG to SVG means tracing its pixels into shapes. Some converters skip that and just wrap the PNG in an SVG file. Here is how to do it properly, when it works, and the easier route for icons.',
  description: 'What converting PNG to SVG really does, how to spot a fake SVG, how to trace properly in Inkscape or Illustrator, when it fails, and the faster route for icons.',
  keywords: ['png to svg', 'convert png to svg', 'png to svg free', 'vectorize image', 'trace bitmap inkscape', 'image trace illustrator', 'fake svg', 'png to svg for cricut'],
  about: ['Image tracing', 'Scalable Vector Graphics', 'Portable Network Graphics', 'Inkscape', 'Vectorization'],
  related: ['svg-vs-png-icons', 'where-to-get-free-svg-icons', 'icon-black-or-white-background'],
  tldr: [
    '<strong>A real conversion traces the picture</strong>: software follows the edges of the pixels and redraws them as shapes. That is what makes an SVG sharp at any size.',
    '<strong>Watch for fake SVGs.</strong> Some converters put your PNG inside an SVG file unchanged. Open the file in a text editor: if you see <code>&lt;image</code> and a long block of letters, it is still pixels.',
    '<strong>Free and reliable:</strong> Inkscape’s Path > Trace Bitmap. <strong>Paid:</strong> Illustrator’s Image Trace. Online tracers vary, so always check the result.',
    '<strong>Tracing works</strong> for bold, flat, high-contrast images with few colours. It struggles with small, blurry, detailed or gradient-heavy PNGs.',
    `<strong>For icons, skip conversion:</strong> download the original SVG. Every with icons icon comes as a real SVG, ${N_SVGS} of them, free under MIT.`,
  ],
  faq: [
    { q: 'Can you convert a PNG to SVG for free?', a: 'Yes. Inkscape is free for Windows, Mac and Linux: import the PNG, choose Path > Trace Bitmap, preview, apply, then save as SVG. Adobe Express also has a free online PNG to SVG converter. Whatever you use, open the result and check it really contains shapes, not the original picture.' },
    { q: 'Why does my converted SVG look exactly like the blurry PNG?', a: 'Because it probably is the PNG. Some converters embed the picture inside an SVG file instead of tracing it. The file ends in .svg, but zooming in still shows pixels. Open it in a text editor: an &lt;image&gt; tag with a long base64 block means it was wrapped, not converted.' },
    { q: 'Why does my traced SVG look lumpy or have the wrong colours?', a: 'Tracing guesses where edges are. Small or blurry PNGs give it too little to go on, and gradients, shadows or many colours become dozens of blotchy shapes. Start from the largest, sharpest PNG you have, limit the number of colours, and smooth the result, or redraw the shape by hand.' },
    { q: 'Is SVG better than PNG for Cricut and other cutting machines?', a: 'Cutting machines need real outlines to follow, so a traced or original SVG is what you want. A wrapped “fake SVG” gives the machine no cut lines. For icons, download the SVG directly and choose a filled style, which gives clean shapes to cut.' },
    { q: 'Does converting an icon to SVG change its licence?', a: 'No. Tracing someone else’s icon makes a copy of their work, so the original licence still applies, credit lines and limits included. If you want an icon you can freely use as SVG, start from an openly licensed set such as with icons (MIT).' },
  ],
  sources: [
    { title: 'Inkscape Beginners’ Guide: Tracing an image (Path > Trace Bitmap), checked Nov 2026', url: 'https://inkscape-manuals.readthedocs.io/en/latest/tracing-an-image.html' },
    { title: 'Adobe Help: Vectorize images using Image Trace (updated 26 Feb 2026)', url: 'https://helpx.adobe.com/illustrator/desktop/manage-objects/traces-mockups-symbols/trace-images-to-convert-raster-into-vector-artwork.html' },
    { title: 'Adobe Help: Image Trace best practices and limitations (updated 25 Oct 2026)', url: 'https://helpx.adobe.com/illustrator/desktop/manage-objects/traces-mockups-symbols/image-trace-best-practices-and-limitations.html' },
    { title: 'Adobe Help: Image tracing presets (Expand to edit paths), checked Nov 2026', url: 'https://helpx.adobe.com/illustrator/using/image-trace-presets.html' },
    { title: 'Adobe Express: Free online PNG to SVG converter, checked Nov 2026', url: 'https://www.adobe.com/express/feature/image/convert/png-to-svg' },
    { title: 'Vectorizer.AI pricing (free preview, paid download), checked Nov 2026', url: 'https://vectorizer.ai/pricing' },
    { title: 'MDN: the SVG &lt;image&gt; element (embeds raster images), checked Nov 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/image' },
    { title: 'ViaVector: best SVG converter test (18 Oct 2026)', url: 'https://viavector.co/best-svg-converter/' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">To convert a PNG to SVG, you <strong>trace</strong> it: software follows the edges in the pixels and redraws them as shapes, which is what lets an SVG stay sharp at any size. Free Inkscape (Path > Trace Bitmap) and Adobe Illustrator (Image Trace) do this well for bold, flat images. Many online converters do too, but some only wrap your PNG inside an SVG file, which changes the file name and nothing else. For icons, the simplest route is to skip conversion and download the original SVG.</span>`)}
${p('This guide explains the difference between a real and a fake conversion, how to check yours in ten seconds, how to trace properly with free and paid tools, and when tracing is simply the wrong job.')}

${h2('What does converting a PNG to SVG actually do?')}
${p('A PNG is a grid of coloured squares (pixels). Stretch it and the squares get bigger, so it turns blurry. An SVG is a list of shapes, a bit like a recipe: “a circle here, a curved line there, filled with this colour”. The computer redraws the shapes at whatever size you ask for, so they never go blurry.')}
${p('So you cannot really “convert” one into the other, the way you convert a Word file to PDF. There are only two things a converter can do:')}
${table(['Method', 'What happens', 'Sharp when enlarged?', 'Editable shapes?'], [
  ['Tracing (vectorising)', 'Software finds edges and colour areas, then draws new shapes over them', yes('Yes'), yes('Yes')],
  ['Wrapping (embedding)', 'The PNG is placed inside an SVG file, unchanged', no('No, still pixels'), no('No')],
  ['Redrawing by hand', 'A person rebuilds the shape with a pen tool', yes('Yes'), yes('Yes, and cleanest')],
], 'The three ways a PNG becomes an SVG, and what each really gives you.')}
${p('Wrapping is not a trick in itself: SVG has an <code>&lt;image&gt;</code> element for placing pictures, and designers use it on purpose. It only becomes a trap when a “PNG to SVG converter” does just that and calls it a conversion.')}
${art('m-png-to-svg-real-vs-fake', 'Zoom in on a traced SVG and the edges stay crisp. Zoom in on a wrapped one and the pixels come back.', { brief: 'Two columns, same with icons heart icon (solid style) at the top of each, small. Below each, a big zoomed-in circle (magnifier) on the heart’s edge. Left column labelled “Traced SVG”: smooth curved edge with a few anchor-point dots. Right column labelled “Fake SVG (PNG inside)”: a jagged staircase of pixels. Short footer under each: “Shapes” and “Still pixels”.' })}

${h2('How do I tell if an SVG is fake?')}
${p('You do not need design software. Three quick checks, from easiest to surest:')}
${steps([
  ['Zoom right in', 'Open the SVG in a browser (drag it onto a tab) and zoom to 400% or more. Real shapes stay smooth. Blocky, soft edges mean pixels.'],
  ['Look at the file size', 'A simple traced icon is usually a few kilobytes. If the SVG is about as big as the PNG, or bigger, it probably contains the PNG.'],
  ['Open it in a text editor', 'Right-click and open it with Notepad or TextEdit. Real shapes look like path data. A fake one has an <code>&lt;image</code> tag followed by a very long block of letters and numbers.'],
])}
${p('Here is roughly what each looks like inside. A traced shape:')}
${code(`<svg viewBox="0 0 24 24"><path d="M12 21C7 17 3 13.5 3 9a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 4.5-4 8-9 12Z"/></svg>`)}
${p('A wrapped PNG (the long part is the picture itself, written out as text):')}
${code(`<svg viewBox="0 0 512 512"><image href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." width="512" height="512"/></svg>`)}
${callout('warn', 'Some tools mix the two: they trace part of the image and embed the rest, or trace it and keep the original PNG hidden underneath. If your SVG contains both <code>&lt;path</code> and <code>&lt;image</code>, delete the image layer in your editor and check what is left.')}

${h2('How do I convert a PNG to SVG for free with Inkscape?')}
${p('Inkscape is a free, open-source design app for Windows, Mac and Linux, and its Trace Bitmap tool is the most dependable free tracer. Its own beginners’ guide is honest about it: tracing is ideal for dark shapes on a bright background, and if you expect a perfect copy you will be disappointed.')}
${steps([
  ['Import the PNG', 'File > Import, and choose the largest, sharpest version you have.'],
  ['Open Trace Bitmap', 'Select the picture, then Path > Trace Bitmap (Shift + Alt + B).'],
  ['Pick a mode', '<strong>Brightness cutoff</strong> for a one-colour icon or logo. <strong>Multiple scans: colours</strong> for a few flat colours (it makes one shape per colour). <strong>Centerline</strong> for line drawings and handwriting.'],
  ['Preview and apply', 'Click Update to preview, adjust, then Apply. The traced shapes appear exactly on top of the picture.'],
  ['Remove the original and save', 'Drag the result aside, delete the PNG underneath, then File > Save As and choose Plain SVG.'],
])}

${h2('How do I convert a PNG to SVG in Illustrator?')}
${p('Adobe Illustrator (paid) has Image Trace, with presets for black-and-white logos, a few colours, outlines and photos. Adobe’s steps today:')}
${ul([
  'File > Place the PNG, then open Window > Image Trace.',
  'Pick a preset. Adobe now offers <strong>Enhanced</strong> presets (with support for gradients, shapes and transparency) and the older Legacy ones. For icons, <strong>Black and White</strong> or a low colour count is usually cleanest.',
  'Adjust Paths, Corners and Noise in the Advanced section, then click <strong>Expand</strong> to turn the trace into editable paths before you export as SVG.',
])}
${p('Adobe’s best-practice page gives two tips that apply to every tracer: clean the image first (remove backgrounds, dust and scan marks), and use lossless files like PNG rather than heavily compressed JPGs, because compression blotches get traced too.')}

${h2('Do online PNG to SVG converters work?')}
${p('Some do. The problem is you cannot tell which kind you got until you check. A few you will meet:')}
${table(['Tool', 'Price', 'What to know'], [
  ['Adobe Express PNG to SVG', yes('Free'), 'Upload a PNG or JPG up to 40 MB; Adobe says it turns it into a vector file. Check the result as above.'],
  ['Vectorizer.AI', meh('Free preview, $9.99 a month to download'), 'Traces with AI; you can inspect the result before paying.'],
  ['Inkscape (desktop)', yes('Free'), 'Most control, works offline, nothing uploaded.'],
  ['Illustrator Image Trace (desktop)', no('Subscription'), 'Strong presets and cleanup; part of Creative Cloud.'],
], 'PNG to SVG options and what they cost, checked November 2026.')}
${p('Independent tests find uneven results. One October 2026 test of six free converters from the first page of Google found that all six returned real vectors (no wrapped PNGs), but three of them changed colours or dropped whole shapes on their default settings, and even the best used about five times as many points as a hand-drawn version. So a real SVG is not automatically a good one. Whatever you use, zoom in, check the file size, and peek inside once before you rely on it.')}
${doDont('<p>Upload the biggest, cleanest PNG you have, keep it to a few flat colours, and check the SVG by zooming and opening it in a text editor.</p>', '<p>Trust a converter because the file ends in .svg. Or feed it a tiny 64 px PNG: there is nothing for the tracer to follow, so you get lumps.</p>')}

${h2('When does tracing work, and when does it fail?')}
${p('Tracing is guessing. It works when the guesses are easy:')}
${table(['Your PNG', 'Tracing result', 'Better option'], [
  ['Bold one-colour icon or logo, large and sharp', yes('Usually very good'), 'Trace it'],
  ['Flat artwork with 2 to 5 solid colours', yes('Good, with some cleanup'), 'Trace with limited colours'],
  ['Small (under about 128 px) or blurry', no('Lumpy, rounded corners'), 'Find a bigger original, or redraw'],
  ['Thin lines and fine text', meh('Lines wobble, text breaks'), 'Centerline mode, or retype the text'],
  ['Gradients, shadows, 3D or glossy looks', no('Dozens of blotchy shapes'), 'Keep it as PNG, or find the original SVG'],
  ['Photos', no('Posterised effect at best'), 'Keep it as PNG or WebP'],
], 'What tracing can and cannot do, by type of image.')}
${art('m-png-to-svg-trace-results', 'Same tracer, three inputs: a big flat icon traces cleanly, a tiny blurry one and a glossy one do not.', { brief: 'Three rows, each “input PNG → traced SVG”. Row 1: a large with icons rocket in solid style, traced result clean, green check “Bold and flat: great”. Row 2: the same rocket as a tiny blurry 32 px PNG, traced result lumpy with melted corners, amber mark “Too small”. Row 3: the rocket in gloss style with highlights, traced result split into many blotchy patches, red cross “Gradients: poor”. Keep labels short.' })}

${h2('Is there an easier way to get an icon as SVG?')}
${p('Yes: find the icon as an SVG in the first place. Nearly every modern icon set is drawn as vectors and offers SVG downloads, so if you have a PNG icon, the SVG version usually exists already. Tracing it gives you a worse copy of something you could have had for free, and it does not change the licence: a traced copy of someone else’s icon still follows their rules.')}
${p(`Every one of our ${N_ICONS} icons is drawn once on a 24 x 24 grid and comes as a real SVG in ${N_STYLES} styles. On any icon page, Download gives you two kinds: <strong>SVG</strong> with the colours locked in (best for design tools) and <strong>themable SVG</strong> you can recolour with code. Our ${L.page('free/svg-icons.html', 'free SVG icons')} page is a good place to start, and ${L.post('where-to-get-free-svg-icons', 'where to get free SVG icons')} compares other libraries honestly.`)}
${iconGrid(['home', 'mail', 'calendar', 'heart', 'star', 'rocket', 'shopping-cart', 'leaf'], 'solid', 'Real SVGs, no tracing needed. Filled styles like Solid give clean single shapes for cutting machines too.')}
${p('And because they are real vectors, they stay crisp at every size, from a tiny button to a poster:')}
${sizeRamp(['rocket', 'heart', 'star'], [16, 24, 32, 48, 64], 'line', 'The same SVG icons at 16 to 64 px. Nothing was traced or enlarged from pixels.')}
${p(`Making stickers or cut files? Pick a filled style like ${L.style('solid')} or ${L.style('sticker')}, since outline styles are drawn with strokes that some cutting software reads as thin lines. For logos you drew yourself, tracing (or a few hours of careful redrawing) is still the right tool. Our ${L.post('svg-vs-png-icons', 'SVG vs PNG guide')} explains when each format is the better choice.`)}

${h2('The short answer')}
${p(`Converting a PNG to SVG means tracing it into shapes. Use Inkscape’s Trace Bitmap (free) or Illustrator’s Image Trace for bold, flat images, start from the biggest, sharpest file, and always check the result: an SVG with an <code>&lt;image</code> tag inside is still a PNG in disguise. For anything detailed, glossy or tiny, find the original vector instead. For icons, that is the fastest route by far: ${L.icons(`browse all ${N_ICONS} icons`)} and download the SVG directly. If your PNG has a stubborn white box, ${L.post('icon-black-or-white-background', 'here is how to remove it')}.`)}
${cta('Skip the tracing', `${N_ICONS} icons in ${N_STYLES} styles, each a real SVG. Download, recolour, scale to any size. Free and MIT licensed.`, ['pen-tool', 'shapes', 'rocket', 'heart', 'star', 'sparkles'])}
`,
}
