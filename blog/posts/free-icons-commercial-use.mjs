import { p, h2, h3, ul, figure, iconGrid, styleRow, table, yes, no, meh, callout, steps, quote, cta, doDont, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'free-icons-commercial-use',
  category: 'guides',
  date: '2026-10-02',
  hero: 'lic0',
  stickers: [['shield-check', 'gloss'], ['file-check', 'duo'], ['badge-check', 'engrave']],
  title: 'Can I use free icons commercially? Icon licenses in plain English',
  cardTitle: 'Free icons and commercial use',
  h1: 'Can I use free icons commercially? Icon licenses in <em>plain English</em>',
  dek: 'Most free icons can be used in business work. The real question is what each license asks in return: nothing, a credit, or a link. Here is a friendly guide to the licenses you will actually meet.',
  description: 'Can you use free icons in commercial work? MIT, ISC, Apache 2.0, CC BY, CC0, SIL OFL, Flaticon and Icons8 licenses explained in plain English, with a decision table.',
  keywords: ['free icons commercial use', 'icon license', 'MIT license icons', 'CC BY 4.0 attribution', 'Flaticon attribution', 'Icons8 license', 'royalty free icons'],
  about: ['Software license', 'Creative Commons license', 'MIT License', 'Icons'],
  related: ['best-free-icon-libraries', 'with-icons-vs-flaticon', 'with-icons-vs-font-awesome'],
  tldr: [
    '<strong>Usually yes.</strong> Almost every popular free icon license allows commercial use. What changes is what you must do in return.',
    '<strong>No visible credit needed:</strong> MIT, ISC, Apache 2.0 and CC0. Keep the license text with the files if you pass the icon files or code on to others.',
    '<strong>Credit needed:</strong> CC BY 4.0, and the free plans of marketplaces like Flaticon and Freepik. <strong>A link needed:</strong> Icons8’s free plan.',
    '<strong>Brand logos are different.</strong> An icon license covers the drawing, not the trademark. Use logos only to refer to that brand.',
    '<strong>with icons</strong> is MIT: free for personal and commercial use, no attribution required.',
  ],
  faq: [
    { q: 'Do I need to credit icons under the MIT license?', a: 'Not on your website, app screen or slides. The MIT license asks you to keep its copyright and permission notice with copies of the software, which in practice means keeping the license file when you redistribute the icon files or code (for example in a source repository or a template you sell).' },
    { q: 'Can I use free icons in a logo?', a: 'Check the license first: Freepik’s licence, for example, does not allow its resources in logos or trademarks. Even when a license allows it (MIT does), a free icon makes a weak logo, because anyone else can use the very same drawing, which makes it hard to protect as your own mark.' },
    { q: 'Is Font Awesome free for commercial use?', a: 'Yes, Font Awesome Free can be used in commercial projects. Its icons are CC BY 4.0, and Font Awesome says the credit comments already inside its files count as attribution, so normal use needs nothing extra.' },
    { q: 'How do I credit Flaticon icons?', a: 'On the free plan, Flaticon’s terms require crediting Flaticon and the icon’s author. Each icon page shows the credit text to copy. A Premium subscription removes the requirement for icons downloaded while subscribed.' },
    { q: 'Can I sell T-shirts or mugs with free icons on them?', a: 'It depends on the license. MIT, ISC, Apache 2.0 and CC0 allow it. Flaticon’s free licence does not allow products for resale where the icon is the main element; that needs a separate merchandising licence. Remember that brand logos can never be used this way without the brand owner’s permission.' },
    { q: 'Is this legal advice?', a: 'No. It is a friendly summary written by an icon library, checked against the official license texts in October 2026. For anything high-stakes, read the license itself or ask a lawyer.' },
  ],
  sources: [
    { title: 'The MIT License (Open Source Initiative)', url: 'https://opensource.org/license/mit' },
    { title: 'The ISC License (Open Source Initiative)', url: 'https://opensource.org/license/isc' },
    { title: 'Apache License, Version 2.0', url: 'https://www.apache.org/licenses/LICENSE-2.0' },
    { title: 'Creative Commons: CC BY 4.0 deed', url: 'https://creativecommons.org/licenses/by/4.0/' },
    { title: 'Creative Commons: CC0 1.0 deed', url: 'https://creativecommons.org/publicdomain/zero/1.0/' },
    { title: 'SIL Open Font License', url: 'https://openfontlicense.org/' },
    { title: 'Font Awesome Free license', url: 'https://fontawesome.com/license/free' },
    { title: 'Flaticon terms of use (section 8, licence agreement)', url: 'https://www.flaticon.com/legal' },
    { title: 'Freepik support: licenses and attribution', url: 'https://support.freepik.com/s/article/Attribution-How-when-and-where?language=en_US' },
    { title: 'Icons8 license: how to use our graphics for free', url: 'https://icons8.com/license' },
    { title: 'Lucide license (ISC)', url: 'https://lucide.dev/license' },
    { title: 'Material Design Icons license (Apache 2.0)', url: 'https://github.com/google/material-design-icons/blob/master/LICENSE' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">Yes, you can usually use free icons commercially. Nearly every popular free icon license allows business use: websites, apps, client work, ads and slides for paying customers. The catch is <em>what each license asks in return</em>. Some ask for nothing, some for a visible credit, some for a link. And none of them give you the right to use another company’s logo as you please.</span>`)}
${p(`This guide walks through the licenses you will actually meet, in everyday words. We make ${L.icons('with icons')}, an MIT-licensed set, so we have read these texts more times than we would like to admit. We checked every license against its official text in October 2026 and linked them all at the bottom.`)}
${callout('note', 'We are an icon library, not lawyers, and this is not legal advice. It is a friendly map of the territory. For anything high-stakes, read the license itself or ask a professional.', 'A quick, friendly disclaimer')}

${h2('What does “commercial use” actually mean?')}
${p('Commercial use simply means using something as part of work that makes money, directly or indirectly. A company website, an app with a subscription, a client’s brochure, a paid course, a sales deck and an ad campaign all count. Personal use is the opposite: your own birthday invitation or a school project.')}
${p('A license is the rulebook the icon’s creator gives you. Free icon licenses fall into three easy groups: <strong>do what you like</strong>, <strong>do what you like but give credit</strong>, and <strong>free with conditions set by a company</strong> (the marketplaces).')}

${h2('The quick answer: a decision table')}
${table(['License', 'Commercial use?', 'Visible credit needed?', 'Who uses it'], [
  ['MIT', yes('Yes'), yes('No (keep the license text with the files)'), 'with icons, Heroicons, Phosphor, Tabler'],
  ['ISC', yes('Yes'), yes('No (keep the license text with the files)'), 'Lucide'],
  ['Apache 2.0', yes('Yes'), yes('No (keep license and NOTICE files)'), 'Material Symbols'],
  ['CC0', yes('Yes'), yes('No, nothing at all'), 'Some public domain sets'],
  ['CC BY 4.0', yes('Yes'), meh('Yes, a credit'), 'Font Awesome Free icons'],
  ['SIL OFL 1.1', yes('Yes'), yes('Not for using the font'), 'Icon fonts'],
  ['Flaticon (free)', meh('Yes, with limits'), no('Yes, Flaticon and the author'), 'Flaticon'],
  ['Freepik (free)', meh('Yes, with limits'), no('Yes, a credit line and link'), 'Freepik'],
  ['Icons8 (free)', meh('Yes, with a link'), no('Yes, a link to icons8.com'), 'Icons8'],
], 'Common icon licenses at a glance (checked October 2026). Paid marketplace plans remove the credit.')}

${h2('What is the MIT license?')}
${p(`MIT is one of the shortest and most relaxed licenses there is. It lets you use, copy, change, merge, publish, share, sublicense and sell the work, for free. The one condition: the copyright notice and the license text must be included in “all copies or substantial portions” of the software.`)}
${p(`In practice, that means if you <strong>pass the icon files or code on</strong> (in a source code repository, an npm package, a template you sell), keep the little license file with them. Putting an icon on your website, in an app screen, on a slide or a poster does not need a visible credit. That is why we chose MIT for with icons: use the icons anywhere, and read the full text on our ${L.page('license.html', 'license page')}.`)}

${h2('What about ISC (Lucide) and Apache 2.0 (Material Symbols)?')}
${h3('ISC')}
${p('ISC is MIT’s even shorter cousin. It allows use, copying, changing and sharing for any purpose, as long as the copyright and permission notice stay with copies. For everyday use it behaves just like MIT. Lucide uses ISC.')}
${h3('Apache 2.0')}
${p('Apache 2.0 is longer and more formal, but just as friendly to commercial use. Google’s Material Symbols use it. If you redistribute the files, you include a copy of the license, keep any NOTICE file, and mark files you changed. It also says, in plain terms, that it does not give you permission to use the licensor’s trademarks. Using a Material icon on your website needs no visible credit.')}

${h2('What does CC BY 4.0 ask for?')}
${p('Creative Commons Attribution 4.0 lets you share and adapt the work “for any purpose, even commercially”. In return you must give <strong>appropriate credit</strong>: name the creator, link to the license, and say if you changed anything. You can do it “in any reasonable manner”, but not in a way that suggests the creator endorses you.')}
${p('Font Awesome Free uses CC BY 4.0 for its icons, with a nice twist: Font Awesome says the credit comments already inside its downloaded files are enough, so normal use needs nothing extra. Other CC BY sets may expect a visible line somewhere.')}

${h2('What is CC0?')}
${p('CC0 is the “no rules” option. The creator gives up their copyright as far as the law allows, so you can copy, change and sell the work without asking and without credit. One thing CC0 does not touch, as the Creative Commons deed spells out: trademark and patent rights. A CC0 drawing of a famous logo is still a famous logo.')}

${h2('What is the SIL Open Font License?')}
${p('You will meet the SIL OFL with <strong>icon fonts</strong>, where each letter of a font is a little picture. It is built for fonts: you can use them in documents, websites, artwork and even logos with no acknowledgement required, and you can bundle them with software. The main limit is that you cannot sell the font file on its own. If you change the font, some fonts also ask you to rename it.')}
${p(`Open licenses let you use one drawing everywhere. Here is the ${L.icon('shield-check')} icon across the with icons styles, all under the same MIT license, from the plain line you would use in an app to the creative looks you might put on a poster.`)}
${styleRow('shield-check')}

${h2('How do Flaticon, Freepik and Icons8 licenses work?')}
${p('Marketplaces work differently from open-source sets. The icons are free to download, but the license is a contract set by the company, and the free plan comes with conditions. A paid plan usually removes them.')}
${ul([
  `<strong>Flaticon:</strong> free use requires crediting Flaticon and the icon’s author. A Premium subscription removes the credit. The free licence also does not cover products for resale (think mugs, T-shirts or cards) where the icon is the main element; that needs a separate merchandising licence. Our ${L.alt('flaticon', 'Flaticon alternative page')} compares it with with icons.`,
  '<strong>Freepik:</strong> free and Essential users must add a visible credit line with a link, ideally next to the image or in the footer. Premium plans remove it. Its licence also says you cannot use its resources in logos or trademarks, or resell the original files. (Freepik’s company rebranded as Magnific in 2026, so its help pages now use that name.)',
  `<strong>Icons8:</strong> the free plan asks you to link to icons8.com wherever you use the icons: on every page that uses them (a footer link is fine if that is most pages), in an app’s About screen, or on a slide. A paid licence removes the link. More on our ${L.alt('icons8', 'Icons8 alternative page')}.`,
])}
${callout('warn', 'Forgetting the credit on a marketplace’s free plan is not a small detail: it means you are using the icon outside its licence. If you cannot add a credit (say, in a client’s app), pay for the plan or pick a set that needs no credit.')}
${figure('lic4', 'A license is just a short agreement. Reading it once, before you design, saves a lot of awkward redesigns later.')}

${h2('What does attribution look like in practice?')}
${p('“Attribution” just means a credit. It does not have to be ugly. A good credit names the work, the creator, where it came from and the license. Here is a typical CC BY credit:')}
${quote('Rocket icon by Jane Doe, licensed under CC BY 4.0 (with a link to the license).', 'An example credit line (the name is made up)')}
${p('And here is where people usually put it:')}
${ul([
  '<strong>Website:</strong> next to the image, or in the footer or on a credits page.',
  '<strong>Slides:</strong> a small line on the slide, or a credits slide at the end.',
  '<strong>App:</strong> the About or Credits screen, and sometimes the app store description.',
  '<strong>Print:</strong> the imprint, acknowledgements or small print.',
])}
${p('Always use the exact wording the source asks for, if it gives one. Flaticon and Freepik show the text to copy right on the download screen.')}

${h2('Can you use brand logos from an icon set?')}
${p('This is where people get caught out. An icon license covers the <strong>drawing</strong>. A brand logo is also a <strong>trademark</strong>, and trademark law is a separate thing that no icon license can hand over. Font Awesome says it plainly on its license page: brand icons are trademarks of their owners, and should only be used to represent the company, product or service they refer to.')}
${ul([
  '<strong>Usually fine:</strong> a “Follow us on Instagram” link, a “Pay with Visa” badge, a “Download on GitHub” button.',
  '<strong>Not fine:</strong> putting a brand’s logo on merchandise, in your own logo, or anywhere that suggests a partnership you do not have.',
  '<strong>Best practice:</strong> download logos from the brand’s own press or brand page, and follow its guidelines.',
])}
${p('with icons does not include any brand logos, partly for this reason. Our icons are everyday symbols you can use freely.')}
${iconGrid(['home', 'mail', 'shopping-cart', 'calendar', 'users', 'heart'], 'line', 'Everyday symbols like these are not anyone’s trademark, which is what makes them safe to use anywhere.')}

${h2('Common myths about free icons')}
${ul([
  '<strong>“If it is on Google Images, it is free.”</strong> No. Being visible online says nothing about the license. Always get icons from a source that states one.',
  '<strong>“Free means no rules.”</strong> Only CC0 is close to that. Most free licenses have at least one small condition.',
  '<strong>“If I change the colour, it is mine.”</strong> No. A recoloured or resized icon is still the original work, and the license still applies.',
  '<strong>“MIT means I must credit it on my website.”</strong> No. MIT asks you to keep the license text with copies of the files, not to show a credit on screen.',
  '<strong>“A CC0 or MIT logo is free to use.”</strong> No. Trademark rights are separate from the drawing’s license.',
])}

${h2('How do you check an icon’s license in two minutes?')}
${steps([
  ['Find the license name', 'Look for a License link in the site footer, the GitHub repository (a file called LICENSE) or the download screen.'],
  ['Match it to the table above', 'MIT, ISC, Apache 2.0 or CC0: use freely. CC BY or a marketplace free plan: plan a credit.'],
  ['Check the special cases', 'Logos, products you will sell, and anything that will become part of your own trademark.'],
  ['Write it down', 'Keep a simple note of where each icon set came from and its license, in your project folder.'],
])}
${doDont(
  '<p>Get icons from a source with a clear license, keep a note of it, and add credits from day one if the license asks for them.</p>',
  '<p>Grab icons from search results, mix five sources with five different licenses, or put a brand’s logo on something you sell.</p>',
)}

${h2('The bottom line')}
${p(`Free icons are almost always fine for commercial work. Sets under MIT, ISC, Apache 2.0 and CC0 need no visible credit; CC BY and marketplace free plans do; logos are a separate matter. If you would rather not think about any of this, pick one well-licensed set and stick to it. Our roundup of the ${L.post('best-free-icon-libraries', 'best free icon libraries')} lists each one’s license side by side.`)}
${cta('Icons with no strings attached', `${N_ICONS} icons in ${N_STYLES} styles under the MIT license. Use them in client work, products and slides. No credit, no sign-up, no paid tier.`, ['shield-check', 'badge-check', 'heart', 'star', 'rocket', 'sparkles'])}
`,
}
