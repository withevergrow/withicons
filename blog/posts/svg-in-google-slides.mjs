import { p, h2, ul, art, iconGrid, styleRow, table, yes, no, meh, callout, steps, doDont, cta, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'svg-in-google-slides',
  category: 'guides',
  date: '2026-11-06',
  hero: 'h-svg-in-google-slides',
  stickers: [['presentation', 'gloss'], ['image', 'duo'], ['sparkles', 'sticker']],
  title: 'Can you put SVG icons in Google Slides? The 2026 answer',
  cardTitle: 'SVG in Google Slides',
  h1: 'Can you put SVG icons in <em>Google Slides</em>?',
  dek: 'Short answer: not as an SVG file, still. Here is what Google accepts today, why the famous WMF trick gives you wobbly icons, and the quick way to get icons that stay sharp and on-brand.',
  description: 'Google Slides still rejects SVG in 2026. Why the old WMF trick makes jagged icons, which PNG size stays sharp, and how to keep icons editable and in your colours.',
  keywords: ['svg in google slides', 'google slides svg', 'insert svg google slides', 'google slides unsupported image type', 'vector icons google slides', 'svg to google slides', 'google slides icons sharp'],
  about: ['Google Slides', 'Scalable Vector Graphics', 'Portable Network Graphics', 'Windows Metafile', 'Icon'],
  related: ['icons-in-presentations', 'svg-vs-png-icons', 'powerpoint-icons-missing'],
  tldr: [
    '<strong>No, Google Slides still does not accept SVG files</strong> (checked November 2026). Google’s own documentation lists PNG, JPEG and GIF, under 50 MB and 25 megapixels.',
    '<strong>The best route today is a big transparent PNG</strong>, about twice the size the icon will show on screen, downloaded in the exact colour you want.',
    '<strong>Skip the old WMF trick.</strong> WMF has no smooth curves, so circles and rounded corners turn into short straight lines. It also needs a third-party converter.',
    '<strong>Need a shape you can recolour inside Slides?</strong> Insert the SVG in desktop PowerPoint, use Convert to Shape, save, then import the .pptx into Slides. Test one icon first.',
    `with icons gives you PNG at any size and colour, plus Copy image, for all ${N_ICONS} icons in ${N_STYLES} styles. No conversion needed.`,
  ],
  faq: [
    { q: 'Why does Google Slides say “unsupported image type” for my SVG?', a: 'Because Slides only takes PNG, JPEG and GIF images. Google’s Slides documentation says images must be under 50 MB, no larger than 25 megapixels, and in one of those three formats. Download a PNG version of the icon instead.' },
    { q: 'What PNG size should I use for icons in Google Slides?', a: 'Take the width the icon will fill on a full HD screen and double it. A small icon next to a bullet point needs about 256 to 512 px; an icon that fills half the slide needs about 2048 px. Larger is fine, as long as you stay under 25 megapixels.' },
    { q: 'Can I change the colour of a PNG icon in Google Slides?', a: 'Only roughly. Format options › Recolor offers a few preset tints based on your theme, and you cannot type an exact colour. The clean way is to pick your exact colour on the icon page before you download or copy.' },
    { q: 'Does the convert-to-WMF trick still work?', a: 'It can still get a shape into Slides, but the result is often jagged. WMF has no record type for smooth Bézier curves, so converters cut every curve into short straight lines. It also depends on a third-party Drive app. A large PNG looks better with less work.' },
    { q: 'Can I import a PowerPoint file with SVG icons into Google Slides?', a: 'Yes. Slides imports .pptx files, but an SVG picture inside usually comes through as a flat picture. If you want shapes you can recolour, use Convert to Shape in desktop PowerPoint before saving. Check each icon after import.' },
    { q: 'Will Google Slides ever support SVG?', a: 'Google has not announced it. People have asked on Google’s own help forum for years, and as of November 2026 Google’s documentation still lists only PNG, JPEG and GIF.' },
  ],
  sources: [
    { title: 'Google Slides API: CreateImageRequest (“less than 50 MB… 25 megapixels… PNG, JPEG, or GIF”), checked Nov 2026', url: 'https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#CreateImageRequest' },
    { title: 'Google Docs Editors Help: Crop & adjust images (Recolor, Adjustments), checked Nov 2026', url: 'https://support.google.com/docs/answer/4600160' },
    { title: 'Google Drive Help: Files you can store in Google Drive (presentations up to 100 MB when converted), checked Nov 2026', url: 'https://support.google.com/drive/answer/37603' },
    { title: 'Google Docs Editors Community: “Why in 2025 cant we use svg (vector icons) in Google Slides?”', url: 'https://support.google.com/docs/thread/376413714' },
    { title: 'Microsoft Open Specifications: [MS-WMF] RecordType enumeration (no Bézier record), checked Nov 2026', url: 'https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-wmf/77db8158-96df-4656-a36c-3066de3d5f59' },
    { title: 'phdesign: Adding Font Awesome icons to Google Slides (May 2016, the original WMF trick)', url: 'https://phdesign.com.au/general/adding-font-awesome-icons-to-google-slides/' },
  ],
  body: () => `
${p(`<span class="lede">No, you still cannot insert an SVG file into Google Slides. As of November 2026, Google’s own documentation says Slides images must be <strong>PNG, JPEG or GIF</strong>, under 50 MB and no larger than 25 megapixels. The way to get icons that look sharp is a large transparent PNG, about twice the size it will appear on screen, downloaded in the exact colour you want.</span>`)}
${p(`That sounds like a step backwards if you are used to PowerPoint or Canva, where SVG works. But it is less of a problem than it looks. An SVG is a picture made of shapes, so it stays sharp at any size. A big enough PNG looks just as sharp on a projector, and with icons makes one for you in seconds, in any colour. This post covers the why and the trade-offs. For the plain click-by-click steps, our ${L.guide('google-slides', 'Google Slides guide')} takes two minutes.`)}

${h2('Can you insert an SVG into Google Slides?')}
${p('Not as a file. Try Insert › Image › Upload from computer with an .svg and Slides refuses it (people usually report the message “Unsupported image type”). Dragging the file in, pasting SVG code or picking it from Drive all end the same way. Google Drive will happily <em>store</em> an SVG, which confuses a lot of people, but Slides will not place it on a slide.')}
${table(['What you try', 'Works in Google Slides?', 'What you get'], [
  ['Upload an .svg file', no('No'), 'Refused by the upload'],
  ['Paste SVG code', no('No'), 'Nothing useful, or the code as text'],
  ['Upload a PNG', yes('Yes'), 'A picture with a see-through background'],
  ['Copy image, then paste', yes('Yes, usually'), 'A PNG from the clipboard, ready to resize'],
  ['Import a .pptx with SVG icons', meh('Partly'), 'Usually flat pictures; converted shapes stay editable'],
  ['Convert to WMF, open in Drawings', meh('Partly'), 'A shape, often with jagged curves'],
], 'What happens when you try to get an icon into Google Slides (checked November 2026).')}
${callout('note', `<p>Nothing changed on the Google side: Slides has never taken SVG uploads, and Google has not announced plans to. What changed is everything around it. The top answers online still teach a 2016 workaround (convert to WMF, open with a Drive add-on, copy the shape over). Today, icon sites can export a PNG at any size and colour, and browsers can copy a PNG straight to your clipboard. That makes the old detour unnecessary for icons.</p>`, 'What changed since the old answers')}

${h2('Why does the old WMF trick make jagged icons?')}
${p('The classic workaround goes: convert the SVG to WMF (an old Windows drawing format) with a free converter, open the WMF in Google Drawings, then copy the drawing into Slides. It does give you a shape. The trouble is what happens to the curves on the way.')}
${p('Icons are full of smooth curves: circles, rounded corners, the swoop of a heart. SVG stores these as Bézier curves, a compact recipe for a perfect curve. WMF dates from the early days of Windows, and its list of drawing records has straight lines, polygons, rectangles, ellipses and arcs, but <strong>no Bézier curve at all</strong> (you can check Microsoft’s own WMF specification in the sources). So a converter has to fake each curve with a chain of short straight lines. Zoom in and the circle on your icon is a polygon. Thin outline icons suffer most, because every little corner shows.')}
${art('m-svg-in-google-slides-wmf-vs-png', 'The same icon, zoomed in: curves cut into straight lines by a WMF round trip, next to a large PNG.', { brief: 'A side-by-side zoom of one icon (the with icons heart icon in the line style, dark ink on white) at about 8x magnification. Left panel labelled "SVG → WMF → Slides": the curves visibly made of short straight segments with small kinks, a faint dot at each corner point. Right panel labelled "PNG at 1024 px": smooth curves with soft anti-aliased edges. Small caption chips under each: "jagged curves" and "smooth". Clean, light background, no third-party logos.' })}
${p('There are two more catches. The route usually relies on a third-party converter connected to your Google Drive, which some school and work accounts block. And the shape you end up with is often split into many small pieces, so recolouring it means clicking each one.')}

${h2('What about EMF, PDF or Google Drawings?')}
${ul([
  '<strong>EMF</strong> is WMF’s newer sibling and does have proper curve records, so it can keep icons smoother. You still need a converter you trust, and results vary between converters.',
  '<strong>PDF</strong> cannot be inserted into a slide at all. You would have to turn it back into an image first, which puts you back at PNG.',
  '<strong>Google Drawings</strong> is only a middle step in these tricks: it is where the converted shape gets opened so you can copy it. It does not make SVG work in Slides.',
])}
${p('If you need dozens of editable vector shapes and have no PowerPoint, the EMF route can be worth an afternoon. For a handful of icons on a deck, it is not.')}

${h2('What is the best way to get a sharp icon into Google Slides today?')}
${p('Use a PNG that is big enough. A PNG is a grid of dots, so it only goes blurry when it is stretched past its size. Give Slides more dots than the screen will ever show and nobody can tell it apart from a vector.')}
${p('A simple rule: think about how wide the icon will be when the slide fills a full HD screen (1,920 px across), then <strong>double it</strong>. The extra covers sharp laptop screens, 4K projectors and zooming in while you edit.')}
${table(['How big the icon is on the slide', 'About this wide on a full HD screen', 'Download this PNG size'], [
  ['Small, next to a bullet point', '100 to 200 px', '256 to 512 px'],
  ['Medium, one of three or four in a row', '300 to 500 px', '1024 px'],
  ['Big, half the slide', 'about 960 px', '2048 px'],
  ['Huge, a full-slide backdrop', 'about 1,920 px', '4096 px'],
], 'PNG sizes that stay sharp on a 16:9 slide. All of these are well under Google’s 25 megapixel limit.')}
${art('m-svg-in-google-slides-size-guide', 'Pick the PNG size from how much of the slide the icon fills.', { brief: 'A 16:9 slide mockup (white, light grey frame) with three with icons in the solid style at three sizes: a small lightbulb beside a short bullet line, a medium rocket in a row of three, and a large target filling about half the slide. Each icon has a thin measuring bracket and a label chip: "256-512 px", "1024 px", "2048 px". A small note in the corner: "double the on-screen width". Brand-neutral colours (one accent), no third-party logos.' })}

${h2('How do you add a sharp icon to Google Slides in under a minute?')}
${steps([
  ['Find the icon', `Search ${L.icons('the icon library')} in everyday words, like “idea”, “money” or “team”. Open the icon’s page, for example the ${L.icon('lightbulb')} icon.`],
  ['Set the colour first', 'Type your brand colour or pick one. This is the step that saves you trouble later, because Slides cannot set an exact colour on a PNG.'],
  ['Choose the size', 'Use the table above. 1024 px is a safe default for most slide icons.'],
  ['Copy image or Download PNG', 'Copy image puts the PNG on your clipboard; press Ctrl+V (⌘+V on a Mac) on your slide. Or download the PNG and use Insert › Image › Upload from computer.'],
  ['Resize from a corner', 'Drag a corner handle, never a side one, so the icon keeps its shape.'],
])}
${callout('tip', `If a pasted icon shows a white or black box behind it, the clipboard lost the transparency on the way. Download the PNG and upload it instead; the see-through background stays put. Our post on ${L.post('icon-black-or-white-background', 'why icons get a black or white background')} explains the cause.`)}
${iconGrid(['lightbulb', 'rocket', 'target', 'users', 'chart-line', 'calendar', 'shield-check', 'trophy'], 'solid', 'Solid icons hold up best on slides seen from the back of a room. Every one is a free PNG download in your colour.')}

${h2('How do you keep icons recolourable in Google Slides?')}
${p('This is the real loss with PNG: once it is on the slide, it is one colour. You have three ways around it, from easiest to most work.')}
${steps([
  ['Download again in the new colour', 'It takes ten seconds and gives you the exact colour. Keep the icon page open in a tab while you build the deck.'],
  ['Use Recolor for quick tints', 'Select the PNG, open Format options › Recolor. Slides offers a few tints based on your theme. Fine for a draft, but you cannot type a brand colour.'],
  ['Make real shapes through PowerPoint', 'Insert the SVG in desktop PowerPoint (Microsoft 365 or 2019 and later), choose Convert to Shape, save the .pptx, then import it into Slides with File › Import slides. Slides turns PowerPoint shapes into its own, which you can fill with any colour.'],
])}
${p(`The PowerPoint route is the only way to get true vector icons into Slides without a converter. It is not perfect: test one icon first, because shapes with holes or many parts can shift a little in the conversion. Our PowerPoint downloads won’t help here, by the way. The ready-made slide from an icon page holds the icon as an SVG plus a sharp PNG copy, and Google Slides shows the PNG copy. It looks crisp, but it is still a picture.`)}
${doDont('<p>Choose the colour and size on the icon page, then copy or download. Use one style for the whole deck, and a big PNG for big icons.</p>', '<p>Stretch a small PNG to fill the slide, or run icons through a WMF converter and hope the curves survive.</p>')}

${h2('Which icon styles work best in Google Slides?')}
${p(`Because Slides takes PNG, every style works the same way, including the colourful ones that would never fit in an icon font. Line and solid are the safe picks for business decks. For a title slide or a section divider, a richer style such as ${L.style('gloss')} or ${L.style('clay')} gives you an illustration without any design work.`)}
${styleRow('presentation', '', { styles: ['line', 'solid', 'duo', 'gloss', 'clay', 'glass', 'sticker', 'sketch'] })}
${p(`Whatever you choose, keep to one style per deck so slides feel like a set. Our longer guide to ${L.post('icons-in-presentations', 'icons in presentations')} covers sizes, spacing and layouts that work, and ${L.post('svg-vs-png-icons', 'SVG vs PNG icons')} explains when each file type is the right one.`)}

${h2('The short answer')}
${p(`Google Slides takes PNG, JPEG and GIF, not SVG, and that has not changed in 2026. Skip the WMF detour: download a transparent PNG about twice the size it will show, in your exact colour, or press Copy image and paste. If you truly need editable shapes, go through desktop PowerPoint’s Convert to Shape. Find a matching set on our ${L.page('free/icons-for-google-slides.html', 'free icons for Google Slides')} page: every icon in every style, MIT licensed, no credit needed.`)}
${cta('Icons that look sharp in Google Slides', `${N_ICONS} icons in ${N_STYLES} styles. Pick a colour, pick a size, copy or download the PNG. Free, no sign-up.`, ['presentation', 'lightbulb', 'rocket', 'target', 'sparkles', 'star'])}
`,
}
