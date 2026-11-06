import { p, h2, ul, iconGrid, styleRow, sizeRamp, table, callout, steps, doDont, code, cta, art, L, N_ICONS, N_STYLES, N_SVGS, N_CATEGORIES } from '../lib/blocks.mjs'

export default {
  slug: 'how-to-design-an-icon',
  category: 'basics',
  date: '2026-11-06',
  hero: 'h-how-to-design-an-icon',
  stickers: [['pencil-ruler', 'blueprint'], ['layout-grid', 'duo'], ['pen-tool', 'gloss']],
  title: 'How to design an icon on a 24 px grid: keylines, strokes and Figma',
  cardTitle: 'How to design an icon',
  h1: 'How to design an icon on a <em>24 px grid</em>',
  dek: 'The grid, the four keylines, one stroke weight and a few rules for corners and spacing. Then how to name, organise and export your icons in Figma today, with the way we draw every with icons icon as the worked example.',
  description: 'How to design an icon on a 24 px grid: keylines, padding, stroke weight, corner radius, pixel snapping, naming, Figma component properties and SVG export.',
  keywords: ['how to design an icon', 'icon grid 24px', 'icon keylines', 'icon grid figma', 'icon design guidelines', 'icon stroke weight', 'icon naming convention', 'outline stroke before export'],
  about: ['Icon design', 'Keyline', 'Grid (graphic design)', 'Figma', 'Design system'],
  related: ['consistent-icons', 'best-figma-icon-libraries', 'icon-sizes-guide'],
  tldr: [
    '<strong>Start with a 24 x 24 frame</strong> and keep the drawing inside the 20 x 20 live area, so 2 px of padding on every side.',
    '<strong>Fit each silhouette to a keyline:</strong> a 20 px circle, an 18 px square, a 16 x 20 portrait or a 20 x 16 landscape rectangle. Circles get more room because they look smaller.',
    '<strong>One stroke weight, one corner radius:</strong> for example 2 px strokes with round caps, radius 2 on containers, 2 px of white between parallel lines, points snapped to whole or half pixels.',
    '<strong>Name icons for what they show</strong> in kebab-case (<code>trash</code>, not <code>delete-button-v2</code>) and keep the guesses (bin, delete, remove) as aliases.',
    '<strong>Keep strokes live</strong> in your source and in exported SVGs for code. Outlining them turns lines into shapes, and stroke-width settings in code stop working.',
  ],
  faq: [
    { q: 'What size should I design icons at?', a: 'Design interface icons on a 24 x 24 grid with a 20 x 20 live area. 24 px is the most common size in apps and websites, and it scales cleanly to 16, 20, 32 and 48. If your product mostly shows icons at 16 px, draw a separate, simpler 16 px version rather than shrinking the 24.' },
    { q: 'What are keylines in icon design?', a: 'Keylines are guide shapes inside the grid that tell you how big each kind of silhouette should be: a circle, a square, a tall rectangle and a wide rectangle. They are sized so a round icon, a square icon and a tall icon all look equally big, even though their measurements differ.' },
    { q: 'What stroke width should icons have?', a: 'Pick one weight for the whole set and never mix. 2 px at 24 px is common and reads well on screens; 1.5 to 1.75 px looks lighter and more refined. with icons draws its skeletons for a 2 px stroke and renders its line style at 1.75 px.' },
    { q: 'Should I outline strokes before exporting SVG icons?', a: 'Not for icons that will be used in code. Outlined strokes become filled shapes, so a strokeWidth setting can no longer change them. Keep strokes live and centred. Outline only for tools that need filled shapes, such as cutting machines or icon fonts.' },
    { q: 'How should I name icons in a design system?', a: 'Use short, lowercase, hyphenated names that describe what the icon shows (arrow-right, file-pdf, bell-off), and use the same names in Figma and in code. Put the words people might search for instead (bin, delete, remove) into aliases or the component description.' },
    { q: 'How do I set up icons in Figma now?', a: 'Make one component per icon on the 24 grid, then use an instance swap property wherever an icon sits inside another component, like a button, with preferred instances to keep the list short. Number variables can hold sizes and stroke weights, and colour variables can hold the stroke colour.' },
  ],
  sources: [
    { title: 'Figma Learn: Create a reusable icon grid (checked November 2026)', url: 'https://help.figma.com/hc/en-us/articles/18770195788951-Create-a-reusable-icon-grid' },
    { title: 'Figma Learn: Explore component properties (checked November 2026)', url: 'https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties' },
    { title: 'Figma Learn: Apply variables to designs (checked November 2026)', url: 'https://help.figma.com/hc/en-us/articles/15343107263511-Apply-variables-to-designs' },
    { title: 'Figma Learn: Export formats and settings (checked November 2026)', url: 'https://help.figma.com/hc/en-us/articles/13402894554519-Export-formats-and-settings' },
    { title: 'Figma Plugin API updates, 10 June 2026: Slots GA', url: 'https://developers.figma.com/docs/plugins/updates/2026/06/10/update/' },
    { title: 'with icons authoring contract (forge/CONTRACT.md, GitHub)', url: 'https://github.com/withevergrow/withicons/blob/main/forge/CONTRACT.md' },
    { title: '@withicons/react README (size and strokeWidth props)', url: 'https://www.npmjs.com/package/@withicons/react' },
  ],
  body: () => `
${p(`<span class="lede">To design an icon, draw it on a <strong>24 x 24 grid</strong>, keep it inside the <strong>20 x 20 live area</strong> (2 px of padding all round), and fit its outline to one of four <strong>keylines</strong>: a 20 px circle, an 18 px square, a 16 x 20 tall rectangle or a 20 x 16 wide one. Use one stroke weight and one corner radius for the whole set, snap points to whole or half pixels, name it for what it shows, and keep the strokes live when you export.</span>`)}
${p(`That is how we draw all ${N_ICONS} with icons icons, so our own rules are the worked example. Each icon is drawn once on the 24 grid and our code turns it into ${N_STYLES} styles (${N_SVGS} SVGs), so the geometry has to be clean.`)}
${callout('note', '<p>The guides that still rank were written before Figma had component properties and variables, so they stop at "make a component". Today an icon can be swapped inside a button with an instance swap property, variables can hold its size, stroke weight and colour, and slots became generally available in June 2026 (Figma’s developer changelog). Many old guides also say "outline strokes before export", which breaks stroke-width settings in code.</p>', 'What changed since the old answers')}

${h2('Why do icons use a 24 px grid?')}
${p(`24 px is the size most apps and websites show icons at next to text, and it scales cleanly to 12 and 48. It is big enough for detail and small enough that every pixel counts. Our ${L.post('icon-sizes-guide', 'icon sizes guide')} covers which size to use where.`)}
${sizeRamp(['home', 'search', 'lock', 'settings'], [16, 20, 24, 32, 48], 'line', 'Drawn once on the 24 grid, shown at 16 to 48 px. Simple shapes survive the smallest size.')}

${h2('What are keylines, and which one should my icon use?')}
${p('Keylines are guide shapes inside the grid. Each one says how big a certain kind of silhouette may be. They exist for <strong>optical balance</strong>: a circle and a square of the same width do not look the same size, because the circle has less ink in its corners. So the circle gets a little more room than the square, and the result looks even.')}
${table(['Keyline', 'Size on the 24 grid', 'Use it for', 'with icons examples'], [
  ['Circle', '20 px across, centred at 12, 12', 'Round objects and circle badges', `${L.icon('check-circle')}, ${L.icon('settings')}`],
  ['Square', '18 x 18 (3 to 21)', 'Boxy objects and containers', `${L.icon('calendar')}, ${L.icon('check-square')}`],
  ['Portrait', '16 x 20 (4 to 20 across, 2 to 22 down)', 'Tall things', `${L.icon('file')}, ${L.icon('smartphone')}`],
  ['Landscape', '20 x 16 (2 to 22 across, 4 to 20 down)', 'Wide things', `${L.icon('monitor')}, ${L.icon('battery')}`],
], 'The four keylines from our authoring contract. Figma’s own icon grid tutorial uses the same set.')}
${art('m-how-to-design-an-icon-keylines', 'The four keylines on a 24 px grid, and real icons that sit on each one.', { brief: 'A large 24 x 24 grid (1 px cells, faint lines) with the 2 px padding shaded and the four keylines drawn in thin red: 20 px circle, 18 px square, 16 x 20 portrait and 20 x 16 landscape. Beside it, four small panels each showing one keyline with a real with icons line icon laid over it: check-circle on the circle, calendar on the square, file on the portrait, monitor on the landscape. Short labels only: "Circle 20", "Square 18", "Portrait 16 x 20", "Landscape 20 x 16".' })}
${p('Pick the keyline your silhouette fits and use the same one for related icons, so a row of them lines up.')}

${h2('How much padding should an icon have?')}
${p('Leave 2 px empty on every side, so the drawing lives inside a 20 x 20 square from 2 to 22. Round forms may touch that edge. Square forms usually stay a pixel further in, from 3 to 21, for the same optical reason as the keylines. The padding lets an icon sit next to text without looking cramped, and keeps strokes from being cut off at the edge.')}

${h2('What stroke weight should icons have?')}
${p(`Choose one weight and use it everywhere. Our skeletons are drawn for a 2 px stroke with <strong>round caps and round joins</strong>, and the ${L.style('line')} renders them at 1.75 px for a slightly lighter look.`)}
${ul([
  '<strong>Spacing:</strong> keep at least 2 px of white between parallel strokes, so their centre lines sit 4 px or more apart. Closer lines merge at 16 px.',
  '<strong>Density:</strong> 1 to 6 paths is typical, and never more than four parallel lines. Simplify before you add detail.',
])}

${h2('What corner radius should icons use?')}
${p('Match it across the set. Our rule: rectangles and containers get a radius of 2, small parts get 1 to 1.5. Mixing sharp and round corners is the fastest way to make a set look assembled from different places. Our post on making icons look ' + L.post('consistent-icons', 'consistent') + ' goes deeper.')}

${h2('How do I snap an icon to the pixel grid?')}
${p('Put every end point and corner on a whole or half pixel (12, 12.5, 13). Figma’s icon grid tutorial sets the layout grid to 1 px and the small nudge to 0.5 for the same reason. Edges on pixel boundaries look crisp; edges at 12.37 look soft.')}
${doDont('<p>Snap points to 0.5, check the icon at its real size (16 and 24 px) on light and dark backgrounds, and compare it beside four or five finished icons.</p>', '<p>Judge an icon only at 800% zoom. Almost everything looks fine huge; small sizes are where blur and crowding show up.</p>')}

${h2('How do I make a whole set look like one family?')}
${p('Reuse parts. We keep a short list of shared shapes with exact coordinates (the document with its folded corner, the folder, the bell, the cloud, the containers, the check mark), and a new icon starts from them. That is why our file icons look like siblings:')}
${iconGrid(['file', 'file-text', 'file-pdf', 'file-image', 'file-lock', 'file-check'], 'line', 'One shared document shape with the fold, different content inside.')}
${p('Modifiers follow rules too. A badge (plus, check, lock) sits in a 4 px radius circle in the bottom right, centred near 17.5, 17.5, and the base icon is trimmed back to leave a gap. An "off" icon uses one diagonal slash from 3, 3 to 21, 21 with the drawing cut back on both sides.')}
${iconGrid(['bell', 'bell-off', 'bell-ring', 'bell-plus', 'user', 'user-plus', 'user-check', 'user-x'], 'line', 'The same bell and the same person, with a slash, motion lines or a corner badge added by rule.')}
${art('m-how-to-design-an-icon-anatomy', 'Anatomy of one icon: live area, keyline, stroke, radius and badge.', { brief: 'One big with icons user-plus line icon at about 400 px on a faint 24 px grid, annotated with thin callout lines: "2 px padding" on the shaded border, "keyline" (the circle) behind it, "2 px stroke, round caps" on a stroke end, "radius 2" on a corner if present, "badge: r4 at 17.5, 17.5" on the plus badge, and "1.5 px gap" where the body is trimmed around the badge. Blueprint-like but light; labels short.' })}

${h2('How should I name and organise icons in a design system?')}
${p('Name icons for <strong>what they show</strong>, in lowercase words joined by hyphens: <code>trash</code>, <code>arrow-right</code>, <code>file-pdf</code>, <code>bell-off</code>. A name like <code>delete</code> describes one use; the same bin also means "remove". Put the object first and the modifier after, so related icons sort together.')}
${p('Then keep the words people will guess as aliases. Our <code>trash</code> answers to bin, delete, garbage and remove. In Figma, put those words in the component description. In code, use the exact same names, so a designer and a developer never translate between two lists.')}
${p(`Group icons into categories (we use ${N_CATEGORIES}, such as navigation, files and communication). And treat a rename as a breaking change: keep the old name working as an alias.`)}

${h2('How do I set up icon components in Figma today?')}
${steps([
  ['Build the grid once', 'A 24 x 24 frame with a 1 px layout grid, the padding and the four keylines, saved as a component. Figma’s own tutorial walks through it.'],
  ['One component per icon', 'Each icon is a 24 x 24 component named like the code (<code>arrow-right</code>), with its strokes kept as centred, live strokes and its vector layer set to scale with the frame.'],
  ['Swap icons, don’t detach', 'In a button or menu item, make the icon an instance swap property and add preferred instances, so people pick from a short, relevant list. A boolean property can show or hide the icon.'],
  ['Put sizes and colours in variables', 'Figma’s number variables can be bound to width and height, corner radius and stroke weight; colour variables to strokes and fills. A 16, 20 and 24 px size scale and an icon colour then live in one place.'],
  ['Write the description', 'Add the aliases and a one-line meaning to each component’s description.'],
])}
${art('m-how-to-design-an-icon-figma-setup', 'An icon slot in a button: one instance swap property, a short preferred list, and variables for size and colour.', { brief: 'A clean, generic design-tool mockup (no real app logos or chrome): on the left a button component with a with icons line icon (arrow-right) and the label "Continue"; on the right a properties panel listing "Icon: instance swap" with a dropdown of preferred icons (arrow-right, check, plus, download), "Show icon: on" (boolean), and a variables section with "icon/size = 20" and "icon/stroke = 1.75" and a colour chip "icon/color". Short labels only.' })}
${p(`Would rather not draw the basics yourself? Our ${L.guide('figma', 'Figma guide')} shows how to paste any of our icons into Figma as editable vectors, and ${L.post('best-figma-icon-libraries', 'the best Figma icon libraries')} compares the sets that ship as Figma components.`)}

${h2('Should I outline strokes before exporting SVG icons?')}
${p('For icons that will be used in code: no. Outlining turns each line into a filled shape. The icon looks identical, but a developer can no longer make the lines thinner or thicker, because there is no line left, only a shape. Here is that setting in our React package:')}
${code(`import { Search } from '@withicons/react'

<Search size={20} strokeWidth={1.5} />`, 'jsx')}
${p('Two Figma details to know. SVG only understands strokes centred on the path, so use centre strokes; Figma’s export settings say inside and outside strokes need its "Simplify stroke" option to come out right. And Figma’s export notes warn that strokes can be exported as fills, so open the exported file and check that it still says <code>stroke-width</code>.')}
${p('Outlining is right for icon fonts and cutting machines, which need filled shapes. Keep the outlined copy as an export, never as your source.')}

${h2('How do I check an icon before it ships?')}
${ul([
  '<strong>At real size:</strong> 16 and 24 px, not just zoomed in.',
  '<strong>On light and dark:</strong> thin details that read on white can vanish on a dark background.',
  `<strong>Beside its neighbours:</strong> we compare every new icon with ${L.icon('home')}, ${L.icon('search')}, ${L.icon('lock')} and ${L.icon('settings')} for size and ink weight.`,
])}
${p('Clean geometry pays off twice. Because each of our skeletons follows these rules, it can be redrawn by code in every style, from line to sticker to soft 3D:')}
${styleRow('lightbulb', '', { styles: ['line', 'solid', 'duo', 'blueprint', 'sketch', 'pixel', 'sticker', 'clay'] })}

${h2('The short answer')}
${p(`Draw on a 24 grid with 2 px of padding, fit each shape to a keyline, use one stroke weight and one radius, snap to half pixels, name icons for what they show, and keep strokes live. If you want a head start, ${L.icons(`all ${N_ICONS} with icons`)} follow these rules and are free under MIT to study, use or extend. The ${L.page('free/icons-for-figma.html', 'free icons for Figma')} page is a good place to start.`)}
${cta('Icons drawn on the same 24 px grid', `${N_ICONS} icons in ${N_STYLES} styles, drawn on one grid with one set of keylines. MIT licensed, free to study, copy and extend.`, ['pencil-ruler', 'layout-grid', 'pen-tool', 'palette', 'sparkles', 'lightbulb'])}
`,
}
