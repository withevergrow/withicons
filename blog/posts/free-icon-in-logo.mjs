import { p, h2, ul, art, iconGrid, styleRow, table, yes, no, meh, callout, steps, doDont, cta, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'free-icon-in-logo',
  category: 'guides',
  date: '2026-11-06',
  hero: 'h-free-icon-in-logo',
  stickers: [['badge-check', 'gloss'], ['crown', 'retro'], ['fingerprint', 'duo']],
  title: 'Can I use a free icon in my logo, and can I trademark it?',
  cardTitle: 'Free icons in a logo',
  h1: 'Can I use a free icon in my logo, and can I <em>trademark</em> it?',
  dek: 'Some free icon licences allow logos and some forbid them. Even when it is allowed, a free icon is not yours alone. Here is what each licence says in November 2026, and how to make an icon-based logo you can really own.',
  description: 'Can you put a free icon in your logo and trademark it? What MIT, Flaticon, Freepik, Canva and Remix Icon allow in 2026, and how to make an icon logo you own.',
  keywords: ['free icon in logo', 'can I use icons in my logo', 'trademark a logo with a free icon', 'canva logo trademark', 'flaticon logo use', 'freepik logo license', 'remix icon license logo', 'icon logo copyright'],
  about: ['Logo', 'Trademark', 'Software license', 'Icons'],
  related: ['free-icons-commercial-use', 'sell-products-with-free-icons', 'with-icons-vs-flaticon'],
  tldr: [
    '<strong>Sometimes.</strong> Open licences such as MIT, ISC and CC0 let you put an icon in a logo. Canva, Flaticon, Freepik (now Magnific) and, since January 2026, Remix Icon do not.',
    '<strong>Allowed is not the same as owned.</strong> A free icon is non-exclusive: anyone else can use the very same drawing, so it cannot be the distinctive part of a trademark.',
    '<strong>Trademarks protect what sets you apart.</strong> A plain coffee cup for a café or a house for an estate agent describes the business rather than identifying it, which makes it weak.',
    '<strong>To own it:</strong> register your name as a word mark, and turn the icon into something new (combine ideas, redraw, simplify) rather than recolouring it.',
    '<strong>with icons</strong> is MIT: logo use is allowed, but we say plainly that you should use an icon as a starting point, not the finished mark.',
  ],
  faq: [
    { q: 'Can I trademark a logo I made in Canva?', a: 'Only if it is built from Canva fonts, basic shapes and lines, or from artwork you upload and own. Canva’s help centre says stock graphics and logo templates are non-exclusive, so other users can use the same content and you cannot register it as a trademark. Canva also does not sell exclusive rights to its graphics.' },
    { q: 'Can I use Flaticon icons in a logo?', a: 'Not as they are. Flaticon’s terms do not allow its content on a trademark or as part of one, even with a Premium subscription or a Merchandising Licence. The terms make one exception: a version modified so much that it is new and different content that does not mislead people about the original.' },
    { q: 'Can I use an MIT-licensed icon in my logo?', a: 'Yes. The MIT licence allows any use, including logos, and asks only that you keep the licence text with copies of the files if you pass the files on. The catch is practical, not legal: anyone else may use the same icon, so it will never be unique to you.' },
    { q: 'If I change the colour of a free icon, is it my logo?', a: 'No. Recolouring, resizing or rotating an icon leaves it the same drawing. Remix Icon’s licence names those simple changes as still forbidden for logos, and a trademark office would still see a familiar picture. Real ownership comes from a new design.' },
    { q: 'Do I need a trademark at all for a small business?', a: 'Not to start trading. Many small businesses begin with a simple logo and register later. If the name matters to you, a trademark search before you print signs and packaging is a cheap way to avoid a painful rename, and a word mark protects the name in any font or colour.' },
    { q: 'Is this legal advice?', a: 'No. It is a friendly summary from an icon library, checked against each licence and the USPTO’s own guides in November 2026. Trademark rules differ by country, so for a real filing talk to a trademark attorney or your national office.' },
  ],
  sources: [
    { title: 'with icons licence (MIT), checked Nov 2026', url: 'https://withicons.com/license.html' },
    { title: 'Canva Help: Trademarking logos created on Canva, checked Nov 2026', url: 'https://www.canva.com/help/trademarks-logo/' },
    { title: 'Canva Content License Agreement, section 9 (prohibited uses), checked Nov 2026', url: 'https://www.canva.com/policies/content-license-agreement/' },
    { title: 'Flaticon terms of use, section 8.3 (trademark use), checked Nov 2026', url: 'https://www.flaticon.com/legal' },
    { title: 'Flaticon Merchandising License summary, checked Nov 2026', url: 'https://www.flaticon.com/merchandising-license' },
    { title: 'Magnific (formerly Freepik) terms of use, June 2026, section 8.1, checked Nov 2026', url: 'https://www.freepik.com/legal/terms-of-use' },
    { title: 'Remix Icon License v1.0 (January 2026), section 3.3, checked Nov 2026', url: 'https://github.com/Remix-Design/RemixIcon/blob/master/License' },
    { title: 'USPTO: Strong trademarks, checked Nov 2026', url: 'https://www.uspto.gov/trademarks/basics/strong-trademarks' },
    { title: 'USPTO: Protecting your trademark (basic facts booklet), checked Nov 2026', url: 'https://www.uspto.gov/sites/default/files/trademarks/basics/BasicFacts.pdf' },
    { title: 'USPTO: Drawing of your trademark (standard character vs special form), checked Nov 2026', url: 'https://www.uspto.gov/trademarks/basics/mark-drawings-trademarks' },
    { title: 'The MIT License (Open Source Initiative)', url: 'https://opensource.org/license/mit' },
    { title: 'Lucide license (ISC), checked Nov 2026', url: 'https://lucide.dev/license' },
  ],
  body: () => `
${p(`<span class="lede">You can use a free icon in your logo only if its licence allows it, and many do not. Open licences such as MIT, ISC and CC0 allow logo use. Canva, Flaticon, Freepik (now called Magnific) and, since January 2026, Remix Icon forbid it. And even when it is allowed, you cannot really own a free icon: anyone can use the same drawing, so it cannot be the part of your trademark that sets you apart. The fix is simple: register your name, and turn the icon into something new.</span>`)}
${p(`Most answers online only cover Canva. This guide puts the big icon sources side by side, explains the “non-exclusive” problem in plain words, and ends with a practical way to make an icon-based logo you can stand behind. We make ${L.icons('with icons')}, an MIT-licensed set, so we will also be honest about what our own licence can and cannot do for you.`)}
${callout('note', 'We are an icon library, not lawyers, and this is not legal advice. We checked every licence and the USPTO guides in November 2026. For a real trademark filing, a trademark attorney or your national office is the right next step.', 'A quick, friendly disclaimer')}

${h2('Can I use a free icon in my logo?')}
${p('It depends entirely on where the icon came from. Here is what the licences people use most actually say about logos today.')}
${table(['Source', 'Logo use allowed?', 'What the licence says'], [
  ['with icons (MIT)', yes('Yes'), 'Any use, including logos. Our licence page adds a gentle “think twice”, because anyone can use the same icon.'],
  ['Other MIT, ISC and CC0 sets', yes('Yes'), 'Heroicons, Phosphor and Tabler (MIT), Lucide (ISC) and CC0 sets do not restrict logo use.'],
  ['Canva elements and templates', no('No, except fonts, basic shapes and lines'), 'Library content cannot be part of a trademark, design mark, trade name or business name. Logo templates are non-exclusive.'],
  ['Flaticon (free, Premium or Merchandising)', no('No, unless changed into new content'), 'No use on a trademark or as part of one, unless modified so much that it is new and different content.'],
  ['Freepik / Magnific', no('No, unless changed into new content'), 'Same rule: not in a trademark unless it is new content that is not confusingly similar to the original.'],
  ['Remix Icon (since January 2026)', no('No'), 'Not as a logo, trademark or brand identity, modified or not. Recolouring, rotating or combining icons still counts.'],
], 'Logo rules of popular icon sources, checked November 2026.')}
${p(`Notice the pattern. Marketplaces and design apps sell or give the same picture to millions of people, so they protect themselves (and their other customers) by keeping it out of trademarks. Open-source licences simply do not get involved. Our ${L.post('free-icons-commercial-use', 'guide to icon licences')} explains each licence in more depth.`)}

${callout('try', `<p><strong>Remix Icon changed its licence in January 2026.</strong> For years it was Apache 2.0, which says nothing about logos, so older answers call it logo-safe. The new Remix Icon License v1.0 forbids logo and brand identity use outright, and also forbids selling the icons as a standalone pack.</p><p><strong>Freepik is now Magnific.</strong> Its June 2026 terms keep the same trademark rule under the new name. Flaticon’s credit line now reads “Icons made by Magnific”.</p>`, 'What changed since the old answers')}

${h2('Can I trademark a logo that uses a free icon?')}
${p('This is where people get caught out, even with a licence that allows logos. A trademark is the sign that tells customers who a product or service comes from. The USPTO, the United States trademark office, puts it simply: the stronger and more distinctive your mark, the more easily you can stop others using it. Weak marks are hard and costly to defend.')}
${p('A free icon is <strong>non-exclusive</strong>. You received the right to use it, but so did everyone else. Canva says exactly this about its own library: other users are free to use the same content, so elements in a trademark need to be exclusive to you. If a dozen businesses already show the same drawing, the drawing is not telling anyone which business is yours.')}
${art('m-free-icon-in-logo-same-icon', 'The same free icon can turn up on a café, a candle shop and a podcast. None of them can claim it.', { brief: 'Three small, simple shop-front or business-card mockups in a row: a café, a candle shop and a podcast cover. All three use the exact same with icons coffee icon (line style) next to different made-up names (“Morning Co.”, “Wick & Wax”, “Slow Sips”). A thin dashed line links the three identical icons, with a short label above: “Same icon, three businesses”. Below, a small caption chip: “Nobody owns it”.' })}
${p(`There is a second, quieter problem. The USPTO’s basic guide says descriptive marks, words <em>or designs</em> that just describe the goods or services, are weak, and gives the example of a picture of a television for a television repair service. A plain ${L.icon('coffee', 'coffee cup')} for a café or a ${L.icon('home', 'house')} for an estate agent is the same idea. Free icons are, by design, the clearest everyday picture of a thing, which is exactly what makes them weak as marks.`)}
${iconGrid(['coffee', 'home', 'leaf', 'rocket', 'heart', 'shopping-bag'], 'line', 'Great everyday symbols, weak logos: each one describes a whole category of business, and each is free for everyone.')}

${h2('Is a recoloured or restyled icon my own design?')}
${p('No. Changing the colour, size, rotation or style of an icon leaves it the same drawing. Remix Icon’s new licence even lists those changes by name as not enough. Canva’s help centre treats recolouring, cropping or adding an outline as using the content “as-is”. A trademark examiner would still see a familiar picture.')}
${styleRow('coffee', `The ${L.icon('coffee')} icon in six of our ${N_STYLES} styles. Each one looks different, but every one is free to everybody, so none of them is a design you can call yours.`, { styles: ['line', 'solid', 'duo', 'retro', 'bauhaus', 'kawaii'] })}

${h2('How do I make an icon-based logo I can actually own?')}
${p('Think of a free icon as a sketch on a napkin: a useful starting point, not the finished mark. These steps work whether you design it yourself or brief a designer.')}
${steps([
  ['Start with the name', 'Your name is usually the most valuable part of the brand. The USPTO notes that a word mark (it calls it a standard character mark) protects the words themselves in any font, style, size or colour, which is broader protection than a drawing.'],
  ['Search before you fall in love', 'Check your country’s trademark database (in the US, the USPTO’s search) and a plain web search for the name and similar ones in your field. Likelihood of confusion with an existing mark is the most common reason the USPTO refuses an application.'],
  ['Use the icon as research, not as the mark', 'Pick two or three icons that capture your idea, then combine and redraw them into one new shape: a leaf that is also the letter of your name, a cup made from your initial, a negative-space trick.'],
  ['Pair it with a wordmark', 'Set your name in a font you are licensed to use, and lock the symbol and the name together. The combination is far more distinctive than either part alone.'],
  ['Test it small and in one colour', 'A logo must work at favicon size and in black only. Simple shapes survive; thin details vanish.'],
  ['Get help for the filing', 'Registering a design mark (a special form drawing, in USPTO words) protects that exact look. A trademark attorney can tell you what is worth registering where you trade.'],
])}
${art('m-free-icon-in-logo-make-it-yours', 'From free icon to your own mark: combine, redraw, then pair it with your name.', { brief: 'A three-step left-to-right sequence on a soft cream background. Step 1, labelled “Free icon”: the with icons leaf icon (line style) on its own. Step 2, labelled “Redrawn”: a new custom mark that merges a leaf with a bold letter “M” (clearly a fresh shape, not the original icon). Step 3, labelled “Your logo”: that new mark locked up with the made-up wordmark “Meadow Studio”. Thin arrows between steps. Keep it clean and flat, one brand colour.' })}

${h2('Is it fine to use a free icon in a logo while I am starting out?')}
${p('Yes, if the licence allows it and you go in with open eyes. Canva makes the same point about its logo templates: they are a quick way to get basic branding when you are just starting and are not worried about exclusive rights. Lots of side projects, school clubs, community groups and first-month businesses do exactly this.')}
${p(`Just plan for the day the brand matters. If you print a thousand bags with a free icon on them, you cannot stop a competitor from printing the same icon on theirs. Swapping in a custom mark before you invest in signage, packaging or a trademark filing saves money later.`)}
${doDont(
  '<p>Check the licence first, use a free icon as a starting sketch, build a new mark from it, protect your name as a word mark, and keep a note of where every part of the logo came from.</p>',
  '<p>Recolour a marketplace icon and call it yours, file a trademark for a stock graphic, use a brand’s logo (or something that looks like it) in yours, or print a large run before searching the name.</p>',
)}

${h2('Where do free icons shine in a brand, then?')}
${p(`Everywhere around the logo. Icons are made for the supporting cast of a brand: the phone and mail symbols on a business card, the feature list on your website, the menu labels in your app, the steps in a slide deck. There, being familiar is a strength, and nobody needs to own them.`)}
${ul([
  `<strong>Business cards and email signatures:</strong> small ${L.icon('phone')}, ${L.icon('mail')} and ${L.icon('map-pin')} icons. Our ${L.guide('email-signatures', 'email signature guide')} shows how.`,
  `<strong>Websites and slides:</strong> one consistent style for features and steps. Browse ${L.page('free/svg-icons.html', 'free SVG icons')} or read ${L.post('consistent-icons', 'how to keep icons consistent')}.`,
  `<strong>Merch and packaging:</strong> fine with an MIT icon as decoration. If you plan to sell products, see ${L.post('sell-products-with-free-icons', 'selling products made with free icons')}.`,
  `<strong>Canva designs:</strong> you can bring our icons in as your own uploads. The ${L.guide('canva', 'Canva guide')} walks through it.`,
])}

${h2('What exactly does the with icons licence allow?')}
${p(`Every with icons icon, in all ${N_STYLES} styles, is under the MIT licence. In plain words, from our ${L.page('license.html', 'licence page')}:`)}
${table(['Question', 'Answer'], [
  ['Can I use one in my logo?', meh('Yes, but think twice: it will not be unique to you and may be hard to trademark')],
  ['Can I change it?', yes('Yes: recolour, resize, combine or redraw')],
  ['Do I have to credit you?', yes('No credit needed, in a logo or anywhere else')],
  ['Does it cover the with icons name and logo?', no('No: the licence covers the icons and code, not our brand')],
], 'The with icons licence in brief.')}
${p('That is the honest version: we allow logo use, and we would rather you built something that is truly yours on top of it.')}
${cta('Find a starting point for your mark', `${N_ICONS} icons in ${N_STYLES} styles, MIT licensed. Sketch with them, combine them, redraw them. No sign-up, no credit needed.`, ['pen-tool', 'shapes', 'leaf', 'sparkles', 'crown', 'star'])}
`,
}
