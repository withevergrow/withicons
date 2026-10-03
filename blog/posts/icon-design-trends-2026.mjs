import { p, h2, h3, ul, figure, iconGrid, styleRow, sizeRamp, table, yes, no, callout, cta, doDont, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

export default {
  slug: 'icon-design-trends-2026',
  category: 'basics',
  date: '2026-10-02',
  hero: 'trends1',
  stickers: [['sparkles', 'glass'], ['heart', 'kawaii'], ['gamepad', 'pixel']],
  title: 'Icon design trends for 2026: what’s in, what’s out',
  cardTitle: 'Icon design trends for 2026',
  h1: 'Icon design trends for 2026: what’s <em>in</em>, what’s out',
  dek: 'Icons got a lot more personality this year: frosted glass, tactile 3D, pixel nostalgia, Bauhaus shapes and a wave of cuteness. Here is what we are seeing, what we would skip, and how to try each look without redesigning everything.',
  description: 'The icon design trends shaping 2026: frosted glass, tactile 3D and skeuomorphism, pixel and retro nostalgia, kawaii cuteness, Bauhaus geometry and more.',
  keywords: ['icon design trends 2026', 'icon trends', 'glass icons', 'skeuomorphic icons', 'pixel art icons', 'kawaii icons', 'bauhaus icons', 'duotone icons', 'hand-drawn icons'],
  about: ['Icon design', 'Design trends', 'with icons'],
  related: ['icon-styles-explained', 'consistent-icons', 'ai-assistants-and-icons'],
  tldr: [
    '<strong>In for 2026:</strong> frosted glass and gloss, tactile 3D (skeuomorphism is back), pixel and 70s retro nostalgia, cute kawaii, sticker and plush looks, and bold Bauhaus geometry.',
    '<strong>Still strong:</strong> soft duotone, hand-drawn sketch warmth, technical blueprint lines and engraved “heritage” detail.',
        '<strong>Out:</strong> mixing random icon sets, using one flat style for every job, tiny detailed icons at 16px, and icons that disappear on dark backgrounds.',
    '<strong>Behind the scenes:</strong> adjustable stroke weights, one icon drawn once in many styles, clean dark mode and AI help. Apple’s glassy Liquid Glass design (June 2025) pushed depth back into fashion.',
    'You do not need to chase every trend. Keep a calm style for buttons and menus, and use the expressive looks in hero sections, slides and illustrations.',
  ],
  faq: [
    { q: 'What icon style is trending in 2026?', a: 'There is no single winner. The clearest movements we see are frosted glass and glossy icons, tactile 3D and skeuomorphic objects, pixel and retro nostalgia, cute styles like kawaii and stickers, Bauhaus geometry, soft duotone and hand-drawn sketch. Simple outline icons remain the default for everyday interface buttons.' },
    { q: 'Are flat icons out of style?', a: 'No. Flat outline and filled icons are still the best choice for small buttons and menus because they stay sharp and readable at 16 to 24px. What has changed is that brands now pair them with richer styles for marketing pages, slides and illustrations.' },
    { q: 'Are 3D and glossy icons a good idea for websites?', a: 'They work well at larger sizes, such as feature sections, hero areas and slides, where their detail is visible. At very small sizes the shine turns into noise, so keep simple icons for navigation and buttons.' },
    { q: 'Is skeuomorphism coming back?', a: 'In a softer form, yes. After years of flat design, icons with real materials, light and shadow are showing up again in marketing, app icons and illustrations. Most interfaces still keep flat line or filled icons for small buttons, and save the tactile look for bigger moments.' },
    { q: 'How do I keep icons up to date without redesigning everything?', a: 'Use an icon family that offers several styles from the same drawings. Then you can change the mood of a page by switching style while every icon keeps its familiar shape.' },
  ],
  sources: [
    { title: 'Apple Newsroom: Apple introduces a delightful and elegant new software design (June 9, 2025)', url: 'https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/' },
    { title: 'TechCrunch: Google unveils its new Android design language, Material 3 Expressive (May 13, 2025)', url: 'https://techcrunch.com/2025/05/13/google-unveils-its-new-android-design-language-material-3-expressive/' },
    { title: 'Google Fonts: Material Symbols guide (variable axes)', url: 'https://developers.google.com/fonts/docs/material_symbols' },
    { title: 'Apple: SF Symbols', url: 'https://developer.apple.com/sf-symbols/' },
    { title: 'Nielsen Norman Group: Icon Usability (labels)', url: 'https://www.nngroup.com/articles/icon-usability/' },
    { title: 'Phosphor Icons on GitHub (six weights)', url: 'https://github.com/phosphor-icons/homepage#readme' },
  ],
  body: () => `
${p(`<span class="lede">In 2026, icons are getting more personality and more flexibility at the same time. The looks that stand out are frosted glass, tactile 3D, pixel and retro nostalgia, cute kawaii and sticker styles and bold Bauhaus shapes, alongside soft duotone, hand-drawn warmth, blueprint lines and engraved detail. Behind the scenes, icon sets now offer adjustable weights, several styles from one drawing, clean dark mode, and help from AI assistants.</span>`)}
${p(`What is going out is just as clear: random mixes of icon sets, one flat style for everything, and tiny detailed icons that turn to mush. Below we walk through each trend in plain English, show it with real icons from ${L.icons('with icons')}, and say where it works and where it does not.`)}
${callout('note', 'These are observations from what we see in apps, operating systems and design work this year, not survey numbers. Where we mention a specific company or product, the source is linked at the bottom.')}

${h2('What are the biggest icon design trends for 2026?')}
${table(['Trend', 'Best for', 'Good at small sizes?'], [
  ['Soft duotone', 'Dashboards, onboarding, friendly apps', yes('Yes')],
  ['Frosted glass and gloss', 'Hero sections, feature grids, slides', no('No, use 32px and up')],
  ['Tactile 3D and skeuomorphism', 'Premium brands, app icons, pricing pages', no('No, use 32px and up')],
  ['Hand-drawn sketch', 'Education, kids, creative brands', no('No, use 32px and up')],
  ['Blueprint and technical', 'Developer tools, engineering, AI products', no('No, use 32px and up')],
  ['Engraved and heritage', 'Finance, premium, food and drink', no('No, use 32px and up')],
  ['Pixel and retro nostalgia', 'Games, events, music, playful tech', yes('Pixel art, yes')],
  ['Cute: kawaii, stickers, plush', 'Kids, classrooms, wellness, social posts', no('No, use 32px and up')],
  ['Bauhaus geometry', 'Creative brands, posters, editorial', no('No, use 32px and up')],
  ['Adjustable stroke weight', 'Matching icons to your typeface', yes('Yes')],
  ['One drawing, many styles', 'Brands that need calm and bold looks', yes('Yes, in the simple styles')],
  ['Dark-mode-ready icons', 'Every product with a dark theme', yes('Yes')],
], 'The 2026 icon trends at a glance')}

${h2('Trend 1: Soft duotone icons')}
${p('Duotone means two tones: a crisp outline plus a soft, lighter fill behind it. It feels friendlier than a plain outline and calmer than a heavy filled icon. You see it in dashboards, onboarding screens and help centres, anywhere a product wants to feel approachable without looking childish.')}
${p('It is not a new idea. Font Awesome (in its paid Pro plan) and Phosphor both offer duotone versions, and Apple’s SF Symbols has a “hierarchical” mode that shows parts of a symbol in lighter shades. What is new is how often it now shows up as the default look for friendly products.')}
${iconGrid(['chart-bar', 'calendar', 'users', 'bell', 'wallet', 'shield-check'], 'duo', 'A friendly dashboard in the with icons duo style: outline on top, soft tint below.')}

${h2('Trend 2: Frosted glass and glossy shine')}
${p('Shine is back. In June 2025 Apple introduced Liquid Glass, a new look across its operating systems with see-through, reflective surfaces. Its app icons are now built from layers of this glass and come in light, dark, tinted and clear versions. When the biggest platforms add depth and highlights, the rest of the design world tends to follow.')}
${p(`Glass and gloss icons look great large: a row of features on a landing page, a title slide, an app store graphic. At button size the highlights blur into noise, so treat them as illustration, not interface. In with icons, the ${L.style('glass')} lets a vivid colour glow through a frosted pane with a crisp rim, and the ${L.style('gloss')} makes puffy, soft-vinyl shapes with carved highlights.`)}
${iconGrid(['rocket', 'sparkles', 'gift', 'trophy', 'zap', 'heart'], 'glass', 'The with icons glass style: frosted panes and a soft sheen, made for 32px and larger.')}
${iconGrid(['rocket', 'sparkles', 'gift', 'trophy', 'zap', 'heart'], 'gloss', 'The same six in gloss: puffy, shiny and playful.')}
${figure('trends3', 'Soft gradients and glossy spheres are everywhere this year, from wallpapers to app icons.')}

${h2('Trend 3: Tactile 3D and the return of skeuomorphism')}
${p('Skeuomorphism means making something on screen look like the real object: leather, brushed metal, paper, wood. It was everywhere on early smartphones, then flat design pushed it out. Now it is creeping back in a cleaner, more grown-up form. Icons have weight, soft shadows and lit edges again, especially in app icons, pricing pages and premium brands.')}
${p(`Two with icons styles lean into this. The ${L.style('skeuo')} turns each icon into a little object in a real material, lit from above. The ${L.style('luxe')} goes for jewellery-box 3D: enamel, polished gold and ruby in thick slabs.`)}
${styleRow('wallet', 'A wallet in skeuo and luxe: real materials versus jewel-like polish.', { styles: ['skeuo', 'luxe'] })}
${iconGrid(['crown', 'gem', 'key', 'landmark', 'trophy', 'credit-card'], 'luxe', 'Luxe icons for a premium plan, a VIP club or a high-end shop.')}

${h2('Trend 4: Hand-drawn sketch warmth')}
${p('As more of the internet looks polished, uniform and machine-made, a little wobble feels human. Hand-drawn icons, with slightly loose lines and a pencil-like texture, signal “a person made this”. They suit education, kids’ products, wellness, cafés and any brand that wants to feel warm rather than corporate.')}
${p('The trick is to keep the drawing simple, so the sketchy texture adds charm without hurting recognition.')}
${iconGrid(['lightbulb', 'book', 'coffee', 'smile', 'pencil', 'graduation-cap'], 'sketch', 'The with icons sketch style: same shapes as the line icons, with a hand-drawn feel.')}

${h2('Trend 5: Technical blueprint aesthetics')}
${p('The opposite mood is just as popular: icons that look like engineering drawings, with fine construction lines, guide marks and a cool, precise feel. Developer tools, cloud platforms, hardware brands and AI products like it because it says “we care how things are built”.')}
${figure('blue1', 'The blueprint look borrows from technical drawing: fine lines, guides and visible construction.')}
${iconGrid(['cpu', 'server', 'database', 'code', 'terminal', 'git-branch'], 'blueprint', 'The with icons blueprint style, a good fit for technical products and architecture diagrams.')}

${h2('Trend 6: Engraved and heritage looks')}
${p('Engraved icons use fine parallel lines for shading, like the illustrations on banknotes, old maps or a whisky label. They feel crafted, trustworthy and a bit premium. Banks, law firms, food and drink brands and anything with “established in” on the label are using this look for marketing and packaging.')}
${iconGrid(['landmark', 'banknote', 'crown', 'award', 'compass', 'key'], 'engrave', 'The with icons engrave style: line shading for a crafted, heritage feel.')}
${p(`A darker cousin of this trend borrows from cathedrals: carved stone and stained glass. Our ${L.style('gothic')} goes there, with ruby, sapphire, gold and emerald glass set in dark lead. It suits fantasy games, book covers and Halloween campaigns.`)}

${h2('Trend 7: Pixel art and 70s retro nostalgia')}
${p('Nostalgia keeps coming back, and this year it looks like chunky pixels and warm 70s colours. Pixel art recalls the video games many of us grew up with; 70s retro recalls vintage patches, sunset stripes and record sleeves. Both feel fun and a little cheeky, which is why games, music, events and playful tech brands like them.')}
${p(`The ${L.style('pixel')} is hand-tuned 16-bit pixel art, and unlike most expressive styles it stays crisp at 16, 32 and 48px. The ${L.style('retro')} adds chunky outlines, sunset-striped fills and a hard offset shadow, like a vintage patch.`)}
${figure('svg5', 'Up close, every screen is made of pixels. Pixel-art icons celebrate that instead of hiding it.')}
${styleRow('gamepad', 'A gamepad in pixel and retro.', { styles: ['pixel', 'retro'] })}
${iconGrid(['music-note', 'headphones', 'camera', 'tv', 'rocket', 'star'], 'retro', 'Retro icons: warm, chunky and full of character.')}

${h2('Trend 8: Cute everything: kawaii, stickers and plush')}
${p('Cuteness is having a big moment. Chubby shapes, tiny faces, candy colours and sticker borders are all over social media, stationery, kids’ apps, wellness products and classroom slides. Cute icons lower the stakes: a bill reminder with a blushing face feels less scary.')}
${p(`with icons has six styles in this family. The ${L.style('kawaii')} gives every icon chubby pastel shapes and a tiny blushing face, and the ${L.style('sticker')} turns them into die-cut vinyl stickers with a puffy white border. There is also ${L.style('plush')} (stuffed felt toys with stitches), ${L.style('pastel')} (soft colour fields), ${L.style('anime')} (cel-shaded ink and sparkle) and ${L.style('coquette')} (ballet pink, bows and pearls).`)}
${styleRow('cat', 'A cat in kawaii and sticker.', { styles: ['kawaii', 'sticker'] })}
${iconGrid(['heart', 'coffee', 'cake', 'flower', 'dog', 'gift'], 'kawaii', 'Kawaii icons: chubby, pastel and very hard to dislike.')}
${p('Cute works best when it matches your audience. It is perfect for a class newsletter or a habit tracker, and probably wrong for a law firm.')}

${h2('Trend 9: Bold Bauhaus geometry')}
${p('On the other side of the mood board are bold, flat shapes in primary colours. The Bauhaus was a German art school of the 1920s, famous for posters built from circles, half circles and rectangles in red, yellow, blue and black. That look keeps returning in posters, editorial design and creative brands because it is simple, confident and easy to recognise.')}
${p(`The ${L.style('bauhaus')} rebuilds each icon as a tiny composition of circles, arches, quarter discs and pills.`)}
${iconGrid(['home', 'sun', 'music-note', 'compass', 'lightbulb', 'palette'], 'bauhaus', 'Bauhaus icons: flat shapes, primary colours, lots of confidence.')}

${h2('Trend 10: Adjustable stroke weights')}
${p('Icons are starting to behave more like fonts. Google’s Material Symbols are variable fonts with adjustable fill, weight (from 100, thin, to 700, bold), grade and optical size. Apple’s SF Symbols come in nine weights and three scales, designed to sit next to Apple’s system fonts. The idea is simple: your icons should match the weight of your text.')}
${p(`with icons line icons use a 1.75px stroke by default, a middle ground that sits well next to most body text. In the developer components (launching on npm soon) you can change the stroke width for the line, duo, blueprint and sketch styles, and there is a setting to keep the line thickness the same when icons are scaled up or down.`)}
${sizeRamp(['home', 'search', 'bell', 'settings'], [16, 20, 24, 32, 48], 'line', 'Line icons from 16px to 48px. At small sizes simple shapes matter most; at large sizes weight and detail start to show.')}

${h2('Trend 11: One drawing, many styles')}
${p('Brands rarely live in one mood. The app needs calm, readable icons. The launch video needs something bolder. The sales deck needs something in between. A growing number of icon sets solve this by drawing each icon once and offering it in several styles. Phosphor, for example, ships six weights of each icon, from Thin to Bold plus Fill and Duotone.')}
${p(`with icons is built entirely around this idea: each of the ${N_ICONS} icons is drawn once on a 24 × 24 grid and rendered into ${N_STYLES} styles, from plain line to glass, pixel and kawaii. That is ${N_SVGS} SVGs, plus 20 to 30 hand-picked colour palettes per icon and optional motion. Because every style comes from the same drawing, you can switch moods and the icons still feel like one family. That is also the easiest way to avoid the patched-together look we describe in ${L.post('consistent-icons', 'why mixing icon sets looks cheap')}.`)}
${styleRow('lightbulb')}

${h2('Trend 12: Icons that are ready for dark mode')}
${p('Dark mode is no longer a nice extra. Plenty of people leave it on all the time, so icons have to look right on both light and dark backgrounds. The common failures: black icons that vanish on dark grey, coloured icons that glow too brightly, and pale tints that disappear.')}
${p('The fix is mostly technical but easy to ask for. Good icon files take their colour from the text around them (developers call this <code>currentColor</code>), so when the text turns white, the icons do too. All with icons styles work this way, and the duo tint can be recoloured separately for dark themes.')}
${figure('trends0', 'Bold colour on dark backgrounds is a 2026 favourite. Make sure your icons stay readable when the lights go down.')}

${h2('Trend 13: Picking icons with AI assistants')}
${p(`More people now ask ChatGPT, Claude or Gemini to “add icons to this page” or “suggest icons for my slides”. The catch: assistants often invent icon names that do not exist. Icon sets are responding with ways for AI tools to search the real list. with icons has an MCP server (a plug-in that lets AI assistants look up real icons), a public llms.txt file, and “Ask AI” buttons on the site. We cover how to get good results in ${L.post('ai-assistants-and-icons', 'how to get great icons from AI assistants')}.`)}
${iconGrid(['bot', 'sparkles', 'brain', 'wand', 'message-circle'], 'duo', 'AI-themed icons in duo: bot, sparkles, brain, wand and chat.')}

${h2('What is going out in 2026?')}
${p('Trends come and go, but some habits are clearly fading. These are the ones we would skip:')}
${ul([
  '<strong>Mixing random icon sets.</strong> A bit from here, a bit from there. It always shows, and it makes even a good design look cheap.',
  '<strong>One flat style for every job.</strong> The same thin outline on the menu, the hero, the slides and the packaging. Brands now pick a calm style for the interface and a richer one for storytelling.',
  '<strong>Detailed icons at tiny sizes.</strong> Shine, shading and sketch texture at 16px turn into smudges. Keep expressive styles at 32px or larger.',
  '<strong>Icons with no dark mode plan.</strong> Hard-coded black icons that disappear on dark backgrounds.',
  '<strong>Icon-only navigation.</strong> Pretty, minimal, and confusing. Usability research keeps showing that visible labels help.',
])}
${doDont('<p>Keep simple line or solid icons for buttons and menus, and bring in one expressive style (glass, skeuo, pixel, kawaii or Bauhaus, say) for hero sections, slides and illustrations.</p>', '<p>Use a trendy glossy icon at 16px inside a button, or put five different trendy styles on one page. Trends work best in one place, on purpose.</p>')}

${h2('How do you try a trend without redesigning everything?')}
${p('Start small and keep the interface calm:')}
${ul([
  `<strong>Pick one place.</strong> A features section, a title slide or an empty state. Try ${L.style('glass')}, ${L.style('skeuo')}, ${L.style('pixel')}, ${L.style('kawaii')} or ${L.style('bauhaus')} there.`,
  '<strong>Keep the shapes the same.</strong> Use a family where the trendy style and your everyday style come from the same drawings.',
  '<strong>Go big.</strong> Use expressive styles at 32px or more, ideally 48px and up.',
  '<strong>Check dark mode and phones.</strong> Look at the page in both themes and on a small screen before you ship.',
])}
${p(`Want the full tour of what each style is for? Read ${L.post('icon-styles-explained', 'icon styles explained')}.`)}

${h2('The bottom line')}
${p('The big story of 2026 is choice. Icons can now be calm or bold, glassy or pixelated, cute or classic, without losing their familiar shapes. The smart move is not to chase every look, but to keep a quiet, readable style for everyday interface and add one expressive style where you want people to feel something. Done that way, a trend becomes part of your brand instead of something you will want to undo next year.')}
${cta('Try every 2026 look with one set', `${N_ICONS} icons in ${N_STYLES} styles, from line and solid to glass, pixel, kawaii and Bauhaus. Same drawings, many moods. Free and MIT licensed.`, ['sparkles', 'palette', 'gamepad', 'rocket', 'crown', 'heart'])}
`,
}
