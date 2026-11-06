import { p, h2, h3, ul, iconGrid, swapGrid, table, yes, no, meh, callout, doDont, code, steps, cta, art, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'icon-inside-input-field',
  category: 'code',
  date: '2026-11-06',
  hero: 'h-icon-inside-input-field',
  stickers: [['search', 'duo'], ['eye', 'solid'], ['lock', 'blueprint']],
  title: 'How do I put an icon inside an input field? The 2026 answer',
  cardTitle: 'An icon inside an input field',
  h1: 'How to put an icon <em>inside</em> an input field',
  dek: 'The most viewed answer online is from 2009 and uses a background GIF. Here is the version that works today: a small wrapper, an inline SVG you can recolour, and real buttons for icons that do something.',
  description: 'Put a search, mail or password icon inside an input with a wrapper, an inline SVG and padding. Plus show-password buttons, clear buttons, focus colours and RTL.',
  keywords: ['icon inside input field', 'search icon inside input css', 'icon in text field', 'password eye icon inside input', 'show password button', 'clear button inside input', 'input with icon tailwind', 'input icon rtl', 'pointer-events none svg'],
  about: ['HTML forms', 'Cascading Style Sheets', 'Scalable Vector Graphics', 'Web accessibility', 'with icons'],
  related: ['change-svg-icon-color-css', 'icon-button-size-and-labels', 'accessible-icons'],
  tldr: [
    '<strong>Wrap the input in a <code>position: relative</code> box, place an inline SVG on top with <code>position: absolute</code>, and add padding to the input</strong> so the text never runs under the icon.',
    '<strong>Add <code>pointer-events: none</code> to a decorative icon</strong> so clicks fall through to the field, and hide it from screen readers with <code>aria-hidden="true"</code>.',
    '<strong>An icon that does something is a real <code>&lt;button type="button"&gt;</code></strong> with a name, like “Show password” or “Clear search”, never a clickable picture.',
    'Use logical properties (<code>inset-inline-start</code>, <code>padding-inline-start</code>) so the icon moves to the right side in Arabic or Hebrew without extra CSS.',
    'Skip the old <code>background-image</code> trick for icons you want to theme: an image in a background cannot follow <code>currentColor</code>, so it will not change colour on focus or in dark mode.',
  ],
  faq: [
    { q: 'Can I put an icon inside an input with ::before?', a: 'No. An <code>&lt;input&gt;</code> is a “void” element: it has no inside, so <code>::before</code> and <code>::after</code> do not show on it. Put the pseudo-element (or the SVG) on a wrapper around the input instead.' },
    { q: 'How do I make the search icon clickable?', a: 'Decide what the click should do. If it should only focus the field, keep the icon decorative with <code>pointer-events: none</code>, so the click lands on the input underneath. If it should submit the search, make it a real <code>&lt;button type="submit" aria-label="Search"&gt;</code> with the icon inside.' },
    { q: 'How do I add a show password eye icon?', a: 'Put a <code>&lt;button type="button"&gt;</code> next to the password input, inside the same wrapper. Give it a name such as “Show password”, and on click switch the input between <code>type="password"</code> and <code>type="text"</code> while setting <code>aria-pressed</code> to true or false. Swap the eye for an eye-off icon to show the state.' },
    { q: 'How do I put an icon on the right side of an input?', a: 'Use <code>inset-inline-end</code> on the icon and <code>padding-inline-end</code> on the input. In left-to-right languages that is the right side; in right-to-left pages it flips to the left automatically.' },
    { q: 'Why does my icon not change colour when the input is focused?', a: 'Two usual reasons. The icon is a background image, which cannot follow CSS colour, or the colour rule targets the input, which the icon does not inherit from. Use an inline SVG drawn with <code>currentColor</code> and colour it from the wrapper with <code>.field:focus-within .icon { color: … }</code>.' },
    { q: 'How do I do this in Tailwind?', a: 'The same idea with utility classes: a <code>relative</code> wrapper, an icon with <code>absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none</code>, and <code>ps-10</code> on the input. The <code>start-*</code> and <code>ps-*</code> utilities are the logical, RTL-friendly versions.' },
  ],
  sources: [
    { title: 'Stack Overflow: Put icon inside input element in a form (question 917610, accepted answer from 2009)', url: 'https://stackoverflow.com/questions/917610/put-icon-inside-input-element-in-a-form' },
    { title: 'MDN: &lt;input type="search"&gt; (labels, the browser clear button), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/search' },
    { title: 'MDN: the &lt;search&gt; element (Baseline since October 2023), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/search' },
    { title: 'MDN: :focus-within (Baseline since January 2020), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-within' },
    { title: 'MDN: padding-inline-start (Baseline since January 2020), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-inline-start' },
    { title: 'MDN: inset-inline-start (Baseline since April 2021), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/inset-inline-start' },
    { title: 'GOV.UK Design System: Password input (show button, autocomplete, spellcheck), checked November 2026', url: 'https://design-system.service.gov.uk/components/password-input/' },
    { title: 'Eric Lawrence: Revealing Passwords (the Edge reveal button and ::-ms-reveal), July 2020', url: 'https://textslashplain.com/2020/07/29/revealing-passwords/' },
    { title: 'with icons: @withicons/motion README (swap icons that follow aria-pressed), checked November 2026', url: 'https://www.npmjs.com/package/@withicons/motion' },
  ],
  body: () => `
${p(`<span class="lede">To put an icon inside an input field, wrap the input in a box with <code>position: relative</code>, place an inline SVG icon on top of it with <code>position: absolute</code>, and give the input enough padding on that side so the text starts after the icon. Add <code>pointer-events: none</code> so clicks on the icon reach the field. If the icon does something, like showing a password or clearing a search, make it a real button instead.</span>`)}
${p(`The answer most people find first, a Stack Overflow thread with over a million views, was written in 2009: a GIF as a background image, plus notes on Internet Explorer 6. It skips what matters now: recolouring, focus states, right-to-left languages and buttons screen readers can use. Below is the version we would ship today, checked against MDN and the GOV.UK Design System in November 2026.`)}
${iconGrid(['search', 'mail', 'lock', 'eye', 'eye-off', 'close', 'calendar', 'at-sign'], 'line', 'The usual suspects inside form fields: search, email, password, show and hide, clear, date and username. Each one links to its icon page.')}

${h2('How do I put an icon inside an input field?')}
${p('Think of it as two layers. The input is the bottom layer and fills the box. The icon is a small sticker placed on top, near one edge. The padding is a polite “keep out” zone, so typed text does not slide under the sticker.')}
${art('m-icon-inside-input-field-anatomy', 'Three layers: the wrapper holds the position, the input reserves space with padding, and the icon sits on top and lets clicks pass through.', { brief: 'An exploded, slightly isometric diagram of one search field pulled apart into three stacked layers. Bottom: the wrapper box labelled “.field { position: relative }”. Middle: the input with a shaded padding strip on its left labelled “padding-inline-start: 40px”. Top: the with icons search icon in line style labelled “position: absolute + pointer-events: none”, with a small cursor arrow passing straight through it to the input. Clean blueprint-like lines, short labels only.' })}
${p('Here is a complete, copy-ready version. The icon is drawn with <code>stroke="currentColor"</code>, so it takes its colour from CSS like text does. Any icon from our set works, because every with icons drawing paints its lines with <code>currentColor</code>.')}
${code(`<search>
  <div class="field">
    <svg class="field__icon" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="1.75">…search icon…</svg>
    <input type="search" name="q" aria-label="Search icons" placeholder="Search icons">
  </div>
</search>`)}
${code(`.field { position: relative; }

.field__icon {
  position: absolute;
  inset-inline-start: 12px;        /* left in English, right in Arabic */
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;            /* clicks go to the input */
  color: #6b7280;
}

.field input {
  width: 100%;
  padding-block: 10px;
  padding-inline: 40px 12px;       /* room for the icon at the start */
}

.field:focus-within .field__icon { color: #2f5bff; }`, 'css')}
${p('Four small details do the heavy lifting:')}
${ul([
  '<strong><code>aria-hidden="true"</code></strong> on the SVG. The magnifying glass is decoration: the field already has a name (“Search icons”), so a screen reader should not also announce a picture.',
  '<strong><code>pointer-events: none</code></strong>. Without it, a click right on the icon hits the picture, not the field, and nothing happens. With it, the click falls through and the cursor appears.',
  '<strong>The padding matches the icon.</strong> 12 px gap + 20 px icon + 8 px breathing room = 40 px. Change one, change the other.',
  '<strong><code>:focus-within</code> on the wrapper</strong> recolours the icon while the field is selected. It has worked in every major browser since January 2020.',
])}

${h2('Why not use a background image, like the old answer?')}
${p(`The 2009 answer sets the icon as the input’s <code>background-image</code> and pads the text. It is short, and for a fixed grey icon on a fixed white field it is fine. The catch is colour: an image in a background is a finished picture. Your page’s CSS cannot reach into it, so it cannot follow <code>currentColor</code>. It stays the same grey when the field is focused, when it shows an error, and in dark mode, where a dark icon on a dark field quietly disappears. Our post on how to ${L.post('change-svg-icon-color-css', 'change an SVG icon’s colour with CSS')} explains why in more detail.`)}
${art('m-icon-inside-input-field-dark-mode', 'Same field, light and dark: the background-image icon stays dark grey and vanishes, the inline SVG follows the text colour.', { brief: 'A two-by-two before/after grid. Columns: “background-image” and “inline SVG + currentColor”. Rows: light theme and dark theme. Each cell shows the same rounded search field with the with icons search icon in line style and the placeholder “Search icons”. In the dark row, the background-image icon is dark grey on near-black and barely visible, marked with a small x; the inline SVG icon is light and clear, marked with a tick. Short labels only.' })}
${p(`Another old suggestion was an icon font pseudo-element on the input. That never worked: an <code>&lt;input&gt;</code> is a “void” element, which means it has no inside, so <code>::before</code> and <code>::after</code> do not appear on it. If you love the no-extra-markup style, put the pseudo-element on the wrapper and draw it with a CSS mask, which does follow <code>currentColor</code>. We cover that in ${L.post('svg-icons-in-css', 'how to use SVG icons in CSS')}.`)}
${table(['Approach', 'Recolours with CSS', 'Can become a button', 'No extra markup'], [
  ['Inline SVG on a wrapper', yes('currentColor'), yes('wrap it in one'), meh('a wrapper + the SVG')],
  ['CSS mask on the wrapper (::before)', yes('via background-color'), no(), meh('a wrapper')],
  ['background-image on the input', no('colours are fixed'), no(), yes()],
  ['Icon font ::before on the input', no('it never shows'), no(), yes()],
], 'Ways to put an icon inside a field, as of November 2026')}

${h2('How do I add a search icon inside a search box?')}
${p('Use the recipe above with three extras that the old answers never mention:')}
${steps([
  ['Wrap it in <code>&lt;search&gt;</code>', 'The <code>&lt;search&gt;</code> element tells screen readers “this is the search area”. It has been Baseline (working in every major browser) since October 2023. Inside a form, <code>role="search"</code> on the form does the same.'],
  ['Give the field a name', 'Placeholder text is not a label: it vanishes as soon as someone types. Use a visible <code>&lt;label&gt;</code>, or <code>aria-label</code> when the design has no room, as MDN suggests for search fields.'],
  ['Decide if the icon is a button', 'A magnifier at the start is usually decoration. A magnifier at the end that runs the search is a submit button: <code>&lt;button type="submit" aria-label="Search"&gt;</code> with the icon inside.'],
])}
${p(`Prefer a component to pasting SVG code? With ${L.page('free/icons-for-react.html', 'our React icons')} it is <code>&lt;Search size={20} className="field__icon" /&gt;</code>. Our components and the <code>&lt;with-icon&gt;</code> web component are hidden from screen readers by default, so you do not need to add <code>aria-hidden</code> yourself. The ${L.guide('html', 'HTML guide')} shows the no-build options.`)}

${h2('How do I add a show password eye icon?')}
${p('This is where copied snippets go wrong. People click the eye, so it must be a real <code>&lt;button&gt;</code>. A clickable <code>&lt;span&gt;</code> or SVG cannot be reached with the Tab key and has no name.')}
${code(`<label for="pw">Password</label>
<div class="field">
  <input id="pw" type="password" autocomplete="current-password" spellcheck="false">
  <button type="button" class="field__btn" aria-controls="pw"
          aria-pressed="false" aria-label="Show password">
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">…eye icon…</svg>
  </button>
</div>

<script>
  const pw = document.getElementById('pw')
  const btn = pw.nextElementSibling
  btn.addEventListener('click', () => {
    const show = pw.type === 'password'
    pw.type = show ? 'text' : 'password'
    btn.setAttribute('aria-pressed', show)
  })
</script>`)}
${code(`.field__btn {
  position: absolute;
  inset-inline-end: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px; height: 40px;           /* a comfortable hit area */
  display: grid; place-items: center;
  border: 0; border-radius: 8px;
  background: none; color: inherit;
}
.field__btn:focus-visible { outline: 2px solid #2f5bff; }
.field:has(.field__btn) input { padding-inline-end: 48px; }`, 'css')}
${p('The name stays “Show password” and <code>aria-pressed</code> says whether it is on, which is the standard pattern for a toggle button. The GOV.UK Design System also suggests <code>autocomplete="current-password"</code> (or <code>new-password</code> on sign-up) and <code>spellcheck="false"</code>, so the browser does not offer to “correct” a password. The button is 40 px square even though the icon is 20 px: how big a hit area should be is its own question, answered in our post on ' + L.post('icon-button-size-and-labels', 'icon button sizes and labels') + '.')}
${p(`To show the state, swap the ${L.icon('eye')} icon for ${L.icon('eye-off')}. With <code>@withicons/motion</code> you do not need any extra script: put both icons in a <code>wm-swap</code> wrapper inside the button, and the second one shows whenever the button has <code>aria-pressed="true"</code>. Try the two below.`)}
${swapGrid([['eye', 'eye-off'], ['search', 'close']], 'line', 'Tap or click to switch. The eye draws a line through itself; the search glass turns into a clear button. Both follow the button’s state.')}
${callout('note', '<p>Microsoft Edge adds its own reveal button to password fields. If you build your own, hide Edge’s with <code>input::-ms-reveal { display: none; }</code> so people do not see two eyes. Password managers and screen readers can also show passwords on their own, which is one more reason to keep your button’s state in <code>aria-pressed</code> rather than in the icon alone.</p>', 'Two eyes in Edge?')}

${h2('How do I add a clear (X) button inside an input?')}
${p('Some browsers, Chrome among them, already add a small clear cross to <code>type="search"</code> fields, and in Chrome the Escape key clears the text too, as MDN notes. If that is enough, you are done. If you want your own (to match your icons, or to show it on other fields), it is the same pattern as the eye:')}
${ul([
  'A <code>&lt;button type="button" aria-label="Clear search"&gt;</code> at the end of the field, with the ' + L.icon('close') + ' icon inside and <code>aria-hidden</code> on the SVG.',
  'On click, empty the input <strong>and move focus back to it</strong>, so the person can type again straight away.',
  'Hide the button while the field is empty, for example with <code>.field:has(input:placeholder-shown) .field__btn { display: none; }</code>.',
])}

${h2('Does an icon inside an input work in right-to-left languages?')}
${p('It does if you use logical properties. <code>inset-inline-start</code> and <code>padding-inline-start</code> mean “the side where text starts”: the left in English, the right in Arabic, Hebrew or Persian. Old answers use <code>left</code> and <code>padding-left</code>, which leave the icon stuck on the wrong side and the text overlapping it. Both logical properties have been Baseline for years (since January 2020 and April 2021).')}
${p('Should the icon itself flip? A magnifier, envelope or lock should not; an arrow on a “go” button usually should. Our packages leave icons alone unless you opt in with <code>mirror-rtl</code> on <code>&lt;with-icon&gt;</code> or the <code>with-rtl</code> class.')}
${doDont('<p>Use <code>inset-inline-start</code> and <code>padding-inline-start</code>, test the field with <code>dir="rtl"</code> on the page, and mirror only icons that point a direction.</p>', '<p>Hard-code <code>left: 12px</code> and <code>padding-left</code>, or mirror every icon in RTL. A backwards magnifying glass looks like a typo.</p>')}

${h2('How do I style the icon for focus, errors and dark mode?')}
${p('Because the icon paints with <code>currentColor</code>, every state is one line of CSS on the wrapper. Pick colours with enough contrast: a grey icon that hints at the field’s purpose should still be easy to see against the field.')}
${code(`.field:focus-within .field__icon { color: var(--accent); }
.field:has(input[aria-invalid="true"]) .field__icon { color: var(--danger); }
@media (prefers-color-scheme: dark) { .field__icon { color: #9ca3af; } }`, 'css')}
${p(`For a filled active state, swap the ${L.style('line')} icon for its ${L.style('solid')} twin on focus. Stay with the everyday styles in fields: the creative ones are made for illustrations. Our ${L.post('accessible-icons', 'accessible icons guide')} covers contrast in plain words.`)}

${callout('note', '<p>Inline SVG replaced background GIFs and icon fonts, so icons recolour and stay sharp. Logical properties made RTL free. <code>:focus-within</code> and <code>:has()</code> let the wrapper react without JavaScript. <code>&lt;search&gt;</code> (Baseline since October 2023) gives search a landmark. And clickable icons are now expected to be real, named buttons.</p>', 'What changed since the old answers')}
${p(`Need icons for your form? Every icon page on ${L.icons('with icons')} has Copy SVG code, an SVG download and React, Vue, Svelte and HTML snippets, and ${L.page('free/svg-icons.html', 'all the SVG icons')} are free under MIT with no attribution.`)}
${cta('Form icons that follow your CSS', `${N_ICONS} free icons in ${N_STYLES} styles, all drawn with currentColor. Copy the SVG, or use the React, Vue or web component packages.`, ['search', 'mail', 'lock', 'eye', 'calendar', 'close'])}
`,
}
