import { p, h2, h3, ul, iconGrid, sizeRamp, table, yes, no, meh, callout, doDont, code, steps, cta, art, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'svg-icon-cut-off-or-blurry',
  category: 'code',
  date: '2026-11-06',
  hero: 'h-svg-icon-cut-off-or-blurry',
  stickers: [['crop', 'blueprint'], ['maximize', 'duo'], ['eye', 'solid']],
  title: 'Why is my SVG icon cut off, blurry or the wrong size? (2026 fixes)',
  cardTitle: 'SVG icon cut off or blurry?',
  h1: 'Why is my SVG icon <em>cut off, blurry</em> or the wrong size?',
  dek: 'Almost every one of these problems comes down to three attributes and a few pixels. Here is what viewBox, width and height really do, why icons get clipped or go soft, and how to keep strokes steady at any size.',
  description: 'Fix SVG icons that are cut off, blurry or the wrong size: what viewBox and width/height do, why icons clip or go soft, and how to keep strokes the same width.',
  keywords: ['svg icon cut off', 'svg clipped', 'svg viewbox explained', 'svg width height viewbox', 'resize svg', 'svg not scaling', 'svg icon blurry', 'blurry svg icons chrome', 'vector-effect non-scaling-stroke', 'svg stroke width scaling', 'svgo removes viewbox'],
  about: ['Scalable Vector Graphics', 'viewBox', 'Anti-aliasing', 'vector-effect', 'SVGO', 'with icons'],
  related: ['optimize-svg-icons-svgo', 'icon-sizes-guide', 'svg-sprites'],
  tldr: [
    '<strong>Keep the <code>viewBox</code>.</strong> It is the drawing’s own graph paper (<code>0 0 24 24</code> for most icon sets). Without it the icon cannot scale, so it crops or sits tiny in a big box.',
    '<strong>Keep <code>width</code> and <code>height</code> too, then size with CSS.</strong> The attributes are the safe default; CSS overrides them. The old advice to delete them makes icons balloon when CSS is missing.',
    '<strong>Cut off?</strong> The drawing goes past its viewBox (often a stroke at the edge), the viewBox was stripped or is wrong, or a parent box is too small. Nested SVGs hide overflow by default.',
    '<strong>Blurry?</strong> The icon lands on part-pixels: a 24-grid icon shown at 20 px, a size like <code>1.2rem</code> (19.2 px), or a <code>translate(-50%)</code> centre. Use whole multiples of the grid and whole-pixel positions.',
    '<strong>Strokes too thick when big?</strong> <code>vector-effect: non-scaling-stroke</code> keeps them a fixed width and has worked in every major browser since July 2020. SVGO 4 (June 2025) also stopped removing <code>viewBox</code> by default.',
  ],
  faq: [
    { q: 'Should I remove width and height from an SVG?', a: 'No. Keep them as the default size and set the real size in CSS, which overrides the attributes. If you delete them, an inline icon with a viewBox stretches to fill its container whenever your CSS fails to load or does not reach it, which is why so many pages flash giant icons.' },
    { q: 'What does viewBox do in an SVG?', a: 'It sets the drawing’s own coordinate system: four numbers for the left edge, top edge, width and height of the area the artwork lives in. The browser then scales that area to fit the element’s width and height. <code>viewBox="0 0 24 24"</code> means “a 24 by 24 unit drawing”, whatever size it is shown at.' },
    { q: 'Why is my SVG icon cut off at the edges?', a: 'Usually because part of the drawing sits outside the viewBox. A stroke is centred on its path, so a line drawn right on the edge loses half its width. Other causes: the viewBox was removed by an optimiser or export, it has the wrong numbers, or a parent box with overflow hidden is smaller than the icon. Fix the drawing or the viewBox first; <code>overflow: visible</code> is a last resort.' },
    { q: 'Why do my SVG icons look blurry in Chrome?', a: 'SVGs are smoothed (anti-aliased) wherever an edge falls between two pixels. Icons get soft when they are shown at a size that does not fit their grid (a 24 grid at 20 px), at fractional sizes from rem or em units, or at part-pixel positions from centring tricks and transforms. On high-density screens it is much less visible.' },
    { q: 'How do I keep the same stroke width when an SVG scales?', a: 'Add <code>vector-effect: non-scaling-stroke</code> to the paths, as an attribute or in CSS. The stroke then stays the same number of screen pixels at any size. Icon components often offer a prop for it: with icons has <code>absoluteStrokeWidth</code>, and Lucide calls it <code>nonScalingStroke</code>.' },
    { q: 'Does SVGO still remove viewBox?', a: 'Not by default any more. SVGO 4.0.0, released on 21 June 2025, took <code>removeViewBox</code> and <code>removeTitle</code> out of its default preset. Older SVGO 2 and 3 setups, and build plugins pinned to them, still strip viewBox unless you turn the plugin off.' },
  ],
  sources: [
    { title: 'MDN: viewBox attribute, checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/viewBox' },
    { title: 'MDN: overflow attribute (hidden by default on nested svg), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/overflow' },
    { title: 'W3C SVG 2: user agent style sheet (svg:not(:root), symbol { overflow: hidden })', url: 'https://www.w3.org/TR/SVG2/styling.html' },
    { title: 'W3C CSS 2.1: replaced elements fall back to 300px by 150px', url: 'https://www.w3.org/TR/CSS21/visudet.html' },
    { title: 'MDN: vector-effect (Baseline Widely available since July 2020), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/vector-effect' },
    { title: 'MDN: shape-rendering, checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/shape-rendering' },
    { title: 'SVGO v4.0.0 release notes (21 June 2025)', url: 'https://github.com/svg/svgo/releases/tag/v4.0.0' },
    { title: 'SVGO docs: migration from v3 to v4, checked November 2026', url: 'https://svgo.dev/docs/migrations/migration-from-v3-to-v4/' },
    { title: 'Aaron Gustafson: Please size your inline SVGs', url: 'https://www.aaron-gustafson.com/notebook/please-size-your-inline-svgs/' },
    { title: 'Lucide docs: stroke width and nonScalingStroke, checked November 2026', url: 'https://lucide.dev/guide/basics/stroke-width' },
    { title: 'Stack Overflow: How can I make an SVG scale with its parent container? (question 19484707)', url: 'https://stackoverflow.com/questions/19484707/how-can-i-make-an-svg-scale-with-its-parent-container' },
    { title: 'Stack Overflow: Why is my resized SVG icon blurry when rendered? (question 57628106)', url: 'https://stackoverflow.com/questions/57628106/why-is-my-resized-svg-icon-blurry-when-rendered' },
    { title: 'Stack Overflow: Fixed stroke width in SVG (question 1301685)', url: 'https://stackoverflow.com/questions/1301685/fixed-stroke-width-in-svg' },
  ],
  body: () => `
${p(`<span class="lede">An SVG icon that is cut off, blurry or the wrong size almost always has one of three causes. Its <code>viewBox</code> (the drawing’s own coordinate box) is missing or wrong, so it cannot scale and gets cropped. Part of the drawing sits outside that box, often a stroke right on the edge. Or it is shown at a size or position that falls between pixels, so the edges go soft. Keep the viewBox, keep <code>width</code> and <code>height</code> as a default, set the real size in CSS, and use whole-pixel sizes that fit the icon’s grid.</span>`)}
${p(`Below: what the three attributes do, then clipping, blur and stroke width, each with its fix. Not a developer? Every icon page on ${L.icons('with icons')} lets you download a PNG at the exact pixel size you need, which sidesteps all of this.`)}

${callout('note', `<p>The most-viewed answers to “how do I resize an SVG” (over 600,000 views each on Stack Overflow) date from 2010 to 2013 and say: delete the width and height. That trades one problem for another. SVGO, the optimiser inside many build tools, removed <code>viewBox</code> by default until version 4.0.0 (21 June 2025). And the accepted answer on fixed stroke widths (2009) mentions “Opera 10”; <code>vector-effect</code> has worked in every major browser since July 2020.</p>`, 'What changed since the old answers')}

${h2('What do viewBox, width and height actually do?')}
${p('Think of an SVG as a drawing on graph paper inside a picture frame. The <strong>viewBox</strong> describes the graph paper: four numbers for its left edge, top edge, width and height. <code>viewBox="0 0 24 24"</code> means the artwork lives on a 24 by 24 unit sheet. The <strong>width and height</strong> describe the frame: how big the picture is on the page. The browser scales the graph paper to fill the frame.')}
${p('So one icon can be 16 or 160 pixels without changing a shape. Here is the line home icon as with icons ships it:')}
${code(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="1.75"
     stroke-linecap="round" stroke-linejoin="round">
  <path d="M2.5 11 L12 3.5 L21.5 11"/>
  <path d="M5 9.5 V19 A2 2 0 0 0 7 21 H17 A2 2 0 0 0 19 19 V9.5"/>
  <path d="M9.5 21 V16 A1.5 1.5 0 0 1 11 14.5 H13 A1.5 1.5 0 0 1 14.5 16 V21"/>
</svg>`)}
${art('m-svg-icon-cut-off-or-blurry-viewbox', 'The viewBox is the graph paper, width and height are the frame. Change the frame and the drawing scales with it.', { brief: 'Explainer diagram in three panels, left to right. Panel 1: the line "home" icon drawn on a 24 x 24 blueprint-style grid with axis labels 0 and 24, labelled "viewBox = 0 0 24 24 (the graph paper)". Panel 2: the same icon inside three picture frames of 16, 24 and 48 px, labelled "width / height (the frame)". Panel 3: a broken case, the frame resized to 48 but no viewBox, so the icon stays small in the top-left corner of a big empty frame, labelled "no viewBox: nothing scales". Clean blueprint accent colours.' })}

${h2('What happens if I remove the viewBox, width or height?')}
${p('Each combination behaves differently, and most “my icon is huge” or “my icon is tiny” bugs are one of these rows.')}
${table(['What the SVG has', 'What you see', 'Verdict'], [
  ['viewBox + width + height', 'The default size, and CSS can resize it cleanly', yes('Best')],
  ['viewBox only', 'An inline icon stretches to fill its container whenever CSS does not size it', meh('Giant icons if CSS fails')],
  ['width + height only', 'A fixed drawing: make the box bigger and the icon stays small; smaller and it is cropped', no('Cannot scale')],
  ['Neither', 'The browser falls back to its default box for embedded content (300 by 150 pixels), with the drawing at its raw size', no('Broken')],
], 'viewBox, width and height combinations (November 2026)')}
${p(`Aaron Gustafson makes the case well in “Please size your inline SVGs”: if the size only lives in CSS and the stylesheet fails or arrives late, every inline icon swells to fill the page. The <code>width</code> and <code>height</code> attributes are a cheap safety net.`)}

${h2('How do I resize an SVG icon properly?')}
${steps([
  ['Keep the viewBox', 'Never delete it. It is what makes scaling possible. If a file has none, add one that matches the drawing, usually <code>0 0 24 24</code> for interface icons.'],
  ['Keep width and height as the default', 'Set them to the size the icon was designed for (24 for a 24-grid set). They stop the icon from ballooning when CSS is missing.'],
  ['Set the real size in CSS', 'CSS beats the attributes. Use <code>width: 1em; height: 1em</code> to match the text around it, or a fixed size such as 20 or 24 pixels.'],
  ['Use the icon’s colour, not a hard-coded one', `With <code>stroke="currentColor"</code> or <code>fill="currentColor"</code> the icon follows your text colour. Our ${L.post('change-svg-icon-color-css', 'guide to changing SVG colour with CSS')} covers the rest.`],
])}
${code(`.icon { width: 1em; height: 1em; }    /* follows the font size */
.btn .icon { width: 20px; height: 20px; }`, 'css')}
${p(`Using components? They do this for you. <code>&lt;Home size={20} /&gt;</code> in ${L.page('free/icons-for-react.html', 'with icons for React')} writes the width, height and viewBox for you, and the ${L.guide('html', 'HTML guide')} shows the same for plain pages.`)}

${h2('Why is my SVG icon cut off?')}
${p('A clipped icon is showing you its viewBox edge. Anything drawn outside that box is not painted, because browsers hide overflow on SVGs inside a page by default (the SVG 2 user agent style sheet sets <code>overflow: hidden</code> on nested <code>svg</code> and on <code>symbol</code>). The usual causes, most common first:')}
${ul([
  '<strong>A stroke on the edge.</strong> A stroke is centred on its path, so half of it falls outside. A circle with radius 12 in a 24 box, drawn with a 2-unit stroke, loses one unit all round and looks flattened at the sides.',
  `<strong>The viewBox was stripped.</strong> SVGO before version 4, and build plugins still pinned to it, remove it by default (SVGO’s own docs now warn this “prevents SVGs from scaling”). Run <code>npx svgo --version</code>; our ${L.post('optimize-svg-icons-svgo', 'SVGO guide')} has a safe config.`,
  '<strong>The viewBox has the wrong numbers.</strong> Design tools export the artboard. If it was smaller than the icon, or sat at an offset, the box cuts through the drawing.',
  '<strong>A parent box is too small.</strong> A fixed-height button or a wrapper with <code>overflow: hidden</code> can hide part of a good icon.',
  '<strong><code>preserveAspectRatio="xMidYMid slice"</code>.</strong> “Slice” fills the frame and crops the rest. Icons want the default.',
])}
${art('m-svg-icon-cut-off-or-blurry-clipped', 'Three ways an icon gets clipped: a stroke on the edge, a wrong viewBox and a parent that is too small.', { brief: 'Do/don’t style triptych on a light background, each tile a 24-grid with the viewBox edge drawn as a dashed red line. Tile 1: a circle stroke touching the edge, the outer half of the stroke shaded red and labelled "half the stroke is outside". Tile 2: the "bell" icon with a viewBox box shifted left so the right side is cut, labelled "wrong viewBox". Tile 3: the "settings" icon inside a button whose height is smaller than the icon, top and bottom clipped, labelled "parent too small". Green check versions small underneath each.' })}
${doDont('<p>Fix the cause: pull the drawing in from the edge (good icon sets keep artwork a unit or two inside the box), restore or correct the viewBox, or give the parent room.</p>', '<p>Reach for <code>overflow: visible</code> first. It works, but the icon now paints outside its own box, overlapping neighbours and ignoring the layout space it claims.</p>')}
${p(`Every with icons drawing keeps its artwork between 2 and 22 units on the 24 grid, so even round shapes with their stroke stay inside the viewBox. More on keylines in ${L.post('consistent-icons', 'how to keep icons consistent')}.`)}

${h2('Why do my SVG icons look blurry?')}
${p('An SVG is redrawn from shapes at every size, so it never pixelates like a stretched photo. But your screen is a grid of pixels. An edge that lands on a pixel boundary looks crisp. One that lands halfway across a pixel gets shaded half-way (anti-aliasing), and looks soft.')}
${h3('1. The size does not fit the grid')}
${p('A 24-grid icon at 24 pixels gets exactly one pixel per unit. At 48 it gets two. At 20 pixels each unit is 0.83 of a pixel, so lines that were drawn on whole units now fall on fractions. Here is the same set at five sizes. Look closely at 20 and 32 next to 24 and 48:')}
${sizeRamp(['home', 'bell', 'settings', 'calendar'], [16, 20, 24, 32, 48], 'line', 'Real SVGs drawn live in your browser. On a standard (1x) screen, 24 and 48 px fit the 24-unit grid best.')}
${table(['Shown at', 'Pixels per unit (24 grid)', 'Sharpness'], [
  ['16 px', '0.67', meh('Soft unless the icon was drawn for 16')],
  ['20 px', '0.83', meh('Slightly soft')],
  ['24 px', '1', yes('Crisp')],
  ['32 px', '1.33', meh('Mostly fine')],
  ['48 px', '2', yes('Crisp')],
], 'How a 24-unit icon maps onto screen pixels')}
${h3('2. Fractional sizes and positions')}
${p('Relative units add hidden fractions: <code>1.2rem</code> on a 16 px base is 19.2 pixels. Centring with <code>translate(-50%, -50%)</code> in a box with an odd width puts the icon on a half pixel. Check the computed size and position in your browser’s developer tools, and round any decimals.')}
${h3('3. Bitmaps stretched by the browser or by you')}
${p('If an icon goes soft only during or after a scale animation, the browser is probably stretching a bitmap copy it made for speed: do not leave <code>will-change: transform</code> on permanently. And if the “SVG” is really a scaled-up PNG, get a real vector or a PNG at the final size.')}
${art('m-svg-icon-cut-off-or-blurry-blur', 'The same edge on a pixel boundary (crisp) and halfway across a pixel (soft).', { brief: 'Zoomed-in pixel grid illustration, two halves side by side. Left: a vertical stroke of the "home" icon’s wall aligned to whole pixels, solid dark pixels, labelled "on the pixel grid: crisp". Right: the same stroke shifted half a pixel, rendered as two columns of grey 50% pixels, labelled "half a pixel off: soft". Below, small real-size renders of the line "home" icon at 24 px and at 19.2 px for comparison.' })}
${p(`What does not help: <code>translateZ(0)</code> and similar hacks from old answers. <code>shape-rendering="crispEdges"</code> may switch smoothing off, which can sharpen straight lines but makes curves jagged, so keep it for pixel art and charts. For truly pixel-sharp icons, the ${L.style('pixel', 'pixel style')} is drawn one unit per pixel and is crisp at 24, 48 and 72 px. On high-density screens all of this matters far less, because each unit gets two or three real pixels.`)}
${iconGrid(['home', 'heart', 'star', 'bell', 'gift', 'rocket'], 'pixel', 'Pixel style at 48 px: every square lands on two real pixels.', { size: 48 })}

${h2('How do I keep the stroke width the same when an icon scales?')}
${p('By default, strokes scale with the drawing. A 1.75-unit stroke is about 1.2 pixels at 16 px and 3.5 pixels at 48 px. Usually that is right, because the icon keeps its proportions. Sometimes you want a fixed line, for example big hero icons that should match a 1.5 px illustration.')}
${p('The CSS answer is <code>vector-effect: non-scaling-stroke</code>. It keeps the stroke at its set width in screen pixels. MDN lists it as Baseline Widely available since July 2020. Page CSS only reaches inline SVG; for a file in an <code>&lt;img&gt;</code>, write it inside the file.')}
${code(`.icon-fixed path,
.icon-fixed circle { vector-effect: non-scaling-stroke; }`, 'css')}
${p(`Component libraries usually wrap this in a prop. In with icons React, Vue and web components it is <code>absoluteStrokeWidth</code> (or the <code>absolute-stroke-width</code> attribute), which recalculates the stroke for the size you ask for. Lucide’s current docs call theirs <code>nonScalingStroke</code>. Only stroke-based styles such as ${L.style('line')}, ${L.style('duo')}, ${L.style('blueprint')} and ${L.style('sketch')} have a live stroke to adjust; filled styles are shapes, so they scale as a whole.`)}
${iconGrid(['ruler', 'pencil', 'crop', 'maximize', 'zoom-in', 'scan'], 'blueprint', 'Blueprint style draws a finer 1.25-unit line, closer to a hairline at large sizes.')}


${h2('Quick fixes: which problem do you have?')}
${table(['Symptom', 'Most likely cause', 'Fix'], [
  ['Icon is huge', 'No width/height, size only in CSS that did not apply', 'Add <code>width</code> and <code>height</code>, check the CSS selector'],
  ['Icon stays tiny in a big box', 'No viewBox', 'Add <code>viewBox="0 0 24 24"</code> (or the drawing’s real box)'],
  ['Edges cut off', 'Stroke on the edge, wrong viewBox or small parent', 'Fix the drawing or viewBox; give the parent room'],
  ['Soft or fuzzy', 'Off-grid size, fractional size or position', 'Use 24 or 48 px for a 24 grid; round sizes and positions'],
  ['Lines too thick when big', 'Strokes scale with the icon', '<code>vector-effect: non-scaling-stroke</code> or an absolute stroke prop'],
], 'SVG icon troubleshooting at a glance')}

${h2('The bottom line')}
${p(`Keep the viewBox, keep width and height as a fallback, size icons in CSS, and use sizes that fit the grid. Those four habits fix most cut-off and blurry icons. For icons that already follow them, all ${N_ICONS} with icons are drawn on the same 24 grid with a proper viewBox in each of the ${N_STYLES} styles. Browse ${L.icons('the icon library')} or read the ${L.post('icon-sizes-guide', 'icon sizes guide')} next.`)}
${cta('Icons with a proper viewBox, every time', `${N_ICONS} icons in ${N_STYLES} styles, drawn on one 24 grid. Copy the SVG, download a PNG at any size, or install the components. Free, MIT licensed.`, ['crop', 'maximize', 'eye', 'ruler', 'sparkles', 'check-circle'])}
`,
}
