import { p, h2, h3, ul, iconGrid, sizeRamp, table, yes, no, meh, callout, doDont, code, cta, art, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'icon-button-size-and-labels',
  category: 'code',
  date: '2026-11-06',
  hero: 'h-icon-button-size-and-labels',
  stickers: [['settings', 'solid'], ['menu', 'duo'], ['ruler', 'blueprint']],
  title: 'How big should an icon button be, and how do I label it?',
  cardTitle: 'Icon button size and labels',
  h1: 'How big should an icon button be, and <em>how do I label it</em>?',
  dek: '“44 px is the WCAG rule” is the answer you will see most, and it is not quite right. Here are the real numbers from WCAG 2.2, Apple and Android, plus the markup that gives an icon-only button a name and keeps clicks on the button.',
  description: 'Icon button sizes for 2026: WCAG 2.2 AA asks 24 x 24 px, AAA 44, Apple 44 pt, Android 48 dp. Plus aria-label vs hidden text, aria-hidden SVGs and event.target.',
  keywords: ['icon button size', 'touch target size', 'minimum tap target size', 'wcag 2.5.8 target size', '44px or 48px tap target', 'icon only button aria-label', 'aria-label vs title', 'svg aria-hidden button', 'event.target svg instead of button', 'pointer-events none svg'],
  about: ['Web Content Accessibility Guidelines', 'Touch target', 'WAI-ARIA', 'Human interface guidelines', 'with icons'],
  related: ['accessible-icons', 'icon-sizes-guide', 'icon-inside-input-field'],
  tldr: [
    '<strong>Keep the icon small (16 to 24 px) and make the button bigger with padding.</strong> The hit area is what counts, not the drawing.',
    '<strong>WCAG 2.2 level AA (criterion 2.5.8) asks for 24 by 24 CSS pixels</strong>, or enough space around a smaller target. 44 by 44 is the stricter AAA goal (2.5.5), not the everyday rule.',
    '<strong>Platforms ask for more on touch:</strong> Apple’s default control size is 44 by 44 points on iPhone and iPad, and Android recommends at least 48 by 48 dp. Use 44 px or more for touch on the web.',
    '<strong>Name the button, hide the icon.</strong> Put <code>aria-label="Close"</code> (or visually hidden text) on the <code>&lt;button&gt;</code> and <code>aria-hidden="true"</code> on the SVG. A <code>title</code> tooltip is not a label.',
    'If <code>event.target</code> is the SVG instead of your button, read <code>event.currentTarget</code>, or add <code>svg { pointer-events: none }</code> inside buttons.',
  ],
  faq: [
    { q: 'Is 44 px the WCAG minimum for touch targets?', a: 'No. 44 by 44 CSS pixels is criterion 2.5.5, which is level AAA, the strictest tier. At level AA, the level most accessibility policies aim for, WCAG 2.2 added 2.5.8: at least 24 by 24 CSS pixels, or small targets spaced so a 24 px circle around each one does not touch another target.' },
    { q: 'Should I use 44 or 48 for tap targets?', a: 'Follow the platform. Apple’s Human Interface Guidelines give 44 by 44 points as the default control size on iPhone and iPad. Android recommends at least 48 by 48 dp. On the web, 44 CSS px is a sound default for touch, and 24 is the AA floor for dense desktop toolbars.' },
    { q: 'Does the icon have to be 44 px?', a: 'No. The icon can stay 20 or 24 px. The button around it is what people tap, so give the button padding or a minimum width and height. Big icons in small spaces look heavy; small icons in comfortable buttons look tidy and are easy to hit.' },
    { q: 'aria-label or visually hidden text: which is better?', a: 'Both give the button a name screen readers read out. Visually hidden text is real page text, so it is picked up by translation tools and shows when CSS fails; aria-label is shorter to write. Browser translation of aria-label is still patchy: in Adrian Roselli’s July 2025 retests, no browser translated an aria-label that changed after the page loaded. On multilingual sites, prefer hidden text.' },
    { q: 'Do I still need focusable="false" on SVG icons?', a: 'Only if you still support Internet Explorer 11 or the old pre-Chromium Edge, which could put inline SVGs in the Tab order. Modern browsers do not. It is harmless, which is why it is still copied into examples, including MDN’s.' },
    { q: 'Why is event.target my SVG and not the button?', a: 'Because the click landed on the icon inside the button, and the event bubbled up to your listener. <code>event.target</code> is where the click happened; <code>event.currentTarget</code> is the element your listener is on. Use <code>currentTarget</code>, or <code>event.target.closest(\'button\')</code> when one listener handles many buttons.' },
  ],
  sources: [
    { title: 'W3C: Understanding WCAG 2.2 SC 2.5.8 Target Size (Minimum), Level AA, checked November 2026', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html' },
    { title: 'W3C: Understanding WCAG 2.2 SC 2.5.5 Target Size (Enhanced), Level AAA, checked November 2026', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html' },
    { title: 'W3C: Web Content Accessibility Guidelines (WCAG) 2.2, Recommendation of October 2023', url: 'https://www.w3.org/TR/WCAG22/' },
    { title: 'Apple Human Interface Guidelines: Accessibility (default and minimum control sizes), checked November 2026', url: 'https://developer.apple.com/design/human-interface-guidelines/accessibility' },
    { title: 'Android Developers: Make apps more accessible (48dp touch targets), checked November 2026', url: 'https://developer.android.com/guide/topics/ui/accessibility/apps' },
    { title: 'Android Accessibility Help: Touch target size (48dp, about 9 mm), checked November 2026', url: 'https://support.google.com/accessibility/android/answer/7101858' },
    { title: 'MDN: aria-label (prefer visible text and aria-labelledby), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label' },
    { title: 'MDN: the title attribute (accessibility concerns), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/title' },
    { title: 'W3C: Understanding SC 2.5.3 Label in Name, checked November 2026', url: 'https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html' },
    { title: 'Adrian Roselli: aria-label Does Not Translate (2019, updated 2025)', url: 'https://adrianroselli.com/2019/11/aria-label-does-not-translate.html' },
    { title: 'MDN: Event.currentTarget, checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget' },
    { title: 'Stack Overflow: Click event on button is sending an icon as the target? (question 22962386)', url: 'https://stackoverflow.com/questions/22962386/click-event-on-button-is-sending-an-icon-as-the-target' },
  ],
  body: () => `
${p(`<span class="lede">An icon button should be at least 24 by 24 CSS pixels to meet WCAG 2.2 level AA, and 44 by 44 or more on touch screens, which matches Apple’s default control size (44 points) and sits close to Android’s 48 dp. The icon inside can stay 16 to 24 px: padding makes the button bigger, not the drawing. Then give the button a name with <code>aria-label</code> or visually hidden text, and hide the SVG from screen readers with <code>aria-hidden="true"</code>.</span>`)}
${p(`Many older answers say “44 px is the WCAG rule”. That number is real, but it is the strictest tier (AAA). In October 2023, WCAG 2.2 added a new level AA rule at 24 px with a spacing exception, and AA is the level most accessibility policies and audits aim for. Below are the real numbers, checked on the W3C, Apple and Android sites in November 2026, then the labelling markup and the <code>event.target</code> bug that trips up almost everyone who puts an SVG inside a button. For the gentler, non-code version, read our ${L.post('accessible-icons', 'guide to accessible icons')}.`)}

${h2('How big should an icon button be?')}
${table(['Guideline', 'Size', 'Where it applies', 'What kind of rule'], [
  ['WCAG 2.2, 2.5.8 Target Size (Minimum)', '<strong>24 x 24 CSS px</strong> (or spaced out)', 'Websites and web apps', 'Level AA: the level most teams aim for'],
  ['WCAG 2.2, 2.5.5 Target Size (Enhanced)', '<strong>44 x 44 CSS px</strong>', 'Websites and web apps', 'Level AAA: the stricter goal'],
  ['Apple HIG, iOS and iPadOS', '<strong>44 x 44 pt</strong> default, 28 x 28 pt minimum', 'iPhone and iPad apps', 'Design guidance'],
  ['Apple HIG, macOS', '28 x 28 pt default, 20 x 20 pt minimum', 'Mac apps (mouse and trackpad)', 'Design guidance'],
  ['Android and Material', '<strong>48 x 48 dp</strong> or larger (about 9 mm)', 'Android apps', 'Design guidance'],
], 'Touch and click target sizes, checked November 2026')}
${p('Points (pt) on Apple devices and density-independent pixels (dp) on Android are both “virtual” units that stay about the same physical size on any screen, much like CSS pixels on the web. So 44 CSS px, 44 pt and 48 dp are all roughly a fingertip.')}
${p('Our rule of thumb for the web: <strong>44 px for anything people tap on a phone, never below 24 px anywhere</strong>, and if a dense desktop toolbar needs small buttons, space them out (see the exception below). Apple also gives a hint about spacing: about 12 points of padding around controls with a visible shape, and about 24 points around ones without.')}

${h2('What does WCAG 2.2 actually require for target size?')}
${p('Criterion 2.5.8 says the target for a pointer (a mouse, finger or stylus) must be at least 24 by 24 CSS pixels, except in five cases:')}
${ul([
  '<strong>Spacing:</strong> a smaller target is fine if you can draw a 24 px circle centred on it and that circle does not touch another target or another small target’s circle.',
  '<strong>Equivalent:</strong> the same action is available from another control on the page that is big enough.',
  '<strong>Inline:</strong> the target is a link in a sentence, sized by the text around it.',
  '<strong>User agent control:</strong> the browser draws it and you have not restyled it (a default checkbox, for example).',
  '<strong>Essential:</strong> the exact size is essential or legally required, like pins on a map.',
])}
${art('m-icon-button-size-and-labels-spacing', 'The spacing exception: small targets pass when a 24 px circle around each one stays clear of its neighbours.', { brief: 'A clean technical diagram of two toolbars side by side, each with four 20 px icon buttons (with icons bold, italic, link and trash in line style). Left toolbar: buttons packed tightly, dashed 24 px circles overlapping, labelled “fails 2.5.8”. Right toolbar: same buttons with gaps, the dashed 24 px circles just touching nothing, labelled “passes: spacing”. A small ruler marks 24 px. Blueprint-like lines, short labels only.' })}
${p('The “target” is the area that responds to the click, not the visible drawing. A 20 px icon inside a button with 12 px of padding has a 44 px target, and that is what 2.5.8 measures. The stricter 2.5.5 (AAA) asks for 44 by 44 and drops the spacing exception.')}
${callout('note', '<p>44 px entered WCAG in version 2.1 (2018) as criterion 2.5.5, at level AAA, and many guides quoted it as “the” rule. WCAG 2.2 (October 2023) added 2.5.8 at AA with 24 px. Both numbers are correct; they just belong to different levels.</p>', 'Why so many pages say 44')}

${h2('How do I make the button bigger without making the icon bigger?')}
${p('Size the button, not the icon. Every with icons drawing is made on a 24 x 24 grid and stays crisp at 16, 20 or 24 px, so the icon can stay neat while padding gives fingers room.')}
${sizeRamp(['close', 'menu', 'search', 'settings'], [16, 20, 24, 32], 'line', 'The same icons at 16, 20, 24 and 32 px. For buttons, 20 to 24 px inside a 44 px hit area is the sweet spot.')}
${code(`.icon-btn {
  display: inline-grid;
  place-items: center;
  min-width: 44px;
  min-height: 44px;     /* the target */
  padding: 0;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: inherit;
}
.icon-btn svg { width: 20px; height: 20px; }   /* the drawing */
.icon-btn:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }`, 'css')}
${p(`Need a compact look? You can keep a 32 px visual button and grow only the clickable area with an invisible pseudo-element (<code>.icon-btn::after { content: ""; position: absolute; inset: -6px; }</code> on a <code>position: relative</code> button). Just make sure neighbouring hit areas do not overlap, or a tap may land on the wrong one. For glyph sizes everywhere else, our ${L.post('icon-sizes-guide', 'icon sizes guide')} has a full chart.`)}
${iconGrid(['menu', 'search', 'close', 'settings', 'more-horizontal', 'share', 'heart', 'trash'], 'solid', 'Icons that often appear with no text next to them. Every one of them needs a name on its button.')}

${h2('How do I label an icon-only button?')}
${p('A button with only an icon still needs a <strong>name</strong>: the word a screen reader says, such as “Close” or “Search”. Name it after what it does, not what it looks like (“Search”, not “magnifying glass”). There are three ways people try, and only two of them work well.')}
${table(['Method', 'Screen readers', 'Translation tools', 'Visible to sighted people', 'Verdict'], [
  ['<code>aria-label="Close"</code> on the button', yes(), meh('patchy, test it'), no(), yes('Good, short')],
  ['Visually hidden text inside the button', yes(), yes('real page text'), no(), yes('Best for multilingual sites')],
  ['<code>title="Close"</code> only', meh('inconsistent'), meh(), meh('mouse hover only'), no('Not a label')],
], 'Three ways to name an icon-only button (checked November 2026)')}
${code(`<!-- 1. aria-label -->
<button type="button" class="icon-btn" aria-label="Close">
  <svg aria-hidden="true" viewBox="0 0 24 24">…</svg>
</button>

<!-- 2. visually hidden text -->
<button type="button" class="icon-btn">
  <svg aria-hidden="true" viewBox="0 0 24 24">…</svg>
  <span class="visually-hidden">Close</span>
</button>`)}
${code(`.visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  margin: -1px; padding: 0; border: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}`, 'css')}
${p('Why not <code>title</code>? MDN calls the title attribute “highly problematic” for touch, keyboard and screen reader users, because browsers and assistive tools handle it inconsistently. A tooltip can be a nice extra for mouse users, but build it so it also shows on keyboard focus, and keep the real name in <code>aria-label</code> or hidden text.')}
${p('One more rule if the button <em>does</em> show a word, like a “Show” button next to a password: the hidden name must include that visible word (WCAG 2.5.3, Label in Name). “Show password” is fine; “Reveal secret” is not, because someone using voice control will say “click Show”.')}

${h2('Should the SVG inside the button have aria-hidden?')}
${p('Yes. Once the button has a name, the icon is decoration. Mark it <code>aria-hidden="true"</code> so a screen reader does not announce an extra “image” or read out a stray title. Two old habits you can drop:')}
${ul([
  '<strong><code>focusable="false"</code></strong> was a fix for Internet Explorer 11 and the old pre-Chromium Edge, which could put inline SVGs in the Tab order. It does no harm, but modern browsers do not need it.',
  '<strong><code>role="img"</code> with <code>&lt;title&gt;</code> inside a button</strong> names the picture, not the button, and may make a screen reader say both. Keep <code>role="img"</code> + a label for icons that stand alone and carry meaning, like a status icon in a table.',
])}
${p(`Our packages do this for you: React, Vue, Svelte, Angular and Solid components and the <code>&lt;with-icon&gt;</code> element render <code>aria-hidden="true"</code> unless you pass a <code>title</code> or <code>label</code>, and ${L.page('free/font-awesome-style-icon-classes.html', 'CSS-class icons')} are empty tags with nothing to read. Inside a labelled button, leave them decorative.`)}

${h2('Why is event.target the SVG instead of my button?')}
${p('This one confuses everyone once. You attach a click listener to a button, click it, and <code>event.target</code> is a <code>&lt;path&gt;</code> or <code>&lt;svg&gt;</code>. Your <code>event.target.dataset.id</code> is suddenly undefined.')}
${p('Nothing is broken. A click happens on the deepest element under the pointer, which is the icon’s shape, and then “bubbles” up to the button. <code>target</code> is where the click happened; <code>currentTarget</code> is the element your listener is attached to. Three fixes, from simplest:')}
${art('m-icon-button-size-and-labels-target', 'event.target is the shape you clicked; event.currentTarget is the button that owns the listener.', { brief: 'A layered cut-away of one button with the with icons trash icon in line style inside it. A cursor clicks the trash lid; a label on the path reads “event.target = <path>”. An upward bubbling arrow goes from the path through “<svg>” to the button outline, labelled “event.currentTarget = <button>”. On the side, a small green note: “svg { pointer-events: none }”. Clean diagram, short labels.' })}
${code(`// 1. Read the element the listener is on
button.addEventListener('click', (event) => {
  console.log(event.currentTarget.dataset.id)   // always the button
})

// 2. One listener for many buttons (event delegation)
toolbar.addEventListener('click', (event) => {
  const btn = event.target.closest('button')
  if (!btn) return
  console.log(btn.dataset.id)
})`, 'js')}
${code(`/* 3. Never let the icon be the target */
button svg { pointer-events: none; }`, 'css')}
${p('In React, write the handler on the button and read <code>event.currentTarget</code>; TypeScript then knows it is an <code>HTMLButtonElement</code>. One gotcha from MDN: <code>currentTarget</code> is only set while the handler runs. Log the event and look at it later, and it shows <code>null</code>.')}
${doDont('<p>Use a real <code>&lt;button&gt;</code>, give it a 44 px hit area on touch, name it with <code>aria-label</code> or hidden text, and hide the SVG with <code>aria-hidden="true"</code>.</p>', '<p>Make a 16 px clickable SVG, rely on <code>title</code> as the only name, or read <code>event.target</code> and hope the click landed on the button.</p>')}

${h2('The bottom line')}
${p(`Small icon, big button, clear name. Use 24 px as the floor, 44 px for touch, the platform’s own numbers in native apps, and a name on every icon-only button. Building a field with an eye or clear button? Our post on ${L.post('icon-inside-input-field', 'icons inside input fields')} puts these rules to work. Every icon on ${L.icons('with icons')} works this way, from ${L.icon('close')} to ${L.icon('menu')}, in the ${L.style('line')}, ${L.style('solid')} and ${L.style('duo')} styles made for interfaces.`)}
${cta('Icons for buttons that everyone can use', `${N_ICONS} free icons in ${N_STYLES} styles. Components hide icons from screen readers by default, so your button’s name is the one that counts.`, ['menu', 'search', 'close', 'settings', 'share', 'heart'])}
`,
}
