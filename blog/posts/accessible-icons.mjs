import { p, h2, h3, ul, figure, iconGrid, sizeRamp, table, yes, no, meh, callout, steps, stats, doDont, code, cta, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'accessible-icons',
  category: 'basics',
  date: '2026-10-02',
  hero: 'a11y0',
  stickers: [['eye', 'duo'], ['check-circle', 'solid'], ['heart', 'gloss']],
  title: 'Accessible icons: a friendly guide to icons everyone can understand',
  cardTitle: 'Accessible icons, made simple',
  h1: 'Accessible icons: a friendly guide to icons <em>everyone</em> can understand',
  dek: 'Icons should help people, not puzzle them. Here are the simple habits that make icons work for everyone, including people who use screen readers, see colours differently or tap with shaky hands.',
  description: 'A friendly guide to accessible icons: text labels, names for icon-only buttons, decorative icons, 3:1 contrast, tap target sizes and not relying on colour alone.',
  keywords: ['accessible icons', 'icon accessibility', 'aria-label icon button', 'icon contrast WCAG', 'touch target size', 'decorative icons screen reader'],
  about: ['Web accessibility', 'Web Content Accessibility Guidelines', 'Icons'],
  related: ['choosing-the-right-icon', 'icon-sizes-guide', 'consistent-icons'],
  tldr: [
    '<strong>Add a text label</strong> next to icons whenever you can. Only a few icons, like home, print and search, are understood by almost everyone.',
    '<strong>Icon-only buttons need a name.</strong> Screen readers cannot see the picture, so give the button a hidden label such as “Search” (on the web, with <code>aria-label</code>).',
    '<strong>Hide decorative icons</strong> from screen readers when the text next to them already says the same thing.',
    '<strong>Contrast and size:</strong> meaningful icons need at least 3:1 contrast with their background (WCAG 1.4.11), and tap targets should be at least 24 by 24 px (WCAG 2.5.8), ideally 44 or more.',
    '<strong>Never rely on colour alone.</strong> Use different shapes and words, not just red and green.',
  ],
  faq: [
    { q: 'Do icons need alt text?', a: 'It depends on the job. If an icon sits next to a word that says the same thing, hide it from screen readers (mark it as decorative). If the icon is the only way to understand something, like an icon-only button or a status icon, it needs a short text name.' },
    { q: 'What is aria-label?', a: 'It is a small piece of HTML that gives an element a name that screen readers read out loud, without showing it on screen. It is most useful for icon-only buttons, for example a magnifying glass button named “Search”. Visible text is still better when you have room for it.' },
    { q: 'What contrast ratio do icons need?', a: 'Under WCAG 2.2 success criterion 1.4.11 (level AA), icons that people need to understand should have a contrast ratio of at least 3:1 against the colours next to them. Purely decorative icons and disabled controls are not covered.' },
    { q: 'How big should an icon button be?', a: 'WCAG 2.2 asks for tap targets of at least 24 by 24 CSS pixels (or enough space around smaller ones). Apple recommends 44 by 44 points on iPhone and Google recommends 48 by 48 dp on Android. The icon itself can stay 24 px; padding makes the button bigger.' },
    { q: 'Are icons bad for accessibility?', a: 'No. Icons help many people, including people who read slowly or speak another language. They only cause problems when they are unlabelled, too faint, too small, or used as the only way to show meaning.' },
  ],
  sources: [
    { title: 'W3C: Understanding SC 1.1.1 Non-text Content', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html' },
    { title: 'W3C: Understanding SC 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html' },
    { title: 'W3C: Understanding SC 1.4.11 Non-text Contrast', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html' },
    { title: 'W3C: Understanding SC 2.5.3 Label in Name', url: 'https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html' },
    { title: 'W3C: Understanding SC 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html' },
    { title: 'W3C: Understanding SC 2.5.5 Target Size (Enhanced)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html' },
    { title: 'MDN: aria-label', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label' },
    { title: 'Nielsen Norman Group: Icon Usability', url: 'https://www.nngroup.com/articles/icon-usability/' },
    { title: 'Apple Human Interface Guidelines: Accessibility', url: 'https://developer.apple.com/design/human-interface-guidelines/accessibility' },
    { title: 'Android Developers: Make apps more accessible', url: 'https://developer.android.com/guide/topics/ui/accessibility/apps' },
    { title: 'Microsoft Support: Add alternative text (Mark as decorative)', url: 'https://support.microsoft.com/en-us/accessibility/office-accessibility/add-alternative-text-to-a-shape-picture-chart-smartart-graphic-or-other-object' },
    { title: 'Colour Blind Awareness: Colour blindness', url: 'https://www.colourblindawareness.org/colour-blindness/' },
  ],
  body: () => `
${p(`<span class="lede">An accessible icon is one that everybody can understand and use: people who use screen readers, people with low vision, people who see colours differently, and people who tap with a shaky thumb on a bumpy bus. The good news is that it mostly comes down to five friendly habits.</span>`)}
${p('Here they are: put a word next to the icon when you can, give icon-only buttons a name, hide purely decorative icons from screen readers, make icons dark enough to see (at least 3:1 contrast), and make buttons big enough to tap (at least 24 by 24 pixels, ideally 44). This guide explains each one gently, with examples, and almost no code.')}
${stats([['3:1', 'minimum contrast for meaningful icons'], ['24 px', 'minimum tap target (WCAG 2.2)'], ['44 pt', 'Apple’s default button size'], ['1 in 12', 'men have a colour vision deficiency']])}

${h2('Who are accessible icons for?')}
${p('More people than you might think. Accessibility is often pictured as a small group, but icons touch all of these:')}
${ul([
  '<strong>Screen reader users.</strong> A screen reader is software that reads the screen out loud (or on a braille display). It cannot “see” a picture, so it needs words.',
  '<strong>People with low vision.</strong> Faint grey icons and tiny buttons are hard to make out.',
  '<strong>People who see colours differently.</strong> Colour vision deficiency affects about 1 in 12 men and 1 in 200 women, according to Colour Blind Awareness.',
  '<strong>People with motor difficulties,</strong> and anyone using a phone one-handed, in the cold or on the move. Small targets mean wrong taps.',
  '<strong>People new to your product</strong>, or reading in a second language, who simply do not know what your icons mean yet.',
])}
${figure('a11y3', 'Accessibility is about people, not rules. The rules just help you remember what people need.')}

${h2('Should icons have text labels?')}
${p('Yes, whenever you have room. Researchers at Nielsen Norman Group found that only a handful of icons, such as home, print and the magnifying glass for search, are understood by almost everyone. Their advice is to keep icon labels visible at all times, not hidden behind a hover.')}
${p('Try it yourself. What does each of these icons do?')}
${iconGrid(['star', 'heart', 'bookmark', 'flag', 'pin', 'tag'], 'line', 'Favourite? Save? Rate? Report? Each app uses these differently. A one-word label removes the guesswork.')}
${p(`A star could mean “favourite”, “rate” or “featured”. A flag could mean “report” or “mark as important”. A label like “Save” turns a puzzle into an instruction. For help picking icons that people read correctly, see ${L.post('choosing-the-right-icon', 'how to choose the right icon')}.`)}

${h2('How do you make an icon-only button accessible?')}
${p('Sometimes there is no room for a word, like the search button in a busy header or the close “X” on a pop-up. That is fine, but the button still needs a <strong>name</strong>: a short word that a screen reader can say, such as “Search” or “Close”. Without it, a screen reader user may just hear “button” and have to guess.')}
${p('On a website, the usual way to add a hidden name is <code>aria-label</code>. It is an extra attribute on the button that screen readers read out but sighted visitors do not see. The icon inside is then marked as hidden (<code>aria-hidden="true"</code>), so it is not announced twice. It looks like this:')}
${code(`<button type="button" aria-label="Search">
  <svg aria-hidden="true" focusable="false" width="24" height="24">…</svg>
</button>`)}
${p('A few gentle tips for writing the name:')}
${ul([
  'Describe what the button <strong>does</strong>, not what it looks like: “Search”, not “magnifying glass”.',
  'Keep it short and do not add the word “button”. Screen readers already say that.',
  'If the button has a tooltip, use the same words, so everyone hears and sees the same thing.',
])}
${callout('note', 'Not a developer? Website builders like WordPress, Webflow and Wix usually have a field for this on buttons and images, often called “label”, “ARIA label” or “alt text”. If you can, add a visible word instead: it helps everyone, not only screen reader users.')}

${h2('What is the difference between decorative and meaningful icons?')}
${p('A <strong>decorative</strong> icon adds looks but no new information, because the text next to it already says the same thing. A <strong>meaningful</strong> icon carries information that is not written anywhere else. The W3C rules (WCAG 1.1.1) ask for decorative images to be hidden from screen readers and meaningful ones to have a text alternative.')}
${table(['Example', 'Type', 'What to do'], [
  ['A gear icon next to the word “Settings”', 'Decorative', 'Hide it from screen readers. The word does the job.'],
  ['A magnifying glass button with no text', 'Meaningful', 'Give the button a name: “Search”.'],
  ['A red warning triangle beside a form field, with no message', 'Meaningful', 'Add a text message, like “Email is required”.'],
  ['Feature icons above headings on a slide', 'Decorative', 'Mark as decorative (PowerPoint and Word have a checkbox for it).'],
  ['A row of stars showing a 4 out of 5 rating', 'Meaningful', 'Add text such as “Rated 4 out of 5”.'],
], 'Decorative or meaningful? Five everyday examples')}
${p(`In PowerPoint, Word and Excel, open the Alt Text pane and tick <strong>Mark as decorative</strong> for icons that only decorate. The ${L.icons('with icons')} code components (on npm as <code>@withicons/react</code>, <code>@withicons/vue</code> and more) hide icons from screen readers by default, and you add a title only when an icon stands alone and carries meaning.`)}

${h2('How much contrast do icons need?')}
${p('Contrast is how much an icon stands out from its background, written as a ratio. 1:1 means no difference at all (white on white). 21:1 is the maximum (black on white). The W3C success criterion <strong>1.4.11 Non-text Contrast</strong> (level AA) says that graphics people need to understand, including meaningful icons, should reach at least <strong>3:1</strong> against the colours next to them.')}
${table(['Grey on white', 'Contrast ratio', 'OK for a meaningful icon?'], [
  ['#767676 (medium grey)', '4.5:1', yes('Yes')],
  ['#949494 (light-medium grey)', '3.0:1', meh('Just passes')],
  ['#AAAAAA (light grey)', '2.3:1', no('No')],
  ['#CCCCCC (very light grey)', '1.6:1', no('No')],
], 'Contrast of common greys on a white background (we calculated these with the WCAG formula)')}
${p('Two practical notes. First, disabled buttons and purely decorative icons are not covered by this rule. Second, thin line icons look lighter than their colour suggests, because so little of the icon is actually “ink”. If a line icon looks faint, make it darker or switch to the solid style.')}
${sizeRamp(['alert-triangle', 'check-circle', 'info-circle'], [16, 20, 24, 32], 'solid', 'Solid icons hold their shape and contrast at small sizes, which makes them a good choice for small status icons.')}

${h2('How big should icon buttons be?')}
${p('Big enough to hit without aiming carefully. Here is what the main guidelines say:')}
${ul([
  '<strong>WCAG 2.2, criterion 2.5.8 (level AA):</strong> targets should be at least <strong>24 by 24 CSS pixels</strong>, or have enough empty space around them.',
  '<strong>WCAG 2.2, criterion 2.5.5 (level AAA):</strong> the stricter goal is <strong>44 by 44 CSS pixels</strong>.',
  '<strong>Apple:</strong> a default control size of <strong>44 by 44 points</strong> on iPhone and iPad.',
  '<strong>Google (Android):</strong> touch targets of at least <strong>48 by 48 dp</strong>.',
])}
${p(`The trick is that the <em>icon</em> does not need to grow. A 24 px icon can sit inside a 44 px button, with padding doing the work. That keeps your design neat and your buttons easy to tap. Our ${L.post('icon-sizes-guide', 'icon sizes guide')} has more on picking sizes.`)}
${callout('tip', 'Leave space between small icon buttons, too. Two 24 px buttons pressed right against each other are easy to mix up, especially on a phone.')}

${h2('Why should you never rely on an icon or colour alone?')}
${p('WCAG criterion <strong>1.4.1 Use of Color</strong> (level A) says colour must not be the only way to show information. A green dot for “online” and a red dot for “offline” look identical to many people with colour vision deficiency. The fix is easy: use different <strong>shapes</strong> and add a <strong>word</strong>.')}
${iconGrid(['check-circle', 'alert-triangle', 'x-circle', 'info-circle'], 'solid', 'Success, warning, error and info: four different shapes, so they still work in black and white. Add a word like “Saved” or “Error” too.')}
${p('The same goes for icons on their own. An icon in a form error is a nice extra, but the message (“Please enter your email”) is what actually helps. Treat icons as a helper for text, not a replacement.')}

${h2('How do screen readers handle icons?')}
${p('A screen reader goes through the page and reads out text, buttons, links and images. What it says for an icon depends on how the icon was added:')}
${ul([
  '<strong>Hidden icon:</strong> skipped completely. Perfect for decorative icons next to text.',
  '<strong>Icon with a name:</strong> read out by its name, like “Search, button”. Perfect for icon-only buttons.',
  '<strong>Icon with no name and not hidden:</strong> it might be skipped, read as “image” or “graphic”, or read as a file name, depending on the screen reader and browser. This is the case to avoid.',
])}
${p('Icon fonts can add one more surprise: since each icon is secretly a text character, some setups read out a strange symbol. SVG icons, like the ones in with icons, avoid this.')}

${h2('A quick accessible icons checklist')}
${steps([
  ['Label it', 'Put a visible word next to the icon wherever there is room.'],
  ['Name icon-only buttons', 'Give every icon-only button a short name that says what it does.'],
  ['Hide the decoration', 'Mark decorative icons as hidden or decorative so they are not read twice.'],
  ['Check contrast', 'Meaningful icons need at least 3:1 against their background. Darken faint greys.'],
  ['Make targets big', 'At least 24 by 24 px, ideally 44 px or more on touch screens, with space between.'],
  ['Do not rely on colour', 'Use different shapes and words for success, warning and error.'],
])}
${doDont('<p>Pair a clear icon with a short word, keep it dark enough to see, and wrap it in a button that is easy to tap.</p>', '<p>Use a pale grey, icon-only button with no name, and show errors only by turning something red.</p>')}

${h2('The bottom line')}
${p(`Accessible icons are not harder to make, just more thoughtful. Labels, names, contrast and size help everyone, not only people with disabilities. Pick icons that are clear on their own, then add the words that remove any doubt. Every icon in ${L.icons('with icons')} is a clean SVG, so it is easy to label, hide or recolour for good contrast.`)}
${cta('Find clear, simple icons', `${N_ICONS} everyday icons in ${N_STYLES} styles, with search that understands normal words. Free and MIT licensed.`, ['eye', 'check-circle', 'info-circle', 'search', 'heart', 'smile'])}
`,
}
