import { p, h2, ul, iconGrid, sizeRamp, table, yes, no, meh, callout, steps, doDont, code, cta, art, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'svg-icons-in-email',
  category: 'code',
  date: '2026-11-06',
  hero: 'h-svg-icons-in-email',
  stickers: [['mail', 'duo'], ['send', 'solid'], ['image', 'sticker']],
  title: 'Can you use SVG icons in email? Gmail, Outlook and Apple Mail in 2026',
  cardTitle: 'SVG icons in email',
  h1: 'Can you use SVG icons in <em>email</em>?',
  dek: 'Gmail finally shows SVG images, so the old “never” answers are wrong. But it turns them into PNGs, and older Outlook still shows nothing. Here is what works in 2026, and why a 2x PNG is still the safe pick.',
  description: 'SVG in email in 2026: which clients show it (Gmail now does, as a PNG), why 2x PNG is still the safe choice, plus retina sizes, dark mode and alt text.',
  keywords: ['svg in email', 'svg icons in email', 'does gmail support svg', 'outlook svg email', 'svg image not showing in email', 'email icons png size', 'retina images email', 'icons in html email', 'dark mode email icons', 'email signature icons'],
  about: ['HTML email', 'Scalable Vector Graphics', 'Portable Network Graphics', 'Gmail', 'Microsoft Outlook', 'with icons'],
  related: ['svg-vs-png-icons', 'dark-mode-icons', 'accessible-icons'],
  tldr: [
    '<strong>Use PNG icons in email, at twice the size they show</strong> (a 20 px icon as a 40 px or larger PNG), with <code>width</code> and <code>height</code> set in the HTML.',
    'SVG files work in more places than they used to: caniemail’s September 2026 test shows Apple Mail, Yahoo and Outlook.com display them, and Gmail now shows them too, but converted to PNG.',
    'Classic Outlook for Windows 2007 to 2016 still shows no SVG at all, and SVG code pasted into the email (inline <code>&lt;svg&gt;</code>) is stripped by Gmail, Outlook and Yahoo.',
    'Email apps cannot recolour your icons, and dark mode varies by app. Pick a colour that reads on light and dark, or put the icon on a coloured circle.',
    'Give every icon <code>alt</code> text: classic Outlook blocks pictures by default, and then readers see only the words.',
  ],
  faq: [
    { q: 'Does Gmail support SVG images in 2026?', a: 'Partly. caniemail’s test of 16 September 2026 shows Gmail on the web, iPhone and Android now displays SVG images linked from an &lt;img&gt; tag, but it rasterises them, turning each one into a PNG. Earlier tests (2020 to 2024) showed no support on Gmail’s web app. SVG code written straight into the email is still removed.' },
    { q: 'Does Outlook support SVG in email?', a: 'It depends on the version. caniemail lists no SVG support in Outlook for Windows 2007, 2010, 2013 and 2016, but support in Outlook 2019, Outlook.com, Outlook for Mac (recent versions) and the Outlook phone apps. Since many workplaces still run older desktop Outlook, PNG is the safer pick.' },
    { q: 'What size should icons be in an email?', a: 'Show them at about 16 to 24 px next to text, and 24 to 32 px for social icons. Save the PNG at two or three times that size (for example 48 or 64 px for a 20 px icon), then set width="20" height="20" on the &lt;img&gt; tag so it shows small but stays sharp on high-resolution screens.' },
    { q: 'Why are my email icons not showing?', a: 'The most common reasons: the reader’s app blocks images until they click “download pictures” (classic Outlook does this by default), the image is an SVG in a client that does not support it, the image is a base64 data URI (Gmail does not show those), or the file is not publicly hosted. Use hosted PNGs with alt text.' },
    { q: 'Can I change an icon’s colour with CSS in email?', a: 'No. Email apps treat icons as plain pictures, and the tricks websites use (currentColor, CSS masks, inline SVG) do not work across email clients. Download each icon in the exact colour you need. If you need two colours (light and dark), make two files.' },
  ],
  sources: [
    { title: 'caniemail: SVG image format (linked file), last tested 16 September 2026, checked November 2026', url: 'https://www.caniemail.com/features/image-svg/' },
    { title: 'caniemail: Embedded <svg> image (inline), last tested February 2020, checked November 2026', url: 'https://www.caniemail.com/features/html-svg/' },
    { title: 'caniemail: @media (prefers-color-scheme), last tested March 2023, checked November 2026', url: 'https://www.caniemail.com/features/css-at-media-prefers-color-scheme/' },
    { title: 'caniemail: width property (CSS width on images in Outlook for Windows), checked November 2026', url: 'https://www.caniemail.com/features/css-width/' },
    { title: 'caniemail: Base 64 image format, checked November 2026', url: 'https://www.caniemail.com/features/image-base64/' },
    { title: 'caniemail: GIF image format (animation in Outlook for Windows), checked November 2026', url: 'https://www.caniemail.com/features/image-gif/' },
    { title: 'Microsoft Support: Block or unblock automatic picture downloads in classic Outlook, checked November 2026', url: 'https://support.microsoft.com/en-us/outlook/block-or-unblock-automatic-picture-downloads-in-classic-outlook-email-messages' },
    { title: 'Stack Overflow: SVG image not showing in HTML email (2011, the stale “no plans” answer)', url: 'https://stackoverflow.com/questions/5681562/svg-image-not-showing-in-html-email' },
  ],
  body: () => `
${p(`<span class="lede">You can use SVG icons in some email apps in 2026, but you should not rely on them. caniemail’s September 2026 test shows Apple Mail, Yahoo and Outlook.com display SVG images, and Gmail now shows them too, converted to PNG. Classic Outlook for Windows 2007 to 2016 still shows nothing. For icons that must appear for everyone, use PNG files saved at twice their display size, with width and height set in the HTML.</span>`)}
${p(`That covers newsletters, receipts, signatures and any email with little phone, calendar or social icons. Below we show which apps render what, the exact sizes to export, how dark mode and blocked images change things, and how to get crisp PNGs from any ${L.icons('with icons')} icon page. Writing a signature? Our ${L.guide('email-signatures', 'email signature guide')} has the click-by-click steps for Gmail, Outlook and Apple Mail.`)}

${callout('note', '<p>The top answers to “SVG not showing in email” date from 2011 and 2013 and say Google has no plans to support SVG. caniemail’s tests up to July 2024 agreed for Gmail on the web. Its 16 September 2026 test changed the picture: Gmail on the web, iPhone and Android now displays linked SVG images, but “rasterized in PNG”. Outlook for Windows 2007 to 2016 still shows none, and SVG code written straight into an email is still stripped by most apps.</p>', 'What changed since the old answers')}

${h2('Which email clients show SVG images in 2026?')}
${p('There are two ways to put an SVG in an email, and they behave very differently. A <strong>linked file</strong> is an ordinary <code>&lt;img src="icon.svg"&gt;</code> pointing at a file on a server. <strong>Inline SVG</strong> means pasting the SVG code itself into the email’s HTML. Here is what caniemail, the reference site email developers use, records for each.')}
${table(['Email app', 'Linked .svg file', 'Inline &lt;svg&gt; code'], [
  ['Apple Mail (Mac, iPhone, iPad)', yes('Yes (recent versions)'), meh('Yes on iPhone, partly on Mac (2020 test)')],
  ['Gmail (web, iPhone, Android)', meh('Shown, but turned into a PNG'), no('No')],
  ['Outlook for Windows 2007 to 2016', no('No'), no('No')],
  ['Outlook 2019 for Windows', yes('Yes'), no('No')],
  ['Outlook.com and Outlook phone apps', yes('Yes'), no('No')],
  ['Outlook for Mac', yes('Yes (recent versions)'), no('No (latest tested)')],
  ['Yahoo Mail and AOL', yes('Yes'), no('No')],
  ['Samsung Email, Thunderbird', yes('Yes'), yes('Yes')],
], 'SVG support in email, from caniemail (linked files tested 16 September 2026; inline SVG last tested February 2020)')}
${p('The inline column has not been retested since 2020, so treat it as a strong hint rather than a fresh fact. Even so, no big webmail app showed inline SVG then, and nothing we found suggests that changed.')}
${art('m-svg-icons-in-email-clients', 'The same email in three inboxes: the SVG icons show, show as a PNG, or vanish.', { brief: 'Three simplified email windows side by side, each showing the same small newsletter footer with four with icons icons (phone, mail, globe, calendar in solid style). Window one, labelled "Apple Mail": icons crisp. Window two, labelled "Gmail": icons shown with a tiny "PNG" tag. Window three, labelled "Outlook 2016": empty boxes where the icons should be. Generic window chrome only, no real app logos.' })}

${h2('Why is PNG still the safe choice for email icons?')}
${p('A PNG is an ordinary picture made of pixels. Every email app on the list above shows it. With SVG you gain very little and risk a lot:')}
${ul([
  '<strong>Older Outlook shows nothing.</strong> Outlook for Windows 2007 to 2016 has no SVG support, and plenty of offices still run it. A missing icon in a “Call us” button is a real cost.',
  '<strong>Gmail converts it anyway.</strong> Gmail now turns your SVG into a PNG before showing it, so the main reason to use SVG (sharp at every size) is gone in the biggest inbox.',
  '<strong>Emails get forwarded.</strong> A reply or a forward from one app to another can drop images the second app does not understand.',
  '<strong>You cannot recolour it there.</strong> The website tricks that make SVG icons follow the text colour do not work in email, so an SVG offers no colour advantage.',
])}
${p(`So the rule is simple: PNG for anything people must see, SVG only as a bonus where you control the audience (for example, an internal email to a team that all uses Apple Mail). Our ${L.post('svg-vs-png-icons', 'SVG vs PNG guide')} explains the difference outside email.`)}

${h2('What size should icon PNGs be for retina screens?')}
${p('Most phones and many laptops have high-resolution screens that pack two or three real pixels into each pixel you design for. A 20 px PNG shown at 20 px looks soft there. The fix: save the image at least twice as big as it will appear, and tell the email how big to show it.')}
${table(['Where the icon goes', 'Shown at', 'Save the PNG at'], [
  ['Next to text in a signature', '16 to 20 px', '40 to 64 px'],
  ['Social icons in a footer', '24 to 32 px', '64 px'],
  ['Feature icons in a newsletter', '40 to 48 px', '96 to 128 px'],
  ['A big hero illustration', '96 px or more', '2x the display size (192 px and up)'],
], 'Email icon sizes: show small, save at 2x or more')}
${p('Set the display size with the <code>width</code> and <code>height</code> attributes on the image, not only with CSS. caniemail notes that Outlook for Windows does not support the CSS <code>width</code> property on images, so an icon sized only in CSS can show up at its full saved size there. Use pixel numbers, not percentages.')}
${code(`<a href="https://example.com/contact">
  <img src="https://example.com/email/phone-64.png"
       width="20" height="20" alt="Call us"
       style="display:block; border:0;">
</a>`)}
${p('Host the image on a public web address (your site, a CDN, or a shared file link). Two things that look tempting but fail: base64 data URIs (the image written as text inside the HTML), which caniemail shows Gmail does not display, and attaching the image, which some apps show as a paperclip attachment instead.')}
${sizeRamp(['phone', 'mail', 'globe', 'map-pin'], [16, 20, 24, 32], 'solid', 'Signature-sized icons at 16, 20, 24 and 32 px. Solid shapes hold up best this small.')}

${h2('How do dark mode inboxes change my icons?')}
${p('Dark mode is where email icons most often go wrong. Some apps let your email choose its own dark colours, some change the colours for you, and some do nothing. caniemail shows Apple Mail and Outlook.com honour a dark-mode style rule in the email (<code>prefers-color-scheme</code>), while Gmail and Outlook for Windows do not (last tested March 2023).')}
${p(`Because you cannot count on a swap, design icons that survive both backgrounds. A pure black icon on a see-through background disappears on a dark inbox; a pure white one disappears on a light inbox. Our ${L.post('dark-mode-icons', 'dark mode icons guide')} covers the colour side in depth.`)}
${doDont(
  '<p>Use a mid-tone brand colour that reads on white and on near-black, or bake the icon onto a small coloured circle or rounded square so it carries its own background. Test the email in a dark inbox before sending.</p>',
  '<p>Send black or very dark grey icons on a transparent background, or count on CSS to swap the icon colour in dark mode across every app.</p>'
)}
${art('m-svg-icons-in-email-dark-mode', 'Black icons vanish in a dark inbox. Mid-tone icons, or icons on a plate, survive both.', { brief: 'A split image: the left half is a light inbox, the right half a dark inbox, showing the same email footer row twice. Top row: black transparent PNG icons (phone, mail, globe, calendar in line style) that are clear on light but nearly invisible on dark, marked with a small x. Bottom row: the same icons in solid style, white on mid-blue circles, clear on both halves, marked with a check. Labels: "Black on transparent" and "Icon on a plate".' })}

${h2('What alt text should email icons have?')}
${p('Alt text is the short description an app shows (or reads aloud) when the picture is not displayed. In email that happens a lot: Microsoft’s support pages say classic Outlook blocks automatic picture downloads by default, so many readers see your alt text before your icons.')}
${ul([
  '<strong>Icon next to words</strong> (a phone icon before “+1 555 0100”): the text already says it, so use an empty <code>alt=""</code> and the reader skips the icon.',
  '<strong>Icon-only link</strong> (a social icon, a “call” button): describe where it goes, for example <code>alt="Our page on Instagram"</code> or <code>alt="Call us"</code>.',
  '<strong>Never leave alt out.</strong> Without it, some apps show the file name instead, and screen readers may read it out.',
])}
${p(`Our ${L.post('accessible-icons', 'guide to accessible icons')} explains labels for icons in general.`)}

${h2('How do I get email-ready PNG icons from with icons?')}
${p(`Every icon page has a PNG download where you pick the size and colour, so you get exactly the file an email needs. All ${N_ICONS} icons in all ${N_STYLES} styles work this way, free and MIT licensed.`)}
${steps([
  ['Pick your icons', `Search ${L.icons('the icon library')} for what you need, for example ${L.icon('phone')}, ${L.icon('mail')}, ${L.icon('globe')} and ${L.icon('map-pin')}. Stick to one style for the whole set; ${L.style('solid')} reads best at 16 to 20 px.`],
  ['Choose the colour', 'Set the colour you want in the email. Email apps cannot recolour it later, so pick the final shade now (or a background colour for a plate).'],
  ['Download a PNG at the right size', 'Choose PNG and set the size to the size it will show at, then turn on “@2x for sharp screens” to double the pixels. Or type a size directly, for example 64 px. The PNG set download gives you 1x to 4x in one ZIP.'],
  ['Host and insert', 'Upload the PNGs somewhere public, insert them with width, height and alt text, and send yourself a test in Gmail, Outlook and a phone.'],
])}
${iconGrid(['phone', 'mail', 'globe', 'map-pin', 'calendar', 'link', 'send', 'at-sign'], 'solid', 'A matching contact set for signatures and footers, all in the solid style.')}
${p(`Want movement? Icons with motion also download as GIF, which plays in most email apps. caniemail notes that Outlook for Windows 2007 to 2016 does not play animated GIFs (it is widely reported to show the first frame), so make sure that frame works on its own. For the plain-HTML side of icons on websites (where SVG is the right answer), see our ${L.guide('html', 'HTML guide')} and ${L.page('free/png-icons.html', 'free PNG icons')} page.`)}

${h2('The bottom line')}
${p(`SVG in email is no longer a flat “never”: Apple Mail, Yahoo and Outlook.com show it, and Gmail now shows a PNG copy of it. But older Outlook still shows nothing and inline SVG is stripped almost everywhere, so PNG remains the safe default. Save icons at twice their display size, set width and height in the HTML, choose colours that work in dark mode, and always add alt text. The ${L.guide('email-signatures', 'email signature guide')} takes you through the rest.`)}
${cta('Email-ready icons in any colour', `${N_ICONS} icons in ${N_STYLES} styles. Download PNGs at the exact size and colour your email needs, with a 2x switch for sharp screens. Free, MIT licensed.`, ['mail', 'phone', 'globe', 'calendar', 'send', 'heart'])}
`,
}
