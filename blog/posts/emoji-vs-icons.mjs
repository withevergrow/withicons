import { p, h2, ul, iconGrid, styleRow, table, yes, no, meh, callout, doDont, cta, art, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'emoji-vs-icons',
  category: 'basics',
  date: '2026-11-06',
  hero: 'h-emoji-vs-icons',
  stickers: [['smile', 'kawaii'], ['party-popper', 'sticker'], ['thumbs-up', 'soft3d']],
  title: 'Emoji vs icons: which to use, and can you use emoji commercially?',
  cardTitle: 'Emoji vs icons',
  h1: 'Emoji vs icons: which should you use, and <em>can you use emoji commercially</em>?',
  dek: 'Emoji are great for tone in a chat. Icons are better wherever the look has to match. Here is the practical difference, what screen readers do with each, and which emoji sets you may really use in a logo, a product or an ad.',
  description: 'Emoji vs icons in documents, slides, apps and LinkedIn posts, plus which emoji sets you can use commercially: Apple, Google Noto, Microsoft Fluent, Twemoji.',
  keywords: ['emoji vs icons', 'can i use apple emoji commercially', 'emoji commercial use', 'emoji in professional documents', 'emoji bullet points linkedin', 'are emojis copyrighted', 'free emoji for commercial use'],
  about: ['Emoji', 'Icon (computing)', 'Screen reader', 'Copyright', 'Software license'],
  related: ['accessible-icons', 'free-icons-commercial-use', 'icons-in-presentations'],
  tldr: [
    '<strong>Use emoji for tone</strong> in chat, comments and social captions: one or two, at the end of a sentence.',
    '<strong>Use icons</strong> in documents, slides, apps, print and anywhere the look must match. They look the same on every device and take your colours.',
    '<strong>Emoji change with the device:</strong> the same character is drawn by Apple, Google, Microsoft or Samsung, and screen readers read each one’s name aloud.',
    '<strong>Typing emoji is fine. Using the artwork is another matter:</strong> Apple and Samsung publish no licence for their emoji designs, so keep them off logos, merch and ads.',
    '<strong>Open emoji sets you can use commercially:</strong> Microsoft Fluent Emoji (MIT), Google Noto Emoji (Apache 2.0 images), Twemoji (CC BY 4.0, credit) and OpenMoji (CC BY-SA 4.0, credit and share-alike).',
  ],
  faq: [
    { q: 'Is it unprofessional to use emoji in documents?', a: 'In reports, proposals, resumes and printed material, yes, usually. They change look from device to device, cannot match your brand colours, and are read aloud by screen readers. Use icons there. In chat, internal posts and social captions, an emoji or two at the end of a sentence is fine.' },
    { q: 'Can I use Apple emoji commercially?', a: 'You can type them in posts and messages. Using Apple’s emoji artwork as a graphic in a logo, on merchandise or in an ad is different: Apple publishes no licence for that, and Emojipedia says licensing details for Apple emoji are not publicly available. Use an openly licensed set instead.' },
    { q: 'Which emoji are free for commercial use?', a: 'Microsoft Fluent Emoji is MIT licensed. Google’s Noto Emoji images are Apache 2.0 and its fonts are under the SIL Open Font License. Twemoji graphics are CC BY 4.0, which needs a credit. OpenMoji is CC BY-SA 4.0, which needs a credit and asks you to share changes under the same licence.' },
    { q: 'Should I use emoji as bullet points on LinkedIn?', a: 'Better not. A screen reader reads every emoji’s name before the line, so a list of rockets and check marks gets noisy fast, and Microsoft’s style guide advises against emoji at the start of lines as fake bullets. Use plain line breaks or a few words of heading instead.' },
    { q: 'Are emoji copyrighted?', a: 'The emoji characters themselves are a shared standard, so anyone can type them. Each company’s drawings of them are artwork owned by that company. The Unicode Consortium says it does not own the colour images and sends licence requests to the vendors.' },
  ],
  sources: [
    { title: 'Unicode Emoji FAQ (images, vendors, rights), checked November 2026', url: 'https://www.unicode.org/faq/emoji_dingbats.html' },
    { title: 'Microsoft Style Guide: emoji, emoticons (updated October 2026)', url: 'https://learn.microsoft.com/en-us/style-guide/a-z-word-list-term-collections/e/emoticons-emoji' },
    { title: 'Apple Software License Agreement for macOS Tahoe 26, section E. Fonts', url: 'https://www.apple.com/legal/sla/docs/macOSTahoe.pdf' },
    { title: 'Emojipedia: Licensing', url: 'https://emojipedia.org/licensing' },
    { title: 'Google Noto Emoji (GitHub, licence section)', url: 'https://github.com/googlefonts/noto-emoji' },
    { title: 'Microsoft Fluent Emoji (GitHub, MIT licence)', url: 'https://github.com/microsoft/fluentui-emoji' },
    { title: 'Twemoji, maintained fork (GitHub, CC BY 4.0 graphics)', url: 'https://github.com/jdecked/twemoji' },
    { title: 'OpenMoji FAQ (CC BY-SA 4.0)', url: 'https://openmoji.org/faq/' },
  ],
  body: () => `
${p(`<span class="lede">Use <strong>emoji</strong> for tone in chat, comments and social captions, one or two at the end of a sentence. Use <strong>icons</strong> in documents, slides, apps, print and anywhere the look has to match: an icon looks the same on every device, takes your brand colours and can be labelled or hidden for screen readers. And if you want emoji artwork in a logo, a product or an ad, skip Apple’s and pick an openly licensed set like Microsoft Fluent Emoji (MIT) or Google Noto Emoji (Apache 2.0).</span>`)}
${p('Most answers to this question are about etiquette. This one is about what actually happens to emoji and icons on other people’s screens, in screen readers and in print, and about the licences, which have changed a lot since the old "who owns emoji" articles were written.')}

${h2('What is the difference between an emoji and an icon?')}
${p('An <strong>emoji</strong> is a character, like a letter. When you type 🚀 you send a code, and the reader’s phone or computer draws it with its own emoji font. An <strong>icon</strong> is a picture file you pick, such as a PNG or an SVG (a picture made of shapes, so it stays sharp at any size). You decide exactly how it looks, and it arrives looking that way.')}
${table(['', 'Emoji', 'Icons'], [
  ['What you send', 'A character code', 'A picture file'],
  ['Looks the same everywhere', no('Drawn by each device'), yes('Exactly as you chose')],
  ['Match your brand colours', no('Fixed colours'), yes('Any colour')],
  ['Screen readers', meh('Read the emoji’s name aloud'), yes('You choose: label it or hide it')],
  ['Sharp in print', meh('Depends on the software'), yes('As SVG or PDF, at any size')],
  ['Free to type or use', yes('Typing, always'), yes('With an open licence like MIT')],
  ['Fast to add in a chat', yes('From the keyboard'), meh('Copy and paste')],
], 'Emoji and icons side by side (checked November 2026).')}

${h2('Why do emoji look different on every phone and computer?')}
${p('Because nobody ships one official drawing. The Unicode Consortium, which assigns the emoji codes, says plainly that it is not a designer of emoji images and has no say over how companies draw them. Apple, Google, Microsoft and Samsung each draw their own. So the smile you picked on an iPhone arrives on a Windows laptop as Microsoft’s smile, and on an Android phone as Google’s.')}
${p('Usually the meaning survives. Sometimes it shifts: a face that looks cheeky on one device can look awkward on another, and a newly added emoji can show as an empty box on an older system. Microsoft’s style guide advises using emoji that work across devices for exactly this reason.')}
${art('m-emoji-vs-icons-three-devices', 'One message, three devices: the emoji is redrawn each time, the icon stays the same.', { brief: 'Three simple, generic device frames (phone, laptop, tablet; no brand logos or vendor emoji artwork). Each shows the same chat bubble "Launch day!" followed by a smiley face, drawn by the designer in three clearly different generic styles (round yellow, flat outline, glossy) to show the variation. Below each bubble, the same with icons rocket icon in duo style, identical on all three. Labels: "Emoji: redrawn by each device" and "Icon: the same everywhere".' })}

${h2('Do screen readers read emoji out loud?')}
${p('Yes. Each emoji has a short official name, and screen readers that support emoji read that name aloud. So "🚀 New feature" is heard as "rocket, New feature". One emoji is fine. A post where every line starts with an emoji becomes a string of "check mark button… backhand index pointing right… sparkles" between every sentence.')}
${p('Icons give you the choice. A decorative icon next to a word can be hidden from screen readers completely, and an icon that stands alone (like a bin button) gets a label you write, such as "Delete file". Our guide to ' + L.post('accessible-icons', 'accessible icons') + ' shows how in each app.')}
${art('m-emoji-vs-icons-screen-reader', 'What a screen reader says: emoji bullets read their names, decorative icons stay quiet.', { brief: 'Two side-by-side cards. Left: a short three-line list that uses emoji-style bullets (drawn as generic placeholder circles, not vendor emoji) with a speech bubble underneath reading "rocket, Faster setup. check mark, Free forever. sparkles, New styles." Right: the same list with with icons line icons (rocket, check-circle, sparkles) as bullets, and a speech bubble reading "Faster setup. Free forever. New styles." Labels: "Emoji bullets" and "Icon bullets (decorative)".' })}

${h2('Should I use emoji or icons in documents and slides?')}
${p('Icons, almost always. A report or a deck is opened on other people’s machines and often turned into a PDF or printed. Emoji in it will look like whichever device made the PDF, they cannot take your brand colours, and they tend to look casual next to a chart. Icons stay put.')}
${table(['Where', 'Emoji', 'Icons', 'Why'], [
  ['Team chat, comments', yes(), meh(), 'Tone matters more than looks'],
  ['Social captions (LinkedIn, Instagram)', yes('One or two'), meh('In the image'), 'Text fields only take characters'],
  ['Email body', meh('Sparingly'), yes(), 'Emoji look different in each mail app'],
  ['Slides and decks', no(), yes(), 'Consistent look, brand colours, sharp on a projector'],
  ['Reports, proposals, resumes', no(), yes(), 'Printed or PDF, read by strangers'],
  ['Website and app buttons', no(), yes(), 'Needs labels, states and exact sizes'],
  ['Logo, merch, ads', no('Licence risk'), yes('With an open licence'), 'You need rights to the artwork'],
], 'Where emoji work and where icons are the better pick.')}
${p(`For slides, our ${L.post('icons-in-presentations', 'guide to icons in presentations')} covers sizes and colours, and the ${L.guide('powerpoint', 'PowerPoint guide')} and ${L.guide('word-google-docs', 'Word and Google Docs guide')} show the copy and paste steps. If you are polishing a CV, see ${L.post('icons-on-a-resume', 'icons on a resume')}.`)}

${h2('Are emoji OK in LinkedIn posts?')}
${p('Yes, with a light touch. The post text is plain text, so emoji are the only pictures you can put in it, and they do help tone. Microsoft’s style guide has sensible rules that fit LinkedIn well:')}
${ul([
  '<strong>Put them at the end</strong> of a sentence or paragraph, not in the middle.',
  '<strong>Don’t replace words</strong> with them ("we 🚀 today" is hard to read and hard to hear).',
  '<strong>Don’t fake bullet points</strong> with an emoji at the start of every line.',
  '<strong>Keep it to about three</strong> per post, with a space between them.',
  '<strong>Skip them on serious topics</strong> such as layoffs, health or loss.',
])}
${p('If you want a picture that matches your brand, put icons in the image or carousel instead, where you control every colour.')}
${doDont('<p>Write "Our new pricing is live, and the free plan got bigger. 🎉" One emoji, at the end, adding tone.</p>', '<p>Start five lines with 🚀 ✅ 💡 🔥 👉. Every screen reader user hears five emoji names before your actual points.</p>')}

${h2('Can I use Apple emoji commercially?')}
${p('You can always <strong>type</strong> emoji in a post, an app or an ad’s caption: the character is a shared standard. Using Apple’s <strong>drawings</strong> as artwork (screenshotted into a logo, printed on a T-shirt, enlarged on a billboard) is a different thing, and that is where the answer is no.')}
${ul([
  '<strong>Apple’s macOS licence</strong> (Tahoe 26, section E) lets you use the bundled fonts to display and print content while running Apple’s software. It does not grant a licence to use the emoji artwork as your own graphic elsewhere.',
  '<strong>Emojipedia</strong> says licensing information for Apple and Samsung emoji is not publicly available, and that emoji images belong to their makers.',
  '<strong>Unicode</strong> says it does not own the vendors’ colour images and sends licence requests to the vendors.',
])}
${p(`So for a logo, merch, stickers you sell or an ad visual, use an openly licensed emoji set or icons you have rights to. Our post on ${L.post('free-icons-commercial-use', 'free icons for commercial use')} explains the licence names in plain words. We are an icon library, not lawyers, so for anything high-stakes read the licence itself or ask a professional.`)}

${h2('Which emoji sets can I use commercially?')}
${table(['Emoji set', 'Licence', 'Commercial use?', 'Credit needed?'], [
  ['Apple', 'Proprietary, no public licence for the artwork', no('Not as artwork'), 'n/a'],
  ['Samsung', 'Proprietary, no public licence for the artwork', no('Not as artwork'), 'n/a'],
  ['Google Noto Emoji', 'Images: Apache 2.0. Fonts: SIL OFL 1.1. Flags: public domain', yes('Yes'), yes('No visible credit')],
  ['Microsoft Fluent Emoji', 'MIT', yes('Yes'), yes('No visible credit')],
  ['Twemoji (originally by Twitter)', 'Graphics: CC BY 4.0. Code: MIT', yes('Yes'), no('Yes, a credit')],
  ['OpenMoji', 'CC BY-SA 4.0', yes('Yes'), no('Yes, and share changes alike')],
], 'Emoji artwork licences, checked on each project’s own page in November 2026.')}
${p('A few details matter. Noto says "most" image resources are Apache 2.0, so check the folder you take files from. Twemoji asks for a mention, for example in a README, an About page or a site footer, and its maintained copy now lives at github.com/jdecked/twemoji, following Unicode 17.0. OpenMoji’s share-alike rule means that if you remix its drawings, your remix carries the same licence. MIT and Apache ask you to keep the licence text when you pass the files on, but need no credit on the finished design.')}
${callout('warn', `<p>Even with an open licence, anyone else can use the same emoji artwork. That makes a stock emoji a weak base for a logo you want to protect. Draw or adapt something of your own, and see our post on ${L.post('free-icon-in-logo', 'using a free icon in a logo')}.</p>`, 'Logos are a special case')}

${h2('What changed since the old answers?')}
${ul([
  '<strong>The 2017-era lists are out of date.</strong> They predate today’s open sets and the licence pages each project now publishes.',
  '<strong>Microsoft open-sourced Fluent Emoji</strong> under MIT, one of the most relaxed licences there is.',
  '<strong>Twemoji carries on as a community-maintained fork</strong> (version 17, for Unicode 17.0), still under CC BY 4.0.',
  '<strong>Style guides now explain the accessibility side:</strong> emoji names are read aloud, so emoji bullets and emoji in place of words are discouraged.',
])}

${h2('What if I want the emoji look, but in my brand colours?')}
${p(`That is where icons drawn in a playful style come in. Our ${L.style('kawaii')} gives everyday objects a tiny face, ${L.style('sticker')} looks like a die-cut sticker, and ${L.style('soft3d', 'Soft 3D')} has the glossy, rounded feel of modern 3D emoji. Each comes with colour palettes you can change, and all of them are MIT, so they work on merch and ads with no credit.`)}
${styleRow('smile', '', { styles: ['line', 'duo', 'kawaii', 'sticker', 'soft3d', 'plush', 'pastel', 'anime'] })}
${iconGrid(['heart', 'star', 'party-popper', 'rocket', 'thumbs-up', 'sparkles', 'gift', 'cake', 'lightbulb', 'trophy', 'coffee', 'smile'], 'kawaii', 'Emoji-like icons in kawaii style: same idea, your colours, the same on every screen.')}
${p(`Browse more on the ${L.page('free/cute-icons.html', 'free cute icons')} and ${L.page('free/sticker-icons.html', 'free sticker icons')} pages, or start from ${L.icon('party-popper')} and try every style on its page.`)}

${h2('The short answer')}
${p(`Emoji for tone in chat and captions, at the end of a sentence and never as bullets. Icons for documents, slides, apps and print. For artwork in logos, products and ads, use an open emoji set (Fluent, Noto, Twemoji with credit, OpenMoji with credit) or icons under MIT. ${L.icons(`All ${N_ICONS} with icons`)} come in ${N_STYLES} styles, look the same everywhere and need no credit.`)}
${cta('Icons that look the same on every screen', `${N_ICONS} icons in ${N_STYLES} styles, from clean line to kawaii and soft 3D. Copy into slides, download PNG or SVG, MIT licensed, no credit needed.`, ['smile', 'heart', 'party-popper', 'rocket', 'sparkles', 'star'])}
`,
}
