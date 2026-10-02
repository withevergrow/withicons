import { p, h2, h3, ul, figure, iconGrid, styleRow, sizeRamp, table, yes, no, meh, callout, steps, stats, doDont, cta, icon, esc, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

// 3 everyday interface styles, the rest are creative styles
const N_CREATIVE = N_STYLES - 3

// A tab bar where one tab is "active": inactive tabs in line, the active one in solid.
const tabBar = (names, active, caption) => `<figure class="b-icons b-icons--line"><div class="b-icons__grid">${names.map(n =>
  `<span class="b-tile">${icon(n, n === active ? 'solid' : 'line', 36)}<span>${esc(n)}${n === active ? ' (active)' : ''}</span></span>`).join('')}</div><figcaption>${caption}</figcaption></figure>`

export default {
  slug: 'icon-styles-explained',
  category: 'basics',
  date: '2026-10-02',
  hero: 'styles4',
  stickers: [['star', 'gloss'], ['heart', 'kawaii'], ['rocket', 'retro']],
  title: 'Line, solid, duotone and more: icon styles explained with pictures',
  cardTitle: 'Icon styles explained',
  h1: 'Line, solid, duotone and more: icon styles <em>explained</em>',
  dek: `Outline or filled? Glassy, pixel or kawaii? Here is a friendly, picture-first tour of all ${N_STYLES} with icons styles: the 3 everyday ones for buttons and menus, and the ${N_CREATIVE} creative ones for big, fun moments.`,
  description: `A picture-first guide to icon styles: line, solid and duotone for interfaces, plus ${N_CREATIVE} creative styles from glass and pixel to kawaii. What each is for.`,
  keywords: ['icon styles', 'outline vs filled icons', 'line icons vs solid icons', 'duotone icons', 'icon style guide', 'types of icons', 'kawaii icons', 'pixel icons', 'glass icons'],
  about: ['Icon design', 'Icon styles', 'User interface design'],
  related: ['consistent-icons', 'icon-sizes-guide', 'icon-design-trends-2026'],
  tldr: [
    '<strong>Line (outline)</strong> icons are drawn with a thin stroke. They are calm and clear, and the best default for menus, buttons and forms.',
    '<strong>Solid (filled)</strong> icons are filled shapes. Use them for the selected tab or button, for very small sizes, and on busy backgrounds.',
    '<strong>Duotone</strong> icons add a soft second tone behind the outline. They feel friendly in dashboards, cards and onboarding screens.',
    `<strong>Creative styles</strong> are mini illustrations. with icons has ${N_CREATIVE} of them in four families: shiny and 3D (gloss, glass, luxe, skeuo), printed and hand-made (engrave, blueprint, sketch, gothic), retro and graphic (retro, bauhaus, pixel), and cute (kawaii, sticker, plush, pastel, anime, coquette). Use them at 32px or larger.`,
    'Pick one style per area of your page. The one common mix is line for normal states and solid for the active one.',
  ],
  faq: [
    { q: 'How many icon styles are there?', a: `There is no fixed number, because every icon set defines its own. Most sets offer 1 to 6 looks, usually outline, filled and sometimes duotone or several line weights. with icons has ${N_STYLES}: 3 everyday interface styles (line, solid, duo) and ${N_CREATIVE} creative styles such as gloss, glass, pixel, retro, kawaii and sketch, all rendered from the same ${N_ICONS} drawings, which makes ${N_SVGS} SVGs.` },
    { q: 'What is the difference between outline and filled icons?', a: 'Outline (line) icons are drawn with a stroke and have empty insides, so they look light and airy. Filled (solid) icons are coloured-in shapes, so they look heavier and are easier to spot. Many apps use outline for normal buttons and filled for the one that is selected.' },
    { q: 'Are line icons or solid icons better?', a: 'Neither is better in general. Line icons are a calm default for interfaces. Solid icons are easier to read at very small sizes and on busy photos, and they make a great “active” state. Most products use both, in a planned way.' },
    { q: 'What is a duotone icon?', a: 'A duotone (or two-tone) icon uses two colours or two shades of one colour. In with icons, the duo style is the normal outline drawn over a soft tinted fill, and you can change the tint colour.' },
    { q: 'Can I mix different icon styles on one page?', a: 'Yes, as long as each style has its own job. Keep one style per area (for example line in the menu, glass in the hero section). Mixing styles inside one row or menu usually looks messy.' },
    { q: 'Which icon style is best for presentations?', a: 'For slides, bolder styles work well because icons are seen from far away. Solid and duo are safe choices for business decks. Creative styles like gloss, glass, engrave, blueprint or sketch add personality to title slides and feature slides; cute styles like kawaii or sticker suit classrooms and playful brands.' },
  ],
  sources: [
    { title: `with icons styles: all ${N_STYLES}`, url: 'https://withicons.com/styles/line.html' },
    { title: 'Heroicons README (outline and solid sets)', url: 'https://github.com/tailwindlabs/heroicons' },
    { title: 'Phosphor Icons README (six weights)', url: 'https://github.com/phosphor-icons/homepage' },
    { title: 'Google Fonts: Material Symbols guide (fill, weight, grade, optical size)', url: 'https://developers.google.com/fonts/docs/material_symbols' },
    { title: 'Font Awesome plans (which styles are free)', url: 'https://fontawesome.com/plans' },
  ],
  body: () => `
${p(`<span class="lede">An icon style is simply the way an icon is drawn. The same idea, say a house, can be a thin outline, a filled shape, a frosted piece of glass, a little pixel sprite or a chubby cartoon with a blushing face. Choosing the right style is one of the easiest ways to make a website, app or slide deck look calm, friendly or bold.</span>`)}
${p('Here is the short answer. Use <strong>line</strong> (outline) icons as your everyday default. Use <strong>solid</strong> (filled) icons for the selected item and for tiny sizes. Use <strong>duotone</strong> when you want a softer, friendlier feel. Save <strong>creative styles</strong> like gloss, pixel or kawaii for big, decorative moments. The rest of this guide shows each style with real pictures, so you can see the difference for yourself.')}
${styleRow('home')}

${h2('What is an icon style?')}
${p('Think of an icon style like a font for pictures. A font changes how letters look without changing what they say. An icon style changes how an icon looks without changing what it means: a bell is still a bell, whether it is drawn with a pencil line or filled in.')}
${p(`Styles matter because people notice them, even when they cannot name them. When every icon in a design shares one style, the whole thing feels planned. Every picture in this guide comes from ${L.icons('with icons')}, where each of the ${N_ICONS} icons is drawn once and rendered in ${N_STYLES} styles.`)}
${stats([[N_STYLES, 'styles in with icons'], ['3', 'everyday styles: line, solid, duo'], [N_CREATIVE, 'creative styles for big moments'], ['1', 'style per area of your page']])}

${h2('Line icons: the calm default')}
${p(`Line icons (also called <strong>outline</strong> or <strong>stroke</strong> icons) are drawn with a single line of even thickness, like a drawing made with a fine pen. The inside of each shape is left empty. In with icons, the ${L.style('line')} uses a 1.75px line with rounded ends and corners, drawn on a 24 by 24 grid.`)}
${iconGrid(['home', 'search', 'bell', 'mail', 'calendar', 'settings', 'user', 'heart'], 'line', 'Line icons are light and open, so they sit quietly next to text.')}
${p('Line icons are the most common style in modern apps and websites because they stay out of the way. They pair nicely with text, they look tidy in long menus, and they rarely clash with your colours or photos.')}
${ul([
  '<strong>Great for:</strong> navigation menus, toolbars, buttons, forms, settings pages, tables.',
  '<strong>Watch out for:</strong> very small sizes (16px and below), where thin lines can start to look faint, and busy photo backgrounds, where they can get lost.',
])}

${h2('Solid icons: bold and easy to spot')}
${p(`Solid icons (also called <strong>filled</strong> or <strong>glyph</strong> icons) are coloured-in shapes. Details like a door or a check mark are cut out of the shape, so you see them as gaps. The ${L.style('solid')} in with icons is the filled partner of line: same drawing, more weight.`)}
${iconGrid(['home', 'search', 'bell', 'mail', 'calendar', 'settings', 'user', 'heart'], 'solid', 'The same eight icons, filled. They read faster at a glance and hold up better when small.')}
${p('Because a filled shape has more “ink”, solid icons are easier to recognise at small sizes and stand out on top of photos or coloured backgrounds. They can also feel heavy if you use lots of them in a row, so most designers use them on purpose rather than everywhere.')}
${ul([
  '<strong>Great for:</strong> the selected tab or button, tiny icons in dense screens, icons on photos, mobile tab bars, status badges.',
  '<strong>Watch out for:</strong> long lists of solid icons, which can feel loud and crowded.',
])}

${h2('How do line and solid icons work together?')}
${p('This is the most useful pattern in icon design, and you see it in many phone apps. Every tab uses the line version, except the one you are on, which switches to the solid version. Your eye finds the filled one instantly, without needing a different colour.')}
${tabBar(['home', 'search', 'bell', 'user'], 'home', 'A bottom tab bar: three tabs in line, the active tab in solid. Same drawing, so the switch feels smooth rather than jumpy.')}
${p('For this to look right, the line and solid versions must be the same drawing, with the same size and shape. If they come from different icon sets, the icon seems to “jump” when you tap it. In with icons, solid is rendered from the very same skeleton as line, so the two always line up.')}
${callout('tip', 'Use the switch from line to solid for anything that can be turned on and off: a favourite heart, a saved bookmark, a liked thumbs-up, a selected tab. Pair it with a colour change if you like, but do not rely on colour alone.')}

${h2('Duotone icons: friendly with a soft tint')}
${p(`Duotone (or two-tone) icons use two shades: a main colour and a lighter one. Our ${L.style('duo')} keeps the clear outline from line and adds a soft tint inside the main shape. Developers can change that tint with one setting (a CSS variable called <code>--with-duo</code>), so it can match your brand colour.`)}
${iconGrid(['chart-pie', 'wallet', 'calendar-check', 'users', 'shield-check', 'trophy'], 'duo', 'Duo icons: an outline plus a soft fill. They feel warmer than line, without the weight of solid.')}
${ul([
  '<strong>Great for:</strong> dashboards, feature cards, onboarding screens, help centres, friendly products for non-experts.',
  '<strong>Watch out for:</strong> mixing duo and line in the same menu. Pick one for each area.',
])}

${h2('What are creative icon styles?')}
${p(`Most icon sets stop at line and solid, sometimes with a duotone option. with icons adds ${N_CREATIVE} <strong>creative styles</strong>. They are less like buttons and more like small illustrations, made for places where the icon is the star: hero sections, feature grids, slides, posters, social posts and classroom handouts.`)}
${p(`That is a lot to keep in your head, so we sort them into four families by how they feel. Each icon also comes with 20 to 30 hand-picked colour palettes that recolour every multi-colour style, and optional motion, so the same rocket can be warm, cool or on-brand without any drawing skills.`)}

${h2('Which icon styles look shiny and 3D?')}
${p('These four give icons depth, light and a sense of material. They feel premium and are lovely in app-store style graphics and landing pages.')}
${styleRow('gift', 'The same gift icon in the four shiny styles: gloss, glass, luxe and skeuo.', { styles: ['gloss', 'glass', 'luxe', 'skeuo'] })}
${ul([
  `<strong>${L.style('gloss', 'Gloss')}:</strong> puffy and glossy, like a soft vinyl toy, with carved highlights. It uses one flat colour, so it is easy to recolour.`,
  `<strong>${L.style('glass', 'Glass')}:</strong> layered frosted glass. A bright colour glows through a see-through pane with a crisp rim and a soft sheen.`,
  `<strong>${L.style('luxe', 'Luxe')}:</strong> jewellery-box 3D. Enamel, polished gold and ruby set in thick slabs, with soft shadows and crisp highlights.`,
  `<strong>${L.style('skeuo', 'Skeuo')}:</strong> short for skeuomorphic, meaning “looks like the real thing”. Each icon becomes an object made of paper, leather, metal, brass, wood or glass, lit from above.`,
])}
${iconGrid(['rocket', 'heart', 'star', 'sparkles', 'zap', 'trophy'], 'glass', 'Glass icons feel light and modern, a good match for the frosted look that operating systems use today.')}
${p('<strong>Best for:</strong> feature grids, landing pages and title slides. Gloss and glass feel fresh; luxe and skeuo feel expensive.')}

${h2('Which icon styles look printed or hand-made?')}
${p('These four borrow from old crafts: printing, drafting, drawing and stonework. They make a page feel thoughtful and a little classic.')}
${styleRow('compass', 'A compass in engrave, blueprint and sketch.', { styles: ['engrave', 'blueprint', 'sketch'] })}
${h3('Engrave: like a banknote')}
${p(`The ${L.style('engrave')} borrows from banknotes and printed etchings: a crisp outline that swells on its shadow side, plus fine hatching lines that show light and shade. It suits finance, legal, certificates and anything that should feel trustworthy.`)}
${iconGrid(['landmark', 'shield-check', 'award', 'crown', 'coins', 'key'], 'engrave', 'Engrave icons feel trustworthy and a bit classic.')}
${h3('Blueprint: shows its working')}
${p(`The ${L.style('blueprint')} looks like a technical drawing on a drafting table, with centre lines, construction marks, a dimension line and small dots at the control points. It fits engineering, developer tools and “how it works” pages.`)}
${figure('blue2', 'Real blueprints mix precise lines with notes and measurements. The blueprint style borrows that “how it is made” feeling.')}
${h3('Sketch: hand-drawn and human')}
${p(`The ${L.style('sketch')} looks like marker ink over pencil: loose strokes that cross at the corners, a little overshoot, and light shading on one side. Great for education, workshops, wikis and early-stage ideas.`)}
${iconGrid(['lightbulb', 'book-open', 'graduation-cap', 'pencil', 'puzzle-piece', 'smile'], 'sketch', 'Sketch icons make a page feel like a person made it.')}
${h3('Gothic: cathedral craft')}
${p(`The ${L.style('gothic')} is the dramatic one in this family: carved limestone and stained glass in ruby, sapphire, gold and emerald, set in dark lead, with pointed arches and rose windows. Think fantasy games, book covers and Halloween campaigns.`)}

${h2('Which icon styles feel retro or graphic?')}
${p('These three bring back looks from design history: 1970s patches, Bauhaus posters and early video games.')}
${styleRow('rocket', 'A rocket in retro, bauhaus and pixel.', { styles: ['retro', 'bauhaus', 'pixel'] })}
${ul([
  `<strong>${L.style('retro', 'Retro')}:</strong> warm 70s vibes, with chunky outlines, sunset-striped fills and a hard offset shadow, like a vintage patch.`,
  `<strong>${L.style('bauhaus', 'Bauhaus')}:</strong> tiny compositions of circles, arches, half discs and pills in red, yellow, blue and black, inspired by the famous German art school.`,
  `<strong>${L.style('pixel', 'Pixel')}:</strong> hand-tuned 16-bit pixel art with crisp one-pixel outlines, a shaded body and a highlight pixel, like a sprite from an old console game.`,
])}
${iconGrid(['gamepad', 'trophy', 'heart', 'star', 'coins', 'music-note'], 'pixel', 'Pixel icons are perfect for games, tech events and anything with a nostalgic wink.')}
${p('<strong>Best for:</strong> event posters, music, gaming and playful brands.')}

${h2('Which icon styles are cute and playful?')}
${p('The biggest family. These six are soft, colourful and happy, made for kids’ products, classrooms, wellness apps and social posts.')}
${styleRow('cat', 'A cat in the two cute styles this page can show: kawaii and sticker.', { styles: ['kawaii', 'sticker'] })}
${ul([
  `<strong>${L.style('kawaii', 'Kawaii')}:</strong> chubby pastel shapes with a soft thick outline and a tiny blushing face. “Kawaii” is Japanese for cute.`,
  `<strong>${L.style('sticker', 'Sticker')}:</strong> die-cut vinyl stickers in candy colours, with bold ink outlines, a puffy white border, a soft drop shadow and a sparkle or two.`,
  `<strong>${L.style('plush', 'Plush')}:</strong> stuffed toys sewn from felt, with puffy panels, running stitches, buttons and embroidered details.`,
  `<strong>${L.style('pastel', 'Pastel')}:</strong> soft colour fields in lavender, peach, mint, baby blue, butter and blush, with gentle depth. The calmest of the cute styles.`,
  `<strong>${L.style('anime', 'Anime')}:</strong> crisp tapered ink lines and flat cel colour with one hard shadow, bright shine and the odd sparkle, in sky blue, sakura pink and warm gold.`,
  `<strong>${L.style('coquette', 'Coquette')}:</strong> ballet-pink romance: blush satin objects tied with red bows, pearls, lace and delicate gold.`,
])}
${iconGrid(['heart', 'coffee', 'cake', 'flower', 'dog', 'gift'], 'kawaii', 'Kawaii icons: impossible not to smile at.')}

${h2('Why should creative styles be used at 32px or larger?')}
${p('Creative styles have extra details: highlights, hatching, construction lines, stitches, little faces. At large sizes those details are the whole point. At tiny sizes they get squeezed into a few pixels and turn into fuzz. Here is the blueprint style at five sizes:')}
${sizeRamp(['rocket', 'bell', 'shield-check'], [16, 20, 24, 32, 48], 'blueprint', 'At 16 and 20px the construction lines crowd the drawing. From 32px up, they become charming.')}
${p(`So the rule is simple: use creative styles at <strong>32px or larger</strong>, and keep line, solid or duo for small buttons and controls. The one exception is pixel, which is tuned to stay crisp at 16, 32 and 48px. Our ${L.post('icon-sizes-guide', 'guide to icon sizes')} goes into more detail.`)}

${h2('Which icon style should you use?')}
${p('Here is a cheat sheet. “Small” means everyday interface sizes like 16 to 24px. “Big” means 32px and up: feature sections, hero banners, slides and posters.')}
${table(['Style or family', 'Feels', 'Best for', 'Small sizes', 'Big sizes'], [
  [L.style('line', 'Line'), 'Calm, modern', 'Menus, buttons, forms, most apps', yes('Yes'), yes('Yes')],
  [L.style('solid', 'Solid'), 'Bold, clear', 'Active states, tiny icons, photos', yes('Yes, the best'), yes('Yes')],
  [L.style('duo', 'Duo'), 'Friendly, warm', 'Dashboards, cards, onboarding', meh('Yes, tint is subtle'), yes('Yes')],
  ['Shiny and 3D: gloss, glass, luxe, skeuo', 'Premium, fresh', 'Landing pages, feature grids, title slides', no('Use 32px+'), yes('Yes')],
  ['Printed and hand-made: engrave, blueprint, sketch, gothic', 'Classic, clever, human', 'Finance, dev tools, education, storytelling', no('Use 32px+'), yes('Yes')],
  ['Retro and graphic: retro, bauhaus, pixel', 'Bold, nostalgic', 'Events, games, music, creative brands', meh('Pixel only'), yes('Yes')],
  ['Cute: kawaii, sticker, plush, pastel, anime, coquette', 'Happy, soft', 'Kids, classrooms, wellness, social posts', no('Use 32px+'), yes('Yes')],
], `All ${N_STYLES} with icons styles at a glance`)}

${h2('Can you mix icon styles on one page?')}
${p('Yes, with one simple rule: <strong>one style per area</strong>. An area is a part of the page with one job, like the top menu, a sidebar, a feature section or a footer. Inside each area, keep every icon in the same style, at the same size and the same line thickness.')}
${p('That means a landing page can use line icons in the navigation, glass icons in the big feature section, and line icons again in the footer. What looks messy is mixing styles inside one row, like a menu where two icons are outlined, one is pixel art and one is a sticker.')}
${doDont('<p>Use line icons in the menu and one creative style, say glass or kawaii, in the hero section. Each area has its own clear style, and both come from the same family.</p>', '<p>Put a line bell, a solid mail and a sketch calendar next to each other in one toolbar. It looks like three different people made it.</p>')}
${p(`The only common mix inside one area is the line plus solid pattern for normal and active states, which we covered above. For more on keeping things tidy, read ${L.post('consistent-icons', 'how to keep your icons consistent')}.`)}
${figure('styles1', 'Like paint colours, icon styles work best when you choose a small palette and stick to it.')}

${h2('Do other icon sets offer these styles?')}
${p('Most popular icon sets offer some of the everyday styles:')}
${ul([
  `<strong>Heroicons</strong> has outline and solid icons at 24px, plus solid sets drawn for 20px and 16px.`,
  `<strong>Phosphor</strong> offers six weights: Thin, Light, Regular, Bold, Fill and Duotone.`,
  `<strong>Material Symbols</strong> from Google comes in Outlined, Rounded and Sharp, with adjustable fill and weight.`,
  `<strong>Font Awesome</strong> includes Solid, Regular and Brands for free, and keeps styles like Light, Thin and Duotone for paid plans.`,
])}
${p(`These are all good sets with more icons than ours. What makes ${L.icons('with icons')} different is the ${N_CREATIVE} creative styles, all generated from the same drawing as line, solid and duo, so a pixel rocket and a line rocket are truly the same rocket. That is ${N_SVGS} SVGs from ${N_ICONS} drawings. If you are comparing options, our ${L.post('best-free-icon-libraries', 'round-up of the best free icon libraries')} lays them side by side, and ${L.post('icon-design-trends-2026', 'icon design trends for 2026')} shows where the creative looks are heading.`)}

${h2('How do you choose a style in three steps?')}
${steps([
  ['Start with line', 'Use line icons for every menu, button and form. It is the safe default that works almost everywhere.'],
  ['Add solid for “on”', 'Switch the selected tab, the liked heart or the saved bookmark to solid. Use solid for icons smaller than 20px, too.'],
  ['Pick one “wow” style for big moments', 'Choose duo for a friendly product, or one creative style for hero sections, feature grids and slides: shiny for premium, printed for classic, retro for bold, cute for playful. Use it at 32px or larger.'],
])}
${callout('try', `Open any icon in ${L.icons('the library')} and flip through all ${N_STYLES} styles. Seeing your own icons in each style is the fastest way to decide.`)}

${cta(`See every icon in ${N_STYLES} styles`, 'Pick an icon, switch styles with one click, then copy it or download a PNG or SVG. Free and MIT licensed.', ['home', 'heart', 'rocket', 'star', 'bell', 'sparkles'])}
`,
}
