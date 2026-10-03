import { p, h2, h3, ul, figure, iconGrid, styleRow, sizeRamp, table, yes, no, meh, callout, steps, doDont, cta, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

const PLAYFUL = ['kawaii', 'sticker', 'pixel', 'retro', 'bauhaus']

export default {
  slug: 'playful-icon-styles',
  category: 'basics',
  date: '2026-10-03',
  hero: 'xplay0',
  stickers: [['cat', 'kawaii'], ['gamepad', 'pixel'], ['heart', 'sticker']],
  title: 'Cute and playful icon styles: kawaii, pixel, sticker, retro and more',
  cardTitle: 'Cute and playful icon styles',
  h1: 'Cute and <em>playful</em> icon styles, explained',
  dek: 'Kawaii, sticker, pixel, retro, plush, pastel, anime, coquette and bauhaus: what each playful style looks like, where it shines, and where it does not belong.',
  description: 'Kawaii, sticker, pixel, retro, pastel and more: what each cute icon style looks like, where it works (kids, games, social, slides) and where to avoid it.',
  keywords: ['playful icons', 'cute icons', 'kawaii icons', 'pixel art icons', 'sticker icons', 'retro icons', 'pastel icons', 'bauhaus icons', 'icons for kids apps', 'fun icons for presentations'],
  about: ['Icon design', 'Kawaii', 'Pixel art', 'Bauhaus'],
  related: ['icon-styles-explained', 'icons-in-presentations', 'consistent-icons'],
  tldr: [
    `<strong>Playful icon styles</strong> are icons drawn like tiny illustrations: soft shapes, bright or pastel colours, faces, stickers or pixels. with icons has nine of them among its ${N_STYLES} styles.`,
    '<strong>The nine:</strong> kawaii (cute faces), sticker (die-cut vinyl), pixel (16-bit game art), retro (70s patches), bauhaus (playful geometry), plush (felt toys), pastel (soft colour fields), anime (cel-shaded) and coquette (bows and pearls).',
    '<strong>Where they shine:</strong> kids’ apps, games, social posts, stickers, newsletters, event invites, classroom handouts and slides, at 32px or larger.',
    '<strong>Where to skip them:</strong> dense interfaces under 32px, and serious tools for money, health or legal matters, where calm line or solid icons build more trust.',
    '<strong>Keep one playful style per page</strong> and pair it with a matching font: rounded fonts for kawaii, a pixel font for headings with pixel icons, geometric fonts for bauhaus.',
  ],
  faq: [
    { q: 'What does kawaii mean?', a: 'Kawaii is Japanese for “cute” or “adorable”. Kawaii culture grew in the 1970s through manga, anime and cute merchandise, with Hello Kitty (created by Sanrio in 1974) as the best-known example. Kawaii icons use chubby shapes, pastel colours and tiny happy faces.' },
    { q: 'Where can I get cute icons for free?', a: `with icons has ${N_ICONS} icons in ${N_STYLES} styles, including kawaii, sticker, pixel, retro and bauhaus. Open any icon page, switch to the style you like, then copy it or download a PNG or SVG. Everything is MIT licensed: free for personal and commercial use, with no attribution required.` },
    { q: 'Can I use playful icons on a professional website?', a: 'Yes, in the right places. Use them for big, friendly moments like an empty state, an onboarding screen, a newsletter header or a feature section, and keep calm line or solid icons for menus and buttons. For finance, health or legal tools, keep playful icons out of the core screens.' },
    { q: 'What size should cute icons be?', a: 'Use most playful styles at 32px or larger. Their faces, outlines and shadows need room, and they turn to fuzz at 16 to 24px. Pixel is the exception: it is hand-tuned to stay crisp at 16, 32 and 48px.' },
    { q: 'Can I mix kawaii and pixel icons on the same page?', a: 'It is best not to. Each playful style has a strong personality, and two of them side by side compete for attention. Pick one playful style per page (or per campaign), and use plain line icons for everything functional.' },
    { q: 'What fonts go well with kawaii icons?', a: 'Rounded sans-serif fonts match kawaii’s soft shapes. Free options on Google Fonts include Nunito and Fredoka. Keep body text in a plain, readable font and save the cute font for headings.' },
    { q: 'Are pixel art icons good for games?', a: 'Yes. Pixel icons fit retro and indie games, game landing pages, Discord servers and gaming events. The with icons pixel style is hand-tuned 16-bit pixel art that stays crisp at 16, 32 and 48px on standard and high-resolution screens.' },
  ],
  sources: [
    { title: 'Wikipedia: Kawaii (meaning, 1970s origins, Hello Kitty in 1974)', url: 'https://en.wikipedia.org/wiki/Kawaii' },
    { title: 'Wikipedia: Bauhaus (founded by Walter Gropius in Weimar, 1919; closed 1933)', url: 'https://en.wikipedia.org/wiki/Bauhaus' },
    { title: 'W3C: Understanding WCAG 2.1 Success Criterion 1.4.11, Non-text Contrast', url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html' },
    { title: 'Google Fonts: Nunito', url: 'https://fonts.google.com/specimen/Nunito' },
    { title: 'Google Fonts: Press Start 2P', url: 'https://fonts.google.com/specimen/Press+Start+2P' },
    { title: 'Google Fonts: Jost', url: 'https://fonts.google.com/specimen/Jost' },
  ],
  body: () => `
${p(`<span class="lede">Playful icon styles are icons drawn like tiny illustrations, with soft shapes, bright or pastel colours, little faces, sticker borders or chunky pixels. The main ones are kawaii, sticker, pixel, retro, plush, pastel, anime, coquette and bauhaus. Use them at 32px or larger for kids’ apps, games, social posts, invites and slides, and keep them out of dense interfaces and serious finance or health tools.</span>`)}
${p(`This guide shows each playful style with real icons, explains where it works and where it does not, and gives you simple rules for fonts, colours and mixing. Every icon below comes from ${L.icons('with icons')}, where ${N_ICONS} icons are each drawn once and rendered in ${N_STYLES} styles (${N_SVGS} SVGs), so the kawaii cat and the pixel cat really are the same cat.`)}
${styleRow('cat', 'One cat in five playful styles: kawaii, sticker, pixel, retro and bauhaus.', { styles: PLAYFUL })}

${h2('What makes an icon style playful?')}
${p('A playful icon is less like a road sign and more like a doodle in a friend’s notebook. Most playful styles share a few ingredients:')}
${ul([
  '<strong>Round, chunky shapes</strong> instead of thin, precise lines.',
  '<strong>Colour</strong>, either bright candy tones or soft pastels, often several per icon.',
  '<strong>Character</strong>: a face, a sparkle, a sticker border, a stitch or a pixel grid.',
  '<strong>A nod to something familiar</strong>, like toys, video games, vintage patches or posters.',
])}
${p(`The everyday styles (${L.style('line', 'line')}, ${L.style('solid', 'solid')} and ${L.style('duo', 'duo')}) are built to disappear into an interface. Playful styles are built to be noticed. That is their power and their limit. For the full family tree of all ${N_STYLES} looks, see ${L.post('icon-styles-explained', 'icon styles explained')}.`)}

${h2('What are kawaii icons?')}
${p(`“Kawaii” is Japanese for cute or adorable. Kawaii culture grew in the 1970s through manga, anime and cute merchandise, with Hello Kitty, created by Sanrio in 1974, as its most famous face. The ${L.style('kawaii')} in with icons turns every icon into a chubby pastel shape with a soft, thick outline and a tiny blushing face.`)}
${iconGrid(['cat', 'coffee', 'cake', 'flower', 'rabbit', 'ice-cream'], 'kawaii', 'Kawaii icons: soft outlines, pastel fills and a tiny face on almost everything.')}
${p('<strong>Use it for:</strong> kids’ apps, wellness and journaling apps, stationery shops, bakeries, classroom slides and anything that should make people smile. <strong>Skip it for:</strong> anything where a smiling face would feel wrong, like an error message about a failed payment.')}

${h2('What are sticker icons?')}
${p(`The ${L.style('sticker')} makes every icon look like a die-cut vinyl sticker: candy colours, bold ink outlines, a puffy white border, a soft drop shadow, a glossy shine and a sparkle or two. It is the most “social” of the playful styles, because it looks right placed on top of photos and coloured backgrounds.`)}
${iconGrid(['heart', 'star', 'party-popper', 'camera', 'music-note', 'rocket'], 'sticker', 'Sticker icons: the white border keeps them readable on busy backgrounds.')}
${p('<strong>Use it for:</strong> social posts, stories, newsletters, event invites, merch mock-ups and printable sticker sheets. <strong>Skip it for:</strong> rows of small buttons, where every white border adds visual noise.')}

${h2('What are pixel art icons?')}
${p(`The ${L.style('pixel')} is hand-tuned 16-bit pixel art: crisp one-pixel outlines, a shaded sprite body and a highlight pixel, like an item from an old console game. Unlike the other playful styles, pixel is designed to work small. It is tuned to stay pixel-perfect at 16, 32 and 48px on standard and high-resolution screens.`)}
${iconGrid(['gamepad', 'trophy', 'coins', 'heart', 'star', 'gem'], 'pixel', 'Pixel icons: instantly “video game”, for players of every age.')}
${sizeRamp(['gamepad', 'heart', 'coins'], [16, 32, 48], 'pixel', 'Pixel at its three sweet-spot sizes. Stick to these sizes and the pixels stay perfectly sharp.')}
${p('<strong>Use it for:</strong> games, gaming communities, hackathons, tech meetups, coding clubs and nostalgic brands. <strong>Skip it for:</strong> calm, elegant brands, where pixels can feel like a joke that does not fit.')}

${h2('What are retro icons?')}
${p(`The ${L.style('retro')} brings warm 70s vibes: chunky outlines, sunset-striped fills and a hard offset shadow, like a vintage patch on a denim jacket. It feels cheerful and confident, with a dash of nostalgia.`)}
${iconGrid(['sun', 'music-note', 'coffee', 'camera', 'rocket', 'pizza'], 'retro', 'Retro icons: sunset stripes and a hard shadow, like a 70s patch.')}
${figure('xretro0', 'Retro and pixel styles borrow from arcades, neon signs and vintage graphics.')}
${p('<strong>Use it for:</strong> cafés, record shops, music festivals, summer campaigns, podcasts and posters. <strong>Skip it for:</strong> data-heavy screens, where the stripes compete with your charts.')}

${h2('Is Bauhaus a playful icon style?')}
${p(`In its own way, yes. The Bauhaus was a German art and design school, founded by the architect Walter Gropius in Weimar in 1919 and closed in 1933. It is remembered for bold geometric graphics in primary colours. The ${L.style('bauhaus')} builds each icon as a tiny composition of circles, arches, half and quarter discs and pills in red, yellow, blue and black.`)}
${iconGrid(['sun', 'music-note', 'lightbulb', 'compass', 'palette', 'flower'], 'bauhaus', 'Bauhaus icons: playful geometry for grown-ups.')}
${p('It is playful without being cute, which makes it a great fit for design studios, art schools, museums, architecture firms, posters and editorial layouts. If kawaii feels too sweet for your brand, bauhaus may be the playful style you are looking for.')}

${h2('What are plush, pastel, anime and coquette icons?')}
${p(`These four are the newest playful styles in the ${N_STYLES}-style family. We describe them in words here, and you can see them on each ${L.icons('icon page')}.`)}
${h3('Plush: felt toys')}
${p('Plush icons look like stuffed toys sewn from felt, with puffy panels, dark piping, running stitches, buttons and embroidered details. They are cosy and huggable: lovely for baby brands, toy shops, bedtime-story apps and gentle wellness products.')}
${h3('Pastel: the calmest cute style')}
${p('Pastel icons are soft colour fields in lavender, peach, mint, baby blue, butter and blush, with gentle depth. There are no faces and no loud outlines, so pastel is the easiest playful style to bring into a calm, grown-up design, like a planner, a self-care app or a wedding website.')}
${h3('Anime: cel-shaded energy')}
${p('Anime icons use crisp, tapered ink lines and flat cel colour with one hard shadow, bright shine and the odd sparkle, in sky blue, sakura pink and warm gold. They suit fan communities, streaming channels, comic shops and youthful brands.')}
${h3('Coquette: bows and pearls')}
${p('Coquette icons are ballet-pink romance: blush satin objects tied with ribbon-red bows, pearls, lace and delicate gold. Think beauty brands, boutiques, bridal showers, birthday invites and Valentine’s campaigns.')}

${h2('Where do playful icons work best?')}
${p('Here is a quick guide to matching a playful style with the job. All of these assume the icons are shown at 32px or larger.')}
${table(['Where', 'Good playful styles', 'Why it works'], [
  ['Kids’ apps and learning games', `${L.style('kawaii', 'Kawaii')}, ${L.style('sticker', 'sticker')}, plush`, 'Friendly faces and big, chunky shapes are easy to recognise and fun to tap'],
  ['Video games and gaming events', `${L.style('pixel', 'Pixel')}, ${L.style('retro', 'retro')}, anime`, 'Instantly signals “game” and plays well with arcade-style fonts'],
  ['Social posts and stories', `${L.style('sticker', 'Sticker')}, ${L.style('kawaii', 'kawaii')}, coquette`, 'The sticker border stays readable on photos and coloured backgrounds'],
  ['Printable stickers and merch', `${L.style('sticker', 'Sticker')}, ${L.style('retro', 'retro')}`, 'Already looks like a die-cut sticker or an embroidered patch'],
  ['Newsletters', `${L.style('retro', 'Retro')}, pastel, ${L.style('bauhaus', 'bauhaus')}`, 'Adds personality to section headers without hurting readability'],
  ['Event invites', 'Coquette, pastel, ' + L.style('sticker', 'sticker'), 'Sets the mood (party, wedding, birthday) before anyone reads a word'],
  ['Slides and classroom handouts', `${L.style('kawaii', 'Kawaii')}, ${L.style('bauhaus', 'bauhaus')}, ${L.style('retro', 'retro')}`, 'Big sizes and short attention spans reward bold, friendly pictures'],
], 'Playful icon styles by use')}
${p(`For decks in particular, our ${L.post('icons-in-presentations', 'guide to icons in presentations')} and the ${L.guide('google-slides', 'Google Slides guide')} show how to add icons step by step. Making a poster or invite? The ${L.guide('canva', 'Canva guide')} covers that.`)}
${figure('xplay2', 'Playful icons work for the same reason toys do: bright colours, simple shapes and a bit of character.')}

${h2('Where should you avoid playful icons?')}
${p('Playful styles are strong flavours. In the wrong place they make a product harder to use or harder to trust.')}
${ul([
  '<strong>Dense interfaces under 32px.</strong> Toolbars, menus, tables and settings pages need icons people can scan in a split second. Faces, borders and shadows turn to fuzz at 16 to 24px.',
  '<strong>Serious money, health and legal tools.</strong> When someone is checking a bank balance, a test result or a contract, a giggling icon can feel careless. Calm line or solid icons build trust.',
  '<strong>Warnings and errors.</strong> A cute alert icon softens a message that needs to be taken seriously.',
  '<strong>Anywhere colour carries meaning.</strong> Multi-colour styles can clash with status colours like red for errors and green for success.',
])}
${sizeRamp(['bell', 'settings', 'search'], [16, 24, 32, 48], 'kawaii', 'Kawaii at four sizes: charming at 32 and 48px, crowded at 16 and 24px.')}
${p(`There is an accessibility angle too. The web accessibility standard (WCAG 2.1, criterion 1.4.11) asks for at least 3:1 contrast between meaningful icons and their background. Pastel colours on a white page can fall below that. If an icon carries meaning, check its contrast and add a text label. Our ${L.post('accessible-icons', 'guide to accessible icons')} explains how, and the ${L.post('icon-sizes-guide', 'icon sizes guide')} covers which size to use where.`)}
${callout('tip', `Playful does not have to mean everywhere. A banking app can still use one kawaii piggy bank on its savings-goal screen, as long as the menus and buttons stay in ${L.style('line', 'line')}.`)}

${h2('Which fonts and colours go with playful icons?')}
${p('Icons and fonts should feel like they come from the same world. A simple rule: match the font’s shape to the icon’s shape, and use the playful font for headings only. Body text should always stay plain and easy to read.')}
${table(['Icon style', 'Font feel', 'Free examples (Google Fonts)'], [
  [L.style('kawaii', 'Kawaii'), 'Rounded, soft sans-serif', 'Nunito, Fredoka'],
  [L.style('sticker', 'Sticker'), 'Bold, chunky, rounded', 'Fredoka, Nunito (black weight)'],
  [L.style('pixel', 'Pixel'), 'A pixel font for short headings only', 'Press Start 2P'],
  [L.style('retro', 'Retro'), 'Soft, heavy serif or a warm display font', 'Fraunces'],
  [L.style('bauhaus', 'Bauhaus'), 'Geometric sans-serif', 'Jost'],
  ['Coquette and pastel', 'Elegant serif with gentle curves', 'Playfair Display'],
], 'Playful icon styles and matching fonts')}
${p(`For colour, let the icons lead. In with icons, each icon has 20 to 30 hand-picked palettes that recolour every multi-colour style. Pick a palette you like, then borrow one of its colours for your buttons or headings, so the whole page feels connected. Keep the background calm (white, cream or a very light tint) so the icons do the talking.`)}

${h2('Why keep one playful style per page?')}
${p('Each playful style has a big personality. One of them on a page feels charming. Two of them feel like a scrapbook. Three feel like a mistake.')}
${doDont(
  `<p>Choose one playful style for the fun moments (say, ${L.style('sticker', 'sticker')} for a newsletter’s section headers) and use plain ${L.style('line', 'line')} icons for links and buttons.</p>`,
  '<p>Put a kawaii heart, a pixel star and a retro rocket in the same row. Each one pulls the eye in a different direction.</p>',
)}
${p(`Because every with icons style is drawn from the same skeleton, switching your whole page from kawaii to sticker later is easy: the icons keep their shapes and meaning, only the look changes. Read more in ${L.post('consistent-icons', 'how to keep your icons consistent')}, or compare playful styles with shiny ones in ${L.post('3d-icons-vs-flat-icons', '3D icons vs flat icons')}.`)}
${styleRow('rocket', 'Same rocket, five personalities. Pick one per page.', { styles: PLAYFUL })}

${h2('How do you get playful icons for free?')}
${steps([
  ['Find your icon', `Open ${L.icons('the icon library')} and search in everyday words, like “cake”, “game” or “party”. Search understands aliases, so “bin” finds trash.`],
  ['Switch the style', `On the icon page, pick ${L.style('kawaii', 'kawaii')}, ${L.style('sticker', 'sticker')}, ${L.style('pixel', 'pixel')}, ${L.style('retro', 'retro')} or another playful style, then try a few colour palettes.`],
  ['Copy or download', 'Copy the image straight into your slides or design tool, or download a PNG (choose the size) or an SVG. It is MIT licensed, so it is free for commercial use with no credit needed.'],
])}
${callout('try', `Start with ${L.icon('cat')}, ${L.icon('party-popper')} or ${L.icon('gamepad')} and flip through every playful style. You will know your favourite within a few clicks.`)}

${cta('Find your playful style', `${N_ICONS} free icons in ${N_STYLES} styles, from kawaii to pixel. Copy, download a PNG or SVG, MIT licensed.`, ['cat', 'heart', 'gamepad', 'cake', 'star', 'party-popper'])}
`,
}
